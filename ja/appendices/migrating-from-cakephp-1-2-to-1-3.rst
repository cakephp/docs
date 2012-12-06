1.2から1.3への移行ガイド
########################

このガイドは、様々なコアの1.2から1.3への移行に際して必要な変更について要約します。
各々のセクションは、既存のメソッドの変更点はもちろん、削除・名前の変更がされたメソッドに関連した情報を含みます。

**（重要）Appファイルの置き換え**


-  webroot/index.php: 起動方式(bootstrapping process)の変更によるものを置き換える必要があります。
-  config/core.php: PHP5.3に必要な設定が追加されました。
-  webroot/test.php: 単体テストを実行する場合、置き換えてください。

削除された定数
~~~~~~~~~~~~~~

以下の定数はCakePHPから削除されました。
削除された定数にアプリケーションが依存しているなら、 ``app/config/bootstrap.php`` にこれらの定数を定義してください。


-  ``CIPHER_SEED`` - Configureのクラス変数 ``Security.cipherSeed`` に置き換えられました。 この変更は ``app/config/core.php`` に書かれるべきです。
   ``app/config/core.php``
-  ``PEAR``
-  ``INFLECTIONS``
-  ``VALID_NOT_EMPTY``
-  ``VALID_EMAIL``
-  ``VALID_NUMBER``
-  ``VALID_YEAR``

設定とアプリケーションのブートストラップ
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**ブートストラップ時のパスの追加**

app/config/bootstrap.php に、 ``$pluginPaths`` や ``$controllerPaths`` のような変数が置かれているかもしれません。
以下はパスを追加する新しい方法です。1.3 RC1 では ``$pluginPaths`` 変数はもはや働かないでしょう。
パスを更新するには ``App::build()`` を使う必要があります。

::

    App::build(array(
        'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
        'models' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
        'views' => array('/full/path/to/views/', '/next/full/path/to/views/'),
        'controllers' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
        'datasources' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
        'behaviors' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
        'components' => array('/full/path/to/components/', '/next/full/path/to/components/'),
        'helpers' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
        'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
        'shells' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/'),
        'libs' => array('/full/path/to/libs/', '/next/full/path/to/libs/')
    ));

またブートストラップするときの順序が変更されました。
以前は、 ``app/config/bootstrap.php`` の **後に** ``app/config/core.php`` が読み込まれていました。
これはアプリケーションのブートストラップ時の ``App::import()`` がキャッシュせず、キャッシュがヒットしたときよりかなりかなり遅くなっていました。
1.3では、core.php の読み込みと設定のキャッシュは bootstrap.php の読み込みの **前に** されます。

**カスタム inflections の読み込み**

不必要なファイルの読み込みをしていた ``inflections.php`` は削除され、関連した機能は柔軟性を増強するため、メソッドに書き直されています。
今やカスタム *inflections* を読み込むためには、 ``Inflector::rules()`` を使います。

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

こうして設定されるルールは、コアのルールより優先的に inflection のセットにマージされます。

ファイルの名の変更と内部の変更点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**ライブラリ名の変更**

ファイル名と含まれるメインクラスのマッピングのため、「libs/session.php」、「libs/socket.php」、「libs/model/schema.php」、「libs/model/behavior.php」のコアライブラリは名前が変更されています。:


-  session.php -> cake\_session.php

  
   -  App::import('Core', 'Session') -> App::import('Core',
      'CakeSession')

-  socket.php -> cake\_socket.php

  
   -  App::import('Core', 'Socket') -> App::import('Core',
      'CakeSocket')

-  schema.php -> cake\_schema.php

  
   -  App::import('Model', 'Schema') -> App::import('Model',
      'CakeSchema')

-  behavior.php -> model\_behavior.php

  
   -  App::import('Core', 'Behavior') -> App::import('Core',
      'ModelBehavior')


ほとんどの場合、これらの名前の変更はユーザランドのコードには影響しません。

**Objectからの継承**

以下のクラスはもはやObjectを継承しません。


-  Router
-  Set
-  Inflector
-  Cache
-  CacheEngine

もしこれらのクラスでObjectのメソッドを使っているなら、それらのメソッドを使わないようにする必要があります。

コントローラとコンポーネント
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**コントローラ**


-  ``Controller::set()`` は ``$var_name`` を ``$varName`` に置き換えなくなりました。
   変数はあなたがセットした通りにViewで扱えます。

-  ``Controller::set('title', $var)`` をしてもレイアウト中で、 ``$title_for_layout`` にセットされなくなりました。
   ``$title_for_layout`` はデフォルトのままです。もしカスタマイズしたいなら、 ``$this->set('title_for_layout', $var)`` を使用してください。

-  ``Controller::$pageTitle`` は削除されました。
   代わりに ``$this->set('title_for_layout', $var);`` を使用してください。

-  コントローラには新たに ``startupProcess`` と ``shutdownProcess`` の二つのメソッドがあります。
   これらのメソッドはコントローラの初期化処理と終了処理の取り扱いを担います。

**コンポーネント**


-  ``Component::triggerCallback`` が追加されました。
   これはコンポーネントのコールバック処理への汎用的なフックです。
   ``Component::startup()`` 、 ``Component::shutdown()`` 、 ``Component::beforeRender()`` よりもコールバックを引き起こす為に都合の良いものとして取って代わりました。

**CookieComponent**


-  ``del`` は非推奨となりました。 ``delete`` を使用してください。

**AclComponent + DbAcl**

検索時に無駄に中継ノードを浪費すること、貪欲に検索すること無くパスを用いたノード参照のチェックが成されるようになりました。
以前はこのような構造が与えられると：

::

    ROOT/
        Users/
              Users/
                    edit

``ROOT/Users`` パスは最初でなく最後のUsersノードにマッチしていました。
1.3では、最後のノードを期待するならば、 ``ROOT/Users/Users`` をパスとして使う必要があります。

**RequestHandlerComponent**


-  ``getReferrer`` は非推奨となりました。 ``getReferer`` を使用してください。

**SessionヘルパーとSessionコンポーネント**


-  ``del`` は非推奨となりました。 ``delete`` を使用してください。

``SessionComponent::setFlash()`` の2番目の引数は、レイアウトを指定するために使われ、それに応じてレイアウトファイルをレンダリングしていました。
これはエレメントを使うことに修正されました。
アプリケーションでセッションflashレイアウトをカスタムしたものを指定しているならば、下記のような変更を加える必要があります。


#. 必要なレイアウトファイルを app/views/elements に移動する
#. $content\_for\_layout 変数を $message 変数に書き換える
#. レイアウトに ``echo $session->flash();`` があるかどうか確かめる

``SessionComponent`` と ``SessionHelper`` の両方とも、もはやあなたが求めない限り自動で読み込まれなくなりました。
Sessionヘルパーと Sessionコンポーネントは他のコンポーネントと同じように振る舞い、他のヘルパ・コンポーネントと同じように宣言されなければなりません。
既存の振る舞いを保持するなら、 ``AppController::$components`` と ``AppController::$helpers`` にこれらのクラスを読み込むように書き換えてください。

::

    var $components = array('Session', 'Auth', ...);
    var $helpers = array('Session', 'Html', 'Form' ...);

これらの変更はCakePHPが、これらクラスを明白的に、また宣言的にアプリケーション開発者が使いたいように成されました。
過去にはコアファイルを修正することなくセッションを読み込むのを避けることはできませんでした。
この変更はあなたがこれを避けることを可能にします。
加えてセッションクラスは唯一の不思議なコンポーネントとヘルパーでした。
この変更は、すべてのクラスの振舞いの統一と正常化のためにもなります。

ライブラリクラス
~~~~~~~~~~~~~~~~

**CakeSession**


-  ``del`` は非推奨となりました。 ``delete`` を使用してください。

**SessionComponent**


-  ``SessionComponent::setFlash()`` は 2番目の引数として *layout* の代わりに *element* を使うようになりました。
   必ずflashのためのレイアウトをapp/views/layoutsからapp/views/elementsに移し、$content\_for\_layout を $messageに変更するようにしてください。

**Folder**


-  ``mkdir`` は非推奨となりました。 ``create`` を使用してください。
-  ``mv`` は非推奨となりました。 ``move`` を使用してください。
-  ``ls`` は非推奨となりました。 ``read`` を使用してください。
-  ``cp`` は非推奨となりました。 ``copy`` を使用してください。
-  ``rm`` は非推奨となりました。 ``delete`` を使用してください。

**Set**


-  ``isEqual`` は非推奨となりました。 == または === を使ってください。

**String**


-  ``getInstance`` は非推奨となりました。Stringは静的にアクセスしてください。

**Router**

``Routing.admin`` は非推奨となりました。
これはprefixが異なるルーティングの方式では、矛盾した振る舞いを提供していました。
代わりに ``Routing.prefixes`` を使用する必要があります。
1.3のprefixルートは手動でルート定義を追加する必要がありません。
全てのprefixルートは自動で生成されます。シンプルに変更するには、core.phpを変更してください。

::

    // このような書き方から:
    Configure::write('Routing.admin', 'admin');
   
    // このような書き方へ:
    Configure::write('Routing.prefixes', array('admin'));

prefixルートの更なる情報に関しては、新機能ガイドを見てください。
また、ルーティングパラメータに小さな変更があります。
ルーティングパラメータは今や英数字と「-」、「\_」または ``/[A-Z0-9-_+]+/`` から成る必要があります。

::

    Router::connect('/:$%@#param/:action/*', array(...)); // ダメ
    Router::connect('/:can/:anybody/:see/:m-3/*', array(...)); // 許容可能

1.3のために、Routerの内部はパフォーマンス向上とコードの乱雑さを減らすために大規模に書き直されました。
この副作用として、コードの基幹部分にあることと引き換えに、問題的でありバグを引き起こしやすかった二つのまれにしか使われない機能が削除されました。
まず、フル正規表現を使うパスセグメントが削除されました。もう次のようなルートは作れません。

::

    Router::connect('/([0-9]+)-p-(.*)/', array('controller' => 'products', 'action' => 'show'));

これらのルートは複雑なルートを悪化させ、リバースルーティングを不可能にします。
もし同じようなルートを必要とするなら、ルーティングパラメータにキャプチャパターンを用いるのが推奨されます。
次に、ルートの中間でのワイルドカードのサポートが削除されました。以前はワイルドカードがルートの中間で使えました。

::

    Router::connect(
        '/pages/*/:event',
        array('controller' => 'pages', 'action' => 'display'),
        array('event' => '[a-z0-9_-]+')
    );

不規則な振る舞いやルートのコンパイルを複雑にするようなワイルドカードはもはやサポートされません。
これら二つの境界ケースである機能と変更以外の振る舞いは、1.2のときと変わらず振舞います。

また、配列形式のURLに「id」キーを用いている人は、Router::url()がこれを名前付き(*named*)パラメータとして扱うことに気づくでしょう。
もし過去にこのようなアプローチでIDパラメータをアクションに渡していたなら、この変更を反映するために、全ての $html->link() と $this->redirect() を書き換える必要あります。

::

    // 古いフォーマット:
    $url = array('controller' => 'posts', 'action' => 'view', 'id' => $id);
    // ユースケース:
    Router::url($url);
    $html->link($url);
    $this->redirect($url);
    // 1.2 の結果:
    /posts/view/123
    // 1.3 の結果:
    /posts/view/id:123
    // 正しいフォーマット:
    $url = array('controller' => 'posts', 'action' => 'view', $id);

**Dispatcher**

Dispatcherはもはやリクエストパラメータを元にControllerのlayout/viewPathを設定しません。
これらのプロパティはDispatcherではなくControllerによって操作されるべきです。
この機能はドキュメント化、テストがされていませんでした。

**Debugger**


-  ``Debugger::checkSessionKey()`` は ``Debugger::checkSecurityKeys()`` に名前が変更されました。
-  ``Debugger::output("text")`` といったコールはもはや正しく動きません。
   ``Debugger::output("txt")`` を使ってください。

**Object**


-  ``Object::$_log`` は削除されました。
   今は ``CakeLog::write`` が静的に呼び出されます。
   ログに加えられた変更の更なる情報は :doc:`/core-libraries/logging` をみてください。

**Sanitize**


-  ``Sanitize::html()`` は、 ``$remove`` 引数を使うことによってHTMLエンティティのエンコーディングをせず、危険な内容を返すことを許してしまっていましたが、今や常にエスケープされた文字列を返します。
-  ``Sanitize::clean()`` には ``remove_html`` オプションが付け加えられています。
   これは ``encode`` オプションと共に使われなければならず、 ``Sanitize::html()`` の ``strip_tags`` の機能へのトリガとなります。

**Configure と App**


-  Configure::listObjects() は App::objects() に置き換えられました。
-  Configure::corePaths() は App::core() に置き換えられました。
-  Configure::buildPaths() は App::build() に置き換えられました。
-  Configureはパスを管理しないようになりました。
-  Configure::write('modelPaths', array...) は App::build(array('models' => array...)) に置き換えられました。
-  Configure::read('modelPaths')は App::path('models') に置き換えられました。
-  debug = 3はもうありません。
   この設定によって生成されるコントローラのダンプは、度々メモリの消費問題を引き起こし、非実用的で使用不可能な設定でした。
   また ``$cakeDebug`` 変数は ``View::renderLayout`` から削除されました。
   エラーを避けるためこの変数の参照を削除してください。
-  ``Configure::load()`` を使ってプラグインから設定ファイルを読み込めるようになりました。
   ``Configure::load('plugin.file');`` として使ってください。
   ``.`` （訳注：ピリオド）を設定ファイル名に使っている場合は、 ``_`` （訳注：アンダースコア）に置き換えるべきです。

**Cache**

アプリーション、コア、またはプラグインからキャッシュエンジンを読み込めることに加えて、CakePHP1.3ではCacheがいくらか書き直されました。
書き直した点はメソッドのコールの呼び出しの頻度と回数を減らすことに主眼が置かれました。
結果として、少しだけマイナーなAPIの変更があり、それに伴いかなりのパフォーマンスが向上しました。詳細は以下です。

Cacheはエンジン毎のシングルトンの使用をやめ、代わりに ``Cache::config()`` で設定されるユニークキー毎にインスタンスが作られるようになりました。
以来エンジンはシングルトンでなく、 ``Cache::engine()`` は必要なくなり、削除されました。
加えて ``Cache::isInitialized()`` は *エンジン名* でなく、 *設定名* をチェックするようになりました。
しかしまだ、 ``Cache::set()`` や ``Cache::engine()`` をキャッシュの設定を変更するのに使えます。
また ``Cache`` に追加されたメソッドの更なる情報は :doc:`/appendices/new-features-in-cakephp-1-3` をチェックしてください。

デフォルトのキャッシュ設定でアプリーション、コア、またはプラグインにあるキャッシュエンジンを使用すると、これらのクラスの読み込みが常にキャッシュされない為にパフォーマンス問題を引き起こすことがあることに注意すべきです。
推奨されるのは、 ``default`` 設定にコアのキャッシュエンジンの一つを使用することか、もしくは設定をする以前に手動でキャッシュエンジンのクラスを include することです。
なおその上、コアでないキャッシュエンジンの設定は上記の理由のため、 ``app/config/bootstrap.php`` で終わらせておくべきです。

モデルのデータベースとデータソース
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**モデル**


-  ``Model::del()`` と ``Model::remove()`` は削除され、Model::delete()が正規の削除メソッドとなりました。
-  ``Model::findAll`` 、findCount,、findNeighbours は削除されました。
-  動的なsetTablePrefix()のコールは削除されました。
   テーブル接頭辞は ``$tablePrefix`` プロパティに記述されるべきで、初期化のカスタマイズはオーバーライドされた ``Model::__construct()`` の中で終わらせるべきです。
-  ``DboSource::query()`` は登録されていないメソッドに対してその名前のクエリを発行する代わりに、警告(*warnings*)を出すようになりました。
   これは、モデルのDataSourceオブジェクトに直接アクセスするように、無作法に ``$this->Model->begin()`` としてトランザクションを始めるような文法を改める必要があることを意味します。
-  開発モードの時、Validationのメソッドが見つからないとエラーを引き起こすようになりました。
-  Behaviorが見つからないとcakeErrorを引き起こすようになりました。
-  ``Model::find(first)`` は、conditionsが与えられず、idプロパティが空でないときに限って、idプロパティをデフォルトのconditionsとして使用していましたが、今やconditions無しが使われるようになりました。
-  Model::saveAll()の'validate'オプションは、デフォルト値としてtrueの代わりに'first'となりました。

**データソース**


-  DataSource::exists()は非DBデータソースも使えるように書き直されました。
   以前は、 ``var $useTable = false; var $useDbConfig = 'custom';`` としても、 ``Model::exists()`` はfalse以外を返すことは不可能でした。
   このことが ``create()`` または ``update()`` を使っているカスタムデータソースに醜いハックを用いずに正しく動作させることを妨げていました。
   もしカスタムデータソースが ``create()`` 、 ``update()`` 、 ``read()``  ( ``Model::exists()`` がコールするであろう ``Model::find('count')`` は、 ``DataSource::read()`` に渡されるため)を実装しているなら、1.3上でユニットテストを再度走らせて確かめてください。

**データベース**

ほとんどのデータベース設定はもはや'connect'キー（1.2以前から非推奨）をサポートしません。
代わりに、データベースへの持続的接続をするかどうかに関わらず、 ``'persistent' => true`` もしくはfalseを指定してください。

**SQLログのダンプ**

よく聞かれる質問は、どうやったらページの下のほうにあるSQLログのダンプを無効または削除できるのかというものです。
前のバージョンでは、SQLログのHTML生成はDboSourceの中に埋め込まれていました。
1.3には ``sql_dump`` というエレメントがコアにあります。
``DboSource`` はもはや自動でSQLログを吐き出しません。
もし1.3でSQLログを吐き出したいなら、下記のようにしてください。

::

    echo $this->element('sql_dump'); ?>

このエレメントはレイアウトやビューのどこにでも置けます。
``sql_dump`` エレメントは ``Configure::read('debug')`` が2のときのみSQLログを生成します。
もちろん ``app/views/elements/sql_dump.ctp`` を作ることでappでカスタムやオーバーライドをすることができます。

ビューとヘルパー
~~~~~~~~~~~~~~~~

**View**


-  ``View::renderElement`` は削除されました。 代わりに ``View::element()`` を使用してください。
-  ビューファイルの拡張子、 ``.thtml`` はもはや自動で読み込まれません。
   コントローラで ``$this->ext = 'thtml';`` を宣言するか、ビューファイルの拡張子を ``.ctp`` に変更してください。
-  ``View::set('title', $var)`` をしてもレイアウト中で、 ``$title_for_layout`` にセットされなくなりました。
   ``$title_for_layout`` はデフォルトのままです。
   もしカスタマイズしたいなら、 ``$this->set('title_for_layout', $var)`` を使用してください。
-  ``View::$pageTitle`` は削除されました。
   代わりに ``$this->set('title_for_layout', $var);`` を使用してください。
-  debug = 3 に関するレイアウト変数 ``$cakeDebug`` は削除されました。
   この変数を参照してもエラーを引き起こしますので、レイアウト中にあるなら削除してください。
   また、更なる情報に関してはSQLログのダンプとConfigureに関するノートを見てください。

全てのコアヘルパーはもう ``Helper::output()`` を使いません。
このメソッドは矛盾した使われ方をしたり、多くのFormHelperの出力に問題を引き起こしてきたりしました。
自動的にechoするように ``AppHelper::output()`` をオーバーロードしているのなら、手動でヘルパーのアウトプットをechoするようにビューファイルを書き換える必要があるでしょう。

**TextHelper**


-  ``TextHelper::trim()`` は非推奨となりました。代わりに ``truncate()`` を使用してください。
-  ``TextHelper::highlight()`` では:
-  ``$highlighter`` 引数は削除されました。
   代わりに ``$options['format']`` を使用してください。
-  ``$considerHtml`` 引数は削除されました。
   代わりに ``$options['html']`` を使用してください。
-  ``TextHelper::truncate()`` では:
-  ``$ending`` 引数は削除されました。
   代わりに ``$options['ending']`` を使用してください。
-  ``$exact`` 引数は削除されました。
   代わりに ``$options['exact']`` を使用してください。
-  ``$considerHtml`` 引数は削除されました。
   代わりに ``$options['html']`` を使用してください。

**PaginatorHelper**

PaginatorHelper にはスタイルをより簡単にするたくさんの機能強化があります。
``prev()`` 、 ``next()`` 、 ``first()`` 、 ``last()`` のメソッドで、リンク先が無い場合リンクの代わりに ``<div>`` タグが返されていましたが、 ``<span>`` がデフォルトになりました。

passedArgs が「url」オプションに自動的にマージされるようになりました。

``sort()`` 、 ``prev()`` 、 ``next()`` は生成されるHTMLにクラス名を付与するようになりました。
``prev()`` は「prev」クラスを付与します。
``next()`` は「next」クラスを付与します。
``sort()`` は昇順なら「asc」クラス、降順なら「desc」クラスを付与します。

**FormHelper**


-  ``FormHelper::dateTime()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::year()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::month()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::day()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::minute()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::meridian()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  ``FormHelper::select()`` の ``$showEmpty`` 引数は削除されました。代わりに ``$attributes['empty']`` を使用してください。
-  FormHelperが生成するデフォルトのURLはもはや「id」を含めません。
   これはデフォルトURLとユーザランドのルートの記述との矛盾をなくし、また、FormHelperのデフォルトURLを用いてより直感的な感覚でリバースルーティングを動作させるのを可能にします。
-  ``FormHelper::submit()`` は type=submit 以外のタイプの input を作れるようになりました。
   「type」オプションを用いて生成される input の種類をコントロールしてください。
-  ``FormHelper::button()`` は「reset」や「clear」タイプの input の代わりに ``<button>`` 要素を生成するようになりました。
   もし「reset」や「clear」タイプの input を生成したいなら、 ``FormHelper::submit()`` のオプションを ``'type' => 'reset'`` などとして使ってください。
-  ``FormHelper::secure()`` と ``FormHelper::create()`` は隠し fieldset タグを作らないようになりました。
   代わりに隠し div タグが作られます。
   これは HTML4 の妥当性を向上させます。

また、FormHelperの変更と新機能を :ref:`form-improvements-1-3` をチェックして確かめてください。

**HtmlHelper**


-  ``HtmlHelper::meta()`` の ``$inline`` 引数は削除されました。これは ``$options`` 配列にマージされました。
-  ``HtmlHelper::link()`` の ``$escapeTitle`` 引数は削除されました。代わりに ``$options['escape']`` を使用してください。
   ``escape`` オプションはタイトルと属性をエスケープするかどうかを同時に設定します。
-  ``HtmlHelper::para()`` の ``$escape`` 引数は削除されました。代わりに ``$options['escape']`` を使用してください。
-  ``HtmlHelper::div()`` の ``$escape`` 引数は削除されました。代わりに ``$options['escape']`` を使用してください。
-  ``HtmlHelper::tag()`` の ``$escape`` 引数は削除されました。代わりに ``$options['escape']`` を使用してください。
-  ``HtmlHelper::css()`` の ``$inline`` 引数は削除されました。代わりに ``$options['inline']`` を使用してください。

**SessionHelper**


-  ``flash()`` はもはや自動的にechoされません。
   ``echo $session->flash();`` のようにしてください。
   flash() はヘルパメソッドの中で唯一自動的に出力されるメソッドでしたが、ヘルパメソッドとしての整合性をとるため変更されました。

**CacheHelper**

CacheHelperの ``Controller::$cacheAction`` との相互作用は少し変更されました。
以前は ``$cacheAction`` に配列を用いていたら、ルーティング済みのURLをキーにする必要がありました。
これはルートが変更されたときキャッシュの破壊を引き起こしていました。
また「pass」引数ごとにキャッシュの保持期間を設定できましたが、「named」引数やクエリ文字列ではできませんでした。
これらの制限・矛盾は取り除かれました。
今や ``$cacheAction`` のキーにコントローラのアクション名を用います。
これは ``$cacheAction`` の設定をもはやルーティングを介さないようにし、簡単にできるようにします。
もしキャッシュの保持期間を特殊な引数でカスタマイズしたいなら、コントローラで cacheAction を見つけそれを更新する必要があります。

**TimeHelper**

TimeHelperは i18n をよりフレンドリーに扱えるように書き直されました。
内部で date() をコールしていたところは strftime() に置き換えられました。
新しいメソッド TimeHelper::i18nFormat() が追加され、app/locale にあるPOSIX標準の LC\_TIME 定義ファイルからローカライゼーションのためのデータを取得します。
これらは以下の TimeHelper のAPIの変更によるものです。


-  TimeHelper::format() は第一引数に時間文字列をとり、フォーマット文字列を第二引数、フォーマットはstrftime() の書式、とすることができるようになりました。
   このような引数の呼び出しがあった場合、自動的に現在のロケールに合わせた日付フォーマットに変換されます。
   また1.2.xバージョンの後方互換性を保った引数もとることが出来ますが、この場合はフォーマット文字列が date() の書式と互換性がなければなりません。
-  TimeHelper::i18nFormat() が追加されました。

**非推奨になったHelper**

JavascriptHelper と AjaxHelperは両方とも非推奨となり、JsHelper + HtmlHelper が代わって使われるべきです。

以下のように置き換える必要があります：


-  ``$javascript->link()`` を ``$html->script()`` に。
-  ``$javascript->codeBlock()`` を使い方に拠って、 ``$html->scriptBlock()`` か ``$html->scriptStart()`` と ``$html->scriptEnd()`` に。

コンソールとシェル
~~~~~~~~~~~~~~~~~~

**Shell**

``Shell::getAdmin()`` は ``ProjectTask::getAdmin()`` に移動されました。

**Schema shell**


-  ``cake schema run create`` は ``cake schema create`` に名前が変わりました。
-  ``cake schema run update`` は ``cake schema update`` に名前が変わりました。

**コンソールでのエラーハンドリング**

シェルのディスパッチャーは、シェルで呼ばれたメソッドが明確に ``false`` を返り値としてもつと、ステータスコード ``1`` を用いて exit するようになりました。
他の返り値ではステータスコード ``0`` を用います。
以前は返り値をダイレクトにステータスコードとして用いてました。

シェルのメソッドでエラーを示すために ``1`` を返り値としていたものは、代わりに ``false`` を返すように書き換えられるべきです。

``Shell::error()`` はエラーメッセージを出力した後に、ステータスコード 1 で exit します。
また、メッセージのフォーマットに多少の変更があります。

::

    $this->error('Invalid Foo', 'Please provide bar.');
    // 出力:
    Error: Invalid Foo
    Please provide bar.
    // ステータスコード1でexit()される

``ShellDispatcher::stderr()`` はメッセージの前に「Error:」を付け加えなくなりました。
これは ``Shell::stdout()`` と同様となったことと言えます。

**ShellDispatcher::shiftArgs()**

このメソッドはシフトされた引数を返すようになりました。
前は引数がない場合 false を返していましたが、今は null を返すようになりました。
前は引数がある場合 true を返していましたが、今は代わりにシフトされた引数を返すようになりました。

Vendors, Test Suite & schema
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**vendors/cssとvendors/jsとvendors/img**

これら３つのディレクトリは、 ``app/vendors`` と ``plugin/vendors`` の両方から削除されています。
これらはpluginとthemeのwebrootに置き換えられました。

**Test Suiteとユニットテスト**

グループテストは今や非推奨のGroupTestクラスの代わりにTestSuiteクラスを継承するべきです。
もしあなたのグループテストがうまく走らないなら、基底クラスを変更する必要があります。

**Vendorとプラグインとテーマのアセット**

プラグインとテーマのwebrootディレクトリのために、Vendorのアセットの供給が1.3では削除されました。

SchemaShellで使われるスキーマファイルは ``app/config/sql`` から ``app/config/schema`` に移動されました。
``config/sql`` は1.3で続けて利用できますが、次期バージョンではそうならないでしょう。
