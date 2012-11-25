Objetos de Requisição e Resposta
################################

Os objetos `Request` e `Response` são novos no CakePHP 2.0.
Anteriormente, estes objetos eram representados por arrays e os métodos
relacionados espalhados nas classes :php:class:`RequestHandlerComponent`,
:php:class:`Router`, :php:class:`Dispatcher` e :php:class:`Controller`.
Não havia nenhum objeto com autoridades sobre as informações contidas em uma
requisição. No CakePHP 2.0, as classes :php:class:`CakeRequest` e
:php:class:`CakeResponse` são usadas para este propósito.

.. index:: $this->request

CakeRequest
###########

A classe :php:class:`CakeRequest` é o objeto padrão para requisições usadas no
CakePHP. Ela centraliza inúmeras funcionalidades para interagir com os dados das
requisições.

A cada requisição feita, um ``CakeRequest`` é criado e passado por referência para
as várias camadas de uma aplicação que usam os dados de uma requisição. Por
padrão, ``CakeRequest`` é atribuído em ``$this->request`` e é disponibilizado
nos controller, views e helpers. Você pode também acessá-la em componentes
usando a referência do controller. Algumas das tarefas que o ``CakeRequest``
executa inclui:

* Processar os arrays GET, POST e FILES na estrutura de dados que você está
  familiarizado.
* Fornecer a introspecção do ambiente pertencente a requisição.  Coisas como
  cabeçalhos enviados, endereço IP dos clientes e informações de
  domínio/subdomínio sobre o servidor que a aplicação está rodando.
* Prover acesso aos parâmetros da requisição pelo uso de arrays ou propriedades
  do objeto.

Acessando parâmetros de uma Requisição
======================================

O CakeRequest expõe várias maneiras de acessar os parâmetros de uma requisição.
A primeira é o acesso por índices de array, a segunda maneira é pelo
``$this->request->params`` e a terceira por propriedades do objeto::

    $this->request['controller'];
    $this->request->controller;
    $this->request->params['controller']

Todas as alternativas acima irão acessar o mesmo valor.
Foram criadas várias maneiras de acessar os parâmetros para facilitar a migração
de aplicações existentes que utilizam versões antigas do Cake.
Todos os :ref:`route-elements` podem ser acessados por esta interface.

além dos :ref:`route-elements`, muitas vezes você precisará ter acesso aos 
:ref:`passed-arguments` e os :ref:`named-parameters`.  Ambos estarão disponíveis
no objeto da classe CakeRequest::

    // Argumentos passados
    $this->request['pass'];
    $this->request->pass;
    $this->request->params['pass'];

    // Parâmetros nomeados
    $this->request['named'];
    $this->request->named;
    $this->request->params['named'];

Todos irão lhe proporcionar o acesso aos argumentos passados e os parâmetros
nomeados. Existem diversos parâmetros que são importantes/úteis que o CakePHP
utiliza internamente e podem também ser encontrados nos parâmetros da
requisição:

* ``plugin`` O nome do plugin que trata a requisição. será ``null`` quando não
  for nenhum plugin.
* ``controller`` O nome do controller que trata a requisição corrente.
* ``action`` A ação responsável por manipular a requisição corrente.
* ``prefix`` O prefixo da ação corrente. Veja :ref:`prefix-routing`  para mais
  informações.
* ``bare`` Presente quando uma requisição chega por meio do método
  ``requestAction()`` e inclui a opção ``bare``.  Requisições despidas (bare)
  não possuem layouts.
* ``requested`` Presente e definida como ``true`` quando vindas de um uma
  chamada do método  ``requestAction()``.


Acessando parâmetros do tipo querystring
========================================

Parâmetros do tipo "query string" presentes tipicamente em requisições do tipo
GET podem ser lidos usando :php:attr:`CakeRequest::$query`::

    // Sendo a url /posts/index?page=1&sort=title
    $this->request->query['page'];

    // Você também pode acessar o valor via array
    $this->request['url']['page'];

Acessando dados em requisições do tipo POST
===========================================

Todos os dados encontrados em requisições do tipo POST podem ser acessados
usando o atributo :php:attr:`CakeRequest::$data`. Qualquer dado passado por
formulários que contenha o prefixo ``data`` terá este prefixo removido.
Por exemplo::

    // Uma tag input com o atributo "name" igual a 'data[Post][title]' é
    acessavel em:
    
    $this->request->data['Post']['title'];

você pode acessar a propriedade data como também pode usar o método
:php:meth:`CakeRequest::data()` para ler os dados do array de forma a evitar
erros. Qualquer chave que não exista irá retornar o valor ``null``. Desta
maneira não é preciso verificar se a chave existe antes de usá-la::

    $foo = $this->request->data('Valor.que.nao.existe');
    // $foo == null

Acessando dados XML ou JSON
===========================

Aplicações que empregam métodos :doc:`/development/rest` muitas vezes
transferem dados em formatos não codificados no padrão URL. Você pode ler estas
entradas de dados com qualquer formato usando o método
:php:meth:`CakeRequest::input()`. Fornecendo uma função de decodificação, você
pode receber o conteúdo em um formato desserializado::

    // Obtém dados codificados no formato JSON submetidos por um método PUT/POST
    $data = $this->request->input('json_decode');

Como alguns métodos de desserialização requerem parâmetros adicionais ao serem
chamados, como a opção "as array" da função ``json_decode`` ou se você quiser
um XML convertido em um objeto ``DOMDocument``, o método
:php:meth:`CakeRequest::input()` também suporta a passagem de parâmetros
adicionais::

    // Obtém dados codificados em XML submetidos por um método PUT/POST
    $data = $this->request->input('Xml::build', array('return' => 'domdocument'));

Acessando informações sobre o caminho das URLs
==============================================

O CakeRequest também fornece informações úteis sobre o caminho de sua aplicação.
O :php:attr:`CakeRequest::$base` e o :php:attr:`CakeRequest::$webroot` são úteis
para gerar urls e determinar se sua aplicação está ou não em um subdiretório.

.. _check-the-request:

Inspecionando a Requisição
==========================

Anteriormente, era preciso utilizar o :php:class:`RequestHandlerComponent`
para detectar vários aspectos de uma requisição. Estes métodos foram
transferidos para o ``CakeRequest`` e esta classe oferece uma nova interface
enquanto mantem certa compatibilidade com as versões anteriores do Cake::

    $this->request->is('post');
    $this->request->isPost();

Ambas os métodos chamados irão retornar o mesmo valor. Por enquanto os métodos
ainda são disponibilizados no RequestHandler mas são depreciados e ainda podem
ser removidos futuramente. Você também pode facilmente estender os detectores
que estão disponíveis usando o método :php:meth:`CakeRequest::addDetector()`
para criar novos tipos de detectores. Existem quatro formas diferentes de
detectores que você pode criar:

* Comparação de valores de ambiente - Uma comparação feita em valores do ambiente
  compara valores encontrados pela função :php:func:`env()` no ambiente da
  aplicação, com o valor fornecido.
* Comparação por expressão regular - Permite comparar valores encontrados pela
  função :php:func:`env()` com uma expressão regular fornecida.
* Comparação baseada em opções - Usa uma lista de opções para criar expressões
  regulares. Chamadas subsequentes para adicionar opções já fornecidas ao
  detector serão mescladas.
* Detectores do tipo Callback - Permitem fornecer um "callback" para tratar a
  verificação. O callback irá receber o objeto de requisição como parâmetro
  único.

Alguns exemplos de uso::

    // Adiciona um detector baseado em variáveis do ambiente
    $this->request->addDetector('post', array('env' => 'REQUEST_METHOD', 'value' => 'POST'));
    
    // Adicionar um detector usando expressões regulares
    $this->request->addDetector('iphone', array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i'));
    
    // Adicionar um detector baseado em uma lista de opções
    $this->request->addDetector('internalIp', array(
        'env' => 'CLIENT_IP', 
        'options' => array('192.168.0.101, '192.168.0.100')
    ));
    
    // Adiciona um detector callback. Pode ser tanto uma função anônima
    // quanto o nome de uma função a ser chamada.
    $this->request->addDetector('awesome', function ($request) {
        return isset($request->awesome);
    });

O ``CakeRequest`` também inclui métodos como :php:meth:`CakeRequest::domain()`,
:php:meth:`CakeRequest::subdomains()` e :php:meth:`CakeRequest::host()` para
ajudar em aplicações que utilizam subdomínios, tornando a vida um pouco mais
fácil.

Existem vários detectores inclusos no Cake que você já pode usar:

* ``is('get')`` Verifica se a requisição corrente é do tipo GET.
* ``is('put')`` Verifica se a requisição corrente é do tipo PUT.
* ``is('post')`` Verifica se a requisição corrente é do tipo POST.
* ``is('delete')`` Verifica se a requisição corrente é do tipo DELETE.
* ``is('head')`` Verifica se a requisição corrente é do tipo HEAD.
* ``is('options')`` Verifica se a requisição corrente é do tipo OPTIONS.
* ``is('ajax')`` Verifica se a requisição corrente acompanha o cabeçalho 
  X-Requested-with = XmlHttpRequest.
* ``is('ssl')`` Verifica se a requisição corrente é via SSL.
* ``is('flash')`` Verifica se a requisição foi feita por um objeto do Flash.
* ``is('mobile')`` Verifica se a requisição veio de uma lista comum de
  dispositivos móveis.

CakeRequest e o RequestHandlerComponent
=======================================

Como muitas das caracteristicas que o ``CakeRequest`` oferece eram de domínio
do componente :php:class:`RequestHandlerComponent`, foi preciso repensar como
esta se encaixa no quadro atual. Para o CakePHP 2.0, a classe
:php:class:`RequestHandlerComponent` age como uma cereja em cima do bolo.
Provendo uma camada adicional de funcionalidades sobre o ``CakeRequest``, como
a mudança do layout baseado no tipo de conteúdo ou chamadas em ajax.
A separação destas duas classes permitem você escolher mais facilmente o que
você quer e precisa.

Interagindo com outros aspectos da requisição
=============================================

Você pode usar o `CakeRequest` para introspectar uma variedade de coisas sobre
a requisição. Além dos detectores, você também pode encontrar outras informações
vindas de várias propriedades e métodos.

* ``$this->request->webroot`` contém o diretório webroot (a raiz do diretório
  web).
* ``$this->request->base`` contém o caminho base.
* ``$this->request->here`` contém a uri solicitada da requisição corrente.
* ``$this->request->query`` contém os parâmetros enviados por "query strings".

API do CakeRequest
==================

.. php:class:: CakeRequest

    A classe CakeRequest encapsula o tratamento e introspecção dos parâmetros
    das requisições.

.. php:method:: domain()

    Retorna o nome do domínio onde sua aplicação esta sendo executada.

.. php:method:: subdomains() 

    Retorna os subdomínios de onde sua aplicação está sendo executada em um
    formato de array.

.. php:method:: host() 

    Retorna o host em que sua aplicação esta sendo executada.

.. php:method:: method() 

    Retorna o método HTTP em que a requisição foi feita.

.. php:method:: referer() 

    Retorna o endereço que referenciou a requisição.

.. php:method:: clientIp() 

    Retorna o endereço IP do visitante corrente.

.. php:method:: header()

    Permite você acessar qualquer cabeçalho ``HTTP_*`` que tenha sido usado na
    requisição::

        $this->request->header('User-Agent');

    Retornaria o "user agent" utilizado para a solicitação.

.. php:method:: input($callback, [$options])

    Resgata os dados de entrada de uma requisição. Opcionalmente o resultado
    é passado por uma função de decodificação dos dados. Parâmetros adicionais
    para a função de decodificação podem ser passadas como argumentos para
    ``input()``.

.. php:method:: data($key) 

    Fornece acesso aos dados da requisição numa notação pontuada, permitindo a
    leitura e modificação dos dados da requisição. Chamadas também podem ser
    encadeadas::

        // Modifica alguns dados da requisição, assim você pode popular
        // previamente alguns campos dos formulários.
        $this->request->data('Post.title', 'New post')
            ->data('Comment.1.author', 'Mark');
            
        // Você também pode ler os dados.
        $value = $this->request->data('Post.title');

.. php:method:: is($check)

    Verifica se uma requisição corresponde a um certo critério. Utiliza
    os detectores inclusos por padrão além das regras adicionadas com o
    método :php:meth:`CakeRequest::addDetector()`.

.. php:method:: addDetector($name, $callback)

    Adiciona um detector para ser usado com o método ``is()``. Veja
    :ref:`check-the-request` para mais informações.

.. php:method:: accepts($type)

    Descobre quais os tipos de conteúdo que o cliente aceita ou verifica se
    ele aceita um determinado tipo de conteúdo.

    Obtém todos os tipos::

        <?php 
        $this->request->accepts();
 
    Verifica apenas um tipo::

        $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language)

    Obter todas os idiomas aceitos pelo cliente ou verifica se um determinado
    idioma é aceito.

    Obtém uma lista dos idiomas aceitos::

        CakeRequest::acceptLanguage(); 

    Verifica se um idioma específico é aceito::

        CakeRequest::acceptLanguage('es-es'); 

.. php:attr:: data

    Um array de dados enviados pelo método POST. Você pode usar o método
    :php:meth:`CakeRequest::data()` para ler o conteúdo desta propriedade de
    uma forma a suprimir avisos quando a chave informada não existir.

.. php:attr:: query

    Um array de parâmetros passados por "query strings".

.. php:attr:: params

    Um array contendo os elementos da rota e os parâmetros da requisição.

.. php:attr:: here

    Contém a uri solicitada no momento da requisição.

.. php:attr:: base

    O caminho de base para a aplicação, geralmente equivale a ``/``, ao menos
    que sua aplicação esteja em um subdiretório.

.. php:attr:: webroot

    O diretório web de sua aplicação.

.. index:: $this->response

CakeResponse
############

O :php:class:`CakeResponse` é a classe padrão para respostas no CakePHP. Ela
encapsula inúmeras características e funcionalidades para gerar respostas HTTP
em sua aplicação. Ela também auxilia nos testes da aplicação e pode ser
"forjada", permitindo inspecionar os cabeçalhos que serão enviados.
Como na classe :php:class:`CakeRequest`, o :php:class:`CakeResponse` consolida
vários métodos encontrados previamente no :php:class:`Controller`,
:php:class:`RequestHandlerComponent` e :php:class:`Dispatcher`. Os métodos
antigos foram depreciados, favorecendo o uso do :php:class:`CakeResponse`.

``CakeResponse`` fornece uma interface para envolver as tarefas comuns
relacionadas ao envio de respostas para o cliente como:

* Enviar cabeçalhos de redirecionamento.
* Enviar cabeçalhos com o tipo de conteúdo.
* Enviar qualquer outro cabeçalho.
* Enviar o corpo da resposta.

Alterando a classe de Resposta
==============================

O CakePHP utiliza o ``CakeResponse`` por padrão. O ``CakeResponse`` é uma classe
de uso flexível e transparente, mas se você precisar alterá-la por uma classe
específica da aplicação, você poderá sobrescrevê-la e e substituí-la por sua
própria classe, alterando o CakeResponse usado no arquivo index.php.

Isto fará com que todos os controllers da sua aplicação use ``CustomResponse``
ao invés de :php:class:`CakeResponse`. Você pode também substituir a instancia
utilizada, definindo o novo objeto em ``$this->response`` nos seus controllers.
sobrescrever o objeto de resposta é útil durante os testes, permitindo você
simular os métodos que interagem com o ``header()``. Veja a seção
:ref:`cakeresponse-testing` para mais informações.

Lidando com tipos de conteúdo
=============================

Você pode controlar o "`Content-Type`" da resposta de sua aplicação usando o
método :php:meth:`CakeResponse::type()`. Se sua aplicação precisa lidar com
tipos de conteúdos que não estão inclusos no CakeResponse, você também poderá
mapear estes tipos utilizando o método ``type()``::

    // Adiciona o tipo vCard
    $this->response->type(array('vcf' => 'text/v-card'));

    // Define o Content-Type para vcard.
    $this->response->type('vcf');

Normalmente você vai querer mapear os tipos de conteúdo adicionais no callback
``beforeFilter`` do seu controller, assim, se você estiver usando o 
:php:class:`RequestHandlerComponent`, poderá tirar proveito da funcionalidade
de troca de views baseado no tipo do conteúdo.

Enviando Anexos
===============

Poderá existir momentos em que você queira enviar respostas dos controllers como
sendo arquivos para downloads. Você pode conseguir este resultado usando
:doc:`/views/media-view` ou usando as funcionalidades do ``CakeResponse``.
O método :php:meth:`CakeResponse::download()` permite você enviar respostas
como arquivos para download::

    function sendFile($id) {
        $this->autoRender = false;

        $file = $this->Attachment->getFile($id);
        $this->response->type($file['type']);
        $this->response->download($file['name']);
        $this->response->body($file['content']);
        $this->response->send();
    }

O exemplo acima demonstra como você pode utilizar o ``CakeResponse`` para
gerar um arquivo para download sem precisar usar a classe
:php:class:`MediaView`. Em geral, você vai preferir utilizar a classe
``MediaView`` por possuir maiores funcionalidades que o ``CakeResponse``.

Interagindo com o cache do navegador
====================================

Algumas vezes você precisará forçar o browser do cliente a não fazer cache dos
resultados de uma ação de um controller. :php:meth:`CakeResponse::disableCache()`
é destinado para estes casos.::

    function index() {
        // faz alguma coisa.
        $this->response->disableCache();
    }

.. warning::

    Usar o ``disableCache()`` para downloads em domínios SSL enquanto tenta
    enviar arquivos para o Internet Explorer poderá resultar em erros.

Você também poderá dizer ao cliente para fazer cache da resposta. Usando
:php:meth:`CakeResponse::cache()`::

    function index() {
        // faz alguma coisa.
        $this->response->cache(time(), '+5 days');
    }

O código acima diz aos clientes para armazenar em cache a resposta resultante 
por cinco dias, podendo acelerar a experiência dos seus visitantes.

Definindo Cabeçalhos
====================

É possível definir cabeçalhos para a resposta utilizando o método
:php:meth:`CakeResponse::header()`. Podendo ser chamada de algumas formas
diferentes::

    // Define um único cabeçalho
    $this->response->header('Location', 'http://example.com');

    // Define múltiplos cabeçalhos
    $this->response->header(array('Location' => 'http://example.com', 'X-Extra' => 'My header'));
    $this->response->header(array('WWW-Authenticate: Negotiate', 'Content-type: application/pdf'));

Definir o mesmo cabeçalho múltiplas vezes irá causar a sobrescrita do valor
anterior, como numa chamada comum ao método ``header()`` do PHP. Os cabeçalhos
não serão enviados quando o método :php:meth:`CakeResponse::header()` for
chamado. Os cabeçalhos são armazenados em buffer até que a resposta seja
efetivamente enviada.

.. _cakeresponse-testing:

CakeResponse e Testes
=====================

Provavelmente uma das grandes vitórias da classe ``CakeResponse`` vem de como
ela torna mais fácil os testes de controllers e componentes. Ao invés de métodos
espalhados em diversos objetos, você precisa de apenas um simples objeto para
"forjar" e utilizar nos controllers e componentes. Isto lhe ajuda a criar seus
testes unitários mais rapidamente::

    function testSomething() {
        $this->controller->response = $this->getMock('CakeResponse');
        $this->controller->response->expects($this->once())->method('header');
        ...
    }

Adicionalmente, você consegue testar sua aplicação pela linha de comando mais
facilmente pois consegue "forjar" os cabeçalhos que quiser sem precisar ficar
tentando definir os cabeçalhos diretos na interface de linha de comandos.

API do CakeResponse
===================

.. php:class:: CakeResponse

    A classe ``CakeResponse`` fornece vários métodos úteis para interagir com
    as respostas que você envia para um cliente.

.. php:method:: header() 

    Permite você definir diretamente um ou muitos cabeçalhos para serem enviados
    com a resposta.

.. php:method:: charset() 

    Define o mapa de caracteres (`charset`) que será usado na resposta.

.. php:method:: type($type) 

    Define o tipo de conteúdo para a resposta. Você pode usar um apelido de
    um tipo conhecido de conteúdo ou usar um nome completo para o tipo
    do conteúdo.

.. php:method:: cache()

    Permite você definir os cabeçalhos de cache em sua resposta.

.. php:method:: disableCache()

    Define os cabeçalhos apropriados para desabilitar o cache da resposta pelo
    cliente.

.. php:method:: compress()

    Habilita a compressão gzip para o envio da resposta.

.. php:method:: download() 

    Permite você enviar a resposta como um anexo e definir o nome do arquivo.

.. php:method:: statusCode() 

    Permite você alterar o código do status da resposta.

.. php:method:: body()

    Define o conteúdo do corpo da resposta que será enviada.

.. php:method:: send()

    Após ter criado a resposta, chamar o método ``send()`` irá enviar os todos
    cabeçalhos definidos assim como o corpo da resposta. Isto é feito
    automaticamente no final de cada requisição pelo :php:class:`Dispatcher`.
