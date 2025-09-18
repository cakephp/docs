Middleware de Política de Segurança de Conteúdo
###############################################

O ``CspMiddleware`` simplifica a adição de cabeçalhos Content-Security-Policy
em seu aplicativo. Antes de usá-lo, você deve instalar ``paragonie/csp-builder``:

.. code-block:: bash

    composer require paragonie/csp-builder

Você pode então configurar o middleware usando um array ou passando um 
objeto ``CSPBuilder`` construído::

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

Se desejar usar uma configuração CSP mais restrita, você pode habilitar regras CSP baseadas 
em nonce com as opções ``scriptNonce`` e ``styleNonce``. Quando habilitadas,
essas opções modificarão sua política CSP e definirão os atributos ``cspScriptNonce`` e
``cspStyleNonce`` na solicitação. Esses atributos são aplicados ao atributo ``nonce`` de todos 
os elementos de script e link CSS criados pelo ``HtmlHelper``. Isso simplifica a adoção de políticas que usam
um  `nonce-base64
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src>`__
e ``strict-dynamic`` para maior segurança e manutenção mais fácil::


    $policy = [
        // Deve existir mesmo se estiver vazio para definir nonce para script-src
        'script-src' => [],
        'style-src' => [],
    ];
    // Habilitar adição automática de nonce em scripts e tags de links CSS.
    $csp = new CspMiddleware($policy, [
        'scriptNonce' => true,
        'styleNonce' => true,
    ]);
    $middlewareQueue->add($csp);

.. meta::
    :title lang=pt: Middleware de Política de Segurança de Conteúdo
    :keywords lang=pt: segurança, Política de Segurança de Conteúdo, csp, middleware, cross-site scripting
