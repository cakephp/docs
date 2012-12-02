Routing
#######

Routing est une fonctionnalité qui mappe les URLs aux actions du controller. 
Elle a été ajoutée à CakePHP pour rendre les URLs belles et plus configurables 
et flexibles. L'utilisation du mod\_rewrite de Apache n'est pas necéssaire pour 
utiliser les routes, mais cela rendra votre barre d'adresse beaucoup plus 
élégante.

Le Routing dans CakePHP englobe aussi l'idée de routing inversé,
où un tableau de paramètres peut être inversé en une chaîne url.
En utilisant le routing inversé, vous pouvez facilement reconstruire votre 
structure d'url des applications sans avoir mis à jour tous vos codes.

.. index:: routes.php

.. _routes-configuration:

Configuration des Routes
========================

Les Routes dans une application sont configurées dans ``app/Config/routes.php``.
Ce fichier est inclu par le :php:class:`Dispatcher` quand on gère les routes et 
vous permet de définir des routes spécifiques d'application que vous voulez 
utiliser. Les Routes déclarées dans ce fichier sont traitées de haut en bas 
quand les requêtes entrantes correspondent. Cela signifie que l'ordre dans 
lequel vous placez les routes peuvent affecter comment les routes sont parsées. 
C'est généralement une bonne idée de placer les routes visitées le plus 
fréquemment en haut du fichier de routes si possible. Cela va permettre de 
ne pas à avoir à vérifier un certain nombre de routes qui ne correspondront 
pas à chaque requête.

Les Routes sont parsées et matchées dans l'ordre dans lequel elles sont 
connectées. Si vous définissez deux routes similaires, la première route 
définie va avoir une priorité plus haute sur celle définie plus tard. Après 
avoir connecté les routes, vous pouvez manipuler l'ordre des routes en 
utilisant :php:meth:`Router::promote()`.

CakePHP vient aussi avec quelques routes par défaut pour commencer. Celles-ci 
peuvent être désactivées plus tard une fois que vous êtes sûr que vous n'en 
aurez pas besoin. Regardez :ref:`disabling-default-routes` sur la façon de 
désactiver le routing par défaut.


Routing par défaut
==================

Avant que vous appreniez à configurer vos propres routes, vous devez savoir 
que CakePHP arrive configuré avec un ensemble de routes par défaut.
Le routing de CakePHP par défaut va vous faire aller assez loin dans toute 
application. Vous pouvez accéder à une action directement par l'URL en 
mettant son nom dans la requête. Vous pouvez aussi passer des paramètres aux 
actions de votre controller en utilisant l'URL.::

        pattern URL des routes par défaut: 
        http://example.com/controller/action/param1/param2/param3

L'URL /posts/view mappe à l'action view() de 
PostsController, et /products/view\_clearance mappe vers l'action 
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
dans le fichier ``app/Config/routes.php`` en utilisant la méthode 
:php:meth:`Router::connect()`.

La méthode ``connect()`` prend trois paramètres: l'URL que vous souhaitez 
faire correspondre, les valeurs par défaut pour les éléments de votre 
route, et les règles d'expression régulière pour aider le router à 
faire correspondre les éléments dans l'URL.

Le format basique pour une définition de route est::

    Router::connect(
        'URL',
        array('default' => 'defaultValue'),
        array('option' => 'matchingRegex')
    );

Le premier paramètre est utilisé pour dire au router quelle sorte d'URL 
vous essayez de contrôler. L'URL est une chaîne normale délimitée par 
des slashes, mais peut aussi contenir une wildcard (\*) ou 
:ref:`route-elements`. Utiliser une wildcard dit au router que vous êtes prêt 
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
        array('controller' => 'pages', 'action' => 'display')
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
        array('controller' => 'pages', 'action' => 'show')
    );

L'URL entrante de ``/pages/the-example-/-and-proof`` résulterait en un argument 
unique passé de ``the-example-/-and-proof``.

.. versionadded:: 2.1

    L'étoile double trailing a été ajoutée dans 2.1.

Vous pouvez utiliser le deuxième paramètre de :php:meth:`Router::connect()`
pour fournir tout paramètre de routing qui est composé des valeurs par défaut 
de la route::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

Cet exemple montre comment vous pouvez utilisez le deuxième paramètre de 
``connect()`` pour définir les paramètres par défaut. Si vous construisez un 
site qui propose des produits pour différentes catégories de clients, vous 
pourriez considérer la création d'une route. Cela vous permet de vous lier 
à ``/government`` plutôt qu'à ``/pages/display/5``.

.. note::
    
    Bien que vous puissiez connecter des routes alternatives, les routes par 
    défaut vont continuer à fonctionner. Ceci pourrait créer des situations, 
    où le contenu pourrait finir avec 2 urls. Regardez 
    :ref:`disabling-default-routes` pour désactiver les routes par défaut, 
    et fournir seulement les urls que vous définissez.

Une autre utilisation ordinaire pour le Router est de définir un "alias" pour 
un controller. Disons qu'au lieu d'accéder à notre URL régulière à 
``/users/some_action/5``, nous aimerions être capable de l'accéder avec 
``/cooks/some_action/5``. La route suivante s'occupe facilement de cela::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users')
    );

Cela dit au Router que toute url commençant par ``/cooks/`` devrait être 
envoyée au controller users. L'action appelée dépendra de la valeur du 
paramètre ``:action``. En utilisant :ref:`route-elements`, vous pouvez 
créer des routes variables, qui accèptent les entrées utilisateur ou les 
variables. La route ci-dessus utilise aussi l'étoile greedy.
L'étoile greedy indique au :php:class:`Router` que cette route devrait 
accepter tout argument de position supplémentaire donné. Ces arguments 
seront rendus disponibles dans le tableau :ref:`passed-arguments`.

Quand on génére les urls, les routes sont aussi utilisées. Utiliser 
``array('controller' => 'users', 'action' => 'some_action', 5)`` en 
url va sortir /cooks/some_action/5 si la route ci-dessus est la 
première correspondante trouvée.

Si vous pensez utiliser des arguments nommés personnalisés avec votre route, 
vous devrez avertir le router de cela en utilisant la fonction 
:php:meth:`Router::connectNamed()`. Donc si vous voulez que la route ci-dessus 
matchent les urls comme ``/cooks/some_action/type:chef``, nous faisons::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users')
    );

.. _route-elements:

Les éléments de Route
---------------------

Vous pouvez spécifier vos propres éléments de route et ce faisant 
cela vous donne le pouvoir de définir des places dans l'URL où les 
paramètres pour les actions du controller devraient reoposer. Quand 
une requête est faîte, les valeurs pour ces éléments de route sont 
trouvés dans ``$this->request->params`` dans le controller. 
Ceci est différent de la façon dont les paramètres sont gérés, donc notez 
la différence: les paramètres nommés (/controller/action/name:value) sont 
trouvés dans ``$this->request->params['named']``, alors que la donnée de 
l'élément de route personnalisé est trouvé dans ``$this->request->params``. 
quand vous définissez un élément de route personnalisé, vous pouvez 
spécifier en option une expression régulière - cela dit à CakePHP comment 
savoir si l'URL est correctement formée ou non. Si vous choisissez de ne 
pas fournir une expression régulière, toute expression non ``/`` sera 
traitée comme une partie du paramètre::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

Cet exemple simple montre comment créer une manière rapide de voir les models 
à partir de tout controller en élaborant une URL qui ressemble à 
``/controllername/:id``. L'URL fourni à connect() spécifie deux éléments de 
route: ``:controller`` et ``:id``. L'élément ``:controller`` est l'élément de 
route par défaut de CakePHP, donc le router sait comment matcher et identifier 
les noms de controller dans les URLs. L'élément ``:id`` est un élément de route 
personnalisé, et doit être clarifié plus loin en spécifiant une expression 
régulière correspondante dans le troisième paramètre de connect().

.. note::

    Les Patterns utilisés pour les éléments de route ne doivent pas contenir 
    de groupes capturés. Si ils le font, le Router ne va pas fonctionner 
    correctement.

Une fois que cette route a été définie, requêtant ``/apples/5`` est la même 
que celle requêtant ``/apples/view/5``. Les deux appeleraient la méthode view() 
de ApplesController. A l'intérieur de la méthode view(), vous aurez besoin 
d'accéder à l'ID passé à ``$this->request->params['id']``.

Si vous avez un unique controller dans votre application et que vous ne ne 
voulez pas que le nom du controller apparaisse dans l'url, vous pouvez mapper 
tous les urls aux actions dans votre controller. Par exemple, pour mapper 
toutes les urls aux actions du controller ``home``, par ex avoir des urls 
comme ``/demo`` à la place de ``/home/demo``, vous pouvez faire ce qui suit::

    Router::connect('/:action', array('controller' => 'home')); 

Un exemple de plus, et vous serez un routing pro::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

C'est assez complexe, mais montre comme les routes peuvent vraiment 
devenir puissantes. L'URL fourni a quatre éléments de route. Le premier 
nous est familier: c'est une route par défaut qui dit à CakePHP d'attendre 
à un nom de controller.

Ensuite, nous spécifions quelques valeurs par défaut. Quelque soit le 
controller, nous voulons que l'action index() soit appelée. Nous définissons 
le paramètre jour (le quatrième élément dans l'URL) à null pour le marquer en 
option.

Finalement, nous spécifions quelques expressions régulières qui vont 
matcher les années, mois et jours sous forme numérique. Notez que les 
parenthèses (le groupement) ne sont pas supportées dans les expressions 
régulières. Vous pouvez toujoues spécifier des alternatives, comme 
dessus, mais ne pas grouper avec les parenthèses.

Une fois défini, cette route va matcher ``/articles/2007/02/01``,
``/posts/2004/11/16``, et ``/products/2001/05`` (comme défini, le paramètre 
jour est optionnel puisqu'il a une valeur par défaut), gérant les requêtes 
pour les actions index() de ses controllers respectifs, avec les paramètres de 
date dans ``$this->request->params``.

Il y a plusieurs éléments de route qui ont une signification spéciale dans 
CakePHP, et ne devraient pas être utilisés à moins que vous souhaitiez la 
signification spéciale.

* ``controller`` Utilisé pour nommer le controller pour une route.
* ``action`` Utilisé pour nommer l'action de controller pour une route.
* ``plugin`` Utilisé pour nommer le plugin dans lequel un controller est localisé.
* ``prefix`` Utilisé pour :ref:`prefix-routing`
* ``ext`` Utilisé pour le routing :ref:`file-extensions`.

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
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // order matters since this will simply map ":id" to $articleId in your action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

et maintenant, grâce aux possibilités de routing inversé, vous pouvez passer 
dans le tableau d'url comme ci-dessous et Cake sait comment former l'URL comme 
définie dans les routes::

    // view.ctp
    // cela va retourner un lien vers /blog/3-CakePHP_Rocks
    <?php echo $this->Html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    )); ?>

Paramètres nommées Per-route
----------------------------

Alors que vous pouvez contrôler les paramètres nommés à une grande échelle 
en utilisant :php:meth:`Router::connectNamed()`, vous pouvez aussi contrôler 
le comportement des paramètres nommés au niveau de la route en utilisant 
le 3ème argument de ``Router::connect()``::

    Router::connect(
        '/:controller/:action/*',
        array(),
        array(
            'named' => array(
                'wibble',
                'fish' => array('action' => 'index'),
                'fizz' => array('controller' => array('comments', 'other')),
                'buzz' => 'val-[\d]+'
            )
        )
    );

La définition de la route ci-dessus utilise la clé ``named`` pour définir 
comment plusieurs paramètres nommés devraient être traitées. Regardons 
chacune des règles différentes une par une:

* 'wibble' n'a pas d'information en plus. Cela signifie qu'il va toujours 
  parser si il est trouvé dans une url matchant cette route.
* 'fish' a un tableau de conditions, contenant la clé 'action'. Cela signifie 
  que fish va être seulement parsé en paramètre nommé si l'actoin est aussi 
  indicée.
* 'fizz' a aussi un tableau de conditions. Cependant, il contient deux 
  controllers, cela signifie que 'fizz' va seulement être parsé si le 
  controller matche un des noms dans le tableau.
* 'buzz' a une condition de type chaîne de caractères. Les conditions en chaîne 
  sont traitées comme des fragments d'expression régulière. Seules les valeurs 
  pour buzz matchant le pattern vont petre parsées.

Si un paramètre nommé est utilisé et qu'il ne matche pas le critère fourni, il 
sera traité comme un argument passé au lieu d'un paramètre nommé.

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix de routage
-----------------

De nombreuses applications nécessitent une section d'administration dans 
laquelle les utilisateurs privilégiés peuvent faire des modifications. 
Ceci est souvent réalisé grâce à une URL spéciale telle que 
``/admin/users/edit/5``. Dans CakePHP, les préfixes de routage peuvent être 
activés depuis le fichier de configuration du cœur en configurant les 
préfixes avec Routing.prefixes. Notez que les prefixes, bien que liés 
au router sont configurés dans ``app/Config/core.php``::

    Configure::write('Routing.prefixes', array('admin'));

Dans votre controller, toute action avec le préfixe ``admin_`` sera appelée. 
En utilisant notre exemple des users, accéder à l'url 
``/admin/users/edit/5`` devrait appeler la méthode ``admin_edit``
de notre ``UsersController`` en passant 5 comme premier paramètre. 
Le fichier de vue correspondant devra être 
``app/View/Users/admin\_edit.ctp``

Vous pouvez faire correspondre l'url /admin à votre action ``admin_index`` 
du controller Pages en utilisant la route suivante::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

Vous pouvez aussi configurer le Router pour utiliser de multiples prefixes. 
En ajoutant des valeurs supplémentaires dans ``Routing.prefixes``. Si vous 
définissez::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

Cake va automatiquement générer les routes pour les deux prefixes admin et 
manager. Chaque préfixe configuré va avoir les routes générées suivantes 
pour cela::

    Router::connect("/{$prefix}/:plugin/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:plugin/:controller/:action/*", array('prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller/:action/*", array('prefix' => $prefix, $prefix => true));

Un peu comme le routing admin, toutes les actions préfixées doivent être 
préfixées avec le nom du préfixe. Ainsi ``/manager/posts/add`` map vers
``PostsController::manager_add()``.

En plus, le préfixe courant sera disponible à partir des méthodes du controller 
avec ``$this->request->prefix``

Quand on utilise les routes préfixées, il est important de se rappeler qu'en 
utilisant le helper HTML pour construire vos liens va aider à maintenir les 
appels préfixés. Voici comment construire le lien en utilisant le helper HMTL::

    // Allez dans une route préfixée.
    echo $html->link('Manage posts', array('manager' => true, 'controller' => 'posts', 'action' => 'add'));

    // laissez un préfixe
    echo $html->link('View Post', array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5));

.. index:: plugin routing

Routing des Plugins
-------------------

Le routage des Plugins utilise la clé **plugin**. Vous pouvez créer des liens 
qui pointent vers un plugin, mais en ajoutant la clé plugin à votre tableau 
d'url::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Inversement, si la requête active est une requête de plugin et que vous 
voulez créer un lien qui ne pointe pas vers un plugin, vous pouvez faire 
ce qui suit::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

En définissant ``plugin => null``, vous indiquez au Routeur que vous souhaitez 
créer un lien qui n'est pas une partie d'un plugin.

.. index:: file extensions
.. _file-extensions:

Extensions de Fichier
---------------------

Pour manipuler différentes extensions de fichier avec vos routes, vous avez 
besoin d'une ligne supplémentaire dans votre fichier de config des routes::

    Router::parseExtensions('html', 'rss');

Ceci indiquera au routeur de supprimer toutes extensions de fichiers 
correspondantes et ensuite d'analyser ce qui reste.

Si vous voulez créer une URL comme /page/titre-de-page.html, vous devriez 
créer votre route comme illustré ci-dessous::

    Router::connect(
        '/page/:title',
        array('controller' => 'pages', 'action' => 'view'),
        array(
            'pass' => array('title')
        )
    );

Ensuite pour créer des liens qui s'adapteront aux routes utilisez simplement::

    $html->link(
        'Link title', 
        array('controller' => 'pages', 'action' => 'view', 'title' => 'super-article', 'ext' => 'html')
    );

Les extensions de Fichier sont utilisées par 
:php:class:`RequestHandlerComponent` pour faire automatiquement le changement 
de vue basé sur les types de contenu. Regardez RequestHandlerComponent pour 
plus d'informations.

.. index:: passed arguments
.. _passed-arguments:

Arguments passés
================

Les arguments passés sont des arguments additionnels ou des segments 
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
paramètres passés égalements. Voir passer des paramètres à une action pour plus 
d'informations.

Si vous alliez visiter l'url mentionné précédemment, et que vous avez une 
action de controller qui ressmeblerait à cela::

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
dans lequel elles apparaissent dans l'url appelé.

::

    debug($this->request->params['pass']);
    debug($this->passedArgs); 

Les deux du dessus sortiraient::

    Array
    (
        [0] => recent
        [1] => mark
    )

.. note::

    $this->passedArgs peut aussi contenir des paramètres nommés comme tableau 
    mixte nommé avec des arguments passés.

Quand vous générez des urls, en utilisant un :term:`tableau routing`, vous 
ajoutez des arguments passés en valeurs sans clés de type chaîne dans le 
tableau::

    array('controller' => 'posts', 'action' => 'view', 5)

Comme ``5`` a une clé numérique, il est traité comme un argument passé.

.. index:: named parameters

.. _named-parameters:

Paramètres nommés
=================

Vous pouvez nommer les paramètres et envoyer leurs valeurs en utilisant l'URL. 
Une requête pour ``/posts/view/title:first/category:general`` résultera en 
un appel à l'action view() du controller PostsController. Dans cette action, 
vous trouverez les valeurs des paramètres "title" et "category" 
dans ``$this->params['named']``. Vous pouvez également accéder 
aux paramètres nommés depuis ``$this->passedArgs``. Dans les deux cas, vous 
pouvez accéder aux paramètres nommés en utilisant leur nom en index. Si les 
paramètres nommés sont omis, ils ne seront pas définis.

Quelques exemples de routes par défaut seront plus parlants.

.. note::

    Ce qui est parsé en paramètre nommé est contrôlé par 
    :php:meth:`Router::connectNamed()`. Si vos paramètres nommés ne sont pas 
    du routing inversé, ou ne sont pas parsés correctement, vous aurez besoin 
    d'informer :php:class:`Router` sur eux.

Quelques exemples pour résumer les routes par défaut peuvent prouver leur aide::

    URL vers le mapping de l'action du controller utilisant les routes par défaut:  

    URL: /monkeys/jump
    Mapping: MonkeysController->jump();

    URL: /products
    Mapping: ProductsController->index();

    URL: /tasks/view/45
    Mapping: TasksController->view(45);

    URL: /donations/view/recent/2001
    Mapping: DonationsController->view('recent', '2001');

    URL: /contents/view/chapter:models/section:associations
    Mapping: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';
    $this->params['named']['chapter'] = 'models';
    $this->params['named']['section'] = 'associations';

Lorsque l'on fait des routes personnalisées, un piège classique est 
d'utiliser des paramètres nommés qui casseront vos routes. Pour résoudre 
cela vous devez informer le Router des paramètres qui sont censés être 
des paramètres nommés. Sans cette information le Router est incapable de 
déterminer si les paramètres nommés doivent en effet être des paramètres 
nommés ou des paramètres à router, et supposera par défaut que ce sont des 
paramètres à router. Pour connecter des paramètres nommés dans le routeur 
utilisez :php:meth:`Router::connectNamed()`::

    Router::connectNamed(array('chapter', 'section'));

Va s'assurer que votre chapitre et les paramètres de section inversent les 
routes correctement.

Quand vous générez les urls, en utilisant un :term:`tableau routing`, vous 
ajoutez les paramètres nommés en valeurs avec les clés en chaîne matchant 
le nom::

    array('controller' => 'posts', 'action' => 'view', 'chapter' => 'association')

Puisque 'chapter' ne matche aucun élément de route défini, il est traité en 
paramètre nommé.

.. note::

    Les deux paramètres nommés et les éléments de route partagent le même 
    espace-clé. Il est mieux d'éviter de réutiliser une clé pour les deux, 
    élément de route et paramètre nommé.

Les paramètres nommés supportent aussi l'utilisation de tableaux pour 
générer et parser les urls. La syntaxe fonctionne de façon très similaire à 
la syntaxe de tableau utilisé pour les paramètres GET. Quand vous générez les 
urls, vous pouvez utiliser la syntaxe suivante::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        'filter' => array(
            'published' => 1
            'frontpage' => 1
        )
    ));

Ce qui est au-dessus générerait l'url 
``/posts/index/filter[published]:1/filter[frontpage]:1``. Les paramètres 
sont ensuite parsés et stockés dans la variable passedArgs de votre 
controller en tableai, de la même façon que vous les envoyez au 
:php:meth:`Router::url`::

    $this->passedArgs['filter'] = array(
        'published' => 1
        'frontpage' => 1
    );

Les tableaux peuvent aussi être imbriqués en profondeur, vous autorisant même 
à plus de flexibilité dans les arguments passés::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'search',
        'models' => array(
            'post' => array(
                'order' => 'asc',
                'filter' => array(
                    'published' => 1
                )
            ),
            'comment' => array(
                'order' => 'desc',
                'filter' => array(
                    'spam' => 0
                )
            ),
        ),
        'users' => array(1, 2, 3)
    ));

Vous finiriez avec une longue et belle url comme ceci (entouré pour une lecture facile)::

    posts/search
      /models[post][order]:asc/models[post][filter][published]:1
      /models[comment][order]:desc/models[comment][filter][spam]:0
      /users[]:1/users[]:2/users[]:3

Et le tableau résultant qui serait passé au controller matcherait ceci que 
vous avez passé au router::

    $this->passedArgs['models'] = array(
        'post' => array(
            'order' => 'asc',
            'filter' => array(
                'published' => 1
            )
        ),
        'comment' => array(
            'order' => 'desc',
            'filter' => array(
                'spam' => 0
            )
        ),
    );

.. _controlling-named-parameters:

Contrôler les paramètres nommés
-------------------------------

Vous pouvez contrôler la configuration du paramètre nommé au niveau-par-route 
ou les contrôler globalement. Le contrôle global est fait à travers 
``Router::connectNamed()``. Ce qui suit donne quelques exemples de la façon 
dont vous contrôlez le parsing du paramètre nommé avec connectNamed().

Ne parsez aucun paramètre nommé::

    Router::connectNamed(false);

Parsez seulement les paramètres par défaut utilisés pour la pagination de 
CakePHP::

    Router::connectNamed(false, array('default' => true));

Parsez seulement le paramètre de la page si sa valeur est un nombre::

    Router::connectNamed(array('page' => '[\d]+'), array('default' => false, 'greedy' => false));

Parsez seulement le paramètre de la page dans tous les cas::

    Router::connectNamed(array('page'), array('default' => false, 'greedy' => false));

Parsez seulement le paramètre de la page si l'action courante est 'index'::

    Router::connectNamed(
        array('page' => array('action' => 'index')),
        array('default' => false, 'greedy' => false)
    );

Parsez seulement le paramètre de la page si l'action courante est 'index' et 
les controller est 'pages'::

    Router::connectNamed(
        array('page' => array('action' => 'index', 'controller' => 'pages')),
        array('default' => false, 'greedy' => false)
    ); 


connectNamed() supporte un certain nombre d'options:

* ``greedy`` Configurer cela à true fera que le Router va parser tous les 
  paramètres nommés. Configurer cela à false va parser seulement les 
  paramètres nommés.
* ``default`` Définissez cela à true pour fusionner dans l'ensemble par défaut 
  des paramètres nommés.
* ``reset`` Définissez à true pour effacer les règles existantes et 
  recommencez à zéro.
* ``separator`` Changez la chaîne utilisée pour séparer la clé & valeur dans un 
  paramètre nommé. Par défaut `:`

Routing inversé
===============

Le routing inversé est une fonctionnalité dans CakePHP qui est utilisée pour 
vous permettre de changer facilement votre structure d'url sans avoir à 
modifier tout votre code. En utilisant 
:term:`routing arrays <tableau routing>` pour définir vos urls, vous pouvez 
configurer les routes plus tard et les urls générés vont automatiquement 
être mises à jour.

Si vous créez des urls en utilisant des chaînes de caractères comme::

    $this->Html->link('View', '/posts/view/' + $id);

Et ensuite plus tard, vous décidez que ``/posts`` devrait vraiment être 
appelé 'articles' à la place, vous devrez aller dans toute votre application 
en renommant les urls. Cependant, si vous définissiez votre lien comme::

    $this->Html->link(
        'View', 
        array('controller' => 'posts', 'action' => 'view', $id)
    );

Ensuite quand vous décidez de changer vos urls, vous pouvez le faire en 
définissant une route. Cela changerait à la fois le mapping d'URL entrant, 
ainsi que les urls générés.

Quand vous utilisez les urls en tableau, vous pouvez définir les paramètres 
chaîne de la requête et les fragments de document en utilisant les clés 
spéciales::

    Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        '?' => array('page' => 1),
        '#' => 'top'
    ));
    
    // will generate a url like.
    /posts/index?page=1#top

.. _redirect-routing:

Routing inversé
===============

Rediriger le routing vous permet de délivrer des redirections à l'état HTTP
30x pour les routes entrantes, et les pointent aux différentes urls. Ceci 
est utilisé quand vous voulez informer les applications clientes qu'une 
ressource a déplacé et que vous ne voulez pas avoir deux urls pour le 
même contenu.

Les routes de redirection sont différentes des routes normales puisqu'elles 
effectuent une redirection du header actuel si une correspondance est trouvée. 
La redirection peut survenir vers une destination dans votre application 
ou une localisation en-dehors::

    Router::redirect(
        '/home/*', 
        array('controller' => 'posts', 'action' => 'view', 
        array('persist' => true)
    );

Redirige ``/home/*`` vers ``/posts/view`` et passe les paramètres vers 
``/posts/view``. Utiliser un tableau en une destination de redirection 
vous permet d'utiliser d'autres routes pour définir où une chaîne url 
devrait être redirigée. Vous pouvez rediriger vers des localisations 
externes en utilisant les chaînes url en destination::

    Router::redirect('/posts/*', 'http://google.com', array('status' => 302));

Cela redirigerait ``/posts/*`` vers ``http://google.com`` avec un état statut 
HTTP à 302.

.. _disabling-default-routes:

Désactiver les routes par défaut
================================

Si vous avez complètement personnalisé toutes les routes, et voulez éviter 
toute pénalité de contenu dupliqué possible des moteurs de recherche, vous 
pouvez retirer les routes par défaut que CakePHP offre en les supprimant 
de votre fichier d'application routes.php.

Cela ferait que CakePHP servirait les erreurs, quand les utilisateurs essaient 
de visiter les urls qui seraient normalement fournies par CakePHP mais n'ont 
pas été connectée explicitement.

Classes de Route personnalisées
===============================

Les classes de route personnalisés vous permettent d'étendre et de modifier la 
façon dont certaines routes demandes d'analyser et de traiter des routes 
inversés. Une classe de la route devrait hériter de la classe 
:php:class:`CakeRoute` et mettre en œuvre un ou les deux ``match()`` et/ou 
``parse()``. ``parse()`` est utilisée pour 
analyser les demandes et correspondance et ``match()`` est utilisée pour 
traiter les routes inversées.

Vous pouvez utiliser une classe de route personnalisée lors d'un création 
d'une route à l'aide des options de la classe ``routeClass``, et en chargeant 
le fichier contenant votre routes avant d'essayer de l'utiliser::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

Cette route créerait une instance de ``SlugRoute`` et vous permet 
d'implémenter la gestion de paramètre personnalisé.

API du Router
=============

.. php:class:: Router

    Le Router gère la génération des urls sortants, et Le parsing de la 
    requête url entrante dans les ensembles de paramètre que CakePHP 
    peut dispatcher.

.. php:staticmethod:: connect($route, $defaults = array(), $options = array())
    
    :param string $route: Une chaîne décrivant le template de la route
    :param array $defaults: Un tableau décrivant les paramètres de la route 
        par défaut. Ces paramètres seront utilisés par défaut et peuvent 
        fournir des paramètres de routing qui ne sont pas dynamiques.
    :param array $options: Un tableau matchant les éléments nommés dans la 
        route aux expressions régulières avec lesquels cet élément devrait 
        correspondre. Contient aussi des paramètres supplémentaires comme 
        les paramètres routés doivent être passés dans les arguments passés, 
        en fournissant les patterns pour les paramètres de routing et fournir 
        le nom d'une classe de routing personnalisée.

    Les routes ont une façon de connecter les requêtes urls aux objets dans 
    votre application. Dans les routes du coeur, il y a un ensemble 
    d'expressions régulières qui sont utilisées pour matcher les requêtes 
    aux destinations.
    
    Exemples::
    
        Router::connect('/:controller/:action/*');
    
    Le premier paramètre va être utilisé comme nom de controller alors que 
    le second est utilisé en nom d'action. La syntaxe '/\*' rend cette route 
    greedy puisqu'elle ca matcher les requêtes comme `/posts/index` ainsi que 
    les requêtes comme ``/posts/edit/1/foo/bar`` .::
    
        Router::connect('/home-page', array('controller' => 'pages', 'action' => 'display', 'home'));
    
    Ce qui est au-dessus montre l'utilisation d'un paramètre de route par 
    défaut. Et fournir les paramètres de routing pour une route statique.::
    
        Router::connect(
            '/:lang/:controller/:action/:id',
            array(),
            array('id' => '[0-9]+', 'lang' => '[a-z]{3}')
        );
    
    Montre la connexion d'une route avec les paramètres de route personnalisé 
    ainsi que fournit les patterns pour ces paramètres. Les patterns pour les 
    paramètres de routing n'ont pas besoin de capturer les groupes, puisque 
    l'un d'eux sera ajouté pour chaque paramètre de route.
    
    $options offre trois clés 'special'. ``pass``, ``persist`` et 
    ``routeClass`` ont une signification spéciale dans le tableau 
    $options.
    
    * ``pass`` est utilisé pour définir lesquels des paramètres routés devrait 
      être passé dans le tableau pass. Ajouter un paramètre à pass le retirera 
      du tableau de route régulière. Ex. ``'pass' => array('slug')``
    
    * ``persist`` est utilisé pour définir lesquels des paramètres de route 
      devrait être automatiquement inclus quand on génére les nouvels urls. 
      Vous pouvez écraser les paramètres persistentes en les redéfinissant 
      dans une url ou les retirer en configurant le paramètre à ``false``. 
      Ex. ``'persist' => array('lang')``

    * ``routeClass`` est utilisé pour étendre et changer la façon dont les 
      routes individuelles parsent les requêtes et gèrent le routing inversé, 
      via une classe de routing personnalisée.
      Ex. ``'routeClass' => 'SlugRoute'``

    * ``named`` est utilisé pour configurer les paramètres nommés au niveau 
      de la route. Cette clé utilise les mêmes options que 
      :php:meth:`Router::connectNamed()`
    
.. php:staticmethod:: redirect($route, $url, $options = array())

    :param string $route: Un template de route qui dicte quels urls devraient 
        être redirigées.
    :param mixed $url: Soit un :term:`tableau routing`, soit une chaîne url 
        pour la  destination du redirect.
    :param array $options: Un tableau d'options pour le redirect.

    Connecte une nouvelle redirection de Route dans le router.
    Regardez :ref:`redirect-routing` pour plus d'informations.

.. php:staticmethod:: connectNamed($named, $options = array())

    :param array $named: Une liste des paramètres nommés. Les paires de valeur 
        clé sont acceptées où les valeurs sont soit des chaînes regex à 
        matcher, soit des tableaux.
    :param array $options: Permet le contrôle de toutes les configurations: 
        separator, greedy, reset, default
    
    Spécifie quels paramètres nommés CakePHP devrait parsés en urls entrantes 
    Par défaut, CakePHP va parser tout paramètre nommé en-dehors des URLS 
    entrantes. Regardez :ref:`controlling-named-parameters` pour plus 
    d'informations.

.. php:staticmethod:: promote($which = null)
    
    :param integer $which: Un indice de tableau à 0 représentant la route 
        à déplacer. Par exemple, si 3 routes ont été ajoutée, la dernière 
        route serait 2.

    Favorise une route (par défaut, le dernier ajoué) au début de la liste.

.. php:staticmethod:: url($url = null, $full = false)

    :param mixed $url: Une URL relative à Cake, comme "/products/edit/92" ou 
        "/presidents/elect/4" ou un :term:`tableau routing`
    :param mixed $full: Si (bool) à true, l'URL entièrement basé sera précédé 
        au résultat. Si un tableau accèpte les clés suivantes
        
           * escape - utilisé quand on fait les urls intégrées dans les 
             chaînes de requête html échappées '&'
           * full - Si à true, l'URL de base complète sera précédée.

    Génére une URL pour l'action spécfiée. Retourne une URL pointant vers 
    une combinaison de controller et d'action. $url peut être:

    * Empty - la méthode trouve l'adresse du controller/de l'action actuel.
    * '/' - la méthode va trouver l'URL de base de l'application.
    * Une combinaison de controller/action - la méthode va trouver l'url 
      pour cela.

    Il y a quelques paramètres 'special' qui peuvent changer la chaîne d'URL 
    finale qui est générée:

    * ``base`` - défini à false pour retirer le chemin de base à partir 
      d'URL générée. Si votre application n'est pas le répertoire root, ceci 
      peut être utilisé pour générer les URLs qui sont 'cake relative'. Les 
      URLs Cake relative sont nécessaires quand on utilise requestAction.
    * ``?`` - Prend un tableau de paramètres de chaîne requêté
    * ``#`` - Vous permet de définir les fragments hashés d'URL.
    * ``full_base`` - Si à true, la constante :php:const:`FULL_BASE_URL` va 
      être précédée des URLs générées.

.. php:staticmethod:: mapResources($controller, $options = array())

    Crée les routes de ressource REST pour les controller(s) donné. Regardez 
    la section :doc:`/development/rest` pour plus d'informations.

.. php:staticmethod:: parseExtensions($types)

    Utilisé dans routes.php pour déclarer quelle :ref:`file-extensions` de 
    your application
    supports.  By providing no arguments, all file extensions will be supported.
    
    .. versionadded:: 2.1

.. php:staticmethod:: defaultRouteClass($classname)

    Définit la route par défaut pour être utilisée quand on connecte les routes 
    dans le futur.

.. php:class:: CakeRoute

    La classe de base pour les routes personnalisées sur laquelle on se base.

.. php:method:: parse($url)

    :param string $url: The string url to parse.
    
    Parse une url entrante, et génére un tableau de paramètres requêtés sur 
    lequel le Dispatcher peut agir. Etendre cette méthode vous permet de 
    personnaliser comment les URLs entrantes sont converties en un tableau. 
    Retourne ``false`` à partir d'une URL pour indiquer un échec de match.

.. php:method:: match($url)

    :param array $url: Le tableau de routing pour convertir dans une chaîne URL.
    
    Tente de matcher un tableau URL. Si l'URL matche les paramètres de route 
    et les configurations, alors retourne une chaîne URL générée. Si l'URL ne 
    match pas les paramètres de route, false sera retourné. Cette méthode gère 
    le routing inversé ou la conversion de tableaux d'URL dans des chaînes URLs.

.. php:method:: compile()

    Forcer une route à compiler son expression régulière.


.. meta::
    :title lang=fr: Routing
    :keywords lang=fr: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
