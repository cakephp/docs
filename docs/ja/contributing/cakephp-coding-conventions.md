# コーディング規約

CakePHP の開発者は以下のコーディング規約を使います。これは CakePHP 5 の CakePHP
コーディング規約 ([PSR-12](https://www.php-fig.org/psr/psr-12/) がベース) に、
名前空間を持たず CakePHP 2 の命名規約を使うコードのための除外をいくつか加えたものです。
このドキュメントのコード例もこの規約に従っています。

アプリケーションやプラグインの開発でも同じ規約に従うことが推奨されます。
フレームワークと同じ書き方のコードになり、将来 CakePHP 5 へ移行するときに
必要な整形の変更も少なくなります。

規約のチェックは
[PHP_CodeSniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer) と
[cakephp/cakephp-codesniffer](https://github.com/cakephp/cakephp-codesniffer)
5.x の `CakePHP` ルールセット、そしてプロジェクトの `phpcs.xml` で自動的に行います。
このページの説明と `phpcs` の結果が食い違う場合は `phpcs` の結果が正となります。
本家 CakePHP 2 の規約で書かれたコードをメンテナンスしている場合は、
[本家 CakePHP 2 の規約との違い](#differences-from-the-original-cakephp-2-standard)
を参照してください。

## コードのチェック

フレームワークと [pieceofcake2/app](https://github.com/pieceofcake2/app) アプリケーションスケルトンは、
CodeSniffer を開発用の依存パッケージとしてインストールします。
既存のアプリケーションに追加するには次のコマンドを実行します。

``` bash
composer require --dev cakephp/cakephp-codesniffer:^5.0
```

Composer は `dealerdirect/phpcodesniffer-composer-installer` プラグインを許可するか
確認してきます。このプラグインが CakePHP ルールセットを PHP_CodeSniffer に登録するので、
許可してください。`composer.json` に直接書いてもかまいません。

``` json
{
    "config": {
        "allow-plugins": {
            "dealerdirect/phpcodesniffer-composer-installer": true
        }
    }
}
```

次に、プロジェクトのルートに `phpcs.xml` を置きます
([アプリケーション用の phpcs.xml](#a-phpcs-xml-for-your-application) を参照)。
PHP_CodeSniffer はこのファイルを自動的に読み込むので、引数なしでチェックを実行できます。

``` bash
# 違反を表示する
vendor/bin/phpcs

# 自動で直せる違反を修正する
vendor/bin/phpcbf

# コードの一部だけをチェックする
vendor/bin/phpcs src/Controller
```

フレームワークにもスケルトンにも `cs-check` や `cs-fix` といった Composer スクリプトはありません。
`phpcs` と `phpcbf` を直接実行してください。フレームワークの CI はすべての Pull Request で
`vendor/bin/phpcs` を実行するので、変更を送る前に手元で実行しておきましょう。

空白、配列構文、中括弧の位置、引用符といった違反のほとんどは `phpcbf` で修正できます。
ドキュメントブロックの不足、メソッド名、未使用の変数などは手で直す必要があります。

## 言語

全てのコードやコメントは、英語で書かなければなりません。

## 新しい機能の追加

新しい機能は、そのテストが無い限り、追加してはいけません。
このテストはリポジトリにコミットされる前にパスする必要があります。
バグ修正も同様で、修正前には失敗するテストを追加してください。

## インデントと空白

インデントには 4 つのスペースを使います。タブは使えません。

``` php
$booleanVariable = true;
$stringVariable = '大鹿';
if ($booleanVariable) {
    echo '真偽値は true です';
    if ($stringVariable === '大鹿') {
        echo '大鹿に遭遇しました';
    }
}
```

ファイルの改行コードは LF とし、ファイルの末尾は改行 1 つで終え、行末に空白を残さないでください。
フレームワークとアプリケーションスケルトンにはこの設定を書いた `.editorconfig` が含まれており、
ほとんどのエディターはこれを読み込みます。

空行についても次のチェックがあります。

- 空行を 2 行以上続けないでください。
- クラスやメソッドの開き中括弧の直後と、閉じ中括弧の直前には空行を入れないでください。
- メソッドとメソッドの間は空行 1 行で区切ってください。
- `return` 文の前には空行を入れてください。ただし、ブロックの最初の文である場合は除きます。

## 行の長さ

行の長さはチェックしません。CakePHP 2 のコードには長い行が多いため、フレームワークの
`phpcs.xml` は `Generic.Files.LineLength` を除外しています。
それでも読みやすさには気を配ってください。新しく書くコードでは 120 文字程度が目安です。

## 配列

配列は短縮構文で書きます。複数行の配列は 1 行に 1 要素とし、最後の要素の後にもカンマを付けます。
1 行の配列では末尾のカンマは付けません。

``` php
$users = ['John', 'Hans', 'Arne'];

$options = [
    'conditions' => ['Article.published' => true],
    'order' => ['Article.created' => 'DESC'],
    'limit' => 20,
];
```

`list($a, $b) = $pair;` ではなく `[$a, $b] = $pair;` と書きます。

## 関数の呼び出し

関数を呼び出す際、関数名と開き括弧の間に空白を入れてはいけません。
カンマの後には空白を 1 つ入れ、代入の等号 (=) の両側にも空白を 1 つずつ入れます。

``` php
$var = foo($bar, $bar2, $bar3);
```

呼び出しが 1 行に収まらない場合は、引数を 1 行に 1 つずつ書きます。
開き括弧を最初の行の最後に置き、閉じ括弧は単独の行に置き、最後の引数の後にもカンマを付けます。

``` php
$matches = array_intersect_key(
    $this->_listeners,
    array_flip(
        preg_grep($matchPattern, array_keys($this->_listeners), 0),
    ),
);
```

次のようには書きません。

``` php
$matches = array_intersect_key($this->_listeners,
                array_flip(preg_grep($matchPattern,
                    array_keys($this->_listeners), 0)));
```

オブジェクトを生成するときは、引数がなくても必ず括弧を付けます。

``` php
$dispatcher = new Dispatcher();
```

## 制御構造

制御構造は例えば `if`、`for`、`foreach`、`while`、`switch` などです。
下記に、`if` の例を示します。

``` php
if (($expr1) || ($expr2)) {
    // 処理 1
} elseif (!($expr3) && ($expr4)) {
    // 処理 2
} else {
    // デフォルトの処理
}
```

- 制御構造では 1 個の空白が最初の丸括弧の前に、1 個の空白が最後の丸括弧と開き中括弧の間にある必要があります。
- 制御構造では、必要でなくとも常に中括弧を使います。
  これはコードの可読性を高め、論理エラーが発生しにくくなります。
- 開き中括弧は制御構造と同じ行に置かれる必要があります。閉じ中括弧は新しい行に置かれ、
  制御構造と同じレベルのインデントがされている必要があります。中括弧内に含まれているステートメントは
  新しい行で始まり、その中に含まれるコードは、新しいレベルのインデントが付けられる必要があります。
- `else if` ではなく `elseif` を使います。
- `and` や `or` ではなく `&&` と `||` を使います。
- `for` ループの条件式の中で `count()` などの関数を呼び出さないでください。
  結果をあらかじめ変数に代入しておきます。

``` php
// 間違い＝中括弧が無い、ステートメントの場所が悪い
if ($expr) statement();

// 間違い＝中括弧が無い
if ($expr)
    statement();

// よろしい
if ($expr) {
    statement();
}

// 間違い＝ループの条件式で count() を呼んでいる
for ($i = 0; $i < count($items); $i++) {
}

// よろしい
$count = count($items);
for ($i = 0; $i < $count; $i++) {
}
```

条件式の中での代入は認められており、CakePHP 2 のコードでもよく使われています。

``` php
while ($row = $result->fetch()) {
    // ...
}
```

ただし、このような単純な場合に留めてください。比較と見間違えるおそれがある場合は、
代入を別の行に分けて書きます。

### 三項演算子

三項演算子は、三項演算子全体が 1 行に収まる場合に許容されます。
長い三項演算子は `if`/`else` ステートメントに分割するべきです。
どのような場合でも、三項演算子はネストしてはいけません。

値がセットされているかを確認するときは null 合体演算子を、別の値で代替するときは
短縮形の三項演算子を使います。長い形は CodeSniffer がエラーとして報告します。

``` php
// よろしい
$variable = $options['variable'] ?? true;
$title = $title ?: 'Untitled';

// CodeSniffer がエラーを報告する
$variable = isset($options['variable']) ? $options['variable'] : true;
$title = $title ? $title : 'Untitled';

// ネストされた三項はダメ
$variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;
```

### テンプレートファイル

テンプレートファイル (`templates/` 内の拡張子が .ctp のファイル) では、
制御構造に代替構文を使ってください。PHP と HTML が混在するテンプレートが読みやすくなります。
制御構造は、大きい PHP ブロック内、または別々の PHP タグに含めることができます。

``` php
<?php
if ($isAdmin):
    echo '<p>You are the admin user.</p>';
endif;
?>
<p>The following is also acceptable:</p>
<?php if ($isAdmin): ?>
    <p>You are the admin user.</p>
<?php endif; ?>
```

.ctp ファイルの最後に PHP の閉じタグ (`?>`) を置くことは認められています。
アプリケーションスケルトンの `phpcs.xml` は `templates/` をチェックしないので、
テンプレートではこれらのルールは強制されません。

## 比較

常にできるだけ厳密に比較してください。意図的に厳密でない比較をする場合は、
誤りと思われないようにコメントを書いておくとよいでしょう。

変数が null かどうかを調べるには、厳密な比較を使います。

``` php
if ($value === null) {
    // ...
}
```

比較の対象となる値は右側に置きます。いわゆる「ヨーダ記法」の比較は CodeSniffer が報告します。

``` php
// 認められない
if (null === $this->foo()) {
    // ...
}

// よろしい
if ($this->foo() === null) {
    // ...
}
```

## クラスとメソッドの定義

クラスとメソッドの開き中括弧は次の行に置きます。すべてのプロパティ、メソッド、
クラス定数でアクセス権を宣言し、`var` キーワードは使いません。

``` php
class Article extends AppModel
{
    /**
     * Number of articles on a page.
     *
     * @var int
     */
    public const PER_PAGE = 20;

    /**
     * Default find options.
     *
     * @var array
     */
    protected $_defaults = [];

    /**
     * Connects to the given data source.
     *
     * @param array|string $dns Connection settings or a DSN string.
     * @param bool $persistent Whether to use a persistent connection.
     * @return bool
     */
    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!$dnsInfo || !$dnsInfo['phpType']) {
            return $this->addError();
        }

        return true;
    }
}
```

デフォルト値を持った引数は、関数定義の最後に置く必要があります。
関数は何かを、少なくとも `true` か `false` を返すようにしてください。
そうすれば、関数の呼び出しが成功したかどうかを判断できます。

クロージャーとアロー関数も同じルールに従います。アロー関数は `fn` の後に空白を入れずに書きます。

``` php
$callback = function ($item) use ($prefix) {
    return $prefix . $item;
};
$ids = array_map(fn($row) => $row['Article']['id'], $rows);
```

### 型宣言

CakePHP 2 の API は引数、プロパティ、戻り値のネイティブな型宣言を使っていないので、
型宣言は必須ではありません。フレームワークの `phpcs.xml` は CakePHP 5 の規約の型宣言に関する
ルールを除外しており、`declare(strict_types=1)` も必要ありません。
型はドキュメントブロックに書いてください。

アプリケーション用の `phpcs.xml` が除外しているのは、引数とプロパティの型に関するルールだけです。
そのため、メソッドにはネイティブの戻り値の型か `@return` アノテーションのどちらかが必要です。
また `tests/TestCase/` 内のテストメソッドにはネイティブの戻り値の型が必要です。
`setUp(): void` のようなメソッドは、いずれにしても PHPUnit 9 で必要になります。

オブジェクトや配列を受け取る引数には、これまでどおりタイプヒントを付けられます。

``` php
/**
 * Some method description.
 *
 * @param Model $Model The model to use.
 * @param array $array Some array value.
 * @param bool $boolean Some boolean value.
 * @return void
 */
public function foo(Model $Model, array $array, $boolean)
{
}
```

ここでは `$Model` は `Model` のインスタンスで、`$array` は `array` でなければなりません。

`$array` に `ArrayObject` のインスタンスも受け付けるようにしたい場合は、
`array` は配列型しか受け付けないので、タイプヒントを付けないでください。

``` php
/**
 * Some method description.
 *
 * @param ArrayObject|array $array Some array value.
 * @return void
 */
public function foo($array)
{
}
```

フレームワークのメソッドをオーバーライドするときは、シグネチャを変えないでください。
親メソッドに型宣言がないのにオーバーライドするメソッドに型宣言を追加すると、
致命的エラーになります。

## メソッドチェーン

メソッドチェーンは複数の行にまたがるように書き、4 スペースでインデントします。

``` php
$email->from('foo@example.com')
    ->to('bar@example.com')
    ->subject('A great message')
    ->send();
```

## ドキュメントブロック

テストケースを除き、すべてのメソッドと関数にドキュメントブロックが必要です。
ファイルの最初のブロックを除き、すべてのコメントブロックの前には改行を入れてください。

ドキュメントブロックの中では、説明とタグの間に空行を 1 行入れ、タグ同士の間には空行を入れません。
プロパティのドキュメントブロックは複数行の形式で書く必要があり、
`/** @var string */` のような 1 行のコメントはエラーになります。

### ファイルヘッダーのドキュメントブロック

フレームワークのファイルは、次のようなファイルヘッダーのドキュメントブロックで始まります。

``` php
<?php
/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @since         X.Y.Z
 * @license       https://www.opensource.org/licenses/mit-license.php MIT License
 */
```

含まれている [phpDocumentor](https://phpdoc.org) のタグは次のとおりです。

- [@copyright](https://docs.phpdoc.org/guide/references/phpdoc/tags/copyright.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@license](https://docs.phpdoc.org/guide/references/phpdoc/tags/license.html)

### クラスのドキュメントブロック

クラスのドキュメントブロックは次のようになります。

``` php
/**
 * Short description of the class.
 *
 * Long description of class.
 * Can use multiple lines.
 *
 * @property Comment $Comment
 * @deprecated 2.12.0 Use Bar instead.
 * @see Bar
 * @link https://pieceofcake2.github.io/docs/foo
 */
class Foo
{
}
```

クラスのドキュメントブロックには、次の [phpDocumentor](https://phpdoc.org) のタグを
含めることができます。

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  `@deprecated <version> <description>` の形式で書きます。`version` と `description` は必須です。
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@property](https://docs.phpdoc.org/guide/references/phpdoc/tags/property.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@uses](https://docs.phpdoc.org/guide/references/phpdoc/tags/uses.html)

CakePHP 2 では、実行時にクラスに読み込まれるモデル、コンポーネント、ヘルパーを
`@property` で書いておくと、IDE や静的解析ツールがそれらを認識できるようになります。

### プロパティのドキュメントブロック

プロパティのドキュメントブロックは次のようになります。

``` php
/**
 * Description of property.
 *
 * @var string|null
 * @deprecated 2.12.0 Use $_bla instead.
 * @see Bar::$_bla
 */
protected $_bar = null;
```

プロパティのドキュメントブロックには、次の [phpDocumentor](https://phpdoc.org) のタグを
含めることができます。

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  `@deprecated <version> <description>` の形式で書きます。`version` と `description` は必須です。
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@var](https://docs.phpdoc.org/guide/references/phpdoc/tags/var.html)

### メソッド/関数のドキュメントブロック

メソッドや関数のドキュメントブロックは次のようになります。

``` php
/**
 * Short description of the method.
 *
 * Long description of method.
 * Can use multiple lines.
 *
 * @param string $param1 First parameter.
 * @param array|null $param2 Second parameter.
 * @return array An array of cakes.
 * @throws Exception If something goes wrong.
 * @link https://pieceofcake2.github.io/docs/foo#bar
 * @deprecated 2.12.0 Use Bar::baz instead.
 * @see Bar::baz
 */
public function bar($param1, $param2 = null)
{
}
```

メソッドや関数のドキュメントブロックには、次の [phpDocumentor](https://phpdoc.org) のタグを
含めることができます。

- [@deprecated](https://docs.phpdoc.org/guide/references/phpdoc/tags/deprecated.html)
  `@deprecated <version> <description>` の形式で書きます。`version` と `description` は必須です。
- [@internal](https://docs.phpdoc.org/guide/references/phpdoc/tags/internal.html)
- [@link](https://docs.phpdoc.org/guide/references/phpdoc/tags/link.html)
- [@param](https://docs.phpdoc.org/guide/references/phpdoc/tags/param.html)
- [@return](https://docs.phpdoc.org/guide/references/phpdoc/tags/return.html)
- [@throws](https://docs.phpdoc.org/guide/references/phpdoc/tags/throws.html)
- [@see](https://docs.phpdoc.org/guide/references/phpdoc/tags/see.html)
- [@since](https://docs.phpdoc.org/guide/references/phpdoc/tags/since.html)
- [@uses](https://docs.phpdoc.org/guide/references/phpdoc/tags/uses.html)

親メソッドをオーバーライドするだけでドキュメントを変えない場合は、
ドキュメントブロックの内容を `@inheritDoc` (中括弧なし) だけにできます。

### 変数の型

ドキュメントブロックで使う変数の型は次のとおりです。

| 型       | 説明 |
|----------|------|
| mixed    | 型が未定義 (または複数) の変数。 |
| int      | 整数型の変数 (整数)。 |
| float    | 浮動小数点型 (小数)。 |
| bool     | 論理型 (true または false)。 |
| string   | 文字列型 (`" "` や `' '` で囲まれた値)。 |
| null     | null 型。通常は他の型と組み合わせて使います。 |
| array    | 配列型。 |
| object   | オブジェクト型。可能であれば具体的なクラス名を使ってください。 |
| resource | リソース型 (例えば `fopen()` が返すもの)。 |
| callable | コール可能な関数。 |

`integer` や `boolean` ではなく、短い型名 (`int`、`bool`) を使います。
型を mixed と指定する場合は、型が不明なのか、どんな型を取り得るのかを書いておいてください。

パイプ文字で型を組み合わせることもできます。`null` は最後に書きます。

    int|bool
    string|null

型が 3 つ以上になる場合は、通常は `mixed` を使うのが最善です。

メソッドチェーンなどのためにオブジェクト自身を返す場合は、`$this` を使います。

``` php
/**
 * Foo function.
 *
 * @return $this
 */
public function foo()
{
    return $this;
}
```

## 文字列

変数やエスケープシーケンスを含まない文字列にはシングルクォートを使います。
ダブルクォートは、変数の展開やエスケープシーケンスが必要な場合にだけ使います。

``` php
$name = 'Article';
$message = "Saved {$count} articles\n";
```

## ファイルの読み込み

`include`、`require`、`include_once`、`require_once` には丸括弧を付けません。

``` php
// 間違い＝丸括弧あり
require_once('ClassFileName.php');
require_once ($class);

// よろしい＝丸括弧なし
require_once 'ClassFileName.php';
require_once $class;
```

ほとんどの場合、クラスのファイルを読み込む必要はありません。クラスは Composer の
オートローダーで読み込まれ、プラグインのクラスなどオートローダーが知らないクラスは
`App::uses()` で読み込みます。クラスやライブラリを含むファイルを読み込む場合は、
常に `require_once` を使ってください。

## PHP タグ

短いタグ (`<? ?>`) ではなく、常に長いタグ (`<?php`) を使ってください。
テンプレートでは短縮 echo タグ `<?=` を使ってもかまいません。

## エラー抑制

エラー抑制演算子 `@` は避けてください。CodeSniffer は警告として報告します。
代わりにエラーになる条件を事前に確認するか、エラーを処理してください。

## 命名規約

### 関数

すべての関数はキャメルバックで書きます。

``` php
function longFunctionName()
{
}
```

### クラス

クラス名はキャメルケースで書きます。例:

``` php
class ExampleClass
{
}
```

### 変数

変数名はできる限り説明的に、しかしできる限り短くもしてください。通常の変数は小文字で始まり、
複数の単語の場合はキャメルバックで書く必要があります。オブジェクトを参照する変数は、
何らかの方法で変数がオブジェクトとなっているクラスに関連したものになるべきです。
CakePHP 2 では、モデルのインスタンスを `$Model` とするように、クラス名と同じ名前の変数も使います。
CodeSniffer はこのような変数名を認めています。

``` php
$user = 'John';
$users = ['John', 'Hans', 'Arne'];

$dispatcher = new Dispatcher();
$Model = ClassRegistry::init('Article');
```

### メンバーのアクセス権

メソッドと変数には PHP の `private` と `protected` キーワードを使ってください。
加えて、protected なメソッドまたは変数の名前は単一のアンダースコア (`_`) から始まります。
public なメソッドの名前をアンダースコアで始めてはいけません。例:

``` php
class A
{
    protected $_iAmAProtectedVariable;

    protected function _iAmAProtectedMethod()
    {
        /* ... */
    }
}
```

private なメソッドまたは変数の名前は二つのアンダースコア (`__`) から始まります。例:

``` php
class A
{
    private $__iAmAPrivateVariable;

    private function __iAmAPrivateMethod()
    {
        /* ... */
    }
}
```

private なメソッドや変数はなるべく避け、protected を使うようにしてください。
protected はサブクラスからアクセスや変更ができますが、private では拡張や再利用ができません。
private は、テストもずっと難しくします。

`admin_index()` のようにルーティングのプレフィックスが付いたコントローラーのアクションは
キャメルバックではありません。フレームワークとアプリケーションスケルトンの `phpcs.xml` は、
コントローラーではこのような名前を認めています。

### アドレスの例示

全ての URL とメールアドレスの例には、"example.com"、"example.org"、
"example.net" を使用してください。例:

- Eメール: <someone@example.com>
- WWW: `https://www.example.com`
- FTP: `ftp://ftp.example.com`

"example.com" ドメインはこのために予約されており
([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606) を参照)、
ドキュメント内の説明や例として使うことが推奨されています。

### ファイル

クラスを含まないファイルの名前は、小文字でアンダースコア区切りにします。例:

    long_file_name.php

### キャスト

次のキャストを使用します。

| 型       | 説明 |
|----------|------|
| (bool)   | boolean にキャスト。 |
| (int)    | integer にキャスト。 |
| (float)  | float にキャスト。 |
| (string) | string にキャスト。 |
| (array)  | array にキャスト。 |
| (object) | object にキャスト。 |

キャストと値の間には空白を入れず、短い形を使います。`(integer) $var` ではなく
`(int)$var` と書きます。できれば、`intval($var)` の代わりに `(int)$var`、
`floatval($var)` の代わりに `(float)$var` を使用してください。

### 定数

定数は大文字で定義する必要があります。

``` php
define('CONSTANT', 1);
```

もし定数の名前が複数の単語でできている場合は、アンダースコア文字によって分割する必要があります。
例:

``` php
define('LONG_NAMED_CONSTANT', 2);
```

クラス定数にはアクセス権を宣言する必要があります。

``` php
class Article extends AppModel
{
    public const STATUS_PUBLISHED = 1;
}
```

## その他のルール

CakePHP ルールセットには、このページに挙げきれないほど多くのチェックがあります。
CakePHP 2 のコードでよく引っかかるものには次のようなものがあります。

- `sizeof()` は報告されます。`count()` を使ってください。
- 使われていないローカル変数や、重複した代入は報告されます。
- 1 つの変数を囲む括弧のような、不要な括弧は報告されます。
- 非推奨の PHP 関数は報告されます。

`vendor/bin/phpcs -s` を実行すると、違反を報告したスニフの名前が表示されます。
スニフの内容は
[CakePHP ルールセット](https://github.com/cakephp/cakephp-codesniffer/blob/5.x/CakePHP/ruleset.xml)
で確認できます。

<a id="the-exclusions-used-for-cakephp-2"></a>

## CakePHP 2 のための除外ルール

CakePHP 5 の規約は、名前空間とネイティブの型宣言を使うコードを前提にしています。
そのためフレームワークの
[`phpcs.xml`](https://github.com/pieceofcake2/cakephp/blob/2.x/phpcs.xml)
は次のルールを除外しています。

| ルール | 理由 |
|--------|------|
| `PSR1.Classes.ClassDeclaration.MissingNamespace`、`PSR1.Files.SideEffects.FoundWithSymbols`、`Squiz.Classes.ClassFileName.NoMatch` | クラスはグローバル名前空間にあり、`App::uses()` で読み込まれることがあります。PSR-1 はこれを副作用とみなします。ファイル名は CakePHP 2 の規約に従います。 |
| `SlevomatCodingStandard.Namespaces.ReferenceUsedNamesOnly.ReferenceViaFullyQualifiedNameWithoutNamespace`、`SlevomatCodingStandard.Namespaces.FullyQualifiedClassNameInAnnotation.NonFullyQualifiedClassName` | 名前空間がないので、`use` 文やアノテーション内の完全修飾名は不要です。 |
| `SlevomatCodingStandard.TypeHints` | CakePHP 2 の API はネイティブの型宣言を使いません。 |
| `Zend.NamingConventions.ValidVariableName.StringVarNotCamelCaps`、`Zend.NamingConventions.ValidVariableName.PublicHasUnderscore`、`Zend.NamingConventions.ValidVariableName.PublicVarHasUnderscore` | CakePHP 2 は `$Model` や `$_locale` のような名前や、アンダースコアで始まる public プロパティを使います。 |
| `SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition` | `while ($row = $result->fetch())` は CakePHP 2 でよく使われる書き方です。 |
| `CakePHP.Commenting.FunctionComment.SpacingAfter`、`Generic.Files.LineLength` | ドキュメントブロックの後の空行を認め、行の長さはチェックしません。 |

さらに `Generic.Formatting.MultipleStatementAlignment` を `maxPadding` 1 で追加しているので、
連続する代入の `=` を揃えるために余分な空白を入れることはできません。
また、一部のルールは特定のパスでだけ緩めています。たとえばコントローラーとシェルでは
(`admin_index()` のようなプレフィックス付きアクションのために) キャメルバックでない
メソッド名を、テストでは 1 ファイルに複数のクラスを置くことやドキュメントブロックの省略を、
`database.php` では `DATABASE_CONFIG` というクラス名を認めています。

<a id="a-phpcs-xml-for-your-application"></a>

## アプリケーション用の phpcs.xml

[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンには、
モダンなディレクトリ構成用の次の `phpcs.xml` が含まれています。
フレームワークと同じ除外ルールを使いますが、型宣言については引数とプロパティのルールだけを除外し、
`tests/TestCase/` ではネイティブの戻り値の型を必須にしています。

``` xml
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

アプリケーションが従来の `app/` 構成の場合は、`<file>` とパターンを従来のパスに変更してください。
たとえば `./config`、`./src`、`./tests` の代わりに `./app/Config`、`./app/Controller`、
`./app/Model`、`./app/Test` を、`src/Controller/*` と `tests/TestCase/*` の代わりに
`app/Controller/*` と `app/Test/Case/*` を指定します。

既存のアプリケーションにこの規約を導入するときは、まず `phpcbf` を一度実行し、
その結果を他の変更とは別にコミットしてから、残りの違反を少しずつ直していくとよいでしょう。
`phpcs` にパスを渡せば、ディレクトリごとにチェックできます。

<a id="differences-from-the-original-cakephp-2-standard"></a>

## 本家 CakePHP 2 の規約との違い

本家 CakePHP 2 の規約で書かれたコードをメンテナンスしている場合、
特に目につくのは次の違いです。

| 本家 CakePHP 2 の規約 | 現在の規約 |
|-----------------------|------------|
| タブ 1 つでインデント | 4 スペースでインデント |
| `array()` | `[]` |
| クラスとメソッドの開き中括弧は同じ行 | クラスとメソッドの開き中括弧は次の行 |
| 末尾のカンマなし | 複数行の配列、呼び出し、宣言では末尾にカンマ |
| 100 文字を推奨、120 文字が上限 | 行の長さはチェックしない |
| 条件式内の代入は禁止 | 条件式内の代入を認める |
| `isset($a) ? $a : $b` | `$a ?? $b` |
| `$a ? $a : $b` | `$a ?: $b` |
| `else if` は非推奨 | `else if` は不可、`elseif` を使う |
| クラス定数のアクセス権は任意 | 定数、プロパティ、メソッドすべてでアクセス権が必須 |
| プロパティに `/** @var string */` を書ける | プロパティのドキュメントブロックは複数行 |
