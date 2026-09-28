import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';
import { generateProceduralQuiz } from '@/lib/proceduralQuiz';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { track, category, difficulty, topicTitle, userApiKey } = body as {
      track: TrackType;
      category?: string;
      difficulty?: DifficultyLevel;
      topicTitle?: string;
      userApiKey?: string;
    };

    const targetTrack = track || 'csharp';
    const targetDiff = difficulty || 'beginner';
    const targetCat = category || (targetTrack === 'csharp' ? 'C# 基礎' : 'C++ 基礎');

    // 優先順位: ユーザーがブラウザで入力したAPIキー > サーバーの環境変数
    const activeKey = userApiKey || process.env.GEMINI_API_KEY || '';

    if (activeKey) {
      try {
        const client = new GoogleGenerativeAI(activeKey);
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const randomSeed = Math.random();

        const prompt = `
あなたはゲームサウンド・オーディオDSPプログラミングの教育者です。
生徒のために、毎回完全に新しくユニークなクイズを1問、JSON形式で動的に自動生成してください。

設定条件:
- 対象言語: ${targetTrack === 'csharp' ? 'C# (Unity / CRI / サウンドマネージャ)' : 'C++ (VST3 / Cubase / DSP / リアルタイムバッファ)'}
- カテゴリ/テーマ: ${topicTitle || targetCat}
- 難易度: ${targetDiff === 'beginner' ? '超初歩〜基礎（変数・条件分岐・ループ・型・バッファアクセス等）' : '中級〜実践（ポインタ・リアルタイム性・GCスパイク・リングバッファ・P/Invoke等）'}
- ランダムシード: ${randomSeed} (必ず以前の問題と被らない、全く新しい現場シチュエーション・コード例・数値を考案してください)

問題文にはサウンド開発者（Cubase, Unity, CRI ADX, Native Instruments等）が現場で直面する具体例を含めてください。

必ず以下のJSONフォーマットのみを出力してください（Markdownコードブロックなし、生JSONテキストのみ）:
{
  "id": "gen-${Date.now()}-${Math.floor(Math.random() * 1000)}",
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
      } catch (geminiErr) {
        console.error('Gemini call failed, falling back to procedural generator:', geminiErr);
      }
    }

    // キー未設定時、またはAPIエラー時は動的プロシージャルジェネレータで毎回新しい問題を生成！
    const proceduralQuiz = generateProceduralQuiz(targetTrack, targetCat, targetDiff);
    return NextResponse.json({ success: true, data: proceduralQuiz });

  } catch (error) {
    console.error('Quiz generate error:', error);
    const fallback = generateProceduralQuiz('csharp', 'C# 基礎', 'beginner');
    return NextResponse.json({ success: true, data: fallback });
  }
}
