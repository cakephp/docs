Xml
###

Con la clase Xml podemos generar y analizar cómodamente fragmentos y
documentos XML. Esta solución, íntegra en PHP, sólo necesita que la
extensión Xml/Expat esté instalada.

Análisis Xml
============

Para analizar un documento con la clase Xml, necesitamos una cadena con
el Xml que queremos analizar.

::

    $input = '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>
        <container>
            <element id="first-el">
                <name>My element</name>
                <size>20</size>
            </element>
            <element>
                <name>Your element</name>
                <size>30</size>
            </element>
        </container>';
    $xml = new Xml($input);

Esto crea un objeto de tipo documento Xml. A partir de este momento, el
objeto se puede leer, manipular, y convertir en una cadena de
caracteres. .

Con el ejemplo anterior podemos hacer lo siguiente:

::

    echo $xml->children[0]->children[0]->name;
    // outputs 'element'

    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // outputs 'My Element'

    echo $xml->children[0]->child('element')->attributes['id'];
    //outputs 'first-el'

