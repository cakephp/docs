# グローバル定数およびグローバル関数

CakePHP を使った皆さんの日常のほとんどの業務ではコアクラスやメソッドを用いることになるでしょうが、
ちょっとした役に立つ便利なグローバル関数も CakePHP にはたくさんあります。この関数のほとんどは
CakePHP のクラスと一緒に使うためのもの（モデルやコンポーネントクラスのローディングなど）ですが、
他の多くは、配列や文字列の扱いを少し楽にしてくれるものです。

また、CakePHP のアプリケーションで利用可能な定数も同時におさえておきましょう。
これらの定数を用いることはよりスムースなアップグレードの助けになるだけでなく、
CakePHP アプリケーション内の特定のファイルやディレクトリを指し示す便利なやり方でもあります。

## グローバル関数

以下、CakePHP の使用可能なグローバル関数です。その多くは、デバッグしたり内容を翻訳したりといった、
機能的に他の CakePHP の単なる便利なラッパーになっています。

`function` **__(string $string_id, [$formatArgs])**

この関数は CakePHP のアプリケーションでのローカライズを担います。
`$string_id` で翻訳時の ID を定めます。翻訳のために指定される文字列は、
`sprintf()` 関数でのフォーマット文字列としてあつかわれます。
その文字列内のプレースホルダーを置き換えるための、追加の引数を供給できます:

``` text
__('You have %s unread messages', h($number));
```

> [!NOTE]
> より詳しい情報は
> [国際化と地域化](../core-libraries/internationalization-and-localization)
> のセクションを確認して下さい。

`function` **__c(string $msg, integer $category, mixed $args = null)**

カテゴリは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
それらの値は以下の通り:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__d(string $domain, string $msg, mixed $args = null)**

メッセージを一つ取得するために、現在のドメインを変更することが可能です。

プラグインを国際化するときに便利です:
`echo __d('plugin_name', 'This is my plugin');`

`function` **__dc(string $domain, string $msg, integer $category, mixed $args = null)**

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

`function` **__dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)**

複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
同時に、カテゴリを指定することも出来ます。 \$domain でドメインを指定し、 \$count の数を数え、
\$singular と \$plural に基いて複数形を正しく処理したメッセージを返します。

カテゴリは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
それらの値は以下の通り:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)**

複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
\$domain でドメインを指定し、 \$count の数を数え、 \$singular と \$plural
に基いて複数形を正しく処理したメッセージを返します。

`function` **__x(string $context, string $singular, mixed $args = null)**

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

`function` **__xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)**

\$count の数を数え、 `$singular` と `$plural` に基いて複数形を正しく処理した
メッセージを返します。また、コンテキストを指定することもできます。
言語によっては、カウントに応じて複数のメッセージに対して複数の形式があります。

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

`function` **__dx(string $domain, string $context, string $msg, mixed $args = null)**

メッセージを一つ取得するために、現在のドメインを変更することが可能です。
同時にカテゴリーとコンテキストも指定できます。

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

`function` **__dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)**

複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
\$domain でドメインを指定し、 \$count の数を数え、 \$singular と `$plural`
に基いて複数形を正しく処理したメッセージを返します。
言語によっては、カウントに応じて複数のメッセージに対して複数の形式があります。

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

`function` **__dxc(string $domain, string $context, string $msg, integer $category, mixed $args = null)**

メッセージを一つ取得するために、現在のドメインを変更することが可能です。
同時にカテゴリーとコンテキストも指定できます。

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

カテゴリーは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
それらの値は以下の通り:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__xc(string $context, string $msg, integer $count, integer $category, mixed $args = null)**

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

カテゴリーは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
それらの値は以下の通り:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__dxcn(string $domain, string $context, string $singular, string $plural, integer $count, integer $category, mixed $args = null)**

複数形のメッセージを一つ取得するために、現在のドメインを変更することが可能です。
同時にカテゴリーとコンテキストも指定できます。 \$domain でドメインを指定し、
\$count の数を数え、 \$singular と \$plural に基いて複数形を正しく処理したメッセージを返します。

context は、同じドメイン内で一意にする翻訳文字列の一意の識別子です。

カテゴリーは定義済みの名前をそのまま使うのではなく、 I18n クラスの定数で指定されなければなりません。
それらの値は以下の通り:

- I18n::LC_ALL - LC_ALL
- I18n::LC_COLLATE - LC_COLLATE
- I18n::LC_CTYPE - LC_CTYPE
- I18n::LC_MONETARY - LC_MONETARY
- I18n::LC_NUMERIC - LC_NUMERIC
- I18n::LC_TIME - LC_TIME
- I18n::LC_MESSAGES - LC_MESSAGES

`function` **__n(string $singular, string $plural, integer $count, mixed $args = null)**

\$count の数を数え、 \$singular と \$plural に基いて複数形を正しく処理したメッセージを返します。
幾つかの言語が、数に応じた複数形の形式を一つ以上持っています。

`function` **am(array $one, $two, $three...)**

パラメータとして渡されてすべての配列をマージして、その結果の配列を返します。

`function` **config()**

アプリケーション内の `config` フォルダから include_once 経由でファイルをロードするために
使用することが出来ます。この関数はインクルードする前にファイルの存在チェックを行い、ブール値を返します。
任意の数の引数を取ります。

例: `config('some_file', 'myconfig');`

`function` **convertSlash(string $string)**

文字列のスラッシュをアンダースコアに変換し、最初と最後のアンダースコアを削除します。
変換した文字列を返します。

`function` **debug(mixed $var, boolean $showHtml = null, $showFrom = true)**

アプリケーションの DEBUG レベルがゼロ以外の場合に \$var が出力されます。
`$showHTML` が true あるいは null のままであればデータはブラウザ表示に相応しいように描画されます。
`$showFrom` が false にセットされない場合、それがコールされた行の情報を伴ってデバグ情報の出力が始まります。
[デバッグ](../development/debugging) も参照して下さい

`function` **stackTrace(array $options = array())**

もしアプリケーションのデバッグレベルが 0 以外の場合、スタックトレースが出力されます。

`function` **env(string $key)**

可能な限りの環境変数を取得します。もし `$_SERVER` か `$_ENV` が使用不可の場合には
バックアップとして用いられます。

この関数はまた、PHP_SELF と DOCUMENT_ROOT を、非サポートのサーバー上でエミュレートします。
これは完全なエミュレーションラッパーなので、`$_SERVER` や `getenv()` の代わりに
`env()` を常に用いることは、（とりわけあなたがコードを配布する予定なら）とても良い考えです。

`function` **fileExistsInPath(string $file)**

渡されたファイルが、現在の PHP include_path の中にあるかどうかをチェックします。
ブール値の結果を返します。

`function` **h(string $text, boolean $double = true, string $charset = null)**

`htmlspecialchars()` の便利なラッパー。

`function` **LogError(string $message)**

`Log::write()` へのショートカット。

`function` **pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)**

ドット記法されたプラグイン名をプラグインとクラス名に分離します。
\$name にドットが含まれない場合、インデクスが 0 の箇所は null になります。

一般にこんな具合に使われます `list($plugin, $name) = pluginSplit('Users.User');`

`function` **pr(mixed $var)**

出力を \<pre\> タグでラップする機能を追加した `print_r()` の便利なラッパー。

`function` **sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)**

与えられた \$array を \$sortby キーによってソートします。

`function` **stripslashes_deep(array $value)**

与えられた `$value` から、再帰的にスラッシュを取り除きます。
変換された配列を返します。

## コア定義定数

以下のほとんどの定数はあなたのアプリケーション内部のパスへの参照です。

`constant` **APP**

末尾にスラッシュを含むアプリケーションディレクトリへの絶対パス。

`constant` **APP_DIR**

あなたのアプリケーションのディレクトリ名。`app` かも知れません。

`constant` **APPLIBS**

アプリケーションの Lib ディレクトリへのパス。

`constant` **CACHE**

キャッシュファイルディレクトリへのパス。
複数サーバーをセットアップした際のホスト間で共有できます。

`constant` **CAKE**

cake ディレクトリへのパス。

`constant` **CAKE_CORE_INCLUDE_PATH**

ルートの lib ディレクトリへのパス。

`constant` **CONFIG**

app/Config ディレクトリーへのパス。

::: info Added in version 2.10.0
:::

`constant` **CORE_PATH**

ルートディレクトリへの、末尾にディレクトリスラッシュを付加したパス。

`constant` **CSS**

公開 CSS ディレクトリへのパス。

::: info Deprecated in version 2.4
:::

`constant` **CSS_URL**

CSS ファイル・ディレクトリへのウェブパス。

::: info Deprecated in version 2.4
代わりに設定値の `App.cssBaseUrl` を使用して下さい。
:::

`constant` **DS**

PHP の DIRECTORY_SEPARATOR (Linux の場合は / Windows の場合は \\ のショートカット。

`constant` **FULL_BASE_URL**

`https://example.com` のような完全な URL プリフィクス。

::: info Deprecated in version 2.4
この定数は非推奨です。代わりに `Router::fullBaseUrl()` を使用してください。
:::

`constant` **IMAGES**

画像の公開ディレクトリへのパス。

::: info Deprecated in version 2.4
:::

`constant` **IMAGES_URL**

画像の公開ディレクトリへのウェブパス。

::: info Deprecated in version 2.4
代わりに設定値の `App.imageBaseUrl` を使用してください。
:::

`constant` **JS**

JavaScript の公開ディレクトリへのパス。

::: info Deprecated in version 2.4
:::

`constant` **JS_URL**

JavaScript の公開ディレクトリへのウェブパス。

::: info Deprecated in version 2.4
代わりに設定値の `App.jsBaseUrl` を使用してください。
:::

`constant` **LOGS**

ログディレクトリへのパス。

`constant` **ROOT**

ルートディレクトリへのパス。

`constant` **TESTS**

テストディレクトリへのパス。

`constant` **TMP**

一時ファイルディレクトリへのパス。

`constant` **VENDORS**

ベンダーディレクトリへのパス。

`constant` **WEBROOT_DIR**

あなたのウェブルートディレクトリの名前。 `webroot` かも知れません。

`constant` **WWW_ROOT**

ウェブルートへのフルパス。

## 時間定義定数

`constant` **TIME_START**

アプリケーションが開始された時点の、浮動小数点マイクロ秒での UNIX タイムスタンプ。

`constant` **SECOND**

1 と等しい

`constant` **MINUTE**

60 と等しい

`constant` **HOUR**

3600 と等しい

`constant` **DAY**

86400 と等しい

`constant` **WEEK**

604800 と等しい

`constant` **MONTH**

2592000 と等しい

`constant` **YEAR**

31536000 と等しい
