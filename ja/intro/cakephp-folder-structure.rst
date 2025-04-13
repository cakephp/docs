CakePHP のフォルダー構成
########################

CakePHP アプリケーションスケルトンをダウンロードすると、次のようないくつかのトップレベルのフォルダーが
あるはずです。

- *bin* フォルダーには実行可能な Cake コンソールを保持します。
- *config* フォルダーは、CakePHP が使用する :doc:`/development/configuration`
  ファイルが入る場所です。データーベース接続の詳細、ブートストラップ、
  コアの設定ファイルなどがここに格納されます。
- *plugins* フォルダーは、あなたのアプリケーションが使う :doc:`/plugins` が格納されます。
- *logs* フォルダーは、通常、ログ設定に応じたログファイルが含まれます。
- *src* フォルダーは、あなたのアプリケーションのファイルが配置される場所です。
- *templates* フォルダーは、次のプレゼンテーションファイルが格納されます。:
  エレメント、エラーページ、レイアウト、ビューテンプレートファイル。
- *resources* フォルダーには、様々な種類のリソースファイルのサブフォルダーがあります。
  *locales* サブフォルダーには、国際化のための言語ファイルを格納します。
- *tests* フォルダーは、あなたのアプリケーションのテストケースを置く場所です。
- *tmp* フォルダーは、CakePHP が一時的なデータを格納する場所です。
  格納する実際のデータは、CakePHP の設定方法によって異なりますが、このフォルダーは、通常、
  翻訳メッセージ、モデルの詳細、および時にはセッション情報を格納するために使用されます。
- *vendor* フォルダーは、CakePHP と他のアプリケーションの依存ライブラリーが `Composer
  <https://getcomposer.org>`_ によってインストールされる場所です。これらのファイルを
  編集することは推奨されません。次回の更新時に Composer があなたの変更を上書きしてしまうからです。
- *webroot* ディレクトリーは、あなたのアプリケーションのパブリックドキュメントルートです。
  それはあなたが公開したいすべてのファイルを含みます。

  *tmp* フォルダーと *logs* フォルダーは存在していてかつ書き込み可能な状態にしておいてください。
  そうでない場合、あなたのアプリケーションのパフォーマンスに影響を及ぼす場合があります。
  これらのディレクトリーが書き込み可能ではない場合、デバッグモードでは CakePHP は警告を出します。

src フォルダー
===============

アプリケーション開発の大部分は、CakePHP の *src* フォルダー内で行われます。
*src* 内のフォルダーを少し詳しく見てみましょう。

Command
    アプリケーションのコンソールコマンドを含みます。
    更に学ぶためには、 :doc:`/console-commands/commands` をご覧ください。
Console
    Composer によって実行されるインストールスクリプトを含みます。
Controller
    アプリケーションの :doc:`/controllers` とコンポーネントを含みます。
Middleware
    アプリケーションの :doc:`/controllers/middleware` を格納します。
Model
    アプリケーションのテーブル、エンティティー、ビヘイビアーを含みます。
Shell
    アプリケーションのシェルタスクを含みます。
    更に学ぶためには、 :doc:`/console-commands/shells` をご覧ください。
View
    表示用のクラスが、ここに配置されます。ビュー、セル、ヘルパーなどです。

.. note::

    ``Shell`` フォルダーは、デフォルトでは存在しません。
    必要に応じて追加することができます。

.. meta::
    :title lang=ja: CakePHP のフォルダー構成
    :keywords lang=ja: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
