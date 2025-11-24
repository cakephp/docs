Middleware
##########

Les objets Middleware vous donnent la possibilité d'encapsuler votre application
dans des couches modulables et réutilisables du gestionnaire de requête ou de
logique de construction de réponses. Visuellement, votre application se trouve au
centre et les middlewares entourent l'application comme un oignon. Ici, on peut voir
une application entourée des middlewares Routes, Assets, gestion d'Exceptions et
gestion des headers CORS.

.. image:: /_static/img/middleware-setup.png

Quand une requête est gérée par votre application, elle entre par le middleware le
plus à l'extérieur. Chaque middleware peut soit passer la requête / la réponse à la
couche suivante, soit retourner une réponse. Retourner une réponse empêchera les couches
plus basses d'accéder à la requête. Un exemple illustrant ce principe serait
l'AssetMiddleware qui gérera la requête d'une image de plugin pendant le développement.

.. image:: /_static/img/middleware-request.png

Si aucun middleware n'effectue une action pour gérer la requête, un controller sera
utilisé et son action exécutée, ou une exception sera levée et génerera une erreur.

Les Middlewares font partie de la nouvelle pile HTTP qui influence la requête et
les interfaces de réponse PSR-7. CakePHP supporte aussi le standard PSR-15 pour
les gestionnaires de requêtes serveur, ainsi vous pouvez utiliser n'importe quel
middleware compatible PSR-15 disponible sur `Packagist <https://packagist.org>`__.

Les Middlewares dans CakePHP
============================

CakePHP fournit nativement plusieurs middlewares pour gérer des tâches classiques
d'une application web:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` capture les exceptions à
  partir du middleware encapsulé et affiche un page d'erreur en utilisant le
  gestionnaire d'exception :doc:`/development/errors`.
* ``Cake\Routing\AssetMiddleware`` verifie si la requête fait référence à un
  thème ou à un fichier ressource d'un plugin, tel que un fichier CSS,
  JavaScript ou image enregistré soit dans le dossier racine du plugin ou celui
  correspondant, pour un thème.
* ``Cake\Routing\Middleware\RoutingMiddleware`` utilise le ``Router`` pour
  analyser l'URL entrante et assigner les paramètres de routing à la requête.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` active le changement
  automatique de langage à partir de l'en-tête ``Accept-Language`` envoyé par le
  navigateur
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` vous permet de manipuler
  des cookies chiffrés dans le cas où vous auriez besoin de manipuler des cookies
  avec des données obfusqués.
* ``Cake\Http\Middleware\BodyParserMiddleware`` vous permet de décoder du JSON,
  XML et d'autres corps de requête encodés selon la valeur de l'en-tête
  ``Content-Type``.
* :doc:`Cake\Http\Middleware\HttpsEnforcerMiddleware </security/https-enforcer>`
  exige l'usage de HTTPS.
* :doc:`Cake\Http\Middleware\CsrfProtectionMiddleware </security/csrf>` ajoute
  une protection CSRF à votre application.
* :doc:`Cake\Http\Middleware\SessionCsrfProtectionMiddleware </security/csrf>`
  ajoute à votre application une protection CSRF basée sur la session.
* :doc:`Cake\Http\Middleware\CspMiddleware </security/content-security-policy>`
  facilite l'ajout d'en-têtes Content-Security-Policy à votre application.
* :doc:`Cake\Http\Middleware\SecurityHeadersMiddleware </security/security-headers>`
  rend possible l'ajout de headers liés à la sécurité comme ``X-Frame-Options``
  dans les réponses.

.. _using-middleware:

Utilisation des Middleware
==========================

Les middlewares peuvent être appliqués de manière globale à votre application, à
un scope de routing ou à des controllers spécifiques.

Pour appliquer un middleware à toutes les requêtes, utilisez la méthode ``middleware``
de la classe ``App\Application``.
La méthode d'attache ``middleware`` de votre application sera appelée très tôt
dans le processus de requête, vous pouvez utiliser les objets ``MiddlewareQueue``
pour en attacher ::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Attache le gestionnaire d'erreur dans la file du middleware
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            return $middlewareQueue;
        }
    }

En plus d'ajouter à la fin de la ``MiddlewareQueue`` vous pouvez effectuer
différentes opérations ::

        $layer = new \App\Middleware\CustomMiddleware;

        // Le middleware sera ajouté à la fin de la file.
        $middlewareQueue->add($layer);

        // Le middleware sera ajouté au début de la file
        $middlewareQueue->prepend($layer);

        // Insère dans une place spécifique. Si cette dernière est
        // hors des limites, il sera ajouté à la fin.
        $middlewareQueue->insertAt(2, $layer);

        // Insère avant un autre middleware.
        // Si la classe nommée ne peut pas être trouvée,
        // une exception sera renvoyée.
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insère après un autre middleware.
        // Si la classe nommée ne peut pas être trouvée,
        // le middleware sera ajouté à la fin.
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Si votre middleware n'est applicable qu'à certaines routes ou à des controllers
individuels, vous pouvez utiliser :ref:`un middleware limité à des routes <route-scoped-middleware>`,
ou :ref:`un middleware de controller <controller-middleware>`.

Ajout de Middleware à partir de Plugins
---------------------------------------

Les plugins peuvent utiliser leur méthode d'attache ``middleware`` pour
appliquer un de leurs middlewares dans la file de middlewares de l'application::

    // dans plugins/ContactManager/src/Plugin.php
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;


    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            $middlewareQueue->add(new ContactManagerContextMiddleware());

            return $middlewareQueue;
        }
    }

Créer un Middleware
===================

Un Middleware peut soit être implémenté en tant que fonctions anonymes
(Closures), soit en tant que classes appelables. Les Closures sont adaptées pour
les petites tâches mais elles rendent les tests plus difficiles, et peuvent
engendrer une classe ``Application`` complexe. Les classes Middleware dans
CakePHP ont quelques conventions:

* Les fichiers de classe Middleware doivent être placés dans
  **src/Middleware**. Par exemple : **src/Middleware/CorsMiddleware.php**
* Les classes Middleware doivent avoir ``Middleware`` en suffixe. Par exemple:
  ``LinkMiddleware``.
* Les Middlewares doivent implémenter ``Psr\Http\Server\MiddlewareInterface``.

Les middlewares peuvent renvoyer une réponse soit en appelant
``$handler->handle()``, soit en créant leur propre réponse. Nous pouvons voir
les deux possibilités dans notre middleware simple::

    // Dans src/Middleware/TrackingCookieMiddleware.php
    namespace App\Middleware;

    use Cake\Http\Cookie\Cookie;
    use Cake\I18n\Time;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\RequestHandlerInterface;
    use Psr\Http\Server\MiddlewareInterface;

    class TrackingCookieMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface
        {
            // Appeler $handler->handle() délègue le contrôle au middleware *suivant*
            // Dans la file de votre application.
            $response = $handler->handle($request);

            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie(new Cookie(
                    'landing_page',
                    $request->getRequestTarget(),
                    $expiry
                ));
            }

            return $response;
        }
    }

Après avoir créé le middleware, attachez-le à votre application ::

    // Dans src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Ajoutez votre middleware dans la file
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // Ajoutez d'autres middleware dans la file

            return $middlewareQueue;
        }
    }

.. _routing-middleware:

Middleware Routing
==================

Le middleware Routing a la responsabilité d'appliquer les routes de votre
application et de résoudre le plugin, le controller, et l'action vers lesquels
doit être dirigée la requête. Il peut mettre en cache la collection des routes
utilisées dans votre application pour accélérer le démarrage. Pour activer la
mise en cache des routes, fournissez la :ref:`configuration de cache <cache-configuration>`
souhaitée en paramètre::

    // Dans Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

Ceci utiliserait le moteur de cache ``routing`` pour stocker la collection de
routes générée.

.. _encrypted-cookie-middleware:

Middleware de Gestion de Cookies Chiffrés
=========================================

Si votre application utilise des cookies qui contiennent des données que vous
avez besoin de masquer pour vous protéger contre les modifications utilisateurs,
vous pouvez utiliser le middleware de gestion des cookies chiffrés de CakePHP pour
chiffrer et déchiffrer les données des cookies.
Les données des cookies sont chiffrées via OpenSSL, en AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Noms des cookies à protéger
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlewareQueue->add($cookies);

.. note::
    Il est recommandé que la clé de chiffrage utilisée pour les données des cookies
    soit *exclusivement* utilisée pour les données des cookies.

L'algorithme de chiffrement et le 'padding style' utilisé par le middleware
sont compatible avec le ``CookieComponent`` des versions précédents de CakePHP.

.. _body-parser-middleware:

Middleware Body Parser
======================

Si votre application accepte du JSON, XML ou d'autres corps de requêtes encodés,
le ``BodyParserMiddleware`` vous décodera ces requêtes en un tableau qui sera
disponible *via* ``$request->getParsedData()`` et ``$request->getData()``. Par
défaut, seuls les contenus ``json`` seront parsés, mais le parsage XML peut être
activé avec une option. Vous pouvez aussi définir vos propres parseurs::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // Seul JSON sera parsé
    $bodies = new BodyParserMiddleware();

    // Active le parsage XML
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Désactive le parsage JSON
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Ajoute votre propre parseur en faisant correspondre d'autres valeurs du
    // header content-type aux callables capables de les parser.
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Utilise une bibliothèque de parsage CSV.
        return Csv::parse($body);
    });

.. meta::
    :title lang=fr: Middleware Http
    :keywords lang=fr: http, middleware, psr-7, requête, réponse, wsgi, application, baseapplication, https
