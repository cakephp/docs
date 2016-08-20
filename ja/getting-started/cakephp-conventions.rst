CakePHP の規約
##############

私たちは「設定より規約」(*convention over configuration*)という考え方に賛成です。
CakePHP の規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。
規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも
開放されます。規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすく
なります。

CakePHP の規約は長年のウェブ開発経験とベストプラクティスを精錬したものです。CakePHP での開発には
これらの規約の利用をお勧めしますが、特に既存システムと作業しなければいけない場合などのために、条項の
大部分は独自設定できる、という点も述べておきましょう。

コントローラの規約
==================

コントローラのクラス名は複数形でキャメル記法で、最後に ``Controller`` が付きます。
``PeopleController`` 、 ``LatestArticlesController`` は規約に合ったコントローラ名の例となります。

コントローラに最初に書くメソッドは、おそらく ``index()`` メソッドでしょう。
リクエストによってコントローラは指定されたがアクションは指定されなかったという場合、CakePHP の
デフォルト動作では、そのコントローラの ``index()`` メソッドを実行することになっています。
例えば、 http://www.example.com/apples/ へのリクエストは ``ApplesController`` の
``index()`` メソッドを呼ぶようにマップされ、 http://www.example.com/apples/view/ は、
``ApplesController`` の ``view()`` メソッドにマップされます。

コントローラ関数名の先頭にアンダースコア（\_）を付けることで、CakePHP のコントローラメソッドを
隠蔽することが可能です。アンダースコアが付けられたコントローラメソッドはウェブ上では見えないように
設定され、内部での利用のみ可能になります。例えば::

    class NewsController extends AppController {

        public function latest() {
            $this->_findNewArticles();
        }

        protected function _findNewArticles() {
            // 最新のニュース記事を取得するロジック
        }
    }


http://www.example.com/news/latest/ のページにユーザーがアクセス可能であっても、
http://www.example.com/news/\_findNewArticles/ を取得しようとするとエラーになるでしょう。
なぜなら、メソッドの先頭にアンダースコアが付いているからです。
メソッドが URL からアクセスできるかどうかを、PHP のアクセス権キーワードを使って指示することもできます。
public でないメソッドはアクセスできません。

コントローラ名と URL
~~~~~~~~~~~~~~~~~~~~

前節の通り、ひとつの単語からなる名前のコントローラは、簡単に小文字の URL パスにマップできます。
例えば、 ``ApplesController`` （ファイル名は 'ApplesController.php'）には、
http://example.com/apples としてアクセスできます。

複数の単語からなる名前のコントローラは、コントローラ名と等価になるようなさまざまな形式が
*考えられます* 。つまり:


-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

は全て、 RedApples コントローラの index アクションとして解決されます。
しかしながら、 URL は小文字とアンダースコアを用いるというのが規約であり、
``RedApplesController::go_pick`` アクションにアクセスするための正しい形式は
/red\_apples/go\_pick となります。

CakePHP の URL とパラメータの取り扱いに関するより詳細な情報は、
:ref:`routes-configuration` をご覧ください。もし ``/webroot`` ディレクトリ中に、
ルーティングやコントローラと同じ名前を持つファイルやディレクトリがある場合、
コントローラではなく、そのディレクトリやファイルが参照されます。

.. _file-and-classname-conventions:

ファイルとクラス名の規約
========================

通常、ファイル名はクラス名にマッチしたものになり、キャメルケースとなります。
従って、CakePHP で **MyNiftyClass** というクラスがあれば、ファイルは
**MyNiftyClass.php** と命名されるでしょう。以下に CakePHP のアプリケーションで
典型的に使うであろう種々のクラス毎のファイルにどう命名するかの例を挙げます:

-  **KissesAndHugsController** というコントローラのクラスは、
   **KissesAndHugsController.php** という名前にします。
-  **MyHandyComponent** というコンポーネントのクラスは、
   **MyHandyComponent.php** というファイル名にします。
-  **OptionValue** というモデルのクラスは、
   **OptionValue.php** というファイル名にします。
-  **EspeciallyFunkableBehavior** というビヘイビアのクラスは、
   **EspeciallyFunkableBehavior.php** というファイル名にします。
-  **SuperSimpleView** というビューのクラスは、
   **SuperSimpleView.php** というファイル名にします。
-  **BestEverHelper** というヘルパーのクラスは、
   **BestEverHelper.php** というファイル名にします。

各ファイルは、 app フォルダ内のそれぞれ適切なフォルダの中に配置します。

モデルとデータベースの規約
==========================

モデルのクラス名は単数形でキャメル記法です。
Person、BigPerson、ReallyBigPerson などは規約に合ったモデル名です。

CakePHP のモデルに対応するテーブル名は、複数形でアンダースコア記法です。上記の例で言えば、
テーブル名はそれぞれ、 ``people`` 、 ``big_people`` 、 ``really_big_people`` になります。

ユーティリティライブラリの :php:class:`Inflector` を使って、単語の単数形・複数形を判定することが
できます。より詳しい情報は、 :doc:`/core-utility-libraries/inflector` をご覧ください。

二個以上の単語で構成されるフィールドの名前は、 first\_name のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne 中の外部キーは、デフォルトで関連するモデルの (単数形の) 名前に
\_id を付けたものとして認識されます。ケーキ職人がケーキを複数持っている (**Bakers hasMany Cakes**)
としたら、cakes テーブルは、baker\_id を外部キーとして bakers テーブルのデータを
参照します。categoly\_types のような複数の単語のテーブルでは、外部キーは
categoty\_type\_id のようになるでしょう。

モデル間の hasAndBelongsToMany (HABTM) の関係で使用される join テーブルは、
結合するモデルテーブルに合わせて名づけられなければなりません。例えば、
"users HABTM groups" は、 groups_users によって結合し、
アルファベット順に並べた名前にしてください。例えば、 zoos\_apes よりも
apes\_zoos の方が好ましいです。

CakePHP モデルの相互に作用する全てのテーブル (join テーブルは除く) は、それぞれの列を
一意に識別する単一フィールドのプライマリーキーが必要です。単一のプライマリーキーを持たないテーブルを
モデリングする場合、テーブルに単一フィールドのプライマリーキーを追加することが CakePHP の規約です。
このようなテーブルのモデルを使いたい場合は、単一フィールドのプライマリーキーを追加する必要があります。

もし、プライマリーキーの名前が ``id`` 以外の場合、 ``Model.primaryKey`` をセットしてください。

CakePHP は複合主キーをサポートしません。join テーブルのデータを直接操作したい場合は、直接
:ref:`query <model-query>` を呼び出すか、通常のモデルのように振舞えるよう主キーを追加してください。
例は次のようになります::

    CREATE TABLE posts_tags (
        id INT(10) NOT NULL AUTO_INCREMENT,
        post_id INT(10) NOT NULL,
        tag_id INT(10) NOT NULL,
        PRIMARY KEY(id)
    );

また、主キーをオートインクリメントとしてではなく、char(36) として使用しても構いません。
そうすると、Model::save メソッドを使って新規レコードを保存するとき、CakePHP はユニークな
36文字の UUID (String::uuid) を用いようとします。

ビューの規約
============

ビューのテンプレートファイルは、それを表示するコントローラの関数に合わせた、アンダースコア記法で
名前が付きます。PeopleController クラスの getReady() 関数は、ビューテンプレートとして、
/app/views/people/get\_ready.ctp を探すことになります。

基本パターンは、 /app/views/コントローラ名/アンダースコア記法\_関数名.ctp です。

各部分を CakePHP の規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても
機能的に動作するようになります。以下が最後の規約に合った命名の例です:

-  データベースのテーブル： "people"
-  モデルクラス： "Person"、 場所は /app/Model/Person.php
-  コントローラクラス： "PeopleController"、 場所は
   /app/Controller/PeopleController.php
-  ビューのテンプレート、場所は /app/View/People/index.ctp

これらの規約により、 CakePHP は http://example.com/people/ へのリクエストを、
PeopleController の index() 関数にマップします。そして、Person モデルが自動的に使える
（データベースの 'people' テーブルに自動的に接続される）ようになり、表示されることになります。
必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

さて、これで CakePHP の基本について一通り理解できました。物事がどう組み合わせられるかを確かめるために、
:doc:`/tutorials-and-examples/blog/blog` を体験することができるでしょう。


.. meta::
    :title lang=ja: CakePHP Conventions
    :keywords lang=ja: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
