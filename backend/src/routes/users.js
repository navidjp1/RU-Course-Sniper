import express from "express";
import { getCoursesAndBalance, getCreds, getBalance } from "../controllers/users/get.js";
import { deleteUser, deleteCreds } from "../controllers/users/delete.js";
import {
    registerUser,
    updateBalance,
    updateCreds,
    updateDropIDs,
} from "../controllers/users/update.js";

const router = express.Router();

router.get("/:uid", getCoursesAndBalance);

router.get("/creds/:uid", getCreds);

router.get("/balance/:uid", getBalance);

router.delete("/:uid", deleteUser);

router.delete("/creds/:uid", deleteCreds);

router.put("/:uid", registerUser);

router.post("/balance/:uid", updateBalance);

router.post("/creds/:uid", updateCreds);

router.post("/dropids/:uid", updateDropIDs);

export default router;
