'use client';

import React, { useState } from 'react';
import { Bug, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { TrackType } from '@/types/learning';

interface BugScenario {
  id: string;
  track: TrackType;
  title: string;
  problemDescription: string;
  symptom: string; // 現場での症状（例: 音声が10秒ごとにプチッと途切れる）
  code: string;
  options: {
    id: string;
    line: string;
    reason: string;
    isBug: boolean;
  }[];
  fixExplanation: string;
}

const BUG_SCENARIOS: BugScenario[] = [
  {
    id: 'bug-cs-gc',
    track: 'csharp',
    title: '【Unity】発火通知での毎フレームアロケーション',
    problemDescription: '敵キャラクターが足音を鳴らすスクリプト。しばらくプレイしていると定期的に全体のフレームレートが落ち、同時にオーディオにプチノイズが走る。',
    symptom: '定期的なGCスパイクによるオーディオバッファのアンダーラン',
    code: `void Update() {
    if (isMoving) {
        // 歩行音のパラメータ設定
        string cueName = "Footstep_" + surfaceType.ToString(); // [A]
        PlaySound(cueName);
    }
}`,
    options: [
      {
        id: 'opt-a',
        line: '[A] string cueName = "Footstep_" + surfaceType.ToString();',
        reason: '毎フレームの文字列連結(+)とToString()により、ヒープ上に新しいstringオブジェクトが大量生成されGCスパイクを引き起こしている。',
        isBug: true,
      },
      {
        id: 'opt-b',
        line: 'if (isMoving)',
        reason: 'bool型の評価でスタック処理されるため問題ない。',
        isBug: false,
      },
      {
        id: 'opt-c',
        line: 'PlaySound(cueName);',
        reason: '関数呼び出し自体はヒープ確保を行わない。',
        isBug: false,
      },
    ],
    fixExplanation: '文字列（string）の動的結合はヒープメモリを確保します。サウンドキューは `int soundCueId` や事前にハッシュ化したID（例: `int cueId = Animator.StringToHash("Footstep_Concrete")`）で管理し、GCアロケーションをゼロに抑えるのが鉄則です。',
  },
  {
    id: 'bug-cpp-lock',
    track: 'cpp',
    title: '【VST/DSP】オーディオコールバック内での排他ロック',
    problemDescription: '自作VSTプラグインの音量メータをUIに表示するため、オーディオ処理スレッドでmutexロックを取得したところ、DAW全体の再生が不安定になりクラッシュする。',
    symptom: '優先度逆転（Priority Inversion）によるリアルタイムデッドロック',
    code: `void ProcessAudioBlock(float* buffer, int numSamples) {
    std::lock_guard<std::mutex> lock(audioMutex); // [A]
    for (int i = 0; i < numSamples; ++i) {
        peakVolume = std::max(peakVolume, fabsf(buffer[i])); // [B]
    }
}`,
    options: [
      {
        id: 'opt-a',
        line: '[A] std::lock_guard<std::mutex> lock(audioMutex);',
        reason: 'オーディオスレッド（高優先度）がUIスレッド（低優先度）のロック解放待ちになり、オーディオコールバックの締め切りを破綻させている。',
        isBug: true,
      },
      {
        id: 'opt-b',
        line: '[B] peakVolume = std::max(...)',
        reason: '演算自体は高速であり直接のハング原因ではない。',
        isBug: false,
      },
    ],
    fixExplanation: 'オーディオスレッドでミューテックスのロックを取得してはなりません。UIスレッドとのデータ共有には、`std::atomic<float>` やロックフリーリングバッファ（Lock-Free Ring Buffer）を使用します。',
  },
];

interface BugHuntViewProps {
  activeTrack: TrackType;
}

export default function BugHuntView({ activeTrack }: BugHuntViewProps) {
  const filtered = BUG_SCENARIOS.filter((s) => s.track === activeTrack);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const scenario = filtered[selectedScenarioIndex] || BUG_SCENARIOS[0];

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedOptionId(id);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setSelectedScenarioIndex((prev) => (prev + 1) % filtered.length);
  };

  const selectedOpt = scenario.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-xl flex flex-col gap-6">
      {/* タイトル */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Sound Dev Bug Hunting Mode
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{scenario.title}</h3>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
          問 {selectedScenarioIndex + 1} / {filtered.length}
        </span>
      </div>

      {/* 現場の症状 */}
      <div className="bg-slate-950/80 border border-rose-900/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-rose-300">現場で発生している現象・症状:</div>
          <div className="text-sm text-slate-200 mt-1">{scenario.problemDescription}</div>
          <div className="text-xs text-rose-400/90 mt-1.5 font-mono">【診断症状】: {scenario.symptom}</div>
        </div>
      </div>

      {/* コード */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
        <div className="text-xs text-slate-500 mb-2 font-mono">問題のコード:</div>
        <pre className="text-xs md:text-sm text-emerald-400 font-mono leading-relaxed overflow-x-auto">
          {scenario.code}
        </pre>
      </div>

      {/* 選択肢（どこが原因か） */}
      <div className="flex flex-col gap-2.5">
        <div className="text-xs font-bold text-slate-400">
          この不具合を引き起こしている根本原因（行）を選択してください:
        </div>
        {scenario.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-200 hover:border-slate-700';

          if (isAnswered) {
            if (opt.isBug) {
              btnStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-medium';
            } else if (isSelected) {
              btnStyle = 'bg-rose-950/70 border-rose-600 text-rose-200';
            } else {
              btnStyle = 'bg-slate-950/20 border-slate-900 text-slate-600';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isAnswered}
              className={`p-3.5 rounded-lg border text-left text-xs md:text-sm font-mono transition-all flex flex-col gap-1 ${btnStyle}`}
            >
              <div className="font-bold">{opt.line}</div>
              {isAnswered && (
                <div className="text-xs text-slate-300 font-sans mt-1">{opt.reason}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* 解答後の現場フィックス解説 */}
      {isAnswered && selectedOpt && (
        <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
          selectedOpt.isBug ? 'bg-emerald-950/30 border-emerald-800' : 'bg-rose-950/30 border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {selectedOpt.isBug ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                <CheckCircle className="w-5 h-5" /> バグを特定しました！ナイスデバッグ！
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-400">
                <AlertTriangle className="w-5 h-5" /> そこは原因ではありません。
              </span>
            )}
          </div>

          <div className="bg-slate-950/70 rounded-lg p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">現場での恒久対策: </span>
              {scenario.fixExplanation}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-all"
            >
              次のバグシナリオへ進む →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
