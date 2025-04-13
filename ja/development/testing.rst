テスト
#######

.. todo:: (Japanese) このファイルは https://github.com/cakephp/docs/pull/7813 においてCIのエラーを回避するために修正されましたが、きちんと翻訳が更新された訳ではありません。翻訳を頑張りましょう。

CakePHP には `PHPUnit <https://phpunit.de>`_ をベースとした高度なインテグレーションが組み込まれており、PHPUnit 本体が持つ機能に加えて、CakePHPでテストをスマートに管理するための便利な拡張機能を備えています。このセクションでは、PHPUnit のインストールからユニットテストの
始め方、そしてCakePHP が提供する拡張機能について説明します。

PHPUnit のインストール
======================

CakePHP のテストフレームワークは PHPUnit をベースとしています。PHPUnit は PHP ユニットテストフレームワークのデファクトスタンダードであり、思いどおりのコードを安全に書くための豊富な機能を提供します。
PHPUnit は `Composer <https://getcomposer.org>`_ または `PHAR パッケージ <https://phpunit.de/#download>`__
のいずれかを使用してインストールできます。

Composer による PHPUnit のインストール
--------------------------------------

Composer で PHPUnit をインストールする場合:

.. code-block:: console

    $ php composer.phar require --dev phpunit/phpunit:"^8.5"

コマンドラインで上記のように実行すると、 ``composer.json`` の ``require-dev`` セクションに
依存関係を追加し、すべての依存関係と一緒に PHPUnit をインストールします。

これで、PHPUnit を以下のように実行することができます。

.. code-block:: console

    $ vendor/bin/phpunit

PHAR ファイルを使用する場合
----------------------------------

**phpunit.phar** ファイルをダウンロードすると、テストを実行するために使用することができます。

.. code-block:: console

    php phpunit.phar

.. tip::

    次のようにすると、都合よく phpunit.phar をグローバルに Unix や Linux で利用できます。

    .. code-block:: shell

          chmod +x phpunit.phar
          sudo mv phpunit.phar /usr/local/bin/phpunit
          phpunit --version

    `Windows 上で PHPUnit の PHAR をグローバルにインストールする方法 <https://phpunit.de/manual/current/ja/installation.html#installation.phar.windows>`__
    に関する手順については、PHPUnit のドキュメントを参照してください。

テスト用データベースのセットアップ
==================================

テストを実行する前に **config/app.php** ファイルで debug が有効になっていることを
忘れないでください。テストを実行する前に **config/app.php** に ``test`` データソース設定を
追加する必要があります。この設定は、CakePHP でフィクスチャーのテーブルとデータのために使用されます。 ::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'username' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database'
        ],
    ],

.. note::

    トラブルを防ぐため、テストデータベースはメインのデータベースとは別に用意することをお勧めします。

テストのセットアップの確認
==========================

PHPUnit をインストールして ``test`` データソースを設定した後、 独自のテストを作成し
実行する準備ができていることを、アプリケーションのテストを実行することにより確認できます。

.. code-block:: console

    # phpunit.phar について
    $ php phpunit.phar

    # Composer でインストールされた phpunit
    $ vendor/bin/phpunit

上記を実行するとテストが実行されます(テストが作成されている場合)。

特定のテストを実行したい場合は、パラメーターとしてテストのパスを指定します。
例えば、ArticlesTable クラスのテストケースがある場合、次のように実行します。

.. code-block:: console

    $ vendor/bin/phpunit tests/TestCase/Model/Table/ArticlesTableTest

実行したテストや成功したテスト・失敗したテストの数など、 各種情報がカラーで表示されます。

.. note::

    Windows システムの場合、おそらくカラー表示はされません。

テストケースの規約
==================

CakePHP が全般的にそうであるように、テストケースにもいくつか規約があります。
以下のとおりです。

#. テストを含むPHPファイルは、 ``tests/TestCase/[Type]`` ディレクトリーに置きます。
#. ファイル名のサフィックスは .php ではなく **Test.php** とします。
#. テストを含むクラスは ``Cake\TestSuite\TestCase`` 、 ``Cake\TestSuite\IntegrationTestCase`` または ``\PHPUnit\Framework\TestCase`` を継承する必要があります。
#. 他のクラス名と同様に、テストケースのクラス名はファイル名と一致する必要があります。
   **RouterTest.php** は、 ``class RouterTest extends TestCase`` が含まれている必要があります。
#. テストを含むメソッド (つまり、アサーションを含むメソッド) の名前は ``testPublished()`` のように ``test`` で始める必要があります。 ``@test`` というアノテーションをメソッドにマークすることでテストメソッドとすることもできます。

最初のテストケースを作成
==========================

一例として、とても簡単な、ヘルパーメソッドのためのテストケースを作成します。
これからテストのために作成するメソッドは HTML でプログレスバーを描画するものです。
ヘルパーは次のようになります。 ::

    namespace App\View\Helper;

    use Cake\View\Helper;

    class ProgressHelper extends Helper
    {
        public function bar($value)
        {
            $width = round($value / 100, 2) * 100;

            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

作成したヘルパーを保存したら、 **tests/TestCase/View/Helper/ProgressHelperTest.php**
としてテストケースのファイルを作成します。このファイルにまず、以下のように書き込みます。::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase
    {
        public function setUp(): void
        {
        }

        public function testBar(): void
        {
        }
    }

空のメソッドが2つあります。次にメソッドの中身を書きます。最初は ``setUp()`` です。
このメソッドはこのテストケースクラスのテストメソッドが 呼び出される前に毎回呼び出されます。
セットアップメソッドはテストに必要なオブジェクトの初期化や設定を行います。
今回のセットアップメソッドには次のように書き加えます。 ::

    public function setUp(): void
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

親メソッドを必ずロードしてください。 ``TestCase::setUp()`` は、
:php:class:`~Cake\\Core\\Configure` の値をバックアップしたり、
:php:class:`~Cake\\Core\\App` にパスを保存したりといった、いくつかの作業をしているからです。

次に、テストメソッドの内容を記述します。期待した結果を
出力できるかどうかをテストするため「アサーション」を使います。 ::

    public function testBar(): void
    {
        $result = $this->Progress->bar(90);
        $this->assertStringContainsString('width: 90%', $result);
        $this->assertStringContainsString('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertStringContainsString('width: 33%', $result);
    }

``assertStringContainsString()`` というアサーションを用いることで、ヘルパーが返した値に期待した文字列が
含まれていることをテストできます。期待した文字列が含まれていなければテストは失敗し、
コードが正しくないことがわかります。

テストケースを使うことにより、 既知の入力セットと期待される出力結果との関係を 簡単に記述することが
できます。つまり、書いたコードが期待した動作を満たしているかどうかを自動的にテストできます。これにより、新たなバグの発生を未然に検知し、私達は自信を持って開発を進めていくことができるようになります。

.. note::

    EventManager は、各テストメソッドごとにリフレッシュされます。
    これは、一度に複数のテストを実行した際、ブートストラップは一度だけ実行されるため、
    config/bootstrap.php に登録されたイベントリスナーは失われることを意味します。

.. _running-tests:

テストの実行
============

PHPUnit をインストールし、テストケースをいくつか書いたら、テストを何度も実行したくなるでしょう。
すべての変更をコミットする前に、何も壊れていないことを確認するために、テストを実行することを
お勧めします。

``phpunit`` を使うことで、アプリケーションのテストを実行できます。
アプリケーションのテストを実行するには、シンプルに実行することができます。

.. code-block:: console

    # composer でインストールされたファイルを実行する場合
    vendor/bin/phpunit

    # phar 形式のファイルを実行する場合
    php phpunit.phar

`GitHub から CakePHP ソース <https://github.com/cakephp/cakephp>`__ をクローンして
CakePHP のユニットテストを実行したい場合、 ``phpunit`` を実行する前に、すべての依存関係が
インストールされているように、以下の ``Composer`` コマンドを実行することを忘れないでください。

.. code-block:: console

    composer install

アプリケーションのルートディレクトリーから以下を行います。アプリケーションのソースの一部である
プラグインのテストを実行するには、まず ``cd`` でプラグインディレクトリーに移動し、その後、
PHPUnit のインストール方法に合わせて ``phpunit`` コマンドを使用してください。

.. code-block:: console

    cd plugins

    # composer でインストールされた phpunit を使用
    ../vendor/bin/phpunit

    # phar 形式のファイルを使用
    php ../phpunit.phar

スタンドアロンのプラグインのテストを実行するには、最初に別のディレクトリーにプロジェクトを
インストールして、その依存関係をインストールする必要があります。

.. code-block:: console

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    php ~/phpunit.phar

テストケースのフィルタリング
----------------------------

たくさんのテストケースがあると、その中からサブセットだけをテストしたいときや、失敗したテストだけを
実行したいときがあると思います。コマンドラインからテストメソッドをフィルタリングするときはオプションを
使用します。

.. code-block:: console

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

テストメソッドを実行するためフィルタリングとして、filter パラメーターは大文字と小文字を区別する
正規表現を使用します。

コードカバレッジの生成
----------------------

PHPUnit に組み込まれたコードカバレッジツールを用いて、コードカバレッジのレポートを
HTML ファイル形式で生成することができます。
テストケースのカバレッジを生成するには以下のようにします。

.. code-block:: console

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

カバレッジ結果のHTMLファイルは、アプリケーションの webroot ディレクトリー内に生成されます。
``http://localhost/your_app/coverage`` にアクセスすると、結果を表示することができます。

また、カバレッジを生成するために xdebug の代わりに
``phpdbg`` を使用できます。カバレッジの生成は ``phpdbg`` の方が高速です。

.. code-block:: console

    $ phpdbg -qrr phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

プラグインテストのためのテストスイート
----------------------------------------------

アプリケーションは、複数のプラグインで構成されることもあります。
各プラグインのテストは手間がかかるものですが、アプリケーションの **phpunit.xml.dist**
ファイルに ``<testsuite>`` セクションを追加すると、アプリケーションを構成する各プラグインの
テストを手軽に実行することができます。

.. code-block:: xml

    <testsuites>
        <testsuite name="app">
            <directory>./tests/TestCase/</directory>
        </testsuite>

        <!-- Add your plugin suites -->
        <testsuite name="forum">
            <directory>./plugins/Forum/tests/TestCase/</directory>
        </testsuite>
    </testsuites>

``phpunit`` を使用すると、 ``<testsuites>`` 要素に追加されたテストスイートは自動的に実行されます。

もし、 composer でインストールされたプラグインのフィクスチャーを使用するために
``<testsuites>`` を使用している場合、プラグインの ``composer.json`` ファイルに
フィクスチャーの名前空間を autoload セクションに追加してください。例::

    "autoload-dev": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests/Fixture/"
        }
    },

テストケースのライフサイクルコールバック
========================================

テストケースは以下のようにいくつかのライフサイクルコールバックを持っており、
テストの際に使うことができます。

* ``setUp`` は、テストメソッドの前に毎回呼び出されます。
  テストされるオブジェクトの生成や、テストのためのデータの初期化に使われます。
  ``parent::setUp()`` を呼び出すことを忘れないでください。
* ``tearDown`` は、テストメソッドの後に毎回呼び出されます。
  テストが完了した後のクリーンアップに使われます。
  ``parent::tearDown()`` を呼び出すことを忘れないでください。
* ``setupBeforeClass`` はクラスのテストメソッドを実行する前に一度だけ呼ばれます。
  このメソッドは *static* でなければなりません。
* ``tearDownAfterClass`` はクラスのテストメソッドをすべて実行した後に一度だけ呼ばれます。
  このメソッドは *static* でなければなりません。

.. _test-fixtures:

フィクスチャー
==============

テストコードの挙動がデータベースやモデルに依存するとき、テストに使うためのテーブルを生成し、
一時的なデータをロードするために **フィクスチャー** を使うことができます。
フィクスチャーを使うことにより、 実際のアプリケーションに使われているデータを破壊することなく
テストができるというメリットがあります。 また、アプリケーションのためのコンテンツを実際に用意するより
先にコードをテストすることができます。

このとき、CakePHP は設定ファイル **config/app.php** にある ``test`` という名前の
データベース接続設定を使います。この接続が使えないときは例外が発生し、フィクスチャーを使うことが
できません。

CakePHP はフィクスチャーに基づいたテストケースを実行するにあたり、以下の動作をします。

#. 各フィクスチャーで必要なテーブルを作成します。
#. フィクスチャーにデータが存在すれば、それをテーブルに投入します。
#. テストメソッドを実行します。
#. フィクスチャーのテーブルを空にします。

テスト接続
----------

デフォルトでは、CakePHP のアプリケーション内の各データベース接続は別名になります。
アプリケーションのブートストラップで定義された (``test_`` がつかない) 各データベース接続は、
``test_`` プレフィクスがついた別名を持つことになります。テストケースで誤って間違った接続を
使用しないことを、エイリアシングの接続が保証します。接続エイリアシングは、アプリケーションの
残りの部分には透過的です。例えば 'default' コネクションを使用している場合、
代わりに、テストケースで ``test`` コネクションを取得します。 'replica' コネクションを使用する場合、テストスイートは 'test_replica' を使おうとします。

.. _fixture-phpunit-configuration:

PHPUnitの設定
---------------

フィクスチャーを使う前に、 ``phpunit.xml`` にフィクスチャExtensionが含まれていることを再確認する必要があります。

.. code-block:: xml

    <!-- in phpunit.xml -->
    <!-- Setup the extension for fixtures -->
    <extensions>
        <extension class="\Cake\TestSuite\Fixture\PHPUnitExtension" />
    </extensions>

※CakePHP 4.3.0より以前はPHPUnitのフィクスチャExtensionではなくテストリスナー機能が使用されていたため、phpunit.xmlには下記のように書く必要があります。

.. code-block:: xml

    <!-- in phpunit.xml -->
    <!-- Setup a listener for fixtures -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

※リスナーは非推奨であり、フィクスチャ構成を更新する必要があります。

.. _creating-test-database-schema:

テスト用のデータベーススキーマ作成
-------------------------------------

CakePHPのマイグレーション機能・SQLダンプファイルのロード、または他のスキーマ管理ツールを使用して、テスト用のデータベーススキーマを生成できます。アプリケーションの ``tests/bootstrap.php`` ファイルにスキーマを作成する必要があります。

CakePHPの `migrations プラグイン <https://book.cakephp.org/migrations>` を使用してアプリケーションのスキーマを管理する場合は、
それらのマイグレーションを利用してテストデータベーススキーマを
生成することもできます。::

    // in tests/bootstrap.php
    use Migrations\TestSuite\Migrator;

    $migrator = new Migrator();

    // Simple setup for with no plugins
    $migrator->run();

    // Run migrations for multiple plugins
    $migrator->run(['plugin' => 'Contacts']);

    // Run the Documents migrations on the test_docs connection.
    $migrator->run(['plugin' => 'Documents', 'connection' => 'test_docs']);


複数のマイグレーションを実行する必要がある場合は、次のように実行できます。::

    // Run migrations for plugin Contacts on
    $migrator->runMany([
        // Run app migrations on test connection.
        ['connection' => 'test']
        // Run Contacts migrations on test connection.
        ['plugin' => 'Contacts'],
        // Run Documents migrations on test_docs connection.
        ['plugin' => 'Documents', 'connection' => 'test_docs']
    ]);

``runMany()`` を使うと、データベースを共有するプラグインが、各マイグレーションが実行される時にテーブルをドロップしないようになります。

マイグレーションプラグインは、適用されていないマイグレーションのみを実行し、カレントのマイグレーションヘッドが適用されたマイグレーションと異なる場合はマイグレーションをリセットします。

データソース構成のテストでマイグレーションを実行する方法を構成することもできます。詳細については、 :doc:`マイグレーションに関するドキュメント </migrations>` を参照してください。

SQLダンプファイルをロードしたい場合は、下記のメソッドを使用できます。::

    // in tests/bootstrap.php
    use Cake\TestSuite\Fixture\SchemaLoader;

    // Load one or more SQL files.
    (new SchemaLoader())->loadSqlFiles('path/to/schema.sql', 'test');

各テスト実行の ``SchemaLoader`` 開始時に、コネクションに紐づく全のテーブルを削除し、提供されたスキーマファイルに基づいてテーブルを再構築します。

.. versionadded:: 4.3.0
    SchemaLoaderが追加されました。

.. _fixture-state-management:

フィクスチャステートマネージャ
-------------------------------------

デフォルトでは、CakePHPは、データベース内のすべてのテーブルを truncate することにより、各テストの最後にフィクスチャの状態をリセットします。この処理は、アプリケーションが大きくなるにつれてコストがかかる可能性があります。 ``TransactionStrategy`` を各テストメソッドに使用すると、テストの最後にロールバックされるトランザクション内で実行されます。これによりパフォーマンスが向上しますが、各テストの前に自動インクリメント値がリセットされないため、テストで静的フィクスチャデータに大きく依存しないようにする必要があります。

フィクスチャの状態管理は、テストケース内で定義できます。::

    use Cake\TestSuite\TestCase;
    use Cake\TestSuite\Fixture\FixtureStrategyInterface;
    use Cake\TestSuite\Fixture\TransactionStrategy;

    class ArticlesTableTest extends TestCase
    {
        /**
         * Create the fixtures strategy used for this test case.
         * You can use a base class/trait to change multiple classes.
         */
        protected function getFixtureStrategy(): FixtureStrategyInterface
        {
            return new TransactionStrategy();
        }
    }

.. versionadded:: 4.3.0

フィクスチャーの作成
--------------------

フィクスチャは、テストのためにデータベースに挿入されるレコードを定義します。

それでは最初のフィクスチャーを作成してみましょう。この例ではArticleモデルのフィクスチャーを作成します。
以下の内容で、 **tests/Fixture** ディレクトリーに **ArticlesFixture.php** という名前のファイルを
作成してください。 ::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
          // (オプション) 異なるテストデータソースにフィクスチャーをロードするために、このプロパティーを設定
          public $connection = 'test';

          public $records = [
              [
                  'title' => 'First Article',
                  'body' => 'First Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:39:23',
                  'modified' => '2007-03-18 10:41:31'
              ],
              [
                  'title' => 'Second Article',
                  'body' => 'Second Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:41:23',
                  'modified' => '2007-03-18 10:43:31'
              ],
              [
                  'title' => 'Third Article',
                  'body' => 'Third Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:43:23',
                  'modified' => '2007-03-18 10:45:31'
              ]
          ];
     }

.. note::

    autoincrementカラムに手動で値を追加しないことをお勧めします。PostgreSQLおよびSQLServerでのシーケンス生成に干渉するためです。

``$connection`` プロパティは、フィクスチャーが使用するデータソースを定義します。アプリケーションが
複数のデータソースを使用している場合、フィクスチャーはモデルのデータソースと一致しますが、 ``test_``
プレフィックスを付ける必要があります。例えば、お使いのモデルが ``mydb`` データソースを使用している場合、
フィクスチャーは、 ``test_mydb`` データソースになります。
``test_mydb`` 接続が存在しない場合、モデルはデフォルトの ``test`` データソースを使用します。
テストを実行するときにテーブル名の衝突を避けるため、フィクスチャーのデータソースには ``test``
のプレフィックスが必ず付きます。

フィクスチャテーブルの作成後に入力される一連のレコードを定義できます。 ``$records`` はレコードの配列データです。 ``$records`` 内の各項目は単一の行である必要があります。各行の中には、行の列と値の連想配列が必要です。複数レコードを一括挿入する際に用いる ``$records`` 配列内の各レコードは、同じキー構成が必要であることに注意してください。

.. versionchanged:: 4.3.0

    4.3.0より前のフィクスチャは、テーブルのスキーマも定義していました。フィクスチャでスキーマを定義する必要がある場合は、fixture-schema を確認できます。

動的データ
--------------

フィクスチャレコードで関数またはその他の動的データを使用するには、フィクスチャの ``init()`` メソッドでレコードを定義できます。例えば、created と
modified のタイムスタンプに今日の日付を反映させたいのであれば、
以下のようにするとよいでしょう。::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
        public function init(): void
        {
            $this->records = [
                [
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'modified' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

.. note::
    ``init()`` をオーバーライドするときは、必ず ``parent::init()`` をコールしてください。

テストケースにフィクスチャを読み込む
----------------------------------------

各テストケースごとにフィクスチャを定義します。
クエリを実行するすべてのモデルのフィクスチャを
ロードする必要があります。
フィクスチャをロードするには、
モデルで ``$fixtures`` プロパティを定義します。::

    class ArticlesTest extends TestCase
    {
        protected $fixtures = ['app.Articles', 'app.Comments'];
    }


4.1.0以降、フィクスチャを定義するために ``getFixtures()`` メソッドを使うことができます。::

    public function getFixtures(): array
    {
        return [
            'app.Articles',
            'app.Comments',
        ];
    }

上記の例では、アプリケーションのFixtureディレクトリからArticleおよびCommentフィクスチャをロードします。

CakePHPコアまたはプラグインからフィクスチャをロードすることもできます。::

    class ArticlesTest extends TestCase
    {
        protected $fixtures = [
            'plugin.DebugKit.Articles',
            'plugin.MyVendorName/MyPlugin.Messages',
            'core.Comments'
        ];
    }

``core`` プレフィックスを使用すると、CakePHPコアからフィクスチャがロードされます。また、プラグイン名をプレフィックスとして使用すると、指定されたプラグインからフィクスチャがロードされます。

サブディレクトリを作成してフィクスチャを整理することができます。大規模なアプリケーションを使用している場合などに便利です。サブディレクトリ内のフィクスチャをロードするには、フィクスチャ名にサブディレクトリ名を含めるだけです。::

    class ArticlesTest extends CakeTestCase
    {
        protected $fixtures = ['app.Blog/Articles', 'app.Blog/Comments'];
    }


上記の例では、各フィクスチャが ``tests/Fixture/Blog/`` ディレクトリからロードされます。

フィクスチャファクトリー
-------------------------------

アプリケーションが大規模になると、テストフィクスチャの量も肥大化し、システム全体の管理が困難になりがちです。`フィクスチャファクトリープラグイン  <https://github.com/vierge-noire/cakephp-fixture-factories>`_ は、大規模システム管理のための有効な解決手段です。

このプラグインは、各テストの前にすべてのダーティテーブルを切り捨てるために、 `テストスイートライトプラグイン <https://github.com/vierge-noire/cakephp-test-suite-light>`_ を使用します。

下記のcakeコマンドでフィクスチャファクトリーをbakeできます。::

    bin/cake bake fixture_factory -h


`ファクトリー <https://github.com/vierge-noire/cakephp-fixture-factories/blob/main/docs/factories.md>`_ のbakeが完了すると、すぐにテストフィクスチャを作成することができます。

データベースとの不要なインタラクションは、テストとアプリケーションの速度を低下させます。テストフィクスチャを永続化せずに作成できます。これは、DBとのインタラクションなしでメソッドをテストする場合に役立ちます。::

    $article = ArticleFactory::make()->getEntity();

永続化したい場合は下記のように。::

    $article = ArticleFactory::make()->persist();

ファクトリーは、関連するフィクスチャの生成にも役立ちます。記事が複数の著者に属していると仮定すると、
たとえば、それぞれ5つの記事を持つ2人の
著者を作成できます。::

    $articles = ArticleFactory::make(5)->with('Authors', 2)->getEntities();

フィクスチャファクトリはフィクスチャの作成または宣言を必要としません。それでも、それらはCakePHPに付属しているフィクスチャと完全に互換性があります。 `ここ <https://github.com/vierge-noire/cakephp-fixture-factories>`_ に追加の洞察とドキュメントがあります。

テストでルーティング設定を読み込む
------------------------------------------


メール送信・コントローラー・コンポーネント、
またはその他クラスのテストでURLを紐付ける必要がある場合は、
ルーティング設定を読み込む必要があります。 ``setUp()`` または
それぞれのテストメソッドの中で、 ``loadRoutes()`` を記述します::

    public function setUp(): void
    {
        parent::setUp();
        $this->loadRoutes();
    }

このメソッドは、 ``Application`` インスタンスの作成と、そのインスタンスでの ``routes()`` メソッドの呼び出しを行ないます。
この ``Application`` インスタンスのコンストラクタには、 ``loadRoutes($constructorArgs)`` としてパラメータを渡すことができます。

テストにおけるルーティングの作成
--------------------------------

プラグインや拡張性のあるアプリケーションを開発する場合など、 テスト内で動的にルートを追加することが必要になることがあります。
例えば、プラグインや拡張性のあるアプリケーションを開発する場合などです。

既存のアプリケーションのルートを読み込むのと同じように、これはテストメソッドの ``setup()`` の中で行うことができます。
で、あるいは個々のテストメソッド自身で行うことができます。::

    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Router;
    use Cake\TestSuite\TestCase;

    class PluginHelperTest extends TestCase
    {
        protected RouteBuilder $routeBuilder;

        public function setUp(): void
        {
            parent::setUp();

            $this->routeBuilder = Router::createRouteBuilder('/');
            $this->routeBuilder->scope('/', function (RouteBuilder $routes) {
                $routes->setRouteClass(DashedRoute::class);
                $routes->get(
                    '/test/view/{id}',
                    ['controller' => 'Tests', 'action' => 'view']
                );
                // ...
            });

            // ...
        }
    }

これは新しいルートビルダのインスタンスを作成し、接続されたルートをマージします。
を、他のすべてのルートビルダーインスタンスで使われる同じルートコレクションにマージします。
接続されたルートを、その環境に存在する、あるいはまだ作成されていない他のすべてのルートビルダーインスタンスで使用される同じルートコレクションにマージします。

プラグインをロード
------------------------

プラグインをロードしたい場合は ``loadPlugins()`` メソッドを使用できます。::

    public function testMethodUsingPluginResources()
    {
        $this->loadPlugins(['Company/Cms']);
        // Test logic that requires Company/Cms to be loaded.
    }

テーブルクラスのテスト
======================

**src/Model/Table/ArticlesTable.php** に ArticlesTable クラスが定義されているとします。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table
    {
        public function findPublished(Query $query, array $options): Query
        {
            $query->where([
                $this->alias() . '.published' => 1
            ]);

            return $query;
        }
    }

このテーブルクラスに対するテストを設定します。以下の内容で、
**tests/TestCase/Table** ディレクトリーに **ArticlesTableTest.php** というファイルを
作成してください。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.Articles'];
    }

このテストケースの ``$fixtures`` 変数に、使用したいフィクスチャーを設定します。
クエリーを実行するために要なフィクスチャーをすべて設定してください。

テストメソッドの作成
--------------------

次に、ArticlesTable の ``published()`` メソッドに対するテストを追加してみましょう。
**tests/TestCase/Model/Table/ArticlesTableTest.php** ファイルを次のように編集してください。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.Articles'];

        public function setUp(): void
        {
            parent::setUp();
            $this->Articles = $this->getTableLocator()->get('Articles');
        }

        public function testFindPublished(): void
        {
            $query = $this->Articles->find('published')->all();
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->enableHydration(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

``testFindPublished()`` というメソッドがあります。
``ArticlesTable`` クラスのインスタンスを作成した後、 ``find('published')``
メソッドを実行します。 ``$expected`` に、期待する適切な結果をセットします。
(article テーブルに配置されるレコードを定義します。) ``assertEquals()`` メソッドを使用して、
結果が期待どおりであることをテストします。テストケースを実行する方法の詳細については
:ref:`running-tests` セクションをご覧ください。

フィクスチャファクトリを使用する場合は、テストは次のようになります。
::

    namespace App\Test\TestCase\Model\Table;

    use App\Test\Factory\ArticleFactory;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public function testFindPublished(): void
        {
            // Persist 3 published articles
            $articles = ArticleFactory::make(['published' => 1], 3)->persist();
            // Persist 2 unpublished articles
            ArticleFactory::make(['published' => 0], 2)->persist();

            $result = ArticleFactory::find('published')->find('list')->toArray();

            $expected = [
                $articles[0]->id => $articles[0]->title,
                $articles[1]->id => $articles[1]->title,
                $articles[2]->id => $articles[2]->title,
            ];

            $this->assertEquals($expected, $result);
        }
    }

フィクスチャをロードする必要はありません。作成された5つの記事は、このテストにのみ存在します。staticメソッド ``::find()`` は、テーブル ``ArticlesTable`` やそのイベントを使用せずにデータベースを読み込みます。

モデルメソッドのモック化
------------------------

モデルメソッドのモックが必要になることが
あります。 ``getMockForModel`` を使用してtableクラスのテストモックを作成できます。
通常のモックが持つ反映されたプロパティーの
問題を回避します。 ::

    public function testSendingEmails(): void
    {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

``tearDown()`` メソッドの中でモックを削除してください。 ::

    TableRegistry::clear();

.. _integration-testing:

コントローラーの統合テスト
==========================

ヘルパー、モデル、およびコンポーネントと同様にコントローラーもテストできますが、
CakePHP では特別に ``IntegrationTestTrait`` トレイトを提供しています。コントローラーのテストケースに
このトレイトを用いると、レベルが高いテストが可能になります。

統合テストに不慣れな場合は、複数ユニットの一括テストを容易にするためのアプローチがあります。CakePHP の統合テスト機能は、アプリケーションによって処理される HTTP
リクエストをシミュレートします。例えば、コントローラーをテストすると、与えられたリクエストに関する
コンポーネント、モデル、そしてヘルパーを実行します。これはアプリケーションとその動作する部品の全てに、ハイレベルなテストを提供します。

典型的な ArticlesController、およびそれに対応するモデルがあるとします。
コントローラーのコードは次のようになります。 ::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function index($short = null)
        {
            if ($this->request->is('post')) {
                $article = $this->Articles->newEntity($this->request->getData());
                if ($this->Articles->save($article)) {
                    // PRG パターンのためリダイレクト
                    return $this->redirect(['action' => 'index']);
                }
            }
            if (!empty($short)) {
                $result = $this->Articles->find('all', [
                        'fields' => ['id', 'title']
                    ])
                    ->all();
            } else {
                $result = $this->Articles->find()->all();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

**tests/TestCase/Controller** ディレクトリーに **ArticlesControllerTest.php** という名前の
ファイルを作成し、内部に以下を記述してください。 ::

    namespace App\Test\TestCase\Controller;

    use Cake\TestSuite\IntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class ArticlesControllerTest extends TestCase
    {
        use IntegrationTestTrait;

        protected $fixtures = ['app.Articles'];

        public function testIndex(): void
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // さらにアサート
        }

        public function testIndexQueryData(): void
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // さらにアサート
        }

        public function testIndexShort(): void
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // さらにアサート
        }

        public function testIndexPostData(): void
        {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles', $data);

            $this->assertResponseSuccess();
            $articles = $this->getTableLocator()->get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

この例では、いくつかのリクエストを送信するメソッドと ``IntegrationTestTrait`` が提供するいくつかの
アサーションを示しています。任意のアサーションを行う前に、リクエストをディスパッチする必要が
あります。リクエストを送信するには、以下のいずれかのメソッドを使用することができます。

* ``get()`` GET リクエストを送信します。
* ``post()`` POST リクエストを送信します。
* ``put()`` PUT リクエストを送信します。
* ``delete()`` DELETE リクエストを送信します。
* ``patch()`` PATCH リクエストを送信します。
* ``options()`` OPTIONS リクエストを送信します。
* ``head()`` HEAD リクエストを送信します。

``get()`` と ``delete()`` を除く全てのメソッドは、リクエストボディーを送信することを
可能にする二番目のパラメーターを受け入れます。リクエストをディスパッチした後、ユーザのリクエストに対して
正しく動作したことを確実にするために ``IntegrationTestTrait`` や、PHPUnit が提供するさまざまな
アサーションを使用することができます。

リクエストの設定
----------------

``IntegrationTestTrait`` トレイトを使用すると、テスト対象のアプリケーションに送信するリクエストを
設定することが容易にするために多くのヘルパーが付属しています。 ::

    // クッキーのセット
    $this->cookie('name', 'Uncle Bob');

    // セッションデータのセット
    $this->session(['Auth.User.id' => 1]);

    // ヘッダーの設定
    $this->configRequest([
        'headers' => ['Accept' => 'application/json']
    ]);

これらのヘルパーメソッドによって設定された状態は、 ``tearDown()`` メソッドでリセットされます。

.. _testing-authentication:

認証が必要なアクションのテスト
------------------------------

もし ``AuthComponent`` を使用している場合、AuthComponent がユーザーの ID を検証するために
使用するセッションデータをスタブ化する必要があります。これを行うには、 ``IntegrationTestTrait``
のヘルパーメソッドを使用します。 ``ArticlesController`` が add メソッドを含み、
その add メソッドに必要な認証を行っていたと仮定すると、次のテストを書くことができます。 ::

    public function testAddUnauthenticatedFails(): void
    {
        // セッションデータの未設定
        $this->get('/articles/add');

        $this->assertRedirect(['controller' => 'Users', 'action' => 'login']);
    }

    public function testAddAuthenticated(): void
    {
        // セッションデータのセット
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => 1,
                    'username' => 'testing',
                    // 他のキー
                ]
            ]
        ]);
        $this->get('/articles/add');

        $this->assertResponseOk();
        // その他のアサーション
    }

ステートレス認証と API のテスト
-------------------------------

Basic 認証のようなステートレス認証を使用する API をテストするために、実際の認証の
リクエストヘッダーをシミュレートする環境変数やヘッダーを注入するためにリクエストを設定できます。

Basic または Digest 認証をテストする際、自動的に
`PHP が作成する <https://php.net/manual/ja/features.http-auth.php>`_
環境変数を追加できます。これらの環境変数は、 :ref:`basic-authentication` に概説されている
認証アダプター内で使用されます。 ::

    public function testBasicAuthentication(): void
    {
        $this->configRequest([
            'environment' => [
                'PHP_AUTH_USER' => 'username',
                'PHP_AUTH_PW' => 'password',
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

OAuth2 のようなその他の認証方法をテストしている場合、Authorization ヘッダーを
直接セットできます。 ::

    public function testOauthToken(): void
    {
        $this->configRequest([
            'headers' => [
                'authorization' => 'Bearer: oauth-token'
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

``configRequest()`` 内の headers キーは、アクションに必要な追加の HTTP ヘッダーを
設定するために使用されます。

CsrfProtectionMiddleware や FormProtectionComponent で保護されたアクションのテスト
----------------------------------------------------------------------------------

``CsrfProtectionMiddleware`` または ``FormProtectionComponent`` のいずれかで保護されたアクションをテストする場合、
テストがトークンのミスマッチで失敗しないように自動トークン生成を有効にすることができます。 ::

    public function testAdd(): void
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'Exciting news!']);
    }

また、トークンを使用するテストで debug を有効にすることは重要です。``FormProtectionComponent`` が
「デバッグ用トークンがデバッグ以外の環境で使われている」と考えてしまうのを防ぐためです。
``requireSecure()`` のような他のメソッドでテストした時は、適切な環境変数をセットするために
``configRequest()`` を利用できます。::

    // SSL 接続を装います。
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

アクションでアンロックされたフィールドが必要な場合は、
``setUnlockedFields()`` で宣言することができます。 ::

    $this->setUnlockedFields(['dynamic_field']);

PSR-7 ミドルウェアの統合テスト
------------------------------

統合テストは、PSR-7 アプリケーション全体や :doc:`/controllers/middleware` を
テストするために利用されます。デフォルトで ``IntegrationTestTrait`` は、
``App\Application`` クラスの存在を自動検知し、アプリケーションの統合テストを
自動的に有効にします。

``configApplication()`` メソッドを使うことによって、使用するアプリケーションクラス名と
コンストラクターの引数をカスタマイズすることができます。 ::

    public function setUp(): void
    {
        $this->configApplication('App\App', [CONFIG]);
    }


イベントやルートを含むプラグインを読み込むために :ref:`application-bootstrap` を
試してみてください。そうすることで、各テストケースごとにイベントやルートが接続されます。
テスト中に手動でプラグインをロードしたい場合は ``loadPlugins()`` メソッドを使うことができます。

暗号化されたクッキーを使用したテスト
-------------------------------------

アプリケーションで :ref:`encrypted-cookie-middleware` を使用している場合、
テストケースで暗号化クッキーを設定するためのヘルパーメソッドがあります。 ::

    // AES とデフォルトキーを使ってクッキーをセット
    $this->cookieEncrypted('my_cookie', '何か秘密の値');

    // このアクションは、クッキーを変更するものとします。
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('更新された値', 'my_cookie');

フラッシュメッセージのテスト
----------------------------

描画された HTML ではなく、セッション内にフラッシュメッセージが存在することをアサートする場合、
テスト内で ``enableRetainFlashMessages()`` を使ってセッション内のフラッシュメッセージを保持し、
アサーションを書くことができます。 ::

    // Enable retention of flash messages instead of consuming them.
    $this->enableRetainFlashMessages();
    $this->get('/bookmarks/delete/9999');

    $this->assertSession('ブックマークは存在しません', 'Flash.flash.0.message');

    // 'flash' キー内のフラッシュメッセージをアサート
    $this->assertFlashMessage('Bookmark deleted', 'flash');

    // ２つ目のフラッシュメッセージをアサート
    $this->assertFlashMessageAt(1, 'Bookmark really deleted');

    // 最初の位置の 'auth' キーにフラッシュメッセージをアサート
    $this->assertFlashMessageAt(0, 'You are not allowed to enter this dungeon!', 'auth');

    // フラッシュメッセージがエラーエレメントを使用していることをアサート
    $this->assertFlashElement('Flash/error');

    // ２つ目のフラッシュメッセージのエレメントをアサート
    $this->assertFlashElementAt(1, 'Flash/error');

JSON を返すコントローラーのテスト
---------------------------------

JSON は、ウェブサービスの構築において、とても馴染み深く、かつ基本的なフォーマットです。
CakePHP を用いたウェブサービスのエンドポイントのテストはとてもシンプルです。
JSON を返すコントローラーの簡単な例を示します。 ::

    class MarkersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set('marker', $marker);
            $this->viewBuilder()->setOption('serialize', ['marker']);
        }
    }

今、 **tests/TestCase/Controller/MarkersControllerTest.php** ファイルを作成し、
ウェブサービスが適切な応答を返していることを確認してください。 ::

    class MarkersControllerTest extends IntegrationTestCase
    {
        public function testGet(): void
        {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // レスポンスが 200 であることを確認
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, (string)$this->_response->getBody());
        }
    }

CakePHP の組込み JsonView で、 ``debug`` が有効になっている場合、 ``JSON_PRETTY_PRINT``
オプションを使用します。

ファイルアップロードのテスト
------------------------------------

デフォルトの「:ref:`オブジェクトとしてアップロードされたファイル <request-file-uploads>`」モードを使用すると、ファイルのアップロードのシミュレーションは簡単です。 `\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`_ (現在CakePHPで使用されているデフォルトの実装は ``\Laminas\Diactoros\UploadedFile`` )を実装するインスタンスを作成し、それらをテストリクエストデータに渡すだけ。
CLI環境では、このようなオブジェクトはデフォルトで、ファイルが
HTTP経由でアップロードされたかどうかをテストするバリデーションに合格します。
``$_FILES`` にある配列スタイルのデータには同じことが当てはまらず、バリデーションは失敗します。

アップロードされたファイルオブジェクトが通常のリクエストでどのように
存在するかを正確にシミュレートするには、リクエストデータでそれらを
渡すだけでなく、 ``files`` オプションを介してテストリクエスト構成に
渡す必要があります。ただし、コードが :php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` または :php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()` メソッドを介して
アップロードされたファイルにアクセスしない限り、技術的には必要ありません。

記事にティザー画像と ``複数の添付ファイル`` の関連付けがあるとして、
フォームはそれに応じて、1つの画像ファイルと複数の
添付ファイル/ファイルとして受け入れます。::

    <?= $this->Form->create($article, ['type' => 'file']) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('teaser_image', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.description']) ?>
    <?= $this->Form->control('attachments.1.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.1.description']) ?>
    <?= $this->Form->button('Submit') ?>
    <?= $this->Form->end() ?>

対応するリクエストをシミュレートするテストは、
次のようになります。::

    public function testAddWithUploads(): void
    {
        $teaserImage = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.jpg', // stream or path to file representing the temp file
            12345,                    // the filesize in bytes
            \UPLOAD_ERR_OK,           // the upload/error status
            'teaser.jpg',             // the filename as sent by the client
            'image/jpeg'              // the mimetype as sent by the client
        );

        $textAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.txt',
            'text/plain'
        );

        $pdfAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.pdf',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.pdf',
            'application/pdf'
        );

        // This is the data accessible via `$this->request->getUploadedFile()`
        // and `$this->request->getUploadedFiles()`.
        $this->configRequest([
            'files' => [
                'teaser_image' => $teaserImage,
                'attachments' => [
                    0 => [
                        'attachment' => $textAttachment,
                    ],
                    1 => [
                        'attachment' => $pdfAttachment,
                    ],
                ],
            ],
        ]);

        // This is the data accessible via `$this->request->getData()`.
        $postData = [
            'title' => 'New Article',
            'teaser_image' => $teaserImage,
            'attachments' => [
                0 => [
                    'attachment' => $textAttachment,
                    'description' => 'Text attachment',
                ],
                1 => [
                    'attachment' => $pdfAttachment,
                    'description' => 'PDF attachment',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('The article was saved successfully');
        $this->assertFileExists('/path/to/uploads/teaser.jpg');
        $this->assertFileExists('/path/to/uploads/attachment.txt');
        $this->assertFileExists('/path/to/uploads/attachment.pdf');
    }

.. tip::

    ファイルを使用してテストリクエストを構成する場合は、POSTデータの構造と *必ず* 一致する必要があります（ただし、アップロードされたファイルオブジェクトのみが含まれます）。

同様に、 `アップロードエラー <https://www.php.net/manual/en/features.file-upload.errors.php>`_ や、
検証に合格しない無効なファイルをシミュレートできます。::

    public function testAddWithInvalidUploads(): void
    {
        $missingTeaserImageUpload = new \Laminas\Diactoros\UploadedFile(
            '',
            0,
            \UPLOAD_ERR_NO_FILE,
            '',
            ''
        );

        $uploadFailureAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            1234567890,
            \UPLOAD_ERR_INI_SIZE,
            'attachment.txt',
            'text/plain'
        );

        $invalidTypeAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.exe',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.exe',
            'application/vnd.microsoft.portable-executable'
        );

        $this->configRequest([
            'files' => [
                'teaser_image' => $missingTeaserImageUpload,
                'attachments' => [
                    0 => [
                        'file' => $uploadFailureAttachment,
                    ],
                    1 => [
                        'file' => $invalidTypeAttachment,
                    ],
                ],
            ],
        ]);

        $postData = [
            'title' => 'New Article',
            'teaser_image' => $missingTeaserImageUpload,
            'attachments' => [
                0 => [
                    'file' => $uploadFailureAttachment,
                    'description' => 'Upload failure attachment',
                ],
                1 => [
                    'file' => $invalidTypeAttachment,
                    'description' => 'Invalid type attachment',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('The article could not be saved');
        $this->assertResponseContains('A teaser image is required');
        $this->assertResponseContains('Max allowed filesize exceeded');
        $this->assertResponseContains('Unsupported file type');
        $this->assertFileNotExists('/path/to/uploads/teaser.jpg');
        $this->assertFileNotExists('/path/to/uploads/attachment.txt');
        $this->assertFileNotExists('/path/to/uploads/attachment.exe');
    }

テスト中のエラー処理ミドルウェアの無効化
----------------------------------------

アプリケーションにエラーが発生したために失敗したテストをデバッグする場合、
エラー処理ミドルウェアを一時的に無効にして、根本的なエラーを目立たせることができます。
これをするために ``disableErrorHandlerMiddleware()`` が
使用できます。 ::

    public function testGetMissing(): void
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

上の例では、テストは失敗し、描画されたエラーページがチェックされる代わりに、
基本的な例外メッセージとスタックトレースが表示されます。

アサーションメソッド
--------------------

``IntegrationTestTrait`` トレイトはレスポンスのテストがとても簡単になるアサーションメソッドを
多数提供しています。いくつかの例をあげます。 ::

    // 2xx レスポンスコードをチェック
    $this->assertResponseOk();

    // 2xx/3xx レスポンスコードをチェック
    $this->assertResponseSuccess();

    // 4xx レスポンスコードをチェック
    $this->assertResponseError();

    // 5xx レスポンスコードをチェック
    $this->assertResponseFailure();

    // 指定したレスポンスコードをチェック。例: 200
    $this->assertResponseCode(200);

    // Location ヘッダーをチェック
    $this->assertRedirect(['controller' => 'Articles', 'action' => 'index']);

    // Location ヘッダーが設定されていないことをチェック
    $this->assertNoRedirect();

    // Location ヘッダーの一部をチェック
    $this->assertRedirectContains('/articles/edit/');

    // Location ヘッダーが含まれていないことをチェック
    $this->assertRedirectNotContains('/articles/edit/');

    // レスポンスが空ではないことをアサート
    $this->assertResponseNotEmpty();

    // レスポンス内容が空であることをアサート
    $this->assertResponseEmpty();

    // レスポンス内容をアサート
    $this->assertResponseEquals('Yeah!');

    // レスポンス内容が等しくないことをアサート
    $this->assertResponseNotEquals('No!');

    // レスポンス内容の一部をアサート
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');

    // 返されたファイルをアサート
    $this->assertFileResponse('/absolute/path/to/file.ext');

    // レイアウトをアサート
    $this->assertLayout('default');

    // テンプレートが表示されたかどうかをアサート
    $this->assertTemplate('index');

    // セッション内のデータをアサート
    $this->assertSession(1, 'Auth.User.id');

    // レスポンスヘッダーをアサート
    $this->assertHeader('Content-Type', 'application/json');
    $this->assertHeaderContains('Content-Type', 'html');

    // content-typeのヘッダーにxmlが含まれていないことをアサート
    $this->assertHeaderNotContains('Content-Type', 'xml');

    // ビュー変数をアサート
    $user =  $this->viewVariable('user');
    $this->assertEquals('jose', $user->username);

    // レスポンス内のクッキーをアサート
    $this->assertCookie('1', 'thingid');

    // コンテンツタイプをチェック
    $this->assertContentType('application/json');

上記のアサーションメソッドに加えて、
`TestSuite <https://api.cakephp.org/4.x/class-Cake.TestSuite.TestCase.html>`_ と
`PHPUnit <https://phpunit.de/manual/current/ja/appendixes.assertions.html>`__ の
中にある全てのアサーションを使用することができます。

ファイルへのテスト結果を比較
-----------------------------

例えば、ビューのレンダリングされた出力をテストする場合 - いくつかのタイプのテストにとっては、
ファイルの内容とテストの結果を比較する方が簡単かもしれません。 ``StringCompareTrait`` は、
この目的のために簡単なアサートメソッドを追加します。

使用方法は、トレイトを用いて比較元のパスを設定し、 ``assertSameAsFile`` を呼び出すことです。 ::

    use Cake\TestSuite\StringCompareTrait;
    use Cake\TestSuite\TestCase;

    class SomeTest extends TestCase
    {
        use StringCompareTrait;

        public function setUp(): void
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample(): void
        {
            $result = ...;
            $this->assertSameAsFile('example.php', $result);
        }
    }

上記の例では、 ``APP/tests/comparisons/example.php`` ファイルの内容と
``$result`` を比較します。

それらが参照されているように、テストの比較ファイルが作成・更新され、環境変数
``UPDATE_TEST_COMPARISON_FILES`` を設定することで、
テストファイルを更新/書き込みするために
仕組みが提供されています。

.. code-block:: console

    phpunit
    ...
    FAILURES!
    Tests: 6, Assertions: 7, Failures: 1

    UPDATE_TEST_COMPARISON_FILES=1 phpunit
    ...
    OK (6 tests, 7 assertions)

    git status
    ...
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   tests/comparisons/example.php


コンソールの統合テスト
======================

シェルとコマンドをテストについては :ref:`console-integration-testing` をご覧ください。

Mocking Injected Dependencies
=============================

See :ref:`mocking-services-in-tests` for how to replace services injected with
the dependency injection container in your integration tests.


ビューのテスト
==============

一般的に、ほとんどのアプリケーションは、直接 HTML コードをテストしません。そのため、多くの場合、
テストは壊れやすく、メンテナンスが困難になっています。 :php:class:`IntegrationTestTrait` を
使用して機能テストを書くときに ‘view’ に ``return`` オプションを設定することで、
レンダリングされたビューの内容を調べることができます。 ``IntegrationTestTrait`` を使用して
ビューのコンテンツをテストすることは可能ですが、より堅牢でメンテナンスしやすい統合/ビューテストは、
`Selenium webdriver <https://www.selenium.dev/>`_ のようなツールを使うことで実現できます

コンポーネントのテスト
======================

PagematronComponent というコンポーネントがアプリケーションにあったとしましょう。
このコンポーネントは、このコンポーネントを使用している全てのコントローラーにおいて、
ページネーションの limit 値を設定することができます。
**src/Controller/Component/PagematronComponent.php** に置かれた
コンポーネントの例はこちらです。 ::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // コントローラーが、ページネーションを使用していることを確認
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(EventInterface $event)
        {
            $this->setController($event->getSubject());
        }

        public function adjust($length = 'short'): void
        {
            switch ($length) {
                case 'long':
                    $this->controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->controller->paginate['limit'] = 50;
                break;
                default:
                    $this->controller->paginate['limit'] = 20;
                break;
            }
        }
    }

コンポーネントの中の ``adjust()`` メソッドによって、ページネーションの
``limit`` パラメーターが正しく設定されていることを保証するためのテストを
書くことができます。
**tests/TestCase/Controller/Component/PagematronComponentTest.php**
ファイルを作成します。 ::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentRegistry;
    use Cake\Event\Event;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {
        protected $component;
        protected $controller;

        public function setUp(): void
        {
            parent::setUp();
            // コンポーネントと偽のテストコントローラーのセットアップ
            $request = new ServerRequest();
            $response = new Response();
            $this->controller = $this->getMockBuilder('Cake\Controller\Controller')
                ->setConstructorArgs([$request, $response])
                ->setMethods(null)
                ->getMock();
            $registry = new ComponentRegistry($this->controller);
            $this->component = new PagematronComponent($registry);
            $event = new Event('Controller.startup', $this->controller);
            $this->component->startup($event);
        }

        public function testAdjust(): void
        {
            // 異なるパラメーター設定で、adjust メソッドをテスト
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown(): void
        {
            parent::tearDown();
            // 完了後のクリーンアップ
            unset($this->component, $this->controller);
        }
    }

ヘルパーのテスト
================

相当な量のロジックがヘルパークラスに存在するので、これらのクラスがテストケースによって
カバーされていることを確認することは重要です。

はじめに、テストのための例として、ヘルパーを作成します。 ``CurrencyRendererHelper`` には、
ビューで通貨の表示を補助するための、 ``yen()`` という
シンプルなメソッドを記述します。 ::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function yen($amount): string
        {
            return number_format($amount, 2, '.', ',') . '円';
        }
    }

このメソッドは、小数点以下2桁まで表示し、小数点としてドット、3桁ごとの区切りとして
カンマを使用するフォーマットで数字を表し、さらに ’円’ という文字を数字の末尾に追加します。

それではテストを作成します。 ::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase
    {
        public $helper = null;

        // ここでヘルパーをインスタンス化
        public function setUp(): void
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // yen() 関数をテスト
        public function testYen(): void
        {
            $this->assertEquals('5.30円', $this->helper->yen(5.30));

            // 常に小数第２位まで持つべき
            $this->assertEquals('1.00円', $this->helper->yen(1));
            $this->assertEquals('2.05円', $this->helper->yen(2.05));

            // 桁区切りのテスト
            $this->assertEquals(
              '12,000.70円',
              $this->helper->yen(12000.70)
            );
        }
    }

``yen()`` を異なるパラメーターで呼び出すことで、このテストスイートは 期待した値と同じ値を
返しているかどうかをアサートすることができます。

ファイルに保存しテストを実行します。これにより、緑のバー(※Windowsは非対応)と 1つのテスト、4つのアサーションに
成功したことを指し示すメッセージを見ることができるでしょう。

他のヘルパーを使用するヘルパーをテストしている時、View クラスの ``loadHelpers`` メソッドを
モックにしてください。

.. _testing-events:

イベントのテスト
================

:doc:`/core-libraries/events` は、アプリケーションコードを分離する素晴らしい方法ですが、
テストの際、これらのイベントを実行するテストケース内のイベントの結果をテストすることになりがちです。
これは、 ``assertEventFired`` や ``assertEventFiredWith`` を代わりに使うことで削除ができる、
余分な結合の一種です。

Orders を例に詳しく説明します。以下のテーブルを持っているとします。 ::

    class OrdersTable extends Table
    {
        public function place($order): bool
        {
            if ($this->save($order)) {
                // CartsTable へ移されたカートの移動
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->getEventManager()->dispatch($event);

                return true;
            }

            return false;
        }
    }

    class CartsTable extends Table
    {
        public function implementedEvents(): array
        {
            return [
                'Model.Order.afterPlace' => 'removeFromCart'
            ];
        }

        public function removeFromCart(EventInterface $event): void
        {
            $order = $event->getData('order');
            $this->delete($order->cart_id);
        }
    }

.. note::
    イベントの発生をアサートするために、イベントマネージャー上で最初に :ref:`tracking-events`
    を有効にする必要があります。

上記の ``OrdersTable`` をテストするために、 ``setUp()`` 内でトラッキングを有効にした後、
イベントが発生することをアサートし、そして ``$order`` エンティティーがイベントデータに
渡されることをアサートします。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {
        protected $fixtures = ['app.Orders'];

        public function setUp(): void
        {
            parent::setUp();
            $this->Orders = $this->getTableLocator()->get('Orders');
            // イベントトラッキングの有効化
            $this->Orders->getEventManager()->setEventList(new EventList());
        }

        public function testPlace(): void
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->getEventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->getEventManager());
        }
    }

デフォルトでは、アサーションのためにグローバルな ``EventManager`` が利用されるため、
グローバルイベントのテストは、イベントマネージャーに渡す必要はありません。 ::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

メールのテスト
==============

メールのテストについては :ref:`email-testing` をご覧ください。

テストスイートの作成
====================

いくつかのテストを同時に実行したいときはテストスイートを作成することができます。
テストスイートは、いくつかの テストケースから構成されています。アプリケーションの **phpunit.xml**
ファイルにテストスイートを作成することによって実行することができます。簡単な例は次のようになります。

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

プラグインのテスト作成
======================

プラグインのテストは、プラグインフォルダー内のディレクトリーに作成されます。 ::

    /src
    /plugins
        /Blog
            /tests
                /TestCase
                /Fixture

それらは通常のテストと同じように動作しますが、別のクラスをインポートする場合、プラグインの命名規則を
使用することを覚えておく必要があります。これは、このマニュアルのプラグインの章から ``BlogPost``
モデルのテストケースの一例です。他のテストとの違いは、 'Blog.BlogPost' がインポートされている
最初の行です。プラグインフィクスチャーに ``plugin.Blog.BlogPosts`` とプレフィックスをつける
必要があります。 ::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {
        // /plugins/Blog/tests/Fixture/ 内のプラグインのフィクスチャーをロード
        protected $fixtures = ['plugin.Blog.BlogPosts'];

        public function testSomething(): void
        {
            // 何らかのテスト
        }
    }

アプリのテストにおいてプラグインのフィクスチャーを使用したい場合は、 ``$fixtures`` 配列に
``plugin.pluginName.fixtureName`` 構文を使用して参照することができます。
さらに、ベンダーのプラグイン名またはフィクスチャーのディレクトリーを使用する場合は、
``plugin.vendorName/pluginName.folderName/fixtureName`` を使用できます:

フィクスチャーを使用する前に、 ``phpunit.xml`` に
:ref:`fixture listener <fixture-phpunit-configuration>`
が設定されていることを確認してください。

また、フィクスチャーがロード可能であることを確認する必要があります。次のように **composer.json**
ファイル内に存在することを確認してください。 ::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "plugins/MyPlugin/tests/"
        }
    }

.. note::

    新しいオートロードのマッピングを追加するときに ``composer.phar dumpautoload`` を
    実行することを忘れないでください。

Bake でのテストの生成
=====================

スキャフォールディングを生成するために :doc:`bake </bake/usage>` を使う場合、
テストのスタブも生成します。テストケースのスケルトンを再生成する必要がある場合、または、
書いたコードのテストスケルトンを生成する場合、 ``bake`` を使用することができます。

.. code-block:: console

    bin/cake bake test <type> <name>

``<type>`` は以下のいずれかである必要があります。

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Task
#. ShellHelper
#. Cell
#. Form
#. Mailer
#. Command

``<name>`` は作成したいテストの雛形のオブジェクトの名前です。

.. meta::
    :title lang=ja: テスト
    :keywords lang=ja: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
