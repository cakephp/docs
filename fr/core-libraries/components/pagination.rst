Pagination
##########

.. php:class:: PaginatorComponent(ComponentCollection $collection, array $settings = array())

Un des principaux obstacle à la création d'une application flexible et
ergonomique est le design et une interface utilisateur intuitive.
De nombreuses applications ont tendances à augmenter en taille et en complexité 
rapidement, et les designers ainsi que les programmeurs  trouvent même qu'ils
sont incapables de faire face a l'affichage des centaines ou des milliers 
d'enregistrements.
Réécrire prend du temps, et les performances et la satisfaction des
utilisateurs peut en pâtir .

Afficher un nombre raisonnable d'enregistrements par page à toujours été
une partie critique dans toutes les applications et cause régulièrement
de nombreux maux de tête aux développeurs. CakePHP allège le fardeau 
des développeurs en fournissant un moyen rapide et facile de paginer 
les données.

La pagination dans CakePHP est offerte par un Composant dans le contrôleur,
pour rendre la création des requêtes de pagination plus facile.
Dans la Vue :php:class:`PaginatorHelper` est utilisé pour rendre la
génération de la pagination, des liens et des boutons simple.  

Paramétrage des requêtes
========================

Dans le contrôleur, nous commençons par définir les conditions de la requête de
pagination qui seront utilisées par défaut dans la variable ``$paginate`` du
contrôleur. 
Ces conditions, vont servir de base à vos requêtes de pagination. Elles sont
complétées par le tri, la direction, la limitation et les paramètres de page
passés depuis l'url. Ici, il est important de noter que l'ordre des clefs 
doit être définis dans une structure en tableau comme ci-dessous:: 

    class PostsController extends AppController {

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

        public $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

D'autres clefs qui peuvent être introduite dans le tableau ``$paginate``
sont similaires aux paramètres de la méthode ``Model->find('all')``,
qui sont: ``conditions``, ``fields``, ``order``, ``limit``, ``page``, 
``contain``,``joins``, et ``recursive``. En plus des touches mentionnées
ci dessus, chacune des clefs peut aussi être passé à la méthode find du 
modèle. Ça devient alors très simple d'utiliser les comportement comme
:php:class:`ContainableBehavior` avec la pagination::

    class RecipesController extends AppController {

        public $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

En plus de définir des valeurs de pagination générales, vous pouvez définir
plus d'un jeu de pagination par défaut dans votre contrôleur, vous avez juste
à nommer les clefs du tableau après le modèle que vous souhaitez configurer::

    class PostsController extends AppController {

        public $paginate = array(
            'Post' => array (...),
            'Author' => array (...)
        );
    }

Les valeurs des clefs  ``Post`` et ``Author`` pourraient contenir toutes
les propriétés qu'un model/clef sans ``$paginate`` pourraient contenir.

Une fois que la variable ``$paginate`` à été définie, nous pouvons
appeler la méthode ``paginate()`` dans l'action du contrôleur.
Cette méthode chargera dynamiquement :php:class:`PaginatorComponent`,
et appellera sa méthode paginate(). Ceci retournera le résultat du ``find()``
depuis le modèle. Ceci envoi également quelques statistiques de pagination,
qui sont additionnées à l'objet de la requête. L'information additionnelle 
est envoyée à ``$this->request->params['paging']``, et est utilisée par
:php:class:`PaginatorHelper` pour la création de liens. 
``Controller::paginate()`` ajoute également  PaginatorHelper à la liste
des helpers de votre contrôleur, si il n'a pas encore été additionné::

    public function list_recipes() {
        // similaire à un  findAll(), mais récupère les résultats paginés
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }

Vous pouvez filtrer les enregistrements en passant des conditions
comme second paramètres à la fonction ``paginate()``.::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));

Ou vous pouvez aussi définir des  ``conditions`` et d'autre clefs dans
le tableau ``$paginate`` à l'intérieur de votre action.::

    public function list_recipes() {
        $this->paginate = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->paginate('Recipe');
        $this->set(compact('data'));
    );

Personnalisation des requêtes de pagination
===========================================

Si vous n'êtes pas prêt à utiliser les options standards du find pour créé 
la requête d'affichage de vos données, il y a quelques options. 
Vous pouvez utiliser  :ref:`custom find type <model-custom-find>`.
Vous pouvez aussi implémenter les méthodes ``paginate()`` et ``paginateCount()``
sur votre modèle, ou les inclure dans un comportement attaché à votre modèle.
Les comportement qui implémentent ``paginate`` et/ou``paginateCount`` devraient 
implémenter les signatures de méthode définies ci-dessous avec le premier
paramêtre normal additionnel de ``$model``::

    // paginate et paginateCount implémentée dans le comportement.
    public function paginate(Model $model, $conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        // contenu de la méthode
    }

    public function paginateCount(Model $model, $conditions = null, $recursive = 0, $extra = array()) {
        // corp (body) de la méthode
    }

C'est rare d'avoir besoin d'implémenter paginate() et paginateCount(). vous 
devriez vous assurer que vous ne pouvez pas atteindre votre but avec les 
méthodes du noyau du modèle, ou avec un finder personnalisé.

La méthode ``paginate()`` devrait implémenter les signatures de méthode 
suivantes. Pour utiliser vos propre méthode/logique redéfinissez lès (override) 
dans le modèle dans lequel vous voulez prendre des données::

    /**
     * Redéfition (overriden) de la méthode paginate - groupée par semaine, away_team_id and home_team_id
     */
    public function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

Vous aurez aussi besoin de redéfinir (override) le noyau ``paginateCount()``,
Cette méthode s'attend aux mêmes arguments que ``Model::find('count')``.
L'exemple ci-dessous utilise quelques fonctionnalités Postgres spécifiques,
Veuillez ajuster en conséquence en fonction de la base de données que vous 
utilisez::

    /**
     * Redefinition (Overridden) de la méthode paginateCount
     */
    public function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

Le lecteur attentif aura noté que la méthode paginate que nous avons
définis n'était pas réellement nécessaire - Tout ce que vous avez à
faire est d'ajouter le mot clef dans les variables de la classes
``$paginate`` des contrôleurs::

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
        $this->paginate = array(
            'MyModel' => array(
                'limit' => 20,
                'order' => array('week' => 'desc'),
                'group' => array('week', 'home_team_id', 'away_team_id')
            )
        );

Dans CakePHP 2.0, vous n'avez plus besoin d'implémenter ``paginateCount()``
quand vous utilisez des groupes de clauses. Le noyau ``find('count')`` comptera 
correctement le nombre total de lignes.

Contrôle du champ à utiliser pour ordonner
==========================================

Par défaut le classement peut être effectué par n'importe quelle colonne dans
un modèle. C'est parfois indésirable comme permettre aux utilisateurs de trier
des colonnes non indexées, ou les champs virtuels peuvent être coûteux en temps
de calculs. Vous pouvez utiliser le 3ème paramètres de
``Controller::paginate()`` pour restreindre les tries de colonnes qui pourront 
être effectués::

    $this->paginate('Post', array(), array('title', 'slug'));

Ceci permettrait le tri uniquement sur les colonnes title et slug.
Un utilisateur qui paramètre le tris à d'autres valeurs sera ignoré.

Limitation du nombre maximum de lignes qui peuvent être recherchées
===================================================================

Le nombre de résultats qui sont retournés à l'utilisateur est représenté
par le paramètre ``limit``. Il est généralement indésirable de permettre
à l'utilisateur de retourner toutes les lignes dans un ensemble paginé.
Par défaut CAKEPHP limite le nombre de lignes retournées à 100. Si cette
valeur par défaut n'est pas appropriée pour votre application, vous pouvez
l'ajuster dans une partie des options de pagination::


    public $paginate = array(
        // d'autre clefs ici.
        'maxLimit' => 10
    );

Si les paramètres de limitation de la requête est supérieur à cette valeur,
il sera réduit à la valeur de ``maxLimit``.

.. _pagination-with-get:

Pagination avec des paramètres GET
==================================

Dans les versions précédentes de CAKEPHP vous ne pouviez générer des liens 
de pagination qu'en utilisant des paramètres nommés. Mais si les pages étaient
recherchées avec des paramètres GET elle continueraient à travailler.
Pour la version 2.0, nous avons décidés de rendre plus contrôler et cohérent
comment vous générez les paramètres de pagination. Vous pouvez choisir 
d'utiliser une chaîne de requête ou bien des paramètre nommés dans le composant.
Les requêtes entrantes devront accepter le type choisi, et la
:php:class:`PaginatorHelper` générera les liens  avec les paramètres choisis:: 

    public $paginate = array(
        'paramType' => 'querystring'
    );

Ci-dessus permettrait un paramètre de recherche par chaîne de caractères, de le 
parser et de le générer. Vous pouvez aussi modifier  les propriétés de
``$settings`` du Composant Paginator (PaginatorComponent)::

    $this->Paginator->settings['paramType'] = 'querystring';

Par défaut tous les paramètre de pagination typiques seront convertis en 
arguments GET

.. note::

    Vous pouvez rentrez dans une situation ou assigner une valeur dans une 
    propriété inexistante retournera des erreurs::
    
        $this->paginate['limit'] = 10;

Retournera l'erreur “Notice: Indirect modification of overloaded property 
$paginate has no effect”. En assignant une valeur initiale à la propriété 
cela résout le problème::

        $this->paginate = array();
        $this->paginate['limit'] = 10;
        //ou
        $this->paginate = array('limit' => 10);

Ou juste en déclarant la propriété dans la classe du contrôleur ::
    

        class PostsController {
            public $paginate = array();
        }

Ou en utilisant ``$this->Paginator->setting = array('limit' => 10);``
    
Soyez sur d'avoir ajouté le composant Paginator a votre tableau $components
si vous voulez modifier les propriétés ``$settings`` du Composant Paginator. 

L'une ou l'autre de ces approches résoudra les erreurs rencontrés.

Pagination AJAX 
===============

C'est très simple d'incorporer les fonctionnalités Ajax dans la pagination.
en utilisant :php:class:`JsHelper` et :php:class:`RequestHandlerComponent`
vous pouvez facilement ajouter des paginations Ajax à votre application.
Voir :ref:`ajax-pagination` pour plus d'information.

Pagination dans la vue
======================

Regardez la documentation  :php:class:`PaginatorHelper` pour voir comment 
créer des liens pour la navigation dans la pagination.


.. meta::
    :title lang=fr: Pagination
    :keywords lang=fr: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
