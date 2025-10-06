Glossário
#########

.. glossary::

    CDN
        Content Delivery Network. Um fornecedor de código de terceiros que você 
        pode pagar para ajudar a distribuir seu conteúdo para centros de dados 
        em todo o mundo. Isso ajuda a colocar seus ativos estáticos mais próximos 
        dos usuários distribuídos geograficamente.

    columns
        Usado no ORM ao se referir às colunas de uma tabela em um banco de dados.

    CSRF
        Cross Site Request Forgery. Impede ataques de repetição, 
        envios duplos e solicitações forjadas de outros domínios.

    DI Container
        Em ``Application::services()`` você pode configurar serviços de aplicação
        e suas dependências. Os serviços de aplicação são injetados automaticamente
        em ações do Controller e Construtores de Comando. Consulte
        :doc:`/development/dependency-injection`.

    DSN
        Nome da Fonte de Dados. Um formato de string de conexão que é formado como um URI.
        O CakePHP suporta DSNs para conexões de Cache, Banco de Dados, Log e E-mail.

    dot notation
        A notação de ponto define um caminho de array, separando os níveis aninhados com ``.``
        Por exemplo::

            Cache.default.engine

        Apontaria para o seguinte valor::

            [
                'Cache' => [
                    'default' => [
                        'engine' => 'File'
                    ]
                ]
            ]

    DRY
        Não se repita. É um princípio de desenvolvimento de software que visa
        reduzir a repetição de informações de todos os tipos. No CakePHP, o DRY é usado
        para permitir que você codifique as coisas uma vez e as reutilize em toda a sua
        aplicação.

    campos
        Um termo genérico usado para descrever propriedades de entidades ou colunas
        de banco de dados. Frequentemente usado em conjunto com o FormHelper.

    attributos HTML
        Uma chave de array => valores que são compostos em atributos HTML. Por exemplo::

            // Considerando
            ['class' => 'my-class', 'target' => '_blank']

            // Geraria
            class="my-class" target="_blank"

        Se uma opção puder ser minimizada ou aceitar seu nome como valor, então ``true``
        pode ser usado::

            // Considerando
            ['checked' => true]

            // Geraria
            checked="checked"

    PaaS
        Plataforma como Serviço. Os provedores de Plataforma como Serviço fornecerão
        recursos de hospedagem, banco de dados e cache baseados em nuvem. Alguns provedores
        populares incluem Heroku, EngineYard e PagodaBox.

    propriedades
        Usado ao referenciar colunas mapeadas em uma entidade ORM.

    sintaxe de plugin
        Sintaxe de plugin refere-se ao nome da classe separado por pontos, indicando que as classes
        fazem parte de um plugin::

            // O plugin é "DebugKit" e o nome da classe é "Toolbar".
            'DebugKit.Toolbar'

            // O plugin é "AcmeCorp/Tools" e o nome da classe é "Toolbar".
            'AcmeCorp/Tools.Toolbar'

    routes.php
        Um arquivo no diretório ``config`` que contém a configuração de roteamento.
        Este arquivo é incluído antes do processamento de cada solicitação.
        Ele deve conectar todas as rotas que sua aplicação precisa para que
        as solicitações possam ser roteadas para o controller + ação corretos.

    routing array
        Um conjunto de atributos que são passados ​​para :php:meth:`Router::url()`.
        Eles normalmente se parecem com::

            ['controller' => 'Posts', 'action' => 'view', 5]

.. meta::
    :title lang=pt: Glossário
    :keywords lang=pt: atributos HTML, classe de array, controller de array, glossário,target blank, campos, propriedades, colunas, notação de ponto, configuração de roteamento, falsificação, repetição, roteador, sintaxe, configuração, envios