import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";

// Middleware to protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verifyToken(token);
    //@ts-ignore
    req.user = payload; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
