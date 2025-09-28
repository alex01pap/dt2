import { motion } from "framer-motion";
import { useState } from "react";
import { 
  TrendingUp,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Building2,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Users,
  Target,
  Gauge,
  Brain,
  ArrowRight,
  PlayCircle,
  Lightbulb,
  Award,
  Timer,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const benefits = [
  {
    icon: TrendingUp,
    title: "Αύξηση Αποδοτικότητας",
    value: "35%",
    description: "Μείωση χρόνου συντήρησης και βελτίωση απόδοσης εξοπλισμού",
    color: "text-green-600"
  },
  {
    icon: DollarSign,
    title: "Μείωση Κόστους",
    value: "€180K",
    description: "Ετήσια εξοικονόμηση από προληπτική συντήρηση",
    color: "text-blue-600"
  },
  {
    icon: Zap,
    title: "Εξοικονόμηση Ενέργειας",
    value: "28%",
    description: "Βελτιστοποίηση κατανάλωσης μέσω real-time monitoring",
    color: "text-orange-600"
  },
  {
    icon: Timer,
    title: "Μείωση Downtime",
    value: "65%",
    description: "Πρόβλεψη προβλημάτων πριν συμβούν",
    color: "text-purple-600"
  }
];

const processSteps = [
  {
    step: 1,
    title: "Σύνδεση Συστημάτων",
    description: "Συνδέουμε τα υπάρχοντα συστήματά σας (HVAC, αισθητήρες, BMS)",
    icon: Building2,
    duration: "1-2 εβδομάδες"
  },
  {
    step: 2,
    title: "Δημιουργία Digital Twin",
    description: "Δημιουργούμε ψηφιακή αναπαράσταση των εγκαταστάσεών σας",
    icon: Brain,
    duration: "2-3 εβδομάδες"
  },
  {
    step: 3,
    title: "Εκπαίδευση Συστήματος",
    description: "Το AI μαθαίνει τα patterns και τη συμπεριφορά της επιχείρησής σας",
    icon: Target,
    duration: "1 μήνας"
  },
  {
    step: 4,
    title: "Go Live & Optimisation",
    description: "Ξεκινάμε real-time monitoring και continuous optimization",
    icon: Gauge,
    duration: "Ongoing"
  }
];

const caseStudies = [
  {
    company: "Μεγάλη Βιομηχανία Τροφίμων",
    industry: "Food & Beverage",
    challenge: "Υψηλά κόστη ενέργειας και συχνές βλάβες εξοπλισμού",
    solution: "Digital Twin για ψυκτικά συστήματα και παραγωγικές γραμμές",
    results: [
      "32% μείωση κόστους ενέργειας",
      "45% λιγότερες βλάβες",
      "€280K ετήσια εξοικονόμηση"
    ],
    timeframe: "ROI σε 8 μήνες"
  },
  {
    company: "Εταιρεία Logistics",
    industry: "Supply Chain",
    challenge: "Διαχείριση θερμοκρασίας σε αποθήκες φαρμάκων",
    solution: "Real-time monitoring & predictive analytics",
    results: [
      "99.9% compliance με FDA standards",
      "50% μείωση product loss",
      "Automated reporting"
    ],
    timeframe: "ROI σε 6 μήνες"
  }
];

export default function ClientDemo() {
  const [activeTab, setActiveTab] = useState("benefits");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6 space-y-12 bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-6 py-12">
        <Badge className="bg-primary text-white px-6 py-2 text-lg">
          Digital Twin για την Επιχείρησή σας
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Μετατρέψτε τα Δεδομένα σας
          <br />
          σε <span className="underline decoration-primary">Ανταγωνιστικό Πλεονέκτημα</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Η πλατφόρμα Digital Twin μας σας επιτρέπει να βλέπετε, να κατανοείτε και να βελτιστοποιείτε 
          τις εγκαταστάσεις σας σε πραγματικό χρόνο. Πρόβλεψη προβλημάτων, εξοικονόμηση ενέργειας, 
          και αύξηση αποδοτικότητας.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="px-8 py-4">
            <PlayCircle className="h-5 w-5 mr-2" />
            Δείτε Demo
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-4">
            <ArrowRight className="h-5 w-5 mr-2" />
            Ζητήστε Προσφορά
          </Button>
        </div>
      </motion.div>

      {/* Key Benefits Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <benefit.icon className={`h-12 w-12 ${benefit.color} mx-auto mb-4`} />
                <div className="text-3xl font-bold mb-2">{benefit.value}</div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border-0 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="benefits">Οφέλη</TabsTrigger>
              <TabsTrigger value="process">Διαδικασία</TabsTrigger>
              <TabsTrigger value="technology">Τεχνολογία</TabsTrigger>
              <TabsTrigger value="cases">Case Studies</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="p-6">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Τι Κερδίζει η Επιχείρησή σας</h2>
                  <p className="text-muted-foreground text-lg">Μετρήσιμα αποτελέσματα από την πρώτη μέρα</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Financial Benefits */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      Οικονομικά Οφέλη
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <span>Μείωση κόστους ενέργειας</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">25-40%</div>
                          <div className="text-sm text-muted-foreground">€50K-€200K ετησίως</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span>Μείωση κόστους συντήρησης</span>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">30-50%</div>
                          <div className="text-sm text-muted-foreground">Προληπτική συντήρηση</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <span>Αύξηση παραγωγικότητας</span>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">15-25%</div>
                          <div className="text-sm text-muted-foreground">Λιγότερα downtimes</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Benefits */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Gauge className="h-6 w-6 text-blue-600" />
                      Λειτουργικά Οφέλη
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Real-time Visibility</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Πλήρης εποπτεία όλων των συστημάτων από ένα dashboard</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Predictive Maintenance</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Πρόβλεψη βλαβών πριν συμβούν με 95% ακρίβεια</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Automated Alerts</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Άμεση ειδοποίηση για ανωμαλίες και προβλήματα</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="process" className="p-6">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Πώς Υλοποιείται</h2>
                  <p className="text-muted-foreground text-lg">Απλή και γρήγορη διαδικασία εφαρμογής</p>
                </div>

                <div className="relative">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-start gap-6 mb-8 last:mb-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {step.step}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <Card className="p-6 shadow-md">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <step.icon className="h-6 w-6 text-primary" />
                              <h3 className="text-xl font-semibold">{step.title}</h3>
                            </div>
                            <Badge variant="outline">{step.duration}</Badge>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Συνολικός χρόνος υλοποίησης: 6-8 εβδομάδες</h3>
                  <p className="text-muted-foreground">Από την υπογραφή του συμβολαίου μέχρι το full deployment</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="p-6">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Τεχνολογία & Χαρακτηριστικά</h2>
                  <p className="text-muted-foreground text-lg">Enterprise-grade λύση με cutting-edge τεχνολογίες</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 shadow-md">
                    <Brain className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI & Machine Learning</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Αλγόριθμοι που μαθαίνουν τα patterns της επιχείρησής σας και προβλέπουν μελλontικές καταστάσεις.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Predictive Analytics</li>
                      <li>• Anomaly Detection</li>
                      <li>• Optimization Algorithms</li>
                    </ul>
                  </Card>

                  <Card className="p-6 shadow-md">
                    <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">3D Digital Twin</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Πλήρως διαδραστική 3D αναπαράσταση των εγκαταστάσεων με real-time data overlay.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Heat Maps</li>
                      <li>• Flow Visualization</li>
                      <li>• Interactive Controls</li>
                    </ul>
                  </Card>

                  <Card className="p-6 shadow-md">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bank-grade ασφάλεια με πλήρη compliance και role-based access control.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• SOC 2 Certified</li>
                      <li>• End-to-end Encryption</li>
                      <li>• GDPR Compliant</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="p-6">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Επιτυχημένες Υλοποιήσεις</h2>
                  <p className="text-muted-foreground text-lg">Πραγματικά αποτελέσματα από τους πελάτες μας</p>
                </div>

                <div className="space-y-6">
                  {caseStudies.map((study, index) => (
                    <Card key={index} className="p-6 shadow-md">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{study.company}</h3>
                          </div>
                          <Badge variant="outline" className="mb-4">{study.industry}</Badge>
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-red-600 mb-1">Πρόκληση:</h4>
                              <p className="text-sm text-muted-foreground">{study.challenge}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-blue-600 mb-1">Λύση:</h4>
                              <p className="text-sm text-muted-foreground">{study.solution}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-600 mb-3">Αποτελέσματα:</h4>
                          <div className="space-y-2">
                            {study.results.map((result, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm">{result}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                            <div className="font-bold text-primary">{study.timeframe}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Είστε έτοιμοι να ξεκινήσετε;</h2>
            <p className="text-xl mb-8 opacity-90">
              Κλείστε μια συνάντηση για να δείτε πώς μπορούμε να βελτιώσουμε την απόδοση της επιχείρησής σας
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="px-8 py-4">
                <Lightbulb className="h-5 w-5 mr-2" />
                Δωρεάν Consultation
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-white border-white hover:bg-white hover:text-primary">
                <BarChart3 className="h-5 w-5 mr-2" />
                ROI Calculator
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}