8.4.1 Xml parsing
-----------------

Parsing Xml with the Xml class requires you to have a string
containing the xml you wish to parse.

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

This would create an Xml document object that can then be
manipulated and traversed, and reconverted back into a string.

With the sample above you could do the following.

::

    echo $xml->children[0]->children[0]->name;
    // outputs 'element'
    
    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // outputs 'My Element'
    
    echo $xml->children[0]->child('element')->attributes['id'];
    //outputs 'first-el'

In addition to the above it often makes it easier to obtain data
from XML if you convert the Xml document object to a array.

::

    $xml = new Xml($input);
    // This converts the Xml document object to a formatted array
    $xmlAsArray = Set::reverse($xml);
    // Or you can convert simply by calling toArray();
    $xmlAsArray = $xml->toArray();
