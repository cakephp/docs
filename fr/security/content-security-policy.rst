Middleware Content Security Policy
==================================

Le ``CspMiddleware`` rend les choses plus simples pour ajouter des en-têtes
Content-Security-Policy dans votre application. Avant de l'utiliser, vous devez
installer ``paragonie/csp-builder``:

.. code-block:: bash

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

Si vous voulez utiliser une configuration CSP plus stricte, vous pouvez activer
des règles CSP basées sur le nonce avec les options ``scriptNonce`` et
``styleNonce``. Lorsqu'elles sont activées, ces options vont modifier votre
politique CSP et définir les attributs ``cspScriptNonce`` et ``cspStyleNonce``
dans la requête. Ces attributs sont appliqués
à l'attribut ``nonce`` de tous les éléments scripts et liens CSS créés par
``HtmlHelper``. Cela simplifie l'adoption de stratégies utilisant un `nonce-base64
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src>`__
et ``strict-dynamic`` pour un surcroît de sécurité et une maintenance plus
facile::

    $policy = [
        // Doivent exister, même vides, pour définir le nonce pour script-src
        'script-src' => [],
        'style-src' => [],
    ];
    // Active l'ajout automatique du nonce aux tags script & liens CSS.
    $csp = new CspMiddleware($policy, [
        'scriptNonce' => true,
        'styleNonce' => true,
    ]);
    $middlewareQueue->add($csp);

.. versionadded:: 4.3.0
    Le remplissage automatique du nonce a été ajouté.

.. meta::
    :title lang=fr: Middleware Content Security Policy
    :keywords lang=fr: security, content security policy, csp, middleware, cross-site scripting
