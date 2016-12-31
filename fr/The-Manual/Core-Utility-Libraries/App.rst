App
###

App est une très petite bibiothèque. Elle ne contient que la méthode
**import**. Mais, avec cette méthode import, vous pouvez faire beaucoup
de choses.

::

    // exemples
    App::Import('Core','File');
    App::Import('Model','Post');
    App::import('Vendor', 'geshi');
    App::import('Vendor', 'flickr/flickr');
    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));
    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

Vous pouvez en apprendre plus dans `le
book <https://book.cakephp.org/view/529/Using-App-import>`_ ou `la
documentation de
l'API <http://api12.cakephp.org/class/app#method-Appimport>`_
