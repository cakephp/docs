App
###

App is a very small utility library. It only contains the **import**
method. But, with the import method, you can accomplish a lot.

::

    // examples
    App::Import('Core','File');
    App::Import('Model','Post');
    App::import('Vendor', 'geshi');
    App::import('Vendor', 'flickr/flickr');
    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));
    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

You can read more about it in `the
book <https://book.cakephp.org/view/529/Using-App-import>`_ or `the API
documentation <http://api12.cakephp.org/class/app#method-Appimport>`_
