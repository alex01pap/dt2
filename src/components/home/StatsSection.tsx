import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 15000,
    suffix: "+",
    label: "Connected Devices",
    color: "#00f0ff"
  },
  {
    value: 2.5,
    suffix: "M",
    label: "Data Points/Day",
    color: "#9d4edd"
  },
  {
    value: 99.9,
    suffix: "%",
    label: "System Uptime",
    color: "#06ffa5"
  },
  {
    value: 500,
    suffix: "+",
    label: "Enterprise Clients",
    color: "#ff006e"
  }
];

function Counter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(value * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isInView]);

  const displayValue = value % 1 !== 0 ? count.toFixed(1) : Math.floor(count);

  return (
    <span ref={ref} className="text-5xl font-bold">
      {displayValue}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Digital Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Animated glow orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Stats Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-cyan-500/10 p-1">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Stat Block */}
                <div className="bg-black p-8 relative overflow-hidden">
                  {/* Top glowing line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className="absolute top-0 left-0 right-0 h-[2px] origin-left"
                    style={{ backgroundColor: stat.color }}
                  />

                  {/* Corner accent */}
                  <div 
                    className="absolute top-0 right-0 w-12 h-12 opacity-20"
                    style={{
                      background: `linear-gradient(135deg, transparent 50%, ${stat.color} 50%)`
                    }}
                  />

                  {/* Counter Display */}
                  <div className="relative">
                    <div className="mb-4">
                      <div 
                        className="text-6xl font-bold font-mono tracking-tighter"
                        style={{ color: stat.color }}
                      >
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mt-4">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-xs text-gray-500 font-mono">LIVE</span>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${stat.color}15, transparent 70%)`
                    }}
                  />

                  {/* Scan line effect */}
                  <motion.div
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] opacity-20"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-cyan-500/5 border border-cyan-500/20 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                System Status: Operational
              </span>
            </div>
            <div className="w-px h-4 bg-gray-700" />
            <span className="text-xs text-gray-500 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
