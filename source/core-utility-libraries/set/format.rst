8.5.14 format
-------------

``array Set::format ($data, $format, $keys)``

Returns a series of values extracted from an array, formatted in a
format string.

::

    $data = array(
        array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
        array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
        array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));
    
    $res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));
    /*
    Array
    (
        [0] => Abele, Nate
        [1] => Masters, Larry
        [2] => Woodworth, Garrett
    )
    */
    
    $res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => Boston, MA
        [1] => Boondock, TN
        [2] => Venice Beach, CA
    )
    */
    $res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => {Boston, MA}
        [1] => {Boondock, TN}
        [2] => {Venice Beach, CA}
    )
    */
    $res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));
    /*
    Array
    (
        [0] => {42, 42}
        [1] => {0, {0}}
        [2] => {0, {1}}
    )
    */
    $res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => 42, Nate
        [1] => 0, Larry
        [2] => 0, Garrett
    )
    */
    $res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => Nate, 42
        [1] => Larry, 0
        [2] => Garrett, 0
    )
    */


#. ``$data = array(``
#. ``array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),``
#. ``array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),``
#. ``array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));``
#. ``$res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Abele, Nate``
#. ``[1] => Masters, Larry``
#. ``[2] => Woodworth, Garrett``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Boston, MA``
#. ``[1] => Boondock, TN``
#. ``[2] => Venice Beach, CA``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => {Boston, MA}``
#. ``[1] => {Boondock, TN}``
#. ``[2] => {Venice Beach, CA}``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => {42, 42}``
#. ``[1] => {0, {0}}``
#. ``[2] => {0, {1}}``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => 42, Nate``
#. ``[1] => 0, Larry``
#. ``[2] => 0, Garrett``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Nate, 42``
#. ``[1] => Larry, 0``
#. ``[2] => Garrett, 0``
#. ``)``
#. ``*/``

8.5.14 format
-------------

``array Set::format ($data, $format, $keys)``

Returns a series of values extracted from an array, formatted in a
format string.

::

    $data = array(
        array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
        array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
        array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));
    
    $res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));
    /*
    Array
    (
        [0] => Abele, Nate
        [1] => Masters, Larry
        [2] => Woodworth, Garrett
    )
    */
    
    $res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => Boston, MA
        [1] => Boondock, TN
        [2] => Venice Beach, CA
    )
    */
    $res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => {Boston, MA}
        [1] => {Boondock, TN}
        [2] => {Venice Beach, CA}
    )
    */
    $res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));
    /*
    Array
    (
        [0] => {42, 42}
        [1] => {0, {0}}
        [2] => {0, {1}}
    )
    */
    $res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => 42, Nate
        [1] => 0, Larry
        [2] => 0, Garrett
    )
    */
    $res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => Nate, 42
        [1] => Larry, 0
        [2] => Garrett, 0
    )
    */


#. ``$data = array(``
#. ``array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),``
#. ``array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),``
#. ``array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));``
#. ``$res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Abele, Nate``
#. ``[1] => Masters, Larry``
#. ``[2] => Woodworth, Garrett``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Boston, MA``
#. ``[1] => Boondock, TN``
#. ``[2] => Venice Beach, CA``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => {Boston, MA}``
#. ``[1] => {Boondock, TN}``
#. ``[2] => {Venice Beach, CA}``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => {42, 42}``
#. ``[1] => {0, {0}}``
#. ``[2] => {0, {1}}``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => 42, Nate``
#. ``[1] => 0, Larry``
#. ``[2] => 0, Garrett``
#. ``)``
#. ``*/``
#. ``$res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));``
#. ``/*``
#. ``Array``
#. ``(``
#. ``[0] => Nate, 42``
#. ``[1] => Larry, 0``
#. ``[2] => Garrett, 0``
#. ``)``
#. ``*/``
