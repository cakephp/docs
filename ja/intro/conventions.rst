CakePHP の規約
##############

私たちは「設定より規約」(*convention over configuration*) という考え方に賛成です。
CakePHP の規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。
規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも
開放されます。 規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすく
なります。

コントローラの規約
==================

コントローラのクラス名は複数形でキャメル記法で、最後に ``Controller`` が付きます。
``UsersController`` 、 ``ArticleCategoriesController`` は規約に合ったコントローラ名の例
となります。

コントローラーにある public メソッドは、アクションとしてブラウザからアクセス可能になります。
例えば、 ``/users/view`` は  ``UsersController`` の ``view()`` メソッドにアクセスします。
protected メソッドや private メソッドはルーティングしてアクセスすることはできません。

コントローラ名と URL
~~~~~~~~~~~~~~~~~~~~

前節の通り、ひとつの単語からなる名前のコントローラは、簡単に小文字の URL パスにマップできます。
例えば、 ``UsersController`` （ファイル名は 'UsersController.php'）には、
http://example.com/users としてアクセスできます。

複数語のコントローラをあなたの好きなようにルーティングできますが、
``DashedRoute`` クラスを使用すると URL は小文字とダッシュを用いる規約であり、
``ArticleCategoriesController::viewAll()`` アクションにアクセスするための正しい形式は
``/article-categories/view-all`` となります。

``this->Html->link`` を使用してリンクを作成した時、URL 配列に以下の規約を使用できます。 ::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix', // キャメルケース
        'plugin' => 'MyPlugin', // キャメルケース
        'controller' => 'ControllerName', // キャメルケース
        'action' => 'actionName' // キャメルバック
    ]

CakePHP の URL とパラメータの取り扱いに関するより詳細な情報は、
:ref:`routes-configuration` をご覧ください。

.. _file-and-classname-conventions:

ファイルとクラス名の規約
========================

通常、ファイル名はクラス名と一致し、オートローディングのために PRS-0 や PSR-4
標準に準拠してください。以下に、クラスメイトファイル名の例を挙げます。

-  ``LatestArticlesController`` というコントローラクラスは、
   **LatestArticlesController.php** というファイル名にします。
-  ``MyHandyComponent`` というコンポーネントクラスは、
   **MyHandyComponent.php** というファイル名にします。
-  ``OptionValuesTable`` という Table クラスは、
   **OptionValuesTable.php** というファイル名にします。
-  ``OptionValue`` という Entity クラスは、
   **OptionValue.php** というファイル名にします。
-  ``EspeciallyFunkableBehavior`` というビヘイビアクラスは、
   **EspeciallyFunkableBehavior.php** というファイル名にします。
-  ``SuperSimpleView`` というビュークラスは、
   **SuperSimpleView.php** というファイル名にします。
-  ``BestEverHelper`` というヘルパークラスは、
   **BestEverHelper.php** というファイル名にします。

各ファイルは、 app フォルダ内の適切なフォルダ・名前空間の中に配置します。

.. _model-and-database-conventions:

モデルとデータベースの規約
==========================

Table クラスの名前は複数形でキャメル記法で、最後に ``Table`` が付きます。 ``UsersTable``,
``ArticleCategoriesTable``, ``UserFavoritePagesTable`` などは規約に合ったモデル名です。

CakePHP のモデルに対応するテーブル名は、複数形でアンダースコア記法です。上記の例で言えば、
テーブル名はそれぞれ、 ``users`` 、 ``article_categories`` 、 ``user_favorite_pages``
になります。

規約は、テーブルやカラム名のための英語単語を使用するためのものです。もし、別の言語の単語を
使っているなら、CakePHP は正しい語形変化 (単数形から複数形、逆もまた同様) の処理ができません。
何らかの理由で、いくつかの単語のためのあなたの言語の規則を追加する必要がある場合、
ユーティリティライブラリの :php:class:`Cake\\Utility\\Inflector` を使うことができます。
これら独自の語形変化規則を定義することのほかに、このクラスは、 CakePHP が複数形や単数形の
単語のための独自構文を解釈することを確認できます。より詳しい情報は、
:doc:`/core-libraries/inflector` をご覧ください。

二個以上の単語で構成されるフィールドの名前は、 ``first_name`` のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne 中の外部キーは、デフォルトで関連するモデルの(単数形の)名前に
``_id`` を付けたものとして認識されます。ユーザーが記事を複数持っている (*Users hasMany Articles*)
としたら、 ``articles`` テーブルは、 ``user_id`` を外部キーとして ``users`` テーブルのデータを
参照します。 ``article_categories`` のような複数の単語のテーブルでは、外部キーは
``article_category_id`` のようになるでしょう。

モデル間の BelongsToMany の関係で使用される join テーブルは、結合するテーブルに合わせて、
アルファベット順に (``tags_articles`` ではなく、 ``articles_tags``) 並べた名前にしてください。

主キーとしてオートインクリメントキーを使用することに加えて UUID カラムも使用できます。
``Table::save()`` メソッドを使って新規レコードを保存するとき、CakePHP はユニークな
36 文字の UUID (:php:meth:`Cake\\Utilitiy\\Text::uuid`) を用いようとします。

ビューの規約
============

ビューのテンプレートファイルは、それを表示するコントローラの関数に合わせた、
アンダースコア記法で命名されます。
``ArticlesController`` クラスの ``viewAll()`` 関数は、ビューテンプレートとして、
**src/Template/Articles/view_all.ctp** を探すことになります。

基本パターンは、 **src/Template/コントローラ名/アンダースコア記法_関数名.ctp** です。

各部分を CakePHP の規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても
機能的に動作するようになります。以下が最後の規約に合った命名の例です。

-  データベースのテーブル: "articles"
-  Table クラス: ``ArticlesTable`` の場所は **src/Model/Table/ArticlesTable.php**
-  Entity クラス: ``Article`` の場所は **src/Model/Entity/Article.php**
-  Controller クラス: ``ArticlesController`` は
   **src/Controller/ArticlesController.php**
-  ビューテンプレートの場所は **src/Template/Articles/index.ctp**

これらの規約により、CakePHP は、 http://example.com/articles/ へのリクエストを、
ArticlesController の ``index()`` 関数にマップします。そして、Articles モデルが自動的に使える
（データベースの 'articles' テーブルに自動的に接続される）ようになり、表示されることになります。
必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

さて、これで CakePHP の基本について一通り理解できました。物事がどう組み合わせられるかを確かめるために、
:doc:`/tutorials-and-examples/bookmarks/intro` を体験することができるでしょう。

ORM と FormHelper の命名規則
============================

CakePHP のソースコードをナビゲートしていると、データベースキーマを扱う時は、
フィールドはしばしばカラムと呼ばれますが、エンティティを扱う時は、プロパティと呼ばれます。

キーとして記述されたフィールドやカラムは、一般に主キーや外部キーのカラムを表します。

スキーマのカラム、データベースのフィールド、エンティティのプロパティを検索する時、
それらがフレームワークを通して変化する可能性があるため、命名規則のフィールド、
プロパティまたはカラムによって参照されているかどうかを確認してください。

.. meta::
    :title lang=ja: CakePHP の規約
    :keywords lang=ja: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,articles,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
