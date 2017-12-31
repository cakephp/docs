Constantes e Funções
####################

A maior parte do seu trabalho diário com o CakePHP será feito utilizando classes
e métodos do *core*. O CakePHP disponibiliza funções
globais de conveniência que podem ajudar. Muitas dessas funções são usadas em
classes do CakePHP (carregando um *model* ou um *component*), mas outras tornam
mais fácil o trabalho de lidar com *arrays* ou *strings*.

Nós também vamos cobrir algumas das constantes existentes em aplicações CakePHP.
Constantes essas, que facilitam *upgrades* e apontam convenientemente para
arquivos e diretórios chaves da sua aplicação.

Funções globais
===============

Aqui estão as funções disponíveis globalmente no CakePHP. A maioria delas são
*wrappers* de conveniência para funcionalidades do CakePHP, como por exemplo,
*debug* e localização de conteúdo.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    Essa função lida com a localização da sua aplicação. O ``$string_id``
    identifica o ID usado para a tradução. *Strings* são tratadas seguindo o
    formato usado no ``sprintf()``. Você pode fornecer argumentos adicionais
    para substituir *placeholders* na sua string::

        __('Você tem {0} mensagens', $number);

    .. note::
        Verifique a seção
        :doc:`/core-libraries/internationalization-and-localization` para mais
        informações.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Permite sobrescrever o domínio atual por uma mensagem simples.

    Muito útil ao localizar um *plugin*:
    ``echo __d('PluginName', 'Esse é meu plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Permite sobrescrever o domínio atual por uma mensagem no plural. Retorna
    a forma corrreta da mensagem no plural identificada por ``$singular`` e
    ``$plural``, pelo contador ``$count`` e pelo domínio ``$domain``.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Permite sobrescrever o domínio atual por uma mensagem simples. Também
    permite a especificação de um contexto.

    O contexto é um identificador único para as *strings* de tradução que a
    tornam únicas sob um mesmo domínio.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Permite sobrescrever o domínio atual por uma mensagem no plural. Também
    permite a especificação de um contexto. Retorna a forma corrreta
    da mensagem no plural identificada por ``$singular`` e
    ``$plural``, pelo contador ``$count`` e pelo domínio ``$domain``. Alguns
    idiomas tem mais de uma forma para o plural dependendo do contador.

    O contexto é um identificador único para as *strings* de tradução que a
    tornam únicas sob um mesmo domínio.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Retorna a forma corrreta da mensagem no plural identificada por
    ``$singular`` e ``$plural``, pelo contador ``$count`` e pelo domínio
    ``$domain``. Alguns idiomas tem mais de uma forma para o plural dependendo
    do contador.

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    O contexto é um identificador único para as *strings* de tradução que a
    tornam únicas sob um mesmo domínio.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Retorna a forma corrreta da mensagem no plural identificada por
    ``$singular`` e ``$plural``, pelo contador ``$count`` e pelo domínio
    ``$domain``. Alguns idiomas tem mais de uma forma para o plural dependendo
    do contador.

    O contexto é um identificador único para as *strings* de tradução que a
    tornam únicas sob um mesmo domínio.

.. php:function:: collection(mixed $items)

    *Wrapper* de conveniência para instanciar um novo objeto
    :php:class:`Cake\\Collection\\Collection`, re-passando o devido argumento.
    O parâmetro ``$items`` recebe tanto um objeto ``Traversable`` quanto um
    *array*.

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    .. versionchanged:: 3.3.0
        Esse método retorna a ``$var`` passada para que você possa, por
        instância, colocá-la em uma declaração de retorno.

    Se a variável do core ``$debug`` for ``true``, ``$var`` será imprimida.
    Se ``$showHTML`` for ``true``, ou for deixada como ``null`` os dados serão
    renderizados formatados para melhor exibição em navegadores. Se
    ``$showFrom`` não for definida como ``false``, o *debug* começará a partir
    da linha em que foi chamado. Também veja :doc:`/development/debugging`

.. php:function:: pr(mixed $var)

    .. versionchanged:: 3.3.0
        Chamar esse método vai retornar a ``$var`` passada, então, você pode,
        por instância, colocá-la em uma declaração de retorno.

    *Wrapper* de conveniência para ``print_r()`` com a adição das *tags*
    ``<pre>`` ao redor da saída.

.. php:function:: pj(mixed $var)

    .. versionchanged:: 3.3.0
        Chamar esse método vai retornar a ``$var`` passada, então, você pode,
        por instância, colocá-la em uma declaração de retorno.

    Função de conveniência para formatação de JSON, com a adição das *tags*
    ``<pre>`` ao redor da saída.

    Deve ser usada com o intuito de *debugar* JSON de objetos e *arrays*.

.. php:function:: env(string $key, string $default = null)

    .. versionchanged:: 3.1.1
        O parâmetro ``$default`` será adicionado.

    Recebe uma variável de ambiente de fontes disponíveis. Usada como *backup*
    se ``$_SERVER`` ou ``$_ENV`` estiverem desabilitados.

    Essa função também emula ``PHP_SELF`` e ``DOCUMENT_ROOT`` em servidores
    não suportados. De fato, é sempre uma boa ideia usar ``env()`` ao invés de
    ``$_SERVER``ou ``getenv()`` (especialmente se você planeja distribuir o
    código), pois é um *wrapper* completo de emulação.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    *Wrapper* de conveniência para ``htmlspecialchars()``.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Divide um nome de plugin que segue o padrão de sintaxe de pontos e o
    transforma em um nome de classe ou do *plugin*. Se ``$name`` não tem um
    ponto, então o índice 0 será ``null``.

    Comumente usada assim: ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: namespaceSplit(string $class)

    Divide o *namespace* do nome da classe.

    Comumente usada assim: ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``

Constantes de definição do Core
===============================

A maior parte das constantes a seguir referem-se a caminhos da sua aplicação.

.. php:const:: APP

    Caminho absoluto para o diretório de sua aplicação, incluindo a barra final.

.. php:const:: APP_DIR

    Igual a ``app`` ou ao nome do diretório de sua aplicação.

.. php:const:: CACHE

    Caminho para o diretório de arquivos de cache. Pode ser compartilhado entre
    hosts em uma configuração multi-servidores.

.. php:const:: CAKE

    Caminho para o diretório do CakePHP.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Caminho para o diretório raiz de bibliotecas.

.. php:const:: CONFIG

    Caminho para o diretório de configurações.

.. php:const:: CORE_PATH

    Caminho para o diretório raiz com contra-barra no final.

.. php:const:: DS

    Atalho para o ``DIRECTORY_SEPARATOR`` do PHP, que é ``/`` no Linux e ``\\``
    no Windows.

.. php:const:: LOGS

    Caminho para o diretório de logs.

.. php:const:: ROOT

    Caminho para o diretório raiz.

.. php:const:: TESTS

    Caminho para o diretório de testes.

.. php:const:: TMP

    Caminho para o diretório de arquivos temporários.

.. php:const:: WWW\_ROOT

    Caminho completo para o diretório webroot.

Constantes de definição de tempo
================================

.. php:const:: TIME_START

    Timestamp unix em microsegundos como *float* de quando a aplicação começou.

.. php:const:: SECOND

    Igual a 1

.. php:const:: MINUTE

    Igual a 60

.. php:const:: HOUR

    Igual a 3600

.. php:const:: DAY

    Igual a 86400

.. php:const:: WEEK

    Igual a 604800

.. php:const:: MONTH

    Igual a 2592000

.. php:const:: YEAR

    Igual a 31536000

.. meta::
    :title lang=pt: Constantes globais e funções
    :keywords lang=pt: constantes,funções,internacionalização,diretórios,caminhos
