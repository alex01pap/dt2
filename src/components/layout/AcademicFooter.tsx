import { Link } from "react-router-dom";
import { GraduationCap, Linkedin, FileText } from "lucide-react";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { useLanguage } from "@/contexts/LanguageContext";
import authSealLogo from "@/assets/logos/auth-seal.png";
import eceAuthLogo from "@/assets/logos/ece-auth-logo.png";
import platonLogo from "@/assets/logos/platon-schools-logo.png";

export function AcademicFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-screen-xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo and thesis info */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-foreground block text-sm">
                  {language === "el" ? "Ψηφιακό Δίδυμο" : "Digital Twin"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {language === "el" ? "στην Εκπαίδευση" : "in Education"}
                </span>
              </div>
            </Link>

            {/* Author & Supervisor */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-4">
              <span>
                {t("footer.by")}{" "}
                <Link to="/author" className="text-primary hover:underline font-medium">
                  Alexandros Papadopoulos
                </Link>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                {t("footer.supervisedBy")}{" "}
                <a
                  href="https://ece.auth.gr/staff/alkiviadis-chatzopoulos-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Alkiviadis Chatzopoulos
                </a>
              </span>
            </div>

            {/* Department & Division */}
            <p className="text-xs text-muted-foreground mt-2">
              {t("thesis.department")} • {t("thesis.division")}
            </p>
            <p className="text-xs text-muted-foreground">{t("thesis.university")}</p>
          </div>

          {/* Institution logos */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a
              href="https://www.auth.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={authSealLogo} alt="AUTH" className="h-10 w-auto dark:brightness-110" />
            </a>
            <a
              href="https://ece.auth.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={eceAuthLogo} alt="ECE AUTH" className="h-10 w-auto dark:brightness-110" />
            </a>
            <a
              href="https://platon.edu.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={platonLogo} alt="Platon Schools" className="h-10 w-auto dark:brightness-110" />
            </a>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
            <Link
              to="/case-study"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.caseStudy")}
            </Link>
            <Link
              to="/architecture"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.architecture")}
            </Link>
            <Link
              to="/author"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.about")}
            </Link>

            {/* Thesis Download - Placeholder */}
            <button
              disabled
              className="inline-flex items-center gap-1.5 text-muted-foreground cursor-not-allowed opacity-60"
              title={t("footer.comingSoon")}
            >
              <FileText className="w-3.5 h-3.5" />
              {t("footer.downloadThesis")}
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {t("footer.comingSoon")}
              </span>
            </button>
          </div>

          {/* Preferences row */}
          <div className="flex items-center gap-6">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>

          {/* LinkedIn - isolated social link */}
          <a
            href="https://www.linkedin.com/in/alex01pap/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-full hover:bg-[#006399] transition-colors text-sm font-medium"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>

          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border w-full">
            <p>
              {t("footer.diplomaThesis")} • {t("footer.presented")} 2026 • {t("thesis.university")}
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} Alexandros Papadopoulos. {t("footer.allRights")}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
