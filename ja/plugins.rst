プラグイン
##########

CakePHP では、コントローラ・モデル・ビューのコンビをセットアップし、
パッケージしたアプリケーションプラグインとしてリリースできます。
他の人はそのプラグインを自身の CakePHP アプリケーションで使用することができます。
素敵なユーザ管理モジュールやシンプルなブログやアプリケーションの１つの
ウェブサービスモジュールはありませんか？それを CakePHP プラグインとしてパッケージすると、
他のアプリケーションにそれを追加できます。

プラグインとそれをインストールするアプリケーション間の主な結びつきは、
アプリケーションの設定（データベース接続など）です。
しかし、プラグインはそれ自身の狭い環境で動作しますが、
あたかもそれ自身がアプリケーションであるかのように振る舞います。

.. toctree::
   :maxdepth: 1

   plugins/how-to-install-plugins
   plugins/how-to-use-plugins
   plugins/how-to-create-plugins


.. meta::
    :title lang=ja: Plugins
    :keywords lang=ja: plugin folder,plugins,controllers,models,views,package,application,database connection,little space
