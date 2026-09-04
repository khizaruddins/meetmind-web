import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeetMind — Automatic Meeting Recorder & Intelligence',
  description:
    'Automatically record Google Meet conversations with system audio, microphone, screen sharing, local MP4 capture, and intelligent meeting workflows. Works privately on Windows, macOS, and Linux.',
  keywords: [
    'Meeting Recorder',
    'MeetMind',
    'Google Meet Recorder',
    'Local MP4 Capture',
    'Echo Cancellation',
    'Audio Processing',
    'Meeting Intelligence',
  ],
  authors: [{ name: 'MeetMind Technologies' }],
  openGraph: {
    title: 'MeetMind — The Intelligent Meeting Recorder',
    description: 'Capture every conversation with pristine audio, zero echo, and local-first privacy.',
    url: 'http://localhost:3000',
    siteName: 'MeetMind',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeetMind — The Intelligent Meeting Recorder',
    description: 'Automatic Google Meet capture with local MP4 storage and crystal-clear audio.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
