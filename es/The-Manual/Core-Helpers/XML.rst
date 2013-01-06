XML
###

El helper XML simplifica la salida de documentos XML.

serialize
=========

El método serialize toma un arreglo y crea una cadena XML de los datos.
Esto es usado comúnmente para serializar datos de modelos.

::

    <?php
    echo $xml->serialize($data); 
    // El formato será similar a:
    // <model_name id="1" field_name="content" />
    ?>

El método serialize actua como un atajo para instanciar la clase XML
incorporada en CakePHP, y usar el método toString de la misma. Si
necesitas más control sobre la serialización, quizás quieras invocar la
clase XML directamente.

elem
====

El método elem permite construir una cadena-nodo XML con atributos y
también contenido interno.

string elem (string $name, $attrib = array(), mixed $content = null,
$endTag = true)

::

    echo $xml->elem('count', array('namespace' => 'myNameSpace'), 'contenido');
    // genera: <myNameSpace:count>contenido</count>

Si quieres empaquetar tu nodo de texto con CDATA, el tercer argumento
debería ser un arreglo con dos llaves: 'cdata' y 'value'

::

    echo $xml->elem('count', null, array('cdata'=>true,'value'=>'contenido');
    // genera: <count><![CDATA[contenido]]></count>

header
======

El método ``header()`` se usa para escribir la declaración de XML.

::

    <?php
    echo $xml->header(); 
    // genera: <?xml version="1.0" encoding="UTF-8" ?>
    ?>

Puedes entregar el número de la versión y tipo de codificación como
parámetros del metodo header.

::

    <?php
    echo $xml->header(array('version'=>'1.1')); 
    // genera: <?xml version="1.1" encoding="UTF-8" ?>
    ?>

