Scaffolding
###########

アプリケーションのスキャフォールディング(scaffolding)は開発者がオブジェクトの作成、取得、更新、
削除といった基本的なアプリケーションを定義、作成するためのテクニックです。CakePHPのスキャフォールディングはオブジェクト同士が互いにどのように関連しているかを定義し、
その接続の作成と削除ができます。

足場(scaffold)を作成するにはモデルとコントローラが必要です。コントローラに$scaffold変数を設定するだけで動作します。

CakePHPのスキャフォールディングはかなり素晴らしいです。基本的なCRUDアプリケーションを数分で作って動かすことができます。
あまりに素晴らしいのでプロダクション環境で使いたいと思うかもしれません。本当に素晴らしいのですが、
スキャフォールディングはあくまで単なる足場にすぎないということを心に留めて置いてください。
足場はプロジェクトの初期段階でとにかく早く動かすために粗いつくりになっています。
柔軟性があるというよりも、とにかく動かすための一時的な方法だと言えるでしょう。
もしロジックやビューを自分でカスタマイズしたいと思い始めたら、コードを書くために足場を使うのをやめるタイミングだと言えます。
次の章で説明するCakePHPのBakeコンソールは、すばらしい次の一歩で、現在の足場と同じ結果になるコードを生成します。

スキャフォールディングはwebアプリケーションの開発初期に必要なコードを得るためのすばらしい方法です。
設計の初期段階におけるデータベーススキーマの変更はよくあることです。しかし、このことは、
web開発者が実際の使われ方がわからないフォームの作成を嫌がるというマイナス面を生じます。
開発者の負担を軽減させるためにCakePHPはスキャフォールディング機能を提供しています。
スキャフォールディングはデータベーステーブルを分析して、追加、削除、編集ボタンがついている標準的な一覧、
編集のための標準的なフォーム、データベースの1レコードを見るための標準的なビューを作成します。

スキャフォールディングを追加するために、コントローラの中で、$scaffold変数を追加して下さい。::

    class CategoriesController extends AppController {
        public $scaffold;
    }

/app/Model/Category.php に基本的なCategoryモデルクラスを既に作成していたとすると、準備は以上となります。
新しい足場を見るために http://example.com/categories へアクセスしてみて下さい。

.. note::

    足場が作られたコントローラにメソッドを作成した場合、思った通りの結果にならない時があります。
    例えば、足場が作られたコントローラにindex()メソッドを作成した場合、そのindexメソッドはスキャフォールディング機能より優先的に描画されてしまいます。

スキャフォールディングはモデル間のつながりについての知識を与えてくれます。もしCategoryモデルがUserに従属(belongsTo)していた場合、
Category一覧に関連しているUserのIDが表示されているでしょう。スキャフォールディングはモデル間のつながりについて"知って"いますが、
手動でモデルのつながりを示すコードを追加するまでは足場のビューの中には関連したレコードが表示されません。
例えば、もしGroupが複数のUserを持っていて(hasMany)、UserがGroupに従属(belongsTo)している場合、
以下のコードをUserとGroupモデルに手動で追加しなければなりません。このコードを追加する前だと、
User追加フォームにGroupのためのselectボックスが空のまま表示されます。::

    // In Group.php
    public $hasMany = 'User';
    // In User.php
    public $belongsTo = 'Group';

もしID以外の別なもの(例えばユーザの名前など)を表示したい場合、$displayField変数をモデルで設定して下さい。
それでは、スキャフォールディングの中でIDではなく名前によってカテゴリに関連したユーザが示されるようにUserクラスに$displayFieldを設定してみましょう。::

    class User extends AppModel {
        public $name = 'User';
        public $displayField = 'first_name';
    }


Scaffoldingを使って単純な管理インターフェイスを作成する
=======================================================

もしapp/Config/core.phpにて管理ルーティングを有効にする場合、 ``Configure::write('Routing.prefixes', array('admin'));``
とすることで管理者インターフェイスを生成するためにスキャフォールディングを使えるようになります。

一旦管理ルーティングを有効にしたら、スキャフォールディング変数にadminプレフィクスを設定して下さい。::

    public $scaffold = 'admin';

以上で管理用の足場のアクションにアクセスできるようになります。::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

これは単純なバックエンドインターフェイスを素早く作るための簡単な方法です。ただし、管理用と非管理用の足場のメソッドを同時に使うことはできないことを覚えておいて下さい。
普通のスキャフォールディングでは個別のメソッドを上書きしたり、独自実装に置き換えることができます。::

    public function admin_view($id = null) {
      // custom code here
    }

一度足場のアクションを置き換えてしまうとアクションと同じビューファイルを作成する必要が出てきます。

Scaffoldビューをカスタマイズする
================================

もし足場として作成されたビューにちょっとした違いが見つかるようであれば、テンプレートを作れます。
プロダクション環境でこのテクニックを使うことはあまり勧められませんが、プロトタイプ開発の間であればここで紹介するカスタマイズは役に立つでしょう。

特定のコントローラ(例えばPostsController)のために独自の足場のビューは次のように置き換えるべきです。::

    /app/View/Posts/scaffold.index.ctp
    /app/View/Posts/scaffold.form.ctp
    /app/View/Posts/scaffold.view.ctp

すべてのコントローラのために独自の足場のビューは次のように置き換えられるべきです。::

    /app/View/Scaffolds/index.ctp
    /app/View/Scaffolds/form.ctp
    /app/View/Scaffolds/view.ctp


.. meta::
    :title lang=en: Scaffolding
    :keywords lang=en: database schemas,loose structure,scaffolding,scaffold,php class,database tables,web developer,downside,web application,logic,developers,cakephp,running,current,delete,database application

