# ACL を制御するシンプルなアプリケーション - パート2

## ACO の作成を自動化するツール

前述した通り、全てのコントローラとアクションを ACL にあらかじめ入力し、構築しておく方法はありません。
しかしながら、大きなアプリケーションにとてもたくさんのアクションがある場合、これを一々登録するというのは面倒です。

この目的のために、 [AclExtras](https://pieceofcake2.github.io/acl_extras/)
という名のとても便利なプラグインが存在します。
全ての ACO を生成するための使用方法を簡単に説明しましょう。

プラグインは Composer でインストールします。

``` bash
composer require pieceofcake2/acl_extras
```

スケルトンの `composer.json` には
[Composer でのプラグインのインストール](/ja/plugins/how-to-install-plugins#composer) で説明している
`installer-paths` の設定がすでにあるので、プラグインは `plugins/AclExtras/` にインストールされます。
次に、次に示すように `config/bootstrap.php` ファイル中でプラグインを有効にしてください:

``` php
// config/bootstrap.php
// ...
CakePlugin::load('AclExtras');
```

最後に CakePHP のコンソールで以下のコマンドを実行してください:

    bin/cake AclExtras.AclExtras aco_sync

全ての利用可能なコマンドについての完全な説明を次のようにして得ることができます:

    bin/cake AclExtras.AclExtras -h
    bin/cake AclExtras.AclExtras aco_sync -h

`acos` テーブルが埋め尽くされたら、アプリケーションのパーミッションを作成する作業に移りましょう。

## パーミッションの設定

パーミッションの設定は、ACO の作成と同様に自動化するための仕組みや、前節で示したような方法はありません。
ARO に対して ACO へのアクセスをシェルインターフェースを用いて許可するには、AclShell を使用してください。
使用方法の詳しい情報は、次を実行して見ることができる AclShell のヘルプを参照してください:

    bin/cake acl --help

注意: アスタリスクは「'\*'」というように、シングルクォーテーションで囲ってください

`AclComponent` を用いて許可を行うには、独自の方法の中で以下の文法のコード使います:

``` php
$this->Acl->allow($aroAlias, $acoAlias);
```

いくつかの「許可」「拒否」の指定を行ってみましょう。 `UsersController` の中に
一時的に利用する関数を作成し、ブラウザでそのアクションを実行するアドレス(例えば、
<http://localhost:8765/users/initDB>) へ接続してください。
`SELECT * FROM aros_acos` を実行すると、結果に 1 と -1 がたくさん含まれているはずです。
パーミッションがセットできたことを確認したら、作成した関数を削除してください:

``` php
public function beforeFilter()
{
    parent::beforeFilter();
    $this->Auth->allow('initDB'); //この行は終わったあと削除できます
}

public function initDB()
{
    $group = $this->User->Group;
    //管理者グループには全てを許可する
    $group->id = 1;
    $this->Acl->allow($group, 'controllers');

    //マネージャグループには posts と widgets に対するアクセスを許可する
    $group->id = 2;
    $this->Acl->deny($group, 'controllers');
    $this->Acl->allow($group, 'controllers/Posts');
    $this->Acl->allow($group, 'controllers/Widgets');

    //ユーザグループには posts と widgets に対する追加と編集を許可する
    $group->id = 3;
    $this->Acl->deny($group, 'controllers');
    $this->Acl->allow($group, 'controllers/Posts/add');
    $this->Acl->allow($group, 'controllers/Posts/edit');
    $this->Acl->allow($group, 'controllers/Widgets/add');
    $this->Acl->allow($group, 'controllers/Widgets/edit');
    //馬鹿げた「ビューが見つからない」というエラーメッセージを表示させないために exit を追加します
    echo 'all done';
    exit;
}
```

これで基本的なアクセスのルールがセットアップできました。管理者グループには全てのアクセスを
許可しており、 マネージャーグループは posts と widgets に対する完全なアクセスが行えます。
そしてユーザグループは posts と widgets に対する追加と編集のみ許可されています。

上述の例で ARO を指定するために `Group` モデルのリファレンスを取得し、その id を指定しました。
これにより `AclBehavior` が動作します。 `AclBehavior` は `aros` テーブルの
alias フィールドをセットしないので、ARO を参照するためにオブジェクトの参照か配列を使う必要が
あります。

ACL パーミッションから index アクションや view アクションをわざと省略したことに
気づいたかもしれません。こうすることで `PostsController` と `WidgetsController` にある
index と view は、public になります。権限を持たないユーザでもこれらのページを表示することを
可能にし、パブリックなページにします。とはいえ、いつでも `AuthComponent::allowedActions`
からそれらのアクションを削除することで、ACL での view と edit のパーミッションを
設定していない状態に戻すことができます。

さて、users と groups コントローラから `Auth->allowedActions` への参照を
取り外したいですね。その場合は、posts と widgets コントローラに次の行を追加しましょう:

``` php
public function beforeFilter()
{
    parent::beforeFilter();
    $this->Auth->allow('index', 'view');
}
```

これは users と groups コントローラに前もって設置されていた「スイッチオフ」の設定を取り除き、
posts と widgets コントローラの index および view アクションにパブリックなアクセスを
与えています。 `AppController::beforeFilter()` で以下を追加してください:

``` php
$this->Auth->allow('display');
```

これで「display」アクションはパブリックになります。PagesController::display() は
パブリックに維持されます。デフォルトのルーティングがアプリケーションのトップページとして
このアクションを持つことはよくあることで、これは重要です。

## ログイン

これでアプリケーションがアクセス制御下におかれましたので、パブリックでないページの表示に対する
アクセスはログインページにリダイレクトされるようになりました。
しかし、先にログインを行うまえに、それ用のビューを作成しなければなりません。
もし `templates/Users/login.ctp` をまだ作成していないなら、次のコードを設置してください:

``` php
<!-- templates/Users/login.ctp -->
<h2>Login</h2>
<?php
echo $this->Form->create('User', [
    'url' => [
        'controller' => 'users',
        'action' => 'login',
    ],
]);
echo $this->Form->input('User.username');
echo $this->Form->input('User.password');
echo $this->Form->end('Login');
```

ユーザーが既にログインしていたら、Users コントローラの `login()` アクションを次のように
書き換えてリダイレクトさせるようにしましょう:

``` php
public function login()
{
    if ($this->Auth->user()) {
        $this->Flash->success(__('You are logged in!'));

        return $this->redirect('/');
    }
    if ($this->request->is('post')) {
        if ($this->Auth->login()) {
            return $this->redirect($this->Auth->redirectUrl());
        }
        $this->Flash->error(__('Your username or password was incorrect.'));
    }
}
```

これでログインを行うことができ、全てが自動的にうまく機能するようになりました。
アクセスが拒否された時、レイアウト (`templates/Layouts/default.ctp`) に
`echo $this->Flash->render('auth');` を追加しておけば、認証メッセージが画面に表示されます。

## ログアウト

それではログアウトについて見ていきましょう。
先に、ログアウトの関数を空のままにしておきましたが、これを埋めていきます。
`UsersController::logout()` に次の行を追加してください:

``` php
$this->Flash->success(__('Good-Bye'));

return $this->redirect($this->Auth->logout());
```

これはフラッシュメッセージをセットし、Auth の logout メソッドを使用して
User をログアウトさせます。Auth の logout メソッドは基本的に Auth の Session キーを削除し、
リダイレクトすべきURLを返します。他のセッションデータを削除したい場合は、ここにコードを
追加してください。

## 最後に

これで認証とアクセス制御リストによってコントロールされたアプリケーションができました。
ユーザーのパーミッションは、グループに対して行われています。しかし、これらはユーザに対しても
同じ時に行うことができます。パーミッションの設定は、グローバルに行ったり、コントローラ単位や
アクション単位でも行えます。さらに、アプリケーションが拡大するにあたり ACO テーブルを簡単に拡張し、
再利用可能なコードのブロックを使うこともできます。
