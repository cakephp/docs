Set
###

.. php:class:: Set

La gestion de tableau, si elle est bien faite, peut être un outil très 
puissant et utile pour construire plus malin, et du code plus optimisé. 
CakePHP offre un ensemble d'utilitaires statiquestrès utiles dans la 
classe Set qui vous permet justement de faire cela.

La classe Set de CakePHP peut être appelée par n'importe quel model ou 
controller de la même façon que l'Inflector est appelé. 
Exemple: :php:meth:`Set::combine()`.

La syntaxe du Chemin Set-compatible
===================================

La syntaxe de Chemin est utilisée par sorte (par exemple), et est utilisée pour 
définir un chemin.

Exemple d'utilisation (en utilisant :php:func:`Set::sort()`)::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
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

Comme vous pouvez le voir dans l'exemple ci-dessus, certaines choses sont 
entourées de {}, d'autres non. Dans la table ci-dessous, vous pouvez voir 
quelles options sont disponibles.

+--------------------------------+--------------------------------------------+
| Expression                     | Definition                                 |
+================================+============================================+
| {n}                            | Représente une clé numérique               |
+--------------------------------+--------------------------------------------+
| {s}                            | Représente une chaîne                      |
+--------------------------------+--------------------------------------------+
| Foo                            | Toute chaîne (sans les accolades           |
|                                | fermantes) est traitée comme une chaîne    |
|                                | littérale.                                 |
+--------------------------------+--------------------------------------------+
| {[a-z]+}                       | Toute chaîne entre accolades (à part       |
|                                | {n} et {s}) est interpretée comme une      |
|                                | expression régulière.                      |
+--------------------------------+--------------------------------------------+

.. todo:

    Cette section a besoin d'être etoffée.

.. php:staticmethod:: apply($path, $array, $callback, $options = array())

    :rtype: mixed

    Appliquer un callback aux éléments d'un tableau extrait par un chemin 
    Set::extract compatible::

        $data = array(
            array('Movie' => array('id' => 1, 'title' => 'movie 3', 'rating' => 5)),
            array('Movie' => array('id' => 1, 'title' => 'movie 1', 'rating' => 1)),
            array('Movie' => array('id' => 1, 'title' => 'movie 2', 'rating' => 3)),
        );

        $result = Set::apply('/Movie/rating', $data, 'array_sum');
        // résultat égal à 9

        $result = Set::apply('/Movie/title', $data, 'strtoupper', array('type' => 'map'));
        // résultat égal à array('MOVIE 3', 'MOVIE 1', 'MOVIE 2')
        // $options sont: - type : peut être 'pass' uses call_user_func_array(), 'map' uses array_map(), ou 'reduce' uses array_reduce()


.. php:staticmethod:: check($data, $path = null)

    :rtype: boolean/array

    Vérifie si un chemin particulier est défini dans un tableau. Si $path est 
    vide, $data va être retournée au lieu d'une valeur boléenne::

        $set = array(
            'My Index 1' => array('First' => 'The first item')
        );
        $result = Set::check($set, 'My Index 1.First');
        // $result == True
        $result = Set::check($set, 'My Index 1');
        // $result == True
        $result = Set::check($set, array());
        // $result == array('My Index 1' => array('First' => 'The first item'))
        $set = array(
            'My Index 1' => array('First' =>
                array('Second' =>
                    array('Third' =>
                        array('Fourth' => 'Heavy. Nesting.'))))
        );
        $result = Set::check($set, 'My Index 1.First.Second');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Second.Third');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Second.Third.Fourth');
        // $result == True
        $result = Set::check($set, 'My Index 1.First.Seconds.Third.Fourth');
        // $result == False


.. php:staticmethod:: classicExtract($data, $path = null)

    :rtype: array

    Récupère une valeur d'un tableau ou d'un objet qui est contenu dans un 
    chemin donné en utilisant un tableau en une syntaxe de tableau, par ex:

    -  "{n}.Person.{[a-z]+}" - Où "{n}" représente une clé numérique,
       "Person" représente une chaîne littérale
    -  "{[a-z]+}" (par ex: toute chaîne littérale fermée par des accolades en 
       plus de {n} et {s}) est interpreté comme une expressoin régulière.

    **Exemple 1**
    ::

        $a = array(
            array('Article' => array('id' => 1, 'title' => 'Article 1')),
            array('Article' => array('id' => 2, 'title' => 'Article 2')),
            array('Article' => array('id' => 3, 'title' => 'Article 3')));
        $result = Set::classicExtract($a, '{n}.Article.id');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => 1
                [1] => 2
                [2] => 3
            )
        */
        $result = Set::classicExtract($a, '{n}.Article.title');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Article 1
                [1] => Article 2
                [2] => Article 3
            )
        */
        $result = Set::classicExtract($a, '1.Article.title');
        // $result == "Article 2"

        $result = Set::classicExtract($a, '3.Article.title');
        // $result == null

    **Exemple 2**
    ::

        $a = array(
            0 => array('pages' => array('name' => 'page')),
            1 => array('fruites' => array('name' => 'fruit')),
            'test' => array(array('name' => 'jippi')),
            'dot.test' => array(array('name' => 'jippi'))
        );

        $result = Set::classicExtract($a, '{n}.{s}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [0] => page
                    )
                [1] => Array
                    (
                        [0] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a, '{s}.{n}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [0] => jippi
                    )
                [1] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{\w+}.{\w+}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
                [test] => Array
                    (
                        [0] => jippi
                    )
                [dot.test] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{\d+}.{\w+}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a,'{n}.{\w+}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [pages] => page
                    )
                [1] => Array
                    (
                        [fruites] => fruit
                    )
            )
        */
        $result = Set::classicExtract($a,'{s}.{\d+}.name');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [0] => jippi
                    )
                [1] => Array
                    (
                        [0] => jippi
                    )
            )
        */
        $result = Set::classicExtract($a,'{s}');
        /* $result ressemble maintenant à:
            Array
            (

                [0] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
                [1] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */
        $result = Set::classicExtract($a,'{[a-z]}');
        /* $result ressemble maintenant à:
            Array
            (
                [test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )

                [dot.test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */
        $result = Set::classicExtract($a, '{dot\.test}.{n}');
        /* $result ressemble maintenant à:
            Array
            (
                [dot.test] => Array
                    (
                        [0] => Array
                            (
                                [name] => jippi
                            )
                    )
            )
        */


.. php:staticmethod:: combine($data, $path1 = null, $path2 = null, $groupPath = null)

    :rtype: array

    Crée un tableau associatif utilisant un $path1 comme chemin à build
    en clé, et en option $path2 comme chemin pour obtenir les valeurs. Si 
    $path2 n'est pas spécifié, toutes les valeurs seront initialisées à null
    (utile pour Set::merge). Vous pouvez en option grouper les valeurs par 
    ce qui est obtenu quand on suit le chemin spécifié dans $groupPath.::

        $result = Set::combine(array(), '{n}.User.id', '{n}.User.Data');
        // $result == array();

        $result = Set::combine('', '{n}.User.id', '{n}.User.Data');
        // $result == array();

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
            array(
                'User' => array(
                    'id' => 25,
                    'group_id' => 1,
                    'Data' => array(
                        'user' => 'gwoo',
                        'name' => 'The Gwoo'
                    )
                )
            )
        );
        $result = Set::combine($a, '{n}.User.id');
        /* $result ressemble maintenant à:
            Array
            (
                [2] =>
                [14] =>
                [25] =>
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existant');
        /* $result ressemble maintenant à:
            Array
            (
                [2] =>
                [14] =>
                [25] =>
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
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
                [25] => Array
                    (
                        [user] => gwoo
                        [name] => The Gwoo
                    )
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name');
        /* $result ressemble maintenant à:
            Array
            (
                [2] => Mariano Iglesias
                [14] => Larry E. Masters
                [25] => The Gwoo
            )
        */

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
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
                        [25] => Array
                            (
                                [user] => gwoo
                                [name] => The Gwoo
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

        $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
        /* $result ressemble maintenant à:
            Array
            (
                [1] => Array
                    (
                        [2] => Mariano Iglesias
                        [25] => The Gwoo
                    )
                [2] => Array
                    (
                        [14] => Larry E. Masters
                    )
            )
        */

        $result = Set::combine($a, '{n}.User.id', array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.group_id');
        /* $result ressemble maintenant à:
            Array
            (
                [1] => Array
                    (
                        [2] => mariano.iglesias: Mariano Iglesias
                        [25] => gwoo: The Gwoo
                    )
                [2] => Array
                    (
                        [14] => phpnut: Larry E. Masters
                    )
            )
        */

        $result = Set::combine($a, array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
        /* $result ressemble maintenant à:
            Array
            (
                [mariano.iglesias: Mariano Iglesias] => 2
                [phpnut: Larry E. Masters] => 14
                [gwoo: The Gwoo] => 25
            )
        */

        $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
        /* $result ressemble maintenant à:
            Array
            (
                [Mariano Iglesias: mariano.iglesias] => 2
                [Larry E. Masters: phpnut] => 14
                [The Gwoo: gwoo] => 25
            )
        */

        $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');

        /* $result ressemble maintenant à:
            Array
            (
                [mariano.iglesias: 2] => Mariano Iglesias
                [phpnut: 14] => Larry E. Masters
                [gwoo: 25] => The Gwoo
            )
        */

        $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
        /* $result ressemble maintenant à:
            Array
            (
                [2: mariano.iglesias] => Mariano Iglesias
                [14: phpnut] => Larry E. Masters
                [25: gwoo] => The Gwoo
            )
        */


.. php:staticmethod:: contains($val1, $val2 = null)

    :rtype: boolean

    Detérmine si un Set ou un tableau contient les clés exactes et les valeurs 
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

        $result = Set::contains($a, $a);
        // True
        $result = Set::contains($a, $b);
        // False
        $result = Set::contains($b, $a);
        // True


.. php:staticmethod:: countDim ($array = null, $all = false, $count = 0)

    :rtype: integer

    Compte les dimensions d'un tableau. Si $all est défini à false (qui 
    est la valeur par défaut) il va seulement considérer la dimension du 
    premier élément dans le tableau::

        $data = array('one', '2', 'three');
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3');
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data);
        // $result == 2

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data);
        // $result == 1

        $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
        $result = Set::countDim($data, true);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data);
        // $result == 2

        $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 3

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => '2.1.1.1'))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 4

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 5

        $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($data, true);
        // $result == 5

        $set = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
        $result = Set::countDim($set, false, 0);
        // $result == 2

        $result = Set::countDim($set, true);
        // $result == 5


.. php:staticmethod:: diff($val1, $val2 = null)

    :rtype: array

    Compute la différence entre un Set et un tableau, deux Sets, ou 
    deux tableaux::

        $a = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        );
        $b = array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about'),
            2 => array('name' => 'contact')
        );

        $result = Set::diff($a, $b);
        /* $result ressemble maintenant à:
            Array
            (
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */
        $result = Set::diff($a, array());
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
                [1] => Array
                    (
                        [name] => about
                    )
            )
        */
        $result = Set::diff(array(), $b);
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
                [1] => Array
                    (
                        [name] => about
                    )
                [2] => Array
                    (
                        [name] => contact
                    )
            )
        */

        $b = array(
            0 => array('name' => 'me'),
            1 => array('name' => 'about')
        );

        $result = Set::diff($a, $b);
        /* $result now looks like:
            Array
            (
                [0] => Array
                    (
                        [name] => main
                    )
            )
        */


.. php:staticmethod:: enum($select, $list=null)

    :rtype: string

    La méthode enum fonctionne bien quand on utilise les éléments html select. 
    Elle retourne une valeur d'un tableau listé si la clé existe.

    Si un $list séparé par des virgules est passé dans les tableaux sont 
    numériques avec la clé allant de 0 $list = 'no, yes' traduirait à $list
    = array(0 => 'no', 1 => 'yes');

    Si un tableau est utilisé, les clés peuvent être des chaînes exemple: 
    array('no' => 0,'yes' => 1);

    $list par défaut à 0 = no 1 = yes si param n'est pas passé::

        $res = Set::enum(1, 'one, two');
        // $res est 'two'

        $res = Set::enum('no', array('no' => 0, 'yes' => 1));
        // $res est 0

        $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
        // $res est 'one'


.. php:staticmethod:: extract($path, $data=null, $options=array())

    :rtype: array

    Set::extract utilise la syntaxe basique XPath 2.0 pour retourner les 
    sous-ensembles de vos données à partir d'un fin ou d'un find all. Cette 
    fonction vous permet de récupèrer vos données rapidement sans avoir 
    à boucler à travers des tableaux multi-dimensionnels ou de traverser 
    à travers les structures en arbre.
    
    .. note::

        Si ``$path`` ne contient pas un '/', l'appel sera délégué à 
        :php:meth:`Set::classicExtract()`

    ::

        // Utilisation habituelle:
        $users = $this->User->find("all");
        $results = Set::extract('/User/id', $users);
        // results retourne:
        // array(1,2,3,4,5,...);

    Les sélecteurs implémentés actuellement:

    +------------------------------------------+--------------------------------------------+
    | Selector                                 | Note                                       |
    +==========================================+============================================+
    | /User/id                                 | Similaire au {n}.User.id classique         |
    +------------------------------------------+--------------------------------------------+
    | /User[2]/name                            | Sélectionne le nom du deuxième User        |
    +------------------------------------------+--------------------------------------------+
    | /User[id<2]                              | Sélectionne tous les Users avec un id < 2  |
    +------------------------------------------+--------------------------------------------+
    | /User[id>2][<5]                          | Sélectionne tous les Users avec un id > 2  |
    |                                          | mais 5                                     |
    +------------------------------------------+--------------------------------------------+
    | /Post/Comment[author\_name=john]/../name | Sélectionne le nom de tous les Posts qui   |
    |                                          | ont au moins un Comment écrit par john     |
    +------------------------------------------+--------------------------------------------+
    | /Posts[title]                            | Sélectionne tous les Posts qui ont une clé |
    |                                          | 'title'                                    |
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[1]                            | Sélectionne les contenus du premier contenu|
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[:last]                        | Sélectionne le dernier comment             |
    +------------------------------------------+--------------------------------------------+
    | /Comment/.[:first]                       | Sélectionne le premier comment             |
    +------------------------------------------+--------------------------------------------+
    | /Comment[text=/cakephp/i]                | Sélectionne tous les comments qui ont un   |
    |                                          | texte correspondant au regex /cakephp/i    |
    +------------------------------------------+--------------------------------------------+
    | /Comment/\@\*                            | Sélectionne les noms de clé de tous les    |
    |                                          | comments. Actuellement seuls les chemins   |
    |                                          | absolus commançant par un unique '/' sont  |
    |                                          | supportés. Merci de reporter tout bug si   |
    |                                          | vous en trouvez. Les suggestions pour des  |
    |                                          | fonctionnalités supplémentaires sont       |
    |                                          | bienvenues                                 |
    |                                          | additional features are welcome.           |
    +------------------------------------------+--------------------------------------------+

    Pour en apprendre plus sur Set::extract() référez vous à la fonction 
    testExtract() dans ``/lib/Cake/Test/Case/Utility/SetTest.php``.


.. php:staticmethod:: filter($var, $isArray=null)

    :rtype: array

    Filtre les éléments vide d'un tableau route, en excluant '0'::

        $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));

        /* $res ressemble maintenant à:
            Array (
                [0] => 0
                [2] => 1
                [3] => 0
                [4] => Array
                    (
                        [0] => one thing
                        [1] => I can tell you
                        [2] => is you got to be
                    )
            )
        */


.. php:staticmethod:: flatten($data, $separator='.')

    :rtype: array

    Transforme un tableau multi-dimensional en un tableau à dimension unique::

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
        $res = Set::flatten($arr);
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


.. php:staticmethod:: format($data, $format, $keys)

    :rtype: array

    Retourne une série de valeurs extraites d'un tableau, formaté en un format 
    de chaîne::

        $data = array(
            array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
            array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
            array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));

        $res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));
        /*
        Array
        (
            [0] => Abele, Nate
            [1] => Masters, Larry
            [2] => Woodworth, Garrett
        )
        */

        $res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));
        /*
        Array
        (
            [0] => Boston, MA
            [1] => Boondock, TN
            [2] => Venice Beach, CA
        )
        */
        $res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));
        /*
        Array
        (
            [0] => {Boston, MA}
            [1] => {Boondock, TN}
            [2] => {Venice Beach, CA}
        )
        */
        $res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));
        /*
        Array
        (
            [0] => {42, 42}
            [1] => {0, {0}}
            [2] => {0, {1}}
        )
        */
        $res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => 42, Nate
            [1] => 0, Larry
            [2] => 0, Garrett
        )
        */
        $res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
        /*
        Array
        (
            [0] => Nate, 42
            [1] => Larry, 0
            [2] => Garrett, 0
        )
        */


.. php:staticmethod:: Set::insert ($list, $path, $data = null)

    :rtype: array

    Insére $data dans un tableau comme défini dans $path.::

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Set::insert($a, 'files', array('name' => 'files'));
        /* $result ressemble maintenant à:
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
        */

        $a = array(
            'pages' => array('name' => 'page')
        );
        $result = Set::insert($a, 'pages.name', array());
        /* $result ressemble maintenant à:
            Array
            (
                [pages] => Array
                    (
                        [name] => Array
                            (
                            )
                    )
            )
        */

        $a = array(
            'pages' => array(
                0 => array('name' => 'main'),
                1 => array('name' => 'about')
            )
        );
        $result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));
        /* $result ressemble maintenant à:
            Array
            (
                [pages] => Array
                    (
                        [0] => Array
                            (
                                [name] => main
                            )
                        [1] => Array
                            (
                                [name] => about
                                [vars] => Array
                                    (
                                        [title] => page title
                                    )
                            )
                    )
            )
        */


.. php:staticmethod:: map($class = 'stdClass', $tmp = 'stdClass')

    :rtype: object

    Cette méthode Mappe le contenu de l'objet Set en un objet hiérarchisé 
    et maintient les clés numériques en tableaux d'objets.

    Basiquement, la fonction map transforme le tableau d'items en classe 
    d'objets initialisée. Par défaut il transforme un tableau en un Objet 
    stdClass, cependant vous pouvez mapper les valeurs en un type de classe.
    Exemple: Set::map($array\_of\_values, 'nameOfYourClass');::

        $data = array(
            array(
                "IndexedPage" => array(
                    "id" => 1,
                    "url" => 'http://blah.com/',
                    'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                    'get_vars' => '',
                    'redirect' => '',
                    'created' => "1195055503",
                    'updated' => "1195055503",
                )
            ),
            array(
                "IndexedPage" => array(
                    "id" => 2,
                    "url" => 'http://blah.com/',
                    'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                    'get_vars' => '',
                    'redirect' => '',
                    'created' => "1195055503",
                    'updated' => "1195055503",
                ),
            )
        );
        $mapped = Set::map($data);

        /* $mapped ressemble maintenant à:

            Array
            (
                [0] => stdClass Object
                    (
                        [_name_] => IndexedPage
                        [id] => 1
                        [url] => http://blah.com/
                        [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                        [get_vars] =>
                        [redirect] =>
                        [created] => 1195055503
                        [updated] => 1195055503
                    )

                [1] => stdClass Object
                    (
                        [_name_] => IndexedPage
                        [id] => 2
                        [url] => http://blah.com/
                        [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                        [get_vars] =>
                        [redirect] =>
                        [created] => 1195055503
                        [updated] => 1195055503
                    )

            )

        */

    Utilisation de Set::map() avec une classe personnalisée en second paramètre:

    ::

        class MyClass {
            public function sayHi() {
                echo 'Hi!';
            }
        }

        $mapped = Set::map($data, 'MyClass');
        //Maintenant vous pouvez accéder à toutes les propriétés comme dans 
        //l'exemple ci-dessus, mais aussi vous pouvez appeler les méthodes 
        //MyClass
        $mapped->[0]->sayHi();


.. php:staticmethod:: matches($conditions, $data=array(), $i = null, $length=null)

    :rtype: boolean

    Set::matches peut être utilisé pour voir si un item unique ou un xpath 
    donné admet certaines conditions.::

        $a = array(
            array('Article' => array('id' => 1, 'title' => 'Article 1')),
            array('Article' => array('id' => 2, 'title' => 'Article 2')),
            array('Article' => array('id' => 3, 'title' => 'Article 3')));
        $res=Set::matches(array('id>2'), $a[1]['Article']);
        // retourne false
        $res=Set::matches(array('id>=2'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('id>=3'), $a[1]['Article']);
        // retourne false
        $res=Set::matches(array('id<=2'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('id<2'), $a[1]['Article']);
        // retourne false
        $res=Set::matches(array('id>1'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('3'), null, 3);
        // retourne true
        $res=Set::matches(array('5'), null, 5);
        // retourne true
        $res=Set::matches(array('id'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('id', 'title'), $a[1]['Article']);
        // retourne true
        $res=Set::matches(array('non-existent'), $a[1]['Article']);
        // retourne false
        $res=Set::matches('/Article[id=2]', $a);
        // retourne true
        $res=Set::matches('/Article[id=4]', $a);
        // retourne false
        $res=Set::matches(array(), $a);
        // retourne true


.. php:staticmethod:: merge($arr1, $arr2=null)

    :rtype: array

    Cette fonction peut être imaginée comme un hybride entre 
    array\_merge et array\_merge\_recursive de PHP. La différence entre les 
    deux est que si une clé de tableau contient un autre tableau alors la 
    fonction se comporte de façon récursive (pas comme array\_merge) mais le ne 
    fait pas pour les clés contenant des chaînes (pas comme 
    array\_merge\_recursive). Regardez le test unitaire pour plus 
    d'informations.

    .. note::

        Cette fonction va fonctionner avec un montant illimité d'arguments et 
        de paramètres non-tableaux typecasts dans des tableaux.

    ::

        $arry1 = array(
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
        $arry2 = 4;
        $arry3 = array(0 => "test array", "cats" => "dogs", "people" => 1267);
        $arry4 = array("cats" => "felines", "dog" => "angry");
        $res = Set::merge($arry1, $arry2, $arry3, $arry4);

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
                    [description] => Retire toutes les lignes qui disent "Unpaid".
                )

            [2] => 4
            [3] => test array
            [cats] => felines
            [people] => 1267
            [dog] => angry
        )
        */


.. php:staticmethod:: normalize($list, $assoc = true, $sep = ',', $trim = true)

    :rtype: array

    Normalise une liste de chaîne ou de tableau.::

        $a = array('Tree', 'CounterCache',
                'Upload' => array(
                    'folder' => 'products',
                    'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')));
        $b =  array('Cacheable' => array('enabled' => false),
                'Limit',
                'Bindable',
                'Validator',
                'Transactional');
        $result = Set::normalize($a);
        /* $result ressemble maintenant à:
            Array
            (
                [Tree] =>
                [CounterCache] =>
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )
                    )
            )
        */
        $result = Set::normalize($b);
        /* $result ressemble maintenant à:
            Array
            (
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )

                [Limit] =>
                [Bindable] =>
                [Validator] =>
                [Transactional] =>
            )
        */
        $result = Set::merge($a, $b); // Fusionne maintenant les deux et normalize
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Tree
                [1] => CounterCache
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )

                    )
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )
                [2] => Limit
                [3] => Bindable
                [4] => Validator
                [5] => Transactional
            )
        */
        $result = Set::normalize(Set::merge($a, $b));
        /* $result ressemble maintenant à:
            Array
            (
                [Tree] =>
                [CounterCache] =>
                [Upload] => Array
                    (
                        [folder] => products
                        [fields] => Array
                            (
                                [0] => image_1_id
                                [1] => image_2_id
                                [2] => image_3_id
                                [3] => image_4_id
                                [4] => image_5_id
                            )

                    )
                [Cacheable] => Array
                    (
                        [enabled] =>
                    )
                [Limit] =>
                [Bindable] =>
                [Validator] =>
                [Transactional] =>
            )
        */


.. php:staticmethod:: numeric($array=null)

    :rtype: boolean

    Vérifie si toutes les valeurs dans le tableau sont numériques::

        $data = array('one');
        $res = Set::numeric(array_keys($data));

        // $res est true

        $data = array(1 => 'one');
        $res = Set::numeric($data);

        // $res est false

        $data = array('one');
        $res = Set::numeric($data);

        // $res est false

        $data = array('one' => 'two');
        $res = Set::numeric($data);

        // $res est false

        $data = array('one' => 1);
        $res = Set::numeric($data);

        // $res est true

        $data = array(0);
        $res = Set::numeric($data);

        // $res est true

        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));

        // $res est true

        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));

        // $res est true

        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));

        // $res est true

        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));

        // $res est false


.. php:staticmethod:: pushDiff($array1, $array2)

    :rtype: array

    Cette fonction fusionne deux tableaux et pousse les différences dans 
    array2 à la fin du tableau résultant.

    **Exemple 1**
    ::

        $array1 = array('ModelOne' => array('id' => 1001, 'field_one' => 'a1.m1.f1', 'field_two' => 'a1.m1.f2'));
        $array2 = array('ModelOne' => array('id' => 1003, 'field_one' => 'a3.m1.f1', 'field_two' => 'a3.m1.f2', 'field_three' => 'a3.m1.f3'));
        $res = Set::pushDiff($array1, $array2);

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
        $res = Set::pushDiff($array1, $array2);
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


.. php:staticmethod:: remove($list, $path = null)

    :rtype: array

    Retire un élémént d'un Set ou d'un tableau selon ce qui est défini par $path::

        $a = array(
            'pages'     => array('name' => 'page'),
            'files'     => array('name' => 'files')
        );

        $result = Set::remove($a, 'files');
        /* $result ressemble maintenant à:
            Array
            (
                [pages] => Array
                    (
                        [name] => page
                    )

            )
        */


.. php:staticmethod:: reverse($object)

    :rtype: array

    Set::reverse est au fond l'opposé de :php:func:`Set::map`. Elle convertit 
    un objet en un tableau. Si $object n'est pas un objet, reverse va 
    simplement retourner $object.::

        $result = Set::reverse(null);
        // Null
        $result = Set::reverse(false);
        // false
        $a = array(
            'Post' => array('id' => 1, 'title' => 'Premier Post'),
            'Comment' => array(
                array('id' => 1, 'title' => 'Premier Comment'),
                array('id' => 2, 'title' => 'Deuxième Comment')
            ),
            'Tag' => array(
                array('id' => 1, 'title' => 'Premier Tag'),
                array('id' => 2, 'title' => 'Deuxième Tag')
            ),
        );
        $map = Set::map($a); // Change $a dans une classe object
        /* $map ressemble maintenant à:
            stdClass Object
            (
                [_name_] => Post
                [id] => 1
                [title] => Premier Post
                [Comment] => Array
                    (
                        [0] => stdClass Object
                            (
                                [id] => 1
                                [title] => Premier Comment
                            )
                        [1] => stdClass Object
                            (
                                [id] => 2
                                [title] => Deuxième Comment
                            )
                    )
                [Tag] => Array
                    (
                        [0] => stdClass Object
                            (
                                [id] => 1
                                [title] => Premier Tag
                            )
                        [1] => stdClass Object
                            (
                                [id] => 2
                                [title] => Deuxième Tag
                            )
                    )
            )
        */

        $result = Set::reverse($map);
        /* $result ressemble maintenant à:
            Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Premier Post
                        [Comment] => Array
                            (
                                [0] => Array
                                    (
                                        [id] => 1
                                        [title] => Premier Comment
                                    )
                                [1] => Array
                                    (
                                        [id] => 2
                                        [title] => Deuxième Comment
                                    )
                            )
                        [Tag] => Array
                            (
                                [0] => Array
                                    (
                                        [id] => 1
                                        [title] => First Tag
                                    )
                                [1] => Array
                                    (
                                        [id] => 2
                                        [title] => Second Tag
                                    )
                            )
                    )
            )
        */

        $result = Set::reverse($a['Post']); // Retourne juste un tableau
        /* $result ressemble maintenant à:
            Array
            (
                [id] => 1
                [title] => Premier Post
            )
        */


.. php:staticmethod:: sort($data, $path, $dir)

    :rtype: array

    Trie un tableau selon toute valeur, detérminé par un chemin Set-compatible::

        $a = array(
            0 => array('Person' => array('name' => 'Jeff')),
            1 => array('Shirt' => array('color' => 'black'))
        );
        $result = Set::sort($a, '{n}.Person.name', 'asc');
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

        $result = Set::sort($a, '{n}.Shirt', 'asc');
        /* $result ressemble maintenant à:
            Array
            (
                [0] => Array
                    (
                        [Person] => Array
                            (
                                [name] => Jeff
                            )
                    )
                [1] => Array
                    (
                        [Shirt] => Array
                            (
                                [color] => black
                            )
                    )
            )
        */

        $result = Set::sort($a, '{n}', 'desc');
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

        $a = array(
            array(7,6,4),
            array(3,4,5),
            array(3,2,1),
        );

.. php:staticmethod:: apply($path, $array, $callback, $options = array())

		    :rtype: mixed

		    Applique un callback aux éléments d'un tableau extait par un chemin 
		    compatible Set::extract::

				        $data = array(
		            array('Movie' => array('id' => 1, 'title' => 'movie 3', 'rating' => 5)),
		            array('Movie' => array('id' => 1, 'title' => 'movie 1', 'rating' => 1)),
		            array('Movie' => array('id' => 1, 'title' => 'movie 2', 'rating' => 3)),
		        );

		        $result = Set::apply('/Movie/rating', $data, 'array_sum');
		        // résultat égal à 9

		        $result = Set::apply('/Movie/title', $data, 'strtoupper', array('type' => 'map'));
		        // résultat égal à array('MOVIE 3', 'MOVIE 1', 'MOVIE 2')
		        // $options sont: - type : peut être 'pass' utilise call_user_func_array(), 'map' utilise array_map(), ou 'reduce' utilise array_reduce()

.. php:staticmethod:: nest($data, $options = array())

		    :rtype: array

		    Prend un tableau plat et retourne un tableau imbriqué::

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

		        $result = Set::nest($data, array('root' => 6));
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
    :title lang=fr: Set
    :keywords lang=fr: tableau array,tableau chemin,path array,nom tableau,array name,clé numérique,expression régulière,result set,person name,brackets,syntax,cakephp,elements,php,set path
