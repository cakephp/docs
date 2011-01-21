8.5.6 normalize
---------------

``array Set::normalize ($list, $assoc = true, $sep = ',', $trim = true)``

Normalizes a string or array list.

::

    $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')));
    $b =  array('Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional');
    $result = Set::normalize($a);
    /* $result now looks like:
        Array
        (
            [Tree] => 
            [CounterCache] => 
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
                )
        )
    */
    $result = Set::normalize($b);
    /* $result now looks like:
        Array
        (
            [Cacheable] => Array
                (
                    [enabled] => 
                )
    
            [Limit] => 
            [Bindable] => 
            [Validator] => 
            [Transactional] => 
        )
    */
    $result = Set::merge($a, $b); // Now merge the two and normalize
    /* $result now looks like:
        Array
        (
            [0] => Tree
            [1] => CounterCache
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
    
                )
            [Cacheable] => Array
                (
                    [enabled] => 
                )
            [2] => Limit
            [3] => Bindable
            [4] => Validator
            [5] => Transactional
        )
    */
    $result = Set::normalize(Set::merge($a, $b));
    /* $result now looks like:
        Array
        (
            [Tree] => 
            [CounterCache] => 
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
    
                )
            [Cacheable] => Array
                (
                    [enabled] => 
                )
            [Limit] => 
            [Bindable] => 
            [Validator] => 
            [Transactional] => 
        )
    */

8.5.6 normalize
---------------

``array Set::normalize ($list, $assoc = true, $sep = ',', $trim = true)``

Normalizes a string or array list.

::

    $a = array('Tree', 'CounterCache',
            'Upload' => array(
                'folder' => 'products',
                'fields' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')));
    $b =  array('Cacheable' => array('enabled' => false),
            'Limit',
            'Bindable',
            'Validator',
            'Transactional');
    $result = Set::normalize($a);
    /* $result now looks like:
        Array
        (
            [Tree] => 
            [CounterCache] => 
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
                )
        )
    */
    $result = Set::normalize($b);
    /* $result now looks like:
        Array
        (
            [Cacheable] => Array
                (
                    [enabled] => 
                )
    
            [Limit] => 
            [Bindable] => 
            [Validator] => 
            [Transactional] => 
        )
    */
    $result = Set::merge($a, $b); // Now merge the two and normalize
    /* $result now looks like:
        Array
        (
            [0] => Tree
            [1] => CounterCache
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
    
                )
            [Cacheable] => Array
                (
                    [enabled] => 
                )
            [2] => Limit
            [3] => Bindable
            [4] => Validator
            [5] => Transactional
        )
    */
    $result = Set::normalize(Set::merge($a, $b));
    /* $result now looks like:
        Array
        (
            [Tree] => 
            [CounterCache] => 
            [Upload] => Array
                (
                    [folder] => products
                    [fields] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
    
                )
            [Cacheable] => Array
                (
                    [enabled] => 
                )
            [Limit] => 
            [Bindable] => 
            [Validator] => 
            [Transactional] => 
        )
    */
