Hash
####

.. php:class:: Hash

.. versionadded:: 2.2

La gestion du tableau, si elle est bien faite, peut être un outil très
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
dans ``Hash``. Les parties de la syntaxe du chemin ne sont pas toutes
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
| ``{*}``                        | Représente n'importe quelle valeur, quelque|
|                                | soit le type.                              |
+--------------------------------+--------------------------------------------+
| ``Foo``                        | Matche les clés avec exactement la même    |
|                                | valeur keys with the exact same value.     |
+--------------------------------+--------------------------------------------+

Tous les éléments d'expression supportent toutes les méthodes. En plus des
éléments d'expression, vous pouvez utiliser les attributs qui matchent avec
certaines méthodes. Il y a ``extract()``, ``combine()``, ``format()``,
``check()``, ``map()``, ``reduce()``, ``apply()``, ``sort()``, ``insert()``,
``remove()`` et ``nest()``.

Les Types d'Attribut Correspondants
-----------------------------------

+--------------------------------+--------------------------------------------+
| Matcher                        | Definition                                 |
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

.. versionchanged:: 2.5
    Le support des matcher a été ajouté dans ``insert()`` et ``remove()``.

.. php:staticmethod:: get(array $data, $path, $default = null)

    :rtype: mixed

    ``get()`` est une version simplifiée de ``extract()``, elle ne supporte
    que les expressions de chemin direct. Les chemins avec ``{n}``, ``{s}``
    ou les matchers ne sont pas supportés. Utilisez ``get()`` quand vous
    voulez exactement une valeur sortie d'un tableau. Le troisième paramètre
    sera retourné si le chemin demandé n'a pas été trouvé dans le tableau.

    .. versionchanged:: 2.5
        Le troisième argument ``$default = null`` optionel a été ajouté.

.. php:staticmethod:: extract(array $data, $path)

    :rtype: array

    ``Hash::extract()`` supporte toutes les expressions, les components
    matcher de la :ref:`hash-path-syntax`. Vous pouvez utiliser l'extract pour
    récupérer les données à partir des tableaux, le long des chemins
    arbitraires rapidement sans avoir à parcourir les structures de données.
    A la place, vous utilisez les expressions de chemin pour qualifier
    les éléments que vous souhaitez retourner::

        // Utilisation habituelle:
        $users = $this->User->find("all");
        $results = Hash::extract($users, '{n}.User.id');
        // $results égal à:
        // array(1,2,3,4,5,...);

.. php:staticmethod:: Hash::insert(array $data, $path, $values = null)

    :rtype: array

    Insère $data dans un tableau tel que défini dans ``$path``::

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Hash::insert($a, 'files', array('name' => 'files'));
        // $result ressemble maintenant à:
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
            [files] => Array
                (
                    [name] => files
                )
        )

    Vous pouvez utiliser les chemins en utilisant ``{n}`` et ``{s}`` pour
    insérer des données dans des points multiples::

        $users = $this->User->find('all');
        $users = Set::insert($users, '{n}.User.new', 'value');

    .. versionchanged:: 2.5
        Depuis 2.5.0, les expressions matchant l'attribut fonctionnent avec
        insert().

.. php:staticmethod:: remove(array $data, $path)

    :rtype: array

    Retire tous les éléments d'un tableau qui matche avec $path. ::

        $a = array(
            'pages' => array('name' => 'page'),
            'files' => array('name' => 'files')
        );
        $result = Hash::remove($a, 'files');
        /* $result ressemble maintenant à:
            Array
            (
                [pages] => Array
                    (
                        [name] => page
                    )

            )
        */

    L'utilisation de ``{n}`` et ``{s}`` vous autorisera à retirer les valeurs
    multiples en une fois.

    .. versionchanged:: 2.5
        Depuis 2.5.0, les expressions matchant l'attribut fonctionnent avec
        remove()

.. php:staticmethod:: combine(array $data, $keyPath, $valuePath = null, $groupPath = null)

    :rtype: array

    Crée un tableau associatif en utilisant $keyPath en clé pour le chemin
    à construire, et optionnellement $valuePath comme chemin pour récupérer
    les valeurs. Si $valuePath n'est pas spécifiée, ou ne matche rien, les
    valeurs seront initialisées à null. Vous pouvez grouper en option les
    valeurs par ce qui est obtenu en suivant le chemin spécifié dans
    $groupPath. ::

        $a = array(
            array(
                'User' => array(
                    'id' => 2,
                    'group_id' => 1,
                    'Data' => array(
                        'user' => 'mariano.iglesias',
                        'name' => 'Mariano Iglesias'
                    )
                )
            ),
            array(
                'User' => array(
                    'id' => 14,
                    'group_id' => 2,
                    'Data' => array(
                        'user' => 'phpnut',
                        'name' => 'Larry E. Masters'
                    )
                )
            ),
        );

        $result = Hash::combine($a, '{n}.User.id');
        /* $result ressemble maintenant à:
            Array
            (
                [2] =>
                [14] =>
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data');
        /* $result ressemble maintenant à:
            Array
            (
                [2] => Array
                    (
                        [user] => mariano.iglesias
                        [name] => Mariano Iglesias
                    )
                [14] => Array
                    (
                        [user] => phpnut
                        [name] => Larry E. Masters
                    )
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name');
        /* $result ressemble maintenant à:
            Array
            (
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
        /* $result ressemble maintenant à:
            Array
            (
                [1] => Array
                    (
                        [2] => Array
                            (
                                [user] => mariano.iglesias
                                [name] => Mariano Iglesias
                            )
                    )
                [2] => Array
                    (
                        [14] => Array
                            (
                                [user] => phpnut
                                [name] => Larry E. Masters
                            )
                    )
            )
        */

        $result = Hash::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
        /* $result ressemble maintenant à:
            Array
            (
                [1] => Array
                    (
                        [2] => Mariano Iglesias
                    )
                [2] => Array
                    (
                        [14] => Larry E. Masters
                    )
            )
        */

    Vous pouvez fournir des tableaux pour les deux $keyPath et $valuePath. Si
    vous le faîte, la première valeur sera utilisée comme un format de chaîne
    de caractères, pour les valeurs extraites par les autres chemins::

        $result = Hash::combine(
            $a,
            '{n}.User.id',
            array('%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'),
            '{n}.User.group_id'
        );
        /* $result ressemble maintenant à:
            Array
            (
                [1] => Array
                    (
                        [2] => mariano.iglesias: Mariano Iglesias
                    )
                [2] => Array
                    (
                        [14] => phpnut: Larry E. Masters
                    )
            )
        */

        $result = Hash::combine(
            $a,
            array('%s: %s', '{n}.User.Data.user', '{n}.User.Data.name'),
            '{n}.User.id'
        );
        /* $result ressemble maintenant à:
            Array
            (
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
            )
        */

.. php:staticmethod:: format(array $data, array $paths, $format)

    :rtype: array

    Retourne une série de valeurs extraites d'un tableau, formaté avec un
    format de chaîne de caractères::

        $data = array(
            array(
                'Person' => array(
                    'first_name' => 'Nate',
                    'last_name' => 'Abele',
                    'city' => 'Boston',
                    'state' => 'MA',
                    'something' => '42'
                )
            ),
            array(
                'Person' => array(
                    'first_name' => 'Larry',
                    'last_name' => 'Masters',
                    'city' => 'Boondock',
                    'state' => 'TN',
                    'something' => '{0}'
                )
            ),
            array(
                'Person' => array(
                    'first_name' => 'Garrett',
                    'last_name' => 'Woodworth',
                    'city' => 'Venice Beach',
                    'state' => 'CA',
                    'something' => '{1}'
                )
            )
        );

        $res = Hash::format($data, array('{n}.Person.first_name', '{n}.Person.something'), '%2$d, %1$s');
        /*
        Array
        (
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        )
        */

        $res = Hash::format($data, array('{n}.Person.first_name', '{n}.Person.something'), '%1$s, %2$d');
        /*
        Array
        (
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        )
        */

.. php:staticmethod:: contains(array $data, array $needle)

    :rtype: boolean

    Détermine si un Hash ou un tableau contient les clés et valeurs exactes
    d'un autre::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact'),
            'a' => 'b'
        );

        $result = Hash::contains($a, $a);
        // true
        $result = Hash::contains($a, $b);
        // false
        $result = Hash::contains($b, $a);
        // true

.. php:staticmethod:: check(array $data, string $path = null)

    :rtype: boolean

   Vérifie si un chemin particulier est défini dans un tableau::

        $set = array(
            'My Index 1' => array('First' => 'The first item')
        );
        $result = Hash::check($set, 'My Index 1.First');
        // $result == True

        $result = Hash::check($set, 'My Index 1');
        // $result == True

        $set = array(
            'My Index 1' => array('First' =>
                array('Second' =>
                    array('Third' =>
                        array('Fourth' => 'Heavy. Nesting.'))))
        );
        $result = Hash::check($set, 'My Index 1.First.Second');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == True

        $result = Hash::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == False

.. php:staticmethod:: filter(array $data, $callback = array('Hash', 'filter'))

    :rtype: array

    Filtre les éléments vides en dehors du tableau, en excluant '0'. Vous
    pouvez aussi fournir un $callback personnalisé pour filtrer les éléments
    de tableau. Votre callback devrait retourner ``false`` pour retirer
    les éléments du tableau résultant::

        $data = array(
            '0',
            false,
            true,
            0,
            array('one thing', 'I can tell you', 'is you got to be', false)
        );
        $res = Hash::filter($data);

        /* $data ressemble maintenant à:
            Array (
                [0] => 0
                [2] => true
                [3] => 0
                [4] => Array
                    (
                        [0] => one thing
                        [1] => I can tell you
                        [2] => is you got to be
                    )
            )
        */

.. php:staticmethod:: flatten(array $data, string $separator = '.')

    :rtype: array

    Réduit un tableau multi-dimensionnel en un tableau à une seule dimension::

        $arr = array(
            array(
                'Post' => array('id' => '1', 'title' => 'First Post'),
                'Author' => array('id' => '1', 'user' => 'Kyle'),
            ),
            array(
                'Post' => array('id' => '2', 'title' => 'Second Post'),
                'Author' => array('id' => '3', 'user' => 'Crystal'),
            ),
        );
        $res = Hash::flatten($arr);
        /* $res ressemble maintenant à:
            Array (
                [0.Post.id] => 1
                [0.Post.title] => First Post
                [0.Author.id] => 1
                [0.Author.user] => Kyle
                [1.Post.id] => 2
                [1.Post.title] => Second Post
                [1.Author.id] => 3
                [1.Author.user] => Crystal
            )
        */

.. php:staticmethod:: expand(array $data, string $separator = '.')

    :rtype: array

    Développe un tableau qui a déjà été aplatie avec
    :php:meth:`Hash::flatten()`::

        $data = array(
            '0.Post.id' => 1,
            '0.Post.title' => First Post,
            '0.Author.id' => 1,
            '0.Author.user' => Kyle,
            '1.Post.id' => 2,
            '1.Post.title' => Second Post,
            '1.Author.id' => 3,
            '1.Author.user' => Crystal,
        );
        $res = Hash::expand($data);
        /* $res ressemble maintenant à:
        array(
            array(
                'Post' => array('id' => '1', 'title' => 'First Post'),
                'Author' => array('id' => '1', 'user' => 'Kyle'),
            ),
            array(
                'Post' => array('id' => '2', 'title' => 'Second Post'),
                'Author' => array('id' => '3', 'user' => 'Crystal'),
            ),
        );
        */

.. php:staticmethod:: merge(array $data, array $merge[, array $n])

    :rtype: array

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

        $array = array(
            array(
                'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
                'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
                'description' => 'Importing an sql dump'
            ),
            array(
                'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
                'name' => 'pbpaste | grep -i Unpaid | pbcopy',
                'description' => 'Remove all lines that say "Unpaid".',
            )
        );
        $arrayB = 4;
        $arrayC = array(0 => "test array", "cats" => "dogs", "people" => 1267);
        $arrayD = array("cats" => "felines", "dog" => "angry");
        $res = Hash::merge($array, $arrayB, $arrayC, $arrayD);

        /* $res ressemble maintenant à:
        Array
        (
            [0] => Array
                (
                    [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                    [name] => mysql raleigh-workshop-08 < 2008-09-05.sql
                    [description] => Importing an sql dump
                )
            [1] => Array
                (
                    [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                    [name] => pbpaste | grep -i Unpaid | pbcopy
                    [description] => Remove all lines that say "Unpaid".
                )
            [2] => 4
            [3] => test array
            [cats] => felines
            [people] => 1267
            [dog] => angry
        )
        */

.. php:staticmethod:: numeric(array $data)

    :rtype: boolean

    Vérifie pour voir si toutes les valeurs dans le tableau sont numériques::

        $data = array('one');
        $res = Hash::numeric(array_keys($data));
        // $res est à true

        $data = array(1 => 'one');
        $res = Hash::numeric($data);
        // $res est à false

.. php:staticmethod:: dimensions (array $data)

    :rtype: integer

    Compte les dimensions d'un tableau. Cette méthode va seulement considérer
    la dimension du premier élément dans le tableau::

        $data = array('one', '2', 'three');
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3');
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data);
        // $result == 2

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::dimensions($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::dimensions($data);
        // $result == 2

.. php:staticmethod:: maxDimensions(array $data)

    Similaire à :php:meth:`~Hash::dimensions()`, cependant cette méthode
    retourne le nombre le plus profond de dimensions de tout élément dans
    le tableau::

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Hash::maxDimensions($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Hash::maxDimensions($data, true);
        // $result == 3

.. php:staticmethod:: map(array $data, $path, $function)

    Crée un nouveau tableau, en extrayant $path, et mappe $function à travers
    les résultats. Vous pouvez utiliser les deux, expression et le matching
    d'éléments avec cette méthode::

        //appel de la fonction noop $this->noop() sur chaque element de $data
        $result = Hash::map($data, "{n}", array($this, 'noop'));

        function noop($array) {
         //fait des trucs au tableau et retourne les résultats
         return $array;
        }

.. php:staticmethod:: reduce(array $data, $path, $function)

    Crée une valeur unique, en extrayant $path, et en réduisant les résultats
    extraits avec $function. Vous pouvez utiliser les deux, expression et le
    matching d'éléments avec cette méthode.

.. php:staticmethod:: apply(array $data, $path, $function)

    Appliquer un callback à un ensemble de valeurs extraites en utilisant
    $function. La fonction va récupérer les valeurs extraites en premier
    argument.

.. php:staticmethod:: sort(array $data, $path, $dir, $type = 'regular')

    :rtype: array

    Trie un tableau selon n'importe quelle valeur, déterminé par une
    :ref:`hash-path-syntax`. Seuls les éléments de type expression sont
    supportés par cette méthode::

        $a = array(
            0 => array('Person' => array('name' => 'Jeff')),
            1 => array('Shirt' => array('color' => 'black'))
        );
        $result = Hash::sort($a, '{n}.Person.name', 'asc');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [Shirt] => Array
                            (
                                [color] => black
                            )
                    )
                [1] => Array
                    (
                        [Person] => Array
                            (
                                [name] => Jeff
                            )
                    )
            )
        */

    ``$dir`` peut être soit ``asc``, soit ``desc`. Le ``$type``
    peut être une des valeurs suivantes:

    * ``regular`` pour le trier régulier.
    * ``numeric`` pour le tri des valeurs avec leurs valeurs numériques
      équivalentes.
    * ``string`` pour le tri des valeurs avec leur valeur de chaîne.
    * ``natural`` pour trier les valeurs d'une façon humaine. Va trier
      ``foo10`` en-dessous de ``foo2`` par exemple. Le tri naturel
      a besoin de PHP 5.4 ou supérieur.

    .. versionadded:: 2.8
        L'option ``$type`` accepte maintenant un tableau et l'option ``ignoreCase``
        active le tri sans sensibilité à la casse.

.. php:staticmethod:: diff(array $data, array $compare)

    :rtype: array

    Calcule la différence entre deux tableaux::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact')
        );

        $result = Hash::diff($a, $b);
        /* $result ressemble maintenant à:
            Array
            (
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */

.. php:staticmethod:: mergeDiff(array $data, array $compare)

    :rtype: array

    Cette fonction fusionne les deux tableaux et pousse les différences
    dans les données à la fin du tableau résultant.

    **Exemple 1**
    ::

        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Hash::mergeDiff($array1, $array2);

        /* $res ressemble maintenant à:
            Array
            (
                [ModelOne] => Array
                    (
                        [id] => 1001
                        [field_one] => a1.m1.f1
                        [field_two] => a1.m1.f2
                        [field_three] => a3.m1.f3
                    )
            )
        */

    **Exemple 2**
    ::

        $array1 = array("a" => "b", 1 => 20938, "c" => "string");
        $array2 = array("b" => "b", 3 => 238, "c" => "string", array("extra_field"));
        $res = Hash::mergeDiff($array1, $array2);
        /* $res ressemble maintenant à:
            Array
            (
                [a] => b
                [1] => 20938
                [c] => string
                [b] => b
                [3] => 238
                [4] => Array
                    (
                        [0] => extra_field
                    )
            )
        */

.. php:staticmethod:: normalize(array $data, $assoc = true)

    :rtype: array

    Normalise un tableau. Si ``$assoc`` est à true, le tableau résultant
    sera normalisé en un tableau associatif. Les clés numériques avec les
    valeurs, seront convertis en clés de type chaîne avec des valeurs null.
    Normaliser un tableau, facilite l'utilisation des résultats avec
    :php:meth:`Hash::merge()`::

        $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id')
            )
        );
        $result = Hash::normalize($a);
        /* $result ressemble maintenant à:
            Array
            (
                [Tree] => null
                [CounterCache] => null
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                            )
                    )
            )
        */

        $b = array(
            'Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional'
        );
        $result = Hash::normalize($b);
        /* $result ressemble maintenant à:
            Array
            (
                [Cacheable] => Array
                    (
                        [enabled] => false
                    )

                [Limit] => null
                [Bindable] => null
                [Validator] => null
                [Transactional] => null
            )
        */

.. php:staticmethod:: nest(array $data, array $options = array())

    Prend un ensemble de tableau aplati, et crée une structure de données
    imbriquée ou chaînée. Utilisé par des méthodes comme
    ``Model::find('threaded')``.

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

        $data = array(
            array('ModelName' => array('id' => 1, 'parent_id' => null)),
            array('ModelName' => array('id' => 2, 'parent_id' => 1)),
            array('ModelName' => array('id' => 3, 'parent_id' => 1)),
            array('ModelName' => array('id' => 4, 'parent_id' => 1)),
            array('ModelName' => array('id' => 5, 'parent_id' => 1)),
            array('ModelName' => array('id' => 6, 'parent_id' => null)),
            array('ModelName' => array('id' => 7, 'parent_id' => 6)),
            array('ModelName' => array('id' => 8, 'parent_id' => 6)),
            array('ModelName' => array('id' => 9, 'parent_id' => 6)),
            array('ModelName' => array('id' => 10, 'parent_id' => 6))
        );

        $result = Hash::nest($data, array('root' => 6));
        /* $result ressemble maintenant à:
        array(
                (int) 0 => array(
                    'ModelName' => array(
                        'id' => (int) 6,
                        'parent_id' => null
                    ),
                    'children' => array(
                        (int) 0 => array(
                            'ModelName' => array(
                                'id' => (int) 7,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 1 => array(
                            'ModelName' => array(
                                'id' => (int) 8,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 2 => array(
                            'ModelName' => array(
                                'id' => (int) 9,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        ),
                        (int) 3 => array(
                            'ModelName' => array(
                                'id' => (int) 10,
                                'parent_id' => (int) 6
                            ),
                            'children' => array()
                        )
                    )
                )
            )
            */


.. meta::
    :title lang=fr: Hash
    :keywords lang=fr: tableau, array array,path array,array name,numeric key,regular expression,result set,person name,brackets,syntax,cakephp,elements,php,set path
