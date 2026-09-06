import React, { useState, useEffect } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { Hero } from '../components/landing/Hero';
import { ProblemStory } from '../components/landing/ProblemStory';
import { ProcessJourney } from '../components/landing/ProcessJourney';
import { RoleStories } from '../components/landing/RoleStories';
import { TrustSection } from '../components/landing/TrustSection';
import { PilotCTA } from '../components/landing/PilotCTA';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  const [lang, setLang] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('dg-lang') as 'vi' | 'en') || 'vi';
  });

  const toggleLang = () => {
    const nextLang = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    localStorage.setItem('dg-lang', nextLang);
  };

  useEffect(() => {
    document.title =
      lang === 'vi'
        ? 'DustGuard VN — Phát hiện bụi · Theo dõi đến khi xử lý'
        : 'DustGuard VN — Spot Urban Dust · Track Until Resolved';
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#0F172A] flex flex-col antialiased selection:bg-red-100 selection:text-[#B42318] [scrollbar-gutter:stable]">
      {/* Redesigned Minimal Header */}
      <LandingHeader lang={lang} onToggleLang={toggleLang} />

      {/* Main Editorial Sections */}
      <main className="flex-1">
        <Hero lang={lang} />
        <ProblemStory lang={lang} />
        <ProcessJourney lang={lang} />
        <RoleStories lang={lang} />
        <TrustSection lang={lang} />
        <PilotCTA lang={lang} />
      </main>

      {/* Clean Civic Footer */}
      <LandingFooter lang={lang} />
    </div>
  );
};
