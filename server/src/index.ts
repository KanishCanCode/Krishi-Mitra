import express from "express";
import cors from "cors";
import kycRouter from "./routes/kyc.route";
import loanRoute from "./routes/loan.route";
import authRouter from "./routes/auth.route";
import { requireAuth } from "./middleware/auth";
import lenderLoanRoute from "./routes/lender-loan.route";
import farmerRoutes from "./routes/farmer.route";
import lenderRoutes from "./routes/lender.route"
import { syncApprovedApplicationsToBlockchain } from "./routes/sevices/blockchain.service";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080"], 
  credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server running ");
});
app.use("/auth", authRouter);
app.use("/farmer", farmerRoutes);
app.use("/kyc", requireAuth(["farmer"]), kycRouter);
app.use("/loan", requireAuth(["farmer"]), loanRoute);
app.use("/lender/loan", requireAuth(["lender"]), lenderLoanRoute);
app.use("/lender",lenderRoutes);
app.listen(3001, () => console.log("Server running on 3001"));
setTimeout(() => {
  console.log("🚀 Running initial blockchain sync...");
  syncApprovedApplicationsToBlockchain()
    .then(() => console.log(" Initial sync completed"))
    .catch(err => console.error(" Initial sync failed:", err));
}, 30000);

// Then run every 5 minutes
setInterval(() => {
  console.log(" Running scheduled blockchain sync...");
  syncApprovedApplicationsToBlockchain()
    .then(() => console.log(" Scheduled sync completed"))
    .catch(err => console.error(" Scheduled sync failed:", err));
}, 300000); // 5 minutes

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(' SIGINT received, shutting down gracefully');
  process.exit(0);
});
