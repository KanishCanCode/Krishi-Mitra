import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LoanRequest {
  id: number;
  farmerName: string;
  amount: number;
  purpose: string;
  date: string;
  status: string;
}

const LenderActive = () => {
  const [approvedLoans, setApprovedLoans] = useState<LoanRequest[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("approvedLoans");
    if (data) setApprovedLoans(JSON.parse(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Active Loans</h1>
        <p className="text-muted-foreground mb-8">
          These loans have been approved and are currently active.
        </p>

        {approvedLoans.length === 0 ? (
          <p className="text-muted-foreground">No active loans yet.</p>
        ) : (
          <div className="grid gap-6">
            {approvedLoans.map((loan) => (
              <Card key={loan.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{loan.purpose}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Farmer:</span>
                    <span>{loan.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>₹{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{loan.date}</span>
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

export default LenderActive;
