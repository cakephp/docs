# Inflector

`class` **Inflector**

Inflector は文字列の複数形やキャメルケースへの変換を取り扱うクラスです。
Inflector のメソッドは通常では静的にアクセスします。
例: `Inflector::pluralize('example')` は "examples" を返します。

[inflector.cakephp.org](https://inflector.cakephp.org/)
にてオンライン上で変換を試すことができます。

## Inflector メソッドの概要と出力

Inflector の組み込みメソッドの簡単な概要と、複数単語の引数を指定したときに出力される結果:

<table style="width:72%;">
<colgroup>
<col style="width: 27%" />
<col style="width: 22%" />
<col style="width: 22%" />
</colgroup>
<thead>
<tr>
<th>メソッド</th>
<th>引数</th>
<th>出力</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2"><code>pluralize()</code></td>
<td>BigApple</td>
<td>BigApples</td>
</tr>
<tr>
<td>big_apple</td>
<td>big_apples</td>
</tr>
<tr>
<td rowspan="2"><code>singularize()</code></td>
<td>BigApples</td>
<td>BigApple</td>
</tr>
<tr>
<td>big_apples</td>
<td>big_apple</td>
</tr>
<tr>
<td rowspan="2"><code>camelize()</code></td>
<td>big_apples</td>
<td>BigApples</td>
</tr>
<tr>
<td>big apple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>underscore()</code></td>
<td>BigApples</td>
<td>big_apples</td>
</tr>
<tr>
<td>Big Apples</td>
<td>big apples</td>
</tr>
<tr>
<td rowspan="2"><code>humanize()</code></td>
<td>big_apples</td>
<td>Big Apples</td>
</tr>
<tr>
<td>bigApple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>classify()</code></td>
<td>big_apples</td>
<td>BigApple</td>
</tr>
<tr>
<td>big apple</td>
<td>BigApple</td>
</tr>
<tr>
<td rowspan="2"><code>dasherize()</code></td>
<td>BigApples</td>
<td>big-apples</td>
</tr>
<tr>
<td>big apple</td>
<td>big apple</td>
</tr>
<tr>
<td rowspan="2"><code>tableize()</code></td>
<td>BigApple</td>
<td>big_apples</td>
</tr>
<tr>
<td>Big Apple</td>
<td>big apples</td>
</tr>
<tr>
<td rowspan="2"><code>variable()</code></td>
<td>big_apple</td>
<td>bigApple</td>
</tr>
<tr>
<td>big apples</td>
<td>bigApples</td>
</tr>
<tr>
<td rowspan="2"><code>slug()</code></td>
<td>Big Apple</td>
<td>big-apple</td>
</tr>
<tr>
<td>BigApples</td>
<td>BigApples</td>
</tr>
</tbody>
</table>

## 複数形と単数形の作成

`static` Inflector::**singularize**($plural)

`static` Inflector::**pluralize**($singular)

`pluralize` や `singularize()` の両方は、多くの英語名詞に作用します。
もし、他の言語の対応が必要な場合、 使用するルールをカスタマイズするために
[Inflection Configuration](#inflection-configuration) を使用することができます。 :

``` php
// Apples
echo Inflector::pluralize('Apple');
```

> [!NOTE]
> `pluralize()` は、すでに複数形の名詞をいつも正しく変換できるわけではありません。

``` php
// Person
echo Inflector::singularize('People');
```

> [!NOTE]
> `singularize()` は、すでに単数形の名詞をいつも正しく変換できるわけではありません。

## キャメルケースやアンダースコアーの作成

`static` Inflector::**camelize**($underscored)

`static` Inflector::**underscore**($camelCase)

これらのメソッドは、クラス名やプロパティー名を作成する時便利です。 :

``` php
// ApplePie
Inflector::camelize('Apple_pie')

// apple_pie
Inflector::underscore('ApplePie');
```

underscore メソッドは、 キャメルケース形式の単語のみ変換することに注意してください。
スペースを含む単語は、小文字になりますが、アンダースコアーは含まれません。

## 人間が読みやすい形式の作成

`static` Inflector::**humanize**($underscored)

このメソッドは、アンダースコアー形式を人間が読みやすい値
「タイトルケース」形式に変換する時に便利です。 :

``` php
// Apple Pie
Inflector::humanize('apple_pie');
```

## テーブル名やクラス名の作成

`static` Inflector::**classify**($underscored)

`static` Inflector::**dasherize**($dashed)

`static` Inflector::**tableize**($camelCase)

コードの生成や CakePHP の規約を使用する時、テーブル名やクラス名に加工するために
必要になります。 :

``` php
// UserProfileSetting
Inflector::classify('user_profile_settings');

// user-profile-setting
Inflector::dasherize('UserProfileSetting');

// user_profile_settings
Inflector::tableize('UserProfileSetting');
```

## 変数名の作成

`static` Inflector::**variable**($underscored)

規約をもとにしたコード生成や仕事をするのに必要なメタプログログラミングの作業を行う時に、
変数名はしばしば役に立ちます。 :

``` php
// applePie
Inflector::variable('apple_pie');
```

## URL セーフな文字列

`static` Inflector::**slug**($word, $replacement = '_')

slug は特殊文字をラテン文字に変換したり、スペースをアンダースコアーに変換します。
slug は UTF-8 を前提とします。 :

``` php
// apple-puree
Inflector::slug('apple purée');
```

## Inflection の設定

CakePHP の命名規則は、本当に良くなります。あなたはデータベーステーブル `big_boxes` と
名付け、モデルを `BigBoxes` 、コントローラーを `BigBoxesController` 、
そして、すべては、ただ自動的に一緒に動作します。CakePHP は、
単数形と複数形の間で単語を加工することにより、お互いを紐付ける方法を知っています。

(特に英語を話さない友人にとって) CakePHP の inflector (複数形、単数形、
キャメルケース、アンダースコアーに変換するクラス) があなたの希望通りの動作をしないような、
状況に陥るかもしれません。もし、CakePHP に Foci や Fish を認識させたくない場合、
CakePHP に特別なケースを伝えることができます。

### カスタム Inflection のロード

`static` Inflector::**rules**($type, $rules, $reset = false)

Inflector で使用する新しい変換・翻訳の規則を定義します。しばしば、
このメソッドは、 **config/bootstrap.php** 内で使用されます。 :

``` php
Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
Inflector::rules('uninflected', ['singulars']);
Inflector::rules('irregular', ['phylum' => 'phyla']); // キーは単数形、値は複数形
```

与えられたルールは、 `Cake/Utility/Inflector` で定義された各変換セットの中に
マージされます。コアのルールよりも追加されたルールが優先されます。ルールをクリアして
Inflector の元の状態に戻すために `Inflector::reset()` が使用できます。
