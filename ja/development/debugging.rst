デバッグ
########

..
  Debugging

デバッグはいかなる開発サイクルにおいても避けることのできない、必要なものです。
CakePHP は IDE やエディタと直接連携するようなツールは提供しませんが、CakePHP はデバッグ作業やあなたのアプリケーション内部で何が走っているのかを探る作業を助けるためのツールをいくつか提供します。

..
  Debugging is an inevitable and necessary part of any development
  cycle. While CakePHP doesn't offer any tools that directly connect
  with any IDE or editor, CakePHP does provide several tools to
  assist in debugging and exposing what is running under the hood of
  your application.

基本的なデバッグ
================

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    :param mixed $var: 出力する内容。配列やオブジェクトを渡してもうまく動作します。
    :param boolean $showHTML: true をセットしたならエスケープが有効になります。2.0 では、ウェブリクエストを扱う場合にはデフォルトでエスケープが有効になります。
    :param boolean $showFrom: debug() がどのファイルのどの行で呼ばれたのかを表示します。

debug() 関数は PHP 関数の print\_r() と同様に、グローバルに利用可能な関数です。debug() 関数により、さまざまな方法で変数の内容を出力することができます。
データを HTML に優しい方法で表示させたいなら、第２引数を true にしてください。この関数はまた、デフォルトで呼ばれた場所となるファイルと行番号も出力します。

..
  :param mixed $var: The contents to print out.  Arrays and objects work well.
  :param boolean $showHTML: Set to true, to enable escaping.  Escaping is enabled
      by default in 2.0 when serving web requests.
  :param boolean $showFrom: Show the line and file the debug() occurred on.

..
  The debug() function is a globally available function that works
  similarly to the PHP function print\_r(). The debug() function
  allows you to show the contents of a variable in a number of
  different ways. First, if you'd like data to be shown in an
  HTML-friendly way, set the second parameter to true. The function
  also prints out the line and file it is originating from by
  default.

この関数からの出力は、core の debug 変数が 0 より大きな値だった場合のみ行われます。

..
  Output from this function is only shown if the core debug variable
  has been set to a value greater than 0.

.. versionchanged:: 2.1 
    ``debug()`` の出力は ``var_dump()`` のものと多くの点で似ており、内部的には :php:class:`Debugger` を使っています。

..
    The output of ``debug()`` more resembles ``var_dump()``, and uses
    :php:class:`Debugger` internally.

Debugger クラス
===============

Debugger クラスは CakePHP 1.2 で導入され、デバッグ情報を取得するための数多くのオプションも、持っているものでした。
それには static に呼び出すいくつかの関数が存在し、ダンプ出力やログ出力、エラーをハンドルする関数を提供していました。

..
  The debugger class was introduced with CakePHP 1.2 and offers even
  more options for obtaining debugging information. It has several
  functions which are invoked statically, and provide dumping,
  logging, and error handling functions.

Debugger クラスは PHP のデフォルトのエラーハンドリングを上書き、より使いやすいエラーレポートをするものに置き換えます。
CakePHP ではデフォルトで Debugger クラスのエラーハンドリングが使われます。
すべてのデバッグ関数と同様に、``Configure::debug`` が 0 より大きい値の場合のみ動作します。

..
  The Debugger Class overrides PHP's default error handling,
  replacing it with far more useful error reports. The Debugger's
  error handling is used by default in CakePHP. As with all debugging
  functions, ``Configure::debug`` must be set to a value higher than 0.

エラーが発生したら、Debugger はページに情報を表示し、かつ、error.log ファイルに出力します。
生成されるエラーレポートにはスタックトレースとエラーが発生した部分のコード抜粋の両方が出力されます。
「Error」のリンクをクリックすると、スタックトレースが表示され、「Code」のリンクをクリックすると、エラーが発生した行が表示されます。

..
  When an error is raised, Debugger both outputs information to the
  page and makes an entry in the error.log file. The error report
  that is generated has both a stack trace and a code excerpt from
  where the error was raised. Click on the "Error" link type to
  reveal the stack trace, and on the "Code" link to reveal the
  error-causing lines.

Debugger クラスの使用
=====================

.. php:class:: Debugger

Debugger を使用する際にはまず、Configure::read('debug') に 0 より大きな値がセットされていることを確認してください。

..
  To use the debugger, first ensure that Configure::read('debug') is
  set to a value greater than 0.

.. php:staticmethod:: Debugger::dump($var)

    dump は変数の内容を出力します。渡された変数のすべてのプロパティと（可能なら）メソッドを出力します::

        $foo = array(1,2,3);

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
        Car
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::accelerate()
        Car::decelerate()
        Car::stop()

    ..
      Dump prints out the contents of a variable. It will print out all
      properties and methods (if any) of the supplied variable::

    .. versionchanged:: 2.1
        2.1 以降、出力が読みやすいものに変更されました。:php:func:`Debugger::exportVar()` を参照してください。

    ..
      In 2.1 forward the output was updated for readability. See
      :php:func:`Debugger::exportVar()`

.. php:staticmethod:: Debugger::log($var, $level = 7)

    呼び出されたときに詳細なスタックトレースを生成します。
    log() メソッドは Debugger::dump() によるものと似たデータを出力しますが、出力バッファにではなく、 debug.log に出力します。
    log() が正常に動作するためには、あなたの app/tmp ディレクトリ（と、その中）はウェブサーバにより書き込み可能でなければならないことに気をつけてください。

..
  Creates a detailed stack trace log at the time of invocation. The
  log() method prints out data similar to that done by
  Debugger::dump(), but to the debug.log instead of the output
  buffer. Note your app/tmp directory (and its contents) must be
  writable by the web server for log() to work correctly.

.. php:staticmethod:: Debugger::trace($options)

    現在のスタックトレースを返します。トレースの各行には、呼び出しているメソッド、どこから呼ばれたかというファイルと行番号が含まれています::

        //PostsController::index() の中で
        pr(Debugger::trace());
        
        //出力
        PostsController::index() - APP/Controller/DownloadsController.php, line 48
        Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

    上記では、コントローラのアクション内で Debugger::trace() を呼ぶことで、スタックトレースを生成しています。
    スタックトレースは下から上へと読み、現在走っている関数（スタックフレーム）の順になっています。
    上記の例では、index.php が Dispatcher::dispatch() を呼び、それが今度は Dispatcher::\_invoke() を呼んでいます。
    その後、\_invoke() メソッドは PostsController::index() を呼んでいます。
    この情報は再帰呼出やスタックが深い場合に、trace() の時点でどの関数が現在走っているのか特定できるので、役に立ちます。

..
    Returns the current stack trace. Each line of the trace includes
    the calling method, including which file and line the call
    originated from.::

..
    Above is the stack trace generated by calling Debugger::trace() in
    a controller action. Reading the stack trace bottom to top shows
    the order of currently running functions (stack frames). In the
    above example, index.php called Dispatcher::dispatch(), which
    in-turn called Dispatcher::\_invoke(). The \_invoke() method then
    called PostsController::index(). This information is useful when
    working with recursive operations or deep stacks, as it identifies
    which functions are currently running at the time of the trace().

.. php:staticmethod:: Debugger::excerpt($path, $line, $context)

    $path （絶対パス） にあるファイルからの抜粋を取得します。$line 行目をハイライトし、$line 行目の前後 $context 行もあわせて取得します::

        pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));
        
        //下記のように出力されます
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>
         
            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

    このメソッドは内部的に使われているものですが、あなたが独自のエラーメッセージを生成する場合や独自の状況でログ出力する場合にも使いやすいものです。

..
    Grab an excerpt from the file at $path (which is an absolute
    filepath), highlights line number $line with $context number of
    lines around it.::

..
    Although this method is used internally, it can be handy if you're
    creating your own error messages or log entries for custom
    situations.

.. php:staticmethod:: Debugger::exportVar($var, $recursion = 0)

    どんなタイプの変数でもデバッグ出力に使える文字列へと変換します。
    このメソッドはまた、多くの Debugger により内部変数を変換する際に使われているものです。あなた自身の Debugger でも使うことができるでしょう。

    .. versionchanged:: 2.1
        この関数は 2.1 以前とは異なる出力内容を生成します。

    ..
        This function generates different output in 2.1 forward.

..
    Converts a variable of any type to a string for use in debug
    output. This method is also used by most of Debugger for internal
    variable conversions, and can be used in your own Debuggers as
    well.

.. php:staticmethod:: Debugger::invoke($debugger)

    CakePHP Debugger を新しいインスタンスに置き換えます。

..
    Replace the CakePHP Debugger with a new instance.

.. php:staticmethod:: Debugger::getType($var)

    変数の型を取得します。オブジェクトならクラス名を返します。

    .. versionadded:: 2.1

..
    Get the type of a variable.  Objects will return their classname

ログ出力によるデバッグ
======================

..
  Using Logging to debug

アプリケーションをデバッグするもう一つの良い方法はログメッセージです。
:php:class:`CakeLog` を使うことで、あなたのアプリケーションでログ出力をさせることができます。
:php:class:`Object` を継承するすべてのオブジェクトは、インスタンスメソッド `log()` を持っており、ログメッセージを出力するのに使えます::

    $this->log('通ったよ', 'debug');

..
  Logging messages is another good way to debug applications, and you can use
  :php:class:`CakeLog` to do logging in your application.  All objects that 
  extend :php:class:`Object` have an instance method `log()` which can be used
  to log messages::


上記では ``通ったよ`` がデバッグログに出力されます。
ログに出力することで、リダイレクトや複雑なループを含むメソッドをデバッグしやすくなるでしょう。
また、 :php:meth:`CakeLog::write()` を使うことで、ログメッセージを書きだすことも可能です。
このメソッドは CakeLog がロードされているなら static にあなたのアプリケーション内のどこからでも呼び出すことができるのです::

    // app/Config/bootstrap.php の中で
    App::uses('CakeLog', 'Log');

    // あなたのアプリケーションのどこからでも
    CakeLog::write('debug', '通ったよ');

..
  The above would write ``Got here`` into the debug log.  You can use log entries
  to help debug methods that involve redirects or complicated loops. You can also
  use :php:meth:`CakeLog::write()` to write log messages.  This method can be called
  statically anywhere in your application one CakeLog has been loaded::

Debug Kit
=========

DebugKit は便利なデバッグツールをたくさん提供してくれるプラグインです。
まずは、レンダリングされた HTML 内にツールバーを表示して、あなたのアプリケーションや現在のリクエストについての情報を大量に提供してくれます。
github の `DebugKit <https://github.com/cakephp/debug_kit>`_ からダウンロードが可能です。

..
  DebugKit is a plugin that provides a number of good debugging tools. It primarily
  provides a toolbar in the rendered HTML, that provides a plethora of information about 
  your application and the current request. You can download 
  `DebugKit <https://github.com/cakephp/debug_kit>`_ from github.


.. meta::
    :title lang=en: Debugging
    :description lang=en: Debugging CakePHP with the Debugger class, logging, basic debugging and using the DebugKit plugin.
    :keywords lang=en: code excerpt,stack trace,default output,error link,default error,web requests,error report,debugger,arrays,different ways,excerpt from,cakephp,ide,options
