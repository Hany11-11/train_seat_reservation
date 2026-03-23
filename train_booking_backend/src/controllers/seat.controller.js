import Seat from "../models/seat.model.js";
import Booking from "../models/booking.model.js";
import Schedule from "../models/schedule.model.js";

// Get seat availability for a schedule, date, and class
export const getSeatAvailability = async (req, res) => {
  try {
    const { scheduleId, date, classType } = req.query;

    if (!scheduleId || !date || !classType) {
      return res.status(400).json({
        error: "scheduleId, date, and classType are required",
      });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    const coaches = await Seat.find({
      train: schedule.train._id,
      classType: classType,
    });

    if (coaches.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No coaches found for this class",
      });
    }

    const bookings = await Booking.find({
      schedule: scheduleId,
      date: date,
      classType: classType,
      status: "CONFIRMED",
    });

    const bookedSeats = new Set();
    bookings.forEach((booking) => {
      booking.seatNumbers.forEach((seat) => {
        bookedSeats.add(seat);
      });
    });

    // Sort coaches by coachName (or another property if needed) to ensure order
    const sortedCoaches = coaches.sort((a, b) =>
      a.coachName.localeCompare(b.coachName),
    );
    let globalSeatNum = 1;
    const result = sortedCoaches.map((coach) => {
      const seats = [];
      const seatLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let row = 1; row <= coach.rows; row++) {
        for (let seat = 0; seat < coach.seatsPerRow; seat++) {
          const seatLetter = seatLetters[seat];
          const seatNumber = globalSeatNum.toString();
          const isBooked = bookedSeats.has(seatNumber);
          seats.push({
            _id: `${coach._id}_${seatNumber}`,
            seatNumber,
            row,
            column: seatLetter,
            status: isBooked ? "booked" : "available",
            classType: coach.classType,
            coachId: coach._id.toString(),
            coachName: coach.coachName,
          });
          globalSeatNum++;
        }
      }
      return {
        coachId: coach._id.toString(),
        coachName: coach.coachName,
        classType: coach.classType,
        layout: coach.layout,
        rows: coach.rows,
        seatsPerRow: coach.seatsPerRow,
        totalSeats: coach.totalSeats,
        availableSeats: seats.filter((s) => s.status === "available").length,
        bookedSeats: seats.filter((s) => s.status === "booked").length,
        seats,
      };
    });

    res.json({
      success: true,
      data: result,
      date,
      classType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Batch create seats for a coach
export const createCoachSeats = async (req, res) => {
  try {
    const { train, coachName, classType, rows, seatsPerRow, layout } = req.body;
    if (!train || !coachName || !classType || !rows || !seatsPerRow) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const seats = [];
    const seatLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let row = 1; row <= rows; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatNumber = `${row}${seatLetters[seat]}`;
        seats.push({
          train,
          coachName,
          classType,
          row,
          seatNumber,
          layout,
          rows,
          seatsPerRow,
        });
      }
    }
    const created = await (
      await import("../models/seat.model.js")
    ).default.insertMany(seats, { hooks: true });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new seat (coach)
export const createSeat = async (req, res) => {
  try {
    // Remove totalSeats if present in request body
    const { totalSeats, ...rest } = req.body;
    const seat = await Seat.create(rest);
    res.status(201).json(seat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all seats (coaches)
export const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single seat (coach) by ID
export const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    res.json(seat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a seat (coach) by ID
export const updateSeat = async (req, res) => {
  try {
    // Remove totalSeats if present in request body
    const { totalSeats, ...rest } = req.body;
    const updated = await Seat.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Seat not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a seat (coach) by ID
export const deleteSeat = async (req, res) => {
  try {
    const deleted = await Seat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Seat not found" });
    res.json({ message: "Seat deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
