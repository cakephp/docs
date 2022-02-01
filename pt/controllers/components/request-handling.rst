Request Handler (Tratamento de Requisições)
###########################################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $config = [])

O componente Request Handler é usado no CakePHP para obter informações adicionais
sobre as solicitações HTTP feitas para sua aplicação. Você pode usá-lo para ver quais
tipos de conteúdo os clientes preferem, analisar automaticamente a entrada da solicitação,
definir como os tipos de conteúdo são mapeados para exibir classes ou caminhos de modelo.

Por padrão, o RequestHandler detectará automaticamente solicitações AJAX com base no
cabeçalho HTTP ``X-Requested-With`` que muitas bibliotecas JavaScript usam. Quando usado
em conjunto com :php:meth:`Cake\\Routing\\Router::extensions()`, o RequestHandler muda
automaticamente os arquivos de layout e modelo para aqueles que correspondem aos tipos
de mídia não HTML. Além disso, se existir um auxiliar com o mesmo nome que a extensão
solicitada, ele será adicionado à matriz Auxiliar de Controladores. Por fim, se os
dados XML/JSON forem enviados para seus controladores, eles serão analisados em
uma matriz atribuída a ``$this->request->getData()`` e, e pode ser acessado como
faria com os dados POST padrão. Para fazer uso do RequestHandler, ele deve ser incluído no
seu método ``initialize()``::

    class WidgetsController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        // Resto do controller
    }

Obtenção de Informações de Solicitação
======================================

O manipulador de solicitações possui vários métodos que fornecem informações sobre o
cliente e sua solicitação.

.. php:method:: accepts($type = null)

    $type pode ser uma string, uma matriz ou nulo. Se uma string, ``accept()``
    retornará ``true`` se o cliente aceitar o tipo de conteúdo. Se uma matriz
    for especificada, ``accept()`` retorna ``true`` se qualquer um dos tipos de
    conteúdo for aceito pelo cliente. Se null, retorna uma matriz dos tipos de
    conteúdo que o cliente aceita. Por exemplo::

        class ArticlesController extends AppController
        {

            public function initialize(): void
            {
                parent::initialize();
                $this->loadComponent('RequestHandler');
            }

            public function beforeFilter(EventInterface $event)
            {
                if ($this->RequestHandler->accepts('html')) {
                    // Execute o código apenas se o cliente aceitar uma resposta
                    // HTML (text/html).
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // Executar código somente XML
                }
                if ($this->RequestHandler->accepts(['xml', 'rss', 'atom'])) {
                    // Executa se o cliente aceita qualquer um dos itens acima: XML, RSS
                    // ou Atom.
                }
            }
        }

Outros métodos de detecção de 'type' de solicitação incluem:

.. php:method:: isXml()

   Retorna ``true`` se a solicitação atual aceitar XML como resposta.

.. php:method:: isRss()

    Retorna ``true`` se a solicitação atual aceitar RSS como resposta.

.. php:method:: isAtom()

    Retorna ``true`` se a chamada atual aceitar uma resposta Atom, caso contrário, false.

.. php:method:: isMobile()

    Retorna ``true`` se a sequência do agente do usuário corresponder a um
    navegador da Web móvel ou se o cliente aceitar conteúdo WAP. As sequências
    suportadas do Mobile User Agent são:

    -  Android
    -  AvantGo
    -  BlackBerry
    -  DoCoMo
    -  Fennec
    -  iPad
    -  iPhone
    -  iPod
    -  J2ME
    -  MIDP
    -  NetFront
    -  Nokia
    -  Opera Mini
    -  Opera Mobi
    -  PalmOS
    -  PalmSource
    -  portalmmm
    -  Plucker
    -  ReqwirelessWeb
    -  SonyEricsson
    -  Symbian
    -  UP.Browser
    -  webOS
    -  Windows CE
    -  Windows Phone OS
    -  Xiino

.. php:method:: isWap()

    Retorna ``true`` se o cliente aceitar conteúdo WAP.

Todos os métodos de detecção de solicitação acima podem ser usados de
maneira semelhante para filtrar a funcionalidade destinada a tipos de
conteúdo específicos. Por exemplo, ao responder a solicitações AJAX,
geralmente você deseja desativar o cache do navegador e alterar o nível
de depuração. No entanto, você deseja permitir o armazenamento em cache
para solicitações não-AJAX. O seguinte exemplo faria isso::

        if ($this->request->is('ajax')) {
            $this->response->disableCache();
        }
        // Continua ação do controlador

Decodificação Automática de Dados de Solicitação
================================================

Adicione um decodificador de dados de solicitação. O manipulador deve conter
um retorno de chamada e quaisquer argumentos adicionais para o retorno de
chamada. O retorno de chamada deve retornar uma matriz de dados contidos na
entrada da solicitação. Por exemplo, adicionar um manipulador de CSV pode
parecer::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $parser = function ($data) {
                $rows = str_getcsv($data, "\n");
                foreach ($rows as &$row) {
                    $row = str_getcsv($row, ',');
                }
                return $rows;
            };
            $this->loadComponent('RequestHandler', [
                'inputTypeMap' => [
                    'csv' => [$parser]
                ]
            ]);
        }
    }

Você pode usar qualquer `callable <https://php.net/callback>`_ para a função
de manipulação. Você também pode passar argumentos adicionais para o retorno de
chamada, isso é útil para retornos de chamada como ``json_decode``::

    $this->RequestHandler->setConfig('inputTypeMap.json', ['json_decode', true]);

O exemplo acima tornará ``$this->request->getData()`` uma matriz dos dados de entrada JSON,
sem o ``true`` adicional, você obteria um conjunto de objetos ``stdClass``.

.. versionchanged:: 3.6.0
    Você deve preferir usar :ref:`body-parser-middleware` em vez de
    RequestHandlerComponent.

VerificandoPreferências de Tipo de Conteúdo
===========================================

.. php:method:: prefers($type = null)

Determina quais tipos de conteúdo o cliente prefere. Se nenhum parâmetro
for fornecido, o tipo de conteúdo mais provável será retornado. Se $type
for uma matriz, o primeiro tipo aceito pelo cliente será retornado. A
preferência é determinada principalmente pela extensão do arquivo analisada
pelo roteador, se houver, e por uma lista de tipos de conteúdo em ``HTTP_ACCEPT``::

    $this->RequestHandler->prefers('json');

Respondendo a Solicitações
==========================

.. php:method:: renderAs($controller, $type)

Altere o modo de renderização de um controlador para o tipo especificado.
Também anexará o auxiliar apropriado à matriz auxiliar do controlador, se
disponível e ainda não estiver na matriz::

    // Force o controlador a renderizar uma resposta xml.
    $this->RequestHandler->renderAs($this, 'xml');

Este método também tentará adicionar um auxiliar que corresponda ao seu tipo de
conteúdo atual. Por exemplo, se você renderizar como ``rss``, o ``RssHelper``
será adicionado.

.. php:method:: respondAs($type, $options)

Define o cabeçalho da resposta com base nos nomes do mapa do tipo de conteúdo.
Este método permite definir várias propriedades de resposta de uma só vez::

    $this->RequestHandler->respondAs('xml', [
        // Força o download
        'attachment' => true,
        'charset' => 'UTF-8'
    ]);

.. php:method:: responseType()

Retorna o tipo de resposta atual com o Cabeçalho do tipo de conteúdo ou nulo se
ainda não tiver sido definido.

Aproveitando a Validação de Cache HTTP
======================================

O modelo de validação de cache HTTP é um dos processos usados para gateways de cache,
também conhecidos como proxies reversos, para determinar se eles podem servir uma cópia
armazenada de uma resposta ao cliente. Sob esse modelo, você economiza principalmente
largura de banda, mas, quando usado corretamente. Também é possível economizar algum
processamento da CPU, reduzindo assim os tempos de resposta.

A ativação do RequestHandlerComponent no seu controlador ativa automaticamente uma
verificação feita antes de renderizar a exibição. Essa verificação compara o objeto de
resposta com a solicitação original para determinar se a resposta não foi modificada
desde a última vez que o cliente solicitou.

Se a resposta for avaliada como não modificada, o processo de renderização da visualização
será interrompido, economizando tempo de processamento, economizando largura de banda e nenhum
conteúdo será retornado ao cliente. O código de status da resposta é então definido como ``304 Not Modified``.

Você pode desativar essa verificação automática definindo a configuração ``checkHttpCache``
como ``false``::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'checkHttpCache' => false
        ]);
    }

Usando ViewClasses Customizadas
===============================

Ao usar o JsonView/XmlView, você pode substituir a serialização padrão por uma
classe View personalizada ou adicionar classes View para outros tipos.

Você pode mapear tipos novos e existentes para suas classes personalizadas. Você
também pode definir isso automaticamente usando a configuração ``viewClassMap``::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => [
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            ]
        ]);
    }

.. meta::
    :title lang=pt: Request Handling
    :keywords lang=pt: componente manipulador, bibliotecas javascript, componentes públicos, retornos nulos, dados do modelo, dados de solicitação, tipos de conteúdo, extensões de arquivo, ajax, meth, tipo de conteúdo, matriz, conjunção, cakephp, insight, php
