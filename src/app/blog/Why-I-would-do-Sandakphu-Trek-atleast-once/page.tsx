import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaBookOpen, FaMountain, FaRoute, FaClock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { BsFilePersonFill, BsStarFill } from "react-icons/bs";
import { TbCalendarMonth } from "react-icons/tb";
import { MdOutlineElevator, MdVisibility } from "react-icons/md";
import { GiMountainRoad, GiCompass } from "react-icons/gi";

export const metadata = {
  title: "Sandakphu Trek Guide 2025 - Complete Trek to Bengal's Highest Peak | The Trail Makers",
  description: "Complete guide to Sandakphu trek - Bengal's highest peak at 11,930 ft. Experience 4 of world's 5 highest peaks including Everest, Kanchenjunga. Best time, route, difficulty & booking info.",
  keywords: "Sandakphu trek, Bengal highest peak, Kanchenjunga view, Everest view, Sandakphu trekking guide, Gurdum to Sandakphu, Singalila Ridge trek, Darjeeling trekking, Indo-Nepal border trek, Sleeping Buddha view, Sandakphu route, best time Sandakphu, Sandakphu difficulty, Himalayas trekking, West Bengal trek, Sandakphu booking, mountain trekking India, Sandakphu weather, Sandakphu cost, tea house trek",
  openGraph: {
    title: "Sandakphu Trek - Ultimate Guide to Bengal's Rooftop at 11,930 ft",
    description: "Trek to Sandakphu, Bengal's highest peak. Witness spectacular views of Everest, Kanchenjunga & world's highest peaks. Complete guide with routes, best time & tips.",
    type: "article",
    images: [
      {
        url: "/sandakphu-trek-view.jpg",
        width: 1200,
        height: 630,
        alt: "Sandakphu Trek - View of Kanchenjunga and Himalayan peaks"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandakphu Trek Guide - Bengal's Highest Peak Adventure",
    description: "Complete guide to trekking Sandakphu at 11,930 ft. See Everest, Kanchenjunga & world's highest peaks in one trek!",
    images: ["/sandakphu-trek-view.jpg"]
  },
  alternates: {
    canonical: "https://thetrailmakers.com/sandakphu-trek-guide"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Sandakphu Trek Guide 2025 - Complete Trek to Bengal's Highest Peak",
  "description": "Complete guide to Sandakphu trek - Bengal's highest peak at 11,930 ft with views of Everest and Kanchenjunga",
  "image": "/sandakphu-trek-view.jpg",
  "author": {
    "@type": "Person",
    "name": "The Trail Makers Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "The Trail Makers",
    "logo": {
      "@type": "ImageObject",
      "url": "/trail-makers-logo.jpg"
    }
  },
  "datePublished": "2025-06-23",
  "dateModified": "2025-06-23",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://thetrailmakers.com/sandakphu-trek-guide"
  }
};

function SandakphuTrekGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className='min-h-screen leading-relaxed text-stone-800 bg-linear-to-b from-blue-50 to-green-50'>

        {/* Hero Section */}
        <div className='bg-linear-to-r from-blue-600 via-purple-600 to-green-600 flex flex-col w-full items-center justify-center text-white pt-16 pb-12 relative overflow-hidden'>
          <div className='absolute inset-0 bg-black opacity-20'></div>
          <div className='relative z-10 text-center max-w-4xl mx-auto px-4'>
            <h1 className='text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              Sandakphu Trek Guide 2025
            </h1>
            <h2 className='text-xl lg:text-2xl font-light mb-4 text-blue-100'>
              Journey to Bengal's Highest Peak at 11,930 feet
            </h2>
            <p className='text-lg mb-8 max-w-3xl mx-auto leading-relaxed'>
              Experience the ultimate Himalayan adventure where you can witness 4 of the world's 5 highest peaks including Mount Everest and Kanchenjunga from Bengal's rooftop
            </p>
            
            <div className='flex flex-wrap items-center justify-center gap-6 text-sm font-medium'>       
              <div className='flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2'>
                <BsFilePersonFill className='mr-2 text-lg'/>
                <span>By Gourab Chatterjee</span>
              </div>
              <div className='flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2'>
                <TbCalendarMonth className='mr-2 text-lg'/>
                <span>Updated: June 23, 2025</span>
              </div>
              <div className='flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2'>
                <FaClock className='mr-2 text-lg'/>
                <span>15 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className='relative'>
          <Image 
            src="https://res.cloudinary.com/dyz0zzyv8/image/upload/g_south/v1750702555/IMG_20250331_054404_cn2qq9.jpg" 
            alt="Sandakphu Trek - Spectacular view of Rhododendron and Himalayan peaks from Bengal's highest point at 11,930 feet"
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, 1200px" 
            className="w-full h-[50vh] lg:h-[60vh] object-cover"
            priority
          />
          <div className='absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-md'>
            <p className='text-sm font-medium'>The breathtaking sunrise view from Kalipokhri with Lali Burans"</p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className='lg:px-[calc((100vw-1200px)/2)] px-4 -mt-2 relative z-10 mb-8'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white rounded-lg shadow-lg p-4 text-center border-l-4 border-blue-500'>
              <MdOutlineElevator className='text-2xl text-blue-600 mx-auto mb-2'/>
              <h3 className='font-semibold text-sm text-gray-700'>Max Altitude</h3>
              <p className='text-lg font-bold text-blue-600'>11,930 ft</p>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-4 text-center border-l-4 border-green-500'>
              <GiMountainRoad className='text-2xl text-green-600 mx-auto mb-2'/>
              <h3 className='font-semibold text-sm text-gray-700'>Trek Distance</h3>
              <p className='text-lg font-bold text-green-600'>32 km</p>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-4 text-center border-l-4 border-purple-500'>
              <FaClock className='text-2xl text-purple-600 mx-auto mb-2'/>
              <h3 className='font-semibold text-sm text-gray-700'>Duration</h3>
              <p className='text-lg font-bold text-purple-600'>4-5 Days</p>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-4 text-center border-l-4 border-orange-500'>
              <BsStarFill className='text-2xl text-orange-600 mx-auto mb-2'/>
              <h3 className='font-semibold text-sm text-gray-700'>Difficulty</h3>
              <p className='text-lg font-bold text-orange-600'>Easy-Moderate</p>
            </div>
          </div>
        </div>

        <div className='lg:px-[calc((100vw-1200px)/2)] px-4'>

          {/* Table of Contents */}
          <div className='bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg'>
            <h2 className='text-2xl font-bold mb-4 text-blue-800 flex items-center'>
              <FaBookOpen className='mr-3'/>
              Complete Sandakphu Trek Guide - Table of Contents
            </h2>
            <ul className='grid grid-cols-1 lg:grid-cols-2 gap-2 text-blue-700'>
              <li><a href="#why-sandakphu" className='hover:text-blue-900 hover:underline'>🏔️ Why Trek Sandakphu?</a></li>
              <li><a href="#route-guide" className='hover:text-blue-900 hover:underline'>🗺️ Complete Route Guide</a></li>
              <li><a href="#best-time" className='hover:text-blue-900 hover:underline'>📅 Best Time to Visit</a></li>
              <li><a href="#difficulty" className='hover:text-blue-900 hover:underline'>💪 Difficulty & Fitness</a></li>
              <li><a href="#packing" className='hover:text-blue-900 hover:underline'>🎒 Packing List</a></li>
              <li><a href="#cost" className='hover:text-blue-900 hover:underline'>💰 Trek Cost & Permits</a></li>
              <li><a href="#accommodation" className='hover:text-blue-900 hover:underline'>🏠 Accommodation Options</a></li>
              <li><a href="#tips" className='hover:text-blue-900 hover:underline'>💡 Expert Tips & Safety</a></li>
            </ul>
          </div>

          {/* Introduction */}
          <section className='mb-12'>
            <div className='prose prose-lg max-w-none'>
              <p className='text-xl leading-relaxed mb-6 font-medium text-gray-700'>
                <span className='text-6xl bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-bold mr-3 float-left leading-none'>I</span>
                magine stepping into a living, breathing Instagram filter—except it's 100% real and 200% windy. Welcome to the Sandakphu trek, the crown jewel of West Bengal's trekking destinations and your gateway to witnessing some of the world's most spectacular mountain views.
              </p>
              
              <p className='text-lg mb-6 leading-relaxed'>
                The Sandakphu trek is not just any ordinary mountain adventure. It's a journey that dances along the Indo-Nepal border, offering you the rare privilege of sipping chai with one foot in India while enjoying momos from Nepal. At 11,930 feet, Sandakphu stands as Bengal's highest peak, earning its nickname as "Bengal's Rooftop" and offering an unparalleled vantage point to witness the Himalayan giants.
              </p>
            </div>
          </section>

          {/* Why Sandakphu Section */}
          <section id="why-sandakphu" className='mb-12'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800 flex items-center'>
              <FaMountain className='mr-4 text-blue-600'/>
              Why Sandakphu Trek Should Be Your Next Adventure
            </h2>
            
            <div className='bg-linear-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-l-8 border-orange-400 mb-8'>
              <h3 className='text-2xl font-bold mb-4 text-orange-800'>The Ultimate Himalayan Theater Experience</h3>
              <p className='text-lg leading-relaxed mb-4'>
                Here's what makes Sandakphu absolutely unmissable: Where else can you spot four of the world's five highest peaks—Mount Everest, Lhotse, Makalu, and Kanchenjunga—while sipping chai in thermal socks that smell like pure ambition? This isn't just a trek; it's a cinematic experience with altitude that Christopher Nolan would be jealous of.
              </p>
            </div>

            <div className='grid lg:grid-cols-2 gap-8 mb-8'>
              <div className='bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500'>
                <h4 className='text-xl font-semibold mb-4 text-blue-700 flex items-center'>
                  <MdVisibility className='mr-3'/>
                  Spectacular Mountain Views
                </h4>
                <ul className='space-y-2'>
                  <li className='flex items-start'><span className='text-green-600 mr-2'>✓</span> Mount Everest (29,032 ft) - World's highest peak</li>
                  <li className='flex items-start'><span className='text-green-600 mr-2'>✓</span> Kanchenjunga (28,169 ft) - Third highest peak</li>
                  <li className='flex items-start'><span className='text-green-600 mr-2'>✓</span> Lhotse (27,940 ft) - Fourth highest peak</li>
                  <li className='flex items-start'><span className='text-green-600 mr-2'>✓</span> Makalu (27,838 ft) - Fifth highest peak</li>
                  <li className='flex items-start'><span className='text-green-600 mr-2'>✓</span> The famous "Sleeping Buddha" formation</li>
                </ul>
              </div>
              
              <div className='bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500'>
                <h4 className='text-xl font-semibold mb-4 text-green-700 flex items-center'>
                  <GiCompass className='mr-3'/>
                  Unique Trek Features
                </h4>
                <ul className='space-y-2'>
                  <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Indo-Nepal border crossing experience</li>
                  <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Beginner-friendly yet rewarding</li>
                  <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Tea house accommodation available</li>
                  <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Rich biodiversity and rhododendron forests</li>
                  <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Cultural immersion with local communities</li>
                </ul>
              </div>
            </div>

            <div className='bg-linear-to-r from-purple-100 to-pink-100 p-8 rounded-2xl'>
              <h4 className='text-2xl font-bold mb-4 text-purple-800'>The Sandakphu Magic</h4>
              <p className='text-lg leading-relaxed mb-4'>
                The sunrise from Sandakphu is legendary - each dawn feels like Simba's naming ceremony, complete with chills, awe, and the overwhelming feeling that you've witnessed something truly divine. The wet fog looks like it was directed for a Christopher Nolan film, and you'll meet locals whose smiles are warmer than your fleece jacket.
              </p>
              <p className='text-lg leading-relaxed'>
                You might even spot red pandas pretending to be shy Instagram influencers, and if you're really lucky, dogs that sing opera at dawn will serenade your morning tea. This is Sandakphu - where every muddy footprint carries magic and every wind-kiss on your cheek tells a story.
              </p>
            </div>
          </section>

          {/* Route Guide Section */}
          <section id="route-guide" className='mb-12'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800 flex items-center'>
              <FaRoute className='mr-4 text-green-600'/>
              Complete Sandakphu Trek Route Guide
            </h2>

            <div className='bg-green-50 p-8 rounded-2xl mb-8 border-l-8 border-green-500'>
              <h3 className='text-2xl font-bold mb-4 text-green-800'>The Classic Sandakphu Route</h3>
              <p className='text-lg mb-4 leading-relaxed'>
                Starting from the pine-scented village of Gurdum, the trail weaves through enchanted forests and tea-house hamlets like Tumling and the tranquil Pokhri in Kalipokhri, all the way up to Sandakphu. Every zigzag you take is rewarded with increasingly spectacular views of the Himalayan giants.
              </p>
            </div>

            <div className='space-y-8'>
              {/* Day 1 */}
              <div className='bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500'>
                <div className='bg-blue-500 text-white p-4'>
                  <h4 className='text-xl font-bold'>Day 1: Gurdum to Tumling</h4>
                  <p className='text-blue-100'>Distance: 8 km | Duration: 4-5 hours | Altitude: 9,600 ft</p>
                </div>
                <div className='p-6'>
                  <p className='text-gray-700 mb-4 leading-relaxed'>
                    Begin your adventure from Gurdum, a charming village that serves as the gateway to Sandakphu. The trail starts with a gentle ascent through rhododendron and magnolia forests. As you climb, you'll cross several small streams and encounter prayer flags fluttering in the mountain breeze.
                  </p>
                  <p className='text-gray-700 leading-relaxed'>
                    Tumling offers your first spectacular views of the Kanchenjunga range. Stay overnight in a cozy tea house and enjoy your first taste of the Indo-Nepal border culture.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className='bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-500'>
                <div className='bg-green-500 text-white p-4'>
                  <h4 className='text-xl font-bold'>Day 2: Tumling to Kalipokhri</h4>
                  <p className='text-green-100'>Distance: 12 km | Duration: 5-6 hours | Altitude: 9,800 ft</p>
                </div>
                <div className='p-6'>
                  <p className='text-gray-700 mb-4 leading-relaxed'>
                    This is the longest day of your trek, but also one of the most rewarding. The trail takes you through dense forests where you might spot exotic birds and, if you're fortunate, red pandas. You'll pass through the beautiful meadows of Jaubari and Gairibas.
                  </p>
                  <p className='text-gray-700 leading-relaxed'>
                    Kalipokhri, meaning "Black Lake," is a sacred site with a small temple. The pristine lake and the surrounding peace make this a perfect place for reflection and acclimatization.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className='bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-purple-500'>
                <div className='bg-purple-500 text-white p-4'>
                  <h4 className='text-xl font-bold'>Day 3: Kalipokhri to Sandakphu</h4>
                  <p className='text-purple-100'>Distance: 6 km | Duration: 3-4 hours | Altitude: 11,930 ft</p>
                </div>
                <div className='p-6'>
                  <p className='text-gray-700 mb-4 leading-relaxed'>
                    The final ascent to Sandakphu! This relatively short but steep climb takes you above the tree line. As you approach the summit, the views become increasingly dramatic. The last kilometer offers panoramic vistas that will leave you speechless.
                  </p>
                  <p className='text-gray-700 leading-relaxed'>
                    Reach Sandakphu by afternoon and prepare for the most spectacular sunset of your life. The peak offers 360-degree views of the Himalayan range, including the coveted view of Mount Everest on clear days.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className='bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-orange-500'>
                <div className='bg-orange-500 text-white p-4'>
                  <h4 className='text-xl font-bold'>Day 4: Sandakphu Sunrise & Return</h4>
                  <p className='text-orange-100'>Distance: 12 km | Duration: 4-5 hours | Return to Gurdum</p>
                </div>
                <div className='p-6'>
                  <p className='text-gray-700 mb-4 leading-relaxed'>
                    Wake up before dawn for the legendary Sandakphu sunrise. Watch as the first rays of sunlight illuminate the world's highest peaks in shades of gold and pink. This moment alone makes the entire trek worthwhile.
                  </p>
                  <p className='text-gray-700 leading-relaxed'>
                    After breakfast and final photos, begin your descent back to Gurdum. The return journey offers different perspectives of the landscapes you climbed through, making it feel like an entirely new adventure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Best Time Section */}
          <section id="best-time" className='mb-12'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800 flex items-center'>
              <FaCalendarAlt className='mr-4 text-blue-600'/>
              Best Time to Trek Sandakphu
            </h2>

            <div className='grid lg:grid-cols-3 gap-6 mb-8'>
              <div className='bg-linear-to-br from-green-400 to-green-600 text-white p-6 rounded-xl'>
                <h3 className='text-2xl font-bold mb-4'>Peak Season</h3>
                <p className='text-lg font-semibold mb-2'>April - May & October - November</p>
                <ul className='space-y-2 text-green-100'>
                  <li>• Clear mountain views</li>
                  <li>• Perfect weather conditions</li>
                  <li>• Rhododendron blooms (April-May)</li>
                  <li>• Stable trail conditions</li>
                </ul>
              </div>
              
              <div className='bg-linear-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-xl'>
                <h3 className='text-2xl font-bold mb-4'>Good Season</h3>
                <p className='text-lg font-semibold mb-2'>December - March</p>
                <ul className='space-y-2 text-yellow-100'>
                  <li>• Snow-covered landscapes</li>
                  <li>• Crystal clear views</li>
                  <li>• Cold but manageable</li>
                  <li>• Fewer crowds</li>
                </ul>
              </div>
              
              <div className='bg-linear-to-br from-gray-400 to-gray-600 text-white p-6 rounded-xl'>
                <h3 className='text-2xl font-bold mb-4'>Avoid</h3>
                <p className='text-lg font-semibold mb-2'>June - September</p>
                <ul className='space-y-2 text-gray-200'>
                  <li>• Monsoon season</li>
                  <li>• Cloudy views</li>
                  <li>• Slippery trails</li>
                  <li>• Leeches present</li>
                </ul>
              </div>
            </div>

            <div className='bg-blue-50 p-8 rounded-2xl border-l-8 border-blue-500'>
              <h3 className='text-2xl font-bold mb-4 text-blue-800'>Expert Recommendation</h3>
              <p className='text-lg leading-relaxed mb-4'>
                For the absolute best Sandakphu experience, plan your trek between <strong>mid-April to mid-May</strong> or <strong>mid-October to mid-November</strong>. During these periods, you'll enjoy:
              </p>
              <ul className='text-lg space-y-2'>
                <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Maximum probability of clear mountain views</li>
                <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Comfortable daytime temperatures (10-15°C)</li>
                <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Minimal rainfall</li>
                <li className='flex items-start'><span className='text-blue-600 mr-2'>✓</span> Blooming rhododendrons (April-May season)</li>
              </ul>
            </div>
          </section>

          {/* Historical Context */}
          <section className='mb-12'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800'>Historical Significance & Cultural Heritage</h2>
            
            <div className='bg-linear-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border-l-8 border-amber-400'>
              <h3 className='text-2xl font-bold mb-4 text-amber-800'>Victorian Legacy & Local Folklore</h3>
              <p className='text-lg leading-relaxed mb-4'>
                They say British officers huffed their way to Sandakphu in the 1800s looking for "leisure," which is fancy Victorian speak for mountain-induced hallucinations and deeply judgmental tea picnics. But long before the British arrived, local shepherds were probably vibing up here with their yaks, watching spectacular sunsets and wondering when tourists would show up asking for Wi-Fi.
              </p>
              <p className='text-lg leading-relaxed'>
                The trail to Sandakphu is steeped in whispered folklore—ancient monasteries where time seems to nap peacefully, border stones you casually hop across like a confused diplomat, and tales of explorers sipping tea with one boot in India and another buying momos in Nepal. At Sandakphu, history and geography don't just meet—they high-five across ridgelines, creating an experience that's both culturally rich and geographically spectacular.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className='mb-12'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800'>Frequently Asked Questions</h2>
            
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500'>
                <h3 className='text-xl font-semibold mb-3 text-blue-700'>Is Sandakphu trek suitable for beginners?</h3>
                <p className='text-gray-700 leading-relaxed'>Yes! Sandakphu is considered one of the best beginner-friendly treks in the Himalayas. The trail is well-marked, tea house accommodation is available, and the gradual ascent allows for proper acclimatization.</p>
              </div>
              
              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500'>
                <h3 className='text-xl font-semibold mb-3 text-green-700'>Can I see Mount Everest from Sandakphu?</h3>
                <p className='text-gray-700 leading-relaxed'>Yes, on clear days you can see Mount Everest from Sandakphu! The peak appears as a small pyramid behind other mountains. Early morning hours typically offer the clearest views.</p>
              </div>
              
              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500'>
                <h3 className='text-xl font-semibold mb-3 text-purple-700'>Do I need permits for Sandakphu trek?</h3>
                <p className='text-gray-700 leading-relaxed'>Yes, you need permits from both Indian and Nepali authorities as the trek crosses the Indo-Nepal border. Most trekking agencies will assist in arranging these, and you’ll need to carry a valid ID and passport-sized photographs.</p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500'>
                <h3 className='text-xl font-semibold mb-3 text-orange-700'>What kind of accommodation is available?</h3>
                <p className='text-gray-700 leading-relaxed'>Tea houses and basic lodges are available throughout the trail. These offer warm meals, blankets, and sometimes even charging points. Don’t expect luxury, but do expect charming hospitality and hot soup under starry skies.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className='mb-20 text-center'>
            <div className='bg-linear-to-r from-blue-600 to-green-600 text-white p-10 rounded-2xl shadow-xl'>
              <h2 className='text-3xl font-bold mb-4'>Ready to Conquer Bengal's Rooftop?</h2>
              <p className='text-lg mb-6 max-w-2xl mx-auto'>Join The Trail Makers on an unforgettable Sandakphu adventure where each sunrise feels like magic, each trail tells a story, and every view humbles you with its beauty.</p>
              <Link href="/contact" className='inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition'>
                Book Your Trek Now
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default SandakphuTrekGuide;