# CakePHP 概要

CakePHP はウェブ開発を単純に簡単にできるように開発されました。 オールインワンの
ツールボックスは色々なパーツが一緒に動いたり、バラバラに動いたりできるようにします。

この概要の目的は、CakePHP の一般的なコンセプトとそのコンセプトがどのように CakePHP
の中で働くのかを紹介することです。 プロジェクトをすぐに始めたいなら、 [チュートリアルから始める](tutorials-and-examples/cms/installation) か [直接ドキュメントを見て下さい](topics) 。

## 設定より規約

CakePHP は基礎的な構造をクラス名、ファイル名、DB のテーブル名や他の規約から決定します。
規約を学ぶことで、不必要な設定や他の一般的なアプリと同じ構造をいちいち書かなくて済むので、
簡単に色々なプロジェクトを進められます。この [規約](intro/conventions) は、
いろいろな CakePHP で使う規約をカバーしています。

## モデル層

モデル層はビジネスロジックを実装するアプリケーションの部品を表します。アプリケーションにおいて
データを取得し、それを最初の意味ある形に変換する役割を担います。これには、加工、検証 (*validating*) 、
関連付け (*associating*) 、あるいはデータの処理に関係のあるその他のタスクが含まれます。

ソーシャルネットワークの場合では、モデル層はユーザーのデータの保存、友人の繋がりの保存、ユーザーの
写真の保管と取得、新しい友人候補の検出などのタスクを引き受けることでしょう。このとき、
モデルオブジェクトは「友達 (*Friend*)」、「ユーザー (*User*)」、「コメント (*Comment*)」、あるいは
「写真 (*Photo*)」と考えることができます。もし `users` テーブルからデータを読み出したいのであれば
次のようにできます。 :

``` php
use Cake\ORM\Locator\LocatorAwareTrait;

$users = $this->getTableLocator()->get('Users');
$resultset = $users->find()->all();
foreach ($resultset as $row) {
    echo $row->username;
}
```

データの処理を始める前に一切コードを書く必要がなかったことに気付いたかもしれません。
規約を使うことによって、CakePHP はテーブルとエンティティーのクラスを定義していない場合には
標準のクラスを使用します。

新しいユーザーを作成し、それを (検証して) 保存したい場合には次のようにします。 :

``` php
use Cake\ORM\Locator\LocatorAwareTrait;

$users = $this->getTableLocator()->get('Users');
$user = $users->newEntity(['email' => 'mark@example.com']);
$users->save($user);
```

## ビュー層

ビュー層は、モデルから来たデータをレンダリングします。ビューはモデルオブジェクトとは別に存在します。
そして、扱っている情報に対してレスポンシブルなアプリケーションが必要としている表示インターフェイスを
すべて提供可能です。

例えば、このビューはモデルのデータを利用して HTML ビューテンプレートや他で利用するための
XML 形式の結果をレンダリングできます。 :

``` php
// ビューテンプレートファイルで 'element' をそれぞれのユーザーに対してレンダリングする
<?php foreach ($users as $user): ?>
    <li class="user">
        <?= $this->element('user_info', ['user' => $user]) ?>
    </li>
<?php endforeach; ?>
```

このビュー層は [View Templates](views#view-templates) や [View Elements](views#view-elements) や [ビューセル](views/cells)
のようなしくみで表示のためのロジックを再利用可能にして、 沢山の表示を拡張するための機能を提供します。

ビュー層は HTML やテキストのレンダリングを制御出来るだけではなく、一般的な JSON や XML、
加えてプラグインで追加可能なアーキテクチャによるフォーマットなら何にでも対応します。

## コントローラーレイヤー

コントローラー層はユーザーからのリクエストを扱います。これはモデル層とビュー層の助けを借りてレスポンスを
レンダリングして返す責任を負います。

コントローラーは、タスクを終える為の全ての必要とされるリソースが正しいワーカーに委譲されることに注意を払う
マネージャーと見ることができます。
クライアントからの要求を待ち、認証と承認のルールによる検証を行い、データの取得または処理をモデルに委譲し、
クライアントが受け入れる適切な表示上のデータの種類を採択し、最終的にその描画処理をビュー層に委譲します。
例えば、ユーザー登録ではこのようになります。 :

``` php
public function add()
{
    $user = $this->Users->newEmptyEntity();
    if ($this->request->is('post')) {
        $user = $this->Users->patchEntity($user, $this->request->getData());
        if ($this->Users->save($user, ['validate' => 'registration'])) {
            $this->Flash->success(__('You are now registered.'));
        } else {
            $this->Flash->error(__('There were some problems.'));
        }
    }
    $this->set('user', $user);
}
```

明示的にビューをレンダリングしないことに気付くかもしれません。 CakePHP は規約によって正しいビューを選択し、
`set()` で用意したビューデータでそのビューをレンダリングします。

## CakePHP のリクエストサイクル

色々なレイヤーに親しんでいただきました。次は、リクエストサイクルがどのように働くのか見て行きましょう:

<figure class="align-center">
<img src="/typical-cake-request.png" alt="/_static/img/typical-cake-request.png" />
</figure>

典型的な CakePHP のリクエストサイクルはユーザーがアプリケーション内でページまたはリソースにリクエストを
投げるところから始まります。上位レベルの各リクエストは以下のステップを実行します。

1.  ウェブサーバーが **webroot/index.php** へのリクエストを制御するルールを書き換えます。
2.  あなたのアプリケーションがロードされ、 `HttpServer` にひも付きます。
3.  あなたのアプリケーションのミドルウェアが初期化されます。
4.  リクエストとレスポンスは、あなたのアプリケーションで使用する PSR-7 ミドルウェアを経由して
    ディスパッチされます。これは、一般的にエラートラップとルーティングを含みます。
5.  ミドルウェアからレスポンスが返らない場合やリクエストがルーティング情報を含む場合、
    コントローラーとアクションが選択されます。
6.  コントローラーのアクションが呼ばれ、コントローラーが要求されたモデルとコンポーネントと通信します。
7.  コントローラーが出力を生成するためにレスポンスの生成をビューに委任します。
8.  ビューがヘルパーとセルを使ってボディーとヘッダーを生成して返す。
9.  レスポンスは、 [ミドルウェア](controllers/middleware) を経由して送信されます。
10. `HttpServer` は、ウェブサーバーにレスポンスを送ります。

## さっそく始めましょう

この文章があなたの興味を惹くことを願っています。CakePHP には他にもとてもいい特徴があります。

- Memcached, Redis や他のバックエンドと統合された [キャッシュ](core-libraries/caching)
  フレームワーク。
- 強力な [コード生成ツール bake](bake/usage) ですぐに簡単なモックを作ってプロジェクトを始める。
- [統合されたテストフレームワーク](development/testing) でコードが完璧に動いているか確かめられる。

次の明白なステップは [download CakePHP](installation) で,
[チュートリアルとなにかすごいものを作る](tutorials-and-examples/cms/installation) を読んで下さい。

## 付録

- [情報の探し方](intro/where-to-get-help)
- [CakePHP の規約](intro/conventions)
- [CakePHP のフォルダー構成](intro/cakephp-folder-structure)
