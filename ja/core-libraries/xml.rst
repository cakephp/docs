Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

Xml クラスを利用して、 配列から SimpleXMLElement もしくは DOMDocument
オブジェクトに変換を、また配列に戻すことを可能にします。

データを Xml クラスにインポートする
====================================

.. php:staticmethod:: build($input, array $options = [])

``Xml::build()`` を利用することで、XML 形式のデータの読み込みが可能となります。
``$options`` により、このメソッドは SimpleXMLElement (デフォルト) もしくは
DOMDocument を返却します。
様々なソースから XML オブジェクトのビルドに ``Xml::build()`` が利用できます。
例えば、文字列から XML をロードできます。 ::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

ローカルファイルから Xml オブジェクトにビルドも可能です。 ::

    // ローカルファイル
    $xml = Xml::build('/home/awesome/unicorns.xml');

配列を利用して Xml オブジェクトのビルドも可能です。 ::

    $data = [
        'post' => [
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        ]
    ];
    $xml = Xml::build($data);

もし入力が不正であれば、 Xml クラスは例外を投げます。 ::

    $xmlString = 'What is XML?';
    try {
        $xmlObject = Xml::build($xmlString); // ここで例外が投げられます
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ と
    `SimpleXML <http://php.net/simplexml>`_ は異なる API を実装します。
    Xml によって返却されるオブジェクトの正しいメソッドを利用しているか
    確認してください。

XML 文字列を配列に変換する
===========================

.. php:staticmethod:: toArray($obj);

XML テキストを配列に変換するのは、 Xml クラスと同様にシンプルです。
標準で SimpleXml オブジェクトから受け取ります。 ::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

もし XML が不正の場合、 ``Cake\Utility\Exception\XmlException`` が起こります。

配列を XML 文字列に変換する
============================

::

    $xmlArray = ['root' => ['child' => 'value']];
    // Xml::build() を使うこともできます
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

配列の "トップレベル" 要素はたった一つであり、それは数字ではいけません。
もし配列がこのフォーマットに従っていない時、Xml クラスは例外を投げます。
不正な配列の例です。 ::

    // トップレベルのキーが数字
    [
        ['key' => 'value']
    ];

    // トップレベルに複数のキーがある
    [
        'key1' => 'first value',
        'key2' => 'other value'
    ];

標準では、配列の値が XML のタグとして出力されます。
属性やテキストの値を定義したければ、接頭辞として許されている
``@`` をキーに付与します。値のテキストは、 ``@`` をキーにします。 ::

    $xmlArray = [
        'project' => [
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project'
        ]
    ];
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

``$xmlString`` の内容は以下になります。 ::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>


名前空間を利用する
-------------------

XML の名前空間を利用するには、配列のキーに包括的な名前空間である
``xmlns:`` を使用するか、独自の名前空間に
``xmlns:`` を接頭語として加えたキーを使用して配列を作成します。 ::

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

``$xml1`` と ``$xml2`` の値はそれぞれ以下になります。 ::

    <?xml version="1.0"?>
    <root xmlns="https://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

子要素を作成
-------------

XML 文書を作成したのち、その文書に子要素を追加したり取り除いたり操作するには、
単純に標準の実装を利用します。 ::

    // SimpleXML を利用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // DOMDocument を利用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    SimpleXMLElement や DomDocument を利用して XML を操作したのちは、
    ``Xml::toArray()`` を問題なく利用できます。

.. meta::
    :title lang=ja: Xml
    :keywords lang=ja: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
