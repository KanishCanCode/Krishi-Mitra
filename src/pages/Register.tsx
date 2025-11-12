import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    Bank_account_no: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/auth/farmer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Registration Failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration Successful 🎉",
        description: `Welcome aboard, ${data.farmer.name}!`,
      });

      // Store token and redirect directly to KYC
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "farmer");
      localStorage.setItem("farmer_id", data.farmer.farmer_id);
      localStorage.setItem("kycVerified", "false");

      navigate("/kyc");
    } catch (err) {
      console.error(err);
      toast({
        title: "Server Error",
        description: "Could not connect to backend",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle>Farmer Registration</CardTitle>
          <CardDescription>Join Krishi Mitra to apply for loans</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email", "password", "location", "Bank_account_no"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field.replace("_", " ")}</Label>
                <Input
                  id={field}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  placeholder={`Enter your ${field.replace("_", " ")}`}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Already registered? Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
