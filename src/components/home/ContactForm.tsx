import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FadeInView, 
  ScaleInView, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/scroll-animations";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="container max-w-screen-xl px-6 py-24">
        <FadeInView className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Thank you for your interest!
          </h2>
          <p className="text-lg text-muted-foreground">
            Our team will get back to you within 24 hours to discuss how digital twin 
            technology can transform your school.
          </p>
        </FadeInView>
      </section>
    );
  }

  return (
    <section className="container max-w-screen-xl px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FadeInView>
            <p className="text-sm font-medium text-primary mb-3">GET IN TOUCH</p>
          </FadeInView>
          <ScaleInView delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Talk to a Digital Twin specialist
            </h2>
          </ScaleInView>
          <FadeInView delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your school? Fill out the form below and our team will 
              reach out to discuss your specific needs.
            </p>
          </FadeInView>
        </div>

        <FadeInView delay={0.3}>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Smith" 
                  required 
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@school.edu" 
                  required 
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="organization">School / Organization</Label>
                <Input 
                  id="organization" 
                  placeholder="Platon Schools" 
                  required 
                  className="h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your facility and what you're looking to achieve..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to our privacy policy.
              </p>
              <Button type="submit" size="lg" className="rounded-full px-8 gap-2">
                Submit
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </FadeInView>
      </div>
    </section>
  );
}
