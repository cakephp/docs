5.0 Guia de Migração
####################

O CakePHP 5.0 contém mudanças drásticas e não é compatível com versões anteriores da versão 4.x.
Antes de tentar atualizar para a versão 5.0, atualize primeiro para a 4.5 e resolva
todos os avisos de descontinuação.

Consulte o :doc:`/appendices/5-0-upgrade-guide` para obter instruções passo a passo
sobre como atualizar para a versão 5.0.

Recursos obsoletos removidos
============================

Todos os métodos, propriedades e funcionalidades que estavam emitindo avisos de descontinuação
a partir da versão 4.5 foram removidos.

Mudanças Drásticas
==================

Além da remoção de recursos obsoletos, foram feitas alterações drásticas:

Global
------

- Declarações de tipo foram adicionadas a todos os parâmetros e retornos de funções, sempre que possível. O objetivo é
  corresponder às anotações do docblock, mas incluem correções para anotações incorretas.
- Declarações de tipo foram adicionadas a todas as propriedades de classe sempre que possível. 
  Isso também inclui algumas correções para anotações incorretas.
- As constantes ``SECOND``, ``MINUTE``, ``HOUR``, ``DAY``,  ``WEEK``, ``MONTH``, ``YEAR`` foram removidas.
- O uso de ``#[\AllowDynamicProperties]`` foi removido em todos os lugares. Era usado para as seguintes classes:
   - ``Command/Command``
   - ``Console/Shell``
   - ``Controller/Component``
   - ``Controller/Controller``
   - ``Mailer/Mailer``
   - ``View/Cell``
   - ``View/Helper``
   - ``View/View``
- As versões do mecanismo de banco de dados suportado foram atualizadas:
  - MySQL (5.7 ou superior)
  - MariaDB (10.1 ou superior)
  - PostgreSQL (9.6 ou superior)
  - Microsoft SQL Server (2012 ou superior)
  - SQLite 3 (3.16 ou superior)

Auth
----

- `Auth` foi removido. Em vez disso, use os plugins `cakephp/authentication <https://book.cakephp.org/authentication/3/en/index.html>`__ e
  `cakephp/authorization <https://book.cakephp.org/authorization/3/en/index.html>`__.

Cache
-----

- O mecanismo ``Wincache`` foi removido. A extensão wincache não é suportada
  no PHP 8.

Collection
----------

- ``combine()`` agora lança uma exceção se o caminho da chave ou do grupo não existir ou contiver um valor nulo.
  Isso corresponde ao comportamento de ``indexBy()`` e ``groupBy()``.

Console
-------

- ``BaseCommand::__construct()`` foi removido.
- ``ConsoleIntegrationTestTrait::useCommandRunner()`` foi removido porque não é mais necessário.
- ``Shell`` foi removido e deve ser substituído por `Command <https://book.cakephp.org/5/en/console-commands/commands.html>`__
- ``ConsoleOptionParser::addSubcommand()`` foi removido juntamente com a remoção de
  ``Shell``. Subcomandos devem ser substituídos por classes ``Command`` que
  implementam ``Command::defaultName()`` para definir o nome do comando necessário.
- ``BaseCommand`` agora emite eventos ``Command.beforeExecute`` e
  ``Command.afterExecute`` em torno do método ``execute()`` do comando
  sendo invocado pelo framework.

Connection
----------

- ``Connection::prepare()`` foi removido. Você pode usar ``Connection::execute()``
  para executar uma consulta SQL especificando a string SQL, os parâmetros e os tipos em uma única chamada.
- ``Connection::enableQueryLogging()`` foi removido. Se você não habilitou o registro
  através da configuração de conexão, poderá posteriormente definir a instância do registrador para o
  driver para habilitar o registro de consulta ``$connection->getDriver()->setLogger()``.

Controller
----------

- A assinatura do método ``Controller::__construct()`` foi alterada.
  Portanto, você precisa ajustar seu código adequadamente se estiver substituindo o construtor.
- Após o carregamento, os componentes não são mais definidos como propriedades dinâmicas. Em vez disso,
  ``Controller`` usa ``__get()`` para fornecer acesso de propriedade aos componentes. Esta
  alteração pode impactar aplicativos que usam ``property_exists()`` em componentes.
- O retorno de chamada do evento ``Controller.shutdown`` dos componentes foi renomeado de
  ``shutdown`` para ``afterFilter`` para corresponder ao do controller. Isso torna os retornos de chamada mais consistentes.
- ``PaginatorComponent`` foi removido e deve ser substituído chamando ``$this->paginate()`` no seu controller ou
  usando ``Cake\Datasource\Paging\NumericPaginator`` diretamente.
- ``RequestHandlerComponent`` foi removido. Consulte o guia 
  `migração 4.4 <https://book.cakephp.org/4/en/appendices/4-4-migration-guide.html#requesthandlercomponent>`__ para saber como atualizar.
- ``SecurityComponent`` foi removido. Use ``FormProtectionComponent`` para proteção contra adulteração de formulários
  ou ``HttpsEnforcerMiddleware`` para impor o uso de HTTPS para solicitações.
- ``Controller::paginate()`` não aceita mais opções de consulta como ``contain`` para
  seu argumento ``$settings``. Em vez disso, você deve usar a opção ``finder``
  ``$this->paginate($this->Articles, ['finder' => 'published'])``. Ou você pode
  criar a consulta de seleção necessária com antecedência e passá-la para ``paginate()``
  ``$query = $this->Articles->find()->where(['is_published' => true]); $this->paginate($query);``.

Core
----

- A função ``getTypeName()`` foi descontinuada. Em vez disso, use ``get_debug_type()`` do PHP.
- A dependência de ``league/container`` foi atualizada para ``4.x``. Isso
  exigirá a adição de dicas de tipo às suas implementações de ``ServiceProvider``.
- ``deprecationWarning()`` agora possui um parâmetro ``$version``.
- A opção de configuração ``App.uploadedFilesAsObjects`` foi removida,
  juntamente com o suporte a arrays em formato de upload de arquivos PHP em todo o
  framework.
- ``ClassLoader`` foi removido. Em vez disso, use o composer para gerar arquivos de carregamento automático.

Database
--------

- ``DateTimeType`` e ``DateType`` agora sempre retornam objetos imutáveis.
  Além disso, a interface para objetos ``Date`` reflete a interface ``ChronosDate``,
  que não possui todos os métodos relacionados a tempo presentes no CakePHP 4.x.
- ``DateType::setLocaleFormat()`` não aceita mais um array.
- ``Query`` agora aceita apenas parâmetros ``\Closure`` em vez de ``callable``. Callables podem ser convertidos
  em closures usando a nova sintaxe de array de primeira classe do PHP 8.1.
- ``Query::execute()`` não executa mais callbacks do decorador de resultados. Você deve usar ``Query::all()`` em seu lugar.
- ``TableSchemaAwareInterface`` foi removido.
- ``Driver::quote()`` foi removido. Use instruções preparadas em seu lugar.
- ``Query::orderBy()`` foi adicionado para substituir ``Query::order()``.
- ``Query::groupBy()`` foi adicionado para substituir ``Query::group()``.
- ``SqlDialectTrait`` foi removido e toda a sua funcionalidade foi movida
  para a própria classe ``Driver``.
- ``CaseExpression`` foi removido e deve ser substituído por
  ``QueryExpression::case()`` ou ``CaseStatementExpression``
- ``Connection::connect()`` foi removido. Use
  ``$connection->getDriver()->connect()`` em vez disso.
- ``Connection::disconnect()`` foi removido. Use
  ``$connection->getDriver()->disconnect()`` em vez disso.
- ``cake.database.queries`` foi adicionado como alternativa ao escopo ``queriesLog``
- A capacidade de habilitar/desabilitar o buffer do ResultSet foi removida. Os resultados são sempre armazenados em buffer.

Datasource
----------

- O método ``getAccessible()`` foi adicionado a ``EntityInterface``. Implementações não-ORM
  precisam implementar este método agora.
- O método ``aliasField()`` foi adicionado a ``RepositoryInterface``. Implementações não-ORM
  precisam implementar este método agora.

Event
-----

- Os payloads de eventos devem ser um array. Outros objetos, como ``ArrayAccess``, não são mais convertidos para array e agora gerarão um ``TypeError``.
- Recomenda-se ajustar os manipuladores de eventos para que sejam métodos nulos e usem ``$event->setResult()`` em vez de retornar o resultado.

Error
-----

- ``ErrorHandler`` e ``ConsoleErrorHandler`` foram removidos. Consulte o guia 
  `migração 4.4 <https://book.cakephp.org/4/en/appendices/4-4-migration-guide.html#errorhandler-consoleerrorhandler>`__ para saber como atualizar.
- ``ExceptionRenderer`` foi removido e deve ser substituído por ``WebExceptionRenderer``
- ``ErrorLoggerInterface::log()`` foi removido e deve ser substituído por ``ErrorLoggerInterface::logException()``
- ``ErrorLoggerInterface::logMessage()`` foi removido e deve ser substituído por ``ErrorLoggerInterface::logError()``

Filesystem
----------

- O pacote Filesystem foi removido, e a classe ``Filesystem`` foi movida para o pacote Utility.

Http
----

- ``ServerRequest`` não é mais compatível com ``files`` como arrays. Este
  comportamento foi desabilitado por padrão desde a versão 4.1.0. Os dados de ``files`` agora
  sempre conterão objetos ``UploadedFileInterfaces``.

I18n
----

- ``FrozenDate`` foi renomeado para `Date` e ``FrozenTime`` foi renomeado para ``DateTime``.
- ``Time`` agora estende ``Cake\Chronos\ChronosTime`` e, portanto, é imutável.
- Objetos ``Date`` não estendem mais ``DateTimeInterface`` - portanto, você não pode compará-los com objetos ``DateTime``.
  Consulte a documentação da versão `cakephp/chronos <https://github.com/cakephp/chronos/releases/tag/3.0.2>`__ para mais informações.
- ``Date::parseDateTime()`` foi removido.
- ``Date::parseTime()`` foi removido.
- ``Date::setToStringFormat()`` e ``Date::setJsonEncodeFormat()`` não aceitam mais um array.
- ``Date::i18nFormat()`` e ``Date::nice()`` não aceitam mais um parâmetro de fuso horário.
- Arquivos de tradução para plugins com nomes prefixados pelo fornecedor (``FooBar/Awesome``) agora terão esse
  prefixo no nome do arquivo, por exemplo, ``foo_bar_awesome.po`` para evitar colisão com um arquivo ``awesome.po``
  de um plugin correspondente (``Awesome``).

Log
---

- A configuração do mecanismo de log agora usa ``null`` em vez de ``false`` para desabilitar escopos.
  Portanto, em vez de ``'scopes' => false``, você precisa usar ``'scopes' => null`` na sua configuração de log.

Mailer
------

- ``Email`` foi removido. Em vez disso, use `Mailer <https://book.cakephp.org/5/en/core-libraries/email.html>`__.
- ``cake.mailer`` foi adicionado como alternativa ao escopo ``email``.

ORM
---

- ``EntityTrait::has()`` agora retorna ``true`` quando um atributo existe e está
  definido como ``null``. Em versões anteriores do CakePHP, isso retornava ``false``.
  Consulte as notas de lançamento da versão 4.5.0 para saber como adotar esse comportamento na versão 4.x.
- ``EntityTrait::extractOriginal()`` agora retorna apenas campos existentes, semelhante a ``extractOriginalChanged()``.
- Os argumentos do Finder agora precisam ser arrays associativos, como sempre foi esperado.
- ``TranslateBehavior`` agora usa como padrão a estratégia ``ShadowTable``. Se você estiver
  usando a estratégia ``Eav``, precisará atualizar sua configuração de comportamento
  para manter o comportamento anterior.
- A opção ``allowMultipleNulls`` para a regra ``isUnique`` agora usa como padrão true, correspondendo
  ao comportamento original da versão 3.x.
- ``Table::query()`` foi removido em favor de funções específicas do tipo de consulta.
- ``Table::updateQuery()``, ``Table::selectQuery()``, ``Table::insertQuery()`` e
  ``Table::deleteQuery()`` foram adicionados e retornam os novos objetos de consulta específicos do tipo abaixo.
- ``SelectQuery``, ``InsertQuery``, ``UpdateQuery`` e ``DeleteQuery`` foram adicionados,
  que representam apenas um único tipo de consulta e não permitem alternar entre tipos de consulta nem
  chamar funções não relacionadas ao tipo de consulta específico.
- ``Table::_initializeSchema()`` foi removido e deve ser substituído pela chamada de
  ``$this->getSchema()`` dentro do método ``initialize()``.
- ``SaveOptionsBuilder`` foi removido. Use um array normal para opções.

Routing
-------

- Os métodos estáticos ``connect()``, ``prefix()``, ``scope()`` e ``plugin()`` do ``Router`` foram removidos e
  devem ser substituídos chamando suas variantes de método não estático por meio da instância ``RouteBuilder``.
- ``RedirectException`` foi removido. Em vez disso, use ``\Cake\Http\Exception\RedirectException``.

TestSuite
---------

- ``TestSuite`` foi removido. Os usuários devem usar variáveis ​​de ambiente para personalizar
  as configurações de teste unitário.
- ``TestListenerTrait`` foi removido. O PHPUnit removeu o suporte para esses ouvintes.
  Consulte :doc:`/appendices/phpunit10`
- ``IntegrationTestTrait::configRequest()`` agora mescla a configuração quando chamado várias vezes
  em vez de substituir a configuração atual.

Validation
----------

- ``Validation::isEmpty()`` não é mais compatível com arrays
  de upload de arquivos. O suporte para arrays de upload de arquivos PHP também foi removido de
  ``ServerRequest``, portanto, você não deve ver isso como um problema fora dos testes.
- Anteriormente, a maioria das mensagens de erro de validação de dados era simplesmente ``O valor fornecido é inválido``.
  Agora, as mensagens de erro de validação de dados são redigidas com mais precisão.
  Por exemplo, ``O valor fornecido deve ser maior ou igual a \`5\```.

View
----

- As opções ``ViewBuilder`` agora são verdadeiramente associativas (chaves de string).
- ``NumberHelper`` e ``TextHelper`` não aceitam mais a configuração ``engine``.
- O parâmetro ``$merge`` do ``ViewBuilder::setHelpers()`` foi removido. Em vez disso, use ``ViewBuilder::addHelpers()``.
- Dentro de ``View::initialize()``, prefira usar ``addHelper()`` em vez de ``loadHelper()``.
  Todos os auxiliares configurados serão carregados posteriormente, de qualquer forma.
- ``View\Widget\FileWidget`` não é mais compatível com arrays em formato de upload de arquivos PHP.
  Isso está alinhado com as alterações em ``ServerRequest`` e ``Validation``.
- ``FormHelper`` não define mais ``autocomplete=off`` em campos de token CSRF. Esta
  foi uma solução alternativa para um bug do Safari que não é mais relevante.

Deprecations
============

A seguir, uma lista de métodos, propriedades e comportamentos obsoletos.
Esses recursos continuarão funcionando na versão 5.x e serão removidos na versão 6.0.

Database
--------

- ``Query::order()`` foi descontinuado. Use ``Query::orderBy()`` em vez disso, agora que
  os métodos ``Connection`` não são mais proxy. Isso alinha o nome da função
  com a instrução SQL.
- ``Query::group()`` foi descontinuado. Use ``Query::groupBy()`` em vez disso, agora que
  os métodos ``Connection`` não são mais proxy. Isso alinha o nome da função
  com a instrução SQL.

ORM
---

- Chamar ``Table::find()`` com array de opções está obsoleto. Use 
  `argumentos nomeados <https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments>`__
  em vez disso. Por exemplo, em vez de ``find('all', ['conditions' => $array])``, use
  ``find('all', conditions: $array)``. Da mesma forma, para opções personalizadas do localizador, em vez
  de ``find('list', ['valueField' => 'name'])``, use ``find('list', valueField: 'name')``
  ou múltiplos argumentos nomeados como ``find(type: 'list', valueField: 'name', conditions: $array)``.

New Features
============

Improved type checking
-----------------------

O CakePHP 5 aproveita o recurso de sistema de tipos expandido disponível no PHP 8.1+.
O CakePHP também utiliza ``assert()`` para fornecer mensagens de erro aprimoradas e maior solidez de tipos. 
No modo de produção, você pode configurar o PHP para não gerar código para ``assert()``, 
resultando em melhor desempenho da aplicação. Consulte o arquivo
:ref:`symlink-assets` para saber como fazer isso.

Collection
----------

- Adicionado ``unique()``, que filtra valores duplicados especificados pelo retorno de chamada fornecido.
- ``reject()`` agora suporta um retorno de chamada padrão que filtra valores verdadeiros, o que é
  o inverso do comportamento padrão de ``filter()``.

Core
----

- O método ``services()`` foi adicionado a ``PluginInterface``.
- ``PluginCollection::addFromConfig()`` foi adicionado para :ref:`simplificar o carregamento de plugins <loading-a-plugin>`.

Database
--------

- ``ConnectionManager`` agora suporta funções de conexão de leitura e gravação. As funções podem ser configuradas
  com as chaves ``read`` e ``write`` na configuração de conexão que substituem a configuração compartilhada.
- ``Query::all()`` foi adicionado, o que executa callbacks do decorador de resultados e retorna um conjunto de resultados para consultas selecionadas.
- ``Query::comment()`` foi adicionado para adicionar um comentário SQL à consulta executada. Isso facilita a depuração de consultas.
- ``EnumType`` foi adicionado para permitir o mapeamento entre enumerações baseadas em PHP e uma coluna de string ou inteiro.
- ``getMaxAliasLength()`` e ``getConnectionRetries()`` foram adicionados à ``DriverInterface``.
- Os drivers suportados agora adicionam automaticamente o incremento automático apenas às chaves primárias inteiras denominadas "id" em vez
  de todas as chaves primárias inteiras. Definir 'autoIncrement' como falso sempre desabilita em todos os drivers suportados.

Http
----

- Adicionado suporte para a interface `PSR-17 <https://www.php-fig.org/psr/psr-17/>`__factorys. 
  Isso permite que ``cakephp/http`` forneça uma implementação cliente para
  bibliotecas que permitem resolução automática de interface, como php-http.
- Adicionados ``CookieCollection::__get()`` e ``CookieCollection::__isset()`` para adicionar
  maneiras ergonômicas de acessar cookies sem exceções.

ORM
---

Required Entity Fields
----------------------

As entidades têm uma nova funcionalidade de opt-in que permite que as entidades tratem
propriedades de forma mais rigorosa. O novo comportamento é chamado de "campos obrigatórios". Quando
habilitado, o acesso a propriedades não definidas na entidade gerará
exceções. Isso afeta o seguinte uso::

    $entity->get();
    $entity->has();
    $entity->getOriginal();
    isset($entity->attribute);
    $entity->attribute;

Os campos são considerados definidos se passarem por ``array_key_exists``. Isso inclui
valores nulos. Como esse recurso pode ser trabalhoso de habilitar, ele foi adiado para a versão 5.0. 
Gostaríamos de receber seu feedback sobre esse recurso, pois estamos considerando torná-lo
o comportamento padrão no futuro.

Typed Finder Parameters
-----------------------

Os localizadores de tabela agora podem ter argumentos digitados, conforme necessário, em vez de uma matriz de opções.
Por exemplo, um localizador para buscar postagens por categoria ou usuário::

    public function findByCategoryOrUser(SelectQuery $query, array $options)
    {
        if (isset($options['categoryId'])) {
            $query->where(['category_id' => $options['categoryId']]);
        }
        if (isset($options['userId'])) {
            $query->where(['user_id' => $options['userId']]);
        }

        return $query;
    }

agora pode ser escrito como::

    public function findByCategoryOrUser(SelectQuery $query, ?int $categoryId = null, ?int $userId = null)
    {
        if ($categoryId) {
            $query->where(['category_id' => $categoryId]);
        }
        if ($userId) {
            $query->where(['user_id' => $userId]);
        }

        return $query;
    }

O localizador pode então ser chamado como ``find('byCategoryOrUser', userId: $somevar)``.
Você pode até incluir argumentos nomeados especiais para definir cláusulas de consulta.
``find('byCategoryOrUser', userId: $somevar, conditions: ['enabled' => true])``.

Uma alteração semelhante foi aplicada ao método ``RepositoryInterface::get()``::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, [
            'contain' => ['Books'],
            'finder' => 'latest',
        ]);
    }

agora pode ser escrito como::

    public function view(int $id)
    {
        $author = $this->Authors->get($id, contain: ['Books'], finder: 'latest');
    }

TestSuite
---------

- ``IntegrationTestTrait::requestAsJson()`` foi adicionado para definir cabeçalhos JSON para a próxima solicitação.

Plugin Installer
----------------

- O instalador de plugins foi atualizado para lidar automaticamente com o carregamento automático de classes
  para os plugins do seu aplicativo. Assim, você pode remover os mapeamentos de namespace para caminho dos seus
  plugins do seu ``composer.json`` e simplesmente executar ``composer dumpautoload``.
