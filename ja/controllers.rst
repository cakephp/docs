コントローラ
############

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

アプリケーションのコントローラは ``AppController`` クラスを継承し、そしてそれは
:php:class:`Controller` クラスを継承しています。 ``AppController`` クラスは
``/app/Controller/AppController.php`` に定義し、アプリケーションのコントローラ全体で
共有されるメソッドを含めるようにしましょう。

コントローラは、リクエストを操作するための *アクション* と呼ばれるいくつかのメソッドを提供します。
デフォルトで、コントローラ上のすべての public メソッドはアクションとなり、URL からアクセスが出来ます。
アクションはリクエストを解釈してレスポンスを返す役割があります。
普通、レスポンスは描画されたビューの形式となっていますが、同様のレスポンスを作成する方法は他にもあります。


.. _app-controller:

AppController
=============

冒頭で述べたように、 ``AppController`` クラスはアプリケーションのすべてのコントローラの
親クラスとなります。 ``AppController`` はそれ自身、CakePHP のコアライブラリに含まれる
:php:class:`Controller` クラスを継承しています。
``AppController`` は ``/app/Controller/AppController.php`` に次のように定義されます。 ::

    class AppController extends Controller {
    }


``AppController`` で作られたクラス変数とメソッドはアプリケーション中のすべてのコントローラで
有効となります。コントローラ共通のコードを ``AppController`` に書くのが理想的です。
コンポーネントは多くのコントローラ (必ずしもすべてのコントローラとは限りません) で使われるコードを
まとめるのに使われます (コンポーネントについてはあとで学びます)。

コントローラにある特定の変数が指定された場合には、CakePHP は通常のオブジェクト指向の継承ルールが
適用された上で、少し特別な動作をします。コントローラで使用されるコンポーネントとヘルパーは
特別に扱われます。この時、 ``AppController`` の配列の値と子コントローラの配列の値でマージされます。
常に子クラスの値が ``AppController`` の値を上書きします。

.. note::

    CakePHP は、 ``AppController`` とアプリケーションのコントローラとで、次の変数をマージします。

    -  :php:attr:`~Controller::$components`
    -  :php:attr:`~Controller::$helpers`
    -  :php:attr:`~Controller::$uses`

``AppController`` で :php:attr:`~Controller::$helpers` 変数を定義したら、デフォルトで
Html ヘルパーと Form ヘルパーが追加されます。

また、子コントローラのコールバック中で ``AppController`` のコールバックを呼び出すのは、
このようにするのがベストです。 ::

    public function beforeFilter() {
        parent::beforeFilter();
    }

リクエストパラメータ
====================

CakePHP アプリケーションにリクエストがあった時、CakePHP の :php:class:`Router` クラスと
:php:class:`Dispatcher` クラスは適切なコントローラを見つけて、それを生成するために
:ref:`routes-configuration` を使います。リクエストデータはリクエストオブジェクトの中に
カプセル化されています。CakePHP は、すべての重要なリクエスト情報を ``$this->request``
プロパティにセットします。CakePHP のリクエストオブジェクトについてのより詳しい情報は
:ref:`cake-request` セクションを参照してください。

コントローラのアクション
========================

コントローラのアクションは、リクエストパラメータを、要求を送ってきたブラウザやユーザーに対する
レスポンスに変換する役割があります。CakePHP は規約に則ることで、このプロセスを自動化し、
本来であればあなたが書かなければならなかったコードを省いてくれます。

CakePHP は規約に従って、アクション名のビューを描画します。オンラインベーカリーのサンプルに
戻ってみてみると、 RecipesController は ``view()``, ``share()``, ``search()`` アクションが
含まれています。このコントローラは ``/app/Controller/RecipesController.php`` にあり、
次のようなコードになっています。 ::

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

これらのアクションのビューは ``app/View/Recipes/view.ctp`` 、
``app/View/Recipes/share.ctp`` 、 ``app/View/Recipes/search.ctp`` にあります。
規約に従ったビューのファイル名は、アクション名を小文字にしてアンダースコアでつないだものです。

通常、コントローラのアクションは :php:class:`View` クラスがビューを描画するために使うコンテキストを
作るために :php:meth:`~Controller::set()` を使います。CakePHP の規約に従うと、手動でビューを
描画したり生成したりする必要はありません。コントローラのアクションが完了すると、CakePHP はビューの
描画と送信をします。

もしデフォルトの動作をスキップさせたければ、次のテクニックを使えばビューを描画するデフォルトの動作を
バイパスできます。

* コントローラのアクションから文字列もしくは文字列に変換可能なオブジェクトを返した場合、
  その文字列がレスポンスのボディとして使われます。
* レスポンスとして :php:class:`CakeResponse` を返すことが出来ます。

コントローラのメソッドが :php:meth:`~Controller::requestAction()` から呼ばれた時、
文字列ではないデータを返したい場合があると思います。もし通常のウェブのリクエストからも
requestAction からも呼ばれるコントローラのメソッドがあれば、値を返す前にリクエストタイプを
チェックしましょう。 ::

    class RecipesController extends AppController {
        public function popular() {
            $popular = $this->Recipe->popular();
            if (!empty($this->request->params['requested'])) {
                return $popular;
            }
            $this->set('popular', $popular);
        }
    }

上記のコントローラのアクションは :php:meth:`~Controller::requestAction()` と
通常のリクエストとで、メソッドがどのように使われるかの例です。requestAction ではない
通常のリクエストに配列のデータを戻り値として返せば、エラーの原因になるのでやめましょう。
:php:meth:`~Controller::requestAction()` のより詳しい情報については
:php:meth:`~Controller::requestAction()` のセクションを参照してください。

アプリケーションでコントローラを効率的に使うために、CakePHP のコントローラから提供される
いくつかのコアな属性やメソッドを説明しましょう。

.. _controller-life-cycle:


リクエストライフサイクルコールバック
====================================

.. php:class:: Controller

CakePHP のコントローラは、リクエストのライフサイクル周りにロジックを挿入できる
コールバック関数がついています。

.. php:method:: beforeFilter()

    この関数はコントローラの各アクションの前に実行されます。
    アクティブセッションのチェックや、ユーザー権限の検査をするために役立ちます。

    .. note::

        beforeFilter() メソッドはアクションが存在しない場合や
        scaffold アクションの場合でも呼ばれます。

.. php:method:: beforeRender()

    コントローラのアクションの後で、ビューが描画される前に呼ばれます。
    このコールバックはあまり使われませんが、アクションの最後で
    :php:meth:`~Controller::render()` を手動で呼び出した場合に使うことがあるかもしれません。

.. php:method:: afterFilter()

    コントローラのアクションの後で、描画が完了した後に呼ばれます。
    これはコントローラの最後に実行されるメソッドです。

コントローラのコールバックに加えて、 :doc:`/controllers/components` も同じようなコールバックを
提供します。

.. _controller-methods:

コントローラのメソッド
======================

コントローラのメソッドとその説明については、
`CakePHP API <https://api.cakephp.org/2.x/class-Controller.html>`_ を確認してください。

ビューとの関係
--------------

コントローラはビューとお互いに影響しあっています。最初に、コントローラは
:php:meth:`~Controller::set()` を使って、ビューにデータを渡すことが出来ます。
どのビュークラスを使うか、どのビューを描画すべきか、を決めることも出来ます。

.. php:method:: set(string $var, mixed $value)

    :php:meth:`~Controller::set()` メソッドはコントローラからビューへデータを渡すための主な方法です。
    :php:meth:`~Controller::set()` を一度使えば、その変数はビュー内でアクセスできるようになります。 ::

        // まずコントローラからデータを渡します

        $this->set('color', 'pink');

        // すると、ビューでそのデータを利用できます
        ?>

        You have selected <?php echo $color; ?> icing for the cake.

    :php:meth:`~Controller::set()` メソッドは最初のパラメータに連想配列も指定できます。
    この方法はデータのかたまりを簡単にビューに割り当てる方法としてよく使われます。 ::

        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );

        // ビューで $color, $type, $base_price の変数が使えるようになります

        $this->set($data);


    ``$pageTitle`` という変数はもう存在しません。タイトルをセットするには
    :php:meth:`~Controller::set()` を使ってください。 ::

        $this->set('title_for_layout', 'This is the page title');

    バージョン 2.5 から $title_for_layout は非推奨です。代わりにビューブロックを使用してください。

.. php:method:: render(string $view, string $layout)

    :php:meth:`~Controller::render()` メソッドは各アクションの最後に自動的に呼ばれます。
    このメソッドは (:php:meth:`~Controller::set()` を使って渡したデータを使って)
    すべてのビューロジックを実行し、ビューを :php:attr:`~View::$layout` 内に配置し、
    エンドユーザーに表示します。

    レンダリングに使用されるデフォルトのビューファイルは、規約によって決定されます。
    RecipesController の ``search()`` アクションがリクエストされたら、
    /app/View/Recipes/search.ctp のビューファイルが描画されます。 ::

        class RecipesController extends AppController {
        // ...
            public function search() {
                // /View/Recipes/search.ctp のビューが描画されます
                $this->render();
            }
        // ...
        }

    CakePHP は (``$this->autoRender`` に false をセットしない限り) アクションの後に
    自動的に描画メソッドを呼び出しますが、コントローラで ``$view`` にビュー名を指定することで、
    別のビューファイルを指定することが出来ます。

    ``$view`` が '/' で始まっていれば、 ``/app/View`` への相対パスでビューまたはエレメントを
    探そうとします。これはエレメントを直接描画することができ、Ajax 呼び出しではとても有用です。 ::

        // /View/Elements/ajaxreturn.ctp のビューが描画されます
        $this->render('/Elements/ajaxreturn');

    :php:attr:`~View::$layout` パラメータはビューが描画されるレイアウトの指定が出来ます。

指定したビューを描画する
~~~~~~~~~~~~~~~~~~~~~~~~

コントローラでは、規約に従ったものではなく、別のビューを描画したことがあるかもしれません。
これは :php:meth:`~Controller::render()` を直接呼び出すことで出来ます。
一度 :php:meth:`~Controller::render()` を呼び出すと、
CakePHP は再度ビューを描画することはありません。 ::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('custom_file');
        }
    }

これは ``app/View/Posts/my_action.ctp`` の代わりに
``app/View/Posts/custom_file.ctp`` を描画します。

また、次のような書式で、プラグイン内のビューを描画することもできます。
``$this->render('PluginName.PluginController/custom_file')``

例::

    class PostsController extends AppController {
        public function my_action() {
            $this->render('Users.UserDetails/custom_file');
        }
    }

これは ``app/Plugin/Users/View/UserDetails/custom_file.ctp`` を描画します。

フローコントロール
------------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    もっともよく使う、フローをコントロールするメソッドは :php:meth:`~Controller::redirect()` です。
    このメソッドは最初の引数に、CakePHP の相対 URL を指定します。
    ユーザーが正常に注文を出した時、レシート画面にリダイレクトさせるとすると::

        public function place_order() {
            // 注文終了のためのロジック
            if ($success) {
                return $this->redirect(
                    array('controller' => 'orders', 'action' => 'thanks')
                );
            }
            return $this->redirect(
                array('controller' => 'orders', 'action' => 'confirm')
            );
        }

    $url に相対 URL または絶対 URL を指定することも出来ます。 ::

        $this->redirect('/orders/thanks');
        $this->redirect('http://www.example.com');

    アクションにデータを渡すこともできます。 ::

        $this->redirect(array('action' => 'edit', $id));

    :php:meth:`~Controller::redirect()` の2つ目のパラメータは、リダイレクトに伴う
    HTTP ステータスコードを定義することが出来ます。通常のリダイレクトに従って、
    301 (moved parmanently) または 303 (see other) を使ったほうが良いでしょう。

    このメソッドは3つ目のパラメータに ``false`` を指定しない限りはリダイレクト後に
    ``exit()`` を呼び出します。

    リファラのページにリダイレクトする必要があれば、次のように出来ます。 ::

        $this->redirect($this->referer());

    このメソッドは名前付きパラメータもサポートしています。
    たとえば ``http://www.example.com/orders/confirm/product:pizza/quantity:5``
    のような URL にリダイレクトしたい場合、以下のように使います。 ::

        $this->redirect(array(
            'controller' => 'orders',
            'action' => 'confirm',
            'product' => 'pizza',
            'quantity' => 5)
        );

    クエリ文字列とハッシュを使う場合は次のようになります。 ::

        $this->redirect(array(
            'controller' => 'orders',
            'action' => 'confirm',
            '?' => array(
                'product' => 'pizza',
                'quantity' => 5
            ),
            '#' => 'top')
        );

    生成される URL はこのようになります::

        http://www.example.com/orders/confirm?product=pizza&quantity=5#top

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    :php:meth:`~Controller::redirect()` のように、 :php:meth:`~Controller::flash()`
    メソッドはある操作の後に、ユーザーを新しいページに誘導するために使われます。
    :php:meth:`~Controller::flash()` メソッドはユーザーを別の URL へ移動させる前に
    メッセージを表示するという点において違いがあります。

    最初のパラメータは表示されるメッセージを指定し、2つ目のパラメータは CakePHP の相対 URL とします。
    CakePHP はユーザーを転送する前に、 ``$pause`` 秒の間 ``$message`` を表示します。

    表示させたいメッセージの特定のテンプレートがあるなら、 :php:attr:`~View::$layout`
    パラメータにそのレイアウト名を指定します。

    ページ内の flash メッセージについては、 :php:meth:`SessionComponent::setFlash()`
    メソッドを参照してください。

コールバック
------------

:ref:`controller-life-cycle` に加えて、CakePHP は scaffolding に関連したコールバックも
サポートしています。

.. php:method:: beforeScaffold($method)

    $method は、たとえば index, edit などの、呼び出されたメソッドの名前です。

.. php:method:: afterScaffoldSave($method)

    $method は、 edit か update のどちらかの、呼び出されたメソッドの名前です。

.. php:method:: afterScaffoldSaveError($method)

    $method は、 edit か update のどちらかの、呼び出されたメソッドの名前です。

.. php:method:: scaffoldError($method)

    $method は、たとえば index, edit などの、呼び出されたメソッドの名前です。

その他の便利なメソッド
----------------------

.. php:method:: constructClasses

    このメソッドはコントローラに必要とされるモデルをロードします。
    モデルをロードするプロセスは通常 CakePHP によって行われますが、
    このメソッドは別の視点からコントローラにアクセスする時に便利です。
    コマンドラインスクリプトまたは何かしらの外部のプログラムを CakePHP で使う必要がある場合、
    :php:meth:`~Controller::constructClasses()` が便利でしょう。

.. php:method:: referer(mixed $default = null, boolean $local = false)

    現在のリクエストに対するリファラ URL を返します。 ``$default`` パラメータは、
    HTTP\_REFERER がヘッダから読み取れなかった場合にデフォルト URL として使うために指定します。
    つまり、このようにする代わりに::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    return $this->redirect($this->referer());
                }
                return $this->redirect(array('action' => 'index'));
            }
        }

    このように出来ます。 ::

        class UserController extends AppController {
            public function delete($id) {
                // delete code goes here, and then...
                return $this->redirect(
                    $this->referer(array('action' => 'index'))
                );
            }
        }

    ``$default`` がセットされていなければ、この関数はドメインのルート
    '/' をデフォルト値とします。

    ``$local`` パラメータに ``true`` をセットすれば、ローカルサーバーに対するリファラ
    URL を制限します。

.. php:method:: disableCache

    ユーザーの使っている **ブラウザ** に対して、現在のリクエストをキャッシュしないように
    伝えるために使われます。これはビューキャッシュとは違います。ビューキャッシュについては
    あとの章で説明します。

    これを使った時のヘッダは次のようなものを送ります。 ::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    POST されたモデルのデータ (HtmlHelper に互換性のある入力からのデータ) をモデルの
    find 条件にセットするための形式に変換ためのメソッドです。この関数は、検索ロジックを
    構築する上でのショートカットとなります。たとえば管理権限のあるユーザーは、どの商品を
    出荷する必要があるのかを知るために、注文を検索出来たほうがよいでしょう。
    ここで、Order モデルに基づくフォームを作るために、CakePHP の :php:class:`FormHelper` と
    :php:class:`HtmlHelper` を使えます。そうすると、コントローラのアクションはそのフォームから
    ポストされたデータを find 条件を作るために使うことができます。 ::

        public function index() {
            $conditions = $this->postConditions($this->request->data);
            $orders = $this->Order->find('all', compact('conditions'));
            $this->set('orders', $orders);
        }

    ``$this->request->data['Order']['destination']`` が" Old Towne Bakery" であれば、
    postConditions はその条件を Model->find() メソッドで使える配列に変換します。
    この場合は、 ``array('Order.destination' => 'Old Towne Bakery')`` という形になります。

    もし他の SQL 演算子を使いたければ、それらの演算子を2つ目のパラメータに渡してください。 ::

        /*
        $this->request->data は以下のような形式です。
        array(
            'Order' => array(
                'num_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // 'Ye Olde' を含んでいて、少なくとも4つの商品をもっている注文を探しましょう
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=',
                'referrer' => 'LIKE'
            )
        );
        $orders = $this->Order->find('all', compact('conditions'));

    3つ目のパラメータは、条件の結合になにを使うのかを指定することが出来ます。
    'AND', 'OR', 'XOR' のような文字列です。

    最後のパラメータが true で、$op パラメータが配列であれば、$op に含まれていない項目は、
    この関数から返ってくる条件には含まれなくなります。

.. php:method:: paginate()

    このメソッドはモデルから取得した結果をページングするために使われます。
    ページサイズやモデルの find 条件などを指定出来ます。
    paginate のより詳しい使い方は :doc:`ページ制御 <core-libraries/components/pagination>`
    セクションを参照してください。

.. php:method:: requestAction(string $url, array $options)

    この関数は任意の場所からコントローラのアクションを呼び出し、アクションからのデータを返します。
    ``$url`` には、CakePHP の相対 URL を渡します (/controllername/actionname/params)。
    呼び出し先のコントローラのアクションに対して追加のデータを渡すためには、$options 配列を
    指定してください。

    .. note::

        描画されたビューを取得するために、 ``requestAction($url, array('return'));`` のように
        options に 'return' を渡して :php:meth:`~Controller::requestAction()` を
        使うことができます。注意してほしいのは、コントローラのメソッドから
        :php:meth:`~Controller::requestAction()` で ``return`` を使うと、
        script タグと css タグが正しく動作しない原因となるということです。

    .. warning::

        :php:meth:`~Controller::requestAction()` をキャッシュせずに利用すると、
        パフォーマンスの低下につながります。コントローラやモデルで使用するのは稀です。

    :php:meth:`~Controller::requestAction()` は (キャッシュされた) エレメントと
    組み合わせてよく使われます。
    レンダリング前にエレメントに対してデータを取得するような場合です。
    レイアウトの中に"最新のコメント"のエレメントを配置するサンプルを使ってみましょう。
    まず、データを返すコントローラの関数を作ります。 ::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (empty($this->request->params['requested'])) {
                    throw new ForbiddenException();
                }
                return $this->Comment->find(
                    'all',
                    array('order' => 'Comment.created DESC', 'limit' => 10)
                );
            }
        }

    :php:meth:`~Controller::requestAction()` で実行したいメソッドは、実際に
    :php:meth:`~Controller::requestAction()` からリクエストが発せられているかどうかを
    チェックするべきです。そうしないと、そのメソッドは URL から直接からアクセスできるように
    なってしまいます。それは望ましくありません。

    上記の関数を呼ぶための簡単なエレメントを作ったら::

        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    どこか出力したい場所にさっきのエレメントを配置できます。 ::

        echo $this->element('latest_comments');

    ここに書かれた方法では、エレメントが描画されると毎回、データを取得するためにコントローラに対して
    リクエストが作られ、データが処理されて結果が返ってきます。
    したがって、不必要な処理を防ぐためにエレメントのキャッシュを使うのが良いでしょう。 ::

        echo $this->element('latest_comments', array(), array('cache' => true));

    :php:meth:`~Controller::requestAction()` の呼び出しはキャッシュされたエレメントの
    ビューファイルが存在してそれが有効な限り、リクエストの発行はしません。

    加えて、 :php:meth:`~Controller::requestAction()` は CakePHP 形式の URL 配列を
    引数に取ることが出来ます。 ::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    これは、 :php:meth:`~Controller::requestAction()` の呼び出しが、パフォーマンスを向上できる
    :php:meth:`Router::url()` の利用を避けることが出来ます。配列ベースの URL は次の1点を除いて
    :php:meth:`HtmlHelper::link()` で使うものと同じです。
    その違いは、名前付きパラメータや GET で渡されるパラメータを使う場合、それらを2つ目の引数に指定して、
    適切なキーでラップしなければならないということです。
    これは、 :php:meth:`~Controller::requestAction()` が名前付きパラメータの配列
    (requestAction の2つ目の引数) を ``Controller::params`` 配列にマージして、
    名前付きパラメータに対して明示的に 'named' というキーを付けないからです。
    ``$option`` 配列で指定した追加の値は、リクエストされたアクションの
    ``Controller::params`` 配列の中で使えるようになります。 ::

        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    上記の場合、:php:meth:`~Controller::requestAction()` の配列は次のようになります。 ::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        配列の URL が文字列のURLと似ている他の部分とは異なり、
        :php:meth:`~Controller::requestAction()` は URL の扱い方が違います。

    :php:meth:`~Controller::requestAction()` で配列の URL を使う時は、
    リクエストされるアクションにおいて必要となる **全て** のパラメータを指定しなければなりません。
    これは ``$this->request->data`` のようなパラメータも含まれます。
    必要な全てのパラメータを渡すことに加えて、名前付き及びGETパラメータも上記で見たように、
    2つ目の引数に指定しなければなりません。


.. php:method:: loadModel(string $modelClass, mixed $id)

    :php:meth:`~Controller::loadModel()` 関数は、コントローラのデフォルトモデルまたは
    それに関連づいたモデル以外のモデルを使う必要がある時に便利です。 ::

        $this->loadModel('Article');
        $recentArticles = $this->Article->find(
            'all',
            array('limit' => 5, 'order' => 'Article.created DESC')
        );

        $this->loadModel('User', 2);
        $user = $this->User->read();


コントローラ変数
================

コントローラの変数とその説明については、
`CakePHP API <https://api.cakephp.org/2.x/class-Controller.html>`_ を確認してください。

.. php:attr:: name

    :php:attr:`~Controller::$name` 変数はコントローラ名がセットされます。
    通常これは、コントローラが使うメインのモデルの複数形となります。
    このプロパティは必須ではありません。 ::

        // $name 変数の使い方のサンプル
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }


$components と $helpers と $uses
--------------------------------

次に説明するコントローラの変数は、現在のコントローラの中でどのヘルパー、コンポーネント、モデルを
使うのかを CakePHP に伝える役割をはたします。これらの変数はもっとも良く使われる変数です。
これらを使うことで、 :php:attr:`~Controller::$components` や :php:attr:`~Controller::$uses`
で与えられた MVC クラスはコントローラの中でクラス変数として (例えば ``$this->ModelName``)、また
:php:attr:`~Controller::$helpers` で与えられたクラスはビューの中でオブジェクトへの参照として
(例えば ``$this->{$helpername}``) 有効になります。

.. note::

    それぞれのコントローラはデフォルトでこのようなクラスをいくつか持っていて、使える状態になっています。
    したがって、コントローラではすべてを設定する必要はありません。

.. php:attr:: uses

    コントローラはデフォルトで主要なモデルへアクセスできるようになっています。
    RecipesController は ``$this->Recipe`` でアクセスできるモデルクラスを持っており、
    ProductsController もまた ``$this->Product`` に Product モデルを持っています。
    しかし、 コントローラが :php:attr:`~Controller::$uses` 変数に追加のモデルを指定して、
    それらが使えるようになっている時は、 :php:attr:`~Controller::$uses` に現在のコントローラの
    モデルの名前も含めなければなりません。これについては、下の方のサンプルで説明します。

    コントローラでモデルを使いたくない場合は、 ``public $uses = array()`` とセットしてください。
    これでコントローラを使うのに対応するモデルファイルが必要なくなります。それでも、
    ``AppController`` で定義されたモデルはロードされます。``false`` を使うことで、
    ``AppController`` で定義されていたとしてもモデルがロードされなくなります。

    .. versionchanged:: 2.1
       :php:attr:`~Controller::$uses` は新しい値を持ちます。
       それは、 ``false`` とは違った扱いになります。

.. php:attr:: helpers

    :php:class:`SessionComponent` と同様に、:php:class:`HtmlHelper` 、
    :php:class:`FormHelper` 、:php:class:`SessionHelper` はデフォルトで有効になっています。
    しかし、 ``AppController`` で :php:attr:`~Controller::$helpers` を独自に定義している場合、
    :php:class:`HtmlHelper` と :php:class:`FormHelper` をコントローラで有効にしたければ、
    それらを :php:attr:`~Controller::$helpers` に含むようにしてください。
    このマニュアルの後ろにある、それぞれのセクションを確認して、これらのクラスについて
    よく詳しく学んでください。

    追加で利用する MVC クラス達をどうやって CakePHP のコントローラに伝えるのかを見てみましょう。 ::

        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    これらの変数はそれぞれ、継承された値とマージされます。したがって、たとえば
    :php:class:`FormHelper` や ``AppController`` で宣言されている他のクラスを、
    再度宣言する必要はありません。

.. php:attr:: components

    components 配列はコントローラで使う :doc:`/controllers/components` をセットします。
    :php:attr:`~Controller::$helpers` や :php:attr:`~Controller::$uses` のように、
    あなたのコントローラのコンポーネントは ``AppController`` のコンポーネントとマージされます。
    :php:attr:`~Controller::$helpers` のように、:php:attr:`~Controller::$components`
    には設定を渡すことが出来ます。より詳しくは :ref:`configuring-components` を参照してください。

その他の変数
------------

コントローラの変数の詳細については、 `API <https://api.cakephp.org>`_ ページで確認すれば、
ここで説明した以外の他のコントローラ変数についてのセクションがあります。

.. php:attr:: cacheAction

    cacheAction 変数はフルページキャッシュの持続時間やその他の情報を定義するために使われます。
    フルページキャッシュについてのより詳しい情報は :php:class:`CacheHelper` のドキュメントを
    読んでください。

.. php:attr:: paginate

    paginate 変数は非推奨の互換性のあるプロパティです。
    この変数を使って、 :php:class:`PaginatorComponent` の読み込みと設定をします。
    次のように、コンポーネントの設定を使うように修正することが推奨されます。 ::

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

    この章は、コントローラのAPIとそのサンプルの量が少ないかもしれませんが、コントローラ変数は、
    最初からそれらを理解するのはとても難しいです。この章では、いくつかのサンプルと、
    またそれらサンプルで何をやっているか、などと一緒に学習を初めて行きましょう。

More on controllers
===================

.. toctree::
    :maxdepth: 1

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=ja: Controllers
    :keywords lang=ja: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
