# CakePHP の規約

私たちは「設定より規約」(*convention over configuration*) という考え方に賛成です。
CakePHP の規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。
規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも
開放されます。 規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすく
なります。

## コントローラーの規約

コントローラーのクラス名は複数形でパスカルケースで、最後に `Controller` が付きます。
`UsersController` 、 `ArticleCategoriesController` は規約に合ったコントローラー名の例
となります。

コントローラーにある public メソッドは、アクションとしてブラウザーからアクセス可能になります。
例えば、 `/users/view` は `UsersController` の `view()` メソッドにアクセスします。
protected メソッドや private メソッドはルーティングしてアクセスすることはできません。

### コントローラー名と URL

前節の通り、ひとつの単語からなる名前のコントローラーは、簡単に小文字の URL パスにマップできます。
例えば、 `UsersController` （ファイル名は **UsersController.php**）には、
`http://example.com/users` としてアクセスできます。

複数語のコントローラーをあなたの好きなようにルーティングできますが、
`DashedRoute` クラスを使用すると URL は小文字とダッシュを用いる規約であり、
`ArticleCategoriesController::viewAll()` アクションにアクセスするための正しい形式は
`/article-categories/view-all` となります。

`$this->Html->link` を使用してリンクを作成した時、URL 配列に以下の規約を使用できます。 :

``` php
$this->Html->link('link-title', [
    'prefix' => 'MyPrefix', // パスカルケース
    'plugin' => 'MyPlugin', // パスカルケース
    'controller' => 'ControllerName', // パスカルケース
    'action' => 'actionName' // キャメルバック
]
```

CakePHP の URL とパラメーターの取り扱いに関するより詳細な情報は、
[Routes Configuration](../development/routing#routes-configuration) をご覧ください。

## ファイルとクラス名の規約

通常、ファイル名はクラス名と一致し、オートローディングのために PSR-4
標準に準拠してください。以下に、クラス名とファイル名の例を挙げます。

- `LatestArticlesController` というコントローラークラスは、
  **LatestArticlesController.php** というファイル名にします。
- `MyHandyComponent` というコンポーネントクラスは、
  **MyHandyComponent.php** というファイル名にします。
- `OptionValuesTable` という Table クラスは、
  **OptionValuesTable.php** というファイル名にします。
- `OptionValue` という Entity クラスは、
  **OptionValue.php** というファイル名にします。
- `EspeciallyFunkableBehavior` というビヘイビアークラスは、
  **EspeciallyFunkableBehavior.php** というファイル名にします。
- `SuperSimpleView` というビュークラスは、
  **SuperSimpleView.php** というファイル名にします。
- `BestEverHelper` というヘルパークラスは、
  **BestEverHelper.php** というファイル名にします。

各ファイルは、 app フォルダー内の適切なフォルダー・名前空間の中に配置します。

## データベースの規約

CakePHP のモデルに対応するテーブル名は、複数形でアンダースコア記法です。上記の例で言えば、
テーブル名はそれぞれ、 `users` 、 `article_categories` 、 `user_favorite_pages`
になります。

二個以上の単語で構成されるフィールド/カラムの名前は、
`first_name` のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne 中の外部キーは、デフォルトで関連するモデルの(単数形の)名前に
`_id` を付けたものとして認識されます。ユーザーが記事を複数持っている (*Users hasMany Articles*)
としたら、 `articles` テーブルは、 `user_id` を外部キーとして `users` テーブルのデータを
参照します。 `article_categories` のような複数の単語のテーブルでは、外部キーは
`article_category_id` のようになるでしょう。

モデル間の BelongsToMany の関係で使用される join テーブルは、結合するテーブルに合わせて、
アルファベット順に (`tags_articles` ではなく、 `articles_tags`) 並べた名前にしてください。
そうでなければ bake コマンドは動作しません。連結用テーブルにカラムを追加する必要がある場合は、
そのテーブル用に別のエンティティークラスやテーブルクラスを作成する必要があります。

主キーとしてオートインクリメントな整数型を使用することに加えて UUID カラムも使用できます。
`Table::save()` メソッドを使って新規レコードを保存するとき、CakePHP はユニークな
36 文字の UUID (`Cake\Utilitiy\Text::uuid`) を用いようとします。

## モデルの規約

Table クラスの名前は複数形でパスカルケースで、最後に `Table` が付きます。 `UsersTable`,
`ArticleCategoriesTable`, `UserFavoritePagesTable` などは `users`,
`article_categories`, `user_favorite_pages` テーブルに対応するテーブルクラス名の例です。

Entity クラスの名前は単数形でパスカルケースで、サフィックスはありません。 `User`,
`ArticleCategory`, `UserFavoritePage` などは `users`, `article_categories`,
`user_favorite_pages` テーブルに対応するエンティティー名の例です。

## ビューの規約

ビューのテンプレートファイルは、それを表示するコントローラーの関数に合わせた、
アンダースコア記法で命名されます。
`ArticlesController` クラスの `viewAll()` 関数は、ビューテンプレートとして、
**templates/Articles/view_all.php** を探すことになります。

基本パターンは、 **templates/コントローラー名/アンダースコア記法_関数名.php** です。

> [!NOTE]
> デフォルトで、CakePHP は英単語の語形変化を使用します。もし、別の言語を使った
> データベースのテーブルやカラムがある場合、語形変化規則 (単数形から複数形、逆もまた同様) の
> 追加が必要になります。カスタム語形変化規則を定義するために `Cake\Utility\Inflector` を
> 使うことができます。より詳しい情報は、 [Inflector](../core-libraries/inflector) をご覧ください。

## プラグインの規約

CakePHP プラグインのパッケージ名にプレフィックスとして "cakephp-" を付けると便利です。
これにより、名前が意味的にフレームワークに依存することを関連付けられます。

CakePHP 所有のプラグインに予約されているため、ベンダー名として CakePHP ネームスペース（cakephp）
を **使用しない** でください。
規約では、小文字の文字とダッシュを区切り記号として使用します。 :

``` text
// 悪い例
cakephp/foo-bar

// 良い例
your-name/cakephp-foo-bar
```

詳しくは [awesome list recommendations](https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins) をご覧ください。

## 要約

各部分を CakePHP の規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても
機能的に動作するようになります。以下が最後の規約に合った命名の例です。

- データベースのテーブル: "articles"
- Table クラス: `ArticlesTable` の場所は **src/Model/Table/ArticlesTable.php**
- Entity クラス: `Article` の場所は **src/Model/Entity/Article.php**
- Controller クラス: `ArticlesController` は
  **src/Controller/ArticlesController.php**
- ビューテンプレートの場所は **templates/Articles/index.php**

これらの規約により、CakePHP は、 `http://example.com/articles` へのリクエストを、
ArticlesController の `index()` 関数にマップします。そして、Articles モデルが自動的に使える
（データベースの 'articles' テーブルに自動的に接続される）ようになり、表示されることになります。
必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

<table style="width:98%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 23%" />
<col style="width: 20%" />
<col style="width: 43%" />
</colgroup>
<tbody>
<tr>
<td>Example</td>
<td>articles</td>
<td>menu_links</td>
<td></td>
</tr>
<tr>
<td>Database Table</td>
<td>articles</td>
<td>menu_links</td>
<td>Table names corresponding to CakePHP models are plural and underscored.</td>
</tr>
<tr>
<td>File</td>
<td>ArticlesController.php</td>
<td>MenuLinksController.php</td>
<td></td>
</tr>
<tr>
<td>Table</td>
<td>ArticlesTable.php</td>
<td>MenuLinksTable.php</td>
<td>Table class names are plural, CamelCased and end in Table</td>
</tr>
<tr>
<td>Entity</td>
<td>Article.php</td>
<td>MenuLink.php</td>
<td>Entity class names are singular, CamelCased: Article and MenuLink</td>
</tr>
<tr>
<td>Class</td>
<td>ArticlesController</td>
<td>MenuLinksController</td>
<td></td>
</tr>
<tr>
<td>Controller</td>
<td>ArticlesController</td>
<td>MenuLinksController</td>
<td>Plural, CamelCased, end in Controller</td>
</tr>
<tr>
<td>Behavior</td>
<td>ArticlesBehavior.php</td>
<td>MenuLinksBehavior.php</td>
<td></td>
</tr>
<tr>
<td>View</td>
<td>ArticlesView.php</td>
<td>MenuLinksView.php</td>
<td>View template files are named after the controller functions they display, in an underscored form</td>
</tr>
<tr>
<td>Helper</td>
<td>ArticlesHelper.php</td>
<td>MenuLinksHelper.php</td>
<td></td>
</tr>
<tr>
<td>Component</td>
<td>ArticlesComponent.php</td>
<td>MenuLinksComponent.php</td>
<td></td>
</tr>
<tr>
<td>Plugin</td>
<td>Bad: cakephp/articles Good: you/cakephp-articles</td>
<td>cakephp/menu-links you/cakephp-menu-links</td>
<td>Useful to prefix a CakePHP plugin with "cakephp-" in the package name. Do not use the CakePHP namespace (cakephp) as vendor name as this is reserved to CakePHP owned plugins. The convention is to use lowercase letters and dashes as separator.</td>
</tr>
<tr>
<td colspan="4">Each file would be located in the appropriate folder/namespace in your app folder.</td>
</tr>
</tbody>
</table>

## Database Convention Summary

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<tbody>
<tr>
<td><p>Foreign keys</p>
<p>hasMany belongsTo/ hasOne BelongsToMany</p></td>
<td>Relationships are recognized by default as the (singular) name of the related table followed by <code>_id</code>. Users hasMany Articles, <code>articles</code> table will refer to the <code>users</code> table via a <code>user_id</code> foreign key.</td>
</tr>
<tr>
<td>Multiple Words</td>
<td><code>menu_links</code> whose name contains multiple words, the foreign key would be <code>menu_link_id</code>.</td>
</tr>
<tr>
<td>Auto Increment</td>
<td>In addition to using an auto-incrementing integer as primary keys, you can also use UUID columns. CakePHP will create UUID values automatically using (<code class="interpreted-text" role="php:meth">Cake\Utility\Text::uuid()</code>) whenever you save new records using the <code>Table::save()</code> method.</td>
</tr>
<tr>
<td>Join tables</td>
<td>Should be named after the model tables they will join or the bake command won't work, arranged in alphabetical order (<code>articles_tags</code> rather than <code>tags_articles</code>). Additional columns on the junction table you should create a separate entity/table class for that table.</td>
</tr>
</tbody>
</table>

さて、これで CakePHP の基本について一通り理解できました。物事がどう組み合わせられるかを確かめるために、
[コンテンツ管理チュートリアル](../tutorials-and-examples/cms/installation) を体験することができるでしょう。
