import { Router } from "express";
import { home } from "../controllers/controller.js";

const router = Router();

router.get("/", home);

export default router;
