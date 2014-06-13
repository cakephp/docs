Routing
#######

Routing est une fonctionnalité qui mappe les URLs aux actions du controller.
Elle a été ajoutée à CakePHP pour rendre les URLs belles et plus configurables
et flexibles. L'utilisation du mod\_rewrite de Apache n'est pas nécessaire pour
utiliser les routes, mais cela rendra votre barre d'adresse beaucoup plus
élégante.

Le Routing dans CakePHP englobe aussi l'idée de routing inversé,
où un tableau de paramètres peut être inversé en une chaîne URL.
En utilisant le routing inversé, vous pouvez facilement reconstruire votre
structure d'URL des applications sans avoir mis à jour tous vos codes.

Les Routes dans une application sont configurées dans ``App/Config/routes.php``.
Ce fichier est inclu par le :php:class:`Dispatcher` quand on gère les routes et
vous permet de définir des routes spécifiques d'application que vous voulez
utiliser. Les Routes déclarées dans ce fichier sont traitées de haut en bas
quand les requêtes entrantes correspondent. Cela signifie que l'ordre dans
lequel vous placez les routes peuvent affecter comment les routes sont parsées.
C'est généralement une bonne idée de placer les routes visitées le plus
fréquemment en haut du fichier de routes si possible. Cela va permettre de
ne pas à avoir à vérifier un certain nombre de routes qui ne correspondront
pas à chaque requête.

.. index:: routes.php

Tour Rapide
===========

Cette section va vous apprendre par exemple les utilisations les plus
habituelles du Router de CakePHP. Typiquement si vous voulez afficher quelque
chose en page de base, vous ajoutez ceci au fichier **routes.php**::

    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

Ceci va executer la méthode index dans ``ArticlesController`` quand la page
d'accueil de votre site est visitée. Parfois vous avez besoin de routes
dynamiques qui vont accepter plusieurs paramètres, ce sera le cas par exemple
d'une route pour voir le contenu d'un article::

    Router::connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

La route ci-dessus accepte tout url qui ressemble à ``/articles/15`` et appelle
la méthode ``view(15)`` dans ``ArticlesController``. Ceci ne va pas en revanche
fonctionner pour les gens qui essaient d'accéder aux URLs ressemblant à
``/articles/foobar``. Si vous le souhaitez, vous pouvez rechanger quelques
paramètres pour vous conformer à une expression régulière::

    Router::connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

L'exemple précédent a changé le matcher par un nouveau placeholder ``:id``.
Utiliser les placeholders nous permet de valider les parties de l'url, dans ce
cas, nous utilisons l'expression régulière ``\d+`` pour que seules les chiffres
fonctionnenet. Finalement, nous disons au Router de traiter le placeholder
``id`` comme un argument de fonction pour la fonction ``view()`` en spécifiant
l'option ``pass``. Vous pourrez en voir plus sur leur utilisation plus tard.

Le Router de CakePHP peut aussi faire correspondre les routes en reverse. Cela
signifie qu'à partir d'un tableau contenant des paramètres similaires, il est
capable de générer une chaîne URL::

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Will output
    /articles/15

Les routes peuvent aussi être labellisées avec un nom unique, cela vous permet
de rapidement leur faire référence lors de la construction des liens plutôt
que de spécifier chacun des paramètres de routing::
 
    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    echo Router::url('login');
    // Va afficher
    /login

.. _routes-configuration:

Configuration des Routes
========================

Les Routes sont parsées et matchées dans l'ordre dans lequel elles sont
connectées. Si vous définissez deux routes similaires, la première route
définie va avoir une priorité plus haute sur celle définie plus tard. Après
avoir connecté les routes, vous pouvez manipuler l'ordre des routes en
utilisant :php:meth:`Cake\\Routing\\Router::promote()`.

CakePHP intègre aussi quelques routes par défaut pour commencer. Celles-ci
peuvent être désactivées plus tard une fois que vous êtes sûr que vous n'en
aurez pas besoin. Regardez :ref:`disabling-default-routes` sur la façon de
désactiver le routing par défaut.

Configuration Générale
----------------------

En plus des routes habituelles, il y a quelques options de configuration
générales concernant le routing:

Routing.prefixes
    Décommentez cette définition si voulez tirer avantage des routes préfixées
    de CakePHP comme admin. Définissez cette variable avec un tableau de noms
    préfixés des routes que vous souhaitez utiliser. Consultez la section sur
    :ref:`prefix-routing` pour plus d'informations.

Routing par défaut
==================

Avant que vous appreniez à configurer vos propres routes, vous devez savoir
que CakePHP est configuré avec un ensemble de routes par défaut.
Le routing de CakePHP par défaut va vous faire aller assez loin dans toute
application. Vous pouvez accéder à une action directement par l'URL en
mettant son nom dans la requête. Vous pouvez aussi passer des paramètres aux
actions de votre controller en utilisant l'URL.::

        modèle URL des routes par défaut: 
        http://example.com/controller/action/param1/param2/param3

L'URL /articles/view lance l'action view() de
ArticlesController, et /products/view\_clearance lance l'action
view\_clearance() de ProductsController. Si aucune action n'est spécifiée
dans l'URL, la méthode index() est supposée.

La configuration du routing par défaut vous permet aussi de passer les
paramètres à vos actions en utilisant l'URL. Une requête pour
/posts/view/25 serait équivalente à appeler view(25) dans le PostsController,
par exemple. Le routing par défaut fournit aussi les routes pour les plugins,
et les routes préfixées si vous choisissez d'utiliser ces fonctionnalités.

Les routes intégrées sont dans ``Cake/Config/routes.php``. Vous pouvez
désactiver le routing par défaut en les retirant du fichier
:term:`routes.php` de votre application.

.. index:: :controller, :action, :plugin
.. _connecting-routes:

Connecter les Routes
====================

Définir vos propres routes vous permet de définir la façon dont votre
application va répondre à une URL donnée. Définir vos propres routes
dans le fichier ``App/Config/routes.php`` en utilisant la méthode
:php:meth:`Router::connect()`.

La méthode ``connect()`` prend trois paramètres: l'URL que vous souhaitez
faire correspondre, les valeurs par défaut pour les éléments de votre
route, et les règles d'expression régulière pour aider le routeur à
faire correspondre les éléments dans l'URL.

Le format basique pour une définition de route est::

    Router::connect(
        'URL template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

Le premier paramètre est utilisé pour dire au routeur quelle sorte d'URL
vous essayez de contrôler. L'URL est une chaîne normale délimitée par
des slashes, mais peut aussi contenir une wildcard (\*) ou
:ref:`route-elements`. Utiliser une wildcard dit au routeur que vous êtes prêt
à accepter tout argument supplémentaire fourni. Les Routes sans un \* ne
matchent que le pattern template exact fourni.

Une fois que vous spécifiez une URL, vous utilisez les deux derniers paramètres
de ``connect()`` pour dire à CakePHP quoi faire avec une requête une fois
qu'elle a été matchée. Le deuxième paramètre est un tableau associatif. Les
clés du tableau devraient être appelées après les éléments de route dans l'URL,
ou les éléments par défaut: ``:controller``, ``:action``, et ``:plugin``.
Les valeurs dans le tableau sont les valeurs par défaut pour ces clés.
Regardons quelques exemples simples avant que nous commencions l'utilisation
le troisième paramètre de connect()::

    Router::connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

Cette route est trouvée dans le fichier routes.php distribué avec CakePHP.
Cette route matche toute URL commençant par ``/pages/`` et il tend vers
l'action ``display()`` de ``PagesController();``
La requête /pages/products serait mappé vers
``PagesController->display('products')``.

En plus de l'étoile greedy ``/*`` il y aussi la syntaxe de l'étoile trailing
``/**``. Utiliser une étoile double trailing, va capturer le reste de l'URL
en tant qu'argument unique passé. Ceci est utile quand vous voulez utilisez
un argument qui incluait un ``/`` dedans::

    Router::connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

L'URL entrante de ``/pages/the-example-/-and-proof`` résulterait en un argument
unique passé de ``the-example-/-and-proof``.

Vous pouvez utiliser le deuxième paramètre de :php:meth:`Router::connect()`
pour fournir tout paramètre de routing qui est composé des valeurs par défaut
de la route::

    Router::connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

Cet exemple montre comment vous pouvez utilisez le deuxième paramètre de
``connect()`` pour définir les paramètres par défaut. Si vous construisez un
site qui propose des produits pour différentes catégories de clients, vous
pourriez considérer la création d'une route. Cela vous permet de vous lier
à ``/government`` plutôt qu'à ``/pages/display/5``.

.. note::
    
    Bien que vous puissiez connecter des routes alternatives, les routes par
    défaut vont continuer à fonctionner. Ceci pourrait créer des situations,
    où le contenu pourrait finir avec 2 URLs. Regardez
    :ref:`disabling-default-routes` pour désactiver les routes par défaut,
    et fournir seulement les URLs que vous définissez.

Une autre utilisation ordinaire pour le Router est de définir un "alias" pour
un controller. Disons qu'au lieu d'accéder à notre URL régulière à
``/users/some_action/5``, nous aimerions être capable de l'accéder avec
``/cooks/some_action/5``. La route suivante s'occupe facilement de cela::

    Router::connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

Cela dit au Router que toute URL commençant par ``/cooks/`` devrait être
envoyée au controller users. L'action appelée dépendra de la valeur du
paramètre ``:action``. En utilisant :ref:`route-elements`, vous pouvez
créer des routes variables, qui acceptent les entrées utilisateur ou les
variables. La route ci-dessus utilise aussi l'étoile greedy.
L'étoile greedy indique au :php:class:`Router` que cette route devrait
accepter tout argument de position supplémentaire donné. Ces arguments
seront rendus disponibles dans le tableau :ref:`passed-arguments`.

Quand on génère les URLs, les routes sont aussi utilisées. Utiliser
``array('controller' => 'Users', 'action' => 'some_action', 5)`` en
URL va sortir /cooks/some_action/5 si la route ci-dessus est la
première correspondante trouvée.

.. _route-elements:

Les éléments de Route
---------------------

Vous pouvez spécifier vos propres éléments de route et ce faisant
cela vous donne le pouvoir de définir des places dans l'URL où les
paramètres pour les actions du controller doivent se trouver. Quand
une requête est faite, les valeurs pour ces éléments de route se
trouvent dans ``$this->request->params`` dans le controller. Quand vous
définissez un element de route personnalisé, vous pouvez spécifier en option
une expression régulière - ceci dit à CakePHP comment savoir si l'URL est
correctement formé ou non. Si vous choisissez de ne pas fournir une expression
régulière, toute expression non ``/`` sera traitée comme une partie du
paramètre::

    Router::connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

Cet exemple simple montre comment créer une manière rapide de voir les models
à partir de tout controller en élaborant une URL qui ressemble à
``/controllername/:id``. L'URL fourni à connect() spécifie deux éléments de
route: ``:controller`` et ``:id``. L'élément ``:controller`` est l'élément de
route par défaut de CakePHP, donc le routeur sait comment matcher et identifier
les noms de controller dans les URLs. L'élément ``:id`` est un élément de route
personnalisé, et doit être clarifié plus loin en spécifiant une expression
régulière correspondante dans le troisième paramètre de connect().

CakePHP ne produit pas automatiquement d'urls en minuscule quand vous utilisez
le paramètre ``:controller``. Si vous avez besoin de ceci, l'exemple ci-dessus
peut être réécrit en::

    Router::connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+', 'routeClass' => 'Cake\Routing\Route\InflectedRoute']
    );

La classe spéciale ``InflectedRoute`` va s'assurer que les paramètres
``:controller`` et ``:plugin`` sont correctement mis en minuscule.

.. note::

    Les Patrons utilisés pour les éléments de route ne doivent pas contenir
    de groupes capturés. Si ils le font, le Router ne va pas fonctionner
    correctement.

Une fois que cette route a été définie, requêtant ``/apples/5`` est la même
que celle requêtant ``/apples/view/5``. Les deux appeleraient la méthode view()
de ApplesController. A l'intérieur de la méthode view(), vous aurez besoin
d'accéder à l'ID passé à ``$this->request->params['id']``.

Si vous avez un unique controller dans votre application et que vous ne ne
voulez pas que le nom du controller apparaisse dans l'URL, vous pouvez mapper
tous les URLs aux actions dans votre controller. Par exemple, pour mapper
toutes les URLs aux actions du controller ``home``, par ex avoir des URLs
comme ``/demo`` à la place de ``/home/demo``, vous pouvez faire ce qui suit::

    Router::connect('/:action', ['controller' => 'Home']);

Si vous souhaitez fournir une URL non sensible à la casse, vous pouvez utiliser
les modificateurs en ligne d'expression régulière::

    Router::connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
        ['userShortcut' => '(?i:principal)']
    );

Un exemple de plus, et vous serez un pro du routing::

    Router::connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index'],
        [
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        ]
    );

C'est assez complexe, mais montre comme les routes peuvent vraiment
devenir puissantes. L'URL fourni a quatre éléments de route. Le premier
nous est familier: c'est une route par défaut qui dit à CakePHP d'attendre
un nom de controller.

Ensuite, nous spécifions quelques valeurs par défaut. Quelque soit le
controller, nous voulons que l'action index() soit appelée. Nous définissons
le paramètre jour (le quatrième élément dans l'URL) à null pour le marquer en
option.

Finalement, nous spécifions quelques expressions régulières qui vont
matcher les années, mois et jours sous forme numérique. Notez que les
parenthèses (le groupement) ne sont pas supportées dans les expressions
régulières. Vous pouvez toujours spécifier des alternatives, comme
dessus, mais ne pas grouper avec les parenthèses.

Une fois définie, cette route va matcher ``/articles/2007/02/01``,
``/posts/2004/11/16``, gérant les requêtes
pour les actions index() de ses controllers respectifs, avec les paramètres de
date dans ``$this->request->params``.

Il y a plusieurs éléments de route qui ont une signification spéciale dans
CakePHP, et ne devraient pas être utilisés à moins que vous souhaitiez
spécifiquement la signification.

* ``controller`` Utilisé pour nommer le controller pour une route.
* ``action`` Utilisé pour nommer l'action de controller pour une route.
* ``plugin`` Utilisé pour nommer le plugin dans lequel un controller est localisé.
* ``prefix`` Utilisé pour :ref:`prefix-routing`.
* ``_ext`` Utilisé pour le routing des :ref:`file-extensions`.
* ``_base`` Défini à false pour retirer le chemin de base de l'URL générée. Si
  votre application n'est pas dans le répertoire racine, cette option peut être
  utilisée pour générer les URLs qui sont 'liée à cake'.
  Les URLs liées à cake sont nécessaires pour utiliser requestAction.
* ``_scheme`` Défini pour créer les liens sur les schémas différents comme
  `webcal` ou `ftp`. Par défaut, au schéma courant.
* ``_host`` Définit l'hôte à utiliser pour le lien. Par défaut à l'hôte courant.
* ``_port`` Définit le port si vous avez besoin de créer les liens sur des ports
  non-standard.
* ``_full`` Si à true, la constante `FULL_BASE_URL` va être ajoutée devant les
  URLS générées.
* ``#`` Vous permet de définir les fragments de hash d'URL.
* ``ssl`` Défini à true pour convertir l'URL générée à https, ou false pour
  forcer http.

Passer des paramètres à l'action
--------------------------------

Quand vous connectez les routes en utilisant
:ref:`route-elements` vous voudrez peut-être que des éléments routés
soient passés aux arguments à la place. En utilisant le 3ème argument de
:php:meth:`Router::connect()`, vous pouvez définir quels éléments de route
doivent aussi être rendus disponibles en arguments passés::

    // SomeController.php
    public function view($articleId = null, $slug = null) {
        // du code ici...
    }

    // routes.php
    Router::connect(
        '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
        ['controller' => 'Blog', 'action' => 'view'].
        [
            // order matters since this will simply map ":id" to $articleId in your action
            'pass' => ['id', 'slug'],
            'id' => '[0-9]+'
        ]
    );

et maintenant, grâce aux possibilités de routing inversé, vous pouvez passer
dans le tableau d'URL comme ci-dessous et CakePHP sait comment former l'URL
comme définie dans les routes::

    // view.ctp
    // ceci va retourner un lien vers /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

.. _named-routes:

Utiliser les Routes Nommées
---------------------------

Parfois vous trouvez que taper tous les paramètres de l'URL pour une route est
trop verbeux, ou que vous souhaitiez tirer avantage des améliorations de la
performance que les routes nommées permettent. Lorque vous connectez les routes,
vous pouvez spécifier une option ``_name``, cette option peut être utilisée
pour le routing inversé pour identifier la route que vous souhaitez utiliser::

    // Connecter une route avec un nom.
    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Génère une URL en utilisant une route nommée.
    $url = Router::url('login');

    // Génère une URL en utilisant une route nommée,
    // avec certains args query string
    $url = Router::url('login', ['username' => 'jimmy']);

Si votre template de route contient des elements de route comme ``:controller``,
vous aurez besoin de fournir ceux-ci comme options de ``Router::url()``.

.. versionadded:: 3.0.0
    Les routes nommées ont été ajoutées dans 3.0.0

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix de routage
-----------------

De nombreuses applications nécessitent une section d'administration dans
laquelle les utilisateurs privilégiés peuvent faire des modifications.
Ceci est souvent réalisé grâce à une URL spéciale telle que
``/admin/users/edit/5``. Dans CakePHP, les préfixes de routage peuvent être
activés depuis le fichier de configuration du cœur en configurant les
préfixes avec Routing.prefixes. Les Prefixes peuvent être soit activés en
utilisant la valeur de configuration ``Routing.prefixes``, soit en définissant
la clé ``prefix`` avec un appel de ``Router::connect()``::

    Configure::write('Routing.prefixes', ['admin']);

Prefixes are mapped to sub-namespaces in your applications ``Controller``
namespace. By having prefixes as separate controllers you can create smaller,
simpler controllers. Behavior that is common to the prefixed and non-prefixed
controllers can be encapsulated using inheritance,
:doc:`/controllers/components`, or traits.  Using our users example, accessing
the URL ``/admin/users/edit/5`` would call the ``edit`` method of our
``App\Controller\Admin\UsersController`` passing 5 as the first parameter. The
view file used would be ``App/Template/Admin/Users/edit.ctp``

Vous pouvez faire correspondre l'URL /admin à votre action ``index``
du controller Pages en utilisant la route suivante::

    Router::connect(
        '/admin',
        ['controller' => 'Pages', 'action' => 'index', 'prefix' => 'admin']
    );

Vous pouvez aussi configurer le Router pour utiliser plusieurs préfixes.
En ajoutant des valeurs supplémentaires dans ``Routing.prefixes``. Si vous
définissez::

    Configure::write('Routing.prefixes', ['admin', 'manager']);

CakePHP va automatiquement générer les routes pour les deux prefixes admin et
manager. Chaque préfixe configuré va avoir les routes générées suivantes
pour cela::

    Router::connect("/{$prefix}/:plugin/:controller", ['action' => 'index', 'prefix' => $prefix]);
    Router::connect("/{$prefix}/:plugin/:controller/:action/*", ['prefix' => $prefix]);
    Router::connect("/{$prefix}/:controller", ['action' => 'index', 'prefix' => $prefix]);
    Router::connect("/{$prefix}/:controller/:action/*", ['prefix' => $prefix]);

De plus, le préfixe courant sera disponible à partir des méthodes du controller
avec ``$this->request->prefix``

Quand on utilise les routes préfixées, il est important de se rappeler qu'en
utilisant le helper HTML pour construire vos liens va aider à maintenir les
appels préfixés. Voici comment construire le lien en utilisant le helper HMTL::

    // Allez dans une route préfixée.
    echo $this->Html->link('Manage articles', ['prefix' => 'manager', 'controller' => 'Articles', 'action' => 'add']);

    // laissez un préfixe
    echo $this->Html->link('View Post', ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]);

.. index:: plugin routing

Routing des Plugins
-------------------

Le routage des Plugins utilise la clé **plugin**. Vous pouvez créer des liens
qui pointent vers un plugin, mais en ajoutant la clé plugin à votre tableau
d'URL::

    echo $this->Html->link('New todo', ['plugin' => 'todo', 'controller' => 'Todo_items', 'action' => 'create']);

Inversement, si la requête active est une requête de plugin et que vous
voulez créer un lien qui ne pointe pas vers un plugin, vous pouvez faire
ce qui suit::

    echo $this->Html->link('New todo', ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']);

En définissant ``plugin => null``, vous indiquez au Routeur que vous souhaitez
créer un lien qui n'est pas une partie d'un plugin.

.. index:: file extensions
.. _file-extensions:

Extensions de Fichier
---------------------

Pour manipuler différentes extensions de fichier avec vos routes, vous avez
besoin d'une ligne supplémentaire dans votre fichier de config des routes::

    Router::parseExtensions(['html', 'rss']);

Ceci indiquera au routeur de supprimer toutes extensions de fichiers
correspondantes et ensuite d'analyser ce qui reste.

Si vous voulez créer une URL comme /page/titre-de-page.html, vous devriez
créer votre route comme illustré ci-dessous::

    Router::connect(
        '/page/:title',
        ['controller' => 'Pages', 'action' => 'view'],
        [
            'pass' => ['title']
        ]
    );

Ensuite pour créer des liens qui s'adapteront aux routes, utilisez simplement::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

Les extensions de Fichier sont utilisées par
:php:class:`RequestHandlerComponent` pour faire automatiquement le changement
de vue basé sur les types de contenu. Regardez RequestHandlerComponent pour
plus d'informations.

.. _route-conditions:

Utiliser des conditions supplémentaires de correspondance des routes
--------------------------------------------------------------------

Quand vous créez des routes, vous souhaitez restreindre certaines URL basées
sur des configurations requête/environnement spécifique. Un bon exemple de
cela est le routing :doc:`rest`. Vous pouvez spécifier des conditions
supplémentaires dans l'argument ``$defaults`` pour
:php:meth:`Router::connect()`. Par défaut, CakePHP propose 3 conditions
d'environment, mais vous pouvez en ajouter plus en utilisant
:ref:`custom-route-classes`. Les options intégrées sont:

- ``[type]`` Seulement les requêtes correspondantes pour des types de contenu spécifiques.
- ``[method]`` Seulement les requêtes correspondantes avec des verbes HTTP spécifiques.
- ``[server]`` Correspond seuelement quand $_SERVER['SERVER_NAME'] correspond à la valeur donnée.

Nous allons fournir un exemple simple ici pour montrer comment vous pouvez
utiliser l'options ``[method]`` pour créer une route Restful personnalisée::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

La route ci-dessus va seulement correspondre aux requêtes ``PUT``. En utilisant
ces conditions, vous pouvez créer un routing REST personnalisé, ou d'autres
requêtes de données dépendant d'information.

.. index:: passed arguments
.. _passed-arguments:

Arguments passés
================

Les arguments passés sont des arguments supplémentaires ou des segments
du chemin qui sont utilisés lors d'une requête. Ils sont souvent utilisés
pour transmettre des paramètres aux méthodes de vos controllers.::

    http://localhost/calendars/view/recent/mark

Dans l'exemple ci-dessus, ``recent`` et ``mark`` tous deux des arguments passés
à ``CalendarsController::view()``. Les arguments passés sont transmis aux
contrôleurs de trois manières. D'abord comme arguments de la méthode de
l'action appelée, deuxièmement en étant accessibles dans
``$this->request->params['pass']`` sous la forme d'un tableau indexé
numériquement. Enfin, il y a ``$this->passedArgs`` disponible de la même
façon que la deuxième façon. Lorsque vous utilisez des routes personnalisées
il est possible de forcer des paramètres particuliers comme étant des
paramètres passés également. Voir passer des paramètres à une action pour plus
d'informations.

Si vous alliez visiter l'URL mentionné précédemment, et que vous aviez une
action de controller qui ressemblait à cela::

    CalendarsController extends AppController{
        public function view($arg1, $arg2) {
            debug(func_get_args());
        }
    }

Vous auriez la sortie suivante::

    Array
    (
        [0] => recent
        [1] => mark
    )

La même donnée est aussi disponible dans ``$this->request->params['pass']``
et dans ``$this->passedArgs`` dans vos controllers, vues, et helpers.
Les valeurs dans le tableau pass sont indicées numériquement basé sur l'ordre
dans lequel elles apparaissent dans l'URL appelé::

    debug($this->request->params['pass']);
    debug($this->passedArgs); 

Les deux du dessus sortiraient::

    Array
    (
        [0] => recent
        [1] => mark
    )

Quand vous générez des URLs, en utilisant un :term:`tableau routing`, vous
ajoutez des arguments passés en valeurs sans clés de type chaîne dans le
tableau::

    ['controller' => 'Articles', 'action' => 'view', 5]

Comme ``5`` a une clé numérique, il est traité comme un argument passé.

Routing inversé
===============

Le routing inversé est une fonctionnalité dans CakePHP qui est utilisée pour
vous permettre de changer facilement votre structure d'URL sans avoir à
modifier tout votre code. En utilisant
:term:`routing arrays <tableau routing>` pour définir vos URLs, vous pouvez
configurer les routes plus tard et les URLs générés vont automatiquement
être mises à jour.

Si vous créez des URLs en utilisant des chaînes de caractères comme::

    $this->Html->link('View', '/posts/view/' + $id);

Et ensuite plus tard, vous décidez que ``/posts`` devrait vraiment être
appelé 'articles' à la place, vous devrez aller dans toute votre application
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
    
    // va générer une URL comme.
    /articles/index?page=1#top

Router will also convert any unknown parameters in a routing array to
querystring parameters.  The ``?`` is offered for backwards compatibility with
older versions of CakePHP.

Improving Performance of Routing
--------------------------------

After connecting many routes, or if you're reverse routing a higher than average
number of URL's generating URL's can start representing a measurable amout of
time.  The easiest way to address this issue is to use :ref:`named-routes`.
Using named routes dramatically changes the internal performance of finding
matching routes.  Instead of a linear search through a subset of routes, a
single route is fetched and used for generating a URL.

.. _redirect-routing:

Rediriger le Routing
====================

Rediriger le routing vous permet de délivrer des redirections à l'état HTTP
30x pour les routes entrantes, et les pointent aux différentes URLs. Ceci
est utilisé quand vous voulez informer les applications clientes qu'une
ressource a été déplacée et que vous ne voulez pas avoir deux URLs pour le
même contenu.

Les routes de redirection sont différentes des routes normales puisqu'elles
effectuent une redirection du header actuel si une correspondance est trouvée.
La redirection peut survenir vers une destination dans votre application
ou une localisation en-dehors::

    Router::redirect(
        '/home/*', 
        ['controller' => 'Articles', 'action' => 'view'], 
        ['persist' => true] // ou ['persist' => ['id']] pour un routing par défaut où la vue de l'action attend un argument $id
    );

Redirige ``/home/*`` vers ``/articles/view`` et passe les paramètres vers
``/articles/view``. Utiliser un tableau en une destination de redirection
vous permet d'utiliser d'autres routes pour définir où une chaîne URL
devrait être redirigée. Vous pouvez rediriger vers des localisations
externes en utilisant les chaînes URLs en destination::

    Router::redirect('/articles/*', 'http://google.com', ['status' => 302]);

Cela redirigerait ``/articles/*`` vers ``http://google.com`` avec un état statut
HTTP à 302.

.. _disabling-default-routes:

Désactiver les routes par défaut
================================

Si vous avez complètement personnalisé toutes les routes, et voulez éviter
toute pénalité de contenu dupliqué possible des moteurs de recherche, vous
pouvez retirer les routes par défaut que CakePHP offre en les supprimant
de votre fichier d'application routes.php.

Cela fera en sorte que CakePHP serve les erreurs, quand les utilisateurs
essaient de visiter les URLs qui seraient normalement fournies par CakePHP mais
n'ont pas été connectée explicitement.

.. _custom-route-classes:

Classes de Route personnalisées
===============================

Les classes de route personnalisées vous permettent d'étendre et de modifier la
façon dont certaines routes parsent les demandes et de traiter le routing
inversé. Une classe personnalisée de route doit étendre
:php:class:`Cake\\Routing\\Route` et mettre en œuvre un ou les deux ``match()``
et/ou ``parse()``. ``parse()`` est utilisée pour
analyser les demandes et correspondance et ``match()`` est utilisée pour
traiter les routes inversées.

Vous pouvez utiliser une classe de route personnalisée lors d'un création
d'une route à l'aide des options de la classe ``routeClass``, et en chargeant
le fichier contenant votre routes avant d'essayer de l'utiliser::

    App::uses('SlugRoute', 'Routing/Route');

    Router::connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

Cette route créerait une instance de ``SlugRoute`` et vous permet
d'implémenter la gestion de paramètre personnalisée.

Gérer les Paramètres Nommés dans les URLs
=========================================

Although named parameters were removed in CakePHP 3.0, applications may have
published URLs containing them.  You can continue to accept URLs containing
named parameters.

In your controller's ``beforeFilter()`` method you can call
``parseNamedParams()`` to extract any named parameters from the passed
arguments::

    public function beforeFilter() {
        parent::beforeFilter();
        Router::parseNamedParams($this->request);
    }

This will populate ``$this->request->params['named']`` with any named parameters
found in the passed arguments.  Any passed argument that was interpreted as a
named parameter, will be removed from the list of passed arguments.

API du Router
=============

.. php:namespace:: Cake\Routing

.. php:class:: Router

    Le Router gère la génération des URLs sortants, et le parsing de la
    requête URL entrante dans les ensembles de paramètre que CakePHP
    peut dispatcher.

.. php:staticmethod:: connect($route, $defaults = [], $options = [])
    
    :param string $route: Une chaîne décrivant le template de la route.
    :param array $defaults: Un tableau décrivant les paramètres de la route
        par défaut. Ces paramètres seront utilisés par défaut et peuvent
        fournir des paramètres de routing qui ne sont pas dynamiques.
    :param array $options: Un tableau matchant les éléments nommés dans la
        route aux expressions régulières avec lesquels cet élément devrait
        correspondre. Contient aussi des paramètres supplémentaires comme
        les paramètres routés doivent être passés dans les arguments passés,
        en fournissant les patterns pour les paramètres de routing et fournir
        le nom d'une classe de routing personnalisée.

    Les routes ont une façon de connecter les requêtes URLs aux objets dans
    votre application. Dans les routes du coeur, il y a un ensemble
    d'expressions régulières qui sont utilisées pour matcher les requêtes
    aux destinations.
    
    Exemples::
    
        Router::connect('/:controller/:action/*');
    
    Le premier paramètre va être utilisé comme nom de controller alors que
    le second est utilisé en nom d'action. La syntaxe '/\*' rend cette route
    greedy puisqu'elle ca matcher les requêtes comme `/posts/index` ainsi que
    les requêtes comme ``/posts/edit/1/foo/bar`` .::
    
        Router::connect('/home-page', ['controller' => 'Pages', 'action' => 'display', 'home']);
    
    Ce qui est au-dessus montre l'utilisation d'un paramètre de route par
    défaut. Et fournit les paramètres de routing pour une route statique.::
    
        Router::connect(
            '/:lang/:controller/:action/:id',
            [],
            ['id' => '[0-9]+', 'lang' => '[a-z]{3}']
        );
    
    Montre la connexion d'une route avec les paramètres de route personnalisé
    ainsi que fournit les patterns pour ces paramètres. Les patterns pour les
    paramètres de routing n'ont pas besoin de capturer les groupes, puisque
    l'un d'eux sera ajouté pour chaque paramètre de route.
    
    $options propose trois clés 'special'. ``pass``, ``persist`` et
    ``routeClass`` ont une signification spéciale dans le tableau
    $options.
    
    * ``pass`` est utilisé pour définir lesquels des paramètres routés devrait
      être passé dans le tableau pass. Ajouter un paramètre à pass le retirera
      du tableau de route régulière. Ex. ``'pass' => array('slug')``.
    
    * ``persist`` est utilisé pour définir lesquels des paramètres de route
      devrait être automatiquement inclus quand on génére les nouvels URLs.
      Vous pouvez écraser les paramètres persistentes en les redéfinissant
      dans une URL ou les retirer en configurant le paramètre à ``false``.
      Ex. ``'persist' => array('lang')``.

    * ``routeClass`` est utilisé pour étendre et changer la façon dont les
      routes individuelles parsent les requêtes et gèrent le routing inversé,
      via une classe de routing personnalisée.
      Ex. ``'routeClass' => 'SlugRoute'``.
    
.. php:staticmethod:: redirect($route, $url, $options = [])

    :param string $route: Un template de route qui dicte quels URLs devraient
        être redirigées.
    :param mixed $url: Soit un :term:`tableau routing`, soit une chaîne URL
        pour la  destination du redirect.
    :param array $options: Un tableau d'options pour le redirect.

    Connecte une nouvelle redirection de Route dans le routeur.
    Regardez :ref:`redirect-routing` pour plus d'informations.

.. php:staticmethod:: promote($which = null)
    
    :param integer $which: Un indice de tableau à 0 représentant la route
        à déplacer. Par exemple, si 3 routes ont été ajoutée, la dernière
        route serait 2.

    Favorise une route (par défaut, le dernier ajouté) au début de la liste.

.. php:staticmethod:: url($url = null, $full = false)

    :param mixed $url: Une URL relative à Cake, comme "/products/edit/92" ou
        "/presidents/elect/4" ou un :term:`tableau routing`.
    :param mixed $full: Si (boolean) à true, l'URL entière sera précédée
        au résultat. Si un tableau accepte les clés suivantes. Si utilisé avec
        une route nommée, vous pouvez fournir une liste de paramètres en
        query string.

    Génére une URL pour l'action spécfiée. Retourne une URL pointant vers
    une combinaison de controller et d'action. $url peut être:

    Il y a quelques paramètres 'spéciaux' qui peuvent changer la chaîne d'URL
    finale qui est générée:

    * ``_base`` - défini à false pour retirer le chemin de base à partir
      d'URL générée. Si votre application n'est pas le répertoire root, ceci
      peut être utilisé pour générer les URLs qui sont 'cake relative'. Les
      URLs CakePHP relative sont nécessaires quand on utilise requestAction.
    * ``_scheme`` - Set to create links on different schemes like ``webcal`` or ``ftp``. Defaults
      to the current scheme.
    * ``_host`` - Set the host to use for the link.  Defaults to the current host.
    * ``_port`` - Set the port if you need to create links on non-standard ports.
    * ``_full`` - If true the value of :php:meth:`Router::baseUrl` will be prepended to generated URLs.
    * ``#`` - Allows you to set URL hash fragments.
    * ``ssl`` - Set to true to convert the generated URL to https, or false to force http.

.. php:staticmethod:: mapResources($controller, $options = [])

    Crée les routes de ressource REST pour les controller(s) donné. Regardez
    la section :doc:`/development/rest` pour plus d'informations.

.. php:staticmethod:: parseExtensions(string|array $extensions, $merge = true)

    Utilisé dans routes.php pour déclarer quelle :ref:`file-extensions` de
    votre application supporte.

.. php:staticmethod:: defaultRouteClass($classname)

    Définit la route par défaut à utiliser quand on connecte les routes
    dans le futur.

.. php:staticmethod:: fullBaseUrl($url = null)

    Récupère ou définit la baseURL utilisée pour la génération d'URLs. Quand
    vous définissez cette valeur, vous devez vous assurer d'inclure le nom de
    domaine complètement compétent en incluant le protocole.

    Définir les valeurs avec cette méthode va aussi mettre à jour
    ``App.fullBaseUrl`` dans :php:class:`Cake\\Core\\Configure`.

.. php:class:: Route

    La classe de base pour les routes personnalisées sur laquelle on se base.

.. php:method:: parse($url)

    :param string $url: La chaîne URL à parser.
    
    Parse une URL entrante, et génére un tableau de paramètres requêtés sur
    lequel le Dispatcher peut agir. Etendre cette méthode vous permet de
    personnaliser comment les URLs entrantes sont converties en un tableau.
    Retourne ``false`` à partir d'une URL pour indiquer un échec de match.

.. php:method:: match($url, $context = [])

    :param array $url: Le tableau de routing pour convertir dans une chaîne URL.
    :param array $context: An array of the current request context.
        Contains information such as the current host, scheme, port, and base
        directory.
    
    Tente de matcher un tableau URL. Si l'URL matche les paramètres de route
    et les configurations, alors retourne une chaîne URL générée. Si l'URL ne
    match pas les paramètres de route, false sera retourné. Cette méthode gère
    le routing inversé ou la conversion de tableaux d'URL dans des chaînes URLs.

    .. versionchanged:: 3.0
        The ``$context`` parameter was added to support new routing features.

.. php:method:: compile()

    Forcer une route à compiler son expression régulière.

.. php:trait:: RequestActionTrait

    This trait allows classes which include it to create sub-requests or
    request actions.

.. php:method:: requestAction(string $url, array $options)

    This function calls a controller's action from any location and
    returns data from the action. The ``$url`` passed is a
    CakePHP-relative URL (/controllername/actionname/params). To pass
    extra data to the receiving controller action add to the $options
    array.

    .. note::

        You can use ``requestAction()`` to retrieve a fully rendered view
        by passing 'return' in the options:
        ``requestAction($url, ['return']);``. It is important to note
        that making a requestAction using 'return' from a controller method
        can cause script and css tags to not work correctly.

    .. warning::

        If used without caching ``requestAction`` can lead to poor
        performance. It is seldom appropriate to use in a controller.

    ``requestAction`` is best used in conjunction with (cached)
    elements – as a way to fetch data for an element before rendering.
    Let's use the example of putting a "latest comments" element in the
    layout. First we need to create a controller function that will
    return the data::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (!$this->request->is('requested')) {
                    throw new ForbiddenException();
                }
                return $this->Comments->find('all', [
                    'order' => 'Comment.created DESC',
                    'limit' => 10
               ]);
            }
        }

    You should always include checks to make sure your requestAction methods are
    actually originating from ``requestAction``.  Failing to do so will allow
    requestAction methods to be directly accessible from a URL, which is
    generally undesirable.

    If we now create a simple element to call that function::

        // View/Element/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment->title;
        }

    We can then place that element anywhere to get the output
    using::

        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request
    will be made to the controller to get the data, the data will be
    processed, and returned. However in accordance with the warning
    above it's best to make use of element caching to prevent needless
    processing. By modifying the call to element to look like this::

        echo $this->element('latest_comments', [], ['cache' => '+1 hour']);

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction now takes array based cake style URLs::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'featured'],
            ['return']
        );

    The URL based array are the same as the ones that :php:meth:`HtmlHelper::link()`
    uses with one difference - if you are using passed parameters, you must put them
    in a second array and wrap them with the correct key. This is because
    requestAction merges the extra parameters (requestAction's 2nd parameter)
    with the ``request->params`` member array and does not explicitly place them
    under the ``pass`` key. Any additional keys in the ``$option`` array will
    be made available in the requested action's ``request->params`` property::

        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'view', 5],
        );

    You can also pass querystring arguments, post data or cookies using the
    appropriate keys. Cookies can be passed using the ``cookies`` key.
    Get parameters can be set with ``query`` and post data can be sent
    using the ``post`` key::

        $vars = $this->requestAction('/articles/popular', [
          'query' => ['page' = > 1],
          'cookies' => ['remember_me' => 1],
        ]);

    .. note::

        Unlike other places where array URLs are analogous to string URLs,
        requestAction treats them differently.

    When using an array URL in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, passed arguments must be done
    in the second array as seen above.


.. meta::
    :title lang=fr: Routing
    :keywords lang=fr: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,routeur,router
