import { Zap, Wrench, TrendingUp, Gauge, Download, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";

const keyMetrics = [
  { label: "Energy Savings", value: "15-30%", description: "Annual utility cost reduction", icon: Zap },
  { label: "Maintenance Costs", value: "-25%", description: "Predictive vs reactive", icon: Wrench },
  { label: "ROI Timeline", value: "18-24 mo", description: "Time to break even", icon: TrendingUp },
  { label: "Efficiency Gain", value: "+40%", description: "Operational improvement", icon: Gauge },
];

const initialCosts = [
  { item: "Sensor Hardware", range: "€5,000 - €15,000", note: "Depends on facility size" },
  { item: "Software Platform", range: "€2,000 - €5,000/yr", note: "Includes updates & support" },
  { item: "Integration Services", range: "€3,000 - €10,000", note: "One-time setup" },
  { item: "Training", range: "€1,000 - €2,000", note: "Staff onboarding" },
];

const ongoingCosts = [
  { item: "Cloud Hosting", range: "€50 - €200/mo", note: "Scales with usage" },
  { item: "Maintenance", range: "€500 - €1,500/yr", note: "Sensor calibration" },
  { item: "Support Package", range: "€1,000 - €3,000/yr", note: "Optional premium support" },
];

const projectedSavings = [
  { period: "Year 1", savings: "€8,000 - €15,000", cumulative: "€8,000 - €15,000" },
  { period: "Year 3", savings: "€25,000 - €50,000", cumulative: "€33,000 - €65,000" },
  { period: "Year 5", savings: "€45,000 - €90,000", cumulative: "€78,000 - €155,000" },
];

const timeline = [
  { phase: "Assessment", duration: "2-4 weeks", description: "Site survey, requirements gathering, sensor planning" },
  { phase: "Deployment", duration: "4-8 weeks", description: "Hardware installation, network setup, initial configuration" },
  { phase: "Integration", duration: "2-4 weeks", description: "System integration, data validation, rule configuration" },
  { phase: "Go Live", duration: "1-2 weeks", description: "Staff training, documentation, handover" },
];

export function TechnoEconomicAnalysis() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeInView>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
              Investment Analysis
            </span>
          </FadeInView>
          <ScaleInView delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Business Case for Digital Twins
            </h2>
          </ScaleInView>
          <FadeInView delay={0.2}>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive techno-economic analysis of implementing digital twin technology 
              for smart building infrastructure.
            </p>
          </FadeInView>
        </div>

        {/* Key Metrics Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" staggerDelay={0.1}>
          {keyMetrics.map((metric) => (
            <StaggerItem key={metric.label}>
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
                <metric.icon className="w-8 h-8 text-primary mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Cost Breakdown Tabs */}
        <FadeInView delay={0.1} className="mb-16">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Cost & Savings Breakdown
          </h3>
          <Tabs defaultValue="initial" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="initial">Initial Costs</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="initial" className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                {initialCosts.map((cost) => (
                  <div key={cost.item} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium text-foreground">{cost.item}</div>
                      <div className="text-xs text-muted-foreground">{cost.note}</div>
                    </div>
                    <div className="text-lg font-semibold text-foreground">{cost.range}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 border-t-2 border-primary/20">
                  <div className="font-semibold text-foreground">Total Initial Investment</div>
                  <div className="text-xl font-bold text-primary">€11,000 - €32,000</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ongoing" className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                {ongoingCosts.map((cost) => (
                  <div key={cost.item} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium text-foreground">{cost.item}</div>
                      <div className="text-xs text-muted-foreground">{cost.note}</div>
                    </div>
                    <div className="text-lg font-semibold text-foreground">{cost.range}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 border-t-2 border-primary/20">
                  <div className="font-semibold text-foreground">Total Annual Operating Cost</div>
                  <div className="text-xl font-bold text-primary">€2,100 - €7,300/yr</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="savings" className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-4">
                {projectedSavings.map((saving) => (
                  <div key={saving.period} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium text-foreground">{saving.period}</div>
                      <div className="text-xs text-muted-foreground">Annual savings: {saving.savings}</div>
                    </div>
                    <div className="text-lg font-semibold text-green-500">{saving.cumulative}</div>
                  </div>
                ))}
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-sm text-green-400">5-Year Net Benefit (after costs)</div>
                  <div className="text-2xl font-bold text-green-500">€50,000 - €120,000+</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </FadeInView>

        {/* Implementation Timeline */}
        <FadeInView delay={0.15} className="mb-16">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Implementation Timeline
          </h3>
          <StaggerContainer className="grid md:grid-cols-4 gap-4" staggerDelay={0.12}>
            {timeline.map((phase, index) => (
              <StaggerItem key={phase.phase}>
                <div className="relative">
                  <div className="p-5 rounded-xl bg-card border border-border h-full hover:border-primary/50 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-xs text-muted-foreground">{phase.duration}</span>
                    </div>
                    <div className="font-semibold text-foreground mb-2">{phase.phase}</div>
                    <div className="text-sm text-muted-foreground">{phase.description}</div>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border" />
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeInView delay={0.4}>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Total implementation: 9-18 weeks depending on facility complexity</span>
            </div>
          </FadeInView>
        </FadeInView>

        {/* CTA Section */}
        <StaggerContainer className="flex flex-col sm:flex-row items-center justify-center gap-4" staggerDelay={0.1}>
          <StaggerItem>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Full Analysis (PDF)
            </Button>
          </StaggerItem>
          <StaggerItem>
            <Button size="lg" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Consultation
            </Button>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
