クロスサイトリクエストフォージェリ
##################################

CSRF コンポーネントを有効にすると、攻撃から防御することができます。 `CSRF
<http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ あるいは
クロスサイトリクエストフォージェリは、ウェブアプリケーションの一般的な脆弱性です。
攻撃者がひとつ前のリクエストを捕捉あるいは再現したり、ときには異なるドメインの画像タグや
リソースを使うことでデータを送信することもあります。

CsrfComponent はユーザーのブラウザーにクッキーを設定することで動作します。
フォームが :php:class:`Cake\\View\\Helper\\FormHelper` を用いて作成されている場合、
hidden フィールドに CSRF トークンが追加されます。 ``Controller.startup`` イベントの間、
もしリクエストが POST, PUT, DELETE, PATCH リクエストの場合は、
コンポーネントはリクエストデータとクッキーの値を比較します。
もし、どちらかがない場合、あるいは2つの値が一致しない場合は、コンポーネントは
:php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException` を投げます。

.. note::
    副作用が起こる前に、HTTP メソッドが使われているかをいつも確かめてください。
    正しい HTTP メソッドが使用されているかを確認するために、 :ref:`HTTP メソッドを確認する
    <check-the-request>` または :php:meth:`Cake\\Http\\ServerRequest::allowMethod()`
    を使用してください。

.. versionadded:: 3.1

    例外の型が :php:class:`Cake\\Network\\Exception\\ForbiddenException` から
    :php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException` に変更されました。

.. deprecated:: 3.5.0
    ``CsrfComponent`` の代わりに :ref:`csrf-middleware` を使用してください。

CsrfComponent を使用する
============================

コンポーネントの配列に ``CsrfComponent`` を加えるだけで、CSRF から防御されます。 ::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
    }

コンポーネントの設置箇所で、コンポーネントに設定値を渡すことができます。
使用可能な設定オプションは以下の通りです。

- ``cookieName`` 送られるクッキーの名前です。デフォルトは ``csrfToken`` です。
- ``expiry`` CSRF トークンがどのくらい持続するかです。デフォルトはブラウザーのセッションです。
  3.1 では ``strtotime`` の値も導入されました。
- ``secure`` クッキーがセキュアフラグを設定するかどうかです。
  クッキーは HTTPS コネクションにおいてのみ設定され、通常の HTTP 上では失敗します。
  デフォルトは ``false`` です。
- ``field`` チェックするフォームのフィールドです。デフォルトは ``_csrfToken`` です。
  これを変更するときは、FormHelper の設定も必要になります。

有効にした場合、リクエストオブジェクトの現在の CSRF トークンにアクセスできます。 ::

    $token = $this->request->getParam('_csrfToken');

FormHelper と統合する
=====================

CsrfComponent は途切れることなく ``FormHelper`` と統合されます。
FormHelper でフォームを作成するたび、CSRF トークンを含む hidden フィールドが挿入されます。

.. note::

    CsrfComponent を使用するときは、フォームの開始には必ず FormHelper を利用してください。
    もし使わない場合、各フォームに手動で hidden 入力を作成しなくてはならなくなります。

CSRF からの保護と AJAX リクエストについて
=========================================

リクエストデータのパラメーターの他に、CSRF トークンは特殊な ``X-CSRF-Token`` ヘッダーで送信されます。
ヘッダーを利用すると、JavaScript を利用した重いアプリケーション、あるいは XML/JSON ベースの
API エンドポイントと CSRF トークンとを統合しやすくなります。

特定のアクションで CSRF コンポーネントを無効にする
==================================================

非推奨ですが、あるリクエストに対して CsrfComponent を無効にしたいときがあるでしょう。
コントローラーのイベントディスパッチャー、 ``beforeFilter()`` メソッドの中でこれを実現できます。 ::

    public function beforeFilter(Event $event)
    {
        $this->eventManager()->off($this->Csrf);
    }

.. meta::
    :title lang=ja: Csrf
    :keywords lang=ja: configurable parameters,security component,configuration parameters,invalid request,csrf,submission
