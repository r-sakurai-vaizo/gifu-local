import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GIFU ART & CRAFT | 岐阜の表現を、買う・体験する・支える', description: '岐阜市の現代美術、写真・映像、音楽・舞台、デザイン、工芸。作品購入、制作体験、作家フォロー、継続支援をひとつの場所で。' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
