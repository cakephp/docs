コンソールツール、シェルとタスク
################################

.. php:namespace:: Cake\Console

CakePHP はウェブフレームワークとしてだけではなく、コンソールアプリケーションを開発するための
コンソールフレームワークとしての機能を合わせ持っています。コンソールアプリケーションは
メンテナンスといった様々なバックグラウンド タスクを行ったり、リクエスト－レスポンスのサイクルの
外側で何かを実行するための仕組みです。CakePHP のコンソールアプリケーションでは、コマンドライン
からあなたが作成したアプリケーションクラスを再利用できます。

CakePHP には元々たくさんのコンソールアプリケーションが備わっています。
これらの中には（i18n のように）他の CakePHP の機能と組合せて使うものもあれば、
仕事をより早く片付けるための、より一般的なものもあります。

CakePHP のコンソール
====================

このセクションでは、コマンドラインにおける CakePHP をご紹介します。コンソールツールは、
cron ジョブ、またはウェブブラウザーからアクセス可能である必要のないコマンドラインベースの
ユーティリティーでの使用に最適です。

PHP ではファイルシステムやアプリケーションをより柔軟に使えるように、
これらへのインターフェイスを備えた CLI クライアント機能を提供しています。
CakePHP コンソールでは、シェルスクリプト作成のためのフレームワークを提供しています。
コンソールではディスパッチタイプのセットアップを使って シェルやタスクをロードし、
それらへパラメーターを渡します。

.. note::

    コンソール機能を使う場合は、コマンドライン版 (CLI) としてビルドされた
    PHP がインストールされている必要があります。

詳細に入る前に、CakePHP コンソールがちゃんと動くことを確認しておきましょう。
まずはシステムのシェルを起動する必要があります。このセクションで示している例は
bash のものですが、CakePHP コンソールは Windows 互換でもあります。
この例では、ユーザーが現在 bash プロンプトにログインし、CakePHP アプリケーションの
ルートにいることを仮定しています。

CakePHP のアプリケーションは、シェルとタスクのすべてが含まれている **src/Shell** と
**src/Shell/Task** ディレクトリーが含まれています。
また、**bin** ディレクトリー内に実行可能なコマンドが付属しています。 ::

    $ cd /path/to/app
    $ bin/cake

.. note::

    Windows の場合、コマンドは ``bin\cake`` （バックスラッシュに注意）にする必要があります。

引数なしでコンソールを実行すると、以下のヘルプメッセージを生成します。 ::

    Welcome to CakePHP v3.5.0 Console
    ---------------------------------------------------------------
    App : App
    Path: /Users/markstory/Sites/cakephp-app/src/
    ---------------------------------------------------------------
    Current Paths:

     -app: src
     -root: /Users/markstory/Sites/cakephp-app
     -core: /Users/markstory/Sites/cakephp-app/vendor/cakephp/cakephp

    Changing Paths:

    Your working path should be the same as your application path. To change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp

    Available Shells:

    - version
    - help
    - cache
    - completion
    - i18n
    - orm_cache
    - plugin
    - routes
    - server
    - bug
    - console
    - event
    - orm
    - bake
    - bake.bake
    - migrations
    - migrations.migrations

    To run a command, type `cake shell_name [args|options]`
    To get help on a specific command, type `cake shell_name --help`

先頭部分にはパスに関連する情報が表示されます。
これはファイルシステム上の異なる場所からコンソールを動かしている場合に便利です。

あなたは、その名前を使用して記載されているシェルのいずれかを実行できます。 ::

    # server シェルの実行
    bin/cake server

    # migrations シェルの実行
    bin/cake migrations -h

    # bake の実行 (プラグインのプレフィックス付き)
    bin/cake bake.bake -h

シェルの名前が、アプリケーションやフレームワークのシェルと重複していない場合、
プラグインのシェルは、プラグインのプレフィックスなしで呼び出すことができます。
2つのプラグインが同じ名前のシェルを提供する場合には、最初にロードされたプラグインが、
短いエイリアスを取得します。
常に明確にシェルを参照するために ``plugin.shell`` 形式を使用することができます。

.. php:class:: Shell

シェルの作成
============

早速コンソールで動くシェルを作ってみましょう。この例ではシンプルな Hello world シェルを作ります。
アプリケーションの **src/Shell** ディレクトリーに **HelloShell.php** を作成してください。
その中に以下のコードを書きます。 ::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }
    }

シェルクラスの規約として、クラス名は Shell サフィックス（接尾辞）を 付け、
ファイル名と一致する必要があります。上記のシェルでは、 ``main()`` メソッドを作成しました。
シェルが 追加コマンド（引数）なしで起動された場合、このメソッドが呼ばれます。
この後、 多少コマンドを追加していきますが、現時点では単にシェルを起動してみましょう。
アプリケーションディレクトリーから、以下を実行してください。 ::

    bin/cake hello

次の出力が表示されるはずです。 ::

    Hello world.

すでに述べたように、シェルで ``main()`` メソッドは、シェルに与えられた他のコマンドや
引数がない場合、いつでも呼ばれる特殊なメソッドです。main メソッドの使い方がある程度わかったら、
次は以下のように別のコマンドを追加してみましょう。 ::

    namespace App\Shell;

    use Cake\Console\Shell;

    class HelloShell extends Shell
    {
        public function main()
        {
            $this->out('Hello world.');
        }

        public function heyThere($name = 'Anonymous')
        {
            $this->out('Hey there ' . $name);
        }
    }

このファイルを保存した後、次のコマンドを実行すると、あなたの名前が表示されるはずです。 ::

    bin/cake hello hey_there your-name

public メソッドのうち頭に _ が付かないものは、コマンドラインから呼び出せます。
ご覧のように、コマンドラインから呼び出されるメソッドは、アンダースコアー形式のシェル引数から
クラス内の正しいキャメルケース形式のメソッド名に変換されています。

``heyThere()`` メソッドでは、位置引数が ``heyThere()`` 関数に提供されていることがわかります。
位置引数は ``args`` プロパティーでも利用できます。 ``$this->params`` で利用できる
シェルアプリケーション上のスイッチやオプションにアクセスできますが、それを少し使いやすくしています。

``main()`` メソッドを使用するときは、位置引数を使用することはできません。
最初の位置引数やオプションが、コマンド名として解釈されるためです。
引数を使用したい場合、 ``main`` 以外のメソッド名を使用する必要があります。

シェルのタスク
==============

より高度なコンソールアプリケーションを開発する場合には、
多くのシェル間で共有される再利用可能なクラスとして機能を構成したいでしょう。
タスクによりコマンドをクラスに展開できます。例えば ``bake`` は、そのほとんどがタスクにより
作られています。 ``$tasks`` プロパティーを使ってシェルのタスクを定義できます。 ::

    class UserShell extends Shell
    {
        public $tasks = ['Template'];
    }

プラグインからタスクを使うには、標準の :term:`プラグイン記法` を使用します。
タスクは ``Shell/Task/`` に、クラスにちなんで名付けられたファイルに格納されます。
たとえば新たに 'FileGenerator' タスクを作成したい場合は、
**src/Shell/Task/FileGeneratorTask.php** を作成することになります。

各タスクは、少なくとも ``main()`` メソッドを実装する必要があります。
タスクが呼び出されたとき ShellDispatcher は、このメソッドを呼び出します。
タスククラスは次のようになります。 ::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class FileGeneratorTask extends Shell
    {
        public function main()
        {

        }
    }

シェルはプロパティーとしてもタスクにアクセスできますので、 :doc:`/controllers/components`
と同様に再利用可能な部品としてタスクを利用できます。 ::

    // src/Shell/SeaShell.php に作成
    class SeaShell extends Shell
    {
        // src/Shell/Task/SoundTask.php に作成
        public $tasks = ['Sound'];

        public function main()
        {
            $this->Sound->main();
        }
    }

また、コマンドラインからタスクに直接アクセスすることができます。 ::

    $ cake sea sound

.. note::

    コマンドラインからタスクを直接アクセスするには、タスクは **必ず** シェルクラスの
    $tasks プロパティーに含まれている必要があります。

また、タスク名は、シェルの OptionParser にサブコマンドとして追加する必要があります。 ::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addSubcommand('sound', [
            // コマンド一覧のヘルプテキストを提供
            'help' => 'Sound タスクの実行。',
            // オプションパーサーを互いにリンク
            'parser' => $this->Sound->getOptionParser(),
        ]);
        return $parser;
    }

TaskRegistry による動的なタスクのロード
---------------------------------------

タスクのレジストリーオブジェクトを使用して、その場でタスクをロードすることができます。
以下のようにすると $tasks で宣言されなかったタスクをロードすることができます。 ::

    $project = $this->Tasks->load('Project');

ProjectTask インスタンスをロードして返します。
プラグインからタスクをロードすることもできます。 ::

    $progressBar = $this->Tasks->load('ProgressBar.ProgressBar');

シェルの中でのモデルの使用
===========================

アプリケーションのビジネスロジックに、シェルユーティリティーの中からアクセスする必要があることも
よくあるでしょう。 CakePHP はそれが超簡単にできます。コントローラーの中で ``loadModel()`` を
使用するのと同じように、シェルの中でモデルを読み込むことができます。
ロードされたモデルは、あなたのシェルに付属するプロパティーとして設定されます。 ::

    namespace App\Shell;

    use Cake\Console\Shell;

    class UserShell extends Shell
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadModel('Users');
        }

        public function show()
        {
            if (empty($this->args[0])) {
                // CakePHP 3.2 より前なら error() を利用
                return $this->abort('Please enter a username.');
            }
            $user = $this->Users->findByUsername($this->args[0])->first();
            $this->out(print_r($user, true));
        }
    }

上記のシェルは、username によってユーザーを取得し、データベースに格納された情報が表示されます。

シェルヘルパー
==============

複雑な出力生成ロジックの場合、再利用可能な方法で、このロジックをカプセル化するために
:doc:`/console-and-shells/helpers` を利用することができます。

.. _invoking-other-shells-from-your-shell:

シェルから他のシェルの呼び出し
==============================

.. php:method:: dispatchShell($args)

あるシェルから他のシェルを呼び出したいケースは多々あると思います。
他のシェルを呼び出すには ``Shell::dispatchShell()`` を使います。
サブシェル側では引数を受け取るための ``argv`` が使えます。
引数やオプションは可変引数もしくは文字列として指定できます。 ::

    // 文字列として
    $this->dispatchShell('schema create Blog --plugin Blog');

    // 配列として
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

上記は、プラグインのシェルの中からプラグイン用のスキーマを作るために schema シェルを呼んでいます。

ディスパッチされたシェルへのパラメーター追加
--------------------------------------------

.. versionadded:: 3.1

ディスパッチされたシェルへの（シェルの引数にない）追加パラメーターを渡すことが有用な時がしばしばあります。
これを行うために、 ``dispatchShell()`` に配列を渡すことができます。
配列は、 ``command`` キーと共に ``extra`` キーを持つことが期待されています。 ::

    // コマンド文字列を使用
    $this->dispatchShell([
       'command' => 'schema create Blog --plugin Blog',
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

    // コマンド配列を使用
    $this->dispatchShell([
       'command' => ['schema', 'create', 'Blog', '--plugin', 'Blog'],
       'extra' => [
            'foo' => 'bar'
        ]
    ]);

``extra`` で渡されたパラメーターは、 ``Shell::$params`` プロパティーにマージされ、
``Shell::param()`` メソッドでアクセス可能になります。
シェルで ``dispatchShell()`` を使用してディスパッチされた時、デフォルトで ``requested``
追加パラメーターが自動的に追加されます。この ``requested`` パラメーターは、
ディスパッチされたシェルに表示されている CakePHP のコンソールウェルカムメッセージを防ぎます。

ユーザー入力の取得
==================

.. php:method:: in($question, $choices = null, $default = null)

対話的なコンソールアプリケーションを構築する際には、ユーザー入力を取得する必要があります。
CakePHP は、このための簡単な方法を提供します。 ::

    // ユーザーから任意のテキストを取得
    $color = $this->in('What color do you like?');

    // ユーザーの選択を取得
    $selection = $this->in('Red or Green?', ['R', 'G'], 'R');

選択のバリデーションは大文字と小文字を区別しません。

ファイルの作成
==============

.. php:method:: createFile($path, $contents)

多くのシェルアプリケーションは、開発やデプロイメントのタスクを自動化するのに役立ちます。
ファイルの作成は、これらのユースケースにしばしば重要です。
CakePHP は指定されたパスにファイルを作成する簡単な方法を提供します。 ::

    $this->createFile('bower.json', $stuff);

ファイルが存在する場合、対話的なシェルであれば警告が発せられ、上書きするかどうか聞かれます。
シェルの interactive プロパティーが ``false`` である場合、質問は行われず、単にファイルは上書きされます。

コンソール出力
==============

.. php:method:out($message, $newlines, $level)
.. php:method:err($message, $newlines)

``Shell`` クラスは、コンテンツを出力するためのいくつかのメソッドを提供します。 ::

    // 標準出力 (stdout) に出力
    $this->out('Normal message');

    // 標準エラー (stderr) に出力
    $this->err('Error message');

    // 標準エラー (stderr) に出力し、停止例外を発生
    $this->abort('Fatal error');

    // CakePHP 3.2 より前。標準エラー (stderr) に出力し exit()
    $this->error('Fatal error');

また、出力レベルに関する2つの便利なメソッドを提供します。 ::

    // 詳細出力が有効の時のみ (-v)
    $this->verbose('Verbose message');

    // すべてのレベルで表示
    $this->quiet('Quiet message');

シェルはまた、画面のクリア、空白行の作成、または横棒線を描くためのメソッドを含みます。 ::

    // ２行の改行を出力
    $this->out($this->nl(2));

    // ユーザーの画面をクリア
    $this->clear();

    // 横棒線を描画
    $this->hr();

最後に、 ``_io->overwrite()`` を使用して、画面上のテキストの現在の行を更新することができます。 ::

    $this->out('Counting down');
    $this->out('10', 0);
    for ($i = 9; $i > 0; $i--) {
        sleep(1);
        $this->_io->overwrite($i, 0, 2);
    }

新しい行が出力されたら、テキストを上書きすることができないことに注意してください。

.. _shell-output-level:

コンソール出力のレベル
----------------------

シェルは、往々にして異なる詳細レベルの出力を必要とします。cron ジョブとして実行している場合は
ほとんどの出力は不要です。また、シェルが出力する メッセージを見たくないというケースもあるでしょう。
このような場合、出力を適切に制御するための出力レベルが使えます。シェルの利用者は、シェルを呼び出す際に
正しいフラグをセットすることで、自分が見たい詳細レベルの設定 ができます。
:php:meth:`Cake\\Console\\Shell::out()` では、デフォルトで３種類の出力をサポートしています。

* ``QUIET`` - 必須のメッセージであり、静かな（必要最小限の）出力モードでも表示される。
* ``NORMAL`` - 通常利用におけるデフォルトのレベル。
* ``VERBOSE`` - 毎日利用には冗長すぎるメッセージを表示、しかしデバッグ時には有用。

以下のように出力を指定できます。 ::

    // すべてのレベルで表示されます。
    $this->out('Quiet message', 1, Shell::QUIET);
    $this->quiet('Quiet message');

    // QUIET 出力時には表示されません。
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

    // VERBOSE 出力時のみ表示されます。
    $this->out('extra message', 1, Shell::VERBOSE);
    $this->verbose('Verbose output');

シェルの実行時に ``--quiet`` や ``--verbose`` を使うことで出力を制御できます。
これらのオプションはデフォルトで組み込まれていて、いつでも CakePHP のシェル内部の
出力レベルを制御できるように考慮されています。

また、 ``--quiet`` と ``--verbose`` オプションは、ログデータの標準出力/標準エラーへの
出力方法を制御します。通常の情報とそれ以上のレベルのログメッセージは標準出力/標準エラーに出力されます。
``--verbose`` を使用する場合は、デバッグログは標準出力に出力されます。
``--quiet`` を使用する場合は、警告とそれ以上のレベルのログメッセージのみ標準エラーに出力されます。

出力のスタイル
--------------

ちょうど HTML のようなタグを埋め込むことで、出力のスタイルを変更することができます。
ConsoleOutput はこれらのタグを正しい ansi コードシーケンスに変換したり、ansi コードを
サポートしないコンソールではタグを除去します。
スタイルはいくつかビルトインされたものがありますが、自分で作成することも 可能です。
ビルトインされたものは以下の通りです。

* ``success`` 成功メッセージ。緑色のテキスト。
* ``error`` エラーメッセージ。赤色のテキスト。
* ``warning`` 警告メッセージ。黄色のテキスト。
* ``info`` 情報メッセージ。水色のテキスト。
* ``comment`` 追加情報。青色のテキスト。
* ``question`` 質問事項。シェルが自動的に追加する。

``$this->stdout->styles()`` を使ってさらに多くのスタイルを追加できます。
新しいスタイルを追加するには以下のようにします。 ::

    $this->_io->styles('flashy', ['text' => 'magenta', 'blink' => true]);

これで ``<flashy>`` というタグが有効になり、ansi カラーが有効な端末であれば、
``$this->out('<flashy>うわ！</flashy> 何か変になった');`` の場合の表示は
色がマゼンタでブリンクになります。
スタイルを定義する際は ``text`` と ``background`` 属性として以下の色が指定できます。

* black
* blue
* cyan
* green
* magenta
* red
* white
* yellow

さらに以下のオプションをブール型のスイッチとして指定できます。 値が真の場合に有効になります。

* blink
* bold
* reverse
* underline

スタイルを追加すると ConsoleOutput のすべてのインスタンスでも有効になります。
ですので stdout と stderr 両方のオブジェクトでこれらを再定義する必要はありません。

カラー表示の無効化
------------------

カラー表示はなかなか綺麗ですが、オフにしたい場合や強制的にオンにしたい場合も あるでしょう。 ::

    $this->_io->outputAs(ConsoleOutput::RAW);

これは RAW（生の）出力モードにします。 RAW 出力モードではすべてのスタイルが無効になります。
モードには３種類あります。

* ``ConsoleOutput::COLOR`` - カラーエスケープコードを出力します。
* ``ConsoleOutput::PLAIN`` - プレーンテキスト出力。既知のスタイルタグが出力から取り除かれます。
* ``ConsoleOutput::RAW`` - RAW 出力、スタイルや書式設定は行われない。
  これは XML を出力する場合や、スタイルのデバッグを行う際に役立ちます。

デフォルトでは \*nix システムにおける ConsoleOutput のデフォルトはカラー出力モードです。
Windows では ``ANSICON`` 環境変数がセットされている場合を除き、プレーンテキストモードが
デフォルトです。

シェルの実行を停止
==================

あなたのシェルコマンドを停止したい条件に達した時、プロセスを停止するための ``StopException``
を発生させるために ``abort()`` を使用することができます。 ::

    $user = $this->Users->get($this->args[0]);
    if (!$user) {
        // エラーメッセージとエラーコードとともに停止
        $this->abort('ユーザーが見つかりません', 128);
    }

.. versionadded:: 3.2
    abort() メソッドは、3.2 で追加されました。以前のバージョンでは、
    ``error()`` メソッドを使用して、メッセージを出力し、実行を停止することができます。

ステータスとエラーコード
------------------------

コマンドラインツールは、成功を示すために 0 を返し、エラー状態を示すために 0 以外を
返すべきです。 PHP メソッドは、通常 ``true`` か ``false`` を返すため、
Cake Shell の ``dispatch`` 関数は、 ``null`` と ``true`` の戻り値を 0 へ、
それ以外の値は 1 へと変換することによって、これらのセマンティクスとの橋渡しに役立ちます。

Cake Shell の ``dispatch`` 関数は、 ``StopException`` をキャッチし、
その例外コードの値をシェルの終了コードとして使用します。上記のように、
``abort()`` を使ってメッセージを出力して指定したコードで終了したり、
例に示すように、直接 ``StopException`` を起こすことができます。 ::

    namespace App\Shell\Task;

    use Cake\Console\Shell;

    class ErroneousShell extends Shell
    {
        public function main()
        {
            return true;
        }

        public function itFails()
        {
            return false;
        }

        public function itFailsSpecifically()
        {
            throw new StopException("", 2);
        }
    }

上記の例では、コマンドライン上で実行された際、次の終了コードを返します。 ::

    $ bin/cake erroneousshell ; echo $?
    0
    $ bin/cake erroneousshell itFails ; echo $?
    1
    $ bin/cake erroneousshell itFailsSpecifically ; echo $?
    2

.. tip::

    終了コードの 64 から 78 は避けてください。それらは ``sysexits.h`` で記述された
    特定の意味を持っています。
    終了コードの 127 以上を避けてください。それらは、 SIGKILL や SIGSEGV のような
    シグナルによるプロセスの終了を示すために使用されます。

.. note::

    従来の終了コードについての詳細は、ほとんどの Unix システムの sysexit マニュアルページ
    (``man sysexits``) 、または Windows の ``System Error Codes`` ヘルプページを
    参照してください。

フックメソッド
==============

.. php:method:: initialize()

    シェルを初期化し、サブクラスのコンストラクターとして動作します。またシェルの実行に先立って、
    タスクの設定を行います。

.. php:method:: startup()

    シェルを起動して、ウェルカムメッセージを表示します。
    コマンドや main の実行に先立ってチェックや設定を可能とします。

.. tip::

    ウェルカム情報を出力したくない場合は、このメソッドをオーバーライドします。そうしない場合、
    そこまでのコマンドの流れを変更します。

オプションの設定とヘルプの生成
==============================

.. php:class:: ConsoleOptionParser

``ConsoleOptionParser`` は、コマンドラインオプションと引数パーサーを提供します。

OptionParsers は同時に２つのことを実現します。
第一に、コマンドのオプションと引数を定義することができます。
これは、基本的な入力のバリデーションとコンソールコマンドを分離することができます。
第二に、きれいにフォーマットされたヘルプファイルを生成するためのドキュメントの提供です。

CakePHPのコンソールのフレームワークは ``$this->getOptionParser()`` を呼び出すことにより、
あなたのシェルのオプションパーサーを取得します。このメソッドをオーバーライドすることで、あなたの
シェルの期待する入力を定義するためにオプションパーサーを設定することができます。
さらにサブコマンドオプションパーサーを設定すると、サブコマンドとタスクについて異なった
オプションパーサーを定義できます。ConsoleOptionParser は柔軟なインターフェイスを実装しており、
また複数のオプション／引数を一度に簡単に設定できるようなメソッドを備えています。 ::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        // パーサーの設定
        return $parser;
    }

柔軟なインターフェイスによるオプションパーサーの設定
----------------------------------------------------

オプションパーサーを構成するすべてのメソッドは相互に連結可能です。これによりオプションパーサー全体を
一連のメソッド呼び出しで定義できます。 ::

    public function getOptionParser()
    {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', [
            'help' => 'フルパスもしくはクラスの型のいずれか。'
        ])->addArgument('className', [
            'help' => 'CakePHP コアのクラス名（Component, HtmlHelper 等)。'
        ])->addOption('method', [
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ])->setDescription(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

連結できるのは以下のメソッドです。

- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()
- setCommand()
- setDescription()
- setEpilog()

説明文の設定
~~~~~~~~~~~~

.. php:method:: setDescription($text = null)

オプションパーサーの説明文を取得または設定します。説明文は引数やオプションの上に表示されます。
配列または文字列を渡すことで説明文の値を設定できます。引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->setDescription(['１行目', '２行目']);
    // 3.4 より前
    $parser->description(['１行目', '２行目']);

    // 現在の値を取得する
    $parser->getDescription();

**src/Shell/ConsoleShell.php** は、アクション中の ``description()`` メソッドの良い例です。 ::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        return $parser;
    }

コンソールの ``description`` 出力は、次のコマンドを実行して確認できます。 ::

    $ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

ヘルプエイリアスの設定
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: setHelpAlias($alias)

コマンド名を変更したい場合、 ``setHelpAlias()`` メソッドを使用することができます。 ::

    $parser->setHelpAlias('my-shell');

これにより、使用方法の出力がデフォルトの ``cake`` の値の代わりに ``my-shell`` に変更されます。 ::

    Usage:
    my-shell console [-h] [-v] [-q]

.. versionadded:: 3.5.0
    ``setHelpAlias`` は、3.5.0 で追加されました。

エピローグの設定
----------------

.. php:method:: setEpilog($text = null)

オプションパーサーのエピローグを取得または設定します。
エピローグは、引数とオプションの情報の後に表示されます。
配列または文字列を渡すことで、エピローグの値を設定することができます。
引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->setEpilog(['１行目', '２行目']);
    // 3.4 より前
    $parser->epilog(['１行目', '２行目']);

    // 現在の値を取得する
    $parser->getEpilog();

アクション中の ``epilog()`` メソッドを説明するために、**src/Shell/ConsoleShell.php**
の中で使用されている ``getOptionParser()`` メソッドの呼び出しを追加してみましょう。 ::

    /**
     * Display help for this console.
     *
     * @return ConsoleOptionParser
     */
    public function getOptionParser()
    {
        $parser = new ConsoleOptionParser('console');
        $parser->setDescription(
            'This shell provides a REPL that you can use to interact ' .
            'with your application in an interactive fashion. You can use ' .
            'it to run adhoc queries with your models, or experiment ' .
            'and explore the features of CakePHP and your application.' .
            "\n\n" .
            'You will need to have psysh installed for this Shell to work.'
        );
        $parser->setEpilog('Thank you for baking with CakePHP!');
        return $parser;
    }

``setEpilog()`` メソッドで追加されたテキストは、次のコンソールコマンドの出力で確認できます。 ::

    $ bin/cake console --help

    Welcome to CakePHP v3.0.13 Console
    ---------------------------------------------------------------
    App : src
    Path: /home/user/cakeblog/src/
    ---------------------------------------------------------------
    This shell provides a REPL that you can use to interact with your
    application in an interactive fashion. You can use it to run adhoc
    queries with your models, or experiment and explore the features of
    CakePHP and your application.

    You will need to have psysh installed for this Shell to work.

    Usage:
    cake console [-h] [-v] [-q]

    Options:

    --help, -h     Display this help.
    --verbose, -v  Enable verbose output.
    --quiet, -q    Enable quiet output.

    Thank you for baking with CakePHP!

引数の追加
----------

.. php:method:: addArgument($name, $params = [])

コマンドラインツールにおいて、位置引数 (指定順序が意味を持つ引数) はよく使われます。
``ConsoleOptionParser`` では位置引数を要求するだけでなく定義することもできます。
指定する際は ``$parser->addArgument();`` で一度にひとつずつ設定するか、
``$parser->addArguments();`` で複数個を同時に指定するかを選べます。 ::

    $parser->addArgument('model', ['help' => 'bake するモデル']);

引数を作成する際は、以下のオプションが指定できます。

* ``help`` この引数に対して表示するヘルプ。
* ``required`` この引数が必須かどうか。
* ``index`` 引数のインデックス。設定されない場合は引数リストの末尾に位置づけられます。
  同じインデックスを２回指定すると、最初に指定したオプションは上書きされます。
* ``choices`` この引数について有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

必須であると指定された引数が省略された場合、コマンドのパースにおいて例外が発生します。
これにより、引数のチェックをシェルの中で行う必要がなくなります。

.. php:method:: addArguments(array $args)

複数の引数を１個の配列で持つ場合、 ``$parser->addArguments()`` により
一度に複数の引数を追加できます。 ::

    $parser->addArguments([
        'node' => ['help' => '生成するノード', 'required' => true],
        'parent' => ['help' => '親ノード', 'required' => true]
    ]);

ConsoleOptionParser 上のすべてのビルダーメソッドと同様に、
addArguments も柔軟なメソッドチェインの一部として使えます。

引数の検証
----------

位置引数を作成する場合、 ``required`` フラグを指定できます。これはシェルが呼ばれた時、
その引数が存在しなければならないことを意味します。さらに ``choices`` を使うことで、
その引数が取りうる有効な値の選択肢を制限できます。 ::

    $parser->addArgument('type', [
        'help' => 'これとやり取りするノードの型。',
        'required' => true,
        'choices' => ['aro', 'aco']
    ]);

この例では、必須でかつ入力時に値の正当性チェックが行われるような引数を作成します。
引数が指定されないか、または無効な値が指定された場合は例外が発生してシェルが停止します。

オプションの追加
----------------

.. php:method:: addOption($name, $options = [])

コマンドラインツールでは、オプションやフラグもまたよく使われます。
``ConsoleOptionParser`` では長い名称と短い別名の両方を持つオプション、
デフォルト値の設定やブール型スイッチの作成などをサポートしています。
オプションは ``$parser->addOption()`` または ``$parser->addOptions()`` により追加します。 ::

    $parser->addOption('connection', [
        'short' => 'c',
        'help' => 'connection',
        'default' => 'default',
    ]);

この例の場合、シェルを起動する際に ``cake myshell --connection=other``,
``cake myshell --connection other``, ``cake myshell -c other``
のいずれかで引数を指定できます。またブール型のスイッチも作れますが、これらのスイッチは値を消費せず、
またその存在はパースされた引数の中だけとなります。 ::

    $parser->addOption('no-commit', ['boolean' => true]);

このオプション指定の場合、 ``cake myshell --no-commit something`` のようにコールされると
no-commit 引数が ``true`` になり、'something' は位置引数と見なされます。
ビルトインオプションの ``--help``, ``--verbose``, ``--quiet`` もこの仕組みを利用しています。

オプションを作成する場合、オプションの振る舞いを定義するのに以下が指定できます。

* ``short`` - このオプションを表す１文字の別名。未定義の場合はなしになります。
* ``help`` - このオプションのヘルプ文字列。オプションのヘルプを生成する際に参照されます。
* ``default`` - このオプションのデフォルト値。未定義の場合、デフォルト値は ``true`` となります。
* ``boolean`` - 値を持たない単なるブール型のスイッチ。デフォルト値は ``false`` です。
* ``choices`` - このオプションで取りうる有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

.. php:method:: addOptions(array $options)

複数の引数を１個の配列で持つ場合、 ``$parser->addOptions()`` により
一度に複数のオプションを追加できます。 ::

    $parser->addOptions([
        'node' => ['short' => 'n', 'help' => 'The node to create'],
        'parent' => ['short' => 'p', 'help' => 'The parent node']
    ]);

ConsoleOptionParser 上のビルダーメソッドと同様に、addOptions も強力なメソッドチェーンの
一部として使えます。

オプション値は、 ``$this->params`` 配列に格納されます。また、存在しないオプションにアクセスした時の
エラーを回避するために便利なメソッド ``$this->param()`` を使用することができます。

オプションの検証
----------------

オプションでは位置引数と同様に、値の選択肢を指定できます。
オプションに choices が指定されている場合、それらがそのオプションで取りうる有効な値です。
これ以外の値が指定されると ``InvalidArgumentException`` が発生します。 ::

    $parser->addOption('accept', [
        'help' => 'What version to accept.',
        'choices' => ['working', 'theirs', 'mine']
    ]);

ブール型オプションの使用
------------------------

フラグのオプションを作りたい場合、オプションをブール型として指定できます。
デフォルト値を持つオプションのように、ブール型のオプションもパース済み引数の中に常に
自分自身を含んでいます。フラグが存在する場合それらは ``true`` にセットされ、
存在しない場合は ``false`` になります。 ::

    $parser->addOption('verbose', [
        'help' => 'Enable verbose output.',
        'boolean' => true
    ]);

以下の例のように ``$this->params['verbose']`` の結果が常に参照可能です。
これにより、ブール型のフラグをチェックする際に ``empty()`` や ``isset()`` によるチェックを
する必要がありません。 ::

    if ($this->params['verbose']) {
        // 何かします
    }

ブール型のオプションは常に ``true`` または ``false`` として定義されているので、
それ以上のチェックメソッドを省略できます。
``$this->param()`` メソッドは、すべてのケースのためにこれらのチェックが不要になります。

サブコマンドの追加
------------------

.. php:method:: addSubcommand($name, $options = [])

コンソールアプリケーションはサブコマンドから構成されることも多いのですが、サブコマンド側で
特別なオプション解析や独自ヘルプを持ちたいこともあります。この完全な例が ``bake`` です。
Bake は多くの別々のタスクから構成されますが、各タスクはそれぞれ独自のヘルプとオプションを持っています。
``ConsoleOptionParser`` を使ってサブコマンドを定義し、それらに固有のオプションパーサーを提供できるので、
シェルはそれぞれのタスクについてコマンドをどう解析すればよいのかを知ることができます。 ::

    $parser->addSubcommand('model', [
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ]);

上の例では、シェルのタスクに対してヘルプやそれに特化したオプションパーサーを提供方法を示しています。
タスクの ``getOptionParser()`` を呼ぶことで、オプションパーサーの複製をしたり、シェル内の関係を
調整する必要がなくなります。この方法でサブコマンドを追加することには２つの利点があります。
まず生成されたヘルプの中で簡単にサブコマンドを文書化できること、そしてサブコマンドのヘルプに簡単に
アクセスできることです。前述のやり方で生成したサブコマンドを使って ``cake myshell --help`` とやると、
サブコマンドの一覧が出ます。また ``cake myshell model --help`` とやると、model タスクだけの
ヘルプが表示されます。

.. note::

    シェルはサブコマンドを定義すると、すべてのサブコマンドは、明示的に定義する必要があります。

サブコマンドを定義する際は、以下のオプションが使えます。

* ``help`` - サブコマンドのヘルプテキスト。
* ``parser`` - サブコマンドの ConsoleOptionParser。
  これによりメソッド固有のオプションパーサーを生成します。
  サブコマンドに関するヘルプが生成される際、もしパーサーが存在すればそれが使われます。
  :php:meth:`Cake\\Console\\ConsoleOptionParser::buildFromArray()` と
  互換性のある配列としてパーサーを指定することができます。

サブコマンドの追加も強力なメソッドチェーンの一部として使えます。

.. versionchanged:: 3.5.0
    複数語のサブコマンドを追加する際、キャメルバック (camelBacked) 形式に加えて
    ``スネークケース (snake_cake)`` を使ってこれらのコマンドを呼び出すことができます。

配列から ConsoleOptionParser の構築
-----------------------------------

.. php:method:: buildFromArray($spec)

前述のように、サブコマンドのオプションパーサーを作成する際は、そのメソッドに対する
パーサーの仕様を配列として定義できます。
これによりすべてが配列として扱えるので、サブコマンドパーサーの構築が容易になります。 ::

    $parser->addSubcommand('check', [
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => [
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]
    ]);

パーサーの仕様の中では ``definition``, ``arguments``, ``options``, ``epilog`` のための
キーを定義できます。配列形式ビルダーの内部には ``subcommands`` は定義できません。
引数とオプションの値は、 :php:func:`Cake\\Console\\ConsoleOptionParser::addArguments()` や
:php:func:`Cake\\Console\\ConsoleOptionParser::addOptions()` が利用する書式に従ってください。
buildFromArray を単独で使ってオプションパーサーを構築することも可能です。 ::

    public function getOptionParser()
    {
        return ConsoleOptionParser::buildFromArray([
            'description' => [
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ],
            'arguments' => [
                'aro' => ['help' => __('ARO to check.'), 'required' => true],
                'aco' => ['help' => __('ACO to check.'), 'required' => true],
                'action' => ['help' => __('Action to check')]
            ]
        ]);
    }

ConsoleOptionParser のマージ
----------------------------

.. php:method:: merge($spec)

group コマンドを構築する場合、おそらく、いくつかのパーサーを組み合わせたいでしょう。 ::

    $parser->merge($anotherParser);

各パーサーの引数の順序が同じでなければならないこと、およびオプションは、動作するために互換性が
なければならないことに注意してください。ですので、別のキーを使用しないでください。

シェルからヘルプを取得
----------------------

ConsoleOptionParser を追加することにより、一貫性のある方法でシェルからヘルプを取得します。
すべてのコアのシェル、および ConsoleOptionParser を実装したいかなるシェルからも、
``--help`` または -``h`` オプションを使うことでヘルプを参照できます。::

    cake bake --help
    cake bake -h

このいずれでも bake のヘルプを生成します。シェルがサブコマンドをサポートしている場合は、
それらに関するヘルプを同様の書式で取得可能です。 ::

    cake bake model --help
    cake bake model -h

これは bake の model タスクに関するヘルプを表示します。

ヘルプを XML で取得
-------------------

自動ツールや開発ツールをビルドするのに CakePHP との対話処理を必要とする場合、
ヘルプを機械がパースできる形式で取得できると便利です。
ConsoleOptionParser に以下の引数を追加することで、ヘルプを xml で出力できます。 ::

    cake bake --help xml
    cake bake -h xml

この例は生成されたヘルプ、オプション、引数そして選択されたシェルのサブコマンドに関するドキュメントを
XML で返します。XML ドキュメントの例としては以下のようになります。

.. code-block:: xml

    <?xml version="1.0"?>
    <shell>
        <command>bake fixture</command>
        <description>Generate fixtures for use with the test suite. You can use
            `bake fixture all` to bake all fixtures.</description>
        <epilog>
            Omitting all arguments and options will enter into an interactive
            mode.
        </epilog>
        <subcommands/>
        <options>
            <option name="--help" short="-h" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--verbose" short="-v" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--quiet" short="-q" boolean="1">
                <default/>
                <choices/>
            </option>
            <option name="--count" short="-n" boolean="">
                <default>10</default>
                <choices/>
            </option>
            <option name="--connection" short="-c" boolean="">
                <default>default</default>
                <choices/>
            </option>
            <option name="--plugin" short="-p" boolean="">
                <default/>
                <choices/>
            </option>
            <option name="--records" short="-r" boolean="1">
                <default/>
                <choices/>
            </option>
        </options>
        <arguments>
            <argument name="name" help="Name of the fixture to bake.
                Can use Plugin.name to bake plugin fixtures." required="">
                <choices/>
            </argument>
        </arguments>
    </shell>

コマンド名の変更
=================

デフォルトで、 CakePHP は、アプリケーションやプラグインの中の全てのコマンドを
自動的に検出します。独立したコンソールアプリケーションを構築する際、
公開されるコマンドの数を減らすことができます。Application の ``console()`` フックを使って、
公開されるコマンドを制限し、公開されるコマンドの名前を変更することができます。 ::

    namespace App;

    use App\Shell\UserShell;
    use App\Shell\VersionShell;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console($commands)
        {
            // クラス名で追加
            $commands->add('user', UserShell::class);

            // インスタンスを追加
            $commands->add('version', new VersionShell());

            return $commands;
        }
    }

上記の例で、利用できるコマンドは、 ``help`` 、 ``version`` 、そして ``user`` です。

.. versionadded:: 3.5.0
    ``console`` フックが追加されました。

シェル／CLI におけるルーティング
================================

コマンドライン・インターフェイス (CLI)、特にあなたのシェルやタスクでは、 ``env('HTTP_HOST')``
やその他のウェブブラウザー固有の変数がセットされていません。

``Router::url()`` を使ってレポートを作成したり電子メールを送ったりする場合、
それらにはデフォルトホスト ``http://localhost/`` が構成に含まれており、 そのため結果として無効な
URL となってしまいます。こういったケースでは、ドメインを手作業で設定する必要があります。
これを、たとえばブートストラップまたは config で、コンフィグ値 ``App.fullBaseUrl`` を使って
設定できます。

電子メールを送る場合は、Email クラスでメールを送る際のホストを指定する必要があります。 ::

    use Cake\Mailer\Email;

    $email = new Email();
    // 3.4 より前は domain() を使用
    $email->setDomain('www.example.org');

これにより生成されるメッセージ ID は有効で、また送信元ドメイン名にも合致したものになります。

その他のトピック
================

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/repl
    console-and-shells/cron-jobs
    console-and-shells/i18n-shell
    console-and-shells/completion-shell
    console-and-shells/plugin-shell
    console-and-shells/routes-shell
    console-and-shells/upgrade-shell
    console-and-shells/server-shell
    console-and-shells/cache

.. meta::
    :title lang=ja: シェルとタスクとコンソール
    :keywords lang=ja: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
