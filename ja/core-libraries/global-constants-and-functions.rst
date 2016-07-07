グローバル定数およびグローバル関数
##################################

CakePHP を使った皆さんの日常のほとんどの業務ではコアクラスやメソッドを用いることになるでしょうが、
ちょっとした役に立つ便利なグローバル関数も CakePHP にはたくさんあります。この関数のほとんどは
CakePHP のクラスと一緒に使うためのもの（モデルやコンポーネントクラスのローディングなど）ですが、
他の多くは、配列や文字列の扱いを少し楽にしてくれるものです。

また、CakePHP のアプリケーションで利用可能な定数も同時におさえておきましょう。
これらの定数を用いることはよりスムースなアップグレードの助けになるだけでなく、
CakePHP アプリケーション内の特定のファイルやディレクトリを指し示す便利なやり方でもあります。

グローバル関数
==============

以下、CakePHP の使用可能なグローバル関数です。その多くは、デバッグしたり内容を翻訳したりといった、
機能的に他の CakePHP の単なる便利なラッパーになっています。

.. php:function:: \_\_(string $string_id, [$formatArgs])

    この関数は CakePHP のアプリケーションでのローカライズを担います。
    ``$string_id`` で翻訳時の ID を定めます。翻訳のために指定される文字列は、
    ``sprintf()`` 関数でのフォーマット文字列としてあつかわれます。
    その文字列内のプレースホルダーを置き換えるための、追加の引数を供給できます::

        __('You have %s unread messages', h($number));

    .. note::

        より詳しい情報は
        :doc:`/core-libraries/internationalization-and-localization`
        のセクションを確認して下さい。

.. php:function:: __c(string $msg, integer $category, mixed $args = null)

    カテゴリは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
    それらの値は以下の通り:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。

    プラグインを国際化するときに便利です:
    ``echo __d('plugin_name', 'This is my plugin');``

.. php:function:: __dc(string $domain, string $msg, integer $category, mixed $args = null)

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。
    同時に、カテゴリを指定することも出来ます。

    カテゴリは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
    それらの値は以下の通り:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    同時に、カテゴリを指定することも出来ます。 $domain でドメインを指定し、 $count の数を数え、
    $singular と $plural に基いて複数形を正しく処理したメッセージを返します。

    カテゴリは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
    それらの値は以下の通り:

    - I18n::LC_ALL - LC_ALL
    - I18n::LC_COLLATE - LC_COLLATE
    - I18n::LC_CTYPE - LC_CTYPE
    - I18n::LC_MONETARY - LC_MONETARY
    - I18n::LC_NUMERIC - LC_NUMERIC
    - I18n::LC_TIME - LC_TIME
    - I18n::LC_MESSAGES - LC_MESSAGES

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    $domain でドメインを指定し、 $count の数を数え、 $singular と $plural
    に基いて複数形を正しく処理したメッセージを返します。

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    $count の数を数え、 $singular と $plural に基いて複数形を正しく処理したメッセージを返します。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

.. php:function:: am(array $one, $two, $three...)

    パラメータとして渡されてすべての配列をマージして、その結果の配列を返します。

.. php:function:: config()

    アプリケーション内の ``config`` フォルダから include\_once 経由でファイルをロードするために
    使用することが出来ます。この関数はインクルードする前にファイルの存在チェックを行い、ブール値を返します。
    任意の数の引数を取ります。

    例: ``config('some_file', 'myconfig');``

.. php:function:: convertSlash(string $string)

    文字列のスラッシュをアンダースコアに変換し、最初と最後のアンダースコアを削除します。
    変換した文字列を返します。

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    アプリケーションの DEBUG レベルがゼロ以外の場合に $var が出力されます。
    ``$showHTML`` が true あるいは null のままであればデータはブラウザ表示に相応しいように描画されます。
    ``$showFrom`` が false にセットされない場合、それがコールされた行の情報を伴ってデバグ情報の出力が始まります。
    :doc:`/development/debugging` も参照して下さい

.. php:function:: stackTrace(array $options = array())

    もしアプリケーションのデバッグレベルが 0 以外の場合、スタックトレースが出力されます。

.. php:function:: env(string $key)

    可能な限りの環境変数を取得します。もし ``$_SERVER`` か ``$_ENV`` が使用不可の場合には
    バックアップとして用いられます。

    この関数はまた、PHP\_SELF と DOCUMENT\_ROOT を、非サポートのサーバー上でエミュレートします。
    これは完全なエミュレーションラッパーなので、``$_SERVER`` や ``getenv()`` の代わりに
    ``env()`` を常に用いることは、（とりわけあなたがコードを配布する予定なら）とても良い考えです。

.. php:function:: fileExistsInPath(string $file)

    渡されたファイルが、現在の PHP include\_path の中にあるかどうかをチェックします。
    ブール値の結果を返します。

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    ``htmlspecialchars()`` の便利なラッパー。

.. php:function:: LogError(string $message)

    :php:meth:`Log::write()` へのショートカット。

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    ドット記法されたプラグイン名をプラグインとクラス名に分離します。
    $name にドットが含まれない場合、インデクスが 0 の箇所は null になります。

    一般にこんな具合に使われます ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: pr(mixed $var)

    出力を <pre> タグでラップする機能を追加した ``print_r()`` の便利なラッパー。

.. php:function:: sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)

    与えられた $array を $sortby キーによってソートします。

.. php:function:: stripslashes_deep(array $value)

    与えられた ``$value`` から、再帰的にスラッシュを取り除きます。
    変換された配列を返します。

コア定義定数
============

以下のほとんどの定数はあなたのアプリケーション内部のパスへの参照です。

.. php:const:: APP

    末尾にスラッシュを含むアプリケーションディレクトリへの絶対パス。

.. php:const:: APP_DIR

    あなたのアプリケーションのディレクトリ名。``app`` かも知れません。

.. php:const:: APPLIBS

    アプリケーションの Lib ディレクトリへのパス。

.. php:const:: CACHE

    キャッシュファイルディレクトリへのパス。
    複数サーバーをセットアップした際のホスト間で共有できます。

.. php:const:: CAKE

    cake ディレクトリへのパス。

.. php:const:: CAKE_CORE_INCLUDE_PATH

    ルートの lib ディレクトリへのパス。

.. php:const:: CORE_PATH

    ルートディレクトリへの、末尾にディレクトリスラッシュを付加したパス。

.. php:const:: CSS

    公開 CSS ディレクトリへのパス。

    .. deprecated:: 2.4

.. php:const:: CSS_URL

    CSS ファイル・ディレクトリへのウェブパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.cssBaseUrl`` を使用して下さい。

.. php:const:: DS

    PHP の DIRECTORY\_SEPARATOR (Linux の場合は / Windows の場合は \\) のショートカット。

.. php:const:: FULL_BASE_URL

    ``https://example.com`` のような完全な URL プリフィクス。

    .. deprecated:: 2.4
        この定数は非推奨です。代わりに :php:meth:`Router::fullBaseUrl()` を使用してください。

.. php:const:: IMAGES

    画像の公開ディレクトリへのパス。

    .. deprecated:: 2.4

.. php:const:: IMAGES_URL

    画像の公開ディレクトリへのウェブパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.imageBaseUrl`` を使用してください。

.. php:const:: JS

    JavaScript の公開ディレクトリへのパス。

    .. deprecated:: 2.4

.. php:const:: JS_URL

    JavaScript の公開ディレクトリへのウェブパス。

    .. deprecated:: 2.4
        代わりに設定値の ``App.jsBaseUrl`` を使用してください。

.. php:const:: LOGS

    ログディレクトリへのパス。

.. php:const:: ROOT

    ルートディレクトリへのパス。

.. php:const:: TESTS

    テストディレクトリへのパス。

.. php:const:: TMP

    一時ファイルディレクトリへのパス。

.. php:const:: VENDORS

    ベンダーディレクトリへのパス。

.. php:const:: WEBROOT_DIR

    あなたのウェブルートディレクトリの名前。 ``webroot`` かも知れません。

.. php:const:: WWW\_ROOT

    ウェブルートへのフルパス。

時間定義定数
============

.. php:const:: TIME_START

    アプリケーションが開始された時点の、浮動小数点マイクロ秒での UNIX タイムスタンプ。

.. php:const:: SECOND

    1 と等しい

.. php:const:: MINUTE

    60 と等しい

.. php:const:: HOUR

    3600 と等しい

.. php:const:: DAY

    86400 と等しい

.. php:const:: WEEK

    604800 と等しい

.. php:const:: MONTH

    2592000 と等しい

.. php:const:: YEAR

    31536000 と等しい


.. meta::
    :title lang=ja: Global Constants and Functions
    :keywords lang=ja: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,sprintf,arrays,parameters,existence,translations
