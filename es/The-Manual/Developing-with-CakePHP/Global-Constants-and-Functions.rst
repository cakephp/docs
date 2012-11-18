Constantes y Funciones Globales
###############################

Aunque en la mayor parte de nuestro trabajo diario en CakePHP
utilizaremos clases y métodos nativos, es útil conocer una serie de
funciones globales que ofrece CakePHP. Muchas de ellas están orientadas
al trabajo con las clases de CakePHP (cargando las clases de modelo o
componente), pero muchas otras hacen más sencillo trabajar con matrices
o cadenas.

También veremos en esta sección algunas de las constantes disponibles en
las aplicaciones CakePHP. Usarlas ayuda a realizar actualizaciones menos
complicadas, además de ser útiles a la hora de referenciar ciertos
archivos o directorios en nuestras aplicaciones CakePHP.

Funciones globales
==================

Éstas son las funciones globales disponibles en CakePHP. Muchas de ellas
simplemente facilitan la llamada a funciones de PHP con nombres largos,
pero otras (como ``vendor()`` y ``uses()``) se pueden usar para incluir
código o realizar otras funciones útiles. Lo más probable es que si
estás buscando una función para realizar una tarea con mucha frecuencia,
la encuentres aquí.

\_\_
----

``__(string $string_id, boolean $return =  false)``

Esta función gestiona la localización en las aplicaciones CakePHP. El
parámetro ``$string_id`` identifica la ID de una traducción, mientras
que el segundo parámetro indica si se debe mostrar automáticamente la
cadena (por defecto), o devolverla para su procesamiento (pasar el valor
true para que esto suceda).

Visita la sección `Localización e
Internacionalización </es/view/161/localization-internationalizat>`_
para más información.

a
-

``a(mixed $uno, $dos, $tres...)``

Devuelve un array con los parámetros pasados a la función.

::

    print_r(a('foo', 'bar')); 

    // salida:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

aa
--

``aa(array $uno, $dos, $tres...)``

Crea arrays asociativos a partir de los parámetros enviados a la
función.

::

    echo aa('a','b'); 

    // salida:
    array(
        'a' => 'b'
    )

am
--

``am(array $uno, $dos, $tres...)``

Combina todos los arrays pasados como parámetros y devuelve el array
resultante.

config
------

Puede ser usado para cargar archivos desde el directorio ``config``
mediante include\_once. La función checa si existe el archivo antes de
incluir y regresa un booleano. Toma un número opcional de argumento.

Ejemplo: ``config('some_file', 'myconfig');``

convertSlash
------------

``convertSlash(string $cadena)``

Sustituye las barras ("/") por subrayados ("\_") y elimina el primer y
el último subrayados en una cadena. Devuelve la cadena convertida.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

Si el nivel de depuración, variable de configuración DEBUG, es distinto
de cero, se muestra $var. Si ``$showHTML`` es true, los datos se
formatean para mostrarlos adecuadamente en los navegadores web.

e
-

``e(mixed $datos)``

Simplifica la llamada a la función ``echo()``.

env
---

``env(string $key)``

Obtiene una variable de entorno a partir de las fuentes disponibles.
Alternativa si las variables ``$_SERVER`` o ``$_ENV`` están
deshabilitadas.

También permite emular las variables PHP\_SELF y DOCUMENT\_ROOT en los
servidores que no permitan su uso. De hecho, es una buena práctica usar
``env()`` en lugar de ``$_SERVER`` o ``getenv()`` (sobretodo si pensamos
distribuir el código), ya que ofrece la misma funcionalidad y es
totalmente compatible.

fileExistsInPath
----------------

``fileExistsInPath(string $archivo)``

Comprueba que el fichero $archivo está en el include\_path actual de
PHP. Devuelve un valor booleano.

h
-

``h(string $texto, string $charset)``

Alias de la función ``htmlspecialchars()``.

ife
---

``ife($condicion, $siNoVacia, $siVacia)``

Útil en operaciones ternarias. Si ``$condicion`` no es vacía, devuelve
``$siNoVacia``; si no, devuelve ``$siVacia``.

low
---

``low(string $cadena)``

Alias de la función ``strtolower()``.

pr
--

``pr(mixed $var)``

Alias de la función ``print_r()``, añadiendo la etiqueta <pre> a la
salida.

r
-

``r(string $cadena_buscada, string $cadena_sustituta, string  $cadena_original)``

Alias de la función ``str_replace()``.

stripslashes\_deep
------------------

``stripslashes_deep(array $valor)``

Elimina recursivamente las barras invertidas de ``$valor``. Devuelve el
array modificado.

up
--

``up(string $cadena)``

Alias de la función ``strtoupper()``.

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Permite cargar las librerías nativas de CakePHP (localizadas en
cake/libs/). Pasar como parámetro el nombre de la librería sin la
extensión '.php'.

Constantes predefinidas
=======================

constante

Ruta absoluta dentro de la aplicación al ...

APP

directorio raíz.

APP\_PATH

directorio app.

CACHE

directorio de archivos de cache.

CAKE

directorio cake.

COMPONENTS

directorio components.

CONFIGS

directorio de archivos de configuración.

CONTROLLER\_TESTS

directorio controller de los tests.

CONTROLLERS

directorio controllers.

CSS

directorio de archivos CSS.

ELEMENTS

directorio elements.

HELPER\_TESTS

directorio helper de los tests.

HELPERS

directorio helpers.

INFLECTIONS

directorio inflections (normalmente dentro del directorio de
configuración).

JS

directorio de archivos JavaScript (en webroot).

LAYOUTS

directorio layouts.

LIB\_TESTS

directorio CakePHP Library de los tests.

LIBS

directorio de librerías CakePHP.

LOGS

directorio de logs (en app).

MODEL\_TESTS

directorio model de los tests.

MODELS

directorio models.

SCRIPTS

directorio de scripts de Cake.

TESTS

directorio tests (directorio padre de los directorios de test para los
modelos, controladores, etc.)

TMP

directorio tmp.

VENDORS

directorio vendors.

VIEWS

directorio views.

WWW\_ROOT

ruta completa a webroot.
