// server/src/routes/loan.route.ts
import { Router } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

/** APPLY FOR LOAN (FARMER ONLY) */
router.post("/apply", requireAuth(["farmer"]), async (req, res) => {
  try {
    const { lender_id, amount, tenure_months, purpose } = req.body;

    const farmer_id = req.user!.id; // farmer_id from JWT

    // validate farmer and lender exist
    const [farmer, lender] = await Promise.all([
      prisma.farmer.findUnique({ where: { farmer_id } }),
      prisma.lender.findUnique({ where: { lender_id } }),
    ]);

    if (!farmer)
      return res.status(400).json({ success: false, error: "Farmer not found" });

    if (!lender)
      return res.status(400).json({ success: false, error: "Invalid lender_id" });

    // CREATE LOAN APPLICATION
    const loan = await prisma.loan_Application.create({
      data: {
        farmer_id,
        lender_id,
        amount: Number(amount),
        tenure_months: Number(tenure_months),
        purpose,
        status: "pending",
        application_date: new Date(),
        blockchain_hash: "",
      },
    });

    return res.json({ success: true, loan });

  } catch (err) {
    console.error("Loan Apply Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


/** GET ALL LOANS OF LOGGED-IN FARMER */
router.get("/me", requireAuth(["farmer"]), async (req, res) => {
  try {
    const farmer_id = req.user!.id;

    const loans = await prisma.loan_Application.findMany({
      where: { farmer_id },
      orderBy: { application_date: "desc" },
    });

    return res.json({ success: true, loans });
  } catch (err) {
    console.error("Loan Fetch Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
