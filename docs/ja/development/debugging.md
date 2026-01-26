# デバッグ

デバッグはいかなる開発サイクルにおいても避けることのできない、必要なものです。
CakePHP は IDE やエディタと直接連携するようなツールは提供しませんが、CakePHP は
デバッグ作業やあなたのアプリケーション内部で何が走っているのかを探る作業を助けるための
ツールをいくつか提供します。

## 基本的なデバッグ

`function` **debug(mixed $var, boolean $showHtml = null, $showFrom = true)**

param mixed \$var  
出力する内容。配列やオブジェクトを渡してもうまく動作します。

param boolean \$showHTML  
true をセットしたならエスケープが有効になります。2.0 では、
ウェブリクエストを扱う場合にはデフォルトでエスケープが有効になります。

param boolean \$showFrom  
debug() がどのファイルのどの行で呼ばれたのかを表示します。

debug() 関数は PHP 関数の print_r() と同様に、グローバルに利用可能な関数です。
debug() 関数により、さまざまな方法で変数の内容を出力することができます。
データを HTML に優しい方法で表示させたいなら、第２引数を true にしてください。
この関数はまた、デフォルトで呼ばれた場所となるファイルと行番号も出力します。

この関数からの出力は、core の debug 変数が 0 より大きな値だった場合のみ行われます。

::: info Changed in version 2.1
`debug()` の出力は `var_dump()` のものと多くの点で似ており、内部的には `Debugger` を使っています。
:::

## Debugger クラス

Debugger クラスは CakePHP 1.2 で導入され、デバッグ情報を取得するための数多くのオプションも、
持っているものでした。それには static に呼び出すいくつかの関数が存在し、ダンプ出力やログ出力、
エラーをハンドルする関数を提供していました。

Debugger クラスは PHP のデフォルトのエラーハンドリングを上書き、より使いやすいエラーレポートを
するものに置き換えます。CakePHP ではデフォルトで Debugger クラスのエラーハンドリングが使われます。
すべてのデバッグ関数と同様に、 `Configure::debug` が 0 より大きい値の場合のみ動作します。

エラーが発生したら、Debugger はページに情報を表示し、かつ、error.log ファイルに出力します。
生成されるエラーレポートにはスタックトレースとエラーが発生した部分のコード抜粋の両方が出力されます。
「Error」のリンクをクリックすると、スタックトレースが表示され、「Code」のリンクをクリックすると、
エラーが発生した行が表示されます。

## Debugger クラスの使用

`class` **Debugger**

Debugger を使用する際にはまず、Configure::read('debug') に 0 より大きな値が
セットされていることを確認してください。

`static` Debugger::**dump**($var, $depth = 3)

dump は変数の内容を出力します。渡された変数のすべてのプロパティと
（可能なら）メソッドを出力します:

``` php
$foo = array(1,2,3);

Debugger::dump($foo);

// 出力
array(
    1,
    2,
    3
)

// シンプルなオブジェクト
$car = new Car();

Debugger::dump($car);

// 出力
Car
Car::colour = 'red'
Car::make = 'Toyota'
Car::model = 'Camry'
Car::mileage = '15000'
Car::accelerate()
Car::decelerate()
Car::stop()
```

::: info Changed in version 2.1
2.1 以降、出力が読みやすいものに変更されました。 `Debugger::exportVar()` を参照してください。
:::

::: info Changed in version 2.5.0
`depth` パラメータが追加されました。
:::

`static` Debugger::**log**($var, $level = 7, $depth = 3)

呼び出されたときに詳細なスタックトレースを生成します。 log() メソッドは Debugger::dump()
によるものと似たデータを出力しますが、出力バッファにではなく、 debug.log に出力します。
log() が正常に動作するためには、あなたの app/tmp ディレクトリ（と、その中）はウェブサーバにより
書き込み可能でなければならないことに気をつけてください。

::: info Changed in version 2.5.0
`depth` パラメータが追加されました。
:::

`static` Debugger::**trace**($options)

現在のスタックトレースを返します。トレースの各行には、呼び出しているメソッド、
どこから呼ばれたかというファイルと行番号が含まれています:

``` text
//PostsController::index() の中で
pr(Debugger::trace());

//出力
PostsController::index() - APP/Controller/DownloadsController.php, line 48
Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
[main] - APP/webroot/index.php, line 84
```

上記では、コントローラのアクション内で Debugger::trace() を呼ぶことで、スタックトレースを
生成しています。スタックトレースは下から上へと読み、現在走っている関数（スタックフレーム）の
順になっています。上記の例では、index.php が Dispatcher::dispatch() を呼び、それが今度は
Dispatcher::\_invoke() を呼んでいます。その後、\_invoke() メソッドは
PostsController::index() を呼んでいます。この情報は再帰呼出やスタックが深い場合に、
trace() の時点でどの関数が現在走っているのか特定できるので、役に立ちます。

`static` Debugger::**excerpt**($path, $line, $context)

\$path （絶対パス） にあるファイルからの抜粋を取得します。\$line 行目をハイライトし、
\$line 行目の前後 \$context 行もあわせて取得します:

``` php
pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));

//下記のように出力されます
Array
(
    [0] => <code><span style="color: #000000"> * @access public</span></code>
    [1] => <code><span style="color: #000000"> */</span></code>
    [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

    [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
    [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
)
```

このメソッドは内部的に使われているものですが、あなたが独自のエラーメッセージを生成する場合や
独自の状況でログ出力する場合にも使いやすいものです。

`static` Debugger::**exportVar**($var, $recursion = 0)

どんなタイプの変数でもデバッグ出力に使える文字列へと変換します。このメソッドはまた、
多くの Debugger により内部変数を変換する際に使われているものです。あなた自身の
Debugger でも使うことができるでしょう。

::: info Changed in version 2.1
この関数は 2.1 以前とは異なる出力内容を生成します。
:::

`static` Debugger::**invoke**($debugger)

CakePHP Debugger を新しいインスタンスに置き換えます。

`static` Debugger::**getType**($var)

変数の型を取得します。オブジェクトならクラス名を返します。

::: info Added in version 2.1
:::

## ログ出力によるデバッグ

アプリケーションをデバッグするもう一つの良い方法はログメッセージです。
`CakeLog` を使うことで、あなたのアプリケーションでログ出力をさせることができます。
`Object` を継承するすべてのオブジェクトは、インスタンスメソッド <span class="title-ref">log()</span> を持っており、
ログメッセージを出力するのに使えます:

``` php
$this->log('通ったよ', 'debug');
```

上記では `通ったよ` がデバッグログに出力されます。ログに出力することで、リダイレクトや
複雑なループを含むメソッドをデバッグしやすくなるでしょう。また、 `CakeLog::write()` を
使うことで、ログメッセージを書きだすことも可能です。このメソッドは CakeLog がロードされているなら
static にあなたのアプリケーション内のどこからでも呼び出すことができるのです:

``` php
// app/Config/bootstrap.php の中で
App::uses('CakeLog', 'Log');

// あなたのアプリケーションのどこからでも
CakeLog::write('debug', '通ったよ');
```

## Debug Kit

DebugKit は便利なデバッグツールをたくさん提供してくれるプラグインです。
まずは、レンダリングされた HTML 内にツールバーを表示して、あなたのアプリケーションや
現在のリクエストについての情報を大量に提供してくれます。GitHub の
[DebugKit](https://github.com/cakephp/debug_kit/tree/2.2) からダウンロードが可能です。

## Xdebug

あなたの環境に Xdebug PHP 拡張が組み込まれている場合、致命的なエラーは、
Xdebug スタックトレースの詳細が表示されます。Xdebug の詳細は、
[Xdebug](https://xdebug.org) をご覧ください。
