# スキーマキャッシュツール

SchemaCacheShell は単純なアプリケーションのメタデータキャッシュを管理する CLI ツールを提供します。
開発環境ではこれは正しくメタデータキャッシュを既存のデータを消去することなく再構築する助けになります。
以下のコマンドで可能です。 :

    bin/cake schema_cache build --connection default

これで `default` 設定で接続されている全てのテーブルのメタデータを再構築します。
一つのテーブルだけ再構築したければ名前を指定して出来ます。 :

    bin/cake schema_cache build --connection default articles

加えて、キャッシュデータを作るために、SchemaCacheShell をキャッシュされた
メタデータを削除するために使えます。:

``` text
# 全メタデータの消去
bin/cake schema_cache clear

# 一つのテーブルだけ消去
bin/cake schema_cache clear articles
```

> [!NOTE]
> 3.6 より前は、 `schema_cache` の代わりに `orm_cache` を使ってください。
