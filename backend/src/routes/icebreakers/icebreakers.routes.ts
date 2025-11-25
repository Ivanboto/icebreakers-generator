import { Router } from "express";
import icebreakersController from "../../controllers/icebreakers/icebreakers.controller";

const router = Router();

router.post("/generate", icebreakersController.generateIcebreakers);

export default router;
