import express from "express";
const router = express.Router();

import { verifyAbilities, verifyJWT } from "../middlewares";
import { getMe, getUsers } from "../controllers/user";
import { Action, Subject } from "../types/authTypes";

router.use(verifyJWT);

// GET USERS
router.get("/", verifyAbilities(Action.ReadAll, Subject.User), getUsers);

// // GET USER
// router.get("/:id", getUserMiddleware, getUser);

// GET ME
router.get("/me", getMe);

export default router;
