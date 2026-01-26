# Bakeでコード生成

CakePHP の Bake は、あなたがやることを代わりに CakePHP にまかせることができます。
Bake は CakePHP の基本的な素材(モデル、ビュー、コントローラ)を作れます。
Bake では、簡単にフル機能をそなえたアプリケーションを作ることができますが
そういったスケルトンクラスについてはここでは話しません。
また Scaffold アプリケーションを試してみるのに、bake を使ってみるのもいいでしょう。

一般的な CakePHP コンソールの使い方に関する [The Cakephp Console](../console-and-shells#the-cakephp-console)
セクションを参照してください。セットアップ環境に依っては、 cake スクリプトに
実行権限を設定したり `./Console/cake bake` として、呼び出したりする必要があります。
cake スクリプトは PHP CLI (command line interface) で実行されます。
スクリプト実行に問題があれば、PHP CLI がインストールされていることと、
適切なモジュール (たとえば MySQL など) がインストールされていることを確認してください。
また、データベースのホストが 'localhost' で問題がある場合は、代わりに
'127.0.0.1' を試してみてください。 これは PHP CLI で起こる問題です。

はじめて Bake を実行する時に、まだデータベースの設定ファイルがなければ、
それを作るように促されます。

データベース設定ファイルを作ったあと、Bake を実行すると次のようなオプションが表示されます。

``` text
---------------------------------------------------------------
App : app
Path: /path-to/project/app
---------------------------------------------------------------
Interactive Bake Shell
---------------------------------------------------------------
[D]atabase Configuration
[M]odel
[V]iew
[C]ontroller
[P]roject
[F]ixture
[T]est case
[Q]uit
What would you like to Bake? (D/M/V/C/P/F/T/Q)
>
```

代わりに、次のようにコマンドラインから直接これらのコマンドを実行することが出来ます。 :

``` bash
$ cake bake db_config
$ cake bake model
$ cake bake view
$ cake bake controller
$ cake bake project
$ cake bake fixture
$ cake bake test
$ cake bake plugin plugin_name
$ cake bake all
```

::: info Changed in version 2.5
`bake test` で作成されたテストファイルは、空のテストメソッドであることを注意するために [PHPunit の markTestIncomplete()](https://phpunit.de/manual/3.7/ja/incomplete-and-skipped-tests.html) の呼び出しを含みます。2.5 より前には、空のテストは暗黙のうちにパスしていました。
:::

## bakeテンプレートから生成されるデフォルトのHTMLを変更する

bake コマンドで生成されるデフォルトの HTML 出力を変更したい場合、
次のようなステップでやります。

### カスタムビューを作る

1.  lib/Cake/Console/Templates/default/views に移動します。
2.  その中に、4つのファイルがあります。
3.  それらのファイルを app/Console/Templates/\[themename\]/views にコピーします。
4.  ビューを "bake" で構築する方法を制御するために HTML 出力に変更を加えます。

`[themename]` は、自分で自由につけれる bake のテーマ名です。
bake のテーマ名はユニークである必要がありますので、'default' は使わないでください。

### カスタムプロジェクトを作る

1.  lib/Cake/Console/Templates/skel に移動します。
2.  その中に、アプリケーションのベースとなるファイルがあります。
3.  それらのファイルを app/Console/Templates/skel にコピーします。
4.  ビューを "bake" で構築する方法を制御するために HTML 出力に変更を加えます。
5.  project タスクにスケルトンのパスをパラメータとして渡します。

<!-- -->

    cake bake project --skel Console/Templates/skel

<div class="note">

<div class="title">

Note

</div>

- `cake bake project` は、スケルトンのパスをパラメータで渡して
  特定の project タスクを実行します。
- テンプレートのパスはコマンドラインのカレントパスからの相対パスです。
- スケルトンまでのフルパスを入力すれば、複数のテンプレートを使用することも含み
  自分が使いたいテンプレートがあるディレクトリを任意に指定できます。
  (CakePHP がビューのように skel フォルダのオーバーライドをサポートし始めるまでは)

</div>
