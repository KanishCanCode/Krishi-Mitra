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

const LenderRejected = () => {
  const [rejectedLoans, setRejectedLoans] = useState<LoanRequest[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("rejectedLoans");
    if (data) setRejectedLoans(JSON.parse(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Rejected Loans</h1>
        <p className="text-muted-foreground mb-8">
          These loan applications were reviewed and rejected.
        </p>

        {rejectedLoans.length === 0 ? (
          <p className="text-muted-foreground">No rejected loans yet.</p>
        ) : (
          <div className="grid gap-6">
            {rejectedLoans.map((loan) => (
              <Card key={loan.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{loan.purpose}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-red-600 font-medium">
                      {loan.status}
                    </span>
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

export default LenderRejected;
