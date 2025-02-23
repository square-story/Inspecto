import { Router } from "express";
import { container } from "../di/container";
import { VehicleController } from "../controllers/vehicle.controller";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";


const vehicleController = container.get<VehicleController>(TYPES.VehicleController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

const router = Router();

// Create a new vehicle
router.post("/", authenticateToken, (req, res) => vehicleController.createVehicle(req, res));

// Get all vehicles for a user
router.get("/", authenticateToken, (req, res) => vehicleController.getVehiclesByUser(req, res));

// Get a single vehicle by ID
router.get("/:vehicleId", authenticateToken, (req, res) => vehicleController.getVehicleById(req, res));

// Update a vehicle
router.put("/:vehicleId", authenticateToken, (req, res) => vehicleController.updateVehicle(req, res));

// Delete a vehicle
router.delete("/:vehicleId", authenticateToken, (req, res) => vehicleController.deleteVehicle(req, res));

export default router;
