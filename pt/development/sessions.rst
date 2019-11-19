Sessões
########

O CakePHP fornece um wrapper e um conjunto de recursos de utilitários sobre a 
extensão ``session`` nativa do PHP. As sessões permitem identificar usuários 
únicos em solicitações e armazenar dados persistentes para usuários específicos. 
Ao contrário dos cookies, os dados da sessão não estão disponíveis no lado do cliente. 
O uso de ``$_SESSION`` geralmente é evitado no CakePHP, e o uso das classes Session é preferido.

.. _session-configuration:

Configuração da Sessão
=====================

A configuração da sessão é geralmente definida em ``/config/app.php``. As opções disponíveis são:

* ``Session.timeout`` - O número de *minutos* antes que o manipulador de sessões do CakePHP expire a sessão

* ``Session.defaults`` - Permite usar as configurações de sessão padrão incorporadas como base para sua 
  configuração de sessão. Veja abaixo os padrões internos.

* ``Session.handler`` - Permite definir um manipulador de sessão personalizado. O banco de dados 
  principal e os manipuladores de sessão de cache usam isso. Veja abaixo informações adicionais sobre manipuladores de sessão.

* ``Session.ini`` - Permite definir configurações adicionais de sessão ini para sua configuração. Isso 
  combinado com ``Session.handler`` substitui os recursos de manipulação de sessão personalizados das versões anteriores

* ``Session.cookie`` - O nome do cookie em uso, o padrão é 'CAKEPHP'.

* ``Session.cookiePath`` - O caminho da URL para o qual o cookie de sessão está definido. Mapeia para a configuração 
  php.ini ``session.cookie_path``. O padrão é o caminho base do aplicativo.

O padrão do CakePHP ``session.cookie_secure`` é ``true``, quando seu aplicativo está em um protocolo SSL. 
Se seu aplicativo atender a partir de protocolos SSL e não SSL, você poderá ter problemas com a perda de sessões. 
Se você precisar acessar a sessão nos domínios SSL e não SSL, desabilite isso::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

O caminho do cookie da sessão é padronizado como o caminho base do aplicativo. Para mudar isso, 
você pode usar o valor ini ``session.cookie_path``. Por exemplo, se você deseja que sua sessão 
persista em todos os subdomínios, você pode::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/',
            'session.cookie_domain' => '.yourdomain.com'
        ]
    ]);

By default PHP sets the session cookie to expire as soon as the browser is
closed, regardless of the configured ``Session.timeout`` value. The cookie
timeout is controlled by the ``session.cookie_lifetime`` ini value and can be
configured using::

Por padrão, o PHP define o cookie da sessão para expirar assim que o navegador é fechado, 
independentemente do valor configurado ``Session.timeout``. O tempo limite do cookie é 
controlado pelo valor ini ``session.cookie_lifetime`` e pode ser configurado usando:

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            // Invalide o cookie após 30 minutos sem visitar
            // qualquer página do site.
            'session.cookie_lifetime' => 1800
        ]
    ]);

A diferença entre ``Session.timeout`` e o valor ``session.cookie_lifetime`` 
é que este último depende do cliente dizer a verdade sobre o cookie. Se você 
precisar de uma verificação de tempo limite mais rigorosa, sem depender do 
que o cliente relata, use ``Session.timeout``.

Observe que ``Session.timeout`` corresponde ao tempo total de
inatividade para um usuário (ou seja, o tempo sem visitar nenhuma 
página em que a sessão é usada) e não limita a quantidade total de 
minutos que um usuário pode permanecer no site.


Manipuladores de sessão e configuração incorporados
===================================================

O CakePHP vem com várias configurações de sessão embutidas. Você pode usá-los 
como base para a configuração da sessão ou criar uma solução totalmente personalizada. 
Para usar padrões, basta definir a tecla 'padrões' como o nome do padrão que você deseja 
usar. Você pode substituir qualquer subconjunto declarando-o na sua configuração da sessão::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

O exemplo acima irá usar a configuração de sessão 'php' embutida. Você pode 
aumentar parte ou a totalidade fazendo o seguinte::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 // 3 dias
    ]);

O texto acima substitui o tempo limite e o nome do cookie para a configuração da 
sessão 'php'. As configurações internas são:

* ``php`` - Salva sessões com as configurações padrão no seu arquivo php.ini.
* ``cake`` - Salva sessões como arquivos dentro de ``tmp/sessions``. Essa é uma boa opção quando 
  em hosts que não permitem que você escreva fora de seu próprio diretório. 
* ``database`` - Use as sessões de banco de dados internas. Veja abaixo para mais informações.
* ``cache`` - Use as sessões de cache internas. Veja abaixo para mais informações.

Manipuladores de Sessão
-----------------------

Session handlers can also be defined in the session config array.  By defining
the 'handler.engine' config key, you can name the class name, or provide
a handler instance.  The class/object must implement the
native PHP ``SessionHandlerInterface``. Implementing this interface will allow
``Session`` to automatically map the methods for the handler. Both the core
Cache and Database session handlers use this method for saving sessions.
Additional settings for the handler should be placed inside the handler array.
You can then read those values out from inside your handler::

Os manipuladores de sessão também podem ser definidos na matriz de configuração 
da sessão. Ao definir a chave de configuração 'handler.engine', você pode nomear 
o nome da classe ou fornecer uma instância do manipulador. A classe/objeto deve 
implementar o PHP nativo ``SessionHandlerInterface``. A implementação dessa 
interface permitirá que a ``Session`` mapeie automaticamente os métodos para 
o manipulador. Os principais manipuladores de sessão do Cache e do Banco de 
Dados usam esse método para salvar sessões. Configurações adicionais para o manipulador 
devem ser colocadas dentro da matriz do manipulador. Você pode então ler esses valores 
de dentro do seu manipulador::

    'Session' => [
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

A tabela acima mostra como você pode configurar o manipulador de sessões do banco de 
dados com um modelo de aplicativo. Ao usar nomes de classe como seu handler.engine, 
o CakePHP espera encontrar sua classe no espaço de nome ``Http\Session``. Por exemplo, 
se você tiver uma classe ``AppSessionHandler``, o arquivo deve ser 
**src/Http/Session/AppSessionHandler.php** e o nome da classe deve ser ``App\Http\Session\AppSessionHandler``. 
Você também pode usar manipuladores de sessão de plugins internos. Configurando o 
mecanismo para ``MyPlugin.PluginSessionHandler``.

.. note::
    Antes da versão 3.6.0, os arquivos do adaptador de sessão devem ser colocados em
    **src/Network/Session/AppHandler.php**.


Sessões de Banco de Dados
-------------------------

Se você precisar usar um banco de dados para armazenar os dados da sessão, configure da seguinte maneira:

    'Session' => [
        'defaults' => 'database'
    ]

Essa configuração requer uma tabela de banco de dados, com este esquema ::

  CREATE TABLE `sessions` (
    `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP, -- Optional
    `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Optional
    `data` blob DEFAULT NULL, -- for PostgreSQL use bytea instead of blob
    `expires` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

You can find a copy of the schema for the sessions table in the `application skeleton <https://github.com/cakephp/app>`_ in ``config/schema/sessions.sql``.

You can also use your own ``Table`` class to handle the saving of the sessions::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

The above will tell Session to use the built-in 'database' defaults, and
specify that a Table called ``CustomSessions`` will be the delegate for saving
session information to the database.

Cache Sessions
--------------

The Cache class can be used to store sessions as well. This allows you to store
sessions in a cache like APCu, or Memcached. There are some caveats to
using cache sessions, in that if you exhaust the cache space, sessions will
start to expire as records are evicted.

To use Cache based sessions you can configure you Session config like::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session'
        ]
    ]);

This will configure Session to use the ``CacheSession`` class as the
delegate for saving the sessions. You can use the 'config' key which cache
configuration to use. The default cache configuration is ``'default'``.

Setting ini directives
======================

The built-in defaults attempt to provide a common base for session
configuration. You may need to tweak specific ini flags as well. CakePHP
exposes the ability to customize the ini settings for both default
configurations, as well as custom ones. The ``ini`` key in the session settings,
allows you to specify individual configuration values. For example you can use
it to control settings like ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MyCookie',
            'session.cookie_lifetime' => 1800, // Valid for 30 minutes
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);

Creating a Custom Session Handler
=================================

Creating a custom session handler is straightforward in CakePHP. In this
example we'll create a session handler that stores sessions both in the Cache
(APC) and the database. This gives us the best of fast IO of APC,
without having to worry about sessions evaporating when the cache fills up.

First we'll need to create our custom class and put it in
**src/Http/Session/ComboSession.php**. The class should look
something like::

    namespace App\Http\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Http\Session\DatabaseSession;

    class ComboSession extends DatabaseSession
    {
        public $cacheKey;

        public function __construct()
        {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // Read data from the session.
        public function read($id)
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // Write data into the session.
        public function write($id, $data)
        {
            Cache::write($id, $data, $this->cacheKey);
            return parent::write($id, $data);
        }

        // Destroy a session.
        public function destroy($id)
        {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // Removes expired sessions.
        public function gc($expires = null)
        {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Our class extends the built-in ``DatabaseSession`` so we don't have to duplicate
all of its logic and behavior. We wrap each operation with
a :php:class:`Cake\\Cache\\Cache` operation. This lets us fetch sessions from
the fast cache, and not have to worry about what happens when we fill the cache.
Using this session handler is also easy. In your **app.php** make the session
block look like the following::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        ]
    ],
    // Make sure to add a apc cache config
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Now our application will start using our custom session handler for reading and
writing session data.

.. php:class:: Session

.. _accessing-session-object:

Accessing the Session Object
============================

You can access the session data any place you have access to a request object.
This means the session is accessible from:

* Controllers
* Views
* Helpers
* Cells
* Components

In addition to the basic session object, you can also use the
:php:class:`Cake\\View\\Helper\\SessionHelper` to interact with the session in
your views. A basic example of session usage would be::

    // Prior to 3.6.0 use session() instead.
    $name = $this->getRequest()->getSession()->read('User.name');

    // If you are accessing the session multiple times,
    // you will probably want a local variable.
    $session = $this->getRequest()->getSession();
    $name = $session->read('User.name');

Reading & Writing Session Data
==============================

.. php:method:: read($key)

You can read values from the session using :php:meth:`Hash::extract()`
compatible syntax::

    $session->read('Config.language');

.. php:method:: write($key, $value)

``$key`` should be the dot separated path you wish to write ``$value`` to::

    $session->write('Config.language', 'en');

You may also specify one or multiple hashes like so::

    $session->write([
      'Config.theme' => 'blue',
      'Config.language' => 'en',
    ]);

.. php:method:: delete($key)

When you need to delete data from the session, you can use ``delete()``::

    $session->delete('Some.value');

.. php:staticmethod:: consume($key)

When you need to read and delete data from the session, you can use
``consume()``::

    $session->consume('Some.value');

.. php:method:: check($key)

If you want to see if data exists in the session, you can use ``check()``::

    if ($session->check('Config.language')) {
        // Config.language exists and is not null.
    }

Destroying the Session
======================

.. php:method:: destroy()

Destroying the session is useful when users log out. To destroy a session, use
the ``destroy()`` method::

    $session->destroy();

Destroying a session will remove all serverside data in the session, but will
**not** remove the session cookie.

Rotating Session Identifiers
============================

.. php:method:: renew()

While ``AuthComponent`` automatically renews the session id when users login and
logout, you may need to rotate the session id's manually. To do this use the
``renew()`` method::

    $session->renew();

Flash Messages
==============

Flash messages are small messages displayed to end users once. They are often
used to present error messages, or confirm that actions took place successfully.

To set and display flash messages you should use
:doc:`/controllers/components/flash` and
:doc:`/views/helpers/flash`

.. meta::
    :title lang=en: Sessions
    :keywords lang=en: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
