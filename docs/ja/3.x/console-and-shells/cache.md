# Cache シェル

CLI 環境でキャッシュデータをよりよく管理するために、シェルコマンドで、
あなたのアプリケーションが持つキャッシュデータの消去ができます。 :

``` text
// 一つの設定のキャッシュをクリア
bin/cake cache clear <configname>

// すべての設定のキャッシュをクリア
bin/cake cache clear_all
```

::: info Added in version 3.3.0
cache シェルは、 3.3.0 で追加されました。
:::
