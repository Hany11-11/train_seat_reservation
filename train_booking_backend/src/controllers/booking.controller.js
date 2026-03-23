import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Availability from "../models/availability.model.js";

// Create a new booking

export const createBooking = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const {
      schedule,
      fromStation,
      toStation,
      date,
      classType,
      seats,
      seatNumbers,
      price,
    } = req.body;
    // Find or create availability
    let availability = await Availability.findOne({
      schedule,
      date,
      classType,
    });
    if (!availability) {
      // You may want to set total seats from schedule/class config
      // For now, assume 50 seats per class as default
      // Find the train for this schedule
      const scheduleDoc = await (
        await import("../models/schedule.model.js")
      ).default.findById(schedule);
      if (!scheduleDoc)
        return res.status(400).json({ error: "Invalid schedule" });
      // Find all seat (coach) configs for this train and classType
      const Seat = (await import("../models/seat.model.js")).default;
      const seatConfigs = await Seat.find({
        train: scheduleDoc.train,
        classType,
      });
      if (seatConfigs.length === 0)
        return res
          .status(400)
          .json({ error: "No seat config defined for this train/class" });
      // Calculate total seats as sum of rows * seatsPerRow for all matching seat configs
      const seatCount = seatConfigs.reduce(
        (sum, seat) => sum + seat.rows * seat.seatsPerRow,
        0,
      );
      availability = await Availability.create({
        schedule,
        date,
        classType,
        availableSeats: seatCount,
      });
    }
    if (availability.availableSeats < seats) {
      return res.status(400).json({ error: "Not enough seats available" });
    }
    // Decrement available seats
    availability.availableSeats -= seats;
    await availability.save();
    // Create booking
    const booking = await Booking.create({
      user: userId,
      schedule,
      fromStation,
      toStation,
      date,
      classType,
      seats,
      seatNumbers,
      price,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.user.toString() !== req.auth.userId)
      return res.status(403).json({ error: "Not authorized to cancel this booking" });
    if (booking.status === "CANCELLED")
      return res.status(400).json({ error: "Booking already cancelled" });
    // Update availability
    const availability = await Availability.findOne({
      schedule: booking.schedule,
      date: booking.date,
      classType: booking.classType,
    });
    if (availability) {
      availability.availableSeats += booking.seats;
      await availability.save();
    }
    booking.status = "CANCELLED";
    await booking.save();
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user schedule");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "user schedule fromStation toStation",
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings for authenticated user (same userId source as /api/auth/me)
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const bookings = await Booking.find({ user: userId })
      .populate("schedule fromStation toStation")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      data: {
        userId: userId,
        bookings: bookings,
      },
      count: bookings.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
