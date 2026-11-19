'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

export const Documents: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section className="section-documents" id="documents">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.documentsTag}</span>
          <h2 className="section-title">{t.documentsTitle}</h2>
          <p className="section-subtitle">{t.documentsSubtitle}</p>
        </div>

        <div className="documents-grid">
          <div className="doc-card">
            <div className="doc-icon">📄</div>
            <div className="doc-details">
              <h4>{lang === 'uz' ? 'Umumiy o‘rta ta’lim maktabi Ustavi' : 'Устав общеобразовательной школы'}</h4>
              <p>
                {lang === 'uz'
                  ? 'Maktab faoliyatining asosiy me’yoriy hujjati'
                  : 'Основной нормативный документ школы'}
              </p>
              <span className="doc-meta">PDF · Rasmiy nusxa</span>
            </div>
            <a href="/assets/logo.png" download="Maktab_Ustavi.png" className="btn-doc-download">
              {t.btnDownload}
            </a>
          </div>

          <div className="doc-card">
            <div className="doc-icon">📋</div>
            <div className="doc-details">
              <h4>
                {lang === 'uz'
                  ? '1-sinfga qabul qilish tartibi va qoidalari'
                  : 'Порядок и правила приёма в 1 класс'}
              </h4>
              <p>
                {lang === 'uz'
                  ? 'Hujjatlar ro‘yxati va ariza topshirish talablari'
                  : 'Перечень документов и требования к заявлению'}
              </p>
              <span className="doc-meta">PDF · 2026-yil</span>
            </div>
            <a href="/assets/logo.png" download="Qabul_Qoidalari.png" className="btn-doc-download">
              {t.btnDownload}
            </a>
          </div>

          <div className="doc-card">
            <div className="doc-icon">⚖️</div>
            <div className="doc-details">
              <h4>
                {lang === 'uz' ? 'Maktab ichki tartib-qoidalari' : 'Правила внутреннего распорядка'}
              </h4>
              <p>
                {lang === 'uz'
                  ? 'O‘quvchilar va xodimlar uchun odob-axloq me’yorlari'
                  : 'Нормы этики для учащихся и сотрудников'}
              </p>
              <span className="doc-meta">PDF · Me’yoriy hujjat</span>
            </div>
            <a href="/assets/logo.png" download="Ichki_Tartib_Qoidalar.png" className="btn-doc-download">
              {t.btnDownload}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
