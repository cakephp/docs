Hash
####

.. php:namespace:: Cake\Utility

.. php:class:: Hash

La gestion de tableau, si elle est bien faite, peut être un outil très
puissant et utile pour construire du code plus intelligent et plus
optimisé. CakePHP offre un ensemble d'utilitaires statiques très
utile dans la classe Hash qui vous permet de faire justement cela.

La classe Hash de CakePHP peut être appelée à partir de n'importe quel
model ou controller de la même façon que pour un appel à Inflector
Exemple: :php:meth:`Hash::combine()`.

.. _hash-path-syntax:

Syntaxe de chemin Hash
======================

La syntaxe de chemin décrite ci-dessous est utilisée par toutes les méthodes
dans ``hash()``. Les parties de la syntaxe du chemin ne sont pas toutes
disponibles dans toutes les méthodes. Une expression en chemin est faite
depuis n'importe quel nombre de tokens. Les Tokens sont composés de deux
groupes. Les Expressions sont utilisées pour parcourir le tableau de données,
alors que les matchers sont utilisés pour qualifier les éléments. Vous
appliquez les matchers aux éléments de l'expression.

Types d'expression
------------------

+--------------------------------+--------------------------------------------+
| Expression                     | Définition                                 |
+================================+============================================+
| ``{n}``                        | Représente une clé numérique. Va matcher   |
|                                | toute chaîne ou clé numérique.             |
+--------------------------------+--------------------------------------------+
| ``{s}``                        | Représente une chaîne. Va matcher toute    |
|                                | valeur de chaîne y compris les valeurs de  |
|                                | chaîne numérique.                          |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | Matche les clés avec exactement la même    |
|                                | valeur.                                    |
+--------------------------------+--------------------------------------------+

Tous les éléments d'expression supportent toutes les méthodes. En plus des
éléments d'expression, vous pouvez utiliser les attributs qui matchent avec
certaines méthodes. Il y a ``extract()``, ``combine()``, ``format()``,
``check()``, ``map()``, ``reduce()``, ``apply()``, ``sort()``, ``insert()``,
``remove()`` et ``nest()``.

Les Types d'Attribut Correspondants
-----------------------------------

+--------------------------------+--------------------------------------------+
| Matcher                        | Définition                                 |
+================================+============================================+
| ``[id]``                       | Match les éléments avec une clé de         |
|                                | tableau donnée.                            |
+--------------------------------+--------------------------------------------+
| ``[id=2]``                     | Match les éléments avec un id égal à 2.    |
+--------------------------------+--------------------------------------------+
| ``[id!=2]``                    | Match les éléments avec un id non égal à 2.|
+--------------------------------+--------------------------------------------+
| ``[id>2]``                     | Match les éléments avec un id supérieur    |
|                                | à 2.                                       |
+--------------------------------+--------------------------------------------+
| ``[id>=2]``                    | Match les éléments avec un id supérieur    |
|                                | ou égal à 2.                               |
+--------------------------------+--------------------------------------------+
| ``[id<2]``                     | Match les éléments avec un id inférieur    |
|                                | à 2.                                       |
+--------------------------------+--------------------------------------------+
| ``[id<=2]``                    | Match les éléments avec un id inférieur    |
|                                | ou égal à 2.                               |
+--------------------------------+--------------------------------------------+
| ``[text=/.../]``               | Match les éléments qui ont des valeurs     |
|                                | matchant avec l'expression régulière       |
|                                | à l'intérieur de ``...``.                  |
+--------------------------------+--------------------------------------------+

.. php:staticmethod:: get(array|\ArrayAccess $data, $path, $default = null)

    ``get()`` est une version simplifiée de ``extract()``, elle ne supporte
    que les expressions de chemin direct. Les chemins avec ``{n}``, ``{s}``
    ou les matchers ne sont pas supportés. Utilisez ``get()`` quand vous
    voulez exactement une valeur sortie d'un tableau. Si un chemin correspondant
    n'est pas trouvé, la valeur par défaut sera retournée.

.. php:staticmethod:: extract(array|\ArrayAccess $data, $path)

    ``Hash::extract()`` supporte toutes les expressions, les components
    matcher de la :ref:`hash-path-syntax`. Vous pouvez utiliser l'extract pour
    récupérer les données à partir des tableaux, ou bien un objet implémentant
    l'interface ``ArrayAccess`` avec des chemins arbitraires rapidement sans
    avoir à parcourir les structures de données. A la place, vous utilisez les
    expressions de chemin pour qualifier les éléments que vous souhaitez
    retourner::

        // Utilisation habituelle:
        $users = [
            ['id' => 1, 'name' => 'mark'],
            ['id' => 2, 'name' => 'jane'],
            ['id' => 3, 'name' => 'sally'],
            ['id' => 4, 'name' => 'jose'],
        ];
        $results = Hash::extract($users, '{n}.id');
        // $results égal à:
        // [1,2,3,4];

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    Insère ``$values`` dans un tableau tel que défini dans ``$path``::

        $a = [
            'pages' => ['name' => 'page']
        ];
        $result = Hash::insert($a, 'files', ['name' => 'files']);
        // $result ressemble maintenant à:
        [
            [pages] => [
                    [name] => page
            ]
            [files] => [

                    [name] => files
            ]
        ]

    Vous pouvez utiliser les chemins en utilisant ``{n}`` et ``{s}`` pour
    insérer des données dans des points multiples::

        $users = Hash::insert($users, '{n}.new', 'value');

    Les matchers d'attribut fonctionnent aussi avec ``insert()``::

        $data = [
            0 => ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::insert($data, '{n}[up].Item[id=4].new', 9);
        /* $result ressemble maintenant à:
            [
                ['up' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['up' => true, 'Item' => ['id' => 4, 'title' => 'fourth', 'new' => 9]],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: remove(array $data, $path = null)

    Retire tous les éléments d'un tableau qui matche avec ``$path``::

        $a = [
            'pages' => ['name' => 'page'],
            'files' => ['name' => 'files']
        ];
        $result = Hash::remove($a, 'files');
        /* $result ressemble maintenant à:
            [
                [pages] => [
                        [name] => page
            ]

            ]
        */

    L'utilisation de ``{n}`` et ``{s}`` vous autorisera à retirer les valeurs
    multiples en une fois. Vous pouvez aussi utiliser les matchers d'attribut
    avec ``remove()``::

        $data = [
            0 => ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
            1 => ['Item' => ['id' => 2, 'title' => 'second']],
            2 => ['Item' => ['id' => 3, 'title' => 'third']],
            3 => ['clear' => true, 'Item' => ['id' => 4, 'title' => 'fourth']],
            4 => ['Item' => ['id' => 5, 'title' => 'fifth']],
        ];
        $result = Hash::remove($data, '{n}[clear].Item[id=4]');
        /* $result ressemble maintenant à:
            [
                ['clear' => true, 'Item' => ['id' => 1, 'title' => 'first']],
                ['Item' => ['id' => 2, 'title' => 'second']],
                ['Item' => ['id' => 3, 'title' => 'third']],
                ['clear' => true],
                ['Item' => ['id' => 5, 'title' => 'fifth']],
            ]
        */

.. php:staticmethod:: combine(array $data, $keyPath = null, $valuePath = null, $groupPath = null)

    Crée un tableau associatif en utilisant ``$keyPath`` en clé pour le chemin
    à construire, et optionnellement ``$valuePath`` comme chemin pour récupérer
    les valeurs. Si ``$valuePath`` n'est pas spécifiée, ou ne matche rien, les
    valeurs seront initialisées à null. Vous pouvez grouper en option les
    valeurs par ce qui est obtenu en suivant le chemin spécifié dans
    ``$groupPath``::

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
        /* $result ressemble maintenant à:
            [
                [2] =>
                [14] =>
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
        /* $result ressemble maintenant à:
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
        /* $result ressemble maintenant à:
            [
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
            ]
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
        /* $result ressemble maintenant à:
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
        /* $result ressemble maintenant à:
            [
                [1] => [
                        [2] => Mariano Iglesias
                ]
                [2] => [
                        [14] => Larry E. Masters
                ]
            ]
        */

    Vous pouvez fournir des tableaux pour les deux ``$keyPath`` et ``$valuePath``. Si
    vous le faîtes, la première valeur sera utilisée comme un format de chaîne
    de caractères, pour les valeurs extraites par les autres chemins::

        $result = Hash::combine(
            $a,
            '{n}.User.id',
            ['%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'],
            '{n}.User.group_id'
        );
        /* $result ressemble maintenant à:
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
        /* $result ressemble maintenant à:
            [
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
            ]
        */

.. php:staticmethod:: format(array $data, array $paths, $format)

    Retourne une série de valeurs extraites d'un tableau, formaté avec un
    format de chaîne de caractères::

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

    Détermine si un Hash ou un tableau contient les clés et valeurs exactes
    d'un autre::

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

   Vérifie si un chemin particulier est défini dans un tableau::

        $set = [
            'My Index 1' => ['First' => 'The first item']
        ];
        $result = Hash::check($set, 'My Index 1.First');
        // $result == True

        $result = Hash::check($set, 'My Index 1');
        // $result == True

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
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == False

.. php:staticmethod:: filter(array $data, $callback = ['Hash', 'filter'])

    Filtre les éléments vides en dehors du tableau, en excluant '0'. Vous
    pouvez aussi fournir un ``$callback`` personnalisé pour filtrer les éléments
    de tableau. Votre callback devrait retourner ``false`` pour retirer
    les éléments du tableau résultant::

        $data = [
            '0',
            false,
            true,
            0,
            ['one thing', 'I can tell you', 'is you got to be', false]
        ];
        $res = Hash::filter($data);

        /* $res ressemble maintenant à:
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

    Réduit un tableau multi-dimensionnel en un tableau à une seule dimension::

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
        /* $res ressemble maintenant à:
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

    Développe un tableau qui a déjà été aplatie avec
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
        /* $res ressemble maintenant à:
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

    Cette fonction peut être vue comme un hybride entre le ``array_merge`` et
    le ``array_merge_recursive`` de PHP. La différence entre les deux est que
    si une clé du tableau contient un autre tableau, alors la fonction se
    comporte de façon récursive (pas comme ``array_merge``) mais ne le fait
    pas pour les clés contenant les chaînes de caractères (pas comme
    ``array_merge_recursive``).

    .. note::

        Cette fonction va fonctionner avec un montant illimité d'arguments
        et convertit les paramètres de non-tableau en tableaux.

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

        /* $res ressemble maintenant à:
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
    Vérifie pour voir si toutes les valeurs dans le tableau sont numériques::

        $data = ['one'];
        $res = Hash::numeric(array_keys($data));
        // $res est à true

        $data = [1 => 'one'];
        $res = Hash::numeric($data);
        // $res est à false

.. php:staticmethod:: dimensions (array $data)

    Compte les dimensions d'un tableau. Cette méthode va seulement considérer
    la dimension du premier élément dans le tableau::

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

    Similaire à :php:meth:`~Hash::dimensions()`, cependant cette méthode
    retourne le nombre le plus profond de dimensions de tout élément dans
    le tableau::

        $data = ['1' => '1.1', '2', '3' => ['3.1' => '3.1.1']];
        $result = Hash::maxDimensions($data);
        // $result == 2

        $data = ['1' => ['1.1' => '1.1.1'], '2', '3' => ['3.1' => ['3.1.1' => '3.1.1.1']]];
        $result = Hash::maxDimensions($data);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    Crée un nouveau tableau, en extrayant ``$path``, et mappe ``$function`` à travers
    les résultats. Vous pouvez utiliser les deux, expression et le matching
    d'éléments avec cette méthode::

        // Appel de la fonction noop $this->noop() sur chaque element de $data
        $result = Hash::map($data, "{n}", [$this, 'noop']);

        public function noop(array $array)
        {
            // Fait des choses au tableau et retourne les résultats
            return $array;
        }

.. php:staticmethod:: reduce(array $data, $path, $function)

    Crée une valeur unique, en extrayant ``$path``, et en réduisant les résultats
    extraits avec ``$function``. Vous pouvez utiliser les deux, expression et le
    matching d'éléments avec cette méthode.

.. php:staticmethod:: apply(array $data, $path, $function)

    Appliquer un callback à un ensemble de valeurs extraites en utilisant
    ``$function``. La fonction va récupérer les valeurs extraites en premier
    argument::

        $data = [
            ['date' => '01-01-2016', 'booked' => true],
            ['date' => '01-01-2016', 'booked' => false],
            ['date' => '02-01-2016', 'booked' => true]
        ];
        $result = Hash::apply($data, '{n}[booked=true].date', 'array_count_values');
        /* $result ressemble maintenant à:
            [
                '01-01-2016' => 1,
                '02-01-2016' => 1,
            ]
        */

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    :rtype: array

    Trie un tableau selon n'importe quelle valeur, déterminé par une
    :ref:`hash-path-syntax`. Seuls les éléments de type expression sont
    supportés par cette méthode::

        $a = [
            0 => ['Person' => ['name' => 'Jeff']],
            1 => ['Shirt' => ['color' => 'black']]
        ];
        $result = Hash::sort($a, '{n}.Person.name', 'asc');
        /* $result ressemble maintenant à:
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

    ``$dir`` peut être soit ``asc``, soit ``desc``. Le ``$type``
    peut être une des valeurs suivantes:

    * ``regular`` pour le trier régulier.
    * ``numeric`` pour le tri des valeurs avec leurs valeurs numériques
      équivalentes.
    * ``string`` pour le tri des valeurs avec leur valeur de chaîne.
    * ``natural`` pour trier les valeurs d'une façon humaine. Va trier
      ``foo10`` en-dessous de ``foo2`` par exemple.

.. php:staticmethod:: diff(array $data, array $compare)

    Calcule la différence entre deux tableaux::

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
        /* $result ressemble maintenant à:
            [
                [2] => [
                        [name] => contact
                ]
            ]
        */

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    Cette fonction fusionne les deux tableaux et pousse les différences
    dans les données à la fin du tableau résultant.

    **Exemple 1**
    ::

        $array1 = ['ModelOne' => ['id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2']];
        $array2 = ['ModelOne' => ['id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3']];
        $res = Hash::mergeDiff($array1, $array2);

        /* $res ressemble maintenant à:
            [
                [ModelOne] => [
                        [id] => 1001
                        [field_one] => a1.m1.f1
                        [field_two] => a1.m1.f2
                        [field_three] => a3.m1.f3
                    ]
            ]
        */

    **Exemple 2**
    ::

        $array1 = ["a" => "b", 1 => 20938, "c" => "string"];
        $array2 = ["b" => "b", 3 => 238, "c" => "string", ["extra_field"]];
        $res = Hash::mergeDiff($array1, $array2);
        /* $res ressemble maintenant à:
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

    Normalise un tableau. Si ``$assoc`` est à ``true``, le tableau résultant
    sera normalisé en un tableau associatif. Les clés numériques avec les
    valeurs, seront convertis en clés de type chaîne avec des valeurs null.
    Normaliser un tableau, facilite l'utilisation des résultats avec
    :php:meth:`Hash::merge()`::

        $a = ['Tree', 'CounterCache',
            'Upload' => [
                'folder' => 'products',
                'fields' => ['image_1_id', 'image_2_id']
            ]
        ];
        $result = Hash::normalize($a);
        /* $result ressemble maintenant à:
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
        /* $result ressemble maintenant à:
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

    Prend un ensemble de tableau aplati, et crée une structure de données
    imbriquée ou chaînée.

    **Options:**

    - ``children`` Le nom de la clé à utiliser dans l'ensemble de résultat
      pour les enfants. Par défaut à 'children'.
    - ``idPath`` Le chemin vers une clé qui identifie chaque entrée. Doit être
      compatible avec :php:meth:`Hash::extract()`. Par défaut à
      ``{n}.$alias.id``
    - ``parentPath`` Le chemin vers une clé qui identifie le parent de chaque
      entrée. Doit être compatible avec :php:meth:`Hash::extract()`. Par défaut
      à ``{n}.$alias.parent_id``.
    - ``root`` L'id du résultat le plus désiré.

    Exemple::

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
        /* $result ressemble maintenant à:
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
    :title lang=fr: Hash
    :keywords lang=fr: tableau, array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
