コンテンツ管理チュートリアル
############################

このチュートリアルは簡単な :abbr:`CMS (Content Management System)` アプリケーションを作ります。
はじめに CakePHP のインストールを行い、データベースの作成、
そしてアプリケーションを素早く仕上げるための CakePHP が提供するツールを使います。

必要なもの:

#. データベースサーバー。このチュートリアルでは MySQL サーバーを使います。
   データベースを作成するための SQL の知識が必要です。CakePHP は、それを前提としています。
   MySQL を使用するとき、 PHP で ``pdo_mysql`` が有効になっていることを確認してください。
#. 基礎的な PHP の知識。

始める前に、最新の PHP バージョンであることを確認してください。

.. code-block:: bash

    php -v

最低でも PHP |minphpversion| (CLI) 以上をインストールしてください。
あなたのウェブサーバーの PHP バージョンもまた、 |minphpversion| 以上でなければなりません。
そして、コマンドラインインターフェイス (CLI) の PHP バージョンと同じバージョンにしてください。

CakePHP の取得
==============

最も簡単な CakePHP のインストール方法は Composer を使う方法です。Composer は、
ターミナルやコマンドラインプロンプトから CakePHP をインストールのシンプルな方法です。
まだ準備ができていない場合、最初に Composer をダウンロードとインストールが必要です。
cURL がインストールされていたら、次のように実行するのが簡単です。

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

もしくは `Composer のウェブサイト <https://getcomposer.org/download/>`_
から ``composer.phar`` をダウンロードすることができます。

そして、インストールディレクトリーからターミナルに次の行を入力するだけで、現在の作業ディレクトリーの
**cms** ディレクトリーに CakePHP アプリケーションのスケルトンをインストールすることができます。

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app cms

`Composer Windows Installer <https://getcomposer.org/Composer-Setup.exe>`_
をダウンロードして実行した場合、インストールディレクトリー (例えば、 C:\\wamp\\www\\dev\\cakephp3)
からターミナルに次の行を入力してください。

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app cms

Composer を使うメリットは、 正しいファイルパーミッションの設定や、 **config/app.php**
ファイルの作成などのように、自動的に完全なセットアップをしてくれることです。

CakePHP をインストールする他の方法があります。 Composer を使いたくない場合、
:doc:`/installation` セクションをご覧ください.

CakePHP のダウンロードやインストール方法にかかわらず、いったんセットアップが完了すると、
ディレクトリー構成は次のようになります。 ::

    /cms
      /bin
      /config
      /logs
      /plugins
      /src
      /tests
      /tmp
      /vendor
      /webroot
      .editorconfig
      .gitignore
      .htaccess
      .travis.yml
      composer.json
      index.php
      phpunit.xml.dist
      README.md

CakePHP のディレクトリー構造がどのように働くかを学ぶのにいい機会かもしれません。
:doc:`/intro/cakephp-folder-structure` セクションをご覧ください。

このチュートリアルで迷ったら、 `GitHub <https://github.com/cakephp/cms-tutorial>`_
で完成した結果を見ることができます。

インストールの確認
===================

デフォルトホームページを確認することで、インストールが正しいことをざっと確かめることができます。
その前に、開発用サーバーを起動する必要があります。

.. code-block:: bash

    cd /path/to/our/app

    bin/cake server

.. note::

   　Windows では、このコマンドは ``bin\cake server`` (バックスラッシュ) です。

これで、 8765 ポートで PHP のビルトインウェブサーバーが起動します。ウェルカムページを見るために
**http://localhost:8765** をウェブブラウザーで開いてください。CakePHP がデータベース接続が
可能かどうか以外は、すべての確認事項が緑色のコック帽になるべきです。そうでなければ、PHP 拡張の
追加のインストールやディレクトリーのパーミッション設定が必要かもしれません。

次に、 :doc:`データベースの構築と最初のモデルの作成 </tutorials-and-examples/cms/database>`
をします。
