import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBackToHome } from "@/hooks/useBackToHome";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  useBackToHome();

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }

    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/loan/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setLoans(data.loans);
      }
    } catch (err) {
      console.error("Error fetching dashboard loans:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  // ==========================
  // 📌 COMPUTED VALUES
  // ==========================

  const totalBorrowed = loans
    .filter((l: any) =>
      ["approved", "active", "disbursed", "completed"].includes(l.status)
    )
    .reduce((sum: number, loan: any) => sum + Number(loan.amount), 0);

  const activeLoans = loans.filter((l: any) =>
    ["approved", "active", "disbursed"].includes(l.status)
  ).length;

  const repaid = 0; // Placeholder until repayment routes ready

  const recentLoans = loans.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your loans and profile</p>
          </div>

          {/* ============================ */}
          {/* 📊 TOP STATS */}
          {/* ============================ */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* TOTAL BORROWED */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{totalBorrowed.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {loans.length} loans
                </p>
              </CardContent>
            </Card>

            {/* ACTIVE LOANS */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{activeLoans}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            {/* REPAID (COMING AFTER REPAYMENT FEATURE) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Repaid</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{repaid.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>

            {/* CREDIT SCORE SAMPLE */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">785</div>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </CardContent>
            </Card>
          </div>

          {/* ============================ */}
          {/* 📝 QUICK ACTIONS */}
          {/* ============================ */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* PROFILE */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>View KYC details & personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/farmer/profile")}>
                  Manage Profile
                </Button>
              </CardContent>
            </Card>

            {/* APPLY FOR LOAN */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Apply for Loan</CardTitle>
                <CardDescription>Submit a new loan application</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/apply-loan")}>
                  New Application
                </Button>
              </CardContent>
            </Card>

            {/* REPORTS */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>View loan activity & analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/reports")}>
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ============================ */}
          {/* 🕒 RECENT LOANS */}
          {/* ============================ */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Loans</CardTitle>
              <CardDescription>Your latest loan applications</CardDescription>
            </CardHeader>

            <CardContent>
              {recentLoans.length === 0 ? (
                <p className="text-muted-foreground">No recent loans found.</p>
              ) : (
                <div className="space-y-4">
                  {recentLoans.map((loan: any) => (
                    <div
                      key={loan.application_id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{loan.purpose}</p>

                        <p className="text-sm text-muted-foreground">
                          Loan #{loan.application_id.slice(0, 6)} •{" "}
                          {new Date(loan.application_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary">₹{loan.amount}</p>
                        <Badge
                          className="mt-1"
                        >
                          {loan.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
