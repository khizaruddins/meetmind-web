'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square, Sparkles, CheckCircle2, HardDrive, Volume2, Shield } from 'lucide-react';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { Card } from '../shared/Card';

export const InteractiveRecorderDemo: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'RECORDING' | 'FINALIZING' | 'SAVED'>('IDLE');

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStart = () => {
    setStatus('RECORDING');
    setIsRecording(true);
    setSeconds(0);
  };

  const handleStop = () => {
    setIsRecording(false);
    setStatus('FINALIZING');
    setTimeout(() => {
      setStatus('SAVED');
    }, 1200);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <Badge variant="rose">Interactive Product Preview</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
          Try the Recorder Controls Right Now
        </h2>
        <p className="text-sm text-zinc-400">
          Click Start Recording to preview the desktop HUD, live audio telemetry, and local MP4 remuxing workflow.
        </p>
      </div>

      <Card variant="elevated" className="p-8 border-white/10 max-w-2xl mx-auto relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200">MeetMind Desktop HUD</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
            Status: {status}
          </span>
        </div>

        {/* Display Area */}
        <div className="text-center py-8 space-y-4">
          <div className="font-mono text-4xl md:text-5xl font-bold tracking-wider text-white">
            {formatTime(seconds)}
          </div>

          {/* Active Audio Waveform Bars */}
          <div className="h-10 flex items-center justify-center gap-1.5 px-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isRecording ? 'bg-rose-500' : 'bg-zinc-800'
                }`}
                style={{
                  height: isRecording
                    ? `${20 + Math.abs(Math.sin((seconds + i) * 0.6)) * 80}%`
                    : '20%',
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-2">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-sky-400" />
              <span>System Audio Active</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>AEC Echo Cancellation On</span>
            </span>
          </div>
        </div>

        {/* Interactive Action Button */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
          {status === 'RECORDING' ? (
            <Button variant="danger" size="md" onClick={handleStop} className="cursor-pointer">
              <Square className="w-4 h-4" />
              <span>Stop Recording & Save MP4</span>
            </Button>
          ) : (
            <Button size="md" onClick={handleStart} className="cursor-pointer">
              <Play className="w-4 h-4" />
              <span>{status === 'SAVED' ? 'Record Another Meeting' : 'Start Recording Demo'}</span>
            </Button>
          )}
        </div>

        {/* Saved confirmation notification */}
        {status === 'SAVED' && (
          <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Success: <strong>2026-09-04_Meeting.mp4</strong> produced and saved to your local disk.</span>
          </div>
        )}
      </Card>
    </section>
  );
};
