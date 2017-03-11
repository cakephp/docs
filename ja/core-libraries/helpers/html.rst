HtmlHelper
##########

.. php:class:: HtmlHelper(View $view, array $settings = array())

CakePHP における HtmlHelper の役割は、 HTML に関連するオプションを
より簡単、高速に作成し、より弾力的なものに変えることです。
このヘルパーを使うことで、アプリケーションの足どりはより軽くなり、
そしてドメインのルートが置かれている場所に関して、よりフレキシブル
なものになるでしょう。

HtmlHelper にある多くのメソッドは ``$options`` という
引数を持っています。これにより、いかなる追加属性もタグに
付け加えることができます。これは ``$options`` を使う
方法についての簡単な例です。

.. code-block:: html

    付けられる属性: <tag class="someClass" />
    配列での指定: array('class' => 'someClass')

    付けられる属性: <tag name="foo" value="bar" />
    配列での指定:  array('name' => 'foo', 'value' => 'bar')


.. note::

    HtmlHelpler は既定ではすべてのビューで使うことができます。
    このヘルパーが存在しないという旨のエラーが発生したとき、
    たいていの原因はコントローラーで変数 ``$helpers`` を手動で
    設定した際、名前を書き忘れたことです。

Well-Formatted な要素の挿入
===========================

HtmlHelper の果たすもっとも重要なタスクは、適切に定義された
マークアップの生成です。 CakePHP はレンダリングと送信にかかる
CPU のサイクルを減らすために、ビューをキャッシュすることが
できます。この節では、いくつかの HtmlHelper のメソッドと、
その使用方法について説明します。

.. php:method:: charset($charset=null)

    :param string $charset: 使用したい文字セットを設定します。
       null の場合は ``App.encoding`` で設定した値が使われます。

    HTML 文書の文字セットを特定する meta タグを作成するために使います。
    既定では UTF-8 になります。

    使用例::

        echo $this->Html->charset();

    出力結果:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    このように使うと::

        echo $this->Html->charset('ISO-8859-1');

    出力結果:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

.. php:method:: css(mixed $path, array $options = array())

    .. versionchanged:: 2.4

    :param mixed $path: リンクしたい CSS ファイルのパスを含む文字列か複数のファイルパスを含む配列
    :param array $options: :term:`HTML属性` で説明した配列です。

    CSS のスタイルシートの link タグを生成します。 ``$options`` パラメータのキー 'inline' を
    false に設定すると link タグは HTML文書の head タグ内にある ``css`` ブロック
    に追加されます。

    ``block`` オプションを使用することで、 link タグが追加されるブロックを制御できます。
    既定では ``css`` ブロックに追加されます。

    ``$options`` 配列の 'rel' キーに 'import' が設定されていた場合、スタイルシートはインポートされます。

    パスが '/' から始まらない場合、CSS をインクルードするこのメソッドは、
    指定した CSS ファイルが /app/webroot/css ディレクトリ以下にあると仮定します。 ::

        echo $this->Html->css('forms');

    出力結果:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />

    最初の引数は複数のファイルをインクルードするために配列を使用できます。 ::

        echo $this->Html->css(array('forms', 'tables', 'menu'));

    出力結果:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />
        <link rel="stylesheet" type="text/css" href="/css/tables.css" />
        <link rel="stylesheet" type="text/css" href="/css/menu.css" />

    ロードしたプラグインからも :term:`プラグイン記法` を使うことで CSS ファイルを
    インクルードすることができます。 ``app/Plugin/DebugKit/webroot/css/toolbar.css``
    という CSS ファイルをインクルードするには以下のようにします。 ::

        echo $this->Html->css('DebugKit.toolbar.css');

    ロードしたプラグインと名前が共通する CSS ファイルをインクルードするときは
    次のようにします。たとえば ``Blog`` プラグインを使っているときに、
    ``app/webroot/css/Blog.common.css`` をインクルードしたい場合は以下のようにします。

    .. versionchanged:: 2.4

    .. code-block:: php

        echo $this->Html->css('Blog.common.css', array('plugin' => false));

    .. versionchanged:: 2.1
        ``block`` オプションが追加されました。
        :term:`プラグイン記法` のサポートが追加されました。

.. php:method:: meta(string $type, string $url = null, array $options = array())

    :param string $type: 必要な meta タグのタイプを指定します。
    :param mixed $url: meta タグのための URL です。文字列か :term:`ルーティング配列` を指定します。
    :param array $options: :term:`HTML属性` で説明した配列です。

    このメソッドは、 RSS または Atom フィードや、 favicon といった外部リソースとリンクする際に有用です。
    ``css()`` メソッド同様、 ``array('inline' => false)`` という風に ``$options`` の 'inline'
    というキーに false を設定することで、タグをインラインで出力するか  ``meta`` ブロックに追加するかを
    指定することができます。

    $options のパラメータを使って "type" 属性を設定するとき、 CakePHP では
    少しですがショートカットを用意しています。

    ========= ======================
     typeの値  変換後の値
    ========= ======================
    html      text/html
    rss       application/rss+xml
    atom      application/atom+xml
    icon      image/x-icon
    ========= ======================


    .. code-block:: php

        <?php
        echo $this->Html->meta(
            'favicon.ico',
            '/favicon.ico',
            array('type' => 'icon')
        );
        ?>
        // 出力結果(改行を追加しています)
        <link
            href="http://example.com/favicon.ico"
            title="favicon.ico" type="image/x-icon"
            rel="alternate"
        />
        <?php
        echo $this->Html->meta(
            'Comments',
            '/comments/index.rss',
            array('type' => 'rss')
        );
        ?>
        // 出力結果(改行を追加しています)
        <link
            href="http://example.com/comments/index.rss"
            title="Comments"
            type="application/rss+xml"
            rel="alternate"
        />

    このメソッドは meta キーワードと種類を記述することもできます。
    以下に例を示します。

    .. code-block:: php

        <?php
        echo $this->Html->meta(
            'keywords',
            'ここに meta キーワードを書き込む'
        );
        ?>
        // 出力結果
        <meta name="keywords" content="ここに meta キーワードを書き込む" />

        <?php
        echo $this->Html->meta(
            'description',
            'ここに何か説明を書き込む'
        );
        ?>
        // 出力結果
        <meta name="description" content="ここに何か説明を書き込む" />

    独自の meta タグを出力するときは、配列を最初の引数として渡します。
    クローラにインデックスを作成させないよう指定するタグを出力する例を
    以下に示します。 ::

        echo $this->Html->meta(array('name' => 'robots', 'content' => 'noindex'));

    .. versionchanged:: 2.1
        ``block`` オプションが追加されました。

.. php:method:: docType(string $type = 'xhtml-strict')

    :param string $type: 作成される DOCTYPE タグ

    (X)HTML の DOCTYPE タグを出力します。 以下は指定できる値と
    その結果をまとめた表です。

    +--------------------------+----------------------------------+
    | ``$type`` の値           | 出力されるタグの種類             |
    +==========================+==================================+
    | html4-strict             | HTML4 Strict                     |
    +--------------------------+----------------------------------+
    | html4-trans              | HTML4 Transitional               |
    +--------------------------+----------------------------------+
    | html4-frame              | HTML4 Frameset                   |
    +--------------------------+----------------------------------+
    | html5                    | HTML5                            |
    +--------------------------+----------------------------------+
    | xhtml-strict             | XHTML1 Strict                    |
    +--------------------------+----------------------------------+
    | xhtml-trans              | XHTML1 Transitional              |
    +--------------------------+----------------------------------+
    | xhtml-frame              | XHTML1 Frameset                  |
    +--------------------------+----------------------------------+
    | xhtml11                  | XHTML1.1                         |
    +--------------------------+----------------------------------+

    ::

        echo $this->Html->docType();
        // 出力結果:
        // <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        //    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        echo $this->Html->docType('html5');
        // 出力結果: <!DOCTYPE html>

        echo $this->Html->docType('html4-trans');
        // 出力結果:
        // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        //    "http://www.w3.org/TR/html4/loose.dtd">

    .. versionchanged:: 2.1
        2.1では既定で出力される DOCTYPE タグが HTML5 のものになりました。

.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: プロパティ => 値 という風な CSS プロパティの集合
    :param boolean $oneline: 内容を1行にするかどうか

    メソッドに渡した配列のキーと値から CSS のスタイル定義を作成します。
    特に動的な CSS の作成に有用です。 ::

        echo $this->Html->style(array(
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        ));

    出力結果::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = array())

    :param string $path: 画像のパス。
    :param array $options: :term:`HTML属性` の配列

    書式にのっとった image タグを作成します。画像のパスは ``/app/webroot/img/``
    からの相対パスを指定してください。 ::

        echo $this->Html->image('cake_logo.png', array('alt' => 'CakePHP'));

    出力結果:

    .. code-block:: html

        <img src="/img/cake_logo.png" alt="CakePHP" />

    リンク付き画像を作成するには、リンク先を ``$options`` の
    ``url`` オプションに設定します。 ::

        echo $this->Html->image("recipes/6.jpg", array(
            "alt" => "ブラウニー",
            'url' => array('controller' => 'recipes', 'action' => 'view', 6)
        ));

    出力結果:

    .. code-block:: html

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="ブラウニー" />
        </a>

    電子メールで画像を使用したいときや、絶対パスで画像を指定したいときは
    ``fullBase`` オプションを設定します。 ::

        echo $this->Html->image("logo.png", array('fullBase' => true));

    出力結果:

    .. code-block:: html

        <img src="http://example.com/img/logo.jpg" alt="" />

    :term:`プラグイン記法` を使うことで、ロードしたプラグインの画像を
    インクルードできます。 ``app/Plugin/DebugKit/webroot/img/icon.png``
    をインクルードするには以下のようにします。 ::

        echo $this->Html->image('DebugKit.icon.png');

    ロードしたプラグインと名前が共通する画像をインクルードするときは
    次のようにします。たとえば ``Blog`` プラグインを使っているときに、
    ``app/webroot/img/Blog.icon.png`` をインクルードしたい場合は次のようにします。 ::

        echo $this->Html->image('Blog.icon.png', array('plugin' => false));

    .. versionchanged:: 2.1
        ``fullBase`` オプションが追加されました。
        :term:`プラグイン記法` のサポートが追加されました。

.. php:method:: link(string $title, mixed $url = null, array $options = array())

    :param string $title: リンクを本文に表示する際のテキストを設定します。
    :param mixed $url: 文字列または :term:`ルーティング配列` によってリンク先の URL を設定します。
    :param array $options: :term:`HTML属性` の配列を設定します。

    一般的な HTML のハイパーリンクを作成するためのメソッドです。
    ``$options`` は、タグの属性や、 ``$title`` をエスケープするかどうかの設定に使います。 ::

        echo $this->Html->link(
            'Enter',
            '/pages/home',
            array('class' => 'button', 'target' => '_blank')
        );

    出力結果:

    .. code-block:: html

        <a href="/pages/home" class="button" target="_blank">Enter</a>

    ``'full_base' => true`` オプションを設定すると、URL をフルパスで出力します。 ::

        echo $this->Html->link(
            'Dashboard',
            array(
                'controller' => 'dashboards',
                'action' => 'index',
                'full_base' => true
            )
        );

    出力結果:

    .. code-block:: html

        <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


    $options に ``confirm`` キーを指定すると、JavaScript の ``confirm()``
    で表示するダイアログのメッセージを設定できます。::

        echo $this->Html->link(
            '削除',
            array('controller' => 'recipes', 'action' => 'delete', 6),
            array('confirm' => '本当にこのレシピを削除しますか?')
        );

    出力結果:

    .. code-block:: html

        <a href="/recipes/delete/6"
            onclick="return confirm(
                '本当にこのレシピを削除しますか?'
            );">
            削除
        </a>

    クエリ文字列も ``link()`` で作成できます。 ::

        echo $this->Html->link('画像を表示する', array(
            'controller' => 'images',
            'action' => 'view',
            1,
            '?' => array('height' => 400, 'width' => 500))
        );

    出力結果:

    .. code-block:: html

        <a href="/images/view/1?height=400&width=500">画像を表示する</a>

    名前付きパラメータを使用している場合、配列構文を使用するか URL 中に
    全てのパラメータ名を含めてください。パラメータ付きの文字列構文 (たとえば
    "recipes/view/6/comments:false") は、コロン文字列が
    HTML エスケープされるので、リンクが希望通りに働きません。 ::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
            array(
                'controller' => 'recipes',
                'action' => 'view',
                'id' => 6,
                'comments' => false
            )
        );

    出力結果:

    .. code-block:: html

        <a href="/recipes/view/id:6/comments:false">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    HTML で特殊な意味を持つ文字が ``$title`` に含まれていた場合は、 HTML
    エンティティに変換されます。これを無効にするには、 ``$options``
    配列の ``escape`` オプションに ``false`` を設定します。::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
            "recipes/view/6",
            array('escape' => false)
        );

    出力結果:

    .. code-block:: html

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    ``escape`` を false に設定することで、リンクの属性のエスケープ処理を無効化します。
    2.4 から、 ``escapeTitle`` オプションを使用して、title 属性以外のエスケープ処理を
    無効化できます。 ::

        <?php
        echo $this->Html->link(
            $this->Html->image('recipes/6.jpg', array('alt' => 'Brownies')),
            'recipes/view/6',
            array('escapeTitle' => false, 'title' => 'hi "howdy"')
        );

    出力結果:

    .. code-block:: html

        <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    .. versionchanged:: 2.4
        ``escapeTitle`` オプションが追加されました。

    .. versionchanged:: 2.6
        ``$confirmMessage`` 変数は非推奨です。 代わりに ``$options`` の
        ``confirm`` キーを使用してください。

    そのほかの種類の URL については、 :php:meth:`HtmlHelper::url`
    メソッドの項目も参考にしてください。

.. php:method:: media(string|array $path, array $options)

    :param string|array $path: メディアファイルへの
        `webroot/{$options['pathPrefix']}` ディレクトリからの相対的なパス。
        または自身がパス文字列の配列、または `src` や `type` キーを含む連想配列。
    :param array $options: HTML の属性や特別なオプションを設定します。

        オプション:

        - `type` メディアタグを作成する際の種類を指定します。有効な値は "audio"
          か "video" です。指定しなかった場合はファイルの MIME タイプから判別します。
        - `text` audio/video タグに含めるテキストを設定します。
        - `pathPrefix` 相対的な URL のパスに使うプレフィックスを設定します。既定では
          'files/' が使われます。
        - `fullBase` ドメイン名を含めた完全なアドレスを src 属性に指定したい場合に設定します。

    .. versionadded:: 2.1

    フォーマットされた audio/video タグを返します。

    .. code-block:: php

        <?php echo $this->Html->media('audio.mp3'); ?>

        // 出力結果
        <audio src="/files/audio.mp3"></audio>

        <?php echo $this->Html->media('video.mp4', array(
            'fullBase' => true,
            'text' => 'Fallback text'
        )); ?>

        // 出力結果
        <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

       <?php echo $this->Html->media(
            array(
                'video.mp4',
                array(
                    'src' => 'video.ogg',
                    'type' => "video/ogg; codecs='theora, vorbis'"
                )
            ),
            array('autoplay')
        ); ?>

        // 出力結果
        <video autoplay="autoplay">
            <source src="/files/video.mp4" type="video/mp4"/>
            <source src="/files/video.ogg" type="video/ogg;
                codecs='theora, vorbis'"/>
        </video>

.. php:method:: tag(string $tag, string $text, array $options)

    :param string $tag: 生成するタグの名前
    :param string $text: タグの内容
    :param array $options: :term:`HTML属性` の配列

    text を囲った tag 指定したタグを返します。text を指定しなかった場合、
    <tag> という開始タグのみを返します。

    .. code-block:: php

        <?php
        echo $this->Html->tag('span', 'Hello World.', array('class' => 'welcome'));
        ?>

        // 出力結果
        <span class="welcome">Hello World</span>

        // text を指定しなかった場合です。
        <?php
        echo $this->Html->tag('span', null, array('class' => 'welcome'));
        ?>

        // 出力結果
        <span class="welcome">

    .. note::

        text は既定ではエスケープされませんが、
        ``$options['escape'] = true`` と設定することでエスケープすることができます。
        以前のバージョンでは、4つ目の引数に ``boolean $escape = false``
        と設定することで行います。

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: div タグのクラス名を設定します。
    :param string $text: div タグに含まれる内容を設定します。
    :param array $options: :term:`HTML属性` の配列を設定します。

    div タグで囲ったセクションを作成するために使います。最初の引数で
    CSS のクラスを設定し、次の引数でdivタグで囲うテキストを設定します。
    最後の引数の ``escape`` キーに ``true`` を設定すると、 ``$text`` がエスケープされた
    HTML で出力します。

    text を指定しなかった場合は開始タグのみを返します。

    .. code-block:: php

        <?php
        echo $this->Html->div('error', 'Please enter your credit card number.');
        ?>

        // 出力結果
        <div class="error">Please enter your credit card number.</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: 段落のクラス名です。
    :param string $text: 段落に含める内容です。
    :param array $options: :term:`HTML属性` の配列です。

    text を含め、 CSS のクラスを指定した <p> タグを出力します。
    text に何も指定しなかった場合は <p> の開始タグのみを出力します。

    .. code-block:: php

        <?php
        echo $this->Html->para(null, 'Hello World.');
        ?>

        // 出力結果
        <p>Hello World.</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: 単一の Javascript ファイルを指定する文字列、または
        複数のファイルを指定する文字列の配列です。
    :param array $options: :term:`HTML属性` の配列です。

    ローカルファイルまたは URL で指定したリモートファイルをインクルードします。

    デフォルトでは、ドキュメントのインラインに script タグが追加されます。
    この動きは ``$options['inline']`` を false にすることで抑制することができ、
    ドキュメント内にある他の ``script`` ブロック内に追加します。
    もし、他のブロックへ出力したい場合は、 ``$options['block']`` を指定すると変更可能です。

    ``$options['once']`` は、一回のリクエストで一度だけの読み込みにするか、
    何度も読み込みをするかを制御します。デフォルトは true です。

    $options を使って、生成する script タグの属性を設定することができます。
    この設定は、配列を使ってファイルを指定した場合、
    生成されるすべての script タグに適用されます。

    このメソッドは、指定された JavaScript ファイルが ``/app/webroot/js``
    というディレクトリにあると仮定して動作します。 ::

        echo $this->Html->script('scripts');

    出力結果:

    .. code-block:: html

        <script type="text/javascript" href="/js/scripts.js"></script>

    ``app/webroot/js`` にないファイルをリンクする際は絶対パスを指定します。 ::

        echo $this->Html->script('/otherdir/script_file');

    リモート URL のリンクを指定することもできます。 ::

        echo $this->Html->script('http://code.jquery.com/jquery.min.js');

    出力結果:

    .. code-block:: html

        <script type="text/javascript" href="http://code.jquery.com/jquery.min.js"></script>

    最初の引数を複数のファイル名を含む配列にすることもできます。 ::

        echo $this->Html->script(array('jquery', 'wysiwyg', 'scripts'));

    出力結果:

    .. code-block:: html

        <script type="text/javascript" href="/js/jquery.js"></script>
        <script type="text/javascript" href="/js/wysiwyg.js"></script>
        <script type="text/javascript" href="/js/scripts.js"></script>

    特定の script ブロックにタグを追加したい場合は ``block``
    オプションを指定します。 ::

        echo $this->Html->script('wysiwyg', array('block' => 'scriptBottom'));

    レイアウトで以下のように記述すると、すべての script タグを
    'scriptBottom' に出力することができます。::

        echo $this->fetch('scriptBottom');

    :term:`プラグイン記法` を使うことにより、ロードしたプラグインのスクリプトを
    使うことができます。 ``app/Plugin/DebugKit/webroot/js/toolbar.js`` を
    インクルードするには以下のようにします。::

        echo $this->Html->script('DebugKit.toolbar.js');

    ロードしたプラグインと名前を共有するスクリプトファイルは、以下のようにすると
    インクルードできます。たとえば ``Blog`` プラグインを使用しているときに
    ``app/webroot/js/Blog.plugins.js`` をインクルードするには以下のようにします。::

        echo $this->Html->script('Blog.plugins.js', array('plugin' => false));

    .. versionchanged:: 2.1
        ``block`` オプションが追加されました。
        :term:`プラグイン記法` のサポートが追加されました。

.. php:method::  scriptBlock($code, $options = array())

    :param string $code: script タグ内に含めるコード。
    :param array $options: :term:`HTML属性` の配列。

    ``$code`` を含めた <script> タグを生成します。
    ``$options['inline']`` を false 設定すると、コードブロックはビューブロックの
    ``script`` に置かれます。 そのほかのオプションは script タグの属性として追加されます。
    たとえば、 ``$this->Html->scriptBlock('stuff', array('defer' => true));`` とすると、
    ``defer="defer"`` という属性を持った script タグを生成します。

.. php:method:: scriptStart($options = array())

    :param array $options: :term:`HTML属性` の配列を設定します。
        これは scriptEnd が呼び出されたときに使われます。

    コードブロックのバッファリングを始めます。コードブロックは
    ``scriptStart()`` と ``scriptEnd()`` の間にあるすべてのコードをキャプチャーし、
    ひとつの script タグを生成します。オプションは ``scriptBlock()`` のものと同様です。

.. php:method:: scriptEnd()

    コードブロックのバッファリングを終了し、生成した script 要素を
    出力します。コードブロックをオープンする際、 ``inline => false``
    としていた場合は nullを返します。

    ``scriptStart()`` と ``scriptEnd()`` の使用例を示します。 ::

        $this->Html->scriptStart(array('inline' => false));

        echo $this->Js->alert('I am in the javascript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

    :param array $list: リストにする要素の集合です
    :param array $options: リストのタグについての HTML 属性を設定します。
    :param array $itemOptions: リストアイテムのタグについての HTML 属性を設定します。
    :param string $tag: リストのタグに ol か ul のどちらを使うか指定します。

    ネストしたリストを、連想配列から作成します。 ::

        $list = array(
            'Languages' => array(
                'English' => array(
                    'American',
                    'Canadian',
                    'British',
                ),
                'Spanish',
                'German',
            )
        );
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

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

    :param array $names: テーブルのヘッダー行を生成するためテキストの配列です。
    :param array $trOptions: <tr> の設定のための :term:`HTML属性` の配列です。
    :param array $thOptions: それぞれの <th> タグ要素のための :term:`HTML属性` の配列です。

    <table> タグ内に置くためのヘッダー行を作成します。 ::

        echo $this->Html->tableHeaders(array('Date', 'Title', 'Active'));

    出力結果:

    .. code-block:: html

        <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Active</th>
        </tr>

    ::

        echo $this->Html->tableHeaders(
            array('Date','Title','Active'),
            array('class' => 'status'),
            array('class' => 'product_table')
        );

    出力結果:

    .. code-block:: html

        <tr class="status">
             <th class="product_table">Date</th>
             <th class="product_table">Title</th>
             <th class="product_table">Active</th>
        </tr>

    .. versionchanged:: 2.2
        ``tableHeaders()`` はセルごとの属性を設定できます。以下をご覧ください。

    バージョン 2.2 からは、カラムごとに属性を設定できます。
    既定では ``$thOptions`` で設定した値が使われます。 ::

        echo $this->Html->tableHeaders(array(
            'id',
            array('Name' => array('class' => 'highlight')),
            array('Date' => array('class' => 'sortable'))
        ));

    出力結果:

    .. code-block:: html

        <tr>
            <th>id</th>
            <th class="highlight">Name</th>
            <th class="sortable">Date</th>
        </tr>

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

    :param array $data: 行データの配列の2次元配列。
    :param array $oddTrOptions: 奇数行の <tr> タグの設定をするための :term:`HTML属性` の配列。
    :param array $evenTrOptions: 偶数行の <tr> タグの設定をするための :term:`HTML属性` の配列。
    :param boolean $useCount: "column-$i" というクラスを追加するかどうかを指定します。
    :param boolean $continueOddEven: false に設定すると、奇数偶数のカウントを
        static でない $count を変数として使います。

    奇数行と偶数行で異なる属性を割り当てた表のセルを作成します。
    array() でひとつのセルを囲うと、特定の <td> タグについて属性を
    設定できます。 ::

        echo $this->Html->tableCells(array(
            array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
        ));

    出力結果:

    .. code-block:: html

        <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
        <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
        <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>

    ::

        echo $this->Html->tableCells(array(
            array(
                'Jul 7th, 2007',
                array(
                    'Best Brownies',
                    array('class' => 'highlight')
                ),
                'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array(
                'Aug 1st, 2006',
                'Anti-Java Cake',
                array('No', array('id' => 'special'))
            ),
        ));

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
            array(
                array('Red', 'Apple'),
                array('Orange', 'Orange'),
                array('Yellow', 'Banana'),
            ),
            array('class' => 'darker')
        );

    出力結果:

    .. code-block:: html

        <tr class="darker"><td>Red</td><td>Apple</td></tr>
        <tr><td>Orange</td><td>Orange</td></tr>
        <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: :term:`ルーティング配列`
    :param mixed $full: :php:meth:`Router::url()` のためのオプションを設定する配列または
        ドメイン名を出力するかどうかを指定する boolean 型変数

    コントローラーとアクションの組み合わせが指し示す URL を返します。
    $url を指定しなかった場合は REQUEST\_URI を、それ以外のときは
    コントローラーとアクションの組み合わせから URL を生成して出力します。
    full に true を設定すると、出力結果に ドメイン名を追加します。 ::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "bar"
        ));

        // 出力結果
        /posts/view/bar

    以下に更なる使用例を示します。

    名前付きパラメータの URL::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ));

        // 出力結果
        /posts/view/foo:bar

    拡張子つきの URL::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ));

        // 出力結果
        /posts/list.rss

    ドメイン名を含めた '/' で始まる URL::

        echo $this->Html->url('/posts', true);

        // 出力結果
        http://somedomain.com/posts

    GET パラメータとアンカーつきの URL::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "search",
            "?" => array("foo" => "bar"),
            "#" => "first"
        ));

        // 出力結果
        /posts/search?foo=bar#first

    より詳しい情報は、API 集の
    `Router::url <https://api.cakephp.org/2.x/class-Router.html#_url>`_
    を確認してください。

.. php:method:: useTag(string $tag)

    フォーマットされた既存の ``$tag`` のブロックを返します。 ::

        $this->Html->useTag(
            'form',
            'http://example.com',
            array('method' => 'post', 'class' => 'myform')
        );

    出力結果:

    .. code-block:: html

        <form action="http://example.com" method="post" class="myform">

HtmlHelper が出力するタグの変更
===============================

.. php:method:: loadConfig(mixed $configFile, string $path = null)

    :php:class:`HtmlHelper` 組み込みのタグ設定は、 XH|TML に準拠したものです。
    そのため、 HTML5 に準拠した HTML を生成するためには、新しいタグの設定を
    作成して読み込む必要があります。出力されるタグを変更するためには、
    ``app/Config/html5_tags.php`` というファイルを作成し、以下の内容を記述します。 ::

        $config = array('tags' => array(
            'css' => '<link rel="%s" href="%s" %s>',
            'style' => '<style%s>%s</style>',
            'charset' => '<meta charset="%s">',
            'javascriptblock' => '<script%s>%s</script>',
            'javascriptstart' => '<script>',
            'javascriptlink' => '<script src="%s"%s></script>',
            // ...
        ));

    そのあと、 ``$this->Html->loadConfig('html5_tags');``
    と記述することでこのタグ設定をロードできます。

HtmlHelper を使ったパンくずリストの作成
=======================================

.. php:method:: getCrumbs(string $separator = '&raquo;', string|array|bool $startText = false)

    CakePHP はパンくずリストを自動生成する組み込みメソッドを持っています。
    設置するにはまず、レイアウトテンプレートに以下のようなコードを追加します。 ::

        echo $this->Html->getCrumbs(' > ', 'Home');

    ``$startText`` のオプションは1つの配列も受け付けます。
    これにより、生成された最初のリンクへのさらなる制御を可能にします。 ::

        echo $this->Html->getCrumbs(' > ', array(
            'text' => $this->Html->image('home.png'),
            'url' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'escape' => false
        ));

    ``text`` または ``url`` でないキーは、 ``$options`` パラメータとして
    :php:meth:`~HtmlHelper::link()` に渡されます。

    .. versionchanged:: 2.1
        ``$startText`` パラメータは配列も受け入れることができます。

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    ビューでページのそれぞれにパンくずリストを作るため、
    以下のコードを加えたとします。 ::

        $this->Html->addCrumb('ユーザー', '/users');
        $this->Html->addCrumb('ユーザーの追加', array('controller' => 'users', 'action' => 'add'));

    すると、レイアウトで ``getCrumbs`` を書いたたところに、
    "**Home > ユーザー > ユーザーの追加**" というパンくずリストが追加されます。

.. php:method:: getCrumbList(array $options = array(), mixed $startText)

    :param array $options: ``<ul>`` タグに含めたい :term:`HTML属性`
        の配列です。 'separator' と 'firstClass' 、 'lastClass' 、 'escape' の
        オプションも含めることができます。
    :param string|array $startText: リストの先頭に表示するテキスト、または要素

    (X)HTML のリストとしてパンくずリストを返します。

    このメソッドは、リストと要素の作成に :php:meth:`HtmlHelper::tag()` を使用します。
    :php:meth:`~HtmlHelper::getCrumbs()` と同じように使うには、あらゆるパンくずリストの項目が
    加えられたオプションを使用します。 ``$startText`` パラメータを設定すると
    パンくずリストの最初のリンクとテキストを指定することができます。
    これは、つねにパンくずリストにトップを含めておきたいときに便利です。
    このオプションは :php:meth:`~HtmlHelper::getCrumbs()` の ``$startText``
    オプションと同じ働きをします。

    .. versionchanged:: 2.1
        ``$startText`` が追加されました。

    .. versionchanged:: 2.3
        'separator'と 'firstClass' 、 'lastClass' のオプションが追加されました。

    .. versionchanged:: 2.5
        'escape' オプションが追加されました。


.. meta::
    :title lang=ja: HtmlHelper
    :description lang=ja: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=ja: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
