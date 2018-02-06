Shell Helpers
#############

<<<<<<< HEAD
.. versionadded:: 3.1
    Shell Helpers were added in 3.1.0
=======
.. versionadded:: 2.8
    Shell Helpers were added in 2.8.0
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Shell Helpers let you package up complex output generation code. Shell
Helpers can be accessed and used from any shell or task::

    // Output some data as a table.
<<<<<<< HEAD
    $this->helper('Table')->output($data);
=======
    $this->helper('table')->output($data);
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Get a helper from a plugin.
    $this->helper('Plugin.HelperName')->output($data);

You can also get instances of helpers and call any public methods on them::

    // Get and use the Progress Helper.
    $progress = $this->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Creating Helpers
================

While CakePHP comes with a few shell helpers you can create more in your
application or plugins. As an example, we'll create a simple helper to generate
<<<<<<< HEAD
fancy headings. First create the **src/Shell/Helper/HeadingHelper.php** and put
the following in it::

    <?php
    namespace App\Shell\Helper;

    use Cake\Console\Helper;

    class HeadingHelper extends Helper
    {
        public function output($args)
        {
            $args += ['', '#', 3];
            $marker = str_repeat($args[1], $args[2]);
            $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
=======
fancy headings. First create the **app/Console/Helper/HeadingHelper.php** and put
the following in it::

    <?php
    App::uses("BaseShellHelper", "Console/Helper");

    class HeadingHelper extends BaseShellHelper
    {
        public function output($args)
        {
            $args += array('', '#', 3);
            $marker = str_repeat($args[1], $args[2]);
            $this->_consoleOutput->out($marker . ' ' . $args[0] . ' ' . $marker);
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        }
    }

We can then use this new helper in one of our shell commands by calling it::

    // With ### on either side
<<<<<<< HEAD
    $this->helper('Heading')->output(['It works!']);

    // With ~~~~ on either side
    $this->helper('Heading')->output(['It works!', '~', 4]);

Helpers generally implement the ``output()`` method which takes an array of
parameters. However, because Console Helpers are vanilla classes they can
implement additional methods that take any form of arguments.
=======
    $this->helper('heading')->output('It works!');

    // With ~~~~ on either side
    $this->helper('heading')->output('It works!', '~', 4);
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Built-In Helpers
================

Table Helper
------------

The TableHelper assists in making well formatted ASCII art tables. Using it is
pretty simple::

<<<<<<< HEAD
        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $this->helper('Table')->output($data);
=======
        $data = array(
            array('Header 1', 'Header', 'Long Header'),
            array('short', 'Longish thing', 'short'),
            array('Longer thing', 'short', 'Longest Value'),
        );
        $this->helper('table')->output($data);
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

        // Outputs
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Progress Helper
---------------

The ProgressHelper can be used in two different ways. The simple mode lets you
provide a callback that is invoked until the progress is complete::

<<<<<<< HEAD
    $this->helper('Progress')->output(['callback' => function ($progress) {
        // Do work here.
        $progress->increment(20);
        $progress->draw();
    }]);
=======
    $this->helper('progress')->output(function ($progress) {
        // Do work here.
        $progress->increment(20);
    });
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

You can control the progress bar more by providing additional options:

- ``total`` The total number of items in the progress bar. Defaults
  to 100.
- ``width`` The width of the progress bar. Defaults to 80.
- ``callback`` The callback that will be called in a loop to advance the
  progress bar.

An example of all the options in use would be::

<<<<<<< HEAD
    $this->helper('Progress')->output([
=======
    $this->helper('progress')->output(array(
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
<<<<<<< HEAD
            $progress->draw();
        }
    ]);
=======
        }
    ));
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

The progress helper can also be used manually to increment and re-render the
progress bar as necessary::

    $progress = $this->helper('Progress');
<<<<<<< HEAD
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();

=======
    $progress->init(array(
        'total' => 10,
        'width' => 20,
    ));

    $progress->increment(4);
    $progress->draw();
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
