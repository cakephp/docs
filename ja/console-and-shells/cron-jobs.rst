cron ジョブに登録してシェルを実行する
#####################################

通常シェルは、ニュースレターを送ったり、たまにデータベースをクリーンアップしたりすることを、
cron ジョブとして実行します。

このように簡単な設定で行えます。 ::

      */5  *    *    *    *  cd /full/path/to/app && bin/cake myshell myparam
    # *    *    *    *    *  実行するコマンド
    # │    │    │    │    │
    # │    │    │    │    │
    # │    │    │    │    \───── 曜日 (0 - 6) (0 から 6 が日曜日から土曜日、
    # |    |    |    |           もしくは曜日名)
    # │    │    │    \────────── 月 (1 - 12)
    # │    │    \─────────────── 日 (1 - 31)
    # │    \──────────────────── 時 (0 - 23)
    # \───────────────────────── 分 (0 - 59)

詳しくはこちら: http://ja.wikipedia.org/wiki/Crontab

.. tip::

    cron ジョブで画面出力を非表示にするために ``-q`` (または `--quiet`) を使用してください。

共有ホスティング上の cron ジョブ
--------------------------------

いくつかの共有ホスティング上で ``cd /full/path/to/root && bin/cake myshell myparam``
は動作しません。代わりに ``php /full/path/to/root/bin/cake.php myshell myparam``
が使用できます。

.. note::
     php.ini の中で ``register_argc_argv = 1`` を含めることによって、
     register_argc_argv を有効にしなければなりません。グローバルに register_argc_argv
     を変更できない場合、 ``-d register_argc_argv=1`` パラメーターをつけることで、
     cron ジョブに独自の設定ファイル (php.ini) を指定することができます。例: ``php
     -d register_argc_argv=1 /full/path/to/root/bin/cake.php myshell
     myparam``

.. meta::
    :title lang=ja: cron ジョブに登録してシェルを実行する
    :keywords lang=ja: cron ジョブ,bash script,crontab
