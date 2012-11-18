Xml
###

A classe Xml oferece uma maneira fácil de analisar e gerar documentos e
trechos de XML. É uma solução feita totalmente em PHP e precisa apenas
que a extensão Xml/Expat esteja instalada.

Análise de Xml
==============

Para análisar (parsing) XML com a classe Xml, é necessário que você
tenha uma string contendo o xml que você quer analisar.

::

    $input = '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>
        <container>
            <element id="first-el">
                <name>Meu elemento</name>
                <size>20</size>
            </element>
            <element>
                <name>Seu elemento</name>
                <size>30</size>
            </element>
        </container>';
    $xml = new Xml($input);

Isto deve criar um objeto documento Xml que pode ser manipulado,
navegado e reconvertido de volta em string.

Dado o trecho de código acima você poderia fazer o seguinte:

::

    echo $xml->children[0]->children[0]->name;
    // exibe 'element'

    echo $xml->children[0]->children[0]->children[0]->children[0]->value;
    // exibe 'Meu elemento'

    echo $xml->children[0]->child('element')->attributes['id'];
    // exibe 'first-el'

