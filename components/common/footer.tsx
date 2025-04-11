"use client";
import { Droplets } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/ContextLanguage";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="border-t bg-muted/50 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <Droplets className="h-6 w-6 text-primary" />
              <span>{t("footer.brand")}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {t("footer.product.title")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.product.features")}
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.product.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.product.documentation")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {t("footer.company.title")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.company.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.company.careers")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {t("footer.contact.title")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="text-muted-foreground">
                {t("footer.contact.email")}
              </li>
              <li className="text-muted-foreground">
                {t("footer.contact.phone")}
              </li>
              <li className="text-muted-foreground">
                {t("footer.contact.address")}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
