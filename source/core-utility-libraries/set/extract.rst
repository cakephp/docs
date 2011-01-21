8.5.13 extract
--------------

``array Set::extract ($path, $data=null, $options=array())``

Set::extract uses basic XPath 2.0 syntax to return subsets of your
data from a find or a find all. This function allows you to
retrieve your data quickly without having to loop through multi
dimentional arrays or traverse through tree structures.

If $path is an array or $data is empty it the call is delegated to
Set::classicExtract.

::

    // Common Usage:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // results returns:
    // array(1,2,3,4,5,...);

Currently implemented selectors:

Selector
Note
/User/id
Similar to the classic {n}.User.id
/User[2]/name
Selects the name of the second User
/User[id<2]
Selects all Users with an id < 2
/User[id>2][<5]
Selects all Users with an id > 2 but
5
/Post/Comment[author\_name=john]/../name
Selects the name of all Posts that have at least one Comment
written by john
/Posts[title]
Selects all Posts that have a 'title' key
/Comment/.[1]
Selects the contents of the first comment
/Comment/.[:last]
Selects the last comment
/Comment/.[:first]
Selects the first comment
/Comment[text=/cakephp/i]
Selects all comments that have a text matching the regex /cakephp/i
/Comment/@\*
Selects the key names of all comments
Currently only absolute paths starting with a single '/' are
supported. Please report any bugs as you find them. Suggestions for
additional features are welcome.

To learn more about Set::extract() refer to function testExtract()
in /cake/tests/cases/libs/set.test.php.

8.5.13 extract
--------------

``array Set::extract ($path, $data=null, $options=array())``

Set::extract uses basic XPath 2.0 syntax to return subsets of your
data from a find or a find all. This function allows you to
retrieve your data quickly without having to loop through multi
dimentional arrays or traverse through tree structures.

If $path is an array or $data is empty it the call is delegated to
Set::classicExtract.

::

    // Common Usage:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // results returns:
    // array(1,2,3,4,5,...);

Currently implemented selectors:

Selector
Note
/User/id
Similar to the classic {n}.User.id
/User[2]/name
Selects the name of the second User
/User[id<2]
Selects all Users with an id < 2
/User[id>2][<5]
Selects all Users with an id > 2 but
5
/Post/Comment[author\_name=john]/../name
Selects the name of all Posts that have at least one Comment
written by john
/Posts[title]
Selects all Posts that have a 'title' key
/Comment/.[1]
Selects the contents of the first comment
/Comment/.[:last]
Selects the last comment
/Comment/.[:first]
Selects the first comment
/Comment[text=/cakephp/i]
Selects all comments that have a text matching the regex /cakephp/i
/Comment/@\*
Selects the key names of all comments
Currently only absolute paths starting with a single '/' are
supported. Please report any bugs as you find them. Suggestions for
additional features are welcome.

To learn more about Set::extract() refer to function testExtract()
in /cake/tests/cases/libs/set.test.php.
