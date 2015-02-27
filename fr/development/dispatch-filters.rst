Filtres du Dispatcher
#####################

Il y a plusieurs raisons de vouloir lancer un bout de code avant que tout
code de controller ne soit lancé ou juste avant que la réponse ne soit
envoyée au client, comme la mise en cache de la réponse, le header tuning,
l'authentication spéciale ou juste pour fournir l'accès à une réponse de
l'API critique plus rapidement qu'avec un cycle complet de dispatchement
de requêtes.

CakePHP fournit une interface propre et extensible pour de tels cas pour
attacher les filtres au cycle de dispatchement, de la même façon qu'une
couche middleware pour fournir des services empilables ou des routines
pour chaque requête. Nous les appelons *Dispatcher Filters*.

Filtres Intégrés
================

CakePHP fournit plusieurs filtres de dispatcher intégrés. Ils gèrent des
fonctionnalités habituelles dont toutes les applications vont avoir besoin.
Les filtres intégrés sont:

* ``AssetFilter`` vérifie si la requête fait référence au fichier d'asset de plugin
  ou du theme, comme un fichier CSS, un fichier JavaScript ou une image stockée soit
  dans le dossier webroot d'un plugin ou celui qui correspond pour un Theme. Il va
  servir le fichier correpondant si il est trouvé, stoppant le reste du cycle de
  dispatchment.
* ``RoutingFilter`` applique les règles de routing de l'application pour l'URL de
  la requête. Remplit ``$request->params`` avec les résultats de routing.
* ``ControllerFactory`` utilise ``$request->params`` pour localiser le controller qui
  gère la requête courante.
* ``LocaleSelector`` active le language automatiquement en changeant le header ``Accept-Language``
  envoyé par le navigateur.

Utiliser les Filtres
====================

Les filtres sont habituellement activés dans le fichier **bootstrap.php** de votre
application, mais vous pouvez facilement les charger à n'importe quel moment avant que
la requête ne soit dispatchée. Ajouter et retirer les filtres se fait avec
:php:class:`Cake\\Routing\\DispatcherFactory`. Par défaut, le template d'une application 
CakePHP est fourni avec un couple de classes filter déjà activées pour toutes les
requêtes; Regardons la façon dont elles sont ajoutées::

    DispatcherFactory::add('Routing');
    DispatcherFactory::add('ControllerFactory');

    // La syntaxe de plugin est aussi possible
    DispatcherFactory::add('PluginName.DispatcherName');

    // Utilisez les options pour définir la priorité
    DispatcherFactory::add('Asset', ['priority' => 1]);

Les filtres Dispatcher avec une priorité importante seront les premiers executés. La priorité
est par défaut à ``10``.

Alors qu'utiliser le nom de la chaîne est pratique, vous pouvez aussi passer les instances
dans ``add()``::

    use Cake\Routing\Filter\RoutingFilter;

    DispatcherFactory::add(new RoutingFilter());

Configurer l'Ordre de Filter
----------------------------

Lors de l'ajout de filtres, vous pouvez contrôler l'ordre dans lequel ils sont
appelés en utilisant les priorités du gestionnaire d'event. Alors que les filtres
peuvent définir une priorité par défaut en utilisant la propriété ``$_priority``,
vous pouvez définir une priorité spécifique quand vous attachez le filtre::

    DispatcherFactory::add('Asset', ['priority' => 1]);
    DispatcherFactory::add(new AssetFilter(['priority' => 1]));

Plus la priorité est haute, plus le filtre sera appelé tardivement.

Appliquer les Filtres de Façon Conditionnelle
---------------------------------------------

Si vous ne voulez pas exécuter un filtre sur chaque requête, vous pouvez utiliser
des conditions pour les appliquer seulement certaines fois. Vous pouvez appliquer
les conditinos en utilisant les options ``for`` et ``when``. L'option ``for`` vous
laisse faire la correspondance sur des sous-chaines d'URL, alors que l'option
``when`` vous permet de lancer un callable::

    // Only runs on requests starting with `/blog`
    DispatcherFactory::add('BlogHeader', ['for' => '/blog']);

    // Only run on GET requests.
    DispatcherFactory::add('Cache', [
        'when' => function ($request, $response) {
            return $request->is('get');
        }
    ]);

The callable provided to ``when`` should return ``true`` when the filter should run.
The callable can expect to get the current request and response as arguments.

Building a Filter
=================

To create a filter, define a class in **src/Routing/Filter**. In this example,
we'll be making a filter that adds a tracking cookie for the first landing
page. First, create the file. Its contents should look like::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class TrackingCookieFilter extends DispatcherFilter
    {

        public function beforeDispatch(Event $event)
        {
            $request = $event->data['request'];
            $response = $event->data['response'];
            if (!$request->cookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
        }
    }

Save this file into **src/Routing/Filter/TrackingCookieFilter.php**. As you can see, like other
classes in CakePHP, dispatcher filters have a few conventions:

* Class names end in ``Filter``.
* Classes are in the ``Routing\\Filter`` namespace. For example,
  ``App\\Routing\\Filter``.
* Generally filters extend ``Cake\\Routing\\DispatcherFilter``.

``DispatcherFilter`` exposes two methods that can be overridden in subclasses,
they are ``beforeDispatch()`` and ``afterDispatch()``. These methods are executed
before or after any controller is executed respectively. Both methods receive
a :php:class:`Cake\\Event\\Event` object containing the ``request`` and
``response`` objects (:php:class:`Cake\\Network\\Request` and
:php:class:`Cake\\Network\\Response` instances) inside the ``data`` property.

While our filter was pretty simple, there are a few other interesting things we
can do in filter methods. By returning an ``Response`` object, you can
short-circuit the dispatch process and prevent the controller from being called.
When returning a response, you should also remember to call
``$event->stopPropagation()`` so other filters are not called.

.. note::

    When a beforeDispatch method returns a response, the controller, and
    afterDispatch event will not be invoked.

Let's now create another filter for altering response headers in any public
page, in our case it would be anything served from the ``PagesController``::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class HttpCacheFilter extends DispatcherFilter
    {

        public function afterDispatch(Event $event)
        {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }


    // Dans notre bootstrap.php
    DispatcherFactory::add('HttpCache', ['for' => '/pages'])

This filter will send a expiration header to 1 day in the future for
all responses produced by the pages controller. You could of course do the same
in the controller, this is just an example of what could be done with filters.
For instance, instead of altering the response, you could cache it using
:php:class:`Cake\\Cache\\Cache` and serve the response from the ``beforeDispatch()``
callback.

While powerful, dispatcher filters have the potential to make your application
more difficult to maintain. Filters are an extremely powerful tool when used
wisely and adding response handlers for each URL in your app is not a good use for
them. Keep in mind that not everything needs to be a filter; `Controllers` and
`Components` are usually a more accurate choice for adding any request handling
code to your app.

.. meta::
    :title lang=fr: Filtres du Dispatcher
    :description lang=fr: Les filtres du Dispatcher sont une couche middleware pour CakePHP permettant de modifier la requête ou la réponse avant qu'elles soit envoyées
    :keywords lang=fr: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
