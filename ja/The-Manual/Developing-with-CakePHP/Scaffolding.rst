Scaffolding
###########

アプリケーションのスキャフォールディングは、開発者がオブジェクトを生成・取り出し・更新・削除することができる基本的なアプリケーションを定義し作成するという技術です。CakePHP
のスキャフォールディングを使用すると、開発者はオブジェクトがお互いにどのように関連するかを定義し、そのリンクを作成したり壊したりすることができます。

スキャフォールドを作成するために必要なことは、モデルとそのコントローラです。$scaffold
変数をコントローラ内に設定すると、動作します。

CakePHP
のスキャフォールディングはかなりクールです。これを使用すると、基本的な
CRUD
アプリケーションが出来上がり、数分で使用できます。あまりにクールなため、製品版のアプリケーションで使用したくなるほどです。それもクールだと思いますが、スキャフォールディングはあくまでスキャフォールディングであると認識しておいてください。開始するにあたって、プロジェクトの初期段階で実際に素早く構築できるというルーズな構造です。完璧に柔軟であるというわけではありません。起動し実行するための一時的な方法ということです。実際にロジックやビューをカスタマイズしたい場合、なんらかのコードを記述するためにスキャフォールディングを持ってくる時です。CakePHP
の Bake コンソールは、次の章で述べますが、すばらしい次のステップです:
たいていの現在のスキャフォールドと同じ結果を生成するあらゆるコードを生成します。

スキャフォールディングはウェブアプリケーションを開発し始めに初期段階の部分を構築する素晴らしい方法です。初期のデータベースのスキーマは変更されやすく、設計プロセスの初期段階ではあたりまえのことです。これは次のようなことがあります:
ウェブ開発者はフォームを作成するのを嫌い、実際に使用しているところをみないでしょう。開発者のストレスを減らすために、スキャフォールディングが
CakePHP
には含まれています。スキャフォールディングはデータベーステーブルを解析し、追加・削除・編集ボタンをもった標準のリストを生成し、編集用の標準フォームやデータベース内の単一の項目を検索する標準ビューを生成します。

アプリケーションにスキャフォールディングを追加するには、コントローラ内に
$scaffold 変数を追加します:

::

    <?php

    class CategoriesController extends AppController {
        var $scaffold;
    }

    ?>

最も基本的な Category モデルクラスファイル(/app/models/category.php
内)を生成すると仮定します。新しいスキャフォールドを見るために
http://example.com/categories を見てください。

スキャフォールドしたコントローラ内でメソッドを作成すると、予期しない結果を引き起こします。たとえば、スキャフォールドしたコントローラ内で
index() メソッドを作成すると、index
メソッドはスキャフォールドした機能ではないものを描画します。

スキャフォールディングはモデルの関連を意識しますので、Category モデルが
User に属している場合、Category リスト内に関連する User の ID
があるでしょう。ID
（ユーザのファーストネームのように）の近くになにかある場合、モデルで
$displayField 変数を設定することができます。

では、User クラス内の $displayField
変数を設定しましょう。そうするとユーザの関連するカテゴリがスキャフォールディングの
ID
ではなくファーストネームを表示されるでしょう。この特徴のおかげでスキャフォールディングは多くのインスタンスで読み込み可能になるでしょう。

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $displayField = 'first_name';
    }

    ?>

Creating a simple admin interface with scaffolding
==================================================

If you have enabled admin routing in your app/config/core.php, with
``Configure::write('Routing.prefixes', array('admin'));`` you can use
scaffolding to generate an admin interface.

Once you have enabled admin routing assign your admin prefix to the
scaffolding variable.

::

    var $scaffold = 'admin';

You will now be able to access admin scaffolded actions:

::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

This is an easy way to create a simple backend interface quickly. Keep
in mind that you cannot have both admin and non-admin methods scaffolded
at the same time. As with normal scaffolding you can override individual
methods and replace them with your own.

::

    function admin_view($id = null) {
      //custom code here
    }

Once you have replaced a scaffolded action you will need to create a
view file for the action as well.

Scaffold ビューをカスタマイズする
=================================

スキャフォールドのビュー内にちょっとした違いを探している場合、テンプレートを作成することができます。
製品用のアプリケーションにこのテクニックを使用するのはまだ推奨していませんが、そのようなカスタマイズはプロトタイプ段階では有用です。

ビューテンプレートを作成することでカスタマイズできます:

::

    特定のコントローラ用のカスタムスキャフォールディングビューは
    (この例では PostsController) 次のところにあります:

    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp

    全てのコントローラ用のカスタムスキャフォールディングビューは次のところにあります:

    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

