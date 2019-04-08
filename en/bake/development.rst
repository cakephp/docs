Extending Bake
##############

Bake features an extensible architecture that allows your application or plugins
to modify or add-to the base functionality. Bake makes use of a dedicated
view class which uses the `Twig <https://twig.symfony.com/>`_ template engine.

Bake Events
===========

As a view class, ``BakeView`` emits the similar events to the standard view
classes, but prefixed with ``Bake.`` instead of ``View.``.

The ``Bake.initialize`` event can be used to make changes which apply to all baked
output, for example to add another helper to the bake view class this event can
be used::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\EventInterface;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.initialize', function (EventInterface $event) {
        $view = $event->getSubject();

        // In my bake templates, allow the use of the MySpecial helper
        $view->loadHelper('MySpecial', ['some' => 'config']);

        // And add an $author variable so it's always available
        $view->set('author', 'Andy');

    });

If you want to modify bake from within another plugin, putting your plugin's
bake events in the plugin ``config/bootstrap.php`` file is a good idea.

Bake events can be handy for making small changes to existing templates.
For example, to change the variable names used when baking controller/template
files one can use a function listening for ``Bake.beforeRender`` to modify the
variables used in the bake templates::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\EventInterface;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.beforeRender', function (EventInterface $event) {
        $view = $event->getSubject();

        // Use $rows for the main data variable in indexes
        if ($view->get('pluralName')) {
            $view->set('pluralName', 'rows');
        }
        if ($view->get('pluralVar')) {
            $view->set('pluralVar', 'rows');
        }

        // Use $theOne for the main data variable in view/edit
        if ($view->get('singularName')) {
            $view->set('singularName', 'theOne');
        }
        if ($view->get('singularVar')) {
            $view->set('singularVar', 'theOne');
        }

    });

You may also scope the ``Bake.beforeRender`` and ``Bake.afterRender`` events to
a specific generated file. For instance, if you want to add specific actions to
your UsersController when generating from a **Controller/controller.twig** file,
you can use the following event::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;
    use Cake\Utility\Hash;

    EventManager::instance()->on(
        'Bake.beforeRender.Controller.controller',
        function (EventInterface $event) {
            $view = $event->getSubject();
            if ($view->get('name') == 'Users') {
                // add the login and logout actions to the Users controller
                $view->set('actions', [
                    'login',
                    'logout',
                    'index',
                    'view',
                    'add',
                    'edit',
                    'delete'
                ]);
            }
        }
    );

By scoping event listeners to specific bake templates, you can simplify your
bake related event logic and provide callbacks that are easier to test.

Bake Template Syntax
====================

Bake template files use the `Twig <https://twig.symfony.com/doc/2.x/>`__ template syntax.

One way to see/understand how bake templates works, especially when attempting
to modify bake template files, is to bake a class and compare the template used
with the pre-processed template file which is left in the application's
**tmp/bake** folder.

So, for example, when baking a command like so:

.. code-block:: bash

    bin/cake bake command Foo

The template used (**vendor/cakephp/bake/templates/Bake/Command/command.twig**)
looks like this::

    <?php
    namespace {{ namespace }}\Shell;

    use Cake\Console\Arguments;
    use Cake\Console\Command;
    use Cake\Console\ConsoleIo;

    /**
     * {{ name }} command.
     */
    class {{ name }}Command extends Command
    {
        /**
         * Implement this method with your command's logic.
         *
         * @param \Cake\Console\Arguments $args The command arguments.
         * @param \Cake\Console\ConsoleIo $io The console io
         * @return null|int The exit code or null for success
         */
        public function execute(Arguments $args, ConsoleIo $io)
        {
        }
    }

.. _creating-a-bake-theme:

Creating a Bake Theme
=====================

If you wish to modify the output produced by the "bake" command, you can
create your own bake 'theme' which allows you to replace some or all of the
templates that bake uses. The best way to do this is:

#. Bake a new plugin. The name of the plugin is the bake 'theme' name
#. Create a new directory **plugins/[name]/templates/Bake/Template/**.
#. Copy any templates you want to override from
   **vendor/cakephp/bake/templates/Bake/Template** to matching files in your
   plugin.
#. When running bake use the ``--theme`` option to specify the bake-theme you
   want to use. To avoid having to specify this option in each call, you can also
   set your custom theme to be used as default theme::

        <?php
        // in config/bootstrap.php or config/bootstrap_cli.php
        Configure::write('Bake.theme', 'MyTheme');

Customizing the Bake Templates
==============================

If you wish to modify the default output produced by the "bake" command, you can
create your own bake templates in your application. This way does not use the
``--theme`` option in the command line when baking. The best way to do this is:

#. Create a new directory **/templates/Bake/**.
#. Copy any templates you want to override from
   **vendor/cakephp/bake/templates/Bake/** to matching files in your
   application.

Creating New Bake Command Options
=================================

It's possible to add new bake command options, or override the ones provided by
CakePHP by creating tasks in your application or plugins. By extending
``Bake\Command\BakeCommand`` or ``SimpleBakeCommand``, bake will find your new
task and include it as part of bake.

As an example, we'll make a task that creates an arbitrary foo class. First,
create the task file **src/Command/FooCommand.php**. We'll extend the
``SimpleBakeCommand`` for now as we don't need any logic to generate our code. ``SimpleBakeTask``
requires us to define 3 methods that tell bake what the task is
called, where the files it generates should go, and what template to use. Our
``FooCommand.php`` file should look like::

    <?php
    namespace App\Command;

    use Bake\Command\SimpleBakeCommand;

    class FooCommand extends SimpleBakeCommand
    {
        public $pathFragment = 'Foo/';

        public function name(): string
        {
            return 'foo';
        }

        public function fileName(string $name): string
        {
            return $name . 'Foo.php';
        }

        public function template(): string
        {
            return 'foo';
        }

    }

Once this file has been created, we need to create a template that bake can use
when generating code. Create **templates/Bake/foo.twig**. In this file we'll
add the following content::

    <?php
    namespace {{ namespace }}\Foo;

    /**
     * {{ name }} foo
     */
    class {{ name }}Foo
    {
        // Add code.
    }

You should now see your new task in the output of ``bin/cake bake``. You can
run your new task by running ``bin/cake bake foo Example``.
This will generate a new ``ExampleFoo`` class in **src/Foo/ExampleFoo.php**
for your application to use.

If you want the ``bake`` call to also create a test file for your
``ExampleFoo`` class, you need to overwrite the ``bakeTest()`` method in the
``FooCommand`` class to register the class suffix and namespace for your custom
command name::


    public function bakeTest(string $className, Arguments $args, ConsoleIo $io): void
    {
        if ($args->getOption('no-test')) {
            return;
        }
        $test = new \Bake\Command\TestCommand();
        $test->plugin = $this->plugin;

        $name = $this->name();
        if (!isset($test->classSuffixes[$name])) {
          $test->classSuffixes[$name] = 'Foo';
        }
        $title = ucfirst($name);
        if (!isset($test->classTypes[$title])) {
          $test->classTypes[$title] = 'Foo';
        }
        $test->bake($name, $className, $args, $io);

        return parent::bakeTest($className);
    }

* The **class suffix** will be appened to the name provided in your ``bake``
  call. In the previous example, it would create a ``ExampleFooTest.php`` file.
* The **class type** will be the sub-namespace used that will lead to your
  file (relative to the app or the plugin you are baking into). In the previous
  example, it would create your test with the namespace ``App\Test\TestCase\Foo``
  .

.. meta::
    :title lang=en: Extending Bake
    :keywords lang=en: command line interface,development,bake view, bake template syntax,twig,erb tags,percent tags

