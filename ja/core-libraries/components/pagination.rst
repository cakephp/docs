ページ制御
##########

.. php:class:: PaginatorComponent(ComponentCollection $collection, array $settings = array())

柔軟で、かつユーザーにやさしいウェブアプリを作ろうとすると、
まず障害となるのが直感的なユーザーインターフェースのデザインです。
多くのアプリケーションは、そのサイズと複雑さが加速度的に増加してきており、
デザイナーとプログラマーは何十万ものレコードをどうやって表示すればいいか、
お互いに頭を抱えています。リファクタリングするには時間がかかりますし、
パフォーマンスやユーザーの満足度が損なわれる場合があります。

大量のレコードをページごとに表示するのは、
どのアプリケーションでも常にネックになる部分であり、
開発者の頭を悩ませて来ました。CakePHP では、
データのページ制御のための簡単かつ簡潔な方法を提供することで、
開発者の負担を軽減します。

CakePHP におけるページ制御機構は、
ページに対応したクエリをより簡単に構築するためのもので、
コントローラの中のコンポーネントとして提供されます。
さらに、ページ制御用のリンクとボタンの生成を簡単に行うため、
ビューの中の :php:class:`PaginatorHelper` が使われます。

クエリのセットアップ
====================

まずコントローラにおいて、 コントローラ変数 ``$paginate`` の中でクエリ条件の定義を行いますが、
これがページ制御機構のデフォルトとして使われます。ここで指定した条件は、あなたのページ制御機能の
基本部分になります。それらに対して、さらに ``sort`` 、 ``direction`` 、 ``limit`` 、
URL から受け取った ``page`` パラメータなどを追加していきます。なお ``order`` キーを、
以下の要領で配列として定義しておく必要があるので注意してください。 ::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

``fields`` のような、上記以外の :php:meth:`~Model::find()` のオプションを
入れることもできます。 ::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

``$paginate`` 配列に含めることができるその他のキーは、 ``Model->find('all')`` 
メソッドのパラメータに似ています。つまり以下のものです: ``conditions``, 
``fields``, ``order``, ``limit``, ``page``, ``contain``, ``joins``, 
``recursive`` 。前述のキーに加えて、追加したキーがそのままモデルの
find() メソッドに渡されます。これにより、ページ制御に対してとても簡単に
:php:class:`ContainableBehavior` のようなビヘイビアを使えます。 ::

    class RecipesController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

標準的なページ制御用の値を定義する以外にも、
コントローラの中でひとつ以上のページ制御用のデフォルト値を定義できます。
単に設定したいモデルの後で、配列のキーに名前をつけるだけです。 ::

    class PostsController extends AppController {

        public $paginate = array(
            'Post' => array (...),
            'Author' => array (...)
        );
    }

``Post`` と ``Author`` キーの値としては、
あるモデル／キーが ``$paginate`` 配列を保持できる範囲で、
すべてのプロパティを含むことができます。

いったん ``$paginate`` 変数が定義されると、コントローラのアクションから
:php:class:`PaginatorComponent` の ``paginate()`` メソッドが使えるように
なります。このメソッドはモデルによる ``find()`` の結果を返します。
またリクエストオブジェクトに付加される追加パラメータをいくつかセットします。
追加情報は ``$this->request->params['paging']`` にセットされ、
これを使って :php:class:`PaginatorHelper` がリンクを生成します。
さらに :php:meth:`PaginatorComponent::paginate()` は、
あなたのコントローラの中のヘルパーのリストに :php:class:`PaginatorHelper` 
がまだ入っていなければ追加します。 ::

    public function list_recipes() {
        $this->Paginator->settings = $this->paginate;

        // findAll() に似ていますが、ページ制御された結果を返します。
        $data = $this->Paginator->paginate('Recipe');
        $this->set('data', $data);
    }

``paginate()`` 関数の第二パラメータとして検索条件を渡すことにより、
結果をフィルターできます。 ::

    $data = $this->Paginator->paginate(
        'Recipe',
        array('Recipe.title LIKE' => 'a%')
    );

あなたのアクションの中に、 ``conditions``
を始めとするページ制御用設定の配列をセットすることもできます。 ::

    public function list_recipes() {
        $this->Paginator->settings = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->Paginator->paginate('Recipe');
        $this->set(compact('data'));
    }

カスタムクエリを使ったページ制御
================================

もし標準の find
オプションではデータを表示するために必要なクエリを作れない場合、
いくつか別のやり方があります。
まず :ref:`custom find type <model-custom-find>` が使えます。さらに、
``paginate()`` と ``paginateCount()`` メソッドを自分のモデルで実装したり、
あなたのモデルに接続されるビヘイビアの中でそれらをインクルードしたりできます。
``paginate`` や ``paginateCount`` を実装するビヘイビアは、
後述するメソッドのシグネチャーを、
通常の追加の先頭パラメータである ``$model`` を使って実装しなければなりません。 ::

    // ビヘイビア上に実装された paginate と paginateCount
    public function paginate(Model $model, $conditions, $fields, $order, $limit,
        $page = 1, $recursive = null, $extra = array()) {
        // メソッドの中身
    }

    public function paginateCount(Model $model, $conditions = null, $recursive = 0,
        $extra = array()) {
        // メソッドの中身
    }

paginate() と paginateCount() を自前で実装しなければならないような
状況というのはめったにないはずです。
コアのモデルのメソッドやカスタムファインダーを使うだけでは、
どうしても目指すゴールに辿りつけないのかどうかを確認してください。
カスタム find タイプでページ制御する場合、 ``0`` 番目の要素をセットするか、
もしくは CakePHP 2.3 であれば ``findType`` キーを設定してください。 ::

    public $paginate = array(
        'popular'
    );

0 番目のインデックスを管理するのは難しいため、2.3 では ``findType``
オプションが追加されました。 ::

    public $paginate = array(
        'findType' => 'popular'
    );

``paginate()`` メソッドでは、
以下のメソッドシグネチャーを実装しなければなりません。
データを取得したいモデルの中で、
あなたのメソッドやロジックでこれをオーバーライドします。 ::


    /**
     * オーバーライドされた paginate メソッド
     *  - week, away_team_id, home_team_id でグルーピングしている
     */
    public function paginate($conditions, $fields, $order, $limit, $page = 1,
        $recursive = null, $extra = array()) {

        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
        return $this->find(
            'all',
            compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group')
        );
    }

さらに、コアの ``paginateCount()`` をオーバーライドする必要があります。
このメソッドは ``Model::find('count')`` と同じ引数を期待しています。
以下の例では PostgreSQL 固有の機能を利用していますので、
お使いのデータベースに従って調整してください。 ::

    /**
     * オーバーライドされた paginateCount メソッド
     */
    public function paginateCount($conditions = null, $recursive = 0,
                                    $extra = array()) {
        $sql = "SELECT
            DISTINCT ON(
                week, home_team_id, away_team_id
            )
                week, home_team_id, away_team_id
            FROM
                games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

観察力の鋭い方なら気付くと思いますが、私たちが定義している paginate
メソッドは、実際には必要なものではありませんでした。
単にコントローラの ``$paginate`` クラス変数に、
そのキーワードを追加してやるだけで OK です。 ::

    /**
     * GROUP BY 句を追加します
     */
    public $paginate = array(
        'MyModel' => array(
            'limit' => 20,
            'order' => array('week' => 'desc'),
            'group' => array('week', 'home_team_id', 'away_team_id')
        )
    );
    /**
     * もしくは、アクションの中でその場で実行できます
     */
    public function index() {
        $this->Paginator->settings = array(
            'MyModel' => array(
                'limit' => 20,
                'order' => array('week' => 'desc'),
                'group' => array('week', 'home_team_id', 'away_team_id')
            )
        );
    }

CakePHP 2.0 では、グループ句を使う場合でも、もはや ``paginateCount()``
を実装する必要はなくなりました。コアの ``find('count')``
が全体の行数を正確に算出してくれます。

どの項目でソートするのかを制御する
==================================

デフォルトでは、ソートはモデルのどの列に対しても行えます。
これは、インデックスが張られていない列や、
計算コストの高い仮想フィールドでもソートキーにできるので、
必ずしも望ましい状態ではないかもしれません。そういった場合、
``PaginatorComponent::paginate()`` の第三パラメータを使って、
ソート可能な列を制限することができます。 ::

    $this->Paginator->paginate('Post', array(), array('title', 'slug'));

これは、title と slug 列に対してのみソートを許可します。
これ以外の項目に対するソート設定は無視されます。

ページごとの最大行数を制限する
==============================

ページごとに取り出せる結果の行数は ``limit`` パラメータで制御できます。
ただこれだと、ユーザが１回のページ制御で全行数を取り出せてしまうので、
一般的にはあまり好ましくありません。 ``maxLimit`` オプションは、
外部からの大きな limit をセットできないようにします。
CakePHP のデフォルトでは、一度に取り出せる行数を 100 に制限しています。
このデフォルト値があなたのアプリケーションで適切ではない場合、
ページ制御のオプションの一部としてこの値を調整できます。
例えば、 ``10`` に制限する場合::

    public $paginate = array(
        // ここに他のキーもあります。
        'maxLimit' => 10
    );

リスクストの limit パラメータがこの値より大きい場合、
``maxLimit`` の値に制限されます。

.. _pagination-with-get:

GET パラメータを使ったページ制御
================================

CakePHP の過去のバージョンでは、ページ制御用リンクの生成は、
名前付きパラメータ利用時に限られていました。ちなみに、ページが GET
パラメータでリクエストされた場合でも、今でもページ制御は動作します。
2.0 で、私達はページ制御用パラメータをより細かく制御でき、
かつ一貫性を保てるように改善しようと決めました。現在は、コンポーネントの中で、
クエリ文字列と名前付きパラメータのどちらを使うかを選べます。
入ってくるリクエストは選択されたタイプとしてのみ受け付けられ、
:php:class:`PaginatorHelper`
が選択されたパラメータタイプでリンクを生成します。 ::

    public $paginate = array(
        'paramType' => 'querystring'
    );

上記の例ではクエリ文字列によるパースとリンク生成を有効にします。
PaginatorComponent の ``$settings`` プロパティで変更することもできます。 ::

    $this->Paginator->settings['paramType'] = 'querystring';

デフォルトでは、すべての一般的なページパラメータは GET 引数に変換されます。

.. note::

    存在しないプロパティへの値の代入により、
    例外が発生するような状況になる場合があります。 ::

        $this->paginate['limit'] = 10;
    
    とやると、 "Notice: Indirect modification of overloaded property $paginate has no effect."
    という例外が発生します。プロパティに対して初期値を代入しておくことで、この問題を防げます。 ::

        $this->paginate = array();
        $this->paginate['limit'] = 10;
        //  または
        $this->paginate = array('limit' => 10);

    もしくは、単にコントローラクラスでプロパティを宣言するのでもOKです。 ::

        class PostsController {
            public $paginate = array();
        }

    または、 ``$this->Paginator->settings = array('limit' => 10);``
    を使います。

    PaginatorComponent の ``$settings`` プロパティを変更したい場合は、
    必ず $components 配列に Paginator コンポーネントを追加しておいてください。

    これらのいずれかにより、notice エラーの発生を防げます。

範囲外のページへのアクセス
==========================

2.3 の時点では、存在しないページ、すなわちリクエストされたページ番号が
全ページ数より大きいページにアクセスしようとすると、
PaginatorComponent が `NotFoundException` を投げます。

その場合、通常のエラーページを生成することもできますが、
try ～ catch ブロックで `NotFoundException` を捕捉して、
適切なアクションを起こさせることも可能です。 ::

    public function index() {
        try {
            $this->Paginator->paginate();
        } catch (NotFoundException $e) {
            // 最初もしくは最後のページに飛ばす、などの何かを行う。
            // リクエスト情報は $this->request->params['paging'] に
            // 入っています。
        }
    }

AJAX によるページ制御
=====================

ページ制御と AJAX 機能を組み合わせるのはとても簡単です。
:php:class:`JsHelper` と :php:class:`RequestHandlerComponent` を使えば、
AJAX 対応ページ制御を簡単にあなたのアプリケーションに組み込めます。
詳細は :ref:`ajax-pagination` を参照してください。

ビューにおけるページ制御
========================

ページ制御のナビゲーションリンクを作る方法については、
:php:class:`PaginatorHelper` のドキュメントを参照してください。

.. meta::
    :title lang=ja: Pagination
    :keywords lang=ja: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
