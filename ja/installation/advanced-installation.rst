応用インストール
################

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

ファイルパスの区切り文字には、スラッシュではなく ``DS`` 定数を使うようにお勧めします。
こうしておくと、間違った区切り文字による、ファイルが無いというエラーを防ぐことができ、コードをさまざまなプラットフォームで動くようにすることができます。

Apacheとmod\_rewrite(と.htaccess)
=================================

この章は :doc:`URLリライティング </installation/url-rewriting>` に移動しました。
