import React from 'react';
import { Badge } from '../../../components/shared/Badge';
import { CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';

export default function WindowsDocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="sky">Windows 10 / 11 Guide</Badge>
        <h1 className="text-2xl font-bold font-heading text-white">
          Installing MeetMind on Windows
        </h1>
        <p className="text-xs text-zinc-400">
          Complete guide for installing and configuring MeetMind on Windows 10 (Build 19041+) and Windows 11 64-bit.
        </p>
      </div>

      <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
        <h3 className="text-sm font-semibold text-white">1. Download Installer</h3>
        <p>
          Download the latest <a href="https://github.com/khizaruddins/meetmind-downloads/releases/latest/download/MeetMind-Windows-x64-Setup.exe" className="text-rose-400 hover:underline"><code>MeetMind-Windows-x64-Setup.exe</code></a> from the <a href="/download" className="text-rose-400 hover:underline">Download page</a> or directly from <a href="https://github.com/khizaruddins/meetmind-downloads/releases" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline">GitHub Releases</a>.
        </p>

        <h3 className="text-sm font-semibold text-white">2. Run Setup</h3>
        <p>
          Double-click the installer. If Windows SmartScreen displays a blue prompt for unsigned development builds:
        </p>
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Windows SmartScreen Note</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Click <strong>More info</strong>, then select <strong>Run anyway</strong>. Development binaries are self-signed.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-white">3. System Audio & Microphone Permissions</h3>
        <p>
          Open Windows Settings &gt; Privacy &amp; Security &gt; Microphone. Ensure <strong>Let desktop apps access your microphone</strong> is turned ON.
        </p>

        <h3 className="text-sm font-semibold text-white">4. Sign In with Your Web Account</h3>
        <p>
          Launch MeetMind from the Start Menu or Desktop shortcut. Enter the same email and password registered on the MeetMind website. Your active plan entitlements will automatically synchronize.
        </p>

        <h3 className="text-sm font-semibold text-white">5. Install Chrome Extension</h3>
        <p>
          Follow the <a href="/docs/chrome-extension" className="text-rose-400 hover:underline">Chrome Extension Guide</a> to enable automatic Google Meet recording.
        </p>
      </div>
    </div>
  );
}
