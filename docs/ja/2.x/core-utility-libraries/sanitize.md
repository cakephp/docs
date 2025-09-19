# データのサニタイズ

`Sanitize` クラスは、 2.4 から非推奨で、CakePHP 3.0 で削除されます。
Sanitize クラスを使用する代わりに、CakePHP の他のパーツ、 PHP ネイティブ関数や
その他のライブラリを使用して、同じタスクを成し遂げることができます。

## 入力のフィルタリング

Sanitize クラスの破壊的な入力フィルタリング機能を使う代わりに、あなたのアプリケーションで受け入れる
ユーザーデータに対して、 より徹底して [データバリデーション](../models/data-validation) を適用するべきです。
不正な入力を拒否することによって、ユーザーデータの破壊的な変更の必要性がなくなります。
また、ユーザー入力を変更したい場合、 [PHP のフィルタ拡張](https://www.php.net/filter) を
見てください。

## HTML データを受信

しばしば入力フィルタリングは、ユーザーが送信した HTML を受信する時に使われます。
これらの場合、 [HTML Purifier](https://htmlpurifier.org/) のような専門の
ライブラリを使用するのがベストです。

## SQL のエスケープ

CakePHP は、`Model::find()` や `Model::save()` に対して
全てのパラメータで SQL エスケープ処理をします。まれにユーザ入力を使って
SQL を手で組む必要がある場合、 [Prepared Statements](../models/retrieving-your-data#prepared-statements) を使用すべきです。
