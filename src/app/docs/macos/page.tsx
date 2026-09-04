import React from 'react';
import { Badge } from '../../../components/shared/Badge';
import { AlertTriangle, Apple } from 'lucide-react';

export default function MacOsDocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="amber">macOS Guide</Badge>
        <h1 className="text-2xl font-bold font-heading text-white">
          Installing MeetMind on macOS
        </h1>
        <p className="text-xs text-zinc-400">
          Guide for Apple Silicon (M1/M2/M3/M4) and Intel Macs running macOS Monterey, Ventura, Sonoma, and Sequoia.
        </p>
      </div>

      <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
        <h3 className="text-sm font-semibold text-white">1. Download DMG</h3>
        <p>
          Download <code>MeetMind-1.0.0-arm64.dmg</code> (for Apple Silicon) or the Intel DMG from the <a href="/download" className="text-rose-400 hover:underline">Download page</a>.
        </p>

        <h3 className="text-sm font-semibold text-white">2. Drag to Applications</h3>
        <p>
          Open the DMG disk image and drag <strong>MeetMind</strong> into your <code>/Applications</code> directory.
        </p>

        <h3 className="text-sm font-semibold text-white">3. Grant Screen Recording & Microphone Permissions</h3>
        <p>
          On first launch, macOS requires explicit permission to record system video and microphone:
        </p>
        <ol className="list-decimal list-inside space-y-1 pl-2 text-zinc-400">
          <li>Open <strong>System Settings &gt; Privacy &amp; Security</strong>.</li>
          <li>Under <strong>Screen &amp; System Audio Recording</strong>, toggle <strong>MeetMind</strong> to ON.</li>
          <li>Under <strong>Microphone</strong>, toggle <strong>MeetMind</strong> to ON.</li>
          <li>Click <strong>Quit &amp; Reopen</strong> when macOS prompts to apply permissions.</li>
        </ol>

        <h3 className="text-sm font-semibold text-white">4. Sign In & Setup Extension</h3>
        <p>
          Sign in using your MeetMind web account credentials. Proceed to the <a href="/docs/chrome-extension" className="text-rose-400 hover:underline">Chrome Extension Guide</a> to connect Google Meet auto-recording.
        </p>
      </div>
    </div>
  );
}
