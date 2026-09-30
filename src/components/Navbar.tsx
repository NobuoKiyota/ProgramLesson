'use client';

import React from 'react';
import { 
  Code2, 
  Layers, 
  HelpCircle, 
  Headphones, 
  BookOpen, 
  Flame, 
  Volume2, 
  Sparkles 
} from 'lucide-react';

export type ActiveTab = 'sound-modules' | 'architecture' | 'troubleshooting' | 'audio-runner' | 'curriculum';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  completedCount: number;
  totalModules: number;
}

export default function Navbar({
  activeTab,
  onTabChange,
  completedCount,
  totalModules,
}: NavbarProps) {
  const tabs = [
    { id: 'sound-modules' as ActiveTab, label: 'Sound.cs 10大解読', icon: Code2 },
    { id: 'architecture' as ActiveTab, label: '設計相関図 & 音響数学', icon: Layers },
    { id: 'troubleshooting' as ActiveTab, label: '現場トラブル特訓', icon: HelpCircle },
    { id: 'audio-runner' as ActiveTab, label: 'WebAudio波形実験', icon: Headphones },
    { id: 'curriculum' as ActiveTab, label: '基礎カリキュラム', icon: BookOpen },
  ];

  return (
    <>
      {/* PC & タブレット用 トップナビゲーション */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* ロゴ & サブタイトル */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">AudioDev Academy</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Sound.cs 完全理解
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Unity 2,069行サウンドマネージャー 行別解読 & ゼロアロケーション実践
              </div>
            </div>
          </div>

          {/* PC用タブナビゲーション */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 右側: 総合INDEX & 個人ノートリンク & 進捗バッジ */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/index.html"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
              title="総合INDEXポータルを開く"
            >
              <span>🏠 総合INDEX</span>
            </a>
            <a
              href="/my_notes.html"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-900/60 to-slate-900 border border-cyan-700/60 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-500 transition-all shadow-sm"
              title="Q&A蓄積ノート & C#用語大辞典を開く"
            >
              <span>📓 Q&Aノート & 辞書</span>
            </a>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div className="text-xs">
                <span className="text-slate-400 hidden sm:inline">習得度: </span>
                <span className="font-bold text-white">{completedCount}/{totalModules}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* スマホ用 固定ボトムナビゲーションバー */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-semibold">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
