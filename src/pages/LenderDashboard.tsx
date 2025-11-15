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
  Calendar,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  farmer?:
    | {
        farmer_id: string;
        name?: string | null;
        email?: string | null;
        location?: string | null;
      }
    | null;
};

const LenderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selected, setSelected] = useState<Loan | null>(null);

  // form fields used for approval
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    // protect route: must be logged-in lender
    if (!token || role !== "lender") {
      navigate("/auth", { replace: true });
      return;
    }
    fetchAssignedLoans();
  }, []);

  const fetchAssignedLoans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/lender/loan/assigned", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch loans");
      }
      setLoans(data.loans || []);
    } catch (err: any) {
      console.error("Fetch assigned loans:", err);
      toast({
        title: "Error",
        description: err.message || "Unable to fetch loans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selected) return;
    try {
      const body: any = { application_id: selected.application_id };
      if (amount) body.amount = Number(amount);
      if (interestRate) body.interest_rate = Number(interestRate);
      if (tenureMonths) body.tenure_months = Number(tenureMonths);

      const res = await fetch("/lender/loan/approve", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Approve failed");

      toast({ title: "Approved", description: "Loan approved successfully" });
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
      const res = await fetch("/lender/loan/reject", {
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

      toast({ title: "Rejected", description: "Loan rejected" });
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
      const res = await fetch("/lender/loan/disburse", {
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
        title: "Disbursed",
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lender Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Loan applications assigned to you
            </p>
          </div>

          {/* 🚀 Logout button removed */}
        </div>

        <div className="grid gap-6">
          {loans.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No loan applications assigned to you.
                </p>
              </CardContent>
            </Card>
          )}

          {loans.map((loan) => (
            <Card
              key={loan.application_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {loan.farmer?.name || loan.farmer_id}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Applied:{" "}
                      {new Date(loan.application_date).toLocaleDateString()}
                    </CardDescription>
                  </div>

                  <Badge>{loan.status?.toUpperCase()}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Amount
                      </div>
                      <div className="font-semibold">
                        ₹{Number(loan.amount).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tenure
                      </div>
                      <div className="font-semibold">
                        {loan.tenure_months} months
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">
                      Purpose
                    </div>
                    <div className="font-medium">
                      {loan.purpose || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">
                      Farmer ID
                    </div>
                    <div className="font-medium">{loan.farmer_id}</div>
                  </div>
                </div>

                {/* actions */}
                <div className="flex gap-2">
                  {loan.status === "pending" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setSelected(loan);
                              setAmount(String(loan.amount));
                              setTenureMonths(String(loan.tenure_months));
                              setInterestRate("");
                            }}
                            className="flex-1"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Loan</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <Label>Amount (₹)</Label>
                              <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                              />
                            </div>

                            <div>
                              <Label>Interest Rate (%)</Label>
                              <Input
                                type="number"
                                value={interestRate}
                                onChange={(e) =>
                                  setInterestRate(e.target.value)
                                }
                              />
                            </div>

                            <div>
                              <Label>Tenure (months)</Label>
                              <Input
                                type="number"
                                value={tenureMonths}
                                onChange={(e) =>
                                  setTenureMonths(e.target.value)
                                }
                              />
                            </div>

                            <Button onClick={handleApprove} className="w-full">
                              Confirm Approve
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => setSelected(loan)}
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Loan</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            <Textarea
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              placeholder="Reason for rejection"
                              rows={4}
                            />
                            <Button
                              variant="destructive"
                              onClick={handleReject}
                              className="w-full"
                            >
                              Confirm Reject
                            </Button>
                          </div>
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
