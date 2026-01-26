# 3.9 移行ガイド

CakePHP 3.9 は 3.8 の API の完全上位互換です。
このページでは、3.8 の変更と改善についてのアウトラインを紹介します。

3.9.x にアップグレードするには、次の Composer コマンドを実行してください。

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"
```

## 非推奨

- `ConsoleIo::info()` 、 `success()` 、 `warning()` および `error()` は
  4.0 において `message` パラメータで `null` 値を受け入れるようになりました。
- テストケースで `$fixtures` にコンマ区切りの文字列を使用することは非推奨です。
  代わりに、配列を使用するか、新しい `getFixtures()` メソッドをテストケースクラスに実装してください。

## 新機能

### Cache

- `MemcachedEngine::write()` および `add()` は、期間を30日に制限しなくなりました。
  代わりに、すべての有効期限値が memcache に転送されます。

### Console

- `ConsoleIo::abort()` が追加されました。

### Database

- `Driver::newTableSchema()` が追加されました。このフックメソッドを使用すると、
  スキーマメタデータに使用するクラスをカスタマイズすることができます。

### Datasource

- `Cake\Datasource\SimplePaginator` が追加されました。このクラスにより、
  非常に大きな結果のページ分けがより効率的になります。潜在的に高価な `count()`
  クエリーの実行をスキップします。ページネーションコントロールで「次へ」と「前へ」の
  ナビゲーションのみを使用する場合、このクラスは良い解決策になります。

### ORM

- エラーの場合に失敗した特定のエンティティーで `PersistenceFailedException` をスローする
  `Table::saveManyOrFail()` メソッドが追加されました。
  エンティティーはトランザクション内で保存されます。
- `Table::deleteMany()` および `Table::deleteManyOrFail()` メソッドが、
  コールバックを含む多くのエンティティーを一度に削除するために追加されました。
  エンティティーはトランザクション内で削除されます。
- `TableLocator::clear()` は内部の `options` 配列をリセットするようになりました。

### TestSuite

- `TestCase::getFixtures()` が追加されました。このメソッドを使用すると、
  必要に応じてアプリケーション固有のロジックを使用してフィクスチャーリストを生成できます。

### Utility

- `Hash::sort()` は、方向パラメーターで `SORT_ASC` および `SORT_DESC` 定数を
  受け入れるようになりました。

### Validation

- `Validator` の 'empty' フィールドの検出では、エラーコードが `UPLOAD_ERR_NO_FILE` である
  `UploadedFileInterface` オブジェクトを空であると見なすようになりました。

### View

- `FormHelper` に `selectedClass` テンプレート変数が追加されました。このテンプレートキーは、
  ラジオまたはチェックボックスが選択されているときに使用されるクラス名を制御します。
