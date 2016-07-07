応用インストール
################

PEAR インストーラで CakePHP をインストール
==========================================

CakePHP はあなたが PEAR インストーラを使用してインストールできるように
PEAR パッケージを公開しています。PEAR インストーラでインストールすると、
複数のアプリケーションで CakePHP ライブラリを共有するのが簡単になります。
PEAR で CakePHP をインストールするには、次の手順を実行する必要があります。 ::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    PEAR で CakePHP をインストールするとき、システムによっては ``sudo`` が必要になります。

PEAR で CakePHP をインストールした後、PEAR が正しく設定されていれば、
新しいアプリケーションを作成するために ``cake`` コマンドが使えるようになっています。
CakePHP は PHP の ``include_path`` 上に配置されるので、とくに他の変更を行う必要はありません。

Composer で CakePHP をインストール
==================================

始める前に、最新の PHP バージョンであることを確認してください。

.. code-block:: bash

    php -v

少なくとも PHP 5.3.0 (CLI) 以上がインストールされていなければなりません。
ウェブサーバー版の PHP もまた 5.3.0 以上でなければりませんし、
コマンドラインインターフェース (CLI) 版の PHP と同じバージョンがベストです。

Composer のインストール
-----------------------

Composer は、PHP 5.3 以上向けの依存関係管理ツールです。これは、PEAR インストーラが抱える
問題の多くを解決し、いろんなバージョンのライブラリをシンプルに管理できるようにします。
`Packagist <https://packagist.org/>`_ は、Composer でインストール可能なパッケージの
メインリポジトリです。 CakePHP は、Packagist 上に公開された時、
`Composer <http://getcomposer.org>`_ を使用してインストールすることができます。

- Linux や Mac OS X に Composer をインストール

  #. `公式の Composer ドキュメント <https://getcomposer.org/download/>`_ に書かれた
     インストーラスクリプトを実行し、Composer をインストールするために指示に従ってください。
  #. composer.phar を指定したパスのディレクトリに移すために以下のコマンドを実行してください。 ::

       mv composer.phar /usr/local/bin/composer

- Windows に Composer をインストール

  Windows 環境なら、 `こちら <https://github.com/composer/windows-setup/releases/>`__ から
  Windows インストーラをダウンロードできます。Composer の Windows インストーラについての詳細は、
  `README <https://github.com/composer/windows-setup>`__ をご覧ください。

CakePHP プロジェクトの作成
--------------------------

CakePHP をインストールする前に ``composer.json`` ファイルをセットアップしましょう。
CakePHP アプリケーションのための composer.json ファイルは次のようになります。 ::

    {
        "name": "example-app",
        "require": {
            "cakephp/cakephp": "2.8.*"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

この JSON を ``composer.json`` としてプロジェクトの APP ディレクトリに保存します。
次に、composer.phar ファイルをプロジェクト内にダウンロードしてください。
Composer をダウンロードしたら、 CakePHP をインストールしましょう。
``composer.json`` と同じディレクトリで次のコマンドを実行します。 ::

    $ php composer.phar install

Composer の実行が終わると、ディレクトリ構造は次のようになっていると思います。 ::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            cakephp/

さあ、アプリケーションのスケルトンの残りの部分を生成する準備ができました。 ::

    $ Vendor/bin/cake bake project <path to project>

デフォルトでは、 ``bake`` は :php:const:`CAKE_CORE_INCLUDE_PATH` をハードコードするようになっています。
アプリケーションの移植性を高めるためには、 ``webroot/index.php`` を修正し、
``CAKE_CORE_INCLUDE_PATH`` を相対パスに変更しましょう。 ::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . DS . APP_DIR . DS . 'Vendor' . DS . 'cakephp' . DS . 'cakephp' . DS . 'lib'
    );

.. note::

    もし、あなたのアプリケーションのためにユニットテストを作成する予定があるなら、
    ``webroot/test.php`` も同様の変更が必要になります。

Composer で他のライブラリをインストールしている場合は、
オートローダーを設定して composer のオートローダーで起こる問題を回避してください。
``Config/bootstrap.php`` ファイルに次の行を追加します。 ::

    // Composer の autoload を読み込み
    require APP . 'Vendor/autoload.php';

    // CakePHP のオートローダーをいったん削除し、Composer より先に評価されるように先頭に追加する
    // http://goo.gl/kKVJO7 を参照
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

これで、Composer でインストールした CakePHP が機能する CakePHP アプリケーションができました。
ソースコードの残りの部分と composer.json と composer.lock ファイルを保存しておいてください。

複数のアプリケーションで CakePHP を共有する
===========================================

時には、CakePHP のディレクトリをファイルシステムの別な場所に配置したいと思う場合があるかもしれません。
共有しているホストの制限であったり、複数のアプリが同じ CakePHP のライブラリを共有したい場合などです。
このセクションでは、どうやって CakePHP のディレクトリをファイルシステム内に分散配置できるのかを説明します。

まず、CakePHP アプリケーションには三つの主要な部分があることを意識しましょう:

#. CakePHP のコアライブラリは、 /lib/Cake の中です。
#. アプリケーションコードは、/app の中です。
#. アプリケーションのウェブルートは、通常 /app/webroot の中です。

webroot を除く各ディレクトリは、 ファイルシステム内のどこにでも配置できます。
これらは Web サーバからアクセスできるようにする必要があります。
また、 CakePHP に場所を知らせれば、 webroot フォルダを app フォルダの外に移すことができます。

CakePHP インストールの環境設定をするには、以下のファイルを少し修正する必要があります。

-  /app/webroot/index.php
-  /app/webroot/test.php ( :doc:`テスト </development/testing>` 機能を使う場合。)

編集しなくてはいけない三つの定数は、 ``ROOT`` 、 ``APP_DIR`` 、 ``CAKE_CORE_INCLUDE_PATH`` です。

-  ``ROOT`` には、アプリのフォルダが含まれているディレクトリのパスを設定します。
-  ``APP_DIR`` には、（訳注：相対的な）アプリのフォルダ名を設定します。
-  ``CAKE_CORE_INCLUDE_PATH`` には、CakePHP ライブラリフォルダのパスを設定します。

例を挙げて、応用インストールを実践した場合の様子を見てみましょう。
CakePHP を次のような条件で動作させたいとします:

-  CakePHP のコアライブラリは /usr/lib/cake に配置する。
-  アプリケーションの webroot ディレクトリは /var/www/mysite/ にする。
-  アプリケーションのアプリディレクトリは /home/me/myapp にする。

このようなセットアップの場合には、 webroot/index.php ファイル（つまり、この例では /var/www/mysite/index.php）が次のようになるよう、編集します。 ::

    // /app/webroot/index.php (一部分。コメントは取り除いてあります。)

    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

ファイルパスの区切り文字には、スラッシュではなく ``DS`` 定数を使うのがオススメです。
こうしておくと、間違った区切り文字による、ファイルが無いというエラーを防ぐことができ、コードをさまざまなプラットフォームで動くようにすることができます。

Apache と mod\_rewrite (と .htaccess)
=====================================

この章は :doc:`URLリライティング </installation/url-rewriting>` に移動しました。


.. meta::
    :title lang=ja: 応用インストール
    :keywords lang=ja: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
