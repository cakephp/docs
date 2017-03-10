コンポーネント
##############

コンポーネントはコントローラ間で共有されるロジックのパッケージです。
CakePHP には、様々な共通のタスクを支援するための素晴らしいコアコンポーネントが
用意されています。あなた独自のコンポーネントも作成できます。 もしコントローラ間で
コピー＆ペーストしたい箇所があった場合、その機能を含むコンポーネントの作成を
検討しましょう。コンポーネントを作成することで、コントローラのコードを綺麗に保ち、
プロジェクト間のコードの再利用につながります。

CakePHP の中に含まれるコンポーネントの詳細については、各コンポーネントの章を
チェックしてください。

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/cookie
    /controllers/components/csrf
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling

.. _configuring-components:

コンポーネントの設定
====================

コアコンポーネントの多くは設定を必要としています。コンポーネントが設定を
必要としている例は、 :doc:`/controllers/components/authentication` や
:doc:`/controllers/components/cookie` などにあります。これらのコンポーネントや
一般的なコンポーネントの設定は、通常、お使いのコントローラの ``loadComponent()``
メソッドまたは ``initialize()`` メソッド、 ``$components`` 配列を介して行われます。 ::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
                'loginAction' => ['controller' => 'Users', 'action' => 'login']
            ]);
            $this->loadComponent('Cookie', ['expiry' => '1 day']);
        }

    }

``config()`` メソッドを使用して、実行時にコンポーネントを設定することができます。
しばしば、コントローラの ``beforeFilter()`` メソッドで行われます。
上記は、次のように表現することもできます。 ::

    public function beforeFilter(Event $event)
    {
        $this->Auth->config('authorize', ['controller']);
        $this->Auth->config('loginAction', ['controller' => 'Users', 'action' => 'login']);

        $this->Cookie->config('name', 'CookieMonster');
    }

コンポーネントは、ヘルパーと同じように、コンポーネントのすべての設定データを
取得および設定するために使用されている ``config()`` メソッドを実装しています。 ::

    // 設定データの読み込み
    $this->Auth->config('loginAction');

    // 設定をセット
    $this->Csrf->config('cookieName', 'token');

コンポーネントは、ヘルパーと同じように、``config()`` でアクセス可能な
``$_config`` プロパティを作成するためにコンストラクタの設定で自分の
``$_defaultConfig`` プロパティを自動的にマージします。

コンポーネントの別名
--------------------

共通設定の一つに ``className`` オプションがあります。このオプションを使うと
コンポーネントに別名をつけられます。この機能は ``$this->Auth`` や
他のコンポーネントの参照を独自実装に置き換えたい時に便利です。 ::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize()
        {
            $this->loadComponent('Auth', [
                'className' => 'MyAuth'
            ]);
        }
    }

    // src/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent
    {
        // コア AuthComponent を上書きするコードを追加
    }

上記の例ではコントローラにて ``MyAuthComponent`` に ``$this->Auth`` という
*別名* をつけています。

.. note::

    別名を付けられたコンポーネントはコンポーネントが使われるあらゆる場所の
    インスタンスを置き換えます。これは、他のコンポーネントの内部を含みます。

コンポーネントの動的ロード
--------------------------

すべてのコントローラアクションで全コンポーネントを使えるようにする必要は
ないかもしれません。このような状況では、お使いのコントローラで
``loadComponent()`` メソッドを使用して、実行時にコンポーネントを
ロードすることができます。 ::

    // コントローラのアクションの中で
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

    動的にロードされたコンポーネントはコールバックされないことに注意してください。
    もし、 ``beforeFilter`` または ``startup`` コールバックに依存している場合、
    あなたのコンポーネントをロードするときに手動でそれらを呼び出す必要があります。

コンポーネントの使用
====================

一旦、コンポーネントをコントローラに読込んでしまえば、使うのは非常に簡単です。
使用中の各コンポーネントはコントローラのプロパティのように見えます。
もし、 :php:class:`Cake\\Controller\\Component\\FlashComponent` を
コントローラに読込んだ場合、以下のようにアクセスすることができます。 ::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Post deleted.');
                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

    モデルとコンポーネントの両方がプロパティとしてコントローラに追加されているので、
    それらは同じ「名前空間」を共有しています。
    コンポーネントとモデルに同じ名前を付けないように注意してください。

.. _creating-a-component:

コンポーネントの作成
====================

アプリケーションの様々な箇所で複雑な数学的処理を必要としている
オンラインアプリケーションを仮定して下さい。
これから、コントローラの様々な箇所で使うための共有ロジックを集約するための
コンポーネントを作成します。

はじめに、新しいコンポーネントファイルとクラスを作成します。
**src/Controller/Component/MathComponent.php** にファイルを作成します 。
コンポーネントのための基本的な構造は次のようになります。 ::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

    すべてのコンポーネントは :php:class:`Cake\\Controller\\Component` を
    継承しなければなりません。継承されていない場合、例外が発生します。

コントローラの中にコンポーネントを読み込む
--------------------------------------------

一旦コンポーネントが完成してしまえば、コントローラの ``initialize()`` メソッド中で
それをロードすることによって、アプリケーションのコントローラで使用することができます。
ロードされた後、コントローラはそのコンポーネントに由来する名前の新しいプロパティを与えられ、
そのプロパティを通してコンポーネントのインスタンスにアクセスできます。 ::

    // コントローラの中で
    // 標準の $this->Csrf と同様に
    // 新しいコンポーネントを $this->Math として利用可能にします。
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Csrf');
    }

コントローラの中でコンポーネントを読み込む時、コンポーネントのコンストラクタに渡す
バラメータを宣言することもできます。
このパラメータはコンポーネントによって処理することができます。 ::

    // コントローラの中で
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ]);
        $this->loadComponent('Csrf');
    }

上記の例では precision と randomGenerator を含む配列が
``MathComponent::initialize()`` の ``$config`` パラメータに渡されます。


コンポーネントの中で他のコンポーネントを使用する
------------------------------------------------

作成しているコンポーネントから他のコンポーネントを使いたい時がたまにあります。
その場合、作成中のコンポーネントから他のコンポーネントを読み込むことができ、
その方法はコントローラから ``$components`` 変数を使って読み込む場合と同じです。 ::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // あなたのコンポーネントが使っている他のコンポーネント
        public $components = ['Existing'];

        // あなたのコンポーネントに必要な、その他の追加のセットアップを実行
        public function initialize(array $config)
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
       }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {

        public function foo()
        {
            // ...
        }
    }

.. note::

    コントローラから読み込んだコンポーネントと違い、コンポーネントから
    コンポーネントを読み込んだ場合は、コールバックが呼ばれないことに注意して下さい。


コンポーネントのコントローラへのアクセス
----------------------------------------

コンポーネント内から、_registry を介して現在のコントローラに
アクセスすることができます。 ::

    $controller = $this->_registry->getController();

任意のコールバックメソッドではイベントオブジェクトからコントローラに
アクセスすることができます。 ::

    $controller = $event->getSubject();

コンポーネントのコールバック
============================

また、コンポーネントは、リクエストサイクルを増強することができる、
いくつかのリクエストライフサイクルコールバックを提供しています。

.. php:method:: beforeFilter(Event $event)

    コントローラの beforeFilter メソッドの前に呼び出されますが、
    コントローラのinitialize() メソッドの *後* です。

.. php:method:: startup(Event $event)

    コントローラの beforeFilter メソッドの後、コントローラの現在の
    アクションハンドラの前に呼び出されます。

.. php:method:: beforeRender(Event $event)

    コントローラがリクエストされたアクションのロジックを実行した後、
    ビューとレイアウトが描画される前に呼び出されます。 

.. php:method:: shutdown(Event $event)

    出力結果がブラウザに送信される前に呼び出されます。

.. php:method:: beforeRedirect(Event $event, $url, Response $response)

    コントローラの redirect メソッドが呼び出された時に、
    他のアクションより先に呼びだされます。このメソッドが ``false`` を返す時、
    コントローラはリクエストのリダイレクトを中断します。
    $url と $response パラメータを使用すると、リダイレクト先やレスポンスの
    任意の他のヘッダを検査や変更することができます。

.. meta::
    :title lang=ja: コンポーネント
    :keywords lang=ja: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
