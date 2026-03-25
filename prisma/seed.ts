/**
 * Prisma Seed Script
 * Populates database with initial trek data
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient, type TrekDifficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Do NOT clear existing data - use upsert to avoid conflicts

  console.log("Seeding database with trek data...");

  // Create or update treks
  const beasKund = await prisma.trek.upsert({
    where: { slug: "beas-kund-trek" },
    update: {},
    create: {
      slug: "beas-kund-trek",
      name: "Beas Kund Trek",
      description:
        "A moderate trek to the source of River Beas in the Himalayas",
      longDescription:
        "Beas Kund Trek takes you to the pristine alpine lake at 3,960 meters elevation. The trek offers stunning views of snow-capped peaks, dense forests, and Alpine meadows.",
      state: "Himachal Pradesh",
      basePrice: 15000 * 100, // ₹15,000 in paise
      difficulty: "MODERATE",
      duration: 5,
      distance: 18,
      maxAltitude: 3960,
      bestSeason: "Jun-Sep",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1713186783/Beas_Kund_Trek.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1713186783/Beas_Kund_Trek.jpg",
      tags: ["alpine", "lake", "moderate", "5-days"],
      itinerary: `Day 1: Arrive at Auli, acclimatize
Day 2: Trek to Tali Top (3,400m)
Day 3: Trek to Beas Kund (3,960m)
Day 4: Explore and return to Tali Top
Day 5: Return to Auli`,
      inclusions: [
        "Accommodation (tents/homestays)",
        "Meals (breakfast, lunch, dinner)",
        "Expert guides and porters",
        "First aid kit",
        "Permits (if required)",
      ],
      exclusions: [
        "Flights and train tickets",
        "Personal items",
        "Travel insurance",
        "Tips and gratuities",
      ],
      requirements: [
        "Basic fitness level",
        "Comfortable trekking shoes",
        "Warm clothing",
        "Sunscreen and hats",
      ],
    },
  });

  const ranisui = await prisma.trek.upsert({
    where: { slug: "ranisui-lake-trek" },
    update: {},
    create: {
      slug: "ranisui-lake-trek",
      name: "Ranisui Lake Trek",
      description:
        "An easy to moderate trek to a beautiful high-altitude lake in Himachal Pradesh",
      longDescription:
        "Ranisui Lake Trek is known for its stunning turquoise waters surrounded by dense forests and snow-capped peaks. Perfect for nature lovers and photography enthusiasts.",
      state: "Himachal Pradesh",
      basePrice: 12000 * 100, // ₹12,000 in paise
      difficulty: "EASY_MODERATE",
      duration: 4,
      distance: 14,
      maxAltitude: 3600,
      bestSeason: "May-Oct",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1713186783/Ranisui_Lake.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1713186783/Ranisui_Lake.jpg",
      tags: ["lake", "easy-moderate", "4-days", "photography"],
      itinerary: `Day 1: Reach Manali
Day 2: Trek to Prini Village, then to Solang
Day 3: Trek to Ranisui Lake
Day 4: Return to Manali`,
      inclusions: [
        "All meals",
        "Professional guide",
        "Transport from Manali",
        "Camping equipment",
      ],
      exclusions: ["Personal gear", "Travel to Manali", "Tips"],
      requirements: [
        "Moderate fitness",
        "Proper hiking boots",
        "Layers for changing weather",
      ],
    },
  });

  const bhriguLake = await prisma.trek.upsert({
    where: { slug: "bhrigu-lake-trek" },
    update: {},
    create: {
      slug: "bhrigu-lake-trek",
      name: "Bhrigu Lake Trek",
      description:
        "A challenging trek to the sacred Bhrigu Lake at 4,300m altitude",
      longDescription:
        "Bhrigu Lake Trek is considered one of the most challenging and rewarding treks in Himachal. The trek passes through dense forests and meadows leading to the pristine lake.",
      state: "Himachal Pradesh",
      basePrice: 18000 * 100, // ₹18,000 in paise
      difficulty: "HARD",
      duration: 7,
      distance: 27,
      maxAltitude: 4300,
      bestSeason: "Jul-Sep",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1713186783/Bhrigu_Lake.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1713186783/Bhrigu_Lake.jpg",
      tags: ["hard", "7-days", "altitude", "sacred"],
      itinerary: `Day 1: Arrive at Kullu
Day 2: Reach Banjar
Day 3: Trek to Rishi Farmstead
Day 4: Trek to Seri Top
Day 5: Trek to Bhrigu Lake
Day 6: Rest day at lake
Day 7: Return trek and departure`,
      inclusions: [
        "All meals on trek",
        "Professional mountaineering guide",
        "Camping and cooking equipment",
        "Porter services",
      ],
      exclusions: [
        "Personal climbing gear",
        "Transport to starting point",
        "Guide tips",
        "Travel insurance",
      ],
      requirements: [
        "High fitness level",
        "Altitude acclimatization experience",
        "Advanced trekking skills",
        "No fear of heights",
      ],
    },
  });

  // Additional treks (Price on Request - no departures created)
  const hamptaPass = await prisma.trek.upsert({
    where: { slug: "hampta-pass-trek" },
    update: {},
    create: {
      slug: "hampta-pass-trek",
      name: "Hampta Pass Trek",
      description:
        "A scenic crossover trek from Kullu to Lahaul with varied landscapes.",
      longDescription:
        "Hampta Pass offers dramatic contrasts — lush green valleys in Kullu and the barren high-altitude landscapes of Lahaul. It is a favourite for those seeking variety in a single trek.",
      state: "Himachal Pradesh",
      basePrice: 0, // Price on request
      difficulty: "EASY_MODERATE",
      duration: 6,
      distance: 29,
      maxAltitude: 4300,
      bestSeason: "Jun-Sep",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/hampta_pass.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/hampta_pass.jpg",
      tags: ["cross-over", "meadows", "6-days"],
      itinerary: `Day 1: Drive Manali → Jobra/Chatru, short acclimatisation trek and camp
    Day 2: Trek across pine forests to Balu Ka Ghera (meadows) and camp
    Day 3: Trek to the Hampta approach (Shea Goru area), prepare for pass crossing
    Day 4: Cross Hampta Pass (≈14,000 ft) and descend into the Lahaul side to Chatru
    Day 5: Trek down to lower meadows and drive back towards Manali
    Day 6: Buffer / departure`,
      inclusions: [
        "Tents or guesthouse stay",
        "Meals on trek",
        "Guide and porter services",
      ],
      exclusions: ["Travel to Manali", "Personal gear", "Insurance"],
      requirements: ["Moderate fitness", "Good trekking shoes", "Warm layers"],
    },
  });

  const pinParvati = await prisma.trek.upsert({
    where: { slug: "pin-parvati-pass-trek" },
    update: {},
    create: {
      slug: "pin-parvati-pass-trek",
      name: "Pin Parvati Pass Trek",
      description:
        "A challenging, high-altitude pass connecting Parvati valley to Pin valley.",
      longDescription:
        "Pin Parvati is an advanced trek that rewards trekkers with remote landscapes, glacier crossings, and a sense of true wilderness.",
      state: "Himachal Pradesh",
      basePrice: 0,
      difficulty: "VERY_HARD",
      duration: 10,
      distance: 95,
      maxAltitude: 5320,
      bestSeason: "Jul-Sep",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/pin_parvati.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/pin_parvati.jpg",
      tags: ["high-altitude", "glacier", "remote"],
      itinerary: `Day 1: Reach Barshaini and trek to Pulga (camp)
    Day 2: Trek through alpine meadows to Mantalai
    Day 3: Advance to Thakur Kuan/approach camps
    Day 4: Trek towards the Pin Parvati glacier approach, technical sections
    Day 5: Final approach and crossing of the Pin Parvati Pass
    Day 6: Begin descent into Pin valley
    Day 7-10: Gradual descent and exit via Pin valley villages`,
      inclusions: [
        "Camping and meals",
        "Experienced high-altitude guides",
        "Porters",
      ],
      exclusions: ["High-altitude personal gear", "Travel to start point"],
      requirements: [
        "Excellent fitness",
        "Prior high-altitude experience",
        "Full trekking kit",
      ],
    },
  });

  const triund = await prisma.trek.upsert({
    where: { slug: "triund-trek" },
    update: {},
    create: {
      slug: "triund-trek",
      name: "Triund Trek",
      description:
        "A short and popular trek near McLeodganj with panoramic views of Dhauladhar.",
      longDescription:
        "Triund is ideal for beginners and offers spectacular sunrise/sunset views over the Dhauladhar range. Great for a quick getaway.",
      state: "Himachal Pradesh",
      basePrice: 0,
      difficulty: "EASY",
      duration: 2,
      distance: 9,
      maxAltitude: 2828,
      bestSeason: "Mar-Nov",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/triund.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/triund.jpg",
      tags: ["short", "viewpoint", "beginner"],
      itinerary: `Day 1: Drive to McLeodganj and trek to Triund; camp below the ridge
    Day 2: Sunrise viewpoint on the Dhauladhar, descend and return to McLeodganj`,
      inclusions: ["Guide", "Camping (optional)", "Meals on trek"],
      exclusions: ["Transport to McLeodganj", "Personal gear"],
      requirements: ["Light fitness", "Daypack and layers"],
    },
  });

  const prasharLake = await prisma.trek.upsert({
    where: { slug: "prashar-lake-trek" },
    update: {},
    create: {
      slug: "prashar-lake-trek",
      name: "Prashar Lake Trek",
      description:
        "A short trek to the serene Prashar Lake with a lone temple on an island.",
      longDescription:
        "Prashar Lake is famous for its mirror-like waters and the three-storey pagoda temple. The trail is peaceful and photogenic.",
      state: "Himachal Pradesh",
      basePrice: 0,
      difficulty: "EASY",
      duration: 3,
      distance: 12,
      maxAltitude: 2730,
      bestSeason: "May-Oct",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/prashar_lake.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/prashar_lake.jpg",
      tags: ["lake", "short", "photography"],
      itinerary: `Day 1: Arrive Mandi and drive to trailhead; short approach to village camp
    Day 2: Trek to Prashar Lake, explore the lakeshore and temple, camp overnight
    Day 3: Return to Mandi and depart`,
      inclusions: ["Camping", "Meals on trek", "Guide"],
      exclusions: ["Transport to base", "Permits"],
      requirements: ["Moderate fitness", "Warm clothing at night"],
    },
  });

  const indraharPass = await prisma.trek.upsert({
    where: { slug: "indrahara-pass-trek" },
    update: {},
    create: {
      slug: "indrahara-pass-trek",
      name: "Indrahar Pass Trek",
      description:
        "A challenging ridge trek from McLeodganj to Lahesh cave and beyond.",
      longDescription:
        "Indrahar Pass is known for steep sections and superb high-altitude ridgelines offering breathtaking views.",
      state: "Himachal Pradesh",
      basePrice: 0,
      difficulty: "MODERATE",
      duration: 4,
      distance: 18,
      maxAltitude: 4342,
      bestSeason: "May-Oct",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/indrahara_pass.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/indrahara_pass.jpg",
      tags: ["ridge", "views", "snow"],
      itinerary: `Day 1: Trek McLeodganj → Triund (overnight at Triund)
    Day 2: Triund → Lahesh Caves (camp)
    Day 3: Early start to summit Indrahar Pass; enjoy ridge views and camp
    Day 4: Descend back to Triund and return to McLeodganj`,
      inclusions: ["Guide", "Camping and meals"],
      exclusions: ["Transport to start", "Personal gear"],
      requirements: ["Good fitness", "Comfortable with steep climbs"],
    },
  });

  const kheerganga = await prisma.trek.upsert({
    where: { slug: "kheerganga-trek" },
    update: {},
    create: {
      slug: "kheerganga-trek",
      name: "Kheerganga Trek",
      description:
        "A short and popular trek in Parvati Valley, famous for hot springs.",
      longDescription:
        "Kheerganga is a compact trek that rewards trekkers with natural hot springs and panoramic valley views.",
      state: "Himachal Pradesh",
      basePrice: 0,
      difficulty: "EASY",
      duration: 1,
      distance: 12,
      maxAltitude: 3000,
      bestSeason: "Mar-Oct",
      imageUrl:
        "https://res.cloudinary.com/thetrail/image/upload/v1740000000/kheerganga.jpg",
      thumbnailUrl:
        "https://res.cloudinary.com/thetrail/image/upload/c_thumb,w_200/v1740000000/kheerganga.jpg",
      tags: ["hot-springs", "short", "parvati-valley"],
      itinerary: `Day 1: Drive to Barshaini and trek (~4–6 hrs) to Kheerganga; soak in hot springs, camp overnight
    Day 2: Optional early morning views, trek back to Barshaini and drive out`,
      inclusions: ["Guide", "Camping (optional)"],
      exclusions: ["Transport to trailhead", "Personal gear"],
      requirements: ["Light fitness", "Daypack and water"],
    },
  });

  // Create departures for Beas Kund
  const bk1 = await prisma.departure.create({
    data: {
      trekId: beasKund.id,
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-06-20"),
      totalSeats: 15,
      seatsAvailable: 8,
      pricePerPerson: 15000 * 100,
    },
  });

  const bk2 = await prisma.departure.create({
    data: {
      trekId: beasKund.id,
      startDate: new Date("2025-07-10"),
      endDate: new Date("2025-07-15"),
      totalSeats: 20,
      seatsAvailable: 20,
      pricePerPerson: 15000 * 100,
    },
  });

  const bk3 = await prisma.departure.create({
    data: {
      trekId: beasKund.id,
      startDate: new Date("2025-08-05"),
      endDate: new Date("2025-08-10"),
      totalSeats: 18,
      seatsAvailable: 5,
      pricePerPerson: 16000 * 100, // Price increased for peak season
    },
  });

  // Create departures for Ranisui Lake
  const rs1 = await prisma.departure.create({
    data: {
      trekId: ranisui.id,
      startDate: new Date("2025-05-20"),
      endDate: new Date("2025-05-24"),
      totalSeats: 12,
      seatsAvailable: 12,
      pricePerPerson: 12000 * 100,
    },
  });

  const rs2 = await prisma.departure.create({
    data: {
      trekId: ranisui.id,
      startDate: new Date("2025-06-25"),
      endDate: new Date("2025-06-29"),
      totalSeats: 15,
      seatsAvailable: 6,
      pricePerPerson: 12000 * 100,
    },
  });

  // Create departures for Bhrigu Lake
  const bl1 = await prisma.departure.create({
    data: {
      trekId: bhriguLake.id,
      startDate: new Date("2025-07-20"),
      endDate: new Date("2025-07-27"),
      totalSeats: 10,
      seatsAvailable: 4,
      pricePerPerson: 18000 * 100,
    },
  });

  const bl2 = await prisma.departure.create({
    data: {
      trekId: bhriguLake.id,
      startDate: new Date("2025-08-15"),
      endDate: new Date("2025-08-22"),
      totalSeats: 12,
      seatsAvailable: 12,
      pricePerPerson: 18000 * 100,
    },
  });

  // Create a larger set of treks (price on request) to populate site listings
  interface TrekInput {
    slug: string;
    name: string;
    state: string;
    difficulty: TrekDifficulty;
    duration: number;
    distance: number;
    maxAltitude: number;
    bestSeason: string;
    tags: string[];
    itinerary: string;
    description?: string;
    longDescription?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    inclusions?: string[];
    exclusions?: string[];
    requirements?: string[];
  }

  const moreTreks: TrekInput[] = [
    {
      slug: "roopkund-trek",
      name: "Roopkund Trek",
      state: "Uttarakhand",
      difficulty: "HARD",
      duration: 6,
      distance: 55,
      maxAltitude: 4700,
      bestSeason: "May-Oct",
      tags: ["high-altitude", "glacier", "lake"],
      itinerary: `Day 1: Drive to Lohajung and trek to Lohajung camp
  Day 2: Trek to Wan/Patangini area
  Day 3: Approach to Didna/Patangini and alpine meadows
  Day 4: Trek across Bedni Bugyal towards Roopkund base
  Day 5: Visit Roopkund (the skeletal lake) and return to Wan
  Day 6: Trek out and drive back to Rishikesh/exit point`,
    },
    {
      slug: "kedarkantha-trek",
      name: "Kedarkantha Trek",
      state: "Uttarakhand",
      difficulty: "EASY_MODERATE",
      duration: 4,
      distance: 20,
      maxAltitude: 3800,
      bestSeason: "Dec-May",
      tags: ["snow", "family", "4-days"],
      itinerary: `Day 1: Drive to Sankri and trek to Juda Ka Talab
  Day 2: Trek to Kedarkantha base / climb towards summit camp
  Day 3: Summit Kedarkantha early morning; descend to Juda Ka Talab
  Day 4: Trek back to Sankri and depart`,
    },
    {
      slug: "kuari-pass-trek",
      name: "Kuari Pass Trek",
      state: "Uttarakhand",
      difficulty: "EASY_MODERATE",
      duration: 5,
      distance: 28,
      maxAltitude: 3800,
      bestSeason: "Mar-Jun, Sep-Nov",
      tags: ["meadows", "views"],
      itinerary: `Day 1: Drive to Auli/Khullara and trek to Gorson Bugyal
  Day 2: Trek across Gorson Bugyal towards Khulara/Kuari approach
  Day 3: Trek to Kuari Pass and enjoy panoramic views
  Day 4: Descend to Gorson and return route
  Day 5: Drive back to base`,
    },
    {
      slug: "brahmtal-trek",
      name: "Brahmatal Trek",
      state: "Uttarakhand",
      difficulty: "MODERATE",
      duration: 4,
      distance: 25,
      maxAltitude: 4250,
      bestSeason: "Dec-May, Jun-Sep",
      tags: ["lake", "snow", "views"],
      itinerary: `Day 1: Drive to Lohajung and trek to Bekaltal
  Day 2: Trek to Brahmatal; camp near the lake
  Day 3: Explore Brahmatal peaks and lakes; acclimatise
  Day 4: Trek out to Lohajung and depart`,
    },
    {
      slug: "rupin-pass-trek",
      name: "Rupin Pass Trek",
      state: "Himachal Pradesh/Uttarakhand",
      difficulty: "HARD",
      duration: 8,
      distance: 90,
      maxAltitude: 4300,
      bestSeason: "May-Oct",
      tags: ["pass", "glacier"],
      itinerary: `Day 1: Reach Dhaula\nDay 2: Trek to Sewa\nDay 3: Trek to Rupin waterfall\nDay 4: Cross Rupin Pass\nDay 5-8: Descend to Sangla and return`,
    },
    {
      slug: "dayara-bugyal-trek",
      name: "Dayara Bugyal Trek",
      state: "Uttarakhand",
      difficulty: "EASY",
      duration: 3,
      distance: 20,
      maxAltitude: 3600,
      bestSeason: "Apr-Jun, Sep-Nov",
      tags: ["meadows", "photography"],
      itinerary: `Day 1: Drive to Raithal\nDay 2: Trek to Dayara Bugyal and camp\nDay 3: Return`,
    },
    {
      slug: "kashmir-great-lakes-trek",
      name: "Kashmir Great Lakes Trek",
      state: "Jammu & Kashmir",
      difficulty: "MODERATE",
      duration: 7,
      distance: 70,
      maxAltitude: 4300,
      bestSeason: "Jul-Sep",
      tags: ["lakes", "scenic"],
      itinerary: `Day 1: Reach Aru\nDay 2-6: Trek across multiple alpine lakes\nDay 7: Exit via Sonamarg`,
    },
    {
      slug: "tarsar-marsar-trek",
      name: "Tarsar Marsar Trek",
      state: "Jammu & Kashmir",
      difficulty: "MODERATE",
      duration: 6,
      distance: 60,
      maxAltitude: 4100,
      bestSeason: "Jul-Sep",
      tags: ["lakes", "alpine"],
      itinerary: `Day 1: Reach Aru\nDay 2: Trek to Lidwas\nDay 3: Tarsar/Marsar exploration\nDay 4-6: Return`,
    },
    {
      slug: "stok-kangri-trek",
      name: "Stok Kangri Trek",
      state: "Ladakh",
      difficulty: "VERY_HARD",
      duration: 9,
      distance: 60,
      maxAltitude: 6153,
      bestSeason: "Jul-Aug",
      tags: ["summit", "high-altitude"],
      itinerary: `Day 1-3: Acclimatization in Leh\nDay 4-9: Approach and summit attempt of Stok Kangri`,
    },
    {
      slug: "markha-valley-trek",
      name: "Markha Valley Trek",
      state: "Ladakh",
      difficulty: "MODERATE",
      duration: 6,
      distance: 65,
      maxAltitude: 5050,
      bestSeason: "Jun-Sep",
      tags: ["valley", "culture"],
      itinerary: `Day 1: Drive to Chilling and trek to Skiu\nDay 2-6: Trek through Markha valley and exit at Hemis`,
    },
    {
      slug: "chadar-trek",
      name: "Chadar Trek",
      state: "Ladakh (Zanskar)",
      difficulty: "VERY_HARD",
      duration: 9,
      distance: 50,
      maxAltitude: 3600,
      bestSeason: "Jan-Feb (winter)",
      tags: ["ice", "river-walk"],
      itinerary: `Day 1: Reach Leh and drive to Chilling\nDay 2-9: Trek on frozen Zanskar river with camps`,
    },
    {
      slug: "nanda-devi-base-trek",
      name: "Nanda Devi Basecamp Trek",
      state: "Uttarakhand",
      difficulty: "HARD",
      duration: 6,
      distance: 60,
      maxAltitude: 3700,
      bestSeason: "May-Jun, Sep-Oct",
      tags: ["national-park", "views"],
      itinerary: `Day 1: Drive to Lata\nDay 2-6: Trek inside Nanda Devi Biosphere Reserve and return`,
    },
    {
      slug: "har-ki-dun-trek",
      name: "Har Ki Dun Trek",
      state: "Uttarakhand",
      difficulty: "MODERATE",
      duration: 6,
      distance: 65,
      maxAltitude: 3568,
      bestSeason: "May-Oct",
      tags: ["valley", "heritage"],
      itinerary: `Day 1: Drive to Sankri\nDay 2-6: Trek to Har Ki Dun valley and return`,
    },
    {
      slug: "valley-of-flowers-trek",
      name: "Valley of Flowers Trek",
      state: "Uttarakhand",
      difficulty: "EASY_MODERATE",
      duration: 4,
      distance: 24,
      maxAltitude: 3658,
      bestSeason: "Jul-Aug",
      tags: ["flowers", "national-park"],
      itinerary: `Day 1: Drive to Govindghat and trek to Ghangaria\nDay 2: Valley of Flowers visit\nDay 3: Hemkund Sahib visit\nDay 4: Return`,
    },
    {
      slug: "pindari-glacier-trek",
      name: "Pindari Glacier Trek",
      state: "Uttarakhand",
      difficulty: "MODERATE",
      duration: 6,
      distance: 64,
      maxAltitude: 3600,
      bestSeason: "May-Oct",
      tags: ["glacier", "views"],
      itinerary: `Day 1: Drive to Loharkhet\nDay 2-6: Trek to Pindari Glacier and return`,
    },
    {
      slug: "kafni-glacier-trek",
      name: "Kafni Glacier Trek",
      state: "Uttarakhand",
      difficulty: "MODERATE",
      duration: 7,
      distance: 70,
      maxAltitude: 3600,
      bestSeason: "May-Oct",
      tags: ["glacier", "remote"],
      itinerary: `Multi-day trek through remote valleys to Kafni Glacier and back`,
    },
    {
      slug: "nag-tibba-trek",
      name: "Nag Tibba Trek",
      state: "Uttarakhand",
      difficulty: "EASY",
      duration: 2,
      distance: 10,
      maxAltitude: 3022,
      bestSeason: "Oct-Jun",
      tags: ["weekend", "viewpoint"],
      itinerary: `Day 1: Drive to Pantwari and trek to Nag Tibba\nDay 2: Summit view and return`,
    },
    {
      slug: "goecha-la-trek",
      name: "Goecha La Trek",
      state: "Sikkim",
      difficulty: "MODERATE",
      duration: 7,
      distance: 70,
      maxAltitude: 4940,
      bestSeason: "Apr-Jun, Sep-Nov",
      tags: ["kanchenjunga-view", "alpine"],
      itinerary: `Approach and trek into Dzongri/Goecha La region for Kanchenjunga views`,
    },
    {
      slug: "dzongri-trek",
      name: "Dzongri Trek",
      state: "Sikkim",
      difficulty: "EASY_MODERATE",
      duration: 5,
      distance: 40,
      maxAltitude: 4120,
      bestSeason: "Apr-Jun, Sep-Nov",
      tags: ["meadows", "views"],
      itinerary: `Short trek to Dzongri and panoramic viewpoints near Kanchenjunga`,
    },
    {
      slug: "sandakphu-trek",
      name: "Sandakphu Trek",
      state: "West Bengal",
      difficulty: "MODERATE",
      duration: 4,
      distance: 45,
      maxAltitude: 3636,
      bestSeason: "Oct-May",
      tags: ["sunrise", "views"],
      itinerary: `Classic route through Singalila ridge to Sandakphu with views of Everest and Kanchenjunga`,
    },
    {
      slug: "phalut-trek",
      name: "Phalut Trek",
      state: "West Bengal",
      difficulty: "MODERATE",
      duration: 4,
      distance: 40,
      maxAltitude: 3600,
      bestSeason: "Oct-May",
      tags: ["ridge", "views"],
      itinerary: `Ridge trek from Sandakphu to Phalut with camping and sunrise views`,
    },
    {
      slug: "kareri-lake-trek",
      name: "Kareri Lake Trek",
      state: "Himachal Pradesh",
      difficulty: "EASY_MODERATE",
      duration: 3,
      distance: 18,
      maxAltitude: 2934,
      bestSeason: "May-Oct",
      tags: ["lake", "short"],
      itinerary: `Road to Kareri and short trek to Kareri Lake with camps`,
    },
    {
      slug: "kedarnath-trek",
      name: "Kedarnath Trek",
      state: "Uttarakhand",
      difficulty: "EASY_MODERATE",
      duration: 2,
      distance: 22,
      maxAltitude: 3580,
      bestSeason: "May-Nov",
      tags: ["pilgrimage", "short"],
      itinerary: `Trek/pony ride to Kedarnath shrine and return`,
    },
    {
      slug: "kinnaur-kailash-trek",
      name: "Kinnaur Kailash Trek",
      state: "Himachal Pradesh",
      difficulty: "HARD",
      duration: 7,
      distance: 70,
      maxAltitude: 4800,
      bestSeason: "Jun-Sep",
      tags: ["sacred", "ridge"],
      itinerary: `Approach and trek in Kinnaur region near Kinnaur Kailash`,
    },
    {
      slug: "spiti-valley-trek",
      name: "Spiti Valley Trek",
      state: "Himachal Pradesh",
      difficulty: "MODERATE",
      duration: 6,
      distance: 80,
      maxAltitude: 4500,
      bestSeason: "Jun-Sep",
      tags: ["high-altitude", "cold-desert"],
      itinerary: `Multiple-day trek across high-altitude Spiti landscapes`,
    },
    {
      slug: "chandrashila-trek",
      name: "Chandrashila Trek",
      state: "Uttarakhand",
      difficulty: "EASY",
      duration: 3,
      distance: 14,
      maxAltitude: 4000,
      bestSeason: "Oct-May",
      tags: ["sunrise", "short"],
      itinerary: `Trek to Tungnath and on to Chandrashila summit for panoramic views`,
    },
    {
      slug: "shrikhand-mahadev-trek",
      name: "Shrikhand Mahadev Trek",
      state: "Himachal Pradesh",
      difficulty: "HARD",
      duration: 3,
      distance: 30,
      maxAltitude: 3800,
      bestSeason: "Jun-Sep",
      tags: ["sacred", "steep"],
      itinerary: `Steep ascent to the Shrikhand Mahadev shrine and descent back`,
    },
    {
      slug: "gadsar-lake-trek",
      name: "Gadsar Lake Trek",
      state: "Jammu & Kashmir",
      difficulty: "MODERATE",
      duration: 6,
      distance: 60,
      maxAltitude: 3500,
      bestSeason: "Jul-Sep",
      tags: ["lakes", "kashmir"],
      itinerary: `Classic Kashmir lakes route visiting Gadsar and Vishansar`,
    },
    {
      slug: "ranthan-kharak-trek",
      name: "Ranthan Kharak Trek",
      state: "Uttarakhand",
      difficulty: "MODERATE",
      duration: 5,
      distance: 40,
      maxAltitude: 3500,
      bestSeason: "Apr-Jun",
      tags: ["rhododendron", "wildflowers"],
      itinerary: `Trail through rhododendron forests to high alpine meadows`,
    },
    {
      slug: "deoriatal-chandrashila-trek",
      name: "Deoriatal–Chandrashila Trek",
      state: "Uttarakhand",
      difficulty: "EASY_MODERATE",
      duration: 2,
      distance: 15,
      maxAltitude: 4000,
      bestSeason: "Mar-May, Sep-Nov",
      tags: ["lake", "summit"],
      itinerary: `Short trek combining Deoriatal lake and Chandrashila summit`,
    },
    {
      slug: "great-himalayan-national-park-trek",
      name: "Great Himalayan National Park Trek",
      state: "Himachal Pradesh",
      difficulty: "MODERATE",
      duration: 5,
      distance: 60,
      maxAltitude: 3500,
      bestSeason: "May-Oct",
      tags: ["wildlife", "park"],
      itinerary: `Multi-day trek through protected wilderness with guided routes`,
    },
    {
      slug: "serolsar-lake-trek",
      name: "Serolsar Lake Trek",
      state: "Himachal Pradesh",
      difficulty: "EASY",
      duration: 2,
      distance: 10,
      maxAltitude: 3120,
      bestSeason: "Apr-Nov",
      tags: ["lake", "short"],
      itinerary: `Short trail to Serolsar Lake with scenic viewpoints`,
    },
    {
      slug: "chehni-kund-trek",
      name: "Chehni Kundo / local trek",
      state: "Himachal Pradesh",
      difficulty: "EASY",
      duration: 2,
      distance: 12,
      maxAltitude: 3000,
      bestSeason: "Apr-Nov",
      tags: ["local", "short"],
      itinerary: `Local day/overnight trek through meadows and village trails`,
    },
  ];

  for (const t of moreTreks) {
    try {
      await prisma.trek.upsert({
        where: { slug: t.slug },
        update: {
          name: t.name,
          state: t.state,
          basePrice: 0,
          difficulty: t.difficulty || "MODERATE",
          duration: t.duration || 3,
          distance: t.distance || 0,
          maxAltitude: t.maxAltitude || null,
          bestSeason: t.bestSeason || null,
          tags: t.tags || [],
          itinerary: t.itinerary || "TBA",
        },
        create: {
          slug: t.slug,
          name: t.name,
          description: t.description || `${t.name} offered in ${t.state}`,
          longDescription:
            t.longDescription ||
            `${t.name} is a well-known trek in ${t.state}.`,
          state: t.state,
          basePrice: 0,
          difficulty: t.difficulty || "MODERATE",
          duration: t.duration || 3,
          distance: t.distance || 0,
          maxAltitude: t.maxAltitude || null,
          bestSeason: t.bestSeason || null,
          imageUrl: t.imageUrl || null,
          thumbnailUrl: t.thumbnailUrl || null,
          tags: t.tags || [],
          itinerary: t.itinerary || "TBA",
          inclusions: t.inclusions || ["Guide", "Camping/Meals as listed"],
          exclusions: t.exclusions || ["Transport to start", "Personal gear"],
          requirements: t.requirements || ["Moderate fitness"],
        },
      });
    } catch (e) {
      console.warn(
        `Skipping creation of ${t.slug}:`,
        (e as Error).message || e,
      );
    }
  }

  // Ensure existing treks have up-to-date itineraries (idempotent updates)
  const itineraryUpdates = [
    {
      slug: "beas-kund-trek",
      itinerary: `Day 1: Arrive Manali and transfer to base village; short acclimatisation walk
Day 2: Trek through forests and meadows to Tali Top or equivalent campsite
Day 3: Ascend to Beas Kund (alpine lake) and explore surrounding ridges
Day 4: Return to Tali Top and descent towards Manali
Day 5: Buffer / depart`,
    },
    {
      slug: "ranisui-lake-trek",
      itinerary: `Day 1: Arrive Manali and reach trailhead
Day 2: Trek to Prini Village then proceed towards Solang campsite
Day 3: Ascend to Ranisui Lake and camp near the lake
Day 4: Descend back to Manali and depart`,
    },
    {
      slug: "bhrigu-lake-trek",
      itinerary: `Day 1: Arrive Kullu/Manali and reach trailhead
Day 2: Trek to Rishi Farmstead or base meadow
Day 3: Ascend to Seri Top and onward to Bhrigu Lake
Day 4: Rest/photography day at the lake
Day 5: Begin return trek to base
Day 6: Complete descent and depart`,
    },
    {
      slug: "hampta-pass-trek",
      itinerary: `Day 1: Drive Manali → Jobra/Chatru, short acclimatisation walk and camp
Day 2: Trek to Balu Ka Ghera (meadows) and camp
Day 3: Approach Hampta pass area and prepare for crossing
Day 4: Cross Hampta Pass and descend into Lahaul (Chatru)
Day 5: Trek down and drive back towards Manali
Day 6: Buffer / departure`,
    },
    {
      slug: "pin-parvati-pass-trek",
      itinerary: `Day 1: Reach Barshaini and trek to Pulga
Day 2: Trek to Mantalai
Day 3: Trek to Thakur Kuan / approach
Day 4: Approach glacier sections and high camp
Day 5: Cross Pin Parvati Pass and descend into Pin Valley
Day 6-9: Exit through Pin Valley villages`,
    },
    {
      slug: "triund-trek",
      itinerary: `Day 1: Drive to McLeodganj, trek to Triund and camp
Day 2: Sunrise at the Dhauladhar ridge; descend to McLeodganj`,
    },
    {
      slug: "prashar-lake-trek",
      itinerary: `Day 1: Reach Mandi and drive to trailhead; camp nearby
Day 2: Trek to Prashar Lake, visit island temple and camp
Day 3: Return to Mandi and depart`,
    },
    {
      slug: "indrahara-pass-trek",
      itinerary: `Day 1: Trek McLeodganj → Triund (overnight)
Day 2: Triund → Lahesh Caves (camp)
Day 3: Summit Indrahar (ridge) and camp or begin descent
Day 4: Descend and return to McLeodganj`,
    },
    {
      slug: "kheerganga-trek",
      itinerary: `Day 1: Drive to Barshaini and trek to Kheerganga; soak in hot springs and camp
Day 2: Return trek to Barshaini and depart`,
    },
  ];

  for (const u of itineraryUpdates) {
    try {
      await prisma.trek.update({
        where: { slug: u.slug },
        data: {
          itinerary: u.itinerary,
        },
      });
      console.log(`Updated itinerary for ${u.slug}`);
    } catch (e) {
      console.warn(`Could not update ${u.slug}:`, (e as Error).message || e);
    }
  }

  console.log("✅ Database seeded/updated successfully!");
  console.log(`
  Created base treks and ${moreTreks.length} additional treks (price on request).

  Updated itineraries for ${itineraryUpdates.length} treks.

  Next steps:
  1. Update trek images in Cloudinary
  2. Create admin user for dashboard
  3. Test booking system with your local data
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
