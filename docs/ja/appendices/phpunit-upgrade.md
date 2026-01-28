# PHPUnit アップグレード

このガイドでは、CakePHP 5.x アプリケーションの PHPUnit バージョン要件と移行手順について説明します。

## 現在の要件

CakePHP 5.x は **PHPUnit ^11.5.3 または ^12.1.3** が必要です:

- PHPUnit 11.5.3+ は **PHP 8.2** 以降が必要です
- PHPUnit 12.1.3+ は **PHP 8.3** 以降が必要です

> [!NOTE]
> CakePHP 5.x では PHPUnit 10 はサポートされなくなりました。まだ PHPUnit 10 を使用している場合は、
> PHPUnit 11 または 12 にアップグレードする必要があります。

## phpunit.xml の調整

PHPUnit の設定ファイルを、以下のコマンドで更新することが推奨されます:

    vendor/bin/phpunit --migrate-configuration

> [!NOTE]
> 上記のコマンドを実行する前に、 `vendor/bin/phpunit --version` を実行して現在の PHPUnit バージョンを確認して下さい。

このコマンドを実行することによって、お手元のプロジェクトの `phpunit.xml` ファイルには推奨される変更が適用された状態になります。

### エクステンション設定

PHPUnit 10 は、古い hook の仕組みを削除した上で、新しい [イベントシステム](https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner) が導入されました。
以下に示すような `phpunit.xml` は:

``` xml
<extensions>
  <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
</extensions>
```

次のように調整されます:

``` xml
<extensions>
  <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
</extensions>
```

## PHPUnit 9 から 10 へ

### `->withConsecutive()` の削除

削除されたメソッド `->withConsecutive()` は、応急措置的に置き換え可能です。例えば以下のコードは:

``` php
->withConsecutive(['firstCallArg'], ['secondCallArg'])
```

次のように置き換えられます:

``` php
->with(
    ...self::withConsecutive(['firstCallArg'], ['secondCallArg'])
)
```

`Cake\TestSuite\TestCase` クラスには、 `Cake\TestSuite\PHPUnitConsecutiveTrait` 経由で、静的メソッド `self::withConsecutive()` が追加されました。なので、TestCase のクラスに手動で trait を仕込む必要はありません。

### data provider は static に

お手元のプロジェクトのテストケースにおいて、PHPUnit の data provider 機能を活用している場合、それを static にする必要があります。例えば以下のコードは:

``` php
public function myProvider(): array
```

次のように置き換えて下さい:

``` php
public static function myProvider(): array
```

## PHPUnit 10 から 11 へ

PHPUnit 11 は PHP 8.2 以降が必要です。

### アノテーションの非推奨化

PHPUnit 11 では docblock のアノテーションが非推奨になりました。PHP 8 のアトリビュートに移行して下さい:

``` php
// 以前（非推奨）
/**
 * @dataProvider myProvider
 */
public function testSomething(): void

// 移行後
#[DataProvider('myProvider')]
public function testSomething(): void
```

主なアトリビュートの置き換え:

| アノテーション | アトリビュート |
|------------|-----------|
| `@dataProvider` | `#[DataProvider('methodName')]` |
| `@depends` | `#[Depends('methodName')]` |
| `@group` | `#[Group('name')]` |
| `@covers` | `#[CoversClass(ClassName::class)]` |
| `@test` | `#[Test]` |

アトリビュートクラスは `PHPUnit\Framework\Attributes` からインポートして下さい。

### 抽象クラスのテストダブルが非推奨に

抽象クラスおよびトレイトのモックオブジェクトを作成するメソッドが非推奨になりました。トレイトを使用するクラスから分離してテストすることは推奨されません。

### スタブのエクスペクテーションが非推奨に

`createStub()` で作成したオブジェクトにエクスペクテーションを設定すると、非推奨の警告が表示されます:

``` php
// 非推奨 - PHPUnit 11 で警告が出ます
$stub = $this->createStub(SomeClass::class);
$stub->expects($this->once())->method('foo');

// エクスペクテーションが必要な場合は createMock() を使用して下さい
$mock = $this->createMock(SomeClass::class);
$mock->expects($this->once())->method('foo');
```

### テストクラスの命名規則

テストクラス名はファイル名と一致する必要があります。`FooTest.php` のテストクラスは `FooTest` という名前でなければなりません。

## PHPUnit 11 から 12 へ

PHPUnit 12 は PHP 8.3 以降が必要です。

### アノテーションの削除

docblock アノテーションのサポートが削除されました。すべてのテストで PHP 8 のアトリビュートを使用する必要があります。

### 抽象クラスのテストダブルの削除

抽象クラスおよびトレイトのモックオブジェクトを作成するメソッドが完全に削除されました。

### スタブのエクスペクテーションの削除

`createStub()` で作成したオブジェクトへのエクスペクテーション設定は機能しなくなりました。エクスペクテーション設定が必要なテストダブルには `createMock()` を使用して下さい。

## Rector による自動移行

[Rector](https://getrector.com/) を使用すると、多くの変更を自動化できます:

``` bash
composer require --dev rector/rector rector/rector-phpunit

# rector.php 設定ファイルの作成
vendor/bin/rector init

# rector の実行
vendor/bin/rector process tests/
```

Rector の PHPUnit ルールセットを設定することで、data provider の static 変換、アノテーションからアトリビュートへの移行などの変更を自動的に処理できます。

## アップグレードチェックリスト

PHPUnit のバージョンをアップグレードする前に、以下を確認して下さい:

1. 現在の PHPUnit バージョンでテストスイートが非推奨の警告なしに実行できること
2. すべての data provider が `public static` メソッドであること
3. アノテーションではなくアトリビュートを使用していること（PHPUnit 12 で必須）
4. モックのエクスペクテーションが `createStub()` ではなく `createMock()` のみを使用していること
5. アップグレード後に `vendor/bin/phpunit --migrate-configuration` を実行すること
