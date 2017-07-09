テスト
######

CakePHP にはテストのための包括的なフレームワークが組み込まれています。CakePHP は
`PHPUnit <http://phpunit.de>`_ と統合されています。PHPUnit が提供する機能に加えて、
CakePHP はテストをより簡単にする機能を提供します。このセクションでは PHPUnit のインストールから
ユニットテストのはじめ方、そして、CakePHP が提供する拡張機能について説明します。

PHPUnit のインストール
======================

CakePHP のテストフレームワークは、PHPUnit を基礎としています。PHPUnit は PHP の
ユニットテストにおいてデファクトスタンダードとなっています。それはあなたが思い通りのコードを
確実に書くための、深遠で強力な機能を提供します。

Composer でのインストール
-------------------------

長い間、CakePHP 2.x は PHPUnit 3.7.x のみをサポートしてきました。
Composer で開発に必要なものとして PHPUnit をインストールするには、
composer.json と同じディレクトリーで次を実行してください。 ::

    php composer.phar require --dev phpunit/phpunit:"3.7.38"

CakePHP 2.10.0 以降、PHPUnit 4.x や 5.x の基本サポートが追加されました。
あなたのアプリケーションで PHPUnit とそれに依存するライブラリーをアップグレードするには、
次を実行してください。 ::

    php composer.phar require --dev phpunit/phpunit:"4.* || 5.*" --update-with-dependencies

これにより、システム設定と composer.json の設定に応じて、
PHPUnit 4.x または 5.x のいずれかがインストールされます。

.phar パッケージでのインストール
--------------------------------

ファイルを直接ダウンロードします。まず、 http://phar.phpunit.de/ から適切なバージョンを
取得しておきます。そして php.ini ファイルの include_path に /usr/local/bin を加えてください。 ::

    wget https://phar.phpunit.de/phpunit-3.7.38.phar -O phpunit.phar
    chmod +x phpunit.phar
    mv phpunit.phar /usr/local/bin/phpunit

.. note::

    PHPUnit 4 は CakePHP のユニットテスト機能と互換性がありません。

    システムの設定によっては、上記のコマンドを実行する際、 ``sudo`` を各行の前につける必要があります。

.. note::
    CakePHP 2.5.7 以上では、 vendors もしくは app/Vendor ディレクトリに直接 phar パッケージを
    置くことができます。

.. tip::

    PHPUnit 3.7 以上では全ての出力が非表示になります。表示するためには、コマンドラインから
    実行するときに ``--debug`` オプションをつけるか、ウェブランナーを使うときに ``&debug=1``
    を URL に付け足してください。

テスト用データベースのセットアップ
==================================

テストを実行する前に、 ``app/Config/core.php`` のデバッグレベルを必ず1以上にしておきましょう。
デバッグレベルが 0 のとき、テストライブラリはウェブランナーからアクセスすることができません。
テストを実行する前には、必ず ``$test`` のデータベース設定を追加しましょう。この設定は CakePHP の
フィクスチャテーブルやデータで使われます。 ::

    public $test = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host'       => 'dbhost',
        'login'      => 'dblogin',
        'password'   => 'dbpassword',
        'database'   => 'test_database'
    );

.. note::

    テストデータベースは実際のデータベースとは別のデータベースを作成することをお勧めします。
    後々に起こりうる厄介な失敗を防ぐことができます。

テストが実行できるか確認する
============================

PHPUnit のインストールと ``$test`` データベースの設定が無事に済んだでしょうか？
これであなたのアプリのコアをテストする準備が整いました。テストを実行する方法は2つ組み込まれてありますが、
これから実行するのはウェブランナーを使う方法です。テストケースには http://localhost/your_app/test.php に
ブラウザでアクセスすることで見ることができます。すでにコアのテストケースのリストが並んでいることでしょう。
'AllConfigure' のリンクをクリックしてください。グリーンバーと実行したテストや成功したテストの数など、
いくつかの追加情報が表示されます。

おめでとうございます！テストを書く準備が整いました！

テストケースの規約
==================

CakePHP におけるほとんどのことがそうであるように、テストケースにもいくつか規約があります。
規約は以下のとおりです。:

#. テストを含む PHP ファイルは、 ``app/Test/Case/[Type]`` というディレクトリに置きます。
#. ファイル名の最後は必ずただ .php とだけ書くのではなく ``Test.php`` とします。
#. テストを含むクラスは必ず ``CakeTestCase`` または ``ControllerTestCase`` 、
   ``PHPUnit_Framework_TestCase`` を継承します。
#. 他のクラスと同じく、テストケースのクラスを書いたファイル名もクラス名と同じにします。たとえば、
   ``RouterTest.php`` は ``class RouterTest extends CakeTestCase``
   を含んでいなければなりません。
#. テストを含むメソッド (つまりアサーションを含むメソッド) はいずれも ``testPublished()``
   といったように ``test`` で始まる名前にします。 ``@test`` というアノテーションをメソッドに
   マークすることでテストメソッドとすることもできます。

テストケースを作成すると、ブラウザから ``http://localhost/your_app/test.php``
(あなたの環境にしたがって URL を読み替えてください) を開き、そこからテストを実行することができます。
アプリのテストケースをクリックしたあと、テストしたい内容のリンクをクリックします。
以下のようなコマンドを実行すればシェルからテストすることができます。 ::

    ./Console/cake test app Model/Post

この例では、Post モデルをテストしています。

最初のテストケースを作成する
============================

一例として、非常に簡単なヘルパーメソッドのためのテストケースを作成します。
これからテストのために作成するメソッドは HTML でプログレスバーを作成します。
おおよそこのような感じです。 ::

    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

非常に簡単な例ですが、シンプルなテストケースを作成する方法をお見せするのに役立つことでしょう。
ヘルパーを作成し、保存したら、 ``app/Test/Case/View/Helper/ProgressHelperTest.php``
にテストケースのファイルを作成します。このファイルにまず、以下のように書き込みます。 ::

    App::uses('Controller', 'Controller');
    App::uses('View', 'View');
    App::uses('ProgressHelper', 'View/Helper');

    class ProgressHelperTest extends CakeTestCase {
        public function setUp() {

        }

        public function testBar() {

        }
    }

ここからすぐに中身を増やしていきます。まずはメソッドを2つ加えました。
ひとつは ``setUp()`` です。このメソッドはこのテストケースクラスのテストメソッドが
呼び出される前に毎回呼び出されます。セットアップメソッドはテストに必要なオブジェクトの
初期化や設定を行います。今回のセットアップメソッドには次のように書き加えます。 ::

    public function setUp() {
        parent::setUp();
        $Controller = new Controller();
        $View = new View($Controller);
        $this->Progress = new ProgressHelper($View);
    }

テストケースで親クラスのメソッドを呼ぶことは重要です。 ``CakeTestCase::setUp()``
は :php:class:`Configure` に値を後退させたり、 :php:class:`App` にパスを保管したりといった
いくつかの作業をしているからです。

次に、テストメソッドの内容を充実させていきます。あなたの書いたコードが期待した結果を
出力するかどうか保証するため、アサーションを使います。 ::

    public function testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

上記のテストはシンプルですが、テストケースを使うことによる利益の可能性を示しています。
このコードでは ``assertContains()`` を使うことで、ヘルパーが返した値に、期待した文字列が
含まれていることを保証しています。もし期待した文字列が含まれていなければテストは失敗し、
コードが正しくないことがわかります。

テストケースを使うことにより、 あなたは既知の入力セットと期待される出力結果との関係を
簡単に記述することができます。これにより、あなたの書いたコードが期待した動作を満たしているかどうか
簡単に確かめることができます。あなたはより自信を持ってコードを書くことができるようになる
手助けをしてくれます。
くわえて、テストはコードなので、変更を加えたときに再度実行することが容易となります。
これは新たなバグの生成を防ぐ手助けをしてくれるでしょう。

.. _running-tests:

テストの実行
============

PHPUnit をインストールし、テストケースをいくつか書いたら、テストを何度も何度も実行したくなるでしょう。
何らかの変更をコミットする前に、テストを実行することで何も壊していないか確認することはとてもいい考えです。

ブラウザからテストを実行する
----------------------------

CakePHP はテストを実行するためのウェブベースのインタフェースを提供しており、ブラウザを通して
テストを実行することができます。ウェブランナーには ``http://localhost/your_app/test.php`` から
アクセスすることができます。test.php の実際の場所は、あなたのセットアップのしかたによって変わるものの、
``index.php`` と同じ階層にあります。

テストランナーを起動したら、あなたのアプリとコア、プラグインのテストスイートを実行できます。
それぞれのリンクをクリックするとテストケースを実行し、結果を表示します。

コードカバレッジの確認
~~~~~~~~~~~~~~~~~~~~~~

`Xdebug <http://xdebug.org>`_ をインストールしてあればコードカバレッジの結果を見ることができます。
コードカバレッジはあなたの書いたテストが網羅していないコードの部分があるか知るために有用です。
また、将来テストを追加するべきか決定するときにも有用ですし、テストの進捗率を計測する
指標のひとつとしても一役買ってくれます。

.. |Code Coverage| image:: /_static/img/code-coverage.png

|Code Coverage|

インラインコードカバレッジでは緑色の行は実行したことを示しています。緑色の行にポインタを置くと、
どのテストがカバーしているか示してくれます。実行されなかった行は赤で示されます。これはテストが
うまく働かなかったことを示します。
グレーの行は Xdebug によって実行できないと考えられた行です。

.. _run-tests-from-command-line:

コマンドラインからのテスト実行
------------------------------

CakePHP はテストを実行するために ``test`` シェルを提供します。test シェルを使うことでアプリやコア、
プラグインのテストを簡単に行うことができます。
また、コマンドラインから通常どおり PHPUnit を使う際に利用できる引数をすべて使うことができます。
``App`` ディレクトリから以下のようなコマンドを打つことでテストを実行できます。 ::

    # アプリのモデルのテストを実行する
    ./Console/cake test app Model/Article

    # プラグインのコンポーネントのテストを実行する
    ./Console/cake test DebugKit Controller/Component/ToolbarComponent

    # CakePHP の Configue クラスのテストを実行する
    ./Console/cake test core Core/Configure

.. note::

    セッションと相互作用するテストを実行するときは、基本的に ``--stderr`` オプションを使うように
    するとうまくいきます。これにより、 *headers_sent warning* によってテストが失敗する問題が
    解決するでしょう。

.. versionchanged:: 2.1
    ``test`` シェルは 2.1 で追加されました。2.0 の ``testsuite`` シェルは現在も利用できますが、
    こちらを使うことをおすすめします。

``test`` シェルはプロジェクトのルートディレクトリからも実行できます。このときは今実行できるす
べてのテストのリストを見ることができます。どちらのテストを実行するかは自由に選ぶことができます。 ::

    # プロジェクトのルートディレクトリでアプリのテストケースを実行する
    lib/Cake/Console/cake test app

    # プロジェクトのルートディレクトリで ./myapp のアプリケーションのテストを実行する
    lib/Cake/Console/cake test --app myapp app

テストケースのフィルタリング
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

たくさんのテストケースがあると、その中からサブセットだけをテストしたいときや、失敗したテストだけを
実行したいときがあると思います。コマンドラインからテストメソッドをフィルタリングするときは
以下のようにします。 ::

    ./Console/cake test core Console/ConsoleOutput --filter testWriteArray

実行したいテストメソッドは、大文字小文字を区別する正規表現を使ってフィルタリングすることができます。

コードカバレッジの生成
~~~~~~~~~~~~~~~~~~~~~~

コマンドラインから PHPUnit に組み込まれたコードカバレッジツールを用いて、コードカバレッジの
レポートを生成することができます。PHPUnit はカバレッジの結果を含む静的な HTML ファイルを
いくつか生成します。テストケースのカバレッジを生成するには以下のようにします。 ::

    ./Console/cake test app Model/Article --coverage-html webroot/coverage

カバレッジの結果はアプリケーションの webroot ディレクトリに配置されます。
これらのファイルには ``http://localhost/your_app/coverage`` からアクセスすることができます。

セッションを利用するテストの実行
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

コマンドラインからセッションを利用するテストを実行するときは、 ``--stderr`` フラグを付ける
必要があります。そうしないと、セッションが動作しない原因となります。
PHPUnit はデフォルトでは標準出力にテストの進行状況を出力しますが、
これによって PHP はヘッダが送信されたと認識するため、セッションの開始が妨害されます。
PHPUnit の出力先を標準エラーに切り替えることで、この問題を避けることができます。


テストケースのライフサイクルコールバック
========================================

テストケースは以下のようにいくつかのライフサイクルコールバックを持っており、
テストの際に使うことができます。

* ``setUp`` はテストメソッドの前に毎回呼ばれます。 テストされるオブジェクトの生成や、テストのための
  データの初期化に使われるべきです。 ``parent::setUp()`` を呼び出すのを忘れてはいけません。
* ``tearDown`` はテストメソッドの後に毎回呼ばれます。テストが完了した後のクリーンアップに
  使われるべきです。 ``parent::tearDown()`` を忘れてはいけません。
* ``setupBeforeClass`` はクラスのテストメソッドを実行する前に一度だけ呼ばれます。このメソッドは
  *static* でなければなりません。
* ``tearDownAfterClass`` はクラスのテストメソッドをすべて実行した後に一度だけ呼ばれます。
  このメソッドは *static* でなければなりません。

フィクスチャ
============

テストコードの挙動がデータベースやモデルに依存するとき、テストに使うためのテーブルを生成し、
一時的なデータをロードするために **フィクスチャ** を使うことができます。フィクスチャを使うことにより、
実際のアプリケーションに使われているデータに惑わされることなくテストができるというメリットがあります。
加えて、アプリケーションのためのコンテンツを実際に用意するより先にコードをテストすることができます。

このとき、CakePHP は設定ファイル  ``app/Config/database.php`` にある ``$test`` という名前の
データベース接続設定を使います。この接続が使えないときは例外が発生し、フィクスチャを使うことができません。

CakePHP はフィクスチャに基づいたテストケースを実行するにあたり、以下の動作をします。

#. 各フィクスチャで必要なテーブルを作成する
#. フィクスチャにデータが存在すれば、それをテーブルに投入する
#. テストメソッドを実行する
#. フィクスチャのテーブルを空にする
#. データベースからフィクスチャが作成していたテーブルを削除する

フィクスチャの作成
------------------

フィクスチャを作成するときは主にふたつのことを定義します。ひとつはどのようなフィールドを持った
テーブルを作成するか、もうひとつは初期状態でどのようなレコードをテーブルに配置するかです。
それでは最初のフィクスチャを作成してみましょう。この例では Article モデルのフィクスチャを作成します。
``app/Test/Fixture`` というディレクトリに ``ArticleFixture.php`` という名前のファイルを作成し、
以下のとおりに記述してください。::

    class ArticleFixture extends CakeTestFixture {

          // 任意。
          // 異なるテスト用データソースにフィクスチャを読み込む時にこのプロパティを指定してください。
          public $useDbConfig = 'test';
          public $fields = array(
              'id' => array('type' => 'integer', 'key' => 'primary'),
              'title' => array(
                'type' => 'string',
                'length' => 255,
                'null' => false
              ),
              'body' => 'text',
              'published' => array(
                'type' => 'integer',
                'default' => '0',
                'null' => false
              ),
              'created' => 'datetime',
              'updated' => 'datetime'
          );
          public $records = array(
              array(
                'id' => 1,
                'title' => 'First Article',
                'body' => 'First Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:39:23',
                'updated' => '2007-03-18 10:41:31'
              ),
              array(
                'id' => 2,
                'title' => 'Second Article',
                'body' => 'Second Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:41:23',
                'updated' => '2007-03-18 10:43:31'
              ),
              array(
                'id' => 3,
                'title' => 'Third Article',
                'body' => 'Third Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:43:23',
                'updated' => '2007-03-18 10:45:31'
              )
          );
     }

``$useDbConfig`` プロパティはフィクスチャが使うデータソースの定義をします。
複数のデータソースを使うときは、モデルのデータソースと合わせてフィクスチャを
作るようにします。ただし、 ``test_`` というプレフィックスをつけてください。
たとえば、 ``mydb`` というデータソースを使うモデルの場合は、フィクスチャの
データソースを ``test_mydb`` とします。もし ``test_mydb`` の接続が
存在しなかったときは規定値として ``mydb`` がデータソースとして使われます。
テストを実行するときにテーブル名の衝突を避けるため、フィクスチャのデータソースには
``test`` の接頭辞が必ず付きます。

``$fields`` ではテーブルを構成するフィールドと、その定義を記述します。
フィールドの定義には :php:class:`CakeSchema` と同じ書式を使います。
テーブルの定義で特に重要な変数を以下に示します。

``type``
    CakePHP の内部型定義です。現在サポートしているのは以下の型です
        - ``string``: ``VARCHAR`` と対応
        - ``text``: ``TEXT`` と対応
        - ``biginteger``: ``BIGINT`` と対応
        - ``smallinteger``: ``SMALLINT`` と対応
        - ``tinyinteger``: データベースプラットフォームに応じて ``TINYINT`` または
	  ``SMALLINT`` と対応
        - ``integer``: ``INT`` と対応
        - ``float``: ``FLOAT`` と対応
        - ``decimal``: ``DECIMAL`` と対応
        - ``datetime``: ``DATETIME`` と対応
        - ``timestamp``: ``TIMESTAMP`` と対応
        - ``time``: ``TIME`` と対応
        - ``date``: ``DATE`` と対応
        - ``binary``: ``BLOB`` と対応
        - ``boolean``: ``BOOLEAN`` または MySQL の ``TINYINT(1)`` と対応
``key``
    ``primary`` を設定するとフィールドに *field AUTO\_INCREMENT* と *PRIMARY KEY* が適用されます。
``length``
    フィールドが許容するサイズを設定します。
``null``
    ``true`` ( *NULL* を許容する)または ``false`` ( *NULL* を許容しない)のいずれかを設定します。
``default``
    フィールドの規定値を設定します。

フィクスチャのテーブルを作成してから、そのテーブルに投入するレコードを定義することができます。
``$records`` はレコードの配列であり、データの書式もとても簡単です。
``$records`` の各アイテムはひとつの行を表し、カラム名と値の連想配列で構成されます。
$records の持つ配列は各要素 **ごとに** ``$fields`` で指定した特定のキーを
持たなければならないことを覚えておいてください。あるフィールドの値を ``null`` と
したいときは、そのキーの値を ``null`` とします。

動的データとフィクスチャ
------------------------

レコードのフィクスチャをクラスプロパティとして定義すると、関数を使ったり、フィクスチャの定義に
他の動的なデータを使用することは易しいものではありません。
解決策として、 ``$records`` をフィクスチャクラスの関数 init() で定義するという方法があります。
たとえば、「created」と「updated」のタイムスタンプに今日の日付を反映させたいのであれば、
以下のようにするとよいでしょう。 ::

    class ArticleFixture extends CakeTestFixture {

        public $fields = array(
            'id' => array('type' => 'integer', 'key' => 'primary'),
            'title' => array('type' => 'string', 'length' => 255, 'null' => false),
            'body' => 'text',
            'published' => array('type' => 'integer', 'default' => '0', 'null' => false),
            'created' => 'datetime',
            'updated' => 'datetime'
        );

        public function init() {
            $this->records = array(
                array(
                    'id' => 1,
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'updated' => date('Y-m-d H:i:s'),
                ),
            );
            parent::init();
        }
    }

``init()`` をオーバーライドするときは ``parent::init()`` を呼び出すのを忘れないようにしましょう。

.. note::

    2.x のフィクスチャは、外部キー制約を処理しないことに注意してください。

テーブル情報とレコードのインポート
----------------------------------

アプリケーションに動作するモデルがあり、モデルが扱うテーブルに実際のデータがある場合、
そのデータとモデルをテストに使いたいと思うことがあるでしょう。
しかし、そのためにわざわざテーブルとフィクスチャの定義をすることは
二重の努力となってしまうでしょう。幸いにも CakePHP には、既存のモデルとテーブルから
特定のフィクスチャのテーブルとレコードを定義する方法があります。

例を見てみましょう。アプリケーション中に「Article」という名前のモデルがあり、
それが「articles」というテーブルにマップされているとします。前節で作成した
例のフィクスチャ (``app/Test/Fixture/ArticleFixture.php``) を、
次のように書き換えてください。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = 'Article';
    }

この構文は、「Article」モデルにリンクしたテーブルから、テーブル定義を読み込むよう
統合テストツール (test suite) に伝えます。モデルは、アプリケーションに存在する全てのものを扱えます。
上記の構文では「Article」のスキーマを読み込むだけなのでレコードを読み込みません。読み込むためには
コードを次のように変更してください。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('model' => 'Article', 'records' => true);
    }

一方、モデルが存在しないテーブルの場合はどうするのでしょうか。その場合、代わりにテーブルの情報を
読み込みよう定義することができます。例は次の通りです。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles');
    }

この例では「articles」というテーブルから定義をインポートします。このとき CakePHP は
「default」という名前のデータベース接続設定を使います。これを変更したい場合は
次のように書き換えます。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'connection' => 'other');
    }

CakePHP のデータベース接続においてテーブル名のプレフィックスが指定されていたら、テーブル情報を
取得するときにそのプレフィックスは自動的に使用されます。また、前述したふたつの例において、
レコードは読み込まれません。読み込むには、次のようにします。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'records' => true);
    }

既存のテーブルやモデルからテーブルの定義をインポートすることができますが、前節で紹介したように
フィクスチャに対して読み込むレコードを直接定義することができます。方法は例のとおりです。 ::

    class ArticleFixture extends CakeTestFixture {
        public $import = 'Article';
        public $records = array(
            array(
              'id' => 1,
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'updated' => '2007-03-18 10:41:31'
            ),
            array(
              'id' => 2,
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'updated' => '2007-03-18 10:43:31'
            ),
            array(
              'id' => 3,
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'updated' => '2007-03-18 10:45:31'
            )
        );
    }

テストケースからのフィクスチャの読み込み
----------------------------------------

フィクスチャを作成したらそれらをテストで使いたくなることでしょう。
各テストケースではクエリの実行に際して必要となるモデルのフィクスチャをロードすることができます。
フィクスチャをロードするには、テストケースに ``$fixtures`` プロパティを設定します。 ::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
    }

上記の例では、「Article」と「Comment」フィクスチャをアプリケーションの
「Fixture」ディレクトリからロードします。同じように CakePHP のコアや
プラグインからもロードすることができます。 ::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('plugin.debug_kit.article', 'core.comment');
    }

``core`` のプレフィックスを使えば CakePHP から、プラグイン名をプレフィックスとして使えば
その名前のプラグインからフィクスチャをロードします。

フィクスチャのロードは :php:attr:`CakeTestCase::$autoFixtures` を
``false`` に設定したあと、テストメソッドの中で
:php:meth:`CakeTestCase::loadFixtures()`:: を使ってを制御することもできます。 ::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
        public $autoFixtures = false;

        public function testMyFunction() {
            $this->loadFixtures('Article', 'Comment');
        }
    }

2.5.0 から、サブディレクトリ中のフィクスチャをロードできます。複数ディレクトリを使用することは、
大規模なアプリケーションで、フィクスチャを整理しやすくします。サブディレクトリ中のフィクスチャを
ロードするためには、フィクスチャ名にサブディレクトリを加えてください。 ::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.blog/article', 'app.blog/comment');
    }

上記の例では、両方のフィクスチャは、 ``App/Test/Fixture/blog/`` からロードされます。

.. versionchanged:: 2.5
    2.5.0 から、サブディレクトリ中のフィクスチャをロードできます。

モデルのテスト
==============

まず ``app/Model/Article.php`` に「Article」モデルを定義しましょう。以下のように記述します。 ::

    class Article extends AppModel {
        public function published($fields = null) {
            $params = array(
                'conditions' => array(
                    $this->name . '.published' => 1
                ),
                'fields' => $fields
            );

            return $this->find('all', $params);
        }
    }

このモデルの機能をテストするために、このモデルの定義とフィクスチャを使って
テストのセットアップを行います。CakePHP のテストスイートはテストの独立性を
確保するため、ごく最小限のファイルしかロードしません。
そこで、まずはモデルをロードするところからはじめなければなりません。
この場合、すでに定義した「Article」モデルのことを指します。

それでは ``ArticleTest.php`` というファイルを ``app/Test/Case/Model``
というディレクトリに作成し、以下のように記述しましょう。 ::

    App::uses('Article', 'Model');

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article');
    }

このテストケースでは ``$fixtures`` にこの章で今まで定義してきたフィクスチャを設定します。
クエリを実行するにあたり、必要なフィクスチャをすべてインクルードするのを忘れないでください。

.. note::

    ``$useDbConfig`` プロパティを指定することで、テストモデルの
    データベースをオーバーライドできます。テーブルが正しいデータベースで
    生成されるように、関連するフィクスチャが同じ値を使うことを確認してください。

テストメソッドの作成
----------------------

それでは「Article」モデルの「published()」メソッドのためのテストメソッドを書き加えます。
``app/Test/Case/Model/ArticleTest.php`` を編集して、以下のようにしてください。 ::

    App::uses('Article', 'Model');

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article');

        public function setUp() {
            parent::setUp();
            $this->Article = ClassRegistry::init('Article');
        }

        public function testPublished() {
            $result = $this->Article->published(array('id', 'title'));
            $expected = array(
                array('Article' => array('id' => 1, 'title' => 'First Article')),
                array('Article' => array('id' => 2, 'title' => 'Second Article')),
                array('Article' => array('id' => 3, 'title' => 'Third Article'))
            );

            $this->assertEquals($expected, $result);
        }
    }

``testPublished()`` というメソッドを追加したのがお分かりでしょう。
まず ``Article`` モデルのインスタンスを作成し、次に ``published()`` メソッドを実行します。
``$expected`` には、初期状態でどのようなレコードが「articles」テーブルに投入されているかを
知っている上で、期待する値として適切なものを設定します。
実行結果と期待した値が同じであるかは ``assertEquals`` メソッドを使ってテストします。
:ref:`running-tests` には、テストケースを実行するためのより詳しい情報があります。

.. note::

    テストのためにモデルをセットアップするときは、テスト用のデータベース接続を
    使うようにするために必ず ``ClassRegistry::init('YourModelName');``
    を使ってください。

モデルのメソッドのモック化
--------------------------

テストを記述しているとき、モデルのモックメソッドが欲しくなるときがあるでしょう。
モデルのテストモックを作成するために ``getMockForModel`` を使いましょう。
このメソッドは、モック自体のプロパティが反映されてしまう問題を回避します。 ::

    public function testSendingEmails() {
        $model = $this->getMockForModel('EmailVerification', array('send'));
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

.. versionadded:: 2.3
    CakeTestCase::getMockForModel() は 2.3 で追加されました。

コントローラーのテスト
======================

ヘルパーやモデル、コンポーネントも同様に、CakePHP は ``ControllerTestCase`` という
コントローラーのテストに特化したクラスを提供します。
このクラスをコントローラーのテストケースの親クラスとすることで、
コントローラーのテストケースを ``testAction()`` というメソッドでより簡単にすることができます。
``ControllerTestCase`` は擬似的にコンポーネントやモデルを動かすだけでなく、
:php:meth:`~Controller::redirect()` のように潜在的にテストが難しいメソッドの
テストも簡単にしてくれます。

下記のように、「Article」モデルに対応した典型的なコントローラーがあるとします。 ::

    class ArticlesController extends AppController {
        public $helpers = array('Form', 'Html');

        public function index($short = null) {
            if (!empty($this->request->data)) {
                $this->Article->save($this->request->data);
            }
            if (!empty($short)) {
                $result = $this->Article->find('all', array('id', 'title'));
            } else {
                $result = $this->Article->find('all');
            }

            if (isset($this->params['requested'])) {
                return $result;
            }

            $this->set('title', 'Articles');
            $this->set('articles', $result);
        }
    }

ディレクトリ ``app/Test/Case/Controller`` に ``ArticlesControllerTest.php``
というファイルを作成し、次のように記述します。 ::

    class ArticlesControllerTest extends ControllerTestCase {
        public $fixtures = array('app.article');

        public function testIndex() {
            $result = $this->testAction('/articles/index');
            debug($result);
        }

        public function testIndexShort() {
            $result = $this->testAction('/articles/index/short');
            debug($result);
        }

        public function testIndexShortGetRenderedHtml() {
            $result = $this->testAction(
               '/articles/index/short',
                array('return' => 'contents')
            );
            debug($result);
        }

        public function testIndexShortGetViewVars() {
            $result = $this->testAction(
                '/articles/index/short',
                array('return' => 'vars')
            );
            debug($result);
        }

        public function testIndexPostData() {
            $data = array(
                'Article' => array(
                    'user_id' => 1,
                    'published' => 1,
                    'slug' => 'new-article',
                    'title' => 'New Article',
                    'body' => 'New Body'
                )
            );
            $result = $this->testAction(
                '/articles/index',
                array('data' => $data, 'method' => 'post')
            );
            debug($result);
        }
    }

この例はコントローラーのテストに testAction を使う方法のいくつかを示しています。
``testAction`` の第１引数は常にテストする URL を取ります。CakePHP はリクエストを作成し、
コントローラーとアクションにディスパッチします。

``redirect()`` を含むアクションやリダイレクトに従う他のコードをテストするときは、
リダイレクトの際 return することは通常良い考えです。
この理由はテスト中、 ``redirect()`` が mock されており、通常通り終了しないからです。
そしてあなたのコードを終了する代わりに、リダイレクトを追跡して実行を継続します。
例を示します。 ::

    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
            // more code
        }
    }

上記のコードをテストすると、リダイレクトに到達したにもかかわらず ``// more code`` が
実行されてしまいます。代わりに、このようなコードを書くべきです。 ::

    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    return $this->redirect(array('action' => 'index'));
                }
            }
            // more code
        }
    }

この例ではメソッドがリダイレクトに到達した際にreturnするので、 ``// more code`` は実行されません。

GETリクエストのシミュレート
---------------------------

上の例の ``testIndexPostData()`` では、 ``testAction()`` は POST だけでなく
GET リクエストのアクションとしても使えます。 ``data`` キーによって
POST されるであろう値を設定します。規定ではすべてのリクエストはPOSTと扱われます。
GET リクエストをシミュレートしたい場合は ``method`` キーを設定します。 ::

    public function testAdding() {
        $data = array(
            'Post' => array(
                'title' => 'New post',
                'body' => 'Secret sauce'
            )
        );
        $this->testAction('/posts/add', array('data' => $data, 'method' => 'get'));
        // some assertions.
    }

``data`` キーは GET リクエストのクエリ文字列のパラメータをシミュレートするときに使われます。

returnする値の選択
------------------

コントローラーのアクションが成功したかどうかを調査する方法はいくつかから選択することができます。
それぞれは違った方法であなたのコードが期待した動きをしているか保証するための手段を提供します。

* ``vars`` ビューの値を取得します。
* ``view`` レイアウト以外の描画されるビューを取得します。
* ``contents`` レイアウトを含む描画されるビューを取得します。
* ``result`` コントローラーのアクションが返す値を取得します。requestAction メソッドの
  テストに対して有用です。

規定値は ``result`` です。 戻り値の属性を ``result`` 以外にしない限り、
テストケース内で他の種類の戻り値の属性にアクセスすることができます。 ::

    public function testIndex() {
        $this->testAction('/posts/index');
        $this->assertInternalType('array', $this->vars['posts']);
    }


テストアクションによるモックの使用
----------------------------------

コンポーネントやモデルの一部または全部をモックにより置き換えたい時があるでしょう。
そういったときは :php:meth:`ControllerTestCase::generate()` を使うとよいでしょう。
``generate()`` はコントローラーにおいてモックを作成する強力なワークアウトを持ちます。
テストで使われるコントローラーを決定したら、同時にモデルとコンポーネントの
モックを生成できます。 ::

    $Posts = $this->generate('Posts', array(
        'methods' => array(
            'isAuthorized'
        ),
        'models' => array(
            'Post' => array('save')
        ),
        'components' => array(
            'RequestHandler' => array('isPut'),
            'Email' => array('send'),
            'Session'
        )
    ));

上の例では ``isAuthorized`` というメソッドをスタブにしている ``PostsController`` のモックを
作成しました。付属された Post モデルはスタブの ``save()`` メソッドを持っていて、
付属されたコンポーネントも、めいめいにスタブされたメソッドを持っています。
上の例での Session のように、メソッドがパスしないことにより、すべてのクラスのスタブを選ぶことができます。

生成されたコントローラーはテストのために自動的に使われます。
自動的な生成を有効にするには、テストケースの ``autoMock`` という変数にtrueを設定します。
``autoMock`` が false であれば、オリジナルのコントローラーがテストに使われるでしょう。

生成されたコントローラーのレスポンスオブジェクトは、
常にヘッダーを送信しないモックを使って置き換えられます。
``generate()`` か ``testAction()`` を使ったあとは、 ``$this->controller`` から
コントローラーのオブジェクトにアクセスできます。

より複雑な例
------------

もっとも単純なフォームでは、 ``testAction()`` は作成したテスト用コントローラーや、
モックされたすべてのモデルやコンポーネントを含め自動的に作成されたものを使い、
``PostsController::index()`` を実行します。
テストの結果は ``vars`` や ``contents`` 、 ``view`` 、 ``return`` といった
プロパティに格納されます。送信されたヘッダー情報には ``headers`` から
アクセスすることができ、リダイレクトを確認することができます。 ::

    public function testAdd() {
        $Posts = $this->generate('Posts', array(
            'components' => array(
                'Session',
                'Email' => array('send')
            )
        ));
        $Posts->Session
            ->expects($this->once())
            ->method('setFlash');
        $Posts->Email
            ->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $this->testAction('/posts/add', array(
            'data' => array(
                'Post' => array('title' => 'New Post')
            )
        ));
        $this->assertContains('/posts', $this->headers['Location']);
    }

    public function testAddGet() {
        $this->testAction('/posts/add', array(
            'method' => 'GET',
            'return' => 'contents'
        ));
        $this->assertRegExp('/<html/', $this->contents);
        $this->assertRegExp('/<form/', $this->view);
    }


ここでは、 ``testAction()`` と ``generate()`` メソッドの少々複雑な使用例を示しています。
まず、テストするコントローラーを作成し、 :php:class:`SessionComponent` をモックします。
SessionComponent がモックされたことで、それを用いたテストメソッドの実行が可能となります。

``PostsController::add()`` が index にリダイレクトを実行し、
メールを送信したあと、flash メッセージを設定すればテストは合格です。
例のために、レンダリングされたコンテンツ全体を確かめることでレイアウトがロードされたか、
また、formタグのためにビューをチェックするかどうかを確認するため、同様にチェックします。
見てのとおり、コントローラーをテストする自由度と、モックを扱う容易さは、
これらの変更により大きく拡張されます。

静的メソッドを使うモックを用いてコントローラーのテストをするときは、
モックに期待する値を登録する別のメソッドを用います。
たとえば :php:meth:`AuthComponent::user()` のモックを使いたい場合は以下のようにします。 ::

    public function testAdd() {
        $Posts = $this->generate('Posts', array(
            'components' => array(
                'Session',
                'Auth' => array('user')
            )
        ));
        $Posts->Auth->staticExpects($this->any())
            ->method('user')
            ->with('id')
            ->will($this->returnValue(2));
    }

``staticExpects`` を使うことにより、コンポーネントやモデルの静的メソッドをモック、
操作することができるようになります。

.. warning::
    PHPUnit 4 や 5 を使用している場合、 ``staticExpects()`` はもはや存在しません。
    代わりに、アクションを呼ぶ前に ``CakeSession::write('Auth.User', $user)`` を使って
    セッションの中に必要なデータを挿入してください。

JSON を返すコントローラーのテスト
---------------------------------

JSON はウェブサービスの構築において、とても馴染み深く、かつ基本的なフォーマットです。
CakePHP を用いたウェブサービスのエンドポイントのテストはとてもシンプルです。
JSON を返すコントローラーの簡単な例を示します。 ::

    class MarkersController extends AppController {
        public $autoRender = false;
        public function index() {
            $data = $this->Marker->find('first');
            $this->response->body(json_encode($data));
        }
    }

ウェブサービスが適切なレスポンスを返しているか確認するテストを作成しましょう。
``app/Test/Case/Controller/MarkersControllerTest.php``
というファイルを以下のように作成します。 ::

    class MarkersControllerTest extends ControllerTestCase {
        public function testIndex() {
            $result = $this->testAction('/markers/index.json');
            $result = json_decode($result, true);
            $expected = array(
                'Marker' => array('id' => 1, 'lng' => 66, 'lat' => 45),
            );
            $this->assertEquals($expected, $result);
        }
    }

ビューのテスト
==============

一般的に、ほとんどのアプリケーションは、直接 HTML コードをテストしません。
そのため、多くの場合、テストは壊れやすく、メンテナンスが困難になっています。
:php:class:`ControllerTestCase` を使用して機能テストを書くときに 'view' に
``return`` オプションを設定することで、レンダリングされたビューの内容を調べることができます。
これによりビューの内容をテストすることは可能ですが、より堅牢でメンテナンスしやすい統合/ビューテストは
`Selenium webdriver <http://seleniumhq.org>`_ のようなツールを使うことで実現できます。

コンポーネントのテスト
======================

``PagematronComponent`` というコンポーネントがアプリケーションにあったとしましょう。
このコンポーネントは、このコンポーネントを使用している全てのコントローラーにおいて、
ページネーションの limit 値を設定する手助けをします。例としてコンポーネントが、
``app/Controller/Component/PagematronComponent.php`` にあったとします。 ::

    class PagematronComponent extends Component {
        public $Controller = null;

        public function startup(Controller $controller) {
            parent::startup($controller);
            $this->Controller = $controller;
            // コントローラがページネーションを使っているか確かめる
            if (!isset($this->Controller->paginate)) {
                $this->Controller->paginate = array();
            }
        }

        public function adjust($length = 'short') {
            switch ($length) {
                case 'long':
                    $this->Controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->Controller->paginate['limit'] = 50;
                break;
                default:
                    $this->Controller->paginate['limit'] = 20;
                break;
            }
        }
    }

ページネーションの ``limit`` 値がコンポーネントの ``adjust`` メソッドによって
正しく設定されているかテストを書くことができます。このように
``app/Test/Case/Controller/Component/PagematronComponentTest.php``
というファイルを作成します。 ::

    App::uses('Controller', 'Controller');
    App::uses('CakeRequest', 'Network');
    App::uses('CakeResponse', 'Network');
    App::uses('ComponentCollection', 'Controller');
    App::uses('PagematronComponent', 'Controller/Component');

    // テストの対象となる偽物のコントローラ
    class TestPagematronController extends Controller {
        public $paginate = null;
    }

    class PagematronComponentTest extends CakeTestCase {
        public $PagematronComponent = null;
        public $Controller = null;

        public function setUp() {
            parent::setUp();
            // コンポーネントと偽のテストコントローラをセットアップする
            $Collection = new ComponentCollection();
            $this->PagematronComponent = new PagematronComponent($Collection);
            $CakeRequest = new CakeRequest();
            $CakeResponse = new CakeResponse();
            $this->Controller = new TestPagematronController($CakeRequest, $CakeResponse);
            $this->PagematronComponent->startup($this->Controller);
        }

        public function testAdjust() {
            // 異なる値の設定を用いて adjust メソッドをテストする
            $this->PagematronComponent->adjust();
            $this->assertEquals(20, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('medium');
            $this->assertEquals(50, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('long');
            $this->assertEquals(100, $this->Controller->paginate['limit']);
        }

        public function tearDown() {
            parent::tearDown();
            // 終了した後のお掃除
            unset($this->PagematronComponent);
            unset($this->Controller);
        }
    }

ヘルパーのテスト
================

ヘルパークラスも十分な量のロジックが構築されているのであれば、
テストケースによって機能を満たしているか確認することは重要です。

はじめに、テストのための例として、ヘルパーを作成します。 ``CurrencyRendererHelper`` は、
ビューで通貨の表示を補助するための、 ``usd()`` という唯一の単純なメソッドを持っています。 ::

    // app/View/Helper/CurrencyRendererHelper.php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

このメソッドは、小数点以下2桁を表示し、小数点としてドット、3桁ごとの区切りとして
カンマを使用するフォーマットで数字を表し、さらに 'USD' という文字列を数字の先頭に置きます。

それではテストを作成します。 ::

    // app/Test/Case/View/Helper/CurrencyRendererHelperTest.php

    App::uses('Controller', 'Controller');
    App::uses('View', 'View');
    App::uses('CurrencyRendererHelper', 'View/Helper');

    class CurrencyRendererHelperTest extends CakeTestCase {
        public $CurrencyRenderer = null;

        // ここでヘルパーをインスタンス化する
        public function setUp() {
            parent::setUp();
            $Controller = new Controller();
            $View = new View($Controller);
            $this->CurrencyRenderer = new CurrencyRendererHelper($View);
        }

        // usd() 関数をテストする
        public function testUsd() {
            $this->assertEquals('USD 5.30', $this->CurrencyRenderer->usd(5.30));

            // 常に小数点第二桁までになるべき
            $this->assertEquals('USD 1.00', $this->CurrencyRenderer->usd(1));
            $this->assertEquals('USD 2.05', $this->CurrencyRenderer->usd(2.05));

            // 千倍当たりの区切り文字をテスト
            $this->assertEquals('USD 12,000.70', $this->CurrencyRenderer->usd(12000.70));
        }
    }

ここで、 ``usd()`` を異なるパラメータで呼び出すことで、このテストスイートは
期待した値と同じ値を返しているかを確かめています。

ファイルに保存しテストを実行します。これにより、グリーンバーと
1つのテスト、4つのアサーションに成功したことを指し示すメッセージを見ることができるでしょう。

テストスイートの作成
====================

いくつかのテストを同時に実行したいときはテストスイートを作成することができます。テストスイートはいくつかの
テストケースから構成されています。 ``CakeTestSuite`` は少しばかりですがファイルシステムをベースに
簡単にテストスイートを作成するためのメソッドを提供します。すべてのモデルに対してのテストスイートを
作成したいときは、 ``app/Test/Case/AllModelTest.php`` を作成します。内容は以下のとおりです。 ::

    class AllModelTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All model tests');
            $suite->addTestDirectory(TESTS . 'Case/Model');
            return $suite;
        }
    }

上のコードは ``/app/Test/Case/Model/`` のフォルダ以下に見つかったテストケースをすべてグループ化します。
個別にファイルを追加するときは ``$suite->addTestFile($filename);`` を使います。
あるディレクトリから再帰的にすべてのテストをグループ化する場合は以下のようにします。 ::

    $suite->addTestDirectoryRecursive(TESTS . 'Case/Model');

この例では、 ``app/Test/Case/Model`` のディレクトリ以下のすべてのテストをグループ化します。
アプリケーションのテストをすべて実行するスイートを構築するためにテストスイートを使用することができます。 ::

    class AllTestsTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All tests');
            $suite->addTestDirectoryRecursive(TESTS . 'Case');
            return $suite;
        }
    }

そして、コマンドライン上でこのテストを実行することができます。 ::

    $ Console/cake test app AllTests

プラグインのテスト作成
======================

プラグインのテストは、プラグインのフォルダ内の指定されたディレクトリに作成します。 ::

    /app
        /Plugin
            /Blog
                /Test
                    /Case
                    /Fixture

これらは通常のテストと同じように実行できますが、クラスをインポートするときにプラグインの
命名規則を使うことを覚えておいてください。これはこの本のプラグインの章で紹介した ``BlogPost``
モデルのテストケースの例です。他のテストとの違いは、最初の行で 'Blog.BlogPost' を
インポートしているところです。またプラグインのフィクスチャも ``plugin.blog.blog_post``
というプレフィックスをつける必要があります。 ::

    App::uses('BlogPost', 'Blog.Model');

    class BlogPostTest extends CakeTestCase {

        // プラグインのフィクスチャは /app/Plugin/Blog/Test/Fixture/ に配置される
        public $fixtures = array('plugin.blog.blog_post');
        public $BlogPost;

        public function testSomething() {
            // ClassRegistry はテスト用のデータベースコネクションをモデルが使うようにしてくれる
            $this->BlogPost = ClassRegistry::init('Blog.BlogPost');

            // その他の有用なテストをここに書く
            $this->assertTrue(is_object($this->BlogPost));
        }
    }

アプリケーションのテストでプラグインのフィクスチャを使いたいときは、 ``$fixtures`` の
配列で ``plugin.pluginName.fixtureName`` という構文を使うことで参照できます。

Jenkins によるインテグレーション
================================

`Jenkins <http://jenkins-ci.org>`_ は継続的インテグレーションサービスで、テストケースの自動化を
手助けしてくれます。これにより、すべてのテストをパスし続けていることを保証し、あなたのアプリケーションを
いつでもデプロイできる状態にしてくれます。

CakePHP と Jenkins はかなり簡単にインテグレーションすることができます。ここでの解説は、すでに
Unix ライクな環境に Jenkins がインストールされていて、管理者権限を持つことができる状態を前提とします。
また、ジョブの作成とビルドの方法も知っているものとします。もしわからない場合は
`Jenkins documentation <http://jenkins-ci.org/>`_ または
`Jenkins Wiki日本語版 <https://wiki.jenkins-ci.org/display/JA/Jenkins>`_ を参考にしてください。

ジョブの作成
------------

アプリケーションのためのジョブを作成することから始めてください。次に、Jenkins があなたのコードに
アクセスできるように、リポジトリと接続します。

テスト用データベースの設定の追加
--------------------------------

Jenkins のために別のデータベースを用意するのは、初歩的な問題を回避するためには良い考えです。
一度 Jenkins がアクセスできる (通常は localhostの) データベースサーバに新しくデータベースを
作成しました。以下のような *シェルスクリプトの実行* をビルドに加えてください。 ::

    cat > app/Config/database.php <<'DATABASE_PHP'
    <?php
    class DATABASE_CONFIG {
        public $test = array(
            'datasource' => 'Database/Mysql',
            'host'       => 'localhost',
            'database'   => 'jenkins_test',
            'login'      => 'jenkins',
            'password'   => 'cakephp_jenkins',
            'encoding'   => 'utf8'
        );
    }
    DATABASE_PHP

これにより、Jenkins が要求する正しいデータベース設定が常にあることを保証してくれます。
他の設定ファイルにも同じことをしておきましょう。ときどきビルドする前ごとに、データベースを drop し、
再度 create するとよいでしょう。
一度ビルドに失敗すると、立て続けに起きるであろう失敗の連鎖を断ち切ってくれるはずです。

さらに以下の *シェルスクリプトの実行* をビルドに加えてください。 ::

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

テストの追加
------------

また別の *シェルスクリプトの実行* をビルドに加えてください。このステップではアプリケーションのテストを実行します。
junit のログファイル作成、またはCloverのカバレッジにより、テストの結果を視覚的に確認できるようになります。 ::

    app/Console/cake test app AllTests \
    --stderr \
    --log-junit junit.xml \
    --coverage-clover clover.xml

Clover coverageと jUnit の結果を使えれば、Jenkins が正しく設定できています。
うまく設定できていないとこの結果は見ることができないでしょう。

ビルドを実行する
----------------

これでビルドを実行することができるようになりました。
コンソールの出力を確認して、ビルドをパスするように必要な変更を加えましょう。


.. meta::
    :title lang=ja: テスト
    :keywords lang=ja: web runner,phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
    :keywords lang=ja: PHPUnit,テストデータベース,データベース設定,データベースのセットアップ,データベースのテスト,テストフレームワーク,テストのセットアップ,デファクトスタンダード,pear,ランナー,array,データベース,cakephp,php,統合
