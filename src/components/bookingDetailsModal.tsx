"use client";

import { useState } from "react";
import {
  FiX,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiCreditCard,
} from "react-icons/fi";

export interface BookingDetails {
  id: string;
  numberOfPeople: number;
  totalAmount: number;
  departure: {
    startDate: Date;
    endDate: Date;
    trek: {
      name: string;
      state: string;
    };
  };
}

interface BookingDetailsModalProps {
  booking: BookingDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "travellers" | "form">(
    "details",
  );
  const [formData, setFormData] = useState({
    treksDone: "",
    medicalConditions: "",
    bloodGroup: "",
    birthDate: "",
    foodPreference: "",
    allergies: "",
  });

  // Safety check: return null if modal shouldn't show
  if (!isOpen || !booking || !booking.departure) {
    return null;
  }

  const trek = booking.departure?.trek;
  const departure = booking.departure;

  if (!trek || !departure) {
    return null;
  }

  const startDate = new Date(departure.startDate).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endDate = new Date(departure.endDate).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your details have been saved successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">{trek.name}</h2>
            <p className="text-gray-400 mt-1">Booking Details & Information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-8 bg-gray-800/50">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "details"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Booking Details
          </button>
          <button
            onClick={() => setActiveTab("travellers")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "travellers"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Travellers
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "form"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Additional Info
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Booking Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiCalendar className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">
                      Trek Dates
                    </h3>
                  </div>
                  <p className="text-white font-semibold">
                    {startDate} to {endDate}
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiMapPin className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">
                      Location
                    </h3>
                  </div>
                  <p className="text-white font-semibold">{trek.state}</p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiUsers className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">
                      Participants
                    </h3>
                  </div>
                  <p className="text-white font-semibold">
                    {booking.numberOfPeople} Person
                    {booking.numberOfPeople !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiCreditCard className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">
                      Total Amount
                    </h3>
                  </div>
                  <p className="text-white font-semibold">
                    ₹{(booking.totalAmount / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* How to Prepare Section */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  How to Prepare for Your Trek
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-2">
                      Physical Fitness
                    </h4>
                    <p className="text-gray-300">
                      Start preparing 4-6 weeks before your trek. Include cardio
                      exercises, strength training, and daily walks to build
                      endurance.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-2">
                      Essential Gear
                    </h4>
                    <p className="text-gray-300">
                      Trek shoes, warm clothing, backpack (45L), sleeping bag,
                      trekking poles, and personal toiletries.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-2">
                      Health Precautions
                    </h4>
                    <p className="text-gray-300">
                      Get a medical checkup, consider vaccinations, carry
                      prescribed medicines, and stay hydrated throughout the
                      trek.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Travellers Tab */}
          {activeTab === "travellers" && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  Primary Guest (Booking Owner)
                </h3>
                <p className="text-gray-300">
                  You will be the primary guest and main contact for this
                  booking.
                </p>
              </div>

              {booking.numberOfPeople > 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Other Participants
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Add details for {booking.numberOfPeople - 1} more person
                    {booking.numberOfPeople - 1 !== 1 ? "s" : ""}:
                  </p>
                  {Array.from({ length: booking.numberOfPeople - 1 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 space-y-4"
                      >
                        <h4 className="font-semibold text-white">
                          Participant {idx + 2}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
                          />
                          <input
                            type="date"
                            placeholder="Birth Date"
                            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* Additional Information Form Tab */}
          {activeTab === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
                <h3 className="text-yellow-300 font-semibold mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-300 text-sm">
                  Help us understand your trekking experience and health
                  requirements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Blood Group <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Birth Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Treks Already Done
                  </label>
                  <textarea
                    value={formData.treksDone}
                    onChange={(e) =>
                      setFormData({ ...formData, treksDone: e.target.value })
                    }
                    placeholder="List any previous trekking experience..."
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 h-24"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicalConditions: e.target.value,
                      })
                    }
                    placeholder="Any medical conditions we should know about..."
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Food Preference
                  </label>
                  <select
                    value={formData.foodPreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        foodPreference: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                  >
                    <option value="">Select Food Preference</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Allergies
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    placeholder="List any food or other allergies..."
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Save Information
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
