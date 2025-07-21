import { Router } from "express";
import { createPlaylist, deletePlaylist, getPlaylistById, getUsersPlaylists, removeSongFromPlaylist, updatePlaylist } from "../controllers/playlistController";

const router = Router();

router.get("/", getUsersPlaylists);
router.get("/:id", getPlaylistById);
router.post("/create", createPlaylist);
router.patch("/update/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.delete("/:id/song/:songId", removeSongFromPlaylist);

export default router;
