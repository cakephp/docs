CakePHPの規約
#############

私たちは「設定より規約」(*convention over configuration*)という考え方に賛成です。
CakePHPの規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。
規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも開放されます。
規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすくなります。

CakePHPの規約は長年のweb開発経験とベストプラクティスを精錬したものです。
CakePHPでの開発にはこれらの規約の利用をお勧めしますが、特に既存システムと作業しなければいけない場合などのために、条項の大部分は独自設定できる、という点も述べておきましょう。

コントローラの規約
==================

コントローラのクラス名は複数形でキャメル記法で、最後に ``Controller`` が付きます。
``PeopleController`` 、 ``LatestArticlesController`` は規約に合ったコントローラ名の例となります。

コントローラーにあるパプリックメソッドは、アクションとしてブラウザからアクセス可能になります。
 例えば、 ``/articles/view`` は  ``ArticlesController`` の ``view()`` メソッドにアクセスします。
 Protected や private メソッドはURLでアクセスできません。

コントローラ名とURL
~~~~~~~~~~~~~~~~~~~

前節の通り、ひとつの単語からなる名前のコントローラは、簡単に小文字のURLパスにマップできます。
例えば、 ``ApplesController`` （ファイル名は'ApplesController.php'）には、 http://example.com/apples としてアクセスできます。

複数の単語からなる名前のコントローラは、コントローラ名と等価になるようなさまざまな形式が *考えられます* 。つまり:

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

は全て、 RedApples コントローラの index アクションとして解決されます。
しかしながら、 URL  ``DashedRoute`` クラスで使っているダッシュとアンダースコアを用いるというのが規約であり、 ``RedApplesController::go_pick`` アクションにアクセスするための正しい形式は ``/red-apples/go-pick`` となります。

When you create links using ``this->Html->link()``, you can use the following
conventions for the url array::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // CamelCased
        'plugin' => 'MyPlugin', // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

CakePHP の URL とパラメータの取り扱いに関するより詳細な情報は、 :ref:`routes-configuration` を参照してください。

.. _file-and-classname-conventions:

ファイルとクラス名の規約
========================

通常、ファイル名はクラス名にマッチしたものになり、and follow the PSR-0 or PSR-4
standards for autoloading. The following are some examples of class names and
their filenames:

-  **KissesAndHugsController** というコントローラのクラスは、
   **KissesAndHugsController.php** という名前にします。
-  **MyHandyComponent** というコンポーネントのクラスは、
   **MyHandyComponent.php** というファイル名にします。
-  **OptionValue** というモデルのクラスは、
   **OptionValue.php** というファイル名にします。
-  **OptionValuesTable** というモデルのクラスは、
   **OptionValuesTable.php** というファイル名にします。
-  **EspeciallyFunkableBehavior** というビヘイビアのクラスは、
   **EspeciallyFunkableBehavior.php** というファイル名にします。
-  **SuperSimpleView** というビューのクラスは、
   **SuperSimpleView.php** というファイル名にします。
-  **BestEverHelper** というヘルパーのクラスは、
   **BestEverHelper.php** というファイル名にします。

各ファイルは、 app フォルダ内のそれぞれ適切なフォルダ/名前空間の中に配置します。

モデルとデータベースの規約
==========================

テーブルのクラス名は複数形でキャメル記法です。
People, BigPeople, ReallyBigPeople などは規約に合ったモデル名です。

CakePHP のモデルに対応するテーブル名は、複数形でアンダースコア記法です。
上記の例で言えば、テーブル名はそれぞれ、 ``people`` 、 ``big_people`` 、 ``really_big_people`` になります。

ユーティリティライブラリの :php:class:`Cake\\Utility\\Inflector` を使って、単語の単数形・複数形を判定することができます。
より詳しい情報は、 :doc:`/core-libraries/inflector` を読んでください。

二個以上の単語で構成されるフィールドの名前は、 first\_name のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne 中の外部キーは、デフォルトで関連するモデルの(単数形の)名前に \_id を付けたものとして認識されます。
ケーキ職人(Backer)がケーキ(Cake)を複数持っている(hasMany)としたら、cakes テーブルは、baker\_id を外部キーとして bakers テーブルのデータを参照します。
category\_types のような複数の単語のテーブルでは、外部キーは category\_type\_id のようになるでしょう。

モデル間の BelongsToMany の関係で使用される join テーブルは、join するテーブルに合わせて、アルファベット順に（zebras\_apples ではなく、apples\_zebras）並べた名前にしてください。

また、主キーをオートインクリメントとしてではなく、char(36)として使用しても構いません。
そうすると、Model::save メソッドを使って新規レコードを保存するとき、Cakeはユニークな36文字のuuid (String::uuid) を用いようとします。

ビューの規約
============

ビューのテンプレートファイルは、それを表示するコントローラの関数に合わせた、アンダースコア記法で名前が付きます。
PeopleControllerクラスのgetReady()関数は、ビューテンプレートとして、 **src/Template/People/get_ready.ctp** を探すことになります。

基本パターンは、 **src/Template/コントローラ名/アンダースコア記法\_関数名.ctp** です。

各部分をCakePHPの規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても機能的に動作するようになります。
以下が最後の規約に合った命名の例です

-  データベースのテーブル： "people"
-  テーブルクラス： "PeopleTable"、 場所は **src/Model/Table/PeopleTable.php**
-  エンティティークラス： "Person"、 場所は
   **src/Controller/PeopleController.php**
-  ビューのテンプレート、場所は **src/Template/People/index.ctp**

これらの規約により、CakePHPは、http://example.com/people/ へのリクエストを、PeopleControllerの ``index()`` 関数にマップします。
そして、Personモデルが自動的に使える（データベースの'people'テーブルに自動的に接続される）ようになり、表示されることになります。
必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

さて、これでCakePHPの基本について一通り理解できました。
物事がどう組み合わせられるかを確かめるために、 :doc:`/tutorials-and-examples/bookmarks/intro` を体験することができるでしょう。
