import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, Clock, FileText } from "lucide-react";

const statusColors: any = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
};

const Loans = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // PROTECT ROUTE
  useEffect(() => {
    if (!token || role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }

    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await fetch("/loan/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setLoans(data.loans);
      }
    } catch (err) {
      console.error("Error fetching loans:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2 text-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading loans...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Loan Applications</h1>

        {loans.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You have not applied for any loans yet.</p>
            <button
              onClick={() => navigate("/apply-loan")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Apply for Loan
            </button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan: any) => (
              <Card
                key={loan.application_id}
                className="hover:shadow-lg transition-all rounded-xl border border-gray-200"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-xl font-bold">₹{loan.amount}</span>
                    <Badge
                      className={
                        statusColors[loan.status] ||
                        "bg-gray-200 text-gray-800"
                      }
                    >
                      {loan.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p><strong>Purpose:</strong> {loan.purpose}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p><strong>Tenure:</strong> {loan.tenure_months} months</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <p>
                      <strong>Applied:</strong>{" "}
                      {new Date(loan.application_date).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/loan/${loan.application_id}`)}
                    className="mt-4 w-full px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    View Details
                  </button>
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

export default Loans;
