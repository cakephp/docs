.. _plugin-shell:

Ferramenta de Plugin
####################

A ferramenta de plugin permite carregar e descarregar plugins via prompt de comando.
Se você precisar de ajuda, execute:

.. code-block:: console

    bin/cake plugin --help

Carregando Plugins
------------------

Através da tarefa ``Load`` você pode carregar plugins em seu
**config/bootstrap.php**. Você pode fazer isso executando:

.. code-block:: console

    bin/cake plugin load MyPlugin

Isso adicionará o seguinte ao seu **src/Application.php**::

    // In the bootstrap method add:
    $this->addPlugin('MyPlugin');


Descarregando Plugins
---------------------

Você pode descarregar um plugin especificando seu nome:

.. code-block:: console

    bin/cake plugin unload MyPlugin

Isso removerá a linha ``$this->addPlugin('MyPlugin',...)`` de
**src/Application.php**.

Assets de Plugin
----------------

O CakePHP por padrão serve assets de plugins usando o middleware ``AssetMiddleware``.
Embora isso seja conveniente, é recomendado criar um link simbólico / copiar
os assets do plugin para o webroot da aplicação para que eles possam ser servidos diretamente pelo
servidor web sem invocar o PHP. Você pode fazer isso executando:

.. code-block:: console

    bin/cake plugin assets symlink

Executar o comando acima criará links simbólicos de todos os assets de plugins no webroot da aplicação.
No Windows, que não suporta links simbólicos, os assets serão copiados nas
respectivas pastas em vez de serem vinculados simbolicamente.

Você pode criar links simbólicos de assets de um plugin específico especificando seu nome:

.. code-block:: console

    bin/cake plugin assets symlink MyPlugin

.. meta::
    :title lang=en: Plugin tool
    :keywords lang=en: plugin,assets,tool,load,unload
