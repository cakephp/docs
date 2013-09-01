Text
####

The TextHelper contains methods to make text more usable and friendly in
your views. It aids in enabling links, formatting urls, creating
excerpts of text around chosen words or phrases, highlighting key words
in blocks of text, and to gracefully truncating long stretches of text.

**autoLinkEmails (string $text, array $htmlOptions=array())**

Adds links to the well-formed email addresses in $text, according to any
options defined in $htmlOptions (see HtmlHelper::link()).

::

    $my_text = 'For more information regarding our world-famous pastries and desserts, contact info@example.com'; 
    $linked_text = $text->autoLinkEmails($my_text);

    //$linked_text:
    For more information regarding our world-famous pastries and desserts,
    contact <a href="mailto:info@example.com"><u>info@example.com</u></a>

**autoLinkUrls (string $text, array $htmlOptions=array())**

Same as in autoLinkEmails(), only this method searches for strings that
start with https, http, ftp, or nntp and links them appropriately.

**autoLink (string $text, array $htmlOptions=array())**

Performs the functionality in both autoLinkUrls() and autoLinkEmails()
on the supplied $text. All URLs and emails are linked appropriately
given the supplied $htmlOptions.

**excerpt (string $haystack, string $needle, int $radius=100, string
$ending="...")**

Extracts an excerpt from $haystack surrounding the $needle with a number
of characters on each side determined by $radius, and suffixed with
$ending. This method is especially handy for search results. The query
string or keywords can be shown within the resulting document.

::

    <?php echo $text->excerpt($last_paragraph, 'method', 50); ?> 
    //Output
    mined by $radius, and suffixed with $ending. This method is especially handy for
    search results. The query...

**highlight (string $text, string $phrase, $highlighter= '<span
class="highlight">\\1</span >')**

Highlights $phrase in $text using the $highlighter string specified.

::

    <?php echo $text->highlight($last_sentence, 'using'); ?> 
    //Output
    Highlights $phrase in $text <span class="highlight">using</span>
    the $highlighter string specified.

**stripLinks ($text)**

Strips the supplied $text of any HTML links.

**toList (array $list, $and='and')**

Creates a comma-separated list where the last two items are joined with
‘and’.

::

    <?php echo $text->toList($colors); ?> 

    // Output
    red, orange, yellow, green, blue, indigo and violet

**truncate (string $text, int $length=100, string $ending='...', boolean
$exact=true, boolean $considerHtml=false)**

**truncate (string $text, int $length=100, array $options=array(string
$ending='...', boolean $exact=true, boolean $considerHtml=false))**

**trim(); // an alias for truncate**

Cuts a string to the $length and suffix with $ending if the text is
longer than $length. If $exact is passed as *false*, $text will not be
cut mid-word and the truncation will occur after the previous word
ending. If $considerHtml is passed as *true*, html tags will be
respected and will not be cut off.

::

    <?php    
    echo $text->truncate(
        'The killer crept forward and tripped on the rug.', 
        22,
        '...',
        false
    ); 
    ?> 

::

    //Output:
    The killer crept...

