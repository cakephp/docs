Constantes e Funções
####################

Embora a maior parte do seu trabalho diário no CakePHP seja utilizando classes e
métodos principais, o CakePHP possui várias funções de conveniência globais que podem ser
úteis. Muitas dessas funções são para uso com classes do CakePHP (carregando
classes de modelo ou componente), mas muitas outras tornam o trabalho com arrays ou
strings um pouco mais fácil.

Também cobriremos algumas das constantes disponíveis em aplicações CakePHP. Usar
essas constantes ajudará a tornar as atualizações mais suaves, mas também são
formas convenientes de apontar para certos arquivos ou diretórios em sua aplicação CakePHP.

Funções Globais
================

Aqui estão as funções globalmente disponíveis do CakePHP. A maioria delas são apenas
wrappers de conveniência para outras funcionalidades do CakePHP, como depuração e
tradução de conteúdo. Por padrão, apenas funções com namespace são carregadas automaticamente,
no entanto, você pode opcionalmente carregar aliases globais adicionando::

    require CAKE . 'functions.php';

No arquivo ``config/bootstrap.php`` da sua aplicação. Fazer isso carregará aliases globais
para *todas* as funções listadas abaixo.

.. php:namespace:: Cake\I18n

.. php:function:: \_\_(string $string_id, [$formatArgs])

    Esta função lida com a localização em aplicações CakePHP. O
    ``$string_id`` identifica o ID de uma tradução. Você pode fornecer
    argumentos adicionais para substituir marcadores de posição em sua string::

        __('You have {0} unread messages', $number);

    Você também pode fornecer um array de substituições indexado por nome::

        __('You have {unread} unread messages', ['unread' => $number]);

    .. note::

        Confira a seção
        :doc:`/core-libraries/internationalization-and-localization` para
        mais informações.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Permite que você substitua o domínio atual para uma única pesquisa de mensagem.

    Útil ao internacionalizar um plugin:
    ``echo __d('plugin_name', 'This is my plugin');``

    .. note::

        Certifique-se de usar a versão sublinhada do nome do plugin aqui como domínio.

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Permite que você substitua o domínio atual para uma única pesquisa de mensagem
    no plural. Retorna a forma plural correta da mensagem identificada por ``$singular``
    e ``$plural`` para a contagem ``$count`` do domínio ``$domain``.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Permite que você substitua o domínio atual para uma única pesquisa de mensagem. Também
    permite que você especifique um contexto.

    O contexto é um identificador único para a string de traduções que a torna
    única dentro do mesmo domínio.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Permite que você substitua o domínio atual para uma única pesquisa de mensagem
    no plural. Também permite que você especifique um contexto. Retorna a forma plural
    correta da mensagem identificada por ``$singular`` e ``$plural`` para a contagem
    ``$count`` do domínio ``$domain``. Algumas línguas têm mais de uma forma
    para mensagens no plural dependentes da contagem.

    O contexto é um identificador único para a string de traduções que a torna
    única dentro do mesmo domínio.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Retorna a forma plural correta da mensagem identificada por ``$singular`` e
    ``$plural`` para a contagem ``$count``. Algumas línguas têm mais de uma forma para
    mensagens no plural dependentes da contagem.

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    O contexto é um identificador único para a string de traduções que a torna
    única dentro do mesmo domínio.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Retorna a forma plural correta da mensagem identificada por ``$singular`` e
    ``$plural`` para a contagem ``$count`` do domínio ``$domain``. Também permite que você
    especifique um contexto. Algumas línguas têm mais de uma forma para
    mensagens no plural dependentes da contagem.

    O contexto é um identificador único para a string de traduções que a torna
    única dentro do mesmo domínio.

.. php:namespace:: Cake\Collection

.. php:function:: collection(mixed $items)

    Wrapper de conveniência para instanciar um novo objeto :php:class:`Cake\\Collection\\Collection`,
    envolvendo o argumento passado. O parâmetro ``$items`` aceita tanto
    um objeto ``Traversable`` quanto um array.

.. php:namespace:: Cake\Core

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    Se a variável ``$debug`` do núcleo for ``true``, ``$var`` é impresso.
    Se ``$showHTML`` for ``true`` ou deixado como ``null``, os dados são renderizados para serem
    amigáveis ao navegador. Se ``$showFrom`` não for definido como ``false``, a saída de depuração
    começará com a linha de onde foi chamada. Veja também
    :doc:`/development/debugging`

.. php:function:: dd(mixed $var, boolean $showHtml = null)

    Comporta-se como ``debug()``, mas a execução também é interrompida.
    Se a variável ``$debug`` do núcleo for ``true``, ``$var`` é impresso.
    Se ``$showHTML`` for ``true`` ou deixado como ``null``, os dados são renderizados para serem
    amigáveis ao navegador. Veja também :doc:`/development/debugging`

.. php:function:: pr(mixed $var)

    Wrapper de conveniência para ``print_r()``, com a adição de
    envolver tags ``<pre>`` ao redor da saída.

.. php:function:: pj(mixed $var)

    Função de conveniência para impressão bonita de JSON, com a adição de
    envolver tags ``<pre>`` ao redor da saída.

    É destinada para depurar a representação JSON de objetos e arrays.

.. php:function:: env(string $key, string $default = null)

    Obtém uma variável de ambiente de fontes disponíveis. Usada como backup se
    ``$_SERVER`` ou ``$_ENV`` estiverem desabilitadas.

    Esta função também emula ``PHP_SELF`` e ``DOCUMENT_ROOT`` em
    servidores sem suporte. Na verdade, é uma boa ideia sempre usar ``env()``
    em vez de ``$_SERVER`` ou ``getenv()`` (especialmente se você planeja
    distribuir o código), já que é um wrapper de emulação completo.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Wrapper de conveniência para ``htmlspecialchars()``.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Divide um nome de plugin com sintaxe de ponto em seu plugin e nome de classe. Se ``$name``
    não tiver um ponto, então o índice 0 será ``null``.

    Comumente usado como ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: namespaceSplit(string $class)

    Divide o namespace do nome da classe.

    Comumente usado como ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``

Constantes de Definição do Núcleo
==================================

A maioria das seguintes constantes se refere a caminhos em sua aplicação.

.. php:const:: APP

   Caminho absoluto para o diretório da sua aplicação, incluindo uma barra final.

.. php:const:: APP_DIR

    Igual a ``app`` ou o nome do diretório da sua aplicação.

.. php:const:: CACHE

    Caminho para o diretório de arquivos de cache. Pode ser compartilhado entre hosts em uma
    configuração multi-servidor.

.. php:const:: CAKE

    Caminho para o diretório cake.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Caminho para o diretório lib raiz.

.. php:const:: CONFIG

   Caminho para o diretório config.

.. php:const:: CORE_PATH

   Caminho para o diretório CakePHP com barra de diretório final.

.. php:const:: DS

    Abreviação para ``DIRECTORY_SEPARATOR`` do PHP, que é ``/`` no Linux e ``\``
    no Windows.

.. php:const:: LOGS

    Caminho para o diretório logs.

.. php:const:: RESOURCES

   Caminho para o diretório resources.

.. php:const:: ROOT

    Caminho para o diretório raiz.

.. php:const:: TESTS

    Caminho para o diretório tests.

.. php:const:: TMP

    Caminho para o diretório de arquivos temporários.

.. php:const:: WWW_ROOT

    Caminho completo para o webroot.

Constantes de Definição de Tempo
=================================

.. php:const:: TIME_START

    Timestamp Unix em microssegundos como um float de quando a aplicação iniciou.

.. meta::
    :title lang=pt: Constantes e Funções Globais
    :keywords lang=pt: internacionalização e localização,constantes globais,exemplo config,array php,funções de conveniência,bibliotecas do núcleo,classes de componente,número opcional,funções globais,string string,classes do núcleo,strings de formato,mensagens não lidas,marcadores de posição,funções úteis,arrays,parâmetros,existência,traduções
