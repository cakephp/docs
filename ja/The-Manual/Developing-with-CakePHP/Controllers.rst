コントローラ
############

 

はじめに
========

コントローラは、アプリケーションのロジック部分の管理に用いられます。たいていの場合、コントローラは、単一モデルのロジックの管理に使用されます。例えば、オンラインのパン屋のためのサイトを作っている場合には、RecipesController（レシピコントローラ）とIngredientsController（材料コントローラ）を作って、レシピと材料について管理することができます。CakePHPでは、コントローラ名は扱うモデルに基づいたものになり、複数形です。

Recipeモデルは、RecipesControllerによって扱われ、ProductモデルはProductsControllerによって扱われる、などです。

アプリケーションの各コントローラは、CakePHPのAppControllerクラスを継承しています。AppControllerは、CakePHPのライブラリのコアの重要な部分であるControllerクラスを継承しています。AppControllerクラスは、/app/app\_controller.phpに定義することができ、アプリケーション内のすべてのコントローラが共有して使えるメソッドを書き込んでおくことができます。

コントローラには、通常、\ *actions（アクション）*\ と呼ばれるメソッドをいくつでも書き込むことができます。アクションは、ビューを表示するために使用されるコントローラのメソッドです。アクションは、コントローラの中のひとつのメソッドのことです。

CakePHPのディスパッチャ（dispatcher）は、コントローラのアクションに対応しているURLが呼ばれた時にアクションを呼び出します（どういうふうにコントローラのアクションとパラメータがURLからマッピングされるかという説明は、\ `"Routesの設定" </ja/view/945/Routes-Configuration>`_\ を参照してください）。

オンラインのパン屋の例に戻ると、RecipesControllerの中には、\ ``view()``\ 、\ ``share()``\ 、\ ``search()``\ 、といったアクションが含まれているかもしれません。そのコントローラは、/app/controllers/recipes\_controller.phpという場所にあることになり、次のようなコードを含みます。

::

        <?php
        
        # /app/controllers/recipes_controller.php

        class RecipesController extends AppController {
            function view($id)     {
                //アクションのロジックがここに来ます。
            }

            function share($customer_id, $recipe_id) {
                //アクションのロジックがここに来ます。
            }

            function search($query) {
                //アクションのロジックがここに来ます。
            }
        }

        ?>

アプリケーション内でコントローラを効果的に使用するために、CakePHPのコントローラが提供しているコアの属性とメソッドについてまとめてみます。

App Controller
==============

まずはじめに、AppController
はアプリケーション中の全てのコントローラの親クラスであるということを理解してください。AppController
そのもの は、CakePHP コアライブラリの Controller
クラスを単純に拡張したものです。ですので、AppController は
/app/app\_controller.php で次のように定義します。

::

    <?php
    class AppController extends Controller {
    }
    ?>

AppController
で作成されたアトリビュートとメソッドは、アプリケーション中の全てのコントローラで使用することができます。そのため
AppController
は、全てのコントローラで共有するコードを作成する場所として理想的です。ただ、多くのコントローラで使うが全てのコントローラでは使わないというコードは、コンポーネントに書くのがベストでしょう。コンポーネントについては後で学びます。

オブジェクト指向における一般的な継承に加え、CakePHP
は、コントローラで使うコンポーネントやヘルパーといった特別なアトリビュートで、少し気の利いた動作をします。AppController
の変数配列が、子のコントローラクラスの配列とマージされるのです。

AppController とアプリケーションの各コントローラの変数のうち、CakePHP
がマージするものは次の通りです。

-  $components
-  $helpers
-  $uses

もしvar
$helpersをAppControllerで定義するのなら、忘れずにデフォルトとなっているHtmlヘルパとFormヘルパを追加してください。

また子コントローラのコールバックを使う場合、期待した動作をさせるためには、その中で
AppController のコールバックを呼び出す必要があることに留意してください。

::

    function beforeFilter(){
        parent::beforeFilter();
    }

Pages Controller
================

CakePHP での開発を開始するにあたり、はじめに目にする画面は Pages
コントローラ(cake/libs/controller/pages\_controller.php)
というデフォルトのコントローラによるものです。CakePHP
をインストールした後に見るホームページは、このコントローラによって生成されています。多くの場合、このコントローラは静的ページを作るために利用されます。例：app/views/pages/about\_us.ctp
にビューファイルを作成すると、 http://example.com/pages/about\_us という
URL でそれにアクセスできます。

もし CakePHP コンソールユーティリティを使ってアプリケーションを "bake"
したのであれば、app/controllers/ 中に Pages
コントローラがコピーされているので、必要に応じて編集してください。bake
していなくとも、コアから page\_controller.php
をコピーすることで同じ結果が得られます。

``cake``
フォルダのファイルを直接編集しないでください。これは、将来コアをアップデートする時に、問題が発生することを避けるためです。

コントローラの属性
==================

コントローラの属性の完全な一覧とその説明は、CakePHP API
を参照してください。\ `https://api.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_
にあります。

$name
-----

PHP4のユーザは、$name属性を使ってコントローラを定義するところからはじめてください。$name属性には、コントローラ名を設定します。通常、これはコントローラが使用する主要モデルの複数形になります。これにより、PHP4のクラス名の不思議な扱いに対応でき、CakePHPが名前を解決できるようにします。

::

    <?php

    #   $name controller attribute usage example

    class RecipesController extends AppController {
       var $name = 'Recipes';
    }

    ?>   

$components、$helpers、$uses
----------------------------

次によく使われるコントローラ属性は、CakePHPに現在のコントローラが、どんなヘルパー、コンポーネント、モデルを使用するのかを伝える属性です。\ ``$components``\ と\ ``$uses``\ で与えられるこれらの属性により、MVCの各クラスをコントローラのクラス変数として（例えば、\ ``$this->ModelName``
として）利用できるようになり、\ ``$helpers``\ で与えられるこれらの属性によりビューのオブジェクトリファレンス変数として(\ ``$helpername``)利用できるようになります。

各コントローラは、デフォルトでいくつかのクラスを利用できるようになっています。ですから、コントローラにまったく設定を追加しなくてよい場合もあります。

コントローラは、主要モデルにはデフォルトでアクセスできます。RecipesControllerは、デフォルトで、Recipeモデルに
``$this->Recipe`` という方法でアクセスでき、ProductsControllerも
``$this->Product``
という形でProductモデルを使うことができます。しかしながら、\ ``$uses``
変数でコントローラが他のモデルへアクセスできるようにする場合でも、現在のコントローラに対応するモデルは必ず含めておくべきです。後述する例は、この点も表現されています。

Html, Form, Session
ヘルパーは、デフォルトで利用することができます。しかしAppControllerで独自の$helpersを定義することを選んだ場合、\ ``Html``\ と\ ``Form``\ をコントローラのデフォルトとして利用できるようにするには、これらを確実に含めるようにしてください。これらのクラスに関する詳細は、マニュアルの後の章を参照してください。

CakePHP のコントローラに、使用する追加の MVC
クラスをどのように設定するのかを見てみましょう。

::

    <?php
    class RecipesController extends AppController {
        var $name = 'Recipes';

        var $uses = array('Recipe', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>   

これらの変数は継承した値とマージされるため、例えば Form ヘルパーや App
controller で宣言したものを、もう一度宣言する必要はありません。

コントローラでモデルを使いたくないのならば、\ ``var $uses = array()``\ としてください。これでコントローラに一致するモデルファイルを必要としないコントローラを使うことができるようになります。

単純に全てのモデルをコントローラの\ ``$uses``\ 配列に入れるのはバッドプラクティスです。適切に関連付けられたモデルや関連付けされていないモデルにアクセスする方法を見るには、\ `ここ <https://book.cakephp.org/ja/view/1040/Relationship-Types>`_\ と\ `ここ <https://book.cakephp.org/ja/view/992/loadModel#>`_\ をチェックしてください。

ページに関連した属性：$layoutと$pageTitle
-----------------------------------------

CakePHPのコントローラー内には、レイアウト（layout）の中にビューをどうセットするかを制御する属性が、いくつかあります。

``$layout`` 属性には、 /app/views/layouts
内に保存されているレイアウトの名前を設定できます。\ ``$layout``
の中に、レイアウトのファイル名から、 .ctp
という拡張子を除いたものを設定してください。この属性が定義されていない場合、CakePHPはデフォルトのレイアウト(default.ctp)を表示(render)します。/app/views/layouts/default.ctp
がない場合には、CakePHPのコアに含まれるデフォルトのレイアウトが表示されます。

::

    <?php

    //   $layout で他のレイアウトを使用するよう定義する

    class RecipesController extends AppController {
        function quickSave() {
            $this->layout = 'ajax';
        }
    }

    ?>

パラメータ属性（$params）
-------------------------

コントローラパラメータは、CakePHPコントローラ内で$this->paramsとして利用できます。この変数で、現在のリクエストに関する情報にアクセスできます。$this->paramsの使い方としては、POSTやGET操作でコントローラに渡された情報へのアクセスにいちばんよく使われます。

form
~~~~

``$this->params['form']``

``$_FILES``
内の情報も含めた、すべてのフォームからのすべてのPOSTデータがここに入ります。

admin
~~~~~

``$this->params['admin']``

現在のアクションを admin ルーティングを通して実行する場合、1
をセットします。

bare
~~~~

``$this->params['bare']``

現在のlayoutが空なら１、そうでなければ０が入ります。

isAjax
~~~~~~

``$this->params['isAjax']``

現在のリクエストが Ajax
によるものなら１、そうでなければ０が入ります。この変数は、コントローラで
RequestHandler コンポーネントが使用されている場合のみ、設定されます。

controller
~~~~~~~~~~

``$this->params['controller']``

リクエストを扱っている現在のコントローラ名が入ります。例えば、
/posts/view/1 がリクエストされた場合、 ``$this->params['controller']``
は"posts"になります。

action
~~~~~~

``$this->params['action']``

リクエストを扱っている現在のアクション名が入ります。例えば、
/posts/view/1 がリクエストされた場合、 ``$this->params['action']``
には"view"が入ります。

pass
~~~~

``$this->params['pass']``

アクションの後方にあるURLパラメータの数値添字配列を返します。

::

    // URL: /posts/view/12/print/narrow

    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
~~~

``$this->params['url']``

リクエストされた現在の URL が、GET
変数のキー-値のペアと共に入ります。。例えば、/posts/view/?var1=3&var2=4
という URL で呼ばれた場合、 ``$this->params['url']``
の中身は次のようになります。:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

FormHelper のフォームからコントローラに送られた、POST
データの取り扱いに用いられます。

::

    // The FormHelper is used to create a form element:
    $form->text('User.first_name');

表示されると次のようになります。:

::

     
    <input name="data[User][first_name]" value="" type="text" />

フォームがコントローラに POST で送信されると、データは ``this->data``
の中に入ります。

::

     
    //送信された first_name はここにあります。:
    $this->data['User']['first_name'];

prefix
~~~~~~

``$this->params['prefix']``

ルーティングのプリフィックスをセットします。たとえばこの属性はリクエストに文字列
"admin"を含む場合 /admin/posts/someaction にルーティングします。

named
~~~~~

``$this->params['named']``

/key:value/ という形式の URL
クエリの名前つきパラメータが全て格納されます。例えば、
/posts/view/var1:3/var2:4 という URL がリクエストされた場合、
``$this->params['named']`` は配列として保持されます:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

その他の属性
------------

APIの中にすべてのコントローラ属性の詳細があるのでそこを参照できますが、このマニュアルの中にも、他のコントローラの属性に関する説明がいくつかあります。

$cacheAction属性は、ビューのキャッシュに役立ちますし、$paginate属性は、コントローラのページネーション（ページ送り）のデフォルト動作を設定するのに使用されます。これらの属性の詳細については、このマニュアルの後の項目を参照してください。

persistModel
------------

保留。誰か更新してください！

コントローラが使うモデルのインスタンスのキャッシュを生成するために使われます。trueに設定されると、コントローラに関連する全てのモデルはキャッシュされるでしょう。これは多くのケースでパフォーマンスを向上させることができます。

コントローラのメソッド
======================

コントローラのメソッドの完全なリストとその説明は、CakePHPのAPIを参照してください。\ `http://api13.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_\ にあります。

ビューとの連携
--------------

set
~~~

``set(string $var, mixed $value)``

``set()``
メソッドは、コントローラからビューへデータを送るための主な方法です。\ ``set()``
を使うと、ビューでは、変数としてアクセスできます。

::

    <?php
        
    //First you pass data from the controller:

    $this->set('color', 'pink');

    //Then, in the view, you can utilize the data:
    ?>

    You have selected <?php echo $color; ?> icing for the cake.

``set()``
の第1引数に、連想配列として渡すこともできます。場合によっては、ビューに情報のセットを割り当てるのに簡単な方法になります。

配列のキーは、もうビューに割り当てる前に変換されることがないことに注意してください('underscored\_key'
は 'underscoredKey' にならない、等)。:

::

    <?php
        
    $data = array(
        'color' => 'pink',
        'type' => 'sugar',
        'base_price' => 23.95
    );

    //make $color, $type, and $base_price 
    //available to the view:

    $this->set($data);  

    ?>

``$pageTitle``\ 属性はもう存在しません。\ ``set()``\ を使ってタイトルを設定してください。

::

    <?php
    $this->set('title_for_layout', 'This is the page title');
    ?>

render
~~~~~~

``render(string $action, string $layout, string $file)``

``render()``
メソッドは、コントローラーのアクションの最後に自動的に呼ばれます。このメソッドは、\ ``set()``
メソッドでセットしたデータを使用してビューのロジックをすべて実行し、レイアウトの中にビューを設置し、エンドユーザーに返します。

render
によって使用されるデフォルトのビューファイルは、規約で定められています。例えば
RecipesController コントローラの ``search()``
アクションがリクエストされた場合、/app/views/recipes/search.ctp
にあるビューファイルが使用されます。

::

    class RecipesController extends AppController {
    ...
        function search() {
            // /views/recipes/search.ctp のビューファイルが描画される
            $this->render();
        }
    ...
    }

CakePHP はアクションのすべてのロジックの後に render() を
(``$this->autoRender`` が false でないとき) 自動的に呼びますが、
``$action``
引数を使ってコントローラのアクション名を指定することで別のビューファイルを代わりに使用することができます。

もし ``$action`` が '/' から始まっていた場合、\ ``/app/views``
からの相対パスで view または element
ファイルを指定していると認識されます。これにより elements
を直接レンダリングすることができるので、 Ajax
で呼び出す際とても便利です。

::

    // Render the element in /views/elements/ajaxreturn.ctp
    $this->render('/elements/ajaxreturn');

また、第3引数の ``$file``
で代わりのビューを指定することができます。\ ``$file``
引数を利用する時には、CakePHP のグローバル定数 (``VIEWS``
など）のいくつかを使用することを忘れないでください。

``$layout`` 引数は、ビューを表示するレイアウトを指定することができます。

Rendering a specific view
~~~~~~~~~~~~~~~~~~~~~~~~~

In your controller you may want to render a different view than what
would conventionally be done. You can do this by calling ``render()``
directly. Once you have called ``render()`` CakePHP will not try to
re-render the view.

::

    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

This would render ``app/views/posts/custom_file.ctp`` instead of
``app/views/posts/my_action.ctp``

フロー制御
----------

redirect
~~~~~~~~

``redirect(mixed $url, integer $status, boolean $exit)``

もっともよく使用するフロー制御のメソッドは、\ ``redirect()``\ です。このメソッドは、第1引数に
CakePHP 流の相対 URL を指定します。
ユーザーが首尾よく注文したとき、領収書の画面にリダイレクトさせたいかもしれません。

::

    <?php
        
    function placeOrder() {

        //ここは注文完了のロジック

        if($success) {
            $this->redirect('/orders/thanks');
        } else {
            $this->redirect('/orders/confirm');
        }
    }

    ?>

以下のように相対URLや絶対URLを$url引数に使うこともできます。

::

    $this->redirect('/orders/thanks'));
    $this->redirect('http://www.example.com');

以下のようにアクションにデータを渡すこともできます。

::

    $this->redirect(array('action' => 'edit', $id));

``redirect()``\ の第2引数は、リダイレクトの際の HTTP
ステータスコードを指定します。リダイレクトの状況によっては、 301
(永久的な移転)や 303 (see other) を指定したくなるかもしれません。

このメソッドは、第3引数に\ ``false``\ をセットしなければ、リダイレクト後に\ ``exit()``\ が実行されます。

もしリファラのページにリダイレクトしたいのなら、

::

    $this->redirect($this->referer());

とできます。

flash
~~~~~

``flash(string $message, string $url, integer $pause, string $layout)``

``redirect()``\ と同様に、\ ``flash()``\ メソッドも、何らかの操作を行った後に、ユーザへ新しいページを表示するために使います。\ ``flash()``\ メソッドは、別のURLへ移る前にメッセージを表示するところが異なります。

第1引数は、表示するメッセージです。そして、第2引数はCakePHP流の相対URLです。CakePHP
は、\ ``$pause``\ (第3引数) 秒間、\ ``$message``\ を表示します。

特有のフラッシュされるメッセージのテンプレートを使いたい場合、\ ``$layout``\ 引数にレイアウト名を指定してください。

ページ遷移後のメッセージ表示については、SessionComponent クラスの
setFlash() メソッドを参照ください。

コールバック
------------

CakePHP
のコントローラは、コールバックを使うとアクション実行の前後にロジックを挿入できます。

``beforeFilter()``

この関数は、コントローラにある全てのアクションの前に実行されます。
セッションやユーザ権限のチェックに便利です。

``beforeRender()``

コントローラのアクションロジックを実行した後に呼ばれます。ただし、ビューを表示する前です。このコールバックはあまり使われません。
しかし、アクションの途中、手動で render()
を読んだときなどに必要かもしれません。

``afterFilter()``

コントローラの全てのアクションの後、レンダリングが完了した後に呼ばれます。これはコントローラが実行する最後のメソッドになります。

CkakePHP は、scaffolding (足場組み)
に関連するコールバックもサポートします。

``_beforeScaffold($method)``

$method は、呼ばれたメソッド名。例えば「index, edit」 など。

``_afterScaffoldSave($method)``

$method は、edit か update いずれかのメソッド名。

``_afterScaffoldSaveError($method)``

$method は、edit か update いずれかのメソッド名。

``_scaffoldError($method)``

$method は、呼ばれたメソッド名。例えば「index, edit」 など。

その他の便利なメソッド
----------------------

constructClasses
~~~~~~~~~~~~~~~~

このメソッドは、コントローラに必要なモデルを読み込みます。通常、この読み込み処理は、CakePHP
によって行われます。しかし、このメソッドは、通常と異なる方法でコントローラにアクセスするとき、あると便利です。もし、コマンドラインスクリプトや、通常の利用以外に
CakePHP が必要な時、 constractClasses() が役に立つかもしれません。

referer
~~~~~~~

``string referer(mixed $default = null, boolean $local = false)``

カレントリクエストのリファラURLを返します。\ ``$default``\ 引数はヘッダからHTTP\_REFERERが読み取れなかったときの、デフォルトのURLを与えるために使います。なので、次のようにする代わりに、

::

    <?php
    class UserController extends AppController {
        function delete($id) {
            // ここに削除するためのコードがあって、それから
            if ($this->referer() != '/') {
                $this->redirect($this->referer());
            } else {
                $this->redirect(array('action' => 'index'));
            }
        }
    }
    ?>

次のようにできます。

::

    <?php
    class UserController extends AppController {
        function delete($id) {
            // ここに削除するためのコードがあって、それから
            $this->redirect($this->referer(array('action' => 'index')));
        }
    }
    ?>

もし\ ``$default``\ が設定されていなければ、ドメインのルートである'/'をデフォルトとします。

``$local``\ 引数を\ ``true``\ に指定すると、リファラとしてのURLをローカルサーバに限定します。

disableCache
~~~~~~~~~~~~

現在のリクエストの結果をキャッシュしないように、ユーザの\ **ブラウザ**\ に通知するのに利用してください。これは、あとの章で説明するビューのキャッシュとは違います。

これの影響によるヘッダーは以下のようになります。

``Expires: Mon, 26 Jul 1997 05:00:00 GMT``

``Last-Modified: [current datetime] GMT``

``Cache-Control: no-store, no-cache, must-revalidate``

``Cache-Control: post-check=0, pre-check=0``

``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $data, mixed $op, string $bool, boolean $exclusive)``

このメソッドを使用すると、POST
された一連のモデルのデータ(HTMLヘルパーと互換のある入力値)をモデルの
find
の条件に変換できます。この関数は、検索ロジックを素早く構築するためのショートカットです。たとえば、管理権限のあるユーザが、どの商品を出荷するべきかを知るために注文を検索できるようにしたい、という場合です。CakePHP
の Form ヘルパーや HTML ヘルパーを使用して、Order
モデルに基づいて素早くフォームを生成することができます。コントローラのアクションは、そのフォームから
POST されたデータを使用して find 条件を組み立てることができます。:

::

    function index() {
        $conditions=$this->postConditions($this->data);
        $orders = $this->Order->find("all",compact('conditions'));
        $this->set('orders', $orders);
    }

仮に $this->data[‘Order’][‘destination’] の値が “Old Towne Bakery”
と等しい場合、postConditions はその条件を配列に変換し、Model->find()
メソッドで使用できるようにします。この場合、array(“Order.destination” =>
“Old Towne Bakery”) のようになります。

もし条件において、別の SQL
演算子を使用したい場合、第2引数でそれを渡します。

::

    /*
    Contents of $this->data
    array(
        'Order' => array(
            'num_items' => '4',
            'referrer' => 'Ye Olde'
        )
    )
    */

    //Let’s get orders that have at least 4 items and contain ‘Ye Olde’
    $condtions=$this->postConditions(
        $this->data,
        array(
            'num_items' => '>=', 
            'referrer' => 'LIKE'
        )
    );
    $orders = $this->Order->find("all",compact('conditions'));

3番目の引数は、どの SQL 真偽値演算子を find 条件内で使用するかを CakePHP
に知らせます。‘AND’, ‘OR’, ‘XOR’ のような文字列はすべて有効な値です。

また、最後の引数に true をセットし、$op パラメータを配列にすると、$op
に含まれないフィールドは返される条件に含まれません。

paginate
~~~~~~~~

このメソッドを使用すると、モデルからペジネートする結果を取得します。ページサイズ・モデルの
find
条件などが指定できます。詳細やペジネートの使用方法については、\ `pagination </ja/view/164/pagination>`_
セクションを見てください。

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $options)``

この関数は、なんらかのロケーションを使用してコントローラのアクションを呼び出し、そのアクションの実行結果のデータを返します。\ ``$url``
に渡すのは CakePHP の相対 URL (/controllername/actionname/params)
です。受信コントローラのアクションに特別なデータを渡すには、 $options
配列に追加します。

オプションに 'return' を渡すことで ``requestAction()``
を使用して、完全にレンダリングされたビューを取得することができます。:
``requestAction($url, array('return'));``
重要な注意点として、コントローラから requestAction を 'return'
を用いて作成する場合、scriptとcssのタグがうまく動かないことがあります。

キャッシュを使わずに ``requestAction``
を使用すると、パフォーマンスが悪くなります。まれにコントローラやモデルで使用することが適切な場合があります。

``requestAction``
は（キャッシュされた）エレメントとともに使用されることが一番多いです。-
レンダリングする前にエレメント用のデータを取り出すために使用されるからです。レイアウト内で
"latest comments"
エレメントを設置する例を見てみましょう。初めにデータを返すコントローラの関数を作成する必要があります。

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
        }
    }

上記の関数を呼び出す簡単なエレメントを作成は次のように行います:

::

    // views/elements/latest_comments.ctp

    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

どこにでもエレメントを設置することができます。出力を取得して使用します:

::

    echo $this->element('latest_comments');

このように記述すると、エレメントがレンダリングされるときはいつでも、リクエストが生成されコントローラにデータが渡されます。データは処理されてから返されます。しかし、不必要な処理を防ぐためにエレメントのキャッシュを使用することが重要であることに注意してください。エレメントの呼び出しを変更することによって次のようになります。:

::

    echo $this->element('latest_comments', array('cache' => '+1 hour'));

``requestAction``
の呼び出しは、キャッシュされたエレメントのビューファイルが存在し有効である間は生成されなくなります。

さらに、requestAction は Cake 流儀の URL
に基づいた配列も扱えるようになりました。

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('return'));

これにより requestAction の呼び出しが Router::url
を使用しないため、パフォーマンス向上が図れます。URL
に基づいた配列は、一つの点を除き HtmlHelper::link
で使用する配列と同じです。もし名前つきの引数もしくはpassed引数を使用する場合は、これらを第二引数に正しいキーでラップして渡さなければなりません。これは、requestAction
が名前つきの変数を、Controller::params
にまとめるだけで、名前つきの変数を 'named' キーに位置づけないからです。

::

    echo $this->requestAction('/articles/featured/limit:3');
    echo $this->requestAction('/articles/view/5');

これらを requestAction へ配列で渡すには、次のようにします。:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('named' => array('limit' => 3)));
    echo $this->requestAction(array('controller' => 'articles', 'action' => 'view'), array('pass' => array(5)));

文字列の URL と類似した配列を利用するほかの場所と違い、requestAction
はこれらを異なるものとして扱います。

requestAction() に URL を配列で渡す場合、\ **全ての**
パラメータを要求するアクションに定義する必要があります。これには、\ ``$this->data``
と ``$this->params['form']``
を含みます。加えて全ての必要なパラメータを渡すには、namedとpassパラメータは上記で見られるような二つ目の配列で渡されている必要があります、

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

``loadModel``\ はコントローラのデフォルトのモデル、または関連付けられていないモデルを使う必要があるときに手軽なメソッドです。

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();

