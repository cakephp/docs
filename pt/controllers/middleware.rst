Middleware
##########

Os objetos de middleware permitem que você 'embrulhe' seu aplicativo em camadas
reutilizáveis e composíveis de manipulação de solicitações ou lógica de criação
de respostas. Visualmente, seu aplicativo termina no centro e o middleware é envolvido
em volta do aplicativo como uma cebola. Aqui, podemos ver um aplicativo agrupado com os
middlewares Routes, Assets, Exception Handling e CORS.

.. image:: /_static/img/middleware-setup.png

Quando um pedido é tratado pelo seu aplicativo, ele entra no middleware mais externo.
Cada middleware pode delegar a solicitação/resposta para a próxima camada ou retornar
uma resposta. O retorno de uma resposta impede que as camadas inferiores vejam a solicitação.
Um exemplo disso é o plugin AssetMiddleware manipulando uma solicitação de uma imagem de
durante o desenvolvimento.

.. image:: /_static/img/middleware-request.png

Se nenhum middleware executar uma ação para manipular a solicitação, um controlador
será localizado e terá sua ação invocada ou uma exceção será gerada gerando uma página de erro.

O middleware faz parte da nova pilha HTTP no CakePHP que aproveita as interfaces de solicitação e
resposta PSR-7. O CakePHP também suporta o padrão PSR-15 para manipuladores de solicitações de
servidor, para que você possa usar qualquer middleware compatível com PSR-15 disponível em
`The Packagist <https://packagist.org>`_.

Middleware no CakePHP
=====================

O CakePHP fornece vários middlewares para lidar com tarefas comuns em aplicativos da web:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` captura exceções do middleware encapsulado e renderiza 
    uma página de erro usando o manipulador de exceções :doc:`/development/errors`.
* ``Cake\Routing\AssetMiddleware`` verifica se a solicitação está se referindo a um
    arquivo de recursos de tema ou plugin, como um arquivo CSS, JavaScript ou de imagem armazenado
    na pasta webroot de um plugin ou na pasta correspondente de um tema.
* ``Cake\Routing\Middleware\RoutingMiddleware`` usa o ``Router`` para analisar a
    URL de entrada e atribuir parâmetros de roteamento à solicitação.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` permite a troca automática de idioma
    a partir do cabeçalho ``Accept-Language`` enviado pelo navegador.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` permite que você
    manipule cookies criptografados caso precise manipular cookies com
    dados ofuscados.
* ``Cake\Http\Middleware\BodyParserMiddleware`` permite decodificar JSON, XML
    e outros corpos de solicitação codificados com base no cabeçalho ``Content-Type``.
* :doc:`Cake\Http\Middleware\HttpsEnforcerMiddleware </security/https-enforcer>`
    requer o uso de HTTPS.
* :doc:`Cake\Http\Middleware\CsrfProtectionMiddleware </security/csrf>` adiciona
    proteção CSRF baseada em cookie de envio duplo ao seu aplicativo.
* :doc:`Cake\Http\Middleware\SessionCsrfProtectionMiddleware </security/csrf>`
    adiciona proteção CSRF baseada em sessão ao seu aplicativo.
* :doc:`Cake\Http\Middleware\CspMiddleware </security/content-security-policy>`
    simplifica a adição de cabeçalhos Content-Security-Policy ao seu aplicativo.
* :doc:`Cake\Http\Middleware\SecurityHeadersMiddleware </security/security-headers>`
    possibilita a adição de cabeçalhos relacionados à segurança, como ``X-Frame-Options``, a
    respostas.

.. _using-middleware:

Usando Middleware
=================

O middleware pode ser aplicado ao seu aplicativo globalmente ou individualmente a
escopos de roteamento.

Para aplicar o middleware a todas as solicitações, use o método ``middleware`` da sua classe
``App\Application``. O método de gancho ``middleware`` do seu aplicativo será chamado no
início do processo de solicitação; você pode usar o objeto ``MiddlewareQueue`` para anexar o
middleware::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Vincule o handler de erros à fila do middleware.
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            // Adicionar middleware por nome de classe.
            // A partir da versão 4.5.0, o middleware de nome de classe é resolvido opcionalmente
            // usando o contêiner DI. Se a classe não for encontrada no
            // contêiner, uma instância será criada pela fila de middleware.
            $middlewareQueue->add(UserRateLimiting::class);

            return $middlewareQueue;
        }
    }

Além de adicionar ao final do ``MiddlewareQueue``, você pode executar várias operações::

        $layer = new \App\Middleware\CustomMiddleware;

        // O middleware adicionado será o último da fila.
        $middlwareQueue->add($layer);

        // O middleware precedido será o primeiro da fila.
        $middlwareQueue->prepend($layer);

        // Insira em um slot específico. Se o slot estiver
        // fora dos limites, ele será adicionado ao final.
        $middlwareQueue->insertAt(2, $layer);

        // Insira antes de outro middleware.
        // Se a classe nomeada não puder ser encontrada,
        // uma exceção será gerada.
        $middlwareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insira depois de outro middleware.
        // Se a classe nomeada não puder ser encontrada, o
        // o middleware será adicionado ao final.
        $middlwareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Se o seu middleware for aplicável apenas a um subconjunto de rotas ou controllers
individuais, você pode usar :ref:`Middleware com escopo de rota <route-scoped-middleware>`,
ou :ref:`Middleware do controller <controller-middleware>`.

Adicionando Middleware a partir de Plugins
------------------------------------------

Os plug-ins podem usar seu método de gancho ``middleware`` para aplicar qualquer
middleware que eles tenham à fila de middleware do aplicativo::

    // Em plugins/ContactManager/src/Plugin.php
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;

    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            $middlwareQueue->add(new ContactManagerContextMiddleware());

            return $middlwareQueue;
        }
    }

Criando um Middleware
=====================

O middleware pode ser implementado como funções anônimas (Closures) ou classes que
estendem ``Psr\Http\Server\MiddlewareInterface``. Embora os Closures sejam
adequados para tarefas menores, eles tornam os testes mais difíceis e podem criar
uma classe ``Application`` complicada. As classes de middleware no CakePHP têm
algumas convenções:

* Os arquivos de classe Middleware devem ser colocados em ** src/Middleware**. Por exemplo:
  **src/Middleware/CorsMiddleware.php**
* As classes de middleware devem ter o sufixo ``Middleware``. Por exemplo:
  ``LinkMiddleware``.
* O Middleware deve implementar ``Psr\Http\Server\MiddlewareInterface``.

O middleware pode retornar uma resposta chamando ``$handler->handle()``
ou criando sua própria resposta. Podemos ver as duas opções em nosso middleware simples::

    // Em src/Middleware/TrackingCookieMiddleware.php
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
            // Chamar $handler->handle() delega o controle para
            // o *próximo* middleware na fila do seu aplicativo.
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

Agora que criamos um middleware muito simples, vamos anexá-lo ao nosso
aplicativo::

    // Em src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Adicione seu middleware simples à fila
            $middlwareQueue->add(new TrackingCookieMiddleware());

            // Adicione um pouco mais de middleware à fila

            return $middlwareQueue;
        }
    }


.. _routing-middleware:

Roteamento de Middleware
========================

O middleware de roteamento é responsável por aplicar as rotas da sua aplicação e
resolver o plugin, o controller e a ação para a qual uma solicitação será enviada::

    // In Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this));
    }

.. _encrypted-cookie-middleware:

Middleware de Cookie Criptografado
==================================

Se o seu aplicativo possui cookies que contêm dados que você deseja ofuscar e
proteger contra adulterações do usuário, você pode usar o middleware de cookies
criptografado do CakePHP para criptografar e descriptografar de forma transparente
os dados de cookies via middleware. Os dados dos cookies são criptografados via
OpenSSL usando AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Nomes de cookies para proteção
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlwareQueue->add($cookies);

.. note::
   É recomendável que a chave de criptografia usada para os dados do
   cookie seja usada *exclusivamente* para os dados do cookie.

Os algoritmos de criptografia e o estilo de preenchimento usados pelo middleware
do cookie são compatíveis com o ``CookieComponent`` de versões anteriores do CakePHP.

.. _body-parser-middleware:

Body Parser Middleware
======================

Se seu aplicativo aceitar JSON, XML ou outros corpos de solicitação codificados,
o ``BodyParserMiddleware`` permitirá que você decodifique essas solicitações em
uma matriz que esteja disponível em ``$request->getParsedData()`` e
``$request->getData()``. Por padrão, apenas os corpos ``json`` serão analisados,
mas a análise XML pode ser ativada com uma opção. Você também pode definir seus
próprios analisadores::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // somente JSON será analisado.
    $bodies = new BodyParserMiddleware();

    // Ativar análise XML
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Desativar a análise JSON
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Adicione seu próprio analisador que corresponda aos
    // valores do cabeçalho do tipo de conteúdo à chamada que pode analisá-los.
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use uma biblioteca de análise CSV.
        return Csv::parse($body);
    });

.. meta::
    :title lang=pt: Http Middleware
    :keywords lang=pt: http, middleware, psr-7, requisicao, resposta, wsgi, aplicataivo, baseapplication
