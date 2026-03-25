# Trail Makers — Product Requirements Document (PRD)

- **Version:** 1.0
- **Status:** MVP
- **Date:** March 2026
- **Product Type:** Trek discovery, booking, and operations platform

---

## 1. Product Overview

Trail Makers is a trekking discovery and online booking platform for curated nature-first trekking experiences.  
The product must help users:

- discover treks easily,
- evaluate trek suitability confidently,
- book departures with full online payment,
- manage bookings and cancellations,
- access preparation material before the trek.

The platform must also help the business:

- manage trek inventory and departures,
- support dynamic pricing,
- publish and manage content,
- handle bookings, refunds, GST invoices, and exports,
- run operations through role-based dashboards.

---

## 2. Vision and Brand Direction

### 2.1 Brand Positioning

Trail Makers stands for:

- sustainability,
- raw nature over materialistic luxury,
- rustic charm,
- carefully crafted outdoor experiences,
- minimal but emotionally rich storytelling.

The visual and product experience should feel:

- grounded,
- premium but not flashy,
- immersive,
- trustworthy,
- calm and legible.

### 2.2 Design Principles

- Minimalistic layouts with generous whitespace.
- Strong content hierarchy.
- Rustic, nature-inspired color language.
- Dark mode and light mode from day one.
- One sunset-inspired accent color for CTAs and emphasis.
- Serif + sans-serif combination for aesthetic but readable typography.
- Subtle animations only; no distracting effects.
- Accessibility and readability should never be compromised for aesthetics.

### 2.3 Visual Direction

#### Light Mode
- Warm off-white / parchment backgrounds.
- Earthy browns, muted greens, stone neutrals.
- Sunset orange / amber accent.
- Strong text contrast.

#### Dark Mode
- Deep charcoal / forest-night surfaces.
- Warm light text tones.
- Same sunset accent adapted for dark backgrounds.
- High contrast interactive elements.

### 2.4 Typography

- **Serif:** Used for headings, hero text, and emotional brand moments.
- **Sans-serif:** Used for body copy, labels, forms, data, and dashboards.

Recommended pairing:
- **Headings:** Lora / Playfair Display / Merriweather
- **Body/UI:** Inter / Manrope / Source Sans

---

## 3. Goals

### 3.1 Business Goals

- Increase direct online bookings.
- Reduce manual booking coordination.
- Improve departure seat utilization.
- Enable dynamic pricing for better revenue optimization.
- Build trust through rich trek content and transparent policies.
- Support content-led growth through blogs and SEO.

### 3.2 User Goals

- Quickly discover relevant treks.
- Understand fitness, difficulty, route, weather, and packing needs.
- View available dates and live seat availability.
- Complete payment securely.
- Manage bookings and cancellations independently.
- Download trek-related preparation material.

---

## 4. User Roles

### 4.1 Public User
A visitor browsing the website without logging in.

### 4.2 Registered User
A logged-in customer who can book treks, pay online, download invoices, and cancel bookings.

### 4.3 Super Admin
Full control over the platform, including treks, departures, content, pricing, bookings, users, testimonials, finance, settings, and role management.

### 4.4 Media Admin
Can manage blogs, images, videos, and trek media/content sections.  
Can manage testimonials only if permitted by super admin.

### 4.5 Account Admin
Can manage bookings, accounting, finance tracking, GST invoices, refunds, coupon usage, and financial exports.

---

## 5. MVP Scope

### Included in MVP

- Home page
- All Treks page
- Treks by State discovery
- Trek detail pages
- Blog listing and blog detail pages
- Login / Signup / Forgot Password / Reset Password
- User dashboard
- Admin dashboard with multiple roles
- Full online payment using Razorpay
- Direct user cancellation
- Refund handling
- Dynamic pricing
- GST invoices
- Discount coupons
- Finance export
- Contact and About pages
- Downloadable trek PDFs
- Maps and route visuals on trek pages
- Image and video management
- Testimonial management
- Dark mode and light mode

### Not Mandatory for MVP

- Waitlist
- Reviews from customers
- Social login
- Multi-language
- SMS notifications
- Offline booking support
- Guide-side dashboard

---

## 6. Information Architecture

## Public Pages
- Home
- All Treks
- Treks by State
- Trek Detail
- Blog Listing
- Blog Detail
- About
- Contact
- Login
- Signup
- Forgot Password
- Reset Password
- Terms
- Privacy Policy
- Cancellation Policy
- Refund Policy

## Authenticated User Pages
- Dashboard Overview
- Upcoming Bookings
- Past Bookings
- Booking Details
- Profile
- Invoices
- Saved Treks (optional MVP)
- Security Settings

## Admin Pages
- Dashboard Overview
- Trek Management
- Departure Dates / Inventory
- Dynamic Pricing Rules
- Bookings
- Customers
- Blogs
- Media Library
- Testimonials
- Coupons
- Finance
- GST / Invoices
- Refunds
- Exports / Reports
- Settings
- Role Management
- Audit Log

---

## 7. Functional Requirements

## 7.1 Home Page

### Objective
Introduce the brand, establish trust, and push users toward trek discovery and booking.

### Sections
1. Hero banner
2. Search / Explore CTA
3. Upcoming treks
4. Treks by state
5. Featured treks
6. Why Trail Makers
7. Sustainability section
8. Testimonials
9. Latest blogs
10. Newsletter / inquiry CTA
11. Footer

### Hero Requirements
- Large immersive banner image/video
- Headline and subheadline aligned to brand voice
- Primary CTA: `Explore Treks`
- Secondary CTA: `Our Philosophy` or `About Us`
- Optional quick filters: state, duration, difficulty

---

## 7.2 All Treks Page

### Objective
Allow users to discover and compare treks efficiently.

### Features
- Search
- Sort
- Filter
- Pagination or infinite scroll

### Filters
- State
- Difficulty
- Fitness level
- Duration
- Price range
- Season
- Altitude
- Trek type

### Sort Options
- Popular
- Newest
- Price: low to high
- Price: high to low
- Duration
- Difficulty
- Upcoming departures

### Trek Card Content
- Cover image
- Trek name
- State
- Duration
- Difficulty
- Fitness level
- Starting price / price range
- Next departure
- Seats left badge
- CTA: `View Details`

---

## 7.3 Trek Detail Page

### Objective
Provide complete information and drive booking conversion.

### Core Sections
1. Hero banner
2. Quick facts
3. Sticky booking panel
4. Overview
5. Trek highlights
6. Itinerary
7. Route / map visuals
8. Difficulty and fitness level
9. Weather and seasonality
10. Inclusions / exclusions
11. Packing checklist
12. Exercises / preparation guide
13. Downloadable PDFs
14. FAQs
15. Gallery
16. Videos
17. Testimonials / related treks
18. Footer CTA

### Sticky Booking Panel
Must include:
- upcoming departure dates,
- date selection,
- seat availability,
- dynamic price display,
- traveler count,
- coupon field,
- GST calculation,
- final amount,
- `Book Now` CTA.

### Downloadables
Each trek can have:
- itinerary PDF,
- exercise / preparation PDF,
- packing checklist PDF,
- trek summary PDF.

### Trek Facts
- duration,
- region / state,
- altitude,
- route type,
- terrain type,
- difficulty level,
- fitness level,
- batch size,
- age guidance,
- weather summary,
- ideal season.

---

## 7.4 Blog

### Blog Listing
- Featured image
- Title
- Excerpt
- Category
- Date
- Search
- Filter by category
- Pagination

### Blog Detail
- Hero image
- Title
- Meta information
- Rich article content
- Embedded images
- Related articles
- CTA to related trek or contact

### Admin Capabilities
- Create
- Edit
- Save draft
- Publish / unpublish
- Delete
- Schedule publishing
- Manage SEO metadata

---

## 7.5 Authentication

### Features
- Signup
- Login
- Forgot password
- Reset password
- Email verification
- Session management

### Signup Fields
- Name
- Email
- Phone (optional or required based on business need)
- Password
- Confirm password
- Terms acceptance

---

## 7.6 Booking Flow

### Step 1 — Select Trek Details
- Selected trek summary
- Departure date
- Traveler count
- Live availability
- Dynamic price
- Coupon code
- GST
- Total

### Step 2 — Traveler Details
For each traveler:
- Full name
- Age
- Gender (optional)
- Contact number
- Emergency contact
- Medical / health notes
- Dietary notes (optional)

### Step 3 — Review
- Booking summary
- Traveler summary
- Fare breakdown
- Terms acceptance
- Cancellation policy acceptance

### Step 4 — Payment
- Razorpay checkout
- Success / failure / pending handling
- Booking confirmation creation only after verified payment state

### Step 5 — Confirmation
- Booking ID
- Trek and departure details
- Paid amount
- Invoice download
- Next steps
- Link to dashboard

---

## 7.7 Cancellation and Refunds

### User Capabilities
Users must be able to cancel directly from their dashboard without admin intervention.

### Cancellation Requirements
- Show applicable refund amount before final confirmation
- Show cancellation policy clearly
- Capture optional cancellation reason
- Update booking status instantly
- Trigger refund workflow
- Generate cancellation confirmation email
- Reflect refund status in dashboard

### Refund Requirements
- Razorpay refund initiation
- Refund status tracking
- GST handling as per business/accounting rules
- Finance records updated automatically
- Refund visible in user invoice/payment history

---

## 7.8 User Dashboard

### Sections
- Dashboard Overview
- Upcoming Bookings
- Past Bookings
- Booking Details
- Profile
- Invoices and Payments
- Saved Treks (optional MVP)

### Dashboard Overview
- Welcome card
- Upcoming trek summary
- Booking statistics
- Quick actions

### Booking Details
- Trek details
- Departure details
- Travelers
- Payment details
- Invoice
- Cancellation action
- Refund status
- Downloaded resources

---

## 7.9 Admin Dashboard

## Roles and Permissions

| Module | Super Admin | Media Admin | Account Admin |
|---|---|---|---|
| Manage Treks | Yes | Limited content only | No |
| Manage Departure Dates | Yes | No | Limited view |
| Manage Pricing | Yes | No | View |
| Manage Blogs | Yes | Yes | No |
| Manage Images/Videos | Yes | Yes | No |
| Manage Testimonials | Yes | Yes | No |
| Manage Bookings | Yes | No | Yes |
| Manage Refunds | Yes | No | Yes |
| Manage GST / Invoices | Yes | No | Yes |
| Finance Export | Yes | No | Yes |
| Role Management | Yes | No | No |
| Settings | Yes | No | Limited |

### Super Admin Modules
- Dashboard overview
- Trek CRUD
- Departure date CRUD
- Inventory and seats
- Pricing rules
- Testimonials
- Settings
- Role management
- Audit logs

### Media Admin Modules
- Blog management
- Trek media
- Trek content sections
- Image library
- Video library
- Gallery management

### Account Admin Modules
- Booking list
- Booking detail view
- Refund management
- Coupon management
- GST and invoices
- Finance dashboard
- Reports and exports

---

## 8. Dynamic Pricing Requirements

Trail Makers supports dynamic pricing at the departure level.

### Pricing Types
- Early bird pricing
- Seasonal pricing
- Demand-based pricing
- Manual promotional pricing
- Coupon-based discount pricing

### Pricing Logic
Each departure can have:
- base price,
- early bird price and validity,
- demand threshold rules,
- seasonal override,
- coupon applicability,
- GST configuration.

### Examples
- Early bird valid until a set date or seat threshold.
- Demand-based price activates after a specific occupancy threshold.
- Seasonal prices can be configured by date range.

### Booking UI Requirements
Users must always see:
- current applicable price,
- original price if discounted,
- coupon savings,
- GST amount,
- final payable amount.

---

## 9. Finance, GST, Coupons, and Exports

### Finance Tracking
The platform must track:
- booking revenue,
- discounts,
- refunds,
- GST collected,
- net revenue,
- payment status,
- payout-related references.

### GST Invoices
Generate downloadable GST invoices for completed bookings.

Invoice should include:
- company legal details,
- GSTIN,
- customer details,
- booking details,
- taxable amount,
- GST split or total,
- final amount,
- payment reference.

### Coupons
Coupon engine must support:
- flat discounts,
- percentage discounts,
- date-limited coupons,
- usage-limited coupons,
- trek-specific coupons,
- global coupons,
- minimum order value rules.

### Finance Export
Export formats:
- CSV
- XLSX (preferred if implemented)
- filtered exports by date range, trek, booking status, refund status

---

## 10. Media and Content Management

### Media Types
- Trek cover images
- Gallery images
- Videos
- Blog featured images
- Testimonial images
- Route visuals
- PDF assets

### Content Operations
- Upload
- Replace
- Delete
- Reorder
- Assign alt text
- Tag by trek / blog / testimonial
- Compress and optimize

### Testimonials
Super admin can create, edit, feature, and remove testimonials.  
Media admin can manage testimonial media where permitted.

---

## 11. Non-Functional Requirements

### Performance
- Fast initial load
- Optimized images
- Lazy loading for galleries
- Good Lighthouse performance
- Mobile-first optimization

### Accessibility
- Keyboard navigable
- Proper heading hierarchy
- Color contrast compliant
- Visible focus states
- Screen-reader-friendly labels
- Accessible forms and errors

### Security
- Secure authentication
- Hashed passwords
- Protected admin routes
- Payment verification through server-side validation
- Audit logging for admin actions
- Secure file access rules

### Reliability
- Prevent overselling
- Prevent duplicate booking creation on payment retries
- Webhook-safe payment reconciliation
- Soft delete where appropriate for traceability

### SEO
- Meta titles and descriptions
- Open Graph tags
- Clean URLs
- Structured content for blogs and treks
- Indexable blog and trek pages

---

## 12. Suggested Data Model

### Core Entities
- User
- AdminUser
- Trek
- TrekDeparture
- Booking
- Traveler
- Payment
- Refund
- Coupon
- Invoice
- Blog
- MediaAsset
- Testimonial
- Inquiry
- AuditLog

### Key Relationships
- One trek has many departures
- One booking belongs to one departure
- One booking has many travelers
- One payment belongs to one booking
- One refund may belong to one payment
- One trek has many media assets
- One blog has many media assets

---

## 13. Suggested Tech Direction

### Frontend
- Next.js or React-based SSR-friendly framework
- TypeScript
- Responsive UI
- Design system for theme support
- Dark/light mode support

### Backend
- Node.js
- REST or typed API
- PostgreSQL
- ORM
- Background jobs or webhook processing for payment and refund events

### Integrations
- Razorpay
- Email provider
- Cloud storage for media and PDFs
- Analytics
- Error monitoring

---

## 14. Success Metrics

### Business Metrics
- Booking conversion rate
- Revenue per month
- Average order value
- Occupancy rate per departure
- Refund rate
- Coupon usage rate

### Product Metrics
- Search-to-detail click rate
- Trek detail to booking-start rate
- Booking-start to payment-success rate
- Blog engagement
- Dashboard usage
- Cancellation self-service rate

### Operational Metrics
- Refund processing time
- Invoice generation accuracy
- Admin handling time per booking
- Seat utilization

---

## 15. Acceptance Criteria Summary

### Public Site
- Users can browse, filter, and sort treks.
- Users can open complete trek detail pages.
- Trek pages show maps, route visuals, fitness, difficulty, weather, inclusions, exclusions, and downloadable PDFs.

### Booking
- Users can select a departure date and see live seats.
- Users can pay full amount online with Razorpay.
- Price reflects dynamic pricing and coupons.
- GST is shown clearly.
- Successful payment creates a confirmed booking.

### Dashboard
- Users can view current and past bookings.
- Users can download invoices.
- Users can cancel directly.
- Users can view refund progress.

### Admin
- Super admin can manage treks, departures, settings, testimonials, and roles.
- Media admin can manage blogs and media assets.
- Account admin can manage bookings, refunds, invoices, coupons, and finance exports.

---

## 16. Future Enhancements

- Waitlist for sold-out departures
- Customer reviews and ratings
- Group booking workflow
- WhatsApp / SMS alerts
- Guide-side operations tools
- CRM integration
- Loyalty program
- Multi-language content
- Recommendation engine

---

## 17. Final Product Summary

Trail Makers MVP is a content-rich trekking website and transaction platform with:

- a strong nature-first brand experience,
- detailed trek storytelling,
- dynamic departure-based pricing,
- full online payment,
- direct cancellations and refunds,
- GST-compliant invoicing,
- multi-role admin operations,
- blog and media publishing,
- a polished dark/light themed UI.

The product should feel authentic, trustworthy, minimal, and operationally efficient from day one.

---
