import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loans, setLoans] = useState([
    { id: "5678", name: "Ramesh Kumar", purpose: "Fertilizer Purchase", amount: "₹20,000", date: "Jan 20, 2025", status: "pending" },
    { id: "5677", name: "Priya Sharma", purpose: "Seed Purchase", amount: "₹12,000", date: "Jan 19, 2025", status: "pending" },
    { id: "5676", name: "Amit Patel", purpose: "Equipment Repair", amount: "₹18,000", date: "Jan 18, 2025", status: "pending" },
  ]);

  const [stats, setStats] = useState({
    pendingApprovals: 18,
    totalDisbursed: 12.5,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/auth");
    }
  }, [navigate]);

  const handleApproveLoan = (loanId: string, farmerName: string, amount: string) => {
    setLoans(loans.filter(loan => loan.id !== loanId));
    setStats(prev => ({
      pendingApprovals: prev.pendingApprovals - 1,
      totalDisbursed: prev.totalDisbursed + parseFloat(amount.replace(/[₹,]/g, '')) / 100000,
    }));
    toast({
      title: "Loan Approved",
      description: `${farmerName}'s loan application has been approved.`,
    });
  };

  const handleRejectLoan = (loanId: string, farmerName: string) => {
    setLoans(loans.filter(loan => loan.id !== loanId));
    setStats(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals - 1,
    }));
    toast({
      title: "Loan Rejected",
      description: `${farmerName}'s loan application has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all loan applications and users</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">247</div>
                <p className="text-xs text-muted-foreground">Active farmers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{stats.totalDisbursed.toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">94%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Loan Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Loan Applications</CardTitle>
              <CardDescription>Manage pending and recent loan requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pending loan applications</p>
                  </div>
                ) : (
                  loans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{loan.name} - {loan.purpose}</p>
                        <p className="text-sm text-muted-foreground">Loan #{loan.id} • Applied on {loan.date}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-primary">{loan.amount}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApproveLoan(loan.id, loan.name, loan.amount)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectLoan(loan.id, loan.name)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage all registered farmers and their KYC details</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin/users")}>View All Users</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>All Loans</CardTitle>
                <CardDescription>Browse all loan applications with filtering and search</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => toast({ title: "Loans Page", description: "Advanced loan management coming soon!" })}>View Loans</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View system-wide reports, trends, and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin/analytics")}>View Analytics</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
