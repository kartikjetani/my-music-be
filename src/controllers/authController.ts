import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword, firstName, lastName });
        const result = await user.save()
            .catch((err) => {
                res.status(500).json({ message: "Error registering user", error: err?.message });
            });

        if (!result) {
            res.status(500).json({ message: "Error user not created" });
            return;
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
        res.status(500).json({ message: "Server error", error: err?.message || "Error while registering user" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const payload = { userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ message: "Server error", error: err?.message || "Error while logging in" });
    }
};