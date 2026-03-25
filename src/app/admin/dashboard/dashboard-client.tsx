"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@prisma/client";
import type { DashboardStats } from "@/lib/adminDashboard";

interface Trek {
  id: string;
  name: string;
  slug: string;
  state: string;
  difficulty: string;
  basePrice: number;
  departures: {
    id: string;
    startDate: string;
    endDate: string;
    totalSeats: number;
    seatsAvailable: number;
    waitlistCount: number;
    status: string;
    trekLeader?: {
      firstName: string;
      lastName: string;
    };
  }[];
}

interface Participant {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  medicalFormSubmitted: boolean;
  idVerified: boolean;
  waiverSigned: boolean;
  isRepeatTrekker: boolean;
  departure: {
    startDate: string;
    trek: {
      name: string;
    };
  };
  payment?: {
    status: string;
    amount: number;
    paymentMethod?: string;
  };
}

interface FinanceData {
  totalRevenue: number;
  advanceCollected: number;
  balancePending: number;
  gstCollected: number;
  paymentMethodSplit: { method: string; amount: number; count: number }[];
  trekLeaderPayouts: {
    pending: number;
    paid: number;
    pendingCount: number;
    paidCount: number;
  };
}

interface MarketingData {
  websiteVisitors: number;
  conversionRate: number;
  instagramClicks: number;
  repeatCustomerPercent: number;
  referralBookings: number;
  topTreks: { trekName: string; bookingCount: number; revenue: number }[];
}

export default function AdminDashboardClient({
  initialRole,
  initialStats,
}: {
  initialRole: UserRole;
  initialStats: DashboardStats;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(initialStats);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [finance, setFinance] = useState<FinanceData | null>(null);
  const [marketing, setMarketing] = useState<MarketingData | null>(null);

  useEffect(() => {
    if (activeTab === "overview") {
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);

      try {
        if (activeTab === "treks") {
          const response = await fetch("/api/admin/treks", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setTreks(data.treks || []);
          }
        } else if (activeTab === "participants") {
          const response = await fetch("/api/admin/participants", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setParticipants(data.participants || []);
          }
        } else if (activeTab === "finance") {
          const response = await fetch("/api/admin/finance", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setFinance(data.data);
          }
        } else if (activeTab === "marketing") {
          const response = await fetch("/api/admin/marketing", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setMarketing(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, [activeTab]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "OPEN":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
      case "FULL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canViewFinance =
    initialRole === "SUPER_ADMIN" || initialRole === "ADMIN";
  const canViewMarketing =
    initialRole === "SUPER_ADMIN" || initialRole === "ADMIN";
  const canManageTreks =
    initialRole === "SUPER_ADMIN" || initialRole === "ADMIN";
  const canManageUsers = initialRole === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <span className="ml-3 rounded-sm bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {initialRole}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                Go to User Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "overview" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
            >
              Quick Overview
            </button>
            <button
              onClick={() => setActiveTab("treks")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "treks" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
            >
              Trek Management
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "participants" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
            >
              Participants
            </button>
            {canViewFinance && (
              <button
                onClick={() => setActiveTab("finance")}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "finance" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                Finance
              </button>
            )}
            {canViewMarketing && (
              <button
                onClick={() => setActiveTab("marketing")}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "marketing" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                Marketing
              </button>
            )}
            {canManageUsers && (
              <button
                onClick={() => setActiveTab("users")}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "users" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                Users
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && stats && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Total Bookings (This Month)
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.totalBookingsThisMonth}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Revenue (This Month)
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {formatCurrency(stats.revenueThisMonth)}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Upcoming Treks (Next 30 days)
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.upcomingTreksNext30Days}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Occupancy Rate
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.occupancyRate}%
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    of total capacity filled
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Cancellation Rate
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.cancellationRate}%
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Refund Pending
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {formatCurrency(stats.refundPending)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "treks" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Trek Management</h2>
                  {canManageTreks && (
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                      Add New Trek
                    </button>
                  )}
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Trek Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          State
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Departures
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {treks.map((trek) => (
                        <tr key={trek.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trek.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trek.slug}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {trek.state}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`rounded-sm px-2 py-1 text-xs font-medium ${trek.difficulty === "EASY" ? "bg-green-100 text-green-800" : trek.difficulty === "MODERATE" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                            >
                              {trek.difficulty}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatCurrency(trek.basePrice)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {trek.departures?.length || 0} upcoming
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <button className="mr-3 text-blue-600 hover:text-blue-900">
                              Edit
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Participant Management
                  </h2>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Trek
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Medical
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          ID Verified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Waiver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {participants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {participant.contactName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participant.contactEmail}
                            </div>
                            {participant.isRepeatTrekker && (
                              <span className="mt-1 inline-flex items-center rounded-sm bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                                Repeat Trekker
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {participant.departure?.trek?.name || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`rounded-sm px-2 py-1 text-xs font-medium ${getStatusColor(participant.status)}`}
                            >
                              {participant.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {participant.medicalFormSubmitted ? (
                              <span className="text-green-600">
                                ✓ Submitted
                              </span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {participant.idVerified ? (
                              <span className="text-green-600">✓ Verified</span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {participant.waiverSigned ? (
                              <span className="text-green-600">✓ Signed</span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`rounded-sm px-2 py-1 text-xs font-medium ${getStatusColor(participant.payment?.status || "PENDING")}`}
                            >
                              {participant.payment?.status || "PENDING"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "finance" && finance && canViewFinance && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">Finance Overview</h2>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {formatCurrency(finance.totalRevenue)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Advance Collected
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {formatCurrency(finance.advanceCollected)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Balance Pending
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {formatCurrency(finance.balancePending)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      GST Collected
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {formatCurrency(finance.gstCollected)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium">
                      Payment Method Split
                    </h3>
                    {finance.paymentMethodSplit.map((method) => (
                      <div
                        key={method.method}
                        className="flex justify-between border-b py-2"
                      >
                        <span className="text-gray-600">
                          {method.method || "Unknown"}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(method.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium">
                      Trek Leader Payouts
                    </h3>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {formatCurrency(finance.trekLeaderPayouts.pending)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Paid</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(finance.trekLeaderPayouts.paid)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "marketing" && marketing && canViewMarketing && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">
                  Marketing Metrics
                </h2>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Website Visitors
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {marketing.websiteVisitors}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Conversion Rate
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {marketing.conversionRate}%
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Instagram Clicks
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {marketing.instagramClicks}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Repeat Customer %
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {marketing.repeatCustomerPercent}%
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">
                      Referral Bookings
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                      {marketing.referralBookings}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-medium">
                    Top Performing Treks
                  </h3>
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium uppercase text-gray-500">
                          Trek Name
                        </th>
                        <th className="text-right text-xs font-medium uppercase text-gray-500">
                          Bookings
                        </th>
                        <th className="text-right text-xs font-medium uppercase text-gray-500">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketing.topTreks.map((trek, index) => (
                        <tr
                          key={`${trek.trekName}-${index}`}
                          className="border-t"
                        >
                          <td className="py-3">{trek.trekName}</td>
                          <td className="py-3 text-right">
                            {trek.bookingCount}
                          </td>
                          <td className="py-3 text-right">
                            {formatCurrency(trek.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "users" && canManageUsers && (
              <div>
                <h2 className="mb-6 text-xl font-semibold">User Management</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <p className="text-gray-600">
                    User management features are available in the main admin
                    panel.
                  </p>
                  <button
                    onClick={() => router.push("/admin")}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Go to User Management
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
