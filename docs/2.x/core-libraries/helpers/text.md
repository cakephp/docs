# TextHelper

`class` **TextHelper**(View $view, array $settings = array())

The TextHelper contains methods to make text more usable and
friendly in your views. It aids in enabling links, formatting URLs,
creating excerpts of text around chosen words or phrases,
highlighting key words in blocks of text, and gracefully
truncating long stretches of text.

<div class="versionchanged">

2.1
Several `TextHelper` methods have been moved into the `String`
class to allow easier use outside of the `View` layer.
Within a view, these methods are accessible via the <span class="title-ref">TextHelper</span>
class. You can call one as you would call a normal helper method:
`$this->Text->method($args);`.

</div>

`method` TextHelper::**autoLinkEmails**(string $text, array $options=array())

`method` TextHelper::**autoLinkUrls**(string $text, array $options=array())

`method` TextHelper::**autoLink**(string $text, array $options=array())

`method` TextHelper::**autoParagraph**(string $text)

.. php:method:: highlight(string \$haystack, string \$needle, array \$options = array() )

> param string \$haystack  
> The string to search.
>
> param string \$needle  
> The string to find.
>
> param array \$options  
> An array of options, see below.
>
> Highlights `$needle` in `$haystack` using the
> `$options['format']` string specified or a default string.
>
> Options:
>
> - 'format' - string The piece of HTML with that the phrase will be
>   highlighted
> - 'html' - bool If true, will ignore any HTML tags, ensuring that
>   only the correct text is highlighted
>
> Example:
>
> ``` php
> // called as TextHelper
> echo $this->Text->highlight(
>     $lastSentence,
>     'using',
>     array('format' => '<span class="highlight">\1</span>')
> );
>
> // called as CakeText
> App::uses('CakeText', 'Utility');
> echo CakeText::highlight(
>     $lastSentence,
>     'using',
>     array('format' => '<span class="highlight">\1</span>')
> );
> ```
>
> Output:
>
>     Highlights $needle in $haystack <span class="highlight">using</span>
>     the $options['format'] string specified  or a default string.

> Strips the supplied `$text` of any HTML links.

> param string \$text  
> The text to truncate.
>
> param int \$length  
> The length, in characters, beyond which the text should be truncated.
>
> param array \$options  
> An array of options to use.
>
> If `$text` is longer than `$length` characters, this method truncates it
> at `$length` and adds a suffix consisting of `'ellipsis'`, if defined.
> If `'exact'` is passed as `false`, the truncation will occur at the
> first whitespace after the point at which `$length` is exceeded. If
> `'html'` is passed as `true`, HTML tags will be respected and will not
> be cut off.
>
> `$options` is used to pass all extra parameters, and has the
> following possible keys by default, all of which are optional:
>
>     array(
>         'ellipsis' => '...',
>         'exact' => true,
>         'html' => false
>     )
>
> Example:
>
> ``` php
> // called as TextHelper
> echo $this->Text->truncate(
>     'The killer crept forward and tripped on the rug.',
>     22,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
>
> // called as CakeText
> App::uses('CakeText', 'Utility');
> echo CakeText::truncate(
>     'The killer crept forward and tripped on the rug.',
>     22,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
> ```
>
> Output:
>
>     The killer crept...

<div class="versionchanged">

2.3
`ending` has been replaced by `ellipsis`. `ending` is still used in 2.2.1

</div>

> param string \$text  
> The text to truncate.
>
> param int \$length  
> The length, in characters, beyond which the text should be truncated.
>
> param array \$options  
> An array of options to use.
>
> If `$text` is longer than `$length` characters, this method removes an initial
> substring with length consisting of the difference and prepends a prefix
> consisting of `'ellipsis'`, if defined. If `'exact'` is passed as
> `false`, the truncation will occur at the first whitespace prior to the
> point at which truncation would otherwise take place.
>
> `$options` is used to pass all extra parameters, and has the
> following possible keys by default, all of which are optional:
>
>     array(
>         'ellipsis' => '...',
>         'exact' => true
>     )
>
> <div class="versionadded">
>
> 2.3
>
> </div>
>
> Example:
>
> ``` php
> $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
>     'a C# program that can divide by zero, death metal t-shirts'
>
> // called as TextHelper
> echo $this->Text->tail(
>     $sampleText,
>     70,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
>
> // called as CakeText
> App::uses('CakeText', 'Utility');
> echo CakeText::tail(
>     $sampleText,
>     70,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
> ```
>
> Output:
>
>     ...a TV, a C# program that can divide by zero, death metal t-shirts

> param string \$haystack  
> The string to search.
>
> param string \$needle  
> The string to excerpt around.
>
> param int \$radius  
> The number of characters on either side of \$needle you want to include.
>
> param string \$ellipsis  
> Text to append/prepend to the beginning or end of the result.
>
> Extracts an excerpt from `$haystack` surrounding the `$needle`
> with a number of characters on each side determined by `$radius`,
> and prefix/suffix with `$ellipsis`. This method is especially handy for
> search results. The query string or keywords can be shown within
> the resulting document. :
>
> ``` php
> // called as TextHelper
> echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');
>
> // called as CakeText
> App::uses('CakeText', 'Utility');
> echo CakeText::excerpt($lastParagraph, 'method', 50, '...');
> ```
>
> Output:
>
>     ... by $radius, and prefix/suffix with $ellipsis. This method is
>     especially handy for search results. The query...

> param array \$list  
> Array of elements to combine into a list sentence.
>
> param string \$and  
> The word used for the last join.
>
> Creates a comma-separated list where the last two items are joined
> with 'and'. :
>
> ``` php
> // called as TextHelper
> echo $this->Text->toList($colors);
>
> // called as CakeText
> App::uses('CakeText', 'Utility');
> echo CakeText::toList($colors);
> ```
>
> Output:
>
>     red, orange, yellow, green, blue, indigo and violet
