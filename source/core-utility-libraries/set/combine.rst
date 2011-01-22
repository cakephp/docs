8.5.5 combine
-------------

``array Set::combine ($data, $path1 = null, $path2 = null, $groupPath = null)``

Creates an associative array using a $path1 as the path to build
its keys, and optionally $path2 as path to get the values. If
$path2 is not specified, all values will be initialized to null
(useful for Set::merge). You can optionally group the values by
what is obtained when following the path specified in $groupPath.

::

    
    $result = Set::combine(array(), '{n}.User.id', '{n}.User.Data');
    // $result == array();
    
    $result = Set::combine('', '{n}.User.id', '{n}.User.Data');
    // $result == array();
    
    $a = array(
        array(
            'User' => array(
                'id' => 2, 
                'group_id' => 1,
                'Data' => array(
                    'user' => 'mariano.iglesias',
                    'name' => 'Mariano Iglesias'
                )
            )
        ),
        array(
            'User' => array(
                'id' => 14, 
                'group_id' => 2,
                'Data' => array(
                    'user' => 'phpnut', 
                    'name' => 'Larry E. Masters'
                )
            )
        ),
        array(
            'User' => array(
                'id' => 25, 
                'group_id' => 1,
                'Data' => array(
                    'user' => 'gwoo',
                    'name' => 'The Gwoo'
                )
            )
        )
    );
    $result = Set::combine($a, '{n}.User.id');
    /* $result now looks like: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', '{n}.User.non-existant');
    /* $result now looks like: 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data');
    /* $result now looks like: 
        Array
        (
            [2] => Array
                (
                    [user] => mariano.iglesias
                    [name] => Mariano Iglesias
                )
            [14] => Array
                (
                    [user] => phpnut
                    [name] => Larry E. Masters
                )
            [25] => Array
                (
                    [user] => gwoo
                    [name] => The Gwoo
                )
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name');
    /* $result now looks like: 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data', '{n}.User.group_id');
    /* $result now looks like: 
        Array
        (
            [1] => Array
                (
                    [2] => Array
                        (
                            [user] => mariano.iglesias
                            [name] => Mariano Iglesias
                        )
                    [25] => Array
                        (
                            [user] => gwoo
                            [name] => The Gwoo
                        )
                )
            [2] => Array
                (
                    [14] => Array
                        (
                            [user] => phpnut
                            [name] => Larry E. Masters
                        )
                )
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', '{n}.User.Data.name', '{n}.User.group_id');
    /* $result now looks like: 
        Array
        (
            [1] => Array
                (
                    [2] => Mariano Iglesias
                    [25] => The Gwoo
                )
            [2] => Array
                (
                    [14] => Larry E. Masters
                )
        )
    */
    
    $result = Set::combine($a, '{n}.User.id', array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.group_id');
    /* $result now looks like: 
        Array
        (
            [1] => Array
                (
                    [2] => mariano.iglesias: Mariano Iglesias
                    [25] => gwoo: The Gwoo
                )
            [2] => Array
                (
                    [14] => phpnut: Larry E. Masters
                )
        )       
    */
    
    $result = Set::combine($a, array('{0}: {1}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
    /* $result now looks like: 
        Array
        (
            [mariano.iglesias: Mariano Iglesias] => 2
            [phpnut: Larry E. Masters] => 14
            [gwoo: The Gwoo] => 25
        )
    */
    
    $result = Set::combine($a, array('{1}: {0}', '{n}.User.Data.user', '{n}.User.Data.name'), '{n}.User.id');
    /* $result now looks like: 
        Array
        (
            [Mariano Iglesias: mariano.iglesias] => 2
            [Larry E. Masters: phpnut] => 14
            [The Gwoo: gwoo] => 25
        )       
    */
    
    $result = Set::combine($a, array('%1$s: %2$d', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
    
    /* $result now looks like: 
        Array
        (
            [mariano.iglesias: 2] => Mariano Iglesias
            [phpnut: 14] => Larry E. Masters
            [gwoo: 25] => The Gwoo
        )
    */
    
    $result = Set::combine($a, array('%2$d: %1$s', '{n}.User.Data.user', '{n}.User.id'), '{n}.User.Data.name');
    /* $result now looks like: 
        Array
        (
            [2: mariano.iglesias] => Mariano Iglesias
            [14: phpnut] => Larry E. Masters
            [25: gwoo] => The Gwoo
        )
    */
