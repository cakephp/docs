# ヘルパー

ヘルパーはアプリケーションのプレゼンテーション層のためのコンポーネントのようなクラスです。
多くのビューやエレメント、レイアウトで共有される表示ロジックを含んでいます。
この章ではヘルパーの作り方と CakePHP のコアヘルパーでできる基本的なタスクの概要を説明します。

CakePHP にはビューの作成に役立ついくつかの特徴的なヘルパーがあります。それらは、
整形式のマークアップ(フォーム含む)、テキスト、時間、数値の整形に役立ったり、
Ajax 機能をスピードアップさせたりします。CakePHP のヘルパーに関するさらなる情報は、
各ヘルパーの章をご覧ください。

<!--@include: ../core-libraries/toc-helpers.md-->
<!-- Include options: start-line: 11 -->

## ヘルパーの設定と使用

CakePHP でヘルパーを有効にするにはコントローラに認識させる必要があります。各コントローラは
`~Controller::$helpers` プロパティを持っており、そのプロパティにはビューで
利用できるヘルパーの一覧が保持されています。ビューでヘルパーを使用するにはヘルパーの名前を
コントローラの `$helpers` 配列に追加して下さい。 :

``` php
class BakeriesController extends AppController {
    public $helpers = array('Form', 'Html', 'Js', 'Time');
}
```

プラグインからヘルパーを追加するには CakePHP の様々な場所で使われている
`プラグイン記法` を使います。:

``` php
class BakeriesController extends AppController {
    public $helpers = array('Blog.Comment');
}
```

あるアクションの間だけヘルパーを追加することができます。言い換えると、あるヘルパーの利用を
特定のコントローラアクションに限定し、同じコントローラの他のアクションでは利用できないように
することができます。このことはコントローラが整理された状態を維持するのに役立つだけでなく、
さらに、ヘルパーを使わない他のアクションの処理コストを抑えることになります。 :

``` php
class BakeriesController extends AppController {
    public function bake() {
        $this->helpers[] = 'Time';
    }
    public function mix() {
        // ここに Time ヘルパーは読み込まれないので利用出来ません
    }
}
```

もしすべてのコントローラでヘルパーを有効にする必要がある場合ヘルパーの名前を
`/app/Controller/AppController.php` (見つからない場合は作成して下さい) の
`$helpers` 配列に追加して下さい。デフォルトの Html ヘルパーと Form ヘルパーも
忘れずに読み込んで下さい。 :

``` php
class AppController extends Controller {
    public $helpers = array('Form', 'Html', 'Js', 'Time');
}
```

ヘルパーにはオプションを渡すことが出来ます。このオプションは属性の値を設定したり、
ヘルパーの動作を変えるために使うことができます。 :

``` php
class AwesomeHelper extends AppHelper {
    public function __construct(View $view, $settings = array()) {
        parent::__construct($view, $settings);
        debug($settings);
    }
}

class AwesomeController extends AppController {
    public $helpers = array('Awesome' => array('option1' => 'value1'));
}
```

2.3 から、オプションはヘルパーの `Helper::$settings` プロパティにマージされます。

すべてのヘルパーで共通して使える設定に `className` オプションがあります。
このオプションを設定するとビューの中に別名のヘルパーを作ることができます。この機能は
`$this->Html` や他の共通ヘルパーの参照を独自の実装に置き換えたい時に役立ちます。 :

``` php
// app/Controller/PostsController.php
class PostsController extends AppController {
    public $helpers = array(
        'Html' => array(
            'className' => 'MyHtml'
        )
    );
}

// app/View/Helper/MyHtmlHelper.php
App::uses('HtmlHelper', 'View/Helper');
class MyHtmlHelper extends HtmlHelper {
    // コアHtmlHelperを上書きするためのコードを追加して下さい
}
```

上記の例ではビューの中で `MyHtmlHelper` が `$this->Html` の *別名* になっています。

> [!NOTE]
> 別名が付けられたヘルパーはどこで使われていたとしてもそのインスタンスを置き換えます。
> それには他のヘルパーの内部も含まれます。

ヘルパーを設定することで宣言的にヘルパーを設定することができるようになり、また、
コントローラアクションの外に設定のロジックを置けるようになります。もし、
クラス宣言の一部に含めることができない設定項目がある場合、コントローラの
beforeRender コールバックの中でそれらを設定することが出来ます。:

``` php
class PostsController extends AppController {
    public function beforeRender() {
        parent::beforeRender();
        $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
    }
}
```

## ヘルパーを使う

コントローラの中でどのヘルパーが使いたいのかを一度設定してしまえば、各ヘルパーは
ビューの中でパブリックプロパティのように扱えます。例えば `HtmlHelper` を
使っているとします。その場合、次のようにヘルパーにアクセスできます。 :

``` php
echo $this->Html->css('styles');
```

上記の例では HtmlHelper の `css` メソッドを呼び出しています。読み込み済みの
ヘルパーであれば `$this->{$helperName}` の形式でアクセスすることが出来ます。
ビューの内部から動的にヘルパーを読み込む必要に迫られる時が来るかもしません。
その時は、 ビューの `HelperCollection` を使ってこのようにできます。 :

``` php
$mediaHelper = $this->Helpers->load('Media', $mediaSettings);
```

HelperCollection は [コレクション](../core-libraries/collections) であり、
CakePHP の他の箇所でも使われているコレクション API をサポートしています。

## コールバックメソッド

ヘルパーはビューの描画工程を増やすようないくつかのコールバックを特徴としています。
さらに情報が欲しい場合は、 [Helper Api](#helper-api) と [コレクション](../core-libraries/collections)
ドキュメントを参照して下さい。

## ヘルパーを作る

もし、コアヘルパー (または GitHub や Bakery にあるヘルパー) でやりたいことが
できなかったとしても、ヘルパーを作るのは簡単なので大丈夫です。

ここで、アプリケーション内の様々な場所で必要とされる CSS スタイルのリンクを出力する
ヘルパーを作りたかったとしましょう。CakePHP の既存のヘルパーの構造にロジックを
あわせる為には、 `/app/View/Helper` に新しいクラスを作成する必要があります。
これから作るヘルパーを LinkHelper と呼ぶことにしましょう。実際の PHP クラスファイルは
このようになるでしょう。 :

``` php
/* /app/View/Helper/LinkHelper.php */
App::uses('AppHelper', 'View/Helper');

class LinkHelper extends AppHelper {
    public function makeEdit($title, $url) {
        // 特別に整形されたリンクを作るためのロジックはここ...
    }
}
```

> [!NOTE]
> ヘルパーは `AppHelper` または `Helper` を継承するか
> [Helper Api](#helper-api) で定義されているすべてのコールバックを実装しなければなりません。

### 他のヘルパーを読み込む

他のヘルパーに既に存在している機能を使いたいと思うかもしれません。その場合、 `$helpers`
配列に使いたいヘルパーを明示することで実現出来ます。フォーマットは、コントローラで
指定する場合と同じようにして下さい。 :

``` php
/* /app/View/Helper/LinkHelper.php (他のヘルパーを使っている) */
App::uses('AppHelper', 'View/Helper');

class LinkHelper extends AppHelper {
    public $helpers = array('Html');

    public function makeEdit($title, $url) {
        // 整形されたデータを出力するために
        // HTML ヘルパーを使う:

        $link = $this->Html->link($title, $url, array('class' => 'edit'));

        return '<div class="editOuter">' . $link . '</div>';
    }
}
```

### 自作のヘルパーを使う

一旦ヘルパーを作って `/app/View/Helper/` に配置すると、コントローラで
`~Controller::$helpers` という特別な変数を使うことでそのヘルパーを
読み込めるようになります。 :

``` php
class PostsController extends AppController {
    public $helpers = array('Link');
}
```

一旦コントローラがこの新しいクラスを認識すると、ヘルパーの名前にちなんで
名付けられたオブジェクトにアクセスすることで、ビューの中からこのヘルパーを
使えるようになります。 :

``` php
<!-- 新しいヘルパーを使ってリンクを作る -->
<?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>
```

## すべてのヘルパーのための機能を作成する

すべてのヘルパーは特別なクラス AppHelper を (モデルが AppModel を継承し、コントローラが
AppController を継承するのと同じように）継承します。すべてのヘルパーで利用できる機能を
作成するためには、 `/app/View/Helper/AppHelper.php` を作成して下さい。 :

``` php
App::uses('Helper', 'View');

class AppHelper extends Helper {
    public function customMethod() {
    }
}
```

## ヘルパー API

`class` **Helper**

`method` Helper::**webroot**($file)

`method` Helper::**url**($url, $full = false)

`method` Helper::**value**($options = array(), $field = null, $key = 'value')

`method` Helper::**domId**($options = null, $id = 'id')

### コールバック

`method` Helper::**beforeRenderFile**($viewFile)

`method` Helper::**afterRenderFile**($viewFile, $content)

`method` Helper::**beforeRender**($viewFile)

`method` Helper::**afterRender**($viewFile)

`method` Helper::**beforeLayout**($layoutFile)

`method` Helper::**afterLayout**($layoutFile)
