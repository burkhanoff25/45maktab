'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

interface AnnouncementItem {
  id: number;
  title_uz: string;
  title_ru: string;
  content_uz: string;
  content_ru: string;
  event_date: string;
  is_urgent: number;
}

const initialAnnouncements: AnnouncementItem[] = [
  {
    id: 1,
    title_uz: 'Ota-onalar umumiy majlisi o‘tkaziladi',
    title_ru: 'Состоится общее родительское собрание',
    content_uz:
      'Joriy haftaning shanba kuni soat 10:00 da maktab faollar zalida ota-onalar bilan ochiq muloqot va chorak yakunlari muhokamasi bo‘lib o‘tadi.',
    content_ru:
      'В субботу текущей недели в 10:00 в актовом зале школы состоится открытый диалог с родителями и обсуждение итогов четверти.',
    event_date: '2026-11-21',
    is_urgent: 1,
  },
  {
    id: 2,
    title_uz: 'Fan to‘garaklariga yangi qabul',
    title_ru: 'Новый набор в предметные и творческие кружки',
    content_uz:
      'Matematika, rus tili, xorijiy tillar va robototexnika to‘garaklariga qo‘shimcha qabul boshlandi. Qatnashish istagida bo‘lgan o‘quvchilar sinf rahbarlariga murojaat qilishlari mumkin.',
    content_ru:
      'Открыт дополнительный набор в кружки математики, русского языка, иностранных языков и робототехники. Желающие могут обратиться к классным руководителям.',
    event_date: '2026-11-25',
    is_urgent: 0,
  },
];

export const Announcements: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section className="section-announcements" id="announcements">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-tag">{t.announcementsTag}</span>
            <h2 className="section-title">{t.announcementsTitle}</h2>
          </div>
        </div>
        <div className="announcements-container">
          {initialAnnouncements.map((item) => (
            <div
              key={item.id}
              className={`announcement-item ${item.is_urgent ? 'urgent' : ''}`}
            >
              <div className="ann-content">
                {item.is_urgent ? (
                  <span className="ann-badge">⚠️ {t.urgentTag}</span>
                ) : null}
                <h4>{lang === 'uz' ? item.title_uz : item.title_ru}</h4>
                <p>{lang === 'uz' ? item.content_uz : item.content_ru}</p>
              </div>
              {item.event_date && (
                <div className="ann-date">📅 {item.event_date}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
