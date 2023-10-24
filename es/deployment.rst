Despliegue
##########

Una vez que tu aplicación esté lista para ser desplegada, hay algunas cosas que debes hacer.

Mover archivos
==============

Puedes clonar tu repositorio en tu servidor de producción y luego seleccionar la
revisión/etiqueta que deseas ejecutar. Luego, ejecuta ``composer install``. Aunque esto requiere
un cierto conocimiento sobre git y una instalación existente de ``git`` y ``composer``,
este proceso se encargará de las dependencias de las bibliotecas y los permisos de archivos y carpetas.

Ten en cuenta que al desplegar a través de FTP deberás corregir los permisos de archivo y
carpeta.

También puedes utilizar esta técnica de despliegue para configurar un servidor de pruebas o demostración
(preproducción) y mantenerlo sincronizado con tu entorno local.

Ajustar la configuración
========================

Querrás hacer algunos ajustes en la configuración de tu aplicación para
un entorno de producción. El valor de ``debug`` es extremadamente importante.
Al desactivar debug = ``false`` se deshabilitan una serie de características de desarrollo que no deberían
ser expuestas a Internet en general. Deshabilitar debug cambia las siguientes
características:

* Los mensajes de depuración, creados con :php:func:`pr()`, :php:func:`debug()` y :php:func:`dd()`,
  están deshabilitados.
* La duración de las cachés básicas de CakePHP se establece en 365 días, en lugar de 10 segundos,
  como en desarrollo.
* Las vistas de errores son menos informativas y se muestran páginas de error genéricas
  en lugar de mensajes de error detallados con trazas de pila.
* Los avisos y errores de PHP no se muestran.

Además de lo anterior, muchos complementos y extensiones de la aplicación usan ``debug``
para modificar su comportamiento.

Puedes utilizar una variable de entorno para establecer dinámicamente el nivel de depuración
entre entornos. Esto evitará desplegar una aplicación con debug
``true`` y también te ahorrará tener que cambiar el nivel de depuración cada vez
antes de desplegar en un entorno de producción.

Por ejemplo, puedes establecer una variable de entorno en tu configuración de Apache::

    SetEnv CAKEPHP_DEBUG 1

Y luego puedes establecer dinámicamente el nivel de depuración en **app_local.php**::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

Se recomienda que coloques la configuración que se comparte en todas
los entornos de tu aplicación en **config/app.php**. Para la configuración que
varía entre entornos, utiliza **config/app_local.php** o variables de entorno.

Verificar tu Seguridad
======================

Si estás lanzando tu aplicación al mundo, es una buena idea asegurarte de que no tenga ningun problema de seguridad obvio:

* Asegúrate de estar usando el componente o middleware :ref:`csrf-middleware`.
* Puedes habilitar el componente :doc:`/controllers/components/form-protection`.
  Puede ayudar a prevenir varios tipos de manipulación de formularios y reducir la posibilidad
  de problemas de asignación masiva.
* Asegúrate de que tus modelos tengan las reglas de :doc:`/core-libraries/validation` correctas
  habilitadas.
* Verifica que solo tu directorio ``webroot`` sea públicamente visible y que tus
  secretos (como tu sal de aplicación y cualquier clave de seguridad) sean privados y únicos
  también.

Establecer la Raíz (Document Root)
==================================

Establecer correctamente la raíz en tu aplicación es un paso importante para
mantener tanto tu código como tu aplicación seguros. Las aplicaciones de CakePHP
deben tener la raíz establecida en el ``webroot`` de la aplicación. Esto
hace que los archivos de aplicación y configuración sean inaccesibles a través de una URL.
Establecer la raíz es diferente para diferentes servidores web. Consulta la
documentación de :ref:`url-rewriting` para obtener información específica del servidor web.

En todos los casos, querrás establecer la raiz del host virtual/dominio en
``webroot/``. Esto elimina la posibilidad de que se ejecuten archivos fuera del directorio raíz.

.. _symlink-assets:

Mejora el Rendimiento de tu Aplicación
=======================================

La carga de clases puede llevarse una gran parte del tiempo de procesamiento de tu aplicación.
Para evitar este problema, se recomienda que ejecutes este comando en tu servidor de producción una vez que la aplicación esté implementada::

    php composer.phar dumpautoload -o

Dado que manejar los archivos estáticos, como imágenes, archivos JavaScript y CSS de
los complementos, a través del ``Dispatcher`` es increíblemente ineficiente, se recomienda encarecidamente crear enlaces simbólicos para producción. Esto se puede hacer usando
el comando ``plugin``::

    bin/cake plugin assets symlink

El comando anterior creará enlaces simbólicos del directorio ``webroot`` de todos los complementos cargados
a la ruta adecuada en el directorio ``webroot`` de la aplicación.

Si tu sistema de archivos no permite crear enlaces simbólicos, los directorios se copiarán en lugar de enlazarse. También puedes copiar explícitamente los directorios usando::

    bin/cake plugin assets copy

CakePHP utiliza internamente ``assert()`` para proporcionar comprobación de tipos en tiempo de ejecución y
proporcionar mejores mensajes de error durante el desarrollo. Puedes hacer que PHP omita estas
comprobaciones ``assert()`` actualizando tu ``php.ini`` para incluir:

.. code-block:: ini

   ; Desactivar la generación de código assert().
   zend.assertions = -1

Omitir la generación de código para ``assert()`` proporcionará un rendimiento de ejecución más rápido,
y se recomienda para aplicaciones que tienen una buena cobertura de pruebas o que están
usando un analizador estático.

Desplegar una actualización
============================

En cada implementación es probable que tengas algunas tareas para coordinar en tu servidor web. Algunas tareas típicas son:

1. Instalar dependencias con ``composer install``. Evita usar ``composer
   update`` al hacer implementaciones, ya que podrías obtener versiones inesperadas de paquetes.
2. Ejecutar `migraciones de base de datos </migrations/>`__ con el complemento Migrations
   u otra herramienta.
3. Limpiar la caché del esquema del modelo con ``bin/cake schema_cache clear``. La página :doc:`/console-commands/schema-cache`
   tiene más información sobre este comando.

.. meta::
    :title lang=es: Despliegue
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
