Routes Shell
############

.. versionadded:: 3.1
    RoutesShell は 3.1 で追加されました。

RoutesShell は、ルートのテストおよびデバッグのためにシンプルに利用する CLI インターフェイスを
提供します。どのようにルートが解析されるか、どのような URL のルーティングパラメーターが
生成されるかをテストするために使用することができます。

すべてのルートの一覧を取得
--------------------------

::

    bin/cake routes

URL 解析のテスト
----------------

URL が ``check`` メソッドを使用して解析される方法をすぐに見ることができます。 ::

    bin/cake routes check /bookmarks/edit/1

ルートが任意のクエリー文字列パラメーターが含まれている場合は、引用符で URL を囲むことを
忘れないでください。 ::

    bin/cake routes check "/bookmarks/?page=1&sort=title&direction=desc"


URL 生成のテスト
----------------

``generate`` メソッドを使用して、 :term:`ルーティング配列` が、どのような URL を
生成するかを確認できます。 ::

    bin/cake routes generate controller:Bookmarks action:edit 1

