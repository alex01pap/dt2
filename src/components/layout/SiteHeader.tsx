import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { useLanguage } from "@/contexts/LanguageContext";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-foreground leading-tight block">Digital Twin</span>
            <span className="text-xs text-muted-foreground">in Education</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/case-study"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.caseStudy")}
          </Link>
          <Link
            to="/architecture"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.architecture")}
          </Link>
          {
  /* <Link
            to="/author"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/book-meeting"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.bookMeeting")}
          </Link> */
}
        </nav>

        {/* Right side: Controls + CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
          <Link to="/request-access">
            <Button size="sm" className="rounded-full px-5">
              {t("nav.requestAccess")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
