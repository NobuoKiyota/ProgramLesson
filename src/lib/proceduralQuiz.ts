import { QuizQuestion, TrackType, DifficultyLevel } from '@/types/learning';

// 動的プロシージャルクイズジェネレータ
// Gemini APIキーがない場合でも、シチュエーション・数値・コード・変数名をランダム合成して
// 毎回異なるオリジナル問題を無尽蔵に作り出すエンジン

const SOUND_CUES = ['Laser_Shot', 'Explosion_Heavy', 'Footstep_Concrete', 'Footstep_Water', 'UI_Click', 'BGM_Boss', 'Ambient_Rain', 'Sword_Slash', 'Voice_Warning', 'Heartbeat'];
const VARIABLE_NAMES = ['masterVolume', 'trackGain', 'soundPitch', 'fadeDuration', 'peakVolume', 'attenuation', 'cutoffFreq', 'lfoRate'];
const CODE_SNIPPETS_CS = [
  {
    topic: 'float',
    generate: () => {
      const vName = VARIABLE_NAMES[Math.floor(Math.random() * VARIABLE_NAMES.length)];
      const val = (Math.floor(Math.random() * 8) + 1) / 10;
      return {
        title: `【動的生成】${vName} の小数リテラル定義`,
        question: `Unityのオーディオ設定で、変数 \`${vName}\` に音量 ${val} を正しく代入しているC#コードはどれですか？`,
        codeSnippet: `// 音量パラメータの初期化\n[ ??? ]`,
        options: [
          { id: 'o1', text: `float ${vName} = ${val}f;`, isCorrect: true, explanation: `正解！小数の末尾に f を付けることで float 型として認識されます。` },
          { id: 'o2', text: `float ${vName} = ${val};`, isCorrect: false, explanation: `f が抜けていると double 型とみなされ、代入エラーになります。` },
          { id: 'o3', text: `int ${vName} = ${val}f;`, isCorrect: false, explanation: `int型は小数を代入できません。` }
        ],
        soundContext: 'フェーダーパラメータ初期化の基本'
      };
    }
  },
  {
    topic: 'if',
    generate: () => {
      const cue = SOUND_CUES[Math.floor(Math.random() * SOUND_CUES.length)];
      const threshold = Math.floor(Math.random() * 30) + 10;
      return {
        title: `【動的生成】特定条件下での ${cue} 発音判定`,
        question: `プレイヤーの体力（hp）が ${threshold} 以下になった瞬間に、警告音「${cue}」を鳴らす正しい条件分岐はどれですか？`,
        codeSnippet: `void CheckAudio(int hp) {\n    // hpが ${threshold} 以下のときに発音\n    if ([ ??? ]) {\n        PlaySound("${cue}");\n    }\n}`,
        options: [
          { id: 'o1', text: `hp <= ${threshold}`, isCorrect: true, explanation: `正解！「${threshold}以下」を表す比較演算子は <= です。` },
          { id: 'o2', text: `hp < ${threshold}`, isCorrect: false, explanation: `これだと ${threshold} 丁度のときに鳴りません（未満の判定）。` },
          { id: 'o3', text: `hp >= ${threshold}`, isCorrect: false, explanation: `これは「${threshold}以上（元気なとき）」になってしまいます。` }
        ],
        soundContext: 'ダイナミックなステート別SEトリガー'
      };
    }
  },
  {
    topic: 'loop',
    generate: () => {
      const bufferSize = [128, 256, 512, 1024][Math.floor(Math.random() * 4)];
      const factor = (Math.floor(Math.random() * 5) + 2) / 10; // 0.2〜0.6
      return {
        title: `【動的生成】サイズ${bufferSize}のバッファ音量減衰ループ`,
        question: `サイズ ${bufferSize} の波形配列 \`float[] buffer\` の全サンプル音量を ${factor} 倍にする正しいループ条件はどれですか？`,
        codeSnippet: `void Attenuate(float[] buffer) {\n    // buffer.Length は ${bufferSize}\n    for (int i = [ ??? ]; i < [ ??? ]; i++) {\n        buffer[i] *= ${factor}f;\n    }\n}`,
        options: [
          { id: 'o1', text: `int i = 0; i < buffer.Length;`, isCorrect: true, explanation: `正解！インデックス 0 から始まり、buffer.Length（${bufferSize}）未満まで巡回します。` },
          { id: 'o2', text: `int i = 1; i <= buffer.Length;`, isCorrect: false, explanation: `先頭の 0 番目が抜けてしまい、かつ末尾で配列外参照エラーでクラッシュします！` },
          { id: 'o3', text: `int i = 0; i <= ${bufferSize};`, isCorrect: false, explanation: `<= ${bufferSize} にすると、存在しない ${bufferSize} 番目を参照して落ちます。` }
        ],
        soundContext: 'DSPバッファ走査の安全境界'
      };
    }
  },
  {
    topic: 'method',
    generate: () => {
      const cue = SOUND_CUES[Math.floor(Math.random() * SOUND_CUES.length)];
      return {
        title: `【動的生成】メソッド設計: ${cue} の発音インターフェース`,
        question: `効果音名「${cue}」と音量（float volume）を受け取って音を鳴らすメソッドの定義として最も適切なものはどれですか？`,
        codeSnippet: `// 呼び出し例: PlaySe("${cue}", 0.8f);`,
        options: [
          { id: 'o1', text: `public void PlaySe(string cueName, float volume)`, isCorrect: true, explanation: `正解！文字列名と音量小数を引数として受け取り、戻り値なし（void）で発音します。` },
          { id: 'o2', text: `public float PlaySe(int cueName, string volume)`, isCorrect: false, explanation: `引数の型が逆（名前がint、音量がstring）になっており型不一致です。` },
          { id: 'o3', text: `public string PlaySe()`, isCorrect: false, explanation: `引数が受け取れず音量やCue名を指定できません。` }
        ],
        soundContext: 'ゲームサウンドAPI設計'
      };
    }
  },
  {
    topic: 'struct',
    generate: () => {
      const id = Math.floor(Math.random() * 800) + 100;
      return {
        title: `【動的生成】struct による発音パラメータのゼロアロケーション`,
        question: `SEリクエスト（SoundId: ${id}）を毎フレーム高速に渡す際、なぜ class ではなく struct が推奨されるのですか？`,
        codeSnippet: `public struct SoundRequest {\n    public int SoundId;\n    public float Volume;\n}`,
        options: [
          { id: 'o1', text: `スタック領域に展開され、GC（ガベージコレクション）によるCPU停止ノイズを起こさないから`, isCorrect: true, explanation: `正解！classと違いヒープにゴミが溜まらないため、オーディオの音飛びを原理的に防げます。` },
          { id: 'o2', text: `structを使うと自動的に音質がハイレゾになるから`, isCorrect: false, explanation: '音質ではなくメモリ管理とCPUパフォーマンスの理由です。' }
        ],
        soundContext: 'UnityやCRIでのプチノイズ撲滅'
      };
    }
  },
  {
    topic: 'decibel',
    generate: () => {
      const dbs = [-6, -12, -18, -20, 0];
      const db = dbs[Math.floor(Math.random() * dbs.length)];
      let expectedLinear = '約 0.5倍';
      if (db === -12) expectedLinear = '約 0.25倍';
      if (db === -18) expectedLinear = '約 0.125倍';
      if (db === -20) expectedLinear = '約 0.1倍';
      if (db === 0) expectedLinear = '1.0倍（等倍）';

      return {
        title: `【動的生成】フェーダー減衰: ${db}dB のリニア換算`,
        question: `DAWのフェーダーで音量を ${db}dB に設定した場合、波形振幅（リニア値）はおよそ何倍になりますか？`,
        codeSnippet: `float linear = MathF.Pow(10.0f, ${db}.0f / 20.0f);`,
        options: [
          { id: 'o1', text: `${expectedLinear}`, isCorrect: true, explanation: `正解！${db}dB を振幅に直すと ${expectedLinear} になります。` },
          { id: 'o2', text: `${db === -6 ? '0.1倍' : '0.5倍'}`, isCorrect: false, explanation: `計算式 10^(dB/20) に当てはめると異なります。` }
        ],
        soundContext: 'ミキサーフェーダーの目盛り計算'
      };
    }
  }
];

export function generateProceduralQuiz(track: TrackType, category?: string, difficulty?: DifficultyLevel): QuizQuestion {
  const generator = CODE_SNIPPETS_CS[Math.floor(Math.random() * CODE_SNIPPETS_CS.length)];
  const result = generator.generate();

  return {
    id: `proc-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    track: track,
    category: category || 'C# 基礎',
    difficulty: difficulty || 'beginner',
    type: 'choice',
    title: result.title,
    question: result.question,
    codeSnippet: result.codeSnippet,
    options: result.options,
    soundContext: result.soundContext
  };
}
