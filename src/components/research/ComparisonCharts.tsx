import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Target,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const comparisonData = [
  {
    metric: "Monitoring Frequency",
    traditional: 1,
    digitalTwin: 100,
    unit: "readings/hour",
    improvement: "100x faster",
    improvementType: "increase",
  },
  {
    metric: "Issue Detection",
    traditional: 48,
    digitalTwin: 0.08,
    unit: "hours",
    improvement: "576x faster",
    improvementType: "decrease",
  },
  {
    metric: "Data Accuracy",
    traditional: 75,
    digitalTwin: 98.5,
    unit: "%",
    improvement: "+31%",
    improvementType: "increase",
  },
  {
    metric: "Energy Cost",
    traditional: 15000,
    digitalTwin: 11700,
    unit: "€/year",
    improvement: "-22%",
    improvementType: "decrease",
  },
  {
    metric: "Maintenance Hours",
    traditional: 120,
    digitalTwin: 90,
    unit: "hrs/year",
    improvement: "-25%",
    improvementType: "decrease",
  },
];

const normalizedChartData = [
  { name: "Monitoring", traditional: 10, digitalTwin: 100 },
  { name: "Detection Speed", traditional: 2, digitalTwin: 100 },
  { name: "Accuracy", traditional: 76, digitalTwin: 100 },
  { name: "Energy Savings", traditional: 100, digitalTwin: 78 },
  { name: "Maintenance", traditional: 100, digitalTwin: 75 },
];

const beforeAfterCards = [
  {
    category: "Monitoring",
    before: { value: "Monthly", sublabel: "Manual readings" },
    after: { value: "Real-time", sublabel: "Continuous streaming" },
    icon: Clock,
    color: "#1a73e8",
  },
  {
    category: "Detection",
    before: { value: "48 hours", sublabel: "Reactive response" },
    after: { value: "< 5 min", sublabel: "Proactive alerts" },
    icon: Zap,
    color: "#ea4335",
  },
  {
    category: "Accuracy",
    before: { value: "70-80%", sublabel: "Human error prone" },
    after: { value: "98.5%", sublabel: "Sensor validated" },
    icon: Target,
    color: "#34a853",
  },
  {
    category: "Maintenance",
    before: { value: "Reactive", sublabel: "Fix when broken" },
    after: { value: "Predictive", sublabel: "Prevent failures" },
    icon: CheckCircle2,
    color: "#fbbc04",
  },
];

export function ComparisonCharts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#ea4335]/10 text-[#ea4335] hover:bg-[#ea4335]/20 border-0">
            Before & After
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Traditional vs. <span className="text-[#1a73e8]">Digital Twin</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comparative analysis showing measurable improvements achieved through digital twin implementation
          </p>
        </motion.div>

        {/* Before/After Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {beforeAfterCards.map((card, idx) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-6 bg-white border border-[#dadce0] hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <card.icon className="h-5 w-5" style={{ color: card.color }} />
                  </div>
                  <span className="font-semibold text-sm">{card.category}</span>
                </div>

                <div className="space-y-4">
                  {/* Before */}
                  <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#dadce0]">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-[#ea4335]" />
                      Before
                    </div>
                    <div className="font-bold text-lg">{card.before.value}</div>
                    <div className="text-xs text-muted-foreground">{card.before.sublabel}</div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-[#1a73e8]" />
                  </div>

                  {/* After */}
                  <div 
                    className="p-3 rounded-lg border-2"
                    style={{ 
                      borderColor: card.color,
                      backgroundColor: `${card.color}08`
                    }}
                  >
                    <div className="text-xs mb-1 flex items-center gap-1" style={{ color: card.color }}>
                      <TrendingUp className="h-3 w-3" />
                      After
                    </div>
                    <div className="font-bold text-lg" style={{ color: card.color }}>
                      {card.after.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{card.after.sublabel}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Grouped Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 bg-white border border-[#dadce0]">
            <h3 className="font-bold text-lg mb-6 text-center">
              Performance Comparison (Normalized Scale)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={normalizedChartData} barGap={8}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#5f6368' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#5f6368' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #dadce0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar 
                    dataKey="traditional" 
                    name="Traditional" 
                    fill="#9aa0a6" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="digitalTwin" 
                    name="Digital Twin" 
                    fill="#1a73e8" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              * Lower is better for Energy Savings and Maintenance (cost reduction)
            </p>
          </Card>
        </motion.div>

        {/* Detailed Metrics Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6 bg-white border border-[#dadce0] overflow-x-auto">
            <h3 className="font-bold text-lg mb-6">Detailed Metrics Comparison</h3>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#dadce0]">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Metric</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-[#9aa0a6]">Traditional</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-[#1a73e8]">Digital Twin</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-[#34a853]">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <motion.tr 
                    key={row.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                    className="border-b border-[#dadce0] last:border-b-0"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-sm">{row.metric}</div>
                      <div className="text-xs text-muted-foreground">{row.unit}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[#9aa0a6] font-semibold">{row.traditional.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[#1a73e8] font-semibold">{row.digitalTwin.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge 
                        className={`${
                          row.improvementType === 'increase' 
                            ? 'bg-[#34a853]/10 text-[#34a853]' 
                            : 'bg-[#1a73e8]/10 text-[#1a73e8]'
                        } border-0`}
                      >
                        {row.improvement}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
