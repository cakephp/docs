# アプリケーション

`Application` はあなたのアプリケーションの心臓部です。
アプリケーションがどのように構成され、何のプラグイン、ミドルウェア、コンソールコマンド、およびルートが含まれているかを制御します。

`Application` クラスは **src/Application.php** にあります。
デフォルトでは非常にスリムで、いくつかのデフォルトの [ミドルウェア](../controllers/middleware)
を定義しているだけです。 Application は、次のフックメソッドを定義できます。

- `bootstrap` [設定ファイル](../development/configuration) を読み込み、
  定数やグローバル関数を定義するために使用されます。デフォルトでは、 **config/bootstrap.php** を
  含みます。これは、あなたのアプリケーションが使用する [プラグイン](../plugins) を読み込むのに理想的な場所です。
- `routes` [ルート](../development/routing) を読み込むために使用されます。
  デフォルトでは、 **config/routes.php** を含みます。
- `middleware` アプリケーションに [ミドルウェア](../controllers/middleware)
  を追加するために使用されます。
- `console` アプリケーションに [コンソールコマンド](../console-and-shells)
  を追加するために使用されます。
  デフォルトでは、アプリケーションとすべてのプラグインのシェルとコマンドが自動的に検出されます。
- `events` アプリケーションのイベントマネージャーに
  [イベントリスナー](../core-libraries/events) を追加するために使用されます。

## 既存アプリケーションへの新しい HTTP スタック追加

既存のアプリケーションで HTTP ミドルウェアを使うには、アプリケーションにいくつかの
変更を行わなければなりません。

1.  まず **webroot/index.php** を更新します。 [app スケルトン](https://github.com/cakephp/app/tree/master/webroot/index.php) から
    ファイルの内容をコピーしてください。
2.  `Application` クラスを作成します。どのようにするかについては上の [Using Middleware](../controllers/middleware#using-middleware)
    セクションを参照してください。もしくは [app スケルトン](https://github.com/cakephp/app/tree/master/src/Application.php)
    の中の例をコピーしてください。
3.  **config/requirements.php** を作成します。もし存在しない場合、 [app スケルトン](https://github.com/cakephp/app/blob/master/config/requirements.php) から
    内容を追加してください。

これら三つの手順が完了すると、アプリケーション／プラグインのディスパッチフィルターを
HTTP ミドルウェアとして再実装を始める準備が整います。

もし、テストを実行する場合は、 [app スケルトン](https://github.com/cakephp/app/tree/master/tests/bootstrap.php) から、
ファイルの内容をコピーして **tests/bootstrap.php** を更新することも必要になります。
