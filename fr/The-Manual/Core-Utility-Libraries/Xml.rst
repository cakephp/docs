Xml
###

La classe Xml fournit une façon simple pour parcourir et générer des
fragments et documents XML. C'est une solution entièrement PHP qui
nécessite seulement que l'extension Xml/Expat soit installée.

Analyse (parsing) Xml
=====================

Parser du Xml avec la classe Xml vous oblige à avoir une chaîne
contenant le xml que vous voulez parser.

::

    $input = '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>
        <containeur>
            <element id="premier-el">
                <nom>Mon élément</name>
                <taille>20</taille>
            </element>
            <element>
                <nom>Ton élément</nom>
                <taille>30</taille>
            </element>
        </containeur>';
    $xml = new Xml($input);

Ceci créera un objet document Xml qui pourra ensuite être manipulé,
parcouru et reconverti en chaîne de caractères.

Avec l'exemple ci-dessus vous pouvez faire ce qui suit.

::

    echo $xml->children[0]->children[0]->name;
    // affiche 'element'

    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // affiche 'Mon élément'

    echo $xml->children[0]->child('element')->attributes['id'];
    // affiche 'premier-el'

De plus, il est parfois plus facile d'obtenir des données depuis XML, si
vous convertissez l'objet document XML en un tableau.

::

    $xml = new Xml($input);
    // Ceci convertit l'objet document XML en un tableau formaté
    $xmlAsArray = Set::reverse($xml);
    // Vous pouvez aussi simplement le convertir en appelant toArray();
    $xmlAsArray = $xml->toArray();

