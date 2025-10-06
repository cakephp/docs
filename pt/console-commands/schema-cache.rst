Ferramenta de Cache de Schema
##############################

O SchemaCacheCommand fornece uma ferramenta CLI simples para gerenciar os
caches de metadados da sua aplicação. Em situações de implantação, é útil reconstruir o cache de metadados
no local sem limpar os dados de cache existentes. Você pode fazer isso
executando:

.. code-block:: console

    bin/cake schema_cache build --connection default

Isso reconstruirá o cache de metadados para todas as tabelas na conexão ``default``.
Se você precisar reconstruir apenas uma única tabela, pode fazer isso
fornecendo seu nome:

.. code-block:: console

    bin/cake schema_cache build --connection default articles

Além de construir dados em cache, você pode usar o SchemaCacheShell para remover
metadados em cache também:

.. code-block:: console

    # Clear all metadata
    bin/cake schema_cache clear

    # Clear a single table
    bin/cake schema_cache clear articles
