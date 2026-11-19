'use client';

import React, { useState } from 'react';
import { Lang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeaturesAndStats } from '@/components/FeaturesAndStats';
import { Announcements } from '@/components/Announcements';
import { About } from '@/components/About';
import { Leadership } from '@/components/Leadership';
import { News } from '@/components/News';
import { Gallery } from '@/components/Gallery';
import { Documents } from '@/components/Documents';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { Lightbox } from '@/components/Lightbox';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('uz');
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; src: string; title: string }>({
    isOpen: false,
    src: '',
    title: '',
  });

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'uz' ? 'ru' : 'uz'));
  };

  const handleOpenLightbox = (src: string, title: string) => {
    setLightbox({ isOpen: true, src, title });
  };

  const handleCloseLightbox = () => {
    setLightbox({ isOpen: false, src: '', title: '' });
  };

  return (
    <main>
      <Header lang={lang} onToggleLang={handleToggleLang} />
      <Hero lang={lang} />
      <FeaturesAndStats lang={lang} />
      <Announcements lang={lang} />
      <About lang={lang} onOpenLightbox={handleOpenLightbox} />
      <Leadership lang={lang} onOpenLightbox={handleOpenLightbox} />
      <News lang={lang} onOpenLightbox={handleOpenLightbox} />
      <Gallery lang={lang} onOpenLightbox={handleOpenLightbox} />
      <Documents lang={lang} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />

      <Lightbox
        isOpen={lightbox.isOpen}
        src={lightbox.src}
        title={lightbox.title}
        onClose={handleCloseLightbox}
      />
    </main>
  );
}
