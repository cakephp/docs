Herramienta de esquemas de caché (Schema Cache)
################################################

SchemaCacheShell proporciona una herramienta CLI sencilla para administrar las
cachés de metadatos de su aplicación. En situaciones de implementación, resulta
útil reconstruir la caché de metadatos in situ sin borrar los datos de la caché
existente. Puedes hacer esto ejecutando:

.. code-block:: console

    bin/cake schema_cache build --connection default

Esto reconstruirá el caché de metadatos para todas las tablas en la conexión
``default``. Si solo necesita reconstruir una única tabla, puede hacerlo
proporcionando su nombre:

.. code-block:: console

    bin/cake schema_cache build --connection default articles

Además de crear datos almacenados en caché, también puede utilizar
SchemaCacheShell para eliminar metadatos almacenados en caché:

.. code-block:: console

    # Borrar todos los metadatos
    bin/cake schema_cache clear

    # Limpiar una sola tabla
    bin/cake schema_cache clear articles
