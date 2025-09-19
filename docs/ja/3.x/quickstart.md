# クイックスタートガイド

CakePHP を学ぶ最も良い方法はなにか作ってみることです。
簡単なコンテンツ管理アプリケーションから作ることを始めましょう。

## コンテンツ管理チュートリアル

このチュートリアルは簡単な `CMS (Content Management System)` アプリケーションを作ります。
はじめに CakePHP のインストールを行い、データベースの作成、
そしてアプリケーションを素早く仕上げるための CakePHP が提供するツールを使います。

必要なもの:

1.  データベースサーバー。このチュートリアルでは MySQL サーバーを使います。
    データベースを作成するための SQL の知識が必要です。CakePHP は、それを前提としています。
    MySQL を使用するとき、 PHP で `pdo_mysql` が有効になっていることを確認してください。
2.  基礎的な PHP の知識。

始める前に、最新の PHP バージョンであることを確認してください。

``` bash
php -v
```

最低でも PHP (CLI) 以上をインストールしてください。
あなたのウェブサーバーの PHP バージョンもまた、 以上でなければなりません。
そして、コマンドラインインターフェイス (CLI) の PHP バージョンと同じバージョンにしてください。

### CakePHP の取得

最も簡単な CakePHP のインストール方法は Composer を使う方法です。Composer は、
ターミナルやコマンドラインプロンプトから CakePHP をインストールのシンプルな方法です。
まだ準備ができていない場合、最初に Composer をダウンロードとインストールが必要です。
cURL がインストールされていたら、次のように実行するのが簡単です。

``` bash
curl -s https://getcomposer.org/installer | php
```

もしくは [Composer のウェブサイト](https://getcomposer.org/download/)
から `composer.phar` をダウンロードすることができます。

そして、インストールディレクトリーからターミナルに次の行を入力するだけで、現在の作業ディレクトリーの
**cms** ディレクトリーに CakePHP アプリケーションのスケルトンをインストールすることができます。

``` bash
php composer.phar create-project --prefer-dist cakephp/app:^3.8 cms
```

[Composer Windows Installer](https://getcomposer.org/Composer-Setup.exe)
をダウンロードして実行した場合、インストールディレクトリー (例えば、 C:\wamp\www\dev\cakephp3)
からターミナルに次の行を入力してください。

``` bash
composer self-update && composer create-project --prefer-dist cakephp/app:^3.8 cms
```

Composer を使うメリットは、 正しいファイルパーミッションの設定や、 **config/app.php**
ファイルの作成などのように、自動的に完全なセットアップをしてくれることです。

CakePHP をインストールする他の方法があります。 Composer を使いたくない場合、
[インストール](installation) セクションをご覧ください。

CakePHP のダウンロードやインストール方法にかかわらず、いったんセットアップが完了すると、
ディレクトリー構成は次のようになります。 :

    /cms
      /bin
      /config
      /logs
      /plugins
      /src
      /tests
      /tmp
      /vendor
      /webroot
      .editorconfig
      .gitignore
      .htaccess
      .travis.yml
      composer.json
      index.php
      phpunit.xml.dist
      README.md

CakePHP のディレクトリー構造がどのように働くかを学ぶのにいい機会かもしれません。
[CakePHP のフォルダー構成](intro/cakephp-folder-structure) セクションをご覧ください。

このチュートリアルで迷ったら、 [GitHub](https://github.com/cakephp/cms-tutorial)
で完成した結果を見ることができます。

### インストールの確認

デフォルトホームページを確認することで、インストールが正しいことをざっと確かめることができます。
その前に、開発用サーバーを起動する必要があります。

``` bash
cd /path/to/our/app

bin/cake server
```

> [!NOTE]
> 　Windows では、このコマンドは `bin\cake server` (バックスラッシュ) です。

これで、 8765 ポートで PHP のビルトインウェブサーバーが起動します。ウェルカムページを見るために
**http://localhost:8765** をウェブブラウザーで開いてください。CakePHP がデータベース接続が
可能かどうか以外は、すべての確認事項が緑色のコック帽になるべきです。そうでなければ、PHP 拡張の
追加のインストールやディレクトリーのパーミッション設定が必要かもしれません。

次に、 [データベースの構築と最初のモデルの作成](tutorials-and-examples/cms/database)
をします。

## CMS チュートリアル - データベース作成

先ほどは CakePHP をインストールしましたので、 `CMS (Content Management System)`
アプリケーションのためのデータベースをセットアップしましょう。まだセットアップしていない場合、
例えば `cake_cms` のように、あなたの好きな名前で、このチュートリアルで使用する空のデータベースを
作成してください。必要なテーブルを作成するために、以下の SQL を実行することができます。

``` sql
USE cake_cms;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    body TEXT,
    published BOOLEAN DEFAULT FALSE,
    created DATETIME,
    modified DATETIME,
    UNIQUE KEY (slug),
    FOREIGN KEY user_key (user_id) REFERENCES users(id)
) CHARSET=utf8mb4;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(191),
    created DATETIME,
    modified DATETIME,
    UNIQUE KEY (title)
) CHARSET=utf8mb4;

CREATE TABLE articles_tags (
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
    FOREIGN KEY article_key(article_id) REFERENCES articles(id)
);

INSERT INTO users (email, password, created, modified)
VALUES
('cakephp@example.com', 'secret', NOW(), NOW());

INSERT INTO articles (user_id, title, slug, body, published, created, modified)
VALUES
(1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());
```

複合主キーを持つ `articles_tags` テーブルにお気づきでしょうか。CakePHP は、
ほぼどこでも複合主キーをサポートしているので、追加の `id` カラムを必要としない
単純なスキーマを持つことができます。

私たちが使用するテーブルやカラムの名前は恣意的ではありませんでした。CakePHP の
[命名規則](intro/conventions) を使用することによって、CakePHP がより効果的になり、
フレームワークの設定を避けられます。CakePHP は、ほぼ全てのデータベーススキーマに対応できるくらい
十分に柔軟ですが、CakePHP がデフォルトで提供する規約に従うことで、時間を節約できます。

### データベースの設定

次に、どこにデータベースあるか、そしてどうやってデータベースに接続するかを CakePHP
に伝えましょう。あなたのセットアップを適用するために **config/app_local.php**
ファイルの中の `Datasources.default` 配列の値を置き換えてください。
完全な設定配列の例は、以下のようになります。 :

``` php
<?php
return [
    // 上には他の設定があります
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'cakephp',
            'password' => 'AngelF00dC4k3~',
            'database' => 'cake_cms',
            'encoding' => 'utf8mb4',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ],
    ],
    // 下には他の設定があります
];
```

一度 **config/app_local.php** ファイルを保存して、 'CakePHP is able to connect to the database'
が緑色のコック帽であることを確認してください。

> [!NOTE]
> CakePHP のデフォルト設定ファイルの複製は **config/app.default.php** にあります。

### 最初のモデルの作成

モデルは、CakePHP アプリケーションの心臓部です。データを読んだり変更することができます。
それらは、データ間のリレーションの構築、データの検証、アプリケーションルールの適用をすることができます。
モデルは、コントローラーアクションとテンプレートを構築するために必要な基礎を構築します。

CakePHP のモデルは `Table` と `Entity` オブジェクトで構成されています。 `Table`
オブジェクトは、指定されたテーブルの中に保存されたエンティティーの集合へのアクセスを提供します。
それらは **src/Model/Table** の中に保存されます。私たちが今から作成するファイルは、
**src/Model/Table/ArticlesTable.php** に保存されます。完成したファイルは次のようになります。 :

``` php
<?php
// src/Model/Table/ArticlesTable.php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
    }
}
```

このテーブルの `created` や `modified` カラムを自動的に更新する
[Timestamp](orm/behaviors/timestamp) ビヘイビアーを追加しました。
Table オブジェクトを `ArticlesTable` と名付けることで、CakePHP は、命名規則により
`articles` テーブルを使用するモデルであると解釈します。また、CakePHP は、
`id` カラムがテーブルの主キーであると解釈する規約を使用します。

> [!NOTE]
> もし一致するファイルが **src/Model/Table** に見つけられなければ、CakePHP は動的に
> モデルオブジェクトを生成します。これはまた、不意に間違ったファイル名 (例えば、
> articlestable.php や ArticleTable.php) をつけると、CakePHP はどの設定も認識できず、
> 代わりに生成されたモデルを使うことになるということも意味します。

また、Articles のための Entity クラスも作成します。エンティティーは、
データベースの１つのレコードを表し、データに対して行レベルの振る舞いを提供します。
このエンティティーは、 **src/Model/Entity/Article.php** に保存されます。
完成したファイルは、次のようになります。 :

``` php
<?php
// src/Model/Entity/Article.php
namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected $_accessible = [
        '*' => true,
        'id' => false,
        'slug' => false,
    ];
}
```

エンティティーは、今はとてもスリムです。そして、 [Entities Mass Assignment](orm/entities#entities-mass-assignment) によって
どのようにプロパティーを変更できるかを制御するプロパティー `_accessible` をセットアップしました。

このモデルは、今は動きませんが、次は最初の
[コントローラーとテンプレート](tutorials-and-examples/cms/articles-controller)
を作成し、このモデルとのやりとりができるようにします。

## CMS チュートリアル - Articles コントローラーの作成

モデルが作成できたので、記事のコントローラーが必要です。CakePHP のコントローラーは、
レスポンスを準備するために、HTTP リクエストを処理し、モデルのメソッドに含まれるビジネスロジックを
実行します。この新しいコントローラーは **src/Controller** ディレクトリーの中で
**ArticlesController.php** と呼ばれるファイルに記述します。
基本的なコントローラーの外観は次の通りです。 :

``` php
<?php
// src/Controller/ArticlesController.php

namespace App\Controller;

class ArticlesController extends AppController
{
}
```

それでは、コントローラーにアクションを追加しましょう。アクションは、ルートに接続させる
コントローラーのメソッドです。例えば、ユーザーが **www.example.com/articles/index**
(**www.example.com/articles** と同じ) をリクエストした場合、CakePHP は、
`ArticlesController` の `index` メソッドを呼びます。このメソッドは、モデル層に問い合わせ、
ビューでテンプレートを描画してレスポンスの準備する必要があります。そのアクションのコードは、
次のようになります。 :

``` php
<?php
// src/Controller/ArticlesController.php

namespace App\Controller;

class ArticlesController extends AppController
{
    public function index()
    {
        $this->loadComponent('Paginator');
        $articles = $this->Paginator->paginate($this->Articles->find());
        $this->set(compact('articles'));
    }
}
```

`ArticlesController` の `index()` 関数を定義することで、ユーザーは、
**www.example.com/articles/index** をリクエストすることで、そこにあるロジックに
アクセスできるようになります。同様に、 `foobar()` という関数を定義した場合、
ユーザーはそのメソッドに **www.example.com/articles/foobar** で、アクセスできます。
特定の URL を取得できるように、コントローラーとアクションの名前を付けたいという
誘惑に駆られるかもしれません。その誘惑に抗ってください。代わりに、 [CakePHP の規約](intro/conventions)
にしたがって、読みやすく意味のあるアクション名を作成してください。そうすれば
[ルーティング](development/routing) を使って、あなたが望む URL を、
あなたが作成したアクションに接続することができます。

このコントローラーのアクションはとてもシンプルです。
これは、命名規則によって自動的にロードされる Articles モデルを使用して、
データベースからページ分けされた記事を取得します。次に (これからすぐに作成する)
テンプレートの中に記事を渡すために `set()` を使用します。CakePHP は、
コントローラーのアクションが完了した後、自動的にテンプレートを描画します。

### 記事一覧のテンプレート作成

モデルからデータを取得し、ビューのコンテキストを準備するコントローラーを持っていますので、
index アクションのビューテンプレートを作成しましょう。

CakePHP のビューテンプレートは、アプリケーションのレイアウト内に挿入される表示用の PHP コードです。
ここで HTML が作成されますが、 View は JSON、CSV、または PDF などのバイナリファイルの生成もできます。

レイアウトは、ビューを囲む表示用のコードです。レイアウトファイルは、
ヘッダー・フッター・ナビゲーション要素のような一般的なサイトの要素が含まれます。
アプリケーションは、複数のレイアウトを持つことができ、それらを切り替えることができますが、
今回はデフォルトのレイアウトを使用しましょう。

CakePHP のテンプレートファイルは、 **src/Template** の中で
対応するコントローラーの名前をつけたフォルダーの中に保存されます。
今回の場合、 'Articles' という名前のフォルダーを作成する必要があります。
あなたのアプリケーションに以下のコードを追加してください。

``` php
<!-- File: src/Template/Articles/index.ctp -->

<h1>記事一覧</h1>
<table>
    <tr>
        <th>タイトル</th>
        <th>作成日時</th>
    </tr>

    <!-- ここで、$articles クエリーオブジェクトを繰り返して、記事の情報を出力します -->

    <?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
```

前のセクションでは、 `set()` を使って 'articles' 変数をビューに割り当てました。
ビューに渡された変数は、上記のコードの中で使用したローカル変数として、
ビューテンプレートの中で利用できます。

`$this->Html` というオブジェクトを使っていることにお気づきでしょうか。
これは、 CakePHP の [HtmlHelper](views/helpers/html) のインスタンスです。
CakePHP には、リンク、フォーム、ページ制御ボタンの作成などのタスクを簡単に行うための
一連のビューヘルパーが付属しています。 [ヘルパー](views/helpers) について、
その章で詳しく学べますが、ここで重要なことは、 `link()` メソッドは、
与えられたリンクテキスト(第１パラメーター) と URL (第２パラメーター) を元に
HTML リンクを生成することです。

CakePHP で URL を指定する際、配列や [名前付きルート](development/routing#named-routes) が
推奨されます。これらの構文で、CakePHP が提供するリバースルーティング機能を
活用することができます。

この時点で、ブラウザーで **http://localhost:8765/articles/index** を
見ることができるはずです。記事のタイトルとテーブルのリストで正しくフォーマットされた
リストビューが表示されます。

### view アクションの作成

記事一覧の 'view' リンクの一つをクリックした際、アクションが実装されてないという
エラーページが表示されるはずです。今から、それを修正しましょう。 :

``` php
// 既存の src/Controller/ArticlesController.php ファイルに追加

public function view($slug = null)
{
    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    $this->set(compact('article'));
}
```

これはシンプルなアクションですが、いくつかの強力な CakePHP 機能を使用しています。
[動的なファインダー](orm/retrieving-data-and-resultsets#dynamic-finders) である `findBySlug()` を使用することにより
アクションを開始します。このメソッドは、与えられたスラグによって記事を検索する基本的なクエリーを
作成することができます。その時、最初のレコードを取得するか `NotFoundException` を投げるか
のいずれかをする `firstOrFail()` を使います。

このアクションは `$slug` パラメーターを持ちますが、そのパラメーターはどこから来るのでしょう？
ユーザーが `/articles/view/first-post` をリクエストした際、 値 'first-post' が
CakePHP のルーティングとディスパッチレイヤーで `$slug` に渡されます。
新しいアクションを保存してブラウザーをリロードすると、別の CakePHP エラーページが表示され、
view テンプレートが見つからないことがわかります。それを修正しましょう。

### view テンプレートの作成

新しい 'view' アクションのビューを作成し、 **src/Template/Articles/view.ctp**
に置きましょう。

``` php
<!-- File: src/Template/Articles/view.ctp -->

<h1><?= h($article->title) ?></h1>
<p><?= h($article->body) ?></p>
<p><small>作成日時: <?= $article->created->format(DATE_RFC850) ?></small></p>
<p><?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?></p>
```

`/articles/index` のリンクを使うことによって、動作することを確認できますし、
`/articles/view/slug-name` のような URL にアクセスすることによって手動で記事を
リクエストすることを確認できます。

### 記事の追加

基本的な読み込みビューを作成できたので、新しい記事を作成できるようにする必要があります。
まず、 `ArticlesController` に `add()` アクションを作成してください。
コントローラーは次のようになります。 :

``` php
// src/Controller/ArticlesController.php

namespace App\Controller;

use App\Controller\AppController;

class ArticlesController extends AppController
{

    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('Paginator');
        $this->loadComponent('Flash'); // FlashComponent をインクルード
    }

    public function index()
    {
        $articles = $this->Paginator->paginate($this->Articles->find());
        $this->set(compact('articles'));
    }

    public function view($slug)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // user_id の決め打ちは一時的なもので、あとで認証を構築する際に削除されます。
            $article->user_id = 1;

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }
}
```

> [!NOTE]
> [フラッシュ](controllers/components/flash) コンポーネントを、使用するコントローラーに含める
> 必要があります。また、 `AppController` に含めてもよいでしょう。

こちらがこの `add()` アクションの行うことです。

- リクエストの HTTP メソッドが POST だった場合、Articles モデルを使用してデータを保存しようとします。
- なんらかの理由で保存しなかった場合、ただビューを描画します。これは、ユーザーバリデーションエラーや
  その他の警告を表示する機会を与えてくれます。

全ての CakePHP のリクエストは、 `$this->request` を使用してアクセス可能なリクエストオブジェクトを
含みます。リクエストオブジェクトは、今受信したリクエストに関する情報を含みます。リクエストが HTTP POST
リクエストであることを確認するために `Cake\Http\ServerRequest::is()` メソッドを
使用します。

POST データは、 `$this->request->getData()` で利用可能です。それがどのような内容かを
知りたい場合に `pr()` 関数や `debug()` 関数を使って出力することができます。
データを保存するために、まず POST データを Article エンティティーに 「変換 (marshal)」します。
エンティティーは、以前作成した ArticlesTable を使用して永続化されます。

新しい記事を保存した後、セッションにメッセージをセットするために FlashComponent の
`success()` メソッドを使用します。 `success` メソッドは PHP の
[マジックメソッド機能](https://php.net/manual/ja/language.oop5.overloading.php#object.call)
を使用して提供されます。フラッシュメッセージは、リダイレクトした後の次のページ上で表示されます。
レイアウトの中に、フラッシュメッセージを表示し、対応するセッション変数をクリアする
`<?= $this->Flash->render() ?>` があります。最後に、保存が完了した後、
`Cake\Controller\Controller::redirect` を使ってユーザーを記事一覧に戻します。
パラメーター `['action' => 'index']` は、例えば `ArticlesController` の index
アクションの場合、 URL `/articles` に変換します。 [API](https://api.cakephp.org) の
`Cake\Routing\Router::url()` 関数を参照すると、様々な CakePHP 関数の URL を
指定できる書式を見ることができます。

### add テンプレートの作成

こちらが add ビューテンプレートです。

``` php
<!-- File: src/Template/Articles/add.ctp -->

<h1>記事の追加</h1>
<?php
    echo $this->Form->create($article);
    // 今はユーザーを直接記述
    echo $this->Form->control('user_id', ['type' => 'hidden', 'value' => 1]);
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
?>
```

FormHelper を使うと、 HTML フォームの開始タグを生成できます。
こちらが `$this->Form->create()` が生成する HTML です。

``` html
<form method="post" action="/articles/add">
```

URL オプションなしで `create()` を呼び出したので、 `FormHelper` は、フォームを
現在のアクションに戻したいと仮定します。

`$this->Form->control()` メソッドは、同じ名前のフォーム要素を作成するために使われます。
１番目のパラメーターは、どのフィールドに対応するかを CakePHP に伝えます。そして、２番目の
パラメーターは、さまざまなオプションを指定できます。上記の場合、テキストエリアの行数などです。
ここではちょっとした内部情報の確認 (introspection) と規約の使用があります。
`control()` は、指定されたモデルフィールドにもとづいて異なるフォーム要素を出力し、
語形変化 (inflection) を使ってラベルを生成します。オプションを使用して、
フォームコントロールのラベル、入力、または、その他の要素をカスタマイズすることができます。
`$this->Form->end()` の呼び出しでフォームを閉じます。

さて、 **src/Template/Articles/index.ctp** ビューを更新して、新しい
「記事の追加」リンクを追加しましょう。 `<table>` の前に以下の行を追加してください。 :

``` php
<?= $this->Html->link('記事の追加', ['action' => 'add']) ?>
```

### シンプルなスラグ生成の追加

記事を今保存すると、スラグ属性は、作成されておらず、カラムは `NOT NULL` なので保存に失敗します。
スラグの値は、通常、URL セーフなバージョンの記事タイトルです。スラグを作成するために ORM の
[beforeSave() コールバック](orm/table-objects#table-callbacks) が使用できます。 :

``` php
// src/Model/Table/ArticlesTable.php の中で
namespace App\Model\Table;

use Cake\ORM\Table;
// Text クラス
use Cake\Utility\Text;

// 次のメソッドを追加してください。

public function beforeSave($event, $entity, $options)
{
    if ($entity->isNew() && !$entity->slug) {
        $sluggedTitle = Text::slug($entity->title);
        // スラグをスキーマで定義されている最大長に調整
        $entity->slug = substr($sluggedTitle, 0, 191);
    }
}
```

このコードはシンプルで、重複したスラグを考慮していません。しかし、後でそれを修正します。

### edit アクションの追加

今のアプリケーションは、記事を保存できますが編集はできません。今から修正しましょう。
`ArticlesController` に次のアクションを追加してください。 :

``` php
// src/Controller/ArticlesController.php の中で

// 次のメソッドを追加してください。

public function edit($slug)
{
    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    if ($this->request->is(['post', 'put'])) {
        $this->Articles->patchEntity($article, $this->request->getData());
        if ($this->Articles->save($article)) {
            $this->Flash->success(__('Your article has been updated.'));
            return $this->redirect(['action' => 'index']);
        }
        $this->Flash->error(__('Unable to update your article.'));
    }

    $this->set('article', $article);
}
```

このアクションは、まずユーザーが既存のレコードにアクセスすることを確保します。
`$slug` パラメーターの中に渡されなかったり、記事が存在しなかった場合、
`NotFoundException` が投げられ、 CakePHP の ErrorHandler が、適切なエラーページを
描画します。

次に、このアクションはリクエストが POST または PUT いずれかのリクエストかどうかをチェックします。
そうであれば、POST/PUT データを元に、 `patchEntity()` メソッドを使って
article エンティティーを更新します。最後に、 `save()` を呼び出して、
適切なフラッシュメッセージを設定し、リダイレクトするか検証エラーを表示します。

### edit テンプレートの作成

edit テンプレートは次のようになります。

``` php
<!-- File: src/Template/Articles/edit.ctp -->

<h1>記事の編集</h1>
<?php
    echo $this->Form->create($article);
    echo $this->Form->control('user_id', ['type' => 'hidden']);
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
?>
```

このテンプレートは、編集フォーム（値が入力された状態）に加えて、
必要な検証エラーメッセージを出力します。

特定の記事を編集するためのリンクで index ビューを更新できるようになりました。

``` php
<!-- File: src/Template/Articles/index.ctp  (編集リンク付き) -->

<h1>記事一覧</h1>
<p><?= $this->Html->link("記事の追加", ['action' => 'add']) ?></p>
<table>
    <tr>
        <th>タイトル</th>
        <th>作成日時</th>
        <th>操作</th>
    </tr>

<!-- ここで、$articles クエリーオブジェクトを繰り返して、記事情報を出力します -->

<?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
        <td>
            <?= $this->Html->link('編集', ['action' => 'edit', $article->slug]) ?>
        </td>
    </tr>
<?php endforeach; ?>

</table>
```

### Articles の検証ルールの更新

この時点まで、記事は入力検証が行われていませんでした。
[バリデーター](orm/validation#validating-request-data) を使って修正しましょう。 :

``` php
// src/Model/Table/ArticlesTable.php

// この use 文を名前空間宣言のすぐ下に追加して、
// Validator クラスをインポートします。
use Cake\Validation\Validator;

// 次のメソッドを追加してください。
public function validationDefault(Validator $validator)
{
    $validator
        ->allowEmptyString('title', false)
        ->minLength('title', 10)
        ->maxLength('title', 255)

        ->allowEmptyString('body', false)
        ->minLength('body', 10);

    return $validator;
}
```

`validationDefault()` メソッドは、 `save()` メソッドが呼ばれる際のデータの検証方法を
CakePHP に伝えます。ここでは、title フィールドと body フィールドの両方が空であってはならず、
長さに制約があることを指定しました。

CakePHP の検証エンジンは強力で柔軟性があります。メールアドレス、IP アドレスなどのようにタスクに
頻繁に使用されるルール一式を提供し、独自の検証ルールを追加する柔軟性を提供します。
その設定の詳細については、 [バリデーション](core-libraries/validation) のドキュメントを確認してください。

さて、検証ルールが整いましたので、
それがどのように動くかを見るためにアプリを使って空のタイトルや本文で記事を追加してみてください。
FormHelper の `Cake\View\Helper\FormHelper::control()` メソッドを使用して、
フォーム要素を作成しているので、検証エラーメッセージが自動的に表示されます。

### delete アクションの追加

次に、ユーザーが記事を削除する方法を作ってみましょう。
`ArticlesController` の中の `delete()` アクションから始めましょう。 :

``` php
// src/Controller/ArticlesController.php

public function delete($slug)
{
    $this->request->allowMethod(['post', 'delete']);

    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    if ($this->Articles->delete($article)) {
        $this->Flash->success(__('The {0} article has been deleted.', $article->title));
        return $this->redirect(['action' => 'index']);
    }
}
```

このロジックは `$slug` で指定された記事を削除し、 `$this->Flash->success()` を使って
`/articles` にリダイレクトした後に確認メッセージを表示します。
ユーザーが GET リクエストを使って記事を削除しようとすると、 `allowMethod()` は例外をスローします。
キャッチされない例外は CakePHP の例外ハンドラによって捕捉され、素晴らしいエラーページが表示されます。
アプリケーションで生成する必要のあるさまざまな HTTP エラーを示すために使用できる組み込みの
[例外](development/errors) が多数あります。

> [!WARNING]
> ウェブクローラーが誤ってすべてのコンテンツを削除する可能性があるため、
> GET リクエストを使用してコンテンツを削除することは *とても* 危険です。
> それでコントローラーの中で `allowMethod()` を使ったのです。

私たちはロジックを実行して、別のアクションにリダイレクトしているだけなので、
このアクションにはテンプレートはありません。ユーザーが記事を削除できるリンク付きに
index テンプレートを更新するといいでしょう。

``` php
<!-- File: src/Template/Articles/index.ctp  (削除リンク付き) -->

<h1>記事一覧</h1>
<p><?= $this->Html->link("記事の追加", ['action' => 'add']) ?></p>
<table>
    <tr>
        <th>タイトル</th>
        <th>作成日時</th>
        <th>操作</th>
    </tr>

<!-- ここで、$articles クエリーオブジェクトを繰り返して、記事情報を出力します -->

<?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
        <td>
            <?= $this->Html->link('編集', ['action' => 'edit', $article->slug]) ?>
            <?= $this->Form->postLink(
                '削除',
                ['action' => 'delete', $article->slug],
                ['confirm' => 'よろしいですか?'])
            ?>
        </td>
    </tr>
<?php endforeach; ?>

</table>
```

`Cake\View\Helper\FormHelper::postLink()` を使用すると、
JavaScript を使用して記事を削除する POST リクエストを行うリンクが作成されます。

> [!NOTE]
> また、このビューコードは `FormHelper` を使って記事を削除しようとする前に
> JavaScript の確認ダイアログを表示します。

基本的な記事管理のセットアップの後は、 [タグとユーザーテーブルの基本的な操作](tutorials-and-examples/cms/tags-and-users)
を作成します。
