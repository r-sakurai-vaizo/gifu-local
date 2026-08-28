import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GIFU ART & CRAFT | 岐阜市のアートと工芸', description: '岐阜市に根付いたアートと工芸を、ひとつの入口に。知る・歩く・体験する・買う。' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
