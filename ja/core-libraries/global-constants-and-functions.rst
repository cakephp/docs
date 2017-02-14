定数および関数
##############

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
    ``$string_id`` で翻訳時の ID を定めます。
    その文字列内のプレースホルダーを置き換えるための、追加の引数を供給できます。 ::

        __('You have {0} unread messages', $number);

    また、置換する名前インデックス配列を指定できます。 ::

        __('You have {unread} unread messages', ['unread' => $number]);

    .. note::

        より詳しい情報は
        :doc:`/core-libraries/internationalization-and-localization`
        のセクションを確認して下さい。

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。

    プラグインを国際化するときに便利です:
    ``echo __d('PluginName', 'This is my plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    ``$domain`` でドメインを指定し、 ``$count`` の数を数え、 ``$singular`` と
    ``$plural`` に基いて複数形を正しく処理したメッセージを返します。

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    メッセージを一つ取得するために、現在のドメインを変更することが可能です。
    また、あなたがコンテキストを指定することができます。

    コンテキストは、同じドメイン内で、
    それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
    また、あなたがコンテキストを指定することができます。
    ``$domain`` でドメインを指定し、 ``$count`` の数を数え、 ``$singular`` と
    ``$plural`` に基いて複数形を正しく処理したメッセージを返します。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

    コンテキストは、同じドメイン内で、それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    ``$count`` の数を数え、 ``$singular`` と ``$plural`` に基いて複数形を正しく処理した
    メッセージを返します。幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    コンテキストは、同じドメイン内で、それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    ``$count`` の数を数え、 ``$singular`` と ``$plural``
    に基いて複数形を正しく処理したメッセージを返します。
    また、あなたがコンテキストを指定することができます。
    幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

    コンテキストは、同じドメイン内で、それがユニークな翻訳文字列の一意の識別子です。

.. php:function:: collection(mixed $items)

    渡された引数をラップする、新しい :php:class:`Cake\\Collection\\Collection`
    オブジェクトをインスタンス化するための簡易ラッパー。 ``$items`` パラメータは
    ``Traversable`` オブジェクトまたは配列のいずれかを取ります。

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    .. versionchanged:: 3.3.0
	このメソッドを呼ぶと、渡された ``$var`` を返します。例えば、return 文に
	このメソッドを置くことができます。

    コア ``$debug`` 変数が ``true`` であれば、 ``$var`` が出力されます。
    ``$showHTML`` が ``true`` あるいは ``null`` のままであればデータはブラウザ表示に
    相応しいように描画されます。 ``$showFrom`` が ``false`` にセットされない場合、
    それがコールされた行の情報を伴ってデバグ情報の出力が始まります。
    :doc:`/development/debugging` もご覧ください。

.. php:function:: dd(mixed $var, boolean $showHtml = null)

    ``debug()`` のように動作しますが、実行を終了します。
    コア ``$debug`` 変数が ``true`` であれば、 ``$var`` が出力されます。
    ``$showHTML`` が ``true`` あるいは ``null`` のままであればデータはブラウザ表示に
    相応しいように描画されます。 :doc:`/development/debugging` もご覧ください

.. php:function:: pr(mixed $var)

    .. versionchanged:: 3.3.0
	このメソッドを呼ぶと、渡された ``$var`` を返します。例えば、return 文に
	このメソッドを置くことができます。

    出力を ``<pre>`` タグで周りを囲む機能を追加した ``print_r()`` の便利なラッパー。

.. php:function:: pj(mixed $var)

    .. versionchanged:: 3.3.0
	このメソッドを呼ぶと、渡された ``$var`` を返します。例えば、return 文に
	このメソッドを置くことができます。

    出力を ``<pre>`` タグで周りを囲む機能を追加した JSON 整形表示の便利な関数。

    それは、オブジェクトと配列のJSON 表現をデバッグために意図されています。

.. php:function:: env(string $key, string $default = null)

    .. versionadded:: 3.1.1
        ``$default`` パラメータが追加されました。

    可能な限りの環境変数を取得します。仮に ``$_SERVER`` か ``$_ENV`` が使用不可の場合には
    バックアップとして用いられます。

    この関数はまた、 ``PHP_SELF`` と ``DOCUMENT_ROOT`` を、非サポートのサーバー上で
    エミュレートします。これは完全なエミュレーションラッパーなので、 ``$_SERVER`` や
    ``getenv()`` の代わりに ``env()`` を常に用いることは、
    （とりわけあなたがコードを配布する予定なら）とても良い考えです。

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    ``htmlspecialchars()`` の便利なラッパー。

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    ドット記法されたプラグイン名をプラグインとクラス名に分離します。
    ``$name`` にドットが含まれない場合、インデクスが 0 の箇所は ``null`` になります。

    一般に ``list($plugin, $name) = pluginSplit('Users.User');`` のように使われます。

.. php:function:: namespaceSplit(string $class)

    ネームスペースをクラス名から分離します。

    一般に ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``
    のように使われます。

コア定義定数
============

以下のほとんどの定数はあなたのアプリケーション内部のパスへの参照です。

.. php:const:: APP

   アプリケーションディレクトリへの絶対パス。末尾にスラッシュが付きます。

.. php:const:: APP_DIR

    あなたのアプリケーションのディレクトリ名。``app`` かも知れません。

.. php:const:: CACHE

    キャッシュファイルディレクトリへのパス。
    複数サーバーをセットアップした際のホスト間で共有できます。

.. php:const:: CAKE

    cake ディレクトリへのパス。

.. php:const:: CAKE_CORE_INCLUDE_PATH

    ルートの lib ディレクトリへのパス。

.. php:const:: CONFIG

   config ディレクトリへのパス。

.. php:const:: CORE_PATH

    ルートディレクトリへの、末尾にディレクトリスラッシュを付加したパス。

.. php:const:: DS

    PHP の ``DIRECTORY_SEPARATOR`` (Linux の場合は ``/`` Windows の場合は ``\``) 
    のショートカット。

.. php:const:: LOGS

    ログディレクトリへのパス。

.. php:const:: ROOT

    ルートディレクトリへのパス。

.. php:const:: TESTS

    テストディレクトリへのパス。

.. php:const:: TMP

    一時ファイルディレクトリへのパス。

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
    :keywords lang=ja: internationalization and localization,global constants,example config,array php,convenience functions,core libraries,component classes,optional number,global functions,string string,core classes,format strings,unread messages,placeholders,useful functions,arrays,parameters,existence,translations
