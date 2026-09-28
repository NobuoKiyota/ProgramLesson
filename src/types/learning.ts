export type TrackType = 'csharp' | 'cpp';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LevelFilter = 'all' | 'beginner' | 'intermediate';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export type QuizType = 'choice' | 'fill_in_the_blank' | 'bug_hunting' | 'why_concept';

export interface QuizQuestion {
  id: string;
  track: TrackType;
  category: string;
  difficulty: DifficultyLevel;
  type: QuizType;
  title: string;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
  soundContext?: string;
}

export interface AudioExercise {
  id: string;
  track: TrackType;
  title: string;
  description: string;
  soundGoal: string;
  initialCode: string;
  solutionSnippet?: string;
  dspType: 'sine' | 'gain_clip' | 'panning' | 'ring_buffer' | 'delay';
}

export interface SoundJargon {
  term: string; // 用語（例: メソッド, struct, インスタンス）
  analogy: string; // 音響・機材でのたとえ（例: エフェクターのつまみ/ボタン）
  explanation: string; // 直感的な解説
}

export interface CurriculumTopic {
  id: string;
  track: TrackType;
  phase?: string; // フェーズ名（例: フェーズ1: ゼロからの変数と基本計算）
  title: string;
  subtitle: string;
  iconName: string;
  category: string;
  summary: string;
  soundDesignerPerspective: string;
  soundJargon?: SoundJargon[]; // 用語解説
  keyConcepts: {
    name: string;
    description: string;
    badPattern?: string;
    goodPattern?: string;
  }[];
  quizzes: QuizQuestion[];
  audioExercise?: AudioExercise;
}

export interface TopicStats {
  answered: number; // 総回答数
  correct: number; // 正解数
  refreshedCount: number; // クイズを刷新した回数
  completed: boolean; // クリアフラグ
}

export interface UserProgress {
  completedTopics: string[];
  topicStats: Record<string, TopicStats>;
  weakCategories: string[];
  streakDays: number;
  lastStudiedDate: string;
  customDailyResume?: DailyResumeData;
}

export interface DailyResumeData {
  date: string;
  title: string;
  focusPoint: string;
  reason: string;
  briefExplanation: string;
  drillQuestions: QuizQuestion[];
  quickChallenge?: string;
}
