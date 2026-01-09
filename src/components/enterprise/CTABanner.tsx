import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeInView } from "@/components/ui/scroll-animations";

interface CTABannerProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
}

export function CTABanner({ title, description, primaryAction }: CTABannerProps) {
  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <FadeInView>
          <div className="bg-[#e8f0fe] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative shapes - Google style */}
            <div className="absolute bottom-8 left-12 flex items-end gap-1">
              {/* Blue pill shapes */}
              <div className="w-3 h-16 bg-[#4285f4] rounded-full transform -rotate-12" />
              <div className="w-3 h-12 bg-[#1a73e8] rounded-full transform -rotate-6" />
              <div className="w-3 h-8 bg-[#4285f4] rounded-full" />
            </div>
            
            {/* Dotted line with colored dots */}
            <div className="absolute bottom-12 left-32 right-1/2 hidden md:block">
              <svg className="w-full h-8" viewBox="0 0 200 32" fill="none" preserveAspectRatio="none">
                <path 
                  d="M0 24 Q50 24 100 16 T200 8" 
                  stroke="#9aa0a6" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                  fill="none"
                />
                <circle cx="100" cy="16" r="6" fill="#fbbc04" />
                <circle cx="150" cy="12" r="6" fill="#34a853" />
              </svg>
            </div>

            {/* Content grid */}
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Title */}
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                  {title}
                </h3>
              </div>

              {/* Right: Description + CTA */}
              <div className="space-y-6">
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {description}
                </p>
                <Link to={primaryAction.href}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white border-border hover:bg-muted/50 text-primary font-medium rounded-full px-6 shadow-sm"
                  >
                    {primaryAction.label}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
