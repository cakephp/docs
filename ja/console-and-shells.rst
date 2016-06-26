シェルとタスクとコンソール
##########################

CakePHP はウェブフレームワークとしてだけではなく、コンソールアプリケーション
を開発するためのコンソールフレームワークとしての機能を合わせ持っています。
コンソールアプリケーションはメンテナンスといった様々なバックグラウンド
タスクを行ったり、リクエスト－レスポンスのサイクルの外側で何かを実行する
ための仕組みです。CakePHP のコンソールアプリケーションでは、コマンドライン
からあなたが作成したアプリケーションクラスを再利用できます。

CakePHP には元々たくさんのコンソールアプリケーションが備わっています。
これらの中には（ACL や i18n のように）他の CakePHP の機能と組合せて使うものも
あれば、仕事をより早く片付けるための、より一般的なものもあります。

.. _the-cakephp-console:

CakePHP のコンソール
====================

このセクションでは、コマンドラインにおける CakePHP をご紹介します。
もし過去に cron ジョブやコマンドライン・スクリプトから自分の CakePHP の
MVC クラスにアクセスできたら便利なのにと思ったことがあれば、
このセクションがその道しるべとなるでしょう。

PHP ではファイルシステムやアプリケーションをより柔軟に使えるように、
これらへのインターフェースを備えた CLI クライアント機能を提供しています。
CakePHP コンソールでは、シェルスクリプト作成のためのフレームワークを提供
しています。コンソールではディスパッチタイプのセットアップを使って
シェルやタスクをロードし、それらへパラメータを渡します。

.. note::

    コンソール機能を使う場合は、コマンドライン版 (CLI) としてビルドされた
    PHP がインストールされている必要があります。

詳細に入る前に、CakePHP コンソールがちゃんと動くことを確認しておきましょう。
まずはシステムのシェルを起動する必要があります。このセクションで示している
例は bash のものですが、CakePHP コンソールは Windows 互換でもあります。それでは
bash からコンソールプログラムを動かしてみましょう。これの例ではユーザがすでに
bash プロンプトにログインしており、CakePHP アプリケーションのルートにいること
を想定しています。

CakePHP アプリケーションの中には ``Console`` というディレクトリがあり、
この中にアプリケーションのためのすべてのシェルやタスクを格納します。
またここには以下の実行ファイルがあります。 ::

    $ cd /path/to/cakephp/app
    $ ./Console/cake

システムのパスの中にコアとなる cake 実行ファイル（を含むディレクトリ）を
追加するのもよいでしょう。これでどこにいても cake コマンドが使えるように
なり、新しいプロジェクトを生成する際にも便利です。 ``cake`` をシステム全体
で使えるようにするやり方は :ref:`adding-cake-to-your-path` にあります。

引数なしでコンソールを起動すると、以下のメッセージが表示されます
（訳注：便宜上、一部和訳しています）::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /path/to/cakephp/app/
    ---------------------------------------------------------------
    現在のパス:

     -app: app
     -working: /path/to/cakephp/app
     -root: /path/to/cakephp/
     -core: /path/to/cakephp/core

    パスの変更:

    作業パスは自分のアプリケーションパスと同じである必要があります。
    パスを変更するには '-app' を使います。
    例: -app cakephpへの相対パス または -app /cakephpへの絶対パス

    利用できるシェル:

     acl [CORE]                              i18n [CORE]
     api [CORE]                              import [app]
     bake [CORE]                             schema [CORE]
     command_list [CORE]                     testsuite [CORE]
     console [CORE]                          upgrade [CORE]

    コマンドを実行するには 'cake シェル名 [引数]' にようにタイプします。
    'cake シェル名 help' で特定のコマンドに対するヘルプが表示されます。

先頭部分にはパスに関連する情報が表示されます。これはファイルシステム上の
異なる場所からコンソールを動かしている場合に便利です。

CakePHP コンソールを自分のシステムパスに追加しているユーザが多ければ、cake
コンソールには簡単にアクセスできます。表示されているのは working, root,
app, core のパスで、それぞれコンソールの場所が変更されていてもその位置を
確認できます。作業したい app フォルダをを変更するには単にそこへのパスをcake
コマンドに知らせてやるだけです。次に app フォルダの設定例を示しますが、その際
コンソールのフォルダをあなたの ``PATH`` に追加してあるとものとみなしています。 ::

    $ cake -app /path/to/cakephp/app

指定するパスは、現在の作業ディレクトリへの相対パスでも絶対パスでも構いません。

.. _adding-cake-to-your-path:

システムパスに cake を追加
------------------------------------

\*nix システム (linux, MacOSX) をお使いの場合は、以下の手順により
cake の実行ファイルへのパスをシステムパスに追加します。

#. CakePHP がインストールされている場所に cake の実行ファイルがあることを確認します。
   例えば、以下の場所になります

   ``/Users/mark/cakephp/lib/Cake/Console/cake``

#. 自分のホームディレクトリにある ``.bashrc`` もしくは ``.bash_profile`` をエディタで開き、
   以下を追加します。 ::

    export PATH="$PATH:/Users/mark/cakephp/lib/Cake/Console"

#. bash の設定ファイルをリロードするか、もしくは新しい端末を開きます。
   どこにいても ``cake`` は動くはずです。

Windows Vista もしくは 7 をお使いの場合は、以下の手順に従ってください。

#. CakePHP がインストールされている場所に cake の実行ファイルがあることを確認します。
   ``C:\xampp\htdocs\cakephp\lib\Cake\Console``
#. マイコンピュータからシステムのプロパティを開きます。ショートカットを使う場合は
   Windows キー + Pause もしくは Windows キー + Break です。デスクトップからの場合は
   コンピュータで右クリックしてプロパティを開き、システムの詳細設定をクリックします。
#. 詳細設定タブから環境変数を開きます。
#. システム環境変数の中のPathをダブルクリックして修正します。
#. ``cake`` のインストールパス文字列を;で区切って追加します。その結果は以下のようになります。 ::

    %SystemRoot%\system32;%SystemRoot%;C:\xampp\htdocs\cakephp\Cake\lib\Console;

#. これで Ok をクリックすれば、 ``cake`` がどこからでも動くようになるはずです。

シェルの作成
============

早速コンソールで動くシェルを作ってみましょう。この例ではシンプルな hello world
シェルを作ります。お使いのアプリケーションの ``Console/Command`` ディレクトリで
``HelloShell.php`` を作ってください。その中に以下のコードを書きます。 ::

    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }
    }

シェルクラスの慣習として、クラス名はファイル名に Shell サフィックス（接尾辞）を
付けたものとします。このシェルの中に ``main()`` メソッドを作成します。シェルが
追加コマンド（引数）なしで起動された場合、このメソッドが呼ばれます。この後、
多少コマンドを追加していきますが、現時点では単にシェルを起動してみましょう。
自分のアプリケーションディレクトリ (app) で、以下を実行します。 ::

    Console/cake hello

以下の出力が行われます。 ::

    Welcome to CakePHP v2.0.0 Console
    ---------------------------------------------------------------
    App : app
    Path: /Users/markstory/Sites/cake_dev/app/
    ---------------------------------------------------------------
    Hello world.

すでに述べたように、シェルの ``main()`` メソッドはシェルに他のコマンドや引数が
与えられない場合、常に呼ばれる特別なメソッドです。HelloShell は ``AppShell`` を
拡張していますね。 :ref:`app-controller` と同様に、AppShell はあなたの共通関数や
ロジックのすべてを含む基本的なクラスを提供します。AppShell は
``app/Console/Command/AppShell.php`` を作ることにより定義されます。もしこれが
存在しない場合、CakePHP はビルトインされたものを使います。main メソッドの使い方が
ある程度わかったら、次は以下のように別のコマンドを追加してみましょう。 ::

    class HelloShell extends AppShell {
        public function main() {
            $this->out('Hello world.');
        }

        public function hey_there() {
            $this->out('Hey there ' . $this->args[0]);
        }
    }

このファイルを作って ``Console/cake hello hey_there あなたの名前`` を実行
すると、ご自分の名前が表示されるはずです。public メソッドのうち頭に ``_`` が
付かないものは、コマンドラインから呼び出せます。
直前の例の ``hey_there`` メソッドの中では ``$this->args`` を使っています。
これはコマンドに対して与えられた（指定順序が意味を持つ）引数が、与えられた
順に配列として保持されています。シェルアプリケーションではスイッチや
オプションを使うこともでき、これらは ``$this->params`` もしくは ``param()``
メソッド経由で参照可能ですが、ここではプロパティ名を示すに留めます。

``main()`` メソッドを使っている場合、位置引数は参照できません。これは
第一引数として指定された引数またはオプションが、コマンド名と解釈される
からです。引数やオプションを使いたい場合は、 ``main`` ではない
何か他のメソッド名を使う必要があります。

シェルの中でモデルの利用
------------------------

あなたのアプリケーションのビジネスロジックに、シェルユーティリティの中からアクセスする
必要があることも少なくありません。CakePHP は、それがいとも簡単にできます。
``$uses`` プロパティを設定することで、シェルからアクセスできるモデルの
配列を定義できます。ちょうどコントローラに対してモデルを設定するのと同じように、
定義されたモデルが、あなたのシェルに付属するプロパティとしてロードされます。 ::

    class UserShell extends AppShell {
        public $uses = array('User');

        public function show() {
            $user = $this->User->findByUsername($this->args[0]);
            $this->out(print_r($user, true));
        }
    }

上記のシェルでは username によりユーザを取得し、データベースに格納された情報を
表示します。

シェルのタスク
==============

より高度なコンソールアプリケーションを開発する場合には、
多くのシェル間で共有される再利用可能なクラスとして機能を構成したいでしょう。
タスクによりコマンドをクラスに展開できます。たとえば ``bake`` は、
そのほとんどがタスクにより作られています。 ``$tasks``
プロパティを使ってシェルのタスクを定義できます。 ::

    class UserShell extends AppShell {
        public $tasks = array('Template');
    }


プラグインからタスクを使うには、標準の :term:`プラグイン記法` を使用します。
タスクは ``Console/Command/Task/`` に、クラスにちなんで名付けられたファイルに
格納されます。たとえば新たに 'FileGenerator' タスクを作成したい場合は
``Console/Command/Task/FileGeneratorTask.php`` を作成することになります。

各タスクは、少なくとも ``execute()`` メソッドを実装する必要があります。タスクが
呼び出された時、ShellDispatcher はこのメソッドを呼び出します。タスククラスは
次のようになります。 ::

    class FileGeneratorTask extends Shell {
        public $uses = array('User');
        public function execute() {

        }
    }

シェルはプロパティとしてもタスクにアクセスできますので、
:doc:`/controllers/components` と同様に再利用可能な部品としてタスクを利用できます。 ::

    // Console/Command/SeaShell.php に作成
    class SeaShell extends AppShell {
        public $tasks = array('Sound'); // Console/Command/Task/SoundTask.php に作成
        public function main() {
            $this->Sound->execute();
        }
    }

また、コマンドラインからタスクに直接アクセスすることができます。 ::

    $ cake sea sound

.. note::

    コマンドラインからタスクを直接アクセスするには、タスクは **必ず** シェルクラス
    の $tasks プロパティに含まれている必要があります。このため、もし SeaShell に
    "sound" という名前のメソッドがある場合は、$tasks 配列で指定された Sound タスク
    にある機能を上書きするのでアクセスできなくなりますよという警告が出ます。

TaskCollection による動的なタスクのロード
-----------------------------------------------------------------

タスクコレクションオブジェクトを使って、その場でタスクをロードすることもできます。
以下のようにすると $tasks で宣言されなかったタスクをロードすることができます。 ::

    $Project = $this->Tasks->load('Project');

これによりタスクをロードして ProjectTask インスタンスを返します。
プラグインからタスクをロードすることもできます。 ::

    $ProgressBar = $this->Tasks->load('ProgressBar.ProgressBar');

.. _invoking-other-shells-from-your-shell:

シェルから他のシェルを呼び出し
====================================

シェルからは、もはや `$this->Dispatch` を通した ShellDispatcher への直接の
アクセスができません。あるシェルから他のシェルを呼び出したいケースは多々
あると思います。他のシェルを呼び出すには `Shell::dispatchShell()` を使います。
サブシェル側では引数を受け取るための `argv` が使えます。引数やオプションは
可変引数もしくは文字列として指定できます。 ::

    // 文字列で渡す
    $this->dispatchShell('schema create Blog --plugin Blog');

    // 配列で渡す
    $this->dispatchShell('schema', 'create', 'Blog', '--plugin', 'Blog');

上記は、プラグインのシェルの中からプラグイン用のスキーマを作るために schema シェルを
呼んでいます。

.. _shell-output-level:

コンソール出力のレベル
======================

シェルでは往々にして異なったレベルの冗長出力が必要になります。cron ジョブ
として動いている場合はほとんどの出力は不要です。また、シェルが出力する
メッセージを見たくないというケースもあるでしょう。このような場合、出力を
適切に制御するための出力レベルが使えます。シェルの利用者は、シェルを
呼び出す際に正しいフラグをセットすることで、自分が見たい詳細レベルの設定
ができます。 :php:meth:`Shell::out()` ではデフォルトで３種類の出力を
サポートしています。

* QUIET - 必須のメッセージであり、静かな（必要最小限の）出力モードでも表示される。
* NORMAL - 通常利用におけるデフォルトのレベル。
* VERBOSE - 毎日利用には冗長すぎるメッセージを表示。ただデバッグ時には有用。

以下のように出力を指定できます。 ::

    // すべてのレベルで表示されます。
    $this->out('Quiet message', 1, Shell::QUIET);

    // QUIET 出力時には表示されません。
    $this->out('normal message', 1, Shell::NORMAL);
    $this->out('loud message', 1, Shell::VERBOSE);

    // VERBOSE 出力時のみ表示されます。
    $this->out('extra message', 1, Shell::VERBOSE);

シェルの実行時に ``--quiet`` や ``--verbose`` を使うことで出力を制御できます。
これらのオプションはデフォルトで組み込まれていて、いつでも CakePHP シェル内部の
出力レベルを制御できるように考慮されています。

出力のスタイル
==============

ちょうど HTML のようなタグを埋め込むことで、出力のスタイルを変更することが
できます。ConsoleOutput はこれらのタグを正しい ansi コードシーケンスに変換
したり、ansi コードをサポートしないコンソールではタグを除去します。
スタイルはいくつかビルトインされたものがありますが、自分で作成することも
可能です。ビルトインされたものは以下の通りです。

* ``error`` エラーメッセージ。赤いアンダーライン。
* ``warning`` 警告メッセージ。黄色いテキスト。
* ``info`` 情報メッセージ。水色のテキスト。
* ``comment`` 追加情報。青色のテキスト
* ``question`` 質問事項。シェルが自動的に追加する。

`$this->stdout->styles()` を使ってさらに多くのスタイルを追加できます。
新しいスタイルを追加するには以下のようにします。 ::

    $this->stdout->styles('flashy', array('text' => 'magenta', 'blink' => true));

これで ``<flashy>`` というタグが有効になり、ansi カラーが有効な端末であれば、
``$this->out('<flashy>うわ！</flashy> 何か変になった');`` の場合の表示は
色がマゼンタでブリンクになります。スタイルを定義する際は `text` と `background`
属性として以下の色が指定できます:

* black
* red
* green
* yellow
* blue
* magenta
* cyan
* white

さらに以下のオプションをブール型のスイッチとして指定できます。
値が真の場合に有効になります。

* bold
* underline
* blink
* reverse

スタイルを追加すると ConsoleOutput のすべてのインスタンスでも有効になります。
なので stdout と stderr 両方のオブジェクトでこれらを再定義する必要はありません。

カラー表示を無効化
----------------------

カラー表示はなかなか綺麗ですが、オフにしたい場合や強制的にオンにしたい場合も
あるでしょう。 ::

    $this->stdout->outputAs(ConsoleOutput::RAW);

これは RAW（生の）出力モードにします。RAW 出力モードではすべてのスタイルが
無効になります。モードには３種類あります。


* ``ConsoleOutput::RAW`` - RAW 出力、スタイルや書式設定は行われない。
  これは XML を出力する場合や、スタイルのデバッグを行う際に役立ちます。
* ``ConsoleOutput::PLAIN`` - プレーンテキスト出力。既知のスタイルタグが
  出力から取り除かれます。
* ``ConsoleOutput::COLOR`` - カラーエスケープコードを出力します。

デフォルトでは \*nix システムにおける ConsoleOutput のデフォルトはカラー出力
モードです。Windows では ``ANSICON`` 環境変数がセットされている場合を除き、
プレーンテキストモードがデフォルトです。

オプションの設定とヘルプの生成
==============================

.. php:class:: ConsoleOptionParser

CakePHP におけるオプションのパースは、コマンドラインのそれに比べて少しずつ
変わってきています。2.0 では親しみやすいコマンドラインオプションや引数パーサ
の提供を ``ConsoleOptionParser`` が助けてくれます。

OptionParsers は同時に２つのことを実現します。１つ目は、基本的なバリデー
ションと独自のコードにより、オプションと引数を定義することです。２つ目は、
きれいにフォーマットされたヘルプファイルを生成するためのドキュメントの
提供です。

コンソールのフレームワークは ``$this->getOptionParser()`` を呼び出すことにより
あなたのシェルのオプションパーサを取得します。このメソッドをオーバーライド
することで、オプションパーサがあなたのシェルの期待する入力にマッチするように
なります。さらにサブコマンドオプションパーサを設定すると、サブコマンドと
タスクについて異なったオプションパーサを定義できます。ConsoleOptionParser
は柔軟なインターフェースを実装しており、また複数のオプション／引数を一度に
簡単に設定できるようなメソッドを備えています。 ::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        // パーサの設定
        return $parser;
    }

柔軟なインターフェースによるオプションパーサの設定
--------------------------------------------------

オプションパーサを構成するすべてのメソッドは相互に連結可能です。
これによりオプションパーサ全体を一連のメソッド呼び出しで定義できます。 ::

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->addArgument('type', array(
            'help' => 'フルパスもしくはクラスの型のいずれか。'
        ))->addArgument('className', array(
            'help' => 'CakePHP コアのクラス名（Component, HtmlHelper 等)。'
        ))->addOption('method', array(
            'short' => 'm',
            'help' => __('The specific method you want help on.')
        ))->description(__('Lookup doc block comments for classes in CakePHP.'));
        return $parser;
    }

連結できるのは以下のメソッドです。

- description()
- epilog()
- command()
- addArgument()
- addArguments()
- addOption()
- addOptions()
- addSubcommand()
- addSubcommands()

.. php:method:: description($text = null)

オプションパーサの説明文を取得または設定します。説明文は引数やオプション
の上に表示されます。配列または文字列を渡すことで説明文の値を設定できます。
引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->description(array('１行目', '２行目'));

    // 現在の値を取得する
    $parser->description();

.. php:method:: epilog($text = null)

オプションパーサのエピローグを取得または設定します。エピローグは引数
またはオプション情報の後に表示されます。配列または文字列を渡すことで
エピローグの値を設定できます。引数がない場合は現在の値を返します。 ::

    // 一度に複数行を設定
    $parser->epilog(array('１行目', '２行目'));

    // 現在の値を取得する
    $parser->epilog();

引数の追加
----------

.. php:method:: addArgument($name, $params = array())

コマンドラインツールにおいて、指定順序が意味を持つ引数はよく使われます。
``ConsoleOptionParser`` では指定順序が意味を持つ引数を要求するだけでなく
定義することもできます。指定する際は ``$parser->addArgument();`` で一度に
ひとつずつ設定するか、 ``$parser->addArguments();`` で複数個を同時に
指定するかを選べます。 ::

    $parser->addArgument('model', array('help' => 'bake するモデル'));

引数を作成する際は以下のオプションが指定できます:

* ``help`` この引数に対して表示するヘルプ
* ``required`` この引数が必須かどうか
* ``index`` 引数のインデックス。設定されない場合は引数リストの末尾に位置づけられます。
  同じインデックスを２回指定すると、最初に指定したオプションは上書きされます。
* ``choices`` この引数について有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

必須であると指定された引数が省略された場合、コマンドのパースにおいて
例外が発生します。これにより、引数のチェックをシェルの中で行う必要が
なくなります。

.. php:method:: addArguments(array $args)

複数の引数を１個の配列で持つ場合、 ``$parser->addArguments()`` により
一度に複数の引数を追加できます。 ::

    $parser->addArguments(array(
        'node', array('help' => '生成するノード', 'required' => true),
        'parent' => array('help' => '親ノード', 'required' => true)
    ));

ConsoleOptionParser 上のすべてのビルダーメソッドと同様に、addArguments
も柔軟なメソッドチェインの一部として使えます。

引数の検証
----------

指定順序が意味を持つ引数を作成する場合、 ``required`` フラグを指定できます。
これはシェルが呼ばれた時、その引数が存在しなければならないことを意味します。
さらに ``choices`` を使うことで、その引数が取りうる有効な値の選択肢を制限
できます。 ::

    $parser->addArgument('type', array(
        'help' => 'これとやり取りするノードの型',
        'required' => true,
        'choices' => array('aro', 'aco')
    ));

この例では、必須でかつ入力時に値の正当性チェックが行われるような引数を
作成します。引数が指定されないか、または無効な値が指定された場合は例外が
発生してシェルが停止します。

オプションの追加
----------------

.. php:method:: addOption($name, $options = array())

コマンドラインツールでは、オプションやフラグもまたよく使われます。
``ConsoleOptionParser`` では長い名称と短い別名の両方を持つオプション、
デフォルト値の設定やブール型スイッチの作成などをサポートしています。
オプションは ``$parser->addOption()`` または ``$parser->addOptions()``
により追加します。 ::

    $parser->addOption('connection', array(
        'short' => 'c'
        'help' => 'connection',
        'default' => 'default'
    ));

この例の場合、シェルを起動する際に ``cake myshell --connection=other``,
``cake myshell --connection other``, ``cake myshell -c other``
のいずれかで引数を指定できます。またブール型のスイッチも作れますが、
これらのスイッチは値を消費せず、またその存在はパースされた引数の中
だけとなります。 ::

    $parser->addOption('no-commit', array('boolean' => true));

このオプション指定の場合、 ``cake myshell --no-commit something`` のように
コールされると no-commit 引数が true になり、'something' は位置引数と見なされます。
ビルトインオプションの ``--help``, ``--verbose``, ``--quiet`` もこの
仕組みを利用しています。

オプションを作成する場合、オプションの振る舞いを定義するのに以下が指定できます。

* ``short`` - このオプションを表す１文字の別名。未定義の場合はなしになります。
* ``help`` - このオプションのヘルプ文字列。オプションのヘルプを生成する際に参照されます。
* ``default`` - このオプションのデフォルト値。未定義の場合、デフォルト値は true となります。
* ``boolean`` - 値を持たない単なるブール型のスイッチ。デフォルト値は false です。
* ``choices`` - このオプションで取りうる有効な選択肢。指定しない場合はすべての値が有効となります。
  parse() が無効な値を検出すると、例外が発生します。

.. php:method:: addOptions(array $options)

複数のオプションを１個の配列で持つ場合、 ``$parser->addOptions()``
により一度に複数のオプションを追加できます。 ::

    $parser->addOptions(array(
        'node' => array('short' => 'n', 'help' => '生成するノード'),
        'parent' => array('short' => 'p', 'help' => '親ノード')
    ));

ConsoleOptionParser 上のビルダーメソッドと同様に、addOptions も強力な
メソッドチェーンの一部として使えます。

オプションの検証
----------------

オプションでは位置引数と同様に、値の選択肢を指定できます。オプションに
choices が指定されている場合、それらがそのオプションで取りうる有効な値です。
これ以外の値が指定されると ``InvalidArgumentException`` が発生します。 ::

    $parser->addOption('accept', array(
        'help' => 'What version to accept.',
        'choices' => array('working', 'theirs', 'mine')
    ));

ブール型オプションの使用
------------------------

フラグのオプションを作りたい場合、オプションをブール型として指定できます。
デフォルト値を持つオプションのように、ブール型のオプションもパース済み引数
の中に常に自分自身を含んでいます。フラグが存在する場合それらは true にセットされ、
存在しない場合は false になります。 ::


    $parser->addOption('verbose', array(
        'help' => '冗長出力を有効にする.',
        'boolean' => true
    ));

以下の例のように ``$this->params['verbose']`` の結果が常に参照可能です。
これにより、ブール型のフラグをチェックする際に ``empty()`` や ``isset()`` に
よるチェックをする必要がありません。 ::

    if ($this->params['verbose']) {
        // 何かします
    }

    // 2.7 なら
    if ($this->param('verbose')) {
        // 何かします
    }

ブール型のオプションは常に ``true`` または ``false`` として定義されているので、
それ以上のチェックメソッドを省略できます。

サブコマンドの追加
------------------

.. php:method:: addSubcommand($name, $options = array())

コンソールアプリケーションはサブコマンドから構成されることも多いのですが、
サブコマンド側で特別なオプション解析や独自ヘルプを持ちたいこともあります。
この完全な例が ``bake`` です。Bake は多くの別々のタスクから構成されますが、
各タスクはそれぞれ独自のヘルプとオプションを持っています。
``ConsoleOptionParser`` を使ってサブコマンドを定義し、それらに固有のオプション
パーサを提供できるので、シェルはそれぞれのタスクについてコマンドをどう
解析すればよいのかを知ることができます。 ::

    $parser->addSubcommand('model', array(
        'help' => 'Bake a model',
        'parser' => $this->Model->getOptionParser()
    ));

上の例では、シェルのタスクに対してヘルプやそれに特化したオプションパーサ
を提供方法を示しています。タスクの ``getOptionParser()`` を呼ぶことで、
オプションパーサの複製をしたり、シェル内の関係を調整する必要がなくなります。
この方法でサブコマンドを追加することには２つの利点があります。
まず生成されたヘルプの中で簡単にサブコマンドを文書化できること、そして
サブコマンドのヘルプに簡単にアクセスできることです。前述のやり方で生成
したサブコマンドを使って ``cake myshell --help`` とやると、サブコマンドの
一覧が出ます。また ``cake myshell model --help`` とやると、model タスクだけの
ヘルプが表示されます。

サブコマンドを定義する際は、以下のオプションが使えます:

* ``help`` - サブコマンドのヘルプテキスト
* ``parser`` - サブコマンドの ConsoleOptionParser。これによりメソッド固有の
  オプションパーサを生成します。サブコマンドに関するヘルプが生成される際、
  もしパーサが存在すればそれが使われます。パーサを配列として指定することも
  できます。その場合は :php:meth:`ConsoleOptionParser::buildFromArray()` と
  互換です。

サブコマンドの追加も強力なメソッドチェーンの一部として使えます。

配列から ConsoleOptionParser の構築
---------------------------------------

.. php:method:: buildFromArray($spec)

前述のように、サブコマンドのオプションパーサを作成する際は、そのメソッド
に対するパーサの仕様を配列として定義できます。これによりすべてが配列として
扱えるので、サブコマンドパーサの構築が容易になります。 ::

    $parser->addSubcommand('check', array(
        'help' => __('Check the permissions between an ACO and ARO.'),
        'parser' => array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the ARO "),
                __("specified (and its children, if any) will have ALLOW access to the"),
                __("specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        )
    ));

パーサの仕様の中では ``definition``, ``arguments``, ``options``, ``epilog``
のためのキーを定義できます。配列形式ビルダーの内部には ``subcommands`` は定義
できません。引数とオプションの値は
:php:func:`ConsoleOptionParser::addArguments()` と
:php:func:`ConsoleOptionParser::addOptions()` が利用する書式に従ってください。
また、 buildFromArray を単独で使ってオプションパーサを構築することも可能です。 ::

    public function getOptionParser() {
        return ConsoleOptionParser::buildFromArray(array(
            'description' => array(
                __("Use this command to grant ACL permissions. Once executed, the "),
                __("ARO specified (and its children, if any) will have ALLOW access "),
                __("to the specified ACO action (and the ACO's children, if any).")
            ),
            'arguments' => array(
                'aro' => array('help' => __('ARO to check.'), 'required' => true),
                'aco' => array('help' => __('ACO to check.'), 'required' => true),
                'action' => array('help' => __('Action to check'))
            )
        ));
    }

シェルからヘルプを取得
--------------------------

ConsoleOptionParser を追加することにより、一貫性のある方法でシェルからヘルプを
取得します。すべてのコアのシェル、および ConsoleOptionParser を実装したいかなる
シェルからも、 ``--help`` または -``h`` オプションを使うことでヘルプを参照
できます。::

    cake bake --help
    cake bake -h

このいずれでも bake のヘルプを生成します。シェルがサブコマンドをサポートしている
場合は、それらに関するヘルプを同様の書式で取得可能です。 ::

    cake bake model --help
    cake bake model -h

これは bake の model タスクに関するヘルプを表示します。

ヘルプを XML で取得
-----------------------

自動ツールや開発ツールをビルドするのに CakePHP との対話処理を必要とする場合、
ヘルプを機械がパースできる形式で取得できると便利です。ConsoleOptionParser
に以下の引数を追加することで、ヘルプをxmlで出力できます。 ::

    cake bake --help xml
    cake bake -h xml

この例は生成されたヘルプ、オプション、引数そして選択されたシェルのサブコマンド
に関するドキュメントを XML で返します。XML ドキュメントの例としては以下のように
なります。

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

シェル／CLI におけるルーティング
================================

コマンドライン・インターフェース (CLI)、特にあなたのシェルやタスクでは、
``env('HTTP_HOST')`` やその他のウェブブラウザ固有の変数がセットされていません。

``Router::url()`` を使ってレポートを作成したり電子メールを送ったりする場合、
それらにはデフォルトホスト ``http://localhost/`` が構成に含まれており、
そのため結果として無効な URL となってしまいます。こういったケースでは、
ドメインを手作業で設定する必要があります。これを、たとえばブート
ストラップまたは config で、コンフィグ値 ``App.fullBaseURL`` を使って
設定できます。

電子メールを送る場合は、CakeEmail クラスでメールを送る際のホストを指定する
必要があります。 ::

    $Email = new CakeEmail();
    $Email->domain('www.example.org');

これにより生成されるメッセージ ID は有効で、また送信元ドメイン名にも合致
したものになります。

シェル API
==========

.. php:class:: AppShell

    AppShell はあなたのすべてのシェルの基底クラスとして使えます。これは
    :php:class:`Shell` を継承し、また ``Console/Command/AppShell.php``
    として置かれている必要があります。

.. php:class:: Shell($stdout = null, $stderr = null, $stdin = null)

    Shell はすべてのシェルの基底クラスであり、ユーザの入力と対話するための
    多くの関数を提供し、また生成されたエラーをテキストとして出力します。

.. php:attr:: tasks

    このシェル／タスクでロードしたいタスクの配列。

.. php:attr:: uses

    このシェル／タスクでロードしたいモデルの配列。

.. php:method:: clear()

    出力バッファの中身をクリアします。

.. php:method:: param($name)

    オプション・パラメータの値を取得します。パラメータが存在しない場合は、 null を返します。

    .. versionadded:: 2.7

.. php:method:: createFile($path, $contents)

   :param string $path: 生成したいファイルへの絶対パス。
   :param string $contents: ファイルに出力したいコンテンツ。

   与えられたパスでファイルを生成します。ファイルが存在する場合、対話的
   シェルであれば警告が発せられ、上書きするかどうか聞かれます。シェルの
   interactive プロパティが false の場合、質問は行われず、単にファイルは上書きされます。

.. php:method:: dispatchShell()

    コマンドから別のシェルに制御を移します。
    :php:meth:`Controller::requestAction()` と似ていますが、他のシェルから
    シェルを起動することを目的としています。

    参照 :ref:`invoking-other-shells-from-your-shell`.

.. php:method:: err($message = null, $newlines = 1)

    :param string $message: 表示するメッセージ。
    :param integer $newlines: メッセージの後の改行する数。

    ``stderr`` へ出力するメソッドです。 :php:meth:`Shell::out()` のように動作します。

.. php:method:: error($title, $message = null)

    :param string $title: エラーのタイトル
    :param string $message: オプションのエラーメッセージ

    整形されたエラーメッセージを表示し、ステータスコード 1 でアプリケーションを終了します。

.. php:method:: getOptionParser()

    シェルのサブ・パーサーと共に :php:class:`ConsoleOptionParser` オブジェクトを返します。

.. php:method:: hasMethod($name)

    シェルに与えられた名前を持つ呼び出し可能なメソッドがあるかどうかを調べます。

.. php:method:: hasTask($task)

    シェルに与えられた名前を持つタスクがあるかどうかを調べます。

.. php:method:: hr($newlines = 0, $width = 63)

    :param int $newlines: 線を引く前に置くべき改行の数。
    :param int $width: 線の長さ。

    いくつかの改行の後に水平線を引きます。

.. php:method:: in($prompt, $options = null, $default = null)

    :param string $prompt: 利用者に表示するプロンプト。
    :param array $options: 入力の選択肢。利用者がこの中から選ぶ。無効なオプションを選んだ場合、
        再度の入力が求められる。
    :param string $default: もしあれば、これをデフォルトのオプションとする。

    このメソッドはユーザとの対話を助ける、対話的なシェルを作成します。
    プロンプトに対するユーザの入力値を返し、またユーザに有効な選択肢を提示します。 ::

        $selection = $this->in('Red or Green?', array('R', 'G'), 'R');

    入力値のバリデーションでは、大文字小文字は区別されません。

.. php:method:: initialize()

    シェルを初期化し、サブクラスのコンストラクタとして動作します。
    またシェルの実行に先立って、タスクの設定を行います。

.. php:method:: loadTasks()

    :php:attr:`Shell::$tasks` で public として定義されているタスクをロードします。

.. php:method:: nl($multiplier = 1)

    :param int $multiplier: 改行動作を繰り返す回数

    指定数の改行を出力します。

.. php:method:: out($message = null, $newlines = 1, $level = Shell::NORMAL)

    :param string $message: 表示するメッセージ。
    :param integer $newlines: メッセージの後に出力する改行の数。
    :param integer $level: このメッセージを表示するべき :ref:`shell-output-level` の最大値。

    ユーザへの出力を生成するためのもっとも普通のやり方です。
    レベルを指定することで、シェルの出力の度合いを制限できます。
    out() ではカラー出力タグも出力できますので、お使いのシステムが
    サポートしていれば色付きの出力が行えます。テキストのカラーリング
    のためにいくつか組み込みのスタイルを持っており、また自分でスタイルを
    定義することもできます。

    * ``error`` エラーメッセージ。
    * ``warning`` 警告メッセージ。
    * ``info`` 情報メッセージ。
    * ``comment`` 追加メッセージ。
    * ``question`` マゼンタのテキスト。ユーザへのプロンプトに使われます。

    スタイルタグでメッセージを書式化することにより、スタイルを適用した出力が行えます。 ::

        $this->out('<warning>これはファイルシステムからデータを消去します.</warning>');

    \*nix システムのデフォルトでは、ConsoleOutput オブジェクトのデフォルトは
    カラー出力です。Windows システムでは、 ``ANSICON`` 環境変数が存在しない
    限りはプレインテキスト出力がデフォルトです。

.. php:method:: overwrite($message = null, $newlines = 1, $size = null)

    :param string $message: 表示するメッセージ
    :param integer $newlines: メッセージの後に出力する改行の数
    :param integer $size: 上書きするバイト数

    プログレスバーの生成や大量の行出力を避けるのに便利なメソッドです。

    注意: 改行コードを含む文字列は上書きできません。

    .. versionadded:: 2.6

.. php:method:: runCommand($command, $argv)

    指定された引数によりシェルを実行します。

    タスクへの呼び出しを代行し、クラス内部のメソッドを解決します。
    コマンドは以下の順序で検索されます。

    - シェル上のメソッド
    - タスク名とのマッチング
    - main() メソッド

    シェルが main() メソッドを実装していれば、メソッドの呼び出しに失敗した
    ものはすべて、argv に元々のメソッド名を入れた形で main() に送られます。

.. php:method:: shortPath($file)

    ファイルの絶対パスを読みやすくします。

.. php:method:: startup()

    シェルを起動してウェルカムメッセージを表示します。コマンドや main の実行に
    先立ってチェックや設定を可能とします。

    ウェルカム情報を出力したくない場合は、このメソッドをオーバーライドします。
    そうしない場合、そこまでのコマンドの流れを変更します。

.. php:method:: wrapText($text, $options = array())

    テキストブロックを折り返します。幅とインデント文字列を設定できます。

    :param string $text: 整形するテキスト
    :param array $options:

        * ``width`` 折り返し幅。デフォルトは 72。
        * ``wordWrap`` 単語の区切り（スペース）のみで折り返します。デフォルトは true。
        * ``indent`` 指定された文字列でインデントします。デフォルトは null。

その他のトピック
================

.. toctree::
    :maxdepth: 1

    console-and-shells/helpers
    console-and-shells/cron-jobs
    console-and-shells/completion-shell
    console-and-shells/code-generation-with-bake
    console-and-shells/schema-management-and-migrations
    console-and-shells/i18n-shell
    console-and-shells/acl-shell
    console-and-shells/testsuite-shell
    console-and-shells/upgrade-shell

.. meta::
    :title lang=ja: シェルとタスクとコンソール
    :keywords lang=ja: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,shells,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
