データを保存する
################

CakePHP はモデルのデータを簡単に保存できます。保存するデータは、
モデルの ``save()`` メソッドに、以下の形式の配列で渡されます。 ::

    Array
    (
        [ModelName] => Array
        (
            [fieldname1] => 'value'
            [fieldname2] => 'value'
        )
    )

ほとんどの場合、このような形式を意識することはありません。
CakePHP の :php:class:`FormHelper` やモデルの find メソッドは
全てこの形式に従っています。 :php:class:`FormHelper` を使っていれば、
``$this->request->data`` で簡単にこの形式のデータにアクセスできます。

データベースのテーブルにデータを保存するために CakePHP のモデルを使った
簡単なサンプルを以下に示します。 ::

    public function edit($id) {
        // フォームからポストされたデータがあるかどうか
        if ($this->request->is('post')) {
            // フォームのデータを検証して保存する...
            if ($this->Recipe->save($this->request->data)) {
                // メッセージをセットしてリダイレクトする
                $this->Session->setFlash('Recipe Saved!');
                return $this->redirect('/recipes');
            }
        }

        // フォームからのデータがなければレシピデータを取得して
        // ビューへ渡す
        $this->set('recipe', $this->Recipe->findById($id));
    }

save が呼び出されると、最初に引数に渡されたデータは、CakePHP のバリデーション機構によって
検証されます (より詳しくは :doc:`/models/data-validation` を参照してください)。
何かしらの理由でデータが保存されなかった場合は、バリデーションルールがおかしくないかどうか
確認してみてください。 :php:attr:`Model::$validationErrors` を出力することで、
現在どういう状況なのかデバッグできます。 ::

    if ($this->Recipe->save($this->request->data)) {
        // 保存に成功した時の処理
    }
    debug($this->Recipe->validationErrors);

他に、データ保存に関連する便利なメソッドがいくつかあります。

`Model::set($one, $two = null)`
===============================

``Model::set()`` は、モデルに1つまたは複数のフィールドのデータをセットするのに使われます。
これは、モデルの ActiveRecord 機能を使う時に便利です。 ::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

この例は、 ActiveRecord　で ``set()`` を使って単一のフィールドを更新して保存する方法です。
複数のフィールドの値をセットするのにも ``set()`` が使えます。 ::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

上記の例では、title と published フィールドが保存されます。

`Model::clear()`
================

このメソッドは、モデルの状態をリセットし、保存していないデータやバリデーションエラーを
リセットするために使用します。

.. versionadded:: 2.4

`Model::save(array $data = null, boolean $validate = true, array $fieldList = array())`
=======================================================================================

このメソッドは配列の形式のデータを受け取ってそれを保存します。
2つ目のパラメータはバリデーションをしない場合に使われ、
3つめのパラメータは保存する対象のフィールドのリストを渡します。
セキュリティ向上のために、 ``$fieldList`` を使って保存する対象の
フィールドを制限することができます。

.. note::

    ``$fieldList`` が渡されなければ、もともとは変更する予定のなかったフィールドでも、
    悪意のあるユーザーがフォームデータに任意のフィールドのデータを追加できてしまいます
    (:php:class:`SecurityComponent` を使っていない場合)。

以下のような引数を受け取るsaveメソッドもあります。 ::

    save(array $data = null, array $params = array())

``$params`` 配列には、以下のキーを指定できます。

* ``validate`` バリデーションの有効または無効について、true または false を指定します。
* ``fieldList`` 保存する対象のフィールドのリストを指定します。
* ``callbacks`` false をセットするとコールバックを無効にします。
  他に 'before' または 'after' を指定して、コールバックを有効にできます。
* ``counterCache`` (2.4 以降) カウンターキャッシュの更新を制御するための真偽値。(任意)
* ``atomic`` (2.6 以降) ひとつのトランザクション内でレコードを保存したいことを示すための真偽値。

モデルのコールバックについての詳細は :doc:`こちら <callback-methods>` を
参照してください。

.. tip::

    ``modified`` フィールドを自動更新したくない場合は、保存の際に ``$data`` 配列へ
    ``'modified' => false`` を追加してください。

save が完了すると、モデルオブジェクトの ``$id`` に保存されたデータの ID がセットされます。
このプロパティは、特に新しくオブジェクトを生成した時に使われます。

::

    $this->Ingredient->save($newData);
    $newIngredientId = $this->Ingredient->id;

データを新しく作るか更新するかは、モデルの ``id`` フィールドによって決まります。
``$Model->id`` がセットされていれば、この ID をプライマリーキーにもつレコードが更新されます。
それ以外は新しくレコードが作られます。 ::

    // Create: id がセットされていない
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // Update: id に整数値がセットされている
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    ループ中で save を呼び出すときは、 ``create()`` を忘れないようにしてください。


新しくデータを作るのではなく、データを更新したい場合は、
data 配列にプライマリーキーのフィールドを渡してください。 ::

    $data = array('id' => 10, 'title' => 'My new title');
    // id が 10 のレシピを更新
    $this->Recipe->save($data);

`Model::create(array $data = array())`
======================================

このメソッドはデータを保存するためにモデルの状態をリセットします。
実際にはデータベースにデータは保存されませんが、 Model::$id フィールドが
クリアされ、データベースのフィールドのデフォルト値を元に Model::$data の値を
セットします。データベースフィールドのデフォルト値が存在しない場合、
Model::$data には空の配列がセットされます。

``$data`` パラメータ (上記で説明したような配列の形式) が渡されれば、
データベースフィールドのデフォルト値とマージされ、モデルのインスタンスは
データを保存する準備ができます (データは ``$this->data`` でアクセスできます)。

``$data`` パラメータへ ``false`` や ``null`` が渡された場合、
Model::$data には空の配列がセットされます。

.. tip::

    既存のレコードを更新するのではなく新しくレコードを追加したい時は、
    最初に create() を呼び出してください。これによって、コールバックの中や
    他の場所から save メソッドを呼び出した時に、事前にコンフリクトを
    避けることができます。

`Model::saveField(string $fieldName, string $fieldValue, $validate = false)`
============================================================================

単一のフィールドを保存する時に使います。 ``saveField()`` を呼ぶ前には
モデルの ID をセットしておいてください (``$this->ModelName->id = $id``)。
また、 ``$fieldName`` にはモデル名 + フィールド名ではなく、フィールド名のみ
含ませるようにしてください。

たとえば、ブログ投稿のタイトルを更新する場合は、コントローラーからの
``saveField`` の呼び出しは以下のようになります。 ::

    $this->Post->saveField('title', 'A New Title for a New Day');

.. warning::

    このメソッドを使うと、 ``modified`` フィールドは更新されてしまいます。
    更新したく無い場合は save() メソッドを使う必要があります。

saveField メソッドは、別の構文を持っています::

    saveField(string $fieldName, string $fieldValue, array $params = array())

``$params``  配列には、以下のキーを指定できます。

* ``validate`` バリデーションの有効または無効について、true または false を指定します。
* ``callbacks`` コールバックを無効にするには false を指定します。
  'before' や 'after' を指定すると、それらのコールバックだけが有効になります。
* ``counterCache`` (2.4 以降) カウンターキャッシュの更新を制御するための真偽値。(任意)

`Model::updateAll(array $fields, mixed $conditions)`
====================================================

このメソッドは、1度の呼び出しで複数のレコードを更新できます。
更新対象のフィールドとその値は ``$fields`` 配列で指定します。
更新対象のレコードは ``$conditions`` 配列で指定します。
もし ``$conditions`` 引数が指定していない場合や、
``true`` が設定されている場合、全てのレコードが更新されます。

たとえば、1年以上前にメンバーになった baker を承認するには、
以下のようにメソッドを呼び出します。 ::

    $thisYear = date('Y-m-d H:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $thisYear)
    );

``$fields`` 配列は SQL も指定できます。リテラル値は :php:meth:`DboSource::value()`
を使用して、自分でクォートしなければなりません。例えば、モデルのメソッドの中で
``updateAll()`` が呼び出された場合、以下のようにします。 ::

    $db = $this->getDataSource();
    $value = $db->value($value, 'string');
    $this->updateAll(
        array('Baker.status' => $value),
        array('Baker.status' => 'old')
    );

.. note::

    このメソッドは、modified フィールドがテーブルにあっても
    自動的に更新してくれません。modified フィールドも更新したければ
    配列に追加してください。

これは、特定の顧客に紐付くチケットを全て閉じる例です。 ::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

デフォルトでは、updateAll() は自動的に belongsTo アソシエーション先を結合します。
必要なければ、このメソッドを呼ぶ前に一時的にアソシエーションを解除してください。

`Model::saveMany(array $data = null, array $options = array())`
===============================================================

このメソッドは、同じモデルの複数のレコードを一度に保存するために使います。
以下のオプションが指定できます。

* ``validate``: バリデーションを実行しない場合に false を指定します。true を指定すると
  各レコードの保存前にバリデーションを行います。'first' を指定すると、データの保存前に
  *全て* のレコードのバリデーションを行います (これがデフォルトです)。
* ``atomic``: true を指定すると (デフォルト)、単一のトランザクションで全レコードを保存しようとします。
  データベースがトランザクションをサポートしていない場合はfalseを指定してください。
* ``fieldList``: Model::save() の $fieldList パラメータと同じです。
* ``deep``: true を指定すると、アソシエーションのデータも保存されます。saveAssociated についても
  参照してください (このオプションは2.1以降)。
* ``callbacks`` コールバックを無効にするには false を指定します。
  'before' や 'after' を指定すると、それらのコールバックだけが有効になります。
* ``counterCache`` (2.4 以降) カウンターキャッシュの更新を制御するための真偽値。(任意)

単一モデルで複数レコードを保存するためには、$data 配列は以下のように
数値をインデックスとしてもつ配列である必要があります。 ::

    $data = array(
        array('title' => 'title 1'),
        array('title' => 'title 2'),
    );

.. note::

    いつものようにモデル名 Article というキーの ``$data`` 配列ではなく、
    数値のインデックスを渡していることに注意してください。
    同じモデルで複数のレコードを保存する時は、レコードの配列は
    モデル名がキーではなく数値がキーである必要があります。

以下のような形式のデータでも受け取る事ができます。 ::

    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    );

2.1 以降、 ``$options['deep'] = true`` と指定することで、アソシエーションデータも
保存できます。 以下の例を見てください。 ::

    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    );
    $data = array(
        array(
            'Article' => array('title' => 'title 1'),
            'Assoc' => array('field' => 'value')
        ),
        array('Article' => array('title' => 'title 2')),
    );
    $Model->saveMany($data, array('deep' => true));

新しくレコードを作るのではなく、既存レコードの更新をしたい場合は、
データ配列にプライマリーキーを追加してください。 ::

    $data = array(
        array(
            // これは新しくレコードを作ります
            'Article' => array('title' => 'New article')),
        array(
            // これは既存のレコードを更新します
            'Article' => array('id' => 2, 'title' => 'title 2')),
    );


.. _Model-saveAssociated:

`Model::saveAssociated(array $data = null, array $options = array())`
=====================================================================

一度に複数のアソシエーションモデルのデータを保存するのに使われるメソッドです。
$options 配列には以下のキーが使われます。

* ``validate``: バリデーションを実行しない場合に false を指定します。true を指定すると
  各レコードの保存前にバリデーションを行います。 'first' を指定すると、データの保存前に
  *全て* のレコードのバリデーションを行います(これがデフォルトです)。
* ``atomic``: true を指定すると (デフォルト)、単一のトランザクションで全レコードを保存しようとします。
  データベースがトランザクションをサポートしていない場合は false を指定してください。
* ``fieldList``: Model::save() の $fieldList パラメータと同じです。
* ``deep``: (2.1 以降) true を指定すると、1階層目のアソシエーションのデータだけでなく、より深い階層の
  アソシエーションのデータも保存されます。デフォルトでは false です。
* ``counterCache`` (2.4 以降) カウンターキャッシュの更新を制御するための真偽値。(任意)

hasOne または belongsTo アソシエーションの関連レコードと一緒にレコードを保存する場合は、
データ配列は以下のようになります。 ::

    $data = array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    );

hasMany アソシエーションの関連レコードを保存するには、
以下のようなデータ配列を準備してください。 ::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    );

2階層以上の hasMany アソシエーションの関連レコードを保存するには、
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

    メインのモデルの外部キーは、関連モデルのidフィールドに保存されます。
    (``$this->RelatedModel->id`` のように)

hasMany アソシエーションの関連レコードを保存して、同時に Comment belongsTo User という
アソシエーションのデータも保存するには、以下のようなデータ配列を準備します。 ::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array(
                'body' => 'Save a new user as well',
                'User' => array('first' => 'mad', 'last' => 'coder')
            ),
        ),
    );

そしてこのようにして保存してください。 ::

    $Article->saveAssociated($data, array('deep' => true));

.. warning::

    bool 値の代わりに配列を戻り値としたい場合は、
    saveAssociated を呼ぶ時に、$options の atomic キーに false をセットしてください。

このようにして、複数モデルに対応する ``fieldList`` を渡すことができます。 ::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

fieldList はキーにモデルのエイリアスを、値にフィールドの値一覧を配列で指定します。
モデル名はネストしません。

.. versionchanged:: 2.1
    ``Model::saveAll()`` とそれに関連するメソッドは、複数モデルに対応する `fieldList` を
    受け取ることができるようになりました。

    ``$options['deep'] = true`` とすることで、2階層以上のデータを保存できるようになりました。

`Model::saveAll(array $data = null, array $options = array())`
==============================================================

``saveAll`` は ``saveMany`` と ``saveAssociated`` のラッパーです。
このメソッドはデータ内容をみて、 ``saveMany`` か ``saveAssociated`` のどちらを使うのかを決定します。
データの添字が数値であれば ``saveMany`` を、それ以外は ``saveAssociated`` を呼び出します。

このメソッドは、前に説明した2つのメソッド (saveMany と saveAssociated) と互換性があり、
同じオプション引数をとります。場合によって、 ``saveMany`` または ``saveAssociated`` を
使ったほうがいいこともあります。


関連データを保存する (hasOne, hasMany, belongsTo)
=================================================

モデルがアソシエーションを持っている時、対応する CakePHP のモデルが
データを保存するべきです。新しい投稿とそれに関連するコメントを保存する場合、
Post と Comment の両方のモデルを使うことになります。

関連モデルのレコードがまだ存在していない場合、
(たとえば、新しいユーザーとそのユーザーに関連するプロフィールを同時に作る場合)
まずは元となるモデルのデータを保存しないといけません。

さて、この場合どうすればうまくいくでしょうか。新しいユーザーと
関連するプロフィールを保存するための UsersController のアクションがあるとします。
以下に示すサンプルは、ひとつのユーザーとひとつのプロフィールを生成するためのデータを
FormHelper を使って POST したときの処理です。 ::

    public function add() {
        if (!empty($this->request->data)) {
            // $this->request->data['User'] のデータでユーザーデータを保存します。
            $user = $this->User->save($this->request->data);

            // ユーザーデータが保存できたら、その情報をプロフィールデータに追記して
            // プロフィールを保存します。
            if (!empty($user)) {
                // 新しく作られたユーザーの ID は $this->User->id にセットされています。
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // User hasOne Profile というアソシエーションをもっているため
                // User モデルを介して Profile モデルにアクセスできます。
                $this->User->Profile->save($this->request->data);
            }
        }
    }

hasOne, hasMany, belongsTo といったアソシエーションは、すべてキーを元に考えます。
基本的には、あるモデルから取得したキーを他のモデルの外部キーフィールドに
セットします。これは、モデルで ``save()`` してから、そのモデルの ``$id`` 属性に
セットされた値かもしれませんし、そうではなくて、コントローラのアクションに
POST された hidden フォームからの ID かもしれません

この基本的なアプローチを補助するために、CakePHP は1度に複数のモデルの
バリデーションとデータ保存をしてくれる ``saveAssociated()`` という
便利なメソッドを提供しています。
また、 ``saveAssociated()`` はデータベースの整合性を確保するために
トランザクションの機能もサポートしています。
(つまり、あるモデルがデータ保存に失敗した場合は、他のモデルのデータも保存されません)

.. note::

    MySQL でトランザクションが正常に動作するためには、テーブルが InnoDB である
    必要があります。MyISAM はトランザクションをサポートしていません。

``saveAssociated()`` を使って Company モデルと Account モデルを同時に保存する方法を
見てみましょう。

まず、Company モデルと Account モデルのフォームを作ります。
(ここでは Company hasMany Account の関係があるとします) ::

    echo $this->Form->create('Company', array('action' => 'add'));
    echo $this->Form->input('Company.name', array('label' => 'Company name'));
    echo $this->Form->input('Company.description');
    echo $this->Form->input('Company.location');

    echo $this->Form->input('Account.0.name', array('label' => 'Account name'));
    echo $this->Form->input('Account.0.username');
    echo $this->Form->input('Account.0.email');

    echo $this->Form->end('Add');

Account モデルに対するフィールドを作っています。
Company モデルがメインの場合、 ``saveAssociated()`` は、関連するモデルデータ (Account モデル) が
特定のフォーマットで渡ってくることを期待します。 それが、 ``Account.0.fieldName`` という名前です。

.. note::

    上記のような名前の付け方は、hasMany アソシエーションの場合です。
    hasOne の場合は、ModelName.fieldName という名前を付けます。

そして、CompaniesController に ``add()`` アクションを作ります。 ::

    public function add() {
        if (!empty($this->request->data)) {
            // バリデーションエラーを出さないために以下のようにします。
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

これだけです。これで Company モデルと Account モデルはバリデーションが行われ、
同時にデータの保存もされました。デフォルトで ``saveAssociated`` は
各データの保存時に渡された値をすべて検証します。

hasMany を保存する
==================

結合された2つのテーブルのモデルのデータがどうやって保存されるのかを見て行きましょう。
:ref:`hasMany-through` セクションにあるように、結合されたそれぞれのテーブルは `hasMany`
アソシエーションで関連付けられています。ここでは、生徒の授業への出席日数と成績を
記録するアプリケーションをサンプルとして書いてみたいと思います。
以下のコードを見て下さい。 ::

   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set(
                'courseMembershipsList',
                $this->CourseMembership->find('all')
            );
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   return $this->redirect(array('action' => 'index'));
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

CakePHP はこれらの配列を `saveAssociated` に渡すことで、各モデルのデータを同時に保存し、
CourseMembership モデルに対して Student と Course を外部キーとして割り当てることができます。
CourseMembershipsController の index アクションが実行されると、そこの find('all') で
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

もちろん結合されたモデルを処理する方法は他にもあります。
このやり方は一度に全てを保存したい時に使うものです。
Student と Course をそれぞれ別々に作りたい場合もあるでしょう。
また後で CourseMembership に関連付けることもあるでしょう。
ですので、リストや ID から既存の Student と Course を選んで、それらを
登録するフォームがあれば、たとえば CourseMembership に対する
フィールドを次のように作ります。 ::

        // View/CourseMemberships/add.ctp

        <?php echo $this->Form->create('CourseMembership'); ?>
            <?php
                echo $this->Form->input(
                    'Student.id',
                    array(
                        'type' => 'text',
                        'label' => 'Student ID',
                        'default' => 1
                    )
                );
            ?>
            <?php
                echo $this->Form->input(
                    'Course.id',
                    array(
                        'type' => 'text',
                        'label' => 'Course ID',
                        'default' => 1
                    )
                );
            ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

POST されると以下のようなデータが渡ってきます。 ::

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

このデータを使えば `saveAssociated` は Student の ID と Course の ID を
CourseMembership モデルに保存してくれます。

.. _saving-habtm:

関連データを保存する (HABTM)
----------------------------

hasOne, belongsTo, hasMany のアソシエーションがあるモデルの保存は
とても簡単です。アソシエーションモデルの ID を外部キーとして指定するだけです。
それが準備できれば、モデルの ``save()`` メソッドを呼ぶだけで、
あとは勝手にアソシエーションモデルと繋げてくれます。
Tag モデルの ``save()`` に対しては、以下のような形式のデータを渡します。 ::

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

以下のような配列を使えば、 ``saveAll()`` で HABTM アソシエーションに対して
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

上記の配列を ``saveAll()`` に渡せば、それぞれの関連する Recipe に
Tag を含むデータが生成されます。

ひとつの Post に対して複数の Tag を保存する必要がある場合に便利な別の例です。
以下の HABTM 配列形式で関連する HABTM データを設定する必要があります。
唯一の関連する HABTM モデルの id を設定する必要があることに注意してください。
しかし、再びネストする必要があります。 ::

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Saving HABTM arrays'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(1, 2, 5, 9)
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Dr Who\'s Name is Revealed'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(7, 9, 15, 19)
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [title] => 'I Came, I Saw and I Conquered'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(11, 12, 15, 19)
                    )
            )
        [3] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Simplicity is the Ultimate Sophistication'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(12, 22, 25, 29)
                    )
            )
    )

``saveAll($data, array('deep' => true))`` に上記の配列を渡すことで、
Post に対する Tag のアソシエーションをもつ posts_tags 結合テーブルに登録します。

Tag を新しく作って、いくつかのレシピに関連付けるための
適切な配列を生成してくれるフォームを作ってみます。

このフォームを簡単に実装すると以下のようになります
(``$recipe_id`` は何かしらの値がセットされているものとします) ::

    <?php echo $this->Form->create('Tag'); ?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)
        ); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

この例では、 タグとリンクさせたいレシピの ID が値としてセットされている
``Recipe.id`` という hidden フィールドがあるのがわかります。

``save()`` メソッドがコントローラーから呼ばれれば、自動的に
HABTM データをデータベースに保存します。 ::

    public function add() {
        // アソシエーションデータを保存
        if ($this->Tag->save($this->request->data)) {
            // 保存が成功した時の処理
        }
    }

これで、新しい Tag が作られて、レシピに関連付けられました。
レシピの ID は ``$this->request->data['Recipe']['id']`` にセットされています。

関連データを表現する方法としては、ドロップダウンリストがあります。
``find('list')`` を使って、モデルからデータを引っ張ってきて、
モデルの名前のビュー変数に割り当てます。input の引数に変数の名前と同じ値を指定すれば
``<select>`` の中に自動的にデータを引っ張ってきてくれます。 ::

    // コントローラーのコード
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // ビューのコード
    $form->input('tags');

HABTM を使ったもうひとつのシナリオとしては、 複数選択できる ``<select>``
の場合です。たとえば、レシピは複数のタグを持つことがでるとします。
データは先ほどと同じ様にモデルから取得してきますが、
フォームの作り方が少し違います。タグ名のフォームは ``ModelName`` (モデル名) を
渡すことで生成されます。 ::

    // コントローラーのコード
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // ビューのコード
    $this->Form->input('Tag');

これで、既存のレシピに対して、複数タグを選択できる
セレクトボックスが生成されます。

セルフ HABTM
~~~~~~~~~~~~~

通常の HABTM は、２つのモデルでお互いに関連づけるために使用されます。
１つのモデルのみで使用されることもありますが、いくつかの追加の注意が必要です。

鍵はモデルの ``className`` 設定にあります。単純に ``Project`` HABTM ``Project`` の
リレーションを追加することは、データ保存に課題を引き起こします。それらの課題を避ける鍵として
``className`` をモデル名として設定し、エイリアスを使用してください。 ::

    class Project extends AppModel {
        public $hasAndBelongsToMany = array(
            'RelatedProject' => array(
                'className'              => 'Project',
                'foreignKey'             => 'projects_a_id',
                'associationForeignKey'  => 'projects_b_id',
            ),
        );
    }

フォーム要素を作成することとデータを保存することは、以前と同様に動作しますが、
代わりにエイリアスを使用します。 これが::

    $this->set('projects', $this->Project->find('list'));
    $this->Form->input('Project');

こうなります::

    $this->set('relatedProjects', $this->Project->find('list'));
    $this->Form->input('RelatedProject');

HABTM が複雑になったらどうすればよいか？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

デフォルトでは CakePHP で HasAndBelongsToMany アソシエーションを保存するとき、
新しくデータを追加するまえに中間テーブルのデータが一旦すべて削除されます。
たとえば、10個の Children を持つ Club があるとします。
この時に2つの Children だけを更新した場合、Children は12個になるのではなく
2個になります。

また、HTBTM の中間テーブルにフィールド (データ生成時刻やメタ項目など)を追加
したい場合は、簡単なオプションがあることを覚えておいてください。

2つのモデル間の HasAndBelongsToMany は、実際には hasMany と belongsTo の
アソシエーションを通して関連付けられる3つのモデルの短縮形です。

この例で考えてみましょう。 ::

    Child hasAndBelongsToMany Club

考え方を変えて、Membership モデルを追加してみます。 ::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

これらの2つの例は同じ意味です。データベースに同じフィールドをもち、
同じモデルが対応します。違うのは、"中間" モデルに付けられる名前と、
その振る舞いがよりわかりやすいということです。

.. tip::

    中間テーブルが、2つの関連テーブルへの外部キーの他にフィールドを
    持っている場合、 ``'unique'`` キーに ``'keepExisting'`` を指定することで
    外部キー以外の拡張フィールドが消えないようになります。
    'unique' => true としても同じようなことで、保存時に拡張フィールドの
    データが消えないようになります。
    :ref:`HABTM アソシエーションのパラメータ <ref-habtm-arrays>` も参考にしてください。

ですが、ほとんどの場合、中間テーブルに対応するモデルは簡単に作れますし、
HABTM を使う代わりに hasMany や belongsTo アソシエーションを使ってもできます。

データテーブル
==============

CakePHP は特定の DBMS に依存しないように設計されていて、MySQL, Microsoft SQL Server,
PostgreSQL, また他の DBMS でも動作します。いつもやってるようにデータベースにテーブルを作れます。
モデルクラスを作れば、自動的にデータベースに作ったテーブルにマッピングされます。
テーブル名は規約に従って、小文字の複数形にして、単語同士はアンダースコアで区切ります。
たとえば、Ingredient というクラスは ingredients というテーブル名と対応します。
EventRegistration というクラスは event_registrations というテーブル名と対応します。
CakePHP は各フィールドの型を取得するためにテーブルについて調べます。
そしてこの情報はビュー内でのフォームへの出力など、様々な機能で使われています。
フィールド名は規約に従って、小文字のアンダースコア区切りとします。

created と modified
-------------------

created や modified といった日付型のフィールドをデータベースのテーブルに定義しておけば、
CakePHP はそれらのフィールドを認識して、自動的にレコードの保存または更新時に
セットされます
(保存されるデータ配列に created や modified フィールドが含まれていない場合に限る)。

created と modified フィールドには、新しくレコードが追加されるときには現在の日時がセットされます。
modified フィールドは既存のレコードが更新された時に、現在の日時がセットされます。

Model::save() を呼び出す前に、 ``created`` や ``modified`` のキーが $this->data にあると、
自動的に更新はされずに、$this->data の値が使われます。自動的に更新したい場合は、
``unset($this->data['Model']['modified']`` などとします。または、Model::save() を
オーバーライドして、常に unset の動作をするようにも出来ます。 ::

    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) {
            // 保存前に modified フィールドをクリアする
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }

``fieldList`` を指定してデータを保存し、 ``created`` や ``modified``
フィールドがホワイトリストの中に含まれていない場合、それらのフィールドは、
自動的に割り当てられた値を持ち続けます。 ``fieldList`` に含まれていた場合、
``created`` や ``modified`` フィールドは、他のフィールドと同様に動作します。

.. meta::
    :title lang=ja: Saving Your Data
    :keywords lang=ja: doc models,validation rules,data validation,flash message,null model,table php,request data,php class,model data,database table,array,recipes,success,reason,snap,data model
