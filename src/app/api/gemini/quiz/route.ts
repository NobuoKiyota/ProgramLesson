import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';
import { generateProceduralQuiz } from '@/lib/proceduralQuiz';

export async function POST(req: Request) {
  let geminiErrorMessage = '';
  let activeKey = '';

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
    activeKey = (userApiKey || process.env.GEMINI_API_KEY || '').trim();

    if (activeKey) {
      // 複数のモデル名をフォールバック試行
      const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
      const client = new GoogleGenerativeAI(activeKey);

      for (const modelName of modelNames) {
        try {
          const model = client.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.9,
            }
          });

          const prompt = `
あなたはゲームサウンド・オーディオDSPプログラミングの世界的権威であり、プログラミング教育者です。
生徒のために、現場（Unity, CRI ADX, Cubase, VST3, Native Instruments）で実際に直面する完全に新しい実践クイズを1問生成してください。

設定条件:
- 対象言語: ${targetTrack === 'csharp' ? 'C#' : 'C++'}
- カテゴリ/テーマ: ${topicTitle || targetCat}
- 難易度: ${targetDiff === 'beginner' ? '超初歩〜基礎（変数・条件分岐・ループ・型・配列・メソッドなど）' : '中級〜実践（ポインタ・リアルタイムセーフティ・GCスパイク・リングバッファなど）'}
- ランダムシード: ${Math.random()}

【重要】毎回完全に異なるバリエーションで出題してください。
単なる数値の違いではなく、実際のコードシチュエーション（音量フェード、BGM切り替え、足音マテリアル判定、ピーク検出、ボイスプール管理、MIDI周波数計算など）を豊かに盛り込んでください。

以下のJSONフォーマットのみを出力してください:
{
  "id": "gemini-${Date.now()}-${Math.floor(Math.random() * 1000)}",
  "track": "${targetTrack}",
  "category": "${targetCat}",
  "difficulty": "${targetDiff}",
  "type": "choice",
  "title": "魅力的な問題タイトル（例: 【AI生成】○○の現場コード読解）",
  "question": "実践的なシチュエーションを含む問題文",
  "codeSnippet": "// 必要なら簡潔なコードスニペット（不要なら空文字）",
  "options": [
    {
      "id": "opt1",
      "text": "正解の選択肢",
      "isCorrect": true,
      "explanation": "なぜこれが正しいかの詳しい解説"
    },
    {
      "id": "opt2",
      "text": "間違いの選択肢1",
      "isCorrect": false,
      "explanation": "現場でどういうバグ（音飛びやクラッシュ）に繋がるか"
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

          // JSONパース
          const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleanText) as QuizQuestion;

          return NextResponse.json({
            success: true,
            data: parsed,
            source: 'gemini',
            model: modelName
          });
        } catch (mErr: unknown) {
          const err = mErr as Error;
          geminiErrorMessage = `${modelName} error: ${err.message || String(err)}`;
          console.warn(geminiErrorMessage);
          // 次のモデルを試行
        }
      }
    } else {
      geminiErrorMessage = 'APIキーが設定されていません。画面右上の「🔑 AIキー設定」からGemini APIキーを入力してください。';
    }

    // Gemini呼び出しができなかった場合
    const proceduralQuiz = generateProceduralQuiz(targetTrack, targetCat, targetDiff);
    return NextResponse.json({
      success: true,
      data: proceduralQuiz,
      source: 'procedural_fallback',
      warning: geminiErrorMessage || 'Gemini APIキーが無効か未設定のため動的フォールバックが適用されました。'
    });

  } catch (error: unknown) {
    const err = error as Error;
    const fallback = generateProceduralQuiz('csharp', 'C# 基礎', 'beginner');
    return NextResponse.json({
      success: true,
      data: fallback,
      source: 'error_fallback',
      error: err.message
    });
  }
}
