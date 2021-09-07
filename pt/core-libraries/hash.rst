Hash
####

.. php:namespace:: Cake\Utility

.. php:class:: Hash

O gerenciamento de matrizes, se feito da maneira certa, pode ser uma 
ferramenta muito poderosa e útil para construir um código mais inteligente 
e otimizado. O CakePHP oferece um conjunto muito útil de utilitários estáticos 
na classe Hash que permitem que você faça exatamente isso.

A classe Hash do CakePHP pode ser chamada de qualquer template ou controlador da 
mesma forma que o Inflector é chamado. Exemplo: :php:meth:`Hash::combine()`.

.. _hash-path-syntax:

Sintaxe do Caminho de Hash
==========================

A sintaxe de caminho descrita abaixo é usada por todos os métodos em ``Hash``. 
Nem todas as partes da sintaxe do caminho estão disponíveis em todos os métodos. 
Uma expressão de caminho é feita de qualquer número de tokens. Os tokens são compostos 
por dois grupos. Expressões são usadas para percorrer os dados da matriz, enquanto as
expressões são usadas para qualificar elementos.

Tipos de Expressão
------------------

+--------------------------------+--------------------------------------------+
| Expressão                      | Definição                                  |
+================================+============================================+
| ``{n}``                        | Representa uma chave numérica. Irá         |
|                                | corresponder a qualquer string ou chave    |
|                                | numérica                                   |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | Representa uma string. Irá corresponder a  |
|                                | qualquer valor de string, incluindo        |
|                                | valores de string numéricos.               |
+--------------------------------+--------------------------------------------+
| ``{*}``                        | Corresponde a qualquer valor.              |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | Corresponde às chaves exatamente com o     |
|                                | mesmo valor.                               |
+--------------------------------+--------------------------------------------+

Todos os elementos de expressão são suportados por todos os métodos. Além de 
elementos de expressão, você pode usar a correspondência de atributos com certos 
métodos. Eles são: ``extract()``, ``combine()``, ``format()``, ``check()``, ``map()``, ``reduce()``,
``apply()``, ``sort()``, ``insert()``, ``remove()`` e ``nest()``.

Tipos de Correspondência de Atributos
-------------------------------------

+--------------------------------+--------------------------------------------+
| Expressão                      | Definição                                  |
+================================+============================================+
| ``[id]``                       | Combine elementos com uma determinada      |
|                                | chave de array.                            |
+--------------------------------+--------------------------------------------+
| ``[id=2]``                     | Combine elementos com id igual a 2.        |
+--------------------------------+--------------------------------------------+
| ``[id!=2]``                    | Combine elementos com id diferente de 2.   |
+--------------------------------+--------------------------------------------+
| ``[id>2]``                     | Combine elementos com id maior que 2.      |
+--------------------------------+--------------------------------------------+
| ``[id>=2]``                    | Combine elementos com id maior ou          |
|                                | igual a 2.                                 |
+--------------------------------+--------------------------------------------+
| ``[id<2]``                     | Combine elementos com id menor que 2       |
+--------------------------------+--------------------------------------------+
| ``[id<=2]``                    | Combine elementos com id menor ou          |
|                                | igual a 2.                                 |
+--------------------------------+--------------------------------------------+
| ``[text=/.../]``               | Combine elementos que possuem valores      |
|                                | correspondentes à expressão regular        |
|                                | dentro de ``...``.                         |
+--------------------------------+--------------------------------------------+

.. php:staticmethod:: get(array|\ArrayAccess $data, $path, $default = null)

    ``get()`` é uma versão simplificada de ``extract()``, ele só suporta expressões 
    de caminho direto. Caminhos como ``{n}``, ``{s}``, ``{*}`` ou expressões não 
    são suportados. Use ``get()`` quando quiser exatamente um valor de uma matriz. 
    Se um caminho correspondente não for encontrado, o valor padrão será retornado.

.. php:staticmethod:: extract(array|\ArrayAccess $data, $path)

    ``Hash::extract()`` suporta todas as expressões e componentes de correspondência 
    :ref:`hash-path-syntax`. Você pode usar a extração para recuperar dados de matrizes
    ou objetos que implementam a interface ``ArrayAccess``, ao longo de caminhos arbitrários 
    rapidamente, sem ter que percorrer as estruturas de dados. Em vez disso, você usa expressões 
    de caminho para qualificar quais elementos você deseja que sejam retornados::

        // Uso comum:
        $users = [
            ['id' => 1, 'name' => 'mark'],
            ['id' => 2, 'name' => 'jane'],
            ['id' => 3, 'name' => 'sally'],
            ['id' => 4, 'name' => 'jose'],
        ];
        $results = Hash::extract($users, '{n}.id');
        // $results é igual a:
        // [1,2,3,4];

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    Insere ``$values`` em uma matriz conforme definido por ``$path``::

        $a = [
            'pages' => ['name' => 'page']
        ];
        $result = Hash::insert($a, 'files', ['name' => 'files']);
        // $result agora parece:
        [
            [pages] => [
                [name] => page
            ]
            [files] => [
                [name] => files
            ]
        ]

    Você pode usar caminhos usando ``{n}``, ``{s}`` e ``{*}`` para inserir dados em vários pontos::

        $users = Hash::insert($users, '{n}.new', 'value');

    As expressões de atributos funcionam com ``insert()`` também::

        $data = [
            0 => ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::insert($data, '{n}[up].Item[id=4].new', 9);
        /* $result agora se parece:
            [
                ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth', 'new' => 9]],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: remove(array $data, $path)

    Remove todos os elementos de uma matriz que corresponde a ``$path``. ::

        $a = [
            'pages' => ['name' => 'page'],
            'files' => ['name' => 'files']
        ];
        $result = Hash::remove($a, 'files');
        /* $result agora se parece:
            [
                [pages] => [
                    [name] => page
                ]

            ]
        */

    Usando ``{n}``, ``{s}`` e ``{*}`` permitirá que você remova múltiplos valores 
    de uma vez. Você também pode usar expressões de atributo com ``remove()``::

        $data = [
            0 => ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['clear' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::remove($data, '{n}[clear].Item[id=4]');
        /* $result agora se parece:
            [
                ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['clear' => true],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: combine(array $data, $keyPath, $valuePath = null, $groupPath = null)

    Cria uma matriz associativa usando um ``$keyPath`` como o caminho para construir 
    suas chaves, e opcionalmente ``$valuePath`` como o caminho para obter os valores. 
    Se ``$valuePath`` não for especificado, ou não corresponder a nada, os valores 
    serão inicializados como nulos. Você pode opcionalmente agrupar os valores pelo 
    que é obtido ao seguir o caminho especificado em ``$groupPath``.::

        $a = [
            [
                'User' => [
                    'id' => 2,
                    'group_id' => 1,
                    'Data' => [
                        'user' => 'mariano.iglesias',
                        'name' => 'Mariano Iglesias'
                    ]
                ]
            ],
            [
                'User' => [
                    'id' => 14,
                    'group_id' => 2,
                    'Data' => [
                        'user' => 'phpnut',
                        'name' => 'Larry E. Masters'
                    ]
                ]
            ],
        ];

        $result = Hash::combine($a, '{n}.User.id');
        /* $result agora se parece com:
            [
                [2] =>
                [14] =>
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.user');
        /* $result agora se parece com:
            [
                [2] => 'mariano.iglesias'
                [14] => 'phpnut'
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
        /* $result agora se parece com:
            [
                [2] => [
                        [user] => mariano.iglesias
                        [name] => Mariano Iglesias
                ]
                [14] => [
                        [user] => phpnut
                        [name] => Larry E. Masters
                ]
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name');
        /* $result agora se parece com:
            [
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
        /* $result agora se parece com:
            [
                [1] => [
                        [2] => [
                                [user] => mariano.iglesias
                                [name] => Mariano Iglesias
                        ]
                ]
                [2] => [
                        [14] => [
                                [user] => phpnut
                                [name] => Larry E. Masters
                        ]
                ]
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
        /* $result agora se parece com:
            [
                [1] => [
                        [2] => Mariano Iglesias
                ]
                [2] => [
                        [14] => Larry E. Masters
                ]
            ]
        */

        // A partir de 3.9.0 $keyPath pode ser nulo 
        $result = Hash::combine($a, null, '{n}.User.Data.name');
        /* $result agora se parece com:
            [
                [0] => Mariano Iglesias
                [1] => Larry E. Masters
            ]
        */

    Você pode fornecer matrizes para ``$keyPath`` e ``$valuePath``. Se você fizer isso, 
    o primeiro valor será usado com o formato de string, para valores extraídos por 
    outros caminhos::

        $result = Hash::combine(
            $a,
            '{n}.User.id',
            ['%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'],
            '{n}.User.group_id'
        );
        /* $result agora se parece com:
            [
                [1] => [
                        [2] => mariano.iglesias: Mariano Iglesias
                ]
                [2] => [
                        [14] => phpnut: Larry E. Masters
                ]
            ]
        */

        $result = Hash::combine(
            $a,
            ['%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'],
            '{n}.User.id'
        );
        /* $result agora se parece com:
            [
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
            ]
        */

.. php:staticmethod:: format(array $data, array $paths, $format)

    Retorna uma série de valores extraídos de uma matriz, formatados 
    com uma string::

        $data = [
            [
                'Person' => [
                    'first_name' => 'Nate',
                    'last_name' => 'Abele',
                    'city' => 'Boston',
                    'state' => 'MA',
                    'something' => '42'
                ]
            ],
            [
                'Person' => [
                    'first_name' => 'Larry',
                    'last_name' => 'Masters',
                    'city' => 'Boondock',
                    'state' => 'TN',
                    'something' => '{0}'
                ]
            ],
            [
                'Person' => [
                    'first_name' => 'Garrett',
                    'last_name' => 'Woodworth',
                    'city' => 'Venice Beach',
                    'state' => 'CA',
                    'something' => '{1}'
                ]
            ]
        ];

        $res = Hash::format($data, ['{n}.Person.first_name', '{n}.Person.something'], '%2$d, %1$s');
        /*
        [
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        ]
        */

        $res = Hash::format($data, ['{n}.Person.first_name', '{n}.Person.something'], '%1$s, %2$d');
        /*
        [
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        ]
        */

.. php:staticmethod:: contains(array $data, array $needle)

    Determina se um Hash ou matriz contém as chaves e valores exatos de outro::

        $a = [
            0 => ['name' => 'main'],
            1 => ['name' => 'about']
        ];
        $b = [
            0 => ['name' => 'main'],
            1 => ['name' => 'about'],
            2 => ['name' => 'contact'],
            'a' => 'b'
        ];

        $result = Hash::contains($a, $a);
        // true
        $result = Hash::contains($a, $b);
        // false
        $result = Hash::contains($b, $a);
        // true

.. php:staticmethod:: check(array $data, string $path = null)

    Verifica se um determinado caminho está definido em uma matriz::

        $set = [
            'My Index 1' => ['First' => 'The first item']
        ];
        $result = Hash::check($set, 'My Index 1.First');
        // $result == true

        $result = Hash::check($set, 'My Index 1');
        // $result == true

        $set = [
            'My Index 1' => [
                'First' => [
                    'Second' => [
                        'Third' => [
                            'Fourth' => 'Heavy. Nesting.'
                        ]
                    ]
                ]
            ]
        ];
        $result = Hash::check($set, 'My Index 1.First.Second');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Second.Third');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == true

        $result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == false

.. php:staticmethod:: filter(array $data, $callback = ['Hash', 'filter'])

    Filtra os elementos vazios da matriz, excluindo '0'. Você também pode 
    fornecer um ``$callback`` personalizado para filtrar os elementos da matriz. 
    O retorno de chamada deve retornar ``false`` para remover elementos da matriz
    resultante::

        $data = [
            '0',
            false,
            true,
            0,
            ['one thing', 'I can tell you', 'is you got to be', false]
        ];
        $res = Hash::filter($data);

        /* $res agora se parece:
            [
                [0] => 0
                [2] => true
                [3] => 0
                [4] => [
                        [0] => one thing
                        [1] => I can tell you
                        [2] => is you got to be
                ]
            ]
        */

.. php:staticmethod:: flatten(array $data, string $separator = '.')

    Nivela uma matriz multidimensional em uma única dimensão::

        $arr = [
            [
                'Post' => ['id' => '1', 'title' => 'First Post'],
                'Author' => ['id' => '1', 'user' => 'Kyle'],
            ],
            [
                'Post' => ['id' => '2', 'title' => 'Second Post'],
                'Author' => ['id' => '3', 'user' => 'Crystal'],
            ],
        ];
        $res = Hash::flatten($arr);
        /* $res now looks like:
            [
                [0.Post.id] => 1
                [0.Post.title] => First Post
                [0.Author.id] => 1
                [0.Author.user] => Kyle
                [1.Post.id] => 2
                [1.Post.title] => Second Post
                [1.Author.id] => 3
                [1.Author.user] => Crystal
            ]
        */

.. php:staticmethod:: expand(array $data, string $separator = '.')

    Expande uma matriz que foi previamente achatada com 
    :php:meth:`Hash::flatten()`::

        $data = [
            '0.Post.id' => 1,
            '0.Post.title' => First Post,
            '0.Author.id' => 1,
            '0.Author.user' => Kyle,
            '1.Post.id' => 2,
            '1.Post.title' => Second Post,
            '1.Author.id' => 3,
            '1.Author.user' => Crystal,
        ];
        $res = Hash::expand($data);
        /* $res agora se parece com:
        [
            [
                'Post' => ['id' => '1', 'title' => 'First Post'],
                'Author' => ['id' => '1', 'user' => 'Kyle'],
            ],
            [
                'Post' => ['id' => '2', 'title' => 'Second Post'],
                'Author' => ['id' => '3', 'user' => 'Crystal'],
            ],
        ];
        */

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    Esta função pode ser considerada um híbrido entre ``array_merge`` e 
    ``array_merge_recursive`` do PHP. A diferença entre as duas é que se 
    uma chave da matriz contém outra matriz, então a função se comporta 
    recursivamente (ao contrário de ``array_merge``), mas não se comporta 
    do mesmo jeito para chaves contendo strings (ao contrário de ``array_merge_recursive``).

    .. note::

        Esta função funcionará com uma quantidade ilimitada de argumentos 
        e casting de parâmetros primitivos para matrizes.

    ::

        $array = [
            [
                'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
                'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
                'description' => 'Importing an sql dump'
            ],
            [
                'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
                'name' => 'pbpaste | grep -i Unpaid | pbcopy',
                'description' => 'Remove all lines that say "Unpaid".',
            ]
        ];
        $arrayB = 4;
        $arrayC = [0 => "test array", "cats" => "dogs", "people" => 1267];
        $arrayD = ["cats" => "felines", "dog" => "angry"];
        $res = Hash::merge($array, $arrayB, $arrayC, $arrayD);

        /* $res agora se parece com:
        [
            [0] => [
                    [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                    [name] => mysql raleigh-workshop-08 < 2008-09-05.sql
                    [description] => Importing an sql dump
            ]
            [1] => [
                    [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                    [name] => pbpaste | grep -i Unpaid | pbcopy
                    [description] => Remove all lines that say "Unpaid".
            ]
            [2] => 4
            [3] => test array
            [cats] => felines
            [people] => 1267
            [dog] => angry
        ]
        */

.. php:staticmethod:: numeric(array $data)

    Verifica se todos os valores da matriz são numéricas::

        $data = ['one'];
        $res = Hash::numeric(array_keys($data));
        // $res é true

        $data = [1 => 'one'];
        $res = Hash::numeric($data);
        // $res é false

.. php:staticmethod:: dimensions (array $data)

    Conta as dimensões de uma matriz. Este método irá considerar 
    apenas a dimensão do primeiro elemento na matriz::

        $data = ['one', '2', 'three'];
        $result = Hash::dimensions($data);
        // $result == 1

        $data = ['1' => '1.1', '2', '3'];
        $result = Hash::dimensions($data);
        // $result == 1

        $data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => '3.1.1']];
        $result = Hash::dimensions($data);
        // $result == 2

        $data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
        $result = Hash::dimensions($data);
        // $result == 1

        $data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
        $result = Hash::dimensions($data);
        // $result == 2

.. php:staticmethod:: maxDimensions(array $data)

    Semelhante a :php:meth:`~Hash::dimensions()`, no entanto, este método 
    retorna, o maior número de dimensões de qualquer elemento na matriz::

        $data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
        $result = Hash::maxDimensions($data);
        // $result == 2

        $data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
        $result = Hash::maxDimensions($data);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    Cria uma nova matriz, extraindo ``$path``, e mapeando ``$function`` nos 
    resultados. Você pode usar expressões e elementos correspondentes com este método::

        // Chame a função noop $this->noop() em cada elemento de $data
        $result = Hash::map($data, "{n}", [$this, 'noop']);

        public function noop(array $array)
        {
            // Faça coisas para a matriz e retorne o resultado
            return $array;
        }

.. php:staticmethod:: reduce(array $data, $path, $function)

    Cria um único valor, extraindo ``$path``, e reduzindo os resultados extraídos 
    com ``$function``. Você pode usar expressões e elementos correspondentes com 
    este método.

.. php:staticmethod:: apply(array $data, $path, $function)

    Aplique um retorno de chamada a um conjunto de valores extraídos 
    usando ``$function``. A função obterá os valores extraídos do 
    primeiro argumento::

        $data = [
            ['date' => '01-01-2016', 'booked' => true],
            ['date' => '01-01-2016', 'booked' => false],
            ['date' => '02-01-2016', 'booked' => true]
        ];
        $result = Hash::apply($data, '{n}[booked=true].date', 'array_count_values');
        /* $result agora parece com:
            [
                '01-01-2016' => 1,
                '02-01-2016' => 1,
            ]
        */

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    Classifica uma matriz por qualquer valor, determinado por :ref:`hash-path-syntax`
    Somente elementos de expressão são suportados por este método::

        $a = [
            0 => ['Person' => ['name' => 'Jeff']],
            1 => ['Shirt' => ['color' => 'black']]
        ];
        $result = Hash::sort($a, '{n}.Person.name', 'asc');
        /* $result agora parece com:
            [
                [0] => [
                        [Shirt] => [
                                [color] => black
                        ]
                ]
                [1] => [
                        [Person] => [
                                [name] => Jeff
                        ]
                ]
            ]
        */

    ``$dir`` pode ser ``asc`` ou ``desc``. ``$type`` pode 
    ser um dos seguintes valores:

    * ``regular`` para ordenamento padrão
    * ``numeric`` para classificar valores como seus equivalentes numéricos.
    * ``string`` para classificar valores como seu valor de string.
    * ``natural`` para classificar valores de uma forma amigável ao humano. 
      Classificará ``foo10`` abaixo de ``foo2`` por exemplo.

.. php:staticmethod:: diff(array $data, array $compare)

    Calcula a diferença entre duas matrizes::

        $a = [
            0 => ['name' => 'main'],
            1 => ['name' => 'about']
        ];
        $b = [
            0 => ['name' => 'main'],
            1 => ['name' => 'about'],
            2 => ['name' => 'contact']
        ];

        $result = Hash::diff($a, $b);
        /* $result agora parece com:
            [
                [2] => [
                        [name] => contact
                ]
            ]
        */

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    Essa função mescla duas matrizes e empurra as diferenças nos 
    dados para a parte inferior da matriz resultante.

    **Exemplo 1**
    ::

        $array1 = ['ModelOne' => ['id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2']];
        $array2 = ['ModelOne' => ['id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3']];
        $res = Hash::mergeDiff($array1, $array2);

        /* $res agora parece com:
            [
                [ModelOne] => [
                        [id] => 1001
                        [field_one] => a1.m1.f1
                        [field_two] => a1.m1.f2
                        [field_three] => a3.m1.f3
                    ]
            ]
        */

    **Exemplo 2**
    ::

        $array1 = ["a" => "b", 1 => 20938, "c" => "string"];
        $array2 = ["b" => "b", 3 => 238, "c" => "string", ["extra_field"]];
        $res = Hash::mergeDiff($array1, $array2);
        /* $res agora parece com:
            [
                [a] => b
                [1] => 20938
                [c] => string
                [b] => b
                [3] => 238
                [4] => [
                        [0] => extra_field
                ]
            ]
        */

.. php:staticmethod:: normalize(array $data, $assoc = true)

    Normaliza uma matriz. Se ``$assoc`` for ``true``, a matriz resultante 
    será normalizada para ser uma matriz associativa. Chaves numéricas com 
    valores serão convertidas em chaves de string com valores nulos. Normalizar 
    uma matriz torna o uso dos resultados com :php:meth:`Hash::merge()` mais fácil::

        $a = ['Tree', 'CounterCache',
            'Upload' => [
                'folder' => 'products',
                'fields' => ['image_1_id', 'image_2_id']
            ]
        ];
        $result = Hash::normalize($a);
        /* $result agora parece com:
            [
                [Tree] => null
                [CounterCache] => null
                [Upload] => [
                        [folder] => products
                        [fields] => [
                                [0] => image_1_id
                                [1] => image_2_id
                        ]
                ]
            ]
        */

        $b = [
            'Cacheable' => ['enabled' => false],
            'Limit',
            'Bindable',
            'Validator',
            'Transactional'
        ];
        $result = Hash::normalize($b);
        /* $result agora parece com:
            [
                [Cacheable] => [
                        [enabled] => false
                ]

                [Limit] => null
                [Bindable] => null
                [Validator] => null
                [Transactional] => null
            ]
        */

.. php:staticmethod:: nest(array $data, array $options = [])

    Pega um conjunto de matriz simples e cria uma estrutura de dados aninhada ou encadeada.

    **Opções:**

    - ``children`` O nome da chave a ser usada no conjunto de resultados para 
      os valores aninhados. O padrão é 'children'.
    - ``idPath`` O caminho para uma chave que identifica cada entrada. Deve ser compatível 
      com :php:meth:`Hash::extract()`. O padrão é ``{n}.$alias.id``
    - ``parentPath`` O caminho para uma chave que identifica o pai de cada entrada. Deve ser compatível com 
      :php:meth:`Hash::extract()`. O padrão é ``{n}.$alias.parent_id``
    - ``root`` O id do resultado desejado mais alto.

    Por exemplo, se você tivesse a seguinte matriz de dados::

        $data = [
            ['ThreadPost' => ['id' => 1, 'parent_id' => null]],
            ['ThreadPost' => ['id' => 2, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 3, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 4, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 5, 'parent_id' => 1]],
            ['ThreadPost' => ['id' => 6, 'parent_id' => null]],
            ['ThreadPost' => ['id' => 7, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 8, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 9, 'parent_id' => 6]],
            ['ThreadPost' => ['id' => 10, 'parent_id' => 6]]
        ];

        $result = Hash::nest($data, ['root' => 6]);
        /* $result agora parece com:
            [
                (int) 0 => [
                    'ThreadPost' => [
                        'id' => (int) 6,
                        'parent_id' => null
                    ],
                    'children' => [
                        (int) 0 => [
                            'ThreadPost' => [
                                'id' => (int) 7,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 1 => [
                            'ThreadPost' => [
                                'id' => (int) 8,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 2 => [
                            'ThreadPost' => [
                                'id' => (int) 9,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ],
                        (int) 3 => [
                            'ThreadPost' => [
                                'id' => (int) 10,
                                'parent_id' => (int) 6
                            ],
                            'children' => []
                        ]
                    ]
                ]
            ]
            */

.. meta::
    :title lang=pt: Hash
    :keywords lang=pt: matriz matriz,caminho de matriz,nome da matriz,chave numerica,expressao regular,configuracao de resultado,nome de pessoas,brackets,sintaxe,cakephp,elementos,php,definir caminho
