import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { RegisterRequestSchema, LoginRequestSchema } from "@repo/types";

const router = Router();

router.post("/register", validate(RegisterRequestSchema), AuthController.register);
router.post("/login", validate(LoginRequestSchema), AuthController.login);

export default router;
