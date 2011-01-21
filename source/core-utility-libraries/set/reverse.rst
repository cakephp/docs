8.5.4 reverse
-------------

``array Set::reverse ($object)``

Set::reverse is basically the opposite of Set::map. It converts an
object into an array. If $object is not an object, reverse will
simply return $object.

::

    $result = Set::reverse(null);
    // Null
    $result = Set::reverse(false);
    // false
    $a = array(
        'Post' => array('id'=> 1, 'title' => 'First Post'),
        'Comment' => array(
            array('id'=> 1, 'title' => 'First Comment'),
            array('id'=> 2, 'title' => 'Second Comment')
        ),
        'Tag' => array(
            array('id'=> 1, 'title' => 'First Tag'),
            array('id'=> 2, 'title' => 'Second Tag')
        ),
    );
    $map = Set::map($a); // Turn $a into a class object
    /* $map now looks like:
        stdClass Object
        (
            [_name_] => Post
            [id] => 1
            [title] => First Post
            [Comment] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => First Comment
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => Second Comment
                        )
                )
            [Tag] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => First Tag
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => Second Tag
                        )
                )
        )
    */
    
    $result = Set::reverse($map);
    /* $result now looks like:
        Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [title] => First Post
                    [Comment] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => First Comment
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => Second Comment
                                )
                        )
                    [Tag] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => First Tag
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => Second Tag
                                )
                        )
                )
        )
    */
    
    $result = Set::reverse($a['Post']); // Just return the array
    /* $result now looks like: 
        Array
        (
            [id] => 1
            [title] => First Post
        )
    */
        


#. ``$result = Set::reverse(null);``
#. ``// Null``
#. ``$result = Set::reverse(false);``
#. ``// false``
#. ``$a = array(``
#. ``'Post' => array('id'=> 1, 'title' => 'First Post'),``
#. ``'Comment' => array(``
#. ``array('id'=> 1, 'title' => 'First Comment'),``
#. ``array('id'=> 2, 'title' => 'Second Comment')``
#. ``),``
#. ``'Tag' => array(``
#. ``array('id'=> 1, 'title' => 'First Tag'),``
#. ``array('id'=> 2, 'title' => 'Second Tag')``
#. ``),``
#. ``);``
#. ``$map = Set::map($a); // Turn $a into a class object``
#. ``/* $map now looks like:``
#. ``stdClass Object``
#. ``(``
#. ``[_name_] => Post``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``[Comment] => Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Comment``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Comment``
#. ``)``
#. ``)``
#. ``[Tag] => Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Tag``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Tag``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::reverse($map);``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[Post] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``[Comment] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Comment``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Comment``
#. ``)``
#. ``)``
#. ``[Tag] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Tag``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Tag``
#. ``)``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::reverse($a['Post']); // Just return the array``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``)``
#. ``*/``
#. ````

8.5.4 reverse
-------------

``array Set::reverse ($object)``

Set::reverse is basically the opposite of Set::map. It converts an
object into an array. If $object is not an object, reverse will
simply return $object.

::

    $result = Set::reverse(null);
    // Null
    $result = Set::reverse(false);
    // false
    $a = array(
        'Post' => array('id'=> 1, 'title' => 'First Post'),
        'Comment' => array(
            array('id'=> 1, 'title' => 'First Comment'),
            array('id'=> 2, 'title' => 'Second Comment')
        ),
        'Tag' => array(
            array('id'=> 1, 'title' => 'First Tag'),
            array('id'=> 2, 'title' => 'Second Tag')
        ),
    );
    $map = Set::map($a); // Turn $a into a class object
    /* $map now looks like:
        stdClass Object
        (
            [_name_] => Post
            [id] => 1
            [title] => First Post
            [Comment] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => First Comment
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => Second Comment
                        )
                )
            [Tag] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [title] => First Tag
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [title] => Second Tag
                        )
                )
        )
    */
    
    $result = Set::reverse($map);
    /* $result now looks like:
        Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [title] => First Post
                    [Comment] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => First Comment
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => Second Comment
                                )
                        )
                    [Tag] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [title] => First Tag
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [title] => Second Tag
                                )
                        )
                )
        )
    */
    
    $result = Set::reverse($a['Post']); // Just return the array
    /* $result now looks like: 
        Array
        (
            [id] => 1
            [title] => First Post
        )
    */
        


#. ``$result = Set::reverse(null);``
#. ``// Null``
#. ``$result = Set::reverse(false);``
#. ``// false``
#. ``$a = array(``
#. ``'Post' => array('id'=> 1, 'title' => 'First Post'),``
#. ``'Comment' => array(``
#. ``array('id'=> 1, 'title' => 'First Comment'),``
#. ``array('id'=> 2, 'title' => 'Second Comment')``
#. ``),``
#. ``'Tag' => array(``
#. ``array('id'=> 1, 'title' => 'First Tag'),``
#. ``array('id'=> 2, 'title' => 'Second Tag')``
#. ``),``
#. ``);``
#. ``$map = Set::map($a); // Turn $a into a class object``
#. ``/* $map now looks like:``
#. ``stdClass Object``
#. ``(``
#. ``[_name_] => Post``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``[Comment] => Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Comment``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Comment``
#. ``)``
#. ``)``
#. ``[Tag] => Array``
#. ``(``
#. ``[0] => stdClass Object``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Tag``
#. ``)``
#. ``[1] => stdClass Object``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Tag``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::reverse($map);``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[Post] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``[Comment] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Comment``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Comment``
#. ``)``
#. ``)``
#. ``[Tag] => Array``
#. ``(``
#. ``[0] => Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Tag``
#. ``)``
#. ``[1] => Array``
#. ``(``
#. ``[id] => 2``
#. ``[title] => Second Tag``
#. ``)``
#. ``)``
#. ``)``
#. ``)``
#. ``*/``
#. ``$result = Set::reverse($a['Post']); // Just return the array``
#. ``/* $result now looks like:``
#. ``Array``
#. ``(``
#. ``[id] => 1``
#. ``[title] => First Post``
#. ``)``
#. ``*/``
#. ````
