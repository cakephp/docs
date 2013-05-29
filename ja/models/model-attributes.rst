モデルの属性
############

モデルの属性を用いて、
デフォルトのモデルの働きを上書きできるプロパティーを設定することができます。

モデルの属性の完全なリストと説明については、CakePHP APIを見てください。
`http://api20.cakephp.org/class/model <http://api20.cakephp.org/class/model>`_

useDbConfig
===========

``useDbConfig`` プロパティはモデルクラスを関連するデータベース・テーブルに紐付けるために用いられる、
データベース・コネクションの名前を指定する文字列になります。
データーベース設定ファイルに定義されたデータベースコレクションのうちどれか一つを設定できます。
データベース設定ファイルは /app/Config/database.php に保存します。

``useDbConfig`` プロパティの初期値は「default」データベース・コネクションになります。

使用例:

::

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

モデルで使われるテーブルの接頭辞(*prefix*)の名前です。
テーブル接頭辞は /app/Config/database.php
にあるデータベース・コネクションのファイルで初期値が設定されます。
デフォルトでは接頭辞はありません。
モデルで ``tablePrefix`` 属性を設定することで初期値を上書きすることができます。

使用例::

    class Example extends AppModel {
        public $tablePrefix = 'alternate_'; // 「alternate_examples」を見に行く
    }

.. _model-primaryKey:

primaryKey
==========

各々のテーブルは通常、``id`` という主キーを持ちますが、
モデルがどのフィールド名を主キーとして使うか変えることができます。
これはCakePHPに既存のデータベース・テーブルを使用させる場合、よくあることです。

使用例::

    class Example extends AppModel {
        public $primaryKey = 'example_id'; // example_idはデータベースのフィールド名
    }


.. _model-displayField:

displayField
============

``displayField`` 属性はどのデータベースのフィールドがレコードの表題(*label*)として使われるべきかを指定します。
この表題はスキャフォールディングと ``find('list')`` の呼び出しで用いられます。
モデルはデフォルトで、 ``name`` か ``title`` を使います。

例えば、 ``username`` フィールドを使うには以下のようにします::

    class User extends AppModel {
        public $displayField = 'username';
    }

複数のフィールド名は組み合わせて一つのディスプレイフィールド(*display field*)にk結合することはできません。
例えば、 ``array('first_name', 'last_name')`` をディスプレイフィールドとして指定することはできません。
代わりにモデルの属性であるvirtualFieldsでバーチャルフィールドを作成してください。

recursive
=========

recursiveプロパティはCakePHPが ``find()`` 、 ``findAll()`` 、 ``read()``
らのメソッドを通して、どのぐらい深く関連モデルのデータを取得すべきか、
を定義します。

アプリケーションががあるドメインに属しているGroupがあり(belongsTo)、Groupが多くのUserをもち(hasMany)、同様にUserが多くのArticleを持っているとします。
$this->Group->find()を呼び出し、取得したいデータ量に基づいて、$recursiveに異なる値を設定することができます:

* -1 CakeはGroupのデータだけを取得します。joinしません。
* 0  CakeはGroupのデータとそのドメインを取得します。
* 1  Cake は１つのGroupとそのドメインとそれに関連したUserを取得します。
* 2  Cake は１つのGroupとそのドメインとそれに関連したUserと各Userに関連したArticleを取得します。

必要以上に高く設定しないでください。
CakePHPがデータを取得する際に、
不必要にアプリケーションを遅くしたくないでしょう。
また、recursiveレベルの初期値が1であることも覚えていてください。

.. note::

    $recursiveと ``fields`` の機能を組み合わせたい場合、
    手動で ``fields`` 配列に必要な外部キーを含むカラムを追加しなければなりません。
    上記の例では、 ``domain_id`` を追加することになります。

.. tip::

    recursiveレベルは-1にしておいたほうがよいでしょう。
    こうしておくと、不要な関連データを取得してしまうのを回避できます。
    これは、おそらく find() を呼び出すほとんどの場合に望ましい結果になります。
    必要な場合にのみrecursiveレベルを設定して関連データを取得させるか、もしくはContainableビヘイビアを使いましょう。

    AppModelに次のような設定を追加します。::

        public $recursive = -1;

order
=====

find操作のデフォルトのデータの順番。
下記のような設定が可能です。::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
====

モデルの取得したデータ用のコンテナになります。
モデルクラスから返されたデータは通常find()
呼び出しの返り値として使用されますが、
モデルのコールバック内で$data
に保存された情報にアクセスする必要がある場合があります。

\_schema
========

デルのデータベーステーブルフィールドの詳細であるメタデータをもちます。
各フィールドは次のようになっています:

-  name
-  type (integer, string, datetime, etc.)
-  null
-  default value
-  length

使用例::

    public $_schema = array(
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
========

この属性は、モデルが保存前にデータバリデーションの判定を行うルールを保持します。
フィールドにちなんで名付けられたキーが正規表現の値をもつことで、
モデルがマッチングをすることができます。

.. note::

    save()はデータを実際に保存する前に自動的にバリデーションを行うので、
    save()の前にvalidate()を呼ぶ必要はありません。

バリデーションに関する詳しい情報は、このマニュアルの後にある `/models/data-validation` をみてください。

virtualFields
=============

モデルが持つバーチャルフィールドの配列です。
バーチャルフィールドはSQL表現へのエイリアスです。
このプロパティに追加されたフィールドは、
他のモデルフィールドと同じように読み込まれますが、保存することはできません。

MySQLでの使用例::
Example usage for MySQL::

    public $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

これを行った後、find操作で取得したデータのUserには ``name`` キーに連結された結果が格納されているでしょう。
データベースにバーチャルフィールドと同じ名前のカラムを作成するのは賢明ではありません。
これはSQLエラーを引き起こす場合があります。

``virtualFields`` プロパティに関する詳しい情報、正しい用法、また制限については、
:doc:`/models/virtual-fields` を見てください。

name
====

モデルの名前。
モデルのファイルでこれを指定しない場合、コンストラクタでクラス名が設定されます。

使用例::

    class Example extends AppModel {
        public $name = 'Example';
    }

cacheQueries
============

trueを設定すると、モデルによって取得されたデータは１つのリクエストの間キャッシュされます。
このキャッシュはメモリ内のみで、リクエストの間のみ持続します。
同じデータに対する重複したリクエストはキャッシュによって処理されます。
