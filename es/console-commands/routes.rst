Herramienta de enrutamiento (Routes)
####################################

La herramienta de rutas proporciona una interfaz CLI fácil de usar para probar
y depurar rutas. Puede usarlo para probar cómo se analizan las rutas y qué
parámetros de enrutamiento de URL generarán.

Obtener una lista de todas las rutas
------------------------------------

.. code-block:: console

    bin/cake routes

Prueba de análisis de URL
-------------------------

Puedes ver rápidamente cómo se analizará una URL usando el método ``check``:

.. code-block:: console

    bin/cake routes check /articles/edit/1

Si su ruta contiene algún parámetro de cadena de consulta, recuerde encerrar
la URL entre comillas:

.. code-block:: console

    bin/cake routes check "/articles/?page=1&sort=title&direction=desc"

Prueba de generación de URL
---------------------------

Puede ver la URL que generará :term:`arreglo de enrutamiento` usando el método ``generar``:

.. code-block:: console

    bin/cake routes generate controller:Articles action:edit 1

