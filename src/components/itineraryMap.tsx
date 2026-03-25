"use client";

import { useState } from "react";
import { FiMapPin, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Waypoint {
  day: number;
  location: string;
  altitude?: number;
  description?: string;
}

interface ItineraryMapProps {
  waypoints: Waypoint[];
  trekName: string;
}

export function ItineraryMap({ waypoints, trekName }: ItineraryMapProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Calculate map dimensions
  const maxAltitude = Math.max(...(waypoints.map((w) => w.altitude || 0) || [3000]));
  const mapHeight = 300;
  const mapWidth = 100;

  return (
    <section className="py-20 px-6 bg-linear-to-b from-gray-950 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Your Journey Map
        </h2>
        <p className="text-gray-400 mb-12">
          Visual representation of your trek route and daily progress
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
              <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-auto"
                style={{ minHeight: "400px" }}
              >
                {/* Grid Background */}
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="#333"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <linearGradient id="altitudeGradient">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Background */}
                <rect width={mapWidth} height={mapHeight} fill="#111827" />
                <rect
                  width={mapWidth}
                  height={mapHeight}
                  fill="url(#grid)"
                />

                {/* Altitude Line Chart */}
                {waypoints.length > 0 && (
                  <>
                    {/* Line Path */}
                    <polyline
                      points={waypoints
                        .map((wp) => {
                          const x = (wp.day / waypoints.length) * mapWidth;
                          const y =
                            mapHeight -
                            ((wp.altitude || 2000) / maxAltitude) * mapHeight;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="url(#altitudeGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Fill Area Under Line */}
                    <polygon
                      points={`0,${mapHeight} ${waypoints
                        .map((wp) => {
                          const x = (wp.day / waypoints.length) * mapWidth;
                          const y =
                            mapHeight -
                            ((wp.altitude || 2000) / maxAltitude) * mapHeight;
                          return `${x},${y}`;
                        })
                        .join(" ")} ${mapWidth},${mapHeight}`}
                      fill="url(#altitudeGradient)"
                      opacity="0.1"
                    />

                    {/* Data Points */}
                    {waypoints.map((wp) => {
                      const x = (wp.day / waypoints.length) * mapWidth;
                      const y =
                        mapHeight -
                        ((wp.altitude || 2000) / maxAltitude) * mapHeight;
                      return (
                        <circle
                          key={wp.day}
                          cx={x}
                          cy={y}
                          r="1.5"
                          fill="#60a5fa"
                          stroke="#fff"
                          strokeWidth="0.5"
                        />
                      );
                    })}
                  </>
                )}

                {/* Axis Labels */}
                <text
                  x="2"
                  y="15"
                  fontSize="10"
                  fill="#999"
                  className="font-mono"
                >
                  {(maxAltitude / 1000).toFixed(1)}k m
                </text>
                <text
                  x="2"
                  y={mapHeight - 5}
                  fontSize="10"
                  fill="#999"
                  className="font-mono"
                >
                  0 m
                </text>
                <text
                  x={mapWidth - 10}
                  y={mapHeight - 5}
                  fontSize="10"
                  fill="#999"
                  textAnchor="end"
                  className="font-mono"
                >
                  Day {waypoints.length}
                </text>
              </svg>
            </div>
          </div>

          {/* Waypoint List */}
          <div className="lg:col-span-1\">
            <h3 className="text-2xl font-bold mb-6 text-white\">Daily Breakdown</h3>
            <div className="space-y-2">
              {waypoints.map((waypoint) => (
                <div
                  key={waypoint.day}
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-400 transition"
                >
                  <button
                    onClick={() =>
                      setExpandedDay(
                        expandedDay === waypoint.day ? null : waypoint.day
                      )
                    }
                    className="w-full px-4 py-4 flex items-start justify-between hover:bg-gray-800 transition"
                  >
                    <div className="flex items-start gap-3 text-left flex-1">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {waypoint.day}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {waypoint.location}
                        </p>
                        {waypoint.altitude && (
                          <p className="text-xs text-gray-400 mt-1">
                            {waypoint.altitude.toLocaleString()} m
                          </p>
                        )}
                      </div>
                    </div>
                    {waypoint.description && (
                      <div className="shrink-0">
                        {expandedDay === waypoint.day ? (
                          <FiChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {expandedDay === waypoint.day && waypoint.description && (
                    <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 text-sm text-gray-300">
                      {waypoint.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h4 className="font-semibold text-white mb-4">Understanding the Map</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">🔵 Altitude Progression</p>
              <p className="text-sm text-gray-300">
                The colored line shows elevation changes throughout your trek
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">📍 Daily Camps</p>
              <p className="text-sm text-gray-300">
                Each numbered point represents your resting location for the day
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">📊 Difficulty Indicator</p>
              <p className="text-sm text-gray-300">
                Color intensifies with altitude - steeper climbs ahead
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
