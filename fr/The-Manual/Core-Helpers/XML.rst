XML
###

L'assistant XML simplifie les créations de documents XML.

serialize
=========

``serialize($data, $options = array())``

-  mixed $data - Le contenu à convertir en XML
-  mixed $options - Les options de formatage des données. Pour une liste
   des options valides, voir ``Xml::__construct()``

   -  string $options['root'] - Le nom de l'élément racine, par défaut
      '#document'
   -  string $options['version'] - La version XML, par défaut '1.0'
   -  string $options['encoding'] - L'encodage du document, par défaut
      'UTF-8'
   -  array $options['namespaces'] - Un tableau des espaces de nom (sous
      forme de chaînes) utilisés dans ce document
   -  string $options['format'] - Spécifie le format dans lequel ce
      document est converti, quand il est parsé ou rendu comme texte,
      soit 'attributes', soit 'tags', par défaut 'attributes'
   -  array $options['tags'] - Un tableau spécifiant toutes options de
      formatage relatives aux tags, indexé par nom de tag. Voir
      XmlNode::normalize()

La méthode serialize prend un tableau et crée une chaîne XML des
données. Ceci est communément utilisé pour sérialiser les données du
modèle.

::

    <?php
    echo $xml->serialize($data); 
    Le formatage sera similaire à :
     <model_name id="1" field_name="content" />
    ?>

La méthode serialize agit comme un raccourci pour instancier la classe
XML intégrée et utiliser sa méthode toString. Si vous avez besoin de
plus de contrôle sur la sérialisation, vous pouvez éprouver le besoin
d'invoquer directement la classe XML.

Vous pouvez modifier la manière dont les données sont sérialisées, en
utilisant l'attribut *format*. Par défaut les données seront sérialisées
comme des attributs. Si vous définissez le *format* à "tags", les
données seront sérialisées comme des tags.

::

    pr($data);

::

    Array
    (
        [Boulanger] => Array
            (
                [0] => Array
                    (
                        [nom] => Le Boulanger
                        [poids] => lourd
                    )
                [1] => Array
                    (
                        [nom] => Le Cuisinier
                        [poids] => léger
                    )
            )
    )

::

    pr($xml->serialize($data));

::

    <boulanger>
         <boulanger nom="Le Boulanger" poids="lourd" />
         <boulanger nom="Le Cuisinier" poids="léger" />
    </boulanger>

::

    pr($xml->serialize($data, array('format' => 'tags')));

::

    <boulanger>
        <boulanger>
            <nom><![CDATA[Le Boulanger]]></nom>
            <poids><![CDATA[lourd]]></poids>
        </boulanger>
        <boulanger>
            <nom><![CDATA[Le Cuisinier]]></nom>
            <poids><![CDATA[léger]]></poids>
        </boulanger>
    </boulanger>

elem
====

La méthode elem vous permet de construire un nœud XML avec des attributs
et aussi avec un contenu interne.

string elem (string $name, $attrib = array(), mixed $content = null,
$endTag = true)

::

    echo $xml->elem('compteur', array('namespace' => 'monEspaceDeNom'), 'contenu');
    // génère : <monEspaceDeNom:compteur>contenut</compteur>

Si vous voulez entourer votre nœud texte avec CDATA, le troisième
argument devrait être un tableau contenant deux clés : 'cdata' et
'value'

::

    echo $xml->elem('compteur', null, array('cdata'=>true,'value'=>'contenu'));
    // génère : <compteur><![CDATA[contenu]]></compteur>

header
======

La méthode ``header()`` est utilisée pour afficher la déclaration XML.

::

    <?php
    echo $xml->header(); 
    // génère : <?xml version="1.0" encoding="UTF-8" ?>
    ?>

Vous pouvez passer différents numéros de version et type d'encodage
comme paramètres de la méthode header.

::

    <?php
    echo $xml->header(array('version'=>'1.1')); 
    // génère : <?xml version="1.1" encoding="UTF-8" ?>
    ?>

