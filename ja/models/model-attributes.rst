モデルの属性
############

モデルの属性を用いて、デフォルトのモデルの振る舞いを上書きできるプロパティを
設定することができます。

モデルの属性の完全なリストと説明については、
`CakePHP API <https://api.cakephp.org/2.x/class-Model.html>`_ をご覧ください。

useDbConfig
===========

``useDbConfig`` プロパティはモデルクラスを関連するデータベース・テーブルに紐付けるために用いられる、
データベース・コネクションの名前を指定する文字列になります。
データーベース設定ファイルに定義されたデータベースコレクションのうちどれか一つを設定できます。
データベース設定ファイルは /app/Config/database.php に保存します。

``useDbConfig`` プロパティの初期値は「default」データベース・コネクションになります。

使用例::

    class Example extends AppModel {
        public $useDbConfig = 'alternate';
    }

useTable
========

``useTable`` プロパティはデータベースのテーブル名を指定します。
デフォルトでは、モデルのクラス名の小文字の複数形が用いられます。
この属性を他のテーブル名にするか、
データベース・テーブルをこのモデルで使いたくない場合、 ``false``
を指定してください。

使用例::

    class Example extends AppModel {
        public $useTable = false; // このモデルはデータベース・テーブルを使いません
    }

あるいは::

    class Example extends AppModel {
        public $useTable = 'exmp'; // このモデルは「exmp」というデータベース・テーブルを使います
    }

tablePrefix
===========

モデルで使われるテーブルの接頭辞 (*prefix*) の名前です。テーブル接頭辞は
/app/Config/database.php にあるデータベース・コネクションのファイルで初期値が設定されます。
デフォルトでは接頭辞はありません。モデルで ``tablePrefix`` 属性を設定することで初期値を
上書きすることができます。

使用例::

    class Example extends AppModel {
        public $tablePrefix = 'alternate_'; // 「alternate_examples」を見に行く
    }

.. _model-primaryKey:

primaryKey
==========

各々のテーブルは通常、 ``id`` という主キーを持ちますが、
モデルがどのフィールド名を主キーとして使うか変えることができます。
これは CakePHP に既存のデータベース・テーブルを使用させる場合、よくあることです。

使用例::

    class Example extends AppModel {
        // example_idは データベースのフィールド名
        public $primaryKey = 'example_id';
    }


.. _model-displayField:

displayField
============

``displayField`` 属性はどのデータベースのフィールドがレコードの表題 (*label*) として
使われるべきかを指定します。この表題はスキャフォールディングと ``find('list')`` の呼び出しで
用いられます。モデルはデフォルトで、 ``name`` か ``title`` を使います。

例えば、 ``username`` フィールドを使うには以下のようにします::

    class User extends AppModel {
        public $displayField = 'username';
    }

複数のフィールド名は組み合わせて一つのディスプレイフィールド (*display field*) に
結合することはできません。例えば、 ``array('first_name', 'last_name')`` を
ディスプレイフィールドとして指定することはできません。
代わりにモデルの属性である virtualFields でバーチャルフィールドを作成してください。

recursive
=========

recursive プロパティは CakePHP が ``find()`` 、 ``read()``
メソッドを通して、どのぐらい深く関連モデルのデータを取得すべきかを定義します。

アプリケーションががあるドメインに属している Group があり (belongsTo)、
Group が多くの User を持ち (hasMany)、同様に User が多くの Article を持っているとします。
$this->Group->find() を呼び出し、取得したいデータ量に基づいて、$recursive に異なる値を
設定することができます:

* -1 CakePHP は Group のデータだけを取得します。join しません。
* 0  CakePHP は Group のデータとそのドメインを取得します。
* 1  CakePHP は１つの Group とそのドメインとそれに関連した User を取得します。
* 2  CakePHP は１つの Group とそのドメインとそれに関連した User と各 User に関連した
  Article を取得します。

必要以上に高く設定しないでください。CakePHP がデータを取得する際に、
不必要にアプリケーションを遅くしたくないでしょう。
また、recursive レベルの初期値が 1 であることも覚えていてください。

.. note::

    $recursive と ``fields`` の機能を組み合わせたい場合、
    手動で ``fields`` 配列に必要な外部キーを含むカラムを追加しなければなりません。
    上記の例では、 ``domain_id`` を追加することになります。

.. tip::

    recursive レベルは -1 にしておいたほうがよいでしょう。
    こうしておくと、不要な関連データを取得してしまうのを回避できます。
    これは、おそらく find() を呼び出すほとんどの場合に望ましい結果になります。
    必要な場合にのみ recursive レベルを設定して関連データを取得させるか、もしくは
    Containable ビヘイビアを使いましょう。

    AppModel に次のような設定を追加します。::

        public $recursive = -1;

order
=====

find 操作のデフォルトのデータの順番。下記のような設定が可能です。 ::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
====

モデルの取得したデータ用のコンテナになります。モデルクラスから返されたデータは通常 find()
呼び出しの返り値として使用されますが、モデルのコールバック内で $data に保存された情報に
アクセスする必要がある場合があります。

\_schema
========

データベーステーブルフィールドの詳細であるメタデータをもちます。
各フィールドは次のようになっています:

-  name
-  type

CakePHP がサポートする型は:

string
    一般的には、CHAR または VARCHAR のカラムを使用します。SQL Server では、
    NCHAR や NVARCHAR の型が使用されます。
text
    TEXT や MONEY の型に対応します。
uuid
    データベースが UUID 型を提供する場合は UUID 型に対応し、
    そうでなければ CHAR(36) 型のフィールドを生成します。
tinyinteger
    データベースが提供する TINYINT または SMALLINT 型に対応します。
smallinteger
    テータベースが提供する SMALLINT 型に対応します。
integer
    データベースが提供する INTEGER 型に対応します。
biginteger
    データベースが提供する BIGINT 型に対応します。
decimal
    DECIMAL や NUMERIC 型に対応します。
float
    REAL や DOUBLE PRECISION 型に対応します。
boolean
    MySQL 以外は BOOLEAN。ここで TINYINT(1) は boolean を表すために使用されます。
binary
    データベースが提供する BLOB または BYTEA 型に対応します。
date
    タイムゾーン無しの DATE カラム型に対応します。
datetime
    タイムゾーン無しの DATETIME カラム型に対応します。PostgreSQL や SQL Server では、
    TIMESTAMP または TIMESTAMPTZ 型に変わります。
timestamp
    TIMESTAMP 型に対応します。
time
    全てのデータベースで TIME 型に対応します。

-  null
-  default value
-  length

使用例::

    protected $_schema = array(
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

.. versionchanged:: 2.10.0
    ``smallinteger`` 型と ``tinyinteger`` 型は 2.10.0 で追加されました。

validate
========

この属性は、モデルが保存前にデータバリデーションの判定を行うルールを保持します。
フィールドにちなんで名付けられたキーが正規表現の値をもつことで、
モデルがマッチングをすることができます。

.. note::

    save() はデータを実際に保存する前に自動的にバリデーションを行うので、
    save() の前に validate() を呼ぶ必要はありません。

バリデーションに関する詳しい情報は、このマニュアルの後にある `/models/data-validation` を
ご覧ください。

virtualFields
=============

モデルが持つバーチャルフィールドの配列です。バーチャルフィールドは SQL 表現へのエイリアスです。
このプロパティに追加されたフィールドは、他のモデルフィールドと同じように読み込まれますが、
保存することはできません。

MySQL での使用例::

    public $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

これを行った後、find 操作で取得したデータの User には ``name`` キーに連結された結果が
格納されているでしょう。データベースにバーチャルフィールドと同じ名前のカラムを作成するのは
賢明ではありません。これは SQL エラーを引き起こす場合があります。

``virtualFields`` プロパティに関する詳しい情報、正しい用法、また制限については、
:doc:`/models/virtual-fields` をご覧ください。

name
====

モデルの名前。モデルのファイルでこれを指定しない場合、コンストラクタでクラス名が設定されます。

使用例::

    class Example extends AppModel {
        public $name = 'Example';
    }

cacheQueries
============

true を設定すると、モデルによって取得されたデータは１つのリクエストの間キャッシュされます。
このキャッシュはメモリ内のみで、リクエストの間のみ持続します。
同じデータに対する重複したリクエストはキャッシュによって処理されます。


.. meta::
    :title lang=ja: Model Attributes
    :keywords lang=ja: alternate table,default model,database configuration,model example,database table,default database,model class,model behavior,class model,plural form,database connections,database connection,attribute,attributes,complete list,config,cakephp,api,class example
