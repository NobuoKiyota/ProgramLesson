# 【ウォークスルー】C# / C++ サウンド自立学習Webアプリ (AudioDev Academy)

Unity、CRI、Cubase、Native Instrumentsなどのプラグイン改造や低遅延DSPプログラミングを「AIに頼らず自力で理解・実装・デバッグできる」ようにするための適応型学習Webアプリケーションです。

---

## 1. 最新改善: Gemini API 実行ステータスとエラー原因の完全可視化

### ① 改善の背景
「数値が違うくらいでクイズが刷新されない」現象は、VercelやブラウザからのGemini API呼び出しが何らかの理由（キー形式、モデル名、JSON構文など）で失敗した際、内部のテンプレート生成（proceduralQuiz）へ無言で落ちていたことが原因でした。

### ② 今回実装した対策
1. **Gemini APIステータスの常時表示**:
   - 画面上に **「✨ Gemini AI 実稼働中」**（本物のGeminiが出力した完全オリジナル問題）または **「⚙️ プロシージャル動的生成」** のバッジを表示。
2. **Gemini API エラー警告バナーの設置**:
   - 万が一APIキーが無効、または呼び出しエラーになった場合、画面上に **「⚠️ Gemini API 通信情報: [具体的なエラー内容]」** をはっきりと黄色バナーで表示。なぜGeminiが動かなかったのかが一目で分かります。
3. **モデルの多重フォールバック**:
   - `gemini-1.5-flash`、`gemini-1.5-pro`、`gemini-2.0-flash` を自動で切り替えて生成を試行。

---

## 2. 公開サイトURL

いつでも外出先からスマホやPCでアクセス可能です:

👉 **[https://program-lesson.vercel.app](https://program-lesson.vercel.app)**
