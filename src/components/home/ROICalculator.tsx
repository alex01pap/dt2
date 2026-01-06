import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Zap, Wrench, Building2, Users, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem,
  CountUp 
} from "@/components/ui/scroll-animations";

export function ROICalculator() {
  // School inputs
  const [buildingArea, setBuildingArea] = useState(5000); // m²
  const [classrooms, setClassrooms] = useState(20);
  const [students, setStudents] = useState(500);
  const [annualEnergyBill, setAnnualEnergyBill] = useState(50000); // €
  const [annualMaintenanceCost, setAnnualMaintenanceCost] = useState(15000); // €

  // Calculation constants (based on industry averages)
  const ENERGY_SAVINGS_PERCENT = 0.22; // 22% energy savings
  const MAINTENANCE_SAVINGS_PERCENT = 0.25; // 25% maintenance reduction
  const SENSOR_COST_PER_CLASSROOM = 450; // € per classroom
  const PLATFORM_BASE_COST = 3000; // € one-time
  const INSTALLATION_COST_PER_M2 = 1.5; // € per m²
  const ANNUAL_LICENSE_COST = 1200; // € per year

  const calculations = useMemo(() => {
    // Initial investment
    const sensorCost = classrooms * SENSOR_COST_PER_CLASSROOM;
    const installationCost = buildingArea * INSTALLATION_COST_PER_M2;
    const totalInitialInvestment = sensorCost + PLATFORM_BASE_COST + installationCost;

    // Annual costs
    const annualOperatingCost = ANNUAL_LICENSE_COST;

    // Annual savings
    const energySavings = annualEnergyBill * ENERGY_SAVINGS_PERCENT;
    const maintenanceSavings = annualMaintenanceCost * MAINTENANCE_SAVINGS_PERCENT;
    const totalAnnualSavings = energySavings + maintenanceSavings;

    // Net annual benefit
    const netAnnualBenefit = totalAnnualSavings - annualOperatingCost;

    // ROI calculations
    const paybackMonths = totalInitialInvestment / (netAnnualBenefit / 12);
    const threeYearROI = ((netAnnualBenefit * 3 - totalInitialInvestment) / totalInitialInvestment) * 100;
    const fiveYearSavings = netAnnualBenefit * 5 - totalInitialInvestment;

    return {
      totalInitialInvestment,
      sensorCost,
      installationCost,
      annualOperatingCost,
      energySavings,
      maintenanceSavings,
      totalAnnualSavings,
      netAnnualBenefit,
      paybackMonths: Math.round(paybackMonths),
      threeYearROI: Math.round(threeYearROI),
      fiveYearSavings: Math.round(fiveYearSavings),
    };
  }, [buildingArea, classrooms, annualEnergyBill, annualMaintenanceCost]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="container max-w-screen-xl px-6 py-24">
      <div className="text-center mb-16">
        <FadeInView>
          <p className="text-sm font-medium text-primary mb-3">ROI CALCULATOR</p>
        </FadeInView>
        <ScaleInView delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Calculate your savings
          </h2>
        </ScaleInView>
        <FadeInView delay={0.2}>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your school's details to see how much you could save with a digital twin system.
          </p>
        </FadeInView>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Input Section */}
        <FadeInView direction="left" className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              School Details
            </h3>
            <div className="space-y-6">
              {/* Building Area */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground">Building Area</Label>
                  <span className="text-sm font-semibold text-foreground">{buildingArea.toLocaleString()} m²</span>
                </div>
                <Slider
                  value={[buildingArea]}
                  onValueChange={([value]) => setBuildingArea(value)}
                  min={500}
                  max={20000}
                  step={100}
                  className="py-2"
                />
              </div>

              {/* Classrooms */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground">Number of Classrooms</Label>
                  <span className="text-sm font-semibold text-foreground">{classrooms}</span>
                </div>
                <Slider
                  value={[classrooms]}
                  onValueChange={([value]) => setClassrooms(value)}
                  min={5}
                  max={100}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Students */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Students
                  </Label>
                  <span className="text-sm font-semibold text-foreground">{students.toLocaleString()}</span>
                </div>
                <Slider
                  value={[students]}
                  onValueChange={([value]) => setStudents(value)}
                  min={50}
                  max={2000}
                  step={10}
                  className="py-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Current Annual Costs
            </h3>
            <div className="space-y-6">
              {/* Energy Bill */}
              <div className="space-y-2">
                <Label htmlFor="energy" className="text-muted-foreground">Annual Energy Bill (€)</Label>
                <Input
                  id="energy"
                  type="number"
                  value={annualEnergyBill}
                  onChange={(e) => setAnnualEnergyBill(Number(e.target.value))}
                  className="h-12 text-lg"
                />
              </div>

              {/* Maintenance Cost */}
              <div className="space-y-2">
                <Label htmlFor="maintenance" className="text-muted-foreground">Annual Maintenance Cost (€)</Label>
                <Input
                  id="maintenance"
                  type="number"
                  value={annualMaintenanceCost}
                  onChange={(e) => setAnnualMaintenanceCost(Number(e.target.value))}
                  className="h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </FadeInView>

        {/* Results Section */}
        <FadeInView direction="right" delay={0.15} className="space-y-6">
          {/* Key Metrics */}
          <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-sm text-muted-foreground mb-1">Annual Savings</div>
                <div className="text-3xl font-semibold text-success">
                  {formatCurrency(calculations.totalAnnualSavings)}
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                <div className="text-3xl font-semibold text-primary">
                  <CountUp end={calculations.paybackMonths} duration={1.5} /> <span className="text-lg font-normal">mo</span>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-sm text-muted-foreground mb-1">3-Year ROI</div>
                <div className="text-3xl font-semibold text-foreground">
                  <CountUp end={calculations.threeYearROI} duration={1.5} suffix="%" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-sm text-muted-foreground mb-1">5-Year Net Savings</div>
                <div className="text-3xl font-semibold text-success">
                  {formatCurrency(calculations.fiveYearSavings)}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Breakdown */}
          <FadeInView delay={0.3}>
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Cost & Savings Breakdown
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Initial Investment</div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Sensor Hardware ({classrooms} classrooms)</span>
                    <span className="font-medium">{formatCurrency(calculations.sensorCost)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Platform & Integration</span>
                    <span className="font-medium">{formatCurrency(PLATFORM_BASE_COST)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Installation ({buildingArea.toLocaleString()} m²)</span>
                    <span className="font-medium">{formatCurrency(calculations.installationCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold border-t border-border mt-2 pt-3">
                    <span>Total Initial Investment</span>
                    <span>{formatCurrency(calculations.totalInitialInvestment)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Annual Impact</div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-success" />
                      Energy Savings (22%)
                    </span>
                    <span className="font-medium text-success">+{formatCurrency(calculations.energySavings)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-success" />
                      Maintenance Savings (25%)
                    </span>
                    <span className="font-medium text-success">+{formatCurrency(calculations.maintenanceSavings)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Annual License Fee</span>
                    <span className="font-medium text-destructive">-{formatCurrency(calculations.annualOperatingCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-success border-t border-border mt-2 pt-3">
                    <span>Net Annual Benefit</span>
                    <span>{formatCurrency(calculations.netAnnualBenefit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>

          <FadeInView delay={0.4}>
            <p className="text-xs text-muted-foreground text-center">
              * Estimates based on industry averages. Actual savings may vary based on facility conditions.
            </p>
          </FadeInView>
        </FadeInView>
      </div>
    </section>
  );
}
