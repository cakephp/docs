HTTPキャッシュの確認
====================

.. php:class:: CheckHttpCacheComponent(ComponentCollection $collection, array $config = [])

HTTPキャッシュ検証モデルは、リバースプロキシとしても知られるキャッシュゲートウェイが、
保存されたレスポンスのコピーをクライアントに提供できるかどうかを判断するための処理の1つです。
このモデルでは、主に帯域幅を節約することができますが、
正しく使用すればCPU処理も節約でき、レスポンスタイムを短縮することができます。::

    // in a Controller
    public function initialize(): void
    {
        parent::initialize();

        $this->addComponent('CheckHttpCache');
    }

コントローラーで ``CheckHttpCacheComponent`` を有効にすると、自動的に ``beforeRender`` チェックが有効になります。
このチェックでは、レスポンスオブジェクトに設定されたキャッシュヘッダと、リクエストで送信されたキャッシュヘッダを比較し、
クライアントが最後にレスポンスを要求したときから変更されていないかどうかを判断します。
以下のリクエストヘッダが使用されます。:

* ``If-None-Match`` はレスポンスの ``Etag`` ヘッダーと比較されます。
* ``If-Modified-Since`` はレスポンスの ``Last-Modified`` ヘッダーと比較されます。

レスポンスヘッダがリクエストヘッダの基準と一致する場合、 ビューのレンダリングはスキップされます。
これにより、アプリケーションがビューを生成する手間が省け、帯域幅と時間を節約することができます。
レスポンスヘッダが一致した場合、空のレスポンスが ``304 Not Modified`` というステータスコードとともに返されます。
