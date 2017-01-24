Text
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TextHelper(View $view, array $config = [])

TextHelperには、ビュー内のテキストをより使いやすく見やすくするためのメソッドが含まれています。
リンクの有効化、URLのフォーマット、選択した単語やフレーズの範囲にテキストの抜粋を作成、
テキストブロック内のキーワードのハイライト、 長いテキストの長さの切り詰めなどを支援します。

メールアドレスのリンク化
=========================

.. php:method:: autoLinkEmails(string $text, array $options = [])

``$options`` に従い、 ``$text`` に整形されたメールアドレスのリンクを追加します。(
:php:meth:`HtmlHelper::link()` を参照) ::

    $myText = 'For more information regarding our world-famous ' .
        'pastries and desserts, contact info@example.com';
    $linkedText = $this->Text->autoLinkEmails($myText);

出力::

    For more information regarding our world-famous pastries and desserts,
    contact <a href="mailto:info@example.com">info@example.com</a>

このメソッドは自動的に入力をエスケープします。これを無効にする必要がある場合には、 ``escape`` オプションを使用します。

URLのリンク化
=========================

.. php:method:: autoLinkUrls(string $text, array $options = [])

``autoLinkEmails()`` と同様に、https, http, ftp, nntp から始まる文字列を見つけ、適切にリンクします。

このメソッドは自動的に入力をエスケープします。これを無効にする必要がある場合には、 ``escape`` オプションを使用します。

URLとメールアドレス両方のリンク化
=====================================

.. php:method:: autoLink(string $text, array $options = [])

与えられた ``$text`` に対して、 ``autoLinkUrls()`` と ``autoLinkEmails()`` 両方の機能を実行します。
全てのURLとメールアドレスは与えられた ``$options`` に適切にリンクします。

このメソッドは自動的に入力をエスケープします。これを無効にする必要がある場合には、 ``escape`` オプションを使用します。

テキストの段落化
=======================

.. php:method:: autoParagraph(string $text)

2行改行されている場合は適切にテキストを<p>で囲み、
1行改行には<br>を追加します。::

    $myText = 'For more information
    regarding our world-famous pastries and desserts.

    contact info@example.com';
    $formattedText = $this->Text->autoParagraph($myText);

出力::

    <p>For more information<br />
    regarding our world-famous pastries and desserts.</p>
    <p>contact info@example.com</p>

.. include:: /core-libraries/text.rst
    :start-after: start-text
    :end-before: end-text

.. meta::
    :title lang=ja: TextHelper
    :description lang=ja: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=ja: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
