import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBackToHome } from "@/hooks/useBackToHome";

const FarmerKYC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useBackToHome();

  const [aadhar, setAadhar] = useState("");
  const [pan, setPan] = useState("");

  const farmerId = localStorage.getItem("farmer_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const kycVerified = localStorage.getItem("kycVerified") === "true";

    if (!token || role !== "farmer") {
      navigate("/", { replace: true });
      return;
    }

    if (kycVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/kyc/complete-kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ farmer_id: farmerId, aadhar, pan }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          title: "KYC Failed",
          description: data.error || "Could not complete KYC",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("kycVerified", "true");

      toast({
        title: "KYC Completed 🎉",
        description: "You can now access Loans and Reports.",
      });

      navigate("/dashboard");
    } catch {
      toast({
        title: "Server Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your KYC</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label>Aadhar Number</Label>
                <Input
                  type="text"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full" type="submit">
                Submit KYC
              </Button>

            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerKYC;
