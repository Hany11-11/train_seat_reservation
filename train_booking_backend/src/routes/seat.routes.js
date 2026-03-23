import express from "express";
import {
  createSeat,
  getSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  getSeatAvailability,
} from "../controllers/seat.controller.js";

const router = express.Router();

// Get seat availability by schedule, date, and class
router.get("/availability", getSeatAvailability);
// Create seat (coach)
router.post("/", createSeat);
// Read all seats (coaches)
router.get("/", getSeats);
// Read one seat (coach)
router.get("/:id", getSeatById);
// Update seat (coach)
router.put("/:id", updateSeat);
// Delete seat (coach)
router.delete("/:id", deleteSeat);

export default router;
