Extending Bake
##############

Bake features an extensible architecture that allows your application or plugins to
easily modify or add-to the base functionality. Bake makes use of a dedicated view
class which does not use standard php suntax.

Bake Template syntax
====================

Bake template files use erb-style (``<% %>``) tags to denote template logic, and treat
everything else including php tags as plain text.

.. note::

    Bake template files do not use, and are insenstive to, ``asp_tags`` php ini setting.

One simple way to see/understand how bake templates works is to bake a class and compare
the template used with the pre-processed template file which is left in the application's
tmp folder.

So, for example, when baking a shell like so:

    bin/cake bake shell Foo

The template used (``vendor/cakephp/cakephp/src/Template/Bake/Shell/shell.ctp``)
looks like this:

    <?php
    namespace <%= $namespace %>\Shell;

    use Cake\Console\Shell;

    /**
    * <%= $name %> shell command.
    */
    class <%= $name %>Shell extends Shell {

    /**
    * main() method.
    *
    * @return bool|int Success or error code.
    */
        public function main() {
        }

    }

The pre-processed template file (``Bake-Shell-shell-ctp.php``), which is the file
actually rendered, looks like this:

    <CakePHPBakeOpenTagphp
    namespace <?= $namespace ?>\Shell;

    use Cake\Console\Shell;

    /**
    * <?= $name ?> shell command.
    */
    class <?= $name ?>Shell extends Shell {

    /**
    * main() method.
    *
    * @return bool|int Success or error code.
    */
        public function main() {
        }

    }

And the resultant baked class (``src/Shell/FooShell.php``) looks like this:

    <?php
    namespace App\Shell;

    use Cake\Console\Shell;

    /**
    * Foo shell command.
    */
    class FooShell extends Shell {

    /**
    * main() method.
    *
    * @return bool|int Success or error code.
    */
        public function main() {
        }

    }
In bake template files the following tags are defined:

``<%``
------

This is the basic open tag,

Changing bake's output
======================

If you wish to modify the default HTML output produced by the "bake" command, you can
create your own bake 'theme' which allows you to replace some or all of the templates
that bake uses. The best way to do this is:

#. Bake a new plugin. The name of the plugin is the bake 'theme' name
#. Create a new directory in ``plugin/[name]/src/Template/Bake``.
#. Copy any templates you want to override from
   ``vendor/cakephp/cakephp/src/Template/Bake``.  to matching
   directories in your application/plugin.
#. When running bake use the ``--theme`` option to specify the bake-theme you
   want to use.

Creating new bake options
=========================

It's possible to add new bake options, or override the ones provided by CakePHP
by creating tasks in your application or plugins. By extending
``Cake\Shell\Task\BakeTask``, bake will find your new task and include
it as part of bake.

As an example, we'll make a task that creates an arbitrary foo class. First, create
the task file ``src/Shell/Task/FooTask.php``. We'll extend the
``SimpleBakeTask`` for now as our shell task will be simple. ``SimpleBakeTask``
is abstract and requires us to define 4 methods that tell bake what the task is
called, where the files it generates should go, and what template to use. Our
FooTask.php file should look like::

    <?php
    namespace App\Shell\Task;

    use Cake\Shell\Task\SimpleBakeTask;

    class FooTask extends SimpleBakeTask {
        public $pathFragment = 'Foo/';

        public function name() {
            return 'shell';
        }

        public function fileName($name) {
            return $name . 'Foo.php';
        }

        public function template() {
            return 'foo';
        }

    }

Once this file has been created, we need to create a template that bake can use
when generating code. Create ``src/Template/Bake/foo.ctp``. In this file we'll
add the following content::

    <?php
    namespace <%= $namespace %>\Foo;

    /**
     * <%= $name %> foo
     */
    class <%= $name %>Foo {

        // Add code.
    }

You should now see your new task in the output of ``bin/cake bake``. You can
run your new task by running ``bin/cake bake foo Example``.
This will generate a new ``ExampleFoo`` class in ``src/Foo/ExampleFoo.php``
for your application to use.

.. meta::
    :title lang=en: Extending Bake
    :keywords lang=en: command line interface,development,bake view, bake template syntax,erb tags,asp tags,percent tags

