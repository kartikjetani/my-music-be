import { Router } from "express";
import { createPlaylist, getUsersPlaylists } from "../controllers/playlistController";

const router = Router();

router.get("/", getUsersPlaylists);
router.post("/create", createPlaylist);

export default router;