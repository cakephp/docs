.. Global Constants and Functions

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

.. php:function:: __c(string $msg, integer $category, mixed $args = null)

    ..
        Note that the category must be specified with a numeric value, instead of
        the constant name. The values are

    カテゴリは定義済みの名前をそのまま使うのではなく、数値で指定されなければなりません。それらの値は以下の通り:

    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    .. Allows you to override the current domain for a single message lookup.

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。

    .. Useful when internationalizing a plugin:

    プラグインを国際化するときに便利です:
    ``echo __d('plugin_name', 'This is my plugin');``

.. php:function:: __dc(string $domain, string $msg, integer $category, mixed $args = null)

    ..
        Allows you to override the current domain for a single message lookup. It
        also allows you to specify a category.

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。
    同時に、カテゴリを指定することも出来ます。

    ..
        Note that the category must be specified with a numeric value, instead of
        the constant name. The values are:

    カテゴリは定義済みの名前をそのまま使うのではなく、数値で指定されなければなりません。
    それらの値は以下の通り:

    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)

    ..
        Allows you to override the current domain for a single plural message
        lookup. It also allows you to specify a category. Returns correct plural
        form of message identified by $singular and $plural for count $count from
        domain $domain.

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    同時に、カテゴリを指定することも出来ます。
    $domain でドメインを指定し、$count の数を数え、 $singular と $plural に基いて複数形を正しく処理したメッセージを返します。

    ..
        Note that the category must be specified with a numeric value, instead of
        the constant name. The values are:

    カテゴリは定義済みの名前をそのまま使うのではなく、数値で指定されなければなりません。
    それらの値は以下の通り:

    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Allows you to override the current domain for a single plural message
        lookup. Returns correct plural form of message identified by $singular and
        $plural for count $count from domain $domain.

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    $domain でドメインを指定し、$count の数を数え、 $singular と $plural に基いて複数形を正しく処理したメッセージを返します。

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    ..
        Returns correct plural form of message identified by $singular and $plural
        for count $count. Some languages have more than one form for plural
        messages dependent on the count.

    $count の数を数え、 $singular と $plural に基いて複数形を正しく処理したメッセージを返します。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

.. php:function:: am(array $one, $two, $three...)

    ..
        Merges all the arrays passed as parameters and returns the merged
        array.

    パラメータとして渡されてすべての配列をマージして、その結果の配列を返します。

.. php:function:: config()

    ..
        Can be used to load files from your application ``config``-folder
        via include\_once. Function checks for existence before include and
        returns boolean. Takes an optional number of arguments.

    アプリケーション内の ``config`` フォルダから include\_once 経由でファイルをロードするために使用することが出来ます。
    この関数はインクルードする前にファイルの存在チェックを行い、ブール値を返します。
    任意の数の引数を取ります。

    .. Example: ``config('some_file', 'myconfig');``

    例: ``config('some_file', 'myconfig');``

.. php:function:: convertSlash(string $string)

    ..
        Converts forward slashes to underscores and removes the first and
        last underscores in a string. Returns the converted string.

    文字列のスラッシュをアンダースコアに変換し、最初と最後のアンダースコアを削除します。
    変換した文字列を返します。

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    ..
        If the application's DEBUG level is non-zero, $var is printed out.
        If ``$showHTML`` is true or left as null, the data is rendered to be
        browser-friendly.
        If $showFrom is not set to false, the debug output will start with the line from
        which it was called
        Also see :doc:`/development/debugging`

    アプリケーションの DEBUG レベルがゼロ以外の場合に $var が出力されます。
    ``$showHTML`` が true あるいは null のままであればデータはブラウザ表示に相応しいように描画されます。
    ``$showFrom`` が false にセットされない場合、それがコールされた行の情報を伴ってデバグ情報の出力が始まります。
    :doc:`/development/debugging` も参照して下さい


.. php:function:: env(string $key)

    ..
        Gets an environment variable from available sources. Used as a
        backup if ``$_SERVER`` or ``$_ENV`` are disabled.

    ..
        This function also emulates PHP\_SELF and DOCUMENT\_ROOT on
        unsupporting servers. In fact, it's a good idea to always use
        ``env()`` instead of ``$_SERVER`` or ``getenv()`` (especially if
        you plan to distribute the code), since it's a full emulation
        wrapper.

    可能な限りの環境変数を取得します。仮に ``$_SERVER`` か ``$_ENV`` が使用不可の場合にはバックアップとして用いられます。

    この関数はまた、PHP\_SELF と DOCUMENT\_ROOT を、非サポートのサーバー上でエミュレートします。
    これは完全なエミュレーションラッパーなので、``$_SERVER`` や ``getenv()`` の代わりに ``env()`` を常に用いることは、
    （とりわけあなたがコードを配布する予定なら）とても良い考えです。


.. php:function:: fileExistsInPath(string $file)

    ..
        Checks to make sure that the supplied file is within the current
        PHP include\_path. Returns a boolean result.

    渡されたファイルが、現在の PHP include\_path の中にあるかどうかをチェックします。
    ブール値の結果を返します。

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    .. Convenience wrapper for ``htmlspecialchars()``.

    ``htmlspecialchars()`` の便利なラッパー。

.. php:function:: LogError(string $message)

    .. Shortcut to :php:meth:`Log::write()`.

    :php:meth:`Log::write()` へのショートカット。

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    ..
        Splits a dot syntax plugin name into its plugin and classname. If $name
        does not have a dot, then index 0 will be null.

    ドット記法されたプラグイン名をプラグインとクラス名に分離します。
    $name にドットが含まれない場合、インデクスが 0 の箇所は null になります。

    .. Commonly used like ``list($plugin, $name) = pluginSplit('Users.User');``

    一般にこんな具合に使われます ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: pr(mixed $var)

    ..
        Convenience wrapper for ``print_r()``, with the addition of
        wrapping <pre> tags around the output.

    出力を <pre> タグでラップする機能を追加した ``print_r()`` の便利なラッパー。

.. php:function:: sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)

    .. Sorts given $array by key $sortby.

    与えられた $array を $sortby キーによってソートします。

.. php:function:: stripslashes_deep(array $value)

    ..
        Recursively strips slashes from the supplied ``$value``. Returns
        the modified array.

    与えられた ``$value`` から、再帰的にスラッシュを取り除きます。
    変換された配列を返します。

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

.. php:const:: APPLIBS

    ..
        Path to the application's Lib directory.

    アプリケーションの Lib ディレクトリへのパス。

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

.. php:const:: CSS

    ..
        Path to the public CSS directory.

    public CSS ディレクトリへのパス。

.. php:const:: CSS_URL

    ..
        Web path to the CSS files directory.

    CSS ファイル・ディレクトリへの Webパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.cssBaseUrl`` を使用して下さい。

.. php:const:: DS

    .. Short for PHP's DIRECTORY\_SEPARATOR, which is / on Linux and \\ on windows.

    PHP の DIRECTORY\_SEPARATOR (Linux の場合は / windows の場合は \\) のショートカット。

.. php:const:: FULL_BASE_URL

    .. Full url prefix. Such as ``https://example.com``

    ``https://example.com`` のような完全なURLプリフィクス。

    .. deprecated:: 2.4
        この定数は廃止されたので、代わりに :php:meth:`Router::fullbaseUrl()` を使用する必要があります。

.. php:const:: IMAGES

    .. Path to the public images directory.

    画像の公開ディレクトリへのパス。

.. php:const:: IMAGES_URL

    .. Web path to the public images directory.

    画像の公開ディレクトリへのWebパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.imageBaseUrl`` を使用して下さい。

.. php:const:: JS

    .. Path to the public JavaScript directory.

    JavaScript の公開ディレクトリへのパス。

.. php:const:: JS_URL

    .. Web path to the js files directory.

    JavaScript の公開ディレクトリへのWebパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.jsBaseUrl`` を使用して下さい。

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

.. php:const:: VENDORS

    .. Path to the vendors directory.

    ベンダーディレクトリへのパス。

.. php:const:: WEBROOT_DIR

    .. Equals ``webroot`` or the name of your webroot directory.

    あなたのウェブルートディレクトリの名前。``webroot`` かも知れません。

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
