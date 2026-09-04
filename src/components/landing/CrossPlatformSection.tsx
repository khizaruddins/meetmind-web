import React from 'react';
import { Cpu, Check, Layers, Zap } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const CrossPlatformSection: React.FC = () => {
  const platforms = [
    {
      name: 'Windows',
      version: 'Windows 10 / 11 64-bit',
      backends: [
        'Windows Graphics Capture (WGC) native API',
        'WASAPI loopback system audio capture',
        'Direct3D 11 & DXGI surface texture sharing',
        'NVIDIA NVENC, Intel QSV & AMD AMF hardware acceleration',
      ],
      tag: 'Windows x64 / ARM64 Ready',
      color: 'border-sky-500/30 text-sky-400',
    },
    {
      name: 'macOS',
      version: 'macOS Monterey, Ventura, Sonoma, Sequoia',
      backends: [
        'ScreenCaptureKit high-performance display stream',
        'CoreAudio virtual loopback & system mixer',
        'Apple Silicon M1/M2/M3/M4 hardware VideoToolbox',
        'Intel x86_64 legacy architecture supported',
      ],
      tag: 'Apple Silicon & Intel',
      color: 'border-amber-500/30 text-amber-400',
    },
    {
      name: 'Linux',
      version: 'Ubuntu, Fedora, Arch, Debian',
      backends: [
        'PipeWire & XDG Desktop Portal for Wayland',
        'X11 Shared Memory (XShm) direct root window capture',
        'PulseAudio & PipeWire system audio monitoring',
        'VA-API, NVENC & software fallback encoding',
      ],
      tag: 'Wayland & X11 Supported',
      color: 'border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="indigo">Native Performance Everywhere</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Engineered Natively for Your Operating System
        </h2>
        <p className="text-sm text-zinc-400">
          No slow Electron browser wrappers for media encoding. MeetMind's core engine is written in C++20
          interfacing directly with OS-level capture APIs and GPU acceleration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((p) => (
          <Card key={p.name} variant="elevated" hoverEffect className="p-6 space-y-4 border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-heading">{p.name}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${p.color}`}>
                {p.tag}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{p.version}</p>

            <ul className="space-y-2.5 pt-3 border-t border-white/[0.08] text-xs text-zinc-300">
              {p.backends.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
};
