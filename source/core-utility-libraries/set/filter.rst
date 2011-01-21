8.5.19 filter
-------------

``array Set::filter ($var, $isArray=null)``

Filters empty elements out of a route array, excluding '0'.

::

    $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));
    
    /* $res now looks like: 
        Array (
            [0] => 0
            [2] => 1
            [3] => 0
            [4] => Array
                (
                    [0] => one thing
                    [1] => I can tell you
                    [2] => is you got to be
                    [3] => 
                )
        )
    */


#. ``$res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));``
#. ``/* $res now looks like:``
#. ``Array (``
#. ``[0] => 0``
#. ``[2] => 1``
#. ``[3] => 0``
#. ``[4] => Array``
#. ``(``
#. ``[0] => one thing``
#. ``[1] => I can tell you``
#. ``[2] => is you got to be``
#. ``[3] =>``
#. ``)``
#. ``)``
#. ``*/``

8.5.19 filter
-------------

``array Set::filter ($var, $isArray=null)``

Filters empty elements out of a route array, excluding '0'.

::

    $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));
    
    /* $res now looks like: 
        Array (
            [0] => 0
            [2] => 1
            [3] => 0
            [4] => Array
                (
                    [0] => one thing
                    [1] => I can tell you
                    [2] => is you got to be
                    [3] => 
                )
        )
    */


#. ``$res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));``
#. ``/* $res now looks like:``
#. ``Array (``
#. ``[0] => 0``
#. ``[2] => 1``
#. ``[3] => 0``
#. ``[4] => Array``
#. ``(``
#. ``[0] => one thing``
#. ``[1] => I can tell you``
#. ``[2] => is you got to be``
#. ``[3] =>``
#. ``)``
#. ``)``
#. ``*/``
