# ロギング

CakePHP コアクラスの Configure 設定は、内部で何が起きているかを知るための有益な手段です。
そこで、何が起きているかをディスクにログデータとして保存する必要が出てくるでしょう。
SOAP や AJAX といった技術に依存することが多くなるに従って、デバッグはより困難になります。

ロギングは、時系列でアプリケーションで何が起きているかを知るための手段です。
何の検索ワードが使われましたか？何のエラーがユーザーに表示されましたか？
どのくらいの頻度で特定のクエリが実行されましたか？

CakePHP でデータのロギングは簡単です。 log() 関数が Object クラスで定義されていて、
ほぼすべての CakePHP クラスの共通アクセッサです。モデル、コントローラー、コンポーネントの他、
ほぼ全ての CakePHP のクラスの中で、データをログに記録できます。 `CakeLog::write()`
を直接使うこともできます。 [Writing To Logs](#writing-to-logs) をご覧ください。

## ログストリームの作成と設定

ログストリームハンドラは、アプリケーションの一部やプラグインの一部になります。
例えば、アプリケーション内で `DatabaseLog` と呼ばれるデータベースロガーがある場合、
`app/Lib/Log/Engine/DatabaseLog.php` 内に配置されます。もし、データベースロガーが
プラグインの一部だった場合、 `app/Plugin/LoggingPack/Lib/Log/Engine/DatabaseLog.php`
に配置されます。 `CakeLog` は `CakeLog::config()` を呼ぶことで、ログストリームを
設定するためにロードを試みます。 DatabaseLog を設定するためには、以下のようにします。 :

``` php
// app/Lib 用
CakeLog::config('otherFile', array(
    'engine' => 'Database',
    'model' => 'LogEntry',
    // ...
));

// LoggingPack というプラグイン用
CakeLog::config('otherFile', array(
    'engine' => 'LoggingPack.Database',
    'model' => 'LogEntry',
    // ...
));
```

ログストリームを設定する時、 `engine` パラメータは、ログハンドラを配置、
ロードするために使用され、その他の設定プロパティの全ては、ログストリームの
コンストラクタに配列として渡されます。 :

``` php
App::uses('BaseLog', 'Log/Engine');

class DatabaseLog extends BaseLog {
    public function __construct($options = array()) {
        parent::__construct($options);
        // ...
    }

    public function write($type, $message) {
        // データベースへの書き込み
    }
}
```

CakePHP は、ログストリームに対して、 `write` メソッドだけを必要とします。
`BaseLog` クラスを継承することで、いくつか役に立ちます。

- 自動的にスコープと種別の引数の設定を処理します。
- 範囲内のみロギングすることを要求する `config()` メソッドを実装します。

ロガーの write メソッドは、 `$type と $message` の２つのパラメータを持ちます。
`$type` は、ログメッセージ種別の文字列です。 コアの値は `error` 、 `warning` 、
`info` と `debug` です。それに加えて、 `CakeLog::write` を呼ぶ時に使用することで
あなたの種別を定義することができます。

<div id="file-log">

::: info Added in version 2.4
:::

</div>

2.4 で `FileLog` エンジンにいくつかの新しいオプションが追加されました。

- `size` 基本的なログファイルのローテーション実装に使われます。
  指定したサイズにログファイルのサイズが達した場合、現在のファイルが、
  タイムスタンプをつけたファイル名に変更され、新しいログファイルが作成されます。
  整数バイト値か、 '10MB'、'100KB' など人が読みやすい文字列が使えます。
  デフォルトは 10MB です。　size に false をセットすると、 下記の `rotate`
  オプションが無効になります。
- `rotate` ログファイルは、削除される前に指定した回数ローテーションします。
  もし、値が 0 の場合、古いファイルはローテーションする前に削除されます。デフォルトは 10。
- `mask` 新規作成されるファイルのパーミッションをセットします。もし、空のままの場合、
  デフォルトのパーミッションが使用されます。

> [!WARNING]
> 2.4 より前は、設定にサフィックス `Log` が含まれていなければなりませんでした
> (`LoggingPack.DatabaseLog`) 。 これはもう必要ありません。
> もし、 クラス名の後に `Log` をつける規約に従わない `DatabaseLogger` のような
> ログエンジンを使用したい場合、クラス名を `DatabaseLog` に合わせなければなりません。
> `SomeLogLog` のようなサフィックスを２重にしたクラス名は避けてください。

> [!NOTE]
> 必ず `app/Config/boostrap.php` 内でロガーを設定してください。
> core.php 内でアプリケーションやプラグインのロガーを使用しようとすると、
> 問題が起こります。アプリケーションのパスがまだ設定されていないからです。
>
> 2.4 では新たに、デバッグモード中では、FileEngine 使用時に無用なエラーの発生を避けるため、
> ディレクトリが存在しない時には自動的に作成されるようになりました。

## ロギングのエラーと例外

エラーと例外は、 core.php ファイル内に関連する値を設定することで
ログに記録することができます。エラーは debug \> 0 で表示され、 debug == 0 で
ログに記録されます。 捕捉できなかった例外をログに記録する場合、 `Exception.log` を
true にセットしてください。詳しくは、 [構成設定](../development/configuration) をご覧ください。

## ログストリームの相互作用

`CakeLog::configured()` で一連の設定を確認することができます。
`configured()` の戻り値は、全ての現在の設定配列を返します。
`CakeLog::drop()` を使って、設定を削除することができます。
一度、ログの設定が削除されると、ロガーはメッセージを受信しなくなります。

## デフォルトの FileLog クラスの利用

ユーザーが設定したロギングアダプターに書き込むために CakeLog を設定することができて、
それはデフォルトのロギング設定になります。デフォルトのロギング設定は、
ロギングアダプターが *他にない場合* に使用されます。一度ロギングアダプターが設定されて、
ファイルロギングを続けたい場合、FileLog の設定が必要になります。

その名前が示すように、 FileLog は、ログメッセージをファイルに書き込みます。
書かれたログメッセージの種別は、メッセージが書き込まれたファイルの名前で決まります。
もし種別が指定されなければ、エラーログを書き込むための LOG_ERROR が使われます。
デフォルトのログの場所は、 `app/tmp/logs/$type.log` です。 :

``` php
// CakePHP クラスの中でこれを実行
$this->log("何か動かないよ！");

// app/tmp/logs/error.log に追記された結果
// 2007-11-02 10:22:02 Error: 何か動かないよ！
```

第一引数に独自のログ名を指定できます。デフォルトの組み込み FileLog クラスは、
このログ名を書き込みたいログファイルとして扱います。 :

``` php
// 静的に呼び出し
CakeLog::write('activity', '活動記録としての特別なメッセージ');

// (error.log ではなく) app/tmp/logs/activity.log に追記された結果
// 2007-11-02 10:22:02 Activity: 活動記録としての特別なメッセージ
```

設定されたディレクトリは、ウェブサーバユーザー権限で正しくロギングできるように
書き込み可能にしなければなりません。

`CakeLog::config()` を使うと別の FileLog 出力先を設定できます。
FileLog は、独自のパスを使用するために `path` を設定できます。 :

``` php
CakeLog::config('custom_path', array(
    'engine' => 'File',
    'path' => '/path/to/custom/place/'
));
```

## Syslog へのロギング

::: info Added in version 2.4
:::

本番環境では、ファイルロガーの代わりに syslog を使用するようにシステムをセットアップすることを
強く勧めます。これは、(大部分は）ノンブロッキング方式で全て書き込むため、よりよく動作します。
あなたのオペレーティングシステムのロガーは、独立してファイルのローテーションの設定ができ、
前処理を記述したり、ログを完全に別のストレージを使うことができます。

syslog を使うためには、デフォルトの FileLog エンジンを使うのとよく似ています。
ロギングに使用するエンジンとして <span class="title-ref">Syslog</span> を指定する必要があります。下記の設定は、
デフォルトのロガーを syslog に置き換えるものです。これは、 <span class="title-ref">bootstrap.php</span> ファイルで
設定します。 :

``` php
CakeLog::config('default', array(
    'engine' => 'Syslog'
));
```

Syslog ロギングエンジンのための設定配列は、以下のキーを認識します。

- \`format\`: ２つのプレースホルダーを持つ sprintf テンプレート文字列。１つ目は、
  エラー種別で、２つ目はメッセージのためのものです。このキーは、ロギングメッセージ内の
  サーバやプロセスに関する追加の情報を付加するのに便利です。例えば、
  `%s - Web Server 1 - %s` は、プレースホルダーが置き換えられると、
  `error - Web Server 1 - An error occurred in this request` のようになります。
- \`prefix\`: 全てのログメッセージの先頭につく文字列です。
- \`flag\`: ロガーへの接続を開くために使用される整数値のフラグです。デフォルトは、
  <span class="title-ref">LOG_ODELAY</span> が使用されます。 詳しくは、 <span class="title-ref">openlog</span> 文書をご覧ください。
- \`facility\`: syslog で使用するロギングスロット。デフォルトでは、 <span class="title-ref">LOG_USER</span> が
  使用されます。詳しくは、 <span class="title-ref">syslog</span> 文書をご覧ください。

## ログへの書込み

ログファイルへの書き込みは、２つの方法があります。１つは、
静的な `CakeLog::write()` メソッドを使用することです。 :

``` php
CakeLog::write('debug', '何か動作しなかった');
```

２つ目は、 `Object` を継承するクラスに用意された log() ショートカット関数を
使用することです。 log() を呼ぶと、内部的に CakeLog::write() が呼ばれます。 :

``` php
// CakePHP クラス内でこれを実行:
$this->log("何か動作しなかったよ！", 'debug');
```

全ての設定されたログストリームは、 `CakeLog::write()` が呼ばれるたびに
シーケンシャルに書かれます。

::: info Changed in version 2.5
:::

CakeLog は、自身では何も自動設定されません。結果として、ログファイルは、ストリームが
用意されていなければ、自動生成されません。全ての種別やレベルのログを受け取りたい場合、
最低限一つ、 `default` のストリームを用意してください。通常、 `app/tmp/logs/`
に出力するためには、コアの `FileLog` クラスをセットするだけで可能です。 :

``` php
CakeLog::config('default', array(
    'engine' => 'File'
));
```

## ロギングスコープ

::: info Added in version 2.2
:::

しばしば、異なるサブシステムやアプリケーションの一部で異なるロギングの振る舞いを設定したく
なるでしょう。ある E コマースショップの例を挙げます。注文と支払いのロギングをその他の
重大ではないログとは分けておきたい場合です。

CakePHP は、このコンセプトをロギングスコープで実現します。ログメッセージが書かれた時、
スコープ名を指定できます。そのスコープとして設定されたロガーがある場合、ログメッセージは
これらのロガーに向けられます。ログメッセージが未設定のスコープへ書かれた場合、
そのメッセージのレベルを制御するロガーがメッセージを記録します。 例:

``` php
// ２つの設定されたタイプ(ログレベル) を受け取るように、 tmp/logs/shop.log を設定。
// スコープは `orders` と `payments`
CakeLog::config('shop', array(
    'engine' => 'FileLog',
    'types' => array('warning', 'error'),
    'scopes' => array('orders', 'payments'),
    'file' => 'shop.log',
));

// ２つの設定されたタイプ(ログレベル) を受け取るように、 tmp/logs/payments.log を設定。
// スコープは `payments` のみ
CakeLog::config('payments', array(
    'engine' => 'SyslogLog',
    'types' => array('info', 'error', 'warning'),
    'scopes' => array('payments')
));

CakeLog::warning('これは、 shop のストリームにのみ書かれます', 'orders');
CakeLog::warning('これは、 shop と payments の両ストリームに書かれます', 'payments');
CakeLog::warning('これは、 shop と payments の両ストリームに書かれます', 'unknown');
```

スコープを動作させるためには、いくつか **しなければならない** ことがあります。

1.  スコープで使用するロガーが受け取る `types` を定義してください。
2.  スコープで使用するロガーは `config()` メソッドを実装しなければなりません。
    `BaseLog` クラスを継承することで、互換性のあるメソッドの実装が容易になります。

## CakeLog API

`class` **CakeLog**

`static` CakeLog::**config**($name, $config)

param string \$name  
接続されるロガーの名前。後でロガーを削除するために
使用されます。

param array \$config  
ロガーの設定情報とコンストラクタ引数の配列。

CakeLog と新しいロガーに接続します。接続されたロガーの各々は、
ログメッセージが書かれるたびに全てのログメッセージを受け取ります。

`static` CakeLog::**configured**()

returns  
設定されたロガーの配列

設定されたロガーの名前を取得します。

`static` CakeLog::**drop**($name)

param string \$name  
今後メッセージを受信させたくないロガーの名前。

`static` CakeLog::**write**($level, $message, $scope = array())

全ての設定されたロガーにメッセージを書き込みます。
\$level は、作成されたログメッセージのレベルを表します。
\$message は、書き込みたいログのメッセージです。

::: info Changed in version 2.2
`$scope` は追加されました。
:::

::: info Added in version 2.2
ログレベルとスコープ
:::

`static` CakeLog::**levels**()

現在のレベルの設定を取得するために、引数なしでこのメソッドを読びます。
例： `CakeLog::levels()` 。

デフォルトで 'user0' と 'user1' という追加のレベルを追加するために、
ログレベルを使用します。 :

``` php
CakeLog::levels(array('user0', 'user1'));
// または
CakeLog::levels(array('user0', 'user1'), true);
```

`CakeLog::levels()` を呼ぶと結果は:

``` text
array(
    0 => 'emergency',
    1 => 'alert',
    // ...
    8 => 'user0',
    9 => 'user1',
);
```

既存の設定を置き換えるために、第二引数に false をセットしてください。 :

``` php
CakeLog::levels(array('user0', 'user1'), false);
```

`CakeLog::levels()` を呼ぶと結果は:

``` text
array(
    0 => 'user0',
    1 => 'user1',
);
```

`static` CakeLog::**defaultLevels**()

returns  
デフォルトのログレベルの値配列

独自の値にログレベルをリセットします。 :

``` text
array(
    'emergency' => LOG_EMERG,
    'alert'     => LOG_ALERT,
    'critical'  => LOG_CRIT,
    'error'     => LOG_ERR,
    'warning'   => LOG_WARNING,
    'notice'    => LOG_NOTICE,
    'info'      => LOG_INFO,
    'debug'     => LOG_DEBUG,
);
```

`static` CakeLog::**enabled**($streamName)

returns  
boolean

`$streamName` が有効かどうかをチェック。

`static` CakeLog::**enable**($streamName)

returns  
void

`$streamName` ストリームを有効化。

`static` CakeLog::**disable**($streamName)

returns  
void

`$streamName` ストリームを無効化。

`static` CakeLog::**stream**($streamName)

returns  
`BaseLog` のインスタンス、見つからない場合は `false`

`$streamName` に該当するストリームを取得します。

### 便利メソッド

::: info Added in version 2.2
:::

以下の便利メソッドは、 適切なログレベルで `$message` を記録するために追加されました。

`static` CakeLog::**emergency**($message, $scope = array())

`static` CakeLog::**alert**($message, $scope = array())

`static` CakeLog::**critical**($message, $scope = array())

`static` CakeLog::**error**($message, $scope = array())

`static` CakeLog::**warning**($message, $scope = array())

`static` CakeLog::**notice**($message, $scope = array())

`static` CakeLog::**info**($message, $scope = array())

`static` CakeLog::**debug**($message, $scope = array())
