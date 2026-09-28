import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CurriculumTopic, TrackType } from '@/types/learning';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userPrompt, track } = body as { userPrompt: string; track: TrackType };

    if (!userPrompt || userPrompt.trim() === '') {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const topicId = `custom-${Date.now()}`;

    // オフラインまたはAPIキー未設定時のフォールバック生成
    const fallbackTopic: CurriculumTopic = {
      id: topicId,
      track: track,
      title: `【AI特製】${userPrompt.slice(0, 24)} の実践レッスン`,
      subtitle: 'あなたのリクエストに基づき生成されたカスタム学習モジュール',
      iconName: 'Wand2',
      category: 'AI Custom',
      summary: `リクエスト「${userPrompt}」に対する特別レッスンです。サウンド開発の実務で直面する要点とコード例をまとめました。`,
      soundDesignerPerspective: 'Cubase / Unity / CRI などの現場ワークフローにおいて、この概念をコードレベルで把握することで、音響バグの事前回避や自作ツールの開発がスムーズになります。',
      keyConcepts: [
        {
          name: '実践アプローチ',
          description: `「${userPrompt}」を実現するための基本的なコード設計です。メモリ効率とリアルタイム安全性を考慮しています。`,
          goodPattern: track === 'csharp'
            ? '// ゼロアロケーションでの安全なパラメータ処理\npublic void UpdateSoundParam(float value) {\n    currentParam = Math.Clamp(value, 0.0f, 1.0f);\n}'
            : '// ポインタによる安全なバッファ処理\nvoid ProcessCustom(float* buf, int len) {\n    for(int i=0; i<len; ++i) buf[i] *= 0.8f;\n}'
        }
      ],
      quizzes: [
        {
          id: `q-${topicId}`,
          track: track,
          category: 'AI Custom',
          difficulty: 'beginner',
          type: 'choice',
          title: `「${userPrompt.slice(0, 18)}」に関する理解度確認`,
          question: `このトピックを実装するにあたり、最も注意すべき現場のルールは何ですか？`,
          options: [
            {
              id: 'opt1',
              text: 'リアルタイム処理中に重い処理（ヒープ確保やI/O）を行わず、引数の範囲を安全に保つ',
              isCorrect: true,
              explanation: '正解！オーディオ処理ではパラメータ変更時もリアルタイムセーフティを守ることが最優先です。'
            },
            {
              id: 'opt2',
              text: '毎フレーム新しいインスタンスをnewして渡す',
              isCorrect: false,
              explanation: '毎フレームのnewはGCスパイクを引き起こし、音飛びの原因になります。'
            }
          ],
          soundContext: '自作プラグインやゲームオーディオ制御での鉄則'
        }
      ]
    };

    if (!genAI) {
      return NextResponse.json({ success: true, data: fallbackTopic });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
あなたはゲームサウンド・オーディオDSPプログラミングの教育者です。
ユーザーから「ブラウザ学習アプリに新しいレッスンやクイズを追加してほしい」というリクエストが届きました。

ユーザーのリクエスト: "${userPrompt}"
対象言語: ${track === 'csharp' ? 'C# (Unity / CRI / サウンドマネージャ)' : 'C++ (VST / DSP / オーディオバッファ)'}

ユーザーのリクエストにぴったり合わせた「新しい学習トピック（解説＋コード例＋クイズ1問）」をJSON形式で作成してください。
初心者でも分かりやすく、サウンドデザイナー・エンジニアが感動する実用的な内容にしてください。

必ず以下のJSONフォーマットのみを返してください（Markdownコードブロックなし、JSON生テキストのみ）:
{
  "id": "${topicId}",
  "track": "${track}",
  "title": "魅力的なレッスンタイトル（【超初歩】や【実践】などを含める）",
  "subtitle": "サブタイトル（何ができるようになるか）",
  "iconName": "Wand2",
  "category": "AI Custom",
  "summary": "レッスンの概要解説（2〜3文）",
  "soundDesignerPerspective": "なぜサウンドデザイナー／開発者がこれを知っておくべきなのか",
  "keyConcepts": [
    {
      "name": "キーコンセプト名",
      "description": "分かりやすい説明",
      "goodPattern": "推奨コード例",
      "badPattern": "避けるべきコード例"
    }
  ],
  "quizzes": [
    {
      "id": "q-${topicId}",
      "track": "${track}",
      "category": "AI Custom",
      "difficulty": "beginner",
      "type": "choice",
      "title": "クイズのタイトル",
      "question": "問題文",
      "codeSnippet": "// 必要ならコードスニペット",
      "options": [
        {
          "id": "opt1",
          "text": "正解の選択肢",
          "isCorrect": true,
          "explanation": "なぜこれが正しいかの解説"
        },
        {
          "id": "opt2",
          "text": "誤答の選択肢",
          "isCorrect": false,
          "explanation": "なぜこれが誤りかの解説"
        }
      ],
      "soundContext": "サウンド現場での関連知識"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const generated = JSON.parse(jsonMatch[0]) as CurriculumTopic;
      return NextResponse.json({ success: true, data: generated });
    }

    return NextResponse.json({ success: true, data: fallbackTopic });
  } catch (error) {
    console.error('Customize API Error:', error);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }
}
