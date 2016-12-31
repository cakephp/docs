Cache
#####

O helper Cache ajuda a manter caches de todo o conteúdo de layouts e
views, economizando o tempo da obtenção de dados. O cache de views no
CakePHP armazena temporariamente o código renderizado dos layouts e
views usando o mecanismo de armazenamento definido. Deve-se atentar que
o helper Cache funciona de forma diferente de de outros helpers. Ele não
possui métodos a serem chamados diretamente. Ao invés disso, uma view é
marcada com tags de cache indicando quais blocos de conteúdo não devem
ser cacheados.

Quando uma URL é requisitada, o Cake verifica se a string da requisição
já está em cache. Se já estiver, o restante do processo de expedição da
URL ("dispatch") é ignorado. Quaisquer blocos nocache são processados
normalmente e a view é então servida. Isto cria uma grande economia de
tempo de processamento para cada requisição à URL cacheada uma vez que
um mínimo de código é de fato executado. Se o Cake não encontrar uma
view no cache ou se o cache para aquela view já estiver expirado, ele
continua o prossesso da requisição normalmente.

Cache em Geral
==============

Cache é uma espécie de armazenamento temporário que ajuda a reduzir a
carga no servidor. Por exemplo, você poderia armazenar resultados de uma
consulta demorada de banco de dados de forma que não precisasse ser
executada a cada vez que a página fosse carregada.

Com isto em mente, recurso de cache não é um armazenamento permanente e
nunca deveria ser usado para armazenar nada permanentemente. Além disso,
deveriam ser mantidas em cache apenas aquelas coisas que possam ser
geradas novamente sempre que preciso.

Mecanismos de Cache no Cake
===========================

A versão 1.2 do CakePHP dispõe de diversos mecanismos de cache. Tais
mecanismos interagem transparentemente com o helper cache, permitindo a
você armazenar caches de views em vários tipos de mídia sem se preocupar
com as peculiaridades de cada uma. A escolha do mecanismo de cache é
controlada através do arquivo de configuração app/config/core.php config
file. A maioria das opções para cada mecanismo de cache são listadas no
arquivo core.php e informações mais detalhadas sobre cada mecanismo
podem ser encontradas na seção sobre Cache.

File

O mecanismo File (arquivo) é o padrão usado pelo Cake. Ele utiliza
arquivos comuns no sistema de arquivos e possui diversos parâmetros
opcionais, mas funciona bem com os valores padrão.

APC

O mecanismo APC implementa o `Alternative PHP
Cache <https://secure.php.net/apc>`_ em opcode. Como o XCache, este mecanismo
faz cache do código opcode de PHP compilado.

XCache

O mecanismo XCache é funcionalmente semelhante ao APC e é outro que
implementa cache em opcode, via `XCache <http://xcache.lighttpd.net/>`_.
Este mecanismo precisa de um usuário e senha para funcionar
adequadamente

Memcache

O mecanismo Memcache funciona com um servidor que permite a você criar
um cache de objetos na memória do sistema. Mas informações sobre cache
em memória podem ser encontradas em
`php.net <http://www.php.net/memcache>`_ and
`memcached <http://www.danga.com/memcached/>`_

Configuração do Cache Helper
============================

O cache de views e o Cache helper possuem importantes elementos de
configuração. Configurações estas que estão detalhadas abaixo.

Para usar o Cache helper em qualquer view ou controller, você primeiro
precisa descomentar a linha Configure::Cache.check e definí-la para o
valor true no arquivo ``core.php`` de sua pasta app/config. Se este
valor não for definido para true, então o cache não será verificado ou
criado.

Manipulando Cache no Controller
===============================

Qualquer controller que utilize a funcionalidade de cache precisa
incluir o CacheHelper em seu array $helpers.

::

    var $helpers = array('Cache');

Você também precisa indicar que actions precisam de cache, e como será
feito o cache de cada action. Isto é feito por meio da variável
$cacheAction em seus controllers. $cacheAction deve ser atribuída com um
array que contenha as actions as quais você queira manter em cache e a
duração, em segundos, indicando por quanto tempo você quer que as views
permaneçam em cache. Este tempo pode ser informado também no mesmo
formato que para o strtotime() (p.ex., "1 hour" ou "3 minutes").

Considere um exemplo de um ArticlesController, que recebe muito tráfego
e que precisa de cache.

O código abaixo faz cache dos artigos frequentemente visitados por
diferentes períodos de tempo.

::

    var $cacheAction = array(
        'view/23' => 21600,
        'view/48' => 36000,
        'view/52'  => 48000
    );

Aqui, o cache de uma action completa, neste caso, uma listagem grande de
artigos.

::

    var $cacheAction = array(
        'archives/' => '60000'
    );

E agora, um cache para cada action no controller usando o formato
strtotime(), mais amigável, para indicar o período de duração do cache
no controller.

::

    var $cacheAction = "1 hour";

Marcando Conteúdo Não-Cacheado nas Views
========================================

Haverá momentos em que você não vai querer que *toda* a view seja
mantida em cache. Por exemplo, certas partes de uma página podem ficar
diferentes dependendo se o usuários já estiver autenticado ("logado") ou
se estiver navegando no site como usuário anônimo.

Para indicar blocos de conteúdo que *não* sejam mantidos em cache,
delimite-os em ``<cake:nocache> </cake:nocache>`` dessa forma:

::

    <cake:nocache>
    <?php if ($session->check('User.name')) : ?>
        Bem-vindo, <?php echo $session->read('User.name')?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    </cake:nocache>

Deve-se atentar que uma vez que a action estiver em cache, o método do
controller para a ação não é chamado - do contrário, não haveria tanto
sentido em manter a página em cache. Dessa maneira, não é possível
marcar ``<cake:nocache> </cake:nocache>`` em trechos que contenham
variáveis que são definidas no controller, já que elas terão o valor
*null*.

Limpando o Cache
================

É importante lembrar de que o Cake irá limpar uma view em cache se um
model usado na view em questão for modificado. Por exemplo, se uma view
em cache utilizar dados a partir do model Post, e se tiver havido uma
operação de INSERT, UPDATE ou DELETE em um Post, o cache para aquela
view é limpo e o novo conteúdo é gerado para a próxima requisição.

Se você precisar limpar o cache manualmente, você pode fazer isso
chamando o método Cache::clear(). Isto irá limpar **todos** os dados em
cache, incluindo dados que não sejam views.
