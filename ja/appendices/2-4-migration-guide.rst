2.4移行ガイド
###################

CakePHP 2.4 は、2.3 の API の完全上位互換です。
このページでは、2.4 の変更と改善についてのアウトラインを紹介します。

コンソール
============

- ターミナルがカラーをサポートしていた場合、notice のメッセージに色が付くようになりました。
- ConsoleShell は非推奨となりました。


SchemaShell
-----------

- ``cake schema generate`` は ``--exclude`` パラメータをサポートしました。
- ``CAKEPHP_SHELL`` 定数は非推奨となりました。CakePHP 3.0 で廃止されます。



BakeShell
---------

- ``cake bake model`` は ``$behaviors`` をサポートしました。
  例えば、Tree ビヘイビアを追加した場合、テーブルから `lft` や `rght` 、
  `parent_id` のフィールドを探します。
  また、独自のビヘイビアをサポートするために ModelTask を拡張することができます。
- ビューやモデル、コントローラ、テストおよびフィクスチャの ``cake bake`` において、
  ファイルを強制的に上書きする ``-f`` もしくは ``--force`` パラメータがサポートされました。
- コアのタスクは、ヘルパーやコンポーネント、ビヘイビアと同じように
  エイリアス名を付けることができます。


FixtureTask
-----------

- ``cake bake fixture`` に ``--schema`` パラメータがサポートされました。
  スキーマのインポートする場合に、非対話型の "all" で全てのフィクスチャを bake することを許可します。


コア
======

Constants
---------

- ``IMAGES_URL`` 、 ``JS_URL`` 、 ``CSS_URL`` の各定数は非推奨となり、
  ``App.imageBaseUrl`` 、 ``App.jsBaseUrl`` 、 ``App.cssBaseUrl``
  のコンフィグ変数の利用が推奨されます。
- ``IMAGES`` 、 ``JS`` 、 ``CSS`` の各定数は非推奨となりました。


Object
------

- :php:meth:`Object::log()` に ``$scope`` パラメータが追加されました。


コンポーネント
================

AuthComponent
-------------
- AuthComponent は 'Basic' もしくは 'Digest' 認証を使ったステートレスなモードをサポートしました。
  :php:attr:`AuthComponent::$sessionKey` を false にすることで、
  セッションの開始を抑制することができます。
  'Basic' もしくは 'Digest' 認証のみを使った場合、
  ログインページに飛ばされることはなくなりました。
  更に詳しい情報は :php:class:`AuthComponent` ページを参照して下さい。
- :php:attr:`AuthComponent::$authError` プロパティを ``false`` にすることで、
  フラッシュメッセージを抑制することができます。


PasswordHasher
--------------
- 認証のオブジェクトは、パスワードのハッシュ値の生成やチェックに利用できる
  新しいパスワードハッシュオブジェクトを利用可能になりました。
  詳しくは :ref:`hashing-passwords` を参照して下さい。


DbAcl
-----

- DbAcl は ``LEFT`` ジョインではなく ``INNER`` ジョインを使用するようになりました。
  これによりいくつかのデータベースでのパフォーマンスが向上します。

モデル
========

Models
------

- :php:meth:`Model::save()` 、 :php:meth:`Model::saveField()` 、 :php:meth:`Model::saveAll()` 、
  :php:meth:`Model::saveAssociated()` 、 :php:meth:`Model::saveMany()` は
  新しく ``counterCache`` オプションを持つようになりました。
  この値を false にセットすることで特定の保存時にカウンタキャッシュの更新を抑制できます。
- :php:meth:`Model::clear()` が追加されました。



Datasource
----------

- Mysql と Postgres、SQLserver では、接続設定に 'settings' 配列が利用可能になりました。
  このキー・バリューペアは、コネクションの生成時に ``SET`` コマンドとして発行されます。
- Mysql ドライバが SSL オプションをサポートしました。

ビュー
========

JsonView
--------

- :php:class:`JsonView` に JSONP サポートが追加されました。
- ``_serialize`` キーは、シリアライズ値の改名をサポートしました。
- debug > 0 の場合 JSON は表示されます。


XmlView
-------

- ``_serialize`` キーは、シリアライズ値の改名をサポートしました。
- debug > 0 の場合 XML は表示されます。


HtmlHelper
----------

- :php:meth:`HtmlHelper::css()` 用の API が簡素化されました。
  2番めの引数として、オプションの配列を渡すことができます。
  オプション配列を渡した場合に ``rel`` アトリビュートのデフォルトは
  'stylesheet' となります。
- :php:meth:`HtmlHelper::link()` に新しく ``escapeTitle`` オプションが追加されました。
  エスケープ処理をリンクのタイトルだけにし、アトリビュートには影響を及ぼさないための
  オプションです。


TextHelper
----------

- :php:meth:`TextHelper::autoParagraph()` が追加されました。
  自動的に HTML の p タグを付与した形に変換します。

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::param()` が追加されました。
- 最初のページには ``/page:1`` や ``?page=1`` が含まれなくなりました。
  これは正規化や noindex 等の処置が必要になっていた複製コンテンツ問題に役立ちます。

FormHelper
----------

- :php:meth:`FormHelper::dateTime()` に ``round`` オプションが追加されました。
  ``up`` もしくは ``down`` をセットすることで、指定した方向に丸め処理が行われます。
  デフォルトは null で、 ``interval`` に従って四捨五入します。


ネットワーク
===============

CakeRequest
-----------

- :php:meth:`CakeRequest::param()` が追加されました。
- :php:meth:`CakeRequest::is()` はタイプの配列をサポートし、そのタイプにマッチしていた場合は
  true を返すように変更されました。
- 指定したタイプにマッチするリクエストがどうか判定する :php:meth:`CakeRequest::isAll()`
  が追加されました。

CakeResponse
------------

- リダイレクト用の location ヘッダを設定・取得する :php:meth:`CakeResponse::location()`
  が追加されました。

CakeEmail
---------

- email メッセージのログは ``email`` スコープをデフォルトで持つようになりました。
  もし、ログに email のコンテンツを含めたくなければ、ログの設定に ``email``
  のスコープを追加して下さい。
- :php:meth:`CakeEmail::emailPattern()` が追加されました。
  このメソッドは、緩いバリデーションルールの利用を許可します。
  これは、規格に合っていないアドレスを利用している特定の日本のホストにおいて有用です。
- :php:meth:`CakeEmail::attachments()` の ``data`` キーで、直接添付ファイルの
  コンテンツを指定することができるようになりました。
- 設定のデータがトランスポートクラスのデータと正しくマージされるようになりました。




HttpSocket
----------

- :php:meth:`HttpSocket::patch()` が追加されました。


I18n
====

L10n
----

- ギリシャ語のデフォルトロケールが ISO 639-3 で定義された ``ell`` になりました。
  ``gre`` はそのエイリアスです。これに伴いロケールのフォルダが変更となりました。
  （ `/Locale/gre/` から `/Locale/ell/` へ）
- ペルシア語のデフォルトロケールが ISO 639-3 で定義された ``fas`` になりました。
  ``per`` はそのエイリアスです。これに伴いロケールのフォルダが変更となりました。
  （ `/Locale/per/` から `/Locale/fas/` へ）
- サーミ語のデフォルトロケールが ISO 639-3 で定義された ``sme`` になりました。
  ``smi`` はそのエイリアスです。これに伴いロケールのフォルダが変更となりました。
  （ `/Locale/smi/` から `/Locale/sme/` へ）
- マケドニア語のデフォルトロケールが ISO 639-3 で定義された ``mkd`` になりました。
  ``mk`` はそのエイリアスです。これに伴い同様にロケールのフォルダが変更となりました。
- カタログコード ``in`` は削除され ``id`` になりました（インドネシア語）、
  ``e`` は削除され ``el`` になりました（ギリシア語）、
  ``n`` は削除され ``nl`` になりました（オランダ語）、
  ``p`` は削除され ``pl`` になりました（ポーランド語）、
  ``sz`` は削除され ``se`` になりました（サーミ語）。
- カザフスタン語がロケール ``kaz`` 、カタログコード ``kk`` で追加されました。
- グリーンランド語がロケール ``kal`` 、カタログコード ``kl`` で追加されました。
- 定数 ``DEFAULT_LANGUAGE`` は非推奨となり、代わりにコンフィグの ``Config.language`` を利用して下さい。

ログ
=======

- ログエンジンのコンフィグに ``Log`` サフィックスは不要になりました。
  FileLog エンジンを利用するには ``'engine' => 'File'`` と定義して下さい。
  これはコンフィグでエンジンを指定する方法を統一します（例えばキャッシュエンジンを見て下さい）
  注意: 例えばログエンジンとして ``DatabaseLogger`` のように ``Log`` サフィックスが
  付いていない名称を使っていた場合は、 ``DatabaseLog`` のようにクラス名を変更して下さい。
  また、末尾に2回もサフィックスが付くような ``SomeLogLog`` という名称も避けるべきです。


FileLog
-------

- :ref:`FileLog <file-log>` に ``size`` と ``rotate`` の2つの新たな設定オプションが追加されました。
- デバッグモードの場合で、ディレクトリが存在しなかった際には、不要なエラーを発生させないように
  自動的にディレクトリを作成します。


SyslogLog
---------

- 新しいログエンジンとして syslog へ吐き出す :ref:`SyslogLog <syslog-log>` が追加されました。


キャッシュ
============

FileEngine
----------

- デバッグモードの場合で、ディレクトリが存在しなかった際には、不要なエラーを発生させないように
  自動的にディレクトリを作成します。

ユーティリティ
================

General
-------

- CLI で実行した場合、 :php:func:`pr()` は HTML で出力しなくなりました。


Sanitize
--------

- ``Sanitize`` クラスは非推奨となりました。

Validation
----------

- :php:meth:`Validation::date()` が ``y`` と ``ym`` のフォーマットをサポートしました。
- カナダ用の :php:meth:`Validation::phone()` の国コードが ISO 3166（2文字コード）に統一させるために
  ``can`` から ``ca`` へ変更されました。

CakeNumber
----------

- 通貨 ``AUD`` と ``CAD`` と ``JPY`` が追加されました。
- ``GBP`` と ``EUR`` のシンボルは UTF-8 になりました。
  UTF-8 でないアプリケーションをアップグレードする場合、HTMLエンティティのシンボル
  （ ``&#163;`` と ``&#8364;`` ）を利用して ``$_currencies`` アトリビュートを
  アップデートしてください。
- :php:meth:`CakeNumber::currency()` に ``fractionExponent`` オプションが追加されました。


CakeTime
--------

- :php:meth:`CakeTime::isPast()` と :php:meth:`CakeTime::isFuture()` が追加されました。
- :php:meth:`CakeTime::timeAgoInWords()` に出力文字列をカスタマイズする2つの
  新しいオプションが追加されました。
  ``relativeString`` （デフォルト ``%s ago`` ）と ``absoluteString`` （デフォルト ``on %s`` ）


Xml
---

- :php:meth:`Xml::fromArray()` にうまくフォーマットされた XML を出力する
  ``pretty`` オプションが新たに追加されました。


エラー
========

ErrorHandler
------------

- 新しい設定オプションに特定の Exception のスキップを許可する ``skipLog`` が追加されました。
  ``Configure::write('Exception.skipLog', array('NotFoundException', 'ForbiddenException'));`` は、
  ``'Exception.log'`` が ``true`` の場合にこれらの例外を除外してロギングします。



ルーティング
==============

Router
------

- :php:meth:`Router::fullBaseUrl()` がコンフィグ値 ``App.fullBaseUrl`` と共に追加されました。
  これらは非推奨となった :php:const:`FULL_BASE_URL` の代わりに利用します。
- :php:meth:`Router::parse()` はクエリストリング引数をパースします。
