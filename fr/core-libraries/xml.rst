Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

La classe Xml vous permet de transformer des tableaux en SimpleXMLElement ou en
objets DOMDocument, et de nouveau les transformer en tableaux.

Importer les données vers la classe Xml
=======================================

.. php:staticmethod:: build($input, array $options = [])

Vous pouvez utiliser ``Xml::build()`` pour construire des objets XML. Selon
votre paramètre ``$options``, cette méthode va retourner un objet
SimpleXMLElement (default) ou un objet DOMDocument. Vous pouvez utiliser
``Xml::build()`` pour construire les objets XML à partir d'une variété de
sources. Par exemple, vous pouvez charger le XML à partir de chaînes::

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

    $data = [
        'post' => [
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        ]
    ];
    $xml = Xml::build($data);

Si votre entrée est invalide, la classe Xml enverra une Exception::

    $xmlString = 'What is XML?';
    try {
        $xmlObject = Xml::build($xmlString); // Ici une Exception va être lancée
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ et
    `SimpleXML <http://php.net/simplexml>`_ implémentent différentes APIs.
    Assurez-vous d'utiliser les bonnes méthodes sur l'objet que vous
    requêtez à partir d'un Xml.

Transformer une Chaîne de Caractères XML en Tableau
===================================================

.. php:staticmethod:: toArray($obj);

Convertir des chaînes XML en tableaux est aussi facile avec la classe Xml. Par
défaut, vous obtiendrez un objet SimpleXml en retour::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

Si votre XML est invalide, cela enverra une
``Cake\Utility\Exception\XmlException``.

Transformer un tableau en une chaîne de caractères XML
======================================================

::

    $xmlArray = ['root' => ['child' => 'value']];
    // Vous pouvez aussi utiliser Xml::build().
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

Votre tableau ne doit avoir qu'un élément de "niveau supérieur" et il ne doit
pas être numérique. Si le tableau n'est pas dans le bon format, Xml va lancer
une Exception.
Des Exemples de tableaux invalides::

    // Niveau supérieur avec une clé numérique
    [
        ['key' => 'value']
    ];

    // Plusieurs clés au niveau supérieur
    [
        'key1' => 'première valeur',
        'key2' => 'autre valeur'
    ];

Par défaut les valeurs de tableau vont être sorties en tags XML, si vous
souhaitez définir les attributs ou les valeurs de texte, vous pouvez préfixer
les clés qui sont supposées être des attributs avec ``@``. Pour value text,
utilisez ``@`` en clé::

    $xmlArray = [
        'project' => [
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project'
        ]
    ];
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

Le contenu de ``$xmlString`` va être::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Nom du projet, en tag</name></project>

Utiliser des Namespaces
-----------------------

Pour utiliser les Namespaces XML, dans votre tableau vous devez créer une clé
avec le nom ``xmlns:`` vers un namespace générique ou avec le préfixe
``xmlns:`` dans un namespace personnalisé. Regardez les exemples::

    $xmlArray = [
        'root' => [
            'xmlns:' => 'https://cakephp.org',
            'child' => 'value'
        ]
    ];
    $xml1 = Xml::fromArray($xmlArray);

    $xmlArray(
        'root' => [
            'tag' => [
                'xmlns:pref' => 'https://cakephp.org',
                'pref:item' => [
                    'item 1',
                    'item 2'
                ]
            ]
        ]
    );
    $xml2 = Xml::fromArray($xmlArray);

La valeur de ``$xml1`` et ``$xml2`` sera, respectivement::

    <?xml version="1.0"?>
    <root xmlns="https://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

Créer un enfant
---------------

Après avoir créé votre document XML, vous utilisez seulement les interfaces
natives pour votre type de document à ajouter, à retirer, ou manipuler les
noeuds enfant::

    // Utilisation de SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // Utilisation de DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    Après avoir manipulé votre XML en utilisant SimpleXMLElement ou DomDocument
    vous pouvez utiliser ``Xml::toArray()`` sans problèmes.

.. meta::
    :title lang=fr: Xml
    :keywords lang=fr: tableau php,classe xml,objets xml,post xml,objet xml,string url,string data,xml parser,php 5,boulangerie,constructeur,php xml,cakephp,php file,unicorns,meth
