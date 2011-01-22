8.5.11 classicExtract
---------------------

``array Set::classicExtract ($data, $path = null)``

Gets a value from an array or object that is contained in a given
path using an array path syntax, i.e.:


-  "{n}.Person.{[a-z]+}" - Where "{n}" represents a numeric key,
   "Person" represents a string literal
-  "{[a-z]+}" (i.e. any string literal enclosed in brackets besides
   {n} and {s}) is interpreted as a regular expression.

**Example 1**
::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $result = Set::classicExtract($a, '{n}.Article.id');
    /* $result now looks like:
        Array
        (
            [0] => 1
            [1] => 2
            [2] => 3
        )
    */
    $result = Set::classicExtract($a, '{n}.Article.title');
    /* $result now looks like:
        Array
        (
            [0] => Article 1
            [1] => Article 2
            [2] => Article 3
        )
    */
    $result = Set::classicExtract($a, '1.Article.title');
    // $result == "Article 2"
    
    $result = Set::classicExtract($a, '3.Article.title');
    // $result == null

**Example 2**
::

    $a = array(
        0 => array('pages' => array('name' => 'page')),
        1 => array('fruites'=> array('name' => 'fruit')),
        'test' => array(array('name' => 'jippi')),
        'dot.test' => array(array('name' => 'jippi'))
    );
    
    $result = Set::classicExtract($a, '{n}.{s}.name');
    /* $result now looks like: 
    Array
        (
            [0] => Array
                (
                    [0] => page
                )
            [1] => Array
                (
                    [0] => fruit
                )
        )
    */
    $result = Set::classicExtract($a, '{s}.{n}.name');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [0] => jippi
                )
            [1] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{\w+}.{\w+}.name');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
            [test] => Array
                (
                    [0] => jippi
                )
            [dot.test] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{\d+}.{\w+}.name');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
        )
    */
    $result = Set::classicExtract($a,'{n}.{\w+}.name');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
        )
    */
    $result = Set::classicExtract($a,'{s}.{\d+}.name');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [0] => jippi
                )
            [1] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{s}');
    /* $result now looks like: 
        Array
        (
    
            [0] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
            [1] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */
    $result = Set::classicExtract($a,'{[a-z]}');
    /* $result now looks like: 
        Array
        (
            [test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
    
            [dot.test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */
    $result = Set::classicExtract($a, '{dot\.test}.{n}');
    /* $result now looks like: 
        Array
        (
            [dot.test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */
