インストール
############

CakePHP は素早く簡単にインストールできます。
最小構成で必要なものは、ウェブサーバと CakePHP のコピー、それだけです！
本項では主に(最も一般的である) Apache でのセットアップに主眼を置いていますが、
CakePHP は nginx や lighttpd や Microsoft IIS のような様々なウェブサーバで動きます。

システム要件
============

-  HTTPサーバー。例: Apache。mod\_rewrite が推奨されますが、必須ではありません。
-  PHP |minphpversion| 以上 (PHP 7 も含む)
-  PHP mbstring 拡張
-  PHP intl 拡張

.. note::

    XAMPP / WAMP のいずれでも、mcrypt 拡張も mbstring 拡張も初期インストール状態で
    動きます。

    XAMPP では intl 拡張は同梱されていますが、 **php.ini** の ``extension=php_intl.dll``
    という行をコメントアウトして XAMPP コントロールパネルからサーバの再起動を行う必要はあります。

    WAMP では intl 拡張は最初からアクティブになっているのですが動作しません。
    動作させるためには php フォルダ（初期状態では **C:\\wamp\\bin\\php\\php{version}** ）にある
    **icu*.dll** というファイルを全て、apache の bin ディレクトリ
    （ **C:\\wamp\\bin\\apache\\apache{version}\\bin** ）にコピーしてから、
    全てのサービスを再起動すれば動くようになります。

データベースエンジンは必ずしも必要ではありませんが、ほとんどのアプリケーションは
これを活用することが想像できます。
CakePHP は種々のデータベース・ストレージのエンジンをサポートしています：

-  MySQL (5.1.10 以上)
-  PostgreSQL
-  Microsoft SQL Server (2008 以上)
-  SQLite 3

.. note::

    組み込みのドライバは全て PDO を必要とします。
    正しい PDO 拡張モジュールがインストールされているか必ず確かめてください。

CakePHP のインストール
======================

始める前に、最新の PHP バージョンであることを確認してください。

.. code-block:: bash

    php -v
    
少なくとも PHP |minphpversion| (CLI) 以上がインストールされていなければなりません。
ウェブサーバー版の PHP もまた |minphpversion| 以上でなければりませんし、
コマンドラインインターフェース (CLI) 版の PHP と同じバージョンがベストです。

Composer のインストール
-----------------------

CakePHP の公式のインストール方法として、依存性管理ツール
`Composer <http://getcomposer.org>`_ を使用します。

- Linux や macOS に Composer をインストール

  #. `公式の Composer ドキュメント <https://getcomposer.org/download/>`_ に書かれた
     インストーラスクリプトを実行し、Composer をインストールするために指示に従ってください。
  #. composer.phar を指定したパスのディレクトリに移すために以下のコマンドを実行してください。 ::

       mv composer.phar /usr/local/bin/composer

- Windows に Composer をインストール

  Windows 環境なら、 `こちら <https://github.com/composer/windows-setup/releases/>`__ から
  Windows インストーラをダウンロードできます。Composer の Windows インストーラについての詳細は、
  `README <https://github.com/composer/windows-setup>`__ をご覧ください。

CakePHP プロジェクトを作成
--------------------------

以上で、Composer をダウンロードとインストールしました。my_app_name フォルダに CakePHP
の新しいアプリケーションを作りたいなら、下記の composer コマンドを実行して作成します。

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app my_app_name

または Composer にパスが通っているのであれば下記のコマンドも使えます。

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app my_app_name

一度 Composer がアプリケーションの雛形とコアライブラリをダウンロードしたら、
インストールした CakePHP アプリケーションを Composer から操作できるように
しておくべきです。
必ず composer.json と composer.lock ファイルは残しておきましょう。

これでインストールした CakePHP アプリケーションにアクセスして、デフォルトの
ホームページを見ることができるようになりました。このページの内容を変更するには
**src/Template/Pages/home.ctp** を編集してください。

composer によるインストールが推奨されますが、
`Github <https://github.com/cakephp/cakephp/tags>`__
にはプリインストール版もあります。
このファイルにはアプリケーションの雛形と全てのベンダーパッケージが同梱されています。
また、 ``composer.phar`` も入っていますので、あなたのさらなる使用のために必要なものは
全てそろっているのです。

CakePHPの変更に合わせて最新の状態に保つ
---------------------------------------

デフォルトではあなたのアプリケーションの **composer.json** は下記のようになっています。 ::

    "require": {
        "cakephp/cakephp": "3.3.*"
    }

あなたが ``php composer.phar update`` と実行するたびに、デフォルトのバージョン制約
``~3.2`` を使って最新の安定リリース版が手に入ります。
アップデート時には、3.x 系のバグ修正とマイナーバージョンアップだけが適用されます。

もし CakePHP をリリース前の最新状態で維持したいのなら、あなたのアプリケーションの
**composer.json** にパッケージバージョンとして **dev-master** を指定してください。 ::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

この方法は次のメジャーバージョンがリリースされた時にあなたのアプリケーションが
動かなくなる可能性がありますので、お奨めできない事に注意してください。
さらに、composer は開発ブランチをキャッシュしませんので、composer による
連続したインストール・アップデートには時間がかかります。

パーミッション
==============

CakePHP は、幾つかの操作のために **tmp** ディレクトリを使用します。
モデルの定義や、ビューのキャッシュ、セッション情報などです。
**logs** ディレクトリは、デフォルトの ``FileLog`` エンジンがログファイルを
出力するために使われます。

そのため、 CakePHP をインストールしたら **logs**, **tmp** ディレクトリと
その全てのサブディレクトリに、ウェブサーバーの実行ユーザによる書き込み権限があることを
必ず確認してください。composer によるインストール処理では、なるべく早く動かせるように
**tmp** フォルダとそのサブフォルダに全ユーザーが書き込みできるようにしますが、
これをウェブサーバの実行ユーザーだけが書き込みできるようにパーミッション設定を変更すれば、
より良いセキュリティ状態にすることができます。

よくある課題として、 **logs** と **tmp** ディレクトリとサブディレクトリは、ウェブサーバと
コマンドラインユーザの両方で書き込み権限が必要、ということがあります。
UNIX システム上で ウェブサーバユーザとコマンドラインユーザが異なる場合、
パーミッションのプロパティ設定を確保するために、あなたのプロジェクトのアプリケーション
ディレクトリで一度だけ以下のコマンドを実行してください。

.. code-block:: bash

    HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
    setfacl -R -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -m u:${HTTPDUSER}:rwx logs
    setfacl -R -d -m u:${HTTPDUSER}:rwx logs

CakePHP コンソールツールを使用するためには、 ``bin/cake`` ファイルが
実行可能である必要があります。 \*nix または macOS 上では、以下を実行します。

.. code-block:: bash

    chmod +x bin/cake

Windows 上では、 **.bat** ファイルはすでに実行可能なはずです。もし、Vagrant または、
そのほかの仮想化環境を使用している場合、共有ディレクトリが実行可能なパーミッションで
共有される必要があります。 (設定方法は仮想化環境のドキュメントを参照してください。)

もし、なんらかの理由で、 ``bin/cake`` ファイルのパーミッションを変更できない場合、
CakePHP コンソールは、以下のように実行できます。

.. code-block:: bash

    php bin/cake.php

開発サーバ
==========

開発用インストールは、CakePHP を最も速くインストールする方法です。
この例では、CakePHP のコンソールを使って PHP の組み込みウェブサーバを起動して、
あなたのアプリケーションに **http://host:port** という形式でアクセスできるように
します。app ディレクトリで下記のコマンドを実行しましょう。

.. code-block:: bash

    bin/cake server

引数のないデフォルト状態では、 **http://localhost:8765/** であなたのアプリケーションに
アクセスできます。

もしあなたの環境で **localhost** や 8765番ポートが使用済みなら、CakePHP のコンソールから
下記のような引数を使って特定のホスト名やポート番号でウェブサーバを起動することができます。

.. code-block:: bash

    bin/cake server -H 192.168.13.37 -p 5673

こうすればあなたのアプリケーションには **http://192.168.13.37:5673/** でアクセスできます。

これだけです！
あなたの CakePHP アプリケーションは ウェブサーバを設定することなく動きます。

.. warning::

    開発サーバは公開環境に使用するべきでは *ありません*。
    これはあくまでも基本的な開発サーバと位置付けられています。

もしあなたが本物のウェブサーバを使いたいのであれば、インストールした CakePHP のファイルを
（隠しファイルも含めて） ウェブサーバのドキュメントルート配下に移動させます。
これでブラウザから移動先のディレクトリを指定すれば、あなたのアプリケーションに
アクセスすることができます。

公開用
==========

公開用インストールは、さらに柔軟に CakePHP をセットアップする方法です。
この方法を使えば、全てのドメインで１つの CakePHP アプリケーションを使う事も可能です。
今回の例では、あなたがファイルシステムのどこに CakePHP をインストールしたとしても、
http://www.example.com といったようにアクセスできるようになるでしょう。
Apache ウェブサーバでこの方法を使う場合は、 ``DocumentRoot`` を変更する権限が必要に
なるかもしれないことに注意が必要です。

これまでに紹介したいずれかの方法で、あなたが指定したディレクトリ（ここでは
「/cake_install」を指定したとしましょう）にアプリケーションをインストールしたら、
あなたのファイルシステムには下記のような環境ができているでしょう。 ::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (このディレクトリが DocumentRoot になります)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Apache を利用している開発者は、当該ドメインの ``DocumentRoot`` ディレクティブに
下記のように指定します。

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

あなたのウェブサーバが正しく設定されていれば、これで http://www.example.com から
あなたの CakePHP アプリケーションにアクセスできるようになります。


始動
==========

さぁ、CakePHP の動作を見てみましょう。あなたが選んだ方法に応じて、ブラウザから
http://example.com/ あるいは http://localhost:8765/ にアクセスしてください。
これで CakePHP のデフォルトのホーム画面と、データベースへの接続状態を表すメッセージが
表示されるでしょう。

おめでとうございます！これでもう :doc:`最初の CakePHP アプリケーション作成 </quickstart>`
の準備ができました。

.. _url-rewriting:

URL Rewriting
=============

Apache
------

CakePHP は、展開した状態では mod_rewrite を使用するようになっており、自分のシステムで
うまく動作するまで苦労するユーザもいます。

ここでは、正しく動作させるために行うことをいくつか示します。
まず始めに httpd.conf を見てください（ユーザーやサイト個別の httpd.conf ではなく、
必ずシステムの httpd.conf を編集してください）。

これらのファイルはディストリビューションや Apache のバージョンによって大きく異なります。
詳細については http://wiki.apache.org/httpd/DistrosDefaultLayout を見てもよいかも
しれません。

#. 適切な DocumentRoot に対して .htaccess による設定の上書きを許可するよう、
   AllowOverride に All が設定されている事を確認します。
   これは下記のように書かれているでしょう。

   .. code-block:: apacheconf

       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories).
       #
       # First, we configure the "default" to be a very restrictive set of
       # features.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. 下記のように mod\_rewrite が正しくロードされている事を確認します。

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   多くのシステムでこれらはデフォルトではコメントアウトされているでしょうから、
   先頭の「#」の文字を削除する必要があります。

   変更した後は、設定変更を反映するために Apache を再起動してください。

   .htaccess ファイルが正しいディレクトリにあることを確認してください。
   一部のOSでは、ファイル名が「.」から始まるファイルは隠しファイルとみなされ、
   コピーされないでしょう。

#. サイトのダウンロードページや Git リポジトリからコピーした CakePHP が正しく
   解凍できているか、 .htaccess ファイルをチェックします。

   CakePHP のアプリケーションディレクトリ（あなたが Bake でコピーした一番上の
   ディレクトリ）にはこのように書いてあります。

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   webroot ディレクトリにはこのように書いてあります。

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   まだあなたの CakePHP サイトで mod\_rewrite の問題が起きているなら、
   仮想ホスト (virtualhosts) の設定の変更を試してみるといいかもしれません。
   Ubuntu 上なら、**/etc/apache2/sites-available/default** (場所は
   ディストリビューションによる)のファイルを編集してください。
   このファイルの中で ``AllowOverride None`` が ``AllowOverride All``
   に変更されているかを確かめてください。 つまり以下のようになるでしょう。

   .. code-block:: apacheconf

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options Indexes FollowSymLinks MultiViews
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   macOS上での別解は、仮想ホストをフォルダに向けさせるのに、
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_
   ツールを使うことが挙げられます。

   多くのホスティングサービス (GoDaddy、1and1) では、実際にウェブサーバーが
   既に mod\_rewrite を使っているユーザディレクトリから配信されます。
   CakePHP をユーザディレクトリ (http://example.com/~username/cakephp/) または
   既に mod\_rewrite を活用しているその他の URL 構造にインストールしているなら、
   RewriteBase ステートメントを CakePHP が使う .htaccess ファイル
   (/.htaccess、/app/.htaccess、/app/webroot/.htaccess) に追加する必要があります。

   これは RewriteEngine ディレクティブと同じセクションに追加でき、
   例えば webroot の .htaccess ファイルは以下のようになります。

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   この変更の詳細はあなたの環境構成に依存しますので、CakePHP と関係ない内容が
   含まれることがあります。
   詳しくは Apache のオンラインドキュメントを参照するようにしてください。

#. (オプション) 公開環境の設定では、必要ないリクエストは CakePHP で処理されないようにしましょう。
   webroot の .htaccess ファイルを次のように修正してください。

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   上の例は、正しくないアセットを index.php へ送信せず、ウェブサーバの 404 ページを表示します。

   また、HTML で 404 ページを作成することもできますし、 ``ErrorDocument`` ディレクティブへ
   追記することで、CakePHP のビルトインの 404 ページを使うこともできます。

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found

nginx
-----

nginx は Apache のような .htaccess ファイルを利用しませんので、
サイトの設定で URLの書き換えルールを作成する必要があります。
これは大抵  ``/etc/nginx/sites-available/your_virtual_host_conf_file`` に記載します。
あなたの環境構成に応じて、このファイルを書き換えなければなりませんが、
少なくとも PHP を FastCGI として稼働させる必要はあるでしょう。

.. code-block:: nginx

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

(Ubuntu 14.04 など) いくつかのサーバでは、上記のような設定は動かないでしょうから、 nginx の
ドキュメントでは別の方法 (http://nginx.org/en/docs/http/converting_rewrite_rules.html)を
推奨しています。
下記の通り試してみてください。(server{}ブロックが2つではなく1つになっているのが
お分かりでしょう。)

.. code-block:: nginx

    server {
        listen   80;
        server_name www.example.com;
        rewrite 301 http://www.example.com$request_uri permanent;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }


IIS7 (Windows hosts)
--------------------

IIS7 はネイティブで .htaccess ファイルをサポートしていません。
このサポートを追加できるアドオンがありますが、CakePHP のネイティブな書き換えを使うように
IIS に htaccess のルールをインポートすることもできます。
これをするには、以下のステップを踏んでください:


#. URL `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   をインストールするために、`Microsoftの Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_
   を使うか、直接ダウンロードします。(`32ビット <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64ビット <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_)
#. CakePHP のルートフォルダに web.config という名前の新しいファイルを作成してください。
#. メモ帳か XML が編集可能なエディタを使って、以下のコードを今作った web.config ファイルに
   コピーしてください。

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Exclude direct access to webroot/*"
                      stopProcessing="true">
                        <match url="^webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="webroot/{R:1}{R:2}"
                          appendQueryString="false" />
                    </rule>
                    <rule name="Rewrite requested file/folder to index.php"
                      stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="index.php"
                          appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

一旦 IIS で利用可能な書き換えルールを含む web.config ファイルができたら、
CakePHP のリンク、CSS、JavaScript、再ルーティング (rerouting) は正しく動作するでしょう。

URL リライティングを使わない場合
--------------------------------

もしあなたのサーバで mod\_rewrite (かそれと互換性のあるモジュール) を使いたくなかったり
使えない場合は、 CakePHP の組み込みのままの URL を使う必要があります。
**config/app.php** の下記のコメントを解除します。 ::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

そして、下記の .htaccess ファイルを削除します。 ::

    /.htaccess
    webroot/.htaccess

これで URL は www.example.com/controllername/actionname/param ではなく
www.example.com/index.php/controllername/actionname/param という書式になるでしょう。

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=ja: インストール
    :keywords lang=ja: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
