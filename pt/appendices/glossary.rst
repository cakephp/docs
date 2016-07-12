Glossário
#########

.. note::
    Atualmente, a documentação desta página não é suportada em português.

    Por favor, sinta-se a vontade para nos enviar um *pull request* para o
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **IMPROVE THIS DOC** para propor suas mudanças diretamente.

    Você pode consultar a versão em inglês deste tópico através do seletor de
    idiomas localizado ao lado direito do campo de buscas da documentação.

.. glossary::

    routing array
        An array of attributes that are passed to :php:meth:`Router::url()`.
        They typically look like::

            ['controller' => 'Posts', 'action' => 'view', 5]

    HTML attributes
        An array of key => values that are composed into HTML attributes. For example::

            // Given
            ['class' => 'my-class', 'target' => '_blank']

            // Would generate
            class="my-class" target="_blank"

        If an option can be minimized or accepts its name as the value, then ``true``
        can be used::

            // Given
            ['checked' => true]

            // Would generate
            checked="checked"

    sintaxe plugin
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
        Cross Site Request Forgery. Prevents replay attacks, double
        submissions and forged requests from other domains.

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
        Don't repeat yourself. Is a principle of software development aimed at
        reducing repetition of information of all kinds. In CakePHP DRY is used
        to allow you to code things once and re-use them across your
        application.

    PaaS
        Platform as a Service. Platform as a Service providers will provide
        cloud based hosting, database and caching resources. Some popular
        providers include Heroku, EngineYard and PagodaBox

    DSN
        Data Source Name. A connection string format that is formed like a URI.
        CakePHP supports DSN's for Cache, Database, Log and Email connections.
