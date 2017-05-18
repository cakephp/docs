Estándares de codificación
##########################

Los desarrolladores de CakePHP deberán utilizar la `Guia de estilo de codificación PSR-2
<http://www.php-fig.org/psr/psr-2/>`_ además de las siguientes normas como estándares
de codificación.

Es recomendable que otos *CakeIngredients* que se desarrollen sigan los mismos
estándares.

Puedes utilizar el `CakePHP Code Sniffer <https://github.com/cakephp/cakephp-codesniffer>`_ 
para comprobar que tu código siga los estándares requeridos.

Añadir nuevas funcionalidades
=============================

Las nuevas funcionalidades no se deberán añadir sin sus propias pruebas, las cuales 
deberán ser superadas antes de hacer el *commit* en el repositorio.

Configuración del *IDE*
=======================

Asegúrate de que tu *IDE* haga *trim* por la derecha para que no haya espacios
al final de las líneas.

La mayoría de los *IDEs* modernos soportan archivos ``.editorconfig``. El 
esqueleto de aplicación de CakePHP viene con él por defecto y contiene las
mejores prácticas de forma predeterminada.

Tabulación
==========

Se utilizará cuatro espacios para la tabulación.

Por lo que debería everse asi::

    // nivel base
        // nivel 1
            // nivel 2
        // nivel 1
    // nivel base

O también::

    $booleanVariable = true;
    $stringVariable = 'moose';
    if ($booleanVariable) {
        echo 'Boolean value is true';
        if ($stringVariable === 'moose') {
            echo 'We have encountered a moose';
        }
    }

En los casos donde utilices llamadas de funciones que ocupen más de un línea
usa las siguientes guías:

*  El paréntesis de abertura de la llamada de la función deberá ser lo
   último que contenga la línea.
*  Sólo se permite un argumento por línea.
*  Los paréntesis de cierre deben estar solos y en una línea por separado.

Por ejemplo, en vez de utilizar el siguiente formato::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

Utiliza éste en su lugar::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

Tamaño de línea
===============

Es recomendable mantener un tamaño de 100 caracteres por línea para una mejor
lectura del código y tratar de no pasarse de los 120.

En resumen:

* 100 caracteres es el límite recomendado.
* 120 caracteres es el límite máximo.

Estructuras de control
======================

Las estructuras de control son por ejemplo "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. A continuación un ejemplo con "``if``"::

    if ((expr_1) || (expr_2)) {
        // accion_1;
    } elseif (!(expr_3) && (expr_4)) {
        // accion_2;
    } else {
        // accion_por_defecto;
    }

*  En las estructuras de control deberá haber un espacio antes del primer paréntesis
   y otro entre el último y la llave de apertura.
*  Utiliza siempre las llaves en las estructuras de control incluso si 
   no son necesarias. Aumentan la legibilidad del código y te proporcionan menos
   errores lógicos.
*  Las llaves de apertura deberán estar en la misma línea que la estructura de 
   control, las de cierre en líneas nuevas y el código dentro de las dos llaves 
   en un nuevo nivel de tabulación.
*  No deberán usarse las asignaciones *inline* en las estructras de control.

::

    // Incorrecto: sin llaves y declaración mal posicionada
    if (expr) statement;

    // Incorrecto: sin llaves
    if (expr)
        statement;

    // Correcto
    if (expr) {
        statement;
    }

    // Incorrecto = asignación inline
    if ($variable = Class::function()) {
        statement;
    }

    // Correcto
    $variable = Class::function();
    if ($variable) {
        statement;
    }

Operador ternario
-----------------

Los operadores ternarios están permitidos cuando toda su declaración cabe en una
sola línea. Operadores más largos deberán ir dentro dentro de una declaración
``if else``. Los operadores ternarios no deberían ir nunca anidados y opcionalmente
pueden utilizarse paréntesis entorno a las condiciones para dar claridad::

    // Correcto, sencillo y legible
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Incorrecto, operadores anidados
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


Archivos de plantilla
---------------------

En los archivos de plantilla (archivos .ctp) los desarrolladores deben utilizar
estructuras de control ``keyword`` al ser más fáciles de leer en archivos complejos. Las estructuras de control pueden estar dentro de bloques
de PHP o en etiquetas PHP separadas::

    <?php
    if ($esAdmin):
        echo '<p>Eres el usuario admin.</p>';
    endif;
    ?>
    <p>Lo siguiente es aceptado también:</p>
    <?php if ($esAdmin): ?>
        <p>Eres el usuario admin.</p>
    <?php endif; ?>


Comparación
===========

Intenta ser siempre lo más estricto posible. Si una comparación no es estricta 
de forma deliberada, puede ser inteligente añadir un comentario para evitar
confundirla con un error.

Para comprobar si una variables es ``null`` se recomienda utilizar comprobación
estricta::

    if ($value === null) {
        // ...
    }

El valor contra el que se va a realizar la comparación deberá ir en el lado derecho
de esta::

    // no recomendado
    if (null === $this->foo()) {
        // ...
    }

    // recomendado
    if ($this->foo() === null) {
        // ...
    }

Llamadas de funciones
=====================

Las llamadas a funciones deben realizarse sin espacios entre el nombre de la
función y el parentesis de apertura y entre cada parámetro de la llamada deberá
haber un espacio::

    $var = foo($bar, $bar2, $bar3);

Como puedes ver arriba también deberá haber un espacio a ambos lados de los
signos de igual.

Definición de métodos
=====================

Ejemplo de definición de un método::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }
        
        return $var;
    }

Parámetros con un valor por defecto deberán ir al final de las definiciones.
Trata que tus funciones devuelvan siempre un resultado, al menos ``true`` o 
``false``, para que se pueda determinar cuando la llamada a la función ha sido 
correcta::

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

Como puedes ver hay un espacio a ambos lados del signo de igual.

Declaración de tipo
-------------------

Los argumentos que esperan objetos, arrays o ``callbacks`` pueden ser tipificados.
Solo tipificamos métodos públicos, aunque la tipificación no está libre de costes::

    /**
     * Alguna descripción del método
     *
     * @param \Cake\ORM\Table $table La clase table a utilizar.
     * @param array $array Algún valor array.
     * @param callable $callback Algún callback.
     * @param bool $boolean Algún valor boolean.
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

Aquí ``$table`` debe ser una instancia de ``\Cake\ORM\Table``, ``$array`` debe 
ser un ``array`` y ``$callback`` debe ser de tipo ``callable`` (un ``callback`` 
válido).

Fíjate en que si quieres permitir que ``$array`` sea también una instancia de
``\ArrayObject`` no deberías tipificarlo ya que ``array`` acepta únicamente el
tipo primitivo::

    /**
     * Alguna descripción del método.
     *
     * @param array|\ArrayObject $array Algún valor array.
     */
    public function foo($array)
    {
    }

Funciones anónimas (``Closures``)
---------------------------------

Para definir funciones anónimas sigue la guía de estilo de código 
`PSR-2 <http://www.php-fig.org/psr/psr-2/>`_ , donde se declaran con un espacio
después de la palabra ``function`` y antes y después de la palabra ``use``::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // código
    };

Encadenación de métodos
=======================

Las encadenaciones de métodos deberán distribuir estos en líneas separadas y
tabulados con cuatro espacios::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

Comentar el código
==================

Todos los comentarios deberán ir escritos en inglés y describir de un modo claro
el bloque de código comentado.

Los comentarios pueden incluir las siguientes etiquetas de 
`phpDocumentor <http://phpdoc.org>`_:

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Usando el formato ``@version <vector> <description>``, donde ``version``
   y ``description`` son obligatorios.
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

Las etiquetas PhpDoc son muy similares a las etiquetas JavaDoc en Java. Las etiquetas
solo son procesadas si son el primer elemento en una línea DocBlock, por ejemplo::

    /**
     * Ejemplo de etiqueta.
     *
     * @author esta etiqueta es parseada, pero esta @version es ignorada
     * @version 1.0 esta etiqueta es parseada también
     */

::

    /**
     * Ejemplo de etiquetas phpDoc inline.
     *
     * Esta función trabaja duramente con foo() para manejar el mundo.
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Función foo.
     *
     * @return void
     */
    function foo()
    {
    }

Los bloques de comentarios, con la excepción del primer bloque en un archivo, 
deberán ir siempre precedidos por un salto de línea.

Tipos de variables
------------------

Tipos de variables para utilizar en DocBlocks:

Tipo
    Descripción
mixed
    Una variable de tipo indefinido o múltiples tipos.
int
    Variable de tipo integer (números enteros).
float
    Tipo float (número de coma flotante).
bool
    Tipo booleano (true o false).
string
    Tipo string (cualquier valor entre " " o ' ').
null
    Tipo null. Normalmente usado conjuntamente con otro tipo.
array
    Tipo array.
object
    Tipo object. Debe usarse un nombre de clase específico si es posible.
resource
    Tipo resource (devuelto por ejemplo por mysql\_connect()).
    Recuerda que cuando especificas el tipo como mixed deberás indicar 
    si es desconocido o cuales son los tipos posibles.
callable
    Función Callable.

Puedes combinar tipos usando el caracter ``|``::

    int|bool

Para más de dos tipos normalmente lo mejor es utilizar ``mixed``.

Cuando se devuelva el propio objeto, p.ej. para encadenar, deberás utilizar 
``$this`` en su lugar::

    /**
     * Función foo.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

Incluir archivos
================

``include``, ``require``, ``include_once`` y ``require_once`` no tienen paréntesis::

    // mal = paréntesis
    require_once('ClassFileName.php');
    require_once ($class);

    // bien = sin paréntesis
    require_once 'ClassFileName.php';
    require_once $class;

Cuando se incluyan archivos con clases o librerías usa siempre y únicamente la
función `require\_once <http://php.net/require_once>`_.

Etiquetas PHP
=============

Utiliza siempre las etiquetas ``<?php`` y ``?>`` en lugar de ``<?`` y ``?>``. 

La sintaxis abreviada de ``echo`` deberá usarse en los archivos de plantilla
(**.ctp**) donde proceda.

Sintaxis abreviada de echo
--------------------------

La sintaxis abreviada de ``echo`` (``<?=``) deberá usarse en los archivos de 
plantillas en lugar de ``<?php echo``. Deberá ir seguido inmediatamente por un 
espacio, la variable o valor de la función a imprimir, un espacio y la etiqueta
php de cierre::

    // mal = con punto y coma y sin espacios
    <td><?=$name;?></td>

    // bien = con espacios y sin punto y coma
    <td><?= $name ?></td>

A partir de la versión 5.4 de PHP la etiqueta (``<?=``) no es considerada un
``short tag`` y está siempre disponible sin importar la directiva ``ini`` de
``short_open_tag``.

Convenciones de nomenclatura
============================

Funciones
---------

Escribe todas las funciones en ``camelBack``::

    function nombreFuncionLargo()
    {
    }

Clases
------

Los nombres de las clases deberán escribirse en ``CamelCase``, por ejemplo::

    class ClaseEjemplo
    {
    }

Variables
---------

Los nombres de variables deberán ser todo lo descriptibles que puedan pero
también lo más corto posible. Se escribirán en minúscula salvo que estén compuestos
por múltiples palabras, en cuyo caso irán en ``camelBack``. Los nombres de las 
variables que referencien objetos deberán ir asociados de algún modo a la clase
de la cual es objeto.
Ejemplo::

    $usuario = 'John';
    $usuarios = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

Visibilidad de miembros
-----------------------

Usa las palabras clave ``public``, ``protected`` y ``private`` de PHP para métodos
y variables.

Direcciones de ejemplos
-----------------------

Para los ejemplos de URL y correos electrónicos usa "example.com", "example.org"
y "example.net", por ejemplo:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

El nombre de dominio "example.com" está reservado para ello (ver :rfc:`2606`) 
y está recomendado para usar en documentaciones o como ejemplos.

Archivos
--------

Los nombres de archivos que no contengan clases deberán ir en minúsculas y
con guiones bajos, por ejemplo::

    nombre_de_archivo_largo.php

Hacer ``casts``
---------------

Para hacer ``casts`` usamos:

Tipo
    Descripción
(bool)
    Cast a boolean.
(int)
    Cast a integer.
(float)
    Cast a float.
(string)
    Cast a string.
(array)
    Cast a array.
(object)
    Cast a object.

Por favor utiliza ``(int)$var`` en lugar de ``intval($var)`` y ``(float)$var`` 
en lugar de ``floatval($var)`` cuando aplique.

Constantes
----------

Los nombres de constantes deberán ir en mayúsculas::

    define('CONSTANTE', 1);

Si el nombre de una constante se compone de varias palabras deberán ir separadas
por guiones bajos, por ejemplo::

    define('NOMBRE_DE_CONSTANTE_LARGO', 2);

Cuidado al usar empty()/isset()
===============================

Aunque ``empty()`` es una función sencilla de utilizar, puede enmascarar errores
y causar efectos accidentales cuando se usa con ``'0'`` y ``0``. Cuando
las variables o propiedades están ya definidas el uso de ``empty()`` no es 
recomendable. Al trabajar con variables es mejor utilizar la conversión a tipo
booleano en lugar de ``empty()``::

    function manipulate($var)
    {
        // No recomendado, $var está definido en el ámbito
        if (empty($var)) {
            // ...
        }

        // Utiliza la conversión a booleano
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

Cuando trates con propiedades definidas deberías favorecer las comprobaciones
sobre ``null`` en lugar de ``empty()``/``isset()``::

    class Thing
    {
        private $property; // Definido

        public function readProperty()
        {
            // No recomendado al estar definida la propiedad en la clase
            if (!isset($this->property)) {
                // ...
            }
            // Recomendado
            if ($this->property === null) {

            }
        }
    }

Cuando se trabaja con arrays, es mejor hacer ``merge`` de valores por defecto
en vez de hacer comprobaciones con ``empty()``. Haciendo ``merge`` de valores
por defecto puedes asegurarte de que las claves necesarias están definidas::

    function doWork(array $array)
    {
        // Hacer merge de valor por defecto para eliminar la necesidad
		// de comprobaciones empty
        $array += [
            'key' => null,
        ];

        // No recomendado, la clave ya está seteada
        if (isset($array['key'])) {
            // ...
        }

        // Recomendado
        if ($array['key'] !== null) {
            // ...
        }
    }

.. meta::
    :title lang=es: Estándares de codificación
    :keywords lang=es: llaves, nivel de tabulación, errores logicos, estructuras de control,expr,estándares de codificación,paréntesis,foreach, legibilidad,moose,nuevas funcionalidades,repositorio,desarrolladores
