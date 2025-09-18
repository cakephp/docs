Proteção CSRF
#############

Falsificações de Solicitações Cruzadas (CSRF) são uma classe de exploração em que 
comandos não autorizados são executados em nome de um usuário autenticado sem seu 
conhecimento ou consentimento.

O CakePHP oferece duas formas de proteção contra CSRF:

* ``SessionCsrfProtectionMiddleware`` armazena tokens CSRF na sessão. Isso
    requer que seu aplicativo abra a sessão em cada solicitação, com
    efeitos colaterais. Os benefícios dos tokens CSRF baseados em sessão são que eles
    têm como escopo um usuário específico e são válidos apenas enquanto a sessão estiver ativa.
* ``CsrfProtectionMiddleware`` armazena tokens CSRF em um cookie. O uso de um cookie
    permite que as verificações de CSRF sejam feitas sem nenhum estado no servidor. Os valores dos cookies
    são verificados quanto à autenticidade usando uma verificação HMAC. No entanto, devido à sua
    natureza sem estado, os tokens CSRF são reutilizáveis ​​entre usuários e sessões.

.. note::

    Você não pode usar as duas abordagens a seguir juntas, você deve escolher
    apenas uma. Se você usar as duas abordagens juntas, um erro de incompatibilidade de token CSRF
    ocorrerá em cada solicitação `PUT` e `POST`

.. _csrf-middleware:

Middleware de falsificação de solicitação entre sites (CSRF)
============================================================

A proteção CSRF pode ser aplicada a toda a sua aplicação ou a escopos de roteamento
específicos. Ao aplicar um middleware CSRF à sua pilha de middleware
de aplicação, você protege todas as ações na aplicação::

    // in src/Application.php
    // Para tokens CSRF baseados em cookies.
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    // Para tokens CSRF baseados em sessão.
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

Ao aplicar a proteção CSRF aos escopos de roteamento, você pode aplicar CSRF 
condicionalmente a grupos específicos de rotas::

    // in src/Application.php
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

    // in config/routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });

Opções de middleware CSRF baseadas em cookies
---------------------------------------------

As opções de configuração disponíveis são:

- ``cookieName`` O nome do cookie a ser enviado. O padrão é ``csrfToken``.
- ``expiry`` A duração do token CSRF. O padrão é a sessão do navegador.
- ``secure`` Se o cookie será ou não definido com o sinalizador Secure. Ou seja,
    o cookie será definido apenas em uma conexão HTTPS e qualquer tentativa via HTTP normal
    falhará. O padrão é ``false``.
- ``httponly`` Se o cookie será ou não definido com o sinalizador HttpOnly.
    O padrão é ``false``. Antes da versão 4.1.0, use a opção ``httpOnly``.
- ``samesite`` Permite declarar se o seu cookie deve ser restrito a um
    contexto de primeira parte ou mesmo site. Os valores possíveis são ``Lax``, ``Strict`` e
    ``None``. O padrão é ``null``.
- ``field`` O campo do formulário a ser verificado. O padrão é ``_csrfToken``. Alterar isso
    também exigirá a configuração do FormHelper.

Opções de middleware CSRF baseadas em sessão
--------------------------------------------

As opções de configuração disponíveis são:

- ``key`` A chave de sessão a ser usada. O padrão é `csrfToken`
- ``field`` O campo do formulário a ser verificado. Alterar isso também exigirá a configuração do
    FormHelper.

Quando habilitado, você pode acessar o token CSRF atual no objeto de solicitação::

    $token = $this->request->getAttribute('csrfToken');

Caso você precise girar ou substituir o token CSRF da sessão, você pode fazer isso com::

    $this->request = SessionCsrfProtectionMiddleware::replaceToken($this->request);

.. versionadded:: 4.3.0
    O método ``replaceToken`` foi adicionado.

Ignorando verificações de CSRF para ações específicas
-----------------------------------------------------

Ambas as implementações de middleware CSRF permitem o recurso de retorno de chamada de verificação de salto
para um controle mais refinado sobre URLs para as quais a verificação de token CSRF
deve ser feita::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $csrf = new CsrfProtectionMiddleware();

        // A verificação do token será ignorada quando o retorno de chamada retornar `true`.
        $csrf->skipCheckCallback(function ($request) {
            // Skip token check for API URLs.
            if ($request->getParam('prefix') === 'Api') {
                return true;
            }
        });

        // Garanta que o middleware de roteamento seja adicionado à fila antes do middleware de proteção CSRF.
        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

.. note::

    Você deve aplicar o middleware de proteção CSRF apenas para rotas que lidam 
    com solicitações com estado usando cookies/sessões. Por exemplo, ao desenvolver 
    uma API, solicitações sem estado que não usam cookies para autenticação não são 
    afetadas pelo CSRF, portanto, o middleware não precisa ser aplicado a essas rotas.

Integração com FormHelper
-------------------------

O ``CsrfProtectionMiddleware`` integra-se perfeitamente com o ``FormHelper``. Cada
vez que você criar um formulário com o ``FormHelper``, ele inserirá um campo oculto contendo
o token CSRF.

.. note::

    Ao usar a proteção CSRF, você deve sempre iniciar seus formulários com o
    ``FormHelper``. Caso contrário, você precisará criar manualmente entradas ocultas em
    cada um dos seus formulários.

Proteção CSRF e solicitações AJAX
---------------------------------

Além dos parâmetros de dados da solicitação, os tokens CSRF podem ser enviados por meio de
um cabeçalho especial ``X-CSRF-Token``. O uso de um cabeçalho geralmente facilita a integração 
de um token CSRF com aplicativos JavaScript pesados ​​ou endpoints de API baseados em XML/JSON.

O Token CSRF pode ser obtido em JavaScript por meio do Cookie ``csrfToken`` ou em PHP
por meio do atributo do objeto de solicitação ``csrfToken``. Usar o cookie pode ser mais fácil
quando seu código JavaScript reside em arquivos separados dos templates de visualização do CakePHP
e quando você já possui a funcionalidade de analisar cookies via JavaScript.

Se você possui arquivos JavaScript separados, mas não deseja lidar com o tratamento de cookies,
você pode, por exemplo, definir o token em uma variável JavaScript global em seu layout,
definindo um bloco de script como este::

    echo $this->Html->scriptBlock(sprintf(
        'var csrfToken = %s;',
        json_encode($this->request->getAttribute('csrfToken'))
    ));

Você pode então acessar o token como ``csrfToken`` ou ``window.csrfToken`` em qualquer arquivo de script
carregado após este bloco de script.

Outra alternativa seria colocar o token em uma meta tag personalizada como esta::

    echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));

que pode ser acessado em seus scripts procurando pelo elemento ``meta`` com
o nome ``csrfToken``, que pode ser tão simples quanto isso ao usar jQuery::

    var csrfToken = $('meta[name="csrfToken"]').attr('content');

.. meta::
    :title lang=pt: Proteção CSRF
    :keywords lang=pt: segurança, csrf, cross site request forgery, middleware, sessão
