import express from "express";
import cors from "cors";
import kycRouter from "./routes/kyc.route";
import loanRoute from "./routes/loan.route"
import authRouter from "./routes/auth.route";
import { requireAuth } from "./middleware/auth";

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use(express.json());



    // <= must be before routes

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// PUBLIC
app.use("/auth", authRouter);

// PROTECTED
app.use("/kyc", requireAuth(["farmer"]), kycRouter);
app.use("/loan", requireAuth(["farmer"]), loanRoute);

app.listen(3001, () => console.log("Server running on 3001"));
app.use("/api/kyc", kycRouter);


app.listen(3001, () => {
  console.log("Server running on port 3001");
});
