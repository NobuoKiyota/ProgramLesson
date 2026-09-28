export interface CodeLineExplanation {
  lineRange: string;
  codeSnippet: string;
  title: string;
  soundDesignerPerspective: string;
  programmerPerspective: string;
  deepExplanation: string;
  pitfallWarning?: string;
}

export interface SoundManagerModule {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  lines: string;
  keyTakeaways: string[];
  codeSnippets: string;
  explanations: CodeLineExplanation[];
  quiz: {
    question: string;
    options: { text: string; isCorrect: boolean; explanation: string }[];
    soundContext: string;
  };
}

export const SOUND_MANAGER_MODULES: SoundManagerModule[] = [
  // ==========================================
  // モジュール 1: ボイス終了理由 と サンプル精度ループ
  // ==========================================
  {
    id: 'mod-01-loop-points',
    title: '1. VoiceEndReason & LoopPointSettings',
    subtitle: 'ボイス終了要因の1バイト表現 と 圧縮ズレ自動補正ループ構造体',
    summary: 'メモリを1/4に圧縮する enum byte 定義と、Cubase書き出し後のOGG/MP3圧縮によるサンプル数変動を自動スケーリングする堅牢なループ構造体を解剖します。',
    lines: 'L9 - L64',
    keyTakeaways: [
      'enum VoiceEndReason : byte による省メモリ化（4バイト→1バイト）',
      '秒（float）ではなくサンプル数（int）でループを管理してプチノイズを根絶',
      'Mathf.Max による負数・無限ループのフェイルセーフ初期化',
      '圧縮ファイル（OGG/MP3）のパディングによるサンプルズレを比率（ratio）で自動補正'
    ],
    codeSnippets: `public enum VoiceEndReason : byte
{
    None = 0,
    Natural,    // 自然終了(鳴り終わった)
    Stopped,    // Stop(API/ハンドル)
    Exclusive,  // 排他再生で退避
    Stolen,     // プール枯渇でスチール
}

public struct LoopPointSettings
{
    public int startSample; // ループ開始位置（サンプル数）
    public int endSample;   // ループ終了位置（サンプル数）

    public LoopPointSettings(int startSample, int endSample)
    {
        this.startSample = Mathf.Max(0, startSample);
        this.endSample = Mathf.Max(this.startSample + 1, endSample);
    }

    public static LoopPointSettings FromSeconds(AudioClip clip, float loopStartSec, float loopEndSec)
    {
        int freq = clip != null ? clip.frequency : 48000;
        return new LoopPointSettings(loopStartSec, loopEndSec, freq);
    }

    public static LoopPointSettings CreateAutoCorrected(AudioClip clip, int baseStartSample, int baseEndSample, int referenceTotalSamples = 768000)
    {
        if (clip == null || referenceTotalSamples <= 0)
            return new LoopPointSettings(baseStartSample, baseEndSample);

        float ratio = (float)clip.samples / referenceTotalSamples;
        int start = Mathf.RoundToInt(baseStartSample * ratio);
        int end = (baseEndSample <= 0 || baseEndSample >= referenceTotalSamples)
            ? clip.samples
            : Mathf.RoundToInt(baseEndSample * ratio);

        return new LoopPointSettings(start, end);
    }
}`,
    explanations: [
      {
        lineRange: 'L10 - L17',
        codeSnippet: `public enum VoiceEndReason : byte
{
    None = 0,
    Natural,    // 自然終了(鳴り終わった)
    Stopped,    // Stop(API/ハンドル)
    Exclusive,  // 排他再生で退避
    Stolen,     // プール枯渇でスチール
}`,
        title: 'VoiceEndReason: なぜ enum に : byte を指定するのか？',
        soundDesignerPerspective: '「音が途中で消えた！」という不具合が起きた時、自然に鳴り終わったのか、排他グループで打ち消されたのか、発音数上限でスチールされたのかを Sound Monitor で一目瞭然にするための識別票です。',
        programmerPerspective: '通常の enum は 32-bit int（4バイト）を消費しますが、`: byte` とすることで 1 バイトに圧縮されます。ボイス情報構造体が数十個並ぶ際のキャッシュ効率を高めるプロの配慮です。',
        deepExplanation: 'ボイスのライフサイクル管理において、「どのように終わったか」を記録することはデバッグの要です。特にゲームが激しくなった時の「Stolen（スチール）」多発は、同時発音数設定の見直しを促す重要指標になります。'
      },
      {
        lineRange: 'L20 - L29',
        codeSnippet: `public struct LoopPointSettings
{
    public int startSample;
    public int endSample;

    public LoopPointSettings(int startSample, int endSample)
    {
        this.startSample = Mathf.Max(0, startSample);
        this.endSample = Mathf.Max(this.startSample + 1, endSample);
    }
}`,
        title: 'サンプル数精度ループ と 鉄壁のフェイルセーフ',
        soundDesignerPerspective: '秒（float）で指定すると小数の丸め誤差で「48000分の1秒の隙間」が生まれ、ループの繋ぎ目で「プチッ」と鳴ります。DAWのタイムラインで確認した正確なサンプル番号（整数）で管理することでゼロクロス接続を保証します。',
        programmerPerspective: '`struct`（値型）のためヒープ確保が一切起きず、GCフリーです。また `Mathf.Max(this.startSample + 1, endSample)` により、万が一終了位置が開始位置以下に設定されても無限超高速ループでフリーズするのを防ぐ防御的プログラミングが施されています。',
        deepExplanation: 'Unity標準の `AudioSource.loop = true` はファイル全体しかループできません。イントロ付きBGMを実現するには、自前で `AudioSource.timeSamples` を監視して巻き戻すこの仕組みが必須になります。'
      },
      {
        lineRange: 'L51 - L63',
        codeSnippet: `float ratio = (float)clip.samples / referenceTotalSamples;
int start = Mathf.RoundToInt(baseStartSample * ratio);
int end = (baseEndSample <= 0 || baseEndSample >= referenceTotalSamples)
    ? clip.samples
    : Mathf.RoundToInt(baseEndSample * ratio);`,
        title: '圧縮ファイル（OGG/MP3）のサンプル数ズレ自動スケーリング',
        soundDesignerPerspective: 'WAV（非圧縮）で記録したループ位置を、Unityのインポート設定で Vorbis 等に圧縮すると、エンコードのパディング（微小な無音）が付加されて総サンプル数が変わってしまいます。この比率計算（ratio）があるおかげで、圧縮設定を変えてもループポイントが狂いません。',
        programmerPerspective: '`referenceTotalSamples`（元WAVの総サンプル数）に対する実際の `clip.samples` のスケーリング比率を計算し、`Mathf.RoundToInt` で四捨五入しています。',
        deepExplanation: 'サウンドミドルウェア（CRI ADXやWwise）を使わずにUnity標準機能で美しいBGMループを作る際、世界中のエンジニアが最も頭を抱える「圧縮後のサンプルズレ問題」を数学的にエレガントに解決した極めて実践的な関数です。'
      }
    ],
    quiz: {
      question: 'LoopPointSettings で「秒数（float）」ではなく「サンプル数（int）」を主要な単位として採用している最大の音響的理由は何ですか？',
      options: [
        { text: '浮動小数点の丸め誤差による「1サンプル未満のズレ」を排除し、ループ接続時のプチノイズ（クリック）を完全に防ぐため', isCorrect: true, explanation: '正解！48kHz環境では1サンプル＝約0.0000208秒。float計算でこの微小な隙間が空くだけで耳障りなクリックノイズが発生するため、整数サンプルでの管理が必須です。' },
        { text: 'int型のほうが計算速度が100倍速いため', isCorrect: false, explanation: '速度の問題ではなく、精度の問題です。' }
      ],
      soundContext: 'シームレスBGMイントロループの設計'
    }
  },

  // ==========================================
  // モジュール 2: ボイス構造 と 不透明ハンドル
  // ==========================================
  {
    id: 'mod-02-voice-handle',
    title: '2. PooledVoice & SoundPlayback',
    subtitle: '世代トークン（generation）によるスチール事故防止 と CRI相当の不透明ハンドル',
    summary: '生のAudioSourceを返さず不透明ハンドル `SoundPlayback` を返す理由、発音通し番号 `reservedOrder`、および独立したゲイン乗算アーキテクチャを解剖します。',
    lines: 'L129 - L252',
    keyTakeaways: [
      '生の AudioSource を直接触らせず、安全な struct 不透明ハンドルを公開',
      'generation（世代トークン）により、スチール（枠の再利用）後の誤停止事故を完全防止',
      'Time.time ではなく reservedOrder（単調増加の通し番号）で最古ボイスを正確に特定',
      'levelGain, pauseGain, baseVolume を直交管理し、複数の重なるフェードの競合を防止'
    ],
    codeSnippets: `internal class PooledVoice
{
    public AudioSource source;
    public SoundCategoryType category;
    public bool inUse;
    public bool paused;
    public float baseVolume;   // カテゴリ音量・ダッキング適用前の素の音量(0-1)
    public long reservedOrder; // 発音開始の通し番号(単調増加)。プール枯渇時のスチールで「最も古い」を決める
    public uint generation;    // 発音世代トークン（非同期フェード・スチールの競合防止用）
    public float levelGain = 1f;  // フェードイン/停止フェードアウトの倍率
    public float pauseGain = 1f;  // 一時停止/再開フェードの倍率
}

public readonly struct SoundPlayback
{
    private readonly PooledVoice _voice;
    private readonly uint _generation;

    internal SoundPlayback(PooledVoice voice)
    {
        _voice = voice;
        _generation = voice != null ? voice.generation : 0;
    }

    public bool IsValid => _voice != null && _voice.inUse && _voice.generation == _generation;

    public void Stop(float fadeTime = DefaultFade)
    {
        if (!IsValid || _instance == null) return;
        _instance.StopVoice(_voice, fadeTime);
    }
}`,
    explanations: [
      {
        lineRange: 'L136',
        codeSnippet: `public long reservedOrder; // 発音開始の通し番号(単調増加)。プール枯渇時のスチールで「最も古い」を決める。
// Time.timeだと同一フレーム内で同値になり、直前に鳴らした音が先に奪われてしまうため通し番号にしている`,
        title: 'なぜ Time.time ではなく reservedOrder（通し番号）なのか？',
        soundDesignerPerspective: '「1フレーム内に複数の爆破音が鳴ったとき、後から鳴った最新の爆発音がなぜか一瞬で消える」という不可解な不具合を完璧に防ぎます。',
        programmerPerspective: 'Unityの `Time.time` は同一フレーム内では全く同じ数値になります。そのため同じフレームで5発撃たれた場合、どれが最初でどれが最後か判別できません。`++_reserveCounter` という単調増加カウンタを使うことで完全な順序性を保証しています。',
        deepExplanation: 'ボイススチール（ボイスリミット到達時に古い音を奪うアルゴリズム）において、「一番古い音」をどう定義するかは極めて繊細です。通し番号によるFIFO（先入れ先出し）が最も理にかなっています。'
      },
      {
        lineRange: 'L154 - L176',
        codeSnippet: `public readonly struct SoundPlayback
{
    private readonly PooledVoice _voice;
    private readonly uint _generation;

    public bool IsValid => _voice != null && _voice.inUse && _voice.generation == _generation;
}`,
        title: '世代トークン（generation）と CRIライクな不透明ハンドル',
        soundDesignerPerspective: 'CRI ADXの `CriAtomExPlayback` と全く同じ思想です。再生した音を止めるための「リモコン」をゲーム側に渡しますが、その音が既に消えて別の音に枠を譲っていたら、リモコンは自動的に無効化され、無関係な別の音を誤って止めてしまう事故が起きません。',
        programmerPerspective: 'もし生の `AudioSource` を返してしまうと、プールで再利用された後にゲーム側が `source.Stop()` を呼んだ際、「いま鳴り始めたばかりの全く別のBGMやSE」を誤って止めてしまいます。`generation == _generation` を照合することで、幽霊ハンドルによる誤操作を O(1) で完全遮断します。',
        deepExplanation: 'オブジェクトプールとハンドルパターンを組み合わせる際の教科書的な最高のお手本です。`readonly struct` なので呼び出し側で保持してもGCアロケーションは一切発生しません。'
      },
      {
        lineRange: 'L143 - L146',
        codeSnippet: `// フェードは音量そのものではなく「倍率」だけを動かす。実効音量は Sound.ApplyVoiceVolume の1か所で
// 基本音量 × カテゴリ音量 × ダッキング × levelGain × pauseGain として書く
public float levelGain = 1f;  // フェードイン/停止フェードアウトの倍率
public float pauseGain = 1f;  // 一時停止フェードアウト/再開フェードインの倍率`,
        title: 'フェード倍率の直交管理（ゲイン分離設計）',
        soundDesignerPerspective: '「フェードイン中に一時停止を押したら音量が壊れた」「ダッキングがかかっている時にBGMフェードアウトしたら音量が跳ね上がった」という、音量計算の競合バグを根絶する仕組みです。',
        programmerPerspective: '音量を1つの `source.volume` に直接代入するのではなく、「基本音量」「カテゴリ音量」「ダッキング」「レベルフェード」「ポーズフェード」の各倍率を独立した変数として保持し、適用時に掛け算しています。',
        deepExplanation: '複数の状態遷移が同時に起きても、各変数が独立しているため数学的に干渉しません。DAWのチャンネルストリップ（入力ゲイン × プラグインフェーダー × ミュート × マスター）と同じ発想です。'
      }
    ],
    quiz: {
      question: '`SoundPlayback` で生の AudioSource を返さずに `generation`（世代トークン）を照合している最大の理由は何ですか？',
      options: [
        { text: 'ボイスプールで再利用（スチール）された後に、古いハンドルから誤って「いま鳴っている別の音」を停止してしまう事故を防ぐため', isCorrect: true, explanation: '正解！ボイスが使い回された瞬間に PooledVoice の generation がインクリメントされるため、古いハンドルは自動的に IsValid = false になり誤爆を防ぎます。' },
        { text: 'AudioSourceのメソッドを非公開にして隠蔽するため', isCorrect: false, explanation: '単なる隠蔽ではなく、プーリング再利用時の誤操作防止が主目的です。' }
      ],
      soundContext: 'オーディオプーリングとハンドル安全性'
    }
  },

  // ==========================================
  // モジュール 3: シングルトン と モバイル中断復帰対策
  // ==========================================
  {
    id: 'mod-03-lifecycle-suspension',
    title: '3. Lifecycle & App Suspension',
    subtitle: 'Awake多重防止、DontDestroyOnLoad、およびモバイル/Switchスリープ復帰の猶予フレーム設計',
    summary: 'シーンを跨いでも破棄されないシングルトン保証と、モバイルやSwitchのホーム画面遷移時にUnityが音を勝手に止めた際の「誤解放」を防ぐResumeGraceFramesを解剖します。',
    lines: 'L75 - L105, L264 - L324',
    keyTakeaways: [
      '[DisallowMultipleComponent] と Awake での重複インスタンス即時破棄',
      'FindFirstObjectByType / FindObjectOfType によるUnityバージョン互換',
      'OnApplicationPause / Focus での PlayerPrefs.Save() 確実実行',
      'ResumeGraceFrames (6フレーム猶予) によるスリープ復帰時のボイス誤解放防止'
    ],
    codeSnippets: `[DisallowMultipleComponent]
public class Sound : MonoBehaviour
{
    private static Sound _instance;

    public static Sound Instance
    {
        get
        {
            if (_instance == null)
            {
#if UNITY_2023_1_OR_NEWER
                _instance = FindFirstObjectByType<Sound>();
#else
                _instance = FindObjectOfType<Sound>();
#endif
            }
            if (_instance == null)
            {
                var go = new GameObject("[Sound]");
                _instance = go.AddComponent<Sound>();
            }
            return _instance;
        }
    }

    private void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(gameObject);
        BuildPools();
    }

    // 中断から復帰した直後、AudioSource.isPlaying が追いつくまで数フレーム待つ
    private bool _appPaused;
    private int _resumeGrace;
    private const int ResumeGraceFrames = 6;

    private void OnApplicationPause(bool pause)
    {
        if (pause && persistCategoryVolumes) PlayerPrefs.Save();
        _appPaused = pause;
        if (!pause) _resumeGrace = ResumeGraceFrames;
    }
}`,
    explanations: [
      {
        lineRange: 'L87 - L100',
        codeSnippet: `if (_instance == null)
{
    var go = new GameObject("[Sound]");
    _instance = go.AddComponent<Sound>();
}`,
        title: '遅延自動生成シングルトンパターン',
        soundDesignerPerspective: 'テスト用の空シーンなどで「Soundプレハブを置き忘れた！」という場合でも、コードから `Sound.Play(...)` が呼ばれた瞬間に自動で `[Sound]` オブジェクトが生成されて音が鳴る、極めて開発者に優しい設計です。',
        programmerPerspective: '初期化順序の依存関係を無くすLazy Initialization（遅延初期化）です。シーンにあらかじめ置いてパラメータを調整しておくことも、完全コード任せで自動生成させることも両立できます。',
        deepExplanation: '#if UNITY_2023_1_OR_NEWER により、Unity 2023以降で非推奨となった `FindObjectOfType` の代わりに高速な `FindFirstObjectByType` を使い分けるバージョン互換性も確保されています。'
      },
      {
        lineRange: 'L298 - L324',
        codeSnippet: `private int _resumeGrace;
private const int ResumeGraceFrames = 6;

private void OnApplicationPause(bool pause)
{
    if (pause && persistCategoryVolumes) PlayerPrefs.Save();
    _appPaused = pause;
    if (!pause) _resumeGrace = ResumeGraceFrames;
}`,
        title: '中断復帰の魔物と「ResumeGraceFrames（6フレームの猶予）」',
        soundDesignerPerspective: 'iOSやAndroid、Switchで「ゲームをホーム画面にして、もう一度戻ったとき、BGMが消えて二度と鳴らなくなる」という、コンシューマー・モバイル開発で最も悪名高いバグを完全に封じ込める知恵です。',
        programmerPerspective: 'アプリがバックグラウンドに回ると、OSやUnityが強制的に音を一時停止し、`AudioSource.isPlaying` が一時的に `false` になります。これを通常の「再生終了」と勘違いしてボイスを解放（Release）してしまうと、復帰した時にBGMが永久に失われます。',
        deepExplanation: '復帰後、ネイティブオーディオドライバとUnity内部フラグが同期するまでに数フレームの遅延があります。`ResumeGraceFrames = 6` の猶予期間を設けることで、早とちりによるボイス枠解放を防ぐ、現場の血の滲むようなデバッグから生まれた設計です。'
      }
    ],
    quiz: {
      question: 'モバイルやSwitchのホーム画面から復帰した直後に `ResumeGraceFrames = 6` を待つ理由は何ですか？',
      options: [
        { text: 'OS側のオーディオ再開遅延により、復帰直後に isPlaying が一時的に false になっているのを「曲が終わった」と誤認してボイスを解放してしまうのを防ぐため', isCorrect: true, explanation: '正解！復帰直後の数フレームはハードウェアとUnityフラグが同期しておらず、この猶予がないと復帰時にBGMが誤って破棄されてしまいます。' },
        { text: 'フェードインを6秒間かけるため', isCorrect: false, explanation: '秒数ではなくフレーム数であり、状態同期の待ち時間です。' }
      ],
      soundContext: 'コンシューマー/モバイル移植での必須ノウハウ'
    }
  },

  // ==========================================
  // モジュール 4: プーリング構築 と 独立インスタンス保護
  // ==========================================
  {
    id: 'mod-04-pooling-cloning',
    title: '4. BuildPools & Asset Protection',
    subtitle: 'アセット本体の汚染を防ぐ Clone() 複製 と PlayerPrefs 音量永続化',
    summary: 'ScriptableObjectやPrefabアセットの設定値を実行時に直接書き換えてしまう大事故を防ぐ Clone() 複製パターンと、カテゴリごとのAudioSource生成を解剖します。',
    lines: 'L325 - L378',
    keyTakeaways: [
      'source.Clone() により、共有アセットの設定が実行時変更で汚染されるのを防止',
      'PlayerPrefs と VolumePrefPrefix によるカテゴリ別音量の自動保存と復元',
      'AudioSource をカテゴリごとの子オブジェクトとして自動生成し階層を整理',
      'outputAudioMixerGroup の事前割り当てによるミキサー連携'
    ],
    codeSnippets: `private void BuildPools()
{
    _settingsByCategory.Clear();
    _pools.Clear();

    foreach (var source in ResolveSourceCategories())
    {
        // 必ず複製してから使う。共有されうるアセット本体を実行時のSetCategoryVolume等で
        // 直接汚してしまう事故(Editor上でPlayを跨いだ汚染や、複数シーン間の干渉)を防ぐため。
        var settings = source.Clone();

        if (persistCategoryVolumes)
        {
            string key = VolumePrefPrefix + settings.category;
            if (PlayerPrefs.HasKey(key))
            {
                settings.volume = Mathf.Clamp01(PlayerPrefs.GetFloat(key, settings.volume));
            }
        }

        _settingsByCategory[settings.category] = settings;

        var list = new List<PooledVoice>(Mathf.Max(1, settings.poolSize));
        for (int i = 0; i < Mathf.Max(1, settings.poolSize); i++)
        {
            var go = new GameObject($"Voice_{settings.category}_{i}");
            go.transform.SetParent(transform, false);
            var src = go.AddComponent<AudioSource>();
            src.playOnAwake = false;
            if (settings.mixerGroup != null) src.outputAudioMixerGroup = settings.mixerGroup;

            list.Add(new PooledVoice { source = src, category = settings.category });
        }
        _pools[settings.category] = list;
    }
}`,
    explanations: [
      {
        lineRange: 'L337',
        codeSnippet: `var settings = source.Clone();`,
        title: '共有アセット汚染（Asset Dirtying）の完全防止',
        soundDesignerPerspective: '「ゲーム実行中にオプション画面でSE音量を下げたら、エディタ停止後もProjectウィンドウ内の設定アセットの音量まで下がって保存されてしまった」というUnityあるあるの惨劇を防ぎます。',
        programmerPerspective: 'ScriptableObjectなどのアセットは参照渡しされるため、実行時に `asset.volume = 0.5f` と書き換えるとディスク上の実体まで書き換わってしまいます。`Clone()` でメモリ上に独立したコピーを作ってから扱うのがプロの作法です。',
        deepExplanation: '複数シーンで同じサウンド設定アセットを共有している場合でも、シーンごとの一時的な音量変更が他のシーンやプロジェクト全体に波及しない安全設計です。'
      },
      {
        lineRange: 'L354 - L362',
        codeSnippet: `var go = new GameObject($"Voice_{settings.category}_{i}");
go.transform.SetParent(transform, false);
var src = go.AddComponent<AudioSource>();
src.playOnAwake = false;
if (settings.mixerGroup != null) src.outputAudioMixerGroup = settings.mixerGroup;`,
        title: 'AudioSourceの事前生成とヒエラルキー整理',
        soundDesignerPerspective: 'BGM用、SE用、ボイス用などのAudioSourceが `[Sound]` オブジェクトの下に綺麗にグループ化されて生成されるため、Unityエディタのヒエラルキーが散らかりません。',
        programmerPerspective: 'ゲームプレイ中に `AddComponent<AudioSource>` を呼ぶと重い処理になります。起動時（Awake）の `BuildPools()` で設定されたプールサイズ分を一括生成しておくことで、実行中のスパイクをゼロにします。',
        deepExplanation: '`playOnAwake = false` の徹底により、意図しないタイミングでの暴発発音を物理的に遮断しています。'
      }
    ],
    quiz: {
      question: '`source.Clone()` を行ってから設定辞書に格納している理由は何ですか？',
      options: [
        { text: 'ScriptableObject等の元アセットを実行時の音量変更（SetCategoryVolume）で直接書き換えて汚染してしまう事故を防ぐため', isCorrect: true, explanation: '正解！Unityではアセットの参照を直接書き換えると、エディタ停止後も値が保存されてしまう「アセット汚染」が起きるため、必ずCloneして独立させます。' },
        { text: 'メモリを2倍消費して冗長化するため', isCorrect: false, explanation: 'アセット保護が目的です。' }
      ],
      soundContext: 'Unityエディタとランタイムアセット保護'
    }
  },

  // ==========================================
  // モジュール 5: リアルタイム更新 と 自前ループ監視
  // ==========================================
  {
    id: 'mod-05-update-loop-ducking',
    title: '5. Update, LoopPoints & Ducking',
    subtitle: '毎フレームの自前サンプル精度巻き戻し と 滑らかなダッキング追従',
    summary: 'Unity内蔵ループに頼らず、指定したサンプル範囲に達した瞬間に先頭へ巻き戻す自前ループ制御と、ボイス発音に追従するダッキング減衰計算を解剖します。',
    lines: 'L463 - L565',
    keyTakeaways: [
      'timeSamples >= endSample を検知して即座に startSample へ巻き戻す高精度ループ',
      '自然終了したボイス（!isPlaying）の自動検出と枠の解放（ReleaseFinishedVoices）',
      'アクティブボイス数に応じた滑らかなダッキング乗数（_currentDuckMultiplier）の補間',
      'Mathf.MoveTowards によるプチノイズのない音量追従'
    ],
    codeSnippets: `private void Update()
{
    if (_resumeGrace > 0) _resumeGrace--;
    UpdateLoopPoints();
    UpdateDucking();
    ReleaseFinishedVoices();
}

private void UpdateLoopPoints()
{
    foreach (var pair in _pools)
    {
        var list = pair.Value;
        for (int i = 0; i < list.Count; i++)
        {
            var voice = list[i];
            if (!voice.inUse || voice.paused || !voice.loopPoint.HasValue) continue;

            var src = voice.source;
            if (src == null || !src.isPlaying) continue;

            var lp = voice.loopPoint.Value;
            int cur = src.timeSamples;
            if (cur >= lp.endSample)
            {
                // ループ末尾を超えたら、超過分を考慮してループ開始点へ巻き戻す
                int over = cur - lp.endSample;
                int len = Mathf.Max(1, lp.endSample - lp.startSample);
                int target = lp.startSample + (over % len);
                src.timeSamples = target;
            }
        }
    }
}`,
    explanations: [
      {
        lineRange: 'L518 - L527',
        codeSnippet: `int cur = src.timeSamples;
if (cur >= lp.endSample)
{
    int over = cur - lp.endSample;
    int len = Mathf.Max(1, lp.endSample - lp.startSample);
    int target = lp.startSample + (over % len);
    src.timeSamples = target;
}`,
        title: '超過サンプル（over）を考慮した精密巻き戻し計算',
        soundDesignerPerspective: '「ループの境目でわずかにリズムがもたる（遅れる）」現象を防ぐための計算です。フレームレートの更新間隔によってループ終了点を少し超えてしまった場合でも、その超過分（over）をループ先頭に加算して進めることで、テンポが絶対に狂いません。',
        programmerPerspective: 'Updateは一定間隔（16.6msなど）でしか呼ばれないため、`cur == lp.endSample` で判定すると確実にすり抜けます。`>=` で検知し、剰余 `% len` で超過分を計算して補正する完璧なタイムストレッチ同期です。',
        deepExplanation: '音ゲーやテンポ同期BGMにおいて、1フレームの描画遅延による拍子のズレを蓄積させないためのプロの知見です。'
      },
      {
        lineRange: 'L544 - L565',
        codeSnippet: `float target = activeTriggers > 0 ? settings.duckVolumeMultiplier : 1f;
current = Mathf.MoveTowards(current, target, Time.unscaledDeltaTime / settings.duckFadeTime);`,
        title: 'Time.unscaledDeltaTime によるポーズ非依存ダッキング',
        soundDesignerPerspective: 'キャラクターが喋っている間、BGMやSEの音量を「スッ」と自動で下げ（ダッキング）、喋り終わったら滑らかに戻します。',
        programmerPerspective: '`Time.deltaTime` ではなく `Time.unscaledDeltaTime` を使うことで、ゲーム側が `Time.timeScale = 0`（ポーズ画面やスロー演出）になっていても、音量フェードがフリーズせずに動き続けます。',
        deepExplanation: '`Mathf.MoveTowards` で一定速度で直線補間することで、毎フレームの急激な音量変化によるクリッピングノイズを完全に抑制しています。'
      }
    ],
    quiz: {
      question: 'UpdateLoopPoints で、ループ終了点を超えた際に単に `src.timeSamples = lp.startSample` とせず、超過分（over % len）を足している理由は何ですか？',
      options: [
        { text: 'フレームレートの更新タイミングで終了点を通り過ぎてしまった超過時間を先頭に反映し、BGMのテンポや拍子が遅れてもたるのを防ぐため', isCorrect: true, explanation: '正解！毎フレームの呼び出し間隔のブレによる「微小な遅れ」を蓄積させず、音楽的なテンポを完璧に保つための超重要処理です。' },
        { text: '音量を大きくするため', isCorrect: false, explanation: 'テンポ同期精度のための処理です。' }
      ],
      soundContext: 'BGMループの音楽的リズム維持'
    }
  },

  // ==========================================
  // モジュール 6: ボイススチール と 通し番号アルゴリズム
  // ==========================================
  {
    id: 'mod-06-voice-stealing',
    title: '6. GetFreeVoice & Voice Stealing',
    subtitle: '発音数枯渇時のボイススチール（奪取） と 最古発音の判定ロジック',
    summary: '最大同時発音数（poolSize）を使い切った際、どの音を犠牲にして新しい音を鳴らすか？音割れとCPU負荷を防ぐボイススチールアルゴリズムを解剖します。',
    lines: 'L634 - L715',
    keyTakeaways: [
      '空きボイスがある場合は即座に割り当て（最速パス）',
      '空きがない場合、既にフェードアウト停止中のボイス（stopping）を優先的に再利用',
      'それでも足りない場合、reservedOrder が最も古い（一番昔に鳴った）ボイスを強制スチール',
      'スチールされたボイスの generation を更新し、旧ハンドルの誤作動を即時遮断'
    ],
    codeSnippets: `private PooledVoice GetFreeVoice(SoundCategoryType category)
{
    if (!_pools.TryGetValue(category, out var list) || list.Count == 0) return null;

    // 1. 完全な空き枠を探す
    for (int i = 0; i < list.Count; i++)
    {
        if (!list[i].inUse) return list[i];
    }

    // 2. 空きがない場合: スチール(奪取)の候補を選定
    //   ・まもなく消える「フェードアウト停止中(stopping)」の枠を最優先
    //   ・すべて再生中なら、発音通し番号(reservedOrder)が最も古い枠を奪う
    PooledVoice candidate = null;
    bool foundStopping = false;

    for (int i = 0; i < list.Count; i++)
    {
        var v = list[i];
        if (v.stopping)
        {
            if (!foundStopping || v.reservedOrder < candidate.reservedOrder)
            {
                candidate = v;
                foundStopping = true;
            }
        }
        else if (!foundStopping)
        {
            if (candidate == null || v.reservedOrder < candidate.reservedOrder)
            {
                candidate = v;
            }
        }
    }

    if (candidate != null)
    {
        ReleaseVoice(candidate, VoiceEndReason.Stolen);
        return candidate;
    }
    return null;
}`,
    explanations: [
      {
        lineRange: 'L643 - L677',
        codeSnippet: `if (v.stopping)
{
    if (!foundStopping || v.reservedOrder < candidate.reservedOrder)
    {
        candidate = v;
        foundStopping = true;
    }
}
else if (!foundStopping)
{
    if (candidate == null || v.reservedOrder < candidate.reservedOrder)
    {
        candidate = v;
    }
}`,
        title: '2段階の賢いスチール優先順位アルゴリズム',
        soundDesignerPerspective: '「今まさに気持ちよく鳴っている音」をいきなりブチッと切るのではなく、「もう音が消えかけてフェードアウトしている瀕死のボイス」を優先して奪うため、プレイヤーに音切れを感じさせません。',
        programmerPerspective: 'フラグ `foundStopping` を使った華麗な1パス探索です。フェード停止中のものが見つかれば通常の再生中ボイスは候補から除外され、その中で最も古い通し番号のものが選ばれます。',
        deepExplanation: 'ハードウェア音源（MIDI音源やシンセサイザー）の時代から受け継がれてきたボイスアロケーションの王道アルゴリズムを、C#で極限まで無駄なく実装したコードです。'
      },
      {
        lineRange: 'L679 - L683',
        codeSnippet: `if (candidate != null)
{
    ReleaseVoice(candidate, VoiceEndReason.Stolen);
    return candidate;
}`,
        title: 'ReleaseVoice での世代交代と通知',
        soundDesignerPerspective: 'Sound Monitorに「この瞬間にボイススチールが発生した」というログが飛び、どの音が消されたのかが丸見えになります。',
        programmerPerspective: '`ReleaseVoice` 内で `candidate.generation++` が実行されるため、奪われた音を持っていた古い `SoundPlayback` は瞬時に無効化されます。',
        deepExplanation: 'スチールされた枠はリセットされた上で、新しい再生要求 `PlayCore` にそのまま引き渡されます。メモリの再確保（new）は1バイトも発生しません。'
      }
    ],
    quiz: {
      question: 'プールが枯渇した際、通常の再生中ボイスよりも「stopping（フェードアウト停止中）」のボイスを優先してスチールする理由は何ですか？',
      options: [
        { text: 'すでに音が消えかかっており、途中で奪ってもプレイヤーに不自然な音切れ（ブツ切り感）を最も悟られにくいため', isCorrect: true, explanation: '正解！鳴っている真っ最中の音を止めるよりも、フェードアウトして間もなく消えるボイスを再利用する方が聴覚上の違和感を最小限に抑えられます。' },
        { text: 'stopping のボイスのほうがメモリサイズが小さいため', isCorrect: false, explanation: 'メモリサイズは同じです。音響的な自然さのための優先度設計です。' }
      ],
      soundContext: 'ボイススティーリングと聴覚心理'
    }
  },

  // ==========================================
  // モジュール 7: フェード と 直交ゲイン管理
  // ==========================================
  {
    id: 'mod-07-ramp-gain',
    title: '7. RampGain & Orthogonal Fade System',
    subtitle: '重なるフェードの安全な打ち消し（seq） と ゼロアロケーション・コルーチン',
    summary: 'フェードイン中にフェードアウトされた時、古いコルーチンをどう安全に打ち切るか？シーケンス番号 seq による排他制御と滑らかなボリューム減衰を解剖します。',
    lines: 'L782 - L848',
    keyTakeaways: [
      'levelSeq / pauseSeq による古い非同期フェードコルーチンの安全な自動失効',
      'RampAlive ガードにより、スチール済み・停止済みのボイスへのフェード継続を防止',
      'SanitizeSeconds による NaN / 負数の安全な 0秒 クランプ',
      'yield return null による毎フレームの滑らかな音量補間'
    ],
    codeSnippets: `private static uint SeqOf(PooledVoice v, GainKind kind) =>
    kind == GainKind.Level ? v.levelSeq : kind == GainKind.Pause ? v.pauseSeq : v.volumeSeq;

private static bool RampAlive(PooledVoice v, GainKind kind, float to, uint gen, uint seq)
{
    if (!v.inUse || v.generation != gen || SeqOf(v, kind) != seq) return false;
    if (kind == GainKind.Level && to == 0f) return true; // 停止フェードアウトはstopping中でも最後まで完走させる
    return !v.stopping;
}

private IEnumerator RampGain(PooledVoice voice, GainKind kind, float to, float fadeTime, uint seq)
{
    uint gen = voice.generation;
    fadeTime = SanitizeSeconds(fadeTime);

    if (fadeTime <= 0f)
    {
        SetGain(voice, kind, to);
        ApplyVoiceVolume(voice);
        yield break;
    }

    float from = GainOf(voice, kind);
    float elapsed = 0f;

    while (elapsed < fadeTime)
    {
        yield return null;
        if (!RampAlive(voice, kind, to, gen, seq)) yield break; // 新しい操作が入ったら即座に自決する

        elapsed += Time.unscaledDeltaTime;
        float t = Mathf.Clamp01(elapsed / fadeTime);
        SetGain(voice, kind, Mathf.Lerp(from, to, t));
        ApplyVoiceVolume(voice);
    }

    if (RampAlive(voice, kind, to, gen, seq))
    {
        SetGain(voice, kind, to);
        ApplyVoiceVolume(voice);
    }
}`,
    explanations: [
      {
        lineRange: 'L794 - L803',
        codeSnippet: `if (!v.inUse || v.generation != gen || SeqOf(v, kind) != seq) return false;`,
        title: '世代（gen）とシーケンス（seq）の二重防壁（自決ロジック）',
        soundDesignerPerspective: '「フェードインしている最中に急いで一時停止や停止を押したのに、前のフェードインが裏で生きていて勝手に音量が上がってしまう」という怪奇現象を完璧に封じ込めます。',
        programmerPerspective: 'コルーチンを `StopCoroutine` で外部から止めるのはUnityでは不安定になりがちです。新しい操作が来るたびに `seq++` することで、古いコルーチンがループの先頭で「あ、自分の `seq` が古い！」と気づいて自ら `yield break` して消滅します。',
        deepExplanation: '非同期処理における「CancellationToken」と同じ概念を、軽量な整数インクリメントだけで実現した非常に堅牢なパターンです。'
      },
      {
        lineRange: 'L847',
        codeSnippet: `private static float SanitizeSeconds(float seconds) =>
    float.IsNaN(seconds) || seconds < 0f ? 0f : seconds;`,
        title: 'SanitizeSeconds による NaN ガード',
        soundDesignerPerspective: 'ゲームの計算ミスで `0 / 0` などが発生してフェード時間に `NaN（非数）` が渡された場合でも、Unityがフリーズしたりクラッシュせず、即時（0秒）として安全に処理を続行します。',
        programmerPerspective: '浮動小数点数のバグで最も恐ろしい `NaN` や負の無限大を早期に検知し、安全な `0f` に浄化（サニタイズ）する防御プログラミングです。',
        deepExplanation: '商用ゲームのサウンドミドルウェアにおいて、外部からどんな異常値が渡されても絶対にアプリを落とさないための重要な防波堤です。'
      }
    ],
    quiz: {
      question: 'RampGain コルーチン内で、毎フレーム `SeqOf(v, kind) != seq` をチェックしている理由は何ですか？',
      options: [
        { text: 'フェード中に新しい音量操作（StopやPauseなど）が呼ばれた際、古いフェード処理を即座に自決（終了）させて音量の競合を防ぐため', isCorrect: true, explanation: '正解！新しい操作で seq がインクリメントされるため、古いコルーチンは自分が過去のものになったと察して即座に終了します。' },
        { text: 'BGMのサンプリング周波数をチェックするため', isCorrect: false, explanation: 'フェード操作の競合制御のためのシーケンス番号です。' }
      ],
      soundContext: '非同期音量フェードの排他制御'
    }
  },

  // ==========================================
  // モジュール 8: 耳に心地よい対数ピッチ補間
  // ==========================================
  {
    id: 'mod-08-ramp-pitch',
    title: '8. RampPitch & Logarithmic Tuning',
    subtitle: '音楽的な半音等比ピッチフェード と 0付近の特異点丸め処理',
    summary: 'なぜピッチ変更は直線補間（線形）ではなく対数（Log）でなければならないのか？音楽理論とDSPに基づいた美しいピッチベンド実装を解剖します。',
    lines: 'L858 - L897',
    keyTakeaways: [
      '人間の耳が音高を「周波数の比率（対数）」で感じる特性に合わせた補間式',
      'Mathf.Lerp(Mathf.Log(from), Mathf.Log(to), t) による半音等比推移',
      'ピッチ 0 付近で停止・フリーズするのを防ぐ 0.01f クランプ',
      '正再生から逆再生（負のピッチ）へまたぐ場合の安全な直線フォールバック'
    ],
    codeSnippets: `private IEnumerator RampPitch(PooledVoice voice, float to, float fadeTime, uint seq)
{
    uint gen = voice.generation;
    fadeTime = SanitizeSeconds(fadeTime);
    float from = voice.source.pitch;

    // 0付近は停止してしまうため丸める
    if (Mathf.Abs(to) < 0.01f) to = to < 0f ? -0.01f : 0.01f;

    bool crossSign = (from > 0f && to < 0f) || (from < 0f && to > 0f);
    float logFrom = !crossSign && from != 0f ? Mathf.Log(Mathf.Abs(from)) : 0f;
    float logTo   = !crossSign && to   != 0f ? Mathf.Log(Mathf.Abs(to))   : 0f;

    float elapsed = 0f;
    while (elapsed < fadeTime)
    {
        yield return null;
        if (!PitchRampAlive(voice, gen, seq)) yield break;

        elapsed += Time.unscaledDeltaTime;
        float t = Mathf.Clamp01(elapsed / fadeTime);
        float p;
        if (crossSign)
        {
            p = Mathf.Lerp(from, to, t);
        }
        else
        {
            // 比率を対数で補間することで、半音の間隔が時間に対して均等に変わる
            float sign = to < 0f ? -1f : 1f;
            p = sign * Mathf.Exp(Mathf.Lerp(logFrom, logTo, t));
        }
        voice.source.pitch = p;
    }
}`,
    explanations: [
      {
        lineRange: 'L878 - L893',
        codeSnippet: `// 比率を対数で補間することで、半音の間隔が時間に対して均等に変わる
float sign = to < 0f ? -1f : 1f;
p = sign * Mathf.Exp(Mathf.Lerp(logFrom, logTo, t));`,
        title: 'なぜピッチフェードは Exp(Lerp(Log, Log)) なのか？',
        soundDesignerPerspective: 'ピッチを1オクターブ（2倍）から2オクターブ（4倍）へ上げる時、直線で補間すると「最初はゆっくり上がり、後半急激にピッチが跳ね上がる」不気味なカーブになります。対数補間（Exp/Log）にすることで、ピアノの鍵盤をド・レ・ミ…と等間隔で駆け上がるような最高に自然なピッチベンドになります。',
        programmerPerspective: '音高（ピッチ）は周波数の倍率であり、オクターブは $2^n$ の指数関数です。対数空間（Log）で線形補間（Lerp）した後に指数（Exp）で戻すことで、数学的に正確な等比数列補間を実現しています。',
        deepExplanation: 'シンセサイザーのピッチベンドホイールやポルタメントが滑らかに聴こえる物理的根拠に基づいた、音響プログラミングならではの珠玉のコードです。'
      },
      {
        lineRange: 'L863',
        codeSnippet: `if (Mathf.Abs(to) < 0.01f) to = to < 0f ? -0.01f : 0.01f;`,
        title: 'ピッチゼロのブラックホール回避',
        soundDesignerPerspective: 'UnityのAudioSourceは、pitchが完全な0になると再生が停止（フリーズ）してしまい、再び数値を上げても音が復帰しない事故が起きます。',
        programmerPerspective: '`Mathf.Abs(to) < 0.01f` の極小値になった場合、符号を維持したまま `±0.01f` に丸めることで、オーディオエンジンの停止特異点を安全に回避しています。',
        deepExplanation: 'スローモーション演出（バレットタイム）等でピッチを極限まで下げる際に、音がクラッシュして消滅するのを防ぐ現場の知恵です。'
      }
    ],
    quiz: {
      question: 'ピッチフェードで線形補間（普通のLerp）ではなく対数補間（Exp(Lerp(Log, Log))) を行っている理由は何ですか？',
      options: [
        { text: '人間の聴覚は周波数の倍率で音高を感じるため、対数空間で補間することで半音の変化速度が時間に対して一定に聴こえるから', isCorrect: true, explanation: '正解！オクターブや半音は比率（掛け算）の世界です。対数で計算することで、耳にとって自然で心地よいピッチベンドが実現します。' },
        { text: 'CPUが指数計算のほうが得意だから', isCorrect: false, explanation: 'CPU負荷は増えますが、聴覚特性に合わせた音楽的表現のために行っています。' }
      ],
      soundContext: '音楽的ピッチ補間と対数特性'
    }
  },

  // ==========================================
  // モジュール 9: クールダウン連打抑制 と 辞書掃除
  // ==========================================
  {
    id: 'mod-09-cooldown-system',
    title: '9. Cooldown & Memory Pruning',
    subtitle: '同一SEのマシンガン連打防止 と メモリ肥大化を防ぐ定期的な Prune 掃除',
    summary: '連射弾や足音の連続発音で音が重なって爆音化するのを防ぐクールダウン機構と、Dictionaryにゴミが溜まり続けないように自動掃除する仕組みを解剖します。',
    lines: 'L899 - L950',
    keyTakeaways: [
      '同一フレーム/極小時間内の重複発音をキー（ClipまたはPreset）単位で抑制',
      'Time.unscaledTime を基準にしたフレーム非依存の発音時刻記録',
      '辞書肥大化によるメモリリークを防ぐ PruneCooldowns（期限切れレコード削除）',
      'ループ音はクールダウンの対象外とするスマートな除外判定'
    ],
    codeSnippets: `private bool IsOnCooldownInternal(UnityEngine.Object key, float cooldownSeconds)
{
    if (key == null || cooldownSeconds <= 0f) return false;
    if (_lastPlayTime.TryGetValue(key, out var last))
    {
        return (Time.unscaledTime - last) < cooldownSeconds;
    }
    return false;
}

private void MarkPlayedInternal(UnityEngine.Object key, float cooldownSeconds)
{
    if (key == null || cooldownSeconds <= 0f) return;
    _lastPlayTime[key] = Time.unscaledTime;
    // 登録件数が増えたら期限切れレコードを掃除する
    if (_lastPlayTime.Count > 100) PruneCooldowns();
}

private void PruneCooldowns()
{
    float now = Time.unscaledTime;
    var removeList = new List<UnityEngine.Object>();
    foreach (var kvp in _lastPlayTime)
    {
        if (kvp.Key == null || (now - kvp.Value) > 60f)
        {
            removeList.Add(kvp.Key);
        }
    }
    for (int i = 0; i < removeList.Count; i++) _lastPlayTime.Remove(removeList[i]);
}`,
    explanations: [
      {
        lineRange: 'L899 - L910',
        codeSnippet: `if (_lastPlayTime.TryGetValue(key, out var last))
{
    return (Time.unscaledTime - last) < cooldownSeconds;
}`,
        title: 'マシンガン現象（重複爆音）の防止',
        soundDesignerPerspective: '散弾銃のヒット時や大量のコイン取得時に、同一フレームで50回 `Play(coinSe)` が呼ばれると、音が重なって耳を破壊する大爆音（クリッピング）になります。クールダウン（例: 0.05秒）を挟むことで、心地よい連打感だけを残して爆音化を防ぎます。',
        programmerPerspective: '`_lastPlayTime` 辞書に最後に鳴った時刻（`Time.unscaledTime`）を記録し、差分が `cooldownSeconds` 未満なら再生要求を即座に破棄（早期リターン）します。',
        deepExplanation: 'ゲーム側でトリガーを雑に叩かれても、サウンドマネージャー側が防波堤となってオーディオの安全性を担保する設計です。'
      },
      {
        lineRange: 'L931 - L950',
        codeSnippet: `if (kvp.Key == null || (now - kvp.Value) > 60f)
{
    removeList.Add(kvp.Key);
}`,
        title: 'PruneCooldowns による辞書メモリの自動掃除',
        soundDesignerPerspective: '何千種類ものSEが使われる巨大なゲームを何十時間プレイし続けても、メモリ消費が増え続けずに安定動作を保証します。',
        programmerPerspective: 'Dictionaryにキーを詰め込み続けるとメモリリークになります。1分（60秒）以上鳴っていない音や、破棄されたオブジェクト（`kvp.Key == null`）を自動的に洗い出して削除（Prune）することで、辞書サイズを常にコンパクトに保ちます。',
        deepExplanation: '長時間の耐久テストや本番運用に耐えうる商用クオリティのコードならではの防塵メンテナンス処理です。'
      }
    ],
    quiz: {
      question: '`PruneCooldowns` で `kvp.Key == null` のエントリを削除している理由は何ですか？',
      options: [
        { text: 'シーン遷移などで破棄されたゲームオブジェクト（Destroy済みPreset/Clip）の幽霊参照を辞書から除去し、メモリリークを防ぐため', isCorrect: true, explanation: '正解！UnityのObjectはDestroyされてもC#辞書に参照が残っているとGC回収されないため、定期的に null チェックして削除するのが定石です。' },
        { text: '音量をリセットするため', isCorrect: false, explanation: 'メモリリーク防止のためのクリーンアップです。' }
      ],
      soundContext: '長期稼働ゲームのメモリ健全性維持'
    }
  },

  // ==========================================
  // モジュール 10: ゼロコピー発音コアエンジン
  // ==========================================
  {
    id: 'mod-10-play-core',
    title: '10. PlayCore & Doppler Bug Prevention',
    subtitle: '全再生を統括する単一パイプライン と ドップラー効果ピッチ跳ね上がりバグの根絶',
    summary: 'すべての公開API（PlayBgm, PlaySe等）が集約される心臓部 `PlayCore`。3D座標をPlay()の直前に確定させる超重要ノウハウを解剖します。',
    lines: 'L1057 - L1155',
    keyTakeaways: [
      'すべての再生要求を PlayCore(in PlayRequest req) の単一パイプラインで処理',
      'in パラメータによる構造体のゼロコピー高速受渡し',
      'Play() より前に 3D 座標を確定させ、ドップラー誤作動ピッチ跳ね上がりを根絶',
      'startsSilent と RampGain によるBGMクロスフェードの滑らかな発音開始'
    ],
    codeSnippets: `private SoundPlayback PlayCore(in PlayRequest req)
{
    var clip = req.clip;
    var category = req.category;
    if (clip == null) return default;

    var plan = req.plan;

    // クールダウン判定
    if (plan.cooldownApplies && IsOnCooldownInternal(req.cooldownKey, plan.cooldownSeconds))
        return default;

    // 排他再生グループの退避
    if (plan.exclusiveFadeOut)
        FadeOutOthersInCategory(category, null, plan.othersFadeOut, plan.keepPausedEffective);

    var voice = GetFreeVoice(category);
    if (voice == null) return default;

    ResetVoiceAndSource(voice, category, clip, req.volume, req.pitch, req.loopPoint);
    var src = voice.source;

    // 3D位置は必ず Play() より前に確定させる！
    // Play() 後に位置を動かすと、直前の位置から新位置へ同一フレームで瞬間移動したことになり、
    // dopplerLevel>0 の場合に Unity が「超高速移動」と誤認してピッチが跳ね上がる。
    if (plan.preConfigures3D)
    {
        src.transform.position = req.position;
        req.spatial.ApplyTo(src);
    }
    src.Play();

    IncrementActiveCount(category);
    if (plan.cooldownApplies) MarkPlayedInternal(req.cooldownKey, plan.cooldownSeconds);

    if (plan.startsSilent)
        StartCoroutine(RampGain(voice, GainKind.Level, 1f, plan.fadeIn, voice.levelSeq));

    return new SoundPlayback(voice);
}`,
    explanations: [
      {
        lineRange: 'L1125 - L1134',
        codeSnippet: `// 3D位置/dopplerLevel等はPlay()より前に確定させる。Play()後に位置を動かすと、
// プールから使い回されたAudioSourceが直前の位置から新位置へ同一フレームで瞬間移動したことになり、
// dopplerLevel>0の場合はUnityがこれを「超高速移動」と誤認識してピッチが跳ね上がる
// (「先頭でブツッ→早送りのような音」というノイズ報告の原因)。
if (plan.preConfigures3D)
{
    src.transform.position = req.position;
    req.spatial.ApplyTo(src);
}
src.Play();`,
        title: 'Unity最大の罠: プールされたAudioSourceのドップラーピッチ跳ね上がり',
        soundDesignerPerspective: '「3D空間で敵が爆発したとき、音が鳴った瞬間だけピュンッ！と早送りみたいな変な高音ノイズが乗る」という、Unityコミュニティでも長年謎とされてきた怪異の正体です。',
        programmerPerspective: 'プールで使い回されたAudioSourceは、前回の音が鳴った古い座標（例: x=-50）にいます。これを新しい座標（例: x=+50）に動かす前に `src.Play()` を呼ぶと、Play直後に座標が100m瞬間移動したことになり、Unityのドップラー効果計算が「音速を超えた超高速移動」とみなしてピッチを限界まで跳ね上げてしまいます。',
        deepExplanation: '`src.Play()` の前に `src.transform.position = req.position` を完了させる。たった2行の順序の入れ替えですが、何日も悩まされる現場の致命的音響ノイズを完璧に防ぐ極上の知見です。'
      },
      {
        lineRange: 'L1057',
        codeSnippet: `private SoundPlayback PlayCore(in PlayRequest req)`,
        title: 'in 修飾子によるゼロコピー発音パイプライン',
        soundDesignerPerspective: '毎秒何百発もの銃撃音や環境音のリクエストが飛んできても、フレームレートが1ミリも落ちません。',
        programmerPerspective: '`PlayRequest` は座標や音量、クリップなど多数のデータを持つ大きめの構造体です。`in` を付けて参照渡しにすることで、スタック上での構造体メモリコピー（複製）を完全にゼロにし、CPUレジスタとキャッシュを最速で通過します。',
        deepExplanation: '全ての再生メソッド（Play, PlayBgm, PlaySe, Play3D...）を1つのコア関数 `PlayCore` に集約することで、クールダウンや排他処理の漏れを物理的になくす美しいDRY原則の体現です。'
      }
    ],
    quiz: {
      question: 'プールされた AudioSource で 3D サウンドを再生する際、`src.Play()` より前に座標（`src.transform.position`）を設定しなければならない致命的な理由は何ですか？',
      options: [
        { text: 'Play後に座標を動かすと、プール上の前回の古い位置から瞬間移動したとUnityが誤認し、ドップラー効果で再生直後のピッチが跳ね上がるノイズが発生するため', isCorrect: true, explanation: '大正解！ドップラー効果（dopplerLevel > 0）が有効な環境でPlay直後に移動させると、音速超えの移動とみなされ「ピュンッ！」という不快なピッチ狂いノイズが必ず発生します。' },
        { text: 'Play後だと座標の変更がUnityに無視されるため', isCorrect: false, explanation: '変更はされますが、ドップラー効果によるピッチ跳ね上がりバグが発生します。' }
      ],
      soundContext: '3Dオーディオプーリングとドップラーノイズ対策'
    }
  }
];
