Herramienta de servidor
#######################

El ``ServerCommand`` te permite crear un servidor web simple utilizando el
servidor web PHP integrado. Si bien este servidor *no* está diseñado para uso
en producción, puede ser útil en el desarrollo cuando desea probar rápidamente
una idea y no quiere perder tiempo configurando Apache o Nginx. Puedes iniciar
el servidor con el comando:

.. code-block:: console

    bin/cake server

Deberías ver que el servidor arranca y se conecta al puerto 8765. Puedes visitar
el servidor CLI visitando ``http://localhost:8765`` en su navegador web.
Para cerrar el servidor presiona ``CTRL-C`` en tu terminal.

.. note::

    Prueba ``bin/cake server -H 0.0.0.0`` si no se puede acceder al servidor
    desde otros hosts.

Cambiar el puerto y la raíz del documento
=========================================

Puedes personalizar el puerto y el directorio raíz usando las opciones:

.. code-block:: console

    bin/cake server --port 8080 --document_root path/to/app
