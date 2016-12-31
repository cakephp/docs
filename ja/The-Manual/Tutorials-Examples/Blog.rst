CakePHPブログチュートリアル
###########################

Cakeをさっそく使ってみましょう。このチュートリアルを読んでいるのは、Cakeの動作に関してさらに学びたいと思っているからだと思います。私たちは、生産性を高め、コーディングがさらに楽しいものになることを目指しています。コードを調べているうちに、きっとあなたもそのことに気が付くでしょう。

このチュートリアルでは、シンプルなブログアプリケーションを作成します。Cakeを取得してインストールし、データベースの設定を行い、ブログの投稿記事の一覧表示（list）、追加（add）、編集（edit）、削除（delete）などのアプリケーションロジックを作成します。

必要なもの：

#. 動作しているWebサーバ。Apacheを使っているという前提で書いてありますが、他の種類のサーバを使用する場合でも、ほぼ同じにいけるはずです。サーバの設定についても少し触れますが、たいていの人は、そのままの設定でCakeを動作させることが可能です。

#. データベースサーバ。このチュートリアルでMySQLを使用します。データベースを作成できる程度のSQLの知識が必要です。その先はCakeが面倒をみてくれます。

#. PHPの基本的な知識。オブジェクト指向プログラミングに慣れていれば非常に有利ですが、手続き型に慣れているという人でも心配する必要はありません。

#. 最後に、MVCプログラミングに関する基本的な知識が必要です。概要については、"CakePHPをはじめよう",のセクション：\ `モデル-ビュー-コントローラを理解する </ja/view/10/>`_\ を見てください。でも、心配しないでください。半ページぐらいの説明です。

それでは、はじめましょう。

Cakeをダウンロード
==================

まずは、最新のCakeのコードをダウンロードしてきましょう。

最新のCakeをダウンロードするには、CakeforgeにあるCakePHPプロジェクトを見てみましょう。
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_
そして、安定版（stable）リリースをダウンロードします。このチュートリアルでは、1.2.x.x.を使用します。

または、trunkコードを次の場所から、チェックアウト／エクスポートすることもできます。
`https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ <https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/>`_

どちらにしても、ダウンロードしたコードをDocumentRoot内に配置してください。そうすると、ディレクトリは次のようになります。

::

    /ドキュメントルートのパス
        /app
        /cake
        /docs
        /vendors
        .htaccess
        index.php

Cakeのディレクトリ構造について少し学んでおきましょう。："CakePHPの基本原則"の章、\ `CakePHP
File Structure </ja/view/19/>`_\ のセクションをチェックしてください。

ブログデータベースの作成
========================

次に、ブログで使用するデータベースをセットアップしましょう。今は、投稿記事を保存するためのテーブルをひとつ作成します。テスト用にいくつかの記事も入れておきましょう。次のSQLをデータベースで実行してください。

::

    /* まず、postsテーブルを作成します。 */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* それから、テスト用に記事をいくつか入れておきます。 */
    INSERT INTO posts (title,body,created)
        VALUES ('タイトル', 'これは、記事の本文です。', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('またタイトル', 'そこに本文が続きます。', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('タイトルの逆襲', 'こりゃ本当に面白そう！うそ。', NOW());

テーブル名とフィールド名は適当に選んだわけではありません。Cakeのデータベース命名規約とクラスの命名規約に従っておくと、（どちらも、\ `"CakePHP
規約" </ja/view/22>`_\ の中で説明されています。）たくさんの機能を自由に使うことができ、設定作業をする必要がなくなります。Cakeはフレキシブルなので、最悪な従来型のデータベーススキーマにも対応することができますが、規約に従えば、時間を節約することができます。

詳細は、\ `"CakePHP規約" </ja/view/22/>`_
を参照してください。簡単に言うと、'posts'というテーブル名にしておけば、自動的にPostモデルが呼び出され、'modified'と'created'というフィールドがあると、自動的にCakeが管理するようになります。

Cakeのデータベース設定
======================

どんどん進みましょう。データベースがどこにあって、どうやって接続するかをCakeに教えます。多くの人にとって、設定（configure）をする最初で最後の機会です。

CakePHPのデータベース設定ファイルは、\ ``/app/config/database.php.default``\ の中にあります。同一ディレクトリ上にこのファイルのコピーを作り、\ ``database.php``\ という名前にしてください。

このconfigファイルは全く複雑ではありません。$default配列の値を自分のセットアップに合わせて変更するだけです。設定の配列例は次のようなものです。

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => 'utf8'//日本語ではencodingを指定しましょう。
    );

新しくできた\ ``database.php``\ ファイルを保存したら、ブラウザをあけて、Cakeのwelcomeページを開いてください。データベース接続のファイルがある、そしてデータベースに接続できる、というメッセージが表示されるはずです。

追加の設定
==========

設定できる項目があと二つあります。たいていの開発者はこれらの詳細なリストも仕上げますが、このチュートリアルに必要不可欠、というわけではありません。ひとつは、セキュリティハッシュ用のカスタム文字列(または
"salt")です。ふたつめは、CakePHPが、\ ``tmp``\ フォルダに書き込めるようにすることです。

security
saltは、ハッシュの生成に用いられます。\ ``/app/config/core.php``\ の153行目を編集し、デフォルトのsalt値を変更してください。すぐに推測できるような値でなければ、何であってもかまいません。

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

最後の作業は、\ ``app/tmp``\ ディレクトリをWebで書き込めるようにすることです。いちばん良い方法は、Webサーバのユーザ名を調べて、(\ ``<?php echo `whoami`; ?>``)\ ``app/tmp``\ ディレクトリの所有権をそのユーザにすることです。この最後の（\*nixでの）コマンドは次のようなものです。

::

    $ chown -R www-data app/tmp

何かの理由でCakePHPがそのディレクトリに書き込めない場合、警告が表示されます。（運用モードでは表示されません。）

mod\_rewriteについて
====================

新しいユーザはmod\_rewriteでつまずくことがよくあるので、少しだけ説明をしておきます。もし、CakePHPのwelcomeページが少しおかしい（画像が表示されず、cssのスタイルが適用されていない）なら、おそらく、システム上のmod\_rewriteが機能していないということです。動作させるための幾つかのヒントを掲載しておきます。

#. httpd.confの中で、.htaccessのoverrideが許可されているか、確かめてください。各ディレクトリごとの設定を定義できる部分があります。該当するディレクトリの\ ``AllowOverride``\ が\ ``All``\ になっていることを確認してください。

#. user-やサイト固有のhttpd.confではなく、正しいhttpd.confを編集していることを確認しましょう。

#. 何かしらの理由で、.htaccessファイルが含まれていないCakePHPのファイルを入手した可能性もあります。これは、'.'ではじまるファイルを隠し属性のものとして扱い、それらをコピーしないオペレーティングシステムがあるためです。CakePHPを本家サイトのダウンロードセクションか、SVNリポジトリからダウンロードしてください。

#. Apacheが、mod\_rewriteを正しく読み込んでいることを確認しましょう。httpd.confの中に、\ ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``\ 、そして\ ``AddModule             mod_rewrite.c``\ というような部分があるはずです。

サーバでmod\_rewrite（や、その他の互換モジュール）を使いたくない、または使えないという場合には、Cakeに組み込まれている
pretty
URLsを使う必要があります。\ ``/app/config/core.php``\ の中の次の箇所のコメントを外してください。

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

また以下の .htaccess ファイルを削除してください:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

そうすると、URLは、
www.example.com/controllername/actionname/paramではなく、www.example.com/index.php/controllername/actionname/paramという仕方でアクセスできるようになります。

Postモデルの作成
================

モデルクラスは、CakePHPアプリケーションのbread and
butter(基本の基本)です。CakePHPのモデルを作成することで、データベースとやりとりできるようになり、表示（view）、追加（add）、編集（edit）、削除（delete）といった操作に必要な土台を手に入れることになります。

CakePHPのモデルクラスのファイルは、\ ``/app/models``\ の中にあり、今回は、\ ``/app/models/post.php``\ というファイルを作って保存します。ファイルの中身全体は次のようになります。

::

    <?php

    class Post extends AppModel
    {
        var $name = 'Post';
    }

    ?>

命名規約は、CakePHPでは非常にに大切です。モデルをPostという名前にすることで、CakePHPは自動的に、このモデルはPostsControllerで使用されるのだろう、と考えます。また、\ ``posts``\ という名前のデータベーステーブルと結びつけられます。

$name変数は、つけておいたほうがよいでしょう。PHP4のクラス名に関する挙動に対処するために用いられています。

テーブルの接頭辞（prefix）や、コールバック、バリデーションといったモデルの詳細については、マニュアルの\ `モデル </ja/view/66/>`_\ の章を参照してください。

Postsコントローラの作成
=======================

次に、投稿記事（posts）に対するコントローラを作成します。コントローラとは、投稿記事とやりとりするための仕事ロジックが入るところです。簡単に言うと、それは幾つかのモデルとやりとりし、投稿記事に関連する作業を行う場所です。この新しいコントローラは、\ ``posts_controller.php``\ という名前で、\ ``/app/controllers``\ ディレクトリの中に配置します。基本的なコントローラは次のようになります。

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';
    }
    ?>

では、コントローラにひとつのアクションを追加してみましょう。アクションは、アプリケーションの中のひとつの関数か、インターフェイスをあらわしています。例えば、ユーザがwww.example.com/posts/index（www.example.com/posts/と同じです。）をリクエストした場合、投稿記事の一覧が表示されると期待するでしょう。このアクションのコードは次のようになります。

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

このアクションについて少し説明しましょう。PostsControllerの中にindex()という関数を定義することによって、ユーザは、www.example.com/posts/indexというリクエストで、そのロジックにアクセスできるようになります。同様に、foobar()という関数を定義すると、ユーザは、www.example.com/posts/foobarでアクセスできるようになります。

あるURLにさせたいために、コントローラ名とアクション名をそれに合わせて独自に命名したくなるかもしれませんが、その誘惑に抵抗してください。CakePHPの規約（コントローラは複数形、など）に従って、読みやすく、理解しやすいアクション名を付けるようにしましょう。あとで、"routes"という機能を使って、URLとコードを結びつけることができます。

アクションの中にあるひとつの指令が、
``set()``\ を使って、コントローラからビュー（次に作成します。）にデータを渡しています。この行は、Postモデルの\ ``find('all')``\ メソッドから返ってきた値で、'posts'というビューの変数を設定します。Postモデルは自動的に\ ``$this->Post``\ として呼び出せるようになります。これは、Cakeの命名規約に従っているからです。

Cakeのコントローラに関する詳細は、"CakePHPによる開発"の章の、セクション\ `"コントローラ" </ja/view/49/>`_\ をチェックしてください。

Postビューの作成
================

現在、モデルにはデータが入り、コントローラにはアプリケーションロジックと流れが定義されています。今度は、作成したindexアクション用のビューを作成しましょう。

Cakeのビュー（view）は、アプリケーションのレイアウト（layout）の内側にはめこまれる、データ表示用の断片部品です。たいていのアプリケーションでは、PHPのコードが含まれるHTMLになりますが、XML、CSV、バイナリのデータにもなりえます。

レイアウト(Layout）は、ビューを囲む表示用のコードで、独自に定義したり、切り替えたりすることも可能ですが、今のところは、デフォルト（default）のものを使用することにしましょう。

一つ前のセクションの\ ``set()``\ メソッドによって、ビューから'posts'変数が使えるように割り当てたのを覚えていますか。ビューに渡されたデータは次のようなものになっています。

::

    // print_r($posts) の出力:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => タイトル
                        [body] => これは、記事の本文です。
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => またタイトル
                        [body] => そこに本文が続きます。
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => タイトルの逆襲
                        [body] => こりゃ本当に面白そう！うそ。
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Cakeのビューファイルは、\ ``/app/views``\ の中の、コントローラ名に対応するフォルダの中に保存されています。（この場合は、'posts'というフォルダを作成します。）この投稿記事データをテーブル表示するには、ビューのコードは次のようなものにできます。

::

    /app/views/posts/index.ctp

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- ここから、$posts配列をループして、投稿記事の情報を表示 -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], 
    "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

シンプルですよね。

``$html``\ というオブジェクトを使っていることに気づいたかもしれません。これは、CakePHPの\ ``HtmlHelper``\ クラスのインスタンスです。CakePHPには一連のビューヘルパーがあり、リンクの作成、フォームの出力、JavaScript、Ajaxなどをすぐに使えます。使い方の詳細については、\ `"組み込みのヘルパー"の章 </ja/view/181/>`_\ を参照してください。ここで重要なのは、\ ``link()``\ メソッドが、指定されたタイトル（最初のパラメータ）とURL(二つ目のパラメータ)でHTMLリンクを生成する、ということです。

Cake内でURLを指定する場合、単にアプリケーションの基本パスに対する相対パスを書くだけでかまいません。Cakeが残りの部分を処理します。なのでURLは通常、\ ``/コントローラ/アクション/パラメータ1/パラメータ2``\ という形になります。

この時点で、ブラウザから http://www.example.com/posts/index
を開いてみてください。タイトルと投稿内容のテーブル一覧がまとめられているビューが表示されるはずです。

ビューの中のリンク(投稿記事のタイトルから\ ``/posts/view/some_id``\ というURLへのリンク)をクリックすると、CakePHPは、そのアクションはまだ定義されていません、という表示を出します。もしそういう表示が出ない場合には、何かおかしくなってしまったか、もうすでにあなたがその定義作業をしてしまったから（仕事がハヤイ！）か、のどちらかです。そうでないなら、これからPostControllerの中に作ってみましょう。

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

``set()``\ の呼び出しはもう知っていますね。\ ``find('all')``\ の代わりに、\ ``read()``\ を使っていることに注目してください。今回は、ひとつの投稿記事の情報しか必要としないからです。

ビューのアクションが、ひとつのパラメータを取っていることに注意してください。それは、これから表示する投稿記事のID番号です。このパラメータは、リクエストされたURLを通して渡されます。ユーザが、\ ``/posts/view/3``\ とリクエストすると、'3'という値が$idとして渡されます。

では、新しい'view'アクション用のビューを作って、\ ``/app/views/posts/view.ctp``\ というファイルで保存しましょう。

::

    /app/views/posts/view.ctp

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

``/posts/index``\ の中にあるリンクをクリックしたり、手動で、\ ``/posts/view/1``\ にアクセスしたりして、動作することを確認してください。

記事の追加
==========

データベースを読み、記事を表示できるようになりました。今度は、新しい投稿ができるようにしてみましょう。

まず、PostsControllerの中に、\ ``add()``\ アクションを作ります。

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->flash('Your post has been saved.','/posts');
                }
            }
        }
    }
    ?>

``add()``\ アクションの動作は次のとおりです。もし、送信されたフォームのデータがemptyでないなら、Postモデルを使ってデータの保存を試みます。何らかの理由で保存できなかった場合には、単にビューを表示します。この時に、ユーザバリデーションエラーやその他の警告が表示されることになります。

ユーザがフォームを使ってデータをPOSTした場合、その情報は、\ ``$this->data``\ の中に入ってきます。\ ``pr()``\ を使うと、内容を画面に表示させて、確認することができます。

``$this->flash()``\ 関数は、（flashレイアウトを使用して）ユーザに１秒間メッセージを表示（flash）してから、他のURL(この場合には\ ``/posts``)にユーザを移動させる、コントローラのメソッドです。もし、DEBUGが０に設定されている場合、\ ``$this->flash()``\ は自動的にリダイレクトします。しかし、DEBUG
>
0の場合には、flashレイアウトが表示され、そのメッセージをクリックすることで、リダイレクトされる動作になります。

``save()``\ メソッドを呼ぶと、バリデーションエラーがチェックされ、もしエラーがある場合には保存動作を中止します。これらのエラーがどのように扱われるのかは次のセクションで見てみましょう。

データのバリデーション
======================

Cakeはフォームの入力バリデーションの退屈さを取り除くのに大いに役立ちます。みんな、延々と続くフォームとそのバリデーションルーチンのコーディングを好きではないでしょう。CakePHPを使うと、その作業を簡単、高速に片付けることができます。

バリデーションの機能を活用するためには、ビューの中でCakeのFormHelperを使う必要があります。FormHelperはデフォルトで、すべてのビューの中で\ ``$form``\ としてアクセスできるようになっています。

addのビューは次のようなものになります。

::

    /app/views/posts/add.ctp    
        
    <h1>Add Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Save Post');
    ?>

ここで、FormHelperを使って、HTMLフォームの開始タグを生成しています。
``$form->create()``\ が生成したHTMLは次のようになります。

::

    <form id="PostAddForm" method="post" action="/posts/add">

``create()``\ にパラメータを渡さないで呼ぶと、現在のコントローラの\ ``add()``\ アクションをPOSTで作成した、と解釈されます。

``$form->input()``\ メソッドは、同名のフォーム要素を作成するのに使われています。最初のパラメータは、どのフィールドに対応しているのかをCakePHPに教えます。２番目のパラメータは、様々なオプションの配列を指定することができます。—
この例では、textareaの列の数を指定しています。ここには少しばかりの内観的な手法とオートマジックが使われています。input()は、指定されたモデルのフィールドに基づいて、異なるフォーム要素を出力します。

``$form->end()``\ の呼び出しで、submitボタンとフォームの最後が出力されます。
``end()``\ の最初のパラメータとして文字列が指定してある場合、FormHelperは、それに合わせてsubmitボタンに名前をつけ、終了フォームタグも出力します。
ヘルパーの詳細に関しては、 `"組み込みヘルパー"の章 </ja/view/181/>`_
を参照してください。

望むなら、
``/app/views/posts/index.ctp``\ のビューが、www.example.com/posts/addを指す、新しい
"Add Post"というリンクを表示するように編集できます。

バリデーション要件について、どうやってCakePHPに指示するのだろう、と思ったかもしれません。バリデーションのルールは、モデルの中で定義することができます。Postモデルを見直して、幾つか修正してみましょう。

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => array('minLength', 1)
            ),
            'body' => array(
                'rule' => array('minLength', 1)
            )
        );
    }
    ?>

``$validate``\ 配列を使って、\ ``save()``\ メソッドが呼ばれた時に、どうやってバリデートするかをCakePHPに教えます。
　　　ここでは、本文とタイトルのフィールドが、空ではいけない、ということを設定しています。
CakePHPのバリデーションエンジンは強力で、組み込みのルールがいろいろあります。（クレジットカード番号、Emailアドレス、などなど。）また柔軟に、独自ルールを作って設定することもできます。
この設定に関する詳細は、\ `データバリデーションの章 </ja/view/125/data-validation>`_\ を参照してください。

バリデーションルールを書き込んだので、アプリケーションを動作させて、タイトルと本文を空にしたまま、記事を投稿してみてください。FormHelperのinput()メソッドを使ってフォーム要素を作成したので、バリデーションエラーのメッセージが自動的に表示されます。

投稿記事の削除
==============

次に、ユーザが投稿記事を削除できるようにする機能を作りましょう。PostsControllerの\ ``delete()``\ アクションを作るところから始めます。

::

    function delete($id) {
        $this->Post->del($id);
        $this->flash('The post with id: '.$id.' has been deleted.', '/posts');
    }

このロジックは、$idで指定された記事を削除し、\ ``flash()``\ を使って、ユーザに確認メッセージを表示し、それから
/posts にリダイレクトします。

ロジックを実行してリダイレクトするので、このアクションにはビューがありません。しかし、indexビューにリンクを付けて、投稿を削除するようにできるでしょう。

::

    /app/views/posts/index.ctp

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Add Post', '/posts/add'); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- ここで$posts配列をループして、投稿情報を表示 -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $html->link($post['Post']['title'], '/posts/view/'.$post['Post']['id']);?>
            </td>
            <td>
            <?php echo $html->link('Delete', "/posts/delete/{$post['Post']['id']}", null, 'Are you sure?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

*注意*:
このビューコードはHtmlHelperを使い、削除する前に、JavaScriptによる確認ダイアログでユーザに確認します。

投稿記事の編集
==============

投稿記事の編集：それではさっそく作業です。もうCakePHPプロのあなたは、パターンを見つけ出したでしょうか。アクションをつくり、それからビューを作る、というパターンです。PostsControllerの\ ``edit()``\ アクションはこんな形になります。

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data['Post'])) {
                $this->flash('Your post has been updated.','/posts');
            }
        }
    }

このアクションはまず、送信されたフォームデータをチェックします。もし何も送信されていないなら、投稿記事を見つけて（find）ビューに渡します。もし、何かデータが送信されているなら、Postモデルを使ってデータを保存しようとし（バリデーションエラーが見つかれば、ユーザに戻し）ます。

editビューはこんな感じです。

::

    /app/views/posts/edit.ctp
        
    <h1>Edit Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
            echo $form->input('id', array('type'=>'hidden')); 
        echo $form->end('Save Post');
    ?>

（値が入力されている場合、）このビューは、編集フォームを出力します。必要であれば、バリデーションのエラーメッセージも表示します。

ひとつ注意：
　CakePHPは、'id'フィールドがデータ配列の中に存在している場合は、モデルを編集しているのだと判断します。もし、'id'がなければ、（addのビューを復習してください。）\ ``save()``\ が呼び出された時、Cakeは新しいモデルの挿入だと判断します。

これで、特定の記事をアップデートするためのリンクをindexビューに付けることができます。

::

    /app/views/posts/index.ctp （編集リンクを追加済み）
        
    <h1>Blog posts</h1>
    <p><?php echo $html->link("Add Post", "/posts/add"); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

    <!-- $post配列をループして、投稿記事の情報を表示 -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'],'/posts/view/'.$post['Post']['id']);?>
                <?php echo $html->link(
                    'Delete', 
                    "/posts/delete/{$post['Post']['id']}", 
                    null, 
                    'Are you sure?'
                )?>
                <?php echo $html->link('Edit', '/posts/edit/'.$post['Post']['id']);?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

ルーティング（Routes）
======================

次に、Routesについて考えましょう。CakePHPのデフォルトのルーティングの動作で十分だという人もいます。しかし、ユーザフレンドリで一般の検索エンジンに対応できるような操作に関心のある開発者であれば、CakePHPの中で、URLがどのように特定の関数の呼び出しにマップされるのかを理解したいと思うはずです。このチュートリアルでは、routesを簡単に変える方法について扱います。ルーティングテクニックの応用に関する情報は、"CakePHPによる開発"のセクション、\ `"Routesの設定" </ja/view/46/>`_\ を見てください。

今のところ、ユーザがサイトを見に来ると、（たとえば、http://www.example.com）CakeはPagesControllerに接続し、homeというビューを表示するようになっています。ではこれを、ブログアプリケーションのユーザがPostsControllerに行くようにしてみましょう。

Cakeのルーティングは、
``/app/config/routes.php``\ の中にあります。デフォルトのルートのrouteをコメントアウトするか、削除します。この行です。

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

この行は、'/'というURLをデフォルトのCakePHPのホームページに接続します。これを、自分のコントローラに接続させるために、次のような行を追加してください。

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

これで、'/'でリクエストしてきたユーザを、PostControllerのindex()アクションに接続させることができます。

まとめ
======

このアプリケーションの作り方はとても素晴らしいので、平和、賞賛、女性、お金までもが、あなたの想像以上の仕方で手に入ることでしょう。シンプルですよね。ですが、気をつけてほしいのは、このチュートリアルは、非常に基本的な点しか扱っていない、ということです。CakePHPには、\ *もっともっと*\ 多くの機能があります。シンプルなチュートリアルにするために、それらはここでは扱いませんでした。マニュアルの残りの部分をガイドとして使い、もっと機能豊かなアプリケーションを作成してください。

基本的なアプリケーションの作成が終わったので、現実世界のアプリを作る準備が整いました。自分のプロジェクトを始めて、\ `マニュアル </ja/>`_\ の残りと\ `APIマニュアル <https://api.cakephp.org>`_\ を使いましょう。

助けが必要なら、#cakephpに来てください。（ただし英語。日本語なら、cakephp.jpへどうぞ。）CakePHPにようこそ。
