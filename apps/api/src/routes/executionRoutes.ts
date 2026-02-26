import { Router } from "express";
import { ExecutionController } from "../controllers/executionController";
import { auth } from "../middlewares/auth";

const router = Router();

// Minden execution route védett
router.use(auth);

router.get("/:id", ExecutionController.getById);

export default router;
