import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  role: true,
} as const;

// GET user profile
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: profileSelect,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// UPDATE user profile
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { firstName, lastName, phoneNumber, address, city, state, pincode } =
      await request.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phoneNumber: phoneNumber || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined,
      },
      select: profileSelect,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
