コンポーネント
##############

コンポーネントはコントローラ間で共有されるロジックのパッケージです。
CakePHP には、様々な共通のタスクを支援するための素晴らしいコアコンポーネントが用意されています。
あなた独自のコンポーネントも作成できます。もしコントローラ間でコピー＆ペーストしたい箇所が
あった場合、その機能を含むコンポーネントの作成を検討しましょう。コンポーネントを作成することで、
コントローラのコードを綺麗に保ち、プロジェクト間のコードの再利用につながります。

各コアコンポーネントの詳細はそれぞれの章で説明します。詳しくは、
:doc:`/core-libraries/toc-components` を参照してください。
ここでは、独自のコンポーネントを作成する方法を紹介します。

.. _configuring-components:

コンポーネントの設定
====================

コアコンポーネントの多くは設定を必要としています。コンポーネントが設定を必要としている例は、
:doc:`/core-libraries/components/authentication` や
:doc:`/core-libraries/components/cookie` などにあります。
これらのコンポーネントと普通のコンポーネントの設定は大抵の場合、
``$components`` 配列かコントローラの ``beforeFilter()`` メソッドで行われます。 ::

    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'authorize' => array('controller'),
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login'
                )
            ),
            'Cookie' => array('name' => 'CookieMonster')
        );

これは  ``$components`` 配列でコンポーネントを設定している例です。
すべてのコアコンポーネントはこの方法で設定することができます。
さらに、コントローラの ``beforeFilter()`` メソッドで設定することもできます。
これは関数の結果をコンポーネントのプロパティに設定する時に役に立ちます。
上記は、次のように表現することもできます。 ::

    public function beforeFilter() {
        $this->Auth->authorize = array('controller');
        $this->Auth->loginAction = array(
            'controller' => 'users',
            'action' => 'login'
        );

        $this->Cookie->name = 'CookieMonster';
    }

しかし、コンポーネントのオプションをコントローラの ``beforeFilter()`` が
実行される前に設定することが可能な場合もあります。
つまり、コンポーネントの中には ``$components`` 配列にオプションを設定することが
できるものがあります。 ::

    public $components = array(
        'DebugKit.Toolbar' => array('panels' => array('history', 'session'))
    );

各コンポーネントがどのような設定オプションを提供しているかは関連ドキュメントを参照してください。

共通設定の一つに ``className`` オプションがあります。このオプションを使うとコンポーネントに
別名をつけられます。この機能は ``$this->Auth`` や他のコンポーネントの参照を独自実装に
置き換えたい時に便利です。 ::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $components = array(
            'Auth' => array(
                'className' => 'MyAuth'
            )
        );
    }

    // app/Controller/Component/MyAuthComponent.php
    App::uses('AuthComponent', 'Controller/Component');
    class MyAuthComponent extends AuthComponent {
        // コア AuthComponent を上書きするコードを追加して
    }

上記の例ではコントローラにて ``MyAuthComponent`` に ``$this->Auth`` という *別名* をつけています。

.. note::

    別名を付けられたコンポーネントはコンポーネントが使われるあらゆる場所のインスタンスを置き換えます。
    これは、他のコンポーネントの内部を含みます。

コンポーネントの使用
====================

一旦、コンポーネントをコントローラに読込んでしまえば、使うのは非常に簡単です。
使用中の各コンポーネントはコントローラのプロパティのように見えます。
もし、 :php:class:`SessionComponent` と :php:class:`CookieComponent` を
コントローラに読込んだ場合、以下のようにアクセスすることができます。 ::

    class PostsController extends AppController {
        public $components = array('Session', 'Cookie');

        public function delete() {
            if ($this->Post->delete($this->request->data('Post.id')) {
                $this->Session->setFlash('Post deleted.');
                return $this->redirect(array('action' => 'index'));
            }
        }

.. note::

    モデルとコンポーネントの両方がコントローラにプロパティとして追加されるので、それらは同じ
    「名前空間」を共有します。コンポーネントとモデルに同じ名前をつけないように注意して下さい。

コンポーネントの動的ロード
--------------------------

すべてのコントローラアクションで全コンポーネントを使えるようにする必要はないかもしれません。
このような状況では、実行時に :doc:`コンポーネントコレクション </core-libraries/collections>` を
使ってコンポーネントを読込むことができます。コントローラ内部から以下のようにできます。 ::

    $this->OneTimer = $this->Components->load('OneTimer');
    $this->OneTimer->getTime();

.. note::

    コンポーネントを動的にロードした場合、初期化メソッドが実行されないことを覚えておいて下さい。
    このメソッドで読込んだ場合、ロード後に手動で実行する必要があります。


コンポーネントのコールバック
============================

コンポーネントはまた、いくつかのリクエストライフサイクルにリクエストライフサイクルが増すような
コールバックを提供します。コンポーネントが提供するコンポーネントの詳細については、
:ref:`component-api` の基本を参照して下さい。

.. _creating-a-component:

コンポーネントを作成する
========================

アプリケーションの様々な箇所で複雑な数学的処理を必要としているオンラインアプリケーションを仮定して下さい。
これから、コントローラの様々な箇所で使うための共有ロジックを集約するためのコンポーネントを作成します。

はじめに、新しいコンポーネントファイルとクラスを作成します。
``/app/Controller/Component/MathComponent.php`` にファイルを作成して下さい。
コンポーネントの基本構造は以下のようになります。 ::

    App::uses('Component', 'Controller');
    class MathComponent extends Component {
        public function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

.. note::

    すべてのコンポーネントは :php:class:`Component` を継承しなければなりません。
    継承されていない場合、例外が発生します。

コントローラの中にコンポーネントを読み込む
------------------------------------------

一旦コンポーネントが完成してしまえば、コントローラの ``$components`` 配列にあるコンポーネント名
(Component の部分を削除する) を置き換えることで使えるようになります。
コントローラはそのコンポーネントに由来する新しいプロパティを自動的に与えられ、
そのプロパティを通してコンポーネントのインスタンスにアクセスできます。 ::

    /* 標準の $this->Session と同様に新しいコンポーネントを
       $this->Math で利用できるようにします。*/
    public $components = array('Math', 'Session');

``AppController`` の中で宣言されているコンポーネントは他のコントローラで宣言されているコンポーネントと
マージされます。同じコンポーネントを二度宣言する必要はありません。

コントローラの中でコンポーネントを読み込む時、コンポーネントのコンストラクタに渡すバラメータを
宣言することもできます。このパラメータはコンポーネントによって処理することができます。 ::

    public $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

上記の例では precision と randomGenerator を含む配列が ``MathComponent::__construct()`` の
第二引数として渡されます。コンポーネントのパブリックプロパティや引数として渡される設定はその配列に
基づいた値になります。

コンポーネントの中で他のコンポーネントを使用する
------------------------------------------------

作成しているコンポーネントから他のコンポーネントを使いたい時がたまにあります。その場合、
作成中のコンポーネントから他のコンポーネントを読み込むことができ、その方法はコントローラから
``$components`` 変数を使って読み込む場合と同じです。 ::

    // app/Controller/Component/CustomComponent.php
    App::uses('Component', 'Controller');
    class CustomComponent extends Component {
        // 実装中のコンポーネントが使っている他のコンポーネント
        public $components = array('Existing');

        public function initialize(Controller $controller) {
            $this->Existing->foo();
        }

        public function bar() {
            // ...
       }
    }

    // app/Controller/Component/ExistingComponent.php
    App::uses('Component', 'Controller');
    class ExistingComponent extends Component {

        public function foo() {
            // ...
        }
    }

.. note::
    コントローラから読み込んだコンポーネントと違い、コンポーネントからコンポーネントを読み込んだ場合は、
    コールバックが呼ばれないことに注意して下さい。

.. _component-api:

コンポーネント API
==================

.. php:class:: Component

    コンポーネントの基底クラスは :php:class:`ComponentCollection` を通して共通のハンドリング設定を
    扱うように他のコンポーネントを遅延読み込みするためのメソッドをいくつか提供しています。
    また、コンポーネントのすべてのコールバックのプロトタイプを提供します。

.. php:method:: __construct(ComponentCollection $collection, $settings = array())

    基底コンポーネントクラスのコンストラクタです。すべての ``$settings`` 、
    またはパブリックプロパティは ``$settings`` の中で一致した値に変更されます。

コールバック
------------

.. php:method:: initialize(Controller $controller)

    コントローラの beforeFilter メソッドの前に呼び出されます。

.. php:method:: startup(Controller $controller)

    コントローラの beforeFilter メソッドの後、コントローラの現在のアクションハンドラの前に
    呼び出されます。

.. php:method:: beforeRender(Controller $controller)

    コントローラがリクエストされたアクションのロジックを実行した後、
    ビューとレイアウトが描画される前に呼び出されます。

.. php:method:: shutdown(Controller $controller)

    出力結果がブラウザに送信される前に呼び出されます。

.. php:method:: beforeRedirect(Controller $controller, $url, $status=null, $exit=true)

    コントローラの redirect メソッドが呼び出された時に、他のアクションより先に呼びだされます。
    このメソッドが false を返す時、コントローラはリクエストのリダイレクトを中断します。
    $url, $status と $exit 変数はコントローラのメソッドの場合と同じ意味です。また、
    リダイレクト先の URL 文字列を返すか、 'url' と 'status' と 'exit' をキーに持つ連想配列を
    返すことができます。 'status' と 'exit' は任意です。


.. meta::
    :title lang=ja: コンポーネント
    :keywords lang=ja: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
