8.5.8 diff
----------

``array Set::diff ($val1, $val2 = null)``

Computes the difference between a Set and an array, two Sets, or
two arrays

::

    $a = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about')
    );
    $b = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about'),
        2 => array('name' => 'contact')
    );
    
    $result = Set::diff($a, $b);
    /* $result now looks like: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
        )
    */
    $result = Set::diff(array(), $b);
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    
    $b = array(
        0 => array('name' => 'me'),
        1 => array('name' => 'about')
    );
    
    $result = Set::diff($a, $b);
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
        )
    */

8.5.8 diff
----------

``array Set::diff ($val1, $val2 = null)``

Computes the difference between a Set and an array, two Sets, or
two arrays

::

    $a = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about')
    );
    $b = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about'),
        2 => array('name' => 'contact')
    );
    
    $result = Set::diff($a, $b);
    /* $result now looks like: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
        )
    */
    $result = Set::diff(array(), $b);
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    
    $b = array(
        0 => array('name' => 'me'),
        1 => array('name' => 'about')
    );
    
    $result = Set::diff($a, $b);
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
        )
    */
