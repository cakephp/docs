Coleções
########

.. php:namespace:: Cake\Collection

.. php:class:: Collection

As classes de coleção fornecem um conjunto de ferramentas para manipular arrays ou
objetos ``Traversable``. Se você já usou o underscore.js,
você tem uma ideia do que pode esperar das classes de coleção.

Instâncias de coleção são imutáveis; modificar uma coleção irá gerar
uma nova coleção. Isso torna o trabalho com objetos de coleção mais previsível, pois
as operações são livres de efeitos colaterais.

Exemplo Rápido
==============

Coleções podem ser criadas usando um array ou objeto ``Traversable``. Você também
interagirá com coleções toda vez que interagir com o ORM no CakePHP.
Um uso simples de uma Collection seria::

    use Cake\Collection\Collection;

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    // Cria uma nova coleção contendo elementos
    // com um valor maior que um.
    $overOne = $collection->filter(function ($value, $key, $iterator) {
        return $value > 1;
    });

Você também pode usar a função auxiliar ``collection()`` em vez de ``new
Collection()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];

    // Ambos criam uma instância de Collection.
    $collectionA = new Collection($items);
    $collectionB = collection($items);

O benefício do método auxiliar é que é mais fácil encadear do que
``(new Collection($items))``.

O :php:trait:`~Cake\\Collection\\CollectionTrait` permite integrar
recursos semelhantes a coleções em qualquer objeto ``Traversable`` que você tenha em sua
aplicação também.

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

Iteração
========

.. php:method:: each($callback)

Coleções podem ser iteradas e/ou transformadas em novas coleções com os
métodos ``each()`` e ``map()``. O método ``each()`` não criará uma nova
coleção, mas permitirá que você modifique quaisquer objetos dentro da coleção::

    $collection = new Collection($items);
    $collection = $collection->each(function ($value, $key) {
        echo "Elemento $key: $value";
    });

O retorno de ``each()`` será o objeto de coleção. Each irá iterar a
coleção imediatamente aplicando o callback a cada valor na coleção.

.. php:method:: map($callback)

O método ``map()`` criará uma nova coleção com base na saída do
callback sendo aplicado a cada objeto na coleção original::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);

    $new = $collection->map(function ($value, $key) {
        return $value * 2;
    });

    // $result contém [2, 4, 6];
    $result = $new->toList();

    // $result contém ['a' => 2, 'b' => 4, 'c' => 6];
    $result = $new->toArray();

O método ``map()`` criará um novo iterador que cria preguiçosamente
os itens resultantes quando iterado.

.. php:method:: extract($path)

Um dos usos mais comuns para uma função ``map()`` é extrair uma única
coluna de uma coleção. Se você está procurando construir uma lista de elementos
contendo os valores de uma propriedade específica, você pode usar o método ``extract()``::

    $collection = new Collection($people);
    $names = $collection->extract('name');

    // $result contém ['mark', 'jose', 'barbara'];
    $result = $names->toList();

Como em muitas outras funções na classe de coleção, você pode especificar
um caminho separado por pontos para extrair colunas. Este exemplo retornará
uma coleção contendo os nomes dos autores de uma lista de artigos::

    $collection = new Collection($articles);
    $names = $collection->extract('author.name');

    // $result contém ['Maria', 'Stacy', 'Larry'];
    $result = $names->toList();

Finalmente, se a propriedade que você está procurando não puder ser expressa como um caminho,
você pode usar uma função de callback para retorná-la::

    $collection = new Collection($articles);
    $names = $collection->extract(function ($article) {
        return $article->author->name . ', ' . $article->author->last_name;
    });

Muitas vezes, as propriedades que você precisa extrair são uma chave comum presente em vários
arrays ou objetos que estão profundamente aninhados dentro de outras estruturas. Para esses
casos, você pode usar o matcher ``{*}`` na chave do caminho. Este matcher é frequentemente
útil ao combinar dados de associação HasMany e BelongsToMany::

    $data = [
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-1'],
                ['number' => 'number-2'],
                ['number' => 'number-3'],
            ],
        ],
        [
            'name' => 'James',
            'phone_numbers' => [
                ['number' => 'number-4'],
                ['number' => 'number-5'],
            ],
        ],
    ];

    $numbers = (new Collection($data))->extract('phone_numbers.{*}.number');
    $result = $numbers->toList();
    // $result contém ['number-1', 'number-2', 'number-3', 'number-4', 'number-5']

Este último exemplo usa ``toList()`` ao contrário de outros exemplos, o que é importante
quando estamos obtendo resultados com chaves possivelmente duplicadas. Ao usar ``toList()``
teremos a garantia de obter todos os valores mesmo se houver chaves duplicadas.

Ao contrário de :php:meth:`Cake\\Utility\\Hash::extract()` este método suporta apenas o
wildcard ``{*}``. Todos os outros matchers de wildcard e atributos não são suportados.

.. php:method:: combine($keyPath, $valuePath, $groupPath = null)

Coleções permitem que você crie uma nova coleção feita de chaves e valores em
uma coleção existente. Tanto a chave quanto os caminhos de valor podem ser especificados com
caminhos de notação de ponto::

    $items = [
        ['id' => 1, 'name' => 'foo', 'parent' => 'a'],
        ['id' => 2, 'name' => 'bar', 'parent' => 'b'],
        ['id' => 3, 'name' => 'baz', 'parent' => 'a'],
    ];
    $combined = (new Collection($items))->combine('id', 'name');
    $result = $combined->toArray();

    // $result contém
    [
        1 => 'foo',
        2 => 'bar',
        3 => 'baz',
    ];

Você também pode, opcionalmente, usar um ``groupPath`` para agrupar resultados com base em um caminho::

    $combined = (new Collection($items))->combine('id', 'name', 'parent');
    $result = $combined->toArray();

    // $result contém
    [
        'a' => [1 => 'foo', 3 => 'baz'],
        'b' => [2 => 'bar']
    ];

Finalmente, você pode usar *closures* para construir dinamicamente caminhos de chaves/valores/grupos,
por exemplo, ao trabalhar com entidades e datas (convertidas em instâncias ``I18n\DateTime``
pelo ORM), você pode querer agrupar resultados por data::

    $combined = (new Collection($entities))->combine(
        'id',
        function ($entity) { return $entity; },
        function ($entity) { return $entity->date->toDateString(); }
    );
     $result = $combined->toArray();

    // $result contém
    [
        'date string like 2015-05-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
        'date string like 2015-06-01' => ['entity1->id' => entity1, 'entity2->id' => entity2, ..., 'entityN->id' => entityN]
    ]

.. php:method:: stopWhen(callable $c)

Você pode parar a iteração em qualquer ponto usando o método ``stopWhen()``. Chamá-lo
em uma coleção criará uma nova que parará de produzir resultados se o
callable passado retornar true para um dos elementos::

    $items = [10, 20, 50, 1, 2];
    $collection = new Collection($items);

    $new = $collection->stopWhen(function ($value, $key) {
        // Para no primeiro valor maior que 30
        return $value > 30;
    });

    // $result contém [10, 20];
    $result = $new->toList();

.. php:method:: unfold(callable $callback)

Às vezes, os itens internos de uma coleção conterão arrays ou iteradores
com mais itens. Se você deseja achatar a estrutura interna para iterar uma vez
sobre todos os elementos, você pode usar o método ``unfold()``. Ele criará uma nova
coleção que produzirá cada elemento único aninhado na coleção::

    $items = [[1, 2, 3], [4, 5]];
    $collection = new Collection($items);
    $new = $collection->unfold();

    // $result contém [1, 2, 3, 4, 5];
    $result = $new->toList();

Ao passar um callable para ``unfold()`` você pode controlar quais elementos serão
desdobrados de cada item na coleção original. Isso é útil para retornar
dados de serviços paginados::

    $pages = [1, 2, 3, 4];
    $collection = new Collection($pages);
    $items = $collection->unfold(function ($page, $key) {
        // Um serviço web imaginário que retorna uma página de resultados
        return MyService::fetchPage($page)->toList();
    });

    $allPagesItems = $items->toList();

Se você estiver usando PHP 5.5+, você pode usar a palavra-chave ``yield`` dentro de ``unfold()``
para retornar quantos elementos você precisar para cada item na coleção::

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
processar os elementos em lotes em vez de um por um. Para dividir
uma coleção em vários arrays de um determinado tamanho, você pode usar a função ``chunk()``::

    $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    $collection = new Collection($items);
    $chunked = $collection->chunk(2);
    $chunked->toList(); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]]

A função ``chunk`` é particularmente útil ao fazer processamento em lote, por
exemplo com um resultado de banco de dados::

    $collection = new Collection($articles);
    $collection->map(function ($article) {
            // Altera uma propriedade no artigo
            $article->property = 'changed';
        })
        ->chunk(20)
        ->each(function ($batch) {
            myBulkSave($batch); // Esta função será chamada para cada lote
        });

.. php:method:: chunkWithKeys($chunkSize)

Assim como :php:meth:`chunk()`, ``chunkWithKeys()`` permite que você divida
uma coleção em lotes menores, mas com as chaves preservadas. Isso é útil ao
fragmentar arrays associativos::

    $collection = new Collection([
        'a' => 1,
        'b' => 2,
        'c' => 3,
        'd' => [4, 5]
    ]);
    $chunked = $collection->chunkWithKeys(2);
    $result = $chunked->toList();

    // $result contém
    [
        ['a' => 1, 'b' => 2],
        ['c' => 3, 'd' => [4, 5]]
    ]

Filtragem
=========

.. php:method:: filter($callback)

Coleções permitem que você filtre e crie novas coleções com base no
resultado de funções de callback. Você pode usar ``filter()`` para criar uma nova
coleção de elementos correspondentes a um callback de critério::

    $collection = new Collection($people);
    $ladies = $collection->filter(function ($person, $key) {
        return $person->gender === 'female';
    });
    $guys = $collection->filter(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: reject(callable $c)

O inverso de ``filter()`` é ``reject()``. Este método faz uma filtragem negativa,
removendo elementos que correspondem à função de filtro::

    $collection = new Collection($people);
    $ladies = $collection->reject(function ($person, $key) {
        return $person->gender === 'male';
    });

.. php:method:: every($callback)

Você pode fazer testes de verdade com funções de filtro. Para ver se todos os elementos em
uma coleção correspondem a um teste, você pode usar ``every()``::

    $collection = new Collection($people);
    $allYoungPeople = $collection->every(function ($person) {
        return $person->age < 21;
    });

.. php:method:: some($callback)

Você pode ver se a coleção contém pelo menos um elemento que corresponda a uma função de filtro
usando o método ``some()``::

    $collection = new Collection($people);
    $hasYoungPeople = $collection->some(function ($person) {
        return $person->age < 21;
    });

.. php:method:: match($conditions)

Se você precisa extrair uma nova coleção contendo apenas os elementos que
contêm um determinado conjunto de propriedades, você deve usar o método ``match()``::

    $collection = new Collection($comments);
    $commentsFromMark = $collection->match(['user.name' => 'Mark']);

.. php:method:: firstMatch($conditions)

O nome da propriedade pode ser um caminho separado por pontos. Você pode atravessar
entidades aninhadas e corresponder aos valores que elas contêm. Quando você precisa apenas do primeiro
elemento correspondente de uma coleção, você pode usar ``firstMatch()``::

    $collection = new Collection($comments);
    $comment = $collection->firstMatch([
        'user.name' => 'Mark',
        'active' => true
    ]);

Como você pode ver acima, tanto ``match()`` quanto ``firstMatch()`` permitem que você
forneça várias condições para corresponder. Além disso, as condições podem ser
para caminhos diferentes, permitindo que você expresse condições complexas para corresponder.

Agregação
=========

.. php:method:: reduce($callback, $initial)

A contraparte de uma operação ``map()`` geralmente é um ``reduce``. Esta
função o ajudará a construir um único resultado a partir de todos os elementos em uma
coleção::

    $totalPrice = $collection->reduce(function ($accumulated, $orderLine) {
        return $accumulated + $orderLine->price;
    }, 0);

No exemplo acima, ``$totalPrice`` será a soma de todos os preços únicos
contidos na coleção. Note o segundo argumento para a função ``reduce()``
que recebe o valor inicial para a operação de redução que você está
executando::

    $allTags = $collection->reduce(function ($accumulated, $article) {
        return array_merge($accumulated, $article->tags);
    }, []);

.. php:method:: min(string|callable $callback, $type = SORT_NUMERIC)

Para extrair o valor mínimo de uma coleção com base em uma propriedade, use apenas a
função ``min()``. Isso retornará o elemento completo da coleção e
não apenas o menor valor encontrado::

    $collection = new Collection($people);
    $youngest = $collection->min('age');

    echo $youngest->name;

Você também pode expressar a propriedade a comparar fornecendo um caminho ou uma
função de callback::

    $collection = new Collection($people);
    $personYoungestChild = $collection->min(function ($person) {
        return $person->child->age;
    });

    $personWithYoungestDad = $collection->min('dad.age');

.. php:method:: max(string|callable $callback, $type = SORT_NUMERIC)

O mesmo pode ser aplicado à função ``max()``, que retornará um único
elemento da coleção tendo o maior valor de propriedade::

    $collection = new Collection($people);
    $oldest = $collection->max('age');

    $personOldestChild = $collection->max(function ($person) {
        return $person->child->age;
    });

    $personWithOldestDad = $collection->max('dad.age');

.. php:method:: sumOf($path = null)

Finalmente, o método ``sumOf()`` retornará a soma de uma propriedade de todos
os elementos::

    $collection = new Collection($people);
    $sumOfAges =  $collection->sumOf('age');

    $sumOfChildrenAges = $collection->sumOf(function ($person) {
        return $person->child->age;
    });

    $sumOfDadAges = $collection->sumOf('dad.age');

.. php:method:: avg($path = null)

Calcula o valor médio dos elementos na coleção. Opcionalmente,
forneça um caminho de correspondência ou função para extrair valores para gerar a média
para::

    $items = [
       ['invoice' => ['total' => 100]],
       ['invoice' => ['total' => 200]],
    ];

    // $average contém 150
    $average = (new Collection($items))->avg('invoice.total');

.. php:method:: median($path = null)

Calcula o valor mediano de um conjunto de elementos. Opcionalmente, forneça um caminho de correspondência
ou função para extrair valores para gerar a mediana para::

    $items = [
      ['invoice' => ['total' => 400]],
      ['invoice' => ['total' => 500]],
      ['invoice' => ['total' => 100]],
      ['invoice' => ['total' => 333]],
      ['invoice' => ['total' => 200]],
    ];

    // $median contém 333
    $median = (new Collection($items))->median('invoice.total');


Agrupamento e Contagem
-----------------------

.. php:method:: groupBy($callback)

Os valores da coleção podem ser agrupados por chaves diferentes em uma nova coleção quando
compartilham o mesmo valor para uma propriedade::

    $students = [
        ['name' => 'Mark', 'grade' => 9],
        ['name' => 'Andrew', 'grade' => 10],
        ['name' => 'Stacy', 'grade' => 10],
        ['name' => 'Barbara', 'grade' => 9]
    ];
    $collection = new Collection($students);
    $studentsByGrade = $collection->groupBy('grade');
    $result = $studentsByGrade->toArray();

    // $result contém
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

Como de costume, é possível fornecer um caminho separado por pontos para propriedades aninhadas
ou sua própria função de callback para gerar os grupos dinamicamente::

    $commentsByUserId = $comments->groupBy('user.id');

    $classResults = $students->groupBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

.. php:method:: countBy($callback)

Se você deseja apenas saber o número de ocorrências por grupo, você pode fazê-lo
usando o método ``countBy()``. Ele recebe os mesmos argumentos que ``groupBy``, então
deve ser familiar para você::

    $classResults = $students->countBy(function ($student) {
        return $student->grade > 6 ? 'approved' : 'denied';
    });

    // O resultado pode parecer com isso quando convertido para array:
    ['approved' => 70, 'denied' => 20]

.. php:method:: indexBy($callback)

Haverá certos casos em que você sabe que um elemento é único para a propriedade
pela qual deseja agrupar. Se você deseja um único resultado por grupo, pode usar a
função ``indexBy()``::

    $usersById = $users->indexBy('id');

    // Quando convertido para array, o resultado pode parecer
    [
        1 => 'markstory',
        3 => 'jose_zap',
        4 => 'jrbasso'
    ]

Assim como com a função ``groupBy()`` você também pode usar um caminho de propriedade ou
um callback::

    $articlesByAuthorId = $articles->indexBy('author.id');

    $filesByHash = $files->indexBy(function ($file) {
        return md5($file);
    });

.. php:method:: zip($items)

Os elementos de diferentes coleções podem ser agrupados usando o
método ``zip()``. Ele retornará uma nova coleção contendo um array agrupando
os elementos de cada coleção que estão colocados na mesma posição::

    $odds = new Collection([1, 3, 5]);
    $pairs = new Collection([2, 4, 6]);
    $combined = $odds->zip($pairs)->toList(); // [[1, 2], [3, 4], [5, 6]]

Você também pode compactar várias coleções de uma vez::

    $years = new Collection([2013, 2014, 2015, 2016]);
    $salaries = [1000, 1500, 2000, 2300];
    $increments = [0, 500, 500, 300];

    $rows = $years->zip($salaries, $increments);
    $result = $rows->toList();

    // $result contém
    [
        [2013, 1000, 0],
        [2014, 1500, 500],
        [2015, 2000, 500],
        [2016, 2300, 300]
    ]

Como você já pode ver, o método ``zip()`` é muito útil para transpor
arrays multidimensionais::

    $data = [
        2014 => ['jan' => 100, 'feb' => 200],
        2015 => ['jan' => 300, 'feb' => 500],
        2016 => ['jan' => 400, 'feb' => 600],
    ];

    // Obtendo dados de janeiro e fevereiro juntos

    $firstYear = new Collection(array_shift($data));
    $result = $firstYear->zip($data[0], $data[1])->toList();

    // Ou $firstYear->zip(...$data) em PHP >= 5.6

    // $result contém
    [
        [100, 300, 400],
        [200, 500, 600]
    ]

Ordenação
=========

.. php:method:: sortBy($callback, $order = SORT_DESC, $sort = SORT_NUMERIC)

Os valores da coleção podem ser ordenados em ordem crescente ou decrescente com base em
uma coluna ou função personalizada. Para criar uma nova coleção ordenada a partir dos valores
de outra, você pode usar ``sortBy``::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age');

Como visto acima, você pode ordenar passando o nome de uma coluna ou propriedade que
está presente nos valores da coleção. Você também pode especificar um caminho de propriedade
em vez disso usando a notação de ponto. O próximo exemplo ordenará artigos por
nome do autor::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('author.name');

O método ``sortBy()`` é flexível o suficiente para permitir que você especifique uma função extratora
que permitirá selecionar dinamicamente o valor a ser usado para comparar dois
valores diferentes na coleção::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy(function ($article) {
        return $article->author->name . '-' . $article->title;
    });

Para especificar em qual direção a coleção deve ser ordenada, você precisa
fornecer ``SORT_ASC`` ou ``SORT_DESC`` como o segundo parâmetro para
ordenação em direção crescente ou decrescente, respectivamente. Por padrão,
as coleções são ordenadas em direção decrescente::

    $collection = new Collection($people);
    $sorted = $collection->sortBy('age', SORT_ASC);

Às vezes, você precisará especificar qual tipo de dados está tentando comparar
para obter resultados consistentes. Para esse propósito, você deve fornecer um terceiro
argumento na função ``sortBy()`` com uma das seguintes constantes:

- **SORT_NUMERIC**: Para comparar números
- **SORT_STRING**: Para comparar valores de string
- **SORT_NATURAL**: Para ordenar strings contendo números e você gostaria que esses
  números fossem ordenados de forma natural. Por exemplo: mostrando "10" após "2".
- **SORT_LOCALE_STRING**: Para comparar strings com base na localidade atual.

Por padrão, ``SORT_NUMERIC`` é usado::

    $collection = new Collection($articles);
    $sorted = $collection->sortBy('title', SORT_ASC, SORT_NATURAL);

.. warning::

    Muitas vezes é caro iterar coleções ordenadas mais de uma vez. Se você
    planeja fazer isso, considere converter a coleção em um array ou simplesmente use
    o método ``compile()`` nela.

Trabalhando com Dados de Árvore
================================

.. php:method:: nest($idPath, $parentPath, $nestingKey = 'children')

Nem todos os dados devem ser representados de forma linear. Coleções facilitam
a construção e achatamento de estruturas hierárquicas ou aninhadas. Criar
uma estrutura aninhada onde os filhos são agrupados por uma propriedade de identificador pai
pode ser feito com o método ``nest()``.

Dois parâmetros são necessários para esta função. O primeiro é a propriedade
representando o identificador do item. O segundo parâmetro é o nome da
propriedade representando o identificador do item pai::

    $collection = new Collection([
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds'],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish'],
    ]);
    $nested = $collection->nest('id', 'parent_id');
    $result = $nested->toList();

    // $result contém
    [
        [
            'id' => 1,
            'parent_id' => null,
            'name' => 'Birds',
            'children' => [
                ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds', 'children' => []],
                ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle', 'children' => []],
                ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull', 'children' => []],
            ],
        ],
        [
            'id' => 6,
            'parent_id' => null,
            'name' => 'Fish',
            'children' => [
                ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish', 'children' => []],
            ],
        ],
    ];

Os elementos filhos são aninhados dentro da propriedade ``children`` dentro de cada um dos
itens na coleção. Este tipo de representação de dados é útil para
renderizar menus ou atravessar elementos até um certo nível na árvore.

.. php:method:: listNested($order = 'desc', $nestingKey = 'children')

O inverso de ``nest()`` é ``listNested()``. Este método permite achatar
uma estrutura de árvore de volta em uma estrutura linear. Ele recebe dois parâmetros; o
primeiro é o modo de travessia (asc, desc ou leaves), e o segundo é
o nome da propriedade contendo os filhos para cada elemento na
coleção.

Tomando a entrada da coleção aninhada construída no exemplo anterior, podemos
achatá-la::

    $result = $nested->listNested()->toList();

    // $result contém
    [
        ['id' => 1, 'parent_id' => null, 'name' => 'Birds', 'children' => [...]],
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds'],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle'],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull'],
        ['id' => 6, 'parent_id' => null, 'name' => 'Fish', 'children' => [...]],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish']
    ]

Por padrão, a árvore é percorrida da raiz às folhas. Você também pode
instruí-la a retornar apenas os elementos folha na árvore::

    $result = $nested->listNested('leaves')->toList();

    // $result contém
    [
        ['id' => 2, 'parent_id' => 1, 'name' => 'Land Birds', 'children' => [], ],
        ['id' => 3, 'parent_id' => 1, 'name' => 'Eagle', 'children' => [], ],
        ['id' => 4, 'parent_id' => 1, 'name' => 'Seagull', 'children' => [], ],
        ['id' => 5, 'parent_id' => 6, 'name' => 'Clown Fish', 'children' => [], ],
    ]


Depois de converter uma árvore em uma lista aninhada, você pode usar o método ``printer()``
para configurar como a saída da lista deve ser formatada::

    $result = $nested->listNested()->printer('name', 'id', '--')->toArray();

    // $result contém
    [
        1 => 'Birds',
        2 => '--Land Birds',
        3 => '--Eagle',
        4 => '--Seagull',
        6 => 'Fish',
        5 => '--Clown Fish',
    ]

O método ``printer()`` também permite que você use um callback para gerar as chaves e
ou valores::

    $nested->listNested()->printer(
        function ($el) {
            return $el->name;
        },
        function ($el) {
            return $el->id;
        }
    );

Outros Métodos
==============

.. php:method:: isEmpty()

Permite que você veja se uma coleção contém algum elemento::

    $collection = new Collection([]);
    // Retorna true
    $collection->isEmpty();

    $collection = new Collection([1]);
    // Retorna false
    $collection->isEmpty();

.. php:method:: contains($value)

Coleções permitem que você verifique rapidamente se elas contêm um valor específico
usando o método ``contains()``::

    $items = ['a' => 1, 'b' => 2, 'c' => 3];
    $collection = new Collection($items);
    $hasThree = $collection->contains(3);

As comparações são realizadas usando o operador ``===``. Se você deseja fazer tipos de comparação
mais frouxos, você pode usar o método ``some()``.

.. php:method:: shuffle()

Às vezes, você pode desejar mostrar uma coleção de valores em ordem aleatória. Em
ordem para criar uma nova coleção que retornará cada valor em uma posição
aleatória, use o ``shuffle``::

    $collection = new Collection(['a' => 1, 'b' => 2, 'c' => 3]);

    // Isso pode retornar [2, 3, 1]
    $collection->shuffle()->toList();

.. php:method:: transpose()

Quando você transpõe uma coleção, você obtém uma nova coleção contendo uma linha feita
de cada uma das colunas originais::

    $items = [
        ['Products', '2012', '2013', '2014'],
        ['Product A', '200', '100', '50'],
        ['Product B', '300', '200', '100'],
        ['Product C', '400', '300', '200'],
    ];
    $transpose = (new Collection($items))->transpose();
    $result = $transpose->toList();

    // $result contém
    [
        ['Products', 'Product A', 'Product B', 'Product C'],
        ['2012', '200', '300', '400'],
        ['2013', '100', '200', '300'],
        ['2014', '50', '100', '200'],
    ]

Retirando Elementos
-------------------

.. php:method:: sample($length = 10)

Embaralhar uma coleção geralmente é útil ao fazer análises estatísticas rápidas.
Outra operação comum ao fazer esse tipo de tarefa é retirar alguns
valores aleatórios de uma coleção para que mais testes possam ser realizados neles.
Por exemplo, se você quisesse selecionar 5 usuários aleatórios aos quais gostaria de aplicar
alguns testes A/B, você pode usar a função ``sample()``::

    $collection = new Collection($people);

    // Retira no máximo 20 usuários aleatórios desta coleção
    $testSubjects = $collection->sample(20);

``sample()`` pegará no máximo o número de valores que você especificar no primeiro
argumento. Se não houver elementos suficientes na coleção para satisfazer a
amostra, a coleção completa em ordem aleatória é retornada.

.. php:method:: take($length, $offset)

Sempre que você quiser pegar uma fatia de uma coleção, use a função ``take()``,
ela criará uma nova coleção com no máximo o número de valores que você especificar no
primeiro argumento, começando da posição passada no segundo argumento::

    $topFive = $collection->sortBy('age')->take(5);

    // Pega 5 pessoas da coleção começando da posição 4
    $nextTopFive = $collection->sortBy('age')->take(5, 4);

As posições são baseadas em zero, portanto o primeiro número de posição é ``0``.

.. php:method:: skip($length)

Embora o segundo argumento de ``take()`` possa ajudá-lo a pular alguns elementos antes
de obtê-los da coleção, você também pode usar ``skip()`` para o mesmo
propósito como uma forma de pegar o restante dos elementos após uma certa posição::

    $collection = new Collection([1, 2, 3, 4]);
    $allExceptFirstTwo = $collection->skip(2)->toList(); // [3, 4]

.. php:method:: first()

Um dos usos mais comuns de ``take()`` é obter o primeiro elemento na
coleção. Um método de atalho para alcançar o mesmo objetivo é usar o
método ``first()``::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->first(); // Retorna 5

.. php:method:: last()

Da mesma forma, você pode obter o último elemento de uma coleção usando o método ``last()``::

    $collection = new Collection([5, 4, 3, 2]);
    $collection->last(); // Retorna 2

Expandindo Coleções
--------------------

.. php:method:: append(array|Traversable $items)

Você pode compor várias coleções em uma única. Isso permite que você
reúna dados de várias fontes, concatene-os e aplique outras funções de coleção
a eles de forma muito suave. O método ``append()`` retornará uma nova
coleção contendo os valores de ambas as fontes::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->append($phpTweets);

    // Tweets contendo `cakefest` de ambas as fontes
    $myTimeline->filter(function ($tweet) {
        return strpos($tweet, 'cakefest');
    });

.. php:method:: appendItem($value, $key)

Permite adicionar um item com uma chave opcional à coleção. Se você
especificar uma chave que já existe na coleção, o valor não será
sobrescrito::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->appendItem($newTweet, 99);

.. php:method:: prepend($items)

O método ``prepend()`` retornará uma nova coleção contendo os valores de
ambas as fontes::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->prepend($phpTweets);

.. php:method:: prependItem($value, $key)

Permite adicionar um item ao início com uma chave opcional à coleção. Se você
especificar uma chave que já existe na coleção, o valor não será
sobrescrito::

    $cakephpTweets = new Collection($tweets);
    $myTimeline = $cakephpTweets->prependItem($newTweet, 99);

.. warning::

    Ao anexar de diferentes fontes, você pode esperar algumas chaves de ambas
    as coleções serem as mesmas. Por exemplo, ao anexar dois arrays simples.
    Isso pode apresentar um problema ao converter uma coleção em um array usando
    ``toArray()``. Se você não quiser que valores de uma coleção substituam
    outros na anterior com base em sua chave, certifique-se de chamar
    ``toList()`` para descartar as chaves e preservar todos os valores.

Modificando Elementos
----------------------

.. php:method:: insert($path, $items)

Às vezes, você pode ter dois conjuntos separados de dados que gostaria de inserir
os elementos de um conjunto em cada um dos elementos do outro conjunto. Este é
um caso muito comum quando você busca dados de uma fonte de dados que não suporta
mesclagem de dados ou junções nativamente.

Coleções oferecem um método ``insert()`` que permitirá inserir cada um dos
elementos em uma coleção em uma propriedade dentro de cada um dos elementos de
outra coleção::

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
    $result = $merged->toArray();

    // $result contém
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose', 'skills' => ['Javascript', 'Prolog']]
    ];

O primeiro parâmetro para o método ``insert()`` é um caminho separado por pontos de
propriedades a seguir para que os elementos possam ser inseridos nessa posição. O
segundo argumento é qualquer coisa que possa ser convertida em um objeto de coleção.

Por favor, observe que os elementos são inseridos pela posição em que são encontrados, portanto,
o primeiro elemento da segunda coleção é mesclado no primeiro
elemento da primeira coleção.

Se não houver elementos suficientes na segunda coleção para inserir na
primeira, então a propriedade de destino não estará presente::

    $languages = [
        ['PHP', 'Python', 'Ruby'],
        ['Bash', 'PHP', 'Javascript']
    ];

    $merged = (new Collection($users))->insert('skills', $languages);
    $result = $merged->toArray();

    // $result contém
    [
        ['username' => 'mark', 'skills' => ['PHP', 'Python', 'Ruby']],
        ['username' => 'juan', 'skills' => ['Bash', 'PHP', 'Javascript']],
        ['username' => 'jose']
    ];

O método ``insert()`` pode operar elementos de array ou objetos que implementam a
interface ``ArrayAccess``.

Tornando os Métodos de Coleção Reutilizáveis
---------------------------------------------

Usar closures para métodos de coleção é ótimo quando o trabalho a ser feito é pequeno
e focado, mas pode ficar confuso muito rapidamente. Isso se torna mais óbvio quando
muitos métodos diferentes precisam ser chamados ou quando o comprimento do closure
dos métodos é mais do que apenas algumas linhas.

Também há casos em que a lógica usada para os métodos de coleção pode ser
reutilizada em várias partes de sua aplicação. É recomendável que você
considere extrair lógica de coleção complexa para classes separadas. Por exemplo,
imagine um closure longo como este::

        $collection
                ->map(function ($row, $key) {
                    if (!empty($row['items'])) {
                        $row['total'] = collection($row['items'])->sumOf('price');
                    }

                    if (!empty($row['total'])) {
                        $row['tax_amount'] = $row['total'] * 0.25;
                    }

                    // Mais código aqui...

                    return $modifiedRow;
                });

Isso pode ser refatorado criando outra classe::

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

                    // Mais código aqui...

                    return $modifiedRow;
                }
        }

        // Use a lógica em sua chamada map()
        $collection->map(new TotalOrderCalculator)

.. php:method:: through($callback)

Às vezes, uma cadeia de chamadas de métodos de coleção pode se tornar reutilizável em outras partes
de sua aplicação, mas apenas se elas forem chamadas nessa ordem específica. Em
esses casos, você pode usar ``through()`` em combinação com uma classe implementando
``__invoke`` para distribuir suas chamadas úteis de processamento de dados::

        $collection
                ->map(new ShippingCostCalculator)
                ->map(new TotalOrderCalculator)
                ->map(new GiftCardPriceReducer)
                ->buffered()
               ...

As chamadas de método acima podem ser extraídas para uma nova classe para que não precisem
ser repetidas toda vez::

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

        // Agora você pode usar o método through() para chamar todos os métodos de uma vez
        $collection->through(new FinalCheckOutRowProcessor);

Otimizando Coleções
--------------------

.. php:method:: buffered()

Coleções geralmente executam a maioria das operações que você cria usando suas funções de
forma preguiçosa. Isso significa que, mesmo que você possa chamar uma função, isso não
significa que ela seja executada imediatamente. Isso é verdade para muitas funções nesta
classe. A avaliação preguiçosa permite que você economize recursos em situações
onde você não usa todos os valores em uma coleção. Você pode não usar todos os
valores quando a iteração para cedo, ou quando uma exceção/caso de falha é alcançado
cedo.

Além disso, a avaliação preguiçosa ajuda a acelerar algumas operações. Considere o
seguinte exemplo::

    $collection = new Collection($oneMillionItems);
    $collection = $collection->map(function ($item) {
        return $item * 2;
    });
    $itemsToShow = $collection->take(30);

Se as coleções não fossem preguiçosas, teríamos executado um milhão de operações,
mesmo que quiséssemos mostrar apenas 30 elementos. Em vez disso, nossa operação de map
foi aplicada apenas aos 30 elementos que usamos. Também podemos
derivar benefícios dessa avaliação preguiçosa para coleções menores quando fazemos
mais de uma operação nelas. Por exemplo: chamar ``map()`` duas vezes e
depois ``filter()``.

A avaliação preguiçosa também tem suas desvantagens. Você pode estar fazendo as mesmas
operações mais de uma vez se otimizar uma coleção prematuramente. Considere
este exemplo::

    $ages = $collection->extract('age');

    $youngerThan30 = $ages->filter(function ($item) {
        return $item < 30;
    });

    $olderThan30 = $ages->filter(function ($item) {
        return $item > 30;
    });

Se iterarmos tanto ``youngerThan30`` quanto ``olderThan30``, a coleção
infelizmente executaria a operação ``extract()`` duas vezes. Isso ocorre porque
as coleções são imutáveis e a operação de extração preguiçosa seria feita para
ambos os filtros.

Felizmente, podemos superar esse problema com uma única função. Se você planeja reutilizar
os valores de certas operações mais de uma vez, você pode compilar os resultados
em outra coleção usando a função ``buffered()``::

    $ages = $collection->extract('age')->buffered();
    $youngerThan30 = ...
    $olderThan30 = ...

Agora, quando ambas as coleções forem iteradas, elas chamarão apenas a
operação de extração uma vez.

Tornando Coleções Rebobináveis
-------------------------------

O método ``buffered()`` também é útil para converter iteradores não rebobináveis
em coleções que podem ser iteradas mais de uma vez::

    // No PHP 5.5+
    public function results()
    {
        ...
        foreach ($transientElements as $e) {
            yield $e;
        }
    }
    $rewindable = (new Collection(results()))->buffered();

Clonando Coleções
------------------

.. php:method:: compile($preserveKeys = true)

Às vezes você precisa obter um clone dos elementos de outra
coleção. Isso é útil quando você precisa iterar o mesmo conjunto de diferentes
lugares ao mesmo tempo. Para clonar uma coleção de outra, use o
método ``compile()``::

    $ages = $collection->extract('age')->compile();

    foreach ($ages as $age) {
        foreach ($collection as $element) {
            echo h($element->name) . ' - ' . $age;
        }
    }

.. meta::
    :title lang=pt: Coleções
    :keywords lang=pt: coleções, cakephp, append, sort, compile, contains, countBy, each, every, extract, filter, first, firstMatch, groupBy, indexBy, jsonSerialize, map, match, max, min, reduce, reject, sample, shuffle, some, random, sortBy, take, toArray, insert, sumOf, stopWhen, unfold, through
