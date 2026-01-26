# 3.8 移行ガイド

CakePHP 3.8 は 3.7 の API の完全上位互換です。
このページでは、3.8 の変更と改善についてのアウトラインを紹介します。

3.8.x にアップグレードするには、次の Composer コマンドを実行してください。

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.8.*"
```

## 非推奨

- `Validator::allowEmptyString()` 、 `allowEmptyArray()` 、
  `allowEmptyFile()` 、 `allowEmptyDate()` 、 `allowEmptyTime()` 、および
  `allowEmptyDateTime()` は、 `$field, $when, $message` シグネチャ使用時に
  非推奨警告を発するようになりました。代わりに `$field, $message, $when` を
  使用するべきです。
- `EntityTrait::visibleProperties()` は、非推奨になります。
  代わりに、 `getVisible()` を使用してください。

## 振る舞いの変更

- `Cake\ORM\Table::findOrCreate()` は、検索が失敗し `$search` から作成されたエンティティーに
  無効なデータが含まれる場合、 `PersistenceFailedException` を投げるようになりました。
  以前は無効なエンティティーが保存されていました。
- `$modelClass` プロパティーが設定された `Command` クラスは、そのモデルをオートロードします。
  空の引数を指定した手動の `loadModel()` の呼び出しはもう必要ありません。これにより、
  シェルクラスの動作と一貫性が保たれます。
- `Cake\I18n\Time` 、 `FrozenTime` 、 `Date` および `FrozenDate` のデフォルトフォーマットは、
  デンマーク語や他のヨーロッパのロケールにおけるローカリゼーション問題を解決する
  `yyyy-MM-dd'T'HH':'mm':'ssxxx` になります。

## 新機能

### Collection

- `CollectionTrait` はクローンを作成するのに `newCollection` メソッドを使用するようになりました。
  これにより、サブクラスは `Collection` を使用する代わりに、コレクションメソッドに
  それらのインスタンスを作成させることができます。

### Console

- `Command::executeCommand()` が追加されました。このメソッドは現在のコマンドから
  別のコマンドを呼び出すのを簡単にします。

### Datasource

- `Cake\Datasource\ModelAwareTrait::get()` は完全修飾クラス名で
  モデルクラスを見つけることができるようになり、
  `ArticleTable::class` を `get()` のパラメーターとして使用できるようになりました。

### Email

- `Email::setHeaders()` と `Email::addHeaders()` は、同じ名前の複数のヘッダーを
  設定できるようになりました。そのため、上記の関数に渡される配列引数の中の特定のヘッダーキーの値は
  配列でなければなりません。
  例: `$email->addHeaders(['og:tag' => ['foo', 'bar']]);`

### Http

- `Response::withCookieCollection()` が追加されました。

### ORM

- `Cake\ORM\Locator\TableLocator` はテーブルクラスを別の場所に配置できるようになりました。
  コンストラクターに名前空間のリストを提供するか、 `addLocation` メソッドを使用することができます。

### Validation

- `Validator::notEmptyString()` 、 `notEmptyArray()` 、 `notEmptyFile()` 、
  `notEmptyData()` 、 `notEmptyTime()` および `notEmptyDateTime()` が追加されました。
  3.7 で追加された `allowEmpty*` メソッドを補完するものとして機能します。
- `Validation::mimeType()` は大文字小文字を区別しないで mime-types のチェックを比較するようになりました。
- `Validation::dateTime()` は `iso8601` フォーマットをサポートします。

### View

- ラジオボタンは、複雑なオプション定義の中で `label` キーを使うことによって、
  生成されたラベルをカスタマイズすることができます。
  このキーはトップレベルのオプションで定義された `label` キーの代わりに使われます。
