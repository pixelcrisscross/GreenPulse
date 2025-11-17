import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sprout, LayoutDashboard, FileText, Leaf, Power, Plane, Factory, Settings, LogOut, Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/schemes", icon: FileText, label: "Schemes" },
    { path: "/crops", icon: Leaf, label: "Crop Advisor" },
    { path: "/motor", icon: Power, label: "Motor Control" },
    { path: "/services", icon: Plane, label: "Services" },
    { path: "/factories", icon: Factory, label: "Factories" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Hamburger Button (always visible) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <nav
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gradient-to-b 
          from-primary via-primary-light to-primary shadow-strong 
          p-6 flex flex-col transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8" onClick={() => setIsOpen(false)}>
          <div className="h-12 w-12 rounded-xl bg-white shadow-glow flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">GreenPulse</h1>
            <p className="text-xs text-white/80">Sustainable Agri</p>
          </div>
        </Link>

        {/* Links */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
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

        {/* Logout */}
        <Link to="/auth" onClick={() => setIsOpen(false)}>
          <Button
            variant="outline"
            className="w-full gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </nav>
    </>
  );
};

export default Navigation;