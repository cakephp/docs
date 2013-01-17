2.1 移行ガイド
###################

..
  CakePHP 2.1 is a fully API compatible upgrade from 2.0.  This page outlines the
  changes and improvements made for 2.1.

CakePHP 2.1 は、2.0 の API の完全上位互換です。
このページでは、2.1 の変更と改善についてのアウトラインを紹介します。


AppController, AppHelper, AppModel および AppShell
===================================================

..
  These classes are now required to be part of the app directory, as they were
  removed from the CakePHP core.  If you do not already have these classes, you
  can use the following while upgrading::

これらのクラスは App ディレクトリの一部として必要になりました。CakePHP
のコアからは削除されています。もし、これらのクラスを利用していなかった
場合は、次のような方法でアップグレードすることができます。::

    // app/View/Helper/AppHelper.php
    App::uses('Helper', 'View');
    class AppHelper extends Helper {
    }

    // app/Model/AppModel.php
    App::uses('Model', 'Model');
    class AppModel extends Model {
    }

    // app/Controller/AppController.php
    App::uses('Controller', 'Controller');
    class AppController extends Controller {
    }

    // app/Console/Command/AppShell.php
    App::uses('Shell', 'Console');
    class AppShell extends Shell {
    }

..
  If your application already has these files/classes you don't need to do
  anything.
  Additionally if you were using the core PagesController, you would need to copy
  this to your app/Controller directory as well.

もし、あなたのアプリケーションが既にこれらのファイルやクラスを利用して
いた場合には、特に何もする必要はありません。
その他、コアの PagesController を利用していた場合には、このファイルを
app/Controller ディレクトリへコピーする必要があります。


.htaccess ファイル
==================

.. 
  The default ``.htaccess`` files have changed, you should remember to update them
  or update your webservers URL re-writing scheme to match the changes done in
  ``.htaccess``

デフォルトの ``.htaccess`` ファイルが変わっていますので、このファイルを
アップデートするか、Web サーバの URL 書き換え機能を ``.htaccess`` の変
更に合わせてアップデートことを忘れないようにしてください。


モデル
======

..
  - The ``beforeDelete`` callback will be fired before behaviors beforeDelete callbacks.
    This makes it consistent with the rest of the events triggered in the model layer.
  - ``Model::find('threaded')`` now accepts ``$options['parent']`` if using other field
    then ``parent_id``. Also if the model has TreeBehavior attached and set up with other
    parent field, the threaded find will by default use that.
  - Parameters for queries using prepared statements will now be part of the SQL
    dump.
  - Validation arrays can now be more specific with when a field is required.
    The ``required`` key now accepts ``create`` and ``update``.  These values will
    make a field required when creating or updating.
  - Model now has a ``schemaName`` property.  If your application switches
    datasources by modifying :php:attr:`Model::$useDbConfig` you should also
    modify ``schemaName`` or use :php:meth:`Model::setDataSource()` method which
    handles this for you.

- ``beforeDelete`` コールバックは、ビヘイビアの beforeDelete コールバッ
  クより前に実行されます。これはモデルレイヤでの他のイベントとの動きと
  一貫したものになります。

- ``Model::find('threaded')`` では、 ``parent_id`` 以外のフィールドを使
  えるように ``$options['parent']`` が利用可能になりました。もちろん、
  モデルが TreeBehavior をアタッチし、他の親フィールドを利用している場
  合には、threaded 検索はデフォルトでそのフィールドを利用します。

- プリペアード・ステートメントで利用するクエリのパラメータは SQL ダンプ
  の一部となりました。

- バリデーション配列は、フィールドの必要性をより明確に指定できるようになりました。
  ``required`` キーは ``create`` と ``update`` の値を持つことができます。
  これらの値は、作成時と更新時のそれぞれでフィールドの値の必要性を定義できます。

- モデルには ``schemaName`` プロパティが加わりました。もし、あなたの
  アプリケーションが :php:attr:`Model::$useDbConfig` を修正して、データソース
  を切り替えた場合、 ``schemaName`` も修正することができます。もしくは、
  :php:meth:`Model::setDataSource()` メソッドを使っても変更可能です。


CakeSession
-----------

..
  .. versionchanged:: 2.1.1
      CakeSession no longer sets the P3P header, as this is the responsibity of your application.
      More info see ticket `#2515 <http://cakephp.lighthouseapp.com/projects/42648/tickets/2515-cakephp-20-session-p3p-header-doesnt-work-in-an-iframe>`_ in lighthouse

.. versionchanged:: 2.1.1
   CakeSession は P3P ヘッダをセットしなくなりました。このことは、あな
   たのアプリケーションの動作に変化でる場合があります。
   更に詳しい情報は lighthouse にある次のチケットを参照してください。    
   `#2515 <http://cakephp.lighthouseapp.com/projects/42648/tickets/2515-cakephp-20-session-p3p-header-doesnt-work-in-an-iframe>`_

ビヘイビア
===========

TranslateBehavior
-----------------

..
  - :php:class:`I18nModel` has been moved into a separate file.

- :php:class:`I18nModel` は、複数のファイルに分割されました。


例外（Exceptions）
==================

..
  The default exception rendering now includes more detailed stack traces
  including file excerpts and argument dumps for all functions in the stack.

デフォルトの例外（Exception）は、スタック中の全ての関数の引数のダンプと
ファイルの抜粋を含んだスタックトレースを出力するようになりました。

ユーティリティ
==============

デバッガ
--------

..
  - :php:func:`Debugger::getType()` has been added.  It can be used to get the type of
    variables.
  - :php:func:`Debugger::exportVar()` has been modified to create more readable
    and useful output.

- :php:func:`Debugger::getType()` が追加されました。これは変数の型を取得します。

- :php:func:`Debugger::exportVar()` がより読みやすく使いやすい出力が出来るように修正されました。


debug()
-------

..
  `debug()` now uses :php:class:`Debugger` internally.  This makes it consistent
  with Debugger, and takes advantage of improvements made there.

``debug()`` は内部で :php:class:`Debugger` クラスを利用するようになりました。
これはデバッガとしての辻褄があいますし、よりよいものにするためのアドバンテージをもたらします。


Set
---

..
  - :php:func:`Set::nest()` has been added. It takes in a flat array and returns a nested array

- :php:func:`Set::nest()` が追加されました。フラットな配列をネストされた配列として返します。


File
----

..
  - :php:meth:`File::info()` includes filesize & mimetype information.
  - :php:meth:`File::mime()` was added.

- :php:meth:`File::info()` がファイルサイズと MIME タイプも返すようになりました。
- :php:meth:`File::mime()` が追加されました。


Cache
-----

..
   - :php:class:`CacheEngine` has been moved into a separate file.

- :php:class:`CacheEngine` は複数のファイルに分割されました。



Configure
---------

..
  - :php:class:`ConfigReaderInterface` has been moved into a separate file.

- :php:class:`ConfigReaderInterface` は複数のファイルに分割されました。


App
---

..
  - :php:meth:`App::build()` now has the ability to register new packages using
    ``App::REGISTER``. See :ref:`app-build-register` for more information.
  - Classes that could not be found on configured paths will be searched inside
    ``APP`` as a fallback path.  This makes autoloading nested directories in
    ``app/Vendor`` easier.

- :php:meth:`App::build()` は ``App::REGISTER`` を利用して新しいパッケージを追加することができるようになりました。 より詳しい情報は :ref:`app-build-register` を参照してください。
- 設定されたパスの中で見つからないクラスは ``APP`` を代替パスとして検索します。
  これは ``app/Vendor`` 内でディレクトリがネストしている場合などにオートロードを簡易にします。


コンソール
==========

Test Shell
----------

..
  A new TestShell has been added. It reduces the typing required to run unit
  tests, and offers a file path based UI::

新しい TestShell が追加されました。ユニットテストを実行するために必要な
タイプ数を軽減したり、ファイルパスベースの UI を提供します。 ::

    ./Console/cake test app Model/Post
    ./Console/cake test app Controller/PostsController
    ./Console/cake test Plugin View/Helper/MyHelper

..
  The old testsuite shell and its syntax are still available.

古いテストスイートのシェルとその記法もまだ存在しています。


General
-------

..
  - Generated files no longer contain timestamps with the generation datetime.

- 作成されたファイルは、作成された日時のタイムスタンプをもう含んでいません。

ルーティング
=============

Router
------

.. 
  - Routes can now use a special ``/**`` syntax to include all trailing arguments
    as a single passed argument. See the section on :ref:`connecting-routes` for
    more information.
  - :php:meth:`Router::resourceMap()` was added.
  - :php:meth:`Router::defaultRouteClass()` was added. This method allows you to
    set the default route class used for all future routes that are connected.

- Route 機能は特別な ``/**`` の書き方が利用できるようになりました。全て
  の引数を単一の引数のように扱えます。詳しくは
  :ref:`connecting-routes` セクションを確認してください。

- :php:meth:`Router::resourceMap()` が追加されました。

- :php:meth:`Router::defaultRouteClass()` が追加されました。このメソッ
  ドは、これより先に接続する全てのデフォルトの route クラスを設定できます。


ネットワーク
============

CakeRequest
-----------

..
  - Added ``is('requested')`` and ``isRequested()`` for detecting requestAction.

- requestAction を判定するための ``is('requested')`` と ``isRequested()`` が追加されました。

CakeResponse
------------

..
  - Added :php:meth:`CakeResponse::cookie()` for setting cookies.
  - Added a number of methods for :ref:`cake-response-caching`

- Cookie をセットするための :php:meth:`CakeResponse::cookie()` が追加されました。
- :ref:`cake-response-caching` 用の沢山のメソッドが追加されました。

コントローラ
==============

Controller
----------

..
  - :php:attr:`Controller::$uses` was modified the default value is now ``true``
    instead of false.  Additionally different values are handled slightly
    differently, but will behave the same in most cases.
  
      - ``true`` Will load the default model and merge with AppController.
      - An array will load those models and merge with AppController.
      - An empty array will not load any models other than those declared in the
        base class.
      - ``false`` will not load any models, and will not merge with the base class
        either.


- :php:attr:`Controller::$uses` はデフォルトが false ではなく ``true`` に変更となりました。
  その他、この変更については値により少しの違いがありますが、ほとんどの場合はこれまでと同じ動きをします。

    - ``true`` を指定した場合、デフォルトのモデルを読み込み、AppController へマージします。
    - 配列を指定した場合、そこにあるモデルを読み込み、AppController へマージします。
    - 空の配列を指定した場合、ベースのクラスで宣言されたもの以外のモデルを読み込みません。
    - ``false`` を指定した場合、ベースのクラスで宣言されたものを含め、どのモデルも読み込みません。


コンポーネント
===============

AuthComponent
-------------

..
  - :php:meth:`AuthComponent::allow()` no longer accepts ``allow('*')`` as a wildcard
    for all actions.  Just use ``allow()``.  This unifies the API between allow()
    and deny().
  - ``recursive`` option was added to all authentication adapters. Allows you to
    more easily control the associations stored in the session.

- :php:meth:`AuthComponent::allow()` では、全てのアクションを許可する
  ``allow('*')`` のようなワイルドカードは使わなくなりました。
  代わりに ``allow()`` を使ってください。
  これは allow() と deny() とで共通した API となります。

- 全ての認証用アダプタに ``recursive`` オプションが追加されました。セッ
  ションに格納されたアソシエーションをより用意にコントロールすることが
  できるようになりました。


AclComponent
------------

..
  - :php:class:`AclComponent` no longer lowercases and inflects the classname used for
    ``Acl.classname``.  Instead it uses the provided value as is.
  - Acl backend implementations should now be put in ``Controller/Component/Acl``.
  - Acl implementations should be moved into the Component/Acl directory from
    Component.  For example if your Acl class was called ``CustomAclComponent``,
    and was in ``Controller/Component/CustomAclComponent.php``.
    It should be moved into ``Controller/Component/Acl/CustomAcl.php``, and be
    named ``CustomAcl``.
  - :php:class:`DbAcl` has been moved into a separate file.
  - :php:class:`IniAcl` has been moved into a separate file.
  - :php:class:`AclInterface` has been moved into a separate file.

- :php:class:`AclComponent` は、 ``Acl.classname`` で使う場合に小文字お
  よび複数形ではなくなりました。

- Acl バックエンドの実装は ``Controller/Component/Acl`` へ置かれるよう
  になりました。

- Acl の実装は Component ディレクトリから Component/Acl ディレクトリへ
  移動されました。例えば、
  ``Controller/Component/CustomAclComponent.php`` に保存していた
  ``CustomAclComponent`` という名前の独自 Acl クラスを使っていたとしま
  す。これは ``Controller/Component/Acl/CustomAcl.php`` へ移動します。
  また、名称を ``CustomAcl`` へ変更します。

- :php:class:`DbAcl` は、単独のファイルに分割されました。
- :php:class:`IniAcl` は、単独のファイルに分割されました。
- :php:class:`AclInterface` は、単独のファイルに分割されました。


ヘルパー
=========

TextHelper
----------

..
  - :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
    :php:meth:`TextHelper::autoLinkEmails()` now HTML escape their input by
    default.  You can control this with the ``escape`` option.

- :php:meth:`TextHelper::autoLink()` と
  :php:meth:`TextHelper::autoLinkUrls()` 、
  :php:meth:`TextHelper::autoLinkEmails()` は、デフォルトで HTML のエス
  ケープを行なうようになりました。
  ``escape`` オプションにより、動作をコントロールできます。


HtmlHelper
----------

..
  - :php:meth:`HtmlHelper::script()` had a ``block`` option added.
  - :php:meth:`HtmlHelper::scriptBlock()` had a ``block`` option added.
  - :php:meth:`HtmlHelper::css()` had a ``block`` option added.
  - :php:meth:`HtmlHelper::meta()` had a ``block`` option added.
  - The ``$startText`` parameter of :php:meth:`HtmlHelper::getCrumbs()` can now be
    an array.  This gives more control and flexibility over the first crumb link.
  - :php:meth:`HtmlHelper::docType()` now defaults to html5.
  - :php:meth:`HtmlHelper::image()` now has a ``fullBase`` option.
  - :php:meth:`HtmlHelper::media()` has been added.  You can use this method to
    create HTML5 audio/video elements.
  - :term:`plugin syntax` support has been added for
    :php:meth:`HtmlHelper::script()`, :php:meth:`HtmlHelper::css()`, :php:meth:`HtmlHelper::image()`.
    You can now easily link to plugin assets using ``Plugin.asset``.
  - :php:meth:`HtmlHelper::getCrumbList()` had the ``$startText`` parameter added.


- :php:meth:`HtmlHelper::script()` に ``block`` が追加されました。
- :php:meth:`HtmlHelper::scriptBlock()` に ``block`` が追加されました。
- :php:meth:`HtmlHelper::css()` に ``block`` が追加されました。
- :php:meth:`HtmlHelper::meta()` に ``block`` が追加されました。
- :php:meth:`HtmlHelper::getCrumbs()` の `$startText`` パラメータに配列が利用できるようになりました。
  これは最初のパンくずリンクにより多くのコントロールと柔軟性を与えます。
- :php:meth:`HtmlHelper::docType()` はデフォルトで　HTML5 となりました。
- :php:meth:`HtmlHelper::image()` に ``fullBase`` オプションが追加されました。
- :php:meth:`HtmlHelper::media()` が追加されました。
  このメソッドを使って、 HTML5 の audio/video エレメントを作成することができます。
- :php:meth:`HtmlHelper::script()` と :php:meth:`HtmlHelper::css()` 、
  :php:meth:`HtmlHelper::image()` に :term:`プラグイン記法` がサポートされました。
  ``Plugin.asset`` を利用し、より用意にプラグインへのリンクが作成できます。
- :php:meth:`HtmlHelper::getCrumbList()` に ``$startText`` が追加されました。


ビュー
=======

..
  - :php:attr:`View::$output` is deprecated.
  - ``$content_for_layout`` is deprecated.  Use ``$this->fetch('content');``
    instead.
  - ``$scripts_for_layout`` is deprecated.  Use the following instead::
  
          echo $this->fetch('meta');
          echo $this->fetch('css');
          echo $this->fetch('script');
  
    ``$scripts_for_layout`` is still available, but the :ref:`view blocks <view-blocks>` API
    gives a more extensible & flexible replacement.
  - The ``Plugin.view`` syntax is now available everywhere.  You can use this
    syntax anywhere you reference the name of a view, layout or element.
  - The ``$options['plugin']`` option for :php:meth:`~View::element()` is
    deprecated.  You should use ``Plugin.element_name`` instead.

  
- :php:attr:`View::$output` は推奨されません。
- ``$content_for_layout`` は推奨されません。
  代わりに ``$this->fetch('content');`` を利用してください。

- ``$scripts_for_layout`` は推奨されません。代わりに下記の記述を利用してください。 ::

        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');

  ``$scripts_for_layout`` は、まだ存在しています。
  しかし、 :ref:`view blocks <view-blocks>` API 方が拡張性や柔軟性をもたらします。

- ``Plugin.view`` シンタックスがどこでも使えるようになりました。ビュー
  やレイアウト、エレメントの名前を参照したい際に、どこでもこのシンタッ
  クスを利用できます。

- :php:meth:`~View::element()` の ``$options['plugin']`` オプションは推奨されません。
  代わりに ``Plugin.element_name`` を利用してください。


Content type views
------------------

..
  Two new view classes have been added to CakePHP.  A new :php:class:`JsonView`
  and :php:class:`XmlView` allow you to easily generate XML and JSON views.  You
  can learn more about these classes in the section on
  :doc:`/views/json-and-xml-views`

CakePHP に2つのビュークラスが追加されました。新しい
:php:class:`JsonView` と :php:class:`XmlView` は、XML と JSON ビューの
作成を用意にしてくれます。これらのクラスについては、
:doc:`/views/json-and-xml-views` セクションで詳しく学べます。


Extending views
---------------

..
  :php:class:`View` has a new method allowing you to wrap or 'extend' a
  view/element/layout with another file.  See the section on
  :ref:`extending-views` for more information on this feature.

:php:class:`View` クラスには、ビューやエレメント、レイアウトを別のファイ
ルでラップしたり拡張したりするための新しいメソッドが加わりました。
この機能の更に詳しい内容は :ref:`extending-views` セクションを参照してください。


Themes
------

..
  The ``ThemeView`` class is deprecated in favor of the ``View`` class. Simply
  setting ``$this->theme = 'MyTheme'`` will enable theme support, and all custom
  View classes which extend from ``ThemeView`` should extend ``View``.

``View`` クラスの代わりの ``ThemeView`` クラスは推奨されません。シンプ
ルに ``$this->theme = 'MyTheme'`` のようにセットすることで、テーマのサ
ポートができます。また、 ``ThemeView`` を継承した全てのカスタムビューク
ラスは ``View`` を継承するようにしてください。


View blocks
-----------

..
  View blocks are a flexible way to create slots or blocks in your views.  Blocks
  replace  ``$scripts_for_layout`` with a more robust and flexible API.  See the
  section on :ref:`view-blocks` for more information.

ビューブロックは、ビューのパーツやブロックの作成に柔軟性をもたらします。
ブロックは ``$scripts_for_layout`` の強力かつ柔軟な代替 API です。
より詳しいことは :ref:`view-blocks` を参照してください。


ヘルパー
=========

New callbacks
-------------

..
  Two new callbacks have been added to Helpers.
  :php:meth:`Helper::beforeRenderFile()` and :php:meth:`Helper::afterRenderFile()`
  these new callbacks are fired before/after every view fragment is rendered.
  This includes elements, layouts and views.

2つの新しいコールバックがヘルパーに追加されました。
新しい :php:meth:`Helper::beforeRenderFile()` と
:php:meth:`Helper::afterRenderFile()` は、エレメントやレイアウト、ビューが
レンダリングされる前と後とに呼ばれます。


CacheHelper
-----------

..
  - ``<!--nocache-->`` tags now work inside elements correctly.

- エレメントの中に記述された ``<!--nocache-->`` タグが正しく動作するようになりました。


FormHelper
----------

..
  - FormHelper now omits disabled fields from the secured fields hash. This makes
    working with :php:class:`SecurityComponent` and disabled inputs easier.
  - The ``between`` option when used in conjunction with radio inputs, now behaves
    differently. The ``between`` value is now placed between the legend and first
    input elements.
  - The ``hiddenField`` option with checkbox inputs can now be set to a specific
    value such as 'N' rather than just 0.
  - The ``for`` attribute for date + time inputs now reflects the first generated
    input. This may result in the for attribute changing for generated datetime
    inputs.
  - The ``type`` attribute for :php:meth:`FormHelper::button()` can be removed now.  It still
    defaults to 'submit'.
  - :php:meth:`FormHelper::radio()` now allows you to disable all options.
    You can do this by setting either ``'disabled' => true`` or ``'disabled' => 'disabled'``
    in the ``$attributes`` array.


- Formヘルパーは、セキュアフィールドハッシュから disabled になっている
  フィールドを除外するようになりました。これにより
  :php:class:`SecurityComponent` と disabled な input フィールドとの共
  存がしやすくなりました。

- ラジオボタンで ``between`` オプションを利用していた場合の挙動が変わりました。
  ``between`` の値は、legend タグと最初の input エレメントの間に表示されます。

- チェックボックスの ``hiddenField`` オプションは、ちょうど 0 ではなく
  'N' のような特定の値をセットできるようになりました。

- 日付および時間の入力における ``for`` アトリビュートは、最初に作成された input タグに反映されます。
  これは生成された datetime 項目にで変化が生じるかも知れません。

- :php:meth:`FormHelper::button()`  の ``type`` アトリビュートは削除可能になりました。
  デフォルトは 'submit' になっています。

- :php:meth:`FormHelper::radio()` は全ての option を無効にできるように
  なりました。``$attributes`` 配列において、 ``'disabled' => true``
  もしくは ``'disabled' => 'disabled'`` とすることで可能になります。


PaginatorHelper
---------------

..
  - :php:meth:`PaginatorHelper::numbers()` now has a ``currentClass`` option.

- :php:meth:`PaginatorHelper::numbers()` に ``currentClass`` オプションが追加されました。


テスト
=======

..
  - Web test runner now displays the PHPUnit version number.
  - Web test runner now defaults to displaying app tests.
  - Fixtures can be created in different datasources other than $test.
  - Models loaded using the ClassRegistry and using another datasource will get
    their datasource name prepended with ``test_`` (e.g datasource `master` will
    try to use `test_master` in the testsuite)
  - Test cases are generated with class specific setup methods.

- Web テストランナーは、PHPUnit のバージョン番号を表示するようになりました。
- Web テストランナーは、app テストをデフォルトで表示するようになりました。
- フィクスチャが $test ではない別のデータソースに作成することができるようになりました。
- ClassRegistry によって読み込まれたモデルや他のデータソースから読み込
  まれたモデルは、 ``test_`` の接頭辞が付いたデータソース名を取得します。
  （例えば `master` というデータソースであれば、テスト内では
  `test_master` を利用しようとします）
- テストケースは setup メソッドを含んだクラスとして生成されます。



イベント
========

..
  - A new generic events system has been built and it replaced the way callbacks
    were dispatched. This should not represent any change to your code.
  - You can dispatch your own events and attach callbacks to them at will, useful
    for inter-plugin communication and easier decoupling of your classes.

- 新しい一般的なイベントシステムが作成され、コールバックによる方法は推奨されなくなりました。
  これはあなたのコードの変更を要求するものではありません。

- あなた自身のイベントをディスパッチすることができ、自由自在にコールバックに付加することができます。
  これによりプラグイン間の通信に有効だったり、クラスの分離を容易にしたりします。
