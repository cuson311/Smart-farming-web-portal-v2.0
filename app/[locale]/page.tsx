"use client";
import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowRight, Database, Shield, Sprout, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import HeroImage from "@/public/herosection.svg";
import FeaturesImage from "@/public/featuressection.svg";
import AvatarImage1 from "@/public/avatar1.png";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("home");
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Refs for sections
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  // Check if sections are in view
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isTestimonialsInView = useInView(testimonialsRef, {
    once: true,
    margin: "-100px",
  });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Floating Elements */}
      <div className="fixed top-1/4 left-1/4 w-24 h-24 bg-irrigation-100/30 dark:bg-irrigation-900/30 rounded-full blur-xl" />
      <div className="fixed top-1/3 right-1/4 w-32 h-32 bg-irrigation-200/30 dark:bg-irrigation-800/30 rounded-full blur-xl" />
      <div className="fixed bottom-1/4 left-1/3 w-28 h-28 bg-irrigation-300/30 dark:bg-irrigation-700/30 rounded-full blur-xl" />
      <div className="fixed top-2/3 right-1/3 w-20 h-20 bg-irrigation-400/30 dark:bg-irrigation-600/30 rounded-full blur-xl" />

      {/* Hero Section */}
      <section className="relative min-h-[400px]">
        {/* content */}
        <motion.div className="container px-4 md:px-6 pt-28 flex items-center justify-center text-center">
          <div className="grid gap-6  items-center max-w-5xl mx-auto">
            <div className="flex flex-col justify-center space-y-4  p-6 rounded-lg">
              <h1 className="text-6xl font-bold tracking-tighter sm:text-5xl md:text-6xl ">
                {t("hero.title")}
                <div></div>
                <span className="gradient-text">{t("hero.subtitle")}</span>
              </h1>
              <p className=" md:text-xl italic">{t("hero.description")}</p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
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
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Link href="#features">{t("hero.learnMore")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="w-full overflow-hidden flex justify-center items-center">
          <Image src={HeroImage} alt="Hero Image" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50" ref={featuresRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
              {t("features.title")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("features.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("features.description")}
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-1 lg:grid-cols-3"
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Left Column */}
            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-6 z-10">
              {/* Feature 1 */}
              <motion.div
                variants={fadeInUp}
                className="feature-card relative overflow-hidden rounded-lg border bg-background p-6 text-center flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto">
                  <Sprout className="h-6 w-6 text-irrigation-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {t("features.smartScripts.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("features.smartScripts.description")}
                </p>
              </motion.div>
              {/* Feature 2 */}
              <motion.div
                variants={fadeInUp}
                className="feature-card relative overflow-hidden rounded-lg border bg-background p-6 text-center flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto">
                  <Database className="h-6 w-6 text-irrigation-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {t("features.advancedModels.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("features.advancedModels.description")}
                </p>
              </motion.div>
            </div>

            {/* Middle Column */}
            <motion.div
              variants={fadeInUp}
              className="relative p-6 flex justify-center items-center"
            >
              <div className="lg:absolute w-[600px] z-0">
                <Image
                  className="w-full"
                  src={FeaturesImage}
                  alt="Features Image"
                />
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-6 z-10">
              {/* Feature 4 */}
              <motion.div
                variants={fadeInUp}
                className="feature-card relative overflow-hidden rounded-lg border bg-background p-6 text-center flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto">
                  <Users className="h-6 w-6 text-irrigation-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {t("features.waterConservation.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("features.waterConservation.description")}
                </p>
              </motion.div>
              {/* Feature 5 */}
              <motion.div
                variants={fadeInUp}
                className="feature-card relative overflow-hidden rounded-lg border bg-background p-6 text-center flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto">
                  <Shield className="h-6 w-6 text-irrigation-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {t("features.securePlatform.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("features.securePlatform.description")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" ref={testimonialsRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
              {t("testimonials.title")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("testimonials.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("testimonials.description")}
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 lg:grid-cols-3"
            initial="hidden"
            animate={isTestimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Testimonial 1 */}
            <motion.div
              variants={fadeInUp}
              className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <Image src={AvatarImage1} alt="Avatar2" />
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
            </motion.div>
            {/* Testimonial 2 */}
            <motion.div
              variants={fadeInUp}
              className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <Image src={AvatarImage1} alt="Avatar1" />
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
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              variants={fadeInUp}
              className="testimonial-card relative overflow-hidden rounded-lg border bg-background p-6"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <Image src={AvatarImage1} alt="Avatar3" />
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" ref={ctaRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            animate={isCtaInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("cta.heading")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("cta.description")}
            </p>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              variants={fadeInUp}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
