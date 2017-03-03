Xml
###

.. php:class:: Xml

La classe Xml a été reconstruite. Comme PHP 5 a
`SimpleXML <https://secure.php.net/simplexml>`_ et
`DOMDocument <https://secure.php.net/domdocument>`_, CakePHP ne nécéssite pas de
ré-implémenter un parser XML. La nouvelle classe XML va fondamentalement
transformer un tableau en objets SimpleXMLElement ou DOMDocument, et vice
versa.

Importer les données vers la classe Xml
=======================================

Dans CakePHP 1.3, vous pouviez passez les tableaux, les XML et les chaînes de
caractère, les URL ou les chemins de fichier vers le constructeur de la classe
Xml pour importer les données. Dans CakePHP 2.0, vous pouvez le faire en
utilisant :php:meth:`Xml::build()`. A moins que le retour soit un objet Xml,
cela retournera un objet SimpleXMLElement ou DOMDocument (selon votre paramètre
options - par défault SimpleXMLElement). Ci-dessous les échantillons sur la
façon d'importer des données depuis une URL::

    //D'abord charger la Classe Utility
    App::uses('Xml', 'Utility');

    // Vieille méthode:
    $xml = new Xml('https://bakery.cakephp.org/articles.rss');

    // Nouvelle méthode en utilisant SimpleXML
    $xml = Xml::build('https://bakery.cakephp.org/articles.rss');
    // $xml est maintenant une instance de SimpleXMLElement

    //ou
    $xml = Xml::build('https://bakery.cakephp.org/articles.rss', array('return' => 'simplexml'));
    // $xml est maintenant une instance de SimpleXMLElement

    // Nouvelle méthode en utilisant DOMDocument
    $xml = Xml::build('https://bakery.cakephp.org/articles.rss', array('return' => 'domdocument'));
    // $xml est maintenant une instance de DOMDocument

Vous pouvez utiliser :php:meth:`Xml::build()` pour construire les objets XML
à partir de diverses sources. Vous pouvez utiliser XML pour construire
des objets à partir d'une chaîne de caractère::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Meilleur post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

Vous pouvez aussi construire des objets Xml à partir de fichiers locaux,
ou de fichiers distants. Les fichiers distants seront récupérés avec
:php:class:`HttpSocket`::

    // fichier local
    $xml = Xml::build('/home/awesome/unicorns.xml');

    // fichier distant
    $xml = Xml::build('https://bakery.cakephp.org/articles.rss');

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
        $xmlObject = Xml::build($xmlString); // Ici enverra une Exception
    } catch (XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <https://secure.php.net/domdocument>`_ et
    `SimpleXML <https://secure.php.net/simplexml>`_ implement different API's.
    Assurez vous d'utiliser les bonnes méthodes sur l'objet que vous
    requêtez à partir d'un Xml.

Transformer une chaîne de caractères XML en tableau
===================================================

Convertir des chaînes XML en tableaux est aussi facile avec la classe Xml. Par
défaut, vous obtiendrez un objet SimpleXml en retour::

    //Vieille méthode:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlObject = new Xml($xmlString);
    $xmlArray = $xmlObject->toArray();

    // Nouvelle méthode:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

Si votre XML est invalide, cela enverra une Exception.

Transformer un tableau en une chaîne de caractères XML
======================================================

::

    // Vieille méthode:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = new Xml($xmlArray, array('format' => 'tags'));
    $xmlString = $xmlObject->toString();

    // Nouvelle méthode:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags')); // You can use Xml::build() too
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

.. warning::

    L'option format par défault a été changée de `attributes` pour `tags`. Cela
    a été fait pour rendre le Xml que la classe Xml génère plus compatible avec
    le Xml dans la nature. Attention si vous dépendez de celui-ci. Dans la
    nouvelle version, vous pouvez créer un tableau mixte avec des tags, des
    attributs et valeurs, utilisez juste le format en tags (ou ne dîtes rien,
    car c'est la valeur par défaut) et les clés préfixées qui sont sensées
    être des attributs avec `@`. Pour une valeur texte, mettez la clé à `@`.

::

    $xmlArray = array(
        'projet' => array(
            '@id' => 1,
            'name' => 'Nom du projet, en tag',
            '@' => 'Valeur du projet'
        )
    );
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

Le contenu de ``$xmlString`` sera::

    <?xml version="1.0"?>
    <project id="1">Valeur du projet<name>Nom du projet, en tag</name></project>

.. note::

    La structure des tableaux a été changée. Maintenant l'enfant doit avoir
    un sous-arbre et ne pas être dans le même arbre. En plus, les chaînes
    de caractères ne seront pas changées par :php:class:`Inflector`. Regardez
    l'exemple ci-dessous:

::

    $oldArray = array(
        'Projets' => array(
            array(
                'Projet' => array('id' => 1, 'title' => 'Projet 1'),
                'Industry' => array('id' => 1, 'name' => 'Industry 1')
            ),
            array(
                'Projet' => array('id' => 2, 'title' => 'Projet 2'),
                'Industry' => array('id' => 2, 'name' => 'Industry 2')
            )
        )
    );

    $newArray = array(
        'projets' => array(
            'projet' => array(
                array(
                    'id' => 1, 'title' => 'Projet 1',
                    'industry' => array('id' => 1, 'name' => 'Industry 1')
                ),
                array(
                    'id' => 2, 'title' => 'Projet 2',
                    'industry' => array('id' => 2, 'name' => 'Industry 2')
                )
            )
        )
    );

Les deux engendreront le XML ci-dessous::

    <?xml version="1.0"?>
    <projets>
        <projet>
            <id>1</id>
            <title>Projet 1</title>
            <industry>
                <id>1</id>
                <name>Industry 1</name>
            </industry>
        </projet>
        <projet>
            <id>2</id>
            <title>Projet 2</title>
            <industry>
                <id>2</id>
                <name>Industry 2</name>
            </industry>
        </projet>
    </projets>

Utiliser des Namespaces
-----------------------

Pour utiliser les Namespaces XML, dans votre tableau vous devez créer une clé
avec le nom ``xmlns:`` vers un namespace générique ou avec le préfixe
``xmlns:`` dans un namespace personnalisé. Regardez les exemples::

    $xmlArray = array(
        'root' => array(
            'xmlns:' => 'https://cakephp.org',
            'child' => 'value'
        )
    );
    $xml1 = Xml::fromArray($xmlArray);

    $xmlArray(
        'root' => array(
            'tag' => array(
                'xmlns:pref' => 'https://cakephp.org',
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
    <root xmlns="https://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

Créer un enfant
---------------

La classe Xml de CakePHP 2.0 ne fournit pas la manipulation du contenu, cela
doit être fait en utilisant SimpleXMLElement ou DOMDocument. Mais, comme
CakePHP est trop sympa, ci-dessous vous avez les étapes pour créer un noeud
enfant::

    // CakePHP 1.3
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = new Xml($myXmlOriginal, array('format' => 'tags'));
    $xml->children[0]->createNode('young', 'new value');

    // CakePHP 2.0 - En utilisant SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // CakePHP 2.0 - En utilisant DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, array('return' => 'domdocument'));
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    Après avoir manipulé votre XML en utilisant SimpleXMLElement ou DomDocument
    vous pouvez utiliser :php:meth:`Xml::toArray()` sans problèmes.

API de Xml
==========

Une classe usine de conversion pour créer des objets SimpleXML ou DOMDocument
à partir d'un certain nombre de sources, y compris des chaînes, des tableaux
et des URLs distantes.

.. php:staticmethod:: build($input, $options = array())

    Initialisez SimpleXMLElement ou DOMDocument à partir d'une chaîne de
    caractère XML donnée, d'un chemin de fichier, d'une URL ou d'un
    tableau.

    Construire du XML à partir d'une chaîne de caractères::

        $xml = Xml::build('<example>text</example>');

    Construire du XML à partir d'une chaîne de caractères (sortie DOMDocument)::

        $xml = Xml::build('<example>text</example>', array('return' => 'domdocument'));

    Construire du XML à partir d'un chemin de fichier::

        $xml = Xml::build('/path/to/an/xml/file.xml');

    Construire à partir d'une URL distante::

        $xml = Xml::build('http://example.com/example.xml');

    Construire à partir d'un tableau::

        $value = array(
            'tags' => array(
                'tag' => array(
                    array(
                        'id' => '1',
                        'name' => 'defect'
                    ),
                    array(
                        'id' => '2',
                        'name' => 'enhancement'
                )
                )
            )
        );
        $xml = Xml::build($value);

    Quand on construit du XML à partir d'un tableau, assurez-vous qu'il n'y a
    qu'un seul élément de niveau supérieur.

.. php:staticmethod:: toArray($obj)

    Convertit soit un objet SimpleXml, soit DOMDocument en un tableau.


.. meta::
    :title lang=fr: Xml
    :keywords lang=fr: tableau php,classe xml,objets xml,post xml,objet xml,string url,string data,xml parser,php 5,boulangerie,constructeur,php xml,cakephp,php file,unicorns,meth
