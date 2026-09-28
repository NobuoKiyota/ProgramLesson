'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Target, RefreshCw, Zap, Award } from 'lucide-react';
import { DailyResumeData, TrackType } from '@/types/learning';
import QuizCard from './QuizCard';

interface DailyResumeProps {
  initialResume: DailyResumeData;
  track: TrackType;
  weakCategories: string[];
  streakDays: number;
  onRefreshResume: () => Promise<void>;
  isLoading: boolean;
}

export default function DailyResume({
  initialResume,
  track,
  weakCategories,
  streakDays,
  onRefreshResume,
  isLoading,
}: DailyResumeProps) {
  const [resume] = useState<DailyResumeData>(initialResume);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 rounded-2xl p-5 md:p-8 shadow-2xl relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Gemini Adaptive Resume
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                <Calendar className="w-3 h-3 text-cyan-400" /> {resume.date}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-0.5 tracking-tight">
              {resume.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onRefreshResume}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-950/80 border border-cyan-800 hover:border-cyan-700 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Geminiが思考中...' : 'レジュメを再生成'}</span>
        </button>
      </div>

      {/* 重点ポイント & 理由 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5">
          <Target className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400">本日の重点項目</div>
            <div className="text-sm font-bold text-cyan-200">{resume.focusPoint}</div>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-2.5 md:col-span-2">
          <Zap className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400">AI選定理由（あなたの進捗に基づく分析）</div>
            <div className="text-xs text-slate-300 leading-relaxed">{resume.reason}</div>
          </div>
        </div>
      </div>

      {/* 5分レジュメ解説本文 */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 md:p-5 mb-6">
        <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
          <span>📖 今日の1分エッセンス講義</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {resume.briefExplanation}
        </p>

        {resume.quickChallenge && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
            <Award className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{resume.quickChallenge}</span>
          </div>
        )}
      </div>

      {/* 今日の確認ドリル */}
      {resume.drillQuestions && resume.drillQuestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>🔥 今日のチェックドリル（忘却防止）</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {resume.drillQuestions.map((q) => (
              <QuizCard key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
