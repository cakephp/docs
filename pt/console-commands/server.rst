Ferramenta de Servidor
######################

O ``ServerCommand`` permite que você inicie um servidor web simples usando o servidor web
integrado do PHP. Embora este servidor *não* seja destinado ao uso em produção, ele pode
ser útil no desenvolvimento quando você quiser testar rapidamente uma ideia e não quiser
gastar tempo configurando o Apache ou Nginx. Você pode iniciar o comando do servidor com:

.. code-block:: console

    bin/cake server

Você deve ver o servidor inicializar e se conectar à porta 8765. Você pode visitar o
servidor CLI visitando ``http://localhost:8765``
em seu navegador web. Você pode fechar o servidor pressionando ``CTRL-C`` em seu
terminal.

.. note::

    Tente ``bin/cake server -H 0.0.0.0`` se o servidor estiver inacessível de outros hosts.

Alterando a Porta e o Document Root
====================================

Você pode personalizar a porta e o document root usando opções:

.. code-block:: console

    bin/cake server --port 8080 --document_root path/to/app

