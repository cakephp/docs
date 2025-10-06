Configuration
#############

Embora as convenções eliminem a necessidade de configurar todo o CakePHP, você ainda precisará
configurar algumas coisas, como suas credenciais de banco de dados.

Além disso, existem opções de configuração opcionais que permitem trocar
valores e implementações padrão por outros adaptados à sua aplicação.

.. index:: app.php, app_local.example.php

.. index:: configuration

Configurando sua Aplicação
==========================

A configuração geralmente é armazenada em arquivos PHP ou INI, e carregada durante
a inicialização da aplicação. O CakePHP vem com um arquivo de configuração por padrão,
mas se necessário você pode adicionar arquivos de configuração adicionais e carregá-los no
código de inicialização da sua aplicação. :php:class:`Cake\\Core\\Configure` é usado
para configuração global, e classes como ``Cache`` fornecem métodos ``setConfig()``
para tornar a configuração simples e transparente.

O esqueleto da aplicação possui um arquivo **config/app.php** que deve conter
configurações que não variam entre os vários ambientes em que sua aplicação
é implantada. O arquivo **config/app_local.php** deve conter os
dados de configuração que variam entre ambientes e devem ser gerenciados por
gerenciamento de configuração ou suas ferramentas de implantação. Ambos os arquivos fazem referência a variáveis de ambiente
através da função ``env()`` que permite que valores de configuração sejam definidos através
do ambiente do servidor.

Carregando Arquivos de Configuração Adicionais
----------------------------------------------

Se sua aplicação tem muitas opções de configuração, pode ser útil dividir
a configuração em múltiplos arquivos. Após criar cada um dos arquivos no seu
diretório **config/** você pode carregá-los no **bootstrap.php**::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;

    Configure::setConfig('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');

.. _environment-variables:

Variáveis de Ambiente
=====================

Muitos provedores de nuvem modernos, como Heroku, permitem definir variáveis de
ambiente para dados de configuração. Você pode configurar seu CakePHP através de
variáveis de ambiente no `estilo de aplicação 12factor <https://12factor.net/>`_.
Variáveis de ambiente permitem que sua aplicação exija menos estado, tornando sua
aplicação mais fácil de gerenciar quando ela é implantada em vários
ambientes.

Como você pode ver no seu **app.php**, a função ``env()`` é usada para ler
configuração do ambiente e construir a configuração da aplicação.
O CakePHP usa strings :term:`DSN` para bancos de dados, logs, transporte de email e configurações de cache,
permitindo que você varie facilmente essas bibliotecas em cada ambiente.

Para desenvolvimento local, o CakePHP aproveita `dotenv
<https://github.com/josegonzalez/php-dotenv>`_ para fazer o desenvolvimento local
recarregar automaticamente variáveis de ambiente. Use composer para requisitar esta biblioteca
e então há um bloco de código no ``bootstrap.php`` que precisa ser
descomentado para aproveitá-la.

Você verá um ``config/.env.example`` na sua
aplicação. Copiando este arquivo para ``config/.env`` e customizando os
valores você pode configurar sua aplicação.

Você deve evitar fazer commit do arquivo ``config/.env`` para o seu repositório e
em vez disso usar o ``config/.env.example`` como um template com valores de placeholder para que
todos na sua equipe saibam quais variáveis de ambiente estão em uso e o que
deve ir em cada uma.

Uma vez que suas variáveis de ambiente tenham sido definidas, você pode usar ``env()`` para ler
dados do ambiente::

    $debug = env('APP_DEBUG', false);

O segundo valor passado para a função env é o valor padrão. Este valor
será usado se não existir variável de ambiente para a chave fornecida.

.. _general-configuration:

Configuração Geral
------------------

Abaixo está uma descrição das variáveis e como elas afetam sua aplicação
CakePHP.

debug
    Altera a saída de depuração do CakePHP. ``false`` = Modo de produção. Nenhuma mensagem de erro,
    erros ou avisos mostrados. ``true`` = Erros e avisos mostrados.
App.namespace
    O namespace para encontrar classes da aplicação.

    .. note::

        Ao alterar o namespace na sua configuração, você também precisará
        atualizar seu arquivo **composer.json** para usar este namespace
        também. Adicionalmente, crie um novo autoloader executando
        ``php composer.phar dumpautoload``.

.. _core-configuration-baseurl:

App.baseUrl
    Descomente esta definição se você **não** planeja usar o mod\_rewrite do Apache
    com o CakePHP. Não esqueça de remover seus arquivos .htaccess
    também.
App.base
    O diretório base onde a aplicação reside. Se ``false`` isto
    será auto-detectado. Se não for ``false``, garanta que sua string comece
    com uma `/` e NÃO termine com uma `/`. Por exemplo, `/basedir` é um
    App.base válido.
App.encoding
    Define qual codificação sua aplicação usa. Esta codificação
    é usada para gerar o charset no layout e codificar entidades.
    Deve corresponder aos valores de codificação especificados para seu banco de dados.
App.webroot
    O diretório webroot.
App.wwwRoot
    O caminho do arquivo para webroot.
App.fullBaseUrl
    O nome de domínio totalmente qualificado (incluindo protocolo) para a raiz
    da sua aplicação. Isto é usado ao gerar URLs absolutas. Por padrão este valor
    é gerado usando o ambiente ``$_SERVER``. No entanto, você deve defini-lo
    manualmente para otimizar o desempenho ou se você está preocupado com pessoas
    manipulando o cabeçalho ``Host``.
    Em um contexto CLI (do comando) o `fullBaseUrl` não pode ser lido de $_SERVER,
    pois não há servidor web envolvido. Você precisa especificá-lo você mesmo se
    precisar gerar URLs de um shell (por exemplo, ao enviar emails).
App.imageBaseUrl
    Caminho web para o diretório público de imagens sob webroot. Se você está usando
    uma :term:`CDN` você deve definir este valor para a localização da CDN.
App.cssBaseUrl
    Caminho web para o diretório público css sob webroot. Se você está usando
    uma :term:`CDN` você deve definir este valor para a localização da CDN.
App.jsBaseUrl
    Caminho web para o diretório público js sob webroot. Se você está usando
    uma :term:`CDN` você deve definir este valor para a localização da CDN.
App.paths
    Configure caminhos para recursos não baseados em classe. Suporta as
    subchaves ``plugins``, ``templates``, ``locales``, que permitem a definição
    de caminhos para plugins, templates de visualização e arquivos de localidade respectivamente.
App.uploadedFilesAsObjects
    Define se arquivos enviados são representados como objetos (``true``),
    ou arrays (``false``). Esta opção é tratada como habilitada por padrão.
    Veja a :ref:`seção de Upload de Arquivos <request-file-uploads>` no capítulo de Objetos
    Request & Response para mais informações.
Security.salt
    Uma string aleatória usada em hashing. Este valor também é usado como
    salt HMAC ao fazer criptografia simétrica.
Asset.timestamp
    Anexa um timestamp que é a última hora de modificação do arquivo
    particular no final das URLs de arquivos de assets (CSS, JavaScript, Image) ao
    usar helpers apropriados. Valores válidos:

    - (bool) ``false`` - Não faz nada (padrão)
    - (bool) ``true`` - Anexa o timestamp quando debug é ``true``
    - (string) 'force' - Sempre anexa o timestamp.
Asset.cacheTime
    Define o tempo de cache de assets. Isto determina o ``max-age`` do cabeçalho http ``Cache-Control``
    e o tempo do cabeçalho http ``Expire`` para assets.
    Isto pode aceitar qualquer coisa que sua versão da `função strtotime do PHP
    <https://php.net/manual/en/function.strtotime.php>`_ possa aceitar.
    O padrão é ``+1 day``.

Usando uma CDN
--------------

Para usar uma CDN para carregar seus assets estáticos, altere ``App.imageBaseUrl``,
``App.cssBaseUrl``, ``App.jsBaseUrl`` para apontar para a URI da CDN, por exemplo:
``https://mycdn.example.com/`` (note a barra final ``/``).

Todas as imagens, scripts e estilos carregados via HtmlHelper irão anexar o caminho
absoluto da CDN, correspondendo ao mesmo caminho relativo usado na aplicação. Por favor note
que há um caso de uso específico ao usar assets baseados em plugin: plugins não irão
usar o prefixo do plugin quando a URI absoluta ``...BaseUrl`` é usada, por exemplo por
padrão:

* ``$this->Helper->assetUrl('TestPlugin.logo.png')`` resolve para ``test_plugin/logo.png``

Se você definir ``App.imageBaseUrl`` para ``https://mycdn.example.com/``:

* ``$this->Helper->assetUrl('TestPlugin.logo.png')`` resolve para ``https://mycdn.example.com/logo.png``.

Database Configuration
----------------------

See the :ref:`Database Configuration <database-configuration>` for information
on configuring your database connections.

Caching Configuration
---------------------

See the :ref:`Caching Configuration <cache-configuration>` for information on
configuring caching in CakePHP.

Error and Exception Handling Configuration
------------------------------------------

See the :ref:`Error and Exception Configuration <error-configuration>` for
information on configuring error and exception handlers.

Logging Configuration
---------------------

See the :ref:`log-configuration` for information on configuring logging in
CakePHP.

Email Configuration
-------------------

See the :ref:`Email Configuration <email-configuration>` for information on
configuring email presets in CakePHP.

Session Configuration
---------------------

See the :ref:`session-configuration` for information on configuring session
handling in CakePHP.

Routing configuration
---------------------

See the :ref:`Routes Configuration <routes-configuration>` for more information
on configuring routing and creating routes for your application.

.. _additional-class-paths:

Additional Class Paths
======================

Additional class paths are setup through the autoloaders your application uses.
When using ``composer`` to generate your autoloader, you could do the following,
to provide fallback paths for controllers in your application::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders/",
            "App\\": "src/"
        }
    }

The above would setup paths for both the ``App`` and ``App\Controller``
namespace. The first key will be searched, and if that path does not contain the
class/file the second key will be searched. You can also map a single namespace
to multiple directories with the following::

    "autoload": {
        "psr-4": {
            "App\\": ["src/", "/path/to/directory/"]
        }
    }

Plugin, View Template and Locale Paths
--------------------------------------

Since plugins, view templates and locales are not classes, they cannot have an
autoloader configured. CakePHP provides three Configure variables to setup additional
paths for these resources. In your **config/app.php** you can set these variables::

    return [
        // More configuration
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/path/to/other/plugins/',
                ],
                'templates' => [
                    ROOT . DS . 'templates' . DS,
                    ROOT . DS . 'templates2' . DS,
                ],
                'locales' => [
                    ROOT . DS . 'resources' . DS . 'locales' . DS,
                ],
            ],
        ],
    ];

Paths should end with a directory separator, or they will not work properly.

Inflection Configuration
========================

See the :ref:`inflection-configuration` docs for more information.

Configure Class
===============

.. php:namespace:: Cake\Core

.. php:class:: Configure

CakePHP's Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class
allows you to store anything in it, then use it in any other part
of your code: a sure temptation to break the MVC pattern CakePHP
was designed for. The main goal of Configure class is to keep
centralized variables that can be shared between many objects.
Remember to try to live by "convention over configuration" and you
won't end up breaking the MVC structure CakePHP provides.

Writing Configuration data
--------------------------

.. php:staticmethod:: write($key, $value)

Use ``write()`` to store data in the application's configuration::

    Configure::write('Company.name', 'Pizza, Inc.');
    Configure::write('Company.slogan', 'Pizza for your body and soul');

.. note::

    The :term:`dot notation` used in the ``$key`` parameter can be used to
    organize your configuration settings into logical groups.

The above example could also be written in a single call::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);

You can use ``Configure::write('debug', $bool)`` to switch between debug and
production modes on the fly.

.. note::

    Any configuration changes done using ``Configure::write()`` are in memory
    and will not persist across requests.


Reading Configuration Data
--------------------------

.. php:staticmethod:: read($key = null, $default = null)

Used to read configuration data from the application. If a key is supplied, the
data is returned. Using our examples from write() above, we can read that data
back::

    // Returns 'Pizza Inc.'
    Configure::read('Company.name');

    // Returns 'Pizza for your body and soul'
    Configure::read('Company.slogan');

    Configure::read('Company');
    // Returns:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

    // Returns 'fallback' as Company.nope is undefined.
    Configure::read('Company.nope', 'fallback');

If ``$key`` is left null, all values in Configure will be returned.

.. php:staticmethod:: readOrFail($key)

Reads configuration data just like :php:meth:`Cake\\Core\\Configure::read()`
but expects to find a key/value pair. In case the requested pair does not
exist, a :php:class:`RuntimeException` will be thrown::

    Configure::readOrFail('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Will throw an exception

    Configure::readOrFail('Company');

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

Checking to see if Configuration Data is Defined
------------------------------------------------

.. php:staticmethod:: check($key)

Used to check if a key/path exists and has non-null value::

    $exists = Configure::check('Company.name');

Deleting Configuration Data
---------------------------

.. php:staticmethod:: delete($key)

Used to delete information from the application's configuration::

    Configure::delete('Company.name');

Reading & Deleting Configuration Data
-------------------------------------

.. php:staticmethod:: consume($key)

Read and delete a key from Configure. This is useful when you want to
combine reading and deleting values in a single operation.

.. php:staticmethod:: consumeOrFail($key)

Consumes configuration data just like :php:meth:`Cake\\Core\\Configure::consume()`
but expects to find a key/value pair. In case the requested pair does not
exist, a :php:class:`RuntimeException` will be thrown::

    Configure::consumeOrFail('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::consumeOrFail('Company.geolocation');  // Will throw an exception

    Configure::consumeOrFail('Company');

    // Yields:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

Reading and writing configuration files
=======================================

.. php:staticmethod:: setConfig($name, $engine)

CakePHP comes with two built-in configuration file engines.
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig` is able to read PHP config
files, in the same format that Configure has historically read.
:php:class:`Cake\\Core\\Configure\\Engine\\IniConfig` is able to read ini config
files.  See the `PHP documentation <https://php.net/parse_ini_file>`_ for more
information on the specifics of ini files.  To use a core config engine, you'll
need to attach it to Configure using :php:meth:`Configure::config()`::

    use Cake\Core\Configure\Engine\PhpConfig;

    // Read config files from config
    Configure::config('default', new PhpConfig());

    // Read config files from another path.
    Configure::config('default', new PhpConfig('/path/to/your/config/files/'));

You can have multiple engines attached to Configure, each reading different
kinds or sources of configuration files. You can interact with attached engines
using a few other methods on Configure. To check which engine aliases are
attached you can use :php:meth:`Configure::configured()`::

    // Get the array of aliases for attached engines.
    Configure::configured();

    // Check if a specific engine is attached
    Configure::configured('default');

.. php:staticmethod:: drop($name)

You can also remove attached engines. ``Configure::drop('default')``
would remove the default engine alias. Any future attempts to load configuration
files with that engine would fail::

    Configure::drop('default');

.. _loading-configuration-files:

Loading Configuration Files
---------------------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

Once you've attached a config engine to Configure you can load configuration
files::

    // Load my_file.php using the 'default' engine object.
    Configure::load('my_file', 'default');

Loaded configuration files merge their data with the existing runtime
configuration in Configure. This allows you to overwrite and add new values into
the existing runtime configuration. By setting ``$merge`` to ``true``, values
will not ever overwrite the existing configuration.

.. warning::
    When merging configuration files with `$merge = true`, dot notation in keys is
    not expanded::

        // config1.php
        'Key1' => [
            'Key2' => [
                'Key3' => ['NestedKey1' => 'Value'],
            ],
        ],

        // config2.php
        'Key1.Key2' => [
            'Key3' => ['NestedKey2' => 'Value2'],
        ]

        Configure::load('config1', 'default');
        Configure::load('config2', 'default', true);

        // Now Key1.Key2.Key3 has the value ['NestedKey2' => 'Value2']
        // instead of ['NestedKey1' => 'Value', 'NestedKey2' => 'Value2']

Creating or Modifying Configuration Files
-----------------------------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = [])

Dumps all or some of the data in Configure into a file or storage system
supported by a config engine. The serialization format is decided by the config
engine attached as $config. For example, if the 'default' engine is
a :php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`, the generated file will be
a PHP configuration file loadable by the
:php:class:`Cake\\Core\\Configure\\Engine\\PhpConfig`

Given that the 'default' engine is an instance of PhpConfig.
Save all data in Configure to the file `my_config.php`::

    Configure::dump('my_config', 'default');

Save only the error handling configuration::

    Configure::dump('error', 'default', ['Error', 'Exception']);

``Configure::dump()`` can be used to either modify or overwrite
configuration files that are readable with :php:meth:`Configure::load()`

Storing Runtime Configuration
-----------------------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

You can also store runtime configuration values for use in a future request.
Since configure only remembers values for the current request, you will
need to store any modified configuration information if you want to
use it in subsequent requests::

    // Store the current configuration in the 'user_1234' key in the 'default' cache.
    Configure::store('user_1234', 'default');

Stored configuration data is persisted in the named cache configuration. See the
:doc:`/core-libraries/caching` documentation for more information on caching.

Restoring Runtime Configuration
-------------------------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

Once you've stored runtime configuration, you'll probably need to restore it
so you can access it again. ``Configure::restore()`` does exactly that::

    // Restore runtime configuration from the cache.
    Configure::restore('user_1234', 'default');

When restoring configuration information it's important to restore it with
the same key, and cache configuration as was used to store it. Restored
information is merged on top of the existing runtime configuration.

Configuration Engines
---------------------

CakePHP provides the ability to load configuration files from a number of
different sources, and features a pluggable system for `creating your own
configuration engines
<https://api.cakephp.org/5.x/interface-Cake.Core.Configure.ConfigEngineInterface.html>`__.
The built in configuration engines are:

* `JsonConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.JsonConfig.html>`__
* `IniConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.IniConfig.html>`__
* `PhpConfig <https://api.cakephp.org/5.x/class-Cake.Core.Configure.Engine.PhpConfig.html>`__

By default your application will use ``PhpConfig``.

.. meta::
    :title lang=en: Configuration
    :keywords lang=en: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
