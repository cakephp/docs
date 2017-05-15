バーチャルフィールド
####################

バーチャルフィールドは任意の SQL 表現を作り、それをモデルのフィールドとして割り当てることを
可能にします。これらのフィールドは保存することはできませんが、
読み込み操作時にモデルの他のフィールドと同じように扱われることになります。
また、モデルの他のフィールドと同じように、モデルのキーを元に配置されます。

バーチャルフィールドの作成
==========================

バーチャルフィールドを作るのは簡単です。各々のモデルに、フィールド => 式 という内容の配列を用いた
``$virtualFields`` プロパティを定義することができます。MySQL を用いたバーチャルフィールドの
定義の例としては、以下のようになります。 ::

    public $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

PostgreSQLだと、以下のようになります。 ::

    public $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

これを行った後、find 操作で取得したデータの User には
``name`` キーに連結された結果が格納されているでしょう。
データベースにバーチャルフィールドと同じ名前のカラムを作成するのは賢明ではありません。
これは SQL エラーを引き起こす場合があります。

**User.first\_name** のように完全に修飾することは、常に有用というわけではありません。
もし規約に従わない場合(すなわち、他のテーブルへの関連を複数持つ場合)、エラーになります。
この場合、 ``first_name || \' \' || last_name`` のように、
モデル名なしで使用するほうがいいかもしれません。

バーチャルフィールドの使用
==========================

バーチャルフィールドを作るのはとても簡単ですが、
バーチャルフィールドとの対話はいくつかの異なった方法でなされます。

Model::hasField()
-----------------

Model::hasField() は、モデルが実際に持っているフィールドを一番目の引数で渡すと true を返します。
`hasField()` の二番目の引数を true にすることによって、バーチャルフィールドもチェックされるように
なります。上記の例を用いれば::

    // 「name」というフィールドが実在しないため false を返します。
    $this->User->hasField('name');
    // 「name」というバーチャルフィールドがあるため true を返します。
    $this->User->hasField('name', true);

Model::isVirtualField()
-----------------------

このメソッドは、フィールド・カラムがバーチャルフィールドか実在するフィールドかどうかを
判定するときに用いられます。カラムがバーチャルであるときに true を返します。 ::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()
------------------------

このメソッドは、バーチャルフィールドを構成する SQL 表現にアクセスするために用いられます。
引数が与えられない場合、そのモデルのすべてのバーチャルフィールドを返します。 ::

    // 'CONCAT(User.first_name, ' ', User.last_name)' を返します。
    $this->User->getVirtualField('name');

Model::find() とバーチャルフィールド
------------------------------------

先に述べたように、 ``Model::find()`` はモデルの他のフィールドと同じように
バーチャルフィールドを扱います。返り値のセットの中で、バーチャルフィールドの値は
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

ページネーションとバーチャルフィールド
--------------------------------------

バーチャルフィールドは find 時に普通のフィールドと同じように振舞うため、
``Controller::paginate()`` はバーチャルフィールドでもソートすることができます。

バーチャルフィールドとモデルのエイリアス
========================================

自身の名前と違うエイリアスを持つモデルとバーチャルフィールドを同時に用いた場合、
結びつけられたエイリアスが反映されないという問題にぶつかることがあります。
別名を持つようなモデルでバーチャルフィールドを使用するには、
モデルのコンストラクタでバーチャルフィールドを定義するのがベストでしょう。 ::

    public function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['name'] = sprintf(
            'CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias
        );
    }

これで、モデルにどんなエイリアスを与えても、バーチャルフィールドはうまく動くことでしょう。

JOINS を使ったページ制御とバーチャルフィールドの設定
==========================================================

次の例は、hasMany アソシエーションのカウンターを持ち、バーチャルフィールドを有効にすることができます。
例えば、もしテンプレートの中で次のようなソートリンクがある場合、 ::

    // バーチャルフィールドのソートリンクを作成
    $this->Paginator->sort('ProductsItems.Total','Items Total');

コントローラの中で、次のようなページ制御の設定を行います。 ::

    $this->Products->recursive = -1;

    // Products hasMany ProductsItems アソシエーション
    $this->Products->ProductsItems->virtualFields['Total'] = 'count(ProductsItems.products_id)';

    // ORM の条件
    $where = array(
        'fields' => array(
            'Products.*',
            'count(ProductsItems.products_id) AS ProductsItems__Total',
        ),
        'joins' => array(
            array(
                'table' => 'products_items',
                'alias' => 'ProductsItems',
                'type' => 'LEFT',
                'conditions' => array(
                    'ProductsItems.products_id = Products.id',
                )
            )
        ),
        'group' => 'ProductsItems.products_id'
    );

    // Paginator に条件を設定
    $this->paginate = $where;

    // データの取得
    $data = $this->Paginator->paginate();

次のようなものを返すでしょう。 ::

   Array
   (
       [0] => Array
           (
               [Products] => Array
                   (
                       [id] => 1234,
                       [description] => 'テキストなどなど...',
                   )
                [ProductsItems] => Array
                    (
                        [Total] => 25
                    )
           )
        [1] => Array
           (
               [Products] => Array
                   (
                       [id] => 4321,
                       [description] => 'テキスト 2 などなど...',
                   )
                [ProductsItems] => Array
                    (
                        [Total] => 50
                    )
           )
    )


SQL クエリ内でのバーチャルフィールドの利用
==========================================

SQL クエリ中で直接使用される関数は、返されるデータがモデルのデータと同じ配列に格納されるのを防ぎます。
例えば以下のようなとき::

    $this->Timelog->query(
        "SELECT
            project_id, SUM(id) as TotalHours
        FROM
            timelogs
        AS
            Timelog
        GROUP BY
            project_id;"
    );

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

もし TotalHours を Timelog 配列にグループ化したい場合、集計カラムのためのバーチャルフィールドを
指定する必要があります。
永続的にモデルに宣言しなくても、その場で新しいバーチャルフィールドを追加することができます。
別のクエリがバーチャルフィールドを使用しようとする場合、デフォルト値として ``0`` を与えます。
それが発生した場合、 ``0`` が TotalHours 列に入ります。 ::

    $this->Timelog->virtualFields['TotalHours'] = 0;

また、バーチャルフィールドを追加することに加えて、カラムを ``MyModel__MyField`` の形式で
別名にする必要があります。 ::

    $this->Timelog->query(
        "SELECT
            project_id, SUM(id) as Timelog__TotalHours
        FROM
            timelogs
        AS
            Timelog
        GROUP BY
            project_id;"
    );

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

バーチャルフィールドの制限
==========================

``virtualFields`` の実装はわずかな制限があります。まず、関連モデルの
「conditions」、「order」、「fields」に ``virtualFields`` を用いることが出来ません。
やってみると、ORM がフィールドを置き換えないため、まず SQL エラーが起きてしまいます。
これは関連モデルを見つけられるかもしれない深さを見積もるのが難しいということに起因します。

この実装の問題に対する一般的な回避策としては、利用する必要がある時に
``virtualFields`` をあるモデルから別のモデルにコピーすることです。 ::

    $this->virtualFields['name'] = $this->Author->virtualFields['name'];

もしくは以下のようにします。 ::

    $this->virtualFields += $this->Author->virtualFields;


.. meta::
    :title lang=ja: Virtual fields
    :keywords lang=ja: sql expressions,array name,model fields,sql errors,virtual field,concatenation,model name,first name last name
