# ページコントローラ

CakePHPはデフォルトコントローラ `PagesController.php` を提供しています。これは静的なコンテンツを提供するためのシンプルで補助的なコントローラです。
インストール直後のホームページはコントローラを使って生成されています。もし `templates/Pages/about_us.ctp`
というビューファイルを作ると `https://example.com/pages/about_us` というURLでアクセスすることができます。
Pages Controllerは必要に応じて気軽に修正できます。

Pages Controller はアプリケーションの一部で、 `src/Controller/PagesController.php` にあります。
[pieceofcake2/app](https://pieceofcake2.github.io/app/) スケルトンに含まれているほか、
[Bake プラグイン](https://pieceofcake2.github.io/bake/) でプロジェクトを作成した場合は、
プラグインの `Console/Templates/skel/Controller/` フォルダからコピーされます。
従来の `app/` レイアウトでは、コントローラは `app/Controller/` に、ページのビューは
`app/View/Pages/` に置きます。

::: info Changed in version 2.1
CakePHP 2.0ではPages Controllerは `lib/Cake` の一部でした。2.1からPages Controllerはコアの一部ではなくなり、 appフォルダに提供されるようになりました。
:::

> [!WARNING]
> 将来コアがアップデートされた時に問題を避けるために、Composer がフレームワークをインストールする
> `vendor/pieceofcake2/cakephp/` 以下のファイルは、いかなるファイルであっても直接編集しないで下さい。
