CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

多くの場合、ウェブアプリケーションは関連するオブジェクトの数を表示する必要があります。
たとえば、記事のリストを表示するときに、記事のコメントの数を表示することができます。
または、ユーザーを表示するときに、彼女が持っている友人/フォロワーの数を表示することもできます。
CounterCache ビヘイビアは、これらの状況を想定しています。
CounterCache は、呼び出されたときにオプションで割り当てられた関連モデルのフィールドを更新します。
フィールドはデータベースに存在し、INT 型でなければなりません。

基本的な使用方法
================

他のビヘイビアと同様に CounterCache ビヘイビアを有効にしますが、
いくつかのリレーションとそれらのそれぞれに格納されるフィールド数を設定するまでは何も行いません。
以下の例を使用して、各記事のコメント数を次のようにキャッシュすることができます。 ::

    class CommentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('CounterCache', [
                'Articles' => ['comment_count']
            ]);
        }
    }

CounterCache の設定は、リレーション名のマップとそのリレーションに対する具体的な設定でなければなりません。

カウンタの値は、エンティティが保存または削除されるたびに更新されます。
``updateAll()`` または ``deleteAll()`` を使用するか、作成した SQL を実行すると、
カウンタは更新 **されません。**

高度な使用方法
==============

キャッシュされたカウンタを関連するすべてのレコードより少なく保つ必要がある場合は、
カウンタ値を生成するために追加の条件またはファインダメソッドを指定できます。 ::

    // 特定のfindメソッドを使用する。
    // find(published) の場合
    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

カスタムファインダメソッドがない場合は、代わりにレコードを検索するための条件の配列を指定できます。 ::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'conditions' => ['Comments.spam' => false]
            ]
        ]
    ]);

CounterCache で複数のフィールドを更新する場合（条件付きカウントと基本カウントの両方を表示するなど）、
これらのフィールドを配列に追加できます。 ::

    $this->addBehavior('CounterCache', [
        'Articles' => ['comment_count',
            'published_comment_count' => [
                'finder' => 'published'
            ]
        ]
    ]);

最後に、カスタムファインダと条件が適切でない場合は、コールバックメソッドを提供することができます。
この呼び出し可能オブジェクトは、格納するカウント値を返さなければなりません。 ::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'rating_avg' => function ($event, $entity, $table) {
                return 4.5;
            }
        ]
    ]);


.. note::

    CounterCache ビヘイビアは、 ``belongsTo`` アソシエーションに対してのみ機能します。
    たとえば、 "Comments belongsTo Articles" の場合、Article テーブルの ``comment_count`` を生成するために、
    CommentsCache ビヘイビアを ``CommentsTable`` に追加する必要があります。

    これを ``belongsToMany`` アソシエーションに対して機能させることは可能ですが、
    アソシエーションオプションで設定されたカスタム ``through`` テーブルで CounterCache ビヘイビアを有効にする必要があります。
    カスタム JOIN テーブルを設定する方法は :ref:`using-the-through-option` を参照してください。
