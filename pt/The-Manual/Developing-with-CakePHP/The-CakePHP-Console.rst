O Console do CakePHP
####################

Esta seção introduz a linha de comando no CakePHP. Caso você alguma vez
precisou acessar suas classes MVC do CakePHP em um cron job ou outro
script na linha de comando, esta seção é para você.

O PHP fornece um cliente CLI poderoso que faz com que a interface com o
seu sistema de arquivos e aplicações sejam muito mais simples. O Console
do CakePHP possui um framework para a criação de shell scripts. O
Console utiliza um configuração semelhante a de um dispatcher para
carregar um shell ou uma task e tratar seus parâmetros.

Se você pretende utilizar o Console, uma instalação da linha de comando
(CLI) do PHP deve estar disponível no sistema.

Antes de aprofundarmos, vamos nos certificar que podemos executar o
Console do CakePHP. Primeiramente você precisará carregar um sistema
shell. Os exemplos mostrados nesta seção serão em bash, mas o Console do
CakePHP também é compatível com o Windows. Vamos executar o programa
Console pelo bash. Este exemplo assume que o usuário está logado em uma
linha de comando bash e que está na raíz da instalação do CakePHP.

Você pode executar o Console utilizando algo assim:

::

    $ cd /my/cake/app_folder
    $ ../cake/console/cake

Mas a utilização recomendada é adicionar o diretório do Console no PATH,
desta maneira você pode utilizar o comando cake em qualquer lugar:

::

    $ cake

Executar o Console sem argumentos exibe a mensagem de ajuda:

::

    Hello user,
     
    Welcome to CakePHP v1.2 Console
    ---------------------------------------------------------------
    Current Paths:
     -working: /path/to/cake/
     -root: /path/to/cake/
     -app: /path/to/cake/app/
     -core: /path/to/cake/
     
    Changing Paths:
    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp
     
    Available Shells:
     
     app/vendors/shells/:
             - none
     
     vendors/shells/:
             - none
     
     cake/console/libs/:
             acl
             api
             bake
             console
             extract
     
    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

A primeira informação exibida está relacionada aos caminhos. Isto é
muito útil se você estiver executando o Console de diferentes partes do
sistema de arquivos.

Muitos usuários adicionam o Console do CakePHP ao PATH do sistema para
que ele possa ser acessado facilmente. Exibindo o caminho dos diretórios
working, root, app e core permite que você veja onde o Console irá
executar as alterações. Para alterar o diretório app que você deseja
trabalhar, você pode informar o caminho como primeiro argumento do
comando cake. Este próximo exemplo mostra como especificar o diretório
app, assumindo que você já adicionou o diretório do Console ao seu PATH:

::

    $ cake -app /path/to/app

O caminho informado pode ser relativo ao diretório de trabalho atual ou
pode ser informado como um caminho absoluto.

Criando Shells & Tarefas
========================

Criando seus próprios shells
----------------------------

Vamos criar um shell para uso no Console. Neste exemplo, criaremos um
‘report shell que exiba alguns dados do model. Primeiro, crie o arquivo
report.php em /vendors/shells/.

::

    <?php 
    class ReportShell extends Shell {
        function main() {}
    }
    ?>

A partir deste ponto, nós já podemos executar o shell, mas ele não faz
muita coisa. Vamos adicionar alguns models ao shell para que possamos
criar algum tipo de relatório. Isto pode ser feito da mesma maneira como
fazemos no controller: incluindo os nomes dos models na variável $uses.

::

    <?php
    class ReportShell extends Shell {
        var $uses = array('Order');

        function main() {
        }
    }
    ?>

Uma vez que tenhamos adicionado nosso model ao array $uses, podemos
usá-lo no método main(). Neste exemplo, nosso model Order agora deve
estar acessível no método main() como $this->Order de nosso novo shell.

Segue um exemplo simples da lógica que podemos usar neste shell:

::

    class ReportShell extends Shell {
        var $uses = array('Order');
        function main() {
            // recupera os pedidos enviados no último mês
            $month_ago = date('Y-m-d H:i:s', strtotime('-1 month'));
            $orders =    $this->Order->find("all",array('conditions'=>"Order.shipped >= '$month_ago'"));

            // exibe as informações de cada pedido
            foreach($orders as $order) {
                $this->out('Data do pedido:  ' .    $order['Order']['created'] . "\n");
                $this->out('Valor: $' .    number_format($order['Order']['amount'], 2) . "\n");
                $this->out('----------------------------------------' .    "\n");
         
                $total += $order['Order']['amount'];
            }

            // exibe o valor total para os pedidos selecionados
            $this->out("Total: $" .    number_format($total, 2) . "\n"); 
        }
    }

Você deve poder rodar este shell executando este comando (se o comando
cake estiver disponível no seu PATH):

::

    $ cake report 

onde report é o nome do arquivo de shell em /vendor/shells/ sem a
extensão .php. Isto deve retornar algo como:

::

    Hello user,
       Welcome to    CakePHP v1.2 Console
       ---------------------------------------------------------------
       App : app
       Path:    /path/to/cake/app
       ---------------------------------------------------------------
       Data do pedido:    2007-07-30 10:31:12
       Valor:    $42.78
       ----------------------------------------
       Data do pedido:    2007-07-30 21:16:03
       Valor:    $83.63
       ----------------------------------------
       Data do pedido:    2007-07-29 15:52:42
       Valor:    $423.26
       ----------------------------------------
       Data do pedido:    2007-07-29 01:42:22
       Valor:    $134.52
       ----------------------------------------
       Data do pedido:    2007-07-29 01:40:52
       Valor:    $183.56
       ----------------------------------------
       Total:    $867.75

Tasks
-----

Tasks (tarefas) são pequenas extensões para os shells. Elas permitem
compartilhar lógica entre os shells, e são adicionadas por meio da
variável de classe especial $tasks. Por exemplo, no shell bake ordinário
possui diversas tarefas definidas:

::

    <?php 
    class BakeShell extends Shell {
       var $tasks = array('Project', 'DbConfig', 'Model', 'View', 'Controller');
    }
    ?>

Tarefas residem na pasta /vendors/shells/tasks/, em classes com o mesmo
nome do arquivo, mais o prefixo Task. Assim, se quisermos criar uma nova
tarefa ‘cool’, a classe CoolTask (que extende Shell) deve ser salva no
arquivo /vendors/shells/tasks/cool.php. Já a classe VeryCoolTask (que
extende Shell) deve estar no arquivo
/vendors/shells/tasks/very\_cool.php.

Cada tarefa deve implementar pelo menos um método execute() - os shells
irão chamar este método para disparar a lógica da tarefa.

::

    <?php
    class SoundTask extends Shell {
       var $uses = array('Model'); // o mesmo que a variável $uses do controller
       function execute() {}
    }
    ?>

Você pode acessar tarefas dentro de suas classes de shell e executá-las:

::

    <?php 
    class SeaShell extends Shell { // no arquivo /vendors/shells/sea.php
       var $tasks = array('Sound'); // no arquivo /vendors/shells/tasks/sound.php
       function main() {
           $this->Sound->execute();
       }
    }
    ?>

Se houver um método chamado “sound” na classe SeaShell, isto irá
sobrescrever a capacidade do shell acessar a funcionalidade na tarefa
Sound especificada no array $tasks.

Você também pode acessar tarefas diretamente a partir da linha de
comando. Por exemplo, neste caso:

::

    $ cake sea sound

Executando Shells como tarefas agendadas
========================================

Uma coisa comum para se fazer com um shell é torná-lo uma tarefa
agendada de sistema operacional (cronjob) para, p.ex., limpar a base de
dados de vez em quando ou enviar newsletters por e-mail. Entretanto,
quando você tiver adicionado o caminho do console à variável de ambiente
PATH através de ``~/.profile``, ele estará indisponível para agendador
de tarefas.

O seguinte script BASH irá chamar seu shell e anexar os caminhos
necessários ao $PATH. Copie-o e salve-o para sua pasta vendors como
'cakeshell' e não se esqueça de torná-lo executável.
(``chmod +x cakeshell``)

::

    #!/bin/bash
    TERM=dumb
    export TERM
    cmd="cake"
    while [ $# -ne 0 ]; do
        if [ "$1" = "-cli" ] || [ "$1" = "-console" ]; then 
            PATH=$PATH:$2
            shift
        else
            cmd="${cmd} $1"
        fi
        shift
    done
    $cmd

Você pode chamá-lo desta maneira:

::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

O parâmetro ``-cli`` recebe um caminho que aponta para o executável do
PHP CLI, e o parâmetro ``-console`` recebe um caminho que aponta para o
console do CakePHP.

Agendar uma tarefa com o crontab seria algo como:

::

    # m h  dom mon dow   command
    */5 * * * * /caminho/do/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /caminho/de/app

Um truque simples para depurar uma tarefa agendada no crontab é atribuir
a saída para um arquivo de log. Poderia ser algo como:

::

    # m h  dom mon dow   command
    */5 * * * * /caminho/do/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /caminho/de/app >> /caminho/do/arquivo.log

