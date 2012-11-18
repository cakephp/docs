ビュー
######

ビュー(View) は MVC の **V**
です。ビューは、リクエストに必要とされる特定の出力の生成を担当します。これは、たいてい、HTML、XML、JSON
などの形式ですが、ストリーミングファイルやユーザがダウンロードできる PDF
の作成もビューの担当です。

ビューテンプレート
==================

CakePHP
ビューレイヤは、ユーザにどのように伝えるかということです。多くの場合、ビューはブラウザに
(X)HTML 文書を表示していますが、Flash オブジェクトに AMF
データを提供する必要もあるかもしれません。また、SOAP
を通してリモートアプリケーションに答えたり、ユーザ用の CSV
ファイルを出力したりするかもしれません。

CakePHP のビューファイルは、プレーン PHP
で記述され、デフォルトの拡張子は .ctp (CakePHP
テンプレート)です。このファイルには、あらゆる描画用のロジックを含みます。そのロジックはユーザに提供するために用意されている形式でコントローラから受け取ったデータを取得するために必要とされます。

ビューファイルは、/app/views/
に保存され、次にファイルを使用するコントローラの名前、その次にアクションの名前がきます。たとえば、Products
コントローラの "view()"
アクション用のビューファイルは通常、/app/views/products/view.ctp
にあります。

CakePHP
のビューレイヤは異なるパーツで構成されています。各パーツは使用方法が異なり、この章で説明されています:

-  **layouts**:
   プレゼンテーションのコードを含むビューファイル。アプリケーション内の多くのインターフェイスをラッピングしています。多くのビューは、layout
   の内部に描画されます。
-  **elements**: より小さく再利用可能なビューのコード。elements
   は通常ビューの内部に描画されます。
-  **helpers**:
   このクラスはビューレイヤ内のいたるところで必要とされるビューロジックを隠ぺいします。他のものと同様に、CakePHP
   のヘルパーを使用すると、フォームの構築、AJAX
   機能、ペジネートモデルデータ、RSS フィードの生成などに有用です。

レイアウト
==========

レイアウトはプレゼンテーションコードを含み、ビュー周りをラッピングします。どのビューを使ったときでも見たいものはレイアウトに置くべきです。

レイアウトファイルは、/app/views/layouts に置かれます。CakePHP
のデフォルトレイアウトは、/app/views/layouts/default.ctp
に新しいデフォルトレイアウトを作成することで上書きすることができます。新しいデフォルトレイアウトを作成すると、コントローラで指定されたビューが作るコードは、ページが描画される際に新しいデフォルトレイアウトの内部に配置されるようになります。

レイアウトを作成する際には、ビューのコードがどこに入るのかを CakePHP
に伝える必要があります。具体的には、レイアウトに $content\_for\_layout
を入れる場所を用意してください。(さらに、必要なら $title\_for\_layout
も。) デフォルトレイアウトはこんな感じになるでしょう:

::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title><?php echo $title_for_layout?></title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <!-- 外部ファイルやスクリプトをここで読み込む（詳細は HTML ヘルパーを参照） -->
    <?php echo $scripts_for_layout ?>
    </head>
    <body>

    <!-- すべてのビューで表示するための何らかのメニューがある場合、ここでそれを読み込む -->
    <div id="header">
        <div id="menu">...</div>
    </div>

    <!-- ここがビューを表示させたい場所 -->
    <?php echo $content_for_layout ?>

    <!-- 各表示ページにフッターを追加する -->
    <div id="footer">...</div>

    </body>
    </html>

``$scripts_for_layout`` は組み込みの HTML
ヘルパーを使用して外部のファイルやスクリプトを含みます。ビューから
javascript や CSS ファイルを読み込む際に役立ちます

``$html->css()`` または ``$javascript->link()``
をビューファイルで使用する際に、'in-line' 引数に 'false'
を指定してください。そうすると、\ ``$scripts_for_layout`` 内に HTML
ソースをおくことができます。（使用方法の詳細は API を見てください）

``$content_for_layout``
はビューを含みます。これはビューコードが置かれる場所です。

``$title_for_layout`` はページのタイトルを含みます。

レイアウトのタイトルを設定するには、コントローラで設定するのが最も簡単です。$title\_for\_layout
変数を使用します。

::

    <?php

    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
        }
    }
    ?>

好きなだけレイアウトを作成することができます: app/views/layouts
ディレクトリにそれを置くだけです。コントローラの $layout 変数あるいは
setLayout()
関数を使用してコントローラのアクション内で変更することができます。

たとえば、サイトの１つのセクションが小さな広告バナースペースを含んでいる場合、その小さな広告スペースをもつ新しいレイアウトを作成し、次のようにしてすべてのコントローラのアクションのレイアウトとして指定します:

var $layout = 'default\_small\_ad';

::

    <?php
    class UsersController extends AppController {
        function viewActive() {
            $this->set('title_for_layout', 'View Active Users');
            $this->layout = 'default_small_ad';
        }

        function viewImage() {
            $this->layout = 'image';
            // ユーザの画像を出力
        }
    }
    ?>

CakePHP は２つのコアレイアウト(CakePHP
のデフォルトレイアウトの近く)があります。アプリケーションでそれを使用できます:‘ajax’
と ‘flash’ です。ajax レイアウトは、ajax
レスポンスを作成する際に便利です - それは空のレイアウトです。（多くの
ajax
は完全に描画されたインターフェイスではなく、返り値としてマークアップのある部分だけを必要とします）flash
レイアウトはコントローラの flash()
メソッドで表示されるメッセージに使用されます。

３つの他のレイアウト、 xml・js・rss は、text/html
ではない内容をすばやく簡単に扱うために存在します。

エレメント
==========

多くのアプリケーションはプレゼンテーションコードの小さなブロックがあり、ページからページへと繰り返される必要があり、時にはレイアウト内の異なる場所で使用されます。CakePHP
は再利用する必要があるウェブサイトの部分を繰り返すことを助けてくれます。この再利用可能な部分は、エレメントと呼ばれます。広告、ヘルプボックス、ナビゲーション制御、特別メニュー、ログインフォーム、コールアウトなどは、エレメントとして
CakePHP
では実装されています。エレメントは基本的には小さなビューで、他のビューやレイアウト内でインクルードできます。また他のエレメント内でもインクルードできます。エレメントはビューをより読みやすくし、それ自身のファイル内にエレメントを繰り返し表示することもできます。アプリケーション内でコンテンツの断片を再利用することもできます。

エレメントは /app/views/elements/ フォルダにあります。また、.ctp
という拡張子をもちます。ビューの element
メソッドを使用して出力されます。

::

    <?php echo $this->element('helpbox'); ?>

変数をエレメントに渡す
----------------------

element の第2引数を通して、エレメントにデータを渡すことができます。

::

    <?php echo
    $this->element('helpbox', 
        array("helptext" => "Oh, this text is very helpful."));
    ?>

エレメントファイル内では、渡された全ての配列が、パラメータ配列のメンバーとして有効です(コントローラ内の
``set()``
がどのようにビューファイルに作用するかとほぼ同様です)。上記の例では、
/app/views/elements/helpbox.ctp ファイルは ``$helptext``
変数を使用できます。

::

    <?php
    echo $helptext; //outputs "Oh, this text is very helpful."
    ?>

``element()``
関数はエレメント用のオプションをエレメントに渡したデータと結合します。２つのオプションは、
'cache' と 'plugin' です。例えば次のようになります:

::

    <?php echo
    $this->element('helpbox', 
        array(
            "helptext" => "This is passed to the element as $helptext"
            "foobar" => "This is passed to the element as $foobar"
            "cache" => "+2 days" //sets the caching to +2 days.
            "plugin" => "" //to render an element from a plugin
        )
    );
    ?>

同じエレメントの、異なるバージョンのキャッシュを生成したい場合は、次のフォーマットでユニークなキャッシュキーを与えます。:

::

    <?php
    $this->element('helpbox',
        array(
            "cache" => array('time'=> "+7 days",'key'=>'unique value')
        )
    );
    ?>

``requestAction()``
を利用することで、エレメントの利点を最大限生かすことができます。\ ``requestAction()``
関数はコントローラのアクションからビュー変数を受け取り、配列として返します。こうすることで、エレメントを本当の
MVC
スタイルで実行することができます。エレメント用のビュー変数を準備するコントローラのアクションを作成し、次に、エレメントにコントローラからビュー変数を与えるために
``element()`` の第2引数内で ``requestAction()`` を呼び出します。

これを実行するには、次の Post
の例のように、コントローラ内で何か値を追加します。

::

    <?php
    class PostsController extends AppController {
        ...
        function index() {
            $posts = $this->paginate();
            if (isset($this->params['requested'])) {
                return $posts;
            } else {
                $this->set(compact('posts'));
            }
        }
    }
    ?>

また、エレメント内で、ページ付けされた post
モデルにアクセスできます。最新の5つの Post
をある順番で取得するために次のようにします::

::

    <h2>最新の投稿</h2>
    <?php $posts = $this->requestAction('posts/index/sort:created/order:asc/limit:5'); ?>
    <?php foreach($posts as $post): ?>
    <ol>
        <li><?php echo $post['Post']['title']; ?></li>
    </ol>
    <?php endforeach; ?>

エレメントをキャッシュする
--------------------------

キャッシュパラメータを指定した場合、CakePHP
のビューキャッシュの利点があります。true
に設定すると、１日キャッシュするでしょう。true
以外の場合は、期限を設定できます。期限の設定についての詳細は、\ `キャッシュ(Caching) </ja/view/1193/caching>`_
を見てください。

::

    <?php echo $this->element('helpbox', array('cache' => true)); ?>

ビュー内で１つ以上の同じエレメントを描画し、キャッシュが有効な場合、それぞれのタイミングで
'key'
パラメータに異なる名前をセットします。これはそれぞれの有効な呼び出しが、前回の
element()
呼び出しのキャッシュ結果を上書きするのを避けるためです。たとえば

::

    <?php
    echo $this->element('helpbox', array('cache' => array('key' => 'first_use', 'time' => '+1 day'), 'var' => $var));

    echo $this->element('helpbox', array('cache' => array('key' => 'second_use', 'time' => '+1 day'), 'var' => $differentVar));
    ?>

上記は両方のエレメントの結果が別にキャッシュされることを強調しています。

プラグインからエレメントを要求する
----------------------------------

プラグインを使用して、プラグイン内でエレメントを使用したい場合、プラグインパラメータを指定するだけです。ビューがプラグインコントローラ/アクションとして描画されている場合、自動的にプラグインに対してエレメントを向けます。エレメントはプラグイン内に存在しない場合、メインの
APP フォルダを探します。

::

    <?php echo $this->element('helpbox', array('plugin' => 'pluginname')); ?>

View methods
============

View methods are accessible in all view, element and layout files. To
call any view method use ``$this->method()``

set()
-----

``set(string $var, mixed $value)``

Views have a ``set()`` method that is analogous to the ``set()`` found
in Controller objects. It allows you to add variables to the
`viewVars <#>`_. Using set() from your view file will add the variables
to the layout and elements that will be rendered later. See
`Controller::set() </ja/view/977/Controller-Methods>`_ for more
information on using set().

In your view file you can do

::

        $this->set('activeMenuButton', 'posts');

Then in your layout the ``$activeMenuButton`` variable will be available
and contain the value 'posts'.

getVar()
--------

``getVar(string $var)``

Gets the value of the viewVar with the name $var

getVars()
---------

``getVars()``

Gets a list of all the available view variables in the current rendering
scope. Returns an array of variable names.

error()
-------

``error(int $code, string $name, string $message)``

Displays an error page to the user. Uses layouts/error.ctp to render the
page.

::

        $this->error(404, 'Not found', 'This page was not found, sorry');

This will render an error page with the title and messages specified.
Its important to note that script execution is not stopped by
``View::error()`` So you will have to stop code execution yourself if
you want to halt the script.

element()
---------

``element(string $elementPath, array $data, bool $loadHelpers)``

Renders an element or view partial. See the section on `View
Elements </ja/view/1081/Elements>`_ for more information and examples.

uuid
----

``uuid(string $object, mixed $url)``

Generates a unique non-random DOM ID for an object, based on the object
type and url. This method is often used by helpers that need to generate
unique DOM ID's for elements such as the AjaxHelper.

::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

addScript()
-----------

``addScript(string $name, string $content)``

Adds content to the internal scripts buffer. This buffer is made
available in the layout as ``$scripts_for_layout``. This method is
helpful when creating helpers that need to add javascript or css
directly to the layout. Keep in mind that scripts added from the layout,
or elements in the layout will not be added to ``$scripts_for_layout``.
This method is most often used from inside helpers, like the
`Javascript </ja/view/1450/Javascript>`_ and
`Html </ja/view/1434/HTML>`_ Helpers.

テーマ
======

テーマの利点は、素早く簡単にページのルック・アンド・フィールを変更できることです。

テーマを使用するためには、コントローラにデフォルトのビュークラスの代わりに
ThemeView クラスを使用するように設定する必要があります。

::

    class ExampleController extends AppController {
        var $view = 'Theme';
    }

どのテーマをデフォルトとして使用するか宣言するために、コントローラ内でテーマ名を指定します。

::

    class ExampleController extends AppController {
        var $view = 'Theme';
        var $theme = 'example';
    }

アクション内、あるいは ``beforeFilter`` または ``beforeRender``
コールバック関数内で、テーマ名を設定・変更することもできます。

::

    $this->theme = 'another_example';

テーマビューファイルは、 /app/views/themed/
フォルダ内に設置します。themed
フォルダ内では、テーマ名と同じ名前のフォルダを作成します。/app/views/themed/example/
フォルダより下の階層の構造は、 /app/views/ と全く同じです。

例えば、Posts コントローラの edit
アクション用のビューファイルは、/app/views/themed/example/posts/edit.ctp
に設置します。レイアウトファイルは、/app/views/themed/example/layouts/
に設置します。

ビューファイルがテーマ内に見つからない場合、CakePHP は /app/views/
フォルダ内のビューファイルを使用します。この方法で、マスターとなるビューファイルを作成し、それを個別にテーマフォルダのビューファイルで上書きする、ということが簡単に行えます。

テーマに指定している CSS あるいは JavaScript ファイルがある場合、webroot
内のテーマ用フォルダに保存することができます。たとえば、スタイルシートは
/app/webroot/themed/example/css/ に保存し、JavaScript ファイルは
/app/webroot/themed/example/js/ に保存します。

すべての CakePHP
の組み込みヘルパーはテーマを考慮し、自動的に正しいパスを生成します。ビューファイルと同じように、ファイルがテーマフォルダにない場合、メインの
webroot フォルダがデフォルトになります。

Increasing performance of plugin and theme assets
-------------------------------------------------

Its a well known fact that serving assets through PHP is guaranteed to
be slower than serving those assets without invoking PHP. And while the
core team has taken steps to make plugin and theme asset serving as fast
as possible, there may be situations where more performance is required.
In these situations its recommended that you either symlink or copy out
plugin/theme assets to directories in ``app/webroot`` with paths
matching those used by cakephp.

-  ``app/plugins/debug_kit/webroot/js/my_file.js`` becomes
   ``app/webroot/debug_kit/js/my_file.js``
-  ``app/views/themed/navy/webroot/css/navy.css`` becomes
   ``app/webroot/theme/navy/css/navy.css``

メディアビュー
==============

メディアビューを使用すると、ユーザにバイナリファイルを送信できます。たとえば、ユーザが直接そのファイルにリンクするのを避けるため、ファイルのディレクトリを
webroot の外に置きたいかもしれません。メディアビューを使用して、/app/
内の特別なフォルダからファイル取り出し、ファイルをユーザへ提供する前に認証をかけるといったことができます。

メディアビューを使用するために、コントローラにデフォルトのビュークラスの代わりにメディアビュークラスを使用するように設定する必要があります。その後で、ファイルが置かれている場所を指定するために追加の引数を渡すだけです。

::

    class ExampleController extends AppController {
        function download () {
            $this->view = 'Media';
            $params = array(
                  'id' => 'example.zip',
                  'name' => 'example',
                  'download' => true,
                  'extension' => 'zip',
                  'path' => 'files' . DS
           );
           $this->set($params);
        }
    }

+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| パラメータ   | 説明                                                                                                                                               |
+==============+====================================================================================================================================================+
| id           | ID はファイル拡張を含むファイルサーバ上に置く場合のファイル名です。                                                                                |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| name         | ユーザに送信するファイル名を指定します。ファイルの拡張子をつけずに指定します。                                                                     |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| download     | ダウンロードさせるためにヘッダを送信するかどうかを示すブール値。                                                                                   |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| extension    | ファイル拡張子。許可する MIME タイプの内部リストにマッチさせます。指定された MIME タイプがリスト内にない場合、ファイルはダウンロードされません。   |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| path         | 最後のディレクトリ区切りを含んだフォルダ名。パスは、APP フォルダからの相対パスです。                                                               |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+
| mimeType     | MediaView が内部的に保持している、受け付け許容 MIME タイプのリストにマージする、追加の MIME タイプの配列です。                                     |
+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------+

