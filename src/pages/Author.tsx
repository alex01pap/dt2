import { Link } from "react-router-dom";
import {
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Code,
  Database,
  Cpu,
  Globe,
  BookOpen,
  Award,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import { useLanguage } from "@/contexts/LanguageContext";
import { AcademicFooter } from "@/components/layout/AcademicFooter";
import authSealLogo from "@/assets/logos/auth-seal.png";
import eceAuthLogo from "@/assets/logos/ece-auth-logo.png";
import profilePhoto from "@_R4_3335.jpg";

const skills = [
  { name: "IoT & Embedded Systems", icon: Cpu },
  { name: "Web Development", icon: Code },
  { name: "Database Design", icon: Database },
  { name: "Digital Twin Technology", icon: Globe },
];

export default function Author() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-[#dadce0] dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-screen-xl px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5f6368] dark:text-gray-400 hover:text-[#202124] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{language === "el" ? "Πίσω" : "Back"}</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a73e8] to-[#4285f4] flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[#202124] dark:text-white text-sm">
              {language === "el" ? "Ψηφιακό Δίδυμο" : "Digital Twin"}
            </span>
          </Link>
        </div>
      </header>

      <main className="container max-w-screen-lg px-6 py-16">
        {/* Hero Section */}
        <FadeInView>
        <img 
          src={_R4_3335.jpg} 
          alt="Alexandros Papadopoulos"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-6 shadow-xl ring-4 ring-[#1a73e8]/20"
        />

            <h1 className="text-4xl md:text-5xl font-semibold text-[#202124] dark:text-white mb-3">
              Alexandros Papadopoulos
            </h1>

            <p className="text-xl text-[#5f6368] dark:text-gray-400 mb-4">
              {language === "el"
                ? "Φοιτητής Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών"
                : "Electrical & Computer Engineering Student"}
            </p>

            <div className="flex items-center justify-center gap-2 text-[#5f6368] dark:text-gray-500 mb-6">
              <MapPin className="w-4 h-4" />
              <span>{language === "el" ? "Θεσσαλονίκη, Ελλάδα" : "Thessaloniki, Greece"}</span>
            </div>

            <a
              href="https://www.linkedin.com/in/alex01pap/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0077B5] text-white rounded-full hover:bg-[#006399] transition-colors font-medium"
            >
              <Linkedin className="w-5 h-5" />
              {language === "el" ? "Σύνδεση στο LinkedIn" : "Connect on LinkedIn"}
            </a>
          </div>
        </FadeInView>

        {/* Education Section */}
        <FadeInView delay={0.1}>
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#1a73e8]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] dark:text-white">
                {language === "el" ? "Εκπαίδευση" : "Education"}
              </h2>
            </div>

            <div className="bg-[#f8f9fa] dark:bg-gray-800 rounded-2xl border border-[#dadce0] dark:border-gray-700 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img src={eceAuthLogo} alt="ECE AUTH" className="h-16 w-auto dark:brightness-110" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#202124] dark:text-white mb-1">
                    {language === "el"
                      ? "Τμήμα Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών"
                      : "Department of Electrical & Computer Engineering"}
                  </h3>
                  <p className="text-[#1a73e8] font-medium mb-2">
                    {language === "el" ? "Τομέας Ηλεκτρονικής & Υπολογιστών" : "Electronics & Computers Division"}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={authSealLogo} alt="AUTH" className="h-6 w-auto dark:brightness-110" />
                    <span className="text-[#5f6368] dark:text-gray-400">
                      {language === "el"
                        ? "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης"
                        : "Aristotle University of Thessaloniki"}
                    </span>
                  </div>
                  <p className="text-sm text-[#5f6368] dark:text-gray-500">
                    {language === "el"
                      ? "Διπλωματική Εργασία: «Ψηφιακό Δίδυμο στην Εκπαίδευση»"
                      : 'Diploma Thesis: "Digital Twin in Education"'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeInView>

        {/* Thesis Project Section */}
        <FadeInView delay={0.15}>
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#34a853]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#34a853]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] dark:text-white">
                {language === "el" ? "Διπλωματική Εργασία" : "Thesis Project"}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-[#1a73e8]/5 to-[#4285f4]/5 dark:from-[#1a73e8]/10 dark:to-[#4285f4]/10 rounded-2xl border border-[#1a73e8]/20 p-8">
              <h3 className="text-2xl font-semibold text-[#202124] dark:text-white mb-3">
                {language === "el" ? "Ψηφιακό Δίδυμο στην Εκπαίδευση" : "Digital Twin in Education"}
              </h3>
              <p className="text-[#5f6368] dark:text-gray-400 mb-6 leading-relaxed">
                {language === "el"
                  ? "Ανάπτυξη ολοκληρωμένης πλατφόρμας Ψηφιακού Διδύμου για εκπαιδευτικές εγκαταστάσεις, με ενσωμάτωση αισθητήρων IoT, παρακολούθηση σε πραγματικό χρόνο και τρισδιάστατη απεικόνιση. Η μελέτη περίπτωσης πραγματοποιήθηκε στα Εκπαιδευτήρια Πλάτων στην Κατερίνη."
                  : "Development of a comprehensive Digital Twin platform for educational facilities, integrating IoT sensors, real-time monitoring, and 3D visualization. The case study was conducted at Platon Schools in Katerini, Greece."}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {["React", "TypeScript", "Supabase", "Three.js", "openHAB", "IoT"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm text-[#5f6368] dark:text-gray-400 border border-[#dadce0] dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white rounded-full hover:bg-[#1557b0] transition-colors text-sm font-medium"
                >
                  {language === "el" ? "Δείτε τη Μελέτη Περίπτωσης" : "View Case Study"}
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to="/architecture"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-[#1a73e8] border border-[#1a73e8] rounded-full hover:bg-[#1a73e8]/5 transition-colors text-sm font-medium"
                >
                  {language === "el" ? "Αρχιτεκτονική Συστήματος" : "System Architecture"}
                </Link>
              </div>
            </div>
          </section>
        </FadeInView>

        {/* Skills Section */}
        <FadeInView delay={0.2}>
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#fbbc04]/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-[#fbbc04]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] dark:text-white">
                {language === "el" ? "Δεξιότητες & Εξειδίκευση" : "Skills & Expertise"}
              </h2>
            </div>

            <StaggerContainer className="grid sm:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <StaggerItem key={skill.name}>
                  <div className="bg-[#f8f9fa] dark:bg-gray-800 rounded-xl border border-[#dadce0] dark:border-gray-700 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                      <skill.icon className="w-6 h-6 text-[#1a73e8]" />
                    </div>
                    <span className="font-medium text-[#202124] dark:text-white">{skill.name}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInView>

        {/* Contact Section */}
        <FadeInView delay={0.25}>
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#ea4335]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#ea4335]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#202124] dark:text-white">
                {language === "el" ? "Επικοινωνία" : "Contact"}
              </h2>
            </div>

            <div className="bg-[#f8f9fa] dark:bg-gray-800 rounded-2xl border border-[#dadce0] dark:border-gray-700 p-8 text-center">
              <p className="text-[#5f6368] dark:text-gray-400 mb-6">
                {language === "el"
                  ? "Για επαγγελματική επικοινωνία ή ερωτήσεις σχετικά με την έρευνα, μη διστάσετε να επικοινωνήσετε μέσω LinkedIn."
                  : "For professional inquiries or questions about the research, feel free to reach out via LinkedIn."}
              </p>
              <a
                href="https://www.linkedin.com/in/alex01pap/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0077B5] text-white rounded-full hover:bg-[#006399] transition-colors font-medium"
              >
                <Linkedin className="w-5 h-5" />
                {language === "el" ? "Μήνυμα στο LinkedIn" : "Message on LinkedIn"}
              </a>
            </div>
          </section>
        </FadeInView>
      </main>

      <AcademicFooter />
    </div>
  );
}
