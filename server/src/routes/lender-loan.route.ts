import { Router } from "express";
import prisma from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /lender/loan/assigned
 */
router.get("/assigned", requireAuth(["lender"]), async (req, res) => {
  try {
    const lender_id = req.user!.id;

    const loans = await prisma.loan_Application.findMany({
      where: { lender_id },
      include: { farmer: true },
      orderBy: { application_date: "desc" },
    });

    return res.json({ success: true, loans });
  } catch (err) {
    console.error("Assigned Loans Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * POST /lender/loan/approve
 */
router.post("/approve", requireAuth(["lender"]), async (req, res) => {
  try {
    const lender_id = req.user!.id;
    const { application_id, amount, interest_rate, tenure_months } = req.body;

    if (!application_id)
      return res.status(400).json({ success: false, error: "application_id required" });

    const loan = await prisma.loan_Application.findUnique({
      where: { application_id },
    });

    if (!loan) return res.status(404).json({ success: false, error: "Loan not found" });
    if (loan.lender_id !== lender_id)
      return res.status(403).json({ success: false, error: "Not authorized" });

    // compute new due date
    let dueDate = loan.due_date;
    if (tenure_months) {
      dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + Number(tenure_months));
    }

    const updated = await prisma.loan_Application.update({
      where: { application_id },
      data: {
        status: "approved",
        amount: amount ? Number(amount) : loan.amount,
        interest_rate: interest_rate ? Number(interest_rate) : loan.interest_rate,
        tenure_months: tenure_months ? Number(tenure_months) : loan.tenure_months,
        due_date: dueDate,
      },
    });

    return res.json({ success: true, loan: updated });
  } catch (err) {
    console.error("Approve Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * POST /lender/loan/reject
 */
router.post("/reject", requireAuth(["lender"]), async (req, res) => {
  try {
    const lender_id = req.user!.id;
    const { application_id, reason } = req.body;

    if (!application_id)
      return res.status(400).json({ success: false, error: "application_id required" });

    const loan = await prisma.loan_Application.findUnique({ where: { application_id } });

    if (!loan) return res.status(404).json({ success: false, error: "Loan not found" });
    if (loan.lender_id !== lender_id)
      return res.status(403).json({ success: false, error: "Not authorized" });

    const updated = await prisma.loan_Application.update({
      where: { application_id },
      data: {
        status: "rejected",
        rejection_reason: reason || "Not provided",
      },
    });

    return res.json({ success: true, loan: updated });
  } catch (err) {
    console.error("Reject Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * POST /lender/loan/disburse
 */
router.post("/disburse", requireAuth(["lender"]), async (req, res) => {
  try {
    const lender_id = req.user!.id;
    const { application_id } = req.body;

    if (!application_id)
      return res.status(400).json({ success: false, error: "application_id required" });

    // Find loan
    const loan = await prisma.loan_Application.findUnique({
      where: { application_id },
    });

    if (!loan)
      return res.status(404).json({ success: false, error: "Loan not found" });

    if (loan.lender_id !== lender_id)
      return res.status(403).json({ success: false, error: "Not authorized" });

    if (loan.status !== "approved")
      return res.status(400).json({
        success: false,
        error: "Only approved loans can be disbursed",
      });

    // Generate simple transaction hash
    const transaction_hash = "txn_" + Math.random().toString(36).substring(2, 12);

    // Insert into Disbursement table
    const disbursement = await prisma.disbursement.create({
      data: {
        application_id,
        lender_id,
        amount: loan.amount,
        status: "completed",
        transaction_hash,
      },
    });

    // Update loan status → disbursed
    await prisma.loan_Application.update({
      where: { application_id },
      data: {
        status: "disbursed",
      },
    });

    // Increase lender total funded count
    await prisma.lender.update({
      where: { lender_id },
      data: {
        total_funded_loans: {
          increment: 1,
        },
      },
    });

    return res.json({
      success: true,
      message: "Loan disbursed successfully",
      disbursement,
    });
  } catch (err) {
    console.error("Disburse Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


export default router;
