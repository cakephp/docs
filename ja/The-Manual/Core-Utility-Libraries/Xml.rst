Xml
###

Xml クラスは XML
の要素や文書を、簡単に作成したり解析する方法を提供します。全て PHP
によって提供される機能であり、必要なことは Xml/Expat
の拡張がインストールされていることだけです。このライブラリは主にSimpleXMLを利用できない人々に利便をもたらすものとして提供されます。

XML のパース
============

Xml クラスを用いて XML を解析するには、まず解析したい XML
を含む文字列を取得する必要があります。

::

    $input = '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>
        <container>
            <element id="first-el">
                <name>私の要素</name>
                <size>20</size>
            </element>
            <element>
                <name>あなたの要素</name>
                <size>30</size>
            </element>
        </container>';
    $xml = new Xml($input);

これは、何かしらの加工、走査、あるいは文字列への再変換を行うことができる
XML ドキュメントオブジェクトを生成しています。

上述のサンプルを使って、次のようなことができます。

::

    echo $xml->children[0]->children[0]->name;
    // 「element」を出力する

    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // 「私の要素」を出力する

    echo $xml->children[0]->child('element')->attributes['id'];
    // 「first-el」を出力する

上記に加えて、多くの場合、Xmlドキュメントオブジェクトを配列に変換することでXMLからデータを取得するのがより簡単になります。

::

    $xml = new Xml($input);
    // こうするとXmlドキュメントオブジェクトをフォーマットされた配列に変換できます
    $xmlAsArray = Set::reverse($xml);
    // もしくはシンプルにtoArray()を呼んで変換することができます。
    $xmlAsArray = $xml->toArray();

