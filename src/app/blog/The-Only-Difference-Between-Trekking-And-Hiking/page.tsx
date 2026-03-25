"use client";

import React, { useState, useEffect } from 'react';

const HikingTrekkingGuide = () => {
  const [scrollY, setScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / scrollHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

 

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/thetrail/image/upload/g_auto,c_fill,ar_4:5,c_auto/v1720152200/Beas-Kund-Trek/seven_sisters_beas_kund.jpg')",
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xs rounded-full mb-8 border border-white/20">
            <span className="text-sm font-medium tracking-wider">COMPLETE GUIDE 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            Hiking vs<br />
            <span className="text-gray-300">Trekking</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            The ultimate guide to understanding the differences between hiking and trekking. 
            Discover their origins, modern usage, and which one suits your adventure style.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300 mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>By Pritam Bera</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Updated June 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>12 min read</span>
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('introduction')}
            className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Start Reading
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What You'll Discover</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about hiking vs trekking, from historical origins to modern applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Historical Origins", desc: "Etymology and linguistic roots", time: "3 min" },
              { title: "Regional Differences", desc: "How meanings vary globally", time: "2 min" },
              { title: "Activity Comparison", desc: "Practical differences today", time: "4 min" },
              { title: "Choosing Guide", desc: "Which suits your style", time: "3 min" }
            ].map((item, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-xs border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-black rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{item.time} READ</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section id="introduction" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8">The Great Debate</h2>
            <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-12 rounded-3xl mb-12">
              <p className="text-2xl leading-relaxed text-gray-800 mb-0 font-light">
                "On a Saturday evening, over drinks, the words 'Hiking' and 'Trekking' can spark heated debates 
                between even the most respected members of adventure communities worldwide."
              </p>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-700 mb-8">
              This isn't just about semantics—it's about understanding two activities that have shaped outdoor recreation 
              for centuries. While many use these terms interchangeably today, their origins tell fascinating stories 
              of human migration, exploration, and our eternal quest for adventure.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-12">
              Rather than relying on modern opinions, let's dive deep into their etymological roots, trace their 
              evolution through history, and understand how these words have transformed and merged over time to 
              create today's outdoor vocabulary.
            </p>
          </div>
        </div>
      </section>

      {/* Etymology Section */}
      <section id="etymology" className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-8">Etymology Deep Dive</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Understanding the true origins of these words reveals their fundamental differences
            </p>
          </div>

          {/* Trekking Etymology */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-bold mb-8">Trekking</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-white pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Old Dutch: "Trekkan"</h4>
                    <p className="text-gray-400">Meaning: To pull or drag</p>
                  </div>
                  <div className="border-l-4 border-gray-600 pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Proto-Germanic: "Trekana"</h4>
                    <p className="text-gray-400">Root meaning: Pulling, drawing</p>
                  </div>
                  <div className="border-l-4 border-gray-700 pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Afrikaans: "Trekken"</h4>
                    <p className="text-gray-400">19th century: Migration by ox wagon</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-8 rounded-3xl">
                <img 
                  src="https://i.pinimg.com/564x/82/5d/11/825d114ba8a81b73f6a082fa39cd1bf9.jpg" 
                  alt="Historical ox wagon transport showing trekking origins"
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <h4 className="font-bold text-lg mb-3">Historical Context</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The Dutch settlers in South Africa used ox wagons for their "Great Trek" - 
                  massive migrations across the continent. This established trekking as fundamentally 
                  about purposeful, long-distance movement.
                </p>
              </div>
            </div>
          </div>

          {/* Hiking Etymology */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gray-900 p-8 rounded-3xl order-2 lg:order-1">
                <img 
                  src="https://foresthistory.org/wp-content/uploads/2017/01/Views34_th-1.jpg" 
                  alt="Family hiking in 1925"
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <div className="bg-gray-800 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-3 text-gray-300">John Muir's Opposition</h4>
                  <blockquote className="text-gray-300 text-sm italic">
                    "I don't like either the word or the thing. People ought to saunter in the mountains - not 'hike!'"
                  </blockquote>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h3 className="text-4xl font-bold mb-8">Hiking</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-white pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Middle English: "Hichhen"</h4>
                    <p className="text-gray-400">Meaning: To move, to jerk</p>
                  </div>
                  <div className="border-l-4 border-gray-600 pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Alternative: "Hyke"</h4>
                    <p className="text-gray-400">Meaning: To walk vigorously</p>
                  </div>
                  <div className="border-l-4 border-gray-700 pl-6">
                    <h4 className="text-xl font-semibold mb-2 text-gray-300">Modern Usage</h4>
                    <p className="text-gray-400">Late 1800s - WWI era popularization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-900 p-12 rounded-3xl">
            <h3 className="text-3xl font-bold mb-12 text-center">Historical Timeline</h3>
            <div className="space-y-8">
              {[
                { period: "Medieval Times", event: "Middle English 'hichhen' and 'hyke' emerge", side: "hiking" },
                { period: "1600s-1700s", event: "Dutch 'trekkan' evolves in colonial contexts", side: "trekking" },
                { period: "1830s-1840s", event: "Great Trek establishes 'trekking' as migration", side: "trekking" },
                { period: "Late 1800s", event: "Modern 'hiking' gains recreational meaning", side: "hiking" },
                { period: "WWI Era", event: "Hiking becomes popular in English-speaking world", side: "hiking" },
                { period: "Mid-1900s", event: "Terms begin overlapping in outdoor recreation", side: "both" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="w-32 text-sm text-gray-400 font-mono">{item.period}</div>
                  <div className={`w-4 h-4 rounded-full ${
                    item.side === 'hiking' ? 'bg-gray-400' : 
                    item.side === 'trekking' ? 'bg-white' : 'bg-gray-600'
                  }`}></div>
                  <div className="flex-1 text-gray-300">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Comparison */}
      <section id="comparison" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-8">Modern Usage & Differences</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              How these terms are understood and used in today's outdoor recreation world
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white border-2 border-gray-200 p-10 rounded-3xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Hiking</h3>
                <p className="text-gray-600">Day trips • Established trails • Accessible</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Typical Duration</h4>
                  <p className="text-gray-600 text-sm">Few hours to full day, return home same day</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Trail Type</h4>
                  <p className="text-gray-600 text-sm">Well-marked paths, maintained trails, loop routes</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accommodation</h4>
                  <p className="text-gray-600 text-sm">Return home, no overnight stays required</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Gear Requirements</h4>
                  <p className="text-gray-600 text-sm">Day pack, water, snacks, basic first aid</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Physical Demand</h4>
                  <p className="text-gray-600 text-sm">Moderate, suitable for various fitness levels</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Planning Required</h4>
                  <p className="text-gray-600 text-sm">Minimal, can be spontaneous</p>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-10 rounded-3xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Trekking</h3>
                <p className="text-gray-300">Multi-day • Remote routes • Challenging</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Typical Duration</h4>
                  <p className="text-gray-400 text-sm">Multiple days to weeks, extended expeditions</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Trail Type</h4>
                  <p className="text-gray-400 text-sm">Remote paths, unmarked routes, wilderness areas</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Accommodation</h4>
                  <p className="text-gray-400 text-sm">Camping, mountain huts, basic lodges</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Gear Requirements</h4>
                  <p className="text-gray-400 text-sm">Full backpacking gear, navigation tools, emergency equipment</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Physical Demand</h4>
                  <p className="text-gray-400 text-sm">High, requires good fitness and endurance</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Planning Required</h4>
                  <p className="text-gray-400 text-sm">Extensive, permits, weather windows, supplies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Variations */}
          <div className="bg-gray-50 p-12 rounded-3xl mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center">Regional Variations Worldwide</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl">
                <h4 className="font-bold mb-3">North America</h4>
                <p className="text-gray-600 text-sm mb-3">Hiking dominates vocabulary. "Backpacking" used for multi-day trips.</p>
                <div className="text-xs text-gray-500">
                  <strong>Common:</strong> Day hiking, trail hiking<br/>
                  <strong>Less common:</strong> Trekking
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl">
                <h4 className="font-bold mb-3">Europe</h4>
                <p className="text-gray-600 text-sm mb-3">Mixed usage. "Walking" and "rambling" also popular in UK.</p>
                <div className="text-xs text-gray-500">
                  <strong>Common:</strong> Hiking, walking, rambling<br/>
                  <strong>Regional:</strong> Trekking for Alps
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl">
                <h4 className="font-bold mb-3">Asia & Himalayas</h4>
                <p className="text-gray-600 text-sm mb-3">Trekking preferred for mountain expeditions and cultural routes.</p>
                <div className="text-xs text-gray-500">
                  <strong>Common:</strong> Trekking, expedition<br/>
                  <strong>Context:</strong> High altitude, multi-day
                </div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border-l-8 border-yellow-400 p-8 rounded-r-3xl">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-yellow-400 rounded-full shrink-0 mt-1 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-bold text-yellow-800 mb-2">Regional Context Matters</h4>
                <p className="text-yellow-700">
                  How you differentiate these terms in one part of the world may have completely opposite 
                  meanings elsewhere. Always consider local context when planning outdoor activities or 
                  communicating with guides and local communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Activity Guide */}
      <section id="guide" className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-8">Complete Activity Guide</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Detailed breakdown of each activity type to help you choose your next adventure
            </p>
          </div>

          {/* Difficulty Levels */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-12 text-center">Difficulty Spectrum</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { level: "Beginner", activity: "Day Hiking", duration: "2-6 hours", example: "Local nature trails" },
                { level: "Intermediate", activity: "Long Day Hikes", duration: "6-12 hours", example: "Mountain day trips" },
                { level: "Advanced", activity: "Multi-day Trekking", duration: "2-7 days", example: "Circuit routes" },
                { level: "Expert", activity: "Expedition Trekking", duration: "1-4 weeks", example: "Remote wilderness" }
              ].map((item, index) => (
                <div key={index} className="bg-gray-900 p-6 rounded-2xl text-center">
                  <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${(index + 1) * 25}%` }}
                    ></div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.level}</h4>
                  <p className="text-gray-300 text-sm mb-2">{item.activity}</p>
                  <p className="text-gray-400 text-xs mb-1">{item.duration}</p>
                  <p className="text-gray-500 text-xs">{item.example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Gear Lists */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-gray-900 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8">Essential Hiking Gear</h3>
              <div className="space-y-6">
                {[
                  { category: "Navigation", items: "Map, compass, GPS device" },
                  { category: "Hydration", items: "Water bottles, electrolyte tablets" },
                  { category: "Nutrition", items: "Trail snacks, lunch, emergency food" },
                  { category: "Weather Protection", items: "Rain jacket, sun hat, sunscreen" },
                  { category: "Safety", items: "First aid kit, whistle, headlamp" },
                  { category: "Comfort", items: "Hiking boots, moisture-wicking clothes" }
                ].map((gear, index) => (
                  <div key={index} className="border-l-4 border-gray-700 pl-4">
                    <h4 className="font-semibold text-gray-300 mb-1">{gear.category}</h4>
                    <p className="text-gray-400 text-sm">{gear.items}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8">Complete Trekking Kit</h3>
              <div className="space-y-6">
                {[
                  { category: "Shelter", items: "Tent, sleeping bag, sleeping pad" },
                  { category: "Cooking", items: "Stove, fuel, cookware, utensils" },
                  { category: "Water", items: "Filter, purification tablets, extra bottles" },
                  { category: "Clothing", items: "Layering system, extra socks, underwear" },
                  { category: "Navigation", items: "Detailed maps, GPS, compass, altimeter" },
                  { category: "Emergency", items: "Satellite communicator, repair kit, medicine" }
                ].map((gear, index) => (
                  <div key={index} className="border-l-4 border-gray-600 pl-4">
                    <h4 className="font-semibold text-gray-300 mb-1">{gear.category}</h4>
                    <p className="text-gray-400 text-sm">{gear.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training & Preparation */}
          <div className="bg-gray-900 p-12 rounded-3xl">
            <h3 className="text-3xl font-bold mb-12 text-center">Training & Preparation Guide</h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-300">Physical Preparation</h4>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Cardiovascular Fitness</h5>
                    <p className="text-gray-400 text-sm">Regular cardio 3-4x/week, build endurance gradually</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Strength Training</h5>
                    <p className="text-gray-400 text-sm">Focus on legs, core, and back muscles</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Practice Hikes</h5>
                    <p className="text-gray-400 text-sm">Start small, increase distance and elevation</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-300">Mental Preparation</h4>
                <div className="space-y-4">
                   <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Visualization</h5>
                    <p className="text-gray-400 text-sm">Imagine scenarios, prepare mentally for weather and discomfort</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Discipline & Routine</h5>
                    <p className="text-gray-400 text-sm">Stick to prep schedules, build confidence through consistency</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h5 className="font-semibold mb-2">Mindfulness & Breathwork</h5>
                    <p className="text-gray-400 text-sm">Helps you stay calm, manage fatigue and stay present in nature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Section - SEO Optimized Wrap Up */}
          <div className="mt-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white">Hiking vs Trekking: Final Thoughts</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Whether you're planning a day hike or gearing up for a multi-day trek, what matters most is your connection with nature, your preparation, and the stories you collect. These aren’t just outdoor activities—they’re rituals of the soul, deeply rooted in history and shaped by adventure.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Want more gear reviews, route breakdowns, and Himalayan guides? Follow us for updates or check out our trekking collection.
            </p>
            <a href="/trekking-guides" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition">Explore Trekking Guides</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HikingTrekkingGuide;
