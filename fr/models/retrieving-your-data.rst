Récupérer vos données
#####################

Comme mentionné précédemment, un des rôles de la couche Model est d'obtenir les
données à partir de plusieurs types de stockage. La classe Model de CakePHP
est livrée avec quelques fonctions qui vous aident à chercher ces données, à
les trier, les paginer, et les filtrer. La fonction la plus courante que
vous utiliserez dans les models est :php:meth:`Model::find()`.

.. _model-find:

find
====

``find(string $type = 'first', array $params = array())``

Find est, parmi toutes les fonctions de récupération de données des models,
une véritable bête de somme multi-fonctionnelle. ``$type`` peut être ``'all'``,
``'first'``, ``'count'``, ``'list'``, ``'neighbors'``, ``'threaded'``, ou
tout autre fonction de recherche que vous définissez.
Gardez à l'esprit que ``$type`` est sensible à la casse. Utiliser un
caractère majuscule (par exemple ``All``) ne produira pas le résultat attendu.

``$params`` est utilisée pour passer tous les paramètres aux différentes
formes de find et il a les clés suivantes disponibles par défaut - qui sont
toutes optionnelles::

    array(
        //tableau de conditions
        'conditions' => array('Model.field' => $cetteValeur),
        'recursive' => 1, //int
        //tableau de champs nommés
        'fields' => array('Model.champ1', 'DISTINCT Model.champ2'),
        //chaîne de caractère ou tableau définissant order
        'order' => array('Model.created', 'Model.champ3 DESC'),
        'group' => array('Model.champ'), //champs en GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset' => n, //int
        //autres valeurs possibles sont false, 'before', 'after'
        'callbacks' => true
    )

Il est également possible d'ajouter et d'utiliser d'autres paramètres, dont
il est fait usage dans quelques types de find, dans des behaviors
(comportements) et, bien sûr, dans vos propres méthodes de model.

Si votre opération de find n'arrive pas à récupérer des données, vous aurez
un tableau vide.

.. _model-find-first:

find('first')
=============

``find('first', $params)`` retournera UN résultat, vous devriez utiliser
ceci dans tous les cas où vous attendez un seul résultat. Ci-dessous,
quelques exemples simples (code du controller)::

    public function une_fonction() {
        // ...
        $articleADemiAleatoire = $this->Article->find('first');
        $dernierCree = $this->Article->find('first', array(
            'order' => array('Article.created' => 'desc')
        ));
        $specifiquementCeluiCi = $this->Article->find('first', array(
            'conditions' => array('Article.id' => 1)
        ));
        // ...
    }

Dans le premier exemple, aucun paramètre n'est passé au find ; par conséquent
aucune condition ou ordre de tri ne seront utilisés. Le format retourné par
un appel à ``find('first')`` est de la forme::

    Array
    (
        [NomDuModel] => Array
            (
                [id] => 83
                [champ1] => valeur1
                [champ2] => valeur2
                [champ3] => valeur3
            )

        [NomDuModelAssocie] => Array
            (
                [id] => 1
                [champ1] => valeur1
                [champ2] => valeur2
                [champ3] => valeur3
            )
    )

.. _model-find-count:

find('count')
=============

``find('count', $params)`` retourne une valeur de type entier. Ci-dessous,
quelques exemples simples (code du controller)::

    public function une_fonction() {
        // ...
        $total = $this->Article->find('count');
        $en_attente = $this->Article->find('count', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $authors = $this->Article->User->find('count');
        $auteursPublies = $this->Article->find('count', array(
           'fields' => 'DISTINCT Article.user_id',
           'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    Ne passez pas ``fields`` comme un tableau à ``find('count')``. Vous
    devriez avoir besoin de spécifier seulement des champs pour un count
    DISTINCT (parce que sinon, le décompte est toujours le même - il est
    imposé par les conditions).

.. _model-find-all:

find('all')
===========

``find('all', $params)`` retourne un tableau de résultats (potentiellement
multiples). C'est en fait le mécanisme utilisé par toutes les variantes de
``find()``, ainsi que par ``paginate``. Ci-dessous, quelques exemples
simples (code du controller)::

    public function une_fonction() {
        // ...
        $tousLesArticles = $this->Article->find('all');
        $en_attente = $this->Article->find('all', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $tousLesAuteurs = $this->Article->User->find('all');
        $tousLesAuteursPublies = $this->Article->User->find('all', array(
            'conditions' => array('Article.status !=' => 'pending')
        ));
        // ...
    }

.. note::

    Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque user
    de la table users, il n'y aura pas de condition appliquée à la
    recherche puisqu'aucune n'a été passée.

Les résultats d'un appel à ``find('all')`` seront de la forme suivante::

    Array
    (
        [0] => Array
            (
                [NomDuModel] => Array
                    (
                        [id] => 83
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                [NomDuModelAssocie] => Array
                    (
                        [id] => 1
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

            )
    )

.. _model-find-list:

find('list')
============

``find('list', $params)`` retourne un tableau indexé, pratique pour tous les
cas où vous voudriez une liste telle que celles remplissant les champs select.
Ci-dessous, quelques exemples simples (code du controller)::

    public function une_function() {
        // ...
        $tousLesArticles = $this->Article->find('list');
        $en_attente = $this->Article->find('list', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $tousLesAuteurs = $this->Article->User->find('list');
        $tousLesAuteursPublies = $this->Article->find('list', array(
            'fields' => array('User.id', 'User.name'),
            'conditions' => array('Article.status !=' => 'pending'),
            'recursive' => 0
        ));
        // ...
    }

.. note::

    Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque user
    de la table users, il n'y aura pas de condition appliquée à la
    recherche puisqu'aucune n'a été passée.

Le résultat d'un appel à ``find('list')`` sera de la forme suivante::

    Array
    (
        //[id] => 'valeurAffichage',
        [1] => 'valeurAffichage1',
        [2] => 'valeurAffichage2',
        [4] => 'valeurAffichage4',
        [5] => 'valeurAffichage5',
        [6] => 'valeurAffichage6',
        [3] => 'valeurAffichage3',
    )

En appelant ``find('list')``, les champs (``fields``) passés sont utilisés
pour déterminer ce qui devrait être utilisé comme clé, valeur du tableau
et, optionnellement, par quoi regrouper les résultats (group by). Par
défaut la clé primaire du model est utilisé comme clé et le champ affiché
(display field qui peut être configuré en utilisant l'attribut
:ref:`model-displayField` du model) est utilisé pour la valeur. Quelques
exemples complémentaires pour clarifier les choses::

    public function une_function() {
        // ...
        $juste_les_usernames = $this->Article->User->find('list', array(
            'fields' => array('User.username')
        ));
        $correspondanceUsername = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name')
        ));
        $groupesUsername = $this->Article->User->find('list', array(
            'fields' => array('User.username', 'User.first_name', 'User.group')
        ));
        // ...
    }

Avec l'exemple de code ci-dessus, les variables résultantes devraient
ressembler à quelque chose comme cela::

    $juste_les_usernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $correspondanceUsername = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $groupesUsername = Array
    (
        ['Utilisateur'] => Array
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

``find('threaded', $params)`` retourne un tableau imbriqué et est
particulièrement approprié si vous voulez utiliser le champ
``parent_id`` des données de votre model, pour construire les résultats
associés. Ci-dessous, quelques exemples simples (code du controller)::

    public function une_function() {
        // ...
        $toutesLesCategories = $this->Category->find('threaded');
        $quelquesCategories = $this->Comment->find('threaded', array(
            'conditions' => array('article_id' => 50)
        ));
        // ...
    }

.. tip::

    Un meilleur moyen de gérer les données imbriquées est d'utiliser
    le behavior :doc:`/core-libraries/behaviors/tree`

Dans l'exemple ci-dessus, ``$toutesLesCategories`` contiendra un tableau
imbriqué représentant la structure entière de categorie. Le résultat
d'un appel à ``find('threaded')`` sera de la forme suivante::

    Array
    (
        [0] => Array
        (
            [NomDuModel] => Array
            (
                [id] => 83
                [parent_id] => null
                [champ1] => valeur1
                [champ2] => valeur2
                [champ3] => valeur3
            )

            [NomDuModelAssocie] => Array
            (
                [id] => 1
                [champ1] => valeur1
                [champ2] => valeur2
                [champ3] => valeur3
            )

            [children] => Array
            (
                [0] => Array
                (
                    [NomDuModel] => Array
                    (
                        [id] => 42
                        [parent_id] => 83
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                    [NomDuModelAssocie] => Array
                    (
                        [id] => 2
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                    [children] => Array
                    (
                    )
                )
                ...
            )
        )
    )

L'ordre dans lequel les résultats apparaissent peut être modifié, puisqu'il
est influencé par l'ordre d'exécution. Par exemple, si
``'order' => 'name ASC'`` est passé dans les paramètres de
``find('threaded')``, les résultats apparaîtront ordonnés par nom. De même
que tout ordre peut être utilisé, il n'y a pas de condition intrinsèque à
cette méthode pour que le meilleur résultat soit retourné en premier.

.. warning::

    Si vous spécifiez ``fields``, vous aurez besoin de toujours inclure
    id & parent_id (ou leurs alias courants)::

        public function some_function() {
            $categories = $this->Category->find('threaded', array(
                'fields' => array('id', 'name', 'parent_id')
            ));
        }

    Sinon le tableau retourné ne sera pas de la structure imbriquée attendue du
    dessus.

.. _model-find-neighbors:

find('neighbors')
=================

``find('neighbors', $params)`` exécutera un find similaire à 'first', mais
retournera les lignes précédentes et suivantes à celle que vous requêtez.
Ci-dessous, un exemple simple (code du controller):

::

    public function some_function() {
        $neighbors = $this->Article->find(
            'neighbors',
            array('field' => 'id', 'value' => 3)
        );
    }

Vous pouvez voir dans cet exemple, les deux éléments requis par le
tableau ``$params`` : field et value. Les autres éléments sont toujours
autorisés, comme dans tout autre find (Ex : si votre model agit comme
un containable, alors vous pouvez spécifier 'contain' dans ``$params``).
Le format retourné par un appel à ``find('neighbors')`` est de la forme :

::

    Array
    (
        [prev] => Array
        (
            [NomDuModel] => Array
            (
                [id] => 2
                [champ1] => valeur1
                [champ2] => valeur2
                ...
            )
            [NomDuModelAssocie] => Array
            (
                [id] => 151
                [champ1] => valeur1
                [champ2] => valeur2
                ...
            )
        )
        [next] => Array
        (
            [NomDuModel] => Array
            (
                [id] => 4
                [champ1] => valeur1
                [champ2] => valeur2
                ...
            )
            [NomDuModelAssocie] => Array
            (
                [id] => 122
                [champ1] => valeur1
                [champ2] => valeur2
                ...
            )
        )
    )

.. note::

    Notez que le résultat contient toujours seulement deux éléments
    de premier niveau : prev et next. Cette fonction ne possède pas
    de variable récursive par défaut d'un model. Le paramètre récursif doit
    être passé dans les paramètres de chaque appel.

.. _model-custom-find:

Créer des types de recherche personnalisés
==========================================

La méthode ``find`` est assez flexible pour accepter vos recherches
personnalisées, ceci est fait en déclarant vos propres types dans une variable
de model et en intégrant une fonction spéciale dans votre classe de model.

Un type de recherche Model est un raccourci pour les options de recherche.
Par exemple, les deux finds suivants sont équivalents

::

    $this->User->find('first');
    $this->User->find('all', array('limit' => 1));

Ci-dessous les différents types de find du coeur:

* ``first``
* ``all``
* ``count``
* ``list``
* ``threaded``
* ``neighbors``

Mais qu'en est-il des autres types? Mettons que vous souhaitiez un finder pour
tous les articles publiés dans votre base de données. Le premier changement que
vous devez faire est d'ajouter votre type dans la variable
:php:attr:`Model::$findMethods` dans le model

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);
    }

Au fond, cela dit juste à CakePHP d'accepter la valeur ``available`` pour
premier argument de la fonction ``find``. Prochaine étape est l'intégration
de la fonction ``_findAvailable``. Cela est fait par convention, si vous voulez
intégrer un finder appelé ``maSuperRecherche`` ensuite la méthode à intégrer
s'appellera ``_findMaSuperRecherche``.

::

    class Article extends AppModel {
        public $findMethods = array('available' =>  true);

        protected function _findAvailable($state, $query, $results = array()) {
            if ($state === 'before') {
                $query['conditions']['Article.publie'] = true;
                return $query;
            }
            return $results;
        }
    }

Cela vient avec l'exemple suivant (code du controller):

::

    class ArticlesController extends AppController {

        // Trouvera tous les articles publiés et les ordonne en fonction de la colonne created
        public function index() {
            $articles = $this->Article->find('available', array(
                'order' => array('created' => 'desc')
            ));
        }

    }

Les méthodes spéciales ``_find[Type]`` reçoivent 3 arguments comme montré
ci-dessus. Le premier signifie que l'état de l'exécution de la requête,
qui peut être soit ``before`` ou ``after``. Cela est fait de cette façon
parce que cette fonction est juste une sorte de fonction callback qui
a la capacité de modifier la requête avant qu'elle se fasse, ou de modifier
les résultats après qu'ils sont récupérés.

Typiquement, la première chose à vérifier dans notre fonction find est l'état
de la requête. L'état ``before`` est le moment de modifier la requête, de
former les nouvelles associations, d'appliquer plus de behaviors, et
d'interpréter toute clé spéciale qui est passé dans le deuxième argument de
``find``. Cet état nécessite que vous retourniez l'argument $query
(modifié ou non).

L'état ``after`` est l'endroit parfait pour inspecter les résultats, injecter
de nouvelles données, le traiter pour retourner dans un autre format, ou faire
ce que vous voulez sur les données fraichement récupérées. Cet état nécessite
que vous retourniez le tableau $results (modifié ou non).

Vous pouvez créer autant de finders personnalisés que vous souhaitez, et ils
sont une bonne façon de réutiliser du code dans votre application à travers
les models.

Il est aussi possible de paginer grâce à un find personnalisé en utilisant
l'option 'findType' comme suit:

::

    class ArticlesController extends AppController {

        // Va paginer tous les articles publiés
        public function index() {
            $this->paginate = array('findType' => 'available');
            $articles = $this->paginate();
            $this->set(compact('articles'));
        }

    }

Configurer la propriété ``$this->paginate`` comme ci-dessus dans le controller
fera que le ``type`` de find deviendra ``available``, et vous permettra aussi
de continuer à modifier les résultats trouvés.

Pour simplement retourner le nombre d'un type find personnalisé, appelez
``count`` comme vous le feriez habituellement, mais passez le type de find
dans un tableau dans le second argument.

::

    class ArticlesController extends AppController {

        // Va récupérer le nombre d'articles publiés (en utilisant le find available défini ci-dessus)
        public function index() {
            $count = $this->Article->find('count', array(
                'type' => 'available'
            ));
        }
    }

Si le compte de votre page de pagination devient fausse, il peut être
nécessaire d'ajouter le code suivant à votre ``AppModel``, ce qui devrait
régler le compte de pagination:

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

Vous n'avez plus besoin de surcharger _findCount pour régler les problèmes des
count de résultat incorrects. L'état ``'before'`` de vos finders personnalisés
vous permettent maintenant d'être appelés à nouveaux avec
$query['operation'] = 'count'. Le $query retourné va être utilisé dans
``_findCount()``. Si nécessaire, vous pouvez distinguer en vérifiant pour
la clé ``'operation'`` et retourner un ``$query`` différent::

    protected function _findAvailable($state, $query, $results = array()) {
        if ($state === 'before') {
            $query['conditions']['Article.published'] = true;
            if (!empty($query['operation']) && $query['operation'] === 'count') {
                return $query;
            }
            $query['joins'] = array(
                //array of required joins
            );
            return $query;
        }
        return $results;
    }

Types Magiques de Recherche
===========================

Ces fonctions magiques peuvent être utilisées comme un raccourci pour
rechercher dans vos tables sur un champ précis. Ajoutez simplement le
nom du champ (au format CamelCase) à la fin de ces fonctions et fournissez
le critère de recherche pour ce champ comme premier paramètre.

Les fonctions findAllBy() retourneront des résultats dans un format comme
``find('all')``, alors que findBy() retourne dans le même format que
``find('first')``

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| findAllBy<x> Exemple                                                                     | Corresponding SQL Fragment                                 |
+==========================================================================================+============================================================+
| ``$this->Product->findAllByOrderStatus('3');``                                           | ``Product.order_status = 3``                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Recipe->findAllByType('Cookie');``                                              | ``Recipe.type = 'Cookie'``                                 |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('Anderson');``                                          | ``User.last_name = 'Anderson'``                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Cake->findAllById(7);``                                                         | ``Cake.id = 7``                                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByEmailOrUsername('jhon','jhon');``                                | ``User.email = 'jhon' OR User.username = 'jhon';``         |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByUsernameAndPassword('jhon', '123');``                            | ``User.username = 'jhon' AND User.password = '123';``      |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('psychic', array(), array('User.user_name => 'asc'));`` | ``User.last_name = 'psychic' ORDER BY User.user_name ASC`` |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

Le résultat retourné est un tableau formaté un peu comme ce que donnerait
``find('all')``.

Finders Magiques Personnalisés
------------------------------

Depuis 2.8, vous pouvez utiliser une méthode finder personnalisée avec
l'interface de la méthode magique.
Par exemple, si votre model implémente un finder ``published``, vous pouvez
utiliser ces finders avec la méthode magique ``findBy``::

    $results = $this->Article->findPublishedByAuthorId(5);

    // Est équivalent à
    $this->Article->find('published', array(
        'conditions' => array('Article.author_id' => 5)
    ));

.. versionadded:: 2.8.0
    Les finders magiques personnalisés ont été ajoutés dans 2.8.0.

findBy
------

``findBy<fieldName>(string $value);``

Les fonctions magiques findBy acceptent aussi quelques paramètres optionnels:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``


+------------------------------------------------------------+-------------------------------------------------------+
| findBy<x> Exemple                                          | Corresponding SQL Fragment                            |
+============================================================+=======================================================+
| ``$this->Produit->findByOrderStatus('3');``                | ``Product.order_status = 3``                          |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Recipe->findByType('Cookie');``                   | ``Recipe.type = 'Cookie'``                            |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByLastName('Anderson');``               | ``User.last_name = 'Anderson';``                      |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByEmailOrUsername('jhon','jhon');``     | ``User.email = 'jhon' OR User.username = 'jhon';``    |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByUsernameAndPassword('jhon', '123');`` | ``User.username = 'jhon' AND User.password = '123';`` |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Cake->findById(7);``                              | ``Cake.id = 7``                                       |
+------------------------------------------------------------+-------------------------------------------------------+

Les fonctions findBy() retournent des résultats comme ``find('first')``.

.. _model-query:

:php:meth:`Model::query()`
==========================

``query(string $query)``

Les appels SQL que vous ne pouvez pas ou ne voulez pas faire grâce aux autres
méthodes de model peuvent être exécutés en utilisant la méthode ``query()``
(bien qu'il y ait très peu de circonstances où cela se vérifie).

Si vous utilisez cette méthode, assurez-vous d'échapper correctement tous les
paramètres en utilisant la méthode ``value()`` sur le driver de la base de
données. Ne pas échapper les paramètres va créer des vulnérabilités de type
injection SQL.

.. note::

    ``query()`` ne respecte pas $Model->cacheQueries car cette fonctionnalité
    est par nature déconnectée de tout ce qui concerne l'appel du model. Pour
    éviter les appels au cache de requêtes, fournissez un second argument
    false, par exemple : ``query($query, $cachequeries = false)``.

``query()`` utilise le nom de la table déclarée dans la requête comme clé du
tableau de données retourné, plutôt que le nom du model. Par exemple::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

pourrait retourner::

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

Pour utiliser le nom du model comme clé du tableau et obtenir un résultat
cohérent avec ce qui est retourné par les méthodes Find, la requête doit
être réécrite::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

ce qui retourne::

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

    Cette syntaxe et la structure de tableau correspondante est valide
    seulement pour MySQL. CakePHP ne fournit pas de données d'abstraction quand
    les requêtes sont lancées manuellement, donc les résultats exacts vont
    varier entre les bases de données.

:php:meth:`Model::field()`
==========================

``field(string $name, array $conditions = null, string $order = null)``

Retourne la valeur d'un champ unique, spécifié par ``$name``, du premier
enregistrement correspondant aux $conditions ordonnées par $order. Si
aucune condition n'est passée et que l'id du model est fixé, la fonction
retournera la valeur du champ pour le résultat de l'enregistrement actuel.
Si aucun enregistrement correspondant n'est trouvé cela retournera false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // affiche le nom pour la ligne avec l'id 22

    // affiche le nom de la dernière instance créée
    echo $this->Post->field(
        'name',
        array('created <' => date('Y-m-d H:i:s')),
        'created DESC'
    );

:php:meth:`Model::read()`
=========================

``read($fields, $id)``

``read()`` est une méthode utilisée pour récupérer les données du model
courant (``Model::$data``) - comme lors des mises à jour - mais elle peut
aussi être utilisée dans d'autres circonstances, pour récupérer un seul
enregistrement depuis la base de données.

``$fields`` est utilisée pour passer un seul nom de champ sous forme de
chaîne ou un tableau de noms de champs ; si laissée vide, tous les champs
seront retournés.

``$id`` précise l'ID de l'enregistrement à lire. Par défaut,
l'enregistrement actuellement sélectionné, tel que spécifié par ``Model::$id``,
est utilisé. Passer une valeur différente pour ``$id`` fera que
l'enregistrement correspondant sera sélectionné.

``read()`` retourne toujours un tableau (même si seulement un nom de champ
unique est requis). Utilisez ``field`` pour retourner la valeur d'un seul
champ.

.. warning::

    Puisque la méthode ``read`` écrase toute information stockée dans les
    propriétés ``data`` et ``id`` du model, vous devez faire très attention
    quand vous utilisez cete fonction en général, spécialement en l'utilisant
    dans les fonctions de callbacks du model comme ``beforeValidate`` et
    ``beforeSave``. Généralement la fonction ``find`` est une façon de faire
    plus robuste et facile à utiliser avec l'API que la méthode ``read``.

Conditions de recherche complexes
=================================

La plupart des appels de recherche de models impliquent le passage d'un
jeu de conditions d'une manière ou d'une autre. Le plus simple est
d'utiliser un bout de clause WHERE SQL. Si vous vous avez besoin de plus
de contrôle, vous pouvez utiliser des tableaux.

L'utilisation de tableaux est plus claire et simple à lire, et rend également
la construction de requêtes très simple. Cette syntaxe sépare également les
éléments de votre requête (champs, valeurs, opérateurs etc.) en parties
manipulables et discrètes. Cela permet à CakePHP de générer les requêtes les
plus efficaces possibles, d'assurer une syntaxe SQL correcte, et d'échapper
convenablement chaque partie de la requête. Utiliser une syntaxe en tableau
permet aussi à CakePHP de sécuriser vos requêtes contre toute attaque
d'injection SQL.

.. warning::

    CakePHP échappe seulement les valeurs de tableau. Vous **ne** devriez
    **jamais** mettre les données d'utilisateur dans les clés. Faire ceci vous
    rendra vulnérable aux injections SQL.

Dans sa forme la plus simple, une requête basée sur un tableau ressemble à
ceci::

    $conditions = array("Post.title" => "This is a post", "Post.author_id" => 1);
    // Exemple d'utilisation avec un model:
    $this->Post->find('first', array('conditions' => $conditions));

La structure ici est assez significative : elle va trouver tous les posts où le
titre à pour valeur « This is a post » et où l'id de l'auteur est égal à 1. Nous
aurions pu uniquement utiliser « title » comme nom de champ, mais lorsque l'on
construit des requêtes, il vaut mieux toujours spécifier le nom du model.
Cela améliore la clarté du code, et évite des collisions futures, dans
le cas où vous devriez changer votre schéma.

Qu'en est-il des autres types de correspondances ? Elles sont aussi simples.
Disons que nous voulons trouver tous les posts dont le titre n'est pas
"Ceci est un post"::

    array("Post.titre !=" => "Il y a un post")

Notez le '!=' qui précède l'expression. CakePHP peut parser tout opérateur
de comparaison valide de SQL, même les expressions de correspondance
utilisant ``LIKE``, ``BETWEEN``, ou ``REGEX``, tant que vous laissez un espace
entre l'opérateur et la valeur. Les seules exceptions à ceci sont les
correspondances du genre ``IN(...)``. Admettons que vous vouliez trouver les
posts dont le titre appartient à un ensemble de valeurs données::

    array(
        "Post.titre" => array("Premier post", "Deuxième post", "Troisième post")
    )

Faire un NOT IN(...) correspond à trouver les posts dont le titre n'est pas
dans le jeu de données passé::

    array(
        "NOT" => array(
            "Post.titre" => array("First post", "Second post", "Third post")
        )
    )

Ajouter des filtres supplémentaires aux conditions est aussi simple que
d'ajouter des paires clé/valeur au tableau::

    array (
        "Post.titre" => array("Premier post", "Deuxième post", "Troisième post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

Vous pouvez également créer des recherches qui comparent deux champs de la
base de données::

    array("Post.created = Post.modified")

L'exemple ci-dessus retournera les posts où la date de création est égale
à la date de modification (par ex les posts qui n'ont jamais été modifiés
sont retournés).

Souvenez-vous que si vous vous trouvez dans l'incapacité de formuler une
clause ``WHERE`` par cette méthode (ex. opérations booléennes), il vous est
toujours possible de la spécifier sous forme de chaîne comme ceci::

    array(
        'Model.champ & 8 = 1',
        // autres conditions habituellement utilisées
    )

Par défaut, CakePHP fournit les conditions multiples avec l'opérateur booléen
``AND``, ce qui signifie que le bout de code ci-dessous correspondra
uniquement aux posts qui ont été créés durant les deux dernières semaines, et
qui ont un titre correspondant à ceux donnés. Cependant, nous pouvons simplement
trouver les posts qui correspondent à l'une ou l'autre des conditions::

    array("OR" => array(
        "Post.titre" => array("Premier post", "Deuxième post", "Troisième post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    ))

CakePHP accepte toute opération booléenne SQL valide, telles que ``AND``,
``OR``, ``NOT``, ``XOR``, etc., et elles peuvent être en majuscule comme en
minuscule, comme vous préférez. Ces conditions sont également infiniment
"IMBRIQUABLES". Admettons que vous ayez une relation hasMany/belongsTo entre
Posts et Auteurs, ce qui reviendrait à un LEFT JOIN. Admettons aussi que vous
vouliez trouver tous les posts qui contiennent un certain mot-clé "magique" ou
qui a été créé au cours des deux dernières semaines, mais que vous voulez
restreindre votre recherche aux posts écrits par Bob::

    array(
        "Auteur.nom" => "Bob",
        "OR" => array(
            "Post.titre LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Si vous avez besoin de mettre plusieurs conditions sur le même champ, comme
quand vous voulez faire une recherche ``LIKE`` avec des termes multiples, vous
pouvez faire ceci en utilisant des conditions identiques à::

    array('OR' => array(
        array('Post.titre LIKE' => '%one%'),
        array('Post.titre LIKE' => '%two%')
    ))

Les opérateurs wildcard ``ILIKE`` et ``RLIKE`` (RLIKE depuis la version 2.6)
sont aussi disponible.

CakePHP peut aussi vérifier les champs null. Dans cet exemple, la requête
retournera les enregistrements où le titre du post n'est pas null::

    array("NOT" => array(
            "Post.titre" => null
        )
    )

Pour gérer les requêtes ``BETWEEN``, vous pouvez utiliser ceci::

    array('Post.read_count BETWEEN ? AND ?' => array(1,10))

.. note::

    CakePHP quotera les valeurs numériques selon le type du champ dans votre
    base de données.

Qu'en est-il de GROUP BY ?::

    array(
        'fields' => array(
            'Produit.type',
            'MIN(Produit.prix) as prix'
        ),
        'group' => 'Produit.type'
    )

Les données retournées seront dans le format suivant::

    Array
    (
        [0] => Array
        (
            [Produit] => Array
            (
                [type] => Vetement
            )
            [0] => Array
            (
                [prix] => 32
            )
        )
        [1] => Array
        ...

Un exemple rapide pour faire une requête ``DISTINCT``. Vous pouvez utiliser
d'autres opérateurs, comme ``MIN()``, ``MAX()``, etc..., d'une manière
analogue::

    array(
        'fields' => array('DISTINCT (User.nom) AS nom_de_ma_colonne'),
        'order' =>array('User.id DESC')
    )

Vous pouvez créer des conditions très complexes, en regroupant des tableaux
de conditions multiples::

    array(
        'OR' => array(
            array('Entreprise.nom' => 'Futurs Gains'),
            array('Entreprise.ville' => 'CA')
        ),
        'AND' => array(
            array(
                'OR' => array(
                    array('Entreprise.status' => 'active'),
                    'NOT' => array(
                        array('Entreprise.status' => array('inactive', 'suspendue'))
                    )
                )
            )
        )
    )

Qui produira la requête SQL suivante::

    SELECT `Entreprise`.`id`, `Entreprise`.`nom`,
    `Entreprise`.`description`, `Entreprise`.`location`,
    `Entreprise`.`created`, `Entreprise`.`status`, `Entreprise`.`taille`

    FROM
       `entreprises` AS `Entreprise`
    WHERE
       ((`Entreprise`.`nom` = 'Futurs Gains')
       OR
       (`Entreprise`.`ville` = 'CA'))
    AND
       ((`Entreprise`.`status` = 'active')
       OR (NOT (`Entreprise`.`status` IN ('inactive', 'suspendue'))))

Sous requêtes
-------------

Par exemple, imaginons que nous ayons une table "users" avec
"id", "nom" et "statuts". Le statuts peut être "A", "B" ou "C". Et
nous voulons récupérer tous les users qui ont un statut différent
de "B" en utilisant une sous requête.

Pour pouvoir effectuer cela, nous allons appeler la source de données du
model et lui demander de construire la requête comme si nous appelions
une méthode "find", mais elle retournera uniquement la commande SQL. Après
cela, nous construisons une expression et l'ajoutons au tableau des
conditions::

    $conditionsSubQuery['User2.status'] = 'B';

    $db = $this->User->getDataSource();
    $subQuery = $db->buildStatement(
        array(
            'fields'     => array('User2.id'),
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
    $subQuery = 'User.id NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $db->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->User->find('all', compact('conditions'));

Ceci devrait générer la commande SQL suivante::

    SELECT
        User.id AS "User__id",
        User.name AS "User__name",
        User.status AS "User__status"
    FROM
        users AS User
    WHERE
        User.id NOT IN (
            SELECT
                User2.id
            FROM
                users AS User2
            WHERE
                "User2.status" = 'B'
        )

Aussi, si vous devez passer juste une partie de votre requête en
colonne SQL comme ci-dessus, la source de données **expressions** avec
la colonne SQL fonctionne pour toute partie de requête find.

.. _prepared-statements:

Requêtes Préparées
------------------

Si vous avez besoin d'encore plus de contrôle sur vos requêtes, vous pouvez
utiliser des requêtes préparées. Cela vous permet de parler directement au
driver de la base de données et d'envoyer toute requête personnalisée que vous
souhaitez::

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
    :title lang=fr: Récupérer vos données
    :keywords lang=fr: caractère majuscule,tableau modèle,tableau order,code controller contrôleur,fonctions de récupération,couche modèle,méthodes modèle,classe modèle,donnée modèle,donnée récupérée,champ names,workhorse,desc,neighbors,parameters,storage,models
