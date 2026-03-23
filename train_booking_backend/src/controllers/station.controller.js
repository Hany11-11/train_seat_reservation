import Station from "../models/station.model.js";

// Create a new station
export const createStation = async (req, res) => {
  try {
    const { name, code, city, status } = req.body;
    const newStation = await Station.create({ name, code, city, status });
    res.status(201).json(newStation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all stations
export const getStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single station by ID
export const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ error: "Station not found" });
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a station by ID
export const updateStation = async (req, res) => {
  try {
    const { name, code, city, status } = req.body;
    const updated = await Station.findByIdAndUpdate(
      req.params.id,
      { name, code, city, status },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: "Station not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a station by ID
export const deleteStation = async (req, res) => {
  try {
    const deleted = await Station.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Station not found" });
    res.json({ message: "Station deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
