Padrões de codificação
######################

Desenvolvedores do CakePHP deverão usar o `guia de codificação
PSR-2 <http://www.php-fig.org/psr/psr-2/>`_ em adição às regras apresentadas
a seguir e definidas como padrão.

É recomendado que outros desenvolvedores que optem pelo CakePHP sigam os mesmos
padrões.

Você pode usar o `CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ para verificar se o seu
código segue os padrões estabelecidos.

Adicionando novos recursos
==========================

Nenhum novo recurso deve ser adicionado sem que tenha seus próprios testes
definidos, que por sua vez, devem estar passando antes que o novo recurso seja
enviado para o repositório.

Indentação
==========

Quatro espaços serão usados para indentação.

Então, teremos uma estrutura similar a::

    // nível base
        // nível 1
            // nível 2
        // nível 1
    // nível base

Ou::

    $booleanVariable = true;
    $stringVariable = 'jacaré';
    if ($booleanVariable) {
        echo 'Valor booleano é true';
        if ($stringVariable === 'jacaré') {
            echo 'Nós encontramos um jacaré';
        }
    }

Em situações onde você estiver usando uma função em mais de uma linha, siga
as seguintes orientações:

*  O parêntese de abertura de uma função multi-linha deve ser o último conteúdo
   da linha.
*  Apenas um argumento é permitido por linha em uma função multi-linha.
*  O parêntese de fechamento de uma função multi-linha deve ter uma linha
   reservada para sí.

Um exemplo, ao invés de usar a seguinte formatação::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

Use esta::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

Comprimento da linha
====================

É recomendado manter as linhas próximas de 100 caracteres no comprimento para
melhor leitura do código. As linhas não devem ser mais longas que 120
caracteres.

Resumindo:

* 100 caracteres é o limite recomendado.
* 120 caracteres é o limite máximo.

Estruturas de controle
======================

Estruturas de controle são por exemplo, "``if``", "``for``", "``foreach``",
"``while``", "``switch``", etc. A baixo, um exemplo com "``if``"::

    if ((expr_1) || (expr_2)) {
        // ação_1;
    } elseif (!(expr_3) && (expr_4)) {
        // ação_2;
    } else {
        // ação_padrão;
    }

*  Nas estruturas de controle deve existir 1 (um) espaço antes do primeiro
   parêntese e 1 (um) espaço entre o último parêntese e a chave de abertura.
*  Sempre use chaves nas estruturas de controle, mesmo que não sejam
   necessárias. Elas melhorar a leitura do código e tendem a causar menos erros
   lógicos.
*  A abertura da chave deve ser posicionada na mesma linha que a estrutura de
   controle. A chave de fechamento deve ser colocada em uma nova linha e ter o
   mesmo nível de indentação que a estrutura de controle. O conteúdo de dentro
   das chaves deve começar em uma nova linha e receber um novo nível de
   indentação.
*  Atribuições em linha não devem ser usadas dentro de estruturas de controle.

::

    // errado = sem chaves, declaração mal posicionada
    if (expr) declaração;

    // errado = sem chaves
    if (expr)
        declaração;

    // certo
    if (expr) {
        declaração;
    }

    // errado = atribuição em linha
    if ($variable = Class::function()) {
        declaração;
    }

    // certo
    $variable = Class::function();
    if ($variable) {
        declaração;
    }

Operadores ternários
--------------------

Operadores ternários são admissíveis quando toda a operação ternária se encaixa
em uma única linha. Já operações mais longas devem ser divididas em
declarações ``if else``. Operadores ternários nunca devem ser aninhados.
Opcionalmente parênteses podem ser usados ao redor da verificação de condição
ternária para esclarecer a operação::

    // Bom, simples e legível
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Aninhamento é ruim
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

Arquivos de template
--------------------

Em arquivos de *template* (arquivos .ctp) os desenvolvedores devem usar
estruturas de controle por palavra-chave. A legibilidade em arquivos de
*template* complexos é muito melhor dessa forma. As estruturas de controle
podem tanto estar contidas em grandes blocos de código PHP, ou ainda em *tags*
PHP separadas::

    <?php
    if ($isAdmin):
        echo '<p>Você é o usuário administrador.</p>';
    endif;
    ?>
    <p>A seguinte estrutura também é aceitável:</p>
    <?php if ($isAdmin): ?>
        <p>Você é o usuário administrador.</p>
    <?php endif; ?>

Comparação
==========

Sempre tente ser o mais rigoroso possível. Se uma comparação deliberadamente não
é estrita, pode ser inteligente comentar sobre isso para evitar confusões
geradas por falta de informação.

Para testar se uma variável é nula, é recomendado usar uma verificação
estrita::

    if ($value === null) {
        // ...
    }

O valor a ser verificado deve ser posto do lado direito::

    // não recomendado
    if (null === $this->foo()) {
        // ...
    }

    // recomendado
    if ($this->foo() === null) {
        // ...
    }

Chamadas de função
==================

Funções devem ser chamadas sem espaço entre o nome da função e o parêntese
de abertura. Deve haver um espaço entre cada parâmetro de uma chamada de
função::

    $var = foo($bar, $bar2, $bar3);

Como você pode ver a cima, deve haver um espaço em ambos os lados do sinal de
igual (=).

Definição de método
===================

Exemplo de uma definição de método::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            declaração;
        }
        return $var;
    }

Parâmetros com um valor padrão, devem ser posicionados por último na definição
de uma função. Tente fazer suas funções retornarem algo, pelo menos ``true`` ou
``false``, assim pode-se determinar se a chamada de função foi bem-sucedida::

    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this->addError();
        }
        return true;
    }

Existem espaços em ambos os lados dos sinais de igual.

Declaração de tipo
------------------

Argumentos que esperam objetos, *arrays* ou *callbacks* (válidos) podem ser
declarados por tipo.
Nós apenas declaramos métodos públicos, porém, o uso da declaração por tipo não
é livre de custos::

    /**
     * Descrição do método.
     *
     * @param \Cake\ORM\Table $table A classe Table a ser usada.
     * @param array $array Algum valor em formato array.
     * @param callable $callback Algum callback.
     * @param bool $boolean Algum valor booleano.
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

Aqui ``$table`` deve ser uma instância de ``\Cake\ORM\Table``, ``$array`` deve
ser um ``array`` e ``$callback`` deve ser do tipo ``callable`` (um *callback*
válido).

Perceba que se você quiser permitir ``$array`` ser também uma instância de
``\ArrayObject`` você não deve declará-lo, pois ``array`` aceita apenas o tipo
primitivo::

    /**
     * Descrição do método.
     *
     * @param array|\ArrayObject $array Algum valor em formato array.
     */
    public function foo($array)
    {
    }

Funções anônimas (Closures)
---------------------------

Para se definir funções anônimas, segue-se o estilo de codificação `PSR-2
<http://www.php-fig.org/psr/psr-2/>`_, onde elas são declaradas com um espaço
depois da palavra-chave `function`, e um espaço antes e depois da palavra-chave
`use`::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // código
    };

Encadeamento de métodos
=======================

Encadeamento de métodos deve ter múltiplos métodos distribuidos em linhas
separadas e indentados com quatro espaços::

    $email->from('foo@exemplo.com')
        ->to('bar@exemplo.com')
        ->subject('Uma mensagem legal')
        ->send();

Comentando código
=================

Todos os comentários devem ser escritos em inglês, e devem de forma clara
descrever o bloco de código comentado.

Comentários podem incluir as seguintes *tags* do
`phpDocumentor <http://phpdoc.org>`_:

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Usando o formato ``@version <vector> <description>``, onde ``version`` e
   ``description`` são obrigatórios.
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

*Tags* PhpDoc são muito semelhantes a *tags* JavaDoc no Java. *Tags* são apenas
processadas se forem a primeira coisa numa linha de DocBlock, por exemplo::

    /**
     * Exemplo de tag.
     *
     * @author essa tag é analisada, mas essa versão é ignorada
     * @version 1.0 essa tag também é analisada
     */

::

    /**
     * Exemplo de tags phpDoc em linha.
     *
     * Essa função cria planos com foo() para conquistar o mundo.
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Função foo.
     *
     * @return void
     */
    function foo()
    {
    }

Blocos de comentários, com a exceção do primeiro bloco em um arquivo, devem
sempre ser precedidos por uma nova linha.

Tipos de variáveis
------------------

Tipos de variáveis para serem usadas em DocBlocks:

Tipo
    Descrição
mixed
    Uma variável com múltiplos tipos ou tipo indefinido.
int
    Variável de tipo *int* (número inteiro).
float
    Variável de tipo *float* (número decimal).
bool
    Variável de tipo *bool* (lógico, verdadeiro ou falso).
string
    Variável de tipo *string* (qualquer valor dentro de " " ou ' ').
null
    Variável de tipo *null*. Normalmente usada em conjunto com outro tipo.
array
    Variável de tipo *array*.
object
    Variável de tipo *object*. Um nome específico de classe deve ser usado, se
    possível.
resource
    Variável de tipo *resource* (retornado de mysql\_connect() por exemplo).
    Lembre-se que quando você especificar o tipo como *mixed*, você deve indicar
    se o mesmo é desconhecido, ou quais os tipos possíveis.
callable
    Variável de tipo função.

Você também pode combinar tipos usando o caractere de barra vertical::

    int|bool

Para mais de dois tipos é melhor usar ``mixed``.

Ao retornar o próprio objeto, e.g. para encadeamento, use ``$this`` ao invés::

    /**
     * Função Foo.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

Incluindo arquivos
==================

``include``, ``require``, ``include_once`` e ``require_once`` não tem
parênteses::

    // errado = com parênteses
    require_once('ClassFileName.php');
    require_once ($class);

    // certo = sem parênteses
    require_once 'ClassFileName.php';
    require_once $class;

Ao incluir arquivos com classes ou bibliotecas, use sempre e apenas a função
`require\_once <http://php.net/require_once>`_.

Tags do PHP
===========

Use sempre *tags* longas (``<?php ?>``) ao invés de *tags* curtas (``<? ?>``).
O *short echo* deve ser usado em arquivos de template (**.ctp**) quando
apropriado.

Short Echo
----------

O *short echo* deve ser usado em arquivos de template no lugar de
``<?php echo``. Deve também, ser imediatamente seguido por um espaço em branco,
a variável ou função a ser chamada pelo ``echo``, um espaço em branco e a *tag*
de fechamento do PHP::

    // errado = ponto-e-virgula, sem espaços
    <td><?=$name;?></td>

    // certo = sem ponto-e-virgula, com espaços
    <td><?= $name ?></td>

A partir do PHP 5.4 a *tag short echo* (``<?=``) não é mais considerada um
atalho, estando sempre disponível independentemente da configuração da chave
``short_open_tag``.

Convenção de nomenclatura
=========================

Funções
-------

Escreva todas as funções no padrão "camelBack", isto é, com a letra da primeira palavra
minúscula e a primeira letra das demais palavras maiúsculas::

    function longFunctionName()
    {
    }

Classes
-------

Escreva todas as funções no padrão "CamelCase", isto é, com a primeira letra de
cada palavra que compõem o nome da classe maiúscula::

    class ExampleClass
    {
    }

Variáveis
---------

Nomes de variáveis devem ser tanto curtas como descritivas, o quanto possível.
Todas as variáveis devem começar com letra minúscula e seguir o padrão
"camelBack" no caso de muitas palavras. Variáveis referenciando objetos devem
estar de alguma forma associadas à classe indicada. Exemplo::

    $user = 'John';
    $users = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

Visibilidade
------------

Use as palavras reservadas do PHP5, *private* e *protected* para indicar métodos
e variáveis. Adicionalmente, nomes de métodos e variáveis não-públicos começar
com um *underscore* singular (``_``). Exemplo::

    class A
    {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod()
        {
           /* ... */
        }

        private $_iAmAPrivateVariable;

        private function _iAmAPrivateMethod()
        {
            /* ... */
        }
    }

Endereços para exemplos
-----------------------

Para qualquer URL e endereços de email, use "example.com", "example.org" e
"example.net", por exemplo:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

O nome de domínio "example.com" foi reservado para isso (see :rfc:`2606`), sendo
recomendado o seu uso em documentações como exemplos.

Arquivos
--------

Nomes de arquivos que não contém classes devem ser em caixa baixa e sublinhados,
por exemplo::

    long_file_name.php

Moldagem de tipos
-----------------

Para moldagem usamos:

Tipo
    Descrição
(bool)
    Converte para *boolean*.
(int)
    Converte para *integer*.
(float)
    Converte para *float*.
(string)
    Converte para *string*.
(array)
    Converte para *array*.
(object)
    Converte para *object*.

Por favor use ``(int)$var`` ao invés de ``intval($var)`` e ``(float)$var`` ao
invés de ``floatval($var)`` quando aplicável.

Constante
---------

Constantes devem ser definidas em caixa alta::

    define('CONSTANT', 1);

Se o nome de uma constante consiste de múltiplas palavras, eles devem ser
separados por um *underscore*, por exemplo::

    define('LONG_NAMED_CONSTANT', 2);

Cuidados usando empty()/isset()
===============================

Apesar de ``empty()`` ser uma função simples de ser usada, pode mascarar erros e
causar efeitos não intencionais quando ``'0'`` e ``0`` são retornados. Quando
variáveis ou propriedades já estão definidas, o uso de ``empty()`` não é
recomendado. Ao trabalhar com variáveis, é melhor confiar em coerção de tipo
com booleanos ao invés de ``empty()``::

    function manipulate($var)
    {
        // Não recomendado, $var já está definida no escopo
        if (empty($var)) {
            // ...
        }

        // Recomendado, use coerção de tipo booleano
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

Ao lidar com propriedades definidas, você deve favorecer verificações por
``null`` sobre verificações por ``empty()``/``isset()``::

    class Thing
    {
        private $property; // Definida

        public function readProperty()
        {
            // Não recomendado já que a propriedade está definida na classe
            if (!isset($this->property)) {
                // ...
            }
            // Recomendado
            if ($this->property === null) {

            }
        }
    }

Ao trabalhar com *arrays*, é melhor mesclar valores padronizados ao usar
verificações por ``empty()``. Assim, você se assegura que as chaves necessárias
estão definidas::

    function doWork(array $array)
    {
        // Mescla valores para remover a necessidade de verificações via empty.
        $array += [
            'key' => null,
        ];

        // Não recomendado, a chave já está definida
        if (isset($array['key'])) {
            // ...
        }

        // Recomendado
        if ($array['key'] !== null) {
            // ...
        }
    }

.. meta::
    :title lang=pt: Padrões de codificação
    :keywords lang=pt: indentação,comprimento,linha,funções,classes,métodos,variáveis,propriedades,arquivos,tipos,visibilidade,inclusão,operadores ternários,template,estruturas de controle
