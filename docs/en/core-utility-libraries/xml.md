# Xml

`class` **Xml**

PHP provides [SimpleXML](https://www.php.net/simplexml) and
[DOMDocument](https://www.php.net/domdocument), so CakePHP doesn't need to
implement its own XML parser. The Xml class transforms an array into
SimpleXMLElement or DOMDocument objects, and vice versa.

## Importing data to Xml class

You can import data with `Xml::build()`. Depending on the `return` option, it
returns a SimpleXMLElement (the default) or a DOMDocument object. Below you get
some samples on how to import data from a URL:

``` php
// Using SimpleXML
$xml = Xml::build('https://example.com/articles.rss');
// $xml now is a instance of SimpleXMLElement

// or
$xml = Xml::build('https://example.com/articles.rss', ['return' => 'simplexml']);
// $xml now is a instance of SimpleXMLElement

// Using DOMDocument
$xml = Xml::build('https://example.com/articles.rss', ['return' => 'domdocument']);
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
$xml = Xml::build('https://example.com/articles.rss');
```

> [!WARNING]
> A string that does not contain `<` is treated as a file path or URL, and the
> file or URL is read. When you pass user-supplied data to `Xml::build()`, set
> `'readFile' => false` so that files and URLs are never read:
>
> ``` php
> $xml = Xml::build($this->request->data['xml'], ['readFile' => false]);
> ```

You can also build Xml objects using an array:

``` php
$data = [
    'post' => [
        'id' => 1,
        'title' => 'Best post',
        'body' => ' ... ',
    ],
];
$xml = Xml::build($data);
```

If your input is invalid the Xml class will throw a Exception:

``` php
$xmlString = 'What is XML?';
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

Converting XML strings into arrays is simple with the Xml class as well:

``` php
$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlArray = Xml::toArray(Xml::build($xmlString));
```

If your XML is invalid it will throw an Exception.

## Transforming an array into a string of XML

``` php
$xmlArray = ['root' => ['child' => 'value']];
$xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']); // You can use Xml::build() too
$xmlString = $xmlObject->asXML();
```

Your array must have only one element in the "top level" and it can not be
numeric. If the array is not in this format, Xml will throw an Exception.
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

The default format is `tags`: each array key becomes a child element. You can
create a mixed array with tags, attributes and value. Prefix keys that are
supposed to be attributes with `@`, and use `@` as the key for the text value:

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

``` xml
<?xml version="1.0"?>
<project id="1">Value of project<name>Name of project, as tag</name></project>
```

Child elements must be nested in a sub-tree of their parent, and keys are used
as element names as they are (they are not changed by `Inflector`). Repeated
elements are written as a numerically indexed array. See the sample below:

``` php
$data = [
    'projects' => [
        'project' => [
            [
                'id' => 1, 'title' => 'Project 1',
                'industry' => ['id' => 1, 'name' => 'Industry 1'],
            ],
            [
                'id' => 2, 'title' => 'Project 2',
                'industry' => ['id' => 2, 'name' => 'Industry 2'],
            ],
        ],
    ],
];
```

This will result in the XML below:

``` xml
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
$xmlArray = [
    'root' => [
        'xmlns:' => 'https://cakephp.org',
        'child' => 'value',
    ],
];
$xml1 = Xml::fromArray($xmlArray);

$xmlArray = [
    'root' => [
        'tag' => [
            'xmlns:pref' => 'https://cakephp.org',
            'pref:item' => [
                'item 1',
                'item 2',
            ],
        ],
    ],
];
$xml2 = Xml::fromArray($xmlArray);
```

The value of `$xml1` and `$xml2` will be, respectively:

``` xml
<?xml version="1.0"?>
<root xmlns="https://cakephp.org"><child>value</child></root>


<?xml version="1.0"?>
<root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>
```

### Creating a child

The Xml class doesn't provide the manipulation of content, this
must be done using SimpleXMLElement or DOMDocument. Below you see the steps for
creating a child node:

``` php
// Using SimpleXML
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal);
$xml->addChild('young', 'new value');

// Using DOMDocument
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
$child = $xml->createElement('young', 'new value');
$xml->firstChild->appendChild($child);
```

> [!TIP]
> After manipulating your XML using SimpleXMLElement or DomDocument you can
> use `Xml::toArray()` without problem.

## Xml API

A factory and conversion class for creating SimpleXml or DOMDocument objects
from a number of sources including strings, arrays and remote URLs.

`static` Xml::**build**($input, $options = [])

Initialize SimpleXMLElement or DOMDocument from a given XML string, file
path, URL or array. The following options are available:

- `return` Either `'simplexml'` (default) to return a SimpleXMLElement or
  `'domdocument'` to return a DOMDocument.
- `loadEntities` Whether to load `<!ENTITY` definitions. Defaults to `false`
  for security reasons. Only enable it for XML from trusted sources.
- `readFile` Whether a local file path or a URL is read. Defaults to `true`.
  Set it to `false` when the input may come from users; an `XmlException` is
  then thrown for a file path or URL.
- `parseHuge` Enables `LIBXML_PARSEHUGE`. Defaults to `true`.

::: pieceofcake2
Since v2.12.3, `'readFile' => false` also blocks URLs. Earlier versions (and the
original CakePHP 2.6.6 and later) still fetched `https://` URLs; see
[Security Fixes](/security/fixes#xml-build-ssrf).
:::

When the input is an array, the options of `Xml::fromArray()` (such as
`format` and `pretty`) can also be passed.

Building XML from a string:

``` php
$xml = Xml::build('<example>text</example>');
```

Building XML from string (output DOMDocument):

``` php
$xml = Xml::build('<example>text</example>', ['return' => 'domdocument']);
```

Building XML from a file path:

``` php
$xml = Xml::build('/path/to/an/xml/file.xml');
```

Building from a remote URL:

``` php
$xml = Xml::build('https://example.com/example.xml');
```

Building from an array:

``` php
$value = [
    'tags' => [
        'tag' => [
            [
                'id' => '1',
                'name' => 'defect',
            ],
            [
                'id' => '2',
                'name' => 'enhancement',
            ],
        ],
    ],
];
$xml = Xml::build($value);
```

When building XML from an array ensure that there is only one top level
element.

`static` Xml::**toArray**($obj)

Convert either a SimpleXml or DOMDocument object into an array.
