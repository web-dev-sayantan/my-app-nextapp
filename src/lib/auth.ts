import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { trackFailedLogin, logAudit } from "@/lib/roleUtils";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

type AuthenticatedUser = User & {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  isLocked: boolean;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase();
        const forwarded = req?.headers?.get?.("x-forwarded-for");
        const ipAddress = forwarded
          ? forwarded.split(",")[0].trim()
          : "unknown";
        const userAgent = req?.headers?.get?.("user-agent") || "unknown";

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
            isActive: true,
            isLocked: true,
            isDenied: true,
            accountLockedUntil: true,
          },
        });

        if (!user) {
          await trackFailedLogin(normalizedEmail, ipAddress, userAgent);
          return null;
        }

        if (user.isDenied) {
          return null;
        }

        if (user.isLocked) {
          if (
            user.accountLockedUntil &&
            new Date(user.accountLockedUntil) > new Date()
          ) {
            return null;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { isLocked: false, accountLockedUntil: null },
          });
        }

        if (!user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          await trackFailedLogin(normalizedEmail, ipAddress, userAgent);
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await logAudit(
          "USER_LOGIN",
          "USER",
          user.id,
          user.id,
          {},
          { ipAddress, userAgent },
        );

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          isLocked: false,
        } satisfies AuthenticatedUser;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.isActive = user.isActive;
        token.isLocked = user.isLocked;
        return token;
      }

      if (
        (!token.role ||
          token.isActive === undefined ||
          token.isLocked === undefined) &&
        token.id
      ) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isActive: true, isLocked: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
          token.isLocked = dbUser.isLocked;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.isLocked = token.isLocked;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
