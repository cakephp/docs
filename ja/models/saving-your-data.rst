データを保存する
################

CakePHPはモデルのデータを簡単に保存できます。\
保存するデータは、モデルの ``save()`` メソッドに、以下の形式の配列で\
渡されます。 ::

    Array
    (
        [ModelName] => Array
        (
            [fieldname1] => 'value'
            [fieldname2] => 'value'
        )
    )

ほとんどの場合、このような形式を意識することはありません。\
CakePHPの :php:class:`FormHelper` やモデルのfindメソッドは\
全てこの形式に従っています。\
FormHelperを使っていれば、 ``$this->request->data`` で簡単にこの形式の\
データにアクセスできるようになっています。

データベースのテーブルにデータを保存するためにCakePHPのモデルを使った\
簡単なサンプルを以下に示します。 ::

    public function edit($id) {
        // フォームからポストされたデータがあるかどうか
        if ($this->request->is('post')) {
            // フォームのデータを検証して保存する...
            if ($this->Recipe->save($this->request->data)) {
                // メッセージをセットしてリダイレクトする
                $this->Session->setFlash('Recipe Saved!');
                $this->redirect('/recipes');
            }
        }

        // フォームからのデータがなければレシピデータを取得して
        // ビューへ渡す
        $this->set('recipe', $this->Recipe->findById($id));
    }

saveが呼び出されると、最初に引数に渡されたデータは、CakePHPのバリデーション機構によって\
検証されます(より詳しくは :doc:`/models/data-validation` を参照してください)。\
何かしらの理由でデータが保存されなかった場合は、バリデーションルールが\
おかしくないかどうか確認してみてください。\
:php:attr:`Model::$validationErrors` を出力することで、現在どういう状況なのかデバッグできます。 ::

    if ($this->Recipe->save($this->request->data)) {
        // 保存に成功した時の処理
    }
    debug($this->Recipe->validationErrors);

他に、データ保存に関連する便利なメソッドがいくつかあります。

:php:meth:`Model::set($one, $two = null)`
=========================================

``Model::set()`` は、モデルに1つまたは複数のフィールドのデータをセットするのに使われます。\
これは、モデルのActiveRecord機能を使う時に便利です。 ::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

この例は、 ActiveRecordで ``set()`` を使って単一のフィールドを更新して保存する方法です。\
複数のフィールドの値をセットするのにも ``set()`` が使えます。 ::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

上記の例では、titleとpublishedフィールドが保存されます。

:php:meth:`Model::save(array $data = null, boolean $validate = true, array $fieldList = array())`
=================================================================================================

このメソッドは配列の形式のデータを受け取ってそれを保存します。\
2つ目のパラメータはバリデーションをしない場合に使われ、\
3つめのパラメータは保存する対象のフィールドのリストを渡します。\
セキュリティ向上のために、 ``$fieldList`` を使って保存する対象の\
フィールドを制限することができます。

.. note::

    ``$fieldList`` が渡されなければ、もともとは変更する予定のなかったフィールドでも、\
    悪意のあるユーザーがフォームデータに任意のフィールドのデータを追加できてしまいます\
    (:php:class:`SecurityComponent` を使っていない場合)。\

以下のような引数を受け取るsaveメソッドもあります。 ::

    save(array $data = null, array $params = array())

``$params`` 配列には、以下のキーを指定できます。

* ``validate`` バリデーションの有効または無効について、trueまたはfalseを指定します。
* ``fieldList`` 保存する対象のフィールドのリストを指定します。
* ``callbacks`` falseをセットするとコールバックを無効にします。\
  他に'before'または'after'を指定して、コールバックを有効にできます。

モデルのコールバックについての詳細は :doc:`こちら <callback-methods>` を
参照してください。


.. tip::

    ``modified`` フィールドを自動更新したくない場合は、保存の際に ``$data`` 配列へ\
    ``'modified' => false`` を追加してください。

saveが完了すると、モデルオブジェクトの ``$id`` に保存されたデータのIDがセットされます。\
このプロパティは、特に新しくオブジェクトを生成した時に使われます。

::

    $this->Ingredient->save($newData);
    $newIngredientId = $this->Ingredient->id;

データを新しく作るか更新するかは、モデルの ``id`` フィールドによって決まります。\
``$Model->id`` がセットされていれば、このIDをプライマリーキーにもつレコードが更新されます。\
それ以外は新しくレコードが作られます。 ::

    // Create: idがセットされていない
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // Update: idに整数値がセットされている
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    ループ中でsaveを呼び出すときは、 ``create()`` を忘れないようにしてください。


新しくデータを作るのではなく、データを更新したい場合は、\
data配列にプライマリーキーのフィールドを渡してください。 ::

    $data = array('id' => 10, 'title' => 'My new title');
    // idが10のレシピを更新
    $this->Recipe->save($data);

:php:meth:`Model::create(array $data = array())`
================================================

このメソッドはデータを保存するためにモデルの状態をリセットします。
実際にはデータベースにデータは保存されませんが、Model::$idフィールドが\
クリアされ、データベースのフィールドのデフォルト値を元にModel::$dataの値を\
セットします。

``$data`` パラメータ(上記で説明したような配列の形式)が渡されれば、\
モデルのインスタンスは、渡されたデータを保存する準備ができます\
(データは ``$this->data`` でアクセスできます)。

配列の変わりに ``false`` を渡すと、モデルのスキーマ情報からのフィールド初期化はせずに、\
既にセットされているフィールドのデータのリセットのみを行い、残りのデータは破棄されます。\
これは、データベースに既に登録済みのデータを更新しないようにする場合に使ってください。

.. tip::

    既存のレコードを更新するのではなく新しくレコードを追加したい時は、\
    最初にcreate()を呼び出してください。これによって、コールバックの中や\
    他の場所からsaveメソッドを呼び出した時に、事前にコンフリクトを\
    避けることができます。

:php:meth:`Model::saveField(string $fieldName, string $fieldValue, $validate = false)`
======================================================================================

単一のフィールドを保存する時に使います。 ``saveField()`` を呼ぶ前には\
モデルのIDをセットしておいてください(``$this->ModelName->id = $id``)。\
また、 ``$fieldName`` にはモデル名 + フィールド名ではなく、フィールド名のみ\
含ませるようにしてください。

たとえば、ブログ投稿のタイトルを更新する場合は、コントローラーからの
``saveField`` の呼び出しは以下のようになります。 ::

    $this->Post->saveField('title', 'A New Title for a New Day');

.. warning::

    このメソッドを使うと、 ``modified`` フィールドは更新されてしまいます。\
    更新したく無い場合はsave()メソッドを使う必要があります。

:php:meth:`Model::updateAll(array $fields, array $conditions)`
==============================================================

このメソッドは、1度の呼び出しで複数のレコードを更新できます。\
更新対象のレコードは ``$conditions`` で、更新対象のフィールドとその値は\
``$fields`` で指定します。

たとえば、1年以上前にメンバーになったbakerを承認するには、\
以下のようにメソッドを呼び出します。 ::

    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $this_year)
    );

.. tip::

    $fieldsにはSQLも指定できます。\
    リテラルは :php:meth:`Sanitize::escape()` を使って手動でクォートしてください。

.. note::

    このメソッドは、modifiedフィールドがテーブルにあっても\
    自動的に更新してくれません。modifiedフィールドも更新したければ\
    配列に追加してください。

これは、特定の顧客に紐付くチケットを全て閉じる例です。 ::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

デフォルトでは、updateAll()は自動的にbelongsToアソシエーション先を結合します。\
必要なければ、このメソッドを呼ぶ前に一時的にアソシエーションを解除してください。

:php:meth:`Model::saveMany(array $data = null, array $options = array())`
=========================================================================

このメソッドは、同じモデルの複数のレコードを一度に保存するために使います。\
以下のオプションが指定できます。

* ``validate``: バリデーションを実行しない場合にfalseを指定します。trueを指定すると\
  各レコードの保存前にバリデーションを行います。'first'を指定すると、データの保存前に\
  *全て* のレコードのバリデーションを行います(これがデフォルトです)。
* ``atomic``: trueを指定すると(デフォルト)、単一のトランザクションで全レコードを保存しようとします。\
  データベースがトランザクションをサポートしていない場合はfalseを指定してください。
* ``fieldList``: Model::save()の$fieldListパラメータと同じです。
* ``deep``: trueを指定すると、アソシエーションのデータも保存されます。saveAssociatedについても\
  参照してください(このオプションは2.1以降)。

単一モデルで複数レコードを保存するためには、$data配列は以下のように\
数値をインデックスとしてもつ配列である必要があります。 ::

    $data = array(
        array('title' => 'title 1'),
        array('title' => 'title 2'),
    );

.. note::

    いつものようにモデル名Articleというキーの ``$data`` 配列ではなく、\
    数値のインデックスを渡していることに注意してください。\
    同じモデルで複数のレコードを保存する時は、レコードの配列は\
    モデル名がキーではなく数値がキーである必要があります。

以下のような形式のデータでも受け取る事ができます。 ::

    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    );

2.1からですが、 ``$options['deep'] = true`` と指定することで、アソシエーションデータも\
保存できます。 以下の例を見てください。 ::

    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    );
    $data = array(
        array('Article' => array('title' => 'title 1'), 'Assoc' => array('field' => 'value')),
        array('Article' => array('title' => 'title 2')),
    );
    $Model->saveMany($data, array('deep' => true));

新しくレコードを作るのではなく、既存レコードの更新をしたい場合は、\
データ配列にプライマリーキーを追加してください。 ::

    $data = array(
        array('Article' => array('title' => 'New article')), // これは新しくレコードを作ります
        array('Article' => array('id' => 2, 'title' => 'title 2')), // これは既存のレコードを更新します
    );


:php:meth:`Model::saveAssociated(array $data = null, array $options = array())`
===============================================================================

一度に複数のアソシエーションモデルのデータを保存するのに使われるメソッドです。\
$options配列には以下のキーが使われます。

* ``validate``: バリデーションを実行しない場合にfalseを指定します。trueを指定すると\
  各レコードの保存前にバリデーションを行います。'first'を指定すると、データの保存前に\
  *全て* のレコードのバリデーションを行います(これがデフォルトです)。
* ``atomic``: trueを指定すると(デフォルト)、単一のトランザクションで全レコードを保存しようとします。\
  データベースがトランザクションをサポートしていない場合はfalseを指定してください。
* ``fieldList``: Model::save()の$fieldListパラメータと同じです。
* ``deep``: (2.1から) trueを指定すると、1階層目のアソシエーションのデータだけでなく、より深い階層の\
  アソシエーションのデータも保存されます。デフォルトではfalseです。

hasOneまたはbelongsToアソシエーションの関連レコードと一緒にレコードを保存する場合は、\
データ配列は以下のようになります。 ::

    $data = array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    );

hasManyアソシエーションの関連レコードを保存するには、\
以下のようなデータ配列を準備してください。 ::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    );

2階層以上のhasManyアソシエーションの関連レコードを保存するには、\
以下のようなデータを準備してください。 ::

    $data = array(
        'User' => array('email' => 'john-doe@cakephp.org'),
        'Cart' => array(
            array(
                'payment_status_id' => 2,
                'total_cost' => 250,
                'CartItem' => array(
                    array(
                        'cart_product_id' => 3,
                        'quantity' => 1,
                        'cost' => 100,
                    ),
                    array(
                        'cart_product_id' => 5,
                        'quantity' => 1,
                        'cost' => 150,
                    )
                )
            )
        )
    );

.. note::

    メインのモデルの外部キーは、関連モデルのidフィールドに保存されます。\
    (``$this->RelatedModel->id`` のように)

.. warning::

    bool値の代わりに配列を戻り値としたい場合は、\
    saveAssociatedを呼ぶ時に、$optionsのatomicキーにfalseをセットしてください。

.. versionchanged:: 2.1
    ``$options['deep'] = true`` とすることで、2階層以上のデータを保存できるようになりました。

hasManyアソシエーションの関連レコードを保存して、同時にComment belongsTo User という\
アソシエーションのデータも保存するには、以下のようなデータ配列を準備します。 ::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Save a new user as well', 'User' => array('first' => 'mad', 'last' => 'coder')),
        ),
    );

そしてこのようにして保存してください。 ::

    $Article->saveAssociated($data, array('deep' => true));

.. versionchanged:: 2.1
    ``Model::saveAll()`` とそれに関連するメソッドは、複数モデルに対応する `fieldList` を\
    受け取ることができるようになりました。

このようにして、複数モデルに対応する ``fieldList`` を渡すことができます。 ::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

fieldListはキーにモデルのエイリアスを、値にフィールドの値一覧を配列で指定します。\
モデル名はネストしません。

:php:meth:`Model::saveAll(array $data = null, array $options = array())`
========================================================================

``saveAll`` は ``saveMany`` と ``saveAssociated`` のラッパーです。\
このメソッドはデータ内容をみて、 ``saveMany`` か ``saveAssociated`` のどちらを使うのかを決定します。\
データの添字が数値であれば ``saveMany`` を、それ以外は ``saveAssociated`` を呼び出します。

このメソッドは、前に説明した2つのメソッド(saveManyとsaveAssociated)と互換性があり、\
同じオプション引数をとります。場合によって、 ``saveMany`` または ``saveAssociated`` を\
使ったほうがいいこともあります。


関連データを保存する(hasOne, hasMany, belongsTo)
================================================

モデルがアソシエーションを持っている時、対応するCakePHPのモデルが\
データを保存するべきです。新しい投稿とそれに関連するコメントを保存する場合、\
PostとCommentの両方のモデルを使うことになります。

関連モデルのレコードがまだ存在していない場合、\
(たとえば、新しいユーザーとそのユーザーに関連するプロフィールを同時に作る場合)
まずは元となるモデルのデータを保存しないといけません。

さて、この場合どうすればうまくいくでしょうか。新しいユーザーと\
関連するプロフィールを保存するためのUsersControllerのアクションがあるとします。\
以下に示すサンプルは、ひとつのユーザーとひとつのプロフィールを生成するためのデータを\
FormHelperを使ってPOSTしたときの処理です。 ::

    public function add() {
        if (!empty($this->request->data)) {
            // $this->request->data['User']のデータでユーザーデータを保存します。
            $user = $this->User->save($this->request->data);

            // ユーザーデータが保存できたら、その情報をプロフィールデータに追記して
            // プロフィールを保存します。
            if (!empty($user)) {
                // 新しく作られたユーザーのIDは$this->User->idにセットされています。
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // User hasOne Profileというアソシエーションをもっているため
                // Userモデルを介してProfileモデルにアクセスできます。
                $this->User->Profile->save($this->request->data);
            }
        }
    }

hasOne, hasMany, belongsToといったアソシエーションは、すべてキーを元に考えます。\
基本的には、あるモデルから取得したキーを他のモデルの外部キーフィールドに\
セットします。これは、モデルで ``save()`` してから、そのモデルの ``$id`` 属性に\
セットされた値かもしれませんし、そうではなくて、コントローラのアクションに\
POSTされたhiddenフォームからのIDかもしれません。

この基本的なアプローチを補助するために、CakePHPは1度に複数のモデルの\
バリデーションとデータ保存をしてくれる ``saveAssociated()`` という\
便利なメソッドを提供しています。\
また、 ``saveAssociated()`` はデータベースの整合性を確保するために\
トランザクションの機能もサポートしています。\
(つまり、あるモデルがデータ保存に失敗した場合は、他のモデルのデータも保存されません)

.. note::

    MySQLでトランザクションが正常に動作するためには、テーブルがInnoDBである\
    必要があります。MyISAMはトランザクションをサポートしていません。

``saveAssociated()`` を使ってCompanyモデルとAccountモデルを同時に保存する方法を\
見てみましょう。

まず、CompanyモデルとAccountモデルのフォームを作ります。\
(ここではCompany hasMany Account の関係があるとします) ::

    echo $form->create('Company', array('action' => 'add'));
    echo $form->input('Company.name', array('label' => 'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');

    echo $form->input('Account.0.name', array('label' => 'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');

    echo $form->end('Add');

Accountモデルに対するフィールドを作っています。\
Companyモデルがメインの場合、 ``saveAssociated()`` は、関連するモデルデータ(Accountモデル)が\
特定のフォーマットで渡ってくることを期待します。 それが、 ``Account.0.fieldName`` という\
名前です。

.. note::

    上記のような名前の付け方は、hasManyアソシエーションの場合です。\
    hasOneの場合は、ModelName.fieldNameという名前を付けます。

そして、CompaniesControllerに ``add()`` アクションを作ります。 ::

    public function add() {
        if (!empty($this->request->data)) {
            // バリデーションエラーを出さないために以下のようにします。
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

これだけです。これでCompanyモデルとAccountモデルはバリデーションが行われ、\
同時にデータの保存もされました。デフォルトで ``saveAssociated`` は\
各データの保存時に渡された値をすべて検証します。

hasManyを保存する
=================

結合された2つのテーブルのモデルのデータがどうやって保存されるのかを見て行きましょう。\
:ref:`hasMany-through` セクションにあるように、結合されたそれぞれのテーブルは `hasMany`
アソシエーションで関連付けられています。ここでは、生徒の授業への出席日数と成績を\
記録するアプリケーションをサンプルとして書いてみたいと思います。\
以下のコードを見て下さい。 ::

   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set('courseMembershipsList', $this->CourseMembership->find('all'));
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   $this->redirect(array('action' => 'index'));
               }
           }
       }
   }

   // View/CourseMemberships/add.ctp

   <?php echo $this->Form->create('CourseMembership'); ?>
       <?php echo $this->Form->input('Student.first_name'); ?>
       <?php echo $this->Form->input('Student.last_name'); ?>
       <?php echo $this->Form->input('Course.name'); ?>
       <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
       <?php echo $this->Form->input('CourseMembership.grade'); ?>
       <button type="submit">Save</button>
   <?php echo  $this->Form->end(); ?>


このコードで、データをサブミットした時、以下のような配列が渡ってきます。 ::

    Array
    (
        [Student] => Array
        (
            [first_name] => Joe
            [last_name] => Bloggs
        )

        [Course] => Array
        (
            [name] => Cake
        )

        [CourseMembership] => Array
        (
            [days_attended] => 5
            [grade] => A
        )

    )

Cakeはこれらの配列を `saveAssociated` に渡すことで、各モデルのデータを同時に保存し、\
CourseMembershipモデルに対してStudentとCourseを外部キーとして割り当てることができます。\
CourseMembershipsControllerのindexアクションが実行されると、そこのfind('all')で\
以下のような構造のデータが取得できます。 ::

    Array
    (
        [0] => Array
        (
            [CourseMembership] => Array
            (
                [id] => 1
                [student_id] => 1
                [course_id] => 1
                [days_attended] => 5
                [grade] => A
            )

            [Student] => Array
            (
                [id] => 1
                [first_name] => Joe
                [last_name] => Bloggs
            )

            [Course] => Array
            (
                [id] => 1
                [name] => Cake
            )
        )
    )

もちろん結合されたモデルを処理する方法は他にもあります。\
このやり方は一度に全てを保存したい時に使うものです。\
StudentとCourseをそれぞれ別々に作りたい場合もあるでしょう。\
また後でCourseMembershipに関連付けることもあるでしょう。\
ですので、リストやIDから既存のStudentとCourseを選んで、それらを\
登録するフォームがあれば、たとえばCourseMembershipに対する\
フィールドを次のように作ります。 ::

        // View/CourseMemberships/add.ctp

        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $this->Form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

POSTされると以下のようなデータが渡ってきます。 ::

    Array
    (
        [Student] => Array
        (
            [id] => 1
        )

        [Course] => Array
        (
            [id] => 1
        )

        [CourseMembership] => Array
        (
            [days_attended] => 10
            [grade] => 5
        )
    )

このデータを使えば `saveAssociated` はStudentのIDとCourseのIDを\
CourseMembershipモデルに保存してくれます。

.. _saving-habtm:

関連データを保存する(HABTM)
---------------------------

hasOne, belongsTo, hasManyのアソシエーションがあるモデルの保存は\
とても簡単です。アソシエーションモデルのIDを外部キーとして指定するだけです。\
それが準備できれば、モデルの ``save()`` メソッドを呼ぶだけで、\
あとは勝手にアソシエーションモデルと繋げてくれます。\
Tagモデルの ``save()`` に対しては、以下のような形式のデータを\
渡します。 ::

    Array
    (
        [Recipe] => Array
            (
                [id] => 42
            )
        [Tag] => Array
            (
                [name] => Italian
            )
    )

以下のような配列を使えば、 ``saveAll()`` でHABTMアソシエーションに対して\
複数のレコードを保存するのにも使えます。 ::

    Array
    (
        [0] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Italian
                    )
            )
        [1] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Pasta
                    )
            )
        [2] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 51
                    )
                [Tag] => Array
                    (
                        [name] => Mexican
                    )
            )
        [3] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 17
                    )
                [Tag] => Array
                    (
                        [name] => American (new)
                    )
            )
    )

上記の配列を ``saveAll()`` に渡せば、それぞれの関連するRecipeに\
Tagを含むデータが生成されます。

Tagを新しく作って、いくつかのレシピに関連付けるための\
適切な配列を生成してくれるフォームを作ってみます。

このフォームを簡単に実装すると以下のようになります\
(``$recipe_id`` は何かしらの値がセットされているものとします) ::

    <?php echo $this->Form->create('Tag'); ?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)
        ); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

この例では、 タグとリンクさせたいレシピのIDが値としてセットされている\
``Recipe.id`` というhiddenフィールドがあるのがわかります。

``save()`` メソッドがコントローラーから呼ばれれば、自動的に\
HABTMデータをデータベースに保存します。 ::

    public function add() {
        // アソシエーションデータを保存
        if ($this->Tag->save($this->request->data)) {
            // 保存が成功した時の処理
        }
    }

これで、新しいTagが作られて、レシピに関連付けられました。\
レシピのIDは ``$this->request->data['Recipe']['id']`` にセットされています。

関連データを表現する方法としては、ドロップダウンリストがあります。\
``find('list')`` を使って、モデルからデータを引っ張ってきて、\
モデルの名前のビュー変数に割り当てます。inputの引数に変数の名前と同じ値を指定すれば\
``<select>`` の中に自動的にデータを引っ張ってきてくれます。 ::

    // コントローラーのコード
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // ビューのコード
    $form->input('tags');

HABTMを使ったもうひとつのシナリオとしては、 複数選択できる ``<select>``
の場合です。たとえば、レシピは複数のタグを持つことがでるとします。\
データは先ほどと同じ様にモデルから取得してきますが、\
フォームの作り方が少し違います。タグ名のフォームは ``ModelName`` (モデル名)を\
渡すことで生成されます。 ::

    // コントローラーのコード
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // ビューのコード
    $this->Form->input('Tag');

これで、既存のレシピに対して、複数タグを選択できる\
セレクトボックスが生成されます。

HABTMが複雑になったらどうすればよいか？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

デフォルトではCakeでHasAndBelongsToManyアソシエーションを保存するとき、\
新しくデータを追加するまえに中間テーブルのデータが一旦すべて削除されます。\
たとえば、10個のChildrenを持つClubがあるとします。\
この時に2つのChildrenだけを更新した場合、Childrenは12個になるのではなく\
2個になります。

また、HTBTMの中間テーブルにフィールド(データ生成時刻やメタ項目など)を追加\
したい場合は、簡単なオプションがあることを覚えておいてください。

2つのモデル間のHasAndBelongsToManyは、実際にはhasManyとbelongsToの\
アソシエーションを通して関連付けられる3つのモデルの短縮形です。

この例で考えてみましょう。 ::

    Child hasAndBelongsToMany Club

考え方を変えて、Membershipモデルを追加してみます。 ::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

これらの2つの例は同じ意味です。データベースに同じフィールドをもち、\
同じモデルが対応します。違うのは、"中間"モデルに付けられる名前と、\
その振る舞いがよりわかりやすいということです。

.. tip::

    中間テーブルが、2つの関連テーブルへの外部キーの他にフィールドを\
    持っている場合、 ``'unique'`` キーに ``'keepExisting'`` を指定することで\
    外部キー以外の拡張フィールドが消えないようになります。\
    'unique' => true としても同じようなことで、保存時に拡張フィールドの\
    データが消えないようになります。\
    :ref:`HABTMアソシエーションのパラメータ <ref-habtm-arrays>` も参考にしてください。

ですが、ほとんどの場合、中間テーブルに対応するモデルは簡単に作れますし、\
HABTMを使う代わりにhasManyやbelongsToアソシエーションを使ってもできます。

データテーブル
==============

CakePHPは特定のDBMSに依存しないように設計されていて、MySQL, MSSQL, PostgreSQL, \
また他のDBMSでも動作します。いつもやってるようにデータベースにテーブルを作れます。\
モデルクラスを作れば、自動的にデータベースに作ったテーブルにマッピングされます。\
テーブル名は規約に従って、小文字の複数形にして、単語同士はアンダースコアで区切ります。\
たとえば、Ingredientというクラスはingredientsというテーブル名と対応します。\
EventRegistrationというクラスはevent_registrationsというテーブル名と対応します。\
CakePHPは各フィールドの型を取得するためにテーブルについて調べます。\
そしてこの情報はビュー内でのフォームへの出力など、様々な機能で使われています。\
フィールド名は規約に従って、小文字のアンダースコア区切りとします。

createdとmodified
-----------------

createdやmodifiedといった日付型のフィールドをデータベースのテーブルに定義しておけば、\
CakePHPはそれらのフィールドを認識して、自動的にレコードの保存または更新時に\
セットされます\
(保存されるデータ配列にcreatedやmodifiedフィールドが含まれていない場合に限る)。

createdとmodifiedフィールドには、新しくレコードが追加されるときには現在の日時がセットされます。\
modifiedフィールドは既存のレコードが更新された時に、現在の日時がセットされます。

Model::save()を呼び出す前に、 ``created`` や ``modified`` のキーが$this->dataにあると、\
自動的に更新はされずに、$this->dataの値が使われます。自動的に更新したい場合は、\
``unset($this->data['Model']['modified']`` などとします。または、Model::save()を\
オーバーライドして、常にunsetの動作をするようにも出来ます。 ::

    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) {
            // 保存前にmodifiedフィールドをクリアする
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }
