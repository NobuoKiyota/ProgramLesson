'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Code2, Headphones } from 'lucide-react';
import { QuizQuestion } from '@/types/learning';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswered?: (isCorrect: boolean, category: string) => void;
}

export default function QuizCard({ question, onAnswered }: QuizCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
    setIsSubmitted(true);

    const chosenOption = question.options.find((o) => o.id === optionId);
    if (chosenOption && onAnswered) {
      onAnswered(chosenOption.isCorrect, question.category);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-lg flex flex-col gap-4">
      {/* バッジ & カテゴリ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
            {question.track === 'csharp' ? 'C#' : 'C++'} • {question.category}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            question.difficulty === 'beginner' 
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' 
              : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
          }`}>
            {question.difficulty === 'beginner' ? '基礎・初級' : '中級・実践'}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {question.type === 'bug_hunting' ? '🐞 バグ退治' : question.type === 'why_concept' ? '💡 Why問' : '📝 クイズ'}
        </span>
      </div>

      {/* 設問タイトル & 本文 */}
      <div>
        <h4 className="text-base md:text-lg font-bold text-white mb-2">{question.title}</h4>
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{question.question}</p>
      </div>

      {/* コードスニペット表示 (ある場合) */}
      {question.codeSnippet && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-3.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-mono">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>コードスニペット</span>
          </div>
          <pre className="text-xs md:text-sm text-emerald-400 font-mono leading-relaxed">
            {question.codeSnippet}
          </pre>
        </div>
      )}

      {/* 選択肢リスト */}
      <div className="flex flex-col gap-2.5 pt-1">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let btnClass = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

          if (isSubmitted) {
            if (option.isCorrect) {
              btnClass = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-medium';
            } else if (isSelected) {
              btnClass = 'bg-rose-950/70 border-rose-600 text-rose-200 font-medium';
            } else {
              btnClass = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 ${btnClass}`}
            >
              <div className="mt-0.5 shrink-0">
                {isSubmitted ? (
                  option.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 group-hover:border-cyan-400" />
                )}
              </div>
              <div className="flex-1 leading-snug">{option.text}</div>
            </button>
          );
        })}
      </div>

      {/* 解答後の詳細解説 */}
      {isSubmitted && selectedOption && (
        <div className={`mt-2 p-4 rounded-lg border flex flex-col gap-3 ${
          selectedOption.isCorrect ? 'bg-emerald-950/30 border-emerald-800/50' : 'bg-rose-950/30 border-rose-800/50'
        }`}>
          <div className="flex items-center gap-2">
            {selectedOption.isCorrect ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" /> 正解！ Excellent!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-400">
                <XCircle className="w-4 h-4" /> 不正解（もう一度確認してみよう）
              </span>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {selectedOption.explanation}
          </p>

          {/* サウンド文脈での補足 */}
          {question.soundContext && (
            <div className="bg-slate-950/80 rounded-md p-2.5 border border-slate-800 flex items-start gap-2 text-xs text-cyan-300">
              <Headphones className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
              <div>
                <span className="font-semibold">現場サウンド知識: </span>
                {question.soundContext}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              もう一度挑戦する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
