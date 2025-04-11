"use client";

import { useState, useEffect, useCallback } from "react";
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
  Share2,
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
import { UserNotify } from "@/types/user";
import { useSocket } from "@/hooks/useSocket";
import { LanguageSwitcher } from "../language-switcher";
import { useAppContext } from "@/context/ContextLanguage";
import { setCookie } from "cookies-next";
import { useTranslation } from "@/context/ContextLanguage";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Use the socket hook
  const { notifications, socket, ring, setRing } = useSocket();

  // Only fetch profile when userId exists and user is logged in
  const { data: user } = useFetchProfile(isLoggedIn ? userId : "");

  const { context, setContext } = useAppContext();
  const [lang, setLang] = useState(context.locale ?? "en");
  const turnOnLanguages = useCallback(
    (key: string) => {
      setLang(key);
      setCookie("lang", key);
      setContext((s) => ({ ...s, locale: key }));
    },
    [setContext]
  );

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
    window.addEventListener("logoutSuccess", checkLoginStatus);
    window.addEventListener("loginSuccess", checkLoginStatus);

    // Clean up
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("logoutSuccess", checkLoginStatus);
      window.removeEventListener("loginSuccess", checkLoginStatus);
    };
  }, [pathname]); // Re-run on pathname changes to catch login redirects

  const dashboardRoutes = [
    {
      href: "/dashboard",
      label: t("dashboard.navigation.dashboard"),
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: `/dashboard/${userId}/profile?tab=profile`,
      label: t("dashboard.navigation.profile"),
      icon: User,
      active: pathname.includes(`/dashboard/${userId}/profile`),
    },
    {
      href: `/dashboard/${userId}/scripts?tab=all`,
      label: t("dashboard.navigation.scripts"),
      icon: Code2,
      active: pathname.includes(`/dashboard/${userId}/scripts`),
    },
    {
      href: "/dashboard/models",
      label: t("dashboard.navigation.models"),
      icon: Database,
      active: pathname.includes("/dashboard/models"),
    },
    {
      href: "/dashboard/settings",
      label: t("dashboard.navigation.settings"),
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

  // Reset notification ring when dropdown is opened
  const handleNotificationOpen = () => {
    if (ring) {
      setRing(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span>{t("header.brand")}</span>
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
                <span className="sr-only">{t("header.mobileMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background">
              <div className="flex items-center gap-2 pb-4 pt-2">
                <Link href="/">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span className="font-semibold">{t("header.brand")}</span>
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
          <span>{t("header.brand")}</span>
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} turnOnLanguages={turnOnLanguages} />
          <ThemeToggle />
          <DropdownMenu onOpenChange={handleNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full relative ${
                  ring ? "animate-pulse ring-2 ring-primary" : ""
                }`}
              >
                <Bell className="h-4 w-4" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <span className="sr-only">{t("header.notifications")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-2 font-medium border-b">
                {t("header.notifications")}
              </div>
              <div className="max-h-96 overflow-auto">
                {!notifications || notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {t("header.noNotifications")}
                  </div>
                ) : (
                  [...notifications.slice(-5)]
                    .reverse()
                    .map((notification: UserNotify) => (
                      <DropdownMenuItem
                        key={notification._id || `temp-${Date.now()}`}
                        className="flex flex-col items-start p-3 hover:bg-accent"
                      >
                        <div className="flex w-full gap-2">
                          <div className="flex items-center">
                            <Share2 className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="font-medium">
                            <span className="font-semibold">
                              {notification.from?.username ||
                                t("header.someone")}
                            </span>{" "}
                            {t("header.shared")}{" "}
                            {notification.script_id?.name
                              ? notification.script_id?.name
                              : t("header.something")}{" "}
                            {t("header.withYou")}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center font-medium">
                <Link href={`/dashboard/${userId}/profile?tab=notifications`}>
                  {t("header.viewAllNotifications")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    alt={user?.username || t("header.user")}
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
                <Link href={`/dashboard/${userId}/profile?tab=profile`}>
                  <User className="mr-2 h-4 w-4" />
                  {t("dashboard.navigation.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/scripts?tab=all`}>
                  <Code2 className="mr-2 h-4 w-4" />
                  {t("dashboard.navigation.scripts")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/models`}>
                  <Database className="mr-2 h-4 w-4" />
                  {t("dashboard.navigation.models")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("dashboard.navigation.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("header.logout")}</span>
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
              {t("header.features")}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("header.testimonials")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("header.pricing")}
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("header.contact")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher lang={lang} turnOnLanguages={turnOnLanguages} />
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">{t("header.getStarted")}</Link>
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
