CMS チュートリアル - タグとユーザー
###################################

基本的な記事の作成機能が作成されたので、複数の作成者が CMS で作業できるようにしましょう。
前回は、全てのモデル、ビュー、コントローラーを手作業で構築していました。今度は、 :doc:`/bake`
を使ってスケルトンコードを作成します。
Bake は、CakePHP が :abbr:`CRUD (Create, Read, Update, Delete)` アプリケーションのスケルトンを
とても効率的に作成するために、規約を活用した強力なコード生成 :abbr:`CLI (Command Line Interface)`
ツールです。ユーザーコードを構築するために ``bake`` を使ってみましょう。

.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

これらの3つのコマンドは次を生成します。

* テーブル、エンティティー、フィクスチャーファイル
* コントローラー
* CRUD テンプレート
* 生成された各クラスのテストケース

Bake はまた、CakePHP の規約を使用して、モデルが持つ関連付けやバリデーションを推測します。

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

記事へのタグ付けの追加
======================

複数のユーザーが私たちの小さな :abbr:`CMS` にアクセスすることができれば、
私たちのコンテンツを分類することができればうれしいでしょう。
ユーザーがコンテンツに自由形式のカテゴリーやラベルを作成するためにタグを使用します。
ここでも、アプリケーション用のスケルトンコードを素早く生成するために ``bake`` を使います。

.. code-block:: bash

    # 一度にすべてのコードを生成します。
    bin/cake bake all tags

足場になるコードを作成したら、 **http://localhost:8765/tags/add** に移動して
サンプルタグをいくつか作成します。

Tags テーブルが作成されたので、Articles と Tags の関連付けを作成できます。
ArticlesTable の ``initialize`` メソッドに以下を追加することで、
これを行うことができます。 ::

    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // この行を追加
    }

テーブルの作成時に CakePHP の規約に従ったので、この関連付けは簡単な定義で動作します。
詳しくは、 :doc:`/orm/associations` をご覧ください。

タグ付けを有効にする記事の更新
==============================

アプリケーションにタグが付いたので、ユーザーが記事にタグを付けるようにする必要があります。
まず ``add`` アクションを次のように更新してください。 ::

    <?php
    // src/Controller/ArticlesController.php の中で

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

		// user_id の決め打ちは一時的なもので、あとで認証を構築する際に削除されます。
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            // タグのリストを取得
            $tags = $this->Articles->Tags->find('list');

            // ビューコンテキストに tags をセット
            $this->set('tags', $tags);

            $this->set('article', $article);
        }

        // 他のアクション
    }

追加された行は ``id => title`` の連想配列としてタグのリストを読み込みます。
この形式で、テンプレートに新しいタグ入力を作成できます。
**src/Template/Articles/add.ctp** のコントロールの PHP ブロックに以下を追加してください。 ::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

これは、 ``$tags`` 変数を使用してセレクトボックスのオプションを生成する複数選択要素を描画します。
次のセクションでタグで記事を見つける機能を追加しますので、タグを持つ新しい記事を2つ作成してください。

また、 ``edit`` メソッドを更新して、タグの追加や編集を許可する必要があります。
edit メソッドは次のようになります。 ::

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // 関連づけられた Tags を読み込む
            ->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // タグのリストを取得
        $tags = $this->Articles->Tags->find('list');

        // ビューコンテキストに tags をセット
        $this->set('tags', $tags);

        $this->set('article', $article);
    }

**add.ctp** テンプレートに追加した新しいタグの複数選択コントロールを
**src/Template/Articles/edit.ctp** テンプレートに追加することを忘れないでください。

タグによる記事の検索
====================

ユーザーがコンテンツを分類すると、使用したタグでそのコンテンツを探したいと思うでしょう。
この機能のために、記事をタグで検索するためのルート、コントローラーのアクション、そして
ファインダーメソッドを実装します。

理想的には、 **http://localhost:8765/articles/tagged/funny/cat/gifs** のような URL になります。
これにより、「funny」、「cat」、または「gifs」タグを持つすべての記事を見つけることができます。
これを実装する前に、新しいルートを追加します。 **config/routes.php** は次のようになるはずです。 ::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // タグ付けられたアクションのために追加された新しいルート。
    // 末尾の `*` は、このアクションがパラメーターを渡されることを
    // CakePHP に伝えます。
    Router::scope(
        '/articles',
        ['controller' => 'Articles'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // デフォルトの home と /pages/* ルートを接続。
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // 規約に基づいたデフォルトルートを接続。
        $routes->fallbacks();
    });

    Plugin::routes();

上記は、 **/articles/tagged/** パスを ``ArticlesController::tags()`` に接続する、新しい
「ルート」を定義します。ルートを定義することにより、URL の外観とそれらの実装方法を分離することが
できます。   **http://localhost:8765/articles/tagged** にアクセスすると、コントローラーの
アクションが存在しないことを知らせる CakePHP の役に立つエラーページが表示されます。
その足りないメソッドを今から実装しましょう。 **src/Controller/ArticlesController.php**
の中で、次のように追加してください。 ::

    public function tags()
    {
        // 'pass' キーは CakePHP によって提供され、リクエストに渡された
        // 全ての URL パスセグメントを含みます。
        $tags = $this->request->getParam('pass');

        // ArticlesTable を使用してタグ付きの記事を検索します。
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // 変数をビューテンプレートのコンテキストに渡します。
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

リクエストデータの他の部分にアクセスするには、
:ref:`cake-request` セクションを参照してください。

渡された引数はメソッドのパラメーターとして渡されるので、
PHP の可変引数を使ってアクションを記述することもできます。 ::

    public function tags(...$tags)
    {
        // ArticlesTable を使用してタグ付きの記事を検索します。
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // 変数をビューテンプレートのコンテキストに渡します。
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

ファインダーメソッドの追加
--------------------------

CakePHP では、コントローラーのアクションをスリムに保ち、アプリケーションのロジックのほとんどを
モデルレイヤーに入れたいと思っています。 **/articles/tagged** URL にアクセスすると、
``findTagged()`` メソッドがまだ実装されていないというエラーが表示されます。
**src/Model/Table/ArticlesTable.php** の中で次を追加してください。 ::

    // この use 文を名前空間宣言のすぐ下に追加して、
    // Query クラスをインポートします
    use Cake\ORM\Query;

    // $query 引数はクエリービルダーのインスタンスです。
    // $options 配列には、コントローラーのアクションで find('tagged') に渡した
    // "tags" オプションが含まれています。
    public function findTagged(Query $query, array $options)
    {
        $columns = [
            'Articles.id', 'Articles.user_id', 'Articles.title',
            'Articles.body', 'Articles.published', 'Articles.created',
            'Articles.slug',
        ];

        $query = $query
            ->select($columns)
            ->distinct($columns);

        if (empty($options['tags'])) {
            // タグが指定されていない場合は、タグのない記事を検索します。
            $query->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            // 提供されたタグが1つ以上ある記事を検索します。
            $query->innerJoinWith('Tags')
                ->where(['Tags.title IN' => $options['tags']]);
        }

        return $query->group(['Articles.id']);
    }

私たちは :ref:`カスタムファインダーメソッド <custom-find-methods>` を実装しました。
これは CakePHP の非常に強力な概念で、再利用可能なクエリーをパッケージ化することができます。
ファインダーメソッドは常に :doc:`/orm/query-builder` オブジェクトと options 配列を
パラメーターとして取得します。ファインダーはクエリーを操作し、必須条件や抽出条件を追加できます。
完了したら、ファインダーメソッドは変更されたクエリーオブジェクトを返す必要があります。
上記のファインダーでは、 ``distinct()`` と ``leftJoin()`` メソッドを利用して、
'一致する' タグを持つ記事を見つけることができます。

ビューの作成
------------

**/articles/tagged** URL にもう一度アクセスすると、CakePHP は新しいエラーを表示して、
ビューファイルが作成されていないことを知らせます。
次は、 ``tags()`` アクションのビューファイルを作成しましょう。
**src/Template/Articles/tags.ctp** の中に次の内容を入れてください。 ::

    <h1>
        Articles tagged with
        <?= $this->Text->toList(h($tags), 'or') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- リンクの作成に HtmlHelper を使用 -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?>
        </article>
    <?php endforeach; ?>
    </section>

上記のコードの中で、 ビュー出力を支援するために :doc:`/views/helpers/html` ヘルパーと
:doc:`/views/helpers/text` ヘルパーを使用します。また、HTML エンコード出力のために
:php:func:`h` ショートカット関数を使用します。HTML インジェクションの問題を防ぐために
データを出力するときは、常に ``h()`` を使うことを忘れないでください。

先ほど作成した **tags.ctp** ファイルは、ビューテンプレートファイルの CakePHP 規約に従います。
コントローラーのアクション名を小文字とアンダースコアーに変えたものをテンプレートに使用することが
規約です。

ビューテンプレートに ``$tags`` と ``$articles`` 変数を使うことができることに気付くかもしれません。
コントローラーで ``set()`` メソッドを使う際、ビューに送る特定の変数を設定します。
ビューは、渡されたすべての変数をテンプレートスコープでローカル変数として使用可能にします。

以上で **/articles/tagged/funny** の URL にアクセスして、「funny」とタグ付けされたすべての記事を
見ることができます。

タグ付け体験の改善
==================

現在、新しいタグを追加するのは面倒なプロセスです。作成者は、使用したいタグをすべて事前に作成する必要が
あります。カンマ区切りのテキストフィールドを使用してタグ選択 UI を改善することができます。
これにより、ユーザーにとってより良い体験を提供し、ORM でさらに優れた機能を使用することができます。

計算フィールドの追加
--------------------

エンティティーの書式設定されたタグに簡単にアクセスできるようにするため、仮想/計算フィールドを
エンティティーに追加できます。 **src/Model/Entity/Article.php** の中で次を追加してください。 ::

    // この use 文を名前空間宣言のすぐ下に追加して、
    // Collection クラスをインポートします
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

これにより ``$article->tag_string`` の計算されたプロパティにアクセスできます。
後でコントロールでこのプロパティーを使用します。

ビューの更新
------------

エンティティーが更新されると、タグの新しいコントロールを追加できます。
**src/Template/Articles/add.ctp** と **src/Template/Articles/edit.ctp** の中で、
既存の ``tags._ids`` コントロールを次のものに置き換えてください。 ::

    echo $this->Form->control('tag_string', ['type' => 'text']);

タグ文字列の永続化
------------------

既存のタグを文字列として表示できるようになったので、そのデータも保存したいと考えています。
``tag_string`` をアクセス可能とマークしたので、ORM はそのデータをリクエストから
エンティティーにコピーします。``beforeSave()`` フックメソッドを使用してタグ文字列を解析し、
関連するエンティティーを検索/構築することができます。
**src/Model/Table/ArticlesTable.php** に次を追加してください。 ::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }

        // 他のコード
    }

    protected function _buildTags($tagString)
    {
        // タグをトリミング
        $newTags = array_map('trim', explode(',', $tagString));
        // 全てのからのタグを削除
        $newTags = array_filter($newTags);
        // 重複するタグの削減
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // 新しいタグのリストから既存のタグを削除。
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // 既存のタグを追加。
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // 新しいタグを追加。
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

記事を作成または編集する場合、タグをコンマ区切りのタグリストとして保存し、
タグとリンクレコードを自動的に作成できるようにする必要があります。

このコードはこれまでのやり方より少し複雑ですが、CakePHP の ORM がどれほど強力であるかを紹介するのに
役立ちます。 :doc:`/core-libraries/collections` のメソッドを使用してクエリー結果を操作したり、
エンティティーを簡単に作成したりするシナリオを扱うことができます。

次は :doc:`認証 </tutorials-and-examples/cms/authentication>` を追加しましょう。
