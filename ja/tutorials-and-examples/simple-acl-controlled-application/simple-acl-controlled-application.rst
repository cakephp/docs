ACLを制御するシンプルなアプリケーション
#######################################

.. note::

    このチュートリアルは初心者向けではありません。もし CakePHP を始めたばかりなら、
    このチュートリアルに挑戦する前にまずはフレームワークの機能をひととおり体験しておくことを
    おすすめします。

このチュートリアルでは :doc:`/core-libraries/components/authentication` と
:doc:`/core-libraries/components/access-control-lists` を用いたシンプルな
アプリケーションを作成します。このチュートリアルにはいくつかの前提があります。
CakePHP のある程度の経験と、MVCの概念についての理解、
:doc:`/tutorials-and-examples/blog/blog` を既に読み終わっていて、
:doc:`/console-and-shells/code-generation-with-bake` についてよく知っていることを
必要とします。このチュートリアルは :php:class:`AuthComponent` と
:php:class:`AclComponent` の簡単な紹介になります。

必要なもの


#. 稼動しているウェブサーバー。 Apache を使っているという前提で書いてありますが、
   他の種類のサーバーを使用する場合でも、ほぼ同じにいけるはずです。サーバーの設定を
   少し変える必要があるかもしれませんが、たいていの人は、そのままの設定で CakePHP を
   動作させることが可能です。
#. データベースサーバー。このチュートリアルでは MySQL を利用します。
   CakePHP におけるアプリケーションの作成は、まずデータベースを作成することからはじめますので、
   これに必要な SQL の知識を必要とします。
#. 基本的な PHP の知識。オブジェクト指向のプログラミングについて知っていると
   より良いでしょう。しかし手続き型言語としての知識しかなくても問題はありません。

アプリケーションの準備
======================

まず、最新の CakePHP のコピーを取得しましょう。

最新版をダウンロードするには GitHub の CakePHP プロジェクト(
https://github.com/cakephp/cakephp/tags) にアクセスし、安定版のリリースを
ダウンロードしてください。このチュートリアルで必要なバージョンは最新の 2.0 リリースです。

`git <http://git-scm.com/>`_ を使ってレポジトリを複製 (*clone*) することもできます。 ::

    git clone git://github.com/cakephp/cakephp.git

CakePHP の最新のコピーを取得したら、2.0 リリースの最新のブランチに変更し、 ``database.php``
を設定し、 ``app/Config/core.php`` の Security.salt の値を変更してください。
それから、アプリケーションを構築するための簡単なデータベーススキーマを作成しましょう。
次の SQL 文をデータベースに実行してください::

   CREATE TABLE users (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       password CHAR(40) NOT NULL,
       group_id INT(11) NOT NULL,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE groups (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE posts (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       user_id INT(11) NOT NULL,
       title VARCHAR(255) NOT NULL,
       body TEXT,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE widgets (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       part_no VARCHAR(12),
       quantity INT(11)
   );

これらのテーブルはアプリケーションの残りを作成する時に使用します。
データベースにこのテーブルを作成したら、クッキングを開始しましょう。
モデルとコントローラ、そしてビューのコードを、
:doc:`/console-and-shells/code-generation-with-bake` を使って簡単に作成して下さい。

cake の bake を使うにあたって、「cake bake all」を呼び出すと、先ほど MySQL に作成した
4つのテーブルがリストされます。「1 (Group).」を選び、プロンプトに従って下さい。
その他の3つのテーブルでも同じ手順を繰り返すと、合計4つのコントローラ、モデルそしてビューが
作成されます。

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

Auth を追加する準備
===================

この段階で、動作する CRUD アプリケーションが出来上がりました。
bake は必要なリレーションを全て行っているでしょうが、もしまだならそれを済ませてください。
Auth と Acl コンポーネントを追加する前に、多少の部品を加える必要があります。
まずは ``UsersController`` にログインとログアウトのアクションを加えましょう::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            }
            $this->Session->setFlash(__('Your username or password was incorrect.'));
        }
    }

    public function logout() {
        //ここは、今は空にしておいてください
    }

更に、以下の様にビューファイルを
``app/View/Users/login.ctp`` に作成してください::

    <?php
    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');
    ?>

次に、パスワードをデータベースに入る前にハッシュ化するように User モデルを書き換える
必要があります。平文のパスワードを保存するのは極めて危険であり、また AuthComponent は
パスワードがハッシュ化されていることを期待します。
``app/Model/User.php`` で以下を追加してください::

    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // 他のコード。

        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password(
              $this->data['User']['password']
            );
            return true;
        }
    }

次に行うことは、 ``AppController`` に変更を加えることです。
``/app/Controller/AppController.php`` が存在しない場合は、作成してください。
コントローラ全体に認証と ACL を行うなら、この ``AppController`` に対してセットアップを
行います。次のコードを加えてください::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );
        public $helpers = array('Html', 'Form', 'Session');

        public function beforeFilter() {
            // AuthComponent の設定
            $this->Auth->loginAction = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->logoutRedirect = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->loginRedirect = array(
              'controller' => 'posts',
              'action' => 'add'
            );
        }
    }

ACL をセットアップし終わってしまう前に、ユーザとグループを作成しましょう。
この状態ではまだログインしていないため、 :php:class:`AuthComponent` の働きにより、
どのアクションにもアクセスできません。そこで、グループとユーザを作成することを
:php:class:`AuthComponent` に許可させるために、いくつかの例外を設けましょう。
``GroupsController`` と ``UsersController`` の **両方** に、次のコードを追加してください::

    public function beforeFilter() {
        parent::beforeFilter();

        // CakePHP 2.0
        $this->Auth->allow('*');

        // CakePHP 2.1以上
        $this->Auth->allow();
    }

この記述は AuthComponent に、全てのアクションに対するパブリックなアクセスを許可するよう
指定するものです。これは一時的なものであり、データベースにいくつかのユーザとグループを
作成したら除去します。ユーザとグループはまだ追加しないでください。

ACL のデータベーステーブルの初期化
==================================

ユーザとグループを作成する前に、これらをACLに接続します。しかし、この段階では ACL に関する
テーブルが存在しないため、どのページを開いてもテーブルが見つからないというエラー(
「Error: Database table acos for model Aco was not found.」)が表示されます。
このエラーを解消するには、スキーマファイルを実行します。シェルで次のコマンドを実行してください::

    ./Console/cake schema create DbAcl

テーブルのドロップと作成についてプロンプトが表示されます。
テーブルの破棄および作成を行うには、「yes」を入力してください。

シェルを使えない、あるいはコンソールの使用に問題が生じた場合は、
/path/to/app/Config/Schema/db\_acl.sql の SQL ファイルを実行してください。

ここまでで、データの投入を行うコントローラの用意と ACL テーブルの初期化を行いました。
しかしまだ準備は終わっていません。ユーザとグループのモデルに対して、もう少しやることがあります。
これらのモデルに ACL に関わるからくりを追加していきましょう。

リクエスタとして振舞う
======================

Auth と ACL をきちんと動作させるには、ユーザとグループを ACL テーブルの列に関連付ける
必要があります。これを行うには、 ``AclBehavior`` を使用します。
``AclBehavior`` を使うと、モデルと ACL テーブルを自動的に結びつけることができます。
これを使用するにあたり、モデル中で ``parentNode()`` を実行する必要があります。
``User`` モデルに次のコードを追加してください::

    class User extends AppModel {
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
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
                return array('Group' => array('id' => $groupId));
            }
        }
    }

``Group`` モデルには、次のコードを追加します::

    class Group extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            return null;
        }
    }

このコードは、 ``Group`` モデルと ``User`` モデルを ACL に結びつけ、
``User`` や ``Group`` をデータベースに登録した時、常に CakePHP が
``aros`` にも同様の登録を行うようにしています。これにより、
``users`` および ``groups`` テーブルを ARO と透過的に結びつける
ACL の管理機能を、アプリケーションの一部として作成できました。
ユーザーやグループを作成したり削除すると、常に ARO のテーブルも更新されます。

コントローラとモデルは初期のデータを追加する用意ができ、 ``Group`` と ``User``
モデルは ACL テーブルに結び付けられました。
では http://example.com/groups/add と http://example.com/users/add
を開き、bake で焼いたフォームを使ってグループとユーザを追加しましょう。
次のグループを作成します。

-  administrators
-  managers
-  users

各グループにユーザを作成することもできるので、後でテストするために各々の異なる
アクセスグループにユーザを作成します。忘れてしまわないよう、パスワードは書きとめておくか、
簡単なものを使うようにしてください。MySQL のプロンプトで
``SELECT * FROM aros;`` を実行した場合、次のような結果を取得できるでしょう::

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

3つのグループと3人のユーザが存在することがわかります。ユーザは各グループにネストされており、
これはグループ単位もしくはユーザ単位でパーミッションを設定できることを意味します。

グループだけの ACL
------------------

グループごとのみのパーミッションに単純化したい場合、 ``User`` モデルに  ``bindNode()``
を実装する必要があります::

    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

``User`` モデルの ``actsAs`` を更新して、 requester ディレクティブを無効化します::

    public $actsAs = array('Acl' => array('type' => 'requester', 'enabled' => false));

これら２つの変更は、ACL に ``User`` の ARO のチェックを省き、 ``Group`` の ARO のみを
チェックするように伝えます。これは、afterSave が呼ばれることを避けます。

注意: これを動作させるために、全てのユーザーに ``group_id`` を割り当てる必要があります。

この場合、 ``aros`` テーブルは以下のようになるでしょう::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

注意: もしこのポイントまでチュートリアルに追随しているなら、 ``aros``, ``groups``, ``users``
を含むテーブルを削除する必要があり、 ``aros`` テーブルを上記のように取得するために、
再び groups と users を最初から作成してください。

ACO(*Access Control Objects*)の作成
===================================

ユーザとグループ (*ARO*) を作成しましたので、ログインとログアウトができるよう、
コントローラを ACL に登録し、グループとユーザにパーミッションを設定しましょう。

ユーザとグループを作成したとき、ARO は自動的に作成されます。
ではコントローラとアクションを ACO として自動的に作成するにはどのようにすればよいでしょうか。
残念ながら、CakePHP コアにはこれを自動的に行う方法はありません。
しかし CakePHP のコアクラスには、手動で ACO を作成する方法がいくつかあります。
ACO オブジェクトを作成するには、ACL シェルを用いるか、 ``AclComponent`` を使用します。
シェルで ACO を作成するには、次のようにします::

    ./Console/cake acl create aco root controllers

AclComponent を使う方法は次のようになります::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

この両方の例では、「controllers」という名のトップレベルの ACO (あるいは根ノード) を作成しています。
これの目的は二つあります。ひとつはアプリケーション全体に対するアクセス可否を簡単にすること、
そしてモデルレコードのパーミッションをチェックするようなコントローラとアクションに関連することには
ACL を使用しないということです。グローバルなルート ACO を使用するには、 ``AuthComponent`` の
設定を若干変更する必要があります。ACL がコントローラとアクションを走査するにあたり正しい
ノードパスを使用するために、 ``AuthComponent`` に根ノードの存在を教えてください。
これを行うには、先のコードで定義してあるように、 ``AppController`` の ``$components`` で、
配列が ``actionPath`` を必ず含むようにしてください::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );

チュートリアルを続行するには、続けて :doc:`part-two` を見てください。


.. meta::
    :title lang=ja: Simple Acl controlled Application
    :keywords lang=ja: core libraries,auto increment,object oriented programming,database schema,sql statements,php class,stable release,code generation,database server,server configuration,reins,access control,shells,mvc,authentication,web server,cakephp,servers,checkout,apache
