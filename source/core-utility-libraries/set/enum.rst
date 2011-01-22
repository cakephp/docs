8.5.15 enum
-----------

``string Set::enum ($select, $list=null)``

The enum method works well when using html select elements. It
returns a value from an array list if the key exists.

If a comma separated $list is passed arrays are numeric with the
key of the first being 0 $list = 'no, yes' would translate to $list
= array(0 => 'no', 1 => 'yes');

If an array is used, keys can be strings example: array('no' => 0,
'yes' => 1);

$list defaults to 0 = no 1 = yes if param is not passed

::

    $res = Set::enum(1, 'one, two');
    // $res is 'two'
    
    $res = Set::enum('no', array('no' => 0, 'yes' => 1));
    // $res is 0
    
    $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
    // $res is 'one'
