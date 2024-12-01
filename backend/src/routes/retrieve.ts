import express, { Request, Response } from "express";
import { protect } from "../middleware/protectMiddleware";
import prisma from "../prisma/client";
import { promises } from "dns";

const router = express.Router();

// Get submissions for a specific ensdpoint
router.get(
  "/:endpointId/submissions",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    const { endpointId } = req.params;
    //@ts-ignore
    const userId = req.user?.id;

    try {
      const endpoint = await prisma.endpoint.findUnique({
        where: { endpointId },
      });

      if (!endpoint || endpoint.userId !== userId) {
        res
          .status(404)
          .json({ error: "Endpoint not found or unauthorized access." });
      }

      const submissions = await prisma.submission.findMany({
        where: { endpointId },
        orderBy: { submittedAt: "desc" },
      });

      res.status(200).json({ submissions });
    } catch (error) {
      console.error("Error retrieving submissions:", error);
      res.status(500).json({ error: "Error retrieving submissions." });
    }
  }
);

export default router;
