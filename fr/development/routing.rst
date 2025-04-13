Routing
#######

.. php:namespace:: Cake\Routing

.. php:class:: RouterBuilder

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
vous ajoutez ceci au fichier **config/routes.php**::

    /** @var \Cake\Routing\RouteBuilder $routes */
    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

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

    // En utilisant l'interface fluide
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // En passant un tableau d'options
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

Dans l'exemple précédent, le caractère jocker ``*`` est remplacé par un
placeholder ``{id}``. Utiliser les placeholders nous permet de valider les
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
        '/upgrade',
        ['controller' => 'Subscriptions', 'action' => 'create'],
        ['_name' => 'upgrade']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'upgrade']);
    // Va afficher
    /upgrade

Pour aider à garder votre code de router "DRY", le router apporte le concept
de 'scopes'. Un scope (une étendue) défini un segment de chemin commun, et
optionnellement des routes par défaut. Toute route connectée à l'intérieur d'un
scope héritera du chemin et des routes par défaut du scope qui la contient::

    $routes->scope('/blog', ['plugin' => 'Blog'], function (RouteBuilder $routes) {
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

Pour garder votre code :term:`DRY`, vous pouvez utiliser les 'routing scopes'.
Les scopes de Routing permettent non seulement de garder votre code DRY mais
aident aussi le Router à optimiser son travail. Comme vous l'avez vu
précédemment. Cette méthode va par défaut vers le scope ``/``. Pour créer un
scope et connecter certaines routes, nous allons utiliser la méthode
``scope()``::

    // Dans config/routes.php
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Route\DashedRoute;

    $routes->scope('/', function (RouteBuilder $routes) {
        // Connect the generic fallback routes.
        $routes->fallbacks(DashedRoute::class);
    });

La méthode ``connect()`` prend jusqu'à trois paramètres: l'URL que vous souhaitez
faire correspondre, les valeurs par défaut pour les éléments de votre route, et les
options de route. Ces options inlcuent fréquemment des règles d'expressions régulières
pour aider le router à faire correspondre les éléments dans l'URL.

Le format basique pour une définition de route est::

    $routes->connect(
        '/url/template',
        ['targetKey' => 'targetValue'],
        ['option' => 'matchingRegex']
    );

Le premier paramètre est utilisé pour dire au router quelle sorte d'URL vous
essayez de contrôler. L'URL est une chaîne normale délimitée par des slashes,
mais peut aussi contenir une wildcard (\*) ou :ref:`route-elements`. Utiliser
une wildcard dit au router que vous êtes prêt à accepter tout argument
supplémentaire fourni. Les Routes sans un \* ne matchent que le modèle exact
de pattern fourni.

Une fois que vous avez spécifié une URL, vous utilisez les deux derniers paramètres
de ``connect()`` pour dire à CakePHP que faire avec la requête une fois
qu'elle a été matchée. La deuxième paramètre définit la route 'cible'.
Il peut être défini soit comme un tableau, soit comme chaîne de destination.
Quelques exemples de routes cibles sont::

    // Cible sous forme de tableau vers un contrôleur de l'application
    $routes->connect(
        '/users/view/*',
        ['controller' => 'Users', 'action' => 'view']
    );
    $routes->connect('/users/view/*', 'Users::view');

    // Cible sous forme de tableau vers un contrôleur préfixé de plugin
    $routes->connect(
        '/admin/cms/articles',
        ['prefix' => 'Admin', 'plugin' => 'Cms', 'controller' => 'Articles', 'action' => 'index']
    );
    $routes->connect('/admin/cms/articles', 'Cms.Admin/Articles::index');

La première route que nous connectons correspond aux URL commençant par ``/users/view``
et fait correspondre ces requêtes à ``UsersController->view()``. Le dernier ``/*`` indique au
routeur pour passer tous les segments supplémentaires comme arguments de méthode. Par exemple,
``/users/view/123`` serait mappé à ``UsersController->view(123)``.

L'exemple ci-dessus illustre également les chaînes cibles. Les chaînes cibles fournissent
une manière compacte de définir la destination d'une route. Les chaînes cibles ont la
syntaxe suivante::

    [Plugin].[Prefix]/[Controller]::[action]

Quelques exemples de chaînes cibles sont::

    // Contrôleur d'application
    'Bookmarks::view'

    // Contrôleur d'application possédant un préfix
    Admin/Bookmarks::view

    // Contrôleur de plugin
    Cms.Articles::edit

    // Contrôleur de plugin possédant un préfix
    Vendor/Cms.Management/Admin/Articles::view

Auparavant, nous avons utilisé l'étoile greedy (``/*``) pour capturer des segments de
chemin supplémentaires, il y aussi la syntaxe de l'étoile trailing (``/**``).
Utiliser une étoile double trailing, va capturer le reste de l'URL en
tant qu'argument unique passé. Ceci est utile quand vous voulez utilisez un
argument qui incluait un ``/`` dedans::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

L'URL entrante de ``/pages/the-example-/-and-proof`` résulterait en un argument
unique passé  ``the-example-/-and-proof``.

Vous pouvez utiliser le deuxième paramètre de ``connect()`` pour fournir tout
les paramètres de routing qui formeront alors des valeurs par défaut de la route::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

Cet exemple montre comment vous pouvez utiliser le deuxième paramètre de
``connect()`` pour définir les paramètres par défaut. Si vous construisez un
site qui propose des produits pour différentes catégories de clients, vous
pourriez considérer la création d'une route. Cela vous permet de vous lier à
``/government`` plutôt qu'à ``/pages/display/5``.

Une utilisation classique du routing consiste à créer des segments d'URL
qui ne correspondent pas aux noms de vos contrôleurs ou de vos modèles.
Imaginons qu'au lieu de vouloir accéder à une URL ``/users/some_action/5``,
vous souhaitiez y accéder via ``/cooks/une_action/5``. Pour ce faire,
vous devriez configurer la route suivante::

    $routes->connect(
        '/cooks/{action}/*', ['controller' => 'Users']
    );

Cela dit au Router que toute URL commençant par ``/cooks/`` devrait être envoyée
au ``UsersController``. L'action appelée dépendra de la valeur du paramètre
``{action}``. En utilisant :ref:`route-elements`, vous pouvez créer des routes
variables, qui acceptent des entrées utilisateur ou des variables. La route
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
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // Crée une route qui ne répondra qu'aux requêtes PUT
    $routes->put(
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

Les méthodes ci-dessus mappent la même URL à des actions différentes en fonction
du verbe HTTP utilisé. Les requêtes GET pointeront sur l'action 'view' tandis que les
requêtes PUT pointeront sur l'action 'update'. Les méthodes suivantes sont disponibles
pour les verbes:

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

.. _route-elements:

Les Eléments de Route
---------------------

Vous pouvez spécifier vos propres éléments de route et ce faisant
cela vous donne le pouvoir de définir des emplacements dans l'URL où les
paramètres pour les actions du controller doivent se trouver. Quand
une requête est faite, les valeurs pour ces éléments de route se
trouvent dans ``$this->request->getParam()`` dans le controller. Quand vous
définissez un élément de route personnalisé, vous pouvez spécifier en option
une expression régulière - ceci dit à CakePHP comment savoir si l'URL est
correctement formée ou non. Si vous choisissez de ne pas fournir une expression
régulière, tout caractère autre que ``/`` sera traité comme une partie du
paramètre::

    $routes->connect(
        '/{controller}/{id}',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    $routes->connect(
        '/{controller}/{id}',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

Cet exemple simple montre comment créer une manière rapide de voir les modèles
à partir de tout contrôleur en élaborant une URL qui ressemble à
``/controllername/{id}``. L'URL fournie à ``connect()`` spécifie deux éléments de
route: ``{controller}`` et ``{id}``. L'élément ``{controller}`` est l'élément de
route par défaut de CakePHP, donc le router sait comment matcher et identifier
les noms de contrôleurs dans les URLs. L'élément ``{id}`` est un élément de route
personnalisé, et doit être clarifié plus loin en spécifiant une expression
régulière correspondante dans le troisième paramètre de ``connect()``.

CakePHP ne produit pas automatiquement d'urls en minuscule avec des tirets quand
vous utilisez le paramètre ``{controller}``. Si vous avez besoin de ceci,
l'exemple ci-dessus peut être réécrit en::

    use Cake\Routing\Route\DashedRoute;

    // Crée un builder avec une classe de Route différente.
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/{controller}/{id}', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        $routes->connect(
            '/{controller}/{id}',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

La classe spéciale ``DashedRoute`` va s'assurer que les paramètres
``{controller}`` et ``{plugin}`` sont correctement mis en minuscule et avec des
tirets.

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

    $routes->connect('/{action}', ['controller' => 'Home']);

Si vous souhaitez fournir une URL non sensible à la casse, vous pouvez utiliser
les modificateurs en ligne d'expression régulière::

    $routes->connect(
        '/{userShortcut}',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

Un exemple de plus, et vous serez un pro du routing::

    $routes->connect(
        '/{controller}/{year}/{month}/{day}',
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
parenthèses (le groupe de capture) ne sont pas supportées dans les expressions
régulières. Vous pouvez toujours spécifier des alternatives, comme
dessus, mais vous ne pouvez pas les grouper avec les parenthèses.

Une fois définie, cette route va matcher ``/articles/2007/02/01``,
``/articles/2004/11/16``, gérant les requêtes
pour les actions ``index()`` de leurs controllers respectifs, avec les paramètres de
date dans ``$this->request->getParam()``.

Eléments de Routes réservés
---------------------------

Il y a plusieurs éléments de route qui ont une signification spéciale dans
CakePHP, et ne devraient pas être utilisés à moins que vous ne souhaitiez
spécifiquement utiliser leur signification.

* ``controller`` Utilisé pour nommer le controller pour une route.
* ``action`` Utilisé pour nommer l'action de controller pour une route.
* ``plugin`` Utilisé pour nommer le plugin dans lequel un controller est
  localisé.
* ``prefix`` Utilisé pour :ref:`prefix-routing`.
* ``_ext`` Utilisé pour :ref:`Routage des extensions de fichiers <file-extensions>`.
* ``_base`` Défini à ``false`` pour retirer le chemin de base de l'URL générée.
  Si votre application n'est pas dans le répertoire racine, cette option peut
  être utilisée pour générer les URLs qui sont 'liées à cake'.
* ``_scheme`` Défini pour créer les liens sur les schémas différents comme
  `webcal` ou `ftp`. Par défaut, au schéma courant.
* ``_host`` Définit l'hôte à utiliser pour le lien. Par défaut à l'hôte courant.
* ``_port`` Définit le port si vous avez besoin de créer les liens sur des ports
  non-standards.
* ``_full`` Si à ``true``, la valeur de ``App.fullBaseUrl`` vue dans
  :ref:`general-configuration` sera ajoutée devant les URL générées.
* ``#`` Vous permet de définir les fragments de hash d'URL.
* ``_https`` Défini à ``true`` pour convertir l'URL générée à https, ou ``false``
  pour forcer http.
* ``_method`` Definit la méthode HTTP à utiliser. Utile si vous travaillez avec
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
        '/{lang}/articles/{slug}',
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

Passer des Paramètres à l'Action
--------------------------------

Quand vous connectez les routes en utilisant
:ref:`route-elements` vous voudrez peut-être que des éléments routés
soient passés comme arguments à la place. L'option ``pass`` défini une liste
des éléments de route qui doivent également être rendu disponibles en tant qu'arguments
passés aux fonctions du contrôleur::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // du code ici...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/{id}-{slug}', // E.g. /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view']
        )
        // Défini les éléments de route dans le template de route
        // à passer en tant qu'arguments à la fonction. L'ordre est
        // important car cela fera simplement correspondre `$id` and `$slug`
        // avec le premier et le second paramètre (respectivement).
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

.. _path-routing:

Utilisation du Routage de Chemin
--------------------------------

Nous avons parlé des cibles de chaîne ci-dessus. La même chose
fonctionne également pour la génération d'URL en utilisant ``Router::pathUrl()``::

    echo Router::pathUrl('Articles::index');
    // donnera par exemple: /articles

    echo Router::pathUrl('MyBackend.Admin/Articles::view', [3]);
    // donnera par exemple: /admin/my-backend/articles/view/3

.. tip::

    Le support IDE pour la saisie semi-automatique du routage de chemin peut être activé avec
    `CakePHP IdeHelper Plugin <https://github.com/dereuromark/cakephp-ide-helper>`_.

.. _named-routes:

Utiliser les Routes Nommées
---------------------------

Parfois vous trouvez que taper tous les paramètres de l'URL pour une route est
trop verbeux, ou bien vous souhaitez tirer avantage des améliorations de la
performance que les routes nommées permettent. Lorsque vous connectez les
routes, vous pouvez spécifier une option ``_name``, cette option peut être
utilisée par le routing inversé pour identifier la route que vous souhaitez
utiliser::

    // Connecter une route avec un nom.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Nommage d'une route liée à un verbe spécifique
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

Si votre template de route contient des éléments de route comme ``{controller}``,
vous aurez besoin de fournir ceux-ci comme options de ``Router::url()``.

.. note::

    Les noms de Route doivent être uniques pour l'ensemble de votre application.
    Le même ``_name`` ne peut être utilisé deux fois, même si les noms
    apparaissent dans un scope de routing différent.

Quand vous construisez vos noms de routes, vous voudrez probablement coller
à certaines conventions pour les noms de route. CakePHP facilite la construction
des noms de route en vous permettant de définir des préfixes de nom dans chaque
scope::

    $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
        // le nom de cette route sera `api:ping`
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });
    // Génère une URL correspondant à la route 'ping'
    Router::url(['_name' => 'api:ping']);

    // Utilisation du namePrefix avec plugin()
    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        // Connecte les routes.
    });

    // Ou avec prefix()
    $routes->prefix('Admin', ['_namePrefix' => 'admin:'], function (RouteBuilder $routes) {
        // Connecte les routes.
    });

Vous pouvez aussi utiliser l'option ``_namePrefix`` dans les scopes imbriqués et
elle fonctionne comme vous pouvez vous y attendre::

    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
            // Le nom de cette route sera `contacts:api:ping`
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // Génère une URL correspondant à la route 'ping'
    Router::url(['_name' => 'contacts:api:ping']);

Les routes connectées dans les scopes nommés auront seulement des noms ajoutés
si la route est aussi nommée. Les routes sans nom ne se verront pas appliquées
``_namePrefix``.

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix de Routage
-----------------

.. php:staticmethod:: prefix($name, $callback)

De nombreuses applications nécessitent une section d'administration dans
laquelle les utilisateurs privilégiés peuvent faire des modifications.
Ceci est souvent réalisé grâce à une URL spéciale telle que
``/admin/users/edit/5``. Dans CakePHP, les préfixes de routage peuvent être
activés en utilisant la méthode de portée (scope) ``prefix``::

    use Cake\Routing\Route\DashedRoute;

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // Toutes les routes ici seront préfixées avec `/admin`, et
        // l'élément de route `'prefix' => 'Admin'` sera ajouté qui
        // sera requis lors de la génération d'URL pour ces routes
        $routes->fallbacks(DashedRoute::class);
    });

Les préfixes sont mappés aux sous-espaces de noms dans l'espace de nom
``Controller`` de votre application. En ayant des préfixes en tant que
controller séparés, vous pouvez créer des contrôleurs plus petits et/ou
plus simples. Les comportements communs aux controllers préfixés et non-préfixés
peuvent être encapsulés via l'héritage, les :doc:`/controllers/components`, ou
les traits. En utilisant notre exemple des utilisateurs, accéder à l'url
``/admin/users/edit/5`` devrait appeler la méthode ``edit()`` de notre
``App\Controller\Admin\UsersController`` en passant 5 comme premier paramètre.
Le fichier de vue utilisé serait **templates/Admin/Users/edit.php**.

Vous pouvez faire correspondre l'URL /admin à votre action ``index()``
du controller Pages en utilisant la route suivante::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // Parce que vous êtes dans le scope admin, vous n'avez pas besoin
        // d'inclure le prefix /admin ou l'élément de route admin.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

Quand vous créez des routes préfixées, vous pouvez définir des paramètres de
route supplémentaires en utilisant l'argument ``$options``::

    $routes->prefix('Admin', ['param' => 'value'], function (RouteBuilder $routes) {
        // Routes connectées ici sont préfixées par '/admin' et
        // ont la clé 'param' de routing définie.
        $routes->connect('/{controller}');
    });

Les préfixes de plusieurs mots sont par défaut convertis en utilisant l'inflexion
en tirets (dasherize), c'est-à-dire que ``MyPrefix`` serait mappé sur
``my-prefix`` dans l'URL. Assurez-vous de définir un chemin d'accès pour ces
préfixes si vous souhaitez utiliser un format différent comme par exemple le
soulignement::

    $routes->prefix('MyPrefix', ['path' => '/my_prefix'], function (RouteBuilder $routes) {
        // Les routes connectées ici sont préfixées par '/my_prefix'
        $routes->connect('/{controller}');
    });

Vous pouvez aussi définir les préfixes dans les scopes de plugin::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

Ce qui est au-dessus va créer un template de route de type
``/debug-kit/admin/{controller}``. La route connectée aura les éléments de
route ``plugin`` et ``prefix`` définis.

Quand vous définissez des préfixes, vous pouvez imbriquer plusieurs préfixes
si besoin::

    $routes->prefix('Manager', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}/{action}');
        });
    });

Ce qui est au-dessus va créer un template de route de type
``/manager/admin/{controller}/{action}``. La route connectée aura l'élément de
route ``prefix`` défini à ``Manager/Admin``.

Le préfixe actuel sera disponible à partir des méthodes du controller avec
``$this->request->getParam('prefix')``

Quand vous utilisez les routes préfixées, il est important de définir l'option
``prefix``, et d'utiliser le même format CamelCased que celui utilisé
dans la méthode ``prefix()``. Voici comment construire ce lien en utilisant le
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

Cela serait lié à un contrôleur avec l'espace de noms ``App\Controller\Admin\MyPrefix``
et le chemin de fichier ``src/Controller/Admin/MyPrefix/TodoItemsController.php``.

.. note::

    Le préfixe est CamelCased ici, même si le résultat du routage est en
    pointillés. La route elle-même fera l'inflexion si nécessaire.

Routing des Plugins
-------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Les routes des :doc:`/plugins` doivent être créées en utilisant la méthode
``plugin()``. Cette méthode crée un nouveau scope pour les routes de plugin::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        // Les routes connectées ici sont préfixées par '/debug_kit' et ont
        // l'élément de route plugin défini à 'DebugKit'.
        $routes->connect('/{controller}');
    });

Lors de la création des scopes de plugin, vous pouvez personnaliser le chemin de
l'élément avec l'option ``path``::

    $routes->plugin('DebugKit', ['path' => '/debugger'], function (RouteBuilder $routes) {
        // Les routes connectées ici sont préfixées par '/debugger' et ont
        // l'élément de route plugin défini à 'DebugKit'.
        $routes->connect('/{controller}');
    });

Lors de l'utilisation des scopes, vous pouvez imbriquer un scope de plugin dans
un scope de prefix::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        $routes->plugin('DebugKit', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

Le code ci-dessus va créer une route similaire à
``/admin/debug-kit/{controller}``. Elle aura les éléments de route
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
des URLs avec des tirets pour vos plugins, contrôleurs, et les noms d'action en
``camelCase``.

Par exemple, si nous avons un plugin ``ToDo`` avec un controller ``TodoItems``
et une action ``showItems()``, la route générée sera
``/to-do/todo-items/show-items`` avec le code qui suit::

    use Cake\Routing\Route\DashedRoute;

    $routes->plugin('ToDo', ['path' => 'to-do'], function (RouteBuilder $routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Matching des Méthodes HTTP Spécifiques
--------------------------------------

Les routes peuvent "matcher" des méthodes HTTP spécifiques en utilisant
les méthodes spécifiques::

    $routes->scope('/', function (RouteBuilder $routes) {
        // Cette route matchera seulement les requêtes POST.
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // Matcher plusieurs verbes
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

    $routes->scope('/', function (RouteBuilder $routes) {
        // Cette route ne va "matcher" que sur le domaine http://images.example.com
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // Cette route matchera sur tous les sous-domaines http://*.example.com
        $routes->connect(
            '/images/old-logo.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('*.example.com');
    });

L'option ``_host`` est également utilisée dans la génération d'URL. Si votre option ``_host``
spécifie un domaine exact, ce domaine sera inclus dans l'URL générée.
Cependant, si vous utilisez un caractère générique, vous devrez fournir le ``_host``
paramètre lors de la génération d'URL::

    // Si vous avez cette route
    $routes->connect(
        '/images/old-logo.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // Vous aurez besoin de ceci pour générer l'URL correspondante
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. index:: file extensions
.. _file-extensions:

Routing des Extensions de Fichier
---------------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

Pour manipuler différentes extensions de fichier avec vos routes, vous pouvez
définir vos extensions en utilisant la méthode
:php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()`::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml']);
    });


Ceci affectera **toutes** les routes qui seront connectées **après** cet appel,
à ``setExtensions()`` en incluant celles qui ont été connectées dans des scopes imbriqués.

Pour restreindre les extensions à un *scope* spécifique, vous pouvez les définir
en utilisant la méthode :php:meth:`Cake\\Routing\\RouteBuilder::extensions()`.

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

    $routes->scope('/page', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/{title}',
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

.. _route-scoped-middleware:

Middleware appliqué à une Route
-------------------------------

Bien que les middlewares puissent être appliqués à toute votre application, appliquer
les middlewares à des 'scopes' de routing offre plus de flexibilité puisque vous
pouvez appliquer des middlewares seulement où ils sont nécessaires permettant à vos
middlewares de ne pas nécessiter de logique spécifique sur le comment/où il doit
s'appliquer.

.. note::

    Le middleware appliqué sera exécuté par :ref:`RoutingMiddleware <routing-middleware>`,
    normalement à la fin de la liste des middleware de votre application.

Avant qu'un middleware ne puisse être appliqué à un scope, il a besoin d'être
enregistré dans la collection de routes::

    // dans config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
        $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());
    });

Une fois enregistré, le middleware peut être appliqué
à des scopes spécifiques::

    $routes->scope('/cms', function (RouteBuilder $routes) {
        // Enable CSRF & cookies middleware
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/{action}/*', ['controller' => 'Articles'])
    });

Dans le cas où vous auriez des 'scopes' imbriqués, les "sous" scopes hériteront
des middlewares apppliqués dans le scope contenant::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function (RouteBuilder $routes) {
            $routes->applyMiddleware('v1compat');
            // Définissez vos routes
        });
    });

Dans l'exemple ci-dessus, les routes définies dans ``/v1`` auront les middlewares
'ratelimit', 'auth.api', and 'v1compat' appliqués. Si vous ré-ouvrez un scope, les
middlewares appliqués aux routes dans chaque scopes seront isolés::

    $routes->scope('/blog', function (RouteBuilder $routes) {
        $routes->applyMiddleware('auth');
        // Connecter les actions qui nécessitent l'authentification aux 'blog' ici
    });
    $routes->scope('/blog', function (RouteBuilder $routes) {
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

    // Appliquer le groupe
    $routes->applyMiddleware('web');

.. _resource-routes:

Créer des Routes RESTful
========================

Le router aide à générer des routes RESTful pour vos controllers.
Les routes RESTful sont utiles lorsque vous créez des points de terminaison
(endpoint) d'API pour vos applications. Si nous voulions autoriser l'accès REST
à un contrôleur de recette, nous ferions quelque chose comme ceci::

    //Dans config/routes.php

     $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

La première ligne définit un certain nombre de routes par défaut pour l'accès
REST où la méthode spécifie le format du résultat souhaité (par exemple, xml,
json, rss). Ces routes sont sensibles aux méthodes de requêtes HTTP.

=========== ===================== ==============================
HTTP format URL.format            Action du contrôleur appelée
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

.. note::

    La valeur par défaut du modèle pour les ID de ressource ne reconnait que des entiers ou
    des UUID. Si vos ID sont différents, vous devrez fournir une expression régulière
    via l'option ``id``. Par exemple. ``$builder->resources('Recettes', ['id' => '. *'])``.

La classe Router de CakePHP utilise un nombre différent d'indicateurs pour
détecter la méthode HTTP utilisée. Voici la liste dans l'ordre de préférence:

#. La variable de POST ``_method``
#. Le header ``X_HTTP_METHOD_OVERRIDE``
#. Le header ``REQUEST_METHOD``

La variable POST ``_method`` est utile dans l'utilisation d'un navigateur comme
client REST (ou tout ce qui peut faire du POST). Il suffit de configurer la
valeur de ``_method`` avec le nom de la méthode de requête HTTP que vous souhaitez
émuler.

Créer des Routes de Ressources Imbriquées
-----------------------------------------

Une fois que vous avez connecté une ressource dans un scope, vous pouvez aussi
connecter des routes pour des sous-ressources. Les routes de sous-ressources
seront préfixées par le nom de la ressource originale et par son paramètre id.
Par exemple::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments');
        });
    });

Le code ci-dessus va générer une ressource de route pour ``articles`` et
``comments``. Les routes des ``comments`` vont ressembler à ceci::

    /api/articles/{article_id}/comments
    /api/articles/{article_id}/comments/{id}

Vous pouvez récupérer le champs ``article_id`` de ``CommentsController`` de cette façon::

    $this->request->getParam('article_id');

Par défaut les ressources de routes sont connectées au même préfixe que celles de leur scope.
Si vous avez à la fois des contrôleurs de ressources imbriqués et non imbriqués, vous pouvez
utiliser un contrôleur  différent dans chaque contexte en utilisant des préfixes::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments', ['prefix' => 'Articles']);
        });
    });

L'exemple ci-dessus mapperait le champs 'Comments' vers
``App\Controller\Articles\CommentsController``. Une séparation des contrôleurs
vous permet de simplifier la logique. Les préfixes créés de cette manière sont
compatibles avec :ref:`prefix-routing`.

.. note::

    Vous pouvez imbriquer autant de ressources que vous le souhaitez, mais il
    n'est pas recommandé d'imbriquer plus de 2 ressources ensembles.

Limiter la Création des Routes
------------------------------

Par défaut, CakePHP va connecter 6 routes pour chaque ressource. Si vous
souhaitez connecter uniquement des routes spécifiques à une ressource, vous
pouvez utiliser l'option ``only``::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Le code ci-dessus devrait créer uniquement les routes de ressource pour la lecture.
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
`/articles/delete-all`. Par défaut le segment de chemin va matcher le nom
de la clé. Vous pouvez utiliser la clé 'path' à l'intérieur de la définition
de la ressource pour personnaliser le nom de chemin::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'PUT',
                'path' => '/update-many'
            ],
        ]
    ]);
    // Ceci connecterait /articles/update-many

Si vous définissez 'only' et 'map', assurez-vous que vos méthodes mappées sont
aussi dans la liste 'only'.

Router vers une Ressource Préfixée
----------------------------------

Les routes vers des ressources peuvent être connectées à des controllers ayant
des préfixes de routage en connectant des routes à l'intérieur d'un scope
préfixé, ou en utilisant l'option ``prefix``::

    $routes->resources('Articles', [
        'prefix' => 'Api',
    ]);

.. _custom-rest-routing:

Classes de Route Personnalisée pour les Ressources
--------------------------------------------------

Vous pouvez spécifier la clé ``connectOptions`` dans le tableau ``$options`` de
la fonction ``resources()`` pour fournir une configuration personnalisée
utilisée par ``connect()``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

Inflection de l'URL pour les Routes Ressource
---------------------------------------------

Par défaut le fragment d'URL pour les contrôleurs dont le nom est composé de
plusieurs mots est la forme en underscore du nom du controller. Par exemple,
le fragment d'URL pour ``BlogPosts`` serait **/blog-posts**.

Vous pouvez spécifier un type d'inflection alternatif en utilisant l'option
``inflect``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'underscore' // Utilisera ``Inflector::underscore()``
        ]);
    })

Ce qui est au-dessus va générer des URLs de style **/blog_posts***.

Changer le chemin d'un élément
------------------------------

Par défaut, les ressources de routes utilisent le nom de ressource ayant subi
une inflexion en guise de segment d'URL. Vous pouvez définir un segment d'URL
personnalisé à l'aide de l'option ``path``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

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
routes personnalisées, il est également possible de forcer des paramètres
particuliers comme étant des paramètres passés.

Si vous alliez visiter l'URL mentionné précédemment, et que vous aviez une
action de contrôleur qui ressemblait à cela::

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
vos contrôleurs, vues, et helpers. Les valeurs dans le tableau pass sont
indicées numériquement basé sur l'ordre dans lequel elles apparaissent dans
l'URL appelée::

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

Comme ``5`` poss!de une clé numérique, il est traité comme un argument passé.

Générer des URLs
================

.. php:staticmethod:: url($url = null, $full = false)
.. php:staticmethod:: reverse($params, $full = false)

La génération d'URL ou le routing inversé est une fonctionnalité dans CakePHP qui est utilisée
pour vous permettre de changer votre structure d'URL sans avoir à modifier tout votre
code.

Si vous créez des URLs en utilisant des chaînes de caractères comme::

    $this->Html->link('View', '/articles/view/' . $id);

Et ensuite plus tard, vous décidez que ``/articles`` devrait vraiment être
appelé 'posts' à la place, vous devrez aller dans toute votre application
en renommant les URLs. Cependant, si vous définissiez votre lien comme::

    //`link()` utilise Router::url() en interne et accepte un tableau de routage

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

ou::

    //'Router::reverse()' fonctionne sur le tableau de paramètres de requête
    //et produira une entrée valide pour la méthode `link()` : une url
    //sous forme de chaîne de caractères.

    $requestParams = Router::getRequest()->getAttributes('params');
    $this->Html->link('View', Router::reverse($requestParams));

Ensuite quand vous décidez de changer vos URLs, vous pouvez le faire en
définissant une route. Cela changerait à la fois le mapping d'URL entrant,
ainsi que les URLs générés.

Le choix de la technique est déterminé par la façon dont vous pouvez prédire
les éléments du tableau de routage.

Utilisation de  ``Router::url()``
---------------------------------

``Router::url()`` vous permet d'utiliser des :term:`Tableaux de routage <tableau de routing>`
dans les situations où les éléments de tableau requis sont fixes ou facilement déduits.

Il fournira un routage inversé lorsque l'URL de destination est bien définie::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

Il est également utile lorsque la destination est inconnue mais suit un
modèle bien défini ::

    $this->Html->link(
        'View',
        ['controller' => $controller, 'action' => 'view', $id]
    );

Les éléments qui possèdent des clés numériques sont traités comme :ref:`passed-arguments`.

Quand vous utilisez les URLs en tableau, vous pouvez définir les paramètres
chaîne de la requête et les fragments de document en utilisant les clés
spéciales::

    $routes->url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Cela générera une URL comme:
    /articles/index?page=1#top

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
* ``_full`` Si à ``true``, la valeur de ``App.fullBaseUrl`` vue dans
  :ref:`general-configuration` sera ajoutée devant les URL générées.
* ``_https`` Défini à ``true`` pour convertir l'URL générée à https, ou ``false``
  pour forcer http.
* ``_method`` Definit la méthode HTTP à utiliser. Utile si vous travaillez avec
  :ref:`resource-routes`.
* ``_name`` Nom de route. Si vous avez configuré les routes nommées, vous
  pouvez utiliser cette clé pour les spécifier.

Utilisation de ``Router::reverse()``
------------------------------------

``Router::reverse()`` vous permet d'utiliser les: ref: `request-parameters` dans les cas
où l'URL courante modifiée sert de base à celle de destination mais que les éléments
de l'URL courantes ne sont pas prévisibles.

À titre d'exemple, imaginez un blog permettant aux utilisateurs de créer des **Articles** et
**Commentaires**, et de marquer les deux comme *publié* ou *brouillon*. Les deuxpages d'index
pourrait inclure l'ID utilisateur. L'URL **Commentaires** pourrait également inclure
un identifiant d'article pour identifier l'article auquel le commentaire fait référence.

Voici les URL correspondant à ce scénario::

   /articles/index/42
  /comments/index/42/18

Lorsque l'auteur utilise ces pages, il serait pratique d'inclure des liens
qui permettent d'afficher la page avec tous les résultats, publiés uniquement,
ou à l'état brouillon seulement.

Pour garder le code DRY, il serait préférable d'inclure les liens via
un élément::

    // element/filter_published.php

    $params = $this->getRequest()->getAttribute('params');

    /* prépare l'url pour l'état 'Brouillon' */
    $params = Hash::insert($params, '?.published', 0);
    echo $this->Html->link(__('Brouillon'), Router::reverse($params));

    /* prépare l'url pour l'état for 'Publié' */
    $params = Hash::insert($params, '?.published', 1);
    echo $this->Html->link(__('Publié'), Router::reverse($params));

    /* prépare l'url pour tous les articles */
    $params = Hash::remove($params, '?.published');
    echo $this->Html->link(__('Tous'), Router::reverse($params));

Les liens générés par ces appels de méthode incluraient un ou deux passages
paramètres en fonction de la structure de l'URL actuelle. Et le code
fonctionnerait pour toute URL future, par exemple, si vous commencez à utiliser
pathPrefixes ou si vous prévoyez de passer plus de paramètres.

Tableaux de Routages vs Paramètrees de Requête
----------------------------------------------

La différence significative entre les deux tableaux et leur utilisation dans ces
les méthodes de routage inversé sont dans la manière dont elles incluent les paramètres
passés.

Les tableaux de routage incluent les paramètres fournis en tant que valeurs
sans clé dans le tableau::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        $id, //a pass parameter
        'page' => 3, //un argument de requête (query)
    ];

Les paramètres de requête incluent les paramètres fournis dans la clé 'pass'
du tableau::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        'pass' => [$id], //the pass parameters
        '?' => 'page' => 3, //les arguments de la requête (query)
    ];

Il est donc possible, si vous le souhaitez, de convertir les paramètres de la requête en
un tableau de routage ou vice versa.

.. _asset-routing:

Générer des URL de ressources
=============================

La classe ``Asset`` fournit des méthodes pour générer des URL vers les fichiers
css, javascript, images et autres fichiers statiques de votre application::

    use Cake\Routing\Asset;

    // Génère une URL pointant vers APP/webroot/js/app.js
    $js = Asset::scriptUrl('app.js');

    // Génère une URL pointant vers APP/webroot/css/app.css
    $css = Asset::cssUrl('app.css');

    // Génère une URL pointant vers APP/webroot/image/logo.png
    $img = Asset::imageUrl('logo.png');

    // Génère une URL pointant vers APP/webroot/files/upload/photo.png
    $file = Asset::url('files/upload/photo.png');

Les méthodes ci-dessus acceptent également un tableau d'options comme deuxième paramètre:

* ``fullBase`` Ajoute l'url complète incluant le nom de domaine.
* ``pathPrefix`` Indique le préfixe pour les url relatives.
* ``plugin`` Vous pouvez indiquer ``false`` pour éviter que les chemins ne soient traités
  comme des ressources appartenant à un plugin.
* ``timestamp`` Remplace la valeur de ``Asset.timestamp`` définie dans la configuration (Configure).
  Mettez-le à ``false`` pour désactiver la génération des timestamp. Mettez-le à ``true`` pour
  générer les timestamp quand debug est à ``true``. Mettez-le à ``'force'`` pour forcer la génération
  des timestamps indépendemment de la valeur du paramètre debug.

::

    // Génère http://example.org/img/logo.png
    $img = Asset::url('logo.png', ['fullBase' => true]);

    // Génère /img/logo.png?1568563625
    // Pour lequel le timestamp correspond à la date de dernière modification du fichier
    $img = Asset::url('logo.png', ['timestamp' => true]);

Pour générer des URL de ressources pour les fichiers dans les plugins, utilisez la :term:`syntaxe de plugin`::

    // Génère `/debug_kit/img/cake.png`
    $img = Asset::imageUrl('DebugKit.cake.png');

.. _redirect-routing:

Routing de Redirection
======================

Le routing de redirection permet de créer des statuts HTTP de redirection
30x pour les routes entrantes et les faire pointer vers des URLs différentes.
C'est utile lorsque vous souhaitez informer les applications clientes qu'une
ressource a été déplacée et que vous ne voulez pas exposer deux URLs pour
le même contenu.

Les routes de redirection sont différentes des routes normales car elles
effectuent une redirection d'en-tête si une correspondance est trouvée. La
redirection peut se produire vers une destination au sein de votre
application ou un emplacement à extérieur::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // Ou ['persist'=>['id']] pour la valeur par défaut du routage
            // quand l'action 'view' attend $id comme argument.
        );
    })

Redirige ``/home/*`` vers ``/articles/view`` et passe les paramètres vers
``/articles/view``. Utiliser un tableau comme destination de redirection vous
permet d'utiliser différentes routes pour définir où la chaine URL devrait
être redirigée. Vous pouvez rediriger vers des destinations externes en
utilisant des chaines URLs pour destination::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->redirect('/articles/*', 'https://google.com', ['status' => 302]);
    });

Cela redirigerait ``/articles/*`` vers ``https://google.com`` avec un statut
HTTP 302.

.. _entity-routing:

Routage des Entités
===================

Le routage d'entité vous permet d'utiliser une entité, un tableau ou un objet
``ArrayAccess`` comme source des paramètres de routage. Cela vous permet de refactoriser
vos routes plus facilement et de générer des URL avec moins de code. Par exemple,
si vous commencez avec une route qui ressemble à::

    $routes->get(
        '/view/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

Vous pouvez générer une URL vers cette route comme suit::

    // $article est une entité dans le contexte local.
    Router::url(['_name' => 'articles:view', 'id' => $article->id]);

Plus tard, vous souhaiterez peut-être exposer le slug de l'article dans l'URL
à des fins de référencement (SEO). Pour ce faire, vous devez mettre à jour partout
où vous générez une URL vers la route ``articles:vue``, ce qui peut prendre un certain temps.
Si nous utilisons des routes d'entité, nous transmettons l'entité entière de l'article à la
génération d'URL, ce qui nous permet d'éviter tout travail supplémentaire lorsque les URL
nécessitent plus de paramètres::

    use Cake\Routing\Route\EntityRoute;

    // Créez des routes d'entité pour le reste du contexte.
    $routes->setRouteClass(EntityRoute::class);

    // Créez une route comme précédemment.
    $routes->get(
        '/view/{id}/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

Maintenant, nous pouvons générer des URL en utilisant la clé ``_entity``::

    Router::url(['_name' => 'articles:view', '_entity' => $article]);

Cela extraira à la fois la propriété ``id`` et la propriété ``slug`` de
l'entité fournie.

.. _custom-route-classes:

Classes Route Personnalisées
============================

Les classes de route personnalisées vous permettent d'étendre et modifier la
manière dont les routes individuelles parsent les requêtes et gèrent le routing
inversé. Les classes de route suivent quelques conventions:

* Les classes de Route doivent se trouver dans le namespace ``Routing\Route``
  de votre application ou plugin.
* Les classes de Route doivent étendre :php:class:`Cake\\Routing\\Route\\Route`.
* Les classes de Route doivent implémenter au moins un des méthodes ``match()``
  et/ou ``parse()``.

La méthode ``parse()`` est utilisée pour parser une URL entrante. Elle doit
générer un tableau de paramètres de requêtes qui peuvent être résolus en
contrôleur & action. Renvoyez ``null`` pour indiquer une erreur de
correspondance.

La méthode ``match()`` est utilisée pour faire correspondre un tableau de
paramètres d'URL et créer une chaine URL. Si les paramètres d'URL ne
correspondent pas, ``false`` doit être renvoyé.

Vous pouvez utiliser votre classe de route personnalisée lors de la création
d'une route en utilisant l'option ``routeClass``::

    $routes->connect(
        '/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['routeClass' => 'SlugRoute']
    );

    // Ou en définissant la routeClass dans votre scope.
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
            '/{slug}',
            ['controller' => 'Articles', 'action' => 'view']
        );
    });

Cette route créera une instance de ``SlugRoute`` et vous permettra d'implémenter
une gestion des paramètres personnalisée. Vous pouvez utiliser les classes routes
des plugins en utilisant la :term:`syntaxe de plugin` standard.

Classe de Route par Défaut
--------------------------

.. php:staticmethod:: setRouteClass($routeClass = null)

Si vous voulez utiliser une autre classe de route pour toutes vos routes
en plus de la ``Route`` par défaut, vous pouvez faire ceci en appelant
``RouterBuilder::setRouteClass()`` avant de définir la moindre route et éviter
de spécifier l'option ``routeClass`` pour chaque route. Par exemple en
utilisant::

    use Cake\Routing\Route\DashedRoute;

    $routes->setRouteClass(DashedRoute::class);

Cela provoquera l'utilisation de la classe ``DashedRoute`` pour toutes les
routes suivantes.
Appeler la méthode sans argument va retourner la classe de route courante par
défaut.

Méthode Fallbacks
-----------------

.. php:method:: fallbacks($routeClass = null)

La méthode fallbacks (de repli) est un raccourci simple pour définir les routes
par défaut. La méthode utilise la classe de route passée pour les règles
définies ou, si aucune classe n'est passée, la classe retournée par
``RouterBuilder::setRouteClass()`` sera utilisée.

Appelez fallbacks comme ceci::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Est équivalent à ces appels explicites::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/{controller}', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/{controller}/{action}/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    Utiliser la classe route par défaut (``Route``) avec fallbacks, ou toute
    route avec les éléments ``{plugin}`` et/ou ``{controller}`` résultera en
    des URL incompatibles.

Créer des Paramètres d'URL Persistants
======================================

En utilisant les fonctions de filtre, vous pouvez vous immiscer dans le process
de génération d'URL. Les fonctions de filtres sont appelées *avant* que les
URLs ne soient vérifiées via les routes, cela vous permet donc de préparer les
URLs avant le routing.

Les fonctions de callback de filtre doivent attendre les paramètres suivants:

- ``$params`` Le paramètre d'URL à traiter.
- ``$request`` La requête actuelle (une instance de ``Cake\Http\ServerRequest``).

La fonction filtre d'URL doit *toujours* retourner les paramètres même s'ils
n'ont pas été modifiés.

Les filtres d'URL vous permettent d'implémenter des fonctionnalités telles que
l'utilisation de paramètres d'URL persistants::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }

        return $params;
    });

Le fonctions de filtres sont appliquées dans l'ordre dans lequel elles sont
connectées.

Un autre cas lorsque l'on souhaite changer une route en particulier à la volée
(pour les routes de plugin par exemple)::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
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

Transformera la route suivante::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

en ceci::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

.. warning::
    Si vous utilisez les fonctionnalités de mise en cache :ref:`routing-middleware`
    vous devez définir les filtres d'URL dans le ``bootstrap()`` de votre application
    car les filtres ne font pas partie des données mises en cache.

.. meta::
    :title lang=fr: Routing
    :keywords lang=fr: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,routeur,router
