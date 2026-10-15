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
など近年のガイドラインは、次の 3 つにまとめられます。

1. **出力する時に、出力先に合わせてエスケープする。** データは入力されたまま保存し、出力する時に、
   出力先 (HTML の本文、属性、URL、JavaScript) に合ったエンコードでエスケープします。
   入力時のエスケープはデータを壊すうえ、出力先の違いに対応できません。
2. **信頼できないデータをエスケープせずに出力しない。** 例外は、無害化ライブラリを通した HTML だけです。
3. **Content Security Policy で二重に守る。** 漏れがあっても、悪用できる XSS にならないようにします。

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
