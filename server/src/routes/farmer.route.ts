import { Router } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/profile", requireAuth(["farmer"]), async (req: any, res) => {
  try {
    const farmer_id = req.user!.id;

    const farmer = await prisma.farmer.findUnique({
      where: { farmer_id },
      select: {
        farmer_id: true,
        name: true,
        email: true,
        location: true,
        pan_number: true,
        aadhar_number: true,
        bank_account: true,
        kyc_verified: true,
        createdAt: true,
      },
    });

    return res.json({ success: true, farmer });

  } catch (e) {
    console.error("Farmer Profile Error:", e);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
