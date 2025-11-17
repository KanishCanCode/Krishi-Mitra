import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "farmer") {
      navigate("/auth", { replace: true });
      return;
    }

    fetchProfile();
  }, []); 

  const fetchProfile = async () => {
    try {
      const res = await fetch("/farmer/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (data.success) setFarmer(data.farmer);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <Card className="max-w-xl mx-auto shadow-sm">
          <CardHeader className="text-center space-y-3">
            {/* Profile Image */}
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/456/456212.png" />
              <AvatarFallback>F</AvatarFallback>
            </Avatar>

            <CardTitle className="text-2xl font-bold">
              {farmer.name}
            </CardTitle>
            <p className="text-muted-foreground">Farmer Profile</p>
          </CardHeader>

          <CardContent className="space-y-6 mt-4">
            {/* Email */}
            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-lg font-medium">{farmer.email}</p>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label className="text-muted-foreground">Location</Label>
              <p className="text-lg font-medium">
                {farmer.location || "Not provided"}
              </p>
            </div>

            {/* Aadhaar */}
            <div className="space-y-1">
              <Label className="text-muted-foreground">Aadhaar Number</Label>
              <p className="text-lg font-medium">
                {farmer.aadhar_number || "Not added"}
              </p>
            </div>

            {/* PAN */}
            <div className="space-y-1">
              <Label className="text-muted-foreground">PAN Number</Label>
              <p className="text-lg font-medium">
                {farmer.pan_number || "Not added"}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerProfile;
