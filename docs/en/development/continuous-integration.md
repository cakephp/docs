# Continuous Integration

Continuous integration (CI) runs your checks on every push and pull request,
so that a broken test, a coding standard violation or a type error is found
before the change is merged. This page shows a GitHub Actions workflow for an
application built on the [pieceofcake2/app](https://pieceofcake2.github.io/app/)
skeleton, introduces each of its jobs with a link to the page that covers the
tool in detail, and shows how to add a short summary of each job to the run
page. Running the tests on a Jenkins server is described at the end, in
[Jenkins](#jenkins).

## What to Run

A CakePHP 2 application usually runs these jobs:

| Job | Tool | What it checks | Details |
| --- | --- | --- | --- |
| PHPUnit | `vendor/bin/phpunit` | Unit tests and integration tests (the `App` suite), on each supported PHP version | [Testing](/development/testing), [Integration Testing](/development/integration-testing) |
| Coding standard | `vendor/bin/phpcs` | The CakePHP coding standard | [Coding Standards](/contributing/cakephp-coding-conventions) |
| PHPStan | `vendor/bin/phpstan` | Bugs found without running the code | [Static Analysis](/development/static-analysis) |
| End-to-End | `vendor/bin/phpunit --testsuite EndToEnd` | Pages in a real browser | [End-to-End Testing](/development/e2e-testing) |

The `pieceofcake2/app` skeleton already includes the configuration for the
first three: `phpunit.xml.dist`, `phpcs.xml` and `phpstan.neon`, with PHPUnit,
the CakePHP codesniffer, PHPStan and
[pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/)
as development dependencies. Its `phpunit.xml.dist` also has an `EndToEnd` test
suite next to the default `App` suite. End-to-End (E2E) tests need
[pieceofcake2/e2e-test](https://pieceofcake2.github.io/e2e-test/) and a little
setup; add that job when you have E2E tests.

## A GitHub Actions Workflow

Save the workflow as `.github/workflows/ci.yml`. It runs the four jobs in
parallel:

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

  end-to-end:
    name: End-to-End
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

      - name: Run End-to-End tests
        env:
          PANTHER_CHROME_BINARY: ${{ steps.setup-chrome.outputs.chrome-path }}
          PANTHER_CHROME_DRIVER_BINARY: ${{ steps.setup-chrome.outputs.chromedriver-path }}
          PANTHER_NO_SANDBOX: 1
        run: vendor/bin/phpunit --testsuite EndToEnd

      # Screenshots, HTML and server logs of the failed tests
      - name: Upload End-to-End artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v7
        with:
          name: e2e-artifacts
          path: tmp/e2e-artifacts/
          retention-days: 7
          if-no-files-found: ignore
```

The parts that every job shares:

- **PHP.** [setup-php](https://github.com/shivammathur/setup-php) installs PHP
  with the extensions the application needs: `mbstring` and `intl`, and the
  PDO driver of your database (`pdo_mysql`, `pdo_pgsql`, `pdo_sqlite` or
  `pdo_sqlsrv`). Add the extensions of your cache engines, such as `apcu` or
  `redis`, if the tests use them. The PHPUnit job runs on every PHP version
  in its matrix; the other jobs need only one version.
- **Composer.** The cache steps keep the downloaded packages between runs,
  keyed by the PHP version and `composer.lock`. Commit `composer.lock`. A
  lock file must install on every PHP version of the matrix, so set
  `config.platform.php` in `composer.json` to the lowest one (for example
  `"8.0.30"`) if you update the packages on a newer PHP.
- **Database.** The jobs that use the database start MySQL as a
  [service container](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers).
  `config/database.php` is not committed in the skeleton, so the job copies
  `config/database.php.default`, which reads the `test` connection from the
  `DB_TEST_*` environment variables (see
  [Environment Variables](/development/configuration#environment-variables)).
  Fixtures are created in this database, so the tests do not need any tables
  beforehand.
- **Salts.** The skeleton reads `Security.salt` and `Security.cipherSeed`
  from `SECURITY_SALT` and `SECURITY_CIPHER_SEED`. The workflow sets test
  values for them; never put your production values in the workflow.

To test with PostgreSQL instead, change the service and the environment
variables:

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

and install `pdo_pgsql` instead of `pdo_mysql`. To test both databases, add a
`db-type` axis to the matrix, as the CI of
[pieceofcake2/app](https://github.com/pieceofcake2/app/blob/2.x/.github/workflows/CI.yml)
does.

In an application with the legacy `app/` layout, the files are in `app/`
(`app/Config/database.php`), and the database configuration may not read
environment variables; write a `database.php` for CI in a step instead, as in
[Jenkins](#jenkins).

## The Jobs

### PHPUnit

The PHPUnit job runs the tests in `tests/TestCase` with the skeleton's
`phpunit.xml.dist`, on each PHP version of the matrix. See
[Testing](/development/testing) for writing tests and fixtures, and
[Test Database Setup](/development/testing#test-database-setup) for the
`test` connection.

`--log-junit junit.xml` writes the results in the JUnit XML format, and
`--coverage-clover coverage.xml` writes the code coverage in the Clover format
(see [Generating code coverage](/development/testing#generating-code-coverage)).
Coverage needs a coverage driver; `coverage: pcov` in setup-php installs PCOV.
Both files are read by the [job summary](#job-summaries) and by coverage
services. If you do not use them, drop the options and set `coverage: none`,
which makes the job faster.

Uploading the coverage is optional. For example, to send it to
[Codecov](https://about.codecov.io/), add a step after the tests and the
`id-token: write` permission to the job (OIDC needs no token in the
repository):

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v7
  with:
    use_oidc: true
    files: coverage.xml
    flags: php${{ matrix.php-version }}
```

### Integration Tests

Integration tests with `IntegrationTestTrait` are ordinary PHPUnit tests in
`tests/TestCase/Controller`, so the PHPUnit job runs them too. They dispatch
requests through your routes with the settings of `config/core.php`,
including the salts that the workflow sets. Emails sent during the tests are captured
by `EmailTrait` and are not delivered. See
[Integration Testing](/development/integration-testing).

### Coding Standard

The coding standard job runs PHP_CodeSniffer with the skeleton's `phpcs.xml`,
which is based on the CakePHP 5 coding standard with exclusions for CakePHP 2
code. `--report-full` shows the violations in the log, and
`--report-checkstyle` writes them to a file. When the check fails,
[cs2pr](https://github.com/staabm/annotate-pull-request-from-checkstyle),
which setup-php installs with `tools: cs2pr`, turns the file into annotations
on the changed lines of the pull request. Fix most violations locally with
`vendor/bin/phpcbf`. See
[Coding Standards](/contributing/cakephp-coding-conventions).

### PHPStan

The PHPStan job analyses the code with the skeleton's `phpstan.neon`, which
includes the
[pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/)
extension. `--error-format=checkstyle` writes the errors in the format that
cs2pr reads, and `--no-progress` keeps the log short. The job needs no
database. See [Static Analysis](/development/static-analysis) for the
configuration, the rule level and the baseline.

### End-to-End Tests {#e2e-tests}

The `end-to-end` job runs the browser tests of
[pieceofcake2/e2e-test](https://pieceofcake2.github.io/e2e-test/), the
`EndToEnd` suite of the same `phpunit.xml.dist`. It is a separate job, so the
PHPUnit job keeps running only the `App` suite (`defaultTestSuite="App"`) and
needs no browser. If you removed `defaultTestSuite`, run the PHPUnit job with
`--testsuite App`. The `end-to-end` job needs the database, like the PHPUnit
job: `E2E_SERVER_DATASOURCE=test` in `phpunit.xml.dist` passes the `DB_TEST_*`
values to the application server. It also needs a Chrome that matches its
chromedriver, which [setup-chrome](https://github.com/browser-actions/setup-chrome)
installs. Run it on one PHP version: it is slower than the other jobs.

When a test fails, the tests save a screenshot, the page HTML and the server
logs to `tmp/e2e-artifacts/`; the upload step keeps them as an artifact of the
run for 7 days. If you set `E2E_ARTIFACTS_DIR`, make the `path` match. If your
build creates CSS or JavaScript files, build them before the End-to-End tests.

See [End-to-End Testing](/development/e2e-testing#continuous-integration) and the
[CI section of the e2e-test documentation](https://pieceofcake2.github.io/e2e-test/#ci-with-github-actions).

## Job Summaries

A failed job shows its errors in the log, between the output of the other
steps. The
[pieceofcake2/ci-summary](https://github.com/pieceofcake2/ci-summary)
action turns the report of a job into a
[job summary](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary),
which is shown on the run page:

- **Tests** (JUnit XML from PHPUnit): the number of tests, assertions,
  failures and skipped tests, the time and the coverage, and a table of the
  failed tests with the line in the test and the message. Long messages,
  such as assertion diffs, are shown in full in a collapsed section.
- **Coding standard** (checkstyle from phpcs): the number of errors and
  warnings, and a table with the location, the rule and the message of each.
- **PHPStan** (checkstyle or JSON): the number of errors, and a table with the
  location, the identifier and the message of each.

![Job summary of a PHPUnit job with one failed test](/ci-summary-phpunit-failure.png)

The action needs PHP on the runner, which these jobs already set up. It needs
no token and no permissions, and it never fails the job: a missing report
ends in a warning. Add it after the step that writes the report, with
<code v-pre>if: ${{ !cancelled() }}</code>, so that it also runs when that step fails.

### PHPUnit

Put the matrix values into the title, so that the summaries of the jobs can
be told apart on the run page:

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

Leave out `coverage` if the job does not write a Clover report.

### Coding Standard

```yaml
- name: PHPCS summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: checkstyle
    title: PHPCS
    file: phpcs-report.xml
```

The summary ends with a hint to run `vendor/bin/phpcbf`. The cs2pr step stays:
it adds the annotations to the pull request, and the summary shows the list.

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

The action also reads PHPStan's JSON output (`--error-format=json`).

### End-to-End Tests {#e2e-tests-1}

Write a JUnit report in the End-to-End step, and pass the name of the uploaded
artifact as `artifact-name`. When tests failed, the summary adds a line that
links to the artifacts of the run, where the screenshots and logs are:

```yaml
- name: Run End-to-End tests
  env:
    PANTHER_CHROME_BINARY: ${{ steps.setup-chrome.outputs.chrome-path }}
    PANTHER_CHROME_DRIVER_BINARY: ${{ steps.setup-chrome.outputs.chromedriver-path }}
    PANTHER_NO_SANDBOX: 1
  run: vendor/bin/phpunit --testsuite EndToEnd --log-junit e2e-junit.xml

# ... the upload step

- name: End-to-End summary
  if: ${{ !cancelled() }}
  uses: pieceofcake2/ci-summary@v1
  with:
    type: junit
    title: End-to-End
    file: e2e-junit.xml
    artifact-name: e2e-artifacts
    artifact-note: Screenshots, page HTML and server logs of the failed tests are in the {artifact} artifact.
```

![Job summary of failed E2E tests with a link to the artifact](/ci-summary-e2e-failure.png)

Use the same name as in the upload step. If the `end-to-end` job runs in a matrix,
give each job its own artifact name, for example
<code v-pre>e2e-artifacts-php${{ matrix.php-version }}</code>, in both steps.

### Versions

`@v1` follows the latest `v1.x.y` release of the action, which gets fixes and
new optional inputs but no breaking changes. To pin an exact release, use
`@v1.0.0` or a commit SHA. See the
[ci-summary README](https://github.com/pieceofcake2/ci-summary#readme)
for all inputs and for reports of other tools.

## Jenkins {#jenkins}

[Jenkins](https://www.jenkins.io) is a continuous integration server, that can
help you automate the running of your test cases. This helps ensure that all
your tests stay passing and your application is always ready.

Integrating a CakePHP application with Jenkins is fairly straightforward. The
following assumes you've already installed Jenkins on \*nix system, and are able
to administer it. You also know how to create jobs, and run builds. If you are
unsure of any of these, refer to the [Jenkins documentation](https://www.jenkins.io/doc/).

### Create a job

Start off by creating a job for your application, and connect your repository
so that jenkins can access your code. Add a *shell script step* that installs
the dependencies, including PHPUnit:

``` bash
composer install --no-interaction
```

### Add test database config

Using a separate database just for Jenkins is generally a good idea, as it stops
bleed through and avoids a number of basic problems. Once you've created a new
database in a database server that jenkins can access (usually localhost). Add
a *shell script step* to the build that contains the following:

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

This ensures that you'll always have the correct database configuration that
Jenkins requires. Do the same for any other configuration files you need to.
It's often a good idea to drop and re-create the database before each build as
well. This insulates you from chained failures, where one broken build causes
others to fail. Add another *shell script step* to the build that contains the
following:

``` bash
mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';
```

### Add your tests

Add another *shell script step* to your build. In this step run the tests for
your application. Creating a junit log file, or clover coverage is often a nice
bonus, as it gives you a nice graphical view of your testing results:

``` bash
vendor/bin/phpunit \
    --log-junit junit.xml \
    --coverage-clover clover.xml
```

If you use clover coverage, or the junit results, make sure to configure those
in Jenkins as well. Failing to configure those steps will mean you won't see the
results.

### Run a build

You should be able to run a build now. Check the console output and make any
necessary changes to get a passing build.
