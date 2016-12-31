.. _upgrade-shell:

Upgrade シェル
################

upgrade シェルは、 CakePHP アプリケーションを 1.3 から 2.0 へアップグレードするのに役立ちます。

全てのアップグレード工程を実行するには::

    ./Console/cake upgrade all

まず --dry-run でファイルの更新せずにシェルの予行演習を確認したい場合::

    ./Console/cake upgrade all --dry-run

コマンドを実行してプラグインをアップグレードするには::

    ./Console/cake upgrade all --plugin YourPluginName

アップグレード工程をそれぞれ個別に実行できます。
コマンドを実行して全ての利用可能な工程を見るには::

    ./Console/cake upgrade --help

詳しくは `API ドキュメント <https://api.cakephp.org/2.6/class-UpgradeShell.html>`_
を参照してください。

アプリのアップグレード
-----------------------

これから upgrade シェルを使った CakePHP 1.3 アプリの 2.x へのアップグレードの手伝いを
案内します。 1.3 アプリの構造は、おそらく以下のようになっています。 ::

    mywebsite/
        app/             <- アプリ
        cake/            <- CakePHP の 1.3 バージョン
        plugins/
        vendors/
        .htaccess
        index.php

最初に CakePHP の最新バージョンを ``mywebsite`` の外のフォルダに、 ``cakephp`` という
名前でダウンロードか ``git clone`` してください。ダウンロードした ``app`` フォルダを
既存の app フォルダに上書きはしません。このタイミングで既存のフォルダをバックアップしましょう。
例： ``cp -R app app-backup`` 。

新しい CakePHP バージョンをアプリにセットアップするために ``cakephp/lib`` フォルダを
``mywebsite/lib`` にコピーしてください。例: ``cp -R ../cakephp/lib .`` 。
コピーの代わりにシンボリックリンクしても良いです。 例: ``ln -s /var/www/cakephp/lib`` 。

upgrade シェルを実行する前に、新しいコンソールスクリプトが必要です。
``cakephp/app/Console`` フォルダを ``mywebsite/app`` にコピーしてください。
例: ``cp -R ../cakephp/app/Console ./app`` 。

フォルダ構成は、以下のようになっているはずです ::

    mywebsite/
        app/              <- アプリ
            Console/      <- コピーされた app/Console フォルダ
        app-backup/       <- アプリのバックアップ
        cake/             <- CakePHP の 1.3 バージョン
        lib/              <- CakePHP の 2.x バージョン
            Cake/
        plugins/
        vendors/
        .htaccess
        index.php

``app`` フォルダ内に ``cd`` することで upgrade シェルが実行できます。
コマンドを実行する::

    ./Console/cake upgrade all

これは、 2.x へアプリをアップグレードするのに **最も** 役に立ちます。アップグレードされた
``app`` フォルダ内を確認してください。もし、全てがうまくいったらお祝いしつつ
``mywebsite/cake`` を削除しましょう。 2.x にようこそ!


.. meta::
    :title lang=ja: .. _upgrade-shell:
    :keywords lang=ja: api docs,shell
