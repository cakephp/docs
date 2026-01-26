# ロギング

CakePHP コアクラスの Configure 設定は、内部で何が起きているかを知るための有益な手段です。
そこで、何が起きているかをディスクにログデータとして保存する必要が出てくるでしょう。
SOAP や AJAX、REST API のような技術を一緒に使うとデバッグはむしろ難しくなるでしょう。

ロギングは、時系列でアプリケーションで何が起きているかを知るための手段です。
何の検索ワードが使われましたか？何のエラーがユーザーに表示されましたか？
どのくらいの頻度で特定のクエリーが実行されましたか？

CakePHP でデータのロギングは簡単です。 log() 関数は、多くの CakePHP クラスの共通の祖先である
`LogTrait` により提供されています。もし、環境が CakePHP のクラス (Controller や Component,
View 等) であれば、あなたはデータを記録することができます。直接 `Log::write()` を同様に使うことも
出来ます。 [Writing To Logs](#writing-to-logs) を参照してください。

## ロギング設定

アプリケーションの起動処理の間に、 `Log` の設定は完了しているはずで **config/app.php** は、
これのためです。多かれ少なかれアプリケーションが望むロガーを定義できます。
ロガーは、 `Cake\Log\Log` を使い設定する必要があります。一例として:

``` php
use Cake\Log\Log;

// 短いクラス名
Log::config('debug', [
    'className' => 'File',
    'path' => LOGS,
    'levels' => ['notice', 'info', 'debug'],
    'file' => 'debug',
]);

// 完全な名前空間の名前
Log::config('error', [
    'className' => 'Cake\Log\Engine\FileLog',
    'path' => LOGS,
    'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
    'file' => 'error',
]);
```

上記では二つのロガーを作っています。一つは `debug` で、その他は `error` です。
それぞれが異なるレベルのメッセージを処理するために構成されています。
また、それらは別々のファイルにメッセージを格納しますので、
debug/notice/info のログをより深刻なエラーから分離するのが簡単です。

色々なレベルに応じた情報と意味の一覧は [Logging Levels](#logging-levels) を参照してください。

一度設定を作成した後、それを変更することはできません。 `Cake\Log\Log::drop()` と
`Cake\Log\Log::config()` を使って、設定を削除、再作成すべきです。

それらもまた、クロージャーを与えることによりロガーを作成することが可能です。
クロージャーこれはロガーオブジェクトがどのように構築されるかを完全に制御する必要がある時に役立ちます。
クロージャーは構築されたロガーのインスタンスを返さなければなりません。例えば:

``` php
Log::config('special', function () {
    return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
});
```

設定オプションは `DSN` の文字列で渡すことも可能です。これは環境変数や `PaaS`
プロバイダーを扱っている時に役立ちます。 :

``` php
Log::config('error', [
    'url' => 'file:///?levels[]=warning&levels[]=error&file=error',
]);
```

> [!NOTE]
> ロガーは `Psr\Log\LoggerInterface` を、実装する必要があります。

### ログアダプターの作成

ログアダプターはアプリケーションの一部やプラグインの一部になりえます。
例えば `DatabaseLog` という名前のデータベースロガーがあったとします。
アプリケーションの一部として **src/Log/Engine/DatabaseLog.php** に置かれます。
プラグインの一部として **plugins/LoggingPack/src/Log/Engine/DatabaseLog.php** に置かれます。
また、ログアダプターの設定は `Cake\Log\Log::config()` を使う必要があります。
例えば DatabaseLog の設定はこのようになります。 :

``` php
// src/Log 用
Log::config('otherFile', [
    'className' => 'Database',
    'model' => 'LogEntry',
    // ...
]);

// LoggingPack というプラグイン用
Log::config('otherFile', [
    'className' => 'LoggingPack.Database',
    'model' => 'LogEntry',
    // ...
]);
```

ログアダプターを設定する時、 `className` パラメーターは、ログハンドラーを配置しロードするために使用されます。
その他の設定プロパティーの全ては、ログアダプターのコンストラクターに配列として渡されます。 :

``` php
namespace App\Log\Engine;
use Cake\Log\Engine\BaseLog;

class DatabaseLog extends BaseLog
{
    public function __construct($options = [])
    {
        parent::__construct($options);
        // ...
    }

    public function log($level, $message, array $context = [])
    {
        // データベースに書き込みます。
    }
}
```

CakePHP では 全てのロギングアダプターにおいて `Psr\Log\LoggerInterface` を実装する必要があります。
`Cake\Log\Engine\BaseLog` クラスは、 `log()` メソッドを実装することだけを要求しますので、
そのインターフェイスを満たすための簡単な方法です。

<div id="file-log">

`FileLog` エンジンは次のオプションを受け取ります。

</div>

- `size` 基本的なログファイルローテーションの実装に使われます。もしログファイルサイズが
  特定のファイルサイズに到達した場合、既存のファイルはファイル名にタイムスタンプを付け加えることで
  名前が変更され、新しいログファイルが作成されます。整数バイト値か '10MB' や '100KB' などの
  人間が読みやすい文字列にすることができます。デフォルトは 10MB です。
- `rotate` ログファイルが削除される前に指定された回数ローテートされます。もし値が 0 の場合は、
  ログローテーションされずに削除されます。デフォルトは 10 です。
- `mask` 作成されるファイルのパーミッションを設定します。
  もし空のままであればデフォルトのパーミッションが使われます。

> [!WARNING]
> エンジンは接尾辞 `Log` を持っています。
> クラス名が `SomeLogLog` のような接尾辞が二重になった名前は避けるべきです。

> [!NOTE]
> 起動処理でロガーの設定をすべきです。 **config/app.php** はログアダプターの設定の慣習的な場所です。
>
> デバッグモード中では、FileEngine 使用時に無用なエラーの発生を避けるため、
> ディレクトリーが存在しない時には自動的に作成されるようになりました。

## エラーと例外のロギング

エラーと例外も記録できます。 app.php ファイル内に関連する値を設定することで
ログに記録することができます。debug が `true` のときにエラーが表示され、debug が `false` のときに
ログに記録されます。捕捉されなかった例外をログに記録するときは `log` オプションを
`true` に設定してください。詳しくは、 [構成設定](../development/configuration) を参照ください。

## ログストリームの相互作用

`Cake\Log\Log::configured()` で一連の設定を確認することができます。
`configured()` の戻り値は、現在設定されている全てを配列で返します。
`Cake\Log\Log::drop()` を使って、ストリームを削除することができます。
一度、ログの設定が削除されると、ロガーはメッセージを受信しなくなります。

## FileLog アダプターの利用

その名前が示すように、 FileLog は、ログメッセージをファイルに書き込みます。
書かれたログメッセージのレベルは、メッセージが書き込まれたファイルの名前で決まります。
もしレベルが指定されなければ、エラーログを書き込むための `LOG_ERR` が使われます。
デフォルトのログの場所は `logs/$level.log` です。 :

``` php
// CakePHP クラスの中でこれを実行
$this->log("何かがうまくいかなかった！");

// logs/error.log に追記された結果
// 2007-11-02 10:22:02 Error: 何かがうまくいかなかった！
```

設定されたディレクトリーは、ウェブサーバーユーザー権限で正しくロギングできるように
書き込み可能にしなければなりません。

ロガーの設定により、追加/代替の FileLog の場所を設定できます。FileLog は、独自のパスを使用するために
`path` を設定できます。 :

``` php
Log::config('custom_path', [
    'className' => 'File',
    'path' => '/path/to/custom/place/'
]);
```

> [!WARNING]
> もしロギングアダプターを設定していなければ、ログメッセージは保存されません。

## Syslog へのロギング

本番環境では、ファイルロガーの代わりに syslog を使用するようにシステムをセットアップすることを
強く勧めます。これは、(大部分は）ノンブロッキング方式で全て書き込むため、よりよく動作し、
そしてあなたのオペレーティングシステムのロガーは、独立してファイルのローテーションの設定ができ、
前処理を記述したり、ログを完全に別のストレージを使うことができます。

syslog を使うためには、デフォルトの FileLog エンジンを使うのとよく似ています。
ロギングに使用するエンジンとして Syslog を指定する必要があります。下記の設定は、デフォルトのロガーを
`Syslog` に置き換えるものです。これは、 **bootstrap.php** ファイルで設定します。 :

``` php
Log::config('default', [
    'engine' => 'Syslog'
]);
```

Syslog ロギングエンジンのための設定配列は、以下のキーを認識します。

- `format`: ２つのプレースホルダーを持つ sprintf テンプレート文字列で１つ目は、
  エラーレベルで、２つ目はメッセージのためのものです。このキーは、ロギングメッセージ内の
  サーバーやプロセスに関する追加の情報を付加するのに便利です。例えば、
  `%s - Web Server 1 - %s` は、プレースホルダーが置き換えられると、
  `error - Web Server 1 - An error occurred in this request` のようになります。
- `prefix`: 全てのログメッセージの先頭につく文字列です。
- `flag`: ロガーへの接続を開くために使用される整数値のフラグで、デフォルトは、
  `LOG_ODELAY` が使用されます。 詳しくは、 `openlog` のドキュメントをご覧ください。
- `facility`: syslog で使用するロギングスロット。デフォルトでは、 `LOG_USER` が使用されます。
  詳しくは、 ドキュメントの `syslog` をご覧ください。

## ログへの書き込み

ログファイルへの書き込みは、２つの方法があります。１つは、
静的な `Cake\Log\Log::write()` メソッドを使用することです。 :

``` php
Log::write('debug', '何かがうまくいかなかった');
```

２つ目は、 `LogTrait` を使用しているクラスに用意された `log()` ショートカット関数を使用することです。
log() を呼ぶと、内部的に `Log::write()` が呼ばれます。 :

``` php
// LogTrait を使用した クラス内でこれを実行
$this->log("何かがうまくいかなかった！", 'debug');
```

全ての設定されたログストリームは、 `Cake\Log\Log::write()` が呼ばれるたびに
順次書き込まれます。もし設定されていないログアダプターを持っているならば、
`log()` は `false` を返し何も書き込みません。

### レベルを使う

CakePHP は、標準 POSIX のロギングレベルをサポートします。
各レベルは、増加する重要度を表します。

- Emergency: システムは使用出来ません
- Alert: 今すぐ行動する必要がある
- Critical: 致命的な状態
- Error: エラー状態
- Warning: 警告状態
- Notice: 正常であるが、重大な状態
- Info: インフォメーションメッセージ
- Debug: デバッグレベルメッセージ

ロガー設定時やログメッセージの書き出し中に、名前からこれらのレベルを引くことができます。
あるいは、 `Cake\Log\Log::error()` のような便利メソッドを使うと
ログレベルを明確に示すことができます。上記のレベルにないレベルを使っていると例外が発生します。

> [!NOTE]
> ロガー設定の中で `levels` が空の値をセットされたとき、任意のレベルのメッセージを受け取ります。

### ロギングスコープ

しばしば、異なるサブシステムやアプリケーションの一部で異なるロギングの振る舞いを設定したく
なるでしょう。ある E コマースショップの例を挙げます。注文と支払いのロギングをその他の
重大ではないログとは分けておきたい場合です。

CakePHP は、このコンセプトをロギングスコープで実現します。ログメッセージが書かれた時、
スコープ名を指定できます。そのスコープとして設定されたロガーがある場合、ログメッセージは
これらのロガーに向けられます。例:

``` php
// すべてのレベルを受け取るように、 logs/shops.log を設定。
// スコープは `orders` と `payments` のみ
Log::config('shops', [
    'className' => 'File',
    'path' => LOGS,
    'levels' => [],
    'scopes' => ['orders', 'payments'],
    'file' => 'shops.log',
]);

// すべてのレベルを受け取るように、 logs/payments.log を設定。
// スコープは `payments` のみ
Log::config('payments', [
    'className' => 'File',
    'path' => LOGS,
    'levels' => [],
    'scopes' => ['payments'],
    'file' => 'payments.log',
]);

Log::warning('これは、 shops.log のみに書かれます', ['scope' => ['orders']]);
Log::warning('これは、 shops.log と payments.log の両方に書かれます', ['scope' => ['payments']]);
```

スコープは単一の文字列もしくは数値インデックス配列として渡すことができます。
コンテキストとしてより多くのデータを渡す機能が、この形式を使用すると制限されることに注意してください。 :

``` php
Log::warning('これは警告です', ['orders']);
Log::warning('これは警告です', 'payments');
```

> [!NOTE]
> ロガー設定の中で `scopes` に空の配列や `null` がセットされたとき、
> 任意のメッセージを受け取ります。それに `false` をセットすると、
> スコープのないメッセージにしかマッチしません。

## Log API

`class` Cake\\Log\\**Log**

`static` Cake\\Log\\Log::**config**($key, $config)

param string \$name  
接続されるロガーの名前で、後でロガーを削除するために使用されます。

param array \$config  
ロガーの設定情報とコンストラクター引数の配列です。

ロガーの設定を取得したり、セットしたりします。詳細は [Log Configuration](#log-configuration) を参照してください。

`static` Cake\\Log\\Log::**configured**()

returns  
設定されたロガーの配列です。

設定された複数のロガーの名前を取得します。

`static` Cake\\Log\\Log::**drop**($name)

param string \$name  
今後メッセージを受信させたくないロガーの名前です。

`static` Cake\\Log\\Log::**write**($level, $message, $scope = [])

全ての設定されたロガーにメッセージを書き込みます。
`$level` は、作成されたログメッセージのレベルを表します。
`$message` は、書き込みたいログのメッセージです。
`$scope` は、スコープ（一つもしくは複数）でログメッセージが作成されます。

`static` Cake\\Log\\Log::**levels**()

引数なしでメソッドを呼び出します。例えば、 <span class="title-ref">Log::levels()</span> は、現在のレベルの設定を取得します。

### 便利なメソッド

以下の便利メソッドは、適切なログレベルで <span class="title-ref">\$message</span> を記録するために追加されました。

`static` Cake\\Log\\Log::**emergency**($message, $scope = [])

`static` Cake\\Log\\Log::**alert**($message, $scope = [])

`static` Cake\\Log\\Log::**critical**($message, $scope = [])

`static` Cake\\Log\\Log::**error**($message, $scope = [])

`static` Cake\\Log\\Log::**warning**($message, $scope = [])

`static` Cake\\Log\\Log::**notice**($message, $scope = [])

`static` Cake\\Log\\Log::**debug**($message, $scope = [])

`static` Cake\\Log\\Log::**info**($message, $scope = [])

## ロギングトレイト

> トレイトはロギングへのショートカットを提供します。

`method` Cake\\Log\\Log::**log**($msg, $level = LOG_ERR)

## Monolog を使用する

Monolog は、PHP で人気のロガーです。CakePHP のロガーと同じインターフェイスを実装しています。
なので、アプリケーションでデフォルトのロガーとして使うことが簡単です。

Composer を使って Monolog をインストールしたら、
`Log::config()` メソッドを使ってロガーを設定してください。 :

``` php
// config/bootstrap.php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

Log::config('default', function () {
    $log = new Logger('app');
    $log->pushHandler(new StreamHandler('path/to/your/combined.log'));
    return $log;
});

// オプションで、今使っていない不要なデフォルトのロガーを止めてください
Log::drop('debug');
Log::drop('error');
```

もし異なるロガーをコンソールで設定したいのであれば、同じ方法を使ってください。 :

``` php
// config/bootstrap_cli.php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

Log::config('default', function () {
    $log = new Logger('cli');
    $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));
    return $log;
});

// オプションで、今使っていない不要なデフォルトの CLI ロガーを止めてください
Configure::delete('Log.debug');
Configure::delete('Log.error');
```

> [!NOTE]
> コンソールで固有なロガーを使用する場合は、アプリケーションロガーを条件付きで設定してください。
> これは複数のログが重複することを防ぎます。
