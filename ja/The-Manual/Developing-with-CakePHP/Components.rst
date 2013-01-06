コンポーネント
##############

 

はじめに
========

コンポーネントは複数のコントローラ間で共有されるロジックのパッケージです。もし複数のコントローラ間でコピー＆ペーストしたいものがある場合、コンポーネントに何らかの機能をラッピングするうことを考えるかもしれません。

CakePHP
はコアコンポーネントとしていくつかすばらしいものがあります。次のようなことを目的として使用することができます。

-  セキュリティ(Security)
-  セッション(Sessions)
-  認可(Access control lists)
-  メール(Emails)
-  クッキー(Cookies)
-  認証(Authentication)
-  リクエスト処理(Request handling)

これらのそれぞれのコアコンポーネントは、各章で詳細を説明します。ここでは自分専用のコンポーネントの作成方法を示します。コンポーネントを作成するとコントローラのコードがすっきりし、複数のプロジェクト間で再利用できるコードになります。

コンポーネントの設定
====================

コアコンポーネントの多くは、設定が必要です。設定が必要なコンポーネントの例としては、\ `認証 </ja/view/172/Authentication>`_\ 、
`クッキー </ja/view/177/Cookies>`_\ 、
`電子メール </ja/view/176/Email>`_\ が挙げられます。これらのコンポーネントと一般的なコンポーネントの設定は普通、コントローラの
``beforeFilter()`` メソッドで行います。

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }

これは、コンポーネント変数の設定を、コントローラの ``beforeFilter()>``
で行う例です。

こうすることは確かに可能なのですが、オプションの設定を\ ``beforeFilter()``\ が実行される前に必要とするコンポーネントがあります。このために、いくつかのコンポーネントは\ ``$components``\ 配列でオプションの設定をすることができるようになっています。

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session'));

各コンポーネントがどんな設定オプションを提供するか明らかにするには、関連するドキュメントを参照してください。

コンポーネントは\ ``beforeRender``\ と\ ``beforeRedirect``\ コールバックを持つことができます。これはそれぞれ、ページがレンダリングされる前とリダイレクトする前に実行されます。

コンポーネントの\ ``enabled``\ プロパティを\ ``false``\ に指定することでコールバックの起動を無効化することができます。

Component callbacks
===================

While components provide a way to create reusable controller code, that
performs a specific task. Components also offer a way to hook into the
general application flow. There are 5 built-in hooks, and more can be
created dynamically using ``Component::triggerCallback``.

The core callbacks are:

-  **initialize()** is fired before the controller's beforeFilter, but
   after models have been constructed.
-  **startup()** is fired after the controllers' beforeFilter, but
   before the controller action.
-  **beforeRender()** is fired before a view is rendered.
-  **beforeRedirect()** is fired before a redirect is done from a
   controller. You can use the return of the callback to replace the url
   to be used for the redirect.
-  **shutdown()** is fired after the view is rendered and before the
   response is returned.

You can add additional methods to your components, and call those
methods at any time by using ``Component::triggerCallback()``. If you
had added a ``onAccess`` callback to your components. You could fire
that callback from within the controller by calling
``$this->Component->triggerCallback('onAccess', $this);``

You can disable the callbacks triggering by setting the ``enabled``
property of a component to ``false``.

独自のコンポーネントを作成する
==============================

仮に、作成するオンラインアプリケーションが、いたる所で複雑な数学的処理を実行する必要があるとします。コンポーネントを作成し、これを共有ロジックとしてまとめて、複数のコントローラで使用することができます。

最初のステップは、新規にコンポーネントファイルとクラスを作成することです。/app/controllers/components/math.php
にファイルを作成します。コンポーネントの基本構造は次のようになります。

::

    <?php

    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

    ?>

コントローラ内でコンポーネントを読み込む
----------------------------------------

コンポーネントを作成したら、コントローラの $components
配列にコンポーネント名（"Component"
の部分は取り除きます）を指定することでアプリケーションのコントローラ内で使用することができます。コントローラは自動的にコンポーネント名をもつ新しい属性が与えられます。それを通してコンポーネントのインスタンスにアクセスすることができます:

::

    /* 標準コンポーネントの $this->Session と同様に
    $this->Math でアクセスできる新しいコンポーネントを作成します。 */
    var $components = array('Math', 'Session');

``AppController``
内で宣言されたコンポーネントは、他のコントローラ内のコンポーネントとマージされます。そのため同じコンポーネントを２度再宣言する必要はありません。

コントローラ内のコンポーネントを読み込む際に、パラメータを宣言することもできます。このパラメータはコンポーネントの
``initialize()``
メソッドに渡されます。これらのパラメータはコンポーネントに処理されます。

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

上記は、Math コンポーネントの initialize() メソッドに第 2 引数として
precision と randomGenerator を含む配列を渡しています。

この構文は今の時点ではコアコンポーネントには実装されていません。

コンポーネント内でMVC クラスにアクセスする
------------------------------------------

新しく作成したコンポーネント内でコントローラのインスタンスにアクセスするには、initialize()
または startup()
メソッドを実行する必要があります。これらの特別なメソッドは、コントローラへのリファレンスを第１引数として受け取り、自動的に呼び出されます。initialize
メソッドはコントローラの beforeFilter()
メソッドの前に呼び出され、startup() はコントローラの beforeFilter()
メソッドの後に呼び出されます。何らかの理由でコントローラが構築される際に
startup() メソッドを\ *呼び出したくない*\ 場合、クラス変数
$disableStartup に *true* をセットします。

コントローラの beforeFilter()
メソッドが呼び出される前に、なんらかの処理を挿入したい場合、コンポーネントの
initialize() メソッドを使用する必要があります。

::

    <?php
    class CheckComponent extends Object {
        //called before Controller::beforeFilter()
        function initialize(&$controller) {
            // saving the controller reference for later use
            $this->controller =& $controller;
        }

        //called after Controller::beforeFilter()
        function startup(&$controller) {
        }

        function redirectSomewhere($value) {
            // utilizing a controller method
            $this->controller->redirect($value);
        }
    }
    ?>

独自のコンポーネント内で他のコンポーネントを利用したい場合があるかもしれません。これを行うには、$components
クラス変数(コントローラ内と同じように)を配列として作成し、利用したいコンポーネント名を指定するだけで可能です。

サブコンポーネントの ``initialize`` だけが、自動的に呼び出されます。

::

    <?php
    class MyComponent extends Object {

        // This component uses other components
        var $components = array('Session', 'Math');

        function doStuff() {
            $result = $this->Math->doComplexOperation(1, 2);
            $this->Session->write('stuff', $result);
        }

    }
    ?>

コンポーネント内でモデルにアクセスする、または使用することは、一般的に推奨されていません。しかしながら、そうすることに重要性がある場合、手動でモデルクラスをインスタンス化して使用する必要があります。次がサンプルになります:

::

    <?php
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }

        function doUberComplexOperation ($amount1, $amount2) {
            $userInstance = ClassRegistry::init('User');
            $totalUsers = $userInstance->find('count');
            return ($amount1 + $amount2) / $totalUsers;
        }
    }
    ?>

コンポーネントから別のコンポーネントを使用する
----------------------------------------------

あるコンポーネントが、別のコンポーネントに依存している場合があります。もしこれらのコンポーネントが提供する機能が他の機能に依存しないのであれば、これらを一つのコンポーネントに統合したくないかもしれません。

一つに統合する代わりに、\ ``$components``
配列に子となるもののリストを与えることで、コンポーネントに親子関係を定義することができます。親コンポーネントは子コンポーネントより先にロードされ、親は子にアクセスします。

親の例:

::

    <?php

    class ParentComponent extends Object {
        var $name = "Parent";
        var $components = array( "Child" );

        function initialize(&$controller) {
            $this->Child->foo();
        }

        function bar() {
            // ...
        }
    }

子の例:

::

    <?php
    class ChildComponent extends Object {
        var $name = "Child";

        function initialize(&$controller) {
            $this->Parent->bar();
        }

        function foo() {
            // ...
        }
    }

