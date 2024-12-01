import express, { Request, Response } from "express";
import { protect } from "../middleware/protectMiddleware";
import prisma from "../prisma/client";
import crypto from "crypto";

const router = express.Router();

// Create an endpoint
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { endpointId, submissionId } = req.params;

    const submission = await prisma.submission.findFirst({
      where: {
        endpointId,
        id: submissionId,
      },
    });

    if (!submission) {
      res.status(404).json({
        message: "Submission not found",
      });
    }

    res.status(200).json({
      message: "Submission retrieved successfully",
      submission,
    });
  } catch (error) {
    console.error("Error retrieving submission details:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the submission",
    });
  }
});

router.post(
  "/",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    const { email, discordWh, slackWh, webhook } = req.body;
    //@ts-ignore
    const userId = req.user?.id;

    try {
      const token = crypto.randomBytes(32).toString("hex"); // Generate a unique token
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const endpoint = await prisma.endpoint.create({
        data: {
          userId,
          email,
          discordWh,
          slackWh,
          webhook,
          token,
        },
      });

      res.status(201).json({ endpoint });
    } catch (error) {
      console.error("Error creating endpoint:", error);
      res.status(500).json({ error: "Error creating endpoint." });
    }
  }
);
router.get(
  "/:endpointId/submissions",
  protect,
  async (req, res): Promise<void> => {
    const { endpointId } = req.params;
    //@ts-ignore
    const userId = req.user.id; // Extracted from `verifyToken` middleware

    try {
      // Verify that the endpoint belongs to the user
      const endpoint = await prisma.endpoint.findFirst({
        where: {
          endpointId,
          userId,
        },
      });

      if (!endpoint) {
        res
          .status(404)
          .json({ message: "Endpoint not found or access denied." });
      }

      // Fetch all submissions for the endpoint
      const submissions = await prisma.submission.findMany({
        where: {
          endpointId,
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

      res.status(200).json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching submissions." });
    }
  }
);

router.get("/get", protect, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user?.id;
    const endpoints = await prisma.endpoint.findMany({
      where: { userId },
    });
    res.status(200).json(endpoints);
  } catch (error) {
    console.error("Error fetching endpoints:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching endpoints." });
  }
});
export default router;
