認証
####

.. php:class:: AuthComponent(ComponentCollection $collection, array $settings = array())

ユーザを識別し、認証し、権限を付与することは、ほとんどすべてのウェブアプリケーションに
共通の機能です。CakePHP の AuthComponent ではそういったタスクを実行するための
プラガブルな方法を提供します。AuthComponent により、認証オブジェクトと、ユーザの権限を
識別・判定する柔軟な仕組みを作るための権限判定オブジェクトを組み合わせることが
できるようになります。

.. _authentication-objects:

以降を読む前に
=================

認証の設定には、ユーザーテーブルの定義、モデルやコントローラーやビューの作成など、
いくつかのステップが必要です。

:doc:`ブログチュートリアル </tutorials-and-examples/blog-auth-example/auth>`
の中で順を追って説明しています。

認証
====

認証とは、与えられた認証情報によりユーザを識別し、そのユーザが言うとおりの人物であることを
確実なものにする処理のことです。たいていの場合、これはユーザ名とパスワードにより行われ、
それと既知のユーザリストを照らし合わせます。CakePHP には、あなたのアプリケーション内に
保管されているユーザを認証するための組み込み済みの方法がいくつか存在します。

* ``FormAuthenticate`` では、POST されたデータをもとに認証を行うことが可能です。
  通常これは、ユーザが情報を入力するログインフォームです。
* ``BasicAuthenticate`` では、Basic HTTP 認証を使った認証を行うことが可能です。
* ``DigestAuthenticate`` では、ダイジェスト HTTP 認証を使った認証を行うことが可能です。

デフォルトで ``AuthComponent`` は ``FormAuthenticate`` を使用します。

認証タイプの選択
----------------

大抵の場合はフォームに基づく認証を利用したいと思うでしょう。これはウェブブラウザを
使うユーザにとってはもっとも簡単な方法です。もし、API やウェブサービスを構築しているなら、
Basic 認証やダイジェスト認証も考慮したくなるかもしれません。ダイジェスト認証と Basic 認証の
重要な違いはほとんどどのようにパスワードを扱うかということにあります。Basic 認証では、
ユーザ名とパスワードは平文のテキストとしてサーバに送信されます。そのため Basic 認証は
SSL を使わないアプリケーションには向いていません。これは、慎重に扱うべきパスワードが
露出してしまう可能性があるためです。ダイジェスト認証はユーザ名やパスワード、
そのほかのいくつかの詳細情報のダイジェストハッシュを使います。そのため ダイジェスト認証は
SSL を使わないアプリケーションにもふさわしいものです。

また、OpenID のような認証システムを使うことも可能です。ただし、OpenID は CakePHP の
コアには含まれません。

認証を設定するためのハンドラ
----------------------------

認証ハンドラは ``$this->Auth->authenticate`` を使って設定します。
認証に使うハンドラを１つもしくは複数設定することができます。複数のハンドラを
設定することで、複数のログインの仕組みをサポートすることが可能です。
ユーザがログインする際、認証ハンドラは宣言されている順に判定されます。
あるハンドラで識別ができたら、それ以降のハンドラでは判定されません。
逆に、例外を投げることですべての認証を失敗にすることもできます。
投げられたいかなる例外もキャッチしなければならず、
必要に応じてそれらに対処しなければなりません。

コントローラの ``beforeFilter`` の中、もしくは ``$components`` 配列の中に、
認証ハンドラをいくつでも設定することができます。次のようにすることで各認証オブジェクトへと
設定情報を渡すことができます::

    // 基本的な設定法
    $this->Auth->authenticate = array('Form');

    // 設定を中に記述
    $this->Auth->authenticate = array(
        'Basic' => array('userModel' => 'Member'),
        'Form' => array('userModel' => 'Member')
    );

上記の２つ目のブロックでは、 ``userModel`` キーを２回宣言しなければならないということに
気づいたでしょう。コードを DRY に保ちたいなら、 ``all`` キーを使うことができます。
この特別なキーを使うことで、列挙したオブジェクトすべてに設定が渡されることになります。
all キーは ``AuthComponent::ALL`` と記述することもできます::

    // 'all' を使って設定を記述
    $this->Auth->authenticate = array(
        AuthComponent::ALL => array('userModel' => 'Member'),
        'Basic',
        'Form'
    );

上記の例では、``Form`` と ``Basic`` の両方ともが  'all' キーで宣言された設定を
取得することになります。特定の認証オブジェクトに個別に書いた設定は 'all' キーの同名の
キーの情報をオーバーライドします。コアの認証オブジェクトでは次の設定キーをサポートしています。

- ``fields`` ユーザを識別するのに使う列名の配列。
- ``userModel`` User のモデル名。デフォルトは User。
- ``scope`` 認証するユーザを検索する際に使う、追加の条件。
  例： ``array('User.is_active' => 1)``
- ``recursive`` ``find()`` に渡された recursive キーの値。 デフォルトは ``0`` 。
- ``contain`` ユーザのレコードがロードされた際に含めることのできるオプション。
  もしこのオプションを使用したい場合、モデルに Containable ビヘイビアを追加する必要があります。

  .. versionadded:: 2.2

- ``passwordHasher`` パスワードをハッシュするクラス。デフォルトは ``Simple`` 。

  .. versionadded:: 2.4

- ``userFields`` ``userModel`` から取得するフィールドの一覧。このオプションは、
  カラムの多いユーザーテーブルで全てのカラムがセッションに必要ないときに便利です。
  デフォルトでは全てのフィールドを取得します。

  .. versionadded:: 2.6

配列 ``$components`` の中でユーザの特定の列名を設定するには::

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


Auth の他の設定キー(authError や loginAction など) を authenticate や Form の
下位要素として書いてはいけません。それらは authenticate キーと同じレベルであるべきです。
上記の例を他の Auth 設定を使って書いた場合は次のようになります::

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
                    'fields' => array(
                      'username' => 'my_user_model_username_field', //Default is 'username' in the userModel
                      'password' => 'my_user_model_password_field'  //Default is 'password' in the userModel
                    )
                )
            )
        )
    );

共通の設定に加えて、Basic 認証では次のキーも利用できます:

- ``realm`` 認証される realm。デフォルトでは ``env('SERVER_NAME')`` 。

共通の設定に加えて、ダイジェスト認証では次のキーも利用できます:

- ``realm`` realm 認証の認証先。デフォルトはサーバ名。
- ``nonce`` 認証で使われる nonce。デフォルトは ``uniqid()``。
- ``qop`` デフォルトは auth。現時点では他の値はサポートされていない。
- ``opaque`` クライアントから変更されることなく戻されるべき文字列。デフォルトでは
  ``md5($settings['realm'])`` 。

ユーザの識別とログイン
----------------------

以前の ``AuthComponent`` は自動的にログインを行っていました。
これに混乱する人が多く、時には AuthComponent の利用をやや難しくしていました。
2.0 でログインしたい場合には、手動で ``$this->Auth->login()`` を呼び出す必要があります。

ユーザを認証する際には、設定されている認証オブジェクトを設定された順にチェックしていきます。
あるオブジェクトでユーザが識別できたら、以降のオブジェクトはチェックされません。
ログインフォームと連携する単純な login 関数なら次のようになります::

    public function login() {
        if ($this->request->is('post')) {
            // Important: Use login() without arguments! See warning below.
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
                // 2.3より前なら
                // `return $this->redirect($this->Auth->redirect());`
            }
            $this->Flash->error(
                __('Username or password is incorrect')
            );
            // 2.7 より前なら
            // $this->Session->setFlash(__('Username or password is incorrect'));
        }
    }

上記のコードは（``login`` メソッドに渡される情報以外は）、POST データを使ってユーザを
ログインさせようとします。ログインが成功ならユーザが最後に訪れていたページか
:php:attr:`AuthComponent::$loginRedirect` へと redirect します。
ログインが失敗なら、フラッシュメッセージがセットされます。

.. warning::

    1.3 の ``$this->Auth->login($this->data)`` では、ユーザの識別を試みて成功したときのみログインが行われましたが、
    2.x では ``$this->Auth->login($this->request->data)`` でなにが POST されたのだとしてもログインを行います。

ログインでのダイジェスト認証・Basic 認証の利用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Basic 認証およびダイジェスト認証は初期POSTやフォームを必要としないので、もし
Basic／ダイジェストオーセンティケータだけを使っているならコントローラに
ログインアクションは必要ありません。また、 AuthComponent がユーザー情報を session
から読み込まないようにするために ``AuthComponent::$sessionKey`` を false に
設定することができます。こうすると、ステートレス認証がリクエストごとにユーザーの
資格情報を再確認します。これは若干のオーバーヘッドになりますが、クッキーを使用することなく
ログイン処理を行えます。

.. note::

  2.4 より前のバージョンでは、Basic またはダイジェスト認証だけを使用する場合でも、
  認証されていないユーザーが保護されたページにアクセスしようとするとログインに
  リダイレクトされるように、ログインアクションが必要となります。また、2.4より前では
  ``AuthComponent::$sessionKey`` に false を設定するとエラーが発生します。

カスタム認証オブジェクトの作成
------------------------------

認証オブジェクトはプラガブルなので、カスタム認証オブジェクトを自分のアプリケーション内にでも、
プラグインとしてでも作成が可能です。もし例えば、OpenID 認証オブジェクトを作成したいのだとしたら、
``app/Controller/Component/Auth/OpenidAuthenticate.php`` の中で次のように記述することが
できます::

    App::uses('BaseAuthenticate', 'Controller/Component/Auth');

    class OpenidAuthenticate extends BaseAuthenticate {
        public function authenticate(CakeRequest $request, CakeResponse $response) {
            // OpenID 用の処理をここに記述します。
            // ユーザ認証が通った場合は、user の配列を返します。
            // 通らなかった場合は false を返します。
        }
    }

認証オブジェクトは、ユーザを識別できなかった場合に ``false`` を返さなければなりません。
そして、可能ならユーザ情報の配列も返すべきでしょう。 ``BaseAuthenticate`` を継承しなくても
かまいません。独自の認証オブジェクトには ``authenticate()`` メソッドが実装されていれば
よいのです。 ``BaseAuthenticate`` クラスではよく使われる強力なメソッドが多数提供されます。
また、独自の認証オブジェクトがステートレス認証やクッキーレス認証をサポートする必要があるなら、
``getUser()`` メソッドを実装することもできます。詳細は下記の Basic／ダイジェスト認証の
セクションを参照してください。

カスタム認証オブジェクトの利用
------------------------------

カスタム認証オブジェクトを作成したら、AuthComponents の authenticate 配列内にそれを
含めることで利用することができます::

    $this->Auth->authenticate = array(
        'Openid', // app 内の認証オブジェクト
        'AuthBag.Combo', // プラグインの認証オブジェクト
    );

ステートレス認証システムの作成
------------------------------

認証オブジェクトはクッキーに依存しないユーザログインのシステムをサポートするために使われる
``getUser()`` メソッドを実装することができます。典型的な getUser メソッドはリクエストや
環境を見て、ユーザを識別するためにその情報を使います。HTTP Basic 認証の例を挙げると、
ユーザ名とパスワードの値として ``$_SERVER['PHP_AUTH_USER']`` と
``$_SERVER['PHP_AUTH_PW']`` を使います。リクエストごとに、それらの値を再度ユーザを
識別するために使い、正規のユーザであることを確認します。認証オブジェクトの ``authenticate()``
メソッドと同様に、``getUser()`` メソッドも成功ならユーザ情報の配列を、失敗なら ``false``
を返すようにしてください::

    public function getUser($request) {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

上記では HTTP Basic 認証用の getUser メソッドをどのように実行できるのかを示しています。
``_findUser()`` メソッドは ``BaseAuthenticate`` の一部でユーザ名、パスワードをもとに
ユーザを識別します。

認証されていないリクエストの扱い
--------------------------------

認証されていないユーザーが最初に保護されたページにアクセスしようとすると、
チェーンの最後のオーセンティケータの `unauthenticated()` メソッドが呼び出されます。
認証オブジェクトが適切に応答またはリダイレクトを送信処理し、
それ以上のアクションは必要ないということを示すために `true` を返すことができます。
`AuthComponent::$authenticate` プロパティで認証オブジェクトを指定する順序を設定できます。

オーセンティケータが null を返した場合、 `AuthComponent` は、ユーザーをログインアクションに
リダイレクトします。それは、Ajax リクエストでかつ `AuthComponent::$ajaxLogin` に HTTP
ステータスコード 403 が返され、他にレンダリングされるエレメントが指定されていた場合です。

.. note::

  2.4より前では、認証オブジェクトは `unauthenticated()` メソッドを提供しません。

認証についてのフラッシュメッセージの表示
----------------------------------------

Auth が生成するセッションエラーメッセージを表示するためには、次のコードをあなたのレイアウトに
加えなければなりません。 ``app/View/Layouts/default.ctp`` ファイルに次の２行を
加えてください。content_for_layout 行の前にある body 部の中がよいでしょう::

    // CakePHP 2.7 以上
    echo $this->Flash->render();
    echo $this->Flash->render('auth');

    // 2.7 より前なら
    echo $this->Session->flash();
    echo $this->Session->flash('auth');

AuthComponent の flash 設定を使うことでエラーメッセージをカスタマイズすることができます。
``$this->Auth->flash`` を使うことで、AuthComponent がフラッシュメッセージのために使う
パラメータを設定することができます。利用可能なキーは次のとおりです。

- ``element`` - 使用されるエレメント。デフォルトは 'default'
- ``key`` - 使用されるキー。デフォルトは 'auth'
- ``params`` - 使用される追加の params 配列。デフォルトは array()

フラッシュメッセージの設定だけでなく、AuthComponent が使用する他のエラーメッセージを
カスタマイズすることもできます。あなた自身のコントローラの beforeFilter の中や component
の設定で、認証が失敗した際に使われるエラーをカスタマイズするのに ``authError`` を
使うことができます::

    $this->Auth->authError = "このエラーは保護されたウェブサイトの一部に" .
                               "ユーザがアクセスしようとした際に表示されます。";

.. versionchanged:: 2.4
   ユーザーがすでにログインしていた後にのみ、認可エラーを表示したいということもあると思います。
   その場合は `false` を設定することにより、このメッセージを表示しないようにすることができます。

コントローラの beforeFilter()、またはコンポーネントの設定で::

    if (!$this->Auth->loggedIn()) {
        $this->Auth->authError = false;
    }

.. _hashing-passwords:

パスワードのハッシュ化
----------------------

AuthComponent がもはや自動ではパスワードをハッシュ化しなくなったことに、気づいたかもしれません。
これは妥当性チェックのような多くの共通タスクを難しいものにしていたため、取り除かれました。
パスワードを平文テキストのまま保管しては **いけません**。ユーザのレコードを保存する前に、
パスワードは必ずハッシュ化するべきです。

2.4 の時点で、パスワードハッシュの生成とチェックはパスワードハッシュ化クラスに委譲されています。
認証オブジェクトは ``passwordHasher`` という新しい設定項目で使用するパスワードハッシュ化
クラスを指定します。この設定項目にはクラス名を文字列で指定するか、 ``className`` というキーに
クラス名を指定した配列を設定します。このとき、配列の余分なキーが設定としてパスワードハッシュ化
クラスのコンストラクタに渡されます。デフォルトのハッシュ化クラス ``Simple`` は sha1、sha256、
md5ハッシュに使用することができます。次のようにしてハッシュ化クラスを指定します::

    public $components = array(
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'passwordHasher' => array(
                        'className' => 'Simple',
                        'hashType' => 'sha256'
                    )
                )
            )
        )
    );

新しいユーザレコードを作成するとき、モデルの beforeSave コールバック内で適切な
パスワードハッシュ化クラスを使用してパスワードをハッシュ化できます::

    App::uses('SimplePasswordHasher', 'Controller/Component/Auth');

    class User extends AppModel {
        public function beforeSave($options = array()) {
            if (!empty($this->data[$this->alias]['password'])) {
                $passwordHasher = new SimplePasswordHasher(array('hashType' => 'sha256'));
                $this->data[$this->alias]['password'] = $passwordHasher->hash(
                    $this->data[$this->alias]['password']
                );
            }
            return true;
        }
    }

``$this->Auth->login()`` を呼び出す前にパスワードをハッシュ化する必要はありません。
さまざまな認証オブジェクトが個々にパスワードをハッシュ化します。

パスワードに bcrypt を使う
--------------------------

CakePHP 2.3 で ``BlowfishAuthenticate`` クラスが導入され、
`bcrypt <https://en.wikipedia.org/wiki/Bcrypt>`_ (別名: Blowfish) をパスワードの
ハッシュ化に使用できるようになりました。bcrypt ハッシュは SHA1 で保存されたパスワードよりも
ブルートフォースアタックに対してとても強固です。なお、 ``BlowfishAuthenticate`` は 2.4 で
非推奨になり、代わりに ``BlowfishPasswordHasher`` が追加されました。

Blowfish password hasher は、任意の認証クラスで使用することができます。使用するには、
認証オブジェクトの ``passwordHasher`` の設定で Blowfish password hasher を
指定しないといけません::

    public $components = array(
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'passwordHasher' => 'Blowfish'
                )
            )
        )
    );

ダイジェスト認証のパスワードのハッシュ化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ダイジェスト認証は RFC で定義されたフォーマットでハッシュ化されたパスワードが必要です。
パスワードをダイジェスト認証で使用できるよう正しくハッシュ化するために、特別な
パスワードハッシュ化の関数 ``DigestAuthenticate`` を使ってください。ダイジェスト認証と
その他の認証戦略を合わせて利用する場合には、通常のハッシュ化パスワードとは別のカラムで
ダイジェストパスワードを保管するのをお勧めします::

    App::uses('DigestAuthenticate', 'Controller/Component/Auth');

    class User extends AppModel {
        public function beforeSave($options = array()) {
            // make a password for digest auth.
            $this->data[$this->alias]['digest_hash'] = DigestAuthenticate::password(
                $this->data[$this->alias]['username'],
                $this->data[$this->alias]['password'],
                env('SERVER_NAME')
            );
            return true;
        }
    }

ダイジェスト認証用のパスワードは、ダイジェスト認証の RFC に基づき、他のハッシュ化パスワード
よりもやや多くの情報を要求します。

.. note::

    AuthComponent::$authenticate 内で DigestAuthentication が設定された場合、
    DigestAuthenticate::password() の第３パラメータは定義した 'realm' の設定値と
    一致する必要があります。このデフォルトは  ``env('SCRIPT_NAME')`` です。
    複数の環境で一貫したハッシュが欲しい場合に static な文字列を使いたいと思うかもしれません。

カスタムパスワードハッシュ化クラスの作成
----------------------------------------

カスタムパスワードハッシュ化クラスは ``AbstractPasswordHasher`` クラスを継承し、
抽象メソッドの ``hash()`` と ``check()`` を実装する必要があります。
``app/Controller/Component/Auth/CustomPasswordHasher.php`` に次のように記述します::

    App::uses('AbstractPasswordHasher', 'Controller/Component/Auth');

    class CustomPasswordHasher extends AbstractPasswordHasher {
        public function hash($password) {
            // ここにコードを書く
        }

        public function check($password, $hashedPassword) {
            // ここにコードを書く
        }
    }

手動でのユーザログイン
----------------------

独自のアプリケーションを登録した直後など、時には手動によるログインが必要になる事態が
発生することもあるでしょう。ログインさせたいユーザデータを引数に ``$this->Auth->login()``
を呼び出すことで、これを実現することができます::

    public function register() {
        if ($this->User->save($this->request->data)) {
            $id = $this->User->id;
            $this->request->data['User'] = array_merge(
                $this->request->data['User'],
                array('id' => $id)
            );
            unset($this->request->data['User']['password']);
            $this->Auth->login($this->request->data['User']);
            return $this->redirect('/users/home');
        }
    }

.. warning::

    login メソッドに渡される配列に新たなユーザ ID が追加されていることを必ず確認してください。
    そうでない場合、そのユーザ ID が利用できなくなってしまいます。

.. warning::

    ``$this->Auth->login()`` にデータを渡す前にパスワードは消去してください。
    そうしなければ、ハッシュ化されていないセッションに保存されてしまいます。

ログインしたユーザのアクセス
----------------------------

ユーザがログインしたあと、現状のそのユーザについての特定の情報が必要になることもあるでしょう。
``AuthComponent::user()`` を使うことで、現在ログインしているそのユーザにアクセスすることが
できます。このメソッドは static で、AuthComponent がロードされたあと、global に使うことも
できます。インスタンスメソッドとしても、static メソッドとしてもアクセス可能です::

    // どこからでも利用できます。
    AuthComponent::user('id')

    // Controllerの中でのみ利用できます。
    $this->Auth->user('id');

ログアウト
----------

最終的には認証を解除し、適切な場所へとリダイレクトするためのてっとり早い方法がほしくなるでしょう。
このメソッドはあなたのアプリケーション内のメンバーページに 'ログアウト' リンクを入れたい場合にも
便利です::

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

ダイジェスト／Basic 認証でログインしたユーザのログアウトを、すべてのクライアントで成し遂げるのは
難しいものです。多くのブラウザは開いている間だけ継続する認証情報を保有しています。
クライアントの中には 401 のステータスコードを送信して強制的にログアウトすることがありえます。
認証 realm の変更は、一部のクライアントで機能させるためのもう１つの解決法です。

.. _authorization-objects:

権限判定
========

権限判定は識別され認証されたユーザが、要求するリソースへのアクセスを要求どおりに
許可してよいのかを確たるものにするための処理です。有効な ``AuthComponent`` が自動的に
認証ハンドラをチェックし、ログインしたユーザが要求どおりにリソースへのアクセスを
許可するかどうかを確認します。組み込み済みの認証ハンドラがいくつか存在しますので、
あなたのアプリケーション用にカスタム版を作成したり、プラグインの一部として
作成することができます。

- ``ActionsAuthorize`` アクションレベルでパーミッションをチェックするために AclComponent
  を使います。
- ``CrudAuthorize`` リソースへのパーミッションをチェックするために、AclComponent と、
  アクション -> CRUD のマッピングを使います。
- ``ControllerAuthorize`` アクティブなコントローラの ``isAuthorized()`` を呼び、
  ユーザの権限判定のために、その戻り値を使う。これはユーザの権限判定をもっともシンプルに
  行う方法です。

権限判定ハンドラの設定
----------------------

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

あなたのコントローラの ``beforeFilter`` の中や ``$components`` 配列の中で
権限判定ハンドラの設定を行うことができます。配列を使って、各権限判定オブジェクトに
設定情報を渡すことができます::

    // 基本的な設定法
    $this->Auth->authorize = array('Controller');

    // 設定を中に記述
    $this->Auth->authorize = array(
        'Actions' => array('actionPath' => 'controllers/'),
        'Controller'
    );

``Auth->authorize`` も ``Auth->authenticate`` とほぼ同様で、``all`` キーを使うことで
コードを DRY に保ちやすくなります。この特別なキーにより、設定されたすべてのオブジェクトに渡す
設定を記述することができます。all キーは ``AuthComponent::ALL`` と記述することもできます::

    // 'all' を使って設定を記述
    $this->Auth->authorize = array(
        AuthComponent::ALL => array('actionPath' => 'controllers/'),
        'Actions',
        'Controller'
    );

上記の例では、``Actions`` と ``Controller`` の両方ともが 'all' キーで宣言された設定を
取得することになります。特定の権限判定オブジェクトに個別に書いた設定は 'all' キーの同名の
キーの情報をオーバーライドします。コアの権限判定オブジェクトでは次の設定キーをサポートしています。

- ``actionPath`` Used by ``ActionsAuthorize`` to locate controller action ACO's in the ACO tree.
- ``actionMap`` アクション -> CRUD のマッピング。CRUD ロールにアクションをマッピングしたい
  ``CrudAuthorize`` もしくは権限判定オブジェクトによって使われます。
- ``userModel`` ARO/モデル のノード名。これ以下からユーザ情報を探します。ActionsAuthorize
  で使われます。


カスタム権限判定オブジェクトの生成
----------------------------------

権限判定オブジェクトはプラガブルなので、カスタム権限判定オブジェクトを自分の
アプリケーション内にでも、プラグインとしてでも作成が可能です。もし例えば、LDAP 権限判定
オブジェクトを作成したいのだとしたら、 ``app/Controller/Component/Auth/LdapAuthorize.php``
の中で次のように記述することができます::

    App::uses('BaseAuthorize', 'Controller/Component/Auth');

    class LdapAuthorize extends BaseAuthorize {
        public function authorize($user, CakeRequest $request) {
            // LDAP 用の処理をここに記述します。
        }
    }

権限判定オブジェクトは該当ユーザがアクセスを拒否されたり、該当オブジェクトでのチェックが
できなかった場合には ``false`` を返してください。権限判定オブジェクトがユーザのアクセスが
妥当だと判定したなら ``true`` を返してください。 ``BaseAuthorize`` を継承する必要は
ありませんが、独自の権限判定オブジェクトは必ず ``authorize()`` メソッドを実装してください。
``BaseAuthorize`` クラスではよく使われる強力なメソッドが多数提供されます。


カスタム権限判定オブジェクトの利用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

カスタム権限判定オブジェクトを作成したら、AuthComponent の authorize 配列にそれらを
含めることで使うことができます::

    $this->Auth->authorize = array(
        'Ldap', // app内の権限判定オブジェクト
        'AuthBag.Combo', // プラグインの権限判定オブジェクト
    );


権限判定を使用しない
--------------------

組み込み済みのいずれの権限判定オブジェクトも使いたくなく、AuthComponent の外側で完全に
権限を扱いたい場合は、``$this->Auth->authorize = false;`` を設定することが可能です。
デフォルトで AuthComponent は ``authorize = false`` となっています。権限判定のスキーマを
使いたくない場合は、コントローラの beforeFilter か、別のコンポーネントで権限を確実に
チェックしてください。

公開するアクションの作成
------------------------

コントローラのアクションが完全に公開すべきものであったり、ユーザのログインが
不要であったりという場合があります。AuthComponent は悲観的であり、デフォルトでは
アクセスを拒否します。 ``AuthComponent::allow()`` を使うことで、公開すべきアクションに
印をつけることができます。アクションに公開の印をつけることで、AuthComponent は該当のユーザが
ログインしているかのチェックも、権限判定オブジェクトによるチェックも行わなくなります::

    // すべてのアクションを許可。 CakePHP 2.0 (非推奨)。
    $this->Auth->allow('*');

    // すべてのアクションを許可。 CakePHP 2.1 以降。
    $this->Auth->allow();

    // view と index アクションのみ許可。
    $this->Auth->allow('view', 'index');

    // view と index アクションのみ許可。
    $this->Auth->allow(array('view', 'index'));

.. warning::

  もし scaffolding を使っている場合、すべてを許可する設定では scaffold のメソッドを
  識別できず、許可されません。それらのアクション名を明示するようにしてください。

``allow()`` には必要な数だけいくつでもアクション名を記述することができます。
すべてのアクション名を含む配列を渡してもかまいません。

権限判定が必要なアクションの作成
--------------------------------

アクションを公開する形で作成したなら、公開アクションを取り消したくなるかもしれません。
そのためには ``AuthComponent::deny()`` を使うことができます::

    // アクション１つを取り除く
    $this->Auth->deny('add');

    // すべてのアクションを取り除く
    $this->Auth->deny();

    // アクションのグループを取り除く
    $this->Auth->deny('add', 'edit');
    $this->Auth->deny(array('add', 'edit'));

``deny()`` には必要な数だけいくつでもアクション名を記述することができます。
すべてのアクション名を含む配列を渡してもかまいません。

ControllerAuthorize の利用
--------------------------

ControllerAuthorize を使うことで、コントローラのコールバックの中で権限判定チェックを
扱うことができるようになります。非常にシンプルな権限判定を行う場合や、権限判定を行うのに
モデルとコンポーネントを合わせて利用する必要がある場合、しかしカスタム権限判定オブジェクトを
作成したくない場合に、これは理想的です。

コールバックでは必ず ``isAuthorized()`` を呼んでください。これは該当ユーザがリクエスト内で
リソースにアクセスすることが許可されるかを boolean で返します。
コールバックにはアクティブなユーザが渡されますので、チェックが可能です::

    class AppController extends Controller {
        public $components = array(
            'Auth' => array('authorize' => 'Controller'),
        );
        public function isAuthorized($user = null) {
            // 登録済みユーザなら誰でも公開 function にアクセス可能です。
            if (empty($this->request->params['admin'])) {
                return true;
            }

            // adminユーザだけが管理 functions にアクセス可能です。
            if (isset($this->request->params['admin'])) {
                return (bool)($user['role'] === 'admin');
            }

            // デフォルトは拒否
            return false;
        }
    }

上記のコールバックは非常にシンプルな権限判定システムとなっており、role = admin のユーザだけが
admin に設定されたアクションにアクセスすることができます。


ActionsAuthorize の利用
-----------------------

ActionsAuthorize は AclComponent を取りまとめ、各リクエストでアクション ACL チェックを
きめ細かに行うことができるようになります。ActionsAuthorize は DbAcl とペアで使うことが多く、
アプリケーションを通して管理ユーザにより編集されうる、動的かつ柔軟なパーミッションシステムを
提供します。それは、ただし、たとえば IniAcl とカスタムアプリケーション ACL バックエンドと
いうように、他の ACL の実装と組み合わせることが可能です。

CrudAuthorize の利用
--------------------

``CrudAuthorize`` は AclComponent と一体となり、CRUD 操作へのリクエストをマッピングする
機能を提供します。CRUD マッピングを使った権限判定の機能を提供します。これらのマッピングされた
リクエストは AclComponent 内で特別なパーミッションとしてチェックされます。

たとえば、``/posts/index`` を現在のリクエストであるとします。デフォルトでは ``index`` に
マッピングされますが、``read`` のパーミッションチェックを行います。ACL チェックは ``posts``
コントローラの ``read`` パーミッションを使って行われることになります。これにより、
アクセスされたアクションにとどまらず、リソースへと行われる行為により焦点を合わせた
パーミッションシステムを作ることができるようになります。

CrudAuthorize を使う場合のアクションのマッピング
------------------------------------------------

CrudAuthorize やアクションマッピングを使う他の権限判定オブジェクトを使う場合、
追加でモデルのマッピングが必要になるかもしれません。その場合、mapAction() を使うことで、
アクション -> CRUD パーミッションのマッピングを行うことができます。AuthComponent の
このメソッドを呼び出すことで、設定済みのすべての権限判定オブジェクトに設定が渡されます::

    $this->Auth->mapActions(array(
        'create' => array('register'),
        'view' => array('show', 'display')
    ));

mapActions のキーには設定したい CRUD パーミッションを指定してください。
一方、値には CRUD パーミッションにマッピングされたすべてのアクションの配列を設定してください。

AuthComponent API
=================

AuthComponent は CakePHP に組み込み済みの権限判定・認証メカニズムへの
主要なインターフェイスです。

.. php:attr:: ajaxLogin

    不正な／期限切れのセッションを伴った Ajax リクエストの場合に render すべき任意の
    ビューエレメントの名前。

.. php:attr:: allowedActions

    ユーザの妥当性チェックが必要ないコントローラのアクションの配列。

.. php:attr:: authenticate

    ユーザのログインに使いたい認証オブジェクトの配列を設定してください。
    コアの認証オブジェクトがいくつか存在します。 :ref:`authentication-objects`
    を参照してください。

.. php:attr:: authError

    ユーザがアクセス権の無いオブジェクトやアクションにアクセスした場合に表示されるエラー。

    .. versionchanged:: 2.4
       `false` を設定することにより、authError メッセージを表示しないようにできます。

.. php:attr:: authorize

    各リクエストでユーザの権限判定に使いたい権限判定オブジェクトの配列を設定してください。
    :ref:`authorization-objects` を参照してください。

.. php:attr:: components

    AuthComponent により利用される他のコンポーネント。

.. php:attr:: flash

    Auth が :php:meth:`FlashComponent::set()` でフラッシュメッセージを行う
    必要がある場合に使用する設定。次のキーが利用可能:

    - ``element`` - 使用するエレメント。デフォルトで 'default'。
    - ``key`` - 使用するキー。デフォルトで 'auth'。
    - ``params`` - 追加で使用するパラメータの配列。デフォルトで array()。

.. php:attr:: loginAction

    ログインを扱うコントローラとアクションを表す、(文字列や配列で定義した) URL。デフォルトで
    `/users/login`。

.. php:attr:: loginRedirect

    ログイン後のリダイレクト先のコントローラとアクションを表す、(文字列や配列で定義した) URL。
    この値はユーザが ``Auth.redirect`` をセッション内に持っている場合には無視されます。

.. php:attr:: logoutRedirect

    ユーザがログアウトした後のリダイレクト先となるデフォルトのアクション。
    AuthComponent は post-logout のリダイレクトを扱いませんが、リダイレクト先の URL は
    :php:meth:`AuthComponent::logout()` から返されるものとなります。
    デフォルトは :php:attr:`AuthComponent::$loginAction`。

.. php:attr:: unauthorizedRedirect

    許可されていないアクセスに対する処理を制御します。
    デフォルトでは、許可されていないユーザーはリファラの URL か
    ``AuthComponent::$loginRedirect`` か、もしくは '/' にリダイレクトされます。
    false をセットした場合は、リダイレクトする代わりに ForbiddenException が送出されます。

.. php:attr:: request

    リクエストオブジェクト。

.. php:attr:: response

    レスポンスオブジェクト。

.. php:attr:: sessionKey

    現在のユーザレコードが保存されているセッションのキー名。指定がない場合は
    "Auth.User" となる。

.. php:method:: allow($action, [$action, ...])

    公開するアクションの配列。これで指定したアクションは権限判定チェックが行われません。
    特別な値 ``'*'`` は対象コントローラのすべてのアクションを公開に設定します。コントローラの
    beforeFilter メソッド内で使ってください。

.. php:method:: constructAuthenticate()

    設定済みの認証オブジェクトを読み込む。

.. php:method:: constructAuthorize()

    設定済みの権限判定オブジェクトを読み込む。

.. php:method:: deny($action, [$action, ...])

    以前に公開アクションとして宣言されていたアクションを非公開へと変更する。
    こうすることで、これらのアクションも権限判定されることになります。コントローラの
    beforeFilter メソッド内で使ってください。

.. php:method:: identify($request, $response)

    :param CakeRequest $request: 使用されるリクエスト。
    :param CakeResponse $response: 使用されるレスポンス。認証が失敗なら、ヘッダーを送信できる。

    このメソッドは AuthComponent が現在のリクエストに含まれる情報に基づき、ユーザを
    識別するために使います。


.. php:method:: initialize($Controller)

    AuthComponent をコントローラ内で使えるように初期化します。

.. php:method:: isAuthorized($user = null, $request = null)

    ユーザに権限があるかどうかをチェックするために、設定された権限判定アダプタを使用します。
    各アダプタは順にチェックされます。いずれかが true を返したら、ユーザはそのリクエストで
    権限ありとみなされます。

.. php:method:: loggedIn()

    現在のクライアントがログイン済みなら true を返します。そうでないなら false を返します。

.. php:method:: login($user)

    :param array $user: ログインしたユーザのデータ配列。

    ログインしたユーザのデータ配列を取得します。手動でユーザをログインさせることも可能になります。
    提供された情報は user() の呼び出しによりセッションへと保存されます。
    ユーザが提供されない場合、AuthComponent は現在のリクエスト情報を使って識別しようとします。
    :php:meth:`AuthComponent::identify()` を参照してください。

.. php:method:: logout()

    :return: ログアウトでリダイレクト先となる URL の文字列。

    現在のユーザをログアウトさせます。

.. php:method:: mapActions($map = array())

    アクション名と CRUD 操作をマッピングします。コントローラに基づく認証で使用されます。
    このメソッドを呼ぶ前に権限判定プロパティの設定を確認してください。
    設定されているすべての権限判定オブジェクトに $map が渡されるためです。

.. php:staticmethod:: password($pass)

.. deprecated:: 2.4

.. php:method:: redirect($url = null)

.. deprecated:: 2.3

.. php:method:: redirectUrl($url = null)

    パラメータが渡されなかったら、認証のリダイレクト URL を取得します。
    ログイン後、リダイレクト先となる URL を渡します。
    リダイレクトの値が保存されないなら、:php:attr:`AuthComponent::$loginRedirect` へと
    フォールバックします。

.. versionadded:: 2.3

.. php:method:: shutdown($Controller)

    コンポーネントをシャットダウンします。ユーザがログインしているなら、リダイレクトを行いません。

.. php:method:: startup($Controller)

    主要な実行メソッドです。不正なユーザのリダイレクトやログインフォームのデータ処理を扱います。

.. php:staticmethod:: user($key = null)

    :param string $key:  フェッチしたいユーザデータのキー。null ならユーザの全データが
        返される。インスタンスメソッドとしても呼び出し可能。

    ログインしている現在のユーザのデータを取得する。プロパティのキーを使用することで、
    このユーザについて特定のデータをフェッチすることが可能::

        $id = $this->Auth->user('id');

    現在のユーザがログインしていない、もしくは存在しないなら、null が返される。


.. meta::
    :title lang=ja: Authentication
    :keywords lang=ja: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
