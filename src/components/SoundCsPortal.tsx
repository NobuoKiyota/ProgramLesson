'use client';

import React, { useState, useEffect } from 'react';
import { 
  SOUND_MANAGER_MODULES, 
  SoundManagerModule, 
  CodeLineExplanation 
} from '@/data/soundManagerDeepDive';
import { 
  BookOpen, 
  Code2, 
  Headphones, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Sliders, 
  Volume2, 
  RotateCcw,
  Check,
  Compass
} from 'lucide-react';

export default function SoundCsPortal() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(SOUND_MANAGER_MODULES[0].id);
  const [selectedExplanationIndex, setSelectedExplanationIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, { selectedOption: number; isSubmitted: boolean }>>({});

  // LocalStorageから進捗を復元
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('sound_cs_completed_modules');
      if (savedCompleted) {
        setCompletedModules(JSON.parse(savedCompleted));
      }
      const savedQuiz = localStorage.getItem('sound_cs_quiz_answers');
      if (savedQuiz) {
        setQuizAnswers(JSON.parse(savedQuiz));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleModuleCompleted = (modId: string) => {
    let updated: string[];
    if (completedModules.includes(modId)) {
      updated = completedModules.filter(id => id !== modId);
    } else {
      updated = [...completedModules, modId];
    }
    setCompletedModules(updated);
    try {
      localStorage.setItem('sound_cs_completed_modules', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectQuizOption = (modId: string, optionIndex: number) => {
    const updated = {
      ...quizAnswers,
      [modId]: { selectedOption: optionIndex, isSubmitted: true }
    };
    setQuizAnswers(updated);
    try {
      localStorage.setItem('sound_cs_quiz_answers', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const currentModule = SOUND_MANAGER_MODULES.find(m => m.id === selectedModuleId) || SOUND_MANAGER_MODULES[0];
  const currentExplanation: CodeLineExplanation | undefined = currentModule.explanations[selectedExplanationIndex] || currentModule.explanations[0];

  // 検索フィルター
  const filteredModules = SOUND_MANAGER_MODULES.filter(mod => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = mod.title.toLowerCase().includes(query);
    const matchSummary = mod.summary.toLowerCase().includes(query);
    const matchCode = mod.codeSnippets.toLowerCase().includes(query);
    const matchExplanations = mod.explanations.some(e => 
      e.title.toLowerCase().includes(query) ||
      e.codeSnippet.toLowerCase().includes(query) ||
      e.soundDesignerPerspective.toLowerCase().includes(query) ||
      e.programmerPerspective.toLowerCase().includes(query)
    );
    return matchTitle || matchSummary || matchCode || matchExplanations;
  });

  const currentQuizState = quizAnswers[currentModule.id];

  return (
    <div className="space-y-6">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Unity 2,069行 本番サウンドマネージャー解読
              </span>
              <span className="text-xs text-slate-400">Sound.cs (CTSoundManager2)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Sound.cs 完全理解ポータル
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Cubaseでの音源制作意図から、Unityのオーディオ内部仕様・ゼロアロケーション（GC根絶）・ドップラーピッチバグ回避・CRIライクな世代トークン管理まで、1行ごとの真意を完全分解・習得します。
            </p>
          </div>

          {/* 進捗バッジ */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl shrink-0">
            <div>
              <div className="text-[11px] font-bold text-slate-400">習得モジュール</div>
              <div className="text-xl font-black text-cyan-400">
                {completedModules.length} <span className="text-xs text-slate-500 font-normal">/ {SOUND_MANAGER_MODULES.length} 完了</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center relative">
              <span className="text-xs font-bold text-slate-200">
                {Math.round((completedModules.length / SOUND_MANAGER_MODULES.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 検索・シンボルジャンプバー */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="関数・シンボル検索（例: PlayCore, RampPitch, LoopPointSettings, GetFreeVoice, generation, Doppler）"
              className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                クリア
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
            <span className="shrink-0 text-slate-500">クイックジャンプ:</span>
            {['PlayCore', 'LoopPointSettings', 'GetFreeVoice', 'RampPitch', 'VoiceEndReason'].map(keyword => (
              <button
                key={keyword}
                onClick={() => setSearchQuery(keyword)}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-300 transition-all shrink-0 font-mono text-[10px]"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインレイアウト: 左ナビ(10モジュール) + 右コンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側: モジュール一覧 */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 mb-2">
            <span>アーキテクチャ 10大モジュール</span>
            <span>{filteredModules.length} 件</span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredModules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isDone = completedModules.includes(mod.id);
              const quizDone = !!quizAnswers[mod.id]?.isSubmitted;

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setSelectedExplanationIndex(0);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? 'bg-slate-850 bg-cyan-950/30 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                        {mod.lines}
                      </span>
                      {isDone && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> 読了
                        </span>
                      )}
                      {quizDone && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-bold">
                          <HelpCircle className="w-3 h-3" /> クイズ済
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-bold text-sm text-white mt-1.5 line-clamp-1">
                    {mod.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {mod.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右側: 選択中モジュールの詳細解剖ビュー */}
        <div className="lg:col-span-8 space-y-6">
          {/* モジュールヘッダーカード */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                    該当行: {currentModule.lines}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{currentModule.subtitle}</span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">
                  {currentModule.title}
                </h2>
              </div>

              {/* 読了ボタン */}
              <button
                onClick={() => toggleModuleCompleted(currentModule.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  completedModules.includes(currentModule.id)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {completedModules.includes(currentModule.id) ? '習得済 (クリックで解除)' : 'このモジュールを習得済みにする'}
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentModule.summary}
            </p>

            {/* キーテイクアウェイ */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                設計の要点・得られるスキル
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {currentModule.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* コードスニペット表示 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-300">Sound.cs ({currentModule.lines})</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">C# / Unity Audio Engine</span>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed max-h-72 bg-slate-950/90">
              <code>{currentModule.codeSnippets}</code>
            </pre>
          </div>

          {/* 行別ディープ解説セレクター & カード */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                行別ディープ解説（クリックで切り替え）
              </h3>
              <span className="text-xs text-slate-400">
                {selectedExplanationIndex + 1} / {currentModule.explanations.length} 項目
              </span>
            </div>

            {/* 行セレクタータブ */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currentModule.explanations.map((exp, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExplanationIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all ${
                    idx === selectedExplanationIndex
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {exp.lineRange}: {exp.title}
                </button>
              ))}
            </div>

            {/* 選択された行の3重詳細解説カード */}
            {currentExplanation && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
                    <span>{currentExplanation.lineRange}</span>
                    <span>•</span>
                    <span className="text-white font-bold">{currentExplanation.title}</span>
                  </div>
                  {/* コードフォーカス */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <code>{currentExplanation.codeSnippet}</code>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 🎧 サウンドデザイナー視点 */}
                  <div className="bg-slate-950/70 border border-cyan-900/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                      <Headphones className="w-4 h-4" />
                      🎧 サウンドデザイナー視点 (DAW/演出/耳の感覚)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplanation.soundDesignerPerspective}
                    </p>
                  </div>

                  {/* ⚡ プログラマ & メモリ視点 */}
                  <div className="bg-slate-950/70 border border-emerald-900/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                      ⚡ プログラマ・メモリ視点 (GC/省メモリ/実行速度)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentExplanation.programmerPerspective}
                    </p>
                  </div>
                </div>

                {/* 🔍 深層解説 */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    深層メカニズム解説
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentExplanation.deepExplanation}
                  </p>
                </div>

                {/* ⚠️ 現場の落とし穴 (あれば表示) */}
                {currentExplanation.pitfallWarning && (
                  <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      ⚠️ 現場でハマる危険な落とし穴
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {currentExplanation.pitfallWarning}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 実践クイズ・トラブルシューティング */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  現場実戦クイズ: {currentModule.title}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">音響現場で直面するリアルなトラブル</span>
            </div>

            <div className="text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 p-3 rounded-xl font-medium">
              💡 {currentModule.quiz.soundContext}
            </div>

            <div className="font-bold text-sm text-white leading-relaxed">
              Q. {currentModule.quiz.question}
            </div>

            {/* 選択肢 */}
            <div className="space-y-2">
              {currentModule.quiz.options.map((option, optIdx) => {
                const isSelected = currentQuizState?.selectedOption === optIdx;
                const isSubmitted = currentQuizState?.isSubmitted;
                let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

                if (isSubmitted) {
                  if (option.isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle = 'bg-red-950/60 border-red-600 text-red-200 ring-1 ring-red-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuizOption(currentModule.id, optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* 解答後の解説表示 */}
            {currentQuizState?.isSubmitted && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                {currentModule.quiz.options.map((opt, idx) => {
                  if (opt.isCorrect || currentQuizState.selectedOption === idx) {
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          opt.isCorrect
                            ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                            : 'bg-red-950/40 border border-red-800/60 text-red-200'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {opt.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              正解！ {String.fromCharCode(65 + idx)} の解説
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                              不正解... {String.fromCharCode(65 + idx)} がNGな理由
                            </>
                          )}
                        </div>
                        <p className="leading-relaxed opacity-90">{opt.explanation}</p>
                      </div>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => {
                    const updated = { ...quizAnswers };
                    delete updated[currentModule.id];
                    setQuizAnswers(updated);
                    localStorage.setItem('sound_cs_quiz_answers', JSON.stringify(updated));
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> もう一度挑戦する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
