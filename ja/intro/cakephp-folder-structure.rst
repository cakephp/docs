CakePHP のフォルダー構成
########################

CakePHP アプリケーションスケルトンをダウンロードすると、次のようないくつかのトップレベルのフォルダーが
あるはずです。

- *bin* フォルダーには実行可能な Cake コンソールを保持します。
- *config* フォルダーは、CakePHP が使用する（数個の） :doc:`/development/configuration`
  ファイルが入る場所です。データーベース接続の詳細、ブートストラップ、
  コアの設定ファイルなどがここに格納されます。
- *plugins* フォルダーは、あなたのアプリケーションが使う :doc:`/plugins` が格納されます。
- *logs* フォルダーは、通常、ログ設定に応じたログファイルが含まれます。
- *src* フォルダーは、あなたのアプリケーションのファイルが配置される場所です。
- *tests* フォルダーは、あなたのアプリケーションのテストケースを置く場所です。
- *tmp* フォルダーは、CakePHP が一時的なデータを格納する場所です。
  格納する実際のデータは、CakePHP の設定方法によって異なりますが、このフォルダーは、通常、
  翻訳メッセージ、モデルの詳細、および時にはセッション情報を格納するために使用されます。
- *vendor* フォルダーは、CakePHP と他のアプリケーションの依存ライブラリーが入る場所です。
  これらのファイルを編集することは推奨されません。次回の更新時に composer があなたの変更を
  上書きしてしまうからです。
- *webroot* ディレクトリーは、あなたのアプリケーションのパブリックドキュメントルートです。
  それはあなたが公開したいすべてのファイルを含みます。

  *tmp* フォルダーと *logs* フォルダーは存在していてかつ書き込み可能な状態にしておいてください。
  そうでない場合、あなたのアプリケーションのパフォーマンスに影響を及ぼす場合があります。
  これらのディレクトリーが書き込み可能ではない場合、デバッグモードでは CakePHP は警告を出します。

src フォルダー
===============

アプリケーション開発の大部分は、CakePHP の *src* フォルダー内で行われます。
*src* 内のフォルダーを少し近づいて見てみましょう。

Controller
    アプリケーションのコントローラーとコンポーネントを含みます。
Locale
    国際化のための文字列ファイルを格納します。
Model
    アプリケーションのテーブル、エンティティー、ビヘイビアーを含みます。
Shell
    あなたのアプリケーションで使うコンソールコマンドやコンソールタスクが入ります。
    詳細は :doc:`/console-and-shells` を確認してください。
View
    表示用のクラスが、ここに配置されます。ビュー、セル、ヘルパーなどです。
Template
    表示用のファイルが、ここに配置されます。
    エレメント、エラーページ、レイアウト、ビューテンプレートのファイルなどです。

.. meta::
    :title lang=ja: CakePHP のフォルダー構成
    :keywords lang=ja: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
