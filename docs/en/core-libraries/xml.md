# Xml

`class` Cake\\Utility\\**Xml**

The Xml class allows you to transform arrays into SimpleXMLElement or
DOMDocument objects, and back into arrays again.

## Loading XML documents

`static` Cake\\Utility\\Xml::**build**($input, array $options = [])

You can load XML-ish data using `Xml::build()`. Depending on your
`$options` parameter, this method will return a SimpleXMLElement (default)
or DOMDocument object. You can use `Xml::build()` to build XML
objects from a variety of sources. For example, you can load XML from
strings:

``` php
$text = '<?xml version="1.0" encoding="utf-8"?>
<post>
    <id>1</id>
    <title>Best post</title>
    <body> ... </body>
</post>';
$xml = Xml::build($text);
```

You can also build Xml objects from local files by overriding the default option:

``` php
// Local file
$xml = Xml::build('/home/awesome/unicorns.xml', ['readFile' => true]);
```

You can also build Xml objects using an array:

``` php
$data = [
    'post' => [
        'id' => 1,
        'title' => 'Best post',
        'body' => ' ... ',
    ]
];
$xml = Xml::build($data);
```

If your input is invalid, the Xml class will throw an exception:

``` php
$xmlString = 'What is XML?';
try {
    $xmlObject = Xml::build($xmlString); // Here will throw an exception
} catch (\Cake\Utility\Exception\XmlException $e) {
    throw new InternalErrorException();
}
```

> [!NOTE]
> [DOMDocument](https://php.net/domdocument) and
> [SimpleXML](https://php.net/simplexml) implement different APIs.
> Be sure to use the correct methods on the object you request from Xml.

## Loading HTML documents

HTML documents can be parsed into `SimpleXmlElement` or `DOMDocument`
objects with `loadHtml()`:

``` php
$html = Xml::loadHtml($htmlString, ['return' => 'domdocument']);
```

By default entity loading and huge document parsing are disabled. These modes
can be enabled with the `loadEntities` and `parseHuge` options respectively.

## Transforming a XML String in Array

`static` Cake\\Utility\\Xml::**toArray**($obj)

Converting XML strings into arrays is simple with the Xml class as well. By
default you'll get a SimpleXml object back:

``` php
$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlArray = Xml::toArray(Xml::build($xmlString));
```

If your XML is invalid a `Cake\Utility\Exception\XmlException` will be raised.

## Transforming an Array into a String of XML

``` php
$xmlArray = ['root' => ['child' => 'value']];
// You can use Xml::build() too.
$xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
$xmlString = $xmlObject->asXML();
```

Your array must have only one element in the "top level" and it can not be
numeric. If the array is not in this format, Xml will throw an exception.
Examples of invalid arrays:

``` text
// Top level with numeric key
[
    ['key' => 'value']
];

// Multiple keys in top level
[
    'key1' => 'first value',
    'key2' => 'other value'
];
```

By default array values will be output as XML tags. If you want to define
attributes or text values you can prefix the keys that are supposed to be
attributes with `@`. For value text, use `@` as the key:

``` php
$xmlArray = [
    'project' => [
        '@id' => 1,
        'name' => 'Name of project, as tag',
        '@' => 'Value of project',
    ],
];
$xmlObject = Xml::fromArray($xmlArray);
$xmlString = $xmlObject->asXML();
```

The content of `$xmlString` will be:

``` php
<?xml version="1.0"?>
<project id="1">Value of project<name>Name of project, as tag</name></project>
```

### Using Namespaces

To use XML Namespaces, create a key in your array with the name `xmlns:`
in a generic namespace or input the prefix `xmlns:` in a custom namespace. See
the samples:

``` php
$xmlArray = [
    'root' => [
        'xmlns:' => 'https://cakephp.org',
        'child' => 'value',
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
```

The value of `$xml1` and `$xml2` will be, respectively:

``` php
<?xml version="1.0"?>
<root xmlns="https://cakephp.org"><child>value</child>

<?xml version="1.0"?>
<root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>
```

### Creating a Child

After you have created your XML document, you just use the native interfaces for
your document type to add, remove, or manipulate child nodes:

``` php
// Using SimpleXML
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal);
$xml->root->addChild('young', 'new value');

// Using DOMDocument
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
$child = $xml->createElement('young', 'new value');
$xml->firstChild->appendChild($child);
```

> [!TIP]
> After manipulating your XML using SimpleXMLElement or DomDocument you can
> use `Xml::toArray()` without a problem.
