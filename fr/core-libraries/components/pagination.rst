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

    class PostsController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'limit' => 25,
            'order' => [
                'Posts.title' => 'asc'
            ]
        ];
    }

Vous pouvez aussi inclure d'autres options
:php:meth:`~Cake\\ORM\\Table::find()`, comme ``fields``::

    class PostsController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'fields' => ['Posts.id', 'Posts.created'],
            'limit' => 25,
            'order' => [
                'Post.title' => 'asc'
            ]
        ];
    }

Alors que vous pouvez passer la plupart des options de query à partir de la
propriété paginate, il est souvent plus propre et simple de mettre vos options
de pagination dans une :ref:`custom-find-methods`. Vous pouver définir
l'utilisation de la pagination du finder en configurant l'option ``findType``::

    class PostsController extends AppController {

        public $paginate = [
            'findType' => 'published',
        ];
    }

En plus de définir les valeurs de pagination générales, vous pouvez définir
plus d'un jeu de pagination par défaut dans votre controller, vous avez juste
à nommer les clés du tableau d'après le model que vous souhaitez configurer::

    class PostsController extends AppController {

        public $paginate = [
            'Posts' => [],
            'Authors' => [],
        ];
    }

Les valeurs des clés ``Posts`` et ``Authors`` peuvent contenir toutes
les propriétés qu'un model/clé sans ``$paginate`` peut contenir.

Une fois que la variable ``$paginate`` à été définie, nous pouvons
utiliser la méthode ``~Cake\\Controller\Controller::paginate()`` pour créer
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

If you need to paginate data from another component you may want to use the
PaginatorComponent directly. It features a similar API to the controller
method::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    //Or just
    $articles = $this->Paginator->paginate($articleTable, $config);

The first parameter should be the query object from a find on table object you wish
to paginate results from. Optionally, you can pass the table object and let the query
be constructed for you. The second parameter should be the array of settings to use for
pagination. This array should have the same structure as the ``$paginate``
property on a controller.

Control which Fields Used for Ordering
======================================

By default sorting can be done on any non-virtual column a table has. This is
sometimes undesirable as it allows users to sort on un-indexed columnsthat can
be expensive to order by. You can set the whitelist of fields that can be sorted
using the ``sortWhitelist`` option. This option is required when you want to
sort on any associated data, or computed fields that may be part of your
pagination query::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Any requests that attempt to sort on fields not in the whitelist will be
ignored.

Limit the Maximum Number of Rows that can be Fetched
====================================================

The number of results that are fetched is exposed to the user as the
``limit`` parameter. It is generally undesirable to allow users to fetch all
rows in a paginated set. By default CakePHP limits the maximum number of rows
that can be fetched to 100. If this default is not appropriate for your
application, you can adjust it as part of the pagination options::

    public $paginate = array(
        // other keys here.
        'maxLimit' => 10
    );

If the request's limit param is greater than this value, it will be reduced to
the ``maxLimit`` value.

Out of Range Page Requests
==========================

The PaginatorComponent will throw a ``NotFoundException`` when trying to
access a non-existent page, i.e. page number requested is greater than total
page count.

So you could either let the normal error page be rendered or use a try catch
block and take appropriate action when a ``NotFoundException`` is caught::

    public function index() {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Do something here like redirecting to first or last page.
            // $this->request->params['paging'] will give you required info.
        }
    }

Pagination dans la Vue
======================

Regardez la documentation :php:class:`~Cake\\View\\Helper\\PaginatorHelper`
pour savoir comment créer des liens de navigation paginés.


.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
