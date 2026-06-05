import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hardhire — Contractor Safety Intelligence',
  description: 'Hardhire grades contractors A–F using federal OSHA violation records — before you sign the contract.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
