アソシエーション: モデル同士を繋ぐ
##################################

CakePHPのもっともパワフルな機能の1つはモデル間の関連をマッピングしてくれる\
モデルの機能でしょう。CakePHPでは、アソシエーションという機能を通じて\
モデル間の繋がりを操作します。

アプリケーション中で、異なるオブジェクト同士の関連を定義することは\
よくあることです。たとえばレシピのデータベースを例にとると、\
レシピはたくさんのレビューを持っていて、そのレビューについては誰が\
書いたのかというユーザー情報を持っています。そして、そのユーザーもまた\
レシピを持っているでしょう。\
これらの関連を定義することで、直感的にデータにアクセスすることが出来ます。

このセクションでは、モデル間のアソシエーションを考えて、定義して、そして\
利用していく方法を説明していきます。

データは様々なソースから取得することができますが、Webアプリケーションで\
最も一般的なストレージはリレーショナルデータベースでしょう。\
そのため、ここではリレーショナルデータベースでの説明が主となります。

プラグインのモデルに関するアソシエーションについてはこちらを参照してください。
:ref:`plugin-models`

リレーションシップの種別
------------------------

CakePHPには4つのアソシエーションがあります。hasOne, hasMany,
belongsTo, hasAndBelongsToMany(HABTM)です。

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

アソシエーションは、アソシエーション名のクラス変数を生成することで定義されます。\
クラス変数の内容は単純な文字列でもいいですし、アソシエーションを具体的に定義するために\
多次元の配列を使うこともできます。

::

    class User extends AppModel {
        public $name = 'User';
        public $hasOne = 'Profile';
        public $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order'      => 'Recipe.created DESC'
            )
        );
    }

上記の例では、配列の最初の'Recipe'は'エイリアス(別名)'です。\
これはリレーションシップを識別するためのもので、どんな文字列でもかまいません。\
普通は、そのリレーションシップが参照するクラスと同じ名前をつけますが、\
**各モデルのエイリアスはアプリケーション全体でユニークでなければなりません。**\
たとえば次の例を見てください。これは正しい書き方です。 ::

    class User extends AppModel {
        public $name = 'User';
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
        public $name = 'Group';
        public $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
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
        public $name = 'User';
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
        public $name = 'Group';
        public $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

これはHABTMアソシエーションに、UserとGroupの両モデルを参照している\
'Member'というエイリアスがあるからです。アプリケーション全体で、\
参照先が違うにもかかわらず同じエイリアスがあると、予期しない動作を\
引き起こす原因となります。

Cakeはアソシエーションを定義したモデルオブジェクト同士を自動的にリンクします。\
たとえば、 ``User`` モデルの中では、以下のようにして ``Recipe`` モデルに\
アクセスできます。 ::

    $this->Recipe->someFunction();

同じようにコントローラーでも、関連モデルに簡単にアクセスできます。 ::

    $this->User->Recipe->someFunction();

.. note::

    アソシエーションは'単方向'でしか定義されません。\
    User hasMany Recipeというアソシエーションを定義しても、\
    それはRecipeモデルに対してはなにも影響しません。\
    RecipeモデルからUserモデルにアクセスするためには、\
    Recipe belongsTo Userというアソシエーションを定義する必要があります。

hasOne
------

hasOneでProfileモデルを持っているUserモデルを作ってみましょう。

まずはじめに、データベースのテーブルには正しくキーがつけられている必要があります。\
hasOneリレーションを動作させるためには、 テーブルに外部キーを含ませます。\
これはモデルのテーブル中でレコードを検索するときに使われます。\
今回の場合、profilesテーブルにはuser\_idというフィールドを含ませます。\
基本的なパターンとしては

hasOne用のテーブルは、以下の規約に従います。

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

    外部キーはアソシエーションの定義で上書きすることができるため、\
    必ずしもCakePHPの規約に従っていなくても問題ありません。\
    それでも規約に従っていれば、コードの可読性、メンテナンス性が高くなります。

Userモデルは /app/Model/User.php にあります。\
User hasOne Profile というアソシエーションを定義するには、Userモデルの中で\
$hasOneプロパティを追加します。ただし、Profileモデルが /app/Model/Profile.php に\
ないと正常に動作しません。 ::


    class User extends AppModel {
        public $name = 'User';
        public $hasOne = 'Profile';
    }

モデルでhasOneリレーションシップを定義する方法は2つあります。\
一番簡単な方法は上記のように、$hasOneプロパティに\
アソシエーションモデルのクラス名の文字列を指定することです。

より詳細にアソシエーションを設定したければ、配列を使って定義することが\
できます。たとえば、ある特定のレコードのみに絞ってアソシエーションを\
定義したい場合は次のようにします。

::

    class User extends AppModel {
        public $name = 'User';
        public $hasOne = array(
            'Profile' => array(
                'className'    => 'Profile',
                'conditions'   => array('Profile.published' => '1'),
                'dependent'    => true
            )
        );
    }

hasOneアソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 元モデルに関連付けられるモデルのクラス名。\
   User hasOne Profile を定義したい場合、'Profile'となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。\
   これは複数のhasOneを定義するためによく使われます。このキーのデフォルト値は\
   元モデルの単数形に ``_id`` がついたものです。上記のUserモデルの例では、\
   ``user_id`` となります。
-  **conditions**: ``array('Profile.approved' => true)`` のような、find()に\
   指定するconditionsと互換性のある配列、もしくはSQL文字列を指定します。
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。\
   デフォルトで全フィールドが含まれます。
-  **order**: ``array('Profile.last_name' => 'ASC')`` のような、find()に\
   指定するorderと互換性のある配列、もしくはSQL文字列を指定します。
-  **dependent**: このキーにtureがセットされていて、かつモデルのdeleteメソッドの\
   cascadeパラメータにtrueがセットされて呼び出された時、アソシエーション先のモデルの\
   レコードも一緒に削除されます。Userが削除されると、そのユーザーに\
   関連するProfileも同時に削除したい場合にtureにします。

このアソシエーションを定義すれば、Userモデルでfindした時に、\
関連するProfileが存在すればそのレコードも一緒に取得してくるようになります。 ::

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

ここまでで、UserモデルからProfileにアクセスできるようになりました。\
次はProfileモデルから関連するUserモデルを取得できるように、\
belongsToアソシエーションを定義しましょう。\
belongsToはhasOne、hasManyアソシエーションと対になる\
アソシエーションになります。\
hasOne、hasManyとは逆方向からデータを参照することになります。

belongsTo用のテーブルは、以下の規約に従います。

**belongsTo:** *元* モデルが外部キーを含んでいます。

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

    あるテーブルが外部キーを含んでいれば、そのテーブルは外部キーの先の\
    テーブルに属しているということになります。

Profileモデル(/app/Model/Profile.php)に文字列でbelongsToアソシエーションを\
定義してみましょう。 ::

    class Profile extends AppModel {
        public $name = 'Profile';
        public $belongsTo = 'User';
    }

配列を使ってより詳しく設定することもできます。 ::

    class Profile extends AppModel {
        public $name = 'Profile';
        public $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'   => 'user_id'
            )
        );
    }

belongsToアソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 元モデルに関連付けられるモデルのクラス名。\
   Profile hasOne User を定義したい場合、'User'となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。\
   これは複数のbelongsToを定義するためによく使われます。このキーのデフォルト値は\
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **conditions**: ``array('User.active' => true)`` のような、find()に\
   指定するconditionsと互換性のある配列、もしくはSQL文字列を指定します。
-  **type**: SQLクエリで使われるテーブル結合種別。外部キーにマッチするデータが\
   必ずしも存在するとは限らないので、デフォルトではLEFTです。\
   INNERは、元モデルとアソシエーション先のモデルのどちらもレコードが存在する時は\
   どちらも取得して、アソシエーション先のモデルにレコードが存在しない時は\
   どちらも取得しない、という時に使います。(conditionsを使うより効率的です)
   **(注: typeに指定する値は小文字です。left や inner を指定します。)**
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。\
   デフォルトで全フィールドが含まれます。
-  **order**: ``array('User.username' => 'ASC')`` のような、 find()に\
   指定するorderと互換性のある配列、もしくはSQL文字列を指定します。
-  **counterCache**: trueをセットすれば、アソシエーション先のモデルで\
   ``save()`` または ``delete()`` を実行した時に、テーブルの\
   "[モデル名の単数形]\_count"というフィールドの値を増減します。\
   文字列を指定すれば、指定された文字列のフィールドに対して\
   カウントの操作を行います。キーにフィールド名、値に条件、という配列で\
   指定することもできます。このフィールドの値は関連データの行数を表します。\ ::

       array(
           'recipes_count' => true,
           'recipes_published' => array('Recipe.published' => 1)
       )

-  **counterScope**: conterCacheのフィールドを更新する際の追加条件があれば\
   指定します。

このアソシエーションを定義すれば、Profileモデルでfindした時に、\
関連するUserが存在すればそのレコードも一緒に取得してくるようになります。 ::

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

hasMany
-------

次のステップへ進みましょう。次は User hasMany Comment を定義します。\
hasManyアソシエーションは、Userモデルのレコードを取得した時に、\
そのユーザーのコメントも取得できるようになります。

hasMany用のテーブルは、以下の規約に従います。

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

Userモデル(/app/Model/Profile.php)に文字列でhasManyアソシエーションを\
定義してみましょう。 ::

    class User extends AppModel {
        public $name = 'User';
        public $hasMany = 'Comment';
    }

配列を使ってより詳しく設定することもできます。 ::

    class User extends AppModel {
        public $name = 'User';
        public $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'         => 'Comment.created DESC',
                'limit'         => '5',
                'dependent'     => true
            )
        );  
    }

hasManyアソシエーションの配列に指定できるキーは以下の通りです。


-  **className**: 元モデルに関連付けられるモデルのクラス名。\
   User hasMany Comment を定義したい場合、'Comment'となります。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。\
   これは複数のhasManyを定義するためによく使われます。このキーのデフォルト値は\
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **conditions**: ``array('Comment.visible' => true)`` のような、find()に\
   指定するconditionsと互換性のある配列、もしくはSQL文字列を指定します。
-  **order**: ``array('Profile.last_name' => 'ASC')`` のような、find()に\
   指定するorderと互換性のある配列、もしくはSQL文字列を指定します。
-  **limit**: アソシエーションモデルのデータの最大行数。
-  **offset**: アソシエーションモデルのデータをスキップする行数。
-  **dependent**: trueをセットすれば、データを再帰的に削除するようになります。\
   たとえばUserレコードが削除されたら、Commentレコードも削除されます。
-  **exclusive**: trueをセットすれば、deleteAll()を呼び出した時に\
   データを再帰的に削除するようになります。この処理は以前に比べて劇的な\
   パフォーマンスの改善が施されていますが、あまり多用しないでください。
-  **finderQuery**: アソシエーションモデルのレコードを取得する時に使われる\
   SQLクエリ。取得結果をカスタムしたい時に使います。\
   実行したいクエリ中でアソシエーションモデルのIDを参照する必要がある場合、\
   ``{$__cakeID__$}`` マーカーを使います。\
   たとえば、Apple hasMany Orangeというアソシエーションの場合、\
   以下のようなクエリになるでしょう。\
   ``SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};``


このアソシエーションを定義すれば、Userモデルでfindした時に、\
関連するCommentが存在すればそのレコードも一緒に取得してくるようになります。 ::

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

CommentモデルからUserモデルのデータも取得するためには、\
hasManyの他にComment belongsTo User アソシエーションも必要になります。\
ここで説明した内容で、UserからCommentを取得できるようになりました。\
また、CommentモデルにComment belongsTo User アソシエーションを追加することで、\
CommentからUserを取得できるようにもなりました。これで各モデルの繋がりが\
完成し、それぞれの情報を取得できるフローが完成しました。

counterCache - count()結果をキャッシュする
------------------------------------------

この機能は、関連データの件数をキャッシュしてくれます。\
``find('count')`` でデータ件数を取得する代わりに、\
``$hasMany`` アソシエーションのモデルがデータの追加及び削除を追跡して、\
データ件数を示すフィールドを増減してくれます。

フィールドの名前は以下のように、モデルの単数形にアンダースコアで\
"count"をつなげます。 ::

    my_model_count

``ImageComment`` と ``Image`` というモデルを準備して、 ``images`` テーブルに\
``image_comment_count`` という名前のINTフィールドを追加しましょう。

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

このカウンタ用のフィールドを追加すれば準備完了です。\
counter-cache機能を有効にするためにアソシエーションの設定に \
``counterCache`` キーに ``true`` をセットしましょう。 ::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
            )
        );
    }

これで、 ``Image`` に関連する ``ImageComment`` を追加もしくは削除するたびに、\
件数が ``image_comment_count`` フィールドにセットされるようになります。

``conterScope`` をセットすれば、カウンタ値の更新をする\
(もしくは更新をしない、どういう見せ方をするかによります)\
条件を指定することができます。

Imageモデルのサンプルでは、次のようになるでしょう。 ::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // "Image" が active なデータのみカウントします
            )
        );
    }

hasAndBelongsToMany (HABTM)
---------------------------

さぁここまでの説明でCakePHPのアソシエーションに関して、既にあなたは\
プロフェッショナルになっています。

それでは、最後のリレーションシップ、hasAndBelongsToMany(HABTM)の\
説明をしましょう。このアソシエーションは、結合される2つのモデルが\
ある場合に使われます。

hasManyとHABTMの大きな違いはHABTMモデル間のリンクは排他的ではない、ということです。\
たとえば、Recipe(レシピ)モデルとIngredient(材料)モデルをHABTMを使って結合させるとします。\
ここで、トマトを材料とするものは、スパゲッティのレシピだけではないということです。\
他にもサラダのレシピにも使われます。

hasManyアソシエーション間のリンクは排他的です。\
User hasMany Comments というアソシエーションがあるとすれば、Commentは\
ある特定のUserだけにリンクされます。なんでも取ってこれるわけではありません。

さて話を進めましょう。HABTMアソシエーションを操作するには、別テーブルを\
準備する必要があります。この新しいテーブルの名前は、両モデルの名前を\
アルファベット順にアンダースコア( \_ )で区切ったものにする必要があります。\
そして、それぞれのモデルのプライマリキーを指す外部キーを2つ(integer型)定義します。\
色々な問題が起こるため、これら2つのフィールドを複合主キーとして定義しないでください。\
もしそうする必要があるなら、ユニークインデックスを定義してください。\
テーブルに追加の情報をもたせたり、またはモデルで使ったりする場合は、\
別途このテーブルにプライマリキーを追加してください。(規約では'id')

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

    規約では、テーブル名はアルファベット順にします。\
    ただ、アソシエーションの設定次第で、それ以外の\
    テーブル名を定義することもできます。

規約にしたがって、 テーブルにはプライマリーキーとして"id"フィールドが\
あることを確認してください。もし規約とは違う場合、モデルの :ref:`model-primaryKey`
を変更してください。

新しいテーブルを作れば、モデルにHABTMアソシエーションを定義できます。 ::

    class Recipe extends AppModel {
        public $name = 'Recipe';   
        public $hasAndBelongsToMany = array(
            'Ingredient' =>
                array(
                    'className'              => 'Ingredient',
                    'joinTable'              => 'ingredients_recipes',
                    'foreignKey'             => 'recipe_id',
                    'associationForeignKey'  => 'ingredient_id',
                    'unique'                 => true,
                    'conditions'             => '',
                    'fields'                 => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'offset'                 => '',
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
        );
    }

HABTMアソシエーションは次のキーを含ませることができます。

.. _ref-habtm-arrays:

-  **className**: 元モデルに関連付けられるモデルのクラス名。\
   Recipe HABTM Ingredient を定義したい場合、'Ingredient'となります。
-  **joinTable**: このアソシエーションに使う中間テーブルの名前。\
   テーブル名がHABTMテーブルの規約に従っていない場合に指定します。
-  **with**: joinするテーブルのモデル名を定義します。デフォルトでは\
   CakePHPはモデルを自動的に生成します。上記のサンプルでは、IngredientsRecipeです。\
   このキーを使うことで、このデフォルトの名前を上書きすることができます。\
   この名前のモデルクラスを生成することで、他の通常のモデルと同じように\
   たとえば追加の列や情報を取得するようにカスタム動作を定義できます。
-  **foreignKey**: アソシエーション先のモデルを検索するための外部キーの名前。\
   これは複数のHABTMを定義するためによく使われます。このキーのデフォルト値は\
   アソシエーション先のモデルの単数形に ``_id`` がついたものです。
-  **associationForeignKey**: アソシエーション先のもう一方のモデルを\
   検索するための外部キーの名前。これは複数のHABTMを定義するためによく使われます。\
   このキーのデフォルト値はアソシエーション先のモデルの単数形に ``_id``
   がついたものです。
- **unique**: bool値、または文字列で ``keepExisting`` を指定します。\
    - trueを指定すれば(これがデフォルトです)、新しいレコードを挿入する前に\
      既存の関連するレコードを削除します。
    - falseを指定すれば、saveを実行してレコードを挿入したあとに、\
      joinできないレコードがあれば削除されます。
    - ``keepExisting`` を指定すれば、 `true` を指定した時と似ていますが、\
      既存の関連レコードは削除されません。
-  **conditions**: find()に指定するconditionsと互換性のある配列もしくは\
   SQL文字列を指定します。アソシエーション先のテーブルに条件を指定したければ、\
   'with' に指定したモデルを使って必要なbelongsToアソシエーションを定義してください。
-  **fields**: アソシエーション先のモデルから取得するフィールドのリスト。\
   デフォルトで全フィールドが含まれます。
-  **order**: find()に指定するorderと互換性のある配列もしくは\
   SQL文字列を指定します。
-  **limit**: アソシエーションモデルのデータの最大行数。
-  **offset**: アソシエーションモデルのデータをスキップする行数。
-  **finderQuery, deleteQuery, insertQuery**: データ取得、削除、追加の\
   時に使われるSQLクエリを指定します。これは、動作をカスタマイズしたい\
   時に使います。

このアソシエーションを定義すれば、Recipeモデルでfindした時に、\
関連するIngredientが存在すればそのレコードも一緒に取得してくるようになります。 ::

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

Ingredientモデルを使ってRecipeデータを取得したい時は、\
IngredientモデルにHABTMアソシエーションを定義することになります。

.. note::

   HABTMデータは完全に1セットとして取り扱われます。
   データ保存のためにデータのセット全体を渡す必要があるので、\
   新しいデータがテーブルに1セット追加されるたびに、\
   データの削除と生成が行われます。\
   HABTMの代わりに :ref:`hasMany-through` も参照してください。

.. tip::

    HABTMのデータ保存に関する詳細は :ref:`saving-habtm` を参照してください。


.. _hasMany-through:

hasMany through (モデルの結合)
------------------------------

多 対 多のアソシエーションを使って追加データを保存する方が\
良い場合があります。以下のような状況を考えてみてください。

`Student hasAndBelongsToMany Course`

`Course hasAndBelongsToMany Student`

言い換えると、Student(生徒)はいくつかのCourses(授業)を取っていて、\
Course(授業)はStudent(生徒)に取られています。これは単純に多 対 多のアソシエーションで
次のようなテーブルが必要になってくるということです。 ::

    id | student_id | course_id

では、生徒の授業への出席日数や成績を保存したい場合はどうでしょう？
次のようなテーブル構成にします。 ::

    id | student_id | course_id | days_attended | grade

問題なのは、hasAndBelongsToManyがこのような構造をサポートしていないことです。\
なぜなら、hasAndBelongsToManyアソシエーションはデータを一旦削除してから、\
そのあとでデータを保存するためです。これでは新しいレコードが挿入されるとき、\
外部キーID以外の追加フィールドのデータが失われてしまいます。

    .. versionchanged:: 2.1

    ``unique`` に ``keepExisting`` を指定すれば、追加フィールドの\
    データを失うことなく保存できます。 ``unique`` キーについては\
    :ref:`HABTM association arrays <ref-habtm-arrays>` を参照してください。

これは、 **モデルの結合** もしくは **hasMany through** アソシエーションを\
使えば解決できます。このアソシエーションはモデルそれ自身、\
CourseMembershipモデルを作ります。以下のモデルを見てください。 ::

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

CourseMembershipモデルはStudent(生徒)のCourse(授業)への参加しているかどうかを
一意に識別します。

モデルの結合はCakePHPビルトインのhasManyとbelongsToがとても使いやすくなっています。

.. _dynamic-associations:

直接アソシエーションを生成、削除する
------------------------------------

次のような理由で、モデルのアソシエーションを直接生成したり削除したり\
したい場合があります。


-  取得される関連データの量を減らしたいけど、アソシエーションが\
   既に定義されている。
-  関連データを並び替えや絞込みをするために、アソシエーションを\
   定義し直したい。

アソシエーションの生成と削除は、モデルのbindModel()とunbindModel()メソッドを\
使って行われます。("Containable"という非常に便利なビヘイビアがあります。\
より詳しくはビルトインビヘイビアについてのマニュアルを参照してください。)
以下の2つのモデルを使って、bindModel()とunbindModel()の使い方を見てみましょう。 ::

    class Leader extends AppModel {
        public $name = 'Leader';
        
        public $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }
    
    class Follower extends AppModel {
        public $name = 'Follower';
    }

LeadersControllerでは、Leaderモデルのfindメソッドを使ってLeaderとそれに関連する\
Followerを取得できます。上記のコードでは、Leaderモデルのアソシエーションの配列は\
"Leader hasMany Follower"というリレーションシップを定義しています。\
コントローラーのアクションで、アソシエーションを削除するためにunbindModel()を\
使ってみましょう。 ::

    public function some_action() {
        // Leaderとそれに関連するFollowerを取得します。
        $this->Leader->find('all');
      
        // ここでhasManyを削除してみます
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // これでfindメソッドはLeaderは返すけど、Followerは返さなくなります
        $this->Leader->find('all');
      
        // 注: unbindModelは次に実行するfindにだけ影響します。
        // それ以上のfind呼び出しはモデルに設定したアソシエーション情報が再度使われます。
      
        // この時のfindでは既に、Leaderとそれに関連するFollowerを
        // 返すようになります。
        $this->Leader->find('all');
    }

.. note::

    bindModel()、unbindModel()を使って、アソシエーションの追加、削除をすると\
    2つ目のパラメータにfalseをセットしない限り、次の1回のfindだけに適用されます。\
    2つ目のパラメータに *false* がセットされていれば、bindMode()、unbindMode()で\
    設定された情報は残ります。

これはunbindModel()の基本的な使い方です。 ::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Now that we've successfully removed an association on the fly,
let's add one. Our as-of-yet unprincipled Leader needs some
associated Principles. The model file for our Principle model is
bare, except for the public $name statement. Let's associate some
Principles to our Leader on the fly (but remember–only for just the
following find operation). This function appears in the
LeadersController::
さて、アソシエーションの削除はできたので、次は追加をしてみましょう。\
今のところLeaderは、Principleへの関連がない状態です。\
Principleモデルは$nameプロパティを除いては空っぽの状態です。\
それでは、直接PrincipleをLeaderに関連付けてみましょう。\
LeadersControllerで次のようにします。 ::

    public function another_action() {
        // leader.phpモデルファイルでは、hasManyアソシエーションは定義されていません。
        // ここでのfindはLeaderのみ取得します。
        $this->Leader->find('all');
     
        // bindModel()を使ってLeaderモデルにアソシエーションを追加します。
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // アソシエーションが正しく追加されました。
        // これでLeaderと、それに関連するPrincipleを取得することができます。
        $this->Leader->find('all');
    }

bindModel()は基本的には、生成したいアソシエーションの名前がつけられた\
配列の中に、モデルに指定するのと同じアソシエーション配列をセットします。 ::


    $this->Model->bindModel(
        array('associationName' => array(
                'associatedModelClassName' => array(
                    // ここにモデルに指定するアソシエーション配列をセットします
                )
            )
        )
    );

通常、モデル結合については、モデルの中でのアソシエーションの定義順を気にする\
必要はありません。ただ、ここで説明した手順で新しくアソシエーションを定義する\
場合は、正しい順番でキーを指定する必要があります。

同じモデルに対する複数のリレーションシップ
------------------------------------------

同モデルに対して複数のリレーションを持つモデルを考えてみます。\
たとえばUserモデルへのリレーションを2つ持つMessageモデル。\
1つ目のリレーションは、メッセージを送信したユーザー、\
2つ目のリレーションは、メッセージを受け取ったユーザーです。\
この場合、messagesテーブルはuser\_idとrecipient\_idというフィールドを\
持っています。さて、ここではMessageモデルに次のように定義します。 ::

    class Message extends AppModel {
        public $name = 'Message';
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

RecipientはUserモデルに対するエイリアスです。Userモデルの方は\
このようになっています。 ::

    class User extends AppModel {
        public $name = 'User';
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
        public $name = 'Post';
        
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

テーブルに ``parent_id`` フィールドがある場合、 :ref:`model-find-threaded` を使えば、\
アソシエーションを定義せずに、1度のクエリ実行で入れ子になったデータを取得できます。

テーブルの結合
--------------

JOIN句を使って関連するテーブルを結合できます。\
これは複数テーブルを使った複雑なクエリを実行することができます。\
(たとえば、いくつかのtagsをもつpostsを検索する、など)

CakePHPのbelongsToとhasOneでは、関連データを取得するために\
自動的にjoinされたクエリが発行されます。

.. note::

    これを動作させるには以下のように、再帰に設定を-1にする必要があります。\
    $this->Channel->recursive = -1;

テーブルを結合するには、Model::find()の"モダン"な構文を使います。
$options配列の'joins'というキーを追加します。以下の例を見てください。 ::

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

    キーは'join'ではありませんので気をつけてください。

上記の例では、Itemモデルはchannelsテーブルにleft joinされます。\
モデルにテーブルの別名を定義することで、CakePHPの構造のデータを\
取得することができます。

オプションに指定できるキーは以下の通りです。


-  **table**: joinするテーブル。
-  **alias**: テーブルの別名。テーブルのモデルの名前と同じにするのが\
   良いです。
-  **type**: join種別。inner、left、rightのいずれかです。
-  **conditions**: joinの時の条件を指定します。

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

必要に応じてhasAndBelongsToManyでも、joinsを指定できます。

Book hasAndBelongsToMany Tag というアソシエーションを考えてみます。\
booksテーブルとtagsテーブルを繋げるために、中間テーブルとして\
books\_tagsテーブルを使うように定義してみます。 ::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.books_id'
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

joinsオプションを使えばCakePHPのアソシエーションとデータの取得を、\
非常に柔軟に扱うことができます。ただ、ほとんどの場合で、bindModelを使って\
直接モデルをバインドしたり、Containableビヘイビアを使うことで、\
通常のアソシエーションを定義した時と同じ結果を取得することができます。\
この機能は、モデルのアソシエーションと同時に使った場合、いくつかのケースで\
あまり良くないSQLクエリを発行することがあるので気をつけて使ってください。
