'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

interface LeaderItem {
  id: number;
  full_name: string;
  position_uz: string;
  position_ru: string;
  phone: string;
  email: string;
  reception_days_uz: string;
  reception_days_ru: string;
  image_path: string;
}

const leadersData: LeaderItem[] = [
  {
    id: 1,
    full_name: 'Ravshanbek Mamajonov Raxmonjonovich',
    position_uz: 'Maktab direktori',
    position_ru: 'Директор школы',
    phone: '+998 94 509 71 71',
    email: 'marifatlimaktab@umail.uz',
    reception_days_uz: 'Dushanba - Juma: 09:00 - 12:00',
    reception_days_ru: 'Понедельник - Пятница: 09:00 - 12:00',
    image_path: '/assets/director.jpg',
  },
  {
    id: 2,
    full_name: 'Pulatov Jaxongir Odilovich',
    position_uz: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari (O‘IBDO‘)',
    position_ru: 'Заместитель директора по учебной работе (УИБДО)',
    phone: '+998 94 509 71 71',
    email: 'marifatlimaktab@umail.uz',
    reception_days_uz: 'Seshanba, Payshanba: 14:00 - 17:00',
    reception_days_ru: 'Вторник, Четверг: 14:00 - 17:00',
    image_path: '/assets/oibdo.jpg',
  },
  {
    id: 3,
    full_name: 'Nabijonov Diyorbek Umarovich',
    position_uz: 'Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari (MMIBDO‘)',
    position_ru: 'Заместитель директора по духовно-просветительской работе (ММИБДО)',
    phone: '+998 94 509 71 71',
    email: 'marifatlimaktab@umail.uz',
    reception_days_uz: 'Chorshanba, Shanba: 10:00 - 13:00',
    reception_days_ru: 'Среда, Суббота: 10:00 - 13:00',
    image_path: '/assets/mmibdo.png',
  },
];

export const Leadership: React.FC<{
  lang: Lang;
  onOpenLightbox: (src: string, title: string) => void;
}> = ({ lang, onOpenLightbox }) => {
  const t = translations[lang];

  return (
    <section className="section-leaders" id="leaders">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">{t.leadersTag}</span>
          <h2 className="section-title">{t.leadersTitle}</h2>
          <p className="section-subtitle">{t.leadersSubtitle}</p>
        </div>

        <div className="leaders-grid">
          {leadersData.map((leader) => (
            <div key={leader.id} className="leader-card">
              <img
                src={leader.image_path}
                alt={leader.full_name}
                className="leader-avatar"
                style={{ cursor: 'zoom-in' }}
                onClick={() => onOpenLightbox(leader.image_path, leader.full_name)}
              />
              <h3>{leader.full_name}</h3>
              <span className="leader-position">
                {lang === 'uz' ? leader.position_uz : leader.position_ru}
              </span>
              <div className="leader-meta">
                <span>📞 {leader.phone}</span>
                <span>✉️ {leader.email}</span>
                <span>🕒 {lang === 'uz' ? leader.reception_days_uz : leader.reception_days_ru}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
