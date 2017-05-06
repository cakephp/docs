ブログチュートリアル - パート2
##############################

Article モデルの作成
====================

モデルクラスは、CakePHP アプリケーションの基本中の基本 (*bread and butter*) です。
CakePHP のモデルを作成することで、データベースとやりとりできるようになり、表示 (*view*)、
追加 (*add*)、編集 (*edit*)、削除 (*delete*) といった操作に必要な土台を
手に入れることになります。

CakePHP のモデルクラスのファイルは、 ``Table`` オブジェクトと ``Entity`` オブジェクトに分離して
存在します。 ``Table`` オブジェクトは、特定のテーブルに格納されているエンティティの集合にアクセスし、
``src/Model/Table`` の中に行きます。 ``src/Model/Table/ArticlesTable.php`` というファイルを
作って保存します。ファイルの中身全体は次のようになります。 ::

    // src/Model/Table/ArticlesTable.php
    
    namespace App\Model\Table;
    
    use Cake\ORM\Table;
    
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

命名規約は、CakePHP では非常に大切です。Table オブジェクトを ``ArticlesTable`` という名前にすることで、
CakePHP は自動的に、このTableオブジェクトは ArticlesController で使用されるのだろうと考えます。
また、 ``articles`` という名前のデータベーステーブルと結びつけられます。

.. note::

    もし一致するファイルが **src/Model/Table** に見つけられなければ、CakePHP は動的に
    モデルオブジェクトを生成します。これはまた、不意に間違ったファイル名 (例えば、
    articlestable.php や ArticleTable.php) をつけると、CakePHP はどんな設定も認識できず、
    代わりにデフォルトのものを使うことになるということも意味します。

コールバック、バリデーションといったモデルの詳細については、
マニュアルの :doc:`/orm` の章を参照してください。

.. note::

    もし、すでに :doc:`ブログチュートリアルのパート1 </tutorials-and-examples/blog/blog>`
    を完了していて ``articles`` テーブルをブログ用のデータベースに作成してあれば、
    CakePHP の bake コンソールを活用して ``ArticlesTable`` モデルを作成することができます。 ::

            bin/cake bake model Articles

bake とコード生成についての詳細は、 :doc:`/bake/usage` を参照してください。

Articles コントローラの作成
===========================

次に、投稿記事 (*articles*) に対するコントローラを作成します。コントローラとは、
投稿記事とのすべてのやりとりが発生するところです。
簡単に言うと、それはモデルとのビジネスロジックを含み、投稿記事に関連する作業を行う場所です。
この新しいコントローラは ``ArticlesController.php`` という名前で、
``src/Controller`` ディレクトリの中に配置します。基本的なコントローラは次のようになります。 ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

では、コントローラにひとつのアクションを追加してみましょう。アクションは、
アプリケーションの中のひとつの関数か、インターフェイスをあらわしています。
例えば、ユーザが www.example.com/articles/index (www.example.com/articles/ と同じです)
をリクエストした場合、投稿記事の一覧が表示されると期待するでしょう。
このアクションのコードは次のようになります。 ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

``ArticlesController`` の中に ``index()`` という関数を定義することによって、ユーザは、
www.example.com/articles/index というリクエストで、そのロジックにアクセスできるようになります。
同様に、 ``foobar()`` という関数を定義すると、ユーザは、www.example.com/articles/foobar
でアクセスできるようになります。

.. warning::

    ある URL にさせたいために、コントローラ名とアクション名をそれに合わせて独自に
    命名したくなるかもしれませんが、その誘惑に抵抗してください。:doc:`/intro/conventions`
    （大文字化、複数形の名前など）に従って、読みやすく、理解しやすいアクション名を
    付けるようにしましょう。あとで、:doc:`/development/routing` という機能を使って、URL とコードを
    結びつけることができます。

アクションの中にあるひとつの命令が、 ``set()`` を使って、コントローラからビュー
(次に作成します) にデータを渡しています。この行は、``ArticlesTable`` オブジェクトの ``find('all')``
メソッドから返ってきた値で、「articles」というビューの変数を設定します。

.. note::

    もし、すでに:doc:`ブログチュートリアルのパート1 </tutorials-and-examples/blog/blog>`
    を完了していて ``articles`` テーブルをブログ用のデータベースに作成してあれば、
    CakePHP の bake コンソールを活用して ``ArticlesController`` クラスを作成することができます。 ::

        bin/cake bake controller Articles

bake とコード生成についての詳細は、 :doc:`/bake/usage` を参照してください。

CakePHP のコントローラに関する詳細は、 :doc:`/controllers` の章をチェックしてください。

Article ビューの作成
====================

現在、モデルにはデータが入り、コントローラにはアプリケーションロジックと流れが定義されています。
今度は、作成した index アクション用のビューを作成しましょう。

CakePHP のビュー (*view*) は、アプリケーションのレイアウト (*layout*) の内側に
はめこまれる、データ表示用の断片部品です。たいていのアプリケーションでは、PHP のコードが
含まれる HTML になりますが、XML、CSV、バイナリのデータにもなりえます。

レイアウト (*layout*) は、ビューを囲む表示用のコードで、独自に定義したり、
切り替えたりすることも可能ですが、今のところは、デフォルト (*default*) のものを
使用することにしましょう。

一つ前のセクションの ``set()`` メソッドによって、ビューから「articles」変数が使えるように
割り当てたのを覚えていますか。これはクエリオブジェクトのコレクションを
``foreach`` イテレーションを呼び出した状態でビューに伝えます。

CakePHP のビューファイルは、 ``src/Template`` の中の、コントローラ名に対応するフォルダの中に
保存されています (この場合は、「Articles」というフォルダを作成します)。
この投稿記事データをテーブル表示するには、ビューのコードは次のようなものになります。

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- ここから、$articles のクエリオブジェクトをループして、投稿記事の情報を表示 -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>

シンプルなものであることがお分かりいただけるかと思います。

``$this->Html`` というオブジェクトを使っていることに気づいたかもしれません。
これは、CakePHP の :php:class:`Cake\\View\\Helper\\HtmlHelper` クラスのインスタンスです。
CakePHP には一連のビューヘルパーがあり、リンクの作成、フォームの出力などをすぐに使えます。
使い方の詳細については、 :doc:`/views/helpers` を参照してください。ここで重要なのは、
``link()`` メソッドが、指定されたタイトル（最初のパラメータ）と
URL (二つ目のパラメータ) で HTML リンクを生成する、ということです。

CakePHP 内で URL を指定する場合、配列フォーマットの使用が推奨されます。
これはルーティングの章で詳しく説明されます。URL に配列フォーマットを用いることによって、
CakePHP のリバースルーティング機能を活用することができます。また、
/コントローラ/アクション/パラメータ1/パラメータ2
という形のアプリケーションの基本パスに対する相対パスを単に書くこともできます。
:ref:`named routes <named-routes>` もご参照ください。

この時点で、ブラウザから http://www.example.com/articles/index を開いてみてください。
タイトルと投稿内容のテーブル一覧がまとめられているビューが表示されるはずです。

ビューの中のリンク (投稿記事のタイトルから ``/articles/view/some\_id`` という URL へのリンク) を
クリックすると、CakePHP は、そのアクションはまだ定義されていません、という表示を出します。
もしそういう表示が出ない場合には、何かおかしくなってしまったか、もうすでにあなたが
その定義作業をしてしまったから（仕事がハヤイ！）か、のどちらかです。
そうでないなら、これから ``ArticlesController`` の中に作ってみましょう。 ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

``set()`` の呼び出しはもう知っていますね。 ``find('all')`` の代わりに、
``get()`` を使っていることに注目してください。今回は、ひとつの投稿記事の情報しか
必要としないからです。

ビューのアクションが、ひとつのパラメータを取っていることに注意してください。
それは、これから表示する投稿記事のID番号です。このパラメータは、リクエストされた
URL を通して渡されます。ユーザが、 ``/articles/view/3`` とリクエストすると、
「3」という値が ``$id`` として渡されます。

ユーザーが実在するレコードにアクセスすることを保証するために少しだけエラーチェックを行います。
Articles テーブルに対して ``get()`` を用いるとき、存在するレコードにアクセスしています。
もしリクエスト記事がデータベースに存在しない場合、もしくは id が false の場合、
``get()`` 関数は ``NotFoundException`` を送出します。

では、新しい「view」アクション用のビューを作って、
**src/Template/Articles/view.ctp** というファイルで保存しましょう。

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>


``/articles/index`` の中にあるリンクをクリックしたり、手動で、 ``/articles/view/1``
にアクセスしたりして、動作することを確認してください。

記事の追加
==========

データベースを読み、記事を表示できるようになりました。今度は、新しい投稿が
できるようにしてみましょう。

まず、 ``ArticlesController`` の中に、 ``add()`` アクションを作ります。 ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // Include the FlashComponent
        }

        public function index()
        {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::

    :doc:`/controllers/components/flash` コンポーネントを使うコントローラで読み込む必要があります。
    必要不可欠なら、 ``AppController`` で読み込むようにしてください。

``add()`` アクションの動作は次のとおりです: もし、リクエストの HTTP メソッドが
POST なら、Articles モデルを使ってデータの保存を試みます。
何らかの理由で保存できなかった場合には、単にビューを表示します。
この時に、ユーザバリデーションエラーやその他の警告が表示されることになります。

すべての CakePHP のリクエストは ``ServerRequest`` オブジェクトに格納されており、
``$this->request`` でアクセスできます。リクエストオブジェクトには、受信したリクエストに
関するいろんな情報が含まれているので、アプリケーションのフローの制御に利用できます。今回は、
リクエストが HTTP POST かどうかの確認に :php:meth:`Cake\\Network\\ServerRequest::is()` メソッドを
使用しています。

ユーザがフォームを使ってデータを POST した場合、その情報は、 ``$this->request->getData()``
の中に入ってきます。 :php:func:`pr()` や :php:func:`debug()` を使うと、
内容を画面に表示させて、確認することができます。

FlashComponent の ``success()`` および ``error()`` メソッドを使って
セッション変数にメッセージをセットします。これらのメソッドは PHP の `マジックメソッド
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_ を利用しています。
Flash メッセージはリダイレクト後のページに表示されます。
レイアウトでは ``<?= $this->Flash->render() ?>`` を用いてメッセージを表示し、
対応するセッション変数を削除します。コントローラの :php:meth:`Cake\\Controller\\Controller::redirect`
関数は別の URL にリダイレクトを行います。 ``['action' => 'index']`` パラメータは
/articles、つまり articles コントローラの index アクションを表す URL に解釈されます。
多くの CakePHP の関数で指定できるURLのフォーマットについては、
`API <https://api.cakephp.org>`_ の :php:func:`Cake\\Routing\\Router::url()`
関数を参考にすることができます。

``save()`` メソッドを呼ぶと、バリデーションエラーがチェックされ、もしエラーがある場合には
保存動作を中止します。これらのエラーがどのように扱われるのかは次のセクションで見てみましょう。

データのバリデーション
======================

CakePHP はフォームの入力バリデーションの退屈さを取り除くのに大いに役立ちます。
みんな、延々と続くフォームとそのバリデーションルーチンのコーディングは好まないでしょう。
CakePHP を使うと、その作業を簡単、高速に片付けることができます。

バリデーションの機能を活用するためには、ビューの中で CakePHP の :doc:`/views/helpers/form` を
使う必要があります。 :php:class:`Cake\\View\\Helper\\FormHelper` はデフォルトで、
すべてのビューの中で ``$this->Form`` としてアクセスできるようになっています。

add のビューは次のようなものになります:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

ここで、FormHelper を使って、HTML フォームの開始タグを生成しています。
``$this->Form->create()`` が生成した HTML は次のようになります。

.. code-block:: html

    <form method="post" action="/articles/add">

``create()`` にパラメータを渡さないで呼ぶと、現在のコントローラの add() アクション
(または ``id`` がフォームデータに含まれる場合 ``edit()`` アクション) に、
POST で送るフォームを構築している、と解釈されます。

``$this->Form->control()`` メソッドは、同名のフォーム要素を作成するのに使われています。
最初のパラメータは、どのフィールドに対応しているのかを CakePHP に教えます。
２番目のパラメータは、様々なオプションの配列を指定することができます。
- この例では、textarea の列の数を指定しています。
ここではちょっとした内観的で自動的な手法が使われています。
``control()`` は、指定されたモデルのフィールドに基づいて、異なるフォーム要素を出力します。

``$this->Form->end()`` の呼び出しで、フォームの終了部分が出力されます。
hiddenのinput要素の出力においては、CSRF/フォーム改ざん防止が有効です。

さて少し戻って、 ``src/Template/Articles/index.ctp`` のビューで「Add Article」というリンクを
新しく表示するように編集しましょう。 ``<table>`` の前に、以下の行を追加してください。 ::

    <?= $this->Html->link('Add Article', ['action' => 'add']) ?>

バリデーション要件について、どうやって CakePHP に指示するのだろう、と思ったかもしれません。
バリデーションのルールは、モデルの中で定義することができます。
Article モデルを見直して、幾つか修正してみましょう。 ::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator)
        {
            $validator
                ->notEmpty('title')
                ->requirePresence('title')
                ->notEmpty('body')
                ->requirePresence('body');

            return $validator;
        }
    }

``validationDefault()`` メソッドを使って ``save()`` メソッドが呼ばれた時に、
どうやってバリデートするかを CakePHP に教えます。ここでは、本文とタイトルのフィールドが、
空ではいけない、そして作成及び編集の際にどちらも必要であるということを設定しています。
CakePHP のバリデーションエンジンは強力で、
組み込みのルールがいろいろあります (クレジットカード番号、メールアドレスなど）。
また柔軟に、独自ルールを作って設定することもできます。この設定に関する詳細は、
:doc:`/core-libraries/validation` を参照してください。

バリデーションルールを書き込んだので、アプリケーションを動作させて、タイトルと本文を
空にしたまま、記事を投稿してみてください。 :php:meth:`Cake\\View\\Helper\\FormHelper::control()`
メソッドを使ってフォーム要素を作成したので、バリデーションエラーのメッセージが自動的に表示されます。

投稿記事の編集
==============

それではさっそく投稿記事の編集ができるように作業をしましょう。
もう CakePHP プロのあなたは、パターンを見つけ出したでしょうか。
アクションをつくり、それからビューを作る、というパターンです。
``ArticlesController`` の ``edit()`` アクションはこんな形になります。 ::

    // src/Controller/ArticlesController.php

    public function edit($id = null)
    {
        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        $this->set('article', $article);
    }


このアクションではまず、ユーザが実在するレコードにアクセスしようとしていることを確認します。
もし ``$id`` パラメータが渡されてないか、ポストが存在しない場合、
``NotFoundException`` を送出して CakePHP の ErrorHandler に処理を委ねます。

次に、リクエストが POST か PUT であるかをチェックします。もしリクエストが POST か PUT なら、
``patchEntity()`` メソッドを用いてPOST データを記事エンティティに更新します。
最終的にテーブルオブジェクトを用いて、エンティティを保存したり、退けてバリデーションエラーを表示したりします。

edit ビューは以下のようになるでしょう:

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

（値が入力されている場合、）このビューは、編集フォームを出力します。
必要であれば、バリデーションのエラーメッセージも表示します。

``save()`` が呼び出された時、エンティティの内容によって
CakePHP は挿入あるいは更新のどちらを生成するかを決定します。

これで、特定の記事をアップデートするためのリンクを index ビューに付けることができます:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (edit links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- $articles クエリオブジェクトをループして、投稿記事の情報を表示 -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

投稿記事の削除
==============

次に、ユーザが投稿記事を削除できるようにする機能を作りましょう。
``ArticlesController`` の ``delete()`` アクションを作るところから始めます。 ::

    // src/Controller/ArticlesController.php

    public function delete($id)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The article with id: {0} has been deleted.', h($id)));
            return $this->redirect(['action' => 'index']);
        }
    }

このロジックは、 ``$id`` で指定された記事を削除し、 ``$this->Flash->success()``
を使って、ユーザに確認メッセージを表示し、それから ``/articles`` にリダイレクトします。
ユーザーが GET リクエストを用いて削除を試みようとすると、 ``allowMethod()`` が例外を投げます。
捕捉されない例外は CakePHP の例外ハンドラーによって捕まえられ、気の利いたエラーページが
表示されます。多くの組み込み :doc:`Exceptions </development/errors>` があり、アプリケーションが
生成することを必要とするであろう様々な HTTP エラーを指し示すのに使われます。

ロジックを実行してリダイレクトするので、このアクションにはビューがありません。
しかし、index ビューにリンクを付けて、投稿を削除するようにできるでしょう:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp (delete links added) -->

    <h1>Blog articles</h1>
    <p><?= $this->Html->link('Add Article', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>

    <!-- ここで $articles クエリオブジェクトをループして、投稿情報を表示 -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Delete',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Are you sure?'])
                ?>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

:php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` を使うと、投稿記事の削除を行う POST
リクエストをするための JavaScript を使うリンクが生成されます。

.. warning::

    ウェブクローラーが不意にコンテンツ全てを削除できてしまうので、
    GETリクエストを用いたコンテンツの削除を許可することは危険です。

.. note::

    このビューコードは ``FormHelper`` を使い、削除する前に、
    JavaScript による確認ダイアログでユーザに確認します。

ルーティング(*Routes*)
======================

CakePHP のデフォルトのルーティングの動作で十分だという人もいます。しかし、ユーザフレンドリで
一般の検索エンジンに対応できるような操作に関心のある開発者であれば、CakePHP の中で、
URL がどのように特定の関数の呼び出しにマップされるのかを理解したいと思うはずです。
このチュートリアルでは、routes を簡単に変える方法について扱います。

ルーティングテクニックの応用に関する情報は、 :ref:`routes-configuration` を見てください。

今のところ、ユーザがサイト (たとえば、 http://www.example.com) を見に来ると、
CakePHP は ``PagesController`` に接続し、「home」というビューを表示するようになっています。
ではこれを、ルーティングルールを作成して ArticlesController に行くようにしてみましょう。

CakePHP のルーティングは、 **config/routes.php** の中にあります。
デフォルトのトップページのルートをコメントアウトするか、削除します。
この行です:

.. code-block:: php

    $routes->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);

この行は、「/」という URL をデフォルトの CakePHP のホームページに接続します。
これを、自分のコントローラに接続させるために、次のような行を追加してください。

.. code-block:: php

    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

これで、「/」でリクエストしてきたユーザを、ArticlesController の index() アクションに
接続させることができます。

.. note::

    CakePHP は「リバースルーティング」も利用します。
    上記のルートが定義されている状態で、配列を期待する関数に
    ``['controller' => 'Articles', 'action' => 'index']`` 
    を渡すと、結果のURLは「/」になります。
    つまり、URL の指定に常に配列を使うということが良策となります。
    これによりルートが URL の行き先を定義する意味を持ち、
    リンクが確実に同じ場所を指し示すようになります。

まとめ
======

この方法に則ったアプリケーションの作成により、平和、賞賛、愛、お金までもが、
あなたが考えうる以上にもたらされるでしょう。シンプルですよね。ですが、気をつけてほしいのは、
このチュートリアルは、非常に基本的な点しか扱っていない、ということです。
CakePHP には、もっともっと *多くの* 機能があります。シンプルなチュートリアルにするために、
それらはここでは扱いませんでした。マニュアルの残りの部分をガイドとして使い、
もっと機能豊かなアプリケーションを作成してください。

基本的なアプリケーションの作成が終わったので :doc:`/tutorials-and-examples/blog/part-three`
に進むか、自分のプロジェクトを始めてください。CakePHP についてさらに学ぶために
:doc:`/topics` や `API <https://api.cakephp.org>`_ を使いましょう。

もし困ったときは、いろんな方法で助けを得ることができます。
:doc:`/intro/where-to-get-help` を見てみてください。
CakePHP にようこそ！

お勧めの参考文献
----------------

CakePHP を学習する人が次に学びたいと思う共通のタスクがいくつかあります:

1. :ref:`view-layouts`: ウェブサイトのレイアウトをカスタマイズする
2. :ref:`view-elements`: ビューのスニペットを読み込んで再利用する
3. :doc:`/bake/usage`: 基本的な CRUD コードの生成
4. :doc:`/tutorials-and-examples/blog-auth-example/auth`: ユーザの認証と承認のチュートリアル


.. meta::
    :title lang=ja: Blog Tutorial Adding a Layer
    :keywords lang=ja: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
