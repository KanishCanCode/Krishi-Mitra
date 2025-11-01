import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, PieChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Reports = () => {
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
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">View detailed statistics about your loan portfolio</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Lifetime applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹45,000</div>
                <p className="text-xs text-muted-foreground">All-time total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Tenure</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 months</div>
                <p className="text-xs text-muted-foreground">Average loan period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Repayment Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-xs text-muted-foreground">On-time payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report */}
          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>Complete overview of all your loan applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Loan ID</th>
                      <th className="text-left py-3 px-4">Purpose</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Tenure</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">#1234</td>
                      <td className="py-3 px-4">Fertilizer Purchase</td>
                      <td className="py-3 px-4 font-semibold text-primary">₹15,000</td>
                      <td className="py-3 px-4">12 months</td>
                      <td className="py-3 px-4 text-muted-foreground">Jan 15, 2025</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">#1233</td>
                      <td className="py-3 px-4">Seed Purchase</td>
                      <td className="py-3 px-4 font-semibold text-primary">₹10,000</td>
                      <td className="py-3 px-4">18 months</td>
                      <td className="py-3 px-4 text-muted-foreground">Dec 10, 2024</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">#1232</td>
                      <td className="py-3 px-4">Equipment Repair</td>
                      <td className="py-3 px-4 font-semibold text-primary">₹12,000</td>
                      <td className="py-3 px-4">10 months</td>
                      <td className="py-3 px-4 text-muted-foreground">Oct 5, 2024</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">#1231</td>
                      <td className="py-3 px-4">Irrigation System</td>
                      <td className="py-3 px-4 font-semibold text-primary">₹8,000</td>
                      <td className="py-3 px-4">16 months</td>
                      <td className="py-3 px-4 text-muted-foreground">Aug 20, 2024</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Performance</CardTitle>
                <CardDescription>Track your payment history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>On-time Payments</span>
                    <span className="font-medium">15/15 (100%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Repaid</span>
                    <span className="font-medium">₹20,000 / ₹25,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-4/5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Purpose Breakdown</CardTitle>
                <CardDescription>Where your funds went</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Seeds & Fertilizers</span>
                  <span className="text-sm font-medium">55%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Equipment</span>
                  <span className="text-sm font-medium">27%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Irrigation</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
