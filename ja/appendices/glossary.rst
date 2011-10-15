用語集
######

.. glossary::

    ルーティング配列
        :php:meth:`Router::url()` に渡される属性の配列。
        典型的には以下のようになります::
        
            array('controller' => 'posts', 'action' => 'view', 5)

    HTML属性
        HTMLの属性を構成するキー => 値の配列。例::
            
            <?php
            // これを与えると
            array('class' => 'my-class', '_target' => 'blank')

            // これが生成される
            class="my-class" _target="blank"

        オプションが最小化できるか、名前そのもが値として許可される場合は、 ``true`` が利用できます::
        
            <?php
            // これを与えると
            array('checked' => true)
            
            // これが生成される
            checked="checked"
    
    プラグイン記法
        プラグイン記法はドットで区切られたクラス名で、クラスがプラグインの一部であることを指定しています。
        例えば、 ``DebugKit.Toolbar`` はDebugKitプラグインで、クラス名はToolbarです。
    
    ドット記法
        ドット記法は、 ``.`` を用いてネストされたレベルを区切ることによって配列のパスを定義します。
        例::
        
            Asset.filter.css
        
        は以下の値を指し示すことでしょう::
        
            array(
                'Asset' => array(
                    'filter' => array(
                        'css' => 'got me'
                    )
                )
            )
    CSRF
        クロスサイトリクエストフォージェリ(*Cross Site Request Forgery*)。
        再生攻撃、二重投稿、他ドメインからの偽造リクエストを防止します。

    routes.php
        APP/Config のファイルで、ルーティングの設定が入っています。
        このファイルは全てのリクエストが処理される前に読み込まれます。
        リクエストが正しいコントローラ+アクションにルーティングされるように、アプリケーションが必要とする全てのルートに接続する必要があります。
