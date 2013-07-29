cronjobに登録してシェルを実行する
#################################

通常シェルは、メールを送ったり、たまにデータベースをクリーンアップしたりすることを、cronjobとして実行します。
しかし、もし ``~/.profile`` の中で、PATH環境変数にCakeのコンソールへのパスを追加していたとすれば、crontabでは動きません。

下に示すBASHスクリプトは、シェルを呼び出して必要なパスを＄PATHに追加します。
これをvendorsフォルダ以下に'cakeshell'としてコピーして、忘れずに実行してください。
(``chmod +x cakeshell``)

::
    # m h dom mon dow command
    */5 *   *   *   * cd /full/path/to/app && Console/cake myshell myparam

.. meta::
    :title lang=ja: cronjobに登録してシェルを実行する
    :keywords lang=en: cronjob,bash script,crontab
