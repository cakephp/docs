# データベースアクセス & ORM

CakePHP では、2種類の主要なオブジェクトを使ってデータベースのデータを操作します。
1種類目は **リポジトリー** や **テーブルオブジェクト** です。これらのオブジェクトを利用して、
データのコレクションへアクセスします。これらを利用することで、新しいレコードを保存したり、
既存データの編集/削除、リレーションの定義、そして一括処理ができます。
2種類目は **エンティティー** です。エンティティーは、個々のレコードを意味し、
行/レコードレベルの振る舞いや機能の定義を可能にします。

これら2つのクラスは、原則、あなたのデータ、正当性、相互作用や展開に関して発生するほぼすべてのことを
管理する役割を担います。

CakePHP の組み込み ORM はリレーショナルデータベースに特化していますが、
別のデータソースを選択するように拡張することも可能です。

CakePHP の ORM はアクティブレコードやデータマッパーパターンのアイデアやコンセプトを拝借しています。
その目的は、早く作成し、シンプルに ORM を利用するという2つの利点を混成させるためです。

ORM の調査を始める前に [あなたのデータベース接続の設定](orm/database-basics#database-configuration)
をご確認ください。

## 簡単な例

始めるにあたり、何もコードを書く必要はありません。もし、あなたのデータベーステーブルが [CakePHP
の規約](intro/conventions#model-and-database-conventions) に準拠している場合、すぐに ORM の利用を開始できます。
例えば `articles` からいくつかデータをロードしたい場合、 **src/Model/Table/ArticlesTable.php** を作成し、下記のように記述できます。 :

``` php
<?php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
}
```

Then in a controller or command we can have CakePHP create an instance for us:

``` php
public function someMethod()
{
    $resultset = $this->fetchTable('Articles')->find()->all();

    foreach ($resultset as $row) {
        echo $row->title;
    }
}
```

In other contexts, you can use the `LocatorAwareTrait` which add accessor methods for ORM tables:

``` php
use Cake\ORM\Locator\LocatorAwareTrait;

public function someMethod()
{
    $articles = $this->getTableLocator()->get('Articles');
    // more code.
}
```

Within a static method you can use the `Cake\Datasource\FactoryLocator`
to get the table locator:

``` php
// $articles は、 ArticlesTable クラスのインスタンスです。
$articles = TableRegistry::getTableLocator()->get('Articles');
```

具象テーブルクラスがあると、具象化エンティティークラスが欲しくなります。
エンティティークラスはアクセッサーとミューテーターメソッドを定義でき、
個別や複数レコードにカスタムロジックを定義できます。
下記を **src/Model/Entity/Article.php** 内、 `<?php` の開始タグの後に追加します。 :

``` php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
}
```

エンティティーはデフォルトで単数形キャメルケースのテーブル名を利用します。
前の手順でエンティティークラスはすでに作ったので、データベースからエンティティーをロードした時に、
新しい Article クラスのインスタンスが生成されます。 :

``` php
use Cake\ORM\Locator\LocatorAwareTrait;

// ArticlesTable のインスタンス取得
$articles = $this->getTableLocator()->get('Articles');
$resultset = $articles->find()->all();

foreach ($resultset as $row) {
    // 各 row は、 Article クラスのインスタンスです。
    echo $row->title;
}
```

CakePHP は命名規則でテーブルクラスとエンティティークラスを関連づけます。
もしテーブルにどのエンティティーを利用するかカスタマイズする必要があれば、
`entityClass()` のメソッドを特定のクラス名にセットします。

[テーブルオブジェクト](orm/table-objects) と [エンティティー](orm/entities) の章に、
テーブルオブジェクトとエンティティーの使い方が詳しく記述されています。

## 詳細

- [データベースの基本](orm/database-basics)
- [クエリービルダー](orm/query-builder)
- [テーブルオブジェクト](orm/table-objects)
- [エンティティー](orm/entities)
- [データの取り出しと結果セット](orm/retrieving-data-and-resultsets)
- [データの検証](orm/validation)
- [データの保存](orm/saving-data)
- [データの削除](orm/deleting-data)
- [アソシエーション - モデル同士を繋ぐ](orm/associations)
- [ビヘイビアー](orm/behaviors)
- [スキーマシステム](orm/schema-system)
- [スキーマキャッシュツール](console-commands/schema-cache)
