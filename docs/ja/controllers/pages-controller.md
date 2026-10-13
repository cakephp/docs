# ページコントローラ

CakePHPはデフォルトコントローラ `PagesController.php` を提供しています。これは静的なコンテンツを提供するためのシンプルで補助的なコントローラです。
インストール直後のホームページはコントローラを使って生成されています。もし `app/View/Pages/about_us.ctp`
というビューファイルを作ると `http://example.com/pages/about_us` というURLでアクセスすることができます。
Pages Controllerは必要に応じて気軽に修正できます。

CakePHPのコンソールユーティリティ"bake"を使って新しいアプリを焼き上げると、PagesControllerは
`app/Controller/` フォルダに作られます。また、 `lib/Cake/Console/Templates/skel/Controller/PagesController.php`
からファイルをコピーすることもできます。

::: pieceofcake2
pieceofcake2 フォークには `lib/Cake/Console/Templates/skel/` はありません。`PagesController.php` は
Bake プラグインの `Console/Templates/skel/Controller/` か、
[pieceofcake2/app](https://github.com/pieceofcake2/app) スケルトンからコピーしてください。
モダンレイアウトではコントローラを `src/Controller/` に、ページのビューを `templates/Pages/`
（例: `templates/Pages/about_us.ctp`）に置きます。フレームワーク本体は Composer によって
`vendor/pieceofcake2/cakephp/` にインストールされます。こちらも直接編集しないでください。
:::

::: info Changed in version 2.1
CakePHP 2.0ではPages Controllerは `lib/Cake` の一部でした。2.1からPages Controllerはコアの一部ではなくなり、 appフォルダに提供されるようになりました。
:::

> [!WARNING]
> 将来コアがアップデートされた時に問題を避けるために `lib/Cake` フォルダにあるいかなるファイルであっても直接編集しないで下さい。
