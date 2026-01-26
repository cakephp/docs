# CakePHP 2.1 の新機能

## モデル

### Model::saveAll(), Model::saveAssociated(), Model::validateAssociated()

`Model::saveAll()` とその仲間は、複数のモデルにわたって <span class="title-ref">fieldList</span> をサポートします。例:

``` php
$this->SomeModel->saveAll($data, array(
    'fieldList' => array(
        'SomeModel' => array('field_1'),
        'AssociatedModel' => array('field_2', 'field_3')
    )
));
```

`Model::saveAll()` とその仲間は、深さが無制限に保存できます。例:

``` php
$data = array(
    'Article' => array('title' => 'My first article'),
    'Comment' => array(
        array('body' => 'Comment 1', 'user_id' => 1),
        array(
            'body' => 'Save a new user as well',
            'User' => array('first' => 'mad', 'last' => 'coder')
        )
    ),
);
$this->SomeModel->saveAll($data, array('deep' => true));
```

## ビュー

### ビューブロック

ビューブロックは、そのブロックにカスタムコンテンツを提供する子ビュークラスやエレメントを
使えるようにすることで、コンテンツのスロットの挿入を可能にする仕組みです。

ブロックは、 `View` の `fetch` メソッドから呼ばれることで出力されます。
例えば、以下のように `View/Layouts/default.ctp` ファイル内に配置されます:

``` php
<?php echo $this->fetch('my_block'); ?>
```

上記の例は、もしブロックが利用可能であれば内容を表示し、未定義であれば空の文字列を表示します。

ブロックの内容を設定する方法は、いくつかあります。一番シンプルなデータ設定方法は、
`assign` を使用することです:

``` php
<?php $this->assign('my_block', 'Hello Block'); ?>
```

また、より複雑な内容は、以下のように取り込むことができます:

``` php
<?php $this->start('my_block'); ?>
    <h1>Hello Block!</h1>
    <p>This is a block of content</p>
    <p>Page title: <?php echo $title_for_layout; ?></p>
<?php $this->end(); ?>
```

ブロックの取り込みはネストもできます:

``` php
<?php $this->start('my_block'); ?>
    <h1>Hello Block!</h1>
    <p>This is a block of content</p>
    <?php $this->start('second_block'); ?>
        <p>Page title: <?php echo $title_for_layout; ?></p>
    <?php $this->end(); ?>
<?php $this->end(); ?>
```

### ThemeView

2.1 から、 `View` クラスの代わりに `ThemeView` を使用することは非推奨になります。
`ThemeView` は、今やスタブクラスです。

全てのテーマ固有のコードは `View` クラスに移動しました。つまり、 `View` クラスを継承したクラスは自動的にテーマをサポートするということです。以前はコントローラの `$viewClass` プロパティに `Theme` を設定していましたが、 今は、単に `$theme` プロパティを設定することでテーマが有効になります。例:

``` php
App::uses('Controller', 'Controller');

class AppController extends Controller {
    public $theme = 'Example';
}
```

2.0 にて `ThemeView` を継承した全てのビュークラスは、 `View` を継承すべきです。

### JsonView

JSON コンテンツを簡単に出力する新しいビュークラス。

以前は、 JSON レイアウト (`APP/View/Layouts/json/default.ctp`) と JSON を出力したいアクションそれぞれに対応するビューを作成する必要がありました。 これは `JsonView` で不要になります。

`JsonView` は、他のビュークラスと同様に、コントローラ上で定義することで使えます。例:

``` php
App::uses('Controller', 'Controller');

class AppController extends Controller {
    public $viewClass = 'Json';
}
```

コントローラに設定するならば、 `_serialize` ビュー変数を設定することにより、JSON としてシリアライズする内容を指定する必要があります。例:

``` php
$this->set(compact('users', 'posts', 'tags'));
$this->set('_serialize', array('users', 'posts'));
```

上記の例では、 以下のように `users` と `posts` 変数のみが JSON 出力としてシリアライズされます:

``` json
{"users": [...], "posts": [...]}
```

JSON データを表示するためのビューの `ctp` ファイルを作成する必要は無くなります。

もし必要であれば カスタムビュークラスが `JsonView` クラスを継承することで、
さらに出力のカスタマイズが可能になります。

下記の例では、結果が `{results: ... }` で囲まれます:

``` php
App::uses('JsonView', 'View');
class ResultsJsonView extends JsonView {
    public function render($view = null, $layout = null) {
        $result = parent::render($view, $layout);
        if (isset($this->viewVars['_serialize'])) {
            return json_encode(array('results' => json_decode($result)));
        }
        return $result;
    }
}
```

### XmlView

`JsonView` と似ています。 `XmlView` は、 出力する XML 中に
どの情報をシリアライズするかを示すために `_serialize` ビュー変数を設定する必要があります:

``` php
$this->set(compact('users', 'posts', 'tags'));
$this->set('_serialize', array('users', 'posts'));
```

上記の例では、以下のように `users` と `posts` 変数のみが XML 出力としてシリアライズされます:

``` html
<response><users>...</users><posts>...</posts></response>
```

XmlView は、 全てのシリアライズされた内容を囲むために　`response` ノードが追加されることに注意してください。

### 条件付きビューの描画

`CakeRequest` に HTTP キャッシュを制御するための正しい HTTP ヘッダーの設定を
容易にするための、新たにいくつかのメソッドが追加されました。HTTP キャッシュモデルの有効期限や
検証に使用するキャッシュ戦略を定義できます。 Cache-Control ディレクティブをよく調整し、
エンティティタグ (Etag) を設定し、 Last-Modified 時間を設定するなど他、
`CakeRequest` 内に特有のメソッドがあります。

それらのメソッドと、コントローラで `RequestHandlerComponent` を有効化することとを
組み合わせることで、レスポンスがすでにクライアントにキャッシュされているなら、コンポーネントが
自動的に判断し、ビューを描画する前に <span class="title-ref">304 Not Modified</span> ステータスコードを送信します。
ビューの描画処理をスキップすることは、CPU サイクルやメモリを節約します。 :

``` php
class ArticlesController extends AppController {
    public $components = array('RequestHandler');

    public function view($id) {
        $article = $this->Article->read(null, $id);
        $this->response->modified($article['Article']['modified']);
        $this->set(compact('article'));
    }
}
```

上記の例の中で、もしクライアントが <span class="title-ref">If-Modified-Since</span> ヘッダーを送信したなら、
ビューは表示されず、レスポンスは、304ステータスを返します。

## ヘルパー

`View` レイヤーの外で使用しやすくするために、 `TimeHelper` 、
`TextHelper` 、`NumberHelper` ヘルパーのメソッドは、
`CakeTime` 、 `String` 、 `CakeNumber`
クラスにそれぞれ移されました。

新しいユーティリティクラスを使う場合:

``` php
class AppController extends Controller {

    public function log($msg) {
        $msg .= String::truncate($msg, 100);
        parent::log($msg);
    }
}
```

例えば、 `Utility/MyAwasomeStringClass.php` のように `APP/Utility` フォルダに新たなクラスを作成して、 `engine` キー内に指定することで、デフォルトクラスを上書きすることができます:

``` php
// Utility/MyAwesomeStringClass.php
class MyAwesomeStringClass extends String {
    // my truncate is better than yours
    public static function truncate($text, $length = 100, $options = array()) {
        return null;
    }
}

// Controller/AppController.php
class AppController extends Controller {
    public $helpers = array(
        'Text' => array(
            'engine' => 'MyAwesomeStringClass',
            ),
        );
}
```

### HtmlHelper

新しい `HtmlHelper::media()` 関数は、 HTML5 の audio/video 要素を生成するために追加されました。
