"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { UserRole } from "@prisma/client";

export interface AdminUserRecord {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  isDenied: boolean;
  accountLockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

type EditableRole = UserRole;

function canManageUser(
  currentUserRole: UserRole,
  currentUserId: string,
  targetUser: AdminUserRecord,
) {
  if (targetUser.id === currentUserId) {
    return false;
  }

  if (currentUserRole === "SUPER_ADMIN") {
    return true;
  }

  return (
    currentUserRole === "ADMIN" &&
    (targetUser.role === "MODERATOR" || targetUser.role === "USER")
  );
}

export default function AdminClient({
  initialUsers,
  currentUserId,
  currentUserRole,
}: {
  initialUsers: AdminUserRecord[];
  currentUserId: string;
  currentUserRole: UserRole;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "users" | "audit-logs" | "settings"
  >("users");
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<EditableRole>("USER");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unlock`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to unlock account");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Error unlocking account:", error);
      alert("Failed to unlock account");
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user status");
    }
  };

  const handleToggleDenyAccess = async (userId: string, isDenied: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deny: !isDenied }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update access");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Error toggling deny access:", error);
      alert(error instanceof Error ? error.message : "Failed to update access");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage users, roles, and system settings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          {["users", "audit-logs", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Users
              </h2>
              {(currentUserRole === "ADMIN" ||
                currentUserRole === "SUPER_ADMIN") && (
                <div className="flex gap-2">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Add User
                  </button>
                  <button className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                    IP Restrictions
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Refreshing users...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                        User
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.firstName || ""} {user.lastName || ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : user.role === "MODERATOR"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : user.role === "SUPER_ADMIN"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {user.isDenied && (
                              <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                Denied
                              </span>
                            )}
                            {user.isLocked && (
                              <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                Locked
                              </span>
                            )}
                            {!user.isActive && (
                              <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                                Inactive
                              </span>
                            )}
                            {user.isActive &&
                              !user.isLocked &&
                              !user.isDenied && (
                                <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  Active
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400">
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-nowrap items-center justify-center gap-1 overflow-x-auto">
                            {canManageUser(
                              currentUserRole,
                              currentUserId,
                              user,
                            ) && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setEditRole(user.role);
                                    setIsModalOpen(true);
                                  }}
                                  className="whitespace-nowrap rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                >
                                  Edit Role
                                </button>
                                {user.isLocked && (
                                  <button
                                    onClick={() => handleUnlockAccount(user.id)}
                                    className="whitespace-nowrap rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                                  >
                                    Unlock
                                  </button>
                                )}
                                {(currentUserRole === "ADMIN" ||
                                  currentUserRole === "SUPER_ADMIN") &&
                                  user.id !== currentUserId && (
                                    <button
                                      onClick={async () => {
                                        if (
                                          !confirm(
                                            "Reset password for this user? This will set a temporary password.",
                                          )
                                        ) {
                                          return;
                                        }

                                        try {
                                          const response = await fetch(
                                            `/api/admin/users/${user.id}/reset`,
                                            { method: "POST" },
                                          );
                                          if (!response.ok) {
                                            throw new Error("Failed");
                                          }
                                          alert(
                                            "Password reset — temporary password set.",
                                          );
                                        } catch (error) {
                                          console.error(error);
                                          alert("Failed to reset password");
                                        }
                                      }}
                                      className="whitespace-nowrap rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                    >
                                      Reset Pwd
                                    </button>
                                  )}
                                <button
                                  onClick={() =>
                                    handleToggleActive(user.id, user.isActive)
                                  }
                                  className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${user.isActive ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"}`}
                                >
                                  {user.isActive ? "Deactivate" : "Activate"}
                                </button>
                              </>
                            )}
                            {currentUserRole === "SUPER_ADMIN" &&
                              user.id !== currentUserId && (
                                <button
                                  onClick={() =>
                                    handleToggleDenyAccess(
                                      user.id,
                                      user.isDenied,
                                    )
                                  }
                                  className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${user.isDenied ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"}`}
                                >
                                  {user.isDenied ? "Allow" : "Deny"}
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "audit-logs" && (
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Audit Logs
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Recent failed login attempts
            </p>
            <LoginAttempts />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              System Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Update Role for {selectedUser.username}
            </h3>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role
              </label>
              <select
                value={editRole}
                onChange={(event) =>
                  setEditRole(event.target.value as EditableRole)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="USER">User</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
                <option
                  value="SUPER_ADMIN"
                  disabled={currentUserRole !== "SUPER_ADMIN"}
                >
                  Super Admin
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LoginAttempts = dynamic(() => import("./login-attempts-client"), {
  ssr: false,
});
