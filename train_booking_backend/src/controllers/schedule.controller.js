import Schedule from "../models/schedule.model.js";
import Price from "../models/price.model.js";
import Seat from "../models/seat.model.js";
import Availability from "../models/availability.model.js";

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const { train, fromStation, toStation, route, status, travelDates } =
      req.body;
    const newSchedule = await Schedule.create({
      train,
      fromStation,
      toStation,
      route,
      status,
      travelDates,
    });
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search trains by from and to stations
export const searchTrains = async (req, res) => {
  try {
    const { fromStationId, toStationId, date } = req.query;

    if (!fromStationId || !toStationId) {
      return res.status(400).json({ 
        error: "fromStationId and toStationId are required" 
      });
    }

    const schedules = await Schedule.find({ status: "ACTIVE" })
      .populate("train")
      .populate("fromStation")
      .populate("toStation")
      .populate("route.station");

    const fromStationObjectId = fromStationId.toString();
    const toStationObjectId = toStationId.toString();

    const filteredSchedules = schedules.filter((schedule) => {
      const fromIndex = schedule.route?.findIndex(
        (r) => r.station._id.toString() === fromStationObjectId
      );
      const toIndex = schedule.route?.findIndex(
        (r) => r.station._id.toString() === toStationObjectId
      );

      return (
        fromIndex !== undefined &&
        fromIndex !== -1 &&
        toIndex !== undefined &&
        toIndex !== -1 &&
        fromIndex < toIndex
      );
    });

    const results = await Promise.all(
      filteredSchedules.map(async (schedule) => {
        const firstRouteStop = schedule.route?.[0];
        const lastRouteStop = schedule.route?.[schedule.route?.length - 1];
        
        const fromStop = schedule.route?.find(
          (r) => r.station._id.toString() === fromStationObjectId.toString()
        );
        const toStop = schedule.route?.find(
          (r) => r.station._id.toString() === toStationObjectId.toString()
        );

        const mainDepartureTime = firstRouteStop?.departureTime || firstRouteStop?.arrivalTime || "";
        const mainArrivalTime = lastRouteStop?.arrivalTime || lastRouteStop?.departureTime || "";
        const mainDuration = calculateDuration(mainDepartureTime, mainArrivalTime);

        const userDepartureTime = fromStop?.departureTime || "";
        const userArrivalTime = toStop?.arrivalTime || "";
        const userDuration = calculateDuration(userDepartureTime, userArrivalTime);

        const seats = await Seat.find({ 
          train: schedule.train._id 
        }).populate("train");

        const availableClasses = [...new Set(seats.map(s => s.classType))];

        const allPrices = await Price.find({
          schedule: schedule._id,
          status: "ACTIVE",
        }).populate("fromStation").populate("toStation");

        const segmentPrices = allPrices.map((p) => ({
          classType: p.classType,
          fromStation: {
            id: p.fromStation._id.toString(),
            name: p.fromStation.name,
            code: p.fromStation.code,
          },
          toStation: {
            id: p.toStation._id.toString(),
            name: p.toStation.name,
            code: p.toStation.code,
          },
          price: p.price,
        }));

        const userPrice = allPrices.find((p) => 
          p.fromStation._id.toString() === fromStationObjectId && 
          p.toStation._id.toString() === toStationObjectId
        );

        const priceByClass = {};
        availableClasses.forEach((classType) => {
          const priceEntry = allPrices.find((p) => 
            p.classType === classType &&
            p.fromStation._id.toString() === fromStationObjectId && 
            p.toStation._id.toString() === toStationObjectId
          );
          priceByClass[classType] = {
            price: priceEntry ? priceEntry.price : 0,
            currency: "LKR",
          };
        });

        let scheduleAvailability = [];
        if (date) {
          scheduleAvailability = await Availability.find({
            schedule: schedule._id,
            date: date,
          });
        }

        const availabilityMap = {};
        scheduleAvailability.forEach((avail) => {
          availabilityMap[avail.classType] = avail.availableSeats;
        });

        const availability = {};
        seats.forEach((seat) => {
          if (!availability[seat.classType]) {
            availability[seat.classType] = {
              totalSeats: 0,
              availableSeats: 0,
              coaches: [],
            };
          }
          availability[seat.classType].totalSeats += seat.totalSeats || 0;
          availability[seat.classType].availableSeats = availabilityMap[seat.classType] !== undefined ? availabilityMap[seat.classType] : (seat.totalSeats || 0);
          availability[seat.classType].coaches.push({
            coachName: seat.coachName,
            totalSeats: seat.totalSeats || 0,
            layout: seat.layout,
            rows: seat.rows,
            seatsPerRow: seat.seatsPerRow,
          });
        });

        return {
          scheduleId: schedule._id.toString(),
          trainId: schedule.train._id.toString(),
          trainName: schedule.train.train,
          trainNumber: schedule.train.number,
          trainDescription: schedule.train.description,
          fromStation: {
            id: schedule.fromStation._id.toString(),
            name: schedule.fromStation.name,
            code: schedule.fromStation.code,
            city: schedule.fromStation.city,
          },
          toStation: {
            id: schedule.toStation._id.toString(),
            name: schedule.toStation.name,
            code: schedule.toStation.code,
            city: schedule.toStation.city,
          },
          departureTime: mainDepartureTime,
          arrivalTime: mainArrivalTime,
          duration: mainDuration,
          fromStationRoute: {
            id: fromStop?.station._id.toString(),
            name: fromStop?.station.name,
            arrivalTime: fromStop?.arrivalTime || "",
            departureTime: userDepartureTime,
          },
          toStationRoute: {
            id: toStop?.station._id.toString(),
            name: toStop?.station.name,
            arrivalTime: userArrivalTime,
            departureTime: toStop?.departureTime || "",
          },
          userDuration,
          prices: priceByClass,
          segmentPrices: segmentPrices,
          availability,
          classTypes: availableClasses,
          route: schedule.route.map((r) => ({
            stationId: r.station._id.toString(),
            stationName: r.station.name,
            stationCode: r.station.code,
            arrivalTime: r.arrivalTime,
            departureTime: r.departureTime,
          })),
          status: schedule.status,
        };
      })
    );

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateDuration(fromTime, toTime) {
  if (!fromTime || !toTime) return "";

  const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
  const [toHours, toMinutes] = toTime.split(":").map(Number);

  let totalMinutes = toHours * 60 + toMinutes - (fromHours * 60 + fromMinutes);

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

// Get all schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("train")
      .populate("fromStation")
      .populate("toStation")
      .populate("route.station");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single schedule by ID
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("train")
      .populate("fromStation")
      .populate("toStation")
      .populate("route.station");
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a schedule by ID
export const updateSchedule = async (req, res) => {
  try {
    const { train, fromStation, toStation, route, status, travelDates } =
      req.body;
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      { train, fromStation, toStation, route, status, travelDates },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: "Schedule not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a schedule by ID
export const deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Schedule not found" });
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
