# キャッシュ

キャッシュは、外部のリソースからの作成や読み込みにかかる時間を短縮するためによく使用されます。
また、高価なリソースから、安価に読み込むためにも使用されます。重いクエリーの結果やリモートの
ウェブサービスへのアクセスなど変更の少ないデータは、キャッシュへの保存に適しています。
一度キャッシュに登録されたリソースを再読み込みすると、リモートのリソースへのアクセスより
高速です。

CakePHP のキャッシュは、主に `Cache` クラスを使用します。
このクラスは、共通の API で全ての異なるタイプのキャッシュの実装を扱う静的なメソッドを
持っています。CakePHP は、いくつかの組込のキャッシュエンジンを用意しています。
そして、独自のキャッシュシステムを実装するための簡単な仕組みを用意しています。
以下が、組込のキャッシュエンジンです:

- `FileCache` File キャッシュは、ローカルファイルを使用するシンプルなキャッシュです。
  最も遅いキャッシュエンジンで、アトミックな動作のための多くの機能を持ちません。
  しかしながら、ディスクストレージがとても安価なので、まれに書き込まれるような
  大きなオブジェクトや要素の登録にファイルがよく使われます。
  2.3 以降、デフォルトのキャッシュエンジンになりました。
- `ApcCache` APC キャッシュは、PHP の [APC](https://www.php.net/manual/book.apcu) または
  [APCu](https://www.php.net/apcu) 拡張を使用します。
  これらの拡張は、ウェブサーバー中の共有メモリーにオブジェクトを保存します。
  これはとても高速で、アトミックな読み書き機能を利用することができます。
  CakePHP 2.0 から 2.2 までは、(利用可能であれば) デフォルトのキャッシュになりました。
- `Wincache` Wincache は、 [Wincache](https://www.php.net/wincache) 拡張を使用します。
  Wincache は APC と同等の機能やパフォーマンスですが、 Windows と Microsoft IIS に
  最適化しています。
- `XcacheEngine` [Xcache](https://en.wikipedia.org/wiki/List_of_PHP_accelerators#XCache)
  は、APC と同等の機能を持つ PHP 拡張です。
- `MemcacheEngine` [Memcache](https://www.php.net/memcache) 拡張を使用します。
  Memcache は、複数サーバに分散されたとても速いキャッシュシステムを提供し、
  アトミックな操作を提供します。
- `MemcachedEngine` [Memcached](https://www.php.net/memcached) 拡張を使用します。
  これも memcache のインターフェースですが、より高いパフォーマンスが得られます。
- `RedisEngine` [phpredis](https://github.com/phpredis/phpredis) 拡張
  (2.2.3 以上) を使用します。Redis は、memcache と同様に高速で永続化した
  キャッシュシステムを提供し、アトミックな操作を提供します。

::: info Changed in version 2.3
FileEngine がデフォルトのキャッシュエンジンです。以前、多くの人々にとって APC をCLI とウェブの両方での適切な設定やデプロイが困難ででした。ファイルを利用することで、CakePHP の設定が新しい開発者にとってシンプルになりました。
:::

::: info Changed in version 2.5
Memcached エンジンが追加されました。そして Memcache エンジンは非推奨です。
:::

あなたが選んだキャッシュエンンジンにかかわらず、 あなたのアプリケーションは、一貫した作法で
`Cache` とやり取りします。これは、あなたのアプリケーションの成長に伴い
キャッシュエンジンの交換が容易であることを意味します。 `Cahce` クラスに加えて
[CacheHelper](../core-libraries/helpers/cache) は、ページ全体のキャッシュを行います。
これを使うと、とてもパフォーマンスが向上します。

## Cache クラスの設定

Cache クラスの設定は、どこでもできます。しかし、一般的には、 `app/Config/bootstrap.php`
の中で Cache の設定を行います。あなたが必要なだけ、キャッシュの設定を追加できます。
そして、複数のキャッシュエンジンを利用できます。CakePHP は、２つの内部的なキャッシュの設定を
`app/Config/core.php` で行います。もし、 APC や Memcache を使用している場合、
コアのキャッシュにはユニークなキーをセットしておくべきです。これは、複数アプリケーションで
別のアプリのキャッシュデータを上書きしてしまうのを避けるためです。

複数のキャッシュの設定を利用することで、全てのキャッシュの設定を一元管理するのと同じくらい
`Cache::set()` の使用が必要になる回数を減らすことができます。
複数の設定を使用することで、必要なだけストレージを変更できます。

> [!NOTE]
> どのエンジンを使用するか指定する必要があります。デフォルトで File には
> **なりません**。

例:

``` php
Cache::config('short', array(
    'engine' => 'File',
    'duration' => '+1 hours',
    'path' => CACHE,
    'prefix' => 'cake_short_'
));

// long
Cache::config('long', array(
    'engine' => 'File',
    'duration' => '+1 week',
    'probability' => 100,
    'path' => CACHE . 'long' . DS,
));
```

`app/Config/bootstrap.php` に上記のコードを記述することで、Cache 設定が
2 つ追加されます。 'short' と 'long' という設定名で、 `Cache::write()`
と `Cache::read()` の `$config` パラメータで指定します。

> [!NOTE]
> FileEndine 使用時に、正しいパーミッションでのキャッシュファイルを指定して作成するには、
> `mask` オプションの設定が必要です。

::: info Added in version 2.4
デバッグモードで FileEngine 使用時には、不必要なエラーの発生を避けるため、存在しないディレクトリは自動作成されるようになりました。
:::

## Cache のためのストレージエンジンの作成

`app/Lib` 内や、プラグインの `$plugin/Lib` 内に独自の `Cache` アダプターを
用意できます。アプリケーションやプラグインのキャッシュエンジンは、コアのエンジンと
差し替えられます。 Cache アダプターは、Cache ディレクトリ内に置かなければなりません。
`MyCustomCacheEngine` と名付けたキャッシュエンジンがあったとすると、
アプリケーションのライブラリとして `app/Lib/Cache/Engine/MyCustomCacheEngine.php`
に配置されるか、プラグインの一部として
`$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php` に配置されます。
プラグインの Cache 設定は、ドット記法を使用する必要があります。 :

``` php
Cache::config('custom', array(
    'engine' => 'CachePack.MyCustomCache',
    // ...
));
```

> [!NOTE]
> アプリケーションやプラグインのキャッシュエンジンは、 `app/Config/bootstrap.php`
> で設定すべきです。もし、core.php にそれらの設定をしたとしても、正しく動作しません。

独自のキャッシュエンジンは、 いくつかの初期化メソッドと抽象メソッドが定義された
`CacheEngine` を継承する必要があります。

CacheEngine に必要な API は、以下の通りです。

`class` **CacheEngine**

`method` CacheEngine::**write**($key, $value, $config = 'default')

`method` CacheEngine::**read**($key, $config = 'default')

`method` CacheEngine::**delete**($key, $config = 'default')

`method` CacheEngine::**clear**($check)

`method` CacheEngine::**clearGroup**($group)

`method` CacheEngine::**decrement**($key, $offset = 1)

`method` CacheEngine::**increment**($key, $offset = 1)

`method` CacheEngine::**gc**()

`method` CacheEngine::**add**($key, $value)

## クエリ結果の保存に Cache を使用

変更頻度が少ない検索結果や頻繁に読まれる題目をキャッシュの中に置くことで、アプリケーションの
パフォーマンスが劇的に改善されます。 `Model::find()` の検索結果が好例です。
検索結果を格納する Cache を使用するメソッドは以下のようになります。 :

``` php
class Post extends AppModel {

    public function newest() {
        $result = Cache::read('newest_posts', 'long');
        if (!$result) {
            $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
            Cache::write('newest_posts', $result, 'long');
        }
        return $result;
    }
}
```

上記のコードのキャッシュの読み込みロジックを、ビヘイビアでキャッシュを読み込んだり、
関連モデルのメソッドを実行することで改善できます。改善していくことで
あなたの訓練になります。

2.5 から、 `Cache::remember()` を使用することで、もっとシンプルに
上記を実現することができます。 PHP 5.3 以上を使用している場合、 `remember()`
メソッドは、以下のように使用します。 :

``` php
class Post extends AppModel {

    public function newest() {
        $model = $this;
        return Cache::remember('newest_posts', function() use ($model){
            return $model->find('all', array(
                'order' => 'Post.updated DESC',
                'limit' => 10
            ));
        }, 'long');
    }
}
```

## カウンターの保存に Cache を使用

様々な用途でカウンターをキャッシュに簡単に格納できます。例えば、コンテストで
'slots' の残りを単純にカウントダウンするために Cache に格納することができます。
Cache クラスは、簡単な方法で、アトミックにカウンターの値を増減できます。
二人のユーザーが同時にカウンターの値を下げた際、不正な値を返すような
カウンターの値が競合するリスクを減らすために、アトミックな操作は重要です。

整数値をセットした後、 `Cache::increment()` と
`Cache::decrement()` を使って操作できます。 :

``` php
Cache::write('initial_count', 10);

// Later on
Cache::decrement('initial_count');

// or
Cache::increment('initial_count');
```

> [!NOTE]
> FileEngine では、 increment() と decrement() は動作しません。代わりに
> APC、Redis、Memcached を使用してください。

## グループの使用

::: info Added in version 2.2
:::

あるグループや名前空間に属する複数のキャッシュのデータを指定したいことがあると思います。
同じグループ内の全てのエントリーで共有される情報の変更があった場合は必ず、
全体を無効化するキーが必要になります。これには、キャッシュの設定内で groups を宣言することで
可能になります。 :

``` php
Cache::config('site_home', array(
    'engine' => 'Redis',
    'duration' => '+999 days',
    'groups' => array('comment', 'post')
));
```

ホームページのために生成された HTML をキャッシュに格納したいとします。そして、
コメントや投稿がデータベースに追加されるごとに、このキャッシュを自動的に無効化したい。
`comment` と `post` グループを追加することで、両方のグループ名を持つキャッシュの
設定に格納されたキーを効果的にタグ付けします。

例えば、新しい投稿が追加された時は必ず、 `post` グループに関連する全てのデータを
削除するために、キャッシュエンジンに通知することができます。 :

``` php
// Model/Post.php

public function afterSave($created, $options = array()) {
    if ($created) {
        Cache::clearGroup('post', 'site_home');
    }
}
```

::: info Added in version 2.4
:::

`Cache::groupConfigs()` は、(例えば同一の)グループに属する設定を
取得するのに使用します。 :

``` php
// Model/Post.php

/**
 * 前例の別のバリエーション。同じグループに属する全てのキャッシュを消去します。
 */
public function afterSave($created, $options = array()) {
    if ($created) {
        $configs = Cache::groupConfigs('post');
        foreach ($configs['post'] as $config) {
            Cache::clearGroup('post', $config);
        }
    }
}
```

グループは、同じエンジンで同じプレフィックスを使用している全てのキャッシュ設定間で共有されます。
もし、グループを使用していて、グループ削除をしたい場合、全ての設定に共通のプレフィックスを
指定してください。

## Cache API

`class` **Cache**

`method` Cache::**clearGroup**($group, $config = 'default')
