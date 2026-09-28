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
  category: string; // e.g. "GC & Memory", "Pointers & Buffers", "Unity Audio", "VST / DSP"
  difficulty: DifficultyLevel;
  type: QuizType;
  title: string;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
  soundContext?: string; // e.g. "CRI ADXのボイスプールでのメモリ枯渇を防ぐ理由"
}

export interface AudioExercise {
  id: string;
  track: TrackType;
  title: string;
  description: string;
  soundGoal: string; // e.g. "440Hzのサイン波を生成し、音割れを防ぐソフトサチュレーションを実装する"
  initialCode: string;
  solutionSnippet?: string;
  dspType: 'sine' | 'gain_clip' | 'panning' | 'ring_buffer' | 'delay';
}

export interface CurriculumTopic {
  id: string;
  track: TrackType;
  title: string;
  subtitle: string;
  iconName: string;
  category: string;
  summary: string;
  soundDesignerPerspective: string; // なぜサウンド開発者にとって重要なのか
  keyConcepts: {
    name: string;
    description: string;
    badPattern?: string;
    goodPattern?: string;
  }[];
  quizzes: QuizQuestion[];
  audioExercise?: AudioExercise;
}

export interface UserProgress {
  completedTopics: string[]; // topic IDs
  scoreByTopic: Record<string, { correct: number; total: number }>;
  weakCategories: string[];
  streakDays: number;
  lastStudiedDate: string;
  customDailyResume?: DailyResumeData;
}

export interface DailyResumeData {
  date: string;
  title: string;
  focusPoint: string;
  reason: string; // e.g. "ポインタ演算での配列外参照のミスが多いため、本日はバッファ境界チェックを復習"
  briefExplanation: string;
  drillQuestions: QuizQuestion[];
  quickChallenge?: string;
}
