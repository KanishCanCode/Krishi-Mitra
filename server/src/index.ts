import express from "express";
import cors from "cors";
import kycRouter from "./routes/kyc.route";

const app = express();

app.use(cors());
app.use(express.json());      // <= must be before routes

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.use("/api/kyc", kycRouter);


app.listen(3001, () => {
  console.log("Server running on port 3001");
});
