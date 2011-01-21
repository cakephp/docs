8.5.9 check
-----------

``boolean/array Set::check ($data, $path = null)``

Checks if a particular path is set in an array. If $path is empty,
$data will be returned instead of a boolean value.

::

    $set = array(
        'My Index 1' => array('First' => 'The first item')
    );
    $result = Set::check($set, 'My Index 1.First');
    // $result == True
    $result = Set::check($set, 'My Index 1');
    // $result == True
    $result = Set::check($set, array());
    // $result == array('My Index 1' => array('First' => 'The first item'))
    $set = array(
        'My Index 1' => array('First' => 
            array('Second' => 
                array('Third' => 
                    array('Fourth' => 'Heavy. Nesting.'))))
    );
    $result = Set::check($set, 'My Index 1.First.Second');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Second.Third');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Second.Third.Fourth');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Seconds.Third.Fourth');
    // $result == False

8.5.9 check
-----------

``boolean/array Set::check ($data, $path = null)``

Checks if a particular path is set in an array. If $path is empty,
$data will be returned instead of a boolean value.

::

    $set = array(
        'My Index 1' => array('First' => 'The first item')
    );
    $result = Set::check($set, 'My Index 1.First');
    // $result == True
    $result = Set::check($set, 'My Index 1');
    // $result == True
    $result = Set::check($set, array());
    // $result == array('My Index 1' => array('First' => 'The first item'))
    $set = array(
        'My Index 1' => array('First' => 
            array('Second' => 
                array('Third' => 
                    array('Fourth' => 'Heavy. Nesting.'))))
    );
    $result = Set::check($set, 'My Index 1.First.Second');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Second.Third');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Second.Third.Fourth');
    // $result == True
    $result = Set::check($set, 'My Index 1.First.Seconds.Third.Fourth');
    // $result == False
