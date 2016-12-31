認証
####

ユーザ認証システムは多くのウェブアプリケーションで一般的な仕組みです。CakePHP
には、それぞれ異なるオプションを持つユーザ認証のシステムがいくつかあります。それらの中核を担う認証コンポーネントでは、ユーザがあるサイトにアカウントを持っているかどうかをチェックします。もしアカウントが存在すれば、コンポーネントはユーザに対してサイトへのアクセスを許可します。

このコンポーネントは ACL (アクセス制御リスト, *Access Control
List*)コンポーネントと併せて使うことで、より複雑なサイト内のアクセス権限を作成できます。ACL
コンポーネントは、例えば、あるユーザにはサイトの一般的な領域にアクセスすることを許可し、別のユーザには保護されたサイトの管理領域へのアクセスを許可するといったことを実現できます。

CakePHP の AuthComponent
を使うと、こういったシステムを容易に、そして素早く作成できます。
ごく簡単な認証システムの作成方法を見てみましょう。

他の全てのコンポーネントと同じく、コントローラ内で使用するコンポーネントに「Auth」を加えることで、認証コンポーネントは使用可能になります。

::

    class FooController extends AppController {
        var $components = array('Auth');

あるいは、全てのコントローラで認証コンポーネントを利用するのなら、
AppController に追加しても良いでしょう。

::

    class AppController extends Controller {
        var $components = array('Auth');

AuthComponent を使うにあたり、いくつかの決まりごとがあります。
デフォルトでは、 AuthComponent
は、「username」と「password」というフィールドを持つ「users」テーブルを使おうとします。\ *しかし状況によっては、データベースでのカラム名に「password」というものは使えない場合があります。後ほど、それぞれの環境に適合させるためデフォルトで参照するフィールド名を変更する方法を説明します。*

では、次の SQL 文を実行して、「users」テーブルをセットアップしましょう。

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(50),
        PRIMARY KEY (id)
    );

ユーザを認証するデータを格納するテーブルを作成する時に注意する点があります。それは、
AuthComponent
は、データベースに格納するパスワードは平文ではなくハッシュ化されたものであることを期待する、という点です。
そのため、パスワードを保存するフィールドには、ハッシュを格納するのに十分な長さを持たせる必要があります。(例えば、
SHA1 だとハッシュの長さは40文字になります。)

最も基本的なセットアップは、コントローラ中に二つのアクションを作成するだけです。

::

    class UsersController extends AppController {

        var $name = 'Users';    
        var $components = array('Auth'); // Not necessary if declared in your app controller
     
        /**
         * AuthComponent がログインに必要な機能を提供します。
         * そのため、この関数の中身は空にしておいてください。     */
        function login() {
        }

        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }

login()
機能を空にしても、ログインのビューのテンプレートは作成する必要があります。
(app/views/users/login.ctp に保存します。)UserController
のビューテンプレートとして作成する必要があるものは、次のものだけです。
この例ではすでに Form ヘルパーを使用していると仮定しています。

::

    <?php
        if  ($session->check('Message.auth')) $session->flash('auth');
        echo $form->create('User', array('action' => 'login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>

このビューは、ユーザ名とパスワードを入力する単純なログインフォームを作成します。
このフォームを送信すると、 AuthComponent
はログインに必要な処理を行います。また、 session->flash メッセージは、
AuthComponent が生成した全ての警告を出力します。

信じられないかもしれませんが、これでユーザ認証は完了です。ありえないほどシンプルですが、これが
Auth
コンポーネントとデータベースを用いた認証システムの使用方法です。とはいえ、すべきことは、まだたくさんあります。このコンポーネントのさらに進んだ使い方を見てみましょう。

Auth コンポーネントの変数を設定する
===================================

AuthComponent のデフォルトのオプションを変更する時は、コントローラに
beforeFilter()
メソッドを作成して、その中で様々な組み込みのメソッドを呼び出したり、コンポーネントの変数を設定してください。

例えば、パスワードを格納するフィールドの名前を「password」から「secretword」に変更するには、次のようにします。

::

    class UsersController extends AppController {
        var $components = array('Auth');

        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

この時、ビューテンプレートのフィールド名を変更することを忘れないでください！

Auth
コンポーネントのその他の一般的な使い方は、あるメソッドにログインしていないユーザがアクセスすることを許可することです。

例えば、 index と view
メソッドには全てのユーザをアクセスさせ、他のメソッドにはアクセスさせない場合、次のようにします:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }

認証のエラーメッセージを表示する
================================

Auth
コンポーネントが吐き出すエラーメッセージを表示するためには、次のコードをビューに加えてください。
このケースでは、メッセージは標準的な flash
メッセージの下に表示されます。

全てのビューに対して、普通のflashメッセージとauthのflashメッセージとを全て表示するには、下記の二つの行をviews/layouts/default.ctpのbodyタグの中に書き加えるようにします。content\_for\_layoutの行の前に設置するのが望ましいでしょう。

::

    <?php
        $session->flash();
        $session->flash('auth');
    ?>

認証における問題のトラブルシューティング
========================================

期待した動作が得られない時、問題の原因を調査することがかなり難しい場合があります。
おぼえておくべきいくつかのポイントがあります。

*パスワードのハッシュ化*

フォームからアクションへ情報が POST された時、 Auth
コンポーネントは、ユーザ名フィールドのデータはそのまま持ち、パスワードのフィールドに入力されたコンテンツは自動的にハッシュ化します。
登録などを行うページを作成したいなら、
「パスワード確認」というようなフィールドをユーザに入力してもらうようにし、
パスワードと比較するようにしてください。
サンプルコードは次のようになります。

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

暗号化の方法を変更する
======================

AuthComponent は、パスワードを暗号化するために Security
クラスを使います。 Security は、デフォルトで SHA1 を使います。 Auth
コンポーネントで使用される暗号化メソッドを変更するには、\ ``setHash``
メソッドに暗号化方法を引数で与えてください。このメソッドに引数は一つしか渡せません。
サポートしている値は、「\ ``md5``\ 」「\ ``sha1``\ 」そして「\ ``sha256``\ 」です。

::

    Security::setHash('md5'); // または sha1 か sha256 

Security クラスはパスワードの暗号化に、 /app/config/core.php で定義した
Security.salt の値を使用します。 もし、 Security.salt
を使わず暗号化したスキーマがある既存のデータベースを利用する場合、
``authorize`` をセットしていなければこれをセットし、そのクラスの中で
`hashPasswords </ja/view/384/hashPasswords>`_
メソッドを作成してください。

AuthComponent のメソッド
========================

action
------

``action (string $action = ':controller/:action')``

もし ACL を利用していて、その構造の一部として ACO を用いているなら、
ある特定の controller/action ペアに結びついた ACO
ノードのパスを取得できます。

::

        $acoNode = $this->Auth->action('users/delete');

何も値を渡さなければ、現在の controller/action ペアが使用されます。

allow
-----

コントローラ中で認証を行わないアクション(例えば登録を行うアクション)があるのなら、
allow メソッドを使って AuthComponent
がそのアクションを無視するようにできます。
次の例では、「register」アクションで認証を無視するようにしています。

決して、 allow
メソッドに「login」という名前のアクションを適用しないでください。認証機能が誤作動します。

::

        $this->Auth->allow('register');

複数のアクションで認証をスキップするようにするなら、それらのアクション名を
allow() メソッドのパラメータに渡してください。

::

        $this->Auth->allow('foo', 'bar', 'baz');

ショートカット：コントローラ中の全てのアクションに allow
を実行する場合、「\*」を指定してください。

::

        $this->Auth->allow('*');

レイアウトやエレメントで requestAction を使う場合、
ログインページがきちんと表示されるよう、それらのアクションを allow
で許可するようにしてください。

認証コンポーネントは、アクション名が\ `規約に沿った </ja/view/559/URL-Considerations-for-Controller-Names>`_\ ものであり、アンダースコアによる記法であることを前提とします。

deny
----

allow
で認証を行わないことを許可したアクション一覧から、一部のアクションを取り除きたいこと場合が出てくるかもしれません。
これを行うには次のようにします。

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }

        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }

            ...
        }

hashPasswords
-------------

``hashPasswords ($data)``

このメソッドは、 ``$data``
にユーザ名とパスワードが含まれるかをチェックします。ユーザ名とパスワードは、
``$userModel`` で定義されたモデル名ものにインデックスされ、\ ``$fields``
で定義されたものを利用します。もし ``$data``
配列がユーザ名とパスワードの両方を含む場合、このメソッドはパスワードのフィールドをハッシュ化し、同じフォーマットで
data
配列を返します。この機能は、パスワードのフィールドが発生するとき、ユーザのモデルに対する挿入や更新を行う前に実行しておくべきです。

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        print_r($hashedPasswords);
        /* returns:
        Array
        (
            [User] => Array
            (
                [email] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )

        */

この例において、 *$hashedPasswords['User']['password']*
フィールドはコンポーネントの ``password``
関数を使ってハッシュ化されます。

もしコントローラが Auth
コンポーネントを利用しており、データが前述したユーザ名やパスワードといったフィールドを保持していた場合、パスワードのフィールドはこの関数を使って自動的にハッシュ化されます。

mapActions
----------

If you are using Acl in CRUD mode, you may want to assign certain
non-default actions to each part of CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('someAction'),
            'read' => array('someAction', 'someAction2'),
            'update' => array('someAction'),
            'delete' => array('someAction')
        )
    );

login
-----

``login($data = null)``

Ajax ベースのログイン等を利用したいなら、
このメソッドを使い、手動で利用者をシステムにログインさせることができます。
``$data`` に値を渡さなければ、コントローラ中の POST
されたデータを自動的に使用します。

例えば、ユーザーに自動的にパスワードを割り当てて、登録後にログインするアプリケーションにしたい。以上の簡単な例では：

View:

::

    echo $form->create('User',array('action'=>'register'));
    echo $form->input('username');
    echo $form->end('Register');

Controller

::

    function register() {
        if(!empty($this->data)) {
            $this->User->create();
            $assigned_password = "password";
            $this->data['User']['password'] = $assigned_password;
            if($this->User->save($this->data)) {
                // send signup email containing password to the user
                $this->Auth->login($this->data);
                $this->redirect("home");
        }
    }

一点注意すべきこととしてloginRedirect呼び出されない場合は手動でログイン後にユーザーをリダイレクトする必要があります。

$this->Auth->login($data) は、成功時に1,失敗時に0を返します。

logout
------

利用者を認証していない状態(ログアウトした状態)にし、どこかにリダイレクトさせるための素早い方法を提供します。
このメソッドは、アプリケーション中のメンバーだけが表示できるページ内に「ログアウト」機能を提供したい時などに便利です。

Example:

::

    $this->redirect($this->Auth->logout());

password
--------

``password (string $password)``

文字列を渡すと、ハッシュ化されたものを取得できます。
この機能は、ログイン済みのユーザに対して、アプリケーションの重要な領域にアクセスさせる前にもう一度パスワードを入力してもらう時などに重要となります。

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {

        // Passwords match, continue processing
        ...
    } else {
        $this->flash('Typed passwords did not match', 'users/register');
    }

認証コンポーネントは、送信されたデータの中に「username」フィールドがある場合、自動的に「password」フィールドをハッシュ化します。

user
----

::

    user(string $key = null)

このメソッドは、現在認証しているユーザの情報を提供します。この情報はセッションから取得されます。例は次のとおりです。

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('あなたは管理者権限でアクセスしています。');
    }

このメソッドは、ユーザのセッションデータを全て取得するためにも使えます。

::

    $data['User'] = $this->Auth->user();

ユーザーがログインしていない場合、このメソッドは null を返します。

AuthComponent の変数
====================

認証に関連した変数は、次のようなものになります。通常、これらはコントローラの
beforeFilter() メソッドで追加します。サイト全体に適用したい場合は、App
Controller の beforeFilter() に追加すると良いでしょう。

userModel
---------

認証に User
モデルを使いたくない場合は、この変数に使用するモデルの名前を与えてください。

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>

fields
------

認証で使うデフォルトのユーザ名(\ *username*)とパスワード(\ *password*)のフィールド名を上書きするために使います。

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>

userScope
---------

認証が成功するために必要な条件を追加するために使用します。

::

    <?php
        $this->Auth->userScope = array('User.active' => 'Y');
    ?>

loginAction
-----------

ログインを行うアクションをデフォルトの */users/login* から変更します。

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');
    ?>

loginRedirect
-------------

通常、 AuthComponent
は認証が実行されるまえのコントローラ/アクションのペアを記憶しており、認証が成功したらユーザをそこにリダイレクトします。しかし、この変数に特定のコントローラ/アクションのペアを定義することで、そこへ強制的にリダイレクトするようにできます。

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');
    ?>

logoutRedirect
--------------

デフォルトでは、ログアウト後にユーザは自動的にログインアクションへリダイレクトされます。
このリダイレクト先のアクションを定義できます。

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>

loginError
----------

ログインに失敗した時に表示されるデフォルトのエラーメッセージを変更できます。

::

    <?php
        $this->Auth->loginError = "あらら。パスワードが違いますよ。";
    ?>

authError
---------

誰かがアクセスしてはいけないオブジェクトあるいはアクションにアクセスしようとしたときに表示されるデフォルトのエラーメッセージを変更します。

::

    <?php
        $this->Auth->authError = "Sorry, you are lacking access.";
    ?>

autoRedirect
------------

通常、 AuthComponent
は認証を実行してすぐ、自動的にリダイレクトを実行します。しかしユーザをリダイレクトする前に、さらに何かをチェックしたいかもしれません。

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }

        ...

        function login() {
        //-- この関数に含まれるコードは、 autoRedirect が false にセットされている時、つまり beforeFilter でだけ動作します。
            if ($this->Auth->user()) {
                if (!empty($this->data)) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  この分岐では認証のメッセージをクリアしてください。
                        $this->Session->del('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>

このコードの login 関数は、beforeFilter で $autoRedirect を false
にセット\ *しない限り*\ 実行されません。この login
関数のコードは、認証が試みられた\ *後*\ だけに実行されます。ここはログインが成功したかどうか確定する最もよい場所です。(例えば、最終ログイン日時をログに記録するなど)

authorize
---------

通常、 AuthComponent
は入力されたログインのための情報を、ユーザモデル中のデータと比較することによって、認証するかどうか確かめようとします。しかし、認証の是非を確定するために追加の処理を行いたい時があります。この変数を何か別の値にすることで、この追加の処理を行うことができます。よくある例を次に示します。

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>

authorize 変数を「controller」にセットすると、コントローラ中に
isAuthorized()
というメソッドを追加する必要が出てきて、そのメソッドは認証が成功した後に実行されます。
このメソッドでは、追加的なチェックを行い、 true または false
を返すようにします。

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } else {
                    return false;
                }
            }

            return true;
        }
    ?>

このメソッドは、 User
モデルを用いた基本的な認証をパスした後に実行されることに注意してください。

::

    <?php
        $this->Auth->authorize = 'model';
    ?>

ACO
を利用する時など、コントローラ中での処理を行わない場合はどうすればよいのでしょうか？その場合、
authorize 変数を「model」にセットすることで、認証が使うモデル(例えば
User) 中の isAuthorized()
メソッドがコールされます。そのメソッドの中では、例えば次のようなことを行います。

::

    <?php
        class User extends AppModel {
            ...

            function isAuthorized($user, $controller, $action) {

                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>

sessionKey
----------

認証されたユーザが保存されている現在のレコードを保持するセッション配列キー名。

指定されない場合はデフォルトは "Auth" です。レコードは "Auth.{$userModel
名}" に保存されています。

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>

ajaxLogin
---------

Ajax あるいは Javascript
ベースの認証されたセッションを必要とする場合、この変数に、認証失敗もしくはセッション切れの時に表示したいビューエレメントの名前を設定してください。

CakePHP の他の項目と同じく、 AuthComponent についてのより詳しい情報は
`AuthComponent
class(英文) <https://api.cakephp.org/class/auth-component>`_
を参照してください。

authenticate
------------

デフォルトでは、AuthComponent
はパスワードをハッシュ化するためにコアユーティリティクラス ``Security``
の ``hash``
関数を使用します。しかし、もし必要であれば、\ ``hashPasswords``
という関数を持つクラスのオブジェクトを ``authenticate``
にセットすることで、独自の暗号化ロジックを使用するように設定することもできます。このプロパティは、ただのモデルではなくオブジェクトのインスタンスとして取得するために、\ ``$this->Auth->authenticate = ClassRegistry::init('ModelName');``
というようにセットするようにしてください。この関数は、基本的に独自の暗号化ロジックを使用してコンポーネントの
``hashPasswords``
関数の機能を置き換えます。どのように動作するかについてのより詳細な情報は、
API や関数自身のコードをチェックしてください。

actionPath
----------

If using action-based access control, this defines how the paths to
action ACO nodes is computed. If, for example, all controller nodes are
nested under an ACO node named 'Controllers', $actionPath should be set
to 'Controllers/'.
