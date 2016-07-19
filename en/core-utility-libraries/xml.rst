Xml
###

.. php:class:: Xml

The Xml class was all refactored. PHP 5 implements a
`SimpleXML <http://php.net/simplexml>`_ and
`DOMDocument <http://php.net/domdocument>`_, so that CakePHP don't need to
re-implement an XML parser. The new XML class will transform an array
into a SimpleXMLElement or DOMDocument objects, and vice versa.

Importing data to Xml class
===========================

In CakePHP 1.3 you can pass an array, XML as string, URL or file path to the
constructor of the Xml class in order to import data. In CakePHP 2.0 you can do it by using
:php:meth:`Xml::build()`. Unless the return value is a Xml object, it will return a
SimpleXMLElement or DOMDocument object (depending of your options parameter -
default is SimpleXMLElement). Below you get some samples on how to import data from URL::

    //First Load the Utility Class
    App::uses('Xml', 'Utility');

    // Old method:
    $xml = new Xml('http://bakery.cakephp.org/articles.rss');

    // New method using SimpleXML
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss');
    // $xml now is a instance of SimpleXMLElement

    //or
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'simplexml'));
    // $xml now is a instance of SimpleXMLElement

    // New method using DOMDocument
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'domdocument'));
    // $xml now is a instance of DOMDocument

You can use :php:meth:`Xml::build()` to build XML objects from a variety of sources. You
can use XML to build objects from string data::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

You can also build Xml objects from either local files, or remote files. Remote
files will be fetched with :php:class:`HttpSocket`::

    // local file
    $xml = Xml::build('/home/awesome/unicorns.xml');

    // remote file
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

If your input is invalid the Xml class will throw a Exception::

    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // Here will throw a Exception
    } catch (XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ and
    `SimpleXML <http://php.net/simplexml>`_ implement different API's.
    Be sure to use the correct methods on the object you request from Xml.

Transforming a XML string in array
==================================

Converting XML strings into arrays is simple with the Xml class as well. By
default you'll get a SimpleXml object back::

    //Old method:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlObject = new Xml($xmlString);
    $xmlArray = $xmlObject->toArray();

    // New method:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

If your XML is invalid it will throw an Exception.

Transforming an array into a string of XML
==========================================

::

    // Old method:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = new Xml($xmlArray, array('format' => 'tags'));
    $xmlString = $xmlObject->toString();

    // New method:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags')); // You can use Xml::build() too
    $xmlString = $xmlObject->asXML();

Your array must have only one element in the "top level" and it can not be
numeric. If the array is not in this format, Xml will throw an Exception.
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

.. warning::

    The default format option was changed from `attributes` to `tags`. This was
    done to make the Xml, that the Xml class generates, more compatible with XML
    in the wild. Be careful if you depend of this. In the new version you can
    create a mixed array with tags, attributes and value, just use format as
    tags (or do not say anything, because it is the default value) and prefix
    keys that are supposed to be attributes with `@`. For value text, use `@`
    as the key.

::

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

.. note::

    The structure of array was changed. Now the child must be in a sub-tree
    and not in the same tree. Moreover, the strings will not be changed by
    :php:class:`Inflector`. See the sample below:

::

    $oldArray = array(
        'Projects' => array(
            array(
                'Project' => array('id' => 1, 'title' => 'Project 1'),
                'Industry' => array('id' => 1, 'name' => 'Industry 1')
            ),
            array(
                'Project' => array('id' => 2, 'title' => 'Project 2'),
                'Industry' => array('id' => 2, 'name' => 'Industry 2')
            )
        )
    );

    $newArray = array(
        'projects' => array(
            'project' => array(
                array(
                    'id' => 1, 'title' => 'Project 1',
                    'industry' => array('id' => 1, 'name' => 'Industry 1')
                ),
                array(
                    'id' => 2, 'title' => 'Project 2',
                    'industry' => array('id' => 2, 'name' => 'Industry 2')
                )
            )
        )
    );

Both will result the XML below::

    <?xml version="1.0"?>
    <projects>
        <project>
            <id>1</id>
            <title>Project 1</title>
            <industry>
                <id>1</id>
                <name>Industry 1</name>
            </industry>
        </project>
        <project>
            <id>2</id>
            <title>Project 2</title>
            <industry>
                <id>2</id>
                <name>Industry 2</name>
            </industry>
        </project>
    </projects>

Using Namespaces
----------------

To use XML Namespaces in your array, you must create a key with name ``xmlns:`` to
generic namespace or input the prefix ``xmlns:`` in a custom namespace. See the
samples::

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

Creating a child
----------------

The Xml class of CakePHP 2.0 doesn't provide the manipulation of content, this
must be done using SimpleXMLElement or DOMDocument. But sweet CakePHP got you covered. Below you see the steps for creating a child node with CakePHP::

    // CakePHP 1.3
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = new Xml($myXmlOriginal, array('format' => 'tags'));
    $xml->children[0]->createNode('young', 'new value');

    // CakePHP 2.0 - Using SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // CakePHP 2.0 - Using DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, array('return' => 'domdocument'));
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    After manipulating your XML using SimpleXMLElement or DomDocument you can use
    :php:meth:`Xml::toArray()` without problem.


Xml API
=======

A factory and conversion class for creating SimpleXml or DOMDocument objects
from a number of sources including strings, arrays and remote URLs.

.. php:staticmethod:: build($input, $options = array())

    Initialize SimpleXMLElement or DOMDocument from a given XML string, file
    path, URL or array

    Building XML from a string::

        $xml = Xml::build('<example>text</example>');

    Building XML from string (output DOMDocument)::

        $xml = Xml::build('<example>text</example>', array('return' => 'domdocument'));

    Building XML from a file path::

        $xml = Xml::build('/path/to/an/xml/file.xml');

    Building from a remote URL::

        $xml = Xml::build('http://example.com/example.xml');

    Building from an array::

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

    When building XML from an array ensure that there is only one top level element.

.. php:staticmethod:: toArray($obj)

    Convert either a SimpleXml or DOMDocument object into an array.


.. meta::
    :title lang=en: Xml
    :keywords lang=en: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
