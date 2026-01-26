# ヘルパー

ヘルパーはアプリケーションのプレゼンテーション層のためのコンポーネントのようなクラスです。
多くのビューやエレメント、レイアウトで共有される表示ロジックを含んでいます。
この章では、ヘルパーを設定する方法を紹介します。ヘルパーの読み込み方法、
それらのヘルパーの使い方、独自のヘルパーを作成するための簡単な手順を概説します。

CakePHP にはビューの作成に役立つ多くのヘルパーがあります。それらは、整形式のマークアップ
(フォーム含む)、テキスト、時間、数値の整形に役立ったり、 Ajax 機能 をスピードアップさせたりします。
CakePHP のヘルパーに関する詳細については、各ヘルパーの章をご覧ください。

- [Breadcrumbs (パンくず)](../views/helpers/breadcrumbs)
- [Flash](../views/helpers/flash)
- [Form](../views/helpers/form)
- [Html](../views/helpers/html)
- [Number](../views/helpers/number)
- [Paginator](../views/helpers/paginator)
- [Text](../views/helpers/text)
- [Time](../views/helpers/time)
- [Url](../views/helpers/url)

## ヘルパーの設定

CakePHP でヘルパーを読み込むには、ビュークラスでヘルパーを宣言します。
`AppView` クラスは、すべての CakePHP アプリケーションが付属し、
ヘルパーを読み込むための理想的な場所です。 :

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadHelper('Html');
        $this->loadHelper('Form');
        $this->loadHelper('Flash');
    }
}
```

プラグインのヘルパーを読み込むには、CakePHP の他の場所でも使われている
`プラグイン記法` を使います。 :

``` php
$this->loadHelper('Blog.Comment');
```

CakePHP やアプリケーションにあるヘルパーを明示的に読み込む必要はありません。
これらのヘルパーは、初回の使用時に遅延ロードされます。
例えば:

``` php
// まだ読み込まれていなければ FormHelper を読み込みます。
$this->Form->create($article);
```

プラグインのビュー内から、プラグインヘルパーを遅延ロードすることもできます。
例えば、'Blog' プラグインのビューテンプレートは、同じプラグインからヘルパーを
遅延ロードすることができます。

### 条件付きヘルパーの読み込み

現在のアクション名を使用して、条件付きでヘルパーを読み込むことができます。 :

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        if ($this->request->getParam('action') === 'index') {
            $this->loadHelper('ListPage');
        }
    }
}
```

また、コントローラーの `beforeRender` メソッドを使用して、ヘルパーを読み込むことができます。 :

``` php
class ArticlesController extends AppController
{
    public function beforeRender(EventInterface $event)
    {
        parent::beforeRender($event);
        $this->viewBuilder()->addHelper('MyHelper');
    }
}
```

### 設定オプション

ヘルパーに設定オプションを渡すことができます。これらのオプションは、属性値を設定したり、
ヘルパーの振る舞いを変更するために使用することができます。 :

``` php
namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\View;

class AwesomeHelper extends Helper
{
    public function initialize(array $config): void
    {
        debug($config);
    }
}
```

デフォルトでは、すべての設定オプションは、 `$_defaultConfig` プロパティーとマージされます。
このプロパティーは、ヘルパーが必要とする設定のデフォルト値を定義する必要があります。例えば:

``` php
namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\StringTemplateTrait;

class AwesomeHelper extends Helper
{
    use StringTemplateTrait;

    protected $_defaultConfig = [
        'templates' => [
            'label' => '<label for="{{for}}">{{content}}</label>',
        ],
    ];
}
```

ヘルパーのコンストラクターに提供される任意の設定は、構築時にデフォルト値とマージされ、
マージされたデータは、 `_config` に設定されます。
実行時設定を読み取るために `config()` メソッドを使用することができます。 :

``` php
// autoSetCustomValidity  設定オプションを読み込み
$class = $this->Awesome->config('autoSetCustomValidity ');
```

ヘルパー設定を使用すると、宣言的にヘルパーを設定し、コントローラーロジックから設定ロジックを
削除することができます。クラス宣言の一部として組み込むことができない設定オプションがある場合は、
コントローラーの beforeRender コールバックで設定します。 :

``` php
class PostsController extends AppController
{
    public function beforeRender(EventInterface $event)
    {
        parent::beforeRender($event);
        $builder = $this->viewBuilder();
        $builder->helpers([
            'CustomStuff' => $this->_getCustomStuffConfig(),
        ]);
    }
}
```

### ヘルパーの別名

共通設定の一つに `className` オプションがあります。
このオプションを使うとビュー内に別名のヘルパーを作成することができます。
この機能は `$this->Html` や他のヘルパーの参照を独自実装に置き換えたい時に便利です。 :

``` php
// src/View/AppView.php
class AppView extends View
{
    public function initialize(): void
    {
        $this->loadHelper('Html', [
            'className' => 'MyHtml'
        ]);
    }
}

// src/View/Helper/MyHtmlHelper.php
namespace App\View\Helper;

use Cake\View\Helper\HtmlHelper;

class MyHtmlHelper extends HtmlHelper
{
    // コア HtmlHelper を上書きするコードを追加
}
```

上記の例ではビューにて `MyHtmlHelper` に `$this->Html` という *別名* をつけています。

> [!NOTE]
> 別名をつけられたヘルパーは、ヘルパーが使われるあらゆる場所のインスタンスを置き換えます。
> これは、他のヘルパーの内部を含みます。

## ヘルパーの使用

コントローラーで使用するヘルパーを設定すると、各ヘルパーはビューのパブリックプロパティーとして公開されます。
例えば、 `HtmlHelper` を使用していた場合、次を実行することによってアクセスすることが
できます。 :

``` php
echo $this->Html->css('styles');
```

上記は HtmlHelper の `css()` メソッドを呼び出します。
`$this->{$helperName}` を使用して任意の読み込まれたヘルパーにアクセスすることができます。

### ヘルパーの動的ロード

ビュー内から動的にヘルパーを読み込む必要がある状況があるかもしれません。
これを行うには、 ビューの `Cake\View\HelperRegistry` を使用することができます。 :

``` php
// どちらか１つが動作
$mediaHelper = $this->loadHelper('Media', $mediaConfig);
$mediaHelper = $this->helpers()->load('Media', $mediaConfig);
```

HelperRegistry は [レジストリー](../core-libraries/registry-objects) です。
そして、 CakePHP の他の場所で使用されるレジストリー API をサポートしています。

## コールバックメソッド

ヘルパーは、ビューレンダリングプロセスを強化するためのコールバックをいくつか備えています。
詳細は [Helper Api](#helper-api) と [イベントシステム](../core-libraries/events) ドキュメントをご覧ください。

## ヘルパーの作成

アプリケーションやプラグインで使用するための独自のヘルパークラスを作成することができます。
CakePHP のコンポーネントと同様に、ヘルパークラスは、いくつかの規約があります。

- ヘルパークラスファイルは、 **src/View/Helper** に置かれます。
  例: **src/View/Helper/LinkHelper.php**
- ヘルパークラスは、末尾に `Helper` を付ける必要があります。例: `LinkHelper` 。
- ヘルパークラス名を参照するときは、 末尾の `Helper` を省略しなければなりません。
  例: `$this->loadHelper('Link');` 。

また、正しく動作させるために `Helper` を継承します。 :

``` php
/* src/View/Helper/LinkHelper.php */
namespace App\View\Helper;

use Cake\View\Helper;

class LinkHelper extends Helper
{
    public function makeEdit($title, $url)
    {
        // 特別な形式のリンクを作成するロジックをここに...
    }
}
```

### 他のヘルパーの読み込み

別のヘルパーに既に存在する機能を使用したい場合があります。
その場合、 `$helpers` 配列に使いたいヘルパーを明示することで実現出来ます。
フォーマットは、コントローラーで指定する場合と同じようにして下さい。 :

``` php
/* src/View/Helper/LinkHelper.php (他のヘルパーを使用) */

namespace App\View\Helper;

use Cake\View\Helper;

class LinkHelper extends Helper
{
    public $helpers = ['Html'];

    public function makeEdit($title, $url)
    {
        // 出力に HTML ヘルパーを使用
        // 整形されたデータ:

        $link = $this->Html->link($title, $url, ['class' => 'edit']);

        return '<div class="editOuter">' . $link . '</div>';
    }
}
```

### 独自のヘルパーを使用

ヘルパーを作成して **src/View/Helper/** に配置すると、ビューに読み込めます。 :

``` php
class AppView extends View
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadHelper('Link');
    }
}
```

ヘルパーが読み込まれたら、一致するビュープロパティーにアクセスしてビュー内で使用できます。 :

``` php
<!-- 新しいヘルパーを使用してリンクを作成 -->
<?= $this->Link->makeEdit('レシピの変更', '/recipes/edit/5') ?>
```

> [!NOTE]
> `HelperRegistry` は、 `コントローラー` で明示されていないヘルパーを
> 遅延ロードしようとします。

### ヘルパー内部でビュー変数にアクセス

ヘルパー内部でビュー変数にアクセスしたい場合は、次のように `$this->getView()->get()`
を使用することができます。 :

``` php
class AwesomeHelper extends Helper
{
    public $helpers = ['Html'];

    public function someMethod()
    {
        // meta description の設定
        return $this->Html->meta(
            'description', $this->getView()->get('metaDescription'), ['block' => 'meta']
        );
    }
}
```

### ヘルパー内部でビューエレメントの描画

ヘルパー内部でエレメントを描画したい場合は、次のように `$this->getView()->element()`
を使用することができます。 :

``` php
class AwesomeHelper extends Helper
{
    public function someFunction()
    {
        return $this->getView()->element(
            '/path/to/element',
            ['foo'=>'bar','bar'=>'foo']
        );
    }
}
```

## Helper クラス

`class` **Helper**

### コールバック

ヘルパーにコールバックメソッドを実装することで、CakePHP は関連するイベントにヘルパーを自動的に
登録します。以前のバージョンの CakePHP とは異なり、ヘルパークラスはコールバックメソッドを
実装していないので、あなたのコールバックでは `parent` を *コールしてはいけません* 。

`method` Helper::**beforeRenderFile**(EventInterface $event, $viewFile)

`method` Helper::**afterRenderFile**(EventInterface $event, $viewFile, $content)

`method` Helper::**beforeRender**(EventInterface $event, $viewFile)

`method` Helper::**afterRender**(EventInterface $event, $viewFile)

`method` Helper::**beforeLayout**(EventInterface $event, $layoutFile)

`method` Helper::**afterLayout**(EventInterface $event, $layoutFile)
