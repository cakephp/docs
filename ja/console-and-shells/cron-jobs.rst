cronjobに登録してシェルを実行する
#################################

通常シェルは、ニュースレターを送ったり、たまにデータベースをクリーンアップしたりすることを、
cronjobとして実行します。

このように簡単な設定で行えます。 ::

    # m h dom mon dow command
    */5 *   *   *   * cd /full/path/to/app && Console/cake myshell myparam

.. meta::
    :title lang=ja: cronjobに登録してシェルを実行する
    :keywords lang=ja: cronjob,bash script,crontab
