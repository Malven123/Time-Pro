import { Link, useLocation } from "wouter";
import { Clock, Calendar, BarChart2, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { href: "/", icon: Clock, label: "Timer" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/reports", icon: BarChart2, label: "Reports" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-purple-950 to-purple-900 text-white transition-transform duration-200 ease-in-out md:relative md:transform-none",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <h1 className="text-2xl font-bold text-amber-300 mb-8">TimeTrack</h1>
          <nav className="space-y-2 flex-grow">
            {links.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-800/50 hover:text-amber-200 transition-colors",
                    location === href && "bg-purple-800 text-amber-200"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </a>
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-purple-800">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-amber-200 hover:bg-purple-800/50"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}