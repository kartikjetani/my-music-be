import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Playlist from "../models/Playlist";
import Song, { ISong } from "../models/Song";
import User from "../models/User";

export const createPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, description } = req.body;
        // add playlist to user database playlists array
        //@TODO: remove userIds from playlist if not required
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

export const updatePlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const playlistId = req.params.id;
        if (!playlistId) {
            return res.status(400).json({ message: "Playlist id is required" });
        }
        const { name, description, song } = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (name) {
            playlist.name = name;
        }
        if (description) {
            playlist.description = description;
        }
        try {
            if (song?.id) {
                if (playlist.songs.includes(song.id)) {
                    throw new Error("Song already exists in playlist");
                }
                const songObj = new Song<ISong>({
                    _id: song?.id,
                    name: song?.name,
                    artists: song?.artists?.map((artist: any) => artist.name),
                    duration: song?.duration_ms,
                    url: song?.external_urls?.spotify,
                    image: song?.album?.images?.[0]?.url,
                } as ISong);
                await songObj.save();
                playlist.songs.push(songObj._id as string);

                if (song?.album?.images?.[0]?.url && playlist.images.length < 4) {
                    playlist.images.push(song.album.images[0].url);
                }
            }
        } catch (err: any) {
            console.log("Error while adding song to playlist: ", err);
            return res.status(400).json({ message: err.message || "Error while adding song to playlist" });
        }
        await playlist.save();
        res.json({ playlist, message: "Playlist updated" });
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

export const getPlaylistById = async (req: AuthRequest, res: Response) => {
    try {
        const playlistMongo = await Playlist.findOne({ _id: req.params.id });
        const playlist = playlistMongo?.toObject();
        const updatedPlaylist: any = { ...playlist };

        if (playlist) {
            updatedPlaylist.songs = await Song.find({ _id: { $in: playlist.songs } });

            if (updatedPlaylist.images.length < 4) {
                const songImages = updatedPlaylist.songs
                    .map((song: any) => song.image)
                    .filter((image: string) => image)
                    .slice(0, 4);
                updatedPlaylist.images = songImages;

                await Playlist.findByIdAndUpdate(req.params.id, { images: updatedPlaylist.images });
            }

            return res.json(updatedPlaylist);
        }
        return res.status(404).json({ message: "Playlist not found" });
    } catch (err) {
        console.log("Error while fetching playlists: ", err);
        res.status(500).json({ message: "Server error while fetching playlists" });
    }
};

export const deletePlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const playlistId = req.params.id;
        if (!playlistId) {
            return res.status(400).json({ message: "Playlist id is required" });
        }
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        await Playlist.deleteOne({ _id: playlistId });
        res.json({ message: "Playlist deleted" });
    } catch (err) {
        console.log("Error while deleting playlists: ", err);
        res.status(500).json({ message: "Server error while fetching playlists" });
    }
};

export const removeSongFromPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const { id: playlistId, songId } = req.params;

        if (!playlistId || !songId) {
            return res.status(400).json({ message: "Playlist ID and Song ID are required" });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        if (!playlist.songs.includes(songId)) {
            return res.status(404).json({ message: "Song not found in playlist" });
        }

        playlist.songs = playlist.songs.filter(id => id !== songId);

        const remainingSongs = await Song.find({ _id: { $in: playlist.songs } });
        const songImages = remainingSongs
            .map((song: any) => song.image)
            .filter((image: string) => image)
            .slice(0, 4);
        playlist.images = songImages;

        await playlist.save();

        res.json({ message: "Song removed from playlist", playlist });
    } catch (err) {
        console.log("Error while removing song from playlist: ", err);
        res.status(500).json({ message: "Server error while removing song from playlist" });
    }
};
