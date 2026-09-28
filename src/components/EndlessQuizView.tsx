'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Dices, RefreshCw, Trophy, Flame, ArrowRight, Lightbulb, Key } from 'lucide-react';
import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';
import QuizCard from './QuizCard';

interface EndlessQuizViewProps {
  activeTrack: TrackType;
  userApiKey?: string;
  onOpenApiKeyModal?: () => void;
}

export default function EndlessQuizView({
  activeTrack,
  userApiKey = '',
  onOpenApiKeyModal,
}: EndlessQuizViewProps) {
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [solvedCount, setSolvedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'procedural_fallback' | 'initial'>('initial');
  const [generationWarning, setGenerationWarning] = useState<string | null>(null);

  // 初回マウント時、またはトラック・難易度・APIキー変更時にクイズを1問自動生成
  useEffect(() => {
    fetchNewQuiz();
  }, [activeTrack, difficulty, userApiKey]);

  const fetchNewQuiz = async () => {
    setIsLoading(true);
    setGenerationWarning(null);
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: activeTrack,
          difficulty: difficulty,
          topicTitle: activeTrack === 'csharp' ? 'Unityサウンドプログラミング / C#' : 'VST3・オーディオDSP / C++',
          userApiKey: userApiKey || undefined,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentQuiz(json.data);
        setGenerationSource(json.source || 'gemini');
        if (json.warning) {
          setGenerationWarning(json.warning);
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Failed to generate quiz:', err);
      setGenerationWarning(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswered = (isCorrect: boolean) => {
    setSolvedCount((prev) => prev + 1);
    if (isCorrect) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-xl flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Infinite AI Quiz Generator
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                generationSource === 'gemini'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {generationSource === 'gemini' ? '✨ Gemini AI 実稼働中' : '⚙️ プロシージャル動的生成'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Gemini 無限クイズ特訓モード
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              毎回新しい現場シチュエーションを自動生成！同じ3問をぐるぐる回ることは二度とありません。
            </p>
          </div>
        </div>

        {/* 成績バッジ */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>回答数: <strong>{solvedCount}</strong></span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>連勝: {streak}</span>
          </div>
        </div>
      </div>

      {/* Gemini APIエラーや警告がある場合の通知バナー */}
      {generationWarning && (
        <div className="bg-amber-950/60 border border-amber-800/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-300">Gemini API 通信情報:</div>
            <div className="text-[11px] text-amber-200/90 mt-0.5">{generationWarning}</div>
            <div className="text-[10px] text-slate-400 mt-1">※APIキーが無効、または未設定の場合は、ローカルの動的生成エンジンが自動で代行します。</div>
          </div>
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="shrink-0 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-all"
            >
              キーを確認・変更
            </button>
          )}
        </div>
      )}

      {/* APIキー案内バナー (未設定の場合) */}
      {!userApiKey && !generationWarning && onOpenApiKeyModal && (
        <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Key className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Google AI StudioのAPIキーを設定すると、本物のGeminiが毎回完全オリジナルの現場問題を出題します。</span>
          </div>
          <button
            onClick={onOpenApiKeyModal}
            className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1 px-3 rounded-lg transition-all"
          >
            キーを設定
          </button>
        </div>
      )}

      {/* 難易度セレクター & 新問題生成ボタン */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">難易度:</span>
          <button
            onClick={() => setDifficulty('beginner')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              difficulty === 'beginner'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌱 超初歩・基礎
          </button>
          <button
            onClick={() => setDifficulty('intermediate')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              difficulty === 'intermediate'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 実践・中級
          </button>
        </div>

        <button
          onClick={fetchNewQuiz}
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? '新しい問題を考案中...' : '🎲 別の新問題を自動生成'}</span>
        </button>
      </div>

      {/* クイズカードのレンダリング */}
      {isLoading ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
          <div className="text-sm font-bold text-white">新しいオリジナルクイズを考案中...</div>
          <div className="text-xs text-slate-400">現場のサウンドコーディングに役立つ問題を生成しています</div>
        </div>
      ) : currentQuiz ? (
        <div className="flex flex-col gap-4">
          <QuizCard
            key={currentQuiz.id}
            question={currentQuiz}
            onAnswered={(isCorrect) => handleAnswered(isCorrect)}
            onRefreshQuiz={fetchNewQuiz}
            isRefreshing={isLoading}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={fetchNewQuiz}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs md:text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <span>次の新しい問題を自動生成して解く</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
