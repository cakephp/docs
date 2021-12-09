Caching
#######

.. php:namespace::  Cake\Cache

.. php:class:: Cache

O cache pode ser usado para acelerar a leitura de recursos caros ou lentos,
mantendo uma segunda cópia dos dados necessários em um sistema de armazenamento
mais rápido ou mais próximo. Por exemplo, você pode armazenar os resultados de
consultas caras ou acesso remoto ao serviço da Web que não muda com freqüência
em um cache. Uma vez no cache, é muito mais barato do que acessar o recurso remoto.

O armazenamento em cache no CakePHP é facilitado pela classe ``Cache``. Esta
classe fornece uma interface estática e uma API uniforme para interagir com
várias implementações de armazenamento em cache. O CakePHP fornece vários
mecanismos de cache e fornece uma interface simples se você precisar criar
seu próprio back-end. Os mecanismos de armazenamento em cache integrados são:

* ``File`` O cache de arquivo é um cache simples que usa arquivos locais.
  É o mecanismo de cache mais lento e não fornece tantos recursos para operações
  atômicas. No entanto, como o armazenamento em disco geralmente é bastante barato,
  o armazenamento de objetos grandes ou elementos que raramente são gravados
  funciona bem em arquivos.
* ``Memcached`` Usa a extensão `Memcached <https://php.net/memcached>`_.
* ``Redis`` Usa a extensão `phpredis <https://github.com/phpredis/phpredis>`_. O
  Redis fornece um sistema de cache rápido e persistente semelhante ao Memcached,
  também fornece operações atômicas.
* ``Apcu`` O cache do APCu usa a extensão PHP `APCu <https://php.net/apcu>`_. Essa
  extensão usa memória compartilhada no servidor da web para armazenar objetos.
  Isso o torna muito rápido e capaz de fornecer recursos atômicos de leitura/gravação.
* ``Wincache`` O Wincache usa a extensão `Wincache <https://php.net/wincache>`_.
  O Wincache é semelhante ao APC em recursos e desempenho, mas otimizado para
  Windows e IIS.
* ``Array`` Armazena todos os dados em uma matriz. Esse mecanismo não fornece
  armazenamento persistente e deve ser usado em conjuntos de testes de aplicativos.
* ``Null`` O mecanismo nulo não armazena nada e falha em todas as operações de leitura.

Independentemente do CacheEngine que você escolher, seu aplicativo interage com
:php:class:`Cake\\Cache\\Cache`.

.. _cache-configuration:

Configurando Mecanismos de Cache
================================

.. php:staticmethod:: setConfig($key, $config = null)

Seu aplicativo pode configurar qualquer número de 'engines' durante o processo de inicialização.
As configurações do mecanismo de cache são definidas em **config/app.php**.

Para um desempenho ideal, o CakePHP requer que dois mecanismos de cache sejam definidos.

* ``_cake_core_`` é usado para armazenar mapas de arquivos e resultados analisados de
  arquivos :doc:`/core-libraries/internationalization-and-localization`.
* ``_cake_model_``, é usado para armazenar descrições de esquema para seus modelos de
  aplicativos.

O uso de várias configurações de mecanismo também permite alterar gradualmente o armazenamento,
conforme necessário. Por exemplo, em seu **config/app.php**, você pode colocar o seguinte::

    // ...
    'Cache' => [
        'short' => [
            'className' => 'File',
            'duration' => '+1 hours',
            'path' => CACHE,
            'prefix' => 'cake_short_'
        ],
        // Usando um namespace para nome completo.
        'long' => [
            'className' => 'Cake\Cache\Engine\FileEngine',
            'duration' => '+1 week',
            'probability' => 100,
            'path' => CACHE . 'long' . DS,
        ]
    ]
    // ...

As opções de configuração também podem ser fornecidas como uma string :term:`DSN`.
Isso é útil ao trabalhar com variáveis de ambiente ou provedores de :term:`PaaS`::

    Cache::setConfig('short', [
        'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
    ]);

Ao usar uma sequência DSN, você pode definir parâmetros/opções adicionais como
argumentos da sequência de consultas.

Você também pode configurar os mecanismos de cache em tempo de execução::

    // Usando um nome abreviado
    Cache::setConfig('short', [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ]);

    // Usando um namespace para nome completo.
    Cache::setConfig('long', [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]);

    // Usando um construtor de objeto
    $object = new FileEngine($config);
    Cache::setConfig('other', $object);

O nome dessas configurações de mecanismo ('curto' e 'longo') é usado como o parâmetro ``$config``
para :php:meth:`Cake\\Cache\\Cache::write()` e :php:meth:`Cake\\Cache\\Cache::read()`. Ao configurar
mecanismos de cache, você pode consultar o nome da classe usando as seguintes sintaxes::

    // Nome curto (in App\ or Cake namespaces)
    Cache::setConfig('long', ['className' => 'File']);

    // Plugin com nome curto
    Cache::setConfig('long', ['className' => 'MyPlugin.SuperCache']);

    // Namespace completo
    Cache::setConfig('long', ['className' => 'Cake\Cache\Engine\FileEngine']);

    // Um objeto implementando CacheEngineInterface
    Cache::setConfig('long', ['className' => $myCache]);

.. note::

    Ao usar o ``FileEngine``, pode ser necessário usar a opção ``mask`` para
    garantir que os arquivos de cache sejam criados com as permissões corretas.

Opções do Mecanismo
-------------------

Cada mecanismo aceita as seguintes opções:

* ``duration`` Especifique uma duração padrão para quanto tempo os itens são válidos.
   Especificada como uma expressão compatível com ``strototime()``.
* ``groups`` Lista de grupos ou 'tags' associados a todas as chaves armazenadas nesta
   configuração. Útil quando você precisa excluir um subconjunto de dados de um cache.
* ``prefix`` Anexado a todas as entradas. É bom para quando você precisar compartilhar
   um espaço de chave com outra configuração de cache ou outro aplicativo.
* ``probability`` Probabilidade de atingir uma limpeza de cache. Definir como 0 o
   ``Cache::gc()`` será desativado e não funcionará automaticamente.

Opções do FileEngine
--------------------

O ``FileEngine`` usa as seguintes opções específicas do mecanismo:

* ``isWindows`` Preenchido automaticamente se o host é Windows ou não
* ``lock`` Os arquivos devem ser bloqueados antes de serem gravados?
* ``mask`` A máscara usada para arquivos criados
* ``path`` Caminho para onde os arquivos de cache devem ser salvos. O padrão
   é o diretório temporário do sistema.

Opções RedisEngine
------------------

O RedisEngine usa as seguintes opções específicas do mecanismo:

* ``port`` A porta em que o servidor Redis está sendo executado.
* ``host`` O host em que o servidor Redis está sendo executado.
* ``database`` O número do banco de dados a ser usado para conexão.
* ``password`` Senha do servidor Redis.
* ``persistent`` Uma conexão persistente deve ser feita com Redis.
* ``timeout`` Tempo limite de conexão para Redis.
* ``unix_socket`` Caminho para um soquete unix para Redist.

Opções do MemcacheEngine
------------------------

- ``compress`` Se deseja compactar dados.
- ``username`` Faça login para acessar o servidor Memcache.
- ``password`` Senha para acessar o servidor Memcache.
- ``persistent`` O nome da conexão persistente. Todas as configurações
  que usam o mesmo valor persistente compartilharão uma única conexão subjacente.
- ``serialize`` O mecanismo do serializador usado para serializar dados. Os mecanismos disponíveis são php,
  igbinary e json. Ao lado do php, a extensão memcached deve ser compilada com o suporte serializador apropriado.
- ``servers`` Cadeia ou matriz de servidores com cache de memória. Se for um array,
  o MemcacheEngine os usará como um pool.
- ``options`` Opções adicionais para o cliente memcached. Deve ser uma matriz de opção => valor.
  Use as constantes ``\Memcached::OPT_*`` como chaves.

.. _cache-configuration-fallback:

Configurando Fallbacks de Cache
-------------------------------

No caso de um mecanismo não estar disponível, como o ``FileEngine`` tentando
gravar em uma pasta não gravável ou o ``RedisEngine`` falhando ao se conectar
ao Redis, o mecanismo voltará ao noop ``NullEngine`` e acionará um erro registrável.
Isso impede que o aplicativo lance uma exceção não capturada devido a falha no cache.

Você pode ajustar as configurações de cache para retornar a uma configuração especifica
usando a chave de configuração ``fallback``::

    Cache::setConfig('redis', [
        'className' => 'Redis',
        'duration' => '+1 hours',
        'prefix' => 'cake_redis_',
        'host' => '127.0.0.1',
        'port' => 6379,
        'fallback' => 'default',
    ]);

Se o servidor Redis falhar inesperadamente, a configuração de cache ``redis``
retornaria à gravação na configuração de cache ``default``. Se a gravação na
configuração do cache ``default`` *também* falhar nesse cenário, o mecanismo
retornará novamente ao ``NullEngine`` e impedirá o aplicativo de lançar uma
exceção não capturada.

Você pode desativar fallbacks de cache com ``false``::

    Cache::setConfig('redis', [
        'className' => 'Redis',
        'duration' => '+1 hours',
        'prefix' => 'cake_redis_',
        'host' => '127.0.0.1',
        'port' => 6379,
        'fallback' => false
    ]);

Quando não houver falhas no cache de fallback, serão geradas exceções.

Remoção de Mecanismos de Cache Configurados
-------------------------------------------

.. php:staticmethod:: drop($key)

Depois que uma configuração é criada, você não pode alterá-la. Em vez disso, você
deve descartar a configuração e recriá-la usando :php:meth:`Cake\\Cache\\Cache::drop()` e
:php:meth:`Cake\\Cache\\Cache::setConfig()`. Descartar um mecanismo de cache
removerá a configuração e destruirá o adaptador, se ele tiver sido construído.

Gravando em um Cache
====================

.. php:staticmethod:: write($key, $value, $config = 'default')

``Cache::write()`` gravará um $valor no cache. Você pode ler ou
excluir esse valor posteriormente consultando-o com ``$key``.
Você pode especificar uma configuração opcional para armazenar o
cache também. Se nenhum ``$config`` for especificado, o padrão
será usado. ``Cache::write()`` pode armazenar qualquer tipo
de objeto e é ideal para armazenar resultados de descobertas de
modelos::

    if (($posts = Cache::read('posts')) === false) {
        $posts = $someService->getAllPosts();
        Cache::write('posts', $posts);
    }

Usando ``Cache::write()`` e ``Cache::read()`` irá reduzir o
número de viagens feitas ao banco de dados para buscar postagens.

.. note::

    Se você planeja armazenar em cache o resultado de consultas feitas com o
    ORM do CakePHP, é melhor usar os recursos de cache internos do objeto Query,
    conforme descrito na seção :ref:`caching-query-results`

Escrevendo Várias Chaves de uma só Vez
--------------------------------------

.. php:staticmethod:: writeMany($data, $config = 'default')

Você pode precisar escrever várias chaves de cache de uma só vez. Embora você
possa usar várias chamadas para ``write()``, ``writeMany()`` permite que
o CakePHP use APIs de armazenamento mais eficientes, quando disponíveis. Por exemplo,
usando ``writeMany()`` salve várias conexões de rede ao usar o Memcached::

    $result = Cache::writeMany([
        'article-' . $slug => $article,
        'article-' . $slug . '-comments' => $comments
    ]);

    // $result poderá conter
    ['article-first-post' => true, 'article-first-post-comments' => true]

Armazenamento em Cache de Leitura
---------------------------------

.. php:staticmethod:: remember($key, $callable, $config = 'default')

Esse recurso facilita o armazenamento em cache de leitura. Se a chave de
cache nomeada existir, ela será retornada. Se a chave não existir, a chamada
será invocada e os resultados armazenados no cache da chave fornecida.

Por exemplo, você desejará armazenar em cache os resultados de chamadas
de serviço remoto. Você pode usar ``remember()`` para simplificar::

    class IssueService
    {
        public function allIssues($repo)
        {
            return Cache::remember($repo . '-issues', function () use ($repo) {
                return $this->fetchAll($repo);
            });
        }
    }

Lendo de um Cache
=================

.. php:staticmethod:: read($key, $config = 'default')

``Cache::read()`` é usado para ler o valor em cache armazenado em ``$key``
do ``$config``. Se ``$config`` for nulo, a configuração padrão será usada.
``Cache::read()`` retornará o valor em cache se for um cache válido ou
``false`` se o cache expirou ou não existe. O conteúdo do cache pode ser
avaliado como falso, portanto, use os operadores de comparação estritos:
``===`` ou ``!==``.

Por exemplo::

    $cloud = Cache::read('cloud');
    if ($cloud !== false) {
        return $cloud;
    }

    // Gere dados na nuvem
    // ...

    // Armazenar dados no cache
    Cache::write('cloud', $cloud);

    return $cloud;

Ou, se você estiver usando outra configuração de cache chamada ``short``,
poderá especificá-la nas chamadas ``Cache::read()`` e ``Cache::write()``,
conforme abaixo::

    // Leia a chave "cloud", mas a partir da configuração curta em vez do padrão

    $cloud = Cache::read('cloud', 'short');
    if ($cloud !== false) {
        return $cloud;
    }

    // Gere dados na nuvem
    // ...

    // Armazene dados no cache, usando a configuração de cache "short" em vez do padrão
    Cache::write('cloud', $cloud, 'short');

    return $cloud;

Lendo Várias Chaves de uma só Vez
---------------------------------

.. php:staticmethod:: readMany($keys, $config = 'default')

Depois de escrever várias chaves ao mesmo tempo, você provavelmente também as lerá.
Embora você possa usar várias chamadas para ``read()``, ``readMany()`` permite
que o CakePHP use APIs de armazenamento mais eficientes, quando disponíveis. Por
exemplo, usando ``readMany()`` salve várias conexões de rede ao usar o Memcached::

    $result = Cache::readMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result poderá conter
    ['article-first-post' => '...', 'article-first-post-comments' => '...']

Exclusão de um Cache
====================

.. php:staticmethod:: delete($key, $config = 'default')

``Cache::delete()`` permitirá remover completamente um objeto em cache da loja::

    // Remove uma chave
    Cache::delete('my_key');

Exclusão de Várias Chaves de uma só Vez
---------------------------------------

.. php:staticmethod:: deleteMany($keys, $config = 'default')

Depois de escrever várias chaves de uma vez, você pode excluí-las. Embora
você possa usar várias chamadas para ``delete()``, ``deleteMany()``
permite que o CakePHP use APIs de armazenamento mais eficientes, quando
disponíveis. Por exemplo, usando ``deleteMany()`` remove várias conexões
de rede ao usar o Memcached::

    $result = Cache::deleteMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result conterá
    ['article-first-post' => true, 'article-first-post-comments' => true]

Limpando Dados em Cache
=======================

.. php:staticmethod:: clear($check, $config = 'default')

Destrua todos os valores em cache para uma configuração de cache. Em mecanismos
como: Apcu, Memcached e Wincache, o prefixo da configuração do cache é usado
para remover as entradas do cache. Verifique se diferentes configurações de
cache têm prefixos diferentes::

    // Limpa apenas as chaves expiradas.
    Cache::clear(true);

    // Limpará todas as chaves.
    Cache::clear(false);

.. note::

    Como o APCu e o Wincache usam caches isolados para servidor da web e CLI,
    eles devem ser limpos separadamente (a CLI não pode limpar o servidor da web e vice-versa).

Usando Cache para Armazenar Contadores
======================================

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

Os contadores no seu aplicativo são bons candidatos para armazenamento em cache.
Como exemplo, uma contagem regressiva simples para os 'slots' restantes em uma
disputa pode ser armazenada no cache. A classe Cache expõe maneiras atômicas
de aumentar/diminuir os valores dos contadores de maneira fácil. As operações
atômicas são importantes para esses valores, pois reduzem o risco de contenção e
a capacidade de dois usuários reduzirem simultaneamente o valor em um, resultando
em um valor incorreto.

Depois de definir um valor inteiro, você pode manipulá-lo usando ``increment()`` e ``decrement()``::

    Cache::write('initial_count', 10);

    // Decrementa
    Cache::decrement('initial_count');

    // Ou
    Cache::increment('initial_count');

.. note::

    Incrementar e decrementar não funcionam com o ``FileEngine``.
    Você deve usar APCu, Wincache, Redis ou Memcached.

Usando o Cache para Armazenar Resultados Comuns de Consulta
===========================================================

Você pode melhorar bastante o desempenho do seu aplicativo colocando resultados
que raramente mudam ou estão sujeitos a leituras pesadas no cache. Um exemplo
perfeito disso são os resultados de :php:meth:`Cake\\ORM\\Table::find()`. O objeto
Query permite armazenar resultados em cache usando o método ``cache()``. Veja a seção
:ref:`caching-query-results` para mais informações.

Usando Grupos
=============

Às vezes, você deseja marcar várias entradas de cache para pertencer a determinado
grupo ou namespace. Esse é um requisito comum para chaves de invalidação em
massa sempre que algumas informações são alteradas e são compartilhadas entre todas
as entradas no mesmo grupo. Isso é possível declarando os grupos na configuração de cache::

    Cache::setConfig('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article']
    ]);

.. php:method:: clearGroup($group, $config = 'default')

Digamos que você deseja armazenar o HTML gerado para sua página inicial no cache,
mas também deseja invalidá-lo automaticamente sempre que um comentário ou postagem
for adicionado ao seu banco de dados. Adicionando os grupos ``comment`` e ``article``,
identificamos efetivamente qualquer chave armazenada nessa configuração de cache com os
dois nomes de grupos.

Por exemplo, sempre que uma nova postagem é adicionada, poderíamos dizer ao mecanismo de
cache para remover todas as entradas associadas ao grupo ``article``::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` pode ser usado para recuperar o mapeamento
entre o grupo e as configurações, ou seja: ter o mesmo grupo::

    // src/Model/Table/ArticlesTable.php

    /**
     * Uma variação do exemplo anterior que limpa todas as
     * configurações de cache com o mesmo grupo
     */
    public function afterSave($event, $entity, $options = [])
    {
        if ($entity->isNew()) {
            $configs = Cache::groupConfigs('article');
            foreach ($configs['article'] as $config) {
                Cache::clearGroup('article', $config);
            }
        }
    }

Os grupos são compartilhados em todas as configurações de cache usando o
mesmo mecanismo e o mesmo prefixo. Se você estiver usando grupos e quiser
tirar proveito da exclusão do grupo, escolha um prefixo comum para todas
as suas configurações.

Ativar ou Desativar Globalmente o Cache
=======================================

.. php:staticmethod:: disable()

Pode ser necessário desativar todas as leituras e gravações do cache ao tentar
descobrir problemas relacionados à expiração do cache. Você pode fazer isso
usando ``enable()`` e ``disable()``::

    // Desative todas as leituras de cache e gravações de cache.
    Cache::disable();

Uma vez desativado, todas as leituras e gravações retornarão ``null``.

.. php:staticmethod:: enable()

Uma vez desativado, você pode usar ``enable()`` para reativar o cache::

    // Reative todas as leituras e gravações do cache.
    Cache::enable();

.. php:staticmethod:: enabled()

Se você precisar verificar o estado do cache, poderá usar ``enabled()``.

Criando um Mecanismo de Cache
=============================

Você pode fornecer mecanismos personalizados de ``Cache`` em ``App\Cache\Engine``,
bem como em plugins usando ``$plugin\Cache\Engine``. Os mecanismos de cache devem
estar em um diretório de cache. Se você tivesse um mecanismo de cache chamado
``MyCustomCacheEngine``, ele seria colocado em **src/Cache/Engine/MyCustomCacheEngine.php**.
Ou em **plugins/MyPlugin/src/Cache/Engine/MyCustomCacheEngine.php** como parte de um plug-in.
As configurações de cache dos plugins precisam usar a sintaxe de pontos do plug-in::

    Cache::setConfig('custom', [
        'className' => 'MyPlugin.MyCustomCache',
        // ...
    ]);

Os mecanismos de cache personalizado devem estender :php:class:`Cake\\Cache\\CacheEngine`,
que define vários métodos abstratos, além de fornecer alguns métodos de inicialização.

A API necessária para um CacheEngine é

.. php:class:: CacheEngine

    A classe base para todos os mecanismos de cache usados com o Cache.

.. php:method:: write($key, $value)

    :return: boolean para sucesso.

    Escreva o valor de uma chave no cache, retorna ``true`` se os dados
    foram armazenados em cache com sucesso, ``false`` em caso de falha.

.. php:method:: read($key)

    :return: O valor em cache ou ``false`` para falha.

    Leia uma chave do cache. Retorne ``false`` para indicar
    que a entrada expirou ou não existe.

.. php:method:: delete($key)

    :return: Booleano ``true`` para sucesso.

    Exclua uma chave do cache. Retorne ``false`` para indicar que a
    entrada não existia ou não pôde ser excluída.

.. php:method:: clear($check)

    :return: Booleano ``true`` para sucesso.

    Exclua todas as chaves do cache. Se $check for ``true``, você deve
    validar se cada valor realmente expirou.

.. php:method:: clearGroup($group)

    :return: Booleano ``true`` para sucesso.

    Exclua todas as chaves do cache pertencentes ao mesmo grupo.

.. php:method:: decrement($key, $offset = 1)

    :return: Booleano ``true`` para sucesso.

    Decrementar um número na chave e retorna o valor decrementado

.. php:method:: increment($key, $offset = 1)

    :return: Booleano ``true`` para sucesso.

    Incremente um número abaixo da chave e retorna valor incrementado

.. meta::
    :title lang=pt: Cache
    :keywords lang=pt: uniforme api,cache engine,sistema de cache,operacoes atomicas,php class,armazenamento em disco,metodos estaicos,extensao php,consistencia,recursos similares,apcu,apc,memcache,consultas,cakephp,elementos,servidores,memoria
