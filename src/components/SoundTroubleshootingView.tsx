'use client';

import React, { useState } from 'react';
import { SOUND_MANAGER_MODULES } from '@/data/soundManagerDeepDive';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Volume2, 
  Cpu, 
  Headphones, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function SoundTroubleshootingView() {
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const currentMod = SOUND_MANAGER_MODULES[selectedQuizIndex];
  const currentAnswer = userAnswers[selectedQuizIndex];
  const isAnswered = currentAnswer !== undefined;

  const handleSelect = (optionIdx: number) => {
    setUserAnswers({
      ...userAnswers,
      [selectedQuizIndex]: optionIdx,
    });
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([qIdx, optIdx]) => SOUND_MANAGER_MODULES[Number(qIdx)].quiz.options[optIdx]?.isCorrect
  ).length;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1.5 w-fit mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> 現場実戦トラブルシューティング
            </span>
            <h2 className="text-xl font-black text-white">
              Sound.cs 現場で起きるリアルなバグ & 対策 10本特訓
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Unityのオーディオ再生現場で実際に多発する「謎の高ピッチ再生」「OGGのプチノイズ」「音量競合バグ」などの原因とSound.csの解決策をテストします。
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] font-bold text-slate-400">正解数</div>
              <div className="text-lg font-black text-emerald-400">
                {correctCount} <span className="text-xs text-slate-500 font-normal">/ {SOUND_MANAGER_MODULES.length} 問中</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400">解答進捗</div>
              <div className="text-lg font-black text-cyan-400">
                {answeredCount} <span className="text-xs text-slate-500 font-normal">/ {SOUND_MANAGER_MODULES.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 問題ナビゲーションボタン */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SOUND_MANAGER_MODULES.map((m, idx) => {
          const ans = userAnswers[idx];
          const hasAnswered = ans !== undefined;
          const isCorrect = hasAnswered && m.quiz.options[ans]?.isCorrect;
          const isSelected = idx === selectedQuizIndex;

          return (
            <button
              key={m.id}
              onClick={() => setSelectedQuizIndex(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-cyan-600 border-cyan-500 text-white shadow-md'
                  : hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/60 border-red-800 text-red-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>第{idx + 1}問</span>
              {hasAnswered && (
                isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* クイズ本体カード */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="text-xs font-mono font-bold text-cyan-400">
            問題 {selectedQuizIndex + 1} / {SOUND_MANAGER_MODULES.length} : {currentMod.title} ({currentMod.lines})
          </div>
          <span className="text-xs text-slate-400 font-medium">難易度: 実務現場級</span>
        </div>

        {/* トラブル現場の状況説明 */}
        <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">【現場で起きたトラブルのシチュエーション】</span>
            {currentMod.quiz.soundContext}
          </div>
        </div>

        {/* 設問 */}
        <div className="text-base font-bold text-white leading-relaxed">
          Q. {currentMod.quiz.question}
        </div>

        {/* 選択肢リスト */}
        <div className="space-y-3">
          {currentMod.quiz.options.map((option, optIdx) => {
            const isUserPick = currentAnswer === optIdx;
            let cardStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

            if (isAnswered) {
              if (option.isCorrect) {
                cardStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isUserPick && !option.isCorrect) {
                cardStyle = 'bg-red-950/60 border-red-600 text-red-200 ring-1 ring-red-500';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3 ${cardStyle}`}
              >
                <span className="font-bold shrink-0 mt-0.5 font-mono text-cyan-400">
                  {String.fromCharCode(65 + optIdx)}.
                </span>
                <span className="flex-1">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* 解答後の解説 */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">設計者・エンジニア視点での解説</span>
            </div>

            {currentMod.quiz.options.map((opt, optIdx) => {
              if (opt.isCorrect || currentAnswer === optIdx) {
                return (
                  <div
                    key={optIdx}
                    className={`p-4 rounded-xl text-xs space-y-1.5 leading-relaxed ${
                      opt.isCorrect
                        ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                        : 'bg-red-950/40 border border-red-800/60 text-red-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2 text-sm">
                      {opt.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          正解: {String.fromCharCode(65 + optIdx)}
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          不正解の理由: {String.fromCharCode(65 + optIdx)}
                        </>
                      )}
                    </div>
                    <p>{opt.explanation}</p>
                  </div>
                );
              }
              return null;
            })}

            {/* 次の問題ボタン */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const copy = { ...userAnswers };
                  delete copy[selectedQuizIndex];
                  setUserAnswers(copy);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> この問題をやり直す
              </button>

              {selectedQuizIndex < SOUND_MANAGER_MODULES.length - 1 && (
                <button
                  onClick={() => setSelectedQuizIndex(selectedQuizIndex + 1)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  次の問題へ進む <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
