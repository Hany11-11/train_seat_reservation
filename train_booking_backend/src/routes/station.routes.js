import express from "express";
import {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/station.controller.js";

const router = express.Router();

// Create
router.post("/", createStation);
// Read all
router.get("/", getStations);
// Read one
router.get("/:id", getStationById);
// Update
router.put("/:id", updateStation);
// Delete
router.delete("/:id", deleteStation);

export default router;
