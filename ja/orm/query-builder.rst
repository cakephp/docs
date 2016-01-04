クエリビルダ
#################

..
    Query Builder

.. php:namespace:: Cake\ORM

.. php:class:: Query

..
    The ORM's query builder provides a simple to use fluent interface for creating
    and running queries. By composing queries together, you can create advanced
    queries using unions and subqueries with ease.

ORM のクエリビルダにより簡単に流れるようなインターフェイスを使ってクエリを作り、走らせることができます。
クエリを組み立てることで、 union やサブクエリを使った高度なクエリも簡単に作成することができます。

..
    Underneath the covers, the query builder uses PDO prepared statements which
    protect against SQL injection attacks.

クエリビルダは裏側で PDO プリペアド ステートメント（prepared statement）を使うことで、SQL インジェクション攻撃から守っています。

クエリオブジェクト
=====================

..
    The Query Object

..
    The easiest way to create a ``Query`` object is to use ``find()`` from a
    ``Table`` object. This method will return an incomplete query ready to be
    modified. You can also use a table's connection object to access the lower level
    Query builder that does not include ORM features, if necessary. See the
    :ref:`database-queries` section for more information::

``Query`` オブジェクトを作成するもっとも簡単な方法は ``Table`` オブジェクトから ``find()`` を使うことです。
このメソッドは完結していない状態のクエリを返し、このクエリは変更可能です。
必要なら、テーブルのコネクションオブジェクトも使うことで、ORM 機能を含まない、より低い層のクエリビルダにアクセスすることもできます。
この詳細は :ref:`database-queries` の章を参照してください::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');

    // 新しいクエリを始めます。
    $query = $articles->find();

..
    When inside a controller, you can use the automatic table variable that is
    created using the conventions system::

コントローラの中では自動的に慣習的な機能を使って作成されるテーブル変数を使うことができます::

    // ArticlesController.php の中で

    $query = $this->Articles->find();

テーブルから行を取得する
--------------------------------

..
    Selecting Rows From A Table

::

    use Cake\ORM\TableRegistry;

    $query = TableRegistry::get('Articles')->find();

    foreach ($query as $article) {
        debug($article->title);
    }

..
    For the remaining examples, assume that ``$articles`` is a
    :php:class:`~Cake\\ORM\\Table`. When inside controllers, you can use
    ``$this->Articles`` instead of ``$articles``.

以降の例では ``$articles`` は :php:class:`~Cake\\ORM\\Table` であると想定します。
なお、コントローラの中では ``$articles`` の代わりに ``$this->Articles`` を使うことができます。

..
    Almost every method in a ``Query`` object will return the same query, this means
    that ``Query`` objects are lazy, and will not be executed unless you tell them
    to::

``Query`` オブジェクトのほとんどのメソッドが自分自身のクエリオブジェクトを返します。
これは ``Query`` が遅延評価される(lazy)ことを意味し、必要になるまで実行されないことを意味します::

    $query->where(['id' => 1]); // 自分自身のクエリオブジェクトを返します
    $query->order(['title' => 'DESC']); // 自分自身を返し、SQL はまだ実行されません。

..
    You can of course chain the methods you call on Query objects::

もちろん Query オブジェクトの呼び出しではメソッドをチェーンすることもできます::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

    foreach ($query as $article) {
        debug($article->created);
    }

..
    If you try to call ``debug()`` on a Query object, you will see its internal
    state and the SQL that will be executed in the database::

Query オブジェクトを ``debug()`` で使うと、内部の状態と DB で実行されることになる SQL が出力されます::

    debug($articles->find()->where(['id' => 1]));

    // 出力
    // ...
    // 'sql' => 'SELECT * FROM articles where id = ?'
    // ...

..
    You can execute a query directly without having to use ``foreach`` on it.
    The easiest way is to either call the ``all()`` or ``toArray()`` methods::

``foreach`` を使わずに、クエリを直接実行することができます。
もっとも簡単なのは ``all()`` メソッドか ``toArray()`` メソッドのどちらかを呼ぶ方法です::

    $resultsIteratorObject = $articles
        ->find()
        ->where(['id >' => 1])
        ->all();

    foreach ($resultsIteratorObject as $article) {
        debug($article->id);
    }

    $resultsArray = $articles
        ->find()
        ->where(['id >' => 1])
        ->toArray();

    foreach ($resultsArray as $article) {
        debug($article->id);
    }

    debug($resultsArray[0]->title);

..
    In the above example, ``$resultsIteratorObject`` will be an instance of
    ``Cake\ORM\ResultSet``, an object you can iterate and apply several extracting
    and traversing methods on.

上記の例では、 ``$resultsIteratorObject`` は ``Cake\ORM\ResultSet`` のインスタンスです。
このインスタンスはイテレートすることができ、それが持つメソッドで部分取り出しなどができます。

..
    Often, there is no need to call ``all()``, you can simply iterate the
    Query object to get its results. Query objects can also be used directly as the
    result object; trying to iterate the query, calling ``toArray()`` or some of the
    methods inherited from :doc:`Collection </core-libraries/collections>`, will
    result in the query being executed and results returned to you.

多くの場合、 ``all()`` を呼ぶ必要はなく、単に Query オブジェクトをイテレートすることで、結果を得ることができます。
Query オブジェクトはまた、結果オブジェクトとして直接使うこともできます。
クエリをイテレートしたり、 ``toArray()`` を呼んだり、
:doc:`Collection </core-libraries/collections>` から継承したメソッドを呼んだりすると、
クエリは実行され、結果が返ります。

テーブルから単一行を取得する
-----------------------------------

..
    Selecting A Single Row From A Table

..
    You can use the ``first()`` method to get the first result in the query::

``first()`` メソッドを使うことでクエリの最初の結果を取得することができます::

    $article = $articles
        ->find()
        ->where(['id' => 1])
        ->first();

    debug($article->title);

列から値リストを取得する
--------------------------------------

..
    Getting A List Of Values From A Column

::

    // Collection ライブラリの extract() メソッドを使います
    // これもクエリを実行します
    $allTitles = $articles->find()->extract('title');

    foreach ($allTitles as $title) {
        echo $title;
    }

..
    You can also get a key-value list out of a query result::

クエリの結果から key-value リストを得ることもできます::

    $list = $articles->find('list')->select(['id', 'title']);

    foreach ($list as $id => $title) {
        echo "$id : $title"
    }

クエリは Collection オブジェクトである
-------------------------------------------

..
    Queries Are Collection Objects

..
    Once you get familiar with the Query object methods, it is strongly encouraged
    that you visit the :doc:`Collection </core-libraries/collections>` section to
    improve your skills in efficiently traversing the data. In short, it is
    important to remember that anything you can call on a Collection object, you
    can also do in a Query object::

Query オブジェクトのメソッドに慣れたら、
:doc:`Collection </core-libraries/collections>` を見て、
効果的にデータを横断するスキルを磨くことを強くお勧めします。
つまり、 Collection オブジェクトで呼ぶことができるものは、 Query オブジェクトでも呼ぶことができることを、
知っておくことは重要です::

    // Collection ライブラリの combine() メソッドを使います
    // これは find('list') と等価です
    $keyValueList = $articles->find()->combine('id', 'title');

    // 上級な例
    $results = $articles->find()
        ->where(['id >' => 1])
        ->order(['title' => 'DESC'])
        ->map(function ($row) { // map() は Collection のメソッドで、クエリを実行します
            $row->trimmedTitle = trim($row->title);
            return $row;
        })
        ->combine('id', 'trimmedTitle') // combine() も Collection のメソッドです
        ->toArray(); // これも Collection のメソッドです

    foreach ($results as $id => $trimmedTitle) {
        echo "$id : $trimmedTitle";
    }

クエリが遅延評価される仕組み
-----------------------------------

..
    How Are Queries Lazily Evaluated

..
    Query objects are lazily evaluated. This means a query is not executed until one
    of the following things occur:

Query オブジェクトは遅延評価されます。
これはクエリが次のいずれかが起こるまで実行されないということを意味します。

..
    - The query is iterated with ``foreach()``.
    - The query's ``execute()`` method is called. This will return the underlying
      statement object, and is to be used with insert/update/delete queries.
    - The query's ``first()`` method is called. This will return the first result in the set
      built by ``SELECT`` (it adds ``LIMIT 1`` to the query).
    - The query's ``all()`` method is called. This will return the result set and
      can only be used with ``SELECT`` statements.
    - The query's ``toArray()`` method is called.

- クエリが ``foreach()`` でイテレートされる。
- クエリの ``execute()`` メソッドが呼ばれる。これは下層の statement オブジェクトを返し、
  insert/update/delete クエリで使うことができます。
- クエリの ``first()`` メソッドが呼ばれる。``SELECT`` (それがクエリに ``LIMIT 1`` を加えます) で構築された結果セットの
  最初の結果が返ります。
- クエリの ``all()`` メソッドが呼ばれる。結果セットが返り、``SELECT`` ステートメントでのみ使うことができます。
- クエリの ``toArray()`` メソッドが呼ばれる。

..
    Until one of these conditions are met, the query can be modified without additional
    SQL being sent to the database. It also means that if a Query hasn't been
    evaluated, no SQL is ever sent to the database. Once executed, modifying and
    re-evaluating a query will result in additional SQL being run.

このような条件が合致するまでは、 SQL を DB へ送らずに、クエリを変更することができます。
つまり、 Query が評価サれないかぎり、SQL は DB へ送信されないのです。
クエリが実行された後に、クエリを変更・再評価したら、追加で SQL が走ることになります。

..
    If you want to take a look at what SQL CakePHP is generating, you can turn
    database :ref:`query logging <database-query-logging>` on.

CakePHP が生成している SQL がどんなものか見たいなら、
:ref:`query logging <database-query-logging>` を on にしてください。

..
    The following sections will show you everything there is to know about using and
    combining the Query object methods to construct SQL statements and extract data.

次の章では SQL 文を構築し、データを取り出すための Query オブジェクトのメソッドを使ったり、
組み合わせたりする方法について見ていきましょう。

データを select する
===========================

..
    Selecting Data

..
    Most web applications make heavy use of ``SELECT`` queries. CakePHP makes
    building them a snap. To limit the fields fetched, you can use the ``select()``
    method::

多くの WEB アプリケーションは ``SELECT`` クエリを多用します。
CakePHP ではこれらを簡単につくれます。フェッチする列を制限するのには、
``select()`` メソッドを使います::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query as $row) {
        debug($row->title);
    }

..
    You can set aliases for fields by providing fields as an associative array::

連想配列で列を渡すことで列のエイリアス(別名)をセットすることができます::

    // SELECT id AS pk, title AS aliased_title, body ... になる
    $query = $articles->find();
    $query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);

..
    To select distinct fields, you can use the ``distinct()`` method::

列を select distinct するために、 ``distinct()`` メソッドを使うことができます::

    // SELECT DISTINCT country FROM ... になる
    $query = $articles->find();
    $query->select(['country'])
        ->distinct(['country']);

..
    To set some basic conditions you can use the ``where()`` method::

基本の条件をセットするには、``where()`` メソッドを使うことができます::

    // 条件は AND で連結されます
    $query = $articles->find();
    $query->where(['title' => 'First Post', 'published' => true]);

    // where() を複数回呼んでもかまいません
    $query = $articles->find();
    $query->where(['title' => 'First Post'])
        ->where(['published' => true]);

..
    See the :ref:`advanced-query-conditions` section to find out how to construct
    more complex ``WHERE`` conditions. To apply ordering, you can use the ``order``
    method::

さらに複雑な ``WHERE`` 条件の作り方を知りたい場合は :ref:`advanced-query-conditions` の章を参照してください::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

..
    In addition to ``order``, the ``orderAsc`` and ``orderDesc`` methods can be used
    when you need to sort on complex expressions::

複合的な式でソートする必要があるなら ``order`` に加えて、 ``orderAsc`` と ``orderDesc`` メソッドが使えます::

    // 3.0.12 以降は orderAsc と orderDesc が使えます。
    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'literal',
        'synopsis' => 'literal'
    ]);
    $query->orderAsc($concat);

..
    To limit the number of rows or set the row offset you can use the ``limit()``
    and ``page()`` methods::

行の数を制限したり、行のオフセットをセットするためには、 ``limit()`` と ``page()`` メソッドを使うことができます::

    // 50 から 100 行目をフェッチする
    $query = $articles->find()
        ->limit(50)
        ->page(2);

..
    As you can see from the examples above, all the methods that modify the query
    provide a fluent interface, allowing you to build a query through chained method
    calls.

上記の例にあるように、クエリを変更するすべてのメソッドは流暢(fluent)なインターフェイスを提供しますので、
クエリを構築する際にチェーンメソッドの形で呼び出すことができます。

テーブルからすべての列を select する
---------------------------------------

..
    Selecting All Fields From a Table

..
    By default a query will select all fields from a table, the exception is when you
    call the ``select()`` function yourself and pass certain fields::

クエリはデフォルトで table のすべての列を select します。
例外となるのは ``select()`` 関数をあえて呼び、特定の列を指定した場合だけです::

    // articles テーブルから id と title だけが select される
    $articles->find()->select(['id', 'title']);

..
    If you wish to still select all fields from a table after having called
    ``select($fields)``, you can pass the table instance to ``select()`` for this
    purpose::

``select($fields)`` を呼んで、なおもテーブルのすべての列を select したいなら、
次の方法でテーブルインスタンスを ``select()`` に渡すことができます::

    // 計算された slug 列を含めて、 articles テーブルのすべての列を取得
    $query = $articlesTable->find();
    $query
        ->select(['slug' => $query->func()->concat(['title', '-', 'id'])])
        ->select($articlesTable); // articles のすべての列を select する

.. versionadded:: 3.1
    テーブルオブジェクトを select() に渡すのは 3.1 で追加されました。

.. _using-sql-functions:

SQL 関数を使う
---------------------

..
    Using SQL Functions

..
    CakePHP's ORM offers abstraction for some commonly used SQL functions. Using the
    abstraction allows the ORM to select the platform specific implementation of the
    function you want. For example, ``concat`` is implemented differently in MySQL,
    PostgreSQL and SQL Server. Using the abstraction allows your code to be portable::

CakePHP の ORM では抽象化された馴染み深い SQL 関数をいくつか使えるようになっています。
抽象化により ORM は、プラットフォーム固有の実装を選んで関数を実行できるようになっています。
たとえば、 ``concat`` は MySQL、PostgreSQL、SQL Server で異なる実装がされています。
抽象化によりあなたのコードが移植しやすいものになります::

    // SELECT COUNT(*) count FROM ... になる
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

..
    A number of commonly used functions can be created with the ``func()`` method:

多くのおなじみの関数が ``func()`` メソッドとともに作成できます:

- ``sum()`` 合計を算出します。引数はリテラル値として扱われます。
- ``avg()`` 平均値を算出します。引数はリテラル値として扱われます。
- ``min()`` 列の最小値を算出します。引数はリテラル値として扱われます。
- ``max()`` 列の最大値を算出します。引数はリテラル値として扱われます。
- ``count()`` 件数を算出します。引数はリテラル値として扱われます。
- ``concat()`` ２つの値を結合します。引数はリテラルだとマークされない限り、バインドパラメータをして扱われます。
- ``coalesce()`` Coalesce を算出します。引数はリテラルだとマークされない限り、バインドパラメータをして扱われます。
- ``dateDiff()`` ２つの日にち/時間の差を取得します。引数はリテラルだとマークされない限り、バインドパラメータをして扱われます。
- ``now()`` 'time' もしくは 'date' を取得します。引数で現在の時刻もしくは日付のどちらを取得するのかを指定できます。
- ``extract()`` SQL 式から特定の日付部分(年など)を返します。
- ``dateAdd()`` 日付式に単位時間を追加します。
- ``dayOfWeek()`` SQL の WEEKDAY 関数を呼ぶ FunctionExpression を返します。

..
    - ``sum()`` Calculate a sum. The arguments will be treated as literal values.
    - ``avg()`` Calculate an average. The arguments will be treated as literal values.
    - ``min()`` Calculate the min of a column. The arguments will be treated as
      literal values.
    - ``max()`` Calculate the max of a column. The arguments will be treated as
      literal values.
    - ``count()`` Calculate the count. The arguments will be treated as literal
      values.
    - ``concat()`` Concatenate two values together. The arguments are treated as
      bound parameters unless marked as literal.
    - ``coalesce()`` Coalesce values. The arguments are treated as bound parameters
      unless marked as literal.
    - ``dateDiff()`` Get the difference between two dates/times. The arguments are
      treated as bound parameters unless marked as literal.
    - ``now()`` Take either 'time' or 'date' as an argument allowing you to get
      either the current time, or current date.
    - ``extract()`` Returns the specified date part from the SQL expression.
    - ``dateAdd()`` Add the time unit to the date expression.
    - ``dayOfWeek()`` Returns a FunctionExpression representing a call to SQL
      WEEKDAY function.

.. versionadded:: 3.1

    ``extract()``、 ``dateAdd()``、 ``dayOfWeek()`` メソッドが追加されました。

..
    When providing arguments for SQL functions, there are two kinds of parameters
    you can use, literal arguments and bound parameters. Literal parameters allow
    you to reference columns or other SQL literals. Bound parameters can be used to
    safely add user data to SQL functions. For example::

SQL 関数に渡す引数には、リテラルの引数と、バインドパラメータの２種類がありえます。
リテラルの引数により、列名や他の SQL リテラルを参照できます。
バインドパラメータにより、ユーザデータを SQL 関数へと安全に渡すことができます。
たとえば::

    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'literal',
        ' NEW'
    ]);
    $query->select(['title' => $concat]);

..
    By making arguments with a value of ``literal``, the ORM will know that
    the key should be treated as a literal SQL value. The above would generate the
    following SQL on MySQL::

``literal`` の値を伴う引数を作ることで、 ORM はそのキーをリテラルな SQL 値として扱うべきであると知ることになります。
上記では MySQL にて下記の SQL が生成されます::

    SELECT CONCAT(title, :c0) FROM articles;

..
    The ``:c0`` value will have the ``' NEW'`` text bound when the query is
    executed.

クエリが実行される際には、 ``:c0`` という値に ``' NEW'`` というテキストがバインドされることになります。

..
    In addition to the above functions, the ``func()`` method can be used to create
    any generic SQL function such as ``year``, ``date_format``, ``convert``, etc.
    For example::

上記の関数に加え、``func()`` メソッドは ``year``、 ``date_format``、 ``convert`` などといった、
一般的な SQL 関数を構築するのに使います。
たとえば::

    $query = $articles->find();
    $year = $query->func()->year([
        'created' => 'literal'
    ]);
    $time = $query->func()->date_format([
        'created' => 'literal',
        "'%H:%i'" => 'literal'
    ]);
    $query->select([
        'yearCreated' => $year,
        'timeCreated' => $time
    ]);

..
    Would result in::

このようになります::

    SELECT YEAR(created) as yearCreated, DATE_FORMAT(created, '%H:%i') as timeCreated FROM articles;

..
    You should remember to use the function builder whenever you need to put
    untrusted data into SQL functions or stored procedures::

安全ではないデータを、 SQL 関数やストアドプロシージャに渡す必要がある際には必ず、
関数ビルダを使うということを覚えておいてください::

    // ストアドプロシージャを使う
    $query = $articles->find();
    $lev = $query->func()->levenshtein([$search, 'LOWER(title)' => 'literal']);
    $query->where(function ($exp) use ($lev) {
        return $exp->between($lev, 0, $tolerance);
    });

    // 生成される SQL はこうなります
    WHERE levenshtein(:c0, lower(street)) BETWEEN :c1 AND :c2

集約 - Group と Having
-----------------------------

..
    Aggregates - Group and Having

..
    When using aggregate functions like ``count`` and ``sum`` you may want to use
    ``group by`` and ``having`` clauses::

``count`` や ``sum`` のような集約関数を使う際には、
``group by`` や ``having`` 句を使いたいことでしょう::

    $query = $articles->find();
    $query->select([
        'count' => $query->func()->count('view_count'),
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Case 文
---------------

..
    Case statements

..
    The ORM also offers the SQL ``case`` expression. The ``case`` expression allows
    for implementing ``if ... then ... else`` logic inside your SQL. This can be useful
    for reporting on data where you need to conditionally sum or count data, or where you
    need to specific data based on a condition.

ORM ではまた、 SQL の ``case`` 式も使えます。
``case`` 式により ``if ... then ... else`` のロジックを SQL の中に実装することができます。
これは条件付きで sum や count をしなければならない状況や、条件に基いてデータを特定しなければならない状況で、データを出力するのに便利です。

..
    If we wished to know how many published articles are in our database, we'd need to generate the following SQL::

公開済みの記事（published articles）が DB 内にいくつあるのか知りたい場合、次の SQL を生成する必要があります::

    SELECT SUM(CASE published = 'Y' THEN 1 ELSE 0) AS number_published, SUM(CASE published = 'N' THEN 1 ELSE 0) AS number_unpublished
    FROM articles GROUP BY published

..
    To do this with the query builder, we'd use the following code::

これはクエリビルダでは次のようなコードになります::

    $query = $articles->find();
    $publishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'Y']), 1, 'integer');
    $notPublishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'N']), 1, 'integer');

    $query->select([
        'number_published' => $query->func()->sum($publishedCase),
        'number_unpublished' => $query->func()->sum($unpublishedCase)
    ])
    ->group('published');

..
    The ``addCase`` function can also chain together multiple statements to create ``if .. then .. [elseif .. then .. ] [ .. else ]`` logic inside your SQL.

``addCase`` 関数は SQL 内で ``if .. then .. [elseif .. then .. ] [ .. else ]`` ロジックを構築するために
複数の文を一まとめに書くことができます。

..
    If we wanted to classify cities into SMALL, MEDIUM, or LARGE based on population size, we could do the following::

町(city) を人口(population size)に基いて SMALL、MEDIUM、LARGE に分類するなら、次のようになります::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->lt('population', 100000),
                    $q->newExpr()->between('population', 100000, 999000),
                    $q->newExpr()->gte('population', 999001),
                ],
                ['SMALL',  'MEDIUM', 'LARGE'], # 条件に合致したときの値
                ['string', 'string', 'string'] # それぞれの値の型
            );
        });
    # WHERE CASE
    #   WHEN population < 100000 THEN 'SMALL'
    #   WHEN population BETWEEN 100000 AND 999000 THEN 'MEDIUM'
    #   WHEN population >= 999001 THEN 'LARGE'
    #   END

..
    Any time there are fewer case conditions than values, ``addCase`` will
    automatically produce an ``if .. then .. else`` statement::

値リストよりも case 条件リストの方が少ない場合はいつでも、``addCase`` は自動的に ``if .. then .. else`` 文を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->eq('population', 0),
                ],
                ['DESERTED', 'INHABITED'], # 条件に合致したときの値
                ['string', 'string'] # それぞれの値の型
            );
        });
    # WHERE CASE
    #   WHEN population = 0 THEN 'DESERTED' ELSE 'INHABITED' END

エンティティ変換(Hydrate)を無効にする
------------------------------------------

..
    Disabling Hydration

..
    While ORMs and object result sets are powerful, hydrating entities is sometimes
    unnecessary. For example, when accessing aggregated data, building an Entity may
    not make sense. In these situations you may want to disable entity hydration::

ORM とオブジェクトの結果セットは強力である一方で、エンティティへの変換(hydrate)が不要なときもあります。
たとえば、集約されたデータにアクセスする場合、Entity を構築するのは無意味です。
こういった状況ではエンティティ変換を無効化したいでしょう::

    $query = $articles->find();
    $query->hydrate(false);

.. note::

    エンティティ変換(hydrate)を無効化すると基本となる配列が返ります。

..
    When hydration is disabled results will be returned as basic arrays.

.. _advanced-query-conditions:

高度な条件
===================

..
    Advanced Conditions

..
    The query builder makes it simple to build complex ``where`` clauses.
    Grouped conditions can be expressed by providing combining ``where()``,
    ``andWhere()`` and ``orWhere()``. The ``where()`` method works similar to the
    conditions arrays in previous versions of CakePHP::

クエリビルダは複雑な ``where`` 句の構築を簡単にします。
``where()`` や ``andWhere()``、 ``orWhere()`` を使うことで、
複数条件のグルーピングも表現できます::

    $query = $articles->find()
        ->where([
            'author_id' => 3,
            'OR' => [['view_count' => 2], ['view_count' => 3]],
        ]);

..
    The above would generate SQL like::

上記は次のような SQL を生成します::

    SELECT * FROM articles WHERE author_id = 3 AND (view_count = 2 OR view_count = 3)

..
    If you'd prefer to avoid deeply nested arrays, you can use the ``orWhere()`` and
    ``andWhere()`` methods to build your queries. Each method sets the combining
    operator used between the current and previous condition. For example::

深くネストした配列を使いたくないなら、クエリをビルドするのに ``orWhere()`` と ``andWhere()`` メソッドを使うことができます。
各メソッドは今の条件と前の条件をつなぐ演算子をセットします。たとえば::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3]);

..
    The above will output SQL similar to::

上記は次のような SQL を出力します::

    SELECT * FROM articles WHERE (author_id = 2 OR author_id = 3)

..
    By combining ``orWhere()`` and ``andWhere()``, you can express complex
    conditions that use a mixture of operators::

``orWhere()`` と ``andWhere()`` を組み合わせることで、演算子を組み合わせるような複雑な条件を表現できます::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3])
        ->andWhere([
            'published' => true,
            'view_count >' => 10
        ])
        ->orWhere(['promoted' => true]);

..
    The above generates SQL similar to::

上記は次のような SQL を出力します::

    SELECT *
    FROM articles
    WHERE (promoted = true
    OR (
      (published = true AND view_count > 10)
      AND (author_id = 2 OR author_id = 3)
    ))

..
    By using functions as the parameters to ``orWhere()`` and ``andWhere()``,
    you can compose conditions together with the expression objects::

関数を引数にして ``orWhere()`` と ``andWhere()`` を使うことで、
Expression オブジェクトを条件文に加えることができます::

    $query = $articles->find()
        ->where(['title LIKE' => '%First%'])
        ->andWhere(function ($exp) {
            return $exp->or_([
                'author_id' => 2,
                'is_highlighted' => true
            ]);
        });

..
    The above would create SQL like::

上記の SQL は下記のようになります::

    SELECT *
    FROM articles
    WHERE ((author_id = 2 OR is_highlighted = 1)
    AND title LIKE '%First%')

..
    The expression object that is passed into ``where()`` functions has two kinds of
    methods. The first type of methods are **combinators**. The ``and_()`` and
    ``or_()`` methods create new expression objects that change **how** conditions
    are combined. The second type of methods are **conditions**. Conditions are
    added into an expression where they are combined with the current combinator.

``where()`` 関数に渡される Expression オブジェクトには２種類のメソッドがあります。
１種類目のメソッドは **結合子** (and や or) です。
``and_()`` と ``or_()`` メソッドは条件が **どう** 結合されるかが変更された新しい Expression オブジェクトを作成します。
２種類目のメソッドは **条件** です。条件は、現在の結合子を使って結合され、Expression オブジェクトに追加されます。

..
    For example, calling ``$exp->and_(...)`` will create a new ``Expression`` object
    that combines all conditions it contains with ``AND``. While ``$exp->or_()``
    will create a new ``Expression`` object that combines all conditions added to it
    with ``OR``. An example of adding conditions with an ``Expression`` object would
    be::

たとえば、 ``$exp->and_(...)`` を呼ぶと、そこに含まれるすべての条件が ``AND`` で結合された、
新しい ``Expression`` オブジェクトが作成されます。
``$exp->or_()`` の場合は 、そこに含まれるすべての条件が ``OR`` で結合された、
新しい ``Expression`` オブジェクトが作成されます。
``Expression`` object で条件を追加する例は次のようになります::

    $query = $articles->find()
        ->where(function ($exp) {
            return $exp
                ->eq('author_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('view_count', 10);
        });

..
    Since we started off using ``where()``, we don't need to call ``and_()``, as that
    happens implicitly. Much like how we would not need to call ``or_()``, had we
    started our query with ``orWhere()``. The above shows a few new condition
    methods being combined with ``AND``. The resulting SQL would look like::

``where()`` を使い始めた場合、 ``and_()`` は暗黙的に選ばれているため、それを呼ぶ必要はありません。
``orWhere()`` を使い始めた場合、同じような理由で ``or_()`` を呼ぶ必要もありません。
上記の例では新たな条件がいくつか ``AND`` で結合されています。
結果の SQL は次のようになります::

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10)

..
    However, if we wanted to use both ``AND`` & ``OR`` conditions we could do the
    following::

ただし、 ``AND`` と ``OR`` の両方を使いたいなら、
次のようにすることもできます::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->add($orConditions)
                ->eq('published', true)
                ->gte('view_count', 10);
        });

..
    Which would generate the SQL similar to::

これは下記のような SQL を生成します::

    SELECT *
    FROM articles
    WHERE (
    (author_id = 2 OR author_id = 5)
    AND published = 1
    AND view_count > 10)

..
    The ``or_()`` and ``and_()`` methods also allow you to use functions as their
    parameters. This is often easier to read than method chaining::

``or_()`` と ``and_()`` メソッドはまた、それらの引数に関数も渡せるようになっています。
これはメソッドをチェーンさせる際に可読性を上げられることが良く有ります::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(function ($or) {
                return $or->eq('author_id', 2)
                    ->eq('author_id', 5);
            });
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

..
    You can negate sub-expressions using ``not()``::

``not()`` を使って式を否定することができます::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

..
    Which will generate the following SQL looking like::

これは下記のような SQL を生成します::

    SELECT *
    FROM articles
    WHERE (
    NOT (author_id = 2 OR author_id = 5)
    AND view_count <= 10)

..
    It is also possible to build expressions using SQL functions::

SQL 関数を使った式を構築することも可能です::

    $query = $articles->find()
        ->where(function ($exp, $q) {
            $year = $q->func()->year([
                'created' => 'literal'
            ]);
            return $exp
                ->gte($year, 2014)
                ->eq('published', true);
        });

..
    Which will generate the following SQL looking like::

これは下記のような SQL を生成します::

    SELECT *
    FROM articles
    WHERE (
    YEAR(created) >= 2014
    AND published = 1
    )

..
    When using the expression objects you can use the following methods to create
    conditions:

Expression オブジェクトを使う際、下記のメソッド使って条件を作成できます:

- ``eq()`` 等号の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->eq('population', '10000');
        });
    # WHERE population = 10000

- ``notEq()`` 不等号の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notEq('population', '10000');
        });
    # WHERE population != 10000

- ``like()`` ``LIKE`` 演算子を使った条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->like('name', '%A%');
        });
    # WHERE name LIKE "%A%"

- ``notLike()`` ``LIKE`` 条件の否定を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notLike('name', '%A%');
        });
    # WHERE name NOT LIKE "%A%"

- ``in()`` ``IN`` を使った条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->in('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id IN ('AFG', 'USA', 'EST')

- ``notIn()`` ``IN`` を使った条件の否定を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->notIn('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id NOT IN ('AFG', 'USA', 'EST')

- ``gt()`` ``>`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->gt('population', '10000');
        });
    # WHERE population > 10000

- ``gte()`` ``>=`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->gte('population', '10000');
        });
    # WHERE population >= 10000

- ``lt()`` ``<`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->lt('population', '10000');
        });
    # WHERE population < 10000

- ``lte()`` ``<=`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->lte('population', '10000');
        });
    # WHERE population <= 10000

- ``isNull()`` ``IS NULL`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->isNull('population');
        });
    # WHERE (population) IS NULL

- ``isNotNull()`` ``IS NULL`` の条件の否定を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->isNotNull('population');
        });
    # WHERE (population) IS NOT NULL

- ``between()`` ``BETWEEN`` の条件を作成します::

    $query = $cities->find()
        ->where(function ($exp, $q) {
            return $exp->between('population', 999, 5000000);
        });
    # WHERE population BETWEEN 999 AND 5000000,

.. warning::

    式(expression)の中で使われる列名には安全性が確実でない内容を **絶対に含めてはいけません** 。
    関数の呼び出しで、安全でないデータを安全に渡す方法については :ref:`using-sql-functions` の章を参照してください。

..
    The field name used in expressions should **never** contain untrusted content.
    See the :ref:`using-sql-functions` section for how to safely include
    untrusted data into function calls.

IN 句を自動生成する
---------------------------------

..
    Automatically Creating IN Clauses

..
    When building queries using the ORM, you will generally not have to indicate the
    data types of the columns you are interacting with, as CakePHP can infer the
    types based on the schema data. If in your queries you'd like CakePHP to
    automatically convert equality to ``IN`` comparisons, you'll need to indicate
    the column data type::

ORM を使ってクエリをビルドする際、大抵の場合、利用する列のデータ型を指定する必要はありません。
なぜなら CakePHP はスキーマデータに基いて推測することができるためです。
もしクエリの中で CakePHP に自動的に等号を ``IN`` に変えさせたいなら、列データ型を明示する必要があります::

    $query = $articles->find()
        ->where(['id' => $ids], ['id' => 'integer[]']);

    // もしくは、自動的に配列へとキャストさせるために IN を含めます。
    $query = $articles->find()
        ->where(['id IN' => $ids]);

..
    The above will automatically create ``id IN (...)`` instead of ``id = ?``. This
    can be useful when you do not know whether you will get a scalar or array of
    parameters. The ``[]`` suffix on any data type name indicates to the query
    builder that you want the data handled as an array. If the data is not an array,
    it will first be cast to an array. After that, each value in the array will
    be cast using the :ref:`type system <database-data-types>`. This works with
    complex types as well. For example, you could take a list of DateTime objects
    using::

上記では自動的に ``id = ?`` ではなく ``id IN (...)`` が作成されます。
これは、パラメータが単数か配列か判らない場合に便利です。
データ型名の末尾に付く ``[]`` という接尾辞は、扱いたいデータが配列であることをクエリビルダに知らせます。
もしもデータが配列でなかったなら、まず、配列へとキャストされることになります。
その後、配列の各値は :ref:`type system <database-data-types>` を使ってキャストされることになります。
これは複合型であっても同様に動きます。たとえば、DateTime オブジェクトのリストも使うことができます::

    $query = $articles->find()
        ->where(['post_date' => $dates], ['post_date' => 'date[]']);

IS NULL を自動生成する
-----------------------------

..
    Automatic IS NULL Creation

..
    When a condition value is expected to be ``null`` or any other value, you can use
    the ``IS`` operator to automatically create the correct expression::

条件の値が ``null`` かもしれないし、他の値かもしれない場合、 ``IS`` 演算子を使うことで自動的に正しい式が作成されます::

    $query = $categories->find()
        ->where(['parent_id IS' => $parentId]);


..
    The above will create ``parent_id` = :c1`` or ``parent_id IS NULL`` depending on
    the type of ``$parentId``

上記は ``$parentId`` の型に応じて ``parent_id` = :c1`` もしくは ``parent_id IS NULL`` が自動的に作成されます。

IS NOT NULL を自動生成する
----------------------------------

..
    Automatic IS NOT NULL Creation

..
    When a condition value is expected not to be ``null`` or any other value, you can use
    the ``IS NOT`` operator to automatically create the correct expression::

条件として非 ``null`` もしくは、他の値でないことを期待する場合、 ``IS NOT`` 演算子を使うことで自動的に正しい式が作成されます::

    $query = $categories->find()
        ->where(['parent_id IS NOT' => $parentId]);


..
    The above will create ``parent_id` != :c1`` or ``parent_id IS NOT NULL``
    depending on the type of ``$parentId``

上記は ``$parentId`` の型に応じて ``parent_id` != :c1`` もしくは ``parent_id IS NOT NULL`` が自動的に作成されます。

未加工の式
--------------------

..
    Raw Expressions

..
    When you cannot construct the SQL you need using the query builder, you can use
    expression objects to add snippets of SQL to your queries::

クエリビルダでは目的の SQL が構築できない場合、Expression オブジェクトを使って、
SQL の断片をクエリに追加することができます::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['two' => $expr]);

..
    ``Expression`` objects can be used with any query builder methods like
    ``where()``, ``limit()``, ``group()``, ``select()`` and many other methods.

``Expression`` オブジェクトは ``where()``、 ``limit()``。 ``group()``、 ``select()`` 等のような
クエリビルダのメソッドで使うことができます。

.. warning::

    Expression オブジェクトを使うと SQL インジェクションに対して脆弱になります。
    ユーザーデータが式の中に注入されないようにしてください。

..
    Using expression objects leaves you vulnerable to SQL injection. You should
    avoid interpolating user data into expressions.

結果を取得する
===================

..
    Getting Results

..
    Once you've made your query, you'll want to retrieve rows from it. There are
    a few ways of doing this::

クエリができたら、それから行を受け取りたいでしょう。
これにはいくつかの方法があります::

    // クエリをイテレートする
    foreach ($query as $row) {
        // なにかする
    }

    // 結果を取得する
    $results = $query->all();

..
    You can use :doc:`any of the collection </core-libraries/collections>` methods
    on your query objects to pre-process or transform the results::

Query オブジェクトでは :doc:`Collection </core-libraries/collections>` のメソッドがどれでも使えます。
それらで結果を前処理したり、変換したりすることができます::

    // コレクションのメソッドを使う
    $ids = $query->map(function ($row) {
        return $row->id;
    });

    $maxAge = $query->max(function ($row) {
        return $max->age;
    });

..
    You can use ``first`` or ``firstOrFail`` to retrieve a single record. These
    methods will alter the query adding a ``LIMIT 1`` clause::

``first`` や ``firstOrFail`` を使って、単一のレコードを受け取ることができます。
これらのメソッドはクエリに ``LIMIT 1`` 句を付加した形に変更します::

    // 最初の行だけを取得する
    $row = $query->first();

    // 最初の行を取得する。できないなら例外とする。
    $row = $query->firstOrFail();

.. _query-count:

レコードの合計数を返す
------------------------------------

..
    Returning the Total Count of Records

..
    Using a single query object, it is possible to obtain the total number of rows
    found for a set of conditions::

Query オブジェクトを使って、条件の結果見つかった行の合計数を取得することができます::

    $total = $articles->find()->where(['is_active' => true])->count();

..
    The ``count()`` method will ignore the ``limit``, ``offset`` and ``page``
    clauses, thus the following will return the same result::

``count()`` メソッドは ``limit``、 ``offset``、 ``page`` 句を無視します。
それゆえ、下記でも同じ結果を返すことになります::

    $total = $articles->find()->where(['is_active' => true])->limit(10)->count();

..
    This is useful when you need to know the total result set size in advance,
    without having to construct another ``Query`` object. Likewise, all result
    formatting and map-reduce routines are ignored when using the ``count()``
    method.

これは、別の ``Query`` オブジェクトを構築する必要なく、結果セットの合計数を前もって知ることができるので便利です。
同様に、結果のフォーマット(result formatting)、Map/Reduce 処理は ``count()`` を使う際には無視されます。

..
    Moreover, it is possible to return the total count for a query containing group
    by clauses without having to rewrite the query in any way. For example, consider
    this query for retrieving article ids and their comments count::

加えて言うと、group by 句を含んだクエリの合計数を、クエリを少しも書き直すことなく、取得することが可能です。
たとえば、記事(article)の id と、そのコメント(comment)件数を取得するクエリを考えてみましょう::

    $query = $articles->find();
    $query->select(['Articles.id', $query->func()->count('Comments.id')])
        ->matching('Comments')
        ->group(['Articles.id']);
    $total = $query->count();

..
    After counting, the query can still be used for fetching the associated
    records::

カウント後でも、結びついたレコードをフェッチするのにクエリを使うことができます::

    $list = $query->all();

..
    Sometimes, you may want to provide an alternate method for counting the total
    records of a query. One common use case for this is providing
    a cached value or an estimate of the total rows, or to alter the query to remove
    expensive unneeded parts such as left joins. This becomes particularly handy
    when using the CakePHP built-in pagination system which calls the ``count()``
    method::

ときには、クエリの合計件数を返すメソッドをカスタマイズしたくなることもあるでしょう。
たとえば、値をキャッシュしたり、合計行数を見積もったり、あるいは、left join のような高負荷な部分を取り除くようにクエリを変更したりなどです。
CakePHP のページネーション(pagination)システムでは ``count()`` メソッドを呼び出しますので、これは特に有用です::

    $query = $query->where(['is_active' => true])->counter(function ($query) {
        return 100000;
    });
    $query->count(); // 100000 を返す

..
    In the example above, when the pagination component calls the count method, it
    will receive the estimated hard-coded number of rows.

上記の例では、PaginatorComponent が count メソッドを呼ぶ際には、
ハードコーディングされた行数を受け取ることになります。

.. _caching-query-results:

ロードされた結果をキャッシュする
-------------------------------------

..
    Caching Loaded Results

..
    When fetching entities that don't change often you may want to cache the
    results. The ``Query`` class makes this simple::

変更されることのない Entity をフェッチする際、結果をキャッシュしたいと思うかもしれません。
``Query`` クラスでは簡単にこれを実現できます::

    $query->cache('recent_articles');

..
    Will enable caching on the query's result set. If only one argument is provided
    to ``cache()`` then the 'default' cache configuration will be used. You can
    control which caching configuration is used with the second parameter::

これでクエリの結果セットのキャッシュが有効になります。
もし ``cache()`` に１つだけの引数を渡した場合は、 'default' のキャッシュ・コンフィグレーションが使われることになります。
第２引数でどのキャッシュ・コンフィグレーションを使うのかを制御できます::

    // 文字列で Config 名
    $query->cache('recent_articles', 'dbResults');

    // CacheEngine のインスタンス
    $query->cache('recent_articles', $memcache);

..
    In addition to supporting static keys, the ``cache()`` method accepts a function
    to generate the key. The function you give it will receive the query as an
    argument. You can then read aspects of the query to dynamically generate the
    cache key::

``cache()`` メソッドは静的なキーだけでなく、 キーを生成する関数も受け取れます。
渡す関数は引数でクエリを受け取りますので、クエリの内容を読んで動的にキャッシュキーを生成することができます::

    // クエリの where 句の単純なチェックサムに基づくキーを生成します
    $query->cache(function ($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

..
    The cache method makes it simple to add cached results to your custom finders or
    through event listeners.

キャッシュメソッドはキャッシュされた結果をカスタム finder に渡したり、イベントリスナで使ったりするのを簡単にします。

..
    When the results for a cached query are fetched the following happens:

キャッシュ設定されたクエリが結果を返すときには次のようなことが起こります:

1. ``Model.beforeFind`` イベントがトリガーされます。
2. クエリが結果セットを保持しているなら、それを返します。
3. キャッシュキーを解決して、キャッシュデータを読みす。
   キャッシュデータが空でなければ、その結果を返します。
4. キャッシュが無いなら、クエリが実行され、新しい ``ResultSet`` が作成されます。
   この ``ResultSet`` をキャッシュに登録し、返します。

..
    1. The ``Model.beforeFind`` event is triggered.
    2. If the query has results set, those will be returned.
    3. The cache key will be resolved and cache data will be read. If the cache data
       is not empty, those results will be returned.
    4. If the cache misses, the query will be executed and a new ``ResultSet`` will be
       created. This ``ResultSet`` will be written to the cache and returned.

.. note::

    ストリーミングクエリ(streaming query)の結果をキャッシュすることはできません。

..
    You cannot cache a streaming query result.

関連付くデータをロードする
============================

..
    Loading Associations

..
    The builder can help you retrieve data from multiple tables at the same time
    with the minimum amount of queries possible. To be able to fetch associated
    data, you first need to setup associations between the tables as described in
    the :doc:`/orm/associations` section. This technique of combining queries
    to fetch associated data from other tables is called **eager loading**.

クエリビルダは同時に複数テーブルからデータを取り出す際に、できるだけ最少のクエリで取り出せるようにしてくれます。
関連付くデータをフェッチする際には、まず、:doc:`/orm/associations` の章にあるようにテーブル間の関連をセットアップしてください。
他のテーブルから関連するデータをフェッチするためにクエリを合成する技術を **イーガーロード** (eager load) といいます。

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-contain
    :end-before: end-contain

関連付くデータでフィルタする
--------------------------------

..
    Filtering by Associated Data

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-filtering
    :end-before: end-filtering

.. _adding-joins:

Join を追加する
----------------------

..
    Adding Joins

..
    In addition to loading related data with ``contain()``, you can also add
    additional joins with the query builder::

関連付くデータを ``contain()`` でロードすることもできますが、
追加の join をクエリビルダに加えることもできます::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'table' => 'comments',
            'alias' => 'c',
            'type' => 'LEFT',
            'conditions' => 'c.article_id = articles.id',
        ]);

..
    You can append multiple joins at the same time by passing an associative array
    with multiple joins::

複数 join の連想配列を渡すことで、複数の join を一度に追加できます::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => 'c.article_id = articles.id',
            ],
            'u' => [
                'table' => 'users',
                'type' => 'INNER',
                'conditions' => 'u.id = articles.user_id',
            ]
        ]);

..
    As seen above, when adding joins the alias can be the outer array key. Join
    conditions can also be expressed as an array of conditions::

上記にあるように、join を加える際に、エイリアス(別名)を配列のキーで渡すことができます。
join の条件も条件の配列と同じように表現できます::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.created >' => new DateTime('-5 days'),
                    'c.moderated' => true,
                    'c.article_id = articles.id'
                ]
            ],
        ], ['a.created' => 'datetime', 'c.moderated' => 'boolean']);

..
    When creating joins by hand and using array based conditions, you need to
    provide the datatypes for each column in the join conditions. By providing
    datatypes for the join conditions, the ORM can correctly convert data types into
    SQL. In addition to ``join()`` you can use ``rightJoin()``, ``leftJoin()`` and
    ``innerJoin()`` to create joins::

手動で join を作成する際、配列による条件を使うなら、join 条件内の各列ごとにデータ型を渡す必要があります。
join 条件のデータ型を渡すことで、ORM はデータの型を SQL へと正しく変換できるのです。
join を作成する際には ``join()`` だけでなく、``rightJoin()``、 ``leftJoin()``、``innerJoin()`` を使うこともできます::

    // エイリアスと文字列の条件で join する
    $query = $articles->find();
    $query->leftJoin(
        ['Authors' => 'authors'],
        ['Authors.id = Articles.author_id']);

    // エイリアスと配列の条件・型で join する
    $query = $articles->find();
    $query->innerJoin(
        ['Authors' => 'authors'],
        [
            'Authors.promoted' => true,
            'Authors.created' => new DateTime('-5 days'),
            'Authors.id = Articles.author_id'
        ],
        ['Authors.promoted' => 'boolean', 'Authors.created' => 'datetime']);

..
    It should be noted that if you set the ``quoteIdentifiers`` option to ``true`` when
    defining your ``Connection``, join conditions between table fields should be set as follow::

注意しなければならないのは、``Connection`` を定義する際に
``quoteIdentifiers`` オプションが ``true`` の場合には、
テーブルの列間の join 条件は次のようにしなければならないということです::

    $query = $articles->find()
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.article_id' => new \Cake\Database\Expression\IdentifierExpression('articles.id')
                ]
            ],
        ]);

..
    This ensures that all of your identifiers will be quoted across the Query, avoiding errors with
    some database Drivers (PostgreSQL notably)

これは Query 内のすべての識別子に引用符が付くことを保証し、いくつかの DB （とくに PostgreSQL）でエラーが起こらないようにします。

データを insert する
=========================

..
    Inserting Data

..
    Unlike earlier examples, you should not use ``find()`` to create insert queries.
    Instead, create a new ``Query`` object using ``query()``::

前の例とは違って、insert するクエリを作成するのに ``find()`` は使わないでください。
代わりに、 ``query()`` を使って新たな ``Query`` オブジェクトを作成します::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->execute();

..
    Generally, it is easier to insert data using entities and
    :php:meth:`~Cake\\ORM\\Table::save()`. By composing a ``SELECT`` and
    ``INSERT`` query together, you can create ``INSERT INTO ... SELECT`` style
    queries::

通常は、エンティティを使い、 :php:meth:`~Cake\\ORM\\Table::save()` でデータを insert するほうが簡単です。
また、``SELECT`` と ``INSERT`` を一緒に構築すれば、 ``INSERT INTO ... SELECT`` スタイルのクエリを作成することができます::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['title', 'body', 'published'])
        ->values($select)
        ->execute();

.. _query-builder-updating-data:

データを update する
=========================

..
    Updating Data

..
    As with insert queries, you should not use ``find()`` to create update queries.
    Instead, create new a ``Query`` object using ``query()``::

クエリの insert と同様に、update のクエリを作成するのに ``find()`` を使わないでください。
代わりに、 ``query()`` を使って新たな ``Query`` オブジェクトを作成します::

    $query = $articles->query();
    $query->update()
        ->set(['published' => true])
        ->where(['id' => $id])
        ->execute();

..
    Generally, it is easier to update data using entities and
    :php:meth:`~Cake\\ORM\\Table::patchEntity()`.

通常は、エンティティを使い、 :php:meth:`~Cake\\ORM\\Table::patchEntity()` でデータを update するほうが簡単です。

データを delete する
==========================

..
    Deleting Data

..
    As with insert queries, you should not use ``find()`` to create delete queries.
    Instead, create new a query object using ``query()``::

クエリの insert と同様に、delete のクエリを作成するのに ``find()`` を使わないでください。
代わりに、 ``query()`` を使って新たな ``Query`` オブジェクトを作成します::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

..
    Generally, it is easier to delete data using entities and
    :php:meth:`~Cake\\ORM\\Table::delete()`.

通常は、エンティティを使い、 :php:meth:`~Cake\\ORM\\Table::delete()` でデータを delete するほうが簡単です。

SQL インジェクションを防止する
===================================

..
    SQL Injection Prevention

..
    While the ORM and database abstraction layers prevent most SQL injections
    issues, it is still possible to leave yourself vulnerable through improper use.
    When using the expression builder, column names must not contain user data::

ORM と DB の抽象層では、ほとんどの SQL インジェクション問題を防止してはいますが、
不適切な用法により危険な値が入り込む余地も依然としてありえます。
Expression ビルダを使う際には、列名にユーザデータを含めてはいけません::

    $query->where(function ($exp) use ($userData, $values) {
        // いずれの式(expression)の中であっても列名は安全ではありません
        return $exp->in($userData, $values);
    });

..
    When building function expressions, function names should never contain user
    data::

関数式を構築する際、関数名にユーザデータを含めてはいけません::

    // 安全ではありません
    $query->func()->{$userData}($arg1);

    // 関数式の引数としてユーザデータの配列を使うことも安全ではありません
    $query->func()->coalesce($userData);

..
    Raw expressions are never safe::

未加工(raw)の式は安全ではありません::

    $expr = $query->newExpr()->add($userData);
    $query->select(['two' => $expr]);

より複雑なクエリ
========================

..
    More Complex Queries

..
    The query builder is capable of building complex queries like ``UNION`` queries
    and sub-queries.

クエリビルダでは ``UNION`` クエリやサブクエリのような複雑なクエリも構築することができます。

UNION
--------

..
    Unions are created by composing one or more select queries together::

UNION は１つ以上のクエリを一緒に構築して作成します::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

..
    You can create ``UNION ALL`` queries using the ``unionAll()`` method::

``unionAll()`` メソッドを使うことで ``UNION ALL`` クエリを作成することもできます::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

サブクエリ
--------------

..
    Subqueries

..
    Subqueries are a powerful feature in relational databases and building them in
    CakePHP is fairly intuitive. By composing queries together, you can make
    subqueries::

サブクエリはリレーショナル・データベースにおいて強力な機能であり、CakePHP ではそれを実に直感的に構築することができます。
クエリを一緒に構築することで、サブクエリを作ることができます::

    $matchingComment = $articles->association('Comments')->find()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id' => $matchingComment]);

..
    Subqueries are accepted anywhere a query expression can be used. For example, in
    the ``select()`` and ``join()`` methods.

サブクエリはクエリ式のどこにでも使うことができます。
たとえば、``select()`` や ``join()`` メソッドの中でもです。

複雑なクエリを実行する
-----------------------------

..
    Executing Complex Queries

..
    While the query builder makes it easy to build most queries, very complex
    queries can be tedious and complicated to build. You may want to :ref:`execute
    the desired SQL directly <running-select-statements>`.

クエリビルダはほとんどのクエリを簡単に構築できるようにしてくれますが、
あまりに複雑なクエリだと、構築するにも退屈で入り組んだものになるかもしれません。
:ref:`望む SQL を直接実行 <running-select-statements>` したいかもしれません。

..
    Executing SQL directly allows you to fine tune the query that will be run.
    However, doing so doesn't let you use ``contain`` or other higher level ORM
    features.

SQL を直接実行するということは、走ることになるクエリを微調整できることになります。
ただし、そうしてしまうと、 ``contain`` や他の高レベルな ORM 機能は使えません。

.. _format-results:

計算列を追加する
========================

..
    Adding Calculated Fields

..
    After your queries, you may need to do some post-processing. If you need to add
    a few calculated fields or derived data, you can use the ``formatResults()``
    method. This is a lightweight way to map over the result sets. If you need more
    control over the process, or want to reduce results you should use
    the :ref:`Map/Reduce <map-reduce>` feature instead. If you were querying a list
    of people, you could calculate their age with a result formatter::

クエリ後に何か後処理をする必要があるかもしれません。
計算列や生成された(derived)データをいくつか追加する必要があるなら、
``formatResults()`` メソッドを使うことができます。
これにより軽い負荷で、結果セットを map することができます。
この処理をこれ以上に制御する必要があるなら、もしくは、結果セットを reduce する必要があるなら、
:ref:`Map/Reduce <map-reduce>` 機能を代わりに使ってください。
人々のリストを問い合わせる際に、formatResults を使って年齢(age)を算出するなら次のようになります::

    // 列、条件、関連が構築済であると仮定します。
    $query->formatResults(function (\Cake\Datasource\ResultSetInterface $results) {
        return $results->map(function ($row) {
            $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
            return $row;
        });
    });

..
    As you can see in the example above, formatting callbacks will get a
    ``ResultSetDecorator`` as their first argument. The second argument will be
    the Query instance the formatter was attached to. The ``$results`` argument can
    be traversed and modified as necessary.

上記の例にあるように、フォーマッタ関数(フォーマットするコールバック)の第１引数に ``ResultSetDecorator`` が渡されています。
第２引数にはフォーマッタ関数がセットされる Query インスタンスが渡されます。
引数の ``$results`` は必要に応じて、取り出しでも変換でもすることができます。

..
    Result formatters are required to return an iterator object, which will be used
    as the return value for the query. Formatter functions are applied after all the
    Map/Reduce routines have been executed. Result formatters can be applied from
    within contained associations as well. CakePHP will ensure that your formatters
    are properly scoped. For example, doing the following would work as you may
    expect::

フォーマッタ関数は、クエリが値を返せるようにするために、イテレータオブジェクトを返す必要があります。
フォーマッタ関数はすべての Map/Reduce が実行し終わった後、適用されます。
contain された関連の中からでも同じようにフォーマッタ関数を適用することができます。
CakePHP はフォーマッタ関数が適切なスコープになるよう保証します。
たとえば、下記のようにした場合でも、期待どおりに動きます::

    // Articles テーブル内のメソッドで
    $query->contain(['Authors' => function ($q) {
        return $q->formatResults(function ($authors) {
            return $authors->map(function ($author) {
                $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
                return $author;
            });
        });
    });

    // 結果を取得する
    $results = $query->all();

    // 29 が出力される
    echo $results->first()->author->age;

..
    As seen above, the formatters attached to associated query builders are scoped
    to operate only on the data in the association. CakePHP will ensure that
    computed values are inserted into the correct entity.

上記にあるように、関連付いたクエリビルダに設置されたフォーマッタ関数は、関連付いたデータの中だけの操作にスコープが限定されます。
CakePHP は計算された値が正しい Entity にセットされることを保証します。
