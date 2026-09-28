'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Dices, RefreshCw, Trophy, Flame, ArrowRight, Lightbulb, Key, Layers, CheckCircle2 } from 'lucide-react';
import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';
import { INITIAL_CURRICULUM } from '@/data/curriculum';
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
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [solvedCount, setSolvedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [useAiGeneration, setUseAiGeneration] = useState(false);
  const [generationWarning, setGenerationWarning] = useState<string | null>(null);

  // カリキュラム内の全蓄積クイズをフラット化して抽出
  const curatedPool = useMemo(() => {
    const topics = INITIAL_CURRICULUM.filter((t) => t.track === activeTrack);
    const quizzes = topics.flatMap((t) => t.quizzes);
    if (difficulty === 'all') return quizzes;
    return quizzes.filter((q) => q.difficulty === difficulty);
  }, [activeTrack, difficulty]);

  // 初回マウント時、またはトラックや難易度変更時にクイズを1問選出
  useEffect(() => {
    pickNextQuiz();
  }, [activeTrack, difficulty, useAiGeneration]);

  // 次のクイズを選出（蓄積プールから即座に、またはAI生成）
  const pickNextQuiz = async () => {
    if (useAiGeneration) {
      setIsLoading(true);
      setGenerationWarning(null);
      try {
        const res = await fetch('/api/gemini/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track: activeTrack,
            difficulty: difficulty === 'all' ? 'beginner' : difficulty,
            topicTitle: activeTrack === 'csharp' ? 'Unityサウンドプログラミング / C#' : 'VST3・オーディオDSP / C++',
            userApiKey: userApiKey || undefined,
          }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentQuiz(json.data);
          if (json.warning) setGenerationWarning(json.warning);
        }
      } catch (err: unknown) {
        const e = err as Error;
        console.error('Failed to generate quiz:', err);
        setGenerationWarning(e.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // 蓄積マスタープールから選出（待ち時間ゼロ・失敗ゼロ）
      if (curatedPool.length === 0) return;
      let nextQuiz: QuizQuestion;
      if (curatedPool.length === 1) {
        nextQuiz = curatedPool[0];
      } else {
        // 直前と同じ問題を避ける
        const filtered = curatedPool.filter((q) => q.id !== currentQuiz?.id);
        const randIdx = Math.floor(Math.random() * filtered.length);
        nextQuiz = filtered[randIdx];
      }
      setCurrentQuiz(nextQuiz);
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
                Infinite Practice Drill
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-purple-950 text-purple-300 border-purple-800 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                厳選蓄積プール: 全 {curatedPool.length} 問
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              現場サウンド特訓ドリル
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unity・VST・CRI ADXの現場知識を凝縮した良問集からノンストップで出題！
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

      {/* 出題モード切替と難易度セレクター */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">難易度:</span>
          <button
            onClick={() => setDifficulty('all')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              difficulty === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            全難易度 ({INITIAL_CURRICULUM.filter(t => t.track === activeTrack).flatMap(t => t.quizzes).length}問)
          </button>
          <button
            onClick={() => setDifficulty('beginner')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              difficulty === 'beginner'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌱 基礎
          </button>
          <button
            onClick={() => setDifficulty('intermediate')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              difficulty === 'intermediate'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 実践・中級
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={pickNextQuiz}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>🎲 別の問題に切替</span>
          </button>
        </div>
      </div>

      {/* クイズカードのレンダリング */}
      {isLoading ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
          <div className="text-sm font-bold text-white">問題を選出中...</div>
        </div>
      ) : currentQuiz ? (
        <div className="flex flex-col gap-4">
          <QuizCard
            key={currentQuiz.id}
            question={currentQuiz}
            onAnswered={(isCorrect) => handleAnswered(isCorrect)}
            onRefreshQuiz={pickNextQuiz}
            isRefreshing={isLoading}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={pickNextQuiz}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs md:text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <span>次の問題を解く</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
