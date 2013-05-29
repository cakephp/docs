ACLを制御するシンプルなアプリケーション - パート2
#################################################

ACOの作成を自動化するツール
===========================

前述した通り、全てのコントローラとアクションをACLにあらかじめ入力し、構築しておく方法はありません。
しかしながら、大きなアプリケーションにとてもたくさんのアクションがある場合、これを一々登録するというのは面倒です。

この目的のために、 `AclExtras <https://github.com/markstory/acl_extras/>`_
という名のとても便利なプラグインが存在し、
`Githubのダウンロードページ <https://github.com/markstory/acl_extras/zipball/master>`_ からダウンロードすることで、githubで入手することができます。
全てのACOを生成するための使用方法を簡単に説明しましょう。

まず、プラグインのコピーを入手し、 `app/Plugin/AclExtras`
に解凍、またはgitを用いて複製(*clone*)してください。
次に、次に示すように `app/Config/boostrap.php` ファイル中でプラグインを有効にしてください::

    //app/Config/boostrap.php
    // ...
    CakePlugin::load('AclExtras');

最後にCakePHPのコンソールで以下のコマンドを実行してください::


    ./Console/cake AclExtras.AclExtras aco_sync

全ての利用可能なコマンドについての完全な説明を次のようにして得ることができます::

    ./Console/cake AclExtras.AclExtras -h
    ./Console/cake AclExtras.AclExtras aco_sync -h

`acos` テーブルが埋め尽くされたら、アプリケーションのパーミッションを作成する作業に移りましょう。

パーミッションの設定
====================

パーミッションの設定は、ACOの作成と同様に自動化するための仕組みや、前節で示したような方法はありません。
AROに対してACOへのアクセスをシェルインターフェースを用いて許可するには、AclShellを使用してください。
使用方法の詳しい情報は、次を実行して見ることができるAclShellのヘルプを参照してください::

    ./Console/cake acl --help

注意: アスタリスクは「'\*'」というように、シングルクォーテーションで囲ってください

``AclComponent`` を用いて許可を行うには、独自の方法の中で以下の文法のコード使います::

    $this->Acl->allow($aroAlias, $acoAlias);

いくつかの「許可」「拒否」の指定を行ってみましょう。
``UsersController`` の中に一時的に利用する関数を作成し、ブラウザでそのアクションを実行するアドレス(例えば、
http://localhost/cake/app/users/initdb)へ接続してください。
``SELECT * FROM aros_acos`` を実行すると、結果に 1 と -1 がたくさん含まれているはずです。
パーミッションがセットできたことを確認したら、作成した関数を削除してください::

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('initDB'); //この行は終わったあと削除できます
    }

    public function initDB() {
        $group = $this->User->Group;
        //管理者グループには全てを許可する
        $group->id = 1;
        $this->Acl->allow($group, 'controllers');

        //マネージャグループにはpostsとwidgetsに対するアクセスを許可する
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');

        //ユーザグループにはpostsとwidgetsに対する追加と編集を許可する
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
        //馬鹿げた「ビューが見つからない」というエラーメッセージを表示させないためにexitを追加します
        echo "all done";
        exit;
    }

これで基本的なアクセスのルールがセットアップできました。
管理者グループには全てのアクセスを許可しており、 マネージャーグループはpostsとwidgetsに対する完全なアクセスが行えます。
そしてユーザグループはpostsとwidgetsに対する追加と編集のみ許可されています。

上述の例でAROを指定するために ``Group`` モデルのリファレンスを取得し、そのidを指定しました。
これにより ``AclBehavior`` が動作します。
``AclBehavior`` は ``aros`` テーブルのaliasフィールドをセットしないので、AROを参照するためにオブジェクトの参照か配列を使う必要があります。

ACLパーミッションからindexアクションやviewアクションをわざと省略したことに気づいたかもしれません。
これらは、 ``PostsController`` と ``WidgetsController`` において作成していきます。
これは許可されていないユーザもこれらのページを表示することを可能にし、パブリックなページにします。
とはいえ、いつでも ``AuthComponent::allowedActions`` からそれらのアクションを削除できますし、ACLの中にviewとeditのパーミッションを差し戻すこともできます。

さて、usersとgroupsコントローラから ``Auth->allowedActions`` への参照を取り外したいですね。
それが終わったら、postsとwidgetsコントローラに次の行を追加しましょう::

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

これは先にusersとgroupsコントローラに設置した「オフスイッチ」を取り除き、postsとwidgetsコントローラのindexおよびviewアクションにパブリックなアクセスを与えています。
``AppController::beforeFilter()`` で以下を追加してください::

     $this->Auth->allow('display');

これは「display」アクションをパブリックにし、PagesController::display()をパブリックに維持させます。
多くの場合、デフォルトのルーティングは、アプリケーションのホームページとしてこのアクションを持つので、これは重要です。

ログイン
========

これでアプリケーションがアクセス制御下におかれましたので、パブリックでないページの表示に対するアクセスはログインページにリダイレクトされるようになりました。
しかし、先にログインを行うまえに、それ用のビューを作成しなければなりません。
もし ``app/View/Users/login.ctp`` をまだ作成していないなら、次のコードを設置してください:

.. code-block:: php

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' => 'login')));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');
    ?>

ユーザーが既にログインしていたら、以下をUsersコントローラに追加してリダイレクトさせるようにしましょう::

    public function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            $this->redirect('/', null, false);
        }
    }

これでログインを行うことができ、全てが自動的にうまく機能するようになりました。
アクセスが拒否された時、 ``echo $this->Session->flash('auth')`` が追加されていれば、認証メッセージが画面に表示されます。

ログアウト
==========

それではログアウトについて見ていきましょう。
先に、ログアウトの関数を空のままにしておきましたが、これを埋めていきます。
``UsersController::logout()`` に次の行を追加してください::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

これはセッションフラッシュメッセージをセットし、Authのlogoutメソッドを使用してUserをログアウトさせます。
Authのlogoutメソッドは基本的にAuthのSessionキーを削除し、リダイレクトすべきURLを返します。
他のセッションデータを削除したい場合は、ここにコードを追加してください。

最後に
======

これで認証とアクセス制御リストによってコントロールされたアプリケーションができました。
ユーザーのパーミッションは、グループに対して行われています。
しかし、これらはユーザに対しても同じ時に行うことができます。
パーミッションの設定は、グローバルに行ったり、コントローラ単位やアクション単位でも行えます。
さらに、アプリケーションが拡大するにあたりACOテーブルを簡単に拡張し、再利用可能なコードのブロックを使うこともできます。
