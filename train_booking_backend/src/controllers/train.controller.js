import Train from "../models/train.model.js";

// Create a new train
export const createTrain = async (req, res) => {
  try {
    const { train, number, description, status } = req.body;
    const newTrain = await Train.create({ train, number, description, status });
    res.status(201).json(newTrain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all trains
export const getTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single train by ID
export const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ error: "Train not found" });
    res.json(train);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a train by ID
export const updateTrain = async (req, res) => {
  try {
    const { train, number, description, status } = req.body;
    const updated = await Train.findByIdAndUpdate(
      req.params.id,
      { train, number, description, status },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: "Train not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a train by ID
export const deleteTrain = async (req, res) => {
  try {
    const deleted = await Train.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Train not found" });
    res.json({ message: "Train deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
