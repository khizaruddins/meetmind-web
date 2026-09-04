'use client';

import React from 'react';
import { DownloadSection } from '../../../components/landing/DownloadSection';

export default function CustomerDownloadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Desktop Application Downloads</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Install MeetMind on all your computers. The same subscription plan activates across devices.
        </p>
      </div>

      <div className="-mt-12">
        <DownloadSection />
      </div>
    </div>
  );
}
