import express from "express";
import { startSniper, stopSniper } from "../controllers/sniper.js";

const router = express.Router();

router.get("/:uid", startSniper);

router.get("/stop", stopSniper);

export default router;
