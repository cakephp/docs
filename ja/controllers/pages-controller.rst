ページコントローラ
##################

CakePHPはデフォルトコントローラ ``PagesController.php`` を提供しています。これは静的なコンテンツを提供するためのシンプルで補助的なコントローラです。
インストール直後のホームページはコントローラを使って生成されています。もし ``app/View/Pages/about_us.ctp``
というビューファイルを作ると ``http://example.com/pages/about_us`` というURLでアクセスすることができます。
Pages Controllerは必要に応じて気軽に修正できます。

CakePHPのコンソールユーティリティ"bake"を使って新しいアプリを焼き上げると、PagesControllerは
``app/Controller/`` フォルダに作られます。また、 ``lib/Cake/Console/Templates/skel/Controller/PagesController.php``
からファイルをコピーすることもできます。

.. versionchanged:: 2.1
    CakePHP 2.0ではPages Controllerは ``lib/Cake`` の一部でした。2.1からPages Controllerはコアの一部ではなくなり、
    appフォルダに提供されるようになりました。

.. warning::

    将来コアがアップデートされた時に問題を避けるために ``lib/Cake`` フォルダにあるいかなるファイルであっても直接編集しないで下さい。

.. meta::
    :title lang=ja: The Pages Controller
    :keywords lang=ja: pages controller,default controller,lib,cakephp,ships,php,file folder

