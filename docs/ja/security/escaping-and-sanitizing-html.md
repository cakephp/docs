# 出力時のエスケープと HTML の無害化

クロスサイトスクリプティング (XSS) は、ユーザーからのデータが HTML や JavaScript として
ページに入り込むことで起こります。CakePHP 2 のテンプレート (`.ctp` ファイル) はそのままの PHP で、
出力を自動ではエスケープしません。値をどのように出力するかは、テンプレートごとに自分で決めます。
このページでは、そのための 2 つの方法を説明します。

- **エスケープ** は特殊文字を HTML の実体参照に変換し、値を文字列として表示します。
  ほとんどすべての値に使います。
- **無害化** (サニタイズ) は HTML を残したまま、許可リストにないものをすべて取り除き、
  HTML として出力できるようにします。ユーザーに HTML の入力を許可している箇所だけで使います。

[OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
など近年のガイドラインは、次の 4 つにまとめられます ([参考資料](#references))。

1. **入力を検証する。** すべての値をサーバー側で、その項目に許される内容 (型、長さ、形式、
   許可する値、正しい UTF-8) と照らし合わせ、合わなければリクエストを拒否します。
   [入力の検証](#validate-input) を参照してください。
2. **出力する時に、出力先に合わせてエスケープする。** 検証したデータは HTML のエスケープをせずに
   入力されたまま保存し、出力する時に、出力先 (HTML の本文、属性、URL、JavaScript) に合った
   エンコードでエスケープします。入力時のエスケープはデータを壊すうえ、出力先の違いに対応できません。
3. **信頼できないデータをエスケープせずに出力しない。** 例外は、無害化ライブラリを通した HTML だけです。
4. **Content Security Policy で二重に守る。** 漏れがあっても、悪用できる XSS にならないようにします。

検証とエスケープは役割が違います。検証は不正なデータを入れないため、エスケープは正しいデータが
コードとして実行されないためのものです。コメント欄に `<script>` と書くのは正当な入力でありうるため、
検証だけでは XSS を防げません。エスケープだけでは不正なデータの保存を防げません。両方を使ってください。

<a id="validate-input"></a>

## 入力の検証

リクエストから受け取るすべてのデータ (フォームのデータ、クエリ文字列、クッキー、ヘッダー、
アップロードされたファイル) は、保存したり使ったりする前に検証します。

- すべての項目のルールをモデルの `$validate` に定義し、検証を有効にしたまま保存します
  (`save()` は既定で検証します。ユーザーのデータに `'validate' => false` を指定しないでください)。
  [データバリデーション](/ja/models/data-validation) を参照してください。
- 許可リストを優先します。決まった選択肢には `inList`、形式には `naturalNumber`、`date`、
  `email`、`url`、`maxLength`、`custom` のパターンを使います。テキストの項目には必ず長さの上限を設けます。
- 不正な入力は直さずに拒否します。値を黙って削ったり書き換えたりせず、検証エラーをユーザーに表示します。
- 文字コードを確認します。v2.12.6 からは、`utf8` ルールで不正な UTF-8 のバイト列を拒否できます
  (既定では、MySQL の 3 バイトの `utf8` 向けに基本多言語面より外の文字も拒否します。
  `utf8mb4` では `'extended' => true` を指定してください)。
- 検証はサーバー側で行います。ブラウザーでのチェック (HTML5 の属性や JavaScript) は、
  ユーザーの利便のためのものにすぎません。
- `save()` の `fieldList` オプションで保存できる項目を限定し、リクエストから `role` や `user_id`
  のような項目を書き換えられないようにします。

<a id="escape-by-default"></a>

## 基本はエスケープする

HTML として出力するもの以外の値は、すべて `h()` でエスケープします。

```php
<h1><?php echo h($post['Post']['title']); ?></h1>
<p><?php echo h($post['Post']['summary']); ?></p>
```

`h()` は `ENT_QUOTES` とアプリケーションの文字コードを指定して `htmlspecialchars()` を使うため、
要素の内容にも、引用符で囲んだ属性値にも安全に使えます。
[グローバル定数およびグローバル関数](/ja/core-libraries/global-constants-and-functions)
を参照してください。

ヘルパーはエスケープしてくれます。

- `HtmlHelper::link()` はリンクの文字列と属性をエスケープします。`'escape' => false` は、
  文字列が自分で組み立てた HTML の場合だけ指定してください。
- `FormHelper` は作成した入力欄の値をエスケープします。
- `HtmlHelper::tag()`、`div()`、`para()` は属性をエスケープします。内容は自分でエスケープするか、
  `'escape' => true` を指定してください。

ほかの文脈に出力する値には、別のエンコードが必要です。

- **属性の中の URL:** `HtmlHelper::url()` や `Router::url()` で組み立ててください。
  ユーザーが入力した URL は、スキーム (`http`/`https`) を確認せずに出力しないでください。
  `javascript:` の URL は `h()` では防げません。
- **JavaScript:** インラインのスクリプトに、値を文字列の連結で埋め込まないでください。
  `</script>` や引用符でスクリプトが閉じられないよう、`json_encode()` と `JSON_HEX_*`
  フラグでエンコードします。

  ```php
  <script>
  var config = <?php echo json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  </script>
  ```

<a id="accepting-html"></a>

## ユーザーからの HTML を受け付ける

リッチテキストエディターなどでユーザーが HTML を入力する場合は、エスケープは使えません。
許可リストにある要素と属性だけを残す、メンテナンスされている HTML の無害化ライブラリを通してください。
正規表現や `strip_tags()` で独自のフィルターを作らないでください。多くの抜けが生じます。

- [Symfony HtmlSanitizer](https://symfony.com/doc/current/html_sanitizer.html)
  (`symfony/html-sanitizer`) は W3C の HTML Sanitizer API に沿ったもので、おすすめです。
  PHP 8.1 以降が必要です。Composer が PHP に合ったバージョンを入れます
  (PHP 8.1 では 6.4 LTS、新しい PHP では新しいリリース)。

  ```php
  use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
  use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

  $sanitizer = new HtmlSanitizer(
      (new HtmlSanitizerConfig())->allowSafeElements(),
  );
  $html = $sanitizer->sanitize($this->request->data['Post']['body']);
  ```

- [HTML Purifier](https://htmlpurifier.org/) (`ezyang/htmlpurifier`) も引き続きメンテナンスされており、
  PHP 8.0 を含め、`pieceofcake2/cakephp` が動作するすべての PHP のバージョンに対応しています。
  PHP 8.0 を使う場合や、細かい設定が必要な場合に使ってください。

  ```php
  $purifier = new HTMLPurifier(HTMLPurifier_Config::createDefault());
  $html = $purifier->purify($this->request->data['Post']['body']);
  ```

無害化する場所:

- HTML を保存する時 (モデルの `beforeSave()` や、コントローラーで `save()` の前など) に無害化し、
  出力するすべての場所で無害化済みの HTML を使う **か**、元の HTML を保存しておき、出力する直前に
  無害化してください。管理画面やメールも含め、無害化していないユーザーの HTML はどこにも出力しないでください。
- 無害化した HTML は `h()` を通さずに出力し、それ以外の項目はいつもどおりエスケープします。
- 許可リストは小さく保ってください。エディターに必要な要素と属性、`http`/`https` (と `mailto`)
  のリンクだけを許可します。

<a id="markdown"></a>

### Markdown

Markdown にも生の HTML を書けます。ユーザーが入力した Markdown を表示する場合
(たとえば、変換した HTML をそのまま返す [pieceofcake2/markdown](https://pieceofcake2.github.io/markdown/)
を使う場合) は、変換後の HTML を同じように無害化してください。

<a id="sanitize-class"></a>

## Sanitize クラス

CakePHP 2 の `Sanitize` クラスは非推奨です。`html()` メソッドは無害化ではなくエスケープを行い、
`clean()` は結果を予測しにくい方法でデータを書き換えます。代わりに `h()` と上記のライブラリを使ってください。
[データのサニタイズ](/ja/core-utility-libraries/sanitize) を参照してください。

<a id="defense-in-depth"></a>

## 多層防御

- [Content Security Policy](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/CSP)
  のヘッダーを送ると、すり抜けた XSS があってもスクリプトが実行されません。推奨されるのは nonce を使った
  厳格なポリシー (`script-src 'nonce-...' 'strict-dynamic'; object-src 'none'; base-uri 'none'`)
  です。リクエストごとにランダムな nonce を作ってヘッダーで送り、出力するすべての `<script>`
  タグに付けます。最初は `Content-Security-Policy-Report-Only` で、nonce が必要なスクリプトを洗い出してください。
- スクリプトから読めないよう、クッキーに `httpOnly` を付けてください。
  [セキュリティチェックリスト](/ja/security/hardening#cookies-and-sessions) を参照してください。

<a id="references"></a>

## 参考資料

- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html):
  出力先ごとのエンコードと HTML の無害化
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/):
  エンコード、無害化、セキュリティヘッダーの検証要件
