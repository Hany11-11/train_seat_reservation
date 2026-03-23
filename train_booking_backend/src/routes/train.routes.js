import express from "express";
import {
  createTrain,
  getTrains,
  getTrainById,
  updateTrain,
  deleteTrain,
} from "../controllers/train.controller.js";

const router = express.Router();

// Create
router.post("/", createTrain);
// Read all
router.get("/", getTrains);
// Read one
router.get("/:id", getTrainById);
// Update
router.put("/:id", updateTrain);
// Delete
router.delete("/:id", deleteTrain);

export default router;
