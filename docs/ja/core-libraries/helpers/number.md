# NumberHelper

`class` **NumberHelper**(View $view, array $settings = array())

NumberHelper は、ビューの中で一般的な書式で数値を表示するための
便利なメソッドを持っています。これらのメソッドは、通貨、パーセンテージ、データサイズ、
指定した精度に整えられた数値へのフォーマットや、他にもより柔軟に数値のフォーマットを行います。

::: info Changed in version 2.1
`NumberHelper` は、 `View` レイヤーの外でも簡単に使えるように `CakeNumber` クラスにリファクタリングされました。ビューの中で、これらのメソッドは `NumberHelper` クラスを経由して アクセス可能です。通常のヘルパーメソッドを呼ぶように呼び出せます: `$this->Number->method($args);` 。
:::

<!--@include: ../../core-utility-libraries/number.md{29,50}-->

> [!WARNING]
> 2.4 から、シンボルは UTF-8 になりました。もし、非 UTF-8 アプリを実行する場合、
> 詳しくは移行ガイドをご覧ください。
