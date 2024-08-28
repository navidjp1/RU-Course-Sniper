import express from "express";
import { startSniper, stopSniper } from "../controllers/sniper.js";

const router = express.Router();

router.get("/start/:uid", startSniper);

router.get("/stop/:uid", stopSniper);

export default router;
