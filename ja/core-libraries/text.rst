Text
####

.. php:namespace:: Cake\Utility

.. php:class:: Text

..
    The Text class includes convenience methods for creating and manipulating
    strings and is normally accessed statically. Example:
    ``Text::uuid()``.

Text クラスは文字列を作ったり操作したりする便利なメソッドを持っており、通常は static にアクセスします。例: ``Text::uuid()``

..
    If you need :php:class:`Cake\\View\\Helper\\TextHelper` functionalities outside
    of a ``View``, use the ``Text`` class::

``View`` の外側で :php:class:`Cake\\View\\Helper\\TextHelper` の機能が必要なときは ``Text`` クラスを使ってください::

    namespace App\Controller;

    use Cake\Utility\Text;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth')
        };

        public function afterLogin()
        {
            $message = $this->Users->find('new_message');
            if (!empty($message)) {
                // ユーザに新しいメッセージを通知
                $this->Flash->success(__(
                    'You have a new message: {0}',
                    Text::truncate($message['Message']['body'], 255, ['html' => true])
                ));
            }
        }
    }


..
    Convert Strings into ASCII

ASCII文字への変換
==========================

.. php:staticmethod:: transliterate($string, $transliteratorId = null)

..
    Transliterate by default converts all characters in provided string into
    equivalent ASCII characters. The method expects UTF-8 encoding. The character
    conversion can be controlled using transliteration identifiers which you can
    pass using the ``$transliteratorId`` argument or change the default identifier
    string using ``Text::setTransliteratorId()``. ICU transliteration identifiers
    are basically of form ``<source script>:<target script>`` and you can specify
    multiple conversion pairs separated by ``;``. You can find more info about
    transliterator identifiers
    `here <http://userguide.icu-project.org/transforms/general#TOC-Transliterator-Identifiers>`_::

transliterate はデフォルトで、与えられた文字列の文字すべてを同じ意味のASCII文字に置き換えます。
このメソッドは UTF-8 エンコーディングであることが前提になっています。
文字変換はトランスリテレーション識別子で制御することができます。
この識別子は引数 ``$transliteratorId`` を使って渡すか、
``Text::setTransliteratorId()`` を使ってデフォルトの識別子文字列を変更することができます。
ICU のトランスリテレーション識別子は基本的に ``<元のスクリプト>:<変換後のスクリプト>`` の形で、
``;`` で区切って複数の変換の組み合わせを指定することができます。
トランスリテレーション識別子についての詳細は
`ここ <http://userguide.icu-project.org/transforms/general#TOC-Transliterator-Identifiers>`_
を参照してください::

    // apple puree
    Text::transliterate('apple purée');

    // Ubermensch (ラテン文字だけを変換する)
    Text::transliterate('Übérmensch', 'Latin-ASCII;');

..Creating URL Safe Strings

URLに安全な文字列の作成
=========================

.. php:staticmethod:: slug($string, $options = [])

..
    Slug transliterates all characters into ASCII versions and converting unmatched
    characters and spaces to dashes. The slug method expects UTF-8 encoding.

slug はすべての文字を ASCII バージョンにトランスリテレートし（別言語の文字に置き換え）、
マッチしない文字や空白はダッシュに変換します。
slug メソッドは UTF-8 エンコーディングであること前提にしています。

..
    You can provide an array of options that controls slug. ``$options`` can also be
    a string in which case it will be used as replacement string. The supported
    options are:

slug をコントロールするオプション配列を渡すことができます。
``$options`` は文字列で指定することもでき、その場合は置き換え文字列として使われます。
利用可能なオプションは次の通りです:

..
    * ``replacement`` Replacement string, defaults to '-'.
    * ``transliteratorId`` A valid tranliterator id string.
       If default ``null`` ``Text::$_defaultTransliteratorId`` to be used.
       If `false` no transliteration will be done, only non words will be removed.
    * ``preserve`` Specific non-word character to preserve. Defaults to ``null``.
       For e.g. this option can be set to '.' to generate clean file names::

* ``replacement`` 置き換え文字列。デフォルトは '-' 。
* ``transliteratorId`` 有効なトランスリテレータIDの文字列。
   デフォルトの ``null`` なら、``Text::$_defaultTransliteratorId`` が使われます。
   `false` なら、トランスリテレーションは実行されず、非単語のみが削除されます。
* ``preserve`` 保持したい特定の非単語文字。デフォルトは ``null`` 。
   たとえば、このオプションに '.' をセットすることでクリーンなファイル名を生成することができます::


    // apple-puree
    Text::slug('apple purée');

    // apple_puree
    Text::slug('apple purée', '_');

    // foo-bar.tar.gz
    Text::slug('foo bar.tar.gz', ['preserve' => '.']);

..
    Generating UUIDs

UUIDの生成
================

.. php:staticmethod:: uuid()

..
    The UUID method is used to generate unique identifiers as per :rfc:`4122`. The
    UUID is a 128-bit string in the format of
    ``485fc381-e790-47a3-9794-1337c0a8fe68``. ::

UUIDメソッドは :rfc:`4122` 準拠のユニークな識別子を生成するのに使います。

    Text::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68


..
    Simple String Parsing

単純な文字列のパース
=====================

.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

..
    Tokenizes a string using ``$separator``, ignoring any instance of ``$separator``
    that appears between ``$leftBound`` and ``$rightBound``.

``$separator`` を使って文字列をトークン化します。その際、 ``$leftBound`` と ``$rightBound`` の間にある ``$separator`` は無視されます。

..
    This method can be useful when splitting up data that has regular formatting
    such as tag lists::

このメソッドはタグリストのような標準フォーマットを持つデータを分割するのに役立ちます::

    $data = "cakephp 'great framework' php";
    $result = Text::tokenize($data, ' ', "'", "'");
    // 結果
    ['cakephp', "'great framework'", 'php'];

.. php:method:: parseFileSize(string $size, $default)

..
    This method unformats a number from a human-readable byte size to an integer
    number of bytes::

このメソッドは人が読みやすいバイトのサイズのフォーマットから、バイトの整数値へと変換します。

    $int = Text::parseFileSize('2GB');

..
    Formatting Strings

文字列のフォーマット
=====================

.. php:staticmethod:: insert($string, $data, $options = [])

..
    The insert method is used to create string templates and to allow for key/value
    replacements::

insert メソッドは文字列テンプレートを作り、key/value で置き換えるのに使います。

    Text::insert(
        'My name is :name and I am :age years old.',
        ['name' => 'Bob', 'age' => '65']
    );
    // これを返す: "My name is Bob and I am 65 years old."

.. php:staticmethod:: cleanInsert($string, $options = [])

..
    Cleans up a ``Text::insert`` formatted string with given ``$options`` depending
    on the 'clean' key in ``$options``. The default method used is text but html is
    also available. The goal of this function is to replace all whitespace and
    unneeded markup around placeholders that did not get replaced by
    ``Text::insert``.

``$options`` 内の 'clean' キーに従って、 ``Text::insert`` でフォーマットされた文字列を掃除します。
デフォルトで method に使われるのは text ですが html も使えます。
この機能の目的は、``Text::insert`` で置き換えられなかった、プレイホルダ周辺のすべての空白と不要なマークアップを置き換えることにあります。

..
    You can use the following options in the options array::

options 配列内で下記のオプションを使うことができます::

    $options = [
        'clean' => [
            'method' => 'text', // もしくは html
        ],
        'before' => '',
        'after' => ''
    ];

Wrapping Text
=============

.. php:staticmethod:: wrap($text, $options = [])

Wraps a block of text to a set width and indents blocks as well.
Can intelligently wrap text so words are not sliced across lines::

    $text = 'This is the song that never ends.';
    $result = Text::wrap($text, 22);

    // Returns
    This is the song that
    never ends.

You can provide an array of options that control how wrapping is done. The
supported options are:

* ``width`` The width to wrap to. Defaults to 72.
* ``wordWrap`` Whether or not to wrap whole words. Defaults to ``true``.
* ``indent`` The character to indent lines with. Defaults to ''.
* ``indentAt`` The line number to start indenting text. Defaults to 0.

.. php:staticmethod:: wrapBlock($text, $options = [])

If you need to ensure that the total width of the generated block won't
exceed a certain length even with internal identation, you need to use
``wrapBlock()`` instead of ``wrap()``. This is particulary useful to generate
text for the console for example. It accepts the same options than ``wrap()``::

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

.. start-text

Highlighting Substrings
=======================

.. php:method:: highlight(string $haystack, string $needle, array $options = [] )

Highlights ``$needle`` in ``$haystack`` using the ``$options['format']`` string
specified or a default string.

Options:

-  ``format`` string - The piece of HTML with the phrase that will be
   highlighted
-  ``html`` bool - If ``true``, will ignore any HTML tags, ensuring that only
   the correct text is highlighted

Example::

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

Output::

    Highlights $needle in $haystack <span class="highlight">using</span> the
    $options['format'] string specified  or a default string.

Removing Links
==============

.. php:method:: stripLinks($text)

Strips the supplied ``$text`` of any HTML links.


Truncating Text
===============

.. php:method:: truncate(string $text, int $length = 100, array $options)

If ``$text`` is longer than ``$length``, this method truncates it at ``$length``
and adds a suffix consisting of ``'ellipsis'``, if defined. If ``'exact'`` is
passed as ``false``, the truncation will occur at the first whitespace after the
point at which ``$length`` is exceeded. If ``'html'`` is passed as ``true``,
HTML tags will be respected and will not be cut off.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional::

    [
        'ellipsis' => '...',
        'exact' => true,
        'html' => false
    ]

Example::

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

Output::

    The killer crept...

Truncating the Tail of a String
===============================

.. php:method:: tail(string $text, int $length = 100, array $options)

If ``$text`` is longer than ``$length``, this method removes an initial
substring with length consisting of the difference and prepends a prefix
consisting of ``'ellipsis'``, if defined. If ``'exact'`` is passed as ``false``,
the truncation will occur at the first whitespace prior to the point at which
truncation would otherwise take place.

``$options`` is used to pass all extra parameters, and has the following
possible keys by default, all of which are optional::

    [
        'ellipsis' => '...',
        'exact' => true
    ]

Example::

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

Output::

    ...a TV, a C# program that can divide by zero, death metal t-shirts

Extracting an Excerpt
=====================

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

Extracts an excerpt from ``$haystack`` surrounding the ``$needle`` with a number
of characters on each side determined by ``$radius``, and prefix/suffix with
``$ellipsis``. This method is especially handy for search results. The query
string or keywords can be shown within the resulting document. ::

    // Called as TextHelper
    echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

    // Called as Text
    use Cake\Utility\Text;

    echo Text::excerpt($lastParagraph, 'method', 50, '...');

Output::

    ... by $radius, and prefix/suffix with $ellipsis. This method is especially
    handy for search results. The query...

Converting an Array to Sentence Form
====================================

.. php:method:: toList(array $list, $and='and', $separator=', ')

Creates a comma-separated list where the last two items are joined with 'and'::

    // Called as TextHelper
    echo $this->Text->toList($colors);

    // Called as Text
    use Cake\Utility\Text;

    echo Text::toList($colors);

Output::

    red, orange, yellow, green, blue, indigo and violet

.. end-text

.. meta::
    :title lang=en: Text
    :keywords lang=en: slug,transliterate,ascii,array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates
