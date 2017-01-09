Filtres du Dispatcher
#####################

.. versionadded:: 2.2

Il y a plusieurs raisons de vouloir un bout de code à lancer avant que tout
code de controller soit lancé ou juste avant que la réponse soit envoyée au
client, comme la mise en cache de la réponse, le header tuning,
l'authentication spéciale ou juste pour fournir l'accès à une réponse de
l'API critique plus rapidement qu'avec un cycle complet de dispatchement
de requêtes.

CakePHP fournit une interface propre et extensible pour de tels cas pour
attacher les filtres au cycle de dispatchement, de la même façon qu'une
couche middleware pour fournir des services empilables ou des routines
pour chaque requête. Nous les appelons `Dispatcher Filters`.

Configurer les Filtres
======================

Les filtres sont généralement configurés dans le fichier ``bootstrap.php``,
mais vous pouvez facilement les charger à partir d'un autre fichier de
configuration avant que la requête soit dispatchée. Ajouter et retirer les
filtres est fait par la classe `Configure`, en utilisant la clé spéciale
``Dispatcher.filters``. Par défaut CakePHP est fourni avec des classes de
filtre déjà activées pour toutes les requêtes, allons voir comment elles ont
été ajoutées::

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

Chacune de ces valeurs de tableaux sont des noms de classe qui seront
instanciés et ajoutés en écouteurs des évènements générés au niveau du
dispatcher. Le premier, ``AssetDispatcher`` est là pour vérifier si la
requête se réfère au theme ou au fichier d'asset du plugin, comme le CSS,
le JavaScript ou une image stockée dans soit un dossier du webroot du plugin,
soit dans celui correspondant au Theme. Il servira le fichier selon s'il est
trouvé ou non, stoppant le reste du cycle de dispatchement. Le filtre
``CacheDispatcher``, quand la variable de config ``Cache.check`` est
activée, va vérifier si la réponse a déjà été mise en cache dans le système
de fichier pour une requête similaire et servir le code mis en cache
immédiatement.

Comme vous pouvez le voir, les deux filtres fournis ont la responsabilité
d'arrêter tout code plus loin et d'envoyer la réponse juste après au client.
Mais les filtres ne sont pas limités au role, puisque nous allons montrons
rapidement dans cette section.

Vous pouvez ajouter vos propres noms de classes à la liste des filtres, et ils
seront exécutés dans l'ordre dans lequel ils ont été défini. Il y aussi une
façon alternative pour attacher les filtres qui n'impliquent pas les
classes spéciales ``DispatcherFilter``::

    Configure::write('Dispatcher.filters', array(
        'my-filter' => array('callable' => array($classInstance, 'methodName'), 'on' => 'after')
    ));

Comme montré ci-dessus, vous pouvez passer tout type de
`callback <https://secure.php.net/callback>`_ PHP valide, puisque vous vous en
souvenez peut-être, un `callback` est tout ce que PHP peut exécuter avec
``call_user_func``. Nous faisons une petite exception, si une chaîne est
fournie, elle sera traitée comme un nom de classe, et pas comme un nom de
fonction possible. Ceci bien sur donne la capacité aux utilisateurs
de PHP5.3 d'attacher des fonctions anonymes en tant que filtres::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array('callable' => function($event) {...}, 'on' => 'before'),
       //plus de filtres ici
    ));


La clé ``on`` prend seulement ``before`` et ``after`` comme valeurs valides,
et cela signifie bien évidemment si le filtre doit être lancé avant ou après
que tout code du controller soit exécuté. En plus de définir les filtres avec
la clé ``callable``, vous pouvez aussi définir une priorité pour vos filtres,
si aucun n'est spécifié alors par défaut ``10`` et sélectionné pour vous.

Puisque tous les filtres auront une priorité par défaut à ``10``, vous aurez
envie de lancer un filtre avant tout autre dans la liste, sélectionner des
nombres d'une priorité plus faible comme souhaité::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array(
            'callable' => function($event) {...},
            'on' => 'before',
            'priority' => 5
        ),
        'other-filter' => array(
            'callable' => array($class, 'method'),
            'on' => 'after',
            'priority' => 1
        ),
       //plus de filtres ici
    ));

Evidemment, quand vous définissez les priorités, l'ordre dans lequel les
filtres sont déclarés n'a pas d'importance mais pour ceux qui ont la même
priorité. Quand vous définissez les filtres en tant que noms de classe,
il n'y a pas d'options pour définir la priorité in-line, nous y
viendront bientôt. Au final, la notation de plugin de CakePHP peut
être utilisée pour définir les filtres localisés dans les plugins::

    Configure::write('Dispatcher.filters', array(
        'MyPlugin.MyFilter',
    ));

N'hésitez pas à retirer les filtres attachés par défaut si vous choisissiez
d'utiliser une façon plus avancée/rapide pour servir les thèmes les assets
de plugin ou si vous ne souhaitez pas utiliser la mise en cache intégrée
de la page entière, ou pour juste implémenter le votre.

Si vous avez besoin de passer des paramètres ou des configurations au
constructeur à vos classes de dispatch filter, vous pouvez le faire en
fournissant un tableau de paramètres::

    Configure::write('Dispatcher.filters', array(
        'MyAssetFilter' => array('service' => 'google.com')
    ));

Quand la clé filter est un nom de classe valide, la valeur peut être un tableau
de paramètres qui sont passés au dispatch filter. Par défaut, la classe de base
va assigner ces paramètres à la propriété ``$settings`` après les avoir
fusionnés avec les valeurs par défaut dans la classe.

.. versionchanged:: 2.5
    Vous pouvez maintenant fournir des paramètres au constructeur pour
    dispatcher les filtres dans 2.5.

Classes Filter
==============

Les filtres de Dispatcher, quand définis en tant que noms de classe dans
configuration, doivent étendre la classe ``DispatcherFilter`` fournie
dans le répertoire `Routing` de CakePHP.
Créons un simple filtre pour répondre à une URL spécifique avec un texte
'Hello World'::

    App::uses('DispatcherFilter', 'Routing');
    class HelloWorldFilter extends DispatcherFilter {

        public $priority = 9;

        public function beforeDispatch($event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->url === 'hello-world') {
                $response->body('Hello World');
                $event->stopPropagation();
                return $response;
            }
        }
    }

Cette classe devrait être sauvegardée dans un fichier dans
``app/Routing/Filter/HelloWorldFilter.php`` et configurée dans le fichier
bootstrap comme on l'a expliqué dans la section précédente. Il y a plein
de choses à expliquer ici, commençons avec la valeur ``$priority``.

Comme mentionné avant, quand vous utilisez les classes de filtre,
vous pouvez seulement définir l'ordre dans lequel elles sont lancées en
utilisant la propriété ``$priority`` dans la classe, la valeur par défaut est
10 si la propriété est déclarée, cela signifie qu'il sera exécuté _après_ que
la classe de Router a parsé la requête. Nous ne voulons pas que cela
arrive dans notre exemple précédent, parce que probablement, vous n'avez pas
de controller configuré pour répondre à cette URL, donc nous avons choisi
9 comme notre priorité.

``DispatcherFilter`` propose deux méthodes qui peuvent être écrasées dans des
sous-classes, elles sont ``beforeDispatch`` et ``afterDispatch``, et sont
exécutées respectivement avant ou après que tout controller soit exécuté.
Les deux méthodes reçoivent un objet  :php:class:`CakeEvent` contenant
les objets ``request`` et ``response``
(instances :php:class:`CakeRequest` et :php:class:`CakeResponse`) avec
un tableau ``additionalParams`` à l'intérieur de la propriété ``data``.
Ce qui suit contient des informations utilisées pour le dispatching
interne quand on appelle ``requestAction``.

Dans notre exemple, nous avons retourné selon les cas l'objet ``$response``
comme résultat, cela dira au Dispatcher pour n'instancier aucun controller
et retourner un objet comme cela en réponse immédiatement au client. Nous
avons aussi ajouté ``$event->stopPropagation()`` pour empêcher d'autres
filtres d'être exécuté après celui-ci.

Créons maintenant un autre filtre pour modifier les headers de réponse dans
toute page publique, dans notre cas, ce serait tout ce qui est servi à
partir de ``PagesController``::

    App::uses('DispatcherFilter', 'Routing');
    class HttpCacheFilter extends DispatcherFilter {

        public function afterDispatch($event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->params['controller'] !== 'pages') {
                return;
            }
            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

Ce filtre enverra une expiration du header à 1 jour dans le futur pour toutes
les réponses produites par le controller pages. Vous pourriez bien sûr
faire la même chose dans le controller, ceci est juste un exemple de ce qui
peut être fait avec les filtres. Par exemple, au lieu de modifier la réponse,
vous pourriez la mettre en cache  en utilisant la classe :php:class:`Cache`
et servir la réponse à partir du callback ``beforeDispatch``.

Filtres Inline
==============

Notre dernier exemple va utiliser une fonction anonyme (seulement disponible
sur PHP 5.3+) pour servir une liste de posts dans un format JSON, nous
vous encourageons à faire ainsi l'utilisation des controllers et la classe
:php:class:`JsonView`, mais imaginons que vous ayez besoin de gagner une tout
petite milliseconde pour cette mission-critical API endpoint::

    $postsList = function($event) {
        if ($event->data['request']->url !== 'posts/recent.json') {
            return;
        }
        App::uses('ClassRegistry', 'Utility');
        $postModel = ClassRegistry::init('Post');
        $event->data['response']->body(json_encode($postModel->find('recent')));
        $event->stopPropagation();
        return $event->data['response'];
    };

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher',
        'recent-posts' => array(
            'callable' => $postsList,
            'priority' => 9,
            'on'=> 'before'
        )
    ));

Dans l'exemple précédent, nous avons selectionné une priorité à ``9`` pour
notre filtre, donc pour sauter toute autre logique, soit placé dans des
filtres personnalisés, soit dans des filtres du coeur comme le système de
routing interne de CakePHP. Bien que cela ne soit pas nécessaire, cela
montre comment faire pour que votre code important se lance en premier au
cas où vous auriez besoin de trim au plus gros possible à partir de
certaines requêtes.

Pour des raisons évidentes, ceci a le potentiel de rendre la maintenance de
votre app très difficile. Les filtres sont un outil extrêmement puissant
quand on les utilise sagement, ajoutez les gestionnaires de réponse
pour chaque URL dans votre app n'est pas une bonne utilisation pour cela. Mais
si vous avez une raison valide de le faire, alors vous avez une solution
propre à portée de main. Gardez à l'esprit que tout ne doit pas être un
filtre, les `Controllers` et les `Components` sont habituellement un choix
plus précis pour ajouter tout code de gestion de requête à votre app.


.. meta::
    :title lang=fr: Filtres du Dispatcher
    :description lang=fr: Les filtres du Dispatcher sont une couche middleware pour CakePHP permettant de modifier la requête ou la réponse avant qu'elles soit envoyées
    :keywords lang=fr: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
