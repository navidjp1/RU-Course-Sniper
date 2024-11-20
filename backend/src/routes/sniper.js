import express from "express";
import { startSniper, stopSniper, testServer } from "../controllers/sniper.js";

const router = express.Router();

router.get("/start/:uid", startSniper);

router.get("/stop/:uid", stopSniper);

router.get("/test", testServer);

export default router;
