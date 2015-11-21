.. Bookmarker Tutorial Part 2
.. ##########################

ブックマークチュートリアル パート2
##################################

.. After finishing :doc:`the first part of this tutorial
.. </tutorials-and-examples/bookmarks/intro>` you should have a very basic
.. bookmarking application. In this chapter we'll be adding authentication and
.. restricting the bookmarks each user can see/modify to only the ones they own.

:doc:`チュートリアルの前編</tutorials-and-examples/bookmarks/intro>` を終えると、ごく基本的なブックマークアプリケーションができているでしょう。
このチャプターでは認証機能と各ユーザーが自分のブックマークだけを閲覧/編集できるように制限する機能を追加します。

.. Adding Login
.. ============

ログインを追加
==============

.. In CakePHP, authentication is handled by :doc:`/controllers/components`.
.. Components can be thought of as ways to create reusable chunks of controller
.. code related to a specific feature or concept. Components can also hook into the
.. controller's event life-cycle and interact with your application that way. To
.. get started, we'll add the :doc:`AuthComponent
.. </controllers/components/authentication>` to our application. We'll pretty much
.. want every method to require authentication, so we'll add AuthComponent in our
.. AppController::

CakePHPでは、認証は :doc:`/controllers/components` によって制御されます。
コンポーネントは再利用可能な特定の機能や概念を作成するための方法と考えることができます。
コンポーネントもまた、コントローラのイベントのライフサイクルをフックすることでアプリケーションに作用することができます。
初めに、 :doc:`AuthComponent</controllers/components/authentication>` をアプリケーションに追加しましょう。
すべてのメソッドに認証を必須にすることをおすすめします。
ではAuthComponentをAppControllerに追加しましょう::

    // In src/Controller/AppController.php
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
                ]
            ]);

            // Allow the display action so our pages controller
            // continues to work.
            $this->Auth->allow(['display']);
        }
    }



これで、 ``Flash`` と ``Auth`` のコンポーネントを読み込むとCakePHPに示しました。
さらにusersテーブルの ``email`` をユーザー名として使用するようにAuthComponentの設定をカスタマイズしました。
何かのURLにアクセスすると **/users/login** に遷移するようになりますが、まだそのコードが存在しないというエラーページが表示されるでしょう。
それでは、ログインアクションを作成しましょう::

    // In src/Controller/UsersController.php

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Your username or password is incorrect.');
        }
    }


.. And in **src/Template/Users/login.ctp** add the following::

さらに **src/Template/Users/login.ctp** に以下のように追記します::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->input('email') ?>
    <?= $this->Form->input('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

.. Now that we have a simple login form, we should be able to log in with one of
.. the users that has a hashed password.

これでシンプルなログインフォームができました。ハッシュ化されたパスワードを持つユーザーでログインすることができるはずです。


..    If none of your users have hashed passwords, comment the
..    ``loadComponent('Auth')`` line. Then go and edit the user,
..    saving a new password for them.

.. note::

		もしハッシュ化されたパスワードを持つユーザーがいなければ、 ``loadComponent('Auth')`` の行をコメントアウトして、ユーザーを編集して新しいパスワードを保存して下さい。

.. You should now be able to log in. If not, make sure you are using a user that
.. has a hashed password.

これでログインできるようになっているはずです。もしできない場合、ユーザーのパスワードがハッシュ化されていることを確認してください。

.. Adding Logout
.. =============

ログアウトを追加
================

.. Now that people can log in, you'll probably want to provide a way to log out as
.. well. Again, in the ``UsersController``, add the following code::
これで人々はログインできますので、ログアウトする方法も同じように提供したいでしょう。ここでも ``UsersController`` に以下のコードを追加します::

    public function logout()
    {
        $this->Flash->success('You are now logged out.');
        return $this->redirect($this->Auth->logout());
    }

.. Now you can visit ``/users/logout`` to log out and be sent to the login page.
これで ``/users/logout`` にアクセスするとログアウトされてログインページに遷移します。

.. Enabling Registrations
.. ======================

新規登録を有効にする
====================

.. If you aren't logged in and you try to visit **/users/add** you will be kicked
.. to the login page. We should fix that as we want to allow people to sign up for
.. our application. In the ``UsersController`` add the following::
ログインしていない状態で **/users/add** にアクセスした場合、ログインページに遷移してしまうでしょう。
人々がアプリケーションにサインアップできるように修正しましょう。 ``UsersController`` に以下を追記します::

    public function beforeFilter(\Cake\Event\Event $event)
    {
        $this->Auth->allow(['add']);
    }

.. The above tells ``AuthComponent`` that the ``add()`` action does *not* require
.. authentication or authorization. You may want to take the time to clean up the
.. **Users/add.ctp** and remove the misleading links, or continue on to the next
.. section. We won't be building out user editing, viewing or listing in this
.. tutorial so they will not work as ``AuthComponent`` will deny you access to those
.. controller actions.
上記では ``add()`` アクションは認証や許可が不要であることを ``AuthComponent`` に示しています。
**Users/add.ctp** をクリーンアップする時間を作り、誤解を招くようなリンクを削除しても、このまま次のセクションに進んでもかまいません。
このチュートリアルではユーザーの編集、表示または一覧は構築しません。 それらのアクションは ``AuthComponent`` が拒否します。


.. Restricting Bookmark Access
.. ===========================

ブックマークへのアクセスを制限する
==================================

.. Now that users can log in, we'll want to limit the bookmarks they can see to the
.. ones they made. We'll do this using an 'authorization' adapter. Since our
.. requirements are pretty simple, we can write some simple code in our
.. ``BookmarksController``. But before we do that, we'll want to tell the
.. AuthComponent how our application is going to authorize actions. In your
.. ``AppController`` add the following::

ユーザーがログインできるようになったので、ユーザーが自分が作成したブックマークだけを表示できるよう制限しましょう。
これは 'authorization' アダプタを使用して制限します。
要件は非常に単純です。 いくつかの簡単なコードを ``BookmarksController`` に書きます。
しかし、これをやる前にアプリケーションがどのようにアクションを許可するかをAuthComponentに示しましょう。
``AppController`` に以下を追加します::

    public function isAuthorized($user)
    {
        return false;
    }

.. Also, add the following to the configuration for ``Auth`` in your
.. ``AppController``::

また、 ``AppController`` の ``Auth`` の設定を以下のように追加します::

    'authorize' => 'Controller',

.. Your ``initialize()`` method should now look like::

``initialize()`` メソッドはこのようになります::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',//added this line
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

            // Allow the display action so our pages controller
            // continues to work.
            $this->Auth->allow(['display']);
        }

.. We'll default to denying access, and incrementally grant access where it makes
.. sense. First, we'll add the authorization logic for bookmarks. In your
.. ``BookmarksController`` add the following::


デフォルトではアクセスを拒否し、必要に応じて一つづつアクセス権を付与しましょう。
はじめに、ブックマークに許可ロジックを追加します。
``BookmarksController`` に以下を追加します::

    public function isAuthorized($user)
    {
        $action = $this->request->params['action'];

        // The add and index actions are always allowed.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // All other actions require an id.
        if (empty($this->request->params['pass'][0])) {
            return false;
        }

        // Check that the bookmark belongs to the current user.
        $id = $this->request->params['pass'][0];
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }


.. Now if you try to view, edit or delete a bookmark that does not belong to you,
.. you should be redirected back to the page you came from. However, there is no
.. error message being displayed, so let's rectify that next::
これで、自分のものではないブックマークを表示または編集、削除しようとすると、元のページにリダイレクトされるはずです。ただし、何のエラーメッセージはされないでしょう。それでは次のように修正しましょう::

    // In src/Template/Layout/default.ctp
    // Under the existing flash message.
    <?= $this->Flash->render('auth') ?>

.. You should now see the authorization error messages.

これで許可エラーメッセージが表示されるはずです。

.. Fixing List view and Forms
.. ==========================

一覧表示とフォームを修正する
============================

.. While view and delete are working, edit, add and index have a few problems:

.. #. When adding a bookmark you can choose the user.
.. #. When editing a bookmark you can choose the user.
.. #. The list page shows bookmarks from other users.

詳細と削除が動作する一方で、追加と一覧表示には少し問題があります:

#. ブックマークを追加するときにユーザーを選べる
#. ブックマークを編集するときにユーザーを選べる
#. 一覧ページに他のユーザーのブックマークが表示される

.. Let's tackle the add form first. To begin with remove the ``input('user_id')``
.. from **src/Template/Bookmarks/add.ctp**. With that removed, we'll also update
.. the ``add()`` action from **src/Controller/BookmarksController.php** to look
.. like::

まず追加のフォームから取り組みましょう。はじめに **src/Template/Bookmarks/add.ctp** から ``input('user_id')`` を削除します。 削除したら、 **src/Controller/BookmarksController.php** の ``add()`` アクションを以下のように修正します::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->data);
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('The bookmark has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The bookmark could not be saved. Please, try again.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

.. By setting the entity property with the session data, we remove any possibility
.. of the user modifying which user a bookmark is for. We'll do the same for the
.. edit form and action. Your ``edit()`` action from
.. **src/Controller/BookmarksController.php** should look like::

エンティティのプロパティにセッションデータを設定することで、ブックマークがほかのユーザーに変更される可能性を排除しています。
編集フォームとアクションも同様にします。 **src/Controller/BookmarksController.php** の ``edit()`` アクションを以下のようにします::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->data);
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('The bookmark has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The bookmark could not be saved. Please, try again.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

.. List View
.. ---------

一覧表示
--------

.. Now, we only need to show bookmarks for the currently logged in user. We can do
.. that by updating the call to ``paginate()``. Make your ``index()`` action from
.. **src/Controller/BookmarksController.php** look like::

さて、現在ログインしているユーザーのブックマークだけを表示する必要があります。
``paginate()`` の呼び出しを修正をすることでそのようにできます。
**src/Controller/BookmarksController.php** の ``index()`` アクションを以下のようにします::

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

.. We should also update the ``tags()`` action and the related finder method, but
.. we'll leave that as an exercise you can complete on your own.

同様に ``tags()`` アクションと関連する検索メソッドを修正しましょう。
これはあなた自身で完了できるように宿題として残しておきます。

.. Improving the Tagging Experience
.. ================================

タグ付け機能を改良する
======================

.. Right now, adding new tags is a difficult process, as the ``TagsController``
.. disallows all access. Instead of allowing access, we can improve the tag
.. selection UI by using a comma separated text field. This will let us give
.. a better experience to our users, and use some more great features in the ORM.

現在は、``TagsController`` ではすべてのアクセスが拒否されるため、新しいタグを追加することは困難です。
アクセスを許可する代わりに、カンマ区切りのテキストフィールドを使用してタグ選択UIを改良できます。
これはユーザーに良い体験を与え、ORMの素晴らしい機能をさらに使うことができます。

.. Adding a Computed Field
.. -----------------------

計算済みフィールドを追加
------------------------

.. Because we'll want a simple way to access the formatted tags for an entity, we
.. can add a virtual/computed field to the entity. In
.. **src/Model/Entity/Bookmark.php** add the following::

エンティティの整形済みのタグを取得するする簡単な方法が必要なので、バーチャル/計算済みのフィールドをエンティティに追加しましょう。
**src/Model/Entity/Bookmark.php** に以下を追加します::

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

.. This will let us access the ``$bookmark->tag_string`` computed property. We'll
.. use this property in inputs later on. Remember to add the ``tag_string``
.. property to the ``_accessible`` list in your entity, as we'll want to 'save' it
.. later on.

.. In **src/Model/Entity/Bookmark.php** add the ``tag_string`` to ``$_accessible``
.. this way::

計算済みのプロパティ ``$bookmark->tag_string`` にアクセスできるようになります。
このプロパティはあとで入力時に使用します。 あとで保存するので ``tag_string`` プロパティ をエンティティの ``_accessible`` リストに追加することを忘れないでください。

**src/Model/Entity/Bookmark.php** で ``$_accessible`` に ``tag_string`` をこのように追加してください::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];


.. Updating the Views
.. ------------------

ビューを修正する
----------------

.. With the entity updated we can add a new input for our tags. In
.. **src/Template/Bookmarks/add.ctp** and **src/Template/Bookmarks/edit.ctp**,
.. replace the existing ``tags._ids`` input with the following::

エンティティを修正するとタグ用の新しいインプットを追加することができます。
**src/Template/Bookmarks/add.ctp** と **src/Template/Bookmarks/edit.ctp** の すでにある ``tags._ids`` のインプットを以下と置き換えます::

    echo $this->Form->input('tag_string', ['type' => 'text']);

.. Persisting the Tag String
.. -------------------------

タグ文字列を保存する
--------------------

.. Now that we can view existing tags as a string, we'll want to save that data as
.. well. Because we marked the ``tag_string`` as accessible, the ORM will copy that
.. data from the request into our entity. We can use a ``beforeSave()`` hook method
.. to parse the tag string and find/build the related entities. Add the following
.. to **src/Model/Table/BookmarksTable.php**::

これで存在するタグを文字列として表示できます。同様にデータを保存したいでしょう。
``tag_string`` をアクセス可能に設定したので、ORMはリクエストからエンティティにデータをコピーします。
``beforeSave()`` フックメソッドを使用して、タグ文字列を解析し、関連するエンティティを検索/構築します。
**src/Model/Table/BookmarksTable.php** に以下を追加します::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        $new = array_unique(array_map('trim', explode(',', $tagString)));
        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $new]);

        // Remove existing tags from the list of new tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $new);
            if ($index !== false) {
                unset($new[$index]);
            }
        }
        // Add existing tags.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Add new tags.
        foreach ($new as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

.. While this code is a bit more complicated than what we've done so far, it helps
.. to showcase how powerful the ORM in CakePHP is. You can manipulate query
.. results using the :doc:`/core-libraries/collections` methods, and handle
.. scenarios where you are creating entities on the fly with ease.

このコードはこれまでに行ったことよりも少し複雑ですが、これはCakePHPのORMがいかに強力かをお見せするのに役立ちます。
:doc:`/core-libraries/collections` メソッドを使用してクエリ結果を操作することができます。また、エンティティをその場で容易に作成するシナリオを扱うことができます。

.. Wrapping Up
.. ===========

まとめ
======

.. We've expanded our bookmarking application to handle authentication and basic
.. authorization/access control scenarios. We've also added some nice UX
.. improvements by leveraging the FormHelper and ORM capabilities.

認証と基本的な許可/アクセス制御シナリオを処理できるようブックマークアプリケーションを拡張してきました。
また、FormHelperとORMの機能を活用することで、いくつかの素晴らしいUXの改善を追加しました。

.. Thanks for taking the time to explore CakePHP. Next, you can complete the
.. :doc:`/tutorials-and-examples/blog/blog`, learn more about the
.. :doc:`/orm`, or you can peruse the :doc:`/topics`.

CakePHPを探求する時間を割いていただきありがとうございます。
次は :doc:`/tutorials-and-examples/blog/blog` を完了するか、 :doc:`/orm` について更に学ぶか、もしくは :doc:`/topics` を熟読してください。