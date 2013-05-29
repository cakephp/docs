コントローラ
############

コントローラはMVCの'C'です。ルーティングが適用されて適切なコントローラが見つかった後、コントローラのアクションが呼ばれます。
コントローラはリクエストを解釈して操作し、適切なモデルが呼ばれるのを確認して、正しいレスポンスまたはビューを書き出します。
コントローラはモデルとビューの仲介者とみなすことが出来ます。
コントローラは薄くシンプルに、モデルを大きくしましょう。そうすれば、あなたの書いたコードは再利用しやすくなり、そして簡単にテスト出来るでしょう。

一般的に、コントローラは1つのモデルのロジックを管理するために使われます。
たとえば、Online Bakeryを構築しようとしている場合、レシピやその材料を管理するRecipesControllerとIngredientsControllerを作るでしょう。
CakePHPでは、主に操作するモデルにちなんで、コントローラの名前が付けられます。
コントローラは複数のモデルを扱う場合でも、問題なく動作します。

アプリケーションのコントローラは ``AppController`` クラスを継承し、そしてそれは :php:class:`Controller` クラスを継承しています。
AppControllerクラスは ``/app/Controller/AppController.php`` に定義し、アプリケーションのコントローラ全体で共有されるメソッドを含めるようにしましょう。

コントローラは *アクション* と呼ばれるいくつかのメソッドを提供します。
アクションはリクエストを操作するためのコントローラーのメソッドです。
デフォルトで、コントローラ上のすべてのpublicメソッドはアクションとなり、URLからアクセスが出来ます。
アクションはリクエストを解釈してレスポンスを返す役割があります。
普通、レスポンスは描画されたビューの形式となっていますが、同様のレスポンスを作成する方法は他にもあります。


.. _app-controller:

AppController
=============

冒頭で述べたように、AppControllerクラスはアプリケーションのすべてのコントローラの親クラスとなります。
AppControllerはそれ自身、CakePHPのコアライブラリに含まれるControllerクラスを継承しています。
AppControllerは ``/app/Controller/AppController.php`` に次のように定義されます。::

    class AppController extends Controller {
    }
    

AppControllerで作られたクラス変数とメソッドはアプリケーション中のすべてのコントローラで有効となります。
コントローラ共通のコードをAppControllerに書くのが理想的です。
コンポーネントは多くのコントローラ(必ずしもすべてのコントローラとは限りません)で使われるコードをまとめるのに使われます(コンポーネントについてはあとで学びます)

通常のオブジェクト指向の継承ルールが適用されていれば、CakePHPはコントローラにある特定の変数が指定された場合に、動作を拡張します。
コントローラで使用されるコンポーネントとヘルパーのリストは特別に扱われ、これらの変数はAppControllerの値と子コントローラの値でマージされます。
普通は子クラスの変数は、AppControllerの変数を上書きします。

.. note::

    CakePHPは、AppControllerとアプリケーションのコントローラとで、次の変数をマージします。:

    -  $components
    -  $helpers
    -  $uses

AppControllerで ``$helpers`` 変数を定義したら、デフォルトでHtmlヘルパーとFormヘルパーが追加されます。

また、子コントローラのコールバック中でAppControllerのコールバックを呼び出すのは、このようにするのがベストです。::

    public function beforeFilter() {
        parent::beforeFilter();
    }
 
リクエストパラメータ
====================

CakePHPアプリケーションにリクエストがあった時、CakePHPの :php:class:`Router` クラスと :php:class:`Dispatcher` クラスは適切なコントローラを見つけて、それを生成するために :ref:`routes-configuration` を使います。
リクエストデータはリクエストオブジェクトの中にカプセル化されています。
CakePHPは、すべての重要なリクエスト情報を ``$this->request`` プロパティにセットします。
CakePHPのリクエストオブジェクトについてのより詳しい情報は :ref:`cake-request` セクションを参照してください。

コントローラのアクション
========================

コントローラのアクションは、リクエストパラメータを、要求を送ってきたブラウザやユーザーに対するレスポンスに変換する役割があります。
CakePHPは規約に則ることで、このプロセスを自動化し、本来であればあなたが書かないといけないコードを省いてくれます。

CakePHPは規約に従って、アクション名のビューを描画します。
Online Bakeryのサンプルに戻ってみてみると、RecipesControllerは ``view()``, ``share()``, ``search()`` アクションが含まれています。
このコントローラは ``/app/Controller/RecipesController.php`` にあり、次のようなコードになっています。::

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

これらのアクションのビューは ``app/View/Recipes/view.ctp`` 、 ``app/View/Recipes/share.ctp`` 、 ``app/View/Recipes/search.ctp`` にあります。
規約に従ったビューのファイル名は、アクション名を小文字にしてアンダースコアでつないだものです。

通常、コントローラのアクションは :php:class:`View` クラスがビューを描画するために使うコンテキストを作るために :php:meth:`~Controller::set()` を使います。
CakePHPの規約があるので、手動でビューを描画したり生成したりする必要はありません。
コントローラのアクションが完了すると、CakePHPはビューの描画と送信をします。

もしデフォルトの動作をスキップさせたければ、次のテクニックを使えばビューを描画するデフォルトの動作をバイパスできます。

* コントローラのアクションから文字列もしくは文字列に変換可能なオブジェクトを返した場合、その文字列がレスポンスのボディとして使われます。
* レスポンスとして :php:class:`CakeResponse` を返すことが出来ます。

コントローラのメソッドが :php:meth:`~Controller::requestAction()` から呼ばれた時、文字列ではないデータを返したい場合があると思います。
もし通常のWebリクエストからもrequestActionからも呼ばれるコントローラのメソッドがあれば、値を返す前にリクエストタイプをチェックしましょう。::

    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipe->popular();
            if (!empty($this->request->params['requested'])) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

上記のコントローラのアクションは ``requestAction()`` と通常のリクエストとで、メソッドがどのように使われるかの例です。
requestActionではない通常のリクエストに配列のデータを戻り値として返せば、エラーの原因になるのでやめましょう。
``requestAction`` のより詳しい情報については :php:meth:`Controller::requestAction()` のセクションを参照してください。

アプリケーションでコントローラを効率的に使うために、CakePHPのコントローラから提供されるいくつかのコアな属性やメソッドを説明しましょう。

.. _controller-life-cycle:


リクエストライフサイクルコールバック
====================================

.. php:class:: Controller

CakePHPのコントローラは、リクエストのライフサイクル周りにロジックを挿入できるコールバック関数がついています。:

.. php:method:: beforeFilter()

    この関数はコントローラの各アクションの前に実行されます。
    アクティブセッションのチェックや、ユーザー権限の検査をするために役立ちます。

    .. note::

        beforeFilter()メソッドはアクションが存在しない場合やscaffoldアクションの場合でも呼ばれます。

.. php:method:: beforeRender()

    コントローラのアクションの後で、ビューが描画される前に呼ばれます。
    このコールバックはあまり使われませんが、アクションの最後でrender()を手動で呼び出した場合に使うことがあるかもしれません。

.. php:method:: afterFilter()

    コントローラのアクションの後で、描画が完了した後に呼ばれます。
    これはコントローラの最後に実行されるメソッドです。

コントローラのコールバックに加えて、 :doc:`/controllers/components` も同じようなコールバックを提供します。

.. _controller-methods:

コントローラのメソッド
======================

コントローラのメソッドとその説明については、CakePHP APIを確認してください。
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

ビューとの関係
--------------

コントローラはビューとお互いに影響しあっています。
最初に、コントローラは ``set()`` を使って、ビューにデータを渡すことが出来ます。
どのビュークラスを使うか、どのビューを描画すべきか、を決めることも出来ます。

.. php:method:: set(string $var, mixed $value)

    ``set()`` メソッドはコントローラからビューへデータを渡すための主な方法です。
    1度 ``set()`` を使えば、その変数はビュー内でアクセスできるようになります。::

        // まずコントローラからデータを渡します

        $this->set('color', 'pink');

        // すると、ビューでそのデータを利用できます
        ?>

        You have selected <?php echo $color; ?> icing for the cake.

    ``set()`` メソッドは最初のパラメータに連想配列も指定できます。
    この方法はデータのかたまりを簡単にビューに割り当てる方法としてよく使われます。

    .. versionchanged:: 1.3
        配列のキーは、ビューに渡される時に単語変化しなくなりました。
        ('underscored\_key' は 'underscoredKey' とはなりません):

    ::

        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );

        // ビューで$color, $type, $base_price の変数が使えるようになります

        $this->set($data);  


    ``$pageTitle`` という変数はもう存在しません。タイトルをセットするには ``set()`` を使ってください。::

        $this->set('title_for_layout', 'This is the page title');


.. php:method:: render(string $action, string $layout, string $file)

    ``render()`` メソッドは各アクションの最後に自動的に呼ばれます。
    このメソッドは(``set()`` を使って渡したデータを使って)すべてのビューロジックを実行し、ビューをレイアウト内に配置し、エンドユーザーに表示します。

    レンダリングに使用されるデフォルトのビューファイルは、規約によって決定されます。
    RecipesControllerの ``search()`` アクションがリクエストされたら、/app/View/Recipes/search.ctpのビューファイルが描画されます。::

        class RecipesController extends AppController {
        // ...
            public function search() {
                // /View/Recipes/search.ctpのビューが描画されます
                $this->render();
            }
        // ...
        }

    CakePHPは(``$this->autoRender`` にfalseをセットしない限り)アクションの後に自動的に描画メソッドを呼び出しますが、
    コントローラで ``$action`` にアクション名を指定することで、別のビューファイルを指定することが出来ます。

    ``$action`` が'/'で始まっていれば、 ``/app/View`` への相対パスでビューまたはエレメントを探そうとします。
    これはエレメントを直接描画することができ、Ajax呼び出しではとても有用です。::

        // /View/Elements/ajaxreturn.ctpのビューが描画されます
        $this->render('/Elements/ajaxreturn');

    また3つ目のパラメータ ``$file`` を使って別のビューまたはエレメントを指定することも出来ます。
    ``$layout`` パラメータはビューが描画されるレイアウトの指定が出来ます。

指定したビューを描画する
~~~~~~~~~~~~~~~~~~~~~~~~

コントローラでは、規約に従ったものではなく、別のビューを描画したことがあるかもしれません。
これは ``render()`` を直接呼び出すことで出来ます。
一度 ``render()`` を呼び出すと、CakePHPは再度ビューを描画することはありません。::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('custom_file');
        }
    }

これは ``app/View/Posts/my_action.ctp`` の代わりに ``app/View/Posts/custom_file.ctp`` を描画します。

フローコントロール
------------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    もっともよく使う、フローをコントロールするメソッドは ``redirect()`` です。
    このメソッドは最初の引数に、CakePHPの相対URLを指定します。
    ユーザーが正常に注文を出した時、領収画面にリダイレクトさせるとすると::

        public function place_order() {
            // 注文終了のためのロジック
            if ($success) {
                $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
            } else {
                $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
            }
        }

    $urlに相対URLまたは絶対URLを指定することも出来ます。::

        $this->redirect('/orders/thanks'));
        $this->redirect('http://www.example.com');

    アクションにデータを渡すこともできます。::

        $this->redirect(array('action' => 'edit', $id));

    ``redirect()`` の2つ目のパラメータは、リダイレクトに伴うHTTPステータスコードを定義することが出来ます。
    通常のリダイレクトに従って、301(moved parmanently)または303(see other)を使ったほうが良いでしょう。

    このメソッドは3つ目のパラメータに ``false`` を指定しない限りはリダイレクト後に ``exit()`` を呼び出します。

    リファラのページにリダイレクトする必要があれば、次のように出来ます。::

        $this->redirect($this->referer());

    このメソッドは名前付きパラメータもサポートしています。
    たとえば ``http://www.example.com/orders/confirm/product:pizza/quantity:5`` のようなURLにリダイレクトしたい場合、以下のように使います。::

        $this->redirect(array('controller' => 'orders', 'action' => 'confirm', 'product' => 'pizza', 'quantity' => 5));

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    ``redirect()`` のように、 ``flash()`` メソッドはある操作の後に、ユーザーを新しいページに誘導するために使われます。
    ``flash()`` メソッドはユーザーを別のURLへ移動させる前にメッセージを表示するという点において違いがあります。

    最初のパラメータは表示されるメッセージを指定し、2つ目のパラメータはCakePHPの相対URLとします。
    CakePHPはユーザーを転送する前に、 ``$pause`` 秒の間 ``$message`` を表示します。

    表示させたいメッセージの特定のテンプレートがあるなら、 ``$layout`` パラメータにそのレイアウト名を指定します。

    ページ内のflashメッセージについては、SessionComponentのsetFlash()メソッドを参照してください。

コールバック
------------

:ref:`controller-life-cycle` に加えて、CakePHPはscaffoldingに関連したコールバックもサポートしています。

.. php:method:: beforeScaffold($method)

    $methodは、たとえばindex, editなどの、呼び出されたメソッドの名前です。

.. php:method:: afterScaffoldSave($method)

    $methodは、editかupdateのどちらかの、呼び出されたメソッドの名前です。

.. php:method:: afterScaffoldSaveError($method)

    $methodは、editかupdateのどちらかの、呼び出されたメソッドの名前です。

.. php:method:: scaffoldError($method)

    $methodは、たとえばindex, editなどの、呼び出されたメソッドの名前です。

その他の便利なメソッド
----------------------

.. php:method:: constructClasses

    このメソッドはコントローラに必要とされるモデルをロードします。
    モデルをロードするプロセスは通常CakePHPによって行われますが、このメソッドは別の視点からコントローラにアクセスする時に便利です。
    コマンドラインスクリプトまたは何かしらの外部のプログラムをCakePHPで使う必要がある場合、constructClasses()が便利でしょう。

.. php:method:: referer(mixed $default = null, boolean $local = false)

    現在のリクエストに対するリファラURLを返します。
    ``$default`` パラメータは、HTTP\_REFERERがヘッダから読み取れなかった場合にデフォルトURLとして使うために指定します。
    つまり、このようにする代わりに::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    $this->redirect($this->referer());
                } else {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }

    このように出来ます。::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    ``$default`` がセットされていなければ、この関数はドメインのルート'/'をデフォルト値とします。

    ``$local`` パラメータに ``true`` をセットすれば、ローカルサーバーに対するリファラURLを制限します。

.. php:method:: disableCache

    ユーザーの使っている **ブラウザ** に対して、現在のリクエストをキャッシュしないように伝えるために使われます。
    これはビューキャッシュとは違います。ビューキャッシュについてはあとの章で説明します。

    これを使った時のヘッダは次のようなものを送ります。::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    POSTされたモデルのデータ(HtmlHelperに互換性のある入力からのデータ)をモデルのfind条件にセットするための形式に変換ためのメソッドです。
    この関数は、検索ロジックを構築する上でのショートカットとなります。
    たとえば管理権限のあるユーザーは、どの商品を出荷する必要があるのかを知るために、注文を検索出来たほうがよいでしょう。
    ここで、Orderモデルに基づくフォームを作るために、CakePHPの :php:class:`FormHelper` と :php:class:`HtmlHelper` を使えます。
    そうすると、コントローラのアクションはそのフォームからポストされたデータをfind条件を作るために使うことができます。::

        public function index() {
            $conditions = $this->postConditions($this->request->data);
            $orders = $this->Order->find('all', compact('conditions'));
            $this->set('orders', $orders);
        }

    ``$this->request->data['Order']['destination']`` が"Old Towne Bakery"であれば、postConditionsはその条件をModel->find()メソッドで使える配列に変換します。
    この場合は、 ``array('Order.destination' => 'Old Towne Bakery')`` という形になります。

    もし他のSQL演算子を使いたければ、それらの演算子を2つ目のパラメータに渡してください。::

        /*
        $this->request->dataは以下のような形式です。
        array(
            'Order' => array(
                'num_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // 'Ye Olde'を含んでいて、少なくとも4つの商品をもっている注文を探しましょう
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=', 
                'referrer' => 'LIKE'
            )
        );
        $orders = $this->Order->find('all', compact('conditions'));

    3つ目のパラメータは、条件の結合になにを使うのかを指定することが出来ます。
    'AND', 'OR', 'XOR'のような文字列です。

    最後のパラメータがtrueで、$opパラメータが配列であれば、$opに含まれていない項目は、この関数から返ってくる条件には含まれなくなります。

.. php:method:: paginate()

    このメソッドはモデルから取得した結果をページングするために使われます。
    ページサイズやモデルのfind条件などを指定出来ます。
    paginateのより詳しい使い方は :doc:`pagination <core-libraries/components/pagination>` セクションを参照してください。

.. php:method:: requestAction(string $url, array $options)

    この関数は任意の場所からコントローラのアクションを呼び出し、アクションからのデータを返します。
    ``$url`` には、CakePHPの相対URLを渡します(/controllername/actionname/params)。
    呼び出し先のコントローラのアクションに対して追加のデータを渡すためには、$options配列を指定してください。

    .. note::

        描画されたビューを取得するために、 ``requestAction($url, array('return'));`` というようにoptionsに 'return' を渡して ``requestAction()`` を使うことができます。
        注意してほしいのは、コントローラのメソッドからrequestActionで 'return' を使うと、scriptタグとcssタグが正しく動作しない原因となるということです。

    .. warning::

        ``requestAction`` をキャッシュせずに利用すると、パフォーマンスの低下につながります。
        コントローラやモデルで使用するのは稀です。

    ``requestAction`` は(キャッシュされた)エレメントと組み合わせてよく使われます。
    レンダリング前にエレメントに対してデータを取得するような場合です。
    レイアウトの中に"最新のコメント"のエレメントを配置するサンプルを使ってみましょう。
    まず、データを返すコントローラの関数を作ります。::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (empty($this->request->params['requested'])) {
                    throw new ForbiddenException();
                }
                return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            }
        }

    requestActionで実行したいメソッドは、実際に ``requestAction`` からリクエストが発せられているかどうかをチェックするべきです。
    そうしないと、そのメソッドはURLから直接からアクセスできるようになってしまいます。それは望ましくありません。

    上記の関数を呼ぶための簡単なエレメントを作ったら::

        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    どこか出力したい場所にさっきのエレメントを配置できます。::

        echo $this->element('latest_comments');

    ここに書かれた方法では、エレメントが描画されると毎回、データを取得するためにコントローラに対してリクエストが作られ、データが処理されて結果が返ってきます。
    したがって、不必要な処理を防ぐためにエレメントのキャッシュを使うのが良いでしょう。::

        echo $this->element('latest_comments', array('cache' => '+1 hour'));

    ``requestAction`` の呼び出しはキャッシュされたエレメントのビューファイルが存在してそれが有効な限り、リクエストの発行はしません。

    加えて、requestActionはCakePHP形式のURL配列を引数に取ることが出来ます。::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    これは、requestActionの呼び出しが、パフォーマンスを向上できるRouter::urlの利用を避けることが出来ます。
    配列ベースのURLは次の1点を除いて :php:meth:`HtmlHelper::link()` で使うものと同じです。
    その違いは、名前付きパラメータやGETで渡されるパラメータを使う場合、それらを2つ目の引数に指定して、適切なキーでラップしなければならないということです。
    これは、requestActionが名前付きパラメータの配列(requestActionの2つ目の引数)をController::params配列にマージして、名前付きパラメータに対して明示的に'named'というキーを付けないからです。
    ``$option`` 配列で指定した追加の値は、リクエストされたアクションのController::params配列の中で使えるようになります。::
        
        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    上記の場合、requestActionの配列は次のようになります。::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        配列のURLが文字列のURLと似ている他の部分とは異なり、requestActionはURLの扱い方が違います。

    requestAction()で配列のURLを使う時は、リクエストされるアクションにおいて必要となる **全て** のパラメータを指定しなければなりません。
    これは ``$this->request->data`` のようなパラメータも含まれます。
    必要な全てのパラメータを渡すことに加えて、名前付き及びGETパラメータも上記で見たように、2つ目の引数に指定しなければなりません。


.. php:method:: loadModel(string $modelClass, mixed $id)

    ``loadModel`` 関数は、コントローラのデフォルトモデルまたはそれに関連づいたモデル以外のモデルを使う必要がある時に便利です。::
    
        $this->loadModel('Article');
        $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

        $this->loadModel('User', 2);
        $user = $this->User->read();


コントローラ変数
================

コントローラの変数とその説明については、CakePHP APIを確認してください。
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

.. php:attr:: name

    ``$name`` 変数はコントローラ名がセットされます。
    通常これは、コントローラが使うメインのモデルの複数形となります。
    このプロパティは必須ではありません。::

        // $name変数の使い方のサンプル
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }
        

$componentsと$helpersと$uses
----------------------------

次に説明するコントローラの変数は、現在のコントローラの中でどのヘルパー、コンポーネント、モデルを使うのかをCakePHPに伝える役割をはたします。これらの変数はもっとも良く使われる変数です。
これらを使うことで、 ``$components`` や ``$uses`` で与えられたMVCクラスはコントローラの中でクラス変数として(例えば ``$this->ModelName``)、また ``$helpers`` で与えられたクラスはビューの中でオブジェクトへの参照として(例えば ``$this->{$helpername}``)有効になります。

.. note::

    それぞれのコントローラはデフォルトでこのようなクラスをいくつか持っていて、使える状態になっています。
    したがって、コントローラではすべてを設定する必要はありません。

.. php:attr:: uses

    コントローラはデフォルトで主要なモデルへアクセスできるようになっています。
    RecipesControllerは ``$this->Recipe`` でアクセスできるモデルクラスを持っており、ProductsControllerもまた ``$this->Product`` にProductモデルを持っています。
    しかし、 コントローラが ``$uses`` 変数に追加のモデルを指定して、それらが使えるようになっている時は、 ``$uses`` に現在のコントローラのモデルの名前も含めなければなりません。
    これについては、下の方のサンプルで説明します。

    コントローラでモデルを使いたくない場合は、 ``public $uses = array()`` とセットしてください。
    これでコントローラを使うのに対応するモデルファイルが必要なくなります。

.. php:attr:: helpers

    SessionComponentと同様に、Html、Form、Sessionヘルパーはデフォルトで有効になっています。
    しかし、AppControllerで ``$helpers`` を独自に定義している場合、 ``Html`` と ``Form`` をコントローラで有効にしたければ、それらを ``$helpers`` に含むようにしてください。
    このマニュアルの後ろにある、それぞれのセクションを確認して、これらのクラスについてよく詳しく学んでください。

    追加で利用するMVCクラス達をどうやってCakePHPのコントローラに伝えるのかを見てみましょう。::

        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    これらの変数はそれぞれ、継承された値とマージされます。
    したがって、たとえばFormヘルパーやAppControllerで宣言されている他のクラスを、再度宣言する必要はありません。

.. php:attr:: components

    components配列はコントローラで使う :doc:`/controllers/components` をセットします。
    ``$helpers`` や ``$uses`` のように、あなたのコントローラのコンポーネントは ``AppController`` のコンポーネントとマージされます。
    ``$helpers`` のように、componentsには設定を渡すことが出来ます。
    より詳しくは :ref:`configuring-components` を参照してください。

その他の変数
------------

コントローラの変数の詳細については、APIページで確認すれば、ここで説明した以外の他のコントローラ変数についてのセクションがあります。

.. php:attr: cacheAction

    cacheAction変数はフルページキャッシュの持続時間やその他の情報を定義するために使われます。
    フルページキャッシュについてのより詳しい情報は :php:class:`CacheHelper` のドキュメントを読んでください。

.. php:attr: paginate

    paginate変数は非推奨の互換性のあるプロパティです。
    この変数を使って、 :php:class:`PaginatorComponent` の読み込みと設定をします。
    次のように、コンポーネントの設定を使うように修正することが推奨されます。::

        class ArticlesController extends AppController {
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
        }

.. todo::

    この章は、コントローラのAPIとそのサンプルの量が少ないかもしれませんが、コントローラ変数は、最初からそれらを理解するのはとても難しいです。
    この章では、いくつかのサンプルと、またそれらサンプルで何をやっているか、などと一緒に学習を初めて行きましょう。

More on controllers
===================

.. toctree::

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=ja: Controllers
    :keywords lang=ja: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
