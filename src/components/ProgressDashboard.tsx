'use client';

import React from 'react';
import { Trophy, Target, CheckCircle2, RotateCw, Flame, Award, BookOpen } from 'lucide-react';
import { TopicStats } from '@/types/learning';

interface ProgressDashboardProps {
  totalTopics: number;
  completedCount: number;
  topicStats: Record<string, TopicStats>;
  streakDays: number;
}

export default function ProgressDashboard({
  totalTopics,
  completedCount,
  topicStats,
  streakDays,
}: ProgressDashboardProps) {
  // 統計計算
  let totalAnswered = 0;
  let totalCorrect = 0;
  let totalRefreshed = 0;

  Object.values(topicStats).forEach((stat) => {
    totalAnswered += stat.answered || 0;
    totalCorrect += stat.correct || 0;
    totalRefreshed += stat.refreshedCount || 0;
  });

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // 理解度ランク判定
  let rankTitle = '🌱 サウンド見習い';
  let rankColor = 'text-slate-300';
  if (completedCount >= 40) {
    rankTitle = '⚡ サウンドアーキテクト / DSPマスター';
    rankColor = 'text-cyan-400 font-extrabold';
  } else if (completedCount >= 25) {
    rankTitle = '🎛️ 実践サウンドコーダー';
    rankColor = 'text-emerald-400 font-bold';
  } else if (completedCount >= 10) {
    rankTitle = '🎵 オーディオアプレンティス';
    rankColor = 'text-amber-400 font-semibold';
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col gap-4">
      {/* 上段: タイトル & ランク */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              Learning Mastery Dashboard
            </div>
            <h3 className="text-base md:text-lg font-black text-white">
              C# サウンド学習進捗 & 理解度
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl">
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400">ランク:</span>
          <span className={`text-xs ${rankColor}`}>{rankTitle}</span>
        </div>
      </div>

      {/* 中段: プログレスバー */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            全50トピック修了進捗
          </span>
          <span className="text-white font-bold">
            {completedCount} / {totalTopics} トピック ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 下段: 4つのメトリクスグリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>修了トピック</span>
          </div>
          <div className="text-lg font-black text-white">{completedCount} <span className="text-xs text-slate-500 font-normal">/ 50</span></div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>総合正答率</span>
          </div>
          <div className="text-lg font-black text-cyan-300">
            {totalAnswered > 0 ? `${accuracy}%` : '--'}
            <span className="text-[11px] text-slate-500 font-normal ml-1">({totalCorrect}/{totalAnswered}問)</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <RotateCw className="w-3.5 h-3.5 text-purple-400" />
            <span>AIクイズ刷新回数</span>
          </div>
          <div className="text-lg font-black text-purple-300">{totalRefreshed} <span className="text-xs text-slate-500 font-normal">回</span></div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>連続学習日数</span>
          </div>
          <div className="text-lg font-black text-amber-400">{streakDays} <span className="text-xs text-slate-500 font-normal">日継続</span></div>
        </div>
      </div>
    </div>
  );
}
