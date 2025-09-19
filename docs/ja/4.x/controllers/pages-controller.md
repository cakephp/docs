# ページコントローラー

CakePHP の公式スケルトンアプリは、デフォルトコントローラー **PagesController.php** を提供しています。
これは静的なコンテンツを提供するためのシンプルで補助的なコントローラーです。
インストール後のホームページはこのコントローラーとビューファイル **templates/Pages/home.php**
を利用して作成されました。もし **templates/Pages/about_us.php** というビューファイルを作成すれば、
この URL **http://example.com/pages/about_us** でアクセスできます。
ページコントローラーは必要に応じて気軽に修正できます。

コンポーザを利用してアプリを "bake" すると、ページコントローラーが **src/Controller/**
フォルダー以下に作成されます。
