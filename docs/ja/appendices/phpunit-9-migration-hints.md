# PHPUnit 9.6 への移行

本家の CakePHP 2.x は PHPUnit 3.7 でテストを実行していました。Piece of Cake 2 フォーク上の
CakePHP 2 は、PHP 8 に対応した PHPUnit 9.6 を使います。PHPUnit 3.7 向けに書いたテストケースは、
いくつか修正しないと実行できません。このページでは、よく必要になる修正をまとめます。
テストの書き方と実行方法は [テスト](/ja/development/testing) を参照してください。

## PHPUnit のインストールと実行

PHPUnit は Composer で開発用の依存パッケージとしてインストールします。

```bash
composer require --dev phpunit/phpunit:^9.6
```

[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンには、`tests/bootstrap.php` を読み込み、
フィクスチャを読み込む `CakeFixtureInjector` リスナーを登録した `phpunit.xml.dist` が含まれています。

```xml
<listeners>
    <listener class="CakeFixtureInjector" file="./vendor/pieceofcake2/cakephp/src/Cake/TestSuite/Fixture/CakeFixtureInjector.php"/>
</listeners>
```

テストは PHPUnit またはテストシェルで実行します。

```bash
vendor/bin/phpunit
bin/cake test app Model/Post
```

## クラス名

PHPUnit のクラスには名前空間が付きました。`CakeTestCase` と `CakeTestSuite` はすでに新しいクラスを
継承しているため、`CakeTestCase` を継承したテストケースで修正が必要なのは、PHPUnit のクラスを直接
参照している箇所だけです。

| PHPUnit 3.7 | PHPUnit 9.6 |
|-------------|-------------|
| `PHPUnit_Framework_TestCase` | `PHPUnit\Framework\TestCase` |
| `PHPUnit_Framework_TestSuite` | `PHPUnit\Framework\TestSuite` |
| `PHPUnit_Framework_MockObject_MockObject` | `PHPUnit\Framework\MockObject\MockObject` |
| `PHPUnit_Framework_Error` | `PHPUnit\Framework\Error\Error` |

## テンプレートメソッドの戻り値の型

`TestCase` が `void` を返すように宣言しているため、`setUp()`、`tearDown()` などのテンプレートメソッドにも
戻り値の型 `void` が必要です。

```php
public function setUp(): void
{
    parent::setUp();
    $this->Post = ClassRegistry::init('Post');
}

public function tearDown(): void
{
    unset($this->Post);
    parent::tearDown();
}

public static function setUpBeforeClass(): void
{
}
```

`tearDownAfterClass()`、`assertPreConditions()`、`assertPostConditions()` も同様です。

## 例外のテスト

`@expectedException` アノテーションと `setExpectedException()` は削除されました。
例外を投げるコードの前で、期待する例外をテストメソッドの中で宣言します。
次の例は `ControllerTestCase` のテストです。

```php
public function testViewMissingPost()
{
    $this->expectException(NotFoundException::class);
    $this->expectExceptionMessage('Invalid post');

    $this->testAction('/posts/view/999');
}
```

## モックオブジェクト

`getMock()` は PHPUnit から削除されました。既存のテストが動くように `CakeTestCase` には `getMock()` が
残っていますが、非推奨です。新しいテストでは `createMock()` または `getMockBuilder()` を使ってください。

```php
// PHPUnit 3.7
$Socket = $this->getMock('HttpSocket', ['get']);

// PHPUnit 9.6
$Socket = $this->getMockBuilder(HttpSocket::class)
    ->onlyMethods(['get'])
    ->getMock();

// すべてのメソッドを既定の動作でモックする
$Socket = $this->createMock(HttpSocket::class);
```

`onlyMethods()` には、クラスに存在するメソッドしか指定できません。まだ存在しないメソッドには
`addMethods()` を使います。`CakeTestCase` の `getMockForModel()` はこれまでどおり使えます。

`staticExpects()` は削除され、`at()` は非推奨になりました。呼び出しの順序に依存しない書き方をしてください。

## アサーション

いくつかのアサーションが削除または名前変更されました。

| PHPUnit 3.7 | PHPUnit 9.6 |
|-------------|-------------|
| `assertInternalType('array', $x)` | `assertIsArray($x)`（`assertIsString()`、`assertIsInt()`、`assertIsBool()` なども） |
| `assertContains('needle', $string)` | `assertStringContainsString('needle', $string)` または `assertTextContains()` |
| `assertNotContains('needle', $string)` | `assertStringNotContainsString('needle', $string)` または `assertTextNotContains()` |
| `assertRegExp()` / `assertNotRegExp()` | `assertMatchesRegularExpression()` / `assertDoesNotMatchRegularExpression()` |
| `assertEquals($expected, $actual, '', $delta)` | `assertEqualsWithDelta($expected, $actual, $delta)` |
| `assertEquals(..., $canonicalize = true)` | `assertEqualsCanonicalizing()` |
| `assertAttributeEquals()` などの `assertAttribute*()` | protected なプロパティではなく公開 API をテストする |
| `assertFileNotExists()` | `assertFileDoesNotExist()` |

`assertContains()` と `assertNotContains()` は、配列や反復可能なオブジェクトに対しては引き続き使えます。

`CakeTestCase` の SimpleTest 互換のメソッド（`assertEqual()`、`assertIdentical()`、`assertPattern()`、
`assertIsA()` など）は残っていますが、非推奨です。新しいテストでは PHPUnit 標準のアサーションを使ってください。

## テストファイルの場所

モダンなディレクトリ構成では、テストケースは `tests/TestCase/`、フィクスチャは `tests/Fixture/` に置きます。
詳しくは [テスト](/ja/development/testing) を、`app/Test/` からテストを移す場合は
[モダン構成への移行](/ja/appendices/migrating-to-the-modern-layout) を参照してください。
