用語集
######

.. glossary::

    ルーティング配列
        :php:meth:`Router::url()` に渡される属性の配列。
        典型的には以下のようになります::

            array('controller' => 'posts', 'action' => 'view', 5)

    HTML属性
        HTMLの属性を構成するキー => 値の配列。例::

            // これを与えると
            array('class' => 'my-class', '_target' => 'blank')

            // これが生成される
            class="my-class" _target="blank"

        オプションが最小化できるか、名前そのもが値として許可される場合は、 ``true`` が利用できます::

            // これを与えると
            array('checked' => true)

            // これが生成される
            checked="checked"

    plugin syntax
        Plugin syntax refers to the dot separated class name indicating classes
        are part of a plugin::

            // The plugin is "DebugKit", and the class name is "Toolbar".
            'DebugKit.Toolbar'

            // The plugin is "AcmeCorp/Tools", and the class name is "Toolbar".
            'AcmeCorp/Tools.Toolbar'

    dot notation
        Dot notation defines an array path, by separating nested levels with ``.``
        For example::

            Cache.default.engine

        Would point to the following value::

            [
                'Cache' => [
                    'default' => [
                        'engine' => 'File'
                    ]
                ]
            ]

    CSRF
        クロスサイトリクエストフォージェリ(*Cross Site Request Forgery*)。
        再生攻撃、二重投稿、他ドメインからの偽造リクエストを防止します。

    CDN
        Content Delivery Network. A 3rd party vendor you can pay to help
        distribute your content to data centers around the world. This helps
        put your static assets closer to geographically distributed users.

    routes.php
        A file in ``config`` directory that contains routing configuration.
        This file is included before each request is processed.
        It should connect all the routes your application needs so
        requests can be routed to the correct controller + action.

    DRY
        同じことを繰り返さない(Don’t repeat yourself)。これはあらゆる情報の繰り返しを少なくするためのソフトウェア開発の原則です。
        CakePHPでは同じコードは1箇所に書いて再利用するという形でDRY原則に従っています。

    PaaS
        Platform as a Service. Platform as a Service providers will provide
        cloud based hosting, database and caching resources. Some popular
        providers include Heroku, EngineYard and PagodaBox

    DSN
        Data Source Name. A connection string format that is formed like a URI.
        CakePHP supports DSN's for Cache, Database, Log and Email connections.
