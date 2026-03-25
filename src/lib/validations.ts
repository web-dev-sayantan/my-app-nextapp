/**
 * Validation Schemas for Booking System
 * Using Zod for runtime type safety
 */

import { z } from "zod";

// Trek validation
export const createTrekSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(200),
  description: z.string().min(20).max(1000),
  longDescription: z.string().optional(),
  state: z.string().min(2).max(50),
  basePrice: z.number().int().positive(),
  difficulty: z.enum([
    "EASY",
    "EASY_MODERATE",
    "MODERATE",
    "HARD",
    "VERY_HARD",
  ]),
  duration: z.number().int().positive(),
  maxAltitude: z.number().int().optional(),
  distance: z.number().positive().optional(),
  bestSeason: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  itinerary: z.string().min(50),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
});

export type CreateTrekInput = z.infer<typeof createTrekSchema>;

// Departure validation
export const createDepartureSchema = z.object({
  trekId: z.string().cuid(),
  startDate: z
    .string()
    .datetime()
    .refine(
      (date) => new Date(date) > new Date(),
      "Start date must be in the future",
    ),
  endDate: z.string().datetime(),
  totalSeats: z.number().int().min(1).max(100),
  pricePerPerson: z.number().int().positive(),
});

export type CreateDepartureInput = z.infer<typeof createDepartureSchema>;

// Booking validation
export const createBookingSchema = z.object({
  departureId: z.string().min(10, "Invalid departure selected"),
  numberOfPeople: z.coerce.number().int().min(1).max(10),
  contactName: z.string().min(2).max(100),
  contactPhone: z
    .string()
    .regex(/^[\d\-\+\s\(\)]{10,}$/, "Invalid phone number"),
  contactEmail: z.string().email(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Payment validation
export const createPaymentSchema = z.object({
  bookingId: z.string().cuid(),
  paymentGateway: z.enum(["razorpay", "stripe", "paypal"]),
  paymentIntentId: z.string().optional(), // For idempotency
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// Query validation
export const listTreksQuerySchema = z.object({
  state: z.string().optional(),
  difficulty: z
    .enum(["EASY", "EASY_MODERATE", "MODERATE", "HARD", "VERY_HARD"])
    .optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ListTreksQuery = z.infer<typeof listTreksQuerySchema>;
