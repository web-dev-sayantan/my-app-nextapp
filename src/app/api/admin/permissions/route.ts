import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

type PermissionRoleMap = Partial<Record<UserRole, boolean>>;
type PermissionDefaults = Record<string, Record<string, PermissionRoleMap>>;

const validRoles: UserRole[] = [
  "ADMIN",
  "MODERATOR",
  "USER",
  "SUPER_ADMIN",
  "TREK_LEADER",
];

function parseUserRole(role: unknown): UserRole | null {
  if (typeof role !== "string") {
    return null;
  }

  return validRoles.includes(role as UserRole) ? (role as UserRole) : null;
}

const DEFAULT_PERMISSIONS: PermissionDefaults = {
  DASHBOARD: {
    VIEW_DASHBOARD: { ADMIN: true, MODERATOR: true },
    VIEW_OVERVIEW_STATS: { ADMIN: true, MODERATOR: true },
  },
  TREKS: {
    VIEW_TREKS: { ADMIN: true, MODERATOR: true },
    CREATE_TREK: { ADMIN: true, MODERATOR: false },
    EDIT_TREK: { ADMIN: true, MODERATOR: false },
    DELETE_TREK: { ADMIN: true, MODERATOR: false },
    MANAGE_DEPARTURES: { ADMIN: true, MODERATOR: false },
    ASSIGN_TREK_LEADER: { ADMIN: true, MODERATOR: false },
  },
  PARTICIPANTS: {
    VIEW_PARTICIPANTS: { ADMIN: true, MODERATOR: true },
    VIEW_MEDICAL_FORMS: { ADMIN: true, MODERATOR: true },
    VERIFY_ID: { ADMIN: true, MODERATOR: true },
    MANAGE_WAIVERS: { ADMIN: true, MODERATOR: true },
  },
  FINANCE: {
    VIEW_FINANCE: { ADMIN: true, MODERATOR: false },
    VIEW_PAYMENTS: { ADMIN: true, MODERATOR: false },
    PROCESS_PAYOUTS: { ADMIN: true, MODERATOR: false },
    VIEW_GST: { ADMIN: true, MODERATOR: false },
  },
  MARKETING: {
    VIEW_MARKETING: { ADMIN: true, MODERATOR: false },
    EDIT_MARKETING_METRICS: { ADMIN: true, MODERATOR: false },
  },
  REVIEWS: {
    VIEW_REVIEWS: { ADMIN: true, MODERATOR: true },
    MODERATE_REVIEWS: { ADMIN: true, MODERATOR: true },
  },
  USERS: {
    VIEW_USERS: { ADMIN: true, MODERATOR: false },
    CREATE_USERS: { ADMIN: true, MODERATOR: false },
    EDIT_USERS: { ADMIN: true, MODERATOR: false },
    DELETE_USERS: { ADMIN: true, MODERATOR: false },
    MANAGE_ROLES: { ADMIN: false, MODERATOR: false },
    VIEW_AUDIT_LOGS: { ADMIN: true, MODERATOR: false },
  },
};

export async function GET() {
  const { response } = await requireApiRole("SUPER_ADMIN");

  if (response) {
    return response;
  }

  try {
    const permissions = await prisma.adminPermission.findMany({
      include: {
        RolePermission: true,
      },
      orderBy: [{ category: "asc" }, { permission: "asc" }],
    });

    const grouped = permissions.reduce<
      Record<
        string,
        Array<{
          id: string;
          permission: string;
          category: string;
          description: string | null;
          roles: PermissionRoleMap;
        }>
      >
    >((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }

      acc[permission.category].push({
        id: permission.id,
        permission: permission.permission,
        category: permission.category,
        description: permission.description,
        roles: permission.RolePermission.reduce<PermissionRoleMap>(
          (roleMap, rolePermission) => {
            roleMap[rolePermission.role] = rolePermission.isEnabled;
            return roleMap;
          },
          {},
        ),
      });

      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      permissions: grouped,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 },
    );
  }
}

export async function POST() {
  const { response } = await requireApiRole("SUPER_ADMIN");

  if (response) {
    return response;
  }

  try {
    const existing = await prisma.adminPermission.count();
    if (existing > 0) {
      return NextResponse.json({
        message: "Permissions already initialized",
      });
    }

    const createdPermissions = [];

    for (const [category, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
      for (const [permission, roles] of Object.entries(permissions)) {
        const created = await prisma.adminPermission.create({
          data: {
            id: permission,
            permission,
            category,
            description: `${permission} - ${category}`,
            updatedAt: new Date(),
          },
        });

        createdPermissions.push(created);

        for (const [role, isEnabled] of Object.entries(roles)) {
          await prisma.rolePermission.create({
            data: {
              id: `${created.id}:${role}`,
              permissionId: created.id,
              role: role as UserRole,
              isEnabled: Boolean(isEnabled),
              updatedAt: new Date(),
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Permissions initialized successfully",
      count: createdPermissions.length,
    });
  } catch (error) {
    console.error("Error initializing permissions:", error);
    return NextResponse.json(
      { error: "Failed to initialize permissions" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const { response } = await requireApiRole("SUPER_ADMIN");

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { role: rawRole, permissions } = body;

    const role = parseUserRole(rawRole);
    if (
      !role ||
      !permissions ||
      typeof permissions !== "object" ||
      Array.isArray(permissions)
    ) {
      return NextResponse.json(
        { error: "Role and permissions are required" },
        { status: 400 },
      );
    }

    for (const [permission, isEnabled] of Object.entries(
      permissions as Record<string, unknown>,
    )) {
      const existingPermission = await prisma.adminPermission.findUnique({
        where: { permission },
      });

      if (!existingPermission) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          permissionId_role: {
            permissionId: existingPermission.id,
            role,
          },
        },
        update: {
          isEnabled: Boolean(isEnabled),
          updatedAt: new Date(),
        },
        create: {
          id: `${existingPermission.id}:${role}`,
          permissionId: existingPermission.id,
          role,
          isEnabled: Boolean(isEnabled),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Permissions updated successfully",
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 },
    );
  }
}
