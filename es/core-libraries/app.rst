La clase App
############

.. php:namespace:: Cake\Core

.. php:class:: App

La clase App se encarga de la localización de recursos y de la 
administración de rutas.

Búsqueda de clases
===============

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

Éste método se utiliza para resolver el nombre completo de una clase en todo Cakephp.
Como parámetros del método entran los nombre cortos que usa CakePHP y devuelve 
el nombre completo (La ruta relativa al espacio de trabajo)::

    // Resuelve el nombre de clase corto utilizando el nombre y el sufijo.
    App::classname('Auth', 'Controller/Component', 'Component');
    // Salida: Cake\Controller\Component\AuthComponent

    // Resuelve el nombre de plugin.
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Salida: DebugKit\Controller\Component\ToolbarComponent

    // Nombres con '\' se devuelven inalterados.
    App::classname('App\Cache\ComboCache');
    // Salida: App\Cache\ComboCache

A la hora de resolver clases, primero se prueba con el espacio de nombres de
``App``, si no existe, se prueba con el espacio de nombres de  ``Cake``
. Si no existe ninguno, devuelve ``false``.

Búsqueda de rutas al espacio de nombres
=======================================

.. php:staticmethod:: path(string $package, string $plugin = null)

Se usa para la búsqueda de rutas basada en convenio de nombres de 
CakePHP::

    // Buscar la ruta de Controller/ en tu aplicación
    App::path('Controller');

Se puede utilizar para todos los espacios de nombres de tu 
aplicacón. Además puedes extraer rutas de plugins::

    // Devuelve la ruta del 'Component' en DebugKit
    App::path('Component', 'DebugKit');

``App::path()`` sólo devuelve la ruta por defecto,no mostrará ningún tipo de 
información sobre las rutas adicionales configuadas en autoloader.

.. php:staticmethod:: core(string $package)

Se usa para buscar rutas de paquetes dentro del core de Cakephp::

    // Devuelve la ruta de engine de cake.
    App::core('Cache/Engine');


Búsqueda de plugins
===================

.. php:staticmethod:: Plugin::path(string $plugin)

Los plugins se localizan con el método Plugin. Por ejemplo, ``Plugin::path('DebugKit');``
devuelve la ruta completa al plugin DebugKit::

    $path = Plugin::path('DebugKit');

Localización de temas (nota:'themes')
=============================

Dado que los temas (nota:'themes') son también plugins, 
se localizan con el método anterior, "Plugin".
(nota:'Aquí se refiere a los themes que se pueden crear 
para modificar el comportamiento del bake, generador de código.')

Cargar archivos externos (nota: 'vendor')
====================

Lo ideal es que los archivos externos ('vendor') se carguen automáticamente
usando ``Composer``, si necesita archivos externos que no se pueden cargar
automáticamente o no se pueden instalar con el Composer, entonces hay que usar
``require`` para cargarlos.

Si no puede instalar alguna librería con el Composer, debería instalar cada librería
en el directorio apropiado, siguiendo el convenio del Composer: ``vendor/$author/$package``.
Si tiene una librería de autor 'Acme' que se llama 'AcmeLib', la tiene que instalar en: 
``vendor/Acme/AcmeLib``. Asumiendo que la librería no usa nombres de clase compatibles 
con 'PSR-0', puede cargar las clases definiéndolas en el ``classmap``, dentro del archivo: 
``composer.json`` en su aplicación::

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

Si la librería no usa clases y sólo proporciona métodos,puede configurar 
el Composer para que cargue esos archivos al inicio de cada petición('request'), 
usando la estrategia de carga automática de ficheros ``files``, como sigue::

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

Después de la configuración de las librerías externas, tiene que regenerar el 
autoloader de su aplicación usando::

    $ php composer.phar dump-autoload

Si no usa Composer en su aplicación, tendrá que cargar manualmente cada librería en
su aplicación.

.. meta::
    :title lang=es: La clase App
    :keywords lang=es: implementación compatible,comportamientos de modelos,administración de rutas,carga de archivos,clase php,carga de clases,comportamiento del modelo,localización de clase,componente model,management class,autoloader,autocarga,nombre de clase,localización de directorio,sobreescritura,convenios,lib,librería,textile,cakephp,php classes, cargado
