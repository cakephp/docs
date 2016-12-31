モデル
######

モデルはデータを表現し、CakePHP
アプリケーションではデータアクセスに使用されます。モデルは通常データベースのテーブルを表現しますが、ファイル・LDAP
レコード・iCal イベント・CSV
ファイルの行のようなデータを保存するものにアクセスするために使用することができます。

モデルは他のモデルと関連付けすることができます。たとえば、Recipe
はレシピ内の Ingredients と同様に Author と関連づいています。

このセクションではモデルのどんな特徴が自動化されているか、その特徴をどのようにオーバーライドするか、モデルがどんなメソッドやプロパティをもっているかを説明します。データを関連付ける様々な方法も説明します。データの検索・保存・削除の仕方についても記述しています。最後にデータソースを見てみます。

モデルを理解する
================

モデルはデータモデルを表現し、オブジェクト指向プログラミングでは "モノ"
を表現するオブジェクトです。たとえば、車・人・家といったものです。たとえば、ブログは多くのブログ投稿があり、各投稿には多くのコメントがあります。Blog,
Post, Comment
はすべてモデルの例で、それぞれ自分以外のものと関連があります。

これは CakePHP におけるモデルの定義の仕方の簡単な例です:

::

    <?php

    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }

    ?>

この簡単な宣言だけで、Ingredient
モデルはデータを保存したり、削除したりするクエリーを生成するのに必要なすべての機能をもちます。これらの魔法のメソッドがあるのは
CakePHP のモデルの継承のおかげです。Ingredient
モデルは、アプリケーションモデル AppModel を継承しています。これは
CakePHP の内部の Model クラスを継承しています。この内部の Model
のおかげで、その機能が独自モデル Ingredient に与えられます。

この中間クラス AppModel は中身は空で、デフォルトでは /cake/
フォルダに置かれます。AppModel
を上書きすると、アプリケーション内のすべてのモデルで利用可能な機能を定義することができます。そのためには、/app/
フォルダのルートに app\_model.php
ファイルを作成する必要があります。\ `Bake </ja/view/113/Bake-でコード生成する>`_
を使用してプロジェクトを作成すると、自動的にこのファイルが生成されます。

モデルは、/app/models/ か、/app/models
のサブディレクトリに作成してください。CakePHP
はこのディレクトリの中であれば、どこに設置してもモデルを見つけます。規約上は、このファイルはクラス名と同じものをつけます。この例で言えば、
ingredient.php となります。

CakePHP は対応するファイルが /app/models
で見つからなかった場合、モデルオブジェクトを動的に生成します。これは、もし誤ってファイル名を間違えた場合(Ingredient.php
や ingredients.php)、CakePHP は名前が間違ったファイルではなく AppModel
を使用するということです。独自に作成したモデルのメソッドや、 SQL
エラーが発生した場合、CakePHP
がモデルを見つけられなかったためであることが多いです。

複数のモデルに類似したロジックを提供する方法についての詳細は、\ `ビヘイビア </ja/view/88/ビヘイビア>`_\ も参照してください。

``$name`` プロパティは PHP4 では必須ですが PHP5 ではオプションです。

モデルを定義すると、\ `コントローラ </ja/view/49/コントローラ>`_\ 内からアクセス可能になります。CakePHP
は、モデル名がコントローラ名とマッチした場合に自動的にモデルを利用可能にします。たとえば、IngredientsController
というコントローラは自動的に Ingredient モデルを初期化し、コントローラの
``$this->Ingredient`` というプロパティにセットします。

::

    <?php

    class IngredientsController extends AppController {
        function index() {
            //すべての ingredients を取得し、ビューに渡す:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

    ?>

関連付けされたモデルはメインのモデルを通して利用できます。次の例では、Recipe
は Ingredient モデルと関連をもっています。

::

    $this->Recipe->Ingredient->find('all');

コントローラで見てきたように、コントローラに複数のモデルを割り当てることができ、コントローラから直接アクセスできます。次の例では、Recipe
と User の両方とも現在のコントローラからアクセスしています。

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe', 'User');
        function index() {
           $this->Recipe->find('all');
           $this->User->find('all');
        }
    }
    ?>

``$uses``
プロパティを通してモデルを追加していない場合、手動でモデルをインポートし、アクション内でインスタンス化する必要があります。

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe');
        function index() {
           $this->Recipe->find('all');

           App::import('Model', 'User');
           $user = new User();
           $user->find('all');
        }
    }
    ?>

データベースのテーブルを作成する
================================

CakePHP
はデータベースドリブンではないデータソースを持っていますが、多くの場合データベースドリブンとなります。CakePHP
は寛容にデザインされていて、MySQL, MSSQL, Oracle, PostgreSQL
やその他のデータベースで動作します。通常のようにデータベースのテーブルを生成することができます。モデルクラスを作成すると、自動的に作成したテーブルにマップされます。

規約により、テーブル名は小文字で、名詞の複数形で名付けます。テーブル名が複数の単語からなる場合は、アンダースコアで区切ります。たとえば、モデル名が
Ingredient なら、テーブル名は ingredients になるはずです。モデル名が
EventRegistration なら、テーブル名は event\_registrations
でしょう。CakePHP
はテーブルを検索し、各フィールドのデータ型を決定し、この情報を使用してさまざまな特徴的な作業を自動的に行います。たとえば、ビューのフォームで、フィールドを
(自動的に適切な書式で) 出力します。

規約により、フィールド名は小文字でアンダースコア区切りにします。

モデルとテーブル名の関連は、モデルの ``useTable``
プロパティで変更できます。この章の後のほうで説明します。

このセクションの残りを読めば、CakePHP
がどのようにデータベースのフィールドの型と PHP
のデータ型とをマッピングするか、フィールドの定義に基づいてどのように作業を自動化するかわかるでしょう。

各データベースごとのデータ型の関係
----------------------------------

各
`RDBMS <http://ja.wikipedia.org/wiki/%E9%96%A2%E4%BF%82%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E7%AE%A1%E7%90%86%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0>`_
は、それぞれ少しずつ異なる形式でデータ型を定義しています。CakePHP
は、各データベースシステム用のデータソースクラス内でこれらの型をマッピングし、分かりやすく統一したインターフェイスを生成することで、データベースシステムの種類を意識せずにすむようにしています。

次に、それぞれのデータベースの型がどのようにマッピングされているかを説明します。

MySQL
~~~~~

+----------------------+----------------------------+
| CakePHP における型   | フィールドのプロパティ     |
+======================+============================+
| primary\_key         | NOT NULL auto\_increment   |
+----------------------+----------------------------+
| string               | varchar(255)               |
+----------------------+----------------------------+
| text                 | text                       |
+----------------------+----------------------------+
| integer              | int(11)                    |
+----------------------+----------------------------+
| float                | float                      |
+----------------------+----------------------------+
| datetime             | datetime                   |
+----------------------+----------------------------+
| timestamp            | datetime                   |
+----------------------+----------------------------+
| time                 | time                       |
+----------------------+----------------------------+
| date                 | date                       |
+----------------------+----------------------------+
| binary               | blob                       |
+----------------------+----------------------------+
| boolean              | tinyint(1)                 |
+----------------------+----------------------------+

A *tinyint(1)*\ フィールドはCakePHPによってbooleanとして認識されます。

MySQLi
~~~~~~

+----------------------+--------------------------------+
| CakePHP における型   | フィールドのプロパティ         |
+======================+================================+
| primary\_key         | DEFAULT NULL auto\_increment   |
+----------------------+--------------------------------+
| string               | varchar(255)                   |
+----------------------+--------------------------------+
| text                 | text                           |
+----------------------+--------------------------------+
| integer              | int(11)                        |
+----------------------+--------------------------------+
| float                | float                          |
+----------------------+--------------------------------+
| datetime             | datetime                       |
+----------------------+--------------------------------+
| timestamp            | datetime                       |
+----------------------+--------------------------------+
| time                 | time                           |
+----------------------+--------------------------------+
| date                 | date                           |
+----------------------+--------------------------------+
| binary               | blob                           |
+----------------------+--------------------------------+
| boolean              | tinyint(1)                     |
+----------------------+--------------------------------+

ADOdb
~~~~~

+----------------------+--------------------------+
| CakePHP における型   | フィールドのプロパティ   |
+======================+==========================+
| primary\_key         | R(11)                    |
+----------------------+--------------------------+
| string               | C(255)                   |
+----------------------+--------------------------+
| text                 | X                        |
+----------------------+--------------------------+
| integer              | I(11)                    |
+----------------------+--------------------------+
| float                | N                        |
+----------------------+--------------------------+
| datetime             | T (Y-m-d H:i:s)          |
+----------------------+--------------------------+
| timestamp            | T (Y-m-d H:i:s)          |
+----------------------+--------------------------+
| time                 | T (H:i:s)                |
+----------------------+--------------------------+
| date                 | T (Y-m-d)                |
+----------------------+--------------------------+
| binary               | B                        |
+----------------------+--------------------------+
| boolean              | L(1)                     |
+----------------------+--------------------------+

DB2
~~~

+----------------------+----------------------------------------------------------------------------+
| CakePHP における型   | フィールドのプロパティ                                                     |
+======================+============================================================================+
| primary\_key         | not null generated by default as identity (start with 1, increment by 1)   |
+----------------------+----------------------------------------------------------------------------+
| string               | varchar(255)                                                               |
+----------------------+----------------------------------------------------------------------------+
| text                 | clob                                                                       |
+----------------------+----------------------------------------------------------------------------+
| integer              | integer(10)                                                                |
+----------------------+----------------------------------------------------------------------------+
| float                | double                                                                     |
+----------------------+----------------------------------------------------------------------------+
| datetime             | timestamp (Y-m-d-H.i.s)                                                    |
+----------------------+----------------------------------------------------------------------------+
| timestamp            | timestamp (Y-m-d-H.i.s)                                                    |
+----------------------+----------------------------------------------------------------------------+
| time                 | time (H.i.s)                                                               |
+----------------------+----------------------------------------------------------------------------+
| date                 | date (Y-m-d)                                                               |
+----------------------+----------------------------------------------------------------------------+
| binary               | blob                                                                       |
+----------------------+----------------------------------------------------------------------------+
| boolean              | smallint(1)                                                                |
+----------------------+----------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+----------------------+--------------------------------------------------------+
| CakePHP における型   | フィールドのプロパティ                                 |
+======================+========================================================+
| primary\_key         | IDENTITY (1, 1) NOT NULL                               |
+----------------------+--------------------------------------------------------+
| string               | varchar(255)                                           |
+----------------------+--------------------------------------------------------+
| text                 | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+----------------------+--------------------------------------------------------+
| integer              | integer                                                |
+----------------------+--------------------------------------------------------+
| float                | float                                                  |
+----------------------+--------------------------------------------------------+
| datetime             | timestamp (d.m.Y H:i:s)                                |
+----------------------+--------------------------------------------------------+
| timestamp            | timestamp (d.m.Y H:i:s)                                |
+----------------------+--------------------------------------------------------+
| time                 | time (H:i:s)                                           |
+----------------------+--------------------------------------------------------+
| date                 | date (d.m.Y)                                           |
+----------------------+--------------------------------------------------------+
| binary               | blob                                                   |
+----------------------+--------------------------------------------------------+
| boolean              | smallint                                               |
+----------------------+--------------------------------------------------------+

MS SQL
~~~~~~

+----------------------+----------------------------+
| CakePHP における型   | フィールドのプロパティ     |
+======================+============================+
| primary\_key         | IDENTITY (1, 1) NOT NULL   |
+----------------------+----------------------------+
| string               | varchar(255)               |
+----------------------+----------------------------+
| text                 | text                       |
+----------------------+----------------------------+
| integer              | int                        |
+----------------------+----------------------------+
| float                | numeric                    |
+----------------------+----------------------------+
| datetime             | datetime (Y-m-d H:i:s)     |
+----------------------+----------------------------+
| timestamp            | timestamp (Y-m-d H:i:s)    |
+----------------------+----------------------------+
| time                 | datetime (H:i:s)           |
+----------------------+----------------------------+
| date                 | datetime (Y-m-d)           |
+----------------------+----------------------------+
| binary               | image                      |
+----------------------+----------------------------+
| boolean              | bit                        |
+----------------------+----------------------------+

Oracle
~~~~~~

+----------------------+--------------------------+
| CakePHP における型   | フィールドのプロパティ   |
+======================+==========================+
| primary\_key         | number NOT NULL          |
+----------------------+--------------------------+
| string               | varchar2(255)            |
+----------------------+--------------------------+
| text                 | varchar2                 |
+----------------------+--------------------------+
| integer              | numeric                  |
+----------------------+--------------------------+
| float                | float                    |
+----------------------+--------------------------+
| datetime             | date (Y-m-d H:i:s)       |
+----------------------+--------------------------+
| timestamp            | date (Y-m-d H:i:s)       |
+----------------------+--------------------------+
| time                 | date (H:i:s)             |
+----------------------+--------------------------+
| date                 | date (Y-m-d)             |
+----------------------+--------------------------+
| binary               | bytea                    |
+----------------------+--------------------------+
| boolean              | boolean                  |
+----------------------+--------------------------+
| number               | numeric                  |
+----------------------+--------------------------+
| inet                 | inet                     |
+----------------------+--------------------------+

PostgreSQL
~~~~~~~~~~

+----------------------+---------------------------+
| CakePHP における型   | フィールドのプロパティ    |
+======================+===========================+
| primary\_key         | serial NOT NULL           |
+----------------------+---------------------------+
| string               | varchar(255)              |
+----------------------+---------------------------+
| text                 | text                      |
+----------------------+---------------------------+
| integer              | integer                   |
+----------------------+---------------------------+
| float                | float                     |
+----------------------+---------------------------+
| datetime             | timestamp (Y-m-d H:i:s)   |
+----------------------+---------------------------+
| timestamp            | timestamp (Y-m-d H:i:s)   |
+----------------------+---------------------------+
| time                 | time (H:i:s)              |
+----------------------+---------------------------+
| date                 | date (Y-m-d)              |
+----------------------+---------------------------+
| binary               | bytea                     |
+----------------------+---------------------------+
| boolean              | boolean                   |
+----------------------+---------------------------+
| number               | numeric                   |
+----------------------+---------------------------+
| inet                 | inet                      |
+----------------------+---------------------------+

SQLite
~~~~~~

+----------------------+---------------------------+
| CakePHP における型   | フィールドのプロパティ    |
+======================+===========================+
| primary\_key         | integer primary key       |
+----------------------+---------------------------+
| string               | varchar(255)              |
+----------------------+---------------------------+
| text                 | text                      |
+----------------------+---------------------------+
| integer              | integer                   |
+----------------------+---------------------------+
| float                | float                     |
+----------------------+---------------------------+
| datetime             | datetime (Y-m-d H:i:s)    |
+----------------------+---------------------------+
| timestamp            | timestamp (Y-m-d H:i:s)   |
+----------------------+---------------------------+
| time                 | time (H:i:s)              |
+----------------------+---------------------------+
| date                 | date (Y-m-d)              |
+----------------------+---------------------------+
| binary               | blob                      |
+----------------------+---------------------------+
| boolean              | boolean                   |
+----------------------+---------------------------+

Sybase
~~~~~~

+----------------------+-------------------------------------+
| CakePHP における型   | フィールドのプロパティ              |
+======================+=====================================+
| primary\_key         | numeric(9,0) IDENTITY PRIMARY KEY   |
+----------------------+-------------------------------------+
| string               | varchar(255)                        |
+----------------------+-------------------------------------+
| text                 | text                                |
+----------------------+-------------------------------------+
| integer              | int(11)                             |
+----------------------+-------------------------------------+
| float                | float                               |
+----------------------+-------------------------------------+
| datetime             | datetime (Y-m-d H:i:s)              |
+----------------------+-------------------------------------+
| timestamp            | timestamp (Y-m-d H:i:s)             |
+----------------------+-------------------------------------+
| time                 | datetime (H:i:s)                    |
+----------------------+-------------------------------------+
| date                 | datetime (Y-m-d)                    |
+----------------------+-------------------------------------+
| binary               | image                               |
+----------------------+-------------------------------------+
| boolean              | bit                                 |
+----------------------+-------------------------------------+

タイトル
--------

体感として、オブジェクトは名前やタイトルをもっていて、それを使用して何かを説明しています。人は、John・Mac・Buddy
のような名前をもっています。ブログの投稿にはタイトルがあります。カテゴリは名前をもっています。

``title`` または ``name`` フィールドを指定すると、CakePHP
は自動的にさまざまな状況でこのラベルを使用します:

-  Scaffolding — ページタイトル, フィールドのラベル
-  Lists — 通常 ``<select>`` のドロップダウンリストに使用します
-  TreeBehavior — reordering, ツリービュー

テーブルにタイトル *かつ*
名前のフィールドがある場合、タイトルが優先されます。

created と modified
-------------------

データベースのテーブル内で ``datetime`` フィールドとして ``created``
または ``modified`` フィールドを定義すると、CakePHP
はそれらのフィールドを認識し、レコードがデータベースに作成・更新されるときに自動的に埋め込まれます（保存されるデータが既にこれらのフィールドの値を含んでいる場合を除いて）。

``created`` や ``modified``
フィールドは、レコードが一番初めに追加されたときに、現在日時をセットします。\ ``modified``
フィールドは、すでに存在するレコードが保存されたときに、現在日時で更新されます。

注意: フィールド名 ``updated`` は ``modified``
と同じ振る舞いをします。これらのフィールドは、datetime
フィールドである必要があり、デフォルト値として CakePHP で認識される NULL
をセットします。

もし\ ``Model::save()``\ の直前に\ ``$this->data``\ が\ ``updated``\ 、\ ``created``\ 、\ ``modified``\ などの値を（\ ``Model::read``\ や\ ``Model::set``\ を経由して）保持しているなら、
これらは自動的に更新されることはなく、\ ``$this->data``\ から値をとってくることになります。

``unset($this->data['Model']['modified'])``\ などとするか、あるいは以下のように\ ``Model::save()``\ をオーバーライドして、このようなことを常体化することができます。

::

    class AppModel extends Model {
    //
    //
        function save($data = null, $validate = true, $fieldList = array()) {

            // "modified"の値を保存前ごとに削除する
            if (isset($this->data) && isset($this->data[$this->name]))
                unset($this->data[$this->name]['modified']);
            if (isset($data) && isset($data[$this->name]))
                unset($data[$this->name]['modified']);

            return parent::save($data, $validate, $fieldList);
        }
    //
    //
    }

プライマリーキーとして UUID を使用する
--------------------------------------

プライマリーキーは、通常 INT
フィールドとして定義されます。データベースは、新しいレコードが追加されるたびに自動的にフィールドをインクリメントし、１から始まります。あるいは、CHAR(36)
または BINARY(36)としてプライマリーキーを指定した場合、CakePHP
は、新しいレコードが作製されたときに、自動的に
`UUIDs <https://en.wikipedia.org/wiki/UUID>`_ を生成します。

UUID は４つのハイフンで区切られた 32 バイトの文字列で、トータル 36
文字になります。たとえば次のようなものです:

::

    550e8400-e29b-41d4-a716-446655440000

UUID
は、単一テーブル内ではなくテーブルやデータベースを超えた単位でユニークになるように設計されています。システム間でフィールドをユニークにする必要がある場合、UUID
はすばらしいアプローチになります。

データを取得する
================

find
----

``find($type, $params)``

findはモデルのデータを検索するための多くの機能を持った働き者です。\ ``$type``
は
``'all'``\ 、\ ``'first'``\ 、\ ``'count'``\ 、\ ``'list'``\ 、\ ``'neighbors'``
または ``'threaded'`` のいずれかです。デフォルトは ``'first'``
です。\ ``$type``\ は大文字と小文字を区別することを覚えておいてください。大文字を使うと（例：\ ``'All'``\ ）、期待する結果を得られないことがあります。

``$params`` はオプションの配列です。キーとして次のものが有効です。:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //条件の配列
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //フィールド名の配列
        'order' => array('Model.created', 'Model.field3 DESC'), //文字列か配列でのorder定義
        'group' => array('Model.field'), //GROUP BYするためのフィールド
        'limit' => n, //int
        'page' => n, //int
        'offset' => n, //int
        'callbacks' => true //false, 'before', 'after'が指定できます。
    )

また、いくつかのタイプのfind、ビヘイビアで使われる他のパラメータも指定することができます。もちろん独自のモデルメソッドにおいても可能です。

有効なモデルのコールバックに関する詳細は、\ `こちら <https://book.cakephp.org/ja/view/76/コールバックメソッド>`_
を参照してください。

find('first')
~~~~~~~~~~~~~

``find('first', $params)``

'first' は find
のデフォルトの型で、1件の結果を返します。1件だけ結果が欲しい時は、これを使ってください。コントローラ中で使う場合の簡単な例を、いくつか次に示します。

::

    function some_function() {
       ...
       $this->Article->order = null; // これがセットされているとリセットされます
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // モデルがデフォルトの並び順を持つようにシミュレートします
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

最初の例では、find
にパラメータが一切渡されていません。したがって、検索条件と並び順が使用されません。\ ``find('first')``
が返す値は、次のような形式になります。

::

    Array
    (
        [ModelName] => Array
            (
                [id] => 83
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

        [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )
    )

``find('first')``
において使用する追加のパラメータは、前述したもので全てです。

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)``
は整数型の値を返します。コントローラ中で使う場合の簡単な例を、いくつか次に示します。

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'COUNT(DISTINCT Article.user_id) as count',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

``find('count')`` では、 ``fields`` に配列を渡してはいけません。DISTINCT
カウントを行うフィールドだけを指定するようにしてください。そうすることで、条件に従った結果が常に同じになります。

``find('count')``
において使用する追加のパラメータは、前述したもので全てです。

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')``\ は（複数になりうる）結果の配列を返します。このメカニズムは実に全ての
``find()``
の別種類に使われ、また\ ``paginate``\ にも使われます。以下はいくつかの単純な（コントローラのコードの）サンプルです。

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

上記のサンプルでは、 ``$allAuthors`` は users
テーブルの全てのユーザに等しくなります。find
に何も（訳注：パラメータが）与えられないと、find
には条件が何も適用されません。

``find('all')``\ の呼び出しの結果は以下のようなフォーマットになることでしょう。

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

            )
    )

``find('all')``\ のためだけに使うパラメータはありません。

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)``\ はセレクトボックスを生成するためのリストなどに便利な、インデックス化された配列を返します。以下はいくつかの単純な（コントローラのコードの）サンプルです。

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('list');
       $pending = $this->Article->find('list', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('list');
       $allPublishedAuthors = $this->Article->User->find('list', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

上記のサンプルでは、\ ``$allAuthors`` は users
テーブルの全てのユーザに等しくなります。find
に何も（訳注：パラメータが）与えられないと、find
には条件が何も適用されません。

``find('list')``\ の呼び出しの結果は以下のようなフォーマットになることでしょう。

::

    Array
    (
        //[id] => 'displayValue',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

``find('list')``\ を呼び出すとき、与えられた\ ``fields``\ は返り値の配列のキーと値、もしあれば結果をグルーピングするためのもの、を決定付けるものとして使用されます。デフォルトではモデルの主キーがキーとして、display
field（モデルの属性\ `displayField </ja/view/438/displayField>`_\ で設定できる）が値として扱われます。以下はより具体的ないくつかの例です。

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

上記のコードの例の結果、変数は以下のようになるでしょう。

::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['Uber'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)`` returns a nested array, and is appropriate
if you want to use the ``parent_id`` field of your model data to build
nested results. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42))); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

It is not necessary to use `the Tree behavior </ja/view/91/Tree>`_ to
use this method - but all desired results must be possible to be found
in a single query.

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The second example
makes use of the data structure used by the `Tree
behavior </ja/view/91/Tree>`_ the return a partial, nested, result for
``$aCategory`` and everything below it. The results of a call to
``find('threaded')`` will be of the following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

The order results appear can be changed as it is influence by the order
of processing. For example, if ``'order' => 'name ASC'`` is passed in
the params to ``find('threaded')``, the results will appear in name
order. Likewise any order can be used, there is no inbuilt requirement
of this method for the top result to be returned first.

There are no additional parameters used by ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' will perform a find similar to 'first', but will return the
row before and after the one you request. Below is a simple (controller
code) example:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('fields' => 'id', 'value' => 3));
    }

You can see in this example the two required elements of the ``$params``
array: field and value. Other elements are still allowed as with any
other find (e.g. if your model acts as containable, then you can specify
'contain' in ``$params``). The format returned from a
``find('neighbors')`` call is in the form:

::

    Array
    (
        [prev] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 151
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
        [next] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 4
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 122
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
    )

Note how the result always contains only two root elements: prev and
next.

findAllBy
---------

``findAllBy(string $value)``

これらの魔法のような関数はあるフィールドを指定してテーブルを検索するためのショートカットとして使用することができます。関数名の最後にキャメルケース形式のフィールド名を追加し、第1引数としてそのフィールド用の判定基準を与えてください。

findBy
------

``findBy(string $value)``

これらの魔法のような関数はあるフィールドを指定してテーブルを検索するためのショートカットとして使用することができます。関数名の最後にキャメルケース形式のフィールド名を追加し、第1引数としてそのフィールド用の判定基準を与えてください。

+-----------------------------------------------+--------------------------------+
| PHP5 findAllBy の例                           | 対応する SQL                   |
+===============================================+================================+
| $this->Product->findAllByOrderStatus(‘3’);    | Product.order\_status = 3      |
+-----------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+-----------------------------------------------+--------------------------------+
| $this->User->findAllByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                     | Cake.id = 7                    |
+-----------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);       | User.user\_name = ‘psychic’    |
+-----------------------------------------------+--------------------------------+

PHP4
は、大文字と小文字を区別しないため、この関数の使用方法は少々異なります:

+-------------------------------------------------+--------------------------------+
| PHP4 findAllBy の例                             | 対応する SQL                   |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                       | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);       | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

findBy() 関数は find('first',...) と、 findAllBy() 関数は
find('all',...) と似ています。

いずれの場合でも、返り値は配列となり、 find() または findAll()
を実行したときと同じ形式になります。

query
-----

``query(string $query)``

モデルの ``query()`` メソッドを使用すると独自の SQL
呼び出しを作成できます。

アプリケーションで独自の SQL クエリーを使用している場合、CakePHP の
`Sanitize
ライブラリ </ja/view/153/データのサニタイズ-Data-Sanitization>`_\ (このマニュアルの後で説明されています)を必ず参照してください。SQL
インジェクションやクロスサイトスクリプティング攻撃を防ぐためにユーザデータをきれいにする目的があります。

``query()`` は、モデルの呼び出しとは本質的に分離した機能で、
$Model->cachequeries の状態に従いません。query
を呼び出すにあたりキャッシングを無効にするには、\ ``query($query, $cachequeries = false)``
というように第2引数に false を設定します。

``query()``
のクエリ文中ではモデル名でなく、テーブル名を使用し、返却される配列のキーもテーブル名になります。例えば、

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

これの戻り値は以下の通りです。

::

    Array
    (
        [0] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

配列のキー値にモデル名を使用し、Findメソッドを使用した時との一貫性を持たせる場合は、クエリは以下のようにします：

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

戻り値は次のようになります。

::

    Array
    (
        [0] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

field
-----

``field(string $name, array $conditions = null, string $order = null)``

$order の順に $conditions にマッチした最初のレコードから $name
で指定した単一のフィールドの値を返します。 conditions
が渡されておらず、モデルの id
がセットされていた場合、現在のモデルの結果がフィールドの値として返されます。マッチしたレコードが見つからなかった場合、
false が返されます。

::

    $model->id = 22;
    echo $model->field('name'); // id が 22 の name が出力されます

    echo $model->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // 最後に作成されたインスタンスの name が出力されます

read()
------

``read($fields, $id)``

``read()`` is a method used to set the current model data
(``Model::$data``)--such as during edits--but it can also be used in
other circumstances to retrieve a single record from the database.

``$fields`` is used to pass a single field name, as a string, or an
array of field names; if left empty, all fields will be fetched.

``$id`` specifies the ID of the record to be read. By default, the
currently selected record, as specified by ``Model::$id``, is used.
Passing a different value to ``$id`` will cause that record to be
selected.

``read()`` always returns an array (even if only a single field name is
requested). Use ``field`` to retrieve the value of a single field.

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // gets the rating of the record being deleted.
       $name = $this->read('name', $id2); // gets the name of a second record.
       $rating = $this->read('rating'); // gets the rating of the second record.
       $this->id = $id3; //
       $this->read(); // reads a third record
       $record = $this->data // stores the third record in $record
       ...
    }

Notice that the third call to ``read()`` fetches the rating of the same
record read before. That is because ``read()`` changes ``Model::$id`` to
any value passed as ``$id``. Lines 6-8 demonstrate how ``read()``
changes the current model data.

複雑な find の条件
------------------

多くの場合モデルの find
呼び出しをする際に、様々な方法で検索条件のセットを渡すことになります。最も簡単な方法は、SQL
の WHERE
句の抜粋を使用することです。もっと細かく制御する必要がある場合、配列を使用します。

配列を使用すると、すっきりと読みやすくなり、クエリーを作成しやすくなります。この構文はクエリーの要素(fields,
values, operators など)を分離し、扱いやすくします。このおかげで CakePHP
は最も効率よくクエリーを生成することが可能になり、適切な SQL
構文を保証し、クエリーの各部分を適切にエスケープすることができます。

ごく基本的な配列をベースにしたクエリは、次のようになります。:

::

    $conditions = array("Post.title" => "This is a post");
    //モデルでの使用例:
    $this->Post->find($conditions);

この構造はどういうことを表すか一目瞭然です: title が "This is a post"
と等しいすべての Post を検索します。フィールド名として "title"
だけを使用することができますが、クエリーを構築する際に常にモデル名を指定する習慣をつけておきましょう。コードが明確になりますし、後にスキーマを変更した際の衝突を避けるのに役立ちます。

他の形式の条件についてはどうでしょうか？これも同じように簡単です。title
が "This is a post" ではない Post をすべて検索してみましょう:

::

    array("Post.title <>" => "This is a post")

フィールド名の次に続く '<>' に注意してください。CakePHP はあらゆる有効な
SQL 比較演算子を解析することができます。たとえば、LIKE, BETWEEN, REGEX
のような一致表現を含みます。ただし、フィールド名と演算子の間にはスペースが必要です。一つの例外は
IN (...) 形式の条件です。さて、title が与えられた値に含まれる Post
を検索してみましょう:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

与えた値以外の title で、NOT IN(...) によるマッチにより posts
を検索する場合は次のようにします:

::

    array(
        "NOT" => array( "Post.title" => array("First post", "Second post", "Third post") )
    )

条件にフィルタを追加するには、キー/値を配列に追加するだけです:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

データベース内の２つのフィールドを比較する検索を作成することもできます。

::

    array("Post.created = Post.modified")

上記の例は、作成日付(created date)と更新日付(modified
date)が等しい複数の Post を返します。（1度も更新されていない Post
も返します）

このメソッドの中に WHERE
句として定義することができないものがあった場合(例えばブール値の操作)、文字列のようにして定義できることをおぼえておいてください:

::

    array(
        'Model.field & 8 = 1',
        //other conditions as usual
    )

デフォルトでは、CakePHP は複数の条件を AND
で結合します。これは次のことを意味します。抜粋した上記コードは、２週間前に生成され、かつ
title が与えられた値にマッチする Post
だけを取得します。しかし、簡単にどちらかの条件にマッチする Post
を検索することもできます。:

::

    array( "or" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

CCake はすべての有効な SQL 演算子(AND, OR, NOT, XOR
など)を使用できます。大文字でも小文字でもどちらでも構いません。これらの条件は無制限にネストすることができます。Posts
と Authors に belongsTo の関連があるとします。あるキーワード (“magic”)
を含むか、または2週間前に作成されたすべての Post のうち、 Bob
によって記述された Post のみ取得してみましょう:

::

    array (
        "Author.name" => "Bob", 
        "or" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake は値が null
のフィールドをチェックすることもできます。この例では、クエリーは Post の
title が null ではないレコードを返します:

::

    array ("not" => array (
            "Post.title" => null,








        )
    )

BETWEEN クエリーを処理するには、次のように使用することができます:

::

    array('Post.id BETWEEN ?AND ?' => array(1,10))

注意: CakePHP は使用している DB
のフィールドの型に依存して数値をクォートします。

GROUP BY はどのように行うのでしょうか?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

DISTINCT クエリを用いた簡単な例は次のようになります。MIN() や
MAX()、その他の演算子も、同じように扱えます。

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

とても複雑な条件を、ネストした複数の条件の配列によって作成することができます:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.name' => 'Steel Mega Works')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

これは次のような SQL になります:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

データを保存する
================

CakePHP
は保存するモデルデータをスナップします。保存するために準備されたデータを、次のような基本フォーマットを使用してモデルの
``save()`` メソッドに渡します:

::

    Array
    (
        [ModelName] => Array
            (
                [fieldname1] => 'value'
                [fieldname2] => 'value'
            )
    )

多くの場合、このフォーマットについて気にする必要はありません: CakePHP の
``HtmlHelper``, ``FormHelper``
ソッドのすべてのパッケージデータがこのフォーマットであるからです。どちらかのヘルパーを使用していれば、データは
``$this->data`` で有効になっていてすぐに使用できます。

これはコントローラのアクションの簡単な例で、CakePHP
のモデルを使用してデータベースのテーブルにデータを保存しています。:

::

    function edit($id) {
        //POST された form データがあるか？
        if(!empty($this->data)) {
            //form データが有効で保存できた場合...
            if($this->Recipe->save($this->data)) {
                //セッションにフラッシュメッセージをセットしリダイレクトする
                $this->Session->setFlash("Recipe Saved!");
                $this->redirect('/recipes');
            }
        }
     
        //form データがない場合、編集する recipe を検索し
        //ビューに渡す
        $this->set('recipe', $this->Recipe->findById($id));
    }

１つ注意: save が呼び出されたとき、第１引数で渡されたデータは、CakePHP
のバリデーション機能を使用してチェックされます(詳細はデータバリデーションの章を参照してください)。何らかの理由でデータが保存できない場合、バリデーションルールが壊れていないかどうかを確かめてください。

モデルには他に保存に関連したメソッドがいくつかあり、find で役に立ちます:

``save(array $data = null, boolean $validate = true, array $fieldList = array())``

上記のように、このメソッドは配列形式のデータを保存します。第2引数を設定することでバリデーションを回避でき、第3引数はモデルフィールドのリストを指定して保存することができます。セキュリティ対策として、\ ``$fieldList``
で指定されたフィールドだけ保存するように制限することができます。

``$fieldList``\ が与えられなければ、悪意のあるユーザーがフォームのデータに余分なフィールドを追加することができ、これによって本来意図していないフィールドが更新されてしまいます。

save メソッドには他の構文もあります:

``save(array $data = null, array $params = array())``

``$params`` 配列は次の有効なオプションをキーとして持つことができます:

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

有効なモデルのコールバックに関する詳細は、\ `こちら <https://book.cakephp.org/ja/view/76/コールバックメソッド>`_
を参照してください。

一度保存が完了してしまうと、オブジェクトの ID をモデルオブジェクトの
``$id``
プロパティで取得することができます。特に新しいオブジェクトを生成した場合に便利です。

::

    $this->Ingredient->save($newData);

    $newIngredientId = $this->Ingredient->id;

作成か更新どちらを行うかはモデルのidフィールドで制御されています.
``$Model->id``\ が設定されていれば,
このプライマリキーをもつレコードを更新します。そうでなければ新しいレコードが作成されます

::

    //作成: idが設定されていないかnull
    $this->Recipe->create();
    $this->Recipe->save($this->data);

    //更新: idが数値に設定されている
    $this->Recipe->id = 2;
    $this->Recipe->save($this->data);

ループで save を使うときは、\ ``create()``
をコールすることを忘れないでください。

``create(array $data = array())``

このメソッドはモデルの状態を、新しい情報を保存できるようにリセットします。

``$data``
パラメータ(上述した配列のフォーマット)が渡されたら、モデルインスタンスはそのデータを保存する準備が整います(\ ``$this->data``
でアクセスできます)。

``saveField(string $fieldName, string $fieldValue, $validate = false)``

単一のフィールドの値を保存するために使用します。\ ``saveField()``
を呼び出す前に、モデルの ID
(``$this->ModelName->id = $id``)をセットしてください。このメソッドを使用する際には、\ ``$fieldName``
にはモデルとフィールド名ではなくフィールド名だけを含めるべきです。

たとえば、ブログの投稿のタイトルを更新するために、コントローラから
``saveField`` を呼び出すには次のようにします:

::

    $this->Post->saveField('title', 'A New Title for a New Day');

``updateAll(array $fields, array $conditions)``

1回の呼び出しで多くのレコードを更新します。更新されるレコードは
``$conditions`` 配列で指定し、更新されるフィールドは ``$fields``
配列によって指定します。

たとえば、１年以上メンバーであるすべての baker
を承認したい場合、更新は次のようになります:

::

    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => "$this_year")
    );

$fields 配列は SQL
の表現を使用できます。リテラル値は手動でクォートする必要があります。

たとえば、ある取引先のすべてのチケットをクローズしたい場合は次のようになります:

::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

``saveAll(array $data = null, array $options = array())``

次のいずれかの目的で使用します。 (a)
単一のモデルに、個別のレコードを複数記録する。 (b)
あるレコードと同様に、関連したレコードも全て記録する。

次のオプションが使えます:

validate: false をセットすると、バリデーションが行われません。true
をセットすると各レコードが保存される前にバリデーションが行われます。'first'
をセットすると、レコードの保存が行われる前に、\*全ての\*レコードにバリデーションが行われます。'only'
をセットすると、バリデートだけを行い、保存は行われません。

atomic:
true(デフォルト)をセットすると、全てのレコードの保存を単一のトランザクションとして行うよう試みます。データベースやテーブルがトランザクションをサポートしていない場合は、false
にセットするようにしましょう。もし false にセットされているなら、渡した
$data
配列に似た形式のものが、配列として返されます。ただし、値は各レコードが保存されたかどうかを表す
true または false がセットされます。

fieldList: ``Model::save()`` の $fieldList パラメータと同じです。

単一のモデルに複数のレコードを保存するためには、$data
は整数のインデックスがついた配列である必要があります。次のようになります:

::

    Array
    (
        [Article] => Array
        (
            [0] => Array
            (
                [title] => title 1
            )
            [1] => Array
            (
                [title] => title 2
            )
        )
    )

上記の $data 配列を保存するコマンドは、次のようになります:

::

    $this->Article->saveAll($data['Article']);

hasOne
の関連を持つデータも一緒に保存する場合、データ配列は次のようになります:

::

    Array
    (
        [User] => Array
            (
                [username] => billy
            )
        [Profile] => Array
            (
                [sex] => Male
            [occupation] => Programmer
            )
    )

上記の $data 配列を保存するコマンドは、次のようになります:

::

    $this->Article->saveAll($data);

hasMany
の関連を持つデータも一緒に保存する場合、データ配列は次のようになります:

::

    Array
    (
        [Article] => Array
            (
                [title] => My first article
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [comment] => Comment 1
                [user_id] => 1
                    )
            [1] => Array
                    (
                        [comment] => Comment 2
                [user_id] => 2
                    )
            )
    )

上記の $data 配列を保存するコマンドは、次のようになります:

::

    $this->Article->saveAll($data);

``saveAll()``\ による関連したデータの保存は、直接に関連のあるモデル同士でのみ正しく行われます。

関連モデル (hasOne, hasMany, belongsTo)のデータを保存する
---------------------------------------------------------

あるモデルのデータを保存するとき、それに関連付いているモデルのデータも一緒に処理されるということを意識しておいてください。新しい
Post とそれに関連した Comments を保存する場合、保存処理の実行中には Post
と Comment モデルを両方とも使用します。

システムに、関連したモデルのレコードがまだ無い場合(たとえば、新しい User
とそれに関連した Profile
レコードを同時に保存した場合)、はじめに主となるモデル、または親モデルを保存する必要があります。

これがどのように動作するか理解するために、新しい User とそれに関連した
Profile の保存を取り扱うアクションが UserController
にある状態を考えてみましょう。次のアクションの例は、1つの User と1つの
Profile を生成するのに(Form ヘルパーを使用して)十分なデータを POST
によって取得したと仮定しています。

::

    <?php
    function add() {
        if (!empty($this->data)) {
            // User モデルのデータを保存します。
            // このデータは $this->data['User'] にあります。
     
            $user = $this->User->save($this->data);

            // User が保存されたら、Profile データに User の情報を追加し
            // 保存します。      
            if (!empty($user)) {
                // 新しく生成した User の ID は、
                // $this->User->id にセットされます。
                $this->data['Profile']['user_id'] = $this->User->id;

                // User は Profile と hasOne のアソシエーションで関連付いているので
                // User モデルを通して Profile モデルにアクセスできます:
                $this->User->Profile->save($this->data);
            }
        }
    }
    ?>

hasOne, hasMany, belongsTo
の関連を扱う場合は、キーの処理が重要な点です。基本的な考えは、1つのモデルからキーを取得し、他のモデルの外部キーフィールドにそのキーを指定することです。\ ``save()``
の後にモデルクラスの ``$id`` 属性を使用する時もあれば、フォームの hidden
フィールドからコントローラのアクションに POST された ID
を使用する場合もあります。

上述した基本的なアプローチに加え、 CakePHP には ``saveAll()``
という、複数のモデルをバリデートし保存するとても便利なメソッドもあります。さらに、\ ``saveAll()``
は、データベース中のデータ整合性のためにトランザクションをサポートしています(つまり、1つのモデルの保存に失敗した場合、その他のモデルも保存されません)。

MySQL においてトランザクションを正しく機能させるには、テーブルが InnoDB
エンジンである必要があります。MyISAM
のテーブルはトランザクションをサポートしていないことに注意してください。

``saveAll()`` を使って、Company と Account
モデルを同時に保存する例を見てみましょう。

まず、Company と Account モデルのためのフォームを構築します(Company
hasMany Account と仮定します)。

::


    echo $form->create('Company', array('action'=>'add'));
    echo $form->input('Company.name', array('label'=>'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');

    echo $form->input('Account.0.name', array('label'=>'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');

    echo $form->end('Add');

Account
モデルに対するフォームフィールドの名前に注目してください。Company
が主のモデルである場合、 ``saveAll()``
は関連したモデル(Account)のデータが特定のフォーマットで届くことを期待します。特定のフォーマットとは、
``Account.0.fieldName`` といった形式のものです。

上述したフィールド名は hasMany
アソシエーションにおいて必要となります。モデル間のアソシエーションが
hasOne であるなら、関連したモデルのためのフィールド名は
ModelName.fieldName という形式の名前にします。

これで companies\_controller において ``add()``
アクションを作成する準備が整いました。

::


    function add() {
       if(!empty($this->data)) {
          $this->Company->saveAll($this->data, array('validate'=>'first'));
       }
    }

これで完了です。Company と Account
モデルは、同時にバリデートされ保存されました。このとき
``array('validate'=>'first')``
を指定しておくと、両方のモデルに対するバリデーションが確実に行われます。

counterCache - Cache your count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model itself
tracks any addition/deleting towards the associated ``$hasMany`` model
and increases/decreases a dedicated integer field within the parent
model table.

The name of the field consists of the singular model name followed by a
underscore and the word "count".

::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model called
``Image``, you would add a new INT-field to the ``image`` table and name
it ``image_comment_count``.

Here are some more examples:

+-------------+--------------------+---------------------------------------------+
| Model       | Associated Model   | Example                                     |
+=============+====================+=============================================+
| User        | Image              | users.image\_count                          |
+-------------+--------------------+---------------------------------------------+
| Image       | ImageComment       | images.image\_comment\_count                |
+-------------+--------------------+---------------------------------------------+
| BlogEntry   | BlogEntryComment   | blog\_entries.blog\_entry\_comment\_count   |
+-------------+--------------------+---------------------------------------------+

Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key and
set the value to ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

From now on, every time you add or remove a ``Image`` associated to
``ImageAlbum``, the number within ``image_count`` is adjusted
automatically.

If you need to specify a custom counter field, set counterCache to the
name of that field:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => 'number_of_images')
        );
    }

You can also specify ``counterScope``. It allows you to specify a simple
condition which tells the model when to update (or when not to,
depending on how you look at it) the counter value.

Using our Image model example, we can specify it like so:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // only count if "Image" is active = 1
        ));
    }

関連モデルのデータ (HABTM) を保存する
-------------------------------------

多くの場合モデルの find
呼び出しをする際に、様々な方法で検索条件のセットを渡すことになります。最も簡単な方法は、SQL
の WHERE
句の抜粋を使用することです。もっと細かく制御する必要がある場合、配列を使用します。

配列を使用すると、すっきりと読みやすくなり、クエリーを作成しやすくなります。この構文はクエリーの要素(fields,
values, operators など)を分離し、扱いやすくします。このおかげで CakePHP
は最も効率よくクエリーを生成することが可能になり、適切な SQL
構文を保証し、クエリーの各部分を適切にエスケープすることができます。

At it's most basic, an array-based query looks like this:

::

    $conditions = array("Post.title" => "This is a post");
    //モデルの使用方法の例:
    $this->Post->find($conditions);

この構造はどういうことを表すか一目瞭然です: title が "This is a post"
と等しいすべての Post を検索します。フィールド名として "title"
だけを使用することができますが、クエリーを構築する際に常にモデル名を指定する習慣をつけておきましょう。コードが明確になりますし、後にスキーマを変更した際の衝突を避けるのに役立ちます。

他の形式の条件についてはどうでしょうか？これも同じように簡単です。title
が "This is a post" ではない Post をすべて検索してみましょう:

::

    array("Post.title <>" => "This is a post")

フィールド名の次に続く '<>' に注意してください。CakePHP はあらゆる有効な
SQL 比較演算子を解析することができます。たとえば、LIKE, BETWEEN, REGEX
のような一致表現を含みます。ただし、フィールド名と演算子の間にはスペースが必要です。一つの例外は
IN (...) 形式の条件です。さて、title が与えられた値に含まれる Post
を検索してみましょう:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

与えた値以外の title で、NOT IN(...) によるマッチにより posts
を検索する場合は次のようにします:

::

    array(
        "NOT" => array( "Post.title" => array("First post", "Second post", "Third post") )
    )

条件にフィルタを追加するには、キー/値を配列に追加するだけです:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

データベース内の２つのフィールドを比較する検索を作成することもできます。

::

    array("Post.created = Post.modified")

上記の例は、作成日付(created date)と更新日付(modified
date)が等しい複数の Post を返します。（1度も更新されていない Post
も返します）

このメソッドの中に WHERE
句として定義することができないものがあった場合(例えばブール値の操作)、文字列のようにして定義できることをおぼえておいてください:

::

    array(
        'Model.field & 8 = 1',
        //いつも通りのその他の条件を続ける
    )

デフォルトでは、CakePHP は複数の条件を AND
で結合します。これは次のことを意味します。抜粋した上記コードは、２週間前に生成され、かつ
title が与えられた値にマッチする Post
だけを取得します。しかし、簡単にどちらかの条件にマッチする Post
を検索することもできます。:

::

    array( "or" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

CCake はすべての有効な SQL 演算子(AND, OR, NOT, XOR
など)を使用できます。大文字でも小文字でもどちらでも構いません。これらの条件は無制限にネストすることができます。Posts
と Authors に belongsTo の関連があるとします。あるキーワード (“magic”)
を含むか、または2週間前に作成されたすべての Post のうち、 Bob
によって記述された Post のみ取得してみましょう:

::

    array (
        "Author.name" => "Bob", 
        "or" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake は値が null
のフィールドをチェックすることもできます。この例では、クエリーは Post の
title が null ではないレコードを返します:

::

    array ("not" => array (
            "Post.title" => null,





        )
    )

BETWEEN クエリーを処理するには、次のように使用することができます:

::

    array('Post.id BETWEEN ?AND ?' => array(1,10))

注意: CakePHP は使用している DB
のフィールドの型に依存して数値をクォートします。

GROUP BY はどのように行うのでしょうか?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

とても複雑な条件を、ネストした複数の条件の配列によって作成することができます:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.name' => 'Steel Mega Works')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

これは次のような SQL になります:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

データを削除する
================

これらのメソッドはデータを削除するために使用します。

delete
------

``delete(int $id = null, boolean $cascade = true);``

$id
で指定されたレコードをを削除します。デフォルトでは、削除するレコードに依存したレコードも削除します。

たとえば、多くの Recipe レコードに結びついている User
レコードを削除するとします:

-  モデルの dependent の値が true にセットされており、$cascade が true
   の場合、関連する Recipe のレコードも削除されます。
-  $cascade が false の場合、User のレコードを削除しても Recipe
   のレコードは削除されません。

remove
------

``remove(int $id = null, boolean $cascade = true);``

``del()`` の別名（シノニム）です。

deleteAll
---------

``deleteAll(mixed $conditions, $cascade = true)``

``deleteAll()`` 以外の ``del()`` や ``remove()``
と同様に、指定された条件にマッチするすべてのレコードを削除します。\ ``$conditions``
配列は SQL 文かあるいは配列として指定することができます。

関連: モデルを結びつける
========================

CakePHP
の最も強力な機能の１つは、モデルによって提供されるリレーショナルマッピングを結びつける能力です。CakePHP
では、モデル間の結びつきは関連を通して処理されます。

アプリケーション内で異なるオブジェクト間の関係を定義することは自然なことです。たとえば:
recipe データベース内で、recipe は複数の reviews を持ち、reviews は１つの
author を持ちます。また、author は複数の recipe
を持ちます。このような関係を定義すると、直感的かつ強力な方法でデータにアクセスすることができます。

この章の目的は、設計の仕方や定義の仕方やCakePHP
でモデル間の関連の使用方法を示すことです。

データは様々なところからやってきますが、ウェブアプリケーションで最も一般的なストレージはリレーショナルデータベースです。この章で扱う大半はリレーショナルデータベースを想定しています。

関連の形式
----------

CakePHP で使用する関連の形式は: hasOne, hasMany, belongsTo,
hasAndBelongsToMany (HABTM) の4つです。

+----------+-----------------------+------------------------------------------------------+
| 関係     | 関連の形式            | 例                                                   |
+==========+=======================+======================================================+
| 1対1     | hasOne                | user は１つの profile をもつ                         |
+----------+-----------------------+------------------------------------------------------+
| 1対多    | hasMany               | システムの User は複数の recipe をもつことができる   |
+----------+-----------------------+------------------------------------------------------+
| 多対1    | belongsTo             | recipe は user に属する                              |
+----------+-----------------------+------------------------------------------------------+
| 多対多   | hasAndBelongsToMany   | Recipe は複数の tag をもち、かつ属する               |
+----------+-----------------------+------------------------------------------------------+

関連は、定義したい関連の名前がついたクラス変数を生成することで定義します。クラス変数は単純に文字列とすることもできますが、関連の設定を定義するために多次元配列にすることもできます。

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $hasOne = 'Profile';
        var $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order'      => 'Recipe.created DESC'
            )
        );
    }

    ?>

上記の例では、'Recipe' という単語の最初のインスタンスが
'エイリアス(別名)'
になります。これは関係で使用する識別子となり、これを選択するだけで様々なことが実行できます。通常は、クラス名と同じ名前を選択しますが。ただしエイリアスは、単独のモデル内の
belongsTo/hasMany または belongsTo/hasOne
の関連において、ユニークでなければなりません。モデルのエイリアスにユニークでない名前を選択すると、不具合が発生します。

hasOne
------

では、User モデルを作成しましょう。このモデルは、Profile モデルと hasOne
の関係があります。

まずはデータベーステーブルのキーが正確に設定されている必要があります。hasOne
の関係が動作するには、あるテーブルは外部キーを持つ必要があり、そのキーはもう一方のレコードを指し示します。profile
テーブルは、user\_id
というフィールドを持っています。基本的な形式は次のようになります:

+------------------------+----------------------+
| 関係                   | スキーマ             |
+========================+======================+
| Apple hasOne Banana    | bananas.apple\_id    |
+------------------------+----------------------+
| User hasOne Profile    | profiles.user\_id    |
+------------------------+----------------------+
| Doctor hasOne Mentor   | mentors.doctor\_id   |
+------------------------+----------------------+

Table: **hasOne:** *自分以外*\ のモデルに外部キーが含まれる

User モデルファイルを /app/models/user.php に保存します。‘User hasOne
Profile’の関係を定義するために、モデルクラスに $hasOne
プロパティを追加します。/app/models/profile.php 内に Profile
モデルを指定することを忘れないでください。そうしないと関連は動作しません。

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasOne = 'Profile';   
    }
    ?>

モデルファイル内にこの関係を記述するには2つの方法があります。もっとも簡単な方法は、上記で指定したように関連モデルのクラス名を含む文字列を
$hasOne プロパティにセットすることです。

より細かい制御が必要な場合、配列を使用して関連を定義します。たとえば、１つだけのレコードを含むように関連を限定したいというような場合です。

::

    <?php

    class User extends AppModel {
        var $name = 'User';          
        var $hasOne = array(
            'Profile' => array(
                'className'    => 'Profile',
                'conditions'   => array('Profile.published' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

hasOne 関連の配列で指定可能なキーは次の通りです:

-  **className**: 現在のモデルに関連したモデルのクラス名。‘User hasOne
   Profile’ という関係を定義する場合、className キーは‘Profile’
   になります。
-  **foreignKey**: もう一方のモデルにある外部キーの名前。複数の hasOne
   関係を定義する必要がある場合に特に便利です。このキーのデフォルト値は、現在のモデル名のアンダースコア区切りの単数形で、末尾に‘\_id’をつけたものです。上記の例では、'user\_id'
   となります。
-  **conditions**: 関連モデルのレコードを限定するための SQL。SQL
   内でモデル名を使用することを習慣にしておくようにしておきましょう:“approved
   = 1.” よりも、“Profile.approved = 1” の方が良い記述です。
-  **fields**:
   関連モデルのデータが取得された際に取り出すフィールドのリストです。デフォルトではすべてのフィールドを返します。
-  **dependent**: dependent キーを true にセットし、delete() メソッドの
   cascade 引数を true
   をセットして呼び出すと、関連するモデルのレコードも併せて削除されます。この場合、true
   をセットしているので、User を削除すると、関連する Profile
   も削除します。

この関連を定義すると、User モデルの find は、関連した Profile
モデルのレコードも(もし存在すれば)取り出します:

::

    // $this->User->find() を呼び出した結果のサンプルArray
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

ここでは、User モデルから Profile のデータにアクセスします。User
のデータに関連したデータにアクセスするために Profile モデルに belongsTo
関連を定義します。belongsTo 関連は、自然に hasOne や hasMany
関連の対になります: 他の方向からデータをみることができます。

データベースのテーブルに belongsTo
関係のためのキーを作成するには、次のような規則になります:

+---------------------------+----------------------+
| 関係                      | スキーマ             |
+===========================+======================+
| Banana belongsTo Apple    | bananas.apple\_id    |
+---------------------------+----------------------+
| Profile belongsTo User    | profiles.user\_id    |
+---------------------------+----------------------+
| Mentor belongsTo Doctor   | mentors.doctor\_id   |
+---------------------------+----------------------+

Table: **belongsTo:** *現在の* モデルが外部キーをもちます

モデル（テーブル）が外部キーを持つ場合、そのモデルは他のモデル（テーブル）に属します。

次のような構文を使用して、/app/models/profile.php 内で Profile モデルに
belongsTo 関連を定義することができます:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = 'User';   
    }
    ?>

配列を使用してより詳細な関係を定義することもできます。

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'    => 'user_id'
            )
        );  
    }
    ?>

belongsTo 関連の配列で有効なキーは以下のようになります:

-  **className**: 現在のモデルに関連したモデルのクラス名。‘Profile
   belongsTo User’ という関係を定義する場合、className
   キーは‘User’になります。
-  **foreignKey**: 現在のモデルにある外部キー名。複数の belongsTo
   関係を定義する必要がある場合に、これは特に便利です。このキーのデフォルト値は、他のモデル名のアンダースコアで区切られた単数形で、末尾に‘\_id’が付きます。
-  **conditions**: 関連モデルのレコードを限定するために使用する SQL。SQL
   にモデル名を使用するのは良い習慣となります: “User.active = 1”
   は常に“active = 1”よりも推奨されます。
-  **fields**:
   関連モデルのデータを取得した際に取り出すフィールドのリスト。デフォルトではすべてのフィールドを返します。
-  **counterCache**: (bool) true にセットすると、save() または delete()
   が呼び出されるたびに、関連モデルは自動的に外部テーブルの“[singular\_model\_name]\_count”というフィールドをインクリメントまたはデクリメントします。カウンタフィールドの値は関連する行の番号を表します。

この関連が定義されると、Profile モデルの find
操作は、存在する場合は関連する User レコードを取得するでしょう:

::

    //Sample results from a $this->Profile->find() call.

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

次のステップに進みましょう: “User hasMany Comment”
という関連を定義します。 hasMany 関連を定義すると、User
レコードを取得する際に、ユーザのコメントも取得できます。

データベースのテーブルに hasMany
関係のためのキーを作成するには、次のような規則で行います:

**hasMany:** *自分以外*\ のモデルに外部キーが含まれる

関係

スキーマ

User hasMany Comment

Comment.user\_id

Cake hasMany Virtue

Virtue.cake\_id

Product hasMany Option

Option.product\_id

次のような構文を使用して、/app/models/user.php 内で User モデルに
hasMany 関連を定義することができます。

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = 'Comment';   
    }
    ?>

配列を使用してより詳細な関係を定義することもできます。

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'    => 'Comment.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

hasMany 関連の配列で指定可能なキーは次の通りです:

-  **className**: 現在のモデルに関連したモデルのクラス名。‘User hasMany
   Comment’ という関係を定義する場合、className キーは‘Comment’
   になります。
-  **foreignKey**: もう一方のモデルにある外部キーの名前。複数の hasMany
   関係を定義する必要がある場合に特に便利です。このキーのデフォルト値は、現在のモデル名のアンダースコア区切りの単数形で、末尾に‘\_id’をつけたものです。
-  **conditions**: 関連モデルのレコードを限定するための SQL。SQL
   内でモデル名を使用することを習慣にしておくようにしておきましょう:“status
   = 1.” よりも、“Comment.status = 1” の方が良い記述です。
-  **fields**:
   関連モデルのデータが取得された際に取り出すフィールドのリストです。デフォルトではすべてのフィールドを返します。
-  **order**: 返される関連する行の並び順を定義する SQL。.
-  **limit**: 返して欲しい関連する行の最大数。
-  **offset**:
   与えられた現在の条件と順番で関連したモデルのレコードを取り出す時に、スキップする行の数。
-  **dependent**: dependent キーが true
   にセットされると、再帰的なモデルの削除が可能になります。この例の場合、Comment
   レコードは、関連する User
   レコードが削除されたときに、同時に削除されます。

   再帰的な削除をするためには、 ``Model->delete()``
   メソッドの第2パラメータを true にセットしなければなりません。

-  **exclusive**: exclusive が true
   にセットされると、再帰的なモデルの削除は、各エントリーを個別に削除するのではなく、deleteAll()
   の呼び出しによって削除されます。
-  **finderQuery**: 関連モデルのレコードを取得するために CakePHP
   が使用できる完全な SQL。これは独自の結果が必要な場合に使用します。

この関連を定義すると、User モデルの find は、関連した Comment
モデルのレコードも(もし存在すれば)取り出します:

::

    // $this->User->find() を呼び出した結果のサンプルArray
    (  
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?                    [created] => 2006-05-01 10:41:01
                    )
            )
    )

1つ覚えておいてほしいのは、両方の方向からデータを取得するためには、Comment
が User と belongsTo
関連である必要があるということです。この章で述べてきたことは、User から
Comment データを取得することができるということです。Comment モデル内で
User と belongsTo 関連を追加すると、Comment モデルから User
データを取得できます -
接続が完全であれば、どちらかのモデルからみても情報を流すことができます。

hasAndBelongsToMany (HABTM)
---------------------------

さて、この時点で、すでに CakePHP
におけるモデルの関連付けの専門家になっていることでしょう。すでに3つの関連に精通し、オブジェクトの関連付けの大半を学んできました。

それでは最後の関連である hasAndBelongsToMany もしくは HABTM
に取り組みましょう。この関連が使用されるのは、2つのモデルがあり、それらがさまざまな方法で繰り返し何度も連携する必要がある場合です。

hasMany と HABTM の間の主な違いは、HABTM
内のモデル間の結びつきが排他的ではないということです。たとえば、HABTM
を使用して Recipe モデルが Tag
モデルと連携するとします。おばあちゃんのニョッキ(訳注:イタリアの伝統料理)レシピに
"Italian"
というタグを割り当てても、タグを「使い切る」ことにはなりません。蜂蜜でテカテカの
BBQ スパゲッティにも、"Italian" とタグ付けできます。

hasMany 関連のオブジェクトの間の結びつきは排他的です。User が Comment と
hasMany
である場合、コメントは特定のユーザにのみ結び付けられます。あるユーザに結びついたコメントは、もう他のユーザに結びつけることはできません。

先に進めましょう。HABTM
関連を扱うには、追加のテーブルをデータベースにセットアップする必要があります。この新しい追加のテーブルの名前は、両方のモデルの名前が含まれており、それらをアルファベット順に並べてアンダースコア(「\_」)で繋げたものにします。テーブルは少なくも2つのフィールドを含み、それぞれの外部キー(integer
にすべき)が各モデルの主キーである必要があります。問題を避けるために、これら2つのフィールドを複合主キーにしないでください。アプリケーションにおいてそうする必要がある場合は、ユニークなインデックスを定義します。このテーブルに何か情報を追加する場合は、他のモデルと同じように簡単に扱えるよう、主キーのフィールド(規約上は「id」という名前のフィールド)を追加するとよいでしょう。

**HABTM** 両方の\ *モデル*\ 名を含んだテーブルを追加する必要があります

+--------------------+-------------------------------------------------------+
| 関係               | スキーマ                                              |
+====================+=======================================================+
| Recipe HABTM Tag   | id, recipes\_tags.recipe\_id, recipes\_tags.tag\_id   |
+--------------------+-------------------------------------------------------+
| Cake HABTM Fan     | id, cakes\_fans.cake\_id, cakes\_fans.fan\_id         |
+--------------------+-------------------------------------------------------+
| Foo HABTM Bar      | id, bars\_foos.foo\_id, bars\_foos.bar\_id            |
+--------------------+-------------------------------------------------------+

テーブル名は規約によりアルファベット順です。

新しいテーブルが作成されると、モデルのファイルに HABTM
関連を定義できます。ここでは、文字列による定義ではなく、配列の構文を使いましょう:

::

    <?php

    class Recipe extends AppModel {
        var $name = 'Recipe';   
        var $hasAndBelongsToMany = array(
            'Tag' =>
                array(
                     'className'              => 'Tag',
                     'joinTable'              => 'recipes_tags',
                     'with'                   => '',
                    'foreignKey'             => 'recipe_id',
                    'associationForeignKey'  => 'tag_id',
                    'unique'                 => true,
                    'conditions'             => '',
                    'fields'                 => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'offset'                 => '',
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
        );
    }
    ?>

HABTM 関連の配列で指定可能なキーは次の通りです:

-  **className**: 現在のモデルに関連したモデルのクラス名。‘Recipe HABTM
   Tag’ という関係を定義する場合、className キーは‘Tag’ になります。
-  **joinTable**: 関連で使用する結合テーブルの名前(もし HBTM
   の結合テーブル名が規約に従っていない場合)
-  **with**: 結合テーブルのモデル名の定義。デフォルトでは CakePHP
   は自動的にモデルを生成します。上述の例だと、RecipesTag
   が呼び出されます。デフォルトの名前を上書きするために、このキーを使います。結合テーブルのモデルは、あらゆる「通常の」モデルのように、結合テーブルへアクセスするために使用することができます。
-  **foreignKey**: 現在のモデルにある外部キーの名前。複数の HABTM
   関係を定義する必要がある場合に特に便利です。このキーのデフォルト値は、現在のモデル名のアンダースコア区切りの単数形で、末尾に‘\_id’をつけたものです。
-  **associationForeignKey**:
   もう一方のモデルにある外部キーの名前。複数の HABTM
   関係を定義する必要がある場合に特に便利です。このキーのデフォルト値は、もう一方のモデル名のアンダースコア区切りの単数形で、末尾に‘\_id’をつけたものです。
-  **unique**: もし true(デフォルト)なら、Cake
   は更新を行う際、外部キーのテーブルに新たなレコードを挿入する前に既存の関連レコードを削除します。したがって、更新を行う際には、既存の関連するレコードをもう一度渡す必要があります。
-  **conditions**: 関連モデルのレコードを限定するための SQL。SQL
   内でモデル名を使用することを習慣にしておくようにしておきましょう:“status
   = 1.” よりも、“Comment.status = 1” の方が良い記述です。
-  **fields**:
   関連モデルのデータが取得された際に取り出すフィールドのリストです。デフォルトではすべてのフィールドを返します。
-  **order**: 返される関連する行の並び順を定義する SQL。.
-  **limit**: 返して欲しい関連する行の最大数。
-  **offset**:
   与えられた現在の条件と順番で関連したモデルのレコードを取り出す時に、スキップする行の数。
-  **finderQuery, deleteQuery, insertQuery**:
   関連モデルのレコードを取得・削除・生成するために CakePHP
   が使用できる完全な SQL。これは独自の結果が必要な場合に使用します。

この関連を定義すると、Recipe モデルの find は、関連した Tag
モデルのレコードも(もし存在すれば)取り出します:

::

    // $this->Recipe->find() を呼び出した結果のサンプルArray
    (  
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    )

Tag モデルを使用する際に Recipe データを取得したい場合は、Tag モデルに
HABTM の関連を定義することを覚えておいてください。

HABTM 関連に基づいた独自の find
クエリを実行することもできます。次の例をみてください:

上記の例と同じ構造(Recipe HABTM Tag)を仮定し、'Dessert'
タグをもつすべての Recipe
を取得したいとします。これを達成できる一つの方法(ただし悪い方法)は、アソシエーションそのものに検索する条件を適用することです:

::

    $this->Recipe->bindModel(array(
        'hasAndBelongsToMany' => array(
            'Tag' => array('conditions'=>array('Tag.name'=>'Dessert'))
    )));
    $this->Recipe->find('all');

::

    //Data Returned
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
            [Tag] => Array
                (
                   [0] => Array
                        (
                            [id] => 124
                            [name] => Dessert
                        )
                )
        )
        1 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Crab Cakes
                    [created] => 2008-05-01 10:31:01
                    [user_id] => 2349
                )
            [Tag] => Array
                (
                }
            }
    }

この例では "Dessert"
タグがついた全てのレシピしか返せないことに注意してください。これをきちんと達成するには、いくつかの方法があります。一つの方法は、Recipe
ではなく Tag モデルを検索し、関連付いた Recipe も全て取得する方法です。

::

    $this->Recipe->Tag->find('all', array('conditions'=>array('Tag.name'=>'Dessert')));

与えられた ID を検索するために、CakePHP
が提供する結合テーブルのモデルを使うことも出来ます。

::

    $this->Recipe->bindModel(array('hasOne' => array('RecipesTag')));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('RecipesTag.tag_id'=>124) // id of Dessert
    ));

フィルタリングを行うために必要な数の結合を生成するために、風変わりな関連付けを作成することもできます。例を見てください:

::

    $this->Recipe->bindModel(array(
        'hasOne' => array(
            'RecipesTag',
            'FilterTag' => array(
                'className' => 'Tag',
                'foreignKey' => false,
                'conditions' => array('FilterTag.id = RecipesTag.tag_id')
    ))));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('FilterTag.name'=>'Dessert')
    ));

両方の例は、次のデータを返します:

::

    //Data Returned
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    }

同じようなバインディングトリックで、 HABTM
モデルのページ付けを簡単にすることができます。一点だけ注意が必要です。ページ付けで2つのクエリ(レコードの数を数えるものと、実際のデータを取得するもの)が必要な場合、必ず
``bindModel();`` の ``false``
パラメータをセットしてください。こうすることで、デフォルトのビヘイビアのように、単一ではなく複数のクエリにまたがってモデルの関連が維持されます。詳細は
API に関する文書を参照してください。

アソシエーションをその場で取り扱うことについての詳しい情報は、\ `その場でアソシエーションを生成、廃棄 </ja/view/86/creating-and-destroying-associations-on-the-fly>`_\ の章を参照してください。

その時々の目的に応じて、これらのテクニックを組み合わせたり適用してください。

その場でアソシエーションを生成、廃棄
------------------------------------

その場でモデルのアソシエーションを生成したり廃棄したりする必要がときどきあります。例えば、次のような理由があります:

-  取ってくる関連データを減らしたいが、すべてのアソシエーションが第一レベルのrecursionで設定されている。
-  関連データをソートしたりフィルタリングしたりするために、アソシエーションの設定を変えたい。

このアソシエーションの生成や廃棄は、CakePHP
のbindModel()やunbindModel()などのモデルメソッドを使って実現できます。（"Containable"
という非常に便利なビヘイビアもあります。詳細は組み込みのビヘイビアについてのマニュアルを参照してください）では、モデルを設定してみて、bindModel()
や unbindModel()
がどのように動作するかを見てみましょう。２つのモデルで始めます:

::

    <?php

    class Leader extends AppModel {
        var $name = 'Leader';
     
        var $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }

    ?>

    <?php

    class Follower extends AppModel {
        var $name = 'Follower';
    }

    ?>

LeadersController では、Leader やそれに関連する Follower
を取得するために、Leader モデル内の find()
メソッドを使用できます。上記に示したように、Leader モデル内の
関連配列には "Leader hasMany Followers"
という関係を定義しています。デモとして、コントローラのアクション内でその関連を廃棄するために
unbindModel() を使用してみましょう。

::

    function someAction() {
        // これは Leader を取得して、Follower も取得します
        $this->Leader->findAll();
      
        // hasMany を削除しましょう
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // ここで find 関数を使用すると、
        // Leaders を返しますが、Follower は返しません。
        $this->Leader->findAll();
      
        // 注意: unbindModel はすぐ次の find 関数にのみ影響します。
        // その次の find 呼び出しは設定済みの関連情報を使用して
        // 呼び出されます。
      
        // unbindModel() の後にすでに findAll() を使用してしまったので、
        // ここでは Leader とともに関連する Follower も取得されます。
        $this->Leader->findAll();
    }

もう１点。第２引数に false をセットしない限り、bindModel() や
unbindModel() を使用した関連の削除や追加は、 *次の*
モデル操作のみに作用します。第２引数が *false* にセットされると、bind
は指定されたままの状態になります。次に unbindModel()
の基本的な使用方法のパターンを示します:

::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

その場でアソシエーションを削除できたので、今度は追加してみましょう。まだ何も設定されていない
Leader には Principle（"指導方針"） を関連づけないといけません。Principle
モデルのモデルファイルは、変数 $name
以外の設定は書き込まれていません。その場で Leader に
Principleモデルを関連付けてみましょう。（しかし次の find
操作にのみ影響することを忘れないでください）この関数は LeadersController
内にあります:

::

    function anotherAction() {
        // leader.php モデルファイル内には
        // Leader hasMany Principle がないのでここでは
        // Leader のみ取得します。
        $this->Leader->findAll();
     
        // bindModel() を使用して Leader モデルに新しい関連を
        // 追加しましょう:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // 正しく関連付けされたので
        // １回の find 関数で Leader を取得すると
        // 関連する Principle も取得されます:
        $this->Leader->findAll();
    }

bindModel()
の基本的な使い方は、通常の関連配列と同じで、キーは作成しようとしている関連の種類の後に記述します:

::

    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // 通常の関連のキーをここに記述します
                    )
                )
            )
        );

新しく結合されたモデルは、モデルファイル内に関連の定義は必要ありませんが、適切に新しい関連が動作するためには正しくキーを設定する必要があります。

Multiple relations to the same model
------------------------------------

There are cases where a Model has more than one relation to another
Model. For example you might have a Message model that has two relations
to the User model. One relation to the user that sends a message, and a
second to the user that receives the message. The messages table will
have a field user\_id, but also a field recipient\_id. Now your Message
model can look something like:

::

    <?php
    class Message extends AppModel {
        var $name = 'Message';
        var $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Recipient is an alias for the User model. Now let's see what the User
model would look like.

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement. This
allows you to perform complex searches across multiples tables (i.e:
search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) performs automatic
joins to retrieve data, so you can issue queries to retrieve models
based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You only
have to define the necessary joins to combine tables and get the desired
results for your query.

To force a join between tables you need to use the "modern" syntax for
Model::find(), adding a 'joins' key to the $options array. For example:

::

    $options['joins'] = array(
        array(
            'table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the channels
table. You can alias the table with the model name, so the retrieved
data complies with the CakePHP data structure.

The keys that define the join are the following:

-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model associated
   with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on related model fields:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $pirvateItems = $Item->find('all', $options);

You could perform several joins as needed in hasBelongsToMany:

Suppose a Book hasAndBelongsToMany Tag association. This relation uses a
books\_tags table as join table, so you need to join the books table to
the books\_tags table, and this with the tags table:

::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.book_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

Using joins with Containable behavior could lead to some SQL errors
(duplicate tables), so you need to use the joins method as an
alternative for Containable if your main goal is to perform searches
based on related data. Containable is best suited to restricting the
amount of related data brought by a find statement.

コールバックメソッド
====================

CakePHP
のモデル操作の前後でなんらかのロジックを入れたい場合、モデルのコールバックを使用します。コールバック関数はモデルクラス（AppModel
も含みます）で定義できます。これらの特別な関数の返り値には注意を払うようにしてください。

beforeFind
----------

``beforeFind(mixed $queryData)``

find 関連の操作の前に呼び出されます。このコールバックに渡される
``$queryData`` は現在のクエリーについての情報を持っています: conditions,
fields などです

find 操作を開始したくない場合（おそらく ``$queryData``
オプションに関連した決定に基づきます）、\ *false*
を返します。もしそうでない場合は、変更した ``$queryData`` を返すか、find
に渡したいものやそれ相応のものを返します。

ユーザのルールに基づいて find
操作を制限するためにこのコールバックを使用したり、現在の読み込みに基づいて決定をキャッシュしたりするかもしれません。

afterFind
---------

``afterFind(array $results, bool $primary)``

find から返された結果を変更するため、あるいは他の find
の後にロジックを実行するためにこのコールバックを使用します。このコールバックに渡された
$results パラメータには、モデルの find
から返された結果が含まれます。たとえば次のようなものです:

::

    $results = array(
      0 => array(
        'ModelName' => array(
          'field1' => 'value1',
          'field2' => 'value2',
        ),
      ),
    );

このコールバックの返り値は、このコールバックを呼び出した find
の結果(を加工したもの)にするべきです。

$primary が false の場合、$results
のフォーマットは期待するものとは少し異なります。通常の find
の結果の代わりに次のようになります:

::

    $results = array(
      'field_1' => 'value',
      'field_2' => 'value2'
    );

再帰的に find を使用した場合、\ ``$primary`` が true
であると期待しているコードは "Cannot use string offset as an array"
という fatal エラーになるでしょう。

afterFind によってデータをフォーマットする例を次に示します。

::

    function afterFind($results) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }

    function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
--------------

``beforeValidate()``

バリデートされる前にモデルのデータを変更するか、必要に応じてバリデーションルールを変更するために、このコールバックを使用します。この関数は
*true* を返さなければなりません。そうでない場合、現在の save()
の実行が中断されます。

beforeSave
----------

``beforeSave()``

この関数に保存前のロジックを置きます。この関数はモデルのデータがバリデートに成功した後、データが保存される前に実行されます。save
の処理を継続するには、この関数は true を返す必要があります。

このコールバックは、データが保存される前にそのデータを加工する場合、特に便利です。ストレージエンジンが特別な形式の日付を必要とする場合、$this->data
でアクセスし、変更します。

afterSave
によってどのようにデータを加工するかの例を次に示します。この例におけるコードは、begindate
がデータベース中では YYYY-MM-DD という書式で、アプリケーションにおいては
DD-MM-YYYY
という書式にするコードです。もちろん、この変更は簡単に行えます。このコードを適切なモデルにおいて使用します。

::

    function beforeSave() {
        if(!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
                $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
                $this->data['Event']['enddate'] = $this->dateFormat($this->data['Event']['enddate']);
        }
        return true;
    }

    function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString)); // Direction is from 
    }

beforeSave() が true を返すようにしてください。そうしないと save
は失敗します。

afterSave
---------

``afterSave(boolean $created)``

各 save
操作の後に実行する必要のあるロジックがある場合、このコールバックメソッドに置きます。

新しいオブジェクトが（更新ではなく）生成された場合、\ ``$created`` は true
になります。

beforeDelete
------------

``beforeDelete()``

この関数に 削除前ロジックを置きます。削除を継続したい場合は、この関数は
true を返す必要があります。アボートしたい場合は false を返します。

afterDelete
-----------

``afterDelete()``

このコールバックメソッドに、削除の後に実行したいロジックを置きます。

onError
-------

``onError()``

問題が起こった場合に呼び出されます。

Model の属性
============

モデルの属性を使用してプロパティを設定することで、デフォルトのモデルの振る舞いを上書きすることができます。

モデルの属性とその説明の完全な一覧は CakePHP の API
にあります。\ `https://api.cakephp.org/1.2/class\_model.html <https://api.cakephp.org/1.2/class_model.html>`_
をチェックしてください。

useDbConfig
-----------

``useDbConfig``
プロパティは、使用したいデータベース設定ファイル内のどのパラメータを使用するかを指定します。データベース設定ファイルは、/app/config/database.php
に保存されます。

使用例:

::

    class Example extends AppModel {
       var $useDbConfig = 'alternate';
    }

``useDbConfig`` プロパティのデフォルトは 'default' です。

useTable
--------

``useTable``
プロパティは、データベースのテーブル名を指定します。デフォルトはモデルクラス名を小文字にし複数形にしたものです。モデルがデータベースのテーブルを使用しない場合、この属性に別のテーブル名を設定するか、あるいは
``false`` を設定します。

使用例:

::

    class Example extends AppModel {
       var $useTable = false; // このモデルはデータベーステーブルを使用しない
    }

別の例:

::

    class Example extends AppModel {
       var $useTable = 'exmp'; // このモデルはデータベーステーブル 'exmp' を使用します
    }

tablePrefix
-----------

モデルに適用するテーブルの接頭辞名。テーブル接頭辞は、データベース接続ファイル
/app/config/database.php
で予め設定します。デフォルトでは接頭辞を使用しません。モデルの
``tablePrefix`` 属性を設定することでデフォルト値を上書きできます。

使用例:

::

    class Example extends AppModel {
       var $tablePrefix = 'alternate_'; // 'alternate_examples' を探します
    }

primaryKey
----------

通常、各テーブルには主キー ``id``
があります。主キーとしてどのフィールド名をモデルが使用するかを変更する場合があります。これは既存のデータベーステーブルを使用するために
CakePHP を設定する場合によくあることです。

使用例:

::

    class Example extends AppModel {
        var $primaryKey = 'example_id'; // example_id データベース内のフィールド名です
    }

displayField
------------

``displayField``
属性は、どのデータベースフィールドをレコードのラベルとして使用するかを指定します。ラベルは
scaffold や ``find('list')``
の呼び出しで使用されます。モデルはデフォルトでは、 ``name`` または
``title`` を使用します。

たとえば、\ ``username`` フィールドを使用するには、次のように行います:

::

    class User extends AppModel {
       var $displayField = 'username';
    }

複数のフィールド名は１つの表示フィールドに結合されません。たとえば、表示フィールドとして
``array('first_name', 'last_name')`` のように指定できません。

recursive
---------

recursive プロパティは、CakePHP が ``find()`` や ``findAll()`` 、
``read()``
メソッドを通しても関連するモデルデータをどの階層まで取得するかを定義します。

アプリケーションがあるドメインに属している Group をもち、Groupが多くの
User をもち、同様に User が多くの Article
を持っているとします。$this->Group->find()
を呼び出し、取得したいデータ量に基づいて、$recursive
に異なる値を設定することができます:

+--------+------------------------------------------------------------------------------------------------------+
| 深さ   | 説明                                                                                                 |
+========+======================================================================================================+
| -1     | Cake は Group データだけを取得します。join しません。                                                |
+--------+------------------------------------------------------------------------------------------------------+
| 0      | Cake は Group データとそのドメインを取得します。                                                     |
+--------+------------------------------------------------------------------------------------------------------+
| 1      | Cake は１つの Group とそのドメインとそれに関連した User を取得します。                               |
+--------+------------------------------------------------------------------------------------------------------+
| 2      | Cake は１つの Group とそのドメインとそれに関連した User と各 User に関連した Article を取得します。  |
+--------+------------------------------------------------------------------------------------------------------+

必要以上に高く設定しないでください。CakePHP
がデータを取得する際に、不必要にアプリケーションを遅くしたくないでしょう。

$recursive を ``fields`` の機能と結合したい場合、手動で ``fields``
配列に必要な外部キーを含むカラムを追加しなければなりません。上記の例では、\ ``domain_id``
を追加することになります。

order
-----

find 操作のデフォルトのデータの順番。下記のような設定が可能です。:

::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
----

モデルの取得したデータ用のコンテナ。モデルクラスから返されたデータは通常
find() 呼び出しの返り値として使用されますが、モデルのコールバック内で
$data に保存された情報にアクセスする必要がある場合があります。

\_schema
--------

モデルのデータベーステーブルフィールドの詳細であるメタデータをもちます。各フィールドは次のようになっています:

-  名前
-  型(integer, string, datetime, etc.)
-  null
-  デフォルト値
-  長さ

使用例：

::

    var $_schema = array(
        'first_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
--------

この属性は、モデルが保存前にデータバリデーションの判定を行うルールを保持します。フィールドの後の名前付きキーは正規表現の値を保持し、モデルがそれにマッチするものを探します。

注意: save()
は実際にデータを保存する前に、自動的にバリデーションを行うので、save()
の前に validate() をコールする必要はありません。

バリデーションに関するより詳しい情報は、このマニュアルの後にある\ `データのバリデーションの章 </ja/view/125/data-validation>`_\ を見てください。

name
----

この章の前の方でみてきたように、name 属性は PHP4
ユーザ用の互換性のためにあります。モデル名と同じ値をセットします。

使用例:

::

    class Example extends AppModel {
       var $name = 'Example';
    }

cacheQueries
------------

true
を設定すると、モデルによって取得されたデータは１つのリクエストの間キャッシュされます。このキャッシュはメモリ内のみで、リクエストの間のみ持続します。同じデータに対する重複したリクエストはキャッシュによって処理されます。

独自のメソッドとプロパティ
==========================

CakePHP
のモデルの標準機能があれば、やる必要があることはなんでもできるはずです。しかし、モデルのクラスもクラスなのだということを忘れないでください。クラスなので、好きなメソッドを追加したり、好きなプロパティを定義したりできるのです。

データの保存や取得を扱う操作は、モデルクラスの中に入れてしまうのがいいでしょう。こういう考え方は、普通、太ったモデル
(fat model) といわれます。

::

    class Example extends AppModel {

       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
          );
          return $this->find('all', compact('conditions'));
       }
    }

こうしておけば、\ ``getRecent()``
メソッドをコントローラ内で使えるようになります。

::

    $recent = $this->Example->getRecent();

