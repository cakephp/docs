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
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

テーブルの命名には CakePHP の規則がありますが、別の規則も活用できます。
username と password のカラムをユーザーテーブルに使用すると、
CakePHP はユーザーログインの実装のときにほとんどのことを自動で定義します。

続いてのステップは、ユーザーデータを検索、保存、検証する UsersTable クラスを作成することです。 ::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

では UsersController も作成しましょう。以下の内容は基本的に bake された
UsersController の一部に対応するもので、
CakePHP にバンドルされているコード生成ユーティリティを利用しています。 ::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

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
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                // 3.4.0 より前は $this->request->data() が使われました。
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
このチュートリアルのために、 add.ctp をお見せしましょう。

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

認証(ログインとログアウト)
==========================

認証レイヤーを追加する準備が整いました。CakePHP において、これは
:php:class:`Cake\\Controller\\Component\\AuthComponent` で扱われており、
このクラスはあるアクションのログインで必要となり、ユーザーのログインとログアウトを扱い、
そしてログインユーザーがアクセスできるアクションの認証を行います。

このコンポーネントをアプリケーションに追加するには、 **src/Controller/AppController.php**
ファイルを開いて、以下の行を追加してください。 ::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

設定する箇所はさほど多くはありません。ユーザーテーブルでは規約を利用しているからです。
ログインおよびログアウトアクションが実行された後に読み込まれるURLのセットアップをしました。
今回の場合では ``/articles/`` および ``/`` をそれぞれ設定しました。

``beforeFitler()`` 関数でしたことは、 AuthComponent にそれぞれのコントローラーの
``index()`` と ``view()`` アクションではログインは不要であると伝えることです。
このサイトでは、登録なしでもエントリーを読んだり一覧したりさせたいのです。

それでは、新しいユーザーを登録できるようにする必要があります。ユーザーネームとパスワードを保存し、
そしてさらに重要なこととして、パスワードがデータベースないに平文で保存されないようにパスワードを
ハッシュ化しましょう。
それでは、 AuthComponent に認証されていないユーザーにはユーザー追加機能にアクセスさせるように設定して、
ログインとログアウトのアクションを実装しましょう。 ::

    // src/Controller/UsersController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {
        // その他のメソッド..

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            // ユーザーの登録とログアウトを許可します。
            // allow のリストに "login" アクションを追加しないでください。
            // そうすると AuthComponent の正常な機能に問題が発生します。
            $this->Auth->allow(['add', 'logout']);
        }

        public function login()
        {
            if ($this->request->is('post')) {
                $user = $this->Auth->identify();
                if ($user) {
                    $this->Auth->setUser($user);
                    return $this->redirect($this->Auth->redirectUrl());
                }
                $this->Flash->error(__('Invalid username or password, try again'));
            }
        }

        public function logout()
        {
            return $this->redirect($this->Auth->logout());
        }
    }

パスワードのハッシュ化はまだ済んでいません。特別なロジックを扱うためには、User の Entity
クラスが必要です。 **src/Model/Entity/User.php** にエンティティーファイルを作成し、以下を追加します。 ::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // 主キーフィールド "id" を除く、すべてのフィールドを一括代入可能にします。
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

これで、パスワードのプロパティーがユーザーにアサインされるたびに、 ``DefaultPasswordHasher``
クラスを用いてパスワードがハッシュ化されます。ログイン機能のテンプレートビューファイルが足りていません。
**src/Template/Users/login.ctp** ファイルを開いて、以下を追加してください。

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render() ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

``/users/add`` の URL にアクセスすると、新しいユーザーを登録でき、 ``/users/login`` URL
で新しく作られた認証情報を用いてログインできます。また、 ``/articles/add`` のように、
明確に許可されていない他のURLにもアクセスしてみてください。アプリケーションがログインページに
自動的にリダイレクトするのがわかります。

そして、これで終わりです！ シンプルすぎるようですが、これで良いのです。
何が起こったのかを少し戻って説明しましょう。
AppController の ``beforeFilter()`` ですでに許可されている ``index()`` および ``view()``
アクションに加えて、 ``add()`` アクションもログインが不要であることを AuthComponent に
``beforeFilter()`` で伝えています。

``login()`` アクションは AuthComponent 内の ``$this->Auth->identify()`` 関数で呼び、
特別な設定なしに動きます。
なぜなら先に言及した通り、規約に従っているからです。Users テーブルは username,
password のカラムを持ち、ユーザーデータをコントローラーに送るフォームを利用します。
この関数はログインがうまくいったかどうかを返します、そしてうまくいった場合は、
アプリケーションの AuthComponent に追加したときに使用した、
設定されたリダイレクト URL にリダイレクトします。

ログアウトはただ ``/users/logout`` URL にアクセスするだけで動作します。
そして先に宣言し設定したログアウト URL にリダイレクトさせます。
この URL は、 ``AuthComponent::logout()`` 関数がうまくいった場合の結果です。

認可(誰が何にアクセスするのを許可するか)
========================================

始める前に、このブログをマルチユーザーが認可されるツールにし、
これをするために、記事テーブルを少し変更して、ユーザーテーブルへの参照を追加します。 ::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

さらに、 ArticlesController に、記事を作成した現在のログインユーザーの参照を追加するように
少し変更する必要があります。 ::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            // 3.4.0 より前は $this->request->data() が使われました。
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // この行を追加
            $article->user_id = $this->Auth->user('id');
            // また、次のようにすることもできます
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);

        // 記事のカテゴリーを1つ選択できるようにカテゴリーリストを追加しました
        $categories = $this->Articles->Categories->find('treeList');
        $this->set(compact('categories'));
    }

このコンポーネントで提供されている ``user()`` 関数は、現在ログインしているユーザーのカラムを返します。
保存されたリクエスト情報の中のデータを追加するためにこのメソッドを利用します。

それでは、ある著者が他の人の記事を編集したり削除したりするのから守りましょう。
アプリケーションの基本的なルールは、管理ユーザーはすべての URL にアクセスでき、
通常のユーザー(著者ロール)は許可されたアクションにしかアクセスできない、というものです。
もう一度 AppController クラスを開いて、 Auth の設定を少し追加してください。 ::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // この行を追加
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ]
        ]);
    }

    public function isAuthorized($user)
    {
        // 管理者はすべての操作にアクセスできます
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // デフォルトは拒否
        return false;
    }

シンプルな認可メカニズムを作成しました。 ``admin`` ロールのユーザーはログインしていれば
サイト内のあらゆる URL にアクセスできます。
他のユーザー、 ``author`` ロールのユーザーは、ログインしていないユーザーと同じアクセス権を持ちます。

これは、求めているものではありません。 ``isAuthorized()`` メソッドで、
さらにルールを追加する必要があります。このことを AppConroller 内でやるかわりに、
各個別のコントローラーにさらなるルールを追加することにしましょう。
追加しようとしているルールというのは、 ArticlesController によって、著者は記事を作成できるが、
自分のものではない記事を編集できないようにする、というものです。
以下の内容を **ArticlesController.php** に追加してください。 ::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // 登録ユーザー全員が記事を追加できます
        // 3.4.0 より前は $this->request->param('action') が使われました。
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // 記事の所有者は編集して削除することができます
        // 3.4.0 より前は $this->request->param('action') が使われました。
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            // 3.4.0 より前は $this->request->params('pass.0')
            $articleId = (int)$this->request->getParam('pass.0');
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

AppController の ``isAuthorized()`` を上書きして、内部的に親クラスをチェックすることによって
すでにユーザーを認可しています。そうでなければ、 add アクションへのアクセスだけを許可し、条件付きで
edit や delete へアクセスできます。最後のひとつだけが実装されていません。
記事を編集するためのユーザーが認可されているかどうかを伝えるために、 ArticlesTable の
``isOwnedBy()`` 関数を呼んでいます。それでは、この関数を実装しましょう。 ::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

これでシンプルな認証と認可のチュートリアルが終わりです。
UseresController を守るためには、 ArticlesController でやったのと同じテクニックを利用できます。
もっとクリエイティブになって、あなた自身のルールに基づいて AppController の中で
さらに一般的なものを実装することもできます。

もしより制御したいのなら、 :doc:`/controllers/components/authentication` セクションの
Auth ガイドを通して読むことをお勧めします。
コンポーネントの設定や、カスタム認証クラスの作成、そしてその他のことをさらに見つけることができるでしょう。

より詳しく知りたい方のための読みもの
------------------------------------

#. :doc:`/bake/usage` 基本的な CRUD コードの生成について
#. :doc:`/controllers/components/authentication`: ユーザーの登録とログインについて

.. meta::
    :title lang=ja: Simple Authentication and Authorization Application
    :keywords lang=ja: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
