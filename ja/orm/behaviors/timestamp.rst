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

Timestamp ビヘイビアは、モデルのイベントのたびにテーブルオブジェクトのタイムスタンプを更新します。これは、主に ``created`` や ``modified`` フィールドにデータを投入するために使用されます。
けれども、設定を追加すると、任意のtimestampとdatatimeカラムを任意のイベントで更新することができます。

..
    Basic Usage

一般的な使い方
================

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
================


..
    If you need to modify fields with different names, or want to update additional timestamp fields on custom events you can use some additional configuration

もしあなたが別の名前のフィールドを修正したいときや、カスタムイベントで更新のtimestampを追加したフィールドを追加したいのであれば、以下設定を追加することにより可能となります。::

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

上記の例では、標準の ``Model.beforeSave`` イベントに加えて、注文完了時に ``completed_at`` カラムを更新しています。

..
    Updating Timestamps on Entities

EntityでのTimestamp更新
=======================================

..
    Sometimes you'll want to update just the timestamps on an entity without
    changing any other properties. This is sometimes referred to as 'touching'
    a record. In CakePHP you can use the ``touch()`` method to do exactly this::


しばしば、他のプロパティを変更せずに、エンティティのタイムスタンプのみ更新したいこともあるでしょう。
これは、レコードに「 touch する」と呼ばれます。CakePHP では、これを正確に行うために ``touch()`` メソッドを使うことができます。 ::

    // Model.beforeSave イベントに基づいて touch します
    $articles->touch($article);

    // 指定したイベントに基づいて touch します
    $orders->touch($order, 'Orders.completed');


..
    After you have saved the entity, the field is updated.

Entityを保存後、フィールドが更新されます。

..
    Touching records can be useful when you want to signal that a parent resource
    has changed when a child resource is created/updated. For example: updating an
    article when a new comment is added.

レコードの touch は、子リソースが作成や更新されたときに親リソースを変更するためのシグナルがほしい際に便利です。
例えば、新しくコメントが追加されたときに記事を更新するといったことです。


..
    Saving Updates Without Modifying Timestamps

編集のタイムスタンプ無しで更新の保存
===========================================

..
    To disable the automatic modification of the ``updated`` timestamp column when
    saving an entity you can mark the attribute as 'dirty'

エンティティを保存する際の updated タイムスタンプカラムの自動更新を無効化するには、その属性を 'dirty' としてマークします。

..
    Mark the modified column as dirty making the current value be set on update.

modified カラムを 'dirty' としてマークすると、自動的な更新をするtimestampのupdatedカラムを無効化することができます。::

    // dirtyを使い、更新した時にカラムに現在の値をセットする
    $order->dirty('modified', true);
