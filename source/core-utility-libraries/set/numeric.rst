8.5.16 numeric
--------------

``boolean Set::numeric ($array=null)``

Checks to see if all the values in the array are numeric

::

    
        $data = array('one');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array(1 => 'one');
        $res = Set::numeric($data);
    
        // $res is false
        
        $data = array('one');
        $res = Set::numeric($data);
        
        // $res is false
        
        $data = array('one' => 'two');
        $res = Set::numeric($data);
        
        // $res is false
        
        $data = array('one' => 1);
        $res = Set::numeric($data);
        
        // $res is true
        
        $data = array(0);
        $res = Set::numeric($data);
        
        // $res is true
        
        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is false


#. ``$data = array('one');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(1 => 'one');``
#. ``$res = Set::numeric($data);``
#. ``// $res is false``
#. ````
#. ``$data = array('one');``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is false``
#. ````
#. ``$data = array('one' => 'two');``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is false``
#. ````
#. ``$data = array('one' => 1);``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(0);``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('one', 'two', 'three', 'four', 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is false``

8.5.16 numeric
--------------

``boolean Set::numeric ($array=null)``

Checks to see if all the values in the array are numeric

::

    
        $data = array('one');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array(1 => 'one');
        $res = Set::numeric($data);
    
        // $res is false
        
        $data = array('one');
        $res = Set::numeric($data);
        
        // $res is false
        
        $data = array('one' => 'two');
        $res = Set::numeric($data);
        
        // $res is false
        
        $data = array('one' => 1);
        $res = Set::numeric($data);
        
        // $res is true
        
        $data = array(0);
        $res = Set::numeric($data);
        
        // $res is true
        
        $data = array('one', 'two', 'three', 'four', 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is true
        
        $data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');
        $res = Set::numeric(array_keys($data));
        
        // $res is false


#. ``$data = array('one');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(1 => 'one');``
#. ``$res = Set::numeric($data);``
#. ``// $res is false``
#. ````
#. ``$data = array('one');``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is false``
#. ````
#. ``$data = array('one' => 'two');``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is false``
#. ````
#. ``$data = array('one' => 1);``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(0);``
#. ``$res = Set::numeric($data);``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('one', 'two', 'three', 'four', 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('1' => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is true``
#. ````
#. ``$data = array('one', 2 => 'two', 3 => 'three', 4 => 'four', 'a' => 'five');``
#. ``$res = Set::numeric(array_keys($data));``
#. ````
#. ``// $res is false``
