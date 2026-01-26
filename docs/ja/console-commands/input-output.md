# コマンドの入力と出力

`class` Cake\\Console\\**ConsoleIo**

CakePHP は `ConsoleIo` オブジェクトをコマンドに提供するので、
ユーザー入力と出力情報を対話的にユーザーに読み取らせることができます。

## コマンドヘルパー

コマンドヘルパーは、コマンド、シェルまたはタスクからアクセスして使用できます。 :

``` php
// 表としてデータを出力
$io->helper('Table')->output($data);

// プラグインからヘルパーを取得
$io->helper('Plugin.HelperName')->output($data);
```

また、ヘルパーのインスタンスを取得し、それらのパブリックメソッドを呼び出すこともできます。 :

``` php
// Progress ヘルパーを取得して利用
$progress = $io->helper('Progress');
$progress->increment(10);
$progress->draw();
```

## ヘルパーの作成

CakePHPにはいくつかのコマンドヘルパーが付属していますが、
アプリケーションやプラグインでもっと多くのコマンドヘルパーを作成できます。
例として、装飾的な見出しを生成するための簡単なヘルパーを作成してみましょう。まず
**src/Command/Helper/HeadingHelper.php** を作成し、以下を記述してください。 :

``` php
<?php
namespace App\Command\Helper;

use Cake\Console\Helper;

class HeadingHelper extends Helper
{
    public function output($args)
    {
        $args += ['', '#', 3];
        $marker = str_repeat($args[1], $args[2]);
        $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
    }
}
```

この新しいヘルパーは、シェルコマンドの中で呼び出すことで使用できます。 :

``` php
// 両側に ### を付加
$this->helper('Heading')->output(['It works!']);

// 両側に ~~~~ を付加
$this->helper('Heading')->output(['It works!', '~', 4]);
```

ヘルパーは一般的に、配列のパラメーターを受けとる `output()` メソッドを実装しています。
しかし、コンソールヘルパーは任意の形式の引数を受け取る追加のメソッドを実装できる普通のクラスです。

> [!NOTE]
> 下位互換のため、ヘルパーは、 `src/Shell/Helper` にも配置できます。

## 組み込みヘルパー

### Table ヘルパー

TableHelper は、成形されたアスキーアートの表の作成を支援します。
使い方はとてもシンプルです。 :

``` php
$data = [
    ['Header 1', 'Header', 'Long Header'],
    ['short', 'Longish thing', 'short'],
    ['Longer thing', 'short', 'Longest Value'],
];
$io->helper('Table')->output($data);

// 出力結果
+--------------+---------------+---------------+
| Header 1     | Header        | Long Header   |
+--------------+---------------+---------------+
| short        | Longish thing | short         |
| Longer thing | short         | Longest Value |
+--------------+---------------+---------------+
```

### Progress ヘルパー

ProgressHelper は２つの異なる方法で利用されます。
シンプルなモードは、処理が完了するまでに呼び出されるコールバックを渡すことができます。 :

``` php
$io->helper('Progress')->output(['callback' => function ($progress) {
    // ここで作業します
    $progress->increment(20);
    $progress->draw();
}]);
```

追加のオプションを渡すことで、プログレスバーの制御ができます。

- `total` プログレスバーの全アイテム数。デフォルトは 100 です。
- `width` プログレスバーの幅。デフォルトは 80 です。
- `callback` プログレスバーを更新するループ中で呼ばれるコールバック。

全てのオプションを使用した例です。 :

``` php
$io->helper('Progress')->output([
    'total' => 10,
    'width' => 20,
    'callback' => function ($progress) {
        $progress->increment(2);
        $progress->draw();
    }
]);
```

Progress ヘルパーは、必要であればプログレスバーの増加や再描画を手動で行うことができます。 :

``` php
$progress = $io->helper('Progress');
$progress->init([
    'total' => 10,
    'width' => 20,
]);

$progress->increment(4);
$progress->draw();
```

## ユーザー入力の取得

`method` Cake\\Console\\ConsoleIo::**ask**($question, $choices = null, $default = null)

対話的なコンソールアプリケーションを構築する際には、ユーザー入力を取得する必要があります。
CakePHP は、このための簡単な方法を提供します。 :

``` php
// ユーザーから任意のテキストを取得
$color = $io->ask('What color do you like?');

// ユーザーの選択を取得
$selection = $io->askChoice('Red or Green?', ['R', 'G'], 'R');
```

選択のバリデーションは大文字と小文字を区別しません。

## ファイルの作成

`method` Cake\\Console\\ConsoleIo::**createFile**($path, $contents)

ファイルを作成することは、多くの場合、開発とデプロイの自動化に役立つ多くのコンソールコマンドの
重要な部分です。 `createFile()` メソッドは、対話的な確認でファイルを作成するための
シンプルなインターフェイスを提供します。 :

``` php
// 上書きの確認を含むファイルを作成します
$io->createFile('bower.json', $stuff);

// 尋ねることなく強制的に上書きします
$io->createFile('bower.json', $stuff, true);
```

## 出力の作成

`stdout` や `stderr` への書き込みは、CakePHP が簡単にできる別のルーチン操作です。 :

``` php
// 標準出力に出力
$io->out('Normal message');

// 標準エラーに出力
$io->err('Error message');
```

通常の出力メソッドに加え、CakePHP は適切な ANSI
カラーで出力をスタイルするラッパーメソッドを提供します。 :

``` php
// 標準出力に緑色テキスト
$io->success('Success message');

// 標準出力に水色テキスト
$io->info('Informational text');

// 標準出力に青色テキスト
$io->comment('Additional context');

// 標準エラーに赤色テキスト
$io->error('Error text');

// 照準エラーに黄色テキスト
$io->warning('Warning text');
```

また、出力レベルに関する2つの便利なメソッドを提供します。 :

``` php
// 詳細出力が有効の時のみ (-v)
$io->verbose('Verbose message');

// すべてのレベルで表示
$io->quiet('Quiet message');
```

シェルはまた、画面のクリア、空白行の作成、または横棒線を描くためのメソッドを含みます。 :

``` php
// ２行の改行を出力
$io->out($io->nl(2));

// 横棒線を描画
$io->hr();
```

最後に、画面上の現在のテキスト行を更新することができます。 :

``` php
$io->out('Counting down');
$io->out('10', 0);
for ($i = 9; $i > 0; $i--) {
    sleep(1);
    $io->overwrite($i, 0, 2);
}
```

> [!NOTE]
> 新しい行が出力されたら、テキストを上書きすることができないことに注意してください。

## 出力のレベル

コンソールアプリケーションには、詳細なレベルの出力が必要なことがよくあります。
たとえば、cron ジョブとして実行する場合、ほとんどの出力は不要です。
出力レベルを使用して、出力に適切なフラグを付けることができます。
シェルの利用者は、コマンドを呼び出すときに正しいフラグを設定することで、
関心のあるレベルを決定することができます。次の3つのレベルがあります。

- `QUIET` - 必須のメッセージであり、静かな（必要最小限の）出力モードでも表示。
- `NORMAL` - 通常利用におけるデフォルトのレベル。
- `VERBOSE` - 毎日利用には冗長すぎるメッセージを表示、しかしデバッグ時には有用。

以下のように出力を指定できます。 :

``` php
// すべてのレベルで表示されます。
$io->out('Quiet message', 1, ConsoleIo::QUIET);
$io->quiet('Quiet message');

// QUIET 出力時には表示されません。
$io->out('normal message', 1, ConsoleIo::NORMAL);
$io->out('loud message', 1, ConsoleIo::VERBOSE);
$io->verbose('Verbose output');

// VERBOSE 出力時のみ表示されます。
$io->out('extra message', 1, ConsoleIo::VERBOSE);
$io->verbose('Verbose output');
```

シェルの実行時に `--quiet` や `--verbose` を使うことで出力を制御できます。
これらのオプションはデフォルトで組み込まれていて、いつでも CakePHP コマンド内部の
出力レベルを制御できるように考慮されています。

また、 `--quiet` と `--verbose` オプションは、ログデータの標準出力/標準エラーへの
出力方法を制御します。通常の情報とそれ以上のレベルのログメッセージは標準出力/標準エラーに出力されます。
`--verbose` を使用する場合は、デバッグログは標準出力に出力されます。
`--quiet` を使用する場合は、警告とそれ以上のレベルのログメッセージのみ標準エラーに出力されます。

## 出力のスタイル

ちょうど HTML のようなタグを埋め込むことで、出力のスタイルを変更することができます。
ConsoleOutput はこれらのタグを正しい ansi コードシーケンスに変換したり、ansi コードを
サポートしないコンソールではタグを除去します。
スタイルはいくつかビルトインされたものがありますが、自分で作成することも 可能です。
ビルトインされたものは以下の通りです。

- `success` 成功メッセージ。緑色のテキスト。
- `error` エラーメッセージ。赤色のテキスト。
- `warning` 警告メッセージ。黄色のテキスト。
- `info` 情報メッセージ。水色のテキスト。
- `comment` 追加情報。青色のテキスト。
- `question` 質問事項。シェルが自動的に追加する。

`$io->styles()` を使ってさらに多くのスタイルを追加できます。
新しいスタイルを追加するには以下のようにします。 :

``` php
$io->styles('flashy', ['text' => 'magenta', 'blink' => true]);
```

これで `<flashy>` というタグが有効になり、ansi カラーが有効な端末であれば、
`$this->out('<flashy>うわ！</flashy> 何か変になった');` の場合の表示は
色がマゼンタでブリンクになります。
スタイルを定義する際は `text` と `background` 属性として以下の色が指定できます。

- black
- blue
- cyan
- green
- magenta
- red
- white
- yellow

さらに以下のオプションをブール型のスイッチとして指定できます。 値が真の場合に有効になります。

- blink
- bold
- reverse
- underline

スタイルを追加すると ConsoleOutput のすべてのインスタンスでも有効になります。
ですので stdout と stderr 両方のオブジェクトでこれらを再定義する必要はありません。

## カラー表示の無効化

カラー表示はなかなか綺麗ですが、オフにしたい場合や強制的にオンにしたい場合もあるでしょう。 :

``` php
$io->outputAs(ConsoleOutput::RAW);
```

これは RAW（生の）出力モードにします。 RAW 出力モードではすべてのスタイルが無効になります。
モードには３種類あります。

- `ConsoleOutput::COLOR` - カラーエスケープコードを出力します。
- `ConsoleOutput::PLAIN` - プレーンテキスト出力。既知のスタイルタグが出力から取り除かれます。
- `ConsoleOutput::RAW` - RAW 出力、スタイルや書式設定は行われない。
  これは XML を出力する場合や、スタイルのデバッグを行う際に役立ちます。

デフォルトでは \*nix システムにおける ConsoleOutput のデフォルトはカラー出力モードです。
Windows では `ANSICON` 環境変数がセットされている場合を除き、プレーンテキストモードが
デフォルトです。
