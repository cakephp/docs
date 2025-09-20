# URLリライティング

## Apache と mod_rewrite (と.htaccess)

CakePHP は、展開した状態では mod_rewrite を使用するようになっており、
自分のシステムでうまく動作するまで苦労するユーザもいます。

ここでは、正しく動作させるために行うことをいくつか示します。まず始めに
httpd.conf を見てください（ユーザーやサイト独自の httpd.conf ではなく、
必ずシステムの httpd.conf を編集してください）。

これらのファイルは、ディストリビューションや Apache のバージョンによって異なります。
詳しくは <https://wiki.apache.org/httpd/DistrosDefaultLayout> を参照してください。

1.  .htaccess のオーバーライドが許可されていること、正確な DocumentRoot に対して
    AllowOverride が All に設定されていることを確かめてください。
    以下のようなものになるはずです。 :

    ``` text
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
    ```

    Apache 2.4 以上の場合、 `httpd.conf` やバーチャルホストの設定を以下のように
    更新する必要があります。 :

    ``` html
    <Directory /var/www/>
         Options FollowSymLinks
         AllowOverride All
         Require all granted
    </Directory>
    ```

2.  mod_rewrite を正しく読み込んでいることを確認してください。
    以下のようになるはずです:

        LoadModule rewrite_module libexec/apache2/mod_rewrite.so

    多くのシステムではこれらはデフォルトで (先頭に# を付けられて) コメントアウトされています。
    従って、先頭の \# 記号を取り除く必要があるかもしれません。

    変更をした後、設定が有効であることを確かめるため Apache を再起動してください。

    .htaccess ファイルが実際に正しいディレクトリにあるかを確かめてください。
    これはコピー時、いくつかのオペレーティングシステムでは「.」で始まるファイルを
    隠しファイルとして扱うことから、コピーするのに見えなくなってしまうために起こりうることです。

3.  CakePHP のコピーがサイトのダウンロードセクション、または Git リポジトリからのものであることを
    確かめてください。また、.htaccess ファイルを確認して正常に解凍されたかどうかも確かめて
    ください。

    CakePHP のルートディレクトリ(ドキュメントにコピーされる必要があり、CakePHP アプリに
    全てリダイレクトします):

    ``` html
    <IfModule mod_rewrite.c>
       RewriteEngine on
       RewriteRule    ^$ app/webroot/    [L]
       RewriteRule    (.*) app/webroot/$1 [L]
    </IfModule>
    ```

    CakePHP の app ディレクトリ (bake によってアプリケーションのトップディレクトリに
    コピーされる):

    ``` html
    <IfModule mod_rewrite.c>
       RewriteEngine on
       RewriteRule    ^$    webroot/    [L]
       RewriteRule    (.*) webroot/$1    [L]
    </IfModule>
    ```

    CakePHP の webroot ディレクトリ (bake によってアプリケーションのウェブルートディレクトリに
    コピーされる):

    ``` html
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php [QSA,L]
    </IfModule>
    ```

    まだあなたの CakePHP サイトで mod_rewrite の問題が起きているなら、仮想ホスト
    (*virtualhosts*) の設定の変更を試してみるといいかもしれません。Ubuntu 上なら、
    /etc/apache2/sites-available/default (場所はディストリビューションによる)
    のファイルを編集してください。このファイルの中で、 `AllowOverride None` が
    `AllowOverride All` に変更されているかを確かめてください。
    つまり以下のようになるでしょう:

    ``` html
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
    ```

    Mac OSX 上での別解は、仮想ホストをフォルダに向けさせるのに、
    [virtualhostx](https://clickontyler.com/virtualhostx/) ツールを使うことが
    挙げられます。

    多くのホスティングサービス (GoDaddy、1and1) では、実際にウェブサーバーが既に mod_rewrite
    を使っているユーザディレクトリから配信されます。CakePHP をユーザディレクトリ
    (<http://example.com/~username/cakephp/>) または既に mod_rewrite を活用している
    その他の URL 構造にインストールしているなら、RewriteBase ステートメントを CakePHP が使う
    .htaccess ファイル (/.htaccess、/app/.htaccess、/app/webroot/.htaccess) に
    追加する必要があります。

    これは RewriteEngine ディレクティブと同じセクションに追加でき、例えば webroot の
    .htaccess ファイルは以下のようになります:

    ``` html
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /path/to/cake/app
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php [QSA,L]
    </IfModule>
    ```

    この変更の詳細は設定に依り、CakePHP とは関係ない事柄も含むことがあります。
    詳しくは Apache のオンラインドキュメントを参照するようにしてください。

4.  (オプション) プロダクション環境の設定では、CakePHP で処理するのが不適切なアセットは、
    CakePHP を通さないようにしましょう。webroot の .htaccess ファイルを次のように
    修正してください :

    ``` html
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /path/to/cake/app
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_URI} !^/(app/webroot/)?(img|css|js)/(.*)$
        RewriteRule ^(.*)$ index.php [QSA,L]
    </IfModule>
    ```

    上の例は、正しくないアセットを index.php へ送信せず、ウェブサーバの 404 ページを表示します。

    また、HTML で 404 ページを作成することもできますし、 `ErrorDocument` ディレクティブへ
    追記することで、CakePHP のビルトインの 404 ページを使うこともできます。 :

        ErrorDocument 404 /404-not-found

## nginx でのきれいな URL

nginx はポピュラーなサーバーで、Apache よりも少ないシステムリソースで使うことができます。
短所として、Apache のように .htaccess ファイルを使うことが出来ない点があります。
つまり、 site-available 設定でそのような URL の書き換えを作る必要があります。
セットアップによりますが、以下を書き換える必要があるでしょう。
少なくとも、PHP が FastCGI のインスタンスとして走るようにする必要があります。

``` php
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
```

もし、特殊な理由で、ルートディレクトリが変更できず、example.com/subfolder/ のように
サブフォルダ以下でプロジェクトを実行する必要があるなら、全てのリクエストに "/webroot" を
追加しなければなりません。

``` text
location ~ ^/(subfolder)/(.*)? {
   index  index.php;

   set $new_uri /$1/webroot/$2;
   try_files $new_uri $new_uri/ /$1/index.php?$args;

   ... php handling ...
}
```

> [!NOTE]
> PHP-FPM の最近の設定は、IP アドレス 127.0.0.1 の 9000 番 TCP ポートの代わりに
> php-fpm ソケットで受信します。もし、その設定で 502 bad gateway エラーが起こった場合、
> TCP ポートからソケットパスに fastcgi_pass を書き換えてください。
> (例: fastcgi_pass unix:/var/run/php5-fpm.sock;)

## IIS7 (Windows ホスト) での URL 書き換え

IIS7 はネイティブで .htaccess ファイルをサポートしていません。このサポートを追加できる
アドオンがありますが、CakePHP のネイティブな書き換えを使うように IIS に htaccess の
ルールをインポートすることもできます。これをするには、以下のステップを踏んでください:

1.  [Microsoft の Web Platform Installer](https://www.microsoft.com/web/downloads/platform.aspx) を使って
    [URL Rewrite Module 2.0](https://www.iis.net/downloads/microsoft/url-rewrite) をインストールするか、
    直接ダウンロードしてください ([32-bit](https://www.microsoft.com/en-us/download/details.aspx?id=5747) /
    [64-bit](https://www.microsoft.com/en-us/download/details.aspx?id=7435))。
2.  CakePHP フォルダに web.config という新しいファイルを作成してください。
3.  メモ帳か XML セーフなエディタを使って、以下のコードを真新しい web.config ファイルに
    コピーしてください。

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Rewrite requests to test.php"
                  stopProcessing="true">
                    <match url="^test.php(.*)$" ignoreCase="false" />
                    <action type="Rewrite" url="app/webroot/test.php{R:1}" />
                </rule>
                <rule name="Exclude direct access to app/webroot/*"
                  stopProcessing="true">
                    <match url="^app/webroot/(.*)$" ignoreCase="false" />
                    <action type="None" />
                </rule>
                <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                  stopProcessing="true">
                    <match url="^(img|css|files|js|favicon.ico)(.*)$" />
                    <action type="Rewrite" url="app/webroot/{R:1}{R:2}"
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
```

一旦 IIS フレンドリーな書き換えルールを含む web.config が作成されれば、CakePHP のリンク、
CSS、JS、再ルーティング (*rerouting*) は正しく動作するでしょう。

## lighttpd での URL 書き換え

lighttpd は .htaccess 機能をサポートしていません。
そのため、あなたは全ての .htaccess ファイルを取り除かなければなりません。

lighttpd の設定において「mod_rewrite」の機能がアクティブになっていることを確認し、
次の行を追記して下さい。

``` text
url.rewrite-if-not-file =(
    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
)
```

## Hiawatha での URL 書き換え規則

Hiawathe で CakePHP を使うために必要な (URL 書き換えのための) UrlToolkit 規則は:

``` css
UrlToolkit {
   ToolkitID = cakephp
   RequestURI exists Return
   Match .* Rewrite /index.php
}
```

## URL リライティングを使わない/使えない場合

もし、URL リライティングを使いたくなかったり使えなかったりする場合は、
[core configuration](../development/configuration#core-configuration-baseurl) を参照してください。
