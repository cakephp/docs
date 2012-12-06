データのサニタイズ
##################

.. php:class:: Sanitize

CakePHPの「Sanitize」はユーザーから送られた悪意がある不要なデータを無害化するためのクラスです。Sanitizeはコアのライブラリであるため、どこからでも利用することができます。大抵の場合はコントローラかモデルで使うことが望ましいでしょう。

CakePHPはfind()やsave()といった標準のORMメソッドを使って適切な記述(例 array('field' => $value))を行えば、SQLインジェクションへの対策をしてくれます。
XSSの対策として生のHTMLをDBに保存して、そのデータを取り出した際に行う処理の手間を減らすために、Sanitizeクラスは有効です。

Sanitizeのコアライブラリを読み込むには、次のようにします。
(例：コントローラの定義の前に設置する場合) ::

    App::uses('Sanitize', 'Utility');
    
    class MyController extends AppController {
        ...
        ...
    }

一度このようにすれば、静的にSanitizeクラスを呼び出すことが出来ます。

.. php:staticmethod:: Sanitize::clean($data, $options)

    :param mixed $data: サニタイズを行うデータ
    :param mixed $options: サニタイズのオプション。詳細は以下を参照。

    この関数は、配列全体に処理を行うための、実用的で多目的なクリーナーです。たとえば、$this->data 全体にサニタイズを行うといった利用法があります。この関数は与えられた配列(または文字列)をクリーンにし、それを返します。このクリーンにする処理は、配列の全ての要素に再帰的に行われます。

    - 「0xCA」を含むおかしなスペースを、標準的な半角スペースに置換します
    - SQL文のセキュリティ向上のため、特殊な文字や復帰文字の削除をダブルチェックする。
    - 前述した機能を用い、SQL文で用いるため、データにスラッシュを追加する。
    - ユーザが入力したバックスラッシュを、信頼できるバックスラッシュに置き換える。

    $options には文字列と配列のいずれも使用可能です。文字列を渡す場合は、データベースの接続名を指定してください。配列を渡す場合は、次のオプションを併せて使用します。

    -  connection
    -  odd\_spaces
    -  encode
    -  dollar
    -  carriage
    -  unicode
    -  escape
    -  backslash
    -  remove\_html (必ずエンコードパラメータも設定して下さい)

    cleanの使用例は、次のとおりです。 ::

        $this->data = Sanitize::clean($this->data, array('encode' => false));


.. php:staticmethod:: Sanitize::escape($string, $connection)

    :param string $string: サニタイズを行うデータ
    :param string $connection: app/Config/database.phpで指定されたデータベース名

    SQLステートメントにスラッシュを加え、エスケープします。この動作は、プログラムが実行されるシステムにおける「magic_quotes_gpc」の設定によって変化します。

.. php:staticmethod:: Sanitize::html($string, $options = array())

    :param string $string: サニタイズを行うデータ
    :param array $options: array型のオプション、詳細は以下を参照。

    このメソッドは、ユーザが送信したデータをHTMLの中に表示する準備をします。これは、ユーザがレイアウトを壊したり画像やスクリプトを挿入することを防ぐ上で特に便利な機能です。もし「$remove」オプションを true にセットした場合、データに含まれるHTMLのタグ等は全て削除されます。false にセットした場合は HTML エンティティとして表示されます。::

        $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
        echo Sanitize::html($badString);
        // 出力: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
        echo Sanitize::html($badString, array('remove' => true));
        // 出力: HEY...

    文字をエスケープすることはエラーの可能性が低く、知られていない新しいタイプの攻撃に対して強いので、文字を取り除くよりもよい方法です。

.. php:staticmethod:: Sanitize::paranoid($string, $allowedChars)

    :param string $string: サニタイズを行うデータ
    :param string $allowedChars: 削除したくない非英数字を持つ配列

    この機能は、半角英数字以外の文字を全て削除します。それらの他に削除したくない文字がある場合は、削除したくない文字を配列にして、引数「$allowedChars」として渡してください。::

        $badString = ";:<script><html><   // >@@#";
        echo Sanitize::paranoid($badString);
        // 出力: scripthtml
        echo Sanitize::paranoid($badString, array(' ', '@'));
        // 出力: scripthtml    @@


.. meta::
    :title lang=en: Data Sanitization
    :keywords lang=en: array notation,sql security,sql function,malicious data,controller class,data options,raw html,core library,carriage returns,database connection,orm,industrial strength,slashes,chars,multi purpose,arrays,cakephp,element,models
