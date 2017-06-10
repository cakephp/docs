Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

Timestamp ビヘイビアーは、モデルのイベントのたびにテーブルオブジェクトのタイムスタンプを更新します。
これは、主に ``created`` や ``modified`` フィールドにデータを投入するために使用されます。
けれども、設定を追加すると、任意の timestamp と datatime カラムを任意のイベントで更新することができます。

一般的な使い方
================

あなたは他のビヘイビアーと同様に、timestamp ビヘイビアーを以下の様に有効にできます。 ::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

デフォルトの設定は以下のようになっています:

- 新しく Entity を保存するとき、 ``created`` と ``modified`` に現在の日時を設定します。
- Entity を更新したとき、 ``modified`` に現在の日時を設定します。

使い方と設定方法
================

もし別の名前でフィールドを更新する必要があるときや、カスタムイベントでさらなるタイムスタンプフィールドを更新したい場合、次のような追加設定を使うことができます。 ::

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

Entity での Timestamp 更新
==========================

しばしば、他のプロパティーを変更せずに、エンティティーのタイムスタンプのみ更新したいこともあるでしょう。
これは、レコードに「touch する」と呼ばれます。まさにこれをするために CakePHP では ``touch()`` メソッドを使うことができます。 ::

    // Model.beforeSave イベントに基づいて touch します
    $articles->touch($article);

    // 指定したイベントに基づいて touch します
    $orders->touch($order, 'Orders.completed');

Entity を保存後、フィールドが更新されます。

レコードの touch は、子リソースが作成や更新されたときに親リソースを変更するためのシグナルがほしい際に便利です。
例えば、新しくコメントが追加されたときに記事を更新するといったことです。

編集のタイムスタンプ無しで更新の保存
====================================

エンティティーを保存する際の updated タイムスタンプカラムの自動更新を無効化するには、その属性を 'dirty' としてマークします。 ::

    // modified カラムを dirty としてマークして、更新時に現在の値がセットされるようにします。
    $order->dirty('modified', true);

