import express from "express";
import {
  createPrice,
  getPrices,
  getPriceById,
  updatePrice,
  deletePrice,
} from "../controllers/price.controller.js";

const router = express.Router();

// Create
router.post("/", createPrice);
// Read all
router.get("/", getPrices);
// Read one
router.get("/:id", getPriceById);
// Update
router.put("/:id", updatePrice);
// Delete
router.delete("/:id", deletePrice);

export default router;
