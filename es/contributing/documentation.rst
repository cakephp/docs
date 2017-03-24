Documentación
#############

Contribuir con la documentación es fácil. Los archivos están hospedados
en https://github.com/cakephp/docs. Siéntete libre de hacer un *fork* del
repositorio, añadir tus cambios, mejoras, traducciones y comenzar a ayudar
a través de un nuevo *pull request*. También puedes editar los archivos de manera 
online con GitHub sin la necesidad de descargarlos -- el botón *Improve this Doc* 
que aparece en todas las páginas te llevará al editor online de GitHub de esa página.

La documentación de CakePHP dispone de `integración continua <https://es.wikipedia.org/wiki/Integraci%C3%B3n_continua>`_
y se despliega automáticamente tras realizar el *merge* del *pull request*.

Traducciones
============

Envía un email al equipo de documentación (docs *arroba* cakephp *punto* org) o 
utiliza IRC (#cakephp en *freenode*) para hablar de cualquier trabajo de 
traducción en el que quieras participar.

Nueva traducción
----------------

Nos gustaría poder disponer de traducciones que estén todo lo completas posible.
Sin embargo hay ocasiones donde un archivo de traducción no está al día, por lo  
que debes considerar siempre la versión en inglés como la versión acreditada.

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


Por ejemplo, si se crea un nuevo archivo en inglés en **en/file.rst** tendremos que:

- Añadir el archivo en todos los idiomas: **fr/file.rst**, **zh/file.rst**,...
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
- Siéntete libre de bucear en la traducción si ya existe en tu idioma.
- Usa la `Forma informal <https://es.wikipedia.org/wiki/Registro_ling%C3%BC%C3%ADstico>`_.
- Traduce el título y el contenido a la vez.
- Compara con la versión en inglés antes de subir una corrección (si corriges 
  algo pero no indicas una referencia tu subida no será aceptada).
- Si necesitas escribir un término en inglés envuélvelo en etiquetas ``<em>``.
  E.g. "asdf asdf *Controller* asdf" o "asdf asdf Kontroller
  (*Controller*) asfd" como proceda.
- No subas traducciones parciales.
- No edites una sección con cambios pendientes.
- No uses `entidades HTML <https://es.wikipedia.org/wiki/Anexo:Entidades_de_caracteres_XML_y_HTML>`_
  para caracteres acentudados, la documentación utiliza UTF-8.
- No cambies significatibamente el etiquetado (HTML) o añadas nuevo contenido.
- Si falta información en el contenido original sube primero una corrección de ello.

Guía de formato para la documentación
=====================================

La nueva documentación de CakePHP está escrito con `texto en formato ReST <https://es.wikipedia.org/wiki/ReStructuredText>`_.

ReST (*Re Structured Text*) es una sintaxis de marcado de texto plano similar a 
*Markdown* o *Textile*. 

Para mantener la consistencia cuando añadas algo a la documentación de CakePHP 
recomendamos que sigas las siguientes líneas guía sobre como dar formato y 
estructurar tu texto.

Tamaño de línea
---------------

Las líneas de texto deberían medir como máximo 40 caracteres. Las únicas
excepciones son URLs largas y fragmentos de código.

Cabeceras y secciones
---------------------

Las cabeceras de las secciones se crean subrayando el título con caracteres de 
puntuación. El subrayado deberá ser por lo menos tan largo como el texto.

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
indexación. Los párrafos deben separarse por al menos una línea vacía.

Marcado en línea
----------------

* Un asterisco: *texto* en cursiva.
  Lo usaremos para enfatizar/destacar de forma general.
  
  * ``*texto*``.
  
* Dos astericos: **texto** en negrita.
  Lo usaremos para indicar directorios de trabajo, títulos de listas y nombres 
  de tablas (excluyendo la palabra *table*).
  
  * ``**/config/Migrations**``, ``**articulos**``, etc.
  
* Dos acentos graves (*``*): ``texto`` para ejemplos de código.
  Lo usaramos para nombres de opciones de métodos, columnas de tablas,
  objetos (excluyendo la palabra "objeto") y para nombres de métodos y funciones
  (incluídos los paréntesis )
  
  * ````cascadeCallbacks````, ````true````, ````id````,
    ````PagesController````, ````config()````, etc.

Si aparecen asteriscos o acentos graves en el texto y pueden ser confundidos con
los delimitadores de marcado habrá que escaparlos con *\\*.

Los marcadores en línea tienen algunas restricciones:

* **No pueden** estar anidados.
* El contenido no puede empezar o acabar con espacios en blanco: ``* texto*`` 
  está mal.
* El contenido debe separarse del resto del texto por caracteres que no sean
  palabras. Utiliza *\\* para escapar un espacio y solucionarlo: ``onelong\ *bolded*\ word``.

Listas
------

El etiquetado de listas es muy parecido a *Markdown*. Las listas no ordenadas se
indican empezando una línea con un asterisco y un espacio.

Las listas enumeradas pueden crearse con enumeraciones o ``#`` para auto enumeración::

    * Esto es una viñeta
	* Esto también, pero esta línea
	  tiene dos líneas.

    1. Primera línea
	2. Segunda línea

    #. La enumeración automática
    #. Te ahorrará algo de tiempo.

También se pueden crear listas anidadas tabulando secciones y separándolas con
una línea en blanco::

    * Primera línea
    * Segunda línea

        * Bajando un nivel
        * Yeah!

    * Volviendo al primer nivel

Pueden crearse listas de definiciones haciendo lo siguiente::

    Término
        Definición
    CakePHP
        Un framework MVC para PHP

Los términos no pueden ocupar más de una línea pero las definiciones pueden
ocupar más líneas mientras se aniden consistentemente.

Enlaces
-------

Hay diferentes tipos de enlaces, cada uno con sus características.

Enlaces externos
~~~~~~~~~~~~~~~~

Los enlaces a documentos externos pueden hacerse de la siguiente manera::

    `Enlace externo a php.net <http://php.net>`_

El resultado debería verse así: `Enlace externo a php.net <http://php.net>`_

Enlaces a otras páginas
~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    Puedes crear enlaces a otras páginas de la documentación usando la función
    ``::doc:``. Puedes enlazar a un archivo específico empleando rutas relativas
    o absolutas omitiendo la extensión ``.rst``. Por ejemplo: si apareciese 
    ``:doc:`form``` en el documento ``core-helpers/html``, el enlace haría
    referencia a ``core-helpers/form``. Si la referencia fuese ``:doc:`/core-helpers```
    el enlace sería siempre a ``/core-helpers`` sin importar donde se utilice.

Enlaces a referencias cruzadas
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    Puedes hacer referncia cruzada a cualquier título de cualquier documento 
    usando la función ``:ref:``. Los enlaces a etiquetas de destino deben ser 
    únicos a lo largo de toda la documentación. Cuando se crean etiquetas para 
    métodos de clase lo mejor es usar ``clase-método`` como formato para tu 
    etiqueta de destino.
    
    El uso más habitual de etiquetas es encima de un título. Ejemplo::

        .. _nombre-etiqueta:

        Título sección
        --------------

        Resto del contenido.

    En otro sitio podrías enlazar a la sección de arriba usando ``:ref:`nombre-etiqueta```.
    El texto del enlace será el título al que precede el enlace pero puedes
    personalizarlo usando ``:ref:`Texto del enlace <nombre-etiqueta>```.


Evitar alertas de Sphinx
~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx mostrará avisos si un archivo no es referenciado en un *toc-tree*. Es una
buena manera de asegurarse de que todos los archivos tienen un enlace dirigido
a ellos. Pero a veces no necesitas introducir un enlace a un archivo, p.ej. para
nuestros archivos *epub-contents* y *pdf-contents*. En esos casos puedes añadir
``:orphan:`` al inicio del archivo para eliminar las alertas de que el archivo
no está en el *toc-tree*

Describir clases y sus contenidos
---------------------------------

La documentación de CakePHP usa el `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ para proveer directivas
personalizadas para describir objetos PHP y constructores. El uso de estas 
directivas y funciones es necesario para una correcta indexación y uso de las
herramientas de referenciación cruzada.

Describir clases y constructores
--------------------------------

Cada directiva introduce el contenido del índice y/o índice del *namespace*.

.. rst:directive:: .. php:global:: nombre

   Esta directiva declara una nueva variable PHP global.

.. rst:directive:: .. php:function:: nombre(firma)

   Define una nueva función global fuera de una clase.

.. rst:directive:: .. php:const:: nombre

   Esta directiva declara una nueva constante PHP, puedes usarla también anidada
   dentro de una directiva de clase para crear constantes de clase.

.. rst:directive:: .. php:exception:: nombre

   Esta directiva declara una nueva excepción en el *namespace* actual. La firma
   puede incluir argumentos de constructor.

.. rst:directive:: .. php:class:: nombre

   Describe una clase. Métodos, atributos y atributos que pertenezcan a la clase
   deberán ir dentro del cuerpo de la directiva::

        .. php:class:: MyClass

            Descripción de la clase

           .. php:method:: method($argument)

           Descripción del método


   Atributos, métodos y constantes no necesitan estar anidados, pueden seguir
   la siguiente declaración de clase::

        .. php:class:: MyClass

            Texto sobre la clase

        .. php:method:: methodName()

            Texto sobre el método


   .. ver también:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: nombre(firma)

   Describe un método de clase, sus argumentos, salida y excepciones::

        .. php:method:: instanceMethod($one, $two)

            :param string $one: El primer parámetro.
            :param string $two: El segundo parámetro.
            :returns: Un array de cosas
            :throws: InvalidArgumentException

           Esto es una instancia de método.

.. rst:directive:: .. php:staticmethod:: ClassName::nombreMetodo(firma)

    Describe un método estático, sus argumentos, salida y excepciones,
    ver :rst:dir:`php:method` para opciones.

.. rst:directive:: .. php:attr:: nombre

   Describe una propiedad/atributo en una clase.

Evitar avisos de Sphinx
~~~~~~~~~~~~~~~~~~~~~~~

Sphinx mostrará avisos si una función es referenciada en múltiples archivos. Es
una buena manera de asegurarse de que no añades una función dos veces, pero algunas
veces puedes querer escribir una función en dos o más archivos, p.ej. *'debug object'*
es referenciado en *`/development/debugging`* y *`/core-libraries/global-constants-and-functions`*.
En este caso tu puedes añadir ``:noindex:`` debajo de la función *debug* para eliminar
los avisos. Mantén únicamente una referencia **sin** ``:no-index:`` para seguir 
teniendo la función referenciada::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

Referencias cruzadas
~~~~~~~~~~~~~~~~~~~~

Los siguientes *roles* hacen referencia a objetos PHP y los enlaces son generados
si se encuentra una directiva que coincida:

.. rst:role:: php:func

   Referencia a una función PHP.

.. rst:role:: php:global

   Referencia a una variable global cuyo nombre tiene prefijo ``$``.

.. rst:role:: php:const

   Referencia tanto a una constante global como a una de clase. Las constantes
   de clase deberán ir precedidas por la clase que las contenga::

        DateTime tiene una constante :php:const:`DateTime::ATOM`.

.. rst:role:: php:class

   Referencia una clase por el nombre::

     :php:class:`ClassName`

.. rst:role:: php:meth

   Referencia un método de una clase. Este *role* soporta ambos tipos de métodos::

     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   Referencia una propiedad de un objeto::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   Referencia una excepción.


Código fuente
-------------

Los bloques de citas de código fuente se crean finalizando un párrafo con ``::``.
El bloque debe ir anidado y, como todos los párrafos, separados por líneas en 
blanco::

    Esto es un párrafo::

        while ($i--) {
            doStuff()
        }

    Esto es otra vez texto normal.

Los textos citados no son modificados ni formateados salvo el primer nivel de
anidamiento, que es eliminado.

Notas y avisos
--------------

Hay muchas ocasiones en las que quieres avisar al lector de un consejo importante,
una nota especial o un peligro potencial. Las admonestaciones en *Sphinx* se
utilizan justo para eso. Hay cinco tipos de admonestaciones:

* ``.. tip::`` Los consejos (*tips*) se utilizan para documentar o reiterar 
  información interesante o importante. El contenido de la directiva debe
  escribirse en sentencias completas e incluir todas las puntuaciones apropiadas.
* ``.. note::`` Las notas (*notes*) se utilizan para documentar una pieza de
  información importante. El contenido de la directiva debe escribirse en 
  sentencias completas e incluir todas las puntuaciones apropiadas.
* ``.. warning::`` Avisos (*warnings*) se utilizan para documentar posibles 
  obstáculos o información relativa a seguridad. El contenido de la directiva 
  debe escribirse en sentencias completas e incluir todas las puntuaciones 
  apropiadas.
* ``.. versionadded:: X.Y.Z`` las admonestaciones *"Version added"*  se utilizan
  para mostrar notas específicas a nuevas funcionalidades añadidas en una versión 
  específica, siendo ``X.Y.Z`` la versión en la que se añadieron.
* ``.. deprecated:: X.Y.Z`` es lo opuesto a *versionadded*, se utiliza para 
  avisar de una funcionalidad obsoleta, siendo ``X.Y.Z`` la versión en la
  que pasó a ser obsoleta.

Todas las admonestaciones se escriben igual::

    .. note::

        Anidado y precedido por una línea en blanco.
		Igual que un párafo.

    Este texto no es parte de la nota.

Ejemplos
~~~~~~~~

.. tip::

    Esto es un consejo útil que probablemente hayas olvidado.

.. note::

    Deberías prestar atención aquí.

.. warning::

    Podría ser peligroso.

.. versionadded:: 2.6.3

    Esta funcionalidad tan genial fue añadida en la versión 2.6.3

.. deprecated:: 2.6.3

    Esta antigua funcionalidad pasó a ser obsoleta en la versión 2.6.3


.. meta::
    :title lang=es: Documentación
    :keywords lang=es: traducciones parciales, trabajos de traducción, entidades html,text markup,asfd,asdf,texto estructurado,contenido en ingles,markdown,texto formateado,punto org,repo,consistencia,traductor,freenode,textile,mejoras,sintaxis,cakephp,submission
