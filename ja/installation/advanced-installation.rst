応用インストール
################

PEARインストーラでCakePHPをインストール
=======================================

CakePHPはあなたがPEARインストーラを使用してインストールできるようにPEARパッケージを公開しています。
PEARインストーラでインストールすると、複数のアプリケーションでCakePHPライブラリを共有するのが簡単になります。
PEARでCakePHPをインストールするには、次の手順を実行する必要があります::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    PEARでCakePHPをインストールするとき、システムによっては ``sudo`` が必要になります。

PEARでCakePHPをインストールした後、PEARが正しく設定されていれば、
新しいアプリケーションを作成するために ``cake`` コマンドが使えるようになっています。
CakePHPはPHPの ``include_path`` 上に配置されるので、とくに他の変更を行う必要はありません。


ComposerでCakePHPをインストール
===============================

Composerは、PHP 5.3以上向けの依存関係管理ツールです。
これは、PEARインストーラが抱える問題の多くを解決し、いろんなバージョンのライブラリをシンプルに管理できるようにします。
CakePHPはPEARパッケージを公開しているので、 `composer <http://getcomposer.org>`_ を使用してCakePHPをインストールすることができます。
CakePHPをインストールする前に ``composer.json`` ファイルをセットアップしましょう。
CakePHPアプリケーションのための composer.json ファイルは次のようになります::

    {
        "name": "example-app",
        "repositories": [
            {
                "type": "pear",
                "url": "http://pear.cakephp.org"
            }
        ],
        "require": {
            "cakephp/cakephp": ">=2.6.*"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

このJSONを ``composer.json`` としてプロジェクトのルートディレクトリに保存します。
次に、composer.pharファイルをダウンロードしてきます。
composerをダウンロードしたら、 CakePHPをインストールしましょう。
``composer.json`` と同じディレクトリで次のコマンドを実行します::

    $ php composer.phar install

composerの実行が終わると、ディレクトリ構造は次のようになっていると思います::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            cakephp/

さあ、アプリケーションのスケルトンの残りの部分を生成する準備ができました::

    $ Vendor/bin/cake bake project <path to project>

デフォルトでは、 ``bake`` は :php:const:`CAKE_CORE_INCLUDE_PATH` をハードコードするようになっています。
アプリケーションの移植性を高めるためには、 ``webroot/index.php`` を修正し、
``CAKE_CORE_INCLUDE_PATH`` を相対パスに変更しましょう::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . '/Vendor/cakephp/cakephp/lib'
    );

composerで他のライブラリをインストールしている場合は、
オートローダーを設定してcomposerのオートローダーで起こる問題を回避してください。
``Config/bootstrap.php`` ファイルに次の行を追加します::

    // composerのautoloadを読み込み
    require APP . 'Vendor/autoload.php';

    // CakePHPのオートローダーをいったん削除し、composerより先に評価されるように先頭に追加する
    // https://github.com/composer/composer/commit/c80cb76b9b5082ecc3e5b53b1050f76bb27b127b を参照
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

これで、composerでインストールしたCakePHPが機能するCakePHPアプリケーションができました。
ソースコードの残りの部分とcomposer.jsonとcomposer.lockファイルを保存しておいてください。


複数のアプリケーションでCakePHPを共有する
=========================================

時には、CakePHPのディレクトリをファイルシステムの別な場所に配置したいと思う場合があるかもしれません。
共有しているホストの制限であったり、複数のアプリが同じCakeのライブラリを使うようにしたかったりする場合などです。
このセクションでは、どうやってCakePHPのディレクトリをファイルシステム内に分散配置できるのかを説明します。

まず、Cakeアプリケーションには三つの主要な部分があることに注意しましょう:

#. CakePHPのコアライブラリは、 /lib/Cakeの中にあります。
#. アプリケーションコードは、/appの中です。
#. アプリケーションのウェブルートは、通常、/app/webrootにあります。

この各ディレクトリは、webrootを除いて、ファイルシステム内のどこにでも配置できます。
webrootは、Webサーバからアクセスできるようにする必要があります。
しかし、Cakeに場所を知らせれば、webrootフォルダをappフォルダの中から取り出すことさえ可能です。

Cakeインストールの環境設定をするには、以下のファイルを少し修正する必要があります。


-  /app/webroot/index.php
-  /app/webroot/test.php ( :doc:`テスト </development/testing>` 機能を使う場合。)

編集しなくてはいけない三つの定数は、 ``ROOT`` 、 ``APP_DIR`` 、 ``CAKE_CORE_INCLUDE_PATH`` です。


-  ``ROOT`` には、アプリのフォルダが含まれているディレクトリのパスを設定します。
-  ``APP_DIR`` には、（訳注：相対的な）アプリのフォルダ名を設定します。
-  ``CAKE_CORE_INCLUDE_PATH`` には、CakePHPライブラリフォルダのパスを設定します。

例を挙げて、応用インストールを実践した場合の様子を見てみましょう。
CakePHPを次のような条件で動作させたいとします:


-  CakePHPのコアライブラリは/usr/lib/cakeに配置する。
-  アプリケーションのwebrootディレクトリは/var/www/mysite/にする。
-  アプリケーションのアプリディレクトリは/home/me/myappにする。

このようなセットアップの場合には、 webroot/index.phpファイル（つまり、この例では/var/www/mysite/index.php）が次のようになるよう、編集します::

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

Apacheとmod\_rewrite(と.htaccess)
=================================

この章は :doc:`URLリライティング </installation/url-rewriting>` に移動しました。
