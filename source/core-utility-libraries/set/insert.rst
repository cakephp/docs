8.5.2 insert
------------

``array Set::insert ($list, $path, $data = null)``

Inserts $data into an array as defined by $path.

::

    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'files', array('name' => 'files'));
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
            [files] => Array
                (
                    [name] => files
                )
        )
    */
    
    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'pages.name', array());
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => Array
                        (
                        )
                )
        )
    */
    
    $a = array(
        'pages' => array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        )
    );
    $result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [0] => Array
                        (
                            [name] => main
                        )
                    [1] => Array
                        (
                            [name] => about
                            [vars] => Array
                                (
                                    [title] => page title
                                )
                        )
                )
        )
    */


#. ``$a = array(``
#. ``'pages' => array('name' => 'page')``
#. ``);``
#. ``$result = Set::insert($a, 'files', array('name' => 'files'));``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => page``
#. ``)``
#. ``[files] => Array``
#. ``(``
#. ``[name] => files``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``'pages' => array('name' => 'page')``
#. ``);``
#. ``$result = Set::insert($a, 'pages.name', array());``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => Array``
#. ``(``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``'pages' => array(``
#. ``0 => array('name' => 'main'),``
#. ``1 => array('name' => 'about')``
#. ``)``
#. ``);``
#. ``$result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[name] => main``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[name] => about``
#. ``[vars] => Array``
#. ``(``
#. ``[title] => page title``
#. ``)``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``

8.5.2 insert
------------

``array Set::insert ($list, $path, $data = null)``

Inserts $data into an array as defined by $path.

::

    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'files', array('name' => 'files'));
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
            [files] => Array
                (
                    [name] => files
                )
        )
    */
    
    $a = array(
        'pages' => array('name' => 'page')
    );
    $result = Set::insert($a, 'pages.name', array());
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => Array
                        (
                        )
                )
        )
    */
    
    $a = array(
        'pages' => array(
            0 => array('name' => 'main'),
            1 => array('name' => 'about')
        )
    );
    $result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [0] => Array
                        (
                            [name] => main
                        )
                    [1] => Array
                        (
                            [name] => about
                            [vars] => Array
                                (
                                    [title] => page title
                                )
                        )
                )
        )
    */


#. ``$a = array(``
#. ``'pages' => array('name' => 'page')``
#. ``);``
#. ``$result = Set::insert($a, 'files', array('name' => 'files'));``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => page``
#. ``)``
#. ``[files] => Array``
#. ``(``
#. ``[name] => files``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``'pages' => array('name' => 'page')``
#. ``);``
#. ``$result = Set::insert($a, 'pages.name', array());``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => Array``
#. ``(``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``'pages' => array(``
#. ``0 => array('name' => 'main'),``
#. ``1 => array('name' => 'about')``
#. ``)``
#. ``);``
#. ``$result = Set::insert($a, 'pages.1.vars', array('title' => 'page title'));``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[name] => main``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[name] => about``
#. ``[vars] => Array``
#. ``(``
#. ``[title] => page title``
#. ``)``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
