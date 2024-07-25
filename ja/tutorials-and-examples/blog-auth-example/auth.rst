シンプルな認証と認可のアプリケーション
######################################

:doc:`/tutorials-and-examples/blog/blog` の例で、ログインユーザーに基づく特定の
URL に対してセキュアなアクセスをしたい、という状況を想像してください。
また、別の要求もあります。 複数の著者が自身の記事を作成、編集、削除できて、
一方で他の著者が自身のものではない記事に変更を加えるのを許可しないようなブログにすることができます。

ユーザーに関連するコードを作成する
==================================

まずはじめに、ユーザーデータを保持するためのブログデータベースの中に新しいテーブルを作成しましょう。 ::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

テーブルの命名には CakePHP の規則がありますが、別の規則も活用できます。
email と password のカラムをユーザーテーブルに使用すると、
CakePHP はユーザーログインの実装のときにほとんどのことを自動で定義します。

続いてのステップは、ユーザーデータを検索、保存、検証する ``UsersTable``  クラスを作成することです。 ::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('email', 'A email is required')
                ->email('email')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

では ``UsersController`` も作成しましょう。以下の内容は基本的に bake された
``UsersController`` の一部に対応するもので、
CakePHP にバンドルされているコード生成ユーティリティを利用しています。 ::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class UsersController extends AppController
    {
        public function index()
        {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }
    }

同じように、コード生成ツールで記事のビューを作り、ユーザーのビューを実装することができます。
このチュートリアルのために、 **add.php** をお見せしましょう。

.. code-block:: php

    <!-- templates/Users/add.php -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('email') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

認証の追加
==========

これで認証レイヤーを追加する準備ができました。
CakePHPでは、これは ``authentication`` プラグインによって処理されます。
まずはインストールしてみましょう。
composerを使ってAuthenticationプラグインをインストールします。

.. code-block:: console

    composer require "cakephp/authentication:^2.0"


パスワードハッシュの追加
========================

次に ``User`` エンティティを作成し、パスワードハッシュを追加してみましょう。
**src/Model/Entity/User.php** エンティティファイルを作成し、以下を追加します。 ::


    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // 主キーフィールドである「id」以外のすべてのフィールドを一括代入可能にします。
        protected $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

これでパスワードのプロパティがユーザに割り当てられるたびに
``DefaultPasswordHasher`` クラスを使ってハッシュ化されるようになりました。

認証の設定
==========

それでは、認証プラグインを設定しましょう。
このプラグインは3つの異なるクラスを使って認証処理を行います。 :

* ``Application`` は認証ミドルウェアを使用して、認証サービスを提供し、
  どのようにクレデンシャルをチェックするのか、どこにあるのかを定義したいすべての設定を保持します。
* AuthenticationService は、どのように定義するかを定義したいすべての設定を保持しています。
  認証情報をチェックして、どこにあるかを調べます。
* ``AuthenticationService`` はユーティリティクラスです。認証プロセスの一部として実行されます。
* ``AuthenticationMiddleware`` はミドルウェアキューの一部として実行されます。
  これは、コントローラがフレームワークによって処理される前に実行され、
  認証情報をピックアップして、ユーザーが認証されているかどうかをチェックするために処理します。

認証ロジックは特定のクラスに分割され、認証処理はコントローラ層の前に行われます。
最初の認証は、ユーザーが認証されているかどうかをチェックし (あなたが提供した設定に基づいて)、
ユーザーと認証結果をさらに参照するためのリクエストに注入します。

**src/Application.php** で、以下のインポートを追加します。 ::

    // src/Application.phpで以下のインポートを追加します
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Psr\Http\Message\ServerRequestInterface;

そして、アプリケーションクラスに認証インターフェースを実装します。 ::

    // src/Application.php で
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

その後、次のように追加します。 ::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... other middleware added before
            ->add(new RoutingMiddleware($this))
            // add Authentication after RoutingMiddleware
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => '/users/login',
            'queryParam' => 'redirect',
        ]);

        // 識別子をロードして、電子メールとパスワードのフィールドを確認します
        $authenticationService->loadIdentifier('Authentication.Password', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ]
        ]);

        // 認証子をロードするには、最初にセッションを実行する必要があります
        $authenticationService->loadAuthenticator('Authentication.Session');
        // メールとパスワードを選択するためのフォームデータチェックの設定
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => '/users/login',
        ]);

        return $authenticationService;
    }

``AppController`` クラスに以下のコードを追加します。::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        // Add this line to check authentication result and lock your site
        $this->loadComponent('Authentication.Authentication');

これで、すべてのリクエストに対して ``AuthenticationMiddleware`` はリクエストセッションを検査して
認証済みのユーザーを探すようになります。``/users/login`` ページをロードしている場合は、
投稿されたフォームデータ(もしあれば)も検査して資格情報を抽出します。
デフォルトでは、認証情報はリクエストデータの ``email`` と ``password`` フィールドから
抽出されます。認証結果は ``authentication`` という名前のリクエスト属性に注入されます。
この結果はいつでもコントローラのアクションから
``$this->request->getAttribute('authentication')`` を使って調べることができます。
すべてのページは ``AuthenticationComponent`` がリクエストごとに結果をチェックしているため、
制限されてしまいます。認証されたユーザを見つけられなかった場合は ユーザーを ``/users/login``
のページにリダイレクトします。
この時点ではまだログインページがないため、サイトは動作しませんので注意してください。
サイトにアクセスすると「無限リダイレクトループ」が発生します。
ということで、これを修正しましょう！

``UsersController`` に以下のコードを追加します。 ::

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // ログインアクションを認証を必要としないように設定することで、
        // 無限リダイレクトループの問題を防ぐことができます
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // POSTやGETに関係なく、ユーザーがログインしていればリダイレクトします
        if ($result->isValid()) {
            // ログイン成功後に /article にリダイレクトします
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // ユーザーの送信と認証に失敗した場合にエラーを表示します
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Invalid email or password'));
        }
    }

ログインアクションのテンプレートロジックを追加します。 ::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('ユーザー名とパスワードを入力してください') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Add User", ['action' => 'add']) ?>
    </div>

これでログインページでアプリケーションに正しくログインできるようになりました。
あなたのサイトの任意のページをリクエストしてテストしてください。
``/users/login`` ページにリダイレクトされた後、
ユーザーを作成した時に選択したメールアドレスとパスワードを入力してください。
ログイン後、正常にリダイレクトされるはずです。

アプリケーションの設定を行うために、もう少し詳細を追加する必要があります。
すべての ``view`` と ``index`` のページにログインせずにアクセスできるようにしたいので、
この設定を ``AppController`` に追加します。 ::

    // src/Controller/AppController.php で
    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        // このアプリケーションのすべてのコントローラのために、
        // インデックスとビューのアクションを公開し、認証チェックをスキップします
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

ログアウト
==========

ログアウトアクションを ``UsersController``` クラスに追加します。 ::

    // src/Controller/UsersController.php で
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // POSTやGETに関係なく、ユーザーがログインしていればリダイレクトします
        if ($result->isValid()) {
            $this->Authentication->logout();
            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

これで ``/users/logout`` にアクセスしてログアウトすることができます。
そうするとログインページが表示されるはずです。

ここまで来れば、おめでとうございます。
あなたは今、以下の機能を備えたシンプルなブログを持っているはずです。 :

* 認証されたユーザが、記事を作成・編集することができます。
* 認証されていないユーザーが、記事やタグを閲覧することができます。

より詳しく知りたい方のための読みもの
------------------------------------

#. :doc:`/bake/usage` 基本的な CRUD コードの生成について
#. :doc:`/controllers/components/authentication`: ユーザーの登録とログインについて

.. meta::
    :title lang=ja: Simple Authentication Application
    :keywords lang=ja: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
