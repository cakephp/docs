Bakeコンソール
############

..
    CakePHP's bake console is another effort to get you up and running in CakePHP
    – fast. The bake console can create any of CakePHP's basic ingredients: models,
    behaviors, views, helpers, controllers, components, test cases, fixtures and plugins.
    And we aren't just talking skeleton classes: Bake can create a fully functional
    application in just a few minutes. In fact, Bake is a natural step to take once
    an application has been scaffolded.

CakePHPのbakeコンソールは、あなたがやることを代わりにCakePHPにまかせることができます。
bakeはCakePHPの基本的な素材(モデル、ビヘイビア、ビュー、ヘルパー、コントローラー、コンポーネント、テストケース、フィクスチャー、プラグイン)を生成出来ます。
bakeでは、簡単にフル機能を備えたアプリケーションを生成できますが、その為のスケルトンクラスについては、ここでは省略します。
また、Scaffoldアプリケーションをbakeで試作してみるという使い方も、一般的です。

インストール手順
============

..
    Before trying to use or extend bake, make sure it is installed in your
    application. Bake is provided as a plugin that you can install with Composer::

bakeを使用したり拡張する前に、アプリケーションにbakeをインストールしておいてください。
bakeはComposerを使ってインストールするプラグインとして、提供されています。 ::

    composer require --dev cakephp/bake:~1.0

..
    The above will install bake as a development dependency. This means that it will
    not be installed when you do production deployments. The following sections
    cover bake in more detail:

上記のコマンドは、bakeを ``development`` 環境で使用するパッケージとしてインストールします。
この入れ方の場合、本番(``production``)環境としてデプロイする際には、bakeはインストールされません。

bakeの詳細を、下の各項目で説明します。


.. toctree::
    :maxdepth: 1

    bake/usage
    bake/development

.. meta::
    :title lang=ja: Bakeコンソール
    :keywords lang=ja: コマンドライン,CLI,development,bake view, bake template syntax,erb tags,asp tags,percent tags
