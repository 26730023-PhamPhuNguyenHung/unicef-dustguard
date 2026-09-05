import React, { useState, useEffect } from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { RoleMatrixSection } from '../components/landing/RoleMatrixSection';
import { CivicTechSection } from '../components/landing/CivicTechSection';
import { PilotSection } from '../components/landing/PilotSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('dg-lang') as 'vi' | 'en') || 'vi';
  });
  const [activeSection, setActiveSection] = useState('hero');

  const toggleLang = () => {
    const nextLang = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    localStorage.setItem('dg-lang', nextLang);
  };

  useEffect(() => {
    document.title =
      lang === 'vi'
        ? 'DustGuard VN — Phát hiện bụi · Giám sát 48h · Theo dõi đến khi xử lý'
        : 'DustGuard VN — Spot Urban Dust · 48h Closed-Loop · Track Until Resolved';
  }, [lang]);

  // ScrollSpy for Active Section Indicator
  useEffect(() => {
    const sectionIds = ['hero', 'problem', 'solution', 'workflow', 'roles', 'tech', 'pilot'];
    const sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.5] }
    );

    sectionEls.forEach((s) => s && spyObserver.observe(s));
    return () => spyObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col antialiased selection:bg-red-100 selection:text-primary">
      {/* Top Navbar */}
      <LandingNav
        lang={lang}
        onToggleLang={toggleLang}
        activeSection={activeSection}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection lang={lang} />
        <ProblemSection lang={lang} />
        <SolutionSection lang={lang} />
        <WorkflowSection lang={lang} />
        <RoleMatrixSection lang={lang} />
        <CivicTechSection lang={lang} />
        <PilotSection lang={lang} />
      </main>

      {/* Footer */}
      <LandingFooter lang={lang} />
    </div>
  );
};
