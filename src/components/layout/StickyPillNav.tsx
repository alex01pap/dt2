import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  sectionId: string;
}

interface CTAAction {
  label: string;
  href: string;
}

interface StickyPillNavProps {
  items: NavItem[];
  cta?: CTAAction;
  className?: string;
}

export function StickyPillNav({ items, cta, className }: StickyPillNavProps) {
  const [activeSection, setActiveSection] = useState(items[0]?.sectionId || "");
  const [isSticky, setIsSticky] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach((item) => {
      const section = document.getElementById(item.sectionId);
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              setActiveSection(item.sectionId);
            }
          });
        },
        { threshold: [0.3, 0.5], rootMargin: "-100px 0px -50% 0px" }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  // Detect sticky state AND header visibility based on sentinel position
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isPastPill = !entry.isIntersecting;
          setIsSticky(isPastPill);
          // Hide header when we've scrolled past the pill area
          setHeaderVisible(!isPastPill);
        });
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" } // Account for header height
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Apply header visibility to document
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-header-visible",
      headerVisible ? "true" : "false"
    );
  }, [headerVisible]);

  const handleClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 100;
      const top = section.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Calculate top offset based on header visibility
  const topOffset = headerVisible ? "top-20" : "top-4";

  return (
    <>
      {/* Sentinel element to detect when nav should become sticky */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />
      
      {/* Centered floating pill - NOT full width */}
      <div className={cn("sticky z-40 flex justify-center py-4 transition-all duration-300", topOffset, className)}>
        <AnimatePresence>
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "inline-flex items-center gap-1 rounded-full p-1.5 transition-all duration-300",
              "bg-white/95 backdrop-blur-md border border-border/50",
              isSticky && "shadow-lg shadow-black/5"
            )}
            style={{ width: "fit-content" }}
          >
            {/* Desktop: Full labels + CTA */}
            <div className="hidden sm:flex items-center gap-1">
              {items.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <button
                    key={item.sectionId}
                    onClick={() => handleClick(item.sectionId)}
                    className={cn(
                      "relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-muted rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
              
              {/* CTA Button inside pill */}
              {cta && (
                <>
                  <div className="w-px h-6 bg-border mx-2" />
                  <Link to={cta.href}>
                    <Button 
                      size="sm" 
                      className="rounded-full px-4 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      {cta.label}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Horizontal scrollable tabs + CTA */}
            <div className="flex sm:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-[85vw] px-1">
              {items.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <button
                    key={item.sectionId}
                    onClick={() => handleClick(item.sectionId)}
                    className={cn(
                      "relative px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              {/* Mobile CTA */}
              {cta && (
                <Link to={cta.href} className="flex-shrink-0 ml-1">
                  <Button 
                    size="sm" 
                    className="rounded-full px-3 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {cta.label}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.nav>
        </AnimatePresence>
      </div>
    </>
  );
}
