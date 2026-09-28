import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// ランダムフォールバック用の多彩な問題プール（APIキー未設定時やオフライン用）
const FALLBACK_QUIZZES: QuizQuestion[] = [
  {
    id: 'fb-cs-1',
    track: 'csharp',
    category: 'C# Basics',
    difficulty: 'beginner',
    type: 'choice',
    title: '【AI生成】オーディオフェード時間の計算',
    question: 'BGMを2.5秒かけてフェードアウトさせたいとき、毎フレームの音量減少量（deltaTime / fadeDuration）を計算する変数型として正しいものはどれですか？',
    options: [
      {
        id: 'o1',
        text: 'float (例: float step = Time.deltaTime / 2.5f;)',
        isCorrect: true,
        explanation: '正解！毎フレームの細かな音量変化（0.016秒単位など）は微小な小数になるため、float型が必須です。'
      },
      {
        id: 'o2',
        text: 'int (例: int step = (int)(Time.deltaTime / 2.5f);)',
        isCorrect: false,
        explanation: 'intにキャストすると 0 に丸められてしまい、音量が一切フェードしなくなります。'
      }
    ],
    soundContext: 'BGMのスムーズな音量フェードイン・フェードアウトの基本'
  },
  {
    id: 'fb-cs-2',
    track: 'csharp',
    category: 'Memory & GC',
    difficulty: 'intermediate',
    type: 'choice',
    title: '【AI生成】UnityのコルーチンとGCアロケーション',
    question: 'Unityで音量フェードを行うコルーチンにおいて、最もGCゴミを発生させない `yield` の書き方はどれですか？',
    codeSnippet: `IEnumerator FadeVolume() {
    while (volume > 0.0f) {
        volume -= 0.05f;
        // どの yield の書き方が最もGCゼロに近いか？
        [ ??? ]
    }
}`,
    options: [
      {
        id: 'o1',
        text: 'yield return null; （毎フレーム待機でオブジェクトをnewしない）',
        isCorrect: true,
        explanation: '正解！yield return null はGCアロケーションをほぼ起こさずに次フレームを待機できます。'
      },
      {
        id: 'o2',
        text: 'yield return new WaitForSeconds(0.01f); （毎回newする）',
        isCorrect: false,
        explanation: 'whileループ内で毎回 new WaitForSeconds を書くと、膨大なGCゴミが生まれて音飛びの原因になります。'
      }
    ],
    soundContext: 'サウンドフェードコルーチンの定番パフォーマンスチューニング'
  },
  {
    id: 'fb-cpp-1',
    track: 'cpp',
    category: 'Pointers & Buffers',
    difficulty: 'beginner',
    type: 'choice',
    title: '【AI生成】ステレオ音声の右チャンネル消音処理',
    question: 'インターリーブステレオ配列 `float* buffer`（[L, R, L, R...]）において、「右チャンネル(R)のみ」をすべて0.0f（無音）にする正しいループはどれですか？',
    options: [
      {
        id: 'o1',
        text: 'for (int i = 1; i < totalSamples; i += 2) { buffer[i] = 0.0f; }',
        isCorrect: true,
        explanation: '正解！右チャンネルは奇数インデックス（1, 3, 5...）に配置されているため、i=1から2個飛ばしで処理します。'
      },
      {
        id: 'o2',
        text: 'for (int i = 0; i < totalSamples; i += 2) { buffer[i] = 0.0f; }',
        isCorrect: false,
        explanation: 'これは偶数インデックス（0, 2, 4...）なので左チャンネル(L)をミュートしてしまいます。'
      }
    ],
    soundContext: 'DAWやオーディオプラグインでのチャンネルルーティング'
  },
  {
    id: 'fb-cpp-2',
    track: 'cpp',
    category: 'Realtime & Thread Safety',
    difficulty: 'intermediate',
    type: 'choice',
    title: '【AI生成】オーディオコールバックでのファイル書き込み',
    question: '自作VSTプラグインのデバッグのため、`processBlock()` 内で `std::ofstream` を使って波形データを毎フレームファイル出力したところ、ノイズが発生しました。原因は何ですか？',
    options: [
      {
        id: 'o1',
        text: 'ディスクI/O（ファイル書き込み）がOSのブロッキング処理であり、オーディオバッファの締め切り時間を超過したため',
        isCorrect: true,
        explanation: '正解！HDDやSSDへの書き込みはOS待ち（ブロック）が発生するため、リアルタイムオーディオスレッドでは絶対にやってはいけません。'
      },
      {
        id: 'o2',
        text: 'C++のファイルストリームは float 型を書き込めないから',
        isCorrect: false,
        explanation: '書き込み自体は文法上可能ですが、リアルタイム遅延がNGの理由です。'
      }
    ],
    soundContext: 'DAWプラグイン開発のログ・データ保存の基本作法'
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { track, category, difficulty, topicTitle } = body as {
      track: TrackType;
      category?: string;
      difficulty?: DifficultyLevel;
      topicTitle?: string;
    };

    const targetTrack = track || 'csharp';
    const targetDiff = difficulty || 'beginner';
    const targetCat = category || (targetTrack === 'csharp' ? 'C# Basics' : 'C++ Basics');

    const randomSeed = Math.random();

    // Gemini APIが利用可能な場合
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
あなたはゲームサウンド・オーディオDSPプログラミングの教育者です。
毎回違う新鮮なクイズを1問、JSON形式で動的に自動生成してください。

設定条件:
- 対象言語: ${targetTrack === 'csharp' ? 'C# (Unity / CRI / サウンドマネージャ)' : 'C++ (VST3 / Cubase / DSP / リアルタイムバッファ)'}
- カテゴリ/テーマ: ${topicTitle || targetCat}
- 難易度: ${targetDiff === 'beginner' ? '超初歩〜基礎（変数・条件分岐・ループ・型・バッファアクセス等）' : '中級〜実践（ポインタ・リアルタイム性・GCスパイク・リングバッファ・P/Invoke等）'}
- ランダムシード: ${randomSeed} (毎回異なる現場シチュエーションを出題してください)

問題にはサウンド開発者（Cubase, Unity, CRI ADX, Native Instruments等）が「なるほど！」と実務に役立つ具体例を含めてください。

必ず以下のJSONフォーマットのみを出力してください（Markdownコードブロックなし、生JSONテキストのみ）:
{
  "id": "gen-${Date.now()}",
  "track": "${targetTrack}",
  "category": "${targetCat}",
  "difficulty": "${targetDiff}",
  "type": "choice",
  "title": "問題のタイトル（例: 【AI生成】○○に関する問題）",
  "question": "実践的なシチュエーションを含む問題文",
  "codeSnippet": "// 必要であれば短く簡潔なコード例（不要なら省略）",
  "options": [
    {
      "id": "opt1",
      "text": "正解の選択肢",
      "isCorrect": true,
      "explanation": "なぜこれが正しいかの分かりやすい解説"
    },
    {
      "id": "opt2",
      "text": "間違いの選択肢1",
      "isCorrect": false,
      "explanation": "なぜ間違いなのか、現場でどういうバグに繋がるか"
    },
    {
      "id": "opt3",
      "text": "間違いの選択肢2",
      "isCorrect": false,
      "explanation": "なぜ間違いなのかの解説"
    }
  ],
  "soundContext": "サウンド開発現場での実用ワンポイント豆知識"
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as QuizQuestion;
        return NextResponse.json({ success: true, data: parsed });
      }
    }

    // フォールバック（ランダムに1問抽出してユニークID付与）
    const matched = FALLBACK_QUIZZES.filter((q) => q.track === targetTrack);
    const chosen = matched[Math.floor(Math.random() * matched.length)] || FALLBACK_QUIZZES[0];
    const randomized = {
      ...chosen,
      id: `gen-fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    return NextResponse.json({ success: true, data: randomized });
  } catch (error) {
    console.error('Quiz generate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate quiz' }, { status: 500 });
  }
}
