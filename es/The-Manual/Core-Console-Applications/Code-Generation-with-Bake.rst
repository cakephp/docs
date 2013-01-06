Generación de Código con Bake
#############################

Ya has aprendido sobre scaffolding en CakePHP: una forma simple de armar
una aplicación con sólo una base de datos y algunas clases básicas. La
consola Bake es otro esfuerzo para tener CakePHP corriendo rápido. La
consola Bake puede crear cualquiera de los ingredientes básicos de
CakePHP: modelos, vistas y controladores. Y no estamos hablando sólo de
clases estructurales: Bake puede crear una aplicación completamente
funcional en sólo unos minutos. De hecho, Bake es el paso natural que
toman las aplicaciones una vez que han pasado por la etapa de
scaffolding

Para utilizar Bake necesitar ejecutar el script localizado en el
directorio /cake/console/

::

    $ cd ./cake/console/
    $ cake bake

Dependiendo de tu configuración, podrías necesitar darle permisos de
ejecución al script bash o llamarlo usando./cake bake. La consola de
Cake corre usando PHP CLI (command line interface). Si tienes algún
problema con el script, asegúrate de que tienes PHP CLI instalado y que
además tienes los módulos necesarios habilitados(Ej: MySQL).

Cuando utilices Bake por primera vez, te pedirá que crees un archivo de
configuración para la base de datos, si todavía no creaste uno.

Una vez que hayas configurado la base de datos, cuando ejecutes Bake te
presentará estas opciones:

::

    ---------------------------------------------------------------
    App : app
    Path: /ruta/al/proyecto
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/Q) 
    >  

Alternativamente, puedes ejecutar cualquiera de estos comandos
directamente de la línea de comandos:

::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view 
    $ cake bake controller
    $ cake bake project

