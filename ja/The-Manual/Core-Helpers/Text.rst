Text
####

TextHelper
はビューにおいてテキストをより便利で使いやすくするメソッドを持っています。
リンクを有効にする、 URL
をフォーマットする、選択した単語やフレーズの抜粋を作成する、テキストの塊からキーワードをハイライトする、テキストの長さを段階的に切り詰める、といったことを補助します。

**autoLinkEmails (string $text, array $htmlOptions=array())**

$text の中にある電子メールアドレスに、 $htmlOptions
のオプションの定義に一致するよう、リンクを設けます。 $htmlOptions
については HtmlHelper::link() を参照してください。

::

    $my_text = '世界で名高いパイやデザートについて詳細な情報は、 info@example.com にお問い合わせください。'; 
    $linked_text    = $text->autoLinkEmails($my_text);

    //$linked_text:
    世界で名高いパイやデザートについて詳細な情報は、
     <a href=”mailto:info@example.com"><u>info@example.com</u></a> にお問い合わせください。

**autoLinkUrls ( string $text, array $htmlOptions=array() )**

autoLinkEmails() と同じように動作します。このメソッドは https 、 http 、
ftp 、 または nntp
から始まる文字列を探し、それらに適切なリンクを設定します。

**autoLink (string $text, array $htmlOptions=array())**

与えられた $text に対して、 autoLinkUrls() と autoLinkEmails()
を両方実行したように振舞います。全ての URL
と電子メールアドレスは与えられた $htmlOptions
に従い適切にリンクが生成されます。

**excerpt (string $haystack, string $needle, int $radius=100, string
$ending="...")**

$haystack から $needle の周りを、 $radius
で決定した文字数だけ抜粋し、接尾辞として $ending
を加えます。このメソッドは、検索結果を表示する時に特に便利です。クエリ文字列やキーワードを結果の文書中に見せることができます。

::

    <?php    echo $text->excerpt($last_paragraph, 'method', 50); ?> 
    // Output
    mined by $radius, and suffixed with $ending. This method is especially handy for
    search results. The query...

**highlight (string $haystack, string $needle, $highlighter= '< span
class="highlight">\\1</span >')**

$haystack 中の $needle を $highlighter 文字列を使ってハイライトします。

::

    <?php echo $text->highlight($last_sentence, 'using'); ?> 
    //Output
    Highlights $needle in $haystack <span class="highlight">using</span> 
    the $highlighter string specified. 

**stripLinks ($text)**

与えられた $text から HTML リンクを除去します。

**toList (array $list, $and= 'and')**

カンマ区切りのリストを作成します。最後の二つのアイテムは $and
で指定したもので結合します。

::

    <?php echo $text->toList($colors); ?> 

    //Output<br />red, orange, yellow, green, blue, indigo, and violet

**truncate (string $text, int $length=100, string $ending= '...',
boolean $exact=true, boolean $considerHtml=false)**

**trim(); // truncate の別名**

テキストが $length で指定したものより長かったら、 $length
の長さで切り捨て接尾辞に $ending を加えます。もし $exact が *false*
に指定されていたら、切り詰めは次の単語の最後で行われます。$considerHtml
が\ *true*\ として渡されると、HTMLタグは尊重され、切り落とされることがなくなります。

::

    <?php    
    echo $text->truncate(
        'The killer crept forward and tripped on    the rug.', 
        22,
        '...',
        false
    ); 
    ?> 

::

    //Output:
    The killer crept...

