ブックマークチュートリアル
###########################

このチュートリアルは簡単なブックマークのためのアプリケーション (bookmarker) を作ります。
はじめに CakePHP のインストールを行い、データベースの作成、
そしてアプリケーションを素早く仕上げるための CakePHP が提供するツールを使います。

必要なもの:

#. データベースサーバ。このチュートリアルでは MySQL サーバを使います。
   データベースを作成するための SQL の知識が必要です。CakePHP は、それを前提としています。
   MySQL を使用するとき、 PHP で ``pdo_mysql`` が有効になっていることを確認してください。
#. 基礎的な PHP の知識。

始める前に、最新の PHP バージョンであることを確認してください。

.. code-block:: bash

    php -v

最低でも PHP |minphpversion| (CLI) 以上をインストールしてください。
あなたのウェブサーバーの PHP バージョンもまた、|minphpversion| 以上でなければなりません。そして、
コマンドラインインターフェース (CLI) の PHP バージョンと同じバージョンがベストです。
完全なアプリケーションを確認したい場合、 `cakephp/bookmarker
<https://github.com/cakephp/bookmarker-tutorial>`__ をチェックアウトしてください。
さあ、はじめましょう!

CakePHP の取得
==============

最も簡単な CakePHP のインストール方法は Composer を使う方法です。Composer は、
ターミナルやコマンドラインプロンプトから CakePHP をインストールのシンプルな方法です。
まだ準備ができていない場合、最初に Composer をダウンロードとインストールが必要です。
cURL をインストールされていたら、以下のように実行するのがが簡単です。 ::

    curl -s https://getcomposer.org/installer | php

もしくは `Composer のウェブサイト <https://getcomposer.org/download/>`_
から ``composer.phar`` をダウンロードすることができます。

そして、CakePHP アプリケーションのスケルトンを **bookmarker** ディレクトリにインストールするために、
インストールディレクトリからターミナルに以下の行をシンプルにタイプしてください。 ::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

`Composer Windows Installer <https://getcomposer.org/Composer-Setup.exe>`_
をダウンロードして実行した場合、インストールディレクトリ (例えば、 C:\\wamp\\www\\dev\\cakephp3)
からターミナルに以下の行をタイプしてください。 ::

    composer self-update && composer create-project --prefer-dist cakephp/app bookmarker

Composer を使うメリットは、 正しいファイルパーミッションの設定や、 **config/app.php**
ファイルの作成などのように、自動的に完全なセットアップをしてくれることです。

CakePHP をインストールする他の方法があります。 Composer を使いたくない場合、
:doc:`/installation` セクションをご覧ください.

CakePHP のダウンロードやインストール方法にかかわらず、いったんセットアップが完了すると、
ディレクトリ構成は以下のようになります。 ::

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

CakePHP のディレクトリ構造がどのように働くかを学ぶのにいい機会かもしれません。
:doc:`/intro/cakephp-folder-structure` セクションをご覧ください。

インストールの確認
===================

デフォルトホームページを確認することで、インストールが正しいことをざっと確かめることができます。
その前に、開発用サーバを起動する必要があります。 ::

    bin/cake server

.. note::

    Windows では、このコマンドは ``bin\cake server`` (バックスラッシュ) です。.

これで、 8765 ポートで PHP のビルドインウェブサーバーが起動します。ウェルカムページを見るために
**http://localhost:8765** をウェブブラウザーで開いてください。CakePHP がデータベース接続が
可能かどうか以外は、すべての確認事項がチェック済みになるべきです。そうでなければ、PHP 拡張の
追加のインストールやディレクトリのパーミッション設定が必要かもしれません。

データベースの作成
===================

次に、ブックマークアプリケーションのデータベースをセットアップしましょう。
まだセットアップしていない場合、例えば ``cake_bookmarks`` のように、あなたの好きな名前で、
このチュートリアルで使用する空のデータベースを作成してください。必要なテーブルを作成するために、
以下の SQL を実行することができます。 ::

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

複合主キーを持つ ``bookmarks_tags`` テーブルにお気づきでしょうか。CakePHP は、
ほぼどこでも複合主キーをサポートします。それは、マルチテナントなアプリケーションの構築が
しやすくなります。

私たちが使用するテーブルやカラムの名前は恣意的ではありませんでした。CakePHP の
:doc:`命名規則 </intro/conventions>` を使用することによって、CakePHP がより効果的になり、
フレームワークの設定を避けられます。CakePHP はレガシーなデータベーススキーマに対応できるくらい
十分に柔軟ですが、規約に従うことで、時間を節約できます。

データベースの設定
===================

次に、どこにデータベースあるか、そしてどうやってテータベースに接続するかを CakePHP
に伝えましょう。おそらく、これが何らかの設定が必要となる最初で最後です。

この設定はとても単純です。あなたのセットアップを適用するために **config/app.php**
ファイルの中の ``Datasources.default`` 配列の値を置き換えてください。
完全な設定配列の例は、以下のようになります。 ::

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


１度 **config/app.php** ファイルを保存して、 'CakePHP is able to connect to the database'
がチェック済みであることを確認してください。

.. note::

    CakePHP のデフォルト設定ファイルは **config/app.default.php** にあります。

Scaffold コードの生成
=====================

データベースが CakePHP の命名規則に従っているので、 基本的なアプリケーションを
素早く生成するために :doc:`bake コンソール </bake/usage>` アプリケーションが使用できます。
コマンドライン上で、以下のコマンドを実行してください。 ::

    // Windows 上では、代わりに bin\cake を使用する必要があります。
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

これは、 users、 bookmarks、 tags リソースのためのコントローラ、モデル、ビュー、
それらに対応するテストケース、フィクスチャを生成します。あなたのサーバが停止している場合、
再起動して **http://localhost:8765/bookmarks** に行ってください。

アプリケーションのデータベーステーブルへのデータアクセスを提供する基本的だが機能的な
アプリケーションを見てください。１度、ブックマーク一覧を表示して、いくつかの
ユーザー、ブックマーク、タグを追加してください。

.. note::

    Not Found (404) ページが表示された場合、Apache の mod_rewrite モジュールが
    ロードされているか確かめてください。

パスワードハッシュを追加
========================

(**http://localhost:8765/users** にアクセスして)
ユーザーを作成した時、パスワードが平文で保存されることにおそらく気づくでしょう。
これはセキュリティの観点から、とても良くありませんので修正しましょう。

これはまた、CakePHP のモデル層について説明する良い機会です。CakePHP では、
オブジェクトの集合と、異なるクラスの単一オブジェクトを操作する方法を分けてます。
エンティティの集合は、 ``Table`` クラス内に格納され、１つのレコードに属する機能は、
``Entity`` クラス内に格納されます。

例えば、パスワードのハッシュ化は、個々のレコードで行われ、エンティティオブジェクトに
この振る舞いを実装します。パスワードがセットされるたびにハッシュ化したいので、
ミューテーターメソッドやセッターメソッドを使います。CakePHP は規約に基づいて、
エンティティの一つにプロパティをセットするセッターメソッドを呼びます。
では、パスワードのためのセッターを追加してみましょう。 **src/Model/Entity/User.php** に
以下を追加してください。 ::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // この行を追加してください
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // bake で生成されたコード

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

今から既存のユーザのパスワードを更新してくだい。パスワードを変更した際、一覧もしくは詳細ページで、
入力した値の代わりにハッシュ化されたパスワードがあることを確認してください。CakePHP は、
デフォルトで `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_
を使ってパスワードをハッシュ化します。既存のデータベースが動作している場合、 sha1 や md5 も
使用できます。

.. note::

      パスワードがハッシュ化されない場合、セッター関数の命名について、
      クラスのパスワードメンバーと大文字小文字が同じかを確認してください。

タグを指定してブックマークを取得
=================================

これで、パスワードを安全に保存できますので、アプリケーションにもっと面白い機能を構築できます。
一度ブックマークのコレクションを蓄えて、タグでの検索ができるようになると便利です。
次は、タグでのブックマークを検索するため、ルート、コントローラのアクション、finder
メソッドを実装します。

理想的には、 **http://localhost:8765/bookmarks/tagged/funny/cat/gifs**
のような URL にしたいと思います。この URL は、 'funny', 'cat', もしくは 'gifs'
タグが付いたブックマークすべてを検索することを意図しています。これを実装する前に、
新しいルートを追加します。 **config/routes.php** を以下のようにしてください。 ::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // 新しいルートを　tagged アクションのために追加します。
    // 末尾の `*` は、渡された引数を持っていることを
    // CakePHP に伝えます。
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // デフォルトのホームと /pages/* ルートへの接続
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // デフォルトのルートへ接続
        $routes->fallbacks();
    });

上記は、 **/bookmarks/tagged/** パスを ``BookmarksController::tags()`` に接続する
新しい「ルート」を定義します。ルートを定義することによて、 URL の見た目と、
それらどのように実装されたかを分離することができます。
**http://localhost:8765/bookmarks/tagged** にアクセスした場合、CakePHP から
コントローラのアクションがないことを伝える役に立つエラーページが表示されます。
今から存在しないメソッドを実装してみましょう。 **src/Controller/BookmarksController.php**
に以下を追加してください。 ::

    public function tags()
    {
        // CakePHP によって提供された 'pass' キーは全ての
        // リクエストにある渡された URL のパスセグメントです。
        $tags = $this->request->getParam('pass');

        // タグ付きのブックマークを探すために BookmarksTable を使用
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // ビューテンプレートに変数を渡します
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

リクエストデータの他の部分にアクセスするためには :ref:`cake-request` セクションを
参考にしてください。

Finder メソッドの作成
----------------------

CakePHP では、コントローラのアクションをスリムに保ち、アプリケーションの多くのロジックを
モデルに置くことをお勧めします。 **/bookmarks/tagged** の URL にアクセスした場合、
``findTagged()`` メソッドがまだ実装されていないエラーが表示されます。
**src/Model/Table/BookmarksTable.php** に以下を追加してください。 ::

    // $query 引数は、クエリービルダーのインスタンスです。
    // $options 配列には、コントローラのアクション中で find('tagged') に渡した
    // 'tag' オプションが含まれます。
    public function findTagged(Query $query, array $options)
    {
        $bookmarks = $this->find()
            ->select(['id', 'url', 'title', 'description']);

        if (empty($options['tags'])) {
            $bookmarks->leftJoinWith('Tags', function ($q) {
                return $q->where(['Tags.title IS ' => null]);
            });
        } else {
            $bookmarks->innerJoinWith('Tags', function ($q) use ($options) {
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
        }

        return $bookmarks->group(['Bookmarks.id']);
    }

:ref:`カスタム Finder メソッド <custom-find-methods>` を実装しました。
これは、再利用可能なクエリーをまとめることを実現する CakePHP の非常に強力な概念です。
Finder メソッドは、常に :doc:`/orm/query-builder` オブジェクトとオプション配列を
パラメータとして取得します。Finder メソッドは、クエリーを操作し、任意の必須条件や抽出条件を
追加することができます。完了時、Finder メソッドは更新されたクエリーオブジェクトを
返さなければなりません。finder の中で、'matching' タグを持つ特定のブックマークを
検索するために ``distinct()`` や ``matching()`` メソッドを使います。 ``matching()``
メソッドは、引数としてクエリービルダーを受け取る `無名関数
<http://php.net/manual/ja/functions.anonymous.php>`_ を受け付けます。
コールバック内でクエリービルダーを特定のタグを持つブックマークをフィルターするための
条件を定義するために使います。

ビューの作成
-------------

**/bookmarks/tagged** の URL にアクセスすると、 CakePHP は、ビューファイルがないことを
知らせるエラーを表示します。次に、ビューファイルを ``tags()`` アクションのために作りましょう。
**src/Template/Bookmarks/tags.ctp** に以下の内容を追加します。 ::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
        </article>
    <?php endforeach; ?>
    </section>

上記のコードは :doc:`/views/helpers/html` と :doc:`/views/helpers/text` を
ビューの出力生成を補助するために使いました。また、 HTMLエンコード出力するために
:php:func:`h` ショートカット関数を使いました。HTML インジェクション問題を防ぐために
ユーザーデータ出力時には、必ず ``h()`` を使用することを覚えておいて下さい。

ビューテンプレートファイルのための CakePHP の規約に従って **tags.ctp** ファイルを作りました。
この規約は、小文字を使い、コントローラのアクション名をアンダースコア化したテンプレート名にすることです。

ビューで ``$tags`` や ``$bookmarks`` 変数を使えることにお気づきでしょう。
コントローラで ``set()`` メソッドを使って、指定した変数をビューに送るためにセットします。
ビューは、渡されたすべての変数をテンプレート内でローカル変数として利用可能にします。

**/bookmarks/tagged/funny** の URL にアクセスできるようにして、
全ての 'funny' でタグ付けされたブックマークを確認しましょう。

ここまで、ブックマーク、タグ、ユーザーを管理する基本的なアプリケーションを作成してきました。
しかしながら、全員のタグが全員に見えてしまいます。次の章では、認証を実装し、現在のユーザーに
属するブックマークのみを表示するよう制限します。

あなたのアプリケーションの構築を続けるために
:doc:`/tutorials-and-examples/bookmarks/part-two` を読み続けるか、
CakePHP で出来ることをより詳しく学ぶために
:doc:`ドキュメントの中に飛び込んで </topics>` ください。
