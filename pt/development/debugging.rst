Depuração
#########

Depuração é uma etapa inevitável e importante de qualquer ciclo de
desenvolvimento. Ainda que o CakePHP não forneça nenhuma ferramenta que se
conecte com qualquer IDE ou editor de texto, este oferece várias ferramentas que
auxiliam na depuração e exibição de tudo que está sendo executado "por baixo dos
panos" na sua aplicação.

Depuração Básica
================

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:

A função ``debug()`` é uma função de escopo global que funciona de maneira
similar a função PHP ``print_r()``. A função ``debug()`` exibe os conteúdos de
uma variável de diversas maneiras. Primeiramente, se você deseja exibir os dados
no formato HTML, defina o segundo parâmetro como ``true``. A função
também exibe a linha e o arquivo de onde a mesma foi chamada.

A saída da função somente é exibida caso a variável ``$debug`` do core esteja
definida com o valor ``true``.

.. php:function:: stackTrace()

A função ``stackTrace()`` é uma função de escopo global, função esta que permite
que seja exibida a pilha de execução onde quer que a mesma tenha sido chamada.

.. php:function:: breakpoint()

.. versionadded:: 3.1

Se você tem o `Psysh <http://psysh.org/>`_ instalado poderá usar esta função em
ambientes de interface de linha de comando (CLI) para abrir um console
interativo com o escopo local atual::

    // Some code
    eval(breakpoint());

Abrirá um console interativo que poderá ser utilizado para avaliar variáveis
locais e executar outros trechos de código. Você pode sair do depurador
interativo executando os comandos ``quit`` ou ``q`` na sessão.

Usando a Classe Debugger
========================

.. php:namespace:: Cake\Error

.. php:class:: Debugger

Para usar o depurador, assegure que ``Configure::read('debug')`` esteja definida
como ``true``.

Valores de saída
================

.. php:staticmethod:: dump($var, $depth = 3)

O método dump exibe o conteúdo da variável, incluindo todas as propriedades e
métodos (caso existam) da variável fornecida no primeiro parâmetro::

    $foo = [1,2,3];

    Debugger::dump($foo);

    // Saídas
    array(
        1,
        2,
        3
    )

    // Objeto
    $car = new Car();

    Debugger::dump($car);

    // Saídas
    object(Car) {
        color => 'red'
        make => 'Toyota'
        model => 'Camry'
        mileage => (int)15000
    }

Criando Logs com Pilha de Execução
==================================

.. php:staticmethod:: log($var, $level = 7, $depth = 3)

Cria um log detalhado da pilha de execução no momento em que a mesma foi
invocada. O método ``log()`` exibe dados similares ao``Debugger::dump()``, mas
no arquivo debug.log ao invés do buffer de saída principal. É valido ressaltar
que o diretório **tmp** e seu conteúdo devem ter permissão de escrita para o
servidor web a fim de que a função ``log()`` consiga executar corretamente.

Gerando Pilhas de Execução
==========================

.. php:staticmethod:: trace($options)

Retorna a pilha de execução atual. Cada linha inclui o método que chamou, qual
arquivo e linha do qual a chamada foi originada::

    // Em PostsController::index()
    pr(Debugger::trace());

    // Saídas
    PostsController::index() - APP/Controller/DownloadsController.php, line 48
    Dispatcher::_invoke() - CORE/src/Routing/Dispatcher.php, line 265
    Dispatcher::dispatch() - CORE/src/Routing/Dispatcher.php, line 237
    [main] - APP/webroot/index.php, line 84

Abaixo encontra-se a pilha de execução gerada ao chamar ``Debugger::trace()`` em
uma ação de um controller. A leitura do fim para o início da pilha exibe a ordem
de execução das funções.


Pegando Trechos de Arquivos
===========================

.. php:staticmethod:: excerpt($file, $line, $context)

Colete um trecho de um arquivo localizado em $path (caminho absoluto), na linha
$line com número de linhas em torno deste trecho $context::

    pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));

    // Gera como saída o seguinte:
    Array
    (
        [0] => <code><span style="color: #000000"> * @access public</span></code>
        [1] => <code><span style="color: #000000"> */</span></code>
        [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

        [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
        [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
    )

Ainda que este método seja usado internamente, o mesmo pode ser conveniente caso
você esteja criando suas próprias mensagens de erros e registros de logs.

.. php:staticmethod:: Debugger::getType($var)

Obtém o tipo da variável. Caso seja um objeto, o retorno do método será o nome
de sua classe


Usando Logging para Depuração
=============================

Registrar as mensagens é uma outra boa maneira de se depurar aplicações. Para
isto, pode ser usada a classe :php:class:`Cake\\Log\\Log` para fazer o logging
na sua aplicação. Todos os objetos que fazem uso de ``LogTrait`` têm um método
de instanciação ``log()`` que pode ser usado para registrar mensagens::

    $this->log('Cheguei aqui', 'debug');

O código acima escreverá ``Cheguei aqui`` no arquivo de registros de depuração
(debug log). Você pode usar seus registros para auxiliar na depuração de métodos
que contêm redirecionamentos e laços complicados. Você poderá usar também
:php:meth:`Cake\\Log\\Log::write()` para escrever mensagens nos registros. Esse
método pode ser chamado de forma estática em qualquer lugar da sua aplicação,
pressupondo-se que CakeLog já esteja carregado::

    // No início do arquivo que deseja registrar.
    use Cake\Log\Log;

    // Em qualquer lugar que Log tenha sido importado.
    Log::debug('Cheguei aqui');

Debug Kit
=========

O DebugKit é um plugin composto por ótimas ferramentas de depuração. Uma dessas
ferramentas é uma toolbar renderizada em HTML, na qual é possível visualizar uma
grande quantidade de informações sobre sua aplicação e a atual requisição
realizada pela mesma. Veja no capítulo :doc:`/debug-kit` como instalar e usar o
DebugKit.

.. meta::
    :title lang=pt: Depuração
    :description lang=pt: Depurando CakePHP usando a classe Debugger, logging, depuração básica e uso do plugin DebugKit.
    :keywords lang=pt: trecho de código,pilha de execução,saida padrão,link de erro,erro padrão,requisições web,relatório de erro,depurador,vetores,maneiras diferentes,trechos de código de,cakephp,ide,opções
