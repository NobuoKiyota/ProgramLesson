'use client';

import React from 'react';
import { BookOpen, Headphones, Bug, Sparkles, Flame, Wand2 } from 'lucide-react';
import { TrackType } from '@/types/learning';

export type ActiveTab = 'resume' | 'curriculum' | 'audio-runner' | 'bug-hunt' | 'ai-studio';

interface NavbarProps {
  activeTrack: TrackType;
  onTrackChange: (track: TrackType) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  streakDays: number;
}

export default function Navbar({
  activeTrack,
  onTrackChange,
  activeTab,
  onTabChange,
  streakDays,
}: NavbarProps) {
  const tabs = [
    { id: 'resume' as ActiveTab, label: 'デイリー', icon: Sparkles },
    { id: 'curriculum' as ActiveTab, label: 'カリキュラム', icon: BookOpen },
    { id: 'audio-runner' as ActiveTab, label: '音出し演習', icon: Headphones },
    { id: 'bug-hunt' as ActiveTab, label: 'バグ退治', icon: Bug },
    { id: 'ai-studio' as ActiveTab, label: 'AI改造', icon: Wand2 },
  ];

  return (
    <>
      {/* PC & タブレット用 トップナビゲーション */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* ロゴ & サブタイトル */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">AudioDev Academy</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  C# & C++
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Unity / CRI / Cubase / VST サウンドプログラミング自立学習
              </div>
            </div>
          </div>

          {/* 中央: トラック切り替えスイッチ (C# vs C++) */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => onTrackChange('csharp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTrack === 'csharp'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              C# (Unity/CRI)
            </button>
            <button
              onClick={() => onTrackChange('cpp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTrack === 'cpp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              C++ (VST/DSP)
            </button>
          </div>

          {/* 右側: 連続日数 (Streak) & PC用タブ */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1.5 rounded-lg text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streakDays}日連続</span>
            </div>
          </div>
        </div>
      </header>

      {/* スマホ用 固定ボトムナビゲーションバー */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
