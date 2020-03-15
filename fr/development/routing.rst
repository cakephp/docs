Routing
#######

.. php:namespace:: Cake\Routing

.. php:class:: Router

Le Routing est une fonctionnalité qui fait correspondre les URLs aux actions du
controller. En définissant des routes, vous pouvez séparer la façon dont votre
application est intégrée de la façon dont ses URLs sont structurées.

Le Routing dans CakePHP englobe aussi l'idée de routing inversé, où un tableau
de paramètres peut être transformé en une URL. En utilisant le routing inversé,
vous pouvez reconstruire la structure d'URL de votre application sans mettre à
jour tous vos codes.

.. index:: routes.php

Tour Rapide
===========

Cette section va vous apprendre les utilisations les plus habituelles du Router
de CakePHP. Typiquement si vous voulez afficher quelque chose en page d'accueil,
vous ajoutez ceci au fichier **routes.php**::

    use Cake\Routing\Router;

    // EN utilisant le route builder scopé.
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // En utilisant la méthode statique.
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

``Router`` fournit deux interfaces pour connecter les routes. La méthode
statique est une interface retro-compatible, alors que le builder scopé (lié la
portée) offre une syntaxe plus laconique pour construire des routes multiples,
et de meilleures performances.

Ceci va exécuter la méthode ``index`` dans ``ArticlesController`` quand la page
d'accueil de votre site est visitée. Parfois vous avez besoin de routes
dynamiques qui vont accepter plusieurs paramètres, ce sera par exemple le cas
d'une route pour voir le contenu d'un article::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

La route ci-dessus accepte toute URL qui ressemble à ``/articles/15`` et appelle
la méthode ``view(15)`` dans ``ArticlesController``. En revanche, ceci ne va pas
empêcher les visiteurs d'accéder à une URLs ressemblant à
``/articles/foobar``. Si vous le souhaitez, vous pouvez restreindre certains
paramètres grâce à une expression régulière::

    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // Avant 3.5, utilisez les tableaux d'options
    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    )

Dans l'exemple précédent, le caractère jocker ``*`` est remplacé par un
placeholder ``:id``. Utiliser les placeholders nous permet de valider les
parties de l'URL, dans ce cas, nous utilisons l'expression régulière ``\d+``
pour que seuls les chiffres fonctionnent. Finalement, nous disons au Router de
traiter le placeholder ``id`` comme un argument de fonction pour la fonction
``view()`` en spécifiant l'option ``pass``. Vous pourrez en voir plus sur leur
utilisation plus tard.

Le Router de CakePHP peut aussi faire correspondre les routes en reverse. Cela
signifie qu'à partir d'un tableau contenant des paramètres similaires, il est
capable de générer une chaîne URL::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Va afficher
    /articles/15

Les routes peuvent aussi être labellisées avec un nom unique, cela vous permet
de rapidement leur faire référence lors de la construction des liens plutôt
que de spécifier chacun des paramètres de routing::

    // Dans le fichier routes.php
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'login']);
    // Va afficher
    /login

Pour aider à garder votre code de router "DRY", le router apporte le concept
de 'scopes'. Un scope (étendue) défini un segment de chemin commun, et
optionnellement des routes par défaut. Toute route connectée à l'intérieur d'un
scope héritera du chemin et des routes par défaut du scope qui la contient::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

Le route ci-dessus matchera ``/blog/`` et renverra
``Blog\Controller\ArticlesController::index()``.

Le squelette d'application contient quelques routes pour vous aider à commencer.
Une fois que vous avez ajouté vos propres routes, vous pouvez retirer les routes
par défaut si vous n'en avez pas besoin.

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

Connecter les Routes
====================

.. php:method:: connect($route, $defaults = [], $options = [])

Pour garder votre code :term:`DRY`, vous pouvez utiliser les 'routing scopes'.
Les scopes de Routing permettent non seulement de garder votre code DRY mais
aident aussi le Router à optimiser son opération. Comme vous l'avez vu
précédemment. Cette méthode va par défaut vers le scope ``/``. Pour créer un
scope et connecter certaines routes, nous allons utiliser la méthode
``scope()``::

    // Dans config/routes.php
    use Cake\Routing\Route\DashedRoute;

    Router::scope('/', function ($routes) {
        // Connecte la route de 'fallback' générique
        $routes->fallbacks(DashedRoute::class);
    });

La méthode ``connect()`` prend trois paramètres: l'URL que vous souhaitez faire
correspondre, les valeurs par défaut pour les éléments de votre route, et les
règles d'expression régulière pour aider le router à faire correspondre les
éléments dans l'URL.

Le format basique pour une définition de route est::

    $routes->connect(
        '/url/template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

Le premier paramètre est utilisé pour dire au router quelle sorte d'URL vous
essayez de contrôler. L'URL est une chaîne normale délimitée par des slashes,
mais peut aussi contenir une wildcard (\*) ou :ref:`route-elements`. Utiliser
une wildcard dit au router que vous êtes prêt à accepter tout argument
supplémentaire fourni. Les Routes sans un \* ne matchent que le pattern template
exact fourni.

Une fois que vous spécifiez une URL, vous utilisez les deux derniers paramètres
de ``connect()`` pour dire à CakePHP quoi faire avec une requête une fois
qu'elle a été matchée. Le deuxième paramètre est un tableau associatif. Les clés
du tableau devraient être appelées après les éléments de route dans l'URL, ou
les éléments par défaut: ``:controller``, ``:action``, et ``:plugin``. Les
valeurs dans le tableau sont les valeurs par défaut pour ces clés. Regardons
quelques exemples simples avant que nous commencions à voir l'utilisation du
troisième paramètre de ``connect()``::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

Cette route est trouvée dans le fichier routes.php distribué avec CakePHP. Cette
route matche toute URL commençant par ``/pages/`` et il tend vers l'action
``display()`` de ``PagesController`` La requête ``/pages/products`` serait mappé
vers ``PagesController->display('products')``.

En plus de l'étoile greedy ``/*`` il y aussi la syntaxe de l'étoile trailing
``/**``. Utiliser une étoile double trailing, va capturer le reste de l'URL en
tant qu'argument unique passé. Ceci est utile quand vous voulez utilisez un
argument qui incluait un ``/`` dedans::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

L'URL entrante de ``/pages/the-example-/-and-proof`` résulterait en un argument
unique passé de ``the-example-/-and-proof``.

Vous pouvez utiliser le deuxième paramètre de ``connect()`` pour fournir tout
paramètre de routing qui est composé des valeurs par défaut de la route::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

Cet exemple montre comment vous pouvez utiliser le deuxième paramètre de
``connect()`` pour définir les paramètres par défaut. Si vous construisez un
site qui propose des produits pour différentes catégories de clients, vous
pourriez considérer la création d'une route. Cela vous permet de vous lier à
``/government`` plutôt qu'à ``/pages/display/5``.

Une utilisation classique du routing peut impliquer la création de segments
d'URL qui ne correspondent pas aux noms de vos controllers ou de vos models.
Imaginons qu'au lieu de vouloir accéder à une URL ``/users/some_action/5``,
vous souhaitiez y accéder via ``/cooks/une_action/5``. Pour ce faire,
vous devriez configurer la route suivante::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

Cela dit au Router que toute URL commençant par ``/cooks/`` devrait être envoyée
au ``UsersController``. L'action appelée dépendra de la valeur du paramètre
``:action``. En utilisant :ref:`route-elements`, vous pouvez créer des routes
variables, qui acceptent les entrées utilisateur ou les variables. La route
ci-dessus utilise aussi l'étoile greedy. L'étoile greedy indique au
:php:class:`Router` que cette route devrait accepter tout argument de position
supplémentaire donné. Ces arguments seront rendus disponibles dans le tableau
:ref:`passed-arguments`.

Quand on génère les URLs, les routes sont aussi utilisées. Utiliser
``['controller' => 'Users', 'action' => 'some_action', 5]`` en URL va sortir
``/cooks/some_action/5`` si la route ci-dessus est la première correspondante
trouvée.

Les routes connectées jusque là fonctionneront avec n'importe quel verbe HTTP.
Si vous souhaitez construire une API REST, vous aurez probablement besoin de faire
correspondre des actions HTTP à des méthodes de controller différentes.
Le ``RouteBuilder`` met à disposition des méthodes qui rendent plus facile la
définition de routes pour des verbes HTTP spécifiques::

    // Crée une route qui ne répondra qu'aux requêtes GET.
    $routes->get(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // Crée une route qui ne répondra qu'aux requêtes PUT
    $routes->put(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

Les méthodes ci-dessus *mappent* la même URL à des actions différentes en fonction
du verbe HTTP utilisé. Les requêtes GET pointeront sur l'action 'view' tandis que les
requêtes PUT pointeront sur l'action 'update'. Ces méthodes sont disponibles pour les
verbes:

* GET
* POST
* PUT
* PATCH
* DELETE
* OPTIONS
* HEAD

Toutes ces méthodes retournent une instance de Route ce qui vous permet d'utiliser les
:ref:`setters fluides <route-fluent-methods>` pour configurer plus précisément vos
routes.

.. versionadded:: 3.5.0
    Les méthodes pour les verbes HTTP ont été ajoutées dans 3.5.0

.. _route-elements:

Les Eléments de Route
---------------------

Vous pouvez spécifier vos propres éléments de route et ce faisant
cela vous donne le pouvoir de définir des places dans l'URL où les
paramètres pour les actions du controller doivent se trouver. Quand
une requête est faite, les valeurs pour ces éléments de route se
trouvent dans ``$this->request->getParam()`` dans le controller. Quand vous
définissez un élément de route personnalisé, vous pouvez spécifier en option
une expression régulière - ceci dit à CakePHP comment savoir si l'URL est
correctement formée ou non. Si vous choisissez de ne pas fournir une expression
régulière, toute expression non ``/`` sera traitée comme une partie du
paramètre::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    // Avant 3.5, utilisez les options de tableau
    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

Cet exemple simple montre comment créer une manière rapide de voir les models
à partir de tout controller en élaborant une URL qui ressemble à
``/controllername/:id``. L'URL fournie à connect() spécifie deux éléments de
route: ``:controller`` et ``:id``. L'élément ``:controller`` est l'élément de
route par défaut de CakePHP, donc le router sait comment matcher et identifier
les noms de controller dans les URLs. L'élément ``:id`` est un élément de route
personnalisé, et doit être clarifié plus loin en spécifiant une expression
régulière correspondante dans le troisième paramètre de ``connect()``.

CakePHP ne produit pas automatiquement d'urls en minuscule avec des tirets quand
vous utilisez le paramètre ``:controller``. Si vous avez besoin de ceci,
l'exemple ci-dessus peut être réécrit en::

    use Cake\Routing\Route\DashedRoute;

    // Crée un builder avec une classe de Route différente.
    $routes->scope('/', function ($routes) {

        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/:controller/:id', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        // Avant 3.5, utilisez le tableau d'options
        $routes->connect(
            '/:controller/:id',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

La classe spéciale ``DashedRoute`` va s'assurer que les paramètres
``:controller`` et ``:plugin`` sont correctement mis en minuscule et avec des
tirets. Si vous avez besoin d'URLs en minuscule avec des underscores en migrant
d'une application CakePHP 2.x, vous pouvez utiliser à la place la classe
``InflectedRoute``.

.. note::

    Les Patrons utilisés pour les éléments de route ne doivent pas contenir
    de groupes capturés. S'ils le font, le Router ne va pas fonctionner
    correctement.

Une fois que cette route a été définie, la requête ``/apples/5`` est la même
que celle requêtant ``/apples/view/5``. Les deux appelleraient la méthode ``view()``
de ApplesController. A l'intérieur de la méthode ``view()``, vous aurez besoin
d'accéder à l'ID passé à ``$this->request->getParam('id')``.

Si vous avez un unique controller dans votre application et que vous ne
voulez pas que le nom du controller apparaisse dans l'URL, vous pouvez mapper
toutes les URLs aux actions dans votre controller. Par exemple, pour mapper
toutes les URLs aux actions du controller ``home``, par ex avoir des URLs
comme ``/demo`` à la place de ``/home/demo``, vous pouvez faire ce qui suit::

    $routes->connect('/:action', ['controller' => 'Home']);

Si vous souhaitez fournir une URL non sensible à la casse, vous pouvez utiliser
les modificateurs en ligne d'expression régulière::

    // Avant 3.5, utilisez le tableau d'options à la place de setPatterns()
    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

Un exemple de plus, et vous serez un pro du routing::

    // Avant 3.5, utilisez le tableau d'options à la place de setPatterns()
    $routes->connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index']
    )->setPatterns([
        'year' => '[12][0-9]{3}',
        'month' => '0[1-9]|1[012]',
        'day' => '0[1-9]|[12][0-9]|3[01]'
    ]);

C'est assez complexe, mais montre comme les routes peuvent vraiment
devenir puissantes. L'URL fournie a quatre éléments de route. Le premier
nous est familier: c'est une route par défaut qui dit à CakePHP d'attendre
un nom de controller.

Ensuite, nous spécifions quelques valeurs par défaut. Quel que soit le
controller, nous voulons que l'action ``index()`` soit appelée.

Finalement, nous spécifions quelques expressions régulières qui vont
matcher les années, mois et jours sous forme numérique. Notez que les
parenthèses (le groupement) ne sont pas supportées dans les expressions
régulières. Vous pouvez toujours spécifier des alternatives, comme
dessus, mais ne pas grouper avec les parenthèses.

Une fois définie, cette route va matcher ``/articles/2007/02/01``,
``/posts/2004/11/16``, gérant les requêtes
pour les actions ``index()`` de ses controllers respectifs, avec les paramètres de
date dans ``$this->request->getParam()``.

Il y a plusieurs éléments de route qui ont une signification spéciale dans
CakePHP, et ne devraient pas être utilisés à moins que vous ne souhaitiez
spécifiquement utiliser leur signification.

* ``controller`` Utilisé pour nommer le controller pour une route.
* ``action`` Utilisé pour nommer l'action de controller pour une route.
* ``plugin`` Utilisé pour nommer le plugin dans lequel un controller est
  localisé.
* ``prefix`` Utilisé pour :ref:`prefix-routing`.
* ``_ext`` Utilisé pour :ref:`file-extensions`.
* ``_base`` Défini à ``false`` pour retirer le chemin de base de l'URL générée.
  Si votre application n'est pas dans le répertoire racine, cette option peut
  être utilisée pour générer les URLs qui sont 'liées à cake'.
* ``_scheme`` Défini pour créer les liens sur les schémas différents comme
  `webcal` ou `ftp`. Par défaut, au schéma courant.
* ``_host`` Définit l'hôte à utiliser pour le lien. Par défaut à l'hôte courant.
* ``_port`` Définit le port si vous avez besoin de créer les liens sur des ports
  non-standards.
* ``_full`` Si à ``true``, la constante `FULL_BASE_URL` va être ajoutée devant
  les URLS générées.
* ``#`` Vous permet de définir les fragments de hash d'URL.
* ``_ssl`` Défini à ``true`` pour convertir l'URL générée à https, ou ``false``
  pour forcer http.
* ``_method`` Defini la méthode HTTP à utiliser. utile si vous travaillez avec
  :ref:`resource-routes`.
* ``_name`` Nom de route. Si vous avez configuré les routes nommées, vous
  pouvez utiliser cette clé pour les spécifier.

.. _route-fluent-methods:

Configurer les Options de Route
-------------------------------

Il y a de nombreuses options de routes qui peuvent être définies pour chaque route.
Après avoir connecté une route, vous pouvez utiliser ses méthodes de construction
fluide pour la configurer. Ces méthodes remplacent la majorité des clés du paramètre
``$options`` de la méthode ``connect()``::

    $routes->connect(
        '/:lang/articles/:slug',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    // Autorise les requêtes GET & POST.
    ->setMethods(['GET', 'POST'])

    // Match seulement le sous-domaine 'blog'
    ->setHost('blog.example.com')

    // Définit l'élément de la route qui devrait être converti en argument
    ->setPass(['slug'])

    // Définit les patterns de correspondance pour les éléments de route
    ->setPatterns([
        'slug' => '[a-z0-9-_]+',
        'lang' => 'en|fr|es',
    ])

    // Autorise également l'extension JSON
    ->setExtenions(['json'])

    // Définit 'lang' pour être un paramètre persistant
    ->setPersist(['lang']);

.. versionadded:: 3.5.0
    Les méthodes fluides ont été ajoutées dans 3.5.0

Passer des Paramètres à l'Action
--------------------------------

Quand vous connectez les routes en utilisant
:ref:`route-elements` vous voudrez peut-être que des éléments routés
soient passés aux arguments à la place. L'option ``pass`` défini une liste
des éléments de route doit également être rendu disponible en tant qu'arguments
passé aux fonctions du controller::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // du code ici...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view']
        )
        // Défini les éléments de route dans le template de route
        // à passer en tant qu'arguments à la fonction. L'ordre est
        // important car cela fera simplement correspondre ":id" avec
        // articleId dans votre action.
        ->setPass(['id', 'slug'])
        // Defini un pattern que `id` doit avoir.
        ->setPatterns([
            'id' => '[0-9]+',
        ]);
    });

Maintenant, grâce aux possibilités de routing inversé, vous pouvez passer
dans le tableau d'URL comme ci-dessous et CakePHP sait comment former l'URL
comme définie dans les routes::

    // view.php
    // ceci va retourner un lien vers /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

    // Vous pouvez aussi utiliser des paramètres indexés numériquement.
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _named-routes:

Utiliser les Routes Nommées
---------------------------

Parfois vous trouvez que taper tous les paramètres de l'URL pour une route est
trop verbeux, ou bien vous souhaitez tirer avantage des améliorations de la
performance que les routes nommées permettent. Lorsque vous connectez les
routes, vous pouvez spécifier une option ``_name``, cette option peut être
utilisée pour le routing inversé pour identifier la route que vous souhaitez
utiliser::

    // Connecter une route avec un nom.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Nommage d'une route liée à un verbe spécifique (3.5.0+)
    $routes->post(
        '/logout',
        ['controller' => 'Users', 'action' => 'logout'],
        'logout'
    );

    // Génère une URL en utilisant une route nommée.
    $url = Router::url(['_name' => 'logout']);

    // Génère une URL en utilisant une route nommée,
    // avec certains args query string
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

Si votre template de route contient des éléments de route comme ``:controller``,
vous aurez besoin de fournir ceux-ci comme options de ``Router::url()``.

.. note::

    Les noms de Route doivent être uniques pour l'ensemble de votre application.
    Le même ``_name`` ne peut être utilisé deux fois, même si les noms
    apparaissent dans un scope de routing différent.

Quand vous construisez vos noms de routes, vous voudrez probablement coller
à certaines conventions pour les noms de route. CakePHP facilite la construction
des noms de route en vous permtttant de définir des préfixes de nom dans chaque
scope::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // le nom de cette route sera `api:ping`
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // Connecte les routes.
    });

    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // Connecte les routes.
    });

Vous pouvez aussi utiliser l'option ``_namePrefix`` dans les scopes imbriqués et
elle fonctionne comme vous pouvez vous y attendre::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // Le nom de cette route sera `contacts:api:ping`
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

Les routes connectées dans les scopes nommés auront seulement des noms ajoutés
si la route est aussi nommée. Les routes sans nom ne se verront pas appliquées
``_namePrefix``.

.. versionadded:: 3.1
    L'option ``_namePrefix`` a été ajoutée dans 3.1

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix de Routage
-----------------

.. php:staticmethod:: prefix($name, $callback)

De nombreuses applications nécessitent une section d'administration dans
laquelle les utilisateurs privilégiés peuvent faire des modifications.
Ceci est souvent réalisé grâce à une URL spéciale telle que
``/admin/users/edit/5``. Dans CakePHP, les préfixes de routage peuvent être
activés depuis le fichier de configuration du cœur en configurant les
préfixes avec Routing.prefixes. Les préfixes peuvent être soit activés en
utilisant la valeur de configuration ``Routing.prefixes``, soit en définissant
la clé ``prefix`` avec un appel de ``Router::connect()``::

    use Cake\Routing\Route\DashedRoute;

    Router::prefix('Admin', function ($routes) {
        // Toutes les routes ici seront préfixées avec `/admin`, et
        // l'élément de route `'prefix' => 'Admin'` sera ajouté qui
        // sera requis lors de la génération d'URL pour ces routes
        $routes->fallbacks(DashedRoute::class);
    });

Les préfixes sont mappés aux sous-espaces de noms dans l'espace de nom
``Controller`` de votre application. En ayant des préfixes en tant que
controller séparés, vous pouvez créer de plus petits et/ou de plus simples
controllers. Les comportements communs aux controllers préfixés et non-préfixés
peuvent être encapsulés via l'héritage, les :doc:`/controllers/components`, ou
les traits. En utilisant notre exemple des utilisateurs, accéder à l'url
``/admin/users/edit/5`` devrait appeler la méthode ``edit()`` de notre
``App\Controller\Admin\UsersController`` en passant 5 comme premier paramètre.
Le fichier de vue utilisé serait **templates/Admin/Users/edit.php**.

Vous pouvez faire correspondre l'URL /admin à votre action ``index()``
du controller Pages en utilisant la route suivante::

    Router::prefix('Admin', function ($routes) {
        // Parce que vous êtes dans le scope admin, vous n'avez pas besoin
        // d'inclure le prefix /admin ou l'élément de route admin.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

Quand vous créez des routes préfixées, vous pouvez définir des paramètres de
route supplémentaires en utilisant l'argument ``$options``::

    Router::prefix('Admin', ['param' => 'value'], function ($routes) {
        // Routes connectées ici sont préfixées par '/admin' et
        // ont la clé 'param' de routing définie.
        $routes->connect('/:controller');
    });

Les préfixes de plusieurs mots sont par défaut convertis en utilisant une
flexion en pointeur, c'est-à-dire que ``MyPrefix`` serait mappé sur
``my-prefix`` dans l'URL. Assurez-vous de définir un chemin d'accès pour ces
préfixes si vous souhaitez utiliser un format différent comme par exemple le
soulignement::

    Router::prefix('MyPrefix', ['path' => '/my_prefix'], function (RouteBuilder $routes) {
        // Les routes connectées ici sont préfixées par '/my_prefix'
        $routes->connect('/:controller');
    });

Vous pouvez aussi définir les préfixes dans les scopes de plugin::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('Admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

Ce qui est au-dessus va créer un template de route de type
``/debug_kit/admin/:controller``. La route connectée aura les éléments de
route ``plugin`` et ``prefix`` définis.

Quand vous définissez des préfixes, vous pouvez imbriquer plusieurs préfixes
si besoin::

    Router::prefix('Manager', function ($routes) {
        $routes->prefix('Admin', function ($routes) {
            $routes->connect('/:controller/:action');
        });
    });

Ce qui est au-dessus va créer un template de route de type
``/manager/admin/:controller/:action``. La route connectée aura l'élément de
route ``prefix`` défini à ``Manager/Admin``.

Le préfixe actuel sera disponible à partir des méthodes du controller avec
``$this->request->getParam('prefix')``

Quand vous utilisez les routes préfixées, il est important de définir l'option
``prefix``, et d'utiliser le même format de boîtier de chameau que celui utilisé
dans la méthode `prefix ()`. Voici comment construire ce lien en utilisant le
helper HTML::

    // Aller vers une route préfixée.
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'Manager/Admin', 'controller' => 'Articles', 'action' => 'add']
    );

    // Enlever un prefix
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. note::

    Vous devez connecter les routes préfixées *avant* de connecter les routes
    fallback.

.. index:: plugin routing

Création de liens vers des routes de préfixe
--------------------------------------------

Vous pouvez créer des liens qui pointent vers un préfixe, en ajoutant la clé
de préfixe à votre tableau d'URL::

    echo $this->Html->link(
        'New admin todo',
        ['prefix' => 'Admin', 'controller' => 'TodoItems', 'action' => 'create']
    );

Lorsque vous utilisez l'imbrication, vous devez les chaîner ensemble::

    echo $this->Html->link(
        'New todo',
        ['prefix' => 'Admin/MyPrefix', 'controller' => 'TodoItems', 'action' => 'create']
    );

Cela serait lié à un contrôleur avec l'espace de noms ``App\\Controller\\Admin\\MyPrefix``
et le chemin de fichier ``src/Controller/Admin/MyPrefix/TodoItemsController.php``.

.. note::

    Le préfixe est toujours encadré de chameau ici, même si le résultat du routage est en
    pointillés. La route elle-même fera l'inflexion si nécessaire.

Routing des Plugins
-------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Les routes des :doc:`/plugins` sont plus faciles à créer en utilisant la méthode
``plugin()``. Cette méthode crée un nouveau scope pour les routes de plugin::

    Router::plugin('DebugKit', function ($routes) {
        // Les routes connectées ici sont préfixées par '/debug_kit' et ont
        // l'élément de route plugin défini à 'DebugKit'.
        $routes->connect('/:controller');
    });

Lors de la création des scopes de plugin, vous pouvez personnaliser le chemin de
l'élément avec l'option ``path``::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // Les routes connectées ici sont préfixées par '/debugger' et ont
        // l'élément de route plugin défini à 'DebugKit'.
        $routes->connect('/:controller');
    });

Lors de l'utilisation des scopes, vous pouvez imbriquer un scope de plugin dans
un scope de prefix::

    Router::prefix('Admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

Le code ci-dessus devrait créer une route similaire à
``/admin/debug_kit/:controller``. Elle devrait avoir les éléments de route
``prefix`` et ``plugin`` définis. Référez-vous à la section :ref:`plugin-routes`
pour avoir plus d'informations sur comment construire des routes de plugin.

Créer des Liens vers des Routes de Plugins
------------------------------------------

Vous pouvez créer des liens qui pointent vers un plugin, en ajoutant la clé
``plugin`` au tableau de l'URL::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

Inversement, si la requête active est une requête de plugin et que vous
souhaitez créer un lien qui n'a pas de plugin, vous pouvez faire ceci::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

En définissant ``'plugin' => null``, vous dites au Router que vous souhaitez
créer un lien qui n'appartient pas à un plugin.

Routing Favorisant le SEO
-------------------------

Certains développeurs préfèrent utiliser des tirets dans les URLs, car cela
semble donner un meilleur classement dans les moteurs de recherche.
La classe ``DashedRoute`` fournit à votre application la possibilité de créer
des URLs avec des tirets pour vos plugins, controllers, et les noms d'action en
``camelCase``.

Par exemple, si nous avons un plugin ``ToDo`` avec un controller ``TodoItems``
et une action ``showItems()``, la route générée sera
``/to-do/todo-items/show-items`` avec le code qui suit::

    use Cake\Routing\Route\DashedRoute;

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Matching des Méthodes HTTP Spécifiques
--------------------------------------

Les routes peuvent "matcher" des méthodes HTTP spécifiques en utilisant
les méthodes spécifiques::

    Router::scope('/', function($routes) {
        // Cette route matchera seulement les requêtes POST.
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // Matcher plusieurs verbes
        // Avant 3.5, utilisez $options['_method'] pour définir les méthodes
        $routes->connect(
            '/reviews/start',
            [
                'controller' => 'Reviews',
                'action' => 'start',
            ]
        )->setMethods(['POST', 'PUT']);
    });

Vous pouvez "matcher" plusieurs méthodes HTTP en fournissant un tableau.
Puisque que l'option ``_method`` est une clé de routage, elle est utilisée à la
fois dans le parsing des URL et la génération des URL. Pour générer des URL pour
des routes spécifiques, vous devez utiliser la clé ``_method`` lors de la génération::

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

Matching de Noms de Domaine Spécifiques
---------------------------------------

Les routes peuvent utiliser l'option ``_host`` pour "matcher" des noms de
domaines spécifiques. Vous pouvez utiliser la wildcard ``*.`` pour "matcher"
n'importe quelle sous-domaine::

    Router::scope('/', function($routes) {
        // Cette route ne va "matcher" que sur le domaine http://images.example.com
        // Avant 3.5, utilisez l'option _host
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // Cette route matchera sur tous les sous-domaines http://*.example.com
        $routes->connect(
            '/images/old-log.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('images.example.com');
    });

L'option ``_host`` n'affecte que le parsing des URL depuis les requêtes et
n'intervient jamais dans la génération d'URL.

.. versionadded:: 3.4.0
    L'option ``_host`` a été ajoutée dans la version 3.4.0

.. index:: file extensions
.. _file-extensions:

Routing des Extensions de Fichier
---------------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

Pour manipuler différentes extensions de fichier avec vos routes, vous pouvez
définir vos extensions de manière globale ou dans un *scope*. Définir des
extensions globales peut se faire via la méthode static :php:meth:`Router::extensions()`

    Router::extensions(['json', 'xml']);
    // ...

Ceci affectera **toutes** les routes qui seront connectées **après** cet appel,
quelque soit leur *scope*.

Pour restreindre les extensions à un *scope* spécifique, vous pouvez les définir
en utilisant la méthode :php:meth:`Cake\\Routing\\RouteBuilder::extensions()`::

    Router::scope('/', function ($routes) {
        // Avant 3.5.0 utilisez `extensions()`
        $routes->setExtensions(['json', 'xml']);
        // ...
    });

Cela activera les extensions pour toutes les routes qui seront définies dans ce
scope **après** l'appel à ``extensions()``, tout en incluant les routes inclus
dans les scopes imbriqués. De la même manière que la méthode :php:meth:`Router::extensions()`,
toutes les routes connectées avant cet appel n'hériteront pas de ces extensions.

.. note::

    Le réglage des extensions devrait être la première chose que vous devriez
    faire dans un scope, car les extensions seront appliquées uniquement aux
    routes qui sont définies **après** la déclaration des extensions.

    Lorsque vous définissez des routes dans le même scope mais dans deux appels
    différents, les extensions ne seront pas héritées d'un appel à l'autre.

En utilisant des extensions, vous dites au router de supprimer toutes les
extensions de fichiers correspondant, puis d'analyser le reste. Si vous
souhaitez créer une URL comme ``/page/title-of-page.html`` vous devriez créer
un scope comme ceci::

    Router::scope('/page', function ($routes) {
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

Ensuite, pour créer des liens, utilisez simplement::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

Les extensions de fichier sont utilisées par le
:doc:`/controllers/components/request-handling` qui fait la commutation des
vues automatiquement en se basant sur les types de contenu.

.. _connecting-scoped-middleware:

Connecter des Middlewares à un scope
------------------------------------

Bien que les middlewares puissent être appliqués à toute votre application, appliquer
les middlewares à des 'scopes' de routing offre plus de flexibilité puisque vous
pouvez appliquer des middlewares seulement où ils sont nécessaires permettant à vos
middlewares de ne pas nécessiter de logique spécifique sur le comment / où il doit
s'appliquer.

Avant qu'un middleware ne puisse être appliqué à un scope, il a besoin d'être
enregistré dans la collection de routes::

    // in config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    Router::scope('/', function ($routes) {
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
        $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());
    });

Une fois enregistré dans le builder de routes, le middleware peut être appliqué
à des scopes spécifiques::

    $routes->scope('/cms', function ($routes) {
        // Active les middlewares enregistrés pour ce scope.
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/:action/*', ['controller' => 'Articles'])
    });

Dans le cas où vous auriez des 'scopes' imbriqués, les "sous" scopes hériteront
des middlewares apppliqués dans le scope contenant::

    $routes->scope('/api', function ($routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function ($routes) {
            $routes->applyMiddleware('v1compat');
            // Définissez vos routes
        });
    });

Dans l'exemple ci-dessus, les routes définies dans ``/v1`` auront les middlewares
'ratelimit', 'auth.api', and 'v1compat' appliqués. Si vous ré-ouvrez un scope, les
middlewares appliqués aux routes dans chaque scopes seront isolés::

    $routes->scope('/blog', function ($routes) {
        $routes->applyMiddleware('auth');
        // Connecter les actions qui nécessitent l'authentification aux 'blog' ici
    });
    $routes->scope('/blog', function ($routes) {
        // Connecter les actions publiques pour le 'blog' ici
    });

Dans l'exemple ci-dessus, les 2 utilisations du scope ``/blog`` ne partagent
pas les middlewares. Par contre, les 2 scopes hériteront des middlewares définis
dans le scope qui les contient.

Grouper les Middlewares
-----------------------

Pour vous aider à garder votre code :abbr:`DRY (Do not Repeat Yourself)`, les
middlewares peuvent être combinés en groupes. Une fois créés, les groupes peuvent
être appliqués comme des middlewares::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // Application du groupe
    $routes->applyMiddleware('web');

.. versionadded:: 3.5.0
    Le support des middlewares par scope et des groupes de middlewares
    a été ajouté dans 3.5.0

.. _resource-routes:

Créer des Routes RESTful
========================

Le router rend facile la génération des routes RESTful pour vos controllers.
Les routes RESTful sont utiles lorsque vous créez des points de terminaison
d'API pour vos applications. Si nous voulions permettre l'accès à une base
de données REST, nous ferions quelque chose comme ceci::

    //Dans config/routes.php

    Router::scope('/', function ($routes) {
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

La première ligne définit un certain nombre de routes par défaut pour l'accès
REST où la méthode spécifie le format du résultat souhaité (par exemple, xml,
json, rss). Ces routes sont sensibles aux méthodes de requêtes HTTP.

=========== ===================== ==============================
HTTP format URL.format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PATCH       /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

La classe Router de CakePHP utilise un nombre différent d'indicateurs pour
détecter la méthode HTTP utilisée. Voici la liste dans l'ordre de préférence:

#. La variable POST \_method
#. Le X\_HTTP\_METHOD\_OVERRIDE
#. Le header REQUEST\_METHOD

La variable POST \_method est utile dans l'utilisation d'un navigateur comme un
client REST (ou tout ce qui peut faire du POST). Il suffit de configurer la
valeur de \_method avec le nom de la méthode de requête HTTP que vous souhaitez
émuler.

Créer des Routes de Ressources Imbriquées
-----------------------------------------

Une fois que vous avez connecté une ressource dans un scope, vous pouvez aussi
connecter des routes pour des sous-ressources. Les routes de sous-ressources
seront préfixées par le nom de la ressource originale et par son paramètre id.
Par exemple::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

Le code ci-dessus va générer une ressource de routes pour ``articles`` et
``comments``. Les routes des ``comments`` vont ressembler à ceci::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

Vous pouvez récupérer le champs ``article_id`` de ``CommentsController`` de cette façon::

    $this->request->getParam('article_id');

By default resource routes map to the same prefix as the containing scope. If
you have both nested and non-nested resource controllers you can use a different
controller in each context by using prefixes::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments', ['prefix' => 'Articles']);
        });
    });

L'exemple ci-dessus mapperait le champs 'Comments' vers
``App\Controller\Articles\CommentsController``. Une séparation des controllers
vous permet de simplifier la logique. Les préfixes créés de cette manière sont
compatibles avec :ref:`prefix-routing`.

.. note::

    Vous pouvez imbriquer autant de ressources que vous le souhaitez, mais il
    n'est pas recommandé d'imbriquer plus de 2 ressources ensembles.

.. versionadded:: 3.3
    L'option ``prefix`` a été ajoutée à ``resources()`` dans la version 3.3.

Limiter la Création des Routes
------------------------------

Par défaut, CakePHP va connecter 6 routes pour chaque ressource. Si vous
souhaitez connecter uniquement des routes spécifiques à une ressource, vous
pouvez utiliser l'option ``only``::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Le code ci-dessus devrait créer uniquement les routes de ressource ``lecture``.
Les noms de route sont ``create``, ``update``, ``view``, ``index`` et
``delete``.

Changer les Actions du Controller
---------------------------------

Vous devrez peut-être modifier le nom des actions du controller qui sont
utilisés lors de la connexion des routes. Par exemple, si votre action
``edit()`` est nommée ``put()``, vous pouvez utiliser la clé ``actions`` pour
renommer vos actions::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

Le code ci-dessus va utiliser la méthode ``put()`` pour l'action ``edit()``, et
``add()`` au lieu de ``create()``.

Mapper des Routes de Ressource Supplémentaires
----------------------------------------------

Vous pouvez mapper des méthodes de ressource supplémentaires en utilisant
l'option ``map``::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // Ceci connecterait /articles/deleteAll

En plus des routes par défaut, ceci connecterait aussi une route pour
`/articles/delete_all`. Par défaut le segment de chemin va matcher le nom
de la clé. Vous pouvez utiliser la clé 'path' à l'intérieur de la définition
de la ressource pour personnaliser le nom de chemin::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // Ceci connecterait /articles/update_many

Si vous définissez 'only' et 'map', assurez-vous que vos méthodes mappées sont
aussi dans la liste 'only'.

.. _custom-rest-routing:

Classes de Route Personnalisée pour les Ressources
--------------------------------------------------

Vous pouvez spécifier la clé ``connectOptions`` dans le tableau ``$options`` de
la fonction ``resources()`` pour fournir une configuration personnalisée
utilisée par ``connect()``::

    Router::scope('/', function ($routes) {
        $routes->resources('books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

Inflection de l'URL pour les Routes Ressource
---------------------------------------------

Par défaut le fragment d'URL pour les controllers à plusieurs mots est la forme
en underscore du nom du controller. Par exemple, le fragment d'URL pour
``BlogPosts`` serait **/blog_posts**.

Vous pouvez spécifier un type d'inflection alternatif en utilisant l'option
``inflect``::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // Utilisera ``Inflector::dasherize()``
        ]);
    })

Ce qui est au-dessus va générer des URLs de style **/blog-posts***.

.. note::

    Depuis CakePHP 3.1, le squelette de l'app officiel utilise ``DashedRoute``
    comme classe de route par défaut. Donc il est recommandé d'utiliser l'option
    ``'inflect' => 'dasherize'`` pour connecter les routes resssource afin de
    garder la cohérence de l'URL.

Changer le chemin d'un élément
------------------------------

Par défaut, les ressources de routes utilisent le nom de ressource ayant subi
une inflexion en guise de segment d'URL. Vous pouvez définir un segment d'URL
personnalisé à l'aide de l'option ``path``::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

.. versionadded:: 3.5.0
    L'option ``path`` a été ajoutée dans 3.5.0.

.. index:: passed arguments
.. _passed-arguments:

Arguments Passés
================

Les arguments passés sont des arguments supplémentaires ou des segments
du chemin qui sont utilisés lors d'une requête. Ils sont souvent utilisés
pour transmettre des paramètres aux méthodes de vos controllers::

    http://localhost/calendars/view/recent/mark

Dans l'exemple ci-dessus, ``recent`` et ``mark`` sont tous deux des arguments
passés à ``CalendarsController::view()``. Les arguments passés sont transmis aux
contrôleurs de trois manières. D'abord comme arguments de la méthode de
l'action appelée, deuxièmement en étant accessibles dans
``$this->request->getParam('pass')`` sous la forme d'un tableau indexé
numériquement. Enfin, il y a ``$this->passedArgs`` disponible de la même
façon que par ``$this->request->getParam('pass')``. Lorsque vous utilisez des
routes personnalisées il est possible de forcer des paramètres particuliers
comme étant des paramètres passés également.

Si vous alliez visiter l'URL mentionné précédemment, et que vous aviez une
action de controller qui ressemblait à cela::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

Vous auriez le résultat suivant::

    Array
    (
        [0] => recent
        [1] => mark
    )

La même donnée est aussi disponible dans ``$this->request->getParam('pass')`` dans
vos controllers, vues, et helpers. Les valeurs dans le tableau pass sont
indicées numériquement basé sur l'ordre dans lequel elles apparaissent dans
l'URL appelé::

    debug($this->request->getParam('pass'));

Le résultat des 2 debug() du dessus serait::

    Array
    (
        [0] => recent
        [1] => mark
    )

Quand vous générez des URLs, en utilisant un :term:`tableau de routing`, vous
ajoutez des arguments passés en valeurs sans clés de type chaîne dans le
tableau::

    ['controller' => 'Articles', 'action' => 'view', 5]

Comme ``5`` a une clé numérique, il est traité comme un argument passé.

Générer des URLs
================

.. php:staticmethod:: url($url = null, $full = false)

Le routing inversé est une fonctionnalité dans CakePHP qui est utilisée pour
vous permettre de changer votre structure d'URL sans avoir à modifier tout votre
code. En utilisant des :term:`tableaux de routing <tableau de routing>` pour
définir vos URLs, vous pouvez configurer les routes plus tard et les URLs
générés vont automatiquement être mises à jour.

Si vous créez des URLs en utilisant des chaînes de caractères comme::

    $this->Html->link('View', '/articles/view/' . $id);

Et ensuite plus tard, vous décidez que ``/articles`` devrait vraiment être
appelé 'posts' à la place, vous devrez aller dans toute votre application
en renommant les URLs. Cependant, si vous définissiez votre lien comme::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

Ensuite quand vous décidez de changer vos URLs, vous pouvez le faire en
définissant une route. Cela changerait à la fois le mapping d'URL entrant,
ainsi que les URLs générés.

Quand vous utilisez les URLs en tableau, vous pouvez définir les paramètres
chaîne de la requête et les fragments de document en utilisant les clés
spéciales::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Cela générera une URL comme:
    /articles/index?page=1#top

Le Router convertira également tout paramètre inconnu du tableau de routing
en paramètre d'URL. Le ``?`` est disponible pour la rétrocompatibilité avec
les anciennes versions de CakePHP.

Vous pouvez également utiliser n'importe quel élément spécial de route lorsque
vous générez des URLs:

* ``_ext`` Utilisé pour :ref:`file-extensions` .
* ``_base`` Défini à ``false`` pour retirer le chemin de base de l'URL générée.
  Si votre application n'est pas dans le répertoire racine, cette option peut
  être utilisée pour générer les URLs qui sont 'liées à cake'.
* ``_scheme`` Défini pour créer les liens sur les schémas différents comme
  `webcal` ou `ftp`. Par défaut, au schéma courant.
* ``_host`` Définit l'hôte à utiliser pour le lien. Par défaut à l'hôte courant.
* ``_port`` Définit le port si vous avez besoin de créer les liens sur des ports
  non-standards.
* ``_method`` Définit le verbe HTTP à utiliser pour cette URL.
* ``_full`` Si à ``true``, la constante `FULL_BASE_URL` va être ajoutée devant
  les URLS générées.
* ``_ssl`` Défini à ``true`` pour convertir l'URL générée à https, ou ``false``
  pour forcer http.
* ``_name`` Nom de route. Si vous avez configuré les routes nommées, vous
  pouvez utiliser cette clé pour les spécifier.

.. _redirect-routing:

Routing de Redirection
======================

Le routing de redirection permet de créer des statuts HTTP de redirection
30x pour les routes entrantes et les pointer vers des URLs différentes.
C'est utile lorsque vous souhaitez informer les applications clientes qu'une
ressource a été déplacée et que vous ne voulez pas exposer deux URLs pour
le même contenu.

Les routes de redirection sont différentes des routes normales car elles
effectuent une redirection d'en-tête si une correspondance est trouvée. La
redirection peut se produire vers une destination au sein de votre
application ou un emplacement à extérieur::

    Router::scope('/', function ($routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // Or ['persist'=>['id']] for default routing where the
            // view action expects $id as an argument.
        );
    })

Redirige ``/home/*`` vers ``/articles/view`` et passe les paramètres vers
``/articles/view``. Utiliser un tableau comme destination de redirection vous
permet d'utiliser différentes routes pour définir où la chaine URL devrait
être redirigée. Vous pouvez rediriger vers des destinations externes en
utilisant des chaines URLs pour destination::

    Router::scope('/', function ($routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

Cela redirigerait ``/articles/*`` vers ``http://google.com`` avec un statut
HTTP 302.

.. _custom-route-classes:

Classes Route Personnalisées
============================

Les classes de route personnalisées vous permettent d'étendre et modifier la
manière dont les routes individuelles parsent les requêtes et gèrent le routing
inversé. Les classes de route suivent quelques conventions:

* Les classes de Route doivent se trouver dans le namespace ``Routing\\Route``
  de votre application ou plugin.
* Les classes de Route doivent étendre :php:class:`Cake\\Routing\\Route`.
* Les classes de Route doivent implémenter au moins un des méthodes ``match()``
  et/ou ``parse()``.

La méthode ``parse()`` est utilisée pour parser une URL entrante. Elle doit
générer un tableau de paramètres de requêtes qui peuvent être résolus en
controller & action. Renvoyez ``false`` pour indiquer une erreur de
correspondance.

La méthode ``match()`` est utilisée pour faire correspondre un tableau de
paramètres d'URL et créer une chaine URL. Si les paramètres d'URL ne
correspondent pas, ``false`` doit être renvoyé.

Vous pouvez utiliser votre classe de route personnalisée lors de la création
d'une route en utilisant l'option ``routeClass``::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

    // Ou en définissant la routeClass dans votre scope.
    $routes->scope('/', function ($routes) {
        // Avant 3.5.0, utilisez `routeClass()`
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
             '/:slug',
             ['controller' => 'Articles', 'action' => 'view']
        );
    });

Cette route créera une instance de ``SlugRoute`` et vous permettra d'implémenter
une gestion des paramètres personnalisée. Vous pouvez utiliser les classes routes
des plugins en utilisant la :term:`syntaxe de plugin` standard.

Classe de Route par Défaut
--------------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

Si vous voulez utiliser une autre classe de route pour toutes vos routes
en plus de la ``Route`` par défaut, vous pouvez faire ceci en appelant
``Router::defaultRouteClass()`` avant de définir la moindre route et éviter
de spécifier l'option ``routeClass`` pour chaque route. Par exemple en
utilisant::

    use Cake\Routing\Route\InflectedRoute;

    Router::defaultRouteClass(InflectedRoute::class);

Cela provoquera l'utilisation de la classe ``InflectedRoute`` pour toutes les
routes suivantes.
Appeler la méthode sans argument va retourner la classe de route courante par
défaut.

Méthode Fallbacks
-----------------

.. php:method:: fallbacks($routeClass = null)

La méthode fallbacks (de repli) est un raccourci simple pour définir les routes
par défaut. La méthode utilise la classe de route passée pour les règles
définies ou, si aucune classe n'est passée, la classe retournée par
``Router::defaultRouteClass()`` sera utilisée.

Appelez fallbacks comme ceci::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Est équivalent à ces appels explicites::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    Utiliser la classe route par défaut (``Route``) avec fallbacks, ou toute
    route avec les éléments ``:plugin`` et/ou ``:controller`` résultera en
    URL incompatibles.

Créer des Paramètres d'URL Persistants
======================================

En utilisant les fonctions de filtre, vous pouvez vous immiscer dans le process
de génération d'URL. Les fonctions de filtres sont appelées *avant* que les
URLs ne soient vérifiées via les routes, cela vous permet donc de préparer les
URLs avant le routing.

Les fonctions de callback de filtre doivent attendre les paramètres suivants:

- ``$params`` Le paramètre d'URL à traiter.
- ``$request`` La requête actuelle.

La fonction filtre d'URL doit *toujours* retourner les paramètres même s'ils
n'ont pas été modifiés.

Les filtres d'URL vous permettent d'implémenter des fonctionnalités telles que
l'utilisation de paramètres d'URL persistants::

    Router::addUrlFilter(function ($params, $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }
        return $params;
    });

Le fonctions de filtres sont appliquées dans l'ordre dans lequel elles sont
connectées.

Un autre cas lorsque l'on souhaite changer une route en particulier à la volée
(pour les routes de plugin par exemple)::

    Router::addUrlFilter(function ($params, $request) {
        if (empty($params['plugin']) || $params['plugin'] !== 'MyPlugin' || empty($params['controller'])) {
            return $params;
        }
        if ($params['controller'] === 'Languages' && $params['action'] === 'view') {
            $params['controller'] = 'Locations';
            $params['action'] = 'index';
            $params['language'] = $params[0];
            unset($params[0]);
        }
        return $params;
    });

Gérer les Paramètres Nommés dans les URLs
=========================================

Bien que les paramètres nommés aient été retirés dans CakePHP 3.0, les
applications peuvent publier des URLs les contenant. Vous pouvez continuer à
accepter les URLs contenant les paramètres nommés.

Dans la méthode de votre ``beforeFilter()``, vous pouvez appeler
``parseNamedParams()`` pour extraire tout paramètre nommé à partir des arguments
passés::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

Ceci va remplir ``$this->request->getParam('named')`` avec tout paramètre nommé
trouvé dans les arguments passés. Tout argument passé qui a été interprété comme
un paramètre nommé, sera retiré de la liste des arguments passés.

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=fr: Routing
    :keywords lang=fr: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,routeur,router
