# 静的解析

[PHPStan](https://phpstan.org/) は、コードを実行せずにバグを見つけます。未定義のメソッドの
呼び出し、間違った型の引数、戻り値の不足などを検出できます。[テスト](testing) を補うもので、
テストが少ない古いアプリケーションでは特に役立ちます。

CakePHP 2 は多くのオブジェクトを動的に作成します。コントローラーではモデルを `$this->Post`、
コンポーネントを `$this->Auth` として使え、ビヘイビアのメソッドをモデルから呼び出せます。
PHPStan だけではこれらを認識できません。
[pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/)
拡張を使うと、PHPStan が CakePHP 2 の仕組みを理解できるようになります。

<a id="installation"></a>

## インストール

PHPStan と拡張を開発用の依存パッケージとしてインストールします。

```bash
composer require --dev phpstan/phpstan pieceofcake2/phpstan-cakephp2
```

<a id="configuration"></a>

## 設定

PHPStan はプロジェクトルートの `phpstan.neon` から設定を読み込みます。設定では、拡張、
[ルールレベル](#choosing-a-level)、解析するディレクトリ、ブートストラップファイルを指定します。
ブートストラップファイルは、`webroot/index.php` と同じように CakePHP の定数を定義して
フレームワークを読み込みます。

<a id="modern-layout"></a>

### モダン構成

[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンの設定は次のとおりです。

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - src
        - config
    bootstrapFiles:
        - tests/phpstan-bootstrap.php
```

`phpVersion` には、アプリケーションがサポートする最も古い PHP のバージョンを指定します
(`80000` は PHP 8.0 です)。ブートストラップファイルは、リクエストのディスパッチやデータベースへの
接続を行わずに、`config/define.php` と CakePHP のブートストラップを読み込みます。

```php
<?php
// tests/phpstan-bootstrap.php

use Composer\InstalledVersions;

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

require_once dirname(__DIR__) . DS . 'config' . DS . 'define.php';
require_once VENDORS . 'autoload.php';
require_once InstalledVersions::getInstallPath('pieceofcake2/cakephp') . DS . 'src' . DS . 'Cake' . DS . 'bootstrap.php';
```

<a id="legacy-layout"></a>

### レガシー構成

レガシーな `app/` 構成のアプリケーションでは、`app/` 内のディレクトリを解析し、
ブートストラップファイルでパスの定数を定義します。

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - app/Config
        - app/Console/Command
        - app/Controller
        - app/Lib
        - app/Model
        - app/View
    excludePaths:
        - app/Config/Schema
    bootstrapFiles:
        - app/Test/phpstan-bootstrap.php
```

```php
<?php
// app/Test/phpstan-bootstrap.php

use Composer\InstalledVersions;

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(__DIR__, 2));
define('APP_DIR', 'app');
define('WEBROOT_DIR', 'webroot');
define('WWW_ROOT', ROOT . DS . APP_DIR . DS . WEBROOT_DIR . DS);

require_once InstalledVersions::getInstallPath('pieceofcake2/cakephp') . '/src/Cake/bootstrap.php';
```

アプリケーションに無いディレクトリは `paths` から削除してください。

<a id="plugins"></a>

### プラグイン

プラグインは、プラグイン自身のディレクトリから、テスト用のブートストラップファイルを使って
解析します。`paths` にプラグインのディレクトリを並べ、プラグインのビヘイビアを
`behaviorPaths` に追加します ([ビヘイビアとスキーマファイル](#behaviors-and-schema-files)
を参照してください)。

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - Console
        - Controller
        - Lib
        - Model
        - View
    bootstrapFiles:
        - tests/bootstrap.php
    ModelBehaviorsExtension:
        behaviorPaths:
            - Model/Behavior/*.php
```

<a id="running-phpstan"></a>

## PHPStan の実行

```bash
vendor/bin/phpstan analyse
```

PHPStan は、エラーごとにファイルと行を表示します。CI のジョブでは、`--no-progress` を付けると
ログが短くなります。

<a id="what-the-extension-adds"></a>

## 拡張が追加する機能

拡張は PHPStan に以下の機能を追加します。

- ビヘイビアのメソッドを、すべてのモデルのメソッドとして扱います
  (`$this->Post->behaviorMethod()`)。
- コントローラー、モデル、シェルの、モデルクラスと同じ名前のプロパティを、そのクラスの
  インスタンスとして扱います (コントローラーの `$this->Post`)。
- コントローラーとコンポーネントの、`$components` に指定したコンポーネントと同じ名前の
  プロパティを、そのクラスのインスタンスとして扱います (`$this->Auth`)。
- シェルの、タスククラスと同じ名前のプロパティを、そのクラスのインスタンスとして扱います。
- `ClassRegistry::init('Post')` が、可能な場合は `Post` を返し、スキーマファイルにテーブルだけが
  定義されている場合は `Model` を返すものとして扱います。
- `$this->Components->load('Name')` が `NameComponent` を返すものとして扱います。

それ以外のマジックプロパティには、CakePHP のコアと同じようにクラスに `@property` タグを
追加します。たとえば、ほかのヘルパーを使うヘルパーでは次のようにします。

```php
// src/View/Helper/LinkHelper.php
/**
 * @property HtmlHelper $Html
 */
class LinkHelper extends AppHelper
{
    public $helpers = ['Html'];

    public function home(): string
    {
        return $this->Html->link('Home', '/');
    }
}
```

<a id="behaviors-and-schema-files"></a>

### ビヘイビアとスキーマファイル

拡張は、PHPStan を実行するディレクトリからの相対的な glob パターンで、ビヘイビアと
スキーマファイルを探します。デフォルトでは、コアのビヘイビア、モダン構成の
`src/Model/Behavior`、`plugins/*/Model/Behavior`、`config/Schema`、レガシー構成の
`app/Model/Behavior`、`app/Plugin/*/Model/Behavior`、`app/Config/Schema` が対象です。
ほかの場所は `phpstan.neon` に追加します。追加した場所はデフォルトにマージされます。

```yaml
parameters:
    ModelBehaviorsExtension:
        behaviorPaths:
            - vendor/my-vendor/my-plugin/src/Model/Behavior/*.php
    SchemaService:
        schemaPaths:
            - vendor/my-vendor/my-plugin/config/Schema/*.php
```

<a id="choosing-a-level"></a>

## レベルの選び方

PHPStan には 0 (最も緩い) から 10 までの
[ルールレベル](https://phpstan.org/user-guide/rule-levels) があります。各レベルは、
前のレベルにチェックを追加します。たとえば、レベル 0 は未知のクラスやメソッドを報告し、
レベル 3 は戻り値の型を、レベル 5 はメソッドや関数に渡す引数の型をチェックし、
レベル 6 はあらゆる場所に型宣言を求めます。

CakePHP 2 のアプリケーションでは、レベル 5 を目標にするのがよいでしょう。実際のバグを見つけられ、
必要な修正も小さく済みます。`pieceofcake2/app` スケルトンと
[メンテナンスしているプラグイン](/ja/plugins/maintained-plugins) は、CI で PHPStan を
レベル 5 で実行しています。レベル 6 以上では主に型宣言や配列の形の指定が求められますが、
CakePHP 2 のコードにはそれらがほとんどありません。

既存のアプリケーションでは、レベル 0 から始めてエラーを修正し、レベルを 1 つずつ上げていきます。
一度に修正しきれないほどエラーが多い場合は、現在のエラーを
[ベースライン](https://phpstan.org/user-guide/baseline) に記録すると、新しいエラーだけが
報告されるようになります。

```bash
vendor/bin/phpstan analyse --generate-baseline
```

生成された `phpstan-baseline.neon` を `phpstan.neon` の `includes` に追加し、記録された
エラーを少しずつ修正していきます。
