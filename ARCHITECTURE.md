/\*\*

- PRODUCTION-READY TREKKING BOOKING PLATFORM
- Complete Architecture Documentation
-
- This document outlines the production-ready architecture for a trekking
- booking platform built with Next.js, PostgreSQL, and Prisma.
  \*/

# Complete Trekking Booking Platform Architecture

## Current Delivery Conventions

- Public catalog and content routes should default to server rendering with ISR where practical.
- Client components should be reserved for interactive islands such as booking forms, search interactions, and authenticated dashboards.
- Route protection for this Next 16 codebase is implemented in `src/proxy.ts`.
- API routes should use the shared Prisma singleton from `src/lib/prisma.ts` and avoid instantiating additional clients.
- Route groups with meaningful server work should provide `loading.tsx` and `error.tsx` boundaries.
- Shared UI primitives should expose typed props instead of `any`.
- Prisma seed ownership is centralized through the configured Prisma seed command.

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [API Routes](#api-routes)
3. [Transaction Safety](#transaction-safety)
4. [Error Handling](#error-handling)
5. [Security Best Practices](#security-best-practices)
6. [Deployment Checklist](#deployment-checklist)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scalability Considerations](#scalability-considerations)

---

## Database Schema

### Overview

The database consists of 7 interconnected tables designed for:

- **Data consistency**: Proper relationships and constraints
- **Performance**: Indexed fields for common queries
- **Audit trail**: Complete history of all operations
- **Seat management**: Atomic booking operations

### Models

#### 1. **User** (Already exists)

Stores authentication and profile information
\`\`\`
Columns: id, email, username, password, firstName, lastName, phoneNumber, address, city, state, pincode
Indexes: email, createdAt
\`\`\`

#### 2. **Trek**

Static trek information
\`\`\`
Columns:

- id (CUID): Primary key
- slug: Unique URL-friendly identifier
- name: Trek name
- description: Short description
- longDescription: Full description
- state: Location (state)
- basePrice: Price in paise (100 paise = ₹1)
- difficulty: ENUM (EASY, MODERATE, HARD, etc.)
- duration: Days
- distance: km (optional)
- maxAltitude: meters (optional)
- bestSeason: String
- imageUrl, thumbnailUrl: Media files
- itinerary, inclusions, exclusions, requirements: Text fields
- tags: Array for categorization

Indexes: slug (unique), difficulty, state, fulltext on name/description
\`\`\`

#### 3. **Departure**

Individual trek batches with seat availability
\`\`\`
Columns:

- id (CUID): Primary key
- trekId: Foreign key to Trek
- startDate: When trek starts
- endDate: When trek ends
- seatsAvailable: Current available seats
- totalSeats: Total capacity
- pricePerPerson: Specific price for this batch
- isCancelled: Boolean flag
- cancellationReason: Text

Constraints:

- UNIQUE(trekId, startDate): Prevent duplicate batches
- Foreign key: trekId → Trek.id (ON DELETE CASCADE)

Indexes: trekId, startDate, isCancelled
\`\`\`

#### 4. **Booking**

Customer bookings linked to departures
\`\`\`
Columns:

- id (CUID): Primary key
- userId: Foreign key to User
- departureId: Foreign key to Departure
- numberOfPeople: How many seats
- totalAmount: numberOfPeople \* pricePerPerson (denormalized for history)
- status: ENUM (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- contactName, contactPhone, contactEmail: Booking contact info
- cancellationReason: Why booking was cancelled
- cancelledAt: When cancelled

Constraints:

- UNIQUE(userId, departureId): One booking per user per departure
- Foreign keys: userId → User.id, departureId → Departure.id (ON DELETE CASCADE)

Indexes: userId, departureId, status, createdAt
\`\`\`

#### 5. **Payment**

Payment tracking and transactions
\`\`\`
Columns:

- id (CUID): Primary key
- bookingId: Foreign key to Booking (UNIQUE, one-to-one)
- userId: Foreign key to User
- amount: Amount in paise
- status: ENUM (PENDING, COMPLETED, FAILED, REFUNDED)
- paymentGateway: "razorpay", "stripe", etc.
- transactionId: Gateway transaction ID (UNIQUE for idempotency)
- paymentIntentId: For idempotency in retry scenarios
- metadata: JSON string for additional data
- errorMessage: Why payment failed
- refundAmount, refundedAt, refundTransactionId: Refund details

Indexes: userId, bookingId, status, createdAt
\`\`\`

#### 6. **TrekReview**

Customer reviews and ratings
\`\`\```

#### 7. **AuditLog**

Complete audit trail for compliance
\`\`\`
Records: BOOKING_CREATED, PAYMENT_COMPLETED, BOOKING_CANCELLED, etc.
Columns: id, action, entityType, entityId, userId, changes (JSON), metadata (JSON), createdAt

Purpose: Regulatory compliance, debugging, audit trail
\`\`\`

---

## API Routes

### RESTful Endpoint Structure

```
/api/
├── treks/
│   ├── route.ts (GET list, POST create)
│   ├── [slug]/
│   │   └── route.ts (GET single trek by slug)
│   └── [id]/stats
│       └── route.ts (GET trek statistics)
├── departures/
│   └── [id]/
│       ├── availability/route.ts (GET availability)
│       └── route.ts (GET/PATCH departure)
└── bookings/
    ├── route.ts (GET user bookings, POST create booking)
    └── [id]/
        ├── route.ts (GET booking, PATCH cancel)
        └── availability/route.ts (Check if user can book)
```

### Example: Creating a Booking (Most Complex)

```typescript
// Request
POST /api/bookings
{
  "departureId": "cm123...",
  "numberOfPeople": 2,
  "contactName": "John Doe",
  "contactPhone": "+919876543210",
  "contactEmail": "john@example.com"
}

// Success Response (201)
{
  "success": true,
  "data": {
    "id": "bk123...",
    "userId": "usr123...",
    "departureId": "dep123...",
    "numberOfPeople": 2,
    "totalAmount": 40000, // In paise (₹400 in INR)
    "status": "PENDING",
    "createdAt": "2024-02-17T10:30:00Z",
    "departure": {
      "id": "dep123...",
      "trek": { "id": "trk123...", "name": "Beas Kund Trek" }
    }
  }
}

// Error Response (409 Conflict)
{
  "success": false,
  "error": {
    "message": "Not enough seats available for this departure",
    "code": "INSUFFICIENT_SEATS",
    "statusCode": 409
  }
}
```

---

## Transaction Safety

### The Race Condition Problem

Without proper transactions, this scenario can occur:

```
Time  | User A              | User B              | DB State
------|---------------------|---------------------|----------
T1    | Check seats: 3      |                     | Available: 3
T2    |                     | Check seats: 3      | Available: 3
T3    | Book 2 seats        |                     | Update: 1
T4    |                     | Book 2 seats        | Update: -1 (OVERBOOKED!)
T5    | Create booking      |                     | Total: -1 (ERROR)
T6    |                     | Create booking      |
```

### Solution: Serializable Transactions

The `BookingService.createBooking()` method uses PostgreSQL transactions:

```typescript
const booking = await prisma.$transaction(
  async (tx) => {
    // Step 1: Prevent duplicate bookings
    const existing = await tx.booking.findUnique({
      where: { userId_departureId: { userId, departureId } },
    });
    if (existing) throw new DuplicateBookingError();

    // Step 2: Get latest seat count WITHIN transaction
    const departure = await tx.departure.findUnique({
      where: { id: departureId },
    });
    if (departure.seatsAvailable < numberOfPeople) {
      throw new InsufficientSeatsError();
    }

    // Step 3: Atomic update - decrements seats and creates booking
    await tx.departure.update({
      where: { id: departureId },
      data: { seatsAvailable: { decrement: numberOfPeople } },
    });

    // Step 4: Create booking record
    const booking = await tx.booking.create({
      /* ... */
    });

    // Step 5: Audit log
    await tx.auditLog.create({
      /* ... */
    });

    return booking;
  },
  {
    isolationLevel: "Serializable", // CRITICAL: Prevents all race conditions
    timeout: 10000,
  },
);
```

### Why This Works

- **Serializable isolation**: Transactions execute sequentially, not in parallel
- **Atomic operations**: All or nothing - no partial updates
- **Read-within-transaction**: Seat count is checked within the transaction
- **Audit trail**: Every action is logged
- **Timeout**: Prevents hung transactions from locking tables

---

## Error Handling

### Error Class Hierarchy

```
AppError (base)
├── ValidationError (400)
├── UnauthorizedError (401)
├── NotFoundError (404)
├── ConflictError (409)
│   ├── InsufficientSeatsError
│   └── DuplicateBookingError
├── PaymentRequiredError (402)
└── RateLimitError (429)
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "User-friendly message",
    "code": "MACHINE_READABLE_CODE",
    "statusCode": 400
  }
}
```

### Example: Handling Concurrent Bookings

```typescript
try {
  const booking = await BookingService.createBooking(/*...*/);
  return NextResponse.json({ success: true, data: booking }, { status: 201 });
} catch (error) {
  if (error instanceof InsufficientSeatsError) {
    // 409 Conflict - seats full
    return NextResponse.json(createErrorResponse(error), { status: 409 });
  } else if (error instanceof DuplicateBookingError) {
    // 409 Conflict - user already booked
    return NextResponse.json(createErrorResponse(error), { status: 409 });
  } else if (error instanceof ValidationError) {
    // 400 Bad Request
    return NextResponse.json(createErrorResponse(error), { status: 400 });
  } else if (error instanceof UnauthorizedError) {
    // 401 Unauthorized
    return NextResponse.json(createErrorResponse(error), { status: 401 });
  } else {
    // 500 Internal Server Error (log this!)
    console.error("Unexpected booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error", code: "INTERNAL_ERROR" },
      },
      { status: 500 },
    );
  }
}
```

---

## Security Best Practices

### 1. Authentication & Authorization

```typescript
// Always verify session
const session = await getServerSession();
if (!session?.user?.id) {
  throw new UnauthorizedError("Must be logged in");
}

// Verify user owns resource
if (booking.userId !== session.user.id) {
  throw new UnauthorizedError("Cannot access other user's booking");
}
```

### 2. Input Validation

```typescript
// Use Zod for runtime validation
const validatedData = createBookingSchema.parse(request.body);

// Zod checks:
// - Type correctness
// - String lengths
// - Email format
// - Phone number format
// - Enum values
// - Custom validations (e.g., future dates)
```

### 3. SQL Injection Prevention

```typescript
// SAFE: Prisma parameterizes queries
const trek = await prisma.trek.findUnique({ where: { slug } });

// NOT safe (don't do this):
// SELECT * FROM treks WHERE slug = '${slug}'; // Vulnerable!
```

### 4. Rate Limiting

```typescript
// Implement rate limiting for sensitive endpoints
// Suggested: 10 bookings per user per hour
// Use: upstash/redis or similar

app.use(
  rateLimit({
    keyGenerator: (req) => req.user.id,
    skip: (req) => req.path === "/api/public/...",
    handler: () => {
      throw new RateLimitError("Too many requests");
    },
  }),
);
```

### 5. Data Sensitivity

```typescript
// NEVER return passwords
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    username: true,
    // password: false (implicitly excluded)
  },
});

// Store sensitive data encrypted
// Passwords: bcrypt (already done)
// Payment data: Never store full credit card numbers
// PII: Encrypt in database if required
```

### 6. CORS & CSRF

```typescript
// Set proper CORS headers
const response = new NextResponse(data);
response.headers.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
response.headers.set(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, PATCH, DELETE",
);
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-Frame-Options", "DENY");
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass
- [ ] No console.logs in production code
- [ ] Environment variables configured (.env.production)
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] CORS origins whitelisted
- [ ] Payment gateway sandbox testing complete
- [ ] Email service configured (for booking confirmations)

### Environment Variables (.env.production)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/prod_db

# NextAuth
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=https://www.yourdomain.com

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Logging & Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://xxx@sentry.io/xxx
DATADOG_API_KEY=xxx

# Email Service
SENDGRID_API_KEY=xxx

# Redis (for caching & rate limiting)
REDIS_URL=redis://redis-prod:6379
```

### Database Migrations

```bash
# Run migrations in production
npx prisma migrate deploy

# Backup before migration
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Deployment Platforms

**Recommended for Next.js:**

- **Vercel** (easiest, integrated with Next.js)
- **Railway** (simple, PostgreSQL included)
- **Heroku** (traditional, reliable)
- **AWS** (most scalable, complex setup)

**Database Hosting:**

- **Neon** (Postgres, free tier available)
- **Supabase** (Postgres + Auth + Storage)
- **AWS RDS** (enterprise-grade)

---

## Monitoring & Logging

### 1. Application Logging

```typescript
// Use structured logging
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log important events
logger.info("Booking created", {
  bookingId: "bk123",
  userId: "usr123",
  departureId: "dep123",
});

logger.error("Payment failed", {
  bookingId: "bk123",
  error: error.message,
  gateway: "razorpay",
});
```

### 2. Performance Monitoring

```typescript
// Monitor database query performance
const startTime = Date.now();
const booking = await BookingService.createBooking(/*...*/);
const duration = Date.now() - startTime;

if (duration > 5000) {
  logger.warn("Slow booking creation", {
    duration,
    userId,
    departureId,
  });
}
```

### 3. Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
});

// Errors are automatically captured
// Add context for better debugging
Sentry.setContext("booking", {
  departureId,
  numberOfPeople,
});
```

### 4. Alerts & Notifications

```typescript
// Alert on critical events
async function notifyAdmins(event: string, data: any) {
  await sendEmail({
    to: process.env.ADMIN_EMAILS,
    subject: `ALERT: ${event}`,
    body: JSON.stringify(data, null, 2),
  });
}

// Examples:
// - Payment failures
// - High booking failure rate
// - Database errors
// - Rate limiting triggered
```

### 5. Dashboard Metrics

Track:

- **Booking metrics**: Total bookings, conversion rate, average value
- **Payment metrics**: Success rate, refund rate, revenue
- **System metrics**: API response time, error rate, uptime
- **User metrics**: Active users, retention, signups

---

## Scalability Considerations

### 1. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_bookings_user_status
  ON bookings(user_id, status);

CREATE INDEX idx_departures_trek_date
  ON departures(trek_id, start_date);

-- Partition large tables by date/status
CREATE TABLE bookings_2024_q1
  PARTITION OF bookings FOR VALUES FROM (2024-01-01) TO (2024-04-01);
```

### 2. Caching Strategy

```typescript
// Cache trek data (stable, infrequently changes)
const trek = await cache(
  () => TrekService.getTrekBySlug(slug),
  ["trek", slug],
  { revalidate: 3600 }, // 1 hour
);

// Don't cache availability (changes frequently)
const availability = await BookingService.checkAvailability(departureId);
// (no cache)

// Cache user profile
const user = await cache(
  () => prisma.user.findUnique({ where: { id } }),
  ["user", id],
  { revalidate: 300 }, // 5 minutes
);
```

### 3. Read Replicas

```typescript
// Read from replica, write to primary
const bookings = await replicaDb.booking.findMany({
  where: { userId },
});

// Always write to primary
await primaryDb.booking.create({
  /* ... */
});
```

### 4. Asynchronous Processing

```typescript
// Send confirmation email in background
await publishEvent("booking.created", {
  bookingId,
  userId,
  email: user.email,
});

// Handle in separate worker
messageQueue.consume("booking.created", async (event) => {
  await sendConfirmationEmail(event.email);
  await notifyGuide(event.bookingId);
});
```

### 5. Connection Pooling

```typescript
// .env
DATABASE_URL =
  "postgresql://...?schema=public&poolingMode=transaction&max_pool_size=20";

// Prisma handles this automatically
```

### 6. Load Balancing

Deploy multiple Next.js instances behind:

- **Nginx** (reverse proxy)
- **Load balancer** (AWS ALB, Google Cloud Load Balancer)
- **Edge network** (Cloudflare, Akamai)

```nginx
upstream next_servers {
  server 10.0.1.1:3000;
  server 10.0.1.2:3000;
  server 10.0.1.3:3000;
}

server {
  location / {
    proxy_pass http://next_servers;
  }
}
```

### Estimated Capacity

With a single PostgreSQL instance:

- **100 concurrent users**: Easy
- **1000 concurrent users**: With caching & optimization
- **10,000+ concurrent users**: Requires read replicas, caching layer (Redis), load balancing

---

## Testing Strategy

### Unit Tests

```typescript
describe("BookingService", () => {
  it("should create booking and decrease seats", async () => {
    const booking = await BookingService.createBooking(/*...*/);
    expect(booking.id).toBeDefined();

    const departure = await prisma.departure.findUnique({});
    expect(departure.seatsAvailable).toBeLessThan(initialSeats);
  });

  it("should throw InsufficientSeatsError when seats full", async () => {
    await expect(
      BookingService.createBooking(userId, departureId, 100),
    ).rejects.toThrow(InsufficientSeatsError);
  });
});
```

### Integration Tests

```typescript
describe("Booking API", () => {
  it("should handle concurrent bookings correctly", async () => {
    const promises = Array(10)
      .fill(null)
      .map(() =>
        fetch("/api/bookings", {
          method: "POST",
          body: JSON.stringify({
            departureId,
            numberOfPeople: 1,
            /*...*/
          }),
        }),
      );

    const responses = await Promise.all(promises);
    const successes = responses.filter((r) => r.ok).length;

    // Only 5 should succeed if 5 seats available
    expect(successes).toBeLessThanOrEqual(5);
  });
});
```

### Load Testing

```bash
# Using autocannon
npx autocannon -c 100 -d 30 https://yourdomain.com/api/bookings

# Using k6
k6 run load_test.js
```

---

## Summary

This architecture provides:

✅ **Data Consistency**: Serializable transactions prevent race conditions  
✅ **Security**: Input validation, authentication, rate limiting  
✅ **Scalability**: Caching, read replicas, async processing  
✅ **Reliability**: Error handling, logging, monitoring  
✅ **Maintainability**: Clean code, clear separation of concerns  
✅ **Auditability**: Complete audit trail of all operations

This is production-ready for a booking platform handling thousands of daily transactions with real money involved.
