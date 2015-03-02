.. Constants & Functions

グローバル定数およびグローバル関数
##################################

..
    While most of your day-to-day work in CakePHP will be utilizing
    core classes and methods, CakePHP features a number of global
    convenience functions that may come in handy. Many of these
    functions are for use with CakePHP classes (loading model or
    component classes), but many others make working with arrays or
    strings a little easier.

CakePHPを使った皆さんの日常のほとんどの業務ではコアクラスやメソッドを用いることになるでしょうが、ちょっとした役に立つ便利なグローバル関数もCakePHPにはたくさんあります。
この関数のほとんどはCakePHPのクラスと一緒に使うためのもの（モデルやコンポーネントクラスのローディングなど）ですが、他の多くは、配列や文字列の扱いを少し楽にしてくれるものです。

..
    We’ll also cover some of the constants available in CakePHP
    applications. Using these constants will help make upgrades more
    smooth, but are also convenient ways to point to certain files or
    directories in your CakePHP application.

また、CakePHP のアプリケーションで利用可能な定数も同時におさえておきましょう。
これらの定数を用いることはよりスムースなアップグレードの助けになるだけでなく、CakePHPアプリケーション内の特定のファイルやディレクトリを指し示す便利なやり方でもあります。

.. Global Functions

グローバル関数
==============

..
    Here are CakePHP's globally available functions. Most of them
    are just convenience wrappers for other CakePHP functionality,
    such as debugging and translating content.

以下、CakePHPの使用可能なグローバル関数です。
その多くは、デバッグしたり内容を翻訳したりといった、機能的に他の CakePHP の単なる便利なラッパーになっています。


.. php:function:: \_\_(string $string_id, [$formatArgs])

    ..
        This function handles localization in CakePHP applications. The
        ``$string_id`` identifies the ID for a translation.  Strings
        used for translations are treated as format strings for
        ``sprintf()``.  You can supply additional arguments to replace
        placeholders in your string

    この関数は CakePHP のアプリケーションでのローカライズを担います。
    ``$string_id`` で翻訳時のIDを定めます。
    翻訳のために指定される文字列は、``sprintf()`` 関数でのフォーマット文字列としてあつかわれます。
    その文字列内のプレースホルダーを置き換えるための、追加の引数を供給できます::


        __('You have %s unread messages', $number);

    .. note::

        ..
            Check out the
            :doc:`/core-libraries/internationalization-and-localization`
            section for more information.

        より詳しい情報は
        :doc:`/core-libraries/internationalization-and-localization`
        のセクションを確認して下さい。

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    .. Allows you to override the current domain for a single message lookup.

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。

    .. Useful when internationalizing a plugin:

    プラグインを国際化するときに便利です:
    ``echo __d('PluginName', 'This is my plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Allows you to override the current domain for a single plural message
        lookup. Returns correct plural form of message identified by
        ``$singular`` and ``$plural`` for count ``$count`` from domain
        ``$domain``.

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    ``$domain`` でドメインを指定し、``$count`` の数を数え、 ``$singular`` と
    ``$plural`` に基いて複数形を正しく処理したメッセージを返します。

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    ..
        Allows you to override the current domain for a single message lookup. It
        also allows you to specify a context.

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。
    また、あなたがコンテキストを指定することができます。

    ..
        The context is a unique identifier for the translations string that
        makes it unique for in the same domain.

    コンテキストは、同じドメイン内のため
    それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Allows you to override the current domain for a single plural message
        lookup. It also allows you to specify a context. Returns correct plural
        form of message identified by ``$singular`` and ``$plural`` for count
        ``$count`` from domain ``$domain``. Some languages have more than one
        form for plural messages dependent on the count.

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    また、あなたがコンテキストを指定することができます。
    ``$domain`` でドメインを指定し、``$count`` の数を数え、 ``$singular`` と
    ``$plural`` に基いて複数形を正しく処理したメッセージを返します。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

    ..
        The context is a unique identifier for the translations string that
        makes it unique for in the same domain.

    コンテキストは、同じドメイン内のため
    それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Returns correct plural form of message identified by ``$singular`` and
        ``$plural`` for count ``$count``. Some languages have more than one form
        for plural messages dependent on the count.

    ``$count`` の数を数え、 ``$singular`` と ``$plural`` に基いて複数形を正しく処理したメッセージを返します。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    ..
        The context is a unique identifier for the translations string that
        makes it unique for in the same domain.

    コンテキストは、同じドメイン内のため
    それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Returns correct plural form of message identified by ``$singular`` and
        ``$plural`` for count ``$count``. It also allows you to specify a
        context. Some languages have more than one form for plural messages
        dependent on the count.

    ``$count`` の数を数え、 ``$singular`` と ``$plural``
    に基いて複数形を正しく処理したメッセージを返します。
    また、あなたがコンテキストを指定することができます。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

    ..
        The context is a unique identifier for the translations string that
        makes it unique for in the same domain.

    コンテキストは、同じドメイン内のため
    それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: collection(mixed $items)

    ..
        Convenience wrapper for instantiating a new
        :php:class:`Cake\Collection\Collection` object, wrapping the passed
        argument. The ``$items`` parameter takes either a ``Traversable`` object
        or an array.

    渡された引数をラップする、新しい :php:class:`Cake\Collection\Collection`
    オブジェクトをインスタンス化するための簡易ラッパー。``$items`` パラメータは
    ``Traversable`` オブジェクトまたは配列のいずれかを取ります。

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    ..
        If the core ``$debug`` variable is ``true``, ``$var`` is printed out.
        If ``$showHTML`` is ``true`` or left as ``null``, the data is rendered
        to be browser-friendly.
        If ``$showFrom`` is not set to ``false``, the debug output will start
        with the line from which it was called
        Also see :doc:`/development/debugging`

    コア ``$debug`` 変数が ``true`` であれば、 ``$var`` がプリントアウトされる。
    ``$showHTML`` が ``true`` あるいは ``null`` のままであればデータはブラウザ表示に相応しいように描画されます。
    ``$showFrom`` が ``false`` にセットされない場合、それがコールされた行の情報を伴ってデバグ情報の出力が始まります。
    :doc:`/development/debugging` も参照して下さい

.. php:function:: env(string $key)

    ..
        Gets an environment variable from available sources. Used as a
        backup if ``$_SERVER`` or ``$_ENV`` are disabled.

    ..
        This function also emulates ``PHP_SELF`` and ``DOCUMENT_ROOT`` on
        unsupporting servers. In fact, it's a good idea to always use
        ``env()`` instead of ``$_SERVER`` or ``getenv()`` (especially if
        you plan to distribute the code), since it's a full emulation
        wrapper.

    可能な限りの環境変数を取得します。仮に ``$_SERVER`` か ``$_ENV`` が使用不可の場合にはバックアップとして用いられます。

    この関数はまた、``PHP_SELF`` と ``DOCUMENT_ROOT`` を、非サポートのサーバー上でエミュレートします。
    これは完全なエミュレーションラッパーなので、``$_SERVER`` や ``getenv()`` の代わりに ``env()`` を常に用いることは、
    （とりわけあなたがコードを配布する予定なら）とても良い考えです。

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    .. Convenience wrapper for ``htmlspecialchars()``.

    ``htmlspecialchars()`` の便利なラッパー。

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    ..
        Splits a dot syntax plugin name into its plugin and classname. If ``$name``
        does not have a dot, then index 0 will be ``null``.

    ドット記法されたプラグイン名をプラグインとクラス名に分離します。
    ``$name`` にドットが含まれない場合、インデクスが 0 の箇所は ``null`` になります。

    .. Commonly used like ``list($plugin, $name) = pluginSplit('Users.User');``

    一般にこんな具合に使われます ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: pr(mixed $var)

    ..
        Convenience wrapper for ``print_r()``, with the addition of
        wrapping ``<pre>`` tags around the output.

    出力を ``<pre>`` タグでラップする機能を追加した ``print_r()`` の便利なラッパー。

.. Core Definition Constants

コア定義定数
============

.. Most of the following constants refer to paths in your application.

以下のほとんどの定数はあなたのアプリケーション内部のパスへの参照です。

.. php:const:: APP

    ..
        Path to the application's directory.

    アプリケーションディレクトリへのパス。

.. php:const:: APP_DIR

    ..
        Equals ``app`` or the name of your application directory.

    あなたのアプリケーションのディレクトリ名。``app`` かも知れません。

.. php:const:: CACHE

    ..
        Path to the cache files directory. It can be shared between hosts in a
        multi-server setup.

    キャッシュファイルディレクトリへのパス。
    複数サーバーをセットアップした際のホスト間で共有できます。

.. php:const:: CAKE

    ..
        Path to the cake directory.

    cake ディレクトリへのパス。

.. php:const:: CAKE_CORE_INCLUDE_PATH

    ..
        Path to the root lib directory.

    ルートの lib ディレクトリへのパス。

.. php:const:: CORE_PATH

    ..
        Path to the root directory with ending directory slash.

    ルートディレクトリへの、末尾にディレクトリスラッシュを付加したパス。

.. php:const:: DS

    ..
        Short for PHP's ``DIRECTORY_SEPARATOR``, which is ``/`` on Linux and
        ``\\`` on Windows.

    PHP の ``DIRECTORY_SEPARATOR`` (Linux の場合は ``/`` Windows の場合は ``\\``) のショートカット。

.. php:const:: LOGS

    .. Path to the logs directory.

    ログディレクトリへのパス。

.. php:const:: ROOT

    .. Path to the root directory.

    ルートディレクトリへのパス。

.. php:const:: TESTS

    .. Path to the tests directory.

    テストディレクトリへのパス。

.. php:const:: TMP

    .. Path to the temporary files directory.

    一時ファイルディレクトリへのパス。

.. php:const:: WWW\_ROOT

    .. Full path to the webroot.

    ウェブルートへのフルパス。


.. Timing Definition Constants

時間定義定数
============

.. php:const:: TIME_START

    ..    Unix timestamp in microseconds as a float from when the application started.

    アプリケーションが開始された時点の、浮動小数点マイクロ秒での UNIX タイムスタンプ。

.. php:const:: SECOND

    ..    Equals 1

    1 と等しい

.. php:const:: MINUTE

    ..    Equals 60

    60 と等しい

.. php:const:: HOUR

    ..    Equals 3600

    3600 と等しい

.. php:const:: DAY

    ..    Equals 86400

    86400 と等しい

.. php:const:: WEEK

    ..    Equals 604800

    604800 と等しい

.. php:const:: MONTH

    ..    Equals 2592000

    2592000 と等しい

.. php:const:: YEAR

    ..    Equals 31536000

    31536000 と等しい


.. meta::
    :title lang=ja: Global Constants and Functions
    :keywords lang=ja: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,sprintf,arrays,parameters,existence,translations
