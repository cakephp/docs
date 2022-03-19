Filtros de Expedidor
####################

.. deprecated:: 3.3.0
    A partir da versão 3.3.0, os filtros do expedidor estão obsoletos. Você deverá usar
    :doc:`/controllers/middleware` agora.

Há vários motivos para querer que um pedaço de código seja executado antes que qualquer código do controlador
seja executado ou imediatamente antes da resposta ser enviada ao cliente, como cache de resposta, ajuste de cabeçalho,
autenticação especial ou apenas para fornecer acesso a uma missão crítica de resposta da API em menos tempo do que um
ciclo completo de envio de solicitação levaria.

O CakePHP fornece uma interface limpa para anexar filtros ao ciclo de expedição. É semelhante a uma camada de middleware,
mas reutiliza o subsistema de eventos existente usado em outras partes do CakePHP. Como eles não funcionam exatamente igual
um middleware tradicional, nos referimos a eles como *Filtros do Expedidor*.

Filtros incorporados
====================

O CakePHP vem com vários filtros de despachante embutidos. Eles lidam com recursos comuns dos quais todos os
aplicativos provavelmente precisam. Os filtros internos são:

* ``AssetFilter`` verifica se a solicitação está se referindo a um tema ou arquivo estático do plug-in,
  como CSS, JavaScript ou arquivo de imagem armazenado na pasta raiz da web de um plug-in ou na pasta
  correspondente a um Tema. Ele servirá o arquivo de acordo, se encontrado, interrompendo o restante do
  ciclo de despacho::

        // Use as opções para definir o cacheTime para seus arquivos estáticos
        // Se não estiver definido, o padrão será +1 hora
        DispatcherFactory::add('Asset', ['cacheTime' => '+24 horas']);

* ``RoutingFilter`` aplica regras de roteamento de aplicativos a URL da solicitação.
   Preenche ``$request->getParam()`` com os resultados do roteamento.
* ``ControllerFactory`` usa ``$request->getParam()`` para localizar o controlador que
   tratará da solicitação atual.
* ``LocaleSelector`` permite a troca automática de idioma a partir do ``Accept-Language``
   cabeçalho enviado pelo navegador.

Usando Filtros
==============

Os filtros geralmente são ativados no arquivo **bootstrap.php** do seu aplicativo, mas você
pode carregá-los a qualquer momento antes do envio da solicitação. A adição e remoção de filtros
é feita através de :php:class:`Cake\\Routing\\DispatcherFactory`. Por padrão, o modelo de
aplicativo CakePHP vem com algumas classes de filtro já ativadas para todas as solicitações;
vamos dar uma olhada em como eles são adicionados::

    DispatcherFactory::add('Routing');
    DispatcherFactory::add('ControllerFactory');

    // A sintaxe do plug-in também é possível
    DispatcherFactory::add('PluginName.DispatcherName');

    // Use as opções para definir a prioridade
    DispatcherFactory::add('Asset', ['priority' => 1]);

Filtros de expedidor com ``priority`` (prioridade) mais alta (números mais baixos) - serão executados primeiro.
O padrão de prioridade é ``10``.

Embora o uso do nome da string seja conveniente, você também pode passar instâncias para ``add()``::

    use Cake\Routing\Filter\RoutingFilter;

    DispatcherFactory::add(new RoutingFilter());


Configurando a Ordem dos Filtros
--------------------------------

Ao adicionar filtros, você pode controlar a ordem em que eles são chamados usando as
prioridades do manipulador de eventos. Embora os filtros possam definir uma prioridade
padrão usando a propriedade ``$_priority``, você pode definir uma prioridade específica ao
anexar o filtro::

    DispatcherFactory::add('Asset', ['priority' => 1]);
    DispatcherFactory::add(new AssetFilter(['priority' => 1]));

Quanto maior a prioridade, mais tarde esse filtro será chamado.

Aplicação condicional de filtros
--------------------------------

Se você não deseja executar um filtro em todas as solicitações, poderá usar condições
para aplicá-lo apenas algumas vezes. Você pode aplicar condições usando as opções ``for``
e ``when``. A opção ``for`` permite que você combine com substrings de URL, enquanto a
opção ``when`` permite executar uma chamada::

    // Só é executado em solicitações iniciadas com `/blog`
    DispatcherFactory::add('BlogHeader', ['for' => '/blog']);

    // Somente executa em requisições GET.
    DispatcherFactory::add('Cache', [
        'when' => function ($request, $response) {
            return $request->is('get');
        }
    ]);

O callable fornecido para ``when`` deve retornar ``true``, é quando o filtro deverá ser
executado. O responsável pela chamada pode esperar obter a solicitação e resposta atuais
como argumentos.

Construindo um filtro
=====================

Para criar um filtro, defina uma classe em **src/Routing/Filter**. Neste
exemplo, criaremos um filtro que adiciona um cookie de rastreamento para a primeira
página de destino. Primeiro, crie o arquivo e seu conteúdo deve se parecer com::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class TrackingCookieFilter extends DispatcherFilter
    {

        public function beforeDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');
            if (!$request->getCookie('landing_page')) {
                $response->cookie([
                    'name' => 'landing_page',
                    'value' => $request->here(),
                    'expire' => '+ 1 year',
                ]);
            }
        }
    }

Salve este arquivo em **src/Routing/Filter/TrackingCookieFilter.php**. Como você pode
ver, como outras classes no CakePHP, os filtros do dispatcher têm algumas convenções::

* Os nomes das classes terminam em ``Filter``.
* As classes estão no espaço de nome ``Routing\Filter``. Por exemplo,
  ``App\Routing\Filter``.
* Geralmente, os filtros estendem ``Cake\Routing\DispatcherFilter``.

`` DispatcherFilter`` expõe dois métodos que podem ser substituídos nas subclasses, eles
são ``beforeDispatch()`` e ``afterDispatch()``. Esses métodos são executados antes
ou depois da execução de qualquer controlador, respectivamente. Ambos os métodos recebem
um objeto :php:class:`Cake\\Event\\Event` contendo os objetos ``ServerRequest`` e ``Response``
(instâncias de :php:class:`Cake\\Http\\ServerRequest` e :php:class:`Cake\\Http\\Response`)
dentro da propriedade ``$data``.

Embora nosso filtro seja bastante simples, existem outras coisas interessantes que podemos
fazer nos métodos de filtro. Ao retornar um objeto ``Response``, você pode causar um curto-circuito
no processo de despacho e impedir que o controlador seja chamado. Ao retornar uma resposta, você
também deve se lembrar de chamar ``$event->stopPropagation()`` para que outros filtros não sejam chamados.

.. note::

    Quando um método beforeDispatch retorna uma resposta, o controlador e o evento
    afterDispatch não serão chamados.

Vamos agora criar outro filtro para alterar os cabeçalhos de resposta em qualquer página pública;
no nosso caso, seria qualquer coisa exibida no ``PagesController``::

    namespace App\Routing\Filter;

    use Cake\Event\Event;
    use Cake\Routing\DispatcherFilter;

    class HttpCacheFilter extends DispatcherFilter
    {

        public function afterDispatch(Event $event)
        {
            $request = $event->getData('request');
            $response = $event->getData('response');

            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

    // Em seu bootstrap.php
    DispatcherFactory::add('HttpCache', ['for' => '/pages'])

Esse filtro enviará um cabeçalho de expiração para 1 dia no futuro para todas as
respostas produzidas pelo controlador de páginas. É claro que você poderia fazer
o mesmo no controlador, este é apenas um exemplo do que poderia ser feito com
filtros. Por exemplo, em vez de alterar a resposta, você pode armazená-la em
cache usando :php:class:`Cake\\Cache\\Cache` e servir a resposta do retorno de
chamada ``beforeDispatch()``.

Embora poderosos, os filtros de despache têm o potencial de dificultar a manutenção
do seu aplicativo. Os filtros são uma ferramenta extremamente poderosa quando usados
com sabedoria e a adição de manipuladores de resposta para cada URL no seu aplicativo
não é um bom uso para eles. Lembre-se de que nem tudo precisa ser um filtro;
`Controladores` e `Componentes` geralmente são uma opção mais precisa para adicionar qualquer
código de manipulação de solicitação ao seu aplicativo.

.. meta::
    :title lang=en: Dispatcher Filters
    :description lang=en: Dispatcher filters are a middleware layer for CakePHP allowing to alter the request or response before it is sent
    :keywords lang=en: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
