7.13.3 header
-------------

The ``header()`` method is used to output the XML declaration.

::

    <?php
    echo $this->Xml->header(); 
    // generates: <?xml version="1.0" encoding="UTF-8" ?>
    ?>

You can pass in a different version number and encoding type as
parameters of the header method.

::

    <?php
    echo $this->Xml->header(array('version'=>'1.1')); 
    // generates: <?xml version="1.1" encoding="UTF-8" ?>
    ?>
