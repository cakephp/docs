Collections
###########

.. php:namespace:: Cake\Collection

.. php:class:: Collection

As classes de coleção fornecem um conjunto de ferramentas para manipular matrizes 
ou objetos ``Traversable``. Se você já usou underscore.js, tem uma idéia do que 
pode esperar das classes de coleção.

Instâncias de coleção são imutáveis; modificar uma coleção irá gerar uma nova coleção. 
Isso torna o trabalho com objetos de coleção mais previsível, pois as operações são 
livres de efeitos colaterais.


Exemplo Rápido
==============

Coleções podem ser criadas usando uma matriz ou um objeto ``Traversable``. Você 
também interagirá com as coleções sempre que interagir com o ORM no CakePHP. Um 
simples uso de uma coleção seria::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // Crie uma nova coleção contendo elementos
    // com um valor maior que um.
    $overOne = $collection->filter(function ($value, $key, $iterator) {
        return $value > 1;
    });

Você também pode usar a função auxiliar ``collection()`` em vez de ``new Collection()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];

    // Ambos formam uma instância de coleção.
    $collectionA = new Collection($items);
    $collectionB = collection($items);

O benefício do método auxiliar é que é mais fácil encadear do que ``(new Collection($items))``.

O :php:trait:`~Cake\\Collection\\CollectionTrait` permite integrar recursos semelhantes a 
coleções em qualquer objeto ``Traversable`` que você possui no seu aplicativo.

Lista de Métodos
================

.. csv-table::
    :class: docutils internal-toc

    :php:meth:`append`, :php:meth:`appendItem`, :php:meth:`avg`, 
    :php:meth:`buffered`, :php:meth:`chunk`, :php:meth:`chunkWithKeys`
    :php:meth:`combine`, :php:meth:`compile`, :php:meth:`contains`
    :php:meth:`countBy`, :php:meth:`each`, :php:meth:`every`
    :php:meth:`extract`, :php:meth:`filter`, :php:meth:`first`
    :php:meth:`firstMatch`, :php:meth:`groupBy`, :php:meth:`indexBy`
    :php:meth:`insert`, :php:meth:`isEmpty`, :php:meth:`last`
    :php:meth:`listNested`, :php:meth:`map`, :php:meth:`match`
    :php:meth:`max`, :php:meth:`median`, :php:meth:`min`
    :php:meth:`nest`, :php:meth:`prepend`, :php:meth:`prependItem`
    :php:meth:`reduce`, :php:meth:`reject`, :php:meth:`sample`
    :php:meth:`shuffle`, :php:meth:`skip`, :php:meth:`some`
    :php:meth:`sortBy`, :php:meth:`stopWhen`, :php:meth:`sumOf`
    :php:meth:`take`, :php:meth:`through`, :php:meth:`transpose`
    :php:meth:`unfold`, :php:meth:`zip`

Iterando
========

.. php:method:: each(callable $c)

As coleções podem ser iteradas e/ou transformadas em novas coleções com os 
métodos ``each()`` e ``map()``. O método ``each()`` não criará uma 
nova coleção, mas permitirá que você modifique quaisquer objetos dentro da 
coleção::

    $collection = new Collection($items);
    $collection = $collection->each(function ($value, $key) {
        echo "Element $key: $value";
    });

O retorno de ``each()`` será o objeto de coleção. Cada um iterará a coleção 
imediatamente aplicando o retorno de chamada a cada valor na coleção.

.. php:method:: map(callable $c)

O método ``map()`` criará uma nova coleção com base na saída do retorno 
de chamada que está sendo aplicada a cada objeto na coleção original::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function ($value, $key) {
        return $value * 2;
    });
    
    // $result contém [2, 4, 6];
    $result = $new->toList();

    // $result contém ['a' => 2, 'b' => 4, 'c' => 6];
    $result = $new->toArray();

O método ``map()`` criará um novo iterador que cria preguiçosamente os 
itens resultantes quando iterado.

.. php:method:: extract($matcher)

Um dos usos mais comuns de uma função ``map()`` é extrair uma única coluna 
de uma coleção. Se você deseja criar uma lista de elementos contendo os valores 
de uma propriedade específica, pode usar o método ``extract()``::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result contém ['mark', 'jose', 'barbara'];
    $result = $names->toList();

Como em muitas outras funções da classe de coleção, você pode especificar um caminho 
separado por pontos para extrair colunas. Este exemplo retornará uma coleção que 
contém os nomes dos autores de uma lista de artigos::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result contém ['Maria', 'Stacy', 'Larry'];
    $result = $names->toList();

Por fim, se a propriedade que você está procurando não pode ser expressa como um caminho, 
você pode usar uma função de retorno de chamada para retorná-la::

    $collection = new Collection($articles);
    $names = $collection->extract(function ($article) {
        return $article->author->name . ', ' . $article->author->last_name;
    });

Freqüentemente, as propriedades necessárias para extrair uma chave comum 
presente em várias matrizes ou objetos profundamente aninhados em outras estruturas. 
Para esses casos, você pode usar o combinador ``{*}`` na chave do caminho. 
Esse correspondente geralmente é útil ao combinar dados da associação HasMany e BelongsToMany::

    $data = [
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-1'],
                ['number' => 'number-2'],
                ['number' => 'number-3'],
            ]
        ],
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-4'],
                ['number' => 'number-5'],
            ]
        ]
    ];

    $numbers = (new Collection($data))->extract('phone_numbers.{*}.number');
    $numbers->toList();
    // Retorna ['number-1', 'number-2', 'number-3', 'number-4', 'number-5']

Este último exemplo usa ``toList()`` diferente de outros exemplos, o que é 
importante quando estamos obtendo resultados com chaves possivelmente duplicadas. 
Ao usar ``toList()``, garantimos a obtenção de todos os valores, mesmo que haja 
chaves duplicadas.

Ao contrário de :php:meth:`Cake\\Utility\\Hash::extract()` este método suporta 
apenas o curinga ``{*}``. Todos os outros correspondentes de curinga e atributos 
não são suportados.

.. php:method:: combine($keyPath, $valuePath, $groupPath = null)

Coleções permitem que você crie uma nova coleção feita de chaves e valores em 
uma coleção existente. Os caminhos de chave e valor podem ser especificados com 
notação de caminhos com ponto::

    $items = [
        ['id' => 1, 'name' => 'foo', 'parent' => 'a'],
        ['id' => 2, 'name' => 'bar', 'parent' => 'b'],
        ['id' => 3, 'name' => 'baz', 'parent' => 'a'],
    ];
    $combined = (new Collection($items))->combine('id', 'name');

    // O resultado ficará assim quando convertido em array
    [
        1 => 'foo',
        2 => 'bar',
        3 => 'baz',
    ];

Opcionalmente, você também pode usar um ``groupPath`` para agrupar resultados com base em um caminho::

    $combined = (new Collection($items))->combine('id', 'name', 'parent');

    // O resultado ficará assim quando convertido em array
    [
        'a' => [1 => 'foo', 3 => 'baz'],
        'b' => [2 => 'bar']
    ];

E por fim, você pode usar *closures* para criar caminhos de chaves/valores/grupos dinamicamente, 
por exemplo, ao trabalhar com entidades e datas (convertidas em instâncias ``Cake/Time`` pelo ORM), 
você pode querer agrupar os resultados por data::

    $combined = (new Collection($entities))->combine(
        'id',
        function ($entity) { return $entity; },
        function ($entity) { return $entity->date->toDateString(); }
    );

    // O resultado ficará assim quando convertido em array
    [
        'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
        'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    ]

.. php:method:: stopWhen(callable $c)

Você pode parar a iteração a qualquer momento usando o método ``stopWhen()``. 
A chamada em uma coleção criará uma nova e irá interromper a execução de novos resultados 
se a chamada passada retornar verdadeira para um dos elementos::

    $items = [10, 20, 50, 1, 2];
    $collection = new Collection($items);

    $new = $collection->stopWhen(function ($value, $key) {
        // Pare no primeiro valor maior que 30
        return $value > 30;
    });

    // $result contém [10, 20];
    $result = $new->toList();

.. php:method:: unfold(callable $c)

Às vezes, os itens internos de uma coleção contêm matrizes ou iteradores com mais 
itens. Se você deseja nivelar a estrutura interna para iterar uma vez todos os 
elementos, pode usar o método ``unfold()``. Ele criará uma nova coleção que 
produzirá todos os elementos aninhados na coleção::

    $items = [[1, 2, 3], [4, 5]];
    $collection = new Collection($items);
    $new = $collection->unfold();

    // $result contém [1, 2, 3, 4, 5];
    $result = $new->toList();

Ao passar uma chamada para ``unfold()``, você pode controlar quais elementos 
serão desdobrados de cada item da coleção original. Isso é útil para retornar 
dados de serviços paginados::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // Um serviço da web imaginário que retorna uma página de resultados
        return MyService::fetchPage($page)->toList();
    });

    $allPagesItems = $items->toList();

Se você estiver usando o PHP 5.5+, você pode usar a palavra-chave ``yield`` dentro de 
``unfold()`` para retornar quantos elementos de cada item da coleção você precisará::

    $oddNumbers = [1, 3, 5, 7];
    $collection = new Collection($oddNumbers);
    $new = $collection->unfold(function ($oddNumber) {
        yield $oddNumber;
        yield $oddNumber + 1;
    });

    // $result contém [1, 2, 3, 4, 5, 6, 7, 8];
    $result = $new->toList();

.. php:method:: chunk($chunkSize)

Ao lidar com grandes quantidades de itens em uma coleção, pode fazer sentido 
processar os elementos em lotes, em vez de um por um. Para dividir uma coleção 
em várias matrizes de um determinado tamanho, você pode usar a função ``chunk()``::

    $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    $collection = new Collection($items);
    $chunked = $collection->chunk(2);
    $chunked->toList(); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]]

A função ``chunk`` é particularmente útil ao realizar o processamento em lote, por 
exemplo, com um resultado no banco de dados::

    $collection = new Collection($articles);
    $collection->map(function ($article) {
            // Alterar uma propriedade no artigo
            $article->property = 'changed';
        })
        ->chunk(20)
        ->each(function ($batch) {
            myBulkSave($batch); // Esta função será chamada para cada lote
        });

.. php:method:: chunkWithKeys($chunkSize)

Bem como :php:meth:`chunk()`, ``chunkWithKeys()`` permite dividir uma coleção 
em lotes menores, mas com as chaves preservadas. Isso é útil ao agrupar matrizes associativas::

    $collection = new Collection([
        'a' => 1,
        'b' => 2,
        'c' => 3,
        'd' => [4, 5]
    ]);
    $chunked = $collection->chunkWithKeys(2)->toList();
    // Cria
    [
        ['a' => 1, 'b' => 2],
        ['c' => 3, 'd' => [4, 5]]
    ]

Filtragem
=========

.. php:method:: filter(callable $c)

As coleções facilitam a filtragem e a criação de novas coleções com base no resultado 
das funções de retorno de chamada. Você pode usar ``filter()`` para criar uma nova 
coleção de elementos que correspondem a um retorno de chamada de critério::

    $collection = new Collection($people);
    $ladies = $collection->filter(function ($person, $key) {
        return $person->gender === 'female';
    });
    $guys = $collection->filter(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: reject(callable $c)

O inverso de ``filter()`` é ``reject()``. Este método cria um filtro negativo, 
removendo elementos que correspondem à função de filtro::

    $collection = new Collection($people);
    $ladies = $collection->reject(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: every(callable $c)

Você pode fazer testes de verificação com funções de filtro. Para ver se todos 
os elementos de uma coleção correspondem a um teste, você pode usar ``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function ($person) {
        return $person->age < 21;
    });

.. php:method:: some(callable $c)

Você pode ver se a coleção contém pelo menos um elemento que corresponde a 
uma função de filtro usando o método ``some()``::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function ($person) {
        return $person->age < 21;
    });

.. php:method:: match(array $conditions)

Se você precisar extrair uma nova coleção contendo apenas os elementos que 
contêm um determinado conjunto de propriedades, use o método ``match()``::

    $collection = new Collection($comments);
    $commentsFromMark = $collection->match(['user.name' => 'Mark']);

.. php:method:: firstMatch(array $conditions)

O nome da propriedade pode ser um caminho separado por pontos. Você pode 
atravessar para entidades aninhadas e corresponder aos valores que elas contêm. 
Quando você só precisa do primeiro elemento correspondente de uma coleção, 
pode usar ``firstMatch()``::

    $collection = new Collection($comments);
    $comment = $collection->firstMatch([
        'user.name' => 'Mark',
        'active' => true
    ]);

Como você pode ver acima, ambos ``match()`` e ``firstMatch()`` permitem 
fornecer várias condições para a correspondência. Além disso, as condições 
podem ser para caminhos diferentes, permitindo expressar condições complexas 
para comparação.

Agregação
=========

.. php:method:: reduce(callable $c)

A contraparte de uma operação ``map()`` geralmente é uma ``reduce``. 
Esta função ajudará você a criar um único resultado de todos os elementos 
em uma coleção::

    $totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
        return $accumulated + $orderLine->price;
    }, 0);

No exemplo acima, ``$totalPrice`` será a soma de todos os preços únicos contidos na 
coleção. Observe o segundo argumento para a função ``reduce()`` assume o valor 
inicial da operação de redução que você está executando::

    $allTags = $collection->reduce(function ($accumulated, $article) {
        return array_merge($accumulated, $article->tags);
    }, []);

.. php:method:: min(string|callable $callback, $type = SORT_NUMERIC)

Para extrair o valor mínimo de uma coleção com base em uma propriedade, 
basta usar a função ``min()``. Isso retornará o elemento completo da coleção 
e não apenas o menor valor encontrado::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $youngest->name;

Você também pode expressar a propriedade para comparar, fornecendo um caminho ou uma 
função de retorno de chamada::

    $collection = new Collection($people);
    $personYoungestChild = $collection->min(function ($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

.. php:method:: max(string|callable $callback, $type = SORT_NUMERIC)

O mesmo pode ser aplicado à função ``max()``, que retornará um único elemento 
da coleção com o maior valor de propriedade::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function ($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->max('dad.age');

.. php:method:: sumOf(string|callable $callback)

Finalmente, o método ``sumOf()`` retornará a soma de uma propriedade de todos os elementos::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

.. php:method:: avg($matcher = null)

Calculate the average value of the elements in the collection. Optionally
provide a matcher path, or function to extract values to generate the average
for::

    $items = [
       ['invoice' => ['total' => 100]],
       ['invoice' => ['total' => 200]],
    ];

    // Average: 150
    $average = (new Collection($items))->avg('invoice.total');

.. php:method:: median($matcher = null)

Calculate the median value of a set of elements. Optionally provide a matcher
path, or function to extract values to generate the median for::

    $items = [
      ['invoice' => ['total' => 400]],
      ['invoice' => ['total' => 500]],
      ['invoice' => ['total' => 100]],
      ['invoice' => ['total' => 333]],
      ['invoice' => ['total' => 200]],
    ];

    // Median: 333
    $median = (new Collection($items))->median('invoice.total');


Grouping and Counting
---------------------

.. php:method:: groupBy($callback)

Collection values can be grouped by different keys in a new collection when they
share the same value for a property::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');

    // Result will look like this when converted to array:
    [
      10 => [
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10]
      ],
      9 => [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Barbara', 'grade' => 9]
      ]
    ]

As usual, it is possible to provide either a dot-separated path for nested
properties or your own callback function to generate the groups dynamically::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

.. php:method:: countBy($callback)

If you only wish to know the number of occurrences per group, you can do so by
using the ``countBy()`` method. It takes the same arguments as ``groupBy`` so it
should be already familiar to you::

    $classResults = $students->countBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

    // Result could look like this when converted to array:
    ['approved' => 70, 'denied' => 20]

.. php:method:: indexBy($callback)

There will be certain cases where you know an element is unique for the property
you want to group by. If you wish a single result per group, you can use the
function ``indexBy()``::

    $usersById = $users->indexBy('id');

    // When converted to array result could look like
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

As with the ``groupBy()`` function you can also use a property path or
a callback::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function ($file) {
        return md5($file);
    });

.. php:method:: zip($elements)

The elements of different collections can be grouped together using the
``zip()`` method. It will return a new collection containing an array grouping
the elements from each collection that are placed at the same position::

    $odds = new Collection([1, 3, 5]);
    $pairs = new Collection([2, 4, 6]);
    $combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]

You can also zip multiple collections at once::

    $years = new Collection([2013, 2014, 2015, 2016]);
    $salaries = [1000, 1500, 2000, 2300];
    $increments = [0, 500, 500, 300];

    $rows = $years->zip($salaries, $increments)->toList();
    // Returns:
    [
        [2013, 1000, 0],
        [2014, 1500, 500],
        [2015, 2000, 500],
        [2016, 2300, 300]
    ]

As you can already see, the ``zip()`` method is very useful for transposing
multidimensional arrays::

    $data = [
        2014 => ['jan' => 100, 'feb' => 200],
        2015 => ['jan' => 300, 'feb' => 500],
        2016 => ['jan' => 400, 'feb' => 600],
    ]

    // Getting jan and feb data together

    $firstYear = new Collection(array_shift($data));
    $firstYear->zip($data[0], $data[1])->toList();

    // Or $firstYear->zip(...$data) in PHP >= 5.6

    // Returns
    [
        [100, 300, 400],
        [200, 500, 600]
    ]

Sorting
=======

.. php:method:: sortBy($callback)

Collection values can be sorted in ascending or descending order based on
a column or custom function. To create a new sorted collection out of the values
of another one, you can use ``sortBy``::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age');

As seen above, you can sort by passing the name of a column or property that
is present in the collection values. You are also able to specify a property
path instead using the dot notation. The next example will sort articles by
their author's name::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('author.name');

The ``sortBy()`` method is flexible enough to let you specify an extractor
function that will let you dynamically select the value to use for comparing two
different values in the collection::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function ($article) {
        return $article->author->name . '-' . $article->title;
    });

In order to specify in which direction the collection should be sorted, you need
to provide either ``SORT_ASC`` or ``SORT_DESC`` as the second parameter for
sorting in ascending or descending direction respectively. By default,
collections are sorted in descending direction::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

Sometimes you will need to specify which type of data you are trying to compare
so that you get consistent results. For this purpose, you should supply a third
argument in the ``sortBy()`` function with one of the following constants:

- **SORT_NUMERIC**: For comparing numbers
- **SORT_STRING**: For comparing string values
- **SORT_NATURAL**: For sorting string containing numbers and you'd like those
  numbers to be order in a natural way. For example: showing "10" after "2".
- **SORT_LOCALE_STRING**: For comparing strings based on the current locale.

By default, ``SORT_NUMERIC`` is used::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    It is often expensive to iterate sorted collections more than once. If you
    plan to do so, consider converting the collection to an array or simply use
    the ``compile()`` method on it.

Working with Tree Data
======================

.. php:method:: nest($idPath, $parentPath)

Not all data is meant to be represented in a linear way. Collections make it
easier to construct and flatten hierarchical or nested structures. Creating
a nested structure where children are grouped by a parent identifier property is
easy with the ``nest()`` method.

Two parameters are required for this function. The first one is the property
representing the item identifier. The second parameter is the name of the
property representing the identifier for the parent item::

    $collection = new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
    ]);

    $collection->nest('id', 'parent_id')->toList();
    // Returns
    [
        [
            'id' => 1,
            'parent_id' => null,
            'name' => 'Birds',
            'children' => [
                ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds', 'children' => []],
                ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle', 'children' => []],
                ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull', 'children' => []],
            ]
        ],
        [
            'id' => 6,
            'parent_id' => null,
            'name' => 'Fish',
            'children' => [
                ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish', 'children' => []],
            ]
        ]
    ];

Children elements are nested inside the ``children`` property inside each of the
items in the collection. This type of data representation is helpful for
rendering menus or traversing elements up to certain level in the tree.

.. php:method:: listNested($dir = 'desc', $nestingKey = 'children')

The inverse of ``nest()`` is ``listNested()``. This method allows you to flatten
a tree structure back into a linear structure. It takes two parameters; the
first one is the traversing mode (asc, desc or leaves), and the second one is
the name of the property containing the children for each element in the
collection.

Taking the input the nested collection built in the previous example, we can
flatten it::

    $nested->listNested()->toList();

    // Returns
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

By default, the tree is traversed from the root to the leaves. You can also
instruct it to only return the leaf elements in the tree::

    $nested->listNested()->toList();

    // Returns
    [
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

Once you have converted a tree into a nested list, you can use the ``printer()``
method to configure how the list output should be formatted::

    $nested->listNested()->printer('name', 'id', '--')->toArray();

    // Returns
    [
        3 => 'Eagle',
        4 => 'Seagull',
        5 -> '--Clown Fish',
    ]

The ``printer()`` method also lets you use a callback to generate the keys and
or values::

    $nested->listNested()->printer(
        function ($el) {
            return $el->name;
        },
        function ($el) {
            return $el->id;
        }
    );

Other Methods
=============

.. php:method:: isEmpty()

Allows you to see if a collection contains any elements::

    $collection = new Collection([]);
    // Returns true
    $collection->isEmpty();

    $collection = new Collection([1]);
    // Returns false
    $collection->isEmpty();

.. php:method:: contains($value)

Collections allow you to quickly check if they contain one particular
value: by using the ``contains()`` method::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

Comparisons are performed using the ``===`` operator. If you wish to do looser
comparison types you can use the ``some()`` method.

.. php:method:: shuffle()

Sometimes you may wish to show a collection of values in a random order. In
order to create a new collection that will return each value in a randomized
position, use the ``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // This could return [2, 3, 1]
    $collection->shuffle()->toList();

.. php:method:: transpose()

When you transpose a collection, you get a new collection containing a row made
of the each of the original columns::

     $items = [
        ['Products', '2012', '2013', '2014'],
        ['Product A', '200', '100', '50'],
        ['Product B', '300', '200', '100'],
        ['Product C', '400', '300', '200'],
     ]
     $transpose = (new Collection($items))->transpose()->toList();

     // Returns
     [
         ['Products', 'Product A', 'Product B', 'Product C'],
         ['2012', '200', '300', '400'],
         ['2013', '100', '200', '300'],
         ['2014', '50', '100', '200'],
     ]

Withdrawing Elements
--------------------

.. php:method:: sample(int $size)

Shuffling a collection is often useful when doing quick statistical analysis.
Another common operation when doing this sort of task is withdrawing a few
random values out of a collection so that more tests can be performed on those.
For example, if you wanted to select 5 random users to which you'd like to apply
some A/B tests to, you can use the ``sample()`` function::

    $collection = new Collection($people);

    // Withdraw maximum 20 random users from this collection
    $testSubjects = $collection->sample(20);

``sample()`` will take at most the number of values you specify in the first
argument. If there are not enough elements in the collection to satisfy the
sample, the full collection in a random order is returned.

.. php:method:: take(int $size, int $from)

Whenever you want to take a slice of a collection use the ``take()`` function,
it will create a new collection with at most the number of values you specify in
the first argument, starting from the position passed in the second argument::

    $topFive = $collection->sortBy('age')->take(5);

    // Take 5 people from the collection starting from position 4
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

Positions are zero-based, therefore the first position number is ``0``.

.. php:method:: skip(int $positions)

While the second argument of ``take()`` can help you skip some elements before
getting them from the collection, you can also use ``skip()`` for the same
purpose as a way to take the rest of the elements after a certain position::

    $collection = new Collection([1, 2, 3, 4]);
    $allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]

.. php:method:: first()

One of the most common uses of ``take()`` is getting the first element in the
collection. A shortcut method for achieving the same goal is using the
``first()`` method::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->first(); // Returns 5

.. php:method:: last()

Similarly, you can get the last element of a collection using the ``last()``
method::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->last(); // Returns 2

Expanding Collections
---------------------

.. php:method:: append(array|Traversable $items)

You can compose multiple collections into a single one. This enables you to
gather data from various sources, concatenate it, and apply other collection
functions to it very smoothly. The ``append()`` method will return a new
collection containing the values from both sources::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // Tweets containing cakefest from both sources
    $myTimeline->filter(function ($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. php:method:: appendItem($value, $key)

Allows you to append an item with an optional key to the collection. If you
specify a key that already exists in the collection, the value will not be
overwritten::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->appendItem($newTweet, 99);

.. php:method:: prepend(array|Traversable $items)

The ``prepend()`` method will return a new collection containing the values from
both sources::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->prepend($phpTweets);

.. php:method:: prependItem($value, $key)

Allows you to prepend an item with an optional key to the collection. If you
specify a key that already exists in the collection, the value will not be
overwritten::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->prependItem($newTweet, 99);

.. warning::

    When appending from different sources, you can expect some keys from both
    collections to be the same. For example, when appending two simple arrays.
    This can present a problem when converting a collection to an array using
    ``toArray()``. If you do not want values from one collection to override
    others in the previous one based on their key, make sure that you call
    ``toList()`` in order to drop the keys and preserve all values.

Modifiying Elements
-------------------

.. php:method:: insert(string $path, array|Traversable $items)

At times, you may have two separate sets of data that you would like to insert
the elements of one set into each of the elements of the other set. This is
a very common case when you fetch data from a data source that does not support
data-merging or joins natively.

Collections offer an ``insert()`` method that will allow you to insert each of
the elements in one collection into a property inside each of the elements of
another collection::

    $users = [
        ['username' => 'mark'],
        ['username' => 'juan'],
        ['username' => 'jose']
    ];

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript'],
        ['Javascript', 'Prolog']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

When converted to an array, the ``$merged`` collection will look like this::

    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

The first parameter for the ``insert()`` method is a dot-separated path of
properties to follow so that the elements can be inserted at that position. The
second argument is anything that can be converted to a collection object.

Please observe that elements are inserted by the position they are found, thus,
the first element of the second collection is merged into the first
element of the first collection.

If there are not enough elements in the second collection to insert into the
first one, then the target property will be filled with ``null`` values::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);

    // Will yield
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => null]
    ];

The ``insert()`` method can operate array elements or objects implementing the
``ArrayAccess`` interface.

Making Collection Methods Reusable
----------------------------------

Using closures for collection methods is great when the work to be done is small
and focused, but it can get messy very quickly. This becomes more obvious when
a lot of different methods need to be called or when the length of the closure
methods is more than just a few lines.

There are also cases when the logic used for the collection methods can be
reused in multiple parts of your application. It is recommended that you
consider extracting complex collection logic to separate classes. For example,
imagine a lengthy closure like this one::

        $collection
                ->map(function ($row, $key) {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // More code here...

                    return $modifiedRow;
                });

This can be refactored by creating another class::

        class TotalOrderCalculator
        {
                public function __invoke($row, $key)
                {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // More code here...

                    return $modifiedRow;
                }
        }

        // Use the logic in your map() call
        $collection->map(new TotalOrderCalculator)

.. php:method:: through(callable $c)

Sometimes a chain of collection method calls can become reusable in other parts
of your application, but only if they are called in that specific order. In
those cases you can use ``through()`` in combination with a class implementing
``__invoke`` to distribute your handy data processing calls::

        $collection
                ->map(new ShippingCostCalculator)
                ->map(new TotalOrderCalculator)
                ->map(new GiftCardPriceReducer)
                ->buffered()
               ...

The above method calls can be extracted into a new class so they don't need to
be repeated every time::

        class FinalCheckOutRowProcessor
        {
                public function __invoke($collection)
                {
                        return $collection
                                ->map(new ShippingCostCalculator)
                                ->map(new TotalOrderCalculator)
                                ->map(new GiftCardPriceReducer)
                                ->buffered()
                               ...
                }
        }

        // Now you can use the through() method to call all methods at once
        $collection->through(new FinalCheckOutRowProcessor);

Optimizing Collections
----------------------

.. php:method:: buffered()

Collections often perform most operations that you create using its functions in
a lazy way. This means that even though you can call a function, it does not
mean it is executed right away. This is true for a great deal of functions in
this class. Lazy evaluation allows you to save resources in situations
where you don't use all the values in a collection. You might not use all the
values when iteration stops early, or when an exception/failure case is reached
early.

Additionally, lazy evaluation helps speed up some operations. Consider the
following example::

    $collection = new Collection($oneMillionItems);
    $collection = $collection->map(function ($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

Had the collections not been lazy, we would have executed one million operations,
even though we only wanted to show 30 elements out of it. Instead, our map
operation was only applied to the 30 elements we used. We can also
derive benefits from this lazy evaluation for smaller collections when we
do more than one operation on them. For example: calling ``map()`` twice and
then ``filter()``.

Lazy evaluation comes with its downside too. You could be doing the same
operations more than once if you optimize a collection prematurely. Consider
this example::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function ($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function ($item) {
        return $item > 30;
    });

If we iterate both ``youngerThan30`` and ``olderThan30``, the collection would
unfortunately execute the ``extract()`` operation twice. This is because
collections are immutable and the lazy-extracting operation would be done for
both filters.

Luckily we can overcome this issue with a single function. If you plan to reuse
the values from certain operations more than once, you can compile the results
into another collection using the ``buffered()`` function::

    $ages = $collection->extract('age')->buffered();
    $youngerThan30 = ...
    $olderThan30 = ...

Now, when both collections are iterated, they will only call the
extracting operation once.

Making Collections Rewindable
-----------------------------

The ``buffered()`` method is also useful for converting non-rewindable iterators
into collections that can be iterated more than once::

    // In PHP 5.5+
    public function results()
    {
        ...
        foreach ($transientElements as $e) {
            yield $e;
        }
    }
    $rewindable = (new Collection(results()))->buffered();

Cloning Collections
-------------------

.. php:method:: compile(bool $preserveKeys = true)

Sometimes you need to get a clone of the elements from another
collection. This is useful when you need to iterate the same set from different
places at the same time. In order to clone a collection out of another use the
``compile()`` method::

    $ages = $collection->extract('age')->compile();

    foreach ($ages as $age) {
        foreach ($collection as $element) {
            echo h($element->name) . ' - ' . $age;
        }
    }

.. meta::
    :title lang=en: Collections
    :keywords lang=en: collections, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold, through
