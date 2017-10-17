Cross Site Request Forgery
##########################

Ao habilitar o componente CSRF você obtém proteção contra ataques. `CSRF
<http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ ou Cross Site
Request Forgery (Falsificação de solicitação entre sites) é uma vulnerabilidade
comum nas aplicações web. Esta brecha permite que o atacante capture e responda
uma requisição, e as vezes envie dados através de uma requisição usando tags de
imagem ou recursos em outros domínios.

O CsrfComponent trabalha setando um cookie no navegador do usuário. Quando os
formulários são criados com o :php:class:`Cake\\View\\Helper\\FormHelper`, um input
hidden é adicionado contendo o token CSRF. Durante o evento ``Controller.startup``,
se a requisição for POST, PUT, DELETE ou PATCH o componente irá comparar os dados da 
requisição e o valor do cookie. Se um deles estiver faltando ou os dois valores forem 
imcompatíveis o componente lançará um
:php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException`.

.. note::
    Você sempre deve verificar o método HTTP que está sendo usado antes de 
    tomar uma ação. Você deve :ref:`verificar o método HTTP <cake-request>` 
    ou usar :php:meth:`Cake\\Http\\ServerRequest::allowMethod()` para garantir que o
    método HTTP correto está sendo usado.

.. versionadded:: 3.1

    O tipo da exceção  foi mudado de
    :php:class:`Cake\\Network\\Exception\\ForbiddenException` para
    :php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException`.

.. deprecated:: 3.5.0
    Você deve usar :ref:`csrf-middleware` ao invés do
    ``CsrfComponent``.

Usando o CsrfComponent
======================

Simplismente adicionando o ``CsrfComponent`` ao array de componentes,
você pode se beneficiar da proteção contra CSRF fornecida::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
    }

As configurações podem ser passadas ao componente através das configurações de componentes.
As configurações disponiveis são:

- ``cookieName`` O nome do cookie a ser enviado. O padrão é ``csrfToken``.
- ``expiry``  Quanto tempo o token CSRF deve durar. Padrão para a sessão no navegador.
  Aceita valores ``strtotime`` a partir da versão 3.1
- ``secure`` Se o cookie será ou não setado com a flag de Segurança. Isto é, o cookie só será setado em conexão HTTPS e qualquer tentativa sobre uma conexão HTTP normal irá falhar. O padrão é ``false``.
- ``field`` O nome do campo no formulário a ser checado. O padrão é ``_csrfToken``. Mudar esta opção exigirá também configurações no FormHelper.

Quando habilitado, você pode acessar o CSRF token atual fazendo uma chamada ao objeto::

    $token = $this->request->getParam('_csrfToken');

Integração com o FormHelper
===========================

O CsrfComponent integra perfeitamente com o ``FormHelper``. Toda vez que você
cria um formulário com o FormHelper, ele irá gerar um input hidden contendo o CSRF
token.

.. note::

    Quando usar o CsrfComponent você sempre deverá iniciar seus formulários com 
    o FormHelper. Senão, você precisará criar o input hidden manualmente para
    cada formulário que fizer.

Proteção CSRF e Requisições AJAX
================================

Além dos dados da requisição, os tokens CSRF podem ser enviados através
de um cabeçalho especial ``X-CSRF-Token``. Usar um cabeçalho geralmente
facilita a integração de tokens CSRF com aplicações javascript, ou APIs baseadas
em XML/JSON.

Desabilitando o Componente CSRF para Ações Específicas
======================================================

Embora não recomendado, você pode querer desabilitar o CsrfComponent em certas
requisições. Você pode fazer isto usando o ``event dispatcher`` do controller,
no método ``beforeFilter()``::

    public function beforeFilter(Event $event)
    {
        $this->eventManager()->off($this->Csrf);
    }

.. meta::
    :title lang=pt: Csrf
    :keywords lang=pt: Parametros configuraveis,componentes segurança,configuration parameters,invalid request,csrf,submission
