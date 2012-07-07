認証
        Authentication
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $settings = array())

ユーザを識別し、認証し、権限を付与することは、ほとんどすべてのWebアプリケーションに共通の機能です。
CakePHP の AuthComponent ではそういったタスクを実行するためのプラガブルな方法を提供します。
AuthComponent により、認証オブジェクトと、ユーザの権限を識別・判定する柔軟な仕組みを作るための権限判定オブジェクトを組み合わせることができるようになります。

..
  Identifying, authenticating and authorizing users is a common part of almost every web application.
  In CakePHP AuthComponent provides a pluggable way to do these tasks.  
  AuthComponent allows you to combine authentication objects, 
  and authorization objects to create flexible ways of identifying and checking user authorization.

.. _authentication-objects:

認証
        Authentication
==============

認証とは、与えられた認証情報によりユーザを識別し、そのユーザが言うとおりの人物であることを確実なものにする処理のことです。
たいていの場合、これはユーザ名とパスワードにより行われ、それと既知のユーザリストを照らし合わせます。
CakePHP には、あなたのアプリケーション内に保管されているユーザを認証するための組み込み済みの方法がいくつか存在します。

..
  Authentication is the process of identifying users by provided credentials 
  and ensuring that users are who they say they are.
  Generally this is done through a username and password, that are checked against a known list of users.
  In CakePHP, there are several built in ways of authenticating users stored in your application.

* ``FormAuthenticate`` では、POSTされたデータをもとに認証を行うことが可能です。
  通常これは、ユーザが情報を入力するログインフォームです。
* ``BasicAuthenticate`` では、Basic HTTP 認証を使った認証を行うことが可能です。
* ``DigestAuthenticate`` では、ダイジェスト HTTP 認証を使った認証を行うことが可能です。

..
  * ``FormAuthenticate`` allows you to authenticate users based on form POST
    data.  Usually this is a login form that users enter information into.
  * ``BasicAuthenticate`` allows you to authenticate users using Basic HTTP
    authentication.
  * ``DigestAuthenticate`` allows you to authenticate users using Digest
    HTTP authentication.

デフォルトで ``AuthComponent`` は ``FormAuthenticate`` を使用します。

..
  By default ``AuthComponent`` uses ``FormAuthenticate``.

認証タイプの選択
-------------------------------

..
        Choosing an Authentication type

大抵の場合はフォームに基づく認証を利用したいと思うでしょう。これはWebブラウザを使うユーザにとってはもっとも簡単な方法です。もし、APIやWebサービスを構築しているなら、Basic認証やダイジェスト認証も考慮したくなるかもしれません。
ダイジェスト認証とBasic認証の重要な違いはほとんどどのようにパスワードを扱うかということにあります。
Basic認証では、ユーザ名とパスワードは平文のテキストとしてサーバに送信されます。
そのため Basic認証は SSL を使わないアプリケーションには向いていません。これは、慎重に扱うべきパスワードが露出してしまう可能性があるためです。
ダイジェスト認証はユーザ名やパスワード、そのほかのいくつかの詳細情報のダイジェストハッシュを使います。
そのため ダイジェスト認証は SSL を使わないアプリケーションにもふさわしいものです。

..
  Generally you'll want to offer form based authentication. It is the easiest for
  users using a web-browser to use.  If you are building an API or webservice, you
  may want to consider basic authentication or digest authentication.  
  The key differences between digest and basic authentication are mostly related to 
  how passwords are handled.  
  In basic authentication, the username and password are transmitted as plain-text to the server.  
  This makes basic authentication un-suitable for applications without SSL, 
  as you would end up exposing sensitive passwords.  
  Digest authentication uses a digest hash of the username, password, and a few other details.  
  This makes digest authentication more appropriate for applications without SSL encryption.

また、OpenID のような認証システムを使うことも可能です。ただし、OpenID は CakePHP のコアには含まれません。

..
  You can also use authentication systems like openid as well, 
  however openid is not part of CakePHP core.


認証を設定するためのハンドラ
-----------------------------------

..
  Configuring Authentication handlers

認証ハンドラは ``$this->Auth->authenticate`` を使って設定します。
認証に使うハンドラを１つもしくは複数設定することができます。
複数のハンドラを設定することで、複数のログインの仕組みをサポートすることが可能です。
ユーザがログインする際、認証ハンドラは宣言されている順に判定されます。
あるハンドラで識別ができたら、それ以降のハンドラでは判定されません。
逆に、例外を投げることですべての認証を失敗にすることもできます。
投げられたいかなる例外もキャッチしなければならず、必要に応じてそれらに対処しなければなりません。

..
  You configure authentication handlers using ``$this->Auth->authenticate``.
  You can configure one or many handlers for authentication.  
  Using multiple handlers allows you to support different ways of logging users in.  
  When logging users in, authentication handlers are checked in the order they are declared.  
  Once one handler is able to identify the user, no other handlers will be checked.  
  Conversely you can halt all authentication by throwing an exception.  
  You will need to catch any thrown exceptions, and handle them as needed.

コントローラの ``beforeFilter`` の中、もしくは ``$components`` 配列の中に、認証ハンドラをいくつでも設定することができます。
次のようにすることで各認証オブジェクトへと設定情報を渡すことができます。

..
  You can configure authentication handlers in your controller's ``beforeFilter`` or, 
  in the ``$components`` array.  
  You can pass configuration information into each authentication object, using an array::

    <?php
    // 基本的な設定法
    $this->Auth->authenticate = array('Form');

    // 設定を中に記述
    $this->Auth->authenticate = array(
        'Form' => array('userModel' => 'Member'),
        'Basic' => array('userModel' => 'Member')
    );

上記の２つ目のブロックでは、``userModel`` キーを２回宣言しなければならないということに気づいたでしょう。
コードをDRYに保ちたいなら、``all`` キーを使うことができます。
この特別なキーを使うことで、列挙したオブジェクトすべてに設定が渡されることになります。
all キーは ``AuthComponent::ALL`` と記述することもできます::

..
  In the second example you'll notice that we had to declare the ``userModel`` key twice. 
  To help you keep your code DRY, you can use the ``all`` key.  
  This special key allows you to set settings that are passed to every attached object.  
  The all key is also exposed as ``AuthComponent::ALL``::

    <?php
    // 'all' を使って設定を記述
    $this->Auth->authenticate = array(
        AuthComponent::ALL => array('userModel' => 'Member'),
        'Form',
        'Basic'
    );

上記の例では、``Form`` と ``Basic`` の両方ともが  'all' キーで宣言された設定を取得することになります。
特定の認証オブジェクトに個別に書いた設定は 'all' キーの同名のキーの情報をオーバーライドします。
コアの認証オブジェクトでは次の設定キーをサポートしています。

..
  In the above example, both ``Form`` and ``Basic`` will get the settings defined for the 'all' key.  
  Any settings passed to a specific authentication object will override the matching key in the 'all' key.
  The core authentication objects support the following configuration keys.


- ``fields`` ユーザを識別するのに使う列名の配列。
- ``userModel`` User のモデル名。デフォルトは User。
- ``scope`` 認証するユーザを検索する際に使う、追加の条件。例： ``array('User.is_active' => 1).``
- ``contain`` ユーザのレコードがロードされた際に含めることのできるオプション。

..
  - ``fields`` The fields to use to identify a user by.
  - ``userModel`` The model name of the User, defaults to User.
  - ``scope`` Additional conditions to use when looking up and
    authenticating users, i.e. ``array('User.is_active' => 1).``
  - ``contain`` Containable options for when the user record is loaded.

  .. versionadded:: 2.2

配列 ``$components`` の中でユーザの個々の列名を設定するには::

..
  To configure different fields for user in ``$components`` array::

    <?php
    // $components 配列の中で設定を記述
    public $components = array(
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'fields' => array('username' => 'email')
                )
            )
        )
    );

.. note::

    Auth の他の設定キー（authError や loginAction など）を authenticate や Form の下位要素として書いてはいけません。
    それらは authenticate キーと同じレベルであるべきです。
    上記の例を他の Auth 設定を使って書いた場合は次のようになります::

..
  Do not put other Auth configuration keys (like authError, loginAction etc)
  within the authenticate or Form element. They should be at the same level as
  the authenticate key.
  Above setup with other Auth configurations should look something like::

        <?php
        // $components 配列の中で設定を記述
        public $components = array(
            'Auth' => array(
                'loginAction' => array(
                    'controller' => 'users',
                    'action' => 'login',
                    'plugin' => 'users'
                ),
                'authError' => 'Did you really think you are allowed to see that?',
                'authenticate' => array(
                    'Form' => array(
                        'fields' => array('username' => 'email')
                    )
                )
            )
        );

共通の設定に加えて、Basic 認証では次のキーも利用できます。

..
  In addition to the common configuration, Basic authentication supports the following keys:

- ``realm`` 認証される realm。デフォルトでは ``env('SERVER_NAME')``。

..
  - ``realm`` The realm being authenticated. Defaults to ``env('SERVER_NAME')``.

共通の設定に加えて、ダイジェスト認証では次のキーも利用できます。

..
  In addition to the common configuration Digest authentication supports the following keys:

- ``realm`` realm 認証の認証先。デフォルトはサーバ名。
- ``nonce`` 認証で使われる nonce。デフォルトは ``uniqid()``。
- ``qop`` デフォルトは auth。現時点では他の値はサポートされていない。
- ``opaque`` クライアントから変更されることなく戻されるべき文字列。デフォルトでは ``md5($settings['realm'])``。

..
  - ``realm`` The realm authentication is for, Defaults to the servername.
  - ``nonce`` A nonce used for authentication.  Defaults to ``uniqid()``.
  - ``qop`` Defaults to auth, no other values are supported at this time.
  - ``opaque`` A string that must be returned unchanged by clients. Defaults
    to ``md5($settings['realm'])``

カスタム認証オブジェクトの作成
--------------------------------------

..
  Creating Custom Authentication objects


認証オブジェクトはプラガブルなので、カスタム認証オブジェクトを自分のアプリケーション内にでも、プラグインとしてでも作成が可能です。
もし例えば、OpenID 認証オブジェクトを作成したいのだとしたら、``app/Controller/Component/Auth/OpenidAuthenticate.php`` の中で次のように記述することができます。

..
  Because authentication objects are pluggable, 
  you can create custom authentication objects in your application or plugins.  
  If for example you wanted to create an OpenID authentication object.  
  In ``app/Controller/Component/Auth/OpenidAuthenticate.php`` you could put the following::

    <?php
    App::uses('BaseAuthenticate', 'Controller/Component/Auth');

    class OpenidAuthenticate extends BaseAuthenticate {
        public function authenticate(CakeRequest $request, CakeResponse $response) {
            // OpenID 用の処理をここに記述します。
        }
    }

認証オブジェクトは、ユーザを識別できなかった場合に ``false`` を返さなければなりません。
そして、可能ならユーザ情報の配列も返すべきでしょう。
``BaseAuthenticate`` を継承しなくてもかまいません。独自の認証オブジェクトには ``authenticate()`` メソッドが実装されていればよいのです。
``BaseAuthenticate`` クラスではよく使われる強力なメソッドが多数提供されます。
また、独自の認証オブジェクトがステートレス認証やクッキーレス認証をサポートする必要があるなら、``getUser()`` メソッドを実装することもできます。
詳細は下記の Basic／ダイジェスト認証のセクションを参照してください。

..
  Authentication objects should return ``false`` if they cannot identify the user.  
  And an array of user information if they can. 
  It's not required that you extend ``BaseAuthenticate``, 
  only that your authentication object implements an ``authenticate()`` method.  
  The ``BaseAuthenticate`` class provides a number of helpful methods that are commonly used.  
  You can also implement a ``getUser()`` method if your authentication object needs 
  to support stateless or cookie-less authentication. 
  See the sections on basic and digest authentication below for more information.

カスタム認証オブジェクトの利用
-----------------------------------

..
  Using custom authentication objects

カスタム認証オブジェクトを作成したら、AuthComponents の authenticate 配列内にそれを含めることで利用することができます::

..
  Once you've created your custom authentication object, you can use them by including them in AuthComponents authenticate array::

    <?php
    $this->Auth->authenticate = array(
        'Openid', // app内の認証オブジェクト
        'AuthBag.Combo', // プラグインの認証オブジェクト
    );


ユーザの識別とログイン
-------------------------------------

..
  Identifying users and logging them in

以前の ``AuthComponent`` は自動的にログインを行っていました。
これに混乱する人が多く、時には AuthComponent の利用をやや難しくしていました。
2.0 でログインしたい場合には、手動で ``$this->Auth->login()`` を呼び出す必要があります。

..
  In the past ``AuthComponent`` auto-magically logged users in.  
  This was confusing for many people, and made using AuthComponent a bit difficult at times.  
  For 2.0, you'll need to manually call ``$this->Auth->login()`` to log a user in.

ユーザを認証する際には、設定されている認証オブジェクトを設定された順にチェックしていきます。
あるオブジェクトでユーザが識別できたら、以降のオブジェクトはチェックされません。
ログインフォームと連携する単純な login 関数なら次のようになります::

..
  When authenticating users, attached authentication objects are checked in the order they are attached.
  Once one of the objects can identify the user, no other objects are checked.  
  A sample login function for working with a login form could look like::

    <?php
    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            } else {
                $this->Session->setFlash(__('ユーザ名もしくはパスワードが正しくありません。'), 'default', array(), 'auth');
            }
        }
    }

上記のコードは（``login`` メソッドに渡される情報以外は）、POSTデータを使ってユーザをログインさせようとします。
ログインが成功ならユーザが最後に訪れていたページか :php:attr:`AuthComponent::$loginRedirect` へと redirect します。ログインが失敗なら、フラッシュメッセージがセットされます。

..
  The above code (without any data passed to the ``login`` method), 
  will attempt to log a user in using the POST data, 
  and if successful redirect the user to either the last page they were visiting,
  or :php:attr:`AuthComponent::$loginRedirect`.  If the login is unsuccessful, a flash message is set.

.. warning::

    1.3 の ``$this->Auth->login($this->data)`` では、ユーザの識別を試みて成功したときのみログインが行われましたが、
    2.0 では ``$this->Auth->login($this->request->data)`` でなにが POST されたのだとしてもログインを行います。

    ..
      In 2.0 ``$this->Auth->login($this->request->data)`` will log the user in with whatever data is posted,
      whereas in 1.3 ``$this->Auth->login($this->data)`` would try to identify the user first and only log in when successful.

ログインでのダイジェスト認証・Basic認証の利用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
..
  Using Digest and Basic Authentication for logging in

Basic認証・ダイジェスト認証では、ログイン処理の前に実行される、最初の POST を必要としないため、あなたが実装した ``login()`` 関数は ``FormAuthentication`` を使う場合とい若干異なります。

..
  Because basic and digest authentication don't require an initial POST to be performed before they initiate the login sequence, 
  your ``login()`` function will look a bit different than when using ``FormAuthentication``::

    <?php
    public function login() {
        if ($this->Auth->login()) {
            return $this->redirect($this->Auth->redirect());
        } else {
            $this->Session->setFlash(__('ユーザ名もしくはパスワードが正しくありません。'), 'default', array(), 'auth');
        }
    }

ログイン後、ダイジェスト認証・Basic認証を使うユーザはクッキーが必要ありません。
実際のところ、すべての認証オブジェクトは ``getUser()`` メソッドを実装することで *ステートレス* な認証を提供することが可能です。
クライアントがクッキーをサポートする場合は、Basic認証もダイジェスト認証も、他の認証オブジェクトと同様にセッションにユーザを保管します。
クライアントがクッキーをサポートしない場合（CURL上に構築された単純なHTTPクライアントなどの場合）は、ステートレス認証もサポートされます。
ステートレス認証はリクエストごとにユーザの認証情報を再照合します。これにより若干のオーバーヘッドが生まれますが、クッキーをサポートしないかできないユーザでもログインできるようになります。

..
  Once logged in, users using digest and basic auth are not required to have cookies.  
  In fact, all authentication objects are able to provide *stateless* authentication through implementing the ``getUser()`` method.
  If the client supports cookies, basic and digest auth will store a user in session much like any other authentication object.  
  If a client doesn't support cookies, (such as a simple HTTP client built on top of CURL) stateless authentication is also supported.  
  Stateless authentication will re-verify the user's credentials on each request,
  this creates a small amount of additional overhead, but allows clients that cannot or do not support cookies to login in.

ステートレス認証システムの作成
-----------------------------------------

..
  Creating stateless authentication systems

認証オブジェクトはクッキーに依存しないユーザログインのシステムをサポートするために使われる ``getUser()`` メソッドを実装することができます。
典型的な getUser メソッドはリクエストや環境を見て、ユーザを識別するためにその情報を使います。
HTTP Basic認証の例を挙げると、ユーザ名とパスワードの値として ``$_SERVER['PHP_AUTH_USER']`` と ``$_SERVER['PHP_AUTH_PW']`` を使います。
リクエストごとに、もしクライアントがクッキーをサポートしていないなら、それらの値を再度ユーザを識別するために使い、正規のユーザであることを確認します。
認証オブジェクトの ``authenticate()`` メソッドと同様に、``getUser()`` メソッドも成功ならユーザ情報の配列を、失敗なら ``false`` を返すようにしてください::

..
  Authentication objects can implement a ``getUser()`` method that can be used to support user login systems that don't rely on cookies.  
  A typical getUser method looks at the request/environment and uses the information there to confirm the identity of the user.  
  HTTP Basic authentication for example uses ``$_SERVER['PHP_AUTH_USER']`` and ``$_SERVER['PHP_AUTH_PW']`` for the username and password fields.  
  On each request, if a client doesn't support cookies, these values are used to re-identify the user and ensure they are valid user.  
  As with authentication object's ``authenticate()`` method the ``getUser()`` method should return an array of user information on success, 
  and ``false`` on failure.::

    <?php
    public function getUser($request) {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

上記では HTTP Basic認証用の getUser メソッドをどのように実行できるのかを示しています。
``_findUser()`` メソッドは ``BaseAuthenticate`` の一部でユーザ名、パスワードをもとにユーザを識別します。

..
  The above is how you could implement getUser method for HTTP basic authentication.  
  The ``_findUser()`` method is part of ``BaseAuthenticate`` and identifies a user based on a username and password.


認証についてのフラッシュメッセージの表示
--------------------------------------

..
  Displaying auth related flash messages

Auth が生成するセッションエラーメッセージを表示するためには、次のコードをあなたのレイアウトに加えなければなりません。
``app/View/Layouts/default.ctp`` ファイルに次の２行を加えてください。content_for_layout 行の前★にある body 部の中がよいでしょう::

..
  In order to display the session error messages that Auth generates, you need to add the following code to your layout. 
  Add the following two lines to the ``app/View/Layouts/default.ctp`` file in the body section preferable before the content_for_layout line.::

    <?php
    echo $this->Session->flash();
    echo $this->Session->flash('auth');
    ?>

AuthComponent の flash 設定を使うことでエラーメッセージをカスタマイズすることができます。
``$this->Auth->flash`` を使うことで、AuthComponent がフラッシュメッセージのために使うパラメータを設定することができます。
利用可能なキーは次のとおりです。

..
  You can customize the error messages, and flash settings AuthComponent uses.  
  Using ``$this->Auth->flash`` you can configure the parameters AuthComponent uses for setting flash messages.  
  The available keys are 

- ``element`` - 使用されるエレメント。デフォルトは 'default'
- ``key`` - 使用されるキー。デフォルトは 'auth'
- ``params`` - 使用される追加の params 配列。デフォルトは array()

..
  - ``element`` - The element to use, defaults to 'default'.
  - ``key`` - The key to use, defaults to 'auth'
  - ``params`` - The array of additional params to use, defaults to array()

フラッシュメッセージの設定だけでなく、AuthComponent が使用する他のエラーメッセージをカスタマイズすることもできます。
あなた自身のコントローラの beforeFilter の中や component の設定で、認証が失敗した際に使われるエラーをカスタマイズするのに ``authError`` を使うことができます::

..
  In addition to the flash message settings you can customize other error messages AuthComponent uses. 
  In your controller's beforeFilter, or component settings you can use ``authError`` to customize the error used for when authorization fails::


    <?php
    $this->Auth->authError = "このエラーは保護されたWebサイトの一部にユーザがアクセスしようとした際に表示されます。";

パスワードのハッシュ化
----------------------

..
  Hashing passwords

AuthComponent がもはや自動ではパスワードをハッシュ化しなくなったことに、気づいたかもしれません。
これは妥当性チェックのような多くの共通タスクを難しいものにしていたため、取り除かれました。
パスワードを平文テキストのまま保管しては **いけません**。ユーザのレコードを保存する前に、パスワードは必ずハッシュ化するべきです。
ユーザを保存する前にパスワードをハッシュ化するために、static の ``AuthComponent::password()`` を使うことができます。
これはあなたのアプリケーションでハッシュ化する際の戦略を設定するために使われるものです。

..
  AuthComponent no longer automatically hashes every password it can find.
  This was removed because it made a number of common tasks like validation difficult.  
  You should **never** store plain text passwords, and before saving a user record you should always hash the password.
  You can use the static ``AuthComponent::password()`` to hash passwords before saving them.  
  This will use the configured hashing strategy for your application.

パスワードの妥当性チェックのあと、あなたのモデルの beforeSave コールバックの中でパスワードをハッシュ化することができます::
..
  After validating the password, you can hash a password in the beforeSave callback of your model::

    <?php
    class User extends AppModel {
        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
            return true;
        }
    }

``$this->Auth->login()`` を呼び出す前にパスワードをハッシュ化する必要はありません。
さまざまな認証オブジェクトが個々にパスワードをハッシュ化します。
ダイジェスト認証を使う場合、パスワードの生成に AuthComponent::password() を使ってはいけません。
ダイジェストのハッシュを生成する方法については下記を参照してください。

..
  You don't need to hash passwords before calling ``$this->Auth->login()``.
  The various authentication objects will hash passwords individually. 
  If you are using Digest authentication, you should not use AuthComponent::password() for generating passwords.  
  See below for how to generate digest hashes.


ダイジェスト認証のパスワードのハッシュ化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

..
  Hashing passwords for digest authentication

ダイジェスト認証は RFC で定義されたフォーマットでハッシュ化されたパスワードが必要です。
パスワードをダイジェスト認証で使用できるよう正しくハッシュ化するために、特別なパスワードハッシュ化の関数 ``DigestAuthenticate`` を使ってください。
ダイジェスト認証とその他の認証戦略を合わせて利用する場合には、通常のハッシュ化パスワードとは別のカラムでダイジェストパスワードを保管するのをお勧めします::

..
  Because Digest authentication requires a password hashed in the format defined by the RFC.  
  In order to correctly hash a password for use with Digest authentication you should use the special password hashing function on ``DigestAuthenticate``. 
  If you are going to be combining digest authentication with any other authentication strategies, 
  it's also recommended that you store the digest password in a separate column, from the normal password hash::

    <?php
    class User extends AppModel {
        public function beforeSave($options = array()) {
            // make a password for digest auth.
            $this->data['User']['digest_hash'] = DigestAuthenticate::password(
                $this->data['User']['username'], $this->data['User']['password'], env('SERVER_NAME')
            );
            return true;
        }
    }

ダイジェスト認証用のパスワードは、ダイジェスト認証の RFC に基づき、他のハッシュ化パスワードよりもやや多くの情報を要求します。
ダイジェストハッシュのために AuthComponent::password() を使うとログインできなくなってしまいます。

..
  Passwords for digest authentication need a bit more information than other password hashes, based on the RFC for digest authentication. 
  If you use AuthComponent::password() for digest hashes you will not be able to login.

.. note::

    AuthComponent::$authenticate 内で DigestAuthentication が設定された場合、
    DigestAuthenticate::password() の第３パラメータは定義した 'realm' の設定値と一致する必要があります。
    複数の環境で一貫したハッシュが欲しい場合に static な文字列を使いたいと思うかもしれません。
    
    ..
      The third parameter of DigestAuthenticate::password() must match the 'realm' config value defined 
      when DigestAuthentication was configured in AuthComponent::$authenticate.  This defaults to ``env('SCRIPT_NAME)``.
      You may wish to use a static string if you want consistent hashes in multiple environments.

手動でのユーザログイン
-------------------------

..
  Manually logging users in

独自のアプリケーションを登録した直後など、時には手動によるログインが必要になる事態が発生することもあるでしょう。
ログインさせたいユーザデータを引数に ``$this->Auth->login()`` を呼び出すことで、これを実現することができます::

..
  Sometimes the need arises where you need to manually log a user in, such as just after they registered for your application.  
  You can do this by calling ``$this->Auth->login()`` with the user data you want to 'login'::

    <?php
    public function register() {
        if ($this->User->save($this->request->data)) {
            $id = $this->User->id;
            $this->request->data['User'] = array_merge($this->request->data['User'], array('id' => $id));
            $this->Auth->login($this->request->data['User']);
            $this->redirect('/users/home');
        }
    }

.. warning::

    login メソッドに渡される配列に新たなユーザIDが追加されていることを必ず確認してください。そうでない場合、そのユーザIDが利用できなくなってしまいます。
    
    ..
      Be sure to manually add the new User id to the array passed to the login method. Otherwise you won't have the user id available.

ログインしたユーザのアクセス
----------------------------

..
  Accessing the logged in user

ユーザがログインしたあと、現状のそのユーザについての特定の情報が必要になることもあるでしょう。
``AuthComponent::user()`` を使うことで、現在ログインしているそのユーザにアクセスすることができます。
このメソッドは static で、AuthComponent がロードされたあと、global に使うこともできます。
インスタンスメソッドとしても、static メソッドとしてもアクセス可能です::

..
  Once a user is logged in, you will often need some particular information about the current user.  
  You can access the currently logged in user using ``AuthComponent::user()``.  
  This method is static, and can be used globally after the AuthComponent has been loaded. 
  You can access it both as an instance method or as a static method::

    <?php
    // どこからでも利用できます。
    AuthComponent::user('id')

    // Controllerの中でのみ利用できます。
    $this->Auth->user('id');


ログアウト
----------

..
  Logging users out

最終的には認証を解除し、適切な場所へとリダイレクトするためのてっとり早い方法がほしくなるでしょう。
このメソッドはあなたのアプリケーション内のメンバーページに 'ログアウト' リンクを入れたい場合にも便利です。

..
  Eventually you'll want a quick way to de-authenticate someone, and redirect them to where they need to go. 
  This method is also useful if you want to provide a 'Log me out' link inside a members' area of your application::

    <?php
    public function logout() {
        $this->redirect($this->Auth->logout());
    }

ダイジェスト／Basic認証でログインしたユーザのログアウトを、すべてのクライアントで成し遂げるのは難しいものです。
多くのブラウザは開いている間だけ継続する認証情報を保有しています。
クライアントの中には 401 のステータスコードを送信して強制的にログアウトすることがありえます。
認証 realm の変更は、一部のクライアントで機能させるためのもう１つの解決法です。

..
  Logging out users that logged in with Digest or Basic auth is difficult to accomplish for all clients.  
  Most browsers will retain credentials for the duration they are still open.  
  Some clients can be forced to logout by sending a 401 status code.  
  Changing the authentication realm is another solution that works for some clients.

.. _authorization-objects:

権限判定
========

..
  Authorization

権限判定は識別され認証されたユーザが、要求するリソースへのアクセスを要求どおりに許可してよいのかを確たるものにするための処理です。
有効な ``AuthComponent`` が自動的に認証ハンドラをチェックし、ログインしたユーザが要求どおりにリソースへのアクセスを許可するかどうかを確認します。
組み込み済みの認証ハンドラがいくつか存在しますので、あなたのアプリケーション用にカスタム版を作成したり、プラグインの一部として作成することができます。

  Authorization is the process of ensuring that an identified/authenticated user is allowed to access the resources they are requesting.  
  If enabled ``AuthComponent`` can automatically check authorization handlers and ensure that logged in users are allowed to access the resources 
  they are requesting.  
  There are several built-in authorization handlers, and you can create custom ones for your application, or as part of a plugin.

- ``ActionsAuthorize`` アクションレベルでパーミッションをチェックするために AclComponent を使います。
- ``CrudAuthorize`` リソースへのパーミッションをチェックするために、AclComponent と、アクション -> CRUD のマッピングを使います。
- アクティブなコントローラの ``ControllerAuthorize`` Calls ``isAuthorized()`` on the active controller, and uses the return of that to authorize a user.
This is often the most simple way to authorize users.★

..
  - ``ActionsAuthorize`` Uses the AclComponent to check for permissions on an action level.
  - ``CrudAuthorize`` Uses the AclComponent and action -> CRUD mappings to check permissions for resources.
  - ``ControllerAuthorize`` Calls ``isAuthorized()`` on the active controller, and uses the return of that to authorize a user.
    This is often the most simple way to authorize users.

権限判定ハンドラの設定
----------------------

..
  Configuring Authorization handlers

権限判定ハンドラの設定は ``$this->Auth->authorize`` で行います。
１つ以上の権限判定のハンドラを設定できます。
複数のハンドラを使うことで、さまざまな権限判定の方法をサポートできます。
権限判定ハンドラがチェックされる際には、宣言された順に呼び出されます。
ハンドラは権限判定のチェックができなかったり、チェックが失敗なら、false を返してください。
権限判定のチェックができて、結果が成功なら、true を返してください。
ハンドラはいずれかに通過できるまで、順番に呼び出されます。
すべてのチェック結果が失敗なら、ユーザは元いたページへとリダイレクトされます。
また、例外を投げることですべての権限判定を失敗にすることができます。
投げられたいかなる例外もキャッチしなければならず、必要に応じてそれらに対処しなければなりません。

..
  You configure authorization handlers using ``$this->Auth->authorize``.
  You can configure one or many handlers for authorization.  
  Using multiple handlers allows you to support different ways of checking authorization.  
  When authorization handlers are checked, they will be called in the order they are declared.  
  Handlers should return false, if they are unable to check authorization, or the check has failed.
  Handlers should return true if they were able to check authorization successfully. 
  Handlers will be called in sequence until one passes.  
  If all checks fail, the user will be redirected to the page they came from.
  Additionally you can halt all authorization by throwing an exception.
  You will need to catch any thrown exceptions, and handle them.

あなたのコントローラの ``beforeFilter`` の中や ``$components`` 配列の中で権限判定ハンドラの設定を行うことができます。
配列を使って、各権限判定オブジェクトに設定情報を渡すことができます::

..
  You can configure authorization handlers in your controller's ``beforeFilter`` or, in the ``$components`` array.  
  You can pass configuration information into each authorization object, using an array::

    <?php
    // 基本的な設定法
    $this->Auth->authorize = array('Controller');

    // 設定を中に記述
    $this->Auth->authorize = array(
        'Actions' => array('actionPath' => 'controllers/'),
        'Controller'
    );

``Auth->authorize`` も ``Auth->authenticate`` とほぼ同様で、``all`` キーを使うことでコードを DRY に保ちやすくなります。
この特別なキーにより、設定されたすべてのオブジェクトに渡す設定を記述することができます。
all キーは ``AuthComponent::ALL`` と記述することもできます::

..
  Much like ``Auth->authenticate``, ``Auth->authorize``, helps you keep your code DRY, by using the ``all`` key. 
  This special key allows you to set settings that are passed to every attached object. 
  The all key is also exposed as ``AuthComponent::ALL``::

    <?php
    // 'all' を使って設定を記述
    $this->Auth->authorize = array(
        AuthComponent::ALL => array('actionPath' => 'controllers/'),
        'Actions',
        'Controller'
    );

上記の例では、``Actions`` と ``Controller`` の両方ともが 'all' キーで宣言された設定を取得することになります。
特定の権限判定オブジェクトに個別に書いた設定は 'all' キーの同名のキーの情報をオーバーライドします。
コアの権限判定オブジェクトでは次の設定キーをサポートしています。

- ``actionPath`` ACO ツリー内の ACO ★ ``ActionsAuthorize`` によって使わます。to locate controller action ACO's in the ACO tree.
- ``actionMap`` アクション -> CRUD のマッピング。CRUD ロールにアクションをマッピングしたい ``CrudAuthorize`` もしくは権限判定オブジェクトによって使われます。
- ``userModel`` ARO/モデル のノード名。これ以下からユーザ情報を探します。ActionsAuthorize で使われます。

..
  In the above example, both the ``Actions`` and ``Controller`` will get the settings defined for the 'all' key. 
  Any settings passed to a specific authorization object will override the matching key in the 'all' key.
  The core authorize objects support the following configuration keys.
  - ``actionPath`` Used by ``ActionsAuthorize`` to locate controller action ACO's in the ACO tree.
  - ``actionMap`` Action -> CRUD mappings.  Used by ``CrudAuthorize`` and authorization objects that want to map actions to CRUD roles.
  - ``userModel`` The name of the ARO/Model node user information can be found under. Used with ActionsAuthorize.


カスタム権限判定オブジェクトの生成
----------------------------------

..
  Creating Custom Authorize objects

権限判定オブジェクトはプラガブルなので、カスタム権限判定オブジェクトを自分のアプリケーション内にでも、プラグインとしてでも作成が可能です。
もし例えば、LDAP 権限判定オブジェクトを作成したいのだとしたら、``app/Controller/Component/Auth/LdapAuthorize.php`` の中で次のように記述することができます::

    <?php
    App::uses('BaseAuthorize', 'Controller/Component/Auth');

    class LdapAuthorize extends BaseAuthorize {
        public function authorize($user, CakeRequest $request) {
            // LDAP 用の処理をここに記述します。
        }
    }

..
  Because authorize objects are pluggable, you can create custom authorize objects in your application or plugins. 
  If for example you wanted to create an LDAP authorize object. 
  In ``app/Controller/Component/Auth/LdapAuthorize.php`` you could put the following::


権限判定オブジェクトは

..
  Authorize objects should return ``false`` if the user is denied access, or
if the object is unable to perform a check.  If the object is able to
verify the user's access, ``true`` should be returned. It's not required
that you extend ``BaseAuthorize``, only that your authorize object
implements an ``authorize()`` method.  The ``BaseAuthorize`` class provides
a number of helpful methods that are commonly used.

Using custom authorize objects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once you've created your custom authorize object, you can use them by
including them in AuthComponents authorize array::

    <?php
    $this->Auth->authorize = array(
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    );

Using no authorization
----------------------

If you'd like to not use any of the built-in authorization objects, and
want to handle things entirely outside of AuthComponent you can set
``$this->Auth->authorize = false;``.  By default AuthComponent starts off
with ``authorize = false``.  If you don't use an authorization scheme,
make sure to check authorization yourself in your controller's
beforeFilter, or with another component.


Making actions public
---------------------

There are often times controller actions that you wish to remain
entirely public, or that don't require users to be logged in.
AuthComponent is pessimistic, and defaults to denying access. You can
mark actions as public actions by using ``AuthComponent::allow()``.  By
marking actions as public, AuthComponent, will not check for a logged in
user, nor will authorize objects be checked::

    <?php
    // Allow all actions. CakePHP 2.0
    $this->Auth->allow('*');

    // Allow all actions. CakePHP 2.1
    $this->Auth->allow();

    // Allow only the view and index actions.
    $this->Auth->allow('view', 'index');

    // Allow only the view and index actions.
    $this->Auth->allow(array('view', 'index'));

You can provide as many action names as you need to ``allow()``.  You can
also supply an array containing all the action names.

Making actions require authorization
------------------------------------

If after making actions public, you want to revoke the public access.
You can do so using ``AuthComponent::deny()``::

    <?php
    // remove one action
    $this->Auth->deny('add');

    // remove all the actions.
    $this->Auth->deny();

    // remove a group of actions.
    $this->Auth->deny('add', 'edit');
    $this->Auth->deny(array('add', 'edit'));

You can provide as many action names as you need to ``deny()``.  You can
also supply an array containing all the action names.

Mapping actions when using CrudAuthorize
----------------------------------------

When using CrudAuthorize or any other authorize objects that use action
mappings, it might be necessary to map additional methods.  You can
map actions -> CRUD permissions using mapAction().  Calling this on
AuthComponent will delegate to all the of the configured authorize
objects, so you can be sure the settings were applied every where::

    <?php
    $this->Auth->mapActions(array(
        'create' => array('register'),
        'view' => array('show', 'display')
    ));

The keys for mapActions should be the CRUD permissions you want to set,
while the values should be an array of all the actions that are mapped
to the CRUD permission.

Using ControllerAuthorize
-------------------------

ControllerAuthorize allows you to handle authorization checks in a
controller callback. This is ideal when you have very simple
authorization, or you need to use a combination of models + components
to do your authorization, and don't want to create a custom authorize
object.

The callback is always called ``isAuthorized()`` and it should return a
boolean as to whether or not the user is allowed to access resources in
the request. The callback is passed the active user, so it can be
checked::

    <?php
    class AppController extends Controller {
        public $components = array(
            'Auth' => array('authorize' => 'Controller'),
        );
        public function isAuthorized($user = null) {
            // Any registered user can access public functions
            if (empty($this->request->params['admin'])) {
                return true;
            }

            // Only admins can access admin functions
            if (isset($this->request->params['admin'])) {
                return (bool)($user['role'] === 'admin');
            }

            // Default deny
            return false;
        }
    }

The above callback would provide a very simple authorization system
where, only users with role = admin could access actions that were in
the admin prefix.


Using ActionsAuthorize
----------------------

ActionsAuthorize integrates with the AclComponent, and provides a fine grained per action ACL check on each request.  ActionsAuthorize is often
paired with DbAcl to give dynamic and flexible permission systems that
can be edited by admin users through the application.  It can however,
be combined with other Acl implementations such as IniAcl and custom
application Acl backends.

Using CrudAuthorize
-------------------

``CrudAuthorize`` integrates with AclComponent, and provides the ability to
map requests to CRUD operations.  Provides the ability to authorize
using CRUD mappings. These mapped results are then checked in the
AclComponent as specific permissions.

For example, taking ``/posts/index`` as the current request.  The default
mapping for ``index``, is a ``read`` permission check. The Acl check would
then be for the ``posts`` controller with the ``read`` permission.  This
allows you to create permission systems that focus more on what is being
done to resources, rather than the specific actions being visited.

AuthComponent API
=================

AuthComponent is the primary interface to the built-in authorization
and authentication mechanics in CakePHP.

.. php:attr:: ajaxLogin

    The name of an optional view element to render when an Ajax request is made
    with an invalid or expired session

.. php:attr: allowedActions

    Controller actions for which user validation is not required.

.. php:attr:: authenticate

    Set to an array of Authentication objects you want to use when
    logging users in. There are several core authentication objects,
    see the section on :ref:`authentication-objects`

.. php:attr:: authError

    Error to display when user attempts to access an object or action to which
    they do not have access.

.. php:attr:: authorize

    Set to an array of Authorization objects you want to use when
    authorizing users on each request, see the section on
    :ref:`authorization-objects`

.. php:attr:: components

    Other components utilized by AuthComponent

.. php:attr:: flash

    Settings to use when Auth needs to do a flash message with
    :php:meth:`SessionComponent::setFlash()`.
    Available keys are:

    - ``element`` - The element to use, defaults to 'default'.
    - ``key`` - The key to use, defaults to 'auth'
    - ``params`` - The array of additional params to use, defaults to array()

.. php:attr:: loginAction

    A URL (defined as a string or array) to the controller action that handles
    logins.  Defaults to `/users/login`

.. php:attr:: loginRedirect

    The URL (defined as a string or array) to the controller action users
    should be redirected to after logging in. This value will be ignored if the
    user has an ``Auth.redirect`` value in their session.

.. php:attr:: logoutRedirect

    The default action to redirect to after the user is logged out. While
    AuthComponent does not handle post-logout redirection, a redirect URL will
    be returned from :php:meth:`AuthComponent::logout()`. Defaults to
    :php:attr:`AuthComponent::$loginAction`.

.. php:attr:: request

    Request object

.. php:attr:: response

    Response object

.. php:attr:: sessionKey

    The session key name where the record of the current user is stored. If
    unspecified, it will be "Auth.User".

.. php:method:: allow($action, [$action, ...])

    Set one or more actions as public actions, this means that no
    authorization checks will be performed for the specified actions.
    The special value of ``'*'`` will mark all the current controllers
    actions as public. Best used in your controller's beforeFilter
    method.

.. php:method:: constructAuthenticate()

    Loads the configured authentication objects.

.. php:method:: constructAuthorize()

    Loads the authorization objects configured.

.. php:method:: deny($action, [$action, ...])

    Toggle one more more actions previously declared as public actions,
    as non-public methods.  These methods will now require
    authorization.  Best used inside your controller's beforeFilter
    method.

.. php:method:: flash($message)

    Set a flash message. Uses the Session component, and values from
    :php:attr:`AuthComponent::$flash`.

.. php:method:: identify($request, $response)

    :param CakeRequest $request: The request to use.
    :param CakeResponse $response: The response to use, headers can be
        sent if authentication fails.

    This method is used by AuthComponent to identify a user based on the
    information contained in the current request.

.. php:method:: initialize($Controller)

    Initializes AuthComponent for use in the controller.

.. php:method:: isAuthorized($user = null, $request = null)

    Uses the configured Authorization adapters to check whether or not a user
    is authorized. Each adapter will be checked in sequence, if any of them
    return true, then the user will be authorized for the request.

.. php:method:: loggedIn()

    Returns true if the current client is a logged in user, or false if
    they are not.

.. php:method:: login($user)

    :param array $user: Array of logged in user data.

    Takes an array of user data to login with.  Allows for manual
    logging of users.  Calling user() will populate the session value
    with the provided information.  If no user is provided,
    AuthComponent will try to identify a user using the current request
    information.  See :php:meth:`AuthComponent::identify()`

.. php:method:: logout()

    :return: A string url to redirect the logged out user to.

    Logs out the current user.

.. php:method:: mapActions($map = array())

    Maps action names to CRUD operations. Used for controller-based
    authentication. Make sure to configure the authorize property before
    calling this method. As it delegates $map to all the attached authorize
    objects.

.. php:staticmethod:: password($pass)

    Hash a password with the application's salt value.

.. php:method:: redirect($url = null)

    If no parameter is passed, gets the authentication redirect URL. Pass a
    url in to set the destination a user should be redirected to upon logging
    in. Will fallback to :php:attr:`AuthComponent::$loginRedirect` if there is
    no stored redirect value.

.. php:method:: shutdown($Controller)

    Component shutdown. If user is logged in, wipe out redirect.

.. php:method:: startup($Controller)

    Main execution method. Handles redirecting of invalid users, and
    processing of login form data.

.. php:staticmethod:: user($key = null)

    :param string $key:  The user data key you want to fetch if null,
        all user data will be returned.  Can also be called as an instance
        method.

    Get data concerning the currently logged in user, you can use a
    property key to fetch specific data about the user::

        <?php
        $id = $this->Auth->user('id');

    If the current user is not logged in or the key doesn't exist, null will
    be returned.


.. meta::
    :title lang=en: Authentication
    :keywords lang=en: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
