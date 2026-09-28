'use client';

import React from 'react';
import { 
  Layers, 
  Cpu, 
  Headphones, 
  ArrowRight, 
  Sliders, 
  Volume2, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Repeat
} from 'lucide-react';

export default function SoundArchitectureOverview() {
  return (
    <div className="space-y-6">
      {/* イントロヘッダー */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Sound.cs 2,069行 全体設計図
          </span>
        </div>
        <h2 className="text-xl font-black text-white">
          ゼロアロケーション & CRI思想 Unity Audio Engine 設計相関図
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Sound.cs は、Unity標準の `AudioSource.Play()` やサードパーティライブラリ（DOTween）に依存せず、
          60fps/120fpsのゲームループ内で一切のGCゴミを出さずに sample-accurate なイントロループ、
          完全独立なゲイン乗算、世代トークンによる安全な非同期操作を実現するハイエンド設計です。
        </p>
      </div>

      {/* アーキテクチャ・フロー図 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ステップ 1: 再生リクエスト & API境界 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> STEP 1: 要求受付
            </div>
            <h3 className="font-bold text-white text-sm">PlayRequest & 世代トークン</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              呼び出し側には不透明な <code className="text-cyan-300">SoundPlayback</code> 構造体（ID + generation）を返却。
              生の AudioSource や配列インデックスを隠蔽し、別音停止事故（Ghost Stop）を100%防止。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            Sound.PlaySE() / PlayBGM()
          </div>
        </div>

        {/* ステップ 2: 2段階ボイススティーリング */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> STEP 2: ボイス確保
            </div>
            <h3 className="font-bold text-white text-sm">GetFreeVoice (2-Stage Steal)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              プール枯渇時、まず「フェードアウト停止中」のボイスを優先奪取。
              それでも無ければ、カテゴリ内で最古のボイス（reservedOrder最小）を即時奪取し、発音欠落を防止。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            VoiceEndReason.Stolen
          </div>
        </div>

        {/* ステップ 3: ゼロアロケ再生 & ドップラー回避 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-amber-400 font-bold mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> STEP 3: 再生初期化
            </div>
            <h3 className="font-bold text-white text-sm">PlayCore & 座標確定</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Unityの超重要バグ対策：<code className="text-amber-300">src.Play()</code> の前に座標を設定することで、
              プール退避位置からの瞬間移動をドップラー効果が超音速移動と誤認してピッチが跳ね上がるのを防御。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            Doppler Pitch-Spike Fix
          </div>
        </div>

        {/* ステップ 4: 毎フレーム独立更新エンジン */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-purple-400 font-bold mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> STEP 4: ランタイム更新
            </div>
            <h3 className="font-bold text-white text-sm">LoopPoints & Gain Ramp</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              サブフレーム剰余計算でOGGイントロループのプチノイズを消滅。
              DOTweenを使わず、直交する5層の音量（Master, Category, Duck, Level, Pause）を毎フレーム一括乗算更新。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            over % len サンプル精度
          </div>
        </div>
      </div>

      {/* 音響数学と直交乗算モデルの解説 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          音響数学モデル: 直交独立ゲインパイプライン (Orthogonal Gain Model)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          多くのゲームプロジェクトで発生する「BGMフェードアウト中にポーズしたら、ポーズ解除後にフェードが狂って爆音になった」
          「ダッキング中にSE音量をスライダーで変更したらダッキング値が上書きされた」という不具合は、ゲイン変数を1つに統合していることが原因です。
          Sound.cs は完全独立な直交乗算モデルを採用しています。
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-cyan-300">
          <code>
            {`finalVolume = baseVolume 
            * categoryVolume 
            * duckMultiplier 
            * levelGain 
            * pauseGain 
            * (fadeMultiplier);`}
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">1. 各レイヤーの独立性</span>
            ダッキング処理は `duckMultiplier` だけを変更し、フェード処理は `fade` だけを変更するため、互いに干渉・上書きしません。
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">2. レベル遷移 (levelGain)</span>
            ゲームのシーン遷移や昼夜変化によるアンビエンス音量変化も独立スライダーとして安全に補間されます。
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">3. ポーズ復帰の音飛び防止</span>
            ポーズ時は `pauseGain` を 0 に落とすだけなので、フェードやダッキングのタイマー進行と競合しません。
          </div>
        </div>
      </div>

      {/* サンプル精度イントロループの原理 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Repeat className="w-4 h-4 text-emerald-400" />
          DAW書き出しとUnity圧縮の罠: OGG Vorbis サンプル比率自動スケーリング
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          CubaseなどのDAWでイントロループ（Aメロ→サビ→サビ頭にループ）を作った際、WAVからOGG VorbisやMP3に変換すると、
          エンコーダの仕様上、先頭や末尾に「数千サンプルの無音パディング」が挿入され、全体サンプル数が変動します。
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-white">自動比率スケーリングの計算式 (Sound.cs L69-L88):</div>
          <div className="font-mono text-xs text-emerald-400">
            float ratio = (float)clip.samples / (float)referenceTotalSamples;<br />
            int actualStart = Mathf.RoundToInt(baseStartSample * ratio);<br />
            int actualEnd = Mathf.RoundToInt(baseEndSample * ratio);
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
            Cubase上で設計した参照サンプル数（例: 768,000 samples）と、インポート後の実クリップサンプル数の比率（ratio）を取り、
            ループ開始・終了位置を自動スケール。これにより、再圧縮や圧縮品質変更があっても、耳で聴いて全くズレない完全同期ループを維持します。
          </p>
        </div>
      </div>
    </div>
  );
}
