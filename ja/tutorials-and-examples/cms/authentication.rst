CMS チュートリアル - 認証
#########################

CMS にはユーザーがいますので、
`cakephp/authentication <https://book.cakephp.org/authentication/2>`__ プラグインを使用してログインできるようにします。
まず、パスワードがデータベースに安全に保存されるようにします。
次に、ログインとログアウト機能を提供し、新規ユーザーを登録できるようにします。

認証プラグインのインストール
================================

composer を使用して認証プラグインをインストール

.. code-block:: console

    composer require "cakephp/authentication:^2.0"

パスワードハッシュ化の追加
--------------------------

データベースの ``users`` テーブル用に ``Controller``, ``Table``, ``Entity`` および テンプレートを作成する必要があります。
ArticlesController と同様に、手動、もしくは bake シェルを使用してこれらのクラスを生成することができます。

.. code-block:: console

    bin/cake bake all users

もしこの時点でユーザーを作成・更新していたとしたら、パスワードが平文で保存されることに気付いたかもしれません。
これは、セキュリティの観点から本当に悪いことですので、修正しましょう。

これはまた、CakePHP のモデル層について話す良い時期です。CakePHP では、
オブジェクトのコレクションに対して操作するメソッドと、単一のオブジェクトを別のクラスに分けています。
エンティティーのコレクションに対して操作するメソッドは ``Table`` クラスにあり、
一方、単一のレコードに属する機能は ``Entity`` クラスにあります。

例えば、パスワードのハッシュ化は個々のレコードで行われるため、
この動作をエンティティーオブジェクトに実装します。パスワードが設定されるたびにパスワードを
ハッシュ化したいので、ミューテーター/セッターメソッドを使用します。CakePHP は、
エンティティーの1つにプロパティーが設定されているときはいつでも、規約に基づいたセッターメソッドを呼び出します。
パスワードのセッターを追加しましょう。 **src/Model/Entity/User.php** の中に次を追加してください。 ::

    <?php
    namespace App\Model\Entity;

    use Authentication\PasswordHasher\DefaultPasswordHasher; // この行を追加
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // bake で生成されたコード

        // このメソッドを追加
        protected function _setPassword(string $password) : ?string
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher())->hash($password);
            }
            return null;
        }
    }

次に、ブラウザで **http://localhost:8765/users** にアクセスし、ユーザー一覧を表示します。
ローカルサーバーを実行する必要があることに注意してください。
``bin/cake server`` を使用して standalone PHP server を起動します。

:doc:`Installation <installation>` で作成したデフォルトユーザーを編集する事が出来ます。
ユーザーのパスワードを変更すると、一覧画面または詳細画面に元の値の代わりにハッシュ化されたパスワードが表示されます。

CakePHP はデフォルトでは `bcrypt <https://codahale.com/how-to-safely-store-a-password/>`_ でパスワードをハッシュ化します。

セキュリティ基準を高く保つために、すべての新しいアプリケーションに bcrypt を使用することを推奨します。
bcrypt は `PHPの推奨パスワードハッシュアルゴリズム <https://www.php.net/manual/en/function.password-hash.php>`_ です。

.. note::

    少なくとも1つのユーザーアカウントのハッシュ化されたパスワードを今すぐ作成してください！
    次のステップで必要になります。
    パスワードを更新すると、パスワードカラムに長い文字列が保存されます。
    注意: 同じパスワードを2回保存した場合でも、bcrypt は異なるハッシュを生成します。


ログインの追加
==============

次に、認証プラグインを設定します。
プラグインは、3つの異なるクラスを使用して認証プロセスを処理します。

* ``Application`` は Authentication Middleware を使用して AuthenticationService を提供し、
  credentials のチェック方法と credentials を見つける場所を定義する為のすべての設定を保持します。
* ``AuthenticationService`` は認証プロセスを設定できるユーティリティクラスになります。
* ``AuthenticationMiddleware`` はミドルウェアキューの一部として実行され、
  コントローラーがフレームワークによって処理される前に、credentials を選り出して処理し、
  ユーザーが認証されているかどうかチェックします。

覚えているかもしれませんが、
以前は、これらすべてのステップを処理するために AuthComponentを使用していました。
現在では、ロジックは特定のクラスに分割され、認証プロセスはコントローラーレイヤーの前に行われます。
ユーザーが(指定した構成に基づいて)認証されたかどうか確認し、ユーザーと認証結果をリクエストに挿入し、参照できるようにします。

**src/Application.php** に次の imports を追加します::

    // src/Application.php に次の imports を追加します
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Cake\Routing\Router;
    use Psr\Http\Message\ServerRequestInterface;

次に ``Application`` クラスに認証インターフェースを実装します::

    // in src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

次に以下を追加します::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... 前に追加された他のミドルウェア
            ->add(new RoutingMiddleware($this))
            // RoutingMiddleware の後に認証を追加
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => Router::url('/users/login'),
            'queryParam' => 'redirect',
        ]);

        //  authenticatorsをロードしたら, 最初にセッションが必要です
        $authenticationService->loadAuthenticator('Authentication.Session');
        // 入力した email と password をチェックする為のフォームデータを設定します
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => Router::url('/users/login'),
            'identifier' => [
                'Authentication.Password' => [
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password',
                    ],
                ],
            ],
        ]);

        return $authenticationService;
    }

``AppController`` クラスに次のコードを追加します::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        // 認証結果を確認し、サイトのロックを行うために次の行を追加します
        $this->loadComponent('Authentication.Authentication');

リクエスト毎に ``AuthenticationMiddleware`` はリクエストされたセッションを検査し、認証されたユーザーを探します。
``/users/login`` ページを読み込む場合、
POSTされたフォームデータ(存在する場合)も検査し、credentials を抽出します。
デフォルトでは credentials はリクエストデータの ``username`` and ``password`` から抽出されます。
認証結果は、``authentication`` という名前でリクエスト属性に挿入されます。
コントローラーアクションで ``$this->request->getAttribute('authentication')`` を使用し、いつでも結果を調べることができます。
``AuthenticationComponent`` がリクエストごとに結果をチェックしているため、すべてのページが制限されます。
認証されたユーザーが見つからない場合、ユーザーを ``/users/login`` ページにリダイレクトします。
注意: この時点では、ログインページがまだないため、サイトは機能しません。
サイトにアクセスすると "infinite redirect loop" が発生するので、修正しましょう。

``UsersController`` に次のコードを追加します::

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // 認証を必要としないログインアクションを構成し、
        // 無限リダイレクトループの問題を防ぎます
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // POST, GET を問わず、ユーザーがログインしている場合はリダイレクトします
        if ($result && $result->isValid()) {
            // redirect to /articles after login success
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // ユーザーが submit 後、認証失敗した場合は、エラーを表示します
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid username or password'));
        }
    }

ログインアクション用のテンプレートロジックを追加します::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Add User", ['action' => 'add']) ?>
    </div>

これで、ログインページでアプリケーションに正しくログインできるようになります。
サイトの任意ページをリクエストしてテストします。
``/users/login`` ページにリダイレクトしたら、ユーザー作成時に入力した電子メールとパスワードを入力します。
ログイン後、正常にリダイレクトされるはずです。

さらにいくつかの詳細をアプリケーションに追加する必要があります。
ログインせずにすべての ``view`` 及び ``index`` ページにアクセスできるようにするため、特定の設定を AppController に追加します。::

    // in src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // アプリケーション内のすべてのコントローラーの index と view アクションをパブリックにし、認証チェックをスキップします
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

.. note::

    ハッシュ化されたパスワードを持つユーザーがまだいない場合、
    AppController の ``loadComponent('Authentication.Authentication')`` 行をコメントアウトし、
    ``/users/add`` に移動して、email と password を入力する新規ユーザーを作成します。
    一時的にコメントした行のコメントを外してください！

ログインする前に ``/articles/add`` にアクセスして試してください!
このアクションは許可されていないため、ログインページにリダイレクトされます。
ログインに成功すると、CakePHP は自動的に ``/articles/add`` にリダイレクトします。

ログアウト
================

logout アクションを ``UsersController`` に追加します。::

    // in src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // POST, GET を問わず、ユーザーがログインしている場合はリダイレクトします
        if ($result && $result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

これで ``/users/logout`` にアクセスしてログアウトできます。
その後、ログインページに移動します。

ユーザー登録の有効化
====================

ログインせずに **/users/add** にアクセスしようとすると、ログインページにリダイレクトされます。
ユーザーがアプリケーションにサインアップできるようにしたいので、これを修正する必要があります。
``UsersController`` の次の行を修正します::

    // UsersController の beforeFilter メソッドに追加します
    $this->Authentication->addUnauthenticatedActions(['login', 'add']);

上記は ``AuthenticationComponent`` に ``UsersController`` の ``add()`` アクションが認証または認可を必要と *しない* ことを伝えます。
時間をかけて **Users/add.php** をクリーンアップし誤解を招くリンクを削除してもよいですし、
もしくは次のセクションに進んでください。
このチュートリアルでは、ユーザーによる編集、表示、一覧表示は行いませんが、これは自分自身で行うことができる演習です。

ユーザーがログインできるようになったので、 :doc:`認可ポリシーの適用 <./authorization>` でユーザーが作成した記事のみを編集できるように制限します。

