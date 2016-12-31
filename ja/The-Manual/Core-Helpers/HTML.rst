HTML
####

CakePHP の HtmlHelper の役割は、HTML
関連のオプションの変更をより簡単に、より速く、より柔軟にすることです。このヘルパーを使用すると、アプリケーションがドメインのルートに関してどこに置かれているかについて、より明確になり、より柔軟になります。

HtmlHelper の役割は CakePHP 1.1
からかなり変わってしまっています。フォームに関するメソッドは非推奨となり、新しく
FormHelper に移動しました。HTML
フォームについてのヘルプを探している場合は、新しい FormHelper
をチェックしてください。

HtmlHelper
のメソッドを見る前に、いくつかの設定や使用状況について知っておく必要があります。はじめに、AUTO\_OUTPUT
と呼ばれるコア定数設定です。AUTO\_OUTPUT
がアプリケーション内のコア設定ファイル(/app/config/core.php) で true
にセットされると、HtmlHelper
は値を返さずに自動的にタグの内容を出力します。これはビューコード内でショートタグ
(<?= ?>) あるいは多くの echo() 呼び出しを嫌う用にあります。$return
パラメータを指定した関数を使用することでコア設定の内容を強制的に上書きすることができます。AUTO\_OUTPUT
の値に関係なく HtmlHelper に HTML コードを返して欲しい場合は、$return に
true を設定してください。

多くの HtmlHelper のメソッドは $htmlAttributes
パラメータも持っています。これを使用するとタグに特別な属性を付加することができます。ここでは
$htmlAttributes パラメータの使用方法のいくつかの例を示します:

::

    期待する属性: <tag class="someClass" />      
    Array パラメータ: array('class'=>'someClass')
     
    期待する属性: <tag name="foo" value="bar" />  
    Array パラメータ:  array('name' => 'foo', 'value' => 'bar')

デフォルトですべてのビューで HtmlHelper は有効になっています。HtmlHelper
がないというエラーが表示される場合、通常は 手動で設定された $helpers
コントローラ変数に名前がないということになります。

整形済み要素を挿入する
======================

HtmlHelper
が果たす最も重要な仕事は、整形済みマークアップを生成することです。使用することを恐れないでください
- ビューが描画されクライアントに出力される際にCPU
の使用を節約するためにCakePHP
のビューをキャッシュすることができます。この章では HtmlHelper
のいくつかのメソッドとその使い方を見てみます。

``charset(string $charset=null)``

ドキュメントの文字コードを指定するメタタグを生成します。デフォルトは
UTF-8 です。

::

     
      <?php echo $html->charset(); ?> 

    // 出力
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     
    <?php echo $html->charset('ISO-8859-1'); ?>
     
    // 出力
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

``css(mixed $path, string $rel = null, array $htmlAttributes, boolean $inline = true)``

CSS スタイルシートへのリンクを生成します。$inline が false
にセットされると、リンクタグが $scripts\_for\_layout
変数に追加され、ドキュメントの head タグ内に出力することができます。

CSS 読み込みのこのメソッドは、指定された CSS ファイルが /app/webroot/css
ディレクトリ内に置かれていると仮定しています。

::

      
      <?php echo $html->css('forms'); ?> 

    // 出力
      <link rel="stylesheet" type="text/css" href="/ja/test/css/forms.css" />
     
    // 第１引数に配列も有効です
    <?php echo $html->css(array('forms','tables','menu')); ?>
     
    // 出力
    <link rel="stylesheet" type="text/css" href="/ja/test/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/ja/test/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/ja/test/css/menu.css" />

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

このメソッドは RSS/Atom フィードや favicon
のような外部リソースへのリンクを手軽にします。css()
と同様に、このタグをインライン出力にするか、第 4 引数を使用して head
タグに出力するかどうかを指定することができます。

"type" 属性を使用して、生成する type タグを制御します:

$htmlAttributes パラメータを使用して "type"
属性をセットする場合、CakePHP はいくつかのショートカットがあります:

+--------+------------------------+
| type   | 変換される値           |
+========+========================+
| html   | text/html              |
+--------+------------------------+
| rss    | application/rss+xml    |
+--------+------------------------+
| atom   | application/atom+xml   |
+--------+------------------------+
| icon   | image/x-icon           |
+--------+------------------------+

::

      <?php echo $html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?> // 出力 (改行が追加されます) </p>
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $html->meta(
        'Comments',
        '/comments/index.rss',
        array('type' => 'rss'));
    ?>
     
    // 出力 (改行が追加されます) 
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

このメソッドはメタキーワードや詳細を追加するために使用されます。
サンプル:

::

    <?php echo $html->meta(
        'keywords',
        'enter any meta keyword here',
        array(), false
    );?>
    // 出力 <meta name="keywords" content="enter any meta keyword here"/>
    //

    <?php echo $html->meta(
        'description',
        'enter any meta description here',
        array(), false
    );?> 

    // 出力 <meta name="description" content="enter any meta description here"/>

``docType(string $type = 'xhtml-strict')``

(X)HTML の doctype タグを出力します。次のテーブルに従って doctype
を指定します:

+----------------+-----------------------+
| type           | 変換される値          |
+================+=======================+
| html           | text/html             |
+----------------+-----------------------+
| html4-strict   | HTML4 Strict          |
+----------------+-----------------------+
| html4-trans    | HTML4 Transitional    |
+----------------+-----------------------+
| html4-frame    | HTML4 Frameset        |
+----------------+-----------------------+
| xhtml-strict   | XHTML1 Strict         |
+----------------+-----------------------+
| xhtml-trans    | XHTML1 Transitional   |
+----------------+-----------------------+
| xhtml-frame    | XHTML1 Frameset       |
+----------------+-----------------------+
| xhtml11        | XHTML 1.1             |
+----------------+-----------------------+

::

    <?php echo $html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      
    <?php echo $html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

``style(array $data, boolean $inline = true)``

メソッドに渡された配列のキーと値に基づいて CSS
スタイル定義を構築します。CSS ファイルが動的である場合に特に便利です。

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

     // 出力
      background:#633;
      border-bottom:1px solid #000;
      padding:10px; 

``image(string $path, array $htmlAttributes) = array()``

フォーマットされた image タグを生成します。指定されたパスは
/app/webroot/img/ からの相対パスです。

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

    // 出力
    <img src="/img/cake_logo.png" alt="CakePHP" /> 

``div(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

マークアップを div で囲んだセクションを生成するために使用します。第 1
引数は CSS クラスを指定し、第 2 引数は div
タグで囲まれるテキストを指定します。最後のパラメータが true
にセットされると、$text は HTML エスケープされて出力されます。

テキストが指定されない場合、div の開始タグのみ返されます。

::

     
    <?php echo $html->div('error', 'Please enter your credit card number.');?>

    // 出力
    <div class="error">Please enter your credit card number.</div>

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

主な目的は HTML リンクを生成することです。

::

    <?php echo $html->link('Enter', '/pages/home', array('class'=>'button')); ?>
       
    // 出力
    <a href="/ja/pages/home" class="button">Enter</a>
       
    <?php echo $html->link(
        'Delete',
        array('controller'=>'recipes', 'action'=>'delete', 6),
        array(),
        "Are you sure you wish to delete this recipe?"
    );?>
       
    // 出力
    <a href="/ja/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

link() と image()
を一緒に使用することで画像リンクを生成します。しかし最後のパラメータを
false にすることを忘れないでください。

::

    <?php echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "/recipes/view/6",
        array(),
        false,
        false
    ); ?>
       
    // 出力:
    <a href="/ja/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

CSS クラスのついた <p>
タグで囲まれたテキストを返します。テキストが指定されていない場合、開始
<p> タグのみ返されます。

::

    <?php echo $html->para(null, 'Hello World.');?>
    // 出力
    <p>Hello World.</p>

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

<table> タグ内に配置されるテーブルヘッダーセルの行を生成します。

::

    <?php echo $html->tableHeaders(array('Date','Title','Active'));?>

    // 出力
    <tr><th>Date</th><th>Title</th><th>Active</th></tr>
     
    <?php echo $html->tableHeaders(
        array('Date','Title','Active'),
        array('class' => 'status'),
        array('class' => 'product_table')
    );?>
     
    // 出力
    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

``tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null)``

行内のテーブルセルを生成します。奇数/偶数行に異なる <tr>
属性を指定できます。

::

    <?php echo $html->tableCells(array(
        array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
    ));
    ?>
     
    // 出力
    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
     
    <?php echo $html->tableCells(
        array(
            array('Red', 'Apple'),
            array('Orange', 'Orange'),
            array('Yellow', 'Banana'),
        ),
        array('class' => 'darker')
    );
    ?>
     
    // 出力
    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

charset
-------

``charset(string $charset=null)``

文書の文字コードを指定する meta
タグを生成するために使用します。デフォルトは UTF-8 です。

::

     
    <?php echo $html->charset(); ?> 

これは次のような出力になります:

::

    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

別の使用例:

::

    <?php echo $html->charset('ISO-8859-1'); ?>

これは次のような出力になります:

::

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

css
---

``css(mixed $path, string $rel = null, array $htmlAttributes = array(), boolean $inline = true)``

CSS スタイルシートへのリンクを作成します。$inline を false
にセットした場合、link タグは $scripts\_for\_layout
変数の中に出現するようになるので、この変数を文書中の head
タグの中に入れておくといった使い方ができます。

この CSS のリンクを作成するメソッドは、CSS ファイルが /app/webroot/css
ディレクトリの中に設置されているということを前提としています。

::

    <?php echo $html->css('forms'); ?> 

これは次のような出力になります:

::

    <link rel="stylesheet" type="text/css" href="/ja/css/forms.css" />

第一引数には、複数のファイルを配列で格納することができます。

::

    <?php echo $html->css(array('forms','tables','menu')); ?>

これは次のような出力になります:

::

    <link rel="stylesheet" type="text/css" href="/ja/css/forms.css" />
    <link rel="stylesheet" type="text/css" href="/ja/css/tables.css" />
    <link rel="stylesheet" type="text/css" href="/ja/css/menu.css" />

meta
----

``meta(string $type, string $url = null, array $attributes = array(), boolean $inline = true)``

This method is handy for linking to external resources like RSS/Atom
feeds and favicons. Like css(), you can specify whether or not you'd
like this tag to appear inline or in the head tag using the fourth
parameter.

If you set the "type" attribute using the $htmlAttributes parameter,
CakePHP contains a few shortcuts:

+--------+------------------------+
| type   | translated value       |
+========+========================+
| html   | text/html              |
+--------+------------------------+
| rss    | application/rss+xml    |
+--------+------------------------+
| atom   | application/atom+xml   |
+--------+------------------------+
| icon   | image/x-icon           |
+--------+------------------------+

::

      <?php echo $html->meta(
        'favicon.ico',
        '/favicon.ico',
        array('type' => 'icon')
    );?> //Output (line breaks added) </p>
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
     
    <?php echo $html->meta(
        'Comments',
        '/comments/index.rss',
        array('type' => 'rss'));
    ?>
     
    //Output (line breaks added)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

This method can also be used to add the meta keywords and descriptions.
Example:

::

    <?php echo $html->meta(
        'keywords',
        'enter any meta keyword here'
    );?>
    //Output <meta name="keywords" content="enter any meta keyword here"/>
    //

    <?php echo $html->meta(
        'description',
        'enter any meta description here'
       );?> 

    //Output <meta name="description" content="enter any meta description here"/>

If you want to add a custom meta tag then the first parameter should be
set to an array. To output a robots noindex tag use the following code:

::

     echo $html->meta(array('name' => 'robots', 'content' => 'noindex')); 

docType
-------

``docType(string $type = 'xhtml-strict')``

Returns a (X)HTML doctype tag. Supply the doctype according to the
following table:

+----------------+-----------------------+
| type           | translated value      |
+================+=======================+
| html           | text/html             |
+----------------+-----------------------+
| html4-strict   | HTML4 Strict          |
+----------------+-----------------------+
| html4-trans    | HTML4 Transitional    |
+----------------+-----------------------+
| html4-frame    | HTML4 Frameset        |
+----------------+-----------------------+
| xhtml-strict   | XHTML1 Strict         |
+----------------+-----------------------+
| xhtml-trans    | XHTML1 Transitional   |
+----------------+-----------------------+
| xhtml-frame    | XHTML1 Frameset       |
+----------------+-----------------------+
| xhtml11        | XHTML 1.1             |
+----------------+-----------------------+

::

    <?php echo $html->docType(); ?> 
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <?php echo $html->docType('html4-trans'); ?> 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

style
-----

``style(array $data, boolean $inline = true)``

Builds CSS style definitions based on the keys and values of the array
passed to the method. Especially handy if your CSS file is dynamic.

::

    <?php echo $html->style(array(
        'background'     => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    )); ?>

Will output:

::

      background:#633;
      border-bottom:1px solid #000;
      padding:10px; 

image
-----

``image(string $path, array $htmlAttributes = array())``

Creates a formatted image tag. The path supplied should be relative to
/app/webroot/img/.

::

    <?php echo $html->image('cake_logo.png', array('alt' => 'CakePHP'))?> 

Will output:

::

    <img src="/img/cake_logo.png" alt="CakePHP" /> 

To create an image link specify the link destination using the ``url``
option in ``$htmlAttributes``.

::

    <?php echo $html->image("recipes/6.jpg", array(
        "alt" => "Brownies",
        'url' => array('controller' => 'recipes', 'action' => 'view', 6)
    )); ?>

Will output:

::

    <a href="/ja/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

You can also use this alternate method to create an image link, by
assigning the image to a variable (e.g. $image), and passing it to
``$html->link()`` as the first argument:

::

        <?php
        $image = $html->image('recipes/6.jpg', array(
                    'alt' => 'Brownies',
                ));

        //$image is passed as the first argument instead of link text
        echo $html->link($image, array(
                'controller' => 'recipies',
                'action' => 'view',
                6
                ),
                array(
                    'escape' => false //important so htmlHelper doesn't escape you image link
                )
        );
        ?>

This is useful if you want to keep your link and image a bit more
separate, or if you want to sneak some markup into your link. Be sure to
pass ``'escape' => false`` in the options array for
`` $html->link($string, $url, $options)`` to prevent htmlHelper from
escaping the code.

link
----

``link(string $title, mixed $url = null, array $htmlAttributes = array(), string $confirmMessage = false, boolean $escapeTitle = true)``

General purpose method for creating HTML links. Use ``$htmlAttributes``
to specify attributes for the element.

::

    <?php echo $html->link('Enter', '/pages/home', array('class'=>'button','target'=>'_blank')); ?>

Will output:

::

      
    <a href="/ja/pages/home" class="button" target="_blank">Enter</a>

Specify ``$confirmMessage`` to display a javascript ``confirm()``
dialog.

::

    <?php echo $html->link(
        'Delete',
        array('controller'=>'recipes', 'action'=>'delete', 6),
        array(),
        "Are you sure you wish to delete this recipe?"
    );?>

Will output:

::

      
    <a href="/ja/recipes/delete/6" onclick="return confirm('Are you sure you wish to delete this recipe?');">Delete</a>

Query strings can also be created with ``link()``.

::

    <?php echo $html->link('View image', array(
        'controller' => 'images',
        'action' => 'view',
        1,
        '?' => array( 'height' => 400, 'width' => 500))
    );

Will output:

::

      
    <a href="/ja/images/view/1?height=400&width=500">View image</a>

HTML special characters in ``$title`` will be converted to HTML
entities. To disable this conversion, set the escape option to false in
the ``$htmlAttributes``, or set ``$escapeTitle`` to false.

::

    <?php 
    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "recipes/view/6",
        array('escape'=>false)
    );

    echo $html->link(
        $html->image("recipes/6.jpg", array("alt" => "Brownies")),
        "recipes/view/6",
        null, null, false
    );
    ?>

Both will output:

::

    <a href="/ja/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

Also check `HtmlHelper::url <https://book.cakephp.org/view/842/url>`_
method for more examples of different types of urls.

tag
---

``tag(string $tag, string $text, array $htmlAttributes, boolean $escape = false)``

Returns text wrapped in a specified tag. If no text is specified then
only the opening <tag> is returned.

::

    <?php echo $html->tag('span', 'Hello World.', array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">Hello World</span>
     
    //No text specified.
    <?php echo $html->tag('span', null, array('class' => 'welcome'));?>
     
    //Output
    <span class="welcome">

div
---

``div(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Used for creating div-wrapped sections of markup. The first parameter
specifies a CSS class, and the second is used to supply the text to be
wrapped by div tags. If the last parameter has been set to true, $text
will be printed HTML-escaped.

If no text is specified, only an opening div tag is returned.

::

     
    <?php echo $html->div('error', 'Please enter your credit card number.');?>

    //Output
    <div class="error">Please enter your credit card number.</div>

para
----

``para(string $class, string $text, array $htmlAttributes, boolean $escape = false)``

Returns a text wrapped in a CSS-classed <p> tag. If no text is supplied,
only a starting <p> tag is returned.

::

    <?php echo $html->para(null, 'Hello World.');?>
     
    //Output
    <p>Hello World.</p>

tableHeaders
------------

``tableHeaders(array $names, array $trOptions = null, array $thOptions = null)``

Creates a row of table header cells to be placed inside of <table> tags.

::

    <?php echo $html->tableHeaders(array('Date','Title','Active'));?> //Output 
    <tr><th>Date</th><th>Title</th><th>Active</th></tr>
     
    <?php echo $html->tableHeaders(
        array('Date','Title','Active'),
        array('class' => 'status'),
        array('class' => 'product_table')
    );?>
     
    //Output
    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

tableCells
----------

``tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)``

Creates table cells, in rows, assigning <tr> attributes differently for
odd- and even-numbered rows. Wrap a single table cell within an array()
for specific <td>-attributes.

::

    <?php echo $html->tableCells(array(
        array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>
     
    <?php echo $html->tableCells(array(
        array('Jul 7th, 2007', array('Best Brownies', array('class'=>'highlight')) , 'Yes'),
        array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
        array('Aug 1st, 2006', 'Anti-Java Cake', array('No', array('id'=>'special'))),
    ));
    ?>
     
    //Output
    <tr><td>Jul 7th, 2007</td><td class="highlight">Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td id="special">No</td></tr>
     
    <?php echo $html->tableCells(
        array(
            array('Red', 'Apple'),
            array('Orange', 'Orange'),
            array('Yellow', 'Banana'),
        ),
        array('class' => 'darker')
    );
    ?>
     
    //Output
    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

url
---

``url(mixed $url = NULL, boolean $full = false)``

Returns an URL pointing to a combination of controller and action. If
$url is empty, it returns the REQUEST\_URI, otherwise it generates the
url for the controller and action combo. If full is true, the full base
URL will be prepended to the result.

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "bar"));?>
     
    // Output
    /posts/view/bar

Here are a few more usage examples:

URL with named parameters

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "view",
        "foo" => "bar"));
    ?>
     
    // Output
    /posts/view/foo:bar

URL with extension

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "list",
        "ext" => "rss"));
    ?>
     
    // Output
    /posts/list.rss

URL (starting with '/') with the full base URL prepended.

::

    <?php echo $html->url('/posts', true); ?>

    //Output
    http://somedomain.com/posts

URL with GET params and named anchor

::

    <?php echo $html->url(array(
        "controller" => "posts",
        "action" => "search",
        "?" => array("foo" => "bar"),
        "#" => "first"));
    ?>

    //Output
    /posts/search?foo=bar#first

For further information check
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_ in
the API.

Changing the tags output by HtmlHelper
======================================

The built in tag sets for ``HtmlHelper`` are XHTML compliant, however if
you need to generate HTML for HTML4 you will need to create and load a
new tags config file containing the tags you'd like to use. To change
the tags used create ``app/config/tags.php`` containing:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );

You can then load this tag set by calling ``$html->loadConfig('tags');``
