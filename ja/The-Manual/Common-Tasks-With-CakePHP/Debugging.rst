デバッグ(Debugging)
###################

デバッグは、あらゆる開発サイクルにおいて、不可避かつ必須です。CakePHP は
IDE
やエディタから直接扱えるツールは何も提供しません。しかし、アプリケーション内部で動作し、デバッグや問題の摘出を容易にするツールをいくつか提供します。

基本的なデバッグ
================

debug($var, $showHTML = false, $showFrom = true)

debug() 関数は、アプリケーションのどこからでも呼び出せる関数で、PHP の
print\_r() 関数に似た動作をします。debug()
関数はいくつかの異なった方法で変数の中身を表示します。変数を HTML
中でうまく表示したい場合、2番目のパラメータ $showHTML を true
にセットしてください。また、この関数は、実行されたファイル名と行番号をデフォルトで表示します。

この関数の出力は、コア(core)で定義したデバッグ変数(debug variable)が 0
より大きい場合にのみ表示されます。

デバッガクラス(Debugger Class)の利用
====================================

デバッガを使うには、まずはじめに Configure::read('debug') が 0
より大きい値に設定されていることを確認してください。

dump($var)

これは変数の中身を出力します。もしメソッドやプロパティが存在した場合、代入されている値もあわせて出力します。

::

        $foo = array(1,2,3);
        
        Debugger::dump($foo);
        
        //出力
        array(
            1,
            2,
            3
        )
        
        //単純なオブジェクト
        $car = new Car();
        
        Debugger::dump($car);
        
        //出力
        Car::
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::acclerate()
        Car::decelerate()
        Car::stop()

log($var, $level = 7)

実行した時点で、詳細なスタックトレースログを作成します。log()
メソッドが出力するデータは Debugger::dump()
と同様のものですが、出力先はバッファではなく debug.log です。log()
メソッドを正しく動作させるためには、app/tmp
とそこに含まれるディレクトリやファイルに対して、ウェブサーバを実行するユーザが書き込み権限を持つ必要があります。

trace($options)

現在のスタックトレースを返します。トレースのそれぞれの行には、呼び出したメソッドと、その呼び出しが行われたのはどのファイルの何行目かの情報が含まれます。

::

        //PostsController::index() 中に次のコード記入したとします
        pr( Debugger::trace() );
        
        //すると出力は次のようになります
        PostsController::index() - APP/controllers/downloads_controller.php, line 48
        Dispatcher::_invoke() - CORE/cake/dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/cake/dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

これは、コントローラのアクションの中に記述された Debugger::trace()
によって生成されたスタックトレースです。スタックトレースを下から上へ読むと、現在実行されている関数の順番がわかります。これはスタッフフレームと呼びます。上述した例では、まず
index.php が Dispatcher::dispatch() を呼び出しています。次に dispatch()
メソッドは Dispatcher::\_invoke() を呼び出し、最後に \_invoke()
メソッドが PostsController::index() を呼び出します。trace()
を実行した時に呼び出されている関数が特定でき、この情報は複雑な処理や深いスタックを用いて作業する時に役立ちます。

excerpt($file, $line, $context)

ファイルの一部を抜粋してハイライトします。$file
にはファイルの絶対パス、$line には何行目を抜粋するか、$context には
$line で指定した行の前後何行を抜粋するかを指定します。

::

        pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );
        
        // これの出力は次のようになります。
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

このメソッドは内部的に使われていますが、特定の状況でログやメッセージを表示したい場合にも便利です。

exportVar($var, $recursion = 0)

デバッグで出力するために、あらゆる種類の変数を文字列に変換します。このメソッドは
CakePHP
のデバッガ内部で使われていますし、独自のデバッガで利用しても良いでしょう。

invoke($debugger)

CakePHP のデバッガを新たなエラーハンドラに置き換えます。

デバッガクラス(Debugger Class)
==============================

デバッガクラスは CakePHP 1.2
から導入された機能で、デバッグ情報を得るための手段を提供します。このクラスは、ダンプやログの記録、そしてエラーハンドリングといった機能を提供する静的な関数を持っています。

デバッガクラスは PHP
のデフォルトのエラーハンドリングを上書きし、エラーレポートをより便利なものに置き換えます。CakePHP
において、デバッガクラスのエラーハンドリングは、デフォルトで使用されます。全ての関数は、Configure::debug
が 0 より大きく設定すると動作します。

エラーが発生したら、デバッガはページに情報を表示し、error.log
ファイルにエントリーを作成します。生成されたエラーレポートには、スタックトレースと、エラーが発生したコードの抜粋が含まれています。スタックトレースを確認するには「Error」リンクをクリックし、エラーが発生した行の抜粋を見るには「Code」リンクをクリックします。
