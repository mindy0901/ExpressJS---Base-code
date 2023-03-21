import express from "express";
const router = express.Router();
import { authenticateRefreshToken } from "../middlewares";
import { refreshToken } from "../controllers/auth";

// router.post("/signup", signup);
// router.post("/signin", signin);
// router.get("/signout", verifyJWT, signout);
router.post("/refresh", authenticateRefreshToken, refreshToken);

module.exports = router;
