# ACLを制御するシンプルなアプリケーション

> [!NOTE]
> このチュートリアルは初心者向けではありません。もし CakePHP を始めたばかりなら、
> このチュートリアルに挑戦する前にまずはフレームワークの機能をひととおり体験しておくことを
> おすすめします。

このチュートリアルでは [認証](../../core-libraries/components/authentication) と
[アクセス制御リスト](../../core-libraries/components/access-control-lists) を用いたシンプルな
アプリケーションを作成します。このチュートリアルにはいくつかの前提があります。
CakePHP のある程度の経験と、MVCの概念についての理解、
[ブログチュートリアル](../../tutorials-and-examples/blog/blog) を既に読み終わっていて、
[Bakeでコード生成](../../console-and-shells/code-generation-with-bake) についてよく知っていることを
必要とします。このチュートリアルは `AuthComponent` と
`AclComponent` の簡単な紹介になります。

必要なもの

1.  PHP 8.0 以上と [Composer](https://getcomposer.org/)。
2.  ウェブサーバー。このチュートリアルでは、 `bin/cake server` で起動する PHP の
    ビルトインウェブサーバーで十分です。
3.  データベースサーバー。このチュートリアルでは MySQL を利用します。
    CakePHP におけるアプリケーションの作成は、まずデータベースを作成することからはじめますので、
    これに必要な SQL の知識を必要とします。
4.  基本的な PHP の知識。オブジェクト指向のプログラミングについて知っていると
    より良いでしょう。しかし手続き型言語としての知識しかなくても問題はありません。

## アプリケーションの準備

まず、Composer で新しいアプリケーションを作成しましょう。 :

``` bash
composer create-project pieceofcake2/app acl
cd acl
```

[ブログチュートリアル](../../tutorials-and-examples/blog/blog) で説明したように、
`config/database.php.default` を `config/database.php` にコピーしてデータベース接続を設定し、
`config/core.php` の `Security.salt` と `Security.cipherSeed` の値を変更してください。

スケルトンには、開発用の依存パッケージとして [Bake プラグイン](../../console-and-shells/code-generation-with-bake)
がすでに含まれていて、 `plugins/Bake/` にインストールされています (スケルトンの `composer.json` には
そのための `installer-paths` の設定があります)。 `config/bootstrap.php` でロードしてください。 :

``` php
// config/bootstrap.php
CakePlugin::load('Bake');
```

それから、アプリケーションを構築するための簡単なデータベーススキーマを作成しましょう。
次の SQL 文をデータベースに実行してください:

``` sql
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    group_id INT NOT NULL,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE `groups` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE widgets (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    part_no VARCHAR(12),
    quantity INT
);
```

MySQL 8.0 では `GROUPS` が予約語なので、自分で書く SQL ではテーブル名をバッククォートで
囲む必要があります。CakePHP は生成するクエリの中でテーブル名とカラム名をクォートするので、
`Group` モデルはそのままで動作します。

これらのテーブルはアプリケーションの残りを作成する時に使用します。
データベースにこのテーブルを作成したら、クッキングを開始しましょう。
モデルとコントローラ、そしてビューのコードを、
[Bakeでコード生成](../../console-and-shells/code-generation-with-bake) を使って簡単に作成して下さい。

bake を使うにあたって、 `bin/cake bake all` を呼び出すと、先ほど MySQL に作成した
4つのテーブルがリストされます。「1 (Group).」を選び、プロンプトに従って下さい。
その他の3つのテーブルでも同じ手順を繰り返すと、合計4つのコントローラ、モデルそしてビューが
作成されます。Bake はビューテンプレートを `templates/<Controller>/` に書き出します
(pieceofcake2/bake 1.0.3 以降が必要です。[Bakeでコード生成](../../console-and-shells/code-generation-with-bake) を参照)。

ここでスキャフォールド (*Scaffold*) は使わないでください。スキャフォールドの仕組みを
用いたコントローラを bake すると、ACO の生成に深刻な影響が生じます。

モデルを bake する時、cake は自動的にモデル間のつながり(あるいはテーブル間の関連)を検知します。
cake に正しい hasMany や belongsTo のつながりを教えてください。hasOne と hasMany の両方を
選べるようプロンプトに表示された場合、このチュートリアルではとりあえず hasMany (だけ)を
選んでおけば問題ありません。

admin routing のことは今は忘れてください。認証とアクセス制御リストはそれだけでとても
複雑なことなので、admin routing についてひとまず置いておきます。
bake で作成したコントローラには Acl や Auth コンポーネントを追加 **しない**
よう注意してください。これは後ほど行います。
これで、テーブル「users」「groups」「posts」「widgets」に対するモデル、
コントローラおよびビューができました。

## Auth を追加する準備

この段階で、動作する CRUD アプリケーションが出来上がりました。
bake は必要なリレーションを全て行っているでしょうが、もしまだならそれを済ませてください。
Auth と Acl コンポーネントを追加する前に、多少の部品を加える必要があります。
まずは `UsersController` にログインとログアウトのアクションを加えましょう:

``` php
public function login()
{
    if ($this->request->is('post')) {
        if ($this->Auth->login()) {
            return $this->redirect($this->Auth->redirectUrl());
        }
        $this->Flash->error(__('Your username or password was incorrect.'));
    }
}

public function logout()
{
    //ここは、今は空にしておいてください
}
```

更に、以下の様にビューファイルを
`templates/Users/login.ctp` に作成してください:

``` php
<?php
// templates/Users/login.ctp
echo $this->Form->create('User', ['url' => ['action' => 'login']]);
echo $this->Form->inputs([
    'legend' => __('Login'),
    'username',
    'password'
]);
echo $this->Form->end('Login');
?>
```

次に、パスワードをデータベースに入る前にハッシュ化するように User モデルを書き換える
必要があります。平文のパスワードを保存するのは極めて危険であり、また AuthComponent は
パスワードがハッシュ化されていることを期待します。ここでは、bcrypt でパスワードをハッシュ化する
`BlowfishPasswordHasher` を使います。 `src/Model/User.php` で以下を追加してください:

``` php
// src/Model/User.php
class User extends AppModel
{
    // 他のコード。

    public function beforeSave($options = [])
    {
        if (!empty($this->data['User']['password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data['User']['password'] = $passwordHasher->hash(
                $this->data['User']['password']
            );
        }
        return true;
    }
}
```

次に行うことは、 `AppController` に変更を加えることです。
`src/Controller/AppController.php` が存在しない場合は、作成してください。
コントローラ全体に認証と ACL を行うなら、この `AppController` に対してセットアップを
行います。bake したコントローラはメッセージの表示に FlashComponent を使うので、
ここでロードしておきます。次のコードを加えてください:

``` php
// src/Controller/AppController.php
class AppController extends Controller
{
    public $components = [
        'Acl',
        'Auth' => [
            'authenticate' => [
                'Form' => ['passwordHasher' => 'Blowfish'],
            ],
            'authorize' => [
                'Actions' => ['actionPath' => 'controllers'],
            ],
        ],
        'Session',
        'Flash',
    ];
    public $helpers = ['Html', 'Form', 'Flash'];

    public function beforeFilter()
    {
        // AuthComponent の設定
        $this->Auth->loginAction = [
          'controller' => 'users',
          'action' => 'login'
        ];
        $this->Auth->logoutRedirect = [
          'controller' => 'users',
          'action' => 'login'
        ];
        $this->Auth->loginRedirect = [
          'controller' => 'posts',
          'action' => 'add'
        ];
    }
}
```

ACL をセットアップし終わってしまう前に、ユーザとグループを作成しましょう。
この状態ではまだログインしていないため、 `AuthComponent` の働きにより、
どのアクションにもアクセスできません。そこで、グループとユーザを作成することを
`AuthComponent` に許可させるために、いくつかの例外を設けましょう。
`GroupsController` と `UsersController` の **両方** に、次のコードを追加してください:

``` php
public function beforeFilter()
{
    parent::beforeFilter();
    $this->Auth->allow();
}
```

この記述は AuthComponent に、全てのアクションに対するパブリックなアクセスを許可するよう
指定するものです。これは一時的なものであり、データベースにいくつかのユーザとグループを
作成したら除去します。ユーザとグループはまだ追加しないでください。

## ACL のデータベーステーブルの初期化

ユーザとグループを作成する前に、これらをACLに接続します。しかし、この段階では ACL に関する
テーブルが存在しないため、どのページを開いてもテーブルが見つからないというエラー(
「Error: Database table acos for model Aco was not found.」)が表示されます。
このエラーを解消するには、スキーマファイルを実行します。シェルで次のコマンドを実行してください:

    bin/cake schema create DbAcl

テーブルのドロップと作成についてプロンプトが表示されます。
テーブルの破棄および作成を行うには、「yes」を入力してください。
スキーマファイルはアプリケーションの `config/Schema/db_acl.php` です。

コンソールの使用に問題が生じた場合は、代わりに `config/Schema/db_acl.sql` の
SQL ファイルを実行してください。

ここまでで、データの投入を行うコントローラの用意と ACL テーブルの初期化を行いました。
しかしまだ準備は終わっていません。ユーザとグループのモデルに対して、もう少しやることがあります。
これらのモデルに ACL に関わるからくりを追加していきましょう。

## リクエスタとして振舞う

Auth と ACL をきちんと動作させるには、ユーザとグループを ACL テーブルの列に関連付ける
必要があります。これを行うには、 `AclBehavior` を使用します。
`AclBehavior` を使うと、モデルと ACL テーブルを自動的に結びつけることができます。
これを使用するにあたり、モデル中で `parentNode()` を実行する必要があります。
`User` モデルに次のコードを追加してください:

``` php
class User extends AppModel
{
    public $belongsTo = ['Group'];
    public $actsAs = ['Acl' => ['type' => 'requester']];

    public function parentNode()
    {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        if (isset($this->data['User']['group_id'])) {
            $groupId = $this->data['User']['group_id'];
        } else {
            $groupId = $this->field('group_id');
        }
        if (!$groupId) {
            return null;
        } else {
            return ['Group' => ['id' => $groupId]];
        }
    }
}
```

`Group` モデルには、次のコードを追加します:

``` php
class Group extends AppModel
{
    public $actsAs = ['Acl' => ['type' => 'requester']];

    public function parentNode()
    {
        return null;
    }
}
```

このコードは、 `Group` モデルと `User` モデルを ACL に結びつけ、
`User` や `Group` をデータベースに登録した時、常に CakePHP が
`aros` にも同様の登録を行うようにしています。これにより、
`users` および `groups` テーブルを ARO と透過的に結びつける
ACL の管理機能を、アプリケーションの一部として作成できました。
ユーザーやグループを作成したり削除すると、常に ARO のテーブルも更新されます。

コントローラとモデルは初期のデータを追加する用意ができ、 `Group` と `User`
モデルは ACL テーブルに結び付けられました。
では <http://localhost:8765/groups/add> と <http://localhost:8765/users/add>
を開き、bake で焼いたフォームを使ってグループとユーザを追加しましょう。
次のグループを作成します。

- administrators
- managers
- users

各グループにユーザを作成することもできるので、後でテストするために各々の異なる
アクセスグループにユーザを作成します。忘れてしまわないよう、パスワードは書きとめておくか、
簡単なものを使うようにしてください。MySQL のプロンプトで
`SELECT * FROM aros;` を実行した場合、次のような結果を取得できるでしょう:

``` text
+----+-----------+-------+-------------+-------+------+------+
| id | parent_id | model | foreign_key | alias | lft  | rght |
+----+-----------+-------+-------------+-------+------+------+
|  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
|  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
|  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
|  4 |         1 | User  |           1 | NULL  |    2 |    3 |
|  5 |         2 | User  |           2 | NULL  |    6 |    7 |
|  6 |         3 | User  |           3 | NULL  |   10 |   11 |
+----+-----------+-------+-------------+-------+------+------+
6 rows in set (0.00 sec)
```

3つのグループと3人のユーザが存在することがわかります。ユーザは各グループにネストされており、
これはグループ単位もしくはユーザ単位でパーミッションを設定できることを意味します。

### グループだけの ACL

グループごとのみのパーミッションに単純化したい場合、 `User` モデルに `bindNode()`
を実装する必要があります:

``` php
public function bindNode($user)
{
    return ['model' => 'Group', 'foreign_key' => $user['User']['group_id']];
}
```

`User` モデルの `actsAs` を更新して、 requester ディレクティブを無効化します:

``` php
public $actsAs = ['Acl' => ['type' => 'requester', 'enabled' => false]];
```

これら２つの変更は、ACL に `User` の ARO のチェックを省き、 `Group` の ARO のみを
チェックするように伝えます。これは、afterSave が呼ばれることを避けます。

注意: これを動作させるために、全てのユーザーに `group_id` を割り当てる必要があります。

この場合、 `aros` テーブルは以下のようになるでしょう:

``` text
+----+-----------+-------+-------------+-------+------+------+
| id | parent_id | model | foreign_key | alias | lft  | rght |
+----+-----------+-------+-------------+-------+------+------+
|  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
|  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
|  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
+----+-----------+-------+-------------+-------+------+------+
3 rows in set (0.00 sec)
```

注意: もしこのポイントまでチュートリアルに追随しているなら、 `aros`, `groups`, `users`
を含むテーブルを削除する必要があり、 `aros` テーブルを上記のように取得するために、
再び groups と users を最初から作成してください。

## ACO(*Access Control Objects*)の作成

ユーザとグループ (*ARO*) を作成しましたので、ログインとログアウトができるよう、
コントローラを ACL に登録し、グループとユーザにパーミッションを設定しましょう。

ユーザとグループを作成したとき、ARO は自動的に作成されます。
ではコントローラとアクションを ACO として自動的に作成するにはどのようにすればよいでしょうか。
残念ながら、CakePHP コアにはこれを自動的に行う方法はありません。
しかし CakePHP のコアクラスには、手動で ACO を作成する方法がいくつかあります。
ACO オブジェクトを作成するには、ACL シェルを用いるか、 `AclComponent` を使用します。
シェルで ACO を作成するには、次のようにします:

    bin/cake acl create aco root controllers

AclComponent を使う方法は次のようになります:

``` php
$this->Acl->Aco->create(['parent_id' => null, 'alias' => 'controllers']);
$this->Acl->Aco->save();
```

この両方の例では、「controllers」という名のトップレベルの ACO (あるいは根ノード) を作成しています。
これの目的は二つあります。ひとつはアプリケーション全体に対するアクセス可否を簡単にすること、
そしてモデルレコードのパーミッションをチェックするようなコントローラとアクションに関連することには
ACL を使用しないということです。グローバルなルート ACO を使用するには、 `AuthComponent` の
設定を若干変更する必要があります。ACL がコントローラとアクションを走査するにあたり正しい
ノードパスを使用するために、 `AuthComponent` に根ノードの存在を教えてください。
これを行うには、先のコードで定義してあるように、 `AppController` の `$components` で、
配列が `actionPath` を必ず含むようにしてください:

``` php
class AppController extends Controller
{
    public $components = [
        'Acl',
        'Auth' => [
            'authenticate' => [
                'Form' => ['passwordHasher' => 'Blowfish'],
            ],
            'authorize' => [
                'Actions' => ['actionPath' => 'controllers'],
            ],
        ],
        'Session',
        'Flash',
    ];
```

チュートリアルを続行するには、続けて [Part Two](part-two) を見てください。
