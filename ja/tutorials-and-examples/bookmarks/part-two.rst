ブックマークチュートリアル パート2
##################################

:doc:`チュートリアルの前編 </tutorials-and-examples/bookmarks/intro>` を終えると、
ごく基本的なブックマークアプリケーションができているでしょう。このチャプターでは認証機能と
各ユーザーが自分のブックマークだけを閲覧/編集できるように制限する機能を追加します。

ログインを追加
==============

CakePHP では、認証は :doc:`/controllers/components` によって制御されます。
コンポーネントは再利用可能な特定の機能や概念を作成するための方法と考えることができます。
コンポーネントもまた、コントローラーのイベントのライフサイクルをフックすることでアプリケーションに
作用することができます。初めに、 :doc:`AuthComponent
</controllers/components/authentication>` をアプリケーションに追加しましょう。
すべてのメソッドに認証を必須にすることをおすすめします。では AuthComponent を
AppController に追加しましょう。 ::

    // src/Controller/AppController.php の中で
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            $this->loadComponent('Flash');
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
                'unauthorizedRedirect' => $this->referer() // 未認証時、元のページを返します。
            ]);

            // PagesController が動作し続けるように
            // display アクションを許可
            $this->Auth->allow(['display']);
        }
    }



これで、 ``Flash`` と ``Auth`` のコンポーネントを読み込むと CakePHP に示しました。
さらに users テーブルの ``email`` をユーザー名として使用するように AuthComponent の設定を
カスタマイズしました。何かの URL にアクセスすると **/users/login** に遷移するようになりますが、
まだそのコードが存在しないというエラーページが表示されるでしょう。
それでは、ログインアクションを作成しましょう。 ::


    // src/Controller/UsersController.php の中で
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('あなたのユーザー名またはパスワードが不正です。');
        }
    }

さらに **src/Template/Users/login.ctp** に以下のように追記します。 ::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

.. note::

   ``control()`` は 3.4 以降で使用可能です。それより前のバージョンでは、代わりに
   ``input()`` を使用してください。

これでシンプルなログインフォームができました。ハッシュ化されたパスワードを持つユーザーで
ログインすることができるはずです。

.. note::

    もしハッシュ化されたパスワードを持つユーザーがいなければ、 ``loadComponent('Auth')``
    の行をコメントアウトして、ユーザーを編集して新しいパスワードを保存して下さい。

ログアウトを追加
================

これで人々はログインできますので、ログアウトする方法も同じように提供したいでしょう。
ここでも ``UsersController`` に以下のコードを追加します。 ::


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

このコードは、パブリックなアクションでログアウトのメソッドとして ``logout`` アクションを
ホワイトリストに加えます。これで ``/users/logout`` にアクセスするとログアウトされて
ログインページに遷移します。

新規登録を有効にする
====================

ログインしていない状態で **/users/add** にアクセスした場合、ログインページに遷移してしまうでしょう。
人々がアプリケーションにサインアップできるように修正しましょう。 ``UsersController`` に以下を
追記します。 ::

    public function initialize()
    {
        parent::initialize();
        // 許可するアクション一覧に 'add' アクションを追加
        $this->Auth->allow(['logout', 'add']);
    }

上記では ``add()`` アクションは認証や許可が不要であることを ``AuthComponent`` に示しています。
**Users/add.ctp** をクリーンアップする時間を作り、誤解を招くようなリンクを削除しても、
このまま次のセクションに進んでもかまいません。このチュートリアルではユーザーの編集、
表示または一覧は構築しません。 それらのアクションは ``AuthComponent`` が拒否します。

ブックマークへのアクセスを制限する
==================================

ユーザーがログインできるようになったので、ユーザーが自分が作成したブックマークだけを表示できるよう
制限しましょう。これは 'authorization' アダプタを使用して制限します。
要件は非常に単純です。 いくつかの簡単なコードを ``BookmarksController`` に書きます。
しかし、これをやる前にアプリケーションがどのようにアクションを許可するかを AuthComponent
に示しましょう。 ``AppController`` に以下を追加します。 ::

    public function isAuthorized($user)
    {
        return false;
    }

また、 ``AppController`` の ``Auth`` の設定を以下のように追加します。 ::

    'authorize' => 'Controller',

``initialize()`` メソッドはこのようになります。 ::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',//この行を追加
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
                'unauthorizedRedirect' => $this->referer()
            ]);

            // PagesController が動作し続けるように
            // display アクションを許可
            $this->Auth->allow(['display']);
        }

デフォルトではアクセスを拒否し、必要に応じて一つづつアクセス権を付与しましょう。
はじめに、ブックマークに許可ロジックを追加します。
``BookmarksController`` に以下を追加します。 ::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');

        // add と index アクションは常に許可します。
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // その他のすべてのアクションは、id を必要とします。
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // ブックマークが現在のユーザーに属するかどうかをチェック
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }

これで、自分のものではないブックマークを表示または編集、削除しようとすると、
元のページにリダイレクトされるはずです。もし、エラーメッセージが表示されないなら、
レイアウトに以下を追加してください。 ::

    // src/Template/Layout/default.ctp の中で
    <?= $this->Flash->render() ?>

これで許可エラーメッセージが表示されるはずです。

一覧表示とフォームを修正する
============================

詳細と削除が動作する一方で、追加と一覧表示には少し問題があります:

#. ブックマークを追加するときにユーザーを選べる
#. ブックマークを編集するときにユーザーを選べる
#. 一覧ページに他のユーザーのブックマークが表示される

まず追加のフォームから取り組みましょう。はじめに **src/Template/Bookmarks/add.ctp** から
``control('user_id')`` を削除します。 削除したら、 **src/Controller/BookmarksController.php**
の ``add()`` アクションを以下のように修正します。 ::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('ブックマークを保存しました。');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('ブックマークは保存できませんでした。もう一度お試しください。');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

エンティティーのプロパティーにセッションデータを設定することで、ブックマークがほかのユーザーに変更される
可能性を排除しています。編集フォームとアクションも同様にします。
**src/Controller/BookmarksController.php** の ``edit()`` アクションを以下のようにします。 ::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('ブックマークを保存しました。');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('ブックマークは保存できませんでした。もう一度お試しください。');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

一覧表示
--------

さて、現在ログインしているユーザーのブックマークだけを表示する必要があります。
``paginate()`` の呼び出しを修正をすることでそのようにできます。
**src/Controller/BookmarksController.php** の ``index()``
アクションを以下のようにします。 ::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
        $this->set('_serialize', ['bookmarks']);
    }

同様に ``tags()`` アクションと関連する検索メソッドを修正しましょう。
これはあなた自身で完了できるように宿題として残しておきます。

タグ付け機能を改良する
======================

現在は、 ``TagsController`` ではすべてのアクセスが拒否されるため、新しいタグを追加することは困難です。
アクセスを許可する代わりに、カンマ区切りのテキストフィールドを使用してタグ選択 UI を改良できます。
これはユーザーに良い体験を与え、ORM の素晴らしい機能をさらに使うことができます。

計算済みフィールドを追加
------------------------

エンティティーの整形済みのタグを取得する簡単な方法が必要なので、バーチャル/計算済みのフィールドを
エンティティーに追加しましょう。 **src/Model/Entity/Bookmark.php** に以下を追加します。 ::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

計算済みのプロパティー ``$bookmark->tag_string`` にアクセスできるようになります。
このプロパティーはあとで入力時に使用します。 あとで保存するので ``tag_string`` プロパティーを
エンティティーの ``_accessible`` リストに追加することを忘れないでください。

**src/Model/Entity/Bookmark.php** で ``$_accessible`` に ``tag_string`` を
このように追加してください。 ::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];


ビューを修正する
----------------

エンティティーを修正するとタグ用の新しいインプットを追加することができます。
**src/Template/Bookmarks/add.ctp** と **src/Template/Bookmarks/edit.ctp** の
すでにある ``tags._ids`` のインプットを以下と置き換えます。 ::

    echo $this->Form->control('tag_string', ['type' => 'text']);

タグ文字列を保存する
--------------------

これで存在するタグを文字列として表示できます。同様にデータを保存したいでしょう。
``tag_string`` をアクセス可能に設定したので、ORM はリクエストからエンティティーにデータをコピーします。
``beforeSave()`` フックメソッドを使用して、タグ文字列を解析し、関連するエンティティーを検索/構築します。
**src/Model/Table/BookmarksTable.php** に以下を追加します。 ::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // タグに trim 適用
        $newTags = array_map('trim', explode(',', $tagString));
        // すべての空のタグを削除
        $newTags = array_filter($newTags);
        // 重複するタグの削減
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // 新しいタグの一覧から既存のタグを削除
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // 既存のタグの追加
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // 新しいタグの追加
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

このコードはこれまでに行ったことよりも少し複雑ですが、これは CakePHP の ORM がいかに強力かを
お見せするのに役立ちます。 :doc:`/core-libraries/collections` メソッドを使用してクエリー結果を
操作することができます。また、エンティティーをその場で容易に作成するシナリオを扱うことができます。

まとめ
======

認証と基本的な許可/アクセス制御シナリオを処理できるようブックマークアプリケーションを拡張してきました。
また、FormHelper と ORM の機能を活用することで、いくつかの素晴らしい UX の改善を追加しました。

CakePHP を探求する時間を割いていただきありがとうございます。次は
:doc:`/tutorials-and-examples/blog/blog` を完了するか、
:doc:`/orm` について更に学ぶか、もしくは :doc:`/topics` を熟読してください。
