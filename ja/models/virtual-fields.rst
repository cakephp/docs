..
   Virtual fields
   ##############

バーチャルフィールド
####################

..
  Virtual fields allow you to create arbitrary SQL expressions and
  assign them as fields in a Model. These fields cannot be saved, but
  will be treated like other model fields for read operations. They
  will be indexed under the model's key alongside other model
  fields.

バーチャルフィールドは任意のSQL表現を作り、\
それをモデルのフィールドとして割り当てることを可能にします。これらのフィールドは保存することはできませんが、\
読み込み操作時にモデルの他のフィールドと同じように扱われることになります。\
また、モデルの他のフィールドと同じように、モデルのキーを元に配置されます。

..
   Creating virtual fields
   =======================

バーチャルフィールドの作成
==========================

..
  Creating virtual fields is easy. In each model you can define a
  ``$virtualFields`` property that contains an array of field =>
  expressions. An example of a virtual field definition using MySQL
  would be::

バーチャルフィールドを作るのは簡単です。各々のモデルに、フィールド => 式 という内容の配列を用いた ``$virtualFields`` プロパティを\
定義することができます。MySQLを用いたバーチャルフィールドの定義の例としては、\
以下のようになります。 ::

    public $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

..
  And with PostgreSQL

PostgreSQLだと、以下のようになります。 ::

    public $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

..
  In subsequent find operations, your User results would contain a
  ``name`` key with the result of the concatenation. It is not
  advisable to create virtual fields with the same names as columns
  on the database, this can cause SQL errors.

これを行った後、find操作で取得したデータのUserには ``name`` キーに連結された結果が格納されているでしょう。\
データベースにバーチャルフィールドと同じ名前のカラムを作成するのは賢明ではありません。\
これはSQLエラーを引き起こす場合があります。

..
   It is not always useful to have **User.first\_name** fully
   qualified. If you do not follow the convention (i.e. you have
   multiple relations to other tables) this would result in an error.
   In this case it may be better to just use
   ``first_name || \' \' || last_name`` without the Model
   Name.

**User.first\_name** のように完全に修飾することは、常に有用というわけではありません。\
もし規約に従わない場合(すなわち、他のテーブルへの関連を複数持つ場合)、エラーになります。\
この場合、 ``first_name || \' \' || last_name`` のように、モデル名なしで使用するほうがいいかもしれません。

..
   Using virtual fields
   ====================

バーチャルフィールドの使用
==========================

..
   Creating virtual fields is straightforward and easy, interacting
   with virtual fields can be done through a few different methods.

バーチャルフィールドを作るのは至極簡単ですが、\
バーチャルフィールドとの対話はいくつかの異なった方法でなされます。

Model::hasField()
-----------------

..
   Model::hasField() will return true if the model has a concrete field passed by
   the first parameter. By setting the second parameter of `hasField()` to true,
   virtualFields will also be checked when checking if a model has a field.
   Using the example field above::

Model::hasField() は、モデルが実際に持っているフィールドを一番目の引数で渡すと true を返します。\
`hasField()` の二番目の引数を true にすることによって、\
バーチャルフィールドもチェックされるようになります。\
上記の例を用いれば、 ::

    $this->User->hasField('name'); // 「name」というフィールドが実在しないため false を返します。
    $this->User->hasField('name', true); // 「name」というバーチャルフィールドがあるため true を返します。

Model::isVirtualField()
-----------------------

..
   This method can be used to check if a field/column is a virtual
   field or a concrete field. Will return true if the column is
   virtual::

このメソッドは、フィールド・カラムが\
バーチャルフィールドか実在するフィールドかどうかを判定するときに用いられます。カラムがバーチャルであるときに true を返します。 ::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()
------------------------

..
   This method can be used to access the SQL expression that comprises
   a virtual field. If no argument is supplied it will return all
   virtual fields in a Model::

このメソッドは、バーチャルフィールドを構成するSQL表現にアクセスするために用いられます。引数が与えられない場合、\
そのモデルのすべてのバーチャルフィールドを返します。 ::

    $this->User->getVirtualField('name'); // 'CONCAT(User.first_name, ' ', User.last_name)' を返します。

Model::find()とバーチャルフィールド
-----------------------------------

..
   As stated earlier ``Model::find()`` will treat virtual fields much
   like any other field in a model. The value of a virtual field will
   be placed under the model's key in the resultset::

先に述べたように、 ``Model::find()`` はモデルの他のフィールドと同じように\
バーチャルフィールドを扱います。返り値のセットの中で、バーチャルフィールドの値は\
モデルのキーの下に置かれます。 ::

    $results = $this->User->find('first');

    // 返り値は以下のものを含みます。
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

..
   Pagination and virtual fields
   -----------------------------

ページネーションとバーチャルフィールド
--------------------------------------

..
   Since virtual fields behave much like regular fields when doing
   find's, ``Controller::paginate()`` will be able to sort by virtual fields too.

バーチャルフィールドは find 時に普通のフィールドと同じように振舞うため、\
``Controller::paginate()`` はバーチャルフィールドでもソートすることができます。

..
   Virtual fields and model aliases
   ================================

バーチャルフィールドとモデルのエイリアス
========================================

..
   When you are using virtualFields and models with aliases that are
   not the same as their name, you can run into problems as
   virtualFields do not update to reflect the bound alias. If you are
   using virtualFields in models that have more than one alias it is
   best to define the virtualFields in your model's constructor::

自身の名前と違うエイリアスを持つモデルと\
バーチャルフィールドを同時に用いた場合、結びつけられたエイリアスが反映されないという\
問題にぶつかることがあります。\
別名を持つようなモデルでバーチャルフィールドを使用するには、\
モデルのコンストラクタでバーチャルフィールドを定義するのがベストでしょう。 ::

    public function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['name'] = sprintf('CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias);
    }

..
   This will allow your virtualFields to work for any alias you give a
   model.

これで、モデルにどんなエイリアスを与えても、バーチャルフィールドはうまく動くことでしょう。

..
   Virtual fields in SQL queries
   =============================

SQLクエリ内でのバーチャルフィールドの利用
=========================================

..
   Using functions in direct SQL queries will prevent data from being returned in the same array as your model's data. 
   For example this::

SQLクエリ中で直接使用される関数は、返されるデータがモデルのデータと同じ配列に格納されるのを防ぎます。\
例えば以下のようなとき ::

    $this->Timelog->query("SELECT project_id, SUM(id) as TotalHours FROM timelogs AS Timelog GROUP BY project_id;");

..
   would return something like this::

戻り値はこのようになります。 ::
	
   Array
   (
       [0] => Array
           (
               [Timelog] => Array
                   (
                       [project_id] => 1234
                   )
                [0] => Array
                    (
                        [TotalHours] => 25.5
                    )
           )
    )

..
   If we want to group TotalHours into our Timelog array we should specify a
   virtual field for our aggregate column.  We can add this new virtual field on
   the fly rather than permanently declaring it in the model. We will provide a
   default value of ``0`` in case another query attempts to use this virtual field.
   If that were to occur, ``0`` would be returned in the TotalHours column::

もし TotalHours を Timelog 配列にグループ化したい場合、集計カラムのためのバーチャルフィールドを指定する必要があります。\
永続的にモデルに宣言しなくても、その場で新しいバーチャルフィールドを追加することができます。\
別のクエリがバーチャルフィールドを使用しようとする場合、デフォルト値として ``0`` を与えます。\
それが発生した場合、 ``0`` が TotalHours 列に入ります。 ::

    $this->Timelog->virtualFields['TotalHours'] = 0;

..
   In addition to adding the virtual field we also need to alias our column using
   the form of ``MyModel__MyField`` like this::

また、バーチャルフィールドを追加することに加えて、カラムを ``MyModel__MyField`` の形式で別名にする必要があります。 ::

    $this->Timelog->query("SELECT project_id, SUM(id) as Timelog__TotalHours FROM timelogs AS Timelog GROUP BY project_id;");

..
   Running the query again after specifying the virtual field should result in a
   cleaner grouping of values::

バーチャルフィールドを設定した後クエリを再度実行すると、きれいな値のグループになるはずです。 ::

    Array
    (
        [0] => Array
            (
                [Timelog] => Array
                    (
                        [project_id] => 1234
                        [TotalHours] => 25.5
                    )
            )
    )
	
..
   Limitations of virtualFields
   ============================

バーチャルフィールドの制限
==========================

..
   The implementation of ``virtualFields`` has a few
   limitations. First you cannot use ``virtualFields`` on associated
   models for conditions, order, or fields arrays. Doing so will
   generally result in an SQL error as the fields are not replaced by
   the ORM. This is because it difficult to estimate the depth at
   which an associated model might be found.

``virtualFields`` の実装はわずかな制限があります。\
まず、関連モデルの「conditions」、「order」、「fields」に ``virtualFields`` を用いることが出来ません。\
やってみると、ORMがフィールドを置き換えないため、まずSQLエラーが起きてしまいます。\
これは関連モデルを見つけられるかもしれない深さを見積もるのが難しいということに起因します。

..
   A common workaround for this implementation issue is to copy
   ``virtualFields`` from one model to another at runtime when you
   need to access them::

この実装の問題に対する一般的な回避策としては、
利用する必要がある時に ``virtualFields`` をあるモデルから別のモデルにコピーすることです。 ::

    $this->virtualFields['name'] = $this->Author->virtualFields['name'];

もしくは以下のようにします。 ::

    $this->virtualFields += $this->Author->virtualFields;

.. meta::
    :title lang=en: Virtual fields
    :keywords lang=en: sql expressions,array name,model fields,sql errors,virtual field,concatenation,model name,first name last name
