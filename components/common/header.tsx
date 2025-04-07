"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Droplets,
  LogOut,
  User,
  Settings,
  Code2,
  Database,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFetchProfile } from "@/hooks/useFetchUser";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only fetch profile when userId exists and user is logged in
  const { data: user } = useFetchProfile(isLoggedIn ? userId : "");

  // Check login status on component mount and pathname change
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId") || "";

        setIsLoggedIn(!!token);
        setUserId(userId);
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    // Set up event listener for login/logout events
    window.addEventListener("storage", checkLoginStatus);

    // Clean up
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [pathname]); // Re-run on pathname changes to catch login redirects

  // Custom event listener for login success
  useEffect(() => {
    const handleLoginSuccess = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId") || "";
        setIsLoggedIn(!!token);
        setUserId(userId);
      }
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, []);

  const dashboardRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: `/dashboard/${userId}/profile`,
      label: "Profile",
      icon: User,
      active: pathname.includes(`/dashboard/${userId}/profile`),
    },
    {
      href: `/dashboard/${userId}/scripts`,
      label: "Scripts",
      icon: Code2,
      active: pathname.includes(`/dashboard/${userId}/scripts`),
    },
    {
      href: "/dashboard/models",
      label: "Models",
      icon: Database,
      active: pathname.includes("/dashboard/models"),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ];

  const handleSignout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileImage");
      localStorage.removeItem("curUsername");

      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("logoutSuccess"));
    }

    setIsLoggedIn(false);
    router.replace("/");
  };

  // Render loading state
  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span>Irrigation Portal</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center">
        {isLoggedIn && (
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background">
              <div className="flex items-center gap-2 pb-4 pt-2">
                <Link href="/">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Irrigation Portal</span>
                  </div>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium">
                {dashboardRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                      route.active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-6 w-6 text-primary" />
          <span>Irrigation Portal</span>
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full"
          >
            <Link href={`/dashboard/${userId}/notifications`}>
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative h-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profile_image || "/placeholder-user.jpg"}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>
                    {user?.username
                      ? user.username.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/profile`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/scripts`}>Scripts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/models">Models</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
