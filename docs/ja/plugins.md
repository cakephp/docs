# プラグイン

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

CakePHP 2 向けに書かれたプラグインの多くは、PHP 8 に対応しないまま更新が止まっています。
[Piece of Cake 2](https://github.com/pieceofcake2) プロジェクトでは、DebugKit、Bake、Upload、
TwigView など、よく使われているプラグインの PHP 8 対応フォークをメンテナンスしています。
一覧は [リポジトリとプラグイン](/ja/plugins/maintained-plugins) を参照してください。
`cakephp/cakephp` 2.x に依存するその他のプラグインも、Composer 上で `pieceofcake2/cakephp` が
そのパッケージを置き換える (replace する) ためインストールはできますが、PHP 8 で動作するかどうかは
各自で確認する必要があります。

- [プラグインのインストール](plugins/how-to-install-plugins)
- [プラグインの使い方](plugins/how-to-use-plugins)
- [プラグインの作成](plugins/how-to-create-plugins)
- [Captcha](plugins/captcha)
