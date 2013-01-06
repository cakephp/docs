データのサニタイズ(Data Sanitization)
#####################################

CakePHPの「Sanitize」クラスは、ユーザから送られた悪意のあるデータや、その他の不適切なデータを無毒化します。サニタイズはコアのライブラリであるため、どこからでも利用することができます。ただし、おそらくはコントローラかモデルで使うことが望ましいでしょう。

サニタイズ(Sanitize)のコアライブラリを読み込むには、次のようにします。

::

    App::import('Sanitize');

一度このようにすれば、静的にサニタイズ(Sanitize)クラスを呼び出すことが出来ます。

paranoid
========

paranoid(string $string, array $allowedChars);

この機能は、半角英数字以外の文字を全て削除します。それらの他に削除したくない文字がある場合は、削除したくない文字を配列にして、引数「$allowedChars」として渡してください。

::

    $badString = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($badString);
    // 次の文字列が出力されます: scripthtml
    echo Sanitize::paranoid($badString, array(' ', '@'));
    // 次の文字列が出力されます: scripthtml    @@

html
====

html(string $string, boolean $remove = false)

このメソッドは、ユーザが送信したデータをHTMLの中に表示する準備をします。これは、ユーザがレイアウトを壊したり画像やスクリプトを挿入することを防ぐ上で特に便利な機能です。もし「$remove」オプションを
true
にセットした場合、データに含まれるHTMLのタグ等は全て削除されます。false
にセットした場合は HTML エンティティとして表示されます。

::

    $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
    echo Sanitize::html($badString);
    // 次の文字列が出力されます: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
    echo Sanitize::html($badString, true);
    // 次の文字列が出力されます: HEY...

escape
======

escape(string $string, string $connection)

SQLステートメントにスラッシュを加え、エスケープします。この動作は、プログラムが実行されるシステムにおける「magic\_quotes\_gpc」の設定によって変化します。引数「$connection」に、
app/config/database.php
で設定した接続の名前を指定すると、接続先のデータベースに応じたエスケープが行われます。

clean
=====

``Sanitize::clean(mixed $data, mixed $options)``

この関数は、配列全体に処理を行うための、実用的で多目的なクリーナーです。たとえば、$this->data
全体にサニタイズを行うといった利用法があります。この関数は与えられた配列(または文字列)をクリーンにし、それを返します。このクリーンにする処理は、配列の全ての要素に再帰的に行われます。

-  「0xCA」を含むおかしなスペースを、標準的な半角スペースに置換する。
-  SQL文のセキュリティ向上のため、特殊な文字や復帰文字の削除をダブルチェックする。
-  前述した機能を用い、SQL文で用いるため、データにスラッシュを追加する。
-  ユーザが入力したバックスラッシュを、信頼できるバックスラッシュに置き換える。

$options
には文字列と配列のいずれも使用可能です。文字列を渡す場合は、データベースの接続名を指定してください。配列を渡す場合は、次のオプションを併せて使用します。

-  connection
-  odd\_spaces
-  encode
-  dollar
-  carriage
-  unicode
-  escape
-  backslash

