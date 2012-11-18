CakePHPの規約
#############

私たちは「設定より規約」（convention over
configuration）という考え方に賛成です。CakePHPの規約を習得するには少し時間がかかりますが、長い目で見ると時間を節約していることになります。規約に従うと自由に使える機能が増えますし、設定ファイルを調べまわってメンテナンスするという悪夢からも開放されます。規約によって開発が統一感を持つため、開発者が加わってすぐに手伝うということがやりやすくなります。

CakePHPの規約は長年のweb開発経験とベストプラクティスを精錬したものです。CakePHPでの開発にはこれらの規約の利用をお勧めしますが、特に既存システムと作業しなければいけない場合などのために、条項の大部分は独自設定できる、という点も述べておきましょう。

ファイルとクラス名の規約
========================

通常、ファイル名はアンダースコア記法（underscored）を使い、クラス名にはキャメル記法（CamelCased）を使います。すなわち、
Cake において **MyNiftyClass** というクラスを用いるには、ファイル名を
**my\_nifty\_class.php** というようにします。次の例で、 CakePHP
アプリケーションで典型的に利用する異なるタイプのクラスを、それぞれどのように命名するのか示します。

-  **KissesAndHugsController** というコントローラのクラスは、
   **kisses\_and\_hugs\_controller.php**
   というファイル名にします(「\_controller」がファイル名に含まれることに注意してください)。
-  **MyHandyComponent** というコンポーネントのクラスは、
   **my\_handy.php** というファイル名にします。
-  **OptionValue** というモデルのクラスは、 **option\_value.php**
   というファイル名にします。
-  **EspeciallyFunkableBehavior** というビヘイビアのクラスは、
   **especially\_funkable.php** というファイル名にします。
-  **SuperSimpleView** というビューのクラスは、 **super\_simple.php**
   というファイル名にします。
-  **BestEverHelper** というヘルパーのクラスは、 **best\_ever.php**
   というファイル名にします。

各ファイルは、 app
フォルダ内のそれぞれ適切なフォルダの中かその下(サブフォルダも可)に設置します。

モデルとデータベースの規約
==========================

モデルのクラス名は単数形でキャメル記法です。Person、BigPerson、ReallyBigPerson
などは規約に合ったモデル名です。

CakePHP
のモデルに対応するテーブル名は、複数形でアンダースコア記法です。上記の例で言えば、テーブル名はそれぞれ、people、big\_people、really\_big\_peopleになります。

ユーティリティライブラリの「Inflector」を使って、単語の単数形・複数形を判定することができます。更なる情報は、\ `Inflectorのドキュメント </ja/view/1478/Inflector>`_\ を読んでください。

二個以上の単語で構成されるフィールドの名前は、 first\_name
のようにアンダースコア記法になります。

hasMany, blongsTo, hasOne
中の外部キーは、デフォルトで関連するモデルの(単数形の)名前に \_id
を付けたものとして認識されます。ケーキ職人(Backer)がケーキ(Cake)を複数持っている(hasMany)としたら、cakes
テーブルは、baker\_id を外部キーとして bakers
テーブルのデータを参照します。categoly\_types
のような複数の単語のテーブルでは、外部キーは categoty\_type\_id
のようになるでしょう。 For a multiple worded table like category\_types,
the foreign key would be category\_type\_id.

モデル間の hasAndBelongsToMany (HABTM) の関係で使用される join
テーブルは、join
するテーブルに合わせて、アルファベット順に（zebras\_apples
ではなく、apples\_zebras）並べた名前にしてください。

CakePHP モデルの相互に作用する全てのテーブル(join
テーブルは除く)は、それぞれの列を一意に識別する単一フィールドのプライマリーキーが必要です。もし、単数形のプライマリーキーではないテーブルのモデルをお望みなら、テーブルに単一フィールドのプライマリーキーを追加することが
CakePHP
の規約です。このようなテーブルのモデルを使いたい場合は、単一フィールドのプライマリーキーを追加する必要があります。

CakePHP は複合主キーをサポートしません。 join
テーブルのデータを直接操作したい場合は、直接
`query </ja/view/1027/query>`_
を呼び出すか、通常のモデルのように振舞えるよう主キーを追加してください。例は次のようになります。

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id));

また、主キーをオートインクリメントとしてではなく、char(36)として使用しても構いません。そうすると、Model::save
メソッドを使って新規レコードを保存するとき、Cakeはユニークな36文字のuuid
(String::uuid) を用いようとします。

コントローラの規約
==================

コントローラのクラス名は複数形でキャメル記法です。最後に\ ``Controller``\ が付きます。\ ``PeopleController``\ 、\ ``BigPeopleController``\ 、\ ``ReallyBigPeopleController``\ などは規約に合ったコントローラ名です。

コントローラに最初に書くメソッドは、おそらく\ ``index()``\ メソッドでしょう。リクエストによってコントローラは指定されたがアクションは指定されなかったという場合、CakePHP
のデフォルト動作では、そのコントローラの\ ``index()``\ メソッドを実行することになっています。例えば、http://www.example.com/apples/
は\ ``ApplesController``\ の\ ``index()``\ メソッドを呼ぶようにマップされ、http://www.example.com/apples/view
は、\ ``ApplesController``\ の\ ``view()``\ メソッドにマップされます。

コントローラ関数名の先頭にアンダースコア（\_）を付けることで、CakePHP
のコントローラメソッドを隠蔽することが可能です。アンダースコアが付けられたコントローラメソッドは
web
上では見えないように設定されます。内部での利用のみ可能になります。例えば：

::

    <?php
    class NewsController extends AppController {

        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //最新のニュース記事を取得するロジック
        }
    }

    ?>

http://www.example.com/news/latest/
のページにユーザーがアクセス可能であっても、http://www.example.com/news/\_findNewArticles/
を取得しようとするとエラーになるでしょう。なぜなら、メソッドの先頭にアンダースコアが付いているからです。

コントローラ名とURL
-------------------

前節の通り、ひとつの単語からなる名前のコントローラは、簡単に小文字のURLパスにマップできます。例えば、\ ``ApplesController``\ （ファイル名は'apples\_controller.php'）には、http://example.com/apples
としてアクセスできます。

複数の単語からなる名前のコントローラは、コントローラ名と等価になるようなさまざまな形式が\ *考えられます*\ 。つまり、

-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

は全て、 RedApples コントローラの index
アクションとして解決されます。しかしながら、 URL
は小文字とアンダースコアを用いるというのが規約であり、\ ``RedApplesController::go_pick``
アクションにアクセスするための正しい形式は /red\_apples/go\_pick
となります。

CakePHP の URL とパラメータの取り扱いに関するより詳細な情報は、 `Routes
の設定 </ja/view/945/Routesの設定>`_ を参照してください。

ビューの規約
============

ビューのテンプレートファイルは、それを表示するコントローラの関数に合わせた、アンダースコア記法で名前が付きます。PeopleControllerクラスのgetReady()関数は、ビューテンプレートとして、/app/views/people/get\_ready.ctpを探すことになります。

基本パターンは、
/app/views/コントローラ名/アンダースコア記法\_関数名.ctpです。

各部分をCakePHPの規約に合わせて命名しておくことで、混乱を招く面倒な設定をしなくても機能的に動作するようになります。規約に合った命名の最後の例を示します。

-  データベースのテーブル： "people"
-  モデルクラス： "Person"、 場所は /app/models/person.php
-  コントローラクラス： "PeopleController"、 場所は
   /app/controllers/people\_controller.php
-  ビューのテンプレート、場所は /app/views/people/index.ctp

これらの規約により、CakePHPは、http://example.com/people/
へのリクエストを、PeopleControllerのindex()関数にマップします。そして、Personモデルが自動的に使える（データベースの'people'テーブルに自動的に接続される）ようになり、表示されることになります。必要なクラスとファイルを作成しただけでこれらの関係が設定されています。

さて、CakePHPの基本について一通り理解できたので、\ `CakePHPブログチュートリアル </ja/view/1528/blog>`_\ を試すのも良いでしょう。
