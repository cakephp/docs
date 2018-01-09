CMS チュートリアル - 認証
#########################

CMS にはユーザーがいますので、ログインできるようにし、
記事の作成と編集の経験に基本的なアクセス制御を適用する必要があります。

パスワードハッシュ化の追加
--------------------------

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

    use Cake\Auth\DefaultPasswordHasher; // この行を追加
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // bake のコード

        // このメソッドの追加
        protected function _setPassword($value)
        {
            if (strlen($value)) {
                $hasher = new DefaultPasswordHasher();

                return $hasher->hash($value);
            }
        }
    }

ここで、ブラウザーで **http://localhost:8765/users** にアクセスしてユーザーのリストを
見てください。 :doc:`インストール <installation>` 中に作成されたデフォルトユーザーを
編集することができます。ユーザーのパスワードを変更すると、リストやビューページでは
元の値の代わりにハッシュ化されたパスワードが表示されます。CakePHP は、デフォルトでは
`bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ を使って
パスワードをハッシュ化します。既存のデータベースを使用している場合は SHA-1 または MD5 を
使用することもできますが、すべての新しいアプリケーションに対して bcrypt を推奨します。

ログインの追加
==============

CakePHP での認証は、 :doc:`/controllers/components` によって処理されます。コンポーネントは、
特定の機能やコンセプトに関連するコントローラーコードの再利用可能なかたまりを作成する方法と
考えることができます。コンポーネントは、コントローラーのイベントライフサイクルにフックし、
その方法でアプリケーションとやりとりすることができます。まず、 :doc:`AuthComponent
</controllers/components/authentication>` をアプリケーションに追加します。
create、update、delete メソッドで認証が必要なので、AuthComponent を AppController
に追加します。 ::

    // src/Controller/AppController.php の中で
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            // 既存のコード

            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                // 未認証の場合、直前のページに戻します
                'unauthorizedRedirect' => $this->referer()
            ]);

            // display アクションを許可して、PagesController が引き続き
            // 動作するようにします。また、読み取り専用のアクションを有効にします。
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }

CakePHP に ``Auth`` コンポーネントをロードするように指示しました。users テーブルは
ユーザー名として ``email`` を使用するので、AuthComponent の設定をカスタマイズしました。
今、 ``/articles/add`` のような保護された URL に行くと、 **/users/login** に
リダイレクトされます。これはまだコードを書いていないので、エラーページを表示します。
login アクションを作成しましょう。 ::

    // src/Controller/UsersController.php の中で
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('ユーザー名またはパスワードが不正です。');
        }
    }

そして **src/Template/Users/login.ctp** に次を追加してください。 ::

    <h1>ログイン</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('ログイン') ?>
    <?= $this->Form->end() ?>

シンプルなログインフォームが完成したので、ハッシュ化されたパスワードを持つユーザーで
ログインできるはずです。

.. note::

    もし、ハッシュ化されたパスワードを持つユーザーがいない場合、
    ``loadComponent('Auth')`` ブロックと ``$this->Auth->allow()`` 呼び出しを
    コメントにしてください。その後、ユーザーのパスワードを保存して編集します。
    ユーザーの新しいパスワードを保存した後、一時的にコメントした行を元に戻してください。

さぁやってみましょう！ログインする前に ``/articles/add`` にアクセスしてください。
この操作は許可されていないため、ログインページにリダイレクトされます。
ログインに成功すると、CakePHP は自動的に ``/articles/add`` にリダイレクトします。

ログアウトの追加
================

ユーザーがログインできるようになったので、おそらくログアウトする方法を提供したいと思うでしょう。
もう一度、 ``UsersController`` に次のコードを追加してください。 ::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('ログアウトしました。');
        return $this->redirect($this->Auth->logout());
    }

このコードは、認証を必要としないアクションのリストに ``logout`` アクションを追加し、
logout メソッドを実装します。ログアウトのために ``/users/logout`` にアクセスできます。
その時、ログインページへ送られます。

ユーザー登録の有効化
====================

ログインせずに **/users/add** にアクセスしようとすると、ログインページにリダイレクトされます。
人々がアプリケーションにサインアップできるようにしたいので、修正する必要があります。
``UsersController`` に以下を追加してください。 ::

    public function initialize()
    {
        parent::initialize();
        // 許可アクションリストに 'add' アクションを追加
        $this->Auth->allow(['logout', 'add']);
    }

上記の例は、 ``AuthComponent`` に、 ``UsersController`` の ``add()`` アクションが
認証や認可を必要と *しない* ことを伝えています。 **Users/add.ctp** をクリーンアップし、
誤解を招くリンクを削除することに時間をかけたり、次のセクションに進みたいでしょう。
このチュートリアルでは、ユーザーの編集、表示、リスト作成は行いませんが、それはあなた自身で
行うことができる練習です。

記事へのアクセスの制限
======================

ユーザーはログインできるようになったので、作成した記事のみを編集するようにユーザーを
制限したいと考えています。 'authorization' アダプターを使用してこれを行います。
私たちの要件は基本的なものなので、 ``ArticlesController`` にコントローラーフックメソッドを
使うことができます。しかし、これを行う前に、アプリケーションがアクションを許可する方法を
「AuthComponent」に伝えたいと思うでしょう。 ``AppController`` を更新して次を追加してください。 ::

    public function isAuthorized($user)
    {
        // デフォルトでは、アクセスを拒否します。
        return false;
    }

次に、 ``AuthComponent`` にコントローラーのフックメソッドを使用して認可を行いたいことを伝えます。
``AppController::initialize()`` メソッドは次のようになります。 ::

        public function initialize()
        {
            // 既存のコード

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                // この行を追加しました
                'authorize'=> 'Controller',
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // 未認証の場合、直前のページに戻します
                'unauthorizedRedirect' => $this->referer()
            ]);

            // display アクションを許可して、PagesController が引き続き
            // 動作するようにします。また、読み取り専用のアクションを有効にします。
            $this->Auth->allow(['display', 'view', 'index']);
        }

デフォルトではアクセスを拒否し、意味のある場所で段階的にアクセスを許可します。
まず、記事の認可ロジックを追加します。 ``ArticlesController`` に以下を追加してください。 ::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // add および tags アクションは、常にログインしているユーザーに許可されます。
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // 他のすべてのアクションにはスラッグが必要です。
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // 記事が現在のユーザーに属していることを確認します。
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }

あなたに属していない記事を編集または削除しようとすると、元のページにリダイレクトされるはずです。
エラーメッセージが表示されない場合は、レイアウトに以下を追加します。 ::

    // src/Template/Layout/default.ctp の中で
    <?= $this->Flash->render() ?>

次に、 **src/Controller/ArticlesController.php** の ``initialize()`` に以下を追加して、
未認証のユーザーに許可されたアクションに ``tags`` アクションを追加してください。 ::

    $this->Auth->allow(['tags']);

上記は非常に単純ですが、柔軟性のある認証ロジックを構築するために、現在のユーザーと
リクエストデータを組み合わせたより複雑なロジックを構築する方法を示しています。

add と edit アクションの修正
==============================

edit アクションへのアクセスをブロックしていますが、編集中の記事の
``user_id`` 属性を変更することはできます。次に、これらの問題を解決します。
最初は ``add`` アクションです。

記事を作成するときに、 ``user_id`` を現在ログインしているユーザーに修正したいと考えています。
add アクションを次のように置き換えます。 ::

    // src/Controller/ArticlesController.php の中で

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // 変更: セッションから user_id をセット
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }

次は ``edit`` アクションを更新します。edit メソッドを次のように置き換えます。 ::

    // src/Controller/ArticlesController.php の中で

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // 関連づけられた Tags を読み込む
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // 追加: user_id の更新を無効化
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // タグのリストを取得
        $tags = $this->Articles->Tags->find('list');

        // ビューコンテキストに article と tags をセット
        $this->set('tags', $tags);
        $this->set('article', $article);
    }

ここでは、 ``patchEntity()`` のオプションを使って、どのプロパティーを一括代入できるかを変更しています。
詳しい情報は、 :ref:`changing-accessible-fields` セクションをご覧ください。
**src/Templates/Articles/edit.ctp** から必要のなくなった ``user_id`` コントロールを
削除してください。

できあがり
===========

ユーザーがログインしたり、記事を投稿したり、タグ付けしたり、投稿された記事をタグで検索したり、
記事への基本的なアクセス制御を適用したりできるシンプルな CMS アプリケーションを構築しました。
また、FormHelper と ORM の機能を活用して、UX のいくつかの改良点を追加しました。

CakePHP の探検にお時間をいただきありがとうございます。
次は、 :doc:`/orm` についてもっと学んだり、 :doc:`/topics` を調べてみてください。
