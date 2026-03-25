import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

const guides = [
  {
    id: 1,
    title: "Essential Trekking Gear Guide",
    description:
      "Complete guide on what to pack and bring for a successful trek",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    category: "Gear",
  },
  {
    id: 2,
    title: "Physical Fitness Preparation",
    description:
      "Training routines and fitness tips to prepare for challenging treks",
    image:
      "https://images.unsplash.com/photo-1538805060238-78d695f0a3d7?w=800&h=400&fit=crop",
    category: "Training",
  },
  {
    id: 3,
    title: "Altitude Acclimatization Tips",
    description:
      "Learn how to acclimatize to high altitude and avoid altitude sickness",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    category: "Health",
  },
  {
    id: 4,
    title: "Nutrition and Hydration Guide",
    description:
      "Best practices for maintaining energy and hydration during long treks",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
    category: "Nutrition",
  },
  {
    id: 5,
    title: "Weather and Seasonal Trekking",
    description:
      "Understanding weather patterns and choosing the best season for your trek",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    category: "Planning",
  },
  {
    id: 6,
    title: "Safety During Treks",
    description:
      "Essential safety protocols and emergency procedures for trekking",
    image:
      "https://images.unsplash.com/photo-1551632440-a85aef2f62d0?w=800&h=400&fit=crop",
    category: "Safety",
  },
];

export default function TrekkingGuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="px-4 py-12 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
          >
            <FiArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Trekking Guides</h1>
          <p className="text-xl text-gray-400">
            Everything you need to know to become a better trekker
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="group border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {guide.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition">
                    {guide.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{guide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Additional Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg p-8">
                <div className="text-4xl font-bold mb-4">50+</div>
                <h3 className="text-xl font-bold mb-2">Detailed Trek Routes</h3>
                <p className="text-blue-100">
                  Comprehensive guides for 50+ treks with difficulty ratings and
                  maps
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-lg p-8">
                <div className="text-4xl font-bold mb-4">1000+</div>
                <h3 className="text-xl font-bold mb-2">Happy Trekkers</h3>
                <p className="text-green-100">
                  Join thousands of satisfied adventurers who have explored with
                  us
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg p-8">
                <div className="text-4xl font-bold mb-4">24/7</div>
                <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                <p className="text-purple-100">
                  Round-the-clock support from experienced trek guides and
                  coordinators
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to start your adventure?
              </h2>
              <p className="text-lg text-gray-100 mb-8">
                Explore our curated collection of treks and find your perfect
                adventure
              </p>
              <Link
                href="/all"
                className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Explore Treks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
