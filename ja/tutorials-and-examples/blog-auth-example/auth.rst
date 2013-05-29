シンプルな認証と承認のアプリケーション
######################################

:doc:`/tutorials-and-examples/blog/blog` の例の続きで、ユーザーログインを基に、一定のURLへのアクセスを安全にしたいとしましょう。
その他の要件として、ブログに複数の執筆者(*authors*)がいて、それぞれが各々の意思により投稿を作成、編集、削除でき、他の投稿者からはどんな変更もできないようにします。

ユーザーに関連するコードの作成
==============================

初めに、ユーザーのデータを保持するためにブログデータベースに新しいテーブルを作成しましょう::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

テーブルの命名は既にCakePHPの規約に従っていますが、他の規約も活用しています:
ユーザーテーブルでusernameとpasswordカラムを使うことによって、ユーザーログインを実装するにあたってほとんどのことをCalePHPが自動的に設定します。

次のステップはユーザーのデータを探索(*finding*)、保存(*saving*)、検証(*validating*)する責任を持つ、ユーザーモデルを作成することです::

    // app/Model/User.php
    class User extends AppModel {
        public $validate = array(
            'username' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
                    'message' => 'A username is required'
                )
            ),
            'password' => array(
                'required' => array(
                    'rule' => array('notEmpty'),
                    'message' => 'A password is required'
                )
            ),
            'role' => array(
                'valid' => array(
                    'rule' => array('inList', array('admin', 'author')),
                    'message' => 'Please enter a valid role',
                    'allowEmpty' => false
                )
            )
        );
    }

UsersControllerもまた作成しましょう。
以下のコードは基本的なCakePHPにバンドルされたコード生成ユーティリティで `焼き上がった` (*baked*) UsersControllerクラスに該当します::

    // app/Controller/UsersController.php
    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

        public function index() {
            $this->User->recursive = 0;
            $this->set('users', $this->paginate());
        }

        public function view($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->read(null, $id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('The user has been saved'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('The user could not be saved. Please, try again.'));
                }
            }
        }

        public function edit($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->request->is('post') || $this->request->is('put')) {
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash(__('The user has been saved'));
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash(__('The user could not be saved. Please, try again.'));
                }
            } else {
                $this->request->data = $this->User->read(null, $id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            if (!$this->request->is('post')) {
                throw new MethodNotAllowedException();
            }
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Session->setFlash(__('User deleted'));
                $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('User was not deleted'));
            $this->redirect(array('action' => 'index'));
        }
    }

以前ビューを作成した方法と同様に、またはコード生成ツールを用いて、ビューを実装します。
このチュートリアルの目的に沿って、add.ctpだけを示します:

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit')); ?>
    </div>

認証(ログインとログアウト)
==========================

ようやく認証のレイヤーを追加する準備が整いました。
CakePHPではこれを :php:class:`AuthComponent` で処理します。
このクラスは一定のアクションにログインを必要とさせる、ユーザーのサインインとサインアウトの処理、またログインユーザーがアクションに到達することが許可されているかの認証に責任を持ちます。

このコンポーネントをアプリケーションに追加するには、
``app/Controller/AppController.php`` ファイルを開いて、以下の行を追加してください::

    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Session',
            'Auth' => array(
                'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
                'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home')
            )
        );

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

usersテーブルで規約を用いたので、設定することが多くありません。
ログインとログアウトのアクションが実行された後に読み込まれるURLを、このケースではそれぞれ ``/posts/`` と ``/`` にセットアップします。

``beforeFilter`` 関数で、AuthComponentに全てのコントローラの ``index`` と ``view`` アクションでログインを必要としないように伝えました。
サイトに登録していない訪問者にエントリを読ませたりリストを見せたりすることができるようにしたのです。

さて、新しいユーザーを登録すること、usernameとpasswordを保存すること、更に重要な平文(*plain text*)でデータベースに保存されないようにパスワードをハッシュ化にすることを可能にする必要があります。
AuthComponentに認証されていないユーザーがusersのadd関数にアクセスすること、実装にログインとログアウトアクションを伝えましょう::

    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('add'); // ユーザーに自身で登録させる
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                $this->redirect($this->Auth->redirect());
            } else {
                $this->Session->setFlash(__('Invalid username or password, try again'));
            }
        }
    }

    public function logout() {
        $this->redirect($this->Auth->logout());
    }

パスワードのハッシュ化はまだされていません。
``app/Model/User.php`` のモデルファイルを開いて、以下のものを追加してください::

    // app/Model/User.php
    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {

    // ...

    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $this->data[$this->alias]['password'] = AuthComponent::password($this->data[$this->alias]['password']);
        }
        return true;
    }

    // ...

これで、ユーザーが保存されるときは毎回、AuthComponentクラスが提供するデフォルトのハッシュ方法を用いてパスワードがハッシュ化されます。
あとはログイン関数のビューテンプレートファイルだけです。
以下のものを使ってください:

.. code-block:: php

    <div class="users form">
    <?php echo $this->Session->flash('auth'); ?>
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend><?php echo __('Please enter your username and password'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login')); ?>
    </div>

``/user/add`` URLにアクセスして新しいユーザーを登録し、 ``/users/login`` URLに行き、新しく作られた認証情報を用いてログインすることができるようになりました。
また、 ``/posts/add`` のような明示的に許可されていない他のURLにアクセスしてみて、アプリケーションが自動的にログインページにリダイレクトさせることを確かめてください。

そしてこれでおしまいです！
シンプルすぎて事実とは思えないかもしれません。
ちょっと戻って何が起きたのか説明しましょう。
``beforeFilter`` 関数がAuthComponentにAppControllerの ``beforeFilter`` 関数で許可されていた ``index`` と ``view`` アクションに加え、 ``add`` アクションがログインを必要としないことを伝えています。

``login`` アクションはAuthComponentの ``this->Auth->login()`` 関数を呼び、前述した規約に従っていたためこれ以上の設定無しに動作します。
規約とは、usernameとpasswordカラムをもつUserモデルを用意し、コントローラに送信されるユーザーのデータを含むフォームを使用するということです。
この関数はログインが成功したかどうかを返し、成功した場合は、アプリケーションにAuthComponentを追加した時に設定したリダイレクト先のURLにユーザーをリダイレクトさせます。

``/users/logout`` URLにアクセスさえすればログアウトが動作し、先に説明した、設定されたlogoutUrlにユーザーをリダイレクトさせます。
このURLは ``AuthComponent::logout()`` 関数が成功した時の返り値となります。

承認(誰が何にアクセスができるか)
================================

前述の通り、このブログを複数ユーザーが書き込めるツールに書き換えようとしていますが、これをするために、postsテーブルを多少書き換えてUserモデルへの参照を追加する必要があります::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

また、作成された投稿に、現在ログインしているユーザーを参照として保存するために、PostsControllerでの小さな変更が必要です::

    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            $this->request->data['Post']['user_id'] = $this->Auth->user('id'); //Added this line
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Your post has been saved.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

Authコンポーネントの ``users()`` 関数は現在ログインしているユーザーから全てのカラムを返します。
このメソッドを使って、保存されるリクエストデータにそのデータを追加します。

誰かが他の著者の投稿を編集したり削除したりするのを防ぐように、アプリケーションをセキュアにしましょう。
アプリケーションの基本的なルールは、普通のユーザー(authorロール)が許可されたアクションだけにアクセスできる一方、管理者ユーザーが全てのURLにアクセスできるということです。
もう一度AppControllerクラスを開いてAuthの設定にちょっとばかりのオプションを追加しましょう::

    // app/Controller/AppController.php

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'authorize' => array('Controller') // この行を追加しました
        )
    );

    public function isAuthorized($user) {
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // デフォルトは拒否
        return false;
    }

とても単純な承認機構を作成しました。
この場合、 ``admin`` ロールを持つユーザーはログイン時サイト内の全てのURLにアクセスすることができるでしょう。
しかし残りの人々(例えば ``author`` ロールの人)はログインしていないユーザーと変わらず、何もすることができません。

これは望んでいたものとは違いますので、 ``isAuthrorized()`` メソッドにより多くのルールを与えるよう修正する必要があります。
しかしAppControllerでこれをする代わりに、それらの特殊ルールの提供を各コントローラに委譲しましょう。
PostsControllerに追加しようとしているルールは投稿の作成を著者に許可すべきですが、著者が合っていない場合投稿の編集を防止する必要があります。
``PostsController.php`` のファイルを開き、以下の内容を追加してください::

    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        // 登録済ユーザーは投稿できる
        if ($this->action === 'add') {
            return true;
        }

        // 投稿のオーナーは編集や削除ができる
        if (in_array($this->action, array('edit', 'delete'))) {
            $postId = $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

今AppControllerの ``isAuthorized()`` 呼び出しを上書きし、内部で親クラスが既にユーザーを承認しているかをチェックしています。
親クラスが承認しなければ、続いてaddアクションへのアクセス、条件的にeditとdeleteを許可します。
最後に、実装するものが残っています。
ユーザーが投稿を編集できるかを承認されているかどうかを伝えるために、Postモデルの ``isOwnedBy()`` 関数を呼んでいます。
一般的に、できるだけ多くのロジックをモデルに移動することは良い習慣です。
それではその関数を実装していきましょう::

    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) === $post;
    }

これはシンプルな認証と承認のチュートリアルのまとめとなります。
UsersControllerをセキュアにするためには、PostsControllerでしたものと同様のテクニックに続くことができ、独自のルールを元に、より創造性をもち、またAppControllerでより汎用的なコードを書くこともできるでしょう。

もっと色々なコントロールを必要とするかもしれません。
コンポーネントの設定、独自の承認クラスの作成、などなどをもっと知るものとして、 :doc:`/core-libraries/components/authentication` セクションで完全なAuthガイドを読むことをお勧めします。

お勧めの参考資料
----------------

1. :doc:`/console-and-shells/code-generation-with-bake` 基本的なCRUDコードの生成 
2. :doc:`/core-libraries/components/authentication`: ユーザーの登録とログイン

