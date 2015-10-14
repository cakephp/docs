プラグインのインストール
########################

CakePHP プラグインのインストール方法は４つあります:

- Composer 経由
- マニュアル
- Git サブモジュール
- Git クローン

後で、 :ref:`enable-plugins` するのを忘れないでください。

マニュアル
==========

マニュアルでプラグインをインストールするには、 app/Plugin/ フォルダの中に
プラグインのフォルダを設置してください。もし 'ContactManager' という名前の
プラグインをインストールする場合、 app/Plugin/ の中に 'ContactManager'
という名前のフォルダを設置し、その下にプラグインの View, Model, Controller,
webroot やその他のディレクトリを設置します。

Composer
========

もし、あなたが Composer という名前の依存関係管理ツールに馴染みがないなら、
`Composer documentation <https://getcomposer.org/doc/00-intro.md>`_
を読んでおいてください。

Composer 経由で、架空のプラグイン 'ContactManager' をインストールするには、
プロジェクトの ``composer.json`` に依存関係を追加してください。 ::

    {
        "require": {
            "cakephp/contact-manager": "1.2.*"
        }
    }

もし、CakePHP プラグインのタイプが ``cakephp-plugin`` となっている場合、
Composer は、一般的な vendors フォルダの代わりに /Plugin ディレクトリ内に
プラグインをインストールします。

.. note::

    もし、開発環境のみプラグインをインクルードしたい場合、
    "require-dev" の使用を検討してください。

あるいは、  `Composer コマンドラインツールの
require コマンド <https://getcomposer.org/doc/03-cli.md#require>`_
を使用してプラグインをインストールできます。 ::

    php composer.phar require cakephp/contact-manager:1.2.*

Git クローン
============

もし、インストールしたいプラグインを Git リポジトリで管理されている場合、
クローンすることでインストールできます。仮想のプラグイン 'Contactmanager' が
GitHub 上で管理されていると仮定しましょう。 app/Plugin フォルダ内で
以下のコマンドを実行してクローンすることができます。 ::

    git clone git://github.com/cakephp/contact-manager.git ContactManager

Git サブモジュール
==================

もし、インストールしたいプラグインが Git リポジトリで管理されている場合、
クローンせず、Git サブモジュールとして統合することもできます。
app フォルダ内で以下のコマンドを実行してください。 ::

    git submodule add git://github.com/cakephp/contact-manager.git Plugin/ContactManager
    git submodule init
    git submodule update


.. _enable-plugins:

プラグインの有効化
==================

プラグインは、 ``app/Config/bootstrap.php`` 内で、手動でロードする必要があります。

一つずつロードするか、もしくは一度に全てをロードすることができます。 ::

    CakePlugin::loadAll(); // Loads all plugins at once
    CakePlugin::load('ContactManager'); // Loads a single plugin

``loadAll()`` は、指定したプラグインの設定を許容しつつ、全ての利用可能なプラグインを
ロードします。 ``load()`` は、似た動作をしますが、明示的に指定したプラグインのみ
ロードします。

.. meta::
    :title lang=ja: How To Install Plugins
    :keywords lang=ja: plugin folder, install, git, zip, tar, submodule, manual, clone, contactmanager, enable
