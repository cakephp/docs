CakePHP 概要
###################

CakePHPはウェブ開発を単純に簡単にできるように開発されました。 オールインワンの
ツールボックスは色々なパーツが一緒に動いたり、バラバラに動いたりできるようにします。

この概要は、一般的なコンセプトとそのコンセプトがどのように CakePHP の中で働くのかを紹介することです。
プロジェクトをすぐに始めたいなら、 :doc:`チュートリアルから始める </tutorials-and-examples/bookmarks/intro>`か
:doc:`直接ドキュメントを見て下さい</topics>`。

設定に影響する規約
==============================

CakePHPは基礎的な構造をクラス名、ファイル名、DBのテーブル名や他の規約から決定します。
規約を学ぶことで、不必要な設定や他の一般的なアプリと同じ構造をいちいち書かなくて済むので、
簡単に色々なプロジェクトを進められます。この :doc:`規約</intro/conventions>` は、
いろいろな CakePHP で使う規約をカバーしています。

モデル(*Model*)層(レイヤー）
=============================

モデル層はビジネスロジックを実装するアプリケーションの部品を表します。これはデータの検索、アプリケーションに意味のある形への変換、また処理、検証（*validating*）、関連(*associating*)、そしてデータを扱うことに関する様々なタスクに責任をもつことを意味します。

一見して、モデルオブジェクトはアプリケーションに使用しているであろうデータベースとやりとりする最初の層と見ることができるでしょう。
しかし、一般的にこれはアプリケーションを実装するものの主要な概念を表します。

ソーシャルネットワークのケースでは、モデル層はユーザのデータを保存する、友人の繋がりを保存する、ユーザの写真を保存または検索する、新しい友人の提案を検索する、等々のタスクを引き受けることでしょう。
このとき、モデルオブジェクトは「友達(*Friend*)」、「ユーザ(*User*)」、「コメント(*Comment*)」、「写真(*Photo*)」と考えることができます。
``users`` テーブルからデータを読みたかったら、::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

データを使って仕事をする前に一切コードを必ず書かなくてもよいことに気づくでしょう。
規約を使うことによって、CakePHP はまだ定義されていないテーブルとエンティティクラスのためのスタンダードクラスを使うようになります。

新しいユーザーを作ってバリデーションしてから保存したいなら、このようにします::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

ビュー(*View*)層(レイヤー）
=============================

ビューレイヤーは、モデルから来たデータをレンダリングします。ビューはモデルオブジェクトとは別に存在します。
そして、扱っている情報に対してレスポンシブルなアプリケーションが必要としている表示インターフェイスをすべて提供可能です。

例えば、このビューはHTMLかXMLとして他人が消費するための結果をモデルから送られてくるデータを利用してレンダリングできます。::

    // ビューファイルで 'element' をそれぞれのユーザーに対してレンダリングする
    <?php foreach ($users as $user): ?>
        <div class="user">
            <?= $this->element('user', ['user' => $user]) ?>
        </div>
    <?php endforeach; ?>

このビューレイヤーは :ref:`view-elements` や :doc:`/views/cells` のようなしくみで表示のためのロジックを再利用可能にして、
沢山の表示を拡張するための機能を提供します。

ビューレイヤーはHTMLやテキストのレンダリングを制御出来るだけではなく、一般的なJSONやXML、
加えてプラグインで追加可能なアーキテクチャによるフォーマットなら何にでも対応します。


コントローラ(*Controller*)層(レイヤー）
==========================================

コントローラ層はユーザからのリクエストを扱います。
これはモデル層とビュー層の助けを借りてレスポンスをレンダリングして返す責任を負います。

コントローラは、タスクを終える為の全ての必要とされるリソースが正しい労働者に委譲されることに注意を払うマネージャーと見ることができます。
クライアントからの要求を待ち、認証と承認のルールによる検証を行い、データの取得または処理をモデルに委譲し、クライアントが受け入れる適切な表示上のデータの種類を採択し、最終的にその描画処理をビュー層に委譲します。
例えば、ユーザー登録ではこのようになります。::

    public function add()
    {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('You are now registered.'));
            } else {
                $this->Flash->error(__('There were some problems.'));
            }
        }
        $this->set('user', $user);
    }

You may notice that we never explicitly rendered a view. CakePHP's conventions
will take care of selecting the right view and rendering it with the view data
we prepared with.
明示的にビューをレンダリングしないことに気付くかもしれません。 CakePHPは規約によって正しいビューを選択し、
``set()`` で用意ビューデータでそのビューをレンダリングします。

.. _request-cycle:

CakePHPのリクエスト循環
=======================

色々なレイヤーに親しんでいただきました。次は、リクエスト循環がどのように働くのか見て行きましょう:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Flow diagram showing a typical CakePHP request

典型的なCakePHPのリクエスト循環はユーザがアプリケーション内でページまたはリソースにリクエストを投げるところから始まります。  高位のそれぞれのリクエストは以下のステップで動きします:

#. ウェブサーバーが ``webroot/index.php`` へのリクエストを制御するルールを書き換えます。
#. アプリの autoloader と bootstrap ファイルが実行されます。
#. すべてのリクエストを扱い、追加オプションでレスポンスを生成するために設定されている :doc:`ディスパッチフィルター </developme    nt/dispatch-filters>`
#. ディスパッチャーが適切なコントローラーとアクションをルーティングルールに合わせて選択。
#. コントローラーのアクションが呼ばれ、コントローラーが要求されたモデルとコンポーネントと通信します。
#. コントローラーが出力を生成するためにレスポンスの生成をビューに委任します。
#. ビューがヘルパーとセルを使ってボディーとヘッダーを生成して返す。
#. クライアントにレスポンスが返る。

さっそく始めましょう
====================

この文章があなたの興味を惹くことを願っています。Cakeには他にもとてもいい特徴があります。:

* Memcache, Redis や他のバックエンドと統合された :doc:`キャッシュ </core-libraries/caching>` フレームワーク。
* 強力な :doc:`コード生成ツールbake</bake/usage>` ですぐに簡単なモックを作ってプロジェクトを始める。
* :doc:`統合されたテストフレームワーク </development/testing>` でコードが完璧に動いているか確かめられる。

次の明白なステップは :doc:`download CakePHP </installation>` で,
:doc:`チュートリアルとなにかすごいものを作る</tutorials-and-examples/bookmarks/intro>` を呼んで下さい。.

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
