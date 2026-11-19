'use client';

import React, { useEffect, useState } from 'react';
import { Lang, translations } from '@/lib/i18n';

interface StatsData {
  total_students: number;
  girls: number;
  boys: number;
  teachers: number;
}

export const FeaturesAndStats: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];
  const [stats, setStats] = useState<StatsData>({
    total_students: 1056,
    girls: 438,
    boys: 618,
    teachers: 49,
  });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStats({
            total_students: res.data.total_students,
            girls: res.data.girls,
            boys: res.data.boys,
            teachers: res.data.teachers,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="features-bar">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <div className="feature-info">
                <h4>{t.feature1Title}</h4>
                <p>{t.feature1Desc}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <div className="feature-info">
                <h4>{t.feature2Title}</h4>
                <p>{t.feature2Desc}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <div className="feature-info">
                <h4>{t.feature3Title}</h4>
                <p>{t.feature3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-stats">
        <div className="container">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-number">{stats.total_students.toLocaleString()}</span>
              <span className="stat-label">{t.statTotal}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{stats.girls.toLocaleString()}</span>
              <span className="stat-label">{t.statGirls}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{stats.boys.toLocaleString()}</span>
              <span className="stat-label">{t.statBoys}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{stats.teachers.toLocaleString()}</span>
              <span className="stat-label">{t.statTeachers}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
