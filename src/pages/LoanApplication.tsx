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

  const [lenders, setLenders] = useState<any[]>([]);
  const [loadingLenders, setLoadingLenders] = useState(true);

  const [form, setForm] = useState({
    lender_id: "",
    amount: "",
    tenure_months: "",
    purpose: "",
  });

  /* ---------------------------
     PROTECT ROUTE
  ----------------------------*/
  useEffect(() => {
    if (!token || role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }

    if (!kycVerified) {
      toast({
        title: "KYC Required",
        description: "Complete KYC before applying for a loan.",
        variant: "destructive",
      });
      navigate("/farmer/kyc", { replace: true });
      return;
    }

    fetchLenders();
  }, []);

  /* ---------------------------
     FETCH LENDERS (FROM BACKEND)
  ----------------------------*/
  const fetchLenders = async () => {
    try {
      const res = await fetch("/lender/list", {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setLenders(data.lenders);
      }
    } catch (error) {
      console.error("Error loading lenders", error);
    }

    setLoadingLenders(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------------------
     SUBMIT APPLICATION
  ----------------------------*/
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const amountNum = Number(form.amount);
    const tenureNum = Number(form.tenure_months);

    if (!form.lender_id) {
      toast({
        title: "Missing Lender",
        description: "Please select a lender.",
        variant: "destructive",
      });
      return;
    }

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
        <Card className="max-w-xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              New Loan Application
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* ---------------------
                   LENDER DROPDOWN
              ----------------------*/}
              <div className="space-y-1">
                <Label>Select Lender</Label>
                <select
                  name="lender_id"
                  value={form.lender_id}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border rounded-md p-3 bg-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Lender --</option>

                  {loadingLenders ? (
                    <option>Loading lenders...</option>
                  ) : lenders.length === 0 ? (
                    <option>No lenders available</option>
                  ) : (
                    lenders.map((l: any) => (
                      <option key={l.lender_id} value={l.lender_id}>
                        {l.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* LOAN AMOUNT */}
              <div className="space-y-1">
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  min="1"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Eg: 10000"
                  required
                />
              </div>

              {/* TENURE */}
              <div className="space-y-1">
                <Label>Tenure (Months)</Label>
                <Input
                  type="number"
                  min="1"
                  name="tenure_months"
                  value={form.tenure_months}
                  onChange={handleChange}
                  placeholder="Eg: 6"
                  required
                />
              </div>

              {/* PURPOSE */}
              <div className="space-y-1">
                <Label>Purpose</Label>
                <Input
                  type="text"
                  name="purpose"
                  placeholder="Seeds, fertilizer..."
                  value={form.purpose}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Interest rates will be in the range of{" "}
                  <b>5% - 12%</b>.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
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
  