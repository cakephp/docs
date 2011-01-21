8.5.7 countDim
--------------

``integer Set::countDim ($array = null, $all = false, $count = 0)``

Counts the dimensions of an array. If $all is set to false (which
is the default) it will only consider the dimension of the first
element in the array.

::

    $data = array('one', '2', 'three');
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => '1.1', '2', '3');
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 2
    
    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data, true);
    // $result == 2
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data);
    // $result == 2
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 3
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => '2.1.1.1'))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 4
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5
    
    $set = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($set, false, 0);
    // $result == 2
    
    $result = Set::countDim($set, true);
    // $result == 5
        

8.5.7 countDim
--------------

``integer Set::countDim ($array = null, $all = false, $count = 0)``

Counts the dimensions of an array. If $all is set to false (which
is the default) it will only consider the dimension of the first
element in the array.

::

    $data = array('one', '2', 'three');
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => '1.1', '2', '3');
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 2
    
    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 1
    
    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data, true);
    // $result == 2
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data);
    // $result == 2
    
    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 3
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => '2.1.1.1'))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 4
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5
    
    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5
    
    $set = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($set, false, 0);
    // $result == 2
    
    $result = Set::countDim($set, true);
    // $result == 5
        
