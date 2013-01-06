XML
###

O helper XML simplifica a saída de documentos XML.

serialize
=========

``serialize($data, $options = array())``

-  mixed $data - O conteúdo a ser convertido para XML
-  mixed $options - Opções de formatação de dados. Para uma lista das
   opções válidas, veja ``Xml::__construct()``

   -  string $options['root'] - O nome do elemento raíz, o padrão é
      '#document'
   -  string $options['version'] - A versão do XML, o padrão é '1.0'
   -  string $options['encoding'] - A codificação do documento, o padrão
      é 'UTF-8'
   -  array $options['namespaces'] - Um array de namespaces (como
      strings) usados neste documento
   -  string $options['format'] - Especifica o formato para o qual este
      documento será convertido quando analisado e renderizado como
      texto, se como 'attributes' ou 'tags', o padrão é 'attributes'
   -  array $options['tags'] - Um array especificando quaisquer opções
      de formatação relativas às tags, indexado pelo nome da tag. Veja
      XmlNode::normalize()

O método serialize pega um array e cria uma string XML dos dados. Isto é
comumente usado para serializar dados de model.

::

    <?php
    echo $xml->serialize($data); 
     o formato será semelhante à:
     <model_name id="1" field_name="content" />
    ?>

O método serialize age como um atalho para instanciação de classes XML
predefinidas e utilizando o método toString para isso. Se você precisar
de mais controler sobre a serialização, você pode querer invocar a
classe XML diretamente.

Você pode modificar como um dado é serializado usando o atributo
*format*. Por padrão, os dados serão serializados como atribuitos. Se
você definir o valor de *format* para "tags", os dados serão
serializados como tags.

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

O método elem permite que você construa uma string de um nó XML com
atributos e conteúdo interno.

string elem (string $name, $attrib = array(), mixed $content = null,
$endTag = true)

::

    echo $xml->elem('count', array('namespace' => 'myNameSpace'), 'content');
    // gera: <myNameSpace:count>content</count>

Se você quiser delimitar o texto de seu nó com CDATA, o terceiro
argumento deve ser um array contendo dois índices: 'cdata' e 'value'

::

    echo $xml->elem('count', null, array('cdata'=>true,'value'=>'content'));
    // gera: <count><![CDATA[content]]></count>

header
======

O método ``header()`` é usado para exibir a declaração XML.

::

    <?php
    echo $xml->header(); 
    // gera: <?xml version="1.0" encoding="UTF-8" ?>
    ?>

Você pode passar em um um número de versão e uma codificação diferentes
como parâmetros para o método header.

::

    <?php
    echo $xml->header(array('version'=>'1.1')); 
    // gera: <?xml version="1.1" encoding="UTF-8" ?>
    ?>

