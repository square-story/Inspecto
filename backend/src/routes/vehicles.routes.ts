import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller";
import VehicleService from "../services/vehicle.service";
import { authenticateToken } from "../middlewares/auth.middleware";
import VehicleRepository from "../repositories/vehicle.repository";

// Create instances
const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);

const router = Router();

// Create a new vehicle
router.post("/", authenticateToken, (req, res) => vehicleController.createVehicle(req, res));

// Get all vehicles for a user
router.get("/user/:userId", authenticateToken, (req, res) => vehicleController.getVehiclesByUser(req, res));

// Get a single vehicle by ID
router.get("/:vehicleId", authenticateToken, (req, res) => vehicleController.getVehicleById(req, res));

// Update a vehicle
router.put("/:vehicleId", authenticateToken, (req, res) => vehicleController.updateVehicle(req, res));

// Delete a vehicle
router.delete("/:vehicleId", authenticateToken, (req, res) => vehicleController.deleteVehicle(req, res));

export default router;
