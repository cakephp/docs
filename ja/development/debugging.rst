デバッグ
########

デバッグはいかなる開発サイクルにおいても避けることのできない、必要なものです。
CakePHP は IDE やエディタと直接連携するようなツールは提供しませんが、
CakePHP はデバッグ作業やあなたのアプリケーション内部で何が走っているのかを探る作業を
助けるためのツールをいくつか提供します。

基本的なデバッグ
================

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:

``debug()`` 関数は PHP 関数の ``print_r()`` と同様に、グローバルに利用可能な関数です。
``debug()`` 関数により、さまざまな方法で変数の内容を出力することができます。
データを HTML に優しい方法で表示させたいなら、第２引数を ``true`` にしてください。
この関数はまた、デフォルトで呼ばれた場所となるファイルと行番号も出力します。

この関数からの出力は、core の ``$debug`` 変数が ``true`` の場合のみ行われます。

.. versionadded:: 3.3.0

    このメソッドを呼ぶと、渡された ``$var`` を返します。例えば、return 文に
    このメソッドを置くことができます。例::
    
        return debug($data); // 必ず $data を返します。

``dd()`` 、 ``pr()`` 及び ``pj()`` もご確認ください。

.. php:function:: stackTrace()

``stackTrace()`` 関数はグローバルに使用でき、関数がどこで呼ばれたかのスタックトレースを
出力することができます。

.. php:function:: breakpoint()

.. versionadded:: 3.1

もし `Psysh <http://psysh.org/>`_ をインストールしている場合、この関数を
CLI 環境で使用することで現在のローカルスコープで対話型コンソールを開くことができます。 ::

    // 実行したいコード
    eval(breakpoint());

開いた対話型コンソールでローカル変数のチェックや他のコードの実行をすることができます。
対話型デバッガを終了して元の処理に戻りたい時は ``quit`` か ``q`` を入力してください。

Debugger クラスの使用
========================

.. php:namespace:: Cake\Error

.. php:class:: Debugger

Debugger を使用する際にはまず、 ``Configure::read('debug')`` に
``true`` がセットされていることを確認してください。

値の出力
========

.. php:staticmethod:: dump($var, $depth = 3)

dump は変数の内容を出力します。渡された変数のすべてのプロパティと
（可能なら）メソッドを出力します。 ::

    $foo = [1,2,3];

    Debugger::dump($foo);

    // 出力
    array(
        1,
        2,
        3
    )

    // シンプルなオブジェクト
    $car = new Car();

    Debugger::dump($car);

    // 出力
    object(Car) {
        color => 'red'
        make => 'Toyota'
        model => 'Camry'
        mileage => (int)15000
    }

スタックトレース付きのログ出力
==============================

.. php:staticmethod:: log($var, $level = 7, $depth = 3)

呼び出されたときに詳細なスタックトレースを生成します。
``log()`` メソッドは ``Debugger::dump()`` によるものと似たデータを出力しますが、
出力バッファにではなく、 debug.log に出力します。 ``log()`` が正常に動作するためには、
あなたの **tmp** ディレクトリ（と、その中）はウェブサーバにより
書き込み可能でなければならないことに気をつけてください。

スタックトレースの生成
======================

.. php:staticmethod:: trace($options)

現在のスタックトレースを返します。トレースの各行には、呼び出しているメソッド、
どこから呼ばれたかというファイルと行番号が含まれています。 ::

    // PostsController::index() の中で
    pr(Debugger::trace());

    // 出力
    PostsController::index() - APP/Controller/DownloadsController.php, line 48
    Dispatcher::_invoke() - CORE/src/Routing/Dispatcher.php, line 265
    Dispatcher::dispatch() - CORE/src/Routing/Dispatcher.php, line 237
    [main] - APP/webroot/index.php, line 84

上記では、コントローラのアクション内で ``Debugger::trace()`` を呼ぶことで、
スタックトレースを生成しています。
スタックトレースは下から上へと読み、現在走っている関数（スタックフレーム）の順になっています。

ファイルから抜粋を取得
======================

.. php:staticmethod:: excerpt($file, $line, $context)

$path（絶対パス）にあるファイルからの抜粋を取得します。$line 行目をハイライトし、
$line 行目の前後 $context 行もあわせて取得します。 ::

    pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));

    // 下記のように出力されます
    Array
    (
        [0] => <code><span style="color: #000000"> * @access public</span></code>
        [1] => <code><span style="color: #000000"> */</span></code>
        [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

        [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
        [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
    )

このメソッドは内部的に使われているものですが、あなたが独自のエラーメッセージを生成する場合や
独自の状況でログ出力する場合にも使いやすいものです。

.. php:staticmethod:: Debugger::getType($var)

変数の型を取得します。オブジェクトならクラス名を返します。

ログ出力によるデバッグ
======================

アプリケーションをデバッグするもう一つの良い方法はログメッセージです。
:php:class:`Cake\\Log\\Log` を使うことで、あなたのアプリケーションでログ出力を
させることができます。 ``LogTrait`` を利用するすべてのオブジェクトは、
インスタンスメソッド ``log()`` を持っており、ログメッセージを出力するのに使えます。 ::

    $this->log('通ったよ', 'debug');

上記では ``通ったよ`` がデバッグログに出力されます。
ログに出力することで、リダイレクトや複雑なループを含むメソッドをデバッグしやすくなるでしょう。
また、:php:meth:`Cake\\Log\\Log::write()` を使うことで、ログメッセージを書きだすことも可能です。
このメソッドは CakeLog がロードされているなら static にあなたのアプリケーション内の
どこからでも呼び出すことができるのです。 ::

    // ログを使用したいファイルの一番最初で
    use Cake\Log\Log;

    // Log がインポートされている場所で
    Log::debug('通ったよ');

Debug Kit
=========

DebugKit は便利なデバッグツールをたくさん提供してくれるプラグインです。
まずは、レンダリングされた HTML 内にツールバーを表示して、あなたのアプリケーションや
現在のリクエストについての情報を大量に提供してくれます。
DebugKit のインストールと使用方法については :doc:`/debug-kit` の章を見てください。


.. meta::
    :title lang=ja: デバッグ
    :description lang=ja: Debugging CakePHP with the Debugger class, logging, basic debugging and using the DebugKit plugin.
    :keywords lang=ja: code excerpt,stack trace,default output,error link,default error,web requests,error report,debugger,arrays,different ways,excerpt from,cakephp,ide,options
