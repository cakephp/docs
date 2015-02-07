Xml
###

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:namespace:: Cake\Utility

.. php:class:: Xml

The Xml class allows you to easily transform arrays into SimpleXMLElement or
DOMDocument objects, and back into arrays again.


Importing Data to Xml Class
===========================

.. php:staticmethod:: build($input, $options = [])

You can load XML-ish data do it using ``Xml::build()``. This method will return
a SimpleXMLElement or DOMDocument object (depending of your options parameter
- default is SimpleXMLElement). Below the samples how to import data from URL::

    // First Load the Utility Class
    use Cake\Utility\Xml;

    // Load XML from a URL.
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss');
    // $xml now is a instance of SimpleXMLElement

    // Or
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'simplexml'));
    // $xml now is a instance of SimpleXMLElement

    // Load XML and get a DOMDocument instance back.
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'domdocument'));
    // $xml now is a instance of DOMDocument

You can use ``Xml::build()`` to build XML objects from a variety of sources.
For example, you can load XML from strings::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

You can also build Xml objects from either local files, or remote files. Remote
files will be fetched with :doc:`/core-utility-libraries/httpclient`::

    // Local file
    $xml = Xml::build('/home/awesome/unicorns.xml');

    // Remote file
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss');

You can also build Xml objects using an array::

    $data = array(
        'post' => array(
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        )
    );
    $xml = Xml::build($data);

If your input is invalid the Xml class will throw an Exception::

    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // Here will throw a Exception
    } catch (\Cake\Utility\Error\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ and
    `SimpleXML <http://php.net/simplexml>`_ implement different API's.
    Be sure to use the correct methods on the object you request from Xml.


Transforming a XML String in Array
==================================

.. php:staticmethod:: toArray($xml);

Converting XML strings into arrays is simple with the Xml class as well. By
default you'll get a SimpleXml object back::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

If your XML is invalid a ``Cake\Utility\Error\XmlException`` will be raised.

Transforming an Array into a String of XML
==========================================

::

    $xmlArray = array('root' => array('child' => 'value'));
    // You can use Xml::build() too.
    $xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags'));
    $xmlString = $xmlObject->asXML();

Your array must have only one element in the "top level" and it can not be
numeric. If the array is not in this format, Xml will throw a Exception.
Examples of invalid arrays::

    // Top level with numeric key
    array(
        array('key' => 'value')
    );

    // Multiple keys in top level
    array(
        'key1' => 'first value',
        'key2' => 'other value'
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


Using Namespaces
----------------

To use XML Namespaces, in your array you must create a key with name ``xmlns:``
to generic namespace or input the prefix ``xmlns:`` in a custom namespace. See
the samples::

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

The value of ``$xml1`` and ``$xml2`` will be, respectively::

    <?xml version="1.0"?>
    <root xmlns="http://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="http://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

Creating a Child
----------------

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

    After manipulate your XML using SimpleXMLElement or DomDocument you can use
    ``Xml::toArray()`` without a problem.

.. meta::
    :title lang=es: Xml
    :keywords lang=es: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
