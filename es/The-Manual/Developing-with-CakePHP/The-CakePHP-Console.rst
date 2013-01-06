La consola de CakePHP
#####################

Esta sección provee una introducción a CakePHP en la línea de comandos.
Si tu alguna vez has utilizado tus clases MVC de CakePHP en un cron job
o cualquier otro script de línea de comandos, esta sección es para ti.

PHP provee un poderoso cliente CLI que hace que crear interfases entre
tus archivos de sistema y tus aplicaciones sea mucho más sencillo. La
Consola CakePHP provee un framework para crear scritps de shell. La
Consola usa una configuración del tipo despachador para cargar una un
shell o una tarea, y para regresar sus parámetros.

Una versión de línea de comandos (cli) de PHP debe de estar disponible
en el sistema si planeas usar la Consola.

Antes de que nos metamos en cosas más específicas, hay que asegurarnos
de que podemos correr CakePHP en consola. Primero, necesitas abrir una
terminal el sistema. Los ejemplos mostrados en esta sección serán en
bash, pero la Consola e CakePHP es compatible con Windows también.
Ejecutemos el programa de Consola desde bash. Este ejemplo asume que el
usuario ya esta logeado en una sesión de bash y se encuentra en la raíz
de la instalación de CakePHP.

Puedes técnicamente correr la consola usando algo similar a esto:

::

    $ cd /my/cake/app_folder
    $ ../cake/console/cake

Pero el uso preferido es agregando el directorio de consola a tu ruta
para que puedas usar el comando cake en cualquier lado:

::

    $ cake

Ejecutar la Consola sin argumentos produce el siguiente mensaje de
ayuda:

::

    Hello user,
     
    Welcome to CakePHP v1.2 Console
    ---------------------------------------------------------------
    Current Paths:
     -working: /path/to/cake/
     -root: /path/to/cake/
     -app: /path/to/cake/app/
     -core: /path/to/cake/
     
    Changing Paths:
    your working path should be the same as your application path
    to change your path use the '-app' param.
    Example: -app relative/path/to/myapp or -app /absolute/path/to/myapp
     
    Available Shells:
     
     app/vendors/shells/:
             - none
     
     vendors/shells/:
             - none
     
     cake/console/libs/:
             acl
             api
             bake
             console
             extract
     
    To run a command, type 'cake shell_name [args]'
    To get help on a specific command, type 'cake shell_name help'

La primera información mostrada se relaciona con las rutas. Esto es
epecialmente útil si estas ejecutando la consola de diferentes partes
del sistema de archivos.

Muchos usuarios agregan la Consola de CakePHP a sus rutas del sistema
operativo para que pueda ser ejecutado fácilmente. Imprimiendo las rutas
del directorio de trabajo root, app, y core te permite ver donde la
Consola hará los cambios. Para cambiar la carpeta de app con el que
deseas trabajar, puedes proporcionar su ruta como el primer argumento al
comando cake. Este siguiente ejemplo nos muestra como especificar un
folder de app, asumiendo que ya has agregado el carpeta de la consola en
tu PATH:

::

    $ cake -app /path/to/app

La ruta provista puede ser relativa al directorio de trabajo actual o
provista como una ruta absoluta.

Creando Shells y Tasks
======================

Creando tus Propios Shells
--------------------------

Crearemos una shell para usarla en la Consola. Para este ejemplo,
crearemos una ‘report' shell que imprima datos de un modelo. Primero,
crea un report.php en /vendors/shells/.

::

    <?php 
    class ReportShell extends Shell {
        function main() {}
    }
    ?>

Desde este punto, ya podemos correr el shell, pero no hará mucho.
Agreguemos algunos modelos al shell para que podamos crear un reporte de
algún tipo. Esto se hace de la misma forma que en el controlador: al
agregar los nombres de los modelos a la variable $uses;

::

    <?php
    class ReportShell extends Shell {
        var $uses = array('Order');

        function main() {
        }
    }
    ?>

Una vez que agregamos nuestro modelo al arreglo $uses, podemos usarlo en
el método main(); En este ejemplo, nuestro modelo Order debe de ahora
ser accesible como $this->Order en el método main() de nuestro nuevo
shell.

Aquí hay un ejemplo simple de la lógica que podemos usar en este shell:

::

    class ReportShell extends Shell {
        var $uses = array('Order');
        function main() {
            //Agrega las órdenes enviadas el mes pasado.
            $month_ago = date('Y-m-d H:i:s',    strtotime('-1 month'));
            $orders =    $this->Order->find("all",array('conditions'=>"Order.shipped >= '$month_ago'"));

            //Imprime la información de cada orden.
            foreach($orders as $order) {
                $this->out('Order date:  ' .    $order['Order']['created'] . "\n");
                $this->out('Amount: $' .    number_format($order['Order']['amount'], 2) . "\n");
                $this->out('----------------------------------------' .    "\n");
         
                $total += $order['Order']['amount'];
            }

            //Imprime el total de las ordenes seleccionadas.
            $this->out("Total: $" .    number_format($total, 2) . "\n"); 
        }
    }

Debes de ser capás de correr este reporte ejecutando este comando (si el
comando cake esta en tu PATH):

::

    $ cake report 

donde report es el nombre del archivo shell en /vendor/shells/ sin la
extensión .php. Esto deberá regresar lo siguiente:

::

    Hello user,
       Welcome to    CakePHP v1.2 Console
       ---------------------------------------------------------------
       App : app
       Path:    /path/to/cake/app
       ---------------------------------------------------------------
       Order date:    2007-07-30 10:31:12
       Amount:    $42.78
       ----------------------------------------
       Order date:    2007-07-30 21:16:03
       Amount:    $83.63
       ----------------------------------------
       Order date:    2007-07-29 15:52:42
       Amount:    $423.26
       ----------------------------------------
       Order date:    2007-07-29 01:42:22
       Amount:    $134.52
       ----------------------------------------
       Order date:    2007-07-29 01:40:52
       Amount:    $183.56
       ----------------------------------------
       Total:    $867.75

Tasks (Tareas)
--------------

Los tasks (tareas) son pequeñas extensiones para los shells. Nos
permiten que haya lógica comapartida entre shells, y son agregadas a
nuestros shells usando una variable de clase especial $task. Por ejemplo
en la shell core de bake, hay un cierto número de tasks definidos:

::

    <?php 
    class BakeShell extends Shell {
       var $tasks = array('Project', 'DbConfig', 'Model', 'View', 'Controller');
    }
    ?>

Los tasks son almacenados en /vendors/shells/tasks/ en archivos con el
nombre de sus clases. Así que si quisiéramos crear una nueva tarea
‘cool’ , la clase CookTask (que extiende de Shell) sería colocada en
/vendors/shells/tasks/cool.php. La clase VeryCoolTask (que extiende
Shell) sería colocada en /vendors/shells/tasks/cool.php.

Cada task debe de tener por lo menos un método execute() - los shells
llamarán a este método para iniciar la lógica del task.

::

    <?php
    class SoundTask extends Shell {
       var $uses = array('Model'); // Lo mismo que en el controlador var $uses
       function execute() {}
    }
    ?>

Puedes acceder a tasks dentro de tus clases de shell y ejecutarlas desde
ahí:

::

    <?php 
    class SeaShell extends Shell // Se encuentra en /vendors/shells/sea.php {
       var $tasks = array('Sound'); //Se encuentra en  /vendors/shells/tasks/sound.php
       function main() {
           $this->Sound->execute();
       }
    }
    ?>

Un método llamado “sound” en la clase SeaShell podría sustituir la
habilidad de acceder a la funcionalidad de la tarea Sound especificada
en el arreglo $tasks.

Puedes también acceder a los tasks directamente desde la línea de
comados:

::

    $ cake sea sound

Ejecutando Shells con cronjobs
==============================

Algo común de hacer con shell, es realizar un cronjob para limpiar la
base de datos de vez en cuando, o enviar un boletín de noticias
(newsletters). Sin embargo, cuando se haya agregado la ruta de la
consola a la variable PATH via ``~/.profile``, éste no estará disponible
al cronjob.

La siguiente secuencia de comandos BASH llama al shell y agrega los path
necesarios a $PATH. A continuación copia y guarda lo siguiente en tu
carpeta vendors como 'cakeshell' y no olvides de darle permisos de
ejecución. (``chmod +x cakeshell``)

::

    #!/bin/bash
    TERM=dumb
    export TERM
    cmd="cake"
    while [ $# -ne 0 ]; do
        if [ "$1" = "-cli" ] || [ "$1" = "-console" ]; then 
            PATH=$PATH:$2
            shift
        else
            cmd="${cmd} $1"
        fi
        shift
    done
    $cmd

Para llamarlo:

::

    $ ./vendors/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console

El parámetro ``-cli`` toma un path que apunta a el cli de php ejecutable
y el parámetro ``-console`` toma un path que apunta a la consola de
CakePHP.

Como éste cronjob:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app

Un truco simple para realizar un debug de un crontab es configurar un
archivo de registro para que guarde la salida. Puedes hacer esto con:

::

    # m h dom mon dow command
    */5 *   *   *   * /full/path/to/cakeshell myshell myparam -cli /usr/bin -console /cakes/1.2.x.x/cake/console -app /full/path/to/app >> /path/to/log/file.log

