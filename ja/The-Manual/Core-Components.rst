主要なコンポーネント
####################

CakePHP
には組み込みのコンポーネントがいくつかあります。これらにより、よく使われるタスクをすぐに扱うことができます。

Acl

Acl コンポーネントはデータベースあるいは ini
ベースのアクセス制御リストを簡単に利用することを提供します。

Auth

認証(\ *auth*)コンポーネントはコントローラコールバックや ACL
、オブジェクトコールバックといった様々な認証プロセスを使用する認証システムを、簡単に扱うことを提供します。

Session

セッションコンポーネントはストレージから独立した PHP
のセッションのラッパーを提供します。

RequestHandler

リクエストハンドラを使うと、訪問者のリクエストをより詳しく見て、アプリケーションにコンテンツタイプやリクエストの情報を知らせることができます。

Security

セキュリティコンポーネントを使うと、より厳格なセキュリティのセットや
HTTP 認証の利用および管理を行うことができます。

Email

PHP の mail() や smtp
を含む、ひとつあるいは複数のメール転送エージェントを利用した電子メールの送信を行うことができます。

Cookie

クッキーコンポーネントは、PHP
ネイティブのクッキーサポートのラッパーを提供するという点において、
SessionComponent と似た振る舞いをします。

各コンポーネントについて詳しく知りたい場合はメニュー、あるいは\ `独自のコンポーネントを作成する方法 </ja/view/62/コンポーネント>`_\ を参照してください。


.. toctree::
    :maxdepth: 1

    Core-Components/Access-Control-Lists
    Core-Components/Authentication
    Core-Components/Cookies
    Core-Components/Email
    Core-Components/Request-Handling
    Core-Components/Security-Component
    Core-Components/Sessions