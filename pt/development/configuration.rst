Configuração
############

Embora as convenções eliminem a necessidade de configurar todo o CakePHP, Você ainda precisará configurar algumas coisas,
como suas credenciais de banco de dados por exemplo.

Além disso, há opções de configuração opcionais que permitem trocar valores padrão e implementações com as personalizadas
para seu aplicativo.

.. index:: app.php, app.php.default

.. index:: configuration

Configurando sua Aplicação
==========================

A configuração é geralmente armazenada em arquivos PHP ou INI, e carregada durante a execução do código de inicialização. O
CakePHP vem com um arquivo de configuração por padrão. Mas se necessário, você pode adicionar arquivos de configuração
adicionais e carregá-los no código de inicialização do aplicativo. :php:class:`Cake\\Core\\Configure` é usado para
configuração
global, e classes como ``Cache`` providenciam ``config()`` métodos para tornar a configuração simples e transparente.

Carregando Arquivos de Configurações Adicionais
-----------------------------------------------

Se sua aplicação tiver muitas opções de configuração, pode ser útil dividir a configuração em vários arquivos. Depois de
criar
cada um dos arquivos no seu **config/** diretório, você pode carregá-los em **bootstrap.php**::

    use Cake\Core\Configure;
    use Cake\Core\Configure\Engine\PhpConfig;
    
    Configure::config('default', new PhpConfig());
    Configure::load('app', 'default', false);
    Configure::load('other_config', 'default');
    
Você também pode usar arquivos de configuração adicionais para fornecer sobreposições específicas do ambiente. Cada arquivo
carregado após **app.php** pode redefinir valores previamente declarados permitindo que você personalize a configuração para
ambientes de desenvolvimento ou de homologação.

Configuração Geral
------------------

Abaixo está uma descrição das variáveis e como elas afetam seu aplicativo CakePHP.

debug
    Altera a saída de depuração do CakePHP. ``false`` = Modo Produção. Não é exibido nenhuma mensagem de erro e/ou aviso.
    ``true`` = Modo de Desenvolvimento. É exibido todas as mensagens de erros e/ou avisos.
App.namespace
    O namespace em que as classes do aplicativo estão.
    
    .. note::
    
        Ao alterar o namespace em sua configuração, você também precisará atualizar o arquivo ** composer.json ** para usar
        esse namespace também. Além disso, crie um novo carregador automático executando ``php composer.phar dumpautoload``.
        
.. _core-configuration-baseurl:

App.baseUrl
    Não comentar esta definição se você **não** planeja usar o mod\_rewrite do Apache com o CakePHP. Não se esqueça de
    remover seus arquivos .htaccess também.
App.base
    O diretório base no qual o aplicativo reside. Se ``false`` isso será detectado automaticamente. Se não ``false``,
    certifique-se de que sua seqüência de caracteres começa com um `/` e NÃO termina com um `/`. Por exemplo, `/basedir` deve
    ser uma App.base válida. Caso contrário, o AuthComponent não funcionará corretamente.
App.encoding
    Defina a codificação que seu aplicativo usa. Essa codificação é usada para gerar o charset no layout e codificar
    entidades. Ele deve corresponder aos valores de codificação especificados para o seu banco de dados.
App.webroot
    O diretório raiz da aplicação web.
App.wwwRoot
    O diretório raiz dos arquivos da aplicação web.
App.fullBaseUrl
    O nome de domínio totalmente qualificado (incluindo o protocolo) para a raiz do aplicativo. Isso é usado ao gerar URLs
    absolutos. Por padrão, esse valor é gerado usando a variável $_SERVER. Entretanto, Você deve defini-lo manualmente para
    otimizar o desempenho ou se você está preocupado com as pessoas manipulando o cabeçalho do ``Host``.
    Em um contexto CLI (do Shell) a `fullBaseUrl` não pode ser lido a partir de $_SERVER, como não há servidor envolvido.
    Você precisará especificá-lo se precisar gerar URLs de um shell (por exemplo, ao enviar e-mails).
App.imageBaseUrl
    O caminho da web para as imagens públicas na webroot da aplicação. Se você estiver usando um :term:`CDN`, você deve
    definir este valor para a localização do CDN.
App.cssBaseUrl
    O caminho da web para os arquivos de estilos em cascata(**.css**) públicos na webroot da aplicação. Se você estiver
    usando um :term:`CDN`, você deve definir este valor para a localização do CDN.
App.jsBaseUrl
    O caminho da web para os scripts (em JavaScript) públicos na webroot da aplicação. Se você estiver usando um :term:`CDN`,
    você deve definir este valor para a localização do CDN.
App.paths
    Configurar caminhos para recursos não baseados em classe. Suporta as subchaves ``plugins``, ``templates``, ``locales``,
    que permitem a definição de caminhos para plugins, templates e arquivos de locale respectivamente.
Security.salt
    Uma seqüência aleatória usada em hash. Uma seqüência aleatória usada em hash. Este valor também é usado como o sal HMAC
    ao fazer criptografia simétrica.
Asset.timestamp
    Acrescenta um carimbo de data/hora que é a última hora modificada do arquivo específico no final dos URLs de arquivos de
    recurso (CSS, JavaScript, Image) ao usar assistentes adequados.
    Valores válidos:
    
    - (bool) ``false`` - Não fazer nada (padrão)
    - (bool) ``true`` - Acrescenta o carimbo de data/hora quando depuração é ``true``
    - (string) 'force' - Sempre anexa o carimbo de data/hora.
    
Configuração do banco de dados
------------------------------

Consulte :ref:`Database Configuration <database-configuration>` para obter informações sobre como configurar suas conexões
de banco de dados.

Configuração do Cache
---------------------

Consulte :ref:`Caching Configuration <cache-configuration>` para obter informações sobre como configurar o cache no CakePHP.

Configuração de manipulação de erro e exceção
---------------------------------------------

Consulte :ref:`Error and Exception Configuration <error-configuration>` para obter informações sobre como configurar
manipuladores de erro e exceção.

Configuração de log
-------------------

Consulte :ref:`log-configuration` para obter informações sobre como configurar o log no CakePHP.

Configuração de e-mail
----------------------

Consulte :ref:`Email Configuration <email-configuration>` para obter informações sobre como configurar predefinições de 
e-mail no CakePHP.

Configuração de sessão
----------------------

Consulte :ref:`session-configuration` para obter informações sobre como configurar o tratamento de sessão no CakePHP.

Configuração de roteamento
--------------------------

Consulte :ref:`Routes Configuration <routes-configuration>` para obter mais informações sobre como configurar o roteamento 
e criar rotas para seu aplicativo.

.. _additional-class-paths:

Caminhos adicionais de classe
=============================

Caminhos de classe adicionais são configurados através dos carregadores automáticos usados pelo aplicativo. Ao usar o
``Composer`` para gerar o seu arquivo de autoload, você pode fazer o seguinte, para fornecer caminhos alternativos para
controladores em seu aplicativo::

    "autoload": {
        "psr-4": {
            "App\\Controller\\": "/path/to/directory/with/controller/folders",
            "App\": "src"
        }
    }
    
O código acima seria configurar caminhos para o namespace ``App`` e ``App\Controller``. A primeira chave será pesquisada e,
se esse caminho não contiver a classe/arquivo, a segunda chave será pesquisada. Você também pode mapear um namespace único
para vários diretórios com o seguinte código::

    "autoload": {
        "psr-4": {
            "App\": ["src", "/path/to/directory"]
        }
    }
    
Plugin, Modelos de Visualização e Caminhos Locais
-------------------------------------------------

Como os plug-ins, os modelos de visualização (Templates) e os caminhos locais (locales) não são classes, eles não podem ter
um autoloader configurado. O CakePHP fornece três variáveis de configuração para configurar caminhos adicionais para esses
recursos. No **config/app.php** você pode definir estas variáveis ::

    return [
        // More configuration
        'App' => [
            'paths' => [
                'plugins' => [
                    ROOT . DS . 'plugins' . DS,
                    '/path/to/other/plugins/'
                ],
                'templates' => [
                    APP . 'Template' . DS,
                    APP . 'Template2' . DS
                ],
                'locales' => [
                    APP . 'Locale' . DS
                ]
            ]
        ]
    ];
    
Caminhos devem terminar com um separador de diretório, ou eles não funcionarão corretamente.

Configuração de Inflexão
========================

Consulte :ref:`inflection-configuration` para obter mais informações sobre como fazer a configuração de inflexão.

Configurar classe
=================

.. php:namespace:: Cake\Core

.. php:class:: Configure

A classe de Configuração do CakePHP pode ser usada para armazenar e recuperar valores específicos do aplicativo ou do tempo
de execução. Tenha cuidado, pois essa classe permite que você armazene qualquer coisa nela, para que em seguida, usá-la em
qualquer outra parte do seu código: Dando ma certa tentação de quebrar o padrão MVC do CakePHP. O objetivo principal da
classe Configurar é manter variáveis centralizadas que podem ser compartilhadas entre muitos objetos. Lembre-se de tentar
viver por "convenção sobre a configuração" e você não vai acabar quebrando a estrutura MVC previamente definida.

Você pode acessar o ``Configure`` de qualquer lugar de seu aplicativo::

    Configure::read('debug');

Escrevendo dados de configuração
--------------------------------

.. php:staticmethod:: write($key, $value)

Use ``write()`` para armazenar dados na configuração do aplicativo::

    Configure::write('Company.name', 'Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');
    
.. note::

    O :term:`dot notation` usado no parâmetro ``$ key`` pode ser usado para organizar suas configurações em grupos lógicos.
    
O exemplo acima também pode ser escrito em uma única chamada::

    Configure::write('Company', [
        'name' => 'Pizza, Inc.',
        'slogan' => 'Pizza for your body and soul'
    ]);
    
Você pode usar ``Configure::write('debug', $bool)`` para alternar entre os modos de depuração e produção na mosca. Isso é
especialmente útil para interações JSON onde informações de depuração podem causar problemas de análise.

Leitura de dados de configuração
--------------------------------

.. php:staticmethod:: read($key = null)

Usado para ler dados de configuração da aplicação. Por padrão o valor de depuração do CakePHP é importante. Se for fornecida
uma chave, os dados são retornados. Usando nossos exemplos de write() acima, podemos ler os dados de volta::

    Configure::read('Company.name');    // Yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  // Yields: 'Pizza for your body
                                        // and soul'

    Configure::read('Company');

    //Rendimentos:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];
    
Se $key for deixada nula, todos os valores em Configure serão retornados.

.. php:staticmethod:: readOrFail($key)

Lê dados de configuração como :php:meth:`Cake\\Core\\Configure::read`, mas espera encontrar um par chave/valor. Caso o par
solicitado não exista, a :php:class:`RuntimeException` será lançada::

    Configure::readOrFail('Company.name');    // Rendimentos: 'Pizza, Inc.'
    Configure::readOrFail('Company.geolocation');  // Vai lançar uma exceção

    Configure::readOrFail('Company');

    // Rendimentos:
    ['name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul'];

.. versionadded:: 3.1.7
    ``Configure::readOrFail()`` Foi adicionado na versão 3.1.7
    
Verificar se os dados de configuração estão definidos
-----------------------------------------------------

.. php:staticmethod:: check($key)

Usado para verificar se uma chave/caminho existe e tem valor não nulo::

    $exists = Configure::check('Company.name');
    
Excluindo Dados de Configuração
---------------------------------

.. php:staticmethod:: delete($key)
