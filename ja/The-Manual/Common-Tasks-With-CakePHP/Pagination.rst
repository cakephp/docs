ページ付け(Pagination)
######################

柔軟でユーザーフレンドリーなウェブアプリケーションを作成する上での主要な課題のひとつに、直感的なユーザインターフェースをデザインするということがあります。多くのアプリケーションは、その規模と複雑さが急激に増える傾向にあります。そしてデザイナーもプログラマーも、ひとつの画面に100行1000行というレコードを表示することがかなわないことに気づくのですが、それを解決するリファクタリングには時間がかかります。その間パフォーマンスは失われ、ユーザの不満はつのります。

ひとつのページあたりに表示するレコード数を適切にすることは、あらゆるアプリケーションにおいてとても重要なことなのですが、これは開発者にとって頭痛の種となります。
CakePHP
はデータのページ付けを簡単にすばやく行う機能を提供することで、開発者の悩みを和らげます。

「PaginatorHelper」はとても簡単に使えるため、重要な解決策となります。これにはページ付けのほかにも、簡単に使える並び替えのための機能があります。最後になりましたが、
CakePHP は Ajax
を用いた並び替えやページ付けもサポートしていることを付け加えておきます。

コントローラのセットアップ
==========================

コントローラにおいてまずすべき事柄は、コントローラ変数 *$paginate*
でページ付けの初期設定値を定義することです。そのとき、必ず並び替えを定義しなければならない点に注意してください。これは「order」をキーにして値を配列で渡すことで行います。

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

*fields* のような他の find() のオプションも含めることができます。

::

    class RecipesController extends AppController {

        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

*$paginate* 配列に含まれる他のキーは
*conditions*\ 、\ *fields*\ 、\ *order*\ 、\ *limit*\ 、\ *page*\ 、\ *contain*
そして *recursive*
となり、「\ *Model->find('all')*\ 」メソッドのパラメータに似ています。
似ているというより、実は各モデル名をキーにすることで、複数のモデルに対してページ付けの初期設定値を定義できるのです。

::

    class RecipesController extends AppController {

        var $paginate = array(
            'Recipe' => array (...),
            'Author' => array (...)
        );
    }

「Containable」ビヘイビアを使用した構文の例です:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

*$paginate* 変数を定義すれば、コントローラのアクションの中で
*paginate()*
メソッドを呼び出すことができます。このメソッドはモデルから1ページ分の
*find()*
の結果を返し、ページ分けの統計情報を取得し、この統計情報を自動的にビューへ渡します。また、このメソッドは、ヘルパーのリストが
PaginatorHelper に追加されていない場合、追加を実行します。

::

    function list_recipes() {
        // findAll() に類似したデータを1ページ分取得する
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }

取得するレコードを絞るには、\ ``paginate()``
関数の第2引数に検索条件を渡します。

::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));

あるいは、 ``$paginate`` 配列の *conditions*
キーに検索条件を指定します。

ビューにおけるページ付け
========================

レコードをユーザへどのように見せるかは自由ですが、 HTML
のテーブルタグを用いた表示がよく使われるでしょう。下の例は表組みを用いた例になります。ただし、ビューの中で利用できる
PaginatorHelper は、この例のように制限されているわけではありません。

また、PaginatorHelper
は、テーブルのカラムヘッダに簡単に入れられる並び替えの機能を提供します。

::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

PaginatorHelper の sort()
メソッドがテーブルのカラムヘッダに出力するリンクをクリックすることで、ユーザはデータの並び順を変更することができます。

アソシエーションによって関連づいたテーブルのカラムを並び替えに使用することもできます。

::

    <table>
        <tr> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

最後に、ビューで表示するページ付けの要素であるページナビゲーションについて説明します。これも
PaginationHelper によって提供される機能です。。

::

    <!-- 現在のページ番号を表示する。 -->
    <?php echo $paginator->numbers(); ?>
    <!-- 次のページへのリンクを表示する。 -->
    <?php
        echo $paginator->prev('« Previous ', null, null, array('class' => 'disabled'));
        echo $paginator->next(' Next »', null, null, array('class' => 'disabled'));
    ?> 
    <!-- 「X of Y」を表示します。 X は現在のページ、 Y は総ページ数です。 -->
    <?php echo $paginator->counter(); ?>

counter()
メソッドが出力する文言は、特別なマーカーを使うことで変更できます。

::

    <?php
    echo $paginator->counter(array(
        'format' => '合計 %pages% ページ中の %page% ページ目です。
                総レコード %count% のうち、  %start% 行目から %end% 行目までの %current% 行を表示しています。'
    )); 
    ?>

すべての URL
の引数をページ付けの関数に送るには、次のコードをビューに書いてください。

::

        $paginator->options(array('url' => $this->passedArgs));

あるいは、特定のパラメータのみを手動で渡すこともできます。

::

        $paginator->options(array('url' =>  array("0", "1")));

AJAX によるページ付け
=====================

ページ付けに Ajax
を取り入れることはとても簡単です。必要となる特別なコードは、 JavaScript
ライブラリの prototype.js
を読み込むことと、読み込み中のアイコンが含まれるインジケーターをセットすること、そしてページをリロードする代わりに上書きされる
DIV 要素を定義することだけです。

Ajax を利用する場合、コントローラで必ず RequestHandler
コンポーネントを読み込んでください。

::

    var $components = array('RequestHandler'); 

Configuring the PaginatorHelper to use a custom helper
------------------------------------------------------

By default in 1.3 the ``PaginatorHelper`` uses JsHelper to do ajax
features. However, if you don't want that and want to use the
``AjaxHelper`` or a custom helper for ajax links, you can do so by
changing the ``$helpers`` array in your controller. After running
``paginate()`` do the following.

::

    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'Ajax');

Will change the ``PaginatorHelper`` to use the ``AjaxHelper`` for ajax
operations. You could also set the 'ajax' key to be any helper, as long
as that class implements a ``link()`` method that behaves like
``HtmlHelper::link()``

カスタムしたクエリによるページ付け
==================================

ページ付けしたいデータを作成するためにクエリをカスタムする必要がある場合、
PaginationHelper で使われている paginate() メソッドと paginateCount()
メソッドを上書きしてください。 paginate() メソッドは Model::find()
と同じパラメータを持ちます。 独自の paginate()
を使うには、そのデータを取得するモデルの中に paginate()
関数を作成してください。

::

    /**
     * カスタムした paginate メソッド
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $conditions[] ="1 = 1 GROUP BY week, away_team_id, home_team_id";
        $recursive = -1;
        $fields = array('week', 'away_team_id', 'home_team_id');
        return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive'));
    }

この時、 paginateCount()
も同じモデルの中で上書きする必要があるでしょう。このメソッドは、
Model::findCount() と同じ引数を受け付けます。次の例は PostgreSQL
だけで使える例です。実際に使う場合は、利用するデータベース管理システムに適した記述にしてください。

::

    /**
     * カスタムした paginateCount メソッド
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

RC2 といったごく最近の CakePHP では、Model::find() メソッドに **group**
というキーワードが追加され、これを使うと paginate()
を上書きせずにすみます。 コントローラの $paginate
クラス変数を次のように指定するだけです。

::

    /**
    * GROUP BY を追加する
    */
    public $paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );

paginateCount()
メソッドは、まだ上書きする必要があります。例は上述したものと同じです。
