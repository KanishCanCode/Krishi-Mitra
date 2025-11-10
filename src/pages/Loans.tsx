import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Loans = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "farmer") {
      navigate("/auth");
    }
  }, [navigate]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    tenure: "",
    purpose: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Your loan application has been submitted to the blockchain for review.",
    });
    setFormData({ amount: "", tenure: "", purpose: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
            <p className="text-muted-foreground">Apply for a micro loan with transparent blockchain processing</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>New Loan Application</CardTitle>
                <CardDescription>Fill in the details to submit your loan request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount (₹)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenure">Tenure (months)</Label>
                    <Input
                      id="tenure"
                      name="tenure"
                      type="number"
                      placeholder="Enter tenure in months"
                      value={formData.tenure}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      placeholder="Describe the purpose of the loan (e.g., seed purchase, fertilizer, equipment)"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collateral">Collateral Documents (Optional)</Label>
                    <Input id="collateral" type="file" />
                    <p className="text-xs text-muted-foreground">Upload land records or other collateral documents</p>
                  </div>

                  <Button type="submit" className="w-full">Submit Application</Button>
                </form>
              </CardContent>
            </Card>

            {/* Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Submit Application</h4>
                      <p className="text-sm text-muted-foreground">Fill in loan details and submit to the blockchain</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Smart Contract Review</h4>
                      <p className="text-sm text-muted-foreground">Automated verification and lender matching</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Instant Approval</h4>
                      <p className="text-sm text-muted-foreground">Get notified within minutes of approval</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Direct Disbursement</h4>
<<<<<<< HEAD
                      <p className="text-sm text-muted-foreground">Funds sent directly to your digital wallet</p>
=======
                      <p className="text-sm text-muted-foreground">Funds sent directly to your bank account</p>
>>>>>>> 409fee0 (initial commit with backend)
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">8-12% per annum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">1% of loan amount</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Loan Amount</span>
                    <span className="font-medium">₹50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Tenure</span>
                    <span className="font-medium">24 months</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Loans;
