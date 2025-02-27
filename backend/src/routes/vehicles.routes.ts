import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IVehicleController } from "../core/interfaces/controllers/vehicle.controller.interface";


const vehicleController = container.get<IVehicleController>(TYPES.VehicleController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

const router = Router();

// Create a new vehicle
router.post("/", authenticateToken, vehicleController.createVehicle);

// Get all vehicles for a user
router.get("/", authenticateToken, vehicleController.getVehiclesByUser);

// Get a single vehicle by ID
router.get("/:vehicleId", authenticateToken, vehicleController.getVehicleById);

// Update a vehicle
router.put("/:vehicleId", authenticateToken, vehicleController.updateVehicle);

// Delete a vehicle
router.delete("/:vehicleId", authenticateToken, vehicleController.deleteVehicle);

export default router;
