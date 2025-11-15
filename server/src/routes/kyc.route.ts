import { Router } from "express";
import prisma from "../db";
import crypto from "crypto";

const router = Router();

router.post("/complete-kyc", async (req, res) => {
  try {
    const { farmer_id, aadhar, pan } = req.body;

    if (!farmer_id || !aadhar || !pan) {
      return res.status(400).json({
        success: false,
        error: "Aadhar and PAN are required",
      });
    }

    const farmer = await prisma.farmer.findUnique({ where: { farmer_id } });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer not found",
      });
    }

    if (farmer.kyc_verified) {
      return res.status(400).json({
        success: false,
        error: "KYC already completed",
      });
    }

    const combined = `${aadhar}:${pan}`;
    const hash = crypto.createHash("sha256").update(combined).digest("hex");

    const kycRecord = await prisma.kYC_Details.create({
      data: {
        farmer_id,
        verification_status: "verified",
        verification_date: new Date(),
        identity_documents: hash,
        kyc_hash: hash,
      }
    });

    const updatedFarmer = await prisma.farmer.update({
      where: { farmer_id },
      data: {
        kyc_verified: true,
        aadhar_number: aadhar,
        pan_number: pan,
      }
    });

    return res.json({
      success: true,
      message: "KYC done",
      farmer: updatedFarmer,
      kyc: kycRecord
    });

  } catch (err) {
    console.error("KYC ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
