Ferramenta de CounterCache
##########################

O CounterCacheCommand fornece uma ferramenta CLI para reconstruir os caches de contadores
nos seus modelos de aplicativo e plugin. Ele pode ser usado em operações de manutenção e
recuperação, ou para preencher novos caches de contadores adicionados ao seu
aplicativo.

.. code-block:: console

   bin/cake counter_cache --assoc Comments Articles

Isso reconstruiria os contadores relacionados a ``Comentários`` na tabela ``Artigos``.
Para tabelas muito grandes, pode ser necessário reconstruir os contadores em lotes. Você pode usar
as opções ``--limit`` e ``--page`` para reconstruir o estado dos contadores de forma incremental.

.. code-block:: console

   bin/cake counter_cache --assoc Comments --limit 100 --page 2 Articles

Quando ``limit`` e ``page`` são usados, os registros serão ordenados pela
chave primária da tabela.

.. versionadded:: 5.2.0
