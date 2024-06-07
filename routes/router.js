import { Router } from "express";
import {
  home,
  randomUser,
  getRoommates,
  getGastos,
  addGasto,
  editGasto,
  deleteGasto,
} from "../controllers/controller.js";

const router = Router();

router.get("/", home);

router.post("/roommate", randomUser);

router.get("/roommates", getRoommates);

router.get("/gastos", getGastos);

router.post("/gasto", addGasto);

router.put("/gasto", editGasto);

router.delete("/gasto", deleteGasto);

export default router;
