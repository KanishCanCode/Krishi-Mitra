import { Router } from "express";
import { prisma } from "../db";
import crypto from "crypto";

const router = Router();

router.post("/submit-kyc", async (req, res) => {
  try {
    const { farmer_id, aadhaar_number, pan_number, address } = req.body;

    // combine values
    const combined = `${aadhaar_number}:${pan_number}:${address}`;

    // hash
    const hash = crypto.createHash("sha256").update(combined).digest("hex");

    const kyc = await prisma.kYC_Details.create({
      data: {
        farmer_id,
        verification_status: "pending",
        verification_date: new Date(),
        identity_documents: hash, // store ONLY hash
      },
    });

    res.json({ message: "KYC submitted", kyc_hash: hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
});

export default router;
