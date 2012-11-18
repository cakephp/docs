グローバル定数と関数
####################

CakePHP
で日々の作業の大半はコアクラスやメソッドを利用する一方で、CakePHP
は手軽に便利なグローバル関数をもっています。これらの関数の多くは、CakePHP
クラスで使用するために（モデルやコンポーネントクラスを読み込むなど）ありますが、他にもたくさん配列や文字列を簡単に操作するものもあります。

CakePHP
アプリケーションで有効な定数のいくつかも見てみましょう。これらの定数を使用すると、よりスムーズに更新することができますが、CakePHP
アプリケーション内のあるファイルやディレクトリを指定する便利な方法もあります。

グローバル関数
==============

ここでは CakePHP のグローバルで有効な関数を紹介します。多くは PHP
の長い名前の関数に対する便利なラッパーですが、いくつか(\ ``uses()``
等)はコードを読み込んだり、他の便利な関数を実行したりすることができます。頻繁に使用するタスクを関数にしたい場合はここが参考になります。

\_\_
----

``__(string $string_id, boolean $return =  false)``

この関数は CakePHP
アプリケーションのローカライズを扱います。\ ``$string_id`` は翻訳用の ID
を規定し、第 2 引数で自動的に文字列を echo
出力するか（デフォルトでは出力されます）、あるいは他のプロセスのために返すか（この振る舞いを有効にするにはブール値
true を渡します）を指定します。

詳細は
`ローカライゼーションと国際化 </ja/view/1228/Internationalization-Localization>`_
の章をチェックしてください。

a
-

``a(mixed $one, $two, $three...)``

ラップ関数を呼び出してパラメータの配列を返します。

::

    print_r(a('foo', 'bar')); 

    // 出力:
    array(
       [0] => 'foo',
       [1] => 'bar'
    )

この関数は、非推奨になりました。バージョン 2.0
では削除されます。代わりに **array()** を使用してください。

aa
--

``aa(string $one, $two, $three...)``

ラップ関数を呼び出してパラメータから構成される連想配列を生成します。

::

    echo aa('a','b'); 

    // 出力:
    array(
        'a' => 'b'
    )

この関数は、非推奨になりました。バージョン 2.0 では削除されます。

am
--

``am(array $one, $two, $three...)``

パラメータとして渡されたすべての配列をマージし、マージした配列を返します。

config
------

アプリケーションの ``config`` フォルダにあるファイルを include\_once
を使用して読み込むために使います。この関数は、読み込む前にファイルの存在を確認し、結果をブール値で返します。任意の個数の引数を渡すことができます。

例: ``config('some_file', 'myconfig');``

convertSlash
------------

``convertSlash(string $string)``

文字列のスラッシュをアンダースコアに変換し、最初と最後のアンダースコアを削除します。変換した文字列を返します。

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

アプリケーションの DEBUG レベルが 0 以外の場合、$var
が出力されます。\ ``$showHTML`` が true
の場合、データはブラウザで見やすい形式で描画されます。

参照: `基本的なデバッグ </ja/view/1190/Basic-Debugging>`_

e
-

``e(mixed $data)``

``echo()`` の便利なラッパーです。

この関数は、非推奨になりました。バージョン 2.0
では削除されます。代わりに **echo()** を使用してください。

env
---

``env(string $key)``

有効なソースから環境変数を取得します。\ ``$_SERVER`` あるいは ``$_ENV``
が無効な場合、代替として使用されます。

この関数はサポートしていないサーバでも PHP\_SELF や DOCUMENT\_ROOT
をエミュレートします。実際に完全なエミュレーションラッパーですので、
``$_SERVER`` や ``getenv()`` の代わりに常に ``env()``
を使用することは（特にコードを配布する計画がある場合には）よい考えです。

fileExistsInPath
----------------

``fileExistsInPath(string $file)``

渡されたファイルが現在の PHP の include\_path
内にあるかをチェックします。ブール値を返します。

h
-

``h(string $text, string $charset = null)``

``htmlspecialchars()`` の便利なラッパーです。

ife
---

``ife($condition, $ifNotEmpty, $ifEmpty)``

三項演算子として使用します。\ ``$condition``
が空でない場合、\ ``$ifNotEmpty`` を返します。そうでない場合は
``$ifEmpty`` を返します。

この関数は、非推奨になりました。バージョン 2.0 では削除されます。

low
---

``low(string $string)``

``strtolower()`` の便利なラッパーです。

この関数は、非推奨になりました。バージョン 2.0
では削除されます。代わりに **strtolower()** を使用してください。

pr
--

``pr(mixed $var)``

``print_r()`` の便利なラッパーです。出力の前後に <pre>
タグを付加します。

r
-

``r(string $search, string $replace, string  $subject)``

``str_replace()`` の便利なラッパーです。

この関数は、非推奨になりました。バージョン 2.0
では削除されます。代わりに **str\_replace()** を使用してください。

stripslashes\_deep
------------------

``stripslashes_deep(array $value)``

渡された ``$value``
からスラッシュを再帰的に取り除きます。変換した配列を返します。

up
--

``up(string $string)``

``strtoupper()`` の便利なラッパーです。

この関数は、非推奨になりました。バージョン 2.0
では削除されます。代わりに **strtoupper()** を使用してください。

uses
----

``uses(string $lib1, $lib2, $lib3...)``

CakePHP のコアライブラリ（cake/libs/ にあります）を読み込みます。拡張子
'.php' を除いたライブラリのファイル名を指定します。

この関数は、非推奨になりました。バージョン 2.0 では削除されます。

コア定義定数
============

定数

アプリケーションの絶対パス

APP

ルートディレクトリ

APP\_PATH

アプリケーションディレクトリ

CACHE

キャッシュファイルディレクトリ

CAKE

cake ディレクトリ

COMPONENTS

コンポーネントディレクトリ

CONFIGS

設定ファイルディレクトリ

CONTROLLER\_TESTS

コントローラテストディレクトリ

CONTROLLERS

コントローラディレクトリ

CSS

CSS ファイルディレクトリ

DS

PHP の定義済み定数 DIRECTORY\_SEPARATOR （Linux
ではバックスラッシュ"\\"、windowsではスラッシュ"/"） の省略形です。

ELEMENTS

エレメントディレクトリ

HELPER\_TESTS

ヘルパーテストディレクトリ

HELPERS

ヘルパーディレクトリ

IMAGES

画像ディレクトリ

JS

JavaScript ファイルディレクトリ (webroot 内)

LAYOUTS

レイアウトディレクトリ

LIB\_TESTS

CakePHP ライブラリテストディレクトリ

LIBS

CakePHP ライブラリディレクトリ

LOGS

ログディレクトリ (app 内)

MODEL\_TESTS

モデルテストディレクトリ

MODELS

モデルディレクトリ

SCRIPTS

Cake スクリプトディレクトリ

TESTS

テストディレクトリ
(モデル・コントローラなどのテストディレクトリの親ディレクトリ)

TMP

テンポラリディレクトリ

VENDORS

ベンダーディレクトリ

VIEWS

ビューディレクトリ

WWW\_ROOT

webroot までのフルパス
