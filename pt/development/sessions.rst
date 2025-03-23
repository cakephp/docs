Sessões
########

O CakePHP fornece um wrapper e um conjunto de recursos de utilitários sobre a
extensão ``session`` nativa do PHP. As sessões permitem identificar usuários
únicos em solicitações e armazenar dados persistentes para usuários específicos.
Ao contrário dos cookies, os dados da sessão não estão disponíveis no lado do cliente.
O uso de ``$_SESSION`` geralmente é evitado no CakePHP, e o uso das classes Session é preferido.

.. _session-configuration:

Configuração da Sessão
======================

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

Por padrão, o PHP define o cookie da sessão para expirar assim que o navegador é fechado,
independentemente do valor configurado ``Session.timeout``. O tempo limite do cookie é
controlado pelo valor ini ``session.cookie_lifetime`` e pode ser configurado usando::

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
Para usar padrões, basta definir a chave 'defaults' como o nome do padrão que você deseja
usar. Você pode substituir qualquer subconjunto declarando-o na sua configuração de sessão::

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

Os manipuladores de sessão também podem ser definidos na matriz de configuração
da sessão. Ao definir a chave de configuração 'handler.engine', você pode nomear
a classe ou fornecer uma instância do manipulador. A classe/objeto deve
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

A amostra acima, exemplifica como você pode configurar o manipulador de sessões do banco de
dados com um modelo de aplicativo. Ao usar nomes de classe como seu handler.engine,
o CakePHP espera encontrar sua classe no namespace ``Http\Session``. Por exemplo,
se você tiver uma classe ``AppSessionHandler``, o arquivo deve ser
**src/Http/Session/AppSessionHandler.php** e o nome da classe deve ser ``App\Http\Session\AppSessionHandler``.
Você também pode usar manipuladores de sessão de plugins internos. Configurando o
mecanismo para ``MyPlugin.PluginSessionHandler``.

.. note::
    Antes da versão 3.6.0, os arquivos do adaptador de sessão devem ser colocados em
    **src/Network/Session/AppHandler.php**.


Sessões de Banco de Dados
-------------------------

Se você precisar usar um banco de dados para armazenar os dados da sessão, configure da seguinte maneira::

    'Session' => [
        'defaults' => 'database'
    ]

Essa configuração requer uma tabela de banco de dados, com este esquema::

  CREATE TABLE `sessions` (
    `id` char(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP, -- Optional
    `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Optional
    `data` blob DEFAULT NULL, -- for PostgreSQL use bytea instead of blob
    `expires` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

Você pode encontrar uma cópia do esquema para a tabela de sessões no `esqueleto do aplicativo <https://github.com/cakephp/app>`_
em ``config/schema/sessions.sql``.

Você também pode usar sua própria classe ``Tabela`` para lidar com o salvamento das sessões::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions'
        ]
    ]

O comando acima instruirá a Sessão a usar os padrões internos do 'banco de dados' e especificará que
uma Tabela chamada ``CustomSessions`` será a escolhida para salvar as informações da sessão no banco de dados.

Sessões de Cache
----------------

A classe Cache também pode ser usada para armazenar sessões. Isso permite que você armazene
sessões em um cache como APCu ou Memcached. Existem algumas ressalvas no uso de sessões de
cache, pois se você esgotar o espaço em cache, as sessões começarão a expirar à medida que
os registros forem despejados.

Para usar sessões baseadas em cache, você pode configurar sua configuração de sessão como::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session'
        ]
    ]);

Isso configurará a Session para usar a classe ``CacheSession`` como o delegado para
salvar as sessões. Você pode usar a chave 'config' para configuração de uso do cache.
A configuração padrão do cache é ``'default'``.

Definindo diretivas ini
=======================

Os padrões internos tentam fornecer uma base comum para a configuração da sessão.
Pode ser necessário ajustar também sinalizadores ini específicos. O CakePHP expõe
a capacidade de personalizar as configurações ini para as configurações padrão e
personalizadas. A chave ``ini`` nas configurações da sessão permite especificar
valores de configuração individuais. Por exemplo, você pode usá-lo para controlar
configurações como ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MyCookie',
            'session.cookie_lifetime' => 1800, // Valid for 30 minutes
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);

Criando um manipulador de sessão personalizado
==============================================

Criar um manipulador de sessão personalizado é simples no CakePHP. Neste exemplo,
criaremos um manipulador de sessão que armazena sessões no cache (APC) e no banco
de dados. Isso nos dá o melhor das E/S rápidas da APC, sem a necessidade de se
preocupar com a evaporação das sessões quando o cache ficar cheio.

Primeiro, precisamos criar nossa classe personalizada e colocá-la em **src/Http/Session/ComboSession.php**.
A classe deve se parecer com::

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

        // Lê dados da sessão.
        public function read($id)
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }

            return parent::read($id);
        }

        // Gravar dados na sessão.
        public function write($id, $data)
        {
            Cache::write($id, $data, $this->cacheKey);

            return parent::write($id, $data);
        }

        // Apaga uma sessão.
        public function destroy($id)
        {
            Cache::delete($id, $this->cacheKey);

            return parent::destroy($id);
        }

        // Remove sessões expiradas.
        public function gc($expires = null)
        {
            return Cache::gc($this->cacheKey) && parent::gc($expires);
        }
    }

Nossa classe estende o ``DatabaseSession`` interno, para que não tenhamos que duplicar
toda a sua lógica e comportamento. Envolvemos cada operação com uma operação :php:class:`Cake\\Cache\\Cache`.
Isso nos permite buscar sessões no cache rápido e não ter que nos preocupar com o que acontece quando o
cache é preenchido. Usar este manipulador de sessões também é fácil. No seu **app.php**,
faça com que o bloco de sessões esteja como o seguinte::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        ]
    ],
    // Certifique-se de adicionar uma configuração de cache apc
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Agora, nosso aplicativo começará a usar nosso manipulador de sessão personalizado para ler e gravar dados da sessão.

.. php:class:: Session

.. _accessing-session-object:

Acessando o Objeto de Sessão
============================

Você pode acessar os dados da sessão em qualquer lugar em que tenha acesso a um objeto de solicitação.
Isso significa que a sessão é acessível em:

* Controllers
* Views
* Helpers
* Cells
* Components

Além do objeto básico da sessão, você também pode usar o
:php:class:`Cake\\View\\Helper\\SessionHelper` para interagir com a
sessão nas suas visualizações. Um exemplo básico de uso da sessão seria::

    // Antes da versão 3.6.0, use session()
    $name = $this->getRequest()->getSession()->read('User.name');

    // Se você estiver acessando a sessão várias vezes,
    // provavelmente desejará uma variável local.
    $session = $this->getRequest()->getSession();
    $name = $session->read('User.name');

Leitura e gravação de dados da sessão
=====================================

.. php:method:: read($key)

Você pode ler valores da sessão usando :php:meth:`Hash::extract()`::

    $session->read('Config.language');

.. php:method:: write($key, $value)

``$key`` deve ser o caminho separado por pontos que você deseja escrever ``$value`` para:

    $session->write('Config.language', 'en');

Você também pode especificar um ou vários hashes assim::

    $session->write([
      'Config.theme' => 'blue',
      'Config.language' => 'en',
    ]);

.. php:method:: delete($key)

Quando você precisar excluir dados da sessão, poderá usar ``delete()``::

    $session->delete('Some.value');

.. php:staticmethod:: consume($key)

Quando você precisar ler e excluir dados da sessão, poderá usar ``consume()``::

    $session->consume('Some.value');

.. php:method:: check($key)

Se você deseja ver se existem dados na sessão, você pode usar ``check()``::

    if ($session->check('Config.language')) {
        // Config.language exists existe e não é nulo.
    }

Destruindo a Sessão
===================

.. php:method:: destroy()

Destruir a sessão é útil quando os usuários efetuam logout. Para destruir uma
sessão, use o método ``destroy()``::

    $session->destroy();

Destruir uma sessão removerá todos os dados do servidor na sessão,
mas **não** removerá o cookie da sessão.

Identificadores de Sessão Rotativos
===================================

.. php:method:: renew()

Embora o ``AuthComponent`` renove automaticamente o ID da sessão quando os usuários
se conectam e se desconectam, pode ser necessário girar os IDs da sessão manualmente.
Para fazer isso, use o método ``renew()``::

    $session->renew();

Mensagens em Flash
==================

Flash messages are small messages displayed to end users once. They are often
used to present error messages, or confirm that actions took place successfully.

To set and display flash messages you should use
:doc:`/controllers/components/flash` and
:doc:`/views/helpers/flash`

Mensagens em Flash são pequenas mensagens exibidas para os usuários finais uma vez.
Eles são frequentemente usados para apresentar mensagens de erro ou confirmar que as
ações foram realizadas com êxito.

Para definir e exibir mensagens em flash, você deve usar :doc:`/controllers/components/flash`
e :doc:`/views/helpers/flash`.

.. meta::
    :title lang=pt: Sessões
    :keywords lang=pt: sessões padrão, classes de sessão, recursos utilitários, encerramento de sessão, ids de sessão, persistência de dados, chave de sessão, cookie de sessão, dados de sessão, última sessão, core do banco de dados, nível de segurança, useragent, razões de segurança, id de sessão, attr, countdown, regeneração, sessions, config
