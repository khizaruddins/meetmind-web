'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does a bot join my Google Meet call?',
      a: 'No! Unlike Otter, Fireflies, or Zoom bots that join as visible participants, MeetMind runs natively on your desktop. Nobody in the meeting sees an awkward recording bot, and the recording is initiated unobtrusively.',
    },
    {
      q: 'Are my recordings uploaded to the cloud?',
      a: 'No. By default, recordings are encoded directly to your local drive in MP4 format. MeetMind does not upload video to third-party cloud servers. You own your video files completely.',
    },
    {
      q: 'How does Acoustic Echo Cancellation (AEC) work?',
      a: 'If you use laptop speakers, the microphone naturally picks up remote voices echoing into the room. MeetMind feeds the computer system audio as a reference into our WebRTC APM DSP engine to subtract the echo, leaving your voice pristine and isolated.',
    },
    {
      q: 'Can I use the same account on web and desktop?',
      a: 'Yes! The exact same email and password you create on the website signs into both the web customer portal and the desktop application.',
    },
    {
      q: 'What happens when my 30-day trial expires?',
      a: 'You can continue enjoying unlimited recording by upgrading to Silver ($19/mo) or unlock AI transcription and meeting intelligence with Gold ($39/mo).',
    },
    {
      q: 'How do I install the Chrome integration?',
      a: 'Simply install our lightweight Chrome/Edge extension. It communicates with the desktop app via native messaging to detect when you join and leave Google Meet sessions.',
    },
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="zinc">Frequently Asked Questions</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08] transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-zinc-100 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-rose-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
