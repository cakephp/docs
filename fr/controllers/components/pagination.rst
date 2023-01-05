Pagination
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

.. deprecated:: 4.4.0
    Le Component paginator est déprécié depuis 4.4.0 et sera supprimé dans 5.0.

L'un des principaux défis pour créer une application flexible et ergonomique est
la conception d'une interface utilisateur intuitive.
De nombreuses applications ont tendance à augmenter rapidement en taille et en
complexité, et les designers comme les programmeurs se retrouvent incapables de
faire face à l'affichage de centaines ou de milliers d'enregistrements. Réécrire
prend du temps, et les performances et la satisfaction des utilisateurs peuvent
en pâtir.

Afficher un nombre raisonnable d'enregistrements par page a toujours été une
partie critique dans toutes les applications et cause régulièrement de nombreux
maux de tête aux développeurs. CakePHP allège le fardeau des développeurs en
fournissant un moyen efficace de paginer les données.

La pagination dans CakePHP se fait par un Component dans le controller, pour
faciliter la création des requêtes de pagination. Vous utilisez ensuite
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` dans vos templates de vue pour
générer les contrôles de pagination.

Usage basique
=============

Pour paginer une requête, nous commençons par charger le
``PaginatorComponent``::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Une fois qu'il est chargé, nous pouvons paginer une classe de table de l'ORM ou
un objet ``Query``::

    public function index()
    {
        // Paginer une table de l'ORM.
        $this->set('articles', $this->paginate($this->Articles));

        // Paginer une requête en cours de construction.
        $query = $this->Articles->find('published');
        $this->set('articles', $this->paginate($query));
    }

Utilisation avancée
===================

Le ``PaginatorComponent`` peut supporter des cas de figure plus complexes en
configurant la propriété ``$paginate`` du controller ou l'argument ``$settings``
de ``paginate()``. Ces conditions servent de base pour vos requêtes de
pagination. On leur ajoute ensuite les paramètres ``sort``, ``direction``,
``limit``, et ``page`` passés dans l'URL::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

.. tip::
    L'option par défaut ``order`` doit être définie dans un tableau.

Cependant vous pouvez passer dans vos paramètres de pagination n'importe quelle
option supportée par :php:meth:`~Cake\\ORM\\Table::find()`, telle que
``fields``. Il est souvent plus propre et simple de mettre vos options
de pagination dans une :ref:`custom-find-methods`. vous pouvez définir
l'utilisation de la pagination du finder en configurant l'option ``findType``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

Si votre finder attend d'autres options, vous pouvez les passer comme des
valeurs pour le finder::

    class ArticlesController extends AppController
    {

        // trouve les articles selon les tags
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $optionsPersonnaliseesPourLeFinder = [
                'tags' => $tags
            ];
            // Nous utilisons ici l'argument $settings pour paginate().
            // Mais on pourrait utiliser la même structure dans $this->paginate
            //
            // Notre finder personnalisé s'appelle findTagged dans ArticlesTable.php
            // C'est pourquoi nous utilisons une clé `tagged`.
            // Voici à quoi devrait ressembler notre finder:
            // public function findTagged(Query $query, array $options) {
            $settings = [
                'finder' => [
                    'tagged' => $optionsPersonnaliseesPourLeFinder
                ]
            ];

            $articles = $this->paginate($this->Articles, $settings);

            $this->set(compact('articles', 'tags'));
        }
    }

En plus de définir les valeurs de pagination générales, vous pouvez définir
plusieurs jeux de pagination par défaut dans votre controller. Vous pouvez
utiliser le nom de chaque modèle comme clé dans la propriété ``$paginate``::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Les tableaux sous les clés ``Articles`` et ``Auteurs`` peuvent contenir toutes
les clés que ``$paginate`` peut contenir habituellement.

Une fois que nous avons utilisé ``paginate()`` pour créer des résultats, des
paramètres de pagination seront ajoutés à l'objet ``request`` du controller.
Vous pouvez accéder aux métadonnées de pagination par
``$this->request->getAttribute('paging')``.

Pagination Simple
=================

Par défaut, la pagination utilise une requête ``count()`` pour calculer le
nombre de résultats, de manière à pouvoir afficher les liens vers des numéros de
pages. Sur de grandes quantités de données, ce décompte peut devenir très
coûteux. Dans les situations où n'avez besoin que des boutons 'Précédent' et
'Suivant', vous pouvez utiliser le paginateur 'simple' qui ne lance pas de
requête de comptage::

    public function initialize(): void
    {
        parent::initialize();

        // Charger le component de pagination avec la stratégie simple.
        $this->loadComponent('Paginator', [
            'className' => 'Simple',
        ]);
    }

En utilisant le ``SimplePaginator``, vous ne pourrez pas générer des liens vers
des numéros de pages, ni des compteurs de données, ni un lien vers la dernière
page, ni le nombre total d'enregistrements.

Utiliser Paginator Directement
==============================

Si vous devez paginer des données depuis un autre component, vous pouvez
utiliser directement PaginatorComponent. Il fournit une API similaire à la
méthode du controller::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Ou
    $articles = $this->Paginator->paginate($articleTable, $config);

Le premier paramètre doit être l'objet query à partir d'un find sur l'objet
table dont vous souhaitez paginer les résultats. Au choix, vous pouvez aussi
passer l'objet table et laisser le paginator construire la requête pour vous. Le
second paramètre est le tableau de configuration à utiliser pour la pagination.
Ce tableau doit avoir la même structure que la propriété ``$paginate``
dans un controller. Quand on pagine un objet ``Query``, l'option ``finder``
sera ignorée. Vous devez passer la query que vous souhaitez paginer.

.. _paginating-multiple-queries:

Paginer Plusieurs Requêtes
==========================

Vous pouvez paginer plusieurs models dans la même action du controller en
utilisant l'option ``scope`` à la fois dans la propriété ``$paginate`` du
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
générer les éléments HTML scopés et les URLS pour la pagination.

Pour paginer plusieurs fois le même modèle dans une même action du controller,
vous devez définir un alias du modèle. Consultez :ref:`table-registry-usage`
pour plus de détails sur l'utilisation du registre de tables::

    // Dans une action de controller
    $this->paginate = [
        'ArticlesTable' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticlesTable' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', [
            'scope' => 'published_articles'
        ])->where(['published' => true])
    );

    // Charge un autre objet table pour permettre de les différencier dans le component de pagination
    $unpublishedArticlesTable = $this->fetchTable('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $unpublishedArticles = $this->paginate(
        $unpublishedArticlesTable->find('all', [
            'scope' => 'unpublished_articles'
        ])->where(['published' => false])
    );

Contrôler les Champs Utilisés pour le Tri
=========================================

Par défaut, vous pouvez trier sur n'importe quelle colonne non virtuelle d'une
table. Ce n'est pas toujours souhaitable puisque cela permet aux utilisateurs de
trier sur des colonnes non indexées qui peuvent être longues à trier. Vous
pouvez définir la liste des champs pouvant être triés en utilisant
l'option ``sortableFields``. Cette option est nécessaire quand vous voulez trier
sur des données associées, ou des champs calculés qui peuvent faire partie de
la requête de pagination::

    public $paginate = [
        'sortableFields' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Toute requête qui tentera de trier les champs qui ne sont pas dans cette liste
sera ignorée.

Limiter le Nombre Maximum de Lignes par Page
============================================

Le nombre de résultats récupérés pour chaque page peut être configuré par
l'utilisateur dans le paramètre ``limit``. D'une manière générale, il n'est pas
souhaitable que l'utilisateur puisse récupérer toutes les lignes d'un ensemble
paginé. L'option ``maxLimit`` permet que personne ne puisse définir de limite
trop haute depuis l'extérieur. Par défaut, CakePHP limite à un maximum de 100 le
nombre de lignes par page. Si cette valeur par défaut n'est pas appropriée pour
votre application, vous pouvez l'ajuster dans les options de pagination, par
exemple en le réduisant à ``10``::

    public $paginate = [
        // Autres clés ici.
        'maxLimit' => 10
    ];

Si le paramètre de limite de la requête est plus grand que cette valeur, elle
sera réduite à la valeur ``maxLimit``.

Faire des Jointures d'Associations Supplémentaires
==================================================

Vous pouvez charger des associations supplémentaires depuis la table paginée en
utilisant le paramètre ``contain``::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

Requêtes de Page Inexistante
============================

Quand on essaie d'accéder à une page inexistante, c'est-à-dire lorsque le numéro
de page demandé est supérieur au nombre total de pages, PaginatorComponent lance
une ``NotFoundException``.

Ainsi, vous avez le choix entre laisser la page d'erreur normale s'afficher, ou
utiliser un bloc try catch et exécuter des actions appropriées lorsqu'une
``NotFoundException`` est attrapée::

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Faire quelque chose ici, comme rediriger vers la première ou la dernière page.
            // $this->request->getAttribute('paging') vous donnera les infos nécessaires.
        }
    }

Pagination dans la Vue
======================

Consultez la documentation :php:class:`~Cake\\View\\Helper\\PaginatorHelper`
pour savoir comment créer des liens de navigation dans la pagination.

.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
