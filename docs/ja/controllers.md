# コントローラー

`class` Cake\\Controller\\**Controller**

コントローラー (Controller) は MVC の 'C' です。ルーティングが適用されて適切なコントローラーが見つかった後、
コントローラーのアクションが呼ばれます。コントローラーはリクエストを解釈して、適切なモデルが
呼ばれるのを確認して、正しいレスポンスまたはビューを書き出します。コントローラーはモデルとビューの
中間層とみなすことができます。コントローラーは薄くシンプルに、モデルを大きくしましょう。
そうすれば、あなたの書いたコードはより簡単に再利用できるようになり、そしてより簡単にテストできるでしょう。

一般的に、コントローラーはひとつのモデルのロジックを管理するために使われます。
たとえば、オンラインベーカリーのサイトを構築しようとしている場合、レシピやその材料を管理する
RecipesController と IngredientsController を作るでしょう。
コントローラーは複数のモデルを扱う場合でも問題なく動作しますが、CakePHP では
主に操作するモデルにちなんで、コントローラーの名前が付けられます。

アプリケーションのコントローラーは `AppController` クラスを継承し、そしてそれは
`Controller` クラスを継承しています。 `AppController` クラスは
**src/Controller/AppController.php** に定義し、アプリケーションのコントローラー全体で
共有されるメソッドを含めるようにしましょう。

コントローラーは、リクエストを操作するための *アクション* と呼ばれるいくつかのメソッドを提供します。
デフォルトで、コントローラー上のすべての public メソッドはアクションとなり、URL からアクセスができます。
アクションはリクエストを解釈してレスポンスを返す役割があります。
普通、レスポンスは描画されたビューの形式となっていますが、同様のレスポンスを作成する方法は他にもあります。

<a id="app-controller"></a>

## AppController

冒頭で述べたように、 `AppController` クラスはアプリケーションのすべてのコントローラーの
親クラスとなります。 `AppController` はそれ自身、CakePHP のコアライブラリーに含まれる
`Cake\Controller\Controller` クラスを継承しています。
`AppController` は **src/Controller/AppController.php** に次のように定義されます。 :

``` php
namespace App\Controller;

use Cake\Controller\Controller;

class AppController extends Controller
{
}
```

`AppController` で作られたクラス変数とメソッドはそれを継承するすべてのコントローラーで
有効となります。コンポーネント (あとで学びます) は多くのコントローラー
(必ずしもすべてのコントローラーとは限りません) で使われるコードをまとめるのに使われます。

アプリケーション中のすべてのコントローラーで使われるコンポーネントを読み込むために
`AppController` を使うことができます。CakePHP はこうした用途のために、 Controller
のコンストラクターの最後で呼び出される `initialize()` メソッドを提供します。 :

``` php
namespace App\Controller;

use Cake\Controller\Controller;

class AppController extends Controller
{
    public function initialize(): void
    {
        // CSRF コンポーネントを常に有効にします。
        $this->loadComponent('Csrf');
    }
}
```

## リクエストの流れ

CakePHP アプリケーションへのリクエストが生じると、 CakePHP の `Cake\Routing\Router`
と `Cake\Routing\Dispatcher` クラスは正しいコントローラーを見つけて、
インスタンスを作成するために [Routes Configuration](development/routing#routes-configuration) を使用します。
リクエストデータはリクエストオブジェトの中にカプセル化されています。
CakePHP はすべての重要なリクエスト情報を `$this->request` プロパティーの中に格納します。
CakePHP のリクエストオブジェクトについてのより詳しい情報は [Cake Request](controllers/request-response#cake-request) の章を参照してください。

## コントローラーのアクション

コントローラーのアクションは、リクエストパラメーターを、要求を送ってきたブラウザーやユーザーに対する
レスポンスに変換する役割があります。CakePHP は規約に則ることで、このプロセスを自動化し、
本来であればあなたが書かなければならなかったコードを省いてくれます。

CakePHP は規約に従って、アクション名のビューを描画します。オンラインベーカリーの例に戻りますが、
RecipesController は `view()` ・ `share()` ・ `search()` アクションを持つかもしれません。
このコントローラーは **src/Controller/RecipesController.php** にあり、
次のようなコードになっています。 :

``` php
// src/Controller/RecipesController.php

class RecipesController extends AppController
{
    public function view($id)
    {
        // アクションの処理をここで行います。
    }

    public function share($customerId, $recipeId)
    {
        // アクションの処理をここで行います。
    }

    public function search($query)
    {
        // アクションの処理をここで行います。
    }
}
```

これらのアクションのテンプレートファイルは **templates/Recipes/view.php** 、
**templates/Recipes/share.php** 、そして **templates/Recipes/search.php** になります。
規約に従ったビューのファイル名は、アクション名を小文字にしてアンダースコアーでつないだものです。

通常、コントローラーのアクションは `View` クラスがビュー層の描画で使う
コンテキストを作るために `~Controller::set()` を使います。
CakePHP の規約に従うと、手動でビューを描画したり生成したりする必要はありません。
代わりに、コントローラーのアクションが完了すると、CakePHP はビューの描画と送信をします。

もし何らかの理由でデフォルトの動作をスキップさせたければ、完全にレスポンスを作成して、
アクションから `Cake\Http\Response` オブジェクトを返すこともできます。

アプリケーションでコントローラーを効率的に使うために、CakePHP のコントローラーから提供される
いくつかのコアな属性やメソッドを説明しましょう。

## ビューとの相互作用

コントローラーはビューといくつかの方法でお互いに作用しあっています。最初に、コントローラーは
`Controller::set()` を使って、ビューにデータを渡すことができます。
コントローラーからどのビュークラスを使うか、どのビューを描画すべきか、を決めることもできます。

### ビュー変数の設定

`method` Cake\\Controller\\Controller::**set**(string $var, mixed $value)

`Controller::set()` メソッドはコントローラーからビューへデータを渡すための主な方法です。
`Controller::set()` を使った後は、その変数はビュー内でアクセスできるようになります。 :

``` php
// まずコントローラーからデータを渡します

$this->set('color', 'pink');

// すると、ビューでそのデータを利用できます
?>

You have selected <?= h($color) ?> icing for the cake.
```

`Controller::set()` メソッドは最初のパラメーターに連想配列も指定できます。
この方法はデータのかたまりを簡単にビューに割り当てる方法としてよく使われます。 :

``` php
$data = [
    'color' => 'pink',
    'type' => 'sugar',
    'base_price' => 23.95
];

// $color・$type および $base_price を作成し
// ビューで使用できるようになります

$this->set($data);
```

### ビューオプションの設定

もしビュークラスや、レイアウト／テンプレートのパス、
ビューの描画時に使われるヘルパーやテーマをカスタマイズしたければ、
ビルダーを得るために `viewBuilder()` メソッドを使います。
このビルダーは、ビューが作成される前にビューのプロパティーを設定するために使われます。 :

``` php
$this->viewBuilder()
    ->addHelper('MyCustom')
    ->setTheme('Modern')
    ->setClassName('Modern.Admin');
```

上記は、どのようにしてカスタムヘルパーを読み込み、テーマを設定し、
カスタムビュークラスを使用できるかを示しています。

### ビューの描画

`method` Cake\\Controller\\Controller::**render**(string $view, string $layout)

`Controller::render()` メソッドは各アクションの最後に自動的に呼ばれます。
このメソッドは (`Controller::set()` で渡したデータを使って)
すべてのビューロジックを実行し、ビューを `View::$layout` 内に配置し、
エンドユーザーに表示します。

render に使用されるデフォルトのビューファイルは、規約によって決定されます。
RecipesController の `search()` アクションがリクエストされたら、
**templates/Recipes/search.php** のビューファイルが描画されます。 :

``` php
namespace App\Controller;

class RecipesController extends AppController
{
// ...
    public function search()
    {
        // templates/Recipes/search.php のビューを描画します
        return $this->render();
    }
// ...
}
```

CakePHP は (`$this->autoRender` に `false` をセットしない限り) アクションの後に
自動的に描画メソッドを呼び出しますが、 `Controller::render()` メソッドの第一引数に
ビュー名を指定することで、別のビューファイルを指定することができます。

`$view` が '/' で始まっていれば、ビューまたはエレメントのファイルが **src/Template**
フォルダーからの相対パスであると見なします。これはエレメントを直接描画することができ、
AJAX 呼び出しではとても有用です。 :

``` php
// templates/element/ajaxreturn.php のエレメントを描画します
$this->render('/element/ajaxreturn');
```

`Controller::render()` の第二引数 `$layout`
はビューが描画されるレイアウトを指定することができます。

#### 特定のテンプレートの描画

コントローラーで、規約に従ったものではなく、別のビューを描画したいことがあるかもしれません。
これは `Controller::render()` を直接呼び出すことで可能です。一度 `Controller::render()`
を呼び出すと、CakePHP は再度ビューを描画することはありません。 :

``` php
namespace App\Controller;

class PostsController extends AppController
{
    public function my_action()
    {
        return $this->render('custom_file');
    }
}
```

これは **templates/Posts/my_action.php** の代わりに
**templates/Posts/custom_file.php** を描画します。

また、次のような書式で、プラグイン内のビューを描画することもできます。
`$this->render('PluginName.PluginController/custom_file')` 。
例:

``` php
namespace App\Controller;

class PostsController extends AppController
{
    public function myAction()
    {
        return $this->render('Users.UserDetails/custom_file');
    }
}
```

これは **plugins/Users/templates/UserDetails/custom_file.php** を描画します。

## コンテンツタイプのネゴシエーション

`method` Cake\\Controller\\Controller::**viewClasses**()

コントローラーは、サポートするビュークラスの一覧を定義することができます。
コントローラーのアクションが完了すると、 CakePHP はビューリストを使用して
content-typeのネゴシエーション（コンテントタイプの取り決め）を実行します。
これにより、アプリケーションは同じコントローラーアクションを再利用してHTML ビューをレンダリングしたり
JSONやXML のレスポンスをレンダリングしたりすることができるようになります。
コントローラーにサポートするビュークラスのリストを定義するには、 `viewClasses()` メソッドを使用します。:

``` php
namespace App\Controller;

use Cake\View\JsonView;
use Cake\View\XmlView;

class PostsController extends AppController
{
    public function viewClasses()
    {
        return [JsonView::class, XmlView::class];
    }
}
```

アプリケーションの `View` クラスは、リクエストの `Accept` ヘッダーやルーティング拡張機能に基づいて、
他のビューを選択できない場合に自動的にフォールバックとして使用されます。
もしアプリケーションが異なるレスポンスフォーマットに対して異なるロジックを実行する必要がある場合は、
`$this->request->is()` を使用して、必要な条件ロジックを構築することができます。

> [!NOTE]
> ビュークラスがcontent-typeのネゴシエーションに参加するには、
> 静的な `contentType()` フックメソッドを実装する必要があります。

## コンテンツタイプネゴシエーションのフォールバック

リクエストのコンテントタイプの設定にマッチする View がない場合、
CakePHP はベースとなる `View` クラスを使用します。
もし、content-typeのネゴシエーションを要求したい場合は、
406ステータスコードを設定する `NegotiationRequiredView` を使用します。:

``` php
public function viewClasses()
{
    // Acceptヘッダーのネゴシエーションを要求するか、406のレスポンスを返します。
    return [JsonView::class, NegotiationRequiredView::class];
}
```

`TYPE_MATCH_ALL` のコンテンツタイプ値を使用して、独自のフォールバックビューロジックを構築することができます:

``` php
namespace App\View;

use Cake\View\View;

class CustomFallbackView extends View
{
    public static function contentType(): string
    {
        return static::TYPE_MATCH_ALL;
    }

}
```

match-allビューは、content-typeのネゴシエーションが試みられた *後で*
のみ適用されることを覚えておくことが重要です。

## 他のページへのリダイレクト

`method` Cake\\Controller\\Controller::**redirect**(string|array $url, integer $status)

もっともよく使う、フロー制御のメソッドは `Controller::redirect()` です。
このメソッドは最初の引数に、CakePHP の相対 URL を受け取ります。
ユーザーが正常に注文を出した時、レシート画面にリダイレクトさせたいかもしれません。 :

``` php
public function place_order()
{
    // 注文終了のためのロジック
    if ($success) {
        return $this->redirect(
            ['controller' => 'Orders', 'action' => 'thanks']
        );
    }

    return $this->redirect(
        ['controller' => 'Orders', 'action' => 'confirm']
    );
}
```

このメソッドは適切なヘッダーが設定されたレスポンスのインスタンスを返します。
ビューの描画を抑制し、ディスパッチャーが実際にリダイレクトを行えるようにするために
このレスポンスのインスタンスを return すべきです。

\$url 引数に相対 URL または絶対 URL を指定することもできます。 :

``` php
return $this->redirect('/orders/thanks');

return $this->redirect('http://www.example.com');
```

アクションにデータを渡すこともできます。 :

``` php
return $this->redirect(['action' => 'edit', $id]);
```

`Controller::redirect()` の第二引数では、リダイレクトに伴う
HTTP ステータスコードを定義することができます。リダイレクトの性質によっては、
301 (moved parmanently) または 303 (see other) を使ったほうが良いでしょう。

リファラーのページにリダイレクトする必要があれば、次のようにできます。 :

``` php
return $this->redirect($this->referer());
```

クエリー文字列とハッシュを使う例は次のようになります。 :

``` php
return $this->redirect([
    'controller' => 'Orders',
    'action' => 'confirm',
    $order->id,
    '?' => [
        'product' => 'pizza',
        'quantity' => 5
    ],
    '#' => 'top'
]);
```

生成される URL はこのようになります。 :

    http://www.example.com/orders/confirm?product=pizza&quantity=5#top

### 同じコントローラーの他のアクションへの転送

`method` Cake\\Controller\\Controller::**setAction**($action, $args...)

もし、現在のアクションを *同じ* コントローラーの異なるアクションにフォワードする必要があれば、
リクエストオブジェクトを更新し、描画されるビューテンプレートを変更し、そして
指定のアクションに実行をフォワードするために `Controller::setAction()` を使用します。 :

``` php
// delete アクションから、更新後の一覧ページを描画することができます。
$this->setAction('index');
```

## 追加のモデル読み込み

`method` Cake\\Controller\\Controller::**loadModel**(string $modelClass, string $type)

`loadModel` 関数は、コントローラーのデフォルト以外のモデルを使う必要がある時に便利です。 :

``` php
// コントローラーのメソッドの中で。
$this->loadModel('Articles');
$recentArticles = $this->Articles->find('all', [
    'limit' => 5,
    'order' => 'Articles.created DESC'
]);
```

もしも組み込み ORM 以外のテーブルプロバイダーを使いたければ、
ファクトリーメソッドに接続することで、そのテーブルシステムを
CakePHP のコントローラーに紐づけることができます。 :

``` php
// コントローラーのメソッドの中で。
$this->modelFactory(
    'ElasticIndex',
    ['ElasticIndexes', 'factory']
);
```

テーブルファクトリーを登録した後は、インスタンスを読み出すために
`loadModel` を使うことができます。 :

``` php
// コントローラーのメソッドの中で。
$this->loadModel('Locations', 'ElasticIndex');
```

> [!NOTE]
> 組み込みの ORM の TableRegistry は既定では 'Table' プロバイダーとして
> 接続されています。

## モデルのページネーション

`method` Cake\\Controller\\Controller::**paginate**()

このメソッドはモデルから取得した結果をページ分けするために使われます。
ページサイズやモデルの検索条件などを指定できます。
<span class="title-ref">paginate()</span> のより詳しい使い方は [ページネーション](controllers/pagination)
の章を参照してください。

`$paginate` 属性は `paginate()` がどうふるまうかを簡単にカスタマイズする方法を提供します。 :

``` php
class ArticlesController extends AppController
{
    public $paginate = [
        'Articles' => [
            'conditions' => ['published' => 1]
        ]
    ];
}
```

## コンポーネント読み込みの設定

`method` Cake\\Controller\\Controller::**loadComponent**($name, $config = [])

コントローラーの `initialize()` メソッドの中で、読み込みたいコンポーネントや、
その設定データを定義することができます。 :

``` php
public function initialize(): void
{
    parent::initialize();
    $this->loadComponent('Csrf');
    $this->loadComponent('Comments', Configure::read('Comments'));
}
```

コントローラーの `$components` プロパティーでは、コンポーネントの設定ができます。
設定されたコンポーネントとそれに依存するコンポーネントは CakePHP によって構築されます。
より詳しい情報は [Configuring Components](controllers/components#configuring-components) の章を参照してください。先に述べたように、
`$components` プロパティーはコントローラーの各親クラスで定義されたプロパティーとマージされます。

## ヘルパー読み込みの設定

追加で利用する MVC クラスをどうやって
CakePHP のコントローラーに伝えるのかを見てみましょう。 :

``` php
class RecipesController extends AppController
{
    public $helpers = ['Form'];
}
```

これらの変数はそれぞれ、継承された値とマージされます。したがって、たとえば
`FormHelper` を、あるいは `AppController` で宣言されている他のクラスを、
再度宣言する必要はありません。

::: info Deprecated in version 3.0
コントローラーからのヘルパーの読み込みは後方互換のために提供しています。 ヘルパーをどう読み込むかについては [Configuring Helpers](views/helpers#configuring-helpers) を参照してください。
:::

## リクエストライフサイクルコールバック

CakePHP のコントローラーはリクエストのライフサイクル周りにロジックを挿入できる
いくつかのイベント／コールバックを呼び出します。

### イベント一覧

- `Controller.initialize`
- `Controller.startup`
- `Controller.beforeRedirect`
- `Controller.beforeRender`
- `Controller.shutdown`

### コントローラーのコールバックメソッド

コントローラーでメソッドが実装されていれば、
既定では以下のコールバックメソッドが関連するイベントに接続されます。

`method` Cake\\Controller\\Controller::**beforeFilter**(EventInterface $event)

`method` Cake\\Controller\\Controller::**beforeRender**(EventInterface $event)

`method` Cake\\Controller\\Controller::**afterFilter**(EventInterface $event)

コントローラーのライフサイクルのコールバックに加えて、 [コンポーネント](controllers/components)
も似たようなコールバックの一式を提供します。

最良の結果を得るために、子コントローラーのコールバック中で
`AppController` のコールバックを呼ぶのを忘れないでください。 :

``` php
//use Cake\Event\EventInterface;
public function beforeFilter(EventInterface $event)
{
    parent::beforeFilter($event);
}
```

<a id="controller-middleware"></a>

## Controller Middleware

`method` Cake\\Controller\\Controller::**middleware**($middleware, array $options = [])

[Middleware](controllers/middleware) can be defined globally, in
a routing scope or within a controller. To define middleware for a specific
controller use the `middleware()` method from your controller's
`initialize()` method:

``` php
public function initialize(): void
{
    parent::initialize();

    $this->middleware(function ($request, $handler) {
        // Do middleware logic.

        // Make sure you return a response or call handle()
        return $handler->handle($request);
    });
}
```

Middleware defined by a controller will be called **before** `beforeFilter()` and action methods are called.

## コントローラーのより詳細

- [ページコントローラー](controllers/pages-controller)
- [コンポーネント](controllers/components)
