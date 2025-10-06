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

A configuração da sessão é geralmente definida em **/config/app.php**. As opções disponíveis são:

* ``Session.timeout`` - O número de *minutos* que uma sessão pode permanecer 'inativa'. Se
  nenhuma requisição for recebida por ``timeout`` minutos, o manipulador de sessão do CakePHP
  expirará a sessão. Você pode definir esta opção como ``0`` para desabilitar
  timeouts ociosos do lado do servidor.

* ``Session.defaults`` - Permite usar as configurações de sessão padrão incorporadas
  como base para sua configuração de sessão. Veja abaixo os padrões incorporados.

* ``Session.handler`` - Permite definir um manipulador de sessão personalizado. O banco de dados
  principal e os manipuladores de sessão de cache usam isso. Veja abaixo informações adicionais
  sobre manipuladores de sessão.

* ``Session.ini`` - Permite definir configurações adicionais de sessão ini para sua
  configuração. Isso combinado com ``Session.handler`` substitui os recursos de manipulação
  de sessão personalizados das versões anteriores.

* ``Session.cookie`` - O nome do cookie a ser usado. Padrão para o valor definido para
  ``session.name`` na configuração php.ini.

* ``Session.cookiePath`` - O caminho da URL para o qual o cookie de sessão está definido. Mapeia para
  a configuração php.ini ``session.cookie_path``. O padrão é o caminho base do aplicativo.

O padrão do CakePHP ``session.cookie_secure`` é ``true``, quando seu aplicativo
está em um protocolo SSL. Se seu aplicativo serve de protocolos SSL e não SSL,
então você pode ter problemas com sessões sendo perdidas. Se você precisar
acessar a sessão em domínios SSL e não SSL, você deve desabilitar
isso::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_secure' => false
        ]
    ]);

O CakePHP também define o atributo `SameSite <https://owasp.org/www-community/SameSite>`__ como ``Lax``
por padrão para cookies de sessão, o que ajuda a proteger contra ataques CSRF.
Você pode alterar o valor padrão definindo a configuração php.ini ``session.cookie_samesite``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_samesite' => 'Strict',
        ],
    ]);

O caminho do cookie da sessão é padrão para o caminho base do aplicativo. Para alterar isso, você pode usar
o valor ini ``session.cookie_path``. Por exemplo, se você deseja que sua sessão
persista em todos os subdomínios, você pode fazer::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_path' => '/',
            'session.cookie_domain' => '.yourdomain.com',
        ],
    ]);

Por padrão, o PHP define o cookie de sessão para expirar assim que o navegador é
fechado, independentemente do valor configurado ``Session.timeout``. O timeout do cookie
é controlado pelo valor ini ``session.cookie_lifetime`` e pode ser
configurado usando::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            // Invalidar o cookie após 30 minutos
            'session.cookie_lifetime' => 1800
        ]
    ]);

A diferença entre ``Session.timeout`` e o valor ``session.cookie_lifetime``
é que este último depende do cliente dizer a verdade sobre o
cookie. Se você precisar de uma verificação de timeout mais rigorosa, sem depender do
que o cliente relata, use ``Session.timeout``.

Observe que ``Session.timeout`` corresponde ao tempo total de
inatividade para um usuário (ou seja, o tempo sem visitar nenhuma
página em que a sessão é usada) e não limita a quantidade total de
minutos que um usuário pode permanecer ativo no site.

Manipuladores de Sessão e Configuração Incorporados
====================================================

O CakePHP vem com várias configurações de sessão embutidas. Você pode
usá-las como base para a configuração da sessão ou criar uma solução totalmente
personalizada. Para usar padrões, basta definir a chave 'defaults' como o nome do
padrão que você deseja usar. Você pode então substituir qualquer subconfiguração declarando-a
na sua configuração de Session::

    Configure::write('Session', [
        'defaults' => 'php'
    ]);

O exemplo acima usará a configuração de sessão 'php' incorporada. Você pode
aumentar parte ou a totalidade fazendo o seguinte::

    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 // 3 dias
    ]);

O texto acima substitui o timeout e o nome do cookie para a configuração da
sessão 'php'. As configurações incorporadas são:

* ``php`` - Salva sessões com as configurações padrão no seu arquivo php.ini.
* ``cake`` - Salva sessões como arquivos dentro de ``tmp/sessions``. Esta é uma
  boa opção quando em hosts que não permitem que você escreva fora do seu próprio
  diretório home.
* ``database`` - Use as sessões de banco de dados incorporadas. Veja abaixo para mais
  informações.
* ``cache`` - Use as sessões de cache incorporadas. Veja abaixo para mais informações.

Manipuladores de Sessão
------------------------

Os manipuladores de sessão também podem ser definidos na matriz de configuração
da sessão. Ao definir a chave de configuração 'handler.engine', você pode nomear
a classe ou fornecer uma instância do manipulador. A classe/objeto deve
implementar o ``SessionHandlerInterface`` nativo do PHP. A implementação dessa
interface permitirá que a ``Session`` mapeie automaticamente os métodos para
o manipulador. Os principais manipuladores de sessão do Cache e do Banco de
Dados usam esse método para salvar sessões. Configurações adicionais para o manipulador
devem ser colocadas dentro da matriz do manipulador. Você pode então ler esses valores
de dentro do seu manipulador::

    'Session' => [
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions',
        ],
    ]

O exemplo acima mostra como você pode configurar o manipulador de sessão do banco de dados com um
modelo de aplicativo. Ao usar nomes de classe como seu handler.engine, o CakePHP
espera encontrar sua classe no namespace ``Http\Session``. Por exemplo, se
você tiver uma classe ``AppSessionHandler``, o arquivo deve ser
**src/Http/Session/AppSessionHandler.php**, e o nome da classe deve ser
``App\Http\Session\AppSessionHandler``. Você também pode usar manipuladores de sessão
de dentro de plugins. Definindo o engine para ``MyPlugin.PluginSessionHandler``.

Sessões de Banco de Dados
--------------------------

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

Você pode encontrar uma cópia do esquema para a tabela de sessões no `esqueleto do aplicativo <https://github.com/cakephp/app>`_ em **config/schema/sessions.sql**.

Você também pode usar sua própria classe ``Table`` para lidar com o salvamento das sessões::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'DatabaseSession',
            'model' => 'CustomSessions',
        ],
    ]

O comando acima instruirá a Session a usar os padrões incorporados do 'database' e especificará que
uma Table chamada ``CustomSessions`` será o delegado para salvar
informações de sessão no banco de dados.

.. _sessions-cache-sessions:

Sessões de Cache
-----------------

A classe Cache também pode ser usada para armazenar sessões. Isso permite que você armazene
sessões em um cache como APCu ou Memcached. Existem algumas ressalvas ao usar
sessões de cache, pois se você esgotar o espaço em cache, as sessões
começarão a expirar à medida que os registros forem despejados.

Para usar sessões baseadas em cache, você pode configurar sua configuração de Session como::

    Configure::write('Session', [
        'defaults' => 'cache',
        'handler' => [
            'config' => 'session',
        ],
    ]);

Isso configurará a Session para usar a classe ``CacheSession`` como o
delegado para salvar as sessões. Você pode usar a chave 'config' que configuração de cache
usar. A configuração padrão do cache é ``'default'``.

Bloqueio de Sessão
-------------------

O esqueleto do aplicativo vem pré-configurado com uma configuração de sessão como esta::

    'Session' => [
        'defaults' => 'php',
    ],

Isso significa que o CakePHP manipulará as sessões via o que está configurado no seu ``php.ini``.
Na maioria dos casos, esta será a configuração padrão, então o PHP salvará qualquer
sessão recém-criada como um arquivo em, por exemplo, ``/var/lib/php/session``

Mas isso também significa que qualquer tarefa computacionalmente pesada, como consultar um grande conjunto de dados
combinada com uma sessão ativa, **bloqueará esse arquivo de sessão** - portanto
bloqueando os usuários de, por exemplo, abrir uma segunda aba do seu aplicativo para fazer algo mais
enquanto isso.

Para evitar esse comportamento, você terá que mudar a maneira como as sessões estão sendo
manipuladas no CakePHP usando um manipulador de sessão diferente como :ref:`sessions-cache-sessions`
combinado com o :ref:`Redis Engine <caching-redisengine>` ou outro mecanismo de cache.

.. tip::

    Se você quiser ler mais sobre Bloqueio de Sessão, veja `aqui <https://ma.ttias.be/php-session-locking-prevent-sessions-blocking-in-requests/>`_

Definindo diretivas ini
========================

Os padrões incorporados tentam fornecer uma base comum para a configuração da sessão.
Pode ser necessário ajustar também flags ini específicas. O CakePHP expõe
a capacidade de personalizar as configurações ini para as configurações padrão
e personalizadas. A chave ``ini`` nas configurações da sessão permite especificar
valores de configuração individuais. Por exemplo, você pode usá-la para controlar
configurações como ``session.gc_divisor``::

    Configure::write('Session', [
        'defaults' => 'php',
        'ini' => [
            'session.cookie_name' => 'MyCookie',
            'session.cookie_lifetime' => 1800, // Válido por 30 minutos
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        ]
    ]);

Criando um Manipulador de Sessão Personalizado
===============================================

Criar um manipulador de sessão personalizado é simples no CakePHP. Neste exemplo,
criaremos um manipulador de sessão que armazena sessões tanto no Cache
(APCu) quanto no banco de dados. Isso nos dá o melhor da E/S rápida do APCu,
sem ter que nos preocupar com a evaporação das sessões quando o cache ficar cheio.

Primeiro, precisamos criar nossa classe personalizada e colocá-la em
**src/Http/Session/ComboSession.php**. A classe deve se parecer
com algo como::

    namespace App\Http\Session;

    use Cake\Cache\Cache;
    use Cake\Core\Configure;
    use Cake\Http\Session\DatabaseSession;

    class ComboSession extends DatabaseSession
    {
        protected $cacheKey;

        public function __construct()
        {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // Ler dados da sessão.
        public function read($id): string
        {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }

            return parent::read($id);
        }

        // Gravar dados na sessão.
        public function write($id, $data): bool
        {
            Cache::write($id, $data, $this->cacheKey);

            return parent::write($id, $data);
        }

        // Destruir uma sessão.
        public function destroy($id): bool
        {
            Cache::delete($id, $this->cacheKey);

            return parent::destroy($id);
        }

        // Remove sessões expiradas.
        public function gc($expires = null): bool
        {
            return parent::gc($expires);
        }
    }

Nossa classe estende o ``DatabaseSession`` incorporado, então não temos que duplicar
toda a sua lógica e comportamento. Envolvemos cada operação com
uma operação :php:class:`Cake\\Cache\\Cache`. Isso nos permite buscar sessões no
cache rápido e não ter que nos preocupar com o que acontece quando enchemos o cache.
Em **config/app.php**, faça com que o bloco de sessão se pareça com::

    'Session' => [
        'defaults' => 'database',
        'handler' => [
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc',
        ],
    ],
    // Certifique-se de adicionar uma configuração de cache apc
    'Cache' => [
        'apc' => ['engine' => 'Apc']
    ]

Agora, nosso aplicativo começará a usar nosso manipulador de sessão personalizado para ler e
gravar dados da sessão.

.. php:class:: Session

.. _accessing-session-object:

Acessando o Objeto de Sessão
=============================

Você pode acessar os dados da sessão em qualquer lugar em que tenha acesso a um objeto de requisição.
Isso significa que a sessão é acessível em:

* Controllers
* Views
* Helpers
* Cells
* Components

Um exemplo básico de uso de sessão em controllers, views e cells seria::

    $name = $this->request->getSession()->read('User.name');

    // Se você estiver acessando a sessão várias vezes,
    // provavelmente desejará uma variável local.
    $session = $this->request->getSession();
    $name = $session->read('User.name');

Em helpers, use ``$this->getView()->getRequest()`` para obter o objeto de requisição;
Em components, use ``$this->getController()->getRequest()``.

Leitura e Gravação de Dados da Sessão
======================================

.. php:method:: read($key, $default = null)

Você pode ler valores da sessão usando sintaxe compatível com :php:meth:`Hash::extract()`::

    $session->read('Config.language', 'en');

.. php:method:: readOrFail($key)

O mesmo que wrapper de conveniência em torno de valor de retorno não nulo::

    $session->readOrFail('Config.language');

Isso é útil quando você sabe que essa chave deve estar definida e você não quer ter que verificar
a existência no próprio código.

.. php:method:: write($key, $value)

``$key`` deve ser o caminho separado por pontos que você deseja escrever ``$value`` para::

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

Quando você precisar ler e excluir dados da sessão, poderá usar
``consume()``::

    $session->consume('Some.value');

.. php:method:: check($key)

Se você deseja ver se existem dados na sessão, você pode usar ``check()``::

    if ($session->check('Config.language')) {
        // Config.language existe e não é nulo.
    }

Destruindo a Sessão
===================

.. php:method:: destroy()

Destruir a sessão é útil quando os usuários efetuam logout. Para destruir uma
sessão, use o método ``destroy()``::

    $session->destroy();

Destruir uma sessão removerá todos os dados do lado do servidor na sessão,
mas **não** removerá o cookie da sessão.

Identificadores de Sessão Rotativos
====================================

.. php:method:: renew()

Embora o ``Authentication Plugin`` renove automaticamente o ID da sessão quando os usuários fazem login e
logout, pode ser necessário girar os IDs da sessão manualmente. Para fazer isso, use o
método ``renew()``::

    $session->renew();

Mensagens Flash
===============

Mensagens flash são pequenas mensagens exibidas para os usuários finais uma vez. Elas são frequentemente
usadas para apresentar mensagens de erro ou confirmar que as ações foram realizadas com sucesso.

Para definir e exibir mensagens flash, você deve usar
:doc:`FlashComponent </controllers/components/flash>` e
:doc:`FlashHelper </views/helpers/flash>`

.. meta::
    :title lang=en: Sessions
    :keywords lang=en: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
