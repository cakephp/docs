.. _https-enforcer-middleware:

Middleware do Executor HTTPS
############################

Se você deseja que seu aplicativo esteja disponível apenas por meio de conexões HTTPS, você pode
usar o ``HttpsEnforcerMiddleware``::

    use Cake\Http\Middleware\HttpsEnforcerMiddleware;

    // Sempre gere uma exceção e nunca redirecione.
    $https = new HttpsEnforcerMiddleware([
        'redirect' => false,
    ]);

    // Enviar um código de status 302 ao redirecionar
    $https = new HttpsEnforcerMiddleware([
        'redirect' => true,
        'statusCode' => 302,
    ]);

    // Envie cabeçalhos adicionais na resposta de redirecionamento.
    $https = new HttpsEnforcerMiddleware([
        'headers' => ['X-Https-Upgrade' => 1],
    ]);

    // Desabilite a aplicação de HTTPs quando ``debug`` estiver ativado.
    $https = new HttpsEnforcerMiddleware([
        'disableOnDebug' => true,
    ]);

    // Confie somente nos cabeçalhos HTTP_X_ dos servidores listados.
    $https = new HttpsEnforcerMiddleware([
        'trustProxies' => ['192.168.1.1'],
    ]);

Se uma requisição não HTTP for recebida e não utilizar GET, uma exceção ``BadRequestException`` será gerada.

NOTA: O cabeçalho Strict-Transport-Security é ignorado pelo navegador quando seu site é acessado apenas via HTTP. 
Assim que seu site for acessado via HTTPS sem erros de certificado, o navegador saberá que seu site é compatível com 
HTTPS e respeitará o cabeçalho Strict-Transport-Security.

Adicionando Strict-Transport-Security
=====================================

Quando seu aplicativo requer SSL, é uma boa ideia definir o cabeçalho
``Strict-Transport-Security``. Este valor de cabeçalho é armazenado em cache no
navegador e informa aos navegadores que eles devem sempre se conectar via HTTPS.
Você pode configurar este cabeçalho com a opção ``hsts``::

    $https = new HttpsEnforcerMiddleware([
        'hsts' => [
            // Por quanto tempo o valor do cabeçalho deve ser armazenado em cache.
            'maxAge' => 60 * 60 * 24 * 365,
            // esta política deve ser aplicada a subdomínios?
            'includeSubDomains' => true,
            // O valor do cabeçalho deve ser armazenável em cache no serviço de pré-carregamento HSTS do Google?
            // Embora não faça parte da especificação, é amplamente implementado.
            'preload' => true,
        ],
    ]);

.. meta::
    :title lang=pt: Middleware do Executor HTTPS
    :keywords lang=pt: segurança, https, requisição https
