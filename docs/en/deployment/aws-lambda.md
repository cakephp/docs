# Deploying to AWS Lambda

[AWS Lambda](https://aws.amazon.com/lambda/) runs code on demand without servers
to manage. With [Bref](https://bref.sh/), a CakePHP 2 application runs on Lambda
with PHP-FPM, as it would on a traditional server: every HTTP request goes to
`webroot/index.php`, and `bin/cake` commands run in a separate function.

This page describes how to deploy an application created from the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton with Bref 3
and Docker container images, how to connect it to other AWS services (S3,
DynamoDB, SES, RDS, SSM Parameter Store), and how to deploy it from GitHub
Actions. It assumes that you know the basics of AWS and of the
[Bref documentation](https://bref.sh/docs). The general advice on the
[Deployment](../deployment) page also applies.

## When Lambda Fits

Lambda works well for applications with irregular or spiky traffic, internal
tools and APIs: you pay per request, scaling is automatic, and there is no
server to patch. Keep these constraints in mind:

- The filesystem is read-only, except `/tmp`, which is local to each Lambda
  instance and empty when an instance starts. Sessions, uploaded files and
  shared caches must live in other services.
- An HTTP request or response is limited to 6 MB, and API Gateway stops waiting
  after 30 seconds.
- A new instance takes a moment to start (a *cold start*). Bref documents about
  250 ms for its runtime, plus the time to load your application.
- Lambda scales by running more instances, and each instance opens its own
  database connection.

Applications that write to the local filesystem, run long requests or keep
long-lived connections (WebSockets, streaming) need changes, or are better
served by containers on ECS or a traditional server.

## Requirements

- An application based on the `pieceofcake2/app` skeleton (modern layout), or
  an existing application with the same settings. Notes for the legacy `app/`
  layout are given where paths differ.
- PHP 8.2 or later; Bref 3 does not support older versions. The examples use
  PHP 8.4.
- [Docker](https://www.docker.com/) to build the image.
- Node.js and the Serverless CLI. Bref uses
  [OSS Serverless](https://github.com/oss-serverless/osls) (`osls`), the
  open-source fork of the Serverless Framework v3 maintained by the Bref
  maintainers, as its deployment tool. [Bref Cloud](https://bref.sh/cloud), a
  paid service, can deploy the same `serverless.yml` file.
- An AWS account and credentials that can deploy CloudFormation stacks.

The examples use `my-cake-app` as the service name and the `ap-northeast-1`
region; replace them with your own values.

## How It Works

A deployment consists of:

- A Docker image based on Bref's `bref/php-84:3` image, which contains PHP and
  the Bref runtime. Your application is copied to `/var/task`.
- A `web` function that runs the image with the `fpm` runtime. API Gateway (HTTP
  API) sends every HTTP request to the function, and Bref passes it to PHP-FPM,
  which runs `webroot/index.php`.
- A `console` function that runs the same image with the `console` runtime. Each
  invocation runs `php bin/cake` with the arguments given in the event, from a
  schedule or from the `serverless bref:cli` command.
- Other AWS resources, such as a DynamoDB table for sessions and an S3 bucket
  for uploaded files, defined in the same `serverless.yml` file.

The Serverless CLI builds the image, pushes it to Amazon ECR and deploys
everything as a CloudFormation stack. Static files in `webroot/` are not served
by PHP-FPM; see [Static Assets](#static-assets).

## Preparing the Application

### Installing Bref

Install the `bref/bref` package. It contains the runtime code that the
image runs, and the plugin of the Serverless CLI:

```bash
composer require bref/bref:^3
```

`pieceofcake2/cakephp` depends on `php81_bc/strftime`, which requires the
`intl` extension. Bref includes `intl` but does not enable it, so enable it in
`php/conf.d/php.ini`. Bref's PHP reads every `.ini` file in
`/var/task/php/conf.d/`, which is the `php/conf.d/` directory of your project:

```ini
; php/conf.d/php.ini
extension=intl

; Enable the extensions your application uses, for example for Redis:
;extension=redis

; The code does not change on Lambda; do not check files for changes.
opcache.validate_timestamps=0
```

Without `intl`, Composer's platform check stops the application with a
"Composer detected issues in your platform" error. Bref enables OPcache, and
the `pdo_mysql`, `pdo_pgsql` and `pdo_sqlite` extensions by default. For the
extensions it includes, and the extra extensions such as `gd` and `imagick`,
see [PHP extensions](https://bref.sh/docs/environment/php#extensions).

### Writable Directories and Request Variables

The application directory is read-only on Lambda. CakePHP writes its caches to
the `TMP` directory and file logs to the `LOGS` directory, and the core defines
both constants only if they are not defined yet. Define them in
`config/define.php`, which `webroot/index.php` and `bin/cake` load before
CakePHP. Lambda sets the `LAMBDA_TASK_ROOT` environment variable, so the code
below only runs on Lambda:

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

The directories are created because `FileEngine` and `FileLog` only create
missing directories when debug is on. `/tmp` is empty when an instance starts,
so each instance builds its own core and model caches, and a new deployment
always starts with empty caches.

The last block makes CakePHP see a request as it would behind Apache with URL
rewriting:

- Without `SCRIPT_NAME`, CakePHP computes the base path of the application from
  the path of the request, and URLs such as `/posts/view/1` get a wrong base
  path. Setting both variables to `/index.php` gives the base path `''`.
- `HTTPS` makes `CakeRequest::is('ssl')` return true, gives the session cookie
  the `secure` flag, and makes full URLs start with `https://`.

In the legacy `app/` layout, put the same code at the top of
`app/webroot/index.php` and `app/Console/cake.php`, after `DS` is defined.

### Full Base URL

CakePHP builds full URLs, including the URLs of redirects, from the `Host`
header. Behind CloudFront or a custom domain, that header can contain the
domain of API Gateway instead of your public domain. Set `App.fullBaseUrl` from
an environment variable in `config/core.php`:

```php
// config/core.php
if (env('APP_FULL_BASE_URL')) {
    Configure::write('App.fullBaseUrl', env('APP_FULL_BASE_URL'));
}
```

### Logging to CloudWatch

Lambda sends everything that PHP writes to `stderr` to CloudWatch Logs. Log
files in `/tmp` would be lost when the instance stops, so configure the logs in
`config/bootstrap.php` to write to `stderr` on Lambda. The core `ConsoleLog`
engine does this without extra packages:

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

`ConsoleLog` writes one line per message, so CloudWatch shows each line of a
stack trace as a separate log event. To keep a message with its stack trace in
one event, and to filter logs by level in CloudWatch Logs Insights, use the
[Monolog plugin](https://pieceofcake2.github.io/monolog/) with Bref's
`CloudWatchFormatter` instead of the `Console` engine:

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

Each line then starts with the ID of the Lambda request, followed by the level,
the message and the message as JSON. Errors that PHP itself reports are also
written to CloudWatch. To report errors to Sentry as well, see the
[Sentry plugin](https://pieceofcake2.github.io/sentry/).

### Configuration Files

The skeleton's `.gitignore` excludes `config/database.php`, `config/email.php`
and `composer.lock`. An image built in CI only contains the files in the
repository, so:

- Commit `config/database.php` created from `config/database.php.default`. It
  reads the connection settings from the `DB_*` environment variables, so it
  contains no secrets.
- Commit `config/email.php` with the SES transport described in
  [Email](#email). With an IAM role, it contains no credentials either.
- Commit `composer.lock`, so that the deployed dependencies are the ones you
  tested.

Do not commit or copy `.env` files into the image. On Lambda, settings come
from environment variables; see
[Configuration and Secrets](#configuration-and-secrets).

## Building the Image

Bref 3 publishes one image per PHP version, such as `bref/php-84:3`, for all
runtimes. The runtime is selected with the `BREF_RUNTIME` environment variable,
so the same image serves the web and console functions. Install the Composer
dependencies before building the image (the deployment workflow below does
this), and copy the application into `/var/task`:

```dockerfile
# Dockerfile
FROM bref/php-84:3

# Extra extensions come from Bref's extra extension images, for example GD:
# COPY --from=bref/extra-gd-php-84:3 /opt /opt

COPY . /var/task
```

Keep development files, local settings and logs out of the image with a
`.dockerignore` file:

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

Install the dependencies for production before building:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
```

Do not write to `/tmp` in the `Dockerfile`: Lambda mounts an empty `/tmp`
when the function starts. Always use the major version tag (`:3`) of the Bref
images so that a new major version does not change your image unexpectedly.

The `aws/aws-sdk-php` package, used by the AWS plugin, contains clients for all
AWS services and adds more than 100 MB to `vendor/`. Container images can be
up to 10 GB, so this is not a hard limit, but a smaller image starts faster.
The SDK can remove the clients you do not use; see
[Reducing package size](https://bref.sh/docs/deploy#reducing-package-size) in
the Bref documentation.

## serverless.yml

Install the Serverless CLI in the project. Lift, a Serverless plugin that Bref
uses for websites, sets up CloudFront and S3 for the static files:

```bash
npm install --save-dev osls serverless-lift
```

The following `serverless.yml` file deploys the web and console functions, a
DynamoDB table for sessions and an S3 bucket for uploaded files. The sections
below explain each part.

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

Notes:

- `provider.ecr.images` makes `serverless deploy` build the image, create an
  ECR repository and push the image. `platform: linux/amd64` builds an x86 image
  on any machine, including Apple silicon; Bref's extra extensions are not
  available for ARM. `provenance: false` disables the provenance attestation of
  Docker BuildKit, which produces a multi-platform manifest that Lambda may not
  accept.
- The `command` of each function is the handler: the PHP file that PHP-FPM runs
  for the `fpm` runtime, and the script that the `console` runtime runs with
  `php`. In the legacy layout, use `app/webroot/index.php` and
  `app/Console/cake.php` (or the path of your `cake` script).
- The `plugins` entry `./vendor/bref/bref` is the Bref plugin, which provides
  the `serverless bref:cli` command. It is read from `vendor/`, so run
  `composer install` before the Serverless CLI.
- `timeout: 28` keeps the function below the 30-second limit of API Gateway, so
  that a slow request fails in the function and is logged.
- `httpApi: '*'` creates an API Gateway HTTP API that sends every path to the
  function. A [Lambda function URL](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
  (`url: true` on the function) is an alternative without API Gateway and
  without the 30-second limit.

## Configuration and Secrets

The skeleton reads its settings from environment variables: `DEBUG`,
`SECURITY_SALT`, `SECURITY_CIPHER_SEED` and the `DB_*` variables (see
[Environment Variables](/development/configuration#environment-variables)). On
Lambda, define them in the `environment` sections of `serverless.yml`, for all
functions (`provider.environment`) or for one function. The skeleton loads
`.env` files only for variables that are not set, and real environment
variables always take precedence; do not deploy `.env` files.

Store secrets, such as the salts and database passwords, in
[AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html),
for example as `SecureString` parameters:

```bash
aws ssm put-parameter --region ap-northeast-1 \
    --name /my-cake-app/prod/db-password --type SecureString --value 'secret'
```

`serverless.yml` can read the parameters in two ways:

- `${ssm:/my-cake-app/prod/db-host}` is resolved by the Serverless CLI during
  the deployment. The value is stored in plain text in the configuration of the
  function, and whoever deploys must be allowed to read the parameter. Use it
  for values that are not secret.
- `bref-ssm:/my-cake-app/prod/db-password` is resolved by Bref when a Lambda
  instance starts, with one API call for all variables. The value is never
  stored in the configuration of the function. This needs the
  `bref/secrets-loader` package and the `ssm:GetParameters` permission shown in
  the `iam` section above:

  ```bash
  composer require bref/secrets-loader
  ```

  If the parameters are encrypted with a customer managed KMS key instead of
  the default `aws/ssm` key, the role also needs `kms:Decrypt` on that key.

Bref resolves `bref-ssm:` values before the application starts, so
`env('DB_PASSWORD')` and `getenv()` return the decrypted value. Lambda sets
`AWS_REGION` and other
[runtime environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime)
on every function.

## AWS Services

The [AWS plugin](https://pieceofcake2.github.io/aws/) (`pieceofcake2/aws`)
provides a DynamoDB session handler, an SES email transport and a component
that creates AWS SDK clients. Install and load it:

```bash
composer require pieceofcake2/aws
```

```php
// config/bootstrap.php
CakePlugin::load('Aws');
```

The plugin creates its clients from the `Aws` configuration. Do not configure
credentials: on Lambda, the AWS SDK uses the credentials of the function's IAM
role, and on your machine, those of your AWS profile.

```php
// config/core.php
Configure::write('Aws', [
    'region' => env('AWS_REGION') ?: 'ap-northeast-1',
    'version' => 'latest',
]);
```

The IAM role of the functions needs a permission for each service that the
application uses, as in the `iam` section of the `serverless.yml` example.

::: tip
[pieceofcake2/async-aws](https://pieceofcake2.github.io/async-aws/) offers the
same DynamoDB session handler, SES email transport, DynamoDB cache engine and
S3 stream wrapper with smaller dependencies: it uses
[AsyncAws](https://async-aws.com), which installs only the AWS services that
you use instead of the whole AWS SDK. This keeps the Lambda package small. See
[Migrating from pieceofcake2/aws](https://pieceofcake2.github.io/async-aws/#migrating-from-pieceofcake2aws).
:::

### Sessions

The default `php` session handler stores sessions in files in `/tmp`, which are
not shared between Lambda instances: a user whose next request goes to another
instance loses the session. Store the sessions in DynamoDB with the plugin's
`DynamoDbSession` handler. The table needs a string partition key named `id`;
the plugin writes the expiration time of each session to the `expires`
attribute, so enable Time to Live on that attribute (the `serverless.yml`
example does both).

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

The plugin is loaded in `config/bootstrap.php`, after `config/core.php`; this
works because the session starts later, on the first access to the session. A
DynamoDB table works without a VPC and is billed per request. See
[DynamoDB Session Handler](https://pieceofcake2.github.io/aws/#dynamodb-session-handler)
for the other options, such as session locking.

### Cache

`FileEngine` works on Lambda with the `TMP` directory above, but each instance
has its own cache, which is lost when the instance stops. This is fine for the
core caches (`_cake_core_` and `_cake_model_`), which are quick to rebuild and
must be rebuilt after each deployment anyway.

For data that must be shared between requests and instances, such as rate
limits or cached query results, use a shared cache service. CakePHP's
`RedisEngine` works with Amazon ElastiCache (Redis OSS or Valkey) and needs the
`redis` extension, which Bref includes (add `extension=redis` to
`php/conf.d/php.ini`):

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

ElastiCache runs in a VPC, so the functions must run in the same VPC (see
[Database](#database)), and the cluster is billed while it runs.
`RedisEngine` has no TLS option, so use a cluster without in-transit
encryption inside a private VPC, or check that your PHP Redis client accepts
the `tls://` prefix in `server` before you rely on it. For a pay-per-request
alternative without a VPC, store cached data in DynamoDB with the
`AsyncAws.DynamoDb` engine of
[pieceofcake2/async-aws](https://pieceofcake2.github.io/async-aws/#dynamodb-cache-engine). See [Caching](/core-libraries/caching) for the cache
engines.

### Email

Send email with [Amazon SES](https://aws.amazon.com/ses/) through the plugin's
`AmazonSesApiTransport`, which uses the SES API instead of SMTP:

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

The sender address or its domain must be a verified identity in SES, and a new
SES account can only send to verified addresses until you request production
access. The function needs the `ses:SendEmail` permission. See
[Amazon SES Email Transport](https://pieceofcake2.github.io/aws/#amazon-ses-email-transport)
and [Email](/core-utility-libraries/email).

### File Uploads and S3

Uploaded files must be stored in S3, because `/tmp` is not shared and is
emptied when an instance stops. Two limits of Lambda also apply to uploads:
a request can contain at most 6 MB, and Bref sets `upload_max_filesize` and
`post_max_size` to 6 MB.

For small files, the controller can receive the upload as usual and copy the
temporary file to S3 with an S3 client. `$this->Aws->S3` returns an `S3Client`
created from the `Aws` configuration:

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

For larger files, let the browser upload the file directly to S3 with a
presigned URL. The application creates a URL that is valid for a short time,
the browser sends the file to it with a `PUT` request, and the application
saves the key. The bucket needs a CORS rule that allows `PUT` from your
domain.

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

Keep the bucket private and serve the files with presigned `GetObject` URLs in
the same way, which also avoids the 6 MB limit for downloads:

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

The [Upload plugin](https://pieceofcake2.github.io/upload/) moves files on the
local filesystem. To use it on Lambda, its `handleUploadedFileCallback` option
can name a model method that stores the file elsewhere; check that the paths
the plugin creates are under `/tmp`. The AWS plugin can also register the
[S3 stream wrapper](https://pieceofcake2.github.io/aws/#s3-stream-wrapper), so
that PHP file functions accept `s3://bucket/key` paths; pieceofcake2/async-aws
has the [same wrapper](https://pieceofcake2.github.io/async-aws/#s3-stream-wrapper).

### Static Assets

Bref runs PHP-FPM only for the handler file, `webroot/index.php`. A request for
`/css/cake.generic.css` reaches CakePHP, which returns a 404 error, because
nothing serves the files in `webroot/`. Serve them from S3 through CloudFront,
as recommended by the
[Bref documentation on websites](https://bref.sh/docs/use-cases/websites).

The `server-side-website` construct of
[Lift](https://github.com/getlift/lift/blob/master/docs/server-side-website.md)
in the `serverless.yml` example creates an S3 bucket and a CloudFront
distribution. CloudFront sends the paths listed under `assets` to the bucket,
and all other requests to API Gateway. Lift uploads the listed files on every
deployment. Add every file or directory of `webroot/` that the application
references.

Plugin and theme assets are served by CakePHP's `AssetDispatcher` filter from
the Lambda function, which works but costs an invocation per file. To serve
them from S3, copy them into `webroot/` before deploying (for example
`webroot/debug_kit/` for a plugin named `DebugKit`) and add them to `assets`.

Set up a custom domain on CloudFront (with an ACM certificate in the
`us-east-1` region), not on API Gateway, and set `APP_FULL_BASE_URL` to it.
See [Custom domain name](https://bref.sh/docs/use-cases/websites#custom-domain-name)
in the Bref documentation.

## Database

Amazon RDS and Aurora (MySQL or PostgreSQL) work with the `DB_*` settings of
`config/database.php`; Bref enables `pdo_mysql` and `pdo_pgsql`. Things to
plan for:

- **Network.** A database in a private VPC requires the functions to run in that
  VPC (`provider.vpc` with `securityGroupIds` and `subnetIds` in
  `serverless.yml`). Functions in a VPC have no internet access, so they cannot
  reach SSM, DynamoDB, SES or S3 unless the VPC has a NAT gateway or VPC
  endpoints for these services. Remember that `bref-ssm:` variables are
  resolved when an instance starts, so a missing route makes every cold start
  fail. A publicly accessible database avoids the VPC, at the cost of exposing
  it to the internet; see
  [Using a database](https://bref.sh/docs/environment/database) in the Bref
  documentation.
- **Connections.** Each Lambda instance handles one request at a time and opens
  its own connection, so the number of connections grows with the concurrency
  of the functions. Use
  [Amazon RDS Proxy](https://docs.aws.amazon.com/lambda/latest/dg/configuration-database.html)
  to pool connections, and set `reservedConcurrency` on the functions to cap
  the number of instances. Do not enable `persistent` connections.
- **Schema changes.** Deployments switch to the new code while the database
  keeps the old schema for a moment. Run migrations with a console command
  before or after the deployment (see [Console Commands](#console-commands)),
  and keep schema changes compatible with both versions of the code.

## Console Commands

The `console` function runs `php bin/cake` with the arguments in the event.
Run a command from your machine or from CI with the Bref plugin of the
Serverless CLI:

```bash
npx serverless bref:cli --stage=prod --args="command_list"

# For example, to update the database from config/Schema/schema.php:
npx serverless bref:cli --stage=prod --args="schema update --yes"
```

The output and the exit code of the command are returned, and the output is
also written to CloudWatch Logs. A command that exits with a code other than 0
fails the invocation. The function can run for up to 15 minutes
(`timeout: 900`). The function has no terminal, so pass options such as
`--yes` to commands that would ask for confirmation.

To run a command on a schedule, add a `schedule` event to the `console`
function. The `input` is the argument string as a JSON string, so it is quoted
twice:

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

Schedules are EventBridge rules and use UTC. Each command runs in its own
invocation; if a run can take longer than the interval, make sure two runs of
the same command can overlap safely. See [Cron Jobs](/console-and-shells/cron-jobs)
and [Console and Shells](/console-and-shells).

## Deploying

With AWS credentials configured on your machine, install the dependencies for
production and deploy:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
npx serverless deploy --stage=prod
```

The first deployment creates the CloudFormation stack, the ECR repository and,
with Lift, a CloudFront distribution, which takes several minutes. The CLI
prints the URL of the API and of the website at the end. CloudFormation
switches traffic to the new version only after it has been deployed, and rolls
back if the deployment fails.

To see the logs of a function:

```bash
npx serverless logs --stage=prod --function=web --tail
```

### Testing the Image Locally

Bref images include the Lambda Runtime Interface Emulator, so you can run the
image as Lambda would, with a read-only filesystem:

```bash
docker build --platform linux/amd64 -t my-cake-app .
docker run --rm --platform linux/amd64 --read-only --tmpfs /tmp:exec,mode=1777 \
    -p 9000:8080 -e BREF_RUNTIME=fpm -e DEBUG=0 my-cake-app webroot/index.php
```

In another terminal, send an API Gateway event to the emulator:

```bash
curl -X POST http://localhost:9000/2015-03-31/functions/function/invocations -d '{
    "version": "2.0", "rawPath": "/posts", "rawQueryString": "",
    "headers": {"host": "localhost"},
    "requestContext": {"http": {"method": "GET", "path": "/posts",
        "protocol": "HTTP/1.1", "sourceIp": "127.0.0.1"}},
    "isBase64Encoded": false
}'
```

The response is the JSON that the function returns to API Gateway, and the
container prints the logs. To develop with a local HTTP server instead, see
[Local development](https://bref.sh/docs/local-development) in the Bref
documentation.

## Deploying from GitHub Actions

GitHub Actions can deploy on every push without storing AWS access keys:
the workflow requests an OpenID Connect (OIDC) token from GitHub, and
`aws-actions/configure-aws-credentials` exchanges it for temporary credentials
of an IAM role.

1. In IAM, add the identity provider `token.actions.githubusercontent.com` with
   the audience `sts.amazonaws.com` (once per AWS account).
2. Create a role for the deployment. Its trust policy allows only your
   repository and environment to assume it:

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

3. Give the role the permissions needed to deploy: CloudFormation, Lambda, IAM
   roles of the functions, ECR, the S3 bucket of the deployment, API Gateway,
   CloudWatch Logs, and the resources of your stack (DynamoDB, S3, CloudFront).
   Bref documents a
   [minimal policy](https://bref.sh/docs/setup/minimal-aws-policy) as a
   starting point. If `serverless.yml` uses `${ssm:...}`, the role also needs
   `ssm:GetParameter` on those parameters.
4. In the GitHub repository, create the `production` environment and the
   `AWS_DEPLOY_ROLE_ARN` variable with the ARN of the role.

The workflow installs the dependencies for production, then runs
`serverless deploy`, which builds the image, pushes it to ECR and updates the
stack:

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

Notes:

- The PHP version of the runner (`8.4`) matches the image (`bref/php-84:3`), so
  that Composer resolves the same dependencies as the image uses.
- Run your tests in a separate job or workflow, and make the deployment job
  depend on it with `needs`.
- `concurrency` makes deployments run one after another.
- To run a command after the deployment, such as a database migration, add a
  step that runs `npx serverless bref:cli --stage=prod --args="..."`.
- To deploy several stages, for example `staging` from a `develop` branch, use
  a GitHub environment and an IAM role per stage.

## Troubleshooting and Tips

- **Cold starts.** Keep the image small (exclude `tests/` and development
  dependencies, remove unused AWS SDK clients) and leave OPcache enabled.
  Bref recognizes a `warmer` event, which can keep an instance warm for
  low-traffic applications; see
  [Cold starts](https://bref.sh/docs/environment/cold-starts). Provisioned
  concurrency removes cold starts at a fixed cost.
- **Memory and CPU.** Lambda allocates CPU in proportion to the memory. 1024 MB
  is a reasonable start for the web function; compare the duration in the
  `REPORT` lines of CloudWatch Logs when you change it.
- **Timeouts.** API Gateway returns an error after 30 seconds, whatever the
  timeout of the function. Move long work to the console function or to a queue (Bref
  supports SQS with the `function` runtime).
- **6 MB limit.** Requests and responses, including uploads and generated
  files, are limited to 6 MB. Use presigned S3 URLs for larger files.
- **Binary responses.** For responses such as PDF or images generated by PHP,
  set the `BREF_BINARY_RESPONSES` environment variable to `1` so that Bref
  encodes them in base64 as API Gateway requires. Base64 adds about a third
  to the size, so such responses are limited to about 4.5 MB. See
  [Binary requests and responses](https://bref.sh/docs/use-cases/http/binary-requests-responses).
- **Disk space.** `/tmp` has 512 MB by default. Increase it with
  `ephemeralStorageSize` on the function (up to 10240 MB) if the application
  writes large temporary files.
- **Errors at startup.** "Composer detected issues in your platform" means that
  an extension, usually `intl`, is not enabled in `php/conf.d/php.ini`.
  "is not writable" warnings mean that `TMP` or `LOGS` still point into
  `/var/task`; check `config/define.php`.
- **Wrong URLs or redirects.** Redirects to the API Gateway domain mean that
  `APP_FULL_BASE_URL` is not set; URLs with a duplicated path mean that
  `SCRIPT_NAME` is not set as described in
  [Writable Directories and Request Variables](#writable-directories-and-request-variables).
- **PHP extensions.** List the loaded extensions by running a console command
  that prints them, or run `php -m` in the image:
  `docker run --rm --entrypoint php my-cake-app -m`.
