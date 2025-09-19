# PHPUnitへの移行のヒント

テストケースの [PHPUnit 3.7](https://www.phpunit.de/manual/current/ja/) への移行は、うまくいけばかなり苦痛の無い遷移となります。
しかしながら、PHPUnitと [SimpleTest](https://www.simpletest.org/) の間では、いくつかの既知の違いがあります。

## SimpleTestとの違い

SimpleTestとPHPUnitの間には数多くの違いがあります。
以下は一番頻繁に遭遇する相違点を挙げる試みとなります。

### startCase()とendCase()

これらのメソッドはサポートされなくなりました。
PHPUnitが提供する静的なメソッドを使用してください:
`setupBeforeClass` と `tearDownAfterClass` 。

### start()、end()、before()、after()

これらのメソッドはSimpleTestのテストケース初期化の一部です。
`start()` と `end()` は置き換える必要がありません。
`setUp()` と `tearDown()` を用いて、 `before()` と `after()` を置き換えることができます。

### setUp() と tearDown()

以前は `setUp` 、 `tearDown` 、 `startTest` 、 `endTest` がサポートされており、ほとんど同じものように見えるのに、場合によってはどちらか一方を使う必要があるなど、混乱を生じていました。

新しいCakePHPのテストスイートでは、 `setUp` と `tearDown` のみを使うことが推奨されています。
startTest と endTestメソッドはまだサポートしていますが、非推奨になりました。

### getTests

`getTests` メソッドはサポートされなくなりました。
変わりにフィルタを使うことができます。
WEBテストランナーは基本的な正規表現を指定することが出来るクエリ文字列引数を新しくとるようになりました。
この正規表現は実行するメソッドを制限するために使われます:

    例 filter=myMethod

`myMethod` 文字列を含むテストのみが次のリフレッシュ時実行されます。
また、cakeのテストシェルは、メソッドをフィルタするのに -filter オプションをサポートします。

### アサート(*Assertion*)メソッド

多くのアサートメソッドはPHPUnitとSimpleTestの間で僅かに名前が異なります。
出来る限り、 `CakeTestCase` はSimpleTestのメソッド名へのラッパーを提供しています。
これらの互換性ラッパーは2.1.0で削除されます。
以下のメソッドに影響があります。

- `assertEqual` -\> `assertEquals`
- `assertNotEqual` -\> `assertNotEquals`
- `assertPattern` -\> `assertRegExp`
- `assertIdentical` -\> `assertSame`
- `assertNotIdentical` -\> `assertNotSame`
- `assertNoPattern` -\> `assertNotRegExp`
- `assertNoErrors` -\> no replacement
- `expectError` -\> `setExpectedException`
- `expectException` -\> `setExpectedException`
- `assertReference` -\> `assertSame`
- `assertIsA` -\> `assertType`

いくつかのメソッドは引数の取り方の順番が違います。
これらを書き換えるときに必ず使用するメソッドをチェックしてください。

### モックのエクスペクテーション

モックオブジェクトはPHPUnitとSimpleTestの間で劇的に違います。
この間の互換性のあるラッパーは存在しません。
モックオブジェクトの使用方法を書き換えることは辛い作業になることがありますが、移行の際にきっと次のTIPSが助けになるでしょう。
[PHPUnit モックオブジェクト](https://www.phpunit.de/manual/current/ja/test-doubles.html#test-doubles.mock-objects)
ドキュメントを用いて、自分自身で身につけることを高く推奨します。

#### メソッドの呼び出しの置換

以下の正規表現は複雑でないモックオブジェクトのエクスペクテーションを書き直すのに役立つでしょう。

##### 引数のないexpectOnce()の置換

``` php
expectOnce\(([^\)]+)\);
expects(\$this->once())->method($1);
```

##### 引数つきのexpectOnce()の置換

``` php
expectOnce\(([^,]+), array\((.+)\)\);
expects(\$this->once())->method($1)->with($2);
```

##### expectAt()の置換

``` php
expectAt\((\d+), (.+), array\((.+)\)\);
expects(\$this->at($1))->method($2)->with($3);
```

##### expectNeverの置換

``` php
expectNever\(([^\)]+)\);
expects(\$this->never())->method($1);
```

##### setReturnValueの置換

``` php
setReturnValue\(([^,]+), (.+)\);
expects(\$this->once())->method($1)->will($this->returnValue($2));
```

##### setReturnValueAtの置換

``` php
setReturnValueAt((\d+), ([^,]+), (.+));
expects(\$this->at($1))->method($2)->will($this->returnValue($3));
```

### グループテスト

PHPUnitが個々のテストケースとテストスイートをテストランナーで構成可能な要素として扱うことから、グループテストは削除されました。
グループテストをテストケースディレクトリの中に置いて、 `PHPUnit_Framework_TestSuite` を基底クラスとして使うことが出来ます。
テストスイートの例は以下のようになります:

``` php
class AllJavascriptHelpersTest extends PHPUnit_Framework_TestSuite {

/**
 * このスイートのためのテストの定義を組み立て
 *
 * @return void
 */
    public static function suite() {
        $suite = new PHPUnit_Framework_TestSuite('Js Helper and all Engine Helpers');

        $helperTestPath = CORE_TEST_CASES . DS . 'View' . DS . 'Helper' . DS;
        $suite->addTestFile($helperTestPath . 'JsHelperTest.php');
        $suite->addTestFile($helperTestPath . 'JqueryEngineHelperTest.php');
        $suite->addTestFile($helperTestPath . 'MootoolsEngineHelperTest.php');
        $suite->addTestFile($helperTestPath . 'PrototypeEngineHelperTest.php');
        return $suite;
    }
}
```

`TestManger` はグループテストにテストを追加するメソッドを持つことももうありません。
PHPUnitが提供するメソッドを使うことをお勧めします。
