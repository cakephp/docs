# Text

`class` Cake\\Utility\\**Text**

The Text class includes convenience methods for creating and manipulating
strings and is normally accessed statically. Example:
`Text::uuid()`.

If you need `Cake\View\Helper\TextHelper` functionalities outside
of a `View`, use the `Text` class:

``` php
namespace App\Controller;

use Cake\Utility\Text;

class UsersController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth')
    };

    public function afterLogin()
    {
        $message = $this->Users->find('new_message')->first();
        if (!empty($message)) {
            // Notify user of new message
            $this->Flash->success(__(
                'You have a new message: {0}',
                Text::truncate($message['Message']['body'], 255, ['html' => true])
            ));
        }
    }
}
```

## Convert Strings into ASCII

`static` Cake\\Utility\\Text::**transliterate**($string, $transliteratorId = null)

Transliterate by default converts all characters in provided string into
equivalent ASCII characters. The method expects UTF-8 encoding. The character
conversion can be controlled using transliteration identifiers which you can
pass using the `$transliteratorId` argument or change the default identifier
string using `Text::setTransliteratorId()`. ICU transliteration identifiers
are basically of form `<source script>:<target script>` and you can specify
multiple conversion pairs separated by `;`. You can find more info about
transliterator identifiers
[here](https://unicode-org.github.io/icu/userguide/transforms/general/#transliterator-identifiers):

``` php
// apple puree
Text::transliterate('apple purée');

// Ubermensch (only latin characters are transliterated)
Text::transliterate('Übérmensch', 'Latin-ASCII;');
```

## Creating URL Safe Strings

`static` Cake\\Utility\\Text::**slug**(string $string, array|string $options = [])

Slug transliterates all characters into ASCII versions and converting unmatched
characters and spaces to dashes. The slug method expects UTF-8 encoding.

You can provide an array of options that controls slug. `$options` can also be
a string in which case it will be used as replacement string. The supported
options are:

- `replacement` Replacement string, defaults to '-'.

- `transliteratorId` A valid tranliterator id string. If default `null`
  `Text::$_defaultTransliteratorId` to be used.
  If `false` no transliteration will be done, only non words will be removed.

- `preserve` Specific non-word character to preserve. Defaults to `null`.
  For example, this option can be set to '.' to generate clean file names:

  ``` php
  // apple-puree
  Text::slug('apple purée');

  // apple_puree
  Text::slug('apple purée', '_');

  // foo-bar.tar.gz
  Text::slug('foo bar.tar.gz', ['preserve' => '.']);
  ```

## Generating UUIDs

`static` Cake\\Utility\\Text::**uuid**()

The UUID method is used to generate unique identifiers as per `4122`. The
UUID is a 128-bit string in the format of
`485fc381-e790-47a3-9794-1337c0a8fe68`. :

``` php
Text::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68
```

::: info Added in version 5.3.0
You can now configure a custom UUID generator using dependency injection.
:::

Starting from CakePHP 5.3.0, you can configure a custom UUID generator by
setting a closure in your configuration:

``` php
// In your config/app.php or config/bootstrap.php
use Cake\Core\Configure;

Configure::write('Text.uuidGenerator', function () {
    // Return your custom UUID string
    return \MyUuidLibrary::generate();
});
```

This allows you to integrate your own UUID generation strategy or use
third-party UUID libraries. When a custom generator is configured, it will
be used instead of the default UUID generation method.

## Simple String Parsing

`static` Cake\\Utility\\Text::**tokenize**(string $data, string $separator = ',', string $leftBound = '(', string $rightBound = ')')

Tokenizes a string using `$separator`, ignoring any instance of `$separator`
that appears between `$leftBound` and `$rightBound`.

This method can be useful when splitting up data that has regular formatting
such as tag lists:

``` php
$data = "cakephp 'great framework' php";
$result = Text::tokenize($data, ' ', "'", "'");
// Result contains
['cakephp', "'great framework'", 'php'];
```

`method` Cake\\Utility\\Text::**parseFileSize**(string $size, mixed $default = false)

This method unformats a number from a human-readable byte size to an integer
number of bytes:

``` php
$int = Text::parseFileSize('2GB');
```

## Formatting Strings

`static` Cake\\Utility\\Text::**insert**(string $str, array $data, array $options = [])

The insert method is used to create string templates and to allow for key/value
replacements:

``` php
Text::insert(
    'My name is :name and I am :age years old.',
    ['name' => 'Bob', 'age' => '65']
);
// Returns: "My name is Bob and I am 65 years old."
```

`static` Cake\\Utility\\Text::**cleanInsert**(string $str, array $options)

Cleans up a `Text::insert` formatted string with given `$options` depending
on the 'clean' key in `$options`. The default method used is text but html is
also available. The goal of this function is to replace all whitespace and
unneeded markup around placeholders that did not get replaced by
`Text::insert`.

You can use the following options in the options array:

``` php
$options = [
    'clean' => [
        'method' => 'text', // or html
    ],
    'before' => '',
    'after' => ''
];
```

## Wrapping Text

`static` Cake\\Utility\\Text::**wrap**(string $text, array|int $options = [])

Wraps a block of text to a set width and indents blocks as well.
Can intelligently wrap text so words are not sliced across lines:

``` php
$text = 'This is the song that never ends.';
$result = Text::wrap($text, 22);

// Returns
This is the song that
never ends.
```

You can provide an array of options that control how wrapping is done. The
supported options are:

- `width` The width to wrap to. Defaults to 72.
- `wordWrap` Whether or not to wrap whole words. Defaults to `true`.
- `indent` The character to indent lines with. Defaults to ''.
- `indentAt` The line number to start indenting text. Defaults to 0.

`static` Cake\\Utility\\Text::**wrapBlock**(string $text, array|int $options = [])

If you need to ensure that the total width of the generated block won't
exceed a certain length even with internal indentation, you need to use
`wrapBlock()` instead of `wrap()`. This is particularly useful to generate
text for the console for example. It accepts the same options as `wrap()`:

``` php
$text = 'This is the song that never ends. This is the song that never ends.';
$result = Text::wrapBlock($text, [
    'width' => 22,
    'indent' => ' → ',
    'indentAt' => 1
]);

// Returns
This is the song that
 → never ends. This
 → is the song that
 → never ends.
```

<!-- start-text -->

## Highlighting Substrings

`method` Cake\\Utility\\Text::**highlight**(string $text, array|string $phrase, array $options = [])

Highlights `$phrase` in `$text` using the `$options['format']` string
specified or a default string.

Options:

- `format` string - The piece of HTML with the phrase that will be
  highlighted
- `html` bool - If `true`, will ignore any HTML tags, ensuring that only
  the correct text is highlighted

Example:

``` php
// Called as TextHelper
echo $this->Text->highlight(
    $lastSentence,
    'using',
    ['format' => '<span class="highlight">\1</span>']
);

// Called as Text
use Cake\Utility\Text;

echo Text::highlight(
    $lastSentence,
    'using',
    ['format' => '<span class="highlight">\1</span>']
);
```

Output:

> Highlights \$phrase in \$text \<span class="highlight"\>using\</span\> the
> \$options\['format'\] string specified or a default string.

## Truncating Text

`method` Cake\\Utility\\Text::**truncate**(string $text, int $length = 100, array $options = [])

If `$text` is longer than `$length`, this method truncates it at `$length`
and adds a suffix consisting of `'ellipsis'`, if defined. If `'exact'` is
passed as `false`, the truncation will occur at the first whitespace after the
point at which `$length` is exceeded. If `'html'` is passed as `true`,
HTML tags will be respected and will not be cut off.

`$options` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

``` php
[
    'ellipsis' => '...',
    'exact' => true,
    'html' => false
]
```

Example:

``` php
// Called as TextHelper
echo $this->Text->truncate(
    'The killer crept forward and tripped on the rug.',
    22,
    [
        'ellipsis' => '...',
        'exact' => false
    ]
);

// Called as Text
use Cake\Utility\Text;

echo Text::truncate(
    'The killer crept forward and tripped on the rug.',
    22,
    [
        'ellipsis' => '...',
        'exact' => false
    ]
);
```

Output:

    The killer crept...

## Truncating the Tail of a String

`method` Cake\\Utility\\Text::**tail**(string $text, int $length = 100, array $options = [])

If `$text` is longer than `$length`, this method removes an initial
substring with length consisting of the difference and prepends a prefix
consisting of `'ellipsis'`, if defined. If `'exact'` is passed as `false`,
the truncation will occur at the first whitespace prior to the point at which
truncation would otherwise take place.

`$options` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

``` php
[
    'ellipsis' => '...',
    'exact' => true
]
```

Example:

``` php
$sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
    'a C# program that can divide by zero, death metal t-shirts'

// Called as TextHelper
echo $this->Text->tail(
    $sampleText,
    70,
    [
        'ellipsis' => '...',
        'exact' => false
    ]
);

// Called as Text
use Cake\Utility\Text;

echo Text::tail(
    $sampleText,
    70,
    [
        'ellipsis' => '...',
        'exact' => false
    ]
);
```

Output:

    ...a TV, a C# program that can divide by zero, death metal t-shirts

## Extracting an Excerpt

`method` Cake\\Utility\\Text::**excerpt**(string $text, string $phrase, int $radius = 100, string $ellipsis = '…')

Extracts an excerpt from `$text` surrounding the `$phrase` with a number
of characters on each side determined by `$radius`, and prefix/suffix with
`$ellipsis`. This method is especially handy for search results. The query
string or keywords can be shown within the resulting document. :

``` php
// Called as TextHelper
echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

// Called as Text
use Cake\Utility\Text;

echo Text::excerpt($lastParagraph, 'method', 50, '...');
```

Output:

    ... by $radius, and prefix/suffix with $ellipsis. This method is especially
    handy for search results. The query...

## Converting an Array to Sentence Form

`method` Cake\\Utility\\Text::**toList**(array $list, ?string $and = null, $separator = ', ')

Creates a comma-separated list where the last two items are joined with 'and':

``` php
$colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

// Called as TextHelper
echo $this->Text->toList($colors);

// Called as Text
use Cake\Utility\Text;

echo Text::toList($colors);
```

Output:

    red, orange, yellow, green, blue, indigo and violet

<!-- end-text -->
