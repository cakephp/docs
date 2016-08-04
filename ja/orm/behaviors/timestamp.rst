Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

Timestamp ビヘイビアは、モデルのイベントのたびにテーブルオブジェクトのタイムスタンプを更新します。
これは、主に ``created`` や ``modified`` フィールドにデータを投入するために使用されます。けれども、設定を追加すると、任意のtimestampとdatatimeカラムを任意のイベントで更新することができます。

一般的な使い方
================

あなたは他のビヘイビアと同様に、timestampビヘイビアを以下の様に有効にできます。::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

デフォルトの設定は以下のようになっています:

- 新しくEntityを保存するとき、 ``created`` と ``modified`` に現在の日時を設定します。
- Entityを更新したとき、 ``modified`` に現在の日時を設定します。

使い方と設定方法
================

もしあなたが別の名前のフィールドを修正したいときや、カスタムイベントで更新のtimestampを追加したフィールドを追加したいのであれば、以下設定を追加することにより可能となります。 ::

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

上記の例では、標準の ``Model.beforeSave`` イベントに加えて、注文完了時に ``completed_at`` カラムを更新しています。

EntityでのTimestamp更新
=======================================

しばしば、他のプロパティを変更せずに、エンティティのタイムスタンプのみ更新したいこともあるでしょう。
これは、レコードに「 touch する」と呼ばれます。CakePHP では、これを正確に行うために ``touch()`` メソッドを使うことができます。 ::

    // Model.beforeSave イベントに基づいて touch します
    $articles->touch($article);

    // 指定したイベントに基づいて touch します
    $orders->touch($order, 'Orders.completed');

Entityを保存後、フィールドが更新されます。

レコードの touch は、子リソースが作成や更新されたときに親リソースを変更するためのシグナルがほしい際に便利です。
例えば、新しくコメントが追加されたときに記事を更新するといったことです。

編集のタイムスタンプ無しで更新の保存
===========================================

エンティティを保存する際の updated タイムスタンプカラムの自動更新を無効化するには、その属性を 'dirty' としてマークします。 ::

    // dirtyを使い、更新した時にカラムに現在の値をセットする
    $order->dirty('modified', true);
