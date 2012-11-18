CakePHP コンソール
##################

この章ではコマンドラインで CakePHP
を利用する方法について説明します。cron
ジョブや他のコマンドラインスクリプトで CakePHP の MVC
クラスにアクセスする必要がある場合、この章が役立ちます。

PHP
は、ファイルシステムやアプリケーションに対するスムーズなインターフェースとなる、強力な
CLI クライアントを提供しています。CakePHP
のコンソールはシェルスクリプトを作成するためのフレームワークを提供します。コンソールはディスパッチャ形式のセットアップを使用して、シェルやタスクをロードし、そのパラメータを処理します。

コンソールを使用する場合は、PHP
のコマンドライン(CLI)版が利用可能な状態になっている必要があります。

設定する前に、CakePHP
コンソールを実行することができることを確認しましょう。まず始めに、システムシェルを起動する必要があります。この章にある例は
bash を使用していますが、CakePHP コンソールは Windows
でも同様に動作します。では、bash
からコンソールプログラムを実行しましょう。この例はユーザが現在 bash
プロンプトにログインしていて、CakePHP
をインストールしたルートにいると仮定しています。

ひとまず、次のようにコンソールを実行することができます

::

    $ cd /my/cake/app_folder
    $ ../cake/console/cake

しかし、より好ましい使用法はコンソールディレクトリをパスに追加することです。そうすると
cake コマンドをどこでも使用できます:

::

    $ cake

コンソールプログラムを引数なしで実行すると、次のようなヘルプメッセージが表示されます:

::

    Hello user,
     
    Welcome to CakePHP v1.2 Console
    ---------------------------------------------------------------
    Current Paths:
     -working: /path/to/cake/
     -root: /path/to/cake/
     -app: /path/to/cake/app/
     -core: /path/to/cake/
     
    Changing Paths:
    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp
     
    Available Shells:
     
     app/vendors/shells/:
             - none
     
     vendors/shells/:
             - none
     
     cake/console/libs/:
             acl
             api
             bake
             console
             extract
     
    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

出力された最初の情報はパスについてです。これは異なるファイルシステムからコンソールを実行している場合に特に役立ちます。

多くのユーザは CakePHP
コンソールをシステムパスに追加すると簡単にアクセスすることができるようになります。working,
root, app, core
パスを出力するとコンソールがどこを変更したかがわかります。app
フォルダを変更するために、第1引数として cake
コマンドにパスを渡すことができます。次の例は app
フォルダの指定方法を示しています。既に PATH
にコンソールフォルダを追加していることを仮定しています:

::

    $ cake -app /path/to/app

パスは、現在のワーキングディレクトリからの相対パスか絶対パスで指定します。

シェルやタスクを作成する
========================

 

独自のシェルを作成する
----------------------

コンソールで使用するシェルを作成しましょう。この例では、‘report'
シェルを作成します。これはモデルのデータを出力します。まず始めに
/vendors/shells に report.php を作成します。

::

    <?php 
    class ReportShell extends Shell {
        function main() {}
    }
    ?>

ここからシェルを実行することができますが、十分ではありません。シェルにモデルを追加して、なんらかのレポートを作成することができます。これはコントローラ内でするのと同じようにできます:
$uses 変数にモデル名を追加します

::

    <?php
    class ReportShell extends Shell {
        var $uses = array('Order');

        function main() {
        }
    }
    ?>

$uses 配列にモデルを追加すると、main()
メソッドで使用できます。この例では、Order モデルは新しいシェルの main()
メソッドで $this->Order としてアクセスできます。

このシェルで使用するロジックの例です:

::

    class ReportShell extends Shell {
        var $uses = array('Order');
        function main() {
            //Get orders shipped in the last    month
            $month_ago = date('Y-m-d H:i:s',    strtotime('-1 month'));
            $orders =    $this->Order->findAll("Order.shipped >= '$month_ago'");

            //Print out each order's information
            foreach($orders as $order) {
                $this->out('Order date:  ' .    $order['created'] . "\n");
                $this->out('Amount: $' .    number_format($order['amount'], 2) . "\n");
                $this->out('----------------------------------------' .    "\n");
         
                $total += $order['amount'];
            }

            //Print out total for the selected orders
            $this->out("Total: $" .    number_format($total, 2) . "\n"); 
        }
    }

このコマンドを実行することでレポートを実行することができます。（cake
コマンドが PATH にある場合）:

::

    $ cake report 

レポートは /vendor/shells/ の .php
拡張子がないシェルファイル名です。次のようになります。:

::

    Hello user,
       Welcome to    CakePHP v1.2 Console
       ---------------------------------------------------------------
       App : app
       Path:    /path/to/cake/app
       ---------------------------------------------------------------
       Order date:    2007-07-30 10:31:12
       Amount:    $42.78
       ----------------------------------------
       Order date:    2007-07-30 21:16:03
       Amount:    $83.63
       ----------------------------------------
       Order date:    2007-07-29 15:52:42
       Amount:    $423.26
       ----------------------------------------
       Order date:    2007-07-29 01:42:22
       Amount:    $134.52
       ----------------------------------------
       Order date:    2007-07-29 01:40:52
       Amount:    $183.56
       ----------------------------------------
       Total:    $867.75

タスク
------

タスクはシェルのちょっとした拡張です。これを使用してシェル間でロジックを共有でき、特別な
$tasks クラス変数を使用してシェルに追加されます。たとえばコア bake
シェルでは、いくつかのタスクが定義されています:

::

    <?php 
    class BakeShell extends Shell {
       var $tasks = array('Project', 'DbConfig', 'Model', 'View', 'Controller');
    }
    ?>

タスクは、/vendors/shells/tasks/
内で次にクラス名のファイルに保存されます。新しく ‘cool’
タスクを作成しているとします。CoolTask クラス（Shell を継承します）は
/vendors/shells/tasks/cool.php に置きます。

各タスクはすくなくとも execute() メソッドを実装する必要があります。 -
シェルはタスクロジックを開始するためにこのメソッドを呼び出します。

::

    <?php
    class SoundTask extends Shell {
       var $uses = array('Model'); // コントローラ変数 $uses と同じ
       function execute() {}
    }
    ?>

シェルクラス内のタスクにアクセスし、実行できます:

::

    <?php 
    class SeaShell extends Shell // /vendors/shells/sea.php にあります
    {
       var $tasks = array('Sound'); // /vendors/shells/tasks/sound.php にあります
       function main() {}
    }
    ?>

SeaShell クラスの “sound” というメソッドは、$tasks 配列で指定された
Sound タスクの機能にアクセスする機能をオーバーライドします。

コマンドラインから直接タスクにアクセスできます:

::

    $ cake sea sound

Running Shells as cronjobs
==========================

A common thing to do with a shell is making it run as a cronjob to clean
up the database once in a while or send newsletters. However, when you
have added the console path to the PATH variable via ``~/.profile``, it
will be unavailable to the cronjob.

The following BASH script will call your shell and append the needed
paths to $PATH. Copy and save this to your vendors folder as 'cakeshell'
and don't forget to make it executable. (``chmod +x cakeshell``)

::

    #!/bin/bash
    TERM=dumb
    export TERM
    cmd="cake"
    while [ $# -ne 0 ]; do
        if [ "$1" = "-cli" ] || [ "$1" = "-console" ]; then 
            PATH=$PATH:$2
            shift
        else
            cmd="${cmd} $1"
        fi
        shift
    done
    $cmd

You can call it like:

::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

The ``-cli`` parameter takes a path which points to the php cli
executable and the ``-console`` parameter takes a path which points to
the CakePHP console.

As a cronjob this would look like:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app

A simple trick to debug a crontab is to set it up to dump it's output to
a logfile. You can do this like:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app >> /path/to/log/file.log

