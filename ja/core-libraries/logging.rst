ロギング
########

CakePHP コアクラスの Configure 設定は、内部で何が起きているかを知るための有益な手段です。
そこで、何が起きているかをディスクにログデータとして保存する必要が出てくるでしょう。
SOAPやAJAX、REST APIのような技術を一緒に使うとデバッグはむしろ難しくなるでしょう。

ロギングは、時系列でアプリケーションで何が起きているかを知るための手段です。
何の検索ワードが使われましたか？何のエラーがユーザーに表示されましたか？
どのくらいの頻度で特定のクエリが実行されましたか？

CakePHP でデータのロギングは簡単です。
log() 関数は ``LogTrait`` により提供されており、どれも多くの CakePHP クラス向けの一般的な祖先です。
もし、環境がCakePHP のクラス( Controller や Component, View 等)であれば、あなたはデータを記録することができます。
直接 ``Log::write()`` を同様に使うことも出来ます。
:ref:`writing-to-logs` を参照してください。

.. _log-configuration:

ロギング設定
============

アプリケーションの起動処理の間に、``Log`` の設定は完了しているはずで
**config/app.php** は、これのためです。
多かれ少なかれアプリケーションが望むロガーを定義できます。
ロガーは、 :php:class:`Cake\\Core\\Log` を使い設定する必要があります。
一例として ::

    use Cake\Log\Log;

    // 短いクラス名
    Log::config('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // 完全な名前空間の名前
    Log::config('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

上記では二つのロガーを作っています。  一つは  ``debug`` で、その他は ``error`` です。
それぞれが異なるレベルのメッセージを処理するために構成されています。
また、それらは別々のファイルにメッセージを格納しますので、
debug/notice/info のログをより深刻なエラーから分離するのが簡単です。

色々なレベルに応じた情報と意味の一覧は :ref:`logging-levels` を参照してください。

一度設定を作成した後、それを変更することはできません。
:php:meth:`Cake\\Log\\Log::drop()` と :php:meth:`Cake\\Log\\Log::config()` を使って、設定を削除、再作成すべきです。

それらもまた、クロージャーを与えることによりロガーを作成することが可能です。
クロージャーこれはロガーオブジェクトがどのように構築されるかを完全に制御する必要がある時に役立ちます。クロージャーは構築されたロガーのインスタンスを返さなければなりません。例えば::

    Log::config('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

設定オプションは :term:`DSN` の文字列で渡すことも可能性です。
これは環境変数や :term:`PaaS` プロバイダーを扱っている時に役立ちます。::

    Log::config('error', [
        'url' => 'file:///?levels[]=warning&levels[]=error&file=error',
    ]);

.. note::

    ロガーは ``Psr\Log\LoggerInterface`` を、実装する必要があります。

ログアダプターの作成
--------------------

ログアダプターはアプリケーションの一部やプラグインの一部になりえます。
例えば ``DatabaseLog`` という名前のデータベースロガーがあったとします。
アプリケーションの一部として **src/Log/Engine/DatabaseLog.php** に置かれます。
プラグインの一部として **plugins/LoggingPack/src/Log/Engine/DatabaseLog.php** に置かれます。
また、ログアダプターの設定は :php:meth:`Cake\\Log\\Log::config()` を使う必要があります。
例えば DatabaseLog の設定はこのようになります。::

    // src/Log
    Log::config('otherFile', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // LoggingPack というプラグイン用
    Log::config('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

ログアダプターを設定する時、 ``className`` パラメータは、ログハンドラを配置しロードするために使用されます。その他の設定プロパティの全ては、ログアダプターの コンストラクタに配列として渡されます。::

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct($options = [])
        {
            parent::__construct($options);
            // ...
        }

        public function log($level, $message, array $context = [])
        {
            // データベースに書き込みます。
        }
    }

CakePHP では 全てのロギングアダプターにおいて ``Psr\Log\LoggerInterface`` を実装する必要があります。
:php:class:`Cake\Log\Engine\BaseLog` クラスは、 ``log()`` メソッドを実装することだけを要求しますので、そのインターフェースを満たすための簡単な方法です。

.. _file-log:

``FileLog`` エンジンは以下のオプションを取ります:

* ``size`` 一般的なログローテーション使われています。もしログファイルが特定のファイルサイズに到達した場合、存在しているファイルはタイムスタンプを付け加えた名前に変更され、新しいログファイルが作成されます。 整数バイト値か人間が読みやすい文字列の '10MB'や '100KB' 等が使えます。デフォルトは10MBです。
* ``rotate`` ログファイルが削除される前に指定された回数ローテートされます。もし値が0の場合は、ログローテーションされずに削除されます。デフォルトは10です。
* ``mask`` 作成されるファイルのパーミッションを設定します。もし空のままであればデフォルトのパーミッションが使われます。

.. warning::

    エンジンは接尾辞 ``Log`` を持っています。クラス名が ``SomeLogLog`` のような接尾辞が二重になった名前は避けるべきです。

.. note::

    起動処理でロガーの設定をすべきです。 **config/app.php** はログアダプターの設定の慣習的な場所です。

    デバッグモード中では、FileEngine 使用時に無用なエラーの発生を避けるため、ディレクトリが存在しない時には自動的に作成されるようになりました。

ロギングのエラーと例外
======================

エラーと例外も記録できます。 app.php ファイル内に関連する値を設定することで ログに記録することができます。
debug > 0 のときにエラーが表示され、debug が ``false`` のときにログに記録されます。
catch されないの例外をログに記録するときは ``log`` オプションを ``true`` に設定してください。
詳しくは、 :doc:`/development/configuration` を参照ください。

ログストリームの相互作用
============================

:php:meth:`Cake\\Log\\Log::configured()` で一連の設定を確認することができます。 configured() の戻り値は、現在設定されている全てを配列で返します。:php:meth:`Cake\\Log\\Log::drop()` を使って、ストリームを削除することができます。一度、ログの設定が削除されると、ロガーはメッセージを受信しなくなります。


FileLog クラスの利用
====================

その名前が示すように、 FileLog は、ログメッセージをファイルに書き込みます。
書かれたログメッセージのレベルは、メッセージが書き込まれたファイルの名前で決まります。
もし種別が指定されなければ、エラーログを書き込むための :php:const:`LOG_ERR` が使われます。
ログのデフォルトの場所は ``logs/$level.log`` です。 ::

    // CakePHP クラスの中でこれを実行
    $this->log("なんも動かないよ!");

    // logs/error.log に追記された結果
    // 2007-11-02 10:22:02 Error: なんも動かないよ!

設定されたディレクトリは、ウェブサーバユーザー権限で正しくロギングできるように 書き込み可能にしなければなりません。

ロガーの設定により、追加/代替のFileLogの場所を設定できます。FileLog は、独自のパスを使用するために ``path``  を設定できます。::

    Log::config('custom_path', [
        'className' => 'File',
        'path' => '/path/to/custom/place/'
    ]);

.. warning::
    もし logging adapter を設定しないのであれば、logは保存されません。

.. _syslog-log:

Syslog へのロギング
===================

本番環境では、ファイルロガーの代わりに syslog を使用するようにシステムをセットアップすることを強く勧めます。
これは、(大部分は）ノンブロッキング方式でいつでも書き込むため、よりよく動作し、そしてあなたのオペレーティングシステムのロガーは、独立してファイルのローテーションの設定ができ、 前処理を記述したり、ログを完全に別のストレージを使うことができます。

syslog を使うためには、デフォルトの FileLog エンジンを使うのとよく似ています。 ロギングに使用するエンジンとして Syslog を指定する必要があります。下記の設定は、デフォルトのロガーを ``Syslog`` に置き換えるものです。これは、 **bootstrap.php** ファイルで設定します。::

    Log::config('default', [
        'engine' => 'Syslog'
    ]);

Syslog ロギングエンジンのための設定配列は、以下のキーを認識します。:

* ``format``: ２つのプレースホルダーを持つ sprintf テンプレート文字列で１つ目は、 エラーレベルで、２つ目はメッセージのためのものです。このキーは、ロギングメッセージ内の サーバやプロセスに関する追加の情報を付加するのに便利です。例えば、 ``%s - Web Server 1 - %s`` は、プレースホルダーが置き換えられると、 ``error - Web Server 1 - An error occurred in this request`` のようになります。
* ``prefix``: 全てのログメッセージの先頭につく文字列です。
* ``flag``: ロガーへの接続を開くために使用される整数値のフラグで、デフォルトは、 ``LOG_ODELAY`` が使用されます。 詳しくは、 ``openlog`` のドキュメントをご覧ください。
* ``facility``: syslog で使用するロギングスロット。デフォルトでは、 ``LOG_USER`` が使用されます。詳しくは、 ドキュメントの ``syslog`` をご覧ください。

.. _writing-to-logs:

ログへの書き込み
================

ログファイルへの書き込みは、２つの方法があります。１つは、静的な :php:meth:`Cake\\Log\\Log::write()` メソッドを使用することです。::

    Log::write('debug', 'ちょっと、動作しなかったよ');

２つ目は、``LogTrait`` を使用するクラスに用意された log() ショートカット関数を 使用することです。 log() を呼ぶと、内部的に ``Log::write()`` が呼ばれます。::

    // LogTrait を使用した クラス内でこれを実行
    $this->log("ちょっと、動作しなかったよ", 'debug');

全ての設定されたログストリームは、 :php:meth:`Cake\\Log\\Log::write()` が呼ばれるたびに順次書き込まれます。
もし設定されていないログアダプターを持っているならば、 ``log()`` は、 ``false`` を返し何も書き込みません。

.. _logging-levels:

レベルを使う
------------

CakePHPは、標準POSIXのロギングレベルをサポートします。
各レベルは、増加毎に重症度を示しています。:

* Emergency: システムは使用出来ません
* Alert: 今すぐ行動する必要がある
* Critical: 致命的な状態
* Error: エラー状態
* Warning: 警告状態
* Notice: 正常であるが、意味ありげな状態
* Info: インフォメーションメッセージ
* Debug: デバッグレベルメッセージ

これらの名前により、ロガーの設定時やログメッセージの作成時に参照できます。
あるいは、:php:meth:`Cake\\Log\\Log::error()` のような便利なメソッドを使い、ログレベルを明確にできます。
上記レベルにないレベルを使っていると例外が発生します。

.. _logging-scopes:

ロギングスコープ
----------------

しばしば、異なるサブシステムやアプリケーションの一部で異なるロギングの振る舞いを設定したくなるでしょう。
ある E コマースショップの例を挙げます。注文と支払いのロギングをその他の 重大ではないログとは分けておきたい場合です。

CakePHP は、このコンセプトをロギングスコープで実現します。ログメッセージが書かれた時、 スコープ名を指定できます。
そのスコープとして設定されたロガーがある場合、ログメッセージは これらのロガーに向けられます。
ログメッセージが未設定のスコープへ書かれた場合、 そのメッセージのレベルを制御するロガーがメッセージを記録します。例::

    // logs/shops.log は全てのレベルを受け取るように設定するが、
    // スコープは `orders` と `payments` のみ
    Log::config('shops', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // ２つの設定されたタイプ(ログレベル) を受け取るように、 logs/payments.log を設定するが、
    // スコープは `payments` のみ
    Log::config('payments', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', ['scope' => ['orders']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['payments']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['unknown']]);

スコープとして使用できるのは単一の文字列もしくは文字列を配列も使用できます。
コンテキストとしてより多くのデータを渡す機能が、このフォームを使用すると制限されることに注意してください。::

    Log::warning('これは警告です', ['orders']);
    Log::warning('これは警告です', 'payments');

Log API
=======

.. php:namespace:: Cake\Log

.. php:class:: Log

    ログを書き込むためのシンプルなクラス。

.. php:staticmethod:: config($key, $config)

    :param string $name: 接続されるロガーの名前で、後でロガーを削除するために使用されます。
    :param array $config: ロガーの設定情報とコンストラクタ引数の配列です。

    ロガーのために、コンフィグを取得や設定します。詳細は :ref:`log-configuration` を参照してください。

.. php:staticmethod:: configured()

    :returns: 設定されたロガーの配列です。

    設定された複数のロガーの名前を取得します。

.. php:staticmethod:: drop($name)

    :param string $name: 今後メッセージを受信させたくないロガーの名前です。

.. php:staticmethod:: write($level, $message, $scope = [])

    全ての設定されたロガーにメッセージを書き込みます。
    ``$level`` は、作成されたログメッセージのレベルを表します。
    ``$message`` は、書き込みたいログのメッセージです。
    ``$scope`` は、スコープ（一つもしくは複数）でログメッセージが作成されます。

.. php:staticmethod:: levels()

    引数なしでメソッドを呼び出します。例えば、 `Log::levels()` は、現在のレベルのコンフィグを取得します。

便利なメソッド
--------------

以下の便利メソッドは、適切なログレベルで `$message` を記録するために追加されました。

.. php:staticmethod:: emergency($message, $scope = [])
.. php:staticmethod:: alert($message, $scope = [])
.. php:staticmethod:: critical($message, $scope = [])
.. php:staticmethod:: error($message, $scope = [])
.. php:staticmethod:: warning($message, $scope = [])
.. php:staticmethod:: notice($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])
.. php:staticmethod:: info($message, $scope = [])

ロギングトレイト
================

.. php:trait:: LogTrait

    トレイトはロギングへのショートカットを提供します。

.. php:method:: log($msg, $level = LOG_ERR)

    ログにメッセージを記録します。デフォルトメッセージは、記録されたエラーメッセージです。
    もし、 ``$msg`` が文字列でないとき、記録される前に ``print_r`` で変換されます。

Monolog を使用する
==================

Monolog はPHPにとって一般的なロガーです。CakePHPのロガーと同じインターフェスを実装しています。なので、アプリケーションでデフォルトのロガーとして使うことが簡単です。

Composer を使って Monolog をインストールしたら、 ``Log::config()`` メソッドを使ってロガーを設定してください。::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('app');
        $log->pushHandler(new StreamHandler('path/to/your/combined.log'));
        return $log;
    });

    // オプションで、今使っていない不要なデフォルトのロガーを止めてください
    Log::drop('debug');
    Log::drop('error');

もし異なるロガーをコンソールで使うために設定するのであれば、同じ方法を使ってください::

    // config/bootstrap_cli.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));
        return $log;
    });

    // オプションで、今使っていないデフォルトのロガーを止めてください
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

    コンソールで固有なロガーを使用する場合は、必ずロガーで条件付きで設定をしてください。これはログEntityが重複することを防ぎます。

.. meta::
    :title lang=ja: Logging
    :description lang=ja: CakePHPログデータをディスクに記録し、アプリケーションのデバッグを長期間にわたりデバッグを助けます。
    :keywords lang=ja: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
