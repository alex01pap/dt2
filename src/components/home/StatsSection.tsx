import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Database, Gauge, Users } from "lucide-react";

const stats = [
  {
    icon: Activity,
    value: 15000,
    suffix: "+",
    label: "Connected Devices",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Database,
    value: 2.5,
    suffix: "M",
    label: "Data Points/Day",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Gauge,
    value: 99.9,
    suffix: "%",
    label: "System Uptime",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Enterprise Clients",
    color: "from-orange-500 to-red-500"
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Performance
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time metrics powering enterprise digital twin solutions worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative group">
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    {/* Icon with gradient background */}
                    <div className="mb-6">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Counter */}
                    <div className="mb-2 text-gray-900">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>

                    {/* Label */}
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>

                    {/* Animated pulse indicator */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500"
                    />
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Updated in real-time • Last refresh: {new Date().toLocaleTimeString()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
