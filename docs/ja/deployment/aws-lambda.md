# AWS Lambda へのデプロイ

[AWS Lambda](https://aws.amazon.com/lambda/) は、サーバーを管理せずに必要なときだけコードを
実行するサービスです。[Bref](https://bref.sh/) を使うと、CakePHP 2 アプリケーションは従来の
サーバーと同じように PHP-FPM で Lambda 上で動きます。すべての HTTP リクエストは
`webroot/index.php` に渡され、`bin/cake` のコマンドは別の関数で実行します。

このページでは、[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンから作成した
アプリケーションを Bref 3 と Docker コンテナイメージでデプロイする方法、ほかの AWS サービス
(S3、DynamoDB、SES、RDS、SSM パラメータストア) との連携、GitHub Actions からデプロイする方法を
説明します。AWS の基本と [Bref のドキュメント](https://bref.sh/docs) の内容を知っていることを
前提とします。[デプロイ](../deployment) のページの一般的な注意も当てはまります。

<a id="when-lambda-fits"></a>

## Lambda が適している場合

Lambda は、アクセスが不規則なアプリケーションや急に増えるアプリケーション、社内ツール、API に
向いています。料金はリクエストごとで、スケーリングは自動で行われ、パッチを当てるサーバーも
ありません。次の制約に注意してください。

- ファイルシステムは `/tmp` を除いて読み取り専用です。`/tmp` は Lambda のインスタンスごとに
  別々で、インスタンスの起動時には空です。セッション、アップロードされたファイル、共有する
  キャッシュはほかのサービスに置く必要があります。
- HTTP のリクエストとレスポンスは 6 MB までで、API Gateway は 30 秒で応答を待つのをやめます。
- 新しいインスタンスの起動には少し時間がかかります (*コールドスタート*)。Bref のドキュメントに
  よると、Bref のランタイムで約 250 ms、それにアプリケーションの読み込み時間が加わります。
- Lambda はインスタンスを増やしてスケールし、インスタンスはそれぞれデータベースに接続します。

ローカルのファイルシステムに書き込むアプリケーション、時間のかかるリクエストや長時間の接続
(WebSocket、ストリーミング) を使うアプリケーションは、変更が必要です。ECS のコンテナや従来の
サーバーのほうが適している場合もあります。

<a id="requirements"></a>

## 必要なもの

- `pieceofcake2/app` スケルトン (モダンな構成) をもとにしたアプリケーション、または同じ設定を
  した既存のアプリケーション。従来の `app/` 構成でパスが異なるところは、その都度説明します。
- PHP 8.2 以降。Bref 3 はそれより古いバージョンに対応していません。例では PHP 8.4 を使います。
- イメージをビルドするための [Docker](https://www.docker.com/)。
- Node.js と Serverless CLI。Bref はデプロイツールとして、Bref のメンテナーがメンテナンスしている
  Serverless Framework v3 のオープンソースのフォーク
  [OSS Serverless](https://github.com/oss-serverless/osls) (`osls`) を使います。有料サービスの
  [Bref Cloud](https://bref.sh/cloud) でも同じ `serverless.yml` をデプロイできます。
- AWS アカウントと、CloudFormation のスタックをデプロイできる認証情報。

例ではサービス名に `my-cake-app`、リージョンに `ap-northeast-1` を使います。自分の値に
置き換えてください。

<a id="how-it-works"></a>

## 仕組み

デプロイされるものは次のとおりです。

- Bref の `bref/php-84:3` イメージをもとにした Docker イメージ。PHP と Bref のランタイムを含み、
  アプリケーションは `/var/task` にコピーします。
- イメージを `fpm` ランタイムで実行する `web` 関数。API Gateway (HTTP API) がすべての HTTP
  リクエストを関数に送り、Bref がそれを PHP-FPM に渡して `webroot/index.php` を実行します。
- 同じイメージを `console` ランタイムで実行する `console` 関数。呼び出しのたびに、スケジュールや
  `serverless bref:cli` コマンドから渡された引数で `php bin/cake` を実行します。
- セッション用の DynamoDB テーブルやアップロードされたファイル用の S3 バケットなど、同じ
  `serverless.yml` で定義するほかの AWS リソース。

Serverless CLI がイメージをビルドして Amazon ECR にプッシュし、すべてを CloudFormation の
スタックとしてデプロイします。`webroot/` の静的なファイルは PHP-FPM では配信されません。
[静的なアセット](#static-assets) を参照してください。

<a id="preparing-the-application"></a>

## アプリケーションの準備

<a id="installing-bref"></a>

### Bref のインストール

`bref/bref` パッケージをインストールします。イメージで実行するランタイムのコードと、
Serverless CLI のプラグインが含まれています。

```bash
composer require bref/bref:^3
```

`pieceofcake2/cakephp` が依存している `php81_bc/strftime` は `intl` 拡張を必要とします。
Bref は `intl` を含んでいますが有効にしていないので、`php/conf.d/php.ini` で有効にします。
Bref の PHP は `/var/task/php/conf.d/`、つまりプロジェクトの `php/conf.d/` ディレクトリにある
すべての `.ini` ファイルを読み込みます。

```ini
; php/conf.d/php.ini
extension=intl

; Enable the extensions your application uses, for example for Redis:
;extension=redis

; The code does not change on Lambda; do not check files for changes.
opcache.validate_timestamps=0
```

`intl` がないと、Composer のプラットフォームチェックが "Composer detected issues in your
platform" というエラーでアプリケーションを止めます。Bref はデフォルトで OPcache と
`pdo_mysql`、`pdo_pgsql`、`pdo_sqlite` 拡張を有効にしています。Bref に含まれている拡張や、
`gd`、`imagick` などの追加の拡張については
[PHP extensions](https://bref.sh/docs/environment/php#extensions) を参照してください。

<a id="writable-directories-and-request-variables"></a>

### 書き込めるディレクトリとリクエストの変数

Lambda ではアプリケーションのディレクトリは読み取り専用です。CakePHP はキャッシュを `TMP`
ディレクトリに、ファイルのログを `LOGS` ディレクトリに書き込みます。コアはどちらの定数も、
まだ定義されていないときだけ定義します。`webroot/index.php` と `bin/cake` が CakePHP より先に
読み込む `config/define.php` でこれらを定義します。Lambda は環境変数 `LAMBDA_TASK_ROOT` を
セットするので、次のコードは Lambda 上でだけ実行されます。

```php
// config/define.php
// AWS Lambda: only /tmp is writable.
if (getenv('LAMBDA_TASK_ROOT') !== false && !defined('TMP')) {
    define('TMP', '/tmp/cake' . DS);
    define('LOGS', TMP . 'logs' . DS);

    foreach (['cache/models', 'cache/persistent', 'cache/views', 'logs', 'sessions'] as $dir) {
        if (!is_dir(TMP . $dir)) {
            mkdir(TMP . $dir, 0777, true);
        }
    }

    if (PHP_SAPI !== 'cli') {
        // API Gateway and Lambda function URLs only accept HTTPS.
        $_SERVER['HTTPS'] = 'on';
        // Bref sends every request to webroot/index.php without SCRIPT_NAME.
        $_SERVER['SCRIPT_NAME'] = '/index.php';
        $_SERVER['PHP_SELF'] = '/index.php';
    }
}
```

ディレクトリを作成しているのは、`FileEngine` と `FileLog` がデバッグモードのときしか存在しない
ディレクトリを作成しないためです。インスタンスの起動時には `/tmp` は空なので、インスタンスは
それぞれコアとモデルのキャッシュを作り直し、新しいデプロイは必ず空のキャッシュから始まります。

最後のブロックは、CakePHP から見たリクエストを、URL リライトを使う Apache の背後にあるときと
同じにします。

- `SCRIPT_NAME` がないと、CakePHP はリクエストのパスからアプリケーションのベースパスを計算し、
  `/posts/view/1` のような URL で誤ったベースパスになります。両方の変数を `/index.php` にすると、
  ベースパスは `''` になります。
- `HTTPS` により、`CakeRequest::is('ssl')` が true を返し、セッションの Cookie に `secure`
  フラグが付き、完全な URL が `https://` で始まります。

従来の `app/` 構成では、同じコードを `app/webroot/index.php` と `app/Console/cake.php` の先頭、
`DS` を定義した後に書きます。

<a id="full-base-url"></a>

### 完全なベース URL

CakePHP は、リダイレクト先を含む完全な URL を `Host` ヘッダーから組み立てます。CloudFront や
カスタムドメインの背後では、このヘッダーに公開しているドメインではなく API Gateway のドメインが
入ることがあります。`config/core.php` で環境変数から `App.fullBaseUrl` をセットします。

```php
// config/core.php
if (env('APP_FULL_BASE_URL')) {
    Configure::write('App.fullBaseUrl', env('APP_FULL_BASE_URL'));
}
```

<a id="logging-to-cloudwatch"></a>

### CloudWatch へのログ出力

Lambda は、PHP が `stderr` に書き込んだものをすべて CloudWatch Logs に送ります。`/tmp` の
ログファイルはインスタンスが停止すると失われるので、`config/bootstrap.php` で Lambda 上では
ログを `stderr` に書き込むように設定します。コアの `ConsoleLog` エンジンなら、追加のパッケージ
なしでできます。

```php
// config/bootstrap.php
if (getenv('LAMBDA_TASK_ROOT') !== false) {
    CakeLog::config('default', [
        'engine' => 'Console',
        'stream' => 'php://stderr',
    ]);
} else {
    CakeLog::config('debug', [
        'engine' => 'File',
        'types' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);
    CakeLog::config('error', [
        'engine' => 'File',
        'types' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);
}
```

`ConsoleLog` はメッセージを 1 行ずつ書き込むので、CloudWatch ではスタックトレースの各行が別々の
ログイベントになります。メッセージとスタックトレースを 1 つのイベントにまとめ、CloudWatch Logs
Insights でログレベルによる絞り込みができるようにするには、`Console` エンジンの代わりに
[Monolog プラグイン](https://pieceofcake2.github.io/monolog/) と Bref の `CloudWatchFormatter`
を使います。

```bash
composer require pieceofcake2/monolog bref/monolog-bridge
```

```php
// config/bootstrap.php
if (getenv('LAMBDA_TASK_ROOT') !== false) {
    CakePlugin::load('Monolog');
    CakeLog::config('default', [
        'engine' => 'Monolog.Monolog',
        'channel' => 'app',
        'handlers' => [
            'Stream' => [
                'php://stderr',
                'formatters' => ['Bref\Monolog\CloudWatchFormatter'],
            ],
        ],
    ]);
}
```

各行は Lambda のリクエスト ID で始まり、ログレベル、メッセージ、JSON 形式のメッセージが続きます。
PHP 自身が報告するエラーも CloudWatch に書き込まれます。エラーを Sentry にも送るには
[Sentry プラグイン](https://pieceofcake2.github.io/sentry/) を参照してください。

<a id="configuration-files"></a>

### 設定ファイル

スケルトンの `.gitignore` は `config/database.php`、`config/email.php`、`composer.lock` を
除外しています。CI でビルドするイメージにはリポジトリにあるファイルしか入らないので、次のように
します。

- `config/database.php.default` から作成した `config/database.php` をコミットします。接続の設定は
  環境変数 `DB_*` から読み込むので、秘密の情報は含まれません。
- [メール](#email) で説明する SES のトランスポートを設定した `config/email.php` をコミットします。
  IAM ロールを使うので、こちらにも認証情報は含まれません。
- テストした依存パッケージがそのままデプロイされるように、`composer.lock` をコミットします。

`.env` ファイルはコミットせず、イメージにもコピーしないでください。Lambda では設定を環境変数から
読み込みます。[設定と秘密の情報](#configuration-and-secrets) を参照してください。

<a id="building-the-image"></a>

## イメージのビルド

Bref 3 は、`bref/php-84:3` のように PHP のバージョンごとに 1 つのイメージを公開しており、
すべてのランタイムで同じイメージを使います。ランタイムは環境変数 `BREF_RUNTIME` で選ぶので、
web 関数と console 関数で同じイメージを使えます。イメージをビルドする前に Composer の依存
パッケージをインストールし (後述のデプロイのワークフローで行います)、アプリケーションを
`/var/task` にコピーします。

```dockerfile
# Dockerfile
FROM bref/php-84:3

# Extra extensions come from Bref's extra extension images, for example GD:
# COPY --from=bref/extra-gd-php-84:3 /opt /opt

COPY . /var/task
```

開発用のファイル、ローカルの設定、ログは `.dockerignore` ファイルでイメージから除外します。

```text
# .dockerignore
.git
.github
.serverless
.env
config/.env
logs
node_modules
tests
tmp
```

ビルドする前に、本番用に依存パッケージをインストールします。

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
```

`Dockerfile` では `/tmp` に書き込まないでください。関数の起動時に Lambda が空の `/tmp`
をマウントします。新しいメジャーバージョンでイメージが意図せず変わらないように、Bref の
イメージは常にメジャーバージョンのタグ (`:3`) で指定してください。

AWS プラグインが使う `aws/aws-sdk-php` パッケージにはすべての AWS サービスのクライアントが
含まれており、`vendor/` が 100 MB 以上大きくなります。コンテナイメージは 10 GB まで使えるので
上限の問題にはなりませんが、イメージが小さいほど起動は速くなります。SDK は使わないクライアントを
削除できます。Bref のドキュメントの
[Reducing package size](https://bref.sh/docs/deploy#reducing-package-size) を参照してください。

## serverless.yml

プロジェクトに Serverless CLI をインストールします。Bref がウェブサイト用に使っている Serverless
のプラグイン Lift が、静的なファイルのための CloudFront と S3 をセットアップします。

```bash
npm install --save-dev osls serverless-lift
```

次の `serverless.yml` は、web 関数と console 関数、セッション用の DynamoDB テーブル、
アップロードされたファイル用の S3 バケットをデプロイします。各部分は以降の節で説明します。

```yaml
# serverless.yml
service: my-cake-app

provider:
    name: aws
    region: ap-northeast-1
    stage: ${opt:stage, 'dev'}
    ecr:
        images:
            app:
                path: ./
                file: Dockerfile
                platform: linux/amd64
                provenance: false
    environment:
        DEBUG: '0'
        APP_FULL_BASE_URL: https://www.example.com
        SECURITY_SALT: bref-ssm:/my-cake-app/${sls:stage}/security-salt
        SECURITY_CIPHER_SEED: bref-ssm:/my-cake-app/${sls:stage}/security-cipher-seed
        DB_HOST: ${ssm:/my-cake-app/${sls:stage}/db-host}
        DB_USERNAME: my_cake_app
        DB_PASSWORD: bref-ssm:/my-cake-app/${sls:stage}/db-password
        DB_DATABASE: my_cake_app
        SESSION_TABLE: !Ref SessionsTable
        UPLOADS_BUCKET: !Ref UploadsBucket
        MAIL_FROM: noreply@example.com
    iam:
        role:
            statements:
                -   Effect: Allow
                    Action: ssm:GetParameters
                    Resource: arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/my-cake-app/${sls:stage}/*
                -   Effect: Allow
                    Action:
                        - dynamodb:GetItem
                        - dynamodb:PutItem
                        - dynamodb:UpdateItem
                        - dynamodb:DeleteItem
                    Resource: !GetAtt SessionsTable.Arn
                -   Effect: Allow
                    Action:
                        - s3:GetObject
                        - s3:PutObject
                        - s3:DeleteObject
                    Resource: !Join ['', [!GetAtt UploadsBucket.Arn, '/*']]
                -   Effect: Allow
                    Action: ses:SendEmail
                    Resource: '*'

plugins:
    - ./vendor/bref/bref
    - serverless-lift

functions:
    web:
        image:
            name: app
            command:
                - webroot/index.php
        environment:
            BREF_RUNTIME: fpm
        memorySize: 1024
        timeout: 28
        events:
            - httpApi: '*'

    console:
        image:
            name: app
            command:
                - bin/cake
        environment:
            BREF_RUNTIME: console
        timeout: 900

constructs:
    website:
        type: server-side-website
        assets:
            '/css/*': webroot/css
            '/js/*': webroot/js
            '/img/*': webroot/img
            '/favicon.ico': webroot/favicon.ico

resources:
    Resources:
        SessionsTable:
            Type: AWS::DynamoDB::Table
            Properties:
                BillingMode: PAY_PER_REQUEST
                AttributeDefinitions:
                    -   AttributeName: id
                        AttributeType: S
                KeySchema:
                    -   AttributeName: id
                        KeyType: HASH
                TimeToLiveSpecification:
                    AttributeName: expires
                    Enabled: true
        UploadsBucket:
            Type: AWS::S3::Bucket
```

注意点:

- `provider.ecr.images` により、`serverless deploy` がイメージをビルドし、ECR のリポジトリを
  作成して、イメージをプッシュします。`platform: linux/amd64` は、Apple シリコンを含むどの
  マシンでも x86 のイメージをビルドします。Bref の追加の拡張は ARM では使えません。
  `provenance: false` は Docker BuildKit の provenance attestation を無効にします。これがあると
  マルチプラットフォームのマニフェストが作られ、Lambda が受け付けないことがあります。
- 各関数の `command` はハンドラーです。`fpm` ランタイムでは PHP-FPM が実行する PHP ファイル、
  `console` ランタイムでは `php` で実行するスクリプトです。従来の構成では
  `app/webroot/index.php` と `app/Console/cake.php` (または `cake` スクリプトのパス) を使います。
- `plugins` の `./vendor/bref/bref` は Bref のプラグインで、`serverless bref:cli` コマンドを
  提供します。`vendor/` から読み込むので、Serverless CLI の前に `composer install` を実行して
  ください。
- `timeout: 28` は、関数のタイムアウトを API Gateway の 30 秒の上限より短くします。遅い
  リクエストは関数の中で失敗し、ログに残ります。
- `httpApi: '*'` は、すべてのパスを関数に送る API Gateway の HTTP API を作成します。
  [Lambda 関数 URL](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
  (関数に `url: true`) を使うと、API Gateway なしで、30 秒の上限もなく HTTP リクエストを
  受け付けられます。

<a id="configuration-and-secrets"></a>

## 設定と秘密の情報

スケルトンは設定を環境変数 `DEBUG`、`SECURITY_SALT`、`SECURITY_CIPHER_SEED`、`DB_*` から
読み込みます ([環境変数](/ja/development/configuration#environment-variables) を参照してください)。
Lambda では、これらを `serverless.yml` の `environment` で、すべての関数
(`provider.environment`) または関数ごとに定義します。スケルトンは、セットされていない変数だけを
`.env` ファイルから読み込み、実際の環境変数が常に優先されます。`.env` ファイルはデプロイしないで
ください。

ソルトやデータベースのパスワードなどの秘密の情報は、
[AWS Systems Manager パラメータストア](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
に、たとえば `SecureString` のパラメータとして保存します。

```bash
aws ssm put-parameter --region ap-northeast-1 \
    --name /my-cake-app/prod/db-password --type SecureString --value 'secret'
```

`serverless.yml` からパラメータを読み込む方法は 2 つあります。

- `${ssm:/my-cake-app/prod/db-host}` は、デプロイ時に Serverless CLI が解決します。値は関数の
  設定に平文で保存され、デプロイする人がパラメータを読める必要があります。秘密でない値に
  使ってください。
- `bref-ssm:/my-cake-app/prod/db-password` は、Lambda のインスタンスの起動時に Bref が、すべての
  変数をまとめて 1 回の API 呼び出しで解決します。値は関数の設定には保存されません。
  `bref/secrets-loader` パッケージと、上の `iam` の節にある `ssm:GetParameters` の権限が必要です。

  ```bash
  composer require bref/secrets-loader
  ```

  パラメータをデフォルトの `aws/ssm` キーではなくカスタマー管理の KMS キーで暗号化している場合は、
  ロールにそのキーに対する `kms:Decrypt` の権限も必要です。

Bref はアプリケーションの開始前に `bref-ssm:` の値を解決するので、`env('DB_PASSWORD')` や
`getenv()` は復号された値を返します。Lambda は `AWS_REGION` などの
[ランタイムの環境変数](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime)
をすべての関数にセットします。

<a id="aws-services"></a>

## AWS のサービス

[AWS プラグイン](https://pieceofcake2.github.io/aws/) (`pieceofcake2/aws`) は、DynamoDB の
セッションハンドラー、SES のメールトランスポート、AWS SDK のクライアントを作成するコンポーネントを
提供します。インストールして読み込みます。

```bash
composer require pieceofcake2/aws
```

```php
// config/bootstrap.php
CakePlugin::load('Aws');
```

プラグインは `Aws` の設定からクライアントを作成します。認証情報は設定しないでください。Lambda
では AWS SDK が関数の IAM ロールの認証情報を、手元のマシンでは AWS プロファイルの認証情報を
使います。

```php
// config/core.php
Configure::write('Aws', [
    'region' => env('AWS_REGION') ?: 'ap-northeast-1',
    'version' => 'latest',
]);
```

関数の IAM ロールには、`serverless.yml` の例の `iam` の節のように、アプリケーションが使う
サービスごとに権限が必要です。

::: tip
[pieceofcake2/async-aws](https://pieceofcake2.github.io/async-aws/) は、同じ DynamoDB のセッションハンドラー、
SES のメールトランスポート、DynamoDB のキャッシュエンジン、S3 ストリームラッパーを、
より小さな依存関係で提供します。AWS SDK 全体ではなく、使う AWS のサービスだけをインストールする
[AsyncAws](https://async-aws.com) を使うので、Lambda のパッケージを小さくできます。
[Migrating from pieceofcake2/aws](https://pieceofcake2.github.io/async-aws/#migrating-from-pieceofcake2aws)
を参照してください。
:::

<a id="sessions"></a>

### セッション

デフォルトの `php` セッションハンドラーはセッションを `/tmp` のファイルに保存しますが、これは
Lambda のインスタンス間で共有されません。次のリクエストが別のインスタンスに送られると、ユーザーの
セッションが失われます。プラグインの `DynamoDbSession` ハンドラーで、セッションを DynamoDB に
保存してください。テーブルには `id` という名前の文字列のパーティションキーが必要です。
プラグインは各セッションの有効期限を `expires` 属性に書き込むので、この属性で Time to Live を
有効にします (`serverless.yml` の例は両方を設定しています)。

```php
// config/core.php
if (env('SESSION_TABLE')) {
    Configure::write('Session', [
        'defaults' => 'php',
        'cookie' => 'MYAPP',
        'timeout' => 120,
        'handler' => [
            'engine' => 'Aws.DynamoDbSession',
            'table_name' => env('SESSION_TABLE'),
        ],
        'ini' => [
            // Written to the "expires" attribute of each item
            'session.gc_maxlifetime' => 7200,
        ],
    ]);
} else {
    Configure::write('Session', ['defaults' => 'php']);
}
```

プラグインは `config/core.php` の後の `config/bootstrap.php` で読み込みますが、セッションは
その後、セッションに最初にアクセスしたときに開始するので問題ありません。DynamoDB のテーブルは
VPC なしで使え、料金はリクエストごとです。セッションのロックなど、ほかのオプションについては
[DynamoDB Session Handler](https://pieceofcake2.github.io/aws/#dynamodb-session-handler)
を参照してください。

<a id="cache"></a>

### キャッシュ

上の `TMP` ディレクトリを使えば `FileEngine` は Lambda でも動きますが、キャッシュはインスタンス
ごとに別々で、インスタンスが停止すると失われます。コアのキャッシュ (`_cake_core_` と
`_cake_model_`) は作り直しが速く、どのみちデプロイのたびに作り直す必要があるので、これで
問題ありません。

レート制限やクエリ結果のキャッシュなど、リクエストやインスタンスの間で共有するデータには、共有の
キャッシュサービスを使います。CakePHP の `RedisEngine` は Amazon ElastiCache (Redis OSS または
Valkey) で使え、Bref に含まれている `redis` 拡張が必要です (`php/conf.d/php.ini` に
`extension=redis` を追加します)。

```php
// config/bootstrap.php
if (env('REDIS_HOST')) {
    Cache::config('default', [
        'engine' => 'Redis',
        'server' => env('REDIS_HOST'),
        'port' => (int)(env('REDIS_PORT') ?: 6379),
        'prefix' => 'myapp_',
        'duration' => '+1 hours',
    ]);
} else {
    Cache::config('default', ['engine' => 'File']);
}
```

ElastiCache は VPC の中で動くので、関数も同じ VPC で実行する必要があり
([データベース](#database) を参照してください)、クラスターには動いている間ずっと料金が
かかります。`RedisEngine` には TLS のオプションがないので、プライベートな VPC の中で転送中の
暗号化を使わないクラスターを使うか、PHP の Redis クライアントが `server` の `tls://`
プレフィックスを受け付けることを確認してから使ってください。VPC なしでリクエストごとの料金に
したい場合は、[pieceofcake2/async-aws](https://pieceofcake2.github.io/async-aws/#dynamodb-cache-engine)
の `AsyncAws.DynamoDb` エンジンで、キャッシュするデータを DynamoDB に保存できます。
キャッシュエンジンについては [キャッシュ](/ja/core-libraries/caching)
を参照してください。

<a id="email"></a>

### メール

メールは、プラグインの `AmazonSesApiTransport` で [Amazon SES](https://aws.amazon.com/ses/)
から送信します。このトランスポートは SMTP ではなく SES の API を使います。

```php
// config/email.php
class EmailConfig
{
    public $default = [
        'transport' => 'Aws.AmazonSesApi',
        'from' => 'noreply@example.com',
        'charset' => 'utf-8',
        'headerCharset' => 'utf-8',
    ];
}
```

送信元のアドレスまたはそのドメインは SES で検証済みの ID である必要があります。また、新しい SES
アカウントは、本番環境へのアクセスを申請するまで検証済みのアドレスにしか送信できません。関数には
`ses:SendEmail` の権限が必要です。
[Amazon SES Email Transport](https://pieceofcake2.github.io/aws/#amazon-ses-email-transport)
と [メール](/ja/core-utility-libraries/email) を参照してください。

<a id="file-uploads-and-s3"></a>

### ファイルのアップロードと S3

`/tmp` は共有されず、インスタンスが停止すると空になるので、アップロードされたファイルは S3 に
保存する必要があります。アップロードには Lambda の 2 つの制限も当てはまります。リクエストは
6 MB までで、Bref は `upload_max_filesize` と `post_max_size` を 6 MB にしています。

小さいファイルは、コントローラーでいつものように受け取り、一時ファイルを S3 クライアントで S3 に
コピーできます。`$this->Aws->S3` は `Aws` の設定から作成した `S3Client` を返します。

```php
// src/Controller/DocumentsController.php
class DocumentsController extends AppController
{
    public $components = ['Aws.Aws'];

    public function upload()
    {
        $file = $this->request->data['Document']['file'];
        $key = 'documents/' . CakeText::uuid() . '.pdf';

        $this->Aws->S3->putObject([
            'Bucket' => env('UPLOADS_BUCKET'),
            'Key' => $key,
            'SourceFile' => $file['tmp_name'],
            'ContentType' => 'application/pdf',
        ]);
        // Save $key in the database ...
    }
}
```

大きいファイルは、署名付き URL を使ってブラウザーから直接 S3 にアップロードします。
アプリケーションが短時間だけ有効な URL を作成し、ブラウザーがその URL にファイルを `PUT`
リクエストで送り、アプリケーションがキーを保存します。バケットには、自分のドメインからの `PUT`
を許可する CORS のルールが必要です。

```php
// src/Controller/DocumentsController.php
public function uploadUrl()
{
    $s3 = $this->Aws->S3;
    $key = 'documents/' . CakeText::uuid() . '.pdf';
    $command = $s3->getCommand('PutObject', [
        'Bucket' => env('UPLOADS_BUCKET'),
        'Key' => $key,
        'ContentType' => 'application/pdf',
    ]);
    $request = $s3->createPresignedRequest($command, '+10 minutes');

    return $this->response->body(json_encode([
        'key' => $key,
        'url' => (string)$request->getUri(),
    ]));
}
```

バケットは非公開のままにし、ファイルは同じように署名付きの `GetObject` の URL で配信します。
これでダウンロードも 6 MB の制限を受けません。

```php
// src/Controller/DocumentsController.php
public function download($id)
{
    $document = $this->Document->findById($id);
    if (!$document) {
        throw new NotFoundException();
    }
    $s3 = $this->Aws->S3;
    $command = $s3->getCommand('GetObject', [
        'Bucket' => env('UPLOADS_BUCKET'),
        'Key' => $document['Document']['key'],
    ]);
    $request = $s3->createPresignedRequest($command, '+10 minutes');

    return $this->redirect((string)$request->getUri());
}
```

[Upload プラグイン](https://pieceofcake2.github.io/upload/) はローカルのファイルシステム上で
ファイルを移動します。Lambda で使うには、`handleUploadedFileCallback` オプションでファイルを
別の場所に保存するモデルのメソッドを指定できます。プラグインが作成するパスが `/tmp` の下に
なることを確認してください。AWS プラグインは
[S3 ストリームラッパー](https://pieceofcake2.github.io/aws/#s3-stream-wrapper) を登録することも
でき、PHP のファイル関数で `s3://bucket/key` のパスを使えるようになります。
pieceofcake2/async-aws にも[同じラッパー](https://pieceofcake2.github.io/async-aws/#s3-stream-wrapper)があります。

<a id="static-assets"></a>

### 静的なアセット

Bref が PHP-FPM で実行するのはハンドラーのファイル `webroot/index.php` だけです。
`/css/cake.generic.css` へのリクエストは CakePHP に届き、`webroot/` のファイルを配信するものが
ないので 404 エラーになります。
[Bref のウェブサイトについてのドキュメント](https://bref.sh/docs/use-cases/websites)
が推奨しているように、これらのファイルは CloudFront を通して S3 から配信します。

`serverless.yml` の例の [Lift](https://github.com/getlift/lift/blob/master/docs/server-side-website.md)
の `server-side-website` は、S3 バケットと CloudFront ディストリビューションを作成します。
CloudFront は `assets` に書いたパスをバケットに、それ以外のリクエストを API Gateway に送ります。
Lift はデプロイのたびに、書いたファイルをアップロードします。アプリケーションが参照する
`webroot/` のファイルやディレクトリはすべて追加してください。

プラグインやテーマのアセットは、CakePHP の `AssetDispatcher` フィルターが Lambda 関数から
配信します。これでも動きますが、ファイルごとに関数の呼び出しが発生します。S3 から配信するには、
デプロイの前にアセットを `webroot/` にコピーし (たとえば `DebugKit` というプラグインなら
`webroot/debug_kit/`)、`assets` に追加します。

カスタムドメインは API Gateway ではなく CloudFront に (`us-east-1` リージョンの ACM の証明書で)
設定し、`APP_FULL_BASE_URL` をそのドメインにします。Bref のドキュメントの
[Custom domain name](https://bref.sh/docs/use-cases/websites#custom-domain-name)
を参照してください。

<a id="database"></a>

## データベース

Amazon RDS と Aurora (MySQL または PostgreSQL) は、`config/database.php` の `DB_*` の設定で
使えます。Bref は `pdo_mysql` と `pdo_pgsql` を有効にしています。次の点を考えておいてください。

- **ネットワーク。** プライベートな VPC にあるデータベースを使うには、関数をその VPC で実行する
  必要があります (`serverless.yml` の `provider.vpc` に `securityGroupIds` と `subnetIds`)。
  VPC の中の関数はインターネットにアクセスできないので、VPC に NAT ゲートウェイかこれらの
  サービスの VPC エンドポイントがないと、SSM、DynamoDB、SES、S3 に接続できません。`bref-ssm:`
  の変数はインスタンスの起動時に解決されるので、経路がないとすべてのコールドスタートが失敗します。
  データベースをパブリックにアクセスできるようにすれば VPC は不要ですが、データベースが
  インターネットに公開されます。Bref のドキュメントの
  [Using a database](https://bref.sh/docs/environment/database) を参照してください。
- **接続数。** Lambda の各インスタンスは一度に 1 つのリクエストを処理し、それぞれが接続を開くので、
  接続数は関数の同時実行数とともに増えます。
  [Amazon RDS Proxy](https://docs.aws.amazon.com/lambda/latest/dg/configuration-database.html)
  で接続をプールし、関数に `reservedConcurrency` を設定してインスタンス数の上限を決めてください。
  `persistent` 接続は有効にしないでください。
- **スキーマの変更。** デプロイでは新しいコードに切り替わる間、データベースは少しの間古い
  スキーマのままです。マイグレーションはデプロイの前か後にコンソールのコマンドで実行し
  ([コンソールのコマンド](#console-commands) を参照してください)、スキーマの変更は新旧どちらの
  コードとも互換性があるようにしてください。

<a id="console-commands"></a>

## コンソールのコマンド

`console` 関数は、イベントで渡された引数で `php bin/cake` を実行します。手元のマシンや CI から
コマンドを実行するには、Serverless CLI の Bref プラグインを使います。

```bash
npx serverless bref:cli --stage=prod --args="command_list"

# For example, to update the database from config/Schema/schema.php:
npx serverless bref:cli --stage=prod --args="schema update --yes"
```

コマンドの出力と終了コードが返され、出力は CloudWatch Logs にも書き込まれます。0 以外の終了コードで
終わったコマンドは、呼び出しの失敗になります。関数は最大 15 分 (`timeout: 900`) 実行できます。
関数には端末がないので、確認を求めるコマンドには `--yes` などのオプションを渡してください。

スケジュールでコマンドを実行するには、`console` 関数に `schedule` イベントを追加します。
`input` は引数の文字列を JSON の文字列にしたものなので、二重に引用符で囲みます。

```yaml
# serverless.yml
functions:
    console:
        # ...
        events:
            - schedule:
                rate: cron(0 18 * * ? *)
                input: '"report send --verbose"'
            - schedule:
                rate: rate(15 minutes)
                input: '"queue process"'
```

スケジュールは EventBridge のルールで、時刻は UTC です。コマンドは実行のたびに別々の呼び出しで
動きます。実行が間隔より長くかかる可能性がある場合は、同じコマンドが重なって実行されても問題ない
ようにしてください。[cron ジョブ](/ja/console-and-shells/cron-jobs) と
[コンソールとシェル](/ja/console-and-shells) を参照してください。

<a id="deploying"></a>

## デプロイ

手元のマシンに AWS の認証情報を設定したら、本番用に依存パッケージをインストールしてデプロイします。

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
npx serverless deploy --stage=prod
```

最初のデプロイでは CloudFormation のスタック、ECR のリポジトリ、Lift を使う場合は CloudFront
ディストリビューションが作成されるので、数分かかります。最後に CLI が API とウェブサイトの URL を
表示します。CloudFormation は、新しいバージョンのデプロイが終わってからトラフィックを切り替え、
デプロイが失敗した場合はロールバックします。

関数のログを見るには次のようにします。

```bash
npx serverless logs --stage=prod --function=web --tail
```

<a id="testing-the-image-locally"></a>

### イメージをローカルでテストする

Bref のイメージには Lambda Runtime Interface Emulator が含まれているので、読み取り専用の
ファイルシステムで、Lambda と同じようにイメージを実行できます。

```bash
docker build --platform linux/amd64 -t my-cake-app .
docker run --rm --platform linux/amd64 --read-only --tmpfs /tmp:exec,mode=1777 \
    -p 9000:8080 -e BREF_RUNTIME=fpm -e DEBUG=0 my-cake-app webroot/index.php
```

別の端末から、エミュレーターに API Gateway のイベントを送ります。

```bash
curl -X POST http://localhost:9000/2015-03-31/functions/function/invocations -d '{
    "version": "2.0", "rawPath": "/posts", "rawQueryString": "",
    "headers": {"host": "localhost"},
    "requestContext": {"http": {"method": "GET", "path": "/posts",
        "protocol": "HTTP/1.1", "sourceIp": "127.0.0.1"}},
    "isBase64Encoded": false
}'
```

関数が API Gateway に返す JSON がレスポンスとして返り、コンテナがログを出力します。ローカルの
HTTP サーバーで開発する方法については、Bref のドキュメントの
[Local development](https://bref.sh/docs/local-development) を参照してください。

<a id="deploying-from-github-actions"></a>

## GitHub Actions からのデプロイ

GitHub Actions を使うと、AWS のアクセスキーを保存せずに、プッシュのたびにデプロイできます。
ワークフローは GitHub に OpenID Connect (OIDC) のトークンを要求し、
`aws-actions/configure-aws-credentials` がそれを IAM ロールの一時的な認証情報に交換します。

1. IAM で、オーディエンス `sts.amazonaws.com` の ID プロバイダー
   `token.actions.githubusercontent.com` を追加します (AWS アカウントごとに 1 回)。
2. デプロイ用のロールを作成します。信頼ポリシーで、自分のリポジトリと環境だけがロールを引き受け
   られるようにします。

   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Principal": {
                   "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
               },
               "Action": "sts:AssumeRoleWithWebIdentity",
               "Condition": {
                   "StringEquals": {
                       "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                       "token.actions.githubusercontent.com:sub": "repo:my-org/my-cake-app:environment:production"
                   }
               }
           }
       ]
   }
   ```

3. ロールにデプロイに必要な権限を与えます。CloudFormation、Lambda、関数の IAM ロール、ECR、
   デプロイ用の S3 バケット、API Gateway、CloudWatch Logs と、スタックのリソース (DynamoDB、S3、
   CloudFront) です。出発点として、Bref が
   [最小限のポリシー](https://bref.sh/docs/setup/minimal-aws-policy) を公開しています。
   `serverless.yml` で `${ssm:...}` を使う場合は、それらのパラメータに対する
   `ssm:GetParameter` の権限も必要です。
4. GitHub のリポジトリで `production` 環境を作成し、ロールの ARN を変数 `AWS_DEPLOY_ROLE_ARN`
   に設定します。

ワークフローは本番用に依存パッケージをインストールし、`serverless deploy` を実行します。
`serverless deploy` がイメージをビルドし、ECR にプッシュし、スタックを更新します。

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v7

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          extensions: intl
          tools: composer:v2
          coverage: none

      - name: Install Composer dependencies
        run: composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm

      - name: Install the Serverless CLI
        run: npm ci

      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ap-northeast-1

      - name: Deploy
        run: npx serverless deploy --stage=prod
```

注意点:

- ランナーの PHP のバージョン (`8.4`) をイメージ (`bref/php-84:3`) と合わせ、Composer が
  イメージで使うのと同じ依存パッケージを解決するようにします。
- テストは別のジョブまたはワークフローで実行し、`needs` でデプロイのジョブがそれに依存するように
  してください。
- `concurrency` により、デプロイは 1 つずつ順に実行されます。
- データベースのマイグレーションなど、デプロイの後にコマンドを実行するには、
  `npx serverless bref:cli --stage=prod --args="..."` を実行するステップを追加します。
- `develop` ブランチから `staging` をデプロイするなど、複数のステージをデプロイするには、
  ステージごとに GitHub の環境と IAM ロールを使います。

<a id="troubleshooting-and-tips"></a>

## トラブルシューティングとヒント

- **コールドスタート。** イメージを小さく保ち (`tests/` と開発用の依存パッケージを除外し、使わない
  AWS SDK のクライアントを削除します)、OPcache を有効のままにします。Bref は `warmer` イベントを
  認識するので、アクセスの少ないアプリケーションでインスタンスを起動したままにしておけます。
  [Cold starts](https://bref.sh/docs/environment/cold-starts) を参照してください。
  プロビジョニングされた同時実行を使うと、固定の料金でコールドスタートをなくせます。
- **メモリと CPU。** Lambda はメモリに比例して CPU を割り当てます。web 関数は 1024 MB から
  始めるのが妥当です。変更したら、CloudWatch Logs の `REPORT` 行で実行時間を比べてください。
- **タイムアウト。** API Gateway は、関数のタイムアウトに関係なく 30 秒でエラーを返します。
  時間のかかる処理は console 関数かキューに移してください (Bref は `function` ランタイムで SQS
  に対応しています)。
- **6 MB の制限。** アップロードや生成したファイルを含め、リクエストとレスポンスは 6 MB までです。
  大きなファイルには S3 の署名付き URL を使います。
- **バイナリのレスポンス。** PHP で生成した PDF や画像などのレスポンスを返すには、環境変数
  `BREF_BINARY_RESPONSES` を `1` にして、API Gateway が必要とする base64 に Bref がエンコード
  するようにします。base64 でサイズが約 3 分の 1 増えるので、こうしたレスポンスは約 4.5 MB までです。
  [Binary requests and responses](https://bref.sh/docs/use-cases/http/binary-requests-responses)
  を参照してください。
- **ディスク容量。** `/tmp` はデフォルトで 512 MB です。アプリケーションが大きな一時ファイルを
  書き込む場合は、関数の `ephemeralStorageSize` で増やします (10240 MB まで)。
- **起動時のエラー。** "Composer detected issues in your platform" は、拡張 (たいていは `intl`)
  が `php/conf.d/php.ini` で有効になっていないことを示します。"is not writable" の警告は、`TMP`
  や `LOGS` がまだ `/var/task` の中を指していることを示します。`config/define.php` を確認して
  ください。
- **URL やリダイレクトの誤り。** API Gateway のドメインにリダイレクトされる場合は
  `APP_FULL_BASE_URL` がセットされていません。パスが重複した URL になる場合は、
  [書き込めるディレクトリとリクエストの変数](#writable-directories-and-request-variables) の
  ように `SCRIPT_NAME` がセットされていません。
- **PHP の拡張。** 読み込まれている拡張を確認するには、それを出力するコンソールのコマンドを実行
  するか、イメージで `php -m` を実行します:
  `docker run --rm --entrypoint php my-cake-app -m`。
