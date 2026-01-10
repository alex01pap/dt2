import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { GraduationCap, Send, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import { FadeInView, ScaleInView } from "@/components/ui/scroll-animations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Validation schema
const requestSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  organization: z.string().trim().min(2, "Organization must be at least 2 characters").max(200, "Organization must be less than 200 characters"),
  role: z.string().trim().min(2, "Role must be at least 2 characters").max(100, "Role must be less than 100 characters"),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

export default function RequestAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RequestForm, string>>>({});
  const [form, setForm] = useState<RequestForm>({
    fullName: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  });

  const handleChange = (field: keyof RequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = requestSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RequestForm, string>> = {};
      const issues = result.error.issues || [];
      issues.forEach((issue) => {
        const field = issue.path[0] as keyof RequestForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("access_requests" as any).insert({
        full_name: result.data.fullName,
        email: result.data.email,
        organization: result.data.organization,
        role: result.data.role,
        message: result.data.message || null,
        status: "pending",
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting request:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0]">
          <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-[#202124] leading-tight block">Digital Twin</span>
                <span className="text-xs text-[#5f6368]">in Education</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/case-study" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
                Case Study
              </Link>
              <Link to="/architecture" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
                Architecture
              </Link>
            </nav>
          </div>
        </header>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <FadeInView className="max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-[#34a853]/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-[#34a853]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
              Thanks for your interest!
            </h1>
            <p className="text-lg text-[#5f6368] mb-8">
              We've received your access request and will review it shortly. 
              You'll hear from us within 1-2 business days.
            </p>
            <Link to="/">
              <Button variant="outline" className="rounded-full px-6">
                Back to Home
              </Button>
            </Link>
          </FadeInView>
        </div>

        <AcademicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0]">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#202124] leading-tight block">Digital Twin</span>
              <span className="text-xs text-[#5f6368]">in Education</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/case-study" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
              Case Study
            </Link>
            <Link to="/architecture" className="text-sm font-medium text-[#5f6368] hover:text-[#202124] transition-colors">
              Architecture
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container max-w-screen-xl px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <FadeInView className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-[#1a73e8]/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-[#1a73e8]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
              Request Platform Access
            </h1>
            <p className="text-lg text-[#5f6368] max-w-lg mx-auto">
              The Digital Twin platform is currently in private beta. 
              Submit your request below to join the early access program.
            </p>
          </FadeInView>

          {/* Form */}
          <ScaleInView delay={0.1}>
            <form onSubmit={handleSubmit} className="bg-[#f8f9fa] rounded-2xl p-8 md:p-10 border border-[#dadce0]">
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#202124]">Full name *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Smith"
                    className={`h-12 bg-white border-[#dadce0] ${errors.fullName ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#202124]">Work email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@school.edu"
                    className={`h-12 bg-white border-[#dadce0] ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-[#202124]">Organization *</Label>
                  <Input
                    id="organization"
                    value={form.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    placeholder="Platon Schools"
                    className={`h-12 bg-white border-[#dadce0] ${errors.organization ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">{errors.organization}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#202124]">Your role *</Label>
                  <Input
                    id="role"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    placeholder="Facilities Manager"
                    className={`h-12 bg-white border-[#dadce0] ${errors.role ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#202124]">Why are you interested? (optional)</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell us about your facility and what you're hoping to achieve..."
                    rows={4}
                    className={`bg-white border-[#dadce0] ${errors.message ? "border-red-500" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#5f6368]">
                  We'll review your request and get back to you within 1-2 business days.
                </p>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full px-8 bg-[#1a73e8] hover:bg-[#1557b0] gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </ScaleInView>
        </div>
      </div>

      <AcademicFooter />
    </div>
  );
}