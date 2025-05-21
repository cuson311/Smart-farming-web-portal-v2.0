"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Code2,
  Database,
  Home,
  Share2,
  FileChartLine,
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
import { NotiInfo } from "@/types/user";
import { useSocket } from "@/hooks/useSocket";
import { LanguageSwitcher } from "../language-switcher";
import { useTranslations } from "next-intl";
import Logo from "@/public/favicon.svg";
import Image from "next/image";
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("header");

  const { notifications, socket, ring, setRing } = useSocket();
  const { data: user } = useFetchProfile(isLoggedIn ? userId : "");

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

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("logoutSuccess", checkLoginStatus);
    window.addEventListener("loginSuccess", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("logoutSuccess", checkLoginStatus);
      window.removeEventListener("loginSuccess", checkLoginStatus);
    };
  }, [pathname]);

  const dashboardRoutes = [
    {
      href: "/dashboard",
      label: t("navigation.dashboard"),
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: `/dashboard/${userId}/profile?tab=profile`,
      label: t("navigation.profile"),
      icon: User,
      active: pathname.includes(`/dashboard/${userId}/profile`),
    },
    {
      href: `/dashboard/${userId}/scripts?tab=all`,
      label: t("navigation.scripts"),
      icon: Code2,
      active: pathname.includes(`/dashboard/${userId}/scripts`),
    },
    {
      href: `/dashboard/${userId}models`,
      label: t("navigation.models"),
      icon: Database,
      active: pathname.includes(`/dashboard/${userId}/models`),
    },
    {
      href: `/dashboard/${userId}/generatedScripts`,
      label: t("navigation.generatedScripts"),
      icon: FileChartLine,
      active: pathname.includes(`/dashboard/${userId}/generatedScripts`),
    },
    {
      href: `/dashboard/${userId}/settings`,
      label: t("navigation.settings"),
      icon: Settings,
      active: pathname === `/dashboard/${userId}/settings`,
    },
  ];

  const handleSignout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileImage");
      localStorage.removeItem("curUsername");

      window.dispatchEvent(new Event("logoutSuccess"));
    }

    setIsLoggedIn(false);
    router.replace("/");
  };

  const handleNotificationOpen = () => {
    if (ring) {
      setRing(false);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="logo" width={32} height={32} />
              <span className="text-xl font-semibold">An tâm tưới</span>
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background opacity-[0.95] px-4 md:px-6">
      <div className="flex items-center">
        {isLoggedIn && (
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">{t("mobileMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background">
              <div className="flex items-center gap-2 pb-4 pt-2">
                <Link href="/">
                  <div className="flex items-center gap-2">
                    <Image src={Logo} alt="logo" width={32} height={32} />
                    <span className="text-xl font-semibold">An tâm tưới</span>
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
          <Image src={Logo} alt="logo" width={32} height={32} />
          <span className="text-xl font-semibold">An tâm tưới</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="#features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {t("features")}
        </Link>
        <Link
          href="#testimonials"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {t("testimonials")}
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {t("contact")}
        </Link>
      </nav>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
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
                {notifications && notifications.total > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.total}
                  </span>
                )}
                <span className="sr-only">{t("notifications")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-2 font-medium border-b">
                {t("notifications")}
              </div>
              <div className="max-h-96 overflow-auto">
                {!notifications || notifications.total === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {t("noNotifications")}
                  </div>
                ) : (
                  notifications.data.map((notification: NotiInfo) => (
                    <DropdownMenuItem
                      key={
                        notification._id ||
                        `temp-${Date.now()}-${Math.random()}`
                      }
                      className="flex flex-col items-start p-3 hover:bg-accent"
                    >
                      <div className="flex w-full gap-2">
                        <div className="flex items-center">
                          <Share2 className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="font-medium">
                          <span className="font-semibold">
                            {notification.from?.username || t("someone")}
                          </span>{" "}
                          {t("shared")}{" "}
                          {notification.script_id?.name
                            ? notification.script_id?.name
                            : t("something")}{" "}
                          {t("withYou")}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center font-medium">
                <Link href={`/dashboard/${userId}/profile?tab=notifications`}>
                  {t("viewAllNotifications")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative h-8 p-0 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profile_image || "/placeholder-user.jpg"}
                    alt={user?.username || t("user")}
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
                  {t("navigation.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/scripts?tab=all`}>
                  <Code2 className="mr-2 h-4 w-4" />
                  {t("navigation.scripts")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/models`}>
                  <Database className="mr-2 h-4 w-4" />
                  {t("navigation.models")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/generatedScripts`}>
                  <FileChartLine className="mr-2 h-4 w-4" />
                  {t("navigation.generatedScripts")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${userId}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("navigation.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">{t("getStarted")}</Link>
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
