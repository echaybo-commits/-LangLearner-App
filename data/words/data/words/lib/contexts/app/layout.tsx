import type { Metadata } from 'next';
import { UserProvider } from '@/contexts/UserContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lingo Game',
  description: 'تعلم اللغات بطريقة ممتعة وأسلوب الألعاب',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gradient-to-b from-orange-50 to-blue-50 min-h-screen">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
