import { GoogleGenerativeAI } from '@google/generative-ai';
import { DailyResumeData, QuizQuestion, TrackType } from '@/types/learning';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generatePersonalizedResume(
  track: TrackType,
  weakCategories: string[],
  streakDays: number,
  scoreSummary: string
): Promise<DailyResumeData> {
  const todayStr = new Date().toLocaleDateString('ja-JP');

  // APIキーがない場合のフォールバック（オフライン・初期起動時用）
  const fallbackData: DailyResumeData = {
    date: todayStr,
    title: track === 'csharp' ? '本日の5分集中: C# GCアロケーション撲滅と構造体の活用' : '本日の5分集中: C++ ポインタ演算とバッファ境界チェック',
    focusPoint: weakCategories.length > 0 ? weakCategories[0] : (track === 'csharp' ? 'Memory & GC' : 'Pointers & Buffers'),
    reason: weakCategories.length > 0 
      ? `前回の学習で「${weakCategories.join('、')}」の正答率が低下していたため、最優先で復習します。`
      : '連続学習の基本リズムを掴むため、オーディオ現場で最も事故が起きやすい基本概念を復習します。',
    briefExplanation: track === 'csharp'
      ? '【要点】UnityオーディオでUpdate()や発音コールバック内で new を行うと、ヒープ領域にゴミが溜まり世代別GC（Mark & Sweep）が発動。ミリ秒単位のCPU停止が発生し、DAWやゲームの音飛び（プチノイズ）に直結します。構造体（struct）とオブジェクトプールを徹底しましょう。'
      : '【要点】VSTやオーディオエンジンにおける float* buffer は連続したサンプルデータの先頭アドレスです。ステレオの場合は [L0, R0, L1, R1, ...] のインターリーブ形式が多いため、ポインタの進め方 (p += 2) を誤ると左右チャンネルの音量破壊や配列外参照クラッシュを引き起こします。',
    drillQuestions: [
      track === 'csharp' ? {
        id: `daily-cs-${Date.now()}`,
        track: 'csharp',
        category: 'Memory & GC',
        difficulty: 'intermediate',
        type: 'choice',
        title: '【Geminiデイリー特訓】発音マネージャーの最適化',
        question: 'SE再生完了時にコールバックを受け取る設計として、最もGCアロケーションを発生させないアプローチはどれですか？',
        options: [
          {
            id: 'o1',
            text: 'staticなイベントハンドラ、または事前確保されたインタフェース参照を再利用する',
            isCorrect: true,
            explanation: '正解！毎回の無名関数（ラムダ式）やAction newを避け、静的ハンドラやプールされた購読者を使うことでゼロアロケーションが維持されます。'
          },
          {
            id: 'o2',
            text: '毎回 `new Action(() => { ... })` を引数に渡す',
            isCorrect: false,
            explanation: 'ラムダやnew Actionは毎回ヒープにクロージャオブジェクトを確保するためGCゴミになります。'
          }
        ],
        soundContext: 'CRI ADXの再生終了イベント通知で必須の知識'
      } : {
        id: `daily-cpp-${Date.now()}`,
        track: 'cpp',
        category: 'Pointers & Buffers',
        difficulty: 'intermediate',
        type: 'choice',
        title: '【Geminiデイリー特訓】ポインタ走査とバウンズ',
        question: 'float* outBuffer に対し、480サンプルのフレームを処理する際、最も安全なループ条件はどれですか？',
        options: [
          {
            id: 'o1',
            text: 'float* end = outBuffer + 480; while (outBuffer < end) { *outBuffer++ = 0.0f; }',
            isCorrect: true,
            explanation: '正解！終端アドレスを固定し、アドレス比較でループさせるイディオムはポインタ走査で安全かつ最適化されやすい書き方です。'
          },
          {
            id: 'o2',
            text: 'while (*outBuffer != 0.0f) { *outBuffer++ = 0.0f; }',
            isCorrect: false,
            explanation: 'オーディオバッファは0.0fで終端されるわけではないため、メモリ外を突き抜けてアクセス違反クラッシュを引き起こします。'
          }
        ],
        soundContext: 'VST3 processBlock() 内のブロック処理の安全確保'
      }
    ],
    quickChallenge: track === 'csharp' 
      ? '今日の挑戦: AudioSourceの再生スクリプトで、すべてのローカル変数がスタック上で完結しているか確認してみよう！'
      : '今日の挑戦: float* buffer のアドレスを (uintptr_t) で数値として捉え、1サンプル4バイト進む感覚をイメージしてみよう！'
  };

  if (!genAI) {
    return fallbackData;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
あなたはゲームサウンド・オーディオDSPプログラミングの世界的権威であり、親身なパーソナルトレーナーです。
生徒は「C# / C++ をAIに頼らず自力で深く理解し、UnityやCRI、Cubase/VST、Native Instrumentsのプラグイン改造・開発をマスターしたい」と考えています。

生徒の現在の状況:
- 選択言語: ${track === 'csharp' ? 'C# (Unity / サウンドマネージャ / PInvoke)' : 'C++ (VST / DSP / リアルタイムセーフティ)'}
- 弱点・苦手分野: ${weakCategories.join(', ') || '特になし（基礎強化中）'}
- 連続学習日数: ${streakDays}日
- 最近の成績概要: ${scoreSummary}

この生徒に向けた「本日の5分集中レジュメ」と「確認ドリル問題1問」をJSON形式で生成してください。
現場で即座に役立つ実践的な内容にしてください。

必ず以下のJSONフォーマットのみを返してください（コードブロックなしでJSON生テキストのみ）:
{
  "date": "${todayStr}",
  "title": "タイトル（例: 本日の5分集中: ○○）",
  "focusPoint": "重点トピック名",
  "reason": "なぜ今日これを取り上げたかの理由（生徒の苦手や継続状況に触れる）",
  "briefExplanation": "1分で読める本質的な解説（サウンド現場での具体例を含む）",
  "drillQuestions": [
    {
      "id": "gemini-drill-1",
      "track": "${track}",
      "category": "カテゴリ名",
      "difficulty": "intermediate",
      "type": "choice",
      "title": "問題タイトル",
      "question": "問題文",
      "codeSnippet": "// 必要であればコード例",
      "options": [
        {
          "id": "opt1",
          "text": "選択肢1（正解）",
          "isCorrect": true,
          "explanation": "なぜこれが正しいかの解説"
        },
        {
          "id": "opt2",
          "text": "選択肢2（誤答）",
          "isCorrect": false,
          "explanation": "なぜこれが誤りかの解説"
        }
      ],
      "soundContext": "サウンド開発における文脈"
    }
  ],
  "quickChallenge": "今日意識してほしい1行アクション"
}
`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // JSON文字列の抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as DailyResumeData;
    }
    return fallbackData;
  } catch (err) {
    console.error('Gemini generation error, using fallback:', err);
    return fallbackData;
  }
}
