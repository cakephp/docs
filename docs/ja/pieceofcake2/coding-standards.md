# コーディング規約

::: pieceofcake2
このページは **pieceofcake2 フォーク** 固有の内容で、本家 CakePHP 2.x のドキュメントには含まれません。
フォークのコードについては、[コーディング規約](/ja/contributing/cakephp-coding-conventions) に
書かれたルールの代わりにこのページの規約が適用されます。
:::

## フォークが採用している規約

pieceofcake2/cakephp は、本家 2.x ブランチで使われていた 1.x 系のスニファーではなく、
CakePHP 5 のコーディング規約（PSR-12 ベース）である
[cakephp/cakephp-codesniffer](https://github.com/cakephp/cakephp-codesniffer) **^5.0**
でコードをチェックしています（[PR #8](https://github.com/pieceofcake2/cakephp/pull/8)）。
コードベース全体を `phpcbf` で整形し、PHP 8 の構文に書き換えています
（[PR #7](https://github.com/pieceofcake2/cakephp/pull/7)）。

CakePHP 2 には名前空間が無く、`App::uses()` を使い、独自の命名規則もあるため、フォークの
[`phpcs.xml`](https://github.com/pieceofcake2/cakephp/blob/2.x/phpcs.xml) では
CakePHP 5 の規約の一部のルールを除外しています。

| グループ | 除外しているルール | 理由 |
|----------|--------------------|------|
| 名前空間とクラス | `PSR1.Classes.ClassDeclaration.MissingNamespace`、`PSR1.Files.SideEffects.FoundWithSymbols`、`Squiz.Classes.ClassFileName.NoMatch` | クラスはグローバル名前空間にあり、`App::uses()` で読み込む。PSR-1 はこれを副作用とみなす。ファイル名は CakePHP 2 の規則に従う。 |
| 名前空間とインポート | `SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace`、`SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName` | 名前空間が無いので、`use` によるインポートやアノテーションでの完全修飾名は意味を持たない。 |
| 型宣言 | `SlevomatCodingStandard.TypeHints` | CakePHP 2 の API は、引数・プロパティ・戻り値のネイティブな型宣言を使わない。 |
| 変数名 | `Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps`、`...PublicHasUnderscore`、`...PublicVarHasUnderscore` | CakePHP 2 は `$Model`、`$LinkModel`、`$_locale` のような名前や、アンダースコアで始まるプロパティを使う。 |
| 制御構造 | `SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition` | `while ($row = $result->fetch())` のような書き方が CakePHP 2 ではよく使われる。 |
| 書式 | `CakePHP.Commenting.FunctionComment.SpacingAfter`、`Generic.Files.LineLength` | ドキュメントコメントの後の空行を許可し、行の長さはチェックしない。 |

このほか `phpcs.xml` では次の設定をしています。

- `Generic.Formatting.MultipleStatementAlignment` を `maxPadding` 1 で追加
- 特定のパスに限ってルールを緩和。たとえばコントローラーとシェルでの
  `PSR1.Methods.CamelCapsMethodName.NotCamelCaps`（`admin_index` のようなアクション名のため）、
  テストでの `PSR1.Classes.ClassDeclaration.MultipleClasses` とドキュメントコメントの省略、
  `database.php`（`DATABASE_CONFIG`）での `Squiz.Classes.ValidClassName.NotPascalCase`、
  そして非推奨関数（`libxml_disable_entity_loader`、`mcrypt_*`、`strftime`）をまだ必要とする
  一部のコアファイルでの非推奨関数チェック

## 本家 2.x の規約との違い

[本家の規約](/ja/contributing/cakephp-coding-conventions) は CakePHP 2.x のスタイルを説明しています。
フォークの規約で整形したコードとの主な違いは次のとおりです。

| 本家 CakePHP 2.x | pieceofcake2 フォーク（CakePHP 5 のスニファー） |
|------------------|--------------------------------------------------|
| インデントはタブ 1 つ | インデントはスペース 4 つ |
| `array()` | 短縮配列構文 `[]` |
| メソッドの開き波括弧は同じ行 | クラスとメソッドの開き波括弧は次の行（PSR-12） |
| 1 行 100 文字（推奨）、120 文字（上限） | 行の長さはチェックしない（`Generic.Files.LineLength` を除外） |
| 制御構造の中での代入は禁止 | 条件式の中での代入を許可 |

たとえば、フォークのメソッドは次のようになります。

```php
public function connection($dns, $persistent = false)
{
    if (is_array($dns)) {
        $dnsInfo = $dns;
    } else {
        $dnsInfo = BD::parseDNS($dns);
    }

    return $dnsInfo;
}
```

フレームワークは CakePHP 2 の命名規則（クラスは CamelCase、メソッドは camelBack、protected な
メンバーは `_` で始める）を維持しています。本家の規約のその他のルールも参考になりますが、
スニファーの結果と食い違う場合は、フォークの `phpcs.xml` で実行した `phpcs` の結果を優先してください。

## チェックの実行

フォークの `composer.json` には `cs-check` や `cs-fix` のスクリプトはありません。
PHP_CodeSniffer を直接実行してください。プロジェクト直下の `phpcs.xml` が自動的に使われます。

```bash
# チェック
vendor/bin/phpcs

# 自動で直せるものを修正
vendor/bin/phpcbf
```

`vendor/bin/phpcs src/Controller` のようにパスを指定して、一部だけをチェックすることもできます。

## アプリケーションでの推奨設定

アプリケーションがフォークの規約に従う必要はありませんが、同じ規約を使うとフレームワークと
コードのスタイルがそろい、将来 CakePHP 5 に移行する際も楽になります。スニファーを開発用の
依存パッケージとしてインストールします。

```bash
composer require --dev cakephp/cakephp-codesniffer:^5.0
```

`composer.json` でインストーラープラグインを許可します
（[pieceofcake2/app](https://github.com/pieceofcake2/app) と同様）。

```json
{
    "config": {
        "allow-plugins": {
            "dealerdirect/phpcodesniffer-composer-installer": true
        }
    }
}
```

そのうえで、プロジェクト直下に `phpcs.xml` を置きます。以下は pieceofcake2/app（モダン構成）に
含まれているものです。レガシー構成の場合は、`<file>` と除外パターンを `app/Config`、
`app/Controller`、`app/Test/Case` などに読み替えてください。

```xml
<?xml version="1.0"?>
<ruleset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/squizlabs/php_codesniffer/phpcs.xsd">
    <config name="php_version" value="80000"/>

    <arg value="ps"/>
    <arg name="colors"/>
    <arg name="parallel" value="100"/>
    <arg name="extensions" value="php,php.default"/>

    <file>./config</file>
    <file>./src</file>
    <file>./tests</file>

    <rule ref="CakePHP">
        <!-- ===== Namespace and Class Rules ===== -->
        <!-- CakePHP2 uses App::uses() instead of namespaces -->
        <exclude name="PSR1.Classes.ClassDeclaration.MissingNamespace"/>
        <!-- CakePHP2 uses App::uses() which PSR1 considers side effects -->
        <exclude name="PSR1.Files.SideEffects.FoundWithSymbols"/>
        <!-- Don't enforce filename matching class name (CakePHP2 has specific conventions) -->
        <exclude name="Squiz.Classes.ClassFileName.NoMatch"/>

        <!-- ===== Namespace/Import Rules ===== -->
        <!-- Allow fully qualified class names without namespace (CakePHP2 uses global namespace) -->
        <exclude name="SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace"/>
        <!-- Don't require fully qualified class names in annotations (CakePHP2 has no namespaces) -->
        <exclude name="SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName"/>

        <!-- ===== Type Hints Rules ===== -->
        <!-- Exclude type hints rules as CakePHP2 doesn't support PHP 7+ type declarations -->
        <exclude name="SlevomatCodingStandard.TypeHints.PropertyTypeHint"/>
        <exclude name="SlevomatCodingStandard.TypeHints.ParameterTypeHint"/>
        <exclude name="SlevomatCodingStandard.TypeHints.DeclareStrictTypes.DeclareStrictTypesMissing"/>

        <!-- ===== Variable Naming Rules ===== -->
        <!-- Allow CakePHP2 style variable naming ($Model, $LinkModel, $_locale, etc.) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps"/>
        <!-- Allow underscore in public properties (CakePHP2 convention) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.PublicHasUnderscore"/>
        <!-- Allow double underscore public properties (CakePHP2 internal convention) -->
        <exclude name="Zend.NamingConventions.ValidVariableName.PublicVarHasUnderscore"/>

        <!-- ===== Control Structure Rules ===== -->
        <!-- Allow assignment in conditions (common pattern in CakePHP2: while ($row = $result->fetch())) -->
        <exclude name="SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition"/>

        <!-- ===== Formatting Rules ===== -->
        <!-- Allow blank lines after function comments (CakePHP2 style) -->
        <exclude name="CakePHP.Commenting.FunctionComment.SpacingAfter"/>
        <!-- Exclude line length checks for CakePHP2 -->
        <exclude name="Generic.Files.LineLength"/>
    </rule>

    <!-- Include additional whitespace checking rule -->
    <rule ref="Generic.Formatting.MultipleStatementAlignment">
        <properties>
            <property name="maxPadding" value="1"/>
        </properties>
    </rule>

    <rule ref="CakePHP.Commenting.FunctionComment.Missing">
        <exclude-pattern>tests/TestCase/*</exclude-pattern>
    </rule>

    <!-- Allow multiple classes in test files only (CakePHP2 test pattern) -->
    <rule ref="PSR1.Classes.ClassDeclaration.MultipleClasses">
        <exclude-pattern>tests/TestCase/*</exclude-pattern>
    </rule>

    <!-- Allow non-camelCase method names in Controllers (CakePHP2 action naming convention) -->
    <rule ref="PSR1.Methods.CamelCapsMethodName.NotCamelCaps">
        <exclude-pattern>src/Controller/*</exclude-pattern>
        <exclude-pattern>src/Console/Command/*</exclude-pattern>
        <exclude-pattern>src/Model/Behavior/*</exclude-pattern>
    </rule>

    <!-- Require return type hints for Test/Case only -->
    <rule ref="SlevomatCodingStandard.TypeHints.ReturnTypeHint.MissingNativeTypeHint">
        <include-pattern>tests/TestCase/*</include-pattern>
    </rule>

    <rule ref="Squiz.Classes.ValidClassName.NotPascalCase">
        <exclude-pattern>config/database.php</exclude-pattern>
    </rule>

    <rule ref="Squiz.PHP.NonExecutableCode.Unreachable">
        <exclude-pattern>config/acl.ini.php</exclude-pattern>
    </rule>
</ruleset>
```

フレームワークの `phpcs.xml` と比べると、アプリケーション用の設定では除外する型宣言のルールを
プロパティと引数（および `declare(strict_types=1)`）に限り、テストケース（`tests/TestCase/*`）では
ネイティブな戻り値の型を必須にしています。PHPUnit 9.6 では `setUp(): void` のようなメソッドで
もともと戻り値の型が必要です。
