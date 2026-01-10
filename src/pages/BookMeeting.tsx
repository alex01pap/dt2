import { useState } from "react";
import { Calendar, Clock, Users, Lightbulb, GraduationCap, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import { FadeInView } from "@/components/ui/scroll-animations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const meetingTopics = [
  {
    value: "demo",
    label: "Platform Demo",
    labelEl: "Demo Πλατφόρμας",
    description: "See the Digital Twin platform in action",
    descriptionEl: "Δείτε την πλατφόρμα Ψηφιακού Διδύμου σε δράση",
    icon: Calendar,
  },
  {
    value: "research",
    label: "Research Discussion",
    labelEl: "Συζήτηση Έρευνας",
    description: "Discuss thesis findings and methodology",
    descriptionEl: "Συζήτηση ευρημάτων και μεθοδολογίας",
    icon: Lightbulb,
  },
  {
    value: "collaboration",
    label: "Collaboration",
    labelEl: "Συνεργασία",
    description: "Explore partnership opportunities",
    descriptionEl: "Εξερευνήστε ευκαιρίες συνεργασίας",
    icon: Users,
  },
];

export default function BookMeeting() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "demo",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send data to a backend or email service
    console.log("Meeting request:", formData);
    
    setIsSubmitted(true);
    toast.success(
      language === "el" 
        ? "Το αίτημά σας υποβλήθηκε! Θα επικοινωνήσουμε σύντομα." 
        : "Your request has been submitted! We'll be in touch soon."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-screen-lg px-6 py-16">
        {/* Hero Section */}
        <FadeInView>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              {language === "el" ? "Κλείστε Ραντεβού" : "Schedule a Meeting"}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
              {language === "el" ? "Ας Συζητήσουμε" : "Let's Connect"}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "el"
                ? "Ενδιαφέρεστε για την τεχνολογία Ψηφιακού Διδύμου στην εκπαίδευση; Κλείστε μια συνάντηση για να συζητήσουμε ιδέες, ερευνητικά ευρήματα ή πιθανές συνεργασίες."
                : "Interested in Digital Twin technology for education? Schedule a meeting to discuss ideas, research findings, or potential collaborations."}
            </p>
          </div>
        </FadeInView>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Calendar Embed Placeholder */}
          <FadeInView delay={0.1}>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                {language === "el" ? "Επιλέξτε Ημερομηνία & Ώρα" : "Select a Date & Time"}
              </h2>
              
              {/* Calendar Embed Placeholder */}
              <Card className="border-2 border-dashed border-border bg-muted/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {language === "el" ? "Ημερολόγιο Κρατήσεων" : "Booking Calendar"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "el"
                      ? "Ενσωμάτωση Google Calendar ή Calendly θα εμφανιστεί εδώ"
                      : "Google Calendar or Calendly embed will appear here"}
                  </p>
                  
                  {/* Placeholder visual */}
                  <div className="bg-background rounded-lg border border-border p-4 mt-4">
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                        <div key={day} className="text-xs text-muted-foreground font-medium p-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }, (_, i) => (
                        <div
                          key={i}
                          className={`text-xs p-2 rounded ${
                            i === 10 || i === 12 || i === 17
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted cursor-pointer"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        {language === "el" ? "Διαθέσιμες Ώρες" : "Available Times"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                          <span
                            key={time}
                            className="px-3 py-1 text-xs rounded-full bg-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    {language === "el"
                      ? "Ζώνη ώρας: Ελλάδα (EET/EEST)"
                      : "Timezone: Greece (EET/EEST)"}
                  </p>
                </CardContent>
              </Card>

              {/* Meeting Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{language === "el" ? "30 λεπτά" : "30 minutes"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{language === "el" ? "Διαδικτυακή Συνάντηση" : "Online Meeting"}</span>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Right: Contact Form */}
          <FadeInView delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                {language === "el" ? "Στοιχεία Επικοινωνίας" : "Your Details"}
              </h2>

              {isSubmitted ? (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {language === "el" ? "Ευχαριστούμε!" : "Thank You!"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "el"
                        ? "Λάβαμε το αίτημά σας. Θα επικοινωνήσουμε σύντομα για να επιβεβαιώσουμε τη συνάντηση."
                        : "We've received your request. We'll be in touch shortly to confirm your meeting."}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", topic: "demo", message: "" });
                      }}
                    >
                      {language === "el" ? "Νέο Αίτημα" : "Submit Another"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Topic Selection */}
                  <div className="space-y-3">
                    <Label>{language === "el" ? "Θέμα Συνάντησης" : "Meeting Topic"}</Label>
                    <RadioGroup
                      value={formData.topic}
                      onValueChange={(value) => setFormData({ ...formData, topic: value })}
                      className="grid gap-3"
                    >
                      {meetingTopics.map((topic) => (
                        <label
                          key={topic.value}
                          className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                            formData.topic === topic.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={topic.value} className="mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <topic.icon className="h-4 w-4 text-primary" />
                              {language === "el" ? topic.labelEl : topic.label}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {language === "el" ? topic.descriptionEl : topic.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{language === "el" ? "Όνομα" : "Name"}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "el" ? "Το όνομά σας" : "Your name"}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={language === "el" ? "email@example.com" : "email@example.com"}
                      required
                    />
                  </div>

                  {/* Message (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {language === "el" ? "Μήνυμα (προαιρετικό)" : "Message (optional)"}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        language === "el"
                          ? "Πείτε μας λίγα λόγια για το τι θα θέλατε να συζητήσουμε..."
                          : "Tell us a bit about what you'd like to discuss..."
                      }
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-full gap-2">
                    <Send className="h-4 w-4" />
                    {language === "el" ? "Υποβολή Αιτήματος" : "Submit Request"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {language === "el"
                      ? "Θα λάβετε email επιβεβαίωσης με τις λεπτομέρειες της συνάντησης."
                      : "You'll receive a confirmation email with meeting details."}
                  </p>
                </form>
              )}
            </div>
          </FadeInView>
        </div>
      </main>

      <AcademicFooter />
    </div>
  );
}
