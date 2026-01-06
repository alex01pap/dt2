import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

// Apple-style easing curve
const appleEasing = "easeOut" as const;

// Animation variants
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

const scaleBlurVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

// Direction type
type Direction = "up" | "down" | "left" | "right";

interface FadeInViewProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export function FadeInView({
  children,
  direction = "up",
  delay = 0,
  duration = 0.4,
  className = "",
  threshold = 0.2,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const variants = {
    up: fadeInUpVariants,
    down: fadeInDownVariants,
    left: fadeInLeftVariants,
    right: fadeInRightVariants,
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: appleEasing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export function ScaleInView({
  children,
  delay = 0,
  duration = 0.4,
  className = "",
  threshold = 0.2,
}: ScaleInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleBlurVariants}
      transition={{ duration, delay, ease: appleEasing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.12,
  threshold = 0.2,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      transition={{ duration: 0.35, ease: appleEasing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function RevealText({ children, className = "", delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const words = children.split(" ");

  return (
    <motion.div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: appleEasing,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      whileInView={{ y: -20 * speed }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: appleEasing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
