import { CurriculumTopic } from '@/types/learning';

export const INITIAL_CURRICULUM: CurriculumTopic[] = [
  // ==========================================
  // Track: C# (Unity & Game Sound)
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
