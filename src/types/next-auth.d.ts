import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      isActive: boolean;
      isLocked: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: UserRole;
    isActive: boolean;
    isLocked: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: UserRole;
    isActive: boolean;
    isLocked: boolean;
  }
}
