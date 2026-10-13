# XML

`class` **Xml**

PHP には [SimpleXML](https://www.php.net/simplexml) と
[DOMDocument](https://www.php.net/domdocument) があるため、
CakePHP で XML パーサーを独自に実装する必要はありません。
Xml クラスは配列から SimpleXMLElement や DOMDocument
または逆方向への基本的な変換を行います。

## Xml クラスへのデータのインポート

データをインポートするには `Xml::build()` を使います。
`return` オプションに応じて、SimpleXMLElement (デフォルト) または DOMDocument
オブジェクトを返します。以下のサンプルは URL から
データをインポートする方法を示しています。 :

``` php
// SimpleXML を使う
$xml = Xml::build('https://example.com/articles.rss');
// このとき、 $xml は SimpleXMLElement のインスタンスです。

// もしくは
$xml = Xml::build('https://example.com/articles.rss', ['return' => 'simplexml']);
// このときも、 $xml は SimpleXMLElement のインスタンスです。

// DOMDocument を使う
$xml = Xml::build('https://example.com/articles.rss', ['return' => 'domdocument']);
// このとき、 $xml は DOMDocument のインスタンスです。
```

`Xml::build()` を使うことで、多様なソースから XML オブジェクトを
作成することができます。たとえば、文字列から XML オブジェクトを作成することができます。 :

``` php
$text = '<?xml version="1.0" encoding="utf-8"?>
<post>
    <id>1</id>
    <title>Best post</title>
    <body> ... </body>
</post>';
$xml = Xml::build($text);
```

ローカルやリモートにあるファイルからも XML オブジェクトを作成することができます。
リモートのファイルは `HttpSocket` を使って取得します。 :

``` php
// ローカルにあるファイル
$xml = Xml::build('/home/awesome/unicorns.xml');

// リモートにあるファイル
$xml = Xml::build('https://example.com/articles.rss');
```

> [!WARNING]
> `<` を含まない文字列はファイルパスか URL として扱われ、そのファイルや URL が読み込まれます。
> ユーザーが入力したデータは、XML の内容であることを確認してから `Xml::build()` に渡してください。

配列を使っても Xml オブジェクトを作成できます。 :

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

入力が正しくない場合、 Xml クラスは例外をスローします。 :

``` php
$xmlString = 'What is XML?';
try {
    $xmlObject = Xml::build($xmlString); // ここで例外をスローする
} catch (XmlException $e) {
    throw new InternalErrorException();
}
```

> [!NOTE]
> [DOMDocument](https://www.php.net/domdocument) と
> [SimpleXML](https://www.php.net/simplexml) は異なる API を実装しています。
> 必ずXmlから要求されたオブジェクトの正しいメソッドを使用してください。

## XML 文字列から配列への変換

XML から配列への変換も Xml クラスを使えば簡単です。 :

``` php
$xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
$xmlArray = Xml::toArray(Xml::build($xmlString));
```

XML が正しくなければ例外がスローされます。

## 配列から XML 文字列への変換

``` php
$xmlArray = ['root' => ['child' => 'value']];
$xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']); // Xml::build() を使うこともできます
$xmlString = $xmlObject->asXML();
```

引数にとる配列は、「トップレベル」に数値でないキーを持つ要素をひとつだけ
持つものでなければなりません。この条件を満たさない場合、
Xml クラスは例外をスローします。以下は正しくない例です。 :

``` text
// 数値のキーを用いたトップレベル要素
[
    ['key' => 'value']
];

// トップレベルに複数の要素がある
[
    'key1' => 'first value',
    'key2' => 'other value'
];
```

既定のフォーマットは `tags` で、配列の各キーが子要素になります。
タグと属性、値を混合した配列を作成することもできます。
`@` をキーの先頭につけると属性が生成されます。テキストノードを表すときは
`@` をキーとして用います。

``` php
$xmlArray = [
    'project' => [
        '@id' => 1,
        'name' => 'Name of project, as tag',
        '@' => 'Value of project'
    ]
];
$xmlObject = Xml::fromArray($xmlArray);
$xmlString = $xmlObject->asXML();
```

この例では、 `$xmlString` には:

``` php
<?xml version="1.0"?>
<project id="1">Value of project<name>Name of project, as tag</name></project>
```

という値が格納されています。

子要素は親要素のサブツリーに入れ子にします。キーはそのまま要素名として使われ、
`Inflector` によって変更されることはありません。繰り返す要素は数値添字の配列で表します。
以下の例を見てください。

``` php
$data = [
    'projects' => [
        'project' => [
            [
                'id' => 1, 'title' => 'Project 1',
                'industry' => ['id' => 1, 'name' => 'Industry 1']
            ],
            [
                'id' => 2, 'title' => 'Project 2',
                'industry' => ['id' => 2, 'name' => 'Industry 2']
            ]
        ]
    ]
];
```

この配列は、以下のような XML になります。 :

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

### 名前空間の使用

配列で XML 名前空間を定義するには、デフォルトの名前空間のために
`xmlns:` という名前のキーを作成するか、カスタム名前空間の前に
`xmlns:` をつけた名前のキーを作成する必要があります。
以下の例を見てください。 :

``` php
$xmlArray = [
    'root' => [
        'xmlns:' => 'https://cakephp.org',
        'child' => 'value'
    ]
];
$xml1 = Xml::fromArray($xmlArray);

$xmlArray = [
    'root' => [
        'tag' => [
            'xmlns:pref' => 'https://cakephp.org',
            'pref:item' => [
                'item 1',
                'item 2'
            ]
        ]
    ]
];
$xml2 = Xml::fromArray($xmlArray);
```

`$xml1` と `$xml2` の値は、それぞれ次のようになるでしょう。 :

``` php
<?xml version="1.0"?>
<root xmlns="https://cakephp.org"><child>value</child></root>


<?xml version="1.0"?>
<root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>
```

### 子要素の作成

Xml クラスはコンテンツの操作をするメソッドを提供しません。
これらの操作は SimpleXMLElement または DOMDocument を使って行います。
以下は子要素を作成する例です。 :

``` php
// SimpleXML を使用
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal);
$xml->addChild('young', 'new value');

// DOMDocument を使用
$myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
$xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
$child = $xml->createElement('young', 'new value');
$xml->firstChild->appendChild($child);
```

> [!TIP]
> SimpleXMLElement または DomDocument を使って操作したあとの XML も、問題なく
> `Xml::toArray()` を使うことができます。

## Xml の API

文字列や配列、リモートの URL などを含むいくつかのソースから、
SimpleXml または DOMDocument クラスのオブジェクトを生成する、
factory クラスまたは変換クラスです。

`static` Xml::**build**($input, $options = [])

XML の文字列やファイルパス、 URL 、配列を与えて
SimpleXMLElement または DOMDocument を初期化します。
次のオプションを指定できます。

- `return` SimpleXMLElement を返す `'simplexml'` (デフォルト) か、
  DOMDocument を返す `'domdocument'` を指定します。
- `loadEntities` `<!ENTITY` 定義を読み込むかどうかです。セキュリティ上の理由からデフォルトは `false` です。
  信頼できる XML を扱う場合にだけ有効にしてください。
- `readFile` ローカルのファイルパスを読み込むかどうかです。デフォルトは `true` です。
- `parseHuge` `LIBXML_PARSEHUGE` を有効にします。デフォルトは `true` です。

入力が配列の場合は、`Xml::fromArray()` のオプション (`format` や `pretty` など) も指定できます。

文字列から XML を作成する:

``` php
$xml = Xml::build('<example>text</example>');
```

文字列から XML を作成し、 DOMDocument クラスのオブジェクトとして出力する:

``` php
$xml = Xml::build('<example>text</example>', ['return' => 'domdocument']);
```

ローカルのファイルパスから XML を作成する:

``` php
$xml = Xml::build('/path/to/an/xml/file.xml');
```

リモート URL から作成する:

``` php
$xml = Xml::build('https://example.com/example.xml');
```

配列から作成する:

``` php
$value = [
    'tags' => [
        'tag' => [
            [
                'id' => '1',
                'name' => 'defect'
            ],
            [
                'id' => '2',
                'name' => 'enhancement'
        ]
        ]
    ]
];
$xml = Xml::build($value);
```

配列から XML を作成する時は、トップレベルの要素が唯一であることを確認しましょう。

`static` Xml::**toArray**($obj)

SimpleXml または DOMDocument クラスのオブジェクトを配列に変換します。
