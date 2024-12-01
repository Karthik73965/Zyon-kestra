import express, { Request, Response } from "express";
import { protect } from "../middleware/protectMiddleware";
import prisma from "../prisma/client";
import { extractAnalytics } from "../utils/analyticsUtils";
import { triggerKestraWorkflow } from "../utils/notificationUtils";
const router = express.Router();

router.post(
  "/r/:endpointId",
  async (req: Request, res: Response): Promise<void> => {
    const { endpointId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    let  formData = req.body.formData ;
    console.log( "formdata"  , req.body)
    if (!token) {
       res.status(401).json({ error: "Authorization token missing." });
    }

    try {
      const endpoint = await prisma.endpoint.findUnique({
        where: { endpointId },
      });

      if (!endpoint || endpoint.token !== token) {
         res.status(401).json({ error: "Invalid or unauthorized token." });
      }else{

      

      // Default formData to an empty object if not provided
      formData = formData || {};

      // Ensure formData is a valid object before calling Object.keys()
      if (typeof formData !== 'object') {
         res.status(400).json({ error: "Invalid formData." });
      }

      const { analytics, location } = extractAnalytics(req.headers);

      const submission = await prisma.submission.create({
        data: {
          endpointId,
          userId: endpoint.userId,
          webhook: endpoint.webhook || "nill",
          discord: endpoint.discordWh || "nill",
          slack: endpoint.slackWh || "nill",
          email: endpoint.email || "nill",
          noFields: Object.keys(formData).length,
          formData, // Use formData without images
          analytics,
          location,
        },
      });

      // Trigger Kestra workflow for notifications and image uploads
      const kestraResponse = await triggerKestraWorkflow(submission);

      // Update submission with the processed image URLs and status
      console.log("kestraResponse" , kestraResponse)
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          formData: {
            ...formData,
          },
          emailStatus: kestraResponse?.emailStatus || "failed",
          discordStatus: kestraResponse?.discordStatus || "failed",
          slackStatus: kestraResponse?.slackStatus || "failed",
        },
      });

      // Only send a response once
       res.status(201).json({ submission })}
    } catch (error) {
      console.error("Error processing submission:", error);
      // Ensure headers aren't sent before error response
      if (!res.headersSent) {
         res.status(500).json({ error: "Error processing submission." });
      }
    }
  }
);


  
  router.get(
  "/api/submission/:submissionId",
  protect,
  async (req: Request, res: Response): Promise<void> => {
      try {
          const { submissionId } = req.params;
          const submission = await prisma.submission.findFirst({
              where: {
                  id: submissionId,
              },
          });

          console.table({submission  , submissionId})
  
          // Early return if no submission found
          if (!submission) {
              res.status(404).json({
                  message: "Submission not found",
              });
              return;
          }
  
          // Return the submission details if found
          res.status(200).json({
              message: "Submission retrieved successfully",
              submission,
          });
      } catch (error) {
          console.error("Error retrieving submission details:", error);
          
          // Check if headers have already been sent before trying to send another response
          if (!res.headersSent) {
              res.status(500).json({
                  message: "An error occurred while retrieving the submission",
              });
          }
      }
  });

export default router;
