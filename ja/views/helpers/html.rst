Html
####

.. php:namespace:: Cake\View\Helper

.. php:class:: HtmlHelper(View $view, array $config = [])

CakePHP における HtmlHelper の役割は、 HTML に関連するオプションを より簡単、高速に作成し、
より弾力的なものに変えることです。このヘルパーを使うことで、アプリケーションの足どりはより軽くなり、
そしてドメインのルートが置かれている場所に関して、よりフレキシブルなものになるでしょう。

HtmlHelper にある多くのメソッドは ``$attributes`` という引数を持っています。
これにより、いかなる追加属性もタグに付け加えることができます。
ここでは、 ``$attributes`` パラメータを使用する方法の例をいくつか紹介します。

.. code-block:: html

    欲しい属性: <tag class="someClass" />
    配列パラメータ: ['class' => 'someClass']

    欲しい属性: <tag name="foo" value="bar" />
    配列パラメータ:  ['name' => 'foo', 'value' => 'bar']

整形式の要素を挿入
==================

HtmlHelper の果たすもっとも重要なタスクは、適切に整形されたマークアップの生成です。
このセクションでは、いくつかの HtmlHelper のメソッドと、その使用方法について説明します。

文字セットのタグを作成
----------------------

.. php:method:: charset($charset=null)

文書の文字セットを指定する meta タグを作成するために使います。
デフォルト値は UTF-8 です。
使用例::

    echo $this->Html->charset();

出力結果:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

または、 ::

    echo $this->Html->charset('ISO-8859-1');

出力結果:

.. code-block:: html

    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

CSS ファイルへのリンク
----------------------

.. php:method:: css(mixed $path, array $options = [])

CSS スタイルシートへのリンク（複数可）を作成します。
``block`` オプションが ``true`` に設定されている場合、link タグは ``css`` ブロックに追加されます。
このブロックはドキュメントの head タグの中に出力することができます。

``block`` オプションを使うと、link 要素をどのブロックに追加するかを制御することができます。
デフォルトでは、 ``css`` ブロックに追加されます。

``$options`` 配列のキー 'rel' が 'import' に設定されていると、スタイルシートがインポートされます。

パスが '/' で始まらない場合、CSS をインクルードするこのメソッドは、指定された CSS ファイルが
**webroot/css** ディレクトリ内にあることを前提としています。 ::

    echo $this->Html->css('forms');

出力結果:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />

最初のパラメータは、複数のファイルを含むように配列することができます。 ::

    echo $this->Html->css(['forms', 'tables', 'menu']);

出力結果:

.. code-block:: html

    <link rel="stylesheet" href="/css/forms.css" />
    <link rel="stylesheet" href="/css/tables.css" />
    <link rel="stylesheet" href="/css/menu.css" />

:term:`プラグイン記法` を使用して、すべての読み込まれたプラグインの
CSS ファイルをインクルードすることができます。
**plugins/DebugKit/webroot/css/toolbar.css** を含めるために、以下を使用することができます。 ::

    echo $this->Html->css('DebugKit.toolbar.css');

読み込まれたプラグインと名前を共有する CSS ファイルをインクルードするには、次の操作を実行します。
例えば、 ``Blog`` プラグインを持っていて、
**webroot/css/Blog.common.css** をインクルードしたければ、 ::

    echo $this->Html->css('Blog.common.css', ['plugin' => false]);

プログラムによる CSS の作成
---------------------------

.. php:method:: style(array $data, boolean $oneline = true)

メソッドに渡した配列のキーと値から CSS のスタイル定義を作成します。
特に動的な CSS の作成に便利です。 ::

    echo $this->Html->style([
        'background' => '#633',
        'border-bottom' => '1px solid #000',
        'padding' => '10px'
    ]);

出力結果::

    background:#633; border-bottom:1px solid #000; padding:10px;


meta タグの作成
---------------

.. php:method:: meta(string|array $type, string $url = null, array $options = [])

このメソッドは、 RSS または Atom フィードや、 favicon といった外部リソースとリンクする際に便利です。
css() と同様に、 ``['block' => true]`` のように $attributes パラメータの 'block' キーを
``true`` に設定することで、このタグをインラインで表示するか
``meta`` ブロックに追加するかどうかを指定することができます。

$attributes のパラメータを使って "type" 属性を設定するとき、 CakePHP では、
いくつかのショートカットを用意しています。

======== ======================
type     変換後の値
======== ======================
html     text/html
rss      application/rss+xml
atom     application/atom+xml
icon     image/x-icon
======== ======================

.. code-block:: php

    <?= $this->Html->meta(
        'favicon.ico',
        '/favicon.ico',
        ['type' => 'icon']
    );
    ?>
    // 出力結果 (改行を追加しています)
    <link
        href="http://example.com/favicon.ico"
        title="favicon.ico" type="image/x-icon"
        rel="alternate"
    />
    <?= $this->Html->meta(
        'Comments',
        '/comments/index.rss',
        ['type' => 'rss']
    );
    ?>
    // 出力結果 (改行を追加しています)
    <link
        href="http://example.com/comments/index.rss"
        title="Comments"
        type="application/rss+xml"
        rel="alternate"
    />

ここのメソッドを使用して、meta keywords と description を追加することもできます。
例::

    <?= $this->Html->meta(
        'keywords',
        'ここに meta キーワードを書き込む'
    );
    ?>
    // 出力結果
    <meta name="keywords" content="ここに meta キーワードを書き込む" />

    <?= $this->Html->meta(
        'description',
        'ここに何か説明を書き込む'
    );
    ?>
    // 出力結果
    <meta name="description" content="ここに何か説明を書き込む" />

定義済みの meta タグを作成するだけでなく、link 要素を作成することもできます。 ::

    <?= $this->Html->meta([
        'link' => 'http://example.com/manifest',
        'rel' => 'manifest'
    ]);
    ?>
    // 出力結果
    <link href="http://example.com/manifest" rel="manifest"/>

このように呼び出されたときに meta() に提供された属性は、生成された link タグに追加されます。

DOCTYPE の作成
--------------

.. php:method:: docType(string $type = 'html5')

(X)HTML の DOCTYPE (文書型宣言) を返します。
次の表に従って文書型を指定してください。

+--------------------------+----------------------------------+
| type                     | 変換された値                     |
+==========================+==================================+
| html4-strict             | HTML 4.01 Strict                 |
+--------------------------+----------------------------------+
| html4-trans              | HTML 4.01 Transitional           |
+--------------------------+----------------------------------+
| html4-frame              | HTML 4.01 Frameset               |
+--------------------------+----------------------------------+
| html5 (default)          | HTML5                            |
+--------------------------+----------------------------------+
| xhtml-strict             | XHTML 1.0 Strict                 |
+--------------------------+----------------------------------+
| xhtml-trans              | XHTML 1.0 Transitional           |
+--------------------------+----------------------------------+
| xhtml-frame              | XHTML 1.0 Frameset               |
+--------------------------+----------------------------------+
| xhtml11                  | XHTML 1.1                        |
+--------------------------+----------------------------------+

::

    echo $this->Html->docType();
    // 出力結果: <!DOCTYPE html>

    echo $this->Html->docType('html4-trans');
    // 出力結果:
    // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    //    "http://www.w3.org/TR/html4/loose.dtd">

画像のリンク
------------

.. php:method:: image(string $path, array $options = [])


整形された画像タグを作成します。
指定されたパスは **webroot/img/** と相対的でなければなりません。 ::

    echo $this->Html->image('cake_logo.png', ['alt' => 'CakePHP']);

出力結果:

.. code-block:: html

    <img src="/img/cake_logo.png" alt="CakePHP" />

画像リンクを作成するには、 ``$attributes`` の ``url`` オプションを使ってリンク先を指定します。 ::

    echo $this->Html->image("recipes/6.jpg", [
        "alt" => "Brownies",
        'url' => ['controller' => 'Recipes', 'action' => 'view', 6]
    ]);

出力結果:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

電子メールの中で画像を作成したり、画像への絶対パスが必要な場合は、
``fullBase`` オプションを使用することができます。 ::

    echo $this->Html->image("logo.png", ['fullBase' => true]);

出力結果:

.. code-block:: html

    <img src="http://example.com/img/logo.jpg" alt="" />

読み込まれたプラグインからの画像ファイルを :term:`プラグイン記法` を使って組み込むことができます。
**plugins/DebugKit/webroot/img/icon.png** を組み込むために、次のように使用することができます。 ::

    echo $this->Html->image('DebugKit.icon.png');

読み込まれたプラグインと名前を共有する画像ファイルを組み込むには、次のようにしてできます。
例えば、 ``Blog`` プラグインを持っていて、**webroot/img/Blog.icon.png** を組み込みたければ、 ::

    echo $this->Html->image('Blog.icon.png', ['plugin' => false]);

リンクの作成
------------

.. php:method:: link(string $title, mixed $url = null, array $options = [])

HTML リンクを作成するための多目的なメソッドです。
要素の属性や ``$title`` をエスケープするかどうかを指定するには ``$options`` を使用してください。 ::

    echo $this->Html->link(
        'Enter',
        '/pages/home',
        ['class' => 'button', 'target' => '_blank']
    );

出力結果:

.. code-block:: html

    <a href="/pages/home" class="button" target="_blank">Enter</a>

絶対 URL には ``'_full'=>true`` オプションを使用してください。 ::

    echo $this->Html->link(
        'Dashboard',
        ['controller' => 'Dashboards', 'action' => 'index', '_full' => true]
    );

出力結果:

.. code-block:: html

    <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


オプションで ``confirm`` キーを指定すると、JavaScript の ``confirm()`` ダイアログを表示できます。 ::

    echo $this->Html->link(
        '削除',
        ['controller' => 'Recipes', 'action' => 'delete', 6],
        ['confirm' => 'このレシピを削除してよろしいですか?']
    );

出力結果:

.. code-block:: html

    <a href="/recipes/delete/6"
        onclick="return confirm(
            'このレシピを削除してよろしいですか?'
        );">
        削除
    </a>

``link()`` でクエリ文字列を作成することもできます。 ::

    echo $this->Html->link('View image', [
        'controller' => 'Images',
        'action' => 'view',
        1,
        '?' => ['height' => 400, 'width' => 500]
    ]);

出力結果:

.. code-block:: html

    <a href="/images/view/1?height=400&width=500">View image</a>

``$title`` の HTML 特殊文字は HTML エンティティに変換されます。
この変換を無効にするには、 ``$options`` 配列の escape オプションを ``false`` に設定します。 ::

    echo $this->Html->link(
        $this->Html->image("recipes/6.jpg", ["alt" => "Brownies"]),
        "recipes/view/6",
        ['escape' => false]
    );

出力結果:

.. code-block:: html

    <a href="/recipes/view/6">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

``escape`` を ``false`` に設定すると、リンクの属性のエスケープも無効になります。
``escapeTitle`` オプションを使うと、属性ではなくタイトルのエスケープだけを無効にすることができます。 ::

    echo $this->Html->link(
        $this->Html->image('recipes/6.jpg', ['alt' => 'Brownies']),
        'recipes/view/6',
        ['escapeTitle' => false, 'title' => 'hi "howdy"']
    );

出力結果:

.. code-block:: html

    <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
        <img src="/img/recipes/6.jpg" alt="Brownies" />
    </a>

また、さまざまな種類の URL の例については、
:php:meth:`Cake\\View\\Helper\\UrlHelper::build()` メソッドをチェックしてください。

動画と音声ファイルのリンク
--------------------------

.. php:method:: media(string|array $path, array $options)


オプション:

- ``type`` 生成するメディア要素のタイプ。有効な値は "audio" または "video" です。
  type が指定されていない場合、メディアの種類はファイルの MIME タイプに基づいて推測されます。
- ``text`` video タグ内に含めるテキスト。
- ``pathPrefix`` 相対 URL に使用するパスのプレフィックス。デフォルトは 'files/' です。
- ``fullBase`` 指定されている場合、src 属性はドメイン名を含む完全なアドレスを取得します。

整形された audio/video タグを返します。

.. code-block:: php

    <?= $this->Html->media('audio.mp3') ?>

    // 出力結果
    <audio src="/files/audio.mp3"></audio>

    <?= $this->Html->media('video.mp4', [
        'fullBase' => true,
        'text' => 'Fallback text'
    ]) ?>

    // 出力結果
    <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

   <?= $this->Html->media(
        ['video.mp4', ['src' => 'video.ogg', 'type' => "video/ogg; codecs='theora, vorbis'"]],
        ['autoplay']
    ) ?>

    // 出力結果
    <video autoplay="autoplay">
        <source src="/files/video.mp4" type="video/mp4"/>
        <source src="/files/video.ogg" type="video/ogg;
            codecs='theora, vorbis'"/>
    </video>

JavaScript ファイルへのリンク
-----------------------------

.. php:method:: script(mixed $url, mixed $options)

ローカルファイルまたはリモート URL のいずれかのスクリプトファイルをインクルードします。

デフォルトでは、script タグは、文書のインラインに追加されます。
``$options['block']`` を ``true`` に設定することで、これを上書きする場合は、
script タグは代わりに文書内の他の場所で出力できる ``script`` ブロックに追加されます。
どのブロック名が使用されているかを書き換えたい場合は、
``$options['block']`` を設定することで可能になります。

``$options['once']`` は、このスクリプトをリクエストごとに1回または複数回含めるかどうかを制御します。
デフォルトは ``true`` です。

$options を使用して、生成された script タグに追加のプロパティを設定することができます。
script タグの配列を使用すると、生成されたすべての script タグに属性が適用されます。

この JavaScript ファイルをインクルードするメソッドは、指定された JavaScript ファイルが
**webroot/js** ディレクトリ内にあることを前提としています。 ::

    echo $this->Html->script('scripts');

出力結果:

.. code-block:: html

    <script src="/js/scripts.js"></script>

**webroot/js** にないファイルを絶対パスでリンクすることもできます。 ::

    echo $this->Html->script('/otherdir/script_file');

また、リモートの URL にリンクすることができます。 ::

    echo $this->Html->script('http://code.jquery.com/jquery.min.js');

出力結果:

.. code-block:: html

    <script src="http://code.jquery.com/jquery.min.js"></script>

最初のパラメータは、複数のファイルをインクルードするために配列することができます。 ::

    echo $this->Html->script(['jquery', 'wysiwyg', 'scripts']);

出力結果:

.. code-block:: html

    <script src="/js/jquery.js"></script>
    <script src="/js/wysiwyg.js"></script>
    <script src="/js/scripts.js"></script>

``block`` オプションを使って特定のブロックに script タグを追加することができます。 ::

    echo $this->Html->script('wysiwyg', ['block' => 'scriptBottom']);

レイアウトの中で 'scriptBottom' に追加されたすべての script タグを出力することができます。 ::

    echo $this->fetch('scriptBottom');

:term:`プラグイン記法` を使用して、すべての読み込まれたプラグインの script ファイルを
インクルードすることができます。
**plugins/DebugKit/webroot/js/toolbar.js** をインクルードするために、次を使用できます。 ::

    echo $this->Html->script('DebugKit.toolbar.js');

読み込まれたプラグインと名前を共有するスクリプトファイルをインクルードするには、次の操作を実行します。
例えば、 ``Blog`` プラグインを持っていて、 **webroot/js/Blog.plugins.js** をインクルードしたければ、 ::

    echo $this->Html->script('Blog.plugins.js', ['plugin' => false]);

インライン Javascript ブロックの作成
------------------------------------

.. php:method:: scriptBlock($code, $options = [])

PHP ビューコードから Javascript ブロックを生成するには、スクリプトブロックメソッドの1つを使用できます。
スクリプトは、その場所で出力することも、ブロックにバッファリングすることもできます。 ::

    // defer 属性付きで、一度に全てのスクリプトブロックを定義
    $this->Html->scriptBlock('alert("hi")', ['defer' => true]);

    // 後で出力するスクリプトブロックをバッファリング
    $this->Html->scriptBlock('alert("hi")', ['block' => true]);

.. php:method:: scriptStart($options = [])
.. php:method:: scriptEnd()

``scriptStart()`` メソッドを使って、 ``<script>`` タグに出力するキャプチャブロックを作成することができます。
保存されたスクリプトスニペットをインラインで出力することも、ブロックにバッファリングすることもできます。 ::

    // 'script' ブロックに追加
    $this->Html->scriptStart(['block' => true]);
    echo "alert('I am in the JavaScript');";
    $this->Html->scriptEnd();

Javascript をバッファリングした後、
他の :ref:`ビューブロック <view-blocks>` と同じように出力することができます。 ::

    // レイアウトの中で
    echo $this->fetch('script');

ネストされたリストの作成
------------------------

.. php:method:: nestedList(array $list, array $options = [], array $itemOptions = [])

連想配列からネストされたリスト (UL / OL) を構築::

    $list = [
        'Languages' => [
            'English' => [
                'American',
                'Canadian',
                'British',
            ],
            'Spanish',
            'German',
        ]
    ];
    echo $this->Html->nestedList($list);

出力結果:

.. code-block:: html

    // 出力結果 (空白は省かれます)
    <ul>
        <li>Languages
            <ul>
                <li>English
                    <ul>
                        <li>American</li>
                        <li>Canadian</li>
                        <li>British</li>
                    </ul>
                </li>
                <li>Spanish</li>
                <li>German</li>
            </ul>
        </li>
    </ul>

テーブルヘッダーを作成
----------------------

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

<table> タグの内側に配置されるテーブルのヘッダーセルの行を作成します。 ::

    echo $this->Html->tableHeaders(['Date', 'Title', 'Active']);

出力結果:

.. code-block:: html

    <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Active</th>
    </tr>

::

    echo $this->Html->tableHeaders(
        ['Date','Title','Active'],
        ['class' => 'status'],
        ['class' => 'product_table']
    );

出力結果:

.. code-block:: html

    <tr class="status">
         <th class="product_table">Date</th>
         <th class="product_table">Title</th>
         <th class="product_table">Active</th>
    </tr>

列ごとに属性を設定することができます。これは、 ``$thOptions`` で提供されるデフォルトの代わりに使用されます。 ::

    echo $this->Html->tableHeaders([
        'id',
        ['Name' => ['class' => 'highlight']],
        ['Date' => ['class' => 'sortable']]
    ]);

出力結果:

.. code-block:: html

    <tr>
        <th>id</th>
        <th class="highlight">Name</th>
        <th class="sortable">Date</th>
    </tr>

テーブルのセルを作成
--------------------

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

奇数行と偶数行に対して <tr> 属性を異なる方法で割り当てる表セルを行内に作成します。
特定の <td> 属性の [] 内に単一のテーブルセルをラップします。 ::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', 'Best Brownies', 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', 'No'],
    ]);

出力結果:

.. code-block:: html

    <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
    <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
    <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>

::

    echo $this->Html->tableCells([
        ['Jul 7th, 2007', ['Best Brownies', ['class' => 'highlight']] , 'Yes'],
        ['Jun 21st, 2007', 'Smart Cookies', 'Yes'],
        ['Aug 1st, 2006', 'Anti-Java Cake', ['No', ['id' => 'special']]],
    ]);

出力結果:

.. code-block:: html

    <tr>
        <td>
            Jul 7th, 2007
        </td>
        <td class="highlight">
            Best Brownies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Jun 21st, 2007
        </td>
        <td>
            Smart Cookies
        </td>
        <td>
            Yes
        </td>
    </tr>
    <tr>
        <td>
            Aug 1st, 2006
        </td>
        <td>
            Anti-Java Cake
        </td>
        <td id="special">
            No
        </td>
    </tr>

::

    echo $this->Html->tableCells(
        [
            ['Red', 'Apple'],
            ['Orange', 'Orange'],
            ['Yellow', 'Banana'],
        ],
        ['class' => 'darker']
    );

出力結果:

.. code-block:: html

    <tr class="darker"><td>Red</td><td>Apple</td></tr>
    <tr><td>Orange</td><td>Orange</td></tr>
    <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

HtmlHelper によるタグ出力の変更
=================================

.. php:method:: setTemplates($templates)

``$templates`` パラメータは、読み込みたいタグを含む PHP ファイルへの文字列ファイルパスか、
追加/置換するためのテンプレートの配列です。 ::

    // config/my_html.php からテンプレートを読み込む。
    $this->Html->setTemplates('my_html');

    // 指定したテンプレートを読み込む。
    $this->Html->setTemplates([
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ]);

テンプレートのファイルを読み込む場合、ファイルは次のようになります。 ::

    <?php
    return [
        'javascriptlink' => '<script src="{{url}}" type="text/javascript"{{attrs}}></script>'
    ];

.. warning::

    パーセント記号 (``%``) を含むテンプレート文字列には特別な注意が必要です。
    この文字の先頭に ``%%`` のようにもう一つパーセンテージを付ける必要があります。
    なぜなら、内部的なテンプレートは ``sprintf()`` で使用されるためにコンパイルされているからです。
    例: '<div style="width:{{size}}%%">{{content}}</div>'

HtmlHelper でパンくずリストを作成
=================================

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)
.. php:method:: getCrumbs(string $separator = '&raquo;', string $startText = false)
.. php:method:: getCrumbList(array $options = [], $startText = false)

多くのアプリケーションでは、エンドユーザーのナビゲーションを容易にするためのパンくずリストがあります。
HtmlHelper の助けを借りて、アプリでパンくずリストを作成することができます。
パンくずを作るには、まずレイアウトテンプレートで次のようにします。 ::

    echo $this->Html->getCrumbs(' > ', 'Home');

``$startText`` のオプションは配列も受け付けます。
これにより、生成された最初のリンクへのさらなる制御を可能にします。 ::

    echo $this->Html->getCrumbs(' > ', [
        'text' => $this->Html->image('home.png'),
        'url' => ['controller' => 'Pages', 'action' => 'display', 'home'],
        'escape' => false
    ]);

``text`` や ``url`` 以外のキーは ``$options`` パラメータとして
:php:meth:`~HtmlHelper::link()` に渡されます。

今、ビューでは、各ページ上のパンくずリストを開始するために以下を追加しようと考えています::

    $this->Html->addCrumb('Users', '/users');
    $this->Html->addCrumb('Add User', ['controller' => 'Users', 'action' => 'add']);

これは、 ``getCrumbs`` が追加されたレイアウトで、 "**Home > Users > Add User**" の出力を追加します。

また、HTML リストの中で整形されたパンくずを取得することもできます。 ::

    echo $this->Html->getCrumbList();

オプションとして、 ``<ul>`` (順不同リスト) に収まる ``class`` のような通常の
HTML パラメーターを使用することができ、 特別なオプションを持ちます。
(``li`` 要素の間にある） ``separator`` 、 ``irstClass`` 及び ``lastClass`` などです。 ::

    echo $this->Html->getCrumbList(
        [
            'firstClass' => false,
            'lastClass' => 'active',
            'class' => 'breadcrumb'
        ],
        'Home'
    );

このメソッドはリストとその要素を生成するために :php:meth:`Cake\\View\\Helper\\HtmlHelper::tag()`
を使います。 :php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()` と同様に動作するので、
全てのパンくずに追加されたオプションを使用できます。 ``$startText`` パラメータを使って、
最初のパンくずのリンクやテキストを提供することができます。
これは、常にルートのリンクを含めたい場合に便利です。このオプションは
:php:meth:`~Cake\\View\\Helper\\HtmlHelper::getCrumbs()` の
``$startText`` オプションと同じ働きをします。


.. meta::
    :title lang=ja: HtmlHelper
    :description lang=ja: CakePHP における HtmlHelper の役割は、 HTML に関連するオプションを より簡単、高速に作成し、より弾力的なものに変えることです。
    :keywords lang=ja: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
