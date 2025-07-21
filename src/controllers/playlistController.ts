import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Playlist from "../models/Playlist";
import User from "../models/User";

export const createPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, description } = req.body;
        // add playlist to user database playlists array
        const newPlaylist = new Playlist({ name, description, userIds: [user.userId] });
        await newPlaylist.save();

        const userFromDB = await User.findById(user.userId);
        if (!userFromDB) {
            return res.status(404).json({ message: "User not found" });
        }
        userFromDB.playlists.push(newPlaylist._id as string);
        await userFromDB.save();
        res.json(newPlaylist);
    } catch (err) {
        console.log("Error while fetching playlists: ", err);
        res.status(500).json({ message: "Server error while fetching playlists" });
    }
};

export const getUsersPlaylists = async (req: AuthRequest, res: Response) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userFromDB = await User.findById(user.userId);
        if (!userFromDB) {
            return res.status(404).json({ message: "User not found" });
        }
        const playlists = await Playlist.find({ _id: { $in: userFromDB.playlists } });
        if (playlists) {
            return res.json(playlists);
        }
        return res.status(404).json({ message: "Playlists not found" });
    } catch (err) {
        console.log("Error while fetching playlists: ", err);
        res.status(500).json({ message: "Server error while fetching playlists" });
    }
};