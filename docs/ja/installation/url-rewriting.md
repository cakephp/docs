# URLリライティング

このページの例ではすべて、[インストール](../installation) で説明したとおり、ウェブサーバのドキュメントルートが
アプリケーションの `webroot/` ディレクトリ (従来の構成では `app/webroot/`) を指しているものとします。
`webroot/` に存在しないファイルへのリクエストは、すべて `webroot/index.php` に渡されます。

## Apache と mod_rewrite (と.htaccess)

CakePHP は、展開した状態では mod_rewrite を使用するようになっており、
自分のシステムでうまく動作するまで苦労するユーザもいます。

ここでは、正しく動作させるために行うことをいくつか示します。まず始めに
Apache の設定ファイルを見てください。設定ファイルの場所はディストリビューションによって異なります。
バーチャルホストの設定ファイルなど、自分のサイトに対応する設定を編集していることを確かめてください。

1.  .htaccess のオーバーライドが許可されていること、正確な DocumentRoot に対して
    AllowOverride が All に設定されていることを確かめてください。
    以下のようなものになるはずです。

    ``` text
    <Directory /var/www/my_app/webroot>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ```

    Debian や Ubuntu では、バーチャルホストは `/etc/apache2/sites-available/` で設定します。
    ドキュメントルートに対する `AllowOverride None` が `AllowOverride All` に変更されていることを確かめてください。

2.  mod_rewrite を正しく読み込んでいることを確認してください。
    以下のようになるはずです。

        LoadModule rewrite_module libexec/apache2/mod_rewrite.so

    多くのシステムではこれらはデフォルトで (先頭に# を付けられて) コメントアウトされています。
    従って、先頭の \# 記号を取り除く必要があるかもしれません。
    Debian や Ubuntu では、代わりに `a2enmod rewrite` を実行します。

    変更をした後、設定が有効であることを確かめるため Apache を再起動してください。

3.  .htaccess ファイルが実際に `webroot/` にあるかを確かめてください。
    いくつかのオペレーティングシステムやツールでは「.」で始まるファイルを
    隠しファイルとして扱うため、コピーされないことがあります。
    アプリケーションスケルトンの `.htaccess` ファイルは次のとおりです。

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    2 行目は HTTP の `Authorization` ヘッダーを PHP に渡すためのものです。
    PHP を FastCGI で動かしている場合に、HTTP の Basic 認証や Digest 認証で必要になります。

    従来の `app/` 構成のアプリケーションには、リクエストを `app/webroot/` に転送する `.htaccess` ファイルが
    プロジェクトルートと `app/` にもあります。これらはドキュメントルートを `app/webroot/` に設定していない場合にだけ使われます。

    ユーザディレクトリ (<https://example.com/~username/my_app/>) や、既に mod_rewrite を
    活用している URL 構成に CakePHP をインストールする場合は、`webroot/` の `.htaccess` ファイルに
    `RewriteBase` ステートメントを追加する必要があります。
    RewriteEngine ディレクティブと同じセクションに追加できるので、
    たとえば webroot の .htaccess ファイルは次のようになります。

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /~username/my_app
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    この変更の詳細は設定に依り、CakePHP とは関係ない事柄も含むことがあります。
    詳しくは [Apache のドキュメント](https://httpd.apache.org/docs/current/ja/mod/mod_rewrite.html) を参照するようにしてください。

4.  (オプション) プロダクション環境の設定では、CakePHP で処理するのが不適切なアセットは、
    CakePHP を通さないようにしましょう。webroot の .htaccess ファイルを次のように
    修正してください。

    ``` text
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_URI} !^/(img|css|js)/(.*)$
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    上の例は、正しくないアセットを index.php へ送信せず、ウェブサーバの 404 ページを表示します。

    また、HTML で 404 ページを作成することもできますし、 `ErrorDocument` ディレクティブへ
    追記することで、CakePHP のビルトインの 404 ページを使うこともできます。

        ErrorDocument 404 /404-not-found

## nginx でのきれいな URL

nginx は Apache のように .htaccess ファイルを使わないため、
サイトの設定ファイルで URL の書き換えを設定する必要があります。
セットアップによりますが、以下を書き換える必要があるでしょう。
少なくとも、PHP を PHP-FPM で動かす必要があります。

``` text
server {
    listen 80;
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 80;
    server_name example.com;

    # root ディレクティブはグローバルに指定する
    root /var/www/my_app/webroot;
    index index.php;

    access_log /var/log/nginx/my_app.access.log;
    error_log /var/log/nginx/my_app.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

従来の構成では、`root` に `app/webroot` ディレクトリを指定します。

> [!NOTE]
> PHP-FPM のソケットのパスはディストリビューションや PHP のバージョンによって異なります
> (例: `/run/php/php8.3-fpm.sock`)。PHP-FPM が TCP ポートで待ち受けている場合は
> `fastcgi_pass 127.0.0.1:9000;` を使います。502 Bad Gateway エラーが出る場合は、たいてい
> `fastcgi_pass` が PHP-FPM の設定と合っていません。

## IIS (Windows ホスト) での URL 書き換え

IIS は .htaccess ファイルをネイティブではサポートしていません。
代わりに [URL Rewrite モジュール](https://www.iis.net/downloads/microsoft/url-rewrite) を使って
同じ書き換えを設定できます。次の手順に従ってください。

1.  [URL Rewrite モジュール](https://www.iis.net/downloads/microsoft/url-rewrite) をインストールしてください。
2.  サイトの物理パスをアプリケーションの `webroot/` ディレクトリに設定し、そこに web.config という新しいファイルを作成してください。
3.  XML を扱えるエディタを使って、以下のコードを web.config ファイルにコピーしてください。

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Rewrite requested file/folder to index.php"
                  stopProcessing="true">
                    <match url="^(.*)$" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
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

lighttpd の設定で `server.document-root` を `webroot/` ディレクトリに設定し、
「mod_rewrite」の機能がアクティブになっていることを確認したうえで、次の行を追記して下さい。

``` text
url.rewrite-if-not-file =(
    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3"
)
```

## Hiawatha での URL 書き換え規則

Hiawatha で CakePHP を使うために必要な (URL 書き換えのための) UrlToolkit 規則は次のとおりです。

``` text
UrlToolkit {
   ToolkitID = cakephp
   RequestURI exists Return
   Match .* Rewrite /index.php
}
```

## URL リライティングを使わない/使えない場合

もし、URL リライティングを使いたくなかったり使えなかったりする場合は、
[コアの設定](../development/configuration#core-configuration-baseurl) を参照してください。
