# キャッシュ

`class` Cake\\Cache\\**Cache**

速くより近くのストレージシステムに必要なデータの二次コピーを持つことにより、
高価なリソースや低速なリソースの読み込みを行うためにキャッシュを使用できます。
たとえば、高価なクエリの結果や頻繁に変更されないリモートウェブサービスへのアクセスを
キャッシュに格納することができます。キャッシュに保存されると、キャッシュからの読み込みは、
リモートリソースにアクセスよりもはるかに高速です。

CakePHP のキャッシュは、 `Cache` クラスを使用します。このクラスは、
様々なキャッシュの実装を扱うための静的なインターフェイスや統一された API を提供します。
CakePHP には、いくつかのキャッシュエンジンが用意されていて、
独自のバックエンドを構築する必要な場合、シンプルなインターフェイスを提供します。
以下が、組み込みのキャッシュエンジンです。

- `File` File キャッシュはローカルファイルを使用するシンプルなキャッシュです。
  最も遅いキャッシュエンジンで、アトミックな操作のための多くの機能を持ちません。
  しかし、ディスクストレージは非常に安価なので、頻繁に書き込みが行なわれない
  大きなオブジェクトや要素の保存はファイルに適しています。
- `Memcached` [Memcached](https://php.net/memcached) 拡張を使います。
- `Redis` [phpredis](https://github.com/phpredis/phpredis) 拡張を使います。
  Redis は高速で、Memcached と同様の永続キャッシュシステム、アトミックな操作を提供します。
- `Apcu` APCu キャッシュは、PHP の [APCu](https://php.net/apcu) 拡張を使用します。
  この拡張はオブジェクトを保存するためにウェブサーバー上の共有メモリーを使います。
  これはとても高速で、かつアトミックな読み込み/書き込みの機能を提供することが可能になります。
- `Wincache` Wincache は [Wincache](https://php.net/wincache) 拡張を使います。
  Wincache は APC と同様の機能とパフォーマンスを持ちますが、Windows と IIS に最適化されています。
- `Array` はすべてのデータを配列に保存します。
  永続的なストレージを提供せず、test suites内での使用を想定しています。
- `Null` nullエンジンは実質何も保存せず、すべての読み込み操作を失敗させます。

あなたが選択したキャッシュエンジンに関わらず、
アプリケーションは `Cake\Cache\Cache` とやり取りします。

## Cache エンジンの設定

`static` Cake\\Cache\\Cache::**setConfig**($key, $config = null)

アプリケーションは、ブート処理中に任意の数の「エンジン」を設定できます。
キャッシュエンジンの設定は、 **config/app.php** で定義されています。

最適なパフォーマンスを得るには、CakePHP では2つのキャッシュエンジンを定義する必要があります。

- `_cake_core_` は、ファイル構成の保存と、
  [国際化と地域化](../core-libraries/internationalization-and-localization)
  ファイルの結果のパースに使用されます。
- `_cake_model_` は、アプリケーション上のモデルに対するスキーマの説明を保存するために使用されます。

複数のエンジン設定を使用することで、必要に応じてストレージを段階的に変更できます。
例えば、以下のように **config/app.php** に設定できます。 :

``` php
// ...
'Cache' => [
    'short' => [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ],
    // 完全な名前空間つきの名前を使用。
    'long' => [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]
]
// ...
```

オプション設定は `DSN` を指定することもできます。
これは環境変数や `PaaS` プロバイダーと一緒に動作するときに便利です。 :

``` php
Cache::setConfig('short', [
    'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
]);
```

DSN を使用するとき、追加のクエリー文字列要素としてパラメーターやオプションが定義できます。

実行時におけるキャッシュエンジンの設定もできます。 :

``` php
// 短い名前で
Cache::setConfig('short', [
    'className' => 'File',
    'duration' => '+1 hours',
    'path' => CACHE,
    'prefix' => 'cake_short_'
]);

// 完全な名前空間つきの名前を使用。
Cache::setConfig('long', [
    'className' => 'Cake\Cache\Engine\FileEngine',
    'duration' => '+1 week',
    'probability' => 100,
    'path' => CACHE . 'long' . DS,
]);

// オブジェクトで
$object = new FileEngine($config);
Cache::setConfig('other', $object);
```

これらのエンジン設定の名前 ('short' や 'long') は `Cake\Cache\Cache::write()` と
`Cake\Cache\Cache::read()` の `$config` パラメーターとして使われます。
キャッシュエンジンを設定する場合は、次の構文を使用してクラス名を参照することができます。 :

``` php
// 省略名 (App\ または Cake 名前空間の中)
Cache::setConfig('long', ['className' => 'File']);

// プラグインの省略名
Cache::setConfig('long', ['className' => 'MyPlugin.SuperCache']);

// 完全な名前空間
Cache::setConfig('long', ['className' => 'Cake\Cache\Engine\FileEngine']);

// CacheEngineInterface を実装したオブジェクト
Cache::setConfig('long', ['className' => $myCache]);
```

> [!NOTE]
> FileEngine 使用時に、正しいパーミッションでのキャッシュファイルを指定して作成するには、
> `mask` オプションの設定が必要です。

### エンジンのオプション

各エンジンは次のオプションを受け入れます。

- `duration` このキャッシュ設定内のアイテムの存続期間を指定します。
  `strototime()` 互換表現として指定されます。
- `groups` この設定に格納されているすべてのキーに関連付けられているグループまたは「タグ」のリスト。
  キャッシュから完全なグループを削除するのに便利です。
- `prefix` すべてのエントリーの先頭に追加されます。
  キースペースを別のキャッシュ設定または別のアプリケーションと共有する必要がある場合に適しています。
- `probability` キャッシュ GC クリーンアップの可能性。
  0 に設定すると、 `Cache::gc()` が自動的に呼び出されなくなります。

### FileEngine オプション

FileEngine は次のエンジン固有オプションを使用します。

- `isWindows` ホストがウインドウズであるかどうかで自動的に設定されます。
- `lock` ファイルを書き込む前にロックする必要があるかどうか。
- `mask` 作成されたファイルに使用されるマスク。
- `path` キャッシュファイルを保存する場所へのパス。 デフォルトはシステムの一時ディレクトリです。

### RedisEngine オプション

RedisEngine は次のエンジン固有オプションを使用します。

- `port` Redis サーバーが動作しているポート。
- `host` Redis サーバーが動作しているホスト。
- `database` 接続に使用するデータベース番号。
- `password` Redis サーバーのパスワード。
- `persistent` Redis への永続的な接続を行うかどうか。
- `timeout` Redis の接続タイムアウト。
- `unix_socket` Redis の UNIX ソケットへのパス。

### MemcacheEngine オプション

- `compress` データを圧縮するかどうか。
- `username` Memcache サーバーにアクセスするためのログイン名。
- `password` Memcache サーバーにアクセスするためのパスワード。
- `persistent` 永続的な接続の名前。同じ永続的な値を使用するすべての設定は、
  単一の基本接続を共有します。
- `serialize` データをシリアライズするために使用されるシリアライザエンジン。
  利用可能なエンジンは php、igbinary、json です。
  php のほかに、memcached 拡張は適切なシリアライザのサポートでコンパイルする必要があります。
- `servers` memcached サーバーの文字列または配列。配列の場合、MemcacheEngine
  はそれらをプールとして使用します。
- `options` memcached クライアントの追加のオプション。オプション =\> 値 の配列でなければなりません。
  `\Memcached::OPT_*` 定数をキーとして使用してください。

### キャッシュフォールバックの設定

書き込み不可能なフォルダーに書き込む `FileEngine` や、 `RedisEngine` が Redis に
接続できないなど、エンジンが利用できない場合、エンジンは `NullEngine` にフォールバックし、
ログ可能なエラーを引き起こします。これにより、キャッシュ障害のためにアプリケーションが
キャッチされない例外をスローするのを防ぎます。

`fallback` 設定キーを使ってキャッシュ設定を指定された設定にフォールバックするよう設定できます。 :

``` php
Cache::setConfig('redis', [
    'className' => 'Redis',
    'duration' => '+1 hours',
    'prefix' => 'cake_redis_',
    'host' => '127.0.0.1',
    'port' => 6379,
    'fallback' => 'default',
]);
```

Redis サーバーが予期せず失敗した場合、 `redis` キャッシュ設定への書き込みは、
`default` キャッシュ設定への書き込みにフォールバックします。このシナリオで `default` キャッシュ設定への
書き込みも失敗した場合、 `NullEngine` へ再び縮退運転し、キャッチされない例外をスローするのを防ぎます。

`false` でキャッシュフォールバックを無効にすることができます。 :

``` php
Cache::setConfig('redis', [
    'className' => 'Redis',
    'duration' => '+1 hours',
    'prefix' => 'cake_redis_',
    'host' => '127.0.0.1',
    'port' => 6379,
    'fallback' => false
]);
```

フォールバックがない場合、キャッシュ障害は例外として発生します。

### 設定されたキャッシュエンジンを削除する

`static` Cake\\Cache\\Cache::**drop**($key)

一度設定が作成されたら、変更することはできません。代わりに、
`Cake\Cache\Cache::drop()` と `Cake\Cache\Cache::config()`
を使用して、設定を削除して再作成する必要があります。キャッシュエンジンを削除すると、設定が削除され、
アダプターが構築されていれば破棄されます。

## キャッシュへの書き込み

`static` Cake\\Cache\\Cache::**write**($key, $value, $config = 'default')

`Cache::write()` はキャッシュに \$value を書き込みます。
この値は後で `$key` で参照したり、削除したりすることができます。
オプションの設定を指定して、キャッシュを保存することもできます。
`$config` を指定しない場合、デフォルトが使用されます。
`Cache::write()` はあらゆるタイプのオブジェクトを格納することができ、
以下のようにモデルの結果を格納するのに理想的です。 :

``` php
$posts = Cache::read('posts');
if ($posts === null) {
    $posts = $someService->getAllPosts();
    Cache::write('posts', $posts);
}
```

`Cache::write()` と `Cache::read()` を使用して、データベースへのアクセスを減らし、
posts を取得しています。

> [!NOTE]
> CakePHP ORM で作成したクエリーの結果をキャッシュする場合は、 [Caching Query Results](../orm/query-builder#caching-query-results)
> セクションで説明しているように、Query オブジェクトのビルトインキャッシュ機能を使用する方が良いです。

### 一度に複数のキーを書き込む

`static` Cake\\Cache\\Cache::**writeMany**($data, $config = 'default')

一度に複数のキャッシュキーを書き込む必要が出るかもしれません。
`write()` を複数回呼び出すこともできますが、 `writeMany()` は
CakePHP がより効率的なストレージ API を使用できるようにします。
例えば Memcached を使用する場合、 `writeMany()` を使用して、
複数回のネットワーク接続を節約できます。 :

``` php
$result = Cache::writeMany([
    'article-' . $slug => $article,
    'article-' . $slug . '-comments' => $comments
]);

// $result は以下を含みます
['article-first-post' => true, 'article-first-post-comments' => true]
```

### アトミックな書き込み

`static` Cake\\Cache\\Cache::**add**($key, $value $config = 'default')

`Cache::add()` を使用すると、キーがキャッシュに存在しない場合に、
アトミックにキーを値に設定することができます。
もし、キーがすでにキャッシュに存在する場合や、書き込みに失敗した場合は、
`add()` は `false` を返します:

``` php
// キーをロックとして機能するように設定する
$result = Cache::add($lockKey, true);
if (!$result) {
    return;
}
// 一度に1つのプロセスしかアクティブにできないアクションを行う。

// ロックキーを外す。
Cache::delete($lockKey);
```

> [!WARNING]
> ファイルベースのキャッシュは、アトミックライトをサポートしていません。

### Read-through キャッシュ

`static` Cake\\Cache\\Cache::**remember**($key, $callable, $config = 'default')

Cache を使用すると、Read-through キャッシュを簡単に行うことができます。
指定されたキャッシュキーが存在する場合、それが返されます。
キーが存在しない場合、呼び出し可能オブジェクトが呼び出され、結果がキャッシュに格納されます。

たとえば、リモートサービスコールの結果をキャッシュすることがよくあります。
あなたはこれをシンプルにするために `remember()` を使うことができます。 :

``` php
class IssueService
{
    public function allIssues($repo)
    {
        return Cache::remember($repo . '-issues', function () use ($repo) {
            return $this->fetchAll($repo);
        });
    }
}
```

## キャッシュからの読み込み

`static` Cake\\Cache\\Cache::**read**($key, $config = 'default')

`Cache::read()` は、 `$key` 配下に格納されたキャッシュされた値を
`$config` から読み込むために使用されます。 `$config` が null の場合、
デフォルトの設定が使用されます。 `Cache::read()` は、有効なキャッシュであれば
キャッシュされた値を返し、キャッシュが期限切れになっているか存在しない場合は `null` を返します。
キャッシュの内容は false と評価される可能性があるので、必ず厳密な比較演算子
`===` または `!==` を使用してください。

例:

``` php
$cloud = Cache::read('cloud');
if ($cloud !== null) {
    return $cloud;
}

// クラウドデータを生成する
// ...

// キャッシュにデータを保存する
Cache::write('cloud', $cloud);

return $cloud;
```

`short` という別のキャッシュ設定を使っている場合、
下記のように `Cache::read()` と `Cache::write()` に明記してください。 :

``` php
// デフォルトの代わりにshort からキー"cloud" を読み込む
$cloud = Cache::read('cloud', 'short');
if ($cloud === null) {
    // cloudデータ生成
    // ...

    // デフォルトの代わりにshort でデータをキャッシュ保存
    Cache::write('cloud', $cloud, 'short');
}

return $cloud;
```

### 一度に複数のキーを読み込む

`static` Cake\\Cache\\Cache::**readMany**($keys, $config = 'default')

一度に複数のキーを書き込んだ後、あなたは恐らくそれらを同様に読み込みたいでしょう。
`read()` を複数回呼び出すこともできますが、 `readMany()` は CakePHP が
より効率的なストレージ API を使用できるようにします。例えば Memcached を使用している場合、
`readMany()` を使用して、複数回のネットワーク接続を節約できます。 :

``` php
$result = Cache::readMany([
    'article-' . $slug,
    'article-' . $slug . '-comments'
]);
// $result は以下を含みます
['article-first-post' => '...', 'article-first-post-comments' => '...']
```

## キャッシュからの削除

`static` Cake\\Cache\\Cache::**delete**($key, $config = 'default')

`Cache::delete()` を使うと、キャッシュされたオブジェクトをストアから完全に削除できます。 :

``` php
// キーの削除
Cache::delete('my_key');
```

4.4.0 以降、 `RedisEngine` は `deleteAsync()` メソッドも提供し、
`UNLINK` オペレーションを使用してキャッシュキーを削除します:

``` php
Cache::pool('redis')->deleteAsync('my_key');
```

### 一度に複数のキーの削除

`static` Cake\\Cache\\Cache::**deleteMany**($keys, $config = 'default')

一度に複数のキーを書き込んだら、それらを削除したいかもしれません。
`delete()` を複数回呼び出すこともできますが、 `deleteMany()` は CakePHP が
より効率的なストレージ API を使用できるようにします。例えば Memcached を使用している場合、
`deleteMany()` を使用して、複数回のネットワーク接続を節約できます。 :

``` php
$result = Cache::deleteMany([
    'article-' . $slug,
    'article-' . $slug . '-comments'
]);
// $result は以下を含みます
['article-first-post' => true, 'article-first-post-comments' => true]
```

## キャッシュデータのクリア

`static` Cake\\Cache\\Cache::**clear**($config = 'default')

キャッシュ設定から、すべてのキャッシュされた値を破棄します。Apcu、Memcached、Wincache
などのエンジンでは、キャッシュ設定のプレフィックスを使用してキャッシュエントリーを削除します。
異なるキャッシュ設定には異なる接頭辞が付いていることを確認してください。 :

``` php
// すべてのキーをクリアする。
Cache::clear();
```

4.4.0 以降では、 `RedisEngine` は `clearBlocking()` メソッドも提供し、
`UNLINK` オペレーションを使ってキャッシュキーを削除します:

``` php
Cache::pool('redis')->clearBlocking();
```

> [!NOTE]
> APCu と Wincache は、ウェブサーバーと CLI 用に分離されたキャッシュを使用するため、
> 別々にクリアする必要があります。（CLI ではウェブサーバーのキャッシュをクリアできません）

## キャッシュを使用してカウンターを保存する

`static` Cake\\Cache\\Cache::**increment**($key, $offset = 1, $config = 'default')

`static` Cake\\Cache\\Cache::**decrement**($key, $offset = 1, $config = 'default')

アプリケーション内のカウンターは、キャッシュに保存するのに適しています。
例として、コンテストの残りの「枠」の単純なカウントダウンをキャッシュに格納することができます。
Cache クラスは簡単な方法でカウンター値をインクリメント/デクリメントするアトミックな方法を公開しています。
競合のリスクを軽減し、同時に2人のユーザーが値を1つ下げて誤った値にする可能性があるため、
これらの値にはアトミック操作が重要です。

整数値を設定した後、 `increment()` および `decrement()` を使用して整数値を操作できます。 :

``` php
Cache::write('initial_count', 10);

// 設定した後に
Cache::decrement('initial_count');

// または
Cache::increment('initial_count');
```

> [!NOTE]
> インクリメントとデクリメントは FileEngine では機能しません。
> 代わりに、APCu、Wincache、Redis または Memcached を使用する必要があります。

## キャッシュを使用して共通のクエリー結果を格納する

まれにしか変更されない、またはキャッシュに大量の読み込みが行われるような結果をキャッシュすることによって、
アプリケーションのパフォーマンスを大幅に向上させることができます。
この完璧な例は、 `Cake\ORM\Table::find()` の結果です。
この Query オブジェクトを使用すると、 `cache()` メソッドを使用して結果をキャッシュできます。
詳細は、 [Caching Query Results](../orm/query-builder#caching-query-results) セクションを参照してください。

## グループの使用

たまに、複数のキャッシュエントリーを特定のグループまたは名前空間に属するようにマークしたい場合があります。
同じグループ内のすべてのエントリーで共有される情報が変更されるたびに、キーを大量に無効化したいというのは
一般的な要件です。これは、キャッシュ設定でグループを宣言することで可能です。 :

``` php
Cache::setConfig('site_home', [
    'className' => 'Redis',
    'duration' => '+999 days',
    'groups' => ['comment', 'article']
]);
```

`method` Cake\\Cache\\Cache::**clearGroup**($group, $config = 'default')

ホームページに生成された HTML をキャッシュに保存したいが、
コメントや投稿がデータベースに追加されるたびにこのキャッシュを自動的に無効にしたいとします。
`comment` と `article` グループを追加することで、このキャッシュ設定に保存されているキーに、
両方のグループ名で効果的にタグを付けできます。

たとえば、新しい投稿が追加されるたびに、 `article` グループに関連付けられたすべてのエントリーを
削除するように Cache エンジンに指示できます。 :

``` php
// src/Model/Table/ArticlesTable.php
public function afterSave($event, $entity, $options = [])
{
    if ($entity->isNew()) {
        Cache::clearGroup('article', 'site_home');
    }
}
```

`static` Cake\\Cache\\Cache::**groupConfigs**($group = null)

`groupConfigs()` を使用すると、グループと設定の間のマッピングを取得できます。
つまり、同じグループを持ちます。 :

``` php
// src/Model/Table/ArticlesTable.php

/**
 * すべてのキャッシュ設定をクリアする前述の例のバリエーション
 * 同じグループを持つ
 */
public function afterSave($event, $entity, $options = [])
{
    if ($entity->isNew()) {
        $configs = Cache::groupConfigs('article');
        foreach ($configs['article'] as $config) {
            Cache::clearGroup('article', $config);
        }
    }
}
```

グループは、同じエンジンと同じ接頭辞を使用して、すべてのキャッシュ設定で共有されます。
グループを使用していて、グループの削除を使用する場合は、すべての設定の共通プレフィックスを選択します。

## 全体的にキャッシュを有効または無効にする

`static` Cake\\Cache\\Cache::**disable**()

キャッシュの有効期限に関連する問題を把握しようとするときに、
キャッシュの読み込みと書き込みをすべて無効にする必要があります。
`enable()` と `disable()` を使ってこれを行うことができます。 :

``` php
// すべてのキャッシュ読み取りとキャッシュ書き込みを無効にする。
Cache::disable();
```

無効にすると、すべての読み込みと書き込みは `null` を返却します。

`static` Cake\\Cache\\Cache::**enable**()

無効にすると、 `enable()` を使用してキャッシュを再び有効にすることができます。 :

``` php
// すべてのキャッシュの読み込みと書き込みを再び有効にする。
Cache::enable();
```

`static` Cake\\Cache\\Cache::**enabled**()

もしキャッシュの状態を確認する必要がある場合は、 `enabled()` を使用してください。

## キャッシュエンジンの作成

独自の `Cache` エンジンは `App\Cache\Engine` やプラグインの `$plugin\Cache\Engine`
の中に提供することができます。キャッシュエンジンはキャッシュディレクトリー内になければなりません。
`MyCustomCacheEngine` という名前のキャッシュエンジンがあれば、
**src/Cache/Engine/MyCustomCacheEngine.php** に置かれます。また、プラグインの一部として、
**plugins/MyPlugin/src/Cache/Engine/MyCustomCacheEngine.php** に置かれます。
プラグインのキャッシュ設定は、プラグインのドット構文を使用する必要があります。 :

``` php
Cache::setConfig('custom', [
    'className' => 'MyPlugin.MyCustomCache',
    // ...
]);
```

カスタムキャッシュエンジンは、いくつかの抽象メソッドを定義するだけでなく、
いくつかの初期化メソッドを提供する `Cake\Cache\CacheEngine` を拡張する必要があります。

キャッシュエンジンに必要な API は次のとおりです。

`class` Cake\\Cache\\**CacheEngine**

`method` Cake\\Cache\\CacheEngine::**write**($key, $value)

`method` Cake\\Cache\\CacheEngine::**read**($key)

`method` Cake\\Cache\\CacheEngine::**delete**($key)

`method` Cake\\Cache\\CacheEngine::**clear**($check)

`method` Cake\\Cache\\CacheEngine::**clearGroup**($group)

`method` Cake\\Cache\\CacheEngine::**decrement**($key, $offset = 1)

`method` Cake\\Cache\\CacheEngine::**increment**($key, $offset = 1)
