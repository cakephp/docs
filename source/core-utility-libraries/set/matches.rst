8.5.12 matches
--------------

``boolean Set::matches ($conditions, $data=array(), $i = null, $length=null)``

Set::matches can be used to see if a single item or a given xpath
match certain conditions.

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $res=Set::matches(array('id>2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>=3'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id<=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id<2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>1'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('3'), null, 3);
    // returns true
    $res=Set::matches(array('5'), null, 5);
    // returns true
    $res=Set::matches(array('id'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id', 'title'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('non-existant'), $a[1]['Article']);
    // returns false
    $res=Set::matches('/Article[id=2]', $a);
    // returns true
    $res=Set::matches('/Article[id=4]', $a);
    // returns false
    $res=Set::matches(array(), $a);
    // returns true
