Padrões de Codificação
######################

Os desenvolvedores do CakePHP utilizarão o `guia de estilo de codificação PSR-12
<https://www.php-fig.org/psr/psr-12/>`_ além das seguintes regras como
padrões de codificação.

É recomendado que outros desenvolvedores de CakeIngredients sigam os mesmos
padrões.

Você pode usar o `CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ para verificar se seu código
segue os padrões exigidos.

Adicionando Novos Recursos
===========================

Nenhum novo recurso deve ser adicionado sem ter seus próprios testes – que
devem ser aprovados antes de serem enviados ao repositório.

Configuração da IDE
===================

Por favor, certifique-se de que sua IDE está configurada para "aparar à direita" os espaços em branco.
Não deve haver espaços em branco no final de cada linha.

A maioria das IDEs modernas também suporta um arquivo ``.editorconfig``. O esqueleto
da aplicação CakePHP vem com ele por padrão. Ele já contém os padrões de boas práticas.

Recomendamos usar o plugin `IdeHelper <https://github.com/dereuromark/cakephp-ide-helper>`_ se você
deseja maximizar a compatibilidade da IDE. Ele ajudará a manter as anotações atualizadas, o que fará
a IDE entender completamente como todas as classes funcionam juntas e fornece melhor dicas de tipo e auto-completar.

Indentação
==========

Quatro espaços serão usados para indentação.

Portanto, a indentação deve parecer assim::

    // nível base
        // nível 1
            // nível 2
        // nível 1
    // nível base

Ou::

    $booleanVariable = true;
    $stringVariable = 'moose';
    if ($booleanVariable) {
        echo 'Boolean value is true';
        if ($stringVariable === 'moose') {
            echo 'We have encountered a moose';
        }
    }

Nos casos em que você está usando uma chamada de função de várias linhas, use as seguintes
diretrizes:

*  O parêntese de abertura de uma chamada de função de várias linhas deve ser o último conteúdo na
   linha.
*  Apenas um argumento é permitido por linha em uma chamada de função de várias linhas.
*  O parêntese de fechamento de uma chamada de função de várias linhas deve estar em uma linha separada.

Como exemplo, em vez de usar a seguinte formatação::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

Use isto em vez disso::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

Comprimento da Linha
====================

É recomendado manter as linhas com aproximadamente 100 caracteres para melhor
legibilidade do código. Um limite de 80 ou 120 caracteres torna necessário
distribuir lógica ou expressões complexas por função, bem como dar funções
e objetos nomes mais curtos e expressivos. As linhas não devem ter
mais de 120 caracteres.

Em resumo:

* 100 caracteres é o limite suave.
* 120 caracteres é o limite rígido.

Estruturas de Controle
=======================

Estruturas de controle são, por exemplo, "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. Abaixo, um exemplo com "``if``"::

    if ((expr_1) || (expr_2)) {
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2;
    } else {
        // default_action;
    }

*  Nas estruturas de controle deve haver 1 (um) espaço antes do primeiro
   parêntese e 1 (um) espaço entre o último parêntese e o colchete de abertura.
*  Sempre use chaves nas estruturas de controle, mesmo que não sejam necessárias.
   Elas aumentam a legibilidade do código e dão menos erros lógicos.
*  As chaves de abertura devem ser colocadas na mesma linha que a estrutura de
   controle. As chaves de fechamento devem ser colocadas em novas linhas e devem
   ter o mesmo nível de indentação que a estrutura de controle. A declaração
   incluída nas chaves deve começar em uma nova linha, e o código contido
   nela deve ganhar um novo nível de indentação.
*  Atribuições inline não devem ser usadas dentro das estruturas de controle.

::

    // errado = sem chaves, declaração mal posicionada
    if (expr) statement;

    // errado = sem chaves
    if (expr)
        statement;

    // bom
    if (expr) {
        statement;
    }

    // errado = atribuição inline
    if ($variable = Class::function()) {
        statement;
    }

    // bom
    $variable = Class::function();
    if ($variable) {
        statement;
    }

Operador Ternário
-----------------

Operadores ternários são permitidos quando toda a operação ternária cabe em uma
linha. Ternários mais longos devem ser divididos em instruções ``if else``. Operadores
ternários nunca devem ser aninhados. Opcionalmente, parênteses podem ser usados ao redor
da verificação de condição do ternário para maior clareza::

    // Bom, simples e legível
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Ternários aninhados são ruins
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

Arquivos de Template
--------------------

Em arquivos de template, os desenvolvedores devem usar estruturas de controle com palavras-chave.
Estruturas de controle com palavras-chave são mais fáceis de ler em arquivos de template complexos. Estruturas de
controle podem estar contidas em um bloco PHP maior ou em tags PHP separadas::

    <?php
    if ($isAdmin):
        echo '<p>You are the admin user.</p>';
    endif;
    ?>
    <p>The following is also acceptable:</p>
    <?php if ($isAdmin): ?>
        <p>You are the admin user.</p>
    <?php endif; ?>

Comparação
==========

Sempre tente ser o mais estrito possível. Se um teste não estrito for deliberado,
pode ser prudente comentá-lo como tal para evitar confundi-lo com um erro.

Para testar se uma variável é null, é recomendado usar uma verificação estrita::

    if ($value === null) {
        // ...
    }

O valor a ser verificado deve ser colocado no lado direito::

    // não recomendado
    if (null === $this->foo()) {
        // ...
    }

    // recomendado
    if ($this->foo() === null) {
        // ...
    }

Chamadas de Função
==================

Funções devem ser chamadas sem espaço entre o nome da função e o
parêntese de abertura. Deve haver um espaço entre cada parâmetro de uma chamada de função::

    $var = foo($bar, $bar2, $bar3);

Como você pode ver acima, deve haver um espaço em ambos os lados do sinal de igual (=).

Definição de Método
====================

Exemplo de uma definição de método::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }

        return $var;
    }

Parâmetros com um valor padrão devem ser colocados por último na definição da função.
Tente fazer suas funções retornarem algo, pelo menos ``true`` ou ``false``, para que
se possa determinar se a chamada da função foi bem-sucedida::

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

Há espaços em ambos os lados do sinal de igual.

Retorno Antecipado
==================

Tente evitar aninhamento desnecessário retornando antecipadamente::

    public function run(array $data)
    {
        ...
        if (!$success) {
            return false;
        }

        ...
    }

    public function check(array $data)
    {
        ...
        if (!$success) {
            throw new RuntimeException(/* ... */);
        }

        ...
    }

Isso ajuda a manter a lógica sequencial, o que melhora a legibilidade.

Tipagem
-------

Argumentos que esperam objetos, arrays ou callbacks (callable) podem ter tipo definido.
No entanto, apenas tipamos métodos públicos, pois a tipagem não é sem custo::

    /**
     * Some method description.
     *
     * @param \Cake\ORM\Table $table The table class to use.
     * @param array $array Some array value.
     * @param callable $callback Some callback.
     * @param bool $boolean Some boolean value.
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

Aqui ``$table`` deve ser uma instância de ``\Cake\ORM\Table``, ``$array`` deve ser
um ``array`` e ``$callback`` deve ser do tipo ``callable`` (um callback válido).

Note que se você quiser permitir que ``$array`` também seja uma instância de
``\ArrayObject``, você não deve definir o tipo como ``array``, pois aceita apenas o tipo
primitivo::

    /**
     * Some method description.
     *
     * @param array|\ArrayObject $array Some array value.
     */
    public function foo($array)
    {
    }

Funções Anônimas (Closures)
----------------------------

Definir funções anônimas segue o `guia de estilo de codificação PSR-12
<https://www.php-fig.org/psr/psr-12/>`_, onde são
declaradas com um espaço após a palavra-chave `function` e um espaço antes e depois
da palavra-chave `use`::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // code
    };

Encadeamento de Métodos
========================

O encadeamento de métodos deve ter vários métodos distribuídos em linhas separadas e
indentados com quatro espaços::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

Comentando Código
=================

Todos os comentários devem ser escritos em inglês e devem descrever de forma clara
o bloco de código comentado.

Os comentários podem incluir as seguintes tags do `phpDocumentor <https://phpdoc.org>`_:

*  `@deprecated <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/deprecated.html>`_
   Usando o formato ``@version <vector> <description>``, onde ``version``
   e ``description`` são obrigatórios. Version refere-se àquela em que foi descontinuado.
*  `@example <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/example.html>`_
*  `@ignore <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/ignore.html>`_
*  `@internal <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/internal.html>`_
*  `@link <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/link.html>`_
*  `@see <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/see.html>`_
*  `@since <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/since.html>`_
*  `@version <https://docs.phpdoc.org/latest/guide/references/phpdoc/tags/version.html>`_

As tags PhpDoc são muito parecidas com as tags JavaDoc em Java. As tags só são processadas se
forem a primeira coisa em uma linha DocBlock, por exemplo::

    /**
     * Tag example.
     *
     * @author this tag is parsed, but this @version is ignored
     * @version 1.0 this tag is also parsed
     */

::

    /**
     * Example of inline phpDoc tags.
     *
     * This function works hard with foo() to rule the world.
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Foo function.
     *
     * @return void
     */
    function foo()
    {
    }

Blocos de comentários, com exceção do primeiro bloco em um arquivo, devem sempre
ser precedidos por uma nova linha.

Tipos de Variáveis
------------------

Tipos de variáveis para uso em DocBlocks:

Type
    Description
mixed
    Uma variável com tipo indefinido (ou múltiplo).
int
    Variável do tipo inteiro (número inteiro).
float
    Tipo float (número com ponto decimal).
bool
    Tipo lógico (true ou false).
string
    Tipo string (qualquer valor entre " " ou ' ').
null
    Tipo null. Geralmente usado em conjunto com outro tipo.
array
    Tipo array.
object
    Tipo objeto. Um nome de classe específico deve ser usado se possível.
resource
    Tipo resource (retornado por exemplo por mysql\_connect()).
    Lembre-se de que quando você especifica o tipo como mixed, deve indicar
    se é desconhecido ou quais são os tipos possíveis.
callable
    Função callable.

Você também pode combinar tipos usando o caractere pipe::

    int|bool

Para mais de dois tipos, geralmente é melhor usar apenas ``mixed``.

Ao retornar o próprio objeto (por exemplo, para encadeamento), deve-se usar ``$this``
em vez disso::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

Incluindo Arquivos
==================

``include``, ``require``, ``include_once`` e ``require_once`` não têm
parênteses::

    // errado = parênteses
    require_once('ClassFileName.php');
    require_once ($class);

    // bom = sem parênteses
    require_once 'ClassFileName.php';
    require_once $class;

Ao incluir arquivos com classes ou bibliotecas, use apenas e sempre a
função `require\_once <https://php.net/require_once>`_.

Tags PHP
========

Sempre use tags longas (``<?php ?>``) em vez de tags curtas (``<? ?>``). O echo
curto deve ser usado em arquivos de template quando apropriado.

Echo Curto
----------

O echo curto deve ser usado em arquivos de template no lugar de ``<?php echo``. Ele
deve ser imediatamente seguido por um único espaço, a variável ou valor da função
para ``echo``, um único espaço e a tag de fechamento php::

    // errado = ponto e vírgula, sem espaços
    <td><?=$name;?></td>

    // bom = espaços, sem ponto e vírgula
    <td><?= $name ?></td>

A partir do PHP 5.4, a tag de echo curto (``<?=``) não é mais considerada uma 'tag
curta' e está sempre disponível, independentemente da diretiva ini ``short_open_tag``.

Convenção de Nomenclatura
==========================

Funções
-------

Escreva todas as funções em camelBack::

    function longFunctionName()
    {
    }

Classes
-------

Os nomes de classes devem ser escritos em CamelCase, por exemplo::

    class ExampleClass
    {
    }

Variáveis
---------

Os nomes de variáveis devem ser o mais descritivos possível, mas também o mais curtos
possível. Todas as variáveis devem começar com uma letra minúscula e devem ser
escritas em camelBack no caso de múltiplas palavras. Variáveis que referenciam objetos
devem de alguma forma se associar à classe da qual a variável é um objeto.
Exemplo::

    $user = 'John';
    $users = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

Visibilidade de Membros
------------------------

Use as palavras-chave ``public``, ``protected`` e ``private`` do PHP para métodos e variáveis.

Endereços de Exemplo
---------------------

Para todos os endereços de URL e e-mail de exemplo, use "example.com", "example.org" e
"example.net", por exemplo:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

O nome de domínio "example.com" foi reservado para isso (veja :rfc:`2606`) e
é recomendado para uso em documentação ou como exemplos.

Arquivos
--------

Nomes de arquivos que não contêm classes devem estar em letras minúsculas e sublinhados,
por exemplo::

    long_file_name.php

Conversão de Tipo
-----------------

Para conversão de tipo usamos:

Type
    Description
(bool)
    Converter para boolean.
(int)
    Converter para integer.
(float)
    Converter para float.
(string)
    Converter para string.
(array)
    Converter para array.
(object)
    Converter para object.

Por favor, use ``(int)$var`` em vez de ``intval($var)`` e ``(float)$var`` em vez
de ``floatval($var)`` quando aplicável.

Constantes
----------

Constantes devem ser definidas em letras maiúsculas::

    define('CONSTANT', 1);

Se um nome de constante consiste em várias palavras, elas devem ser separadas por um
caractere de sublinhado, por exemplo::

    define('LONG_NAMED_CONSTANT', 2);

Enums
-----

Casos de Enum são definidos no estilo ``CamelCase``::

    enum ArticleStatus: string
    {
        case Published = 'Y';
        case NotPublishedYet = 'N';
    }

Cuidado ao usar empty()/isset()
================================

Embora ``empty()`` frequentemente pareça correto de usar, pode mascarar erros
e causar efeitos não intencionais quando ``'0'`` e ``0`` são fornecidos. Quando variáveis ou
propriedades já estão definidas, o uso de ``empty()`` não é recomendado.
Ao trabalhar com variáveis, é melhor confiar na coerção de tipo para boolean
em vez de ``empty()``::

    function manipulate($var)
    {
        // Não recomendado, $var já está definida no escopo
        if (empty($var)) {
            // ...
        }

        // Use coerção de tipo boolean
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

Ao lidar com propriedades definidas, você deve favorecer verificações de ``null`` em vez de
verificações ``empty()``/``isset()``::

    class Thing
    {
        private $property; // Defined

        public function readProperty()
        {
            // Não recomendado pois a propriedade está definida na classe
            if (!isset($this->property)) {
                // ...
            }
            // Recomendado
            if ($this->property === null) {

            }
        }
    }

Ao trabalhar com arrays, é melhor mesclar em padrões do que usar
verificações ``empty()``. Ao mesclar em padrões, você pode garantir que as chaves necessárias
estejam definidas::

    function doWork(array $array)
    {
        // Mesclar padrões para remover a necessidade de verificações empty.
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
    :title lang=pt: Padrões de Codificação
    :keywords lang=pt: chaves,nível de indentação,erros lógicos,estruturas de controle,estrutura de controle,expr,padrões de codificação,parêntese,foreach,legibilidade,moose,novos recursos,repositório,desenvolvedores
