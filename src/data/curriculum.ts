import { CurriculumTopic } from '@/types/learning';
import { CSHARP_50_TOPICS } from './csharp50Topics';

export const INITIAL_CURRICULUM: CurriculumTopic[] = [
  // ==========================================
  // Track: C# (超初級〜初中級 50トピック完全網羅)
  // ==========================================
  ...CSHARP_50_TOPICS,

  // ==========================================
  // Track: C++ (VST, DSP & Low-level Realtime)
  // ==========================================
  {
    id: 'cpp-basics-variables',
    track: 'cpp',
    phase: 'フェーズ1: C++メモリと型基礎',
    title: '【超基礎】C++の型サイズとメモリの箱',
    subtitle: 'なぜCubaseやVSTの波形データは float（32-bit浮動小数点）なのか？',
    iconName: 'Box',
    category: 'C++ 基礎',
    summary: 'C++では各データ型が「メモリを何バイト消費するか」を意識します。16-bit PCM音源（CD音質）と 32-bit float（DAW内部処理）のデータ表現の違いを学びます。',
    soundDesignerPerspective: 'CDは16-bit整数（short型: -32768〜+32767）ですが、CubaseやVSTプラグインの内部はすべて32-bit浮動小数点数（float型: -1.0f〜+1.0f）です。floatを使うことで0dBを超えても音割れせずヘッドルームを確保できる理由がコードから分かります。',
    soundJargon: [
      {
        term: 'sizeof 演算子',
        analogy: '機材のラックマウントサイズ (1U, 2U) の計測',
        explanation: 'そのデータ型がメモリを何バイト消費するかを調べる道具です。'
      }
    ],
    keyConcepts: [
      {
        name: '型とメモリサイズ (sizeof)',
        description: 'char: 1バイト, short: 2バイト (16-bit音源), float: 4バイト (32-bit float音源)',
        goodPattern: 'float sample = 0.0f; // 4バイトのメモリを占有\n// -1.0f 〜 +1.0f の範囲で音の振幅を表す'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-var-1',
        track: 'cpp',
        category: 'C++ 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'DAWやVST内部で最も標準的な波形データの型',
        question: 'VST3や現代のDAWのオーディオスレッドで、波形振幅（-1.0 〜 +1.0）を表すために最も標準的に使用される型はどれですか？',
        options: [
          { id: 'opt1', text: 'float (32-bit 単精度浮動小数点数)', isCorrect: true, explanation: '正解！VST3SDKでも float が標準です。' },
          { id: 'opt2', text: 'int (32-bit 整数)', isCorrect: false, explanation: 'intでは小数点以下の滑らかな波形カーブを直接表現できません。' }
        ],
        soundContext: 'VST3 / AudioUnit のデータ受渡しの基本規格'
      }
    ]
  },
  {
    id: 'cpp-basics-arrays',
    track: 'cpp',
    phase: 'フェーズ1: C++メモリと型基礎',
    title: '【超基礎】C++の配列とインデックスアクセス',
    subtitle: '固定配列 buffer[512] で波形を保持する感覚を掴む',
    iconName: 'ListOrdered',
    category: 'C++ 基礎',
    summary: 'ポインタを学ぶ前の最重要ステップ！`float buffer[512]` のようにメモリ上に連続して並ぶ配列の構造と、`buffer[i]` でアクセスする仕組みを学びます。',
    soundDesignerPerspective: 'オーディオインターフェースのバッファサイズ（128, 256, 512サンプル）とは、まさにこの固定配列のサイズそのものです。',
    keyConcepts: [
      {
        name: '配列の宣言と初期化',
        description: 'float buffer[256] = {0.0f}; で256個のサンプルがすべて0.0f（無音）で確保されます。',
        goodPattern: 'const int BLOCK_SIZE = 256;\nfloat buffer[BLOCK_SIZE];\nfor (int i = 0; i < BLOCK_SIZE; ++i) buffer[i] = 0.0f;'
      }
    ],
    quizzes: [
      {
        id: 'q-cpp-arr-1',
        track: 'cpp',
        category: 'C++ 基礎',
        difficulty: 'beginner',
        type: 'choice',
        title: 'サイズ256の配列の最後のサンプルの添字',
        question: '`float buffer[256];` と宣言された配列の、「一番最後のサンプル」を読み書きする正しい添字はどれですか？',
        options: [
          { id: 'opt1', text: 'buffer[255]', isCorrect: true, explanation: '正解！C++の配列は 0 から始まるため、サイズ256の末尾は 255 番目になります。' },
          { id: 'opt2', text: 'buffer[256]', isCorrect: false, explanation: 'buffer[256] は配列の範囲外（257個目）となり、メモリ破壊クラッシュを引き起こします！' }
        ],
        soundContext: 'オーディオバッファ終端境界の安全管理'
      }
    ]
  },
  {
    id: 'cpp-pointers-buffers',
    track: 'cpp',
    phase: 'フェーズ2: ポインタとバッファ走査',
    title: 'ポインタ・メモリアドレス と オーディオバッファ走査',
    subtitle: 'float* buffer の正体を暴き、1サンプル単位で波形を操る',
    iconName: 'Code2',
    category: 'Pointers & Buffers',
    summary: 'C++の最も重要な概念「ポインタ」と「メモリアドレス」を、DAWやVSTプラグインのオーディオバッファ（float*）の走査を通じて直感的にマスターします。',
    soundDesignerPerspective: 'CubaseなどのDAWは、VST3プラグインに対して「44.1kHzでサンプリングされた波形データが並んだメモリの先頭アドレス（float* inBuffer, float* outBuffer）」を渡してきます。',
    soundJargon: [
      {
        term: 'ポインタ (Pointer / *)',
        analogy: 'パッチベイの「ジャックが挿さっているスロット番号（番地）」',
        explanation: 'データそのものではなく、「データが置いてあるメモリの住所（アドレス）」を指差す矢印です。'
      }
    ],
    keyConcepts: [
      {
        name: '配列とポインタの等価性とポインタ演算',
        description: 'オーディオバッファ buffer[i] は、内部的には *(buffer + i) と全く同じです。',
        goodPattern: 'void ProcessMono(float* buffer, int numSamples, float gain) {\n    float* end = buffer + numSamples;\n    while (buffer < end) {\n        *buffer++ *= gain;\n    }\n}'
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
        question: 'ステレオインターリーブ波形 (L, R, L, R...) の「左チャンネル (L) のみ」音量を半分にする正しいインクリメントはどれですか？',
        options: [
          { id: 'opt1', text: 'p += 2;', isCorrect: true, explanation: '正解！LとRが交互に並んでいるため、Lの次は2サンプル分先（L -> R -> L）に進める必要があります。' },
          { id: 'opt2', text: 'p++;', isCorrect: false, explanation: 'p++ だと次のRチャンネルを指してしまいます。' }
        ],
        soundContext: 'WAVファイルのインターリーブ変換'
      }
    ],
    audioExercise: {
      id: 'ex-cpp-sine',
      track: 'cpp',
      title: 'ポインタによるサイン波（440Hz A音）オシレータの生成',
      description: 'float* outBuffer に直接ポインタ走査で440HzのA音を書き込み、ピュアトーンを鳴らします。',
      soundGoal: '440Hzのサイン波を生成してオシロスコープに綺麗な正弦波を表示する',
      initialCode: `void GenerateSine(float* outBuffer, int numSamples, float sampleRate, float freq) {\n    float phase = 0.0f;\n    float phaseInc = (2.0f * 3.14159265f * freq) / sampleRate;\n    for (int i = 0; i < numSamples; i++) {\n        outBuffer[i] = sinf(phase) * 0.6f;\n        phase += phaseInc;\n    }\n}`,
      solutionSnippet: `outBuffer[i] = sinf(phase) * 0.6f;\nphase += phaseInc;`,
      dspType: 'sine'
    }
  },
  {
    id: 'cpp-realtime-safety',
    track: 'cpp',
    phase: 'フェーズ3: リアルタイムセーフティ',
    title: 'リアルタイムオーディオの鉄則 と リングバッファ',
    subtitle: 'オーディオスレッドで絶対にやってはいけない禁忌（Taboo）',
    iconName: 'ShieldAlert',
    category: 'Realtime & Thread Safety',
    summary: 'VSTプラグインやDAWのオーディオ処理スレッド（リアルタイムスレッド）で、メモリ確保（new/malloc）やMutexロックがなぜ絶対NGなのかを学びます。',
    soundDesignerPerspective: '「オーディオプログラミングで音が途切れる最大の原因はバグではなくリアルタイム性の破壊」です。OSのオーディオスレッドは10ミリ秒未満の厳格な締め切りで動いています。',
    soundJargon: [
      {
        term: 'リアルタイムスレッド',
        analogy: '生放送・ライブ本番のPA卓（1ミリ秒の遅延も許されない現場）',
        explanation: '遅れると即座に「ブツッ」というノイズが出るため、一切の待ち時間（ファイル読み込みやメモリ確保）が禁止された特別な処理領域です。'
      }
    ],
    keyConcepts: [
      {
        name: 'オーディオスレッドの3大禁忌',
        description: '1. メモリの動的確保 (malloc, new) 2. ブロッキングI/O (printf, ファイル操作) 3. 排他ロック (mutex)',
        badPattern: '// 禁忌: オーディオスレッドでのnewとログ出力\nvoid process(float* buf, int len) {\n    printf("log");\n    float* temp = new float[len];\n}'
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
        question: 'VSTプラグインの processBlock() 内で new や malloc を呼び出してはならない根本的な理由は何ですか？',
        options: [
          { id: 'opt1', text: 'OSのメモリアロケータ内部でロックが発生し、処理完了時間が非決定的（数ミリ秒遅延）になるため', isCorrect: true, explanation: '正解！OSのヒープアロケータはロックを取るため、オーディオの締め切り時間を破綻させ音飛びを引き起こします。' },
          { id: 'opt2', text: 'DAWがプラグインのヒープ使用量を制限しているから', isCorrect: false, explanation: 'OSのリアルタイム処理の原則によるものです。' }
        ],
        soundContext: 'Native Instruments KontaktスクリプトやJUCEでの最重要規約'
      }
    ],
    audioExercise: {
      id: 'ex-cpp-delay',
      track: 'cpp',
      title: 'リングバッファによるフィードバックディレイの実装',
      description: 'ディレイメモリとインデックスを循環させ、やまびこ効果（Delay）を作り出します。',
      soundGoal: '乾いた音に入力＋フィードバック音を混ぜ、空間の広がりを作る',
      initialCode: `void ProcessDelay(float* inBuffer, float* outBuffer, int numSamples, float* delayBuffer, int& writePos, int delaySamples, float feedback) {\n    const int DELAY_SIZE = 44100;\n    for (int i = 0; i < numSamples; i++) {\n        int readPos = (writePos - delaySamples + DELAY_SIZE) % DELAY_SIZE;\n        float delayedSample = delayBuffer[readPos];\n        outBuffer[i] = inBuffer[i] + delayedSample * 0.6f;\n        delayBuffer[writePos] = inBuffer[i] + delayedSample * feedback;\n        writePos = (writePos + 1) % DELAY_SIZE;\n    }\n}`,
      solutionSnippet: `int readPos = (writePos - delaySamples + DELAY_SIZE) % DELAY_SIZE;`,
      dspType: 'delay'
    }
  }
];
