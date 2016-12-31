App
###

App ist eine sehr kleine Programm-Bibliothek. Es enthält nur die
**import**-Methode. Mit dieser kann man aber dafür eine ganze Menge
durchführen:

::

    // examples
    App::Import('Core','File');
    App::Import('Model','Post');
    App::import('Vendor', 'geshi');
    App::import('Vendor', 'flickr/flickr');
    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));
    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

Mehr dazu gibts in `the
book <https://book.cakephp.org/view/529/Using-App-import>`_ oder `der API
documentation <http://api12.cakephp.org/class/app#method-Appimport>`_
