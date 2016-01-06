### 目录

### Xml

通过Xml类导入数据

将Xml字符串转换成数组

将数据转换成Xml字符串

使用命名空间

创建一个子节点


### Xml
class Cake\Utility\Xml

Xml类充许将数组转换成SimpleXMLElement或者DOMDocument对象，并且可以转回数组。


### 导入数据到Xml类中
static Cake\Utility\Xml::build($input, array $options =[])

你可使用Xml::build() 载入XML-ish数据。取决于你$options的参数，这个方法允许你返回一个SimpleXMLElement (default) or DOMDocument对象，在各种数据来源中，你可使用 Xml::build()去创建一个XML对象。例如，你可以通过下面的设置载入XML。

$text = '<?xml version="1.0" encoding="utf-8"?>
<post>
    <id>1</id>
    <title>Best post</title>
    <body> ... </body>
</post>';
$xml = Xml::build($text);

你也可以通过本地文件创建Xml对象：
// Local file
$xml = Xml::build('/home/awesome/unicorns.xml');

你也可以通可一个数据创建Xml对象：

$data = [
    'post' => [
        'id' => 1,
        'title' => 'Best post',
        'body' => ' ... '
    ]
];
$xml = Xml::build($data);

如果你的输入是无效的，Xml类会抛出一个异常。

$xmlString = 'What is XML?'
try {
    $xmlObject = Xml::build($xmlString); // Here will throw an exception
} catch (\Cake\Utility\Exception\XmlException $e) {
    throw new InternalErrorException();
}

DOMDocument and SimpleXML 继承了不同的API's。你从XML请求的对象，一定要使用正确的方法。

### 把Xml字符串转换成数组
toArray($obj);

用Xml类把Xml字符串转换成数组是非简单的。默认你将获得返回值是SimpleXml对象。

$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlArray = Xml::toArray(Xml::build($xmlString));

如果你的XML是无效的将会执行Cake\Utility\Exception\XmlException异常。

### 把数组转换成Xml字符串

$xmlArray = ['root' => ['child' => 'value']];
// You can use Xml::build() too.
$xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
$xmlString = $xmlObject->asXML();


你数组最上级必须包含一个元素而且不能是数字，如果你的数据不是这种格式，Xml装会抛出一个异常，无效的数组示例：
// 最上层数组是一个数字
[
    ['key' => 'value']
];

// 最上层数有多个键值
[
    'key1' => 'first value',
    'key2' => 'other value'
];

默认的数组值将作为一个xml标签输出，如果你想定义一个属性或者文本值，你可以在属性加面加@。文本值用 @作为键值：
$xmlArray = [
    'project' => [
        '@id' => 1,
        'name' => 'Name of project, as tag',
        '@' => 'Value of project'
    ]
];
$xmlObject = Xml::fromArray($xmlArray);
$xmlString = $xmlObject->asXML();

### 使用命名空间

使用XML命名空间，在数组中创键一个名字是xmlns的键名：在一个通用的命名空间或输入前缀的xmlns：自定义命名空间。 看下面的示例：

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


$xml1 和 $xml2的值分别是：

<?xml version="1.0"?>
<root xmlns="http://cakephp.org"><child>value</child>


<?xml version="1.0"?>
<root><tag xmlns:pref="http://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

### 创建一个子集


当你创建一个XML文档，你只需要对你的文档使用原生接口操作增加，移除或者操作子节点：

// 使用 SimpleXML
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal);
$xml->root->addChild('young', 'new value');

// Using DOMDocument
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
$child = $xml->createElement('young', 'new value');
$xml->firstChild->appendChild($child);

用SimpleXMLElement or DomDocument处理Xml后，用Xml::toArray()没有问题。

