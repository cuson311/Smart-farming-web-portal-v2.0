"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LoginImage from "@/public/login.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the authApi (you'll need to create this file in your project)
import authApi from "@/api/authAPI";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("signup");
  const router = useRouter();

  // Check if user is already authenticated
  const isAuthenticated = () => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") ? true : false;
    }
    return false;
  };

  // Redirect if already authenticated
  if (typeof window !== "undefined" && isAuthenticated()) {
    router.push(`/dashboard`);
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset previous error

    try {
      if (username === "" || password === "" || confirmPassword === "") {
        setError(t("errors.emptyFields"));
        return;
      }

      if (password !== confirmPassword) {
        setError(t("errors.passwordMismatch"));
        return;
      }

      await authApi.register(username, password);
      router.push(`/login`);
    } catch (err) {
      setError(t("errors.signupFailed"));
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Signup Section */}
      <div className="flex-1 grid lg:grid-cols-2">
        {/* Signup Form */}
        <div className="flex items-center justify-center py-12 animate-fade-up">
          <div className="mx-auto w-full max-w-[400px] space-y-6 px-4 md:px-6">
            <div className="space-y-2 text-center">
              <div className="inline-block rounded-lg bg-irrigation-100 px-3 py-1 text-sm text-irrigation-800">
                {t("welcome")}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter">
                {t("title")}
              </h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">{t("form.username")}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("form.usernamePlaceholder")}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("form.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={t("form.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("form.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder={t("form.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-irrigation-700"
              >
                {t("form.submit")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("form.orContinue")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  {t("form.google")}
                </Button>
                <Button variant="outline" className="w-full">
                  {t("form.microsoft")}
                </Button>
              </div> */}
            </form>
            <div className="mt-4 text-center text-sm">
              {t("form.haveAccount")}{" "}
              <Link
                href="/login"
                className="text-irrigation-600 hover:text-irrigation-700"
              >
                {t("form.signIn")}
              </Link>
            </div>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden lg:block bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-irrigation-100/20 z-10"></div>
          <Image
            src={LoginImage}
            alt="Irrigation field"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-background to-transparent z-20"></div>
        </div>
      </div>
    </div>
  );
}
