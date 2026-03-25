import { NextResponse } from 'next/server';
import { checkUserRole, logAudit } from '@/lib/roleUtils';
import { prisma } from '@/lib/prisma';

// POST: Toggle deny access (Super Admin only)
export async function POST(request: Request, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { authorized, user: adminUser } = await checkUserRole('ADMIN');

  if (!authorized || !adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Only Super Admin can deny/allow access
  const session = await (await import('next-auth')).getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const currentUser = await (prisma as any).user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only Super Admin can deny/allow access' }, { status: 403 });
  }

  try {
    const { deny } = await request.json();

    const existingUser = await (prisma as any).user.findUnique({
      where: { id: params.userId },
      select: { id: true, username: true, isDenied: true, role: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent acting on self
    if (existingUser.id === adminUser.id) {
      return NextResponse.json({ error: 'Cannot perform this action on yourself' }, { status: 400 });
    }

    // Prevent denying other Super Admins
    if (deny && existingUser.role === 'SUPER_ADMIN' && existingUser.id !== adminUser.id) {
      return NextResponse.json(
        { error: 'Cannot deny access to another Super Admin' },
        { status: 403 }
      );
    }

    const updatedUser = await (prisma as any).user.update({
      where: { id: params.userId },
      data: { isDenied: deny }
    });

    // Log the action
    await logAudit(
      deny ? 'DENY_ACCESS' : 'ALLOW_ACCESS',
      'User',
      params.userId,
      adminUser.id,
      { isDenied: { from: existingUser.isDenied, to: deny } },
      { targetUsername: existingUser.username }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        isDenied: updatedUser.isDenied
      }
    });
  } catch (error) {
    console.error('Error toggling deny access:', error);
    return NextResponse.json(
      { error: 'Failed to toggle deny access' },
      { status: 500 }
    );
  }
}
