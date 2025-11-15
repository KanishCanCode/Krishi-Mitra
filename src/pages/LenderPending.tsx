import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoanRequest {
  id: number;
  farmerName: string;
  amount: number;
  purpose: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const LenderPending = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LoanRequest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pendingLoans");
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      const sample: LoanRequest[] = [
        {
          id: 1,
          farmerName: "Ramesh Kumar",
          amount: 15000,
          purpose: "Crop Fertilizer Purchase",
          date: "2025-10-05",
          status: "Pending",
        },
        {
          id: 2,
          farmerName: "Anita Devi",
          amount: 20000,
          purpose: "Irrigation Equipment",
          date: "2025-10-10",
          status: "Pending",
        },
      ];
      setRequests(sample);
      localStorage.setItem("pendingLoans", JSON.stringify(sample));
    }
  }, []);

  const handleDecision = (id: number, newStatus: "Approved" | "Rejected") => {
    console.log("Decision clicked:", newStatus); // 🧠 Debug check

    const decidedLoan = requests.find((req) => req.id === id);
    if (!decidedLoan) return;

    // Update local storage
    decidedLoan.status = newStatus;

    const updatedRequests = requests.filter((req) => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem("pendingLoans", JSON.stringify(updatedRequests));

    if (newStatus === "Approved") {
      const approvedLoans =
        JSON.parse(localStorage.getItem("approvedLoans") || "[]");
      localStorage.setItem(
        "approvedLoans",
        JSON.stringify([...approvedLoans, decidedLoan])
      );
      navigate("/lender/active", { replace: true }); // ✅ smoother redirect
    } else {
      const rejectedLoans =
        JSON.parse(localStorage.getItem("rejectedLoans") || "[]");
      localStorage.setItem(
        "rejectedLoans",
        JSON.stringify([...rejectedLoans, decidedLoan])
      );
      navigate("/lender/rejected", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Pending Approvals</h1>
        <p className="text-muted-foreground mb-8">
          Review and take action on farmer loan applications.
        </p>

        {requests.length === 0 ? (
          <p className="text-muted-foreground">No pending applications.</p>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <Card key={req.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{req.purpose}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Farmer:</span>
                    <span>{req.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>₹{req.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{req.date}</span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleDecision(req.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => handleDecision(req.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LenderPending;
