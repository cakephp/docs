ブログチュートリアル - レイヤーの追加
*************************************

Postモデルの作成
================

モデルクラスは、CakePHPアプリケーションの基本中の基本(*bread and butter*)です。
CakePHPのモデルを作成することで、データベースとやりとりできるようになり、表示(*view*)、追加(*add*)、編集(*edit*)、削除(*delete*)といった操作に必要な土台を手に入れることになります。

CakePHPのモデルクラスのファイルは、 ``/app/Model`` の中にあり、今回は、 ``/app/Model/Post.php`` というファイルを作って保存します。
ファイルの中身全体は次のようになります::

    class Post extends AppModel {
    }

命名規約は、CakePHPでは非常に大切です。
モデルをPostという名前にすることで、CakePHPは自動的に、このモデルはPostsControllerで使用されるのだろう、と考えます。
また、 ``posts`` という名前のデータベーステーブルと結びつけられます。

.. note::

    もし一致するファイルが/app/Modelに見つけられなければ、CakePHPは動的にモデルオブジェクトを生成します。
    これはまた、不意に間違ったファイル名(例えば、post.phpやposts.php)をつけると、CakePHPはどんな設定も認識できず、代わりにデフォルトのものを使うことになるということも意味します。

テーブルの接頭辞(*prefix*)や、コールバック、バリデーションといったモデルの詳細については、マニュアルの :doc:`/models` の章を参照してください。


Postsコントローラの作成
=======================

次に、投稿記事(*posts*)に対するコントローラを作成します。
コントローラとは、投稿記事とやりとりするためのビジネスロジックが入るところです。
簡単に言うと、それは幾つかのモデルとやりとりし、投稿記事に関連する作業を行う場所です。
この新しいコントローラは、 ``PostsController.php`` という名前で、 ``/app/Controller`` ディレクトリの中に配置します。
基本的なコントローラは次のようになります::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
    }

では、コントローラにひとつのアクションを追加してみましょう。
アクションは、アプリケーションの中のひとつの関数か、インターフェイスをあらわしています。
例えば、ユーザが
www.example.com/posts/index(www.example.com/posts/と同じです)
をリクエストした場合、投稿記事の一覧が表示されると期待するでしょう。
このアクションのコードは次のようになります::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

このアクションについて少し説明しましょう。
PostsControllerの中にindex()という関数を定義することによって、ユーザは、www.example.com/posts/indexというリクエストで、そのロジックにアクセスできるようになります。
同様に、 ``foobar()`` という関数を定義すると、ユーザは、www.example.com/posts/foobarでアクセスできるようになります。

.. warning::

    あるURLにさせたいために、コントローラ名とアクション名をそれに合わせて独自に命名したくなるかもしれませんが、その誘惑に抵抗してください。
    CakePHPの規約（コントローラは複数形、など）に従って、読みやすく、理解しやすいアクション名を付けるようにしましょう。
    あとで、「routes」という機能を使って、URLとコードを結びつけることができます。

アクションの中にあるひとつの指令が、 ``set()`` を使って、コントローラからビュー(次に作成します)にデータを渡しています。
この行は、Postモデルの ``find('all')`` メソッドから返ってきた値で、「posts」というビューの変数を設定します。
Postモデルは自動的に ``$this->Post`` として呼び出せるようになります。
これは、Cakeの命名規約に従っているからです。

Cakeのコントローラに関する詳細は、 :doc:`/controllers` の章をチェックしてください。

Postビューの作成
================

現在、モデルにはデータが入り、コントローラにはアプリケーションロジックと流れが定義されています。
今度は、作成したindexアクション用のビューを作成しましょう。

Cakeのビュー(*view*)は、アプリケーションのレイアウト(*layout*)の内側にはめこまれる、データ表示用の断片部品です。
たいていのアプリケーションでは、PHPのコードが含まれるHTMLになりますが、XML、CSV、バイナリのデータにもなりえます。

レイアウト(*Layout*)は、ビューを囲む表示用のコードで、独自に定義したり、切り替えたりすることも可能ですが、今のところは、デフォルト(*default*)のものを使用することにしましょう。

一つ前のセクションの ``set()`` メソッドによって、ビューから「posts」変数が使えるように割り当てたのを覚えていますか。
ビューに渡されたデータは次のようなものになっています::

    // print_r($posts) の出力:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => タイトル
                        [body] => これは、記事の本文です。
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => またタイトル
                        [body] => そこに本文が続きます。
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => タイトルの逆襲
                        [body] => こりゃ本当にわくわくする！うそ。
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Cakeのビューファイルは、 ``/app/View`` の中の、コントローラ名に対応するフォルダの中に保存されています(この場合は、「Posts」というフォルダを作成します)。
この投稿記事データをテーブル表示するには、ビューのコードは次のようなものにできます

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- ここから、$posts配列をループして、投稿記事の情報を表示 -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'],
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
        <?php unset($post); ?>
    </table>

シンプルですよね。

``$this->Html`` というオブジェクトを使っていることに気づいたかもしれません。
これは、CakePHPの :php:class:`HtmlHelper` クラスのインスタンスです。
CakePHPには一連のビューヘルパーがあり、リンクの作成、フォームの出力、JavaScript、Ajaxなどをすぐに使えます。
使い方の詳細については、 :doc:`/views/helpers` を参照してください。
ここで重要なのは、 ``link()`` メソッドが、指定されたタイトル（最初のパラメータ）とURL(二つ目のパラメータ)でHTMLリンクを生成する、ということです。

Cake内でURLを指定する場合、配列フォーマットの使用が推奨されます。
これはルーティングの章で詳しく説明されます。
URLに配列フォーマットを用いることによって、CakePHPのリバースルーティング機能を活用することができます。
また、/コントロ>ーラ/アクション/パラメータ1/パラメータ2という形のアプリケーションの基本パスに対する相対パスを単に書くこともできます。

この時点で、ブラウザから
http://www.example.com/posts/index
を開いてみてください。
タイトルと投稿内容のテーブル一覧がまとめられているビューが表示されるはずです。

ビューの中のリンク(投稿記事のタイトルから/posts/view/some\_idというURLへのリンク)をクリックすると、CakePHPは、そのアクションはまだ定義されていません、という表示を出します。
もしそういう表示が出ない場合には、何かおかしくなってしまったか、もうすでにあなたがその定義作業をしてしまったから（仕事がハヤイ！）か、のどちらかです。
そうでないなら、これからPostsControllerの中に作ってみましょう::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }
    }

``set()`` の呼び出しはもう知っていますね。
``find('all')`` の代わりに、 ``findById()`` を使っていることに注目してください。
今回は、ひとつの投稿記事の情報しか必要としないからです。

ビューのアクションが、ひとつのパラメータを取っていることに注意してください。
それは、これから表示する投稿記事のID番号です。
このパラメータは、リクエストされたURLを通して渡されます。
ユーザが、 ``/posts/view/3`` とリクエストすると、「3」という値が ``$id`` として渡されます。

ユーザーが実在するレコードにアクセスすることを保証するために少しだけエラーチェックを行います。
もしユーザが ``/posts/view`` とリクエストしたら、 ``NotFoundException`` を送出し
CakePHPのErrorHandlerに処理が引き継がれます。
また、ユーザーが存在するレコードにアクセスしたことを確認するために同様のチェックを実行します。

では、新しい「view」アクション用のビューを作って、
``/app/View/Posts/view.ctp``
というファイルで保存しましょう。

.. code-block:: php

    <!-- File: /app/View/Posts/view.ctp -->

    <h1><?php echo h($post['Post']['title']); ?></h1>

    <p><small>Created: <?php echo $post['Post']['created']; ?></small></p>

    <p><?php echo h($post['Post']['body']); ?></p>

``/posts/index`` の中にあるリンクをクリックしたり、手動で、 ``/posts/view/1`` にアクセスしたりして、動作することを確認してください。

記事の追加
==========

データベースを読み、記事を表示できるようになりました。
今度は、新しい投稿ができるようにしてみましょう。

まず、PostsControllerの中に、 ``add()`` アクションを作ります::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Session');
        public $components = array('Session');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                } else {
                    $this->Session->setFlash('Unable to add your post.');
                }
            }
        }
    }

.. note::

    SessionComponentとSessionHelperを、使うコントローラで読み込む必要があります。
    必要不可欠なら、AppControllerで読み込むようにしてください。

``add()`` アクションの動作は次のとおりです:
もし、リクエストのHTTPメソッドがPOSTなら、Postモデルを使ってデータの保存を試みます。
何らかの理由で保存できなかった場合には、単にビューを表示します。
この時に、ユーザバリデーションエラーやその他の警告が表示されることになります。

すべてのCakePHPのリクエストは ``CakeRequest`` オブジェクトに格納されており、\
``$this->request`` でアクセスできます。リクエストオブジェクトには、\
受信したリクエストに関するいろんな情報が含まれているので、アプリケーションのフローの制御に利用できます。\
今回は、リクエストがHTTP POSTかどうかの確認に :php:meth:`CakeRequest::is()` メソッドを使用しています。

ユーザがフォームを使ってデータをPOSTした場合、その情報は、 ``$this->request->data`` の中に入ってきます。
:php:func:`pr()` や :php:func:`debug()` を使うと、内容を画面に表示させて、確認することができます。

SessionComponentの :php:meth:`SessionComponent::setFlash()` メソッドを使ってセッション変数にメッセージをセットすることによって、リダイレクト後のページでこれを表示します。
レイアウトでは :php:func:`SessionHelper::flash` を用いて、メッセージを表示し、対応するセッション変数を削除します。
コントローラの :php:meth:`Controller::redirect` 関数は別のURLにリダイレクトを行います。
``array('action' => 'index')`` パラメータは/posts、つまりpostsコントローラのindexアクションを表すURLに解釈されます。
多くのCakeの関数で指定できるURLのフォーマットについては、 `API <http://api20.cakephp.org>`_ の :php:func:`Router::url()` 関数を参考にすることができます。

``save()`` メソッドを呼ぶと、バリデーションエラーがチェックされ、もしエラーがある場合には保存動作を中止します。
これらのエラーがどのように扱われるのかは次のセクションで見てみましょう。

データのバリデーション
======================

Cakeはフォームの入力バリデーションの退屈さを取り除くのに大いに役立ちます。
みんな、延々と続くフォームとそのバリデーションルーチンのコーディングは好まないでしょう。
CakePHPを使うと、その作業を簡単、高速に片付けることができます。

バリデーションの機能を活用するためには、ビューの中でCakeのFormHelperを使う必要があります。
:php:class:`FormHelper` はデフォルトで、すべてのビューの中で ``$this->Form`` としてアクセスできるようになっています。

addのビューは次のようなものになります:

.. code-block:: php

    <!-- File: /app/View/Posts/add.ctp -->

    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>

ここで、FormHelperを使って、HTMLフォームの開始タグを生成しています。
``$this->Form->create()`` が生成したHTMLは次のようになります:

.. code-block:: html

    <form id="PostAddForm" method="post" action="/posts/add">

``create()`` にパラメータを渡さないで呼ぶと、現在のコントローラのadd()アクション(または ``id`` がフォームデータに含まれる場合 ``edit()`` アクション)に、POSTで送るフォームを構築している、と解釈されます。

``$this->Form->input()`` メソッドは、同名のフォーム要素を作成するのに使われています。
最初のパラメータは、どのフィールドに対応しているのかをCakePHPに教えます。
２番目のパラメータは、様々なオプションの配列を指定することができます。
- この例では、textareaの列の数を指定しています。
ここには少しばかりの内観的な手法とオートマジックが使われています。
``input()`` は、指定されたモデルのフィールドに基づいて、異なるフォーム要素を出力します。

``$this->Form->end()`` の呼び出しで、submitボタンとフォームの終了部分が出力されます。
``end()`` の最初のパラメータとして文字列が指定してある場合、FormHelperは、それに合わせてsubmitボタンに名前をつけ、終了フォームタグも出力します。
ヘルパーの詳細に関しては、 :doc:`/views/helpers` を参照してください。

さて少し戻って、
``/app/View/Posts/index.ctp``
のビューで「Add Post」というリンクを新しく表示するように編集しましょう。
``<table>`` の前に、以下の行を追加してください::

    <?php echo $this->Html->link(
        'Add Post',
        array('controller' => 'posts', 'action' => 'add')
    ); ?>

バリデーション要件について、どうやってCakePHPに指示するのだろう、と思ったかもしれません。
バリデーションのルールは、モデルの中で定義することができます。
Postモデルを見直して、幾つか修正してみましょう::

    class Post extends AppModel {
        public $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }

``$validate`` 配列を使って、 ``save()`` メソッドが呼ばれた時に、どうやってバリデートするかをCakePHPに教えます。
ここでは、本文とタイトルのフィールドが、空ではいけない、ということを設定しています。
CakePHPのバリデーションエンジンは強力で、組み込みのルールがいろいろあります
(クレジットカード番号、Emailアドレス、などなど）。
また柔軟に、独自ルールを作って設定することもできます。
この設定に関する詳細は、 :doc:`/models/data-validation` を参照してください。

バリデーションルールを書き込んだので、アプリケーションを動作させて、タイトルと本文を空にしたまま、記事を投稿してみてください。
:php:meth:`FormHelper::input()` メソッドを使ってフォーム要素を作成したので、バリデーションエラーのメッセージが自動的に表示されます。

投稿記事の編集
==============

それではさっそく投稿記事の編集ができるように作業をしましょう。
もうCakePHPプロのあなたは、パターンを見つけ出したでしょうか。
アクションをつくり、それからビューを作る、というパターンです。
PostsControllerの ``edit()`` アクションはこんな形になります::

    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }

        if ($this->request->is('post') || $this->request->is('put')) {
            $this->Post->id = $id;
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash('Unable to update your post.');
            }
        }

        if (!$this->request->data) {
            $this->request->data = $post;
        }
    }

このアクションではまず、ユーザが実在するレコードにアクセスしようとしていることを確認します。
もし ``$id`` パラメータが渡されてないか、ポストが存在しない場合、
``NotFoundException`` を送出してCakePHPのErrorHandlerに処理を委ねます。

次に、リクエストがPOSTであるかをチェックします。
もしリクエストがPOSTなら、POSTデータでレコードを更新したり、バリデーションエラーを表示したりします。

もし ``$this->request->data`` が空っぽだったら、取得していたポストレコードをそのままセットしておきます。

editビューは以下のようになるでしょう:

.. code-block:: php

    <!-- File: /app/View/Posts/edit.ctp -->

    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post');
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden'));
        echo $this->Form->end('Save Post');

（値が入力されている場合、）このビューは、編集フォームを出力します。
必要であれば、バリデーションのエラーメッセージも表示します。

ひとつ注意： CakePHPは、「id」フィールドがデータ配列の中に存在している場合は、モデルを編集しているのだと判断します。
もし、「id」がなければ、(addのビューを復習してください) ``save()`` が呼び出された時、Cakeは新しいモデルの挿入だと判断します。

これで、特定の記事をアップデートするためのリンクをindexビューに付けることができます:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp  (編集リンクを追加済み) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- $post配列をループして、投稿記事の情報を表示 -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id'])); ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

投稿記事の削除
==============

次に、ユーザが投稿記事を削除できるようにする機能を作りましょう。
PostsControllerの ``delete()`` アクションを作るところから始めます::

    public function delete($id) {
        if ($this->request->is('get')) {
            throw new MethodNotAllowedException();
        }

        if ($this->Post->delete($id)) {
            $this->Session->setFlash('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

このロジックは、$idで指定された記事を削除し、
``$this->Session->setFlash()``
を使って、ユーザに確認メッセージを表示し、それから ``/posts`` にリダイレクトします。
ユーザーがGETリクエストを用いて削除を試みようとすると、例外を投げます。
捕捉されない例外はCakePHPの例外ハンドラーによって捕まえられ、気の利いたエラーページが表示されます。
多くの組み込み :doc:`/development/exceptions` があり、アプリケーションが生成することを必要とするであろう様々なHTTPエラーを指し示すのに使われます。

ロジックを実行してリダイレクトするので、このアクションにはビューがありません。
しかし、indexビューにリンクを付けて、投稿を削除するようにできるでしょう:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- ここで$posts配列をループして、投稿情報を表示 -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
            </td>
            <td>
                <?php echo $this->Form->postLink(
                    'Delete',
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Are you sure?'));
                ?>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id'])); ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

:php:meth:`~FormHelper::postLink()` を使うと、投稿記事の削除を行うPOSTリクエストをするためのJavascriptを使うリンクが生成されます。
WEBクローラーが不意にコンテンツ全てを削除できてしまうように、GETリクエストを用いたコンテンツの削除を許可することは危険です。

.. note::

    このビューコードはFormHelperを使い、削除する前に、JavaScriptによる確認ダイアログでユーザに確認します。

ルーティング(*Routes*)
======================

CakePHPのデフォルトのルーティングの動作で十分だという人もいます。
しかし、ユーザフレンドリで一般の検索エンジンに対応できるような操作に関心のある開発者であれば、CakePHPの中で、URLがどのように特定の関数の呼び出しにマップされるのかを理解したいと思うはずです。
このチュートリアルでは、routesを簡単に変える方法について扱います。

ルーティングテクニックの応用に関する情報は、 :ref:`routes-configuration` を見てください。

今のところ、ユーザがサイト(たとえば、http://www.example.com )を見に来ると、
CakeはPagesControllerに接続し、「home」というビューを表示するようになっています。
ではこれを、ルーティングルールを作成してPostsControllerに行くようにしてみましょう。

Cakeのルーティングは、 ``/app/Config/routes.php`` の中にあります。
デフォルトのトップページのルートをコメントアウトするか、削除します。
この行です::

    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));

この行は、「/」というURLをデフォルトのCakePHPのホームページに接続します。
これを、自分のコントローラに接続させるために、次のような行を追加してください::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

これで、「/」でリクエストしてきたユーザを、PostControllerのindex()アクションに接続させることができます。

.. note::

    CakePHPは「リバースルーティング」も利用します -
    上記のルートが定義されている状態で、配列を期待する関数に
    ``array('controller' => 'posts', 'action' => 'index')``
    を渡すと、結果のURLは「/」になります。
    つまり、URLの指定に常に配列を使うということが良策となります。
    これによりルートがURLの行き先を定義する意味を持ち、
    リンクが確実に同じ場所を指し示すようになります。

まとめ
======

この方法に乗っ取ったアプリケーションの作成により、平和、賞賛、女性、お金までもが、あなたが考えうる以上にもたらされるでしょう。
シンプルですよね。
ですが、気をつけてほしいのは、このチュートリアルは、非常に基本的な点しか扱っていない、ということです。
CakePHPには、もっともっと *多くの* 機能があります。
シンプルなチュートリアルにするために、それらはここでは扱いませんでした。
マニュアルの残りの部分をガイドとして使い、もっと機能豊かなアプリケーションを作成してください。

基本的なアプリケーションの作成が終わったので、現実世界のアプリを作る準備が整いました。
自分のプロジェクトを始めて、 :doc:`Cookbook </index>` の残りと `API <http://api20.cakephp.org>`_ を使いましょう。

助けが必要なら、#cakephpに来てください（ただし英語。日本語なら、cakephp.jpへどうぞ）。
CakePHPにようこそ！

お勧めの参考文献
----------------

CakePHPを学習する人が次に学びたいと思う共通のタスクがいくつかあります:

1. :ref:`view-layouts`: WEBサイトのレイアウトをカスタマイズする
2. :ref:`view-elements` ビューのスニペットを読み込んで再利用する
3. :doc:`/controllers/scaffolding`: コードを作成する前のプロトタイピング
4. :doc:`/console-and-shells/code-generation-with-bake` 基本的なCRUDコードの生成
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`: ユーザの認証と承認のチュートリアル
