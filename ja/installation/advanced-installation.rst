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
-  /app/webroot/test.php ( `テスト <view/1196/Testing>`_ 機能を使う場合。)

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
        define('ROOT', DS.'home'.DS.'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

ファイルパスの区切り文字には、スラッシュではなく ``DS`` 定数を使うようにお勧めします。
こうしておくと、間違った区切り文字による、ファイルが無いというエラーを防ぐことができ、コードをさまざまなプラットフォームで動くようにすることができます。


Apacheとmod\_rewrite(と.htaccess)
=================================

CakePHPは、展開した状態ではmod\_rewriteを使用するようになっており、自分のシステムでうまく動作するまで苦労するユーザもいます。
While CakePHP is built to work with mod\_rewrite out of the box–and
usually does–we've noticed that a few users struggle with getting
everything to play nicely on their systems.

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

   Cakeのアプリディレクトリ(bakeによるアプリケーションのトップディレクトリにコピーされる)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Cakeのwebrootディレクトリ(bakeによるアプリケーションのWEBルートディレクトリにコピーされる)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
       </IfModule>

   まだあなたのcakephpサイトでmod\_rewriteの問題が起きているなら、仮想ホスト(*virtualhosts*)の設定の変更を試してみるといいかもしれません。
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

   多くのホスティングサービス(GoDaddym、1and1)では、実際にWEBサーバーが既にmod\_rewriteを使っているユーザディレクトリから配信されます。
   CakePHPをユーザディレクトリ(http://example.com/~username/cakephp/)または既にmod\_rewriteを活用しているその他のURL構造にインストールしているなら、
   RewriteBaseステートメントをCakePHPが使う.htaccessファイル(/.htaccess、/app/.htaccess、/app/webroot/.htaccess)に追加する必要があります。

   これはRewriteEngineディレクティブと同じセクションに追加でき、例えばwebrootの.htaccessファイルは以下のようになります::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php/$1 [QSA,L]
       </IfModule>

   この変更の詳細は設定に依り、Cakeとは関係ない事柄も含むことがあります。
   詳しくはApacheのオンラインドキュメントを参照するようにしてください。


きれいなURLとLighttps
=====================

Lighttpdは書き換えモジュールを搭載していますが、それはApacheのmod\_rewriteと同じではありません。
Lightyを使っている中で「きれいなURL」を得るには、二つの方法があります。
一つ目はmod\_rewriteを使うことで、二つ目はLUAスクリプトとmod\_magnetを使うことです。

**mod\_rewriteの使用**
きれいなURLを得る最も簡単な方法は以下のスクリプトをlightyの設定に追加することです。
URLを書き換えるだけで、うまくいくはずです。
これはCakeがサブディレクトリにインストールされている場合は動作しないことに注意してください。

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # リクエストがcssやfilesなどであったら、Cakeに渡さない
                    "^/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php/$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**mod\_magnetの使用**
CakePHPとLighttpdを用いてきれいなURLを使うには、以下のLUAスクリプトを/etc/lighttpd/cakeに置いてください。

::

    -- 簡単なヘルパーファンクション
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end
    
    -- 末尾のスラッシュを除いた接頭辞
    local prefix = ''
    
    -- 魔法 ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- file still missing. pass it to the fastcgi backend
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- フォールスローは lighttpd のリクエストループに戻されます。
    -- これは、 HTTP コードの 304 を好きなように扱えることを意味します ;)

.. note::

    サブディレクトリからCakePHPのインストールを実行する場合、prefix = 'サブディレクトリ名'を上記のスクリプトでセットする必要があります。

次に、Lighttpd にバーチャルホストの設定を行います::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # vim の一時ファイルを除けることと同じような処理
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }


nginxでのきれいなURL
====================

nginxはポピュラーなサーバーで、Lighttpdのように少ないシステムリソースで使うことができます。
短所として、ApacheやLighttpdのように.htaccessファイルを使うことが出来ない点があります。
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

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            root   /var/www/example.com/public/app/webroot/;
            index  index.php index.html index.htm;
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ .*\.php$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }

IIS7(Windowsホスト)でのURL書き換え
==================================

IIS7はネイティブで.htaccessファイルをサポートしていません。
このサポートを追加できるアドオンがありますが、CakePHPのネイティブな書き換えを使うようにIISにhtaccessのルールをインポートすることもできます。
これをするには、以下のステップを踏んでください:


#. MictosoftのWeb Platform Installerを使ってURL Rewrite Module 2.0をインストールしてください。
#. CakePHPフォルダにweb.configという新しいファイルを作成してください。
#. メモ帳かXMLセーフなエディタを使って、以下のコードを真新しいweb.configファイルにコピーしてください。

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
    
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
    
                </rule>
    
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php/{R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

IISのURL Rewrite moduleでImport機能を使ってroot、/app/、/app/webroot/にあるCakePHPの.htaccessファイルから直接ルールをインポートすることも可能です
- 動作させるには、IISの内部でいくらかの編集が必要になるかもしれませんが。
この方法でルールをインポートする際、IISは自動的にweb.configファイルを生成するでしょう。

一旦IISフレンドリーな書き換えルールを含むweb.configが作成されれば、CakePHPのリンク、CSS、JS、再ルーティング(*rerouting*)は正しく動作するでしょう。
