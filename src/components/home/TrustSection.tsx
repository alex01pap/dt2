import { Shield, Lock, CheckCircle, Server } from "lucide-react";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure by default",
    description: "Enterprise-grade security with end-to-end encryption, role-based access control, and compliance with educational data regulations.",
  },
  {
    icon: Lock,
    title: "Private by design",
    description: "Your data stays yours. We never share or sell facility data, and you maintain complete control over access permissions.",
  },
  {
    icon: Server,
    title: "Reliable infrastructure",
    description: "Built on Supabase with 99.9% uptime SLA. Your digital twin is always available when you need it.",
  },
  {
    icon: CheckCircle,
    title: "Compliance ready",
    description: "GDPR compliant data handling with audit logs, data retention policies, and easy data export.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-muted/30">
      <div className="container max-w-screen-xl px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <FadeInView>
              <p className="text-sm font-medium text-primary mb-3">TRUST & SECURITY</p>
            </FadeInView>
            <ScaleInView delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Enterprise-grade privacy and security
              </h2>
            </ScaleInView>
            <FadeInView delay={0.2}>
              <p className="text-lg text-muted-foreground mb-8">
                Your school's data is protected with the same security standards used by leading 
                technology companies. We take data privacy seriously.
              </p>
            </FadeInView>
          </div>

          {/* Right: Feature Grid */}
          <StaggerContainer className="grid sm:grid-cols-2 gap-6" staggerDelay={0.12}>
            {trustFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="p-6 rounded-2xl bg-background border border-border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
