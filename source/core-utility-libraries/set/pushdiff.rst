8.5.18 pushDiff
---------------

``array Set::pushDiff ($array1, $array2)``

This function merges two arrays and pushes the differences in
array2 to the bottom of the resultant array.

**Example 1**
::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
    $res = Set::pushDiff($array1, $array2);
    
    /* $res now looks like: 
        Array
        (
            [ModelOne] => Array
                (
                    [id] => 1001
                    [field_one] => a1.m1.f1
                    [field_two] => a1.m1.f2
                    [field_three] => a3.m1.f3
                )
        )           
    */


#. ``$array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));``
#. ``$array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));``
#. ``$res = Set::pushDiff($array1, $array2);``
#. ``/* $res now looks like:``
#. ``Array``
#. ``(``
#. ``[ModelOne] => Array``
#. ``(``
#. ``[id] => 1001``
#. ``[field_one] => a1.m1.f1``
#. ``[field_two] => a1.m1.f2``
#. ``[field_three] => a3.m1.f3``
#. ``)``
#. ``)``
#. ``*/``

**Example 2**
::

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
    $res = Set::pushDiff($array1, $array2);
    /* $res now looks like: 
        Array
        (
            [a] => b
            [1] => 20938
            [c] => string
            [b] => b
            [3] => 238
            [4] => Array
                (
                    [0] => extra_field
                )
        )
    */


#. ``$array1 = array("a"=>"b", 1 => 20938, "c"=>"string");``
#. ``$array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));``
#. ``$res = Set::pushDiff($array1, $array2);``
#. ``/* $res now looks like:``
#. ``Array``
#. ``(``
#. ``[a] => b``
#. ``[1] => 20938``
#. ``[c] => string``
#. ``[b] => b``
#. ``[3] => 238``
#. ``[4] => Array``
#. ``(``
#. ``[0] => extra_field``
#. ``)``
#. ``)``
#. ``*/``

8.5.18 pushDiff
---------------

``array Set::pushDiff ($array1, $array2)``

This function merges two arrays and pushes the differences in
array2 to the bottom of the resultant array.

**Example 1**
::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
    $res = Set::pushDiff($array1, $array2);
    
    /* $res now looks like: 
        Array
        (
            [ModelOne] => Array
                (
                    [id] => 1001
                    [field_one] => a1.m1.f1
                    [field_two] => a1.m1.f2
                    [field_three] => a3.m1.f3
                )
        )           
    */


#. ``$array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));``
#. ``$array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));``
#. ``$res = Set::pushDiff($array1, $array2);``
#. ``/* $res now looks like:``
#. ``Array``
#. ``(``
#. ``[ModelOne] => Array``
#. ``(``
#. ``[id] => 1001``
#. ``[field_one] => a1.m1.f1``
#. ``[field_two] => a1.m1.f2``
#. ``[field_three] => a3.m1.f3``
#. ``)``
#. ``)``
#. ``*/``

**Example 2**
::

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
    $res = Set::pushDiff($array1, $array2);
    /* $res now looks like: 
        Array
        (
            [a] => b
            [1] => 20938
            [c] => string
            [b] => b
            [3] => 238
            [4] => Array
                (
                    [0] => extra_field
                )
        )
    */


#. ``$array1 = array("a"=>"b", 1 => 20938, "c"=>"string");``
#. ``$array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));``
#. ``$res = Set::pushDiff($array1, $array2);``
#. ``/* $res now looks like:``
#. ``Array``
#. ``(``
#. ``[a] => b``
#. ``[1] => 20938``
#. ``[c] => string``
#. ``[b] => b``
#. ``[3] => 238``
#. ``[4] => Array``
#. ``(``
#. ``[0] => extra_field``
#. ``)``
#. ``)``
#. ``*/``
