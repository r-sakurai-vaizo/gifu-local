import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GIFU LOCAL | 岐阜の文化と出会う', description: '岐阜の人が選ぶ「いい岐阜」を、知る・歩く・体験する・買う。' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
