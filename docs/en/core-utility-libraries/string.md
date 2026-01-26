# CakeText

`class` **CakeText**

The CakeText class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
`CakeText::uuid()`.

::: info Deprecated in version 2.7
The `String` class was deprecated in 2.7 in favour of the `CakeText` class. While the `String` class is still available for backwards compatibility, using `CakeText` is recommended as it offers compatibility with PHP7 and HHVM.
:::

If you need `TextHelper` functionalities outside of a `View`,
use the `CakeText` class:

``` php
class UsersController extends AppController {

    public $components = array('Auth');

    public function afterLogin() {
        App::uses('CakeText', 'Utility');
        $message = $this->User->find('new_message');
        if (!empty($message)) {
            // notify user of new message
            $this->Session->setFlash(__('You have a new message: %s', CakeText::truncate($message['Message']['body'], 255, array('html' => true))));
        }
    }
}
```

::: info Changed in version 2.1
Several methods from `TextHelper` have been moved to `CakeText` class.
:::

`static` CakeText::**uuid**()

The UUID method is used to generate unique identifiers as per
`4122`. The UUID is a
128bit string in the format of
485fc381-e790-47a3-9794-1337c0a8fe68.

``` php
CakeText::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68
```

`static` CakeText::**tokenize**($data, $separator = ',', $leftBound = '(', $rightBound = ')')

Tokenizes a string using `$separator`, ignoring any instance of
`$separator` that appears between `$leftBound` and `$rightBound`.

This method can be useful when splitting up data in that has regular
formatting such as tag lists:

``` php
$data = "cakephp 'great framework' php";
$result = CakeText::tokenize($data, ' ', "'", "'");
// result contains
array('cakephp', "'great framework'", 'php');
```

`static` CakeText::**insert**($string, $data, $options = array())

The insert method is used to create string templates and to allow
for key/value replacements:

``` php
CakeText::insert('My name is :name and I am :age years old.', array('name' => 'Bob', 'age' => '65'));
// generates: "My name is Bob and I am 65 years old."
```

`static` CakeText::**cleanInsert**($string, $options = array())

Cleans up a `CakeText::insert` formatted string with given \$options
depending on the 'clean' key in \$options. The default method used
is text but html is also available. The goal of this function is to
replace all whitespace and unneeded markup around placeholders that
did not get replaced by Set::insert.

You can use the following options in the options array:

``` php
$options = array(
    'clean' => array(
        'method' => 'text', // or html
    ),
    'before' => '',
    'after' => ''
);
```

`static` CakeText::**wrap**($text, $options = array())

Wraps a block of text to a set width, and indent blocks as well.
Can intelligently wrap text so words are not sliced across lines:

``` php
$text = 'This is the song that never ends.';
$result = CakeText::wrap($text, 22);

// returns
This is the song
that never ends.
```

You can provide an array of options that control how wrapping is done. The
supported options are:

- `width` The width to wrap to. Defaults to 72.
- `wordWrap` Whether or not to wrap whole words. Defaults to true.
- `indent` The character to indent lines with. Defaults to ''.
- `indentAt` The line number to start indenting text. Defaults to 0.

<!-- start-string -->

`method` CakeText::**highlight**(string $haystack, string $needle, array $options = array() )

`method` CakeText::**stripLinks**($text)

`method` CakeText::**truncate**(string $text, int $length=100, array $options)

::: info Changed in version 2.3
`ending` has been replaced by `ellipsis`. `ending` is still used in 2.2.1
:::

`method` CakeText::**tail**(string $text, int $length=100, array $options)

`method` CakeText::**excerpt**(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

`method` CakeText::**toList**(array $list, $and='and')

<!-- end-string -->
