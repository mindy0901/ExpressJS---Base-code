import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares";
import { refreshToken, signin, signout, signup } from "../controllers/auth";
import { refreshValidator, signinValidator, signupValidator } from "../middlewares/authValidator";

router.post("/signup", signupValidator(), signup);

router.post("/signin", signinValidator(), signin);

router.post("/refresh", refreshValidator(), refreshToken);

router.use(verifyJWT);
router.get("/signout", signout);

export default router;
