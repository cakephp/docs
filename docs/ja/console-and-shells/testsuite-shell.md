# テストシェル

一度書き始めた [テスト](../development/testing) はテストシェルで実行可能です。

``` bash
bin/cake test app AllTests
```

テストシェルは PHPUnit 9.6 を使います。PHPUnit は Composer で開発用の依存パッケージとして
インストールします (`composer require --dev phpunit/phpunit:^9.6`)。pieceofcake2/app
スケルトンにはあらかじめ含まれています。`vendor/bin/phpunit` でテストを実行することもできます。

テストシェルの基本的な使用方法については、
[Run Tests From Command Line](../development/testing#run-tests-from-command-line) をご覧ください。

::: info Changed in version 2.1
この `test` シェルはバージョン2.1より追加されました。バージョン2.0であった `testsuite` も利用可能ではありますが、やはり新しい構文が望ましいでしょう。
:::
