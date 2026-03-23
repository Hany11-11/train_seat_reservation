import Price from "../models/price.model.js";

// Create a new price

export const createPrice = async (req, res) => {
  try {
    const { schedule, fromStation, toStation, classType, price, status } =
      req.body;
    const newPrice = await Price.create({
      schedule,
      fromStation,
      toStation,
      classType,
      price,
      status,
    });
    res.status(201).json(newPrice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all prices
export const getPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate("schedule")
      .populate("fromStation")
      .populate("toStation");
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single price by ID
export const getPriceById = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id)
      .populate("schedule")
      .populate("fromStation")
      .populate("toStation");
    if (!price) return res.status(404).json({ error: "Price not found" });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a price by ID
export const updatePrice = async (req, res) => {
  try {
    const { schedule, fromStation, toStation, classType, price, status } =
      req.body;
    const updated = await Price.findByIdAndUpdate(
      req.params.id,
      { schedule, fromStation, toStation, classType, price, status },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: "Price not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a price by ID
export const deletePrice = async (req, res) => {
  try {
    const deleted = await Price.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Price not found" });
    res.json({ message: "Price deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
