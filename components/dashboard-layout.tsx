"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Database, Home, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/ContextLanguage";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  const routes = [
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
      href: `/dashboard/${userId}/models`,
      label: t("dashboard.navigation.models"),
      icon: Database,
      active: pathname.includes(`/dashboard/${userId}/models`),
    },
    {
      href: "/dashboard/settings",
      label: t("dashboard.navigation.settings"),
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
