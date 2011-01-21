8.5.1 Set-compatible Path syntax
--------------------------------

The Path syntax is used by (for example) sort, and is used to
define a path.

Usage example (using Set::sort()):

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */

As you can see in the example above, some things are wrapped in
{}'s, others not. In the table below, you can see which options are
available.

Expression
Definition
{n}
Represents a numeric key
{s}
Represents a string
Foo
Any string (without enclosing brackets) is treated like a string
literal.
{[a-z]+}
Any string enclosed in brackets (besides {n} and {s}) is
interpreted as a regular expression.
This section needs to be expanded.
8.5.1 Set-compatible Path syntax
--------------------------------

The Path syntax is used by (for example) sort, and is used to
define a path.

Usage example (using Set::sort()):

::

    $a = array(
        0 => array('Person' => array('name' => 'Jeff')),
        1 => array('Shirt' => array('color' => 'black'))
    );
    $result = Set::sort($a, '{n}.Person.name', 'asc');
    /* $result now looks like: 
        Array
        (
            [0] => Array
                (
                    [Shirt] => Array
                        (
                            [color] => black
                        )
                )
            [1] => Array
                (
                    [Person] => Array
                        (
                            [name] => Jeff
                        )
                )
        )
    */

As you can see in the example above, some things are wrapped in
{}'s, others not. In the table below, you can see which options are
available.

Expression
Definition
{n}
Represents a numeric key
{s}
Represents a string
Foo
Any string (without enclosing brackets) is treated like a string
literal.
{[a-z]+}
Any string enclosed in brackets (besides {n} and {s}) is
interpreted as a regular expression.
This section needs to be expanded.
