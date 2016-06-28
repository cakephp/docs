データを取得する
################

まず説明を始める前に、モデルの役割についてですが、モデルの役割の一つはいろいろなタイプの
ストレージからデータを取得することです。CakePHP のモデルクラスは、データの検索、ソート、
ページング、フィルターなどの機能を提供しています。モデルで一番良く使われる関数は
:php:meth:`Model::find()` です。

.. _model-find:

find
====

``find(string $type = 'first', array $params = array())``

find はデータ取得のための、非常に多機能でとても良く働いてくれる関数です。
``$type`` は ``'all'``, ``'first'``, ``'count'``, ``'list'``, ``'neighbors'``,
``'threaded'``, または自分で定義したカスタム finder を指定できます。
``$type`` は大文字と小文字を区別しますので、注意してください。
大文字が含まれると (例えば ``All`` のように) 期待した結果になりません。

``$params`` はいろいろな種類の find へのパラメータを渡すために使われます。
デフォルトでは以下のキーのパラメータを渡すことができます。これらキーの指定は
任意です。 ::

    array(
        'conditions' => array('Model.field' => $thisValue), //検索条件の配列
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //フィールド名の配列
        'order' => array('Model.created', 'Model.field3 DESC'), //並び順を文字列または配列で指定
        'group' => array('Model.field'), //GROUP BYのフィールド
        'limit' => n, //int
        'page' => n, //int
        'offset' => n, //int
        'callbacks' => true //falseの他に'before'、'after'を指定できます
    )

これ以外のパラメータを追加したり使用することが可能です。いくつかの find() のタイプとビヘイビアは、
この機能を使用します。そして、あなた自身のモデルのメソッドでも可能です。

もし、find() 操作がレコードの照合に失敗した場合、空の配列を返します。

.. _model-find-first:

find('first')
=============

``find('first', $params)`` は結果を1行返します。1行だけ取得したい時に使います。
以下の例を見てください。 ::

    public function some_function() {
        // ...
        $semiRandomArticle = $this->Article->find('first');
        $lastCreated = $this->Article->find('first', array(
            'order' => array('Article.created' => 'desc')
        ));
        $specificallyThisOne = $this->Article->find('first', array(
            'conditions' => array('Article.id' => 1)
        ));
        // ...
    }

1行目のサンプルは、パラメータを渡していません。すなわち、検索条件の指定もソートの指定も
されないということです。 ``find('first')`` の戻り値はこのような形式になっています。 ::

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

.. _model-find-count:

find('count')
=============

``find('count', $params)`` は整数を返します。以下のサンプルを見てください。 ::

    public function some_function() {
        // ...
        $total = $this->Article->find('count');
        $pending = $this->Article->find('count', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $authors = $this->Article->User->find('count');
        $publishedAuthors = $this->Article->find('count', array(
           'fields' => 'DISTINCT Article.user_id',
           'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    ``find('count')`` には ``fields`` キーを配列で渡さないでください。
    DISTINCT count に渡されるフィールドだけを指定します。
    (それ以外は、conditions で指定された値を元に、常に同じ結果になります。)

.. _model-find-all:

find('all')
===========

``find('all', $params)`` は配列で結果を返します。 ``find('all')`` は、他のいろいろな
``find()`` や、 ``paginate`` でも使われています。以下のサンプルを見てください。 ::

    public function some_function() {
        // ...
        $allArticles = $this->Article->find('all');
        $pending = $this->Article->find('all', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('all');
        $allPublishedAuthors = $this->Article->User->find('all', array(
            'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    上記サンプルの ``$allAuthors`` は、users テーブルの全ユーザーデータを受け取ります。
    find に何もオプションパラメータを渡していないので、検索条件が適用されません。

``find('all')`` を呼び出すと、その戻り値は以下のような形式となります。 ::

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

.. _model-find-list:

find('list')
============

``find('list', $params)`` はインデックス付きの配列を返します。よくあるフォームの
セレクトボックスを作るために、リストが欲しい場合などに使うと便利です。
以下のサンプルを見てください。 ::

    public function some_function() {
        // ...
        $allArticles = $this->Article->find('list');
        $pending = $this->Article->find('list', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('list');
        $allPublishedAuthors = $this->Article->find('list', array(
            'fields' => array('User.id', 'User.name'),
            'conditions' => array('Article.status !=' => 'pending'),
            'recursive' => 0
        ));
        // ...
    }

.. note::

    上記サンプルの ``$allAuthors`` は、users テーブルの全ユーザーデータを受け取ります。
    find に何もオプションパラメータを渡していないので、検索条件が適用されません。

``find('list')`` を呼び出すと、その戻り値は以下のような形式となります。 ::

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

``fields`` キーを渡して ``find('list')`` 呼び出せば、どのフィールドを検索結果の
配列の添字として使うのかを指定でき、必要に応じて結果をグループ化してくれます。
デフォルトではモデルのプライマリーキーが検索結果の配列の添字として使われます。
また、添字に対する値は value が使われます。(値については、モデルの属性
:ref:`model-displayField` で設定できます) 以下に例を示します。 ::

    public function some_function() {
        // ...
        $justusernames = $this->Article->User->find('list', array(
            'fields' => array('User.username')
        ));
        $usernameMap = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name')
        ));
        $usernameGroups = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name', 'User.group')
        ));
        // ...
    }

上記サンプルを実行した結果、それぞれの変数の中身は次のようになっています。 ::


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
        ['User'] => Array
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

.. _model-find-threaded:

find('threaded')
================

``find('threaded', $params)`` は入れ子になった配列を返します。入れ子の構造を表現するために、
``parent_id`` フィールドがある場合に使います。以下のサンプルを見てください。 ::

    public function some_function() {
        // ...
        $allCategories = $this->Category->find('threaded');
        $someCategories = $this->Comment->find('threaded', array(
            'conditions' => array('article_id' => 50)
        ));
        // ...
    }

.. tip::

    入れ子のデータを扱うための、もっと良い方法として :doc:`/core-libraries/behaviors/tree`
    ビヘイビアがあります。

上記サンプルでは、 ``$allCategories`` は全体のカテゴリ構造を表す、入れ子になった配列が
格納されています。 ``find('threaded')`` を呼び出すと、戻り値は次のような形式となります。 ::

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

結果の表示順は、並べ替えることができます。
たとえば、 ``'order' => 'name ASC'`` が ``find('threaded')`` に渡された場合、
結果は名前順になります。他のフィールドを指定しても同様です。

.. warning::

    ``fields`` を指定する場合、必ず id と parent_id (もしくは、そのエイリアス) が
    含まれる必要があります::

        public function some_function() {
            $categories = $this->Category->find('threaded', array(
                'fields' => array('id', 'name', 'parent_id')
            ));
        }

    そうしなければ、配列の戻り値は期待通りの入れ子構造にはなりません。

.. _model-find-neighbors:

find('neighbors')
=================

``find('neighbors', $params)`` は find の 'first' と似たような動きをします。
ただ、それに加えて指定した条件の前後の行も一緒に取得してきます。以下の例を見てください。

::


    public function some_function() {
        $neighbors = $this->Article->find(
            'neighbors',
            array('field' => 'id', 'value' => 3)
        );
    }

このサンプルでは、 ``$params`` 配列に field と value の2つの要素を指定しているのがわかります。
その他のキーについても、今まで見てきた他のfindと同じように指定できます。 (たとえばモデルが
Containable ビヘイビアを利用していれば、 ``$params`` に 'contain' を指定できます。)
``find('neighbors')`` を呼び出すと、戻り値は以下の様な形式となります。

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

.. note::

    結果には、常に2つのルート要素 (prev と next) が含まれることになります。
    この関数はモデルのデフォルトの recursive 値を無視します。
    recursive を指定するには関数の各呼び出しにパラメータとして渡さなければなりません。

.. _model-custom-find:

カスタム find を定義する
========================

``find`` メソッドはカスタム finder を定義することができます。
モデルの変数に find 種別を宣言して、モデルのクラスとしてその関数を実装することで実現されます。

モデルの find 種別は、find 操作へのショートカットとなります。例えば、以下の2つのコードは同じ意味です。

::

    $this->User->find('first');
    $this->User->find('all', array('limit' => 1));

コアに含まれる find 種別は以下のものがあります。

* ``first``
* ``all``
* ``count``
* ``list``
* ``threaded``
* ``neighbors``

では、その他の種別はどうでしょうか？データベースの中にある、公開された記事を全て取得する find を
作ってみましょう。まず最初にやることは、モデルの :php:attr:`Model::$findMethods` 変数に find 種別を
追加することです。

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);
    }

これは、 ``find`` 関数の最初の引数として ``available`` を渡せるように CakePHP に教えています。
次に ``_findAvailable`` 関数を実装します。規約に従って、 ``myFancySearch`` という
finder を実装したければ、その関数の名前は ``_findMyFancySearch`` となります。

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);

        protected function _findAvailable($state, $query, $results = array()) {
            if ($state == 'before') {
                $query['conditions']['Article.published'] = true;
                return $query;
            }
            return $results;
        }
    }

次のようにして使えます。

::

    class ArticlesController extends AppController {

        // 公開されているすべての記事を検索して、createdカラムの順番に並び替える
        public function index() {
            $articles = $this->Article->find('available', array(
                'order' => array('created' => 'desc')
            ));
        }

    }

``_find[Type]`` メソッドは上記の例で示したように3つの引数を受け取ります。
1つめはクエリの実行状態を表します。 ``before`` または ``after`` となります。
このメソッドは、クエリが実行される前にそのクエリを修正する、または結果を取得した後に
その結果を修正する、といったコールバック関数の一種です。

カスタム find メソッドでまずはじめにチェックすることは、クエリの状態です。
``before`` はクエリを修正、新しいアソシエーションの追加、振る舞いの追加、または
``find`` の2つめの引数に渡されるキーの追加、などを行うための状態です。
この ``before`` の状態の時、関数は $query を返す必要があります
(クエリを修正していても、していなくても)。

``after`` はクエリの結果を調べるために良く使われます。たとえば結果に対して新しい行を挿入したり、
他のフォーマットに整形して返すための処理をしたり、他にも、取得したデータに対してどんな処理でも
することができます。この ``after`` の状態の時、関数は $results 配列を返す必要があります
(結果を修正していても、していなくても)。

自分が好きなようにカスタム finder をいくつも作ることができますし、これはアプリケーションのモデル全体で
再利用可能なコードとなるので、とても良いことです。

以下のようにして、カスタム find でページネーションをすることも出来ます。

::


    class ArticlesController extends AppController {

        // Will paginate all published articles
        public function index() {
            $this->paginate = array('findType' => 'available');
            $articles = $this->paginate();
            $this->set(compact('articles'));
        }

    }

上記のように ``$this->paginate`` 変数にカスタム find をセットすることで、
その結果が ``available`` の find 結果になります。

ページネーションのページ数がおかしい時は、次のようなコードを ``AppModel`` に追加すると
正しいページ数が取得できるでしょう。

::

    class AppModel extends Model {

    /**
     * Removes 'fields' key from count query on custom finds when it is an array,
     * as it will completely break the Model::_findCount() call
     *
     * @param string $state Either "before" or "after"
     * @param array $query
     * @param array $results
     * @return int The number of records found, or false
     * @access protected
     * @see Model::find()
     */
        protected function _findCount($state, $query, $results = array()) {
            if ($state === 'before') {
                if (isset($query['type']) &&
                    isset($this->findMethods[$query['type']])) {
                    $query = $this->{
                        '_find' . ucfirst($query['type'])
                    }('before', $query);
                    if (!empty($query['fields']) && is_array($query['fields'])) {
                        if (!preg_match('/^count/i', current($query['fields']))) {
                            unset($query['fields']);
                        }
                    }
                }
            }
            return parent::_findCount($state, $query, $results);
        }

    }
    ?>


.. versionchanged:: 2.2

クエリのカウント数を正しく取得するために、_findCount のオーバーライドはしなくてよくなりました。
カスタム finder の ``'before'`` では、$query['operation'] = 'count'という値がセットされて
もう一度関数が呼び出され、関数から返された $query は ``_findCount()`` で使われます。
必要であれば ``'operation'`` キーをチェックして、 関数から返された ``$query`` が違うかどうかを
区別できます。 ::

    protected function _findAvailable($state, $query, $results = array()) {
        if ($state == 'before') {
            $query['conditions']['Article.published'] = true;
            if (!empty($query['operation']) && $query['operation'] == 'count') {
                return $query;
            }
            $query['joins'] = array(
                //array of required joins
            );
            return $query;
        }
        return $results;
    }

マジックメソッド
================

マジックメソッドはテーブルの特定のフィールドを検索するための
ショートカットとして使われます。これから紹介するマジックメソッドの最後に
フィールド名をキャメルケースにしたものをくっつけて、最初の引数に
そのフィールドの基準となる値を指定して使います。

findAllBy() の戻り値の形式は ``find('all')`` と似ていますし、
findBy() の戻り値の形式は ``find('first')`` と同じです。

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| findAllBy<x> サンプル                                                                    | 対応するSQL                                                |
+==========================================================================================+============================================================+
| ``$this->Product->findAllByOrderStatus('3');``                                           | ``Product.order_status = 3``                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Recipe->findAllByType('Cookie');``                                              | ``Recipe.type = 'Cookie'``                                 |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('Anderson');``                                          | ``User.last_name = 'Anderson'``                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Cake->findAllById(7);``                                                         | ``Cake.id = 7``                                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByEmailOrUsername('jhon');``                                       | ``User.email = 'jhon' OR User.username = 'jhon';``         |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByUsernameAndPassword('jhon', '123');``                            | ``User.username = 'jhon' AND User.password = '123';``      |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('psychic', array(), array('User.user_name => 'asc'));`` | ``User.last_name = 'psychic' ORDER BY User.user_name ASC`` |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

この関数の戻り値は ``find('all')`` の戻り値と同じ形式です。

..
 Custom Magic Finders

カスタムマジック Finder
-----------------------

2.8 では、マジックメソッドインターフェースで任意のカスタム finder メソッドを使用できます。
例えば、モデルに ``published`` finder を実装した場合、これらの finder はマジック
``findBy`` メソッドと共に利用できます。 ::

    $results = $this->Article->findPublishedByAuthorId(5);

    // 以下と同等です
    $this->Article->find('published', array(
        'conditions' => array('Article.author_id' => 5)
    ));

.. versionadded:: 2.8.0
    カスタムマジック finder は 2.8.0 に追加されました。

findBy
------

``findBy<fieldName>(string $value);``

findBy マジックメソッドも同じようにいくつかオプションのパラメータを受け取ります。

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``


+------------------------------------------------------------+-------------------------------------------------------+
| findBy<x> サンプル                                         | 対応するSQL                                           |
+============================================================+=======================================================+
| ``$this->Product->findByOrderStatus('3');``                | ``Product.order_status = 3``                          |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Recipe->findByType('Cookie');``                   | ``Recipe.type = 'Cookie'``                            |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByLastName('Anderson');``               | ``User.last_name = 'Anderson';``                      |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByEmailOrUsername('jhon');``            | ``User.email = 'jhon' OR User.username = 'jhon';``    |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByUsernameAndPassword('jhon', '123');`` | ``User.username = 'jhon' AND User.password = '123';`` |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Cake->findById(7);``                              | ``Cake.id = 7``                                       |
+------------------------------------------------------------+-------------------------------------------------------+

findBy() の戻り値は ``find('first')`` と同じです。

.. _model-query:

:php:meth:`Model::query()`
==========================

``query(string $query)``

モデルのメソッドを使っては実行できない SQL (こういった SQL は稀ですが) などは、
モデルの ``query()`` メソッドを使うことができます。

このメソッドを使う場合は、 :doc:`/core-utility-libraries/sanitize` を確認してください。
ユーザーからの入力に対して、XSS や SQL インジェクションの対策が書かれています。

.. note::

    ``query()`` は本質的に分離された機能のため、$Model->cacheQueries は無視されます。
    クエリ実行のキャッシュしないようにするには、2つ目の引数に false を指定してください。
    ``query($query, $cachequeries = false)``

``query()`` はクエリ中のテーブル名を戻り値の配列のキーとして使います。 ::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

これは、以下の様な配列を返します。 ::

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

find メソッドと同じように、戻り値の配列のキーにモデル名を使うためには、
次のようにクエリを書き換えます。 ::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

すると以下の様な配列となります。 ::

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

.. note::

    この SQL 構文とそれに対応する配列の構造は、MySQL のみで有効です。
    CakePHP は手動でクエリを実行した時のデータ抽象化の機能を提供していません。
    そのため、正確な結果はデータベース毎に違います。

:php:meth:`Model::field()`
==========================

``field(string $name, array $conditions = null, string $order = null)``

``$conditions`` で指定された条件で検索して、 ``$order`` で並び替えられた
結果の一番最初の行について、 ``$name`` で指定したフィールドの値を返します。
検索条件を渡さずにモデルに ID がセットされていれば、その ID の結果に対する
フィールドの値を返します。マッチする行がなければ false を返します。

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // ID が 22 の行の name フィールドを表示します

    // 最新日付のデータの name フィールドを表示します
    echo $this->Post->field(
        'name',
        array('created <' => date('Y-m-d H:i:s')),
        'created DESC'
    );

:php:meth:`Model::read()`
=========================

``read($fields, $id)``

``read()`` はモデルにデータをセットするのに使われますが、
場合によっては、データベースから単一データを取得するのにも使われます。

``$fields`` は取得する対象のフィールドを文字列で1つ渡すか、もしくは配列で複数渡します。
特に指定しなければ、全てのフィールドが取得されます。

``$id`` は取得するデータのIDを指定します。デフォルトでは ``Model::$id`` に
指定される値が使われます。 ``$id`` に別の値を渡すと、そのレコードが取得されることになります。

``read()`` は、たとえ単一のフィールドを取得する場合でも、常に配列を返します。
単一の値を取得するには ``field`` を使ってください。

.. warning::

    ``read`` はモデルに保持されている ``data`` と ``id`` の値を上書きするので、
    このメソッドを使う時は気をつけてください。特に ``beforeValidate`` や ``beforeSave`` などの
    モデルのコールバック関数で使う場合などは注意が必要です。
    一般的に ``find`` の方が ``read`` よりも簡単でより安全にデータを取得することができます。

複雑な検索条件
==============

ほとんどのモデルの find の呼び出しは、検索条件をセットして呼び出されることでしょう。
一般的に CakePHP は、SQL の WHERE 句にセットされる検索条件を配列で表現するようになっています。

配列を使うことで可読性があがり、綺麗なコードになります。
また、クエリの組み立ても簡単になります。
配列を使うことで、クエリの要素 (フィールドや値、演算子) などをクエリ中から取り出すことが
できますので、CakePHP は可能な限り効率的で、適切な構文でクエリを生成することができ、
変数のエスケープもしてくれて、SQL インジェクションなどの対策にもなります。

.. warning::

    CakePHP は、配列の値部分のみエスケープします。**決して** キーにユーザーデータをセット
    しないでください。SQL インジェクションの脆弱性になります。

最も良く使われるのは、次のような配列ベースのクエリです。 ::

    $conditions = array("Post.title" => "This is a post", "Post.author_id" => 1);
    // モデルの使い方のサンプル
    $this->Post->find('first', array('conditions' => $conditions));

この書き方は非常にわかりやすいと思います。
これは、タイトルが "This is a post" という投稿を取得します。
フィールド名については単に "title" とすることもできますが、
モデル名も指定するように習慣付けましょう。
そうすることで、コードが明確になり、将来もしスキーマの変更があったとしても
他テーブルとのフィールド名の衝突を避けられます。

否定や比較などはどうするのでしょうか？とてもシンプルです。
"This is a post" 以外の投稿データを取得したい場合は以下のようにします。 ::

    array("Post.title !=" => "This is a post")

フィールド名の前に '!=' があるのがわかると思います。
演算子とフィールド名の間にスペース名をいれていれば、 ``LIKE`` や ``BETWEEN`` 、``REGEX`` 、
それに他の有効な SQL の比較演算子を CakePHP が解析してくれます。
ただ、例外として ``IN`` (...) の場合は違います。
IN を使って、リストから投稿タイトルを検索したい場合は以下のようにします。 ::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

NOT IN (...) でリストに含まれない投稿タイトルを検索した場合は以下のようにします。 ::

    array(
        "NOT" => array(
            "Post.title" => array("First post", "Second post", "Third post")
        )
    )

検索条件に新しい条件を追加したければ、キーと値のペアを配列に追加するだけです。 ::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

データベースの2つのフィールドを比較する条件を指定することもできます。 ::

    array("Post.created = Post.modified")

上記サンプルは、作成日と変更日が同じ投稿データ
(つまりまだ編集されていない投稿)を返します。

この方法で ``WHERE`` 句に指定できないようなものは、文字列で以下のようにして
指定できます。 ::

    array(
        'Model.field & 8 = 1',
        // キーと値のペアでは指定できないような条件
    )

デフォルトでは、CakePHP は ``AND`` で複数の条件をつなげます。
つまりこれは、3つ上のサンプルコードでは、過去2週間の内に作られた投稿で、かつ
指定されたリストに含まれるタイトルの投稿だけが取得されます。
ただ、どちらかの条件にマッチする投稿を取得したいこともあるでしょう。 ::

    array("OR" => array(
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    ))

CakePHP は ``AND`` 、 ``OR`` 、 ``NOT`` 、 ``XOR`` (大文字、小文字は区別しません)などの、
有効な SQL の論理演算子は全て受け取れます。
これらの条件は際限なく入れ子にできます。
さて、今ここで Posts と Authors で belongsTo アソシエーションを定義しているとしましょう。
この時、特定のキーワード "magic" を含むか、もしくは過去2週間の間に投稿されて、かつ
Bob が書いた投稿、に制限して取得したい場合、次のようにします。 ::

    array(
        "Author.name" => "Bob",
        "OR" => array(
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

同じフィールドに対して複数の ``LIKE`` 条件を指定したい場合は、
同じように以下のように条件を指定します。 ::

    array('OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
    ))

ワイルドカード演算子 ``ILIKE`` と ``RLIKE`` (RLIKE は 2.6 以降) も利用可能です。

CakePHP は null も受け入れることができます。次のクエリは、
投稿のタイトルが NOT NULL である投稿を返します。 ::

    array("NOT" => array(
            "Post.title" => null
        )
    )

``BETWEEN`` は、以下のように出来ます。 ::

    array('Post.read_count BETWEEN ? AND ?' => array(1,10))

.. note::

    CakePHP はデータベースのフィールドの型によって、数値でもクォートで囲みます。

GROUP BY は？ ::

    array(
        'fields' => array(
            'Product.type',
            'MIN(Product.price) as price'
        ),
        'group' => 'Product.type'
    )

この時の戻り値の配列は、次のような形式です。 ::

    Array
    (
        [0] => Array
        (
            [Product] => Array
            (
                [type] => Clothing
            )
            [0] => Array
            (
                [price] => 32
            )
        )
        [1] => Array
        ...

以下は ``DISTINCT`` のサンプルです。他にも ``MIN()`` や ``MAX()`` なども同じように使えます。 ::

    array(
        'fields' => array('DISTINCT (User.name) AS my_column_name'),
        'order' = >array('User.id DESC')
    )

とても複雑な検索条件も、複数の配列をネストすることで実現可能です。 ::

    array(
        'OR' => array(
            array('Company.name' => 'Future Holdings'),
            array('Company.city' => 'CA')
        ),
        'AND' => array(
            array(
                'OR' => array(
                    array('Company.status' => 'active'),
                    'NOT' => array(
                        array('Company.status' => array('inactive', 'suspended'))
                    )
                )
            )
        )
    )

上記サンプルは次のようなSQLを生成します。 ::

    SELECT `Company`.`id`, `Company`.`name`,
    `Company`.`description`, `Company`.`location`,
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`city` = 'CA'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

サブクエリ
----------

"id"、"name"、"status"というフィールドを持つ "users" テーブルがあって、
"status" は "A"、"B"、"C" のいずれかの値を取るものとします。
ここで、サブクエリを使って、status が "B" 以外のユーザーを取得してみます。

そのためにはまず、モデルのデータソースを取得して、クエリを組み立てます。
find メソッドを呼ぶような感じですが、これは SQL 文字列を返します。
その後、expression を呼び出し、その戻り値を conditions 配列に追加します。 ::

    $conditionsSubQuery['"User2"."status"'] = 'B';

    $db = $this->User->getDataSource();
    $subQuery = $db->buildStatement(
        array(
            'fields'     => array('"User2"."id"'),
            'table'      => $db->fullTableName($this->User),
            'alias'      => 'User2',
            'limit'      => null,
            'offset'     => null,
            'joins'      => array(),
            'conditions' => $conditionsSubQuery,
            'order'      => null,
            'group'      => null
        ),
        $this->User
    );
    $subQuery = ' "User"."id" NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $db->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->User->find('all', compact('conditions'));

このサンプルは以下のようなSQLを生成します。 ::

    SELECT
        "User"."id" AS "User__id",
        "User"."name" AS "User__name",
        "User"."status" AS "User__status"
    FROM
        "users" AS "User"
    WHERE
        "User"."id" NOT IN (
            SELECT
                "User2"."id"
            FROM
                "users" AS "User2"
            WHERE
                "User2"."status" = 'B'
        )

また、クエリの一部 (実際の生の SQL) で渡す必要がある場合も、
データソースの **expressions** を使えば、他のfindクエリでも
同じようにできます。

.. _prepared-statements:

準備済みステートメント
----------------------

よりクエリをコントロールするために、準備済みステートメントを使うことができます。
これでデータベースドライバと直接やり取りができ、好きなようにクエリを送信することができます。 ::

    $db = $this->getDataSource();
    $db->fetchAll(
        'SELECT * from users where username = ? AND password = ?',
        array('jhon', '12345')
    );
    $db->fetchAll(
        'SELECT * from users where username = :username AND password = :password',
        array('username' => 'jhon','password' => '12345')
    );


.. meta::
    :title lang=ja: Retrieving Your Data
    :keywords lang=ja: upper case character,array model,order array,controller code,retrieval functions,model layer,model methods,model class,model data,data retrieval,field names,workhorse,desc,neighbors,parameters,storage,models
