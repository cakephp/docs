テスト(Testing)
###############

CakePHP 1.2
には、テストのための包括的なフレームワークが組み込まれています。このフレームワークは、PHP
向けの SimpleTest
フレームワークを拡張したものです。この章では、テスト、それの構築および実行についての準備をどのようにするかを説明します。

テストの準備
============

心の準備はよろしいですか？では早速はじめてみましょう!

SimpleTest のインストール
-------------------------

SimpleTest のインストール

CakePHP 1.3 のテストフレームワークは、SimpleTest
で構築されています。SimpleTest はデフォルトで CakePHP
に含まれていないため、まずそれをダウンロードしてこなければなりません。ダウンロードは\ `https://simpletest.sourceforge.net/ <https://simpletest.sourceforge.net/>`_\ から行えます。

最新版を取得し、解凍後に vendors もしくは app/vendors
フォルダに展開してください。どちらでも好きな方に設置してかまいません。これで
vendors/simpletest ディレクトリの中に、SimpleTest
のファイルが全て設置された状態になります。テストを走らせる前に、app/config/core.php
でデバッグレベル(DEBUG level)を 1
以上に設定することを忘れないでください!

もし、app/config/database.php
においてテストのためのデータベース接続が定義されていない場合は、\ ``test_suite_``
という前置詞がついたテスト用のテーブルが生成されます。
テスト用のテーブルを格納するための ``$test``
データベース接続を作成するには、次のように行います。

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'databaseName'
        );

もしテスト用のデータベースが利用可能で、CakePHP
がそれに接続することができるなら、全てのテスト用のテーブルはそのデータベースに作成されます。

組み込みのテストケースを実行する
--------------------------------

CakePHP
は、コアの機能としてテストケースをすでに含んでいます。このテストに接続するには、http://ドメイン名/CakePHPのフォルダ/test.php
をブラウズしてください(ただし、この URL
は設定に依ります)。リンクをクリックして、コアのテストグループをどれか一つ実行してみてください。実行には少し時間がかかります。しばらくして、「2/2
test casese complete: 49 passes, 0 fails and 0
exceptions.」といったメッセージが表示されると、テストの実行は完了です。
これで、独自のテストを書く準備が出来ました。

テストについて - 単体テストとウェブテスト
=========================================

CakePHP
のテストのフレームワークは、2種類のテストをサポートしています。ひとつは単体テスト(ユニットテスト、Unit
Testing)です。これはコンポーネントのメソッドや、コントローラのアクションなど、小さな部分に対するテストです。もうひとつはウェブテスト(Web
Testing)です。これは、アプリケーションのテストの時に行うページのナビゲート、フォームの入力、リンクのクリック等の作業を自動化します。

テストデータの準備
==================

フィクスチャ(Fixtures)について
------------------------------

テストコードがモデルやデータに依存する場合、テストで利用する一時的なサンプルデータをデータテーブルに読み込むために、\ **フィクスチャ(\ *fixtures*)**\ を利用できます。フィクスチャを使用することの利点は、テストのために実際のデータをいじらずに済むこと、そして実際のデータを作成する前にコードをテストできるということです。

CakePHP は app/config/database.php で ``$test``
と名前が付けられた設定で接続を試み、もしこの接続が使用できない場合、\ ``$default``
の設定で接続します。接続したら、テスト用のテーブルを作成します。いずれの接続においても、テーブル名の衝突を避けるため、プレフィックスに「test\_suite」を追加した名前でテーブルを作成します。

CakePHP
はフィクスチャに基づいたテストケースを実行するにあたり、次の動作をします。

#. 各フィクスチャで必要なテーブルを作成する。
#. フィクスチャにデータが存在すれば、それをテーブルに投入する。
#. テストのメソッドを実行する。
#. フィクスチャのテーブルを空にする。
#. データベースからフィクスチャが作成したテーブルを削除する。

フィクスチャの作成
------------------

フィクスチャを作成するには、主にふたつの定義を行います。ひとつめは、テーブル構造、すなわち存在するフィールドの定義です。もうひとつは、そのテスト用のテーブルが初期状態で持つデータの定義です。例として、Article
というモデルに対するフィクスチャを作成してみましょう。\ **app/tests/fixtures**
ディレクトリに、\ **article\_fixture.php**
というファイルを作成し、次のように記述してください。

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'title' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'body' => 'text', 
              'published' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'title' => '1番目の記事', 'body' => '1番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'title' => '2番目の記事', 'body' => '2番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'title' => '3番目の記事', 'body' => '3番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
          ); 
     } 
     ?> 

$fields
には、テーブルのフィールドがどのように定義されているかを記述します。書式は、dbo\_mysql.php
など CakePHP のデータベースエンジンクラスにある
**generateColumnSchema()**
関数と同じものです。使用可能な属性とその意味を見ていきましょう。

type
    CakePHP 内部の型。現在は、string (VARCHAR にマップ)、text (TEXT
    にマップ)、integer (INT にマップ)、float (FLOAT にマップ)、datetime
    (DATETIME にマップ)、timestamp (TIMESTAMP にマップ)、time (TIME
    にマップ)、date (DATE にマップ)、そして binary (BLOB にマップ)
    という型がサポートされています。
key
    値を「primary」にセットすると、そのフィールドは AUTO\_INCREMENT
    属性になり、テーブルの主キーになります。
length
    フィールドの長さを設定します。
null
    true をセットすると NULL を許可、false だと NULL を許可しません。
default
    フィールドの初期値を定義します。

最後に、テスト用のテーブルを作成した後に投入するデータをセットします。この書式はとても簡単なので説明は省略しますが、一点だけ注意が必要です。それは、
$records の配列は $fields
で定義した\ **全て**\ のフィールドをキーとして持つ必要があるということです。もし、あるフィールドに
NULL を入れる場合は、そのフィールド名をキーにして値を NULL
をセットしてください。

テーブルの情報とレコードの読み込み
----------------------------------

アプリケーションに動作するモデルがあり、モデルが扱うテーブルに実際のデータが存在する場合、そのデータとモデルをテストに使うことができます。そうした場合、テーブル定義とレコードをフィクスチャに移す必要があります。幸い、存在するテーブルとデータを利用して、特定のフィクスチャのテーブルおよびレコードの定義を行う方法があります。

例を見てみましょう。アプリケーション中に「Article」という名前のモデルがあるとして、それは「articles」テーブルにマップされているとします。前節で作成した例(\ **app/tests/fixtures/article\_fixture.php**)を次のように書き換えてください。

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

この構文は、「Article」モデルにリンクしたテーブルから、テーブル定義を読み込むよう統合テストツール(\ *test
suite*)に伝えます。モデルは、アプリケーションに存在する全てのものを扱えます。上記の構文ではレコードを読み込みません。読み込むためにはコードを次のように変更してください。

::

    <?php   
    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

一方、モデルが存在しないテーブルの場合はどうするのでしょうか。その場合、代わりにテーブルの情報を読み込みよう定義することができます。例は次の通りです。

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

この例では「articles」という名前のテーブルから、テーブル定義を読み込んでいます。その時に
CakePHP
は「default」という名前の設定を使ってデータベースへ接続します。これを変更したい場合は次のようにしてください。

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'other'); 
       } 
       ?> 

CakePHP
のデータベース接続においてテーブル名のプレフィックスが指定されていたら、テーブル情報を取得するときにそのプレフィックスは自動的に使用されます。また、前述したふたつの例において、レコードは読み込まれません。読み込むには、次のようにします。

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

以上の方法で、テーブルまたはモデルから、テーブル情報を読み込むことができます。前の章で説明したように、フィクスチャに対して読み込むレコードを直接定義することもできます。例は次の通りです。

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'title' => '1番目の記事', 'body' => '1番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'title' => '2番目の記事', 'body' => '2番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'title' => '3番目の記事', 'body' => '3番目の記事の内容', 'published' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31') 
              ); 
       } 
     ?> 

テストの作成
============

まずはテストに関するルールとガイドラインを順番に見ていきましょう。

#. テストのための PHP ファイルは、\ **app/tests/cases/フォルダ**
   に設置します。
#. ファイル名は「.php」ではなく「\ **.test.php**\ 」で終わらなければいけません。
#. テストのためのクラスは、\ **CakeTestCase** または **CakeWebTestCase**
   を拡張したものでなければなりません。
#. テストのためのメソッド、つまりアサーション(assertion)の名前は、「\ **test**\ 」で始まらなければなりません。たとえば、「\ **testPublished()**\ 」といったようにです。

テストケースを作成したら、\ **http://ドメイン名/CakePHPのフォルダ/test.php**\ (設定に依る)をブラウズし、「App」の「Test
Cases」をクリックし、作成したファイルへのリンクをクリックすることで実行できます。

CakeTestCase Callback Methods
-----------------------------

If you want to sneak in some logic just before or after an individual
CakeTestCase method, and/or before or after your entire CakeTestCase,
the following callbacks are available:

**start()**


**end()**


**startCase()**


**endCase()**


**before($method)**


**after($method)**


**startTest($method)**


**endTest($method)**


モデルのテスト
==============

テストケースの作成
------------------

すでに app/models/article.php
で「Article」モデルが次のように定義されているとします。

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $conditions = array( 
                      $this->name . '.published' => 1 
                  ); 
                   
                  return $this->findAll($conditions, $fields); 
              } 
       
       } 
     ?> 

モデルの機能をテストするために、上述のモデル定義にフィクスチャを用いてテストするように準備を行うとします。CakePHP
の統合テストツールは、最小限のファイルだけを読み込みます。これは問題の切り分けを容易にするため、他のモデルの干渉を避けるためです。そのためまず、親のモデル(今回の場合は、定義済みの「Article」モデル)を読み込みます。次にどのデータベースの設定を使用するかを指定します。CakePHP
の統合テストツールは、フィクスチャに頼るすべてのモデルで使われる、
test\_suite という名前の DB 設定を有効にします。$useDbConfig
を設定すると、 CakePHP
の統合テストツールが、どのデータベース接続を利用するのかを指定できます。

定義済みのモデルのコードを再利用するために、「Article」クラスを拡張したテストのモデルを作成し、
$useDbConfig と $name を適切に設定します。そのファイルは
**app/tests/cases/models** に **article.test.php**
という名前で保存してください。内容は次のようになります。

::

     <?php  
       App::import('Model','Article'); 

       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

「ArticleTestCase」を作成しました。\ **$fixtures**
変数では、どのフィクスチャを使うかを定義します。

モデルが別のモデルと関連しているなら、関連しているモデルを使用しない場合でも、全てのモデルのフィクスチャを用意しておく必要があります。例えば、
A hasMany B hasMany C hasMany D といった場合、 ATestCase には a, b, c, d
のフィクスチャを含めます。

テストのためのメソッドを作成する
--------------------------------

「Article」モデルの「published()」関数をテストするためのメソッドを作成してみましょう。\ **app/tests/cases/models/article.test.php**
を次のように編集してください。

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article =& ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => '1番目の記事' )),
                    array('Article' => array( 'id' => 2, 'title' => '2番目の記事' )),
                    array('Article' => array( 'id' => 3, 'title' => '3番目の記事' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    


「\ **testPublished()**\ 」という名前のメソッドを追加しました。まずフィクスチャを用いた「\ **Article**\ 」モデルのインスタンスを作成し、次にそのインスタンスの「published()」メソッドを実行します。「article」が初期状態で持つレコードをフィクスチャで定義したので、「published()」メソッドが返すべき値はわかります。この値を、
**$expected**
に設定してください。「\ **assertEqual**\ 」メソッドを用いて、実際の値と期待した値が一致するかをテストします。テストの実行方法は、「テストの作成」の章を参照してください。

コントローラのテスト
====================

テストケースの作成
------------------

下記のように、「Article」モデルに対応した典型的なコントローラーがあるとします。

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>

ファイル名でディレクトリ app/tests/cases/controllers に
articles\_controller.test.php
というファイルを作成し、次のように記述してください。

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>テストケースを開始します</h1>'; 
       } 
       function endCase() { 
         echo '<h1>テストケースを終了します</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>メソッド「' . $method . '」を開始します</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => '新しい記事', 'body' => '新しい記事の本文')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 

testAction メソッド
-------------------

「\ **testAction**\ 」メソッドが、新しく登場しました。第一引数はテストするコントローラアクションの
Cake URL (例えば「/articles/index/short」といったもの) です。

第二引数にはパラメータを配列で渡し、パラメータは次のキーから成ります。

return
    戻り値として得られるべきものを定義します。
     有効な値は次の通りです。
    'vars' - アクションを実行した後に view 変数を取得する。
     'view' - レンダリングされた view
    のうち、レイアウトを除いたものを取得する。
     'contents' - レンダリングされた view
    のうち、レイアウトを含めた完全な HTML を取得する。
     'result' - アクションが $this->params['requested']
    を使用した時に返す値を取得する。
     なお、デフォルトは 'result' です。
fixturize
    true にセットすると、モデルに対し自動的にフィクスチャを適用します。
    それにより、実際のテーブルはレコードと一緒にテスト用のテーブルへとコピーされ、実際のアプリケーションに影響を与えません。

    もしモデル名を配列で与えたら、それらに対して自動的にフィクスチャを適用し、その他のモデルは実際のテーブルを使用します。
method
    コントローラにデータを渡す方法を「post」または「get」から選べます。
data
    渡すデータを、「フィールド => 値」から成る連想配列でセットします。

    フォームから送るデータをどのようにエミュレートするかについては、先のテストケース例における
    testIndexPostFixturized() 関数を参照してください。

落とし穴
--------

リダイレクトを行うコントローラのメソッドに対して testAction
を使用した場合、テストは何も結果を返さず、ただちに中断します。

`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
を参照して、修正を確認してください。

ヘルパーのテスト
================

ヘルパークラスにたくさんのロジックがあるなら、それらがテストケースでカバーされていることの確認は重要です。

ヘルパーのテストは、コンポーネントのテストのアプローチに少し似ています。
CurrencyRendererHelper というヘルパーが
``app/views/helpers/currency_renderer.php``
に存在する場合、それに対応したテストケースのファイルは
``app/tests/cases/helpers/currency_renderer.test.php`` に設置します。

Creating Helper test, part I
----------------------------

まずはじめに、CurrencyRendererHelper
が何を行うかを決めます。デモンストレーション用なので、簡単に2つのメソッドだけを持つことにしまします。

function usd($amount)

この関数は表示する金額の数字を受け取ります。この関数は、小数点以下第二位までの数字を返し、もし桁が足りなければゼロで埋め、前置詞に
'USD' を付けます。

function euro($amount)

この関数は usd() と同じように働きますが、前置詞は 'EUR'
を付けます。少し複雑にするために、span タグで囲うようにしましょう。

::

    <span class="euro"></span> 

まずはじめに、テストを作成します。

::

    <?php

    //Import the helper to be tested.
    //If the tested helper were using some other helper, like Html, 
    //it should be impoorted in this line, and instantialized in startTest().
    App::import('Helper', 'CurrencyRenderer');

    class CurrencyRendererTest extends CakeTestCase {
        private $currencyRenderer = null;

        //テストするヘルパーと、その他に必要なヘルパーをここでインスタンス化します。    public function startTest() {
            $this->currencyRenderer = new CurrencyRendererHelper();
        }

        //usd() 関数のテスト    public function testUsd() {
            $this->assertEqual('USD 5.30', $this->currencyRenderer->usd(5.30));
            //We should always have 2 decimal digits.
            $this->assertEqual('USD 1.00', $this->currencyRenderer->usd(1));
            $this->assertEqual('USD 2.05', $this->currencyRenderer->usd(2.05));
            //3桁ごとに入れるセパレータのテスト
            $this->assertEqual('USD 12,000.70', $this->currencyRenderer->usd(12000.70));
        }

これで、\ ``usd()``
が異なるパラメータで呼び出され、統合テストツールは戻り値が期待したものと一致するかどうかをチェックするようになりました。

まだ currencyRendererHelper
を作成していないので、テストを実行すると3つのテスト失敗という結果が表示されます。

メソッドがどのように動作するべきかはわかっているので、実装していきましょう。

::

    <?php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

小数点以下第二位までを返すようにし、小数点はドット、3桁ごとのセパレータはカンマ、前置詞に文字列
'USD' が加わるようにしました。

これを app/views/helpers/currency\_renderer.php
に保存し、テストを実行してください。緑色のバーで、4つのテストが成功したというメッセージが見えるはずです。

コンポーネントのテスト
======================

「Transporter」モデルを利用し、他のコントローラに機能を提供する「TransporterComponent」コンポーネントが存在するとします。その場合、次の四つのファイルを使います。

-  **app/controllers/components/transporter.php** の
   「Transporter」コンポーネント。
-  **app/models/transporter.php** の「Transporter」モデル。
-  **app/tests/fixtures/transporter\_fixture.php**
   の「TransporterTestFixture」フィクスチャ。
-  **app/tests/cases/transporter.test.php** のテスト用コード。

コンポーネントの初期化
----------------------

CakePHP
では、コンポーネントからモデルを直接操作できないようになっているため(参照：\ `/ja/view/62/components </ja/view/62/components>`_)、モデルのデータにアクセスするためのコントローラが必要です。
コンポーネントの startup() 関数を次のようにします。

::

    public function startup(&$controller){ 
              $this->Transporter = $controller->Transporter;  
     }

次に、ごく簡単な仮のクラスを作成します。

::

    class FakeTransporterController {} 

そしてその中に次のように値を設定していきます。

::

    $this->TransporterComponentTest = new TransporterComponent(); 
    $controller = new FakeTransporterController(); 
    $controller->Transporter = new TransporterTest(); 
    $this->TransporterComponentTest->startup(&$controller); 

テスト用のメソッドの作成
------------------------

CakeTestCase を拡張したクラスを作成し、テストを書いていきましょう。

::

    class TransporterTestCase extends CakeTestCase {
        var $fixtures = array('transporter');  
        function testGetTransporter() { 
              $this->TransporterComponentTest = new TransporterComponent(); 
              $controller = new FakeTransporterController(); 
              $controller->Transporter = new TransporterTest(); 
              $this->TransporterComponentTest->startup(&$controller); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Sweden"); 
              $this->assertEqual($result, 1, "SP is best for 1xxxx-5xxxx"); 
               
              $result = $this->TransporterComponentTest->getTransporter("41234", "Sweden", "44321", "Sweden"); 
              $this->assertEqual($result, 2, "WSTS is best for 41xxx-44xxx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("41001", "Sweden", "41870", "Sweden"); 
              $this->assertEqual($result, 3, "GL is best for 410xx-419xx"); 
       
              $result = $this->TransporterComponentTest->getTransporter("12345", "Sweden", "54321", "Norway"); 
              $this->assertEqual($result, 0, "Noone can service Norway");         
       }
    }
     

ウェブテスト - ビューのテスト
=============================

CakePHP
でのプロジェクトは、ほとんど全てがウェブアプリケーションです。単体テストにおいて、小分けにした機能のテストがうまくいったら、それより大きなスケールでの機能をテストしたくなるでしょう。「\ **CakeWebTest**\ Case」クラスは、ユーザの視点からこのテストを行う優れた方法を提供します。

CakeWebTestCase について
------------------------

**CakeWebTestCase** は、SimpleTest の WebTestCase
をただ拡張したもので、特に機能追加はありません。\ `SimpleTest の Web
testing
に関する文書 <https://simpletest.sourceforge.net/en/web_tester_documentation.html>`_\ 中に記載がある全ての機能は、
CakeWebTestCase で利用できます。これはまた、 SimpleTest
が持つ機能以外のものは使えないことを意味します。すなわち、
CakeWebTestCase
においてフィクスチャは利用できず、\ **テストケースにデータベースに対する更新や保存が含まれていた場合、恒久的にデータベースの値が変更されることを意味します。**\ テストの結果は、しばしばデータベースが持つ値に基づくので、テスト手順の一部としてデータベースが期待した値を持つことを確認してください。

テストの作成
------------

ウェブテストを実行したい場合、まず CakeTestCase の代わりに
**CakeWebTestCase** を拡張したクラスを必ず用意してください。

::

    class CompleteWebTestCase extends CakeWebTestCase

テストを開始する前に何か準備を行う必要があれば、コンストラクタを作成してください。

::

    function CompleteWebTestCase(){
      //テスト開始前の準備をここで行う
    }

実際にテストケースを書く場合、まずは出力結果を取得することから始めます。出力結果を得るためには
get もしくは post のリクエストを行うのですが、これには **get()** と
**post()**
関数をそれぞれ使用します。これらの関数は両方とも、第一引数として完全な
URL を必要とします。URL は、もしテストのスクリプトが
http://ドメイン名/cake/folder/webroot/test.php
であるとすると、次のようにすることで動的に取得できます。

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));

Cake 流の URL を用いて get や post を行うには、次のようにします。

::

    $this->get($this->baseurl."/products/index/");
    $this->post($this->baseurl."/customers/login", $data);

post メソッドの第二引数 $data は、Cake フォーマットのデータを含む、 post
するデータを連想配列にしたものです。

::

    $data = array(
      "data[Customer][mail]" => "user@user.com",
      "data[Customer][password]" => "userpass");

ページをリクエストしたら、標準的な SimpleTest
ウェブテストのメソッドを用いて、全ての種類のアサーションを行うことが可能です。

ページ全体を確認する
--------------------

CakeWebTest
は、ハイパーリンクや画像をクリックすることでページ全体をナビゲートする手段も提供します。詳しくは、
SimpleTest の文書を参照してください。

プラグインのテスト
==================

プラグインのテストは、プラグインのフォルダの中にディレクトリを作成してそこに設置してください。

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

このように設置したテストは、通常のテストと同様に動作します。ただし、別のクラスを読み込む場合、プラグインの命名に留意してください。これは、このマニュアルのプラグインの章で登場する「PizzaOrder(ピザの注文)」モデルに対するテストケースの例です。他のテストと異なるところは、最初に「Pizza.PizzaOrder」をインポートする部分だけです。また、「\ ``plugin.plugin_name.``\ 」というプレフィックスを付けたプラグインのフィクスチャも必要です。

::

    <?php 
    App::import('Model', 'Pizza.PizzaOrder');

    class PizzaOrderCase extends CakeTestCase {

        // プラグインのフィクスチャは /app/plugins/pizza/tests/fixtures/ に設置します
        var $fixtures = array('plugin.pizza.pizza_order');
        var $PizzaOrderTest;
        
        function testSomething() {
            // ClassRegistry によりモデルがテスト用のデータベース接続を使うようになります
            $this->PizzaOrderTest =& ClassRegistry::init('PizzaOrder');

            // 通常のテストを行います
            $this->assertTrue(is_object($this->PizzaOrderTest));
        }
    }
    ?>

アプリケーションのテストにおいてプラグインのフィクスチャを使用したい場合は、$fixtures
配列において「plugin.pluginName.fixtureName」シンタックスを利用することで、それが可能になります。

プラグインのテストに関しては以上です。

その他
======

テストでのレポート出力機能をカスタマイズする
--------------------------------------------

テストにおける標準のレポート出力機能は\ **極めて**\ 単純です。見栄えをよくしたり、堅苦しくないようにするため拡張するのは、とても簡単です。
 唯一の危険は、Cake のコアとなるコード、特に
 **/cake/tests/libs/cake\_reporter.php** をいじらなくてはならない点です。

テストにおける出力を変更するには、次のメソッドを上書きしてください。

paintHeader()
    テストが開始される前に出力されます。
paintPass()
    テストケースがパスした時にいつも出力されます。テストに含まれる情報を配列で取得するには、
    $this->getTestList() を使用してください。
    parent::paintPass($message) を呼び出すことを忘れないでください。
paintFail()
    テストケースが失敗した時に出力されます parent::paintFail($message)
    を呼び出すことを忘れないでください。
paintFooter()
    テストが終了した時に主強くされます。例えば、テストケースが全て実行された時などです。

もし、 paintPass や paintFail で親クラスの出力を隠したい場合は、 HTML
のコメントタグでそれを覆い隠します。

::

    echo "\n<!-- ";
    parent::paintFail($message);
    echo " -->\n";

テスト結果を表組みで出力するサンプル **cake\_reporter.php**
は、次のようになります。

::

    <?php
     /**
     * CakePHP(tm) Tests <https://trac.cakephp.org/wiki/Developement/TestSuite>
     * Copyright 2005-2008, Cake Software Foundation, Inc.
     *                              1785 E. Sahara Avenue, Suite 490-204
     *                              Las Vegas, Nevada 89104
     *
     *  Licensed under The Open Group Test Suite License
     *  Redistributions of files must retain the above copyright notice.
     */
     class CakeHtmlReporter extends HtmlReporter {
     function CakeHtmlReporter($characterSet = 'UTF-8') {
     parent::HtmlReporter($characterSet);
     }
     
    function paintHeader($testName) {
      $this->sendNoCacheHeaders();
      $baseUrl = BASE;
      print "<h2>$testName</h2>\n";
      print "<table style=\"\"><th>結果</th><th>テストケース</th><th>メッセージ</th>\n";
      flush();
     }

     function paintFooter($testName) {
       $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
       print "</table>\n";
       print "<div style=\"";
       print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
       print "\">";
       print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
       print " test cases complete:\n";
       print "<strong>" . $this->getPassCount() . "</strong> passes, ";
       print "<strong>" . $this->getFailCount() . "</strong> fails and ";
       print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
       print "</div>\n";
     }

     function paintPass($message) {
       parent::paintPass($message);
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden;                  border-right: hidden\">\n";
       print "\t\t<span style=\"color: green;\">パス</span>: \n";
       echo "\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       array_shift($breadcrumb);
       array_shift($breadcrumb);
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $message = split('at \[', $message);
       print "-&gt;$message[0]<br />\n\n";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function paintFail($message) {
       echo "\n<!-- ";
       parent::paintFail($message);
       echo " -->\n";
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "\t\t<span style=\"color: red;\">失敗</span>: \n";
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "$message";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function _getCss() {
       return parent::_getCss() . ' .pass { color: green; }';
     }
     
     }
     ?>

Test Reporter methods
---------------------

Reporters have a number of methods used to generate the various parts of
a Test suite response.

paintDocumentStart()
    Paints the start of the response from the test suite. Used to paint
    things like head elements in an html page.
paintTestMenu()
    Paints a menu of available test cases.
testCaseList()
    Retrieves and paints the list of tests cases.
groupCaseList()
    Retrieves and paints the list of group tests.
paintHeader()
    Prints before the test case/group test is started.
paintPass()
    Prints everytime a test case has passed. Use $this->getTestList() to
    get an array of information pertaining to the test, and $message to
    get the test result. Remember to call parent::paintPass($message).
paintFail()
    Prints everytime a test case has failed. Remember to call
    parent::paintFail($message).
paintSkip()
    Prints everytime a test case has been skipped. Remember to call
    parent::paintSkip($message).
paintException()
    Prints everytime there is an uncaught exception. Remember to call
    parent::paintException($message).
    Prints everytime an error is raised. Remember to call
    parent::paintError($message).
paintFooter()
    Prints when the test case/group test is over, i.e. when all test
    cases has been executed.
paintDocumentEnd()
    Paints the end of the response from the test suite. Used to paint
    things like footer elements in an html page.

テストをグループ化する
----------------------

いくつかのテストを同時に実行したい場合、テストグループを作成します。
**/app/tests/groups/**
ディレクトリに「\ **your\_test\_group\_name.group.php**\ 」といった名前のファイルを作成してください。このファイルの中で「\ **GroupTest**\ 」を拡張し、テストを読み込んでください。次のようになります。

::

    <?php 
    class TryGroupTest extends GroupTest { 
      var $label = 'try'; 
      function tryGroupTest() { 
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models'); 
      } 
    } 
    ?> 

上記のコードでは、 **/app/tests/cases/models/**
フォルダ内で見つけた全てのテストケースをグループ化します。独立したファイルを加えるには
**TestManager::addTestFile**\ ($this, ファイル名) としてください。

Running tests in the Command Line
=================================

If you have simpletest installed you can run your tests from the command
line of your application.

from **app/**

::

    cake testsuite help

::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix

    Examples: 
            cake testsuite app all
            cake testsuite core all

            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller

            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set

            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket

            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'

    Code Coverage Analysis: 


    Append 'cov' to any of the above in order to enable code coverage analysis

As the help menu suggests, you'll be able to run all, part, or just a
single test case from your app, plugin, or core, right from the command
line.

If you have a model test of **test/models/my\_model.test.php** you'd run
just that test case by running:

::

    cake testsuite app models/my_model

Test Suite changes in 1.3
=========================

The TestSuite harness for 1.3 was heavily refactored and partially
rebuilt. The number of constants and global functions have been greatly
reduced. Also the number of classes used by the test suite has been
reduced and refactored. You **must** update ``app/webroot/test.php`` to
continue using the test suite. We hope that this will be the last time
that a change is required to ``app/webroot/test.php``.

**Removed Constants**

-  ``CAKE_TEST_OUTPUT``
-  ``RUN_TEST_LINK``
-  ``BASE``
-  ``CAKE_TEST_OUTPUT_TEXT``
-  ``CAKE_TEST_OUTPUT_HTML``

These constants have all been replaced with instance variables on the
reporters and the ability to switch reporters.

**Removed functions**

-  ``CakePHPTestHeader()``
-  ``CakePHPTestSuiteHeader()``
-  ``CakePHPTestSuiteFooter()``
-  ``CakeTestsGetReporter()``
-  ``CakePHPTestRunMore()``
-  ``CakePHPTestAnalyzeCodeCoverage()``
-  ``CakePHPTestGroupTestList()``
-  ``CakePHPTestCaseList()``

These methods and the logic they contained have been
refactored/rewritten into ``CakeTestSuiteDispatcher`` and the relevant
reporter classes. This made the test suite more modular and easier to
extend.

**Removed Classes**

-  HtmlTestManager
-  TextTestManager
-  CliTestManager

These classes became obsolete as logic was consolidated into the
reporter classes.

**Modified methods/classes**

The following methods have been changed as noted.

-  ``TestManager::getExtension()`` is no longer static.
-  ``TestManager::runAllTests()`` is no longer static.
-  ``TestManager::runGroupTest()`` is no longer static.
-  ``TestManager::runTestCase()`` is no longer static.
-  ``TestManager::getTestCaseList()`` is no longer static.
-  ``TestManager::getGroupTestList()`` is no longer static.

**testsuite Console changes**

The output of errors, exceptions, and failures from the testsuite
console tool have been updated to remove redundant information and
increase readability of the messages. If you have other tools built upon
the testsuite console, be sure to update those tools with the new
formatting.

**CodeCoverageManager changes**

-  ``CodeCoverageManager::start()``'s functionality has been moved to
   ``CodeCoverageManager::init()``
-  ``CodeCoverageManager::start()`` now starts coverage generation.
-  ``CodeCoverageManager::stop()`` pauses collection
-  ``CodeCoverageManager::clear()`` stops and clears collected coverage
   reports.

