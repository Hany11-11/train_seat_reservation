import express from "express";
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  searchTrains,
} from "../controllers/schedule.controller.js";

const router = express.Router();

// Search trains by stations (must be before /:id)
router.get("/search", searchTrains);

// CRUD routes
router.post("/", createSchedule);
router.get("/", getSchedules);
router.get("/:id", getScheduleById);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;
