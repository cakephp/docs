Glossário
#########
.. glossary::

    routing array
        Uma série de atributos que são passados para :php:meth:`Router::url()`.
        Eles normalmente parecem::

            ['controller' => 'Posts', 'action' => 'view', 5]

    HTML attributes
        Uma série de arrays key => values que são compostos em atributos HTML. Por Exemplo::

            // Tendo isso
            ['class' => 'my-class', 'target' => '_blank']

            // Geraria isto
            class="my-class" target="_blank"

        Se uma opção pode ser minimizada ou aceitar seu nome como valor, então ``true``
        pode ser usado::

            // Tendo isso
            ['checked' => true]

            // Geraria isto
            checked="checked"

    sintaxe plugin
        A sintaxe do plugin refere-se ao nome da classe separada por pontos que indica classes::

            // O plugin "DebugKit", e o nome da "Toolbar".
            'DebugKit.Toolbar'

            // O plugin "AcmeCorp/Tools", e o nome da class  "Toolbar".
            'AcmeCorp/Tools.Toolbar'

    dot notation
        A notação de ponto define um caminho do array, separando níveis aninhados com ``.``
        Por exemplo::

            Cache.default.engine

        Geraria o seguinte valor::

            [
                'Cache' => [
                    'default' => [
                        'engine' => 'File'
                    ]
                ]
            ]

    CSRF
        Cross Site Request Forgery. Impede ataques de repetição, envios duplos e solicitações forjadas de outros domínios.

    CDN
        Content Delivery Network. Um fornecedor de código de terceiros que você pode pagar para ajudar a distribuir seu conteúdo para centros de dados em todo o mundo. Isso ajuda a colocar seus ativos estáticos mais próximos dos usuários distribuídos geograficamente.

    routes.php
        O arquivo ``config`` diretório que contém configuração de roteamento. Este arquivo está incluído antes de cada solicitação ser processada. Ele deve conectar todas as rotas que seu aplicativo precisa para que as solicitações possam ser encaminhadas para a ação correta do controlador.

    DRY
        Não se repita. É um princípio de desenvolvimento de software destinado a reduzir a repetição de informações de todos os tipos. No CakePHP DRY é usado para permitir codificar coisas uma vez e reutilizá-las em toda a sua aplicação.

    PaaS
        Plataforma como um serviço. A plataforma como um provedor de serviços fornecerá recursos baseados em nuvem de hospedagem, banco de dados e armazenamento em cache. Alguns provedores populares incluem Heroku, EngineYard e PagodaBox.

    DSN
        Data Source Name. Um formato de seqüência de conexão que é formado como um URI. O CakePHP suporta DSN para conexões Cache, Database, Log e Email.
