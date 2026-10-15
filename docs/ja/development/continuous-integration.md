# 継続的インテグレーション

継続的インテグレーション (CI) は、プッシュやプルリクエストのたびにチェックを実行し、壊れたテスト、
コーディング規約の違反、型のエラーを変更のマージ前に見つけます。このページでは、
[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンで作ったアプリケーションのための
GitHub Actions のワークフローを示し、各ジョブを、そのツールを詳しく説明しているページへのリンクとともに
紹介します。また、各ジョブの短いサマリーを実行結果のページに表示する方法も説明します。
Jenkins でテストを実行する方法は、最後の [Jenkins](#jenkins) で説明します。

<a id="what-to-run"></a>

## 実行するもの

CakePHP 2 のアプリケーションでは、通常、次のジョブを実行します。

| ジョブ | ツール | チェックする内容 | 詳細 |
| --- | --- | --- | --- |
| PHPUnit | `vendor/bin/phpunit` | ユニットテストと統合テスト (サポートする PHP のバージョンごと) | [テスト](/ja/development/testing)、[統合テスト](/ja/development/integration-testing) |
| コーディング規約 | `vendor/bin/phpcs` | CakePHP のコーディング規約 | [コーディング規約](/ja/contributing/cakephp-coding-conventions) |
| PHPStan | `vendor/bin/phpstan` | コードを実行せずに見つかるバグ | [静的解析](/ja/development/static-analysis) |
| E2E | `vendor/bin/phpunit -c phpunit.e2e.xml.dist` | 本物のブラウザーでのページの動作 | [エンドツーエンドテスト](/ja/development/e2e-testing) |

`pieceofcake2/app` スケルトンには、最初の 3 つの設定ファイル `phpunit.xml.dist`、`phpcs.xml`、
`phpstan.neon` が含まれており、PHPUnit、CakePHP のコードスニファー、PHPStan、
[pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/) が開発用の
依存パッケージになっています。エンドツーエンド (E2E) テストには
[pieceofcake2/e2e-test](https://pieceofcake2.github.io/e2e-test/) と少しのセットアップが必要です。
E2E テストを書いたら、このジョブを追加してください。

<a id="a-github-actions-workflow"></a>

## GitHub Actions のワークフロー

ワークフローを `.github/workflows/ci.yml` として保存します。4 つのジョブが並行して実行されます。

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - main
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  # Test values. The real salts are not in the repository (config/.env is ignored by git).
  SECURITY_SALT: ci-salt-for-tests-only-0123456789abcdef
  SECURITY_CIPHER_SEED: '1234567890'

jobs:
  phpunit:
    name: PHPUnit (PHP ${{ matrix.php-version }})
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        php-version: ['8.0', '8.1', '8.2', '8.3', '8.4', '8.5']

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: cakephp_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      DB_TEST_DATASOURCE: Database/Mysql
      DB_TEST_HOST: 127.0.0.1
      DB_TEST_PORT: 3306
      DB_TEST_USERNAME: root
      DB_TEST_PASSWORD: root
      DB_TEST_DATABASE: cakephp_test

    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php-version }}
          extensions: mbstring, intl, pdo_mysql
          coverage: pcov

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> "$GITHUB_OUTPUT"

      - name: Cache Composer packages
        uses: actions/cache@v6
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-php${{ matrix.php-version }}-composer-${{ hashFiles('composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-php${{ matrix.php-version }}-composer-

      - name: Install Composer packages
        run: composer install --no-interaction --no-progress

      - name: Create config/database.php
        run: cp config/database.php.default config/database.php

      - name: Setup problem matchers for PHPUnit
        run: echo "::add-matcher::${{ runner.tool_cache }}/phpunit.json"

      - name: Run PHPUnit
        run: vendor/bin/phpunit --log-junit junit.xml --coverage-clover coverage.xml

  phpcs:
    name: Coding standard
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          extensions: mbstring, intl
          coverage: none
          tools: cs2pr

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> "$GITHUB_OUTPUT"

      - name: Cache Composer packages
        uses: actions/cache@v6
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-php8.4-composer-${{ hashFiles('composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-php8.4-composer-

      - name: Install Composer packages
        run: composer install --no-interaction --no-progress

      - name: Check the coding standard
        id: phpcs
        run: vendor/bin/phpcs --report-full --report-checkstyle=phpcs-report.xml

      - name: Annotate the pull request
        if: ${{ always() && steps.phpcs.outcome == 'failure' }}
        run: cs2pr phpcs-report.xml

  phpstan:
    name: PHPStan
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          extensions: mbstring, intl
          coverage: none
          tools: cs2pr

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> "$GITHUB_OUTPUT"

      - name: Cache Composer packages
        uses: actions/cache@v6
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-php8.4-composer-${{ hashFiles('composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-php8.4-composer-

      - name: Install Composer packages
        run: composer install --no-interaction --no-progress

      - name: Run PHPStan
        id: phpstan
        run: vendor/bin/phpstan analyse --no-progress --error-format=checkstyle > phpstan-report.xml

      - name: Annotate the pull request
        if: ${{ always() && steps.phpstan.outcome == 'failure' }}
        run: cs2pr phpstan-report.xml

  e2e:
    name: E2E
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: cakephp_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      DB_TEST_DATASOURCE: Database/Mysql
      DB_TEST_HOST: 127.0.0.1
      DB_TEST_PORT: 3306
      DB_TEST_USERNAME: root
      DB_TEST_PASSWORD: root
      DB_TEST_DATABASE: cakephp_test

    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          extensions: mbstring, intl, pdo_mysql
          coverage: none

      - name: Get Composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> "$GITHUB_OUTPUT"

      - name: Cache Composer packages
        uses: actions/cache@v6
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-php8.4-composer-${{ hashFiles('composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-php8.4-composer-

      - name: Install Composer packages
        run: composer install --no-interaction --no-progress

      - name: Create config/database.php
        run: cp config/database.php.default config/database.php

      # Chrome for Testing and the matching chromedriver
      - name: Setup Chrome
        id: setup-chrome
        uses: browser-actions/setup-chrome@v2
        with:
          chrome-version: stable
          install-chromedriver: true

      - name: Run E2E tests
        env:
          PANTHER_CHROME_BINARY: ${{ steps.setup-chrome.outputs.chrome-path }}
          PANTHER_CHROME_DRIVER_BINARY: ${{ steps.setup-chrome.outputs.chromedriver-path }}
          PANTHER_NO_SANDBOX: 1
        run: vendor/bin/phpunit -c phpunit.e2e.xml.dist

      # Screenshots, HTML and server logs of the failed tests
      - name: Upload E2E artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v7
        with:
          name: e2e-artifacts
          path: tests/E2E/artifacts/
          retention-days: 7
          if-no-files-found: ignore
```

すべてのジョブに共通する部分は次のとおりです。

- **PHP**: [setup-php](https://github.com/shivammathur/setup-php) は、アプリケーションが必要とする
  拡張とともに PHP をインストールします。`mbstring` と `intl`、それにデータベースの PDO ドライバー
  (`pdo_mysql`、`pdo_pgsql`、`pdo_sqlite` または `pdo_sqlsrv`) です。テストで `apcu` や `redis`
  などのキャッシュエンジンを使う場合は、その拡張も追加してください。PHPUnit のジョブはマトリックスの
  PHP のバージョンごとに実行します。ほかのジョブは 1 つのバージョンだけで十分です。
- **Composer**: キャッシュのステップは、ダウンロードしたパッケージを PHP のバージョンと
  `composer.lock` をキーにして実行の間で保存します。`composer.lock` はコミットしてください。
  ロックファイルはマトリックスのすべての PHP のバージョンでインストールできる必要があります。
  新しい PHP でパッケージを更新する場合は、`composer.json` の `config.platform.php` に最も古い
  バージョン (たとえば `"8.0.30"`) を設定してください。
- **データベース**: データベースを使うジョブは、MySQL を
  [サービスコンテナー](https://docs.github.com/ja/actions/tutorials/use-containerized-services/use-docker-service-containers)
  として起動します。スケルトンでは `config/database.php` をコミットしないので、ジョブは
  `config/database.php.default` をコピーします。このファイルは `test` 接続の設定を環境変数
  `DB_TEST_*` から読み込みます ([環境変数](/ja/development/configuration#environment-variables)
  を参照)。フィクスチャはこのデータベースに作られるので、事前にテーブルを用意する必要はありません。
- **ソルト**: スケルトンは `Security.salt` と `Security.cipherSeed` を `SECURITY_SALT` と
  `SECURITY_CIPHER_SEED` から読み込みます。ワークフローではテスト用の値をセットしています。
  本番環境の値をワークフローに書いてはいけません。

PostgreSQL でテストする場合は、サービスと環境変数を次のように変更します。

```yaml
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: cakephp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd="pg_isready"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      DB_TEST_DATASOURCE: Database/Postgres
      DB_TEST_HOST: 127.0.0.1
      DB_TEST_PORT: 5432
      DB_TEST_USERNAME: postgres
      DB_TEST_PASSWORD: postgres
      DB_TEST_DATABASE: cakephp_test
```

さらに、`pdo_mysql` の代わりに `pdo_pgsql` をインストールします。両方のデータベースでテストするには、
[pieceofcake2/app](https://github.com/pieceofcake2/app/blob/2.x/.github/workflows/CI.yml) の CI
のように、マトリックスに `db-type` の軸を追加します。

従来の `app/` 構成のアプリケーションでは、ファイルは `app/` の中にあり (`app/Config/database.php`)、
データベースの設定が環境変数を読まないこともあります。その場合は、
[Jenkins](#jenkins) のように、
CI 用の `database.php` をステップの中で書き出してください。

<a id="the-jobs"></a>

## ジョブ

### PHPUnit

PHPUnit のジョブは、スケルトンの `phpunit.xml.dist` を使って `tests/TestCase` のテストを
マトリックスの PHP のバージョンごとに実行します。テストとフィクスチャの書き方は
[テスト](/ja/development/testing) を、`test` 接続については
[テスト用データベースのセットアップ](/ja/development/testing#test-database-setup) を参照してください。

`--log-junit junit.xml` はテストの結果を JUnit XML 形式で、`--coverage-clover coverage.xml`
はコードカバレッジを Clover 形式で書き出します
([コードカバレッジの生成](/ja/development/testing#generating-code-coverage) を参照)。
カバレッジにはカバレッジドライバーが必要です。setup-php の `coverage: pcov` で PCOV が
インストールされます。どちらのファイルも、[ジョブサマリー](#job-summaries) やカバレッジの
サービスが読み込みます。使わない場合は、オプションを外して `coverage: none` にすると、
ジョブが速くなります。

カバレッジのアップロードは任意です。たとえば [Codecov](https://about.codecov.io/) に送るには、
テストの後にステップを追加し、ジョブに `id-token: write` の権限を与えます (OIDC を使うと、
リポジトリにトークンを置く必要はありません)。

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v7
  with:
    use_oidc: true
    files: coverage.xml
    flags: php${{ matrix.php-version }}
```

<a id="integration-tests"></a>

### 統合テスト

`IntegrationTestTrait` を使う統合テストは、`tests/TestCase/Controller` にある普通の PHPUnit の
テストなので、PHPUnit のジョブで一緒に実行されます。統合テストは、`config/core.php` の設定
(ワークフローでセットしたソルトを含む) のもとで、アプリケーションのルートを通してリクエストを
ディスパッチします。テスト中に送信したメールは `EmailTrait` が受け取るので、実際には送信されません。
[統合テスト](/ja/development/integration-testing) を参照してください。

<a id="coding-standard"></a>

### コーディング規約

コーディング規約のジョブは、スケルトンの `phpcs.xml` を使って PHP_CodeSniffer を実行します。
この設定は CakePHP 5 のコーディング規約をもとに、CakePHP 2 のコードに合わない規則を除外したものです。
`--report-full` は違反をログに表示し、`--report-checkstyle` は違反をファイルに書き出します。
チェックが失敗すると、setup-php の `tools: cs2pr` でインストールされる
[cs2pr](https://github.com/staabm/annotate-pull-request-from-checkstyle) が、そのファイルを
プルリクエストの変更行へのアノテーションに変換します。ほとんどの違反は、手元で
`vendor/bin/phpcbf` を実行すれば修正できます。
[コーディング規約](/ja/contributing/cakephp-coding-conventions) を参照してください。

### PHPStan

PHPStan のジョブは、
[pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/) 拡張を読み込む
スケルトンの `phpstan.neon` を使ってコードを解析します。`--error-format=checkstyle` は cs2pr が
読める形式でエラーを書き出し、`--no-progress` はログを短くします。このジョブにデータベースは
必要ありません。設定、ルールレベル、ベースラインについては [静的解析](/ja/development/static-analysis)
を参照してください。

<a id="e2e-tests"></a>

### エンドツーエンドテスト {#e2e-テスト}

E2E のジョブは、[pieceofcake2/e2e-test](https://pieceofcake2.github.io/e2e-test/) のブラウザー
テストを専用の `phpunit.e2e.xml.dist` で実行します。PHPUnit のジョブと同じくデータベースが必要で、
さらに chromedriver とバージョンの合った Chrome が必要です。これは
[setup-chrome](https://github.com/browser-actions/setup-chrome) がインストールします。
ほかのジョブより時間がかかるので、1 つの PHP のバージョンで実行してください。

テストが失敗すると、スクリーンショット、ページの HTML、サーバーのログが保存されます。アップロードの
ステップは、それらを実行結果のアーティファクトとして 7 日間保存します。`path` は E2E の
ブートストラップファイルの `artifactsDir` に合わせてください。ビルドで CSS や JavaScript の
ファイルを生成する場合は、E2E テストの前にビルドしてください。

[エンドツーエンドテスト](/ja/development/e2e-testing#continuous-integration) と
[e2e-test のドキュメントの CI の節](https://pieceofcake2.github.io/e2e-test/#ci-with-github-actions)
を参照してください。

<a id="job-summaries"></a>

## ジョブサマリー

失敗したジョブのエラーは、ほかのステップの出力にはさまれてログに表示されます。
[pieceofcake2/ci-summary](https://github.com/pieceofcake2/ci-summary)
アクションを使うと、ジョブのレポートを
[ジョブサマリー](https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-commands)
に変換して、実行結果のページに表示できます。

- **テスト** (PHPUnit の JUnit XML): テスト、アサーション、失敗、スキップの数、実行時間、
  カバレッジと、失敗したテストごとのテスト内の行とメッセージの表。アサーションの差分などの長い
  メッセージは、折りたたまれた節に全文が表示されます。
- **コーディング規約** (phpcs の checkstyle): エラーと警告の数と、違反ごとの場所、ルール、
  メッセージの表。
- **PHPStan** (checkstyle または JSON): エラーの数と、エラーごとの場所、識別子、メッセージの表。

![テストが 1 つ失敗した PHPUnit のジョブのジョブサマリー](/ci-summary-phpunit-failure.png)

アクションの実行にはランナーに PHP が必要ですが、これらのジョブではすでにセットアップしています。
トークンも権限も必要なく、アクションがジョブを失敗させることはありません。レポートがない場合は
警告になります。レポートを書き出すステップの後に <code v-pre>if: ${{ !cancelled() }}</code> を付けて追加すると、
そのステップが失敗したときにも実行されます。

### PHPUnit

マトリックスの値をタイトルに入れると、実行結果のページで各ジョブのサマリーを区別できます。

```yaml
- name: PHPUnit summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: junit
    title: PHPUnit — PHP ${{ matrix.php-version }}
    file: junit.xml
    coverage: coverage.xml
```

ジョブが Clover のレポートを書き出さない場合は、`coverage` を省いてください。

<a id="coding-standard-1"></a>

### コーディング規約

```yaml
- name: PHPCS summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: checkstyle
    title: PHPCS
    file: phpcs-report.xml
```

サマリーの最後には、`vendor/bin/phpcbf` の実行を勧めるヒントが表示されます。cs2pr のステップは
そのまま残してください。cs2pr はプルリクエストにアノテーションを追加し、サマリーは一覧を表示します。

### PHPStan

```yaml
- name: PHPStan summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: phpstan
    title: PHPStan
    file: phpstan-report.xml
```

アクションは PHPStan の JSON 形式の出力 (`--error-format=json`) も読み込めます。

<a id="e2e-tests-1"></a>

### エンドツーエンドテスト {#e2e-テスト-1}

E2E のステップで JUnit のレポートを書き出し、アップロードするアーティファクトの名前を
`artifact-name` に渡します。テストが失敗した場合、サマリーには、スクリーンショットやログがある
実行結果のアーティファクトへのリンクの行が追加されます。

```yaml
- name: Run E2E tests
  env:
    PANTHER_CHROME_BINARY: ${{ steps.setup-chrome.outputs.chrome-path }}
    PANTHER_CHROME_DRIVER_BINARY: ${{ steps.setup-chrome.outputs.chromedriver-path }}
    PANTHER_NO_SANDBOX: 1
  run: vendor/bin/phpunit -c phpunit.e2e.xml.dist --log-junit e2e-junit.xml

# ... the upload step

- name: E2E summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: junit
    title: E2E
    file: e2e-junit.xml
    artifact-name: e2e-artifacts
    artifact-note: Screenshots, page HTML and server logs of the failed tests are in the {artifact} artifact.
```

![アーティファクトへのリンクがある、失敗した E2E テストのジョブサマリー](/ci-summary-e2e-failure.png)

名前はアップロードのステップと同じにしてください。E2E のジョブをマトリックスで実行する場合は、
両方のステップで、たとえば <code v-pre>e2e-artifacts-php${{ matrix.php-version }}</code> のように、ジョブごとに
別のアーティファクト名を付けてください。

<a id="versions"></a>

### バージョン

`@v1` はアクションの最新の `v1.x.y` リリースを指します。修正や新しい任意の入力は追加されますが、
互換性を壊す変更はありません。特定のリリースに固定するには、`@v1.0.0` またはコミットの SHA を
使ってください。すべての入力やほかのツールのレポートについては、
[ci-summary の README](https://github.com/pieceofcake2/ci-summary#readme)
を参照してください。

<a id="jenkins"></a>

## Jenkins

[Jenkins](https://www.jenkins.io) は継続的インテグレーションサービスで、テストケースの自動化を
手助けしてくれます。これにより、すべてのテストをパスし続けていることを保証し、あなたのアプリケーションを
いつでもデプロイできる状態にしてくれます。

CakePHP と Jenkins はかなり簡単にインテグレーションすることができます。ここでの解説は、すでに
Unix ライクな環境に Jenkins がインストールされていて、管理者権限を持つことができる状態を前提とします。
また、ジョブの作成とビルドの方法も知っているものとします。もしわからない場合は
[Jenkins のドキュメント](https://www.jenkins.io/doc/) を参考にしてください。
同じ手順は他の CI サービスにも当てはまります。

### ジョブの作成

アプリケーションのためのジョブを作成することから始めてください。次に、Jenkins があなたのコードに
アクセスできるように、リポジトリと接続します。PHPUnit を含む依存パッケージをインストールする
*シェルスクリプトの実行* を加えてください。

``` bash
composer install --no-interaction
```

### テスト用データベースの設定の追加

Jenkins のために別のデータベースを用意するのは、初歩的な問題を回避するためには良い考えです。
Jenkins がアクセスできる (通常は localhost の) データベースサーバーに新しくデータベースを
作成したら、以下のような *シェルスクリプトの実行* をビルドに加えてください。

``` bash
cat > config/database.php <<'DATABASE_PHP'
<?php
class DATABASE_CONFIG
{
    public $test = [
        'datasource' => 'Database/Mysql',
        'host' => 'localhost',
        'database' => 'jenkins_test',
        'login' => 'jenkins',
        'password' => 'cakephp_jenkins',
        'encoding' => 'utf8mb4',
    ];
}
DATABASE_PHP
```

これにより、Jenkins が要求する正しいデータベース設定が常にあることを保証してくれます。
他の設定ファイルにも同じことをしておきましょう。ときどきビルドする前ごとに、データベースを drop し、
再度 create するとよいでしょう。
一度ビルドに失敗すると、立て続けに起きるであろう失敗の連鎖を断ち切ってくれるはずです。

さらに以下の *シェルスクリプトの実行* をビルドに加えてください。

``` bash
mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';
```

### テストの追加

また別の *シェルスクリプトの実行* をビルドに加えてください。このステップではアプリケーションのテストを実行します。
junit のログファイル作成、またはCloverのカバレッジにより、テストの結果を視覚的に確認できるようになります。

``` bash
vendor/bin/phpunit \
    --log-junit junit.xml \
    --coverage-clover clover.xml
```

Clover のカバレッジや JUnit の結果を使う場合は、Jenkins 側でもそれらを設定してください。
設定しないと結果を見ることができません。

### ビルドを実行する

これでビルドを実行することができるようになりました。
コンソールの出力を確認して、ビルドをパスするように必要な変更を加えましょう。
