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
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-fade-up">
              <div className="inline-block rounded-lg bg-irrigation-100 dark:bg-irrigation-900 px-3 py-1 text-sm text-irrigation-800 dark:text-irrigation-300">
                Introducing Irrigation Portal
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Smart Irrigation{" "}
                <span className="gradient-text">Management</span> Made Simple
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Optimize your irrigation systems with intelligent scripts and
                models. Save water, time, and resources with our advanced
                management platform.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-irrigation-700"
                >
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
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
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need to{" "}
              <span className="gradient-text">Optimize</span> Irrigation
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our platform provides powerful tools to manage, monitor, and
              optimize your irrigation systems.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Sprout className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Smart Scripts</h3>
              <p className="mt-2 text-muted-foreground">
                Create and manage intelligent irrigation scripts that adapt to
                changing conditions.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Database className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Advanced Models</h3>
              <p className="mt-2 text-muted-foreground">
                Develop sophisticated irrigation models based on soil, weather,
                and crop data.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <LineChart className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Data Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                Gain insights from comprehensive analytics and reporting on
                water usage and efficiency.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Users className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Team Collaboration</h3>
              <p className="mt-2 text-muted-foreground">
                Work together with your team to manage and optimize irrigation
                systems.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Shield className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Secure Platform</h3>
              <p className="mt-2 text-muted-foreground">
                Your data is protected with enterprise-grade security and
                encryption.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="feature-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-irrigation-100 dark:bg-irrigation-900">
                <Droplets className="h-6 w-6 text-irrigation-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Water Conservation</h3>
              <p className="mt-2 text-muted-foreground">
                Save water and reduce costs with intelligent irrigation
                management.
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
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Trusted by <span className="gradient-text">Professionals</span>{" "}
              Worldwide
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              See what our customers are saying about our irrigation management
              platform.
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
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Farm Manager</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "This platform has revolutionized how we manage irrigation on
                our farm. We've reduced water usage by 30% while improving crop
                yields."
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
                  <h3 className="font-semibold">Jane Smith</h3>
                  <p className="text-sm text-muted-foreground">
                    Agricultural Engineer
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "The ability to create custom irrigation models and scripts has
                been a game-changer for our operations. Highly recommended!"
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
                  <h3 className="font-semibold">Robert Johnson</h3>
                  <p className="text-sm text-muted-foreground">
                    Vineyard Owner
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "We've been using this platform for our vineyard irrigation for
                over a year now. The water savings and improved grape quality
                speak for themselves."
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
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Choose the plan that's right for your irrigation management needs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Basic</h3>
                <p className="text-muted-foreground">
                  For small farms and gardens
                </p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Up to 5 irrigation scripts</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            {/* Pro Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6 ring-2 ring-primary">
              <div className="absolute -top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-muted-foreground">For medium-sized farms</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Unlimited irrigation scripts</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Custom models</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-irrigation-700">
                Get Started
              </Button>
            </div>
            {/* Enterprise Plan */}
            <div className="pricing-card relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-muted-foreground">
                  For large agricultural operations
                </p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-irrigation-500" />
                  <span>24/7 phone support</span>
                </li>
              </ul>
              <Button className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to <span className="gradient-text">Optimize</span> Your
              Irrigation?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of professionals who are saving water and improving
              crop yields with our platform.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-irrigation-700"
              >
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
