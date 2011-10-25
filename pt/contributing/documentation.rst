Documentação
#############

Contribuir na documentação é simples. Os arquivos estão 
no http://github.com/cakephp/docs. Sinta-se livre para fazer 
um fork e adicionar suas alterações/melhorias/traduções e enviar 
através de um pull request.
Você também pode editar os arquivos online através do github, 
sem precisar fazer o download dos arquivos.

Traduções
============

Envie um email para o equipe da documentação (docs [at] cakephp dot org)
ou entre no IRC(#cakephp on freenode) para discutir algum processo de 
tradução que você queira participar.

Algumas dicas:

- Navegue e edite no idioma que você deseja traduzir o conteúdo - caso
  contrário você não saberá o que já foi traduzido.
- Sinta-se livre para traduzir se o idioma escolhido já existir no book.
- Utilize a *to do list* (no topo lado direito) para saber a onde você
  pode dar mais atenção.
- Utilize o `idioma formal <http://en.wikipedia.org/wiki/Register_(linguistics)>`_.
- Traduza o conteúdo e o título ao mesmo tempo.
- Faça uma comparação com o Inglês antes de enviar uma correção. 
  (Se você corrigir alguma coisa, mas não sincroniza com o 'upstream' a alteração
  não será aceita.)
- Se você precisa escrever termos em Inglês, utilize a tag ``<em>``.
  Ex.: "asdf asdf *Controller* asdf" ou "asdf asdf Kontroller
  (*Controller*) asfd".
- Não envie traduções parciais.
- Não edite um seção com alterações pendentes.
- Não utilize
  `html entities <http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  para caracteres acentuados, o *book* usa UTF-8.
- Não faça alterações significativas em marcações HTML e não adicione novos conteúdos.
- Se o está faltando informação no conteúdo original, altere o original e envie ele primeiro.

Formatando a Documentação
=========================

A nova documentação do CakePHP é escrita no formato ReST.
ReST é uma linguagem de marcação para leitura de formatos de código fonte parecida
com markdown e textile. Para manter a consistência é recomendável que use os 
 *guidelines* a seguir de como formatar estruturar seu texto.

Altura da linha
---------------

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
----------

Parágrafos são blocos de texto simples, com todas as linhas no mesmo nível de indentação.
Parágrafos devem ser separados por uma ou mais linhas em branco.

Marcações
---------

* Um asterisco: *text* para ênfase (itálico),
* Dois asteriscos: **text** para dar ênfase forte (negrito), e
* crases: ``text`` para exemplos de código.

Se asteriscos ou crases devem aparecer no texto elas devem ser precidadas por uma barra 
invertida (\) para escapar.

.. todo::
  Translate the complete section ``Restrições para marcação``.

Restrições para a marcação:

* **Não pode** ser aninhado.
* O conteúdo não pode iniciar ou terminar com espaço em branco: ``* text*`` está incorreto.
* Content must be separated from surrounding text by non-word characters. Use a backslash 
  escaped space to work around that: ``onelong\ *bolded*\ word``.

Listas
-----

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

Termos não podem ter mais do que uma linha, mas definições podem ter multilinhas
e todos as linhas devem ter um indentação consistente.

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
    Você pode criar um link para um documento especifico utilizando path absoluto 
    ou relativo sem a extensão ``.rst``. Por exemplo, se a referência ``:doc: `form```
    aparece no documento ``core-helpers/html``, então o link será criado 
    para ``core-helpers/form``. Se a referência for ``:doc:`/core-helpers```, será
    sempre referênciado para ``/core-helpers``independente a onde é usado.

Links de referência cruzada
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    Você pode cruzar referência a qualquer título arbitrário em qualquer 
    documento usando ``:ref:``. Links para um *label* devem ser únicos dentro
    do documento. Quando for criar *labels* para métodos de classe, é melhor usar
    ``class-method`` como *label* do link.

    A forma mais comum de usar *labels* é acima de títulos. Exemplo::
    
        .. _label-name:
        
        Título de seção
        ---------------
        
        Restante do conteúdo
    
    Em qualquer lugar você pode referenciar a seção acima usando ``:ref:`label-name```.
    O texto do link será título da seção. Você também pode informar um texto personalizado
    usando ``:ref: `Link text <label-name>```.

Describing classes and their contents
-------------------------------------

The CakePHP documentation uses the `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>` to provide custom
directives for describing PHP objects and constructs.  Using these directives
and roles is required to give proper indexing and cross referencing features.

Describing classes and constructs
---------------------------------

Each directive populates the index, and or the namespace index.

.. rst:directive:: .. php:global:: name

   This directive declares a new PHP global variable.

.. rst:directive:: .. php:function:: name(signature)

   Defines a new global function outside of a class.

.. rst:directive:: .. php:const:: name

   This directive declares a new PHP constant, you can also use it nested 
   inside a class directive to create class constants.
   
.. rst:directive:: .. php:exception:: name

   This directive declares a new Exception in the current namespace. The 
   signature can include constructor arguments.

.. rst:directive:: .. php:class:: name

   Describes a class.  Methods, attributes, and constants belonging to the class
   should be inside this directive's body::

        .. php:class:: MyClass
        
            Class description
        
           .. php:method:: method($argument)
        
           Method description


   Attributes, methods and constants don't need to be nested.  They can also just 
   follow the class declaration::

        .. php:class:: MyClass
        
            Text about the class
        
        .. php:method:: methodName()
        
            Text about the method
        

   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   Describe a class method, its arguments, return value, and exceptions::
   
        .. php:method:: instanceMethod($one, $two)
        
            :param string $one: The first parameter.
            :param string $two: The second parameter.
            :returns: An array of stuff.
            :throws: InvalidArgumentException
        
           This is an instance method.

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    Describe a static method, its arguments, return value and exceptions,
    see :rst:dir:`php:method` for options.

.. rst:directive:: .. php:attr:: name

   Describe an property/attribute on a class.

Cross Referencing
~~~~~~~~~~~~~~~~~

The following roles refer to php objects and links are generated if a 
matching directive is found:

.. rst:role:: php:func

   Reference a PHP function.

.. rst:role:: php:global

   Reference a global variable whose name has ``$`` prefix.
   
.. rst:role:: php:const

   Reference either a global constant, or a class constant.  Class constants should
   be preceded by the owning class::
   
        DateTime has an :php:const:`DateTime::ATOM` constant.

.. rst:role:: php:class

   Reference a class by name::
   
     :php:class:`ClassName`

.. rst:role:: php:meth

   Reference a method of a class. This role supports both kinds of methods::
   
     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   Reference a property on an object::
   
      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   Reference an exception.


Source code
-----------

Literal code blocks are created by ending a paragraph with ``::``. The literal
block must be indented, and like all paragraphs be separated by single lines::

    This is a paragraph::
        
        while ($i--) {
            doStuff()
        }
    
    This is regular text again.

Literal text is not modified or formatted, save that one level of indentation is removed.


Notes and warnings
------------------

There are often times when you want to inform the reader of an important tip,
special note or a potential hazard. Admonitions in sphinx are used for just
that.  There are three kinds of admonitions. 

* ``.. tip::`` Tips are used to document or re-iterate interesting or important
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
* ``.. note::`` Notes are used to document an especially important piece of
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
* ``.. warning::`` Warnings are used to document potential stumbling blocks, or
  information pertaining to security.  The content of the directive should be
  written in complete sentences and include all appropriate punctuation.
  
All admonitions are made the same::

    .. note::
    
        Indented and preceeded and followed by a blank line. Just like a paragraph.
    
    This text is not part of the note.

Samples
~~~~~~~

.. tip::

    This is a helpful tid-bit you probably forgot.

.. note::

    You should pay attention here.

.. warning::

    It could be dangerous.
