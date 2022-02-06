ACL を制御するシンプルなアプリケーション
########################################

CakePHP へようこそ。もし CakePHP
が本当にはじめてなら、まずブログチュートリアルから開始してください。ブログチュートリアルを済ませていて、
bake をすでに使用しているか説明を読むかしており、
Auth(認証)とアクセス制御システム(ACL)について知りたいなら、このチュートリアルを開始してください。

このチュートリアルを開始する前に、いくつかの前提が必要です。まず CakePHP
についていくらの経験、そして MVC のコアとなるコンセプトについての理解、
bake と cake
のコンソールを充分に扱えることが必要です。もしまだ準備が整っていない場合は、これらについて充分学んでからもう一度ここに戻ってきてください。そうすればこのチュートリアルは簡単に続けることができ、多くのことを学ぶことができます。このチュートリアルでは
``AuthComponent`` と ``AclComponent``
を使用します。これらが何をするものなのか分からない場合は、先に進む前にこれらについてのページを確認してください。

必要なこと

#. 稼動しているウェブサーバーが必要です。 Apache
   に利用を前提としていますが、他のサーバであっても使い方はだいたい同じでしょう。このチュートリアルの中では、場合によってサーバの設定を少し変更する必要がありますが、多くの場合、特に何も設定しなくても
   CakePHP を起動することができるでしょう。
#. データベースサーバーが必要です。このチュートリアルでは MySQL
   の使用を利用します。CakePHP
   におけるアプリケーションの作成は、まずデータベースを作成することからはじめますので、これに必要な
   SQL の知識を必要とします。
#. 基本的な PHP
   の知識が必要です。オブジェクト指向のプログラミングについて知っているとより良いでしょう。しかし手続き型言語としての知識しかなくても問題はありません。

アプリケーションの準備
======================

まず、最新の CakePHP のコピーを取得しましょう。

最新版をダウンロードするには Cakeforge の CakePHP
プロジェクト にアクセスし、安定版のリリースをダウンロードしてください。このチュートリアルで必要なバージョンは
1.2.x.x です。

https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ から trunk
コードの複製を、チェックアウトもしくはエクスポートすることもできます。

最新版を取得したら、 database.php をセットアップし、 app/config/core.php
の Security.salt
の値を変更してください。そこから、アプリケーションを構築するための簡単なデータベーススキーマを作成しましょう。次の
SQL 文をデータベースに実行してください。

::

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

これらのテーブルはアプリケーションの残りを作成する時に使用します。データベースにこのテーブルを作成したら、クッキングを開始しましょう。モデルとコントローラ、そしてビューのコードを、\ `cake
bake </ja/view/113/Code-Generation-with-Bake>`_
コマンドを使って手短に作成して下さい。

cake bake を使うにあたって、"cake bake all" を呼び出すと、先ほど MySQL
に作成した4つのテーブルがリストされます。"1 (Group)."
を選び、プロンプトに従って下さい。その他の3つのテーブルでも同じ手順を繰り返すと、合計4つのコントローラ、モデルそしてビューが作成されます。

ここでスキャフォールド(\ *Scaffold*)は使わないでください。スキャフォールドの仕組みを用いたコントローラを
bake すると、ACO の生成に深刻な影響が生じます。

モデルを bake する時、Cake
は自動的にモデル間のつながり(あるいはテーブル間の関連)を検知します。Cake
に正しい hasMany や belongsTo のつながりを教えてください。hasOne と
hasMany
の両方を選べるようプロンプトに表示された場合、このチュートリアルではとりあえず
hasMany だけを選んでおけば問題ありません。

admin routing
のことは今は忘れてください。認証とアクセス制御リストはそれだけでとても複雑なことなので、admin
routing についてひとまず置いておきます。bake で作成したコントローラには
Acl や Auth
コンポーネントを\ **追加しない**\ よう注意してください。これは後ほど行います。これで、テーブル「users」「groups」「posts」「widgets」に対するモデル、コントローラおよびビューができました。

Auth を追加する準備
===================

この段階で、動作する CRUD アプリケーションが出来上がりました。bake
は必要なリレーションを全て行っているでしょうが、もしまだならそれを済ませてください。Auth
と Acl
コンポーネントを追加する前に、いくつか加えることがあります。まずは
``UsersController`` にログインとログアウトのアクションを加えます。

::

    function login() {
        // 認証のからくり
    }
     
    function logout() {
        // ここは、今は空にしておいてください
    }

そうしたら、次の様にビューファイルを app/views/users/login.ctp
に作成してください:

::

    $session->flash('auth');
    echo $form->create('User', array('action' => 'login'));
    echo $form->inputs(array(
        'legend' => __('Login', true),
        'username',
        'password'
    ));
    echo $form->end('Login');

ユーザを作成・編集するとき、あるいはログインやプロパティを変更するときに、パスワードをハッシュ化する必要はありません。これは自動的に行われます。もし手動でパスワードをハッシュ化したら、\ ``AuthComponent``
は上手く動作しなくなります。パスワードが二重にハッシュ化され、マッチしなくなるためです。

次に行うことは、 ``AppController``
に変更を加えることです。\ ``/app/app_controller.php``
が存在しない場合は、作成してください。/app/controllers/ ではなく、/app/
に作成することに注意してください。コントローラ全体に認証と ACL
を行うなら、この ``AppController``
に対してセットアップを行います。次のコードを加えてください。

::

    <?php
    class AppController extends Controller {
        var $components = array('Acl', 'Auth');

        function beforeFilter() {
            // AuthComponent の設定
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }
    ?>

ACL
をセットアップし終わってしまう前に、ユーザとグループを作成しましょう。この状態ではまだログインしていないため、\ ``AuthComponent``
の働きにより、どのアクションにもアクセスできません。そこで、グループとユーザを作成することを
``AuthComponent``
に許可させるために、いくつかの例外を設けましょう。\ ``GroupsController``
と ``UsersController`` の\ **両方**\ に、次のコードを追加してください。

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('*');
    }

この記述は AuthComponent
に、全てのアクションに対するパブリックなアクセスを許可するよう指定するものです。これは一時的なものであり、データベースにいくつかのユーザとグループを作成したら除去します。ユーザとグループはまだ追加しないでください。

ACL のデータベーステーブルの初期化
==================================

ユーザとグループを作成する前に、これらを ACL
に接続します。しかし、この段階では ACL
に関するテーブルが存在しないため、どのページを開いても missing table
エラー("Error: Database table acos for model Aco was not
found.")が表示されます。このエラーを解消するには、スキーマファイルを実行します。シェルで次のコマンドを実行してください。

::

        cake schema run create DbAcl

テーブルのドロップと作成についてプロンプトが表示されます。テーブルの破棄および作成を行うには、「yes」を入力してください。

シェルを使えない、あるいはコンソールの使用に問題が生じた場合は、
/path/to/app/config/sql/db\_acl.sql の SQL ファイルを実行してください。

ここまでで、データの投入を行うコントローラの用意と ACL
テーブルの初期化を行いました。しかしまだ準備は終わっていません。ユーザとグループのモデルに対して、もう少しやることがあります。これらのモデルに
ACL に関わるからくりを追加していきましょう。

リクエスタとして振舞う
======================

Auth と ACL をきちんと動作させるには、ユーザとグループを ACL
テーブルの列に関連付ける必要があります。これを行うには、 ``AclBehavior``
を使用します。\ ``AclBehavior`` を使うと、モデルと ACL
テーブルを自動的に結びつけることができます。これを使用するにあたり、モデル中で
``parentNode()`` を実行する必要があります。\ ``User``
モデルに次のコードを追加してください。

::

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => 'requester');
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (!$data['User']['group_id']) {
            return null;
        } else {
            return array('Group' => array('id' => $data['User']['group_id']));
        }
    }

``Group`` モデルには、次のコードを追加します。

::

    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        return null;
    }

このコードは、 ``Group`` モデルと ``User`` モデルを ACL に結びつけ、
User や Group をデータベースに登録した時、常に CakePHP が ``aros``
にも同様の登録を行うようにしています。これにより、\ ``users`` および
``groups`` テーブルを ARO と透過的に結びつける ACL
の管理機能を、アプリケーションの一部として作成できました。ユーザーとグループを作成したり削除すると、常に
ARO のテーブルも更新されます。

コントローラとモデルは初期のデータを追加する用意ができ、\ ``Group`` と
``User`` モデルは ACL テーブルに結び付けられました。では bake
で焼いたフォームを使って、グループとユーザを追加しましょう。次のグループを作成します。

-  administrators
-  managers
-  users

各グループにユーザを作成することもできるので、後でテストするために各々の異なるアクセスグループにユーザを作成します。忘れてしまわないよう、パスワードは書きとめておくか、簡単なものを使うようにしてください。MySQL
のプロンプトで「\ ``SELECT * FROM aros;``\ 」を実行した場合、次のような結果を取得できるでしょう。

::

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

3つのグループと3人のユーザが存在することがわかります。ユーザは各グループにネストされており、これはグループ単位もしくはユーザ単位でパーミッションを設定できることを意味します。

ユーザを変更する場合は、ARO
を手動で更新しなければなりません。次のコードは、ユーザの情報を更新する時は必ず実行されます。

::

    // Check if their permission group is changing
    $oldgroupid = $this->User->field('group_id');
    if ($oldgroupid !== $this->data['User']['group_id']) {
        $aro =& $this->Acl->Aro;
        $user = $aro->findByForeignKeyAndModel($this->data['User']['id'], 'User');
        $group = $aro->findByForeignKeyAndModel($this->data['User']['group_id'], 'Group');
                    
        // ARO テーブルに保存する
        $aro->id = $user['Aro']['id'];
        $aro->save(array('parent_id' => $group['Aro']['id']));
    }

上述の group\_id が変更された後に ARO を更新する方法の代わりとして、User
モデルに次のコードを追加する方法もあります。こうすることでコードが重複するおそれが無くなります。

::

    /**    
     * After save callback
     *
     * user の aro を更新する *
     * @access public
     * @return void
     */
    function afterSave($created) {
            if (!$created) {
                $parent = $this->parentNode();
                $parent = $this->node($parent);
                $node = $this->node();
                $aro = $node[0];
                $aro['Aro']['parent_id'] = $parent[0]['Aro']['id'];
                $this->Aro->save($aro);
            }
    }

ACO の作成
==========

ユーザとグループ(\ *ARO*)を作成しましたので、ログインとログアウトができるよう、コントローラを
ACL に登録し、グループとユーザにパーミッションを設定しましょう。

ユーザとグループを作成したとき、ARO
は自動的に作成されます。ではコントローラとアクションを ACO
として自動的に作成するにはどのようにすればよいでしょうか。残念ながら、
CakePHP コアにはこれを自動的に行う方法はありません。しかし CakePHP
のコアクラスには、手動で ACO を作成する方法がいくつかあります。ACO
オブジェクトを作成するには、 ACL シェルを用いるか、\ ``AclComponent``
を使用します。シェルで ACO を作成するには、次のようにします。

::

    cake acl create aco root controllers

AclComponent を使う方法は次のようになります。

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

この両方の例では、「controllers」という名のトップレベルの ACO
(あるいは根ノード)を作成しています。これの目的は二つあります。ひとつはアプリケーション全体に対するアクセス可否を簡単にすること、そしてモデルレコードのパーミッションをチェックするようなコントローラとアクションに関連することには
ACL を使用しないということです。グローバルなルート ACO
を使用するには、\ ``AuthComponent`` の設定を若干変更する必要があります。
ACL
がコントローラとアクションを走査するにあたり正しいノードパスを使用するために、\ ``AuthComponent``
に根ノードの存在を教えてください。これを行うには、 ``AppController`` の
``beforeFilter`` に次のものを追加します。

::

    $this->Auth->actionPath = 'controllers/';

ACO の作成を自動化するツール
============================

前述した通り、全てのコントローラとアクションを ACL
にあらかじめ入力し、構築しておく方法はありません。しかしながら、大きなアプリケーションにとてもたくさんのアクションがある場合、これを一々登録するというのは面倒です。
ACO
テーブルを自動的に構築する機能を手早く作ってみましょう。この関数はアプリケーション中の全てのコントローラから参照できるようにします。そのため、これはプライベートでなく、
ACL テーブルに対する ``Controller``
のメソッドでもなく、コントローラの下にネストしておくことが良いでしょう。
``AppController``
やそれに関する全てのコントローラに追加し実行できるようにしたら、アプリケーションをプロダクションモード(サイトを一般開放する等)にする前に、これらのコードを除去することを忘れないようにしてください。

::

        function build_acl() {
            if (!Configure::read('debug')) {
                return $this->_stop();
            }
            $log = array();

            $aco =& $this->Acl->Aco;
            $root = $aco->node('controllers');
            if (!$root) {
                $aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
                $root = $aco->save();
                $root['Aco']['id'] = $aco->id; 
                $log[] = 'Created Aco node for controllers';
            } else {
                $root = $root[0];
            }   

            App::import('Core', 'File');
            $Controllers = Configure::listObjects('controller');
            $appIndex = array_search('App', $Controllers);
            if ($appIndex !== false ) {
                unset($Controllers[$appIndex]);
            }
            $baseMethods = get_class_methods('Controller');
            $baseMethods[] = 'build_acl';

            $Plugins = $this->_getPluginControllerNames();
            $Controllers = array_merge($Controllers, $Plugins);

            // look at each controller in app/controllers
            foreach ($Controllers as $ctrlName) {
                $methods = $this->_getClassMethods($this->_getPluginControllerPath($ctrlName));

                // Do all Plugins First
                if ($this->_isPlugin($ctrlName)){
                    $pluginNode = $aco->node('controllers/'.$this->_getPluginName($ctrlName));
                    if (!$pluginNode) {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginName($ctrlName)));
                        $pluginNode = $aco->save();
                        $pluginNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $this->_getPluginName($ctrlName) . ' Plugin';
                    }
                }
                // find / make controller node
                $controllerNode = $aco->node('controllers/'.$ctrlName);
                if (!$controllerNode) {
                    if ($this->_isPlugin($ctrlName)){
                        $pluginNode = $aco->node('controllers/' . $this->_getPluginName($ctrlName));
                        $aco->create(array('parent_id' => $pluginNode['0']['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginControllerName($ctrlName)));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $this->_getPluginControllerName($ctrlName) . ' ' . $this->_getPluginName($ctrlName) . ' Plugin Controller';
                    } else {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $ctrlName));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $ctrlName;
                    }
                } else {
                    $controllerNode = $controllerNode[0];
                }

                //clean the methods. to remove those in Controller and private actions.
                foreach ($methods as $k => $method) {
                    if (strpos($method, '_', 0) === 0) {
                        unset($methods[$k]);
                        continue;
                    }
                    if (in_array($method, $baseMethods)) {
                        unset($methods[$k]);
                        continue;
                    }
                    $methodNode = $aco->node('controllers/'.$ctrlName.'/'.$method);
                    if (!$methodNode) {
                        $aco->create(array('parent_id' => $controllerNode['Aco']['id'], 'model' => null, 'alias' => $method));
                        $methodNode = $aco->save();
                        $log[] = 'Created Aco node for '. $method;
                    }
                }
            }
            if(count($log)>0) {
                debug($log);
            }
        }

        function _getClassMethods($ctrlName = null) {
            App::import('Controller', $ctrlName);
            if (strlen(strstr($ctrlName, '.')) > 0) {
                // plugin's controller
                $num = strpos($ctrlName, '.');
                $ctrlName = substr($ctrlName, $num+1);
            }
            $ctrlclass = $ctrlName . 'Controller';
            return get_class_methods($ctrlclass);
        }

        function _isPlugin($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) > 1) {
                return true;
            } else {
                return false;
            }
        }

        function _getPluginControllerPath($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0] . '.' . $arr[1];
            } else {
                return $arr[0];
            }
        }

        function _getPluginName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0];
            } else {
                return false;
            }
        }

        function _getPluginControllerName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[1];
            } else {
                return false;
            }
        }

    /**
     * Get the names of the plugin controllers ...
     * 
     * This function will get an array of the plugin controller names, and
     * also makes sure the controllers are available for us to get the 
     * method names by doing an App::import for each plugin controller.
     *
     * @return array of plugin names.
     *
     */
        function _getPluginControllerNames() {
            App::import('Core', 'File', 'Folder');
            $paths = Configure::getInstance();
            $folder =& new Folder();
            $folder->cd(APP . 'plugins');

            // Get the list of plugins
            $Plugins = $folder->read();
            $Plugins = $Plugins[0];
            $arr = array();

            // Loop through the plugins
            foreach($Plugins as $pluginName) {
                // Change directory to the plugin
                $didCD = $folder->cd(APP . 'plugins'. DS . $pluginName . DS . 'controllers');
                // Get a list of the files that have a file name that ends
                // with controller.php
                $files = $folder->findRecursive('.*_controller\.php');

                // Loop through the controllers we found in the plugins directory
                foreach($files as $fileName) {
                    // Get the base file name
                    $file = basename($fileName);

                    // Get the controller name
                    $file = Inflector::camelize(substr($file, 0, strlen($file)-strlen('_controller.php')));
                    if (!preg_match('/^'. Inflector::humanize($pluginName). 'App/', $file)) {
                        if (!App::import('Controller', $pluginName.'.'.$file)) {
                            debug('Error importing '.$file.' for plugin '.$pluginName);
                        } else {
                            /// Now prepend the Plugin name ...
                            // This is required to allow us to fetch the method names.
                            $arr[] = Inflector::humanize($pluginName) . "/" . $file;
                        }
                    }
                }
            }
            return $arr;
        }

では、ブラウザで http://localhost/groups/build\_acl といった URL
にアクセスして、ACO テーブルを自動的に構築しましょう。

アプリケーションのコントローラとアクションを ACO
に追加するため、常にこの機能をとっておきたいと考えるかもしれません。しかしこの機能は、削除したアクションをノードから取り除きません。さて、ここまででようやく準備が整いました。いよいよパーミッションを設定していきます。その前に、
``AuthComponent`` を無効化するコードを除去しておきましょう。

以前このページに掲載されていたコードはプラグインのことを考慮されておらず、ACL
による制御を行うアプリケーションを構築しようにも面倒なことがありました。現在は、必要に応じて自動的にプラグインのアクションも読み込むよう改良されています。このアクションを実行すると、ブラウザのページの最上段にデバッグメッセージが表示されることに注意してください。このメッセージはプラグインのコントローラアクションのうち、ACO
ツリーに登録されたもの・されなかったものを表します。

パーミッションの設定
====================

パーミッションの設定は、 ACO
の作成と同様に自動化するための仕組みや、前節で示したような方法はありません。
ARO に対して ACO
へのアクセスをシェルインターフェースを用いて許可するには、次のようにします。

::

    cake acl grant $aroAlias $acoAlias [create|read|update|delete|'*']

アスタリスクは「'\*'」というように、シングルクォーテーションで囲ってください。

``AclComponent`` を用いて行うには、次のようにします。

::

    $this->Acl->allow($aroAlias, $acoAlias);

いくつかの「許可」「拒否」の指定を行ってみましょう。 ``UsersController``
の中に一時的に利用する関数を作成し、ブラウザでそのアクションを実行するアドレスへ接続してください。
「\ ``SELECT * FROM aros_acos``\ 」を実行すると、結果に 1 と 0
がたくさん含まれているはずです。 If you do a ``SELECT * FROM aros_acos``
you should see a whole pile of 1's and 0's.
パーミッションがセットできたことを確認したら、作成した関数を削除してください。

::

    function initDB() {
        $group =& $this->User->Group;
        // 管理者グループには全てを許可する
        $group->id = 1;     
        $this->Acl->allow($group, 'controllers');
     
        // マネージャグループには posts と widgets に対するアクセスを許可する
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');
     
        // ユーザグループには posts と widgets に対する追加と編集を許可する
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');        
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');        
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
    }

これで基本的なアクセスのルールがセットアップできました。
管理者グループには全てのアクセスを許可しており、 マネージャーグループは
posts と widgets に対する完全なアクセスが行えます。
そしてユーザグループは posts と widgets
に対する追加と編集のみ許可されています。

上述の例で ARO を指定するために ``Group``
モデルのリファレンスを取得し、その id を指定しました。これにより
``AclBehavior`` が動作します。

ACL パーミッションから index アクションや view
アクションをわざと省略したことに気づいたかもしれません。これらは、
``PostsController`` と ``WidgetsController``
において作成していきます。これは許可されていないユーザもこれらのページを表示することを可能にし、パブリックなページにします。とはいえ、いつでも
``AuthComponent::allowedActions``
からそれらのアクションを削除できますし、 ACL の中に view と edit
のパーミッションを差し戻すこともできます。

さて、ここまでで users と groups コントローラから
``Auth->allowedActions`` の参照を取り外しました。次に、 posts と widgets
コントローラに次の行を追加してみましょう。

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('index', 'view');
    }

これは先に users と groups
コントローラに設置したオフスイッチを取り除き、 posts と widgets
コントローラの index および view
アクションにパブリックなアクセスを与えています。

ログイン
========

これでアプリケーションがアクセス制御下におかれましたので、パブリックでないページの表示に対するアクセスはログインページにリダイレクトされるようになりました。しかし、先にログインを行うまえに、それ用のビューを作成しなければなりません。もし
``app/views/users/login.ctp``
をまだ作成していないなら、次のコードを設置してください。

::

    <h2>Login</h2>
    <?php
    echo $form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $form->input('User.username');
    echo $form->input('User.password');
    echo $form->end('Login');
    ?>

レイアウトに認証メッセージを表示する flash()
を追加したいかもしれません。もし app の layouts
フォルダにコピーを作成していないなら、
``cake/libs/views/layouts/default.ctp``
にあるデフォルトのコアのレイアウトをコピーしてください。そして、
``app/views/layouts/default.ctp`` に次の行を追加します。

::

    $session->flash('auth');

これでログインを行うことができ、全てが自動的にうまく機能するようになりました。アクセスが拒否された時、
``$session->flash('auth')``
が追加されていれば、認証メッセージが画面に表示されます。

ログアウト
==========

それではログアウトについて見ていきましょう。先に、ログアウトの関数を空のままにしておきましたが、これを埋めていきます。
``UsersController::logout()`` に次の行を追加してください。

::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

これはセッションフラッシュメッセージをセットし、 Auth の logout
メソッドを使用して User をログアウトさせます。 Auth の logout
メソッドは基本的に Auth Session キーを削除し、リダイレクトすべき URL
を返します。他のセッションデータを削除したい場合は、ここにコードを追加してください。

最後に
======

これで認証とアクセス制御リストによってコントロールされたアプリケーションができました。ユーザーのパーミッションは、グループに対して行われています。しかし、これらはユーザに対しても同じ時に行うことができます。パーミッションの設定は、グローバルに行ったり、コントローラ単位やアクション単位でも行えます。さらに、アプリケーションが拡大するにあたり
ACO
テーブルを簡単に拡張し、再利用可能なコードのブロックを使うこともできます。
