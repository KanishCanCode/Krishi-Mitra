// server/src/routes/auth.route.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

function signToken(role: "farmer" | "lender", id: string, email: string) {
  return jwt.sign({ role, id, email }, JWT_SECRET, { expiresIn: "7d" });
}

/* ============================
   FARMER ROUTES
   ============================ */

router.post("/farmer/register", async (req, res) => {
  try {
    const { name, email, password, location, bank_account } = req.body;

    if (!name || !email || !password || !location)
      return res.status(400).json({ success: false, error: "All fields required" });

    const exists = await prisma.farmer.findUnique({ where: { email } });
    if (exists)
      return res.status(400).json({ success: false, error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const farmer = await prisma.farmer.create({
      data: {
        name,
        email,
        passwordHash,
        location,
        bank_account,
        kyc_verified: false,
      },
    });

    const token = signToken("farmer", farmer.farmer_id, farmer.email);

    return res.json({
      success: true,
      role: "farmer",
      token,
      farmer,
      redirect: "/dashboard",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

router.post("/farmer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await prisma.farmer.findUnique({ where: { email } });
    if (!farmer)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, farmer.passwordHash);
    if (!valid)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const token = signToken("farmer", farmer.farmer_id, farmer.email);

    return res.json({
      success: true,
      role: "farmer",
      token,
      farmer,
      redirect: farmer.kyc_verified ? "/dashboard" : "/farmer/kyc",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

/* ============================
   LENDER ROUTES
   ============================ */

router.post("/lender/register", async (req, res) => {
  try {
    const { name, email, password, Bank_account_no } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: "All fields required" });

    const exists = await prisma.lender.findUnique({ where: { email } });
    if (exists)
      return res.status(400).json({ success: false, error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const lender = await prisma.lender.create({
      data: {
        name,
        email,
        passwordHash,
        Bank_account_no,
      },
    });

    const token = signToken("lender", lender.lender_id, lender.email);

    return res.json({
      success: true,
      role: "lender",
      token,
      lender,
      redirect: "/lender/dashboard",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

router.post("/lender/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const lender = await prisma.lender.findUnique({ where: { email } });
    if (!lender)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, lender.passwordHash);
    if (!valid)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const token = signToken("lender", lender.lender_id, lender.email);

    return res.json({
      success: true,
      role: "lender",
      token,
      lender,
      redirect: "/lender/dashboard", // ✅ ALWAYS GO HERE AFTER LOGIN
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

export default router;
