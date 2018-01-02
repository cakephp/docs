Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

Xml类充许将数组转换成 ``SimpleXMLElement`` 或者 ``DOMDocument`` 对象，并且可以转回数组。

创建XML对象
===========

.. php:staticmethod:: build($input, array $options = [])

你可使用Xml::build() 载入XML-ish数据。取决于你 ``$options`` 的参数，这个方法允许你返回一个 ``SimpleXMLElement (default) or DOMDocument`` 对象，在各种数据源中，你可使用 ``Xml::build()`` 去创建一个XML对象。例如，你可以通过下面的设置创建XML::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

你也可以通过本地文件创建Xml对象::

    //本地文件
    $xml = Xml::build('/home/awesome/unicorns.xml');

你也可以通可一个数组创建Xml对象::

    $data = [
        'post' => [
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        ]
    ];
    $xml = Xml::build($data);

如果你的输入参数是无效的，Xml类会抛出一个异常::

    $xmlString = 'What is XML?';
    try {
        $xmlObject = Xml::build($xmlString); // 这儿会抛出一个异常
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    DOMDocument 和 SimpleXML 实现了不同的API's。你从XML请求的对象，一定要使用正确的方法。

把Xml字符串转换成数组
=====================

.. php:staticmethod:: toArray($obj);

用Xml类把Xml字符串转换成数组是非简单的。默认你将获得返回值是SimpleXml对象::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

如果你的XML是无效的将会执行 ``Cake\Utility\Exception\XmlException`` 异常类。

把数组转换成Xml
===============

::

    $xmlArray = ['root' => ['child' => 'value']];
    //你也可以使用 Xml::build().
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

你数组最上级必须包含一个元素而且不能是数字，如果你的数据不是这种格式，Xml装会抛出一个异常，无效的数组示例::

    // 最上层数组的键名是一个数字
    [
        ['key' => 'value']
    ];

    // 最上层数组有多个键值
    [
        'key1' => 'first value',
        'key2' => 'other value'
    ];

默认的数组值将作为一个xml标签输出，如果你想自定义一个属性或者文本值，你可以在属性加面加@。文本值用 @作为键名::

    $xmlArray = [
        'project' => [
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project'
        ]
    ];
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

The content of ``$xmlString`` will be::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>

使用命名空间
============

使用XML命名空间，在数组中创键一个名字是xmlns的键名：在一个通用的命名空间或输入前缀的xmlns：自定义命名空间。 看下面的示例::

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

$xml1 和 $xml2 的值分别是::

    <?xml version="1.0"?>
    <root xmlns="https://cakephp.org"><child>value</child>

    <?xml version="1.0"?>
    <root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

创建一个子节点
==============

当你创建一个XML文档，你只需要对你的文档使用原生接口操作增加，移除或者操作子节点::

    // 使用 SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // 使用 DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    用SimpleXMLElement 或者 DomDocument处理Xml后， 可以使用Xml::toArray()。

.. meta::
    :title lang=zh: Xml
    :keywords lang=zh: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
