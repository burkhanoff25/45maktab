# 45-SONLI UMUMIY O‘RTA TA’LIM MAKTABI RASMIY VEB-PORTALI

Namangan viloyati Yangiqo‘rg‘on tumani 45-sonli umumiy o‘rta ta’lim maktabining to‘liq takomillashtirilgan, professional rasmiy veb-sayti va ma’muriy boshqaruv tizimi (Admin Panel).

---

## 🌟 ASOSIY XUSUSIYATLAR VA IMKONIYATLAR

1. **Zamonaviy va Rasmiy Dizayn (Premium UI/UX)**:
   - Davlat ta’lim muassasasi standartlariga mos, ishonchli va ko‘rkam dizayn (Teal / Deep Navy ranglar palitrasi).
   - Barcha qurilmalarga (smartfonlar, planshetlar, noutbuklar va katta ekranlar) 100% moslashuvchan (Responsive) interfeys.
   - Silliq animatsiyalar, mikro-interaksiyalar va zamonaviy tipografika.

2. **Ikki Tilli Tizim (O‘zbek va Rus tillari)**:
   - Sayt interfeysi, barcha bo‘limlar, matnlar va statistik ma’lumotlar bir tugma (`UZ | RU`) orqali to‘liq o‘zgaradi.
   - Yangiliklar va e’lonlar admin panel orqali har ikki tilda parallel kiritiladi.

3. **To‘liq Ishlaydigan Backend va Ma’lumotlar Bazasi**:
   - Node.js asosidagi yuqori tezlikda ishlovchi server arxitekturasi.
   - Tranzaksiyalarni to‘liq ta’minlovchi **SQLite (WAL rejimi)** ma’lumotlar bazasi.
   - Haqiqiy rasm va fayllarni yuklash tizimi (Multipart file upload): yuklangan rasmlar serverning `public/uploads` papkasida xavfsiz saqlanadi.

4. **Xavfsiz Admin Panel (`/admin`)**:
   - Parollarni xavfsiz heshlash (PBKDF2 SHA-512, 100 000 iteratsiya + kriptografik tuz (salt)). Hech qanday parol ochiq holatda saqlanmaydi.
   - Seanslar uchun xavfsiz Token autentifikatsiyasi.
   - Yangilik qo‘shish, tahrirlash, bir nechta rasm biriktirish va o‘chirish.
   - E’lonlar (shoshilinch va odatiy) joylashtirish va boshqarish.
   - Fuqarolar va ota-onalardan kelgan murojaatlarni real vaqt rejimida qabul qilish va ko‘rish.
   - Administrator parolini panel orqali o‘zgartirish imkoniyati.

5. **Interaktiv Funksiyalar**:
   - Rasmlarni to‘liq ekranda ko‘rish uchun qulay **Lightbox (galereya)** — klaviatura o‘qlari va swipe orqali boshqariladi.
   - Yangiliklarni alohida oynada batafsil o‘qish va ko‘rishlar hisoblagichi.
   - Maktabning Google Xaritalardagi aniq geolokatsiyasi va yo‘nalish ko‘rsatkichi.
   - Maktab ustavi va me’yoriy hujjatlar bo‘limi.

---

## 🚀 ISHGA TUSHIRISH YO‘RIQNOMASI

Loyiha papkasida Node.js o‘rnatilgan bo‘lishi kifoya (hech qanday tashqi og‘ir yoki xavfli kutubxonalarga qaram emas):

```bash
# Serverni ishga tushirish:
npm start

# Yoki to‘g‘ridan-to‘g‘ri node orqali:
node server/server.js
```

Server ishga tushgach:
- **Asosiy veb-sayt:** `http://localhost:3000`
- **Admin panel:** `http://localhost:3000/admin`

---

## 🔐 ADMIN PANEL GA KIRISH MA'LUMOTLARI

- **Login:** `admin`
- **Dastlabki parol:** `Maktab45@Admin2026`

*(Tizimga kirgach, «Xavfsizlik & Parol» bo‘limi orqali parolni istalgan vaqtda yangilashingiz mumkin)*.

---

## 📁 LOYIHA TUZILISHI

```
MAKTAB/
├── data/
│   └── school45.db        # SQLite ma'lumotlar bazasi
├── public/
│   ├── assets/            # Maktabning asl fotosuratlari va logotipi
│   ├── uploads/           # Admin panel orqali yuklangan yangi suratlar
│   ├── index.html         # Asosiy sahifa
│   ├── admin.html         # Xavfsiz admin paneli
│   ├── style.css          # Zamonaviy Premium dizayn uslublari
│   └── app.js             # Frontend mantiqi, i18n va API integratsiyasi
├── server/
│   ├── database.js        # Ma'lumotlar bazasi sxemasi, PBKDF2 xavfsizlik
│   ├── server.js          # HTTP Server, REST API va fayl yuklash tizimi
│   └── test_routes.js     # Avtomatlashtirilgan testlar
├── package.json
└── README.md
```
