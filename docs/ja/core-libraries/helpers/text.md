# TextHelper

`class` **TextHelper**(View $view, array $settings = array())

TextHelper は、ビューの中でテキストを作成する際に便利で使いやすいメソッドが
含まれています。リンクの有効化、URL のフォーマット、選ばれた言葉やフレーズの
周りのテキストの抜粋の作成、テキストのブロック内のキーワードのハイライト、
テキストの余分な部分の削除を手伝います。

::: info Changed in version 2.1
`TextHelper` のいくつかのメソッドは、 `View` レイヤーの外でも使用できるように `String` クラスに移動しました。ビューの中でこれらのメソッドは TextHelper クラスを経由してアクセス可能です。普通のヘルパーメソッドを呼ぶのと同様に `$this->Text->method($args);` のように利用できます。
:::

`method` TextHelper::**autoLinkEmails**(string $text, array $options=array())

`method` TextHelper::**autoLinkUrls**(string $text, array $options=array())

`method` TextHelper::**autoLink**(string $text, array $options=array())

`method` TextHelper::**autoParagraph**(string $text)

<!--@include: ../../core-utility-libraries/string.md{111,127}-->
