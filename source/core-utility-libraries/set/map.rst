8.5.17 map
----------

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

This method Maps the contents of the Set object to an object
hierarchy while maintaining numeric keys as arrays of objects.

Basically, the map function turns array items into initialized
class objects. By default it turns an array into a stdClass Object,
however you can map values into any type of class. Example:
Set::map($array\_of\_values, 'nameOfYourClass');

::

    $data = array(
        array(
            "IndexedPage" => array(
                "id" => 1,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            )
        ),
        array(
            "IndexedPage" => array(
                "id" => 2,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            ),
        )
    );
    $mapped = Set::map($data);
    
    /* $mapped now looks like:
    
        Array
        (
            [0] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 1
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )
    
            [1] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 2
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )
    
        )
    
    */


#. ``$data = array(``
#. ``array(``
#. ``"IndexedPage" => array(``
#. ``"id" => 1,``
#. ``"url" => 'http://blah.com/',``
#. ``'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',``
#. ``'get_vars' => '',``
#. ``'redirect' => '',``
#. ``'created' => "1195055503",``
#. ``'updated' => "1195055503",``
#. ``)``
#. ``),``
#. ``array(``
#. ``"IndexedPage" => array(``
#. ``"id" => 2,``
#. ``"url" => 'http://blah.com/',``
#. ``'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',``
#. ``'get_vars' => '',``
#. ``'redirect' => '',``
#. ``'created' => "1195055503",``
#. ``'updated' => "1195055503",``
#. ``),``
#. ``)``
#. ``);``
#. ``$mapped = Set::map($data);``
#. ``/* $mapped now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[_name_] => IndexedPage``
#. ``[id] => 1``
#. ``[url] => http://blah.com/``
#. ``[hash] => 68a9f053b19526d08e36c6a9ad150737933816a5``
#. ``[get_vars] =>``
#. ``[redirect] =>``
#. ``[created] => 1195055503``
#. ``[updated] => 1195055503``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[_name_] => IndexedPage``
#. ``[id] => 2``
#. ``[url] => http://blah.com/``
#. ``[hash] => 68a9f053b19526d08e36c6a9ad150737933816a5``
#. ``[get_vars] =>``
#. ``[redirect] =>``
#. ``[created] => 1195055503``
#. ``[updated] => 1195055503``
#. ``)``
#. ``)``
#. ``*/``

Using Set::map() with a custom class for second parameter:

::

    class MyClass {
        function sayHi() {
            echo 'Hi!';
        }
    }
    
    $mapped = Set::map($data, 'MyClass');
    //Now you can access all the properties as in the example above, 
    //but also you can call MyClass's methods
    $mapped->[0]->sayHi();


#. ``class MyClass {``
#. ``function sayHi() {``
#. ``echo 'Hi!';``
#. ``}``
#. ``}``
#. ``$mapped = Set::map($data, 'MyClass');``
#. ``//Now you can access all the properties as in the example above,``
#. ``//but also you can call MyClass's methods``
#. ``$mapped->[0]->sayHi();``

8.5.17 map
----------

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

This method Maps the contents of the Set object to an object
hierarchy while maintaining numeric keys as arrays of objects.

Basically, the map function turns array items into initialized
class objects. By default it turns an array into a stdClass Object,
however you can map values into any type of class. Example:
Set::map($array\_of\_values, 'nameOfYourClass');

::

    $data = array(
        array(
            "IndexedPage" => array(
                "id" => 1,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            )
        ),
        array(
            "IndexedPage" => array(
                "id" => 2,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            ),
        )
    );
    $mapped = Set::map($data);
    
    /* $mapped now looks like:
    
        Array
        (
            [0] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 1
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )
    
            [1] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 2
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )
    
        )
    
    */


#. ``$data = array(``
#. ``array(``
#. ``"IndexedPage" => array(``
#. ``"id" => 1,``
#. ``"url" => 'http://blah.com/',``
#. ``'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',``
#. ``'get_vars' => '',``
#. ``'redirect' => '',``
#. ``'created' => "1195055503",``
#. ``'updated' => "1195055503",``
#. ``)``
#. ``),``
#. ``array(``
#. ``"IndexedPage" => array(``
#. ``"id" => 2,``
#. ``"url" => 'http://blah.com/',``
#. ``'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',``
#. ``'get_vars' => '',``
#. ``'redirect' => '',``
#. ``'created' => "1195055503",``
#. ``'updated' => "1195055503",``
#. ``),``
#. ``)``
#. ``);``
#. ``$mapped = Set::map($data);``
#. ``/* $mapped now looks like:``
#. ``Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[_name_] => IndexedPage``
#. ``[id] => 1``
#. ``[url] => http://blah.com/``
#. ``[hash] => 68a9f053b19526d08e36c6a9ad150737933816a5``
#. ``[get_vars] =>``
#. ``[redirect] =>``
#. ``[created] => 1195055503``
#. ``[updated] => 1195055503``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[_name_] => IndexedPage``
#. ``[id] => 2``
#. ``[url] => http://blah.com/``
#. ``[hash] => 68a9f053b19526d08e36c6a9ad150737933816a5``
#. ``[get_vars] =>``
#. ``[redirect] =>``
#. ``[created] => 1195055503``
#. ``[updated] => 1195055503``
#. ``)``
#. ``)``
#. ``*/``

Using Set::map() with a custom class for second parameter:

::

    class MyClass {
        function sayHi() {
            echo 'Hi!';
        }
    }
    
    $mapped = Set::map($data, 'MyClass');
    //Now you can access all the properties as in the example above, 
    //but also you can call MyClass's methods
    $mapped->[0]->sayHi();


#. ``class MyClass {``
#. ``function sayHi() {``
#. ``echo 'Hi!';``
#. ``}``
#. ``}``
#. ``$mapped = Set::map($data, 'MyClass');``
#. ``//Now you can access all the properties as in the example above,``
#. ``//but also you can call MyClass's methods``
#. ``$mapped->[0]->sayHi();``
