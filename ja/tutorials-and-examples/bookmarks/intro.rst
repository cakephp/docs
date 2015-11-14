ブックマークチュートリアル
###########################
このチュートリアルは簡単なブックマークのためのアプリを作ります。
始めるためにはCakeのインストールが必要で、加えて早く作るために
データベースの作成とCakeが提供するツールを使います。

必要なもの

#. データベースサーバー　この例ではMySqlを使います。SQLについてCreate命令が使えるぐらいの知識.また、``pdo_mysql`` が有効になっているか確認して下さい。PDOを使ってCakeはデータベースを動かします。
#. 基礎的なPHPの知識

はじめましょう。

CakePHPのインストール
=======================

最も簡単なインストール方法はComposerを使う方法です.
Composerを使うとコマンドラインプロンプトやターミナルを使って
簡単にインストールできます。
最初にコンポーザーをインストールする必要があります。

cURL がインストールされていたら、このコマンドでインストールされます。::

    curl -s https://getcomposer.org/installer | php

もしくは ``composer.phar`` を`Composer website <https://getcomposer.org/download/>`_ から落として下さい.::


    php composer.phar create-project --prefer-dist cakephp/app bookmarker

このコマンドでCake のスケルトン（自動生成されるアプリの基礎）を **bookmarker**　ディレクトリに生成します。


もし `Composer Windows Installer版
<https://getcomposer.org/Composer-Setup.exe>`_,
を使っていて、例えばここにインストールしていたら、
C:\\wamp\\www\\dev\\cakephp3)::

    composer create-project --prefer-dist cakephp/app bookmarker

このようにコマンドラインに打って下さい。
Composerを使うメリットは、 自動的に完全なセットアップをしてくれることです。
正しい場所に正しい許可でファイルを置くとか、 **config/app.php** を作るとかです。

他にも方法がありますが、コンポーザーを使いたくなかったら :doc:`/installation` を見てください.

もうインストールできていたら、
以下の様なディレクトリ構成になっているか確かめて下さい。::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

それぞれのディレクトリの役割を知りたければここを見て下さい。
:doc:`/intro/cakephp-folder-structure`

インストールできたか確かめる
===============================
デフォルトのページで簡単に正しくインストールできたか確かめましょう。
これをする前に、開発サーバーを起動します。::

    bin/cake server

.. note::

    Windows　では、このコマンドは ``bin\cake server`` (バックスラッシュ)です。.

ポート8765でビルトインのPHPサーバーは動きます。ポートを開いて下さい
**http://localhost:8765** でウェブサーバーのようこそ（スタート）画面が開くか確かめて下さい。
以上の全ての操作でCakePHPはデータベースとの接続以外を可能にします。
しかし、追加のPHPエクステンションやディレクトリのアクセス許可の変更が必要であればこの限りではあります。

データベースの作成
=====================

次にDBをセットアップします。まだしていないのならば、空のDBをこのアプリのために作ります。
名前は例えば  ``cake_bookmarks`` としておきます.
以下のSQLで必要なテーブルを作成可能です。::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

複合主キーを ``bookmarks_tags`` で使おうとして注意されると思います。
Cakeは複合主キーをほとんどどこでもサポートしているので、もっと簡単に複数の
アプリを一つのアプリで提供できます（マルチテナント）。

テーブルとカラム名は適当に決めずに、CakePHPの
:doc:`命名規則 </intro/conventions>` に従ったほうがいいです。
非常に簡単に開発できるようになり、いちいち余計な設定しなくて済みます。
Cakeは十分レガシーなDBに対応できるぐらい柔軟ですが、命名規則に従うことで、時間を節約できます。


Database 設定
======================

次にDBがどこにありどうやって接続するのかCakeに教えます。
殆どの場合これっきり設定はいじりません。

この設定はとてもわかりやすいはずです。 ``Datasources.default`` のなかにある 配列を **config/app.php** にコピペして、
設定します。設定例は以下になります。::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

一回 **config/app.php** 保存したら、DBに接続できるようになっているので、
Cakeのホームページを見ると、'CakePHP is
able to connect to the database' がチェックされているはずです。

.. note::


    CakePHP　の初期設定ファイルは以下にあります。
    **config/app.default.php**.

スキャットフォールド（簡易）コードの生成
=============================================

CakePHP　の命名規則にDBが従っていれば
:doc:`ベイクコンソール </bake/usage>` でアプリの簡単な骨格が作れます
コマンドは以下です::

    // On Windows you'll need to use bin\cake instead.
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

これは、コントローラー、モデル、ビュー、それにタイオするテストケース、と
ユーザーに対してのフィクスチャー、ブックマークとタグのリソースを一気に生成します。
サーバを止めてしまった場合、再起動して **http://localhost:8765/bookmarks** に
アクセスして下さい。.

そうすると、基本的なDBにアクセスできる動くアプリが見えるはずです。
一度、ブックマークリストのページに行ったら、ユーザーやブックマークやタグの追加ができるはずです。


.. note::

    404　not foundになってしまったら, アパッチの mod_rewrite　モジュールがロードされているか確かめて下さい。

パスワードハッシュを追加
============================

ユーザーを作ると平文でパスワードが保存されてしまいます。セキュリティー上とても良くないので直しましょう

これはまた、モデルレイヤーについて紹介する良い機会です。オブジェクトを操作するメソッドと、
違うクラスの単一のオブジェクトを分けています。
一つのレコードに従っている機能が一つの　「エンティティ」クラスにある場合、メソッドはテーブルクラスにあるエンティティーコレクションを操作します。

例えば、パスワードハッシュは個別のレコードで行われ、エンティティーオブジェクトでビヘイビアを操作します。
なぜなら、毎回パスワードを暗号化するときにmutator/setter　メソッドを使うからです。
Cakeは規約ベースのセッターメソッドをエンティーにセットします。
**src/Model/Entity/User.php** にパスワード用のセッターを追加しましょう。::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }


既に作ったユーザーのパスワードを変えたら、前のパスワードに変えて、暗号化されたパスワードが
表示される。CakePHP `bcrypt<http://codahale.com/how-to-safely-store-a-password/>`
でハッシュ化するのがデフォルト設定です。
ほかにも、 sha1 、 md5 も使っているDBで動けばつかえます。

ブックマークをタグで探す
=====================================

パスワードを安全に保管できました。もっと他の興味深い機能を追加しましょう。
一度ブックマークを整理せずに保存してしまうと、タグで検索する事ができると便利です。
次にルーティング、コントローラーのアクション、finder メソッドを使ってタグで検索できるようにします。

多分こんな　URLになっていると思います。
**http://localhost:8765/bookmarks/tagged/funny/cat/gifs**.


この意味は、
'funny'もしくは 'cat' もしくは 'gifs' タグをもつブックマークを検索しているということです。
このような操作をできるようにするために、新しいルートを追加しましょう。
**config/routes.php** が以下のようになっているはずです。::

    <?php
    use Cake\Routing\Router;

    Router::defaultRouteClass('Route');

    // 新しいルートを　tagged アクションのために追加します
    //`*` は CakePHP 渡された引数を持っていることを表します。
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // デフォルトのルートに接続.
        $routes->fallbacks('InflectedRoute');
    });

上記は新しい　**/bookmarks/tagged/** で ``BookmarksController::tags()``
に接続するためのルート 定義したルートでURLをメソッド名とは別に設定できます。

もし **http://localhost:8765/bookmarks/tagged** にアクセスしたらCekeによる有益なエラーメッセージ
(the controller action does not exist == アクションの不存在）のある
エラーページが表示されます。そう表示されたら、  **src/Controller/BookmarksController.php** で
以下を追加します::

    public function tags()
    {
        // CakePHPによって提供された'pass' キーは全ての
        // リクエストにある渡されたURLセグメントです。

        $tags = $this->request->params['pass'];

        // Use the BookmarksTable to find tagged bookmarks.
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }


リクエストデータの他の部分にアクセスするためには :ref:`cake-request`
を見てください。

Find メソッドの作成
--------------------------


CakePHP ではコントローラーをスリムに保つために、モデルにアプリケーションのろ実行を起きます。
**/bookmarks/tagged** にアクセスすると、``findTagged()`` 不存在のエラーが表示されます。
**src/Model/Table/BookmarksTable.php** に以下のコードを追加します。::

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        return $this->find()
            ->distinct(['Bookmarks.id'])
            ->matching('Tags', function ($q) use ($options) {
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }


:ref:`custom finder method <custom-find-methods>`
 これは、CakePHPの強力なクエリ再利用のためのパッケージをするコンセプトです。

Finder メソッドは常に:doc:`/orm/query-builder` オブジェクトを取得しオプション配列を持ちます。
Finder メソッドはクエリと、すべての必要な条件やふるいを設定出来ます。
検索が完了すると、操作されたクエリがオブジェクトとして返ります。
Cakeの finderでは、マッチングするタグを持つブックマークを特定するために ``distinct()`` と
``matching()`` メソッド  を使います。 ``matching()`` メソッドは、`anonymous function
<http://php.net/manual/en/functions.anonymous.php>`_ を受け付けます。 これは、クエリビルダーの引数を受け付けます。
コールバック内でクエリビルダーを特定のタグを持つブックマークをフィルターするための
条件を定義するために使います。

ビューの作成
-----------------

**/bookmarks/tagged** にアクセスすると、 ビューファイルがないことを知らせるエラーになります。
次に、ビューファイルを ``tags()`` アクションのために作ります。
**src/Template/Bookmarks/tags.ctp** に以下のコードを追加します。::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList($tags) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph($bookmark->description) ?>
        </article>
    <?php endforeach; ?>
    </section>

上記のコードは :doc:`/views/helpers/html` と
:doc:`/views/helpers/text` を使いました。ヘルパーはビューの生成を助けます。
また、 HTMLで出力するためのショートカット :php:func:`h` を使いました。
ユーザーデータをに出力するときにHTMLインジェクションを防ぐために
``h()`` を使うことを覚えておいて下さい。

**tags.ctp** はCakePHPの規約に従ってビューテンプレートファイルから作られます。
この規約は小文字を使って、'_' を利用したアクション名と同じ名前にする必要があります。
'_a'とするとアクション名の'A'に対応します。

ビューで ``$tags`` と ``$bookmarks`` 変数を使いたい場合、
コントローラーで``set()``メソッドを使って、設定してビューに送ります。
ビューは全ての渡されたテンプレート内の変数がローカル変数として利用可能です。


**/bookmarks/tagged/funny** にアクセスすると、
全ての'funny'でタグ付けされたブックマークが見えます。

基本的なブックマーク、タグ、ユーザー管理アプリを紹介しました。
全員のタグが全員に見えてしまいます。次の章では、権限管理とブックマークの公開を
現在のユーザーのみに制限する方法を紹介します。

次は :doc:`/tutorials-and-examples/bookmarks/part-two` で権限管理を紹介します。
または、 :doc:`dive into the documentation
</topics>` で他のことも学べます。.
