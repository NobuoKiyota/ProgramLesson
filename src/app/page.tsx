'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import SoundCsPortal from '@/components/SoundCsPortal';
import SoundArchitectureOverview from '@/components/SoundArchitectureOverview';
import SoundTroubleshootingView from '@/components/SoundTroubleshootingView';
import AudioRunner from '@/components/AudioRunner';
import QuizCard from '@/components/QuizCard';
import { INITIAL_CURRICULUM } from '@/data/curriculum';
import { SOUND_MANAGER_MODULES } from '@/data/soundManagerDeepDive';
import { BookOpen, Headphones, ChevronDown, ChevronRight, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sound-modules');
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // 従来のカリキュラム閲覧用ステート
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(INITIAL_CURRICULUM[0]?.id || null);

  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('sound_cs_completed_modules');
      if (savedCompleted) {
        setCompletedModules(JSON.parse(savedCompleted));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* ナビゲーションバー */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedCount={completedModules.length}
        totalModules={SOUND_MANAGER_MODULES.length}
      />

      {/* メインコンテンツ領域 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 mb-16 md:mb-6">
        {/* タブ 1: Sound.cs 10大モジュール解読 */}
        {activeTab === 'sound-modules' && (
          <SoundCsPortal />
        )}

        {/* タブ 2: 全体設計図 & 音響数学 */}
        {activeTab === 'architecture' && (
          <SoundArchitectureOverview />
        )}

        {/* タブ 3: 現場トラブル特訓 */}
        {activeTab === 'troubleshooting' && (
          <SoundTroubleshootingView />
        )}

        {/* タブ 4: WebAudio 音出し演習 */}
        {activeTab === 'audio-runner' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" /> WebAudio 実践テストベンチ
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                WebAudio リアルタイム音響・フィルタ・エンベロープ実験室
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Sound.cs で行われている音響パラメータ（ゲイン乗算、対数ピッチベンド、フィルター、エンベロープ）の挙動をブラウザ上で実際に鳴らして耳で確かめることができます。
              </p>
            </div>
            <AudioRunner 
              exercise={
                INITIAL_CURRICULUM.find(t => t.audioExercise)?.audioExercise || {
                  id: 'exercise-orthogonal-gain',
                  track: 'csharp',
                  title: 'Sound.cs 直交ゲイン乗算実験',
                  description: 'Master, Category, Duck, Level, Pause の独立乗算を適用し、波形を出力してみよう',
                  soundGoal: '複数の音量要素が互いを上書きすることなく正しく合成されることを確認する',
                  initialCode: `// Sound.cs の直交独立音量パイプライン
const baseVolume = 0.8;
const categoryVolume = 0.9;
const duckMultiplier = 0.5; // ダッキング時
const levelGain = 1.0;
const pauseGain = 1.0;

const finalVolume = baseVolume * categoryVolume * duckMultiplier * levelGain * pauseGain;

// 440Hz サイン波に適用
for (let i = 0; i < buffer.length; i++) {
  const t = i / sampleRate;
  buffer[i] = Math.sin(2 * Math.PI * 440 * t) * finalVolume;
}
`,
                  dspType: 'sine'
                }
              }
            />
          </div>
        )}

        {/* タブ 5: 基礎カリキュラム（アーカイブ） */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> C# / C++ 音響プログラミング基礎
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                汎用 C# / C++ オーディオ開発トピック集
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                メモリモデル、ポインタ走査、SIMD、マルチスレッドなど、ゲーム音響プログラミングの基礎項目を復習できます。
              </p>
            </div>

            <div className="space-y-3">
              {INITIAL_CURRICULUM.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                          {topic.track.toUpperCase()}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{topic.title}</div>
                          <div className="text-xs text-slate-400">{topic.summary}</div>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                            <span className="font-bold text-cyan-400 block mb-1">🎧 サウンドデザイナー視点</span>
                            <p className="text-slate-300 leading-relaxed">{topic.soundDesignerPerspective}</p>
                          </div>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                            <span className="font-bold text-emerald-400 block mb-1">⚡ プログラマ・技術視点</span>
                            <p className="text-slate-300 leading-relaxed">{topic.keyConcepts?.[0]?.description || topic.summary}</p>
                          </div>
                        </div>

                        {topic.quizzes && topic.quizzes.length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-slate-300 mb-2">演習クイズ</h4>
                            <QuizCard
                              question={topic.quizzes[0]}
                              onAnswered={() => {}}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-slate-400">AudioDev Academy - Sound.cs Edition</span>
          </div>
          <div>
            CTSoundManager2 (Sound.cs 2,069 lines) Deep Dive & Architecture Reference
          </div>
        </div>
      </footer>
    </div>
  );
}
