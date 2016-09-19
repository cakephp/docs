Pagination
##########

.. php:class:: PaginatorComponent(ComponentCollection $collection, array $settings = array())

Un des principaux obstacles à la création d'une application flexible et
ergonomique est le design et une interface utilisateur intuitive.
De nombreuses applications ont tendance à augmenter en taille et en complexité
rapidement, et les designers ainsi que les programmeurs trouvent même qu'ils
sont incapables de faire face a l'affichage des centaines ou des milliers
d'enregistrements. Réécrire prend du temps, et les performances et la
satisfaction des utilisateurs peut en pâtir.

Afficher un nombre raisonnable d'enregistrements par page a toujours été
une partie critique dans toutes les applications et cause régulièrement
de nombreux maux de tête aux développeurs. CakePHP allège le fardeau
des développeurs en fournissant un moyen rapide et facile de paginer
les données.

La pagination dans CakePHP est offerte par un Component dans le controller,
pour rendre la création des requêtes de pagination plus facile.
Dans la Vue, :php:class:`PaginatorHelper` est utilisé pour rendre la
génération de la pagination, des liens et des boutons simples.

Paramétrage des requêtes
========================

Dans le controller, nous commençons par définir les conditions de la requête de
pagination qui seront utilisées par défaut dans la variable ``$paginate`` du
controller.
Ces conditions, vont servir de base à vos requêtes de pagination. Elles sont
complétées par les paramètres ``sort``, ``direction``, ``limit`` et ``page``
passés dans l'URL. Ici, il est important de noter que la clé ``order`` doit
être définie dans une structure en tableau comme ci-dessous::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

Vous pouvez aussi inclure d'autres options :php:meth:`~Model::find()`,
comme ``fields``::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

D'autres clés qui peuvent être introduites dans le tableau ``$paginate`` sont
similaires aux paramètres de la méthode ``Model->find('all')``, qui sont:
``conditions``, ``fields``, ``order``, ``limit``, ``page``,
``contain``,``joins``, et ``recursive``. En plus des touches mentionnées
ci-dessus, chacune des clés peut aussi être passé à la méthode find du model.
Ça devient alors très simple d'utiliser les component comme
:php:class:`ContainableBehavior` avec la pagination::

    class RecipesController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

En plus de définir des valeurs de pagination générales, vous pouvez définir
plus d'un jeu de pagination par défaut dans votre controller, vous avez juste à
nommer les clés du tableau d'après le model que vous souhaitez configurer::

    class PostsController extends AppController {

        public $paginate = array(
            'Post' => array (...),
            'Author' => array (...)
        );
    }

Les valeurs des clés ``Post`` et ``Author`` pourraient contenir toutes
les propriétés qu'un model/clé sans ``$paginate`` pourraient contenir.

Une fois que la variable ``$paginate`` à été définie, nous pouvons
utiliser la méthode ``paginate()`` du :php:class:`PaginatorComponent` de
l'action de notre controller. Ceci retournera les résultats du ``find()``
depuis le model. Il définit également quelques paramètres de pagination
supplémentaires, qui sont ajoutés à l'objet request. L'information
supplémentaire est définie dans ``$this->request->params['paging']``, et est
utilisée par :php:class:`PaginatorHelper` pour la création des liens.
:php:meth:`PaginatorComponent::paginate()` ajoute aussi
:php:class:`PaginatorHelper` à la liste des helpers dans votre controller, si
il n'a pas déjà été ajouté::

    public function list_recipes() {
        $this->Paginator->settings = $this->paginate;

        // similaire à un findAll(), mais récupère les résultats paginés
        $data = $this->Paginator->paginate('Recipe');
        $this->set('data', $data);
    }

Vous pouvez filtrer les enregistrements en passant des conditions
en second paramètre à la fonction ``paginate()``::

    $data = $this->Paginator->paginate(
        'Recipe',
        array('Recipe.title LIKE' => 'a%')
    );

Ou vous pouvez aussi définir des ``conditions`` et d'autres tableaux de
configuration de pagination à l'intérieur de votre action::

    public function list_recipes() {
        $this->Paginator->settings = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->Paginator->paginate('Recipe');
        $this->set(compact('data'));
    }

Personnalisation des requêtes de pagination
===========================================

Si vous n'êtes pas prêts à utiliser les options standards du find pour créer
la requête d'affichage de vos données, il y a quelques options.
Vous pouvez utiliser :ref:`custom find type <model-custom-find>`.
Vous pouvez aussi implémenter les méthodes ``paginate()`` et ``paginateCount()``
sur votre model, ou les inclure dans un behavior attaché à votre model.
Les behaviors qui implémentent ``paginate`` et/ou ``paginateCount`` devraient
implémenter les signatures de méthode définies ci-dessous avec le premier
paramètre normal supplémentaire de ``$model``::

    // paginate et paginateCount implémentés dans le behavior.
    public function paginate(Model $model, $conditions, $fields, $order, $limit,
        $page = 1, $recursive = null, $extra = array()) {
        // contenu de la méthode
    }

    public function paginateCount(Model $model, $conditions = null,
        $recursive = 0, $extra = array()) {
        // corps (body) de la méthode
    }

C'est rare d'avoir besoin d'implémenter paginate() et paginateCount(). vous
devriez vous assurer que vous ne pouvez pas atteindre votre but avec les
méthodes du noyau du model, ou avec un finder personnalisé. Pour paginer avec
un type de find personnalisé, vous devez définir le ``0``'ème element, ou la
clé ``findType`` depuis la version 2.3::

    public $paginate = array(
        'popular'
    );

Puisque le 0ème index est difficile à gérer, dans 2.3 l'option ``findType`` a
été ajoutée::

    public $paginate = array(
        'findType' => 'popular'
    );

La méthode ``paginate()`` devrait implémenter les signatures de méthode
suivantes. Pour utiliser vos propres méthodes/logiques, surchargez les
dans le model dans lequel vous voulez récupérer des données::

    /**
     * Surcharge de la méthode paginate - groupée par week, away_team_id et home_team_id
     */
    public function paginate($conditions, $fields, $order, $limit, $page = 1,
        $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order',
             'limit', 'page', 'recursive', 'group'));
    }

Vous aurez aussi besoin de surcharger le ``paginateCount()`` du noyau,
cette méthode s'attend aux mêmes arguments que ``Model::find('count')``.
L'exemple ci-dessous utilise quelques fonctionnalités PostgreSQL spécifiques,
Veuillez ajuster en conséquence en fonction de la base de données que vous
utilisez::

    /**
     * Surcharge de la méthode paginateCount
     */
    public function paginateCount($conditions = null, $recursive = 0,
        $extra = array()) {
         $sql = "SELECT
            DISTINCT ON(
                week, home_team_id, away_team_id
            )
                week, home_team_id, away_team_id
            FROM
                games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

Le lecteur attentif aura noté que la méthode paginate que nous avons définie
n'était pas réellement nécessaire - Tout ce que vous avez à faire est
d'ajouter le mot clé dans la variable de classe ``$paginate`` du controller::

    /**
     * Ajout d'une clause GROUP BY
     */
    public $paginate = array(
        'MyModel' => array(
            'limit' => 20,
            'order' => array('week' => 'desc'),
            'group' => array('week', 'home_team_id', 'away_team_id')
        )
    );
    /**
     * Ou à la volée depuis l'intérieur de l'action
     */
    public function index() {
        $this->Paginator->settings = array(
            'MyModel' => array(
                'limit' => 20,
                'order' => array('week' => 'desc'),
                'group' => array('week', 'home_team_id', 'away_team_id')
            )
        );
    }

Dans CakePHP 2.0, vous n'avez plus besoin d'implémenter ``paginateCount()``
quand vous utilisez des clauses de groupe. Le ``find('count')`` du groupe
comptera correctement le nombre total de lignes.

Contrôle du champ à utiliser pour ordonner
==========================================

Par défaut le classement peut être effectué pour n'importe quelle colonne dans
un model. C'est parfois indésirable comme permettre aux utilisateurs de trier
des colonnes non indexées, ou des champs virtuels ce qui peut être coûteux en
temps de calculs. Vous pouvez utiliser le 3ème paramètre de
``PaginatorComponent::paginate()`` pour restreindre les colonnes à trier
en faisant ceci::

    $this->Paginator->paginate('Post', array(), array('title', 'slug'));

Ceci permettrait le tri uniquement sur les colonnes title et slug.
Un utilisateur qui paramètre le tri à d'autres valeurs sera ignoré.

Limitation du nombre maximum de lignes par page
===============================================

Le nombre de résultats qui sont retournés par page à l'utilisateur est
représenté par le paramètre ``limit``. Il est généralement indésirable de
permettre à l'utilisateur de retourner toutes les lignes dans un ensemble
paginé. L'option ``maxLimit`` permet à ce que personne ne puisse définir cette
limite trop haute de l'extérieur. Par défaut CAKEPHP limite le nombre de lignes
retournées à 100. Si cette valeur par défaut n'est pas appropriée pour votre
application, vous pouvez l'ajuster dans une partie des options de pagination,
par exemple en le réduisant à ``10``::

    public $paginate = array(
        // d'autre clés ici.
        'maxLimit' => 10
    );

Si le paramètre de limitation de la requête est supérieur à cette valeur, il
sera réduit à la valeur de ``maxLimit``.

.. _pagination-with-get:

Pagination avec des paramètres GET
==================================

Dans les versions précédentes de CAKEPHP vous ne pouviez générer des liens de
pagination qu'en utilisant des paramètres nommés. Mais si les pages étaient
recherchées avec des paramètres GET elle continueraient à fonctionner. Pour la
version 2.0, nous avons décidés de rendre la façon de générer les paramètres de
pagination plus contrôlable et plus cohérente. Vous pouvez choisir d'utiliser
une chaîne de requête ou bien des paramètre nommés dans le component. Les
requêtes entrantes devront accepter le type choisi, et
:php:class:`PaginatorHelper` générera les liens avec les paramètres choisis::

    public $paginate = array(
        'paramType' => 'querystring'
    );

Ce qui est au-dessus permet à un paramètre de recherche sous forme de chaîne de
caractères, d'être parsé et d'être généré. Vous pouvez aussi modifier les
propriétés de ``$settings`` du Component Paginator (PaginatorComponent)::

    $this->Paginator->settings['paramType'] = 'querystring';

Par défaut tous les paramètres de pagination typiques seront convertis en
arguments GET.


.. note::

    Vous pouvez rentrer dans une situation où assigner une valeur dans une
    propriété inexistante retournera des erreurs::

        $this->paginate['limit'] = 10;

    Retournera l'erreur "Notice: Indirect modification of overloaded property
    $paginate has no effect." ("Notice: Une modification indirect d'une surcharge de
    la propriété $paginate n'a aucun effet."). En assignant une valeur initiale à la
    propriété, cela résout le problème::

        $this->paginate = array();
        $this->paginate['limit'] = 10;
        //ou
        $this->paginate = array('limit' => 10);

    Ou juste en déclarant la propriété dans la classe du controller ::

        class PostsController {
            public $paginate = array();
        }

    Ou en utilisant ``$this->Paginator->setting = array('limit' => 10);``

    Assurez-vous d'avoir ajouté le component Paginator dans votre tableau
    $components si vous voulez modifier la propriété ``$settings`` du
    Component Paginator.

    L'une ou l'autre de ces approches résoudra les erreurs rencontrés.

Requêtes en dehors des clous
============================

Depuis la version 2.3, PaginatorComponent va lancer une `NotFoundException`
quand il essaiera d'accéder à une page qui n'existe pas, par ex le nombre
de la page requêtée est plus grand que le total du nombre de pages.

Ainsi vous pouvez soit laisser la page d'erreur normal être rendu ou bien
vous pouvez utiliser un block try catch et renvoyer vers l'action appropriée
quand une exception `NotFoundException` est attrapée::

    public function index() {
        try {
            $this->Paginator->paginate();
        } catch (NotFoundException $e) {
            //Faire quelque chose ici comme rediriger à la première ou dernière page.
            //$this->request->params['paging'] va vous donner l'info nécessaire.
        }
    }

Pagination AJAX
===============

C'est très simple d'incorporer les fonctionnalités AJAX dans la pagination.
en utilisant :php:class:`JsHelper` et :php:class:`RequestHandlerComponent`
vous pouvez facilement ajouter des paginations AJAX à votre application.
Voir :ref:`ajax-pagination` pour plus d'information.

Pagination dans la vue
======================

Regardez la documentation du :php:class:`PaginatorHelper` pour voir comment
créer des liens de navigation paginés.


.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
