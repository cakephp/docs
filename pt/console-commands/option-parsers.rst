Analisadores de Opções
######################

.. php:namespace:: Cake\Console
.. php:class:: ConsoleOptionParser

As aplicações de console normalmente recebem opções e argumentos como a principal forma de
obter informações do terminal para seus comandos.

Definindo um OptionParser
=========================

Os Comandos e Shells fornecem um método hook ``buildOptionParser($parser)`` que
você pode usar para definir as opções e argumentos para seus comandos::

    protected function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        // Define your options and arguments.

        // Return the completed parser
        return $parser;
    }

As classes Shell usam o método hook ``getOptionParser()`` para definir seu
analisador de opções::

    public function getOptionParser()
    {
        // Get an empty parser from the framework.
        $parser = parent::getOptionParser();

        // Define your options and arguments.

        // Return the completed parser
        return $parser;
    }


Usando Argumentos
=================

.. php:method:: addArgument($name, $params = [])

Os argumentos posicionais são frequentemente usados em ferramentas de linha de comando,
e o ``ConsoleOptionParser`` permite que você defina argumentos
posicionais e também os torne obrigatórios. Você pode adicionar argumentos
um de cada vez com ``$parser->addArgument();`` ou múltiplos de uma vez
com ``$parser->addArguments();``::

    $parser->addArgument('model', ['help' => 'The model to bake']);

Você pode usar as seguintes opções ao criar um argumento:

* ``help`` O texto de ajuda a ser exibido para este argumento.
* ``required`` Se este parâmetro é obrigatório.
* ``index`` O índice para o argumento, se deixado indefinido o argumento será colocado
  no final dos argumentos. Se você definir o mesmo índice duas vezes, a
  primeira opção será sobrescrita.
* ``choices`` Um array de escolhas válidas para este argumento. Se deixado vazio, todos
  os valores são válidos. Uma exceção será lançada quando parse() encontrar um
  valor inválido.
* ``separator`` Uma sequência de caracteres que separa argumentos que devem ser
  analisados em um array.

Argumentos que foram marcados como obrigatórios lançarão uma exceção ao
analisar o comando se tiverem sido omitidos. Portanto, você não precisa
lidar com isso em seu shell.

.. versionadded:: 5.2.0
    A opção ``separator`` foi adicionada.

Adicionando Múltiplos Argumentos
---------------------------------

.. php:method:: addArguments(array $args)

Se você tiver um array com múltiplos argumentos, pode usar
``$parser->addArguments()`` para adicionar múltiplos argumentos de uma vez. ::

    $parser->addArguments([
        'node' => ['help' => 'The node to create', 'required' => true],
        'parent' => ['help' => 'The parent node', 'required' => true],
    ]);

Como todos os métodos de construção do ConsoleOptionParser, addArguments
pode ser usado como parte de uma cadeia de métodos fluente.

Validando Argumentos
--------------------

Ao criar argumentos posicionais, você pode usar a flag ``required`` para
indicar que um argumento deve estar presente quando um shell é chamado.
Adicionalmente, você pode usar ``choices`` para forçar um argumento a ser de uma lista de
escolhas válidas::

    $parser->addArgument('type', [
        'help' => 'The type of node to interact with.',
        'required' => true,
        'choices' => ['aro', 'aco'],
    ]);

O exemplo acima criará um argumento que é obrigatório e tem validação na
entrada. Se o argumento estiver ausente ou tiver um valor incorreto, uma exceção
será lançada e o shell será interrompido.

Usando Opções
=============

.. php:method:: addOption($name, array $options = [])

As opções ou flags são usadas em ferramentas de linha de comando para fornecer argumentos chave/valor
não ordenados para seus comandos. As opções podem definir aliases detalhados e curtos.
Elas podem aceitar um valor (por exemplo, ``--connection=default``) ou serem opções booleanas
(por exemplo, ``--verbose``). As opções são definidas com o método ``addOption()``::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

O exemplo acima permitiria que você usasse ``cake myshell --connection=other``,
``cake myshell --connection other``, ou ``cake myshell -c other``
ao invocar o shell.

As chaves booleanas não aceitam ou consomem valores, e sua presença apenas
as habilita nos parâmetros analisados::

    $parser->addOption('no-commit', ['boolean' => true]);

Esta opção, quando usada como ``cake mycommand --no-commit something``, teria
um valor de ``true``, e 'something' seria tratado como um argumento
posicional.

Ao criar opções, você pode usar as seguintes opções para definir o comportamento
da opção:

* ``short`` - A variante de letra única para esta opção, deixe indefinido para
  nenhuma.
* ``help`` - Texto de ajuda para esta opção. Usado ao gerar ajuda para a
  opção.
* ``default`` - O valor padrão para esta opção. Se não definido, o padrão
  será ``true``.
* ``boolean`` - A opção não usa valor, é apenas uma chave booleana.
  Padrão é ``false``.
* ``multiple`` - A opção pode ser fornecida múltiplas vezes. A opção analisada
  será um array de valores quando esta opção estiver habilitada.
* ``separator`` - Uma sequência de caracteres pela qual o valor da opção é dividido em um
  array.
* ``choices`` - Um array de escolhas válidas para esta opção. Se deixado vazio, todos
  os valores são válidos. Uma exceção será lançada quando parse() encontrar um
  valor inválido.


.. versionadded:: 5.2.0
    A opção ``separator`` foi adicionada.

Adicionando Múltiplas Opções
-----------------------------

.. php:method:: addOptions(array $options)

Se você tiver um array com múltiplas opções, pode usar ``$parser->addOptions()``
para adicionar múltiplas opções de uma vez. ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node'],
    ]);

Como todos os métodos de construção do ConsoleOptionParser, addOptions pode ser usado
como parte de uma cadeia de métodos fluente.

Validando Opções
----------------

As opções podem ser fornecidas com um conjunto de escolhas, assim como os argumentos posicionais
podem ser. Quando uma opção tem escolhas definidas, essas são as únicas escolhas válidas
para uma opção. Todos os outros valores lançarão uma ``InvalidArgumentException``::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine'],
    ]);

Usando Opções Booleanas
-----------------------

As opções podem ser definidas como opções booleanas, que são úteis quando você precisa
criar algumas opções de flag. Como opções com padrões, as opções booleanas sempre
se incluem nos parâmetros analisados. Quando as flags estão presentes, elas
são definidas como ``true``, quando estão ausentes são definidas como ``false``::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

A opção seguinte sempre terá um valor no parâmetro analisado. Quando não
incluída, seu valor padrão seria ``false``, e quando definida será
``true``.

Construindo um ConsoleOptionParser a partir de um Array
--------------------------------------------------------

.. php:method:: buildFromArray($spec)

Os analisadores de opções também podem ser definidos como arrays. Dentro do array, você pode definir
chaves para ``arguments``, ``options``, ``description`` e ``epilog``.  Os valores
para argumentos e opções devem seguir o formato que
:php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` e
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` usam. Você também pode
usar ``buildFromArray`` por conta própria para construir um analisador de opções::

    public function getOptionParser()
    {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')],
            ],
        ]);
    }

Mesclando Analisadores de Opções
---------------------------------

.. php:method:: merge($spec)

Ao construir um comando de grupo, você pode querer combinar vários analisadores para
isso::

    $parser->merge($anotherParser);

Note que a ordem dos argumentos para cada analisador deve ser a mesma, e que
as opções também devem ser compatíveis para funcionar. Portanto, não use chaves para coisas
diferentes.

Obtendo Ajuda dos Shells
=========================

Ao definir suas opções e argumentos com o analisador de opções, o CakePHP pode
gerar automaticamente informações de ajuda rudimentares e adicionar ``--help`` e
``-h`` a cada um dos seus comandos. Usar uma dessas opções permitirá que você
veja o conteúdo de ajuda gerado:

.. code-block:: console

    bin/cake bake --help
    bin/cake bake -h

Ambos gerariam a ajuda para bake. Você também pode obter ajuda para comandos
aninhados:

.. code-block:: console

    bin/cake bake model --help
    bin/cake bake model -h

O exemplo acima obteria a ajuda específica para o comando model do bake.

Obtendo Ajuda como XML
----------------------

Ao construir ferramentas automatizadas ou ferramentas de desenvolvimento que precisam interagir com
comandos shell do CakePHP, é bom ter ajuda disponível em um formato analisável por máquina.
Ao fornecer a opção ``xml`` ao solicitar ajuda, você pode ter o conteúdo de ajuda
retornado como XML:

.. code-block:: console

    cake bake --help xml
    cake bake -h xml

O exemplo acima retornaria um documento XML com a ajuda gerada, opções e
argumentos para o shell selecionado. Um documento XML de exemplo
seria parecido com:

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

Personalizando a Saída de Ajuda
================================

Você pode enriquecer ainda mais o conteúdo de ajuda gerado adicionando uma descrição e
epílogo.

Definir a Descrição
-------------------

.. php:method:: setDescription($text)

A descrição é exibida acima das informações de argumento e opção. Ao passar
um array ou uma string, você pode definir o valor da descrição::

    // Set multiple lines at once
    $parser->setDescription(['line one', 'line two']);

    // Read the current value
    $parser->getDescription();

Definir o Epílogo
-----------------

.. php:method:: setEpilog($text)

Obtém ou define o epílogo para o analisador de opções. O epílogo é exibido após as
informações de argumento e opção. Ao passar um array ou uma string, você
pode definir o valor do epílogo::

    // Set multiple lines at once
    $parser->setEpilog(['line one', 'line two']);

    // Read the current value
    $parser->getEpilog();
