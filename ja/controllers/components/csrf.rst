クロスサイトリクエストフォージェリ
##################################

CSRFコンポーネントを有効にすると、攻撃から防御することができます。
`CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ あるいはクロスサイトリクエストフォージェリは、ウェブアプリケーションの一般的な脆弱性です。
攻撃者がひとつ前のリクエストを捕捉あるいは再現したり、ときには異なるドメインの画像タグやリソースを使うことでデータを送信することもあります。

CsrfComponentはユーザのブラウザにクッキーを設定することで動作します。
フォームが :php:class:`Cake\\View\\Helper\\FormHelper` を用いて作成されている場合、hiddenフィールドにCSRFトークンが追加されます。
``Controller.startup`` イベントの間、もしリクエストがPOST, PUT, DELETE, PATCHリクエストの場合は、コンポーネントはリクエストデータとクッキーの値を比較します。
もし、どちらかがない場合、あるいは2つの値が一致しない場合は、コンポーネントは :php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException` を投げます。

.. note::
    副作用が起こる前に、HTTPメソッドが使われているかをいつも確かめてください。
    正しいHTTPメソッドが使用されているかを確認するために、 :ref:`HTTPメソッドを確認する <check-the-request>` または :php:meth:`Cake\\Network\\Request::allowMethod()` を使用してください。

.. versionadded:: 3.1

    例外の型が :php:class:`Cake\\Network\\Exception\\ForbiddenException` から :php:class:`Cake\\Network\\Exception\\InvalidCsrfTokenException` に変更されました。

Csrfコンポーネントを使用する
============================

コンポーネントの配列に ``CsrfComponent`` を加えるだけで、CSRFから防御されます。::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Csrf');
    }

コンポーネントの設置箇所で、コンポーネントに設定値を渡すことができます。
使用可能な設定オプションは以下の通りです。

- ``cookieName`` 送られるクッキーの名前です。デフォルトは ``csrfToken`` です。
- ``expiry`` CSRFトークンがどのくらい持続するかです。デフォルトはブラウザのセッションです。 3.1では ``strtotime`` の値も導入されました。
- ``secure`` クッキーがセキュアフラグを設定するかどうかです。クッキーはHTTPSコネクションにおいてのみ設定され、通常のHTTP上では失敗します。デフォルトは ``false`` です。
- ``field`` チェックするフォームのフィールドです。デフォルトは ``_csrfToken`` です。これを変更するときは、FormHelperの設定も必要になります。

有効にした場合、リクエストオブジェクトの現在のCSRFトークンにアクセスできます。::

    $token = $this->request->param('_csrfToken');

FormHelperと統合する
====================

Csrfコンポーネントは途切れることなく ``FormHelper`` と統合されます。
FormHelperでフォームを作成するたび、CSRFトークンを含むhiddenフィールドが挿入されます。

.. note::

    Csrfコンポーネントを使用するときは、フォームの開始には必ずFormHelperを利用してください。
    もし使わない場合、各フォームに手動でhiddenインプットを作成しなくてはならなくなります。

CSRFからの保護とAJAXリクエストについて
======================================

リクエストデータのパラメータの他に、CSRFトークンは特殊な ``X-CSRF-Token`` ヘッダで送信されます。
ヘッダを利用すると、JavaScriptを利用した重いアプリケーション、あるいはXML/JSONベースのAPIエンドポイントと
CSRFトークンとを統合しやすくなります。

特定のアクションでCSRFコンポーネントを無効にする
================================================

非推奨ですが、あるリクエストに対してCsrfコンポーネントを無効にしたいときがあるでしょう。
コントローラのイベントディスパッチャー、``beforeFilter()`` メソッドの中でこれを実現できます。::

    public function beforeFilter(Event $event)
    {
        $this->eventManager()->off($this->Csrf);
    }

.. meta::
    :title lang=ja: Csrf
    :keywords lang=ja: configurable parameters,security component,configuration parameters,invalid request,csrf,submission
