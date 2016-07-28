XML
###

.. php:class:: Xml

Xml クラスはすべてリファクタリングされました。 PHP 5 には
`SimpleXML <http://php.net/simplexml>`_ と
`DOMDocument <http://php.net/domdocument>`_ があり、
CakePHP で XML パーサーを再実装する必要がないからです。
新しい Xml クラスは配列から SimpleXMLElement や DOMDocument
または逆方向への基本的な変換を行います。

Xml クラスへのデータのインポート
================================

CakePHP 1.3 では、 Xml クラスへデータをインポートするために、コンストラクタへ
配列、 XML 文字列、 URL やファイルパスを渡すことができました。
CakePHP 2.0 では、 :php:meth:`Xml::build()` を使うことで可能になります。
Xml オブジェクトが返るまでの間、 SimpleXMLElement または DOMDocument
オブジェクトを返します。オブジェクトのクラスはオプションのパラメータに依存し、
既定では SimpleEMLElement を返します。以下のサンプルは URL から
データをインポートする方法を示しています。 ::

    // はじめにユーティリティクラスをロードします。
    App::uses('Xml', 'Utility');

    // 今までの方法:
    $xml = new Xml('http://bakery.cakephp.org/articles.rss');

    // SimpleXML を使った新しい方法:
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss');
    // このとき、 $xml は SimpleXMLElement のインスタンスです。

    // もしくは
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'simplexml'));
    // このときも、 $xml は SimpleXMLElement のインスタンスです。

    // DOMDocument を使った新しい方法:
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss', array('return' => 'domdocument'));
    // このとき、 $xml は DOMDocument のインスタンスです。

:php:meth:`Xml::build()` を使うことで、多様なソースから XML オブジェクトを
作成することができます。たとえば、文字列から XML オブジェクトを作成することができます。 ::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

ローカルやリモートにあるファイルからも XML オブジェクトを作成することができます。
リモートのファイルは :php:class:`HttpSocket` を使って取得します。 ::

    // ローカルにあるファイル
    $xml = Xml::build('/home/awesome/unicorns.xml');

    // リモートにあるファイル
    $xml = Xml::build('http://bakery.cakephp.org/articles.rss');

配列を使っても Xml オブジェクトを作成できます。 ::

    $data = array(
        'post' => array(
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... '
        )
    );
    $xml = Xml::build($data);

入力が正しくない場合、 Xml クラスは例外をスローします。 ::

    $xmlString = 'What is XML?'
    try {
        $xmlObject = Xml::build($xmlString); // ここで例外をスローする
    } catch (XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <http://php.net/domdocument>`_ と
    `SimpleXML <http://php.net/simplexml>`_ は異なる API を実装しています。
    必ずXmlから要求されたオブジェクトの正しいメソッドを使用してください。

XML 文字列から配列への変換
==========================

XML から配列への変換は Xml クラスを使うのと同じくらい簡単です。
既定では SimpleXML オブジェクトが返り値として得られます。 ::

    // 今までの方法:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlObject = new Xml($xmlString);
    $xmlArray = $xmlObject->toArray();

    // 新しい方法:
    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

XML が正しくなければ例外がスローされます。

配列から XML 文字列への変換
===========================

::

    // 今までの方法:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = new Xml($xmlArray, array('format' => 'tags'));
    $xmlString = $xmlObject->toString();

    // 新しい方法:
    $xmlArray = array('root' => array('child' => 'value'));
    $xmlObject = Xml::fromArray($xmlArray, array('format' => 'tags')); // Xml::build() を使うこともできます
    $xmlString = $xmlObject->asXML();

引数にとる配列は、「トップレベル」に数値でないキーを持つ要素をひとつだけ
持つものでなければなりません。この条件を満たさない場合、
Xml クラスは例外をスローします。以下は正しくない例です。 ::

    // 数値のキーを用いたトップレベル要素
    array(
        array('key' => 'value')
    );

    // トップレベルに複数の要素がある
    array(
        'key1' => 'first value',
        'key2' => 'other value'
    );

.. warning::

    既定のフォーマットオプションは `attributes` から `tags` に変更されました。
    これは既存の XML 文書とより互換性のある Xml クラスを生成できるようにするための変更です。
    この変更に依存するコードがある場合は気をつけてください。新しいバージョンでは、タグと要素、
    値を混合した配列を作成することができます。タグを作るにはこのフォーマットを使うだけです。
    (デフォルトでタグが作成されるので特に何もする必要はありません。)
    `@` をキーの先頭につけることで属性が生成できます。 テキストノードを表すときは
    `@` をキーとして用います。

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

この例では、 ``$xmlString`` には::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>

という値が格納されています。

.. note::

    配列の構造は変更されました。子要素はサブツリーにあります。同じツリーにはありません。
    加えて、文字列は :php:class:`Inflector` によって変更されません。
    以下の例を見てください。

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

どちらの例も、以下のような XML になります。 ::

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

名前空間の使用
--------------

配列で XML 名前空間を定義するには、デフォルトの名前空間のために
``xmlns:`` という名前のキーを作成するか、カスタム名前空間の前に
``xmlns:`` をつけた名前のキーを作成する必要があります。
以下の例を見てください。 ::

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

``$xml1`` と ``$xml2`` の値は、それぞれ次のようになるでしょう。 ::

    <?xml version="1.0"?>
    <root xmlns="http://cakephp.org"><child>value</child>


    <?xml version="1.0"?>
    <root><tag xmlns:pref="http://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

子要素の作成
------------

CakePHP 2.0 の Xml クラスはコンテンツの操作をするメソッドを提供しません。
これらの操作は SimpleXMLElement または DOMDocument を使ってしなければなりません。
CakePHP はそれをカバーしてくれます。以下のように、CakePHP で子要素を作成するためには
いくつか段階を踏みます。 ::

    // CakePHP 1.3
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = new Xml($myXmlOriginal, array('format' => 'tags'));
    $xml->children[0]->createNode('young', 'new value');

    // CakePHP 2.0 - SimpleXML を使用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // CakePHP 2.0 - DOMDocument を使用
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, array('return' => 'domdocument'));
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    SimpleXMLElement または DomDocument を使って操作したあとの XML も、問題なく
    :php:meth:`Xml::toArray()` を使うことができます。

Xml の API
==========

文字列や配列、リモートの URL などを含むいくつかのソースから、
SimpleXml または DOMDocument クラスのオブジェクトを生成する、
factory クラスまたは変換クラスです。

.. php:staticmethod:: build($input, $options = array())

    XML の文字列やファイルパス、 URL 、配列を与えて
    SimpleXMLElement または DOMDocument を初期化します。

    文字列から XML を作成する::

        $xml = Xml::build('<example>text</example>');

    文字列から XML を作成し、 DOMDocument クラスのオブジェクトとして出力する::

        $xml = Xml::build('<example>text</example>', array('return' => 'domdocument'));

    ローカルのファイルパスから XML を作成する::

        $xml = Xml::build('/path/to/an/xml/file.xml');

    リモート URL から作成する::

        $xml = Xml::build('http://example.com/example.xml');

    配列から作成する::

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

    配列から XML を作成する時は、トップレベルの要素が唯一であることを確認しましょう。

.. php:staticmethod:: toArray($obj)

    SimpleXml または DOMDocument クラスのオブジェクトを配列に変換します。


.. meta::
    :title lang=ja: Xml
    :keywords lang=ja: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
