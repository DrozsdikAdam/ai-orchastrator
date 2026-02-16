import { Router } from "express";
import { ApiKeyController } from "../controllers/apiKeyController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { CreateApiKeyRequestSchema } from "@repo/types";

const router = Router();

// Minden API kulcs route védett
router.use(auth);

router.post("/", validate(CreateApiKeyRequestSchema), ApiKeyController.create);
router.get("/", ApiKeyController.list);
router.delete("/:id", ApiKeyController.delete);

export default router;
