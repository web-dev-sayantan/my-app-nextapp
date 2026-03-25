import { NextResponse } from 'next/server';
import { checkUserRole, logAudit, unlockUserAccount } from '@/lib/roleUtils';
import { prisma } from '@/lib/prisma';

// GET a specific user
export async function GET(request: Request, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { authorized } = await checkUserRole('ADMIN');

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isLocked: true,
        isDenied: true,
        accountLockedUntil: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// UPDATE user (admin only)
export async function PATCH(request: Request, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { authorized, user: adminUser } = await checkUserRole('ADMIN');

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { role, isActive, firstName, lastName, phoneNumber } = await request.json();

    const existingUser = await (prisma as any).user.findUnique({
      where: { id: params.userId },
      select: { id: true, role: true, isActive: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admins from modifying themselves
    if (existingUser.id === adminUser.id) {
      return NextResponse.json({ error: 'Cannot perform this action on yourself' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    const changedFields: Record<string, any> = {};

    if (role && role !== existingUser.role) {
      updateData.role = role;
      changedFields.role = { from: existingUser.role, to: role };
    }

    if (isActive !== undefined && isActive !== existingUser.isActive) {
      updateData.isActive = isActive;
      changedFields.isActive = { from: existingUser.isActive, to: isActive };
    }

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const updatedUser = await (prisma as any).user.update({
      where: { id: params.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (Object.keys(changedFields).length > 0) {
      await logAudit(
        'USER_UPDATED',
        'USER',
        params.userId,
        adminUser.id,
        changedFields
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
export async function DELETE(request: Request, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { authorized, user: adminUser } = await checkUserRole('ADMIN');

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: params.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admins from deleting (deactivating) themselves
    if (user.id === adminUser.id) {
      return NextResponse.json({ error: 'Cannot perform this action on yourself' }, { status: 400 });
    }

    // Soft delete by deactivating
    await (prisma as any).user.update({
      where: { id: params.userId },
      data: { isActive: false }
    });

    await logAudit(
      'USER_DEACTIVATED',
      'USER',
      params.userId,
      adminUser.id,
      { email: user.email }
    );

    return NextResponse.json({ success: true, message: 'User deactivated' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
