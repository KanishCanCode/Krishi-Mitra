console.log("🔥🔥🔥 LenderDashboard FILE LOADED FROM HERE 🔥🔥🔥");

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBackToHome } from "@/hooks/useBackToHome";

type Loan = {
  application_id: string;
  farmer_id: string;
  lender_id?: string | null;
  amount: string | number;
  tenure_months: number;
  purpose?: string | null;
  status: string;
  application_date: string;
  blockchain_hash?: string | null;
  farmer?: {
    farmer_id: string;
    name?: string | null;
    email?: string | null;
    location?: string | null;
  } | null;
};

const API = "http://localhost:3001";

const LenderDashboard = () => {
  const navigate = useNavigate();
  useBackToHome();
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selected, setSelected] = useState<Loan | null>(null);

  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!token || role !== "lender") {
      navigate("/auth", { replace: true });
      return;
    }
    fetchAssignedLoans();
  }, []);

  const fetchAssignedLoans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/lender/loan/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch loans");

      setLoans(data.loans || []);
    } catch (err: any) {
      console.error("Fetch assigned loans:", err);
      toast({
        title: "Error",
        description: err.message || "Unable to fetch assigned loans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selected) return;

    const rate = Number(interestRate);

    if (rate < 5 || rate > 12) return;

    try {
      const body: any = { application_id: selected.application_id };
      body.amount = Number(amount);
      body.interest_rate = Number(interestRate);
      body.tenure_months = Number(tenureMonths);

      const res = await fetch(`${API}/lender/loan/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Approve failed");

      toast({ title: "Success", description: "Loan approved successfully" });
      setSelected(null);

      setAmount("");
      setInterestRate("");
      setTenureMonths("");

      fetchAssignedLoans();
    } catch (err: any) {
      console.error("Approve error:", err);
      toast({
        title: "Error",
        description: err.message || "Approve failed",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selected) return;

    try {
      const res = await fetch(`${API}/lender/loan/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: selected.application_id,
          reason: rejectionReason,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Reject failed");

      toast({ title: "Rejected", description: "Loan rejected successfully" });
      setSelected(null);
      setRejectionReason("");

      fetchAssignedLoans();
    } catch (err: any) {
      console.error("Reject error:", err);
      toast({
        title: "Error",
        description: err.message || "Reject failed",
        variant: "destructive",
      });
    }
  };

  const handleDisburse = async (application_id: string) => {
    try {
      const res = await fetch(`${API}/lender/loan/disburse`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ application_id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Disburse failed");

      toast({
        title: "Success",
        description: "Loan disbursed successfully",
      });

      fetchAssignedLoans();
    } catch (err: any) {
      console.error("Disburse error:", err);
      toast({
        title: "Error",
        description: err.message || "Disburse failed",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Lender Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Loan applications assigned to you
        </p>

        <div className="grid gap-6">
          {loans.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No loan applications assigned to you.
              </CardContent>
            </Card>
          )}

          {loans.map((loan) => (
            <Card key={loan.application_id} className="hover:shadow-lg">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {loan.farmer?.name || loan.farmer_id}
                    </CardTitle>
                    <CardDescription>
                      Applied:{" "}
                      {new Date(loan.application_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge>{loan.status.toUpperCase()}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-semibold">
                      ₹{Number(loan.amount).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Tenure</div>
                    <div className="font-semibold">
                      {loan.tenure_months} months
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Purpose</div>
                    <div className="font-medium">{loan.purpose || "—"}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">
                      Farmer ID
                    </div>
                    <div className="font-medium">{loan.farmer_id}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {loan.status === "pending" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex-1"
                            onClick={() => {
                              setSelected(loan);
                              setAmount(String(loan.amount));
                              setTenureMonths(String(loan.tenure_months));
                              setInterestRate("");
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Loan</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 mt-4">
                            
                            <div>
                              <Label>Amount (₹)</Label>
                              <Input
                                type="number"
                                value={amount}
                                disabled
                                className="opacity-60 cursor-not-allowed"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Read-only field
                              </p>
                            </div>

                            <div>
                              <Label>Interest Rate (%)</Label>
                              <Input
                                type="number"
                                min={5}
                                max={12}
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Allowed range: 5% to 12%
                              </p>
                            </div>

                            <div>
                              <Label>Tenure (months)</Label>
                              <Input
                                type="number"
                                value={tenureMonths}
                                disabled
                                className="opacity-60 cursor-not-allowed"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Read-only field
                              </p>
                            </div>

                            <Button
                              className="w-full"
                              onClick={handleApprove}
                              disabled={
                                Number(interestRate) < 5 ||
                                Number(interestRate) > 12
                              }
                            >
                              Confirm Approve
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => setSelected(loan)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Loan</DialogTitle>
                          </DialogHeader>

                          <Textarea
                            className="mt-4"
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) =>
                              setRejectionReason(e.target.value)
                            }
                          />

                          <Button
                            variant="destructive"
                            className="w-full mt-4"
                            onClick={handleReject}
                          >
                            Confirm Reject
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {loan.status === "approved" && (
                    <Button
                      className="flex-1"
                      onClick={() => handleDisburse(loan.application_id)}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Disburse
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LenderDashboard;
