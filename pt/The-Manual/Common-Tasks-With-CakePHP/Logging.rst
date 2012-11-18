Log
###

Por mais que as configurações da classe Configure do CakePHP possam
realmente ajudar você a visualizar o que está acontecendo por dentro de
sua aplicação, algumas vezes é importante ter logs de dados no disco
para descobrir o que está acontecendo. Num mundo que está se tornando
cada vez mais dependente de tecnologias como SOAP e AJAX, a depuração
pode ser bem dificultada.

Log de erros também pode ser uma maneira de visualizar o que acontece
com sua aplicação ao longo do tempo. Que termos de busca estão sendo
usados? Que tipos de erros estão sendo mostrados a meus usuários? Quão
frequente executada é uma determinada consulta?

Fazer log de dados no CakePHP é fácil - a função the log() é parte da
classe Object, que é o ancestrarl comum para a maioria das classes do
CakePHP. Se o contexto for uma classe do CakePHP (Models, Controllers,
Components... praticamente tudo), você pode registrar um log dos dados.

Usando a função log
===================

A função log() leva dois parâmetros. O primeiro é a mensagem que você
gostaria de escrever no arquivo de log. Por padrão, esta mensagem de
erro é escrita para o arquivo log de erro encontrado em
app/tmp/logs/error.log.

::

    // Executar isto dentro de uma classe CakePHP...
     
    $this->log("Alguma coisa não deu certo!");
     
    // ...resulta nisto sendo anexado ao arquivo app/tmp/logs/error.log
     
    2007-11-02 10:22:02 Error: Alguma coisa não deu certo!

O segundo parâmetro é usado para definir o tipo do log de erro cuja
mensagem você quer escrever. Se não informado, o padrão para este
segundo parâmetro é LOG\_ERROR, que registra o log de erro previamente
mencionado. Você pode definir este segundo parâmetro, p.ex., para
LOG\_DEBUG para escrever suas mensagem para um arquivo de log
alternativo de depuração que será encontrado em app/tmp/logs/debug.log:

::

    // Executar isto dentro de uma classe CakePHP...
     
    $this->log('Uma mensagem de depuração.', LOG_DEBUG);
     
    // ...resulta nisto sendo anexado ao arquivo app/tmp/logs/debug.log (ao invés de error.log)
     
    2007-11-02 10:22:02 Error: Uma mensagem de depuração.

Você também pode especificar um nome diferente para o arquivo de log
definindo um nome de arquivo como segundo parâmetro.

::

    // Executar isto dentro de uma classe CakePHP...
     
    $this->log('Uma mensagem especial do registro de log da atividade.', 'activity');
     
    // ...resulta nisto sendo anexado ao arquivo app/tmp/logs/activity.log (ao invés de error.log)
     
    2007-11-02 10:22:02 Activity: Uma mensagem especial do registro de log da atividade.

Seu diretório app/tmp deve ter permissão de escrita para o usuário do
servidor web para que os recursos de log funcionem corretamente.

Utilizando a classe FileLog padrão
==================================

Por mais que o CakeLog possa ser configurado para escrever para uma
porção de adaptadores de log configurados pelo usuário, ele também vem
com uma configuração padrão para log. Esta configuração é idêntica a
como o CakeLog funcionava no CakePHP 1.2. A configuração padrão de log
será usada todas as vezes em que *nenhum outro* adaptador de log esteja
configurado. Uma vez que um adaptador de log tenha sido configurado,
você também precisará configurar o FileLog se você quiser continuar
mantendo registros de log em arquivo.

Como o próprio nome diz, o FileLog escreve mensagens de log em arquivos.
O tipo da mensagem de log que está sendo escrita determina o nome do
arquivo em que a mensagem será armazenada. Se um tipo não for informado
então LOG\_ERROR será utilizado, o que faz a escrita em um log de erro.
O caminho padrão dos arquivos de log é em ``app/tmp/logs/$type.log``

::

    // Executando isto dentro de uma classe do CakePHP:
     $this->log("Aconteceu algum problema!");
     
    // Os resultados serão anexados ao arquivo app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Aconteceu algum problema!

Você pode especificar nomes de log personalizados utilizando o segundo
parâmetro. A classe FileLog padrão irá tratar este nome de log como o
nome do arquivo no qual você quer escrever as mensagens de log.

::

    // chamado estaticamente
    CakeLog::write('activity', 'Uma mensagem especial de um log de atividade');
     
    // Os resultados serão anexados ao arquivo app/tmp/logs/activity.log (ao invés de error.log)
    2007-11-02 10:22:02 Activity: Uma mensagem especial de um log de atividade

O diretório configurado deve ter permissão de escrita pelo usuário do
servidor web para que o registro de log funcione corretamente.

Você pode configurar outros locais adicionais/alternativos para o
FileLog com o método ``CakeLog::config()``. O FileLog aceita um ``path``
que permite que caminhos personalizados sejam utilizados.

::

    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/caminho/alternativo/dos/logs/'
    ));

Criando e configurando streams de log
=====================================

Manipuladores de streams de log podem fazer parte de sua aplicação ou de
plugins. Por exemplo, você poderia ter um logger de banco de dados
chamado ``DataBaseLogger``. Como parte se sua aplicação ele estaria em
``app/libs/log/data_base_logger.php``. Já como parte de um plugin, ele
estaria localizado em
``app/plugins/my_plugin/libs/log/data_base_logger.php``. Quando
configurado, o ``CakeLog`` tentará carregá-lo. A configuração de streams
de log é feita com uma chamada a ``CakeLog::config()``. No caso, a
configuração de nosso DataBaseLogger poderia ser algo parecido com

::

    // para app/libs
    CakeLog::config('outroArquivo', array(
        'engine' => 'DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

    // para um plugin chamado LoggingPack
    CakeLog::config('outroArquivo', array(
        'engine' => 'LoggingPack.DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

Ao configurar um stream de log, o parâmetro ``engine`` é usado para
localizar e carregar o manipulador do log. Todas as outras propriedades
de configuração são passadas para o contrutor do stream de log como um
array.

::

    class DataBaseLogger {
        function __construct($options = array()) {
            //...
        }
    }

O CakePHP não possui outros requisitos para streams de Log além de que
eles têm de implementar um método ``write``. Este método write deve
receber dois parâmetros, ``$tipo, $mensagemcode> nesta ordem.  $tipo`` é
uma string com o tipo da mensagem no registro de log e seus valores
principais são ``error``, ``warning``, ``info`` e ``debug``. Além disso
você também pode definir seus próprios tipos ao chamar
``CakeLog::write``.

Deve-se notar que você vai encontrar error ao tentar configurar loggers
em nível de aplicação no arquivo ``app/config/core.php``. Isto porque
neste ponto os caminhos ainda não foram inicializados pelo bootstrap. A
configuração de loggers deve ser feita no ``app/config/bootstrap.php``
para garantir que as classes tenham sido carregadas adequadamente.

Interacting with log streams
============================

You can introspect the configured streams with
``CakeLog::configured()``. The return of ``configured()`` is an array of
all the currently configured streams. You can remove streams using
``CakeLog::drop($key)``. Once a log stream has been dropped it will no
longer receive messages.

Error logging
=============

Errors are now logged when ``Configure::write('debug', 0);``. You can
use ``Configure::write('log', $val)``, to control which errors are
logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.
