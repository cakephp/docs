3.0 Guia de migração
####################

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

.. atenção::

    O CakePHP 3.0 não irá funcionar se você não atender aos requisitos acima.

Ferramenta de atualização
=========================

Enquanto este documento cobre todas as alterações e melhorias feitas no
CakePHP 3.0, nós também criamos uma aplicação de console para ajudar você
a completar mais facilmente algumas das alterações mecânicas que consomem tempo.
Você pode `pegar a ferramenta de atualização no github <https://github
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
autoloader da sua aplicação. Veja a seção :ref:`additional-class-paths` para
mais informações.

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
próprio arquivo fonte e da documentação/`API <http://api.cakephp.org/>`_ online.

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
  
