'use client';

import React, { useState } from 'react';
import { Lang, translations } from '@/lib/i18n';

export const ContactSection: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({
      type: 'loading',
      message: lang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...',
    });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({
          type: 'success',
          message:
            lang === 'uz'
              ? 'Murojaatingiz muvaffaqiyatli qabul qilindi va ma’muriyatga yetkazildi!'
              : 'Ваше обращение успешно принято и отправлено администрации!',
        });
        setFormData({ fullName: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || (lang === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка'),
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: lang === 'uz' ? 'Server bilan aloqa uzildi' : 'Ошибка соединения с сервером',
      });
    }
  };

  return (
    <section className="section-contact" id="contact">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">{t.contactTag}</span>
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="section-subtitle">{t.contactSubtitle}</p>
        </div>

        <div className="contact-grid">
          {/* Information Card */}
          <div className="contact-card info-card">
            <h3>{t.contactInfoHeading}</h3>

            <div className="contact-item">
              <div className="icon-circle">📍</div>
              <div>
                <strong>{t.addressLabel}</strong>
                <p>Namangan viloyati, Yangiqo‘rg‘on tumani, Chortoq ko‘chasi, 36-uy, 161200</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-circle">📞</div>
              <div>
                <strong>{t.phoneLabel}</strong>
                <p>
                  <a href="tel:+998945097171">+998 94 509 71 71</a> (Direktor)
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-circle">✉️</div>
              <div>
                <strong>{t.emailLabel}</strong>
                <p>
                  <a href="mailto:marifatlimaktab@umail.uz">marifatlimaktab@umail.uz</a>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-circle">💬</div>
              <div>
                <strong>{t.telegramLabel}</strong>
                <p>
                  <a href="https://t.me/+KQm8vZ8efHo1NWEy" target="_blank" rel="noopener noreferrer">
                    t.me/maktab45
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-circle">⏰</div>
              <div>
                <strong>{t.workingHoursLabel}</strong>
                <p>{t.workingHoursVal}</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="contact-card form-card">
            <h3>{t.formHeading}</h3>
            <p className="form-desc">{t.formDesc}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">{t.nameLabel}</label>
                <input
                  type="text"
                  id="fullName"
                  required
                  placeholder={lang === 'uz' ? 'Masalan: Abdullayev Anvar' : 'Например: Абдуллаев Анвар'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t.emailLabel} (ixtiyoriy)</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="nomingiz@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">{t.subjectLabel}</label>
                <input
                  type="text"
                  id="subject"
                  placeholder={lang === 'uz' ? 'Masalan: To‘garakka yozilish' : 'Например: Запись в кружок'}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{t.messageLabel}</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder={lang === 'uz' ? 'Murojaatingizni batafsil yozing...' : 'Подробно опишите обращение...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={status.type === 'loading'}
              >
                <span>{t.btnSubmit}</span>
              </button>

              {status.type !== 'idle' && (
                <div
                  className={`form-status ${status.type === 'success' ? 'success' : status.type === 'error' ? 'error' : ''}`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Map Block */}
        <div className="map-wrapper">
          <div className="map-header">
            <h4>{t.mapHeading}</h4>
            <a
              href="https://maps.app.goo.gl/pBTsCN5FNkgYGTSG7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
            >
              {t.openMaps} ↗
            </a>
          </div>
          <div className="map-frame-box">
            <iframe
              title="45-maktab xaritasi"
              src="https://www.google.com/maps?q=41.186256,71.7282842&z=17&output=embed"
              width="100%"
              height="340"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
