Xml
###

.. php:namespace:: Cake\Utility

.. php:class:: Xml

A classe Xml permite que você transforme arrays em objetos SimpleXMLElement ou
DOMDocument, e de volta em arrays novamente.

Carregando Documentos XML
==========================

.. php:staticmethod:: build($input, array $options = [])

Você pode carregar dados similares a XML usando ``Xml::build()``. Dependendo do seu
parâmetro ``$options``, este método retornará um SimpleXMLElement (padrão)
ou objeto DOMDocument. Você pode usar ``Xml::build()`` para construir objetos XML
de várias fontes. Por exemplo, você pode carregar XML de
strings::

    $text = '<?xml version="1.0" encoding="utf-8"?>
    <post>
        <id>1</id>
        <title>Best post</title>
        <body> ... </body>
    </post>';
    $xml = Xml::build($text);

Você também pode construir objetos Xml de arquivos locais sobrescrevendo a opção padrão::

    // Local file
    $xml = Xml::build('/home/awesome/unicorns.xml', ['readFile' => true]);

Você também pode construir objetos Xml usando um array::

    $data = [
        'post' => [
            'id' => 1,
            'title' => 'Best post',
            'body' => ' ... ',
        ]
    ];
    $xml = Xml::build($data);

Se sua entrada for inválida, a classe Xml lançará uma exceção::

    $xmlString = 'What is XML?';
    try {
        $xmlObject = Xml::build($xmlString); // Here will throw an exception
    } catch (\Cake\Utility\Exception\XmlException $e) {
        throw new InternalErrorException();
    }

.. note::

    `DOMDocument <https://php.net/domdocument>`_ e
    `SimpleXML <https://php.net/simplexml>`_ implementam APIs diferentes.
    Certifique-se de usar os métodos corretos no objeto que você solicita do Xml.

Carregando Documentos HTML
===========================

Documentos HTML podem ser analisados em objetos ``SimpleXmlElement`` ou ``DOMDocument``
com ``loadHtml()``::

    $html = Xml::loadHtml($htmlString, ['return' => 'domdocument']);

Por padrão, o carregamento de entidades e a análise de documentos enormes estão desabilitados. Esses modos
podem ser habilitados com as opções ``loadEntities`` e ``parseHuge`` respectivamente.

Transformando uma String XML em Array
======================================

.. php:staticmethod:: toArray($obj)

Converter strings XML em arrays é simples com a classe Xml também. Por
padrão você receberá um objeto SimpleXml de volta::

    $xmlString = '<?xml version="1.0"?><root><child>value</child></root>';
    $xmlArray = Xml::toArray(Xml::build($xmlString));

Se seu XML for inválido, uma ``Cake\Utility\Exception\XmlException`` será lançada.

Transformando um Array em uma String de XML
============================================

::

    $xmlArray = ['root' => ['child' => 'value']];
    // You can use Xml::build() too.
    $xmlObject = Xml::fromArray($xmlArray, ['format' => 'tags']);
    $xmlString = $xmlObject->asXML();

Seu array deve ter apenas um elemento no "nível superior" e ele não pode ser
numérico. Se o array não estiver neste formato, Xml lançará uma exceção.
Exemplos de arrays inválidos::

    // Top level with numeric key
    [
        ['key' => 'value']
    ];

    // Multiple keys in top level
    [
        'key1' => 'first value',
        'key2' => 'other value'
    ];

Por padrão, valores de array serão exibidos como tags XML. Se você quiser definir
atributos ou valores de texto, você pode prefixar as chaves que devem ser
atributos com ``@``. Para valor de texto, use ``@`` como a chave::

    $xmlArray = [
        'project' => [
            '@id' => 1,
            'name' => 'Name of project, as tag',
            '@' => 'Value of project',
        ],
    ];
    $xmlObject = Xml::fromArray($xmlArray);
    $xmlString = $xmlObject->asXML();

O conteúdo de ``$xmlString`` será::

    <?xml version="1.0"?>
    <project id="1">Value of project<name>Name of project, as tag</name></project>

Usando Namespaces
-----------------

Para usar Namespaces XML, crie uma chave em seu array com o nome ``xmlns:``
em um namespace genérico ou insira o prefixo ``xmlns:`` em um namespace personalizado. Veja
os exemplos::

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

O valor de ``$xml1`` e ``$xml2`` será, respectivamente::

    <?xml version="1.0"?>
    <root xmlns="https://cakephp.org"><child>value</child>

    <?xml version="1.0"?>
    <root><tag xmlns:pref="https://cakephp.org"><pref:item>item 1</pref:item><pref:item>item 2</pref:item></tag></root>

Criando um Filho
----------------

Depois de criar seu documento XML, você apenas usa as interfaces nativas para
seu tipo de documento para adicionar, remover ou manipular nós filhos::

    // Using SimpleXML
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal);
    $xml->root->addChild('young', 'new value');

    // Using DOMDocument
    $myXmlOriginal = '<?xml version="1.0"?><root><child>value</child></root>';
    $xml = Xml::build($myXmlOriginal, ['return' => 'domdocument']);
    $child = $xml->createElement('young', 'new value');
    $xml->firstChild->appendChild($child);

.. tip::

    Depois de manipular seu XML usando SimpleXMLElement ou DomDocument, você pode
    usar ``Xml::toArray()`` sem problemas.

.. meta::
    :title lang=pt: Xml
    :keywords lang=pt: array php,xml class,xml objects,post xml,xml object,string url,string data,xml parser,php 5,bakery,constructor,php xml,cakephp,php file,unicorns,meth
