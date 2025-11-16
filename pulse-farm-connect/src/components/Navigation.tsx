import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, LayoutDashboard, FileText, Leaf, Plane, Factory, Settings, LogOut } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/schemes", icon: FileText, label: "Schemes" },
    { path: "/crops", icon: Leaf, label: "Crop Advisor" },
    { path: "/services", icon: Plane, label: "Services" },
    { path: "/factories", icon: Factory, label: "Factories" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-primary via-primary-light to-primary shadow-strong p-6 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-xl bg-white shadow-glow flex items-center justify-center">
          <Sprout className="h-6 w-6 text-primary" />
        </div>
        <div className="text-white">
          <h1 className="text-2xl font-bold">GreenPulse</h1>
          <p className="text-xs text-white/80">Sustainable Agri</p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-white text-primary shadow-soft"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <Link to="/auth">
        <Button variant="outline" className="w-full gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </Link>
    </nav>
  );
};

export default Navigation;
