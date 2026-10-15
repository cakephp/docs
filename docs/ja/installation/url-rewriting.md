# Web サーバーの設定

このページでは、CakePHP アプリケーションのための Apache、nginx などの Web サーバーの設定を説明します。
ドキュメントルート、URL の書き換え、アプリケーションのファイルを公開しないための設定を扱います。

## ドキュメントルート {#document-root}

[インストール](../installation#configuring-the-web-server) で説明したとおり、開発環境でも本番環境でも、
Web サーバーのドキュメントルートはアプリケーションの `webroot/` ディレクトリ (従来の構成では `app/webroot/`)
に設定します。`webroot/` に存在しないファイルへのリクエストは、すべて `webroot/index.php` に渡されます。

> [!WARNING]
> ドキュメントルート、`Alias`、`location` で、プロジェクトのディレクトリや `webroot/` より上のディレクトリを
> 指定しないでください。指定すると、`config/` の設定、ソースコード、`vendor/`、`tmp/` のキャッシュや
> セッションのファイル、`logs/` のログファイル、`.env` ファイル、`.git/` ディレクトリがダウンロードでき、
> `vendor/` の PHP ファイルを直接実行できてしまいます。

## Apache と mod_rewrite (と.htaccess) {#apache-and-mod-rewrite-and-htaccess}

アプリケーションスケルトンには、すべてのリクエストを `index.php` に送る `webroot/.htaccess` ファイルがあります。
このファイルには mod_rewrite と、`.htaccess` ファイルを許可するバーチャルホストが必要です。
例では Apache 2.4 のアクセス制御ディレクティブを使っています。Apache 2.2 については
[Apache 2.2 (レガシー)](#apache-2-2) を参照してください。

1.  バーチャルホストを設定します。設定ファイルの場所はディストリビューションによって異なります。
    Debian や Ubuntu では、バーチャルホストは `/etc/apache2/sites-available/` で設定します。
    アプリケーションのバーチャルホストは次のようになります。

    ```apache
    <VirtualHost *:443>
        ServerName example.com
        DocumentRoot /var/www/my_app/webroot

        SSLEngine on
        SSLCertificateFile /etc/ssl/certs/example.com.pem
        SSLCertificateKeyFile /etc/ssl/private/example.com.key

        <Directory /var/www/my_app/webroot>
            Options -Indexes -MultiViews +FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

        # .well-known/ を除き、.htaccess や .git などの隠しファイルとディレクトリを拒否する
        <FilesMatch "^\.">
            Require all denied
        </FilesMatch>
        <DirectoryMatch "/\.(?!well-known/)">
            Require all denied
        </DirectoryMatch>
    </VirtualHost>

    <VirtualHost *:80>
        ServerName example.com
        Redirect permanent / https://example.com/
    </VirtualHost>
    ```

    - `AllowOverride All` で、`.htaccess` ファイルから mod_rewrite を使えるようにします。
      Apache 2.3.9 以降、`AllowOverride` のデフォルトは `None` です。多くのディストリビューションでも
      `/var/www` に対して `None` が設定されており、その場合はトップページだけが動き、ほかの URL はすべて 404 になります。
      許可する範囲を狭めたい場合、スケルトンの `.htaccess` ファイルに必要なのは `AllowOverride FileInfo` だけです。
    - `-Indexes` はディレクトリの一覧表示を無効にします。ディストリビューションによっては `/var/www` で
      有効になっています。ドキュメントルートに `+Indexes` は決して指定しないでください。
      `-MultiViews` はコンテントネゴシエーションを無効にします。有効なままだと、`/posts` へのリクエストに
      `posts.html` などのファイルが返されることがあります。
    - `.htaccess` で mod_rewrite を使うには `FollowSymLinks` か `SymLinksIfOwnerMatch` が必要です。
      ほかのユーザが `webroot/` にファイルを作れるサーバでは、`+SymLinksIfOwnerMatch` のほうが安全です。
      これはリンクとリンク先の所有者が同じ場合にだけシンボリックリンクをたどるので、
      プラグインのアセットへのシンボリックリンクがリンク先と同じユーザの所有になっていることを確かめてください。
    - 1 行の `Options` では、すべてのオプションに `+` か `-` を付けるか、どれにも付けないかのどちらかにしてください。
      `Options -Indexes FollowSymLinks` のように混在させると、Apache 2.4 は起動しません。
    - `FilesMatch` と `DirectoryMatch` のセクションは隠しファイルを拒否します。証明書の検証のため、
      `.well-known/` は許可します。
    - 2 つ目のバーチャルホストは HTTP を HTTPS にリダイレクトします。証明書には、Let's Encrypt などで
      取得したサイトの証明書を使ってください。mod_ssl を有効にする必要があります。

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

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On

        # Pass the Authorization header to PHP when it runs as CGI or FastCGI
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

        # Send every request that is not for an existing file to index.php,
        # including requests for directories, so that Apache never lists the
        # contents of a directory such as files/ or css/.
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    最初のルールは HTTP の `Authorization` ヘッダーを PHP に渡します。PHP を FastCGI (PHP-FPM)
    で動かしている場合に、HTTP の Basic 認証や Digest 認証、API トークンで必要になります。
    Apache 2.4.13 以降で mod_proxy_fcgi を使っている場合は、`<Directory>` セクションに
    `CGIPassAuth On` を書いても同じことができます。

    最後のルールは、存在するファイル以外へのリクエストをすべて `index.php` に送ります。
    `index.php` はリクエストされた URL を `REQUEST_URI` から読み取ります。以前のスケルトンには
    `RewriteCond %{REQUEST_FILENAME} !-d` の行もありました。この行があると、`/files/` などのディレクトリへの
    リクエストは Apache が処理し、`-Indexes` を指定していなければ中身の一覧を表示します。
    現在のスケルトンや CakePHP 4、5 のアプリケーションスケルトンと同じように、この行は削除してください。

    ユーザディレクトリ (<https://example.com/~username/my_app/>) や、既に mod_rewrite を
    活用している URL 構成に CakePHP をインストールする場合は、`webroot/` の `.htaccess` ファイルに
    `RewriteBase` ステートメントを追加する必要があります。
    RewriteEngine ディレクティブと同じセクションに追加できるので、
    たとえば webroot の .htaccess ファイルは次のようになります。

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /~username/my_app
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    この変更の詳細は設定に依り、CakePHP とは関係ない事柄も含むことがあります。
    詳しくは [Apache のドキュメント](https://httpd.apache.org/docs/current/ja/mod/mod_rewrite.html) を参照するようにしてください。

    バーチャルホストを変更できない場合は、`.htaccess` でほかのルールより前に HTTP から HTTPS へリダイレクトすることもできます。
    TLS を終端するロードバランサーの後ろでは、`%{HTTPS}` の代わりに `X-Forwarded-Proto` ヘッダーを確認してください。

    ```apache
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    ```

4.  (オプション) プロダクション環境の設定では、CakePHP で処理するのが不適切なアセットは、
    CakePHP を通さないようにしましょう。webroot の .htaccess ファイルを次のように
    修正してください。

    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_URI} !^/(img|css|js)/(.*)$
        RewriteRule ^ index.php [L]
    </IfModule>
    ```

    上の例は、正しくないアセットを index.php へ送信せず、ウェブサーバの 404 ページを表示します。

    また、HTML で 404 ページを作成することもできますし、 `ErrorDocument` ディレクティブへ
    追記することで、CakePHP のビルトインの 404 ページを使うこともできます。

        ErrorDocument 404 /404-not-found

5.  アップロードされたファイルを `webroot/files/` など `webroot/` の中に保存するアプリケーションでは、
    そこにある PHP ファイルを Apache が決して実行しないようにします。バーチャルホストに次の設定を追加してください。

    ```apache
    <Directory /var/www/my_app/webroot/files>
        <FilesMatch "\.(php|phar|phtml)(\.|$)">
            Require all denied
        </FilesMatch>
    </Directory>
    ```

    このパターンは、PHP ハンドラの設定によっては PHP として実行される `evil.php.jpg` のような名前にも一致します。
    アップロードされたファイルを `webroot/` の外に保存し、ユーザに閲覧が許されていることを確認してから
    コントローラで送信するほうがさらに安全です。

### 従来のルートの .htaccess ファイル {#legacy-root-htaccess}

本家の CakePHP 2 のアプリケーションには、リクエストを `app/webroot/` に転送する `.htaccess` ファイルが
プロジェクトルートと `app/` にあります。これはドキュメントルートがプロジェクトのディレクトリの場合でも
アプリケーションを動かすためのものです。

> [!WARNING]
> これらのファイルに頼らないでください。これらが働くのは、mod_rewrite が読み込まれていて、
> `AllowOverride` で許可されている場合だけです。そうでない場合、Apache は書き換え規則を無視して
> プロジェクトのディレクトリ全体を公開するので、たとえば次のファイルがダウンロードまたは実行できてしまいます。
>
> - `.env` ファイルと `.git/` ディレクトリ (`.git/config` やソースコードの全履歴を含む)
> - `composer.json`、`composer.lock` と `vendor/` のファイル。`vendor/` の PHP ファイルは直接実行できます
> - `app/Config/` の設定。`database.php.default`、`email.php.default` など、PHP 以外のファイルすべて
> - テンプレート (`.ctp`)。ソースコードのまま表示されます
> - `app/tmp/logs/` のログファイルと `app/tmp/` のキャッシュやセッションのファイル。個人情報やセッション ID を含むことがあります
> - `Indexes` が有効な場合は、これらすべてのディレクトリの一覧
>
> ドキュメントルートは必ず `app/webroot/` (モダンな構成では `webroot/`) に設定し、ルートと `app/` の
> `.htaccess` ファイルは削除してください。こうしておけば、設定を誤ったときにファイルが公開されるのではなく、エラーになります。

### Apache 2.2 (レガシー) {#apache-2-2}

Apache 2.2 は 2017 年にサポートが終了 (EOL) し、セキュリティ修正も提供されていません。Apache 2.4 にアップグレードしてください。
どうしても設定する必要がある場合は、`Require` ディレクティブを `Order`、`Allow`、`Deny` に置き換えます。
スケルトンの `.htaccess` ファイルはどちらのバージョンでも動きます。これらの例はこのプロジェクトではテストしていません。

```apache
<Directory /var/www/my_app/webroot>
    Options -Indexes -MultiViews +FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
</Directory>

<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

<Directory /var/www/my_app/webroot/files>
    <FilesMatch "\.(php|phar|phtml)(\.|$)">
        Order allow,deny
        Deny from all
    </FilesMatch>
</Directory>
```

Apache 2.4 では、`Order`、`Allow`、`Deny` は mod_access_compat がある場合にだけ動きます。
1 つのセクションで `Require` と混在させると、予期しない結果になります。
両方のバージョンで動かす必要がある設定では、Apache 2.4 にだけある mod_authz_core の有無で分岐できます。
次の例は Apache 2.4 でだけテストしています。

```apache
<Directory /var/www/my_app/webroot>
    Options -Indexes -MultiViews +FollowSymLinks
    AllowOverride All
    <IfModule mod_authz_core.c>
        Require all granted
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Allow from all
    </IfModule>
</Directory>
```

## nginx でのきれいな URL {#pretty-urls-on-nginx}

nginx は Apache のように .htaccess ファイルを使わないため、
サイトの設定ファイルで URL の書き換えを設定する必要があります。
セットアップによりますが、以下を書き換える必要があるでしょう。
少なくとも、PHP を PHP-FPM で動かす必要があります。

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # root ディレクティブはグローバルに指定する
    root /var/www/my_app/webroot;
    index index.php;

    access_log /var/log/nginx/my_app.access.log;
    error_log /var/log/nginx/my_app.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # フロントコントローラ webroot/index.php だけを実行する。webroot/files/ に
    # アップロードされたファイルなど、ほかの .php ファイルは実行しない。
    location ~ ^/index\.php(/|$) {
        fastcgi_split_path_info ^(/index\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    location ~ \.php$ {
        return 404;
    }

    # .well-known/ を除き、.htaccess や .git などの隠しファイルを拒否する
    location ~ /\.(?!well-known/) {
        deny all;
    }
}
```

従来の構成では、`root` に `app/webroot` ディレクトリを指定します。

この設定は次のことを行います。

- HTTP を HTTPS にリダイレクトします。証明書には、Let's Encrypt などで取得したサイトの証明書を使ってください。
- 存在するファイル以外へのリクエストを、クエリ文字列とともにすべて `index.php` に送ります。
  nginx は `autoindex` を有効にしない限りディレクトリの一覧を表示しないので、`/files/` などのディレクトリへの
  リクエストは 403 になります。
- PHP-FPM に渡すのは `index.php` だけです。`webroot/test.php` を含め、ほかの `.php` ファイルへのリクエストは 404 を返すので、
  PHP の `cgi.fix_pathinfo` の設定にかかわらず、`webroot/` にアップロードされた PHP ファイルが実行されることはありません。
  `evil.php.jpg` のようなファイルも静的ファイルとして送られ、実行されません。
  `fastcgi_split_path_info` は、`/index.php/posts/view/1` のような URL のために `PATH_INFO` をセットします。
  この URL は [App.baseUrl](../development/configuration#core-configuration-baseurl) を設定したときに CakePHP が使います。
- `.htaccess` や `.git/` などの隠しファイルを拒否します。証明書の検証のため `.well-known/` は許可します。

既存の `.php` ファイルをすべて PHP-FPM に渡す汎用的な `location ~ \.php$` ブロックは使わないでください。
`webroot/` にアップロードされた PHP ファイルがすべて実行されてしまいます。ファイルの有無を `if` ブロックで
確認する必要はありません。`try_files` がそれを行います。nginx のバージョンを表示したくない場合は、
`http` ブロックに `server_tokens off;` を追加します。

> [!NOTE]
> PHP-FPM のソケットのパスはディストリビューションや PHP のバージョンによって異なります
> (例: `/run/php/php8.3-fpm.sock`)。PHP-FPM が TCP ポートで待ち受けている場合は
> `fastcgi_pass 127.0.0.1:9000;` を使います。502 Bad Gateway エラーが出る場合は、たいてい
> `fastcgi_pass` が PHP-FPM の設定と合っていません。

## IIS (Windows ホスト) での URL 書き換え

::: warning
この節は参考のために本家のドキュメントから残しているもので、このプロジェクトではテストしていません。
PHP アプリケーションには nginx か Apache をお勧めします。IIS を使う場合も nginx や Apache と同じ規則を適用し、
サイトは `webroot/` だけを指すようにして、アップロード用のディレクトリにある PHP ファイルを IIS が実行しないようにしてください。
:::

IIS は .htaccess ファイルをネイティブではサポートしていません。
代わりに [URL Rewrite モジュール](https://www.iis.net/downloads/microsoft/url-rewrite) を使って
同じ書き換えを設定できます。次の手順に従ってください。

1.  [URL Rewrite モジュール](https://www.iis.net/downloads/microsoft/url-rewrite) をインストールしてください。
2.  サイトの物理パスをアプリケーションの `webroot/` ディレクトリに設定し、そこに web.config という新しいファイルを作成してください。
3.  XML を扱えるエディタを使って、以下のコードを web.config ファイルにコピーしてください。

```xml
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

IIS 向けの書き換えルールを含む web.config を作成すれば、CakePHP のリンク、
CSS、JavaScript、再ルーティング (*rerouting*) は正しく動作するでしょう。

## lighttpd での URL 書き換え

::: warning
この節は参考のためだけに残しているもので、このプロジェクトではテストしていません。
PHP アプリケーションには nginx か Apache をお勧めします。
:::

lighttpd は .htaccess の機能をサポートしていないので、.htaccess ファイルはすべて削除してかまいません。
lighttpd の設定で `server.document-root` を `webroot/` ディレクトリに設定し、mod_access、mod_rewrite、
mod_fastcgi を有効にして、PHP には `index.php` だけを渡します。lighttpd 1.4.50 以降では次のようになります。

```text
server.document-root = "/var/www/my_app/webroot"
index-file.names = ("index.php")

fastcgi.server = (
    "/index.php" => ((
        "socket" => "/run/php/php-fpm.sock",
        "check-local" => "disable"
    ))
)

# .well-known/ 以外の隠しファイルと、index.php 以外の PHP ファイルを拒否する
$HTTP["url"] =~ "/\.(?!well-known/)" {
    url.access-deny = ("")
}
$HTTP["url"] =~ "\.php$" {
    $HTTP["url"] !~ "^/index\.php$" {
        url.access-deny = ("")
    }
}

url.rewrite-if-not-file = ("" => "/index.php${qsa}")
```

以前の例では `/index.php?url=$1` に書き換えていました。CakePHP 2 は URL を `REQUEST_URI` から読み取るので
`url` パラメータは不要で、`$this->request->query` に余計な値が入るだけです。

## URL リライティングを使わない/使えない場合

もし、URL リライティングを使いたくなかったり使えなかったりする場合は、
[コアの設定](../development/configuration#core-configuration-baseurl) を参照してください。
その場合も、ドキュメントルートは `webroot/` に設定してください。
