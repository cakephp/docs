ログの記録(Logging)
###################

CakePHP
コア「Configure」クラスの設定は、内部で何が起きているのかを知るための有益な手段です。しかしながら、起きていることの情報をディスクにログデータとして保存したい場合が出てくるでしょう。SOAP
や AJAX
といった技術に依存することが多くなるにつれ、デバッグはより困難になります。

ログの記録(\ *Logging*)は、アプリケーションが実行されていくにつれ何が起きているのかを知るための手段です。たとえば、「実行された検索の条件は何か？」「ユーザに表示されたエラーの種類は何なのか？」「ある特定のクエリが出現する頻度はどれくらいか？」といったことです。

CakePHP
データをログに記録するのは簡単で、ほとんどのクラスの親となっている「Object」クラスで定義されている「log()」関数を呼び出すだけです。Model、Controller、Component
他、ほとんど全ての CakePHP
のクラス中で、この機能を使ってデータをログに記録できます。

log 関数を使う
==============

「log()」
関数にはふたつの引数をあたえます。ひとつめは、ログファイルに記録したいメッセージです。デフォルトでは、ログは
app/tmp/logs/error.log に記録されます。

::

    // CakePHP のクラス中で log 関数を実行する
     
    $this->log("Something didn't work!");
     
    // app/tmp/logs/error.log に、次のように追加される
     
    2007-11-02 10:22:02 Error: Something didn't work!

第二引数では、記録するログのタイプを定義します。
指定しなかった場合、前述したエラーログのパスに書き出す LOG\_ERROR
がデフォルトで定義されます。もし LOG\_DEBUG
に設定した場合は、デバッグログとして app/tmp/logs/debug.log
にログが出力されます。

::

    // CakePHP のクラス中で log 関数を実行する
     
    $this->log('A debugging message.', LOG_DEBUG);
     
    // error.log ではなく app/tmp/logs/debug.log に、次のように追加される
    //Results in this being appended to app/tmp/logs/debug.log (rather than error.log)
     
    2007-11-02 10:22:02 Error: A debugging message.

ログ機能を正しく動作させるためには、ウェブサーバが実行されるユーザが
app/tmp ディレクトリに書き込み権限を持つ必要があります。
