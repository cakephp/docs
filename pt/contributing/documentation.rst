Documentação
############

Contribuir com a documentação é simples. Os arquivos estão hospedados em
https://github.com/cakephp/docs. Sinta-se a vontade para copiar o repositório,
adicionar suas alterações/melhorias/traduções e emitir um pull request.
Você também pode editar a documentação online com o Github, mesmo sem ter que
fazer download dos arquivos -- O botão "IMPROVE THIS DOC" presente em qualquer
página vai direcioná-lo para o editor online do Github.

A documentação do CakePHP é
`continuamente integrada <http://en.wikipedia.org/wiki/Continuous_integration>`_,
sendo assim, você pode checar o status de
`várias builds <http://ci.cakephp.org>`_ no servidor Jenkins a qualquer momento.

Traduções
=========

Envie um email para o time de documentação (docs at cakephp dot org) ou apareça
no IRC (#cakephp na freenode) para discutir sobre qualquer área de tradução que
você queira participar.

Nova tradução linguística
-------------------------

Nós queremos oferecer traduções completas tanto quanto possível, porém, podem
haver momentos que um arquivo de tradução não está atualizado. Você deve sempre
considerar a versão em inglês como a prevalecente.

Se o seu idioma não está dentre os listados, por favor nos contate pelo Github e
nós vamos considerar criar um diretório para tal. As seções a seguir são as
primeiras que você deve considerar traduzir, pois seus arquivos não mudam
frequentemente:

- index.rst
- intro.rst
- quickstart.rst
- installation.rst
- /intro folder
- /tutorials-and-examples folder

Lembrete para administradores de documentação
---------------------------------------------

A estrutura de todos os diretórios de idioma devem espelhar a estrutura da
matriz inglesa. Se a estrutura da documentação inglesa sofrer mudanças, as
mesmas devem ser aplicadas em outros idiomas.

Por exemplo, se um novo arquivo é criado em **en/file.rst**, nós devemos:

- Adicionar o arquivo a outros idiomas: **pt/file.rst**, **fr/file.rst**, etc
- Deletar o conteúdo, mas manter as informações ``title``, ``meta` e eventuais
  elementos ``toc-tree``. A nota a seguir será adicionada até que alguém traduza
  o arquivo::

    File Title
    ##########

    .. note::
        Atualmente, a documentação desta página não é suportada em português.

        Por favor, sinta-se a vontade para nos enviar um *pull request* no
        `Github <https://github.com/cakephp/docs>`_ ou use o botão
        **IMPROVE THIS DOC** para propor suas mudanças diretamente.

        Você pode consultar a versão em inglês desta página através do seletor de
        idioma localizado ao lado direito do campo de buscas da documentação.

    // Se os elementos toc-tree existirem na versão inglesa
    .. toctree::
        :maxdepth: 1

        toc-file-x
        toc-file-y
        toc-file-z

    .. meta::
        :title lang=pt: Título do arquivo
        :keywords lang=pt: título, descrição,...


Dicas para tradutores
---------------------

- Navegue no idioma para o qual deseja traduzir para certificar-se do que já foi
  ou não traduzido.
- Sinta-se a vontade para mergulhar na tradução caso o seu idioma já exista no
  manual.
- Use `Linguagem Informal <https://pt.wikipedia.org/wiki/Linguagem_coloquial>`_.
- Traduza o conteúdo e o título ao mesmo tempo.
- Antes de submeter uma correção, compare à versão inglesa.
  (se você corrigir algo, mas não indicar uma referência, sua submissão não será
  aceita).
- Se você precisar escrever um termo em inglês, envolva-o na *tag* ``<em>``.
  E.g. "asdf asdf *Controller* asdf" ou "asdf asdf Kontroller
  (*Controller*) asfd", como for apropriado.
- Não submeta traduções incompletas.
- Não edite uma seção com alterações pendentes.
- Não use
  `Entidades HTML <http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  para caracteres acentuados, o manual usa UTF-8.
- Não faça alterações significativas na marcação (HTML) ou adicione novo
  conteúdo.
- Se no conteúdo original estiver faltando alguma informação, submeta uma
  correção paral tal antes.

Guia de formatação para documentação
====================================

A nova documentação do CakePHP é escrita com
`ReST <http://en.wikipedia.org/wiki/ReStructuredText>`_. ReST
(*Re Structured Text*) é uma sintaxe de marcação de texto simples, semelhante a
*markdown* ou *textfile*. Para manter a consistência, recomenda-se que ao
adicionar conteúdo à documentação do CakePHP, você siga as diretrizes aqui
exemplificadas de como estruturar seu texto.

Comprimento da linha
--------------------

Linhas de texto devem ser limitadas em 80 colunas. As únicas exceções devem ser
URLs longas e trechos de código.

Títulos e Seções
----------------

Cabeçalhos de seção são criados ao sublinhar o título com caracteres de
pontuação seguindo o comprimento do texto.

- ``#`` é usado para títulos de páginas.
- ``=`` é usado para seções de página.
- ``-`` é usado para sub-seções de página.
- ``~`` é usado para sub-sub-seções de página.
- ``^`` é usado para sub-sub-sub-seções de página.

Os títulos não devem ser aninhados por mais de 5 níveis de profundidade. Os
títulos devem ser precedidos e seguidos por uma linha em branco.

Parágrafos
----------

Os parágrafos são simplesmente blocos de texto, com todas as linhas no mesmo
nível de recuo. Os parágrafos devem ser separados por mais do que uma linha
vazia.

Marcação em linha
-----------------

* Um asterisco: *texto* para dar ênfase (itálico)
  Vamos usá-lo para realce/ênfase.

  * ``*texto*``.

* Dois asteríscos: **texto** para ênfase forte (negrito)
  Vamos usá-lo para diretórios, títulos de listas, nomes de tabelas
  e excluindo a seguinte palavra "*table*".

  * ``**/config/Migrations**``, ``**articles**``, etc.

* Dois *backquotes*: ``texto`` para exemplos de código
  Vamos usá-lo para opções, nomes de colunas de tabelas, nomes de
  objetos (excluindo a palavra "*object*") e nomes de métodos/funções
  -- incluir "()".

  * ````cascadeCallbacks````, ````true````, ````id````,
    ````PagesController````, ````config()````, etc.

Se asteríscos ou *backquotes* aparecerem em texto corrido e ficarem confusos
com delimitadores de maração em linha, eles devem ser escapados com um
*backslash*.

Marcação em linha tem algumas restrições:

* **Não deve** estar aninhado.
* O conteúdo não deve começar ou terminar com espaço: ``* texto*`` está errado.
* O conteúdo deve estar separado de texto adjacente por caracteres *non-word*.
  Use um espaço escapado com uma contrabarra ao seu redor:
  ``umalonga\ *negrito*\ palavra``.

Listas
------

A marcação de listas é muito parecida com o *markdown*. Listas desordenadas
começam com um asterísco e um espaço. Listas enumeradas podem ser criadas tanto
com números, ou ``#`` para auto numeração::

    * Esse é um item
    * Esse também, mas esse tem
      duas linhas.

    1. Primeira linha
    2. Segunda linha

    #. Numeração automática
    #. Vai lhe economizar algum tempo...

Listas com recuos também podem ser criadas ao recuar seções e separá-las com uma
linha em branco::

    * Primeira linha
    * Segunda linha

        * Mais fundo
        * WOW!

    * De volta ao primeiro nível...

Listas de definição podem ser criadas assim::

    Termo
        Definição
    CakePHP
        Um framework MVC para PHP

Termos não podem ultrapassar uma linha, porém definições podem e devem estar
recuadas consistentemente.

Links
-----

Existem diveros tipos de links, cada um com usos particulares.

Links externos
~~~~~~~~~~~~~~

Links para documentos externos podem ser feitos com o seguinte::

    `Link externo para php.net <http://php.net>`_

O link resultante ficaria assim: `Link externo para php.net <http://php.net>`_

Links para outras páginas
~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    Outras páginas na documentação podem ser referenciadas ao usar a função
    ``:doc:``. Você pode referenciar páginas usando caminho absoluto ou
    relativo. Você deve omitir a extensão ``.rst``. Por exemplo, se a referência
    ``:doc:`form``` estivesse no documento ``core-helpers/html``, então o link
    referenciaria ``core-helpers/form``. Caso a referência fosse
    ``:doc:`/core-helpers```, iria sempre referenciar ``/core-helpers``
    independente de onde a função fosse usada.

Links de referências cruzados
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    Você pode referenciar a qualquer título de um documento usando a função
    ``:ref:``. O texto não pode ser repetido por toda a documentação. Ao criar
    títulos para metodos de classes, é melhor usar ``class-method`` como
    formato.

    O uso mais comum é a cima de um título. Exemplo::

        .. _label-name:

        Título da seção
        ---------------

        Mais conteúdo aqui

    Em qualquer lugar você pode referenciar a seção a cima usando
    ``:ref:`label-name```. O texto do link deverá ser o título que o
    *link* precedeu. Você pode indicar qualquer formato usando
    ``:ref:`Seu texto <label-name>```.

Prevenindo alertas do Sphinx
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O Sphinx vai disparar alertas se um arquivo não for referenciado em um
*toc-tree*. É uma grande forma de garantir que todos os arquivos possuem um
*link* referenciado a eles, mas as vezes, você não precisa inserir um *link*
para um arquivo, e.g. para seus arquivos `epub-contents` and `pdf-contents`.
Nesses casos, você pode adicionar ``:orphan:`` no topo do arquivo, para suprimir
alertas de que o arquivo não está no *toc-tree*.

Descrevendo classes e seus conteúdos
------------------------------------

A documentação do CakePHP usa o
`phpdomain <http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ para fornecer
directivas customizadas a fim de descrever objetos e construtores no PHP. Usar
essas directivas e funções é um requisito para gerar a indexação adequada e
recursos de referência cruzada.

Descrevendo classes e construtores
----------------------------------

Cada diretiva popula o índice, e/ou o índice do *namespace*.

.. rst:directive:: .. php:global:: name

   Esta directiva declara uma nova variável global PHP.

.. rst:directive:: .. php:function:: name(signature)

   Esta directiva define uma nova função global fora de uma classe.

.. rst:directive:: .. php:const:: name

   Esta directiva declara uma nova constante PHP, você também pode usá-lo
   aninhada dentro de uma directiva de classe para criar constantes de classe.

.. rst:directive:: .. php:exception:: name

   Esta directiva declara uma nova exceção no *namespace* atual. A
   assinatura pode incluir argumentos do construtor.

.. rst:directive:: .. php:class:: name

   Esta directiva descreve uma classe. Métodos, atributos, e as constantes
   pertencentes à classe devem estar dentro do corpo desta directiva::

        .. php:class:: MyClass

            Class description

           .. php:method:: method($argument)

           Descrição do método

    Atributos, métodos e constantes não precisam estar aninhados. Eles podem
    apenas seguir a declaração da classe::

        .. php:class:: MyClass

            Texto sobre a classe

        .. php:method:: methodName()

            Texto sobre o método


   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   Descreve um método de classe, seus argumentos, valor de retorno e exceções::

        .. php:method:: instanceMethod($one, $two)

            :param string $one: O primeiro parâmetro.
            :param string $two: O segundo parâmetro.
            :returns: Um vetor de coisas.
            :throws: InvalidArgumentException

           Este é um método de instância

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    Descreve um método estático, seus argumentos, valor de retorno e exceções.
    Ver :rst:dir:`php:method` para opções.

.. rst:directive:: .. php:attr:: name

   Descreve uma propriedade/atributo numa classe.

Prevenindo alertas do Sphinx
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

O Sphinx vai disparar alertas se uma função estiver referenciada em múltiplos
arquivos. É um meio de garantir que você não adicionou uma função duas vezes,
porém, algumas vezes você quer escrever a função em dois ou mais arquivos, e.g.
`debug object` está referenciado em `/development/debugging` e em
`/core-libraries/global-constants-and-functions`. Nesse caso, você pode
adicionar ``:noindex:`` abaixo do *debug* da função para suprimir alertas.
Mantenha apenas uma referência **sem** ``:no-index:`` para manter a função
referenciada::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

Referenciamento cruzado
~~~~~~~~~~~~~~~~~~~~~~~

As funções a seguir se referem a objetos PHP e os *links* são gerados se uma
directiva correspondente for encontrada:

.. rst:role:: php:func

   Referencia uma função PHP.

.. rst:role:: php:global

   Referencia uma variável global cujo nome possui o prefixo ``$``.

.. rst:role:: php:const

   Referencia tanto uma constante global como uma constante de classe.
   Constantes de classe devem ser precedidas pela classe mãe::

        DateTime possui uma constante :php:const:`DateTime::ATOM`.

.. rst:role:: php:class

   Referencia uma classe por nome::

     :php:class:`ClassName`

.. rst:role:: php:meth

   Referencia um método de uma classe. Essa função suporta ambos os métodos::

     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   Referencia a propriedade de um objeto::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   Referencia uma exceção.


Código-fonte
------------

Blocos de código literais são criados ao finalizar um parágrafo com ``::``. O
bloco de código literal deve estar recuado, e como todos os parágrafos, estar
separado por linhas vazias::

    Isto é um parágrafo::

        while ($i--) {
            doStuff()
        }

    Isto é texto novamente.

Texto literal não é modificado ou formatado, com exceção do primeiro nível de
recuo que é removido.

Notas e alertas
---------------

Muitas vezes há momentos em que você deseja informar o leitor sobre uma dica
importante, nota especial ou um perigo potencial. Admoestações no Sphinx são
utilizados apenas para isto. Existem cinco tipos de advertências.

* ``.. tip::`` Dicas são usadas para documentar ou re-iterar informações
  importantes ou interessantes. O conteúdo da directiva deve ser escrito em
  sentenças completas e incluir a pontuação adequada.
* ``.. note::`` Notas são usadas para documentar uma peça importante de
  informação. O conteúdo da directiva deve ser escrita em sentenças completas e
  incluir a pontuação adequada.
* ``.. warning::`` Alertas são usados para documentar obstáculos em potencial,
  ou informação referente a segurança. O conteúdo da directiva deve ser escrito
  em sentenças completas e incluir a pontuação adequada.
* ``.. versionadded:: X.Y.Z`` Admoestações de versão são usados como notas de
  recursos adicionados em uma versão específica, ``X.Y.Z`` sendo a versão na
  qual o dito recurso foi adicionado.
* ``.. deprecated:: X.Y.Z`` O oposto das admoestações de versão, admoestações
  de obsolescência são usados para notificar sobre um recurso obsoleto,
  are used to notify of a deprecated feature, ``X.Y.Z`` sendo a versão na
  qual o dito recurso foi abandonado.

Todas as admoestações são feitas da mesma forma::

    .. note::

        Recuadas e precedido e seguido por uma linha em branco. Assim como um
        parágrafo.

    Esse texto não é parte da nota.

Exemplos
~~~~~~~~

.. tip::

    Essa é uma dica que você não sabia.

.. note::

    Você deve prestar atenção aqui.

.. warning::

    Pode ser perigoso.

.. versionadded:: 2.6.3

    Esse recurso incrível foi adicionado na versão 2.6.3

.. deprecated:: 2.6.3

    Esse recurso antigo foi descontinuado na versão 2.6.3


.. meta::
    :title lang=pt: Documentação
    :keywords lang=pt: tradução,parcial,tradutor,funções,código-fonte,dicas,sphinx,formatação
