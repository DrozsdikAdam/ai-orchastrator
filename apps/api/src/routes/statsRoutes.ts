import { Router } from "express";
import { StatsController } from "../controllers/statsController";
import { auth } from "../middlewares/auth";

const router = Router();

// Minden statisztika route védett
router.use(auth);

router.get("/dashboard", StatsController.getDashboardStats);

export default router;
