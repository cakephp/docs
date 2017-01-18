Shell Helpers
#############

.. versionadded:: 2.8
    Shell Helpers were added in 2.8.0

Shell Helpers let you package up complex output generation code. Shell
Helpers can be accessed and used from any shell or task::

    // Output some data as a table.
    $this->helper('table')->output($data);

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
        }
    }

We can then use this new helper in one of our shell commands by calling it::

    // With ### on either side
    $this->helper('heading')->output('It works!');

    // With ~~~~ on either side
    $this->helper('heading')->output('It works!', '~', 4);

Built-In Helpers
================

Table Helper
------------

The TableHelper assists in making well formatted ASCII art tables. Using it is
pretty simple::

        $data = array(
            array('Header 1', 'Header', 'Long Header'),
            array('short', 'Longish thing', 'short'),
            array('Longer thing', 'short', 'Longest Value'),
        );
        $this->helper('table')->output($data);

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

    $this->helper('progress')->output(function ($progress) {
        // Do work here.
        $progress->increment(20);
    });

You can control the progress bar more by providing additional options:

- ``total`` The total number of items in the progress bar. Defaults
  to 100.
- ``width`` The width of the progress bar. Defaults to 80.
- ``callback`` The callback that will be called in a loop to advance the
  progress bar.

An example of all the options in use would be::

    $this->helper('progress')->output(array(
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
        }
    ));

The progress helper can also be used manually to increment and re-render the
progress bar as necessary::

    $progress = $this->helper('Progress');
    $progress->init(array(
        'total' => 10,
        'width' => 20,
    ));

    $progress->increment(4);
    $progress->draw();
