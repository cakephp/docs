# 入門

CakePHPフレームワークはアプリケーションの堅牢な基礎を提供します。
これは最初のユーザのリクエスト全てから最後のWEBページのレンダリングまで、全面的に取り扱います。
またフレームワークがMVCの原則に従うことから、アプリケーションのほとんどの側面に於いてカスタマイズ・拡張が簡単にできるようになります。

このフレームワークはファイル名からデータベースのテーブル名まで、基礎的な組織構造も提供し、アプリケーション全体を矛盾無く論理的に保ちます。
この概念は単純ですが強力です。
規約に従うことで、どこに何があるのか、それらがどのように組織化されているのかを、いつも確実に把握できるのです。

CakePHPを体験し学ぶ最良の方法は腰を据えて何かを作ることです。
手始めに、単純なブログアプリケーションを構築します。

## ブログチュートリアル

CakePHP をさっそく使ってみましょう。このチュートリアルを読んでいるのは、
CakePHP の動作に関してさらに学びたいと思っているからだと思います。
私たちは、生産性を高め、コーディングがさらに楽しいものになることを目指しています。
コードを調べているうちに、きっとあなたもそのことに気が付くでしょう。

このチュートリアルでは、シンプルなブログアプリケーションを作成します。CakePHP を取得して
インストールし、データベースの設定を行い、ブログの投稿記事の一覧表示 (*list*)、追加 (*add*)、
編集 (*edit*)、削除 (*delete*) などのアプリケーションロジックを作成します。

必要なもの:

1.  動作しているウェブサーバ。Apache を使っているという前提で書いてありますが、
    他の種類のサーバを使用する場合でも、ほぼ同じにいけるはずです。サーバの設定を
    少し変える必要があるかもしれませんが、たいていの人は、そのままの設定で CakePHP を
    動作させることが可能です。PHP 5.3.0 以上が動作していることを確認してください。
2.  データベースサーバ。このチュートリアルで MySQL を使用します。
    データベースを作成できる程度の SQL の知識が必要です。その先は CakePHP が面倒を
    みてくれます。MySQL を使用するので、PHP で `pdo_mysql` が有効になっていることを
    確認してください。
3.  PHP の基本的な知識。オブジェクト指向プログラミングに慣れていれば非常に有利ですが、
    手続き型に慣れているという人でも心配する必要はありません。
4.  最後に、MVC プログラミングに関する基本的な知識が必要です。概要については、
    [MVC(\*Model-View-Controller\*)を理解する](cakephp-overview/understanding-model-view-controller) を見てください。
    半ページぐらいの説明ですので、心配はご無用です。

それでは、はじめましょう！

### CakePHP のダウンロード

まずは、最新の CakePHP のコードをダウンロードしてきましょう。

最新の CakePHP をダウンロードするには、GitHub にある CakePHP プロジェクトを見てみましょう:
<https://github.com/cakephp/cakephp/tags>
そして、2.0 の最新リリースをダウンロードします。

または、 [git](https://git-scm.com/) を使ってレポジトリを clone することもできます。 :

    git clone -b 2.x git://github.com/cakephp/cakephp.git

どちらにしても、ダウンロードしたコードを DocumentRoot 内に配置してください。
そうすると、ディレクトリは次のようになります:

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

CakePHP のディレクトリ構造について少し学んでおきましょう:
[CakePHP のフォルダ構造](getting-started/cakephp-folder-structure) のセクションをチェックしてください。

#### Tmp ディレクトリのパーミッション

次に、 `app/tmp` ディレクトリをウェブサーバから書き込めるように設定します。
これを行うためのいちばんいい方法は、ウェブサーバを動作させているユーザーを見つけることです。
次のコード `<?php echo exec('whoami'); ?>` を任意の PHP ファイルに記述して、
ウェブサーバで実行してみましょう。すると、ウェブサーバを実行しているユーザの名前が
表示されるはずです。そのユーザーに `app/tmp` ディレクトリの所有権を変更します。
実行するコマンドは (\*nixで) このようになります:

``` bash
$ chown -R www-data app/tmp
```

何らかの理由で CakePHP がそのディレクトリに書き込めない場合は、キャッシュデータが
書き込めないという警告や例外が表示されます。

### ブログデータベースの作成

次に、ブログで使用する基礎的なデータベースをセットアップしましょう。データベースを
まだ作成していないのであれば、このチュートリアル用に好きな名前で空のデータベースを
作成しておいてください。このページでは、投稿記事を保存するためのテーブルをひとつ作成します。
次の SQL をデータベースで実行してください。 :

``` text
/* まず、posts テーブルを作成します: */
CREATE TABLE posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    body TEXT,
    created DATETIME DEFAULT NULL,
    modified DATETIME DEFAULT NULL
);

/* それから、テスト用に記事をいくつか入れておきます: */
INSERT INTO posts (title,body,created)
    VALUES ('タイトル', 'これは、記事の本文です。', NOW());
INSERT INTO posts (title,body,created)
    VALUES ('またタイトル', 'そこに本文が続きます。', NOW());
INSERT INTO posts (title,body,created)
    VALUES ('タイトルの逆襲', 'こりゃ本当にわくわくする！うそ。', NOW());
```

テーブル名とフィールド名は適当に選んだわけではありません。CakePHP のデータベース命名規約と
クラスの命名規約に従っておくと、（どちらも、
[CakePHP の規約](getting-started/cakephp-conventions) の中で説明されています）たくさんの機能を
自由に使うことができ、設定作業をする必要がなくなります。CakePHP はフレキシブルなので、
最悪な従来型のデータベーススキーマにも対応することができますが、規約に従えば、
時間を節約することができます。

詳細は、 [CakePHP の規約](getting-started/cakephp-conventions) を参照してください。簡単に言うと、
'posts' というテーブル名にしておけば、自動的に Post モデルが呼び出され、'modified' と
'created' というフィールドがあると、自動的にCakePHP が管理するようになります。

### CakePHP のデータベース設定

どんどん進みましょう。データベースがどこにあって、どうやって接続するかを CakePHP に教えます。
多くの人にとって、設定 (*configure*) をする最初で最後の機会です。

CakePHP のデータベース設定ファイルの元は、 `/app/Config/database.php.default` の中に
あります。同一ディレクトリ上にこのファイルのコピーを作り、 `database.php`
という名前にしてください。

この設定ファイルの中身は一目瞭然です。 `$default` 配列の値を自分のセットアップに合わせて
変更するだけです。完全な設定の配列の例は次のようなものになるでしょう:

``` php
public $default = array(
    'datasource' => 'Database/Mysql',
    'persistent' => false,
    'host' => 'localhost',
    'port' => '',
    'login' => 'cakeBlog',
    'password' => 'c4k3-rUl3Z',
    'database' => 'cake_blog_tutorial',
    'schema' => '',
    'prefix' => '',
    'encoding' => 'utf8'
);
```

新しくできた `database.php` ファイルを保存したら、ブラウザを開いて、CakePHP の
welcome ページを見てください。データベース接続のファイルがあり、そしてデータベースに
接続できる、というメッセージが表示されるはずです。

> [!NOTE]
> PDO と pdo_mysql が php.ini で有効になっている必要があることを覚えておいてください。

### 追加の設定

設定できる項目があといくつかあります。たいていの開発者はこれらの詳細なリストも仕上げますが、
このチュートリアルに必要不可欠、というわけではありません。ひとつは、セキュリティハッシュ用の
カスタム文字列(「salt」ともいう)です。二つ目は、カスタム番号 (「seed」ともいう) を暗号化用に
定義するということです。

セキュリティ用の salt は、ハッシュの生成に用いられます。 `/app/Config/core.php` を
編集し、デフォルトの `Security.salt` の値を変更してください。
この値は、ランダムで長い文字列にします。そうすることで推測がより困難になります。 :

``` php
/**
 * A random string used in security hashing methods.
 */
Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
```

サイファシード(*cipher seed*) は暗号化・復号化のための文字列です。
`/app/Config/core.php` を編集して `Security.cipherSeed` をデフォルト値から
変更してください。この値は、大きくてランダムな整数でなければなりません:

``` php
/**
 * A random numeric string (digits only) used to encrypt/decrypt strings.
 */
Configure::write('Security.cipherSeed', '7485712659625147843639846751');
```

### mod_rewrite について

新しいユーザは mod_rewrite でつまずくことがよくあります。例えば CakePHP の
welcome ページが少しおかしくなったりします (画像が表示されない、CSS が効いていない)。
これはおそらく、システム上の mod_rewrite が機能していないということです。
以下のいずれかの項目を参照して、URL リライティングが有効になるように設定してください。

- [URLリライティング](installation/url-rewriting)

はじめての CakePHP アプリケーションを構築しはじめるには、続けて
[ブログチュートリアル - レイヤーの追加](tutorials-and-examples/blog/part-two)
を見てください。

## ブログチュートリアル - レイヤーの追加

### Post モデルの作成

モデルクラスは、CakePHP アプリケーションの基本中の基本 (*bread and butter*) です。
CakePHP のモデルを作成することで、データベースとやりとりできるようになり、表示 (*view*)、
追加 (*add*)、編集 (*edit*)、削除 (*delete*) といった操作に必要な土台を
手に入れることになります。

CakePHP のモデルクラスのファイルは、 `/app/Model` の中にあり、今回は、
`/app/Model/Post.php` というファイルを作って保存します。
ファイルの中身全体は次のようになります:

``` php
class Post extends AppModel {
}
```

命名規約は、CakePHP では非常に大切です。モデルを Post という名前にすることで、
CakePHP は自動的に、このモデルは PostsController で使用されるのだろうと考えます。
また、 `posts` という名前のデータベーステーブルと結びつけられます。

> [!NOTE]
> もし一致するファイルが /app/Model に見つけられなければ、CakePHP は動的に
> モデルオブジェクトを生成します。これはまた、不意に間違ったファイル名 (例えば、
> post.php や posts.php) をつけると、CakePHP はどんな設定も認識できず、
> 代わりにデフォルトのものを使うことになるということも意味します。

テーブルの接頭辞 (*prefix*) や、コールバック、バリデーションといったモデルの詳細については、
マニュアルの [モデル](models) の章を参照してください。

### Posts コントローラの作成

次に、投稿記事 (*posts*) に対するコントローラを作成します。
コントローラとは、投稿記事とやりとりするためのビジネスロジックが入るところです。
簡単に言うと、それは幾つかのモデルとやりとりし、投稿記事に関連する作業を行う場所です。
この新しいコントローラは、 `PostsController.php` という名前で、 `/app/Controller`
ディレクトリの中に配置します。基本的なコントローラは次のようになります:

``` php
class PostsController extends AppController {
    public $helpers = array('Html', 'Form');
}
```

では、コントローラにひとつのアクションを追加してみましょう。アクションは、
アプリケーションの中のひとつの関数か、インターフェイスをあらわしています。
例えば、ユーザが www.example.com/posts/index (www.example.com/posts/ と同じです)
をリクエストした場合、投稿記事の一覧が表示されると期待するでしょう。
このアクションのコードは次のようになります:

``` php
class PostsController extends AppController {
    public $helpers = array('Html', 'Form');

    public function index() {
        $this->set('posts', $this->Post->find('all'));
    }
}
```

PostsController の中に `index()` という関数を定義することによって、ユーザは、
www.example.com/posts/index というリクエストで、そのロジックにアクセスできるようになります。
同様に、 `foobar()` という関数を定義すると、ユーザは、www.example.com/posts/foobar
でアクセスできるようになります。

> [!WARNING]
> ある URL にさせたいために、コントローラ名とアクション名をそれに合わせて独自に
> 命名したくなるかもしれませんが、その誘惑に抵抗してください。CakePHP の規約
> （大文字化、複数形の名前など）に従って、読みやすく、理解しやすいアクション名を
> 付けるようにしましょう。あとで、「routes」という機能を使って、URL とコードを
> 結びつけることができます。

アクションの中にあるひとつの命令が、 `set()` を使って、コントローラからビュー
(次に作成します) にデータを渡しています。この行は、Post　モデルの `find('all')`
メソッドから返ってきた値で、「posts」というビューの変数を設定します。
Post モデルは自動的に `$this->Post` として呼び出せるようになります。
これは、CakePHP の命名規約に従っているからです。

CakePHP のコントローラに関する詳細は、 [コントローラ](controllers) の章をチェックしてください。

### Post ビューの作成

現在、モデルにはデータが入り、コントローラにはアプリケーションロジックと流れが定義されています。
今度は、作成した index アクション用のビューを作成しましょう。

CakePHP のビュー (*view*) は、アプリケーションのレイアウト (*layout*) の内側に
はめこまれる、データ表示用の断片部品です。たいていのアプリケーションでは、PHP のコードが
含まれる HTML になりますが、XML、CSV、バイナリのデータにもなりえます。

レイアウト (*Layout*) は、ビューを囲む表示用のコードで、独自に定義したり、
切り替えたりすることも可能ですが、今のところは、デフォルト (*default*) のものを
使用することにしましょう。

一つ前のセクションの `set()` メソッドによって、ビューから「posts」変数が使えるように
割り当てたのを覚えていますか。ビューに渡されたデータは次のようなものになっています:

``` text
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
                    [body] => こりゃ本当にわくわくする！うそ。
                    [created] => 2008-02-13 18:34:57
                    [modified] =>
                )
        )
)
```

CakePHP のビューファイルは、 `/app/View` の中の、コントローラ名に対応するフォルダの中に
保存されています (この場合は、「Posts」というフォルダを作成します)。
この投稿記事データをテーブル表示するには、ビューのコードは次のようなものにできます

``` php
<!-- File: /app/View/Posts/index.ctp -->

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
            <?php echo $this->Html->link($post['Post']['title'],
array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
        </td>
        <td><?php echo $post['Post']['created']; ?></td>
    </tr>
    <?php endforeach; ?>
    <?php unset($post); ?>
</table>
```

`$this->Html` というオブジェクトを使っていることに気づいたかもしれません。
これは、CakePHP の `HtmlHelper` クラスのインスタンスです。
CakePHP には一連のビューヘルパーがあり、リンクの作成、フォームの出力、
JavaScript、AJAX などをすぐに使えます。使い方の詳細については、
[ヘルパー](views/helpers) を参照してください。ここで重要なのは、
`link()` メソッドが、指定されたタイトル（最初のパラメータ）と
URL (二つ目のパラメータ) で HTML リンクを生成する、ということです。

CakePHP 内で URL を指定する場合、配列フォーマットの使用が推奨されます。
これはルーティングの章で詳しく説明されます。URL に配列フォーマットを用いることによって、
CakePHP のリバースルーティング機能を活用することができます。また、
/コントローラ/アクション/パラメータ1/パラメータ2
という形のアプリケーションの基本パスに対する相対パスを単に書くこともできます。

この時点で、ブラウザから <http://www.example.com/posts/index> を開いてみてください。
タイトルと投稿内容のテーブル一覧がまとめられているビューが表示されるはずです。

ビューの中のリンク (投稿記事のタイトルから /posts/view/some_id という URL へのリンク) を
クリックすると、CakePHP は、そのアクションはまだ定義されていません、という表示を出します。
もしそういう表示が出ない場合には、何かおかしくなってしまったか、もうすでにあなたが
その定義作業をしてしまったから（仕事がハヤイ！）か、のどちらかです。
そうでないなら、これから PostsController の中に作ってみましょう:

``` php
// File: /app/Controller/PostsController.php
class PostsController extends AppController {
    public $helpers = array('Html', 'Form');

    public function index() {
         $this->set('posts', $this->Post->find('all'));
    }

    public function view($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }
        $this->set('post', $post);
    }
}
```

`set()` の呼び出しはもう知っていますね。 `find('all')` の代わりに、
`findById()` を使っていることに注目してください。今回は、ひとつの投稿記事の情報しか
必要としないからです。

ビューのアクションが、ひとつのパラメータを取っていることに注意してください。
それは、これから表示する投稿記事のID番号です。このパラメータは、リクエストされた
URL を通して渡されます。ユーザが、 `/posts/view/3` とリクエストすると、
「3」という値が `$id` として渡されます。

ユーザーが実在するレコードにアクセスすることを保証するために少しだけエラーチェックを行います。
もしユーザが `/posts/view` とリクエストしたら、 `NotFoundException` を送出し
CakePHP の ErrorHandler に処理が引き継がれます。また、ユーザーが存在するレコードに
アクセスしたことを確認するために同様のチェックを実行します。

では、新しい「view」アクション用のビューを作って、 `/app/View/Posts/view.ctp`
というファイルで保存しましょう。

``` php
<!-- File: /app/View/Posts/view.ctp -->

<h1><?php echo h($post['Post']['title']); ?></h1>

<p><small>Created: <?php echo $post['Post']['created']; ?></small></p>

<p><?php echo h($post['Post']['body']); ?></p>
```

`/posts/index` の中にあるリンクをクリックしたり、手動で、 `/posts/view/1`
にアクセスしたりして、動作することを確認してください。

### 記事の追加

データベースを読み、記事を表示できるようになりました。今度は、新しい投稿が
できるようにしてみましょう。

まず、PostsController の中に、 `add()` アクションを作ります:

``` php
class PostsController extends AppController {
    public $helpers = array('Html', 'Form', 'Flash');
    public $components = array('Flash');

    public function index() {
        $this->set('posts', $this->Post->find('all'));
    }

    public function view($id) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }
        $this->set('post', $post);
    }

    public function add() {
        if ($this->request->is('post')) {
            $this->Post->create();
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been saved.'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('Unable to add your post.'));
        }
    }
}
```

> [!NOTE]
> `$this->request->is()` は、リクエストのメソッド (`get`, `put`, `post`,
> `delete`) もしくはリクエストの識別子 (`ajax`) を指定する１つの引数を持ちます。
> それは、ポストされたデータの内容をチェックするためのものでは **ありません**。
> `$this->request->is('book')` は、 もし book データがポストされたとしても、
> true を返しません。

> [!NOTE]
> FlashComponent と FlashHelper を、使うコントローラで読み込む必要があります。
> 必要不可欠なら、AppController で読み込むようにしてください。

`add()` アクションの動作は次のとおりです: もし、リクエストの HTTP メソッドが
POST なら、Post モデルを使ってデータの保存を試みます。
何らかの理由で保存できなかった場合には、単にビューを表示します。
この時に、ユーザバリデーションエラーやその他の警告が表示されることになります。

すべての CakePHP のリクエストは `CakeRequest` オブジェクトに格納されており、
`$this->request` でアクセスできます。リクエストオブジェクトには、受信したリクエストに
関するいろんな情報が含まれているので、アプリケーションのフローの制御に利用できます。今回は、
リクエストが HTTP POST かどうかの確認に `CakeRequest::is()` メソッドを
使用しています。

ユーザがフォームを使ってデータを POST した場合、その情報は、 `$this->request->data`
の中に入ってきます。 `pr()` や `debug()` を使うと、
内容を画面に表示させて、確認することができます。

FlashComponent の `FlashComponent::success()` メソッドを使って
セッション変数にメッセージをセットすることによって、リダイレクト後のページでこれを表示します。
レイアウトでは `FlashHelper::render()` を用いて、メッセージを表示し、
対応するセッション変数を削除します。コントローラの `Controller::redirect`
関数は別の URL にリダイレクトを行います。 `array('action' => 'index')` パラメータは
/posts、つまり posts コントローラの index アクションを表す URL に解釈されます。
多くの CakePHP の関数で指定できるURLのフォーマットについては、
[API](https://api.cakephp.org) の `Router::url()`
関数を参考にすることができます。

`save()` メソッドを呼ぶと、バリデーションエラーがチェックされ、もしエラーがある場合には
保存動作を中止します。これらのエラーがどのように扱われるのかは次のセクションで見てみましょう。

新しい情報を保存するために、最初に `create()` メソッドでモデルの状態をリセットします。
それは、データベース内にレコードを作成するわけではなく、 Model::\$id を消去し、
データベースフィールドのデフォルト値を元に Model::\$data を設定します。

### データのバリデーション

CakePHP はフォームの入力バリデーションの退屈さを取り除くのに大いに役立ちます。
みんな、延々と続くフォームとそのバリデーションルーチンのコーディングは好まないでしょう。
CakePHP を使うと、その作業を簡単、高速に片付けることができます。

バリデーションの機能を活用するためには、ビューの中で CakePHP の FormHelper を
使う必要があります。 `FormHelper` はデフォルトで、すべてのビューの中で
`$this->Form` としてアクセスできるようになっています。

add のビューは次のようなものになります:

``` php
<!-- File: /app/View/Posts/add.ctp -->

<h1>Add Post</h1>
<?php
echo $this->Form->create('Post');
echo $this->Form->input('title');
echo $this->Form->input('body', array('rows' => '3'));
echo $this->Form->end('Save Post');
?>
```

ここで、FormHelper を使って、HTML フォームの開始タグを生成しています。
`$this->Form->create()` が生成した HTML は次のようになります:

``` html
<form id="PostAddForm" method="post" action="/posts/add">
```

`create()` にパラメータを渡さないで呼ぶと、現在のコントローラの add() アクション
(または `id` がフォームデータに含まれる場合 `edit()` アクション) に、
POST で送るフォームを構築している、と解釈されます。

`$this->Form->input()` メソッドは、同名のフォーム要素を作成するのに使われています。
最初のパラメータは、どのフィールドに対応しているのかを CakePHP に教えます。
２番目のパラメータは、様々なオプションの配列を指定することができます。
- この例では、textarea の列の数を指定しています。
ここではちょっとした内観的で自動的な手法が使われています。
`input()` は、指定されたモデルのフィールドに基づいて、異なるフォーム要素を出力します。

`$this->Form->end()` の呼び出しで、submit ボタンとフォームの終了部分が出力されます。
`end()` の最初のパラメータとして文字列が指定してある場合、FormHelper は、
それに合わせて submit ボタンに名前をつけ、終了フォームタグも出力します。
ヘルパーの詳細に関しては、 [ヘルパー](views/helpers) を参照してください。

さて少し戻って、 `/app/View/Posts/index.ctp` のビューで「Add Post」というリンクを
新しく表示するように編集しましょう。 `<table>` の前に、以下の行を追加してください:

``` php
<?php echo $this->Html->link(
    'Add Post',
    array('controller' => 'posts', 'action' => 'add')
); ?>
```

バリデーション要件について、どうやって CakePHP に指示するのだろう、と思ったかもしれません。
バリデーションのルールは、モデルの中で定義することができます。
Post モデルを見直して、幾つか修正してみましょう:

``` php
class Post extends AppModel {
    public $validate = array(
        'title' => array(
            'rule' => 'notBlank'
        ),
        'body' => array(
            'rule' => 'notBlank'
        )
    );
}
```

`$validate` 配列を使って、 `save()` メソッドが呼ばれた時に、
どうやってバリデートするかを CakePHP に教えます。ここでは、本文とタイトルのフィールドが、
空ではいけない、ということを設定しています。CakePHP のバリデーションエンジンは強力で、
組み込みのルールがいろいろあります (クレジットカード番号、メールアドレスなど）。
また柔軟に、独自ルールを作って設定することもできます。この設定に関する詳細は、
[データバリデーション](models/data-validation) を参照してください。

バリデーションルールを書き込んだので、アプリケーションを動作させて、タイトルと本文を
空にしたまま、記事を投稿してみてください。 `FormHelper::input()` メソッドを
使ってフォーム要素を作成したので、バリデーションエラーのメッセージが自動的に表示されます。

### 投稿記事の編集

それではさっそく投稿記事の編集ができるように作業をしましょう。
もう CakePHP プロのあなたは、パターンを見つけ出したでしょうか。
アクションをつくり、それからビューを作る、というパターンです。
PostsController の `edit()` アクションはこんな形になります:

``` php
public function edit($id = null) {
    if (!$id) {
        throw new NotFoundException(__('Invalid post'));
    }

    $post = $this->Post->findById($id);
    if (!$post) {
        throw new NotFoundException(__('Invalid post'));
    }

    if ($this->request->is(array('post', 'put'))) {
        $this->Post->id = $id;
        if ($this->Post->save($this->request->data)) {
            $this->Flash->success(__('Your post has been updated.'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Flash->error(__('Unable to update your post.'));
    }

    if (!$this->request->data) {
        $this->request->data = $post;
    }
}
```

このアクションではまず、ユーザが実在するレコードにアクセスしようとしていることを確認します。
もし `$id` パラメータが渡されてないか、ポストが存在しない場合、
`NotFoundException` を送出して CakePHP の ErrorHandler に処理を委ねます。

次に、リクエストが POST か PUT であるかをチェックします。もしリクエストが POST か PUT なら、
POST データでレコードを更新したり、バリデーションエラーを表示したりします。

もし `$this->request->data` が空っぽだったら、取得していたポストレコードを
そのままセットしておきます。

edit ビューは以下のようになるでしょう:

``` php
<!-- File: /app/View/Posts/edit.ctp -->

<h1>Edit Post</h1>
<?php
echo $this->Form->create('Post');
echo $this->Form->input('title');
echo $this->Form->input('body', array('rows' => '3'));
echo $this->Form->input('id', array('type' => 'hidden'));
echo $this->Form->end('Save Post');
?>
```

（値が入力されている場合、）このビューは、編集フォームを出力します。
必要であれば、バリデーションのエラーメッセージも表示します。

ひとつ注意： CakePHP は、「id」フィールドがデータ配列の中に存在している場合は、
モデルを編集しているのだと判断します。もし、「id」がなければ、(add のビューを復習してください)
`save()` が呼び出された時、CakePHP は新しいモデルの挿入だと判断します。

これで、特定の記事をアップデートするためのリンクを index ビューに付けることができます:

``` php
<!-- File: /app/View/Posts/index.ctp  (編集リンクを追加済み) -->

<h1>Blog posts</h1>
<p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Action</th>
        <th>Created</th>
    </tr>

<!-- $posts 配列をループして、投稿記事の情報を表示 -->

<?php foreach ($posts as $post): ?>
    <tr>
        <td><?php echo $post['Post']['id']; ?></td>
        <td>
            <?php
                echo $this->Html->link(
                    $post['Post']['title'],
                    array('action' => 'view', $post['Post']['id'])
                );
            ?>
        </td>
        <td>
            <?php
                echo $this->Html->link(
                    'Edit',
                    array('action' => 'edit', $post['Post']['id'])
                );
            ?>
        </td>
        <td>
            <?php echo $post['Post']['created']; ?>
        </td>
    </tr>
<?php endforeach; ?>

</table>
```

### 投稿記事の削除

次に、ユーザが投稿記事を削除できるようにする機能を作りましょう。
PostsController の `delete()` アクションを作るところから始めます:

``` php
public function delete($id) {
    if ($this->request->is('get')) {
        throw new MethodNotAllowedException();
    }

    if ($this->Post->delete($id)) {
        $this->Flash->success(
            __('The post with id: %s has been deleted.', h($id))
        );
    } else {
        $this->Flash->error(
            __('The post with id: %s could not be deleted.', h($id))
        );
    }

    return $this->redirect(array('action' => 'index'));
}
```

このロジックは、\$id で指定された記事を削除し、 `$this->Flash->success()`
を使って、ユーザに確認メッセージを表示し、それから `/posts` にリダイレクトします。
ユーザーが GET リクエストを用いて削除を試みようとすると、例外を投げます。
捕捉されない例外は CakePHP の例外ハンドラーによって捕まえられ、気の利いたエラーページが
表示されます。多くの組み込み [例外(Exception)](development/exceptions) があり、アプリケーションが
生成することを必要とするであろう様々な HTTP エラーを指し示すのに使われます。

ロジックを実行してリダイレクトするので、このアクションにはビューがありません。
しかし、index ビューにリンクを付けて、投稿を削除するようにできるでしょう:

``` php
<!-- File: /app/View/Posts/index.ctp -->

<h1>Blog posts</h1>
<p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Actions</th>
        <th>Created</th>
    </tr>

<!-- ここで $posts 配列をループして、投稿情報を表示 -->

    <?php foreach ($posts as $post): ?>
    <tr>
        <td><?php echo $post['Post']['id']; ?></td>
        <td>
            <?php
                echo $this->Html->link(
                    $post['Post']['title'],
                    array('action' => 'view', $post['Post']['id'])
                );
            ?>
        </td>
        <td>
            <?php
                echo $this->Form->postLink(
                    'Delete',
                    array('action' => 'delete', $post['Post']['id']),
                    array('confirm' => 'Are you sure?')
                );
            ?>
            <?php
                echo $this->Html->link(
                    'Edit', array('action' => 'edit', $post['Post']['id'])
                );
            ?>
        </td>
        <td>
            <?php echo $post['Post']['created']; ?>
        </td>
    </tr>
    <?php endforeach; ?>

</table>
```

`~FormHelper::postLink()` を使うと、投稿記事の削除を行う POST
リクエストをするための JavaScript を使うリンクが生成されます。ウェブクローラーが
不意にコンテンツ全てを削除できてしまうので、GETリクエストを用いたコンテンツの削除を
許可することは危険です。

> [!NOTE]
> このビューコードは FormHelper を使い、削除する前に、JavaScript による
> 確認ダイアログでユーザに確認します。

### ルーティング(*Routes*)

CakePHP のデフォルトのルーティングの動作で十分だという人もいます。しかし、ユーザフレンドリで
一般の検索エンジンに対応できるような操作に関心のある開発者であれば、CakePHP の中で、
URL がどのように特定の関数の呼び出しにマップされるのかを理解したいと思うはずです。
このチュートリアルでは、routes を簡単に変える方法について扱います。

ルーティングテクニックの応用に関する情報は、 [Routes Configuration](development/routing#routes-configuration) を見てください。

今のところ、ユーザがサイト (たとえば、 <http://www.example.com>) を見に来ると、
CakePHP は PagesController に接続し、「home」というビューを表示するようになっています。
ではこれを、ルーティングルールを作成して PostsController に行くようにしてみましょう。

CakePHP のルーティングは、 `/app/Config/routes.php` の中にあります。
デフォルトのトップページのルートをコメントアウトするか、削除します。
この行です:

``` php
Router::connect(
    '/',
    array('controller' => 'pages', 'action' => 'display', 'home')
);
```

この行は、「/」という URL をデフォルトの CakePHP のホームページに接続します。
これを、自分のコントローラに接続させるために、次のような行を追加してください:

``` php
Router::connect('/', array('controller' => 'posts', 'action' => 'index'));
```

これで、「/」でリクエストしてきたユーザを、PostController の index() アクションに
接続させることができます。

> [!NOTE]
> CakePHP は「リバースルーティング」も利用します。
> 上記のルートが定義されている状態で、配列を期待する関数に
> `array('controller' => 'posts', 'action' => 'index')`
> を渡すと、結果のURLは「/」になります。
> つまり、URL の指定に常に配列を使うということが良策となります。
> これによりルートが URL の行き先を定義する意味を持ち、
> リンクが確実に同じ場所を指し示すようになります。

### まとめ

気をつけてほしいのは、
このチュートリアルは、非常に基本的な点しか扱っていない、ということです。
CakePHP には、もっともっと *多くの* 機能があります。シンプルなチュートリアルにするために、
それらはここでは扱いませんでした。マニュアルの残りの部分をガイドとして使い、
もっと機能豊かなアプリケーションを作成してください。

基本的なアプリケーションの作成が終わったので、現実世界のアプリを作る準備が整いました。
自分のプロジェクトを始めて、 [Cookbook](index) の残りと
[API](https://api.cakephp.org) を使いましょう。

もし困ったときは、いろんな方法で助けを得ることができます。
[情報の探し方](cakephp-overview/where-to-get-help) を見てみてください。
CakePHP にようこそ！

#### お勧めの参考文献

CakePHP を学習する人が次に学びたいと思う共通のタスクがいくつかあります:

1.  [View Layouts](views#view-layouts): ウェブサイトのレイアウトをカスタマイズする
2.  [View Elements](views#view-elements) ビューのスニペットを読み込んで再利用する
3.  [Scaffolding](controllers/scaffolding): コードを作成する前のプロトタイピング
4.  [Bakeでコード生成](console-and-shells/code-generation-with-bake) 基本的な CRUD コードの生成
5.  [シンプルな認証と承認のアプリケーション](tutorials-and-examples/blog-auth-example/auth): ユーザの認証と承認のチュートリアル

### その他の資料

- [CakePHP の典型的なリクエスト](getting-started/a-typical-cakephp-request)
- [CakePHP の規約](getting-started/cakephp-conventions)
- [CakePHP のフォルダ構造](getting-started/cakephp-folder-structure)
- [CakePHP の構造](getting-started/cakephp-structure)
