import express from "express";
import cors from "cors";
import kycRouter from "./routes/kyc.route";
import loanRoute from "./routes/loan.route";
import authRouter from "./routes/auth.route";
import { requireAuth } from "./middleware/auth";
import lenderLoanRoute from "./routes/lender-loan.route";


const app = express();

// CORS — allow Vite frontend and allow cookies + auth
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080"], 
  credentials: true
}));

app.use(express.json());

// Public route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// PUBLIC AUTH ROUTES
app.use("/auth", authRouter);

// PROTECTED FARMER ROUTES
app.use("/kyc", requireAuth(["farmer"]), kycRouter);
app.use("/loan", requireAuth(["farmer"]), loanRoute);

app.use("/lender/loan", requireAuth(["lender"]), lenderLoanRoute);


// Start server
app.listen(3001, () => console.log("Server running on 3001"));
