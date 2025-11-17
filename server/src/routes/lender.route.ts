import { Router } from "express";
import prisma from "../db";

const router = Router();

/** PUBLIC: GET ALL LENDERS (NAME + ID) */
router.get("/list", async (req, res) => {
  try {
    const lenders = await prisma.lender.findMany({
      select: {
        lender_id: true,
        name: true,
      },
    });

    return res.json({ success: true, lenders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
