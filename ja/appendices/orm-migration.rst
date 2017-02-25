新 ORM アップグレードガイド
###########################

CakePHP 3.0 は、ゼロから書き直された新しい ORM を提供しています。1.x および 2.x で
使用された ORM は、長い期間、提供してきましたが、 それには解決したい問題がいくつかありました。

* フランケンシュタイン - それは、レコード、それともテーブル？現在、それは両方です。
* 一貫性のない API - 例えば Model::read() 。
* クエリオブジェクトがない - クエリは、常に配列として定義されて、これはいくつかの制限や
  制約事項があります。例えば、union やサブクエリの実行を困難にしていました。
* 配列を返す - これは CakePHP に対する共通の不満であり、おそらくいくつかの観点から採用が
  見送られてきました。
* レコードオブジェクトがない - これは書式設定メソッドのアタッチを困難/不可能にしていました。
* Containable - ORM の一部であるべきです。非常識で歪なビヘイビアではありません。
* Recursive - 再帰のレベルではなく、どのアソシエーションが含まれるかを定義することで、
  よりよく制御されるはずです。
* DboSource - それは獣であり、モデルは、データソースよりもそれに依存しています。
  その分離は、クリーンで簡単にできました。
* Validation - 分離するべきです。それは今や巨大でクレイジーな機能です。
  それを再利用可能な小片を作ることは、フレームワークをより拡張可能にするでしょう。

CakePHP 3.0 の ORM は、これらと、より多くの問題を解決します。
新しい ORM は今、リレーショナル・データ・ストアに焦点を当てています。
将来的にプラグインを通じて、ElasticSearch などのような非リレーショナルストアを追加します。

新しい ORM のデザイン
=====================

新しい ORM は、より専門的かつ集中的なクラスを持つことによって、いくつかの問題を解決します。
過去には ``Model`` とデータソースをすべての操作のために使用していました。
現在の ORM は、複数の層に分かれています。

* ``Cake\Database\Connection`` - 接続の作成と使用のためにプラットフォームに依存しない
  方法を提供します。このクラスは、トランザクションの使用、クエリの実行とスキーマデータへの
  アクセスの方法を提供します。
* ``Cake\Database\Dialect`` - この名前空間のクラスは、プラットフォーム固有の
  SQL を提供し、プラットフォーム固有の制限を回避するためのクエリを変換します。
* ``Cake\Database\Type`` - CakePHP のデータベース型変換システムへのゲートウェイクラスです。
  これは、抽象的なカラム型を追加し、データベースとPHP 表現と PDO バインディングの各データ型の
  間のマッピングを提供するためのプラグイン可能なフレームワークです。例えば、datetime 型の
  カラムは、あなたのコード内の ``DateTime`` インスタンスとして表現されます。
* ``Cake\ORM\Table`` - 新しい ORM へのメインエントリポイント。
  単一のテーブルへのアクセスを提供します。アソシエーションの定義、ビヘイビアの使用、
  エンティティの作成、および Query オブジェクトを処理します。
* ``Cake\ORM\Behavior`` - CakePHP の以前のバージョンのビヘイビアに非常に似た動作をする
  ビヘイビアの基本クラス。
* ``Cake\ORM\Query`` - CakePHP の以前のバージョンで使用された深くネストされた配列を
  置き換える流れるようなオブジェクトベースのクエリビルダ。
* ``Cake\ORM\ResultSet`` - 集約されたデータを操作するための強力なツールを提供する結果の
  コレクション。
* ``Cake\ORM\Entity`` - 単一の行の結果を表します。
  データにアクセスし、様々なフォーマットへのスナップをシリアライズすることができます。

これから、新しい ORM で最も頻繁に相互作用するだろういくつかのクラスに、より詳しくなるために、
最も重要な3つのクラスを見てください。 ``Table`` 、 ``Query`` と ``Entity`` クラスは、
新しい ORM で多用され、それぞれが異なる目的を果たします。

Table オブジェクト
------------------

Table オブジェクトは、データへのゲートウェイです。
彼らは、以前のリリースで ``Model`` が行っていた多くのタスクを処理します。
Table クラスは次のようなタスクを処理します。

- クエリの作成。
- Finder の提供。
- エンティティのバリデーションと保存。
- エンティティの削除。
- アソシエーションの定義とアクセス。
- コールバックイベントのトリガ。
- ビヘイビアとの相互作用。

:doc:`/orm/table-objects` の章では、 このガイドよりも、Table オブジェクトを使用する
方法についてはるかに多くの詳細を提供します。一般的に既存のモデルコードを移行する場合、
Table オブジェクトになります。Table オブジェクトは、特定のプラットフォームに依存する
SQL は含まれていません。その代わりに、エンティティやクエリビルダと連携して動作します。
さらに、Table オブジェクトは、発行されたイベントを通じてビヘイビアやその他の関連処理と
相互に作用します。

Query オブジェクト
------------------

あなた自身で構築するクラスはありませんが、あなたのアプリケーションコードは、新しい ORM の
中心である :doc:`/orm/query-builder` を広範に使うことになります。
クエリビルダは、 ``HAVING`` 、 ``UNION`` 、およびサブクエリのように、以前の CakePHP
では非常に困難であったものを含む、単純または複雑なクエリを構築することが容易になります。

あなたのアプリケーションの既存の様々な find() 呼び出しは、新しいクエリビルダを使用するように
更新する必要があります。Query オブジェクトは、自分自身でクエリを実行せずにクエリを
作成するためのデータを収容するための責任を負います。出力として ``ResultSet`` を
作成するために実行されるプラットフォーム固有の SQL を生成するために、Connection (接続) や
Dialect (方言) と連携します。

Entity オブジェクト
-------------------

CakePHP の以前のバージョンの ``Model`` クラスは、任意のロジックや動作が含まれていない
単なる配列を返しました。コミュニティ内では CakeEntity のようなプロジェクトで欠点を補うことは
できましたが、多くの場合、結果を配列で返すことは、多くの開発者のトラブルの原因となる欠点でした。
CakePHP 3.0 の場合、あなたが明示的にその機能を無効にしない限り、 ORM は常にオブジェクトの
結果セットを返します。 :doc:`/orm/entities` の章はあなたのエンティティで実行できる
様々なタスクをカバーしています。

エンティティは、次のいずれかの方法で作成されます。データベースからデータのロード、
またはリクエストデータからエンティティへの変換のいずれかです。
エンティティを一度作成すると、それらに含まれるデータを操作したり、Table オブジェクトと
連携して、それらのデータを永続化することを可能にします。

主な相違点
==========

新しい ORM は、既存の ``Model`` 層から大きく発展しています。新しい ORM がどのように動作し、
どのようにコードを更新するかを理解する上で、多くの重要な違いがあります。

語形変化 (Inflection) 規則の更新
--------------------------------

あなたは、 Table クラスが複数形の名前であることに気づいたかもしれません。
複数形の名前を持つテーブルに加えて、アソシエーションもまた、複数形で呼ばれています。
これは、クラス名とアソシエーションの別名が単数形だった ``Model`` と対照的です。
この変更には、いくつかの理由があります。

* Table クラスは、単一の行ではなく、データの **集合** を表します。
* アソシエーションは、多くのものの間の関係を記述するために、テーブルを互いにリンクします。

Table オブジェクトの規約は常に複数形を使用することですが、あなたのエンティティの関連付け
プロパティは、アソシエーションのタイプに基づいて入力されます。

.. note::

    エンティティのプロパティで、 hasMany と belongsToMany (HABTM) は複数形を使用しますが、
    belongsTo と hasOne のアソシエーションは、単数形を使用します。

Table オブジェクトの規約の変更は、クエリを構築するときに最も明白です。
以下のようなクエリ表現の代わりに::

    // 誤り
    $query->where(['User.active' => 1]);

複数形を使用してください::

    // 正しい
    $query->where(['Users.active' => 1]);

find は Query オブジェクトを返します
------------------------------------

新しい ORM での1つの重要な違いは、テーブルの ``find`` を呼び出すと、すぐに結果を返さずに、
Query オブジェクトを返すということです。これにはいくつかの目的があります。

``find`` を呼び出した後、さらにクエリを変更することができます。 ::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    $query->where(['author_id' => 1])->order(['title' => 'DESC']);

クエリが実行される前に、同じクエリに条件、並び替え、制限、その他の句を追加するために
カスタム finder を積み重ねることができます。 ::

    $query = $articles->find('approved')->find('popular');
    $query->find('latest');

これまで以上に簡単にサブクエリを作成するために、クエリの中に別のクエリを構成することができます。 ::

    $query = $articles->find('approved');
    $favoritesQuery = $article->find('favorites', ['for' => $user]);
    $query->where(['id' => $favoritesQuery->select(['id'])]);

データベースに触れることなくイテレータとメソッドの呼び出しを使用してクエリを飾ることができます。
ビューのキャッシュを保持していて、データベースから取得された結果が実際には必要ない場合に、
これは素晴らしいです。 ::

    // この例では、クエリを作成しませんでした！
    $results = $articles->find()
        ->order(['title' => 'DESC'])
        ->formatResults(function (\Cake\Collection\CollectionInterface $results) {
            return $results->extract('title');
        });

クエリを反復処理しようとする時や、 ``toArray()`` や
:doc:`Collection </core-libraries/collections>` を継承したメソッドを呼び出した時、
クエリは結果オブジェクトとみなされ、実行されるクエリや返す結果の中に結果として返します。

CakePHP 2.x から見て最大の違いは、 ``find('first')`` は、もはや存在しないということです。
そこで、わずかな修正があります。それは ``first()`` メソッドです。 ::

    // 旧
    $article = $this->Article->find('first');

    // 新
    $article = $this->Articles->find()->first();

    // 旧
    $article = $this->Article->find('first', [
        'conditions' => ['author_id' => 1]
    ]);

    // 新
    $article = $this->Articles->find('all', [
        'conditions' => ['author_id' => 1]
    ])->first();

    // 以下のようにも書けます
    $article = $this->Articles->find()
        ->where(['author_id' => 1])
        ->first();

主キーによって単一のレコードをロードする場合は、 ``get()`` を呼び出すだけの方がよいでしょう。 ::

    $article = $this->Articles->get(10);

Finder メソッドの変更
---------------------

find メソッドから Query オブジェクトを返すことはいくつかの利点がありますが、
2.x から移行する人にとってはコストがかかります。あなたのモデルにいくつかの
カスタム find メソッドを持っていた場合、それらはいくつかの変更が必要になります。
これは、3.0 でカスタム finder メソッドを作成する方法です。 ::

    class ArticlesTable
    {

        public function findPopular(Query $query, array $options)
        {
            return $query->where(['times_viewed' > 1000]);
        }

        public function findFavorites(Query $query, array $options)
        {
            $for = $options['for'];
            return $query->matching('Users.Favorites', function ($q) use ($for) {
                return $q->where(['Favorites.user_id' => $for]);
            });
        }
    }

見ての通り、カスタム finder メソッドは、とても簡単で、配列の代わりに Query オブジェクトを
取得し、 必ず Query オブジェクトを返します。カスタム finder に afterFind ロジックを
実装した 2.x のユーザーのためには、 :ref:`map-reduce` セクションを確認したり、
:doc:`コレクションオブジェクト </core-libraries/collections>` 上で見られる機能を
使用すべきです。あなたのモデルで、すべての find の操作のために afterFind を行うことに
依存していた場合、いくつかの方法のいずれかでこのコードを移行できます。

1. あなたのエンティティのコンストラクタメソッドをオーバーライドして、そこに追加の書式設定を行います。
2. バーチャルプロパティを作成するには、エンティティにアクセサメソッドを作成します。
3. ``findAll()`` を再定義して、 ``formatResults`` を使用します。

上記の第三の場合のあなたのコードは以下のようになります。 ::

    public function findAll(Query $query, array $options)
    {
        return $query->formatResults(function (\Cake\Collection\CollectionInterface $results) {
            return $results->map(function ($row) {
                // あなたの afterfind ロジック
            });
        })
    }

カスタム finder はオプション配列を受け取ることに気づいたかもしれません。
このパラメータを使用して、finder に追加の情報を渡すことができます。
これは、2.x のから移行する人々にとって素晴らしいニュースです。
以前のバージョンで使用されたクエリのいずれかのキーは、3.x では正しい機能に自動的に変換されます。 ::

    // これは CakePHP 2.x と 3.0 の両方で動作します
    $articles = $this->Articles->find('all', [
        'fields' => ['id', 'title'],
        'conditions' => [
            'OR' => ['title' => 'Cake', 'author_id' => 1],
            'published' => true
        ],
        'contain' => ['Authors'], // 変更はここだけ！(複数形に注意)
        'order' => ['title' => 'DESC'],
        'limit' => 10,
    ]);

アプリケーションが「マジック」または :ref:`dynamic-finders` を使用している場合、
あなたはそれらの呼び出しを改造する必要があります。3.x では ``findAllBy*`` メソッドは
削除され、代わりに ``findBy*`` が常に Query オブジェクトを返します。
最初の結果を取得するには、 ``first()`` メソッドを使用する必要があります。 ::

    $article = $this->Articles->findByTitle('A great post!')->first();

うまくいけば、旧バージョンからの移行は、それが最初に思ったほど困難ではありません。
私たちが追加した機能の多くは、あなたが新しい ORM を使用して、要件をより良く表現することが
できるようにコードを減らすと同時に、互換性のラッパーはあなたが迅速かつ楽な方法でコードの
書き換えを少なくするのに役立ちます。

3.x での finder メソッド周りその他の素敵な改良点の一つは、簡単にビヘイビアで
finder メソッドを実装することができるということです。ビヘイビアに一致する名前とシグネチャを
持つメソッドを定義することにより finder は自動的に動作が接続されているすべてのテーブル上で
利用できるようになります。

Recursive と ContainableBehavior の削除
---------------------------------------

CakePHP の以前のバージョンでは、あなたが関心があるアソシエーションのセットとしてロードされた
データを削減するためには ``recursive``、 ``bindModel()``、 ``unbindModel()`` と
``ContainableBehavior`` を使用する必要がありました。
アソシエーションを管理するための一般的な戦術は ``recursive`` に ``-1`` を設定し、
すべてのアソシエーションを管理するために Containable を使用することでした。
CakePHP 3.0 では、 ContainableBehavior、recursive、bindModel、および unbindModel は
すべて削除されました。代わりに ``contain()`` メソッドが、クエリビルダのコア機能に
昇格されました。彼らは明示的にオンになっている場合のみ、アソシエーションはロードされます。
例えば::

    $query = $this->Articles->find('all');

上記は、アソシエーションが含まれない ``articles`` テーブルから **のみ** データを
ロードします。あなたが articles とそれに関連する作者をロードするには::

    $query = $this->Articles->find('all')->contain(['Authors']);

特に必要とされる関連データのみをロードすることで、あなたの欲しいデータのみを取得しようと
ORM と悪戦苦闘せずに済みます。

afterFind イベントやバーチャルフィールドはありません
----------------------------------------------------

CakePHP の以前のバージョンでは、生成されたデータのプロパティを作成するために ``afterFind``
コールバックやバーチャルフィールドを広範囲に使用する必要がありました。
これらの機能は 3.0 で削除されました。ResultSet が反復的にエンティティを生成するため、
``afterFind`` コールバックは不可能でした。afterFind とバーチャルフィールドの両方の大部分は
エンティティのバーチャルプロパティに置き換えることができます。
例えば、あなたの User エンティティが姓と名のカラムの両方を持っている場合、
`full_name` ためのアクセサを追加し、動的にプロパティを生成することができます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected function _getFullName()
        {
            return $this->first_name . '  ' . $this->last_name;
        }
    }

定義されたら、 ``$user->full_name`` を使用して、新しいプロパティにアクセスすることができます。
ORM の :ref:`map-reduce` 機能を使用すると、結果から集約されたデータを構築することができます。
``afterFind`` コールバックがしばしば使用された別のユースケースです。

バーチャルフィールドはもはや ORM の強調すべき特徴ではありません。finder メソッドで、
計算されたフィールドを追加することは簡単です。クエリビルダと式オブジェクトを使用することで、
バーチャルフィールドで得られたのと同じ結果を得ることができます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {
        public function findAverage(Query $query, array $options = [])
        {
            $avg = $query->func()->avg('rating');
            $query->select(['average' => $avg]);
            return $query;
        }
    }

アソシエーションはプロパティとして定義されなくなりました
--------------------------------------------------------

CakePHP の以前のバージョンでは、あなたのモデルが持っていた様々なアソシエーションが
``$belongsTo`` や ``$hasMany`` などのプロパティで定義されていました。
CakePHP 3.0 では、アソシエーションはメソッドを使用して作成されます。
メソッドを使用することで、クラス定義が持っている多くの制限を回避し、アソシエーションを
定義する唯一の方法を提供することができます。
あなたの ``initialize()`` メソッドとアプリケーションコードの他のすべての部分は、
アソシエーションを操作するとき、同じ API でやり取りします。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Movies');
            $this->hasOne('Ratings');
            $this->hasMany('Comments')
            $this->belongsToMany('Tags')
        }

    }

上記の例からわかるように、各アソシエーションタイプは関連付けを作成するためのメソッドを使用します。
もう一つの違いは、 ``hasAndBelongsToMany`` が ``belongsToMany`` に名前が変更されたことです。
3.0 でアソシエーションを作成する方法についての詳細を調べるには、:doc:`/orm/associations`
上のセクションをご覧ください。

CakePHP の別のうれしい改善は、独自のアソシエーションクラスを作成する機能です。
組み込みの関連付けタイプでカバーされていないアソシエーションタイプを持っている場合、
独自の ``Association`` サブクラスを作成し、必要な関連付けロジックを定義することができます。

バリデーションはプロパティとして定義されなくなりました
-------------------------------------------------------

CakePHP の以前のバージョンでは、アソシエーションと同様に、バリデーションルールは
クラスプロパティとして定義されていました。
この配列は、遅延して ``ModelValidator`` オブジェクトに変換されることになります。
この変換ステップは、間接のレイヤーを追加しました。複雑なルールは、実行時に変更します。
さらに、プロパティとして定義されたバリデーションルールは、モデルにとってバリデーションルールの
複数セットを持つことが難しくなります。
CakePHP 3.0 では、これらの両方の問題が改善されてきました。
バリデーションルールは常に ``Validator`` オブジェクトで構築され、簡単に複数のルールのセットを
持たせられます。 ::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;
    use Cake\Validation\Validator;

    class ReviewsTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator->requirePresence('body')
                ->add('body', 'length', [
                    'rule' => ['minLength', 20],
                    'message' => 'Reviews must be 20 characters or more',
                ])
                ->add('user_id', 'numeric', [
                    'rule' => 'numeric'
                ]);
            return $validator;
        }

    }

必要な数のバリデーションメソッドを定義することができます。各メソッドは
``validation`` プレフィックスと ``$validator`` 引数を受け付けなければなりません。

CakePHP の以前のバージョンでは、「バリデーション」および関連するコールバックは、
いくつかの関連しつつも異なる用途をカバーしました。
CakePHP 3.0 では、バリデーションと呼ばれていたものは、現在は２つの概念に分割されています。

#. データ型とフォーマットのバリデーション。
#. アプリケーション、またはビジネス・ルールの実施。

ORM エンティティがリクエストデータから作成される前に、バリデーションは適用されます。
この手順は、データがデータ型、書式、およびあなたのアプリケーションが期待する基本的な形状と
一致することを保証できます。
``validate`` オプションを使用してエンティティにリクエストデータを変換するときに、
あなたのバリデータを使用することができます。
詳細については、 :ref:`converting-request-data` 上のドキュメントをご覧ください。

:ref:`アプリケーションルール <application-rules>` は、あなたのアプリケーションのルール、
状態、およびワークフローが適用されることを保証するルールを定義することができます。
ルールは、あなたの Table の ``buildRules()`` メソッドで定義されています。
ビヘイビアは ``buildRules()`` フックメソッドを使用してルールを追加することができます。
articles テーブルの ``buidRules()`` メソッドの例は、以下の通りです。 ::

    // src/Model/Table/ArticlesTable.php 内で
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\RulesChecker;

    class ArticlesTable extends Table
    {
        public function buildRules(RulesChecker $rules)
        {
            $rules->add($rules->existsIn('user_id', 'Users'));
            $rules->add(
                function ($article, $options) {
                    return ($article->published && empty($article->reviewer));
                },
                'isReviewed',
                [
                    'errorField' => 'published',
                    'message' => 'Articles must be reviewed before publishing.'
                ]
            );
            return $rules;
        }
    }

識別子のクォートはデフォルトで無効
----------------------------------

以前の CakePHP は常に識別子を引用符で囲んでいました。
SQL スニペットを解析し、識別子を引用符で囲もうとすると、エラーが発生しやすく、重い処理でした。
CakePHP が定めた規約に従っている場合は、識別子を引用符で囲むコストは、それが提供する任意の
利益をはるかに上回ります。このため、識別子を引用符で囲むことは、3.0 ではデフォルトで無効に
なっています。特殊文字や予約語が含まれているカラム名やテーブル名を使用している場合にのみ
識別子のクォートを有効にする必要があります。
必要な場合は、接続を設定するときに識別子のクォートを有効にすることができます。 ::

    // config/app.php 内で
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Driver\Mysql',
            'username' => 'root',
            'password' => 'super_secret',
            'host' => 'localhost',
            'database' => 'cakephp',
            'quoteIdentifiers' => true
        ]
    ],

.. note::

    ``QueryExpression`` オブジェクト内の識別子は、引用符で囲まれず、手動でクォートするか
    IdentifierExpression オブジェクトを使用する必要があります。

ビヘイビアの更新
================

ほとんどの ORM 関連の機能と同様に、ビヘイビアも同様に 3.0 で変更されました。
ビヘイビアは、CakePHP の以前のバージョンの ``Model`` クラスの概念から派生した
``Table`` インスタンスにアタッチします。
CakePHP 2.x のビヘイビアとは、いくつか重要な違いがあります。

- ビヘイビアはもはや複数のテーブル間で共有されていません。
  もはや、ビヘイビアに格納される設定に「名前空間」を設ける必要がないことを意味します。
  ビヘイビアを使用する各テーブルは、独自のインスタンスを取得します。
- ミックスインメソッドのメソッドシグネチャが変更されました。
- コールバックメソッドのメソッドシグネチャが変更されました。
- ビヘイビアの基本クラスが変更されました。
- ビヘイビアは、 finder メソッドを追加することができます。

新しい基本クラス
-----------------

ビヘイビアのための基本クラスが変更されました。
ビヘイビアは現在 ``Cake\ORM\Behavior`` を継承する必要があります。ビヘイビアが、
このクラスを継承しない場合は、例外が発生します。基本クラスの変更に加えて、
ビヘイビアのコンストラクタが変更されて、 ``startup()`` メソッドは削除されました。
テーブルにアクセスする必要があるビヘイビアは、テーブルとのアタッチをコンストラクタで
定義する必要があります。  ::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {

        protected $_table;

        public function __construct(Table $table, array $config)
        {
            parent::__construct($table, $config);
            $this->_table = $table;
        }

    }

ミックスインメソッドのシグネチャ変更
------------------------------------

ビヘイビアは、Table オブジェクトへの「ミックスイン」メソッドを追加する機能の提供を続けます。
しかし、これらのメソッドのメソッドシグネチャが変更されました。
CakePHP 3.0 では、ビヘイビアのミックスインメソッドは、テーブルの 'メソッド' と
**同じ** 引数を提供することが期待できます。例えば::

    // ビヘイビアによって提供される slug() メソッドをテーブルが持っていると仮定
    $table->slug($someValue);

ビヘイビアの ``slug()`` メソッドは1つだけ引数を受け取り、そのメソッドのシグネチャは
次のようになります。 ::

    public function slug($value)
    {
        // ここにコード
    }

コールバックメソッドのシグネチャ変更
------------------------------------

ビヘイビアのコールバックは、他のすべてのリスナーメソッドで統一されています。
以前の引数の代わりに、最初の引数としてイベントオブジェクトを受け取る必要があります。 ::

    public function beforeFind(Event $event, Query $query, array $options)
    {
        // コード
    }

ビヘイビアが購読することができるすべてのコールバックのシグネチャに関しては
:ref:`table-callbacks` をご覧ください。
