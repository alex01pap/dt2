import { ExternalLink, Linkedin } from "lucide-react";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import authSealLogo from "@/assets/logos/auth-seal.png";
import eceAuthLogo from "@/assets/logos/ece-auth-logo.png";
import platonLogo from "@/assets/logos/platon-schools-logo.png";

const institutions = [
  {
    name: "Aristotle University of Thessaloniki",
    role: "Academic Institution",
    logo: authSealLogo,
    url: "https://www.auth.gr",
    color: "#00457C",
  },
  {
    name: "Electrical & Computer Engineering",
    role: "Department",
    logo: eceAuthLogo,
    url: "https://ece.auth.gr",
    color: "#00457C",
  },
  {
    name: "Platon Schools",
    role: "Case Study Partner",
    logo: platonLogo,
    url: "https://platon.edu.gr",
    color: "#1E3A5F",
  },
];

export function ThesisCredits() {
  return (
    <section id="about" className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-[#1a73e8] mb-3 uppercase tracking-wide">
              Diploma Thesis
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] mb-4">
              About This <span className="text-[#1a73e8]">Research</span>
            </h2>
            <p className="text-lg text-[#5f6368] max-w-2xl mx-auto">
              A diploma thesis project exploring Digital Twin Technology in Educational Environments
            </p>
          </div>
        </FadeInView>

        {/* Institution Cards */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12">
          {institutions.map((institution) => (
            <StaggerItem key={institution.name}>
              <div className="bg-white rounded-xl border border-[#dadce0] p-6 h-full hover:shadow-lg transition-shadow duration-300 text-center relative overflow-hidden group">
                {/* Colored accent bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: institution.color }}
                />
                
                <div className="h-20 flex items-center justify-center mb-4">
                  <img 
                    src={institution.logo} 
                    alt={institution.name}
                    className="max-h-full max-w-[180px] object-contain"
                  />
                </div>
                
                <p className="text-xs font-medium text-[#1a73e8] uppercase tracking-wide mb-2">
                  {institution.role}
                </p>
                <h3 className="font-semibold text-[#202124] mb-4 text-sm leading-tight">
                  {institution.name}
                </h3>
                
                <a
                  href={institution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#1a73e8] hover:underline"
                >
                  Visit
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Author & Supervisor Section */}
        <FadeInView delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Author Card */}
            <div className="bg-[#f8f9fa] rounded-2xl border border-[#dadce0] p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1a73e8]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#1a73e8]">AP</span>
              </div>
              
              <p className="text-xs font-medium text-[#1a73e8] uppercase tracking-wide mb-2">
                Author
              </p>
              <h3 className="text-xl font-semibold text-[#202124] mb-1">
                Alexandros Papadopoulos
              </h3>
              <p className="text-[#5f6368] italic mb-2">
                "Digital Twin in Education"
              </p>
              <p className="text-sm text-[#5f6368] mb-4">
                Department of Electrical & Computer Engineering<br />
                Aristotle University of Thessaloniki, 2024
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-[#5f6368] mb-4">
                <span>Case Study:</span>
                <a 
                  href="https://platon.edu.gr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1a73e8] hover:underline"
                >
                  Platon Schools, Katerini
                </a>
              </div>
              
              <a
                href="https://www.linkedin.com/in/alex01pap/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077B5] text-white rounded-full hover:bg-[#006399] transition-colors text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
              </a>
            </div>

            {/* Supervisor Card */}
            <div className="bg-[#f8f9fa] rounded-2xl border border-[#dadce0] p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#34a853]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#34a853]">AC</span>
              </div>
              
              <p className="text-xs font-medium text-[#34a853] uppercase tracking-wide mb-2">
                Supervisor
              </p>
              <h3 className="text-xl font-semibold text-[#202124] mb-1">
                Alkiviadis Chatzopoulos
              </h3>
              <p className="text-[#5f6368] mb-2">
                Associate Professor
              </p>
              <p className="text-sm text-[#5f6368] mb-4">
                Department of Electrical & Computer Engineering<br />
                Aristotle University of Thessaloniki
              </p>
              
              <a
                href="https://ece.auth.gr/staff/alkiviadis-chatzopoulos-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00457C] text-white rounded-full hover:bg-[#003366] transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                University Profile
              </a>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
