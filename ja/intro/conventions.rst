CakePHP の規約
##############

私たちは「設定より規約」(*convention over configuration*)という考え方に賛成です。
CakePHP の規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。
規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも
開放されます。 規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすく
なります。

CakePHP の規約は長年のウェブ開発経験とベストプラクティスを精錬したものです。CakePHP での開発には
これらの規約の利用をお勧めしますが、特に既存システムと作業しなければいけない場合などのために、条項の
大部分は独自設定できる、という点も述べておきましょう。

コントローラの規約
==================

コントローラのクラス名は複数形でキャメル記法で、最後に ``Controller`` が付きます。
``PeopleController`` 、 ``LatestArticlesController`` は規約に合ったコントローラ名の例となります。

コントローラーにある public メソッドは、アクションとしてブラウザからアクセス可能になります。
例えば、 ``/articles/view`` は  ``ArticlesController`` の ``view()`` メソッドにアクセスします。
protected メソッドや private メソッドはルーティングしてアクセスすることはできません。

コントローラ名と URL
~~~~~~~~~~~~~~~~~~~~

前節の通り、ひとつの単語からなる名前のコントローラは、簡単に小文字の URL パスにマップできます。
例えば、 ``ApplesController`` （ファイル名は 'ApplesController.php'）には、
http://example.com/apples としてアクセスできます。

複数の単語からなる名前のコントローラは、コントローラ名と等価になるようなさまざまな形式が
*考えられます* 。つまり:

-  /redApples
-  /RedApples
-  /Red_apples
-  /red_apples

は全て、 RedApples コントローラの index アクションとして解決されます。
しかしながら、 ``DashedRoute`` クラスを使用すると URL は小文字とダッシュを用いる規約であり、
``RedApplesController::goPick()`` アクションにアクセスするための正しい形式は
``/red-apples/go-pick`` となります。

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

通常、ファイル名はクラス名と一致し、オートローディングのために PRS-0 や PSR-4 標準に準拠してください。
以下に、クラスメイトファイル名の例を挙げます。

-  **KissesAndHugsController** というコントローラクラスは、
   **KissesAndHugsController.php** というファイル名にします。
-  **MyHandyComponent** というコンポーネントクラスは、
   **MyHandyComponent.php** というファイル名にします。
-  **OptionValuesTable** という Table クラスは、
   **OptionValuesTable.php** というファイル名にします。
-  **OptionValue** という Entity クラスは、
   **OptionValue.php** というファイル名にします。
-  **EspeciallyFunkableBehavior** というビヘイビアクラスは、
   **EspeciallyFunkableBehavior.php** というファイル名にします。
-  **SuperSimpleView** というビュークラスは、
   **SuperSimpleView.php** というファイル名にします。
-  **BestEverHelper** というヘルパークラスは、
   **BestEverHelper.php** というファイル名にします。

各ファイルは、 app フォルダ内の適切なフォルダ・名前空間の中に配置します。

モデルとデータベースの規約
==========================

Table クラスの名前は複数形でキャメル記法です。
People, BigPeople, ReallyBigPeople などは規約に合ったモデル名です。

CakePHP のモデルに対応するテーブル名は、複数形でアンダースコア記法です。
上記の例で言えば、テーブル名はそれぞれ、 ``people`` 、 ``big_people`` 、 ``really_big_people``
になります。

ユーティリティライブラリの :php:class:`Cake\\Utility\\Inflector` を使って、単語の単数形・複数形を
判定することができます。より詳しい情報は、 :doc:`/core-libraries/inflector` をご覧ください。

二個以上の単語で構成されるフィールドの名前は、 first\_name のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne 中の外部キーは、デフォルトで関連するモデルの(単数形の)名前に
\_id を付けたものとして認識されます。ケーキ職人がケーキを複数持っている (*Bakers hasMany Cakes*)
としたら、cakes テーブルは、baker\_id を外部キーとして bakers テーブルのデータを参照します。
category\_types のような複数の単語のテーブルでは、外部キーは category\_type\_id のようになるでしょう。

モデル間の BelongsToMany の関係で使用される join テーブルは、結合するテーブルに合わせて、
アルファベット順に（zebras\_apples ではなく、apples\_zebras）並べた名前にしてください。

また、主キーをオートインクリメントとしてではなく、char(36) として使用しても構いません。
そうすると、 ``Table::save()`` メソッドを使って新規レコードを保存するとき、CakePHP はユニークな
36 文字の UUID (Text::uuid) を用いようとします。

ビューの規約
============

ビューのテンプレートファイルは、それを表示するコントローラの関数に合わせた、
アンダースコア記法で命名されます。
PeopleController クラスの getReady() 関数は、ビューテンプレートとして、
**src/Template/People/get_ready.ctp** を探すことになります。

基本パターンは、 **src/Template/コントローラ名/アンダースコア記法\_関数名.ctp** です。

各部分を CakePHP の規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても
機能的に動作するようになります。以下が最後の規約に合った命名の例です。

-  データベースのテーブル: "people"
-  Table クラス: "PeopleTable" の場所は **src/Model/Table/PeopleTable.php**
-  Entity クラス: "Person" の場所は **src/Model/Entity/Person.php**
-  Controller クラス: "PeapleController" は
   **src/Controller/PeopleController.php**
-  ビューテンプレートの場所は **src/Template/People/index.ctp**

これらの規約により、CakePHP は、http://example.com/people/ へのリクエストを、
PeopleController の ``index()`` 関数にマップします。そして、Person モデルが自動的に使える
（データベースの 'people' テーブルに自動的に接続される）ようになり、表示されることになります。
必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

さて、これで CakePHP の基本について一通り理解できました。物事がどう組み合わせられるかを確かめるために、
:doc:`/tutorials-and-examples/bookmarks/intro` を体験することができるでしょう。


.. meta::
    :title lang=ja: CakePHP Conventions
    :keywords lang=ja: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers

