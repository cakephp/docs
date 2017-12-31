Filtres du Dispatcher
#####################

.. deprecated:: 3.3.0
    Depuis la version 3.3.0 , les Filtres de Dispatcher sont dépréciés. Vous
    devriez maintenant utiliser le :doc:`/controllers/middleware` à la place.

Il y a plusieurs raisons de vouloir exécuter un bout de code avant que tout
code de controller ne soit lancé ou juste avant que la réponse ne soit
envoyée au client, comme la mise en cache de la réponse, le tunning de header,
une authentification spéciale ou juste pour fournir l'accès à une réponse de
l'API critique plus rapidement qu'avec un cycle complet de dispatch
de requêtes.

CakePHP fournit une interface propre et extensible pour de tels cas pour
attacher les filtres au cycle de dispatch, de la même façon qu'une
couche middleware pour fournir des services empilables ou des routines
pour chaque requête. Nous les appelons *Dispatcher Filters*.

Filtres Intégrés
================

CakePHP fournit plusieurs filtres de dispatcher intégrés. Ils gèrent des
fonctionnalités habituelles dont toutes les applications vont avoir besoin.
Les filtres intégrés sont:

* ``AssetFilter`` vérifie si la requête fait référence au fichier d'asset de
  plugin ou du theme, comme un fichier CSS, un fichier JavaScript ou une image
  stockée soit dans le dossier webroot d'un plugin ou celui qui correspond pour
  un Theme. Il va servir le fichier correspondant s'il est trouvé, stoppant le
  reste du cycle de dispatch::

        // Utilisez options pour définir le cacheTime de vos assets statiques
        // S'il n'est pas défini, il est de 1 heure (+1 hour) par défaut.
        DispatcherFactory::add('Asset', ['cacheTime' => '+24 hours']);

* ``RoutingFilter`` applique les règles de routing de l'application pour l'URL
  de la requête. Remplit ``$request->getParam()`` avec les résultats de routing.
* ``ControllerFactory`` utilise ``$request->getParam()`` pour localiser le
  controller qui gère la requête courante.
* ``LocaleSelector`` active le langage automatiquement en changeant le header
  ``Accept-Language`` envoyé par le navigateur.

Utiliser les Filtres
====================

Les filtres sont habituellement activés dans le fichier **bootstrap.php** de
votre application, mais vous pouvez les charger à n'importe quel moment avant
que la requête ne soit dispatchée. Ajouter et retirer les filtres se fait avec
:php:class:`Cake\\Routing\\DispatcherFactory`. Par défaut, le template d'une
application CakePHP est fourni avec un couple de classes filter déjà activées
pour toutes les requêtes; Regardons la façon dont elles sont ajoutées::

    DispatcherFactory::add('Routing');
    DispatcherFactory::add('ControllerFactory');

    // La syntaxe de plugin est aussi possible
    DispatcherFactory::add('PluginName.DispatcherName');

    // Utilisez les options pour définir la priorité
    DispatcherFactory::add('Asset', ['priority' => 1]);

Les filtres Dispatcher avec une priorité ``priority`` supérieure (nombres les
plus faibles) - seront exécutés les premiers. La priorité est par défaut à
``10``.

Alors qu'utiliser le nom de la chaîne est pratique, vous pouvez aussi passer les
instances dans ``add()``::

    use Cake\Routing\Filter\RoutingFilter;

    DispatcherFactory::add(new RoutingFilter());

Configurer l'Ordre de Filter
----------------------------

Lors de l'ajout de filtres, vous pouvez contrôler l'ordre dans lequel ils sont
appelés en utilisant les priorités du gestionnaire d'event. Alors que les
filtres peuvent définir une priorité par défaut en utilisant la propriété
``$_priority``, vous pouvez définir une priorité spécifique quand vous attachez
le filtre::

    DispatcherFactory::add('Asset', ['priority' => 1]);
    DispatcherFactory::add(new AssetFilter(['priority' => 1]));

Plus la priorité est haute, plus le filtre sera appelé tardivement.

Appliquer les Filtres de Façon Conditionnelle
---------------------------------------------

Si vous ne voulez pas exécuter un filtre sur chaque requête, vous pouvez
utiliser des conditions pour les appliquer seulement certaines fois. Vous
pouvez appliquer les conditions en utilisant les options ``for`` et ``when``.
L'option ``for`` vous laisse faire la correspondance sur des sous-chaines d'URL,
alors que l'option ``when`` vous permet de lancer un callable::

    // Only runs on requests starting with `/blog`
    DispatcherFactory::add('BlogHeader', ['for' => '/blog']);

    // Only run on GET requests.
    DispatcherFactory::add('Cache', [
        'when' => function ($request, $response) {
            return $request->is('get');
        }
    ]);

The callable provided to ``when`` should return ``true`` when the filter should
run. The callable can expect to get the current request and response as
arguments.

Construire un Filtre
====================

Pour créer un filtre, définissez une classe dans **src/Routing/Filter**. Dans
cet exemple, nous allons créer un filtre qui ajoute un cookie de tracking pour
la page d'accueil. Premièrement, créez le fichier. Son contenu doit ressembler
à ceci::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class TrackingCookieFilter extends DispatcherFilter
    {

        public function beforeDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');
            if (!$request->getCookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
        }
    }

Enregistrez ce fichier sous **src/Routing/Filter/TrackingCookieFilter.php**.
Comme vous pouvez le voir, à l'image des autres classes dans CakePHP, les
filtres de dispatcher suivent quelques conventions:

* Les noms de classes finissent par ``Filter``.
* Les classes sont dans le namespace ``Routing\\Filter``. Par exemple,
  ``App\\Routing\\Filter``.
* Généralement, les filtres étendent ``Cake\\Routing\\DispatcherFilter``.

``DispatcherFilter`` expose deux méthodes qui peuvent être surchargées dans les
sous-classes qui sont ``beforeDispatch()`` et ``afterDispatch()``. Ces méthodes
sont exécutées respectivement avant et après l'exécution de tout controller.
les deux méthodes reçoivent un objet :php:class:`Cake\\Event\\Event` contenant
les objets ``ServerRequest`` et ``Response``
(instances de :php:class:`Cake\\Http\\ServerRequest` et
:php:class:`Cake\\Http\\Response`) dans la propriété ``data``.

Alors que notre filtre était relativement simple, il y a quelques autres choses
intéressantes que nous pouvons réaliser dans les méthodes de filtre. En
renvoyant un objet ``Response``, vous pouvez court-circuiter le process de
dispatch et empêcher le controller d'être appelé. Lorsque vous renvoyez une
response, n'oubliez pas d'appeler ``$event->stopPropagation()`` pour que les
autres filtres ne soient pas appelés.

.. note::

    Lorsque la méthode beforeDispatch renvoie une response, le controller, et
    l'event afterDispatch ne seront pas appelés.

Créons maintenant un autre filtre pour modifier l'en-tête de response de
n'importe quelle page publique, dans notre cas ce serait tout ce qui est
servi depuis le ``PagesController``::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class HttpCacheFilter extends DispatcherFilter
    {

        public function afterDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');

            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

    // Dans notre bootstrap.php
    DispatcherFactory::add('HttpCache', ['for' => '/pages'])

Ce filtre enverra un en-tête d'expiration pour 1 jour dans le futur pour toutes
responses produites pour le controller pages. Vous pourriez bien entendu faire
la même chose dans un controller, ce n'est qu'un exemple de ce qui peut être
réalisé avec les filtres. Par exemple, au lieu d'altérer la response, vous
pourriez la mettre en cache en utilisant :php:class:`Cake\\Cache\\Cache` en
servant la response depuis le callback ``beforeDispatch()``.

Bien que très puissants, les filtres du dispatcher peuvent également compliquer
la maintenance de votre application. Les filtres sont des outils extrêmement
puissants lorsqu'ils sont utilisés sagement et ajouter des gestionnaires de
responses pour chaque URL dans votre application n'est pas une bonne
utilisation. Gardez à l'esprit que tout n'a pas besoin d'être un filtre; Les
`Controllers` et les `Components` sont souvent un choix plus précis pour ajouter
tout code de gestionnaire de requête à votre application.

.. meta::
    :title lang=fr: Filtres du Dispatcher
    :description lang=fr: Les filtres du Dispatcher sont une couche middleware pour CakePHP permettant de modifier la requête ou la réponse avant qu'elles ne soit envoyées
    :keywords lang=fr: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
