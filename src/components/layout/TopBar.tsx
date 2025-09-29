import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Menu, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";

export function TopBar() {
  const location = useLocation();
  const flaggedCount = useStore(state => state.flaggedCount);
  
  const navigation = [
    { name: "Tests", href: "/tests", current: location.pathname.startsWith("/tests") },
    { name: "Profile", href: "/profile", current: location.pathname === "/profile" },
    { name: "Officials", href: "/officials", current: location.pathname === "/officials" },
    { name: "Admin", href: "/admin", current: location.pathname === "/admin" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SAI</span>
            </div>
            <span className="font-bold text-lg text-foreground">Sports Assessment</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-primary text-primary-foreground shadow-performance"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notification badge */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {flaggedCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {flaggedCount}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}