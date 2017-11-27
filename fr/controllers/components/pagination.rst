Pagination
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

Les principaux défis lors de la création d'une application flexible et
ergonomique sont le design et d'avoir une interface utilisateur intuitive.
De nombreuses applications ont tendance à augmenter rapidement en taille et en
complexité, et les designers ainsi que les programmeurs trouvent même qu'ils
sont incapables de faire face a l'affichage de centaines ou de milliers
d'enregistrements. Réécrire prend du temps, et les performances et la
satisfaction des utilisateurs peut en pâtir.

Afficher un nombre raisonnable d'enregistrements par page a toujours été une
partie critique dans toutes les applications et cause régulièrement de nombreux
maux de tête aux développeurs. CakePHP allège le fardeau des développeurs en
fournissant un moyen rapide et facile pour paginer les données.

La pagination dans CakePHP se fait par un Component dans le controller, pour
faciliter la création des requêtes de pagination. Dans la Vue,
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` est utilisé pour faciliter la
génération de la pagination, des liens et des boutons.

Utiliser Controller::paginate()
===============================

Dans le controller, nous commençons par définir les conditions de la requête de
pagination qui seront utilisées par défaut dans la variable ``$paginate`` du
controller. Ces conditions, vont servir de base à vos requêtes de pagination.
Elles sont complétées par les paramètres ``sort``, ``direction``, ``limit`` et
``page`` passés dans l'URL. Ici, il est important de noter que la clé ``order``
doit être définie dans une structure en tableau comme ci-dessous::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Vous pouvez aussi inclure d'autres options
:php:meth:`~Cake\\ORM\\Table::find()`, comme ``fields``::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'fields' => ['Articles.id', 'Articles.created'],
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Alors que vous pouvez passer la plupart des options de query à partir de la
propriété paginate, il est souvent plus propre et simple de mettre vos options
de pagination dans une :ref:`custom-find-methods`. vous pouvez définir
l'utilisation de la pagination du finder en configurant l'option ``findType``::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'finder' => 'published',
        ];
    }

Comme les méthodes finder personnalisées peuvent aussi être prises en options,
voici comment vous pouvez passer des options  dans une méthode de finder
personnalisée dans la propriété paginate::

    class ArticlesController extends AppController
    {

        // trouve les articles selon les tags
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];
            // la méthode de finder personnalisée est appelée findTagged dans
            // ArticlesTable.php
            // elle devrait ressembler à ceci:
            // public function findTagged(Query $query, array $options) {
            // ainsi vous utilisez tagged en clé
            $this->paginate = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];

            $articles = $this->paginate($this->Articles);

            $this->set(compact('articles', 'tags'));
        }
    }

En plus de définir les valeurs de pagination générales, vous pouvez définir
plus d'un jeu de pagination par défaut dans votre controller, vous avez juste
à nommer les clés du tableau d'après le model que vous souhaitez configurer::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Les valeurs des clés ``Articles`` et ``Authors`` peuvent contenir toutes
les propriétés qu'un model/clé sans ``$paginate`` peut contenir.

Une fois que la variable ``$paginate`` à été définie, nous pouvons
utiliser la méthode :php:meth:`~Cake\\Controller\\Controller::paginate()` pour
créer les données paginées et ajouter le ``PaginatorHelper`` s'il n'a pas déjà
été ajouté. La méthode paginate du controller va retourner l'ensemble des
résultats de la requête paginée, et définir les meta-données de pagination de
la requête. Vous pouvez accéder aux meta-données de pagination avec
``$this->request->getParam('paging')``. un exemple plus complet de l'utilisation
de ``paginate()`` serait::

    class ArticlesController extends AppController
    {

        public function index()
        {
            $this->set('articles', $this->paginate());
        }
    }

Par défaut la méthode ``paginate()`` va utiliser le model par défaut pour un
controller. Vous pouvez aussi passer la requête résultante d'une méthode find::

     public function index()
     {
        $query = $this->Articles->find('popular')->where(['author_id' => 1]);
        $this->set('articles', $this->paginate($query));
     }

Si vous voulez paginer un model différent, vous pouvez lui fournir une requête
l'objet table lui-même, ou son nom::

    //Utiliser une query
    $comments = $this->paginate($commentsTable->find());

    // Utiliser le nom du model.
    $comments = $this->paginate('Comments');

    // Utiliser un objet table.
    $comments = $this->paginate($commentTable);

Utiliser Directement Paginator
==============================

Si vous devez paginer des données d'un autre component, vous pouvez utiliser
directement PaginatorComponent. Il fournit une API similaire à la méthode
du controller::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Ou
    $articles = $this->Paginator->paginate($articleTable, $config);

Le premier paramètre doit être l'objet query à partir d'un find sur l'objet
table duquel vous souhaitez paginer les résultats. En option, vous pouvez passer
l'objet table et laisser la query être construite pour vous. Le second paramètre
doit être le tableau des configurations à utiliser pour la pagination. Ce
tableau doit avoir la même structure que la propriété ``$paginate``
dans un controller. Quand on pagine un objet ``Query``, l'option ``finder``
sera ignorée. Il faut que vous passiez la query que vous souhaitez voir
paginée.

.. _paginating-multiple-queries:

Requêtes de Paginating Multiple
===============================

Vous pouvez paginer plusieurs models dans une unique action de controller en
utilisant l'option ``scope``, à la fois via la propriété ``$paginate`` d'un
controller et dans l'appel à la méthode ``paginate()``::

    // Paginate property
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // Dans une action de controller
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

L'option ``scope`` va faire que ``PaginatorComponent`` va regarder les
paramètres de query string scopés. Par exemple, l'URL suivante pourrait être
utilisée pour paginer les tags et les articles en même temps::

    /dashboard?article[page]=1&tag[page]=3

Consulter la section :ref:`paginator-helper-multiple` pour savoir comment
générer les elements HTML scopés et les URLS pour la pagination.

.. versionadded:: 3.3.0
    Pagination multiple a été ajoutée dans la version 3.3.0

Contrôle les Champs Utilisés pour le Tri
========================================

Par défaut le tri peut être fait sur n'importe quelle colonne qu'une table a.
Ceci est parfois non souhaité puisque cela permet aux utilisateurs de trier sur
des colonnes non indexées qui peuvent être compliqués à trier. Vous pouvez
définir la liste blanche des champs qui peut être triée en utilisant
l'option ``sortWhitelist``. Cette option est nécessaire quand vous voulez trier
sur des données associées, ou des champs computés qui peuvent faire parti de
la query de pagination::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Toute requête qui tente de trier les champs qui ne sont pas dans la liste
blanche sera ignorée.

Limiter le Nombre Maximum de Lignes par Page
============================================

Le nombre de résultat qui sont récupérés est montré à l'utilisateur dans le
paramètre ``limit``. Il est généralement non souhaité de permettre aux
utilisateurs de récupérer toutes les lignes d'un ensemble paginé. L'option
``maxLimit`` permet à ce que personne ne puisse définir cette limite trop haute
de l'extérieur. Par défaut, CakePHP limite le nombre maximum de lignes qui
peuvent être récupérées à 100. Si par défaut ce n'est pas approprié pour votre
application, vous pouvez l'ajuster dans les options de pagination, par exemple
en le réduisant à ``10``::

    public $paginate = [
        // Autres clés ici.
        'maxLimit' => 10
    ];

Si le paramètre de limite de la requête est plus grand que cette valeur, elle
sera réduite à la valeur ``maxLimit``.

Faire des Jointures d'Associations Supplémentaires
==================================================

Des associations supplémentaires peuvent être chargées à la table paginée en
utilisant le paramètre ``contain``::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

Requêtes de Page Out of Range
=============================

PaginatorComponent va lancer une ``NotFoundException`` quand on essaie d'accéder
une page non existante, par ex le nombre de page demandé est supérieur au total
du nombre de page.

Ainsi vous pouvez soit laisser s'afficher la page d'erreur normale, soit
utiliser un bloc try catch et faire des actions appropriées quand une
``NotFoundException`` est attrapée::

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Faire quelque chose ici comme rediriger vers la première ou dernière page.
            // $this->request->getParam('paging') vous donnera les infos demandées.
        }
    }

Pagination dans la Vue
======================

Regardez la documentation :php:class:`~Cake\\View\\Helper\\PaginatorHelper`
pour savoir comment créer des liens de navigation paginés.

.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
