import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-2 py-1 rounded-md transition-colors font-medium",
          language === "en"
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <span className="text-muted-foreground/50">|</span>
      <button
        onClick={() => setLanguage("el")}
        className={cn(
          "px-2 py-1 rounded-md transition-colors font-medium",
          language === "el"
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        GR
      </button>
    </div>
  );
}
