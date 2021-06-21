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
* ``Cake\Http\Middleware\HttpsEnforcerMiddleware`` exige l'usage de HTTPS.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` facilite l'ajout de
  header liés à la sécurité comme ``X-Frame-Options`` aux réponses.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` vous permet de manipuler
  des cookies chiffrés dans le cas où vous auriez besoin de manipuler des cookies
  avec des données obfusqués.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` ajoute une protection CSRF
  à votre application.
* ``Cake\Http\Middleware\SessionCsrfProtectionMiddleware`` ajoute à votre
  application une protection CSRF basée sur la session.
* ``Cake\Http\Middleware\BodyParserMiddleware`` vous permet de décoder du JSON,
  XML et d'autres corps de requête encodés selon la valeur de l'en-tête
  ``Content-Type``.
* ``Cake\Http\Middleware\CspMiddleware`` facilite l'ajout d'en-têtes
  Content-Security-Policy à votre application.

.. _using-middleware:

Utilisation des Middleware
==========================

Les middlewares peuvent être appliqués de manière globale à votre application ou
un scope de routing.

Pour appliquer un middleware à toutes les requêtes, utilisez la méthode ``middleware``
de la classe ``App\Application``.
La méthode d'attache ``middleware`` de votre application sera appelée très tôt
dans le processus de requête, vous pouvez utiliser les objets ``MiddlewareQueue``
pour en attacher ::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Attache le gestionnaire d'erreur dans la file du middleware
            $middlewareQueue->add(new ErrorHandlerMiddleware());
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

En plus d'appliquer des middleware à la totalité de votre application, vous pouvez
appliquer des middleware à des jeux de routes spécifiques en utilisant les
:ref:`middlewares connectés à un scope <connecting-scoped-middleware>`.

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
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQue
ue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

Ceci utiliserait le moteur de cache ``routing`` pour stocker la collection de
routes générée.

.. _security-header-middleware:

Ajouter des Headers de Sécurité
===============================

La couche ``SecurityHeaderMiddleware`` facilite l'ajout de headers liés à la
sécurité à votre application. Une fois configuré, le middleware peut ajouter
les headers suivants aux réponses:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

Ce middleware peut être configuré en utilisant l'interface fluide avant d'être
appliqué au stack de middlewares::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $securityHeaders = new SecurityHeadersMiddleware();
    $securityHeaders
        ->setCrossDomainPolicy()
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->setXssProtection()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($securityHeaders);

Middleware Content Security Policy Header
=========================================

Le ``CspMiddleware`` rend les choses plus simples pour ajouter des en-têtes
Content-Security-Policy dans votre application. Avant de l'utiliser, vous devez
installer ``paragonie/csp-builder``:

.. code-block::bash

    composer require paragonie/csp-builder

Vous pouvez configurer le middleware en utilisant un tableau, ou en lui passant
un objet ``CSPBuilder`` déjà construit::

    use Cake\Http\Middleware\CspMiddleware;

    $csp = new CspMiddleware([
        'script-src' => [
            'allow' => [
                'https://www.google-analytics.com',
            ],
            'self' => true,
            'unsafe-inline' => false,
            'unsafe-eval' => false,
        ],
    ]);

    $middlewareQueue->add($csp);

Une fois le middleware CSP activé, les attributs ``cspScriptNonce`` et
``cspStyleNonce`` seront définis sur les requêtes. Ces attributs sont appliqués
à l'attribut ``nonce`` de tous les éléments scripts et liens CSS créés par
``HtmlHelper``. Cela simplifie l'adoption de stratégies utilisant un `nonce-base64
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src>`__
et ``strict-dynamic`` pour un surcroît de sécurité et une maintenance plus
facile.


.. versionadded:: 4.3.0
    Le remplissage automatique du nonce a été ajouté.

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

.. _csrf-middleware:

Middleware Cross Site Request Forgery (CSRF)
============================================

La protection CSRF peut être appliqué à votre application complète ou à des
'scopes' spécifiques.

.. note::

    Vous ne pouvez pas utiliser ces deux approches simultanément, vous devez en
    choisir une. Si vous utilisez les deux ensemble, une erreur de jeton CSRF
    invalide se produira à chaque requête `PUT` et `POST`.

CakePHP offre deux formes de protection CSRF:

* ``SessionCsrfProtectionMiddleware`` stocke les jetons CSRF en session. Cela
  nécessite que votre application ouvre la session à chaque requête ayant des
  effets de bord. L'avantage des jetons CSRF basés sur la session est qu'ils
  sont limités à un utilisateur spécifique, et valides seulement le temps de la
  session.
* ``CsrfProtectionMiddleware`` stocke les jetons CSRF dans un cookie. Utiliser
  un cookie permet de faire les vérifications CSRF indépendamment de l'état du
  serveur. L'authenticité des valeurs des cookies est vérifiée en utilisant une
  vérification HMAC check. Cependant, en raison de leur nature stateless, les
  jetons CSRF sont réutilisables d'un utilisateur à l'autre et d'une session à
  l'autre.

En ajoutant le middleware CSRF à la file des middlewares de votre Application,
vous protégez toutes les actions de l'application::

    // dans src/Application.php
    // Pour les jetons CSRF basés sur un Cookie.
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    // Pour les jetons CSRF basés sur la session.
    use Cake\Http\Middleware\SessionCsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $options = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($options);
        // ou
        $csrf = new SessionCsrfProtectionMiddleware($options);

        $middlewareQueue->add($csrf);
        return $middlewareQueue;
    }

En ajoutant la protection CSRF à des scopes de routing, vous pouvez conditionner
l'utilisation de CSRF à certains groupes de routes::

    // dans src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes(RouteBuilder $routes) : void
    {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // dans config/routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });


Options du middleware CSRF basés sur un Cookie
----------------------------------------------

Les options de configuration disponibles sont:

- ``cookieName`` Le nom du cookie à envoyer. Par défaut ``csrfToken``.
- ``expiry`` La durée de vie du jeton CSRF. Par défaut, le temps de la session.
- ``secure`` Selon que le cookie doit être défini avec le drapeau Secure ou pas.
  C'est-à-dire que le cookie sera défini seulement dans une connexion HTTPS et
  toute tentative à travers un HTTP normal échouera. Par défaut à ``false``.
- ``httponly`` Selon que le cookie sera défini avec le drapeau HttpOnly ou pas.
  Par défaut à ``false``. Avant 4.1.0, utilisez l'option ``httpOnly``.
- ``samesite`` Vous permet de déclarer si le cookie doit être restreint à un
  contexte first-party ou same-site. Les valeurs possibles sont ``Lax``,
  ``Strict`` et ``None``. Par défaut à ``null``.
- ``field`` Le champ de formulaire à vérifier. Par défaut ``_csrfToken``.
  Changer ceci obligera à changer également la configuration de FormHelper.

Options du middleware CSRF basé sur la Session
----------------------------------------------

Les options de configuration disponibles sont:

- ``key`` La clé de session à utiliser. Par défaut `csrfToken`.
- ``field`` Le champ de formulaire à vérifier. Par défaut ``_csrfToken``.
  Changer ceci obligera à changer également la configuration de FormHelper.


Lorsqu'il est activé, vous pouvez accéder au jeton CSRF en cours sur l'objet
requête::

    $token = $this->request->getAttribute('csrfToken');

Ignorer les vérifications CSRF pour certaines actions
-----------------------------------------------------

Les deux implémentations du middleware CSRF vous autorisent à ignorer les
callbacks de vérification pour un contrôle plus fin selon l'URL pour laquelle la
vérification était censée avoir lieu::

    // dans src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $csrf = new CsrfProtectionMiddleware();

        // La vérification du jeton sera ignorée lorsque le callback renvoie `true`.
        $csrf->skipCheckCallback(function ($request) {
            // Ignore la vérification du jeton pour les URLs API.
            if ($request->getParam('prefix') === 'Api') {
                return true;
            }
        });

        // S'assure que le middleware de routing est ajouté à la file avant le middleware de protection CSRF.
        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

.. note::

    Vous devez appliquer le middleware de protection CSRF seulement pour les
    routes qui gèrent des requêtes stateful en utilisant des cookies/sessions.
    Par exemple, en développant une API, les requêtes stateless ne sont pas
    affectées par CSRF, donc le middleware n'a pas besoin d'être appliqué à ces
    routes.

Intégration avec le FormHelper
------------------------------

Le ``CsrfProtectionMiddleware`` s'intègre parfaitement avec le ``FormHelper``.
Chaque fois que vous créez un formulaire avec le ``FormHelper``, cela créera un
champ caché contenant le token CSRF.

.. note::

    Lorsque vous utilisez la protection CSRF, vous devriez toujours commencer
    vos formulaires avec le ``FormHelper``. Si vous ne le faites pas, vous allez
    devoir créer manuellement les champs cachés dans chaque formulaire.

Protection CSRF et Requêtes AJAX
--------------------------------

En plus des données de la requête, les tokens CSRF peuvent être soumis *via* le
header spécial ``X-CSRF-Token``. Utiliser un header facilite généralement
l'intégration du token CSRF dans les applications qui utilisent Javascript de
manière intensive ou avec les applications API JSON / XML.

Le token CSRF peut être récupéré via le Cookie ``csrfToken``, ou en PHP *via*
l'attribut nommé ``csrfToken`` dans l'objet requête. Il est peut-être plus
facile d'utiliser le cookie si votre code Javascript se trouve dans des fichiers
séparés des templates de vue de CakePHP, ou si vous avez déjà une fonctionnalité
qui vous permet de parser des cookies avec Javascript.

Si vous avez des fichiers Javascript séparés mais que vous ne voulez pas avoir à
gérer des cookies, vous pouvez par exemple définir un token dans une variable
Javascript globale dans votre layout, en définissant un bloc script comme ceci::

    echo $this->Html->scriptBlock(sprintf(
        'var csrfToken = %s;',
        json_encode($this->request->getAttribute('csrfToken'))
    ));

Vous pouvez accéder au token par l'expression ``csrfToken`` ou
``window.csrfToken`` dans n'importe quel fichier de script qui sera chargé après
ce bloc de script.

Une autre alternative serait de placer le token dans une balise meta
personnalisée comme ceci::

    echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));

ce qui le rendrait accessible dans vos scripts en recherchant l'élément ``meta``
nommé ``csrfToken``. Avec jQuery, cela pourrait être aussi simple que ça::

    var csrfToken = $('meta[name="csrfToken"]').attr('content');

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

.. _https-enforcer-middleware:

Middleware HTTPS Enforcer
=========================

Si vous voulez que votre application soit accessible uniquement par des
connexions HTTPS, vous pouvez utiliser le ``HttpsEnforcerMiddleware``::

    use Cake\Http\Middleware\HttpsEnforcerMiddleware;

    // Toujours soulever une exception et ne jamais rediriger.
    $https = new HttpsEnforcerMiddleware([
        'redirect' => false,
    ]);

    // Envoyer un code de statut 302 en cas de redirection
    $https = new HttpsEnforcerMiddleware([
        'redirect' => true,
        'statusCode' => 302,
    ]);

    // Envoyer des headers supplémentaires dans la réponse de redirection.
    $https = new HttpsEnforcerMiddleware([
        'headers' => ['X-Https-Upgrade' => 1],
    ]);

    // Désactiver le HTTPs forcé quand ``debug`` est activé.
    $https = new HttpsEnforcerMiddleware([
        'disableOnDebug' => true,
    ]);

À la réception d'une requête non-HTTP qui n'utilise pas GET, un
``BadRequestException`` sera soulevée.

.. meta::
    :title lang=fr: Middleware Http
    :keywords lang=fr: http, middleware, psr-7, requête, réponse, wsgi, application, baseapplication, https
