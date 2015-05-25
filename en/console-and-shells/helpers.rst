Shell Helpers
#############

.. versionadded:: 3.1
    Shell Helpers were added in 3.1.0

Shell Helpers let you easily package up complex output generation code. Shell
Helpers can be accessed and used from any shell or task's ``_io`` property::

    // Output some data as a table.
    $this->_io->table($data);

The ``ConsoleIo`` object uses ``__call`` to invoke shell helpers located in your
app or in CakePHP. For plugin helpers, you'll need to use a slightly more
verbose syntax::

    $this->_io->helper('Plugin.HelperName')->output($data);

Using Helpers
=============

Creating Helpers
================


Table Helper
============

Progress Helper
===============
