..
    The Pages Controller

ページコントローラ
####################

..
    CakePHP ships with a default controller **PagesController.php**. This is a
    simple and optional controller for serving up static content. The home page
    you see after installation is generated using this controller and the view
    file **src/Template/Pages/home.ctp**. If you make the view file
    **src/Template/Pages/about_us.ctp** you can access it using the URL
    **http://example.com/pages/about_us**. You are free to modify the Pages
    Controller to meet your needs.

CakePHPはデフォルトコントローラ **PagesController.php** を提供しています。
これは静的なコンテンツを提供するためのシンプルで補助的なコントローラです。
インストール後のホームページはこのコントローラとビューファイル **src/Template/Pages/home.ctp** を利用して作成されました。
もし **src/Template/Pages/about_us.ctp** というビューファイルを作成すれば、
このURL **http://example.com/pages/about_us** でアクセスできます。
ページコントローラは必要に応じて気軽に修正できます。

..
    When you "bake" an app using Composer the Pages Controller is created in your
    **src/Controller/** folder.

コンポーザを利用してアプリを"bake"すると、ページコントローラが **src/Controller/** フォルダ以下に作成されます。

.. meta::
    :title lang=ja: The Pages Controller
    :keywords lang=ja: pages controller,default controller,cakephp,ships,php,file folder,home page
