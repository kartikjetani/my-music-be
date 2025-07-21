import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import auth from "./middleware/auth";
import authRoutes from "./routes/authRoutes";
import playlistRoutes from "./routes/playlistRoutes";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/playlist", auth, playlistRoutes);

app.get("/", (_req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log("MongoDB connection error:", err));