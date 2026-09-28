import { CurriculumTopic } from '@/types/learning';

export const CSHARP_50_TOPICS: CurriculumTopic[] = [
  // ==========================================
  // 【フェーズ1: ゼロからの変数と基本計算】 (トピック 1〜10)
  // ==========================================
  {
    id: 'cs-01-float',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '1. float型: 音量フェーダーとピッチの表現',
    subtitle: '小数を扱う32-bit浮動小数点数の基本',
    iconName: 'Volume2',
    category: 'C# 基礎',
    summary: 'DAWのフェーダー音量（0.0〜1.0）やピッチ倍率（1.0=等倍）を保持する最も基本的な型 `float` を学びます。',
    soundDesignerPerspective: 'CubaseのボリュームオートメーションやVSTプラグインの入出力波形はすべてfloat型で表されます。数値の末尾に `f` を付けるのがC#の決まりです。',
    soundJargon: [
      {
        term: '型 (Type)',
        analogy: 'ケーブルや端子の規格 (XLR, フォーン, ミニプラグ)',
        explanation: 'データを入れる箱の種類。小数用の箱、整数用の箱など役割が決まっています。'
      },
      {
        term: '変数 (Variable)',
        analogy: 'ミキサーのチャンネルフェーダーやつまみ',
        explanation: '値を入れておき、いつでも動かしたり書き換えられる名札付きの箱のこと。'
      }
    ],
    keyConcepts: [
      {
        name: 'float変数の宣言と代入',
        description: '小数を表すには `float 変数名 = 数値f;` と記述します。',
        goodPattern: 'float masterVolume = 0.8f;\nfloat soundPitch = 1.0f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-01',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'float型のリテラル表記',
        question: 'C#で音量 0.5 を float 変数に正しく代入しているコードはどれですか？',
        options: [
          { id: 'o1', text: 'float vol = 0.5f;', isCorrect: true, explanation: '正解！小数の末尾に f を付けることで float 型として扱われます。' },
          { id: 'o2', text: 'float vol = 0.5;', isCorrect: false, explanation: 'f がないと double 型と判定され、型不一致エラーになります。' }
        ],
        soundContext: 'Unityやオーディオプラグインパラメータの基本'
      }
    ],
    audioExercise: {
      id: 'ex-cs-01',
      track: 'csharp',
      title: 'float音量パラメータの適用',
      description: 'float volume を乗算して適切な音量で再生します。',
      soundGoal: '音量（volume = 0.4f）を適用して耳に心地よい音量にする',
      initialCode: `public void ApplyVolume(float[] buffer, float volume) {\n    for(int i = 0; i < buffer.Length; i++) {\n        buffer[i] = buffer[i] * volume;\n    }\n}`,
      solutionSnippet: `buffer[i] = buffer[i] * volume;`,
      dspType: 'gain_clip'
    }
  },
  {
    id: 'cs-02-int',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '2. int型: サウンドIDとMIDIノート番号',
    subtitle: '整数を扱う32-bit整数の基本',
    iconName: 'Hash',
    category: 'C# 基礎',
    summary: '端数のない整数を扱う `int` 型を学びます。効果音のキューID（101）やMIDIノート番号（60=中央ド）に使用します。',
    soundDesignerPerspective: '「何番のSEを再生するか」や「同時発音数（ボイスリミット）」など、個数や識別番号を管理する際に必須です。',
    soundJargon: [
      {
        term: 'int (整数型)',
        analogy: 'トラック番号 (Track 1, Track 2) やMIDIノート番号',
        explanation: '1, 2, 60 のように端数（小数点）のないスッキリした数値を扱う箱です。'
      }
    ],
    keyConcepts: [
      {
        name: 'int変数の宣言',
        description: '小数点は使えず、整数のみを格納します。',
        goodPattern: 'int soundId = 101;\nint maxVoiceCount = 32;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-02',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'int型と小数の扱い',
        question: '`int note = (int)60.8f;` とキャスト代入した場合、変数 note の値はどうなりますか？',
        options: [
          { id: 'o1', text: '60 (小数点以下が切り捨てられる)', isCorrect: true, explanation: '正解！int型に変換すると四捨五入ではなく端数がそのまま切り捨てられます。' },
          { id: 'o2', text: '61 (四捨五入される)', isCorrect: false, explanation: 'キャストでは四捨五入は行われません。' }
        ],
        soundContext: 'MIDIピッチベンドの半音計算での注意点'
      }
    ]
  },
  {
    id: 'cs-03-bool',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '3. bool型: ミュートとループのON/OFFフラグ',
    subtitle: '真(true)か偽(false)かの2択を司る論理型',
    iconName: 'ToggleLeft',
    category: 'C# 基礎',
    summary: '「再生中か？」「ミュートされているか？」など、状態のON/OFFを保持する `bool` 型をマスターします。',
    soundDesignerPerspective: 'CubaseのMUTEボタンやSOLOボタン、BGMのループ有効フラグなどはすべてbool値（true/false）で制御されます。',
    soundJargon: [
      {
        term: 'bool (ブール型)',
        analogy: 'エフェクターのバイパススイッチ / ミュートボタン',
        explanation: '押されている(true)か、押されていない(false)かの2つの状態しか持たない超軽量スイッチです。'
      }
    ],
    keyConcepts: [
      {
        name: 'bool変数の宣言と否定演算子 (!)',
        description: '`!isMuted` で「ミュートされていない状態」を判定できます。',
        goodPattern: 'bool isMuted = false;\nbool isLooping = true;\nif (!isMuted) { /* 再生 */ }'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-03',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'bool型の初期値と反転',
        question: '`bool isPlaying = true; isPlaying = !isPlaying;` の実行後、isPlaying の値は何になりますか？',
        options: [
          { id: 'o1', text: 'false', isCorrect: true, explanation: '正解！`!`（否定演算子）によって true が false に反転します。トグルスイッチの基本です。' },
          { id: 'o2', text: 'true', isCorrect: false, explanation: '! で値が反転します。' }
        ],
        soundContext: '再生/停止トグルボタンの実装'
      }
    ]
  },
  {
    id: 'cs-04-string',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '4. string型: サウンドキュー名とアセットパス',
    subtitle: '文字の並び（テキスト）を扱う文字列型',
    iconName: 'Type',
    category: 'C# 基礎',
    summary: '効果音のラベル名（"Explosion_01"）やファイルパスを管理する `string` 型の扱い方を学びます。',
    soundDesignerPerspective: 'CRI ADXのキュー名指定発音（`criAtomSource.Play("BGM_Boss")`）などで頻出します。ただし、毎フレーム文字列を新しく作るとGCゴミになるため、キャッシュして使うのが現場の鉄則です。',
    soundJargon: [
      {
        term: 'string (文字列型)',
        analogy: 'ミキサーのチャンネルテープに手書きしたトラック名ラベル',
        explanation: 'ダブルクォート " " で囲んだ文字のテキストデータです。'
      }
    ],
    keyConcepts: [
      {
        name: 'stringの定義',
        description: 'ダブルクォートで文字を囲みます。',
        goodPattern: 'string bgmCueName = "BGM_Title";'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-04',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'string型の宣言',
        question: 'C#で文字列変数を正しく定義しているものはどれですか？',
        options: [
          { id: 'o1', text: 'string seName = "Laser_Shot";', isCorrect: true, explanation: '正解！文字列は二重引用符 " " で囲みます。' },
          { id: 'o2', text: "string seName = 'Laser_Shot';", isCorrect: false, explanation: '一重引用符 \' \' は1文字だけを扱う char 型用です。' }
        ],
        soundContext: 'サウンドキュー管理'
      }
    ]
  },
  {
    id: 'cs-05-math',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '5. 四則演算: 音量ゲインと周波数の倍音計算',
    subtitle: '加減乗除 (+, -, *, /) と剰余 (%) の基本',
    iconName: 'Calculator',
    category: 'C# 基礎',
    summary: '音量を掛け合わせたり、オクターブ上の周波数を計算（周波数 × 2）するための四則演算を学びます。',
    soundDesignerPerspective: 'マスター音量 × トラック音量 × SE音量 のように、デジタルオーディオのミキシングはすべて「掛け算（ゲイン乗算）」で成り立っています。',
    keyConcepts: [
      {
        name: '音量の掛け算と除算',
        description: '整数同士の割り算（5 / 2 = 2）に注意し、必ず float で計算します。',
        goodPattern: 'float finalVolume = masterVol * trackVol * seVol;\nfloat octaveFreq = baseFreq * 2.0f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-05',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '整数割り算の罠',
        question: '`float vol = 1 / 2;` と書いた場合、vol の値は何になりますか？',
        options: [
          { id: 'o1', text: '0.0f (0になってしまう)', isCorrect: true, explanation: '正解！1 と 2 が両方int型のため、整数の割り算（端数切り捨てで0）が行われた後にfloatに代入されます。正しくは `1.0f / 2.0f` と書きます。' },
          { id: 'o2', text: '0.5f', isCorrect: false, explanation: 'どちらかに f を付けないと 0.5f にはなりません！初心者が最も引っかかる罠です。' }
        ],
        soundContext: 'フェーダー比率計算での頻出バグ'
      }
    ]
  },
  {
    id: 'cs-06-const',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '6. 定数 const: サンプリングレートなどの不変値',
    subtitle: '書き換えを防ぎ、安全性を高める定数宣言',
    iconName: 'Lock',
    category: 'C# 基礎',
    summary: 'サンプリング周波数（44100Hz）や基準周波数（440Hz）など、絶対に途中で変わってはいけない値を `const` で保護します。',
    soundDesignerPerspective: '誤ってプログラムの途中でサンプリング周波数を書き換えてしまうと、再生ピッチが狂ったりクラッシュします。定数でロックするのがプロの作法です。',
    soundJargon: [
      {
        term: 'const (定数)',
        analogy: '機材の「固定キャリブレーション値」や「基準クロック（44.1kHz）」',
        explanation: '一度決めたら二度と誰にも書き換えられない保護された値です。'
      }
    ],
    keyConcepts: [
      {
        name: 'const の宣言',
        description: '宣言と同時に値を代入し、以降の書き換えをコンパイル時に禁止します。',
        goodPattern: 'const int SampleRate = 44100;\nconst float BaseTuning = 440.0f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-06',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'const変数の変更',
        question: '`const int SR = 44100; SR = 48000;` と書くと何が起きますか？',
        options: [
          { id: 'o1', text: 'コンパイルエラーになりビルドできない', isCorrect: true, explanation: '正解！const は不変のため、代入しようとするとコンパイラがエラーを出してバグを防ぎます。' },
          { id: 'o2', text: '正常に48000に更新される', isCorrect: false, explanation: 'const変数は書き換え不可です。' }
        ],
        soundContext: 'オーディオ設定の安全保護'
      }
    ]
  },
  {
    id: 'cs-07-scope',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '7. 変数スコープ: 中括弧 { } と寿命',
    subtitle: '変数が有効な範囲とメモリの解放タイミング',
    iconName: 'Maximize2',
    category: 'C# 基礎',
    summary: '中括弧 `{ }` の中で宣言した変数は、その中括弧を抜けると自動的に寿命を終えて消滅するルールを学びます。',
    soundDesignerPerspective: '関数内で一時的に計算した波形サンプル変数が、関数終了と同時にスタックから消滅するため、メモリが無駄に残りません。',
    soundJargon: [
      {
        term: 'スコープ (Scope)',
        analogy: '特定のエフェクトラック内でのみ有効なパッチングケーブル',
        explanation: '中括弧 { } で囲まれた部屋の中だけで名札（変数）が通じる範囲のことです。'
      }
    ],
    keyConcepts: [
      {
        name: 'ローカル変数の寿命',
        description: '外側のスコープからは内側の変数にアクセスできません。',
        goodPattern: 'void Process() {\n    float tempGain = 0.5f; // ここでのみ有効\n} // tempGain はここで破棄'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-07',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'スコープ外からのアクセス',
        question: 'if文の中で宣言した `float fade = 0.5f;` を、if文の外側の中括弧の外で使おうとするとどうなりますか？',
        options: [
          { id: 'o1', text: '「その変数は存在しません」とコンパイルエラーになる', isCorrect: true, explanation: '正解！中括弧を抜けた時点で変数はスコープから外れ、見えなくなります。' },
          { id: 'o2', text: '問題なく0.5fとして読み出せる', isCorrect: false, explanation: '内側で宣言した変数は外側から触れません。' }
        ],
        soundContext: 'ローカル変数の安全管理'
      }
    ]
  },
  {
    id: 'cs-08-cast',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '8. 型のキャスト変換: 16bit整数と32bit小数の橋渡し',
    subtitle: '型を明示的に変換する (型名) 構文',
    iconName: 'RefreshCw',
    category: 'C# 基礎',
    summary: '波形データや音量数値を、別の型に安全に変換するキャスト `(float)value` の仕組みを学びます。',
    soundDesignerPerspective: 'WAVファイルの16-bit PCMデータ（-32768〜+32767）をDAW用の浮動小数点数（-1.0f〜+1.0f）に正規化する際、キャストが不可欠です。',
    soundJargon: [
      {
        term: 'キャスト (Cast)',
        analogy: 'DI (ダイレクトボックス) によるインピーダンス変換・信号レベル変換',
        explanation: 'ある型の信号を別の規格の型へと無理なく変換する処理です。'
      }
    ],
    keyConcepts: [
      {
        name: '明示的キャスト',
        description: '括弧 `(float)` で型変換を指定します。',
        goodPattern: 'short pcmSample = 16384;\nfloat normalized = (float)pcmSample / 32768.0f; // 約0.5f'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-08',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'PCMサンプルの正規化計算',
        question: 'short型のPCM値 `short raw = 32767;` を、floatの最大振幅 1.0f に変換する正しいキャスト式はどれですか？',
        options: [
          { id: 'o1', text: 'float amp = (float)raw / 32767.0f;', isCorrect: true, explanation: '正解！rawをfloatにキャストしてから小数の割り算を行います。' },
          { id: 'o2', text: 'float amp = raw / 32767;', isCorrect: false, explanation: 'これだと整数割り算になってしまい、1未満の端数が消えてしまいます。' }
        ],
        soundContext: 'WAVローダーの基本処理'
      }
    ]
  },
  {
    id: 'cs-09-interpolation',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '9. 文字列補間 $\"...\" : デバッグログのスマートな表示',
    subtitle: '変数値をテキスト内に埋め込むモダンな記法',
    iconName: 'MessageSquare',
    category: 'C# 基礎',
    summary: '文字列の中に `{volume}` のように変数を直接埋め込んで表示できる文字列補間（String Interpolation）をマスターします。',
    soundDesignerPerspective: '「現在のマスター音量: 0.85」や「再生中のCue: Footstep」などのデバッグ表示を、視認性高く記述できます。',
    keyConcepts: [
      {
        name: '$\"\" 構文',
        description: 'ダブルクォートの前に $ を付けると、{変数名} がその値に展開されます。',
        goodPattern: 'string log = $"Playing Cue: {cueName} at Volume: {vol:F2}";'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-09',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '文字列補間のシンタックス',
        question: '変数 `int voiceId = 5;` を埋め込んだ文字列として正しいものはどれですか？',
        options: [
          { id: 'o1', text: '$\"Voice ID is {voiceId}\"', isCorrect: true, explanation: '正解！先頭に $ を付け、波括弧 { } で変数を囲みます。' },
          { id: 'o2', text: '"Voice ID is {voiceId}"', isCorrect: false, explanation: '$ がないと単にそのまま文字として「{voiceId}」と表示されてしまいます。' }
        ],
        soundContext: 'オーディオログ出力'
      }
    ]
  },
  {
    id: 'cs-10-comments',
    track: 'csharp',
    phase: 'フェーズ1: ゼロからの変数と基本計算',
    title: '10. コメントと可読性: 音響エンジニアに伝わるコード',
    subtitle: '// 1行コメント と /* 複数行コメント */',
    iconName: 'FileText',
    category: 'C# 基礎',
    summary: 'コードに解説メモを残すコメント記法と、「なぜその音量カーブにしたのか」をメモする現場の習慣を学びます。',
    soundDesignerPerspective: '「※このSEは爆音のため -6dB 下げています」といったコメントを残すことで、プログラマーとサウンドデザイナーの意思疎通が円滑になります。',
    keyConcepts: [
      {
        name: 'コメントの書き方',
        description: '// で行末まで、/* */ で複数行をコメント化できます。',
        goodPattern: '// ボス出現時のBGMフェードアウト時間 (秒)\nconst float BgmFadeTime = 3.0f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-10',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'コメント記法',
        question: 'C#で1行のメモを残すための正しい記号はどれですか？',
        options: [
          { id: 'o1', text: '// ここにメモ', isCorrect: true, explanation: '正解！スラッシュ2つでその行がコメントになります。' },
          { id: 'o2', text: '# ここにメモ', isCorrect: false, explanation: '# はPythonなどの記法で、C#ではプリプロセッサ命令用です。' }
        ],
        soundContext: 'チーム開発での音響設定メモ'
      }
    ]
  },

  // ==========================================
  // 【フェーズ2: 条件分岐と判定ロジック】 (トピック 11〜18)
  // ==========================================
  {
    id: 'cs-11-if',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '11. if文の基本: 音量ゼロでの自動ミュート',
    subtitle: '条件が成り立ったときだけ処理を実行する',
    iconName: 'Split',
    category: 'C# 基礎',
    summary: '「もし音量が0以下なら再生を停止する」といった、条件判定によるロジック分岐を学びます。',
    soundDesignerPerspective: '不要な無音ボイスを再生し続けるとCPUを圧迫するため、音量チェックによる早期停止は最重要です。',
    keyConcepts: [
      {
        name: 'if文の構文',
        description: 'カッコの中が true のときのみ中括弧が実行されます。',
        goodPattern: 'if (volume <= 0.0f) {\n    StopSound();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-11',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'if文の構文',
        question: '`if (volume == 0.0f)` の中括弧が実行される条件はどれですか？',
        options: [
          { id: 'o1', text: 'volume が完全に 0.0f のとき', isCorrect: true, explanation: '正解！`==` は「等しい」を比較する記号です。' },
          { id: 'o2', text: 'volume に 0.0f を代入したとき', isCorrect: false, explanation: '代入は `=` 1つです。比較は `==` 2つ使います。' }
        ],
        soundContext: '無音判定'
      }
    ]
  },
  {
    id: 'cs-12-else',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '12. else / else if: 速度に応じた足音（歩き/走り）の切り替え',
    subtitle: '多段階の条件分岐ロジック',
    iconName: 'GitBranch',
    category: 'C# 基礎',
    summary: 'プレイヤーの移動速度が「速いなら走り足音」「遅いなら歩き足音」「ゼロなら停止」と分岐させる構文を学びます。',
    soundDesignerPerspective: '歩行・走行・スニーキングなど、ゲームのモーションに追従するサウンドスイッチングの核です。',
    keyConcepts: [
      {
        name: 'else if と else',
        description: '上から順番に判定され、最初に一致した1つだけが実行されます。',
        goodPattern: 'if (speed > 5.0f) {\n    PlayRunSound();\n} else if (speed > 0.1f) {\n    PlayWalkSound();\n} else {\n    StopFootsteps();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-12',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'else if の実行順序',
        question: '`speed = 6.0f` のとき、上のコードで再生される音は何ですか？',
        options: [
          { id: 'o1', text: 'PlayRunSound() (走り音)', isCorrect: true, explanation: '正解！最初の `speed > 5.0f` に合致するため、走り足音が再生されます。' },
          { id: 'o2', text: 'PlayWalkSound() (歩き音)', isCorrect: false, explanation: '上の条件に一致した時点で以降の else if はスキップされます。' }
        ],
        soundContext: '歩行サウンドマネージャー'
      }
    ]
  },
  {
    id: 'cs-13-comparisons',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '13. 比較演算子: クリッピング閾値の検出',
    subtitle: '<, <=, >, >=, ==, != の使い分け',
    iconName: 'Sliders',
    category: 'C# 基礎',
    summary: '波形が 1.0f を超えてクリップ（音割れ）していないかを検出するための大小比較演算子を学びます。',
    soundDesignerPerspective: 'ピークリミッターやコンプレッサーのスレッショルド（閾値）判定で頻出します。',
    keyConcepts: [
      {
        name: 'クリップ検出',
        description: '`sample > 1.0f` で過大入力を検知します。',
        goodPattern: 'if (sample > 1.0f || sample < -1.0f) {\n    TriggerClipWarning();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-13',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '「異なる」を表す比較演算子',
        question: '「現在のBGMが指定のCue名と異なるときだけ曲を変更する」という判定に使う演算子はどれですか？',
        options: [
          { id: 'o1', text: '!= (ノットイコール)', isCorrect: true, explanation: '正解！`!=` は「等しくない」を表します。' },
          { id: 'o2', text: '<>', isCorrect: false, explanation: '<> はSQL等で使われますが、C#では != を使います。' }
        ],
        soundContext: 'BGMの二重再生防止'
      }
    ]
  },
  {
    id: 'cs-14-and',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '14. 論理積 && (かつ): 複合トリガー条件',
    subtitle: 'すべての条件が満たされたときだけ実行する',
    iconName: 'CheckSquare',
    category: 'C# 基礎',
    summary: '「プレイヤーが空中にいて、かつ着地した瞬間」にのみ着地音を鳴らすような複合条件を `&&` で表現します。',
    soundDesignerPerspective: '毎フレーム着地音が暴発しないよう、「前フレーム空中 && 現フレーム接地」という判定を組むのが現場の定番です。',
    keyConcepts: [
      {
        name: '&& (AND)',
        description: '左右の両方が true の時のみ全体が true になります。',
        goodPattern: 'if (wasInAir && isGrounded) {\n    PlayLandingSound();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-14',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '&& 演算子の判定',
        question: '`bool a = true; bool b = false;` のとき、`(a && b)` の評価結果はどうなりますか？',
        options: [
          { id: 'o1', text: 'false', isCorrect: true, explanation: '正解！片方が false のため、全体も false になります。' },
          { id: 'o2', text: 'true', isCorrect: false, explanation: '両方が true である必要があります。' }
        ],
        soundContext: '着地サウンドトリガー'
      }
    ]
  },
  {
    id: 'cs-15-or',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '15. 論理和 || (または): 複数要因による消音',
    subtitle: 'どれか1つでも条件が満たされれば実行する',
    iconName: 'ToggleRight',
    category: 'C# 基礎',
    summary: '「ポーズ中、またはメニュー画面を開いているとき」にゲームSEを止めるような条件を `||` で表現します。',
    soundDesignerPerspective: 'マスターミュート、ポーズ、ムービー再生中など、音を止める要因が複数ある場合に多用されます。',
    keyConcepts: [
      {
        name: '|| (OR)',
        description: 'どちらか一方でも true なら全体が true になります。',
        goodPattern: 'if (isPaused || isMenuOpen) {\n    MuteGameAudio();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-15',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '|| 演算子の判定',
        question: '`isPaused = true; isMenuOpen = false;` のとき、`if (isPaused || isMenuOpen)` は実行されますか？',
        options: [
          { id: 'o1', text: '実行される (true)', isCorrect: true, explanation: '正解！片方（isPaused）が true なので全体が true になります。' },
          { id: 'o2', text: '実行されない (false)', isCorrect: false, explanation: 'どちらか1つでも満たせば実行されます。' }
        ],
        soundContext: 'ポーズ時の一括消音'
      }
    ]
  },
  {
    id: 'cs-16-switch',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '16. switch文: 地面マテリアルによる足音の分岐',
    subtitle: '値に応じたスッキリした多分岐構文',
    iconName: 'Grid',
    category: 'C# 基礎',
    summary: 'if文を何個も並べる代わりに、地面の材質（Grass, Metal, Water, Concrete）ごとに発音を美しく分岐させます。',
    soundDesignerPerspective: 'WwiseやCRIの「Switchコンテナ」と同じ発想で、マテリアル名に応じて音色を切り替えるのに最適です。',
    soundJargon: [
      {
        term: 'switch文',
        analogy: 'ハードウェアのロータリーセレクタースイッチ',
        explanation: '「1番ならこれ、2番ならこれ」とツマミを回してルーティングを切り替える構文です。'
      }
    ],
    keyConcepts: [
      {
        name: 'case と break',
        description: '各caseの末尾には break; を置くのがC#の基本です。',
        goodPattern: 'switch (surface) {\n    case "Wood": PlayWoodFootstep(); break;\n    case "Metal": PlayMetalFootstep(); break;\n    default: PlayDirtFootstep(); break;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-16',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'switchのdefault句',
        question: 'どの case にも当てはまらなかったときに実行される処理ブロックは何ですか？',
        options: [
          { id: 'o1', text: 'default:', isCorrect: true, explanation: '正解！default: は未知のマテリアルやデフォルト音を鳴らすフォールバックとして使われます。' },
          { id: 'o2', text: 'else:', isCorrect: false, explanation: 'switch文では else ではなく default を使います。' }
        ],
        soundContext: 'マテリアル足音ルーティング'
      }
    ]
  },
  {
    id: 'cs-17-switchexpr',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '17. switch式 (C# 8.0+): モダンな音名変換',
    subtitle: '簡潔で美しい1行値マッピング',
    iconName: 'ArrowRightCircle',
    category: 'C# 基礎',
    summary: '値を直接代入できるモダンC#の記法「switch式」で、サウンドステートからファイル名を即座に引くコードを書きます。',
    soundDesignerPerspective: '冗長なコードを劇的に短縮し、可読性を高めます。',
    keyConcepts: [
      {
        name: 'switch式の記法',
        description: '`変数 switch { パターン => 結果, _ => デフォルト }` で値を返せます。',
        goodPattern: 'string cue = weather switch {\n    Weather.Rain => "Amb_Rain",\n    Weather.Storm => "Amb_Storm",\n    _ => "Amb_Sunny"\n};'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-17',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'switch式のワイルドカード',
        question: 'switch式で「それ以外のすべて」を表す記号は何ですか？',
        options: [
          { id: 'o1', text: '_ (アンダースコア / ディスカード)', isCorrect: true, explanation: '正解！`_ => 値` でdefaultと同じ動作になります。' },
          { id: 'o2', text: '*', isCorrect: false, explanation: 'C#のswitch式では _ を使います。' }
        ],
        soundContext: '天候・環境音の切り替え'
      }
    ]
  },
  {
    id: 'cs-18-ternary',
    track: 'csharp',
    phase: 'フェーズ2: 条件分岐と判定ロジック',
    title: '18. 三項演算子: 1行での最小音量クリッピング',
    subtitle: '条件 ? 真の値 : 偽の値 のワンライナー',
    iconName: 'HelpCircle',
    category: 'C# 基礎',
    summary: '「ミュートなら0.0f、そうでなければ通常の音量」を1行でスッキリ記述できる三項演算子をマスターします。',
    soundDesignerPerspective: '数値をサクッとクランプ（上下限制限）する際などに非常に便利です。',
    keyConcepts: [
      {
        name: '三項演算子の書き方',
        description: 'if-else を1行でスマートに書くことができます。',
        goodPattern: 'float outputVol = isMuted ? 0.0f : masterVol;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-18',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '三項演算子の評価',
        question: '`float gain = (pan > 0) ? 1.0f : 0.5f;` で、`pan = -1` のときの gain の値は何ですか？',
        options: [
          { id: 'o1', text: '0.5f', isCorrect: true, explanation: '正解！条件 (pan > 0) が false なので、コロンの右側（0.5f）が選ばれます。' },
          { id: 'o2', text: '1.0f', isCorrect: false, explanation: '条件が成り立っていないため左側は選ばれません。' }
        ],
        soundContext: 'パンニング減衰計算'
      }
    ]
  },

  // ==========================================
  // 【フェーズ3: 配列と繰り返しループ】 (トピック 19〜26)
  // ==========================================
  {
    id: 'cs-19-array-decl',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '19. 固定長配列 float[]: オーディオバッファの確保',
    subtitle: 'メモリ上に波形サンプルが並ぶデータ構造',
    iconName: 'Layers',
    category: 'C# 基礎',
    summary: 'オーディオプログラミングの本丸！512個や1024個の波形データを一列に並べる配列 `float[]` のメモリ確保を学びます。',
    soundDesignerPerspective: 'DAWやオーディオインターフェースのバッファサイズ（512サンプルなど）は、C#ではまさに `new float[512]` という配列として届きます。',
    soundJargon: [
      {
        term: '配列 (Array)',
        analogy: 'マルチトラックレコーダーのトラックスロットの並び',
        explanation: '同じ型の箱が番号順（0番, 1番...）に隙間なく並んだデータのことです。'
      }
    ],
    keyConcepts: [
      {
        name: '配列の宣言とnew',
        description: '`float[] buffer = new float[サイズ];` で連続したメモリを確保します。',
        goodPattern: 'const int BufferSize = 512;\nfloat[] audioBuffer = new float[BufferSize];'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-19',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '配列の初期値',
        question: '`float[] buf = new float[256];` を新しく確保した直後、配列の中身の数値は何になっていますか？',
        options: [
          { id: 'o1', text: 'すべて 0.0f (完全無音で初期化されている)', isCorrect: true, explanation: '正解！C#では新しく確保された数値配列は自動的に 0（0.0f）でクリアされます。' },
          { id: 'o2', text: 'ランダムなゴミデータが入っている', isCorrect: false, explanation: 'それはC++のmallocなどの場合です。C#は安全のため0でゼロクリアされます。' }
        ],
        soundContext: '無音バッファの初期化'
      }
    ]
  },
  {
    id: 'cs-20-array-access',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '20. インデックス添字: buffer[0] から始まる世界',
    subtitle: '0始まり（ゼロオリジン）の絶対ルール',
    iconName: 'ListFilter',
    category: 'C# 基礎',
    summary: 'プログラミングの配列は 1 ではなく 0 から始まります。サイズ512の配列の末尾は `buffer[511]` であることを体感します。',
    soundDesignerPerspective: '「1サンプル目を触るつもりが2サンプル目だった」というズレを防ぐための基本です。',
    keyConcepts: [
      {
        name: '添字アクセス',
        description: '角括弧 `[添字]` で要素を読み書きします。',
        goodPattern: 'buffer[0] = 0.5f;   // 最初のサンプル\nbuffer[511] = 0.0f; // 最後のサンプル'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-20',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'サイズ1024の末尾インデックス',
        question: '要素数 1024 の配列で、一番最後のサンプルを読み書きする正しい書き方はどれですか？',
        options: [
          { id: 'o1', text: 'buffer[1023]', isCorrect: true, explanation: '正解！0から数えるため、サイズNの末尾は N-1（1023）になります。' },
          { id: 'o2', text: 'buffer[1024]', isCorrect: false, explanation: 'buffer[1024] は存在せず、IndexOutOfRangeException エラーで落ちます！' }
        ],
        soundContext: 'オーディオバッファの安全境界'
      }
    ]
  },
  {
    id: 'cs-21-for-loop',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '21. forループ: 波形データの全サンプル走査',
    subtitle: '1秒間に数万回繰り返す高速ループ',
    iconName: 'Repeat',
    category: 'C# 基礎',
    summary: 'forループを使って、バッファ内の全サンプルに音量をかけたり、無音化（ミュート）する構文を学びます。',
    soundDesignerPerspective: 'あらゆるDSP（イコライザー、リバーブ、ゲイン調整）の基本ループ構造です。',
    keyConcepts: [
      {
        name: 'for文の書き方',
        description: '`for (int i = 0; i < buffer.Length; i++)` が定石です。',
        goodPattern: 'for (int i = 0; i < buffer.Length; i++) {\n    buffer[i] *= 0.5f; // 音量半減\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-21',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'forループの継続条件',
        question: '全サンプルを処理するループ条件として、最も安全なものはどれですか？',
        options: [
          { id: 'o1', text: 'i < buffer.Length', isCorrect: true, explanation: '正解！Length未満で回すことで、末尾の Length-1 まで安全に走査できます。' },
          { id: 'o2', text: 'i <= buffer.Length', isCorrect: false, explanation: '<= にすると末尾を超えてクラッシュします。' }
        ],
        soundContext: 'DSP走査の基本'
      }
    ],
    audioExercise: {
      id: 'ex-cs-21',
      track: 'csharp',
      title: 'forループによる逆位相（位相反転）処理',
      description: '全サンプルに -1.0f を掛けて波形を上下反転させます（ノイズキャンセリングの基礎）。',
      soundGoal: '全サンプルを反転させて位相反転波形を作る',
      initialCode: `public void InvertPhase(float[] buffer) {\n    for (int i = 0; i < buffer.Length; i++) {\n        // TODO: buffer[i] に -1.0f を乗算してください\n        buffer[i] = buffer[i] * -1.0f;\n    }\n}`,
      solutionSnippet: `buffer[i] = buffer[i] * -1.0f;`,
      dspType: 'gain_clip'
    }
  },
  {
    id: 'cs-22-bounds-check',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '22. 配列外参照の防止: 音割れ・クラッシュの鉄壁ガード',
    subtitle: 'IndexOutOfRangeException を絶対に起こさないガード節',
    iconName: 'Shield',
    category: 'C# 基礎',
    summary: 'ディレイやリバーブを実装する際、存在しないインデックス（マイナス値やLength以上）を参照しないためのガード処理を学びます。',
    soundDesignerPerspective: 'ディレイタイムの計算ミスで配列外を参照するとゲームが即死クラッシュします。現場で最も恐れられるバグの1つです。',
    keyConcepts: [
      {
        name: 'インデックスの事前チェック',
        description: 'アクセスする前に 0以上かつLength未満であることを確認します。',
        goodPattern: 'if (index >= 0 && index < buffer.Length) {\n    float sample = buffer[index];\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-22',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'マイナスインデックスへのアクセス',
        question: '`buffer[-1]` を読み取ろうとするとどうなりますか？',
        options: [
          { id: 'o1', text: 'IndexOutOfRangeException が発生してプログラムが停止する', isCorrect: true, explanation: '正解！C#ではマイナスのインデックスは許されておらず、即座に例外エラーが発生します。' },
          { id: 'o2', text: '末尾のサンプルが返される', isCorrect: false, explanation: 'それはPythonなどの言語の挙動です。C#ではエラーになります。' }
        ],
        soundContext: 'ディレイバッファ境界管理'
      }
    ]
  },
  {
    id: 'cs-23-while',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '23. whileループ: フェード完了までの待機処理',
    subtitle: '条件が満たされている間ずっと繰り返す',
    iconName: 'RotateCw',
    category: 'C# 基礎',
    summary: '「音量がゼロになるまで少しずつ音量を下げる」といった、回数が決まっていない繰り返し処理 `while` を学びます。',
    soundDesignerPerspective: 'コルーチンや非同期処理でのフェードアウト待機などで頻出します。無限ループに注意が必要です。',
    keyConcepts: [
      {
        name: 'whileの基本',
        description: 'ループの中で必ず条件が false に向かう処理（音量を減らす等）を書きます。',
        goodPattern: 'while (currentVolume > 0.0f) {\n    currentVolume -= 0.05f;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-23',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '無限ループの危険性',
        question: 'while文の条件式を `while (true)` と書いたまま break もせず放置すると何が起きますか？',
        options: [
          { id: 'o1', text: '処理が無限に回り続け、ゲーム画面がフリーズ（ハング）する', isCorrect: true, explanation: '正解！ループから抜け出せなくなり、メインスレッドが停止します。' },
          { id: 'o2', text: '1秒経つと自動的にループを抜ける', isCorrect: false, explanation: '自動では抜けません。必ず終了条件を用意する必要があります。' }
        ],
        soundContext: 'フェード処理の安全設計'
      }
    ]
  },
  {
    id: 'cs-24-break-continue',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '24. break と continue: ピーク検出時のループ早期離脱',
    subtitle: 'ループの制御を操る2つのキーワード',
    iconName: 'FastForward',
    category: 'C# 基礎',
    summary: '「1箇所でもクリップしているサンプルを見つけたら、残りは調べずに即座にループを抜ける（break）」高速化テクニックを学びます。',
    soundDesignerPerspective: '数千サンプルのチェックにおいて、無駄なCPU消費を抑えてフレームレートを安定させます。',
    keyConcepts: [
      {
        name: 'break と continue の違い',
        description: 'break はループ自体を完全終了、continue は次の周回へスキップします。',
        goodPattern: 'for (int i = 0; i < buffer.Length; i++) {\n    if (buffer[i] >= 1.0f) {\n        isClipped = true;\n        break; // 以降のサンプルは見ずに終了\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-24',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'continue の挙動',
        question: 'ループ内で `continue;` が実行されたとき、何が起きますか？',
        options: [
          { id: 'o1', text: '現在の周回の残りの処理を飛ばし、次のサンプルの周回（i++）へ進む', isCorrect: true, explanation: '正解！無音サンプルをスキップして高速化したいときなどに有効です。' },
          { id: 'o2', text: 'ループ全体が終了する', isCorrect: false, explanation: 'ループ全体を終わらせるのは break です。' }
        ],
        soundContext: '波形ピーク高速スキャン'
      }
    ]
  },
  {
    id: 'cs-25-foreach',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '25. foreach文: 登録サウンドソースの一括巡回',
    subtitle: '配列やコレクションの全要素をスッキリ取り出す',
    iconName: 'CheckCircle',
    category: 'C# 基礎',
    summary: '添字 `i` を使わずに、「アクティブなすべてのAudioSourceに対して一括でVolumeを変更する」ようなエレガントな反復を学びます。',
    soundDesignerPerspective: '「現在鳴っている環境音を一括でダッキング（音量抑制）する」処理などに重宝します。',
    keyConcepts: [
      {
        name: 'foreach の書き方',
        description: '要素を1つずつ安全に取り出して処理します。',
        goodPattern: 'foreach (var source in activeSources) {\n    source.volume *= 0.5f;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-25',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'foreach の特徴',
        question: 'forループと比べたときの foreach の最大の利点はどれですか？',
        options: [
          { id: 'o1', text: 'インデックスの範囲外参照ミス（バグ）が絶対に起きず、コードが読みやすい', isCorrect: true, explanation: '正解！i < Length などの計算が不要なため、添字ミスによるバグが原理的に防げます。' },
          { id: 'o2', text: '途中で要素の追加や削除が自由にできる', isCorrect: false, explanation: 'foreachの実行中にコレクションの要素数を変更すると例外エラーになります。' }
        ],
        soundContext: 'ボイスプールの一括操作'
      }
    ]
  },
  {
    id: 'cs-26-multidim',
    track: 'csharp',
    phase: 'フェーズ3: 配列と繰り返しループ',
    title: '26. ステレオ2ch配列: L/Rチャンネルの分離表現',
    subtitle: 'ジャグ配列 float[][] と 2次元配列',
    iconName: 'Columns',
    category: 'C# 基礎',
    summary: '左チャンネル `buffer[0][i]` と右チャンネル `buffer[1][i]` のように、マルチチャンネル音声をメモリ上に配置する構造を学びます。',
    soundDesignerPerspective: 'VST3やUnity Native Audioのプラグインでは、左右のバッファが別々の配列（Non-interleaved形式）で渡されるため、この構造の理解が必須です。',
    keyConcepts: [
      {
        name: 'ステレオバッファの表現',
        description: 'float[][] でチャンネルごとの配列を保持します。',
        goodPattern: 'float[][] stereoBuffer = new float[2][];\nstereoBuffer[0] = new float[512]; // Lチャンネル\nstereoBuffer[1] = new float[512]; // Rチャンネル'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-26',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '右チャンネルの先頭サンプルへのアクセス',
        question: '上記 `stereoBuffer` の「右チャンネル（R）の一番最初のサンプル」を指す正しい式はどれですか？',
        options: [
          { id: 'o1', text: 'stereoBuffer[1][0]', isCorrect: true, explanation: '正解！0がL、1がRなので、右チャンネルの0番目サンプルは `[1][0]` です。' },
          { id: 'o2', text: 'stereoBuffer[0][1]', isCorrect: false, explanation: 'これはLチャンネルの2番目のサンプルになってしまいます。' }
        ],
        soundContext: 'DAWステレオ処理の規格'
      }
    ]
  },

  // ==========================================
  // 【フェーズ4: 関数（メソッド）と引数設計】 (トピック 27〜34)
  // ==========================================
  {
    id: 'cs-27-methods',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '27. メソッドの基本: PlaySound() の設計',
    subtitle: '一連の処理に名前をつけて再利用可能にする',
    iconName: 'Play',
    category: 'C# 基礎',
    summary: 'プログラミングの最重要概念「メソッド（関数）」。音を鳴らす処理を1箇所にまとめ、いつでも呼び出せるようにします。',
    soundDesignerPerspective: '何度も同じコードをコピペするのをやめ、「PlaySound("Laser")」と1行書くだけで誰でも音を鳴らせるようにする窓口です。',
    soundJargon: [
      {
        term: 'メソッド (Method / 関数)',
        analogy: 'エフェクターの「フットスイッチ」「プリセットボタン」',
        explanation: '押すと決められた仕事（音を鳴らす、計算するなど）を一瞬で実行してくれる命令のまとまりです。'
      }
    ],
    keyConcepts: [
      {
        name: 'メソッドの定義',
        description: '戻り値の型 + メソッド名 + (引数) で定義します。',
        goodPattern: 'void PlayExplosion() {\n    // 爆発音の再生処理\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-27',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'メソッド呼び出しの記法',
        question: '定義したメソッド `PlayExplosion` を実行するための正しい呼び出し方はどれですか？',
        options: [
          { id: 'o1', text: 'PlayExplosion();', isCorrect: true, explanation: '正解！メソッド名の後ろに丸括弧 () を付けてセミコロンで呼び出します。' },
          { id: 'o2', text: 'PlayExplosion;', isCorrect: false, explanation: '括弧がないと呼び出しになりません。' }
        ],
        soundContext: 'SE発声処理の呼び出し'
      }
    ]
  },
  {
    id: 'cs-28-arguments',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '28. 引数 (ひきすう): 音量とピッチを受け取るインプット',
    subtitle: '呼び出し元からメソッドへパラメータを渡す',
    iconName: 'Sliders',
    category: 'C# 基礎',
    summary: '「どの音を」「どれくらいの音量で」鳴らすかを、メソッドの括弧の中に渡す「引数」の仕組みを学びます。',
    soundDesignerPerspective: 'エフェクターのつまみに外部からCV（コントロールボルテージ）信号を入力するのと同じ感覚です。',
    soundJargon: [
      {
        term: '引数 (ひきすう / Parameter)',
        analogy: '機材のINPUT端子・ツマミの目盛り入力',
        explanation: 'メソッドに「この数値を使って仕事をしてね」と渡すデータ材料のことです。'
      }
    ],
    keyConcepts: [
      {
        name: '引数付きメソッド',
        description: '括弧内に `型 引数名` をカンマ区切りで宣言します。',
        goodPattern: 'void PlaySound(int soundId, float volume) {\n    // soundId と volume を使って再生\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-28',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '引数の順序と型一致',
        question: '`void PlaySound(int id, float vol)` に対する正しい呼び出しはどれですか？',
        options: [
          { id: 'o1', text: 'PlaySound(105, 0.8f);', isCorrect: true, explanation: '正解！第1引数にint（105）、第2引数にfloat（0.8f）を正しく渡しています。' },
          { id: 'o2', text: 'PlaySound(0.8f, 105);', isCorrect: false, explanation: '引数の順番が逆のため、型不一致エラーになります。' }
        ],
        soundContext: 'サウンドAPI設計'
      }
    ]
  },
  {
    id: 'cs-29-return',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '29. 戻り値 (return): ゲイン計算結果のアウトプット',
    subtitle: '計算した結果を呼び出し元へ送り返す',
    iconName: 'ArrowUpRight',
    category: 'C# 基礎',
    summary: '「距離に応じた音量減衰率」を計算し、その結果の数値を呼び出し元へ戻す `return` の仕組みを学びます。',
    soundDesignerPerspective: 'エフェクターに信号を入力したら、処理されたオーディオ信号が出力端子から出てくるのと同じです。',
    soundJargon: [
      {
        term: '戻り値 (Return value)',
        analogy: '機材のOUTPUT端子から出てくる処理結果',
        explanation: 'メソッドが仕事を終えた後に、呼び出した側へ「はい、計算結果だよ」と渡してくれる値です。'
      }
    ],
    keyConcepts: [
      {
        name: '戻り値の指定とreturn文',
        description: '先頭に戻り値の型を書き、メソッド内で `return 値;` します。',
        goodPattern: 'float CalculateAttenuation(float distance) {\n    return 1.0f / (distance + 1.0f);\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-29',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'return文の働き',
        question: 'メソッド内で `return;` が実行されるとどうなりますか？',
        options: [
          { id: 'o1', text: '値を返し、その時点でメソッドの処理を終了して呼び出し元に戻る', isCorrect: true, explanation: '正解！returnが実行されると、その行以降の処理はスキップされて即座に戻ります。' },
          { id: 'o2', text: '最初からもう一度メソッドを実行する', isCorrect: false, explanation: '最初に戻るわけではありません。' }
        ],
        soundContext: '3Dオーディオ距離減衰計算'
      }
    ]
  },
  {
    id: 'cs-30-void',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '30. void型: 結果を返さないアクション命令',
    subtitle: '「鳴らせ」「止めろ」のワンウェイ命令',
    iconName: 'Square',
    category: 'C# 基礎',
    summary: '計算結果を返す必要がなく、ただ「SEを停止する」「フラグを立てる」といった命令を行う `void` メソッドを学びます。',
    soundDesignerPerspective: '`StopAllSounds()` のように、命令するだけで何か値を受け取る必要がない関数に指定します。',
    soundJargon: [
      {
        term: 'void (ボイド)',
        analogy: 'トリガーボタン (値を返さず、押すだけで発火するスイッチ)',
        explanation: '「戻り値（返事）はありません、仕事だけします」という宣言です。'
      }
    ],
    keyConcepts: [
      {
        name: 'voidメソッド',
        description: '戻り値の型に void を指定します。return で値を返すことはできません。',
        goodPattern: 'void StopBgm() {\n    audioSource.Stop();\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-30',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'void型メソッドの代入',
        question: '`void StopSound()` というメソッドに対し、`float result = StopSound();` と書くと何が起きますか？',
        options: [
          { id: 'o1', text: 'void は値を返さないため、代入できずコンパイルエラーになる', isCorrect: true, explanation: '正解！void型のメソッドは結果を出力しないため、変数に受け取ることはできません。' },
          { id: 'o2', text: 'result に 0 が入る', isCorrect: false, explanation: '0すら返さないのが void です。' }
        ],
        soundContext: '発声停止命令'
      }
    ]
  },
  {
    id: 'cs-31-default-args',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '31. デフォルト引数: 音量1.0fを規定値にする便利機能',
    subtitle: '引数の省略を可能にする設計',
    iconName: 'ListPlus',
    category: 'C# 基礎',
    summary: '`PlaySound(soundId, volume = 1.0f)` のように、普段は音量1.0fで良いときに呼び出し側の記述を省略できる記法を学びます。',
    soundDesignerPerspective: '日常的に呼ぶメソッドで引数を省略できると、コードの記述量が減り非常に快適になります。',
    keyConcepts: [
      {
        name: 'デフォルト引数の宣言',
        description: '引数の後ろに `= 規定値` を付けます（必ず引数リストの末尾に配置）。',
        goodPattern: 'void PlaySe(int id, float volume = 1.0f, float pitch = 1.0f) {\n    // ...\n}\n// 呼び出し側:\nPlaySe(101); // volumeもpitchも1.0fで再生される'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-31',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'デフォルト引数の呼び出し',
        question: '上の `PlaySe(int id, float volume = 1.0f)` を `PlaySe(50, 0.5f);` と呼んだ場合、volume の値は何になりますか？',
        options: [
          { id: 'o1', text: '0.5f (明示的に指定した値が優先される)', isCorrect: true, explanation: '正解！引数を渡した場合はその値が使われ、省略した時だけ規定値（1.0f）になります。' },
          { id: 'o2', text: '1.0f', isCorrect: false, explanation: '指定した場合は指定値が優先されます。' }
        ],
        soundContext: '使いやすいサウンドAPI設計'
      }
    ]
  },
  {
    id: 'cs-32-overload',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '32. メソッドのオーバーロード: 同名関数の多重定義',
    subtitle: 'IDでも文字列名でも呼べる柔軟なAPI',
    iconName: 'Copy',
    category: 'C# 基礎',
    summary: '同じ名前の `PlaySound(int id)` と `PlaySound(string cueName)` を両方用意し、状況に応じて使い分けられるようにします。',
    soundDesignerPerspective: '「プログラマーはIDで高速に呼びたい」「サウンドデザイナーはCue名文字列で分かりやすく呼びたい」という両方のニーズに応えます。',
    keyConcepts: [
      {
        name: 'オーバーロードの条件',
        description: 'メソッド名は同じで、引数の型や個数が異なる必要があります。',
        goodPattern: 'void Play(int soundId) { /* IDで再生 */ }\nvoid Play(string soundName) { /* 名前で再生 */ }'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-32',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'オーバーロードの解決',
        question: '`Play("Explosion")` を呼んだ場合、コンパイラはどちらのメソッドを実行しますか？',
        options: [
          { id: 'o1', text: '引数に string を受け取る `Play(string soundName)`', isCorrect: true, explanation: '正解！渡した引数の型に最もマッチするメソッドが自動的に選ばれます。' },
          { id: 'o2', text: 'どちらが呼ばれるかランダムで決まる', isCorrect: false, explanation: '型によって厳密に決定されます。' }
        ],
        soundContext: 'ミドルウェアAPIの親切設計'
      }
    ]
  },
  {
    id: 'cs-33-static',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '33. staticメソッド: デシベル(dB)変換などの共有計算機',
    subtitle: 'new しなくてもどこからでも呼べる関数',
    iconName: 'Zap',
    category: 'C# 基礎',
    summary: '機材の実体を作らなくても、`AudioMath.DbToLinear(-6.0f)` のようにどこからでも呼べる汎用計算メソッドを学びます。',
    soundDesignerPerspective: 'dBから振幅への変換や、MIDIノートから周波数への計算など、計算式そのものを共有する際に最適です。',
    soundJargon: [
      {
        term: 'static (静的)',
        analogy: 'スタジオの壁に貼られた「周波数換算早見表」',
        explanation: '機材をいちいち机に出さなくても、いつでも誰でも見れる共有ツールです。'
      }
    ],
    keyConcepts: [
      {
        name: 'static メソッドの定義',
        description: 'クラス名.メソッド名() で呼び出します。',
        goodPattern: 'public static class AudioMath {\n    public static float DbToLinear(float db) {\n        return MathF.Pow(10.0f, db / 20.0f);\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-33',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'staticメソッドの呼び出し',
        question: '上記 `AudioMath` クラスの `DbToLinear` を呼び出す正しい書き方はどれですか？',
        options: [
          { id: 'o1', text: 'AudioMath.DbToLinear(-6.0f);', isCorrect: true, explanation: '正解！new することなく「クラス名.メソッド名」で直接呼び出せます。' },
          { id: 'o2', text: 'new AudioMath().DbToLinear(-6.0f);', isCorrect: false, explanation: 'staticクラスは new できません。' }
        ],
        soundContext: 'オーディオ共通計算ライブラリ'
      }
    ]
  },
  {
    id: 'cs-34-ref-in',
    track: 'csharp',
    phase: 'フェーズ4: 関数（メソッド）と引数設計',
    title: '34. 参照渡し in / ref: ゼロコピー高速化の秘密',
    subtitle: '大きな構造体を複製せずにメモリアドレスで渡す',
    iconName: 'ArrowRight',
    category: 'C# 基礎',
    summary: '大きな音響設定データをメソッドに渡す際、メモリを複製（コピー）せずにアドレスだけを渡す `in` 修飾子を学びます。',
    soundDesignerPerspective: '毎フレームの再生リクエストでメモリの丸ごとコピーが発生するとCPU負荷が跳ね上がります。`in` を使うことでゼロコストでデータを引き渡せます。',
    keyConcepts: [
      {
        name: 'in 引数（読み取り専用参照渡し）',
        description: '複製せず、書き換えも防止する最高速の渡し方です。',
        goodPattern: 'void PlaySound(in SoundPlayRequest request) {\n    // request はコピーされず高速に参照される\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-34',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'in 修飾子の効果',
        question: 'メソッドの引数に `in` を付ける最大のメリットは何ですか？',
        options: [
          { id: 'o1', text: '構造体のメモリコピーが発生せず高速になり、かつ中身の誤改変も防げる', isCorrect: true, explanation: '正解！パフォーマンス向上と安全性の両方を手に入れる現場の必須イディオムです。' },
          { id: 'o2', text: '引数の値が自動的に 0 にリセットされる', isCorrect: false, explanation: 'リセットされるわけではありません。' }
        ],
        soundContext: '高負荷ゲームオーディオエンジン'
      }
    ]
  },

  // ==========================================
  // 【フェーズ5: 構造体(struct)とクラス(class)の基礎】 (トピック 35〜42)
  // ==========================================
  {
    id: 'cs-35-struct-decl',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '35. struct（構造体）の基本: パッチケーブルのような軽量データ',
    subtitle: '値型としてスタックで完結するデータ構造',
    iconName: 'Box',
    category: 'C# 基礎',
    summary: '「音量」「ピッチ」「パン」などのパラメータを1つにまとめる `struct` を学びます。',
    soundDesignerPerspective: 'structはスタック領域（机の上）で完結するため、**ガベージコレクション（GC）のゴミが一切出ず、音飛びノイズを防ぐ最強の味方**です。',
    soundJargon: [
      {
        term: 'struct (構造体)',
        analogy: 'パッチケーブルやプラグの規格（軽量な接続具）',
        explanation: '複数のパラメータをコンパクトにまとめた箱。使い終わるとその場で消えるためGCゴミになりません。'
      }
    ],
    keyConcepts: [
      {
        name: 'struct の定義',
        description: 'struct キーワードで定義します。',
        goodPattern: 'public struct VoiceParam {\n    public float Volume;\n    public float Pitch;\n    public float Pan;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-35',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'struct のメモリ配置',
        question: 'struct で定義されたデータがメソッド内でローカル変数として作られたとき、どこに配置されますか？',
        options: [
          { id: 'o1', text: 'スタック領域 (GCの対象外で即座に解放される)', isCorrect: true, explanation: '正解！スタックに配置されるためGCが走らず、オーディオスレッドでも安全です。' },
          { id: 'o2', text: 'マネージドヒープ領域 (GCが回収する)', isCorrect: false, explanation: 'ヒープに配置されるのは class です。' }
        ],
        soundContext: 'GCスパイク撲滅の第一歩'
      }
    ]
  },
  {
    id: 'cs-36-class-decl',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '36. class（クラス）の基本: ハードウェア機材の設計図',
    subtitle: '状態と振る舞いを併せ持つ参照型',
    iconName: 'Cpu',
    category: 'C# 基礎',
    summary: '「サウンドマネージャー」や「シンセサイザー」のように、長期間生き残り複雑な状態を管理する `class` の設計を学びます。',
    soundDesignerPerspective: 'クラスは「Moogシンセの回路図」です。これをもとに実機（インスタンス）を組み立てて使います。',
    soundJargon: [
      {
        term: 'class (クラス)',
        analogy: '音響機材の「設計図・回路図」',
        explanation: 'どんなパーツ（変数）を持ち、どんな音を出す（メソッド）かを定義した設計書です。'
      }
    ],
    keyConcepts: [
      {
        name: 'class の定義',
        description: 'class キーワードで定義します。',
        goodPattern: 'public class SoundManager {\n    public float MasterVolume = 1.0f;\n    public void StopAll() { /* ... */ }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-36',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'class と struct の最大の違い',
        question: 'C#において、class は「参照型」、struct は何型ですか？',
        options: [
          { id: 'o1', text: '値型 (Value Type)', isCorrect: true, explanation: '正解！structは「値そのもの」を持ち、classは「置いてある場所（参照アドレス）」を持ちます。' },
          { id: 'o2', text: 'ポインタ型', isCorrect: false, explanation: 'C#の基本用語では「値型」と呼びます。' }
        ],
        soundContext: 'メモリ構造の最重要理解'
      }
    ]
  },
  {
    id: 'cs-37-instance',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '37. インスタンス化 (new): 設計図から実機を生み出す',
    subtitle: 'メモリ上に実体（オブジェクト）を構築する',
    iconName: 'PlusCircle',
    category: 'C# 基礎',
    summary: 'クラスという設計図をもとに、`new SoundManager()` で実際にメモリ上に機材の実機（インスタンス）を配置する流れを学びます。',
    soundDesignerPerspective: '設計図が1枚あれば、スタジオにシンセ実機を1台でも3台でも並べることができます。',
    soundJargon: [
      {
        term: 'インスタンス (Instance / 実体)',
        analogy: 'スタジオの机に実際に置かれた「実機（電源ON）」',
        explanation: 'クラス（設計図）をもとに new してヒープ上に実体化させたオブジェクトのことです。'
      }
    ],
    keyConcepts: [
      {
        name: 'new によるインスタンス化',
        description: 'クラス名 変数名 = new クラス名(); で作ります。',
        goodPattern: 'SoundManager manager = new SoundManager();\nmanager.MasterVolume = 0.8f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-37',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'new のメモリ確保場所',
        question: 'class を new してインスタンス化した実体は、どのメモリ領域に確保されますか？',
        options: [
          { id: 'o1', text: 'マネージドヒープ領域 (Managed Heap)', isCorrect: true, explanation: '正解！ヒープ領域に実体が置かれ、変数はそこへの「参照アドレス」を保持します。' },
          { id: 'o2', text: 'ROM領域', isCorrect: false, explanation: 'ヒープ領域に動的確保されます。' }
        ],
        soundContext: 'メモリリークとGCの理解'
      }
    ]
  },
  {
    id: 'cs-38-encapsulation',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '38. カプセル化 (public / private): 機材の裏蓋をネジ止めする',
    subtitle: '不要な外部アクセスを遮断してバグを防ぐ',
    iconName: 'Lock',
    category: 'C# 基礎',
    summary: '大切な基板（内部変数）を `private` にし、外部から勝手に音量をいじられて音割れするのを防ぐ「カプセル化」を学びます。',
    soundDesignerPerspective: '外部のプログラマーが勝手にマスターゲインを100倍にしてスピーカーを壊さないよう、安全なつまみ（メソッド）だけを公開します。',
    soundJargon: [
      {
        term: 'カプセル化 (Encapsulation)',
        analogy: '機材のバックパネルを閉めて、危険な回路を隠すこと',
        explanation: '勝手に触られたくないデータを隠し、安全な操作窓口だけを開放する設計手法です。'
      }
    ],
    keyConcepts: [
      {
        name: 'アクセス修飾子の使い分け',
        description: '外部公開は public、内部専用は private にします。',
        goodPattern: 'public class AudioPlayer {\n    private float internalGain = 1.0f; // 外部からは触れない\n    public void SetGain(float g) { internalGain = Math.Clamp(g, 0f, 1f); }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-38',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'private 変数へのアクセス',
        question: '他のクラスから `private float internalGain` に直接アクセスしようとするとどうなりますか？',
        options: [
          { id: 'o1', text: 'アクセス保護レベルによりコンパイルエラーになる', isCorrect: true, explanation: '正解！コンパイラが外部からの不正な変更をブロックしてくれます。' },
          { id: 'o2', text: '警告が出るが値は変更できる', isCorrect: false, explanation: 'privateは外部から一切触れません。' }
        ],
        soundContext: '堅牢なオーディオシステム設計'
      }
    ]
  },
  {
    id: 'cs-39-properties',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '39. プロパティ (get / set): リミッター付き音量つまみ',
    subtitle: '値の読み書き時に自動で安全チェックを挟む',
    iconName: 'Sliders',
    category: 'C# 基礎',
    summary: '変数のように読み書きできつつ、裏で自動的に「0.0〜1.0に数値をクランプする」処理を挟めるプロパティ構文をマスターします。',
    soundDesignerPerspective: 'どんな過大入力が来ても、プロパティの set の中で自動的に `Math.Clamp` して音割れを防止できます。',
    keyConcepts: [
      {
        name: 'プロパティの書き方',
        description: 'get で返し、set で value を検査して代入します。',
        goodPattern: 'private float _volume;\npublic float Volume {\n    get => _volume;\n    set => _volume = Math.Clamp(value, 0.0f, 1.0f);\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-39',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'set アクセサー内の value',
        question: '`Volume = 1.5f;` と代入されたとき、setブロック内で渡された値（1.5f）を表すキーワードは何ですか？',
        options: [
          { id: 'o1', text: 'value', isCorrect: true, explanation: '正解！setの中では代入された値が暗黙の引数 `value` に入ってきます。' },
          { id: 'o2', text: 'input', isCorrect: false, explanation: 'C#の予約語は value です。' }
        ],
        soundContext: '自動リミッタープロパティ'
      }
    ]
  },
  {
    id: 'cs-40-constructors',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '40. コンストラクタ: 電源投入時の初期キャリブレーション',
    subtitle: 'インスタンス生成時に自動で一度だけ動く初期化関数',
    iconName: 'Power',
    category: 'C# 基礎',
    summary: '`new SoundVoice(44100, 2)` のように、機材を作った瞬間にサンプリングレートやチャンネル数を初期設定するコンストラクタを学びます。',
    soundDesignerPerspective: '初期化忘れによるNULL参照や音が出ないバグを100%撲滅するための必須機能です。',
    soundJargon: [
      {
        term: 'コンストラクタ (Constructor)',
        analogy: '機材の「工場出荷時キャリブレーション・電源投入シーケンス」',
        explanation: 'new した瞬間に最初に自動実行され、初期値をセットアップしてくれる特別なメソッドです。'
      }
    ],
    keyConcepts: [
      {
        name: 'コンストラクタの定義',
        description: '戻り値の型を書かず、クラス名と同じ名前で定義します。',
        goodPattern: 'public class SoundVoice {\n    public int SampleRate;\n    public SoundVoice(int sr) {\n        SampleRate = sr; // 初期設定\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-40',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'コンストラクタの戻り値',
        question: 'コンストラクタの戻り値の型として正しいものはどれですか？',
        options: [
          { id: 'o1', text: '戻り値の型は一切書かない (voidすら書かない)', isCorrect: true, explanation: '正解！コンストラクタはインスタンス自身を生成するため、戻り値の型は記述しません。' },
          { id: 'o2', text: 'void と書く', isCorrect: false, explanation: 'void と書くと通常のメソッドとみなされてしまいます。' }
        ],
        soundContext: 'ボイスクラスの安全な初期化'
      }
    ]
  },
  {
    id: 'cs-41-this',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '41. thisキーワード: 「自分自身」の機材パラメータを指す',
    subtitle: '同名の引数とフィールドを明確に区別する',
    iconName: 'UserCheck',
    category: 'C# 基礎',
    summary: 'クラスの変数名とメソッド引数の名前が同じになったとき、`this.volume = volume;` と書いて自分自身の変数を明確に指名する構文を学びます。',
    soundDesignerPerspective: '現場のコードで最もよく見かける定番イディオムです。',
    keyConcepts: [
      {
        name: 'this の役割',
        description: '自分自身のインスタンスを指します。',
        goodPattern: 'public class Mixer {\n    private float volume;\n    public void SetVolume(float volume) {\n        this.volume = volume; // this.がクラス側の変数\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-41',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'this の意味',
        question: '`this.volume` と書いたときの `this` は何を指していますか？',
        options: [
          { id: 'o1', text: '現在コードを実行している自分自身のインスタンス', isCorrect: true, explanation: '正解！自分自身の機材のパラメータを指します。' },
          { id: 'o2', text: '呼び出し元の別のクラス', isCorrect: false, explanation: '自分自身を指します。' }
        ],
        soundContext: 'クラス内パラメータ設定'
      }
    ]
  },
  {
    id: 'cs-42-readonly-struct',
    track: 'csharp',
    phase: 'フェーズ5: 構造体(struct)とクラス(class)の基礎',
    title: '42. readonly struct: 究極のゼロアロケーション不変データ',
    subtitle: 'オーディオスレッドの音飛びノイズを撲滅する最強の防壁',
    iconName: 'ShieldAlert',
    category: 'C# 基礎',
    summary: '作成後に一切書き換えられない不変構造体 `readonly struct` を学び、UnityやCRIの現場で最高パフォーマンスを叩き出す手法を理解します。',
    soundDesignerPerspective: '防御的コピーのオーバーヘッドを無くし、GCアロケーションゼロを保証するための現代C#の重要技術です。',
    keyConcepts: [
      {
        name: 'readonly struct の定義',
        description: 'すべてのフィールドが読み取り専用になり、コンパイラが限界まで最適化します。',
        goodPattern: 'public readonly struct AudioTriggerEvent {\n    public readonly int SoundId;\n    public readonly float Volume;\n    public AudioTriggerEvent(int id, float vol) {\n        SoundId = id;\n        Volume = vol;\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-42',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'readonly struct の安全性',
        question: 'readonly struct 内のフィールドを、生成後に `event.Volume = 0.5f;` と書き換えようとするとどうなりますか？',
        options: [
          { id: 'o1', text: '不変（イミュータブル）のためコンパイルエラーになる', isCorrect: true, explanation: '正解！後からの誤変更を防ぎ、スレッドセーフ（並行処理でも安全）になります。' },
          { id: 'o2', text: '普通に書き換わる', isCorrect: false, explanation: 'readonlyなので書き換え不可です。' }
        ],
        soundContext: 'ゲームオーディオのマルチスレッド安全性'
      }
    ]
  },

  // ==========================================
  // 【フェーズ6: サウンド制御の実践初級】 (トピック 43〜50)
  // ==========================================
  {
    id: 'cs-43-enum',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '43. enum（列挙型）: サウンドカテゴリのスマートな整理',
    subtitle: 'BGM, SE, Voice, UI を名前付き定数で管理する',
    iconName: 'Tag',
    category: 'C# 基礎',
    summary: '0や1といった謎の数字（マジックナンバー）を使わず、`SoundCategory.BGM` のように意味のある名前でバスやカテゴリを定義します。',
    soundDesignerPerspective: 'ミキサーのサブグループ（BGMバス、SEバス、ボイスバス）のルーティングを組む際の標準です。',
    soundJargon: [
      {
        term: 'enum (イーナム / 列挙型)',
        analogy: 'ミキサーの「BUSセレクトスイッチ (BGM / SE / VOICE)」',
        explanation: 'あらかじめ決められた選択肢の中から1つを選ばせるための名前付きリストです。'
      }
    ],
    keyConcepts: [
      {
        name: 'enum の定義と使用',
        description: 'enum キーワードで選択肢を並べます。',
        goodPattern: 'public enum SoundBus { Master, BGM, SE, Voice, Ambient }\nvoid SetBusVolume(SoundBus bus, float volume) { /* ... */ }'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-43',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'enum のメリット',
        question: 'int型でバス番号（0, 1, 2）を渡す代わりに enum を使う最大のメリットは何ですか？',
        options: [
          { id: 'o1', text: '存在しないバス番号（999など）を誤って渡すミスを防ぎ、コードの意味が一目で分かる', isCorrect: true, explanation: '正解！型安全（Type Safety）が保たれ、オートコンプリートも効くためバグが劇的に減ります。' },
          { id: 'o2', text: '音質が劇的に向上する', isCorrect: false, explanation: '音質ではなくプログラムの安全性と可読性の向上です。' }
        ],
        soundContext: 'DAW・ゲームのオーディオバス設計'
      }
    ]
  },
  {
    id: 'cs-44-list',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '44. List<T> コレクション: 動的に増減する発音ボイス管理',
    subtitle: 'サイズが自由自在に伸び縮みする可変長リスト',
    iconName: 'List',
    category: 'C# 基礎',
    summary: 'ゲーム中に発音中のボイスが次々と追加・削除される際、サイズが固定の配列よりも柔軟に扱える `List<T>` を学びます。',
    soundDesignerPerspective: '同時発音中のSEをプールし、再生が終わったものからリストから除外する管理に直結します。',
    keyConcepts: [
      {
        name: 'List<T> の操作',
        description: 'Add() で追加、Remove() で削除、Count で現在の要素数を取得します。',
        goodPattern: 'List<AudioSource> activeVoices = new List<AudioSource>();\nactiveVoices.Add(newSource); // ボイス追加\nactiveVoices.Remove(finishedSource); // 終了ボイス除外'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-44',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'Listの要素数取得',
        question: '配列では `.Length` で要素数を調べましたが、List<T> で現在の登録件数を調べるプロパティは何ですか？',
        options: [
          { id: 'o1', text: '.Count', isCorrect: true, explanation: '正解！Listでは .Count プロパティを使用します。' },
          { id: 'o2', text: '.Length', isCorrect: false, explanation: 'Length は固定長配列用です。' }
        ],
        soundContext: 'アクティブボイス数の監視'
      }
    ]
  },
  {
    id: 'cs-45-dictionary',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '45. Dictionary<K, V>: サウンド名から音源を爆速検索',
    subtitle: '「キー（Cue名）」と「値（AudioClip）」の連想配列',
    iconName: 'Book',
    category: 'C# 基礎',
    summary: '何百曲もあるサウンドの中から、"BGM_Battle" という名前をキーにして一瞬（O(1)）で音源データを検索できる辞書構造を学びます。',
    soundDesignerPerspective: '毎回リストを端から探す（ループ検索）と重くなりますが、Dictionaryなら一瞬で目的の波形を引き当てられます。',
    soundJargon: [
      {
        term: 'Dictionary (辞書 / 連想配列)',
        analogy: '効果音ライブラリのインデックス検索システム',
        explanation: '「音の名前（キー）」を指定すると、中に入っている「オーディオデータ（値）」が瞬時に取り出せる箱です。'
      }
    ],
    keyConcepts: [
      {
        name: 'Dictionary の定義と取得',
        description: '`dict[キー]` または `TryGetValue` で高速検索します。',
        goodPattern: 'var soundBank = new Dictionary<string, AudioClip>();\nif (soundBank.TryGetValue("Hit_Sword", out AudioClip clip)) {\n    Play(clip);\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-45',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '辞書検索の安全対策',
        question: '存在しないキー `soundBank["NonExistent"]` を直接参照しようとするとどうなりますか？',
        options: [
          { id: 'o1', text: 'KeyNotFoundException エラーで落ちるため、TryGetValue を使うのが安全', isCorrect: true, explanation: '正解！キーの存在が不確実な現場では TryGetValue を使うのがプロの鉄則です。' },
          { id: 'o2', text: 'null が返ってくるだけでエラーにはならない', isCorrect: false, explanation: 'インデクサ直接アクセスは例外エラーを投げます。' }
        ],
        soundContext: 'サウンドバンク管理'
      }
    ]
  },
  {
    id: 'cs-46-action-events',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '46. Action と イベント: 再生終了コールバックの基礎',
    subtitle: '疎結合（スパゲッティコード防止）の通知パターン',
    iconName: 'Bell',
    category: 'C# 基礎',
    summary: '「SEの再生が終わったら自動で次のジングルを鳴らす」といった通知を、コード同士を直接密結合させずにやり取りする `Action` を学びます。',
    soundDesignerPerspective: '「プレイヤーが死んだらBGMを止める」をプレイヤーのコード内に直書きせず、イベント購読で受け取ることで綺麗なサウンドシステムを維持できます。',
    soundJargon: [
      {
        term: 'Action (アクション) / イベント',
        analogy: 'MIDIクロック / パッチシンク信号のトリガー出力',
        explanation: '「何かが終わったよ！」「発音したよ！」という合図を他の誰かに飛ばす通知ラインです。'
      }
    ],
    keyConcepts: [
      {
        name: 'Action の定義と発火',
        description: '`Action onComplete;` を用意し、終了時に `onComplete?.Invoke();` で呼び出します。',
        goodPattern: 'public static event Action OnPlayerFootstep;\n// サウンドマネージャ側で購読:\nOnPlayerFootstep += () => PlayFootstepSound();'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-46',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '?.Invoke() の null 安全性',
        question: '`onComplete?.Invoke();` の `?.` は何を防止するために書かれていますか？',
        options: [
          { id: 'o1', text: '誰も購読していない（nullの）ときにクラッシュするのを防ぐため', isCorrect: true, explanation: '正解！リスナーが1つも登録されていない場合でもエラーにならず安全に素通りします。' },
          { id: 'o2', text: '音量が0になるのを防ぐため', isCorrect: false, explanation: 'null安全のための構文です。' }
        ],
        soundContext: 'サウンドイベント通知'
      }
    ]
  },
  {
    id: 'cs-47-timer-bpm',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '47. タイマーとテンポ計算: BPMに同期した拍子間隔の算出',
    subtitle: '音楽的な時間（SecondsPerBeat）をコードで操る',
    iconName: 'Clock',
    category: 'C# 基礎',
    summary: 'BPM 120 の曲で「4分音符1拍は何秒か？（60.0f / BPM = 0.5秒）」を計算し、テンポ同期でサウンドをトリガーするタイマーを作ります。',
    soundDesignerPerspective: 'リズムゲームや、BGMの小節アタマに合わせた効果音・照明演出のトリガーに必須の計算です。',
    keyConcepts: [
      {
        name: 'BPMから秒への変換式',
        description: '1分(60秒)をBPMで割ると1拍の秒数が得られます。',
        goodPattern: 'float bpm = 128.0f;\nfloat secPerBeat = 60.0f / bpm; // 1拍の秒数 (約0.468秒)'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-47',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'BPM 60 のときの1拍の長さ',
        question: 'BPM 60 の楽曲において、4分音符1拍の長さ（秒）は何秒ですか？',
        options: [
          { id: 'o1', text: '1.0 秒 (60 / 60 = 1.0)', isCorrect: true, explanation: '正解！1分間に60拍なので、ちょうど1秒ごとに1拍が刻まれます。' },
          { id: 'o2', text: '0.5 秒', isCorrect: false, explanation: '0.5秒になるのは BPM 120 のときです。' }
        ],
        soundContext: 'テンポ同期ディレイ・クオンタイズ'
      }
    ]
  },
  {
    id: 'cs-48-decibel',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '48. デシベル(dB)とリニア振幅の双方向変換',
    subtitle: '耳の対数特性（Log）とプログラムのリニア計算',
    iconName: 'Activity',
    category: 'C# 基礎',
    summary: '人間の耳は対数（dB）で音量を感じますが、プログラムはリニア振幅（0.0〜1.0）で計算します。その相互変換式を実装します。',
    soundDesignerPerspective: 'Cubaseのフェーダーで「-6dB」と表示されているものを、UnityのAudioSource.volume（約0.501）に換算する必須公式です。',
    keyConcepts: [
      {
        name: 'dBとリニアの公式',
        description: 'Linear = 10^(dB/20), dB = 20 * log10(Linear)',
        goodPattern: 'float LinearToDb(float linear) => 20.0f * MathF.Log10(MathF.Max(linear, 0.0001f));\nfloat DbToLinear(float db) => MathF.Pow(10.0f, db / 20.0f);'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-48',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: '-6dB のリニア振幅',
        question: '音量を -6dB 下げたとき、リニア振幅（波形の高さ）はおよそ何倍になりますか？',
        options: [
          { id: 'o1', text: '約 0.5倍 (半分)', isCorrect: true, explanation: '正解！音響の世界では「-6dB = 振幅半分（約0.501）」が鉄則の基準値です。' },
          { id: 'o2', text: '約 0.1倍', isCorrect: false, explanation: '0.1倍は -20dB のときです。' }
        ],
        soundContext: 'ミキサーのフェーダーカーブ設計'
      }
    ],
    audioExercise: {
      id: 'ex-cs-48',
      track: 'csharp',
      title: 'dBからリニア振幅への変換関数の作成',
      description: '-12dB のアッテネーション（減衰）を計算して波形に適用します。',
      soundGoal: '-12dB（振幅約0.25倍）を適用して適度な音量に減衰させる',
      initialCode: `public void ApplyDbGain(float[] buffer, float db) {\n    // TODO: db (-12.0f) を MathF.Pow(10.0f, db / 20.0f) でリニア振幅に変換して乗算してください\n    float linearGain = MathF.Pow(10.0f, db / 20.0f);\n    for(int i = 0; i < buffer.Length; i++) {\n        buffer[i] *= linearGain;\n    }\n}`,
      solutionSnippet: `float linearGain = MathF.Pow(10.0f, db / 20.0f);`,
      dspType: 'gain_clip'
    }
  },
  {
    id: 'cs-49-statemachine',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '49. 簡易サウンドステートマシン: BGMの自動クロスフェード遷移',
    subtitle: 'ゲームシーンに応じたBGMの安全な切り替え設計',
    iconName: 'Compass',
    category: 'C# 基礎',
    summary: '「タイトル → フィールド → バトル → リザルト」と状態が移り変わる際、前の曲をフェードアウトしながら次の曲をフェードインするステート遷移を学びます。',
    soundDesignerPerspective: '曲の切り替え時にプチノイズが鳴ったり、前のBGMが鳴りっぱなしになる事故を完璧に防ぎます。',
    keyConcepts: [
      {
        name: 'ステート遷移とサウンド切り替え',
        description: '現在の状態と目標の状態を監視して安全に移行します。',
        goodPattern: 'public void ChangeBgmState(BgmState newState) {\n    if (currentState == newState) return; // 同じなら何もしない\n    StartCrossFade(currentState, newState);\n    currentState = newState;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-49',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'ステート重複遷移の防止',
        question: '既にバトルBGMが鳴っているのに再度「バトル突入」イベントが来たとき、最初に行うべき安全チェックは何ですか？',
        options: [
          { id: 'o1', text: '`if (currentState == newState) return;` で早期離脱して二重再生を防ぐ', isCorrect: true, explanation: '正解！ガード節を入れることで、曲が頭から鳴り直す不快なバグを防ぎます。' },
          { id: 'o2', text: '前の曲を無視してもう1つAudioSourceを生成する', isCorrect: false, explanation: '二重再生になり音が濁ってしまいます。' }
        ],
        soundContext: 'BGMステートマシン設計'
      }
    ]
  },
  {
    id: 'cs-50-summary',
    track: 'csharp',
    phase: 'フェーズ6: サウンド制御の実践初級',
    title: '50. 50トピック総復習: ゼロアロケーション・サウンドマネージャー骨格',
    subtitle: 'C#超初級マスター！すべての知識を結集した完成形コード',
    iconName: 'Award',
    category: 'C# 基礎',
    summary: 'これまで学んだ「型」「if/switch」「配列」「メソッド」「struct」「enum」「Dictionary」を統合し、実務で動くサウンドマネージャーの骨格を完成させます。',
    soundDesignerPerspective: 'AIに頼らず、自分の頭でゼロから「メモリを浪費せず、音飛びを起こさない美しいサウンドコード」を読み書き・改造できる実力がつきました！',
    keyConcepts: [
      {
        name: 'サウンドマネージャーの集大成',
        description: 'enumで分類し、Dictionaryで引き、readonly structでゼロアロケーション通知します。',
        goodPattern: '// サウンドマネージャーの基本骨格\npublic class SoundSystem {\n    private Dictionary<string, AudioClip> bank = new();\n    public void Play(in AudioTriggerEvent req) {\n        // 高速・安全な発音ロジック\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-50',
        track: 'csharp',
        category: 'C# 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'サウンドプログラミングの黄金律',
        question: 'リアルタイムオーディオやUnityの毎フレーム処理で最も心がけるべき原則は何ですか？',
        options: [
          { id: 'o1', text: '毎フレームの無駄なヒープメモリ確保（new）を避け、ゼロアロケーションを徹底する', isCorrect: true, explanation: '大正解！全50トピック修了おめでとうございます！メモリ構造を理解したあなたのコードは、プチノイズのない最高のサウンド体験をプレイヤーに届けます。' },
          { id: 'o2', text: 'とにかく動けば書き方は何でも良い', isCorrect: false, explanation: 'オーディオの世界ではリアルタイム性とメモリの掟が命です！' }
        ],
        soundContext: 'プロのサウンドプログラミングの境地'
      }
    ]
  }
];
