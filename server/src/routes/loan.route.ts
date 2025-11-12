// server/src/routes/loan.route.ts
import { Router } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

/** Apply for a loan (farmer only) */
router.post("/apply", requireAuth(["farmer"]), async (req, res) => {
  try {
    const { lender_id, amount, tenure_months, purpose } = req.body;

    // take farmer id from JWT (set by requireAuth)
    const farmer_id = req.user!.id;

    // validate existence up-front (avoids FK errors)
    const [farmer, lender] = await Promise.all([
      prisma.farmer.findUnique({ where: { farmer_id } }),
      prisma.lender.findUnique({ where: { lender_id } }),
    ]);

    if (!farmer) return res.status(400).json({ success: false, error: "Farmer not found (token)" });
    if (!lender) return res.status(400).json({ success: false, error: "lender_id not found" });

    const loan = await prisma.loan_Application.create({
      data: {
        farmer_id,
        lender_id,
        amount: Number(amount),           // ensure number
        tenure_months: Number(tenure_months),
        purpose,
        status: "pending",
        application_date: new Date(),
        blockchain_hash: "",
      },
    });

    return res.json({ success: true, loan });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

/** List loans for the logged-in farmer */
router.get("/me", requireAuth(["farmer"]), async (req, res) => {
  try {
    const farmer_id = req.user!.id;
    const loans = await prisma.loan_Application.findMany({
      where: { farmer_id },
      orderBy: { application_date: "desc" },
    });
    return res.json({ success: true, loans });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
