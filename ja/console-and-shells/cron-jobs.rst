cronjobに登録してシェルを実行する
#################################

通常シェルは、メールを送ったり、たまにデータベースをクリーンアップしたりすることを、cronjobとして実行します。
しかし、もし ``~/.profile`` の中で、PATH環境変数にCakeのコンソールへのパスを追加していたとすれば、crontabでは動きません。

下に示すBASHスクリプトは、シェルを呼び出して必要なパスを＄PATHに追加します。
これをvendorsフォルダ以下に'cakeshell'としてコピーして、忘れずに実行してください。
(``chmod +x cakeshell``)

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

このようにして呼び出します。 ::

    $ ./Console/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console

``-cli`` パラメータでphp cliの実行パスを渡して、 ``-console`` パラメータでCakePHPのコンソールのパスを渡します。

このようにしてcronjobに登録します。 ::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console -app /full/path/to/app

crontabをデバッグする簡単なやり方として、シェルの出力をログファイルにダンプする方法があります。 ::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/2.x.x/lib/Cake/Console -app /full/path/to/app >> /path/to/log/file.log 2>&1
