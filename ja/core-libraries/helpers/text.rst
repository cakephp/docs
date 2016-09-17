TextHelper
##########

.. php:class:: TextHelper(View $view, array $settings = array())

TextHelper は、ビューの中でテキストを作成する際に便利で使いやすいメソッドが
含まれています。リンクの有効化、URL のフォーマット、選ばれた言葉やフレーズの
周りのテキストの抜粋の作成、テキストのブロック内のキーワードのハイライト、
テキストの余分な部分の削除を手伝います。

.. versionchanged:: 2.1
   ``TextHelper`` のいくつかのメソッドは、 ``View`` レイヤーの外でも使用できるように
   :php:class:`String` クラスに移動しました。ビューの中でこれらのメソッドは `TextHelper`
   クラスを経由してアクセス可能です。普通のヘルパーメソッドを呼ぶのと同様に
   ``$this->Text->method($args);`` のように利用できます。

.. php:method:: autoLinkEmails(string $text, array $options=array())

    :param string $text: 変換するテキスト
    :param array $options: 生成されるリンクの :term:`HTML属性` 配列

    $text 中のメールアドレスへのリンクを ``$options`` 中で定義された
    任意のオプションに従って追加します。 (:php:meth:`HtmlHelper::link()` を参照) ::

        $myText = 'For more information regarding our world-famous ' .
            'pastries and desserts, contact info@example.com';
        $linkedText = $this->Text->autoLinkEmails($myText);

    出力結果::

        For more information regarding our world-famous pastries and desserts,
        contact <a href="mailto:info@example.com">info@example.com</a>

    .. versionchanged:: 2.1
        このメソッドは、自動的に入力をエスケープします。これを無効にする必要がある場合、
        ``escape`` オプションを使用してください。

.. php:method:: autoLinkUrls(string $text, array $options=array())

    :param string $text: 変換するテキスト
    :param array $options: 生成されるリンクの :term:`HTML属性` 配列

    ``autoLinkEmails()`` と同様に、このメソッドは、 https, http, ftp, nntp で
    始まる文字列を検索し、それらを適切にリンクします。

    .. versionchanged:: 2.1
        このメソッドは、自動的に入力をエスケープします。これを無効にする必要がある場合、
        ``escape`` オプションを使用してください。

.. php:method:: autoLink(string $text, array $options=array())

    :param string $text: autolink するテキスト
    :param array $options: 生成されるリンクの :term:`HTML属性` 配列

    与えられた ``$text`` に対して ``autoLinkUrls()`` と ``autoLinkEmails()``
    の両方が機能が働きます。全ての URL とメールアドレスに、 ``$options``
    の属性を加えて適切にリンクします。

    .. versionchanged:: 2.1
        このメソッドは、自動的に入力をエスケープします。これを無効にする必要がある場合、
        ``escape`` オプションを使用してください。

.. php:method:: autoParagraph(string $text)

    :param string $text: 変換する文字列

    ２行改行したテキストを適切に <p> で囲み、１行の改行に <br> を追加します。 ::

        $myText = 'For more information
        regarding our world-famous pastries and desserts.

        contact info@example.com';
        $formattedText = $this->Text->autoParagraph($myText);

    出力結果::

        <p>For more information<br />
        regarding our world-famous pastries and desserts.</p>
        <p>contact info@example.com</p>

    .. versionadded:: 2.4

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string


.. meta::
    :title lang=ja: TextHelper
    :description lang=ja: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=ja: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
