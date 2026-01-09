import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  sectionId: string;
}

interface StickyPillNavProps {
  items: NavItem[];
  className?: string;
}

export function StickyPillNav({ items, className }: StickyPillNavProps) {
  const [activeSection, setActiveSection] = useState(items[0]?.sectionId || "");
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
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

  // Detect sticky state
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSticky(!entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Account for sticky nav height
      const top = section.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Sentinel element to detect when nav should become sticky */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />
      
      <div
        ref={navRef}
        className={cn(
          "sticky top-16 z-40 flex justify-center py-3 transition-all duration-300",
          isSticky && "bg-white/80 backdrop-blur-lg border-b border-[#dadce0]/50 shadow-sm",
          className
        )}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isSticky ? 0.95 : 1,
            y: isSticky ? 0 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "inline-flex items-center gap-1 rounded-full p-1.5 border transition-all duration-300",
            isSticky
              ? "bg-white/90 border-[#dadce0] shadow-md"
              : "bg-[#f8f9fa] border-[#dadce0]"
          )}
        >
          {/* Desktop: Full labels */}
          <div className="hidden sm:flex items-center gap-1">
            {items.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <button
                  key={item.sectionId}
                  onClick={() => handleClick(item.sectionId)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    isActive
                      ? "text-[#202124]"
                      : "text-[#5f6368] hover:text-[#202124]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white shadow-sm rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile: Horizontal scrollable tabs */}
          <div className="flex sm:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-[80vw] px-1">
            {items.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <button
                  key={item.sectionId}
                  onClick={() => handleClick(item.sectionId)}
                  className={cn(
                    "relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    isActive
                      ? "bg-white text-[#202124] shadow-sm"
                      : "text-[#5f6368] hover:text-[#202124]"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
