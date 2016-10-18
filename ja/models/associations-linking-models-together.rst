アソシエーション: モデル同士を繋ぐ
##################################

CakePHP のもっともパワフルな機能の1つはモデル間の関連をマッピングしてくれる
モデルの機能でしょう。CakePHP では、アソシエーションという機能を通じて
モデル間の繋がりを操作します。

アプリケーション中で、異なるオブジェクト同士の関連を定義することは
よくあることです。たとえばレシピのデータベースを例にとると、
レシピはたくさんのレビューを持っていて、そのレビューについては誰が
書いたのかというユーザー情報を持っています。そして、そのユーザーもまた
レシピを持っているでしょう。
これらの関連を定義することで、直感的にデータにアクセスすることが出来ます。

このセクションでは、モデル間のアソシエーションを考えて、定義して、そして
利用していく方法を説明していきます。

データは様々なソースから取得することができますが、ウェブアプリケーションで
最も一般的なストレージはリレーショナルデータベースでしょう。
そのため、ここではリレーショナルデータベースでの説明が主となります。

プラグインのモデルに関するアソシエーションについてはこちらを参照してください。
:ref:`plugin-models`

リレーションシップの種別
------------------------

CakePHP には4つのアソシエーションがあります。hasOne, hasMany,
belongsTo, そして hasAndBelongsToMany (HABTM) です。

================== ===================== ========================================
リレーションシップ アソシエーション名    例
================== ===================== ========================================
1 対 1             hasOne                ユーザーは1つのプロフィールを持っている
------------------ --------------------- ----------------------------------------
1 対 多            hasMany               ユーザーは複数のレシピを持っている
------------------ --------------------- ----------------------------------------
多 対 1            belongsTo             レシピはユーザーに属している
------------------ --------------------- ----------------------------------------
多 対 多           hasAndBelongsToMany   レシピは材料を持っており、かつ属している
================== ===================== ========================================

モデル中でのアソシエーションの定義を省略する方法をより明確にするには：
モデルのテーブルが外部キー (other_model_id) を含む場合、このモデルのリレーションの種別は
**必ず** OtherModel に **属している (belongsTo)** ことになります。


アソシエーションは、アソシエーション名のクラス変数を生成することで定義されます。
クラス変数の内容は単純な文字列でもいいですし、アソシエーションを具体的に定義するために
多次元の配列を使うこともできます。

::

    class User extends AppModel {
        public $hasOne = 'Profile';
        public $hasMany = array(
            'Recipe' => array(
                'className' => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order' => 'Recipe.created DESC'
            )
        );
    }

上記の例では、配列の最初の 'Recipe' は 'エイリアス(別名)' です。
これはリレーションシップを識別するためのもので、どんな文字列でもかまいません。
普通は、そのリレーションシップが参照するクラスと同じ名前をつけますが、
**各モデルのエイリアスはアプリケーション全体でユニークでなければなりません。**
たとえば次の例を見てください。これは正しい書き方です。 ::

    class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'MemberOf' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

しかし、以下の例はうまく動きません。 ::

    class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

これは HABTM アソシエーションに、User と Group の両モデルを参照している
'Member' というエイリアスがあるからです。アプリケーション全体で、
参照先が違うにもかかわらず同じエイリアスがあると、予期しない動作を
引き起こす原因となります。

CakePHP はアソシエーションを定義したモデルオブジェクト同士を自動的にリンクします。
たとえば、 ``User`` モデルの中では、以下のようにして ``Recipe`` モデルに
アクセスできます。 ::

    $this->Recipe->someFunction();

同じようにコントローラーでも、関連モデルに簡単にアクセスできます。 ::

    $this->User->Recipe->someFunction();

.. note::

    アソシエーションは '単方向' でしか定義されません。
    「User hasMany Recipe」というアソシエーションを定義しても、
    それは Recipe モデルに対してはなにも影響しません。
    Recipe モデルから User モデルにアクセスするためには、
    「Recipe belongsTo User」というアソシエーションを定義する必要があります。

hasOne
------

hasOne で Profile モデルを持っている User モデルを作ってみましょう。

まずはじめに、データベースのテーブルには正しくキーがつけられている必要があります。
hasOne リレーションを動作させるためには、 テーブルに外部キーを含ませます。
これはモデルのテーブル中でレコードを検索するときに使われます。今回の場合、
profiles テーブルには user\_id というフィールドを含ませます。基本的なパターンとしては

hasOne 用のテーブルは、以下の規約に従います。

**hasOne:** *アソシエーションに指定された* モデルが外部キーを含んでいます。

==================== ==================
リレーション         スキーマ
==================== ==================
Apple hasOne Banana  bananas.apple\_id
-------------------- ------------------
User hasOne Profile  profiles.user\_id
-------------------- ------------------
Doctor hasOne Mentor mentors.doctor\_id
==================== ==================

.. note::

    外部キーはアソシエーションの定義で上書きすることができるため、
    必ずしも CakePHP の規約に従っていなくても問題ありません。
    それでも規約に従っていれば、コードの可読性、メンテナンス性が高くなります。

User モデルは /app/Model/User.php にあります。
「User hasOne Profile」というアソシエーションを定義するには、User モデルの中で
$hasOne プロパティを追加します。ただし、Profile モデルが /app/Model/Profile.php に
ないと正常に動作しません。 ::

    class User extends AppModel {
        public $hasOne = 'Profile';
    }

モデルで hasOne リレーションシップを定義する方法は2つあります。
一番簡単な方法は上記のように、$hasOne プロパティに
アソシエーションモデルのクラス名の文字列を指定することです。

より詳細にアソシエーションを設定したければ、配列を使って定義することが
できます。たとえば、ある特定のレコードのみに絞ってアソシエーションを
定義したい場合は次のようにします。

::

    class User extends AppModel {
        public $hasOne = array(
            'Profile' => array(
                'className' => 'Profile',
                'conditions' => array('Profile.published' => '1'),
                'dependent' => true
            )
        );
    }

hasOne アソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 現在のモデルに関連付けられるモデルのクラス名。
   「User hasOne Profile」を定義したい場合、'Profile' となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。
   これは複数の hasOne を定義するためによく使われます。このキーのデフォルト値は
   現在のモデルの単数形に ``_id`` がついたものです。上記の User モデルの例では、
   ``user_id`` となります。
-  **conditions**: ``array('Profile.approved' => true)`` のような、find() に
   指定する conditions と互換性のある配列、もしくは SQL 文字列を指定します。
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。
   デフォルトで全フィールドが含まれます。
-  **order**: ``array('Profile.last_name' => 'ASC')`` のような、find() に
   指定する order と互換性のある配列、もしくは SQL 文字列を指定します。
-  **dependent**: このキーに ture がセットされていて、かつモデルの delete メソッドの
   cascade パラメータに true がセットされて呼び出された時、アソシエーション先のモデルの
   レコードも一緒に削除されます。User が削除されると、そのユーザーに
   関連する Profile も同時に削除したい場合にtureにします。

このアソシエーションを定義すれば、User モデルで find した時に、
関連する Profile が存在すればそのレコードも一緒に取得してくるようになります。 ::

    //$this->User->find() を呼び出した時の戻り値

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

ここまでで、User モデルから Profile にアクセスできるようになりました。
次は Profile モデルから関連する User モデルを取得できるように、
belongsTo アソシエーションを定義しましょう。
belongsTo は hasOne、hasMany アソシエーションと対になる
アソシエーションになります。
hasOne、hasMany とは逆方向からデータを参照することになります。

belongsTo 用のテーブルは、以下の規約に従います。

**belongsTo:** *現在の* モデルが外部キーを含んでいます。

======================= ==================
リレーション            スキーマ
======================= ==================
Banana belongsTo Apple  bananas.apple\_id
----------------------- ------------------
Profile belongsTo User  profiles.user\_id
----------------------- ------------------
Mentor belongsTo Doctor mentors.doctor\_id
======================= ==================

.. tip::

    あるテーブルが外部キーを含んでいれば、そのテーブルは外部キーの先の
    テーブルに属しているということになります。

Profile モデル (/app/Model/Profile.php) に文字列で belongsTo アソシエーションを
定義してみましょう。 ::

    class Profile extends AppModel {
        public $belongsTo = 'User';
    }

配列を使ってより詳しく設定することもできます。 ::

    class Profile extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            )
        );
    }

belongsTo アソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 現在のモデルに関連付けられるモデルのクラス名。
   「Profile belongsTo User」 を定義したい場合、'User' となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。
   これは複数の belongsTo を定義するためによく使われます。このキーのデフォルト値は
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **conditions**: ``array('User.active' => true)`` のような、find() に
   指定する conditions と互換性のある配列、もしくは SQL 文字列を指定します。
-  **type**: SQL クエリで使われるテーブル結合種別。外部キーにマッチするデータが
   必ずしも存在するとは限らないので、デフォルトでは 'LEFT' です。
   'INNER' は、(いつかの conditions で使われる時)
   現在のモデルとアソシエーション先のモデルのどちらもレコードが存在する時は
   どちらも取得して、アソシエーション先のモデルにレコードが存在しない時は
   どちらも取得しない、という時に使います。
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。
   デフォルトで全フィールドが含まれます。
-  **order**: ``array('User.username' => 'ASC')`` のような、 find() に
   指定する order と互換性のある配列、もしくは SQL 文字列を指定します。
-  **counterCache**: trueをセットすれば、アソシエーション先のモデルで
   ``save()`` または ``delete()`` を実行した時に、外部テーブルの
   "[モデル名の単数形]\_count" というフィールドの値を増減します。
   文字列を指定すれば、指定された文字列のフィールドに対してカウントの操作を行います。
   フィールドの値は、関連データの件数を表します。
   配列を定義することによって複数のカウンターキャッシュを指定することができます。
   :ref:`multiple-counterCache` をご覧ください。
-  **counterScope**: conterCache のフィールドを更新する際の追加条件があれば
   指定します。

このアソシエーションを定義すれば、Profile モデルで find した時に、
関連する User が存在すればそのレコードも一緒に取得してくるようになります。 ::

    //$this->Profile->find() を呼び出した時の戻り値

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

counterCache - count() 結果をキャッシュする
===========================================

この機能は、関連データの件数をキャッシュしてくれます。
``find('count')`` でデータ件数を取得する代わりに、
``$hasMany`` アソシエーションのモデルがデータの追加及び削除を追跡して、
データ件数を示すフィールドを増減してくれます。

フィールドの名前は以下のように、モデルの単数形にアンダースコアで
"count" をつなげます。 ::

    my_model_count

``ImageComment`` と ``Image`` というモデルを準備して、 ``images`` テーブルに
``image_comment_count`` という名前の INT フィールドを追加しましょう。

以下のサンプルを参考にしてください。

========== ======================= =========================================
モデル     アソシエーションモデル  サンプル
========== ======================= =========================================
User       Image                   users.image\_count
---------- ----------------------- -----------------------------------------
Image      ImageComment            images.image\_comment\_count
---------- ----------------------- -----------------------------------------
BlogEntry  BlogEntryComment        blog\_entries.blog\_entry\_comment\_count
========== ======================= =========================================

このカウンター用のフィールドを追加すれば準備完了です。
カウンターキャッシュ機能を有効にするためにアソシエーションの設定に
``counterCache`` キーに ``true`` をセットしましょう。 ::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
            )
        );
    }

これで、 ``Image`` に関連する ``ImageComment`` を追加もしくは削除するたびに、
件数が ``image_comment_count`` フィールドにセットされるようになります。

counterScope
============

``conterScope`` をセットすれば、カウンタ値の更新をする
(もしくは更新をしない、どういう見せ方をするかによります)
条件を指定することができます。

Image モデルのサンプルでは、次のようになるでしょう。 ::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => 'active_comment_count', //custom field name
                // only count if "ImageComment" is active = 1
                'counterScope' => array(
                  'ImageComment.active' => 1
                )
            )
        );
    }

.. _multiple-counterCache:

複数の counterCache
=====================

CakePHP は、 2.0 の時から単一のモデルのリレーション中に、複数の ``counterCache`` を持つことに
対応しています。それはまた、それぞれの ``counterCache`` のための ``counterScope`` の定義を
可能にします。 例えば、 ``User`` モデルと ``Message`` モデルを持っていて、
それぞれのユーザーごとにメッセージの未読と既読の数を集計したいと仮定します。

========= ====================== ===========================================
モデル     フィールド                  説明
========= ====================== ===========================================
User      users.messages\_read   ``Message`` 既読数
--------- ---------------------- -------------------------------------------
User      users.messages\_unread ``Message`` 未読数
--------- ---------------------- -------------------------------------------
Message   messages.is\_read      ``Message`` を読んだかどうかの判定
========= ====================== ===========================================

この構成での ``belongsTo`` は、以下のようになります::

    class Message extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'counterCache' => array(
                    'messages_read' => array('Message.is_read' => 1),
                    'messages_unread' => array('Message.is_read' => 0)
                )
            )
        );
    }

hasMany
-------

次のステップへ進みましょう。次は「User hasMany Comment」を定義します。
hasMany アソシエーションは、User モデルのレコードを取得した時に、
そのユーザーのコメントも取得できるようになります。

hasMany 用のテーブルは、以下の規約に従います。

**hasMany:** *アソシエーション先の* モデルが外部キーを含んでいます。

======================= ==================
リレーション            スキーマ
======================= ==================
User hasMany Comment    Comment.user\_id
----------------------- ------------------
Cake hasMany Virtue     Virtue.cake\_id
----------------------- ------------------
Product hasMany Option  Option.product\_id
======================= ==================

User モデル (/app/Model/Profile.php) に文字列で hasMany アソシエーションを
定義してみましょう。 ::

    class User extends AppModel {
        public $hasMany = 'Comment';
    }

配列を使ってより詳しく設定することもできます。 ::

    class User extends AppModel {
        public $hasMany = array(
            'Comment' => array(
                'className' => 'Comment',
                'foreignKey' => 'user_id',
                'conditions' => array('Comment.status' => '1'),
                'order' => 'Comment.created DESC',
                'limit' => '5',
                'dependent' => true
            )
        );
    }

hasMany アソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 現在のモデルに関連付けられるモデルのクラス名。
   「User hasMany Comment」を定義したい場合、'Comment'となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。
   これは複数のhasManyを定義するためによく使われます。このキーのデフォルト値は\
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **conditions**: ``array('Comment.visible' => true)`` のような、find() に
   指定する conditions と互換性のある配列、もしくはSQL文字列を指定します。
-  **order**: ``array('Profile.last_name' => 'ASC')`` のような、find() に
   指定する order と互換性のある配列、もしくは SQL 文字列を指定します。
-  **limit**: アソシエーションモデルのデータの最大行数。
-  **offset**: アソシエーションモデルのデータをスキップする行数。
-  **dependent**: true をセットすれば、データを再帰的に削除するようになります。
   たとえば User レコードが削除されたら、Comment レコードも削除されます。
-  **exclusive**: true をセットすれば、deleteAll() を呼び出した時に
   データを再帰的に削除するようになります。この処理は以前に比べて劇的な
   パフォーマンスの改善が施されていますが、あまり多用しないでください。
-  **finderQuery**: アソシエーションモデルのレコードを取得する時に使われる
   SQL クエリ。取得結果をカスタムしたい時に使います。
   実行したいクエリ中でアソシエーションモデルの ID を参照する必要がある場合、
   ``{$__cakeID__$}`` マーカーを使います。
   たとえば、「Apple hasMany Orange」というアソシエーションの場合、
   以下のようなクエリになるでしょう。
   ``SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};``


このアソシエーションを定義すれば、User モデルで find した時に、
関連する Comment が存在すればそのレコードも一緒に取得してくるようになります。 ::

    //$this->User->find() を呼び出した時の戻り値

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

Comment モデルから User モデルのデータも取得するためには、
hasMany の他に 「Comment belongsTo User」アソシエーションも必要になります。
ここで説明した内容で、User から Comment を取得できるようになりました。
また、Comment モデルに 「Comment belongsTo User」アソシエーションを追加することで、
Comment から User を取得できるようにもなりました。これで各モデルの繋がりが
完成し、それぞれの情報を取得できるフローが完成しました。

hasAndBelongsToMany (HABTM)
---------------------------

さぁここまでの説明で CakePHP のアソシエーションに関して、既にあなたは
プロフェッショナルになっています。

それでは、最後のリレーションシップ、hasAndBelongsToMany(HABTM) の
説明をしましょう。このアソシエーションは、結合される2つのモデルが
ある場合に使われます。

hasMany と HABTM の大きな違いは HABTM モデル間のリンクは排他的ではない、ということです。
たとえば、Recipe (レシピ) モデルと Ingredient (材料) モデルを HABTM を使って結合させるとします。
ここで、トマトを材料とするものは、スパゲッティのレシピだけではないということです。
他にもサラダのレシピにも使われます。

hasMany アソシエーション間のリンクは排他的です。
「User hasMany Comments」というアソシエーションがあるとすれば、Comment は
ある特定の User だけにリンクされます。なんでも取ってこれるわけではありません。

さて話を進めましょう。HABTM アソシエーションを操作するには、別テーブルを
準備する必要があります。この新しいテーブルの名前は、両モデルの名前を
アルファベット順にアンダースコア( \_ )で区切ったものにする必要があります。
そして、それぞれのモデルのプライマリキーを指す外部キーを2つ (integer 型) 定義します。
色々な問題が起こるため、これら2つのフィールドを複合主キーとして定義しないでください。
もしそうする必要があるなら、ユニークインデックスを定義してください。
テーブルに追加の情報をもたせたり、またはモデルで使ったりする場合は、
別途このテーブルにプライマリキーを追加してください。(規約では 'id')

**HABTM** は両方の *モデル* 名を含むテーブルが必要です。

========================= ================================================================
リレーションシップ        HABTMテーブルのフィールド
========================= ================================================================
Recipe HABTM Ingredient   **ingredients_recipes**.id, **ingredients_recipes**.ingredient_id, **ingredients_recipes**.recipe_id
------------------------- ----------------------------------------------------------------
Cake HABTM Fan            **cakes_fans**.id, **cakes_fans**.cake_id, **cakes_fans**.fan_id
------------------------- ----------------------------------------------------------------
Foo HABTM Bar             **bars_foos**.id, **bars_foos**.foo_id, **bars_foos**.bar_id
========================= ================================================================


.. note::

    規約では、テーブル名はアルファベット順にします。
    ただ、アソシエーションの設定次第で、それ以外のテーブル名を定義することもできます。

規約にしたがって、 **cakes** と **recipes** テーブルにはプライマリーキーとして
"id" フィールドがあることを確認してください。もし規約とは違う場合、モデルの
:ref:`model-primaryKey` を変更してください。

新しいテーブルを作れば、モデルに HABTM アソシエーションを定義できます。 ::

    class Recipe extends AppModel {
        public $hasAndBelongsToMany = array(
            'Ingredient' =>
                array(
                    'className' => 'Ingredient',
                    'joinTable' => 'ingredients_recipes',
                    'foreignKey' => 'recipe_id',
                    'associationForeignKey' => 'ingredient_id',
                    'unique' => true,
                    'conditions' => '',
                    'fields' => '',
                    'order' => '',
                    'limit' => '',
                    'offset' => '',
                    'finderQuery' => '',
                    'with' => ''
                )
        );
    }

HABTM アソシエーションは次のキーを含ませることができます。

.. _ref-habtm-arrays:

-  **className**: 現在のモデルに関連付けられるモデルのクラス名。
   「Recipe HABTM Ingredient」 を定義したい場合、'Ingredient'となります。
-  **joinTable**: このアソシエーションに使う中間テーブルの名前。
   テーブル名が HABTM テーブルの規約に従っていない場合に指定します。
-  **with**: join するテーブルのモデル名を定義します。デフォルトでは
   CakePHP はモデルを自動的に生成します。上記のサンプルでは、IngredientsRecipe です。
   このキーを使うことで、このデフォルトの名前を上書きすることができます。
   この名前のモデルクラスを生成することで、他の通常のモデルと同じように
   たとえば追加の列や情報を取得するようにカスタム動作を定義できます。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。
   これは複数の HABTM を定義するためによく使われます。このキーのデフォルト値は
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **associationForeignKey**: アソシエーション先のもう一方のモデルを
   検索するための外部キーの名前。これは複数の HABTM を定義するためによく使われます。
   このキーのデフォルト値はアソシエーション先のモデルの単数形に ``_id``
   がついたものです。
- **unique**: bool 値、または文字列で ``keepExisting`` を指定します。
    - true を指定すれば (これがデフォルトです)、新しいレコードを挿入する前に
      既存の関連するレコードを削除します。更新時にも、再び処理する必要があります。
    - false を指定すれば、既存の関連するレコードはそのままにして、新しい関連する
      レコードを挿入します。場合によっては重複した関連レコードができることがあります。
    - ``keepExisting`` を指定すれば、 `true` を指定した時と似ていますが、
      追加されたレコードが既存の関連レコードで重複している場合、追加のチェックによって、
      既存の関連レコードは削除されず、重複は無視されます。例えば、join テーブルに
      必要なデータのみ保存したい場合に便利です。
-  **conditions**: find() に指定する conditions と互換性のある配列もしくは
   SQL文字列を指定します。アソシエーション先のテーブルに条件を指定したければ、
   'with' に指定したモデルを使って必要な belongsTo アソシエーションを定義してください。
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。
   デフォルトで全フィールドが含まれます。
-  **order**: find() に指定する order と互換性のある配列もしくは
   SQL 文字列を指定します。
-  **limit**: アソシエーションモデルのデータの最大行数。
-  **offset**: アソシエーションモデルのデータをスキップする行数。
-  **finderQuery, deleteQuery, insertQuery**: データ取得、削除、追加の
   時に使われる SQL クエリを指定します。これは、動作をカスタマイズしたい
   時に使います。

このアソシエーションを定義すれば、Recipe モデルで find した時に、
関連する Ingredient が存在すればそのレコードも一緒に取得してくるようになります。 ::

    //$this->Recipe->find() を呼び出した時の戻り値

    Array
    (
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Ingredient] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Chocolate
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Sugar
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Bombs
                    )
            )
    )

Ingredient モデルを使って Recipe データを取得したい時は、
Ingredient モデルに HABTM アソシエーションを定義することになります。

.. note::

   HABTM データは完全に1セットとして取り扱われます。
   データ保存のためにデータのセット全体を渡す必要があるので、
   新しいデータがテーブルに1セット追加されるたびに、
   データの削除と生成が行われます。
   HABTM の代わりに :ref:`hasMany-through` も参照してください。

.. tip::

    HABTM のデータ保存に関する詳細は :ref:`saving-habtm` を参照してください。


.. _hasMany-through:

hasMany through (モデルの結合)
------------------------------

多 対 多のアソシエーションを使って追加データを保存する方が
良い場合があります。以下のような状況を考えてみてください。

`Student hasAndBelongsToMany Course`

`Course hasAndBelongsToMany Student`

言い換えると、Student (生徒) はいくつかの Courses (授業) を取っていて、
Course (授業) は Student (生徒) に取られています。これは単純に多 対 多のアソシエーションで
次のようなテーブルが必要になってくるということです。 ::

    id | student_id | course_id

では、生徒の授業への出席日数や成績を保存したい場合はどうでしょう？
次のようなテーブル構成にします。 ::

    id | student_id | course_id | days_attended | grade

問題なのは、hasAndBelongsToMany がこのような構造をサポートしていないことです。
なぜなら、hasAndBelongsToMany アソシエーションはデータを一旦削除してから、
そのあとでデータを保存するためです。これでは新しいレコードが挿入されるとき、
外部キー ID 以外の追加フィールドのデータが失われてしまいます。

.. versionchanged:: 2.1

    ``unique`` に ``keepExisting`` を指定すれば、追加フィールドの
    データを失うことなく保存できます。 ``unique`` キーについては
    :ref:`HABTM association arrays <ref-habtm-arrays>` を参照してください。

これは、 **モデルの結合** もしくは **hasMany through** アソシエーションを
使えば解決できます。このアソシエーションはモデルそれ自身、
CourseMembership モデルを作ります。以下のモデルを見てください。 ::

            // Student.php
            class Student extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }

            // Course.php

            class Course extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }

            // CourseMembership.php

            class CourseMembership extends AppModel {
                public $belongsTo = array(
                    'Student', 'Course'
                );
            }

CourseMembership モデルは Student (生徒) の Course (授業) への参加しているかどうかを
一意に識別します。

モデルの結合は CakePHP ビルトインの hasMany と belongsTo がとても使いやすくなっています。

.. _dynamic-associations:

直接アソシエーションを生成、削除する
------------------------------------

次のような理由で、モデルのアソシエーションを直接生成したり削除したり
したい場合があります。


-  取得される関連データの量を減らしたいけど、アソシエーションが既に定義されている。
-  関連データを並び替えや絞込みをするために、アソシエーションを定義し直したい。

アソシエーションの生成と削除は、モデルの bindModel() と unbindModel() メソッドを
使って行われます。("Containable" という非常に便利なビヘイビアがあります。
より詳しくはビルトインビヘイビアについてのマニュアルを参照してください。)
以下の2つのモデルを使って、bindModel() と unbindModel() の使い方を見てみましょう。 ::

    class Leader extends AppModel {
        public $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order' => 'Follower.rank'
            )
        );
    }

    class Follower extends AppModel {
        public $name = 'Follower';
    }

LeadersController では、Leader モデルの find メソッドを使って Leader とそれに関連する
Follower を取得できます。上記のコードでは、Leader モデルのアソシエーションの配列は
"Leader hasMany Follower" というリレーションシップを定義しています。
コントローラーのアクションで、アソシエーションを削除するために unbindModel() を
使ってみましょう。 ::

    public function some_action() {
        // Leader とそれに関連する Follower を取得します。
        $this->Leader->find('all');

        // ここで hasMany を削除してみます
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );

        // これで find メソッドは Leader は返すけど、Follower は返さなくなります
        $this->Leader->find('all');

        // 注: unbindModel は次に実行する find にだけ影響します。
        // それ以上の find 呼び出しはモデルに設定したアソシエーション情報が再度使われます。

        // この時の find では既に、Leader とそれに関連する Follower を
        // 返すようになります。
        $this->Leader->find('all');
    }

.. note::

    bindModel()、unbindModel() を使って、アソシエーションの追加、削除をすると
    2つ目のパラメータに false をセットしない限り、次の1回の find だけに適用されます。
    2つ目のパラメータに *false* がセットされていれば、bindMode()、unbindMode() で
    設定された情報は残ります。

これは unbindModel() の基本的な使い方です。 ::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

さて、アソシエーションの削除はできたので、次は追加をしてみましょう。
今のところ Leader は、Principle への関連がない状態です。
Principle モデルは $name プロパティを除いては空っぽの状態です。
それでは、直接 Principle を Leader に関連付けてみましょう。
LeadersController で次のようにします。 ::

    public function another_action() {
        // leader.php モデルファイルでは、hasMany アソシエーションは定義されていません。
        // ここでの find は Leader のみ取得します。
        $this->Leader->find('all');

        // bindModel() を使って Leader モデルにアソシエーションを追加します。
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );

        // モデルのリセット後にも、このアソシエーションを継続したい場合、
        // 第２引数を以下のように設定します。
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            ),
            false
        );

        // アソシエーションが正しく追加されました。
        // これで Leader と、それに関連する Principle を取得することができます。
        $this->Leader->find('all');
    }

bindModel() は基本的には、生成したいアソシエーションの名前がつけられた
配列の中に、モデルに指定するのと同じアソシエーション配列をセットします。 ::


    $this->Model->bindModel(
        array('associationName' => array(
                'associatedModelClassName' => array(
                    // ここにモデルに指定するアソシエーション配列をセットします
                )
            )
        )
    );

通常、モデル結合については、モデルの中でのアソシエーションの定義順を気にする
必要はありません。ただ、ここで説明した手順で新しくアソシエーションを定義する
場合は、正しい順番でキーを指定する必要があります。

同じモデルに対する複数のリレーションシップ
------------------------------------------

同モデルに対して複数のリレーションを持つモデルを考えてみます。
たとえば User モデルへのリレーションを2つ持つ Message モデル。
1つ目のリレーションは、メッセージを送信したユーザー、
2つ目のリレーションは、メッセージを受け取ったユーザーです。
この場合、messages テーブルは user\_id と recipient\_id というフィールドを
持っています。さて、ここでは Message モデルに次のように定義します。 ::

    class Message extends AppModel {
        public $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }

Recipient は User モデルに対するエイリアスです。User モデルの方は
このようになっています。 ::

    class User extends AppModel {
        public $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }

自分自身に対するアソシエーションも以下のようにして定義できます。 ::

    class Post extends AppModel {

        public $belongsTo = array(
            'Parent' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );

        public $hasMany = array(
            'Children' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    }

**入れ子になったアソシエーションのレコードを取得します。**

テーブルに ``parent_id`` フィールドがある場合、 :ref:`model-find-threaded` を使えば、
アソシエーションを定義せずに、1度のクエリ実行で入れ子になったデータを取得できます。

.. _joining-tables:

テーブルの結合
--------------

JOIN 句を使って関連するテーブルを結合できます。
これは複数テーブルを使った複雑なクエリを実行することができます。
(たとえば、いくつかの tags をもつ posts を検索する、など)

CakePHP の belongsTo と hasOne では、関連データを取得するために
自動的に join されたクエリが発行されます。

.. note::

    これを動作させるには以下のように、再帰に設定を -1 にする必要があります。
    $this->Channel->recursive = -1;

テーブルを結合するには、Model::find() の "モダン" な構文を使います。
$options 配列の 'joins' というキーを追加します。以下の例を見てください。 ::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

.. note::

    'joins' 配列にキーが付かないことに注意してください。

上記の例では、Item モデルは channels テーブルに left join されます。
モデルにテーブルの別名を定義することで、CakePHP の構造のデータを
取得することができます。

オプションに指定できるキーは以下の通りです。


-  **table**: joinするテーブル。
-  **alias**: テーブルの別名。テーブルのモデルの名前と同じにするのが
   良いです。
-  **type**: join 種別。inner、left、right のいずれかです。
-  **conditions**: join の時の条件を指定します。

joinsと共に、joinsで指定した関連モデルに関する条件をconditionsに指定できます。 ::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $privateItems = $Item->find('all', $options);

必要に応じて hasAndBelongsToMany でも、joins を指定できます。

「Book hasAndBelongsToMany Tag」というアソシエーションを考えてみます。
books テーブルと tags テーブルを繋げるために、中間テーブルとして
books\_tags テーブルを使うように定義してみます。 ::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Book.id = BooksTag.book_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

joins オプションを使えば CakePHP のアソシエーションとデータの取得を、
非常に柔軟に扱うことができます。ただ、ほとんどの場合で、bindModel を使って
直接モデルをバインドしたり、Containable ビヘイビアを使うことで、
通常のアソシエーションを定義した時と同じ結果を取得することができます。
この機能は、モデルのアソシエーションと同時に使った場合、いくつかのケースで
あまり良くない SQL クエリを発行することがあるので気をつけて使ってください。


.. meta::
    :title lang=ja: Associations: Linking Models Together
    :keywords lang=ja: relationship types,relational mapping,recipe database,relational database,this section covers,web applications,recipes,models,cakephp,storage
