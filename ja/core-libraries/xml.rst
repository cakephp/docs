Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

..
    The Xml class allows you to transform arrays into SimpleXMLElement or
    DOMDocument objects, and back into arrays again.

Xmlクラスを利用して、 配列から SimpleXMLElement もしくは DOMDocument オブジェクトに変換を、また配列に戻すことを可能にします。

..
    Importing Data to Xml Class

データをXmlクラスにインポートする
==================================

.. php:staticmethod:: build($input, array $options = [])

..
    You can load XML-ish data using ``Xml::build()``. Depending on your
    ``$options`` parameter, this method will return a SimpleXMLElement (default)
    or DOMDocument object. You can use ``Xml::build()`` to build XML
    objects from a variety of sources.  For example, you can load XML from
    strings::

``Xml::build()`` を利用することで、XMLライクなデータの読み込みが可能となります。
``$options`` により、このメソッドは SimpleXMLElement (デフォルト) もしくは DOMDocument を返却します。
様々なソースから XML オブジェクトのビルドに ``Xml::build()`` が利用できます。
例えば、stringからXMLをロードできます。
::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

..
    You can also build Xml objects from local files::

ローカルファイルから Xml オブジェクトにビルドも可能です。

..
    // Local file
    $xml = Xml::build('/home/awesome/unicorns.xml');

::

    // ローカルファイル
    $xml = Xml::build('/home/awesome/unicorns.xml');

..
    You can also build Xml objects using an array::

配列を利用して Xml オブジェクトのビルドも可能です。
::

    $data = [
        'post' => [
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        ]
    ];
    $xml = Xml::build($data);

..
    If your input is invalid, the Xml class will throw an exception::

もし入力が不正であれば、 Xml クラスは例外を投げます。

..
    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // Here will throw an exception
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

::

    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // ここで例外が投げられます
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

..
    `DOMDocument <http://php.net/domdocument>`_ and
    `SimpleXML <http://php.net/simplexml>`_ implement different API's.
    Be sure to use the correct methods on the object you request from Xml.

.. note::

    `DOMDocument <http://php.net/domdocument>`_ と `SimpleXML <http://php.net/simplexml>`_ は異なる API を実装します。
    Xml によって返却されるオブジェクトの正しいメソッドを利用しているか確認してください。

..
    Transforming a XML String in Array

XML文字列を配列に変換する
==================================

.. php:staticmethod:: toArray($obj);

..
    Converting XML strings into arrays is simple with the Xml class as well. By
    default you'll get a SimpleXml object back::

XMLテキストを配列に変換するのは、 Xml クラスと同様にシンプルです。
標準で SimpleXml オブジェクトから受け取ります。

::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

..
    If your XML is invalid a ``Cake\Utility\Exception\XmlException`` will be raised.

もし XML が不正の場合、 ``Cake\Utility\Exception\XmlException`` が起こります。

..
    Transforming an Array into a String of XML

配列をXML文字列に変換する
==========================================

..
    $xmlArray = ['root' => ['child' => 'value']];
    // You can use Xml::build() too.
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

::

    $xmlArray = ['root' => ['child' => 'value']];
    // Xml::build() を使うこともできます
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

..
    Your array must have only one element in the "top level" and it can not be
    numeric. If the array is not in this format, Xml will throw an exception.
    Examples of invalid arrays::

配列の "トップレベル" 要素はたった一つであり、それは数字ではいけません。
もし配列がこのフォーマットに従っていない時、Xmlクラスは例外を投げます。
不正な配列の例です。

..
    // Top level with numeric key
    [
        ['key' => 'value']
    ];

    // Multiple keys in top level
    [
        'key1' => 'first value',
        'key2' => 'other value'
    ];

::

    // トップレベルのキーが数字
    [
        ['key' => 'value']
    ];

    // トップレベルに複数のキーがある
    [
        'key1' => 'first value',
        'key2' => 'other value'
    ];

..
    By default array values will be output as XML tags. If you want to define
    attributes or text values you can prefix the keys that are supposed to be
    attributes with ``@``. For value text, use ``@`` as the key::

標準では、配列の値がXMLのタグとして出力されます。
属性やテキストの値を定義したければ、接頭辞として許されている ``@`` をキーに付与します。
値のテキストは、 ``@`` をキーにします。

::

    $xmlArray = [
        'project' => [
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project'
        ]
    ];
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

..
    The content of ``$xmlString`` will be::

``$xmlString`` の内容は以下になります。

::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>


..
    Using Namespaces

名前空間を利用する
-------------------

..
    To use XML Namespaces, create a key in your array with the name ``xmlns:``
    in a generic namespace or input the prefix ``xmlns:`` in a custom namespace. See
    the samples::

XML の名前空間を利用するには、配列のキーに包括的な名前空間である ``xmlns:`` を使用するか、
独自の名前空間に ``xmlns:`` を接頭語として加えたキーを使用して配列を作成します。

::

    $xmlArray = [
        'root' => [
            'xmlns:' => 'http://cakephp.org',
            'child' => 'value'
        ]
    ];
    $xml1 = Xml::fromArray($xmlArray);

    $xmlArray(
        'root' => [
            'tag' => [
                'xmlns:pref' => 'http://cakephp.org',
                'pref:item' => [
                    'item 1',
                    'item 2'
                ]
            ]
        ]
    );
    $xml2 = Xml::fromArray($xmlArray);

..
    The value of ``$xml1`` and ``$xml2`` will be, respectively::

``$xml1`` と ``$xml2`` の値はそれぞれ以下になります。

::

    <?xml version="1.0"?>
    <root xmlns="http://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="http://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

..
    Creating a Child

小要素を作成
----------------

..
    After you have created your XML document, you just use the native interfaces for
    your document type to add, remove, or manipulate child nodes::

XML 文章を作成したのち、その文章に小要素を追加したり取り除いたり操作するには、単純に標準の実装を利用します。

..
    // Using SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // Using DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

::

    // SimpleXML を利用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // DOMDocument を利用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

..
    After manipulating your XML using SimpleXMLElement or DomDocument you can use
    ``Xml::toArray()`` without a problem.

.. tip::

    SimpleXMLElement や DomDocument を利用して XML を操作したのちは、 ``Xml::toArray()`` を問題なく利用できます。

.. meta::
    :title lang=ja: Xml
    :keywords lang=ja: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
