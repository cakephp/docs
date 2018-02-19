認証
####

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

ユーザーを識別し、認証し、権限を付与することは、ほとんどすべてのウェブアプリケーションに
共通の機能です。CakePHP の AuthComponent ではそういったタスクを実行するための
プラガブルな方法を提供します。AuthComponent により、認証オブジェクトと、ユーザーの権限を
識別・判定する柔軟な仕組みを作るための権限判定オブジェクトを組み合わせることができるように
なります。

.. _authentication-objects:

以降を読む前に
==============

認証の設定には、ユーザーテーブルの定義、モデルやコントローラーやビューの作成など、
いくつかのステップが必要です。

:doc:`CMS チュートリアル </tutorials-and-examples/cms/authentication>`
の中で順を追って説明しています。

もし、CakePHP のための既存の認証や認可の解決方法を探しているなら、Awesome CakePHP リストの
`Authentication and Authorization <https://github.com/FriendsOfCake/awesome-cakephp/blob/master/README.md#authentication-and-authorization>`_ セクションを見てください。

認証
====

認証とは、与えられた認証情報によりユーザーを識別し、そのユーザーが言うとおりの人物であることを
確実なものにする処理のことです。たいていの場合、これはユーザー名とパスワードにより行われ、
それと既知のユーザーリストを照らし合わせます。CakePHP には、あなたのアプリケーション内に
保管されているユーザーを認証するための組み込み済みの方法がいくつか存在します。

* ``FormAuthenticate`` では、POST されたデータをもとに認証を行うことが可能です。
  通常これは、ユーザーが情報を入力するログインフォームです。
* ``BasicAuthenticate`` では、Basic HTTP 認証を使った認証を行うことが可能です。
* ``DigestAuthenticate`` では、ダイジェスト HTTP 認証を使った認証を行うことが可能です。

デフォルトで ``AuthComponent`` は ``FormAuthenticate`` を使用します。

認証タイプの選択
----------------

たいていの場合は、フォームベースの認証を提供したいと思うでしょう。これはウェブブラウザーを
使うユーザーにとってはもっとも簡単な方法です。もし、API やウェブサービスを構築しているなら、
Basic 認証やダイジェスト認証も考慮したくなるかもしれません。ダイジェスト認証と Basic
認証の重要な違いは、どのようにパスワードを扱うかということにあります。Basic 認証では、
ユーザー名とパスワードは平文のテキストとしてサーバーに送信されます。そのため Basic 認証は
SSL を使わないアプリケーションには向いていません。これは、慎重に扱うべきパスワードが
露出してしまうことになるためです。ダイジェスト認証はユーザー名やパスワード、
そのほかのいくつかの詳細情報のダイジェストハッシュを使います。そのため ダイジェスト認証は
SSL 暗号化しないアプリケーションにもふさわしいものです。

また、OpenID のような認証システムを使うことも可能です。ただし、OpenID は CakePHP の
コアには含まれません。

認証ハンドラーの設定
--------------------

認証ハンドラーは ``authenticate`` を使用して設定します。
認証に使うハンドラーを１つもしくは複数設定することができます。
複数のハンドラーを設定することで、複数のログインの仕組みをサポートすることが可能です。
ユーザーがログインする際、認証ハンドラーは宣言されている順に判定されます。
あるハンドラーでユーザーを識別ができたら、それ以降のハンドラーでは判定されません。
逆に、例外を投げることですべての認証を失敗にすることもできます。
投げられた任意の例外をキャッチし、必要に応じて処理する必要があります。

コントローラーの ``beforeFilter()`` もしくは ``initialize()`` メソッドの中に、
認証ハンドラーを設定することができます。配列を使用して各認証オブジェクトに設定情報を
渡すことができます。 ::

    // シンプルな設定
    $this->Auth->config('authenticate', ['Form']);

    // 設定を記述
    $this->Auth->config('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

２番目の例では、 ``userModel`` キーを２回宣言しなければならないということに
気づいたでしょう。コードを DRY に保ちたいなら、 ``all`` キーを使うことができます。
この特別なキーを使うことで、列挙したオブジェクトすべてに設定が渡されることになります。
``all`` キーは ``AuthComponent::ALL`` と記述することもできます。 ::

    // 'all' を使って設定を記述
    $this->Auth->config('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

上記の例では、 ``Form`` と ``Basic`` の両方ともが 'all' キーで宣言された設定を
取得することになります。特定の認証オブジェクトに個別に書いた設定は 'all' キーの同名の
キーの情報をオーバーライドします。コアの認証オブジェクトでは次の設定キーをサポートしています。

- ``fields`` ユーザーを識別するのに使うフィールド(配列)。ユーザー名とパスワードのフィールドを
  指定するキー ``username`` と ``password`` を使用することができます。
- ``userModel`` ユーザーテーブルのモデル名。デフォルトは Users。
- ``finder`` ユーザーレコードを取得するために使用するファインダーメソッド。デフォルトは 'all'。
- ``passwordHasher`` パスワード処理のクラス。デフォルトは　``Default``。
- ``scope`` と ``contain`` オプションは 3.1 で非推奨になりました。ユーザーレコードを取得する
  クエリーを変更する代わりにカスタムファインダーを使用してください。
- ``userFields`` オプションは 3.1 で非推奨になりました。カスタムファインダーの ``select()``
  を使用してください。

``initialize()`` メソッドの中でユーザーの特定の列名を設定するには::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email', 'password' => 'passwd']
                ]
            ]
        ]);
    }

``Auth`` の他の設定キー (``authError`` や ``loginAction`` など) を ``authenticate`` や
``Form`` の要素として書いてはいけません。それらは authenticate キーと同じレベルであるべきです。
上記の例を他の Auth 設定を使って書いた場合は次のようになります。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authError' => 'Did you really think you are allowed to see that?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ],
            'storage' => 'Session'
        ]);
    }

共通の設定に加えて、Basic 認証では次のキーも利用できます:

- ``realm`` 認証される realm。デフォルトでは ``env('SERVER_NAME')`` 。

共通の設定に加えて、ダイジェスト認証では次のキーも利用できます:

- ``realm`` realm 認証の認証先。デフォルトはサーバー名。
- ``nonce`` 認証で使われる nonce。デフォルトは ``uniqid()`` 。
- ``qop`` デフォルトは auth。現時点では他の値はサポートされていません。
- ``opaque`` クライアントから変更されることなく戻されるべき文字列。デフォルトは
  ``md5($settings['realm'])`` 。

.. note::
    ユーザーレコードを見つけるために、データベースには username のみを使用して問い合わせます。
    パスワードのチェックは、PHP で行われます。これは、(デフォルトで使用される) bcrypt
    のようなハッシュ化アルゴリズムは、毎回新しいハッシュを生成するからです。
    同じ文字列であっても、パスワードが合致するかどうかをチェックするために SQL で単純に
    文字列を比較することはできません。

検索クエリーのカスタマイズ
--------------------------

認証クラスの設定で ``finder`` オプションを使用して、ユーザーレコードを取得するために
使用されるクエリーをカスタマイズすることができます。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth'
                ]
            ],
        ]);
    }

この場合、 ``UsersTable`` がファインダーメソッドの ``findAuth()`` を持っていなければなりません。
下に示した例では、クエリーは、必要なフィールドのみを取得し条件を追加するために変更されます。
``username`` と ``password`` のようにユーザーを認証する必要があるフィールドを、選択することを
保証する必要があります。 ::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

.. note::
    ``finder`` オプションは 3.1 以降で使用可能です。そのバージョンより前なら、クエリーを変更するために
    ``scope`` と ``contain`` オプションを使用することができます。

ユーザーの識別とログイン
------------------------

.. php:method:: identify()

リクエスト中の認証情報を使用してユーザーを識別するために、 ``$this->Auth->identify()`` を
手動で呼ぶ必要があります。その後、セッションにユーザー情報を保存する、すなわち、ユーザーを
ログインするために ``$this->Auth->setUser()`` メソッドを使用します。

ユーザーを認証する際には、設定されている認証オブジェクトを設定された順にチェックしていきます。
あるオブジェクトでユーザーが識別できたら、以降のオブジェクトはチェックされません。
ログインフォームで動作する login 関数のサンプルは次のようになります。 ::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__('Username or password is incorrect'));
            }
        }
    }

上記のコードでは、はじめに POST データを使用して、ユーザーを識別しようと試みます。
成功した場合、ログインがリクエストの間で持続するようにセッションにユーザー情報を設定し、
彼らが訪れていた最後のページまたは ``loginRedirect`` の設定で指定された URL のどちらかに
リダイレクトします。ログインに失敗した場合は、フラッシュメッセージが設定されます。

.. warning::

    ``$this->Auth->setUser($data)`` は、そのメソッドに渡されたデータを持つユーザーとして
    ログインします。これは、実際には認証クラスに対する認証情報をチェックしません。

ログイン後のリダイレクト
------------------------

.. php:method:: redirectUrl

ユーザーがログインした後、一般的に彼らが来たところに戻すのにリダイレクトすることになるでしょう。
ユーザーがログインした後にリダイレクトされるべき目的地を設定するために、URL を渡してください。

パラメーターが渡されない場合、返される URL は、次の規則に従います。

- ``redirect`` クエリー文字列が存在していて、同じドメインの現在のアプリが実行されている場合は、
  正規化された URL を返します。 3.4.0 より前は、セッションの ``Auth.redirect`` の値が
  使用されていました。
- クエリー文字列やセッション値がなく ``loginRedirect`` の設定がある場合は、
  ``loginRedirect`` の値を返します。
- セッションがなく ``loginRedirect`` がない場合は、 ``/`` を返します。

ステートレス認証システムの作成
------------------------------

Basic およびダイジェストはステートレス認証スキームであり、初回の POST またはフォームを
必要としません。もし Basic／ダイジェストオーセンティケーターだけを使っているならコントローラーに
ログインアクションは必要ありません。ステートレス認証はリクエストごとにユーザーの認証情報を再検証し、
これは追加のオーバーヘッドが多少生じますが、クライアントは、クッキーを使用せずにログインすることが
できますし、AuthComponent で API を構築するのに、より適しています。

AuthComponent がユーザーレコードの格納にセッションを使用しないように、ステートレスな
オーセンティケーターのための ``strage`` 設定は、 ``Memory`` に設定する必要があります。
また、``unauthorizedRedirect`` に ``false`` を設定すると、 AuthComponent が、
デフォルトの動作であるリファラーへのリダイレクトの代わりに ``ForbiddenException``
をスローすることもできます。

``unauthorizedRedirect`` オプションは、認証されたユーザーに対してのみ適用します。
ユーザーがまだ認証されていなかったり、ユーザーをリダイレクトさせたくない場合、 ``Basic`` や
``Digest`` のような１つまたは複数のステートレスなオーセンティケーターを読み込む必要があります。

認証オブジェクトはクッキーに依存しないユーザーログインのシステムをサポートするために使われる
``getUser()`` メソッドを実装することができます。典型的な getUser メソッドはリクエストや
環境を見て、ユーザーを識別するためにその情報を使います。HTTP Basic 認証の例を挙げると、
ユーザー名とパスワードの値として ``$_SERVER['PHP_AUTH_USER']`` と
``$_SERVER['PHP_AUTH_PW']`` を使います。

.. note::

    期待通りに認証が動作しない場合、クエリーが全く実行されていないかどうかをチェックしてください
    (``BaseAuthenticate::_query($username)`` をご覧ください)。クエリーが実行されない場合、
    ``$_SERVER['PHP_AUTH_USER']`` と ``$_SERVER['PHP_AUTH_PW']`` がウェブサーバーによって
    読み込まれたかどうかをチェックしてください。もし Apache で FastCGI-PHP を使用している場合は、
    webroot 内の **.htaccess** ファイルに次の行を追加する必要があるかもしれません。 ::

        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

リクエストごとに、それらの値 (``PHP_AUTH_USER`` と ``PHP_AUTH_PW``) を再度ユーザーを
識別するために使い、正規のユーザーであることを確認します。認証オブジェクトの ``authenticate()``
メソッドと同様に、 ``getUser()`` メソッドも成功ならユーザー情報の配列を、失敗なら ``false`` を
返すようにしてください。 ::

    public function getUser(ServerRequest $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

上記は HTTP Basic 認証用の getUser メソッドをどのように実行できるのかを示しています。
``_findUser()`` メソッドは ``BaseAuthenticate`` の一部でユーザー名、パスワードをもとに
ユーザーを識別します。

.. _basic-authentication:

Basic 認証の使用
----------------

Basic 認証を使用すると、イントラネットアプリケーションや単純な API のシナリオに使用できる
ステートレス認証を作成することができます。Basic 認証の認証情報は、リクエストごとに再チェックされます。

.. warning::
    Basic 認証では、プレーンテキストで認証情報を送信します。
    Basic 認証を使用するときは、HTTPS を使用する必要があります。

Basic 認証を使用するには、AuthComponent を設定する必要があります。 ::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Basic' => [
                'fields' => ['username' => 'username', 'password' => 'api_key'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

ここでは、フィールドとして、ユーザー名 + API キーを使用し、Users モデルを使用しています。

Basic 認証のための API キーの作成
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

基本的な HTTP はプレーンテキストで認証情報を送信するので、ユーザーに自分のログインパスワードを
送信させることは賢明ではありません。代わりに、不透明な API キーが、一般的に使用されます。
CakePHP のライブラリーを使用してランダムにこれらの API トークンを生成することができます。 ::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->getData('entity');

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // API の 'トークン' を生成
                $entity->api_key_plain = Security::hash(Security::randomBytes(32), 'sha256', false);

                // ログインの際に BasicAuthenticate がチェックする
                // トークンを Bcrypt で暗号化
                $entity->api_key = $hasher->hash($entity->api_key_plain);
            }
            return true;
        }
    }

上記は、ユーザーが保存されるごとにランダムなハッシュを生成します。上記のコードでは、
``api_key`` (ハッシュ化された API キーを格納) と ``api_key_plain`` (API キーの平文バージョン) の
２つのカラムを持つと仮定しており、後でそれをユーザーに表示することができます。
プレーン HTTP を介する場合でも、パスワードの代わりにキーを使用することで、
ユーザーが自分の元のパスワードの代わりに、不透明なトークンを使用できます。
ユーザーのリクエストに応じて、API キーを再生成するロジックを含めることも賢明です。

ダイジェスト認証の使用
----------------------

ダイジェスト認証は、Basic 認証よりも改善されたセキュリティモデルを提供しています。
ユーザーの認証情報がリクエストヘッダーに送信されないからです。代わりにハッシュが送信されます。

ダイジェスト認証を使用するには、 ``AuthComponent`` を設定する必要があります。 ::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Digest' => [
                'fields' => ['username' => 'username', 'password' => 'digest_hash'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

ここでは、フィールドとして、ユーザー名 + digest_hash を使用し、 Users モデルを使用しています。

ダイジェスト認証のパスワードのハッシュ化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ダイジェスト認証は RFC で定義されたフォーマットでハッシュ化されたパスワードが必要です。
パスワードをダイジェスト認証で使用できるよう正しくハッシュ化するために、特別な
パスワードハッシュ化の関数 ``DigestAuthenticate`` を使ってください。ダイジェスト認証と
その他の認証戦略を合わせて利用する場合には、通常のハッシュ化パスワードとは別のカラムで
ダイジェストパスワードを保管するのをお勧めします。 ::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->getData('entity');

            // ダイジェスト認証のためのパスワードを作成。
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

ダイジェスト認証のパスワードは、ダイジェスト認証の RFC に基づいており、他のハッシュ化パスワード
よりもやや多くの情報が必要です。

.. note::

    ``AuthComponent::$authenticate`` 内で DigestAuthentication が設定された場合、
    ``DigestAuthenticate::password()`` の第３パラメーターは定義した 'realm' の設定値と
    一致する必要があります。このデフォルトは  ``env('SCRIPT_NAME')`` です。
    複数の環境で一貫したハッシュが欲しい場合に static な文字列を使用することができます。

カスタム認証オブジェクトの作成
------------------------------

認証オブジェクトはプラガブルなので、カスタム認証オブジェクトを自分のアプリケーション内にでも、
プラグインとしてでも作成が可能です。もし例えば、OpenID 認証オブジェクトを作成したいのだとしたら、
**src/Auth/OpenidAuthenticate.php** の中で次のように記述することができます。 ::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(ServerRequest $request, Response $response)
        {
            // OpenID 用の処理をここに記述します。
            // ユーザー認証が通った場合は、user の配列を返します。
            // 通らなかった場合は false を返します。
        }
    }

ユーザーとユーザー情報の配列とを識別できない場合、認証オブジェクトは ``false`` を返す必要があります。
必ずしも ``BaseAuthenticate`` を継承する必要はなく、認証オブジェクトが
``Cake\Event\EventListenerInterface`` を実装することだけが必要です。
``BaseAuthenticate`` クラスは、一般的に使用されている便利な多くのメソッドを提供します。
認証オブジェクトがステートレスまたはクッキーレスの認証をサポートする必要がある場合には、
``getUser()`` メソッドを実装することができます。詳しくは、Basic 認証とダイジェスト認証の
セクションを参照してください。

``AuthComponent`` は、ユーザーを識別した後と、ユーザーがログアウトする前に、２つのイベント
``Auth.afterIdentify`` と ``Auth.logout`` をトリガーします。
あなたの認証クラスの ``implementedEvents()`` メソッドからマッピング配列を返すことによって、
これらのイベントのコールバック関数を設定することができます。 ::

    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterIdentify',
            'Auth.logout' => 'logout'
        ];
    }

カスタム認証オブジェクトの利用
------------------------------

カスタム認証オブジェクトを作成したら、 ``AuthComponent`` の authenticate 配列内にそれを
含めることで利用することができます。 ::

    $this->Auth->config('authenticate', [
        'Openid', // app 内の認証オブジェクト
        'AuthBag.Openid', // プラグインの認証オブジェクト
    ]);

.. note::
    単純な表記を使用する場合、認証オブジェクトの初期化の際「Authenticate」の文字は
    必要ありませんので注意してください。代わりに、名前空間を使用する場合は
    「Authenticate」の文字を含むクラスの完全な名前空間を設定する必要があります。

認証されていないリクエストの処理
--------------------------------

認証されていないユーザーが最初に保護されたページにアクセスしようとすると、 チェーンの最後の
オーセンティケーターの ``unauthenticated()`` メソッドが呼び出されます。認証オブジェクトが
適切に応答またはリダイレクトを送信処理し、それ以上のアクションは必要ないということを示すために
レスポンスオブジェクトを返すことができます。 ``authenticate`` 設定で認証オブジェクトを
指定する順序を設定できます。

オーセンティケーターが null を返した場合、 ``AuthComponent`` は、ユーザーをログインアクションに
リダイレクトします。Ajax リクエストでかつ ``ajaxLogin`` 設定が指定されていた場合、
その要素は描画され、そうでなければ HTTP ステータスコード 403 が返されます。

認証関連のフラッシュメッセージの表示
------------------------------------

Auth が生成するセッションエラーメッセージを表示するためには、あなたのレイアウトに次のコードを
加えなければなりません。 **src/Template/Layout/default.ctp** の body 部に次の2行を
追加してください。 ::

    // 3.4.0 以降は、これだけが必要です。
    echo $this->Flash->render();

    // 3.4.0 より前は、これも同様に必要です。
    echo $this->Flash->render('auth');

``AuthComponent`` の flash 設定を使うことでエラーメッセージをカスタマイズすることができます。
``flash`` 設定を使うことで、 ``AuthComponent`` がフラッシュメッセージのために使うパラメーターを
設定することができます。利用可能なキーは次のとおりです。

- ``key`` - 使用されるキー。デフォルトは 'default'。 3.4.0 より前の key のデフォルトは 'auth'。
- ``element`` - 描画に使用するエレメント名。デフォルトは null。
- ``params`` - 使用される追加の params 配列。デフォルトは ``[]`` 。

フラッシュメッセージの設定だけでなく、 ``AuthComponent`` が使用する他のエラーメッセージを
カスタマイズすることもできます。コントローラーの ``beforeFilter()`` の中や component の設定で、
認証が失敗した際に使われるエラーをカスタマイズするのに ``authError`` を使うことができます。 ::

    $this->Auth->config('authError', "Woopsie, you are not authorized to access this area.");

ユーザーがすでにログインしていた後にのみ、認可エラーを表示したいということもあると思います。
その場合は ``false`` を設定することにより、このメッセージを表示しないようにすることができます。

コントローラーの ``beforeFilter()`` 、またはコンポーネントの設定で::

    if (!$this->Auth->user()) {
        $this->Auth->config('authError', false);
    }

.. _hashing-passwords:

パスワードのハッシュ化
----------------------

データベースに永続化される前に、パスワードをハッシュ化する責任があり、最も簡単な方法は、
User エンティティーでセッター機能を使用することです。 ::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
              return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

``AuthComponent`` は、ユーザーの認証情報を検証するときに、 ``DefaultPasswordHasher`` を
使用するようにデフォルトで設定されています。ユーザーを認証するために追加の設定は必要とされません。

``DefaultPasswordHasher`` は、業界内で使用される強力なパスワードハッシュソリューションの
1つである bcrypt ハッシュアルゴリズムを内部で使用しています。このパスワードハッシュ化クラスを
使用することが推奨されていますが、パスワードが異なるアルゴリズムでハッシュ化されたユーザーの
データベースを管理しているケースも考慮しています。

カスタムパスワードハッシュ化クラスの作成
----------------------------------------

異なるパスワードハッシュ化クラスを使用するためには、**src/Auth/LegacyPasswordHasher.php**
クラスを作成し、 ``hash()`` と ``check()`` メソッドを実装する必要があります。
このクラスは ``AbstractPasswordHasher`` クラスを継承する必要があります。 ::

    namespace App\Auth;

    use Cake\Auth\AbstractPasswordHasher;

    class LegacyPasswordHasher extends AbstractPasswordHasher
    {

        public function hash($password)
        {
            return sha1($password);
        }

        public function check($password, $hashedPassword)
        {
            return sha1($password) === $hashedPassword;
        }
    }

その後、独自のパスワードハッシュ化クラスを使用するために ``AuthComponent`` の設定が必要です。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Legacy',
                    ]
                ]
            ]
        ]);
    }

レガシーシステムをサポートすることは良いアイデアですが、最新のセキュリティの進歩を使用して
データベースを保つことはさらに良いです。
次のセクションでは、あるハッシュアルゴリズムから CakePHP のデフォルトに移行する方法を説明します。

ハッシュ化アルゴリズムの変更
----------------------------

CakePHP は、1つのアルゴリズムから別のユーザーのパスワードを移行するためのクリーンな方法を提供します。
これは ``FallbackPasswordHasher`` クラスによって実現されます。
``sha1`` パスワードハッシュを使用している CakePHP 2.x のアプリを移行していると仮定すると、
次のように ``AuthComponent`` を設定することができます。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    }

``hashers`` キーに指定された最初の名前が好ましいクラスですが、チェックが失敗した場合には、
リスト内の他のクラスに切り替わります。

``WeakPasswordHasher`` を使用している場合、パスワードにソルトを付与することを保証するために
``Security.salt`` 値を設定する必要があります。

ユーザーの古いパスワードをその場で更新するために、ログイン機能を変更することができます。 ::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                if ($this->Auth->authenticationProvider()->needsPasswordRehash()) {
                    $user = $this->Users->get($this->Auth->user('id'));
                    $user->password = $this->request->getData('password');
                    $this->Users->save($user);
                }
                return $this->redirect($this->Auth->redirectUrl());
            }
            ...
        }
    }

エンティティーのセッター関数に再びプレーンなパスワードを設定することで、 上記の例に示すように、
パスワードをハッシュ化してからエンティティーを保存します。

手動でのユーザーログイン
------------------------

.. php:method:: setUser(array $user)

独自のアプリケーションを登録した直後など、時には手動によるログインが必要になる事態が
発生することもあるでしょう。ログインさせたいユーザーデータを引数に
``$this->Auth->setUser()`` を呼び出すことで、これを実現することができます。 ::

    public function register()
    {
        $user = $this->Users->newEntity($this->request->getData());
        if ($this->Users->save($user)) {
            $this->Auth->setUser($user->toArray());
            return $this->redirect([
                'controller' => 'Users',
                'action' => 'home'
            ]);
        }
    }

.. warning::

    ``setUser()`` メソッドに渡される配列に新たなユーザー ID が追加されていることを
    必ず確認してください。そうでなければ、そのユーザー ID が利用できなくなってしまいます。

ログインしているユーザーへのアクセス
------------------------------------

.. php:method:: user($key = null)

ユーザーがログインしたあと、現状のそのユーザーについての特定の情報が必要になることもあるでしょう。
``AuthComponent::user()`` を使うことで、現在ログインしているそのユーザーにアクセスすることが
できます。 ::

    // コントローラーや他のコンポーネントの中から
    $this->Auth->user('id');

現在のユーザーがログインしていない、もしくはキーが存在しないなら、null を返します。

ログアウト
----------

.. php:method:: logout()

最終的には認証を解除し、適切な場所へとリダイレクトするためのてっとり早い方法がほしくなるでしょう。
このメソッドはあなたのアプリケーション内のメンバーページに「ログアウト」リンクを入れたい場合にも
便利です。 ::

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

すべてのクライアントで、ダイジェスト認証や Basic 認証でログインしたユーザーのログアウトを
達成すること難しいものです。多くのブラウザーは開いている間だけ継続する認証情報を保有しています。
一部のクライアントは 401 のステータスコードを送信して強制的にログアウトすることができます。
認証 realm の変更は、一部のクライアントで機能させるためのもう１つの解決法です。

認証実行時の判定
----------------

いくつかのケースでは、 ``beforeFilter(Event $event)`` メソッドの中で ``$this->Auth->user()``
を使用したいこともあるでしょう。これは、 ``checkAuthIn`` 設定キーを使用して達成可能です。
最初に認証チェックを行いたいイベントの指定は次のように変更します。 ::

    // initialize() の中で認証するために AuthComponent を設定
    $this->Auth->config('checkAuthIn', 'Controller.initialize');

``checkAuthIn`` のデフォルト値は ``'Controller.startup'`` ですが、
``'Controller.initialize'`` を使用することによって、 ``beforeFilter()`` メソッドの前に
初めて認証が行われます。

.. _authorization-objects:

認可
====

認可は識別され認証されたユーザーが、要求するリソースへのアクセスを許可されていることを
保証するプロセスです。有効にした場合、 ``AuthComponent`` は自動的に認可ハンドラーをチェックして、
要求しているリソースへのアクセスを許可されたユーザーがログインしていることを確認することができます。
いくつかの組み込みの認可ハンドラーがありますが、あなたのアプリケーションまたはプラグインの一部として
独自のものを作成することができます。

- ``ControllerAuthorize`` アクティブなコントローラーの ``isAuthorized()`` を呼び出し、
  ユーザーの認可のために、その戻り値を使用します。これはユーザーの認可をもっともシンプルに行う方法です。

.. note::

    CakePHP 2.x で利用可能な ``ActionsAuthorize`` と ``CrudAuthorize`` アダプタは現在、
    独立したプラグインの `cakephp/acl <https://github.com/cakephp/acl>`_ に移されました。

認可ハンドラーの設定
--------------------

認可ハンドラーは ``authorize`` キーを使用して設定します。
認可に使うハンドラーを１つもしくは複数設定することができます。
複数のハンドラーを使うことで、さまざまな認可の方法をサポートできます。
認可ハンドラーがチェックされる際には、宣言された順に呼び出されます。
もし、認可を確認することができない場合やチェックが失敗した場合、
ハンドラーは ``false`` を返す必要があります。
もし、正常に認可を確認することができた場合、ハンドラーは ``true`` を返す必要があります。
いずれかのハンドラーを通過できるまで、順番に呼び出されます。
すべてのチェックが失敗した場合、ユーザーは元いたページへとリダイレクトされます。
また、例外をスローすることによって、すべての認可を失敗にすることもできます。
投げられた任意の例外をキャッチし、それらを処理する必要があります。

コントローラーの ``beforeFilter()`` もしくは ``initialize()`` メソッドの中に、
認可ハンドラーを設定することができます。
配列を使用して各認可オブジェクトに設定情報を渡すことができます。 ::

    // 基本的な設定
    $this->Auth->config('authorize', ['Controller']);

    // 設定を記述
    $this->Auth->config('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

``authorize`` も ``authenticate`` とほぼ同様で、 ``all`` キーを使うことで
コードを DRY に保ちやすくなります。この特別なキーを使うことで、列挙したオブジェクトすべてに
設定が渡されることになります。 ``all`` キーは ``AuthComponent::ALL`` と記述することもできます。 ::

    // 'all' を使って設定を記述
    $this->Auth->config('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

上記の例では、 ``Actions`` と ``Controller`` の両方ともが 'all' キーで宣言された設定を
取得することになります。特定の認可オブジェクトに個別に書いた設定は 'all' キーの同名の
キーの情報をオーバーライドします。

認証されたユーザーが、アクセスを許可されていない URL にアクセスしようとすると、リファラーに
リダイレクトされてしまいます。このようなリダイレクトをしたくない場合
(主にステートレス認証アダプタを使用する際に必要)、設定オプション ``unauthorizedRedirect`` に
``false`` を設定することができます。これは、 ``AuthComponent`` がリダイレクトする代わりに
``ForbiddenException`` を投げるようになります。

カスタム認可オブジェクトの作成
------------------------------

認可オブジェクトはプラガブルなので、カスタム認可オブジェクトを自分のアプリケーション内にでも、
プラグインとしてでも作成が可能です。もし例えば、LDAP 認可オブジェクトを作成したいのだとしたら、
**src/Auth/LdapAuthorize.php** の中で次のように記述することができます。 ::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Http\ServerRequest;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, ServerRequest $request)
        {
            // ldap 用の処理をここに記述します。
        }
    }

認可オブジェクトは該当ユーザーがアクセスを拒否されたり、該当オブジェクトでのチェックが
できなかった場合には ``false`` を返してください。認可オブジェクトがユーザーのアクセスが
妥当だと判定したなら ``true`` を返してください。 ``BaseAuthorize`` を継承する必要は
ありませんが、独自の認可オブジェクトは必ず ``authorize()`` メソッドを実装してください。
``BaseAuthorize`` クラスではよく使われる強力なメソッドが多数提供されます。

カスタム認可オブジェクトの利用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

カスタム認可オブジェクトを作成したら、AuthComponent の authorize 配列にそれらを
含めることで使うことができます。 ::

    $this->Auth->config('authorize', [
        'Ldap', // app 内の認可オブジェクト
        'AuthBag.Combo', // プラグインの認可オブジェクト
    ]);

認可を使用しない
----------------

どの組み込み認可オブジェクトも使いたくなくて、 ``AuthComponent`` の外側で完全に
権限を扱いたい場合は、 ``$this->Auth->config('authorize', false);`` を設定することが可能です。
デフォルトでは、 ``AuthComponent`` は、 ``authorize`` に ``false`` をセットした状態で始まります。
認可スキームを使用しない場合は、独自にコントローラーの ``beforeFilter()`` または別のコンポーネントで
認可を確認してください。

公開するアクションの作成
------------------------

.. php:method:: allow($actions = null)

コントローラーのアクションが完全に公開すべきものであったり、ユーザーのログインが
不要であったりという場合があります。 ``AuthComponent`` は悲観的であり、デフォルトでは
アクセスを拒否します。 ``AuthComponent::allow()`` を使うことで、公開すべきアクションに
印をつけることができます。アクションに公開の印をつけることで、 ``AuthComponent`` は該当のユーザーが
ログインしているかのチェックも、認可オブジェクトによるチェックも行わなくなります。 ::

    // すべてのアクションを許可。
    $this->Auth->allow();

    // index アクションのみ許可。
    $this->Auth->allow('index');

    // view と index アクションのみ許可
    $this->Auth->allow(['view', 'index']);

引数を空で呼びだすと、すべてのアクションを公開することを許可します。
単一のアクションの場合、文字列としてアクション名を指定することができます。
それ以外の場合は配列を使用します。

.. note::

    ``UsersController`` の「ログイン」アクションを許可するリストに追加してはいけません。
    そうすることで、 ``AuthComponent`` の正常な機能に問題を引き起こします。

認可が必要なアクションの作成
----------------------------

.. php:method:: deny($actions = null)

デフォルトでは、全てのアクションは認可を必要とします。一方、アクションに公開の印を付けた後、
その公開アクションを取り消したくなるかもしれません。そのために ``AuthComponent::deny()``
を使うことができます。 ::

    // 全てのアクションを拒否。
    $this->Auth->deny();

    // １つのアクションを拒否。
    $this->Auth->deny('add');

    // アクションのグループを拒否。
    $this->Auth->deny(['add', 'edit']);

引数を空で呼びだすと、すべてのアクションを拒否します。
単一のアクションの場合、文字列としてアクション名を指定することができます。
それ以外の場合は配列を使用します。

ControllerAuthorize の利用
--------------------------

ControllerAuthorize では、コントローラーのコールバックで認可チェックを処理することができます。
非常にシンプルな認可を行う場合や、認可を行うのにモデルとコンポーネントを合わせて利用する必要がある場合、
しかしカスタム認可オブジェクトを作成したくない場合に、これは理想的です。

コールバックでは必ず ``isAuthorized()`` を呼んでください。これは該当ユーザーがリクエスト内で
リソースにアクセスすることが許可されるかを boolean で返します。
コールバックにはアクティブなユーザーが渡されますので、チェックが可能です。 ::

    class AppController extends Controller
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // 登録済みユーザーなら誰でも公開機能にアクセス可能です。
            if (!$this->request->getParam('prefix')) {
                return true;
            }

            // admin ユーザーだけが管理機能にアクセス可能です。
            if ($this->request->getParam('prefix') === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // デフォルトは拒否
            return false;
        }
    }

上記のコールバックは非常にシンプルな認可システムとなっており、role = admin のユーザーだけが
admin に設定されたアクションにアクセスすることができます。

設定オプション
==============

以下の設定は、コントローラーの ``initialize()`` メソッドもしくは、 ``$this->Auth->config()``
を使用するかのどちらかで定義することができます。

ajaxLogin
    不正な／期限切れのセッションを伴った Ajax リクエストの場合に render すべき任意の
    ビューエレメントの名前。
allowedActions
    ユーザーの妥当性チェックが必要ないコントローラーのアクションの配列。
authenticate
    ユーザーのログインに使いたい認証オブジェクトの配列を設定してください。
    コアの認証オブジェクトがいくつか存在します。 :ref:`authentication-objects` を参照してください。
authError
    ユーザーがアクセス権の無いオブジェクトやアクションにアクセスした場合に表示されるエラー。

    ``false`` を設定することにより、authError メッセージを表示しないようにできます。
authorize
    各リクエストでユーザーの認可に使いたい認可オブジェクトの配列を設定してください。
    :ref:`authorization-objects` を参照してください。
flash
    Auth が ``FlashComponent::set()`` でフラッシュメッセージを行う必要があるときに使用します。
    利用可能なキーは以下のとおりです。

    - ``element`` - 使用されるエレメント。デフォルトは 'default' 。
    - ``key`` - 使用されるキー。デフォルトは 'auth' 。
    - ``params`` - 使用される追加の params 配列。デフォルトは '[]' 。

loginAction
    ログインを扱うコントローラーとアクションを表す (文字列や配列で定義した) URL。
    デフォルトは ``/users/login`` 。
loginRedirect
    ログイン後のリダイレクト先のコントローラーとアクションを表す (文字列や配列で定義した) URL。
    この値はユーザーが ``Auth.redirect`` をセッション内に持っている場合には無視されます。
logoutRedirect
    ユーザーがログアウトした後のリダイレクト先となるデフォルトのアクション。
    ``AuthComponent`` は post-logout のリダイレクトを扱いませんが、リダイレクト先の
    URL は :php:meth:`AuthComponent::logout()` から返されるものとなります。
    デフォルトは ``loginAction`` 。
unauthorizedRedirect
    許可されていないアクセスに対する処理を制御します。デフォルトでは、許可されていないユーザーは
    リファラーの URL か ``loginRedirect`` か、もしくは '/' にリダイレクトされます。
    ``false`` をセットした場合は、リダイレクトする代わりに ForbiddenException が送出されます。
storage
    ユーザーレコードを永続化するために使用するストレージクラス。
    ステートレスオーセンティケーターを使用する場合には、 ``Memory`` に設定する必要があります。
    デフォルトは ``Session`` 。
    配列を使用して、ストレージクラスに設定オプションを渡すことができます。
    例えば、独自のセッションキーを使用するには、 ``storage`` に
    ``['className' => 'Session', 'key' => 'Auth.Admin']`` を設定します。
checkAuthIn
    最初の認証チェックが行われるべきイベントの名前。デフォルトは ``Controller.startup`` 。
    コントローラーの ``beforeFilter()`` メソッドが実行される前にチェックしたい場合は、
    ``Controller.initialize`` に設定することができます。

``$this->Auth->config()`` を呼ぶことで、現在の設定の値を取得できます。 ::

    $this->Auth->config('loginAction');

    $this->redirect($this->Auth->config('loginAction'));

例えば ``login`` ルートにユーザーをリダイレクトしたい場合に便利です。
パラメーターを指定せずに、完全な設定が返されます。

AuthComponent で保護されたアクションのテスト
============================================

``AuthComponent`` で保護されたコントローラーのアクションをテストする方法のコツは、
:ref:`testing-authentication` セクションをご覧ください。

.. meta::
    :title lang=ja: 認証
    :keywords lang=ja: 認証ハンドラー,array php,basic 認証,ウェブアプリケーション,異なる方法,認証情報,例外,cakephp,ロギング
