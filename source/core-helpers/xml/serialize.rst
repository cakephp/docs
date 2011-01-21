7.13.1 serialize
----------------

``serialize($data, $options = array())``


-  mixed $data - The content to be converted to XML
-  mixed $options - The data formatting options. For a list of
   valid options, see ``Xml::__construct()``
   
   -  string $options['root'] - The name of the root element, defaults
      to '#document'
   -  string $options['version'] - The XML version, defaults to '1.0'
   -  string $options['encoding'] - Document encoding, defaults to
      'UTF-8'
   -  array $options['namespaces'] - An array of namespaces (as
      strings) used in this document
   -  string $options['format'] - Specifies the format this document
      converts to when parsed or rendered out as text, either
      'attributes' or 'tags', defaults to 'attributes'
   -  array $options['tags'] - An array specifying any tag-specific
      formatting options, indexed by tag name. See XmlNode::normalize()


The serialize method takes an array and creates an XML string of
the data. This is commonly used for serializing model data.

::

    <?php
    echo $this->Xml->serialize($data); 
     format will be similar to:
     <model_name id="1" field_name="content" />
    ?>


#. ``<?php``
#. ``echo $this->Xml->serialize($data);``
#. ``format will be similar to:``
#. ``<model_name id="1" field_name="content" />``
#. ``?>``

The serialize method acts as a shortcut to instantiating the XML
built-in class and using the toString method of that. If you need
more control over serialization, you may wish to invoke the XML
class directly.

You can modify how a data is serialized by using the *format*
attribute. By default the data will be serialized as attributes. If
you set the *format* as "tags" the data will be serialized as
tags.

::

    pr($data);


#. ``pr($data);``

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

    pr($this->Xml->serialize($data));


#. ``pr($this->Xml->serialize($data));``

::

    <baker>
         <baker name="The Baker" weight="heavy" />
         <baker name="The Cook" weight="light-weight" />
    </baker>

::

    pr($this->Xml->serialize($data, array('format' => 'tags')));


#. ``pr($this->Xml->serialize($data, array('format' => 'tags')));``

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

7.13.1 serialize
----------------

``serialize($data, $options = array())``


-  mixed $data - The content to be converted to XML
-  mixed $options - The data formatting options. For a list of
   valid options, see ``Xml::__construct()``
   
   -  string $options['root'] - The name of the root element, defaults
      to '#document'
   -  string $options['version'] - The XML version, defaults to '1.0'
   -  string $options['encoding'] - Document encoding, defaults to
      'UTF-8'
   -  array $options['namespaces'] - An array of namespaces (as
      strings) used in this document
   -  string $options['format'] - Specifies the format this document
      converts to when parsed or rendered out as text, either
      'attributes' or 'tags', defaults to 'attributes'
   -  array $options['tags'] - An array specifying any tag-specific
      formatting options, indexed by tag name. See XmlNode::normalize()


The serialize method takes an array and creates an XML string of
the data. This is commonly used for serializing model data.

::

    <?php
    echo $this->Xml->serialize($data); 
     format will be similar to:
     <model_name id="1" field_name="content" />
    ?>


#. ``<?php``
#. ``echo $this->Xml->serialize($data);``
#. ``format will be similar to:``
#. ``<model_name id="1" field_name="content" />``
#. ``?>``

The serialize method acts as a shortcut to instantiating the XML
built-in class and using the toString method of that. If you need
more control over serialization, you may wish to invoke the XML
class directly.

You can modify how a data is serialized by using the *format*
attribute. By default the data will be serialized as attributes. If
you set the *format* as "tags" the data will be serialized as
tags.

::

    pr($data);


#. ``pr($data);``

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

    pr($this->Xml->serialize($data));


#. ``pr($this->Xml->serialize($data));``

::

    <baker>
         <baker name="The Baker" weight="heavy" />
         <baker name="The Cook" weight="light-weight" />
    </baker>

::

    pr($this->Xml->serialize($data, array('format' => 'tags')));


#. ``pr($this->Xml->serialize($data, array('format' => 'tags')));``

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
