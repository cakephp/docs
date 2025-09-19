# HtmlHelper

`class` **HtmlHelper**(View $view, array $settings = array())

CakePHP における HtmlHelper の役割は、 HTML に関連するオプションを
より簡単、高速に作成し、より弾力的なものに変えることです。
このヘルパーを使うことで、アプリケーションの足どりはより軽くなり、
そしてドメインのルートが置かれている場所に関して、よりフレキシブル
なものになるでしょう。

HtmlHelper にある多くのメソッドは `$options` という
引数を持っています。これにより、いかなる追加属性もタグに
付け加えることができます。これは `$options` を使う
方法についての簡単な例です。

``` html
付けられる属性: <tag class="someClass" />
配列での指定: array('class' => 'someClass')

付けられる属性: <tag name="foo" value="bar" />
配列での指定:  array('name' => 'foo', 'value' => 'bar')
```

> [!NOTE]
> HtmlHelpler は既定ではすべてのビューで使うことができます。
> このヘルパーが存在しないという旨のエラーが発生したとき、
> たいていの原因はコントローラーで変数 `$helpers` を手動で
> 設定した際、名前を書き忘れたことです。

## Well-Formatted な要素の挿入

HtmlHelper の果たすもっとも重要なタスクは、適切に定義された
マークアップの生成です。 CakePHP はレンダリングと送信にかかる
CPU のサイクルを減らすために、ビューをキャッシュすることが
できます。この節では、いくつかの HtmlHelper のメソッドと、
その使用方法について説明します。

`method` HtmlHelper::**charset**($charset=null)

`method` HtmlHelper::**css**(mixed $path, array $options = array())

`method` HtmlHelper::**meta**(string $type, string $url = null, array $options = array())

`method` HtmlHelper::**docType**(string $type = 'xhtml-strict')

`method` HtmlHelper::**style**(array $data, boolean $oneline = true)

`method` HtmlHelper::**image**(string $path, array $options = array())

`method` HtmlHelper::**link**(string $title, mixed $url = null, array $options = array())

`method` HtmlHelper::**media**(string|array $path, array $options)

`method` HtmlHelper::**tag**(string $tag, string $text, array $options)

`method` HtmlHelper::**div**(string $class, string $text, array $options)

`method` HtmlHelper::** para(string $class, string $text, array $options)**()

`method` HtmlHelper::**script**(mixed $url, mixed $options)

`method` HtmlHelper::** scriptBlock($code, $options = array())**()

`method` HtmlHelper::**scriptStart**($options = array())

`method` HtmlHelper::**scriptEnd**()

`method` HtmlHelper::**nestedList**(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

`method` HtmlHelper::**tableHeaders**(array $names, array $trOptions = null, array $thOptions = null)

`method` HtmlHelper::**tableCells**(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

`method` HtmlHelper::**url**(mixed $url = NULL, boolean $full = false)

`method` HtmlHelper::**useTag**(string $tag)

## HtmlHelper が出力するタグの変更

`method` HtmlHelper::**loadConfig**(mixed $configFile, string $path = null)

## HtmlHelper を使ったパンくずリストの作成

`method` HtmlHelper::**getCrumbs**(string $separator = '&raquo;', string|array|bool $startText = false)

`method` HtmlHelper::**addCrumb**(string $name, string $link = null, mixed $options = null)

`method` HtmlHelper::**getCrumbList**(array $options = array(), mixed $startText)
