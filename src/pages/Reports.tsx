import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const kycVerified = localStorage.getItem("kycVerified") === "true";

  useEffect(() => {
    // Not logged in?
    if (!token || !role) {
      navigate("/auth", { replace: true });
      return;
    }

    // Logged in but NOT a farmer
    if (role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }

    // If user is NOT KYC verified & NOT already on KYC page
    if (!kycVerified && location.pathname !== "/farmer/kyc") {
      toast({
        title: "Complete KYC First",
        description: "You must complete your KYC to access Reports.",
      });

      navigate("/farmer/kyc", { replace: true });
    }
  }, []);

  // If not verified → Do not render this page
  if (!kycVerified) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        <Card>
          <CardHeader>
            <CardTitle>Your Loan Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Here will be your loan reports and analytics...</p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
