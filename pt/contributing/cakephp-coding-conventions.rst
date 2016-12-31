Padrões de Codificação
######################

Os desenvolvedores Cake vão sempre usar os seguintes padrões de codificação.

É recomendavel que qualquer um que for desenvolver algum ingrediente para o Cake utilize esses padrões.

Adicionando novos recursos
==========================

Nenhum novo recurso deve ser adicionado ou disponibilizado sem que tenha seus próprios testes - os quais devem todos passar antes de se submeter seus códigos para o repositório.

Indentação
==========

Um tab é usado para a indentação.

Dessa forma, o código deve ser algo parecido com isto::

    // base level
        // level 1
            // level 2
        // level 1
    // base level

Ou::

    $booleanVariable = true;
    $stringVariable = "moose";
    if ($booleanVariable) {
        echo "Boolean value is true";
        if ($stringVariable == "moose") {
            echo "We have encountered a moose";
        }
    }

Estruturas de controle
======================

Estruturas de controle são  "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. Veja um exemplo abaixo com "``if``"::

    <?php 
    if ((expr_1) || (expr_2)) { 
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2; 
    } else {
        // default_action; 
    } 

* Em estruturas de controle, deve haver 1 (um) espaço antes do primeiro 
  parênteses e 1 (um) espaço entre o último parênteses e o abre-chaves.
* Sempre utilize chaves para delimitar blocos em estruturas de contole 
  mesmo se elas não forem necessárias. Chaves aumentam a legibilidade 
  do código, o que reduz a possibilidade de erros de lógica.
* O caracter abre-chaves deve estar na mesma linha que a estrutura de controle. 
  Já o fecha-chaves deve estar sempre numa nova linha, e deve ter o mesmo nível de 
  indentação da estrutura de controle. O bloco de instruções delimitado pelas chaves 
  deve começar numa nova linha, e o código nele contido deve ser um nível de indentação 
  maior que o da estrutura de controle.

::

    <?php 
    // wrong = no brackets, badly placed statement
    if (expr) statement; 

    // wrong = no brackets
    if (expr) 
        statement; 

    // good
    if (expr) {
        statement;
    }

Operador Ternário
-----------------

O Operador Ternário é permitido quando a operação ternária cabe em uma linha. 
Ternários mais longos devem ser divididos em uma instrução ``if else``. Você não deve 
aninhar operadores ternários. Opcionalmente, parênteses podem ser utilizados em 
volta da condição de verificação do ternário para dar mais clareza::

    //Good, simple and readable
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //Nested ternaries are bad
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

Chamadas de Funções
===================

Funções deve ser chamadas sem espaços entre o nome da função e o abre-parênteses. 
Deverá ter um espaço entre cada parâmetro na chamda da função::

    <?php 
    $var = foo($bar, $bar2, $bar3); 

Como você pode ver neste código, também deve haver um espaço em ambos os lados do sinal de atribuição (=).


Definição de Metódos
====================

Exemplo de definição de metódo::

    <?php 
    function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }


Parâmetros que possuam valores padrões devem ser adicionados por últimos
na definição do metódo. Tente fazer que seus metódos sempre retornem algo, pelos menos
true ou false - assim facilita a identificação que a chamada ao metódo realmente aconteceu::

    <?php 
    function connection($dns, $persistent = false) {
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

De novo, note que deve haver espaços em ambos os lados dos sinais de igual.

Comentando o Código
===================

Todos os comentários devem ser escritos em Inglês 
e deve haver uma clara maneira de identificar o bloco de código comentado.

Comentários podem conter as seguintes tags do `phpDocumentor <https://phpdoc.org>`:

*  `@author <https://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <https://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <https://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version`` and ``description`` are mandatory.
*  `@example <https://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <https://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <https://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <https://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <https://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <https://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <https://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

As tags PhpDoc são bem parecidas com as tags JavaDoc em Java. As tags 
só são processadas se elas forem a primeira coisa a aparecer numa linha 
de um bloco de documentação. Por exemplo::

    /**
     * Tag example.
     * @author this tag is parsed, but this @version is ignored
     * @version 1.0 this tag is also parsed
     */

::

    <?php 
    /**
     * Example of inline phpDoc tags.
     *
     * This function works hard with foo() to rule the world.
     */
    function bar() {
    }
     
    /**
     * Foo function
     */
    function foo() {
    }

Todos os blocos de comentários, exceto o primeiro bloco de um arquivo, 
devem ser precedidos com uma linha em branco.

Includindo Arquivos
===================

Se for precisar incluir arquivos com classes ou bibliotecas, 
utilize sempre a função `require\_once <https://secure.php.net/require_once>`_.

Tags PHP
========

Sempre utilize tags do PHP longas (<?php ?>) ao invés de tags curtas (<? ?>).

Convenções de Nomenclatura
==========================

Metódos
-------

Escreva todos os metódos em camelBack::

    function longFunctionName() {
    }

Classes
-------

Nome de Classes devem ser escritar em CamelCase, por exemplo::

    class ExampleClass {
    }

Variáveis
---------

Nomes de variável devem ser os mais descritivos possível, mas também tão curtos quanto possível. 
Variáveis normais devem ter inicial minúscula e escritas no formato camelBack? caso sejam compostas 
por mais de uma palavra. Variáveis que contenham objetos devem iniciar com uma letra maiúscula 
e estar associadas de alguma maneira ao nome da classe a que o objeto pertence. 
Por exemplo::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $Dispatcher = new Dispatcher();

Visibilidade de Membros
-----------------------

Use private e protected para metódos e variáveis. Em adicional, metódos ou variáveis
protected começa com um underscore("\_"). Exemplo::

    class A {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod() {
           /*...*/
        }
    }

Métodos ou variáveis private começa com dois underscore ("\_\_"). Exemplo::

    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /*...*/
        }
    }

Métodos Encadeados
------------------


Métodos encadeados devem ser chamandos em múltiplas linhas e indentado com um tab::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

Endereços de Exemplos
---------------------

Para todas as URLs e endereços de email de exemplo, utilize "example.com", 
"example.org" ou "example.net" como domínios. Por exemplo:


*  Email: fulano@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

O domínio ``example.com`` é reservado para este propósito (see :rfc:`2606`) e é recomendado
utilizar em documentações ou exemplos.

Arquivos
--------

Nomes de arquivos devem ser criados em minúsculas. Se um nome de 
arquivo consistir de múltiplas palavras, elas devem ser 
divididas por um caracter underscore. Por exemplo:

::

    long_file_name.php

Tipos de Variáveis
------------------

Os tipos de variáveis disponíveis para uso em blocos de documentação são:

Tipo
    Descrição
mixed
    Variável com tipo indefinido ou que pode assumir vários tipos.
integer
    Número inteiro
float
    Número ponto flutuante
boolean
    Tipo lógico (true ou false)
string
    Tipo string (qualquer valor entre "" ou ' ').
array
    Tipo array.
object
    Tipo objeto
resource
    Tipo recurso (como retornado, p.ex., pelo mysql\_connect()).
	Lembre-se que quando você especifica como mixed, você deve indicar
	qual os valores possíves
	
Constantes
----------

Contantes devem ser definidas em letras maiúsculas:

::

    define('CONSTANT', 1);

Se você escolher o nome de uma constante com múltiplas palavras, elas devem ser separadas por um caracter underscore. Por exemplo:

::

    define('LONG_NAMED_CONSTANT', 2);
