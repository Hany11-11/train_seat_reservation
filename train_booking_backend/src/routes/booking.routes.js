import express from "express";
import {
  createBooking,
  cancelBooking,
  getBookings,
  getBookingById,
  getMyBookings,
} from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create booking (requires auth)
router.post("/", requireAuth, createBooking);
// Cancel booking (requires auth)
router.put("/:id/cancel", requireAuth, cancelBooking);
// Get all bookings (admin only)
router.get("/", getBookings);
// Get my bookings (authenticated user)
router.get("/my", requireAuth, getMyBookings);
// Get booking by ID
router.get("/:id", getBookingById);

export default router;
