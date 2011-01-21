8.5.3 sort
----------

``array Set::sort ($data, $path, $dir)``

Sorts an array by any value, determined by a Set-compatible path.

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */
    
    $result = Set::sort($a, '{n}.Shirt', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
            [1] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
        )
    */
    
    $result = Set::sort($a, '{n}', 'desc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */
    
    $a = array(
        array(7,6,4),
        array(3,4,5),
        array(3,2,1),
    );
    
    $result = Set::sort($a, '{n}.{n}', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [0] => 3
                    [1] => 2
                    [2] => 1
                )
            [1] => Array
                (
                    [0] => 3
                    [1] => 4
                    [2] => 5
                )
            [2] => Array
                (
                    [0] => 7
                    [1] => 6
                    [2] => 4
                )
        )
    */


#. ``$a = array(``
#. ``0 => array('Person' => array('name' => 'Jeff')),``
#. ``1 => array('Shirt' => array('color' => 'black'))``
#. ``);``
#. ``$result = Set::sort($a, '{n}.Person.name', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::sort($a, '{n}.Shirt', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::sort($a, '{n}', 'desc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``array(7,6,4),``
#. ``array(3,4,5),``
#. ``array(3,2,1),``
#. ``);``
#. ``$result = Set::sort($a, '{n}.{n}', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[0] => 3``
#. ``[1] => 2``
#. ``[2] => 1``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[0] => 3``
#. ``[1] => 4``
#. ``[2] => 5``
#. ``)``
#. ``[2] => Array``
#. ``(``
#. ``[0] => 7``
#. ``[1] => 6``
#. ``[2] => 4``
#. ``)``
#. ``)``
#. ``*/``

8.5.3 sort
----------

``array Set::sort ($data, $path, $dir)``

Sorts an array by any value, determined by a Set-compatible path.

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */
    
    $result = Set::sort($a, '{n}.Shirt', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
            [1] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
        )
    */
    
    $result = Set::sort($a, '{n}', 'desc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */
    
    $a = array(
        array(7,6,4),
        array(3,4,5),
        array(3,2,1),
    );
    
    $result = Set::sort($a, '{n}.{n}', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [0] => 3
                    [1] => 2
                    [2] => 1
                )
            [1] => Array
                (
                    [0] => 3
                    [1] => 4
                    [2] => 5
                )
            [2] => Array
                (
                    [0] => 7
                    [1] => 6
                    [2] => 4
                )
        )
    */


#. ``$a = array(``
#. ``0 => array('Person' => array('name' => 'Jeff')),``
#. ``1 => array('Shirt' => array('color' => 'black'))``
#. ``);``
#. ``$result = Set::sort($a, '{n}.Person.name', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::sort($a, '{n}.Shirt', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::sort($a, '{n}', 'desc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[Shirt] => Array``
#. ``(``
#. ``[color] => black``
#. ``)``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[Person] => Array``
#. ``(``
#. ``[name] => Jeff``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$a = array(``
#. ``array(7,6,4),``
#. ``array(3,4,5),``
#. ``array(3,2,1),``
#. ``);``
#. ``$result = Set::sort($a, '{n}.{n}', 'asc');``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[0] => 3``
#. ``[1] => 2``
#. ``[2] => 1``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[0] => 3``
#. ``[1] => 4``
#. ``[2] => 5``
#. ``)``
#. ``[2] => Array``
#. ``(``
#. ``[0] => 7``
#. ``[1] => 6``
#. ``[2] => 4``
#. ``)``
#. ``)``
#. ``*/``
