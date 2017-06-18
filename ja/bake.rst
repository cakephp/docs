Bake コンソール
################

CakePHP の bake コンソールは、あなたがやることを代わりに CakePHP にまかせることができます。
bake は CakePHP の基本的な素材(モデル、ビヘイビアー、ビュー、ヘルパー、コントローラー、
コンポーネント、テストケース、フィクスチャー、プラグイン)を生成出来ます。
bake では、簡単にフル機能を備えたアプリケーションを生成できますが、
その為のスケルトンクラスについては、ここでは省略します。
また、Scaffold アプリケーションを bake で試作してみるという使い方も、一般的です。

インストール手順
=================

bake を使用したり拡張する前に、アプリケーションに bake をインストールしておいてください。
bake は Composer を使ってインストールするプラグインとして、提供されています。 ::

    composer require --dev cakephp/bake:~1.0

上記のコマンドは、bake を ``development`` 環境で使用するパッケージとしてインストールします。
この入れ方の場合、本番 (``production``) 環境としてデプロイする際には、
bake はインストールされません。

bake の詳細を、下の各項目で説明します。


.. toctree::
    :maxdepth: 1

    bake/usage
    bake/development

.. meta::
    :title lang=ja: Bakeコンソール
    :keywords lang=ja: コマンドライン,CLI,development,bake view, bake template syntax,erb tags,asp tags,percent tags
