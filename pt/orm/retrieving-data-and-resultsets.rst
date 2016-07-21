Retornando dados e conjuntos de resultados
##########################################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Quando executar uma query, você obterá um objeto Entidade. Nesta sessão
discutiremos diferentes caminhos para se obter: entidades, carregar informações
relacionais, abstratas, ou complexo relacional. Você poderá ler mais sobre
:doc:`/orm/entities` ( ‘Entity’ em inglês ).

Depurando Queries e Resultados
==============================

Quando o ORM foi implementado, era muito difícil depurar os resultados obtidos
nas versões anteriores do CakePHP. Agora existem muitas formas fáceis de
inspecionar os dados retornados pelo ORM.

- ``debug($query)`` Mostra o SQL e os parâmetros incluídos, não mostra resultados.
- ``debug($query->all())`` Mostra a propriedade ResultSet retornado pelo ORM.
- ``debug($query->toArray())`` Um caminho mais fácil para mostrar todos os resultados.
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` Exemplo em JSON.
- ``debug($query->first())`` Primeiro resultado obtido na query.
- ``debug((string)$query->first())`` Mostra as propriedades de uma única entidade em JSON.

Tente isto na camada Controller: debug( $this->{EntidadeNome}->find()->all() );

Pegando uma entidade com a chave primária
=========================================

.. php:method:: get($id, $options = [])

Sempre que é necessário editar ou visualizar uma entidade ou dados relacionais
você pode usar ``get()``::

    // No controller ou table tente isto.

    // Retorna um único artigo pelo id primário.
    $article = $articles->get($id);

    // Retorna um artigo com seus comentários
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

Quando não conseguir obter um resultado
``Cake\Datasource\Exception\RecordNotFoundException`` será disparado. Você
poderá tratar esta exceção, ou converter num erro 404.

O metódo ``find()`` usa uma cache integrado. Você pode uma a opção ``cache``
quando chamar ``get()`` para uma performance na leitura - ``caching``::

    // No controller ou table tente isto.

    // Use uma configuração de cache ou uma instância do CacheEngine do Cake com uma ID gerada.
    $article = $articles->get($id, [
        'cache' => 'custom',
    ]);

    // mykey reserva uma id especifica para determinado cache de resultados.
    $article = $articles->get($id, [
        'cache' => 'custom', 'key' => 'mykey'
    ]);

    // Desabilitando cache explicitamente
    $article = $articles->get($id, [
        'cache' => false
    ]);




``Por padrão o CakePHP possui um sistema interno de cache que viabiliza busca
e aumenta a performance - não recomendado desabilatar.``

Opcionalmente você pode usar ``get()`` nas entidades com busca customizavél
:ref:`custom-find-methods`. Por exemplo, você pode querer pegar todas as
traduções de uma entidade. Poderá usar a opção ``finder``::

    $article = $articles->get($id, [
        'finder' => 'translations',
    ]);

Usando ``'find()'`` para carregar dados
=======================================

.. php:method:: find($type, $options = [])

Agora que você sabe e pode trabalhar com entidades, Precisará carrega las
e gostará muito como fazer isso. O caminho mais simples para carregar uma
Entidade ou objetos relacionais metódo ``find()``. find provê um extensivél
e facíl caminho para procurar e retornar dados, talves você se interesse por
in::

    // No controller ou table.

    // Procure todos os artigos
    $query = $articles->find('all');

O valor retornado por qualquer metódo ``find()`` será sempre um
:php:class:`Cake\\ORM\\Query` objeto. A class Query assim permitindo que possa
posteriormente refinar a consulta depois de cria lá. Objeto Query não será
executado até que inicie um busca por linhas, seja convertido num array, ou
chamado outro metódo, exemplo: ``all()``::

    // No controller ou table.

    // Retorne todos os artigos
    // Até este ponto, nada acontece.
    $query = $articles->find('all');

    // Uma iteração executa a consulta
    foreach ($query as $row) {
    }

    // Chamando all() executa a consulta.
    // e retorna os conjuntos de resultados.
    $results = $query->all();

    // Linhas são retornadas em forma de array
    $data = $results->toArray();

    // Armazenando a consulta num array
    $results = $query->toArray();

.. note::

    Você já sabe executar uma consulta, gostará de :doc:`/orm/query-builder`
    para implementar e construir consultas otimizadas ou complexas, adicionando condições específica,
    limites, incluíndo associação ou uma interface mais fluênte, ou busca de resultados por id de usuário lógado.

::

    // No controller ou table.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

Não se limite, poderá ir muito além com  ``find()``. Isto o ajuda com metódos simulados::

    // No controller ou table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);
    //Ao buscar todos os artigos, retorne somente artigos com data de hoje - 10 dias atrás
    //Depois junto com esses artigos me retorne também seus autores e comentários inclusos.

Opções suportadas por find() são:

- ``conditions`` provê acesso direto na cláusula Where.
- ``limit`` Limite o número de resultados.
- ``offset`` Uma página que você quer. Use ``page`` para cálculo simplificado.
- ``contain`` defina uma associação para carregar.
- ``fields`` Quais campos você deseja carregar somente? Quando carregar somente alguns campos o lembre-se dos plugins, callbacks.
- ``group`` adicione um GROUP BY. muito usado para funçoes agregadas.
- ``having`` adicionar HVAING.
- ``join`` Defina um Join específico.
- ``order`` Ordenar resultados por.

Outras opções fora dessa lista, serão passadas para o beforeFind ou outras funções de tratamento,
onde podem ser usados para tratar a consulta a sua maneira. Pode usar o metódo
``getOptions()`` no objeto para retornar as opções utilizadas. Quando uma consulta for passada para o controller, recomendamos uma leitura
sobre consultas personalizadas em :ref:`custom-find-methods`. Usando metódos de consultas personalizados, você terá um melhor reuso de seu código, e ficará fácil para testar a sua maneira.

Por padrão consultas retornam :doc:`/orm/entities` objeto. Você pode retorna array basico usando
hydration::

    $query->hydrate(false);

    // $data is ResultSet that contains array data.
    $data = $query->all();

.. _table-find-first:

Primeiro Resultado
==================

O metódo  ``first()`` permite pegar apenas o primeiro resultado da consulta. Caso não seja bem executado
a cláusula ``LIMIT 1`` será aplicada::

    // No controller ou table.
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();
    //Ex: Retorne todos os artigos, mais quero somente o primeiro.

Uma abordagem diferente ``find('first')`` da versão anterior do CakePHP. Você também pode
usar o metódo ``get()`` caso queira carregar uma entidade pelo chave primária.

.. note::

    O metódo ``first()`` retorna ``null`` caso nenhum resultado seja encontrado.

Contando os resultados
======================

Criando uma consulta você gosta do metódo ``count()`` para retornar a quantidade de resultados encontrado::

    // No controller ou table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();
    //Retorne todos os artigos, me mostre quantos são.

Veja :ref:`query-count` para modos de uso diferentes com o metódo ``count()``.

.. _table-find-list:

Encontrando Chaves/Pares de Valores
===================================

Frequentemente precisamos gerar um dados associados em array de nossas aplicações.
Muito usado para criar o elemento ``<select>``.
O Cake provê um metódo simples e fácil 'lists'::

    // No controller ou table.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Os dados organizados :D
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

Com as opções adicionais as chaves de ``$data`` podem representar uma coluna de sua tabela,
Por exemplo, use ``'displayField()'`` no objeto tabela na função 'initialize()', isto configura um valor a ser mostrado na chave::


    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

Quando se chama ``list`` você pode configurar quais campos deseja usar para a chave e valor
passando as opções ``keyField`` e ``valueField`` respectivamente::

    // No controller ou table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // Dados organizados :D
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];
    //slug passa a ser a chave
    // title o valor do option no select

Resultados podem ser agrupados se necessitar. Muito usado quando desejar diferencias Chave/Valores por grupo no elemento ``<optgroup>`` com FormHelper::

    // No controller ou table
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // Dados organizados :D
    $data = [
        1 => [
            'first-post' => 'First post',
            'second-article-i-wrote' => 'Second article I wrote',
        ],
        2 => [
            // More data.
        ]
    ];
    // Temos então os artigos com sua Chave/Valores diferenciados por autores.

Não é complicado, use dados associados e poderá gostar do resultado::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);
    //Retorne uma lista de todos os artigos, o id representará a idenficação do artigo, porém seu valor será o nome do seu Author.
    //Importante, sempre que pesquisar ou informar campos adicionais use o '.' como mostrado em 'valueField'.

Por ultimo, é muito bom quando podemos usar metódos criados em nossas entidades, isto também é possível no metódo 'list'.
. Neste exemplo mostra o uso metódo mutador ``_getFullName()`` criado na entidade Author. ::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => function ($e) {
            return $e->author->get('full_name');
        }
    ]);
    //O valor da chave, representará o nome completo
    //Que usa de uma função para acessar o metódo mutador criado na entidade
    //Onde ao juntar o 1 nome com o 2 formará o nome completo.

Encontrando dados enfileirados
==============================

O metódo ``find('threaded')`` retorna que estarão relacionados por chaves.
Por padrão o Cake usa o campo chave ``parent_id``. Nesse modelo, é possível
encontrar valores no banco de dados adjacentes. Todas as entidades correspondentes recebem um ``parent_id`` e são alocadas no atributo ``children``::

    // No controller ou table.
    $query = $comments->find('threaded');

    // Expandindo os comentários de outros comentários
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();
    // transformando todos os resultados em array.

    echo count($results[0]->children);
    //Para o primeiro resultado, mostra quantos filhos possue ou registros relacionados e co-relacionados.
    echo $results[0]->children[0]->comment;
    //Mostre o comentário relacionado ao primeiro comentário

Um pouco mal explicado pela equipe do Cake, quando buscamos por dados enfileirados podemos ir bem além, até perceber que pode se encaixar perfeitamente em uma carrinho de shopping com seus itens e quantidades co-relacionados. O ``parentField`` e ``keyField`` chaves que serão usadas para encontrar ocorrências.

Será mais interessante quando aprender sobre árvore de dados ao considerar :doc:`/orm/behaviors/tree` posteriormente.

.. _custom-find-methods:

Personalizando Metódos de Consulta
==================================

Mostramos os exemplos de uso do ``all`` e ``list``.
Ficará interessado em saber as inúmeras possibilidades, e que também recomendamos seriamente, que você as implemente.
Um metódo personalizado de busca pode ser ideal para simplificar processos, consultar dados complexos, otimizar buscas, ou criar uma busca padrão em um metódo simplificado feito por você.
Eles podem ser definidos na criação do objeto tabela e devem obedecer a conveção padrão do Cake. Ao criar um metódo deverá iniciar seu nome com ``find`` e logo após adicionar o nome desejado para sua busca personalizada, exemplo: ``find`` e adicionar ``Users`` = ``findUsers``. É de grande ajuda, por exemplo, quando queremos que em uma busca, nossa consulta sempre tenha a condição de que seus resultados sejam de um determinado usuário, ou que em um carrinho tenha sua própria listra agregada, sem precisar encher o controller de códigos e facilitando muito a manutenção no reuso de código.
Neste exemplo mostramos como encontrarmos um artigo quando este estiver publicado somente.::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    //Lembre se, deverá cria-lo no objeto Artigos
    //Ou melhor /src/Model/Table/ArticlesTable.php

    class ArticlesTable extends Table
    {
    	//Nosso metódo personalizado
        public function findOwnedBy(Query $query, array $options)
        {
            $user = $options['user'];
            return $query->where(['author_id' => $user->id]);
        }

    }

    // No controller ou table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('ownedBy', ['user' => $userEntity]);
    //Retorne todos os artigos, quero que seja de meu usuário, porém somente os já publicados.

O metódo traz muita funcionalidade, em alguns casos precisamos definir uma pilha de lógica, isto será possível usando
o atributo ``$options`` para personalização de consulta com lógica irelevante.
Sem esforço você pode expressar algumas consultas complexas. Assumindo que você
tem ambas as buscas 'published' e 'recent', poderia fazer assim::

    // No controller ou table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');
    //Busque todos os artigos, dentre eles encontre os publicados, e retorne somente os recentes.

Nossos exemplos, foram definidos na classe da própria tabela, porém, você pode ver como um behavior o ajudará a automatizar muitos processos e como a reutilização de código é feito no CakePHP
leia mais em :doc:`/orm/behaviors`.

Em uma necessidade de mudar os resultados após uma busca, deve usar
a função :ref:`map-reduce` para isto. Isto substituí o antigo 'afterFind' na versão anterior do Cake. que por sinal trouxe clareza, mais agilidade no processo e menos consumo de memória.

.. _dynamic-finders:

Buscadores dinâmicos
====================

CakePHP's ORM provê uma dinâmica na construção de metódos de busca, onde na chamada do metódo poderá apenas adicionar o nome do campo que desejar buscar.
Por exemplo, se você quer buscar usuários por seu nome gostará de::

    // No controller
    // Duas chamadas iguais.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // Na tabela
    $users = TableRegistry::get('Users');
    // Duas chamadas também iguais.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

Pode usar também multiplos campos na pesquisa::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);
    //Retorne usuários com Joebob e eles devem estar aprovados ou = 1

Use a condição OR expressa::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');
    //Retorne usuário com nome joebob ou que possua o email joe@example.com

Neste caso, ao usar 'OR' ou 'AND' voce não pode combinar os dois em único metódo. Também não será possível associar dados com o atributo ``contain``,
pois não é compatível com buscas dinâmicas. Lembra-se dos nossos queridos :ref:`custom-find-methods` eles podem fazer esse trabalho para você com
consultas complexas. Por ultimos combine suas buscas personalizadas com as dinâmicas::

    $query = $users->findTrollsByUsername('bro');
    // Procure pelos trolls, esses trolls devem username = bro

Abaixo um jeito mais organizado::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

Caso tenha objeto Query retornado da busca dinâmica você necessitará de chamar ``first()`` Se quer o primeiro resultado.

.. note::

    Esses metódos de busca podem ser simples, porém eles trazem uma sobrecargar adicional, pelo fato de ser necessário enteder as expressões.


Retornando Dados Associados
===========================

Quando desejar alguns dados associados ou um filtro baseado nesses dados
associados, terá dois caminhos para atingir seu objetivo:

- use CakePHP ORM query functions like ``contain()`` and ``matching()``
- use join functions like ``innerJoin()``, ``leftJoin()``, and ``rightJoin()``

Use ``contain()`` quando desejar carregar uma entidade e seus dados associados.
``contain()`` aplicará uma condição adicional aos dados relacinados, porém você
não poderá aplicar condições nesses dados baseado nos dados relacionais. Mais
detalhes veja ``contain()`` em :ref:`eager-loading-associations`.

``matching()`` se você deseja aplicar condições na sua entidade baseado nos
dados relacionais, deve usar isto.  Por exemplo, você quer carregar todos os
artigos que tem uma tag específica neles. Mais detalhes veja ``matching()``, em
:ref:`filtering-by-associated-data`.

Caso prefira usar a função join, veja mais informações em `adding-joins`.

.. _eager-loading-associations:

Eager Loading Associations
==========================

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results.

.. start-contain

Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you define eager loaded associations using the 'contain' method::

    // In a controller or table method.

    // As an option to find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // As a method on the query object
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

The above will load the related author and comments for each article in the
result set. You can load nested associations using nested arrays to define the
associations to be loaded::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

Alternatively, you can express nested associations using the dot notation::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

You can eager load associations as deep as you like::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

Passing Conditions to Contain
-----------------------------

When using ``contain()`` you are able to restrict the data returned by the
associations and filter them by conditions::

    // In a controller or table method.

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

This also works for pagination at the Controller level::

    $this->paginate['contain'] = [
        'Comments' => function (\Cake\ORM\Query $query) {
            return $query->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
        }
    ];

.. note::

    When you limit the fields that are fetched from an association, you **must**
    ensure that the foreign key columns are selected. Failing to select foreign
    key fields will cause associated data to not be present in the final result.

It is also possible to restrict deeply-nested associations using the dot
notation::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

If you have defined some custom finder methods in your associated table, you can
use them inside ``contain()``::

    // Bring all articles, but only bring the comments that are approved and
    // popular.
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    For ``BelongsTo`` and ``HasOne`` associations only the ``where`` and
    ``select`` clauses are used when loading the associated records. For the
    rest of the association types you can use every clause that the query object
    provides.

If you need full control over the query that is generated, you can tell ``contain()``
to not append the ``foreignKey`` constraints to the generated query. In that
case you should use an array passing ``foreignKey`` and ``queryBuilder``::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...); // Full conditions for filtering
            }
        ]
    ]);

If you have limited the fields you are loading with ``select()`` but also want to
load fields off of contained associations, you can pass the association object
to ``select()``::

    // Select id & title from articles, but all fields off of Users.
    $query = $articles->find()
        ->select(['id', 'title'])
        ->select($articlesTable->Users)
        ->contain(['Users']);

Alternatively, if you have multiple associations, you can use ``autoFields()``::

    // Select id & title from articles, but all fields off of Users, Comments
    // and Tags.
    $query->select(['id', 'title'])
        ->contain(['Comments', 'Tags'])
        ->autoFields(true)
        ->contain(['Users' => function($q) {
            return $q->autoFields(true);
        }]);

.. versionadded:: 3.1
    Selecting columns via an association object was added in 3.1


Sorting Contained Associations
------------------------------

When loading HasMany and BelongsToMany associations, you can use the ``sort``
option to sort the data in those associations::

    $query->contain([
        'Comments' => [
            'sort' => ['Comment.created' => 'DESC']
        ]
    ]);

.. end-contain

.. _filtering-by-associated-data:

Filtering by Associated Data
----------------------------

.. start-filtering

A fairly common query case with associations is finding records 'matching'
specific associated data. For example if you have 'Articles belongsToMany Tags'
you will probably want to find Articles that have the CakePHP tag. This is
extremely simple to do with the ORM in CakePHP::

    // In a controller or table method.

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

You can apply this strategy to HasMany associations as well. For example if
'Authors HasMany Articles', you could find all the authors with recently
published articles using the following::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

Filtering by deep associations is surprisingly easy, and the syntax should be
already familiar to you::

    // In a controller or table method.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // Bring unique articles that were commented by 'markstory' using passed variable
    // Dotted matching paths should be used over nested matching() calls
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't exclude them already. This might be the case, for
    example, when the same users comments more than once on a single article.

The data from the association that is 'matched' will be available on the
``_matchingData`` property of entities. If you both match and contain the same
association, you can expect to get both the ``_matchingData`` and standard
association properties in your results.

Using innerJoinWith
~~~~~~~~~~~~~~~~~~~

Using the ``matching()`` function, as we saw already, will create an ``INNER
JOIN`` with the specified association and will also load the fields into the
result set.

There may be cases where you want to use ``matching()`` but are not interested
in loading the fields into the result set. For this purpose, you can use
``innerJoinWith()``::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

The ``innerJoinWith()`` method works the same as ``matching()``, that
means that you can use dot notation to join deeply nested
associations::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

Again, the only difference is that no additional columns will be added to the
result set, and no ``_matchingData`` property will be set.

.. versionadded:: 3.1
    Query::innerJoinWith() was added in 3.1

Using notMatching
~~~~~~~~~~~~~~~~~

The opposite of ``matching()`` is ``notMatching()``. This function will change
the query so that it filters results that have no relation to the specified
association::

    // In a controller or table method.

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => 'boring']);
        });

The above example will find all articles that were not tagged with the word
``boring``.  You can apply this method to HasMany associations as well. You could,
for example, find all the authors with no published articles in the last 10
days::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

It is also possible to use this method for filtering out records not matching
deep associations. For example, you could find articles that have not been
commented on by a certain user::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });

Since articles with no comments at all also satisfy the condition above, you may
want to combine ``matching()`` and ``notMatching()`` in the same query. The
following example will find articles having at least one comment, but not
commented by a certain user::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    As ``notMatching()`` will create a ``LEFT JOIN``, you might want to consider
    calling ``distinct`` on the find query as you can get duplicate rows
    otherwise.

Keep in mind that contrary to the ``matching()`` function, ``notMatching()``
will not add any data to the ``_matchingData`` property in the results.

.. versionadded:: 3.1
    Query::notMatching() was added in 3.1

Using leftJoinWith
~~~~~~~~~~~~~~~~~~

On certain occasions you may want to calculate a result based on an association,
without having to load all the records for it. For example, if you wanted to
load the total number of comments an article has along with all the article
data, you can use the ``leftJoinWith()`` function::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->group(['Articles.id'])
        ->autoFields(true);

The results for the above query will contain the article data and the
``total_comments`` property for each of them.

``leftJoinWith()`` can also be used with deeply nested associations. This is
useful, for example, for bringing the count of articles tagged with a certain
word, per author::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'awesome']);
        })
        ->group(['Authors.id'])
        ->autoFields(true);

This function will not load any columns from the specified associations into the
result set.

.. versionadded:: 3.1
    Query::leftJoinWith() was added in 3.1

.. end-filtering

Changing Fetching Strategies
----------------------------

As you may know already, ``belongsTo`` and ``hasOne`` associations are loaded
using a ``JOIN`` in the main finder query. While this improves query and
fetching speed and allows for creating more expressive conditions when
retrieving data, this may be a problem when you want to apply certain clauses to
the finder query for the association, such as ``order()`` or ``limit()``.

For example, if you wanted to get the first comment of an article as an
association::

   $articles->hasOne('FirstComment', [
        'className' => 'Comments',
        'foreignKey' => 'article_id'
   ]);

In order to correctly fetch the data from this association, we will need to tell
the query to use the ``select`` strategy, since we want order by a particular
column::

    $query = $articles->find()->contain([
        'FirstComment' => [
                'strategy' => 'select',
                'queryBuilder' => function ($q) {
                    return $q->order(['FirstComment.created' =>'ASC'])->limit(1);
                }
        ]
    ]);

Dynamically changing the strategy in this way will only apply to a specific
query. If you want to make the strategy change permanent you can do::

    $articles->FirstComment->strategy('select');

Using the ``select`` strategy is also a great way of making associations with
tables in another database, since it would not be possible to fetch records
using ``joins``.

Fetching With The Subquery Strategy
-----------------------------------

As your tables grow in size, fetching associations from them can become
slower, especially if you are querying big batches at once. A good way of
optimizing association loading for ``hasMany`` and ``belongsToMany``
associations is by using the ``subquery`` strategy::

    $query = $articles->find()->contain([
        'Comments' => [
                'strategy' => 'subquery',
                'queryBuilder' => function ($q) {
                    return $q->where(['Comments.approved' => true]);
                }
        ]
    ]);

The result will remain the same as with using the default strategy, but this
can greatly improve the query and fetching time in some databases, in
particular it will allow to fetch big chunks of data at the same time in
databases that limit the amount of bound parameters per query, such as
**Microsoft SQL Server**.

You can also make the strategy permanent for the association by doing::

    $articles->Comments->strategy('subquery');

Lazy Loading Associations
-------------------------

While CakePHP makes it easy to eager load your associations, there may be cases
where you need to lazy-load associations. You should refer to the
`lazy-load-associations` and `loading-additional-associations`
sections for more information.

Working with Result Sets
========================

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries. Like Query objects, ResultSets are
a :doc:`Collection </core-libraries/collections>` and you can use any collection
method on ResultSet objects.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results. If you need work with
a data set that does not fit into memory you can disable buffering on the query
to stream results::

    $query->bufferResults(false);

Turning buffering off has a few caveats:

#. You will not be able to iterate a result set more than once.
#. You will also not be able to iterate & cache the results.
#. Buffering cannot be disabled for queries that eager load hasMany or
   belongsToMany associations, as these association types require eagerly
   loading all results so that dependent queries can be generated. This
   limitation is not present when using the ``subquery`` strategy for those
   associations.

.. warning::

    Streaming results will still allocate memory for the entire results when
    using PostgreSQL and SQL Server. This is due to limitations in PDO.

Result sets allow you to cache/serialize or JSON encode results for API
results::

    // In a controller or table method.
    $results = $query->all();

    // Serialized
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

Both serializing and JSON encoding result sets work as you would expect. The
serialized data can be unserialized into a working result set. Converting to
JSON respects hidden & virtual field settings on all entity objects
within a result set.

In addition to making serialization easy, result sets are a 'Collection' object and
support the same methods that :doc:`collection objects </core-libraries/collections>`
do. For example, you can extract a list of unique tags on a collection of
articles by running::

    // In a controller or table method.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find()->contain(['Tags']);

    $reducer = function ($output, $value) {
        if (!in_array($value, $output)) {
            $output[] = $value;
        }
        return $output;
    };

    $uniqueTags = $query->all()
        ->extract('tags.name')
        ->reduce($reducer, []);

Some other examples of the collection methods being used with result sets are::

    // Filter the rows by a calculated property
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // Create an associative array from result properties
    $articles = TableRegistry::get('Articles');
    $results = $articles->find()->contain(['Authors'])->all();

    $authorList = $results->combine('id', 'author.name');

The :doc:`/core-libraries/collections` chapter has more detail on what can be
done with result sets using the collections features. The `format-results`
section show how you can add calculated fields, or replace the result set.

Getting the First & Last Record From a ResultSet
------------------------------------------------

You can use the ``first()`` and ``last()`` methods to get the respective records
from a result set::

    $result = $articles->find('all')->all();

    // Get the first and/or last result.
    $row = $result->first();
    $row = $result->last();

Getting an Arbitrary Index From a ResultSet
-------------------------------------------

You can use ``skip()`` and ``first()`` to get an arbitrary record from
a ResultSet::

    $result = $articles->find('all')->all();

    // Get the 5th record
    $row = $result->skip(4)->first();

Checking if a Query or ResultSet is Empty
-----------------------------------------

You can use the ``isEmpty()`` method on a Query or ResultSet object to see if it
has any rows in it. Calling ``isEmpty()`` on a Query object will evaluate the
query::

    // Check a query.
    $query->isEmpty();

    // Check results
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

Loading Additional Associations
-------------------------------

Once you've created a result set, you may need to load
additional associations. This is the perfect time to lazily eager load data. You
can load additional associations using ``loadInto()``::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

You can eager load additional data into a single entity, or a collection of
entities.

.. versionadded: 3.1
    Table::loadInto() was added in 3.1

.. _map-reduce:

Modifying Results with Map/Reduce
=================================

More often than not, find operations require post-processing the data that is
found in the database. While entities' getter methods can take care of most of
the virtual property generation or special data formatting, sometimes you
need to change the data structure in a more fundamental way.

For those cases, the ``Query`` object offers the ``mapReduce()`` method, which
is a way of processing results once they are fetched from the database.

A common example of changing the data structure is grouping results together
based on certain conditions. For this task we can use the ``mapReduce()``
function. We need two callable functions the ``$mapper`` and the ``$reducer``.
The ``$mapper`` callable receives the current result from the database as first
argument, the iteration key as second argument and finally it receives an
instance of the ``MapReduce`` routine it is running::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

In the above example ``$mapper`` is calculating the status of an article, either
published or unpublished, then it calls ``emitIntermediate()`` on the
``MapReduce`` instance. This method stores the article in the list of articles
labelled as either published or unpublished.

The next step in the map-reduce process is to consolidate the final results. For
each status created in the mapper, the ``$reducer`` function will be called so
you can do any extra processing. This function will receive the list of articles
in a particular "bucket" as the first parameter, the name of the "bucket" it
needs to process as the second parameter, and again, as in the ``mapper()``
function, the instance of the ``MapReduce`` routine as the third parameter. In
our example, we did not have to do any extra processing, so we just ``emit()``
the final results::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

Finally, we can put these two functions together to do the grouping::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer);

    foreach ($articlesByStatus as $status => $articles) {
        echo __("The are %d %s articles", count($articles), $status);
    }

The above will ouput the following lines::

    There are 4 published articles
    There are 5 unpublished articles

Of course, this is a simplistic example that could actually be solved in another
way without the help of a map-reduce process. Now, let's take a look at another
example in which the reducer function will be needed to do something more than
just emitting the results.

Calculating the most commonly mentioned words, where the articles contain
information about CakePHP, as usual we need a mapper function::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos('cakephp', $article['body']) === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

It first checks for whether the "cakephp" word is in the article's body, and
then breaks the body into individual words. Each word will create its own
``bucket`` where each article id will be stored. Now let's reduce our results to
only extract the count::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

Finally, we put everything together::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

This could return a very large array if we don't clean stop words, but it could
look something like this::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

One last example and you will be a map-reduce expert. Imagine you have
a ``friends`` table and you want to find "fake friends" in our database, or
better said, people who do not follow each other. Let's start with our
``mapper()`` function::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

We just duplicated our data to have a list of users each other user follows.
Now it's time to reduce it. For each call to the reducer, it will receive a list
of followers per user::

    // $friends list will look like
    // repeated numbers mean that the relationship existed in both directions
    [2, 5, 100, 2, 4]

    $reducer = function ($friendsList, $user, $mr) {
        $friends = array_count_values($friendsList);
        foreach ($friends as $friend => $count) {
            if ($count < 2) {
                $mr->emit($friend, $user);
            }
        }
    }

And we supply our functions to a query::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer)
        ->toArray();

This would return an array similar to this::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

The resulting array means, for example, that user with id ``1`` follows users
``2`` and ``4``, but those do not follow ``1`` back.


Stacking Multiple Operations
----------------------------

Using `mapReduce` in a query will not execute it immediately. The operation will
be registered to be run as soon as the first result is attempted to be fetched.
This allows you to keep chaining additional methods and filters to the query
even after adding a map-reduce routine::

    $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // At a later point in your app:
    $query->where(['created >=' => new DateTime('1 day ago')]);

This is particularly useful for building custom finder methods as described in the
:ref:`custom-find-methods` section::

    public function findPublished(Query $query, array $options)
    {
        return $query->where(['published' => true]);
    }

    public function findRecent(Query $query, array $options)
    {
        return $query->where(['created >=' => new DateTime('1 day ago')]);
    }

    public function findCommonWords(Query $query, array $options)
    {
        // Same as in the common words example in the previous section
        $mapper = ...;
        $reducer = ...;
        return $query->mapReduce($mapper, $reducer);
    }

    $commonWords = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

Moreover, it is also possible to stack more than one ``mapReduce`` operation for
a single query. For example, if we wanted to have the most commonly used words
for articles, but then filter it to only return words that were mentioned more
than 20 times across all articles::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper);

Removing All Stacked Map-reduce Operations
------------------------------------------

Under some circumstances you may want to modify a ``Query`` object so that no
``mapReduce`` operations are executed at all. This can be done by
calling the method with both parameters as null and the third parameter
(overwrite) as ``true``::

    $query->mapReduce(null, null, true);
