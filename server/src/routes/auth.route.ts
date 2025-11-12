import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "change-me";

function signToken(role: "farmer" | "lender", id: string, email: string) {
  return jwt.sign({ role, id, email }, JWT_SECRET, { expiresIn: "7d" });
}

/** --------- FARMER ---------- */
router.post("/farmer/register", async (req, res) => {
  try {
    const { name, email, password, location, Bank_account_no } = req.body;
    const exists = await prisma.farmer.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const farmer = await prisma.farmer.create({
      data: { name, email, passwordHash, location, Bank_account_no, kyc_verified: false },
    });
    const token = signToken("farmer", farmer.farmer_id, farmer.email);
    res.json({ success: true, token, farmer });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/farmer/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmer = await prisma.farmer.findUnique({ where: { email } });
    if (!farmer) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, farmer.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken("farmer", farmer.farmer_id, farmer.email);
    res.json({ success: true, token, role: "farmer",farmer });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

/** --------- LENDER ---------- */
router.post("/lender/register", async (req, res) => {
  try {
    const { name,  email, password ,Bank_account_no} = req.body;
    const exists = await prisma.lender.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const lender = await prisma.lender.create({
      data: { name,  email, passwordHash,Bank_account_no},
    });
    const token = signToken("lender", lender.lender_id, lender.email);
    res.json({ success: true, token, lender });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/lender/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lender = await prisma.lender.findUnique({ where: { email } });
    if (!lender) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, lender.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken("lender", lender.lender_id, lender.email);
    res.json({ success: true, token, role:"lender",lender });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
