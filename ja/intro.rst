CakePHP 概要
############

CakePHP はウェブ開発を単純に簡単にできるように開発されました。 オールインワンの
ツールボックスは色々なパーツが一緒に動いたり、バラバラに動いたりできるようにします。

この概要の目的は、CakePHP の一般的なコンセプトとそのコンセプトがどのように CakePHP
の中で働くのかを紹介することです。 プロジェクトをすぐに始めたいなら、 :doc:`チュートリアルから始める
</tutorials-and-examples/cms/installation>` か :doc:`直接ドキュメントを見て下さい </topics>` 。

設定より規約
============

CakePHP は基礎的な構造をクラス名、ファイル名、DB のテーブル名や他の規約から決定します。
規約を学ぶことで、不必要な設定や他の一般的なアプリと同じ構造をいちいち書かなくて済むので、
簡単に色々なプロジェクトを進められます。この :doc:`規約 </intro/conventions>` は、
いろいろな CakePHP で使う規約をカバーしています。

モデル層
========

モデル層はビジネスロジックを実装するアプリケーションの部品を表します。これはデータの検索、
アプリケーションに意味のある形への変換、また処理、検証（*validating*）、関連(*associating*)、
そしてデータを扱うことに関する様々なタスクに責任をもつことを意味します。

一見して、モデルオブジェクトはアプリケーションに使用しているであろうデータベースとやりとりする
最初の層と見ることができるでしょう。
しかし、一般的にこれはアプリケーションを実装するものの主要な概念を表します。

ソーシャルネットワークのケースでは、モデル層はユーザーのデータを保存する、友人の繋がりを保存する、
ユーザーの写真を保存または検索する、新しい友人の提案を検索する、等々のタスクを引き受けることでしょう。
このとき、モデルオブジェクトは「友達(*Friend*)」、「ユーザー(*User*)」、「コメント(*Comment*)」、
「写真(*Photo*)」と考えることができます。 ``users`` テーブルからデータを読みたかったら、 ::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

データを使って仕事をする前に一切コードを必ず書かなくてもよいことに気づくでしょう。
規約を使うことによって、CakePHP はまだ定義されていないテーブルとエンティティークラスのための
スタンダードクラスを使うようになります。

新しいユーザーを作ってバリデーションしてから保存したいなら、このようにします::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

ビュー層
========

ビュー層は、モデルから来たデータをレンダリングします。ビューはモデルオブジェクトとは別に存在します。
そして、扱っている情報に対してレスポンシブルなアプリケーションが必要としている表示インターフェイスを
すべて提供可能です。

例えば、このビューはモデルのデータを利用して HTML ビューテンプレートや他で利用するための
XML 形式の結果をレンダリングできます。 ::

    // ビューテンプレートファイルで 'element' をそれぞれのユーザーに対してレンダリングする
    <?php foreach ($users as $user): ?>
        <li class="user">
            <?= $this->element('user_info', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

このビュー層は :ref:`view-templates` や :ref:`view-elements` や :doc:`/views/cells`
のようなしくみで表示のためのロジックを再利用可能にして、 沢山の表示を拡張するための機能を提供します。

ビュー層は HTML やテキストのレンダリングを制御出来るだけではなく、一般的な JSON や XML、
加えてプラグインで追加可能なアーキテクチャによるフォーマットなら何にでも対応します。


コントローラー層
================

コントローラー層はユーザーからのリクエストを扱います。これはモデル層とビュー層の助けを借りてレスポンスを
レンダリングして返す責任を負います。

コントローラーは、タスクを終える為の全ての必要とされるリソースが正しい労働者に委譲されることに注意を払う
マネージャーと見ることができます。
クライアントからの要求を待ち、認証と承認のルールによる検証を行い、データの取得または処理をモデルに委譲し、
クライアントが受け入れる適切な表示上のデータの種類を採択し、最終的にその描画処理をビュー層に委譲します。
例えば、ユーザー登録ではこのようになります。 ::

    public function add()
    {
        $user = $this->Users->newEntity();
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

明示的にビューをレンダリングしないことに気付くかもしれません。 CakePHP は規約によって正しいビューを選択し、
``set()`` で用意したビューデータでそのビューをレンダリングします。

.. _request-cycle:

CakePHP のリクエストサイクル
============================

色々なレイヤーに親しんでいただきました。次は、リクエストサイクルがどのように働くのか見て行きましょう:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request

典型的な CakePHP のリクエストサイクルはユーザーがアプリケーション内でページまたはリソースにリクエストを
投げるところから始まります。高位のそれぞれのリクエストは以下のステップで動きします:

#. ウェブサーバーが **webroot/index.php** へのリクエストを制御するルールを書き換えます。
#. あなたのアプリケーションがロードされ、 ``HttpServer`` にひも付きます。
#. あなたのアプリケーションのミドルウェアが初期化されます。
#. リクエストとレスポンスは、あなたのアプリケーションで使用する PSR-7 ミドルウェアを経由して
   ディスパッチされます。これは、一般的にエラートラップとルーティングを含みます。
#. ミドルウェアからレスポンスが返らない場合やリクエストがルーティング情報を含む場合、
   コントローラーとアクションが選択されます。
#. コントローラーのアクションが呼ばれ、コントローラーが要求されたモデルとコンポーネントと通信します。
#. コントローラーが出力を生成するためにレスポンスの生成をビューに委任します。
#. ビューがヘルパーとセルを使ってボディーとヘッダーを生成して返す。
#. レスポンスは、 :doc:`/controllers/middleware` を経由して送信されます。
#. ``HttpServer`` は、ウェブサーバーにレスポンスを送ります。

さっそく始めましょう
====================

この文章があなたの興味を惹くことを願っています。CakePHP には他にもとてもいい特徴があります。:

* Memcached, Redis や他のバックエンドと統合された :doc:`キャッシュ </core-libraries/caching>`
  フレームワーク。
* 強力な :doc:`コード生成ツール bake </bake/usage>` ですぐに簡単なモックを作ってプロジェクトを始める。
* :doc:`統合されたテストフレームワーク </development/testing>` でコードが完璧に動いているか確かめられる。

次の明白なステップは :doc:`download CakePHP </installation>` で,
:doc:`チュートリアルとなにかすごいものを作る
</tutorials-and-examples/cms/installation>` を読んで下さい。.

付録
====

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=ja: はじめに
    :keywords lang=ja: folder structure,table names,initial request,database table,organizational structure,rst,filenames,conventions,mvc,web page,sit, ファイル構造, テーブル名, ファイル名,
