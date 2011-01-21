8.5.10 remove
-------------

``array Set::remove ($list, $path = null)``

Removes an element from a Set or array as defined by $path.

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );
    
    $result = Set::remove($a, 'files');
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
    
        )
    */


#. ``$a = array(``
#. ``'pages'     => array('name' => 'page'),``
#. ``'files'        => array('name' => 'files')``
#. ``);``
#. ``$result = Set::remove($a, 'files');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => page``
#. ``)``
#. ``)``
#. ``*/``

8.5.10 remove
-------------

``array Set::remove ($list, $path = null)``

Removes an element from a Set or array as defined by $path.

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );
    
    $result = Set::remove($a, 'files');
    /* $result now looks like: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )
    
        )
    */


#. ``$a = array(``
#. ``'pages'     => array('name' => 'page'),``
#. ``'files'        => array('name' => 'files')``
#. ``);``
#. ``$result = Set::remove($a, 'files');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[pages] => Array``
#. ``(``
#. ``[name] => page``
#. ``)``
#. ``)``
#. ``*/``
