import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [role, setRole] = useState<"farmer" | "lender">("farmer");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    Bank_account_no: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginChange = (e: any) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: any) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  /* ============================
        LOGIN SUBMIT
  ============================ */
  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "farmer"
          ? "/auth/farmer/login"
          : "/auth/lender/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!data.success) {
        return toast({
          title: "Login Failed",
          description: data.error,
          variant: "destructive",
        });
      }

      // Save token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);

      // save IDs
      if (role === "farmer") {
        localStorage.setItem("farmer_id", data.farmer.farmer_id);
        localStorage.setItem("kycVerified", String(data.farmer.kyc_verified));
      } else {
        localStorage.setItem("lender_id", data.lender.lender_id);
      }

      // 🔥 Redirect from backend — CLEAN + SAFE
      navigate(data.redirect || "/", { replace: true });

      toast({
        title: "Login Successful 🎉",
        description: `Welcome back, ${data[role].name}!`,
      });

    } catch (err) {
      toast({
        title: "Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
    }
  };

  /* ============================
        REGISTER SUBMIT
  ============================ */
  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "farmer"
          ? "/auth/farmer/register"
          : "/auth/lender/register";

      const body =
        role === "farmer"
          ? registerForm
          : {
              name: registerForm.name,
              email: registerForm.email,
              password: registerForm.password,
              Bank_account_no: registerForm.Bank_account_no,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        return toast({
          title: "Registration Failed",
          description: data.error,
          variant: "destructive",
        });
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);

      // store IDs
      if (role === "farmer") {
        localStorage.setItem("farmer_id", data.farmer.farmer_id);
      } else {
        localStorage.setItem("lender_id", data.lender.lender_id);
      }

      // 🔥 redirect from backend
      navigate(data.redirect || "/", { replace: true });

      toast({
        title: "Registration Successful 🎉",
        description: `Welcome, ${data[role].name}!`,
      });

    } catch (err) {
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
        <CardHeader className="text-center space-y-3">
          <CardTitle>Welcome to Krishi Mitra</CardTitle>
          <CardDescription>Login or Register</CardDescription>

          <div className="flex justify-center gap-4">
            <Button
              variant={role === "farmer" ? "default" : "outline"}
              onClick={() => setRole("farmer")}
            >
              Farmer
            </Button>
            <Button
              variant={role === "lender" ? "default" : "outline"}
              onClick={() => setRole("lender")}
            >
              Lender
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                {role === "farmer" && (
                  <div>
                    <Label>Location</Label>
                    <Input
                      name="location"
                      value={registerForm.location}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                )}

                <div>
                  <Label>Bank Account Number</Label>
                  <Input
                    name="Bank_account_no"
                    value={registerForm.Bank_account_no}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Register as {role}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
