import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Zap, Wrench, Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="container max-w-screen-xl px-8 py-24 border-t">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="gap-2 py-2 px-4 mb-4">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Calculate Your Savings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Enter your school's details to see how much you could save with a digital twin system.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                School Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Building Area */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Building Area</Label>
                  <span className="text-sm font-medium">{buildingArea.toLocaleString()} m²</span>
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
                  <Label>Number of Classrooms</Label>
                  <span className="text-sm font-medium">{classrooms}</span>
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
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Students
                  </Label>
                  <span className="text-sm font-medium">{students.toLocaleString()}</span>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Current Annual Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Energy Bill */}
              <div className="space-y-2">
                <Label htmlFor="energy">Annual Energy Bill (€)</Label>
                <Input
                  id="energy"
                  type="number"
                  value={annualEnergyBill}
                  onChange={(e) => setAnnualEnergyBill(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              {/* Maintenance Cost */}
              <div className="space-y-2">
                <Label htmlFor="maintenance">Annual Maintenance Cost (€)</Label>
                <Input
                  id="maintenance"
                  type="number"
                  value={annualMaintenanceCost}
                  onChange={(e) => setAnnualMaintenanceCost(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Annual Savings</div>
                <div className="text-3xl font-bold text-green-500">
                  {formatCurrency(calculations.totalAnnualSavings)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                <div className="text-3xl font-bold text-cyan-500">
                  {calculations.paybackMonths} <span className="text-lg font-normal">months</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">3-Year ROI</div>
                <div className="text-3xl font-bold text-purple-500">
                  {calculations.threeYearROI}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">5-Year Net Savings</div>
                <div className="text-3xl font-bold text-orange-500">
                  {formatCurrency(calculations.fiveYearSavings)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Cost & Savings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Initial Investment</div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span>Sensor Hardware ({classrooms} classrooms)</span>
                  <span className="font-medium">{formatCurrency(calculations.sensorCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span>Platform & Integration</span>
                  <span className="font-medium">{formatCurrency(PLATFORM_BASE_COST)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span>Installation ({buildingArea.toLocaleString()} m²)</span>
                  <span className="font-medium">{formatCurrency(calculations.installationCost)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total Initial Investment</span>
                  <span>{formatCurrency(calculations.totalInitialInvestment)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="text-sm font-medium text-muted-foreground">Annual Impact</div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    Energy Savings (22%)
                  </span>
                  <span className="font-medium text-green-500">+{formatCurrency(calculations.energySavings)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-green-500" />
                    Maintenance Savings (25%)
                  </span>
                  <span className="font-medium text-green-500">+{formatCurrency(calculations.maintenanceSavings)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span>Annual License Fee</span>
                  <span className="font-medium text-red-400">-{formatCurrency(calculations.annualOperatingCost)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-green-500">
                  <span>Net Annual Benefit</span>
                  <span>{formatCurrency(calculations.netAnnualBenefit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            * Estimates based on industry averages. Actual savings may vary based on facility conditions and usage patterns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
