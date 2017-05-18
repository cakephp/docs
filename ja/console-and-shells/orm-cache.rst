ORM キャッシュシェル
####################

Ormキャッシュシェルは単純なアプリケーションのメタデータキャッシュを管理するCLIツールを提供します。
開発環境ではこれは正しくメタデータキャッシュを既存のデータを消去することなく再構築する助けになります。
以下のコマンドで可能です。::

    bin/cake orm_cache build --connection default

これで ``default`` 設定で接続されている全てのテーブルのメタデータを再構築します。
一つのテーブルだけ再構築したければ名前を指定して出来ます。::

    bin/cake orm_cache build --connection default articles

加えて、キャッシュデータを作るために、OrmCacheShell をキャッシュされた
メタデータを削除するために使えます。::

    # 全メタデータの消去
    bin/cake orm_cache clear

    # 一つのテーブルだけ消去
    bin/cake orm_cache clear articles

