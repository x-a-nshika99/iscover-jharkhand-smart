import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ShoppingBag, BookOpen, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-eco" />
            <h1 className="text-2xl font-bold text-foreground">
              Jharkhand Tourism
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#destinations" className="text-foreground hover:text-eco transition-colors">
              Destinations
            </a>
            <a href="#experiences" className="text-foreground hover:text-eco transition-colors">
              Experiences  
            </a>
            <a href="#marketplace" className="text-foreground hover:text-cultural transition-colors">
              Marketplace
            </a>
            <a href="#events" className="text-foreground hover:text-accent transition-colors">
              Events
            </a>
            <a href="#culture" className="text-foreground hover:text-cultural transition-colors">
              Culture
            </a>
{user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="eco" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;