Documentação
############

Contribuir na documentação é simples. Os arquivos estão
no https://github.com/cakephp/docs. Sinta-se livre para fazer
um fork e adicionar suas alterações/melhorias/traduções e enviar
através de um pull request.
Você também pode editar os arquivos online através do GitHub,
sem precisar fazer o download dos arquivos.

Traduções
=========

Envie um email para o equipe da documentação (docs [at] cakephp dot org)
ou entre no IRC(#cakephp on freenode) para discutir algum processo de
tradução que você queira participar.

Algumas dicas:

- Navegue e edite no idioma que você deseja traduzir o conteúdo - caso
  contrário você não saberá o que já foi traduzido.
- Sinta-se livre para traduzir se o idioma escolhido já existir no book.
- Utilize a
  `linguagem informal <http://pt.wikipedia.org/wiki/Linguagem_coloquial>`_.
- Traduza o conteúdo e o título ao mesmo tempo.
- Faça uma comparação com o Inglês antes de enviar uma correção.
  (Se você corrigir alguma coisa, mas não sincroniza com o 'upstream' a
  alteração não será aceita.)
- Se você precisa escrever termos em Inglês, utilize a tag ``<em>``.
  Ex.: "asdf asdf *Controller* asdf" ou "asdf asdf Kontroller
  (*Controller*) asfd".
- Não envie traduções parciais.
- Não edite um seção com alterações pendentes.
- Não utilize
  `html entities <http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  para caracteres acentuados, o livro usa UTF-8.
- Não faça alterações significativas em marcações HTML e não adicione novos
  conteúdos.
- Se está faltando informações no conteúdo original, altere o original e envie
  ele primeiro.

Formatando a Documentação
=========================

A nova documentação do CakePHP é escrita no formato ReST.
ReST é uma linguagem de marcação em texto plano parecida com markdown e textile.
Para manter a consistência é recomendável que use os  *guidelines* a seguir de
como formatar estruturar seu texto.

Largura da linha
----------------

As linhas devem ter no máximo 80 colunas.
A unica exeção são urls longas e trechos de códigos.

Títulos e Seções
----------------

Títulos e seções são criados adicionado os caracteres de pontuação na linha
abaixo do título do mesmo tamanho do texto.

- ``#`` Usado para indicar título da página.
- ``=`` Usado para indicar seções na página.
- ``-`` Usado para subseções.
- ``~`` Usado para sub-subseções
- ``^`` Usado para sub-sub-subseções.

Títulos não devem ser adicionados mais do que 5 níveis de profundidade.
Títulos devem ser precedido e seguido por uma linha em branco.

Parágrafo
---------

Parágrafos são blocos de texto simples, com todas as linhas no mesmo nível de indentação.
Parágrafos devem ser separados por uma ou mais linhas em branco.

Marcações
---------

* Um asterisco: *text* para ênfase (itálico),
* Dois asteriscos: **text** para dar ênfase forte (negrito), e
* crases: ``text`` para exemplos de código.

Se asteriscos ou crases devem aparecer no texto elas devem ser precidadas por uma barra
invertida (\\) para serem escapadas.

Restrições para a marcação:

* As marcações **Não podem** ser aninhadas.
* O conteúdo não pode iniciar ou terminar com espaço em branco: ``* text*`` está incorreto.
* O conteúdo deve ser separado do restante do texto por *non-word characters*. Use
  uma barra invertida escapando um espaço para corrigir isso: ``onelong\ *bolded*\ word``.

Listas
------

A marcação de listas é muito paracido com markdown. Listas não ordenadas
começam a linha com um asterisco seguido de um espaço. Listas númericas
podem ser criadas com os números na frente ou ``#`` para númerar automaticamente::

    * Isso é uma linha
    * Essa também.
      Mas tem duas linhas


    1. Primeira linha
    2. Segunda linha

    #. Númeração automatica
    #. Vai salvar seu tempo.

Listas indentadas também podem ser criadas, indentando as seções e separando
elas por uma linha em branco::

    * Primeira linha
    * Segunda linha

        * Indo mais um nível
        * Wow!

    * De volta para o primeiro nível.

Listas de definição pode ser criadas da seguinte forma::

    termo
        definição
    CakePHP
        Framework MVC para PHP

Os termos não podem ter mais do que uma linha, mas as definições podem ter
muitas linhas e todos as linhas devem ter um indentação consistente.

Links
-----

Existe vários tipos de links, cada um com seu objetivo de uso.

Links Externos
~~~~~~~~~~~~~~

Links para documentos externos são feito da seguinte forma::

    `Link Externo <http://example.com>`_

O exemplo acima vai gerar um link para http://example.com

Links para outras páginas
~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    Outras páginas na documentação podem ser linkadas usando ``:doc:``.
    Você pode criar um link para um documento especifico utilizando o caminho
    absoluto ou relativo sem a extensão ``.rst``. Por exemplo, se a referência
    ``:doc: `form``` aparece no documento ``core-helpers/html``, então o link
    será criado para ``core-helpers/form``. Se a referência for
    ``:doc:`/core-helpers```, será sempre referênciado para ``/core-helpers``
    independente de onde for usado.

Links de referência cruzada
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    Você pode fazer referências cruzadas para qualquer título arbitrário em
    qualquer documento usando ``:ref:``. Links para um *label* devem ser únicos
    dentro do documento. Quando for criar *labels* para métodos de classe, é
    melhor usar ``class-method`` como *label* do link.

    A forma mais comum de usar *labels* é acima de títulos. Exemplo::

        .. _label-name:

        Título de seção
        ---------------

        Restante do conteúdo

    Em qualquer lugar você pode referenciar a seção acima usando ``:ref:`label-name```.
    O texto do link será título da seção. Você também pode informar um texto personalizado
    usando ``:ref: `Link text <label-name>```.

Prevent Sphinx to Output Warnings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx will output warnings if a file is not referenced in a toc-tree. It's
a great way to ensure that all files have a link directed to them, but
sometimes, you don't need to insert a link for a file, eg. for our
`epub-contents` and `pdf-contents` files. In those cases, you can add
``:orphan:`` at the top of the file, to suppress warnings that the file is not
in the toc-tree.

Descrevendo classes e seus conteúdos
------------------------------------

A documentação do CakePHP utiliza o `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ que fornece
algumas diretivas para descrever objetos e construtores.
Usar essas diretivas é essêncial para criar índices e referências em toda a
documentação.

Descrevendo Classes e Construtores
----------------------------------

Cada diretiva alimenta o índice e/ou o *namespace* do índice.

.. rst:directive:: .. php:global:: name

   Essa diretiva declara uma variável global.

.. rst:directive:: .. php:function:: name(signature)

   Define um função global fora da classe.

.. rst:directive:: .. php:const:: name

   Essa diretiva declara uma constante, você também pode usar
   dentro de uma classe para declarar uma constante da classe.

.. rst:directive:: .. php:exception:: name

   Essa diretiva declara um nova *Exception* no *namespace* atual.
   A declaração pode conter os argumentos do construtor.

.. rst:directive:: .. php:class:: name

   Descreve uma classe. Métodos, atributos e constantes que pertence a classe
   devem ser declaradas dentro dessa diretiva::

        .. php:class:: MyClass

            Class description

           .. php:method:: method($argument)

           Method description

   Atributos, métodos e constante não precisam estar um nível abaixo.
   Podem ser declaradas no mesmo nível da classe::

        .. php:class:: MyClass

            Text about the class

        .. php:method:: methodName()

            Text about the method


   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   Descreve um método da classe, seus argumentos, valor retornado e *exceptions*::

        .. php:method:: instanceMethod($one, $two)

            :param string $one: Primeiro parâmetro.
            :param string $two: Segundo parâmetro.
            :returns: Um array com várias coisas.
            :throws: InvalidArgumentException

           Isso é um método de instância.

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    Descreve um método estático, seus argumentos, valor retornado e *exceptions*
    veja :rst:dir:`php:method` para mais detalhes.

.. rst:directive:: .. php:attr:: name

   Descreve um propriedade/atributo de uma classe.

Prevent Sphinx to Output Warnings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx will output warnings if a function is referenced in multiple files. It's
a great way to ensure that you did not add a function two times, but
sometimes, you actually want to write a function in two or more files, eg.
`debug object` is referenced in `/development/debugging` and in
`/core-libraries/global-constants-and-functions`. In this case, you can add
``:noindex:`` under the function debug to suppress warnings. Keep only
one reference **without** ``:no-index:`` to still have the function referenced::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

Referências Cruzadas
~~~~~~~~~~~~~~~~~~~~

As funções a seguir server para referenciar objetos e links do PHP
se alguma diretiva for encontrada:

.. rst:role:: php:func

   Cria uma referência para uma função PHP.

.. rst:role:: php:global

   Cria uma referência para uma variável global que comece com ``$``.

.. rst:role:: php:const

   Cria uma referência para um constante ou uma contante de uma classe. As constantes da classe
   devem ser precedidas com o nome da classe::

        DateTime tem uma constante :php:const:`DateTime::ATOM`.

.. rst:role:: php:class

   Cria uma referência para uma classe através do nome::

     :php:class:`ClassName`

.. rst:role:: php:meth

   Cria uma referência para um método da classe. Essa função suporta os dois métodos::

     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   Cria uma referência para a propriedade de um objeto::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   Cria uma referência para uma *exception*


Código Fonte
------------

Blocos de códigos literais são criados terminando um paragrafo com ``::``.
O bloco deve ser indentado e como todos os parágrafos ser separados por uma linha::

    Isso é um parágrafo::

        while ($i--) {
            doStuff()
        }

    Isso é um resto normal denovo.

Textos literais não são modificados ou formatados, salvo quando o level de indentação é removido.


Notas e Avisos
--------------

As vezes você quer infomar ao leitor do manual um dica importante, um lembrete
ou um aviso importante. *Admonitions* no sphinx são usados para isso.
Existe três tipos de *admonitions*.

* ``.. tip::`` Tips são usandos no documento para salientar algo importante.
  O conteúdo deve ter as sentenças corretas e pontuação apropriada.
* ``.. note::`` Notes são usadas para especificar uma parte importante da informação.
  O conteúdo deve ter as sentenças corretas e pontuação apropriada.
* ``.. warning::`` Warnings são usados para informar potenciais obstáculos
  ou informações sobre segurança. O conteúdo deve ter as sentenças corretas
  e pontuação apropriada.

Todos os *admonitions* são declarados da mesma forma::

    .. note::

        Indentado e precedido por uma linha branca. Como uma parágrafo.

    Esse texto não pertence a nota.

Exemplos
~~~~~~~~

.. tip::

    This is a helpful tid-bit you probably forgot.

.. note::

    You should pay attention here.

.. warning::

    It could be dangerous.
