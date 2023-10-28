.. _plugin-shell:

Herramienta de complemento (Plugin)
###################################

La herramienta de complemento le permite cargar y descargar complementos a
través del símbolo del sistema. Si necesita ayuda, ejecute:

.. code-block:: console

    bin/cake plugin --help

Cargando complementos
---------------------

A través de la tarea ``Load`` puedes cargar complementos en tu
**config/bootstrap.php**. Puedes hacer esto ejecutando:

.. code-block:: console

    bin/cake plugin load MyPlugin

Esto agregará lo siguiente a su **src/Application.php**::

    // En el método bootstrap agregue:
    $this->addPlugin('MyPlugin');

Descarga de complementos
------------------------

Puede descargar un complemento especificando su nombre:

.. code-block:: console

    bin/cake plugin unload MyPlugin

Esto eliminará la línea ``$this->addPlugin('MyPlugin',...)`` de
**src/Application.php**.

Activos del complemento (Assets)
---------------------------------

CakePHP sirve de forma predeterminada recursos de complementos utilizando el
middleware ``AssetMiddleware``. Si bien esto es una buena conveniencia, se
recomienda vincular/copiar los activos del complemento en la raíz web de la
aplicación para que el servidor web pueda servirlos directamente sin invocar
PHP. Puedes hacer esto ejecutando:

.. code-block:: console

    bin/cake plugin assets symlink

La ejecución del comando anterior vinculará simbólicamente todos los recursos de
los complementos en la raíz web de la aplicación. En Windows, que no admite
enlaces simbólicos, los activos se copiarán en las carpetas respectivas en lugar
de tener enlaces simbólicos.

Puede vincular simbólicamente los activos de un complemento en particular
especificando su nombre:

.. code-block:: console

    bin/cake plugin assets symlink MyPlugin

.. meta::
    :title lang=es: Herramienta de complemento (Plugin)
    :keywords lang=es: plugin,assets,tool,load,unload,complemento,activos
