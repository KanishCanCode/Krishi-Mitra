import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, UserX, Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([
    { id: "1", name: "Ramesh Kumar", email: "ramesh@example.com", phone: "+91 98765 43210", location: "Punjab", kycStatus: "verified", joinDate: "Dec 15, 2024" },
    { id: "2", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", location: "Haryana", kycStatus: "verified", joinDate: "Jan 5, 2025" },
    { id: "3", name: "Amit Patel", email: "amit@example.com", phone: "+91 98765 43212", location: "Gujarat", kycStatus: "pending", joinDate: "Jan 10, 2025" },
    { id: "4", name: "Sunita Devi", email: "sunita@example.com", phone: "+91 98765 43213", location: "Bihar", kycStatus: "verified", joinDate: "Jan 12, 2025" },
    { id: "5", name: "Rajesh Singh", email: "rajesh@example.com", phone: "+91 98765 43214", location: "Uttar Pradesh", kycStatus: "pending", joinDate: "Jan 15, 2025" },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/auth");
    }
  }, [navigate]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleKYC = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, kycStatus: user.kycStatus === "verified" ? "pending" : "verified" }
        : user
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
              <p className="text-muted-foreground">View and manage all registered farmers</p>
            </div>
            <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verified KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.kycStatus === "verified").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {users.filter(u => u.kycStatus === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">3</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Search and manage farmer accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge variant={user.kycStatus === "verified" ? "default" : "secondary"}>
                          {user.kycStatus === "verified" ? "KYC Verified" : "KYC Pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleKYC(user.id)}
                      >
                        {user.kycStatus === "verified" ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Revoke KYC
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Verify KYC
                          </>
                        )}
                      </Button>
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

export default ManageUsers;
