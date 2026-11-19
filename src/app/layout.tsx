import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '45-sonli umumiy o‘rta ta’lim maktabi | Rasmiy veb-sayt',
  description: 'Namangan viloyati Yangiqo‘rg‘on tumani 45-sonli umumiy o‘rta ta’lim maktabining rasmiy veb-sayti. Maktab yangiliklari, rahbariyat, e’lonlar va fotogalereya.',
  keywords: ['45-maktab', 'Yangiqo‘rg‘on', 'Namangan', 'maktab veb-sayti', 'ta’lim', 'maktab hayoti'],
  openGraph: {
    title: '45-sonli umumiy o‘rta ta’lim maktabi rasmiy portali',
    description: 'Kelajak sari bilim, tarbiya va yuksak marralar bilan. Namangan viloyati, Yangiqo‘rg‘on tumani.',
    images: ['/assets/school-front-1.jpg'],
    type: 'website'
  },
  icons: {
    icon: '/assets/logo.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
