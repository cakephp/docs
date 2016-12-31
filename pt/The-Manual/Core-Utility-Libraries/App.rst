App
###

App é uma biblioteca muito reduzida. Contém apenas o método **import**.
Porém você poderá realizar muito com com o método **import**.

::

    // exemplos
    App::Import('Core','File');
    App::Import('Model','Post');
    App::import('Vendor', 'geshi');
    App::import('Vendor', 'flickr/flickr');
    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));
    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

Você pode ler mais sobre no
`Cookbook <https://book.cakephp.org/view/936/Importing-Controllers-Models-Components-Behaviors->`_
ou na `API <http://api13.cakephp.org/class/app#method-Appimport>`_
