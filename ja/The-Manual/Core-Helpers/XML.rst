XML
###

XML ヘルパーは XML 文書の出力を簡単にします。

serialize
=========

``serialize($data, $options = array())``

-  mixed $data - XMLに変換するコンテンツ
-  mixed $options -
   データのフォーマットに関するオプション。適当なオプションのリストは、\ ``Xml::__construct()を見てください。``

   -  string $options['root'] - ルートエレメントの名前。デフォルトは
      '#document'です。
   -  string $options['version'] - XMLのバージョン。デフォルトは
      '1.0'です。
   -  string $options['encoding'] -
      ドキュメントのエンコーディング。デフォルトは 'UTF-8'です。
   -  array $options['namespaces'] -
      *このドキュメントで使われるnamespaces*\ （文字列）の配列。
   -  string $options['format'] -
      テキストとして解析・レンダリングをするときにドキュメントを変換するフォーマットの指定。'attributes'か'tags'を指定できます。デフォルトは'attributes'です。
   -  array $options['tags'] -
      タグ固有のフォーマットオプションを指定する配列で、タグの名前でインデックスされます。XmlNode::normalize()を参照してください。

serialize メソッドは配列を使ってデータの XML
文字列を生成します。これは主にモデルデータをシリアル化する時に使用します。

::

    <?php
    echo $xml->serialize($data); 
     format will be similar to:
     <model_name id="1" field_name="content" />
    ?>

serialize
メソッドは組み込みのXMLクラスのインスタンス化と自身のtoStringメソッドの使用へのショートカットとして振舞います。シリア化より多くの操作が必要なら、直接XMLクラスの起動を要求することができます。

*format*\ 属性を使うことによってデータをどういうふうにシリアライズするか変えることができます。\ *format*\ を"tags"に指定すると、データはタグとしてシリアライズ化されることでしょう。

::

    pr($data);

::

    Array
    (
        [Baker] => Array
            (
                [0] => Array
                    (
                        [name] => The Baker
                        [weight] => heavy
                    )
                [1] => Array
                    (
                        [name] => The Cook
                        [weight] => light-weight
                    )
            )
    )

::

    pr($xml->serialize($data));

::

    <baker>
         <baker name="The Baker" weight="heavy" />
         <baker name="The Cook" weight="light-weight" />
    </baker>

::

    pr($xml->serialize($data, array('format' => 'tags')));

::

    <baker>
        <baker>
            <name><![CDATA[The Baker]]></name>
            <weight><![CDATA[heavy]]></weight>
        </baker>
        <baker>
            <name><![CDATA[The Cook]]></name>
            <weight><![CDATA[light-weight]]></weight>
        </baker>
    </baker>

elem
====

elem メソッドもまた、アトリビュートと中のコンテンツで XML
ノードを作成します。

string elem (string $name, $attrib = array(), mixed $content = null,
$endTag = true)

::

    echo $xml->elem('count', array('namespace' => 'myNameSpace'), 'content');
    // <myNameSpace:count>content</count> を生成する

もし文字列のノードを CDATA
でラップしたいなら、第三引数に「cdata」と「value」というキーを持つ配列を渡してください。

::

    echo $xml->elem('count', null, array('cdata'=>true,'value'=>'content');
    // <count><![CDATA[content]]></count> を生成する

header
======

``header()`` メソッドは XML 宣言を出力するために使用します。

::

    <?php
    echo $xml->header(); 
    // <?xml version="1.0" encoding="UTF-8" ?> を生成する
    ?>

header
メソッドに異なるバージョンの番号とエンコードタイプをパラメータとして渡すことができます。

::

    <?php
    echo $xml->header(array('version'=>'1.1')); 
    // <?xml version="1.1" encoding="UTF-8" ?> を生成する
    ?>

