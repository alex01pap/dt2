import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "el";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    "nav.caseStudy": "Case Study",
    "nav.architecture": "Architecture",
    "nav.dashboard": "View Live Dashboard",
    "nav.about": "About the Author",
    "nav.bookMeeting": "Book a Meeting",
    "nav.requestAccess": "Request Access",
    
    // Thesis Credits Section
    "thesis.sectionLabel": "Diploma Thesis",
    "thesis.title": "About This",
    "thesis.titleHighlight": "Research",
    "thesis.subtitle": "A diploma thesis project exploring Digital Twin Technology in Educational Environments",
    "thesis.author": "Author",
    "thesis.supervisor": "Supervisor",
    "thesis.thesisTitle": "Digital Twin in Education",
    "thesis.department": "Department of Electrical & Computer Engineering",
    "thesis.division": "Electronics & Computers Division",
    "thesis.university": "Aristotle University of Thessaloniki",
    "thesis.year": "2024",
    "thesis.caseStudy": "Case Study",
    "thesis.caseStudyLocation": "Platon Schools, Katerini",
    "thesis.connectLinkedIn": "Connect on LinkedIn",
    "thesis.universityProfile": "University Profile",
    "thesis.associateProfessor": "Associate Professor",
    
    // Institution Cards
    "institution.academic": "Academic Institution",
    "institution.department": "Department",
    "institution.caseStudyPartner": "Case Study Partner",
    "institution.visit": "Visit",
    
    // Footer
    "footer.diplomaThesis": "Diploma Thesis",
    "footer.by": "by",
    "footer.supervisedBy": "Supervised by",
    "footer.presented": "Presented",
    "footer.downloadThesis": "Download Thesis",
    "footer.comingSoon": "Coming Soon",
    "footer.allRights": "All rights reserved",
    
    // About Page
    "about.title": "About the Author",
    "about.subtitle": "Electrical & Computer Engineering Student",
    "about.education": "Education",
    "about.skills": "Skills & Expertise",
    "about.thesis": "Thesis Project",
    "about.contact": "Contact",
  },
  el: {
    // Header
    "nav.caseStudy": "Μελέτη Περίπτωσης",
    "nav.architecture": "Αρχιτεκτονική",
    "nav.dashboard": "Ζωντανό Dashboard",
    "nav.about": "Σχετικά με τον Συγγραφέα",
    "nav.bookMeeting": "Κλείστε Ραντεβού",
    "nav.requestAccess": "Αίτηση Πρόσβασης",
    
    // Thesis Credits Section
    "thesis.sectionLabel": "Διπλωματική Εργασία",
    "thesis.title": "Σχετικά με την",
    "thesis.titleHighlight": "Έρευνα",
    "thesis.subtitle": "Διπλωματική εργασία που διερευνά την Τεχνολογία Ψηφιακού Διδύμου σε Εκπαιδευτικά Περιβάλλοντα",
    "thesis.author": "Συγγραφέας",
    "thesis.supervisor": "Επιβλέπων",
    "thesis.thesisTitle": "Ψηφιακό Δίδυμο στην Εκπαίδευση",
    "thesis.department": "Τμήμα Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών",
    "thesis.division": "Τομέας Ηλεκτρονικής & Υπολογιστών",
    "thesis.university": "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης",
    "thesis.year": "2024",
    "thesis.caseStudy": "Μελέτη Περίπτωσης",
    "thesis.caseStudyLocation": "Εκπαιδευτήρια Πλάτων, Κατερίνη",
    "thesis.connectLinkedIn": "Σύνδεση στο LinkedIn",
    "thesis.universityProfile": "Προφίλ Πανεπιστημίου",
    "thesis.associateProfessor": "Αναπληρωτής Καθηγητής",
    
    // Institution Cards
    "institution.academic": "Ακαδημαϊκό Ίδρυμα",
    "institution.department": "Τμήμα",
    "institution.caseStudyPartner": "Συνεργάτης Μελέτης",
    "institution.visit": "Επίσκεψη",
    
    // Footer
    "footer.diplomaThesis": "Διπλωματική Εργασία",
    "footer.by": "από",
    "footer.supervisedBy": "Επιβλέπων",
    "footer.presented": "Παρουσίαση",
    "footer.downloadThesis": "Λήψη Διπλωματικής",
    "footer.comingSoon": "Σύντομα",
    "footer.allRights": "Με επιφύλαξη παντός δικαιώματος",
    
    // About Page
    "about.title": "Σχετικά με τον Συγγραφέα",
    "about.subtitle": "Φοιτητής Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών",
    "about.education": "Εκπαίδευση",
    "about.skills": "Δεξιότητες & Εξειδίκευση",
    "about.thesis": "Διπλωματική Εργασία",
    "about.contact": "Επικοινωνία",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("app-language");
    return (stored === "el" || stored === "en") ? stored : "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
