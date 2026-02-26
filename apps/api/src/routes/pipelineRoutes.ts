import { Router } from "express";
import { PipelineController } from "../controllers/pipelineController";
import { ExecutionController } from "../controllers/executionController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { CreatePipelineRequestSchema, UpdatePipelineRequestSchema } from "@repo/types";

const router = Router();

// Minden pipeline route védett
router.use(auth);

router.post("/", validate(CreatePipelineRequestSchema), PipelineController.create);
router.get("/", PipelineController.list);
router.get("/:id", PipelineController.getById);
router.put("/:id", validate(UpdatePipelineRequestSchema), PipelineController.update);
router.delete("/:id", PipelineController.delete);

// Execution triggers
router.post("/:pipelineId/execute", ExecutionController.execute);
router.get("/:pipelineId/executions", ExecutionController.list);

export default router;
