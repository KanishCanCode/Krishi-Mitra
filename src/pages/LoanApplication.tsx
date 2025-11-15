import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const LoanApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const kycVerified = localStorage.getItem("kycVerified") === "true";

  const [form, setForm] = useState({
    lender_id: "",
    amount: "",
    tenure_months: "",
    purpose: "",
  });

  // Protect Route
  useEffect(() => {
    if (!token || role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }
    if (!kycVerified) {
      toast({
        title: "KYC Required",
        description: "Complete KYC before applying for loans.",
        variant: "destructive",
      });
      navigate("/farmer/kyc", { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountNum = Number(form.amount);
    const tenureNum = Number(form.tenure_months);

    if (amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Loan amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (tenureNum <= 0) {
      toast({
        title: "Invalid Tenure",
        description: "Tenure must be greater than 0 months.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/loan/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lender_id: form.lender_id,
          amount: amountNum,
          tenure_months: tenureNum,
          purpose: form.purpose,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Submission Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Loan Submitted 🎉",
        description: "Your loan application is pending approval.",
      });

      navigate("/dashboard", { replace: true });

    } catch (err) {
      toast({
        title: "Server Error",
        description: "Cannot reach backend.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>New Loan Application</CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <Label>Lender ID</Label>
                <Input
                  name="lender_id"
                  value={form.lender_id}
                  onChange={handleChange}
                  required
                  placeholder="Enter lender_id"
                />
              </div>

              <div>
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  min="1"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Tenure (Months)</Label>
                <Input
                  type="number"
                  min="1"
                  name="tenure_months"
                  value={form.tenure_months}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Purpose</Label>
                <Input
                  type="text"
                  name="purpose"
                  placeholder="Seeds, fertilizer..."
                  value={form.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Application
              </Button>

            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LoanApplication;
