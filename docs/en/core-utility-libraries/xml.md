# Xml

`class` **Xml**

The Xml class was all refactored. PHP 5 implements a
[SimpleXML](https://www.php.net/simplexml) and
[DOMDocument](https://www.php.net/domdocument), so that CakePHP doesn't need to
re-implement an XML parser. The new XML class will transform an array into a
SimpleXMLElement or DOMDocument objects, and vice versa.

## Importing data to Xml class

In CakePHP 1.3 you can pass an array, XML as string, URL or file path to the
constructor of the Xml class in order to import data. In CakePHP 2.0 you can do
it by using `Xml::build()`. Unless the return value is a Xml object,
it will return a SimpleXMLElement or DOMDocument object (depending of your
options parameter - default is SimpleXMLElement). Below you get some samples on
how to import data from URL:

``` php
// First Load the Utility Class
App::uses('Xml', 'Utility');

// Old method:
$xml = new Xml('https://bakery.cakephp.org/articles.rss');

// New method using SimpleXML
$xml = Xml::build('https://bakery.cakephp.org/articles.rss');
// $xml now is a instance of SimpleXMLElement

// or
$xml = Xml::build('https://bakery.cakephp.org/articles.rss', array('return' => 'simplexml'));
// $xml now is a instance of SimpleXMLElement

// New method using DOMDocument
$xml = Xml::build('https://bakery.cakephp.org/articles.rss', array('return' => 'domdocument'));
// $xml now is a instance of DOMDocument
```

You can use `Xml::build()` to build XML objects from a variety of
sources. You can use XML to build objects from string data:

``` php
$text = '<?xml version="1.0" encoding="utf-8"?>
<post>
    <id>1</id>
    <title>Best post</title>
    <body> ... </body>
</post>';
$xml = Xml::build($text);
```

You can also build Xml objects from either local files, or remote files. Remote
files will be fetched with `HttpSocket`:

``` php
// local file
$xml = Xml::build('/home/awesome/unicorns.xml');

// remote file
$xml = Xml::build('https://bakery.cakephp.org/articles.rss');
```

You can also build Xml objects using an array:

``` php
$data = array(
    'post' => array(
        'id' => 1,
        'title' => 'Best post',
        'body' => ' ... '
    )
);
$xml = Xml::build($data);
```

If your input is invalid the Xml class will throw a Exception:

``` php
$xmlString = 'What is XML?'
try {
    $xmlObject = Xml::build($xmlString); // Here will throw a Exception
} catch (XmlException $e) {
    throw new InternalErrorException();
}
```

> [!NOTE]
> [DOMDocument](https://www.php.net/domdocument) and
> [SimpleXML](https://www.php.net/simplexml) implement different API's.
> Be sure to use the correct methods on the object you request from Xml.

## Transforming a XML string in array

Converting XML strings into arrays is simple with the Xml class as well. By
default you'll get a SimpleXml object back:

``` php
//Old method:
$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlObject = new Xml($xmlString);
$xmlArray = $xmlObject->toArray();

// New method:
$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlArray = Xml::toArray(Xml::build($xmlString));
```

If your XML is invalid it will throw an Exception.

## Transforming an array into a string of XML

``` php
// Old method:
$xmlArray = array('root' => array('child' => 'value'));
$xmlObject = new Xml($xmlArray, array('format' => 'tags'));
$xmlString = $xmlObject->toString();

// New method:
$xmlArray = array('root' => array('child' => 'value'));
$xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags')); // You can use Xml::build() too
$xmlString = $xmlObject->asXML();
```

Your array must have only one element in the "top level" and it can not be
numeric. If the array is not in this format, Xml will throw an Exception.
Examples of invalid arrays:

``` text
// Top level with numeric key
array(
    array('key' => 'value')
);

// Multiple keys in top level
array(
    'key1' => 'first value',
    'key2' => 'other value'
);
```

> [!WARNING]
> The default format option was changed from <span class="title-ref">attributes</span> to <span class="title-ref">tags</span>. This was
> done to make the Xml, that the Xml class generates, more compatible with XML
> in the wild. Be careful if you depend of this. In the new version you can
> create a mixed array with tags, attributes and value, just use format as
> tags (or do not say anything, because it is the default value) and prefix
> keys that are supposed to be attributes with <span class="title-ref">@</span>. For value text, use <span class="title-ref">@</span>
> as the key.

``` php
$xmlArray = array(
    'project' => array(
        '@id' => 1,
        'name' => 'Name of project, as tag',
        '@' => 'Value of project'
    )
);
$xmlObject = Xml::fromArray($xmlArray);
$xmlString = $xmlObject->asXML();
```

The content of `$xmlString` will be:

``` php
<?xml version="1.0"?>
<project id="1">Value of project<name>Name of project, as tag</name></project>
```

> [!NOTE]
> The structure of array was changed. Now the child must be in a sub-tree
> and not in the same tree. Moreover, the strings will not be changed by
> `Inflector`. See the sample below:

``` php
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
```

Both will result the XML below:

``` php
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
```

### Using Namespaces

To use XML Namespaces in your array, you must create a key with name `xmlns:`
to generic namespace or input the prefix `xmlns:` in a custom namespace. See
the samples:

``` php
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
```

The value of `$xml1` and `$xml2` will be, respectively:

``` php
<?xml version="1.0"?>
<root xmlns="https://cakephp.org"><child>value</child>


<?xml version="1.0"?>
<root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>
```

### Creating a child

The Xml class of CakePHP 2.0 doesn't provide the manipulation of content, this
must be done using SimpleXMLElement or DOMDocument. But CakePHP has you covered.
Below you see the steps for creating a child node with CakePHP:

``` php
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
```

> [!TIP]
> After manipulating your XML using SimpleXMLElement or DomDocument you can
> use `Xml::toArray()` without problem.

## Xml API

A factory and conversion class for creating SimpleXml or DOMDocument objects
from a number of sources including strings, arrays and remote URLs.

`static` Xml::**build**($input, $options = array())

Initialize SimpleXMLElement or DOMDocument from a given XML string, file
path, URL or array

Building XML from a string:

``` php
$xml = Xml::build('<example>text</example>');
```

Building XML from string (output DOMDocument):

``` php
$xml = Xml::build('<example>text</example>', array('return' => 'domdocument'));
```

Building XML from a file path:

``` php
$xml = Xml::build('/path/to/an/xml/file.xml');
```

Building from a remote URL:

``` php
$xml = Xml::build('http://example.com/example.xml');
```

Building from an array:

``` php
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
```

When building XML from an array ensure that there is only one top level
element.

`static` Xml::**toArray**($obj)

Convert either a SimpleXml or DOMDocument object into an array.
