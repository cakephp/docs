URLリライティング
#################

Apacheとmod\_rewrite(と.htaccess)
=================================

CakePHPは、展開した状態ではmod\_rewriteを使用するようになっており、自分のシステムでうまく動作するまで苦労するユーザもいます。

ここでは、正しく動作させるために行うことをいくつか示します。
まず始めにhttpd.confを見てください（ユーザーやサイト独自のhttpd.confではなく、必ずシステムのhttpd.confを編集してください）。


#. .htaccessのオーバーライドが許可されていること、正確なDocumentRootに対してAllowOverrideがAllに設定されていることを確かめてください。
   以下のようなものになるはずです::

       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories).
       #
       # First, we configure the "default" to be a very restrictive set of
       # features.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. mod\_rewriteを正しく読み込んでいることを確認してください。
   以下のようになるはずです::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   多くのシステムではこれらはデフォルトで(先頭に#を付けられて)コメントアウトされています。
   従って、先頭の#記号を取り除く必要だけあるかもしれません。

   変更をした後、設定が有効であることを確かめるためApacheを再起動してください。

   .htaccessファイルが実際に正しいディレクトリにあるかを確かめてください。

   これはコピー時、いくつかのオペレーティングシステムでは「.」で始まるファイルを隠しファイルとして扱うことから、
   コピーするのに見えなくなってしまうために起こりうることです。

#. CakePHPのコピーがサイトのダウンロードセクション、またはGITリポジトリからのものであることを確かめてください。
   また、.htaccessファイルを確認して正常に解凍されたかどうかも確かめてください。

   Cakeのルートディレクトリ(ドキュメントにコピーされる必要があり、Cakeアプリに全てリダイレクトします)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   Cakeのappディレクトリ(bakeによってアプリケーションのトップディレクトリにコピーされる)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Cakeのwebrootディレクトリ(bakeによってアプリケーションのWEBルートディレクトリにコピーされる)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   まだあなたのCakePHPサイトでmod\_rewriteの問題が起きているなら、仮想ホスト(*virtualhosts*)の設定の変更を試してみるといいかもしれません。
   ubuntu上なら、/etc/apache2/sites-available/default(場所はディストリビューションによる)のファイルを編集してください。
   このファイルの中で、 ``AllowOverride None`` が ``AllowOverride All`` に変更されているかを確かめてください。
   つまり以下のようになるでしょう::

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

   Mac OSX上での別解は、仮想ホストをフォルダに向けさせるのに、virtualhostxツールを使うことが挙げられます。

   多くのホスティングサービス(GoDaddy、1and1)では、実際にWEBサーバーが既にmod\_rewriteを使っているユーザディレクトリから配信されます。
   CakePHPをユーザディレクトリ(http://example.com/~username/cakephp/)または既にmod\_rewriteを活用しているその他のURL構造にインストールしているなら、
   RewriteBaseステートメントをCakePHPが使う.htaccessファイル(/.htaccess、/app/.htaccess、/app/webroot/.htaccess)に追加する必要があります。

   これはRewriteEngineディレクティブと同じセクションに追加でき、例えばwebrootの.htaccessファイルは以下のようになります::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   この変更の詳細は設定に依り、Cakeとは関係ない事柄も含むことがあります。
   詳しくはApacheのオンラインドキュメントを参照するようにしてください。

#. (オプション) プロダクション環境の設定では、正しくないアセットは、CakePHPを通さないようにしましょう。webrootの.htaccessファイルを次のように修正してください ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(app/webroot/)?(img|css|js)/(.*)$
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   上の例は、正しくないアセットをindex.phpへ送信せず、Webサーバの404ページを表示します。

   また、HTMLで404ページを作成することもできますし、 ``ErrorDocument`` ディレクティブへ追記することで、CakePHPのビルトインの404ページを使うこともできます。 ::

       ErrorDocument 404 /404-not-found


nginxでのきれいなURL
====================

nginxはポピュラーなサーバーで、Apacheよりも少ないシステムリソースで使うことができます。
短所として、Apacheのように.htaccessファイルを使うことが出来ない点があります。
つまり、site-available設定でそのようなURLの書き換えを作る必要があります。
セットアップによりますが、以下を書き換える必要があるでしょう。
少なくとも、PHPがFastCGIのインスタンスとして走るようにする必要があります。

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/app/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

IIS7(Windowsホスト)でのURL書き換え
==================================

IIS7はネイティブで.htaccessファイルをサポートしていません。
このサポートを追加できるアドオンがありますが、CakePHPのネイティブな書き換えを使うようにIISにhtaccessのルールをインポートすることもできます。
これをするには、以下のステップを踏んでください:


#. `MicrosoftのWeb Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_ を使って
   `URL Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_ をインストールするか、直接ダウンロードしてください (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ / `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_)。
#. CakePHPフォルダにweb.configという新しいファイルを作成してください。
#. メモ帳かXMLセーフなエディタを使って、以下のコードを真新しいweb.configファイルにコピーしてください。

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Rewrite requests to test.php" stopProcessing="true">
                        <match url="^test.php(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="app/webroot/test.php{R:1}" />
                    </rule>
                    <rule name="Exclude direct access to app/webroot/*" stopProcessing="true">
                        <match url="^app/webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets (img, css, files, js, favicon)" stopProcessing="true">
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="app/webroot/{R:1}{R:2}" appendQueryString="false" />
                    </rule>
                    <rule name="Rewrite requested file/folder to index.php" stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="index.php" appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

一旦IISフレンドリーな書き換えルールを含むweb.configが作成されれば、CakePHPのリンク、CSS、JS、再ルーティング(*rerouting*)は正しく動作するでしょう。

lighttpdでのURL書き換え
=========================

Lighttpdは .htaccess 機能をサポートしていません。
そのため、あなたは全ての .htaccess ファイルを取り除かなければなりません。

lighttpdの設定において「mod_rewrite」の機能がアクティブになっていることを確認し、
次の行を追記して下さい。

::

    url.rewrite-if-not-file =(
        "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
    )

URLリライティングを使わない/使えない場合
========================================

もし、URLリライティングを使いたくなかったり使えなかったりする場合は、
:ref:`core configuration<core-configuration-baseurl>` を参照してください。



.. meta::
    :title lang=en: URL Rewriting
    :keywords lang=en: url rewriting, mod_rewrite, apache, iis, plugin assets, nginx
