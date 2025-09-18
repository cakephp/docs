# CakeText

`class` **CakeText**

The CakeText class includes convenience methods for creating and
manipulating strings and is normally accessed statically. Example:
`CakeText::uuid()`.

<div class="deprecated">

2.7
The `String` class was deprecated in 2.7 in favour of the
`CakeText` class. While the `String` class is still available
for backwards compatibility, using `CakeText` is recommended as it offers
compatibility with PHP7 and HHVM.

</div>

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
Several methods from `TextHelper` have been moved to`CakeText` class.The UUID method is used to generate unique identifiers as per`4122`. The UUID is a128bit string in the format of485fc381-e790-47a3-9794-1337c0a8fe68.Tokenizes a string using `$separator`, ignoring any instance of`$separator` that appears between `$leftBound` and `$rightBound`.This method can be useful when splitting up data in that has regularformatting such as tag lists:The insert method is used to create string templates and to allowfor key/value replacements:Cleans up a `CakeText::insert` formatted string with given $optionsdepending on the 'clean' key in $options. The default method usedis text but html is also available. The goal of this function is toreplace all whitespace and unneeded markup around placeholders thatdid not get replaced by Set::insert.You can use the following options in the options array:Wraps a block of text to a set width, and indent blocks as well.Can intelligently wrap text so words are not sliced across lines:You can provide an array of options that control how wrapping is done. Thesupported options are:
:::

`method` CakeText::**highlight**(string $haystack, string $needle, array $options = array() )

`method` CakeText::**stripLinks**($text)

`method` CakeText::**truncate**(string $text, int $length=100, array $options)

::: info Changed in version 2.3
`ending` has been replaced by `ellipsis`. `ending` is still used in 2.2.1
:::

`method` CakeText::**tail**(string $text, int $length=100, array $options)

`method` CakeText::**excerpt**(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

`method` CakeText::**toList**(array $list, $and='and')
