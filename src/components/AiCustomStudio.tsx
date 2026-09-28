'use client';

import React, { useState } from 'react';
import { Wand2, Send, Sparkles, PlusCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { CurriculumTopic, TrackType } from '@/types/learning';

interface AiCustomStudioProps {
  activeTrack: TrackType;
  onTopicAdded: (newTopic: CurriculumTopic) => void;
}

export default function AiCustomStudio({ activeTrack, onTopicAdded }: AiCustomStudioProps) {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sampleIdeas = activeTrack === 'csharp' ? [
    'MIDIノート番号(60=C4)から周波数(440Hz等)を計算する初歩',
    'サウンドのフェードアウト処理（タイマーと線形補間 Lerp）の初歩',
    'UnityのAudioSourceのピッチをランダムに変えて連射音の機械感を消す処理',
    'BGMのクロスフェード切替の基礎設計',
  ] : [
    'ステレオ音声の左右パンニング（Pan）計算の超基礎',
    'ホワイトノイズ（乱数ジェネレータ）を生成してバッファを埋める初歩',
    'デシベル(dB)とリニア振幅(0.0〜1.0)の相互変換の計算',
    '1ポールのシンプルなローパスフィルター（LPF）の仕組み',
  ];

  const handleGenerate = async (targetPrompt?: string) => {
    const text = targetPrompt || promptInput;
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/gemini/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: text,
          track: activeTrack,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onTopicAdded(json.data);
        setSuccessMessage(`✨ 新レッスン「${json.data.title}」がブラウザのカリキュラムに即座に追加されました！`);
        setPromptInput('');
      }
    } catch (err) {
      console.error('Failed to customize:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-xl flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Browser Live Customizer
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Geminiにブラウザを直接改造・レッスン生成してもらう
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            「もっとこういう初歩を学びたい」「この機能のクイズを作って」と伝えるだけで、Geminiがその場でブラウザに新しいレッスンを追加します。
          </p>
        </div>
      </div>

      {/* クイックプロンプト候補 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>ワンタップで頼めるリクエスト例:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleIdeas.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerate(idea)}
              disabled={isGenerating}
              className="text-xs bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-700 text-slate-300 py-1.5 px-3 rounded-lg transition-all text-left disabled:opacity-50"
            >
              + {idea}
            </button>
          ))}
        </div>
      </div>

      {/* 自由入力フォーム */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-300">
          自由リクエスト（学んでみたい初歩・作りたいクイズ・知りたいサウンドプログラミング）:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="例: Unityで走る・歩くスピードに合わせて足音の間隔（インターバル）を伸縮させる計算の初歩レッスンを作って"
            rows={3}
            className="flex-1 bg-slate-950 text-xs md:text-sm text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handleGenerate()}
            disabled={!promptInput.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs md:text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Geminiがレッスンをブラウザに構築中...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ブラウザに直接追加する</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 生成成功トースト */}
      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl p-4 flex items-center gap-3 text-xs md:text-sm text-emerald-300 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1">{successMessage}</div>
          <span className="text-[11px] text-slate-400">「カリキュラム」タブで確認できます</span>
        </div>
      )}
    </div>
  );
}
