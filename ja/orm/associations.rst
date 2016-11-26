アソシエーション - モデル同士を繋ぐ
###################################

アプリケーション中で、異なるオブジェクト同士の関連を定義することは よくあることです。
例えば、記事は多くのコメントを持っていて著者に属しています。
著者は多くの記事とコメントを持っています。 CakePHP はこうしたアソシエーションの管理を
簡単にします。CakePHP には４つのアソシエーションがあります。
hasOne 、 hasMany 、 belongsTo 、そして belongsToMany です。

============= ===================== =========================================
関係          アソシエーション種別  例
============= ===================== =========================================
１ 対 １      hasOne                ユーザは１つのプロフィールを持っている。
------------- --------------------- -----------------------------------------
１ 対 多      hasMany               ユーザは複数の記事を持つことができる。
------------- --------------------- -----------------------------------------
多 対 １      belongsTo             多くの記事がユーザに属している。
------------- --------------------- -----------------------------------------
多 対 多      belongsToMany         タグは多くの記事に属している。
============= ===================== =========================================

アソシエーションはテーブルオブジェクトの ``initialize()`` の中で定義されます。
アソシエーション種別に合ったメソッドでアプリケーション中のアソシエーションを
定義することができます。例えば、 ArticlesTable 中で belongsTo アソシエーションを
定義したいのであれば次にようにします。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors');
        }

    }


アソシエーションの設定の最も単純な形式では、関連付けたいテーブルのエイリアスを受け取ります。
既定ではアソシエーションの細目は CakePHP の規約に従います。
もしアソシエーションの扱われ方をカスタマイズしたい場合には、第二パラメータで
それを行うことができます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'propertyName' => 'person'
            ]);
        }

    }

同一のテーブルを、異なるアソシエーションの種別を定義するために複数回使うこともできます。
例えば、承認されたコメントとまだ検閲されていないものを分けたい場合を考えてみましょう。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'className' => 'Comments',
                'conditions' => ['approved' => true]
            ]);

            $this->hasMany('UnapprovedComments', [
                'className' => 'Comments',
                'conditions' => ['approved' => false],
                'propertyName' => 'unapproved_comments'
            ]);
        }
    }

ご覧のとおり、 ``className`` キーを指定することで、同一のテーブルの異なるアソシエーション
のために同一のテーブルを使うことができます。親子関係を作成するために
自己結合のテーブルを作成することもできます。 ::

    class CategoriesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('SubCategories', [
                'className' => 'Categories',
            ]);

            $this->belongsTo('ParentCategories', [
                'className' => 'Categories',
            ]);
        }
    }


アソシエーション種別で索引されたテーブル名のセットを含む配列を引数として受け取る
``Table::addAssociations()`` を一度呼ぶことで、まとめてアソシエーションを
設定することもできます。 ::

    class PostsTable extends Table
    {

      public function initialize(array $config)
      {
        $this->addAssociations([
          'belongsTo' => [
            'Users' => ['className' => 'App\Model\Table\UsersTable']
          ],
          'hasMany' => ['Comments'],
          'belongsToMany' => ['Tags']
        ]);
      }

    }

各アソシエーション種別は、そのエイリアスがキーで、値がアソシエーション設定データになった
複数のアソシエーションを受け取ることができます。もし数値キーが使用された場合は
値がアソシエーションのエイリアスとして扱われます。

hasOne アソシエーション
=======================

Users テーブルを Addresses テーブルが hasOne の関係になるように設定してみましょう。

まず、データベースのテーブルに正しくキーを付ける必要があります。 hasOne の関係を築くには、
一方のテーブルが他方のテーブルのレコードを参照する外部キーを持つ必要があります。
この場合では addresses テーブルが ``user_id`` というフィールドを持ちます。
基本的なパターンは次の通りです。

**hasOne:** *相手側の* モデルが外部キーを持ちます。

====================== ==================
関係                   スキーマ
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    CakePHP の規約に従うことは必須ではなく、アソシエーションの定義では任意の外部キーを
    使用するように上書きすることできます。それでも規約に従うとコードの繰り返しを少なくし、
    読みやすく、そしてメンテナンスしやすくすることができます。

``UsersTable`` と ``AddressesTable`` クラスを作成したら、次のコードで
アソシエーションを作ることができます。 ::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses');
        }
    }

もしさらなる制御が必要であれば、配列構文を使ってアソシエーションを定義することができます。
例えば、特定のレコードのみを含むようにアソシエーションを制限したい場合は次のようにします。 ::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses', [
                'className' => 'Addresses',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }


hasOne アソシエーションの配列で可能なキーは以下の通りです。

- **className**: 当該のモデルに関連付けられるモデルのクラス名。 'User hasOne Address'
  の関係を定義したい場合、 className キーは 'Addresses' になるはずです。
- **foreignKey**: 相手側のテーブル上の外部キーの名前。これは複数の hasOne の関係を
  定義する必要がある場合に特に便利です。このキーの既定値は当該のモデルの名前を
  アンダースコアで区切り、単数形にして '\_id' を末尾に付けたものです。
  上の例では 'user\_id' が既定になります。
- **bindingKey**: ``foreignKey`` での紐付けに使用される、当該のテーブルのカラム名。
  指定されなかった場合、主キー（例えば ``Users`` テーブルの id カラム）が使われます。
- **conditions**: ``['Addresses.primary' => true]`` のような find()
  互換の条件の配列です。
- **joinType**: SQL クエリで使われる結合の種別で、既定は LEFT です。
  もし hasOne アソシエーションが常にあれば INNER を使うことができます。
- **dependent**: dependent キーが ``true`` に設定され、そしてエンティティが削除された場合、
  関連付けられたモデルのレコードも削除されます。この例では User を削除した時に
  関連付けられた Address も削除されるようにしたければ ``true`` にします。
- **cascadeCallbacks**: これと **dependent** が ``true`` の時には、カスケード削除は
  コールバックが正しく呼ばれるように、エンティティを読み出して削除します。
  ``false`` の時には、関連付けられたデータを削除するために ``deleteAll()`` が使われ
  コールバックは呼ばれません。
- **propertyName**: 関連付けられたテーブルからソースのテーブルの結果にデータを埋める際の
  プロパティ名。既定は、アソシエーションの名前をアンダースコアで区切り、
  単数形にしたもので、よって例では ``address`` です。
- **strategy**: クエリで使うためのストラテジを定義します。既定は 'join' です。
  他の有効な値は 'select' で、これは代わりに別のクエリを使用します。
- **finder**: 関連付けられたレコードを読み込む時に使われるファインダメソッドです。

このアソシエーションが定義された後は、 Users テーブルの検索操作で、もし Address
のレコードが存在すればそれを含むことができます。 ::

    // コントローラまたはテーブルのメソッドの中で
    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
   }

上記は次のような SQL を実行します。 ::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

belongsTo アソシエーション
==========================

ここまでで、 Users テーブルから Address データにアクセスできるようになりました。
次は Address テーブルから関連する User データにアクセスできるように、
belongsTo アソシエーションを定義しましょう。belongsTo アソシエーションは
hasOne や hasMany の自然な補完です。

データベースのテーブルに belongsTo の関係のためにキーを作る時には、
次の規約に従ってください。

**belongsTo:** *当該の* モデルが外部キーを持ちます。

========================= ==================
関係                      スキーマ
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    あるテーブルが外部キーを持っている場合、それは他のテーブルに属しています。

次のようにして Addresses テーブルに belongsTo アソシエーションを定義することができます。 ::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users');
        }
    }

配列構文を使って、より詳細な関係を定義することができます。 ::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users', [
                'foreignKey' => 'user_id',
                'joinType' => 'INNER',
            ]);
        }
    }

belongsTo アソシエーションの配列で可能なキーは以下の通りです。

- **className**: 当該のモデルに関連付けられるモデルのクラス名。 'Profile belongsTo User'
  の関係を定義したい場合、 className キーは 'Users' になるはずです。
- **foreignKey**: 当該のテーブル上の外部キーの名前。これは同一のモデルに対して複数の
  belongsTo 関係を定義する必要がある場合に特に便利です。このキーの既定値は
  相手側のモデルの名前をアンダースコアで区切り、単数形にして ``_id`` を末尾に付けたものです。
- **bindingKey**: ``foreignKey`` での紐付けで使用される、相手側のテーブルのカラム名。
  指定されなかった場合、主キー（例えば ``Users`` テーブルの id カラム）が使われます。
- **conditions**: ``['Users.active' => true]`` のような find() 互換の条件の配列、
  または SQL 文字列です。
- **joinType**: SQL クエリで使われる結合の種別で、既定は LEFT であり、これは
  すべての状況で要求を満たすとは限らず、メインおよび関連付けられたモデル一式を返すか
  あるいは何も返さないようにしたい場合には INNER が便利です。
- **propertyName**: 関連付けられたテーブルからソースのテーブルの結果にデータを埋める際の
  プロパティ名。既定は、アソシエーションの名前をアンダースコアで区切り、
  単数形にしたもので、よって例では ``user`` です。
- **strategy**: クエリで使うためのストラテジを定義します。既定は 'join' です。
  他の有効な値は 'select' で、これは代わりに別のクエリを使用します。
- **finder**: 関連付けられたレコードを読み込む時に使われるファインダメソッドです。

このアソシエーションが定義された後は、 Addresses テーブルの検索操作で、もし User
のレコードが存在すればそれを含むことができます。 ::

    // コントローラまたはテーブルのメソッドの中で
    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

上記は次のような SQL を実行します。 ::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


hasMany アソシエーション
========================

hasMany アソシエーションの一例は "Article hasMany Comments" （記事が多くのコメントを持つ）
です。このアソシエーションを定義することで、記事が読み出される時に
そのコメントと一緒に記事を取得することができるようになります。

hasMany の関係のためにテーブルを作成する場合には、この規約に従ってください。

**hasMany:** *相手側の* モデルが外部キーを持つ。

========================== ===================
関係                       スキーマ
========================== ===================
Article hasMany Comment    Comment.article\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Patient     Patient.doctor\_id
========================== ===================

Articles モデルの中で、 hasMany アソシエーションを次のように定義することができます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments');
        }
    }

配列構文を使って、より詳細な関係を定義することができます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'foreignKey' => 'article_id',
                'dependent' => true,
            ]);
        }
    }

時にはアソシエーションで複合キーを設定したいかもしれません。 ::

    // ArticlesTable::initialize() の呼び出しの中で
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ]
    ]);

上記の例の通りに、必要な複合キーを含む配列を ``foreignKey`` に渡しました。
既定では、 ``bindingKey`` は ``id`` および ``hash`` としてそれぞれ自動的に定義されますが、
既定とは異なる紐付けフィールドを指定する必要があれば、次のようにして ``bindingKeys``
配列を手動で設定することができます。 ::

    // ArticlesTable::initialize() の呼び出しの中で
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ],
        'bindingKey' => [
            'whatever_id',
            'whatever_hash'
        ]
    ]);

``foreignKey`` の値が **reviews** テーブルを参照し ``bindingKey`` の値が
**articles** テーブルを参照することに注意することは大切です。

hasMany アソシエーションの配列で可能なキーは以下の通りです。

- **className**: 当該のモデルに関連付けられるモデルのクラス名。 'User hasMany Comment'
  の関係を定義したい場合、 className キーは 'Comments' になるはずです。
- **foreignKey**: 相手側のテーブル上の外部キーの名前。これは複数の hasMany の関係を
  定義する必要がある場合に特に便利です。このキーの既定値は当該のモデルの名前を
  アンダースコアで区切り、単数形にして '\_id' を末尾に付けたものです。
- **bindingKey**: ``foreignKey`` での紐付けに使用される、当該のテーブルのカラム名。
  指定されなかった場合、主キー（例えば ``Articles`` テーブルの id カラム）が使われます。
- **conditions**: ``['Comments.visible' => true]`` のような find() 互換の条件の配列、
  または SQL 文字列です。
- **sort**  ``['Comments.created' => 'ASC']`` のような find() 互換の order 句の配列、
  または SQL 文字列です。
- **dependent**: dependent が ``true`` に設定されている場合、再帰的なモデル削除が可能です。
  この例では Article レコードを削除した時に Comment レコードが削除されます。
- **cascadeCallbacks**: これと **dependent** が ``true`` の時には、カスケード削除は
  コールバックが正しく呼ばれるように、エンティティを読み出して削除します。
  ``false`` の時には、関連付けられたデータを削除するために ``deleteAll()`` が使われ
  コールバックは呼ばれません。
- **propertyName**: 関連付けられたテーブルからソースのテーブルの結果にデータを埋める際の
  プロパティ名。既定は、アソシエーションの名前をアンダースコアで区切り、
  複数形にしたもので、よって例では ``comments`` です。
- **strategy**: クエリで使うためのストラテジを定義します。既定は 'select' です。
  他の有効な値は 'subquery' で、これは ``IN`` のリストを等価のサブクエリに置き換えます。
- **saveStrategy**: 'append' または 'replace' のいずれかです。 'append' の場合
  当該のレコードがデータベース中のレコードに追加されます。 'replace' の場合
  関連付けられたレコードで当該のセットにないものは削除されます。もし外部キーが null
  になれるカラムの場合、または ``dependent`` が真の場合、レコードは親を持たなくなります。
- **finder**: 関連付けられたレコードを読み込む時に使われるファインダメソッドです。

このアソシエーションが定義された後は、 Articles テーブルの検索操作で、もし Comment
のレコードが存在すればそれを含むことができます。 ::

    // コントローラまたはテーブルのメソッドの中で
    $query = $articles->find('all')->contain(['Comments']);
    foreach ($query as $article) {
        echo $article->comments[0]->text;
    }

上記は次のような SQL を実行します。 ::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);

サブクエリのストラテジが使われた時は、次のような SQL が生成されます。 ::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);

hasMany アソシエーションにおいて件数をキャッシュしたいかもしれません。
これは関連付けられたレコードの数をしばしば表示する必要があるものの、
それらを数えるためだけに全レコードを読み出したくはない時に便利です。
例えば、何らかの記事についてのコメント数は、記事の一覧をより効率に
生成できるようにするためにしばしばキャッシュされます。
関連付けられたレコードの数をキャッシュするには :doc:`CounterCacheBehavior
</orm/behaviors/counter-cache>` を使用することができます。

データベースには、アソシエーションのプロパティ名と一致するカラムを
持たせないようにすべきです。もし例えば、アソシエーションのプロパティ名と衝突する
件数フィールドを持っている場合、アソシエーションのプロパティ、またはカラム名の
いずれかの名前を変更しなければなりません。

belongsToMany アソシエーション
==============================

belongsToMany アソシエーションの一例は "Article belongsToMany Tags"
(記事が多くのタグに属する) で、一つの記事のタグがほかの記事によって共有される場合です。
belongsToMany はしばしば "has and belongs to many" （多くを持ち、多くに属する）
とも呼ばれ、これは多対多アソシエーションの典型です。

hasMany と belongsToMany の主な違いは belonsToMany アソシエーションでのモデル間の紐付けが
排他的ではないことです。例えば、 Articles テーブルに Tags テーブルを結合するとします。
'笑える' を Article の Tag にすることは、そのタグを使い果たしません。
次に書く記事にもそれを使うことができます。

belongsToMany アソシエーションでは三つのデータベーステーブルが必要です。
上記の例では、 ``articles`` 、 ``tags`` および ``articles_tags`` が必要です。
``articles_tags`` テーブルは tags と articles を紐付けるデータを一緒に持っています。
結合テーブルは、関連する二つのテーブルの名前に基づいており、規約によってアンダースコアで
区切られています。その最も単純な形式では、このテーブルは ``article_id`` と ``tag_id``
で構成されます。

**belongsToMany** は両方の *モデル* の名前を持つ別のテーブルが必要です。

============================ ================================================================
関係                         結合テーブルのフィールド
============================ ================================================================
Article belongsToMany Tag    articles_tags.id, articles_tags.tag_id, articles_tags.article_id
---------------------------- ----------------------------------------------------------------
Patient belongsToMany Doctor doctors_patients.id, doctors_patients.doctor_id,
                             doctors_patients.patient_id.
============================ ================================================================

次のようにして 両方のモデルの中で belongsTo アソシエーションを定義することができます。 ::

    // src/Model/Table/ArticlesTable.php の中で
    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags');
        }
    }

    // src/Model/Table/TagsTable.php の中で
    class TagsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Articles');
        }
    }

配列構文を使って、より詳細な関係を定義することができます。 ::

    // src/Model/Table/ArticlesTable.php の中で
    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

    // src/Model/Table/TagsTable.php の中で
    class TagsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Articles', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

belongsToMany アソシエーションの配列で可能なキーは以下の通りです。

- **className**: 当該のモデルに関連付けられるモデルのクラス名。
  'Article belongsToMany Tag' の関係を定義したい場合、 className キーは 'Tags'
  になるはずです。
- **joinTable**: このアソシエーションで使われる結合テーブルの名前
  （当該のテーブルが belongsToMany 結合テーブルの命名規約に準拠していない場合）。
  既定では、結合テーブル用の Table インスタンスを読み出すためにこの名前が使われます。
- **foreignKey**: 当該のテーブル上の外部キーの名前、または複合外部キーの場合はリスト。
  これは複数の belongsToMany の関係を定義する必要がある場合に特に便利です。
  このキーの既定値は当該のモデルの名前をアンダースコアで区切り、単数形にして '\_id'
  を末尾に付けたものです。
- **bindingKey**: ``foreignKey`` での紐付けに使用される、当該のテーブルのカラム名。
  既定ではその主キーです。
- **targetForeignKey**:  対象テーブル上の外部キーの名前、または複合外部キーの場合はリスト。
  このキーの既定値は当該のモデルの名前をアンダースコアで区切り、単数形にして '\_id'
  を末尾に付けたものです。
- **conditions**: find() 互換の条件の配列、または SQL 文字列です。
  関連付けられたテーブル上に条件を持つには、 'through' モデルを使用し、
  それに必要な belongsTo アソシエーションを定義してください。
- **sort** find() 互換の order 句の配列。
- **dependent**: dependent キーが ``false`` に設定され、そしてエンティティが削除された場合、
  結合テーブルのデータは削除されません。
- **through** 結合テーブルで使用する Table インスタンスの名前、またはインスタンス自体の
  いずれかを指定できます。これにより、結合テーブルのキーのカスタマイズが可能になり、
  そして結合テーブルの動作をカスタマイズすることができます。
- **cascadeCallbacks**: これが ``true`` の時には、カスケード削除は結合テーブル上の
  コールバックが正しく呼ばれるように、エンティティを読み出して削除します。
  ``false`` の時には、関連付けられたデータを削除するために ``deleteAll()`` が使われ
  コールバックは呼ばれません。これはオーバーヘッドの削減を助けるために
  既定では ``false`` になります。
- **propertyName**: 関連付けられたテーブルからソースのテーブルの結果にデータを埋める際の
  プロパティ名。既定は、アソシエーションの名前をアンダースコアで区切り、
  複数形にしたもので、よって例では ``tags`` です。
- **strategy**: クエリで使うためのストラテジを定義します。既定は 'select' です。
  他の有効な値は 'subquery' で、これは ``IN`` のリストを等価のサブクエリに置き換えます。
- **saveStrategy**: 'append' または 'replace' のいずれかです。 既定は 'replace' です。
  関連するエンティティの保存に使用するモードを示します。前者はリレーションの両側の間に
  新しい紐付けを作成するだけで、後者は保存する時に渡されたエンティティの間に
  紐付けを作成するために消去と置換を行います。
- **finder**: 関連付けられたレコードを読み込む時に使われるファインダメソッドです。


このアソシエーションが定義された後は、 Articles テーブルの検索操作で、もし Tag
のレコードが存在すればそれを含むことができます。 ::

    // コントローラまたはテーブルのメソッドの中で
    $query = $articles->find('all')->contain(['Tags']);
    foreach ($query as $article) {
        echo $article->tags[0]->text;
    }

上記は次のような SQL を実行します。 ::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (1, 2, 3, 4, 5)
    );

サブクエリのストラテジが使われた時は、次のような SQL が生成されます。 ::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (SELECT id FROM articles)
    );

.. _using-the-through-option:

'through' オプションの使用
--------------------------

もし結合テーブルに追加の情報を持たせようとしている場合、あるいはもし規約から外れる
結合カラムを使用する必要がある場合、 ``through`` オプションを定義する必要があります。
``through`` オプションは belongsToMany アソシエーションがどのように作られるかを
完全に制御できるようにします。

時には多対多アソシエーションで追加のデータを保存するのが望ましいことがあります。
以下を考えてみてください。 ::

    Student BelongsToMany Course
    Course BelongsToMany Student

Student は多くの Courses を取っていて、 Course は多くの Student に取られています。
これは単純な多対多のアソシエーションです。次のようなテーブルがあれば事足ります。 ::

    id | student_id | course_id

では、生徒が授業に出席した日数や成績を保存したい場合はどうでしょう？
欲しいテーブルは次のようになります。 ::

    id | student_id | course_id | days_attended | grade

この要件を実装する方法は **モデルの結合** 、もしくは **hasMany through** アソシエーション
を使うことです。これは、このアソシエーション自身がモデルになります。つまり、新しい
CoursesMemberships モデルを作ればよいのです。以下のモデルを見てください。 ::

    class StudentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

CoursesMemberships 結合テーブルは、追加のメタ情報に加えて、与えられた Student が Course
に参加しているかどうかを一意に識別します。

既定のアソシエーションの条件
----------------------------

``finder`` オプションは、関連付けられたレコードのデータを読み出すために
:ref:`カスタムファインダ <custom-find-methods>` を使えるようにします。
これはクエリをよりカプセル化し、コードをより DRY にします。
join (belongsTo/hasOne) を使って読み出されるアソシエーションのデータを読み出すために
ファインダを使う場合、いくつかの制限があります。クエリの次の部分だけが
ルートクエリに適用されます。

- WHERE 条件
- 追加の join
- contain されたアソシエーション

他のクエリの部分、例えば select されるカラム、 order 、 group by 、 having
そして、その他のサブステートメントについては、ルートクエリには適用されません。
join によって *読み出されない* アソシエーション (hasMany/belongsToMany) には、
上記の制約は持たず、結果のフォーマッターや map/reduce 機能を使うこともできます。

アソシエーションの読み出し
--------------------------

アソシエーションを定義したら、結果を取得する時に :ref:`アソシエーションのイーガーロード
<eager-loading-associations>` ができるようになります。
