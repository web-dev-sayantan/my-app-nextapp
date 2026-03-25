"use client";

import { useState } from "react";

interface ProfileUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

interface ProfileBooking {
  id: string;
  departureId: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  contactName: string;
  contactPhone: string;
  createdAt: Date;
}

type ProfileFormData = Partial<ProfileUser>;

export default function ProfileClient({
  initialProfile,
  initialBookings,
}: {
  initialProfile: ProfileUser;
  initialBookings: ProfileBooking[];
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [bookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<ProfileFormData>(initialProfile);

  const handleUpdateProfile = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.user);
      setEditData(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account and bookings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(["profile", "bookings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Information
              </h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    void handleUpdateProfile();
                    return;
                  }

                  setIsEditing(true);
                }}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                  isEditing
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email || ""}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editData.username || ""}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editData.firstName || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, firstName: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editData.lastName || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, lastName: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editData.phoneNumber || ""}
                  onChange={(event) =>
                    setEditData({
                      ...editData,
                      phoneNumber: event.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editData.address || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, address: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={editData.city || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, city: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={editData.state || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, state: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={editData.pincode || ""}
                  onChange={(event) =>
                    setEditData({ ...editData, pincode: event.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:opacity-50"
                />
              </div>

              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(profile);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Bookings
              </h2>
            </div>

            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                <p>No bookings yet. Start booking your next trek!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Booking #{booking.id.slice(0, 8)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : booking.status === "PENDING"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                          Travelers
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {booking.numberOfPeople}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                          Total Amount
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          ₹{(booking.totalAmount / 100).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                          Name
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {booking.contactName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                          Phone
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {booking.contactPhone}
                        </p>
                      </div>
                    </div>

                    {booking.status !== "CANCELLED" && (
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                          Edit Booking
                        </button>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
