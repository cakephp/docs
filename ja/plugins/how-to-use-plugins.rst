プラグインの使い方
##################

プラグインを使用する前に、インストールと有効化が必要です。
:doc:`/plugins/how-to-install-plugins` をご覧ください。

プラグインの設定
================

プラグインの設定とルーティングを行うために load や loadAll メソッドでできることが
たくさんあります。もしかすると、あるプラグインに対して独自の routes ファイルや
bootstrap ファイルを定義しながら、全てのプラグインを自動的にロードしたいかもしれません。

大丈夫です::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

この設定方法に従うと、プラグインの設定や routes ファイルを手動で include() や
require() する必要はありません。適切なタイミングと場所で自動的に行われます。
また、正確に同じパラメータが load() メソッドに設定されます。
３つのプラグインのみがロードされ、残りのプラグインはロードされません。

最後に、loadAll に対して、具体的な設定をしていない全てのプラグインに適用するデフォルトの設定を
指定できます。

全てのプラグインの bootstrap ファイルをロードして、さらに Blog プラグインの routes ファイルを
ロード::

    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));


プラグインの設定の中で指定された全てのファイルは、実際に存在しなければならないこと、
ロードできなかった個々のファイルに対して、PHP が警告を発することに注意してください。
これは、全てのプラグインにデフォルトを指定している時に特に重要です。

CakePHP 2.3.0 は、プラグインをロードする時に、routes ファイルや bootstrap ファイルが
なくても無視することができる ``ignoreMissing`` オプションを追加しました。
以下のように全てのプラグインをロードするために必要なコードが短くできます。 ::

    // Loads all plugins including any possible routes and bootstrap files
    CakePlugin::loadAll(array(
        array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)
    ));

さらに、いくつかのプラグインでは、あなたのデータベースに一つ以上のテーブルを
作成する必要があります。これらの場合に、しばしば、以下のような cake シェルから呼び出す
schema ファイルを用意しています。 ::

    user@host$ cake schema create --plugin ContactManager

ほとんどのプラグインは、文書中でプラグインの設定やデータベースの設定の適切な手順を示します。
いくつかのプラグインは、他よりも多くの設定を必要とします。

応用ブートストラッピング
=========================

もし、一つのプラグインで一つ以上の bootstrap ファイルをロードしたい場合、
bootstrap 設定キーに複数ファイルの配列を設定します。 ::

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => array(
                'config1',
                'config2'
            )
        )
    ));

プラグインがロードされた際に実行する必要がある呼び出し可能な関数を設定できます。 ::


    function aCallableFunction($pluginName, $config) {

    }

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => 'aCallableFunction'
        )
    ));

プラグインの使用
================

クラス名の前にプラグイン名を付けることで、プラグインのコントローラー、
モデル、コンポーネント、ビヘイビアとヘルパーを参照できます。

例えば、あるビューの中で、素敵なコンタクト情報を表示するために
ContactManager プラグインの ContactInfoHelper を使用したいとします。
コントローラの中で、 $helper 配列は、以下のように記述します。 ::

    public $helpers = array('ContactManager.ContactInfo');

すると、ビューの中で他のヘルパーと同様に ContactInfoHelper にアクセスすることができます。 ::

    echo $this->ContactInfo->address($contact);


.. meta::
    :title lang=ja: How To Use Plugins
    :keywords lang=ja: plugin folder,configuration database,bootstrap,management module,webroot,user management,contactmanager,array,config,cakephp,models,php,directories,blog,plugins,applications
