CMS チュートリアル - データベース作成
#####################################

先ほどは CakePHP をインストールしましたので、 :abbr:`CMS (Content Management System)`
アプリケーションのためのデータベースをセットアップしましょう。まだセットアップしていない場合、
例えば ``cake_cms`` のように、あなたの好きな名前で、このチュートリアルで使用する空のデータベースを
作成してください。必要なテーブルを作成するために、以下の SQL を実行することができます。 ::

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'sekret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());

複合主キーを持つ ``articles_tags`` テーブルにお気づきでしょうか。CakePHP は、
ほぼどこでも複合主キーをサポートしているので、追加の ``id`` カラムを必要としない
単純なスキーマを持つことができます。

私たちが使用するテーブルやカラムの名前は恣意的ではありませんでした。CakePHP の
:doc:`命名規則 </intro/conventions>` を使用することによって、CakePHP がより効果的になり、
フレームワークの設定を避けられます。CakePHP は、ほぼ全てのデータベーススキーマに対応できるくらい
十分に柔軟ですが、CakePHP がデフォルトで提供する規約に従うことで、時間を節約できます。

データベースの設定
===================

次に、どこにデータベースあるか、そしてどうやってテータベースに接続するかを CakePHP
に伝えましょう。あなたのセットアップを適用するために **config/app.php**
ファイルの中の ``Datasources.default`` 配列の値を置き換えてください。
完全な設定配列の例は、以下のようになります。 ::

    <?php
    return [
        // 上には他の設定があります
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'encoding' => 'utf8mb4',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // 下には他の設定があります
    ];

一度 **config/app.php** ファイルを保存して、 'CakePHP is able to connect to the database'
が緑色のコック帽であることを確認してください。

.. note::

    CakePHP のデフォルト設定ファイルの複製は **config/app.default.php** にあります。

最初のモデルの作成
========================

モデルは、CakePHP アプリケーションの心臓部です。データを読んだり変更することができます。
それらは、データ間のリレーションの構築、データの検証、アプリケーションルールの適用をすることができます。
モデルは、コントローラーアクションとテンプレートを構築するために必要な基礎を構築します。

CakePHP のモデルは ``Table`` と ``Entity`` オブジェクトで構成されています。 ``Table``
オブジェクトは、指定されたテーブルの中に保存されたエンティティーの集合へのアクセスを提供します。
それらは **src/Model/Table** の中に保存されます。私たちが作成するファイルは、
**src/Model/Table/ArticlesTable.php** に保存されます。完成したファイルは次のようになります。 ::

    <?php
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

このテーブルの ``create`` や ``modified`` カラムを自動的に更新する
:doc:`/orm/behaviors/timestamp` ビヘイビアーを追加しました。
Table オブジェクトを ``ArticlesTable`` と名付けることで、CakePHP は、命名規則により
``articles`` テーブルを使用するモデルであると解釈します。また、CakePHP は、
``id`` カラムがテーブルの主キーであると解釈する規約を使用します。

.. note::

    もし一致するファイルが **src/Model/Table** に見つけられなければ、CakePHP は動的に
    モデルオブジェクトを生成します。これはまた、不意に間違ったファイル名 (例えば、
    articlestable.php や ArticleTable.php) をつけると、CakePHP はどの設定も認識できず、
    代わりに生成されたモデルを使うことになるということも意味します。

また、Articles のための Entity クラスも作成します。エンティティーは、
データベースの１つのレコードを表し、データに対して行レベルの振る舞いを提供します。
このエンティティーは、 **src/Model/Entity/Article.php** に保存されます。
完成したファイルは、次のようになります。 ::

    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

エンティティーは、今はとてもスリムです。そして、 :ref:`entities-mass-assignment` によって
どのようにプロパティーを変更できるかを制御するプロパティー ``_accessible`` をセットアップしました。

このモデルは、今は動きませんが、次は最初の
:doc:`コントローラーとテンプレート </tutorials-and-examples/cms/articles-controller>`
を作成し、このモデルとのやりとりができるようにします。
