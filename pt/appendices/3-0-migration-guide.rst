3.0 - Guia de migração
######################

Esta página resume as alterações do CakePHP 2.x e irá auxiliar na migração
do seu projeto para a versão 3.0, e também será uma referência para atualizá-lo
quanto às principais mudanças do branch 2.x. Certifique-se de ler também as
outras páginas nesse guia para conhecer todas as novas funcionalidades e
mudanças na API.

Requerimentos
=============

- O CakePHP 3.x suporta o PHP 5.4.16 e acima.
- O CakePHP 3.x precisa da extensão mbstring.
- O CakePHP 3.x precisa da extensão intl.

.. warning::

    O CakePHP 3.0 não irá funcionar se você não atender aos requisitos acima.

Ferramenta de atualização
=========================

Enquanto este documento cobre todas as alterações e melhorias feitas no
CakePHP 3.0, nós também criamos uma aplicação de console para ajudar você
a completar mais facilmente algumas das alterações mecânicas que consomem tempo.
Você pode `pegar a ferramenta de atualização no GitHub <https://github
.com/cakephp/upgrade>`_.

Layout do diretório da aplicação
================================

O Layout do diretório da aplicação mudou e agora segue o
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Você deve usar o projeto do
`esqueleto da aplicação <https://github.com/cakephp/app>`_ como um
ponto de referência quando atualizar sua aplicação.

O CakePHP deve ser instalado via Composer
=========================================

Como o CakePHP não pode mais ser instalado facilmente via PEAR, ou em um
diretório compartilhado, essas opções não são mais suportadas. Ao invés disso,
você deve usar o `Composer <http://getcomposer.org>`_ para instalar o
CakePHP em sua aplicação.

Namespaces
==========

Todas as classes do core do CakePHP agora usam namespaces e seguem as
especificações de autoload (auto-carregamento) do PSR-4. Por exemplo
**src/Cache/Cache.php** tem o namespace ``Cake\Cache\Cache``.  Constantes
globais e métodos de helpers como :php:meth:`__()` e :php:meth:`debug()` não
usam namespaces por questões de conveniência.

Constantes removidas
====================

As seguintes constantes obsoletas foram removidas:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

Configuração
============

As configurações no CakePHP 3.0 estão significativamente diferentes que nas
versões anteriores. Você deve ler a documentação :doc:`/development/configuration`
para ver como a configuração é feita.

Você não pode mais usar o ``App::build()`` para configurar caminhos adicionais
de classes. Ao invés disso, você deve mapear caminhos adicionais usando o
autoloader da sua aplicação. Veja a seção
:ref:`Caminhos de Classes Adicionais <additional-class-paths>` para mais
informações.

Três novas variáveis de configuração fornecem o caminho de configuração para
plugins, views e arquivos de localização. Você pode adicionar vários caminhos em
``App.paths.templates``, ``App.paths.plugins``, ``App.paths.locales`` para
configurar múltiplos caminhos para templates, plugins e arquivos de localização
respectivamente.

A chave de configuração ``www_root`` mudou para ``wwwRoot`` devido a
consistência. Por favor, ajuste seu arquivo de configuração ``app.php`` assim
como qualquer uso de ``Configure::read('App.wwwRoot')``.

Novo ORM
========

O CakePHP 3.0 possui um novo ORM que foi refeito do zero. O novo ORM é
significativamente diferente e incompatível com o anterior. Migrar para o novo
ORM necessita de alterações extensas em qualquer aplicação que esteja sendo
atualizada. Veja a nova documentação :doc:`/orm` para informações de como usar
o novo ORM.

Básico
======

* O ``LogError()`` foi removido, ele não tinha vantagens e era raramente ou
  mesmo, nunca usado.
* As seguintes funções globais foram removidas: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Debug
=====

* A função ``Configure::write('debug', $bool)`` não suporta mais 0/1/2. Um
  boleano simples é usado para mudar o modo de debug para ligado ou desligado.

Especificações/Configurações de objetos
=======================================

* Os objetos usados no CakePHP agora tem um sistema consistente de armazenamento/recuperação
  de configuração-de-instância. Os códigos que anteriormente acessavam, por exemplo
  ``$object->settings``, devem ser atualizados para usar ``$object->config()``
  alternativamente.

Cache
=====

* ``Memcache`` foi removido, use
  :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` alternativamente.
* Cache engines são carregados sob demanda no primeiro uso.
* :php:meth:`Cake\\Cache\\Cache::engine()` foi adicionado.
* :php:meth:`Cake\\Cache\\Cache::enabled()` foi adicionado. Substituindo a
  opção de configuração ``Cache.disable``.
* :php:meth:`Cake\\Cache\\Cache::enable()` foi adicionado.
* :php:meth:`Cake\\Cache\\Cache::disable()` foi adicionado.
* Configuração de cache agora é imutável. Se você precisa alterar a
  configuração, será necessário desfazer-se da configuração e recriá-la. Isso
  previne problemas de sincronização com as opções de configuração.
* ``Cache::set()`` foi removido. É recomendado criar múltiplas configurações de
  cache para substituir ajustes de configuração em tempo de execução
  anteriormente possíveis com ``Cache::set()``.
* Todas as subclasses ``CacheEngine`` agora implementam um método ``config()``.
* :php:meth:`Cake\\Cache\\Cache::readMany()`,
  :php:meth:`Cake\\Cache\\Cache::deleteMany()`,
  e :php:meth:`Cake\\Cache\\Cache::writeMany()` foram adicionados.

Todos os métodos :php:class:`Cake\\Cache\\Cache\\CacheEngine` agora são
responsáveis por manipular o prefixo chave configurado. O
:php:meth:`Cake\\Cache\\CacheEngine::write()` não mais permite definir a
duração na escrita, a duração é captada pela configuração de tempo de execução
do mecanismo de cache. Chamar um método cache com uma chuva vazia irá lançar
uma :php:class:`InvalidArgumentException` ao invés de retornar ``false``.

Core
====

App
---

- ``App::pluginPath()`` foi removido. Use ``CakePlugin::path()``
  alternativamente.
- ``App::build()`` foi removido.
- ``App::location()`` foi removido.
- ``App::paths()`` foi removido.
- ``App::load()`` foi removido.
- ``App::objects()`` foi removido.
- ``App::RESET`` foi removido.
- ``App::APPEND`` foi removido.
- ``App::PREPEND`` foi removido.
- ``App::REGISTER`` foi removido.

Plugin
------

- O :php:meth:`Cake\\Core\\Plugin::load()` não configura a carga automática 
  a menos que você defina a opção ``autoload`` como ``true``.
- Quanto estiver carregando plugins você não pode mais fornecer um ``callable``.
- Quanto estiver carregando plugins você não pode mais fornecer um array de
  arquivos de configuração para carregar.
  

Configure
---------

- O ``Cake\Configure\PhpReader`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig`
- O ``Cake\Configure\IniReader`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig`
- O ``Cake\Configure\ConfigReaderInterface`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface`
- O :php:meth:`Cake\\Core\\Configure::consume()` foi adicionado.
- O :php:meth:`Cake\\Core\\Configure::load()` agora espera o nome de arquivo 
  sem o sufixo de extensão como isso pode ser derivado do mecanismo.
  Ex.: para usar o PhpConfig use ``app`` para carregar ``app.php``.
- Definir uma variável ``$config`` no arquivo PHP config está obsoleto.
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` agora espera que o
  arquivo de configuração retorne um array.
- Um novo mecanismo de configuração :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig` 
  foi adicionado.

Object
------

A classe ``Object`` foi removida. Ela anteriormente continha 
um monte de métodos que eram utilizados em vários locais no framework. 
O mais útil destes métodos foi extraido como um ``trait``.
Você pode usar o :php:trait:`Cake\\Log\\LogTrait` para acessar o método
``log()``. O :php:trait:`Cake\\Routing\\RequestActionTrait` fornece o
método ``requestAction()``.

Console
=======

O executável ``cake`` foi movido do diretório ``app/Console`` para o diretório
``bin`` dentro do esqueleto da aplicação. Você pode agora invocar o console do
CakePHP com ``bin/cake``.

TaskCollection Substituído
--------------------------

Essa classe foi renomeada para :php:class:`Cake\\Console\\TaskRegistry`.
Veja a seção em :doc:`/core-libraries/registry-objects` para mais informações
sobre funcionalidades fornecidas pela nova classe. Você pode usar o ``cake 
upgrade rename_collections`` para ajuda ao atualizar seu código. Tarefas não
tem mais acesso a callbacks, como nunca houve nenhum callback para se usar.

Shell
-----

- O ``Shell::__construct()`` foi alterado. Ele agora usa uma instância de
  :php:class:`Cake\\Console\\ConsoleIo`.
- O ``Shell::param()`` foi adicionado como um acesso conveniente aos parâmetros.

Adicionalmente todos os métodos shell serão transformados em camel case quando 
invocados. Por exemplo, se você tem um método ``hello_world()`` dentro de um
shell e chama ele com ``bin/cake my_shell hello_world``, você terá que renomear
o método para ``helloWorld``. Não há necessidade de mudanças no modo que você
chama os métodos/comandos.

ConsoleOptionParser
-------------------

- O ``ConsoleOptionParser::merge()`` foi adicionado para mesclar os parsers.

ConsoleInputArgument
--------------------

- O ``ConsoleInputArgument::isEqualTo()`` foi adicionado para comparar dois argumentos.

Shell / Tarefa
==============

Os Shells e Tarefas foram movidas de ``Console/Command`` e
``Console/Command/Task`` para ``Shell`` e ``Shell/Task``, respectivamente.

ApiShell Removido
-----------------

O ApiShell foi removido pois ele não fornecia nenhum beneficio além do
próprio arquivo fonte e da documentação/`API <https://api.cakephp.org/>`_ online.

SchemaShell Removido
--------------------

O SchemaShell foi removido como ele nunca foi uma implementação completa de migração de
banco de dados e surgiram ferramentas melhores como o `Phinx <https://phinx.org/>`_. 
Ele foi substituído pelo `CakePHP Migrations Plugin <https://github.com/cakephp/migrations>`_ 
que funciona como um empacotamento entre o CakePHP e o `Phinx <https://phinx.org/>`_.

ExtractTask
-----------

- O ``bin/cake i18n extract`` não inclui mais mensagens de validação sem tradução.
  Se você quiser mensagens de validação traduzidas você deve encapsula-las com
  chamadas `__()` como qualquer outro conteúdo.

BakeShell / TemplateTask
------------------------

- O Bake não faz mais parte do fonte do núcleo e é suplantado pelo 
  `CakePHP Bake Plugin <https://github.com/cakephp/bake>`_
- Os templates do Bake foram movidos para **src/Template/Bake**.
- A sintaxe dos templates do Bake agora usam tags estilo erb (``<% %>``) para denotar
  lógica de template, permitindo código php ser tratado como texto plano.
- O comando ``bake view`` foi renomeado para ``bake template``.


Eventos
=======

O método ``getEventManager()``, foi removido de todos os objetos que continham.
Um método ``eventManager()`` é agora fornecido pelo ``EventManagerTrait``. O
``EventManagerTrait`` contém a lógica de instanciação e manutenção de uma
referência para um gerenciador local de eventos.

O subsistema ``Event`` teve um monte de funcionalidades opcionais removidas.
Quando despachar eventos você não poderá mais usar as seguintes opções:

* ``passParams`` Essa opção está agora ativada sempre implicitamente. Você
  não pode desliga-la.
* ``break`` Essa opção foi removida. Você deve agora parar os eventos.
* ``breakOn`` Essa opção foi removida. Você deve agora parar os eventos.

Log
===

* As configurações do Log agora não imutáveis. Se você precisa alterar a configuração
  você deve primeiro derrubar a configuração e então recria-la. Isso previne problemas
  de sincronização com opções de configuração.
* Os mecanismos de Log agora são carregados tardiamente após a primeira escrita nos logs.
* O :php:meth:`Cake\\Log\\Log::engine()` foi adicionado.
* Os seguintes métodos foram removidos de :php:class:`Cake\\Log\\Log` ::
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()``.
* Você não pode mais criar níveis personalizados usando ``Log::levels()``.
* Quando configurar os loggers você deve usar ``'levels'`` ao invés de ``'types'``.
* Você não pode mais especificar níveis personalizados de log. Você deve usar o conjunto
  padrão de níveis de log. Você deve usar escopos de log para criar arquivos de log
  personalizados ou manipulações específicas para diferentes seções de sua aplicação.
  Usando um nível de log não padrão irá lançar uma exceção.
* O :php:trait:`Cake\\Log\\LogTrait` foi adicionado. Você pode usar este trait em suas
  classes para adicionar o método ``log()``.
* O escopo de log passado para :php:meth:`Cake\\Log\\Log::write()` é agora
  encaminhado para o método ``write()`` dos mecanismos de log de maneira a fornecer
  um melhor contexto para os mecanismos.
* Os mecanismos de Log agora são necessários para implementar ``Psr\Log\LogInterface`` invés do
  próprio ``LogInterface`` do Cake. Em geral, se você herdou o :php:class:`Cake\\Log\\Engine\\BaseEngine`
  você só precisa renomear o método ``write()`` para ``log()``.
* O :php:meth:`Cake\\Log\\Engine\\FileLog` agora grava arquivos em ``ROOT/logs`` no lugar de ``ROOT/tmp/logs``.

Roteamento
==========

Parâmetros Nomeados
-------------------

Os parâmetros nomeados foram removidos no 3.0. Os parâmetros nomeados foram
adicionados no 1.2.0 como uma versão 'bonita' de parâmetros de requisição.
Enquanto o benefício visual é discutível, os problemas criados pelos parâmetros
nomeados não são.

Os parâmetros nomeados necessitam manipulação especial no CakePHP assim como
em qualquer biblioteca PHP ou JavaScript que necessite interagir com eles,
os parâmetros nomeados não são implementados ou entendidos por qualquer biblioteca
*exceto* o CakePHP.  A complexidade adicionada e o código necessário para dar suporte
aos parâmetros nomeados não justificam a sua existência, e eles foram removidos.
No lugar deles, você deve agora usar o padrão de parâmetros de requisição
(querystring) ou argumentos passados configurados nas rotas. Por padrão 
o ``Router`` irá tratar qualquer parâmetro adicional ao ``Router::url()`` 
como argumentos de requisição.

Como muitas aplicações ainda precisarão analisar URLs contendo parâmetros nomeados,
o :php:meth:`Cake\\Routing\\Router::parseNamedParams()` foi adicionado para
permitir compatibilidade com URLs existentes.


RequestActionTrait
------------------

- O :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` teve algumas de 
  suas opções extras alteradas:

  - o ``options[url]`` é agora ``options[query]``.
  - o ``options[data]`` é agora ``options[post]``.
  - os parâmetros nomeados não são mais suportados.

Roteador
--------

* Os parâmetros nomeados foram removidos, veja acima para mais informações.
* A opção ``full_base`` foi substituída com a opção ``_full``.
* A opção ``ext`` foi substituída com a opção ``_ext``.
* As opções ``_scheme``, ``_port``, ``_host``, ``_base``, ``_full``, ``_ext`` 
  foram adicionadas.
* As URLs em strings não são mais modificados pela adição de 
  plugin/controller/nomes de prefixo.
* A manipulação da rota padrão de ``fallback`` foi removida. Se nenhuma rota
  combinar com o conjunto de parâmetros, o ``/`` será retornado.
* As classes de rota são responsáveis por *toda* geração de URLs
  incluindo parâmetros de requisição (query string). Isso faz com que as
  rotas sejam muito mais poderosas e flexíveis.
* Parâmetros persistentes foram removidos. Eles foram substituídos pelo
  :php:meth:`Cake\\Routing\\Router::urlFilter()` que permite um jeito
  mais flexível para mudar URLs sendo roteadas reversamente.
* O ``Router::parseExtensions()`` foi removido. Use o 
  :php:meth:`Cake\\Routing\\Router::extensions()` no lugar. Esse método
  **deve** ser chamado antes das rotas serem conectadas. Ele não irá modificar
  rotas existentes.
* O ``Router::setExtensions()`` foi removido. Use o
  :php:meth:`Cake\\Routing\\Router::extensions()` no lugar.
* O ``Router::resourceMap()`` foi removido.
* A opção ``[method]`` foi renomeada para ``_method``.
* A habilidade de combinar cabeçalhos arbitrários com parâmetros no estilo
  ``[]`` foi removida. Se você precisar combinar/analisar em condições 
  arbitrárias considere usar classes personalizadas de roteamento.
* O ``Router::promote()`` foi removido.
* O ``Router::parse()`` irá agora lançar uma exceção quando uma URL não puder
  ser atendida por nenhuma rota.
* O ``Router::url()`` agora irá lançar uma exceção quando nenhuma rota combinar
  com um conjunto de parâmetros.
* Os escopos de rotas foram adicionados. Escopos de rotas permitem você
  manter seu arquivo de rotas limpo e dar dicas de rotas em como otimizar
  análise e reversão de rotas de URL.

Route
-----

* O ``CakeRoute`` foi renomeado para ``Route``.
* A assinatura de ``match()`` mudou para ``match($url, $context = [])``.
  Veja :php:meth:`Cake\\Routing\\Route::match()` para mais informações sobre
  a nova assinatura.

Configuração de Filtros do Despachante Mudaram
----------------------------------------------

Os filtros do despachante não são mais adicionados em sua aplicação usando
o ``Configure``. Você deve agora anexa-los com 
:php:class:`Cake\\Routing\\DispatcherFactory`. Isso significa que sua 
aplicação usava ``Dispatcher.filters``, você deve usar agora o método
:php:meth:`Cake\\Routing\\DispatcherFactory::add()`.

Além das mudanças de configuração, os filtros do despachante tiveram algumas
convenções atualizadas e novas funcionalidades. Veja a documentação em
:doc:`/development/dispatch-filters` para mais informações.

Filter\AssetFilter
------------------

* Os itens de plugins e temas manipulados pelo AssetFilter não são mais lidos via
  ``include``, ao invés disso eles são tratados como arquivos de texto plano.
  Isso corrige um número de problemas com bibliotecas javascript como 
  TinyMCE e ambientes com short_tags ativadas.
* O suporte para a configuração ``Asset.filter`` e ganchos foram removidos. Essa
  funcionalidade pode ser facilmente substituída  com um plugin ou filtro de despachante.

Rede
====

Requisição
----------

* O ``CakeRequest`` foi renomeada para :php:class:`Cake\\Network\\Request`.
* O :php:meth:`Cake\\Network\\Request::port()` foi adicionado.
* O :php:meth:`Cake\\Network\\Request::scheme()` foi adicionado.
* O :php:meth:`Cake\\Network\\Request::cookie()` foi adicionado.
* O :php:attr:`Cake\\Network\\Request::$trustProxy` foi adicionado. Isso torna mais fácil
  colocar aplicações CakePHP atrás de balanceadores de carga.
* O :php:attr:`Cake\\Network\\Request::$data` não é mais mesclado com a chave de dados
  prefixada, pois esse prefixo foi removido.
* O :php:meth:`Cake\\Network\\Request::env()` foi adicionado.
* O :php:meth:`Cake\\Network\\Request::acceptLanguage()` mudou de um método estático
  para não-estático.
* O detector de requisição para dispositivos móveis foi removido do núcleo. Agora o app
  template adiciona detectores para dispositivos móveis usando a biblioteca ``MobileDetect``.
* O método ``onlyAllow()`` foi renomeado para ``allowMethod()`` e não aceita mais "argumentos var".
  Todos os nomes de métodos precisam ser passados como primeiro argumento,
  seja como string ou como array de strings.

Resposta
--------

* O mapeamento do mimetype ``text/plain`` para extensão ``csv`` foi removido.
  Como consequência o :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  não define a extensão para ``csv`` se o cabeçalho ``Accept`` tiver o mimetype ``text/plain``
  que era um problema comum quando recebia uma requisição XHR do jQuery.
  

Sessões
=======

A classe de sessão não é mais estática, agora a sessão (session) pode ser
acessada através do objeto de requisição (request). Veja a documentação em
:doc:`/development/sessions` para ver como usar o objeto de sessão.

* O :php:class:`Cake\\Network\\Session` e classes de sessão relacionadas 
  foram movidas para o namespace ``Cake\Network``.
* O ``SessionHandlerInterface`` foi removido em favor ao fornecido pelo
  próprio PHP.
* A propriedade ``Session::$requestCountdown`` foi removida.
* O funcionalidade de sessão ``checkAgent`` foi removida. Ela causava um 
  monte de bugs quando quadros do chrome e o flash player estavam envolvidos.
* A convenção de nome para a tabela de sessão no banco de dados agora é
  ``sessions`` ao invés de ``cake_sessions``.
* O cookie de tempo limite da sessão é atualizado automaticamente em conjunto 
  com o tempo limite dos dados de sessão.
* O caminho padrão para o cookie de sessão agora é o caminho base da aplicação,
  ao invés de "/". Além disso, uma nova variável de configuração ``Session.cookiePath`` 
  foi adicionada para facilitar a personalização do caminho para os cookies.
* Um novo método conveniente :php:meth:`Cake\\Network\\Session::consume()` foi adicionado
  para permitir a leitura e exclusão de dados de sessão em um único passo.
* O valor padrão do argumento ``$renew`` de :php:meth:`Cake\\Network\\Session::clear()`
  mudou de ``true`` para ``false``.

Network\\Http
=============

* O ``HttpSocket`` agora é :php:class:`Cake\\Network\\Http\\Client`.
* O Http\Client foi reescrito do zero. Ele tem uma API mais simples/fácil
  de usar, suporta novos sistemas de autenticação como OAuth, e uploads de arquivos.
  Ele usa as API de stream do PHP de modo que não há requerimentp para o cURL. Veja a
  documentação :doc:`/core-libraries/httpclient` para mais informações.

Network\\Email
==============

* O :php:meth:`Cake\\Network\\Email\\Email::config()` agora é usado para definir
  perfis de configuração. Isso substitui as classes ``EmailConfig`` nas versões
  anteriores.
* O :php:meth:`Cake\\Network\\Email\\Email::profile()` substitui o ``config()`` 
  como modo de modificar opções de configuração por instância.
* O :php:meth:`Cake\\Network\\Email\\Email::drop()` foi adicionado para permitir a 
  remoção de configurações de email.
* O :php:meth:`Cake\\Network\\Email\\Email::configTransport()` foi adicionado para
  permitir a definição de configurações de transporte. Essa mudança retira as opções
  de transporte dos perfis de entrega e permite a você reusar facilmente os transportes
  através de perfis de e-mails.
* O :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` foi adicionado para permitir
  a remoção de configurações de transporte.
  

Controller
==========

Controller
----------

- As propriedades ``$helpers`` e ``$components`` agora estão mescladas
  com **todas** classes pai, não apenas a ``AppController`` e o plugin de
  AppController. As propriedades são mescladas de modo diferente agora também.
  No lugar de todas as configurações em todas as classes serem mescladas juntas, 
  as configurações definidas nas classes filho serão usadas. Isso quer dizer 
  que se você tem alguma configurações definida no seu AppController, 
  e alguma configuração definida em uma a subclasse, apenas a configuração na
  subclasse será usada.
- O ``Controller::httpCodes()`` foi removido, use o
  :php:meth:`Cake\\Network\\Response::httpCodes()` no lugar.
- O ``Controller::disableCache()`` foi removido, use o
  :php:meth:`Cake\\Network\\Response::disableCache()` no lugar.
- O ``Controller::flash()`` foi removido. Esse método era raramente usado em
  aplicações reais e não tinha mais propósito algum.
- O ``Controller::validate()`` e ``Controller::validationErrors()`` foram
  removidos. Eles eram restos dos dias do 1.x onde as preocupações com os
  models + controllers eram muito mais entrelaçados.
- O ``Controller::loadModel()`` agora carrega uma tabela de objetos.
- A propriedade ``Controller::$scaffold`` foi removida. O scaffolding dinâmico
  foi removido do núcleo do CakePHP.  Um plugin de scaffolding melhorado, 
  chamado CRUD, pode ser encontrado em: https://github.com/FriendsOfCake/crud
- A propriedade ``Controller::$ext`` foi removida. Você deve agora estender e
  sobrescrever a propriedade ``View::$_ext`` se você deseja usar uma extensão
  de  arquivo de visão não padrão.
- A propriedade ``Controller::$methods`` foi removida. Você deve usar o
  ``Controller::isAction()`` para determinar quando ou não um nome de método
  é uma ação. Essa mudança foi feita para permitir personalizações mais fáceis
  do que vai contar ou não como uma ação.
- A propriedade ``Controller::$Components`` foi removida e substituída pelo
  ``_components``. Se você precisar carregar componentes em tempo de execução
  você deve usar o ``$this->loadComponent()`` em seu controller.
- A assinatura do :php:meth:`Cake\\Controller\\Controller::redirect()` mudou
  para ``Controller::redirect(string|array $url, int $status = null)``.
  O terceiro argumento ``$exit`` foi removido. O método não pode mais enviar
  resposta e sair do script, no lugar ele retorna uma instância de ``Response``
  com os cabeçalhos apropriados definidos.
- As propriedades mágicas ``base``, ``webroot``, ``here``, ``data``,  ``action``,
  e ``params`` foram removidas. Você deve acessar todas essas propriedades em 
  ``$this->request`` no lugar.
- Métodos de controlar prefixados com sublinhado como ``_someMethod()`` não são
  mais tratados como métodos privados. Use as palavras chaves de visibilidade
  apropriadas no lugar. Somente métodos públicos podem ser usados como ação
  de controllers.

Scaffold Removido
-----------------

O scaffolding dinâmico no CakePHP foi removido do núcleo do CakePHP. Ele não era
usado com frequência, e não era voltado para uso em produção. Um plugin melhorado
de scaffolding, chamado CRUD, pode ser encontrado em:
https://github.com/FriendsOfCake/crud

ComponentCollection Substituído
-------------------------------

Essa classe foi renomeada para :php:class:`Cake\\Controller\\ComponentRegistry`.
Veja a seção em :doc:`/core-libraries/registry-objects` para mais informações
sobre as funcionalidades fornecidas pela nova classe. Você pode usar o 
``cake upgrade rename_collections`` para ajudar você a atualizar o seu
código.

Components
----------

* A propriedade ``_Collection`` é agora ``_registry``. Ela contém uma instância 
  do :php:class:`Cake\\Controller\\ComponentRegistry` agora.
* Todos components devem agora usar o método ``config()`` para obter/definir
  configurações.
* A configuração padrão para components deve ser definido na propriedade
  ``$_defaultConfig``. Essa propriedade é automaticamente mesclada com qualquer 
  configuração fornecida pelo construtor.
* Opções de configuração não são mais definidas como propriedades públicas.
* O método ``Component::initialize()`` não é mais um ``event listener``
  (ouvinte de eventos).
  Ao invés disso, ele é um gancho pós-construtor como o ``Table::initialize()`` e
  ``Controller::initialize()``. O novo método ``Component::beforeFilter()`` é
  ligado ao mesmo evento que o ``Component::initialize()`` costumava ser. O
  método de inicialização deve ter a seguinte assinatura ``initialize(array
  $config)``.

Controller\\Components
======================

CookieComponent
---------------

- Ele usa o :php:meth:`Cake\\Network\\Request::cookie()` para ler os dados de
  cookies, isso facilita os testes, e permite o ControllerTestCase definir os
  cookies.
- Os Cookies encriptados pelas versões anteriores do CakePHP usando o método 
  ``cipher()``, agora não podem ser lidos, pois o ``Security::cipher()`` foi 
  removido. Você precisará reencriptar os cookies com o método ``rijndael()`` ou 
  ``aes()`` antes de atualizar.
- O ``CookieComponent::type()`` foi removido e substituído com dados de 
  configuração acessados através de ``config()``.
- O ``write()`` não aceita mais os parâmetros ``encryption`` ou ``expires``.
  Os dois agora são gerenciados através de dados de configuração.
  Veja :doc:`/controllers/components/cookie` para mais informações.
- O caminho padrão para os cookies agora é o caminho base da aplicação, ao 
  invés de "/".

AuthComponent
-------------

- O ``Default`` é agora o hasher de senhas padrão usado pelas classes de 
  autenticação. Ele usa exclusivamente o algoritmo de hash bcrypt. Se você
  desejar continuar usando o hash SHA1 usado no 2.x, use ``'passwordHasher' => 'Weak'`` nas configurações de seu autenticador.
- O novo ``FallbackPasswordHasher`` foi adicionado para ajudar os usuários
  migrar senhas antigas de um algoritmo para o outro. Veja a documentação do
  AuthComponent para mais informações.
- A classe ``BlowfishAuthenticate`` foi removida. Apenas use ``FormAuthenticate``.
- A classe ``BlowfishPasswordHasher`` foi removida. Use o 
  ``DefaultPasswordHasher`` no lugar.
- O método ``loggedIn()`` foi removido. Use o ``user()`` no lugar.
- As opções de configuração não são mais definidas como propriedades públicas.
- Os métodos ``allow()`` e ``deny()`` não aceitam mais "var args". Todos os 
  nomes de métodos precisam ser passados como primeiro argumento, seja como 
  string ou array de strings.
- O método ``login()`` foi removido e substituído por ``setUser()``.
  Para logar um usuário agora você deve chamar ``identify()`` que retorna
  as informações do usuário caso identificado com sucesso e então usar 
  ``setUser()`` para salvar as informações na sessão de maneira persistente 
  entre as requisições.
- O ``BaseAuthenticate::_password()`` foi removido. Use a classe ``PasswordHasher``
  no lugar.
- O ``BaseAuthenticate::logout()`` foi removido.
- O ``AuthComponent`` agora dispara dois eventos ``Auth.afterIdentify`` e
  ``Auth.logout`` após um usuário ser identificado e antes de um usuário ser
  deslogado respectivamente. Você pode definir funções de callback para esses 
  eventos retornando um array mapeado no método ``implementedEvents()`` de
  sua classe de autenticação.

Classes relacionadas a ACL foram movidas para um plugin separado. 
Hashers de senha, fornecedores de Autenticação e Autorização foram
movidos para o namespace ``\Cake\Auth``. Você DEVE mover seus fornecedores
e hashers para o namespace ``App\Auth`` também.

RequestHandlerComponent
-----------------------

- Os seguintes métodos foram removidos do componente RequestHandler:
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Use o método :php:meth:`Cake\\Network\\Request::is()` no lugar com o argumento relevante.
- O ``RequestHandler::setContent()`` foi removido, use :php:meth:`Cake\\Network\\Response::type()` no lugar.
- O ``RequestHandler::getReferer()`` foi removido, use :php:meth:`Cake\\Network\\Request::referer()` no lugar.
- O ``RequestHandler::getClientIP()`` foi removido, use :php:meth:`Cake\\Network\\Request::clientIp()` no lugar.
- O ``RequestHandler::getAjaxVersion()`` foi removido.
- O ``RequestHandler::mapType()`` foi removido, use :php:meth:`Cake\\Network\\Response::mapType()` no lugar.
- As opções de configuração não são mais definidas como propriedades públicas.

SecurityComponent
-----------------

- Os seguintes métodos e as propriedades relacionadas foram removidas do componente
  Security: ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Use o :php:meth:`Cake\\Network\\Request::allowMethod()` no lugar.
- ``SecurityComponent::$disabledFields()`` foi removido, use o
  ``SecurityComponent::$unlockedFields()``.
- As funções relacionadas ao CSRF no SecurityComponent foram extraídas e movidas em
  separado no CsrfComponent. Isso permite que você use a proteção CSRF facilmente
  sem ter que usar prevenção de adulteração de formulários.
- As opções de configuração não são mais definidas como propriedades públicas.
- Os métodos ``requireAuth()`` e ``requireSecure()`` não aceitam mais "var args".
  Todos os nomes de métodos precisam ser passados como primeiro argumento, seja como 
  string ou array de strings.

SessionComponent
----------------

- O ``SessionComponent::setFlash()`` está obsoleto. Você deve usar o
  :doc:`/controllers/components/flash` no lugar.

Error
-----

ExceptionRenderers personalizados agora espera-se que retornem ou um objeto
:php:class:`Cake\\Network\\Response` ou uma string quando renderizando erros. 
Isso significa que qualquer método que manipule exceções específicas devem retornar
uma resposta ou valor de string.

Model
=====

A camada de model do 2.x foi completamente reescrita e substituída.
Você deve revisar o :doc:`/appendices/orm-migration` para saber como
usar o novo ORM.

- A classe ``Model`` foi removida.
- A classe ``BehaviorCollection`` foi removida.
- A classe ``DboSource`` foi removida.
- A classe ``Datasource`` foi removida.
- As várias classes de fonte de dados foram removidas.

ConnectionManager
-----------------

- O ConnectionManager (gerenciador de conexão) foi movido para o namespace
  ``Cake\Datasource``.
- O ConnectionManager teve os seguintes métodos removidos:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- O :php:meth:`~Cake\\Database\\ConnectionManager::config()` foi adicionado e
  é agora o único jeito de configurar conexões.
- O :php:meth:`~Cake\\Database\\ConnectionManager::get()` foi adicionado. Ele
  substitui o ``getDataSource()``.
- O :php:meth:`~Cake\\Database\\ConnectionManager::configured()` foi adicionado.
  Ele junto com ``config()`` substitui o ``sourceList()`` e ``enumConnectionObjects()`` 
  com uma API mais padrão e consistente.
- O ``ConnectionManager::create()`` foi removido.
  Ele pode ser substituído por ``config($name, $config)`` e ``get($name)``.

Behaviors
---------
- Os métodos de comportamentos (behaviors) prefixados com sublinhado como ``_someMethod()``
  não são mais tratados como métodos privados. Use as palavras chaves de visibilidade.

TreeBehavior
------------

O TreeBehavior foi completamente reescrito para usar o novo ORM. Embora ele funcione
do mesmo modo que no 2.x, alguns métodos foram renomeados ou removidos:

- ``TreeBehavior::children()`` é agora uma busca personalizada ``find('children')``.
- ``TreeBehavior::generateTreeList()`` é agora uma busca personalizada ``find('treeList')``.
- ``TreeBehavior::getParentNode()`` foi removido.
- ``TreeBehavior::getPath()`` é agora uma busca personalizada ``find('path')``.
- ``TreeBehavior::reorder()`` foi removido.
- ``TreeBehavior::verify()`` foi removido.


Suíte de Testes
===============

Casos de Teste
--------------

- O ``_normalizePath()`` foi adicionado para permitir testes de comparação de caminhos
  para executar em todos os sistemas operacionais, independente de sua configuração
  (``\`` no Windows vs ``/`` no UNIX, por exemplo).

Os seguintes métodos de asserção foram removidos já que eles estavam há muito obsoletos
e foram substituídos pelo seu equivalente no PHPUnit:

- ``assertEqual()`` é substituído por ``assertEquals()``
- ``assertNotEqual()`` é substituído por ``assertNotEquals()``
- ``assertIdentical()`` é substituído por ``assertSame()``
- ``assertNotIdentical()`` é substituído por ``assertNotSame()``
- ``assertPattern()`` é substituído por ``assertRegExp()``
- ``assertNoPattern()`` é substituído por ``assertNotRegExp()``
- ``assertReference()`` é substituído por ``assertSame()``
- ``assertIsA()`` é substituído por ``assertInstanceOf()``

Note que alguns métodos tiveram a ordem dos argumentos trocada, ex. ``assertEqual($is, $expected)`` 
deve ser agora ``assertEquals($expected, $is)``.

Os seguintes métodos de asserção estão obsoletos e serão removidos no futuro:

- ``assertWithinMargin()`` é substituído por ``assertWithinRange()``
- ``assertTags()`` é substituído por ``assertHtml()``

Em ambas as substituições dos métodos também mudaram a ordem dos argumentos para manter a
consistência na API com ``$expected`` como primeiro argumento.

Os seguintes métodos de asserção foram adicionados:

- ``assertNotWithinRange()`` em contrapartida ao ``assertWithinRange()``


View
====

Temas são agora Plugins Básicos
-------------------------------

Ter os temas e plugins de modo a criar components modulares da aplicação
se provou limitado e confuso. No CakePHP 3.0, temas não residem mais
**dentro** da aplicação. Ao invés disso, eles são plugins independentes.
Isso resolveu alguns problemas com temas:

- Você não podia colocar temas *nos* plugins.
- Temas não podiam fornecer helpers (helpers), ou classes de visão personalizadas.

Esses dois problemas foram resolvidos ao converter os temas em plugins.

Pasta das views renomeada
-------------------------

As pastas contendo os arquivos de views agora ficam em **src/Template** no lugar de
**src/View**. Isso foi feito para separar os arquivos de visão dos arquivos contendo
classes php. (ex. helpers, Classes de visão).

As seguintes pastas de Visão foram renomeadas para evitar colisão de nomes com nomes
de controllers:

- ``Layouts`` agora é ``Layout``
- ``Elements`` agora é ``Element``
- ``Errors`` agora é ``Error``
- ``Emails`` agora é ``Email`` (o mesmo para ``Email`` dentro de ``Layout``)

Coleção de Helpers Substituída
------------------------------

Essa classe foi renomeada para :php:class:`Cake\\View\\HelperRegistry`.
Veja a seção em :doc:`/core-libraries/registry-objects` para mais informações
sobre as funcionalidades fornecidas pela nova classe. Você pode usar o 
``cake upgrade rename_collections`` para ajudar você a atualizar seu código.

Classe View
-----------

- A chave ``plugin`` foi removida do argumento ``$options`` de 
  :php:meth:`Cake\\View\\View::element()`. Especifique o nome do elemento
  como ``AlgumPlugin.nome_do_elemento`` no lugar.
- O ``View::getVar()`` foi removido, use o :php:meth:`Cake\\View\\View::get()` no lugar.
- O ``View::$ext`` foi removido e no lugar uma propriedade protegida ``View::$_ext``
  foi adicionada.
- O ``View::addScript()`` foi removido. Use o :ref:`view-blocks` no lugar.
- As propriedades mágicas ``base``, ``webroot``, ``here``, ``data``,  ``action``, 
  e ``params`` foram removidas. Ao invés disso, você deve acessar todas essas 
  propriedades no ``$this->request``.
- O ``View::start()`` não se liga mais a um bloco existente. Ao invés disso ele irá
  sobrescrever o conteúdo do bloco quando o ``end()`` for chamado. Se você precisa
  combinar o conteúdo de um bloco você deverá buscar o conteúdo do bloco quando 
  chamar o start uma segunda vez, ou usar o modo de captura de ``append()``.
- O ``View::prepend()`` não tem mais um modo de captura.
- O ``View::startIfEmpty()`` foi removido. Agora que o start() sempre sobrescreve,
  o startIfEmpty não tem mais propósito.
- A propriedade ``View::$Helpers`` foi removida e substituída com ``_helpers``. 
  Se você precisar carregar helpers em tempo de execução você deve usar o 
  ``$this->addHelper()`` em seus arquivos de visão.
- O ``View`` agora irá lançar ``Cake\View\Exception\MissingTemplateException`` quando
  templates estiverem faltando, ao invés de ``MissingViewException``.

ViewBlock
---------

- O ``ViewBlock::append()`` foi removido, use o :php:meth:`Cake\\View\ViewBlock::concat()` 
  no lugar. Entretanto o ``View::append()`` ainda existe.

JsonView
--------

- Agora os dados JSON terão as entidades HTML codificadas por padrão. Isso previne
  possíveis problemas de XSS quando o conteúdo de visão JSON está encapsulado em arquivos HTML.
- O :php:class:`Cake\\View\\JsonView` agora suporta a variável de visão ``_jsonOptions``.
  Isso permite a você configurar as opções de máscara de bits usadas ao gerar JSON.

XmlView
-------

- A :php:class:`Cake\\View\\XmlView` agora suporta a variável de visão ``_xmlOptions``.
  Isso permite a você configurar as opções usadas quando gerar XML.

View\\Helper
============

- A propriedade ``$settings`` é agora chamada ``$_config`` e deve ser acessada 
  através do método ``config()``.
- As opções de configuração não são mais definidas como propriedades públicas.
- O ``Helper::clean()`` foi removido. Ele nunca foi robusto o suficiente para 
  prevenir completamente XSS. Ao invés disso você deve escapar o conteúdo com 
  :php:func:`h` ou ou usar uma biblioteca dedicada como o htmlPurifier.
- O ``Helper::output()`` foi removido. Esse método estava obsoleto no 2.x.
- Os métodos ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` foram movidos para o novo ajudante 
  :php:class:`Cake\\View\\Helper\\UrlHelper`. O ``Helper::url()`` está agora
  disponível como :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`.
- Os Assessores Mágicos a propriedades obsoletas foram removidos. A seguinte
  propriedade agora deve ser acessada a partir do objeto de requisição:

  - base
  - here
  - webroot
  - data
  - action
  - params

Helpers
-------

A classe Helper teve os seguintes métodos removidos:

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

Esses métodos eram partes usadas apenas pelo FormHelper, e parte de uma
funcionalidade de persistência de campos que se mostrou problemática com
o tempo. O FormHelper não precisa mais destes métodos e a complexidades 
que eles provêm não é mais necessária.

Os seguintes métodos foram removidos:

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

Esses métodos podem agora ser encontrados na classe ``StringTemplate`` 
que os helpers usam com frequência. Veja o ``StringTemplateTrait`` 
para um jeito fácil de integrar os templates de string em seus 
próprios helpers.

FormHelper
----------

O FormHelper foi completamente reescrito para o 3.0. 
Ele teve algumas grandes mudanças:

* O FormHelper trabalha junto com o novo ORM. Mas também possui um sistema 
  extensível para integrar com outros ORMs e fontes de dados.
* O FormHelper possui um sistema de widgets extensível que permite a você
  criar novos widgets de entrada personalizados e expandir facilmente aqueles
  inclusos no framework.
* Os Templates de String são a fundação deste ajudante. Ao invés de encher de
  arrays por toda parte, a maioria do HTML que o FormHelper gera pode ser
  personalizado em um lugar central usando conjuntos de templates.  


Além dessas grandes mudanças, foram feitas algumas mudanças menores que
causaram rompendo algumas coisas da versão anterior.
Essas mudanças devem simplificar o HTML que o FormHelper gera e reduzir
os problemas que as pessoas tinham no passado:

- O prefixo ``data[`` foi removido de todas as entradas geradas. O prefixo não 
  tem mais propósito.
- Os vários métodos de entradas independentes, como ``text()``, ``select()`` e 
  outros, não geram mais atributos id.
- A opção ``inputDefaults`` foi removida de ``create()``.
- As opções ``default`` e ``onsubmit`` do ``create()`` foram removidas. No lugar
  você deve usar JavaScript event binding ou definir todos os códigos js necessários
  para o ``onsubmit``.
- O ``end()`` não gerará mais botões. Você deve criar botões com ``button()`` 
  ou ``submit()``.
- O ``FormHelper::tagIsInvalid()`` foi removido. Use ``isFieldError()``
  no lugar.
- O ``FormHelper::inputDefaults()`` foi removido. Você pode usar ``templates()``
  para definir/expandir os templates que o FormHelper usa.
- As opções ``wrap`` e ``class`` foram removidas do método ``error()``.
- A opção ``showParents`` foi removida do select().
- As opções ``div``, ``before``, ``after``, ``between`` e ``errorMessage`` 
  foram removidas do ``input()``. Você pode usar templates para atualizar o
  HTML envoltório. A opção ``templates`` permite você sobrescrever os 
  templates carregados para uma entrada.
- As opções ``separator``, ``between``, e ``legend`` foram removidas do
  ``radio()``. Você pode usar templates para mudar o HTML envoltório agora.
- O parâmetro ``format24Hours`` foi removido de ``hour()``.
  Ele foi substituído pela opção ``format``.
- Os parâmetros ``minYear`` e ``maxYear`` foram removidos do ``year()``.
  Ambos podem ser fornecidos como opções.
- Os parâmetros ``dateFormat`` e ``timeFormat`` foram removidos do
  ``datetime()``. Você pode usar o template para definir a ordem que
  as entradas devem ser exibidas.
- O ``submit()`` teve as opções ``div``, ``before`` e ``after`` removidas.
  Você pode personalizar o template ``submitContainer`` para modificar esse
  conteúdo.
- O método ``inputs()`` não aceita mais ``legend`` e ``fieldset`` no parâmetro
  ``$fields``, você deve usar o parâmetro ``$options``.
  Ele também exige que o parâmetro ``$fields`` seja um array. O parâmetro
  ``$blacklist`` foi removido, a funcionalidade foi substituída pela especificação
  de ``'field' => false`` no parâmetro ``$fields``.
- O parâmetro ``inline`` foi removido do método postLink().
  Você deve usar a opção ``block`` no lugar. Definindo ``block => true`` irá
  emular o comportamento anterior.
- O parâmetro ``timeFormat`` para ``hour()``, ``time()`` e ``dateTime()`` agora é
  24 por padrão, em cumprimento ao ISO 8601.
- O argumento ``$confirmMessage`` de :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()`
  foi removido. Você deve usar agora a chave ``confirm`` no ``$options`` para
  especificar a mensagem.
- As entradas do tipo Checkbox e radio são agora renderizadas *dentro* de elementos
  do tipo label por padrão. Isso ajuda a aumentar a compatibilidade com bibliotecas CSS 
  populares como `Bootstrap <http://getbootstrap.com/>`_ e `Foundation <http://foundation.zurb.com/>`_.
- As tags de template agora são todas camelBacked (primeira letra minúscula e inicio de 
  novas palavras em maiúsculo). As tags pré-3.0 ``formstart``, ``formend``, ``hiddenblock``
  e ``inputsubmit`` são agora ``formStart``, ``formEnd``, ``hiddenBlock`` e ``inputSubmit``.
  Certifique-se de altera-las se elas estiverem personalizando sua aplicação.

É recomendado que você revise a documentação :doc:`/views/helpers/form`
para mais detalhes sobre como usar o FormHelper no 3.0.

HtmlHelper
----------

- O ``HtmlHelper::useTag()`` foi removido, use ``tag()`` no lugar.
- O ``HtmlHelper::loadConfig()`` foi removido. As tags podem ser personalizadas
  usando ``templates()`` ou as configurações de ``templates``.
- O segundo parâmetro ``$options`` para ``HtmlHelper::css()`` agora sempre irá exigir um array.
- O primeiro parâmetro ``$data`` para ``HtmlHelper::style()`` agora sempre irá exigir um array.
- O parâmetro ``inline`` foi removido dos métodos meta(), css(), script() e scriptBlock().
  Ao invés disso, você deve usar a opção ``block``. Definindo ``block =>
  true`` irá emular o comportamento anterior.
- O ``HtmlHelper::meta()`` agora exige que o ``$type`` seja uma string. Opções adicionais podem
  ser passadas como ``$options``.
- O ``HtmlHelper::nestedList()`` agora exige que o ``$options`` seja um array. O quarto
  argumento para o tipo tag foi removido e incluido no array ``$options``.
- O argumento ``$confirmMessage`` de :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()`
  foi removido. Você deve usar agora a chave ``confirm`` no ``$options`` para especificar
  a menssagem.

PaginatorHelper
---------------

- O ``link()`` foi removido. Ele não era mais usado internamente pelo ajudante.
  Ele era pouco usado em códigos de usuários e não se encaixava mais nos objetivos do ajudante.
- O ``next()`` não tem mais as opções 'class' ou 'tag'. Ele não tem mais argumentos
  desabilitados. Ao invés disso são usados templates.
- O ``prev()`` não tem mais as opções 'class' ou 'tag'. Ele não tem mais argumentos
  desabilitados. Ao invés disso são usados templates.
- O ``first()`` não tem mais as opções 'after', 'ellipsis', 'separator', 'class' ou 'tag'.
- O ``last()`` não tem mais as opções 'after', 'ellipsis', 'separator', 'class' ou 'tag'.
- O ``numbers()`` não tem mais as opções 'separator', 'tag', 'currentTag', 'currentClass',
  'class', 'tag' e 'ellipsis'. Essas opções são agora facilitadas pelos templates.
  Ele também exige que agora o parâmetro ``$options``  seja um array.
- O espaço reservado de estilo ``%page%`` foi removido de :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Use o espaço reservado de estilo ``{{page}}`` no lugar.
- O ``url()`` foi renomeada para ``generateUrl()`` para evitar colisão de declaração de 
  método com ``Helper::url()``.

Por padrão todos os links e textos inativos são encapsulados em elementos ``<li>``. Isso
ajuda a fazer o CSS mais fácil de escrever, e aumenta a compatibilidade com frameworks
de CSS populares.

Ao invés de várias opções em cada método, você deve usar a funcionalidade de templates.
Veja a documentação :ref:`paginator-templates` para informações de como se usar templates.

TimeHelper
----------

- ``TimeHelper::__set()``, ``TimeHelper::__get()``, e  ``TimeHelper::__isset()`` foram
  removidos. Eles eram métodos mágicos para atributos obsoletos.
- O ``TimeHelper::serverOffset()`` foi removido. Ele provia práticas incorretas de operações
  com tempo.
- O ``TimeHelper::niceShort()`` foi removido.

NumberHelper
------------

- O :php:meth:`NumberHelper::format()` agora exige que ``$options`` seja um array.

SessionHelper
-------------

- O ``SessionHelper`` está obsoleto. Você pode usar ``$this->request->session()`` diretamente,
  e a funcionalidade de mensagens flash foi movida para :doc:`/views/helpers/flash`.


JsHelper
--------

- O ``JsHelper`` e todos motores associados foram removidos. Ele podia gerar
  somente um subconjunto muito pequeno de códigos JavaScript para biblioteca
  selecionada e consequentemente tentar gerar todo código JavaScript usando
  apenas o ajudante se tornava um impedimento com frequência. É recomendado
  usar diretamente sua biblioteca JavaScript preferida.

CacheHelper Removido
--------------------

O CacheHelper foi removido. A funcionalidade de cache que ele fornecia
não era padrão, limitada e incompatível com layouts não-HTML e views de dados.
Essas limitações significavam que uma reconstrução completa era necessária.
O ESI (Edge Side Includes) se tornou uma maneira padronizada para implementar
a funcionalidade que o CacheHelper costumava fornecer. Entretanto, implementando
`Edge Side Includes <http://en.wikipedia.org/wiki/Edge_Side_Includes>`_ em PHP 
tem várias limitações e casos. Ao invés de construir uma solução ruim,
é recomendado que os desenvolvedores que precisem de cache de resposta completa
use o `Varnish <http://varnish-cache.org>`_ ou `Squid <http://squid-cache.org>`_ 
no lugar.

I18n
====

O subsistema de internacionalização foi completamente reescrito. Em geral, 
você pode esperar o mesmo comportamento que nas versões anteriores,
especialmente se você está usando a família de funções ``__()``.

Internamente, a classe ``I18n`` usa ``Aura\Intl``, e métodos apropriados são
expostos para dar acesso a funções específicas da biblioteca. Por esta razão
a maior parte dos métodos dentro de ``I18n`` foram removidos ou renomeados.

Devido ao uso do ``ext/intl``, a classe L10n foi removida completamente. 
Ela fornecia dados incompletos e desatualizados em comparação com os dados
disponíveis na classe ``Locale`` do PHP.

O idioma padrão da aplicação não será mais alterado automaticamente pelos
idiomas aceitos pelo navegador nem por ter o valor ``Config.language`` definido
na sessão do navegador. Você pode, entretanto, usar um filtro no despachante 
para trocar o idioma automaticamente a partir do cabeçalho ``Accept-Language``
enviado pelo navegador::

    // No config/bootstrap.php
    DispatcherFactory::addFilter('LocaleSelector');

Não há nenhum substituto incluso para selecionar automaticamente o idioma
a partir de um valor configurado na sessão do usuário.

A função padrão para formatação de mensagens traduzidas não é mais a 
``sprintf``, mas a mais avançada e funcional classe ``MessageFormatter``.
Em geral você pode reescrever os espaços reservados nas mensagens como
segue::

    // Antes:
    __('Hoje é um dia %s na %s', 'Ensolarado', 'Espanha');

    // Depois:
    __('Hoje é um dia {0} na {1}', 'Ensolarado', 'Espanha');

Você pode evitar ter de reescrever suas mensagens usando o antigo formatador
``sprintf``::

    I18n::defaultFormatter('sprintf');

Adicionalmente, o valor ``Config.language`` foi removido e ele não pode mais
ser usado para controlar o idioma atual da aplicação. Ao invés disso, você
pode usar a classe ``I18n``::

    // Antes
    Configure::write('Config.language', 'fr_FR');

    // Agora
    I18n::locale('en_US');

- Os métodos abaixo foram movidos:

    - De ``Cake\I18n\Multibyte::utf8()`` para ``Cake\Utility\Text::utf8()``
    - De ``Cake\I18n\Multibyte::ascii()`` para ``Cake\Utility\Text::ascii()``
    - De ``Cake\I18n\Multibyte::checkMultibyte()`` para ``Cake\Utility\Text::isMultibyte()``

- Como agora o CakePHP requer a extensão mbstring, a classe
  ``Multibyte`` foi removida.
- As mensagens de erro por todo o CakePHP não passam mais através das funções
  de internacionalização. Isso foi feito para simplificar o núcleo do CakePHP e
  reduzir a sobrecarga. As mensagens apresentadas aos desenvolvedores são raramente,
  isso quando, são de fato traduzidas - de modo que essa sobrecarga adicional 
  trás pouco beneficio.

Localização
===========

- Agora o construtor de :php:class:`Cake\\I18n\\L10n` recebe uma instância de
  :php:class:`Cake\\Network\\Request` como argumento.


Testes
======

- O ``TestShell`` foi removido. O CakePHP, o esqueleto da aplicação e novos
  plugins "cozinhados", todos usam o ``phpunit`` para rodar os testes.
- O webrunner (webroot/test.php) foi removido. A adoção do CLI aumentou
  grandemente desde o release inicial do 2.x. Adicionalmente, os CLI de execução
  oferecem integração superior com IDE's e outras ferramentas automáticas.

  Se você sentir necessidade de um jeito de executar os testes a partir de um
  navegador, você deve verificar o `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_.
  Ele oferece muitas funcionalidades adicionais que o antigo webrunner.
- O ``ControllerTestCase`` está obsoleto e será removido no CakePHP 3.0.0.
  Ao invés disso, você deve usar a nova funcionalidade :ref:`integration-testing`.
- As Fixtures devem agora ser referenciadas usando sua forma no plural::

    // No lugar de
    $fixtures = ['app.artigo'];

    // Você deve usar
    $fixtures = ['app.artigos'];

Utilitários
===========

Classe Set Removida
-------------------

A classe Set foi removida, agora você deve usar a classe Hash no lugar dela.

Pastas & Arquivos
-----------------

As classes de pastas e arquivos foram renomeadas:

- O ``Cake\Utility\File`` foi renomeado para :php:class:`Cake\\Filesystem\\File`
- O ``Cake\Utility\Folder`` foi renomeado para :php:class:`Cake\\Filesystem\\Folder`

Inflexão
--------

- O valor padrão para o argumento ``$replacement`` do :php:meth:`Cake\\Utility\\Inflector::slug()`
  foi alterado do sublinhado (``_``) para o traço (``-``). Usando traços para 
  separar palavras nas URLs é a escolha popular e também recomendada pelo Google.

- As transliterações para :php:meth:`Cake\\Utility\\Inflector::slug()` foram alteradas.
  Se você usa transliterações personalizadas você terá que atualizar seu código.
  No lugar de expressões regulares, as transliterações usam simples substituições de
  string. Isso rendeu melhorias de performance significativas::

    // No lugar de
    Inflector::rules('transliteration', [
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ]);

    // Você deve usar
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);

- Os conjuntos distintos de regras de não-inflexões e irregulares para 
  pluralização e singularização foram removidos. No lugar agora temos
  uma lista comum para cada. Quando usar :php:meth:`Cake\\Utility\\Inflector::rules()`
  com o tipo 'singular' e 'plural' você não poderá mais usar chaves como 'uninflected' 
  e 'irregular' no array de argumentos ``$rules``.

  Você pode adicionar / sobrescrever a lista de regras de não-inflexionados e 
  irregulares usando :php:meth:`Cake\\Utility\\Inflector::rules()` com valores 
  'uninflected' e 'irregular' para o argumento ``$type``.

Sanitize
--------

- A classe ``Sanitize`` foi removida.

Segurança
---------

- O ``Security::cipher()`` foi removido. Ele era inseguro e promovia práticas
  ruins de criptografia. Você deve usar o :php:meth:`Security::encrypt()`
  no lugar.
- O valor de configuração ``Security.cipherSeed`` não é mais necessário. Com a
  remoção de ``Security::cipher()`` ele não tem utilidade.
- A retrocompatibilidade do :php:meth:`Cake\\Utility\\Security::rijndael()` para
  valores encriptados antes do CakePHP 2.3.1 foi removido. Você deve reencriptar
  os valores usando ``Security::encrypt()`` e uma versão recente do CakePHP 2.x 
  antes de migrar.
- A habilidade para gerar um hash do tipo blowfish foi removido. Você não pode mais
  usar o tipo "blowfish" em ``Security::hash()``. Deve ser usado apenas o `password_hash()`
  do PHP e `password_verify()` para gerar e verificar hashes blowfish. A compabilidade
  da biblioteca `ircmaxell/password-compat <https://packagist.org/packages/ircmaxell/password-compat>`_
  que é instalado junto com o CakePHP fornece essas funções para versões de 
  PHP menor que 5.5.
- O OpenSSL é usado agora no lugar do mcrypt ao encriptar/desencriptar dados.
  Esse alteração fornece uma melhor performance e deixa o CakePHP a prova de 
  futuros abandonos de suporte das distribuições ao mcrypt.
- O ``Security::rijndael()`` está obsoleto e apenas disponível quando se usa
  o mcrypt.

.. warning::

    Dados encriptados com Security::encrypt() em versões anteriores não são
    compatíveis com a implementação openssl. Você deve :ref:`definir a
    implementação como mcrypt <force-mcrypt>` quando fizer atualização.

Data e Hora
-----------

- O ``CakeTime`` foi renomeado para :php:class:`Cake\\I18n\\Time`.
- O ``CakeTime::serverOffset()`` foi removido. Ele provia práticas incorretas de operações
  com tempo.
- O ``CakeTime::niceShort()`` foi removido.
- O ``CakeTime::convert()`` foi removido.
- O ``CakeTime::convertSpecifiers()`` foi removido.
- O ``CakeTime::dayAsSql()`` foi removido.
- O ``CakeTime::daysAsSql()`` foi removido.
- O ``CakeTime::fromString()`` foi removido.
- O ``CakeTime::gmt()`` foi removido.
- O ``CakeTime::toATOM()`` foi renomeado para ``toAtomString``.
- O ``CakeTime::toRSS()`` foi renomeado para ``toRssString``.
- O ``CakeTime::toUnix()`` foi renomeado para ``toUnixString``.
- O ``CakeTime::wasYesterday()`` foi renomeado para ``isYesterday`` para combinar com o
  resto da renomeação de métodos.
- O ``CakeTime::format()`` não usa mais o formato do ``sprintf``, ao invés disso você 
  deve usar o formato ``i18nFormat``.
- O :php:meth:`Time::timeAgoInWords()` agora exige que o ``$options`` seja um array.

A classe Time não é mais uma coleção de métodos estáticos, ela estende o ``DateTime`` para
herdar todos seus métodos e adicionar funções de formatação baseado em localização com 
ajuda da extensão ``intl``.

Em geral, expressões assim::

    CakeTime::aMethod($date);

Podem ser migradas reescrevendo para::

    (new Time($date))->aMethod();

Números
-------

A biblioteca Number foi reescrita para usar internamente a classe ``NumberFormatter``.

- O ``CakeNumber`` foi renomeada para :php:class:`Cake\\I18n\\Number`.
- O :php:meth:`Number::format()` agora exige que o ``$options`` seja um array.
- O :php:meth:`Number::addFormat()` foi removido.
- O ``Number::fromReadableSize()`` foi movido para :php:meth:`Cake\\Utility\\Text::parseFileSize()`.

Validação
---------

- A faixa de valores para :php:meth:`Validation::range()` agora é inclusiva se ``$lower`` e
  ``$upper`` forem fornecidos.
- O ``Validation::ssn()`` foi removido.

Xml
---

- O :php:meth:`Xml::build()` agora exige que o ``$options`` seja um array.
- O ``Xml::build()`` não aceita mais uma URL. Se você precisar criar um documento XML
  a partir de uma URL, use :ref:`Http\\Client <http-client-xml-json>`.
  
