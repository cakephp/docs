Extending Bake
##############

Bake features an extensible architecture that allows your application or plugins to
easily modify or add-to the base functionality.

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
    :keywords lang=en: command line interface,development,bake view, bake view syntax,erb tags,asp tags,percent tags

