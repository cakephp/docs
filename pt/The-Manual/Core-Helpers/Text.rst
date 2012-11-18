Text
####

O TextHelper contém métodos para tornar texto mais usável e amigável em
suas views. Este helper ajuda a habilitar links, formatar URLs, criar
excertos de texto entre palavras escolhidas ou frases, destacar
palavras-chave em blocos de texto e truncar trechos longos de texto.

**autoLinkEmails (string $text, array $htmlOptions=array())**

Adiciona links para endereços de e-mail bem-formados dentro de $text, de
acordo com quaisquer opções definidas em $htmlOptions (veja
HtmlHelper::link()).

::

    $my_text = 'Para mais informações sobre nossos doces e sobremesas mundialmente famosos, escreva para info@exemplo.com'; 
    $linked_text    = $text->autoLinkEmails($my_text);

    // $linked_text:
    Para mais informações sobre nossos doces e sobremesas mundialmente famosos, escreva para <a href="mailto:info@exemplo.com"><u>info@exemplo.com</u></a>

**autoLinkUrls ( string $text, array $htmlOptions=array() )**

O meso que autoLinkEmails(), exceto que este método procura por strings
que comecem com https, http, ftp, ou nntp e cria links apropriados a
partir delas.

**autoLink (string $text, array $htmlOptions=array())**

Combina a funcionalidade do autoLinkUrls() e do autoLinkEmails() no
texto informado em $text. Todas as URLs e e-mails são linkados
apropriadamente a partir das opções dadas em $htmlOptions.

**excerpt (string $haystack, string $needle, int $radius=100, string
$ending="...")**

Extrai um excerto a partir de $haystack, encapsulando $needle com alguns
caracteres em cada lado determinado por $radius e incluindo um sufixo
$ending. Este método é especialmente útil para resultados de busca. A
string da consulta ou palavras-chave podem ser destacadas dentro do
documento resultante.

::

    <?php echo $text->excerpt($ultimo_paragrafo, 'método', 50); ?> 
    // saída
    o por $radius e incluindo um sufixo $ending. Este método é especialmente útil para resultados de busca. A...

**highlight (string $haystack, string $needle, $highlighter= '<span
class="highlight">\\1</span>')**

Destaca o texto $needle em $haystack usando a string $highlighter
especificada.

::

    <?php echo $text->highlight($ultima_sentenca, 'usando'); ?> 
    // saída
    Destaca o texto $needle em $haystack usando a string <span class="highlight">$highlighter</span> especificada. 

**stripLinks ($text)**

Remove quaisquer links HTML que existam em $text.

**toList (array $list, $and= 'and')**

Cria uma lista de itens separados por vírgula sendo que os últimos dois
itens são unidos por ‘and’.

::

    <?php echo $text->toList($colors); ?> 
    // saída <br />red, orange, yellow, green, blue, indigo and violet

**truncate (string $text, int $length=100, string $ending= '...',
boolean $exact=true, boolean $considerHtml=false)**

**trim(); // um alias para truncate**

Trunca uma string pelo tamanho dado em $length e inclui $ending como
sufixo se o texto for maior do que $length. Se $exact for passado como
*false*, o truncamento vai acontecer depois do final da próxima palavra.
Se $considerHtml for passado como *true*, tags HTML serão respeitadas e
não serão truncadas.

::

    <?php    
    echo $text->truncate(
        'O assassino rastejou para a frente e tropeçou no tapete.',
        22,
        '...',
        false
    ); 
    ?> 

::

     // saída:
    O assassino rastejou...

autoLinkEmails
==============

``autoLinkEmails(string $text, array $htmlOptions=array())``

Adds links to the well-formed email addresses in $text, according to any
options defined in ``$htmlOptions`` (see
`HtmlHelper::link() </pt/view/1442>`_).

::

    $my_text = 'For more information regarding our world-famous pastries and desserts, contact info@example.com';
    $linked_text = $this->Text->autoLinkEmails($my_text);

Output:

::

    For more information regarding our world-famous pastries and desserts,
    contact <a href="mailto:info@example.com">info@example.com</a>

autoLinkUrls
============

``autoLinkUrls(string $text, array $htmlOptions=array())``

Same as in ``autoLinkEmails()``, only this method searches for strings
that start with https, http, ftp, or nntp and links them appropriately.

autoLink
========

``autoLink(string $text, array $htmlOptions=array())``

Performs the functionality in both ``autoLinkUrls()`` and
``autoLinkEmails()`` on the supplied ``$text``. All URLs and emails are
linked appropriately given the supplied ``$htmlOptions``.

excerpt
=======

``excerpt(string $haystack, string $needle, int $radius=100, string $ending="...")``

Extracts an excerpt from ``$haystack`` surrounding the ``$needle`` with
a number of characters on each side determined by ``$radius``, and
suffixed with ``$ending``. This method is especially handy for search
results. The query string or keywords can be shown within the resulting
document.

::

        echo $this->Text->excerpt($last_paragraph, 'method', 50);

Output:

::

    mined by $radius, and suffixed with $ending. This method is especially handy for
    search results. The query...

highlight
=========

``highlight(string $haystack, string $needle, array $options = array() )``

Highlights ``$needle`` in ``$haystack`` using the ``$options['format']``
string specified or a default string.

Options

-  'format' - string The piece of html with that the phrase will be
   highlighted
-  'html' - bool If true, will ignore any HTML tags, ensuring that only
   the correct text is highlighted

::

        echo $this->Text->highlight($last_sentence, 'using',array('format'=>'<span class="highlight">\1</span>');

Output:

::

    Highlights $needle in $haystack <span class="highlight">using</span>
    the $options['format'] string specified  or a default string.

stripLinks
==========

``stripLinks($text)``

Strips the supplied ``$text`` of any HTML links.

toList
======

``toList(array $list, $and='and', $separator=', ')``

Creates a comma-separated list where the last two items are joined with
‘and’.

::

        echo $this->Text->toList($colors);

Output:

::

    red, orange, yellow, green, blue, indigo and violet

truncate
========

``truncate(string $text, int $length=100, array $options)``

Cuts a string to the ``$length`` and adds a suffix with ``'ending'`` if
the text is longer than ``$length``. If ``'exact'`` is passed as
``false``, the truncation will occur after the next word ending. If
``'html'`` is passed as ``true``, html tags will be respected and will
not be cut off.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional:

::

    array(
        'ending' => '...',
        'exact' => true,
        'html' => false
    )

::

    echo $this->Text->truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        array(
            'ending' => '...',
            'exact' => false
        )
    );

Output:

::

    The killer crept...

trim
====

``trim()``

An alias for truncate.
