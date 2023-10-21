Herramienta de servidor
#######################

El ``ServerCommand`` le permite crear un servidor web simple utilizando el
servidor web PHP integrado. Si bien este servidor *no* está diseñado para uso
en producción, puede ser útil en el desarrollo cuando desea probar rápidamente
una idea y no quiere perder tiempo configurando Apache o Nginx. Puede iniciar
el comando del servidor con:

.. code-block:: console

    bin/cake server

Debería ver que el servidor arranca y se conecta al puerto 8765. Puede visitar
el servidor CLI visitando ``http://localhost:8765`` en su navegador web.
Puede cerrar el servidor presionando ``CTRL-C`` en su terminal.

.. note::

    Pruebe ``bin/cake server -H 0.0.0.0`` si no se puede acceder al servidor
    desde otros hosts.

Cambiar el puerto y la raíz del documento
=========================================

Puede personalizar el puerto y la raíz del documento usando las opciones:

.. code-block:: console

    bin/cake server --port 8080 --document_root path/to/app
