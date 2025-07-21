import { Router } from "express";
import { login, signup } from "../controllers/authController";
import { getSpotifyAccessToken } from "../controllers/songsController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/generate-spotify-token", getSpotifyAccessToken);

export default router;