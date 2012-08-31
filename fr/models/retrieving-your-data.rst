Récupérer vos données
#####################

Comme mentionné avant, un des rôles de la couche Model est d'obtenir les 
données à partir de multiples types de stockage. La classe Model de CakePHP 
est livrée avec quelques fonctions qui vous aident à chercher ces données, à 
les trier, les paginer, et les filtrer. La fonction la plus courante que 
vous utiliserez dans les modèles est :php:meth:`Model::find()`.

.. _model-find:

find
====

``find(string $type = 'first', array $params = array())``

Find est, parmi toutes les fonctions de récupération de données des modèles, 
une véritable bête de somme multi-fonctionnelle. ``$type`` peut être ``'all'``, 
``'first'``, ``'count'``, ``'list'``, ``'neighbors'`` or ``'threaded'``, ou 
tout autre fonction de recherche que vous définissez. 
Gardez à l'esprit que ``$type`` est sensible à la casse. Utiliser un 
caractère majuscule (par exemple ``All``) ne produira pas le résultat attendu.

``$params`` est utilisé pour passer tous les paramètres aux différentes 
formes de find et il a les clés suivantes disponibles par défaut - qui sont 
toutes optionnelles::

    <?php
    array(
        'conditions' => array('Model.field' => $cetteValeur), //tableau de conditions
        'recursive' => 1, //int
        'fields' => array('Model.champ1', 'DISTINCT Model.champ2'), //tableau de champs nommés
        'order' => array('Model.created', 'Model.champ3 DESC'), //chaîne de caractère ou tableau définissant order
        'group' => array('Model.champ'), //champs en GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset' => n, //int
        'callbacks' => true //autres valeurs possible sont false, 'before', 'after'
    )

Il est possible également, d'ajouter et d'utiliser d'autres paramètres, dont 
il est fait usage dans quelques types de find, dans des comportements 
(behaviors) et, bien sûr, dans vos propres méthodes de modèle.

.. _model-find-first:

find('first')
=============

``find('first', $params)``  retournera un résultat, vous devriez utiliser 
ceci dans tous les cas où vous attendez un seul résultat. Ci-dessous, une 
paire d'exemples simples (code du contôleur)::

    <?php
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
une paire d'exemples simples (code du contôleur)::

    <?php
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
``find()``, ainsi que par ``paginate``. Ci-dessous, une paire d'exemples 
simples (code du contrôleur)::

    <?php
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

    Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque utilisateur 
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
Ci-dessous, une paire d'exemples simples (code du contôleur) :

    <?php
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

    Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque utilisateur 
    de la table users, il n'y aura pas de condition appliquée à la 
    recherche puisqu'aucune n'a été passée.

Les résultats d'un appel à ``find('list')`` seront de la forme suivante::

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
défaut la clé primaire du modèle est utilisé comme clé et le champ affiché 
(display field qui peut être configuré en utilisant l'attribut 
:ref:`model-displayField` du modèle) est utilisé pour la valeur. Quelques 
exemples complémentaires pour clarifier les choses::

    <?php
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
ressembler à quelque chose comme çà::

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
``parent_id`` des données de votre modèle, pour construire les résultats 
associés. Ci-dessous, une paire d'exemples simples (code du contrôleur)::

    <?php
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
imbriqué représentant la structure entière de categorie. Les résultats 
d'un appel à ``find('threaded')`` seront de la forme suivante::

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

.. _model-find-neighbors:

find('neighbors')
=================

``find('neighbors', $params)`` exécutera un find similaire à 'first', mais 
retournera la ligne précédant et suivant celle que vous requêtez. Ci-dessous, 
un exemple simple (code du contôleur)

::

    <?php
    public function une_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

Vous pouvez voir dans cet exemple, les deux éléments requis par le 
tableau ``$params`` : field et value. Les autres éléments sont toujours 
autorisés, comme dans tout autre find (Ex : si votre modèle agit comme 
un containable, alors vous pouvez spécifiez 'contain' dans ``$params``). 
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
    de premier niveau : prev et next. Cette fonction n'honore pas var 
    par défaut récursive d'un modèle. Le paramètre récursif doit 
    être passé dans les paramètres de chaque appel.

.. _model-custom-find:

Créer des types de recherche personnalisées
===========================================

La méthode ``find`` est assez flexible pour accepter vos recherches 
personnalisées, ceci est fait en déclarant vos propres types dans une variable 
de modèle et en intégrant une fonction spéciale dans votre classe de modèle.

Un type de recherche Modèle est un raccourci pour les options de recherche. 
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
:php:attr:`Model::$findMethods` dans le modèle

::

    <?php
    class Article extends AppModel {
        public $findMethods = array('available' =>  true);
    }

Basiquement, cela dit juste à CakePHP d'accepter la valeur ``available`` pour 
premier argument de la fonction ``find``. Prochaine étape est l'intégration 
de la fonction ``_findAvailable``. Cela est fait par convention, si vous voulez 
intégrer un finder appelé ``maSuperRecherche`` ensuite la méthode à intégrer 
s'appellera ``_findMaSuperRecherche``.

::

    <?php
    class Article extends AppModel {
        public $findMethods = array('available' =>  true);

        protected function _findAvailable($state, $query, $results = array()) {
            if ($state == 'before') {
                $query['conditions']['Article.publie'] = true;
                return $query;
            }
            return $results;
        }
    }

Cela vient avec l'exemple suivant (code du contrôleur):

::

    <?php
    class ArticlesController extends AppController {

        // Trouvera tous les articles publiés et les ordonne en fonction 
        de la colonne created
        public function index() {
            $articles = $this->Article->find('available', array(
                'order' => array('created' => 'desc')
            ));
        }

    }

Les méthodes ``_find[Type]`` spéciales recoivent 3 arguments comme montré 
ci-dessus. Le premier signifie que l'état de l'execution de la requête, 
qui peut être soit ``before`` ou ``after``. Cela est fait de cette façon 
parce que cette fonction est juste une sorte de fonction callback qui 
a la capacité de modifier la requête avant qu'elle se fasse, ou de modifier 
les résultats après qu'ils sont récupérés.

Typiquement, la première chose à vérifier dans notre fonction find est l'état 
de la requête. L'état ``before`` est le moment de modifier la requête, de 
former les nouvelles associations, d'appliquer plus de behaviors, et 
d'interpreter toute clé spéciale qui est passé dans le deuxième argument de 
``find``. Cet état nécessite que vous retourniez l'argument $query 
(modifié ou non).

L'état ``after`` est l'endroit parfait pour inspecter les résultats, injecter 
de nouvelles données, le traiter pour retourner dans un autre format, ou faire 
ce que vous voulez sur les données fraichement récupérées. Cet état nécessite 
que vous retourniez le tableau $results (modifié ou non).

Vous pouvez créer autant de finders personnalisés que vous souhaitez, et ils 
sont une bonne façon de réutiliser du code dans votre application à travers 
les modèles.

Il est aussi possble de paginer grâce à un type de find personnalisé comme suit:

::

    <?php
    class ArticlesController extends AppController {

        // Will paginate all published articles
        public function index() {
            $this->paginate = array('available');
            $articles = $this->paginate();
            $this->set(compact('articles'));
        }

    }

Configurer la propriété ``$this->paginate`` comme ci-dessus dans le contrôleur 
fera que le ``type`` de find deviendra ``available``, et vous permettra aussi 
de continuer à modifier les résultats trouvés.

Si le compte de votre page de pagination devient fausse, il peut être 
nécessaire d'ajouter le code suivant à votre ``AppModel``, ce qui devrait 
régler le compte de pagination:

::

    <?php
    class AppModel extends Model {

    /**
     * Retire la clé 'fields' du compte de la requête find personnalisée 
     * quand c'est un tableau, comme il cassera entièrement l'appel 
     * Model::_findCount() call
     *
     * @param string $state Soit "before" soit "after"
     * @param array $query
     * @param array $results
     * @return int Le nombre d'enregistrements trouvés, ou false
     * @access protected
     * @see Model::find()
     */
        protected function _findCount($state, $query, $results = array()) {
            if ($state === 'before') {
                if (isset($query['type']) && isset($this->findMethods[$query['type']])) {
                    $query = $this->{'_find' . ucfirst($query['type'])}('before', $query);
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
| findAllBy<x> Example                                                                     | Corresponding SQL Fragment                                 |
+==========================================================================================+============================================================+
| ``$this->Product->findAllByOrderStatus('3');``                                           | ``Product.order_status = 3``                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Recipe->findAllByType('Cookie');``                                              | ``Recipe.type = 'Cookie'``                                 |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('Anderson');``                                          | ``User.last_name = 'Anderson'``                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->Cake->findAllById(7);``                                                         | ``Cake.id = 7``                                            |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByEmailOrUsername('jhon');``                                       | ``User.email = 'jhon' OR User.username = 'jhon';``         |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByUsernameAndPassword('jhon', '123');``                            | ``User.username = 'jhon' AND User.password = '123';``      |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| ``$this->User->findAllByLastName('psychic', array(), array('User.user_name => 'asc'));`` | ``User.last_name = 'psychic' ORDER BY User.user_name ASC`` |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

Le résultat retourné est un tableau formaté un peu comme ce que donnerait 
``find('all')``.

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
| ``$this->User->findByEmailOrUsername('jhon');``            | ``User.email = 'jhon' OR User.username = 'jhon';``    |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->User->findByUsernameAndPassword('jhon', '123');`` | ``User.username = 'jhon' AND User.password = '123';`` |
+------------------------------------------------------------+-------------------------------------------------------+
| ``$this->Cake->findById(7);``                              | ``Cake.id = 7``                                       |
+------------------------------------------------------------+-------------------------------------------------------+

Les fonctions findBy() retournent des résultats comme ``find('first')``

.. _model-query:

:php:meth:`Model::query()`
==========================

``query(string $query)``

Les appels SQL que vous ne pouvez pas ou ne voulez pas faire grâce aux autres 
méthodes de modèle (attention, il y a très peu de circonstances où cela se 
vérifie), peuvent être exécutés en utilisant la méthode ``query()``.

Si vous utilisez souvent cette méthode dans votre application, assurez-vous 
de connaître la librairie :doc:`/core-utility-libraries/sanitize` de CakePHP, 
qui vous aide à nettoyer les données provenant des users, des 
attaques par injection et cross-site scripting.

.. note::

    ``query()`` ne respecte pas $Model->cacheQueries car cette fonctionnalité 
    est par nature déconnectée de tout ce qui concerne l'appel du modèle. Pour 
    éviter les appels au cache de requêtes, fournissez un second argument 
    false, par exemple : ``query($query, $cachequeries = false)``

``query()`` utilise le nom de la table déclaré dans la requête comme clé du 
tableau de données retourné, plutôt que le nom du modèle. Par exemple::

    <?php
    $this->Image->query("SELECT * FROM images LIMIT 2;");

pourrait retourner::

    Array
    (
        [0] => Array
        (
            [images] => Array
            (
                [id] => 1304
                [utilisateur_id] => 759
            )
        )

        [1] => Array
        (
            [images] => Array
            (
                [id] => 1305
                [utilisateur_id] => 759
            )
        )
    )

Pour utiliser le nom du modèle comme clé du tableau et obtenir un résultat 
cohérent avec ce qui est retournée par les méthodes Find, la requête doit 
être réécrite::

    <?php
    $this->Image->query("SELECT * FROM images AS Image LIMIT 2;");

ce qui retourne::

    Array
    (
        [0] => Array
        (
            [Image] => Array
            (
                [id] => 1304
                [utilisateur_id] => 759
            )
        )

        [1] => Array
        (
            [Image] => Array
            (
                [id] => 1305
                [utilisateur_id] => 759
            )
        )
    )

.. note::

    This syntax and the corresponding array structure is valid for
    MySQL only. Cake does not provide any data abstraction when running
    queries manually, so exact results will vary between databases.

:php:meth:`Model::field()`
==========================

``field(string $name, array $conditions = null, string $order = null)``

Retourne la valeur d'un unique champ, spécifié par ``$name``, du premier 
enregistrement correspondant aux $conditions ordonnées par $order. Si 
aucune condition n'est passée et que l'id du modèle est fixé, cela 
retournera la valeur du champ pour le résultat de l'enregistrement actuel.
Si aucun enregistrement correspondant n'est trouvé cela retournera false.

::

    <?php
    $this->Billet->id = 22;
    echo $this->Billet->field('nom'); // affiche le nom pour la ligne avec l'id 22

    echo $this->Billet->field('nom', array('created <' => date('Y-m-d H:i:s')), 'created DESC');
    // affiche le nom de la dernière instance créée

:php:meth:`Model::read()`
=========================

``read($fields, $id)``

``read()`` est une méthode utilisée pour récupérer les données du modèle 
courant (``Model::$data``) - comme lors des mises à jour - mais elle peut 
aussi être utilisée dans d'autres circonstances, pour récupérer un seul 
enregistrement depuis la base de données.

``$fields`` est utilisé pour passer un seul nom de champ sous forme de 
chaîne ou un tableau de noms de champs ; si laissé vide, tous les champs 
seront retournés.

``$id`` précise l'ID de l'enregistrement à lire. Par défaut, 
l'enregistrement actuellement sélectionné, tel que spécifié par ``Model::$id``, 
est utilisé. Passer une valeur différente pour ``$id`` fera que 
l'enregistrement correspondant sera sélectionné.

``read()`` retourne toujours un tableau (même si seulement un nom de champ 
unique est requis). Utilisez ``field`` pour retourner la valeur d'un seul champ.

.. warning::

    Puisque la méthode ``read`` écrase toute information stockée dans les 
    propriétés ``data`` and ``id`` du modèle, vous devez faire très attention 
    quand vous utilisez cete fonction en général, spécialement en l'utilisant 
    dans les fonctions de callbacks du modèle comme ``beforeValidate`` et 
    ``beforeSave``. Généralement la fonction ``find`` est une façon de faire 
    plus robuste et facile à utiliser avec l'API que la méthode ``read``.

Conditions de recherche complexes
=================================

La plupart des appels de recherche de modèles impliquent le passage d’un 
jeu de conditions d’une manière ou d’une autre. Le plus simple est 
d’utiliser un bout de clause WHERE SQL. Si vous vous avez besoin de plus 
de contrôle, vous pouvez utiliser des tableaux.

L’utilisation de tableaux est plus claire et simple à lire, et rend également 
la construction de requêtes très simple. Cette syntaxe sépare également les 
éléments de votre requête (champs, valeurs, opérateurs etc.) en parties 
manipulables et discrètes. Cela permet à CakePHP de générer les requêtes les 
plus efficaces possibles, d’assurer une syntaxe SQL correcte, et d’échapper 
convenablement chaque partie de la requête. Utiliser une syntaxe en tableau 
permet aussi à CakePHP de sécuriser vos requêtes contre toute attaque 
d'injection SQL.

Dans sa forme la plus simple, une requête basée sur un tableau ressemble à 
ceci::

    <?php
    $conditions = array("Billet.titre" => "Il y a un billet", "Post.author_id" => 1);
    // Exemple d'utilisation avec un modèle:
    $this->Billet->find('first', array('conditions' => $conditions));

La structure ici est assez significative : Tous les billets dont le 
titre à pour valeur « Ceci est un billet » sont cherchés. Nous aurions 
pu uniquement utiliser « titre » comme nom de champ, mais lorsque l’on 
construit des requêtes, il vaut mieux toujours spécifier le nom du modèle. 
Cela améliore la clarté du code, et évite des collisions futures, dans 
le cas où vous devriez changer votre schéma.

Qu’en est-il des autres types de correspondances ? Elles sont aussi simples. 
Disons que nous voulons trouver tous les billets dont le titre n’est pas 
"Ceci est un billet":: 

    <?php
    array("Billet.titre !=" => "Il y a un billet")

Notez le '!=' qui précède l’expression. CakePHP peut parser tout opérateur 
de comparaison valide de SQL, même les expressions de correspondance 
utilisant LIKE, BETWEEN, ou REGEX, tant que vous laissez un espace entre 
l'opérateur et la valeur. La seule exception à ceci sont les correspondance 
du genre IN(...). Admettons que vous vouliez trouver les billets dont le titre 
appartient à un ensemble de valeur données:: 

    <?php
    array(
        "Billet.titre" => array("Premier billet", "Deuxième billet", "Troisième billet")
    )

Faire un NOT IN(...) correspond à trouver les billets dont le titre n'est pas 
dans le jeu de données passé::

    <?php
    array(
        "NOT" => array("Billet.titre" => array("Premier billet", "Deuxième billet", "Troisième billet"))
    )

Ajouter des filtres additionnels aux conditions est aussi simple que d’ajouter 
des paires clé/valeur au tableau::

    <?php
    array (
        "Billet.titre" => array("Premier billet", "Deuxième billet", "Troisième billet"),
        "Billet.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

Vous pouvez également créer des recherches qui comparent deux champs de la 
base de données::

    <?php
    array("Billet.created = Billet.modified")

L'exemple ci-dessus retournera les billets où la date de création est égale 
à la date de modification (ie les billets qui n'ont jamais été modifiés sont 
retournés).

Souvenez-vous que si vous vous trouvez dans l'incapacité de formuler une 
clause WHERE par cette méthode (ex. opérations booléennes),il vous est toujours 
possible de la spécifier sous forme de chaîne comme ceci::

    <?php
    array(
        'Model.champ & 8 = 1',
        // autres conditions habituellement utilisées
    )

Par défaut, CakePHP fournit les conditions multiples avec l’opérateur booléen 
AND, ce qui signifie que le bout de code ci-dessus correspondra uniquement 
aux billets qui ont été créés durant les deux dernières semaines, et qui ont 
un titre correspondant à ceux donnés. Cependant, nous pouvons simplement 
trouver les billets qui correspondent à l’une ou l’autre des conditions:: 

    <?php
    array("OR" => array(
        "Billet.titre" => array("Premier billet", "Deuxième billet", "Troisième billet"),
        "Billet.created >" => date('Y-m-d', strtotime("-2 weeks"))
    ))

Cake accepte toute opération booléenne SQL valide, telles que AND, OR, NOT, 
XOR, etc., et elles peuvent être en majuscule comme en minuscule, comme vous 
préférez. Ces conditions sont également infiniment "IMBRIQUABLES". Admettons 
que vous ayez une relation hasMany/belongsTo entre Billets et Auteurs, ce qui 
reviendrait à un LEFT JOIN. Admettons aussi que vous vouliez trouver tous les 
billets qui contiennent un certain mot-clé "magique" ou qui a été créé au 
cours des deux dernières semaines, mais que vous voulez restreindre votre 
recherche aux billets écrits par Bob::

    <?php
    array(
        "Auteur.nom" => "Bob",
        "OR" => array(
            "Billet.titre LIKE" => "%magic%",
            "Billet.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Si vous avez besoin de mettre plusieurs conditions sur le même champ, comme 
quand vous voulez faire une recherche LIKE avec des termses multiples, vous 
pouvez faire ceci en utilisant des conditions identiques à::

    <?php
    array('OR' => array(
        array('Billet.titre LIKE' => '%one%'),
        array('Billet.titre LIKE' => '%two%')
    ))

Cake peut aussi vérifier les champs null. Dans cet exemple, la requête 
retournera les enregistrements où le titre du billet n'est pas null::

    <?php
    array("NOT" => array(
            "Billet.titre" => null
        )
    )

Pour gérer les requêtes BETWEEN, vous pouvez utiliser ceci::

    <?php
    array('Billet.read_count BETWEEN ? AND ?' => array(1,10))

.. note::

    CakePHP quotera les valeurs numériques selon le type du champ dans votre 
    base de données.

Qu'en est-il de GROUP BY ?::

    <?php
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

Un exemple rapide pour faire une requête DISTINCT. Vous pouvez utiliser 
d'autres opérateurs, comme MIN(), MAX(), etc..., d'une manière analogue::

    <?php
    array(
        'fields' => array('DISTINCT (User.nom) AS nom_de_ma_colonne'),'),
        'order' = >array('User.id DESC')
    )

Vous pouvez créer des conditions très complexes, en regroupant des tableaux 
de conditions multiples::

    <?php
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
       (`Entreprise`.`nom` = 'Le truc qui marche bien'))
    AND
       ((`Entreprise`.`status` = 'active')
       OR (NOT (`Entreprise`.`status` IN ('inactive', 'suspendue'))))

Sous requêtes
-------------

Par exemple, imaginons que nous ayons une table "users" avec 
"id", "nom" et "statuts". Le statuts peut être "A", "B" ou "C". Et 
nous voulons récupérer tous les users qui ont un statuts différent 
de "B" en utilisant une sous requête.

Pour pouvoir effectuer cela, nous allons appeler la source de données du 
modèle et lui demander de construire la requête comme si nous appelions 
une méthode "find", mais elle retournera uniquement la commande SQL. Après 
cela, nous construisons une expression et l'ajoutons au tableau des conditions::

    <?php
    $conditionsSubQuery['"Utilisateur2"."status"'] = 'B';

    $db = $this->Utilisateur->getDataSource();
    $subQuery = $db->buildStatement(
        array(
            'fields'     => array('"Utilisateur2"."id"'),
            'table'      => $db->fullTableName($this->Utilisateur),
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
    $subQuery = ' "User"."id" NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $db->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->Utilisateur->find('all', compact('conditions'));

Ceci devrait généré la commande SQL suivante::

    SELECT
        "User"."id" AS "User__id",
        "User"."name" AS "User__nom",
        "User"."status" AS "User__status"
    FROM
        "users" AS "User"
    WHERE
        "User"."id" NOT IN (
            SELECT
                "User2"."id"
            FROM
                "users" AS "User2"
            WHERE
                "User2"."status" = 'B'
        )

Aussi, si vous devez passer juste une partie de votre requête en 
raw SQL comme ci-dessus, ma source de données **expressions** avec 
le travail de raw SQL pour toute partie de requête find.

Requêtes Préparées
------------------

Si vous avez besoin d'encore plus de contrôle sur vos requêtes, vous pouvez 
utiliser des requêtes préparées. Cela vous permet de parler directement au 
driver de la base de données et d'envoyer toute requête custom que vous 
souhaitez::

    <?php
    $db = $this->getDataSource();
    $db->fetchAll(
        'SELECT * from utilisateurs where username = ? AND password = ?',
        array('jhon', '12345')
    );
    $db->fetchAll(
        'SELECT * from utilisateurs where username = :username AND password = :password',
        array('username' => 'jhon','password' => '12345')
    );



.. meta::
    :title lang=fr: Récupérer vos données
    :keywords lang=fr: caractère majuscule,tableau modèle,tableau order,code controller contrôleur,fonctions de récupération,couche modèle,méthodes modèle,classe modèle,donnée modèle,donnée récupérée,champ names,workhorse,desc,neighbors,parameters,storage,models