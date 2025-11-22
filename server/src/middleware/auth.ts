import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  prisma  from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export interface AuthUser {
  role: "farmer" | "lender";
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(
  roles?: Array<AuthUser["role"]>,
  requireKYC?: boolean
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;

      if (!token) return res.status(401).json({ error: "Missing token" });

      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Attach decoded user to request
      req.user = decoded;

      // 🟩  KYC ENFORCEMENT
      if (requireKYC && decoded.role === "farmer") {
        const farmer = await prisma.farmer.findUnique({
          where: { farmer_id: decoded.id },
          select: { kyc_verified: true },
        });

        if (!farmer?.kyc_verified) {
          return res.status(403).json({
            error: "KYC incomplete. Please complete KYC first.",
          });
        }
      }

      next();

    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
