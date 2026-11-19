'use client';

import React, { useState, useEffect } from 'react';

interface NewsRow {
  id: number;
  title_uz: string;
  category: string;
  date: string;
  views: number;
}

interface InquiryRow {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface AnnouncementRow {
  id: number;
  title_uz: string;
  event_date: string;
  is_urgent: number;
}

interface StatsData {
  total_students: number;
  girls: number;
  boys: number;
  teachers: number;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'announcements' | 'inquiries'>('stats');
  const [errorMsg, setErrorMsg] = useState('');

  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementRow[]>([]);
  const [inquiriesList, setInquiriesList] = useState<InquiryRow[]>([]);

  // Stats state
  const [stats, setStats] = useState<StatsData>({
    total_students: 1056,
    girls: 438,
    boys: 618,
    teachers: 49,
  });
  const [statsSavedMsg, setStatsSavedMsg] = useState('');

  // News form state
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsCategory, setNewsCategory] = useState('Ta’lim');
  const [newsBodyUz, setNewsBodyUz] = useState('');
  const [newsBodyRu, setNewsBodyRu] = useState('');

  // Announcement form state
  const [annTitleUz, setAnnTitleUz] = useState('');
  const [annTitleRu, setAnnTitleRu] = useState('');
  const [annContentUz, setAnnContentUz] = useState('');
  const [annContentRu, setAnnContentRu] = useState('');
  const [annDate, setAnnDate] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('school45_next_admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [resNews, resAnn, resInq, resStats] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/announcements'),
        fetch('/api/contact'),
        fetch('/api/stats'),
      ]);
      const [dataNews, dataAnn, dataInq, dataStats] = await Promise.all([
        resNews.json(),
        resAnn.json(),
        resInq.json(),
        resStats.json(),
      ]);
      if (dataNews.success) setNewsList(dataNews.data || []);
      if (dataAnn.success) setAnnouncementsList(dataAnn.data || []);
      if (dataInq.success) setInquiriesList(dataInq.data || []);
      if (dataStats.success && dataStats.data) {
        setStats({
          total_students: dataStats.data.total_students,
          girls: dataStats.data.girls,
          boys: dataStats.data.boys,
          teachers: dataStats.data.teachers,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('school45_next_admin_token', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else {
        setErrorMsg(data.error || 'Login yoki parol noto‘g‘ri');
      }
    } catch {
      setErrorMsg('Server xatosi');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('school45_next_admin_token');
    setIsLoggedIn(false);
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatsSavedMsg('Saqlanmoqda...');
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      const data = await res.json();
      if (data.success) {
        setStatsSavedMsg('✅ Statistika muvaffaqiyatli saqlandi! Saytda aks etadi.');
        setTimeout(() => setStatsSavedMsg(''), 4000);
      } else {
        setStatsSavedMsg('❌ Xatolik yuz berdi');
      }
    } catch {
      setStatsSavedMsg('❌ Server bilan aloqa uzildi');
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_uz: newsTitleUz,
          title_ru: newsTitleRu,
          category: newsCategory,
          body_uz: newsBodyUz,
          body_ru: newsBodyRu,
          images: ['/assets/school-front-1.jpg'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Yangilik muvaffaqiyatli qo‘shildi!');
        setNewsTitleUz('');
        setNewsTitleRu('');
        setNewsBodyUz('');
        setNewsBodyRu('');
        fetchData();
      }
    } catch {
      alert('Xatolik yuz berdi');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_uz: annTitleUz,
          title_ru: annTitleRu,
          content_uz: annContentUz,
          content_ru: annContentRu,
          event_date: annDate,
          is_urgent: annUrgent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('E’lon muvaffaqiyatli qo‘shildi!');
        setAnnTitleUz('');
        setAnnTitleRu('');
        setAnnContentUz('');
        setAnnContentRu('');
        setAnnDate('');
        setAnnUrgent(false);
        fetchData();
      }
    } catch {
      alert('Xatolik yuz berdi');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '40px 20px' }}>
        <div className="login-card" style={{ maxWidth: 420, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <img src="/assets/logo.png" alt="Logo" style={{ width: 68, height: 68, margin: '0 auto 16px', display: 'block' }} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', textAlign: 'center', marginBottom: 8 }}>Next.js Admin Panel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: 24 }}>45-sonli maktab boshqaruvi</p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Foydalanuvchi nomi</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Parol</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Parolni kiriting" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Tizimga kirish</button>
            {errorMsg && <div style={{ color: '#b91c1c', marginTop: 12, textAlign: 'center', fontSize: '0.9rem' }}>{errorMsg}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Admin Navbar */}
      <nav style={{ background: 'var(--primary-dark)', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
          <img src="/assets/logo.png" alt="Logo" style={{ width: 34, height: 34 }} />
          <span>45-MAKTAB · NEXT.JS BOSHQARUV PANELI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" target="_blank" className="btn btn-secondary btn-sm">Saytni ko‘rish ↗</a>
          <button className="btn btn-sm btn-outline" onClick={handleLogout}>Chiqish</button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: 1140, margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '2px solid var(--border-light)', paddingBottom: 12 }}>
          <button className={`btn btn-sm ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('stats')}>
            📊 Maktab Statistikasi
          </button>
          <button className={`btn btn-sm ${activeTab === 'news' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('news')}>
            📰 Yangiliklar ({newsList.length})
          </button>
          <button className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('announcements')}>
            📢 E’lonlar ({announcementsList.length})
          </button>
          <button className={`btn btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('inquiries')}>
            📩 Kelgan murojaatlar ({inquiriesList.length})
          </button>
        </div>

        {/* Tab 0: Stats Management */}
        {activeTab === 'stats' && (
          <div>
            {/* Live Indicator Cards */}
            <div className="stats-row" style={{ marginBottom: 24 }}>
              <div className="stat-box">
                <span className="stat-number">{stats.total_students.toLocaleString()}</span>
                <span className="stat-label">Jami o‘quvchilar soni</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{stats.girls.toLocaleString()}</span>
                <span className="stat-label">Qiz bolalar</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{stats.boys.toLocaleString()}</span>
                <span className="stat-label">O‘g‘il bolalar</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{stats.teachers.toLocaleString()}</span>
                <span className="stat-label">Pedagog mutaxassislar</span>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 28, borderRadius: 12, border: '1px solid var(--border-light)' }}>
              <h3 style={{ marginBottom: 8, color: 'var(--primary-dark)' }}>Maktab Statistika Ko‘rsatkichlarini Yangilash</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                Ushbu bo‘limda raqamlarni o‘zgartirib saqlasangiz, bosh sahifadagi statistika avtomatik yangilanadi.
              </p>

              <form onSubmit={handleSaveStats}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Jami o‘quvchilar soni</label>
                    <input
                      type="number"
                      required
                      value={stats.total_students}
                      onChange={(e) => setStats({ ...stats, total_students: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pedagog mutaxassislar</label>
                    <input
                      type="number"
                      required
                      value={stats.teachers}
                      onChange={(e) => setStats({ ...stats, teachers: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Qiz bolalar</label>
                    <input
                      type="number"
                      required
                      value={stats.girls}
                      onChange={(e) => setStats({ ...stats, girls: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>O‘g‘il bolalar</label>
                    <input
                      type="number"
                      required
                      value={stats.boys}
                      onChange={(e) => setStats({ ...stats, boys: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                  <button type="submit" className="btn btn-primary">Statistikani saqlash</button>
                  {statsSavedMsg && <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{statsSavedMsg}</span>}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 1: News */}
        {activeTab === 'news' && (
          <div>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--primary-dark)' }}>Yangi maqola qo‘shish</h3>
              <form onSubmit={handleCreateNews}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sarlavha (UZ) *</label>
                    <input type="text" required value={newsTitleUz} onChange={(e) => setNewsTitleUz(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Заголовок (RU) *</label>
                    <input type="text" required value={newsTitleRu} onChange={(e) => setNewsTitleRu(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)}>
                    <option value="Ta’lim">Ta’lim</option>
                    <option value="Tadbirlar">Tadbirlar</option>
                    <option value="Yutuqlar">Yutuqlar</option>
                    <option value="Sport">Sport</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Matn (UZ) *</label>
                    <textarea rows={4} required value={newsBodyUz} onChange={(e) => setNewsBodyUz(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Текст (RU) *</label>
                    <textarea rows={4} required value={newsBodyRu} onChange={(e) => setNewsBodyRu(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">E’lon qilish</button>
              </form>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
              <h3 style={{ marginBottom: 16 }}>Mavjud maqolalar</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: 10 }}>ID</th>
                    <th style={{ padding: 10 }}>Sarlavha</th>
                    <th style={{ padding: 10 }}>Kategoriya</th>
                    <th style={{ padding: 10 }}>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((n) => (
                    <tr key={n.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 10 }}>{n.id}</td>
                      <td style={{ padding: 10 }}><strong>{n.title_uz}</strong></td>
                      <td style={{ padding: 10 }}>{n.category}</td>
                      <td style={{ padding: 10 }}>{n.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Announcements */}
        {activeTab === 'announcements' && (
          <div>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Yangi e’lon qo‘shish</h3>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sarlavha (UZ) *</label>
                    <input type="text" required value={annTitleUz} onChange={(e) => setAnnTitleUz(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Заголовок (RU) *</label>
                    <input type="text" required value={annTitleRu} onChange={(e) => setAnnTitleRu(e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sana</label>
                    <input type="text" value={annDate} onChange={(e) => setAnnDate(e.target.value)} placeholder="2026-11-25" />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 25 }}>
                    <input type="checkbox" checked={annUrgent} onChange={(e) => setAnnUrgent(e.target.checked)} style={{ width: 'auto' }} />
                    <label style={{ margin: 0, color: '#b45309', fontWeight: 700 }}>⚠️ Shoshilinch e’lon sifatida belgilash</label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Matn (UZ) *</label>
                    <textarea rows={3} required value={annContentUz} onChange={(e) => setAnnContentUz(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Текст (RU) *</label>
                    <textarea rows={3} required value={annContentRu} onChange={(e) => setAnnContentRu(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">E’lonni joylash</button>
              </form>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
              <h3 style={{ marginBottom: 16 }}>Mavjud e’lonlar</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: 10 }}>ID</th>
                    <th style={{ padding: 10 }}>Holat</th>
                    <th style={{ padding: 10 }}>Sarlavha</th>
                    <th style={{ padding: 10 }}>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {announcementsList.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 10 }}>{a.id}</td>
                      <td style={{ padding: 10 }}>{a.is_urgent ? '⚠️ Shoshilinch' : 'Oddiy'}</td>
                      <td style={{ padding: 10 }}><strong>{a.title_uz}</strong></td>
                      <td style={{ padding: 10 }}>{a.event_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Inquiries */}
        {activeTab === 'inquiries' && (
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: 16 }}>Saytdan kelgan murojaatlar ro‘yxati</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: 10 }}>F.I.SH.</th>
                  <th style={{ padding: 10 }}>Telefon</th>
                  <th style={{ padding: 10 }}>Email</th>
                  <th style={{ padding: 10 }}>Mavzu</th>
                  <th style={{ padding: 10 }}>Xabar</th>
                  <th style={{ padding: 10 }}>Sana</th>
                </tr>
              </thead>
              <tbody>
                {inquiriesList.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 10 }}><strong>{inq.full_name}</strong></td>
                    <td style={{ padding: 10 }}><a href={`tel:${inq.phone}`}>{inq.phone}</a></td>
                    <td style={{ padding: 10 }}>{inq.email || '—'}</td>
                    <td style={{ padding: 10 }}>{inq.subject || '—'}</td>
                    <td style={{ padding: 10, maxWidth: 300, fontSize: '0.85rem' }}>{inq.message}</td>
                    <td style={{ padding: 10 }}><small>{inq.created_at}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
