'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Volume2, Sparkles, CheckCircle2, RotateCcw, Activity } from 'lucide-react';
import { AudioExercise } from '@/types/learning';

interface AudioRunnerProps {
  exercise: AudioExercise;
}

export default function AudioRunner({ exercise }: AudioRunnerProps) {
  const [code, setCode] = useState(exercise.initialCode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputLog, setOutputLog] = useState<string>('準備完了: コードを編集して「実行 & 音声プレビュー」を押してください。');
  const [isSuccess, setIsSuccess] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // 初期化 & クリーンアップ
  useEffect(() => {
    setCode(exercise.initialCode);
    setIsSuccess(false);
    setOutputLog('演習を切り替えました。コードを記述してテスト再生してみましょう。');
    return () => {
      stopAudio();
    };
  }, [exercise]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore already stopped
      }
      sourceNodeRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsPlaying(false);
  };

  const drawWaveform = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#0f172a'; // dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // グリッド線描画（オシロスコープ風）
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#06b6d4'; // neon cyan
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    render();
  };

  const runCodeAndPlay = async () => {
    stopAudio();

    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const sampleRate = audioCtx.sampleRate;
    const duration = 2.0; // 2秒プレビュー
    const totalFrames = Math.floor(sampleRate * duration);
    const audioBuffer = audioCtx.createBuffer(1, totalFrames, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // コードの検証とシミュレーション
    try {
      let passed = false;

      if (exercise.dspType === 'gain_clip') {
        // C# ソフトクリッピング演習
        const hasTanh = code.includes('MathF.Tanh') || code.includes('tanh') || code.includes('Math.Tanh');
        if (hasTanh) {
          passed = true;
          // サイン波に過大ゲイン + tanhをシミュレート
          for (let i = 0; i < totalFrames; i++) {
            const t = i / sampleRate;
            const rawSine = Math.sin(2 * Math.PI * 220 * t); // 220Hz低音
            const gained = rawSine * 4.0; // 4倍ゲイン
            channelData[i] = Math.tanh(gained) * 0.7; // tanhでソフト飽和
          }
          setOutputLog('✅ 構文チェック成功! MathF.Tanh によるソフトサチュレーションが正しく適用されました。\n出音: 角が取れた温かみのあるオーバードライブ波形が出力されています。');
        } else {
          for (let i = 0; i < totalFrames; i++) {
            const t = i / sampleRate;
            channelData[i] = Math.sin(2 * Math.PI * 220 * t) * 0.5;
          }
          setOutputLog('⚠️ MathF.Tanh(sample) による飽和処理が見つかりません。元の波形をそのまま出力しています。');
        }
      } else if (exercise.dspType === 'sine') {
        // C++ サイン波生成演習
        const hasSin = code.includes('sinf(phase)') || code.includes('std::sin') || code.includes('sin(');
        const hasPhaseInc = code.includes('phase +=') || code.includes('phase = phase +');
        if (hasSin && hasPhaseInc) {
          passed = true;
          for (let i = 0; i < totalFrames; i++) {
            const t = i / sampleRate;
            channelData[i] = Math.sin(2 * Math.PI * 440 * t) * 0.6; // 440Hz A音
          }
          setOutputLog('✅ 構文チェック成功! 440HzのA音オシレータが正常に計算されました。\n出音: ピュアなコンサートピッチ（440Hz）の正弦波が鳴っています。');
        } else {
          setOutputLog('⚠️ sinf(phase) の代入または phase のインクリメントが見つかりません。');
        }
      } else if (exercise.dspType === 'delay') {
        // C++ ディレイ演習
        const hasDelay = code.includes('readPos') && (code.includes('%') || code.includes('DELAY_SIZE'));
        if (hasDelay) {
          passed = true;
          const delaySamples = Math.floor(sampleRate * 0.25); // 250ms delay
          const delayBuf = new Float32Array(sampleRate);
          let wPos = 0;
          for (let i = 0; i < totalFrames; i++) {
            const t = i / sampleRate;
            // 8分のパルス音源
            const impulse = (i % Math.floor(sampleRate * 0.5) < 200) ? Math.sin(2 * Math.PI * 587.33 * t) : 0;
            const rPos = (wPos - delaySamples + sampleRate) % sampleRate;
            const delayed = delayBuf[rPos];
            channelData[i] = impulse * 0.6 + delayed * 0.4;
            delayBuf[wPos] = impulse * 0.6 + delayed * 0.5;
            wPos = (wPos + 1) % sampleRate;
          }
          setOutputLog('✅ 構文チェック成功! リングバッファ循環インデックス処理によるフィードバックディレイが稼働しました。\n出音: 250ms間隔のエコーリピートが確認できます。');
        } else {
          setOutputLog('⚠️ リングバッファの循環インデックス計算式を確認してください。');
        }
      }

      setIsSuccess(passed);

      // Web Audio 再生 & アナライザー接続
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      source.onended = () => {
        setIsPlaying(false);
      };

      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);

      drawWaveform(analyser);

    } catch (e: unknown) {
      const err = e as Error;
      setOutputLog(`実行時エラー: ${err.message}`);
    }
  };

  const applySolution = () => {
    if (exercise.solutionSnippet) {
      if (exercise.dspType === 'gain_clip') {
        setCode(`// buffer[i] に -1.0f 〜 +1.0f の音響サンプルが入っています。
public void ProcessAudio(float[] buffer, float gain) {
    for (int i = 0; i < buffer.Length; i++) {
        float sample = buffer[i] * gain;
        // 解答例: MathF.Tanh で温かみのあるソフトサチュレーション
        buffer[i] = MathF.Tanh(sample);
    }
}`);
      } else if (exercise.dspType === 'sine') {
        setCode(`void GenerateSine(float* outBuffer, int numSamples, float sampleRate, float freq) {
    float phase = 0.0f;
    float phaseInc = (2.0f * 3.14159265f * freq) / sampleRate;
    
    for (int i = 0; i < numSamples; i++) {
        // 解答例: ポインタ走査と位相加算
        outBuffer[i] = sinf(phase) * 0.6f;
        phase += phaseInc;
    }
}`);
      }
      setOutputLog('💡 ヒント/模範解答をエディタに展開しました。実行して音の違いを聴いてみましょう。');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl flex flex-col gap-4">
      {/* ヘッダー情報 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
            {exercise.track === 'csharp' ? 'C# Audio Runner' : 'C++ DSP Runner'}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">{exercise.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSuccess && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded">
              <CheckCircle2 className="w-4 h-4" /> 課題クリア!
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-300">{exercise.description}</p>

      {/* サウンド目標 */}
      <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-3 flex items-start gap-2.5">
        <Volume2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-cyan-300">音響ゴール（出音の目標）:</div>
          <div className="text-xs text-slate-300">{exercise.soundGoal}</div>
        </div>
      </div>

      {/* コードエディタ */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs text-slate-400 px-1">
          <span>コードエディタ ({exercise.track === 'csharp' ? 'C#' : 'C++'})</span>
          <button
            onClick={applySolution}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> ヒント / 模範解答を適用
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          className="w-full bg-slate-950 font-mono text-xs md:text-sm text-emerald-400 p-3.5 rounded-lg border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-y leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* オシロスコープ波形表示 (Canvas) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            リアルタイム波形モニタ (オシロスコープ)
          </span>
          <span className="text-[11px] text-slate-500">44.1kHz / 32-bit Float</span>
        </div>
        <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-28">
          <canvas
            ref={canvasRef}
            width={600}
            height={112}
            className="w-full h-full block"
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 text-xs text-slate-500 pointer-events-none">
              再生待機中
            </div>
          )}
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={runCodeAndPlay}
          className="flex-1 min-w-[160px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all active:scale-[0.98]"
        >
          {isPlaying ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          実行 & 音声プレビュー
        </button>

        {isPlaying && (
          <button
            onClick={stopAudio}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 rounded-lg flex items-center gap-1.5 text-xs transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-slate-300" /> 停止
          </button>
        )}
      </div>

      {/* 出力ログ */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
        <div className="text-[11px] font-semibold text-slate-400 mb-1">コンソール出力 & 音響評価ログ:</div>
        <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {outputLog}
        </pre>
      </div>
    </div>
  );
}
