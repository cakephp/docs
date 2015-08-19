CakePHPのフォルダ構成
########################

CakePHPアプリケーションをダウンロードして展開すると、次のようなファイルとフォルダが含まれているはずです:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

いくつかのトップレベルのフォルダに注目してください:

- *bin* フォルダには実行可能なCakeコンソールが入ります。
- *config* フォルダは CakePHP が使用する（数個の）設定ファイルが入る場所です。
  データベース接続の詳細、ブートストラップ、コアの設定ファイルなどがここに入ります。
- *plugins* フォルダはあなたのアプリケーションが使うプラグインが入ります。
- The *logs* folder normally contains your log files, depending on your log
  configuration.
- *src* フォルダは、作成するプログラムが入る場所です。
  あなたのアプリケーションのファイルはここに入れます。
- *tests* フォルダはあなたのアプリケーションのテストケースが入る場所です。
- *tmp* フォルダは CakePHP の一時的なデータが入る場所です。
  The actual data it
  stores depends on how you have CakePHP configured, but this folder
  is usually used to store model descriptions and sometimes
  session information.
- *vendor* フォルダは CakePHP と他のアプリケーションの依存ライブラリが入る場所です。
  このフォルダの中のファイルを勝手に編集 **しない** と誓ってください。
  これはコア (心臓部分) で、ここをいじってしまうと、私たちはもう助けを差し伸べることができません。
- *webroot* ディレクトリはあなたのアプリケーションのパブリックドキュメントルートです。
  It contains all the files you want to be publically reachable.

  *tmp* フォルダと *logs* フォルダは存在していてかつ書き込み可能な状態にしておいてください。
  そうでないばあい、あなたのアプリケーションのパフォーマンスに影響を及ぼす場合があります。
  これらのケースに当てはまらない場合、デバッグモードではCakePHPは警告を出します。

srcフォルダ
===============

アプリケーション開発の大部分は、CakePHP の *src* フォルダ内で行われます。
*src* の内部フォルダについて調べてみましょう。

Console
    あなたのアプリケーションで使うコンソールコマンドやコンソールタスクが入ります。
    詳細は :doc:`/console-and-shells` を確認してください。
Controller
    アプリケーションのコントローラとコンポーネントが入ります。
Locale
    国際化のための文字ファイルが入ります。
Model
    アプリケーションのモデル、ビヘイビア、データソースが入ります。
View
    表示用のクラスはここに置きます。
    ヘルパー、レイアウト、ビューのファイルなどです。
Template
    表示用のファイルはここに置きます。
    エレメント、エラーページ、レイアウト、ビューテンプレートのファイルなどです。

.. meta::
    :title lang=en: CakePHP Folder Structure
    :keywords lang=en: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
