インストール
############

CakePHPのインストールは、Webサーバのドキュメントルートに放り込むだけの簡単インストールから、好きなだけ複雑かつ柔軟に設定することまでもできます。このセクションでは、CakePHPの主な３種類のインストール方法について説明します。開発、運用、応用の３種類です。

-  開発（Development）：簡単にはじめることができますが、アプリケーションのURLには、CakePHPをインストールしたディレクトリ名が入ります。他の設定と比べるとセキュリティ面はやや弱くなります。
-  運用（Production）:Webサーバのドキュメントルートを設定できる必要がありますが、URLをクリーンにでき、セキュリティを固くできます。
-  応用（Advanced）：幾つかの設定により、CakePHPの重要な各ディレクトリをファイルシステムの異なる場所に配置することができるので、多くのCakePHPアプリケーションがひとつのCakePHPコアライブラリのフォルダを共有することなどが可能です。

開発（Development）
===================

開発用のインストールは Cake
をセットアップする最も早い方法です。この例では CakePHP
をインストールし、 http://www.example.com/cake\_1\_3/
でアクセスできるようにする方法を説明します。ドキュメントルートは
/var/www/html であると仮定します。

Cake のアーカイブを /var/www/html
に展開してください。ドキュメントルートに、ダウンロードしたリリースの名前がついたフォルダ(例えば
cake\_1.3.0)が取得できます。このフォルダを cake\_1\_3
という名前にリネームしてください。ファイルシステム上の開発用の設定は次のようになります。

-  /var/www/html

   -  /cake\_1\_3

      -  /app
      -  /cake
      -  /vendors
      -  /.htaccess
      -  /index.php
      -  /README

もしウェブサーバが適切に設定されていれば、
http://www.example.com/cake\_1\_3/ で Cake
アプリケーションがアクセス可能になっているはずです。

運用（Production）
==================

運用向けのインストールは Cake
をセットアップする最も柔軟な方法です。この方法を使うと、ドメイン全体を単一の
CakePHP アプリケーションのように振舞わせることができます。この例では
CakePHP
を任意のファイルシステムの場所にインストールし、http://www.example.com
でアクセスできるようにする方法を説明します。このインストールにおいては
Apache ウェブサーバの ``DocumentRoot``
の設定を正しいものに変更する必要が出てくるかもしれないことに注意してください。

Cake
のアーカイブを好きなディレクトリに展開してください。この例において、Cake
をインストールすると決めたディレクトリは /cake\_install
であると仮定します。ファイルシステム上の運用向けの設定は次のようになります。

-  /cake\_install/

   -  /app

      -  /webroot (このディレクトリを ``DocumentRoot``
         ディレクティブとしてセットします)

   -  /cake
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README

Apache を使用する場合は、そのドメインの ``DocumentRoot``
ディレクティブを次のように設定してください。

::

    DocumentRoot /cake_install/app/webroot

もしウェブサーバが適切に設定されていれば、 http://www.example.com で
Cake アプリケーションがアクセス可能になっているはずです。

応用インストール
================

ある時には、CakePHPのディレクトリをファイルシステムの別な場所に配置したいと思う場合があるかもしれません。共有しているホストの制限であったり、複数のアプリが同じCakeのライブラリを使うようにしたかったりする場合などです。このセクションでは、どうやってCakePHPのディレクトリをファイルシステム内に分散配置できるのかを説明します。

まず、Cakeアプリケーションには三つの主要な部分があることに注意しましょう。：

#. CakePHPのコアライブラリは、 /cakeの中にあります。
#. あなたのアプリケーションコードは、/appの中です。
#. アプリケーションのウェブルートは、通常、/app/webrootにあります。

この各ディレクトリは、webrootを除いて、ファイルシステム内のどこにでも配置できます。webrootは、Webサーバからアクセスできるようにする必要があります。しかし、Cakeに場所を知らせれば、webrootフォルダをappフォルダの中から取り出すことさえ可能です。

Cakeインストールの環境設定をするには、以下のファイルを少し修正する必要があります。

-  /app/webroot/index.php
-  /app/webroot/test.php
   (`テスト <ja/view/1196/Testing>`_\ 機能を使う場合)

編集しなくてはいけない三つの定数は、\ ``ROOT``\ 、\ ``APP_DIR``\ 、\ ``CAKE_CORE_INCLUDE_PATH``\ です。

-  ``ROOT``\ には、アプリのフォルダが含まれているディレクトリのパスを設定します。
-  ``APP_DIR``\ には、アプリのフォルダを設定します。
-  ``CAKE_CORE_INCLUDE_PATH``\ には、CakePHPライブラリフォルダのパスを設定します。

例を挙げて、応用インストールを実践した場合の様子を見てみましょう。CakePHPを次のような条件で動作させたいとします。：

-  CakePHPのコアライブラリは/usr/lib/cakeに配置する。
-  アプリケーションのwebrootディレクトリは/var/www/mysite/にする。
-  アプリケーションのアプリディレクトリは/home/me/myappにする。

このようなセットアップの場合には、
webroot/index.phpファイル（つまり、この例では/var/www/mysite/index.php）が次のようになるよう、編集します。

::

    // /app/webroot/index.php （一部分。コメントは取り除いてあります。）

    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'me');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

ファイルパスの区切り文字には、スラッシュではなくDS定数を使うようにお勧めします。こうしておくと、間違ったデリミタによる、ファイルが無いというエラーを防ぐことができ、コードをさまざまなプラットフォームで動くようにすることができます。

各クラス用パスの追加情報
------------------------

同一システム上にあるアプリケーションで、MVCクラスを共有できると便利な場合もあります。二つのアプリケーションから同じコントローラを使用したい場合には、CakePHPの
bootstrap.php を使って、その追加クラスをビューに接続することが可能です。

bootstrap.php
の中に次のような変数を定義して、CakePHPがMVCクラスを検索しにいく場所を登録してください。

::

    App::build(array(
        'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
        'models' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
        'views' => array('/full/path/to/views/', '/next/full/path/to/views/'),
        'controllers' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
        'datasources' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
        'behaviors' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
        'components' => array('/full/path/to/components/', '/next/full/path/to/components/'),
        'helpers' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
        'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
        'shells' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/'),
        'libs' => array('/full/path/to/libs/', '/next/full/path/to/libs/')
    ));

また、ブートストラップするときの順序が変更されました。以前は、\ ``app/config/bootstrap.php``\ **の後に**\ ``app/config/core.php``\ が読み込まれていました。これはアプリケーションのブートストラップの\ ``App::import()``\ がキャッシュせず、キャッシュがヒットしたときよりかなりかなり遅くなっていました。1.3では、core.php
の読み込みと設定のキャッシュは bootstrap.php
の読み込みの\ **前に**\ されます。

Apacheとmod\_rewrite
====================

CakePHPは、展開した状態ではmod\_rewriteを使用するようになっており、自分のシステムでうまく動作するまで苦労するユーザもいます。次に、正しく動作させるために行うことをいくつか示します。

-  .htaccessのオーバーライドが許可されていることを確認しましょう。場所は、httpd.confの中の、サーバのディレクトリを定義している場所です。正しいドキュメントルートのAllowOverrideがAllになっていることを確かめてください。
-  ユーザやサイト特有のhttpd.confではなく、システムのhttpd.confを編集してください。
-  CakePHPが必要な.htaccessを見つけられないでいるでしょうか。オペレーティングシステムの中には、'.'ではじまるファイルを隠しファイルとして扱うため、コピーや移動の際に、この現象が発生することがあります。CakePHPのファイルを、サイトのダウンロードセクションからか、SVNリポジトリから入手して、正しく展開するようにしてください。
-  mod\_rewriteを正しく読み込んでいることを確認してください。\ *LoadModule
   rewrite\_module libexec/httpd/mod\_rewrite.so*\ (Unix/Linux ユーザは
   *AddModule mod\_rewrite.c* という場合もあります) が、httpd.conf
   の中にあることを確認してください。また、これらの行がコメントアウトされていない(行頭に「#」が付いていない)ことも確認してください。設定を有効にするには、
   Apache を再起動します。
-  CakePHP
   をユーザディレクトリ(http://example.com/~username/cakephp/)や、すでに
   mod\_rewrite を利用しているその他の URL
   構造の中にインストールする場合は、CakePHP が使用している .htaccess
   ファイル(/.htaccess, /app/.htaccess, /app/webroot/.htaccess)に、
   RewriteBase
   ステートメントを追加してください。これらの変更の詳細については、セットアップの方法に依存します。より詳しい情報は、
   Apache のオンライン文書を参照してください。

Lighttpd と mod\_magnet
=======================

lighttpd にはリライトモジュールがありますが、 Apache の mod\_rewrite
と同じではありません。mod\_rewrite の全ての機能を利用するには、 lighttpd
の mod\_rewrite 、 mod\_magnet そして mod\_proxy を使う必要があります。

しかしながら、 CakePHP では、リクエストをリダイレクトし簡潔な URL
にするため、主に mod\_magnet を利用します。

CakePHP と lighttpd で簡潔な URL を扱うためには、次の lua スクリプトを
/etc/lighttpd/cake に設置します。

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

    -- スラッシュを除いたプレフィックス
    local prefix = ''

    -- ここからが肝心な設定 ;)
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

サブディレクトリにインストールした CakePHP
を実行したい場合は、上記スクリプトを prefix = 'subdirectory\_name'
というようにセットしてください。

次に、lighttpd にバーチャルホストの設定を行います:

::

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

nginxはポピュラーなサーバーで、Lighttpdのように少ないシステムリソースで使うことができます。短所として、ApacheやLighttpdのように.htaccessファイルを使うことが出来ない点があります。つまり、site-available設定でそのようなURLの書き換えを作る必要があります。セットアップによりますが、以下を書き換える必要があるでしょう。少なくとも、PHPがFastCGIのインスタンスとして走るようにする必要があります。

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
            if (-f $request_filename) {
                break;
            }
            if (-d $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?q=$1 last;
        }

        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }

URL Rewrites on IIS7 (Windows hosts)
====================================

IIS7 does not natively support .htaccess files. While there are add-ons
that can add this support, you can also import htaccess rules into IIS
to use CakePHP's native rewrites. To do this, follow these steps:

#. Use Microsoft's Web Platform Installer to install the URL Rewrite
   Module 2.0.
#. Create a new file in your CakePHP folder, called web.config
#. Using Notepad or another XML-safe editor, copy the following code
   into your new web.config file...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Redirect static resources" stopProcessing="true">
                <match url="^(ico|img|css|files|js)(.*)$" />
                <action type="Rewrite" url="app/webroot/{R:1}{R:2}" appendQueryString="false" />
                </rule>
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
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

It is also possible to use the Import functionality in IIS's URL Rewrite
module to import rules directly from CakePHP's .htaccess files in root,
/app/, and /app/webroot/ - although some editing within IIS may be
necessary to get these to work. When Importing the rules this way, IIS
will automatically create your web.config file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.

動作確認
========

それでは、実際に CakePHP
を動作させてみましょう。セットアップの種類にもよりますが、http://example.com/
または http://example.com/cake\_install/
をブラウザで開いてみましょう。この時点では、CakePHP
のデフォルトのホーム画面と、現在のデータベース接続の状態が表示されるはずです。

おめでとうございます! CakePHP
の最初のアプリケーションを作る準備ができました。

動きませんか？もしPHPのタイムゾーンに関連するエラーが出るなら、app/config/core.phpの中のとある一行のコメントを外してください。

::

    /**
     * If you are on PHP 5.3 uncomment this line and correct your server timezone
     * to fix the date & time related errors.
     */
        date_default_timezone_set('UTC');

