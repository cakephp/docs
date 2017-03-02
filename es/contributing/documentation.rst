Documentación
#############

Contribuir con la documentación es fácil. Los archivos están hospedados
en https://github.com/cakephp/docs. Siéntete libre de hacer un *fork* del
repositorio, añadir tus cambios, mejoras, traducciones y comenzar a ayudar
a través de un nuevo *pull request*. Puedes también editar los archivos de manera 
online con GitHub sin la necesidad de descargarlos -- el botón *Improve this Doc* 
que aparece en todas las páginas te llevará al editor online de GitHub de esa página.

La documentación de CakePHP dispone de `integración continua <https://es.wikipedia.org/wiki/Integraci%C3%B3n_continua>`_,
y se despliega automáticamente tras realizar el *merge* del *pull request*.

Traducciones
============

Envía un email al equipo de documentación (docs *arroba* cakephp *punto* org) o 
utiliza IRC (#cakephp en *freenode*) para hablar de cualquier trabajo de 
traducción en el que quieras participar.

Nueva traducción
----------------

Nos gustaría poder proveer traducciones que estén todo lo completas posible. Sin
embargo hay ocasiones donde una archivo de traducción no está al día. Deberías 
considerar siempre la versión en Inglés como la versión acreditada.

Si tu idioma no está entre los disponibles, por favor, contacta con nosotros a 
través de Github y estudiaremos la posibilidad de crear la estructura de archivos 
para ello.

Las siguientes secciones son las primeras que deberías considerar 
traducir ya que estos archivos no cambian a menudo:

- index.rst
- intro.rst
- quickstart.rst
- installation.rst
- /intro (carpeta)
- /tutorials-and-examples (carpeta)

Recordatorio para administradores de documentación
--------------------------------------------------

La estructura de archivos de todos los idiomas deben seguir la estructura de
la versión en inglés. Si la estructura cambia en esta versión debemos realizar 
dichos cambios en los demás idiomas.


Por ejemplo, si se crea un nuevo archivo en inglés en **en/file.rst**, tendremos que:

- Añadir el archivo en todos los idiomas: **fr/file.rst**, **zh/file.rst**, ...
- Borrar el contenido pero manteniendo el ``title``, ``meta`` información y
  ``toc-tree`` que pueda haber. Se añadirá la siguiente nota mientras nadie
  traduzca el archivo::

    File Title
    ##########

    .. note::
        The documentation is not currently supported in XX language for this
        page.

        Please feel free to send us a pull request on
        `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
        button to directly propose your changes.

        You can refer to the English version in the select top menu to have
        information about this page's topic.

    // If toc-tree elements are in the English version
    .. toctree::
        :maxdepth: 1

        one-toc-file
        other-toc-file

    .. meta::
        :title lang=xx: File Title
        :keywords lang=xx: title, description,...


Consejos para traductores
-------------------------

- Navega y edita en el idioma al que quieras traducir el contenido - de otra 
  manera no verás lo que ya está traducido.
- Siéntete libre de bucear en la traducción si ya existe tu idioma.
- Usa la `Forma informal <https://es.wikipedia.org/wiki/Registro_ling%C3%BC%C3%ADstico>`_.
- Traduce el título y el contenido a la vez.
- Compara con la versión en inglés antes de subir una corrección (si corriges 
  algo pero no indicas una referencia tu subida no será aceptada).
- Si necesitas escribir un término en inglés envuélvelo en etiquetas ``<em>``.
  E.g. "asdf asdf *Controller* asdf" o "asdf asdf Kontroller
  (*Controller*) asfd" como proceda.
- No subas traducciones parciales.
- No editas una sección con cambios pendientes.
- No uses `entidades HTML <https://es.wikipedia.org/wiki/Anexo:Entidades_de_caracteres_XML_y_HTML>`_
  para caracteres acentudados, la documentación utiliza UTF-8.
- No cambies significatibamente el etiquetado (HTML) o añadas nuevo contenido.
- Si falta información en el contenido original sube primero una correción de ello.

Guía de formato para la documentación
=====================================

La nueva documentación de CakePHP está escrito con `texto en formato ReST <https://es.wikipedia.org/wiki/ReStructuredText>`_.

ReST (*Re Structured Text*) es una sintaxis de marcado de texto plano similar a 
*Markdown* o *Textile*. 

Para mantener la consistencia cuando añadas algo a la documentación de CakePHP 
recomendamos que sigas las siguientes líneas de guía sobre como dar formato 
y estructurar tu texto.

Tamaño de línea
---------------

Las líneas de texto deberían medir como máximo 40 caracteres. Las únicas
excepciones son URLs largas y fragmentos de código.

Cabeceras y secciones
---------------------

Las cabeceras de las secciones se crean subrayando el título con caracteres de 
puntuación. El subrayado deberá de ser por lo menos tan largo como el texto.

- ``#`` Se utiliza para indicar los títulos de páginas.
- ``=`` Se utiliza para los títulos de las secciones de una página.
- ``-`` Se utiliza para los títulos de subsecciones.
- ``~`` Se utiliza para los títulos de sub-subsecciones.
- ``^`` Se utiliza para los títulos de sub-sub-subsecciones.

Los encabezados no deben anidarse con más de 5 niveles de profundidad y deben
estar precedidos y seguidos por una línea en blanco.

Párrafos
--------

Párrafos son simplemente bloques de texto con todas las líneas al mismo nivel de
indexación. Los párrafos deben de separarse por al menos una línea vacía.

Inline Markup
-------------

* One asterisk: *text* for emphasis (italics)
  We'll use it for general highlighting/emphasis.

  * ``*text*``.

* Two asterisks: **text** for strong emphasis (boldface)
  We'll use it for working directories, bullet list subject, table names and
  excluding the following word "table".

  * ``**/config/Migrations**``, ``**articles**``, etc.

* Two backquotes: ``text`` for code samples
  We'll use it for names of method options, names of table columns, object
  names, excluding the following word "object" and for method/function
  names -- include "()".

  * ````cascadeCallbacks````, ````true````, ````id````,
    ````PagesController````, ````config()````, etc.

If asterisks or backquotes appear in running text and could be confused with
inline markup delimiters, they have to be escaped with a backslash.

Inline markup has a few restrictions:

* It **may not** be nested.
* Content may not start or end with whitespace: ``* text*`` is wrong.
* Content must be separated from surrounding text by non-word characters. Use a
  backslash escaped space to work around that: ``onelong\ *bolded*\ word``.

Lists
-----

List markup is very similar to markdown. Unordered lists are indicated by
starting a line with a single asterisk and a space. Numbered lists can be
created with either numerals, or ``#`` for auto numbering::

    * This is a bullet
    * So is this. But this line
      has two lines.

    1. First line
    2. Second line

    #. Automatic numbering
    #. Will save you some time.

Indented lists can also be created, by indenting sections and separating them
with an empty line::

    * First line
    * Second line

        * Going deeper
        * Whoah

    * Back to the first level.

Definition lists can be created by doing the following::

    term
        definition
    CakePHP
        An MVC framework for PHP

Terms cannot be more than one line, but definitions can be multi-line and all
lines should be indented consistently.

Links
-----

There are several kinds of links, each with their own uses.

External Links
~~~~~~~~~~~~~~

Links to external documents can be done with the following::

    `External Link to php.net <http://php.net>`_

The resulting link would look like this: `External Link to php.net <http://php.net>`_

Links to Other Pages
~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    Other pages in the documentation can be linked to using the ``:doc:`` role.
    You can link to the specified document using either an absolute or relative
    path reference. You should omit the ``.rst`` extension. For example, if
    the reference ``:doc:`form``` appears in the document ``core-helpers/html``,
    then the link references ``core-helpers/form``. If the reference was
    ``:doc:`/core-helpers```, it would always reference ``/core-helpers``
    regardless of where it was used.

Cross Referencing Links
~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    You can cross reference any arbitrary title in any document using the
    ``:ref:`` role. Link label targets must be unique across the entire
    documentation. When creating labels for class methods, it's best to use
    ``class-method`` as the format for your link label.

    The most common use of labels is above a title. Example::

        .. _label-name:

        Section heading
        ---------------

        More content here.

    Elsewhere you could reference the above section using ``:ref:`label-name```.
    The link's text would be the title that the link preceded. You can also
    provide custom link text using ``:ref:`Link text <label-name>```.

Prevent Sphinx to Output Warnings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx will output warnings if a file is not referenced in a toc-tree. It's
a great way to ensure that all files have a link directed to them, but
sometimes, you don't need to insert a link for a file, eg. for our
`epub-contents` and `pdf-contents` files. In those cases, you can add
``:orphan:`` at the top of the file, to suppress warnings that the file is not
in the toc-tree.

Describing Classes and their Contents
-------------------------------------

The CakePHP documentation uses the `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ to provide custom
directives for describing PHP objects and constructs. Using these directives
and roles is required to give proper indexing and cross referencing features.

Describing Classes and Constructs
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

   Describes a class. Methods, attributes, and constants belonging to the class
   should be inside this directive's body::

        .. php:class:: MyClass

            Class description

           .. php:method:: method($argument)

           Method description


   Attributes, methods and constants don't need to be nested. They can also just
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

Cross Referencing
~~~~~~~~~~~~~~~~~

The following roles refer to PHP objects and links are generated if a
matching directive is found:

.. rst:role:: php:func

   Reference a PHP function.

.. rst:role:: php:global

   Reference a global variable whose name has ``$`` prefix.

.. rst:role:: php:const

   Reference either a global constant, or a class constant. Class constants
   should be preceded by the owning class::

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


Source Code
-----------

Literal code blocks are created by ending a paragraph with ``::``. The literal
block must be indented, and like all paragraphs be separated by single lines::

    This is a paragraph::

        while ($i--) {
            doStuff()
        }

    This is regular text again.

Literal text is not modified or formatted, save that one level of indentation
is removed.


Notes and Warnings
------------------

There are often times when you want to inform the reader of an important tip,
special note or a potential hazard. Admonitions in sphinx are used for just
that. There are fives kinds of admonitions.

* ``.. tip::`` Tips are used to document or re-iterate interesting or important
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
* ``.. note::`` Notes are used to document an especially important piece of
  information. The content of the directive should be written in complete
  sentences and include all appropriate punctuation.
* ``.. warning::`` Warnings are used to document potential stumbling blocks, or
  information pertaining to security. The content of the directive should be
  written in complete sentences and include all appropriate punctuation.
* ``.. versionadded:: X.Y.Z`` "Version added" admonitions are used to display notes
  specific to new features added at a specific version, ``X.Y.Z`` being the version on
  which the said feature was added.
* ``.. deprecated:: X.Y.Z`` As opposed to "version added" admonitions, "deprecated"
  admonition are used to notify of a deprecated feature, ``X.Y.Z`` being the version on
  which the said feature was deprecated.

All admonitions are made the same::

    .. note::

        Indented and preceded and followed by a blank line. Just like a
        paragraph.

    This text is not part of the note.

Samples
~~~~~~~

.. tip::

    This is a helpful tid-bit you probably forgot.

.. note::

    You should pay attention here.

.. warning::

    It could be dangerous.

.. versionadded:: 2.6.3

    This awesome feature was added on version 2.6.3

.. deprecated:: 2.6.3

    This old feature was deprecated on version 2.6.3


.. meta::
    :title lang=en: Documentation
    :keywords lang=en: partial translations,translation efforts,html entities,text markup,asfd,asdf,structured text,english content,markdown,formatted text,dot org,repo,consistency,translator,freenode,textile,improvements,syntax,cakephp,submission
