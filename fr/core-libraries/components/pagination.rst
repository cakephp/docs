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

Afficher un nombre raisonnable d'enregistrements par page a toujours été
une partie critique dans toutes les applications et cause régulièrement
de nombreux maux de tête aux développeurs. CakePHP allège le fardeau
des développeurs en fournissant un moyen rapide et facile pour paginer
les données.

La pagination dans CakePHP se fait par un Component dans le controller,
pour faciliter la création des requêtes de pagination.
Dans la Vue, :php:class:`~Cake\\View\\Helper\\PaginatorHelper` est utilisé pour
faciliter la génération de la pagination, des liens et des boutons.

Utiliser Controller::paginate()
===============================

Dans le controller, nous commençons par définir les conditions de la requête de
pagination qui seront utilisées par défaut dans la variable ``$paginate`` du
controller. Ces conditions, vont servir de base à vos requêtes de pagination.
Elles sont complétées par le tri, la direction, la limitation et les paramètres
de page passés depuis l'URL. Ici, il est important de noter que l'ordre des clés
doit être défini dans une structure en tableau comme ci-dessous::

    class ArticlesController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

Vous pouvez aussi inclure d'autres options
:php:meth:`~Cake\\ORM\\Table::find()`, comme ``fields``::

    class ArticlesController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'fields' => ['Articles.id', 'Articles.created'],
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

Alors que vous pouvez passer la plupart des options de query à partir de la
propriété paginate, il est souvent plus propre et simple de mettre vos options
de pagination dans une :ref:`custom-find-methods`. Vous pouver définir
l'utilisation de la pagination du finder en configurant l'option ``findType``::

    class ArticlesController extends AppController {

        public $paginate = [
            'finder' => 'published',
        ];
    }

En plus de définir les valeurs de pagination générales, vous pouvez définir
plus d'un jeu de pagination par défaut dans votre controller, vous avez juste
à nommer les clés du tableau d'après le model que vous souhaitez configurer::

    class ArticlesController extends AppController {

        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

Les valeurs des clés ``Articles`` et ``Authors`` peuvent contenir toutes
les propriétés qu'un model/clé sans ``$paginate`` peut contenir.

Une fois que la variable ``$paginate`` à été définie, nous pouvons
utiliser la méthode ``~Cake\\Controller\\Controller::paginate()`` pour créer
les données paginées et ajouter le ``PaginatorHelper`` si il n'a pas déjà été
ajouté. La méthode paginate du controller va retourner l'ensemble des résultats
de la requête paginée, et définir les meta-données de paginatino de la requête.
Vous pouvez accéder aux meta-données de pagination avec
``$this->request->params['paging']``. un exemple plus complet de l'utilisation
de ``paginate()`` serait::

    class ArticlesController extends AppController {

        public function index() {
            $this->set('articles', $this->paginate());
        }
    }

Par défaut la méthode ``paginate()`` va utiliser le model par défaut pour un
controller. Vous pouvez aussi passer la requête résultante d'une méthode find::

     public function index() {
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
directement PaginatorComponent. Il fournit une API similaire a à la méthode
du controller::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    //Or just
    $articles = $this->Paginator->paginate($articleTable, $config);

Le premier paramètre doit être l'objet query à partir d'un find sur l'objet
table duquel vous souhaitez paginer les résultats. En option, vous pouvez passer
l'objt table et laisser la query être construite par vous. Le second paramètre
doit être le tableau des configurations à utiliser pour la pagination. Ce
tableau doit avoir la même structure que la propriété ``$paginate``
dans un controller.

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

Limiter le Nombre Maximum de Lignes qui peuvent être Récupérées
===============================================================

Le nombre de résultat qui sont récupérés est montré à l'utilisateur dans le
paramètre ``limit``. Il est généralement non souhaité de permettre aux
utilisateurs de récupérer toutes les lignes d'un ensemble paginé. Par défaut,
CakePHP limite le nombre maximum de lignes qui peuvent être réupérées à
100. Si par défaut ce n'est pas approprié pour votre application, vous pouvez
l'ajuster dans les options de pagination::

    public $paginate = [
        // other keys here.
        'maxLimit' => 10
    ];

Si le param de limit de la requête est plus grand que cette valeur, elle sera
réduit à la valeur ``maxLimit``.

Requêtes de Page Out of Range
=============================

PaginatorComponent va lancer une ``NotFoundException`` quand on essaie
d'accéder une page non existante, par ex le nombre de page demandé est supérieur
au total du nombre de page.

Ainsi vous pouvez soit laisser s'afficher la page d'erreur normal, soit utiliser
un block try catch et faire des actions appropriées quand une
``NotFoundException`` est attrapée::

    public function index() {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Faire quelque chose ici comme rediriger vers la première ou dernière page.
            // $this->request->params['paging'] vous donnera les onfos demandées.
        }
    }

Pagination dans la Vue
======================

Regardez la documentation :php:class:`~Cake\\View\\Helper\\PaginatorHelper`
pour savoir comment créer des liens de navigation paginés.


.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
