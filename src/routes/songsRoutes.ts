import { Router } from "express";
import { searchSongs } from "../controllers/songsController";

const router = Router();

router.post("/search", searchSongs);

export default router;