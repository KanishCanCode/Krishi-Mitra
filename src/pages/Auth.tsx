import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer"); // <<--- dropdown state

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/auth/${role}/login`, { // <<--- dynamic
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("login response:", data);

      if (!data.success) {
        toast({
          title: "Login Failed",
          description: data.error || "Wrong credentials",
          variant: "destructive",
        });
        return;
      }

      
      // store token
localStorage.setItem("token", data.token);
localStorage.setItem("userRole", role);
localStorage.setItem("isAuthenticated", "true");   // <--- ADD THIS


      toast({
        title: "Login successful",
        description: `Welcome back, ${role}!`,
      });
      console.log("ROLE BEFORE NAVIGATE:", role);

      // redirect
     setTimeout(() => {
  if (role === "farmer") navigate("/dashboard");
  else navigate("/lender-dashboard");
}, 30);


    } catch (err) {
      toast({
        title: "Server Error",
        description: "Cannot connect to server",
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

            {/* DROPDOWN HERE */}
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="farmer">farmer</option>
                <option value="lender">lender</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
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
                placeholder="Enter password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">Login</Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
