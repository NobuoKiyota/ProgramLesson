import { CurriculumTopic } from '@/types/learning';

export const INITIAL_CURRICULUM: CurriculumTopic[] = [
  // ==========================================
  // Track: C# (超初歩・基礎)
  // ==========================================
  {
    id: 'cs-basics-variables',
    track: 'csharp',
    title: '【超基礎】変数とデータ型（float, int, bool）',
    subtitle: '音量・ピッチ・再生中フラグをコードで表す基本中の基本',
    iconName: 'Sparkles',
    category: 'C# Basics',
    summary: 'プログラミングの第一歩！音量などの実数値を扱う `float`、効果音IDや番号を扱う `int`、鳴っているか否かを扱う `bool` の3大基本型をマスターします。',
    soundDesignerPerspective: 'Cubaseのフェーダー（0.0〜1.0）やノブの回転角はすべて「float」、MIDIノート番号（60=C4）は「int」、ミュート状態は「bool」です。サウンドのパラメータはすべてこの3つの箱に入っています。',
    keyConcepts: [
      {
        name: 'float（実数・浮動小数点数）',
        description: '音量（0.8f）や再生速度（1.25f）、周波数（440.0f）などを扱う型。数値の後ろに `f` を付けるのがC#の決まりです。',
        goodPattern: 'float volume = 0.75f; // 75%の音量\nfloat pitch = 1.0f;   // 等倍速'
      },
      {
        name: 'int（整数）と bool（真偽値）',
        description: 'トラック番号やサウンドIDなどの端数がない数は `int`。再生中（true）か停止中（false）かのON/OFFは `bool` です。',
        goodPattern: 'int soundId = 101;     // 発音するSEのID\nbool isPlaying = true; // 現在再生中か'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-var-1',
        track: 'csharp',
        category: 'C# Basics',
        difficulty: 'beginner',
        type: 'choice',
        title: '音量を保持する適切なデータ型',
        question: 'UnityでAudioSourceの音量（0.0 から 1.0 の間の細かな小数値）を変数に保持したい場合、最も適切なデータ型はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'float (例: float currentVol = 0.8f;)',
            isCorrect: true,
            explanation: '正解！0.8 や 0.05 などの小数を扱うには `float` 型を使用します。末尾に `f` を忘れないようにしましょう。'
          },
          {
            id: 'opt2',
            text: 'int (例: int currentVol = 1;)',
            isCorrect: false,
            explanation: 'intは整数（1, 2, 3...）しか保持できないため、0.8 などの小数は切り捨てられて 0 になってしまいます！'
          },
          {
            id: 'opt3',
            text: 'bool (例: bool currentVol = true;)',
            isCorrect: false,
            explanation: 'boolは true（真）または false（偽）の2つの状態しか持てません。'
          }
        ],
        soundContext: 'フェーダー音量制御の超基本'
      }
    ],
    audioExercise: {
      id: 'ex-cs-volume',
      track: 'csharp',
      title: 'マスター音量（float volume）による増幅と減衰',
      description: 'float型の音量変数 `volume` を各サンプルに乗算して、音の大きさをコントロールします。',
      soundGoal: '音量（volume = 0.3f）を乗算して、耳に優しい適度な音量に調整する',
      initialCode: `// buffer[i] に波形サンプルが入っています。
// volume (0.0f 〜 1.0f) を乗算して音量を調整してください。
public void SetVolume(float[] buffer, float volume) {
    for (int i = 0; i < buffer.Length; i++) {
        // TODO: buffer[i] に volume を乗算してください
        buffer[i] = buffer[i] * 1.0f;
    }
}`,
      solutionSnippet: `buffer[i] = buffer[i] * volume;`,
      dspType: 'gain_clip'
    }
  },
  {
    id: 'cs-basics-conditionals',
    track: 'csharp',
    title: '【超基礎】条件分岐 (if / else) で音を切り替える',
    subtitle: '「水面なら水音」「残りHPがゼロならゲームオーバー」のロジック',
    iconName: 'Split',
    category: 'C# Basics',
    summary: 'ゲームの状況（地面の材質、プレイヤーの体力、ボス戦突入など）に応じて、再生する音響キューをダイナミックに分岐させる基礎構文 `if` と `else` を学びます。',
    soundDesignerPerspective: '「走っている時だけ足音を鳴らす」「HPが20%以下になったら心音SEを鳴らし始める」といったインタラクティブサウンドの核となるのが条件分岐です。',
    keyConcepts: [
      {
        name: 'if文による条件判定',
        description: '`if (条件式)` のカッコ内が true のときだけ中括弧 `{ }` の処理が実行されます。',
        goodPattern: 'if (isUnderwater) {\n    PlaySound("Underwater_Muffled.wav");\n} else {\n    PlaySound("Footstep_Dry.wav");\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-if-1',
        track: 'csharp',
        category: 'C# Basics',
        difficulty: 'beginner',
        type: 'choice',
        title: 'ピンチ時（瀕死状態）の警告音判定',
        question: '「プレイヤーの体力（hp）が 20 以下、かつまだ死んでいない（isAlive が true）」のときに心拍音（Heartbeat SE）を鳴らす正しいif文はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'if (hp <= 20 && isAlive)',
            isCorrect: true,
            explanation: '正解！`<=` は「以下」、`&&` は「かつ（AND）」を表します。'
          },
          {
            id: 'opt2',
            text: 'if (hp == 20 || isAlive)',
            isCorrect: false,
            explanation: 'これだと「hpが丁度20のとき」または「生きているならいつでも（HP100でも）」鳴ってしまいます。'
          },
          {
            id: 'opt3',
            text: 'if (hp > 20)',
            isCorrect: false,
            explanation: 'これは「HPが20より大きい元気なとき」になってしまいます。'
          }
        ],
        soundContext: 'ゲームのダイナミックミキシングやステート遷移の基礎'
      }
    ]
  },
  {
    id: 'cs-basics-loops',
    track: 'csharp',
    title: '【超基礎】forループ で波形配列を1つずつ処理する',
    subtitle: '1秒間に44100回並んだ音の粒を順番に操作するループの仕組み',
    iconName: 'Repeat',
    category: 'C# Basics',
    summary: 'デジタルオーディオは「数値がずらりと並んだ配列」です。その数千〜数万のサンプルを瞬時に1つずつ処理するための `for (int i = 0; i < length; i++)` を完璧に理解します。',
    soundDesignerPerspective: 'DAWの1バッファ（例: 512サンプル）の処理は、forループで0番目のサンプルから511番目まで順番に音量をかけたりエフェクトをかけたりすることで音になります。すべてのDSPの基本姿勢です。',
    keyConcepts: [
      {
        name: 'for文の3要素 (初期化; 継続条件; 増分)',
        description: '`int i = 0` で0番目から開始、`i < buffer.Length` の間繰り返し、`i++` で1つずつ次のサンプルへ進みます。',
        goodPattern: '// すべてのサンプルを0にして完全無音（ミュート）にする\nfor (int i = 0; i < buffer.Length; i++) {\n    buffer[i] = 0.0f;\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-loop-1',
        track: 'csharp',
        category: 'C# Basics',
        difficulty: 'beginner',
        type: 'choice',
        title: '配列外参照エラー（IndexOutOfRangeException）を防ぐ',
        question: '要素数が 512 個の配列 `float[] buffer` を先頭から末尾までループ処理する際、正しいループ条件はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'for (int i = 0; i < buffer.Length; i++)',
            isCorrect: true,
            explanation: '正解！インデックスは 0 〜 511 までなので、`i < 512`（または `< buffer.Length`）が正解です。'
          },
          {
            id: 'opt2',
            text: 'for (int i = 0; i <= buffer.Length; i++)',
            isCorrect: false,
            explanation: '<= にすると i = 512 に達したときに配列の範囲外（512番目のインデックスは存在しない）を踏んでクラッシュします！'
          },
          {
            id: 'opt3',
            text: 'for (int i = 1; i < buffer.Length; i++)',
            isCorrect: false,
            explanation: 'i = 1 から始めると、一番最初の「0番目のサンプル」が処理されずに取り残されてしまいます。'
          }
        ],
        soundContext: 'オーディオバッファ処理での最頻出初心者トラップ'
      }
    ]
  },

  // ==========================================
  // Track: C++ (超初歩・基礎)
  // ==========================================
  {
    id: 'cpp-basics-variables',
    track: 'cpp',
    title: '【超基礎】C++の型サイズとメモリの箱',
    subtitle: 'なぜCubaseやVSTの波形データは float（32-bit浮動小数点）なのか？',
    iconName: 'Box',
    category: 'C++ Basics',
    summary: 'C++では各データ型が「メモリを何バイト消費するか」を意識します。16-bit PCM音源（CD音質）と 32-bit float（DAW内部処理）のデータ表現の違いを学びます。',
    soundDesignerPerspective: 'CDは16-bit整数（short型: -32768〜+32767）ですが、CubaseやVSTプラグインの内部はすべて32-bit浮動小数点数（float型: -1.0f〜+1.0f）です。floatを使うことで0dBを超えても音割れせずヘッドルームを確保できる理由がコードから分かります。',
    keyConcepts: [
      {
        name: '型とメモリサイズ (sizeof)',
        description: '`char`: 1バイト, `short`: 2バイト (16-bit音源), `int`: 4バイト, `float`: 4バイト (32-bit float音源)',
        goodPattern: 'float sample = 0.0f; // 4バイトのメモリを占有\n// -1.0f 〜 +1.0f の範囲で音の振幅を表す'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-var-1',
        track: 'cpp',
        category: 'C++ Basics',
        difficulty: 'beginner',
        type: 'choice',
        title: 'DAWやVST内部で最も標準的な波形データの型',
        question: 'VST3や現代のDAWのオーディオスレッドで、波形振幅（-1.0 〜 +1.0）を表すために最も標準的に使用される型はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'float (32-bit 単精度浮動小数点数)',
            isCorrect: true,
            explanation: '正解！VST3SDKでも `float` が標準です（一部高精度モードで double もサポートされますが float が主流です）。'
          },
          {
            id: 'opt2',
            text: 'int (32-bit 整数)',
            isCorrect: false,
            explanation: 'intでは小数点以下の滑らかな波形カーブを直接表現できません。'
          },
          {
            id: 'opt3',
            text: 'char (8-bit 整数)',
            isCorrect: false,
            explanation: 'charはファミコン初期のような粗い8-bit音しか表現できず、現代の音響処理では使われません。'
          }
        ],
        soundContext: 'VST3 / AudioUnit のデータ受渡しの基本規格'
      }
    ]
  },
  {
    id: 'cpp-basics-arrays',
    track: 'cpp',
    title: '【超基礎】C++の配列とインデックスアクセス',
    subtitle: '固定配列 buffer[512] で波形を保持する感覚を掴む',
    iconName: 'ListOrdered',
    category: 'C++ Basics',
    summary: 'ポインタを学ぶ前の最重要ステップ！`float buffer[512]` のようにメモリ上に連続して並ぶ配列の構造と、`buffer[i]` でアクセスする仕組みを学びます。',
    soundDesignerPerspective: 'オーディオインターフェースのバッファサイズ（128, 256, 512サンプル）とは、まさにこの固定配列のサイズそのものです。',
    keyConcepts: [
      {
        name: '配列の宣言と初期化',
        description: '`float buffer[256] = {0.0f};` で256個のサンプルがすべて0.0f（無音）で確保されます。',
        goodPattern: 'const int BLOCK_SIZE = 256;\nfloat buffer[BLOCK_SIZE];\nfor (int i = 0; i < BLOCK_SIZE; ++i) {\n    buffer[i] = 0.0f; // 無音で初期化\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-arr-1',
        track: 'cpp',
        category: 'C++ Basics',
        difficulty: 'beginner',
        type: 'choice',
        title: 'サイズ256の配列の最後のサンプルの添字（インデックス）',
        question: '`float buffer[256];` と宣言された配列の、「一番最後のサンプル」を読み書きする正しい添字はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'buffer[255]',
            isCorrect: true,
            explanation: '正解！C++の配列は 0 から始まるため、サイズ256の末尾は 255 番目になります。'
          },
          {
            id: 'opt2',
            text: 'buffer[256]',
            isCorrect: false,
            explanation: 'buffer[256] は配列の範囲外（257個目）となり、メモリ破壊クラッシュを引き起こします！'
          },
          {
            id: 'opt3',
            text: 'buffer[0]',
            isCorrect: false,
            explanation: 'buffer[0] は一番先頭のサンプルです。'
          }
        ],
        soundContext: 'オーディオバッファ終端境界の安全管理'
      }
    ]
  },

  // ==========================================
  // Track: C# (中級・実践)
  // ==========================================
  {
    id: 'cs-memory-gc',
    track: 'csharp',
    title: '値型 vs 参照型 と GCスパイクの脅威',
    subtitle: 'Unityオーディオで音飛び（プチノイズ）を起こさないメモリの掟',
    iconName: 'Cpu',
    category: 'Memory & GC',
    summary: 'C#の構造体(struct)とクラス(class)の違い、スタックとヒープのメモリ配置、そしてオーディオ再生中に最も恐ろしいガベージコレクション(GC)停止のメカニズムを学びます。',
    soundDesignerPerspective: 'SEを毎フレーム鳴らす際、文字列結合やラムダ式、newを繰り返すとGCが走り、ゲーム全体のフレームレート低下だけでなくオーディオバッファがアンダーランを起こして「プチッ」という耳障りなノイズが生じます。CRIやUnityの現場で最重視される知識です。',
    keyConcepts: [
      {
        name: '値型 (struct) vs 参照型 (class)',
        description: 'structはスタック領域（または親オブジェクトの中）に展開され、スコープを抜けると即時解放されるためGCの対象になりません。classはマネージドヒープに確保され、GCが解放を担当します。',
        badPattern: '// 毎回の発音時にクラスインスタンスを生成（GCゴミになる）\nPlaySound(new SoundParam("hit.wav", 1.0f));',
        goodPattern: '// 読み取り専用構造体 (readonly struct) を渡し、ゼロアロケーション\npublic readonly struct SoundParam {\n    public readonly int SoundId;\n    public readonly float Volume;\n}\nPlaySound(in mySoundParam);'
      },
      {
        name: 'ボクシング (Boxing) の罠',
        description: 'intやfloat、enumなどの値型が object やインタフェース型に暗黙変換されると、ヒープ上にメモリが確保されGCゴミが発生します。',
        badPattern: '// object型を受け取るデバッグログでボクシング発生\nDebug.Log("Playing voice index: " + voiceId);',
        goodPattern: '// 事前定義や非アロケーション文字列フォーマットを使用\n// または固定バッファ・ID直指定で処理'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-gc-1',
        track: 'csharp',
        category: 'Memory & GC',
        difficulty: 'beginner',
        type: 'choice',
        title: 'GCスパイクによる音響トラブル',
        question: 'UnityのUpdate()内で毎フレーム大量の SE 発音リクエストを処理する際、最もオーディオの音飛び（バッファアンダーラン）を引き起こしやすい実装はどれですか？',
        options: [
          {
            id: 'opt1',
            text: '毎フレーム new SoundPlayRequest() を呼び出してキューに追加する',
            isCorrect: true,
            explanation: '正解！毎フレームヒープにアロケーション（new）すると、世代別GCが頻発し、CPUスパイクによってオーディオスレッドへのバッファ供給が間に合わなくなります。'
          },
          {
            id: 'opt2',
            text: '事前確保した配列（オブジェクトプール）からインデックスで取得して再利用する',
            isCorrect: false,
            explanation: 'これは推奨されるオブジェクトプールパターンであり、GCを発生させません。'
          },
          {
            id: 'opt3',
            text: 'readonly struct で定義されたリクエスト構造体を引数として渡す',
            isCorrect: false,
            explanation: '構造体はスタック上で完結するため、GCアロケーションはゼロです。'
          }
        ],
        soundContext: 'CRI ADXのボイスリミットやUnityのAudioSourceプール管理で必須の知識'
      },
      {
        id: 'q-cs-gc-2',
        track: 'csharp',
        category: 'Memory & GC',
        difficulty: 'intermediate',
        type: 'bug_hunting',
        title: '隠れたアロケーションを発見せよ',
        question: '次のUnityのサウンド監視スクリプトで、GCアロケーションを発生させてしまっている行はどれですか？',
        codeSnippet: `void Update() {
    float curVol = AudioManager.GetMasterVolume(); // 行1: float取得
    if (curVol < 0.1f) {
        NotifyAudioState("LOW_VOLUME"); // 行2: stringリテラル
    }
    Action onComplete = () => Debug.Log("SE End"); // 行3: ラムダ式の生成
}`,
        options: [
          {
            id: 'opt1',
            text: '行3: ラムダ式の Action デリゲート生成（クロージャ・インスタンス生成）',
            isCorrect: true,
            explanation: '正解！Update()内でActionをnew（またはラムダ生成）すると、毎フレームデリゲートオブジェクトがヒープに確保されGCの標的になります。'
          },
          {
            id: 'opt2',
            text: '行1: floatの取得',
            isCorrect: false,
            explanation: 'floatはプリミティブ値型なのでスタックで処理されアロケーションしません。'
          },
          {
            id: 'opt3',
            text: '行2: stringリテラル',
            isCorrect: false,
            explanation: 'stringリテラルは文字列インターン化（固定領域）されるため、実行時に新しくヒープ確保されません。'
          }
        ],
        soundContext: 'サウンドコールバックやフェード完了通知での頻出バグ'
      }
    ],
    audioExercise: {
      id: 'ex-cs-gain',
      track: 'csharp',
      title: 'ソフトクリッピング・ゲイン関数の実装',
      description: 'サウンドがクリップして不快なデジタル歪み（ハードクリップ）を起こさないよう、tanh(双曲線正接)による滑らかなサチュレーションアルゴリズムをシミュレートします。',
      soundGoal: '過大入力されたサイン波にソフトサチュレーションをかけ、温かみのある倍音を付加して音割れを防ぐ',
      initialCode: `// buffer[i] に -1.0f 〜 +1.0f の音響サンプルが入っています。
// gain を乗算したあと、MathF.Tanh でソフトクリッピングを適用してください。
public void ProcessAudio(float[] buffer, float gain) {
    for (int i = 0; i < buffer.Length; i++) {
        float sample = buffer[i] * gain;
        // TODO: sample を MathF.Tanh で圧縮して代入してください
        buffer[i] = sample; 
    }
}`,
      solutionSnippet: `buffer[i] = MathF.Tanh(sample);`,
      dspType: 'gain_clip'
    }
  },
  {
    id: 'cs-events-pinvoke',
    track: 'csharp',
    title: 'C# イベント設計 と C++ ネイティブ相互運用 (P/Invoke)',
    subtitle: 'UnityからCRI / 自作ネイティブオーディオDLLを呼び出す架け橋',
    iconName: 'Network',
    category: 'Architecture & Native',
    summary: 'C#の疎結合なイベント・Action通知パターンと、C/C++で書かれた高速オーディオライブラリ（.dll / .so）を呼び出す `[DllImport]` (P/Invoke) の仕組みを学びます。',
    soundDesignerPerspective: '市販のミドルウェア（Wwise, FMOD, CRI）やCubaseのVSTブリッジは、内部でC++ネイティブコードが動作し、C#側はそのAPIをP/Invoke経由で叩いています。ネイティブとマネージドの境界でメモリがどうマーシャリングされるかを知ると、クラッシュ時の原因特定が劇的に速くなります。',
    keyConcepts: [
      {
        name: 'Action / イベント駆動設計',
        description: 'プレイヤーの足音やUIクリックを直接AudioSourceに書くのではなく、GameEvent.OnFootstep?.Invoke() で購読させることで疎結合なサウンドシステムを構築します。',
        goodPattern: 'public static event Action<SurfaceType> OnPlayerStep;\n// サウンドマネージャ側でのみ購読'
      },
      {
        name: 'DllImport とマーシャリングのオーバーヘッド',
        description: 'C#からC++関数を呼ぶ際、引数の変換（マーシャリング）が発生します。ポインタ渡しやBlittable型（int, float, blittable struct）を使うことでゼロコピー高速呼び出しが可能です。',
        goodPattern: '[DllImport("AudioEngineNative")]\nprivate static extern void ProcessDSPBuffer(IntPtr buffer, int sampleCount);'
      }
    ],
    quizzes: [
      {
        id: 'q-cs-pinvoke-1',
        track: 'csharp',
        category: 'Architecture & Native',
        difficulty: 'intermediate',
        type: 'choice',
        title: 'C#からC++へオーディオバッファを渡す最速の手法',
        question: 'C#で生成した大容量オーディオバッファ（float[]）をC++のDSPプラグインに毎フレーム渡す際、最もオーバーヘッドが少なく安全な方法はどれですか？',
        options: [
          {
            id: 'opt1',
            text: 'fixed ステートメントでポインタを固定 (pinning) して IntPtr または float* として渡す',
            isCorrect: true,
            explanation: '正解！fixed を使うことでGCによる配列の移動を防ぎ、コピー不要（ゼロコピー）でネイティブコードに直接メモリアドレスを渡せます。'
          },
          {
            id: 'opt2',
            text: '毎回 float[] 配列を Marshal.Copy でネイティブヒープに丸ごと複製する',
            isCorrect: false,
            explanation: '複製（メモリコピー）はCPU負荷とキャッシュミスを招き、フレーム落ちの原因になります。'
          },
          {
            id: 'opt3',
            text: 'C#の List<float> をそのまま DllImport の引数に渡す',
            isCorrect: false,
            explanation: 'List<T> はマネージドクラスのため、C++側が直接メモリレイアウトを解釈できずマーシャリングエラーになります。'
          }
        ],
        soundContext: 'Unity Native Audio Plugin や自作DSP DLL作成時の最重要基礎'
      }
    ]
  },

  // ==========================================
  // Track: C++ (VST, DSP & Low-level Realtime)
  // ==========================================
  {
    id: 'cpp-pointers-buffers',
    track: 'cpp',
    title: 'ポインタ・メモリアドレス と オーディオバッファ走査',
    subtitle: 'float* buffer の正体を暴き、1サンプル単位で波形を操る',
    iconName: 'Code2',
    category: 'Pointers & Buffers',
    summary: 'C++の最も重要な概念「ポインタ」と「メモリアドレス」を、DAWやVSTプラグインのオーディオバッファ（float*）の走査を通じて直感的にマスターします。',
    soundDesignerPerspective: 'CubaseなどのDAWは、VST3プラグインに対して「44.1kHzでサンプリングされた波形データが並んだメモリの先頭アドレス（float* inBuffer, float* outBuffer）」を渡してきます。ポインタが指す先を正しく読み書きできなければ、あらゆるDSPプログラミングは始まりません。',
    keyConcepts: [
      {
        name: 'ポインタ変数とアドレス演算子 (&, *)',
        description: '`float* ptr` は「float型の値が入っているメモリアドレス」を保持する変数。`*ptr` は「そのアドレスに入っている実体」を参照（デリファレンス）します。',
        goodPattern: 'float sample = 0.5f;\nfloat* pSample = &sample; // sampleのアドレスを格納\n*pSample = 0.8f;          // アドレスの先の値を直接書き換え'
      },
      {
        name: '配列とポインタの等価性とポインタ演算',
        description: 'オーディオバッファ `buffer[i]` は、内部的には `*(buffer + i)` と全く同じです。`buffer++` で1サンプル分アドレスが進みます。',
        goodPattern: 'void ProcessMono(float* buffer, int numSamples, float gain) {\n    float* end = buffer + numSamples;\n    while (buffer < end) {\n        *buffer++ *= gain; // 最適化されやすいポインタ走査\n    }\n}'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-ptr-1',
        track: 'cpp',
        category: 'Pointers & Buffers',
        difficulty: 'beginner',
        type: 'choice',
        title: 'ポインタ演算による音量半減処理',
        question: '次のオーディオ処理関数で、ステレオ2chインターリーブ波形 (L, R, L, R...) の「左チャンネル (L) のみ」音量を半分(0.5倍)にする正しいインクリメントはどれですか？',
        codeSnippet: `void AttenuateLeftChannel(float* interleavedBuffer, int totalFrames) {
    float* p = interleavedBuffer; // Lチャンネル先頭
    for (int i = 0; i < totalFrames; i++) {
        *p *= 0.5f;
        // 次のLチャンネルに進めるための操作は？
        [ ??? ]
    }
}`,
        options: [
          {
            id: 'opt1',
            text: 'p += 2;',
            isCorrect: true,
            explanation: '正解！LとRが交互に並んでいるため、Lの次は2サンプル分先（L -> R -> L）に進める必要があります。'
          },
          {
            id: 'opt2',
            text: 'p++;',
            isCorrect: false,
            explanation: 'p++ だと次のRチャンネルを指してしまい、次回ループでRの音量を下げてしまいます。'
          },
          {
            id: 'opt3',
            text: '*p += 2.0f;',
            isCorrect: false,
            explanation: 'これはアドレスを進めるのではなく、サンプル値に2.0を加算してしまい爆音・音割れを引き起こします！'
          }
        ],
        soundContext: 'WAVファイルのインターリーブ／デインターリーブ変換の超基本'
      }
    ],
    audioExercise: {
      id: 'ex-cpp-sine',
      track: 'cpp',
      title: 'ポインタによるサイン波（440Hz A音）オシレータの生成',
      description: 'float* outBuffer に直接ポインタ走査で440HzのA音（基準ピッチ）を書き込み、ブラウザからピュアトーンを鳴らします。',
      soundGoal: '440Hzのサイン波を生成してオシロスコープに綺麗な正弦波を表示する',
      initialCode: `// outBuffer: 音声出力バッファへのポインタ
// numSamples: バッファのサンプル数 (例: 512)
// sampleRate: サンプリング周波数 (44100.0f)
// freq: 440.0f (Hz)
void GenerateSine(float* outBuffer, int numSamples, float sampleRate, float freq) {
    float phase = 0.0f;
    float phaseInc = (2.0f * 3.14159265f * freq) / sampleRate;
    
    for (int i = 0; i < numSamples; i++) {
        // TODO: outBuffer[i] に sinf(phase) を代入し、phase を進めてください
        outBuffer[i] = 0.0f;
    }
}`,
      solutionSnippet: `outBuffer[i] = sinf(phase);\nphase += phaseInc;`,
      dspType: 'sine'
    }
  },
  {
    id: 'cpp-realtime-safety',
    track: 'cpp',
    title: 'リアルタイムオーディオの鉄則 と リングバッファ',
    subtitle: 'オーディオスレッドで絶対にやってはいけない禁忌（Taboo）',
    iconName: 'ShieldAlert',
    category: 'Realtime & Thread Safety',
    summary: 'VSTプラグインやDAWのオーディオ処理スレッド（リアルタイムスレッド）で、メモリ確保（new/malloc）やMutexロックがなぜ絶対NGなのかを理解し、ロックフリーなリングバッファ（Circular Buffer）の設計を学びます。',
    soundDesignerPerspective: '「オーディオプログラミングで音が途切れる最大の原因はバグではなくリアルタイム性の破壊」です。OSのオーディオスレッドは10ミリ秒未満の超厳格な締め切りで動いています。ここで1回でもロック待ちやファイル読み込みを行うと即座にグリッチ（音飛び）が発生します。',
    keyConcepts: [
      {
        name: 'オーディオスレッドの3大禁忌 (The 3 Taboos)',
        description: '1. メモリの動的確保・解放 (malloc, free, new, delete)\n2. ファイル・ネットワーク等のブロッキングI/O (printf, std::cout, fopen)\n3. 優先度逆転を招くミューテックスのロック (std::mutex::lock)',
        badPattern: '// オーディオコールバック内でログ出力やnewをする大事故\nvoid process(float* buf, int len) {\n    printf("Processing: %d\\n", len); // 禁忌: I/Oロック\n    float* temp = new float[len];      // 禁忌: ヒープアロケーション\n}'
      },
      {
        name: 'リングバッファ (Circular Buffer) によるデータ受け渡し',
        description: 'UIスレッド（波形描画など）とオーディオスレッド間で安全にデータを受け渡すには、アトミック変数（std::atomic）を用いたロックフリーリングバッファを使用します。',
        goodPattern: '// 事前に固定サイズで確保したバッファを、インデックスの剰余(%)で循環利用\nwriteIndex = (writeIndex + 1) % BUFFER_SIZE;'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-rt-1',
        track: 'cpp',
        category: 'Realtime & Thread Safety',
        difficulty: 'intermediate',
        type: 'why_concept',
        title: 'なぜオーディオスレッドで new/malloc は禁止なのか？',
        question: 'VSTプラグインの `processBlock()` やオーディオコールバック関数内で `new` や `malloc` を呼び出してはならない根本的な理由は何ですか？',
        options: [
          {
            id: 'opt1',
            text: 'OSのメモリアロケータ内部でロック（排他制御）が発生し、処理完了時間が非決定的（Non-deterministic）になるため',
            isCorrect: true,
            explanation: '正解！OSのヒープアロケータはスレッドセーフにするため内部でロックを取ります。また空きメモリの探索やページフォルトによって数十ミリ秒待たされる可能性があり、オーディオのリアルタイム締め切り（数ミリ秒）を破綻させます。'
          },
          {
            id: 'opt2',
            text: 'C++の new 演算子はオーディオ用の float 型メモリを確保できない仕様だから',
            isCorrect: false,
            explanation: 'new float[n] は文法上何の問題もなく確保できます。問題は実行タイミングと遅延です。'
          },
          {
            id: 'opt3',
            text: 'DAWがプラグインのヒープ使用量を制限しているから',
            isCorrect: false,
            explanation: 'DAWによる制限ではなく、OSのスケジューリングとリアルタイム処理の原則によるものです。'
          }
        ],
        soundContext: 'Native Instruments KontaktスクリプトやJUCEフレームワークでの最重要規約'
      }
    ],
    audioExercise: {
      id: 'ex-cpp-delay',
      track: 'cpp',
      title: 'リングバッファによるフィードバックディレイの実装',
      description: 'ディレイメモリ（遅延バッファ）と書き込み・読み込みインデックスを循環させ、やまびこ効果（Delay / Echo）を作り出します。',
      soundGoal: '乾いた音（Dry）に一定時間遅れたフィードバック音（Wet）を混ぜ、空間の広がりを作る',
      initialCode: `// delayBuffer: 過去の音を保存しておく固定配列 (サイズ 44100)
// writePos: 現在の書き込み位置
// delaySamples: 遅延させるサンプル数 (例: 10000 = 約0.22秒)
// feedback: フィードバック量 (0.5f)
void ProcessDelay(float* inBuffer, float* outBuffer, int numSamples, float* delayBuffer, int& writePos, int delaySamples, float feedback) {
    const int DELAY_SIZE = 44100;
    for (int i = 0; i < numSamples; i++) {
        // 過去のサンプルを読み出すインデックス（循環）
        int readPos = (writePos - delaySamples + DELAY_SIZE) % DELAY_SIZE;
        float delayedSample = delayBuffer[readPos];
        
        // 出力 = 入力原音 + ディレイ音
        outBuffer[i] = inBuffer[i] + delayedSample * 0.6f;
        
        // ディレイバッファに入力＋フィードバックを書き込む
        delayBuffer[writePos] = inBuffer[i] + delayedSample * feedback;
        
        // インデックスを進める（循環）
        writePos = (writePos + 1) % DELAY_SIZE;
    }
}`,
      solutionSnippet: `int readPos = (writePos - delaySamples + DELAY_SIZE) % DELAY_SIZE;`,
      dspType: 'delay'
    }
  }
];
