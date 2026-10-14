# セッション

CakePHP は PHP 標準の `session` 機能上に、ユーティリティ機能一式と
ラッパーを提供します。セッションはリクエストにまたがるユニークユーザーの識別と
各ユーザーごとの永続的データの格納を可能にします。

## セッションの設定

セッションの設定は `Configure` に格納されます。トップレベルの
`Session` キー下に格納され、いくつかのオプションが用意されています:

- `Session.cookie` - セッションクッキーの名前を変更します。
- `Session.timeout` - CakePHP のセッションハンドラがセッションを破棄するまでの時間を
  *分* 単位で指定します。この値は下記の `Session.autoRegenerate` に影響を与えます。
  これは CakeSession により処理されています。
- `Session.cookieTimeout` - 任意のセッション継続時間を *分* 単位で指定します。
  もしこれが未定義の場合、 `Session.timeout` の値が使用されます。これは、
  セッションクッキーに影響を与え、PHP 自体により処理されています。
- `Session.checkAgent` - リクエストごとにユーザーエージェントをチェックするかどうか。
  ユーザーエージェントがセッションとマッチしない場合、そのセッションは破棄されます。
- `Session.autoRegenerate` - この設定を有効にするとセッションとセッション ID の
  自動更新が有効になります。この値はリクエストの継続的な追跡にセッションの
  `Config.countdown` の値を使用します。カウントダウンが 0 になると、セッション ID が
  再生成されます。これはセキュリティ上の理由でセッション ID を頻繁に変更する場合に有用な
  オプションです。セッションの再生成が必要なリクエスト数のコントロールは、
  `CakeSession::$requestCountdown` の変更によって可能です。
- `Session.defaults` - セッションの設定の基礎としてビルトインのデフォルト設定を使用出来ます。
- `Session.handler` - カスタムセッションハンドラーの定義が可能です。コアデータベースと
  キャッシュセッションハンドラーが使います。このオプションは以前のバージョンの
  `Session.save` を置き換えます。詳しくはセッションハンドラーの追加情報をご覧下さい。
- `Session.ini` - 追加のセッション ini 設定を config に加えることが出来ます。
  これは `Session.handler` と合わせて以前のバージョンのカスタムセッションハンドリング機能を
  置き換えます。
- `Session.cacheLimiter` - セッションクッキーで使用するキャッシュ制御ヘッダーを定義できます。
  デフォルトは、 `must-revalidate` です。このオプションは 2.8.0 で追加されました。

CakePHP のデフォルトは、アプリケーションが SSL プロトコル上にある時、
`session.cookie_secure` が有効 (true) です。SSL と SSL 以外のプロトコルで
アプリケーションを動かす場合、セッション消失の問題が発生するかも知れません。
SSL と SSL 以外のドメイン両方でセッションにアクセスする必要がある場合、
これを無効にします:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_secure' => false,
    ],
]);
```

セッションクッキーのパスのデフォルトはアプリケーションのベースパスです (ドキュメントルートで
動かしている場合は `/`)。これを変更する場合は
`session.cookie_path` ini フラグにアプリケーションのディレクトリパス
を指定することが出来ます:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_path' => '/app/dir',
    ],
]);
```

もし、php のデフォルトのセッション設定を使用している場合、session.gc_maxlifetime で
タイムアウトの設定を上書きすることができます。デフォルトは、24 分です。
より長いセッションに合わせるために ini 設定を変更してください:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'timeout' => 2160, // 36 hours
    'ini' => [
        'session.gc_maxlifetime' => 129600, // 36 hours
    ],
]);
```

## ビルトインセッションハンドラーと設定

CakePHP にはいくつかビルトインなセッションの設定があります。
これらをセッションの設定の基本として使用するか、完全にカスタマイズした
ソリューションを作成するかは自由です。デフォルトを使用する場合、単純に
'defaults' キーに使用したいデフォルト名をセットします。セッション
config で宣言をすればサブセッティングだけを上書きすることも出来ます:

``` php
Configure::write('Session', [
    'defaults' => 'php',
]);
```

上記はビルトインの 'php' 設定を使用します。下記のように全てまたは部分的に
設定を上書きすることも出来ます:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'cookie' => 'my_app',
    'timeout' => 4320, //3 days
]);
```

上記は 'php' 設定のタイムアウトとクッキー名を上書きします。ビルトイン設定は:

- `php` - php.ini ファイルの標準設定に沿ってセッションを保存します。
- `cake` - セッションをファイルとして `tmp/sessions` (レガシー構成では `app/tmp/sessions`)
  に保存します。PHP 全体のセッションディレクトリではなく、アプリケーションの中に
  セッションファイルを置きたい場合に便利です。
- `database` ビルトインデータベースのセッションを使用します。詳しくは下記をご覧下さい。
- `cache` - ビルトインキャッシュのセッションを使用します。詳しくは下記をご覧下さい。

### セッションハンドラー

セッションハンドラーはセッション config 配列でも定義出来ます。定義するとセッション保存に
使用したいクラスやオブジェクトに様々な `session_save_handler` の値をマップ可能です。
'handler' の使用には二つの方法があります。一つ目は 6 つの呼び出し可能な (callable) 配列を
一つ用意する方法です。これは都度 `session_set_save_handler` に適用されます:

``` php
Configure::write('Session', [
    'checkAgent' => false,
    'cookie' => 'my_cookie',
    'timeout' => 600,
    'handler' => [
        ['Foo', 'open'],
        ['Foo', 'close'],
        ['Foo', 'read'],
        ['Foo', 'write'],
        ['Foo', 'destroy'],
        ['Foo', 'gc'],
    ],
    'ini' => [
        'session.cookie_secure' => 1,
        'session.use_trans_sid' => 0,
    ],
]);
```

この形式は `session_set_save_handler()` にそのまま渡されます。この関数に callable を
個別に渡す形式は PHP 8.4 で非推奨になったので、新しく書くコードでは二つ目の方法を使ってください。

二つ目の方法は 'engine' キーを定義することです。このキーは
`CakeSessionHandlerInterface` を実装するクラス名にするべきです。
このインターフェースを実装すると CakeSession がハンドラーのメソッドを自動で
マップすることを可能にします。コアのキャッシュとデータベースのセッション
ハンドラー両方はこの方法でセッション保存を行います。ハンドラーの
追加設定はハンドラーの配列内に置いてください。そうすることで
ハンドラーの内部からこれらの値を読み込めるようになります。

またプラグイン内部からセッションハンドラーを使用することも出来ます。
エンジンを `MyPlugin.PluginSessionHandler` といった形で設定します。
これはアプリケーションの MyPlugin 内部から `PluginSessionHandler` クラスを
読み込み使用します。

### CakeSessionHandlerInterface

このインターフェースは CakePHP 内部の全カスタムセッションハンドラーで使用されます。
単純にクラス内にインターフェースを実装し `Session.handler.engine` を作成した
クラス名にセットします。クラスは `src/Model/Datasource/Session/$classname.php`
(レガシー構成では `app/Model/Datasource/Session/`) に置きます。例えば
`AppSessionHandler` というクラス名なら、
`src/Model/Datasource/Session/AppSessionHandler.php` となります。Composer の classmap で
オートロードしている場合は classmap からクラスが見つかり、そうでない場合は CakePHP が
このディレクトリから読み込みます。

CakePHP はハンドラーを `SessionHandlerAdapter` を介して PHP に登録します。このアダプターは
`session.use_strict_mode` にも対応しており、受け取ったセッション ID は、ハンドラーの `read()`
がその ID に対して空でない文字列を返したときだけ受け入れられます。未知の ID に対して `read()`
は `''` を返し、一度も書き込まれていないセッションの `destroy()` は `true` を返すようにしてください。
コアの `CacheSession` と `DatabaseSession` もそのように実装されています。

::: pieceofcake2
セッションハンドラーが、PHP 8.6 でデフォルトで有効になる
`session.use_strict_mode` に対応しました。未知のセッション ID は拒否されて新しい ID が発行されるので、
未知の ID に対して `read()` が空でない値を返したり、`destroy()` が失敗したりする独自ハンドラーは
修正が必要です。
:::

### データーベースセッション

セッションの設定方法の変更はデータベースセッションの定義の仕方も
変更しました。ここではデータベースのデフォルトを選ぶように、ほとんどは
設定の中の `Session.handler.model` をセットするだけです:

``` php
Configure::write('Session', [
    'defaults' => 'database',
    'handler' => [
        'model' => 'CustomSession',
    ],
]);
```

上記は CakeSession にビルトインの 'database' 設定を使用するように伝え、
`CustomSession` というモデルにデータベースへのセッション情報の保存を任せます。

完全に独自のセッションハンドラーは必要ないけれど、データベースのセッションストレージが
必要な場合、以下のコードのように単純化できます。

``` php
Configure::write('Session', [
    'defaults' => 'database',
]);
```

この設定では、少なくとも以下の項目を持つデータベーステーブルが必要です。

``` sql
CREATE TABLE `cake_sessions` (
  `id` varchar(255) NOT NULL DEFAULT '',
  `data` text,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

アプリケーションのスケルトンに含まれているスキーマファイル `config/Schema/sessions.php`
を元に schema シェルを実行して、このテーブルを作成することもできます。

``` bash
$ bin/cake schema create sessions
```

### キャッシュセッション

キャッシュクラスはセッションの格納にも使用できます。これにより、APCu、Memcached、
Redis のようなキャッシュにセッションを格納できます。キャッシュセッションの使用には
注意点があります。キャッシュの容量を使い切ると、レコードが追い出されてセッションが
失われ始めます。

セッションを元としたキャッシュを使うためセッション config を以下のように設定します:

``` php
Configure::write('Session', [
    'defaults' => 'cache',
    'handler' => [
        'config' => 'session',
    ],
]);
```

これは CakeSession に `CacheSession` クラスをセッション保存先として
委任する設定です。'config' キーをキャッシュの設定に使用できます。
デフォルトのキャッシュ設定は `'default'` です。

## ini ディレクティブの設定

デフォルト設定はセッション用に共通の土台を提供します。必要に応じて
特定の ini フラグを微調整することもあります。 CakePHP ではデフォルト
設定にしろ、カスタム設定にしろ、両者の ini 設定をカスタマイズ
出来ます。セッション設定の `ini` キーで、個別の設定値を指定
することが可能です。例えば `session.gc_divisor` のような設定を
コントロールするのに使えます:

``` php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.gc_divisor' => 1000,
        'session.cookie_httponly' => true,
    ],
]);
```

## カスタムセッションハンドラーの作成

カスタムセッションハンドラーの作成は CakePHP で容易に出来ます。
この例では、セッションをキャッシュ (APCu) とデータベースの両方に
格納するセッションハンドラーを作成します。APCu の高速な IO を活かしつつ、
キャッシュがいっぱいになってセッションが消えることを心配せずに済みます。

まずカスタムクラスを作成し `src/Model/Datasource/Session/ComboSession.php`
として保存する必要があります。クラスは以下のようになります。

``` php
// src/Model/Datasource/Session/ComboSession.php
class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface
{
    public $cacheKey;

    public function __construct()
    {
        $this->cacheKey = Configure::read('Session.handler.cache');
        parent::__construct();
    }

    /**
     * セッションからデータ読み込み
     */
    public function read($id)
    {
        $result = Cache::read($id, $this->cacheKey);
        if ($result) {
            return $result;
        }

        return parent::read($id);
    }

    /**
     * セッションへデータ書き込み
     */
    public function write($id, $data)
    {
        Cache::write($id, $data, $this->cacheKey);

        return parent::write($id, $data);
    }

    /**
     * セッションの破棄
     */
    public function destroy($id)
    {
        Cache::delete($id, $this->cacheKey);

        return parent::destroy($id);
    }

    /**
     * 期限切れセッションの削除
     */
    public function gc($expires = null)
    {
        Cache::gc($this->cacheKey);

        return parent::gc($expires);
    }
}
```

このクラスはビルトインの `DatabaseSession` を継承しそのロジックや振る舞いを
重複して定義することを避けています。それぞれのオペレーションを `Cache`
オペレーションでラップします。これで高速なキャッシュからセッションを取得しつつ、
キャッシュ限度の考慮を不要にしています。このセッションハンドラーを使うのもまた簡単です。
`config/core.php` のセッションブロックを以下のように設定します。

``` php
Configure::write('Session', [
    'defaults' => 'database',
    'handler' => [
        'engine' => 'ComboSession',
        'model' => 'Session',
        'cache' => 'apc',
    ],
]);

// apc キャッシュ設定を追加すること (APCu を使います)
Cache::config('apc', ['engine' => 'Apc']);
```

これでアプリケーションはカスタムセッションハンドラーを使ったセッションデータの読み書きを行います。

`class` **CakeSession**

## セッションデータの読み込みと書き込み

アプリケーション内のコンテキストにより、セッションへのアクセスを提供するクラスが異なります。
コントローラーでは `SessionComponent` を使用します。
ビューでは `SessionHelper` を使用します。どこからでも使用可能な
`CakeSession` でセッションにアクセスすることも出来ます。他のインターフェースと同じく、
`CakeSession` はシンプルな CRUD インターフェースを提供します。

`static` CakeSession::**read**($key)

`Set::classicExtract()` 互換記法を用いてセッションから値を読み込みます:

``` php
CakeSession::read('Config.language');
```

`static` CakeSession::**write**($key, $value)

`$key` はドット区切りで `$value` の書き込み先を指定します:

``` php
CakeSession::write('Config.language', 'eng');
```

`static` CakeSession::**delete**($key)

セッションからデータ削除が必要なら削除も可能です:

``` php
CakeSession::delete('Config.language');
```

コントローラーとビューからのセッションデータへのアクセス方法については、
[セッション](../core-libraries/components/sessions) と
[SessionHelper](../core-libraries/helpers/session) を合わせてご覧下さい。
