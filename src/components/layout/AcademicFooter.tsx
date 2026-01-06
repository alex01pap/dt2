import { Link } from "react-router-dom";
import { GraduationCap, Linkedin } from "lucide-react";
import authSealLogo from "@/assets/logos/auth-seal.png";
import eceAuthLogo from "@/assets/logos/ece-auth-logo.png";
import platonLogo from "@/assets/logos/platon-schools-logo.png";

export function AcademicFooter() {
  return (
    <footer className="border-t border-[#dadce0] bg-white">
      <div className="container max-w-screen-xl px-6 py-12">
        {/* Main footer content */}
        <div className="flex flex-col items-center gap-8">
          {/* Logo and thesis info */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-[#202124]">Platon Schools</span>
            </Link>
            <p className="text-sm text-[#5f6368]">
              A diploma thesis by{" "}
              <a 
                href="https://www.linkedin.com/in/alex01pap/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1a73e8] hover:underline"
              >
                Alexandros Papadopoulos
              </a>
            </p>
            <p className="text-xs text-[#5f6368] mt-1">
              Aristotle University of Thessaloniki • Electrical & Computer Engineering
            </p>
          </div>

          {/* Institution logos */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a 
              href="https://www.auth.gr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={authSealLogo} alt="AUTH" className="h-10 w-auto" />
            </a>
            <a 
              href="https://ece.auth.gr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={eceAuthLogo} alt="ECE AUTH" className="h-10 w-auto" />
            </a>
            <a 
              href="https://platon.edu.gr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={platonLogo} alt="Platon Schools" className="h-10 w-auto" />
            </a>
          </div>

          {/* Navigation and copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm">
            <div className="flex gap-6">
              <Link to="/resources" className="text-[#5f6368] hover:text-[#202124] transition-colors">
                Case Study
              </Link>
              <Link to="/architecture" className="text-[#5f6368] hover:text-[#202124] transition-colors">
                Architecture
              </Link>
              <a 
                href="https://www.linkedin.com/in/alex01pap/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#5f6368] hover:text-[#202124] transition-colors inline-flex items-center gap-1"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            </div>
            <p className="text-[#5f6368]">
              © 2024 Diploma Thesis. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
