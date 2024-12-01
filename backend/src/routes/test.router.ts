import express from "express";

const router = express.Router();

// Create a new endpoint
router.get("/", async (req, res) => {

 
    res.status(200).json("server is thigns ");
});

export default router;
