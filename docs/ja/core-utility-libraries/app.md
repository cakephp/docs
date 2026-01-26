# App クラス

`class` **App**

App クラスはパスの管理、クラスのロケーション、そしてクラスのローディングの責務を担っています。
念のため [File And Classname Conventions](../getting-started/cakephp-conventions#file-and-classname-conventions) に従っていることを確認して下さい。

## パッケージ

CakePHP はパッケージの考え方を中心に編成され、それぞれのクラスは他のクラスが存在するパッケージや
フォルダに属します。それぞれのクラスをどの場所でロードするべきなのかをフレームワークに通知するため、
`App::build('APackage/SubPackage', $paths)` を使用して各パッケージの場所を設定することができます。
CakePHP のフレームワークのほぼすべてのクラスは、あなた独自の互換性のある実装と入れ替えることができます。
フレームワークが提供するクラスの代わりに独自のクラスを使用したい場合は、ただ単に、CakePHP の探索が
期待できるディレクトリの配置を模倣した libs フォルダにクラスを追加するだけです。

例えば、あなた独自の HttpSocket クラスを用いたいなら以下のように配置します:

    app/Lib/Network/Http/HttpSocket.php

一度このようにやりさえすれば、 App は CakePHP 内部のファイルの代わりにあなたが再定義したファイルを
ロードします。

## クラスのローディング

`static` App::**uses**(string $class, string $package)

rtype  
void

CakePHP ではクラスは遅延ロードされますが、オートローダがクラスを発見出来るためには、
どこでファイルを見つけられるのかをまず App に伝えなくてはなりません。
どのパッケージでクラスを発見できるのかを App に伝えることで、あるクラスを初めて使用するときに
適切にファイルを見つけることができるのです。

一般的なクラスの例をいくつか挙げます:

Console Commands  
`App::uses('AppShell', 'Console/Command');`

Console Tasks  
`App::uses('BakeTask', 'Console/Command/Task');`

Controllers  
`App::uses('PostsController', 'Controller');`

Components  
`App::uses('AuthComponent', 'Controller/Component');`

Models  
`App::uses('MyModel', 'Model');`

Behaviors  
`App::uses('TreeBehavior', 'Model/Behavior');`

Views  
`App::uses('ThemeView', 'View');`

Helpers  
`App::uses('HtmlHelper', 'View/Helper');`

Libs  
`App::uses('PaymentProcessor', 'Lib');`

Vendors  
`App::uses('Textile', 'Vendor');`

Utilities  
`App::uses('CakeText', 'Utility');`

つまり基本的に、第二パラメータは、コアまたはアプリ内のクラスファイルのフォルダパスと単純に
一致させなくてはなりません。

> [!NOTE]
> ベンダーのローディングは通常、規則に従わないパッケージのローディングを意味します。
> 多くのベンダーのパッケージに対しては `App::import()` の使用が推奨されます。

### プラグイン内のファイルをロードする

プラグインからのクラスのローディングは、ロード元になるプラグインを指定する以外は、app や
core のクラスのローディングとまったく同じように動作します:

``` php
// app/Plugin/PluginName/Model/Comment.php にある Comment クラスをロードする
App::uses('Comment', 'PluginName.Model');

// app/Plugin/PluginName/Controller/Component/CommentComponent.php にある
// CommentComponent クラスをロードする
App::uses('CommentComponent', 'PluginName.Controller/Component');
```

## App::path() を用いたパッケージへのパスの探索

`static` App::**path**(string $package, string $plugin = null)

rtype  
array

保存されたパス情報を読み込むために用いる:

``` php
// アプリケーション内のモデルのパスが返る
App::path('Model');
```

アプリケーション内のすべてのパッケージに対してこれを実行できます。
プラグインに対するパスを取得することもできます:

``` php
// DebugKit 内のコンポーネントのパスが返る
App::path('Component', 'DebugKit');
```

`static` App::**paths**( )

rtype  
array

現在読み込まれているすべてのパスを App から取得します。
App が把握している全てのパスを調べたり記憶したりするのに便利です。
特定のパッケージのパスを扱う場合は `App::path()` を使用します。

`static` App::**core**(string $package)

rtype  
array

CakePHP 内部のパッケージのパスを見つけるために用いられます:

``` php
// Cache エンジンへのパスを取得する
App::core('Cache/Engine');
```

`static` App::**location**(string $className)

rtype  
string

クラスが定義された場所のパッケージ名を返します。

## App がパッケージを探索できるようにパスを追加する

`static` App::**build**(array $paths = array(), mixed $mode = App::PREPEND)

rtype  
void

ファイルシステム上の各パッケージの場所を設定します。パッケージごとに複数の探索パスを設定することができ、
それらは、ファイルがあるフォルダを一度だけ探すために指定された順序で使用されます。
すべてのパスはディレクトリセパレータで終了する必要があります。

例えばコントローラのパスを追加すると、CakePHP がコントローラを探すパスを置き換えることになるでしょう。
この仕組みが、アプリケーションをファイルシステムから分離させてくれます。

使い方:

``` php
//Model パッケージのための新しい探索パスがセットアップされます
App::build(array('Model' => array('/a/full/path/to/models/')));

//このパスはモデルを探索するための唯一正しいパスとしてセットアップされます
App::build(array('Model' => array('/path/to/models/')), App::RESET);

//ヘルパーの複数の探索パスがセットアップされます
App::build(array(
    'View/Helper' => array('/path/to/helpers/', '/another/path/')
));
```

reset が true に設定されている場合、ロードされたすべてのプラグインは忘れ去られ、
それらは再びロードされる必要があります。

例:

``` php
App::build(array('controllers' => array('/full/path/to/controllers/')));
//このようになりました
App::build(array('Controller' => array('/full/path/to/Controller/')));

App::build(array('helpers' => array('/full/path/to/views/helpers/')));
//このようになりました
App::build(array('View/Helper' => array('/full/path/to/View/Helper/')));
```

::: info Changed in version 2.0
`App::build()` はもはや app のパスと core のパスをマージしません
:::

### アプリケーションに新しいパッケージを追加する

`App::build()` は新しいパッケージの場所を追加するために用いられます。
アプリケーションに新しいトップレベルのパッケージや、サブパッケージを追加したい場合に便利です:

``` php
App::build(array(
    'Service' => array('%s' . 'Service' . DS)
), App::REGISTER);
```

新しく登録されたパッケージの `%s` は、 `APP` パスに置き換えられます。
登録されるパッケージの末尾には `/` を含める必要があります。いったんパッケージを登録すれば、
`App::build()` を他のパッケージのように、パスの 後方追加/前方追加/リセットのために使用することができます。

::: info Changed in version 2.1
パッケージの登録は 2.1 で追加されました
:::

## CakePHP が把握しているオブジェクトを探索する

`static` App::**objects**(string $type, mixed $path = null, boolean $cache = true)

rtype  
mixed 与えられた型のオブジェクトの配列か、不正な場合は false を返します。

`App::objects('Controller')` を用いて、Appが把握しているオブジェクト、例えば
App が把握しているアプリケーションのコントローラ、を見出せます。

使用例:

``` php
//returns array('DebugKit', 'Blog', 'User');
App::objects('plugin');

//returns array('PagesController', 'BlogController');
App::objects('Controller');
```

プラグインドット記法を用いることで、そのプラグイン内においてのオブジェクトを探すこともできます:

``` php
// returns array('MyPluginPost', 'MyPluginComment');
App::objects('MyPlugin.Model');
```

::: info Changed in version 2.0
:::

1.  結果が空の場合や型が不正な場合に false の代わりに `array()` を返します
2.  `App::objects('core')` は、もはやコアオブジェクトを返さずに `array()` を返します
3.  完全なクラス名を返します

## プラグインの配置

`static` App::**pluginPath**(string $plugin)

rtype  
string

プラグインも同じように App で配置できます。例えば `App::pluginPath('DebugKit');`
を用いることで DebugKit プラグインへのフルパスをあなたに与えます:

``` php
$path = App::pluginPath('DebugKit');
```

## テーマの設置

`static` App::**themePath**(string $theme)

rtype  
string

`App::themePath('purple');` のように呼ぶと、 <span class="title-ref">purple</span> テーマのフルパスを取得することができます。

## App::import() でファイルをインクルードする

`static` App::**import**(mixed $type = null, string $name = null, mixed $parent = true, array $search = array(), string $file = null, boolean $return = false)

rtype  
boolean

一見すると `App::import` は複雑に見えます。
しかしながら、ほとんどのケースではただ二つの引数が要求されるのみです。

> [!NOTE]
> このメソッドはファイルを `require` することと同じです。
> その後、クラスの初期化が必要だと理解しておくことは重要です。

``` php
// require('Controller/UsersController.php'); と同じ
App::import('Controller', 'Users');

// クラスのロードが必要
$Users = new UsersController();

// モデル連携やコンポーネントなどがロードされるようにしたい場合
$Users->constructClasses();
```

**かつて App::import('Core', \$class) を用いてロードされたすべてのクラスは、
App::uses() を用いた、正しいパッケージを参照したロードが必要になりました。
この変更は、フレームワークに大きなパフォーマンスの向上をもたらしました。**

::: info Changed in version 2.0
:::

- このメソッドはもはや再帰的にクラスを検索しなくなり、 `App::build()`
  に定義されているパスの値を厳格に使用します
- クラスをロードするための `App::import('Component', 'Component')` は使用不可になる予定。
  `App::uses('Component', 'Controller');` を用いて下さい。
- コアクラスをロードするためには `App::import('Lib', 'CoreClass');` はもはや使用不可です。
- 存在しないファイルのインポート、あるいは `$name` および `$file` のパラメータとして誤った型や
  パッケージ名や NULL値を渡すと、戻り値は false になります。
- `App::import('Core', 'CoreClass')` はもはやサポートされません。 `App::uses()`
  を用い、残りの部分はクラスのオートローディングにやらせます。
- ベンダーファイルのローディングはベンダーフォルダを再帰的に探索しません。かつてのようにファイル名を
  アンダースコアに変換することも、もうありません。

## CakePHP のクラスをオーバーライドする

フレームワークのほぼすべてのクラスはオーバーライドすることができます。例外は `App` と
`Configure` クラスです。そのようにオーバーライドを実行したいならばどんな場合であれ、
フレームワークの内部構造を真似て `app/Lib` フォルダにクラスを追加する、ただそれだけです。
いくつかの例を挙げます:

- `Dispatcher` クラスをオーバーライドするためには `app/Lib/Routing/Dispatcher.php` を作成します
- `CakeRoute` クラスをオーバーライドするためには `app/Lib/Routing/Route/CakeRoute.php` を作成します
- `Model` クラスをオーバーライドするためには `app/Lib/Model/Model.php` を作成します

置き換えたファイルをロードすると、 `app/Lib` のファイルが組み込みのコアクラスの代わりにロードされます。

## Vendor ファイルをローディングする

`App::uses()` をベンダーのディレクトリ内のクラスをロードするのに使うことが出来ます。
これは他のファイルを読み込むのと同じ規則に従います:

``` php
// app/Vendor/Geshi.php 内の Geshi クラスをロードする
App::uses('Geshi', 'Vendor');
```

サブディレクトリ内のクラスをロードするには、それらのパスを `App::build()` で追加する必要があります:

``` php
// app/Vendor/SomePackage/ClassInSomePackage.php 内の
// ClassInSomePackage クラスをロードする
App::build(array('Vendor' => array(APP . 'Vendor' . DS . 'SomePackage' . DS)));
App::uses('ClassInSomePackage', 'Vendor');
```

ベンダーのファイルは、規則に従っていなかったり、ファイル名と異なるクラスを持っていたり、
クラスを含んでないかもしれません。それらのファイルは `App::import()` を使用して読み込むことができます。
次の例では、いくつかのパス構造からベンダーファイルをロードする方法を示しています。
これらのベンダーファイルは、ベンダーのフォルダのいずれかに配置することができます。

**app/Vendor/geshi.php** をロードする:

``` php
App::import('Vendor', 'geshi');
```

> [!NOTE]
> CakePHP が他のファイルを見出してしまわないために、geshi のファイル名は、小文字でなくてはなりません。

**app/Vendor/flickr/flickr.php** をロードする:

``` php
App::import('Vendor', 'flickr', array('file' => 'flickr/flickr.php'));
```

**app/Vendor/some.name.php** をロードする:

``` php
App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));
```

**app/Vendor/services/well.named.php** をロードする:

``` php
App::import(
    'Vendor',
    'WellNamed',
    array('file' => 'services' . DS . 'well.named.php')
);
```

**app/Plugin/Awesome/Vendor/services/well.named.php** をロードする:

``` php
App::import(
    'Vendor',
    'Awesome.WellNamed',
    array('file' => 'services' . DS . 'well.named.php')
);
```

**app/Plugin/Awesome/Vendor/Folder/Foo.php** をロードする:

``` php
App::import(
    'Vendor',
    'Awesome.Foo',
    array('file' => 'Folder' . DS . 'Foo.php'));
```

ベンダーファイルが /vendors ディレクトリ内にあるかどうかに違いはありません。
CakePHP は自動的にそれを見出します。

**vendors/vendorName/libFile.php** をロードする:

``` php
App::import(
    'Vendor',
    'aUniqueIdentifier',
    array('file' => 'vendorName' . DS . 'libFile.php')
);
```

## App init/load/shutdown メソッド

`static` App::**init**( )

rtype  
void

App のキャッシュを初期化し、シャットダウン関数を登録します。

`static` App::**load**(string $className)

rtype  
boolean

自動的なクラスローディングを処理するメソッド。これは、`App::uses()`
を使用して定義された各クラスのパッケージを探し出し、その情報を元に、クラスをロードするための
フルパスとしてパッケージ名を解決します。各クラスのファイル名はクラス名に従ってください。
たとえばクラス名が `MyCustomClass` である場合、ファイル名は `MyCustomClass.php`
でなければなりません。

`static` App::**shutdown**( )

rtype  
void

オブジェクトのデストラクタ。
`$_map` に変更が加えられている場合にキャッシュファイルに書き込みます。
