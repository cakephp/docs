Logging
#######

Embora as configurações da Classe Configure do núcleo do CakePHP possam realmente ajudar você a ver
o que está acontecendo internamente, há certos momentos em que
você precisará registrar dados no disco para descobrir o que está
acontecendo. Com tecnologias como SOAP, AJAX e APIs REST, a depuração pode ser
bastante difícil.

O logging também pode ser uma maneira de descobrir o que está acontecendo em sua
aplicação ao longo do tempo. Quais termos de pesquisa estão sendo usados? Que tipos
de erros meus usuários estão vendo? Com que frequência uma consulta específica
está sendo executada?

O registro de dados no CakePHP é feito com a função ``log()``. Ela é fornecida pelo
``LogTrait``, que é o ancestral comum para muitas classes do CakePHP. Se o
contexto é uma classe CakePHP (Controller, Component, View,...), você pode registrar seus
dados. Você também pode usar ``Log::write()`` diretamente. Veja :ref:`writing-to-logs`.

.. _log-configuration:

Configuração de Logging
========================

Configurar o ``Log`` deve ser feito durante a fase de bootstrap da sua aplicação.
O arquivo **config/app.php** é destinado exatamente para isso. Você pode definir
quantos loggers sua aplicação precisar. Loggers devem ser
configurados usando :php:class:`Cake\\Log\\Log`. Um exemplo seria::

    use Cake\Log\Engine\FileLog;
    use Cake\Log\Log;

    // Classname using logger 'class' constant
    Log::setConfig('info', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => ['info'],
        'file' => 'info',
    ]);

    // Short classname
    Log::setConfig('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'debug'],
        'file' => 'debug',
    ]);

    // Fully namespaced name.
    Log::setConfig('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

O exemplo acima cria três loggers, chamados ``info``, ``debug`` e ``error``.
Cada um é configurado para lidar com diferentes níveis de mensagens. Eles também armazenam suas
mensagens de log em arquivos separados, para que possamos separar logs de debug/notice/info
de erros mais sérios. Veja a seção sobre :ref:`logging-levels` para mais
informações sobre os diferentes níveis e o que eles significam.

Uma vez que uma configuração é criada, você não pode alterá-la. Em vez disso, você deve remover
a configuração e recriá-la usando :php:meth:`Cake\\Log\\Log::drop()` e
:php:meth:`Cake\\Log\\Log::setConfig()`.

Também é possível criar loggers fornecendo uma closure. Isso é útil
quando você precisa de controle total sobre como o objeto logger é construído. A closure
tem que retornar a instância do logger construída. Por exemplo::

    Log::setConfig('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

Opções de configuração também podem ser fornecidas como uma string :term:`DSN`. Isso é
útil ao trabalhar com variáveis de ambiente ou provedores :term:`PaaS`::

    Log::setConfig('error', [
        'url' => 'file:///full/path/to/logs/?levels[]=warning&levels[]=error&file=error',
    ]);

.. warning::
    Se você não configurar engines de logging, as mensagens de log não serão armazenadas.

Logging de Erros e Exceções
============================

Erros e Exceções também podem ser registrados. Configurando os valores correspondentes
no seu arquivo **config/app.php**. Erros serão exibidos quando debug estiver
``true`` e registrados quando debug estiver ``false``. Para registrar exceções não capturadas, defina a
opção ``log`` como ``true``. Veja :doc:`/development/configuration` para mais
informações.

.. _writing-to-logs:

Escrevendo nos Logs
===================

Escrever nos arquivos de log pode ser feito de duas maneiras diferentes. A primeira
é usar o método estático :php:meth:`Cake\\Log\\Log::write()`::

    Log::write('debug', 'Something did not work');

A segunda é usar a função de atalho ``log()`` disponível em qualquer
classe usando o ``LogTrait``. Chamar ``log()`` chamará internamente
``Log::write()``::

    // Executing this inside a class using LogTrait
    $this->log('Something did not work!', 'debug');

Todos os streams de log configurados são escritos sequencialmente cada vez que
:php:meth:`Cake\\Log\\Log::write()` é chamado. Se você não tiver configurado nenhum
engine de logging, ``log()`` retornará ``false`` e nenhuma mensagem de log será
escrita.

Usando Placeholders em Mensagens
---------------------------------

Se você precisa registrar dados definidos dinamicamente, você pode usar placeholders em suas
mensagens de log e fornecer um array de pares chave/valor no parâmetro ``$context``::

    // Will log `Could not process for userid=1`
    Log::write('error', 'Could not process for userid={user}', ['user' => $user->id]);

Placeholders que não têm chaves definidas não serão substituídos. Se você precisa
usar uma palavra entre chaves literal, você deve escapar o placeholder::

    // Will log `No {replace}`
    Log::write('error', 'No \\{replace}', ['replace' => 'no']);

Se você incluir objetos em seus placeholders de logging, esses objetos devem implementar
um dos seguintes métodos:

* ``__toString()``
* ``toArray()``
* ``__debugInfo()``

.. _logging-levels:

Usando Níveis
-------------

O CakePHP suporta o conjunto padrão POSIX de níveis de logging. Cada nível representa
um nível crescente de gravidade:

* Emergency: sistema está inutilizável
* Alert: ação deve ser tomada imediatamente
* Critical: condições críticas
* Error: condições de erro
* Warning: condições de aviso
* Notice: condição normal mas significativa
* Info: mensagens informativas
* Debug: mensagens de nível debug

Você pode se referir a esses níveis por nome ao configurar loggers e ao escrever
mensagens de log. Alternativamente, você pode usar métodos de conveniência como
:php:meth:`Cake\\Log\\Log::error()` para indicar claramente o nível de
logging. Usar um nível que não está nos níveis acima resultará em uma
exceção.

.. note::
    Quando ``levels`` é definido como um valor vazio na configuração de um logger, ele
    receberá mensagens de qualquer nível.

.. _logging-scopes:

Escopos de Logging
------------------

Muitas vezes você vai querer configurar diferentes comportamentos de logging para diferentes
subsistemas ou partes da sua aplicação. Tome como exemplo uma loja de e-commerce.
Você provavelmente vai querer lidar com o logging para pedidos e pagamentos de forma diferente do que
faz com outros logs menos críticos.

O CakePHP expõe este conceito como escopos de logging. Quando mensagens de log são escritas,
você pode incluir um nome de escopo. Se houver um logger configurado para esse escopo,
as mensagens de log serão direcionadas para esses loggers. Por exemplo::

    use Cake\Log\Engine\FileLog;

    // Configure logs/shops.log to receive all levels, but only
    // those with `orders` and `payments` scope.
    Log::setConfig('shops', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // Configure logs/payments.log to receive all levels, but only
    // those with `payments` scope.
    Log::setConfig('payments', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', ['scope' => ['orders']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['payments']]);

Escopos também podem ser passados como uma única string ou um array indexado numericamente.
Note que usar este formato limitará a capacidade de passar mais dados como contexto::

    Log::warning('This is a warning', ['orders']);
    Log::warning('This is a warning', 'payments');

.. note::
    Quando ``scopes`` é definido como um array vazio ou ``null`` na
    configuração de um logger, ele receberá mensagens de qualquer escopo. Defini-lo como ``false``
    só corresponderá a mensagens sem escopo.

.. _file-log:

Logging para Arquivos
=====================

Como o nome implica, ``FileLog`` escreve mensagens de log em arquivos. O nível da mensagem de log
sendo escrita determina o nome do arquivo onde a mensagem é armazenada.
Se um nível não for fornecido, :php:const:`LOG_ERR` é usado, que escreve no
log de erro. O local de log padrão é **logs/$level.log**::

    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");

    // Results in this being appended to logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

O diretório configurado deve ser gravável pelo usuário do servidor web para
que o logging funcione corretamente.

Você pode configurar locais FileLog adicionais/alternativos ao configurar
um logger. FileLog aceita um ``path`` que permite que
caminhos personalizados sejam usados::

    Log::setConfig('custom_path', [
        'className' => 'File',
        'path' => '/path/to/custom/place/'
    ]);

O engine ``FileLog`` aceita as seguintes opções:

* ``size`` Usado para implementar rotação básica de arquivo de log. Se o tamanho do arquivo de log
  atingir o tamanho especificado, o arquivo existente é renomeado anexando timestamp
  ao nome do arquivo e um novo arquivo de log é criado. Pode ser valor inteiro em bytes ou
  valores de string legíveis como '10MB', '100KB' etc. Padrão é 10MB.
* ``rotate`` Arquivos de log são rotacionados o número de vezes especificado antes de serem removidos.
  Se o valor for 0, versões antigas são removidas em vez de rotacionadas. Padrão é 10.
* ``mask`` Define as permissões de arquivo para arquivos criados. Se deixado vazio, as permissões
  padrão são usadas.

.. note::

    Diretórios ausentes serão criados automaticamente para evitar
    erros desnecessários lançados ao usar o FileEngine.

.. _syslog-log:

Logging para Syslog
===================

Em ambientes de produção, é altamente recomendado que você configure seu sistema para
usar syslog em vez do logger de arquivo. Isso terá um desempenho muito melhor, pois qualquer
gravação será feita de forma (quase) não bloqueante e o logger do seu sistema operacional
pode ser configurado separadamente para rotacionar arquivos, pré-processar gravações ou usar
um armazenamento completamente diferente para seus logs.

Usar syslog é praticamente como usar o engine FileLog padrão, você só precisa
especificar ``Syslog`` como o engine a ser usado para logging. O seguinte
snippet de configuração substituirá o logger padrão pelo syslog, isso deve
ser feito no arquivo **config/bootstrap.php**::

    Log::setConfig('default', [
        'engine' => 'Syslog'
    ]);

O array de configuração aceito para o engine de logging Syslog entende as
seguintes chaves:

* ``format``: Uma string template sprintf com dois placeholders, o primeiro
  para o nível de erro e o segundo para a própria mensagem. Esta chave é
  útil para adicionar informações adicionais sobre o servidor ou processo na
  mensagem registrada. Por exemplo: ``%s - Web Server 1 - %s`` parecerá
  ``error - Web Server 1 - An error occurred in this request`` após
  substituir os placeholders. Esta opção está obsoleta. Você deve usar
  :ref:`logging-formatters` em vez disso.
* ``prefix``: Uma string que será prefixada a cada mensagem registrada.
* ``flag``: Uma flag inteira a ser usada para abrir a conexão com o
  logger, por padrão ``LOG_ODELAY`` será usado. Veja a documentação ``openlog``
  para mais opções
* ``facility``: O slot de logging a ser usado no syslog. Por padrão ``LOG_USER`` é
  usado. Veja a documentação ``syslog`` para mais opções

Criando Engines de Log
=======================

Engines de log podem fazer parte da sua aplicação ou parte de
plugins. Se, por exemplo, você tivesse um logger de banco de dados chamado
``DatabaseLog``. Como parte da sua aplicação, ele seria colocado em
**src/Log/Engine/DatabaseLog.php**. Como parte de um plugin, seria colocado em
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. Para configurar
engine de log, você deve usar :php:meth:`Cake\\Log\\Log::setConfig()`. Por exemplo,
configurar nosso DatabaseLog ficaria assim::

    // For src/Log
    Log::setConfig('otherFile', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // For plugin called LoggingPack
    Log::setConfig('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

Ao configurar um engine de log, o parâmetro ``className`` é usado para
localizar e carregar o manipulador de log. Todas as outras propriedades de
configuração são passadas para o construtor do engine de log como um array. ::

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct(array $config = [])
        {
            parent::__construct($config);
            // ...
        }

        public function log($level, string $message, array $context = [])
        {
            // Write to the database.
        }
    }

O CakePHP requer que todos os engines de logging implementem ``Psr\Log\LoggerInterface``.
A classe :php:class:`Cake\Log\Engine\BaseLog` é uma maneira fácil de satisfazer a
interface, pois requer apenas que você implemente o método ``log()``.

.. _logging-formatters:

Formatadores de Logging
========================

Formatadores de logging permitem que você controle como as mensagens de log são formatadas
independentemente do engine de armazenamento. Cada engine de logging fornecido pelo núcleo vem com
um formatador configurado para manter a saída compatível com versões anteriores. No entanto, você pode
ajustar os formatadores para atender às suas necessidades. Formatadores são configurados
junto com o engine de logging::

    use Cake\Log\Engine\SyslogLog;
    use App\Log\Formatter\CustomFormatter;

    // Simple formatting configuration with no options.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => CustomFormatter::class,
    ]);

    // Configure a formatter with additional options.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => [
            'className' => CustomFormatter::class,
            'key' => 'value',
        ],
    ]);

Para implementar seu próprio formatador de logging, você precisa estender
``Cake\Log\Format\AbstractFormatter`` ou uma de suas subclasses. O método principal
que você precisa implementar é ``format($level, $message, $context)``, que é
responsável por formatar mensagens de log.

.. _log-testing:

Testando Logs
=============

Para testar logging, adicione ``Cake\TestSuite\LogTestTrait`` ao seu caso de teste. O
``LogTestTrait`` usa hooks do PHPUnit para anexar engines de log que interceptam as mensagens de log
que sua aplicação está fazendo. Uma vez que você capturou logs, você pode realizar
asserções em mensagens de log que sua aplicação está emitindo. Por exemplo::

    namespace App\Test\TestCase\Controller;

    use Cake\TestSuite\LogTestTrait;
    use Cake\TestSuite\TestCase;

    class UsersControllerTest extends TestCase
    {
        use LogTestTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->setupLog([
                'error' => ['scopes' => ['app.security']]
            ]);
        }

        public function testResetPassword()
        {
            $this->post('/users/resetpassword', ['email' => 'bob@example.com']);
            $this->assertLogMessageContains('info', 'bob@example.com reset password', 'app.security');
        }
    }

Você usa ``setupLog()`` para definir as mensagens de log que deseja capturar e
realizar asserções. Depois que os logs foram emitidos, você pode fazer asserções sobre
o conteúdo dos logs ou a ausência deles:

* ``assertLogMessage(string $level, string $expectedMessage, ?string $scope
  = null, string $failMsg = '')`` Afirma que uma mensagem de log foi encontrada.
* ``assertLogMessageContains(string $level, string $expectedMessage, ?string
  $scope = null, string $failMsg = '')`` Afirma que uma mensagem de log contém a
  substring.
* ``assertLogAbsent(string $level, ?string $failMsg = '')`` Afirma que nenhuma mensagem de log
  do nível fornecido foi capturada.

O ``LogTestTrait`` irá automaticamente limpar quaisquer loggers que foram
configurados.

API de Log
==========

.. php:namespace:: Cake\Log

.. php:class:: Log

    Uma classe simples para escrever em logs.

.. php:staticmethod:: setConfig($key, $config)

    :param string $name: Nome para o logger sendo conectado, usado
        para remover um logger posteriormente.
    :param array $config: Array de informações de configuração e
        argumentos do construtor para o logger.

    Obter ou definir a configuração para um Logger. Veja :ref:`log-configuration` para
    mais informações.

.. php:staticmethod:: configured()

    :returns: Um array de loggers configurados.

    Obter os nomes dos loggers configurados.

.. php:staticmethod:: drop($name)

    :param string $name: Nome do logger que você deseja que não receba mais
        mensagens.

.. php:staticmethod:: write($level, $message, $scope = [])

    Escrever uma mensagem em todos os loggers configurados.
    ``$level`` indica o nível da mensagem de log sendo criada.
    ``$message`` é a mensagem da entrada de log sendo escrita.
    ``$scope`` é o(s) escopo(s) em que uma mensagem de log está sendo criada.

.. php:staticmethod:: levels()

Chame este método sem argumentos, ex: `Log::levels()` para obter a
configuração de nível atual.

Métodos de Conveniência
------------------------

Os seguintes métodos de conveniência foram adicionados para registrar `$message` com o
nível de log apropriado.

.. php:staticmethod:: emergency($message, $scope = [])
.. php:staticmethod:: alert($message, $scope = [])
.. php:staticmethod:: critical($message, $scope = [])
.. php:staticmethod:: error($message, $scope = [])
.. php:staticmethod:: warning($message, $scope = [])
.. php:staticmethod:: notice($message, $scope = [])
.. php:staticmethod:: info($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])

Trait de Logging
=================

.. php:trait:: LogTrait

    Um trait que fornece métodos de atalho para logging

.. php:method:: log($msg, $level = LOG_ERR)

    Registrar uma mensagem nos logs. Por padrão, as mensagens são registradas como
    mensagens ERROR.

Usando Monolog
==============

Monolog é um logger popular para PHP. Como ele implementa as mesmas interfaces que
os loggers do CakePHP, você pode usá-los em sua aplicação como o logger
padrão.

Após instalar o Monolog usando o composer, configure o logger usando o
método ``Log::setConfig()``::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
        $log = new Logger('app');
        $log->pushHandler(new StreamHandler('path/to/your/combined.log'));

        return $log;
    });

    // Optionally stop using the now redundant default loggers
    Log::drop('debug');
    Log::drop('error');

Use métodos similares se você quiser configurar um logger diferente para seu console::

    // config/bootstrap_cli.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));

        return $log;
    });

    // Optionally stop using the now redundant default CLI loggers
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

    Ao usar um logger específico do console, certifique-se de configurar condicionalmente
    o logger da sua aplicação. Isso evitará entradas de log duplicadas.

.. meta::
    :title lang=pt: Logging
    :description lang=pt: Registre dados do CakePHP no disco para ajudar a depurar sua aplicação por períodos mais longos de tempo.
    :keywords lang=pt: cakephp logging,registrar erros,debug,logging data,classe cakelog,ajax logging,soap logging,debugging,logs
