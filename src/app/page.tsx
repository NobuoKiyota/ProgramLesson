'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import DailyResume from '@/components/DailyResume';
import QuizCard from '@/components/QuizCard';
import AudioRunner from '@/components/AudioRunner';
import BugHuntView from '@/components/BugHuntView';
import AiCustomStudio from '@/components/AiCustomStudio';
import EndlessQuizView from '@/components/EndlessQuizView';
import ProgressDashboard from '@/components/ProgressDashboard';
import ApiKeyModal from '@/components/ApiKeyModal';
import { INITIAL_CURRICULUM } from '@/data/curriculum';
import { TrackType, DailyResumeData, CurriculumTopic, LevelFilter, QuizQuestion, TopicStats } from '@/types/learning';
import { BookOpen, Headphones, ChevronDown, ChevronRight, Award, CheckCircle2, Sparkles, Wand2, Dices, Plus, RotateCw, HelpCircle, Layers, Key } from 'lucide-react';

export default function Home() {
  const [activeTrack, setActiveTrack] = useState<TrackType>('csharp');
  const [activeTab, setActiveTab] = useState<ActiveTab>('resume');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [streakDays, setStreakDays] = useState(3);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // 学習進捗ステート（トピックIDごとの詳細記録）
  const [topicStats, setTopicStats] = useState<Record<string, TopicStats>>({});
  const [customTopics, setCustomTopics] = useState<CurriculumTopic[]>([]);
  const [activeQuizzes, setActiveQuizzes] = useState<Record<string, QuizQuestion>>({});
  const [refreshingTopicId, setRefreshingTopicId] = useState<string | null>(null);

  const [weakCategories, setWeakCategories] = useState<string[]>([]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  // 初期デイリーレジュメデータ
  const [currentResume, setCurrentResume] = useState<DailyResumeData>({
    date: new Date().toLocaleDateString('ja-JP'),
    title: activeTrack === 'csharp' 
      ? '本日の5分集中: C# float音量とゼロアロケーションの掟' 
      : '本日の5分集中: C++ ポインタ走査とリアルタイムオーディオの掟',
    focusPoint: activeTrack === 'csharp' ? 'C# 基礎' : 'Pointers & Buffers',
    reason: 'オーディオ再生中に最も恐ろしい音飛び（プチノイズ）の根本原因となるメモリ領域の概念を復習します。',
    briefExplanation: activeTrack === 'csharp'
      ? '小数の音量を扱うときは float 型（0.8f）を使います。またUnityで毎フレーム new を呼ぶとGCスパイクが発生して音飛びの原因になるため、struct やオブジェクトプールでゼロアロケーションを徹底しましょう。'
      : 'float* buffer はDAWから渡される波形メモリアドレスです。ステレオの場合は [L, R, L, R...] と並んでいるため、Lチャンネルのみの処理ではポインタを2サンプルずつ進める（p += 2）必要があります。',
    drillQuestions: [],
    quickChallenge: '今日の挑戦: 書いたコードがヒープにアロケーションしていないか（GCゴミを出していないか）意識しよう！'
  });

  // 初期カリキュラム + ユーザーがGeminiに作らせたカスタムトピック
  const allTopics = [...INITIAL_CURRICULUM, ...customTopics];
  const trackCurriculum = allTopics.filter((t) => t.track === activeTrack);

  // 難易度によるフィルタリング
  const currentCurriculum = trackCurriculum.filter((t) => {
    if (levelFilter === 'all') return true;
    if (levelFilter === 'beginner') {
      return t.category.includes('基礎') || t.quizzes.some((q) => q.difficulty === 'beginner');
    }
    if (levelFilter === 'intermediate') {
      return !t.category.includes('基礎') || t.quizzes.some((q) => q.difficulty === 'intermediate');
    }
    return true;
  });

  const currentAudioExercise = currentCurriculum.find((t) => t.audioExercise)?.audioExercise;

  // ローカルストレージからのロード
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('audio_dev_topic_stats');
      if (savedStats) setTopicStats(JSON.parse(savedStats));

      const savedWeak = localStorage.getItem('audio_dev_weak_categories');
      if (savedWeak) setWeakCategories(JSON.parse(savedWeak));

      const savedCustom = localStorage.getItem('audio_dev_custom_topics');
      if (savedCustom) setCustomTopics(JSON.parse(savedCustom));

      const savedApiKey = localStorage.getItem('audio_dev_gemini_api_key');
      if (savedApiKey) setUserApiKey(savedApiKey);
    } catch {
      // ignore
    }
    if (trackCurriculum.length > 0) {
      setExpandedTopicId(trackCurriculum[0].id);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    try {
      if (key) {
        localStorage.setItem('audio_dev_gemini_api_key', key);
      } else {
        localStorage.removeItem('audio_dev_gemini_api_key');
      }
    } catch {
      // ignore
    }
  };

  // トラック切り替え時
  useEffect(() => {
    const list = allTopics.filter((t) => t.track === activeTrack);
    if (list.length > 0) {
      setExpandedTopicId(list[0].id);
    }
  }, [activeTrack]);

  // クイズ回答時の進捗更新
  const handleAnswered = (isCorrect: boolean, category: string, topicId: string) => {
    setTopicStats((prev) => {
      const current = prev[topicId] || { answered: 0, correct: 0, refreshedCount: 0, completed: false };
      const updated: TopicStats = {
        ...current,
        answered: current.answered + 1,
        correct: isCorrect ? current.correct + 1 : current.correct,
        completed: current.completed || isCorrect,
      };
      const newMap = { ...prev, [topicId]: updated };
      try {
        localStorage.setItem('audio_dev_topic_stats', JSON.stringify(newMap));
      } catch {
        // ignore
      }
      return newMap;
    });

    if (!isCorrect && !weakCategories.includes(category)) {
      const nextWeak = [...weakCategories, category];
      setWeakCategories(nextWeak);
      try {
        localStorage.setItem('audio_dev_weak_categories', JSON.stringify(nextWeak));
      } catch {
        // ignore
      }
    }
  };

  // トピック完了の切り替え
  const toggleTopicComplete = (topicId: string) => {
    setTopicStats((prev) => {
      const current = prev[topicId] || { answered: 0, correct: 0, refreshedCount: 0, completed: false };
      const updated = { ...current, completed: !current.completed };
      const newMap = { ...prev, [topicId]: updated };
      try {
        localStorage.setItem('audio_dev_topic_stats', JSON.stringify(newMap));
      } catch {
        // ignore
      }
      return newMap;
    });
  };

  // クイズ刷新（Geminiで別問に差し替え）
  const handleRefreshQuiz = async (topic: CurriculumTopic) => {
    setRefreshingTopicId(topic.id);
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: topic.track,
          category: topic.category,
          difficulty: topic.quizzes[0]?.difficulty || 'beginner',
          topicTitle: topic.title,
          userApiKey: userApiKey || undefined,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        // 表示中のクイズを刷新
        setActiveQuizzes((prev) => ({
          ...prev,
          [topic.id]: json.data,
        }));

        // 刷新回数をインクリメント
        setTopicStats((prev) => {
          const current = prev[topic.id] || { answered: 0, correct: 0, refreshedCount: 0, completed: false };
          const updated = { ...current, refreshedCount: current.refreshedCount + 1 };
          const newMap = { ...prev, [topic.id]: updated };
          try {
            localStorage.setItem('audio_dev_topic_stats', JSON.stringify(newMap));
          } catch {
            // ignore
          }
          return newMap;
        });
      }
    } catch (err) {
      console.error('Failed to refresh quiz:', err);
    } finally {
      setRefreshingTopicId(null);
    }
  };

  // AIカスタムトピックが追加されたときのハンドラ
  const handleTopicAdded = (newTopic: CurriculumTopic) => {
    const updated = [newTopic, ...customTopics];
    setCustomTopics(updated);
    try {
      localStorage.setItem('audio_dev_custom_topics', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setExpandedTopicId(newTopic.id);
  };

  // Gemini API によるレジュメ再生成
  const handleRefreshResume = async () => {
    setIsLoadingResume(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: activeTrack,
          weakCategories,
          streakDays,
          scoreSummary: `クリアトピック数: ${Object.values(topicStats).filter(s => s.completed).length}`,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentResume(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch resume:', err);
    } finally {
      setIsLoadingResume(false);
    }
  };

  const completedCount = trackCurriculum.filter((t) => topicStats[t.id]?.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-12 text-slate-100 flex flex-col">
      <Navbar
        activeTrack={activeTrack}
        onTrackChange={setActiveTrack}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        streakDays={streakDays}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={!!userApiKey}
      />

      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        {/* 全トラック共通: 進捗ダッシュボード */}
        <ProgressDashboard
          totalTopics={trackCurriculum.length}
          completedCount={completedCount}
          topicStats={topicStats}
          streakDays={streakDays}
        />

        {/* デイリーレジュメ タブ */}
        {activeTab === 'resume' && (
          <div className="flex flex-col gap-6">
            <DailyResume
              initialResume={currentResume}
              track={activeTrack}
              weakCategories={weakCategories}
              streakDays={streakDays}
              onRefreshResume={handleRefreshResume}
              isLoading={isLoadingResume}
            />

            {/* 今日の音出しクイック演習 */}
            {currentAudioExercise && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Headphones className="w-5 h-5 text-cyan-400" />
                  <span>今日のクイック音響コードチャレンジ（実際に鳴らしてみる）</span>
                </div>
                <AudioRunner exercise={currentAudioExercise} />
              </div>
            )}
          </div>
        )}

        {/* カリキュラム学習 タブ */}
        {activeTab === 'curriculum' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {activeTrack === 'csharp' ? 'C# 超初級〜初中級 50トピック完全カリキュラム' : 'C++ VST / DSP 低レイヤ カリキュラム'}
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                  Unity、CRI、Cubase、VSTプラグインの現場で直面する本質的な知識を自力で習得
                </p>
              </div>

              {/* 難易度フィルター & AI作成ボタン */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                  <button
                    onClick={() => setLevelFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      levelFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    すべて ({trackCurriculum.length})
                  </button>
                  <button
                    onClick={() => setLevelFilter('beginner')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      levelFilter === 'beginner' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌱 超初歩・基礎
                  </button>
                  <button
                    onClick={() => setLevelFilter('intermediate')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      levelFilter === 'intermediate' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🚀 実践・中級
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab('ai-studio')}
                  className="bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-300 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>AIに新レッスンを頼む</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {currentCurriculum.map((topic, index) => {
                const isExpanded = expandedTopicId === topic.id;
                const stats = topicStats[topic.id] || { answered: 0, correct: 0, refreshedCount: 0, completed: false };
                const isCompleted = stats.completed;
                const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : null;
                const displayQuiz = activeQuizzes[topic.id] || topic.quizzes[0];

                return (
                  <div
                    key={topic.id}
                    className={`bg-slate-900/90 border rounded-2xl overflow-hidden shadow-lg transition-all ${
                      isCompleted ? 'border-emerald-800/60' : 'border-slate-800'
                    }`}
                  >
                    {/* トピックヘッダー (クリックで開閉) */}
                    <div
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 select-none"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopicComplete(topic.id);
                          }}
                          className={`mt-0.5 p-1 rounded-lg border transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'border-slate-700 text-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {topic.phase && (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {topic.phase}
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                              {topic.category}
                            </span>
                            {accuracy !== null && (
                              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-semibold">
                                正答率 {accuracy}% ({stats.correct}/{stats.answered}問)
                              </span>
                            )}
                            {stats.refreshedCount > 0 && (
                              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                                刷新 {stats.refreshedCount}回
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                修了済
                              </span>
                            )}
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-white mt-1">
                            {topic.title}
                          </h3>
                          <div className="text-xs text-slate-400">{topic.subtitle}</div>
                        </div>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* 開いた中身 */}
                    {isExpanded && (
                      <div className="p-4 md:p-6 border-t border-slate-800/80 bg-slate-950/60 flex flex-col gap-6">
                        {/* 📖 サウンド用語ミニ辞典（初心者のための音響たとえ） */}
                        {topic.soundJargon && topic.soundJargon.length > 0 && (
                          <div className="bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-800/40 rounded-xl p-4 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                              <HelpCircle className="w-4 h-4 text-purple-400" />
                              <span>📖 サウンド用語ミニ辞典（音響機材でのたとえ）</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {topic.soundJargon.map((jargon, jIdx) => (
                                <div key={jIdx} className="bg-slate-950/80 border border-purple-900/30 rounded-lg p-3 flex flex-col gap-1">
                                  <div className="text-xs font-bold text-white flex items-center justify-between">
                                    <span>{jargon.term}</span>
                                    <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-1.5 py-0.5 rounded">
                                      機材の例え: {jargon.analogy}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-300 leading-relaxed mt-0.5">
                                    {jargon.explanation}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* なぜサウンド開発者にとって重要か */}
                        <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-4 flex items-start gap-3">
                          <Headphones className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-cyan-300">サウンドデザイナー・エンジニア目線での視点:</div>
                            <div className="text-xs md:text-sm text-slate-200 mt-1 leading-relaxed">
                              {topic.soundDesignerPerspective}
                            </div>
                          </div>
                        </div>

                        {/* 重要概念とGood/Badコード比較 */}
                        <div className="flex flex-col gap-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            🔑 本質理解: コード比較
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            {topic.keyConcepts.map((concept, idx) => (
                              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                                <div>
                                  <div className="text-sm font-bold text-white">{concept.name}</div>
                                  <div className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">
                                    {concept.description}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                                  {concept.badPattern && (
                                    <div className="bg-rose-950/20 border border-rose-900/50 rounded-lg p-3">
                                      <div className="text-[11px] font-bold text-rose-400 mb-1">❌ 避けるべき実装 (Bad)</div>
                                      <pre className="text-xs text-rose-300 font-mono overflow-x-auto leading-relaxed">
                                        {concept.badPattern}
                                      </pre>
                                    </div>
                                  )}
                                  {concept.goodPattern && (
                                    <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3">
                                      <div className="text-[11px] font-bold text-emerald-400 mb-1">⭕ 推奨される実装 (Good)</div>
                                      <pre className="text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                                        {concept.goodPattern}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* クイズセクション（刷新対応） */}
                        {displayQuiz && (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                📝 理解度チェッククイズ
                              </h4>
                              <button
                                onClick={() => handleRefreshQuiz(topic)}
                                disabled={refreshingTopicId === topic.id}
                                className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                              >
                                <RotateCw className={`w-3.5 h-3.5 ${refreshingTopicId === topic.id ? 'animate-spin' : ''}`} />
                                <span>{refreshingTopicId === topic.id ? 'Geminiが新問題を考案中...' : '🔄 クイズを刷新（別問に変更）'}</span>
                              </button>
                            </div>

                            <QuizCard
                              key={displayQuiz.id}
                              question={displayQuiz}
                              onAnswered={(isCorrect, cat) => handleAnswered(isCorrect, cat, topic.id)}
                              onRefreshQuiz={() => handleRefreshQuiz(topic)}
                              isRefreshing={refreshingTopicId === topic.id}
                            />
                          </div>
                        )}

                        {/* 音出し演習 */}
                        {topic.audioExercise && (
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                              🎛️ 音出し実技演習 (Audio Runner)
                            </h4>
                            <AudioRunner exercise={topic.audioExercise} />
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

        {/* AI無限出題特訓 タブ */}
        {activeTab === 'endless-quiz' && (
          <EndlessQuizView
            activeTrack={activeTrack}
            userApiKey={userApiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {/* 音出し演習 タブ */}
        {activeTab === 'audio-runner' && currentAudioExercise && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                リアルタイム音響コードランナー (Web Audio DSP)
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                ブラウザ上でアルゴリズムを実行し、実際に鳴る音とオシロスコープ波形を確認します。
              </p>
            </div>
            <AudioRunner exercise={currentAudioExercise} />
          </div>
        )}

        {/* バグ退治 タブ */}
        {activeTab === 'bug-hunt' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                現場バグ退治モード (Bug Hunting)
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                UnityのGCスパイクやオーディオスレッドのデッドロックなど、現場で多発する不具合の原因を特定する訓練。
              </p>
            </div>
            <BugHuntView activeTrack={activeTrack} />
          </div>
        )}

        {/* AI直接改造・新レッスン生成スタジオ タブ */}
        {activeTab === 'ai-studio' && (
          <AiCustomStudio
            activeTrack={activeTrack}
            onTopicAdded={handleTopicAdded}
          />
        )}
      </main>

      {/* Gemini APIキー設定モーダル */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={handleSaveApiKey}
        currentKey={userApiKey}
      />
    </div>
  );
}
