テスト
#######

CakePHP はテストの包括的なサポートが組込まれています。CakePHP は `PHPUnit <http://phpunit.de>`_
のための統合が付属しています。PHPUnit が提供する機能に加えて、CakePHP は簡単にテストするために
いくつかの追加機能を提供しています。このセクションでは、PHPUnit のインストールからユニットテストの
はじめ方、そして、CakePHP が提供する拡張機能について説明します。

PHPUnit のインストール
======================

CakePHP のテストフレームワークは、PHPUnit を基礎としています。PHPUnit は、PHP での
ユニットテストのためのデファクトスタンダードです。それはあなたが思い通りのコードを確実に書くための、
深遠で強力な機能を提供します。PHPUnit は `PHAR パッケージ <http://phpunit.de/#download>`__ や
`Composer <http://getcomposer.org>`_ のいずれかを使用してを介してインストールすることができます。

Composer による PHPUnit のインストール
--------------------------------------

Composer で PHPUnit をインストールするには:

.. code-block:: bash

    $ php composer.phar require --dev phpunit/phpunit:"^5.7|^6.0"

    // CakePHP 3.4.1 より前
    $ php composer.phar require --dev phpunit/phpunit:"<6.0"

これで ``composer.json`` の ``require-dev`` セクションに依存関係を追加し、すべての依存関係と
一緒に PHPUnit をインストールします。

これで、PHPUnit を以下のように実行することができます。

.. code-block:: bash

    $ vendor/bin/phpunit

PHAR ファイルの使用
-------------------

**phpunit.phar** ファイルをダウンロードすると、テストを実行するために使用することができます。

.. code-block:: bash

    php phpunit.phar

.. tip::

    次のようにすると、都合よく phpunit.phar をグローバルに Unix や Linux で利用できます。

    .. code-block:: shell

          chmod +x phpunit.phar
          sudo mv phpunit.phar /usr/local/bin/phpunit
          phpunit --version

    `Windows 上で PHPUnit の PHAR をグローバルにインストールする方法 <http://phpunit.de/manual/current/ja/installation.html#installation.phar.windows>`__
    に関する手順については、PHPUnit のドキュメントを参照してください。

テスト用データベースのセットアップ
==================================

テストを実行する前に **config/app.php** ファイルで debug が有効になっていることを
忘れないでください。テストを実行する前に **config/app.php** に ``test`` データソース設定を
追加する必要があります。この設定は、CakePHP でフィクスチャのテーブルとデータのために使用されます。 ::

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

    テストデータベースは実際のデータベースとは別のデータベースを作成することをお勧めします。
    後々に起こりうる厄介な失敗を防ぐことができます。


テストのセットアップの確認
==========================

PHPUnit をインストールして ``test`` データソースを設定した後、 独自のテストを作成し
実行する準備ができていることを、アプリケーションのテストを実行することにより確認できます。

.. code-block:: bash

    # phpunit.phar について
    $ php phpunit.phar

    # Composer でインストールされた phpunit
    $ vendor/bin/phpunit

上記は、あなたが用意した任意のテストを実行するか、もしくはテストが実行されなかったことが分かります。
特定のテストを実行するためには PHPUnit にパラメータとしてテストのパスを指定します。
例えば、ArticlesTable クラスのテストケースがある場合、次のように実行します。

.. code-block:: bash

    $ vendor/bin/phpunit tests/TestCase/Model/Table/ArticlesTableTest

グリーンバーと実行したテストや成功したテストの数など、 いくつかの追加情報が表示されます。

.. note::

    Windows システムの場合、おそらくカラー表示はされません。

テストケースの規約
==================

CakePHP におけるほとんどのことがそうであるように、テストケースにもいくつか規約があります。
以下のとおりです。

#. テストを含むPHPファイルは、 ``tests/TestCase/[Type]`` ディレクトリに置きます。
#. ファイル名の最後は必ずただ .php とだけ書くのではなく **Test.php** とします。
#. テストを含むクラスは ``Cake\TestSuite\TestCase`` 、
   ``Cake\TestSuite\IntegrationTestCase`` または ``\PHPUnit\Framework\TestCase``
   を継承する必要があります。
#. 他のクラス名と同様に、テストケースのクラス名はファイル名と一致する必要があります。
   **RouterTest.php** は、 ``class RouterTest extends TestCase`` が含まれている
   必要があります。
#. テストを含むメソッド (つまり、アサーションを含むメソッド) の名前は ``testPublished()``
   のように ``test`` で始める必要があります。 ``@test`` というアノテーションをメソッドに
   マークすることでテストメソッドとすることもできます。

.. versionadded:: 3.4.1
    PHPUnit6 のサポートが追加されました。5.7.0 より低いバージョンの PHPUnit を
    使用する場合、テストケースは Cake のクラスまたは ``PHPUnit_Framework_TestCase`` を
    継承してください。

最初のテストケース作成
======================

一例として、非常に簡単なヘルパーメソッドのためのテストケースを作成します。
これからテストのために作成するメソッドは HTML でプログレスバーを作成します。
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

非常に簡単な例ですが、シンプルなテストケースを作成する方法をお見せするのに役立つことでしょう。
ヘルパーを作成し保存したら、 **tests/TestCase/View/Helper/ProgressHelperTest.php**
にテストケースの ファイルを作成します。このファイルにまず、以下のように書き込みます。 ::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase
    {
        public function setUp()
        {

        }

        public function testBar()
        {

        }
    }

ここからすぐに中身を増やしていきます。まずはメソッドを2つ加えました。最初は ``setUp()`` です。
このメソッドはこのテストケースクラスの *テスト* メソッドが 呼び出される前に毎回呼び出されます。
セットアップメソッドはテストに必要なオブジェクトの初期化や設定を行います。
今回のセットアップメソッドには次のように書き加えます。 ::

    public function setUp()
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

テストケースで親のメソッドを呼ぶことは重要です。``TestCase::setUp()`` は、
:php:class:`~Cake\\Core\\Configure` の値をバックアップしたり、
:php:class:`~Cake\\Core\\App` にパスを保存したりといった、いくつかの作業をしているからです。

次に、テストメソッドの内容を充実させていきます。あなたの書いたコードが期待した結果を
出力するかどうか保証するため、アサーションを使います。 ::

    public function testBar()
    {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

上記のテストは単純なものですが、テストケースを使用しての潜在的な利点を示しています。
このコードでは ``assertContains()`` を使うことで、ヘルパーが返した値に、期待した文字列が
含まれていることを保証しています。もし期待した文字列が含まれていなければテストは失敗し、
コードが正しくないことがわかります。

テストケースを使うことにより、 既知の入力セットと期待される出力結果との関係を 簡単に記述することが
できます。これにより、あなたの書いたコードが期待した動作を満たしているかどうか 簡単に確かめることが
できます。あなたはより自信を持ってコードを書くことができるようになる 手助けをしてくれます。
また、テストはコードなので、あなたが変更を加えるたびに再実行するのは簡単です。
これは新たなバグの発生を防ぐ手助けをしてくれるでしょう。

.. _running-tests:

テストの実行
============

PHPUnit をインストールし、テストケースをいくつか書いたら、テストを何度も実行したくなるでしょう。
すべての変更をコミットする前に、何も壊れていないことを確認するために、テストを実行することを
お勧めします。

``phpunit`` を使うことで、あなたはアプリケーションのテストを実行できます。
アプリケーションのテストを実行するには、シンプルに実行することができます。

.. code-block:: bash

    # composer のインストール
    $ vendor/bin/phpunit

    # phar 形式のファイル
    php phpunit.phar

`GitHub から CakePHP ソース <https://github.com/cakephp/cakephp>`__ をクローンして
CakePHP のユニットテストを実行したい場合、 ``phpunit`` を実行する前に、すべての依存関係が
インストールされているように、以下の ``Composer`` コマンドを実行することを忘れないでください。

.. code-block:: bash

    $ composer install --dev

アプリケーションのルートディレクトリから以下を行います。アプリケーションのソースの一部である
プラグインのテストを実行するには、まず ``cd`` でプラグインディレクトリに移動し、その後、
PHPUnit のインストール方法に合わせて ``phpunit`` コマンドを使用してください。

.. code-block:: bash

    cd plugins

    # composer でインストールされた phpunit を使用
    ../vendor/bin/phpunit

    # phar 形式のファイルを使用
    php ../phpunit.phar

スタンドアロンのプラグインのテストを実行するには、最初に別のディレクトリにプロジェクトを
インストールして、その依存関係をインストールする必要があります。

.. code-block:: bash

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    php ~/phpunit.phar

テストケースのフィルタリング
----------------------------

たくさんのテストケースがあると、その中からサブセットだけをテストしたいときや、失敗したテストだけを
実行したいときがあると思います。コマンドラインからテストメソッドをフィルタリングするときはオプションを
使用します。

.. code-block:: bash

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

テストメソッドを実行するためフィルタリングとして、filter パラメータは大文字と小文字を区別する
正規表現を使用します。

コードカバレッジの生成
----------------------

コマンドラインから PHPUnit に組み込まれたコードカバレッジツールを用いて、コードカバレッジのレポートを
生成することができます。PHPUnit はカバレッジの結果を含む静的な HTML ファイルをいくつか生成します。
テストケースのカバレッジを生成するには以下のようにします。

.. code-block:: bash

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

これで、アプリケーションの webroot ディレクトリ内のカバレッジ結果を配置します。
``http://localhost/your_app/coverage`` にアクセスすると、結果を表示することができるはずです。

プラグインのテストスイートを組合わせ
------------------------------------

しばしば、あなたのアプリケーションは、いくつかのプラグインで構成されます。これらの状況では、
各プラグインのテストを実行することは、かなり面倒です。アプリケーションの **phpunit.xml.dist**
ファイルに ``<testsuite>`` セクションを追加して、アプリケーションを構成するプラグインの
それぞれのテストを実行することができます。

.. code-block:: xml

    <testsuites>
        <testsuite name="App Test Suite">
            <directory>./tests/TestCase</directory>
        </testsuite>

        <!-- Add your plugin suites -->
        <testsuite name="Forum plugin">
            <directory>./plugins/Forum/tests/TestCase</directory>
        </testsuite>
    </testsuites>

``phpunit`` を使用すると、 ``<testsuites>`` 要素に追加されたテストスイートは自動的に実行されます。

もし、 composer でインストールされたプラグインのフィクスチャを使用するために
``<testsuites>`` を使用している場合、プラグインの ``composer.json`` ファイルに
フィクスチャの名前空間を autoload セクションに追加してください。例::

    "autoload": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests\\Fixture"
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

フィクスチャ
============

テストコードの挙動がデータベースやモデルに依存するとき、テストに使うためのテーブルを生成し、
一時的なデータをロードするために **フィクスチャ** を使うことができます。
フィクスチャを使うことにより、 実際のアプリケーションに使われているデータを破壊することなく
テストができるというメリットがあります。 また、アプリケーションのためのコンテンツを実際に用意するより
先にコードをテストすることができます。

このとき、CakePHP は設定ファイル **config/app.php** にある ``test`` という名前の
データベース接続設定を使います。この接続が使えないときは例外が発生し、フィクスチャを使うことが
できません。

CakePHP はフィクスチャに基づいたテストケースを実行するにあたり、以下の動作をします。

#. 各フィクスチャで必要なテーブルを作成します。
#. フィクスチャにデータが存在すれば、それをテーブルに投入します。
#. テストメソッドを実行します。
#. フィクスチャのテーブルを空にします。
#. データベースからフィクスチャのテーブルを削除します。

テスト接続
----------

デフォルトでは、CakePHP のアプリケーション内の各データベース接続は別名になります。
アプリケーションのブートストラップで定義された (``test_`` がつかない) 各データベース接続は、
``test_`` プレフィクスがついた別名を持つことになります。テストケースで誤って間違った接続を
使用しないことを、エイリアシングの接続が保証します。接続エイリアシングは、アプリケーションの
残りの部分には透過的です。例えば、あなたは 'default' コネクションを使用している場合、
代わりに、テストケースで ``test`` コネクションを取得します。あなたが 'replica' コネクションを
使用する場合、テストスイートは 'test_replica' を使用しようとします。

フィクスチャの作成
------------------

フィクスチャを作成するときは主にふたつのことを定義します。ひとつはどのようなフィールドを持った
テーブルを作成するか、もうひとつは初期状態でどのようなレコードをテーブルに配置するかです。
それでは最初のフィクスチャを作成してみましょう。この例ではArticleモデルのフィクスチャを作成します。
以下の内容で、 **tests/Fixture** ディレクトリに **ArticlesFixture.php** という名前のファイルを
作成してください。 ::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {

          // オプション。異なるテストデータソースにフィクスチャをロードするために、このプロパティを設定
          public $connection = 'test';

          public $fields = [
              'id' => ['type' => 'integer'],
              'title' => ['type' => 'string', 'length' => 255, 'null' => false],
              'body' => 'text',
              'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
              'created' => 'datetime',
              'modified' => 'datetime',
              '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']]
              ]
          ];
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

    PostgreSQL や SQLServer のシーケンス生成を妨げるように手動で自動インクリメントカラムに
    値を追加しないことをお勧めします。

``$connection`` プロパティは、フィクスチャが使用するデータソースを定義します。アプリケーションが
複数のデータソースを使用している場合、フィクスチャはモデルのデータソースと一致しますが、 ``test_``
プレフィックスを必要があります。例えば、お使いのモデルが ``mydb`` データソースを使用している場合、
あなたのフィクスチャは、 ``test_mydb`` データソースを使用する必要があります。
``test_mydb`` 接続が存在しない場合、モデルはデフォルトの ``test`` データソースを使用します。
テストを実行するときにテーブル名の衝突を避けるため、フィクスチャのデータソースには ``test``
のプレフィックスが必ず付きます。

``$fields`` ではテーブルを構成するフィールドと、その定義を記述します。フィールドの定義には
:php:class:`Cake\\Database\\Schema\\Table` と同じ書式を使います。
テーブル定義のための利用可能なキーは以下のとおりです。

type
    CakePHP の内部データ型。現在サポートしているのは、以下の型です。

    - ``string``: ``VARCHAR`` または ``CHAR`` にマップ
    - ``uuid``: ``UUID`` にマップ
    - ``text``: ``TEXT`` にマップ
    - ``integer``: ``INT`` にマップ
    - ``biginteger``: ``BIGINTEGER`` にマップ
    - ``decimal``: ``DECIMAL`` にマップ
    - ``float``: ``FLOAT`` にマップ
    - ``datetime``: ``DATETIME`` にマップ
    - ``timestamp``: ``TIMESTAMP`` にマップ
    - ``time``: ``TIME`` にマップ
    - ``date``: ``DATE`` にマップ
    - ``binary``: ``BLOB`` にマップ
fixed
    CHAR 型の文字列をサポートするプラットフォームで CHAR 型のカラムを作成するために使用します。
length
    フィールドが許容するサイズを設定します。
precision
    float や decimal フィールド上で使用される小数点以下の桁数を設定します。
null
    ``true`` ( NULL を許容する) または ``false`` ( NULL を許容しない) のいずれかを設定します。
default
    フィールドが持つデフォルト値。

フィクスチャのテーブルを作成してから、そのテーブルに投入するレコードを定義することができます。
``$records`` はレコードの配列であり、データの書式もとても簡単です。 ``$records`` の各アイテムは
ひとつの行を表し、カラム名と値の連想配列で構成されます。$records の持つ配列は各要素 **ごとに**
``$fields`` で指定した特定のキーを 持たなければならないことを覚えておいてください。
あるフィールドの値を ``null`` と したいときは、そのキーの値を ``null`` とします。

動的データとフィクスチャ
------------------------

レコードのフィクスチャをクラスプロパティとして定義すると、関数を使ったり、フィクスチャの定義に
他の動的なデータを使用することは易しいものではありません。解決策として、 ``$records`` を
フィクスチャクラスの関数 ``init()`` で定義するという方法があります。 例えば、created と
modified のタイムスタンプに今日の日付を反映させたいのであれば、 以下のようにするとよいでしょう。 ::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {

        public $fields = [
            'id' => ['type' => 'integer'],
            'title' => ['type' => 'string', 'length' => 255, 'null' => false],
            'body' => 'text',
            'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
            'created' => 'datetime',
            'modified' => 'datetime',
            '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']],
            ]
        ];

        public function init()
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

``init()`` をオーバーライドするときは、必ず ``parent::init()`` を呼び出すことを
忘れないでください。

テーブル情報のインポート
------------------------

データベース・ベンダー間の移植可能にする必要があるアプリケーションを作成する場合やプラグインや
ライブラリを作成する際にフィクスチャファイルのスキーマを定義することは本当に便利です。
フィクスチャのスキーマを再定義すると、大規模なアプリケーションで維持することが困難になリマす。
テストスイートで使用されるテーブル定義を作成するために、 CakePHP は既存の接続からスキーマを
インポートし、反映されたテーブル定義を使用する機能を提供します。

例を見てみましょう。アプリケーションで利用可能な articles という名前のテーブルがあると仮定すると、
前のセクションで作成した 例のフィクスチャ (**tests/Fixture/ArticlesFixture.php**) を、
次のように書き換えてください。 ::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
    }

異なる接続の使用を使用したい場合::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

.. versionadded:: 3.1.7

通常、フィクスチャと共に Table クラスも持っています。
テーブル名を取得するためにそれを使用することができます。 ::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['model' => 'Articles'];
    }

``TableRegistry::get()`` を使用するので、プラグイン記法をサポートしています。

あなたは自然に既存のモデルやテーブルからテーブル定義をインポートしますが、それは前のセクションに
示されたように、フィクスチャで直接定義されたレコードを設定することができます。例えば::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
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

最後に、フィクスチャ内で任意のスキーマを作成やロードすることはできません。すでに作成されたすべての
空のテーブルを使用してテスト・データベースを設定している場合に便利です。 ``$fields`` または
``$import`` のいずれかを定義することにより、フィクスチャは各テストメソッドでレコードを挿入し
削除します。

テストケース内のフィクスチャのロード
------------------------------------

フィクスチャを作成したらそれらをテストで使いたくなることでしょう。
各テストケースではあなたが必要としているフィクスチャをロードすることができます。
クエリの実行に際して必要となるモデルのフィクスチャをロードする必要があります。
フィクスチャをロードするには、テストケースに ``$fixtures`` プロパティを設定します。 ::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['app.articles', 'app.comments'];
    }

上記の例では、「Article」と「Comment」フィクスチャをアプリケーションの 「Fixture」ディレクトリから
ロードします。同じように CakePHP のコアや プラグインからもロードすることができます。 ::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['plugin.debug_kit.articles', 'core.comments'];
    }

``core`` のプレフィックスを使えば CakePHP からフィクスチャをロードし、プラグイン名を
プレフィックスとして使えば その名前のプラグインからフィクスチャをロードします。

フィクスチャのロードは :php:attr:`Cake\\TestSuite\\TestCase::$autoFixtures` を
`false` に設定したあと、テストメソッドの中で
:php:meth:`Cake\\TestSuite\\TestCase::loadFixtures()` を使ってを制御することもできます。 ::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['app.articles', 'app.comments'];
        public $autoFixtures = false;

        public function testMyFunction()
        {
            $this->loadFixtures('Articles', 'Comments');
        }
    }

あなたはサブディレクトリにフィクスチャをロードすることができます。複数ディレクトリを使用することは、
大規模なアプリケーションで、フィクスチャを整理しやすくします。サブディレクトリ中のフィクスチャを
ロードするためには、フィクスチャ名にサブディレクトリを加えてください。 ::

    class ArticlesTest extends CakeTestCase
    {
        public $fixtures = ['app.blog/articles', 'app.blog/comments'];
    }

上記の例では、両方のフィクスチャは ``tests/Fixture/blog`` からロードされることになります。

テーブルクラスのテスト
======================

既に **src/Model/Table/ArticlesTable.php** に定義された ArticlesTable クラスがあると
しましょう 、それは次のようになります。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options)
        {
            $query->where([
                $this->alias() . '.published' => 1
            ]);
            return $query;
        }
    }

今から、このテーブルクラスをテストするテストを設定します。それでは、以下の内容で、
**tests/TestCase/Table** ディレクトリに **ArticlesTableTest.php** という名前のファイルを
作成してみましょう。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.articles'];
    }

このテストケースの ``$fixtures`` 変数に使用する予定のフィクスチャを設定します。
クエリを実行するにあたり、必要なフィクスチャをすべてインクルードすることを覚えておいてください。

テストメソッドの作成
--------------------

今から、ArticlesTable の ``published()`` 関数をテストするメソッドを追加してみましょう。
**tests/TestCase/Model/Table/ArticlesTableTest.php** ファイルを次のように編集してください。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.articles'];

        public function setUp()
        {
            parent::setUp();
            $this->Articles = TableRegistry::get('Articles');
        }

        public function testFindPublished()
        {
            $query = $this->Articles->find('published');
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->hydrate(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

``testFindPublished()`` というメソッドを追加されていることが確認できます。私たちは、
``ArticlesTable`` クラスのインスタンスを作成することから始め、その後、 ``find('published')``
メソッドを実行します。 ``$expected`` に、期待する適切な結果をセットします。
(article テーブルに配置されるレコードを定義します。) ``assertEquals()`` メソッドを使用して、
結果が私たちの期待に等しいことをテストします。テストケースを実行する方法の詳細については
:ref:`running-tests` セクションをご覧ください。


モデルメソッドのモック化
------------------------

テストする際のモデルにメソッドのモックを作成したいと思うことがあるでしょう。
テーブルクラスのテストモックを作成するために ``getMockForModel`` を使用する必要があります。
通常のモックを持った反映されたプロパティの問題を回避します。 ::

    public function testSendingEmails()
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

コントローラの統合テスト
========================

ヘルパー、モデル、およびコンポーネントと同様にコントローラクラスをテストすることができますが、
CakePHP は特殊な ``IntegrationTestCase`` クラスを提供しています。コントローラのテストケースの
ための基本クラスとしてこのクラスを使用すると、高いレベルからコントローラをテストすることができます。

あなたが統合テストに慣れていない場合、一斉に複数のユニットをテストすることが容易になるテストの
アプローチがあります。CakePHP の統合テスト機能は、アプリケーションによって処理される HTTP
リクエストをシミュレートします。例えば、コントローラをテストすると、与えられたリクエストに関する
コンポーネント、モデルそしてヘルパーを実行します。これはあなたのアプリケーションとその動作する部品の
全てにより高いレベルのテストを提供します。

あなたは典型的な ArticlesController、およびそれに対応するモデルを持っているとします。
コントローラのコードは次のようになります。 ::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public $helpers = ['Form', 'Html'];

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
                ]);
            } else {
                $result = $this->Articles->find();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

**tests/TestCase/Controller** ディレクトリに **ArticlesControllerTest.php** という名前の
ファイルを作成し、内部に以下を記述してください。 ::

    namespace App\Test\TestCase\Controller;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\IntegrationTestCase;

    class ArticlesControllerTest extends IntegrationTestCase
    {
        public $fixtures = ['app.articles'];

        public function testIndex()
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // 他のアサート
        }

        public function testIndexQueryData()
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // 他のアサート
        }

        public function testIndexShort()
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // 他のアサート
        }

        public function testIndexPostData()
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
            $articles = TableRegistry::get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

この例では、いくつかのリクエストを送信するメソッドと ``IntegrationTestCase`` が提供するいくつかの
アサーションを示しています。あなたが任意のアサーションを行う前に、リクエストをディスパッチする必要が
あります。リクエストを送信するには、以下のいずれかのメソッドを使用することができます。

* ``get()`` GET リクエストを送信します。
* ``post()`` POST リクエストを送信します。
* ``put()`` PUT リクエストを送信します。
* ``delete()`` DELETE リクエストを送信します。
* ``patch()`` PATCH リクエストを送信します。

``get()`` と ``delete()`` を除く全てのメソッドは、あなたがリクエストボディを送信することを
可能にする二番目のパラメータを受け入れます。リクエストをディスパッチした後、あなたのリクエストに対して
正しく動作したことを確実にするために ``IntegrationTestCase`` や、PHPUnit が提供するさまざまな
アサーションを使用することができます。

リクエストの設定
----------------

``IntegrationTestCase`` クラスを使用すると、テスト対象のアプリケーションに送信するリクエストを
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
使用するセッションデータをスタブ化する必要があります。これを行うには、 ``IntegrationTestCase``
のヘルパーメソッドを使用します。 ``ArticlesController`` が add メソッドを含み、
その add メソッドに必要な認証を行っていたと仮定すると、次のテストを書くことができます。 ::

    public function testAddUnauthenticatedFails()
    {
        // セッションデータの未設定
        $this->get('/articles/add');

        $this->assertRedirect(['controller' => 'Users', 'action' => 'login']);
    }

    public function testAddAuthenticated()
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
リクエストヘッダーをシミュレートする環境変数やヘッダを注入するためにリクエストを設定できます。

Basic または Digest 認証をテストする際、自動的に
`PHP が作成する <http://php.net/manual/ja/features.http-auth.php>`_
環境変数を追加できます。これらの環境変数は、 :ref:`basic-authentication` に概説されている
認証アダプター内で使用されます。 ::

    public function testBasicAuthentication()
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

    public function testOauthToken()
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

CsrfComponent や SecurityComponent で保護されたアクションのテスト
-----------------------------------------------------------------

SecurityComponent または CsrfComponent のいずれかで保護されたアクションをテストする場合、
テストがトークンのミスマッチで失敗しないように自動トークン生成を有効にすることができます。 ::

    public function testAdd()
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'Exciting news!']);
    }

また、トークンを使用するテストで debug を有効にすることは重要です。SecurityComponent が
「デバッグ用トークンがデバッグ以外の環境で使われている」と考えてしまうのを防ぐためです。
``requireSecure()`` のような他のメソッドでテストした時は、適切な環境変数をセットするために
``configRequest()`` を利用できます。 ::

    // SSL 接続を装います。
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

.. versionadded:: 3.1.2
    ``enableCsrfToken()`` と ``enableSecurityToken()`` メソッドは 3.1.2 で追加されました。

PSR-7 ミドルウェアの統合テスト
------------------------------

統合テストは、あなたの PSR-7 アプリケーション全体や :doc:`/controllers/middleware` を
テストするために利用されます。デフォルトで ``IntegrationTestCase`` は、
``App\Application`` クラスの存在を自動検知し、あなたのアプリケーションの統合テストを
自動的に有効にします。 ``useHttpServer()`` メソッドでこの振舞いを切り替えられます。 ::

    public function setUp()
    {
        // PSR-7 統合テストの有効化
        $this->useHttpServer(true);

        // PSR-7 統合テストの無効化
        $this->useHttpServer(false);
    }

``configApplication()`` メソッドを使うことによって、使用するアプリケーションクラス名と
コンストラクタの引数をカスタマイズすることができます。 ::

    public function setUp()
    {
        $this->configApplication('App\App', [CONFIG]);
    }

PSR-7 モードを有効にして、アプリケーションクラスの設定を可能にした後でも、
``IntegrationTestCase`` に存在する機能は、通常と同様に利用できます。

イベントやルートを含むプラグインを読み込むために :ref:`application-bootstrap` を
試してみてください。そうすることで、各テストケースごとにイベントやルートが確実に接続されます。

.. versionadded:: 3.3.0
    PSR-7 ミドルウェアと ``useHttpServer()`` メソッドは、3.3.0 で追加されました。

アサーションメソッド
--------------------

``IntegrationTestCase`` クラスはレスポンスのテストがとても簡単になるアサーションメソッドを
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

    // Location ヘッダが設定されていないことをチェック
    $this->assertNoRedirect();

    // Location ヘッダの一部をチェック
    $this->assertRedirectContains('/articles/edit/');

    // レスポンスが空ではないことをアサート
    $this->assertResponseNotEmpty();

    // レスポンス内容が空であることをアサート
    $this->assertResponseEmpty();

    // レスポンス内容をアサート
    $this->assertResponseEquals('Yeah!');

    // レスポンス内容の一部をアサート
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');

    // レイアウトをアサート
    $this->assertLayout('default');

    // テンプレートが表示されたかどうかをアサート
    $this->assertTemplate('index');

    // セッション内のデータをアサート
    $this->assertSession(1, 'Auth.User.id');

    // レスポンスヘッダーをアサート
    $this->assertHeader('Content-Type', 'application/json');

    // ビュー変数をアサート
    $this->assertEquals('jose', $this->viewVariable('user.username'));

    // レスポンス内のクッキーをアサート
    $this->assertCookie('1', 'thingid');

    // コンテンツタイプをチェック
    $this->assertContentType('application/json');

上記のアサーションメソッドに加えて、
`TestSuite <https://api.cakephp.org/3.x/class-Cake.TestSuite.TestCase.html>`_ と
`PHPUnit <https://phpunit.de/manual/current/en/appendixes.assertions.html>`__ の
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

        public function setUp()
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample()
        {
            $result = ...;
            $this->assertSameAsFile('example.php', $result);
        }
    }

上記の例では、 ``APP/tests/comparisons/example.php`` ファイルの内容と
``$result`` を比較します。

それらが参照されているように、テストの比較ファイルが作成・更新され、環境変数
``UPDATE_TEST_COMPARISON_FILES`` を設定することで、テストファイルを更新/書き込みするために
仕組みが提供されています。

.. code-block:: bash

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

暗号化されたクッキーを使用したテスト
-------------------------------------

コントローラで :php:class:`Cake\\Controller\\Component\\CookieComponent` を使用している場合、
あなたのクッキーは、おそらく暗号化されます。3.1.7 では、CakePHP はテストケース内の暗号化された
クッキーと対話するためのヘルパーメソッドを提供します。 ::

    // aes とデフォルトキーを使ってクッキーをセット
    $this->cookieEncrypted('my_cookie', 'Some secret values');

    // このアクションは、クッキーを変更するものとします。
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('An updated value', 'my_cookie');

.. versionadded: 3.1.7
    ``assertCookieEncrypted`` とは ``cookieEncrypted`` は 3.1.7 で追加されました。

JSON を返すコントローラのテスト
-------------------------------

JSON は、ウェブサービスの構築において、とても馴染み深く、かつ基本的なフォーマットです。
CakePHP を用いたウェブサービスのエンドポイントのテストはとてもシンプルです。
JSON を返すコントローラーの簡単な例を示します。 ::

    class MarkersController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set([
                '_serialize' => ['marker'],
                'marker' => $marker,
            ]);
        }
    }

今、 **tests/TestCase/Controller/MarkersControllerTest.php** ファイルを作成し、
ウェブサービスが適切な応答を返していることを確認してください。 ::

    class MarkersControllerTest extends IntegrationTestCase
    {

        public function testGet()
        {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // レスポンスが 200 だったことを確認
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, $this->_response->body());
        }
    }

CakePHP の組込み JsonView で、 ``debug`` が有効になっている場合、 ``JSON_PRETTY_PRINT``
オプションを使用します。

ビューのテスト
==============

一般的に、ほとんどのアプリケーションは、直接 HTML コードをテストしません。そのため、多くの場合、
テストは壊れやすく、メンテナンスが困難になっています。 :php:class:`IntegrationTestCase` を
使用して機能テストを書くときに ‘view’ に ``return`` オプションを設定することで、
レンダリングされたビューの内容を調べることができます。 IntegrationTestCase を使用して
ビューのコンテンツをテストすることは可能ですが、より堅牢でメンテナンスしやすい統合/ビューテストは、
`Selenium webdriver <http://seleniumhq.org>`_ のようなツールを使うことで実現できます


コンポーネントのテスト
======================

PagematronComponent というコンポーネントがアプリケーションにあったとしましょう。
このコンポーネントは、このコンポーネントを使用している全てのコントローラーにおいて、
ページネーションの limit 値を設定することができます。
**src/Controller/Component/PagematronComponent.php** に置かれたコンポーネントの例は
こちらです。 ::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // コントローラが、ページネーションを使用していることを確認
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(Event $event)
        {
            $this->setController($event->getSubject());
        }

        public function adjust($length = 'short')
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

今、コンポーネントの中の ``adjust()`` メソッドによって、ページネーションの
``limit`` パラメータが正しく設定されていることを保証するためのテストを書くことができます。
**tests/TestCase/Controller/Component/PagematronComponentTest.php**
ファイルを作成します。 ::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentRegistry;
    use Cake\Event\Event;
    use Cake\Network\Request;
    use Cake\Network\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {

        public $component = null;
        public $controller = null;

        public function setUp()
        {
            parent::setUp();
            // コンポーネントと偽のテストコントローラのセットアップ
            $request = new Request();
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

        public function testAdjust()
        {
            // 異なるパラメータ設定で、adjust メソッドをテスト
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown()
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

はじめに、テストのための例として、ヘルパーを作成します。 ``CurrencyRendererHelper`` は、
ビューで通貨の表示を補助するための、 ``usd()`` という唯一の単純なメソッドを持っています。 ::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function usd($amount)
        {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

このメソッドは、小数点以下2桁まで表示し、小数点としてドット、3桁ごとの区切りとして
カンマを使用するフォーマットで数字を表し、さらに ’USD’ という文字列を数字の先頭に置きます。

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
        public function setUp()
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // usd() 関数をテスト
        public function testUsd()
        {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // 常に小数第２位まで持つべき
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // 桁区切りのテスト
            $this->assertEquals(
              'USD 12,000.70',
              $this->helper->usd(12000.70)
            );
        }
    }

ここで、 ``usd()`` を異なるパラメータで呼び出すことで、このテストスイートは 期待した値と同じ値を
返しているかを確かめています。

ファイルに保存しテストを実行します。これにより、グリーンバーと 1つのテスト、4つのアサーションに
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

        public function place($order)
        {
            if ($this->save($order)) {
                // CartsTable へ移されたカートの移動
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

    class CartsTable extends Table
    {

        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'removeFromCart'
            ];
        }

        public function removeFromCart(Event $event)
        {
            $order = $event->getData('order');
            $this->delete($order->cart_id);
        }
    }

.. note::
    イベントの発生をアサートするために、イベントマネージャ上で最初に :ref:`tracking-events`
    を有効にしなければなりません。

上記の ``OrdersTable`` をテストするために、``setUp()`` 内でトラッキングを有効にした後、
イベントが発生することをアサートし、そして ``$order`` エンティティがイベントデータに
渡されることをアサートします。 ::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {

        public $fixtures = ['app.orders'];

        public function setUp()
        {
            parent::setUp();
            $this->Orders = TableRegistry::get('Orders');
            // イベントトラッキングの有効化
            $this->Orders->eventManager()->setEventList(new EventList());
        }

        public function testPlace()
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->eventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->eventManager());
        }
    }

デフォルトでは、アサーションのためにグローバルな ``EventManager`` が利用されるため、
グローバルイベントのテストは、イベントマネージャに渡す必要はありません。 ::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

.. versionadded:: 3.2.11

    イベントトラッキングと ``assertEventFired()`` と ``assertEventFiredWith`` は
    追加されました。

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

プラグインのテストは、プラグインフォルダ内のディレクトリに作成されます。 ::

    /src
        /plugins
            /Blog
                /tests
                    /TestCase
                    /Fixture

それらは通常のテストと同じように動作しますが、別のクラスをインポートする場合、プラグインの命名規則を
使用することを覚えておく必要があります。これは、このマニュアルのプラグインの章から ``BlogPost``
モデルのテストケースの一例です。他のテストとの違いは、'Blog.BlogPost' がインポートされている
最初の行です。プラグインフィクスチャに ``plugin.blog.blog_posts`` とプレフィックスをつける
必要があります。 ::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {

        // /plugins/Blog/tests/Fixture/ 内のプラグインのフィクスチャをロード
        public $fixtures = ['plugin.blog.blog_posts'];

        public function testSomething()
        {
            // 何らかのテスト
        }
    }

アプリのテストにおいてプラグインのフィクスチャを使用したい場合は、 ``$fixtures`` 配列に
``plugin.pluginName.fixtureName`` 構文を使用して参照することができます。

フィクスチャを使用する前に、あなたの ``phpunit.xml`` に、フィクスチャのリスナーが含まれていることを
ダブルチェックする必要があります。 ::

    <!-- フィクスチャのためのリスナーのセットアップ -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector"
        file="./vendor/cakephp/cakephp/src/TestSuite/Fixture/FixtureInjector.php">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

また、フィクスチャがロード可能であることを確認する必要があります。次のように **composer.json**
ファイル内に存在することを確認してください。 ::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "./plugins/MyPlugin/tests"
        }
    }

.. note::

    新しいオートロードのマッピングを追加するときに ``composer.phar dumpautoload`` を
    実行することを忘れないでください。

Bake でのテストの生成
=====================

スキャフォールディングを生成するために :doc:`bake </bake/usage>` を使う場合、
テストのスタブも生成します。テストケースのスケルトンを再生成する必要がある場合、または、
あなたが書いたコードのテストスケルトンを生成する場合、 ``bake`` を使用することができます。

.. code-block:: bash

    bin/cake bake test <type> <name>

``<type>`` のいずれかである必要があります。

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Cell

一方、 ``<name>`` は、テストの雛形を作成したいオブジェクトの名前です。

Jenkins によるインテグレーション
================================

`Jenkins <http://jenkins-ci.org>`_ は、あなたのテストケースの実行を自動化することができる
継続的インテグレーションサーバです。これは、すべてのテストがパスし、アプリケーションが常に準備が
できていることを保証するのに役立ちます。

Jenkins で CakePHP アプリケーションを統合することは非常に簡単です。以下では、すでに \*nix の
システムに Jenkins をインストールしていると仮定して、それを管理することができます。
また、ジョブを作成とビルドの実行を知っているとします。これらのいずれかが不明な場合は、
`Jenkins のドキュメント <http://jenkins-ci.org/>`_ を参照してください。

ジョブの作成
------------

アプリケーションのためのジョブを作成することから始めてください。次に、Jenkins があなたのコードに
アクセスできるように、リポジトリと接続します。

テストデータベースの設定追加
----------------------------

Jenkins のために別のデータベースを用意するのは、初歩的な問題を回避するためには良い考えです。
一度 Jenkins がアクセスできる (通常は localhost の) データベースサーバに新しくデータベースを
作成しました。以下のような *シェルスクリプトのステップ* をビルドに加えてください。

.. code-block:: bash

    cat > config/app_local.php <<'CONFIG'
    <?php
    return [
        'Datasources' => [
            'test' => [
                'datasource' => 'Database/Mysql',
                'host'       => 'localhost',
                'database'   => 'jenkins_test',
                'username'      => 'jenkins',
                'password'   => 'cakephp_jenkins',
                'encoding'   => 'utf8'
            ]
        ]
    ];
    CONFIG

**config/bootstrap.php** ファイルの中の以下の行のコメントを外してください。 ::

    //Configure::load('app_local', 'default');

**app_local.php** ファイルを作成することにより、Jenkins に特有の設定を簡単に定義できます。
あなたは Jenkins 上で必要な任意の他の設定ファイルを上書きするために、この同じ設定ファイルを
使用することができます。

各ビルドの前に、データベースのドロップと再作成することをお勧めします。
一度のビルドの失敗によって、立て続けに起きるであろう失敗の連鎖を断ち切ってくれるはずです。
以下のような *シェルスクリプトのステップ* をビルドに加えてください。


.. code-block:: bash

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

テストの追加
------------

ビルドに別の *シェルスクリプトのステップ* を追加してください。このステップでは、依存関係をインストールし、
アプリケーションのテストを実行します。JUnit のログファイルや Clover カバレッジを作成することにより、
テストの結果を視覚的に確認できるようになります。

.. code-block:: bash

    # もしなければ、Composer をダウンロード
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer | php
    # 依存関係をインストール
    php composer.phar install
    vendor/bin/phpunit --log-junit junit.xml --coverage-clover clover.xml

clover カバレッジや JUnit の結果を使用する場合は、Jenkins のための設定をしてください。
これらのステップを設定しないと、あなたは結果を見ることができません。

ビルドの実行
------------

これでビルドを実行することができるようになりました。コンソール出力を確認して、
ビルドがパスするように必要な変更を加えてください。

.. meta::
    :title lang=ja: テスト
    :keywords lang=ja: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
