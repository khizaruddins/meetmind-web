import React from 'react';
import { Badge } from '../../../components/shared/Badge';
import { Chrome, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ChromeExtensionDocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="rose">Browser Integration Guide</Badge>
        <h1 className="text-2xl font-bold font-heading text-white">
          Google Meet Chrome & Edge Extension Setup
        </h1>
        <p className="text-xs text-zinc-400">
          How to connect Google Meet with the MeetMind native desktop recorder for fully automated session capture.
        </p>
      </div>

      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
        {/* Core Architecture Principle */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-1.5">
          <div className="font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Important Privacy Architecture</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            The Chrome extension only detects call state (prejoin, meeting joined, call ended). It communicates with the desktop application via standard native messaging. <strong>The extension never captures, reads, or processes audio/video data itself.</strong> All capture and encoding remain inside the native desktop application.
          </p>
        </div>

        {/* Step by Step Setup */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Step-by-Step Installation</h3>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200">1. Install the Extension (Development / Unpacked)</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2 text-zinc-400">
              <li>Open Google Chrome or Microsoft Edge and navigate to <code>chrome://extensions</code>.</li>
              <li>Toggle <strong>Developer mode</strong> ON in the upper right corner.</li>
              <li>Click <strong>Load unpacked</strong>.</li>
              <li>Select the <code>recorder-extension/dist</code> folder in your MeetMind installation directory.</li>
            </ol>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-zinc-200">2. Verify Native Host Connection</h4>
            <p className="text-zinc-400">
              Open the MeetMind desktop application. The top status bar will illuminate with an emerald badge reading:
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-emerald-400 border border-emerald-500/30 inline-block text-[11px]">
              EXT: Connected • Ready for Meet
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-semibold text-zinc-200">3. Test with a Real Google Meet Session</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2 text-zinc-400">
              <li>Navigate to <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="text-rose-400 hover:underline">meet.google.com</a> and start a new instant meeting.</li>
              <li>On the lobby screen, MeetMind detects the prejoin state.</li>
              <li>Click <strong>Join now</strong>: MeetMind immediately starts recording video and mixed audio. The desktop HUD turns red: <code>REC 00:00:01</code>.</li>
              <li>Click <strong>Leave call</strong>: MeetMind automatically stops the recording and saves the finalized MP4 to your Videos folder.</li>
            </ol>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Troubleshooting & Common Issues</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="font-semibold text-amber-300">Badge says "EXT Disconnected"?</div>
              <p className="text-zinc-400 text-[11px]">
                Ensure the MeetMind desktop application is actively running in the background or system tray. Check that the Native Messaging JSON host manifest is registered at <code>~/.config/google-chrome/NativeMessagingHosts/com.meetingrecorder.bridge.json</code> (Linux) or Windows Registry.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="font-semibold text-amber-300">Recording starts but screen is black?</div>
              <p className="text-zinc-400 text-[11px]">
                On Linux Wayland, confirm that <code>xdg-desktop-portal</code> has permission to capture screen output. On macOS, ensure Screen Recording permissions are granted in System Settings.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="font-semibold text-amber-300">Microphone voice sounds quiet or absent?</div>
              <p className="text-zinc-400 text-[11px]">
                Open MeetMind Desktop Settings &gt; Audio Devices. Verify your preferred microphone is selected and that the Voice Gate threshold is adjusted properly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
