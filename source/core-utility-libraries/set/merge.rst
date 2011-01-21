8.5.20 merge
------------

``array Set::merge ($arr1, $arr2=null)``

This function can be thought of as a hybrid between PHP's
array\_merge and array\_merge\_recursive. The difference to the two
is that if an array key contains another array then the function
behaves recursive (unlike array\_merge) but does not do if for keys
containing strings (unlike array\_merge\_recursive). See the unit
test for more information.

This function will work with an unlimited amount of arguments and
typecasts non-array parameters into arrays.

::

    $arry1 = array(
        array(
            'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
            'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
            'description' => 'Importing an sql dump'
        ),
        array(
            'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
            'name' => 'pbpaste | grep -i Unpaid | pbcopy',
            'description' => 'Remove all lines that say "Unpaid".',
        )
    );
    $arry2 = 4;
    $arry3 = array(0=>"test array", "cats"=>"dogs", "people" => 1267);
    $arry4 = array("cats"=>"felines", "dog"=>"angry");
    $res = Set::merge($arry1, $arry2, $arry3, $arry4);
    
    /* $res now looks like: 
    Array
    (
        [0] => Array
            (
                [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                [name] => mysql raleigh-workshop-08 < 2008-09-05.sql 
                [description] => Importing an sql dump
            )
    
        [1] => Array
            (
                [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                [name] => pbpaste | grep -i Unpaid | pbcopy
                [description] => Remove all lines that say "Unpaid".
            )
    
        [2] => 4
        [3] => test array
        [cats] => felines
        [people] => 1267
        [dog] => angry
    )
    */

8.5.20 merge
------------

``array Set::merge ($arr1, $arr2=null)``

This function can be thought of as a hybrid between PHP's
array\_merge and array\_merge\_recursive. The difference to the two
is that if an array key contains another array then the function
behaves recursive (unlike array\_merge) but does not do if for keys
containing strings (unlike array\_merge\_recursive). See the unit
test for more information.

This function will work with an unlimited amount of arguments and
typecasts non-array parameters into arrays.

::

    $arry1 = array(
        array(
            'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
            'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
            'description' => 'Importing an sql dump'
        ),
        array(
            'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
            'name' => 'pbpaste | grep -i Unpaid | pbcopy',
            'description' => 'Remove all lines that say "Unpaid".',
        )
    );
    $arry2 = 4;
    $arry3 = array(0=>"test array", "cats"=>"dogs", "people" => 1267);
    $arry4 = array("cats"=>"felines", "dog"=>"angry");
    $res = Set::merge($arry1, $arry2, $arry3, $arry4);
    
    /* $res now looks like: 
    Array
    (
        [0] => Array
            (
                [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                [name] => mysql raleigh-workshop-08 < 2008-09-05.sql 
                [description] => Importing an sql dump
            )
    
        [1] => Array
            (
                [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                [name] => pbpaste | grep -i Unpaid | pbcopy
                [description] => Remove all lines that say "Unpaid".
            )
    
        [2] => 4
        [3] => test array
        [cats] => felines
        [people] => 1267
        [dog] => angry
    )
    */
