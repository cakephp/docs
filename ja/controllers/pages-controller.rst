ページコントローラ
####################

CakePHP の公式スケルトンアプリは、デフォルトコントローラ **PagesController.php** を提供しています。
これは静的なコンテンツを提供するためのシンプルで補助的なコントローラです。
インストール後のホームページはこのコントローラとビューファイル **src/Template/Pages/home.ctp**
を利用して作成されました。もし **src/Template/Pages/about_us.ctp** というビューファイルを作成すれば、
この URL **http://example.com/pages/about_us** でアクセスできます。
ページコントローラは必要に応じて気軽に修正できます。

コンポーザを利用してアプリを "bake" すると、ページコントローラが **src/Controller/**
フォルダ以下に作成されます。

.. meta::
    :title lang=ja: The Pages Controller
    :keywords lang=ja: pages controller,default controller,cakephp,ships,php,file folder,home page
