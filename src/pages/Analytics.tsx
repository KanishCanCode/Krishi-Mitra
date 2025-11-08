import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Analytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">System-wide reports and performance metrics</p>
            </div>
            <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">342</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹45.2M</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">247</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Status Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Overview</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Approved Loans</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">186</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <span className="font-medium">Pending Review</span>
                  </div>
                  <span className="text-2xl font-bold text-secondary">18</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium">Rejected Loans</span>
                  </div>
                  <span className="text-2xl font-bold text-destructive">12</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Amount Distribution</CardTitle>
                <CardDescription>Average loan sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">₹0 - ₹10,000</span>
                    <span className="text-sm text-muted-foreground">45 loans</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">₹10,000 - ₹25,000</span>
                    <span className="text-sm text-muted-foreground">78 loans</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">₹25,000 - ₹50,000</span>
                    <span className="text-sm text-muted-foreground">52 loans</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">₹50,000+</span>
                    <span className="text-sm text-muted-foreground">11 loans</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div className="bg-primary/60 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Regions */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Regions</CardTitle>
              <CardDescription>Loan disbursement by state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { region: "Punjab", loans: 89, amount: "₹12.5M", trend: "+15%" },
                  { region: "Haryana", loans: 67, amount: "₹9.8M", trend: "+12%" },
                  { region: "Uttar Pradesh", loans: 54, amount: "₹7.2M", trend: "+8%" },
                  { region: "Gujarat", loans: 43, amount: "₹6.1M", trend: "+10%" },
                  { region: "Maharashtra", loans: 38, amount: "₹5.4M", trend: "+6%" },
                ].map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{region.region}</h4>
                      <p className="text-sm text-muted-foreground">{region.loans} loans disbursed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{region.amount}</p>
                      <div className="flex items-center justify-end text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {region.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
