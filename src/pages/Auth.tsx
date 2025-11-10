import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
=======
import { submitKYC } from "@/api/kyc";

>>>>>>> 409fee0 (initial commit with backend)

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials
    if (email === "farmer" && password === "farmer123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "farmer");
      toast({
        title: "Login successful",
<<<<<<< HEAD
        description: "Welcome back, Farmer!",
=======
        description: "Welcome back, Farmer!", 
>>>>>>> 409fee0 (initial commit with backend)
      });
      navigate("/dashboard");
    } else if (email === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Check demo credentials below.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Login to access your loan dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="farmer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
<<<<<<< HEAD
=======
            <Button
  type="button"
  onClick={async () => {
    const res = await submitKYC({
      farmer_id: "abc1",
      aadhaar_number: "1111-2222-3333",
      pan_number: "AAAAA0000A",
      address: "test village"
    });
    console.log(res);
  }}
>
  TEST KYC POST
</Button>

>>>>>>> 409fee0 (initial commit with backend)
            <div className="text-sm text-muted-foreground text-center mt-4 p-3 bg-muted rounded-md space-y-3">
            
              <div className="text-left">
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
