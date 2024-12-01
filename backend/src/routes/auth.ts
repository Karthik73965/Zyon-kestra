import express, { Request, Response } from "express";
import prisma from "../prisma/client";
import { hashPassword, verifyPassword, generateToken } from "../utils/authUtils";
import { protect } from "../middleware/protectMiddleware";

const router = express.Router();

// User Registration
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// User Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Protected Profile Route
router.get("/profile", protect, async (req: Request, res: Response): Promise<void> => {
  //@ts-ignore
  const userId = req.user?.id;

  if (!userId) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ id: user.id, email: user.email });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

export default router;
