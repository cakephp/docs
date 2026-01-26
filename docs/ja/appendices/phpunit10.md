# PHPUnit 10 へのアップグレード

CakePHP 5 では、PHPUnit の最低バージョンが `^8.5 || ^9.3` から `^10.1` に変更されました。 この文書は、PHPUnit や CakePHP 由来の、いくつかの破壊的変更を紹介するものです。

## phpunit.xml の調整

PHPUnitの設定ファイルを、以下のコマンドで更新することが推奨されます:

    vendor/bin/phpunit --migrate-configuration

> [!NOTE]
> 上記のコマンドを実行する前に、 `vendor/bin/phpunit --version` を実行して PHPUnit 10 が実行されていることを確認して下さい。

このコマンド（訳注 : `vendor/bin/phpunit --migrate-configuration` のこと）を実行することによって、お手元のプロジェクトの `phpunit.xml` ファイルには推奨される変更が適用された状態になります。

### 新しいイベントシステム

PHPUnit 10 は、古い hook の仕組みを削除した上で、新しい [イベントシステム](https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner) が導入されました。
ここでは、以下に示すような `phpunit.xml` は…:

``` php
<extensions>
  <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
</extensions>
```

次のように調整されます:

``` php
<extensions>
  <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
</extensions>
```

## `->withConsecutive()` の削除

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

`Cake\TestSuite\TestCase` クラスには、 `Cake\TestSuite\PHPUnitConsecutiveTrait` 経由で、静的メソッド `self::withConsecutive()` が追加されました。なので、Testcase のクラスに手動で trait を仕込む必要はありません。

## data provider は static に

お手元のプロジェクトのテストケースにおいて、PHPUnitの data provider 機能を活用している場合、それを static にする必要があります。例えば以下のコードは:

``` php
public function myProvider(): array
```

次のように置き換えて下さい:

``` text
public static function myProvider(): array
```
