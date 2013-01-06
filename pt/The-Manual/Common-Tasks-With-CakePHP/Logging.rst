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
