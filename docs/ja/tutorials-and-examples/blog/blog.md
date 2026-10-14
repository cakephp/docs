# ブログチュートリアル

CakePHP をさっそく使ってみましょう。このチュートリアルを読んでいるのは、
CakePHP の動作に関してさらに学びたいと思っているからだと思います。
私たちは、生産性を高め、コーディングがさらに楽しいものになることを目指しています。
コードを調べているうちに、きっとあなたもそのことに気が付くでしょう。

このチュートリアルでは、シンプルなブログアプリケーションを作成します。CakePHP を取得して
インストールし、データベースの設定を行い、ブログの投稿記事の一覧表示 (*list*)、追加 (*add*)、
編集 (*edit*)、削除 (*delete*) などのアプリケーションロジックを作成します。

必要なもの:

1.  PHP 8.0 以上と [Composer](https://getcomposer.org/)。
2.  ウェブサーバ。このチュートリアルでは、CakePHP のコンソールから起動する PHP の
    ビルトインウェブサーバで十分です。Apache などのサーバを使う場合は、ドキュメントルートを
    アプリケーションの `webroot/` ディレクトリに設定してください。
3.  データベースサーバ。このチュートリアルで MySQL を使用します。
    データベースを作成できる程度の SQL の知識が必要です。その先は CakePHP が面倒を
    みてくれます。MySQL を使用するので、PHP で `pdo_mysql` が有効になっていることを
    確認してください。
4.  PHP の基本的な知識。オブジェクト指向プログラミングに慣れていれば非常に有利ですが、
    手続き型に慣れているという人でも心配する必要はありません。
5.  最後に、MVC プログラミングに関する基本的な知識が必要です。概要については、
    [MVC(\*Model-View-Controller\*)を理解する](/ja/cakephp-overview/understanding-model-view-controller) を見てください。
    半ページぐらいの説明ですので、心配はご無用です。

それでは、はじめましょう！

## CakePHP の取得

まずは、Composer で新しいアプリケーションを作成しましょう。
[pieceofcake2/app](https://pieceofcake2.github.io/app/) アプリケーションスケルトンが
CakePHP もインストールしてくれます。

``` bash
composer create-project pieceofcake2/app blog
cd blog
```

完了すると、ディレクトリは次のようになります:

    /blog
        /bin
        /config
        /logs
        /plugins
        /resources
        /src
        /templates
        /tests
        /tmp
        /vendor
        /webroot
        composer.json

CakePHP 本体は `vendor/pieceofcake2/cakephp` にインストールされます。PHP のクラスは
`src/` に、ビューテンプレートは `templates/` に、設定は `config/` に書きます。
CakePHP のディレクトリ構造について少し学んでおきましょう:
[CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure) のセクションをチェックしてください。

### Tmp ディレクトリのパーミッション

次に、 `tmp` と `logs` ディレクトリをウェブサーバから書き込めるように設定します。
このチュートリアルのようにビルトインウェブサーバを使う場合は、サーバは自分のユーザーで
動作するので、何もする必要はありません。他のウェブサーバを使う場合は、ウェブサーバを
動作させているユーザーを調べ、そのユーザーにディレクトリの所有権を変更します。
実行するコマンドは (\*nixで) このようになります:

``` bash
$ chown -R www-data tmp logs
```

何らかの理由で CakePHP がそのディレクトリに書き込めない場合は、キャッシュデータが
書き込めないという警告や例外が表示されます。

## ブログデータベースの作成

次に、ブログで使用する基礎的なデータベースをセットアップしましょう。データベースを
まだ作成していないのであれば、このチュートリアル用に好きな名前で空のデータベースを
作成しておいてください。このページでは、投稿記事を保存するためのテーブルをひとつ作成します。
次の SQL をデータベースで実行してください。

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
[CakePHP の規約](/ja/getting-started/cakephp-conventions) の中で説明されています）たくさんの機能を
自由に使うことができ、設定作業をする必要がなくなります。CakePHP はフレキシブルなので、
最悪な従来型のデータベーススキーマにも対応することができますが、規約に従えば、
時間を節約することができます。

詳細は、 [CakePHP の規約](/ja/getting-started/cakephp-conventions) を参照してください。簡単に言うと、
'posts' というテーブル名にしておけば、自動的に Post モデルが呼び出され、'modified' と
'created' というフィールドがあると、自動的にCakePHP が管理するようになります。

## CakePHP のデータベース設定

どんどん進みましょう。データベースがどこにあって、どうやって接続するかを CakePHP に教えます。
多くの人にとって、設定 (*configure*) をする最初で最後の機会です。

CakePHP のデータベース設定ファイルの元は、 `config/database.php.default` の中に
あります。同一ディレクトリ上にこのファイルのコピーを作り、 `database.php`
という名前にしてください。

``` bash
cp config/database.php.default config/database.php
```

この設定ファイルの中身は一目瞭然です。 `$default` 配列の値を自分のセットアップに合わせて
変更するだけです。完全な設定の配列の例は次のようなものになるでしょう:

``` php
// config/database.php
public $default = [
    'datasource' => 'Database/Mysql',
    'persistent' => false,
    'host' => 'localhost',
    'login' => 'cakeBlog',
    'password' => 'c4k3-rUl3Z',
    'database' => 'cake_blog_tutorial',
    'prefix' => '',
    'encoding' => 'utf8mb4',
];
```

`utf8mb4` は MySQL で UTF-8 を完全に扱える文字セットで、MySQL 8.0 のデフォルトの文字セットです。

新しくできた `database.php` ファイルを保存したら、プロジェクトルートで開発用サーバを起動します。

``` bash
bin/cake server
```

ブラウザで <http://localhost:8765/> を開いて、CakePHP の welcome ページを見てください。
データベース接続のファイルがあり、そしてデータベースに接続できる、というメッセージが
表示されるはずです。

> [!NOTE]
> PDO と pdo_mysql が php.ini で有効になっている必要があることを覚えておいてください。

## 追加の設定

設定できる項目があといくつかあります。ひとつは、セキュリティハッシュ用の
カスタム文字列(「salt」ともいう)です。二つ目は、カスタム番号 (「seed」ともいう) を暗号化用に
定義するということです。アプリケーションスケルトンには誰でも知っている例の値が入っているので、
デバッグモードが有効な間は、これらを変更するまで CakePHP がすべてのページで通知を表示します。

セキュリティ用の salt は、ハッシュの生成に用いられます。 `config/core.php` を
編集し、デフォルトの `Security.salt` の値を変更してください。
この値は、ランダムで長い文字列にします。そうすることで推測がより困難になります。

``` php
/**
 * A random string used in security hashing methods.
 */
Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
```

サイファシード(*cipher seed*) は暗号化・復号化のための文字列です。
`config/core.php` を編集して `Security.cipherSeed` をデフォルト値から
変更してください。この値は、大きくてランダムな整数でなければなりません:

``` php
/**
 * A random numeric string (digits only) used to encrypt/decrypt strings.
 */
Configure::write('Security.cipherSeed', '7485712659625147843639846751');
```

## Apache を使う場合

ビルトインウェブサーバは開発専用です。Apache でアプリケーションを動かす場合は、
バーチャルホストの `DocumentRoot` を `webroot/` ディレクトリに設定し、 `mod_rewrite` が
有効になっていることを確認してください。リライトルールは `webroot/.htaccess` にあります。
CakePHP の welcome ページが少しおかしい (画像が表示されない、CSS が効いていない) 場合は、
おそらくシステム上の mod_rewrite が機能していません。詳細や他のウェブサーバについては
[URLリライティング](/ja/installation/url-rewriting) を参照してください。

はじめての CakePHP アプリケーションを構築しはじめるには、続けて
[ブログチュートリアル - レイヤーの追加](/ja/tutorials-and-examples/blog/part-two)
を見てください。
