5.1 Guia de Migração
####################

A versão 5.1.0 é compatível com a versão 5.0. Ela adiciona novas funcionalidades
e introduz novas descontinuações. Qualquer funcionalidade descontinuada na versão 5.x será
removida na versão 6.0.0.

Behavior Changes
================

- A conexão agora cria drivers de leitura e gravação exclusivos se as chaves ``read`` ou
  ``write`` estiverem presentes na configuração, independentemente dos valores.
- O FormHelper não gera mais atributos ``aria-required`` em elementos de entrada
  que também possuem o atributo ``required`` definido. O atributo ``aria-required``
  é redundante nesses elementos e gera avisos de validação HTML. Se você
  estiver usando o atributo ``aria-required`` em estilização ou script, precisará
  atualizar seu aplicativo.
- Adicionar associações com nomes duplicados agora gerará exceções. Você pode
  usar ``$table->associations()->has()`` para definir associações condicionalmente,
  se necessário.
- Os métodos Text Utility e TextHelper sobre truncamento e comprimento máximo estão usando
  um caractere UTF-8 para ``ellipsis`` em vez de caracteres legados ``...``.
- ``TableSchema::setColumnType()`` agora gera uma exceção se a coluna especificada
  não existir.
- ``PluginCollection::addPlugin()`` agora gera uma exceção se um plugin com o mesmo
  nome já tiver sido adicionado.
- ``TestCase::loadPlugins()`` agora limpará todos os plugins carregados anteriormente. Portanto,
  você deve especificar todos os plugins necessários para quaisquer testes subsequentes.
- O algoritmo de hash para configurações de ``Cache`` que usam ``groups``. Quaisquer
  chaves terão novos hashes de prefixo de grupo gerados, o que causará
  falhas de cache. Considere uma implementação incremental para evitar operar em um cache
  totalmente frio.
- ``FormHelper::getFormProtector()`` agora retorna ``null`` além de seus
  tipos anteriores. Isso permite que o código de visualização dinâmica seja executado com menos erros e
  não deve impactar a maioria dos aplicativos.
- O valor padrão para ``valueSeparator`` em ``Table::findList()`` agora é
  um único espaço em vez de ``;``.
- ``ErrorLogger`` agora usa ``Psr\Log\LogTrait``.
- ``Database\QueryCompiler::$_orderedUnion`` foi removido.

Deprecations
============

I18n
----

- A chave de configuração de cache ``_cake_core_`` foi renomeada para ``_cake_translations_``.

Mailer
------

- ``Mailer::setMessage()`` está obsoleto. Seu comportamento é pouco intuitivo e seu uso é
  muito baixo.


New Features
============

Cache
-----

- ``RedisEngine`` agora suporta a opção ``tls`` que permite a conexão ao Redis
  por meio de uma conexão TLS. Você pode usar as opções ``ssl_ca``, ``ssl_cert`` e
  ``ssl_key`` para definir o contexto TLS para o Redis.

Command
-------

- ``bin/cake plugin list`` foi adicionado para listar todos os plugins disponíveis,
  sua configuração de carregamento e versão.
- Argumentos opcionais ``Command`` agora podem ter um valor ``default``.
- ``BannerHelper`` foi adicionado. Este auxiliar de comando pode formatar texto como um banner
  com fundo colorido e preenchimento.
- Estilos padrão adicionais para ``info.bg``, ``warning.bg``, ``error.bg`` e
  ``success.bg`` foram adicionados a ``ConsoleOutput``.

Console
-------

- ``Arguments::getBooleanOption()`` e ``Arguments::getMultipleOption()`` foram adicionados.
- ``Arguments::getArgument()`` agora gerará uma exceção se um nome de argumento
  desconhecido for fornecido. Isso ajuda a evitar a confusão de nomes de opções/argumentos.

Controller
----------

- Os componentes agora podem usar o contêiner DI para ter dependências resolvidas e
  fornecidas como parâmetros do construtor, assim como Controllers e Comandos.

Core
----

- ``PluginConfig`` foi adicionado. Use esta classe para obter todos os plugins disponíveis, suas configurações de carga e versões.
- As funções ``toString``, ``toInt`` e ``toBool`` foram adicionadas. Elas oferecem
  uma maneira segura de converter dados de requisição ou outras entradas e retornar ``null`` quando a conversão falha.
- ``pathCombine()`` foi adicionado para ajudar a construir caminhos sem se preocupar com barras duplicadas e finais.
- Um novo hook ``events`` foi adicionado à classe ``BaseApplication``, bem como à classe ``BasePlugin``. Este hook
  é a maneira recomendada de registrar ouvintes de eventos globais para sua aplicação. 
  Consulte :ref:`Registrando Ouvintes <registering-event-listeners>`

Database
--------

- Suporte para os tipos ``point``, ``linestring``, ``polygon`` e ``geometry`` foi
  adicionado. Esses tipos são úteis ao trabalhar com coordenadas geoespaciais ou cartesianas.
  O suporte ao SQLite usa colunas de texto por baixo dos panos e não possui
  funções para manipular dados como valores geoespaciais.
- ``SelectQuery::__debugInfo()`` agora inclui a função de conexão para a qual a consulta
  se destina.
- ``SelectQuery::intersect()`` e ``SelectQuery::intersectAll()`` foram adicionados.
  Esses métodos permitem que consultas usando as conjunções ``INTERSECT`` e ``INTERSECT ALL``
  sejam expressas.
- Novos recursos de suporte foram adicionados para os recursos ``intersect``, ``intersect-all`` e
  ``set-operations-order-by``.
- A capacidade de buscar registros sem buffer, que existia na versão 4.x, foi restaurada.
  Os métodos ``SelectQuery::enableBufferedResults()``, ``SelectQuery::disableBufferedResults()``
  e ``SelectQuery::isBufferedResultsEnabled()`` foram adicionados novamente.

Datasource
----------

- Os métodos ``RulesChecker::remove()``, ``removeCreate()``, ``removeUpdate()`` e
  ``removeDelete()`` foram adicionados. Esses métodos permitem remover regras
  por nome.

Http
----

- ``SecurityHeadersMiddleware::setPermissionsPolicy()`` foi adicionado. Este método
  adiciona a capacidade de definir valores de cabeçalho ``permissions-policy``.
- ``Client`` agora emite os eventos ``HttpClient.beforeSend`` e ``HttpClient.afterSend``
  quando as solicitações são enviadas. Você pode usar esses eventos para executar logs,
  armazenamento em cache ou coletar telemetria.
- ``Http\Server::terminate()`` foi adicionado. Este método aciona o
  evento ``Server.terminate``, que pode ser usado para executar lógica após a resposta
  ter sido enviada em ambientes fastcgi. Em outros ambientes, o
  evento ``Server.terminate`` é executado *antes* do envio da resposta.

I18n
----

- ``Number::formatter()`` e ``currency()`` agora aceitam a opção ``roundingMode``
  para substituir a forma como o arredondamento é feito.
- As funções ``toDate`` e ``toDateTime`` foram adicionadas. Elas oferecem
  uma maneira segura de converter dados de solicitação ou outra entrada e retornar ``null`` quando
  a conversão falhar.

ORM
---

- Definindo a opção ``preserveKeys`` em consultas do localizador de associações. Isso pode ser
  usado com ``formatResults()`` para substituir os resultados do localizador de associações por um
  array associativo.
- Colunas SQLite com nomes contendo ``json`` agora podem ser mapeadas para ``JsonType``.
  Este é atualmente um recurso opcional que é habilitado definindo o valor de configuração ``ORM.mapJsonTypeForSqlite``
  como ``true`` em seu aplicativo.

TestSuite
---------

- O CakePHP e o template do aplicativo foram atualizados para usar o PHPUnit ``^10.5.5 || ^11.1.3"``.
- Os métodos ``ConnectionHelper`` agora são todos estáticos. Esta classe não possui estado e
  seus métodos foram atualizados para serem estáticos.
- ``LogTestTrait`` foi adicionado. Este novo trait facilita a captura de logs
  em seus testes e a realização de asserções sobre a presença ou ausência de mensagens de log.
- ``IntegrationTestTrait::replaceRequest()`` foi adicionado.

Utility
-------

- ``Hash::insert()`` e ``Hash::remove()`` agora aceitam objetos ``ArrayAccess`` junto com dados ``array``.

Validation
----------

- ``Validation::enum()`` e ``Validator::enum()`` foram adicionados. Esses métodos de 
  validação simplificam a validação de valores de enumeração com suporte.
- ``Validation::enumOnly()`` e ``Validation::enumExcept()`` foram adicionados para verificar casos específicos
  e simplificar ainda mais a validação de valores de enumeração com suporte.

View
----

- As células de visualização agora emitem eventos em torno de suas ações ``Cell.beforeAction`` e
  ``Cell.afterAction``.
- ``NumberHelper::format()`` agora aceita a opção ``roundingMode`` para substituir como
  o arredondamento é feito.

Helpers
-------

- ``TextHelper::autoLinkUrls()`` possui opções adicionadas para melhorar a impressão do rótulo do link:
  * ``stripProtocol``: Remove ``http://`` e ``https://`` do início do link. Padrão desativado.
  * ``maxLength``: O comprimento máximo do rótulo do link. Padrão desativado.
  * ``ellipsis``: A string a ser anexada ao final do rótulo do link. Padrão para a versão UTF8.
- ``HtmlHelper::meta()`` agora pode criar uma meta tag contendo o token CSRF
  atual usando ``meta('csrfToken')``.
