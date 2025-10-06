Ferramenta de Rotas
###################

A ferramenta de rotas fornece uma interface CLI simples de usar para testar e depurar
rotas. Você pode usá-la para testar como as rotas são analisadas e quais URLs os parâmetros de
roteamento irão gerar.

Obtendo uma Lista de todas as Rotas
------------------------------------

.. code-block:: console

    bin/cake routes

Testando a Análise de URL
-------------------------

Você pode ver rapidamente como uma URL será analisada usando o método ``check``:

.. code-block:: console

    bin/cake routes check /articles/edit/1

Se sua rota contiver parâmetros de query string, lembre-se de colocar a URL
entre aspas:

.. code-block:: console

    bin/cake routes check "/articles/?page=1&sort=title&direction=desc"

Testando a Geração de URL
-------------------------

Você pode ver a URL que um :term:`routing array` irá gerar usando o
método ``generate``:

.. code-block:: console

    bin/cake routes generate controller:Articles action:edit 1

