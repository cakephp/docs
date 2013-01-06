Depuração
#########

Depuração é uma parte necessária e inevitável de qualquer ciclo de
desenvolvimento. Ainda que o CakePHP não ofereça quaisquer ferramentas
diretamente relacionada a qualquer IDE ou editor, o CakePHP dispôe de
várias ferramentas de depuração e exibição do que está sendo executado
internamente por sua aplicação.

Depuração Básica
================

debug($var, $showHTML = false, $showFrom = true)

A função debug() é uma função que está disponível globalmente e que
funciona de maneira semelhante à função print\_r() do PHP. A função
debug() permite que você exibe o conteúdo de uma variável de diferentes
maneiras. Primeiro, se você quiser que os dados sejam exibidos num
formato HTML, defina o segundo parâmetro como true. A função também
exibe a linha e o arquivo que originaram o conteúdo por padrão.

A saída desta função é exibida apenas se a variável debug do core
estiver definida para um valor maior que 0.

Usando a Classe Debugger
========================

Para usar o depurador Debugger, primeiro certifique-se de que
Configure::read('debug') esteja definida com um valor maior que 0.

dump($var)

Despeja o conteúdo de uma variável para a tela. Este método irá exibir
todas as propriedades e métodos (se existirem) para a variável
informada.

::

        $foo = array(1,2,3);
        
        Debugger::dump($foo);
        
        // saída
        array(
            1,
            2,
            3
        )
        
        // objeto simples
        $car = new Car();
        
        Debugger::dump($car);
        
        // saída
        Car::
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::acclerate()
        Car::decelerate()
        Car::stop()

log($var, $level = 7)

Cria um log detalhado da pilha de execução até o momento da chamada. O
método log() exibe dados de forma semelhante à que é feita pelo método
Debugger::dump(), mas para um arquivo debug.log ao invés de para o
buffer de saída. Note que seu diretório app/tmp directory (e seu
conteúdo) deve ter permissão de escrita pelo usuário do servidor web
para que o método log() funcione corretamente.

trace($options)

Retorna a pilha de execução atual. Cada linha da pilha inclui a listagem
dos métodos executados, incluindo o arquivo e a linha a partir de que a
chamada se originou.

::

        // Em PostsController::index()
        pr( Debugger::trace() );
        
        // saída
        PostsController::index() - APP/controllers/downloads_controller.php, line 48
        Dispatcher::_invoke() - CORE/cake/dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/cake/dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

Acima está a pilha de execução gerada pela chamada a Debugger::trace()
em uma action do controller. A leitura da pilha de execução de baixo
para cima mostra a ordem das funções atualmente em execução (stack
frames). No exemplo acima, index.php chamou Dispatcher::dispatch(), que
por sua vez chamou Dispatcher::\_invoke(). O método \_invoke() então
chamou PostsController::index(). Esta informação é útil ao trabalhar com
operações recursivas ou pilhas de execução mais profundas, já que
identifica quais funções estão atualmente em execução no momento da
chamada à trace().

excerpt($file, $line, $context)

Pega um excerto do arquivo em $path (que é um nome de arquivo absoluto),
destaca a linha de número $line com uma quantidade de linhas de contexto
($context) a seu redor.

::

        pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );
        
        // vai exibir o seguinte.
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

Por mais que este método seja usado internamente, ele pode ser útil se
você estiver criando suas próprias mensagens de erro ou entradas de log
para situações específicas.

exportVar($var, $recursion = 0)

Converte uma variável de qualquer tipo para uma string para uso na saída
de depuração. Este método também é usado pela maioria das conversões de
variáveis internas de Debugger e pode ser usada em seus próprios
depuradores também.

invoke($debugger)

Substitui o Debugger do CakePHP por um novo manipulador de erros.

A Classe Debugger
=================

A classe Debugger passou a fazer parte do CakePHP 1.2 e oferece ainda
mais opções para obtenção de informação de depuração. Há diversas
funções que são invocadas estaticamente e provêem exibição, log e função
de manipulação de erros.

A Classe Debugger sobrescreve a manipulação de erros padrão do PHP,
substituindo-a com muito mais relatórios de erros. O manipulador de
erros do Debugger é usado por padrão no CakePHP. Como para todas as
funções de depuração, o Configure::debug deve estar definida com um
valor maior que 0.

Quando um erro for lançado, o Debugger exibe informação para a página e
também cria uma entrada no arquivo error.log. O relatório de erro que é
gerado contém tanto uma pilha de execução quanto um excerto do código a
partir do qual o erro foi lançado. Clique no link "Error" para mostrar a
pilha de execução e no link "Code" para mostrar as linhas que provocaram
o erro.
