Construtor de Queries
#####################

.. php:namespace:: Cake\ORM

.. php:class:: Query

O construtor de consultas do ORM fornece uma interface fluente e simples de usar 
para criar e executar consultas. Ao compor consultas, você pode criar 
consultas avançadas usando uniões e subconsultas com facilidade.

Debaixo do capô, o construtor de consultas usa instruções preparadas para DOP 
que protegem contra ataques de injeção de SQL.


O Objeto Query
==============

A maneira mais fácil de criar um objeto ``Consulta`` é usar ``find()`` 
de um objeto ``Tabela``. Este método retornará uma consulta incompleta pronta 
para ser modificada. Também é possível usar o objeto de conexão de uma tabela 
para acessar o construtor Query de nível inferior que não inclui recursos ORM, 
se necessário. Consulte a seção :ref:`database-queries` para obter mais informações::

    use Cake\ORM\TableRegistry;

    // Anterior a 3.6.0
    $articles = TableRegistry::get('Articles');

    $articles = TableRegistry::getTableLocator()->get('Articles');

    // Inicie uma nova consulta.
    $query = $articles->find();

Quando dentro de um controlador, você pode usar a variável de tabela automática 
criada usando o sistema de convenções::

    // Dentro de ArticlesController.php

    $query = $this->Articles->find();

Selecionando Linhas de uma Tabela
---------------------------------

.. code-block::

    use Cake\ORM\TableRegistry;

    // Anterior a 3.6.0
    $query = TableRegistry::get('Articles')->find();

    $query = TableRegistry::getTableLocator()->get('Articles')->find();

    foreach ($query as $article) {
        debug($article->title);
    }

Para os exemplos restantes, suponha que ``$articles`` seja um
:php:class:`~Cake\\ORM\\Table`. Quando dentro de controladores, 
você pode usar ``$this->Articles`` em vez de ``$articles``.

Quase todos os métodos em um objeto ``Query`` retornam a mesma 
consulta, isso significa que os objetos ``Query`` são preguiçosos 
e não serão executados a menos que você solicite::

    $query->where(['id' => 1]); // Retornar o mesmo objeto de consulta
    $query->order(['title' => 'DESC']); // Ainda o mesmo objeto, nenhum SQL executado

É claro que você pode encadear os métodos que você chama nos objetos de consulta::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

    foreach ($query as $article) {
        debug($article->created);
    }

Se você tentar chamar ``debug()`` em um objeto Query, verá seu estado 
interno e o SQL que será executado no banco de dados::

    debug($articles->find()->where(['id' => 1]));

    // Saídas
    // ...
    // 'sql' => 'SELECT * FROM articles where id = ?'
    // ...

Você pode executar uma consulta diretamente sem precisar usar ``foreach`` nela. 
A maneira mais fácil é chamar os métodos ``all()`` ou ``toList()``::

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
        ->toList();

    foreach ($resultsArray as $article) {
        debug($article->id);
    }

    debug($resultsArray[0]->title);

No exemplo acima, ``$resultsIteratorObject`` será uma instância de
``Cake\ORM\ResultSet``, um objeto no qual você pode iterar e aplicar vários 
métodos de extração e deslocamento.

Freqüentemente, não há necessidade de chamar ``all()``, você pode simplesmente 
iterar o objeto Query para obter seus resultados. Objetos de consulta também 
podem ser usados diretamente como objeto de resultado; tentar iterar a consulta, 
chamando ``toList()`` ou alguns dos métodos herdados de :doc:`Collection</core-libraries/collections>`, 
resultará na execução da consulta e nos resultados retornados a você.

Selecionando uma Única Linha de uma Tabela
------------------------------------------

Você pode usar o método ``first()`` para obter o primeiro resultado na consulta::

    $article = $articles
        ->find()
        ->where(['id' => 1])
        ->first();

    debug($article->title);

Obtendo uma Lista de Valores de uma Coluna
------------------------------------------

.. code-block::

    // Use o método extract() da biblioteca de coleções
    // Isso executa a consulta também
    $allTitles = $articles->find()->extract('title');

    foreach ($allTitles as $title) {
        echo $title;
    }

Você também pode obter uma lista de valores-chave de um resultado da consulta::

    $list = $articles->find('list');

    foreach ($list as $id => $title) {
        echo "$id : $title"
    }

Para obter mais informações sobre como personalizar os campos usados para preencher a lista, 
consulte seção :ref:`table-find-list`.

As Consultas são Objetos de Coleção
-----------------------------------

Depois de se familiarizar com os métodos do objeto Query, é altamente recomendável 
que você visite a seção :doc:`Coleção </ core-libraries / collections>` para 
melhorar suas habilidades em percorrer os dados com eficiência. Em resumo, é 
importante lembrar que qualquer coisa que você possa chamar em um objeto Collection, 
você também pode fazer em um objeto Query::

    // Use o método combine() da biblioteca de coleções, 
    // isto é equivalente a find('list')
    $keyValueList = $articles->find()->combine('id', 'title');

    // Um exemplo avançado
    $results = $articles->find()
        ->where(['id >' => 1])
        ->order(['title' => 'DESC'])
        ->map(function ($row) { // map() é um método de coleção, ele executa a consulta
            $row->trimmedTitle = trim($row->title);
            return $row;
        })
        ->combine('id', 'trimmedTitle') // combine() é outro método de coleção
        ->toArray(); // Também um método dA biblioteca de coleções

    foreach ($results as $id => $trimmedTitle) {
        echo "$id : $trimmedTitle";
    }

As consultas são Avaliadas Preguiçosamente
------------------------------------------

Objetos de consulta são avaliados preguiçosamente. Isso significa que uma consulta 
não é executada até que ocorra uma das seguintes coisas:

- A consulta é iterada com ``foreach()``.
- O método ``execute()`` da consulta é chamado. Isso retornará o objeto subjacente
   de instrução e deve ser usado com consultas de inserção/atualização/exclusão.
- O método ``first()`` da consulta é chamado. Isso retornará o primeiro resultado no conjunto
   construído por ``SELECT`` (ele adiciona `` LIMIT 1`` à consulta).
- O método ``all()`` da consulta é chamado. Isso retornará o conjunto de resultados e
   só pode ser usado com instruções ``SELECT``.
- O método ``toList()`` ou ``toArray()`` da consulta é chamado.

Até que uma dessas condições seja atendida, a consulta pode ser modificada sem 
que SQL adicional seja enviado ao banco de dados. Isso também significa que, se 
uma consulta não tiver sido realizada, nenhum SQL é enviado ao banco de dados. 
Uma vez executada, modificar e reavaliar uma consulta resultará na execução de SQL adicional.

Se você quiser dar uma olhada no que o SQL CakePHP está gerando, você pode ativar o 
banco de dados :ref:`query logging <database-query-logging>`.

Selecionando Dados
==================

O CakePHP simplifica a construção de consultas ``SELECT``. Para limitar os campos 
buscados, você pode usar o método ``select()``::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query as $row) {
        debug($row->title);
    }

Você pode definir aliases para campos fornecendo campos como uma matriz associativa::

    // Resultados do SELECT id AS pk, title AS aliased_title, body ...
    $query = $articles->find();
    $query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);

Para selecionar campos distintos, você pode usar o método ``distinct()``::

    // Resultados em SELECT DISTINCT country FROM ...
    $query = $articles->find();
    $query->select(['country'])
        ->distinct(['country']);

Para definir algumas condições básicas, você pode usar o método ``where()``::

    // As condições são combinadas com AND
    $query = $articles->find();
    $query->where(['title' => 'First Post', 'published' => true]);

    // Você pode chamar where() várias vezes
    $query = $articles->find();
    $query->where(['title' => 'First Post'])
        ->where(['published' => true]);

Você também pode passar uma função anônima para o método ``where()``. 
A função anônima transmitida receberá uma instância de ``\Cake\Database\Expression\QueryExpression`` 
como seu primeiro argumento e ``\Cake\ORM\Query`` como seu segundo argumento::

    $query = $articles->find();
    $query->where(function (QueryExpression $exp, Query $q) {
        return $exp->eq('published', true);
    });

Veja a seção :ref:`advanced-query-conditions` para descobrir como construir 
condições mais complexas com ``WHERE``. Para aplicar ordenamentos, você pode usar o método ``order``::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

Ao chamar ``order()`` várias vezes em uma consulta, várias cláusulas serão anexadas. 
No entanto, ao usar finders, às vezes você pode sobrescrever o ``ORDER BY``. 
Defina o segundo parâmetro de ``order()`` (assim como ``orderAsc()`` ou 
``orderDesc()``) como ``Query::OVERWRITE`` ou como ``true``::

    $query = $articles->find()
        ->order(['title' => 'ASC']);
    // Posteriormente, substitua a cláusula ORDER BY em vez de anexá-la.
    $query = $articles->find()
        ->order(['created' => 'DESC'], Query::OVERWRITE);

.. versionadded:: 3.0.12

    Além de ``order``, os métodos ``orderAsc`` e `` orderDesc`` podem ser usados quando 
    você precisa organizar expressões complexas::

        $query = $articles->find();
        $concat = $query->func()->concat([
            'title' => 'identifier',
            'synopsis' => 'identifier'
        ]);
        $query->orderAsc($concat);

Para limitar o número de linhas ou definir o deslocamento da linha, você 
pode usar os métodos ``limit()`` e ``page()``::

    // Busca linhas de 50 para 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

Como você pode ver nos exemplos acima, todos os métodos que modificam a consulta 
fornecem uma interface fluente, permitindo que você crie uma consulta por meio de 
chamadas de método em cadeia.

Selecionando Campos Específicos
-------------------------------

Por padrão, uma consulta seleciona todos os campos de uma tabela, a exceção é 
quando você chama a função ``select()`` e passa determinados campos::

    // Selecione apenas ID e título da tabela de artigos
    $articles->find()->select(['id', 'title']);

Se você ainda deseja selecionar todos os campos de uma tabela depois de chamar 
``select($fields)``, pode passar a instância da tabela para ``select()`` 
para esse propósito::

    // Seleciona todos os campos da tabela de artigos, 
    // incluindo um campo slug calculado.
    $query = $articlesTable->find();
    $query
        ->select(['slug' => $query->func()->concat(['title' => 'identifier', '-', 'id' => 'identifier'])])
        ->select($articlesTable); // Select all fields from articles

.. versionadded:: 3.1
    Passar um objeto de tabela para select () foi adicionado em 3.1.

Se você desejar selecionar todos os campos, exceto alguns, em uma tabela, pode usar ``selectAllExcept()``::

    $query = $articlesTable->find();

    // Obtenha todos os campos, exceto o campo publicado.
    $query->selectAllExcept($articlesTable, ['published']);

Você também pode passar um objeto ``Association`` ao trabalhar com associações embutidas.

.. versionadded:: 3.6.0
    O método ``selectAllExcept()`` foi adicionado.

.. _using-sql-functions:

Usando Funções SQL
------------------

O ORM do CakePHP oferece abstração para algumas funções SQL comumente usadas. O 
uso da abstração permite que o ORM selecione a implementação específica da 
plataforma da função desejada. Por exemplo, ``concat`` é implementado de maneira 
diferente no MySQL, PostgreSQL e SQL Server. O uso da abstração permite que seu 
código seja portátil::

    // Resultados em SELECT COUNT(*) count FROM...
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

Várias funções comumente usadas podem ser criadas com o método ``func()``:

``rand()``
    Gere um valor aleatório entre 0 e 1 via SQL.
``sum()``
    Calcular uma soma. `Assume que argumentos são valores literais.`
``avg()``
    Calcule uma média. `Assume que argumentos são valores literais.`
``min()``
    Calcule o mínimo de uma coluna. `Assume que argumentos são valores literais.`
``max()``
    Calcule o máximo de uma coluna. `Assume que argumentos são valores literais.`
``count()``
    Calcule a contagem. `Assume que argumentos são valores literais.`
``concat()``
    Concatene dois valores juntos. `Assume que os argumentos são parâmetros vinculados.`
``coalesce()``
    Agrupar valores. `Assume que os argumentos são parâmetros vinculados.`
``dateDiff()``
    Obtenha a diferença entre duas datas/horas. `Assume que os argumentos são parâmetros vinculados.`
``now()``
    O padrão é retornar data e hora, mas aceita 'time' ou 'date' para retornar apenas 
    esses valores.
``extract()``
    Retorna a parte da data especificada da expressão SQL.
``dateAdd()``
    Adicione a unidade de tempo à expressão de data.
``dayOfWeek()``
    Retorna uma FunctionExpression representando uma chamada para a função SQL WEEKDAY.

.. versionadded:: 3.1

    Os métodos ``extract()``, ``dateAdd()`` e ``dayOfWeek()`` foram adicionados.

.. versionadded:: 3.7

    ``rand()`` foi adicionado.

Argumentos de Função
^^^^^^^^^^^^^^^^^^^^

Funções SQL chamadas através de ``func()`` podem aceitar identificadores 
SQL, valores literais, parâmetros vinculados ou outras instâncias ``ExpressionInterface`` 
como argumentos::

    $query = $articles->find()->innerJoinWith('Categories');
    $concat = $query->func()->concat([
        'Articles.title' => 'identifier',
        ' - CAT: ',
        'Categories.name' => 'identifier',
        ' - Age: ',
        $query->func()->dateDiff(
            'NOW()' => 'literal',
            'Articles.created' => 'identifier'
        )
    ]);
    $query->select(['link_title' => $concat]);

Os argumentos ``literal`` e ``identifier`` permitem que você faça referência a outras 
colunas e literais SQL enquanto ``identifier`` será adequadamente citado se a citação 
automática estiver ativada. Se não marcado como literal ou identificador, os argumentos 
serão parâmetros vinculados, permitindo que você passe com segurança os dados do usuário 
para a função.

O exemplo acima gera algo parecido com isto no MYSQL.

.. code-block:: mysql

    SELECT CONCAT(
        Articles.title,
        :c0,
        Categories.name,
        :c1,
        (DATEDIFF(NOW(), Articles.created))
    ) FROM articles;

O argumento ``:c0`` terá o texto ``' - CAT:'`` quando a consulta for 
executada. A expressão ``dateDiff`` foi traduzida para o SQL apropriado.

Funções Customizadas
^^^^^^^^^^^^^^^^^^^^

Se ``func()`` ainda não envolver a função SQL que você precisa, você poderá 
chamá-la diretamente através de ``func()`` e ainda assim passar com segurança 
argumentos e dados do usuário, conforme descrito. Certifique-se de passar o tipo 
de argumento apropriado para funções personalizadas ou elas serão tratadas como 
parâmetros associados::

    $query = $articles->find();
    $year = $query->func()->year([
        'created' => 'identifier'
    ]);
    $time = $query->func()->date_format([
        'created' => 'identifier',
        "'%H:%i'" => 'literal'
    ]);
    $query->select([
        'yearCreated' => $year,
        'timeCreated' => $time
    ]);

Essa função personalizada geraria algo parecido com isto no MYSQL:

.. code-block:: mysql

    SELECT YEAR(created) as yearCreated,
           DATE_FORMAT(created, '%H:%i') as timeCreated
    FROM articles;

.. note::
    Use ``func()`` para passar dados não confiáveis do usuário para qualquer função SQL.

Agregadores - Group e Having
----------------------------

When using aggregate functions like ``count`` and ``sum`` you may want to use
``group by`` and ``having`` clauses::

    $query = $articles->find();
    $query->select([
        'count' => $query->func()->count('view_count'),
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Case statements
---------------

The ORM also offers the SQL ``case`` expression. The ``case`` expression allows
for implementing ``if ... then ... else`` logic inside your SQL. This can be useful
for reporting on data where you need to conditionally sum or count data, or where you
need to specific data based on a condition.

If we wished to know how many published articles are in our database, we could use the following SQL:

.. code-block:: sql

    SELECT
    COUNT(CASE WHEN published = 'Y' THEN 1 END) AS number_published,
    COUNT(CASE WHEN published = 'N' THEN 1 END) AS number_unpublished
    FROM articles

To do this with the query builder, we'd use the following code::

    $query = $articles->find();
    $publishedCase = $query->newExpr()
        ->addCase(
            $query->newExpr()->add(['published' => 'Y']),
            1,
            'integer'
        );
    $unpublishedCase = $query->newExpr()
        ->addCase(
            $query->newExpr()->add(['published' => 'N']),
            1,
            'integer'
        );

    $query->select([
        'number_published' => $query->func()->count($publishedCase),
        'number_unpublished' => $query->func()->count($unpublishedCase)
    ]);

The ``addCase`` function can also chain together multiple statements to create
``if .. then .. [elseif .. then .. ] [ .. else ]`` logic inside your SQL.

If we wanted to classify cities into SMALL, MEDIUM, or LARGE based on population
size, we could do the following::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->lt('population', 100000),
                    $q->newExpr()->between('population', 100000, 999000),
                    $q->newExpr()->gte('population', 999001),
                ],
                ['SMALL',  'MEDIUM', 'LARGE'], # values matching conditions
                ['string', 'string', 'string'] # type of each value
            );
        });
    # WHERE CASE
    #   WHEN population < 100000 THEN 'SMALL'
    #   WHEN population BETWEEN 100000 AND 999000 THEN 'MEDIUM'
    #   WHEN population >= 999001 THEN 'LARGE'
    #   END

Any time there are fewer case conditions than values, ``addCase`` will
automatically produce an ``if .. then .. else`` statement::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->addCase(
                [
                    $q->newExpr()->eq('population', 0),
                ],
                ['DESERTED', 'INHABITED'], # values matching conditions
                ['string', 'string'] # type of each value
            );
        });
    # WHERE CASE
    #   WHEN population = 0 THEN 'DESERTED' ELSE 'INHABITED' END

Getting Arrays Instead of Entities
----------------------------------

While ORMs and object result sets are powerful, creating entities is sometimes
unnecessary. For example, when accessing aggregated data, building an Entity may
not make sense. The process of converting the database results to entities is
called hydration. If you wish to disable this process you can do this::

    $query = $articles->find();
    $query->enableHydration(false); // Results as arrays instead of entities
    $result = $query->toList(); // Execute the query and return the array

After executing those lines, your result should look similar to this::

    [
        ['id' => 1, 'title' => 'First Article', 'body' => 'Article 1 body' ...],
        ['id' => 2, 'title' => 'Second Article', 'body' => 'Article 2 body' ...],
        ...
    ]

.. _format-results:

Adding Calculated Fields
------------------------

After your queries, you may need to do some post-processing. If you need to add
a few calculated fields or derived data, you can use the ``formatResults()``
method. This is a lightweight way to map over the result sets. If you need more
control over the process, or want to reduce results you should use
the :ref:`Map/Reduce <map-reduce>` feature instead. If you were querying a list
of people, you could calculate their age with a result formatter::

    // Assuming we have built the fields, conditions and containments.
    $query->formatResults(function (\Cake\Collection\CollectionInterface $results) {
        return $results->map(function ($row) {
            $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
            return $row;
        });
    });

As you can see in the example above, formatting callbacks will get a
``ResultSetDecorator`` as their first argument. The second argument will be
the Query instance the formatter was attached to. The ``$results`` argument can
be traversed and modified as necessary.

Result formatters are required to return an iterator object, which will be used
as the return value for the query. Formatter functions are applied after all the
Map/Reduce routines have been executed. Result formatters can be applied from
within contained associations as well. CakePHP will ensure that your formatters
are properly scoped. For example, doing the following would work as you may
expect::

    // In a method in the Articles table
    $query->contain(['Authors' => function ($q) {
        return $q->formatResults(function (\Cake\Collection\CollectionInterface $authors) {
            return $authors->map(function ($author) {
                $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
                return $author;
            });
        });
    }]);

    // Get results
    $results = $query->all();

    // Outputs 29
    echo $results->first()->author->age;

As seen above, the formatters attached to associated query builders are scoped
to operate only on the data in the association. CakePHP will ensure that
computed values are inserted into the correct entity.

.. _advanced-query-conditions:

Advanced Conditions
===================

The query builder makes it simple to build complex ``where`` clauses.
Grouped conditions can be expressed by providing combining ``where()`` and
expression objects. For simple queries, you can build conditions using
an array of conditions::

    $query = $articles->find()
        ->where([
            'author_id' => 3,
            'OR' => [['view_count' => 2], ['view_count' => 3]],
        ]);

The above would generate SQL like::

    SELECT * FROM articles WHERE author_id = 3 AND (view_count = 2 OR view_count = 3)

If you'd prefer to avoid deeply nested arrays, you can use the callback form of
``where()`` to build your queries. The callback form allows you to use the
expression builder to build more complex conditions without arrays. For example::

    $query = $articles->find()->where(function ($exp, $query) {
        // Use add() to add multiple conditions for the same field.
        $author = $query->newExpr()->or_(['author_id' => 3])->add(['author_id' => 2]);
        $published = $query->newExpr()->and_(['published' => true, 'view_count' => 10]);

        return $exp->or_([
            'promoted' => true,
            $query->newExpr()->and_([$author, $published])
        ]);
    });

The above generates SQL similar to:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
        (
            (author_id = 2 OR author_id = 3)
            AND
            (published = 1 AND view_count > 10)
        )
        OR promoted = 1
    )

The expression object that is passed into ``where()`` functions has two kinds of
methods. The first type of methods are **combinators**. The ``and_()`` and
``or_()`` methods create new expression objects that change **how** conditions
are combined. The second type of methods are **conditions**. Conditions are
added into an expression where they are combined with the current combinator.

For example, calling ``$exp->and_(...)`` will create a new ``Expression`` object
that combines all conditions it contains with ``AND``. While ``$exp->or_()``
will create a new ``Expression`` object that combines all conditions added to it
with ``OR``. An example of adding conditions with an ``Expression`` object would
be::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            return $exp
                ->eq('author_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('view_count', 10);
        });

Since we started off using ``where()``, we don't need to call ``and_()``, as
that happens implicitly. The above shows a few new condition
methods being combined with ``AND``. The resulting SQL would look like:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10)

.. deprecated:: 3.5.0
    As of 3.5.0 the ``orWhere()`` method is deprecated. This method creates
    hard to predict SQL based on the current query state.
    Use ``where()`` instead as it has more predictable and easier
    to understand behavior.

However, if we wanted to use both ``AND`` & ``OR`` conditions we could do the
following::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->add($orConditions)
                ->eq('published', true)
                ->gte('view_count', 10);
        });

Which would generate the SQL similar to:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
    (author_id = 2 OR author_id = 5)
    AND published = 1
    AND view_count >= 10)

The ``or_()`` and ``and_()`` methods also allow you to use functions as their
parameters. This is often easier to read than method chaining::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or_(function ($or) {
                return $or->eq('author_id', 2)
                    ->eq('author_id', 5);
            });
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

You can negate sub-expressions using ``not()``::

    $query = $articles->find()
        ->where(function (QueryExpression $exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

Which will generate the following SQL looking like:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
    NOT (author_id = 2 OR author_id = 5)
    AND view_count <= 10)

It is also possible to build expressions using SQL functions::

    $query = $articles->find()
        ->where(function (QueryExpression $exp, Query $q) {
            $year = $q->func()->year([
                'created' => 'identifier'
            ]);
            return $exp
                ->gte($year, 2014)
                ->eq('published', true);
        });

Which will generate the following SQL looking like:

.. code-block:: sql

    SELECT *
    FROM articles
    WHERE (
    YEAR(created) >= 2014
    AND published = 1
    )

When using the expression objects you can use the following methods to create
conditions:

- ``eq()`` Creates an equality condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->eq('population', '10000');
        });
    # WHERE population = 10000

- ``notEq()`` Creates an inequality condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notEq('population', '10000');
        });
    # WHERE population != 10000

- ``like()`` Creates a condition using the ``LIKE`` operator::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->like('name', '%A%');
        });
    # WHERE name LIKE "%A%"

- ``notLike()`` Creates a negated ``LIKE`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notLike('name', '%A%');
        });
    # WHERE name NOT LIKE "%A%"

- ``in()`` Create a condition using ``IN``::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->in('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id IN ('AFG', 'USA', 'EST')

- ``notIn()`` Create a negated condition using ``IN``::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->notIn('country_id', ['AFG', 'USA', 'EST']);
        });
    # WHERE country_id NOT IN ('AFG', 'USA', 'EST')

- ``gt()`` Create a ``>`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->gt('population', '10000');
        });
    # WHERE population > 10000

- ``gte()`` Create a ``>=`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->gte('population', '10000');
        });
    # WHERE population >= 10000

- ``lt()`` Create a ``<`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->lt('population', '10000');
        });
    # WHERE population < 10000

- ``lte()`` Create a ``<=`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->lte('population', '10000');
        });
    # WHERE population <= 10000

- ``isNull()`` Create an ``IS NULL`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->isNull('population');
        });
    # WHERE (population) IS NULL

- ``isNotNull()`` Create a negated ``IS NULL`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->isNotNull('population');
        });
    # WHERE (population) IS NOT NULL

- ``between()`` Create a ``BETWEEN`` condition::

    $query = $cities->find()
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->between('population', 999, 5000000);
        });
    # WHERE population BETWEEN 999 AND 5000000,

- ``exists()`` Create a condition using ``EXISTS``::

    $subquery = $cities->find()
        ->select(['id'])
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->equalFields('countries.id', 'cities.country_id');
        })
        ->andWhere(['population >' => 5000000]);

    $query = $countries->find()
        ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
            return $exp->exists($subquery);
        });
    # WHERE EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)

- ``notExists()`` Create a negated condition using ``EXISTS``::

    $subquery = $cities->find()
        ->select(['id'])
        ->where(function (QueryExpression $exp, Query $q) {
            return $exp->equalFields('countries.id', 'cities.country_id');
        })
        ->andWhere(['population >' => 5000000]);

    $query = $countries->find()
        ->where(function (QueryExpression $exp, Query $q) use ($subquery) {
            return $exp->notExists($subquery);
        });
    # WHERE NOT EXISTS (SELECT id FROM cities WHERE countries.id = cities.country_id AND population > 5000000)

In situations when you can't get, or don't want to use the builder methods to
create the conditions you want you can also use snippets of SQL in where
clauses::

    // Compare two fields to each other
    $query->where(['Categories.parent_id != Parents.id']);

.. warning::

    The field names used in expressions, and SQL snippets should **never**
    contain untrusted content.  See the :ref:`using-sql-functions` section for
    how to safely include unsafe data into function calls.

Using Identifiers in Expressions
--------------------------------

When you need to reference a column or SQL identifier in your queries you can
use the ``identifier()`` method::

    $query = $countries->find();
    $query->select([
            'year' => $query->func()->year([$query->identifier('created')])
        ])
        ->where(function ($exp, $query) {
            return $exp->gt('population', 100000);
        });

.. warning::

    To prevent SQL injections, Identifier expressions should never have
    untrusted data passed into them.

.. versionadded:: 3.6.0

    ``Query::identifier()`` was added in 3.6.0

Automatically Creating IN Clauses
---------------------------------

When building queries using the ORM, you will generally not have to indicate the
data types of the columns you are interacting with, as CakePHP can infer the
types based on the schema data. If in your queries you'd like CakePHP to
automatically convert equality to ``IN`` comparisons, you'll need to indicate
the column data type::

    $query = $articles->find()
        ->where(['id' => $ids], ['id' => 'integer[]']);

    // Or include IN to automatically cast to an array.
    $query = $articles->find()
        ->where(['id IN' => $ids]);

The above will automatically create ``id IN (...)`` instead of ``id = ?``. This
can be useful when you do not know whether you will get a scalar or array of
parameters. The ``[]`` suffix on any data type name indicates to the query
builder that you want the data handled as an array. If the data is not an array,
it will first be cast to an array. After that, each value in the array will
be cast using the :ref:`type system <database-data-types>`. This works with
complex types as well. For example, you could take a list of DateTime objects
using::

    $query = $articles->find()
        ->where(['post_date' => $dates], ['post_date' => 'date[]']);

Automatic IS NULL Creation
--------------------------

When a condition value is expected to be ``null`` or any other value, you can
use the ``IS`` operator to automatically create the correct expression::

    $query = $categories->find()
        ->where(['parent_id IS' => $parentId]);

The above will create ``parent_id` = :c1`` or ``parent_id IS NULL`` depending on
the type of ``$parentId``

Automatic IS NOT NULL Creation
------------------------------

When a condition value is expected not to be ``null`` or any other value, you
can use the ``IS NOT`` operator to automatically create the correct expression::

    $query = $categories->find()
        ->where(['parent_id IS NOT' => $parentId]);

The above will create ``parent_id` != :c1`` or ``parent_id IS NOT NULL``
depending on the type of ``$parentId``


Raw Expressions
---------------

When you cannot construct the SQL you need using the query builder, you can use
expression objects to add snippets of SQL to your queries::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['two' => $expr]);

``Expression`` objects can be used with any query builder methods like
``where()``, ``limit()``, ``group()``, ``select()`` and many other methods.

.. warning::

    Using expression objects leaves you vulnerable to SQL injection. You should
    never use untrusted data into expressions.

Getting Results
===============

Once you've made your query, you'll want to retrieve rows from it. There are
a few ways of doing this::

    // Iterate the query
    foreach ($query as $row) {
        // Do stuff.
    }

    // Get the results
    $results = $query->all();

You can use :doc:`any of the collection </core-libraries/collections>` methods
on your query objects to pre-process or transform the results::

    // Use one of the collection methods.
    $ids = $query->map(function ($row) {
        return $row->id;
    });

    $maxAge = $query->max(function ($max) {
        return $max->age;
    });

You can use ``first`` or ``firstOrFail`` to retrieve a single record. These
methods will alter the query adding a ``LIMIT 1`` clause::

    // Get just the first row
    $row = $query->first();

    // Get the first row or an exception.
    $row = $query->firstOrFail();

.. _query-count:

Returning the Total Count of Records
------------------------------------

Using a single query object, it is possible to obtain the total number of rows
found for a set of conditions::

    $total = $articles->find()->where(['is_active' => true])->count();

The ``count()`` method will ignore the ``limit``, ``offset`` and ``page``
clauses, thus the following will return the same result::

    $total = $articles->find()->where(['is_active' => true])->limit(10)->count();

This is useful when you need to know the total result set size in advance,
without having to construct another ``Query`` object. Likewise, all result
formatting and map-reduce routines are ignored when using the ``count()``
method.

Moreover, it is possible to return the total count for a query containing group
by clauses without having to rewrite the query in any way. For example, consider
this query for retrieving article ids and their comments count::

    $query = $articles->find();
    $query->select(['Articles.id', $query->func()->count('Comments.id')])
        ->matching('Comments')
        ->group(['Articles.id']);
    $total = $query->count();

After counting, the query can still be used for fetching the associated
records::

    $list = $query->all();

Sometimes, you may want to provide an alternate method for counting the total
records of a query. One common use case for this is providing
a cached value or an estimate of the total rows, or to alter the query to remove
expensive unneeded parts such as left joins. This becomes particularly handy
when using the CakePHP built-in pagination system which calls the ``count()``
method::

    $query = $query->where(['is_active' => true])->counter(function ($query) {
        return 100000;
    });
    $query->count(); // Returns 100000

In the example above, when the pagination component calls the count method, it
will receive the estimated hard-coded number of rows.

.. _caching-query-results:

Caching Loaded Results
----------------------

When fetching entities that don't change often you may want to cache the
results. The ``Query`` class makes this simple::

    $query->cache('recent_articles');

Will enable caching on the query's result set. If only one argument is provided
to ``cache()`` then the 'default' cache configuration will be used. You can
control which caching configuration is used with the second parameter::

    // String config name.
    $query->cache('recent_articles', 'dbResults');

    // Instance of CacheEngine
    $query->cache('recent_articles', $memcache);

In addition to supporting static keys, the ``cache()`` method accepts a function
to generate the key. The function you give it will receive the query as an
argument. You can then read aspects of the query to dynamically generate the
cache key::

    // Generate a key based on a simple checksum
    // of the query's where clause
    $query->cache(function ($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

The cache method makes it simple to add cached results to your custom finders or
through event listeners.

When the results for a cached query are fetched the following happens:

1. The ``Model.beforeFind`` event is triggered.
2. If the query has results set, those will be returned.
3. The cache key will be resolved and cache data will be read. If the cache data
   is not empty, those results will be returned.
4. If the cache misses, the query will be executed and a new ``ResultSet`` will be
   created. This ``ResultSet`` will be written to the cache and returned.

.. note::

    You cannot cache a streaming query result.

Loading Associations
====================

The builder can help you retrieve data from multiple tables at the same time
with the minimum amount of queries possible. To be able to fetch associated
data, you first need to setup associations between the tables as described in
the :doc:`/orm/associations` section. This technique of combining queries
to fetch associated data from other tables is called **eager loading**.

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-contain
    :end-before: end-contain

Filtering by Associated Data
----------------------------

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-filtering
    :end-before: end-filtering

.. _adding-joins:

Adding Joins
------------

In addition to loading related data with ``contain()``, you can also add
additional joins with the query builder::

    $query = $articles->find()
        ->join([
            'table' => 'comments',
            'alias' => 'c',
            'type' => 'LEFT',
            'conditions' => 'c.article_id = articles.id',
        ]);

You can append multiple joins at the same time by passing an associative array
with multiple joins::

    $query = $articles->find()
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

As seen above, when adding joins the alias can be the outer array key. Join
conditions can also be expressed as an array of conditions::

    $query = $articles->find()
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
        ], ['c.created' => 'datetime', 'c.moderated' => 'boolean']);

When creating joins by hand and using array based conditions, you need to
provide the datatypes for each column in the join conditions. By providing
datatypes for the join conditions, the ORM can correctly convert data types into
SQL. In addition to ``join()`` you can use ``rightJoin()``, ``leftJoin()`` and
``innerJoin()`` to create joins::

    // Join with an alias and string conditions
    $query = $articles->find();
    $query->leftJoin(
        ['Authors' => 'authors'],
        ['Authors.id = Articles.author_id']);

    // Join with an alias, array conditions, and types
    $query = $articles->find();
    $query->innerJoin(
        ['Authors' => 'authors'],
        [
        'Authors.promoted' => true,
        'Authors.created' => new DateTime('-5 days'),
        'Authors.id = Articles.author_id'
        ],
        ['Authors.promoted' => 'boolean', 'Authors.created' => 'datetime']);

It should be noted that if you set the ``quoteIdentifiers`` option to ``true`` when
defining your ``Connection``, join conditions between table fields should be set as follow::

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

This ensures that all of your identifiers will be quoted across the Query, avoiding errors with
some database Drivers (PostgreSQL notably)

Inserting Data
==============

Unlike earlier examples, you should not use ``find()`` to create insert queries.
Instead, create a new ``Query`` object using ``query()``::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->execute();

To insert multiple rows with only one query, you can chain the ``values()``
method as many times as you need::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->values([
            'title' => 'Second post',
            'body' => 'Another body text'
        ])
        ->execute();

Generally, it is easier to insert data using entities and
:php:meth:`~Cake\\ORM\\Table::save()`. By composing a ``SELECT`` and
``INSERT`` query together, you can create ``INSERT INTO ... SELECT`` style
queries::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['title', 'body', 'published'])
        ->values($select)
        ->execute();

.. note::
    Inserting records with the query builder will not trigger events such as
    ``Model.afterSave``. Instead you should use the :doc:`ORM to save
    data </orm/saving-data>`.

.. _query-builder-updating-data:

Updating Data
=============

As with insert queries, you should not use ``find()`` to create update queries.
Instead, create new a ``Query`` object using ``query()``::

    $query = $articles->query();
    $query->update()
        ->set(['published' => true])
        ->where(['id' => $id])
        ->execute();

Generally, it is easier to update data using entities and
:php:meth:`~Cake\\ORM\\Table::patchEntity()`.

.. note::
    Updating records with the query builder will not trigger events such as
    ``Model.afterSave``. Instead you should use the :doc:`ORM to save
    data </orm/saving-data>`.

Deleting Data
=============

As with insert queries, you should not use ``find()`` to create delete queries.
Instead, create new a query object using ``query()``::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

Generally, it is easier to delete data using entities and
:php:meth:`~Cake\\ORM\\Table::delete()`.

SQL Injection Prevention
========================

While the ORM and database abstraction layers prevent most SQL injections
issues, it is still possible to leave yourself vulnerable through improper use.

When using condition arrays, the key/left-hand side as well as single value
entries must not contain user data::

    $query->where([
        // Data on the key/left-hand side is unsafe, as it will be
        // inserted into the generated query as-is
        $userData => $value,

        // The same applies to single value entries, they are not
        // safe to use with user data in any form
        $userData,
        "MATCH (comment) AGAINST ($userData)",
        'created < NOW() - ' . $userData
    ]);

When using the expression builder, column names must not contain user data::

    $query->where(function (QueryExpression $exp) use ($userData, $values) {
        // Column names in all expressions are not safe.
        return $exp->in($userData, $values);
    });

When building function expressions, function names should never contain user
data::

    // Not safe.
    $query->func()->{$userData}($arg1);

    // Also not safe to use an array of
    // user data in a function expression
    $query->func()->coalesce($userData);

Raw expressions are never safe::

    $expr = $query->newExpr()->add($userData);
    $query->select(['two' => $expr]);

Binding values
--------------

It is possible to protect against many unsafe situations by using bindings.
Similar to :ref:`binding values to prepared statements <database-basics-binding-values>`,
values can be bound to queries using the :php:meth:`Cake\\Database\\Query::bind()`
method.

The following example would be a safe variant of the unsafe, SQL injection prone
example given above::

    $query
        ->where([
            'MATCH (comment) AGAINST (:userData)',
            'created < NOW() - :moreUserData'
        ])
        ->bind(':userData', $userData, 'string')
        ->bind(':moreUserData', $moreUserData, 'datetime');

.. note::

    Unlike :php:meth:`Cake\\Database\\StatementInterface::bindValue()`,
    ``Query::bind()`` requires to pass the named placeholders including the
    colon!

More Complex Queries
====================

The query builder is capable of building complex queries like ``UNION`` queries
and sub-queries.

Unions
------

Unions are created by composing one or more select queries together::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

You can create ``UNION ALL`` queries using the ``unionAll()`` method::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

Subqueries
----------

Subqueries are a powerful feature in relational databases and building them in
CakePHP is fairly intuitive. By composing queries together, you can make
subqueries::

    // Prior to 3.6.0 use association() instead.
    $matchingComment = $articles->getAssociation('Comments')->find()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id IN' => $matchingComment]);

Subqueries are accepted anywhere a query expression can be used. For example, in
the ``select()`` and ``join()`` methods.

Adding Locking Statements
-------------------------

Most relational database vendors support taking out locks when doing select
operations. You can use the ``epilog()`` method for this::

    // In MySQL
    $query->epilog('FOR UPDATE');

The ``epilog()`` method allows you to append raw SQL to the end of queries. You
should never put raw user data into ``epilog()``.

Executing Complex Queries
-------------------------

While the query builder makes it easy to build most queries, very complex
queries can be tedious and complicated to build. You may want to :ref:`execute
the desired SQL directly <running-select-statements>`.

Executing SQL directly allows you to fine tune the query that will be run.
However, doing so doesn't let you use ``contain`` or other higher level ORM
features.
