# Url

`class` Cake\\View\\Helper\\**UrlHelper**(View $view, array $config = [])

UrlHelper は他のヘルパーから URL を生成することが容易になります。
アプリケーションのヘルパーでコアヘルパーをオーバーライドすることによって URL の生成方法を
カスタマイズする単一の場所を提供します。このやり方は [Aliasing Helpers](../../views/helpers#aliasing-helpers)
セクションをご覧ください。

## URL の生成

`method` Cake\\View\\Helper\\UrlHelper::**build**(mixed $url = null, array $options = [])

コントローラーとアクションの組み合わせを指定することで URL を生成して返します。
`$url` が空の場合、 `REQUEST_URI` を返します。そうでない場合、
コントローラーとアクションの組み合わせで URL を生成します。
`full` が `true` の場合、結果がフルベース URL で返されます。 :

``` php
echo $this->Url->build([
    'controller' => 'Posts',
    'action' => 'view',
    'bar',
]);

// 出力結果
/posts/view/bar
```

さらにいつかの使用例は、こちら:

拡張子つきの URL:

``` php
echo $this->Url->build([
    'controller' => 'Posts',
    'action' => 'list',
    '_ext' => 'rss',
]);

// 出力結果
/posts/list.rss
```

フルベース URL を前につけた ('/' から始まる) URL:

``` php
echo $this->Url->build('/posts', ['fullBase' => true]);

// 出力結果
http://somedomain.com/posts
```

GET パラメーターとフラグメントアンカーの URL:

``` php
echo $this->Url->build([
    'controller' => 'Posts',
    'action' => 'search',
    '?' => ['foo' => 'bar'],
    '#' => 'first',
]);

// 出力結果
/posts/search?foo=bar#first
```

上記の例で使用している `?` キーは、あなたが使用しているクエリー文字列パラメーターを
明示したい場合やクエリー文字列パラメーターをあなたのルートプレースホルダーの一つと名前を
共有したい場合に便利です。

名前付きルートの URL:

``` php
echo $this->Url->build(['_name' => 'product-page', 'slug' => 'i-m-slug']);

// 以下のようにルートをセットアップすることを仮定:
// $router->connect(
//     '/products/{slug}',
//     [
//         'controller' => 'Products',
//         'action' => 'view',
//     ],
//     [
//         '_name' => 'product-page',
//     ]
// );

echo $this->Url->build(['_name' => 'product-page', 'slug' => 'i-m-slug']);
// Will result in:
/products/i-m-slug
```

第２パラメーターは、HTML エスケープやベースパスを追加するかどうかを制御するオプションを
定義できます。 :

``` php
$this->Url->build('/posts', [
    'escape' => false,
    'fullBase' => true,
]);
```

以下は、アセットタイムスタンプ付きの URL が `<link rel="preload"/>` で囲まれており、
フォントをプリロードしています。注意: ファイルは存在していなければならず、
`Configure::read('Asset.timestamp')` は、タイムスタンプを追加するために
`true` または `'force'` を返さなければなりません。 :

``` php
echo $this->Html->meta([
    'rel' => 'preload',
    'href' => $this->Url->assetUrl(
        '/assets/fonts/yout-font-pack/your-font-name.woff2'
    ),
    'as' => 'font',
]);
```

CSS や JavaScript、または画像ファイルの URL を生成する場合、
これらのアセットタイプのためのヘルパーメソッドがあります。 :

``` php
// 出力結果 /img/icon.png
$this->Url->image('icon.png');

// 出力結果 /js/app.js
$this->Url->script('app.js');

// 出力結果 /css/app.css
$this->Url->css('app.css');

// メソッドの呼び出し時にタイムスタンプを強制
$this->Url->css('app.css', ['timestamp' => 'force']);

// または、メソッド呼び出し時にタイムスタンプを無効化
$this->Url->css('app.css', ['timestamp' => false]);
```

詳細は API の
[Router::url](https://api.cakephp.org/4.x/class-Cake.Routing.Router.html#_url)
を確認してください。
