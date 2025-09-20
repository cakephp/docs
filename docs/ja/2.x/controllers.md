# コントローラ

コントローラは MVC の 'C' です。ルーティングが適用されて適切なコントローラが見つかった後、
コントローラのアクションが呼ばれます。コントローラはリクエストを解釈して操作し、適切なモデルが
呼ばれるのを確認して、正しいレスポンスまたはビューを書き出します。コントローラはモデルとビューの
仲介者とみなすことが出来ます。コントローラは薄くシンプルに、モデルを大きくしましょう。
そうすれば、あなたの書いたコードは再利用しやすくなり、そして簡単にテスト出来るでしょう。

一般的に、コントローラは1つのモデルのロジックを管理するために使われます。
たとえば、オンラインベーカリーのサイトを構築しようとしている場合、レシピやその材料を管理する
RecipesController と IngredientsController を作るでしょう。
コントローラは複数のモデルを扱う場合でも問題なく動作しますが、CakePHP では
主に操作するモデルにちなんで、コントローラの名前が付けられます。

アプリケーションのコントローラは `AppController` クラスを継承し、そしてそれは
`Controller` クラスを継承しています。 `AppController` クラスは
`/app/Controller/AppController.php` に定義し、アプリケーションのコントローラ全体で
共有されるメソッドを含めるようにしましょう。

コントローラは、リクエストを操作するための *アクション* と呼ばれるいくつかのメソッドを提供します。
デフォルトで、コントローラ上のすべての public メソッドはアクションとなり、URL からアクセスが出来ます。
アクションはリクエストを解釈してレスポンスを返す役割があります。
普通、レスポンスは描画されたビューの形式となっていますが、同様のレスポンスを作成する方法は他にもあります。

<a id="app-controller"></a>

## AppController

冒頭で述べたように、 `AppController` クラスはアプリケーションのすべてのコントローラの
親クラスとなります。 `AppController` はそれ自身、CakePHP のコアライブラリに含まれる
`Controller` クラスを継承しています。
`AppController` は `/app/Controller/AppController.php` に次のように定義されます。 :

``` php
class AppController extends Controller {
}
```

`AppController` で作られたクラス変数とメソッドはアプリケーション中のすべてのコントローラで
有効となります。コントローラ共通のコードを `AppController` に書くのが理想的です。
コンポーネントは多くのコントローラ (必ずしもすべてのコントローラとは限りません) で使われるコードを
まとめるのに使われます (コンポーネントについてはあとで学びます)。

コントローラにある特定の変数が指定された場合には、CakePHP は通常のオブジェクト指向の継承ルールが
適用された上で、少し特別な動作をします。コントローラで使用されるコンポーネントとヘルパーは
特別に扱われます。この時、 `AppController` の配列の値と子コントローラの配列の値でマージされます。
常に子クラスの値が `AppController` の値を上書きします。

> [!NOTE]
> CakePHP は、 `AppController` とアプリケーションのコントローラとで、次の変数をマージします。
>
> - `~Controller::$components`
> - `~Controller::$helpers`
> - `~Controller::$uses`

`AppController` で `~Controller::$helpers` 変数を定義したら、デフォルトで
Html ヘルパーと Form ヘルパーが追加されます。

また、子コントローラのコールバック中で `AppController` のコールバックを呼び出すのは、
このようにするのがベストです。 :

``` php
public function beforeFilter() {
    parent::beforeFilter();
}
```

## リクエストパラメータ

CakePHP アプリケーションにリクエストがあった時、CakePHP の `Router` クラスと
`Dispatcher` クラスは適切なコントローラを見つけて、それを生成するために
[Routes Configuration](development/routing#routes-configuration) を使います。リクエストデータはリクエストオブジェクトの中に
カプセル化されています。CakePHP は、すべての重要なリクエスト情報を `$this->request`
プロパティにセットします。CakePHP のリクエストオブジェクトについてのより詳しい情報は
[Cake Request](controllers/request-response#cake-request) セクションを参照してください。

## コントローラのアクション

コントローラのアクションは、リクエストパラメータを、要求を送ってきたブラウザやユーザーに対する
レスポンスに変換する役割があります。CakePHP は規約に則ることで、このプロセスを自動化し、
本来であればあなたが書かなければならなかったコードを省いてくれます。

CakePHP は規約に従って、アクション名のビューを描画します。オンラインベーカリーのサンプルに
戻ってみてみると、 RecipesController は `view()`, `share()`, `search()` アクションが
含まれています。このコントローラは `/app/Controller/RecipesController.php` にあり、
次のようなコードになっています。 :

``` php
# /app/Controller/RecipesController.php

class RecipesController extends AppController {
    public function view($id) {
        //action logic goes here..
    }

    public function share($customerId, $recipeId) {
        //action logic goes here..
    }

    public function search($query) {
        //action logic goes here..
    }
}
```

これらのアクションのビューは `app/View/Recipes/view.ctp` 、
`app/View/Recipes/share.ctp` 、 `app/View/Recipes/search.ctp` にあります。
規約に従ったビューのファイル名は、アクション名を小文字にしてアンダースコアでつないだものです。

通常、コントローラのアクションは `View` クラスがビューを描画するために使うコンテキストを
作るために `~Controller::set()` を使います。CakePHP の規約に従うと、手動でビューを
描画したり生成したりする必要はありません。コントローラのアクションが完了すると、CakePHP はビューの
描画と送信をします。

もしデフォルトの動作をスキップさせたければ、次のテクニックを使えばビューを描画するデフォルトの動作を
バイパスできます。

- コントローラのアクションから文字列もしくは文字列に変換可能なオブジェクトを返した場合、
  その文字列がレスポンスのボディとして使われます。
- レスポンスとして `CakeResponse` を返すことが出来ます。

コントローラのメソッドが `~Controller::requestAction()` から呼ばれた時、
文字列ではないデータを返したい場合があると思います。もし通常のウェブのリクエストからも
requestAction からも呼ばれるコントローラのメソッドがあれば、値を返す前にリクエストタイプを
チェックしましょう。 :

``` php
class RecipesController extends AppController {
    public function popular() {
        $popular = $this->Recipe->popular();
        if (!empty($this->request->params['requested'])) {
            return $popular;
        }
        $this->set('popular', $popular);
    }
}
```

上記のコントローラのアクションは `~Controller::requestAction()` と
通常のリクエストとで、メソッドがどのように使われるかの例です。requestAction ではない
通常のリクエストに配列のデータを戻り値として返せば、エラーの原因になるのでやめましょう。
`~Controller::requestAction()` のより詳しい情報については
`~Controller::requestAction()` のセクションを参照してください。

アプリケーションでコントローラを効率的に使うために、CakePHP のコントローラから提供される
いくつかのコアな属性やメソッドを説明しましょう。

## リクエストライフサイクルコールバック

`class` **Controller**

CakePHP のコントローラは、リクエストのライフサイクル周りにロジックを挿入できる
コールバック関数がついています。

`method` Controller::**beforeFilter**()

`method` Controller::**beforeRender**()

`method` Controller::**afterFilter**()

コントローラのコールバックに加えて、 [コンポーネント](controllers/components) も同じようなコールバックを
提供します。

## コントローラのメソッド

コントローラのメソッドとその説明については、
[CakePHP API](https://api.cakephp.org/2.x/class-Controller.html) を確認してください。

### ビューとの関係

コントローラはビューとお互いに影響しあっています。最初に、コントローラは
`~Controller::set()` を使って、ビューにデータを渡すことが出来ます。
どのビュークラスを使うか、どのビューを描画すべきか、を決めることも出来ます。

`method` Controller::**set**(string $var, mixed $value)

`method` Controller::**render**(string $view, string $layout)

#### 指定したビューを描画する

コントローラでは、規約に従ったものではなく、別のビューを描画したことがあるかもしれません。
これは `~Controller::render()` を直接呼び出すことで出来ます。
一度 `~Controller::render()` を呼び出すと、
CakePHP は再度ビューを描画することはありません。 :

``` php
class PostsController extends AppController {
    public function my_action() {
        $this->render('custom_file');
    }
}
```

これは `app/View/Posts/my_action.ctp` の代わりに
`app/View/Posts/custom_file.ctp` を描画します。

また、次のような書式で、プラグイン内のビューを描画することもできます。
`$this->render('PluginName.PluginController/custom_file')`

例:

``` php
class PostsController extends AppController {
    public function my_action() {
        $this->render('Users.UserDetails/custom_file');
    }
}
```

これは `app/Plugin/Users/View/UserDetails/custom_file.ctp` を描画します。

### フローコントロール

`method` Controller::**redirect**(mixed $url, integer $status, boolean $exit)

`method` Controller::**flash**(string $message, string $url, integer $pause, string $layout)

### コールバック

[Controller Life Cycle](#controller-life-cycle) に加えて、CakePHP は scaffolding に関連したコールバックも
サポートしています。

`method` Controller::**beforeScaffold**($method)

`method` Controller::**afterScaffoldSave**($method)

`method` Controller::**afterScaffoldSaveError**($method)

`method` Controller::**scaffoldError**($method)

### その他の便利なメソッド

`method` Controller::**constructClasses**()

`method` Controller::**referer**(mixed $default = null, boolean $local = false)

`method` Controller::**disableCache**()

`method` Controller::**postConditions**(array $data, mixed $op, string $bool, boolean $exclusive)

`method` Controller::**paginate**()

`method` Controller::**requestAction**(string $url, array $options)

`method` Controller::**loadModel**(string $modelClass, mixed $id)

## コントローラ変数

コントローラの変数とその説明については、
[CakePHP API](https://api.cakephp.org/2.x/class-Controller.html) を確認してください。

> `~Controller::$name` 変数はコントローラ名がセットされます。
> 通常これは、コントローラが使うメインのモデルの複数形となります。
> このプロパティは必須ではありません。 :
>
> ``` php
> // $name 変数の使い方のサンプル
> class RecipesController extends AppController {
>    public $name = 'Recipes';
> }
> ```

### \$components と \$helpers と \$uses

次に説明するコントローラの変数は、現在のコントローラの中でどのヘルパー、コンポーネント、モデルを
使うのかを CakePHP に伝える役割をはたします。これらの変数はもっとも良く使われる変数です。
これらを使うことで、 `~Controller::$components` や `~Controller::$uses`
で与えられた MVC クラスはコントローラの中でクラス変数として (例えば `$this->ModelName`)、また
`~Controller::$helpers` で与えられたクラスはビューの中でオブジェクトへの参照として
(例えば `$this->{$helpername}`) 有効になります。

> [!NOTE]
> それぞれのコントローラはデフォルトでこのようなクラスをいくつか持っていて、使える状態になっています。
> したがって、コントローラではすべてを設定する必要はありません。
>
> コントローラはデフォルトで主要なモデルへアクセスできるようになっています。
> RecipesController は `$this->Recipe` でアクセスできるモデルクラスを持っており、
> ProductsController もまた `$this->Product` に Product モデルを持っています。
> しかし、 コントローラが `~Controller::$uses` 変数に追加のモデルを指定して、
> それらが使えるようになっている時は、 `~Controller::$uses` に現在のコントローラの
> モデルの名前も含めなければなりません。これについては、下の方のサンプルで説明します。
>
> コントローラでモデルを使いたくない場合は、 `public $uses = array()` とセットしてください。
> これでコントローラを使うのに対応するモデルファイルが必要なくなります。それでも、
> `AppController` で定義されたモデルはロードされます。`false` を使うことで、
> `AppController` で定義されていたとしてもモデルがロードされなくなります。
>
> ::: info Changed in version 2.1
> `~Controller::$uses` は新しい値を持ちます。それは、 `false` とは違った扱いになります。
> :::
>
> `SessionComponent` と同様に、`HtmlHelper` 、
> `FormHelper` 、`SessionHelper` はデフォルトで有効になっています。
> しかし、 `AppController` で `~Controller::$helpers` を独自に定義している場合、
> `HtmlHelper` と `FormHelper` をコントローラで有効にしたければ、
> それらを `~Controller::$helpers` に含むようにしてください。
> このマニュアルの後ろにある、それぞれのセクションを確認して、これらのクラスについて
> よく詳しく学んでください。
>
> 追加で利用する MVC クラス達をどうやって CakePHP のコントローラに伝えるのかを見てみましょう。 :
>
> ``` php
> class RecipesController extends AppController {
>     public $uses = array('Recipe', 'User');
>     public $helpers = array('Js');
>     public $components = array('RequestHandler');
> }
> ```
>
> これらの変数はそれぞれ、継承された値とマージされます。したがって、たとえば
> `FormHelper` や `AppController` で宣言されている他のクラスを、
> 再度宣言する必要はありません。
>
> components 配列はコントローラで使う [コンポーネント](controllers/components) をセットします。
> `~Controller::$helpers` や `~Controller::$uses` のように、
> あなたのコントローラのコンポーネントは `AppController` のコンポーネントとマージされます。
> `~Controller::$helpers` のように、`~Controller::$components`
> には設定を渡すことが出来ます。より詳しくは [Configuring Components](controllers/components#configuring-components) を参照してください。

### その他の変数

コントローラの変数の詳細については、 [API](https://api.cakephp.org) ページで確認すれば、
ここで説明した以外の他のコントローラ変数についてのセクションがあります。

> cacheAction 変数はフルページキャッシュの持続時間やその他の情報を定義するために使われます。
> フルページキャッシュについてのより詳しい情報は `CacheHelper` のドキュメントを
> 読んでください。
>
> paginate 変数は非推奨の互換性のあるプロパティです。
> この変数を使って、 `PaginatorComponent` の読み込みと設定をします。
> 次のように、コンポーネントの設定を使うように修正することが推奨されます。 :
>
> ``` php
> class ArticlesController extends AppController {
>     public $components = array(
>         'Paginator' => array(
>             'Article' => array(
>                 'conditions' => array('published' => 1)
>             )
>         )
>     );
> }
> ```

<div class="todo">

この章は、コントローラのAPIとそのサンプルの量が少ないかもしれませんが、コントローラ変数は、
最初からそれらを理解するのはとても難しいです。この章では、いくつかのサンプルと、
またそれらサンプルで何をやっているか、などと一緒に学習を初めて行きましょう。

</div>

## More on controllers

- [リクエストとレスポンスオブジェクト](controllers/request-response)
- [Scaffolding](controllers/scaffolding)
- [ページコントローラ](controllers/pages-controller)
- [コンポーネント](controllers/components)
