Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

La classe Xml vous permet de facilement transformer des tableaux en
SimpleXMLElement ou en objets DOMDocument, et de nouveau les transformer en tableaux.

Importer les données vers la classe Xml
=======================================

.. php:staticmethod:: build($input, $options = [])

Vous pouvez utiliser ``Xml::build()`` pour construire les objets XML. Depending on your
``$options`` parameter, this method will return a SimpleXMLElement (default)
or DOMDocument object. You can use ``Xml::build()`` to build XML
objects from a variety of sources.  For example, you can load XML from
strings::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Meilleur post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

Vous pouvez aussi construire des objets Xml à partir de fichiers locaux::

    // fichier local
    $xml = Xml::build('/home/awesome/unicorns.xml');

Vous pouvez aussi construire des objets Xml en utilisant un tableau::

    $data = array(
        'post' => array(
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        )
    );
    $xml = Xml::build($data);

Si votre entrée est invalide, la classe Xml enverra une Exception::

    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // Here will throw a Exception
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ et
    `SimpleXML <http://php.net/simplexml>`_ implement different API's.
    Assurez vous d'utiliser les bonnes méthodes sur l'objet que vous
    requêtez à partir d'un Xml.

Transformer une chaîne de caractères XML en tableau
===================================================

.. php:staticmethod:: toArray($xml);

Convertir des chaînes XML en tableaux est aussi facile avec la classe Xml. Par
défaut, vous obtiendrez un objet SimpleXml en retour::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

Si votre XML est invalide, cela enverra une
``Cake\Utility\Exception\XmlException``.

Transformer un tableau en une chaîne de caractères XML
======================================================

::

    $xmlArray = array('root' => array('child' => 'value'));
    // You can use Xml::build() too.
    $xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags'));
    $xmlString = $xmlObject->asXML();

Votre tableau ne doit avoir qu'un élément de "niveau supérieur" et il ne doit
pas être numérique. Si le tableau n'est pas dans le bon format, Xml va lancer
une Exception.
Des Exemples de tableaux invalides::

    // Niveau supérieur avec une clé numérique
    array(
        array('key' => 'value')
    );

    // Plusieurs clés au niveau supérieur
    array(
        'key1' => 'première valeur',
        'key2' => 'autre valeur'
    );

By default array values will be output as XML tags, if you want to define
attributes or text values you can should prefix the keys that are supposed to be
attributes with ``@``. For value text, use ``@`` as the key::

    $xmlArray = array(
        'project' => array(
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project'
        )
    );
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

The content of ``$xmlString`` will be::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>

Utiliser des Namespaces
-----------------------

Pour utiliser les Namespaces XML, dans votre tableau vous devez créer une clé
avec le nom ``xmlns:`` vers un namespace générique ou avec le préfixe
``xmlns:`` dans un namespace personnalisé. Regardez les exemples::

    $xmlArray = array(
        'root' => array(
            'xmlns:' => 'http://cakephp.org',
            'child' => 'value'
        )
    );
    $xml1 = Xml::fromArray($xmlArray);

    $xmlArray(
        'root' => array(
            'tag' => array(
                'xmlns:pref' => 'http://cakephp.org',
                'pref:item' => array(
                    'item 1',
                    'item 2'
                )
            )
        )
    );
    $xml2 = Xml::fromArray($xmlArray);

La valeur de ``$xml1`` et ``$xml2`` sera, respectivement::

    <?xml version="1.0"?>
    <root xmlns="http://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="http://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

Créer un enfant
---------------

After you have created your XML document, you just use the native interfaces for
your document type to add, remove, or manipulate child nodes::

    // Using SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // Using DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, array('return' => 'domdocument'));
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    Après avoir manipulé votre XML en utilisant SimpleXMLElement ou DomDocument
    vous pouvez utiliser ``Xml::toArray()`` sans problèmes.


.. meta::
    :title lang=fr: Xml
    :keywords lang=fr: tableau php,classe xml,objets xml,post xml,objet xml,string url,string data,xml parser,php 5,boulangerie,constructeur,php xml,cakephp,php file,unicorns,meth
