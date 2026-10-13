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

    src/Lib/Network/Http/HttpSocket.php

そして後述の「CakePHP のクラスをオーバーライドする」で説明しているように
`App::uses()` で登録すると、 App は CakePHP 内部のファイルの代わりにあなたが再定義したファイルを
ロードします。

## クラスのローディング

`static` App::**uses**(string $class, string $package)

rtype  
void

CakePHP ではクラスは遅延ロードされます。CakePHP 自身のクラスは Composer の classmap
オートローダで読み込まれるため、宣言する必要はありません。アプリケーションスケルトンのように
`composer.json` でアプリケーションのクラスを classmap に指定している場合も同様です。

``` json
"autoload": {
    "classmap": ["src/"]
}
```

classmap を使う場合は、新しいクラスファイルを追加したら `composer dump-autoload` を実行してください。

`App::uses()` が必要なのは、Composer が把握していないクラスです。つまり classmap を使っていない場合の
アプリケーションのクラスと、Composer のオートロードに対応していないプラグインのクラスです。
どのパッケージでクラスを発見できるのかを App に伝えることで、あるクラスを初めて使用するときに
適切にファイルを見つけることができるのです。

::: pieceofcake2
フレームワークのクラスは Composer の classmap オートローダで読み込まれ、
クラス同士で `App::uses()` を呼び出さなくなりました。既存の `App::uses()` 呼び出しはそのまま動作します。
詳しくは [CakePHP 2.10 からの移行](/ja/appendices/migrating-from-cakephp-2-10) を参照してください。
:::

一般的なクラスの例をいくつか挙げます:

Console Commands  
`App::uses('AppShell', 'Console/Command');`

Console Tasks  
`App::uses('ImportTask', 'Console/Command/Task');`

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
> サードパーティのライブラリは通常 Composer でインストールしてオートロードするため、
> `App::uses()` や `App::import()` は必要ありません。Composer で入手できず、
> 規則にも従っていない一部のファイルには `App::import()` を使ってください。

### プラグイン内のファイルをロードする

プラグインからのクラスのローディングは、ロード元になるプラグインを指定する以外は、app や
core のクラスのローディングとまったく同じように動作します:

``` php
// plugins/PluginName/Model/Comment.php にある Comment クラスをロードする
App::uses('Comment', 'PluginName.Model');

// plugins/PluginName/Controller/Component/CommentComponent.php にある
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

`static` App::**build**(array $paths = [], mixed $mode = App::PREPEND)

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
App::build(['Model' => ['/a/full/path/to/models/']]);

//このパスはモデルを探索するための唯一正しいパスとしてセットアップされます
App::build(['Model' => ['/path/to/models/']], App::RESET);

//ヘルパーの複数の探索パスがセットアップされます
App::build([
    'View/Helper' => ['/path/to/helpers/', '/another/path/']
]);
```

reset が true に設定されている場合、ロードされたすべてのプラグインは忘れ去られ、
それらは再びロードされる必要があります。パッケージ名は `Controller` や `View/Helper` のような
フォルダ名です。 `App::build()` は app のパスと core のパスをマージしません。

<a id="app-build-register"></a>

### アプリケーションに新しいパッケージを追加する

`App::build()` は新しいパッケージの場所を追加するために用いられます。
アプリケーションに新しいトップレベルのパッケージや、サブパッケージを追加したい場合に便利です:

``` php
App::build([
    'Service' => ['%s' . 'Service' . DS]
], App::REGISTER);
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
//returns ['DebugKit', 'Blog', 'User'];
App::objects('plugin');

//returns ['PagesController', 'BlogController'];
App::objects('Controller');
```

プラグインドット記法を用いることで、そのプラグイン内においてのオブジェクトを探すこともできます:

``` php
// returns ['MyPluginPost', 'MyPluginComment'];
App::objects('MyPlugin.Model');
```

`App::objects()` は完全なクラス名を返します。結果が空の場合や型が不正な場合は `[]` を返し、
コアオブジェクトは返しません (`App::objects('core')` は `[]` を返します)。

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

`static` App::**import**(mixed $type = null, string $name = null, mixed $parent = true, array $search = [], string $file = null, boolean $return = false)

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

次の点に注意してください。

- このメソッドはファイルを再帰的に検索せず、 `App::build()`
  に定義されているパスの値を厳格に使用します。
- コアクラスはオートロードされるため、このメソッドではロードできません。
- 存在しないファイルのインポート、あるいは `$name` および `$file` のパラメータとして誤った型や
  パッケージ名や NULL値を渡すと、戻り値は false になります。
- ベンダーファイルのローディングはベンダーフォルダを再帰的に探索せず、
  ファイル名をアンダースコア形式に変換することもありません。

## CakePHP のクラスをオーバーライドする

フレームワークのほぼすべてのクラスはオーバーライドすることができます。例外は `App` と
`Configure` クラスです。そのようにオーバーライドを実行したいならばどんな場合であれ、
フレームワークの内部構造を真似て `src/Lib` フォルダ (レガシーレイアウトでは `app/Lib`) にクラスを追加し、
そのクラスが最初に使われる前に `App::uses()` で登録します。登録は `config/bootstrap.php` などで行います。
いくつかの例を挙げます:

- `Dispatcher` クラスをオーバーライドするためには `src/Lib/Routing/Dispatcher.php` を作成し、
  `App::uses('Dispatcher', 'Routing');` を呼び出します
- `CakeRoute` クラスをオーバーライドするためには `src/Lib/Routing/Route/CakeRoute.php` を作成し、
  `App::uses('CakeRoute', 'Routing/Route');` を呼び出します
- `Model` クラスをオーバーライドするためには `src/Lib/Model/Model.php` を作成し、
  `App::uses('Model', 'Model');` を呼び出します

`App::load()` は Composer のオートローダより前に登録されています。 `App::uses()` で登録されたクラスについては、
`src/Lib` を含むアプリケーションのフォルダをコアより先に探すため、組み込みのコアクラスの代わりに
あなたのファイルがロードされます。 `App::uses()` を呼び出さなかった場合は、Composer によってコアのクラスがロードされます。
`composer.json` で `src/` を classmap に指定している場合は、Composer の "Ambiguous class resolution"
警告を避けるため、オーバーライドするファイルを `exclude-from-classmap` で除外してください。

::: pieceofcake2
フレームワークが自身のクラスに対して `App::uses()` を呼び出さなくなったため、
`src/Lib` に置いたオーバーライドは、アプリケーションが `App::uses()` で登録した場合にだけ使われます。
アップグレード後はオーバーライドが効いているか確認してください。
:::

## Vendor ファイルをローディングする

Composer でインストールしたライブラリはオートロードされるため、特別なコードは不要です。
この節は、手作業でプロジェクトにコピーしたファイルを対象としています。それらのファイルは、
Composer が管理しないプロジェクトの `vendors/` ディレクトリ (レガシーレイアウトでは `app/Vendor/`) に置きます。

`App::uses()` をベンダーのディレクトリ内のクラスをロードするのに使うことが出来ます。
これは他のファイルを読み込むのと同じ規則に従います:

``` php
// vendors/Geshi.php 内の Geshi クラスをロードする
App::uses('Geshi', 'Vendor');
```

サブディレクトリ内のクラスをロードするには、それらのパスを `App::build()` で追加する必要があります:

``` php
// vendors/SomePackage/ClassInSomePackage.php 内の
// ClassInSomePackage クラスをロードする
App::build(['Vendor' => [ROOT . DS . 'vendors' . DS . 'SomePackage' . DS]]);
App::uses('ClassInSomePackage', 'Vendor');
```

ベンダーのファイルは、規則に従っていなかったり、ファイル名と異なるクラスを持っていたり、
クラスを含んでないかもしれません。それらのファイルは `App::import()` を使用して読み込むことができます。
次の例では、いくつかのパス構造からベンダーファイルをロードする方法を示しています。
これらのベンダーファイルは、ベンダーのフォルダのいずれかに配置することができます。

**vendors/geshi.php** をロードする:

``` php
App::import('Vendor', 'geshi');
```

> [!NOTE]
> CakePHP が他のファイルを見出してしまわないために、geshi のファイル名は、小文字でなくてはなりません。

**vendors/flickr/flickr.php** をロードする:

``` php
App::import('Vendor', 'flickr', ['file' => 'flickr/flickr.php']);
```

**vendors/some.name.php** をロードする:

``` php
App::import('Vendor', 'SomeName', ['file' => 'some.name.php']);
```

**vendors/services/well.named.php** をロードする:

``` php
App::import(
    'Vendor',
    'WellNamed',
    ['file' => 'services' . DS . 'well.named.php']
);
```

**plugins/Awesome/Vendor/services/well.named.php** をロードする:

``` php
App::import(
    'Vendor',
    'Awesome.WellNamed',
    ['file' => 'services' . DS . 'well.named.php']
);
```

**plugins/Awesome/Vendor/Folder/Foo.php** をロードする:

``` php
App::import(
    'Vendor',
    'Awesome.Foo',
    ['file' => 'Folder' . DS . 'Foo.php']);
```

`src/Vendor/` にあるベンダーファイルも同様に見つけられます。

**vendors/vendorName/libFile.php** をロードする:

``` php
App::import(
    'Vendor',
    'aUniqueIdentifier',
    ['file' => 'vendorName' . DS . 'libFile.php']
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
