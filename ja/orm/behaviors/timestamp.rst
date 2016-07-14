Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

..
    The timestamp behavior allows your table objects to update one or more
    timestamps on each model event. This is primarily used to populate data into
    ``created`` and ``modified`` fields. However, with some additional
    configuration, you can update any timestamp/datetime column on any event a table
    publishes.

TimestampビヘイビアはTableObjectを更新する度、もしくは各モデルのイベントのたびに許可し、 ``created`` や ``modified`` で使われています。
けれども、設定を追加すると、任意のtimestampとdatatimeカラムを任意のイベントで更新することができます。

..
    Basic Usage

一般的な使い方
========================================================

..
    You enable the timestamp behavior like any other behavior

あなたは他のビヘイビアと同様に、timestampビヘイビアを以下の様に有効にできます。::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

..
    The default configuration will do the following:

デフォルトの設定は以下のようになっています:

..
    - When a new entity is saved the ``created`` and ``modified`` fields will be set to the current time.
    - When an entity is updated, the ``modified`` field is set to the current time.

- 新しくEntityを保存するとき、 ``created`` と ``modified`` に現在の日時を設定します。
- Entityを更新したとき、 ``modified`` に現在の日時を設定します。

..
    Using and Configuring the Behavior

使い方と設定方法
========================================================


..
    If you need to modify fields with different names, or want to update additional timestamp fields on custom events you can use some additional configuration

もしあなたが難しい名前のフィールドを修正したいときか、カスタムイベントで更新のtimestampを追加したフィールドを追加したいのであれば、以下設定を追加することにより可能となります。::

    class OrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'updated_at' => 'always',
                    ],
                    'Orders.completed' => [
                        'completed_at' => 'always'
                    ]
                ]
            ]);
        }
    }


..
    As you can see above, in addition to the standard ``Model.beforeSave`` event, we
    are also updating the ``completed_at`` column when orders are completed.

ご覧の通り、一般的な ``Model.beforeSave`` イベントと同じように、 ``completed_at`` を追加し完了です。

..
    Updating Timestamps on Entities

EntityでのTimestamp更新
========================================================

..
    Sometimes you'll want to update just the timestamps on an entity without
    changing any other properties. This is sometimes referred to as 'touching'
    a record. In CakePHP you can use the ``touch()`` method to do exactly this::

他のEntityのPropertyが変わった時に、timestampを更新したい時のために、 'touching' に関して記述します。
CaePHPの場合、正確には ``touch()`` はこのように使うことができます。::

    // touch は Model.beforeSave イベントを基にしている場合
    $articles->touch($article);

    // touch は 特別なイベントを基にしている場合
    $orders->touch($order, 'Orders.completed');


..
    After you have saved the entity, the field is updated.

その後、Entityを保存すると、フィールドが更新されます。

..
    Touching records can be useful when you want to signal that a parent resource
    has changed when a child resource is created/updated. For example: updating an
    article when a new comment is added.

親要素から子要素へ追加や更新のシグナルを送るときにTouching レコードは使うことができます。
例えば、記事を更新したときに、新しくコメントを追加するといったことです。


Saving Updates Without Modifying Timestamps
===========================================

To disable the automatic modification of the ``updated`` timestamp column when
saving an entity you can mark the attribute as 'dirty'::

    // Mark the modified column as dirty making
    // the current value be set on update.
    $order->dirty('modified', true);
