"use client";

import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Database,
  Droplets,
  LineChart,
  Shield,
  Sprout,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-fade-up">
              <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
                {t("hero.title")}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {t("hero.title")}{" "}
                <span className="gradient-text">{t("hero.subtitle")}</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t("hero.description")}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-irrigation-700"
                >
                  <Link href="/dashboard">
                    {t("hero.getStarted")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">{t("hero.learnMore")}</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end animate-fade-up">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=600&width=1000"
                  alt="Dashboard Preview"
                  width={1000}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
              {t("features.title")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("features.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("features.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Sprout className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.smartScripts.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.smartScripts.description")}
              </p>
            </div>
            {/* Feature 2 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Database className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.advancedModels.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.advancedModels.description")}
              </p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <LineChart className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.dataAnalytics.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.dataAnalytics.description")}
              </p>
            </div>
            {/* Feature 4 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Users className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.teamCollaboration.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.teamCollaboration.description")}
              </p>
            </div>
            {/* Feature 5 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Shield className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.securePlatform.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.securePlatform.description")}
              </p>
            </div>
            {/* Feature 6 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Droplets className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                {t("features.waterConservation.title")}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {t("features.waterConservation.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
              {t("testimonials.title")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("testimonials.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("testimonials.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Avatar"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {t("testimonials.testimonial1.name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("testimonials.testimonial1.role")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                {t("testimonials.testimonial1.quote")}
              </p>
            </div>
            {/* Testimonial 2 */}
            <div className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Avatar"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {t("testimonials.testimonial2.name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("testimonials.testimonial2.role")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                {t("testimonials.testimonial2.quote")}
              </p>
            </div>
            {/* Testimonial 3 */}
            <div className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Avatar"
                  />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {t("testimonials.testimonial3.name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("testimonials.testimonial3.role")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                {t("testimonials.testimonial3.quote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
              {t("pricing.title")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("pricing.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("pricing.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">
                  {t("pricing.basic.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("pricing.basic.subtitle")}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {t("pricing.basic.price")}
                </span>
                <span className="text-muted-foreground">
                  {t("pricing.basic.period")}
                </span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.basic.features.scripts")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.basic.features.analytics")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.basic.features.support")}</span>
                </li>
              </ul>
              <Button className="w-full">{t("pricing.basic.button")}</Button>
            </div>
            {/* Pro Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6 ring-2 ring-primary">
              <div className="absolute -top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {t("pricing.pro.popular")}
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">{t("pricing.pro.title")}</h3>
                <p className="text-muted-foreground">
                  {t("pricing.pro.subtitle")}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {t("pricing.pro.price")}
                </span>
                <span className="text-muted-foreground">
                  {t("pricing.pro.period")}
                </span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.pro.features.scripts")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.pro.features.analytics")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.pro.features.models")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.pro.features.support")}</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-irrigation-700">
                {t("pricing.pro.button")}
              </Button>
            </div>
            {/* Enterprise Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">
                  {t("pricing.enterprise.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("pricing.enterprise.subtitle")}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {t("pricing.enterprise.price")}
                </span>
                <span className="text-muted-foreground">
                  {t("pricing.enterprise.period")}
                </span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.enterprise.features.pro")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.enterprise.features.manager")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.enterprise.features.integrations")}</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>{t("pricing.enterprise.features.support")}</span>
                </li>
              </ul>
              <Button className="w-full">
                {t("pricing.enterprise.button")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("cta.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("cta.description")}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-irrigation-700"
              >
                <Link href="/dashboard">
                  {t("cta.getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#contact">{t("cta.contactSales")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
