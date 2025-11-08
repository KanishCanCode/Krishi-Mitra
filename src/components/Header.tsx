import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  
  const userNavItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard", protected: true, roles: ["farmer"] },
    { name: "Loans", path: "/loans", protected: true, roles: ["farmer"] },
    { name: "Reports", path: "/reports", protected: true, roles: ["farmer"] },
    { name: "Help", path: "/help" },
  ];

  const adminNavItems = [
    { name: "Home", path: "/" },
    { name: "Admin Panel", path: "/admin", protected: true, roles: ["admin"] },
    { name: "Help", path: "/help" },
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Krishi Mitra
            </span>
          </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            if (item.protected && !isAuthenticated) return null;
            if (item.roles && !item.roles.includes(userRole || "")) return null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                if (item.roles && !item.roles.includes(userRole || "")) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-lg font-medium transition-colors ${
                      isActive(item.path) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-4">
                {isAuthenticated ? (
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
                    <Button onClick={() => navigate("/auth")}>Get Started</Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
