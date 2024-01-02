Comandos de Consola
###################

.. php:namespace:: Cake\Console

Además de ser un `framework` web, CakePHP también ofrece un `framework`
de consola para crear herramientas y aplicaciones de línea de comandos. Las aplicaciones
de consola son ideales para gestionar una variedad de tareas de mantenimiento
que aprovechan la configuración existente de tu aplicación, modelos, complementos y lógica de dominio.

CakePHP proporciona varias herramientas de consola para interactuar con sus características, como i18n
y enrutamiento, lo que te permite inspeccionar tu aplicación y generar archivos relacionados.

La Consola CakePHP
===================

La Console CakePHP utiliza un sistema de tipo `dispatcher` para cargar comandos, analizar sus
argumentos e invocar el comando correcto. Aunque los ejemplos a continuación usan bash, el
console de CakePHP es compatible con cualquier shell de Unix (\*nix) y Windows.

Una aplicación CakePHP tiene un directorio **src/Command** que contiene sus comandos. También incluye
un ejecutable en el directorio **bin**

.. code-block:: console

    $ cd /path/to/app
    $ bin/cake

.. note::

    Para Windows, el comando es ``bin\cake`` (note el `backslash`)

Ejecutar la console sin argumentos listará todos los comandos disponibles. Tú
puedes, de esta manera, ejecutar cualquiera de los comandos listados usando su nombre:

.. code-block:: console

    # ejecutar el comando server
    bin/cake server

    # ejecutar el comando migrations
    bin/cake migrations -h

    # ejecutar bake (con un prefijo de `plugin`)
    bin/cake bake.bake -h

Los comandos de los `plugins` pueden ser invocados sin un prefijo de `plugin` si el nombre del
comando no coincide con un comando de la aplicación o del `framework`. En el caso de que dos `plugins`
proporcionen un comando con el mismo nombre, el `plugin` que se ha cargado primero obtendrá el alias corto. Siempre
puedes utilizar el formato ``plugin.command`` para hacer referencia de manera inequívoca a un comando.


Aplicaciones de Consola
=======================

Por defecto, CakePHP descubrirá automáticamente todos los comandos en tu aplicación y sus complementos. Puede que
desees reducir el número de comandos expuestos al construir aplicaciones de consola independientes. Puedes utilizar
el método ``console()`` de tu clase ``Application`` para limitar qué comandos se exponen y renombrar los comandos que se exponen::

    // en src/Application.php
    namespace App;

    use App\Command\UserCommand;
    use App\Command\VersionCommand;
    use Cake\Console\CommandCollection;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function console(CommandCollection $commands): CommandCollection
        {
            // Agregar por clase
            $commands->add('user', UserCommand::class);

            // Agregar instancia
            $commands->add('version', new VersionCommand());

            return $commands;
        }
    }

En el ejemplo anterior, los únicos comandos disponibles serían ``help``, ``version`` y ``user``.
Revisa la sección :ref:`plugin-commands` sobre como agregar comandos en los `plugins`.

.. note::

    Cuando agregas múltiples comandos que usan la misma clase, el comando ``help`` mostrará la opción más corta.

.. _renaming-commands:
.. index:: nested commands, subcommands

Renombrando Comandos
====================

Hay casos en los cuales querrás renombrar comandos para crear comandos anidados o subcomandos. Mientras que
el descubrimiento automático de comandos no hará esto, tu pueds registrar tus comandos para darles el nombre
que desees.

Puedes personalizar los nombre de los comandos definiéndolo en tu método ``console()``::

    public function console(CommandCollection $commands): CommandCollection
    {
        // Agregar comandos anidados (subcomandos)
        $commands->add('user dump', UserDumpCommand::class);
        $commands->add('user:show', UserShowCommand::class);

        // Renombrar un comando completamente
        $commands->add('lazer', UserDeleteCommand::class);

        return $commands;
    }

Cuando utilizas el método ``console()`` en tu aplicación, recuerda llamar
``$commands->autoDiscover()`` para agregar los comandos de CakePHP, de tu aplicación y
de tus `plugins`.

Si necesitas renombrar/eliminar cualquier comando disponible, puedes usar el evento ``Console.buildCommands`` en
tu manejador de eventos para modificarlos.

Comandos
========

Echa un vistazo al capítulo :doc:`/console-commands/commands` sobre como crear tu primer
comando. Luego aprende más sobre comandos.

.. toctree::
    :maxdepth: 1

    console-commands/commands
    console-commands/input-output
    console-commands/option-parsers
    console-commands/cron-jobs

Comandos provistos por CakePHP
==============================

.. toctree::
    :maxdepth: 1

    console-commands/cache
    console-commands/completion
    console-commands/i18n
    console-commands/plugin
    console-commands/schema-cache
    console-commands/routes
    console-commands/server
    console-commands/repl

Enrutando en el ambiente de consola
===================================

In command-line interface (CLI), specifically your console commands,
``env('HTTP_HOST')`` and other webbrowser specific environment variables are not
set.

If you generate reports or send emails that make use of ``Router::url()`` those
will contain the default host ``http://localhost/``  and thus resulting in
invalid URLs. In this case you need to specify the domain manually.
You can do that using the Configure value ``App.fullBaseUrl`` from your
bootstrap or config, for example.

For sending emails, you should provide Email class with the host you want to
send the email with::

    use Cake\Mailer\Email;

    $email = new Email();
    $email->setDomain('www.example.org');

This asserts that the generated message IDs are valid and fit to the domain the
emails are sent from.


.. meta::
    :title lang=es: Comandos, Tareas & Herramientas de Consola
    :keywords lang=es: shell scripts,system shell,application classes,background tasks,line script,cron job,request response,system path,acl,new projects,commands,specifics,parameters,i18n,cakephp,directory,maintenance,ideal,applications,mvc
