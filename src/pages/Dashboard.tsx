import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Clock, CheckCircle, User, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "farmer") {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your loans and profile</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹25,000</div>
                <p className="text-xs text-muted-foreground">Across 2 loans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">2</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Repaid</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹15,000</div>
                <p className="text-xs text-muted-foreground">60% completed</p>
              </CardContent>
            </Card>

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

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Profile</CardTitle>
<<<<<<< HEAD
                <CardDescription>View and edit your KYC details, wallet address, and loan history</CardDescription>
=======
                <CardDescription>View and edit your KYC details  and loan history</CardDescription>
>>>>>>> 409fee0 (initial commit with backend)
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Manage Profile</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Apply for Loan</CardTitle>
                <CardDescription>Submit a new loan application with amount, tenure, and purpose</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">New Application</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>View detailed reports and statistics about your loan portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Reports</Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Loans</CardTitle>
              <CardDescription>Your latest loan applications and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Crop Fertilizer Purchase</p>
                    <p className="text-sm text-muted-foreground">Loan #1234 • Applied on Jan 15, 2025</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-primary">₹15,000</p>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Seed Purchase</p>
                    <p className="text-sm text-muted-foreground">Loan #1233 • Applied on Dec 10, 2024</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-primary">₹10,000</p>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
