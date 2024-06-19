Protection CSRF
###############

Les Cross-Site Request Forgeries (CSRF) sont un type de vulnérabilité dans
lequel des commandes non autorisées sont exécutées au nom d'un utilisateur
authentifié à son insu ou sans son consentement.

CakePHP offre deux formes de protection CSRF:

* ``SessionCsrfProtectionMiddleware`` stocke les jetons CSRF en session. Cela
  nécessite que votre application ouvre la session à chaque requête, avec des
  effets collatéraux. L'avantage des jetons CSRF basés sur la session est qu'ils
  sont propres à un utilisateur, et valides seulement pendant la durée de la
  session.
* ``CsrfProtectionMiddleware`` stocke les jetons CSRF dans un cookie.
  L'utilisation d'un cookie permet de faire les vérifications CSRF
  indépendamment de l'état du serveur. Les valeurs des cookies sont vérifiées
  par un test HMAC. Toutefois, de par leur nature *stateless*, les jetons CSRF
  sont réutilisables d'un utilisateur à l'autre et d'une session à l'autre.

.. note::

    Vous ne pouvez pas utiliser ces deux approches simultanément, vous devez en
    choisir une. Si vous utilisez les deux ensemble, une erreur de jeton CSRF
    invalide se produira à chaque requête `PUT` et `POST`.

.. _csrf-middleware:

Middleware Cross Site Request Forgery (CSRF)
============================================

La protection CSRF peut être appliqué à votre application complète ou à des
'scopes' spécifiques. En ajoutant le middleware CSRF à la file des middlewares
de votre Application, vous protégez toutes les actions de l'application::

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
    use Cake\Routing\RouteBuilder;

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

.. meta::
    :title lang=fr: Protection CSRF
    :keywords lang=fr: security, csrf, cross site request forgery, middleware, session
