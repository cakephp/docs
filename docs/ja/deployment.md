# デプロイ

アプリケーションが完成したら、またはその前に、それをデプロイしたいと思うことでしょう。
CakePHP アプリケーションをデプロイする際には、いくつかやっておかなければならないことがあります。

<a id="check-your-security"></a>

## セキュリティの確認

デプロイする前に、少なくとも次の点を確認してください。詳しくは [セキュリティ](/ja/security/) の章と
[セキュリティチェックリスト](/ja/security/hardening) で説明しています。

- 本番環境で `debug` が `0` になっていること。[core.php の更新](#update-core-php) を参照してください。
- `Security.salt` と `Security.cipherSeed` がアプリケーション固有の秘密の値になっていて、
  `CookieComponent` が暗号化方式 `'aes'` を使っていること。
  [コア設定](development/configuration#cakephp-のコア設定) と
  [CookieComponent の暗号化方式](security/fixes#cookiecomponent-の-cipher-タイプ) を参照してください。
- ドキュメントルートが `webroot/` ディレクトリだけであること。[ドキュメントルートの指定](#set-document-root) と
  [Web サーバーの設定](installation/url-rewriting) を参照してください。
- アプリケーションを HTTPS だけで提供していること。[HTTPS の使用](#use-https) を参照してください。
- [セキュリティコンポーネント](core-libraries/components/security-component) で、フォームの改ざんと CSRF を防いでいること。
- 入力を [データバリデーション](models/data-validation) で検証していること。
- 出力を `h()` でエスケープし、ユーザーが書いた HTML はメンテナンスされている無害化ライブラリに通していること。
  [出力時のエスケープと HTML の無害化](/ja/security/escaping-and-sanitizing-html) を参照してください。
- 依存パッケージが最新で、開発用のパッケージを除いてインストールしていること。
  [本番用の依存パッケージのインストール](#install-dependencies-for-production) を参照してください。
- ウェブサーバが書き込めるのは `tmp/` と `logs/` だけであること。
  [ファイルのパーミッションの設定](#set-file-permissions) を参照してください。
- 秘密の情報をリポジトリのファイルではなく環境変数から読み込んでいること。
  [環境変数](development/configuration#environment-variables) を参照してください。

<a id="set-document-root"></a>

## ドキュメントルートの指定

アプリケーションでドキュメントルートを正しく指定することはコードをセキュアに、
またアプリケーションを安全に保つために重要なステップの内の一つです。CakePHP のアプリケーションは、
アプリケーションの `webroot/` ディレクトリ (従来の構成では `app/webroot/`) にドキュメントルートを指定する必要があります。
これによってアプリケーション、設定のファイル、そして `vendor/` にある Composer のパッケージに URL を通してアクセスすることができなくなります。
ドキュメントルートの指定の仕方はウェブサーバーごとに異なります。
WEBサーバー特有の情報については [Web サーバーの設定](installation/url-rewriting) ドキュメントを見てください。

どの場合においても `webroot/` をバーチャルホスト（バーチャルドメイン）のドキュメントルートに
設定すべきでしょう。これは webroot ディレクトリの外側のファイルを実行される可能性を取り除きます。

> [!WARNING]
> 開発用や共用のサーバであっても、ドキュメントルートをプロジェクトのディレクトリに設定してはいけません。
> そうすると `.env`、`.git/config`、`composer.json`、`config/*.default`、`logs/error.log`、テンプレート、
> `tmp/` や `vendor/` のファイルがダウンロードできてしまいます。従来の構成のルートにある `.htaccess`
> ファイルがこれらを守るのは mod_rewrite が有効な間だけです。
> [従来のルートの .htaccess ファイル](installation/url-rewriting#legacy-root-htaccess) を参照してください。

<a id="install-dependencies-for-production"></a>

## 本番用の依存パッケージのインストール

Bake や DebugKit、PHPUnit などの開発用の依存パッケージを除き、最適化したオートローダーで
Composer のパッケージをインストールします。

```bash
composer install --no-dev --optimize-autoloader
```

`config/bootstrap.php` で開発用のプラグインを読み込んでいる場合は、インストールされているときだけ読み込むようにします。

```php
// config/bootstrap.php
if (is_dir(ROOT . DS . 'plugins' . DS . 'DebugKit')) {
    CakePlugin::load('DebugKit');
}
```

<a id="update-core-php"></a>

## core.php の更新

`config/core.php` (従来の構成では `app/Config/core.php`) の更新、とりわけ `debug` 値は非常に重要です。 debug = 0 にすることで、
広くインターネットに晒されることがあってはならない多くの開発用の機能を無効にできます。
debug の無効化は以下の種々のものごとに変更を与えます。

- `pr()` と `debug()` で生成されるデバッグメッセージが無効化されます。
- CakePHP コアのキャッシュが、開発時の 10 秒ごとの代わりに 999 日ごとに破棄されるようになります。
- Error ビューが吐く情報が少なくなり、代わりに共通のエラーメッセージが与えられます。
- エラーが表示されなくなります。
- 例外のスタックトレースが無効になります。

上記に加えて、プラグインやアプリケーションの拡張が `debug` を用いてその挙動を変えます。

デバッグレベルを環境変数から読み込むようにすると、環境ごとにデバッグレベルを設定できます。
これにより、debug \> 0 のままアプリケーションを本番環境へデプロイしてしまうことを防げ、
デプロイのたびにデバッグレベルを変更する手間も省けます。

`pieceofcake2/app` スケルトンから作成したアプリケーションは、デバッグレベルを環境変数 `DEBUG`
から読み込み、セットされていない場合はデバッグレベル 2 を使います。本番サーバーでは、
たとえば Apache の設定で `0` にセットします。

```apache
SetEnv DEBUG 0
```

nginx と PHP-FPM では、`index.php` を PHP-FPM に渡す `location` ブロックか、PHP-FPM のプールの設定でセットします。
`clear_env` が `no` でない限り、PHP-FPM はサーバの環境変数を PHP に渡しません。

```nginx
fastcgi_param DEBUG 0;
```

```ini
; PHP-FPM のプール。たとえば /etc/php/8.3/fpm/pool.d/www.conf
env[DEBUG] = 0
```

> [!WARNING]
> `DEBUG` がセットされていないと、スケルトンはデバッグレベル 2 で動作します。スタックトレースや SQL クエリ、
> 設定の詳細が表示され、ブラウザ用のテストランナー `webroot/test.php` も有効になります。
> すべての本番サーバで `DEBUG` が `0` になっていることを確認してください。

ほかのアプリケーションでは、`config/core.php` で環境変数を読み込みます。

```php
// config/core.php
Configure::write('debug', (int)env('DEBUG'));
```

セキュリティ用のソルトやデータベースの認証情報など、スケルトンが環境変数から読み込むほかの設定は
[環境変数](development/configuration#environment-variables) に一覧があります。本番環境では、
`.env` ファイルではなく実際の環境変数としてセットするか、AWS Systems Manager パラメータストアなどの
シークレットストアから読み込んでください ([設定と秘密の情報](deployment/aws-lambda#configuration-and-secrets) を参照)。
実際の環境変数は、スケルトンが開発時に読み込む `.env` ファイルより常に優先されます。
秘密の情報はリポジトリにコミットせず、ログにも出力しないでください。

## 必要なものだけをデプロイする

`.git/` ディレクトリや `.env` ファイル、`tests/` などの開発用のファイルを除いてアプリケーションをデプロイし、
ブラウザでテストを実行するためだけに使う `webroot/test.php` は削除します。ドキュメントルートの外にあっても
これらのファイルはサーバに必要なく、`.git/` や `.env` には秘密の情報が含まれていることがあります。

<a id="set-file-permissions"></a>

## ファイルのパーミッションの設定

ウェブサーバのユーザが書き込む必要があるのは、[パーミッション](installation#permissions) で説明した
`tmp/` と `logs/` だけです。`config/` や `webroot/` を含むほかのファイルはデプロイ用のユーザの所有にし、
ウェブサーバからは読み取りだけができるようにします。`tmp/` と `logs/` への書き込みは、そのページの `setfacl`
コマンドや、共通のグループとモード `770` などを使って、ウェブサーバのユーザ (とコンソールコマンドを実行するユーザ)
にだけ許可します。`chmod 777` は決して使わないでください。サーバのすべてのユーザがファイルを変更できるようになってしまいます。

## アップロードされたファイルの保護

アップロードされたファイルは、できるだけ `webroot/` の外に保存し、ユーザが見てもよいかを確認してから
コントローラで送信します。アップロードを `webroot/` に置く必要がある場合は、そこにある PHP ファイルを
ウェブサーバが決して実行しないように設定します。[Apache](installation/url-rewriting#apache-and-mod-rewrite-and-htaccess)
(手順 5) と [nginx](installation/url-rewriting#pretty-urls-on-nginx) を参照してください。

<a id="use-https"></a>

## HTTPS の使用

アプリケーションは HTTPS だけで提供し、HTTP のリクエストは HTTPS にリダイレクトします。
CakePHP は、サーバ変数 `HTTPS` がセットされているとセッションクッキーに `secure` を付けます。
TLS を終端するロードバランサやプロキシの背後では、たいていこの変数がセットされないので、
クッキーのオプションを自分で設定します。

```php
// config/core.php
Configure::write('Session', [
    'defaults' => 'php',
    'ini' => [
        'session.cookie_secure' => true,
    ],
]);
```

セキュリティ修正が提供されている PHP のバージョンを使ってください。
[サポートされているバージョン](https://www.php.net/supported-versions.php) を参照してください。

## デプロイ後のキャッシュのクリア

デバッグレベル 0 では、CakePHP はモデルのスキーマなどのコアのデータを長期間キャッシュします。
新しいバージョンをデプロイした後は、特にデータベースのスキーマを変更した場合、`tmp/cache/models/`、
`tmp/cache/persistent/`、`tmp/cache/views/` のキャッシュファイルを削除するか、
アプリケーションが使うキャッシュの設定をクリアしてください。`opcache.validate_timestamps=0` で OPcache を
設定している場合は、新しいコードを読み込むように PHP-FPM もリロードしてください。

## アプリケーションのパフォーマンスの向上

プラグインの画像や JavaScript、CSS ファイルなどの静的なアセットを扱う場合、
ディスパッチャを通すことはかなりの非効率です。
本番環境においては、次のようにシンボリックリンクを張ることを強くお勧めします。

```bash
ln -s ../../plugins/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css
```

従来の構成では、プラグインは `app/Plugin/` または `plugins/` に、webroot は `app/webroot/` にあります。

<a id="deploying-to-aws-lambda"></a>

## AWS Lambda へのデプロイ

CakePHP 2 アプリケーションは、Bref と Docker コンテナイメージを使って、サーバーを管理せずに
AWS Lambda で動かすこともできます。アプリケーションに必要な変更、セッション、キャッシュ、メール、
ファイルに使う AWS のサービス、GitHub Actions からのデプロイについては
[AWS Lambda へのデプロイ](deployment/aws-lambda) を参照してください。
