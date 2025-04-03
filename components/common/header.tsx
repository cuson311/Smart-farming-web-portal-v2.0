import { Droplets } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Droplets className="h-6 w-6 text-primary" />
        <span>Irrigation Portal</span>
      </div>
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
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </div>
    </header>
  );
};
export default Header;
