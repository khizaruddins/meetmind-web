import React from 'react';
import { Badge } from '../../../components/shared/Badge';
import { Terminal, CheckCircle2 } from 'lucide-react';

export default function LinuxDocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="emerald">Linux Guide</Badge>
        <h1 className="text-2xl font-bold font-heading text-white">
          Installing MeetMind on Linux
        </h1>
        <p className="text-xs text-zinc-400">
          Instructions for Ubuntu, Debian, Fedora, Arch Linux, and other modern distributions with PipeWire or X11.
        </p>
      </div>

      <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
        <h3 className="text-sm font-semibold text-white">1. Download AppImage or DEB</h3>
        <p>
          Download <code>MeetMind-1.0.0-x86_64.AppImage</code> or the <code>.deb</code> package from the <a href="/download" className="text-rose-400 hover:underline">Download page</a>.
        </p>

        <h3 className="text-sm font-semibold text-white">2. Make Executable (AppImage)</h3>
        <div className="p-3.5 rounded-xl bg-zinc-950 font-mono text-zinc-300 border border-white/10">
          <code>chmod +x MeetMind-1.0.0-x86_64.AppImage<br />./MeetMind-1.0.0-x86_64.AppImage</code>
        </div>

        <h3 className="text-sm font-semibold text-white">3. Wayland & PipeWire Portal Behavior</h3>
        <p>
          On Wayland (GNOME / KDE), MeetMind interfaces through <code>xdg-desktop-portal</code>. When recording or screenshot capture is initiated, the system portal dialog may prompt you to confirm which monitor or window to share.
        </p>

        <h3 className="text-sm font-semibold text-white">4. Audio Dependencies</h3>
        <p>
          MeetMind links against standard PulseAudio / PipeWire interfaces and <code>libwebrtc_audio_processing.so.1</code> for Acoustic Echo Cancellation. On Debian/Ubuntu:
        </p>
        <div className="p-3.5 rounded-xl bg-zinc-950 font-mono text-zinc-300 border border-white/10">
          <code>sudo apt-get install libpipewire-0.3-0 libpulse0 libwebrtc-audio-processing1</code>
        </div>
      </div>
    </div>
  );
}
