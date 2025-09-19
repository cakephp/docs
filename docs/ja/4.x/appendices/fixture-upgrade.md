# フィクスチャのアップグレード

4.3.0では、フィクスチャのスキーマとデータ管理の責務が分割されました。
フィクスチャクラスやマイグレーションでスキーマを管理することは、
アプリケーションに複雑さとメンテナンスコストをもたらしていました。
4.3.0 では新しい API が追加され、既存のマイグレーションやスキーマ管理ツールを
テストでより簡単に再利用できるようになりました。

新しいフィクスチャシステムにアップグレードするには、いくつかのアップデートを行う必要があります:

1.  まず、`phpunit.xml` から `<listeners>` ブロックを削除します。

2.  次の内容を `phpunit.xml` に追加します:

    ``` html
    <extensions>
        <extension class="\Cake\TestSuite\Fixture\PHPUnitExtension" />
    </extensions>
    ```

    これは、テストフィクスチャマネージャからスキーマの管理を取り除きます。
    代わりに アプリケーションは、各テスト実行の最初にスキーマを作成/更新する必要があります。

3.  次に、スキーマを作成するために `tests/boostrap.php` を更新します。
    スキーマを作成するにはいくつかの異なる方法があります。
    CakePHPで提供されている方法については、\`creating-test-database-schema\` を参照してください。

4.  それから、フィクスチャから `$fields` と `$import` のプロパティをすべて削除してください。
    これらのプロパティは新しいフィクスチャシステムでは使用されません。

テストは引き続き通過するはずです。
そして、\`fixture-state-management\` を使って実験できるようになります。
大幅な性能向上を実現する `TransactionStrategy` を試すことができます。
`TransactionStrategy` のトレードオフは、テストごとに自動インクリメントの値が `1` から始まらなくなることです。

## レガシーなフィクスチャのドキュメント

以下の説明は、4.3.0以前のデフォルトであるリスナー・ベースのフィクスチャにのみ適用されます。

### フィクスチャのスキーマ

テーブルの一部となるフィールドとその定義を `$fields` で指定します。
これらのフィールドを定義するためのフォーマットは、 `Cake\Schema\Table` と同じです。
テーブルの定義に使用できるキーは以下のとおりです:

型  
CakePHP の内部データ型。現在サポートされているものは以下:

- `string`: は `VARCHAR` にマップします
- `char`: は `CHAR` にマップします
- `uuid`: は `UUID` にマップします
- `text`: は `TEXT` にマップします
- `integer`: は `INT` にマップします
- `biginteger`: は `BIGINTEGER` にマップします
- `decimal`: は `DECIMAL` にマップします
- `float`: は `FLOAT` にマップします
- `datetime`: は `DATETIME` にマップします
- `datetimefractional`: は `DATETIME(6)` か `TIMESTAMP` にマップします
- `timestamp`: は `TIMESTAMP` にマップします
- `timestampfractional`: は `TIMESTAMP(6)` か `TIMESTAMP` にマップします
- `time`: は `TIME` にマップします
- `date`: は `DATE` にマップします
- `binary`: は `BLOB` にマップします

長さ  
フィールドに必要な長さを設定します。

精度  
floatおよびdecimalフィールドで使用される小数点以下の桁数を設定します。

null  
`true` （NULLを許可する場合）、または `false` （許可しない場合）を設定します。

デフォルト  
フィールドが取るデフォルト値。

### テーブル情報のインポート

フィクスチャ・ファイルでスキーマを定義することは、プラグインやライブラリを作成するときや、
データベース・ベンダー間でポータブルにする必要のあるアプリケーションを作成するときに、とても便利です。
フィクスチャでスキーマを再定義することは、大規模なアプリケーションでは維持するのが難しくなります。
そのため、CakePHP では既存の接続からスキーマをインポートし、
反映されたテーブル定義を使用してテストスイートで使用するテーブル定義を作成する機能を提供しています。

まずは例を挙げて説明します。
articlesという名前のテーブルがあるとして、前節で示した例の フィクスチャを変更します。
(**tests/Fixture/ArticlesFixture.php**) を次のように変更します:

``` php
class ArticlesFixture extends TestFixture
{
    public $import = ['table' => 'articles'];
}
```

別の接続を使用したい場合は、以下を使用します:

``` php
class ArticlesFixture extends TestFixture
{
    public $import = ['table' => 'articles', 'connection' => 'other'];
}
```

通常、フィクスチャに沿ったTableクラスもあるはずです。
それを使用してテーブル名を取得することも可能です:

``` php
class ArticlesFixture extends TestFixture
{
    public $import = ['model' => 'Articles'];
}
```

また、プラグインシンタックスにも対応しています。

既存のモデル/テーブルからテーブル定義をインポートするのは当然として、
前のセクションで示したように、フィクスチャ上でレコードを直接定義することができます。
例えば以下のようになります:

``` php
class ArticlesFixture extends TestFixture
{
    public $import = ['table' => 'articles'];
    public $records = [
        [
          'title' => 'First Article',
          'body' => 'First Article Body',
          'published' => '1',
          'created' => '2007-03-18 10:39:23',
          'modified' => '2007-03-18 10:41:31'
        ],
        [
          'title' => 'Second Article',
          'body' => 'Second Article Body',
          'published' => '1',
          'created' => '2007-03-18 10:41:23',
          'modified' => '2007-03-18 10:43:31'
        ],
        [
          'title' => 'Third Article',
          'body' => 'Third Article Body',
          'published' => '1',
          'created' => '2007-03-18 10:43:23',
          'modified' => '2007-03-18 10:45:31'
        ]
    ];
}
```

最後に、フィクスチャでスキーマをロード/作成しないことも可能です。
これは、すでにテスト用のデータベースを用意していて、空のテーブルをすべて作成している場合に便利です。
フィクスチャに `$fields` も `$import` も定義しないことで、
フィクスチャはレコードを挿入し、各テストメソッドでレコードを切り詰めるだけになります。
