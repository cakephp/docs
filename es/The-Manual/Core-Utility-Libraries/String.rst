Cadenas (String)
################

La clase String incluye métodos para crear y manipular cadenas
cómodamente. Estos métodos se acceden normalmente de forma estática; por
ejemplo: ``String::uuid()``.

uuid
====

El método uuid se utiliza para generar identificadores únicos de acuerdo
a la especificación `RFC 4122 <https://www.ietf.org/rfc/rfc4122.txt>`_.
El uuid es una cadena de 128 bits con el formato
485fc381-e790-47a3-9794-1337c0a8fe68.

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

``string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound = ')')``

Divide una cadena en subcadenas (tokens), ignorando cualquier instancia
de ``$separator`` que aparece entre ``$leftBound`` y ``$rightBound``.

insert
======

string insert ($string, $data, $options = array())

El método insert se utiliza para sustituir las claves de una plantilla
(basada en una cadena de caracteres) por los valores de una matriz
asociativa.

::

    String::insert('Mi nombre es :nombre y tengo :edad años de edad.', array('nombre' => 'Bob', 'edad' => '65'));
    // genera: "Mi nombre es Bob y tengo 65 años de edad."

cleanInsert
===========

string cleanInsert ($string, $options = array())

Limpia la cadena String::insert de acuerdo a las opciones de la matriz
$options, en función de la clave 'clean' de $options. El método que se
utiliza por defecto es texto, pero también está disponible html. El
objetivo de esta función es sustituir, alrededor de los marcadores, los
espacios en blanco y las marcas innecesarias que no sustituye
Set::insert.
